import { useState, useEffect } from 'react';
import { ArrowLeft, Shield, Activity, Clock, MapPin, Smartphone, CheckCircle, AlertTriangle, TrendingUp, Lock, Eye, Zap, Brain, Fingerprint } from 'lucide-react';
import { Button } from './ui/button';

interface BehavioralBiometricsProps {
  onBack: () => void;
}

interface BiometricPattern {
  id: string;
  type: 'typing' | 'touch' | 'swipe' | 'hold' | 'navigation';
  name: string;
  status: 'normal' | 'learning' | 'anomaly';
  confidence: number;
  lastUpdated: string;
  description: string;
  gradient: string;
}

interface SecurityEvent {
  id: string;
  timestamp: string;
  event: string;
  riskLevel: 'low' | 'medium' | 'high';
  action: string;
}

const BEHAVIORAL_PATTERNS: BiometricPattern[] = [
  {
    id: 'pattern-1',
    type: 'typing',
    name: 'Typing Rhythm',
    status: 'normal',
    confidence: 94,
    lastUpdated: '2 hours ago',
    description: 'Average typing speed: 42 WPM, consistent rhythm pattern detected',
    gradient: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'pattern-2',
    type: 'touch',
    name: 'Touch Pressure',
    status: 'normal',
    confidence: 89,
    lastUpdated: '5 hours ago',
    description: 'Medium pressure, consistent force application',
    gradient: 'from-purple-500 to-pink-600'
  },
  {
    id: 'pattern-3',
    type: 'swipe',
    name: 'Swipe Velocity',
    status: 'learning',
    confidence: 76,
    lastUpdated: '1 day ago',
    description: 'Fast swipes, left-to-right preference. Still learning patterns.',
    gradient: 'from-orange-500 to-red-600'
  },
  {
    id: 'pattern-4',
    type: 'hold',
    name: 'Hold Duration',
    status: 'normal',
    confidence: 91,
    lastUpdated: '3 hours ago',
    description: 'Average hold time: 0.8s, consistent across sessions',
    gradient: 'from-green-500 to-emerald-600'
  },
  {
    id: 'pattern-5',
    type: 'navigation',
    name: 'Navigation Flow',
    status: 'normal',
    confidence: 87,
    lastUpdated: '1 hour ago',
    description: 'Typical flow: Home → Send Money → Confirm. 92% match',
    gradient: 'from-indigo-500 to-purple-600'
  }
];

const SECURITY_EVENTS: SecurityEvent[] = [
  {
    id: 'event-1',
    timestamp: '2 hours ago',
    event: 'Unusual typing speed detected',
    riskLevel: 'low',
    action: 'Monitored - No action needed'
  },
  {
    id: 'event-2',
    timestamp: '1 day ago',
    event: 'New device login from different location',
    riskLevel: 'medium',
    action: 'Additional verification required'
  },
  {
    id: 'event-3',
    timestamp: '3 days ago',
    event: 'Navigation pattern deviation',
    riskLevel: 'low',
    action: 'Pattern updated'
  },
  {
    id: 'event-4',
    timestamp: '1 week ago',
    event: 'Touch pressure significantly different',
    riskLevel: 'high',
    action: 'Transaction blocked, verified via SMS'
  }
];

export function BehavioralBiometrics({ onBack }: BehavioralBiometricsProps) {
  const [isEnabled, setIsEnabled] = useState(true);
  const [selectedPattern, setSelectedPattern] = useState<BiometricPattern | null>(null);
  const [showEvents, setShowEvents] = useState(false);

  useEffect(() => {
    if (!isEnabled) return;
    const interval = setInterval(() => {
      console.log('Behavioral biometrics active - monitoring user patterns');
    }, 5000);
    return () => clearInterval(interval);
  }, [isEnabled]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'from-green-500 to-emerald-600';
      case 'learning': return 'from-blue-500 to-cyan-600';
      case 'anomaly': return 'from-red-500 to-orange-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'low': return { gradient: 'from-green-500 to-emerald-600', label: 'LOW' };
      case 'medium': return { gradient: 'from-yellow-500 to-orange-600', label: 'MEDIUM' };
      case 'high': return { gradient: 'from-red-500 to-pink-600', label: 'HIGH' };
      default: return { gradient: 'from-gray-500 to-gray-600', label: 'UNKNOWN' };
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'typing': return Activity;
      case 'touch': return Smartphone;
      case 'swipe': return TrendingUp;
      case 'hold': return Clock;
      case 'navigation': return MapPin;
      default: return Shield;
    }
  };

  const averageConfidence = Math.round(
    BEHAVIORAL_PATTERNS.reduce((sum, p) => sum + p.confidence, 0) / BEHAVIORAL_PATTERNS.length
  );

  if (showEvents) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Premium Header */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
          
          <div className="relative text-white p-6 pb-8">
            <div className="flex items-center justify-between mb-2">
              <button onClick={() => setShowEvents(false)} className="p-2 hover:bg-white/20 rounded-full transition-all">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="w-10" />
            </div>
            <h1 className="text-2xl font-bold">Security Timeline</h1>
            <p className="text-purple-100 text-sm mt-1">All detected events</p>
          </div>
        </div>

        {/* Events List */}
        <div className="p-6 space-y-4">
          {SECURITY_EVENTS.map(event => {
            const badge = getRiskBadge(event.riskLevel);
            return (
              <div key={event.id} className="bg-white rounded-3xl p-5 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{event.event}</h3>
                    <p className="text-sm text-gray-500">{event.timestamp}</p>
                  </div>
                  <div className={`px-3 py-1.5 bg-gradient-to-r ${badge.gradient} text-white rounded-full text-xs font-bold shadow-lg`}>
                    {badge.label}
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Action: </span>
                      {event.action}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (selectedPattern) {
    const IconComponent = getIcon(selectedPattern.type);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Pattern Header */}
        <div className={`bg-gradient-to-br ${selectedPattern.gradient} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          
          <div className="relative text-white p-6 pb-10">
            <div className="flex items-center justify-between mb-8">
              <button onClick={() => setSelectedPattern(null)} className="p-2 hover:bg-white/20 rounded-full transition-all">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="w-10" />
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-2xl">
                <IconComponent className="w-10 h-10" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-1">{selectedPattern.name}</h2>
                <p className="text-white/90 text-sm">{selectedPattern.lastUpdated}</p>
              </div>
            </div>

            {/* Confidence Ring */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-white/90">Confidence Level</span>
                <span className="text-4xl font-bold">{selectedPattern.confidence}%</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all shadow-lg"
                  style={{ width: `${selectedPattern.confidence}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 -mt-6 pb-8 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-gray-100">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              What We're Analyzing
            </h3>
            <p className="text-gray-700 leading-relaxed">{selectedPattern.description}</p>
          </div>

          <div className={`bg-gradient-to-br ${selectedPattern.gradient} bg-opacity-10 rounded-3xl p-6 border-2 border-opacity-20`} style={{ borderColor: 'currentColor' }}>
            <h3 className="font-bold text-lg mb-3">How This Protects You</h3>
            <p className="text-gray-700 leading-relaxed">
              GO Pay continuously monitors your {selectedPattern.type} patterns to verify it's really you. 
              If unusual behavior is detected, we may ask for additional verification to protect your account from unauthorized access.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-gray-100">
            <h3 className="font-bold text-lg mb-3">Reset This Pattern</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              If you feel this pattern is not accurate, you can reset it. The system will re-learn your behavior over the next 7-14 days.
            </p>
            <Button variant="outline" className={`w-full h-12 border-2 bg-gradient-to-r ${selectedPattern.gradient} text-white hover:opacity-90 rounded-2xl font-semibold shadow-lg`}>
              Reset Pattern
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Premium Header with AI Shield */}
      <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative text-white p-6 pb-10">
          <div className="flex items-center justify-between mb-8">
            <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full transition-all">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="text-center">
              <h1 className="text-2xl font-bold">AI Protection</h1>
              <p className="text-sm text-purple-100">Behavioral Biometrics</p>
            </div>
            <div className="w-10" />
          </div>

          {/* Status Card with Animation */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border-2 border-white/20 shadow-2xl">
            <div className="flex items-center gap-4 mb-5">
              <div className="relative">
                <div className={`w-16 h-16 bg-gradient-to-br ${isEnabled ? 'from-green-400 to-emerald-500' : 'from-gray-400 to-gray-500'} rounded-2xl flex items-center justify-center shadow-xl`}>
                  {isEnabled ? (
                    <Shield className="w-8 h-8 text-white" />
                  ) : (
                    <Lock className="w-8 h-8 text-white" />
                  )}
                </div>
                {isEnabled && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-xl mb-1">
                  {isEnabled ? 'AI Active' : 'Protection Paused'}
                </h2>
                <p className="text-white/80 text-sm">
                  {isEnabled ? 'Continuously monitoring your patterns' : 'Enable to activate protection'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white/90">Overall Confidence</span>
                <span className="text-3xl font-bold">{averageConfidence}%</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-white to-white/80 rounded-full transition-all shadow-lg"
                  style={{ width: `${averageConfidence}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-6 pb-8 space-y-6">
        {/* Toggle Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 mb-1">
                <Fingerprint className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-lg">Behavioral Protection</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                AI-powered fraud detection based on your unique behavior patterns
              </p>
            </div>
            <button
              onClick={() => setIsEnabled(!isEnabled)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all shadow-lg ${
                isEnabled ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${
                  isEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-6 border-2 border-blue-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-purple-900 mb-2">How It Works</h3>
              <p className="text-purple-700 leading-relaxed">
                We analyze how you interact with GO Pay - typing speed, touch pressure, swipe patterns, and navigation habits. If someone tries to access your account, we'll detect the difference instantly.
              </p>
            </div>
          </div>
        </div>

        {/* Patterns Grid */}
        <div>
          <h3 className="font-bold text-xl mb-5">Your Behavioral Patterns</h3>
          <div className="space-y-4">
            {BEHAVIORAL_PATTERNS.map(pattern => {
              const IconComponent = getIcon(pattern.type);
              return (
                <button
                  key={pattern.id}
                  onClick={() => setSelectedPattern(pattern)}
                  className="w-full group"
                >
                  <div className={`bg-gradient-to-r ${pattern.gradient} rounded-3xl p-1 shadow-lg hover:shadow-2xl transition-all`}>
                    <div className="bg-white rounded-[22px] p-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 bg-gradient-to-br ${pattern.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className="font-bold text-lg mb-1">{pattern.name}</h4>
                          <p className="text-xs text-gray-500 mb-2">{pattern.lastUpdated}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full bg-gradient-to-r ${pattern.gradient} rounded-full`}
                                style={{ width: `${pattern.confidence}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold text-gray-900">{pattern.confidence}%</span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Events */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-xl">Recent Security Events</h3>
            <button 
              onClick={() => setShowEvents(true)}
              className="text-sm text-purple-600 font-semibold hover:text-purple-700"
            >
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {SECURITY_EVENTS.slice(0, 3).map(event => {
              const badge = getRiskBadge(event.riskLevel);
              return (
                <div key={event.id} className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{event.event}</h4>
                      <p className="text-xs text-gray-500">{event.timestamp}</p>
                    </div>
                    <div className={`px-2.5 py-1 bg-gradient-to-r ${badge.gradient} text-white rounded-full text-xs font-bold shadow`}>
                      {badge.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-gray-100">
          <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Why This Matters
          </h3>
          <div className="space-y-4">
            {[
              { title: 'Invisible Protection', desc: 'Works silently in the background' },
              { title: 'Real-time Detection', desc: 'Catches fraud as it happens' },
              { title: 'Always Learning', desc: 'Gets smarter with every interaction' },
              { title: '10x More Accurate', desc: 'Better than traditional security' }
            ].map((benefit, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{benefit.title}</h4>
                  <p className="text-sm text-gray-600">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl p-6 text-center border-2 border-gray-200">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-bold text-gray-900 mb-2">Your Privacy is Protected</h4>
          <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
            Your behavioral patterns are encrypted and stored securely. They're never shared with third parties.
          </p>
        </div>
      </div>
    </div>
  );
}
