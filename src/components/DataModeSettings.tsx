import { useState } from 'react';
import { ArrowLeft, Database, Cloud, Wifi, WifiOff, AlertCircle, CheckCircle, Settings, Info, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { isDemoMode } from '../utils/dataService';

interface DataModeSettingsProps {
  accessToken: string;
  onBack: () => void;
  onSwitchMode: (mode: 'demo' | 'real') => void;
}

export function DataModeSettings({ accessToken, onBack, onSwitchMode }: DataModeSettingsProps) {
  const [isDemo, setIsDemo] = useState(isDemoMode(accessToken));
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingMode, setPendingMode] = useState<'demo' | 'real'>('demo');

  const handleSwitchMode = (mode: 'demo' | 'real') => {
    setPendingMode(mode);
    setShowConfirmation(true);
  };

  const confirmSwitch = () => {
    setIsDemo(pendingMode === 'demo');
    onSwitchMode(pendingMode);
    setShowConfirmation(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative text-white p-6 pb-8">
          <div className="flex items-center justify-between mb-6">
            <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full transition-all">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="text-center flex-1">
              <h1 className="text-2xl font-bold">Data Mode</h1>
              <p className="text-sm text-purple-100">Choose your data source</p>
            </div>
            <div className="w-10" />
          </div>

          {/* Current Status */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isDemo ? 'bg-orange-500' : 'bg-green-500'
              }`}>
                {isDemo ? <WifiOff className="w-6 h-6 text-white" /> : <Wifi className="w-6 h-6 text-white" />}
              </div>
              <div className="flex-1">
                <div className="text-sm text-white/80">Currently Active</div>
                <div className="text-xl font-bold">{isDemo ? 'Demo Mode' : 'Real Data Mode'}</div>
              </div>
              <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                isDemo ? 'bg-orange-400' : 'bg-green-400'
              } text-white`}>
                {isDemo ? 'OFFLINE' : 'LIVE'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-4 pb-8 space-y-6">
        {/* Demo Mode Card */}
        <button
          onClick={() => !isDemo && handleSwitchMode('demo')}
          disabled={isDemo}
          className={`w-full ${isDemo ? 'cursor-default' : 'cursor-pointer'}`}
        >
          <div className={`rounded-3xl p-1 shadow-lg transition-all ${
            isDemo 
              ? 'bg-gradient-to-r from-orange-500 to-red-600 shadow-orange-200' 
              : 'bg-gray-200 hover:shadow-xl'
          }`}>
            <div className="bg-white rounded-[22px] p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    isDemo ? 'bg-gradient-to-br from-orange-500 to-red-600' : 'bg-gray-200'
                  }`}>
                    <WifiOff className={`w-7 h-7 ${isDemo ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold">Demo Mode</h3>
                    <p className="text-sm text-gray-500">100% Offline</p>
                  </div>
                </div>
                {isDemo && (
                  <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold">
                    ACTIVE
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold">No Internet Required</span>
                    <p className="text-gray-500">Works completely offline using browser storage</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold">Instant Testing</span>
                    <p className="text-gray-500">Perfect for demos and presentations</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold">Safe Sandbox</span>
                    <p className="text-gray-500">No real money or data at risk</p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-orange-800">
                    <span className="font-semibold">Demo Mode Features:</span>
                    <ul className="mt-1 space-y-1 text-orange-700">
                      <li>• Starting balance: TZS 100,000</li>
                      <li>• Demo PIN: 1234</li>
                      <li>• All data stored locally</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </button>

        {/* Real Data Mode Card */}
        <button
          onClick={() => isDemo && handleSwitchMode('real')}
          disabled={!isDemo}
          className={`w-full ${!isDemo ? 'cursor-default' : 'cursor-pointer'}`}
        >
          <div className={`rounded-3xl p-1 shadow-lg transition-all ${
            !isDemo 
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-200' 
              : 'bg-gray-200 hover:shadow-xl'
          }`}>
            <div className="bg-white rounded-[22px] p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    !isDemo ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gray-200'
                  }`}>
                    <Cloud className={`w-7 h-7 ${!isDemo ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold">Real Data Mode</h3>
                    <p className="text-sm text-gray-500">Live Backend</p>
                  </div>
                </div>
                {!isDemo && (
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-bold">
                    ACTIVE
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold">Real Transactions</span>
                    <p className="text-gray-500">Actual payments and money transfers</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold">Cloud Sync</span>
                    <p className="text-gray-500">Data synced across all devices</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold">Bank-Grade Security</span>
                    <p className="text-gray-500">Encrypted with BoT compliance</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <span className="font-semibold">Requirements:</span>
                    <ul className="mt-1 space-y-1 text-blue-700">
                      <li>• Active internet connection</li>
                      <li>• Valid user account with backend</li>
                      <li>• Real wallet with actual balance</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </button>

        {/* Comparison Table */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-gray-100">
          <h3 className="font-bold text-lg mb-4">Feature Comparison</h3>
          <div className="space-y-3">
            {[
              { feature: 'Internet Required', demo: 'No', real: 'Yes' },
              { feature: 'Real Money', demo: 'No', real: 'Yes' },
              { feature: 'Data Persistence', demo: 'Browser Only', real: 'Cloud' },
              { feature: 'Multi-Device Sync', demo: 'No', real: 'Yes' },
              { feature: 'Transaction Limits', demo: 'None', real: 'BoT Regulated' },
              { feature: 'Best For', demo: 'Testing & Demos', real: 'Production Use' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-700 font-medium">{item.feature}</span>
                <div className="flex gap-4">
                  <span className="text-sm text-orange-600 font-semibold w-24 text-center">{item.demo}</span>
                  <span className="text-sm text-green-600 font-semibold w-24 text-center">{item.real}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Warning */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-6 border-2 border-yellow-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-yellow-900 mb-1">Important Notice</h4>
              <p className="text-sm text-yellow-800 leading-relaxed">
                Switching to Real Data Mode will require a valid backend account. Make sure you have proper credentials before switching.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
              pendingMode === 'demo' 
                ? 'bg-gradient-to-br from-orange-500 to-red-600' 
                : 'bg-gradient-to-br from-green-500 to-emerald-600'
            }`}>
              {pendingMode === 'demo' ? (
                <WifiOff className="w-8 h-8 text-white" />
              ) : (
                <Cloud className="w-8 h-8 text-white" />
              )}
            </div>
            
            <h3 className="text-2xl font-bold text-center mb-2">
              Switch to {pendingMode === 'demo' ? 'Demo Mode' : 'Real Data Mode'}?
            </h3>
            
            <p className="text-gray-600 text-center mb-6">
              {pendingMode === 'demo' 
                ? 'This will switch to offline demo mode with sample data. Perfect for testing and presentations.'
                : 'This will connect to the live backend. Make sure you have a valid account and internet connection.'
              }
            </p>

            <div className="space-y-3">
              <Button
                onClick={confirmSwitch}
                className={`w-full h-12 rounded-2xl font-semibold shadow-lg ${
                  pendingMode === 'demo'
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90'
                } text-white`}
              >
                <Zap className="w-5 h-5 mr-2" />
                Confirm Switch
              </Button>
              <Button
                onClick={() => setShowConfirmation(false)}
                variant="outline"
                className="w-full h-12 rounded-2xl border-2 font-medium"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
