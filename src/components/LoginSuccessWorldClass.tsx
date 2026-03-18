/**
 * LOGIN SUCCESS TRANSITION - WORLD-CLASS (DESIGN MATURITY)
 * 
 * JOURNEY QUESTION: "Did my login work?"
 * 
 * HIERARCHY:
 * 1. Hero: Calm confirmation (checkmark, not flashy)
 * 2. Supporting: Brief welcome message
 * 3. Quiet: Loading indicator
 * 
 * PRINCIPLES APPLIED:
 * ✅ Calm confirmation (not celebratory)
 * ✅ Brief (800ms total, not 1200ms)
 * ✅ Predictable (same every time)
 * ✅ Outcome language ("Umefanikiwa" = factual)
 * ✅ Professional (fintech-grade)
 * 
 * INSPIRED BY:
 * - Banking apps: Quick, professional
 * - Revolut: Minimal transition
 * - PayPal: Boring = trusted
 * 
 * @version 5.0.0 (World-Class Maturity)
 */

import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

interface LoginSuccessWorldClassProps {
  userName: string;
  onComplete: () => void;
  language?: 'sw' | 'en';
}

// ════════════════════════════════════════════════════════════
// COPY (CALM, FACTUAL)
// ════════════════════════════════════════════════════════════

const COPY = {
  confirmed: { sw: 'Umefanikiwa', en: 'Success' },
  welcome: { sw: 'Karibu', en: 'Welcome' }
};

// ════════════════════════════════════════════════════════════
// MOTION (BRIEF, CALM)
// Total duration: 800ms (not 1200ms)
// ════════════════════════════════════════════════════════════

const MOTION = {
  container: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 }
  },
  checkmark: {
    initial: { scale: 0 },
    animate: { scale: 1 },
    transition: {
      duration: 0.25,
      delay: 0.1,
      ease: [0.4, 0, 0.2, 1] // ease-out, no bounce
    }
  },
  text: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: {
      duration: 0.2,
      delay: 0.3
    }
  }
};

// ════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════

export function LoginSuccessWorldClass({
  userName,
  onComplete,
  language = 'sw'
}: LoginSuccessWorldClassProps) {
  const getText = (obj: { sw: string; en: string }) => obj[language];
  
  // Auto-complete after 800ms (brief, professional)
  useEffect(() => {
    const timer = setTimeout(onComplete, 800);
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  return (
    <motion.div
      {...MOTION.container}
      className="fixed inset-0 bg-gray-50 z-50 flex items-center justify-center"
    >
      <div className="text-center">
        
        {/* Checkmark (calm, dark, professional) */}
        <motion.div
          {...MOTION.checkmark}
          className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Check className="w-10 h-10 text-white" strokeWidth={3} />
        </motion.div>
        
        {/* Text (brief, factual) */}
        <motion.div {...MOTION.text}>
          <p className="text-lg font-bold text-gray-900 mb-1">
            {getText(COPY.confirmed)}
          </p>
          <p className="text-gray-600">
            {getText(COPY.welcome)}, {userName.split(' ')[0]}
          </p>
        </motion.div>
        
      </div>
    </motion.div>
  );
}

/**
 * ════════════════════════════════════════════════════════════
 * WORLD-CLASS CHANGES:
 * ════════════════════════════════════════════════════════════
 * 
 * ❌ REMOVED:
 * - Long duration (1200ms → 800ms)
 * - goPay logo animation
 * - Green gradient background
 * - "Karibu goPay" branding
 * - Loading dots (unnecessary)
 * - Bounce animation
 * 
 * ✅ IMPROVED:
 * - Brief (800ms total)
 * - Calm checkmark (dark, simple)
 * - Factual language ("Umefanikiwa" not "Welcome to goPay!")
 * - Gray background (professional)
 * - Ease-out only (no bounce)
 * - Minimal text (first name only)
 * 
 * QUESTION ANSWERED:
 * "Did my login work?"
 * → Yes. (Don't overthink it.)
 * 
 * TRUST MECHANISM:
 * Through speed and predictability.
 * User thinks: "It worked. Moving on."
 * 
 * EMOTIONAL TONE:
 * Not celebration. CONFIRMATION.
 * This is a tool, not entertainment.
 * 
 * DURATION BREAKDOWN:
 * 0-100ms: Fade in
 * 100-350ms: Checkmark appears
 * 300-500ms: Text appears
 * 500-800ms: Hold (brief)
 * 800ms: Transition to dashboard
 * 
 * INSPIRATION:
 * - Banking apps: Quick confirmation
 * - Revolut: Minimal, professional
 * - PayPal: Boring = efficient
 * 
 * WHY 800MS NOT 1200MS:
 * Longer transitions feel sluggish.
 * Fintech users want speed, not spectacle.
 */
