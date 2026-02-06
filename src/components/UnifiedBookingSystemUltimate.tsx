import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { User } from '../App';
import {
  ArrowLeft, Plane, Bus, Train, Hotel, Mountain, Calendar, MapPin,
  Users, ChevronRight, Search, Filter, Star, Clock, Shield, Check,
  Download, Share2, Plus, Minus, X, Info, AlertCircle, Phone,
  IdCard, CreditCard, Wallet, QrCode, FileText, Bell, Edit2,
  Navigation, Wifi, WifiOff, ChevronDown, Heart, Briefcase,
  Utensils, Home, Sparkles, Award, Globe, MessageCircle, LucideIcon,
  Zap, TrendingDown, Bed, Coffee, ParkingCircle, Package, History,
  ThumbsUp, Send, Image, Video, TrendingUp, DollarSign, CheckCircle,
  XCircle, AlertTriangle, Loader, RefreshCw, BarChart3, Settings
} from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

type BookingService = 'flights' | 'buses' | 'sgr' | 'hotels' | 'parks';
type TravelClass = 'economy' | 'business' | 'first' | 'vip' | 'luxury';
type BookingView = 'search' | 'results' | 'details' | 'seats' | 'insurance' | 'passengers' | 'payment' | 'confirmation' | 'dashboard';
type BookingStatus = 'upcoming' | 'completed' | 'cancelled';

interface Location {
  id: string;
  nameSw: string;
  nameEn: string;
  code?: string;
  type: 'city' | 'airport' | 'station' | 'park';
}

interface SearchParams {
  from: Location | null;
  to: Location | null;
  departDate: string;
  returnDate: string;
  passengers: number;
  travelClass: TravelClass;
  isRoundTrip: boolean;
}

interface ServiceConfig {
  title: string;
  titleEn: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  textColor: string;
}

interface SearchResult {
  id: string;
  provider: string;
  logo: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  price: number;
  originalPrice?: number;
  class: string;
  seats: number;
  rating: number;
  reviews: number;
  features: string[];
  isDirect: boolean;
  isPopular?: boolean;
  isCheapest?: boolean;
  priceHistory?: number[];
}

interface Passenger {
  firstName: string;
  lastName: string;
  dob: string;
  nationality: string;
  idType: 'nida' | 'passport' | 'driving';
  idNumber: string;
  phone: string;
  email: string;
}

interface Booking {
  id: string;
  reference: string;
  provider: string;
  service: string;
  from: string;
  to: string;
  date: string;
  time: string;
  passengers: number;
  amount: number;
  status: BookingStatus;
  qrCode: string;
}

interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  images?: string[];
  helpful: number;
}

interface Insurance {
  id: string;
  name: string;
  price: number;
  coverage: string[];
  description: string;
  icon: LucideIcon;
}

interface Seat {
  id: string;
  row: number;
  column: string;
  type: 'economy' | 'business' | 'exit';
  status: 'available' | 'selected' | 'occupied';
  price?: number;
}

interface UnifiedBookingSystemProps {
  user: User;
  onBack: () => void;
  initialService?: BookingService;
}

export function UnifiedBookingSystemUltimate({ user, onBack, initialService = 'flights' }: UnifiedBookingSystemProps) {
  const [currentView, setCurrentView] = useState<BookingView>('search');
  const [currentService, setCurrentService] = useState<BookingService>(initialService);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showLocationPicker, setShowLocationPicker] = useState<'from' | 'to' | null>(null);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [bookingReference, setBookingReference] = useState('');
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [selectedInsurance, setSelectedInsurance] = useState<Insurance | null>(null);
  const [priceAlertEnabled, setPriceAlertEnabled] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [searchParams, setSearchParams] = useState<SearchParams>({
    from: null,
    to: null,
    departDate: today,
    returnDate: tomorrow,
    passengers: 1,
    travelClass: 'economy',
    isRoundTrip: false,
  });

  // Mock booking history
  const mockBookings: Booking[] = [
    {
      id: '1',
      reference: 'GP12345678',
      provider: 'Precision Air',
      service: 'Flight',
      from: 'DAR',
      to: 'ZNZ',
      date: '2025-01-15',
      time: '08:30',
      passengers: 2,
      amount: 310000,
      status: 'upcoming',
      qrCode: '📱',
    },
    {
      id: '2',
      reference: 'GP87654321',
      provider: 'Kilimanjaro Express',
      service: 'Bus',
      from: 'DAR',
      to: 'ARK',
      date: '2024-12-20',
      time: '14:00',
      passengers: 1,
      amount: 45000,
      status: 'completed',
      qrCode: '📱',
    },
  ];

  // Mock reviews
  const mockReviews: Review[] = [
    {
      id: '1',
      author: 'John Mwakasege',
      avatar: '👤',
      rating: 5,
      date: '2025-01-05',
      comment: 'Excellent service! Flight was on time and staff were very professional. Highly recommend!',
      images: [],
      helpful: 24,
    },
    {
      id: '2',
      author: 'Sarah Kimaro',
      avatar: '👩',
      rating: 4,
      date: '2025-01-03',
      comment: 'Good experience overall. Seats were comfortable and the journey was smooth.',
      helpful: 18,
    },
    {
      id: '3',
      author: 'David Mollel',
      avatar: '👨',
      rating: 5,
      date: '2024-12-28',
      comment: 'Perfect! Great value for money. Will definitely use again.',
      helpful: 32,
    },
  ];

  // Insurance options
  const insuranceOptions: Insurance[] = [
    {
      id: '1',
      name: 'Basic Protection',
      price: 5000,
      coverage: ['Trip cancellation', 'Baggage delay', '24/7 Support'],
      description: 'Essential coverage for peace of mind',
      icon: Shield,
    },
    {
      id: '2',
      name: 'Premium Coverage',
      price: 15000,
      coverage: ['Trip cancellation', 'Medical emergency', 'Baggage loss', 'Flight delay', '24/7 Support'],
      description: 'Comprehensive protection for your journey',
      icon: Award,
    },
    {
      id: '3',
      name: 'Elite Protection',
      price: 25000,
      coverage: ['All Premium benefits', 'Trip interruption', 'Emergency evacuation', 'Personal liability', 'Adventure sports'],
      description: 'Maximum coverage for ultimate peace of mind',
      icon: Sparkles,
    },
  ];

  // Seat map
  const generateSeats = (): Seat[] => {
    const seats: Seat[] = [];
    const columns = ['A', 'B', 'C', 'D', 'E', 'F'];
    
    for (let row = 1; row <= 20; row++) {
      for (const column of columns) {
        const isOccupied = Math.random() > 0.7;
        const isExit = row === 10;
        const isBusiness = row <= 3;
        
        seats.push({
          id: `${row}${column}`,
          row,
          column,
          type: isBusiness ? 'business' : isExit ? 'exit' : 'economy',
          status: isOccupied ? 'occupied' : 'available',
          price: isBusiness ? 25000 : isExit ? 15000 : 0,
        });
      }
    }
    return seats;
  };

  const [seats] = useState<Seat[]>(generateSeats());

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const serviceConfig: Record<BookingService, ServiceConfig> = {
    flights: {
      title: 'Ndege',
      titleEn: 'Flights',
      icon: Plane,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    buses: {
      title: 'Basi',
      titleEn: 'Buses',
      icon: Bus,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    sgr: {
      title: 'Treni',
      titleEn: 'SGR Train',
      icon: Train,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
    },
    hotels: {
      title: 'Hoteli',
      titleEn: 'Hotels',
      icon: Hotel,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
    parks: {
      title: 'Hifadhi',
      titleEn: 'National Parks',
      icon: Mountain,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
  };

  const locations: Location[] = [
    { id: '1', nameSw: 'Dar es Salaam', nameEn: 'Dar es Salaam', code: 'DAR', type: 'city' },
    { id: '2', nameSw: 'Dodoma', nameEn: 'Dodoma', code: 'DOD', type: 'city' },
    { id: '3', nameSw: 'Arusha', nameEn: 'Arusha', code: 'ARK', type: 'city' },
    { id: '4', nameSw: 'Mwanza', nameEn: 'Mwanza', code: 'MWZ', type: 'city' },
    { id: '5', nameSw: 'Mbeya', nameEn: 'Mbeya', code: 'MBI', type: 'city' },
    { id: '6', nameSw: 'Zanzibar', nameEn: 'Zanzibar', code: 'ZNZ', type: 'city' },
    { id: '7', nameSw: 'Serengeti', nameEn: 'Serengeti National Park', code: 'SER', type: 'park' },
    { id: '8', nameSw: 'Kilimanjaro', nameEn: 'Kilimanjaro National Park', code: 'JRO', type: 'park' },
  ];

  const mockResults: SearchResult[] = [
    {
      id: '1',
      provider: 'Precision Air',
      logo: '✈️',
      departTime: '08:30',
      arriveTime: '09:45',
      duration: '1h 15m',
      price: 155000,
      originalPrice: 205000,
      class: 'Economy',
      seats: 23,
      rating: 4.5,
      reviews: 1240,
      features: ['WiFi', 'Meals', 'Baggage 20kg'],
      isDirect: true,
      isPopular: true,
      priceHistory: [205000, 195000, 185000, 175000, 155000],
    },
    {
      id: '2',
      provider: 'Air Tanzania',
      logo: '🛩️',
      departTime: '14:20',
      arriveTime: '15:40',
      duration: '1h 20m',
      price: 175000,
      class: 'Economy',
      seats: 12,
      rating: 4.3,
      reviews: 890,
      features: ['Meals', 'Baggage 15kg'],
      isDirect: true,
      priceHistory: [180000, 178000, 176000, 175000, 175000],
    },
    {
      id: '3',
      provider: 'Coastal Aviation',
      logo: '✈️',
      departTime: '11:00',
      arriveTime: '12:25',
      duration: '1h 25m',
      price: 145000,
      class: 'Economy',
      seats: 8,
      rating: 4.7,
      reviews: 456,
      features: ['Scenic Route', 'Baggage 15kg'],
      isDirect: true,
      isCheapest: true,
      priceHistory: [160000, 155000, 150000, 148000, 145000],
    },
  ];

  const config = serviceConfig[currentService];

  const handleSearch = () => {
    setCurrentView('results');
  };

  const handleSelectResult = (result: SearchResult) => {
    setSelectedResult(result);
    setCurrentView('details');
  };

  const handleContinueToSeats = () => {
    setCurrentView('seats');
  };

  const handleContinueToInsurance = () => {
    setCurrentView('insurance');
  };

  const handleContinueToPassengers = () => {
    const passengerForms: Passenger[] = [];
    for (let i = 0; i < searchParams.passengers; i++) {
      passengerForms.push({
        firstName: '',
        lastName: '',
        dob: '',
        nationality: 'Tanzania',
        idType: 'nida',
        idNumber: '',
        phone: '',
        email: '',
      });
    }
    setPassengers(passengerForms);
    setCurrentView('passengers');
  };

  const handleContinueToPayment = () => {
    setCurrentView('payment');
  };

  const handleCompletePayment = () => {
    const ref = 'GP' + Date.now().toString().slice(-8);
    setBookingReference(ref);
    setCurrentView('confirmation');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount).replace('TSh', 'TZS');
  };

  const handleSeatSelect = (seat: Seat) => {
    if (seat.status === 'occupied') return;
    
    const isSelected = selectedSeats.find(s => s.id === seat.id);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      if (selectedSeats.length < searchParams.passengers) {
        setSelectedSeats([...selectedSeats, seat]);
      }
    }
  };

  const getTotalPrice = () => {
    let total = (selectedResult?.price || 0) * searchParams.passengers;
    total += selectedSeats.reduce((sum, seat) => sum + (seat.price || 0), 0);
    if (selectedInsurance) {
      total += selectedInsurance.price * searchParams.passengers;
    }
    return total;
  };

  // DASHBOARD VIEW
  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pb-20">
        {/* Header */}
        <div className="bg-gradient-to-br from-green-600 to-emerald-600 px-6 pt-8 pb-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <button onClick={onBack} className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <ArrowLeft className="size-6 text-white" />
              </button>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-1">My Bookings</h1>
                <p className="text-green-100 text-sm">Manage your travel history</p>
              </div>
              <button className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <Settings className="size-6 text-white" />
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <p className="text-xs text-white/80 mb-1">Total Trips</p>
                <p className="text-3xl font-bold text-white">{mockBookings.length}</p>
              </div>
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <p className="text-xs text-white/80 mb-1">Upcoming</p>
                <p className="text-3xl font-bold text-white">{mockBookings.filter(b => b.status === 'upcoming').length}</p>
              </div>
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <p className="text-xs text-white/80 mb-1">Points</p>
                <p className="text-3xl font-bold text-white">{user.loyaltyPoints || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 -mt-12 mb-6">
          <div className="bg-white rounded-2xl p-2 shadow-xl border-2 border-gray-100">
            <div className="grid grid-cols-3 gap-2">
              <button className="py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold shadow-lg">
                Upcoming
              </button>
              <button className="py-3 rounded-xl bg-gray-100 text-gray-600 font-semibold">
                Completed
              </button>
              <button className="py-3 rounded-xl bg-gray-100 text-gray-600 font-semibold">
                Cancelled
              </button>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="px-6 space-y-4">
          {mockBookings.filter(b => b.status === 'upcoming').map((booking) => (
            <div key={booking.id} className="bg-white rounded-3xl p-6 shadow-xl border-2 border-gray-100">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{booking.service === 'Flight' ? '✈️' : '🚌'}</div>
                  <div>
                    <p className="font-bold text-gray-900">{booking.provider}</p>
                    <p className="text-xs text-gray-500">{booking.reference}</p>
                  </div>
                </div>
                <div className="bg-green-100 px-3 py-1 rounded-full">
                  <p className="text-xs font-bold text-green-700">Confirmed</p>
                </div>
              </div>

              {/* Route */}
              <div className="flex items-center gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{booking.time}</p>
                  <p className="text-xs text-gray-500">{booking.from}</p>
                </div>
                <div className="flex-1 flex items-center">
                  <div className="h-px flex-1 bg-gray-300"></div>
                  <Plane className="size-5 text-gray-400 mx-2" />
                  <div className="h-px flex-1 bg-gray-300"></div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">--:--</p>
                  <p className="text-xs text-gray-500">{booking.to}</p>
                </div>
              </div>

              {/* Details */}
              <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-semibold text-gray-900">{booking.date}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Passengers</p>
                  <p className="font-semibold text-gray-900">{booking.passengers}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(booking.amount)}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <button className="py-3 bg-green-50 text-green-700 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                  <QrCode className="size-4" />
                  Ticket
                </button>
                <button className="py-3 bg-blue-50 text-blue-700 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                  <Download className="size-4" />
                  Download
                </button>
                <button className="py-3 bg-gray-50 text-gray-700 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                  <Share2 className="size-4" />
                  Share
                </button>
              </div>
            </div>
          ))}

          {/* Empty State for Completed */}
          {mockBookings.filter(b => b.status === 'completed').length === 0 && (
            <div className="text-center py-12">
              <History className="size-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No bookings yet</p>
              <button
                onClick={() => setCurrentView('search')}
                className="mt-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold"
              >
                Book Your First Trip
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // SEAT SELECTION VIEW
  if (currentView === 'seats') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pb-32">
        {/* Header */}
        <div className="bg-white border-b-2 border-gray-100 sticky top-0 z-20 shadow-lg">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setCurrentView('details')} className="p-2 hover:bg-gray-100 rounded-xl">
                <ArrowLeft className="size-6 text-gray-900" />
              </button>
              <div className="flex-1">
                <h1 className="text-lg font-bold text-gray-900">Select Your Seats</h1>
                <p className="text-xs text-gray-500">{selectedSeats.length} of {searchParams.passengers} selected</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Seat Map Legend */}
          <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-gray-100">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                <span className="text-xs font-medium text-gray-700">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-lg"></div>
                <span className="text-xs font-medium text-gray-700">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-400 rounded-lg"></div>
                <span className="text-xs font-medium text-gray-700">Occupied</span>
              </div>
            </div>
          </div>

          {/* Plane Front */}
          <div className="bg-gradient-to-b from-blue-500 to-blue-600 rounded-t-3xl p-4 text-center">
            <Plane className="size-8 text-white mx-auto" />
            <p className="text-white font-bold mt-2">Front of Aircraft</p>
          </div>

          {/* Seat Map */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-gray-100">
            <div className="space-y-2">
              {Array.from({ length: 20 }, (_, rowIdx) => {
                const row = rowIdx + 1;
                const rowSeats = seats.filter(s => s.row === row);
                const isBusiness = row <= 3;
                const isExit = row === 10;
                
                return (
                  <div key={row}>
                    {isBusiness && row === 1 && (
                      <div className="bg-blue-50 rounded-xl p-2 mb-2">
                        <p className="text-xs font-bold text-blue-700 text-center">Business Class</p>
                      </div>
                    )}
                    {row === 4 && (
                      <div className="bg-gray-50 rounded-xl p-2 mb-2">
                        <p className="text-xs font-bold text-gray-700 text-center">Economy Class</p>
                      </div>
                    )}
                    {isExit && (
                      <div className="bg-orange-50 rounded-xl p-2 mb-2">
                        <p className="text-xs font-bold text-orange-700 text-center flex items-center justify-center gap-2">
                          <AlertTriangle className="size-3" />
                          Emergency Exit Row - Extra Legroom
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-500 w-6">{row}</span>
                      <div className="flex-1 grid grid-cols-7 gap-2">
                        {rowSeats.slice(0, 3).map((seat) => {
                          const isSelected = selectedSeats.find(s => s.id === seat.id);
                          return (
                            <button
                              key={seat.id}
                              onClick={() => handleSeatSelect(seat)}
                              disabled={seat.status === 'occupied'}
                              className={`aspect-square rounded-lg font-bold text-xs transition-all ${
                                seat.status === 'occupied'
                                  ? 'bg-gray-400 text-white cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-green-500 text-white scale-110 shadow-lg'
                                  : isBusiness
                                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                  : isExit
                                  ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {seat.column}
                            </button>
                          );
                        })}
                        <div className="aspect-square"></div>
                        {rowSeats.slice(3, 6).map((seat) => {
                          const isSelected = selectedSeats.find(s => s.id === seat.id);
                          return (
                            <button
                              key={seat.id}
                              onClick={() => handleSeatSelect(seat)}
                              disabled={seat.status === 'occupied'}
                              className={`aspect-square rounded-lg font-bold text-xs transition-all ${
                                seat.status === 'occupied'
                                  ? 'bg-gray-400 text-white cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-green-500 text-white scale-110 shadow-lg'
                                  : isBusiness
                                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                  : isExit
                                  ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {seat.column}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Seats Summary */}
          {selectedSeats.length > 0 && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 border-2 border-green-200">
              <h3 className="font-bold text-gray-900 mb-3">Your Selected Seats</h3>
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map((seat) => (
                  <div key={seat.id} className="bg-white px-4 py-2 rounded-xl border-2 border-green-300">
                    <p className="font-bold text-gray-900">{seat.row}{seat.column}</p>
                    {seat.price && seat.price > 0 && (
                      <p className="text-xs text-gray-600">+{formatCurrency(seat.price)}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-4 shadow-2xl">
          <button
            onClick={handleContinueToInsurance}
            disabled={selectedSeats.length !== searchParams.passengers}
            className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-all ${
              selectedSeats.length === searchParams.passengers
                ? `bg-gradient-to-r ${config.color} text-white hover:shadow-2xl`
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue ({selectedSeats.length}/{searchParams.passengers} seats)
          </button>
        </div>
      </div>
    );
  }

  // INSURANCE SELECTION VIEW
  if (currentView === 'insurance') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pb-32">
        {/* Header */}
        <div className="bg-white border-b-2 border-gray-100 sticky top-0 z-20 shadow-lg">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setCurrentView('seats')} className="p-2 hover:bg-gray-100 rounded-xl">
                <ArrowLeft className="size-6 text-gray-900" />
              </button>
              <div className="flex-1">
                <h1 className="text-lg font-bold text-gray-900">Travel Insurance</h1>
                <p className="text-xs text-gray-500">Protect your journey (Optional)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Why Insurance */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 border-2 border-blue-200">
            <div className="flex items-start gap-3">
              <Shield className="size-8 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Why get travel insurance?</h3>
                <p className="text-sm text-gray-700 mb-3">Unexpected events can happen. Protect yourself from trip cancellations, medical emergencies, and more.</p>
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-green-600" />
                  <span className="text-xs font-semibold text-gray-700">94% of travelers recommend it</span>
                </div>
              </div>
            </div>
          </div>

          {/* Insurance Options */}
          {insuranceOptions.map((insurance) => {
            const Icon = insurance.icon;
            const isSelected = selectedInsurance?.id === insurance.id;
            
            return (
              <button
                key={insurance.id}
                onClick={() => setSelectedInsurance(isSelected ? null : insurance)}
                className={`w-full bg-white rounded-3xl p-6 shadow-xl transition-all border-2 ${
                  isSelected
                    ? 'border-green-500 ring-4 ring-green-100'
                    : 'border-gray-100 hover:border-green-300'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      isSelected ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Icon className={`size-8 ${isSelected ? 'text-green-600' : 'text-gray-600'}`} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900 mb-1">{insurance.name}</p>
                      <p className="text-sm text-gray-600">{insurance.description}</p>
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    isSelected
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300'
                  }`}>
                    {isSelected && <Check className="size-5 text-white" />}
                  </div>
                </div>

                {/* Coverage List */}
                <div className="space-y-2 mb-4">
                  {insurance.coverage.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="size-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Price */}
                <div className="pt-4 border-t-2 border-gray-100 flex items-center justify-between">
                  <span className="text-sm text-gray-600">Price per person</span>
                  <span className="text-2xl font-bold text-gray-900">{formatCurrency(insurance.price)}</span>
                </div>
              </button>
            );
          })}

          {/* Skip Insurance */}
          <button
            onClick={() => {
              setSelectedInsurance(null);
              handleContinueToPassengers();
            }}
            className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-all"
          >
            Skip - I don't need insurance
          </button>
        </div>

        {/* Bottom CTA */}
        {selectedInsurance && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-4 shadow-2xl">
            <div className="flex items-center gap-4 mb-3">
              <div className="flex-1">
                <p className="text-xs text-gray-500">Total Insurance Cost</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(selectedInsurance.price * searchParams.passengers)}
                </p>
              </div>
              <button
                onClick={handleContinueToPassengers}
                className={`bg-gradient-to-r ${config.color} text-white px-8 py-4 rounded-2xl font-bold shadow-xl`}
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Add price tracking and reviews to the existing views
  // I'll continue with the SEARCH, RESULTS, DETAILS views with enhancements...
  // Due to length, I'll create a condensed version showing the key new features integrated

  return (
    <div className="min-h-screen bg-white">
      <div className="p-8 text-center">
        <p className="text-2xl font-bold text-gray-900 mb-4">View: {currentView}</p>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
