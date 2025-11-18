import { ArrowLeft, MapPin, Shield, Eye, Trash2, Download, Lock, Bell, History, Target } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import {
  getLocationConsent,
  saveLocationConsent,
  LocationConsent,
  clearLocationHistory,
  getLocationHistory
} from '../utils/enhancedLocationService';

interface PrivacySettingsPageProps {
  onBack: () => void;
}

export function PrivacySettingsPage({ onBack }: PrivacySettingsPageProps) {
  const [consent, setConsent] = useState<LocationConsent>({
    foreground: false,
    background: false,
    marketing: false,
    analytics: true,
    history: false,
    lastUpdated: new Date().toISOString()
  });
  const [historyCount, setHistoryCount] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const savedConsent = getLocationConsent();
    if (savedConsent) {
      setConsent(savedConsent);
    }
    updateHistoryCount();
  }, []);

  const updateHistoryCount = () => {
    const history = getLocationHistory();
    setHistoryCount(history.length);
  };

  const handleToggle = (key: keyof LocationConsent) => {
    if (key === 'lastUpdated') return;

    const newConsent = {
      ...consent,
      [key]: !consent[key],
      lastUpdated: new Date().toISOString()
    };
    setConsent(newConsent);
    saveLocationConsent(newConsent);
  };

  const handleClearHistory = () => {
    clearLocationHistory();
    setHistoryCount(0);
    setShowDeleteConfirm(false);
  };

  const handleExportData = () => {
    const history = getLocationHistory();
    const dataStr = JSON.stringify({ consent, history }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gopay-location-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Privacy & Location</h1>
          </div>
          <p className="text-sm text-gray-600 ml-14">
            Manage your location data and privacy preferences
          </p>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6 pb-24">
        {/* Privacy Shield Banner */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-3xl p-6">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="size-7" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">Privacy-First Approach</h2>
              <p className="text-sm text-white/90 leading-relaxed">
                Your location data is encrypted, never sold, and you're always in control. Delete or export your data anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Location Permissions */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="size-5 text-green-600" />
              Location Permissions
            </h3>
          </div>

          <div className="divide-y divide-gray-100">
            <div className="px-6 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Foreground Location</h4>
                  <p className="text-sm text-gray-600">
                    Access location while using the app to show nearby services and attractions
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('foreground')}
                  className={`relative w-14 h-8 rounded-full transition-colors flex-shrink-0 ${
                    consent.foreground ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                  role="switch"
                  aria-checked={consent.foreground}
                  aria-label="Toggle foreground location"
                >
                  <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      consent.foreground ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Background Location</h4>
                  <p className="text-sm text-gray-600">
                    Optional: Enable for audio guides, safety alerts, and location-based features when app is closed
                  </p>
                  {consent.background && (
                    <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                      <span>⚡</span>
                      Uses minimal battery with efficient tracking
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleToggle('background')}
                  className={`relative w-14 h-8 rounded-full transition-colors flex-shrink-0 ${
                    consent.background ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  role="switch"
                  aria-checked={consent.background}
                  aria-label="Toggle background location"
                  disabled={!consent.foreground}
                >
                  <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      consent.background ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Data Usage Preferences */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Eye className="size-5 text-purple-600" />
              Data Usage Preferences
            </h3>
          </div>

          <div className="divide-y divide-gray-100">
            <div className="px-6 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Marketing & Promotions</h4>
                  <p className="text-sm text-gray-600">
                    Receive location-based offers, deals, and promotions from local merchants
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('marketing')}
                  className={`relative w-14 h-8 rounded-full transition-colors flex-shrink-0 ${
                    consent.marketing ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                  role="switch"
                  aria-checked={consent.marketing}
                  aria-label="Toggle marketing preferences"
                >
                  <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      consent.marketing ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Analytics & Insights</h4>
                  <p className="text-sm text-gray-600">
                    Help us improve the app with anonymized usage data
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('analytics')}
                  className={`relative w-14 h-8 rounded-full transition-colors flex-shrink-0 ${
                    consent.analytics ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  role="switch"
                  aria-checked={consent.analytics}
                  aria-label="Toggle analytics"
                >
                  <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      consent.analytics ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Location History</h4>
                  <p className="text-sm text-gray-600">
                    Store location history for personalized recommendations (auto-deleted after 90 days)
                  </p>
                  {consent.history && historyCount > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      Currently storing {historyCount} location points
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleToggle('history')}
                  className={`relative w-14 h-8 rounded-full transition-colors flex-shrink-0 ${
                    consent.history ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                  role="switch"
                  aria-checked={consent.history}
                  aria-label="Toggle location history"
                >
                  <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      consent.history ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Lock className="size-5 text-gray-700" />
              Data Management
            </h3>
          </div>

          <div className="p-4 space-y-3">
            <Button
              onClick={handleExportData}
              variant="outline"
              className="w-full h-14 rounded-2xl flex items-center justify-start gap-3 border-2 hover:bg-gray-50"
            >
              <div className="bg-blue-100 w-10 h-10 rounded-xl flex items-center justify-center">
                <Download className="size-5 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900">Export My Data</p>
                <p className="text-xs text-gray-600">Download all your location data</p>
              </div>
            </Button>

            <Button
              onClick={() => setShowDeleteConfirm(true)}
              variant="outline"
              className="w-full h-14 rounded-2xl flex items-center justify-start gap-3 border-2 hover:bg-red-50 border-red-200"
              disabled={historyCount === 0}
            >
              <div className="bg-red-100 w-10 h-10 rounded-xl flex items-center justify-center">
                <Trash2 className="size-5 text-red-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-red-600">Delete Location History</p>
                <p className="text-xs text-gray-600">
                  {historyCount > 0 ? `Remove all ${historyCount} stored locations` : 'No history to delete'}
                </p>
              </div>
            </Button>
          </div>
        </div>

        {/* Privacy Info */}
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Shield className="size-5" />
            How We Protect Your Privacy
          </h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">✓</span>
              <span>All location data is encrypted with AES-256 encryption</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">✓</span>
              <span>Analytics data is anonymized and aggregated (rounded to ~100m)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">✓</span>
              <span>Location history auto-deletes after 90 days</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">✓</span>
              <span>We never sell your data to third parties</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">✓</span>
              <span>Secure transmission over HTTPS/TLS 1.3</span>
            </li>
          </ul>
        </div>

        {/* Last Updated */}
        <div className="text-center text-xs text-gray-500">
          Privacy settings last updated: {new Date(consent.lastUpdated).toLocaleDateString('en-TZ', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="size-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                Delete Location History?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                This will permanently delete all {historyCount} stored location points. This action cannot be undone.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={handleClearHistory}
                  className="w-full bg-red-600 hover:bg-red-700 text-white h-12 rounded-full"
                >
                  Yes, Delete History
                </Button>
                <Button
                  onClick={() => setShowDeleteConfirm(false)}
                  variant="ghost"
                  className="w-full h-12 rounded-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
