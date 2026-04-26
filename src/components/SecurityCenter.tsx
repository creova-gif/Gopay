import { ArrowLeft, Shield, AlertTriangle, CheckCircle, Lock, Eye, Smartphone, MapPin, Zap, Users, FileText, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface SecurityCenterProps {
  onBack: () => void;
  onNavigate: (page: 'advancedsecurity' | 'frauddetection' | 'enhancedkyc') => void;
}

export function SecurityCenter({ onBack, onNavigate }: SecurityCenterProps) {
  const [securityScore, setSecurityScore] = useState(94);

  const securityFeatures = [
    {
      id: 'encryption',
      name: 'End-to-End Encryption',
      description: 'AES-256 + TLS 1.3',
      status: 'active',
      icon: Lock,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'biometric',
      name: 'Biometric Authentication',
      description: 'Face ID + Fingerprint',
      status: 'active',
      icon: Smartphone,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'fraud_ai',
      name: 'AI Fraud Detection',
      description: '96.8% accuracy rate',
      status: 'active',
      icon: Zap,
      color: 'from-amber-500 to-orange-600'
    },
    {
      id: 'location',
      name: 'Anti-GPS Spoofing',
      description: 'Location protection',
      status: 'active',
      icon: MapPin,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'device',
      name: 'Device Security',
      description: 'Root/jailbreak detection',
      status: 'active',
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'kyc',
      name: 'Enhanced KYC',
      description: 'BoT compliant verification',
      status: 'active',
      icon: FileText,
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const securityStats = [
    {
      label: 'Transactions Protected',
      value: '15,420',
      change: '+12%',
      positive: true
    },
    {
      label: 'Fraud Blocked Today',
      value: '47',
      change: '-8%',
      positive: true
    },
    {
      label: 'Security Score',
      value: `${securityScore}%`,
      change: '+2%',
      positive: true
    },
    {
      label: 'BoT Compliance',
      value: '100%',
      change: 'Certified',
      positive: true
    }
  ];

  const quickActions = [
    {
      id: 'advanced',
      title: 'Advanced Security',
      subtitle: 'Manage auth, devices, transactions',
      icon: Settings,
      color: 'bg-gradient-to-br from-blue-600 to-blue-700',
      action: () => onNavigate('advancedsecurity')
    },
    {
      id: 'fraud',
      title: 'Fraud Detection',
      subtitle: 'View alerts & patterns',
      icon: AlertTriangle,
      color: 'bg-gradient-to-br from-purple-600 to-purple-700',
      action: () => onNavigate('advancedsecurity')
    },
    {
      id: 'kyc',
      title: 'KYC Verification',
      subtitle: 'Identity & compliance',
      icon: FileText,
      color: 'bg-gradient-to-br from-green-600 to-green-700',
      action: () => onNavigate('advancedsecurity')
    }
  ];

  const recentAlerts = [
    {
      id: '1',
      type: 'info',
      message: 'Successful login from trusted device',
      timestamp: '2 min ago'
    },
    {
      id: '2',
      type: 'warning',
      message: 'GPS spoofing attempt blocked',
      timestamp: '1 hour ago'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="size-6 text-gray-900" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Security Center</h1>
              <p className="text-sm text-gray-600">Bank-grade protection</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6 pb-24">
        {/* Security Score Banner */}
        <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-3xl p-6 shadow-2xl">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="size-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Security Status</h2>
              <p className="text-sm text-white/90 leading-relaxed">
                Your account meets Bank of Tanzania security standards
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Overall Security Score</span>
              <span className="text-3xl font-bold">{securityScore}%</span>
            </div>
            <div className="h-4 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${securityScore}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <p className="text-xs text-white/80 mb-1">Encryption</p>
              <p className="font-bold">AES-256</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <p className="text-xs text-white/80 mb-1">BoT Compliant</p>
              <p className="font-bold">✓ Certified</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          {securityStats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 shadow-md">
              <p className="text-xs text-gray-600 mb-2">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className={`text-xs ${
                stat.positive ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4">Security Management</h3>
          <div className="space-y-3">
            {quickActions.map(action => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={action.action}
                  className={`w-full ${action.color} text-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all`}
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="size-7" />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-bold text-lg mb-1">{action.title}</h4>
                      <p className="text-sm text-white/90">{action.subtitle}</p>
                    </div>
                    <div className="text-white/60">
                      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Features */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4">Active Protection Systems</h3>
          <div className="space-y-3">
            {securityFeatures.map(feature => {
              const Icon = feature.icon;
              return (
                <div key={feature.id} className="bg-white rounded-2xl p-4 shadow-md">
                  <div className="flex items-center gap-4">
                    <div className={`bg-gradient-to-br ${feature.color} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className="size-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{feature.name}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                    <div className="bg-green-100 px-3 py-1 rounded-full">
                      <p className="text-xs font-bold text-green-700">ACTIVE</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Alerts */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4">Recent Security Events</h3>
          <div className="space-y-3">
            {recentAlerts.map(alert => (
              <div key={alert.id} className="bg-white rounded-2xl p-4 shadow-md">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    alert.type === 'info' ? 'bg-blue-100' :
                    alert.type === 'warning' ? 'bg-amber-100' :
                    'bg-red-100'
                  }`}>
                    {alert.type === 'info' ? (
                      <CheckCircle className="size-5 text-blue-600" />
                    ) : (
                      <AlertTriangle className="size-5 text-amber-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm mb-1">{alert.message}</p>
                    <p className="text-xs text-gray-500">{alert.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BoT Compliance Badge */}
        <div className="bg-blue-50 rounded-3xl p-6 border-2 border-blue-200 text-center">
          <div className="bg-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="size-10 text-white" />
          </div>
          <h3 className="font-bold text-blue-900 mb-2 text-lg">Bank of Tanzania Certified</h3>
          <p className="text-sm text-blue-800 mb-4 leading-relaxed">
            This app meets all security requirements set by the Bank of Tanzania and Financial Intelligence Unit (FIU)
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white rounded-xl p-3">
              <p className="text-blue-600 font-bold">✓ AML/CFT</p>
            </div>
            <div className="bg-white rounded-xl p-3">
              <p className="text-blue-600 font-bold">✓ KYC/KYB</p>
            </div>
            <div className="bg-white rounded-xl p-3">
              <p className="text-blue-600 font-bold">✓ E2E Encryption</p>
            </div>
            <div className="bg-white rounded-xl p-3">
              <p className="text-blue-600 font-bold">✓ ISO 27001</p>
            </div>
          </div>
        </div>

        {/* Security Tips */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-6 border border-purple-200">
          <h3 className="font-bold text-purple-900 mb-4">Security Best Practices</h3>
          <ul className="space-y-3 text-sm text-purple-800">
            <li className="flex items-start gap-3">
              <div className="bg-purple-200 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-900 font-bold text-xs">1</span>
              </div>
              <span>Never share your PIN, password, or OTP codes with anyone</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-purple-200 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-900 font-bold text-xs">2</span>
              </div>
              <span>Enable biometric authentication for extra security</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-purple-200 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-900 font-bold text-xs">3</span>
              </div>
              <span>Review your transaction history regularly</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-purple-200 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-900 font-bold text-xs">4</span>
              </div>
              <span>Report suspicious activity immediately</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-purple-200 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-900 font-bold text-xs">5</span>
              </div>
              <span>Keep your app updated to the latest version</span>
            </li>
          </ul>
        </div>

        {/* Emergency Contact */}
        <div className="bg-red-50 rounded-2xl p-6 border border-red-200 text-center">
          <AlertTriangle className="size-12 text-red-600 mx-auto mb-3" />
          <h3 className="font-bold text-red-900 mb-2">Security Emergency?</h3>
          <p className="text-sm text-red-800 mb-4">
            If you suspect unauthorized access or fraud
          </p>
          <div className="space-y-2">
            <Button className="w-full h-12 rounded-full bg-red-600 hover:bg-red-700 text-white">
              Report Security Issue
            </Button>
            <Button variant="outline" className="w-full h-12 rounded-full border-2 border-red-200">
              Emergency Lock Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}