import { useState } from 'react';
import { Button } from './ui/button';
import { 
  ArrowLeft, Hotel, Calendar, Users, Check, Star, Wifi, Coffee, 
  Tv, Wind, Utensils, Dumbbell, Car, Shield, X, MapPin
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { projectId } from '../utils/supabase/info';

interface Hotel {
  id: string;
  name: string;
  location: string;
  city: string;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  amenities: string[];
}

interface RoomType {
  id: string;
  name: string;
  description: string;
  price: number;
  maxGuests: number;
  bedType: string;
  size: string;
  image: string;
  amenities: string[];
}

interface Props {
  hotel: Hotel;
  checkIn: string;
  checkOut: string;
  guests: number;
  accessToken: string;
  onBack: () => void;
  onBookingComplete: () => void;
}

export function HotelBookingPage({ hotel, checkIn, checkOut, guests, accessToken, onBack, onBookingComplete }: Props) {
  const [activeStep, setActiveStep] = useState<'rooms' | 'details' | 'payment' | 'confirmation'>('rooms');
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [roomQuantity, setRoomQuantity] = useState(1);
  
  // Guest details
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  
  // Extras
  const [extras, setExtras] = useState<{[key: string]: boolean}>({
    breakfast: false,
    airport: false,
    earlyCheckin: false,
    lateCheckout: false
  });

  const [pin, setPin] = useState('');
  const [processing, setProcessing] = useState(false);
  const [bookingReference, setBookingReference] = useState('');

  const roomTypes: RoomType[] = [
    {
      id: 'standard',
      name: 'Standard Room',
      description: 'Comfortable room with city view',
      price: 85000,
      maxGuests: 2,
      bedType: 'Queen Bed',
      size: '25 sqm',
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600',
      amenities: ['Free WiFi', 'Air Conditioning', 'TV', 'Mini Bar', 'Safe']
    },
    {
      id: 'deluxe',
      name: 'Deluxe Room',
      description: 'Spacious room with premium amenities',
      price: 125000,
      maxGuests: 3,
      bedType: 'King Bed or Twin',
      size: '35 sqm',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600',
      amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Safe', 'Balcony', 'Coffee Maker']
    },
    {
      id: 'suite',
      name: 'Executive Suite',
      description: 'Luxury suite with separate living area',
      price: 220000,
      maxGuests: 4,
      bedType: 'King Bed + Sofa Bed',
      size: '55 sqm',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600',
      amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Full Bar', 'Safe', 'Balcony', 'Coffee Maker', 'Living Room', 'Jacuzzi']
    },
    {
      id: 'family',
      name: 'Family Room',
      description: 'Perfect for families with connecting rooms',
      price: 175000,
      maxGuests: 5,
      bedType: '2 Queen Beds',
      size: '45 sqm',
      image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600',
      amenities: ['Free WiFi', 'Air Conditioning', '2 TVs', 'Mini Bar', 'Safe', 'Extra Space', 'Kid Friendly']
    }
  ];

  const extraOptions = [
    { id: 'breakfast', name: 'Daily Breakfast Buffet', price: 25000, perNight: true },
    { id: 'airport', name: 'Airport Transfer (Round Trip)', price: 45000, perNight: false },
    { id: 'earlyCheckin', name: 'Early Check-in (from 10 AM)', price: 35000, perNight: false },
    { id: 'lateCheckout', name: 'Late Check-out (until 4 PM)', price: 35000, perNight: false }
  ];

  const calculateNights = () => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    if (!selectedRoom) return { roomTotal: 0, extrasTotal: 0, platformFee: 0, total: 0 };
    
    const nights = calculateNights();
    const roomTotal = selectedRoom.price * nights * roomQuantity;
    const extrasTotal = Object.entries(extras)
      .filter(([_, selected]) => selected)
      .reduce((sum, [id]) => {
        const extra = extraOptions.find(e => e.id === id);
        const price = extra?.price || 0;
        return sum + (extra?.perNight ? price * nights : price) * roomQuantity;
      }, 0);
    const platformFee = Math.round((roomTotal + extrasTotal) * 0.15);
    return { roomTotal, extrasTotal, platformFee, total: roomTotal + extrasTotal + platformFee, nights };
  };

  const handleBooking = async () => {
    if (!pin || pin.length !== 4) {
      alert('Please enter your 4-digit PIN');
      return;
    }

    if (!guestName || !guestEmail || !guestPhone) {
      alert('Please fill in all guest details');
      return;
    }

    setProcessing(true);
    try {
      const costs = calculateTotal();
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/hotels/book`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            hotelId: hotel.id,
            hotelName: hotel.name,
            roomType: selectedRoom?.name,
            roomQuantity,
            checkIn,
            checkOut,
            nights: costs.nights,
            guestName,
            guestEmail,
            guestPhone,
            guests,
            specialRequests,
            extras: Object.entries(extras).filter(([_, v]) => v).map(([k]) => k),
            roomTotal: costs.roomTotal,
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
      console.error('Error booking hotel:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const costs = calculateTotal();

  // Room Selection Step
  if (activeStep === 'rooms') {
    return (
      <div className="min-h-screen bg-white pb-24">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-20">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="font-bold text-xl">{hotel.name}</h1>
              <p className="text-sm text-gray-600">{hotel.location}</p>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="text-gray-600">Check-in</p>
                <p className="font-bold">{checkIn}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600">{calculateNights()} nights</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600">Check-out</p>
                <p className="font-bold">{checkOut}</p>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-green-200">
              <p className="text-sm"><span className="text-gray-600">Guests:</span> <span className="font-semibold">{guests}</span></p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <h2 className="font-bold text-lg">Select Room Type</h2>
          
          {roomTypes.map((room) => (
            <div key={room.id} className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-green-600 transition-all">
              <ImageWithFallback
                src={room.image}
                alt={room.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{room.name}</h3>
                    <p className="text-sm text-gray-600">{room.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-green-600">TZS {room.price.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">per night</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-3">
                  <div>
                    <Users className="size-4 inline mr-1" />
                    {room.maxGuests} guests
                  </div>
                  <div>{room.bedType}</div>
                  <div>{room.size}</div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {room.amenities.slice(0, 5).map((amenity, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {amenity}
                    </span>
                  ))}
                </div>

                <Button
                  onClick={() => {
                    setSelectedRoom(room);
                    setActiveStep('details');
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full font-bold"
                >
                  Select Room
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Guest Details Step
  if (activeStep === 'details') {
    return (
      <div className="min-h-screen bg-white pb-24">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveStep('rooms')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="font-bold text-xl">Guest Details</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Selected Room Summary */}
          {selectedRoom && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
              <h3 className="font-bold mb-2">{selectedRoom.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{selectedRoom.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm">TZS {selectedRoom.price.toLocaleString()} × {costs.nights} nights</span>
                <span className="font-bold text-green-700">TZS {(selectedRoom.price * costs.nights).toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Number of Rooms */}
          <div>
            <label className="block font-bold mb-2">Number of Rooms</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setRoomQuantity(Math.max(1, roomQuantity - 1))}
                className="w-12 h-12 bg-gray-100 rounded-full font-bold hover:bg-gray-200"
              >
                -
              </button>
              <span className="text-2xl font-bold flex-1 text-center">{roomQuantity}</span>
              <button
                onClick={() => setRoomQuantity(Math.min(5, roomQuantity + 1))}
                className="w-12 h-12 bg-gray-100 rounded-full font-bold hover:bg-gray-200"
              >
                +
              </button>
            </div>
          </div>

          {/* Guest Information */}
          <div>
            <label className="block font-bold mb-2">Full Name *</label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="As per ID"
              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold mb-2">Email Address *</label>
            <input
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="For booking confirmation"
              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold mb-2">Phone Number *</label>
            <input
              type="tel"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              placeholder="+255 XXX XXX XXX"
              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
            />
          </div>

          {/* Special Requests */}
          <div>
            <label className="block font-bold mb-2">Special Requests (Optional)</label>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="High floor, extra pillows, early check-in..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none resize-none"
            />
          </div>

          {/* Extras */}
          <div>
            <h3 className="font-bold mb-3">Add Extras</h3>
            {extraOptions.map((extra) => (
              <button
                key={extra.id}
                onClick={() => setExtras(prev => ({ ...prev, [extra.id]: !prev[extra.id] }))}
                className={`w-full p-4 rounded-xl border-2 mb-3 transition-all ${
                  extras[extra.id]
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="font-semibold">{extra.name}</p>
                    <p className="text-sm text-gray-600">
                      TZS {extra.price.toLocaleString()} {extra.perNight ? `per night (×${costs.nights})` : 'one-time'}
                    </p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    extras[extra.id] ? 'border-green-600 bg-green-600' : 'border-gray-300'
                  }`}>
                    {extras[extra.id] && <Check className="size-4 text-white" />}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <Button
            onClick={() => setActiveStep('payment')}
            disabled={!guestName || !guestEmail || !guestPhone}
            className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full font-bold text-lg disabled:opacity-50"
          >
            Continue to Payment
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
            <button onClick={() => setActiveStep('details')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="font-bold text-xl">Payment</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Booking Summary */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100 space-y-3">
            <h3 className="font-bold text-lg">Booking Summary</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">{selectedRoom?.name} × {roomQuantity} × {costs.nights} nights</span>
                <span className="font-semibold">TZS {costs.roomTotal.toLocaleString()}</span>
              </div>
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

          {/* Stay Details */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
            <h3 className="font-bold">Stay Details</h3>
            <div className="text-sm space-y-1">
              <p><span className="text-gray-600">Hotel:</span> <span className="font-semibold">{hotel.name}</span></p>
              <p><span className="text-gray-600">Check-in:</span> <span className="font-semibold">{checkIn} (2:00 PM)</span></p>
              <p><span className="text-gray-600">Check-out:</span> <span className="font-semibold">{checkOut} (12:00 PM)</span></p>
              <p><span className="text-gray-600">Guest:</span> <span className="font-semibold">{guestName}</span></p>
              <p><span className="text-gray-600">Rooms:</span> <span className="font-semibold">{roomQuantity} × {selectedRoom?.name}</span></p>
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
          Your hotel reservation is confirmed
        </p>

        <div className="bg-gray-50 rounded-2xl p-6 mb-6 text-left space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Booking Reference</span>
            <span className="font-bold text-green-600">{bookingReference || 'GP' + Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Hotel</span>
            <span className="font-bold text-sm text-right max-w-[60%]">{hotel.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Room</span>
            <span className="font-semibold">{roomQuantity} × {selectedRoom?.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Check-in</span>
            <span className="font-semibold">{checkIn}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Check-out</span>
            <span className="font-semibold">{checkOut}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Nights</span>
            <span className="font-semibold">{costs.nights}</span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <span className="text-sm text-gray-600">Total Paid</span>
            <span className="font-bold text-green-600">TZS {costs.total.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-sm font-semibold text-green-900 mb-1">
            🏨 Confirmation sent to {guestEmail}
          </p>
          <p className="text-xs text-green-700">
            Please present your booking reference at check-in. For any changes, contact the hotel directly.
          </p>
        </div>

        <Button
          onClick={onBookingComplete}
          className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full font-bold mb-3"
        >
          View Booking Details
        </Button>
        
        <Button
          onClick={onBack}
          className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full font-bold"
        >
          Back to Hotels
        </Button>
      </div>
    </div>
  );
}
