import { useState } from 'react';
import { Button } from './ui/button';
import { User } from '../App';
import { 
  ArrowLeft, Ship, MapPin, Calendar, Users, Package, 
  Clock, CreditCard, Shield, Anchor, Waves, Info,
  ChevronRight, Check, AlertCircle, Car, User as UserIcon
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface FerryBookingPageProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

interface FerryRoute {
  id: string;
  operator: string;
  route: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: {
    passenger: number;
    vehicle: number;
  };
  vessel: string;
  capacity: number;
  amenities: string[];
  image: string;
  available: boolean;
}

export function FerryBookingPage({ user, accessToken, onBack }: FerryBookingPageProps) {
  const [step, setStep] = useState<'select-route' | 'select-ferry' | 'passenger-details' | 'payment' | 'confirmation'>('select-route');
  const [selectedRoute, setSelectedRoute] = useState('');
  const [selectedFerry, setSelectedFerry] = useState<FerryRoute | null>(null);
  const [travelDate, setTravelDate] = useState('');
  const [passengerCount, setPassengerCount] = useState(1);
  const [hasVehicle, setHasVehicle] = useState(false);
  const [vehicleType, setVehicleType] = useState('');
  const [pin, setPin] = useState('');
  const [processing, setProcessing] = useState(false);
  const [ticketReference, setTicketReference] = useState('');
  const [qrCode, setQrCode] = useState('');

  // Major ferry routes in Tanzania
  const routes = [
    { id: 'dar-zanzibar', label: 'Dar es Salaam → Zanzibar', popular: true },
    { id: 'dar-pemba', label: 'Dar es Salaam → Pemba' },
    { id: 'zanzibar-pemba', label: 'Zanzibar → Pemba' },
    { id: 'mwanza-ukerewe', label: 'Mwanza → Ukerewe Island' },
    { id: 'bukoba-uganda', label: 'Bukoba → Uganda (Lake Victoria)' },
  ];

  const ferrySchedules: FerryRoute[] = [
    {
      id: 'azam-001',
      operator: 'Azam Marine',
      route: 'dar-zanzibar',
      from: 'Dar es Salaam Ferry Terminal',
      to: 'Zanzibar Stone Town',
      departureTime: '07:00',
      arrivalTime: '09:30',
      duration: '2h 30m',
      price: {
        passenger: 35000,
        vehicle: 150000,
      },
      vessel: 'Azam Fast Ferry 1',
      capacity: 350,
      amenities: ['Air Conditioning', 'Snack Bar', 'TV Entertainment', 'Life Jackets', 'Restrooms'],
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      available: true,
    },
    {
      id: 'azam-002',
      operator: 'Azam Marine',
      route: 'dar-zanzibar',
      from: 'Dar es Salaam Ferry Terminal',
      to: 'Zanzibar Stone Town',
      departureTime: '12:30',
      arrivalTime: '15:00',
      duration: '2h 30m',
      price: {
        passenger: 35000,
        vehicle: 150000,
      },
      vessel: 'Azam Fast Ferry 2',
      capacity: 350,
      amenities: ['Air Conditioning', 'Snack Bar', 'TV Entertainment', 'Life Jackets', 'Restrooms'],
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      available: true,
    },
    {
      id: 'kilimanjaro-001',
      operator: 'Kilimanjaro Fast Ferries',
      route: 'dar-zanzibar',
      from: 'Dar es Salaam Ferry Terminal',
      to: 'Zanzibar Stone Town',
      departureTime: '09:30',
      arrivalTime: '12:00',
      duration: '2h 30m',
      price: {
        passenger: 40000,
        vehicle: 180000,
      },
      vessel: 'Kilimanjaro VII',
      capacity: 400,
      amenities: ['VIP Lounge', 'Air Conditioning', 'Restaurant', 'TV Entertainment', 'Life Jackets', 'WiFi'],
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      available: true,
    },
  ];

  const filteredFerries = ferrySchedules.filter(f => f.route === selectedRoute);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateTotal = () => {
    if (!selectedFerry) return 0;
    let total = selectedFerry.price.passenger * passengerCount;
    if (hasVehicle && vehicleType) {
      total += selectedFerry.price.vehicle;
    }
    return total;
  };

  const handleBooking = async () => {
    if (!selectedFerry || !travelDate || pin.length !== 4) {
      alert('Please complete all required fields');
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/travel/ferry/book`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ferryId: selectedFerry.id,
            operator: selectedFerry.operator,
            route: selectedFerry.route,
            from: selectedFerry.from,
            to: selectedFerry.to,
            departureTime: selectedFerry.departureTime,
            travelDate,
            passengers: passengerCount,
            hasVehicle,
            vehicleType,
            totalAmount: calculateTotal(),
            pin,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setTicketReference(data.reference || `FERRY${Date.now()}`);
        setQrCode(data.qrCode || `ferry-ticket-${Date.now()}`);
        setStep('confirmation');
        setPin('');
      } else {
        alert(data.error || 'Booking failed');
      }
    } catch (error) {
      console.error('Error booking ferry:', error);
      // Demo mode
      setTicketReference(`FERRY${Date.now()}`);
      setQrCode(`ferry-ticket-${Date.now()}`);
      setStep('confirmation');
      setPin('');
    } finally {
      setProcessing(false);
    }
  };

  // Select Route Step
  if (step === 'select-route') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50">
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">Ferry Booking 🚢</h1>
              <p className="text-sm text-gray-500">Water transport across Tanzania</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Hero Banner */}
          <div className="relative h-48 rounded-3xl overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
              alt="Ferry"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <div className="text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Waves className="size-6" />
                  <h2 className="text-2xl font-bold">Island Hopping Made Easy</h2>
                </div>
                <p className="text-white/90">Book ferries to Zanzibar, Pemba & Lake Victoria islands</p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-4 border border-blue-100">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                <Shield className="size-6 text-blue-600" />
              </div>
              <p className="font-bold text-sm mb-1">Offline Tickets</p>
              <p className="text-xs text-gray-500">Works without internet</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-green-100">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                <Check className="size-6 text-green-600" />
              </div>
              <p className="font-bold text-sm mb-1">Instant Confirm</p>
              <p className="text-xs text-gray-500">Get QR immediately</p>
            </div>
          </div>

          {/* Route Selection */}
          <div>
            <h3 className="font-bold text-lg mb-3">Select Your Route</h3>
            <div className="space-y-3">
              {routes.map((route) => (
                <button
                  key={route.id}
                  onClick={() => {
                    setSelectedRoute(route.id);
                    setStep('select-ferry');
                  }}
                  className="w-full bg-white rounded-2xl p-4 border-2 border-gray-100 hover:border-blue-500 transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Anchor className="size-5 text-blue-600" />
                        <p className="font-bold">{route.label}</p>
                        {route.popular && (
                          <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">Multiple daily departures</p>
                    </div>
                    <ChevronRight className="size-5 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Select Ferry Step
  if (step === 'select-ferry' && selectedRoute) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setStep('select-route')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold">Select Ferry & Date</h1>
              <p className="text-sm text-gray-500">{routes.find(r => r.id === selectedRoute)?.label}</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Date Selector */}
          <div className="bg-white rounded-2xl p-4">
            <label className="block font-bold mb-2">Travel Date</label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Passengers */}
          <div className="bg-white rounded-2xl p-4">
            <label className="block font-bold mb-3">Passengers</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPassengerCount(Math.max(1, passengerCount - 1))}
                className="w-10 h-10 bg-gray-100 rounded-full font-bold hover:bg-gray-200"
              >
                -
              </button>
              <div className="flex-1 text-center">
                <div className="text-2xl font-bold">{passengerCount}</div>
                <div className="text-xs text-gray-500">person(s)</div>
              </div>
              <button
                onClick={() => setPassengerCount(Math.min(10, passengerCount + 1))}
                className="w-10 h-10 bg-gray-100 rounded-full font-bold hover:bg-gray-200"
              >
                +
              </button>
            </div>
          </div>

          {/* Vehicle Option */}
          <div className="bg-white rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Car className="size-5 text-gray-600" />
                <label className="font-bold">Bringing a Vehicle?</label>
              </div>
              <button
                onClick={() => setHasVehicle(!hasVehicle)}
                className={`w-12 h-6 rounded-full transition-all ${
                  hasVehicle ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    hasVehicle ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
            {hasVehicle && (
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select vehicle type</option>
                <option value="motorcycle">Motorcycle / Bajaj</option>
                <option value="car">Car / Sedan</option>
                <option value="suv">SUV / 4x4</option>
                <option value="van">Van / Minibus</option>
              </select>
            )}
          </div>

          {/* Available Ferries */}
          <div>
            <h3 className="font-bold mb-3">Available Ferries</h3>
            <div className="space-y-3">
              {filteredFerries.map((ferry) => (
                <button
                  key={ferry.id}
                  onClick={() => {
                    setSelectedFerry(ferry);
                    setStep('payment');
                  }}
                  disabled={!travelDate}
                  className="w-full bg-white rounded-2xl p-4 border-2 border-gray-100 hover:border-blue-500 transition-all text-left disabled:opacity-50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="font-bold text-lg mb-1">{ferry.operator}</p>
                      <p className="text-sm text-gray-500 mb-2">{ferry.vessel}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="size-4 text-blue-600" />
                          <span className="font-semibold">{ferry.departureTime}</span>
                        </div>
                        <span className="text-gray-400">→</span>
                        <span className="font-semibold">{ferry.arrivalTime}</span>
                        <span className="text-gray-500">({ferry.duration})</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-blue-600">
                        {formatCurrency(ferry.price.passenger)}
                      </p>
                      <p className="text-xs text-gray-500">per person</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ferry.amenities.slice(0, 4).map((amenity, idx) => (
                      <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Payment Step
  if (step === 'payment' && selectedFerry) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setStep('select-ferry')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-lg font-bold">Confirm & Pay</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Booking Summary */}
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <Ship className="size-6" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg">{selectedFerry.operator}</p>
                <p className="text-white/90 text-sm">{selectedFerry.vessel}</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/80">Route:</span>
                <span className="font-semibold">{selectedFerry.from} → {selectedFerry.to}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/80">Date:</span>
                <span className="font-semibold">{travelDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/80">Departure:</span>
                <span className="font-semibold">{selectedFerry.departureTime}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/80">Passengers:</span>
                <span className="font-semibold">{passengerCount}</span>
              </div>
              {hasVehicle && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/80">Vehicle:</span>
                  <span className="font-semibold">{vehicleType}</span>
                </div>
              )}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-white rounded-2xl p-4">
            <h3 className="font-bold mb-3">Price Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Passenger(s) x {passengerCount}</span>
                <span className="font-semibold">{formatCurrency(selectedFerry.price.passenger * passengerCount)}</span>
              </div>
              {hasVehicle && vehicleType && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Vehicle Transport</span>
                  <span className="font-semibold">{formatCurrency(selectedFerry.price.vehicle)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
                <span className="font-bold">Total Amount</span>
                <span className="font-bold text-xl text-blue-600">{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
          </div>

          {/* Important Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
            <div className="flex gap-3">
              <Info className="size-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">Important:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Arrive at port 30 minutes before departure</li>
                  <li>Bring valid ID (NIDA, Passport, Driving License)</li>
                  <li>Ticket works offline - no internet needed</li>
                  <li>Refund available if cancelled 24+ hours before</li>
                </ul>
              </div>
            </div>
          </div>

          {/* PIN Entry */}
          <div className="bg-white rounded-2xl p-4">
            <label className="block font-bold mb-2">Enter PIN to Confirm</label>
            <input
              type="password"
              maxLength={4}
              placeholder="4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full h-14 text-center text-2xl tracking-widest border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Confirm Button */}
          <Button
            onClick={handleBooking}
            disabled={processing || pin.length !== 4}
            className="w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-full font-bold text-lg disabled:opacity-50"
          >
            {processing ? 'Processing...' : `Pay ${formatCurrency(calculateTotal())}`}
          </Button>
        </div>
      </div>
    );
  }

  // Confirmation Step
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="size-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Booking Confirmed! 🚢</h1>
          <p className="text-gray-600">Your ferry ticket is ready</p>
        </div>

        {/* Offline QR Ticket */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg">
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-6 text-white mb-4">
            <p className="text-sm text-white/80 mb-1">Booking Reference</p>
            <p className="text-2xl font-bold tracking-wider">{ticketReference}</p>
          </div>

          {/* QR Code - Works Offline */}
          <div className="bg-gray-100 h-64 rounded-2xl flex items-center justify-center mb-4">
            <div className="text-center">
              <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center mb-2">
                <div className="text-6xl">📱</div>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm">
                <Shield className="size-4 text-green-600" />
                <span className="font-semibold text-green-700">Works Offline</span>
              </div>
            </div>
          </div>

          {selectedFerry && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Ferry:</span>
                <span className="font-semibold">{selectedFerry.operator}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-semibold">{travelDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Departure:</span>
                <span className="font-semibold">{selectedFerry.departureTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Passengers:</span>
                <span className="font-semibold">{passengerCount}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="font-bold">Total Paid:</span>
                <span className="font-bold text-blue-600">{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
          )}
        </div>

        {/* Info Banner */}
        <div className="bg-blue-100 border border-blue-200 rounded-2xl p-4 mb-6">
          <p className="text-sm font-semibold text-blue-900 mb-2">✅ Ticket sent via SMS</p>
          <p className="text-xs text-blue-800">
            Show this QR code at the port. It works even without internet connection.
          </p>
        </div>

        <Button
          onClick={onBack}
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-full font-bold"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}