import { ArrowLeft, MapPin, Star, Navigation, Download, Check, Compass, Mountain, Palmtree, Building2, Camera, Map } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  getNearbyPOIs,
  GeofencePOI,
  calculateDistance,
  OFFLINE_REGIONS,
  OfflineRegion,
  getDownloadedRegions,
  markRegionDownloaded,
  removeDownloadedRegion,
  hasLocationPermission
} from '../utils/enhancedLocationService';
import { LocationPermissionExplainer } from './LocationPermissionExplainer';

interface TourismDiscoveryPageProps {
  onBack: () => void;
  userLocation: { lat: number; lng: number } | null;
}

export function TourismDiscoveryPage({ onBack, userLocation }: TourismDiscoveryPageProps) {
  const [activeTab, setActiveTab] = useState<'discover' | 'offline'>('discover');
  const [nearbyPOIs, setNearbyPOIs] = useState<GeofencePOI[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [downloadedRegions, setDownloadedRegions] = useState<string[]>([]);
  const [showPermissionExplainer, setShowPermissionExplainer] = useState(false);

  useEffect(() => {
    if (userLocation && hasLocationPermission()) {
      const pois = getNearbyPOIs(userLocation.lat, userLocation.lng, 200000); // 200km radius
      setNearbyPOIs(pois);
    }
    setDownloadedRegions(getDownloadedRegions());
  }, [userLocation]);

  const categories = [
    { id: 'all', name: 'All', icon: Compass },
    { id: 'national_park', name: 'Parks', icon: Mountain },
    { id: 'historic', name: 'Historic', icon: Building2 },
    { id: 'attraction', name: 'Attractions', icon: Camera }
  ];

  const filteredPOIs = selectedCategory === 'all'
    ? nearbyPOIs
    : nearbyPOIs.filter(poi => poi.category === selectedCategory);

  const handleDownloadRegion = (regionId: string) => {
    // Simulate download
    markRegionDownloaded(regionId);
    setDownloadedRegions(getDownloadedRegions());
  };

  const handleRemoveRegion = (regionId: string) => {
    removeDownloadedRegion(regionId);
    setDownloadedRegions(getDownloadedRegions());
  };

  const formatDistance = (meters: number): string => {
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  };

  if (!hasLocationPermission() && activeTab === 'discover') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="size-6 text-gray-900" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Explore Tanzania</h1>
            </div>
          </div>
        </div>

        <div className="px-4 py-12 text-center">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-auto shadow-lg">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="size-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Enable Location to Discover
            </h2>
            <p className="text-gray-600 mb-6">
              Find amazing attractions, national parks, and hidden gems near you across Tanzania
            </p>
            <Button
              onClick={() => setShowPermissionExplainer(true)}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white h-14 rounded-full"
            >
              Enable Location Services
            </Button>
          </div>
        </div>

        {showPermissionExplainer && (
          <LocationPermissionExplainer
            mode="foreground"
            onComplete={(granted) => {
              setShowPermissionExplainer(false);
              if (granted) {
                window.location.reload();
              }
            }}
            onClose={() => setShowPermissionExplainer(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="size-6 text-gray-900" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Explore Tanzania</h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('discover')}
              className={`flex-1 py-3 px-4 rounded-full font-semibold transition-all ${
                activeTab === 'discover'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <Compass className="size-5" />
                Discover
              </span>
            </button>
            <button
              onClick={() => setActiveTab('offline')}
              className={`flex-1 py-3 px-4 rounded-full font-semibold transition-all ${
                activeTab === 'offline'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <Download className="size-5" />
                Offline Maps
              </span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'discover' ? (
        <div className="pb-24">
          {/* Category Filter */}
          <div className="px-4 py-4 bg-white border-b border-gray-100">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map(category => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                      selectedCategory === category.id
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <IconComponent className="size-4" />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* POI List */}
          <div className="px-4 py-6 space-y-4">
            {filteredPOIs.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="size-10 text-gray-400" />
                </div>
                <p className="text-gray-600">No attractions found nearby</p>
                <p className="text-sm text-gray-500 mt-2">Try adjusting your filters or explore offline maps</p>
              </div>
            ) : (
              filteredPOIs.map((poi, index) => {
                const distance = userLocation
                  ? calculateDistance(userLocation.lat, userLocation.lng, poi.lat, poi.lng)
                  : 0;

                return (
                  <div
                    key={poi.id}
                    className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all"
                  >
                    {/* Image */}
                    <div className="relative h-48">
                      <ImageWithFallback
                        src={poi.imageUrl || ''}
                        alt={poi.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Distance Badge */}
                      {userLocation && (
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                          <Navigation className="size-4 text-green-600" />
                          <span className="text-sm font-semibold text-gray-900">
                            {formatDistance(distance)}
                          </span>
                        </div>
                      )}

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {poi.category.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{poi.name}</h3>
                      {poi.description && (
                        <p className="text-gray-600 text-sm mb-4">{poi.description}</p>
                      )}

                      {/* Promo Message */}
                      {poi.promoMessage && (
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-200 mb-4">
                          <p className="text-sm text-purple-900">{poi.promoMessage}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3">
                        <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 rounded-full">
                          <Navigation className="size-5 mr-2" />
                          Navigate
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 h-12 rounded-full border-2"
                        >
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* Offline Maps Tab */
        <div className="px-4 py-6 space-y-6 pb-24">
          {/* Info Banner */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl p-6">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                <Map className="size-7" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">Offline Maps</h2>
                <p className="text-sm text-white/90">
                  Download regions for offline access during your travels. Perfect for areas with poor connectivity.
                </p>
              </div>
            </div>
          </div>

          {/* Regions */}
          <div className="space-y-4">
            {OFFLINE_REGIONS.map(region => {
              const isDownloaded = downloadedRegions.includes(region.id);
              const IconComponent = region.id.includes('park') ? Mountain : 
                                   region.id.includes('zanzibar') ? Palmtree : 
                                   Building2;

              return (
                <div
                  key={region.id}
                  className="bg-white rounded-3xl p-6 shadow-md"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isDownloaded ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      <IconComponent className={`size-7 ${
                        isDownloaded ? 'text-green-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{region.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {region.pois.length} attractions included
                      </p>
                      {isDownloaded ? (
                        <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                          <Check className="size-4" />
                          Downloaded
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          Estimated size: ~{Math.floor(Math.random() * 50 + 20)}MB
                        </p>
                      )}
                    </div>
                  </div>

                  {/* POI Count */}
                  {region.pois.length > 0 && (
                    <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                      <p className="text-sm text-gray-700 font-medium mb-2">Included attractions:</p>
                      <ul className="space-y-1">
                        {region.pois.slice(0, 3).map(poi => (
                          <li key={poi.id} className="text-sm text-gray-600 flex items-center gap-2">
                            <span className="text-green-600">•</span>
                            {poi.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Button */}
                  {isDownloaded ? (
                    <Button
                      onClick={() => handleRemoveRegion(region.id)}
                      variant="outline"
                      className="w-full h-12 rounded-full border-2 border-red-200 text-red-600 hover:bg-red-50"
                    >
                      Remove Download
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleDownloadRegion(region.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-full"
                    >
                      <Download className="size-5 mr-2" />
                      Download for Offline Use
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Info Note */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> Offline maps work without internet connection. Make sure to download maps before your trip to remote areas.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
