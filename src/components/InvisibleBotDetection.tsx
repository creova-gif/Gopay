import { useEffect, useState, useRef } from 'react';

interface BehaviorData {
  mouseMovements: number;
  keystrokes: number;
  clickPatterns: Array<{ x: number; y: number; timestamp: number }>;
  scrollEvents: number;
  touchEvents: number;
  timeOnPage: number;
  formInteractionTime: number;
  typingSpeed: number;
  mouseVelocity: number;
}

interface BotScore {
  score: number; // 0-100, higher = more human-like
  confidence: number;
  needsChallenge: boolean;
  reason?: string;
}

export function useInvisibleBotDetection(enabled: boolean = true) {
  const [botScore, setBotScore] = useState<BotScore>({
    score: 50,
    confidence: 0,
    needsChallenge: false
  });

  const behaviorRef = useRef<BehaviorData>({
    mouseMovements: 0,
    keystrokes: 0,
    clickPatterns: [],
    scrollEvents: 0,
    touchEvents: 0,
    timeOnPage: 0,
    formInteractionTime: 0,
    typingSpeed: 0,
    mouseVelocity: 0
  });

  const startTimeRef = useRef(Date.now());
  const lastMousePosRef = useRef({ x: 0, y: 0, time: 0 });
  const keystrokeTimesRef = useRef<number[]>([]);

  useEffect(() => {
    if (!enabled) return;

    // Mouse movement tracking
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const lastPos = lastMousePosRef.current;
      
      behaviorRef.current.mouseMovements++;
      
      // Calculate mouse velocity (humans have varying speeds)
      if (lastPos.time > 0) {
        const distance = Math.sqrt(
          Math.pow(e.clientX - lastPos.x, 2) + Math.pow(e.clientY - lastPos.y, 2)
        );
        const timeDiff = now - lastPos.time;
        const velocity = timeDiff > 0 ? distance / timeDiff : 0;
        
        behaviorRef.current.mouseVelocity = 
          (behaviorRef.current.mouseVelocity + velocity) / 2; // Running average
      }
      
      lastMousePosRef.current = { x: e.clientX, y: e.clientY, time: now };
    };

    // Click pattern tracking
    const handleClick = (e: MouseEvent) => {
      behaviorRef.current.clickPatterns.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      });

      // Keep only last 10 clicks
      if (behaviorRef.current.clickPatterns.length > 10) {
        behaviorRef.current.clickPatterns.shift();
      }
    };

    // Keystroke tracking
    const handleKeyDown = () => {
      const now = Date.now();
      behaviorRef.current.keystrokes++;
      keystrokeTimesRef.current.push(now);

      // Calculate typing speed (humans vary)
      if (keystrokeTimesRef.current.length >= 5) {
        const times = keystrokeTimesRef.current.slice(-5);
        const intervals = times.slice(1).map((t, i) => t - times[i]);
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        behaviorRef.current.typingSpeed = 1000 / avgInterval; // chars per second
      }

      // Keep only last 20 keystrokes
      if (keystrokeTimesRef.current.length > 20) {
        keystrokeTimesRef.current.shift();
      }
    };

    // Scroll tracking
    const handleScroll = () => {
      behaviorRef.current.scrollEvents++;
    };

    // Touch tracking (mobile)
    const handleTouchStart = () => {
      behaviorRef.current.touchEvents++;
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('touchstart', handleTouchStart);

    // Update time on page
    const timeInterval = setInterval(() => {
      behaviorRef.current.timeOnPage = Date.now() - startTimeRef.current;
      analyzeBehavior();
    }, 2000); // Analyze every 2 seconds

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      clearInterval(timeInterval);
    };
  }, [enabled]);

  const analyzeBehavior = () => {
    const data = behaviorRef.current;
    const timeInSeconds = data.timeOnPage / 1000;

    let score = 50; // Start neutral
    let flags: string[] = [];

    // Check 1: Mouse movements (bots often have none or perfect patterns)
    if (timeInSeconds > 5) {
      if (data.mouseMovements === 0 && data.touchEvents === 0) {
        score -= 30;
        flags.push('No mouse/touch activity');
      } else if (data.mouseMovements > timeInSeconds * 10) {
        score += 15; // Good natural movement
      }
    }

    // Check 2: Mouse velocity variance (bots have constant speed)
    if (data.mouseVelocity > 0) {
      // Humans have varying speeds, bots are constant
      score += 10;
    }

    // Check 3: Click patterns (bots click in perfect grids)
    if (data.clickPatterns.length >= 3) {
      const clicks = data.clickPatterns.slice(-3);
      const intervals = clicks.slice(1).map((c, i) => c.timestamp - clicks[i].timestamp);
      const variance = Math.max(...intervals) - Math.min(...intervals);
      
      if (variance < 50) {
        // Too consistent = bot
        score -= 20;
        flags.push('Robotic click timing');
      } else {
        score += 10;
      }
    }

    // Check 4: Typing speed (bots type too fast or too slow)
    if (data.typingSpeed > 0) {
      if (data.typingSpeed > 15) {
        // Superhuman typing speed
        score -= 25;
        flags.push('Unrealistic typing speed');
      } else if (data.typingSpeed < 0.5 && data.keystrokes > 10) {
        // Too slow for sustained typing
        score -= 15;
        flags.push('Unnaturally slow typing');
      } else if (data.typingSpeed >= 2 && data.typingSpeed <= 8) {
        // Normal human range
        score += 15;
      }
    }

    // Check 5: Form interaction time (bots fill forms instantly)
    if (data.keystrokes > 0 && timeInSeconds < 2) {
      score -= 25;
      flags.push('Form filled too quickly');
    }

    // Check 6: Scroll behavior (humans scroll)
    if (timeInSeconds > 5 && data.scrollEvents === 0) {
      score -= 10;
      flags.push('No scrolling detected');
    } else if (data.scrollEvents > 0) {
      score += 10;
    }

    // Check 7: Time on page (bots submit immediately)
    if (timeInSeconds < 1 && (data.keystrokes > 5 || data.clickPatterns.length > 2)) {
      score -= 30;
      flags.push('Suspiciously fast completion');
    } else if (timeInSeconds > 3) {
      score += 10;
    }

    // Normalize score to 0-100
    score = Math.max(0, Math.min(100, score));

    // Calculate confidence based on data collected
    let confidence = 0;
    if (data.mouseMovements > 10) confidence += 20;
    if (data.keystrokes > 5) confidence += 20;
    if (data.clickPatterns.length > 2) confidence += 20;
    if (timeInSeconds > 5) confidence += 20;
    if (data.scrollEvents > 0) confidence += 10;
    if (data.touchEvents > 0) confidence += 10;
    confidence = Math.min(100, confidence);

    // Determine if challenge is needed
    const needsChallenge = score < 40 || (score < 60 && confidence > 70);

    setBotScore({
      score,
      confidence,
      needsChallenge,
      reason: needsChallenge ? flags.join(', ') : undefined
    });
  };

  // Device fingerprinting
  const getDeviceFingerprint = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Browser fingerprint', 2, 2);
    }

    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: (navigator as any).deviceMemory,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      colorDepth: window.screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvasFingerprint: canvas.toDataURL(),
      touchSupport: 'ontouchstart' in window
    };
  };

  return {
    botScore,
    behaviorData: behaviorRef.current,
    deviceFingerprint: getDeviceFingerprint(),
    analyzeBehavior
  };
}

// Invisible protection wrapper component
interface InvisibleBotProtectionProps {
  children: React.ReactNode;
  onBotDetected?: (score: BotScore) => void;
  threshold?: number; // Score below this triggers detection
}

export function InvisibleBotProtection({ 
  children, 
  onBotDetected,
  threshold = 40 
}: InvisibleBotProtectionProps) {
  const { botScore } = useInvisibleBotDetection(true);

  useEffect(() => {
    if (botScore.needsChallenge && onBotDetected) {
      onBotDetected(botScore);
    }
  }, [botScore.needsChallenge]);

  // Render children normally - protection is invisible
  return <>{children}</>;
}
