// Tanzania Location Service with Geolocation
export interface TanzaniaLocation {
  region: string;
  district: string;
  ward?: string;
  street?: string;
  latitude: number;
  longitude: number;
  formatted: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  region: string;
  deliveryFee: number;
  estimatedTime: string;
  available: boolean;
}

// Major Tanzania regions and cities
export const TANZANIA_REGIONS = [
  'Dar es Salaam',
  'Arusha',
  'Mwanza',
  'Dodoma',
  'Mbeya',
  'Morogoro',
  'Tanga',
  'Zanzibar',
  'Kilimanjaro',
  'Moshi',
  'Iringa',
  'Singida',
  'Tabora',
  'Kigoma',
  'Shinyanga',
  'Kagera',
  'Mara',
  'Rukwa',
  'Ruvuma',
  'Pwani',
  'Lindi',
  'Mtwara',
  'Katavi',
  'Njombe',
  'Simiyu',
  'Geita',
  'Songwe'
];

// Dar es Salaam districts
export const DAR_ES_SALAAM_DISTRICTS = [
  'Kinondoni',
  'Ilala',
  'Temeke',
  'Ubungo',
  'Kigamboni'
];

// Popular Dar es Salaam areas
export const DAR_POPULAR_AREAS = [
  'Masaki',
  'Oyster Bay',
  'Mikocheni',
  'Msasani',
  'Upanga',
  'Kariakoo',
  'Posta',
  'Mwenge',
  'Sinza',
  'Mbezi Beach',
  'Mbezi',
  'Tegeta',
  'Kawe',
  'Kimara',
  'Ubungo',
  'Magomeni',
  'Kinondoni',
  'Mwananyamala',
  'Tandale',
  'Manzese',
  'Buguruni',
  'Temeke',
  'Chang\'ombe',
  'Keko',
  'Mbagala',
  'Kigamboni',
  'Gezaulole'
];

// Delivery zones with pricing
export const DELIVERY_ZONES: DeliveryZone[] = [
  // Dar es Salaam - Premium Areas
  { id: 'masaki', name: 'Masaki', region: 'Dar es Salaam', deliveryFee: 3000, estimatedTime: '20-30 min', available: true },
  { id: 'oyster-bay', name: 'Oyster Bay', region: 'Dar es Salaam', deliveryFee: 3000, estimatedTime: '20-30 min', available: true },
  { id: 'mikocheni', name: 'Mikocheni', region: 'Dar es Salaam', deliveryFee: 3500, estimatedTime: '25-35 min', available: true },
  { id: 'msasani', name: 'Msasani', region: 'Dar es Salaam', deliveryFee: 3500, estimatedTime: '25-35 min', available: true },
  
  // Dar es Salaam - Central Areas
  { id: 'upanga', name: 'Upanga', region: 'Dar es Salaam', deliveryFee: 2500, estimatedTime: '15-25 min', available: true },
  { id: 'kariakoo', name: 'Kariakoo', region: 'Dar es Salaam', deliveryFee: 2500, estimatedTime: '15-25 min', available: true },
  { id: 'posta', name: 'Posta', region: 'Dar es Salaam', deliveryFee: 2500, estimatedTime: '15-25 min', available: true },
  
  // Dar es Salaam - Residential Areas
  { id: 'mwenge', name: 'Mwenge', region: 'Dar es Salaam', deliveryFee: 4000, estimatedTime: '30-40 min', available: true },
  { id: 'sinza', name: 'Sinza', region: 'Dar es Salaam', deliveryFee: 4000, estimatedTime: '30-40 min', available: true },
  { id: 'mbezi-beach', name: 'Mbezi Beach', region: 'Dar es Salaam', deliveryFee: 5000, estimatedTime: '35-45 min', available: true },
  { id: 'mbezi', name: 'Mbezi', region: 'Dar es Salaam', deliveryFee: 5000, estimatedTime: '35-45 min', available: true },
  { id: 'tegeta', name: 'Tegeta', region: 'Dar es Salaam', deliveryFee: 6000, estimatedTime: '40-50 min', available: true },
  { id: 'kawe', name: 'Kawe', region: 'Dar es Salaam', deliveryFee: 5000, estimatedTime: '35-45 min', available: true },
  { id: 'kimara', name: 'Kimara', region: 'Dar es Salaam', deliveryFee: 4500, estimatedTime: '35-45 min', available: true },
  
  // Dar es Salaam - Other Districts
  { id: 'ubungo', name: 'Ubungo', region: 'Dar es Salaam', deliveryFee: 4000, estimatedTime: '30-40 min', available: true },
  { id: 'magomeni', name: 'Magomeni', region: 'Dar es Salaam', deliveryFee: 3500, estimatedTime: '25-35 min', available: true },
  { id: 'kinondoni', name: 'Kinondoni', region: 'Dar es Salaam', deliveryFee: 4000, estimatedTime: '30-40 min', available: true },
  { id: 'buguruni', name: 'Buguruni', region: 'Dar es Salaam', deliveryFee: 4000, estimatedTime: '30-40 min', available: true },
  { id: 'temeke', name: 'Temeke', region: 'Dar es Salaam', deliveryFee: 4500, estimatedTime: '35-45 min', available: true },
  { id: 'mbagala', name: 'Mbagala', region: 'Dar es Salaam', deliveryFee: 5500, estimatedTime: '40-50 min', available: true },
  { id: 'kigamboni', name: 'Kigamboni', region: 'Dar es Salaam', deliveryFee: 6000, estimatedTime: '45-60 min', available: true },
  
  // Other Major Cities
  { id: 'arusha-center', name: 'Arusha Center', region: 'Arusha', deliveryFee: 3000, estimatedTime: '25-35 min', available: true },
  { id: 'mwanza-center', name: 'Mwanza Center', region: 'Mwanza', deliveryFee: 3000, estimatedTime: '25-35 min', available: true },
  { id: 'dodoma-center', name: 'Dodoma Center', region: 'Dodoma', deliveryFee: 3000, estimatedTime: '25-35 min', available: true },
  { id: 'mbeya-center', name: 'Mbeya Center', region: 'Mbeya', deliveryFee: 3000, estimatedTime: '25-35 min', available: true },
  { id: 'zanzibar-stone-town', name: 'Stone Town', region: 'Zanzibar', deliveryFee: 3500, estimatedTime: '30-40 min', available: true },
];

// Get user's current location
export async function getCurrentLocation(): Promise<TanzaniaLocation | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      // Silently fallback to default location
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Reverse geocode to get address
        const location = await reverseGeocode(latitude, longitude);
        resolve(location);
      },
      (error) => {
        // Silently handle errors and fallback to default location
        // This is expected behavior when users don't grant permission
        resolve(null);
      },
      {
        enableHighAccuracy: false, // Better compatibility
        timeout: 5000,
        maximumAge: 60000 // Allow cached location
      }
    );
  });
}

// Reverse geocode coordinates to Tanzania location
async function reverseGeocode(latitude: number, longitude: number): Promise<TanzaniaLocation> {
  // For demo, detect if coordinates are in Dar es Salaam area
  const isDarEsSalaam = 
    latitude >= -7.0 && latitude <= -6.6 && 
    longitude >= 39.1 && longitude <= 39.4;

  if (isDarEsSalaam) {
    // Determine specific area based on coordinates
    let district = 'Kinondoni';
    let ward = 'Masaki';

    if (latitude > -6.8 && longitude > 39.25) {
      district = 'Kinondoni';
      ward = latitude > -6.75 ? 'Mbezi' : 'Mikocheni';
    } else if (latitude < -6.85) {
      district = 'Ilala';
      ward = 'Upanga';
    } else if (longitude < 39.2) {
      district = 'Temeke';
      ward = 'Temeke';
    }

    return {
      region: 'Dar es Salaam',
      district,
      ward,
      latitude,
      longitude,
      formatted: `${ward}, ${district}, Dar es Salaam`
    };
  }

  // Default to Dar es Salaam center for demo
  return {
    region: 'Dar es Salaam',
    district: 'Kinondoni',
    ward: 'Masaki',
    latitude,
    longitude,
    formatted: 'Masaki, Kinondoni, Dar es Salaam'
  };
}

// Find nearest delivery zone
export function findNearestDeliveryZone(location: TanzaniaLocation): DeliveryZone | null {
  if (!location.ward) {
    return DELIVERY_ZONES[0]; // Default to first zone
  }

  // Try to find exact match by area name
  const exactMatch = DELIVERY_ZONES.find(zone => 
    zone.name.toLowerCase() === location.ward?.toLowerCase()
  );

  if (exactMatch) {
    return exactMatch;
  }

  // Try to find by region
  const regionMatch = DELIVERY_ZONES.find(zone => 
    zone.region === location.region
  );

  return regionMatch || DELIVERY_ZONES[0];
}

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Get delivery fee based on location
export function getDeliveryFee(location: TanzaniaLocation): number {
  const zone = findNearestDeliveryZone(location);
  return zone?.deliveryFee || 5000;
}

// Get estimated delivery time
export function getEstimatedDeliveryTime(location: TanzaniaLocation): string {
  const zone = findNearestDeliveryZone(location);
  return zone?.estimatedTime || '30-45 min';
}

// Check if delivery is available in area
export function isDeliveryAvailable(location: TanzaniaLocation): boolean {
  const zone = findNearestDeliveryZone(location);
  return zone?.available || false;
}

// Get popular addresses for autocomplete
export function getPopularAddresses(searchQuery: string): string[] {
  const query = searchQuery.toLowerCase();
  return DAR_POPULAR_AREAS
    .filter(area => area.toLowerCase().includes(query))
    .slice(0, 5)
    .map(area => `${area}, Dar es Salaam`);
}

// Format address for display
export function formatAddress(location: TanzaniaLocation): string {
  return location.formatted;
}

// Save location to local storage
export function saveLocation(location: TanzaniaLocation): void {
  localStorage.setItem('gopay_user_location', JSON.stringify(location));
}

// Load location from local storage
export function loadSavedLocation(): TanzaniaLocation | null {
  const saved = localStorage.getItem('gopay_user_location');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
}

// Get default location (Dar es Salaam center)
export function getDefaultLocation(): TanzaniaLocation {
  return {
    region: 'Dar es Salaam',
    district: 'Kinondoni',
    ward: 'Masaki',
    latitude: -6.7924,
    longitude: 39.2083,
    formatted: 'Masaki, Kinondoni, Dar es Salaam'
  };
}