import { useState, useEffect } from 'react';
import { Shield, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';

interface SeamlessBotChallengeProps {
  onVerified: () => void;
  inline?: boolean; // Show inline in form vs modal
  minimal?: boolean; // Ultra minimal UI
}

export function SeamlessBotChallenge({ onVerified, inline = true, minimal = false }: SeamlessBotChallengeProps) {
  const [state, setState] = useState<'checking' | 'challenge' | 'verified'>('checking');
  const [sliderValue, setSliderValue] = useState(0);
  const [targetValue] = useState(Math.floor(Math.random() * 15) + 85); // 85-100
  const [attemptStartTime] = useState(Date.now());

  useEffect(() => {
    // Simulate quick background check
    const timer = setTimeout(() => {
      // Randomly pass some users automatically (simulating good behavior score)
      const autoPass = Math.random() > 0.3; // 70% need challenge, 30% auto-pass
      
      if (autoPass) {
        setState('verified');
        setTimeout(() => onVerified(), 800);
      } else {
        setState('challenge');
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    
    // Auto-verify when close enough
    if (Math.abs(value - targetValue) <= 3) {
      const timeTaken = Date.now() - attemptStartTime;
      
      // Check if timing is human-like (not too fast, not too slow)
      if (timeTaken > 800 && timeTaken < 30000) {
        setState('verified');
        setTimeout(() => onVerified(), 500);
      }
    }
  };

  if (minimal) {
    // Ultra-minimal checkbox style
    if (state === 'checking') {
      return (
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <Loader2 className="size-5 text-blue-600 animate-spin" />
          <span className="text-sm text-gray-600">Verifying...</span>
        </div>
      );
    }

    if (state === 'verified') {
      return (
        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200 animate-in fade-in duration-300">
          <CheckCircle className="size-5 text-green-600" />
          <span className="text-sm text-green-700 font-medium">Verified ✓</span>
        </div>
      );
    }

    // Minimal slider challenge
    return (
      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 space-y-3 animate-in slide-in-from-top-2 duration-300">
        <div className="flex items-center gap-2">
          <Shield className="size-4 text-blue-600" />
          <span className="text-sm text-blue-900 font-medium">Quick verification</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-blue-700 whitespace-nowrap">Slide to {targetValue}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            onChange={(e) => handleSliderChange(parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #2563eb 0%, #2563eb ${sliderValue}%, #e5e7eb ${sliderValue}%, #e5e7eb 100%)`
            }}
          />
          <span className="text-sm font-bold text-blue-900 w-8 text-right">{sliderValue}</span>
        </div>
      </div>
    );
  }

  // Standard inline version
  if (inline) {
    if (state === 'checking') {
      return (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="size-6 text-blue-600 animate-spin" />
            <div>
              <p className="font-semibold text-gray-900">Checking security...</p>
              <p className="text-sm text-gray-600">This will only take a moment</p>
            </div>
          </div>
        </div>
      );
    }

    if (state === 'verified') {
      return (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-center gap-3">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">
              <CheckCircle className="size-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-green-900">Verified ✓</p>
              <p className="text-sm text-green-700">You're good to go!</p>
            </div>
          </div>
        </div>
      );
    }

    // Inline challenge
    return (
      <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 shadow-lg animate-in slide-in-from-top-4 duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 w-10 h-10 rounded-xl flex items-center justify-center">
            <Shield className="size-5 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Quick Security Check</p>
            <p className="text-sm text-gray-600">Slide to {targetValue}</p>
          </div>
        </div>

        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            onChange={(e) => handleSliderChange(parseInt(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #2563eb 0%, #2563eb ${sliderValue}%, #e5e7eb ${sliderValue}%, #e5e7eb 100%)`
            }}
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">0</span>
            <span className="text-lg font-bold text-blue-600">{sliderValue}</span>
            <span className="text-xs text-gray-500">100</span>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">🔒 Automated security check</p>
        </div>
      </div>
    );
  }

  // Modal fallback (shouldn't be used for seamless UX)
  return null;
}

// Smart wrapper that only shows challenge when needed
interface SmartChallengeWrapperProps {
  children: React.ReactNode;
  botScore: number;
  onVerified: () => void;
  minimal?: boolean;
}

export function SmartChallengeWrapper({ 
  children, 
  botScore, 
  onVerified,
  minimal = false 
}: SmartChallengeWrapperProps) {
  const [showChallenge, setShowChallenge] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    // Only show challenge if bot score is low
    if (botScore < 40) {
      setShowChallenge(true);
    } else if (botScore >= 70) {
      // High score = auto verify
      setVerified(true);
      onVerified();
    }
  }, [botScore]);

  if (verified) {
    return <>{children}</>;
  }

  if (showChallenge) {
    return (
      <div className="space-y-4">
        <SeamlessBotChallenge
          onVerified={() => {
            setVerified(true);
            setShowChallenge(false);
            onVerified();
          }}
          inline={true}
          minimal={minimal}
        />
        <div className="opacity-50 pointer-events-none">
          {children}
        </div>
      </div>
    );
  }

  // Show checking state
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl">
        <Loader2 className="size-4 text-blue-600 animate-spin" />
        <span className="text-sm text-blue-700">Verifying security...</span>
      </div>
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
    </div>
  );
}

// Honeypot field (invisible to users, bots fill it)
interface HoneypotFieldProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function HoneypotField({ value, onChange }: HoneypotFieldProps) {
  return (
    <input
      type="text"
      name="website"
      value={value}
      onChange={onChange}
      tabIndex={-1}
      autoComplete="off"
      style={{
        position: 'absolute',
        left: '-9999px',
        width: '1px',
        height: '1px',
        opacity: 0,
        pointerEvents: 'none'
      }}
      aria-hidden="true"
    />
  );
}