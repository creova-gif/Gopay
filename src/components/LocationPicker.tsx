import { useState, useEffect } from 'react';
import { MapPin, Navigation, Search, X, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  getCurrentLocation,
  getPopularAddresses,
  loadSavedLocation,
  saveLocation,
  getDefaultLocation,
  DAR_POPULAR_AREAS,
  TANZANIA_REGIONS,
  type TanzaniaLocation
} from '../utils/locationService';

interface LocationPickerProps {
  onLocationSelect: (location: TanzaniaLocation) => void;
  onClose: () => void;
}

export function LocationPicker({ onLocationSelect, onClose }: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingGPS, setLoadingGPS] = useState(false);
  const [savedLocation, setSavedLocation] = useState<TanzaniaLocation | null>(null);

  useEffect(() => {
    // Load saved location
    const saved = loadSavedLocation();
    if (saved) {
      setSavedLocation(saved);
    }
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = getPopularAddresses(searchQuery);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleUseCurrentLocation = async () => {
    setLoadingGPS(true);
    try {
      const location = await getCurrentLocation();
      if (location) {
        saveLocation(location);
        onLocationSelect(location);
        onClose();
      } else {
        // Fallback to default location with user notification
        const defaultLoc = getDefaultLocation();
        saveLocation(defaultLoc);
        onLocationSelect(defaultLoc);
        
        // Show friendly message to user
        alert('📍 Using default location: Masaki, Dar es Salaam\n\nTo use your current location, please enable location services in your browser settings.');
        onClose();
      }
    } catch (error: any) {
      console.warn('Failed to get current location - using default');
      // Use default location
      const defaultLoc = getDefaultLocation();
      saveLocation(defaultLoc);
      onLocationSelect(defaultLoc);
      onClose();
    } finally {
      setLoadingGPS(false);
    }
  };

  const handleSelectArea = (areaName: string) => {
    // Parse area (e.g., "Masaki, Dar es Salaam")
    const parts = areaName.split(',').map(p => p.trim());
    const ward = parts[0];
    const region = parts[parts.length - 1];

    const location: TanzaniaLocation = {
      region,
      district: 'Kinondoni', // Default
      ward,
      latitude: -6.7924, // Default Dar es Salaam coordinates
      longitude: 39.2083,
      formatted: areaName
    };

    saveLocation(location);
    onLocationSelect(location);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Select Location</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Search */}
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search area, street, landmark..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 rounded-2xl bg-gray-50 border-gray-200"
              />
            </div>

            {/* Search Suggestions */}
            {suggestions.length > 0 && (
              <div className="mt-3 space-y-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectArea(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors flex items-center gap-3"
                  >
                    <MapPin className="size-5 text-gray-400 flex-shrink-0" />
                    <span className="text-sm">{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Current Location Button */}
          <div className="p-6 border-b border-gray-200">
            <button
              onClick={handleUseCurrentLocation}
              disabled={loadingGPS}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-2xl font-bold hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loadingGPS ? (
                <>
                  <Loader2 className="size-6 animate-spin" />
                  <span>Getting your location...</span>
                </>
              ) : (
                <>
                  <Navigation className="size-6" />
                  <span>Use Current Location</span>
                </>
              )}
            </button>

            {savedLocation && (
              <div className="mt-3 bg-blue-50 rounded-2xl p-4 flex items-start gap-3">
                <MapPin className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-blue-900">Last Used Location</p>
                  <p className="text-sm text-blue-700 truncate">{savedLocation.formatted}</p>
                </div>
                <button
                  onClick={() => {
                    onLocationSelect(savedLocation);
                    onClose();
                  }}
                  className="text-blue-600 font-medium text-sm flex-shrink-0"
                >
                  Use
                </button>
              </div>
            )}
          </div>

          {/* Popular Areas */}
          <div className="p-6">
            <h3 className="font-bold text-gray-900 mb-4">Popular Areas in Dar es Salaam</h3>
            <div className="grid grid-cols-2 gap-2">
              {DAR_POPULAR_AREAS.slice(0, 12).map((area, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectArea(`${area}, Dar es Salaam`)}
                  className="text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-sm"
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* Major Cities */}
          <div className="p-6 bg-gray-50">
            <h3 className="font-bold text-gray-900 mb-4">Other Major Cities</h3>
            <div className="space-y-2">
              {TANZANIA_REGIONS.slice(0, 8).map((region, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectArea(`${region} Center, ${region}`)}
                  className="w-full text-left px-4 py-3 bg-white hover:bg-gray-50 rounded-xl transition-colors flex items-center justify-between"
                >
                  <span className="text-sm font-medium">{region}</span>
                  <ChevronRight className="size-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}