/**
 * LIVE DASHBOARD SYSTEM
 * 
 * PRINCIPLES (from Revolut, PayPal, Grab):
 * 1. Show WHEN data was last updated
 * 2. Use skeletons for loading (never blank screens)
 * 3. Cache data + show freshness indicator
 * 4. Pulsing indicators for "live" status
 * 5. Graceful degradation (offline → cached → live)
 * 
 * STATES:
 * - Loading (skeleton)
 * - Cached (show age + refresh option)
 * - Live (pulsing green indicator)
 * - Error (show retry option)
 * - Offline (show last cached data)
 */

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Wifi, WifiOff, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { relativeTime } from '../utils/language-system';
import { BilingualText } from './BilingualUI';

// ════════════════════════════════════════════════════════════
// DATA FRESHNESS SYSTEM
// ════════════════════════════════════════════════════════════

export type DataState = 'loading' | 'live' | 'cached' | 'stale' | 'error' | 'offline';

interface DataMeta {
  state: DataState;
  lastFetch: Date | null;
  nextRefresh?: Date;
  cacheAge?: number; // milliseconds
  error?: string;
}

// Fresh data: < 30 seconds
// Cached data: 30 sec - 5 min
// Stale data: > 5 min
const FRESH_THRESHOLD = 30 * 1000; // 30 seconds
const STALE_THRESHOLD = 5 * 60 * 1000; // 5 minutes

export function getDataState(lastFetch: Date | null, isOnline: boolean): DataState {
  if (!isOnline) return 'offline';
  if (!lastFetch) return 'loading';
  
  const age = Date.now() - lastFetch.getTime();
  
  if (age < FRESH_THRESHOLD) return 'live';
  if (age < STALE_THRESHOLD) return 'cached';
  return 'stale';
}

// ════════════════════════════════════════════════════════════
// FRESHNESS INDICATOR COMPONENT
// ════════════════════════════════════════════════════════════

interface FreshnessIndicatorProps {
  lastUpdated: Date | null;
  state: DataState;
  onRefresh?: () => void;
  className?: string;
}

export function FreshnessIndicator({ 
  lastUpdated, 
  state, 
  onRefresh,
  className 
}: FreshnessIndicatorProps) {
  const [, setTick] = useState(0);
  
  // Update every minute to show relative time
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 60000); // 1 minute
    
    return () => clearInterval(interval);
  }, []);
  
  const getIndicator = () => {
    switch (state) {
      case 'live':
        return (
          <div className="flex items-center gap-1.5 text-xs text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="font-semibold">Imesasishwa sasa hivi</span>
            <span className="text-gray-500">• Updated just now</span>
          </div>
        );
      
      case 'cached':
        const rel = lastUpdated ? relativeTime(lastUpdated) : null;
        return (
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Clock className="w-3 h-3" />
            <span>{rel?.sw || 'Imehifadhiwa'}</span>
            <span className="text-gray-500">• {rel?.en || 'Cached'}</span>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="ml-2 text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                Sasisha • Refresh
              </button>
            )}
          </div>
        );
      
      case 'stale':
        return (
          <div className="flex items-center gap-1.5 text-xs text-orange-600">
            <AlertCircle className="w-3 h-3" />
            <span className="font-semibold">Data ya zamani</span>
            <span className="text-gray-500">• Outdated</span>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="ml-2 text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Sasisha
              </button>
            )}
          </div>
        );
      
      case 'offline':
        return (
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <WifiOff className="w-3 h-3" />
            <span className="font-semibold">Nje ya mtandao</span>
            <span className="text-gray-500">• Offline</span>
          </div>
        );
      
      case 'error':
        return (
          <div className="flex items-center gap-1.5 text-xs text-red-600">
            <AlertCircle className="w-3 h-3" />
            <span className="font-semibold">Hitilafu</span>
            <span className="text-gray-500">• Error</span>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="ml-2 text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                Jaribu tena • Retry
              </button>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className={className}>
      {getIndicator()}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// LIVE BALANCE CARD (Example Usage)
// ════════════════════════════════════════════════════════════

interface LiveBalanceCardProps {
  balance: number | null;
  loading: boolean;
  lastUpdated: Date | null;
  onRefresh: () => void;
  onToggleVisibility: () => void;
  visible: boolean;
}

export function LiveBalanceCard({ 
  balance, 
  loading, 
  lastUpdated, 
  onRefresh,
  onToggleVisibility,
  visible 
}: LiveBalanceCardProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const state = loading ? 'loading' : getDataState(lastUpdated, isOnline);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sw-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-3xl p-5 shadow-2xl">
      <div className="flex items-center justify-between mb-3">
        <BilingualText
          sw="Salio Kuu"
          en="Main Balance"
          swClassName="text-sm font-semibold text-white"
          enClassName="text-xs text-white/70"
        />
        
        <button
          onClick={onToggleVisibility}
          className="size-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
        >
          {visible ? '👁️' : '🙈'}
        </button>
      </div>
      
      {/* Balance Amount */}
      <div className="mb-4">
        {loading ? (
          <div className="h-12 bg-white/20 rounded-xl animate-pulse" />
        ) : balance !== null ? (
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-white/80">TZS</span>
            <span className="text-4xl font-black text-white tabular-nums tracking-tight">
              {visible ? formatCurrency(balance).replace('TZS', '').trim() : '••••••'}
            </span>
          </div>
        ) : (
          <div className="text-white text-sm">
            Salio halipatikani • Balance unavailable
          </div>
        )}
      </div>
      
      {/* Freshness Indicator */}
      <FreshnessIndicator
        lastUpdated={lastUpdated}
        state={state}
        onRefresh={onRefresh}
        className="text-white"
      />
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// SKELETON LOADERS (Graceful loading states)
// ════════════════════════════════════════════════════════════

export function TransactionSkeleton() {
  return (
    <div className="p-4 flex items-center gap-3 animate-pulse">
      <div className="w-10 h-10 bg-gray-200 rounded-xl" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
      <div className="w-20 h-4 bg-gray-200 rounded" />
    </div>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="p-4 bg-white rounded-2xl border border-gray-200 animate-pulse">
      <div className="w-12 h-12 bg-gray-200 rounded-xl mb-3" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
  );
}

export function BalanceSkeleton() {
  return (
    <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-5 animate-pulse">
      <div className="h-4 bg-white/20 rounded w-1/3 mb-4" />
      <div className="h-10 bg-white/20 rounded w-2/3" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// AUTO-REFRESH HOOK (Smart refresh logic)
// ════════════════════════════════════════════════════════════

interface UseAutoRefreshOptions {
  interval?: number; // milliseconds
  enabled?: boolean;
  onlyWhenVisible?: boolean; // Only refresh when tab is visible
}

export function useAutoRefresh(
  fetchFn: () => Promise<void>,
  options: UseAutoRefreshOptions = {}
) {
  const {
    interval = 60000, // 1 minute default
    enabled = true,
    onlyWhenVisible = true
  } = options;
  
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const refresh = useCallback(async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await fetchFn();
      setLastFetch(new Date());
    } catch (error) {
      console.error('Auto-refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchFn, isRefreshing]);
  
  useEffect(() => {
    if (!enabled) return;
    
    const shouldRefresh = () => {
      if (onlyWhenVisible && document.hidden) return false;
      return true;
    };
    
    const intervalId = setInterval(() => {
      if (shouldRefresh()) {
        refresh();
      }
    }, interval);
    
    // Initial fetch
    if (!lastFetch) {
      refresh();
    }
    
    return () => clearInterval(intervalId);
  }, [enabled, interval, onlyWhenVisible, refresh, lastFetch]);
  
  return { lastFetch, isRefreshing, refresh };
}

// ════════════════════════════════════════════════════════════
// NETWORK STATUS INDICATOR (Always visible)
// ════════════════════════════════════════════════════════════

export function NetworkStatusIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineToast, setShowOfflineToast] = useState(false);
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineToast(false);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineToast(true);
      
      // Auto-hide after 5 seconds
      setTimeout(() => setShowOfflineToast(false), 5000);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  if (!showOfflineToast && isOnline) return null;
  
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top">
      <div className={`px-6 py-3 rounded-full shadow-xl flex items-center gap-3 ${
        isOnline 
          ? 'bg-green-600 text-white' 
          : 'bg-gray-900 text-white'
      }`}>
        {isOnline ? (
          <>
            <CheckCircle className="w-5 h-5" />
            <div>
              <p className="font-bold text-sm">Umeunganishwa tena</p>
              <p className="text-xs opacity-90">Back online</p>
            </div>
          </>
        ) : (
          <>
            <WifiOff className="w-5 h-5" />
            <div>
              <p className="font-bold text-sm">Hakuna mtandao</p>
              <p className="text-xs opacity-90">No internet connection</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// USAGE EXAMPLE (Complete Dashboard)
// ════════════════════════════════════════════════════════════

export function LiveDashboardExample() {
  const [balance, setBalance] = useState<number | null>(null);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  
  const fetchBalance = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBalance(450000);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const { lastFetch, refresh } = useAutoRefresh(fetchBalance, {
    interval: 60000, // Refresh every minute
    enabled: true,
    onlyWhenVisible: true
  });
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NetworkStatusIndicator />
      
      <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 p-6">
        <LiveBalanceCard
          balance={balance}
          loading={loading}
          lastUpdated={lastFetch}
          onRefresh={refresh}
          onToggleVisibility={() => setBalanceVisible(!balanceVisible)}
          visible={balanceVisible}
        />
      </div>
      
      <div className="p-6">
        <h2 className="text-lg font-black mb-4">Shughuli za Hivi Karibuni • Recent Activity</h2>
        
        {loading ? (
          <>
            <TransactionSkeleton />
            <TransactionSkeleton />
            <TransactionSkeleton />
          </>
        ) : (
          <div className="bg-white rounded-2xl divide-y divide-gray-100">
            {/* Transaction items would go here */}
            <div className="p-4">Transaction 1</div>
            <div className="p-4">Transaction 2</div>
          </div>
        )}
      </div>
    </div>
  );
}
