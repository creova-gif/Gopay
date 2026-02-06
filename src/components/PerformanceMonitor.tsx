import { useState, useEffect } from 'react';
import { Activity, Zap, TrendingUp, TrendingDown, Database, Clock, Wifi, WifiOff } from 'lucide-react';

interface PerformanceMetrics {
  pageLoadTime: number;
  apiResponseTime: number;
  renderTime: number;
  memoryUsage: number;
  cacheHitRate: number;
  networkSpeed: string;
  isOnline: boolean;
}

interface ApiStats {
  totalRequests: number;
  avgDuration: number;
  slowRequests: number;
  cacheHits: number;
  cacheEntries: number;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    pageLoadTime: 0,
    apiResponseTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    cacheHitRate: 0,
    networkSpeed: '4G',
    isOnline: navigator.onLine,
  });
  
  const [apiStats, setApiStats] = useState<ApiStats | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem('perf-monitor-position');
    return saved ? JSON.parse(saved) : { x: window.innerWidth - 80, y: window.innerHeight - 80 };
  });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Measure page load performance
    if (performance && performance.timing) {
      const timing = performance.timing;
      const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
      setMetrics(prev => ({ ...prev, pageLoadTime }));
    }

    // Monitor network status
    const handleOnline = () => setMetrics(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setMetrics(prev => ({ ...prev, isOnline: false }));
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Detect network speed
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      const effectiveType = connection?.effectiveType || '4g';
      setMetrics(prev => ({ ...prev, networkSpeed: effectiveType.toUpperCase() }));
    }

    // Measure memory usage (if available)
    if ((performance as any).memory) {
      const memory = (performance as any).memory;
      const usedMemory = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      setMetrics(prev => ({ ...prev, memoryUsage: usedMemory }));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Keyboard shortcut to toggle performance monitor (Ctrl/Cmd + Shift + P)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Track API performance
  useEffect(() => {
    const trackApiCall = (url: string, duration: number) => {
      setMetrics(prev => ({ ...prev, apiResponseTime: duration }));
    };

    // Intercept fetch requests to track timing (client-side only)
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      try {
        const response = await originalFetch(...args);
        const duration = performance.now() - startTime;
        trackApiCall(args[0] as string, duration);
        return response;
      } catch (error) {
        const duration = performance.now() - startTime;
        trackApiCall(args[0] as string, duration);
        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  // Backend stats fetching disabled - not needed for demo mode
  // useEffect(() => {
  //   // Performance stats are tracked client-side only
  // }, []);

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Keep within viewport bounds
      const maxX = window.innerWidth - 60;
      const maxY = window.innerHeight - 60;
      
      const boundedX = Math.max(10, Math.min(newX, maxX));
      const boundedY = Math.max(10, Math.min(newY, maxY));
      
      setPosition({ x: boundedX, y: boundedY });
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        // Save position to localStorage
        localStorage.setItem('perf-monitor-position', JSON.stringify(position));
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, position]);

  if (!isVisible) {
    // Floating button to open monitor
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
        title="Performance Monitor (Ctrl+Shift+P)"
      >
        <Activity className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div
      className="fixed z-50 bg-gray-900 text-white rounded-lg shadow-2xl p-4 w-80 max-h-96 overflow-y-auto"
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-400" />
          <h3 className="font-semibold">Performance Monitor</h3>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Network Status */}
      <div className="mb-4 p-3 bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {metrics.isOnline ? (
              <Wifi className="w-4 h-4 text-green-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-400" />
            )}
            <span className="text-sm font-medium">
              {metrics.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          <span className="text-xs bg-gray-700 px-2 py-1 rounded">
            {metrics.networkSpeed}
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="space-y-3">
        {/* Page Load Time */}
        <MetricItem
          icon={<Zap className="w-4 h-4" />}
          label="Page Load"
          value={`${Math.round(metrics.pageLoadTime)}ms`}
          status={getLoadTimeStatus(metrics.pageLoadTime)}
        />

        {/* API Response Time */}
        <MetricItem
          icon={<Clock className="w-4 h-4" />}
          label="API Response"
          value={`${Math.round(metrics.apiResponseTime)}ms`}
          status={getApiTimeStatus(metrics.apiResponseTime)}
        />

        {/* Cache Hit Rate */}
        {apiStats && (
          <MetricItem
            icon={<Database className="w-4 h-4" />}
            label="Cache Hit Rate"
            value={`${Math.round(metrics.cacheHitRate)}%`}
            status={getCacheStatus(metrics.cacheHitRate)}
          />
        )}

        {/* Memory Usage */}
        {metrics.memoryUsage > 0 && (
          <MetricItem
            icon={<Activity className="w-4 h-4" />}
            label="Memory Usage"
            value={`${metrics.memoryUsage}MB`}
            status={getMemoryStatus(metrics.memoryUsage)}
          />
        )}
      </div>

      {/* Backend Stats */}
      {apiStats && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <h4 className="text-xs font-medium text-gray-400 mb-2">Backend Stats</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Requests:</span>
              <span className="font-mono">{apiStats.totalRequests.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Avg Duration:</span>
              <span className="font-mono">{Math.round(apiStats.avgDuration)}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Slow Requests:</span>
              <span className="font-mono">{apiStats.slowRequests}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Cache Entries:</span>
              <span className="font-mono">{apiStats.cacheEntries}</span>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Hint */}
      <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-500 text-center">
        Press <kbd className="px-1 bg-gray-800 rounded">Ctrl+Shift+P</kbd> to toggle
      </div>
    </div>
  );
}

interface MetricItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  status: 'good' | 'warning' | 'poor';
}

function MetricItem({ icon, label, value, status }: MetricItemProps) {
  const statusColors = {
    good: 'text-green-400',
    warning: 'text-yellow-400',
    poor: 'text-red-400',
  };

  const StatusIcon = status === 'good' ? TrendingUp : TrendingDown;

  return (
    <div className="flex items-center justify-between p-2 bg-gray-800 rounded">
      <div className="flex items-center gap-2">
        <span className={statusColors[status]}>{icon}</span>
        <span className="text-sm text-gray-300">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-mono font-medium">{value}</span>
        <StatusIcon className={`w-3 h-3 ${statusColors[status]}`} />
      </div>
    </div>
  );
}

// Helper functions to determine status
function getLoadTimeStatus(time: number): 'good' | 'warning' | 'poor' {
  if (time < 2000) return 'good';
  if (time < 5000) return 'warning';
  return 'poor';
}

function getApiTimeStatus(time: number): 'good' | 'warning' | 'poor' {
  if (time < 500) return 'good';
  if (time < 2000) return 'warning';
  return 'poor';
}

function getCacheStatus(rate: number): 'good' | 'warning' | 'poor' {
  if (rate > 70) return 'good';
  if (rate > 40) return 'warning';
  return 'poor';
}

function getMemoryStatus(usage: number): 'good' | 'warning' | 'poor' {
  if (usage < 50) return 'good';
  if (usage < 100) return 'warning';
  return 'poor';
}