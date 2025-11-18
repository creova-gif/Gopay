/**
 * Enhanced Location Service for goPay
 * Implements privacy-first location tracking with:
 * - Explicit consent management
 * - Foreground/background modes
 * - Data minimization (truncation to ~100m accuracy for analytics)
 * - Geofencing for POIs
 * - Battery-efficient updates
 * - Offline support
 */

export interface LocationConsent {
  foreground: boolean;
  background: boolean;
  marketing: boolean;
  analytics: boolean;
  history: boolean;
  lastUpdated: string;
}

export interface GeofencePOI {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  radius: number; // meters
  description?: string;
  promoMessage?: string;
  imageUrl?: string;
}

export interface LocationDatapoint {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: string;
  region?: string;
  district?: string;
  ward?: string;
}

// Privacy: truncate coordinates to ~100m precision for analytics
export function truncateCoordinates(lat: number, lng: number, precision: number = 3): { lat: number; lng: number } {
  return {
    lat: parseFloat(lat.toFixed(precision)),
    lng: parseFloat(lng.toFixed(precision))
  };
}

// Calculate distance between two points (Haversine formula)
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Detect potential GPS spoofing
export function detectSpoofing(
  newLat: number,
  newLng: number,
  oldLat: number,
  oldLng: number,
  timeDiffSeconds: number
): { isSuspicious: boolean; reason?: string } {
  const distance = calculateDistance(oldLat, oldLng, newLat, newLng);
  const speed = distance / timeDiffSeconds; // m/s
  const speedKmh = speed * 3.6;

  // Flag if speed > 300 km/h (unlikely for normal travel)
  if (speedKmh > 300) {
    return { isSuspicious: true, reason: 'Impossible speed detected' };
  }

  // Flag if jumped > 100km instantly (< 5 seconds)
  if (distance > 100000 && timeDiffSeconds < 5) {
    return { isSuspicious: true, reason: 'Teleportation detected' };
  }

  return { isSuspicious: false };
}

// Geofencing: check if user entered/exited POI
export function checkGeofence(
  currentLat: number,
  currentLng: number,
  previousLat: number | null,
  previousLng: number | null,
  poi: GeofencePOI
): { entered: boolean; exited: boolean } {
  const currentDistance = calculateDistance(currentLat, currentLng, poi.lat, poi.lng);
  const isInside = currentDistance <= poi.radius;

  let entered = false;
  let exited = false;

  if (previousLat !== null && previousLng !== null) {
    const previousDistance = calculateDistance(previousLat, previousLng, poi.lat, poi.lng);
    const wasInside = previousDistance <= poi.radius;

    entered = !wasInside && isInside;
    exited = wasInside && !isInside;
  } else {
    // First check
    entered = isInside;
  }

  return { entered, exited };
}

// Location consent management
const CONSENT_STORAGE_KEY = 'gopay_location_consent';

export function getLocationConsent(): LocationConsent | null {
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error reading location consent:', error);
    return null;
  }
}

export function saveLocationConsent(consent: LocationConsent): void {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
  } catch (error) {
    console.error('Error saving location consent:', error);
  }
}

export function hasLocationPermission(): boolean {
  const consent = getLocationConsent();
  return consent?.foreground === true;
}

export function hasBackgroundPermission(): boolean {
  const consent = getLocationConsent();
  return consent?.background === true;
}

// Location history management (privacy: auto-delete after 90 days)
const HISTORY_STORAGE_KEY = 'gopay_location_history';
const HISTORY_TTL_DAYS = 90;

export function getLocationHistory(): LocationDatapoint[] {
  try {
    const consent = getLocationConsent();
    if (!consent?.history) return [];

    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!stored) return [];

    const history: LocationDatapoint[] = JSON.parse(stored);
    const now = new Date();
    const ttlMs = HISTORY_TTL_DAYS * 24 * 60 * 60 * 1000;

    // Auto-delete old entries
    return history.filter(point => {
      const pointDate = new Date(point.timestamp);
      return now.getTime() - pointDate.getTime() < ttlMs;
    });
  } catch (error) {
    console.error('Error reading location history:', error);
    return [];
  }
}

export function addLocationToHistory(lat: number, lng: number, accuracy: number): void {
  try {
    const consent = getLocationConsent();
    if (!consent?.history) return;

    const history = getLocationHistory();
    const newPoint: LocationDatapoint = {
      lat,
      lng,
      accuracy,
      timestamp: new Date().toISOString()
    };

    history.push(newPoint);

    // Keep only last 1000 points to avoid storage bloat
    const trimmed = history.slice(-1000);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Error adding location to history:', error);
  }
}

export function clearLocationHistory(): void {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing location history:', error);
  }
}

// Tanzania POI database (sample - would come from server in production)
export const TANZANIA_POIS: GeofencePOI[] = [
  {
    id: 'serengeti-gate',
    name: 'Serengeti National Park - Naabi Hill Gate',
    category: 'national_park',
    lat: -2.5829,
    lng: 34.8341,
    radius: 5000,
    description: 'Main entrance to Serengeti National Park',
    promoMessage: '🦁 Welcome to Serengeti! Get 10% off guided safari tours.',
    imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800'
  },
  {
    id: 'kilimanjaro-marangu',
    name: 'Mount Kilimanjaro - Marangu Gate',
    category: 'mountain',
    lat: -3.1469,
    lng: 37.5145,
    radius: 3000,
    description: 'Starting point for Marangu Route',
    promoMessage: '🏔️ Starting your Kilimanjaro adventure? Book gear rental with 15% off!',
    imageUrl: 'https://images.unsplash.com/photo-1609198092357-c7da34926b60?w=800'
  },
  {
    id: 'zanzibar-stone-town',
    name: 'Stone Town, Zanzibar',
    category: 'historic',
    lat: -6.1630,
    lng: 39.1920,
    radius: 2000,
    description: 'UNESCO World Heritage Site',
    promoMessage: '🏛️ Explore Stone Town! Free audio guide with your first purchase.',
    imageUrl: 'https://images.unsplash.com/photo-1568281675068-407e050e6abf?w=800'
  },
  {
    id: 'ngorongoro-crater',
    name: 'Ngorongoro Crater',
    category: 'national_park',
    lat: -3.1747,
    lng: 35.5789,
    radius: 10000,
    description: 'World\'s largest inactive volcanic caldera',
    promoMessage: '🦏 Ngorongoro Crater! Book your crater tour now - limited slots available.',
    imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800'
  },
  {
    id: 'dar-fish-market',
    name: 'Kivukoni Fish Market',
    category: 'attraction',
    lat: -6.8199,
    lng: 39.2891,
    radius: 500,
    description: 'Bustling fresh fish market in Dar es Salaam',
    promoMessage: '🐟 Fresh catch daily! Visit Kivukoni Fish Market for authentic experience.',
    imageUrl: 'https://images.unsplash.com/photo-1565098772267-60af42b81ef2?w=800'
  },
  {
    id: 'mikumi-gate',
    name: 'Mikumi National Park',
    category: 'national_park',
    lat: -7.3862,
    lng: 36.9826,
    radius: 5000,
    description: 'Easy access park from Dar es Salaam',
    promoMessage: '🐘 Welcome to Mikumi! Day safari packages available with instant booking.',
    imageUrl: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=800'
  }
];

// Get nearby POIs
export function getNearbyPOIs(lat: number, lng: number, maxDistance: number = 50000): GeofencePOI[] {
  return TANZANIA_POIS.filter(poi => {
    const distance = calculateDistance(lat, lng, poi.lat, poi.lng);
    return distance <= maxDistance;
  }).sort((a, b) => {
    const distA = calculateDistance(lat, lng, a.lat, a.lng);
    const distB = calculateDistance(lat, lng, b.lat, b.lng);
    return distA - distB;
  });
}

// Offline region management
export interface OfflineRegion {
  id: string;
  name: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  downloadedAt?: string;
  size?: number;
  pois: GeofencePOI[];
}

export const OFFLINE_REGIONS: OfflineRegion[] = [
  {
    id: 'serengeti',
    name: 'Serengeti National Park',
    bounds: { north: -1.5, south: -3.3, east: 35.5, west: 34.0 },
    pois: TANZANIA_POIS.filter(p => p.id.includes('serengeti'))
  },
  {
    id: 'kilimanjaro',
    name: 'Mount Kilimanjaro Region',
    bounds: { north: -2.9, south: -3.4, east: 37.7, west: 37.2 },
    pois: TANZANIA_POIS.filter(p => p.id.includes('kilimanjaro'))
  },
  {
    id: 'zanzibar',
    name: 'Zanzibar Islands',
    bounds: { north: -5.7, south: -6.5, east: 39.7, west: 39.0 },
    pois: TANZANIA_POIS.filter(p => p.id.includes('zanzibar'))
  },
  {
    id: 'ngorongoro',
    name: 'Ngorongoro Conservation Area',
    bounds: { north: -2.9, south: -3.6, east: 35.9, west: 35.0 },
    pois: TANZANIA_POIS.filter(p => p.id.includes('ngorongoro'))
  },
  {
    id: 'dar-es-salaam',
    name: 'Dar es Salaam City',
    bounds: { north: -6.7, south: -6.9, east: 39.4, west: 39.1 },
    pois: TANZANIA_POIS.filter(p => p.id.includes('dar'))
  }
];

// Get downloaded regions
const OFFLINE_REGIONS_KEY = 'gopay_offline_regions';

export function getDownloadedRegions(): string[] {
  try {
    const stored = localStorage.getItem(OFFLINE_REGIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading offline regions:', error);
    return [];
  }
}

export function markRegionDownloaded(regionId: string): void {
  try {
    const regions = getDownloadedRegions();
    if (!regions.includes(regionId)) {
      regions.push(regionId);
      localStorage.setItem(OFFLINE_REGIONS_KEY, JSON.stringify(regions));
    }
  } catch (error) {
    console.error('Error marking region downloaded:', error);
  }
}

export function removeDownloadedRegion(regionId: string): void {
  try {
    const regions = getDownloadedRegions();
    const filtered = regions.filter(id => id !== regionId);
    localStorage.setItem(OFFLINE_REGIONS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing downloaded region:', error);
  }
}
