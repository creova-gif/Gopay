import { useState, useEffect } from 'react';
import { BotDetection } from './BotDetection';

interface RiskBasedCaptchaProps {
  riskLevel: 'low' | 'medium' | 'high';
  action: 'login' | 'signup' | 'transaction' | 'password_reset' | 'sensitive_data';
  onVerified: () => void;
  onSkip?: () => void;
  userBehavior?: {
    loginAttempts: number;
    deviceTrustScore: number;
    locationAnomaly: boolean;
    timeAnomaly: boolean;
  };
}

export function RiskBasedCaptcha({ 
  riskLevel, 
  action, 
  onVerified, 
  onSkip,
  userBehavior 
}: RiskBasedCaptchaProps) {
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  useEffect(() => {
    // Calculate if CAPTCHA is needed based on risk factors
    const needsCaptcha = calculateCaptchaRequirement();
    setShowCaptcha(needsCaptcha);

    if (needsCaptcha) {
      setDifficulty(getDifficultyLevel());
    } else {
      // Low risk - skip CAPTCHA
      onSkip?.();
    }
  }, [riskLevel, userBehavior]);

  const calculateCaptchaRequirement = (): boolean => {
    // Always show for high risk
    if (riskLevel === 'high') return true;

    // Check user behavior patterns
    if (userBehavior) {
      const {
        loginAttempts = 0,
        deviceTrustScore = 100,
        locationAnomaly = false,
        timeAnomaly = false
      } = userBehavior;

      // Show CAPTCHA if suspicious patterns detected
      if (
        loginAttempts > 2 ||
        deviceTrustScore < 70 ||
        locationAnomaly ||
        timeAnomaly
      ) {
        return true;
      }
    }

    // Action-specific rules
    switch (action) {
      case 'signup':
        return true; // Always show for new users
      case 'transaction':
        return riskLevel === 'medium' || riskLevel === 'high';
      case 'password_reset':
        return true; // Security critical
      case 'sensitive_data':
        return true;
      case 'login':
        return riskLevel !== 'low';
      default:
        return false;
    }
  };

  const getDifficultyLevel = (): 'easy' | 'medium' | 'hard' => {
    if (riskLevel === 'high') return 'hard';
    if (riskLevel === 'medium') return 'medium';
    
    // Increase difficulty based on failed attempts
    if (userBehavior?.loginAttempts && userBehavior.loginAttempts > 3) {
      return 'hard';
    }
    
    return 'easy';
  };

  if (!showCaptcha) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <BotDetection
        onVerified={onVerified}
        difficulty={difficulty}
        type="auto"
      />
    </div>
  );
}
