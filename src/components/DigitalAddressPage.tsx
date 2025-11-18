import { ArrowLeft, MapPin, Home, Copy, Share2, Navigation, Edit, Plus, CheckCircle, Building2, Package } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface DigitalAddressPageProps {
  onBack: () => void;
}

interface SavedAddress {
  id: string;
  nickname: string;
  plusCode: string;
  address: string;
  type: 'home' | 'work' | 'other';
  coordinates: { lat: number; lng: number };
  isDefault: boolean;
}

export function DigitalAddressPage({ onBack }: DigitalAddressPageProps) {
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([
    {
      id: '1',
      nickname: 'Home',
      plusCode: '6G9M+XR2 Dar es Salaam',
      address: 'Masaki, Kinondoni, Dar es Salaam',
      type: 'home',
      coordinates: { lat: -6.7924, lng: 39.2350 },
      isDefault: true
    },
    {
      id: '2',
      nickname: 'Office',
      plusCode: '6G8P+3QH Dar es Salaam',
      address: 'CBD, Ilala, Dar es Salaam',
      type: 'work',
      coordinates: { lat: -6.8150, lng: 39.2870 },
      isDefault: false
    }
  ]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleShareAddress = (address: SavedAddress) => {
    const shareText = `My address: ${address.nickname}\n${address.plusCode}\n${address.address}\n\nOpen in goPay: https://gopay.tz/address/${address.plusCode}`;
    
    if (navigator.share) {
      navigator.share({
        title: `My Address - ${address.nickname}`,
        text: shareText
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Address copied to clipboard!');
    }
  };

  const generatePlusCode = (lat: number, lng: number): string => {
    // Simplified Plus Code generation (real implementation would use official library)
    const latCode = Math.floor(lat * 8000);
    const lngCode = Math.floor(lng * 8000);
    return `${latCode.toString(36).toUpperCase()}+${lngCode.toString(36).toUpperCase()}`;
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
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Digital Addresses</h1>
              <p className="text-sm text-gray-600">Precise location codes for Tanzania</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6 pb-24">
        {/* Info Banner */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-3xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin className="size-7" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">What is a Digital Address?</h2>
              <p className="text-sm text-white/90 leading-relaxed">
                Get a unique code for any location in Tanzania - perfect for deliveries, meetups, and emergencies. Works even in areas without street names!
              </p>
            </div>
          </div>
        </div>

        {/* Current Location */}
        <div className="bg-white rounded-3xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center">
              <Navigation className="size-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">Current Location</h3>
              <p className="text-sm text-gray-600">Generate code for where you are now</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 mb-4">
            <p className="text-sm text-gray-600 mb-2">Plus Code</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-gray-900 flex-1">6G9M+XR2</p>
              <button
                onClick={() => handleCopyCode('6G9M+XR2 Dar es Salaam')}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {copiedCode === '6G9M+XR2 Dar es Salaam' ? (
                  <CheckCircle className="size-5 text-green-600" />
                ) : (
                  <Copy className="size-5 text-gray-600" />
                )}
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-2">Masaki, Kinondoni, Dar es Salaam</p>
          </div>

          <Button
            onClick={() => setShowAddAddress(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white h-12 rounded-full"
          >
            <Plus className="size-5 mr-2" />
            Save This Address
          </Button>
        </div>

        {/* Saved Addresses */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Saved Addresses</h2>
            <Button
              onClick={() => setShowAddAddress(true)}
              className="bg-green-600 hover:bg-green-700 text-white h-10 rounded-full px-6 text-sm"
            >
              <Plus className="size-4 mr-2" />
              Add New
            </Button>
          </div>

          <div className="space-y-3">
            {savedAddresses.map(address => {
              const typeIcons = {
                home: Home,
                work: Building2,
                other: MapPin
              };
              const TypeIcon = typeIcons[address.type];

              return (
                <div
                  key={address.id}
                  className="bg-white rounded-3xl p-6 shadow-md"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`${
                      address.type === 'home' ? 'bg-blue-100' :
                      address.type === 'work' ? 'bg-purple-100' :
                      'bg-orange-100'
                    } w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <TypeIcon className={`size-6 ${
                        address.type === 'home' ? 'text-blue-600' :
                        address.type === 'work' ? 'text-purple-600' :
                        'text-orange-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">{address.nickname}</h3>
                        {address.isDefault && (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">
                            DEFAULT
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{address.address}</p>
                    </div>
                  </div>

                  {/* Plus Code Display */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Plus Code</p>
                        <p className="text-xl font-bold text-gray-900">{address.plusCode}</p>
                      </div>
                      <button
                        onClick={() => handleCopyCode(address.plusCode)}
                        className="p-3 bg-white hover:bg-gray-50 rounded-xl transition-colors"
                      >
                        {copiedCode === address.plusCode ? (
                          <CheckCircle className="size-5 text-green-600" />
                        ) : (
                          <Copy className="size-5 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      onClick={() => handleShareAddress(address)}
                      variant="outline"
                      className="h-10 rounded-full border-2"
                    >
                      <Share2 className="size-4 mr-1" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      className="h-10 rounded-full border-2"
                    >
                      <Navigation className="size-4 mr-1" />
                      Navigate
                    </Button>
                    <Button
                      variant="outline"
                      className="h-10 rounded-full border-2"
                    >
                      <Edit className="size-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-3xl p-6 shadow-md">
          <h3 className="font-bold text-gray-900 mb-4">How Digital Addresses Work</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-green-600">1</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">Universal</h4>
                <p className="text-sm text-gray-600">
                  Works anywhere in Tanzania, even without street addresses
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-green-600">2</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">Precise</h4>
                <p className="text-sm text-gray-600">
                  Accurate to within 3 meters - perfect for deliveries
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-green-600">3</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">Shareable</h4>
                <p className="text-sm text-gray-600">
                  Easy to share via SMS, WhatsApp, or any messaging app
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-green-600">4</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">Offline</h4>
                <p className="text-sm text-gray-600">
                  Codes work even without internet connection
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">Perfect For:</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-3">
              <Package className="size-5 text-blue-600 mb-2" />
              <p className="text-sm font-semibold text-gray-900">Deliveries</p>
            </div>
            <div className="bg-white rounded-xl p-3">
              <Navigation className="size-5 text-green-600 mb-2" />
              <p className="text-sm font-semibold text-gray-900">Meetups</p>
            </div>
            <div className="bg-white rounded-xl p-3">
              <Home className="size-5 text-purple-600 mb-2" />
              <p className="text-sm font-semibold text-gray-900">Property</p>
            </div>
            <div className="bg-white rounded-xl p-3">
              <MapPin className="size-5 text-red-600 mb-2" />
              <p className="text-sm font-semibold text-gray-900">Emergencies</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddAddress && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
            <div className="p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="size-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-6">
                Save New Address
              </h3>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Nickname
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Home, Office, Mom's House"
                    className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button className="h-12 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl font-semibold transition-colors">
                      <Home className="size-4 mx-auto mb-1" />
                      Home
                    </button>
                    <button className="h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors">
                      <Building2 className="size-4 mx-auto mb-1" />
                      Work
                    </button>
                    <button className="h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors">
                      <MapPin className="size-4 mx-auto mb-1" />
                      Other
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm text-gray-600 mb-2">Generated Plus Code</p>
                  <p className="text-xl font-bold text-gray-900">6G9M+XR2 Dar es Salaam</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => setShowAddAddress(false)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-12 rounded-full"
                >
                  Save Address
                </Button>
                <Button
                  onClick={() => setShowAddAddress(false)}
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
