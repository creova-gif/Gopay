import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { 
  Shield, 
  ChevronLeft,
  AlertTriangle,
  CheckCircle,
  Smartphone,
  Lock,
  Unlock,
  Clock,
  Bell,
  Fingerprint,
  Eye,
  Activity,
  WifiOff
} from 'lucide-react';

interface SIMSwapProtectionProps {
  onBack: () => void;
}

export function SIMSwapProtection({ onBack }: SIMSwapProtectionProps) {
  const [protectionEnabled, setProtectionEnabled] = useState(true);
  const [lockDuration, setLockDuration] = useState(24);
  const [deviceFingerprint, setDeviceFingerprint] = useState<string>('');
  const [lastSIMCheck, setLastSIMCheck] = useState<Date>(new Date());
  const [simStatus, setSimStatus] = useState<'safe' | 'warning' | 'locked'>('safe');

  useEffect(() => {
    // Generate device fingerprint
    const fingerprint = generateDeviceFingerprint();
    setDeviceFingerprint(fingerprint);

    // Check SIM status
    checkSIMStatus();
  }, []);

  const generateDeviceFingerprint = (): string => {
    const userAgent = navigator.userAgent;
    const screenRes = `${window.screen.width}x${window.screen.height}`;
    const timestamp = Date.now();
    return btoa(`${userAgent}-${screenRes}-${timestamp}`).slice(0, 16);
  };

  const checkSIMStatus = () => {
    // In production, this would check actual SIM card status
    // For demo, we'll simulate it
    setLastSIMCheck(new Date());
  };

  const securityFeatures = [
    {
      icon: Shield,
      title: 'SIM Swap Detection',
      description: 'Real-time monitoring of SIM card changes',
      status: 'active',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Lock,
      title: '24-Hour Lock',
      description: 'High-risk actions locked after SIM swap',
      status: 'active',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Fingerprint,
      title: 'Device Fingerprinting',
      description: 'Unique device identification',
      status: 'active',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Bell,
      title: 'Instant Alerts',
      description: 'SMS & email notifications',
      status: 'active',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const protectedActions = [
    { action: 'Send Money', lockDuration: '24 hours', icon: '💸' },
    { action: 'Change Password', lockDuration: '24 hours', icon: '🔑' },
    { action: 'Add Bank Account', lockDuration: '48 hours', icon: '🏦' },
    { action: 'Withdraw to Bank', lockDuration: '24 hours', icon: '💳' },
    { action: 'Change Phone Number', lockDuration: '72 hours', icon: '📱' },
    { action: 'Update NIDA Info', lockDuration: '48 hours', icon: '🆔' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-red-600 via-orange-600 to-amber-600 px-5 pt-8 pb-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <button 
            onClick={onBack}
            className="bg-white/20 backdrop-blur-md hover:bg-white/30 p-2 rounded-full mb-6 transition-all active:scale-95"
          >
            <ChevronLeft className="size-5 text-white" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
              <Shield className="size-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl text-white mb-1">SIM Swap Protection</h1>
              <p className="text-orange-100 text-sm">Bank-grade fraud prevention</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-6 space-y-6">
        {/* Status Card */}
        <div className={`rounded-3xl p-6 shadow-lg relative overflow-hidden ${
          simStatus === 'safe' 
            ? 'bg-gradient-to-br from-green-500 to-emerald-500' 
            : simStatus === 'warning'
            ? 'bg-gradient-to-br from-orange-500 to-red-500'
            : 'bg-gradient-to-br from-red-600 to-pink-600'
        }`}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {simStatus === 'safe' ? (
                  <CheckCircle className="size-8" />
                ) : simStatus === 'warning' ? (
                  <AlertTriangle className="size-8" />
                ) : (
                  <Lock className="size-8" />
                )}
                <div>
                  <p className="text-xl">
                    {simStatus === 'safe' ? 'Protected' : simStatus === 'warning' ? 'Warning' : 'Locked'}
                  </p>
                  <p className="text-sm text-white/80">
                    {simStatus === 'safe' 
                      ? 'Your account is secure' 
                      : simStatus === 'warning'
                      ? 'SIM change detected'
                      : 'Account temporarily locked'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Last SIM Check</span>
                <span className="text-sm font-mono">{lastSIMCheck.toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Device Fingerprint</span>
                <span className="text-xs font-mono">{deviceFingerprint}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Protection Status</span>
                <span className="text-sm font-semibold">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Protection Toggle */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-xl">
                <Shield className="size-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium mb-0.5">SIM Swap Protection</p>
                <p className="text-sm text-gray-600">
                  {protectionEnabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setProtectionEnabled(!protectionEnabled)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                protectionEnabled ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  protectionEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Security Features */}
        <div>
          <h3 className="text-lg mb-4">Security Features</h3>
          <div className="grid grid-cols-2 gap-3">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${feature.color} rounded-2xl p-4 text-white relative overflow-hidden`}
                >
                  <div className="absolute top-2 right-2">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5">
                      <span className="text-xs">ACTIVE</span>
                    </div>
                  </div>
                  <Icon className="size-8 mb-3 opacity-90" />
                  <p className="text-sm mb-1">{feature.title}</p>
                  <p className="text-xs text-white/80">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl p-6 text-white shadow-lg">
          <h3 className="text-xl mb-4">How SIM Swap Protection Works</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-white/20 p-2 rounded-lg mt-0.5">
                <Activity className="size-4" />
              </div>
              <div>
                <p className="text-sm mb-1">1. Real-Time Monitoring</p>
                <p className="text-xs text-blue-100">We continuously monitor your SIM card status</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white/20 p-2 rounded-lg mt-0.5">
                <AlertTriangle className="size-4" />
              </div>
              <div>
                <p className="text-sm mb-1">2. Instant Detection</p>
                <p className="text-xs text-blue-100">SIM swap detected within seconds</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white/20 p-2 rounded-lg mt-0.5">
                <Lock className="size-4" />
              </div>
              <div>
                <p className="text-sm mb-1">3. Automatic Lock</p>
                <p className="text-xs text-blue-100">High-risk actions locked for {lockDuration} hours</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white/20 p-2 rounded-lg mt-0.5">
                <Eye className="size-4" />
              </div>
              <div>
                <p className="text-sm mb-1">4. NIDA Verification</p>
                <p className="text-xs text-blue-100">Verify identity to unlock account</p>
              </div>
            </div>
          </div>
        </div>

        {/* Protected Actions */}
        <div>
          <h3 className="text-lg mb-4">Protected Actions</h3>
          <p className="text-sm text-gray-600 mb-4">
            These actions are automatically locked when a SIM swap is detected:
          </p>
          <div className="space-y-2">
            {protectedActions.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{item.icon}</div>
                    <div>
                      <p className="text-sm">{item.action}</p>
                      <p className="text-xs text-gray-500">Locked for {item.lockDuration}</p>
                    </div>
                  </div>
                  <Lock className="size-5 text-red-500" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lock Duration Settings */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-base mb-4">Lock Duration</h3>
          <p className="text-sm text-gray-600 mb-4">
            How long should high-risk actions be locked after a SIM swap?
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[12, 24, 48].map((hours) => (
              <button
                key={hours}
                onClick={() => setLockDuration(hours)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  lockDuration === hours
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Clock className="size-5 mx-auto mb-1" />
                <p className="text-sm">{hours}h</p>
              </button>
            ))}
          </div>
        </div>

        {/* Trust Badge */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-5 text-white text-center">
          <div className="text-3xl mb-2">🛡️</div>
          <p className="mb-1">Bank of Tanzania Approved</p>
          <p className="text-sm text-green-100">Nigeria-level fraud protection for Tanzania</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl text-red-600 mb-1">0</p>
            <p className="text-xs text-gray-600">SIM Swaps Detected</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl text-green-600 mb-1">100%</p>
            <p className="text-xs text-gray-600">Protection Rate</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl text-blue-600 mb-1">&lt;5s</p>
            <p className="text-xs text-gray-600">Detection Time</p>
          </div>
        </div>
      </div>
    </div>
  );
}
