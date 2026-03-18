/**
 * DARK MODE UTILITIES
 * 
 * Complete dark mode implementation with:
 * - Manual toggle
 * - Auto-switching based on time
 * - System preference detection
 * - Analytics tracking
 * 
 * @version 1.0.0
 */

import { useEffect, useState } from 'react';

// ════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════

export interface DarkModeConfig {
  enabled: boolean;
  auto: boolean;
  schedule: {
    darkStart: string; // 24h format: "18:00"
    lightStart: string; // 24h format: "06:00"
  };
  respectSystem: boolean;
}

export interface DarkModeState {
  isDark: boolean;
  isAuto: boolean;
  source: 'manual' | 'auto' | 'system';
}

// ════════════════════════════════════════════════════════════
// CONSTANTS
// ════════════════════════════════════════════════════════════

const DEFAULT_CONFIG: DarkModeConfig = {
  enabled: false,
  auto: true,
  schedule: {
    darkStart: '18:00', // 6 PM
    lightStart: '06:00'  // 6 AM
  },
  respectSystem: true
};

const STORAGE_KEYS = {
  config: 'dark_mode_config',
  manual: 'dark_mode_manual_override',
  lastToggle: 'dark_mode_last_toggle'
};

// ════════════════════════════════════════════════════════════
// HOOKS
// ════════════════════════════════════════════════════════════

/**
 * Main dark mode hook
 * 
 * @example
 * const { isDark, toggle, setAuto, source } = useDarkMode();
 */
export function useDarkMode() {
  const [state, setState] = useState<DarkModeState>(() => {
    const config = loadConfig();
    const isDark = determineInitialState(config);
    
    return {
      isDark,
      isAuto: config.auto,
      source: config.auto ? 'auto' : 'manual'
    };
  });
  
  // Apply dark mode class to document
  useEffect(() => {
    if (state.isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Track state change
    trackDarkModeChange(state);
  }, [state.isDark]);
  
  // Auto-switching based on time
  useEffect(() => {
    if (!state.isAuto) return;
    
    const checkTime = () => {
      const config = loadConfig();
      const shouldBeDark = isWithinDarkSchedule(config.schedule);
      
      if (shouldBeDark !== state.isDark) {
        setState(prev => ({
          ...prev,
          isDark: shouldBeDark,
          source: 'auto'
        }));
      }
    };
    
    // Check every minute
    const interval = setInterval(checkTime, 60 * 1000);
    
    return () => clearInterval(interval);
  }, [state.isAuto, state.isDark]);
  
  // Manual toggle
  const toggle = () => {
    setState(prev => ({
      isDark: !prev.isDark,
      isAuto: false,
      source: 'manual'
    }));
    
    // Save manual override
    const config = loadConfig();
    config.enabled = !state.isDark;
    config.auto = false;
    saveConfig(config);
    
    localStorage.setItem(STORAGE_KEYS.manual, Date.now().toString());
  };
  
  // Enable auto mode
  const setAuto = (enabled: boolean) => {
    const config = loadConfig();
    config.auto = enabled;
    saveConfig(config);
    
    if (enabled) {
      // Immediately check schedule
      const shouldBeDark = isWithinDarkSchedule(config.schedule);
      setState({
        isDark: shouldBeDark,
        isAuto: true,
        source: 'auto'
      });
      
      // Clear manual override
      localStorage.removeItem(STORAGE_KEYS.manual);
    } else {
      setState(prev => ({
        ...prev,
        isAuto: false,
        source: 'manual'
      }));
    }
  };
  
  // Update schedule
  const setSchedule = (schedule: { darkStart: string; lightStart: string }) => {
    const config = loadConfig();
    config.schedule = schedule;
    saveConfig(config);
    
    // Recheck if in auto mode
    if (state.isAuto) {
      const shouldBeDark = isWithinDarkSchedule(schedule);
      setState(prev => ({
        ...prev,
        isDark: shouldBeDark
      }));
    }
  };
  
  return {
    isDark: state.isDark,
    isAuto: state.isAuto,
    source: state.source,
    toggle,
    setAuto,
    setSchedule
  };
}

// ════════════════════════════════════════════════════════════
// UTILITIES
// ════════════════════════════════════════════════════════════

/**
 * Determine initial dark mode state
 */
function determineInitialState(config: DarkModeConfig): boolean {
  // Check manual override
  const manualOverride = localStorage.getItem(STORAGE_KEYS.manual);
  if (manualOverride) {
    const overrideTime = parseInt(manualOverride);
    const hoursSince = (Date.now() - overrideTime) / (1000 * 60 * 60);
    
    // Manual override expires after 24 hours
    if (hoursSince < 24) {
      return config.enabled;
    }
  }
  
  // Check auto mode
  if (config.auto) {
    return isWithinDarkSchedule(config.schedule);
  }
  
  // Check system preference
  if (config.respectSystem && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  
  return config.enabled;
}

/**
 * Check if current time is within dark mode schedule
 */
function isWithinDarkSchedule(schedule: { darkStart: string; lightStart: string }): boolean {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  const [darkHour, darkMin] = schedule.darkStart.split(':').map(Number);
  const darkStartMinutes = darkHour * 60 + darkMin;
  
  const [lightHour, lightMin] = schedule.lightStart.split(':').map(Number);
  const lightStartMinutes = lightHour * 60 + lightMin;
  
  if (darkStartMinutes < lightStartMinutes) {
    // Normal case: dark period doesn't cross midnight
    return currentMinutes >= darkStartMinutes && currentMinutes < lightStartMinutes;
  } else {
    // Dark period crosses midnight
    return currentMinutes >= darkStartMinutes || currentMinutes < lightStartMinutes;
  }
}

/**
 * Load dark mode config from storage
 */
function loadConfig(): DarkModeConfig {
  const stored = localStorage.getItem(STORAGE_KEYS.config);
  
  if (stored) {
    try {
      return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
    } catch (e) {
      return DEFAULT_CONFIG;
    }
  }
  
  return DEFAULT_CONFIG;
}

/**
 * Save dark mode config to storage
 */
function saveConfig(config: DarkModeConfig) {
  localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(config));
}

/**
 * Track dark mode change
 */
function trackDarkModeChange(state: DarkModeState) {
  const hour = new Date().getHours();
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`🌓 Dark Mode: ${state.isDark ? 'ON' : 'OFF'} (${state.source})`);
  }
  
  if (typeof window !== 'undefined' && (window as any).analytics) {
    (window as any).analytics.track('dark_mode_changed', {
      enabled: state.isDark,
      source: state.source,
      is_auto: state.isAuto,
      hour_of_day: hour,
      timestamp: new Date().toISOString()
    });
  }
}

// ════════════════════════════════════════════════════════════
// TAILWIND DARK MODE SETUP
// ════════════════════════════════════════════════════════════

/**
 * Add this to your tailwind.config.js:
 * 
 * module.exports = {
 *   darkMode: 'class', // Use 'dark' class strategy
 *   theme: {
 *     extend: {
 *       colors: {
 *         // Dark mode color palette
 *         dark: {
 *           bg: '#0F172A',      // slate-900
 *           surface: '#1E293B', // slate-800
 *           card: '#334155',    // slate-700
 *           border: '#475569',  // slate-600
 *           text: '#F1F5F9',    // slate-100
 *           muted: '#CBD5E1'    // slate-300
 *         }
 *       }
 *     }
 *   }
 * }
 */

// ════════════════════════════════════════════════════════════
// USAGE EXAMPLES
// ════════════════════════════════════════════════════════════

/**
 * Example 1: Basic Toggle
 * 
 * import { useDarkMode } from './utils/darkMode';
 * 
 * function App() {
 *   const { isDark, toggle } = useDarkMode();
 *   
 *   return (
 *     <div className={isDark ? 'dark' : ''}>
 *       <button onClick={toggle}>
 *         {isDark ? '☀️ Light' : '🌙 Dark'}
 *       </button>
 *     </div>
 *   );
 * }
 */

/**
 * Example 2: Settings Page
 * 
 * function DarkModeSettings() {
 *   const { isDark, isAuto, setAuto, setSchedule } = useDarkMode();
 *   
 *   return (
 *     <div>
 *       <label>
 *         <input
 *           type="checkbox"
 *           checked={isAuto}
 *           onChange={(e) => setAuto(e.target.checked)}
 *         />
 *         Auto dark mode (6pm-6am)
 *       </label>
 *       
 *       {isAuto && (
 *         <div>
 *           <input
 *             type="time"
 *             defaultValue="18:00"
 *             onChange={(e) => setSchedule({
 *               darkStart: e.target.value,
 *               lightStart: '06:00'
 *             })}
 *           />
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 */

/**
 * Example 3: Component Styling
 * 
 * function Card() {
 *   return (
 *     <div className="
 *       bg-white dark:bg-dark-surface
 *       text-gray-900 dark:text-dark-text
 *       border border-gray-200 dark:border-dark-border
 *       rounded-2xl p-6
 *     ">
 *       Content adapts to dark mode
 *     </div>
 *   );
 * }
 */

/**
 * Example 4: Gradient Adjustments
 * 
 * function HeroCard() {
 *   return (
 *     <div className="
 *       bg-gradient-to-br 
 *       from-emerald-600 to-green-600
 *       dark:from-emerald-700 dark:to-green-800
 *     ">
 *       Gradient adjusts for dark mode
 *     </div>
 *   );
 * }
 */

// ════════════════════════════════════════════════════════════
// ANALYTICS DASHBOARD QUERIES
// ════════════════════════════════════════════════════════════

/**
 * Key metrics to track:
 * 
 * 1. Adoption Rate:
 * SELECT 
 *   COUNT(DISTINCT user_id) FILTER (WHERE enabled = true) * 100.0 / 
 *   COUNT(DISTINCT user_id) as adoption_rate
 * FROM dark_mode_events
 * 
 * 2. Usage by Time:
 * SELECT 
 *   hour_of_day,
 *   COUNT(*) as toggles,
 *   AVG(CASE WHEN enabled THEN 1 ELSE 0 END) as dark_mode_rate
 * FROM dark_mode_events
 * GROUP BY hour_of_day
 * ORDER BY hour_of_day
 * 
 * 3. Auto vs Manual:
 * SELECT 
 *   source,
 *   COUNT(*) as count,
 *   AVG(session_duration) as avg_session
 * FROM dark_mode_events
 * GROUP BY source
 * 
 * 4. Session Impact:
 * SELECT
 *   enabled,
 *   AVG(session_duration_minutes) as avg_session,
 *   AVG(transactions_per_session) as avg_transactions
 * FROM sessions
 * GROUP BY enabled
 */
