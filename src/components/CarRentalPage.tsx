import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { User } from '../App';
import { 
  ArrowLeft, Calendar, MapPin, Star, Users, Fuel, Settings as SettingsIcon,
  ChevronRight, Check, Car, Shield, Info, DollarSign, Phone, Clock,
  Navigation, Gauge, Package, Sparkles, X, Briefcase, Zap, Crown
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  getCurrentLocation, 
  getDefaultLocation, 
  type TanzaniaLocation 
} from '../utils/locationService';

interface CarRentalPageProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

interface Vehicle {
  id: string;
  name: string;
  brand: string;
  category: 'economy' | 'suv' | 'luxury' | 'van' | 'pickup';
  year: number;
  seats: number;
  transmission: 'automatic' | 'manual';
  fuelType: 'petrol' | 'diesel' | 'hybrid' | 'electric';
  image: string;
  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;
  features: string[];
  available: boolean;
  rating: number;
  trips: number;
  rentalCompany: string;
  location: string;
}

interface RentalBooking {
  vehicleId: string;
  vehicleName: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  dropoffDate: string;
  duration: number;
  durationType: 'daily' | 'weekly' | 'monthly';
  withDriver: boolean;
  insurance: 'basic' | 'premium' | 'comprehensive';
  totalCost: number;
}

export function CarRentalPage({ user, accessToken, onBack }: CarRentalPageProps) {
  const [activeView, setActiveView] = useState<'browse' | 'details' | 'booking' | 'confirmation'>('browse');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState('Dar es Salaam');
  const [location, setLocation] = useState<TanzaniaLocation | null>(null);
  
  // Booking state
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [withDriver, setWithDriver] = useState(false);
  const [insurance, setInsurance] = useState<'basic' | 'premium' | 'comprehensive'>('basic');
  const [pin, setPin] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    initializeLocation();
  }, []);

  const initializeLocation = async () => {
    try {
      const loc = await getCurrentLocation();
      setLocation(loc || getDefaultLocation());
      setPickupLocation(loc?.formatted || 'Masaki, Dar es Salaam');
      setDropoffLocation(loc?.formatted || 'Masaki, Dar es Salaam');
    } catch (error) {
      // Silently fallback to default location
      const defaultLoc = getDefaultLocation();
      setLocation(defaultLoc);
      setPickupLocation(defaultLoc.formatted);
      setDropoffLocation(defaultLoc.formatted);
    }
  };

  const categories = [
    { id: 'all', label: 'All Vehicles', icon: Car },
    { id: 'economy', label: 'Economy', icon: Car },
    { id: 'suv', label: 'SUV', icon: Car },
    { id: 'luxury', label: 'Luxury', icon: Crown },
    { id: 'van', label: 'Van/Minibus', icon: Users },
    { id: 'pickup', label: 'Pickup', icon: Package },
  ];

  const cities = ['Dar es Salaam', 'Arusha', 'Mwanza', 'Zanzibar', 'Dodoma'];

  // Tanzania car rental fleet
  const vehicles: Vehicle[] = [
    // Economy Cars
    {
      id: 'car-001',
      name: 'Toyota Vitz',
      brand: 'Toyota',
      category: 'economy',
      year: 2020,
      seats: 5,
      transmission: 'automatic',
      fuelType: 'petrol',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      pricePerDay: 60000,
      pricePerWeek: 360000,
      pricePerMonth: 1200000,
      features: ['AC', 'Bluetooth', 'USB Charging', 'Power Windows', 'Fuel Efficient'],
      available: true,
      rating: 4.7,
      trips: 234,
      rentalCompany: 'Coastal Car Rental',
      location: 'Dar es Salaam'
    },
    {
      id: 'car-002',
      name: 'Suzuki Swift',
      brand: 'Suzuki',
      category: 'economy',
      year: 2021,
      seats: 5,
      transmission: 'manual',
      fuelType: 'petrol',
      image: 'https://images.unsplash.com/photo-1583267746897-c1b23e1e01f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      pricePerDay: 55000,
      pricePerWeek: 330000,
      pricePerMonth: 1100000,
      features: ['AC', 'Radio', 'Power Steering', 'Central Locking', 'Low Fuel Consumption'],
      available: true,
      rating: 4.5,
      trips: 187,
      rentalCompany: 'Easy Rent Tanzania',
      location: 'Dar es Salaam'
    },

    // SUVs
    {
      id: 'car-003',
      name: 'Toyota RAV4',
      brand: 'Toyota',
      category: 'suv',
      year: 2021,
      seats: 5,
      transmission: 'automatic',
      fuelType: 'petrol',
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      pricePerDay: 120000,
      pricePerWeek: 720000,
      pricePerMonth: 2400000,
      features: ['4WD', 'GPS Navigation', 'Leather Seats', 'Sunroof', 'Parking Sensors', 'Reverse Camera'],
      available: true,
      rating: 4.9,
      trips: 156,
      rentalCompany: 'Safari Car Hire',
      location: 'Arusha'
    },
    {
      id: 'car-004',
      name: 'Land Cruiser Prado',
      brand: 'Toyota',
      category: 'suv',
      year: 2022,
      seats: 7,
      transmission: 'automatic',
      fuelType: 'diesel',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      pricePerDay: 200000,
      pricePerWeek: 1200000,
      pricePerMonth: 4000000,
      features: ['4WD', 'Off-road Ready', 'Premium Sound', 'Climate Control', 'Safari Ready', 'GPS'],
      available: true,
      rating: 5.0,
      trips: 98,
      rentalCompany: 'Safari Car Hire',
      location: 'Arusha'
    },

    // Luxury
    {
      id: 'car-005',
      name: 'Mercedes-Benz C-Class',
      brand: 'Mercedes-Benz',
      category: 'luxury',
      year: 2022,
      seats: 5,
      transmission: 'automatic',
      fuelType: 'petrol',
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      pricePerDay: 250000,
      pricePerWeek: 1500000,
      pricePerMonth: 5000000,
      features: ['Premium Leather', 'Massage Seats', 'Adaptive Cruise', 'Panoramic Roof', 'Burmester Sound'],
      available: true,
      rating: 4.9,
      trips: 67,
      rentalCompany: 'Prestige Motors TZ',
      location: 'Dar es Salaam'
    },
    {
      id: 'car-006',
      name: 'BMW 5 Series',
      brand: 'BMW',
      category: 'luxury',
      year: 2023,
      seats: 5,
      transmission: 'automatic',
      fuelType: 'hybrid',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      pricePerDay: 280000,
      pricePerWeek: 1680000,
      pricePerMonth: 5600000,
      features: ['Hybrid Technology', 'Executive Comfort', 'Head-Up Display', 'Wireless Charging', 'Premium Audio'],
      available: true,
      rating: 5.0,
      trips: 42,
      rentalCompany: 'Prestige Motors TZ',
      location: 'Dar es Salaam'
    },

    // Vans/Minibus
    {
      id: 'car-007',
      name: 'Toyota Hiace',
      brand: 'Toyota',
      category: 'van',
      year: 2020,
      seats: 14,
      transmission: 'manual',
      fuelType: 'diesel',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      pricePerDay: 150000,
      pricePerWeek: 900000,
      pricePerMonth: 3000000,
      features: ['14 Seats', 'AC', 'Large Luggage Space', 'Commercial License', 'Group Travel'],
      available: true,
      rating: 4.6,
      trips: 145,
      rentalCompany: 'Group Travel Rentals',
      location: 'Dar es Salaam'
    },

    // Pickup Trucks
    {
      id: 'car-008',
      name: 'Toyota Hilux Double Cab',
      brand: 'Toyota',
      category: 'pickup',
      year: 2021,
      seats: 5,
      transmission: 'manual',
      fuelType: 'diesel',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      pricePerDay: 100000,
      pricePerWeek: 600000,
      pricePerMonth: 2000000,
      features: ['4WD', 'Cargo Bed', 'Towing Capacity', 'Off-road', 'Heavy Duty', 'Reliable'],
      available: true,
      rating: 4.8,
      trips: 189,
      rentalCompany: 'Work & Safari Rentals',
      location: 'Mwanza'
    },

    // More Economy
    {
      id: 'car-009',
      name: 'Nissan Note',
      brand: 'Nissan',
      category: 'economy',
      year: 2019,
      seats: 5,
      transmission: 'automatic',
      fuelType: 'petrol',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      pricePerDay: 58000,
      pricePerWeek: 350000,
      pricePerMonth: 1150000,
      features: ['Compact', 'Easy Parking', 'AC', 'Bluetooth', 'City Friendly'],
      available: true,
      rating: 4.4,
      trips: 201,
      rentalCompany: 'City Car Rental',
      location: 'Dodoma'
    },

    // More SUV
    {
      id: 'car-010',
      name: 'Mitsubishi Pajero',
      brand: 'Mitsubishi',
      category: 'suv',
      year: 2020,
      seats: 7,
      transmission: 'automatic',
      fuelType: 'diesel',
      image: 'https://images.unsplash.com/photo-1566024287490-d4c8f1d1b7b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      pricePerDay: 140000,
      pricePerWeek: 840000,
      pricePerMonth: 2800000,
      features: ['7 Seats', '4WD', 'Safari Package', 'Roof Rack', 'Heavy Duty', 'Comfortable'],
      available: true,
      rating: 4.7,
      trips: 123,
      rentalCompany: 'Safari Car Hire',
      location: 'Arusha'
    },
  ];

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesCategory = selectedCategory === 'all' || vehicle.category === selectedCategory;
    const matchesCity = vehicle.location === selectedCity;
    return matchesCategory && matchesCity;
  });

  const calculateDuration = () => {
    if (!pickupDate || !dropoffDate) return { days: 0, weeks: 0, months: 0 };
    
    const pickup = new Date(pickupDate);
    const dropoff = new Date(dropoffDate);
    const diffTime = Math.abs(dropoff.getTime() - pickup.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    
    return { days, weeks, months };
  };

  const calculateTotal = () => {
    if (!selectedVehicle) return 0;
    
    const { days, weeks, months } = calculateDuration();
    let vehicleCost = 0;
    
    // Use best pricing
    if (months > 0 && days >= 30) {
      vehicleCost = selectedVehicle.pricePerMonth * months;
    } else if (weeks > 0 && days >= 7) {
      vehicleCost = selectedVehicle.pricePerWeek * weeks;
    } else {
      vehicleCost = selectedVehicle.pricePerDay * days;
    }
    
    // Driver cost: TZS 30,000/day
    const driverCost = withDriver ? (30000 * days) : 0;
    
    // Insurance cost
    const insuranceCost = insurance === 'basic' ? 10000 * days : 
                         insurance === 'premium' ? 20000 * days : 
                         30000 * days;
    
    return vehicleCost + driverCost + insuranceCost;
  };

  const handleBooking = async () => {
    if (!selectedVehicle || !pickupDate || !dropoffDate || !pin) {
      alert('Please fill in all required fields');
      return;
    }

    const { days } = calculateDuration();
    if (days < 1) {
      alert('Rental period must be at least 1 day');
      return;
    }

    setProcessing(true);
    try {
      const totalCost = calculateTotal();

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/rentals/book`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            vehicleId: selectedVehicle.id,
            vehicleName: selectedVehicle.name,
            pickupLocation,
            dropoffLocation,
            pickupDate,
            dropoffDate,
            duration: days,
            withDriver,
            insurance,
            totalCost,
            pin
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setActiveView('confirmation');
      } else {
        alert(data.error || 'Booking failed');
      }
    } catch (error) {
      console.error('Error booking rental:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Browse View
  if (activeView === 'browse') {
    return (
      <div className="min-h-screen bg-white pb-20">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                <ArrowLeft className="size-6" />
              </button>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">Car Rental</h1>
                <p className="text-sm text-gray-500">Rent daily, weekly, or monthly</p>
              </div>
            </div>

            {/* City Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-3">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap font-medium text-sm transition-all ${
                    selectedCity === city
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap font-medium text-sm transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="size-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              {filteredVehicles.length} vehicles available in {selectedCity}
            </p>
          </div>

          <div className="space-y-4">
            {filteredVehicles.map((vehicle) => (
              <button
                key={vehicle.id}
                onClick={() => {
                  setSelectedVehicle(vehicle);
                  setActiveView('details');
                }}
                className="w-full bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100"
              >
                <div className="relative h-48">
                  <ImageWithFallback 
                    src={vehicle.image} 
                    alt={vehicle.name} 
                    className="w-full h-full object-cover"
                  />
                  {vehicle.category === 'luxury' && (
                    <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                      <Crown className="size-3" />
                      Luxury
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{vehicle.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{vehicle.rentalCompany}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="size-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{vehicle.rating}</span>
                        </div>
                        <span>•</span>
                        <span>{vehicle.trips} trips</span>
                        <span>•</span>
                        <span className="capitalize">{vehicle.year}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-1">
                      <Users className="size-4" />
                      <span>{vehicle.seats}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <SettingsIcon className="size-4" />
                      <span className="capitalize">{vehicle.transmission}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Fuel className="size-4" />
                      <span className="capitalize">{vehicle.fuelType}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        TZS {vehicle.pricePerDay.toLocaleString()}
                        <span className="text-sm text-gray-500 font-normal">/day</span>
                      </p>
                      <p className="text-xs text-gray-500">From TZS {vehicle.pricePerWeek.toLocaleString()}/week</p>
                    </div>
                    <ChevronRight className="size-6 text-gray-400" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Details View
  if (activeView === 'details' && selectedVehicle) {
    return (
      <div className="min-h-screen bg-white pb-20">
        {/* Hero Image */}
        <div className="relative h-72">
          <ImageWithFallback 
            src={selectedVehicle.image} 
            alt={selectedVehicle.name} 
            className="w-full h-full object-cover"
          />
          <button 
            onClick={() => setActiveView('browse')}
            className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-2 rounded-full"
          >
            <ArrowLeft className="size-6" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold mb-2">{selectedVehicle.name}</h1>
            <p className="text-gray-600 mb-3">{selectedVehicle.brand} • {selectedVehicle.year}</p>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="size-5 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-lg">{selectedVehicle.rating}</span>
                <span className="text-gray-500 text-sm">({selectedVehicle.trips} trips)</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-600 mb-1">Rental Company</p>
              <p className="font-bold">{selectedVehicle.rentalCompany}</p>
              <p className="text-sm text-gray-500">{selectedVehicle.location}</p>
            </div>
          </div>

          {/* Specs */}
          <div>
            <h2 className="text-lg font-bold mb-3">Specifications</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="size-5 text-green-600" />
                  <span className="font-bold text-sm">Seats</span>
                </div>
                <p className="text-lg font-bold">{selectedVehicle.seats} people</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <SettingsIcon className="size-5 text-green-600" />
                  <span className="font-bold text-sm">Transmission</span>
                </div>
                <p className="text-lg font-bold capitalize">{selectedVehicle.transmission}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Fuel className="size-5 text-green-600" />
                  <span className="font-bold text-sm">Fuel Type</span>
                </div>
                <p className="text-lg font-bold capitalize">{selectedVehicle.fuelType}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="size-5 text-green-600" />
                  <span className="font-bold text-sm">Year</span>
                </div>
                <p className="text-lg font-bold">{selectedVehicle.year}</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h2 className="text-lg font-bold mb-3">Features</h2>
            <div className="grid grid-cols-2 gap-2">
              {selectedVehicle.features.map((feature, idx) => (
                <div key={idx} className="bg-green-50 rounded-xl p-3 flex items-center gap-2">
                  <Check className="size-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-green-900">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h2 className="text-lg font-bold mb-3">Rental Pricing</h2>
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Daily Rate</p>
                    <p className="text-2xl font-bold text-green-600">TZS {selectedVehicle.pricePerDay.toLocaleString()}</p>
                  </div>
                  <Zap className="size-8 text-green-600" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Weekly Rate</p>
                  <p className="text-lg font-bold">TZS {selectedVehicle.pricePerWeek.toLocaleString()}</p>
                  <p className="text-xs text-green-600">Save 15%</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Monthly Rate</p>
                  <p className="text-lg font-bold">TZS {selectedVehicle.pricePerMonth.toLocaleString()}</p>
                  <p className="text-xs text-green-600">Save 33%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Book Button */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-4 -mx-4 px-4">
            <Button
              onClick={() => setActiveView('booking')}
              className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full font-bold text-lg"
            >
              <Calendar className="size-6 mr-2" />
              Book Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Booking View
  if (activeView === 'booking' && selectedVehicle) {
    const { days } = calculateDuration();
    const totalCost = calculateTotal();

    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveView('details')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Book Rental</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Vehicle Summary */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
            <div className="flex items-center gap-4 mb-3">
              <ImageWithFallback 
                src={selectedVehicle.image}
                alt={selectedVehicle.name}
                className="w-20 h-20 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{selectedVehicle.name}</h3>
                <p className="text-sm text-gray-600">{selectedVehicle.rentalCompany}</p>
              </div>
            </div>
          </div>

          {/* Pickup Date */}
          <div>
            <label className="block font-bold mb-2">Pickup Date</label>
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
            />
          </div>

          {/* Dropoff Date */}
          <div>
            <label className="block font-bold mb-2">Dropoff Date</label>
            <input
              type="date"
              value={dropoffDate}
              onChange={(e) => setDropoffDate(e.target.value)}
              min={pickupDate || new Date().toISOString().split('T')[0]}
              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
            />
            {days > 0 && (
              <p className="text-sm text-green-600 mt-2">
                {days} day{days !== 1 ? 's' : ''} rental
              </p>
            )}
          </div>

          {/* Pickup Location */}
          <div>
            <label className="block font-bold mb-2">Pickup Location</label>
            <input
              type="text"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              placeholder="Enter pickup address"
              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
            />
          </div>

          {/* Dropoff Location */}
          <div>
            <label className="block font-bold mb-2">Dropoff Location</label>
            <input
              type="text"
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
              placeholder="Enter dropoff address"
              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
            />
          </div>

          {/* Add Driver */}
          <div>
            <label className="block font-bold mb-3">Add Professional Driver?</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setWithDriver(false)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  !withDriver 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                <p className="font-semibold mb-1">Self Drive</p>
                <p className="text-sm text-gray-600">Drive yourself</p>
              </button>
              <button
                onClick={() => setWithDriver(true)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  withDriver 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                <p className="font-semibold mb-1">With Driver</p>
                <p className="text-sm text-gray-600">+TZS 30k/day</p>
              </button>
            </div>
          </div>

          {/* Insurance */}
          <div>
            <label className="block font-bold mb-3">Insurance Coverage</label>
            <div className="space-y-3">
              <button
                onClick={() => setInsurance('basic')}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  insurance === 'basic' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold">Basic Coverage</p>
                  <p className="text-sm font-bold">+TZS 10k/day</p>
                </div>
                <p className="text-sm text-gray-600">Third party liability</p>
              </button>

              <button
                onClick={() => setInsurance('premium')}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  insurance === 'premium' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold">Premium Coverage</p>
                  <p className="text-sm font-bold">+TZS 20k/day</p>
                </div>
                <p className="text-sm text-gray-600">Collision damage waiver included</p>
              </button>

              <button
                onClick={() => setInsurance('comprehensive')}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  insurance === 'comprehensive' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold">Comprehensive Coverage</p>
                  <p className="text-sm font-bold">+TZS 30k/day</p>
                </div>
                <p className="text-sm text-gray-600">Full coverage + roadside assistance</p>
              </button>
            </div>
          </div>

          {/* Cost Breakdown */}
          {days > 0 && (
            <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
              <h3 className="font-bold mb-3">Cost Breakdown</h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Vehicle rental ({days} days)</span>
                <span className="font-semibold">
                  TZS {(totalCost - (withDriver ? 30000 * days : 0) - (insurance === 'basic' ? 10000 * days : insurance === 'premium' ? 20000 * days : 30000 * days)).toLocaleString()}
                </span>
              </div>
              {withDriver && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Driver ({days} days)</span>
                  <span className="font-semibold">TZS {(30000 * days).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Insurance ({days} days)</span>
                <span className="font-semibold">
                  TZS {(insurance === 'basic' ? 10000 * days : insurance === 'premium' ? 20000 * days : 30000 * days).toLocaleString()}
                </span>
              </div>
              <div className="border-t border-gray-300 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="text-xl font-bold text-green-600">TZS {totalCost.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* PIN */}
          <div>
            <label className="block font-bold mb-2">Enter PIN to Confirm</label>
            <input
              type="password"
              maxLength={4}
              placeholder="4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full h-14 text-center text-2xl tracking-widest border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
            />
          </div>

          {/* Book Button */}
          <Button
            onClick={handleBooking}
            disabled={processing || !pickupDate || !dropoffDate || days < 1 || pin.length !== 4}
            className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full font-bold text-lg disabled:opacity-50"
          >
            {processing ? 'Processing...' : `Confirm Booking - TZS ${totalCost.toLocaleString()}`}
          </Button>
        </div>
      </div>
    );
  }

  // Confirmation View
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="size-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600 mb-6">
          Your car rental has been reserved
        </p>

        {selectedVehicle && (
          <div className="bg-gray-50 rounded-2xl p-6 mb-6 text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Vehicle</span>
              <span className="font-bold">{selectedVehicle.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pickup</span>
              <span className="font-semibold">{pickupDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Dropoff</span>
              <span className="font-semibold">{dropoffDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Duration</span>
              <span className="font-semibold">{calculateDuration().days} days</span>
            </div>
            {withDriver && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Driver</span>
                <span className="font-semibold text-green-600">Included</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <span className="text-sm text-gray-600">Total Paid</span>
              <span className="font-semibold text-green-600">TZS {calculateTotal().toLocaleString()}</span>
            </div>
          </div>
        )}

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-sm font-semibold text-green-900 mb-1">📱 Booking confirmation sent</p>
          <p className="text-xs text-green-700">
            The rental company will contact you shortly with pickup details
          </p>
        </div>

        <Button
          onClick={onBack}
          className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full font-bold"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}