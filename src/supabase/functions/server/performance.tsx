import { Hono } from 'npm:hono';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

const _supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
async function requireAuth(c: any): Promise<string | null> {
  const auth = c.req.header('Authorization');
  if (!auth) return null;
  const token = auth.split(' ')[1];
  const { data: { user }, error } = await _supabase.auth.getUser(token);
  if (error || !user) return null;
  return user.id;
}

// Performance Monitoring Service
interface PerformanceMetric {
  id: string;
  type: 'api' | 'page_load' | 'transaction' | 'render';
  endpoint?: string;
  duration: number;
  timestamp: string;
  userId?: string;
  metadata?: Record<string, any>;
}

interface CacheEntry {
  key: string;
  value: any;
  expiresAt: number;
  hits: number;
}

// In-memory cache for high-performance operations
const memoryCache = new Map<string, CacheEntry>();

// Cache configuration
export const CACHE_TTL = {
  short: 5 * 60 * 1000, // 5 minutes
  medium: 30 * 60 * 1000, // 30 minutes
  long: 24 * 60 * 60 * 1000, // 24 hours
};

/**
 * Cache Middleware - Add caching to any endpoint
 */
export function cacheMiddleware(ttl: number = CACHE_TTL.medium) {
  return async (c: any, next: any) => {
    const cacheKey = `cache:${c.req.url}:${c.req.header('Authorization') || 'public'}`;
    
    // Check memory cache first
    const cached = memoryCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      cached.hits++;
      c.header('X-Cache', 'HIT');
      c.header('X-Cache-Hits', cached.hits.toString());
      return c.json(cached.value);
    }

    // Execute request
    await next();
    
    // Cache successful responses
    if (c.res.status === 200) {
      try {
        const responseData = await c.res.clone().json();
        memoryCache.set(cacheKey, {
          key: cacheKey,
          value: responseData,
          expiresAt: Date.now() + ttl,
          hits: 0,
        });
        c.header('X-Cache', 'MISS');
      } catch (e) {
        // Response not JSON, skip caching
      }
    }
  };
}

/**
 * Performance Tracking Middleware
 */
export function performanceMiddleware() {
  return async (c: any, next: any) => {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    c.set('requestId', requestId);
    c.set('startTime', startTime);
    
    await next();
    
    const duration = Date.now() - startTime;
    
    // Log slow requests (>1 second)
    if (duration > 1000) {
      console.warn(`[SLOW REQUEST] ${c.req.method} ${c.req.url} - ${duration}ms`);
    }
    
    // Add performance headers
    c.header('X-Request-ID', requestId);
    c.header('X-Response-Time', `${duration}ms`);
    
    // Store performance metric (async, don't wait)
    trackPerformance({
      id: requestId,
      type: 'api',
      endpoint: c.req.url,
      duration,
      timestamp: new Date().toISOString(),
      userId: c.get('userId'),
      metadata: {
        method: c.req.method,
        statusCode: c.res.status,
      },
    }).catch(err => console.error('Failed to track performance:', err));
  };
}

/**
 * Track performance metric
 */
async function trackPerformance(metric: PerformanceMetric) {
  try {
    // Store in KV with time-series key for easy querying
    const date = new Date().toISOString().split('T')[0];
    const key = `perf:${date}:${metric.id}`;
    await kv.set(key, metric);
    
    // Update aggregated stats
    const statsKey = `perf:stats:${date}`;
    const stats = await kv.get(statsKey) || {
      totalRequests: 0,
      avgDuration: 0,
      slowRequests: 0,
      errors: 0,
    };
    
    stats.totalRequests++;
    stats.avgDuration = (stats.avgDuration * (stats.totalRequests - 1) + metric.duration) / stats.totalRequests;
    if (metric.duration > 1000) stats.slowRequests++;
    
    await kv.set(statsKey, stats);
  } catch (error) {
    console.error('Error tracking performance:', error);
  }
}

// Get performance stats
app.get('/stats', async (c) => {
  const uid = await requireAuth(c);
  if (!uid) return c.json({ error: 'Unauthorized' }, 401);
  try {
    const date = c.req.query('date') || new Date().toISOString().split('T')[0];
    const statsKey = `perf:stats:${date}`;
    const stats = await kv.get(statsKey) || {
      totalRequests: 0,
      avgDuration: 0,
      slowRequests: 0,
      errors: 0,
    };
    
    return c.json({
      date,
      ...stats,
      cacheStats: {
        entries: memoryCache.size,
        totalHits: Array.from(memoryCache.values()).reduce((sum, entry) => sum + entry.hits, 0),
      }
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Get performance metrics (time-series data)
app.get('/metrics', async (c) => {
  const uid = await requireAuth(c);
  if (!uid) return c.json({ error: 'Unauthorized' }, 401);
  try {
    const date = c.req.query('date') || new Date().toISOString().split('T')[0];
    const metrics = await kv.getByPrefix(`perf:${date}:`);
    
    return c.json({
      date,
      count: metrics.length,
      metrics: metrics.slice(0, 100), // Return last 100 metrics
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Clear cache (for specific keys or all)
app.post('/cache/clear', async (c) => {
  const uid = await requireAuth(c);
  if (!uid) return c.json({ error: 'Unauthorized' }, 401);
  try {
    const { pattern } = await c.req.json();
    
    if (pattern) {
      // Clear specific pattern
      let cleared = 0;
      for (const [key] of memoryCache.entries()) {
        if (key.includes(pattern)) {
          memoryCache.delete(key);
          cleared++;
        }
      }
      return c.json({ cleared, pattern });
    } else {
      // Clear all cache
      const size = memoryCache.size;
      memoryCache.clear();
      return c.json({ cleared: size });
    }
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Get cache stats
app.get('/cache/stats', async (c) => {
  const uid = await requireAuth(c);
  if (!uid) return c.json({ error: 'Unauthorized' }, 401);
  try {
    const entries = Array.from(memoryCache.entries()).map(([key, entry]) => ({
      key,
      hits: entry.hits,
      expiresIn: Math.max(0, entry.expiresAt - Date.now()),
    }));
    
    return c.json({
      totalEntries: memoryCache.size,
      entries: entries.sort((a, b) => b.hits - a.hits).slice(0, 20), // Top 20
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Track client-side performance metric
app.post('/track', async (c) => {
  const uid = await requireAuth(c);
  if (!uid) return c.json({ error: 'Unauthorized' }, 401);
  try {
    const metric: PerformanceMetric = await c.req.json();
    await trackPerformance(metric);
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Health check with performance info
app.get('/health', async (c) => {
  const uid = await requireAuth(c);
  if (!uid) return c.json({ error: 'Unauthorized' }, 401);
  const uptime = process.uptime ? process.uptime() : 0;
  const memoryUsage = Deno.memoryUsage ? Deno.memoryUsage() : { heapUsed: 0, heapTotal: 0 };
  
  return c.json({
    status: 'healthy',
    uptime,
    memory: {
      used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      unit: 'MB',
    },
    cache: {
      entries: memoryCache.size,
    },
    timestamp: new Date().toISOString(),
  });
});

// Cleanup expired cache entries (runs every 5 minutes)
setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [key, entry] of memoryCache.entries()) {
    if (entry.expiresAt < now) {
      memoryCache.delete(key);
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
    console.log(`[CACHE CLEANUP] Removed ${cleaned} expired entries`);
  }
}, 5 * 60 * 1000);

export default app;
