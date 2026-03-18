/**
 * A/B TESTING UTILITIES
 * 
 * Simple client-side A/B testing for rapid iteration.
 * Tracks variant assignments and metrics.
 * 
 * @version 1.0.0
 */

import { useEffect, useState } from 'react';

// ════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════

export interface ABTest {
  id: string;
  name: string;
  variants: {
    control: string;
    treatment: string;
  };
  allocation: {
    control: number; // 0-100
    treatment: number; // 0-100
  };
  enabled: boolean;
}

export interface ABTestAssignment {
  testId: string;
  variant: 'control' | 'treatment';
  assignedAt: Date;
}

// ════════════════════════════════════════════════════════════
// ACTIVE TESTS
// ════════════════════════════════════════════════════════════

export const ACTIVE_TESTS: Record<string, ABTest> = {
  language: {
    id: 'language_swahili_vs_english',
    name: 'Swahili vs English Default',
    variants: {
      control: 'en',
      treatment: 'sw'
    },
    allocation: {
      control: 50,
      treatment: 50
    },
    enabled: true
  },
  
  darkMode: {
    id: 'dark_mode_adoption',
    name: 'Dark Mode Feature Test',
    variants: {
      control: 'no_dark_mode',
      treatment: 'dark_mode_available'
    },
    allocation: {
      control: 0, // Show to 100%
      treatment: 100
    },
    enabled: true
  },
  
  featuredService: {
    id: 'featured_service_rotation',
    name: 'Featured Service Rotation vs Static',
    variants: {
      control: 'static_sgr',
      treatment: 'rotating_featured'
    },
    allocation: {
      control: 50,
      treatment: 50
    },
    enabled: true
  }
};

// ════════════════════════════════════════════════════════════
// HOOKS
// ════════════════════════════════════════════════════════════

/**
 * Hook to get assigned variant for a test
 * 
 * @example
 * const language = useABTest('language', 'sw');
 * // Returns 'en' or 'sw' based on assignment
 */
export function useABTest(
  testId: string,
  defaultValue: any
): any {
  const [variant, setVariant] = useState(defaultValue);
  
  useEffect(() => {
    const test = ACTIVE_TESTS[testId];
    if (!test || !test.enabled) {
      setVariant(defaultValue);
      return;
    }
    
    // Check if already assigned
    const storageKey = `ab_test_${testId}`;
    const existing = localStorage.getItem(storageKey);
    
    if (existing) {
      const assignment: ABTestAssignment = JSON.parse(existing);
      const value = assignment.variant === 'control' 
        ? test.variants.control 
        : test.variants.treatment;
      setVariant(value);
      return;
    }
    
    // New assignment
    const random = Math.random() * 100;
    const isControl = random < test.allocation.control;
    const assignedVariant = isControl ? 'control' : 'treatment';
    
    const assignment: ABTestAssignment = {
      testId: test.id,
      variant: assignedVariant,
      assignedAt: new Date()
    };
    
    localStorage.setItem(storageKey, JSON.stringify(assignment));
    
    const value = assignedVariant === 'control'
      ? test.variants.control
      : test.variants.treatment;
    
    setVariant(value);
    
    // Track assignment
    trackABTestAssignment(test.id, assignedVariant);
    
  }, [testId, defaultValue]);
  
  return variant;
}

/**
 * Hook to check if user is in treatment group
 * 
 * @example
 * const showDarkMode = useABTreatment('darkMode');
 */
export function useABTreatment(testId: string): boolean {
  const [isTreatment, setIsTreatment] = useState(false);
  
  useEffect(() => {
    const test = ACTIVE_TESTS[testId];
    if (!test || !test.enabled) {
      setIsTreatment(false);
      return;
    }
    
    const storageKey = `ab_test_${testId}`;
    const existing = localStorage.getItem(storageKey);
    
    if (existing) {
      const assignment: ABTestAssignment = JSON.parse(existing);
      setIsTreatment(assignment.variant === 'treatment');
    } else {
      // Assign new
      const random = Math.random() * 100;
      const isControl = random < test.allocation.control;
      const variant = isControl ? 'control' : 'treatment';
      
      const assignment: ABTestAssignment = {
        testId: test.id,
        variant,
        assignedAt: new Date()
      };
      
      localStorage.setItem(storageKey, JSON.stringify(assignment));
      setIsTreatment(variant === 'treatment');
      
      trackABTestAssignment(test.id, variant);
    }
  }, [testId]);
  
  return isTreatment;
}

// ════════════════════════════════════════════════════════════
// TRACKING
// ════════════════════════════════════════════════════════════

/**
 * Track A/B test assignment
 */
function trackABTestAssignment(testId: string, variant: string) {
  // Log to console in dev
  if (process.env.NODE_ENV === 'development') {
    console.log(`📊 A/B Test Assigned: ${testId} → ${variant}`);
  }
  
  // Send to analytics
  if (typeof window !== 'undefined' && (window as any).analytics) {
    (window as any).analytics.track('ab_test_assigned', {
      test_id: testId,
      variant: variant,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Track A/B test metric
 * 
 * @example
 * trackABMetric('language', 'transaction_completed', { amount: 50000 });
 */
export function trackABMetric(
  testId: string,
  metricName: string,
  properties: Record<string, any> = {}
) {
  const storageKey = `ab_test_${testId}`;
  const assignment = localStorage.getItem(storageKey);
  
  if (!assignment) return;
  
  const { variant } = JSON.parse(assignment);
  
  // Log to console in dev
  if (process.env.NODE_ENV === 'development') {
    console.log(`📊 A/B Metric: ${testId} (${variant}) → ${metricName}`, properties);
  }
  
  // Send to analytics
  if (typeof window !== 'undefined' && (window as any).analytics) {
    (window as any).analytics.track('ab_test_metric', {
      test_id: testId,
      variant: variant,
      metric_name: metricName,
      ...properties,
      timestamp: new Date().toISOString()
    });
  }
}

// ════════════════════════════════════════════════════════════
// UTILITIES
// ════════════════════════════════════════════════════════════

/**
 * Get all active test assignments for user
 */
export function getActiveAssignments(): ABTestAssignment[] {
  const assignments: ABTestAssignment[] = [];
  
  Object.keys(ACTIVE_TESTS).forEach((testId) => {
    const storageKey = `ab_test_${testId}`;
    const assignment = localStorage.getItem(storageKey);
    
    if (assignment) {
      assignments.push(JSON.parse(assignment));
    }
  });
  
  return assignments;
}

/**
 * Force user into specific variant (for testing)
 */
export function forceVariant(testId: string, variant: 'control' | 'treatment') {
  const test = ACTIVE_TESTS[testId];
  if (!test) return;
  
  const assignment: ABTestAssignment = {
    testId: test.id,
    variant: variant,
    assignedAt: new Date()
  };
  
  localStorage.setItem(`ab_test_${testId}`, JSON.stringify(assignment));
  
  console.log(`✅ Forced ${testId} to ${variant}`);
}

/**
 * Clear all test assignments (for testing)
 */
export function clearAllTests() {
  Object.keys(ACTIVE_TESTS).forEach((testId) => {
    localStorage.removeItem(`ab_test_${testId}`);
  });
  
  console.log('✅ Cleared all A/B test assignments');
}

// ════════════════════════════════════════════════════════════
// USAGE EXAMPLES
// ════════════════════════════════════════════════════════════

/**
 * Example 1: Language Test
 * 
 * import { useABTest, trackABMetric } from './utils/abTesting';
 * 
 * function App() {
 *   const language = useABTest('language', 'sw');
 *   
 *   const handleTransaction = () => {
 *     // Track completion
 *     trackABMetric('language', 'transaction_completed', {
 *       amount: 50000,
 *       duration_seconds: 45
 *     });
 *   };
 *   
 *   return <Dashboard language={language} />;
 * }
 */

/**
 * Example 2: Feature Test
 * 
 * import { useABTreatment } from './utils/abTesting';
 * 
 * function Dashboard() {
 *   const showDarkMode = useABTreatment('darkMode');
 *   
 *   return (
 *     <div>
 *       {showDarkMode && (
 *         <button onClick={() => setDarkMode(!darkMode)}>
 *           Toggle Dark Mode
 *         </button>
 *       )}
 *     </div>
 *   );
 * }
 */

/**
 * Example 3: Testing Commands (Console)
 * 
 * // Force yourself into treatment
 * forceVariant('language', 'treatment');
 * 
 * // Check your assignments
 * getActiveAssignments();
 * 
 * // Clear all tests
 * clearAllTests();
 */
