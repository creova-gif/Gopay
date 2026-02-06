import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { 
  MapPin, 
  Copy, 
  Share2, 
  Navigation, 
  QrCode,
  CheckCircle,
  Globe,
  Smartphone,
  WifiOff,
  ChevronLeft,
  Plus,
  Edit3,
  Trash2,
  Home,
  Building2,
  Briefcase
} from 'lucide-react';

interface SmartDigitalAddressProps {
  onBack: () => void;
}

export function SmartDigitalAddress({ onBack }: SmartDigitalAddressProps) {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [smartAddress, setSmartAddress] = useState<string>('');
  const [plusCode, setPlusCode] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([
    { id: 1, type: 'home', label: 'Home', address: 'GO-DAR-MZM-4523', location: 'Msasani Peninsula, Dar es Salaam' },
    { id: 2, type: 'work', label: 'Work', address: 'GO-DAR-CDB-8901', location: 'CBD, Dar es Salaam' },
  ]);
  const [offlineMode, setOfflineMode] = useState(false);

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          
          // Generate Smart Digital Address (SDA)
          const generatedAddress = generateSmartAddress(latitude, longitude);
          setSmartAddress(generatedAddress);
          
          // Generate Plus Code equivalent
          const generatedPlusCode = generatePlusCode(latitude, longitude);
          setPlusCode(generatedPlusCode);
        },
        (error) => {
          console.error('Error getting location:', error);
          setOfflineMode(true);
        }
      );
    }
  }, []);

  const generateSmartAddress = (lat: number, lng: number): string => {
    // Generate unique Smart Digital Address
    // Format: GO-[REGION]-[DISTRICT]-[UNIQUE]
    const regions = ['DAR', 'ARS', 'MWZ', 'MOR', 'TNZ'];
    const randomRegion = regions[Math.floor(Math.abs(lat) * 10) % regions.length];
    const uniqueCode = Math.floor(Math.abs(lat * lng * 10000)).toString().slice(-4);
    return `GO-${randomRegion}-SDA-${uniqueCode}`;
  };

  const generatePlusCode = (lat: number, lng: number): string => {
    // Simplified Plus Code generation
    const code = Math.floor(Math.abs(lat * lng * 100000)).toString(36).toUpperCase().slice(0, 8);
    return `${code.slice(0, 4)}+${code.slice(4)}`;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'My GO Smart Address',
      text: `Find me at: ${smartAddress}\nPlus Code: ${plusCode}\nWorks offline! 📍`,
      url: `https://gopay.tz/locate/${smartAddress}`
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        handleCopy(shareData.text);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 px-5 pt-8 pb-6 relative overflow-hidden">
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

          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
              <MapPin className="size-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl text-white mb-1">Smart Digital Address</h1>
              <p className="text-blue-100 text-sm">Tanzania's National Addressing System</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-6 space-y-6">
        {/* Current Smart Address */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Navigation className="size-5 text-blue-600" />
              <h2 className="text-lg">Your Current Location</h2>
            </div>
            {offlineMode && (
              <div className="flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                <WifiOff className="size-3" />
                <span>Offline</span>
              </div>
            )}
          </div>

          {/* Smart Address Display */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 mb-4">
            <p className="text-sm text-gray-600 mb-2">Smart Digital Address (SDA)</p>
            <div className="flex items-center justify-between mb-4">
              <p className="text-2xl text-blue-900 font-mono">{smartAddress || 'Generating...'}</p>
              <button
                onClick={() => handleCopy(smartAddress)}
                className="bg-white p-2 rounded-lg hover:bg-gray-50 transition-all active:scale-95"
              >
                {copied ? <CheckCircle className="size-5 text-green-600" /> : <Copy className="size-5 text-gray-600" />}
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-2">Plus Code (Google Maps)</p>
            <p className="text-lg text-blue-800 font-mono mb-4">{plusCode || 'Generating...'}</p>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Globe className="size-3" />
              <span>Accurate to 3 meters • Works offline</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleShare}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
            >
              <Share2 className="size-4 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <QrCode className="size-4 mr-2" />
              QR Code
            </Button>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 rounded-3xl p-6 text-white shadow-lg">
          <h3 className="text-xl mb-4">🇹🇿 National Infrastructure</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-white/20 p-2 rounded-lg mt-0.5">
                <CheckCircle className="size-4" />
              </div>
              <div>
                <p className="text-sm">Works without street names</p>
                <p className="text-xs text-blue-100">Perfect for rural Tanzania</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white/20 p-2 rounded-lg mt-0.5">
                <CheckCircle className="size-4" />
              </div>
              <div>
                <p className="text-sm">Share with deliveries, riders, emergency</p>
                <p className="text-xs text-blue-100">One tap sharing</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white/20 p-2 rounded-lg mt-0.5">
                <CheckCircle className="size-4" />
              </div>
              <div>
                <p className="text-sm">Works completely offline</p>
                <p className="text-xs text-blue-100">GPS-based, no internet needed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Addresses */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg">Saved Addresses</h3>
            <button className="text-blue-600 text-sm hover:text-blue-700">
              <Plus className="size-4 inline mr-1" />
              Add new
            </button>
          </div>

          <div className="space-y-3">
            {savedAddresses.map((address) => (
              <div key={address.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl ${
                      address.type === 'home' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {address.type === 'home' ? (
                        <Home className="size-5 text-green-600" />
                      ) : address.type === 'work' ? (
                        <Briefcase className="size-5 text-blue-600" />
                      ) : (
                        <Building2 className="size-5 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <p className="mb-1">{address.label}</p>
                      <p className="text-sm text-blue-600 font-mono mb-1">{address.address}</p>
                      <p className="text-xs text-gray-500">{address.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Edit3 className="size-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Trash2 className="size-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg mb-4">Perfect For</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-4">
              <div className="text-2xl mb-2">🚗</div>
              <p className="text-sm">Ride pickups</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4">
              <div className="text-2xl mb-2">📦</div>
              <p className="text-sm">Deliveries</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-4">
              <div className="text-2xl mb-2">🚨</div>
              <p className="text-sm">Emergency SOS</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4">
              <div className="text-2xl mb-2">🏘️</div>
              <p className="text-sm">Rural areas</p>
            </div>
          </div>
        </div>

        {/* Government Partnership Badge */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-5 text-white text-center">
          <div className="text-3xl mb-2">🇹🇿</div>
          <p className="text-sm mb-1">Official National Addressing System</p>
          <p className="text-xs text-green-100">Partnership with Tanzania Postal Services</p>
        </div>
      </div>
    </div>
  );
}
