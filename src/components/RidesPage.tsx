import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { User } from '../App';
import { 
  ArrowLeft, MapPin, Clock, Star, Navigation, User as UserIcon,
  Phone, MessageCircle, Shield, ChevronRight, Check, Bike,
  Car, Zap, Leaf, Users, Sparkles, Info, DollarSign, X
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  getCurrentLocation, 
  getDefaultLocation, 
  calculateDistance,
  type TanzaniaLocation 
} from '../utils/locationService';

interface RidesPageProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

interface RideType {
  id: string;
  name: string;
  description: string;
  icon: any;
  basePrice: number;
  pricePerKm: number;
  capacity: number;
  estimatedTime: string;
  features: string[];
  gradient: string;
  available: boolean;
  ecoFriendly?: boolean;
}

interface Driver {
  id: string;
  name: string;
  rating: number;
  trips: number;
  vehicleType: string;
  vehiclePlate: string;
  vehicleColor: string;
  phone: string;
  photo: string;
}

export function RidesPage({ user, accessToken, onBack }: RidesPageProps) {
  const [activeView, setActiveView] = useState<'select' | 'booking' | 'searching' | 'matched' | 'riding' | 'completed'>('select');
  const [pickup, setPickup] = useState<TanzaniaLocation | null>(null);
  const [destination, setDestination] = useState<string>('');
  const [selectedRide, setSelectedRide] = useState<RideType | null>(null);
  const [distance, setDistance] = useState(5); // km
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [pin, setPin] = useState('');
  const [processing, setProcessing] = useState(false);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [searchProgress, setSearchProgress] = useState(0);

  useEffect(() => {
    initializeLocation();
  }, []);

  const initializeLocation = async () => {
    try {
      const loc = await getCurrentLocation();
      setPickup(loc || getDefaultLocation());
    } catch (error) {
      // Silently fallback to default location
      setPickup(getDefaultLocation());
    }
  };

  // Tanzania ride types matching Bolt prices
  const rideTypes: RideType[] = [
    {
      id: 'boda',
      name: 'Boda Boda',
      description: 'Motorcycle - Fast & affordable',
      icon: Bike,
      basePrice: 1000,
      pricePerKm: 500,
      capacity: 1,
      estimatedTime: '2-5 min',
      features: ['Fastest option', 'Beat traffic', 'Helmet provided', 'Solo rider only'],
      gradient: 'from-green-500 to-emerald-600',
      available: true
    },
    {
      id: 'economy',
      name: 'goPay Eco',
      description: 'Affordable rides',
      icon: Car,
      basePrice: 2000,
      pricePerKm: 1000,
      capacity: 4,
      estimatedTime: '3-7 min',
      features: ['Most affordable car', 'Up to 4 passengers', 'AC available', 'Comfortable'],
      gradient: 'from-blue-500 to-blue-600',
      available: true
    },
    {
      id: 'comfort',
      name: 'goPay Comfort',
      description: 'Premium vehicles',
      icon: Car,
      basePrice: 3000,
      pricePerKm: 1500,
      capacity: 4,
      estimatedTime: '3-7 min',
      features: ['Newer vehicles', 'Top-rated drivers', 'Extra legroom', 'Premium comfort'],
      gradient: 'from-purple-500 to-purple-600',
      available: true
    },
    {
      id: 'xl',
      name: 'goPay XL',
      description: 'Extra space for groups',
      icon: Users,
      basePrice: 4000,
      pricePerKm: 1800,
      capacity: 6,
      estimatedTime: '5-10 min',
      features: ['6-7 passengers', 'Large luggage space', 'SUVs & Vans', 'Group travel'],
      gradient: 'from-orange-500 to-red-500',
      available: true
    },
    {
      id: 'electric',
      name: 'goPay Green',
      description: 'Electric & hybrid vehicles',
      icon: Leaf,
      basePrice: 2500,
      pricePerKm: 1200,
      capacity: 4,
      estimatedTime: '4-8 min',
      features: ['Eco-friendly', 'Electric/Hybrid', 'Reduce emissions', 'Silent ride'],
      gradient: 'from-green-600 to-teal-600',
      available: true,
      ecoFriendly: true
    }
  ];

  useEffect(() => {
    if (selectedRide) {
      const price = selectedRide.basePrice + (selectedRide.pricePerKm * distance);
      setEstimatedPrice(price);
    }
  }, [selectedRide, distance]);

  const handleBookRide = async () => {
    if (!selectedRide || !pickup || !destination || !pin) {
      alert('Please fill in all fields');
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/rides/book`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            rideType: selectedRide.id,
            rideTypeName: selectedRide.name,
            pickup: pickup.formatted,
            destination,
            distance,
            estimatedPrice,
            pin
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setActiveView('searching');
        simulateDriverSearch();
      } else {
        alert(data.error || 'Booking failed');
      }
    } catch (error) {
      console.error('Error booking ride:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const simulateDriverSearch = () => {
    setSearchProgress(0);
    const interval = setInterval(() => {
      setSearchProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Simulate driver match
          setDriver({
            id: 'driver-001',
            name: 'John Mtui',
            rating: 4.9,
            trips: 1247,
            vehicleType: selectedRide?.name || 'Boda Boda',
            vehiclePlate: 'T 234 ABC',
            vehicleColor: 'Blue',
            phone: '+255 712 345 678',
            photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'
          });
          setActiveView('matched');
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  // Select Ride Type
  if (activeView === 'select') {
    return (
      <div className="min-h-screen bg-white pb-20">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Book a Ride</h1>
              <p className="text-sm text-gray-500">Fast & affordable transportation</p>
            </div>
          </div>

          {/* Location Inputs */}
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Pickup Location</p>
                <p className="font-semibold">{pickup?.formatted || 'Getting location...'}</p>
              </div>
              <button className="text-green-600 text-sm font-semibold">Change</button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="size-4 text-white" />
              </div>
              <input
                type="text"
                placeholder="Where to?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="flex-1 bg-transparent border-0 focus:outline-none font-semibold"
              />
            </div>
          </div>
        </div>

        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">Choose a ride</h2>
          
          <div className="space-y-3">
            {rideTypes.map((ride) => {
              const Icon = ride.icon;
              const price = ride.basePrice + (ride.pricePerKm * distance);

              return (
                <button
                  key={ride.id}
                  onClick={() => {
                    setSelectedRide(ride);
                    setActiveView('booking');
                  }}
                  disabled={!ride.available}
                  className={`w-full bg-white border-2 rounded-2xl p-4 hover:border-black transition-all ${
                    !ride.available ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${ride.gradient} rounded-xl flex items-center justify-center`}>
                      <Icon className="size-8 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold">{ride.name}</p>
                        {ride.ecoFriendly && (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                            <Leaf className="size-3" />
                            Eco
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{ride.description}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="size-3" />
                          <span>{ride.estimatedTime}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Users className="size-3" />
                          <span>{ride.capacity} {ride.capacity === 1 ? 'person' : 'people'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">TZS {price.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">~{distance} km</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Info */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Info className="size-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-900 mb-1">Real-time pricing</p>
                <p className="text-xs text-blue-700">
                  Prices may vary based on traffic, demand, and exact distance. You'll see the final price before confirming.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Booking Confirmation
  if (activeView === 'booking' && selectedRide) {
    const Icon = selectedRide.icon;

    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveView('select')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-xl font-bold">Confirm Ride</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Selected Ride */}
          <div className={`bg-gradient-to-br ${selectedRide.gradient} text-white rounded-2xl p-6`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Icon className="size-8" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">{selectedRide.name}</h2>
                <p className="text-sm opacity-90">{selectedRide.description}</p>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="opacity-90">Estimated Fare</span>
                <span className="text-3xl font-bold">TZS {estimatedPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Trip Details */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Pickup</p>
                <p className="font-semibold">{pickup?.formatted}</p>
              </div>
            </div>

            <div className="border-l-2 border-gray-300 border-dashed h-6 ml-4" />

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="size-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Destination</p>
                <p className="font-semibold">{destination}</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-bold mb-3">What's included</h3>
            <div className="grid grid-cols-2 gap-2">
              {selectedRide.features.map((feature, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
                  <Check className="size-4 text-green-600" />
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Distance Adjuster */}
          <div>
            <label className="block font-bold mb-2">Distance: {distance} km</label>
            <input
              type="range"
              min="1"
              max="50"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 km</span>
              <span>50 km</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
            <h3 className="font-bold mb-3">Payment Method</h3>
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4 flex items-center gap-3">
              <Shield className="size-6" />
              <div className="flex-1">
                <p className="font-bold">goPay Wallet</p>
                <p className="text-sm opacity-90">Pay securely with PIN</p>
              </div>
            </div>
          </div>

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

          {/* Confirm Button */}
          <Button
            onClick={handleBookRide}
            disabled={processing || pin.length !== 4 || !destination}
            className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full font-bold text-lg disabled:opacity-50"
          >
            {processing ? 'Booking...' : `Confirm & Book - TZS ${estimatedPrice.toLocaleString()}`}
          </Button>
        </div>
      </div>
    );
  }

  // Searching for Driver
  if (activeView === 'searching') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center max-w-md w-full">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-25" />
            <div className="relative w-32 h-32 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <Navigation className="size-16 text-white animate-pulse" />
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-2">Finding your ride...</h1>
          <p className="text-gray-600 mb-6">Connecting you with nearby drivers</p>

          <div className="bg-gray-100 rounded-full h-3 overflow-hidden mb-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-full transition-all duration-300"
              style={{ width: `${searchProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500">{searchProgress}% complete</p>

          <div className="mt-8 bg-gray-50 rounded-2xl p-4 text-left">
            <p className="text-sm font-semibold text-gray-900 mb-2">Your ride details:</p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• {selectedRide?.name}</p>
              <p>• {destination}</p>
              <p>• TZS {estimatedPrice.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Driver Matched
  if (activeView === 'matched' && driver) {
    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <h1 className="text-xl font-bold text-center">Driver on the way</h1>
          <p className="text-sm text-gray-500 text-center">Arriving in 3 minutes</p>
        </div>

        <div className="p-4 space-y-6">
          {/* Driver Info */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <ImageWithFallback 
                  src={driver.photo}
                  alt={driver.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
                  <Check className="size-4" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">{driver.name}</h2>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="size-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">{driver.rating}</span>
                  </div>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">{driver.trips} trips</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Vehicle</span>
                <span className="font-semibold">{driver.vehicleType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Plate Number</span>
                <span className="font-bold text-lg">{driver.vehiclePlate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Color</span>
                <span className="font-semibold">{driver.vehicleColor}</span>
              </div>
            </div>
          </div>

          {/* Contact Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-white border-2 border-gray-200 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-black transition-all">
              <Phone className="size-6 text-green-600" />
              <span className="font-semibold">Call Driver</span>
            </button>
            <button className="bg-white border-2 border-gray-200 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-black transition-all">
              <MessageCircle className="size-6 text-blue-600" />
              <span className="font-semibold">Message</span>
            </button>
          </div>

          {/* Trip Details */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
            <h3 className="font-bold">Trip Details</h3>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Pickup</p>
                <p className="font-semibold">{pickup?.formatted}</p>
              </div>
            </div>

            <div className="border-l-2 border-gray-300 border-dashed h-6 ml-4" />

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="size-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Destination</p>
                <p className="font-semibold">{destination}</p>
              </div>
            </div>
          </div>

          {/* Fare */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90 mb-1">Total Fare</p>
                <p className="text-3xl font-bold">TZS {estimatedPrice.toLocaleString()}</p>
              </div>
              <Shield className="size-12 opacity-50" />
            </div>
          </div>

          {/* Cancel Button */}
          <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-200 transition-all">
            Cancel Ride
          </button>

          {/* Start Ride Button (for demo) */}
          <button 
            onClick={() => setActiveView('riding')}
            className="w-full bg-green-600 text-white py-3 rounded-full font-semibold hover:bg-green-700 transition-all"
          >
            Start Ride (Demo)
          </button>
        </div>
      </div>
    );
  }

  // Riding - During Trip
  if (activeView === 'riding' && driver) {
    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="sticky top-0 z-20 bg-green-600 text-white px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Navigation className="size-5 animate-pulse" />
              <span className="font-bold">In Progress</span>
            </div>
            <button className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
              5 mins away
            </button>
          </div>
          <p className="text-sm opacity-90">Heading to {destination}</p>
        </div>

        <div className="p-4 space-y-6">
          {/* Map Placeholder */}
          <div className="bg-gray-100 rounded-2xl h-64 flex items-center justify-center">
            <div className="text-center">
              <Navigation className="size-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Map View</p>
              <p className="text-sm text-gray-500">Tracking your location...</p>
            </div>
          </div>

          {/* Driver Card (Minimized) */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <ImageWithFallback 
                src={driver.photo}
                alt={driver.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-bold">{driver.name}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Star className="size-3 fill-yellow-400 text-yellow-400" />
                  <span>{driver.rating}</span>
                  <span>•</span>
                  <span>{driver.vehiclePlate}</span>
                </div>
              </div>
              <button className="p-2 bg-green-100 rounded-full">
                <Phone className="size-5 text-green-600" />
              </button>
            </div>
          </div>

          {/* Trip Progress */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Distance remaining</span>
              <span className="font-bold">{(distance * 0.7).toFixed(1)} km</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="bg-green-600 h-full w-1/3 transition-all" />
            </div>
          </div>

          {/* Arrival Info */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <Clock className="size-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-green-900">Estimated Arrival</p>
                <p className="text-2xl font-bold text-green-600">5 mins</p>
              </div>
            </div>
          </div>

          {/* Complete Ride Button (for demo) */}
          <button 
            onClick={() => setActiveView('completed')}
            className="w-full bg-green-600 text-white py-4 rounded-full font-bold hover:bg-green-700 transition-all"
          >
            Complete Ride (Demo)
          </button>
        </div>
      </div>
    );
  }

  // Ride Completed
  if (activeView === 'completed' && driver) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="size-10 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Trip Completed!</h1>
          <p className="text-gray-600 mb-6">
            Thanks for riding with goPay
          </p>

          {/* Trip Summary */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6 text-left space-y-3">
            <h3 className="font-bold mb-3">Trip Summary</h3>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Driver</span>
              <span className="font-semibold">{driver.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Vehicle</span>
              <span className="font-semibold">{driver.vehiclePlate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Distance</span>
              <span className="font-semibold">{distance} km</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Duration</span>
              <span className="font-semibold">12 mins</span>
            </div>
            <div className="pt-3 border-t flex justify-between">
              <span className="font-bold">Total Paid</span>
              <span className="text-2xl font-bold text-green-600">TZS {estimatedPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Rate Driver */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-4">
            <p className="font-bold mb-3">Rate your driver</p>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} className="p-1">
                  <Star className="size-8 fill-yellow-400 text-yellow-400 hover:scale-110 transition-transform" />
                </button>
              ))}
            </div>
            <textarea
              placeholder="Share your experience..."
              className="w-full h-20 p-3 bg-gray-50 rounded-xl border-0 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => {
                setActiveView('select');
                setSelectedRide(null);
                setDriver(null);
                setDestination('');
                setPin('');
              }}
              className="w-full h-12 bg-green-600 hover:bg-green-700"
            >
              Book Another Ride
            </Button>
            <Button
              onClick={onBack}
              variant="outline"
              className="w-full h-12"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}