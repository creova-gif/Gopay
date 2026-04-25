import { ArrowLeft, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { useState } from 'react';
import { BotDetection } from './BotDetection';
import { RiskBasedCaptcha } from './RiskBasedCaptcha';

interface CaptchaDemoProps {
  onBack: () => void;
}

export function CaptchaDemo({ onBack }: CaptchaDemoProps) {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [verificationComplete, setVerificationComplete] = useState(false);

  const demos = [
    {
      id: 'slider',
      name: 'Slider Challenge',
      description: 'Match the target value',
      type: 'slider' as const,
      difficulty: 'easy' as const
    },
    {
      id: 'math',
      name: 'Math Problem',
      description: 'Solve simple arithmetic',
      type: 'math' as const,
      difficulty: 'easy' as const
    },
    {
      id: 'image',
      name: 'Image Selection',
      description: 'Select matching images',
      type: 'image' as const,
      difficulty: 'medium' as const
    },
    {
      id: 'pattern',
      name: 'Pattern Memory',
      description: 'Remember and recreate pattern',
      type: 'pattern' as const,
      difficulty: 'hard' as const
    },
    {
      id: 'auto',
      name: 'Auto (Mixed)',
      description: 'Randomly selected challenge',
      type: 'auto' as const,
      difficulty: 'medium' as const
    }
  ];

  const riskScenarios = [
    {
      id: 'low-login',
      name: 'Low Risk Login',
      description: 'Trusted device, normal location',
      riskLevel: 'low' as const,
      action: 'login' as const,
      behavior: {
        loginAttempts: 0,
        deviceTrustScore: 95,
        locationAnomaly: false,
        timeAnomaly: false
      }
    },
    {
      id: 'medium-transaction',
      name: 'Medium Risk Transaction',
      description: 'Large transaction amount',
      riskLevel: 'medium' as const,
      action: 'transaction' as const,
      behavior: {
        loginAttempts: 0,
        deviceTrustScore: 85,
        locationAnomaly: false,
        timeAnomaly: false
      }
    },
    {
      id: 'high-suspicious',
      name: 'High Risk Activity',
      description: 'Multiple failed attempts, new device',
      riskLevel: 'high' as const,
      action: 'login' as const,
      behavior: {
        loginAttempts: 4,
        deviceTrustScore: 45,
        locationAnomaly: true,
        timeAnomaly: true
      }
    }
  ];

  const handleVerified = () => {
    setVerificationComplete(true);
    setTimeout(() => {
      setActiveDemo(null);
      setVerificationComplete(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Bot Detection Demo</h1>
              <p className="text-sm text-gray-600">Test all CAPTCHA types</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6 pb-24">
        {/* Info Banner */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-xl flex items-center justify-center">
              <Shield className="size-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">Advanced Bot Protection</h2>
              <p className="text-sm text-white/90">
                Multiple challenge types protect against automated attacks
              </p>
            </div>
          </div>
        </div>

        {/* Challenge Types */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4">Challenge Types</h3>
          <div className="space-y-3">
            {demos.map(demo => (
              <button
                key={demo.id}
                onClick={() => setActiveDemo(demo.id)}
                className="w-full bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">{demo.name}</h4>
                    <p className="text-sm text-gray-600">{demo.description}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    demo.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                    demo.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {demo.difficulty.toUpperCase()}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Risk-Based Scenarios */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4">Risk-Based CAPTCHA</h3>
          <div className="bg-blue-50 rounded-2xl p-4 mb-4 border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Smart Protection:</strong> CAPTCHA is only shown when risk is detected. Low-risk users skip verification for better UX.
            </p>
          </div>
          <div className="space-y-3">
            {riskScenarios.map(scenario => (
              <button
                key={scenario.id}
                onClick={() => setActiveDemo(scenario.id)}
                className="w-full bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all text-left"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    scenario.riskLevel === 'low' ? 'bg-green-100' :
                    scenario.riskLevel === 'medium' ? 'bg-amber-100' :
                    'bg-red-100'
                  }`}>
                    {scenario.riskLevel === 'low' ? (
                      <Shield className={`size-6 text-green-600`} />
                    ) : (
                      <AlertTriangle className={`size-6 ${
                        scenario.riskLevel === 'medium' ? 'text-amber-600' : 'text-red-600'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-900">{scenario.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                        scenario.riskLevel === 'low' ? 'bg-green-100 text-green-700' :
                        scenario.riskLevel === 'medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {scenario.riskLevel.toUpperCase()} RISK
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-gray-50 rounded-lg p-2">
                        <span className="text-gray-600">Login Attempts:</span>
                        <span className="font-bold text-gray-900 ml-1">{scenario.behavior.loginAttempts}</span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <span className="text-gray-600">Trust Score:</span>
                        <span className="font-bold text-gray-900 ml-1">{scenario.behavior.deviceTrustScore}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-white rounded-3xl p-6 shadow-md">
          <h3 className="font-bold text-gray-900 mb-4">When CAPTCHA is Used</h3>
          <div className="space-y-3">
            {[
              { action: 'Sign Up', when: 'Always (prevents bot accounts)' },
              { action: 'Login', when: 'After 2+ failed attempts' },
              { action: 'Password Reset', when: 'Always (security critical)' },
              { action: 'Large Transaction', when: 'Amount > TZS 1M' },
              { action: 'New Device Login', when: 'Unknown device detected' },
              { action: 'Suspicious Activity', when: 'AI detects anomaly' }
            ].map((useCase, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">{idx + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{useCase.action}</p>
                  <p className="text-xs text-gray-600">{useCase.when}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Stats */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-3xl p-6 shadow-xl">
          <h3 className="font-bold text-lg mb-4">Protection Statistics</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <p className="text-xs text-white/80 mb-1">Bot Attacks Blocked</p>
              <p className="text-2xl font-bold">99.7%</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <p className="text-xs text-white/80 mb-1">Success Rate</p>
              <p className="text-2xl font-bold">96.8%</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <p className="text-xs text-white/80 mb-1">Avg Time</p>
              <p className="text-2xl font-bold">8.5s</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <p className="text-xs text-white/80 mb-1">False Positives</p>
              <p className="text-2xl font-bold">0.3%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Demo Modal */}
      {activeDemo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          {demos.find(d => d.id === activeDemo) && (
            <div className="relative">
              <button
                onClick={() => setActiveDemo(null)}
                className="absolute -top-4 -right-4 bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-xl hover:bg-gray-100 z-10"
              >
                ✕
              </button>
              <BotDetection
                onVerified={handleVerified}
                difficulty={demos.find(d => d.id === activeDemo)!.difficulty}
                type={demos.find(d => d.id === activeDemo)!.type}
              />
            </div>
          )}

          {riskScenarios.find(s => s.id === activeDemo) && (
            <div className="relative">
              <button
                onClick={() => setActiveDemo(null)}
                className="absolute -top-4 -right-4 bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-xl hover:bg-gray-100 z-10"
              >
                ✕
              </button>
              <RiskBasedCaptcha
                riskLevel={riskScenarios.find(s => s.id === activeDemo)!.riskLevel}
                action={riskScenarios.find(s => s.id === activeDemo)!.action}
                userBehavior={riskScenarios.find(s => s.id === activeDemo)!.behavior}
                onVerified={handleVerified}
                onSkip={() => {
                  toast.info('Low risk detected - CAPTCHA skipped!');
                  setActiveDemo(null);
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
