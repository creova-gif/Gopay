import { useState } from 'react';
import { Button } from './ui/button';
import { 
  ArrowLeft, Plane, Calendar, Users, MapPin, Clock, Check, X, 
  ChevronRight, Info, Luggage, Coffee, Wifi, Shield, AlertCircle
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { projectId } from '../utils/supabase/info';

interface Flight {
  id: string;
  airline: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  seats: number;
  aircraftType?: string;
  class?: string;
}

interface Passenger {
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  email: string;
  phone: string;
}

interface Props {
  flight: Flight;
  passengers: number;
  departDate: string;
  accessToken: string;
  onBack: () => void;
  onBookingComplete: () => void;
}

export function FlightBookingPage({ flight, passengers: passengerCount, departDate, accessToken, onBack, onBookingComplete }: Props) {
  const [activeStep, setActiveStep] = useState<'passengers' | 'seats' | 'extras' | 'payment' | 'confirmation'>('passengers');
  const [passengers, setPassengers] = useState<Passenger[]>(
    Array(passengerCount).fill(null).map(() => ({
      title: 'Mr',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      nationality: 'Tanzania',
      passportNumber: '',
      email: '',
      phone: ''
    }))
  );
  
  // Seat selection state
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const seatLayout = {
    rows: 20,
    columns: ['A', 'B', 'C', '', 'D', 'E', 'F'] // Empty string for aisle
  };
  const [occupiedSeats] = useState<string[]>([
    '1A', '1B', '2C', '3D', '4E', '5A', '6F', '7B', '8C', '9D', '10A', 
    '11E', '12F', '13B', '14C', '15D', '16A', '17E', '18F', '19B'
  ]);

  // Extras
  const [selectedExtras, setSelectedExtras] = useState<{[key: string]: boolean}>({
    baggage: false,
    meal: false,
    insurance: false,
    priorityBoarding: false,
    lounge: false
  });

  const extras = [
    { id: 'baggage', name: 'Extra Baggage (23kg)', price: 45000, icon: Luggage },
    { id: 'meal', name: 'In-flight Meal', price: 15000, icon: Coffee },
    { id: 'insurance', name: 'Travel Insurance', price: 25000, icon: Shield },
    { id: 'priorityBoarding', name: 'Priority Boarding', price: 20000, icon: ChevronRight },
    { id: 'lounge', name: 'Airport Lounge Access', price: 35000, icon: Coffee }
  ];

  const [pin, setPin] = useState('');
  const [processing, setProcessing] = useState(false);
  const [bookingReference, setBookingReference] = useState('');

  const updatePassenger = (index: number, field: keyof Passenger, value: string) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const toggleSeat = (seat: string) => {
    if (occupiedSeats.includes(seat)) return;
    
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(prev => prev.filter(s => s !== seat));
    } else if (selectedSeats.length < passengerCount) {
      setSelectedSeats(prev => [...prev, seat]);
    }
  };

  const toggleExtra = (extraId: string) => {
    setSelectedExtras(prev => ({ ...prev, [extraId]: !prev[extraId] }));
  };

  const getSeatPrice = (seat: string) => {
    const row = parseInt(seat.substring(0, seat.length - 1));
    if (row <= 3) return 50000; // Extra legroom
    if (row <= 5) return 30000; // Premium economy
    return 0; // Standard
  };

  const calculateTotal = () => {
    const basePrice = flight.price * passengerCount;
    const seatUpgrades = selectedSeats.reduce((sum, seat) => sum + getSeatPrice(seat), 0);
    const extrasTotal = Object.entries(selectedExtras)
      .filter(([_, selected]) => selected)
      .reduce((sum, [id, _]) => {
        const extra = extras.find(e => e.id === id);
        return sum + (extra?.price || 0) * passengerCount;
      }, 0);
    const platformFee = Math.round((basePrice + seatUpgrades + extrasTotal) * 0.15); // 15% commission
    return { basePrice, seatUpgrades, extrasTotal, platformFee, total: basePrice + seatUpgrades + extrasTotal + platformFee };
  };

  const handleBooking = async () => {
    if (!pin || pin.length !== 4) {
      alert('Please enter your 4-digit PIN');
      return;
    }

    setProcessing(true);
    try {
      const costs = calculateTotal();
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/flights/book`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            flightId: flight.id,
            airline: flight.airline,
            from: flight.from,
            to: flight.to,
            departure: flight.departure,
            date: departDate,
            passengers,
            seats: selectedSeats,
            extras: Object.entries(selectedExtras).filter(([_, v]) => v).map(([k]) => k),
            basePrice: costs.basePrice,
            seatUpgrades: costs.seatUpgrades,
            extrasTotal: costs.extrasTotal,
            platformFee: costs.platformFee,
            total: costs.total,
            pin
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setBookingReference(data.bookingReference);
        setActiveStep('confirmation');
      } else {
        alert(data.error || 'Booking failed');
      }
    } catch (error) {
      console.error('Error booking flight:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const costs = calculateTotal();

  // Passenger Details Step
  if (activeStep === 'passengers') {
    return (
      <div className="min-h-screen bg-white pb-24">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-20">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="font-bold text-xl">Passenger Details</h1>
              <p className="text-sm text-gray-600">Step 1 of 4</p>
            </div>
          </div>

          {/* Flight Summary */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-bold text-lg">{flight.from} → {flight.to}</p>
                <p className="text-sm text-gray-600">{flight.airline} • {departDate}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-green-700">TZS {flight.price.toLocaleString()}</p>
                <p className="text-xs text-gray-600">per person</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-700">
              <div className="flex items-center gap-1">
                <Clock className="size-4" />
                <span>{flight.departure} - {flight.arrival}</span>
              </div>
              <span>•</span>
              <span>{flight.duration}</span>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {passengers.map((passenger, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-4 space-y-4">
              <h3 className="font-bold text-lg">Passenger {index + 1}</h3>
              
              {/* Title & Name */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-2">Title</label>
                  <select
                    value={passenger.title}
                    onChange={(e) => updatePassenger(index, 'title', e.target.value)}
                    className="w-full h-12 px-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                  >
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Ms">Ms</option>
                    <option value="Miss">Miss</option>
                    <option value="Dr">Dr</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-2">First Name *</label>
                  <input
                    type="text"
                    value={passenger.firstName}
                    onChange={(e) => updatePassenger(index, 'firstName', e.target.value)}
                    placeholder="As per passport"
                    className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Last Name *</label>
                <input
                  type="text"
                  value={passenger.lastName}
                  onChange={(e) => updatePassenger(index, 'lastName', e.target.value)}
                  placeholder="As per passport"
                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-2">Date of Birth *</label>
                  <input
                    type="date"
                    value={passenger.dateOfBirth}
                    onChange={(e) => updatePassenger(index, 'dateOfBirth', e.target.value)}
                    className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Nationality</label>
                  <select
                    value={passenger.nationality}
                    onChange={(e) => updatePassenger(index, 'nationality', e.target.value)}
                    className="w-full h-12 px-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                  >
                    <option value="Tanzania">Tanzania</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Uganda">Uganda</option>
                    <option value="Rwanda">Rwanda</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Passport Number</label>
                <input
                  type="text"
                  value={passenger.passportNumber}
                  onChange={(e) => updatePassenger(index, 'passportNumber', e.target.value)}
                  placeholder="Optional for domestic flights"
                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                />
              </div>

              {index === 0 && (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={passenger.email}
                      onChange={(e) => updatePassenger(index, 'email', e.target.value)}
                      placeholder="For booking confirmation"
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={passenger.phone}
                      onChange={(e) => updatePassenger(index, 'phone', e.target.value)}
                      placeholder="+255 XXX XXX XXX"
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                    />
                  </div>
                </>
              )}
            </div>
          ))}

          <Button
            onClick={() => {
              const allValid = passengers.every(p => 
                p.firstName && p.lastName && p.dateOfBirth
              ) && passengers[0].email && passengers[0].phone;
              
              if (!allValid) {
                alert('Please fill in all required fields');
                return;
              }
              setActiveStep('seats');
            }}
            className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full font-bold text-lg"
          >
            Continue to Seat Selection
          </Button>
        </div>
      </div>
    );
  }

  // Seat Selection Step
  if (activeStep === 'seats') {
    return (
      <div className="min-h-screen bg-white pb-24">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-20">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => setActiveStep('passengers')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="font-bold text-xl">Select Seats</h1>
              <p className="text-sm text-gray-600">Step 2 of 4 • {selectedSeats.length} of {passengerCount} selected</p>
            </div>
          </div>

          {/* Seat Legend */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 bg-green-600 rounded"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 bg-gray-400 rounded"></div>
              <span>Occupied</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 bg-blue-600 rounded"></div>
              <span>Extra Legroom</span>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Aircraft Front */}
          <div className="text-center">
            <Plane className="size-8 mx-auto text-gray-400 mb-2" />
            <p className="text-xs text-gray-500 font-semibold">Front of Aircraft</p>
          </div>

          {/* Seat Map */}
          <div className="bg-gray-50 rounded-2xl p-4 overflow-x-auto">
            <div className="inline-block min-w-full">
              {/* Column Headers */}
              <div className="flex items-center justify-center gap-2 mb-3">
                {seatLayout.columns.map((col, idx) => (
                  <div key={idx} className={`w-8 text-center text-xs font-bold text-gray-600 ${col === '' ? 'w-6' : ''}`}>
                    {col}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {Array.from({ length: seatLayout.rows }, (_, rowIdx) => {
                const rowNum = rowIdx + 1;
                return (
                  <div key={rowNum} className="flex items-center justify-center gap-2 mb-2">
                    {seatLayout.columns.map((col, colIdx) => {
                      if (col === '') {
                        return <div key={colIdx} className="w-6"></div>; // Aisle
                      }
                      
                      const seatId = `${rowNum}${col}`;
                      const isOccupied = occupiedSeats.includes(seatId);
                      const isSelected = selectedSeats.includes(seatId);
                      const isExtraLegroom = rowNum <= 3;
                      const isPremium = rowNum > 3 && rowNum <= 5;
                      
                      return (
                        <button
                          key={seatId}
                          onClick={() => toggleSeat(seatId)}
                          disabled={isOccupied}
                          className={`w-8 h-8 rounded text-xs font-bold transition-all ${
                            isOccupied
                              ? 'bg-gray-400 text-white cursor-not-allowed'
                              : isSelected
                              ? 'bg-green-600 text-white'
                              : isExtraLegroom
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : isPremium
                              ? 'bg-purple-600 text-white hover:bg-purple-700'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {seatId}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Seat Pricing Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-bold mb-2">Seat Upgrades Available</h3>
            <div className="space-y-1 text-sm">
              <p>• Rows 1-3 (Extra Legroom): +TZS 50,000 per seat</p>
              <p>• Rows 4-5 (Premium Economy): +TZS 30,000 per seat</p>
              <p>• Rows 6-20 (Standard): Included in ticket price</p>
            </div>
          </div>

          {selectedSeats.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h3 className="font-bold mb-2">Selected Seats</h3>
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map(seat => (
                  <div key={seat} className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    {seat}
                    {getSeatPrice(seat) > 0 && (
                      <span className="text-xs">+{getSeatPrice(seat).toLocaleString()}</span>
                    )}
                  </div>
                ))}
              </div>
              {costs.seatUpgrades > 0 && (
                <p className="text-sm font-semibold text-green-900 mt-2">
                  Seat upgrades: TZS {costs.seatUpgrades.toLocaleString()}
                </p>
              )}
            </div>
          )}

          <Button
            onClick={() => setActiveStep('extras')}
            disabled={selectedSeats.length !== passengerCount}
            className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full font-bold text-lg disabled:opacity-50"
          >
            {selectedSeats.length === passengerCount 
              ? 'Continue to Extras' 
              : `Select ${passengerCount - selectedSeats.length} more seat(s)`}
          </Button>
        </div>
      </div>
    );
  }

  // Extras Step
  if (activeStep === 'extras') {
    return (
      <div className="min-h-screen bg-white pb-24">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveStep('seats')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="font-bold text-xl">Add Extras</h1>
              <p className="text-sm text-gray-600">Step 3 of 4 • Optional</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {extras.map((extra) => {
            const Icon = extra.icon;
            const isSelected = selectedExtras[extra.id];
            return (
              <button
                key={extra.id}
                onClick={() => toggleExtra(extra.id)}
                className={`w-full p-4 rounded-2xl border-2 transition-all ${
                  isSelected
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon className="size-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-bold">{extra.name}</h3>
                    <p className="text-sm text-gray-600">
                      TZS {extra.price.toLocaleString()} × {passengerCount} = TZS {(extra.price * passengerCount).toLocaleString()}
                    </p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-green-600 bg-green-600' : 'border-gray-300'
                  }`}>
                    {isSelected && <Check className="size-4 text-white" />}
                  </div>
                </div>
              </button>
            );
          })}

          {costs.extrasTotal > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="font-bold text-green-900">
                Total extras: TZS {costs.extrasTotal.toLocaleString()}
              </p>
            </div>
          )}

          <Button
            onClick={() => setActiveStep('payment')}
            className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full font-bold text-lg"
          >
            Continue to Payment
          </Button>

          <Button
            onClick={() => setActiveStep('payment')}
            className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full font-bold"
          >
            Skip Extras
          </Button>
        </div>
      </div>
    );
  }

  // Payment Step
  if (activeStep === 'payment') {
    return (
      <div className="min-h-screen bg-white pb-24">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveStep('extras')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="font-bold text-xl">Payment</h1>
              <p className="text-sm text-gray-600">Step 4 of 4</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Booking Summary */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100 space-y-3">
            <h3 className="font-bold text-lg">Booking Summary</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">Flight Tickets ({passengerCount} × {flight.price.toLocaleString()})</span>
                <span className="font-semibold">TZS {costs.basePrice.toLocaleString()}</span>
              </div>
              {costs.seatUpgrades > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-700">Seat Upgrades</span>
                  <span className="font-semibold">TZS {costs.seatUpgrades.toLocaleString()}</span>
                </div>
              )}
              {costs.extrasTotal > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-700">Extras & Add-ons</span>
                  <span className="font-semibold">TZS {costs.extrasTotal.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-700">Platform Fee (15%)</span>
                <span className="font-semibold">TZS {costs.platformFee.toLocaleString()}</span>
              </div>
              <div className="border-t border-green-200 pt-2 flex justify-between font-bold text-base">
                <span>Total Amount</span>
                <span className="text-green-700">TZS {costs.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Flight Details */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
            <h3 className="font-bold">Flight Details</h3>
            <div className="text-sm space-y-1">
              <p><span className="text-gray-600">Route:</span> <span className="font-semibold">{flight.from} → {flight.to}</span></p>
              <p><span className="text-gray-600">Date:</span> <span className="font-semibold">{departDate}</span></p>
              <p><span className="text-gray-600">Time:</span> <span className="font-semibold">{flight.departure} - {flight.arrival}</span></p>
              <p><span className="text-gray-600">Passengers:</span> <span className="font-semibold">{passengerCount}</span></p>
              <p><span className="text-gray-600">Seats:</span> <span className="font-semibold">{selectedSeats.join(', ')}</span></p>
            </div>
          </div>

          {/* PIN Entry */}
          <div>
            <label className="block font-bold mb-2">Enter PIN to Confirm Booking</label>
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
            disabled={processing || pin.length !== 4}
            className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full font-bold text-lg disabled:opacity-50"
          >
            {processing ? 'Processing...' : `Confirm Booking - TZS ${costs.total.toLocaleString()}`}
          </Button>

          <p className="text-xs text-center text-gray-500">
            By confirming, you agree to the booking terms and conditions
          </p>
        </div>
      </div>
    );
  }

  // Confirmation Step
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="size-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600 mb-6">
          Your flight has been successfully booked
        </p>

        <div className="bg-gray-50 rounded-2xl p-6 mb-6 text-left space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Booking Reference</span>
            <span className="font-bold text-green-600">{bookingReference || 'GP' + Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Flight</span>
            <span className="font-bold">{flight.from} → {flight.to}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Date</span>
            <span className="font-semibold">{departDate}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Time</span>
            <span className="font-semibold">{flight.departure}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Passengers</span>
            <span className="font-semibold">{passengerCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Seats</span>
            <span className="font-semibold">{selectedSeats.join(', ')}</span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <span className="text-sm text-gray-600">Total Paid</span>
            <span className="font-bold text-green-600">TZS {costs.total.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-sm font-semibold text-green-900 mb-1">
            ✈️ E-ticket sent to {passengers[0].email}
          </p>
          <p className="text-xs text-green-700">
            Please arrive 2 hours before departure. Check-in opens 3 hours before flight.
          </p>
        </div>

        <Button
          onClick={onBookingComplete}
          className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full font-bold mb-3"
        >
          View E-Ticket
        </Button>
        
        <Button
          onClick={onBack}
          className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full font-bold"
        >
          Back to Flights
        </Button>
      </div>
    </div>
  );
}
