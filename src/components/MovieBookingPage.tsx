import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { 
  ArrowLeft, Film, Check, X, Clock, MapPin, Users, Popcorn, 
  Coffee, Candy, ChevronRight, Star, Info
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { projectId } from '../utils/supabase/info';

interface Movie {
  id: string;
  title: string;
  rating: number;
  genre: string;
  duration: string;
  image: string;
}

interface Theater {
  id: string;
  name: string;
  location: string;
  city: string;
}

interface Showtime {
  id: string;
  time: string;
  date: string;
  price: number;
  format: string;
}

interface ConcessionItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'popcorn' | 'drinks' | 'snacks' | 'combos';
}

interface Props {
  movie: Movie;
  theater: Theater;
  showtime: Showtime;
  accessToken: string;
  onBack: () => void;
  onBookingComplete: () => void;
}

export function MovieBookingPage({ movie, theater, showtime, accessToken, onBack, onBookingComplete }: Props) {
  const [activeStep, setActiveStep] = useState<'seats' | 'concessions' | 'payment' | 'confirmation'>('seats');
  
  // Seat selection
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const seatLayout = {
    rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    seatsPerRow: 16
  };
  const [occupiedSeats] = useState<string[]>([
    'A5', 'A6', 'B7', 'B8', 'C4', 'C5', 'D9', 'D10', 'E6', 'E7', 
    'F8', 'F9', 'G5', 'G6', 'H7', 'H8', 'I4', 'I5'
  ]);

  // Concessions
  const [concessions, setConcessions] = useState<{[key: string]: number}>({});

  const concessionItems: ConcessionItem[] = [
    // Combos
    {
      id: 'combo1',
      name: 'Classic Movie Combo',
      description: 'Large Popcorn + 2 Large Drinks',
      price: 18000,
      image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=400',
      category: 'combos'
    },
    {
      id: 'combo2',
      name: 'Family Feast',
      description: 'XL Popcorn + 4 Drinks + Nachos',
      price: 35000,
      image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400',
      category: 'combos'
    },
    {
      id: 'combo3',
      name: 'Date Night Special',
      description: 'Med Popcorn + 2 Drinks + Chocolate',
      price: 22000,
      image: 'https://images.unsplash.com/photo-1627662056181-45ef1659e4f7?w=400',
      category: 'combos'
    },

    // Popcorn
    {
      id: 'popcorn_sm',
      name: 'Small Popcorn',
      description: 'Butter or Caramel',
      price: 5000,
      image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400',
      category: 'popcorn'
    },
    {
      id: 'popcorn_med',
      name: 'Medium Popcorn',
      description: 'Butter or Caramel',
      price: 7000,
      image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400',
      category: 'popcorn'
    },
    {
      id: 'popcorn_lg',
      name: 'Large Popcorn',
      description: 'Butter or Caramel',
      price: 10000,
      image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400',
      category: 'popcorn'
    },

    // Drinks
    {
      id: 'soda_sm',
      name: 'Small Soft Drink',
      description: 'Coke, Sprite, Fanta',
      price: 3000,
      image: 'https://images.unsplash.com/photo-1629203849126-9a13c519e34d?w=400',
      category: 'drinks'
    },
    {
      id: 'soda_lg',
      name: 'Large Soft Drink',
      description: 'Coke, Sprite, Fanta',
      price: 5000,
      image: 'https://images.unsplash.com/photo-1629203849126-9a13c519e34d?w=400',
      category: 'drinks'
    },
    {
      id: 'water',
      name: 'Bottled Water',
      description: '500ml',
      price: 2000,
      image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400',
      category: 'drinks'
    },
    {
      id: 'juice',
      name: 'Fresh Juice',
      description: 'Orange or Mango',
      price: 6000,
      image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
      category: 'drinks'
    },

    // Snacks
    {
      id: 'nachos',
      name: 'Nachos with Cheese',
      description: 'Crispy nachos with melted cheese',
      price: 8000,
      image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400',
      category: 'snacks'
    },
    {
      id: 'hotdog',
      name: 'Hot Dog',
      description: 'Classic hot dog with toppings',
      price: 7000,
      image: 'https://images.unsplash.com/photo-1612392166886-ee7c77af35c7?w=400',
      category: 'snacks'
    },
    {
      id: 'candy',
      name: 'Movie Candy',
      description: 'Assorted candy selection',
      price: 4000,
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
      category: 'snacks'
    },
    {
      id: 'chocolate',
      name: 'Chocolate Bar',
      description: 'Premium chocolate',
      price: 5000,
      image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400',
      category: 'snacks'
    }
  ];

  const [pin, setPin] = useState('');
  const [processing, setProcessing] = useState(false);
  const [bookingReference, setBookingReference] = useState('');

  const toggleSeat = (seat: string) => {
    if (occupiedSeats.includes(seat)) return;
    
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(prev => prev.filter(s => s !== seat));
    } else if (selectedSeats.length < 10) {
      setSelectedSeats(prev => [...prev, seat]);
    }
  };

  const updateConcession = (itemId: string, change: number) => {
    setConcessions(prev => {
      const current = prev[itemId] || 0;
      const newValue = Math.max(0, current + change);
      if (newValue === 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: newValue };
    });
  };

  const getSeatPrice = (seat: string) => {
    const row = seat.charAt(0);
    if (['E', 'F', 'G'].includes(row)) return showtime.price + 5000; // Premium seats
    return showtime.price;
  };

  const calculateTotal = () => {
    const ticketsTotal = selectedSeats.reduce((sum, seat) => sum + getSeatPrice(seat), 0);
    const concessionsTotal = Object.entries(concessions).reduce((sum, [itemId, qty]) => {
      const item = concessionItems.find(i => i.id === itemId);
      return sum + (item?.price || 0) * qty;
    }, 0);
    const platformFee = Math.round((ticketsTotal + concessionsTotal) * 0.15); // 15% commission
    return { ticketsTotal, concessionsTotal, platformFee, total: ticketsTotal + concessionsTotal + platformFee };
  };

  const handleBooking = async () => {
    if (!pin || pin.length !== 4) {
      toast.error('Please enter your 4-digit PIN');
      return;
    }

    setProcessing(true);
    try {
      const costs = calculateTotal();
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/movies/book`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            movieId: movie.id,
            movieTitle: movie.title,
            theaterId: theater.id,
            theaterName: theater.name,
            showtimeId: showtime.id,
            date: showtime.date,
            time: showtime.time,
            format: showtime.format,
            seats: selectedSeats,
            concessions: Object.entries(concessions).map(([itemId, qty]) => ({
              itemId,
              name: concessionItems.find(i => i.id === itemId)?.name,
              quantity: qty,
              price: concessionItems.find(i => i.id === itemId)?.price
            })),
            ticketsTotal: costs.ticketsTotal,
            concessionsTotal: costs.concessionsTotal,
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
        toast.error(data.error || 'Booking failed');
      }
    } catch (error) {
      console.error('Error booking movie:', error);
      toast.error('Booking failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const costs = calculateTotal();

  // Seat Selection Step
  if (activeStep === 'seats') {
    return (
      <div className="min-h-screen bg-gray-900 text-white pb-24">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 z-20">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="font-bold text-xl">{movie.title}</h1>
              <p className="text-sm text-gray-400">{theater.name} • {showtime.time}</p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 bg-gray-700 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 bg-green-600 rounded"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 bg-gray-500 rounded"></div>
              <span>Occupied</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 bg-purple-600 rounded"></div>
              <span>Premium</span>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Screen */}
          <div>
            <div className="w-full h-2 bg-gradient-to-b from-gray-600 to-transparent rounded-t-3xl mb-2"></div>
            <p className="text-center text-xs text-gray-500 font-semibold">SCREEN</p>
          </div>

          {/* Seat Map */}
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {seatLayout.rows.map((row) => (
                <div key={row} className="flex items-center justify-center gap-1 mb-2">
                  <div className="w-8 text-center text-sm font-bold text-gray-500">{row}</div>
                  {Array.from({ length: seatLayout.seatsPerRow }, (_, idx) => {
                    const seatNum = idx + 1;
                    const seatId = `${row}${seatNum}`;
                    const isOccupied = occupiedSeats.includes(seatId);
                    const isSelected = selectedSeats.includes(seatId);
                    const isPremium = ['E', 'F', 'G'].includes(row);
                    
                    // Add aisle space
                    if (seatNum === 5 || seatNum === 13) {
                      return (
                        <div key={`${seatId}-space`} className="flex items-center gap-1">
                          <button
                            onClick={() => toggleSeat(seatId)}
                            disabled={isOccupied}
                            className={`w-7 h-7 rounded text-xs font-bold transition-all ${
                              isOccupied
                                ? 'bg-gray-500 cursor-not-allowed'
                                : isSelected
                                ? 'bg-green-600 hover:bg-green-700'
                                : isPremium
                                ? 'bg-purple-600 hover:bg-purple-700'
                                : 'bg-gray-700 hover:bg-gray-600'
                            }`}
                          >
                            {seatNum}
                          </button>
                          <div className="w-3"></div>
                        </div>
                      );
                    }

                    return (
                      <button
                        key={seatId}
                        onClick={() => toggleSeat(seatId)}
                        disabled={isOccupied}
                        className={`w-7 h-7 rounded text-xs font-bold transition-all ${
                          isOccupied
                            ? 'bg-gray-500 cursor-not-allowed'
                            : isSelected
                            ? 'bg-green-600 hover:bg-green-700'
                            : isPremium
                            ? 'bg-purple-600 hover:bg-purple-700'
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        {seatNum}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Premium Pricing Info */}
          <div className="bg-purple-900/50 border border-purple-700 rounded-xl p-4">
            <h3 className="font-bold mb-2">Premium Seats (Rows E, F, G)</h3>
            <p className="text-sm text-gray-300">
              Extra legroom & center position • +TZS 5,000 per ticket
            </p>
          </div>

          {/* Selected Seats */}
          {selectedSeats.length > 0 && (
            <div className="bg-green-900/50 border border-green-700 rounded-xl p-4">
              <h3 className="font-bold mb-2">Selected Seats ({selectedSeats.length})</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedSeats.map(seat => (
                  <div key={seat} className="bg-green-600 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    {seat}
                    <button onClick={() => toggleSeat(seat)} className="ml-1">
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
              <p className="font-bold text-lg">
                Subtotal: TZS {costs.ticketsTotal.toLocaleString()}
              </p>
            </div>
          )}

          <Button
            onClick={() => setActiveStep('concessions')}
            disabled={selectedSeats.length === 0}
            className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full font-bold text-lg disabled:opacity-50"
          >
            {selectedSeats.length > 0 
              ? `Continue with ${selectedSeats.length} ticket(s)` 
              : 'Select seats to continue'}
          </Button>
        </div>
      </div>
    );
  }

  // Concessions Step
  if (activeStep === 'concessions') {
    const categories = [
      { id: 'combos', label: 'Combos', icon: Popcorn },
      { id: 'popcorn', label: 'Popcorn', icon: Popcorn },
      { id: 'drinks', label: 'Drinks', icon: Coffee },
      { id: 'snacks', label: 'Snacks', icon: Candy }
    ];
    const [selectedCategory, setSelectedCategory] = useState('combos');

    const filteredItems = concessionItems.filter(item => item.category === selectedCategory);

    return (
      <div className="min-h-screen bg-white pb-24">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-20">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => setActiveStep('seats')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="font-bold text-xl">Concessions</h1>
              <p className="text-sm text-gray-600">Add snacks & drinks (optional)</p>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
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

        <div className="p-4 space-y-4">
          {filteredItems.map((item) => {
            const quantity = concessions[item.id] || 0;
            return (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="flex gap-3 p-3">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <p className="font-bold text-green-600">TZS {item.price.toLocaleString()}</p>
                  </div>
                </div>
                
                {quantity > 0 ? (
                  <div className="flex items-center justify-between bg-green-50 p-3 border-t border-green-200">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateConcession(item.id, -1)}
                        className="w-8 h-8 bg-white border-2 border-green-600 text-green-600 rounded-full font-bold hover:bg-green-50"
                      >
                        -
                      </button>
                      <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                      <button
                        onClick={() => updateConcession(item.id, 1)}
                        className="w-8 h-8 bg-green-600 text-white rounded-full font-bold hover:bg-green-700"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-bold text-green-600">
                      TZS {(item.price * quantity).toLocaleString()}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => updateConcession(item.id, 1)}
                    className="w-full bg-gray-50 hover:bg-gray-100 p-3 border-t border-gray-200 font-semibold text-green-600 flex items-center justify-center gap-2"
                  >
                    <ChevronRight className="size-5" />
                    Add to Order
                  </button>
                )}
              </div>
            );
          })}

          {costs.concessionsTotal > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="font-bold text-green-900">
                Concessions Total: TZS {costs.concessionsTotal.toLocaleString()}
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
            Skip Concessions
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
            <button onClick={() => setActiveStep('concessions')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="font-bold text-xl">Payment</h1>
              <p className="text-sm text-gray-600">Confirm your booking</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Movie Summary */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
            <div className="flex gap-3 mb-4">
              <ImageWithFallback
                src={movie.image}
                alt={movie.title}
                className="w-20 h-28 object-cover rounded-xl"
              />
              <div>
                <h3 className="font-bold text-lg mb-1">{movie.title}</h3>
                <p className="text-sm text-gray-600 mb-1">{theater.name}</p>
                <p className="text-sm text-gray-600">{showtime.date} • {showtime.time}</p>
                <p className="text-sm font-semibold text-green-700 mt-1">{showtime.format}</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">Tickets ({selectedSeats.length})</span>
                <span className="font-semibold">TZS {costs.ticketsTotal.toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-600">Seats: {selectedSeats.join(', ')}</p>
              
              {costs.concessionsTotal > 0 && (
                <div className="flex justify-between pt-2 border-t border-green-200">
                  <span className="text-gray-700">Concessions</span>
                  <span className="font-semibold">TZS {costs.concessionsTotal.toLocaleString()}</span>
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

          {/* Concessions Summary */}
          {Object.keys(concessions).length > 0 && (
            <div className="bg-gray-50 rounded-2xl p-4">
              <h3 className="font-bold mb-3">Your Concessions</h3>
              <div className="space-y-2 text-sm">
                {Object.entries(concessions).map(([itemId, qty]) => {
                  const item = concessionItems.find(i => i.id === itemId);
                  if (!item) return null;
                  return (
                    <div key={itemId} className="flex justify-between">
                      <span className="text-gray-700">{item.name} × {qty}</span>
                      <span className="font-semibold">TZS {(item.price * qty).toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PIN Entry */}
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
          Enjoy your movie experience
        </p>

        <div className="bg-gray-50 rounded-2xl p-6 mb-6 text-left space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Booking Reference</span>
            <span className="font-bold text-green-600">{bookingReference || 'GP' + Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Movie</span>
            <span className="font-bold">{movie.title}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Theater</span>
            <span className="font-semibold text-sm text-right max-w-[60%]">{theater.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Date & Time</span>
            <span className="font-semibold">{showtime.date} {showtime.time}</span>
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
            🎬 E-Tickets sent via SMS & Email
          </p>
          <p className="text-xs text-green-700">
            Show your QR code at the theater entrance. Arrive 15 minutes early to collect concessions.
          </p>
        </div>

        <Button
          onClick={onBookingComplete}
          className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full font-bold mb-3"
        >
          View E-Tickets
        </Button>
        
        <Button
          onClick={onBack}
          className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full font-bold"
        >
          Back to Movies
        </Button>
      </div>
    </div>
  );
}
