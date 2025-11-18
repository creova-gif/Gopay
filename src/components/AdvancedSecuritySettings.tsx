import { ArrowLeft, Shield, Lock, Smartphone, AlertTriangle, CheckCircle, Eye, EyeOff, Fingerprint, Key, MapPin, Bell, Users, Clock, Zap, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface AdvancedSecuritySettingsProps {
  onBack: () => void;
}

export function AdvancedSecuritySettings({ onBack }: AdvancedSecuritySettingsProps) {
  const [activeTab, setActiveTab] = useState<'authentication' | 'devices' | 'transaction' | 'privacy'>('authentication');
  
  // Authentication States
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [pinEnabled, setPinEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [autoLockTime, setAutoLockTime] = useState('30');
  
  // Device Security
  const [rootDetection, setRootDetection] = useState(true);
  const [screenRecordBlock, setScreenRecordBlock] = useState(true);
  const [appCloningDetection, setAppCloningDetection] = useState(true);
  const [trustedDevicesOnly, setTrustedDevicesOnly] = useState(false);
  
  // Transaction Security
  const [transactionPinRequired, setTransactionPinRequired] = useState(true);
  const [dailyLimit, setDailyLimit] = useState('5000000');
  const [nighttimeBlock, setNighttimeBlock] = useState(false);
  const [whitelistOnly, setWhitelistOnly] = useState(false);
  const [fraudAIEnabled, setFraudAIEnabled] = useState(true);
  
  // Privacy & Location
  const [antiGPSSpoofing, setAntiGPSSpoofing] = useState(true);
  const [locationEncryption, setLocationEncryption] = useState(true);
  const [vpnDetection, setVpnDetection] = useState(true);
  
  const [deviceTrustScore, setDeviceTrustScore] = useState(95);
  const [securityScore, setSecurityScore] = useState(92);

  const trustedDevices = [
    {
      id: '1',
      name: 'iPhone 14 Pro',
      lastActive: '2 minutes ago',
      location: 'Dar es Salaam, Tanzania',
      trustScore: 98,
      current: true
    },
    {
      id: '2',
      name: 'Samsung Galaxy S23',
      lastActive: '3 days ago',
      location: 'Arusha, Tanzania',
      trustScore: 85,
      current: false
    }
  ];

  const recentSecurityEvents = [
    {
      id: '1',
      type: 'login',
      message: 'Successful login from trusted device',
      timestamp: '2 minutes ago',
      severity: 'info'
    },
    {
      id: '2',
      type: 'fraud_blocked',
      message: 'Suspicious transaction blocked by AI',
      timestamp: '1 hour ago',
      severity: 'warning'
    },
    {
      id: '3',
      type: 'location',
      message: 'GPS spoofing attempt detected and blocked',
      timestamp: '5 hours ago',
      severity: 'danger'
    }
  ];

  if (activeTab === 'authentication') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="size-6" />
              </button>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">Advanced Security</h1>
                <p className="text-sm text-gray-600">Bank-grade protection</p>
              </div>
              <div className={`px-4 py-2 rounded-full ${
                securityScore >= 90 ? 'bg-green-100' :
                securityScore >= 70 ? 'bg-amber-100' :
                'bg-red-100'
              }`}>
                <p className="text-xs font-semibold ${
                  securityScore >= 90 ? 'text-green-700' :
                  securityScore >= 70 ? 'text-amber-700' :
                  'text-red-700'
                }">
                  {securityScore}% Secure
                </p>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setActiveTab('authentication')}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold transition-all ${
                  activeTab === 'authentication'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Authentication
              </button>
              <button
                onClick={() => setActiveTab('devices')}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold transition-all ${
                  activeTab === 'devices'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Devices
              </button>
              <button
                onClick={() => setActiveTab('transaction')}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold transition-all ${
                  activeTab === 'transaction'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Transactions
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold transition-all ${
                  activeTab === 'privacy'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Privacy
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6 pb-24">
          {/* Security Score Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-3xl p-6 shadow-xl">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-xl flex items-center justify-center">
                <Shield className="size-8" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">Security Status</h2>
                <p className="text-sm text-white/90">
                  Your account meets BoT security standards
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Security Score</span>
                <span className="text-2xl font-bold">{securityScore}%</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${securityScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Biometric Authentication */}
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center">
                  <Fingerprint className="size-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Biometric Lock</h3>
                  <p className="text-sm text-gray-600">Face ID / Fingerprint</p>
                </div>
              </div>
              <button
                onClick={() => setBiometricEnabled(!biometricEnabled)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  biometricEnabled ? 'bg-green-600' : 'bg-gray-300'
                }`}
                role="switch"
                aria-checked={biometricEnabled}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    biometricEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            {biometricEnabled && (
              <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                <p className="text-xs text-green-800">
                  ✓ Secure Enclave enabled • Hardware-protected keys
                </p>
              </div>
            )}
          </div>

          {/* App PIN */}
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center">
                  <Lock className="size-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">App PIN Lock</h3>
                  <p className="text-sm text-gray-600">6-digit PIN required</p>
                </div>
              </div>
              <button
                onClick={() => setPinEnabled(!pinEnabled)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  pinEnabled ? 'bg-green-600' : 'bg-gray-300'
                }`}
                role="switch"
                aria-checked={pinEnabled}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    pinEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            {pinEnabled && (
              <Button className="w-full h-12 rounded-full" variant="outline">
                Change PIN
              </Button>
            )}
          </div>

          {/* Two-Factor Authentication */}
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center">
                  <Smartphone className="size-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Two-Factor Auth (2FA)</h3>
                  <p className="text-sm text-gray-600">SMS + Biometric</p>
                </div>
              </div>
              <button
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  twoFactorEnabled ? 'bg-green-600' : 'bg-gray-300'
                }`}
                role="switch"
                aria-checked={twoFactorEnabled}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    twoFactorEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            {twoFactorEnabled && (
              <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                <p className="text-xs text-green-800">
                  ✓ Required for high-value transactions • BoT compliant
                </p>
              </div>
            )}
          </div>

          {/* Auto-Lock Timer */}
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-amber-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <Clock className="size-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Auto-Lock Timer</h3>
                <p className="text-sm text-gray-600">Lock after inactivity</p>
              </div>
            </div>
            
            <div className="space-y-2">
              {['30', '60', '120', '300'].map(seconds => (
                <button
                  key={seconds}
                  onClick={() => setAutoLockTime(seconds)}
                  className={`w-full p-3 rounded-xl transition-all ${
                    autoLockTime === seconds
                      ? 'bg-blue-100 border-2 border-blue-600'
                      : 'bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <span className={`font-semibold ${
                    autoLockTime === seconds ? 'text-blue-900' : 'text-gray-700'
                  }`}>
                    {parseInt(seconds) < 60 ? `${seconds} seconds` : `${parseInt(seconds) / 60} minutes`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Password Reset */}
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <Key className="size-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">Password & Recovery</h3>
                <p className="text-sm text-gray-600">NIDA-verified reset only</p>
              </div>
            </div>
            <div className="space-y-2">
              <Button className="w-full h-12 rounded-full" variant="outline">
                Change Password
              </Button>
              <Button className="w-full h-12 rounded-full" variant="outline">
                Setup Recovery (NIDA)
              </Button>
            </div>
          </div>

          {/* Security Recommendations */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3">BoT Security Standards</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>End-to-end encryption (AES-256 + TLS 1.3)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Hardware key storage (Secure Enclave)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Password hashing (Argon2id)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Real-time fraud monitoring (AI-powered)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'devices') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="size-6" />
              </button>
              <h1 className="text-2xl font-bold flex-1">Device Security</h1>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setActiveTab('authentication')}
                className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-semibold whitespace-nowrap"
              >
                Authentication
              </button>
              <button
                onClick={() => setActiveTab('devices')}
                className="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold whitespace-nowrap"
              >
                Devices
              </button>
              <button
                onClick={() => setActiveTab('transaction')}
                className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-semibold whitespace-nowrap"
              >
                Transactions
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-semibold whitespace-nowrap"
              >
                Privacy
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6 pb-24">
          {/* Device Trust Score */}
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-xl flex items-center justify-center">
                <Smartphone className="size-8" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1">Device Trust Score</h2>
                <p className="text-sm text-white/90">This device reputation</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Trust Level</span>
                <span className="text-2xl font-bold">{deviceTrustScore}%</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full"
                  style={{ width: `${deviceTrustScore}%` }}
                />
              </div>
              <p className="text-xs text-white/80 mt-3">
                ✓ Clean device • No rooting • No tampering detected
              </p>
            </div>
          </div>

          {/* Root/Jailbreak Detection */}
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 w-12 h-12 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="size-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Root Detection</h3>
                  <p className="text-sm text-gray-600">Block rooted/jailbroken devices</p>
                </div>
              </div>
              <button
                onClick={() => setRootDetection(!rootDetection)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  rootDetection ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    rootDetection ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            {rootDetection && (
              <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                <p className="text-xs text-green-800">
                  ✓ Active • Payments blocked on compromised devices
                </p>
              </div>
            )}
          </div>

          {/* Screen Recording Block */}
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center">
                  <Eye className="size-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Screen Protection</h3>
                  <p className="text-sm text-gray-600">Block screenshots & recording</p>
                </div>
              </div>
              <button
                onClick={() => setScreenRecordBlock(!screenRecordBlock)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  screenRecordBlock ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    screenRecordBlock ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            {screenRecordBlock && (
              <div className="bg-purple-50 rounded-xl p-3 border border-purple-200">
                <p className="text-xs text-purple-800">
                  ✓ Wallet & QR screens cannot be captured
                </p>
              </div>
            )}
          </div>

          {/* App Cloning Detection */}
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-amber-100 w-12 h-12 rounded-xl flex items-center justify-center">
                  <Settings className="size-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Clone Detection</h3>
                  <p className="text-sm text-gray-600">Block dual apps & parallel space</p>
                </div>
              </div>
              <button
                onClick={() => setAppCloningDetection(!appCloningDetection)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  appCloningDetection ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    appCloningDetection ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Trusted Devices */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Trusted Devices</h3>
            <div className="space-y-3">
              {trustedDevices.map(device => (
                <div key={device.id} className="bg-white rounded-3xl p-6 shadow-md">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      device.current ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Smartphone className={`size-6 ${
                        device.current ? 'text-green-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900">{device.name}</h4>
                        {device.current && (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">
                            CURRENT
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{device.location}</p>
                      <p className="text-xs text-gray-500">{device.lastActive}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3 mb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Trust Score</span>
                      <span className="text-sm font-bold text-gray-900">{device.trustScore}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                      <div 
                        className={`h-full rounded-full ${
                          device.trustScore >= 90 ? 'bg-green-600' :
                          device.trustScore >= 70 ? 'bg-amber-600' :
                          'bg-red-600'
                        }`}
                        style={{ width: `${device.trustScore}%` }}
                      />
                    </div>
                  </div>

                  {!device.current && (
                    <Button variant="outline" className="w-full h-10 rounded-full text-red-600 border-red-200">
                      Remove Device
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Runtime Integrity */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3">Runtime Protection Active</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-blue-600 mt-0.5" />
                <span>Memory tampering detection</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-blue-600 mt-0.5" />
                <span>Code injection prevention</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-blue-600 mt-0.5" />
                <span>Hooking framework blocking (Frida/Xposed)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-blue-600 mt-0.5" />
                <span>Certificate pinning enabled</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'transaction') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="size-6" />
              </button>
              <h1 className="text-2xl font-bold flex-1">Transaction Security</h1>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setActiveTab('authentication')}
                className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-semibold whitespace-nowrap"
              >
                Authentication
              </button>
              <button
                onClick={() => setActiveTab('devices')}
                className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-semibold whitespace-nowrap"
              >
                Devices
              </button>
              <button
                onClick={() => setActiveTab('transaction')}
                className="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold whitespace-nowrap"
              >
                Transactions
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-semibold whitespace-nowrap"
              >
                Privacy
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6 pb-24">
          {/* AI Fraud Engine */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-xl flex items-center justify-center">
                <Zap className="size-8" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1">AI Fraud Engine</h2>
                <p className="text-sm text-white/90">Real-time protection</p>
              </div>
              <button
                onClick={() => setFraudAIEnabled(!fraudAIEnabled)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  fraudAIEnabled ? 'bg-white/30' : 'bg-white/10'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    fraudAIEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            {fraudAIEnabled && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <p className="text-xs mb-3">Protected Against:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>✓ SIM swap fraud</div>
                  <div>✓ Social engineering</div>
                  <div>✓ Device mismatch</div>
                  <div>✓ Location anomalies</div>
                  <div>✓ Unusual patterns</div>
                  <div>✓ Velocity checks</div>
                </div>
              </div>
            )}
          </div>

          {/* Transaction PIN */}
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center">
                  <Lock className="size-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Transaction PIN</h3>
                  <p className="text-sm text-gray-600">Required for all payments</p>
                </div>
              </div>
              <button
                onClick={() => setTransactionPinRequired(!transactionPinRequired)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  transactionPinRequired ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    transactionPinRequired ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Daily Limit */}
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-amber-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <Settings className="size-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Daily Transaction Limit</h3>
                <p className="text-sm text-gray-600">Protect from large fraud</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-600 mb-2">Current Limit</p>
              <p className="text-3xl font-bold text-gray-900">
                TZS {parseInt(dailyLimit).toLocaleString()}
              </p>
            </div>

            <div className="space-y-2">
              {['1000000', '5000000', '10000000', '50000000'].map(limit => (
                <button
                  key={limit}
                  onClick={() => setDailyLimit(limit)}
                  className={`w-full p-3 rounded-xl transition-all ${
                    dailyLimit === limit
                      ? 'bg-amber-100 border-2 border-amber-600'
                      : 'bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <span className={`font-semibold ${
                    dailyLimit === limit ? 'text-amber-900' : 'text-gray-700'
                  }`}>
                    TZS {parseInt(limit).toLocaleString()}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Financial Firewall Mode */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Financial Firewall</h3>
            
            {/* Nighttime Block */}
            <div className="bg-white rounded-3xl p-6 shadow-md mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 w-12 h-12 rounded-xl flex items-center justify-center">
                    <Clock className="size-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Nighttime Block</h4>
                    <p className="text-sm text-gray-600">No payments 11 PM - 6 AM</p>
                  </div>
                </div>
                <button
                  onClick={() => setNighttimeBlock(!nighttimeBlock)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    nighttimeBlock ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      nighttimeBlock ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Whitelist Only */}
            <div className="bg-white rounded-3xl p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center">
                    <Users className="size-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Whitelist Mode</h4>
                    <p className="text-sm text-gray-600">Only approved recipients</p>
                  </div>
                </div>
                <button
                  onClick={() => setWhitelistOnly(!whitelistOnly)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    whitelistOnly ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      whitelistOnly ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Security Events */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Recent Security Events</h3>
            <div className="space-y-3">
              {recentSecurityEvents.map(event => (
                <div key={event.id} className="bg-white rounded-2xl p-4 shadow-md">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      event.severity === 'info' ? 'bg-blue-100' :
                      event.severity === 'warning' ? 'bg-amber-100' :
                      'bg-red-100'
                    }`}>
                      <AlertTriangle className={`size-5 ${
                        event.severity === 'info' ? 'text-blue-600' :
                        event.severity === 'warning' ? 'text-amber-600' :
                        'text-red-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm mb-1">{event.message}</p>
                      <p className="text-xs text-gray-500">{event.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Privacy Tab
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-2xl font-bold flex-1">Privacy & Location</h1>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveTab('authentication')}
              className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-semibold whitespace-nowrap"
            >
              Authentication
            </button>
            <button
              onClick={() => setActiveTab('devices')}
              className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-semibold whitespace-nowrap"
            >
              Devices
            </button>
            <button
              onClick={() => setActiveTab('transaction')}
              className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-semibold whitespace-nowrap"
            >
              Transactions
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold whitespace-nowrap"
            >
              Privacy
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6 pb-24">
        {/* Anti-GPS Spoofing */}
        <div className="bg-white rounded-3xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <MapPin className="size-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Anti-GPS Spoofing</h3>
                <p className="text-sm text-gray-600">Block fake location apps</p>
              </div>
            </div>
            <button
              onClick={() => setAntiGPSSpoofing(!antiGPSSpoofing)}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                antiGPSSpoofing ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  antiGPSSpoofing ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          {antiGPSSpoofing && (
            <div className="bg-red-50 rounded-xl p-3 border border-red-200">
              <p className="text-xs text-red-800">
                ✓ Mock location detection • Magnetometer validation
              </p>
            </div>
          )}
        </div>

        {/* Location Encryption */}
        <div className="bg-white rounded-3xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <Lock className="size-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Location Encryption</h3>
                <p className="text-sm text-gray-600">Encrypt GPS before sending</p>
              </div>
            </div>
            <button
              onClick={() => setLocationEncryption(!locationEncryption)}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                locationEncryption ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  locationEncryption ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* VPN Detection */}
        <div className="bg-white rounded-3xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <Shield className="size-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">VPN/Proxy Detection</h3>
                <p className="text-sm text-gray-600">Block suspicious connections</p>
              </div>
            </div>
            <button
              onClick={() => setVpnDetection(!vpnDetection)}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                vpnDetection ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  vpnDetection ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Privacy Info */}
        <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
          <h3 className="font-semibold text-green-900 mb-3">Location Privacy</h3>
          <ul className="space-y-2 text-sm text-green-800">
            <li className="flex items-start gap-2">
              <CheckCircle className="size-4 text-green-600 mt-0.5" />
              <span>No raw GPS coordinates stored</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="size-4 text-green-600 mt-0.5" />
              <span>Converted to hashed zones for privacy</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="size-4 text-green-600 mt-0.5" />
              <span>Auto-delete after 30-90 days</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="size-4 text-green-600 mt-0.5" />
              <span>Encrypted in transit (TLS 1.3)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
