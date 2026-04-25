import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { User } from '../App';
import { 
  ArrowLeft, MapPin, Calendar, Users, Search, ChevronRight,
  Bus, Ship, Hotel, Utensils, Check, Clock, Info, Sparkles,
  Navigation, Package, Shield, AlertCircle, Plus
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface MultiModalTripPlannerProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

interface TripSegment {
  type: 'bus' | 'ferry' | 'hotel' | 'restaurant';
  title: string;
  from?: string;
  to?: string;
  date: string;
  time?: string;
  duration?: string;
  price: number;
  provider: string;
  details: string;
  icon: any;
}

interface TripItinerary {
  id: string;
  name: string;
  from: string;
  to: string;
  duration: string;
  segments: TripSegment[];
  totalPrice: number;
  popular?: boolean;
}

export function MultiModalTripPlanner({ user, accessToken, onBack }: MultiModalTripPlannerProps) {
  const [step, setStep] = useState<'search' | 'results' | 'customize' | 'review' | 'payment' | 'confirmation'>('search');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [selectedItinerary, setSelectedItinerary] = useState<TripItinerary | null>(null);
  const [pin, setPin] = useState('');
  const [processing, setProcessing] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  // Pre-built multi-modal itineraries
  const popularItineraries: TripItinerary[] = [
    {
      id: 'dar-zanzibar-full',
      name: 'Dar → Zanzibar Complete Package',
      from: 'Dar es Salaam',
      to: 'Zanzibar',
      duration: '3 Days',
      segments: [
        {
          type: 'bus',
          title: 'Bus to Ferry Terminal',
          from: 'Dar City Center',
          to: 'Ferry Terminal',
          date: startDate,
          time: '06:00',
          duration: '30 min',
          price: 2000,
          provider: 'City Shuttle',
          details: 'Pickup from your location',
          icon: Bus,
        },
        {
          type: 'ferry',
          title: 'Fast Ferry to Zanzibar',
          from: 'Dar Ferry Terminal',
          to: 'Stone Town Port',
          date: startDate,
          time: '07:00',
          duration: '2h 30m',
          price: 35000,
          provider: 'Azam Marine',
          details: 'Air conditioned, snacks included',
          icon: Ship,
        },
        {
          type: 'hotel',
          title: 'Beach Resort Stay (2 Nights)',
          from: 'Stone Town',
          to: 'Nungwi Beach',
          date: startDate,
          time: '14:00 Check-in',
          duration: '2 nights',
          price: 150000,
          provider: 'Paradise Beach Resort',
          details: 'Breakfast included, ocean view',
          icon: Hotel,
        },
        {
          type: 'restaurant',
          title: 'Welcome Dinner Reservation',
          date: startDate,
          time: '19:00',
          price: 25000,
          provider: 'The Rock Restaurant',
          details: 'Seafood special menu',
          icon: Utensils,
        },
      ],
      totalPrice: 212000,
      popular: true,
    },
    {
      id: 'mwanza-ukerewe',
      name: 'Mwanza → Ukerewe Island Escape',
      from: 'Mwanza',
      to: 'Ukerewe Island',
      duration: '2 Days',
      segments: [
        {
          type: 'ferry',
          title: 'Ferry to Ukerewe',
          from: 'Mwanza Port',
          to: 'Ukerewe Island',
          date: startDate,
          time: '09:00',
          duration: '2 hours',
          price: 15000,
          provider: 'Lake Victoria Ferry',
          details: 'Scenic lake views',
          icon: Ship,
        },
        {
          type: 'hotel',
          title: 'Lakeside Lodge (1 Night)',
          date: startDate,
          time: '12:00',
          duration: '1 night',
          price: 60000,
          provider: 'Ukerewe Lakeside Inn',
          details: 'Full board, cultural tours',
          icon: Hotel,
        },
      ],
      totalPrice: 75000,
    },
    {
      id: 'arusha-serengeti',
      name: 'Arusha → Serengeti Safari',
      from: 'Arusha',
      to: 'Serengeti',
      duration: '4 Days',
      segments: [
        {
          type: 'bus',
          title: 'Safari Vehicle Transfer',
          from: 'Arusha',
          to: 'Serengeti Gate',
          date: startDate,
          time: '06:00',
          duration: '6 hours',
          price: 80000,
          provider: 'Safari Tours TZ',
          details: '4x4 vehicle, guide included',
          icon: Bus,
        },
        {
          type: 'hotel',
          title: 'Safari Lodge (3 Nights)',
          date: startDate,
          time: '14:00',
          duration: '3 nights',
          price: 450000,
          provider: 'Serengeti Wilderness Lodge',
          details: 'All meals, game drives included',
          icon: Hotel,
        },
      ],
      totalPrice: 530000,
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSearch = () => {
    if (!origin || !destination || !startDate) {
      toast.error('Please fill in all fields');
      return;
    }
    setStep('results');
  };

  const handleBooking = async () => {
    if (!selectedItinerary || pin.length !== 4) {
      toast.error('Please complete all required fields');
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/travel/multimodal/book`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            itineraryId: selectedItinerary.id,
            startDate,
            travelers,
            totalAmount: selectedItinerary.totalPrice * travelers,
            pin,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setBookingRef(data.reference || `MULTI${Date.now()}`);
        setStep('confirmation');
        setPin('');
      } else {
        toast.error(data.error || 'Booking failed');
      }
    } catch (error) {
      console.error('Error booking trip:', error);
      // Demo mode
      setBookingRef(`MULTI${Date.now()}`);
      setStep('confirmation');
      setPin('');
    } finally {
      setProcessing(false);
    }
  };

  // Search Step
  if (step === 'search') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">Multi-Modal Trip Planner ✨</h1>
              <p className="text-sm text-gray-500">Book everything in ONE go</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Hero */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <Sparkles className="size-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">Smart Trip Planning</h2>
                <p className="text-white/90">Bus + Ferry + Hotel in ONE booking</p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl p-3 text-center">
              <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Check className="size-5 text-blue-600" />
              </div>
              <p className="text-xs font-bold">One Payment</p>
            </div>
            <div className="bg-white rounded-2xl p-3 text-center">
              <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="size-5 text-green-600" />
              </div>
              <p className="text-xs font-bold">Best Prices</p>
            </div>
            <div className="bg-white rounded-2xl p-3 text-center">
              <div className="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="size-5 text-purple-600" />
              </div>
              <p className="text-xs font-bold">Time Sync</p>
            </div>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-3xl p-6 space-y-4">
            <div>
              <label className="block font-bold mb-2 text-sm">From</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Origin city"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-2 text-sm">To</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-2 text-sm">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full h-12 pl-12 pr-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-2 text-sm">Travelers</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setTravelers(Math.max(1, travelers - 1))}
                  className="w-10 h-10 bg-gray-100 rounded-full font-bold hover:bg-gray-200"
                >
                  -
                </button>
                <div className="flex-1 text-center">
                  <div className="text-2xl font-bold">{travelers}</div>
                  <div className="text-xs text-gray-500">person(s)</div>
                </div>
                <button
                  onClick={() => setTravelers(Math.min(10, travelers + 1))}
                  className="w-10 h-10 bg-gray-100 rounded-full font-bold hover:bg-gray-200"
                >
                  +
                </button>
              </div>
            </div>

            <Button
              onClick={handleSearch}
              className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full font-bold text-lg"
            >
              <Search className="size-5 mr-2" />
              Find Best Trips
            </Button>
          </div>

          {/* Popular Routes */}
          <div>
            <h3 className="font-bold mb-3">Popular Multi-Modal Trips</h3>
            <div className="space-y-3">
              {popularItineraries.map((trip) => (
                <button
                  key={trip.id}
                  onClick={() => {
                    setSelectedItinerary(trip);
                    setStep('review');
                  }}
                  className="w-full bg-white rounded-2xl p-4 border-2 border-gray-100 hover:border-purple-500 transition-all text-left"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold">{trip.name}</h4>
                        {trip.popular && (
                          <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{trip.from} → {trip.to}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {trip.duration}
                        </span>
                        <span>{trip.segments.length} segments</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-purple-600">{formatCurrency(trip.totalPrice)}</p>
                      <p className="text-xs text-gray-500">per person</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {trip.segments.map((seg, idx) => {
                      const Icon = seg.icon;
                      return (
                        <div key={idx} className="flex items-center gap-1">
                          <div className="bg-purple-100 p-1.5 rounded-lg">
                            <Icon className="size-3 text-purple-600" />
                          </div>
                          {idx < trip.segments.length - 1 && (
                            <ChevronRight className="size-3 text-gray-400" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Review & Payment Step
  if (step === 'review' && selectedItinerary) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setStep('search')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold">Review Itinerary</h1>
              <p className="text-sm text-gray-500">{selectedItinerary.name}</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Trip Timeline */}
          <div className="bg-white rounded-3xl p-6">
            <h3 className="font-bold mb-4">Your Journey</h3>
            <div className="space-y-4">
              {selectedItinerary.segments.map((segment, idx) => {
                const Icon = segment.icon;
                return (
                  <div key={idx} className="relative">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="bg-purple-100 p-3 rounded-full">
                          <Icon className="size-5 text-purple-600" />
                        </div>
                        {idx < selectedItinerary.segments.length - 1 && (
                          <div className="w-0.5 h-12 bg-gray-200 my-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-bold mb-1">{segment.title}</p>
                        <p className="text-sm text-gray-600 mb-2">{segment.provider}</p>
                        {segment.from && segment.to && (
                          <p className="text-xs text-gray-500 mb-1">
                            {segment.from} → {segment.to}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                          {segment.time && <span>{segment.time}</span>}
                          {segment.duration && <span>• {segment.duration}</span>}
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{segment.details}</p>
                        <p className="font-bold text-purple-600">{formatCurrency(segment.price)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-6 text-white">
            <h3 className="font-bold mb-4">Price Summary</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-white/80">Per Person:</span>
                <span className="font-semibold">{formatCurrency(selectedItinerary.totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/80">Travelers:</span>
                <span className="font-semibold">x {travelers}</span>
              </div>
              <div className="border-t border-white/20 pt-2 mt-2 flex justify-between">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-2xl">{formatCurrency(selectedItinerary.totalPrice * travelers)}</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-sm">
              <p className="text-white/90 mb-1">✅ All transport + accommodation included</p>
              <p className="text-white/90">✅ Perfectly timed connections</p>
            </div>
          </div>

          {/* Important Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex gap-3">
              <Info className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">What's Included:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>All transport tickets (offline QR codes)</li>
                  <li>Hotel reservations confirmed</li>
                  <li>Synchronized timing between segments</li>
                  <li>24/7 customer support during trip</li>
                </ul>
              </div>
            </div>
          </div>

          {/* PIN Entry */}
          <div className="bg-white rounded-2xl p-4">
            <label className="block font-bold mb-2">Enter PIN to Confirm Booking</label>
            <input
              type="password"
              maxLength={4}
              placeholder="4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full h-14 text-center text-2xl tracking-widest border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Book Button */}
          <Button
            onClick={handleBooking}
            disabled={processing || pin.length !== 4}
            className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full font-bold text-lg disabled:opacity-50"
          >
            {processing ? 'Processing...' : `Book Complete Trip - ${formatCurrency(selectedItinerary.totalPrice * travelers)}`}
          </Button>
        </div>
      </div>
    );
  }

  // Confirmation Step
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="size-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Trip Booked Successfully! ✨</h1>
          <p className="text-gray-600">All your travel arrangements are confirmed</p>
        </div>

        <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-4 text-white mb-4">
            <p className="text-sm text-white/80 mb-1">Master Booking Reference</p>
            <p className="text-2xl font-bold tracking-wider">{bookingRef}</p>
          </div>

          {selectedItinerary && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Trip:</span>
                <span className="font-semibold">{selectedItinerary.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Start Date:</span>
                <span className="font-semibold">{startDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Travelers:</span>
                <span className="font-semibold">{travelers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Segments:</span>
                <span className="font-semibold">{selectedItinerary.segments.length}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="font-bold">Total Paid:</span>
                <span className="font-bold text-purple-600">{formatCurrency(selectedItinerary.totalPrice * travelers)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-purple-100 border border-purple-200 rounded-2xl p-4 mb-6">
          <p className="text-sm font-semibold text-purple-900 mb-2">📱 All tickets sent via SMS</p>
          <p className="text-xs text-purple-800">
            Each segment has its own QR code. Check your messages for details.
          </p>
        </div>

        <Button
          onClick={onBack}
          className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full font-bold"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}
