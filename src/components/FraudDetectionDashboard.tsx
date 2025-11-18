import { ArrowLeft, Shield, AlertTriangle, TrendingUp, Users, DollarSign, MapPin, Smartphone, Activity, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface FraudDetectionDashboardProps {
  onBack: () => void;
}

interface FraudAlert {
  id: string;
  type: 'sim_swap' | 'location_anomaly' | 'velocity' | 'device_mismatch' | 'social_engineering' | 'unusual_pattern';
  severity: 'low' | 'medium' | 'high' | 'critical';
  user: string;
  amount?: number;
  description: string;
  timestamp: Date;
  status: 'pending' | 'reviewed' | 'blocked' | 'approved';
  aiConfidence: number;
}

export function FraudDetectionDashboard({ onBack }: FraudDetectionDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'patterns' | 'compliance'>('overview');

  const stats = {
    transactionsToday: 15420,
    fraudBlocked: 47,
    flaggedForReview: 23,
    falsePositives: 2,
    aiAccuracy: 96.8,
    amountProtected: 12500000
  };

  const fraudAlerts: FraudAlert[] = [
    {
      id: '1',
      type: 'sim_swap',
      severity: 'critical',
      user: 'John M. (+255 712 345 678)',
      amount: 500000,
      description: 'SIM card changed 2 hours before large withdrawal attempt',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      status: 'blocked',
      aiConfidence: 98
    },
    {
      id: '2',
      type: 'location_anomaly',
      severity: 'high',
      user: 'Sarah K. (+255 754 321 987)',
      amount: 250000,
      description: 'Impossible travel: Dar es Salaam to Mwanza in 30 minutes',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      status: 'pending',
      aiConfidence: 94
    },
    {
      id: '3',
      type: 'velocity',
      severity: 'medium',
      user: 'Ahmed H. (+255 768 543 210)',
      amount: 50000,
      description: '15 small transactions in 10 minutes',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      status: 'reviewed',
      aiConfidence: 87
    },
    {
      id: '4',
      type: 'device_mismatch',
      severity: 'high',
      user: 'Grace L. (+255 789 012 345)',
      amount: 1000000,
      description: 'Login from new device + high-value transaction',
      timestamp: new Date(Date.now() - 1000 * 60 * 180),
      status: 'pending',
      aiConfidence: 91
    }
  ];

  const patterns = [
    {
      id: '1',
      name: 'Merchant Fraud Ring',
      type: 'Coordinated activity',
      suspects: 8,
      totalAmount: 3500000,
      confidence: 89,
      description: '8 merchants showing identical suspicious patterns'
    },
    {
      id: '2',
      name: 'Account Takeover Campaign',
      type: 'Credential stuffing',
      suspects: 23,
      totalAmount: 0,
      confidence: 76,
      description: 'Multiple login attempts with leaked passwords'
    },
    {
      id: '3',
      name: 'Money Mule Network',
      type: 'Money laundering',
      suspects: 15,
      totalAmount: 12000000,
      confidence: 94,
      description: 'Rapid movement of funds through multiple accounts'
    }
  ];

  const complianceReports = [
    {
      id: '1',
      type: 'STR',
      title: 'Suspicious Transaction Report',
      count: 12,
      status: 'pending',
      deadline: '2024-11-25'
    },
    {
      id: '2',
      type: 'LTR',
      title: 'Large Transaction Report',
      count: 45,
      status: 'submitted',
      deadline: '2024-11-20'
    },
    {
      id: '3',
      type: 'KYC',
      title: 'KYC Re-verification Due',
      count: 234,
      status: 'in_progress',
      deadline: '2024-12-01'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'blocked': return 'bg-red-100 text-red-700';
      case 'approved': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getFraudTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      sim_swap: '📱 SIM Swap',
      location_anomaly: '📍 Location Anomaly',
      velocity: '⚡ Velocity Check',
      device_mismatch: '📲 Device Mismatch',
      social_engineering: '🎣 Social Engineering',
      unusual_pattern: '🔍 Unusual Pattern'
    };
    return labels[type] || type;
  };

  if (activeTab === 'overview') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="size-6" />
              </button>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">Fraud Detection</h1>
                <p className="text-sm text-gray-600">AI-powered security monitoring</p>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {['overview', 'alerts', 'patterns', 'compliance'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold transition-all ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6 pb-24">
          {/* AI Protection Banner */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-xl flex items-center justify-center">
                <Shield className="size-8" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1">AI Protection Active</h2>
                <p className="text-sm text-white/90">Real-time fraud monitoring</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <p className="text-xs text-white/80 mb-1">AI Accuracy</p>
                <p className="text-2xl font-bold">{stats.aiAccuracy}%</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <p className="text-xs text-white/80 mb-1">Protected Today</p>
                <p className="text-2xl font-bold">TZS {(stats.amountProtected / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-4 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="size-5 text-blue-600" />
                <p className="text-sm text-gray-600">Transactions</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.transactionsToday.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">↑ 12% vs yesterday</p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="size-5 text-red-600" />
                <p className="text-sm text-gray-600">Fraud Blocked</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.fraudBlocked}</p>
              <p className="text-xs text-red-600 mt-1">↓ 8% vs yesterday</p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="size-5 text-amber-600" />
                <p className="text-sm text-gray-600">For Review</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.flaggedForReview}</p>
              <p className="text-xs text-amber-600 mt-1">Requires attention</p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="size-5 text-green-600" />
                <p className="text-sm text-gray-600">False Positives</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.falsePositives}</p>
              <p className="text-xs text-green-600 mt-1">↓ 50% vs last week</p>
            </div>
          </div>

          {/* Recent Critical Alerts */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Critical Alerts</h3>
              <button 
                onClick={() => setActiveTab('alerts')}
                className="text-sm font-semibold text-blue-600"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {fraudAlerts.filter(a => a.severity === 'critical' || a.severity === 'high').slice(0, 3).map(alert => (
                <div key={alert.id} className="bg-white rounded-2xl p-4 shadow-md border-l-4 border-red-500">
                  <div className="flex items-start gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${getSeverityColor(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-bold text-gray-900">{getFraudTypeLabel(alert.type)}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(alert.status)}`}>
                          {alert.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 mb-1">{alert.user}</p>
                      <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                      {alert.amount && (
                        <p className="text-sm font-bold text-gray-900">Amount: TZS {alert.amount.toLocaleString()}</p>
                      )}
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span>{alert.timestamp.toLocaleTimeString()}</span>
                        <span>AI Confidence: {alert.aiConfidence}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Protection Systems */}
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <h3 className="font-bold text-gray-900 mb-4">Active Protection Systems</h3>
            <div className="space-y-3">
              {[
                { name: 'SIM Swap Detection', status: 'active', icon: '📱' },
                { name: 'Location Anomaly AI', status: 'active', icon: '📍' },
                { name: 'Velocity Monitoring', status: 'active', icon: '⚡' },
                { name: 'Device Fingerprinting', status: 'active', icon: '📲' },
                { name: 'Behavioral Biometrics', status: 'active', icon: '👤' },
                { name: 'Transaction Pattern AI', status: 'active', icon: '🧠' }
              ].map((system, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{system.icon}</span>
                    <span className="font-semibold text-gray-900">{system.name}</span>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-bold">
                    ACTIVE
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'alerts') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="size-6" />
              </button>
              <h1 className="text-2xl font-bold flex-1">Fraud Alerts</h1>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {['overview', 'alerts', 'patterns', 'compliance'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold transition-all ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-3 pb-24">
          {fraudAlerts.map(alert => (
            <div key={alert.id} className="bg-white rounded-3xl p-6 shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getSeverityColor(alert.severity)}`}>
                  {alert.severity.toUpperCase()}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(alert.status)}`}>
                  {alert.status.toUpperCase()}
                </span>
              </div>

              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{getFraudTypeLabel(alert.type)}</h3>
                <p className="text-gray-900 mb-1">{alert.user}</p>
                <p className="text-sm text-gray-600 mb-3">{alert.description}</p>
                
                {alert.amount && (
                  <div className="bg-gray-50 rounded-xl p-3 mb-3">
                    <p className="text-xs text-gray-600 mb-1">Transaction Amount</p>
                    <p className="text-2xl font-bold text-gray-900">TZS {alert.amount.toLocaleString()}</p>
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="size-3" />
                    <span>{alert.timestamp.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="size-3" />
                    <span>AI: {alert.aiConfidence}%</span>
                  </div>
                </div>
              </div>

              {alert.status === 'pending' && (
                <div className="grid grid-cols-2 gap-2">
                  <Button className="h-10 rounded-full bg-red-600 hover:bg-red-700 text-white">
                    Block Transaction
                  </Button>
                  <Button variant="outline" className="h-10 rounded-full border-2">
                    Approve
                  </Button>
                </div>
              )}

              {alert.status === 'blocked' && (
                <div className="bg-red-50 rounded-xl p-3 border border-red-200">
                  <p className="text-sm text-red-800">✓ Transaction blocked by AI</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'patterns') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="size-6" />
              </button>
              <h1 className="text-2xl font-bold flex-1">Fraud Patterns</h1>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {['overview', 'alerts', 'patterns', 'compliance'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold transition-all ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-4 pb-24">
          {patterns.map(pattern => (
            <div key={pattern.id} className="bg-white rounded-3xl p-6 shadow-md">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-red-100 w-14 h-14 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="size-7 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{pattern.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{pattern.type}</p>
                  <p className="text-sm text-gray-700">{pattern.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1">Suspects</p>
                  <p className="text-xl font-bold text-gray-900">{pattern.suspects}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1">Total Amount</p>
                  <p className="text-xl font-bold text-gray-900">
                    {pattern.totalAmount > 0 ? `${(pattern.totalAmount / 1000000).toFixed(1)}M` : 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1">Confidence</p>
                  <p className="text-xl font-bold text-gray-900">{pattern.confidence}%</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 h-10 rounded-full">Investigate</Button>
                <Button variant="outline" className="flex-1 h-10 rounded-full border-2">
                  Generate STR
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Compliance Tab
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-2xl font-bold flex-1">BoT Compliance</h1>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {['overview', 'alerts', 'patterns', 'compliance'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6 pb-24">
        {/* Compliance Banner */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-xl flex items-center justify-center">
              <Shield className="size-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">BoT Compliance Status</h2>
              <p className="text-sm text-white/90">All regulatory requirements met</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <p className="text-xs text-white/90">✓ AML/CFT Compliant • ISO 27001 Ready • FIU Reporting Active</p>
          </div>
        </div>

        {/* Compliance Reports */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4">Regulatory Reports</h3>
          <div className="space-y-3">
            {complianceReports.map(report => (
              <div key={report.id} className="bg-white rounded-3xl p-6 shadow-md">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-bold">
                        {report.type}
                      </span>
                      <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                        report.status === 'submitted' ? 'bg-green-100 text-green-700' :
                        report.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {report.status.toUpperCase()}
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">{report.title}</h4>
                    <p className="text-sm text-gray-600">{report.count} items</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Deadline</span>
                    <span className="text-sm font-bold text-gray-900">{report.deadline}</span>
                  </div>
                </div>

                <Button className="w-full h-10 rounded-full">
                  {report.status === 'submitted' ? 'View Report' : 'Generate Report'}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* AML Requirements */}
        <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
          <h3 className="font-semibold text-green-900 mb-3">AML/CFT Requirements</h3>
          <ul className="space-y-2 text-sm text-green-800">
            <li className="flex items-start gap-2">
              <CheckCircle className="size-4 text-green-600 mt-0.5" />
              <span>Customer Due Diligence (CDD) - Active</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="size-4 text-green-600 mt-0.5" />
              <span>Enhanced Due Diligence (EDD) for high-risk</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="size-4 text-green-600 mt-0.5" />
              <span>Transaction monitoring & reporting</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="size-4 text-green-600 mt-0.5" />
              <span>Record keeping (5+ years)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="size-4 text-green-600 mt-0.5" />
              <span>STR/LTR submission to FIU</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
