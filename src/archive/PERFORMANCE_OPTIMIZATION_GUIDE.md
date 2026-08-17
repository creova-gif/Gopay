# Performance Optimization Guide - goPay Tanzania

Optimize your app for Tanzania's network conditions and low-end devices.

---

## 📋 TABLE OF CONTENTS

1. [Network Optimization](#network-optimization)
2. [Code Splitting](#code-splitting)
3. [Caching Strategy](#caching-strategy)
4. [Image Optimization](#image-optimization)
5. [Rendering Performance](#rendering-performance)
6. [Memory Management](#memory-management)
7. [Offline-First Features](#offline-first-features)

---

## 🌐 NETWORK OPTIMIZATION

### **1. API Request Optimization**

```typescript
// /utils/optimized-api-client.ts

export class OptimizedApiClient extends ApiClient {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private pendingRequests = new Map<string, Promise<any>>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Deduplicate simultaneous requests
  async request(endpoint: string, options: RequestInit = {}) {
    const cacheKey = `${endpoint}:${JSON.stringify(options)}`;

    // Check cache first
    if (options.method === 'GET' || !options.method) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        console.log('📦 Returning cached data for:', endpoint);
        return cached.data;
      }
    }

    // Check for pending request
    if (this.pendingRequests.has(cacheKey)) {
      console.log('⏳ Waiting for pending request:', endpoint);
      return this.pendingRequests.get(cacheKey);
    }

    // Make new request
    const requestPromise = super.request(endpoint, options)
      .then(data => {
        // Cache GET requests
        if (options.method === 'GET' || !options.method) {
          this.cache.set(cacheKey, { data, timestamp: Date.now() });
        }
        this.pendingRequests.delete(cacheKey);
        return data;
      })
      .catch(error => {
        this.pendingRequests.delete(cacheKey);
        throw error;
      });

    this.pendingRequests.set(cacheKey, requestPromise);
    return requestPromise;
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Prefetch data
  async prefetch(endpoints: string[]) {
    const promises = endpoints.map(endpoint => 
      this.request(endpoint).catch(err => {
        console.warn('Prefetch failed for', endpoint, err);
      })
    );
    await Promise.all(promises);
  }
}
```

### **2. Request Batching**

```typescript
// Batch multiple API calls
export class BatchedApiClient extends OptimizedApiClient {
  private batchQueue: Array<{ endpoint: string; resolve: any; reject: any }> = [];
  private batchTimeout: any = null;

  async batchRequest(endpoint: string) {
    return new Promise((resolve, reject) => {
      this.batchQueue.push({ endpoint, resolve, reject });

      if (!this.batchTimeout) {
        this.batchTimeout = setTimeout(() => {
          this.processBatch();
        }, 50); // Wait 50ms to collect more requests
      }
    });
  }

  private async processBatch() {
    const batch = [...this.batchQueue];
    this.batchQueue = [];
    this.batchTimeout = null;

    if (batch.length === 0) return;

    console.log(`🔄 Processing batch of ${batch.length} requests`);

    // Group by endpoint
    const groups = batch.reduce((acc, item) => {
      if (!acc[item.endpoint]) acc[item.endpoint] = [];
      acc[item.endpoint].push(item);
      return acc;
    }, {} as Record<string, typeof batch>);

    // Process each group
    for (const [endpoint, items] of Object.entries(groups)) {
      try {
        const data = await this.request(endpoint);
        items.forEach(item => item.resolve(data));
      } catch (error) {
        items.forEach(item => item.reject(error));
      }
    }
  }
}
```

### **3. Retry Logic with Exponential Backoff**

```typescript
// /utils/retry-fetch.ts

export async function retryFetch(
  url: string,
  options: RequestInit,
  maxRetries = 3
) {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(10000), // 10s timeout
      });

      if (response.ok) return response;

      // Don't retry 4xx errors
      if (response.status >= 400 && response.status < 500) {
        throw new Error(`Client error: ${response.status}`);
      }

      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
      
      // Don't retry on abort
      if (error.name === 'AbortError') {
        throw error;
      }

      // Exponential backoff
      const delay = Math.min(1000 * Math.pow(2, i), 10000);
      console.log(`🔄 Retry ${i + 1}/${maxRetries} in ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
```

---

## 📦 CODE SPLITTING

### **1. Lazy Load Components**

```typescript
// In App.tsx or Dashboard.tsx

import { lazy, Suspense } from 'react';
import { LoadingState } from './components/ErrorStateComponents';

// Lazy load heavy components
const RewardsScreenOptimized = lazy(() => 
  import('./components/RewardsScreenOptimized').then(m => ({ default: m.RewardsScreenOptimized }))
);

const FinanceScreenOptimized = lazy(() => 
  import('./components/FinanceScreenOptimized').then(m => ({ default: m.FinanceScreenOptimized }))
);

const MerchantQRPaymentOptimized = lazy(() => 
  import('./components/MerchantQRPaymentOptimized').then(m => ({ default: m.MerchantQRPaymentOptimized }))
);

// Use with Suspense
{currentPage === 'rewards' && (
  <Suspense fallback={<LoadingState message="Loading rewards..." />}>
    <RewardsScreenOptimized onNavigate={handleNavigate} />
  </Suspense>
)}
```

### **2. Route-Based Code Splitting**

```typescript
// Create a route loader

const routes = {
  home: () => import('./components/Home'),
  rewards: () => import('./components/RewardsScreenOptimized'),
  finance: () => import('./components/FinanceScreenOptimized'),
  'transaction-history': () => import('./components/TransactionHistoryOptimized'),
  // ... etc
};

const RouteLoader = ({ page }: { page: string }) => {
  const [Component, setComponent] = useState(null);

  useEffect(() => {
    routes[page]?.()
      .then(module => setComponent(() => module.default))
      .catch(err => console.error('Failed to load route:', err));
  }, [page]);

  if (!Component) return <LoadingState />;

  return <Component />;
};
```

---

## 💾 CACHING STRATEGY

### **1. IndexedDB for Offline Storage**

```typescript
// /utils/offline-storage.ts

class OfflineStorage {
  private dbName = 'goPay';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create stores
        if (!db.objectStoreNames.contains('transactions')) {
          db.createObjectStore('transactions', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('profile')) {
          db.createObjectStore('profile', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache', { keyPath: 'key' });
        }
      };
    });
  }

  async set(storeName: string, data: any) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async get(storeName: string, key: any) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll(storeName: string) {
    if (!this.db) await this.init();

    return new Promise<any[]>((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async clear(storeName: string) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

export const offlineStorage = new OfflineStorage();
```

### **2. Smart Caching Hook**

```typescript
// /hooks/useSmartCache.ts

import { useState, useEffect } from 'react';
import { offlineStorage } from '../utils/offline-storage';

export function useSmartCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options = { ttl: 5 * 60 * 1000 } // 5 minutes
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadData();
  }, [key]);

  const loadData = async () => {
    try {
      // Try cache first
      const cached = await offlineStorage.get('cache', key);
      
      if (cached && Date.now() - cached.timestamp < options.ttl) {
        console.log('📦 Using cached data for:', key);
        setData(cached.data);
        setLoading(false);
        return;
      }

      // Fetch fresh data
      console.log('🌐 Fetching fresh data for:', key);
      const freshData = await fetcher();
      
      // Update state
      setData(freshData);
      
      // Cache it
      await offlineStorage.set('cache', {
        key,
        data: freshData,
        timestamp: Date.now(),
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError(err as Error);
      setLoading(false);
      
      // Try to use stale cache if online fetch failed
      const cached = await offlineStorage.get('cache', key);
      if (cached) {
        console.log('📦 Using stale cache due to error');
        setData(cached.data);
      }
    }
  };

  return { data, loading, error, refetch: loadData };
}

// Usage
const { data: transactions, loading, error } = useSmartCache(
  'user-transactions',
  () => api.getTransactions(),
  { ttl: 60000 } // 1 minute
);
```

---

## 🖼️ IMAGE OPTIMIZATION

### **1. Lazy Loading Images**

```typescript
// /components/LazyImage.tsx

export function LazyImage({ 
  src, 
  alt, 
  className,
  placeholder = '/placeholder.png' 
}: {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const img = imgRef.current;
          if (img && img.dataset.src) {
            img.src = img.dataset.src;
            observer.disconnect();
          }
        }
      },
      { rootMargin: '50px' } // Start loading 50px before visible
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`relative ${className}`}>
      <img
        ref={imgRef}
        data-src={src}
        src={placeholder}
        alt={alt}
        className={`transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-50'
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
}
```

### **2. Progressive Image Loading**

Use BlurHash or low-quality placeholders for better perceived performance.

---

## ⚡ RENDERING PERFORMANCE

### **1. Memoization**

```typescript
import { memo, useMemo, useCallback } from 'react';

// Memoize expensive components
export const TransactionItem = memo(({ transaction, onClick }: Props) => {
  return (
    <div onClick={onClick}>
      {/* component content */}
    </div>
  );
}, (prev, next) => {
  // Custom comparison
  return prev.transaction.id === next.transaction.id;
});

// Memoize expensive calculations
function TransactionList({ transactions }: Props) {
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [transactions]);

  const handleClick = useCallback((id: string) => {
    // handle click
  }, []);

  return (
    <div>
      {sortedTransactions.map(txn => (
        <TransactionItem 
          key={txn.id} 
          transaction={txn} 
          onClick={() => handleClick(txn.id)} 
        />
      ))}
    </div>
  );
}
```

### **2. Virtual Scrolling for Long Lists**

```typescript
// Install: npm install react-window

import { FixedSizeList } from 'react-window';

function VirtualTransactionList({ transactions }: Props) {
  const Row = ({ index, style }: any) => (
    <div style={style}>
      <TransactionItem transaction={transactions[index]} />
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={transactions.length}
      itemSize={80}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

### **3. Debounce Search**

```typescript
import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Usage
function SearchableList() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (debouncedQuery) {
      // Perform search
      performSearch(debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  );
}
```

---

## 🧠 MEMORY MANAGEMENT

### **1. Clean Up Effects**

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    // Do something
  }, 1000);

  // Clean up
  return () => clearInterval(interval);
}, []);

useEffect(() => {
  const controller = new AbortController();

  fetch(url, { signal: controller.signal })
    .then(handleResponse)
    .catch(handleError);

  // Clean up
  return () => controller.abort();
}, [url]);
```

### **2. Limit Stored Data**

```typescript
// Keep only last 100 transactions in memory
const [transactions, setTransactions] = useState<Transaction[]>([]);

const addTransaction = (newTxn: Transaction) => {
  setTransactions(prev => [newTxn, ...prev].slice(0, 100));
};
```

---

## 📴 OFFLINE-FIRST FEATURES

### **1. Service Worker (Optional)**

```typescript
// public/sw.js

const CACHE_NAME = 'gopay-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles/globals.css',
  // Add critical assets
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

### **2. Offline Queue for Actions**

```typescript
// /utils/offline-queue.ts

class OfflineQueue {
  private queue: Array<{ action: string; data: any; timestamp: number }> = [];

  add(action: string, data: any) {
    this.queue.push({
      action,
      data,
      timestamp: Date.now(),
    });
    
    localStorage.setItem('offline-queue', JSON.stringify(this.queue));
    console.log('📥 Queued offline action:', action);
  }

  async process(api: ApiClient) {
    const queue = [...this.queue];
    this.queue = [];

    for (const item of queue) {
      try {
        console.log('⬆️ Processing offline action:', item.action);
        
        if (item.action === 'send-money') {
          await api.sendMoney(item.data.recipient, item.data.amount, item.data.pin);
        }
        // Handle other actions...
        
      } catch (error) {
        console.error('Failed to process offline action:', error);
        // Re-queue if failed
        this.queue.push(item);
      }
    }

    localStorage.setItem('offline-queue', JSON.stringify(this.queue));
  }

  load() {
    const stored = localStorage.getItem('offline-queue');
    if (stored) {
      this.queue = JSON.parse(stored);
    }
  }
}

export const offlineQueue = new OfflineQueue();

// Use when app comes online
window.addEventListener('online', () => {
  console.log('🌐 Back online! Processing queued actions...');
  const api = new ApiClient(accessToken);
  offlineQueue.process(api);
});
```

---

## 📊 PERFORMANCE MONITORING

```typescript
// /utils/performance-monitor.ts

export class PerformanceMonitor {
  static markStart(label: string) {
    performance.mark(`${label}-start`);
  }

  static markEnd(label: string) {
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);
    
    const measure = performance.getEntriesByName(label)[0];
    console.log(`⏱️ ${label}: ${measure.duration.toFixed(2)}ms`);
    
    // Send to analytics if needed
    // analytics.track('performance', { label, duration: measure.duration });
    
    // Clean up
    performance.clearMarks(`${label}-start`);
    performance.clearMarks(`${label}-end`);
    performance.clearMeasures(label);
  }
}

// Usage
PerformanceMonitor.markStart('load-transactions');
const transactions = await api.getTransactions();
PerformanceMonitor.markEnd('load-transactions');
```

---

## ✅ PERFORMANCE CHECKLIST

- [ ] API requests cached (5-minute TTL)
- [ ] Images lazy loaded
- [ ] Components code-split
- [ ] Long lists virtualized
- [ ] Search debounced (300ms)
- [ ] Offline storage implemented
- [ ] Memory leaks checked
- [ ] Bundle size optimized (<500KB gzipped)
- [ ] First Contentful Paint <2s
- [ ] Time to Interactive <5s

---

**Your app is now optimized for Tanzania's network conditions!** ⚡🇹🇿
