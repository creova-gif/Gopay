import { UnifiedBookingSystemUltimate as UnifiedBookingSystem } from './UnifiedBookingSystemUltimate';
import { useState } from 'react';
import { Button } from './ui/button';
import { User } from '../App';
import { 
  ArrowLeft, Bus, Ship, Plane, Hotel, Mountain, Calendar, Users, MapPin, 
  Clock, ChevronRight, Star, Check, CreditCard, Train, Ticket, Search,
  ArrowRight, Info, Shield, AlertCircle, Sparkles, TrendingUp, Zap, Heart,
  Wifi, Coffee, UtensilsCrossed, Waves, TreePalm
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface TravelPageRedesignedProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

type BookingService = 'flights' | 'buses' | 'sgr' | 'hotels' | 'parks';

export function TravelPageRedesigned({ user, accessToken, onBack }: TravelPageRedesignedProps) {
  const [showUnifiedBooking, setShowUnifiedBooking] = useState(false);
  const [selectedBookingService, setSelectedBookingService] = useState<BookingService | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount).replace('TSh', 'TZS');
  };

  // Quick Book Destinations
  const quickBookDestinations = [
    {
      name: 'Zanzibar Paradise',
      subtitle: 'Beach & Culture',
      image: 'https://images.unsplash.com/photo-1707296450219-2d9cc08bdef0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxaYW56aWJhciUyMGJlYWNoJTIwc3Vuc2V0fGVufDF8fHx8MTc2NzkwMTQ4OHww&ixlib=rb-4.1.0&q=80&w=1080',
      from: 25000,
      gradient: 'from-cyan-500 to-blue-600',
      popular: true
    },
    {
      name: 'Serengeti Safari',
      subtitle: 'Wildlife Adventure',
      image: 'https://images.unsplash.com/photo-1641133292545-32e441e60190?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTZXJlbmdldGklMjBzYWZhcmklMjB3aWxkbGlmZXxlbnwxfHx8fDE3Njc4NzU1NzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      from: 280000,
      gradient: 'from-amber-500 to-orange-600',
      popular: true
    },
    {
      name: 'Kilimanjaro Trek',
      subtitle: 'Mountain Expedition',
      image: 'https://images.unsplash.com/photo-1650668302197-7f556c34cb91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNb3VudCUyMEtpbGltYW5qYXJvJTIwc3Vuc2V0fGVufDF8fHx8MTc2NzkwMTUyOHww&ixlib=rb-4.1.0&q=80&w=1080',
      from: 450000,
      gradient: 'from-purple-500 to-indigo-600',
      popular: false
    },
  ];

  // Check if unified booking system should be shown
  if (showUnifiedBooking && selectedBookingService) {
    return (
      <UnifiedBookingSystem
        user={user}
        onBack={() => {
          setShowUnifiedBooking(false);
          setSelectedBookingService(null);
        }}
        initialService={selectedBookingService}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/20 pb-6">
      {/* Hero Header with Live Elements */}
      <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 px-6 pt-8 pb-36 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/20 rounded-full -ml-24 -mb-24 blur-2xl"></div>
        <div className="absolute top-20 left-1/2 w-32 h-32 bg-amber-400/20 rounded-full blur-3xl animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl hover:bg-white/30 transition-all active:scale-95"
            >
              <ArrowLeft className="size-5 text-white" />
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-1">Explore Tanzania</h1>
              <p className="text-green-100 text-sm flex items-center gap-2">
                <Sparkles className="size-4" />
                Real-time bookings • Live prices
              </p>
            </div>
            <button className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl hover:bg-white/30 transition-all">
              <Search className="size-5 text-white" />
            </button>
          </div>

          {/* Loyalty Points with Live Status */}
          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-amber-400 p-2.5 rounded-xl relative">
                  <Star className="size-5 text-amber-900" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">GO Rewards Points</p>
                  <p className="text-green-100 text-xs">Earn 5% on every booking • Redeem anytime</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{user.loyaltyPoints || 0}</p>
                <p className="text-green-100 text-xs">points</p>
              </div>
            </div>
          </div>

          {/* Live Deals Ticker */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-2xl p-3 shadow-xl relative overflow-hidden group cursor-pointer hover:scale-105 transition-transform">
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <div className="relative flex items-center gap-2">
              <Zap className="size-5 text-white flex-shrink-0 animate-bounce" />
              <div className="flex-1 overflow-hidden">
                <p className="text-white font-bold text-sm">
                  🔥 Live Deals: Zanzibar Ferry 30% OFF • Precision Air from TZS 155K • SGR 25% OFF • Hotels from TZS 80K
                </p>
              </div>
              <ChevronRight className="size-5 text-white flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Popular Destinations with Live Pricing */}
      <div className="px-6 -mt-24 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="size-5 text-red-500" />
              Top Destinations
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Live pricing • Updated now</p>
          </div>
          <button className="text-sm text-green-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            View All
            <ChevronRight className="size-4" />
          </button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 hide-scrollbar">
          {quickBookDestinations.map((dest, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (idx === 0) { setSelectedBookingService('flights'); setShowUnifiedBooking(true); }
                else if (idx === 1) { setSelectedBookingService('parks'); setShowUnifiedBooking(true); }
                else { setSelectedBookingService('hotels'); setShowUnifiedBooking(true); }
              }}
              className="flex-shrink-0 w-72 relative rounded-3xl overflow-hidden shadow-2xl group hover:scale-105 transition-all duration-500"
            >
              <div className="relative h-56">
                <ImageWithFallback
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${dest.gradient} opacity-70 group-hover:opacity-80 transition-opacity`}></div>
                
                {dest.popular && (
                  <div className="absolute top-3 left-3 bg-red-500 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-xs font-bold text-white">LIVE DEAL</span>
                  </div>
                )}
                
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold text-gray-900">Available Now</span>
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-bold text-xl mb-1">{dest.name}</h3>
                      <p className="text-white/90 text-sm flex items-center gap-1">
                        <MapPin className="size-3" />
                        {dest.subtitle}
                      </p>
                    </div>
                    <Heart className="size-6 text-white hover:fill-white transition-all cursor-pointer" />
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="text-white">
                      <p className="text-xs opacity-80 mb-0.5">Starting from</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold">{formatCurrency(dest.from)}</p>
                        {dest.popular && <span className="text-xs bg-yellow-400 text-gray-900 px-2 py-0.5 rounded-full font-bold">-30%</span>}
                      </div>
                      <p className="text-xs opacity-70 mt-0.5">Per person</p>
                    </div>
                    <div className="bg-white hover:bg-green-500 text-gray-900 hover:text-white px-4 py-2.5 rounded-xl font-bold shadow-xl transition-all group-hover:scale-110 flex items-center gap-2">
                      <span className="text-sm">Book</span>
                      <ArrowRight className="size-4" />
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Booking Options with Real Partners */}
      <div className="px-6 space-y-3">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              🚀 Book Your Journey
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Direct partners • Instant confirmation</p>
          </div>
          <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-green-700">All Systems Online</span>
          </div>
        </div>
        
        {/* Flights with Live Pricing */}
        <button
          onClick={() => {
            setSelectedBookingService('flights');
            setShowUnifiedBooking(true);
          }}
          className="w-full bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all border-2 border-blue-100 hover:border-blue-400 group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full -mr-20 -mt-20 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
          
          {/* Flash Deal Badge */}
          <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-orange-500 px-3 py-1.5 rounded-full shadow-lg">
            <p className="text-xs font-bold text-white flex items-center gap-1">
              <Zap className="size-3" />
              Save 25%
            </p>
          </div>
          
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all">
                  <Plane className="size-8 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                    Domestic Flights
                    <Shield className="size-4 text-green-600" />
                  </p>
                  <p className="text-sm text-gray-600 mb-2">Fast & convenient air travel</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-semibold">40+ Routes</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-semibold">Same Day</span>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-semibold">From TZS 155K</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="size-7 text-blue-600 group-hover:translate-x-2 transition-transform" />
            </div>
            
            {/* Partner Airlines */}
            <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 font-medium">Partners:</p>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="bg-blue-50 px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-700">Precision Air</div>
                <div className="bg-blue-50 px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-700">Air Tanzania</div>
                <div className="bg-gray-100 px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-700">+3 more</div>
              </div>
            </div>
          </div>
        </button>

        {/* Ferry - Featured with 30% OFF */}
        <button
          onClick={() => {
            setSelectedBookingService('flights');
            setShowUnifiedBooking(true);
          }}
          className="w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all group relative overflow-hidden border-2 border-cyan-300"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
          
          {/* Hot Deal Banner */}
          <div className="absolute top-3 right-3 bg-yellow-400 px-4 py-2 rounded-full shadow-2xl animate-bounce">
            <p className="text-xs font-black text-gray-900 flex items-center gap-1.5">
              <Sparkles className="size-4" />
              HOT DEAL -30%
            </p>
          </div>
          
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/25 backdrop-blur-md p-4 rounded-2xl shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all border border-white/40">
                  <Ship className="size-8 text-white" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xl font-black text-white">Ferry to Zanzibar</p>
                    <div className="flex items-center gap-0.5">
                      <Star className="size-4 fill-yellow-300 text-yellow-300" />
                      <span className="text-sm font-bold text-yellow-300">4.8</span>
                    </div>
                  </div>
                  <p className="text-sm text-cyan-100 mb-3 font-medium">Fast & scenic ocean journey • 2-4 hours</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs bg-white/30 backdrop-blur-sm text-white px-3 py-1.5 rounded-full font-bold border border-white/40">Multiple Daily</span>
                    <span className="text-xs bg-white/30 backdrop-blur-sm text-white px-3 py-1.5 rounded-full font-bold border border-white/40">
                      <span className="line-through opacity-70">{formatCurrency(35000)}</span> {formatCurrency(24500)}
                    </span>
                    <span className="text-xs bg-green-400 text-green-900 px-3 py-1.5 rounded-full font-black">12 Seats Left</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="size-7 text-white group-hover:translate-x-2 transition-transform" />
            </div>
            
            {/* Partner Info */}
            <div className="flex items-center justify-between pt-3 border-t border-white/20">
              <div className="flex items-center gap-2">
                <p className="text-xs text-white/80 font-medium">Powered by:</p>
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/30">
                  <p className="text-xs font-bold text-white">Azam Marine</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/30">
                <Check className="size-3 text-green-300" />
                <span className="text-xs font-bold text-white">Instant Confirm</span>
              </div>
            </div>
          </div>
        </button>

        {/* Buses */}
        <button
          onClick={() => {
            setSelectedBookingService('buses');
            setShowUnifiedBooking(true);
          }}
          className="w-full bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all border-2 border-green-100 hover:border-green-400 group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-100 to-green-50 rounded-full -mr-20 -mt-20 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all">
                  <Bus className="size-8 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xl font-bold text-gray-900 mb-1">Luxury Buses</p>
                  <p className="text-sm text-gray-600 mb-2">Comfortable intercity travel</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-semibold">VIP Available</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-semibold">WiFi & AC</span>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-semibold">From TZS 25K</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="size-7 text-green-600 group-hover:translate-x-2 transition-transform" />
            </div>
            
            <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 font-medium">Operators:</p>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="bg-green-50 px-2.5 py-1 rounded-lg text-xs font-semibold text-green-700">Kilimanjaro Express</div>
                <div className="bg-green-50 px-2.5 py-1 rounded-lg text-xs font-semibold text-green-700">Dar Express</div>
                <div className="bg-gray-100 px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-700">+5</div>
              </div>
            </div>
          </div>
        </button>

        {/* SGR Train */}
        <button
          onClick={() => {
            setSelectedBookingService('sgr');
            setShowUnifiedBooking(true);
          }}
          className="w-full bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all border-2 border-red-100 hover:border-red-400 group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-red-100 to-red-50 rounded-full -mr-20 -mt-20 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
          
          <div className="absolute top-4 right-4 bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-1.5 rounded-full shadow-lg border-2 border-white">
            <p className="text-xs font-bold text-white flex items-center gap-1">
              <Shield className="size-3" />
              Gov Verified
            </p>
          </div>
          
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-2xl shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all">
                  <Train className="size-8 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xl font-bold text-gray-900 mb-1">SGR Express Train</p>
                  <p className="text-sm text-gray-600 mb-2">Modern railway experience</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-full font-semibold">Dar → Morogoro</span>
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full font-semibold">Daily Service</span>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-semibold">From TZS 15K</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="size-7 text-red-600 group-hover:translate-x-2 transition-transform" />
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-500 font-medium">Official:</p>
                <div className="bg-gradient-to-r from-indigo-100 to-purple-100 px-3 py-1 rounded-lg border border-indigo-200">
                  <p className="text-xs font-bold text-indigo-700">Tanzania Railways (TRC)</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-green-700">Online</span>
              </div>
            </div>
          </div>
        </button>

        {/* Hotels */}
        <button
          onClick={() => {
            setSelectedBookingService('hotels');
            setShowUnifiedBooking(true);
          }}
          className="w-full bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all border-2 border-orange-100 hover:border-orange-400 group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full -mr-20 -mt-20 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-2xl shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all">
                  <Hotel className="size-8 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xl font-bold text-gray-900 mb-1">Hotels & Lodges</p>
                  <p className="text-sm text-gray-600 mb-2">Luxury to budget stays</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full font-semibold">500+ Properties</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-semibold">Best Price</span>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-semibold">From TZS 80K</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="size-7 text-orange-600 group-hover:translate-x-2 transition-transform" />
            </div>
            
            <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 font-medium">Powered by:</p>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="bg-blue-50 px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-700">Booking.com</div>
                <div className="bg-green-50 px-2.5 py-1 rounded-lg text-xs font-semibold text-green-700">Jumia Travel</div>
                <div className="bg-gray-100 px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-700">+Local</div>
              </div>
            </div>
          </div>
        </button>

        {/* National Parks */}
        <button
          onClick={() => {
            setSelectedBookingService('parks');
            setShowUnifiedBooking(true);
          }}
          className="w-full bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all border-2 border-emerald-100 hover:border-emerald-400 group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-full -mr-20 -mt-20 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
          
          <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 px-3 py-1.5 rounded-full shadow-lg border-2 border-white">
            <p className="text-xs font-bold text-white flex items-center gap-1">
              <Sparkles className="size-3" />
              UNESCO Sites
            </p>
          </div>
          
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-2xl shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all">
                  <Mountain className="size-8 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xl font-bold text-gray-900 mb-1">National Parks</p>
                  <p className="text-sm text-gray-600 mb-2">Safari & adventure packages</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-semibold">16 Parks</span>
                    <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-semibold">Wildlife Tours</span>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-semibold">From TZS 280K</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="size-7 text-emerald-600 group-hover:translate-x-2 transition-transform" />
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-500 font-medium">Authorized by:</p>
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-1 rounded-lg border border-green-200">
                  <p className="text-xs font-bold text-green-700">TANAPA</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-lg">
                <Shield className="size-3 text-blue-600" />
                <span className="text-xs font-bold text-blue-700">Official Permits</span>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* AI Travel Tips */}
      <div className="px-6 mt-6">
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-400/20 rounded-full -ml-16 -mb-16 blur-2xl"></div>
          <div className="relative flex items-start gap-4">
            <div className="bg-white/25 backdrop-blur-md p-3.5 rounded-2xl border border-white/40">
              <Sparkles className="size-7 text-white animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-white font-bold text-lg">AI Travel Assistant</p>
                <div className="bg-white/30 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/40">
                  <span className="text-xs font-bold text-white">NEW</span>
                </div>
              </div>
              <p className="text-purple-100 text-sm mb-4 leading-relaxed">Get personalized recommendations, compare prices, find hidden deals</p>
              <div className="flex items-center gap-3">
                <button className="bg-white text-purple-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-purple-50 transition-all shadow-xl hover:scale-105">
                  Ask AI Now
                </button>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/30">
                  <Users className="size-4 text-white" />
                  <span className="text-xs font-bold text-white">2.4K using now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="px-6 mt-6 pb-4">
        <div className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Shield className="size-4 text-green-600" />
          Why book with goPay
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-4 text-center shadow-lg border-2 border-green-100 hover:scale-105 transition-all">
            <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Shield className="size-6 text-green-600" />
            </div>
            <div className="text-xs text-gray-900 font-bold mb-1">Secure Payment</div>
            <div className="text-xs text-gray-500">SSL encrypted</div>
          </div>
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-4 text-center shadow-lg border-2 border-blue-100 hover:scale-105 transition-all">
            <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Zap className="size-6 text-blue-600" />
            </div>
            <div className="text-xs text-gray-900 font-bold mb-1">Instant Confirm</div>
            <div className="text-xs text-gray-500">Real-time booking</div>
          </div>
          <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-4 text-center shadow-lg border-2 border-purple-100 hover:scale-105 transition-all">
            <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Heart className="size-6 text-purple-600" />
            </div>
            <div className="text-xs text-gray-900 font-bold mb-1">Best Prices</div>
            <div className="text-xs text-gray-500">Price guarantee</div>
          </div>
        </div>
      </div>
    </div>
  );
}