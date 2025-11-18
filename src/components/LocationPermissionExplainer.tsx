import { MapPin, Shield, Percent, Navigation, X, Lock, Eye, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { LocationConsent, saveLocationConsent } from '../utils/enhancedLocationService';

interface LocationPermissionExplainerProps {
  onComplete: (granted: boolean) => void;
  onClose: () => void;
  mode: 'foreground' | 'background' | 'marketing';
}

export function LocationPermissionExplainer({ onComplete, onClose, mode }: LocationPermissionExplainerProps) {
  const handleAllow = async () => {
    try {
      const result = await navigator.geolocation.getCurrentPosition(
        () => {
          // Success - save consent
          const consent: LocationConsent = {
            foreground: true,
            background: mode === 'background',
            marketing: mode === 'marketing',
            analytics: true,
            history: false,
            lastUpdated: new Date().toISOString()
          };
          saveLocationConsent(consent);
          onComplete(true);
        },
        (error) => {
          console.error('Location permission denied:', error);
          onComplete(false);
        }
      );
    } catch (error) {
      console.error('Error requesting location:', error);
      onComplete(false);
    }
  };

  const handleDeny = () => {
    onComplete(false);
  };

  if (mode === 'foreground') {
    return (
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
        role="dialog"
        aria-labelledby="location-permission-title"
        aria-modal="true"
      >
        <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-t-3xl p-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close dialog"
            >
              <X className="size-5" />
            </button>
            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
              <MapPin className="size-8" />
            </div>
            <h2 id="location-permission-title" className="text-2xl font-bold mb-2">
              Enable Location Services
            </h2>
            <p className="text-white/90 text-sm">
              Help us provide you with the best experience
            </p>
          </div>

          {/* Benefits */}
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                <Navigation className="size-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Find Nearby Services</h3>
                <p className="text-sm text-gray-600">
                  Discover restaurants, attractions, and merchants near you
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                <Percent className="size-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Exclusive Local Offers</h3>
                <p className="text-sm text-gray-600">
                  Receive special promotions when visiting tourist attractions
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="size-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Safe & Secure</h3>
                <p className="text-sm text-gray-600">
                  Enable payment authentication and fraud protection
                </p>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="size-4 text-gray-700" />
                <h4 className="font-semibold text-sm text-gray-900">Your Privacy Matters</h4>
              </div>
              <ul className="space-y-1 text-xs text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Location data is encrypted and securely stored</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Used only for features you enable</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>You can disable or delete data anytime</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Never sold to third parties</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 pt-0 space-y-3">
            <Button
              onClick={handleAllow}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white h-14 rounded-full font-bold"
              aria-label="Allow location access"
            >
              Allow Location Access
            </Button>
            <Button
              onClick={handleDeny}
              variant="ghost"
              className="w-full h-12 rounded-full"
              aria-label="Continue without location"
            >
              Continue Without Location
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'background') {
    return (
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
        role="dialog"
        aria-labelledby="background-permission-title"
        aria-modal="true"
      >
        <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
          <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-t-3xl p-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close dialog"
            >
              <X className="size-5" />
            </button>
            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
              <Navigation className="size-8" />
            </div>
            <h2 id="background-permission-title" className="text-2xl font-bold mb-2">
              Background Location (Optional)
            </h2>
            <p className="text-white/90 text-sm">
              Enable for enhanced travel features
            </p>
          </div>

          <div className="p-6 space-y-4">
            <p className="text-gray-700 font-medium">
              Allow goPay to use your location even when the app is in the background?
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-green-600 mt-1">✓</span>
                <p className="text-sm text-gray-600">
                  Get safety notifications during long trips
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 mt-1">✓</span>
                <p className="text-sm text-gray-600">
                  Auto-triggered audio guides at tourist sites
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 mt-1">✓</span>
                <p className="text-sm text-gray-600">
                  Location-based promotions at attractions
                </p>
              </div>
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
              <p className="text-xs text-amber-800">
                <strong>Battery Impact:</strong> Background location uses minimal battery with our efficient tracking system. You can disable this anytime in Settings.
              </p>
            </div>
          </div>

          <div className="p-6 pt-0 space-y-3">
            <Button
              onClick={handleAllow}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-14 rounded-full font-bold"
            >
              Enable Background Location
            </Button>
            <Button
              onClick={handleDeny}
              variant="ghost"
              className="w-full h-12 rounded-full"
            >
              Not Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Marketing mode
  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
      role="dialog"
      aria-labelledby="marketing-permission-title"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
        <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-t-3xl p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close dialog"
          >
            <X className="size-5" />
          </button>
          <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
            <Percent className="size-8" />
          </div>
          <h2 id="marketing-permission-title" className="text-2xl font-bold mb-2">
            Get Exclusive Deals
          </h2>
          <p className="text-white/90 text-sm">
            Opt in for location-based promotions
          </p>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-gray-700">
            Allow goPay to send you special offers and promotions based on your location?
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-purple-600 mt-1">🎁</span>
              <p className="text-sm text-gray-600">
                <strong>Welcome discounts</strong> when you visit new places
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-600 mt-1">🎫</span>
              <p className="text-sm text-gray-600">
                <strong>Exclusive deals</strong> on nearby attractions
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-600 mt-1">🍽️</span>
              <p className="text-sm text-gray-600">
                <strong>Restaurant offers</strong> based on your preferences
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <p className="text-xs text-gray-600">
              You can opt out anytime in Privacy Settings. We respect your choices and won't spam you.
            </p>
          </div>
        </div>

        <div className="p-6 pt-0 space-y-3">
          <Button
            onClick={handleAllow}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-14 rounded-full font-bold"
          >
            Yes, Send Me Deals
          </Button>
          <Button
            onClick={handleDeny}
            variant="ghost"
            className="w-full h-12 rounded-full"
          >
            No Thanks
          </Button>
        </div>
      </div>
    </div>
  );
}
