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
  Zap, TrendingDown, Bed, Coffee, ParkingCircle, Package
} from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

type BookingService = 'flights' | 'buses' | 'sgr' | 'hotels' | 'parks';
type TravelClass = 'economy' | 'business' | 'first' | 'vip' | 'luxury';
type BookingView = 'search' | 'results' | 'details' | 'passengers' | 'payment' | 'confirmation' | 'dashboard';

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

interface UnifiedBookingSystemProps {
  user: User;
  onBack: () => void;
  initialService?: BookingService;
}

export function UnifiedBookingSystemComplete({ user, onBack, initialService = 'flights' }: UnifiedBookingSystemProps) {
  const [currentView, setCurrentView] = useState<BookingView>('search');
  const [currentService, setCurrentService] = useState<BookingService>(initialService);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showLocationPicker, setShowLocationPicker] = useState<'from' | 'to' | null>(null);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [bookingReference, setBookingReference] = useState('');

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

  // Mock search results
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

  const handleContinueToPassengers = () => {
    // Initialize passenger forms based on search params
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
    // Generate booking reference
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

  // SEARCH VIEW
  if (currentView === 'search') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pb-20">
        {/* Header */}
        <div className="bg-gradient-to-br from-white to-gray-50 border-b-2 border-gray-100 sticky top-0 z-20 shadow-lg">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={onBack} className="p-2.5 hover:bg-gray-100 rounded-xl transition-all active:scale-95 shadow-sm">
                <ArrowLeft className="size-6 text-gray-900" />
              </button>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  {config.title}
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </h1>
                <p className="text-sm text-gray-500">{config.titleEn} • Live booking</p>
              </div>
              <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-all relative">
                <MessageCircle className="size-6 text-gray-600" />
                <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
              </button>
            </div>

            {/* Service Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
              {(Object.keys(serviceConfig) as BookingService[]).map((service) => {
                const ServiceIcon = serviceConfig[service].icon;
                const isActive = currentService === service;
                return (
                  <button
                    key={service}
                    onClick={() => setCurrentService(service)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? `bg-gradient-to-r ${serviceConfig[service].color} text-white shadow-xl scale-105`
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
                    }`}
                  >
                    <ServiceIcon className="size-5" />
                    <span className="text-sm">{serviceConfig[service].title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {isOffline && (
          <div className="mx-4 mt-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 rounded-2xl flex items-start gap-3 shadow-lg">
            <WifiOff className="size-6 text-orange-600 mt-0.5 flex-shrink-0 animate-pulse" />
            <div className="flex-1">
              <p className="font-bold text-orange-900 mb-1">Unafanya kazi nje ya mtandao</p>
              <p className="text-sm text-orange-700">Taarifa zitahifadhiwa na kutumwa ukiwasiliana na mtandao</p>
            </div>
          </div>
        )}

        <div className="p-4 space-y-4">
          {/* Special Offer Banner */}
          <div className={`bg-gradient-to-r ${config.color} rounded-3xl p-5 shadow-2xl relative overflow-hidden group cursor-pointer hover:scale-105 transition-transform`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl border border-white/30">
                  <Sparkles className="size-6 text-white animate-pulse" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm mb-1">Special Offer Active!</p>
                  <p className="text-white/90 text-xs">Book today and save up to 30%</p>
                </div>
              </div>
              <ChevronRight className="size-6 text-white" />
            </div>
          </div>

          {/* Quick Booking Shortcuts */}
          <div className="bg-white rounded-2xl p-5 shadow-xl border-2 border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Clock className="size-4 text-green-600" />
                Popular Routes
              </h3>
              <button className="text-xs text-green-600 font-semibold">View All</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => {
                  setSearchParams({
                    ...searchParams,
                    from: locations[0],
                    to: locations[5],
                  });
                }}
                className="p-3 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl hover:shadow-lg transition-all border-2 border-cyan-100 hover:border-cyan-300"
              >
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="size-4 text-cyan-600" />
                  <p className="text-xs font-bold text-gray-900">DAR → ZNZ</p>
                </div>
                <p className="text-xs text-gray-600 mb-1">From TZS 155K</p>
                <div className="flex items-center gap-1">
                  <Star className="size-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-semibold text-gray-700">Popular</span>
                </div>
              </button>
              
              <button 
                onClick={() => {
                  setSearchParams({
                    ...searchParams,
                    from: locations[0],
                    to: locations[2],
                  });
                }}
                className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl hover:shadow-lg transition-all border-2 border-green-100 hover:border-green-300"
              >
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="size-4 text-green-600" />
                  <p className="text-xs font-bold text-gray-900">DAR → ARK</p>
                </div>
                <p className="text-xs text-gray-600 mb-1">From TZS 185K</p>
                <div className="flex items-center gap-1">
                  <Clock className="size-3 text-green-600" />
                  <span className="text-xs font-semibold text-gray-700">1h 30m</span>
                </div>
              </button>
            </div>
          </div>

          {/* Trip Type */}
          <div className="bg-white rounded-2xl p-5 shadow-xl border-2 border-gray-100">
            <label className="text-xs text-gray-600 font-semibold mb-3 block">Trip Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSearchParams({ ...searchParams, isRoundTrip: false })}
                className={`py-4 rounded-xl font-bold transition-all relative overflow-hidden ${
                  !searchParams.isRoundTrip
                    ? `bg-gradient-to-r ${config.color} text-white shadow-lg`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
                <span className="relative">Safari Moja</span>
              </button>
              <button
                onClick={() => setSearchParams({ ...searchParams, isRoundTrip: true })}
                className={`py-4 rounded-xl font-bold transition-all relative overflow-hidden ${
                  searchParams.isRoundTrip
                    ? `bg-gradient-to-r ${config.color} text-white shadow-lg`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
                <span className="relative">Rudi-Rudi</span>
              </button>
            </div>
          </div>

          {/* From / To Locations */}
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 overflow-hidden">
            <button
              onClick={() => setShowLocationPicker('from')}
              className="w-full p-6 flex items-center gap-4 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all border-b-2 border-gray-100 group"
            >
              <div className={`${config.bgColor} p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                <Navigation className={`size-7 ${config.textColor}`} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs text-gray-500 mb-2 font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Kutoka
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {searchParams.from?.nameSw || 'Chagua mahali'}
                </p>
                {searchParams.from && (
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <MapPin className="size-3" />
                    {searchParams.from.code} • {searchParams.from.nameEn}
                  </p>
                )}
              </div>
              <ChevronRight className="size-6 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="relative h-0 flex justify-center">
              <button className={`absolute -top-7 bg-gradient-to-r ${config.color} p-4 rounded-2xl shadow-2xl hover:scale-110 hover:rotate-180 transition-all z-10 border-4 border-white`}>
                <ArrowLeft className="size-6 text-white rotate-90" />
              </button>
            </div>

            <button
              onClick={() => setShowLocationPicker('to')}
              className="w-full p-6 flex items-center gap-4 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all group"
            >
              <div className={`${config.bgColor} p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                <MapPin className={`size-7 ${config.textColor}`} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs text-gray-500 mb-2 font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Kwenda
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {searchParams.to?.nameSw || 'Chagua mahali'}
                </p>
                {searchParams.to && (
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <MapPin className="size-3" />
                    {searchParams.to.code} • {searchParams.to.nameEn}
                  </p>
                )}
              </div>
              <ChevronRight className="size-6 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-5 shadow-xl border-2 border-gray-100 hover:border-green-300 transition-colors">
              <label className="text-xs text-gray-600 font-semibold mb-3 block flex items-center gap-2">
                <Calendar className="size-4 text-green-600" />
                Tarehe ya Kuondoka
              </label>
              <input
                type="date"
                value={searchParams.departDate}
                onChange={(e) => setSearchParams({ ...searchParams, departDate: e.target.value })}
                className="w-full text-base font-bold text-gray-900 border-0 focus:outline-none bg-transparent"
              />
            </div>
            {searchParams.isRoundTrip && (
              <div className="bg-white rounded-2xl p-5 shadow-xl border-2 border-gray-100 hover:border-green-300 transition-colors">
                <label className="text-xs text-gray-600 font-semibold mb-3 block flex items-center gap-2">
                  <Calendar className="size-4 text-blue-600" />
                  Tarehe ya Kurudi
                </label>
                <input
                  type="date"
                  value={searchParams.returnDate}
                  onChange={(e) => setSearchParams({ ...searchParams, returnDate: e.target.value })}
                  className="w-full text-base font-bold text-gray-900 border-0 focus:outline-none bg-transparent"
                />
              </div>
            )}
          </div>

          {/* Passengers & Class */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-5 shadow-xl border-2 border-gray-100">
              <label className="text-xs text-gray-600 font-semibold mb-4 block flex items-center gap-2">
                <Users className="size-4 text-purple-600" />
                Abiria
              </label>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSearchParams({ ...searchParams, passengers: Math.max(1, searchParams.passengers - 1) })}
                  className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center hover:bg-gradient-to-br hover:from-red-100 hover:to-red-200 transition-all shadow-md active:scale-95"
                >
                  <Minus className="size-6 text-gray-700" />
                </button>
                <span className="text-3xl font-bold text-gray-900">{searchParams.passengers}</span>
                <button
                  onClick={() => setSearchParams({ ...searchParams, passengers: searchParams.passengers + 1 })}
                  className={`w-12 h-12 bg-gradient-to-r ${config.color} rounded-2xl flex items-center justify-center hover:scale-110 transition-transform shadow-xl`}
                >
                  <Plus className="size-6 text-white" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-xl border-2 border-gray-100">
              <label className="text-xs text-gray-600 font-semibold mb-3 block flex items-center gap-2">
                <Award className="size-4 text-amber-600" />
                Daraja
              </label>
              <select
                value={searchParams.travelClass}
                onChange={(e) => setSearchParams({ ...searchParams, travelClass: e.target.value as TravelClass })}
                className="w-full text-base font-bold text-gray-900 border-0 focus:outline-none bg-transparent"
              >
                <option value="economy">Kawaida</option>
                <option value="business">Biashara</option>
                <option value="first">Daraja la Kwanza</option>
                <option value="vip">VIP</option>
                <option value="luxury">Kifahari</option>
              </select>
            </div>
          </div>

          {/* Smart Filters */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border-2 border-blue-100">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Filter className="size-4 text-blue-600" />
              Smart Filters
            </h3>
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 bg-white rounded-xl text-sm font-semibold text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors shadow-md flex items-center gap-2">
                <Check className="size-4" />
                Direct Only
              </button>
              <button className="px-4 py-2 bg-white rounded-xl text-sm font-semibold text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors shadow-md flex items-center gap-2">
                <Calendar className="size-4" />
                Flexible Dates
              </button>
              <button className="px-4 py-2 bg-white rounded-xl text-sm font-semibold text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors shadow-md flex items-center gap-2">
                <Star className="size-4" />
                Best Price
              </button>
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={!searchParams.from || !searchParams.to}
            className={`w-full py-6 rounded-3xl font-bold text-white text-lg shadow-2xl transition-all relative overflow-hidden group ${
              !searchParams.from || !searchParams.to
                ? 'bg-gray-300 cursor-not-allowed'
                : `bg-gradient-to-r ${config.color} hover:shadow-3xl hover:scale-[1.02] active:scale-[0.98]`
            }`}
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <span className="relative flex items-center justify-center gap-3">
              <Search className="size-6" />
              Tafuta Safari
            </span>
          </button>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 text-center border-2 border-green-100 hover:scale-105 transition-transform shadow-lg">
              <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Shield className="size-6 text-green-600" />
              </div>
              <div className="text-xs font-bold text-green-900">Salama 100%</div>
              <div className="text-xs text-green-600 mt-1">SSL Secure</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 text-center border-2 border-blue-100 hover:scale-105 transition-transform shadow-lg">
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Star className="size-6 text-blue-600" />
              </div>
              <div className="text-xs font-bold text-blue-900">Bei Bora</div>
              <div className="text-xs text-blue-600 mt-1">Guaranteed</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 text-center border-2 border-purple-100 hover:scale-105 transition-transform shadow-lg">
              <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Sparkles className="size-6 text-purple-600" />
              </div>
              <div className="text-xs font-bold text-purple-900">Haraka</div>
              <div className="text-xs text-purple-600 mt-1">Instant</div>
            </div>
          </div>
        </div>

        {/* Location Picker Modal */}
        {showLocationPicker && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end animate-fade-in">
            <div className="bg-white rounded-t-3xl w-full max-h-[85vh] overflow-hidden animate-slide-up shadow-2xl">
              <div className="sticky top-0 bg-gradient-to-br from-white to-gray-50 border-b-2 border-gray-200 p-5 z-10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                      Chagua Mahali {showLocationPicker === 'from' ? 'pa Kuanzia' : 'pa Kwenda'}
                    </h2>
                    <p className="text-sm text-gray-500">Select your destination</p>
                  </div>
                  <button
                    onClick={() => setShowLocationPicker(null)}
                    className="p-3 hover:bg-gray-100 rounded-2xl transition-all"
                  >
                    <X className="size-6 text-gray-600" />
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tafuta jiji, uwanja wa ndege..."
                    className="w-full pl-12 pr-4 py-4 bg-gray-100 rounded-2xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-medium"
                  />
                </div>
              </div>
              <div className="overflow-y-auto p-5 space-y-3 max-h-[65vh]">
                <div className="mb-2">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <MapPin className="size-4" />
                    Major Cities
                  </h3>
                </div>
                
                {locations.filter(l => l.type === 'city').map((location) => (
                  <button
                    key={location.id}
                    onClick={() => {
                      if (showLocationPicker === 'from') {
                        setSearchParams({ ...searchParams, from: location });
                      } else {
                        setSearchParams({ ...searchParams, to: location });
                      }
                      setShowLocationPicker(null);
                    }}
                    className="w-full flex items-center gap-4 p-4 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-2xl transition-all border-2 border-transparent hover:border-green-200 group"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Home className="size-7 text-green-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-bold text-gray-900 text-lg">{location.nameSw}</p>
                      <p className="text-sm text-gray-500">{location.nameEn}</p>
                    </div>
                    {location.code && (
                      <div className="bg-gray-100 px-3 py-2 rounded-xl">
                        <span className="text-sm font-bold text-gray-600">{location.code}</span>
                      </div>
                    )}
                    <ChevronRight className="size-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
                
                {locations.some(l => l.type === 'park') && (
                  <>
                    <div className="mt-6 mb-2">
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Mountain className="size-4" />
                        National Parks
                      </h3>
                    </div>
                    
                    {locations.filter(l => l.type === 'park').map((location) => (
                      <button
                        key={location.id}
                        onClick={() => {
                          if (showLocationPicker === 'from') {
                            setSearchParams({ ...searchParams, from: location });
                          } else {
                            setSearchParams({ ...searchParams, to: location });
                          }
                          setShowLocationPicker(null);
                        }}
                        className="w-full flex items-center gap-4 p-4 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 rounded-2xl transition-all border-2 border-transparent hover:border-amber-200 group"
                      >
                        <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Mountain className="size-7 text-amber-600" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-bold text-gray-900 text-lg">{location.nameSw}</p>
                          <p className="text-sm text-gray-500">{location.nameEn}</p>
                        </div>
                        <div className="bg-amber-100 px-3 py-1 rounded-full">
                          <span className="text-xs font-bold text-amber-700">UNESCO</span>
                        </div>
                        <ChevronRight className="size-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // RESULTS VIEW
  if (currentView === 'results') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pb-20">
        {/* Header */}
        <div className="bg-white border-b-2 border-gray-100 sticky top-0 z-20 shadow-lg">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3 mb-3">
              <button onClick={() => setCurrentView('search')} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                <ArrowLeft className="size-6 text-gray-900" />
              </button>
              <div className="flex-1">
                <h1 className="text-lg font-bold text-gray-900">
                  {searchParams.from?.code} → {searchParams.to?.code}
                </h1>
                <p className="text-xs text-gray-500">{searchParams.passengers} abiria • {searchParams.departDate}</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-xl">
                <Filter className="size-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Sort Bar */}
        <div className="bg-white border-b px-4 py-3">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl text-sm font-semibold whitespace-nowrap">
              <TrendingDown className="size-4 inline mr-1" />
              Cheapest
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold whitespace-nowrap">
              <Clock className="size-4 inline mr-1" />
              Fastest
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold whitespace-nowrap">
              <Star className="size-4 inline mr-1" />
              Best Rated
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold whitespace-nowrap">
              Morning
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold whitespace-nowrap">
              Afternoon
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              <span className="font-bold text-gray-900">{mockResults.length} results</span> found
            </p>
            <button className="text-sm text-blue-600 font-semibold">Price Alert</button>
          </div>

          {/* Result Cards */}
          {mockResults.map((result) => (
            <button
              key={result.id}
              onClick={() => handleSelectResult(result)}
              className="w-full bg-white rounded-3xl p-5 shadow-lg hover:shadow-2xl transition-all border-2 border-gray-100 hover:border-blue-300"
            >
              {/* Badges */}
              <div className="flex gap-2 mb-4">
                {result.isPopular && (
                  <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <TrendingDown className="size-3" />
                    Most Popular
                  </div>
                )}
                {result.isCheapest && (
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Zap className="size-3" />
                    Best Price
                  </div>
                )}
                {result.isDirect && (
                  <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                    Direct
                  </div>
                )}
              </div>

              {/* Main Content */}
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">{result.logo}</div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-gray-900 mb-1">{result.provider}</p>
                  <div className="flex items-center gap-2">
                    <Star className="size-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-700">{result.rating}</span>
                    <span className="text-xs text-gray-500">({result.reviews})</span>
                  </div>
                </div>
              </div>

              {/* Times */}
              <div className="flex items-center gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{result.departTime}</p>
                  <p className="text-xs text-gray-500">{searchParams.from?.code}</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-px flex-1 bg-gray-300"></div>
                    <div className="bg-gray-100 px-3 py-1 rounded-full">
                      <p className="text-xs font-bold text-gray-600">{result.duration}</p>
                    </div>
                    <div className="h-px flex-1 bg-gray-300"></div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{result.arriveTime}</p>
                  <p className="text-xs text-gray-500">{searchParams.to?.code}</p>
                </div>
              </div>

              {/* Features */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {result.features.map((feature, idx) => (
                  <div key={idx} className="bg-gray-100 px-3 py-1 rounded-lg">
                    <span className="text-xs text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Price */}
              <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                <div>
                  {result.originalPrice && (
                    <p className="text-sm text-gray-500 line-through">{formatCurrency(result.originalPrice)}</p>
                  )}
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(result.price)}</p>
                  <p className="text-xs text-gray-500">{result.seats} seats left</p>
                </div>
                <div className={`bg-gradient-to-r ${config.color} text-white px-6 py-3 rounded-xl font-bold shadow-lg`}>
                  Select
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // DETAILS VIEW
  if (currentView === 'details' && selectedResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pb-24">
        {/* Header */}
        <div className="bg-white border-b-2 border-gray-100 sticky top-0 z-20 shadow-lg">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setCurrentView('results')} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                <ArrowLeft className="size-6 text-gray-900" />
              </button>
              <div className="flex-1">
                <h1 className="text-lg font-bold text-gray-900">Flight Details</h1>
                <p className="text-xs text-gray-500">{selectedResult.provider}</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-xl">
                <Heart className="size-6 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-xl">
                <Share2 className="size-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Provider Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 shadow-2xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="relative flex items-center gap-4 mb-6">
              <div className="text-6xl">{selectedResult.logo}</div>
              <div className="flex-1">
                <p className="text-2xl font-bold mb-2">{selectedResult.provider}</p>
                <div className="flex items-center gap-2">
                  <Star className="size-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold">{selectedResult.rating}</span>
                  <span className="text-sm opacity-90">({selectedResult.reviews} reviews)</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                <p className="text-xs opacity-80 mb-1">From</p>
                <p className="text-lg font-bold">{searchParams.from?.code}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                <p className="text-xs opacity-80 mb-1">To</p>
                <p className="text-lg font-bold">{searchParams.to?.code}</p>
              </div>
            </div>
          </div>

          {/* Flight Timeline */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Journey Details</h2>
            
            <div className="space-y-6">
              {/* Departure */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <div className="w-px h-full bg-gray-300"></div>
                </div>
                <div className="flex-1 pb-6">
                  <p className="text-2xl font-bold text-gray-900 mb-1">{selectedResult.departTime}</p>
                  <p className="text-sm font-semibold text-gray-700 mb-1">{searchParams.from?.nameEn}</p>
                  <p className="text-xs text-gray-500">{searchParams.departDate}</p>
                </div>
              </div>

              {/* Duration */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <div className="w-px h-full bg-gray-300"></div>
                </div>
                <div className="flex-1 pb-6">
                  <p className="text-sm font-semibold text-gray-700 mb-2">In flight</p>
                  <div className="bg-blue-50 rounded-xl p-3 inline-block">
                    <p className="text-xs font-bold text-blue-700">{selectedResult.duration}</p>
                  </div>
                </div>
              </div>

              {/* Arrival */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold text-gray-900 mb-1">{selectedResult.arriveTime}</p>
                  <p className="text-sm font-semibold text-gray-700 mb-1">{searchParams.to?.nameEn}</p>
                  <p className="text-xs text-gray-500">{searchParams.departDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features & Amenities */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Included in your booking</h2>
            <div className="space-y-3">
              {selectedResult.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                  <Check className="size-5 text-green-600" />
                  <span className="text-sm font-semibold text-gray-900">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Price Breakdown</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Base Fare (x{searchParams.passengers})</span>
                <span className="text-sm font-semibold text-gray-900">{formatCurrency(selectedResult.price * searchParams.passengers)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Taxes & Fees</span>
                <span className="text-sm font-semibold text-gray-900">{formatCurrency(0)}</span>
              </div>
              {selectedResult.originalPrice && (
                <div className="flex justify-between items-center text-green-600">
                  <span className="text-sm font-semibold">Savings</span>
                  <span className="text-sm font-bold">-{formatCurrency((selectedResult.originalPrice - selectedResult.price) * searchParams.passengers)}</span>
                </div>
              )}
              <div className="border-t-2 border-gray-200 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">{formatCurrency(selectedResult.price * searchParams.passengers)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Policies */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-6 border-2 border-orange-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Info className="size-5 text-orange-600" />
              Important Information
            </h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-0.5">•</span>
                <span>Check-in opens 2 hours before departure</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-0.5">•</span>
                <span>Valid ID required for boarding</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-0.5">•</span>
                <span>Free cancellation up to 24 hours before</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-4 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">Total Price</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(selectedResult.price * searchParams.passengers)}</p>
            </div>
            <button
              onClick={handleContinueToPassengers}
              className={`bg-gradient-to-r ${config.color} text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PASSENGERS VIEW
  if (currentView === 'passengers') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pb-32">
        {/* Header */}
        <div className="bg-white border-b-2 border-gray-100 sticky top-0 z-20 shadow-lg">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setCurrentView('details')} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                <ArrowLeft className="size-6 text-gray-900" />
              </button>
              <div className="flex-1">
                <h1 className="text-lg font-bold text-gray-900">Passenger Details</h1>
                <p className="text-xs text-gray-500">{searchParams.passengers} traveler(s)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Progress */}
          <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Step 2 of 3</span>
              <span className="text-sm font-semibold text-blue-600">66% Complete</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
            </div>
          </div>

          {/* Passenger Forms */}
          {passengers.map((passenger, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 shadow-xl border-2 border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="size-5 text-blue-600" />
                Passenger {idx + 1}
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-2 block">First Name *</label>
                    <input
                      type="text"
                      placeholder="Jina la Kwanza"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      value={passenger.firstName}
                      onChange={(e) => {
                        const newPassengers = [...passengers];
                        newPassengers[idx].firstName = e.target.value;
                        setPassengers(newPassengers);
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-2 block">Last Name *</label>
                    <input
                      type="text"
                      placeholder="Jina la Ukoo"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      value={passenger.lastName}
                      onChange={(e) => {
                        const newPassengers = [...passengers];
                        newPassengers[idx].lastName = e.target.value;
                        setPassengers(newPassengers);
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-2 block">Date of Birth *</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    value={passenger.dob}
                    onChange={(e) => {
                      const newPassengers = [...passengers];
                      newPassengers[idx].dob = e.target.value;
                      setPassengers(newPassengers);
                    }}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-2 block">ID Type *</label>
                  <select
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    value={passenger.idType}
                    onChange={(e) => {
                      const newPassengers = [...passengers];
                      newPassengers[idx].idType = e.target.value as 'nida' | 'passport' | 'driving';
                      setPassengers(newPassengers);
                    }}
                  >
                    <option value="nida">NIDA</option>
                    <option value="passport">Passport</option>
                    <option value="driving">Driving License</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-2 block">ID Number *</label>
                  <input
                    type="text"
                    placeholder="Enter ID number"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    value={passenger.idNumber}
                    onChange={(e) => {
                      const newPassengers = [...passengers];
                      newPassengers[idx].idNumber = e.target.value;
                      setPassengers(newPassengers);
                    }}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-2 block">Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="+255 XXX XXX XXX"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    value={passenger.phone}
                    onChange={(e) => {
                      const newPassengers = [...passengers];
                      newPassengers[idx].phone = e.target.value;
                      setPassengers(newPassengers);
                    }}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-2 block">Email Address *</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    value={passenger.email}
                    onChange={(e) => {
                      const newPassengers = [...passengers];
                      newPassengers[idx].email = e.target.value;
                      setPassengers(newPassengers);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Important Note */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-5 border-2 border-blue-200">
            <div className="flex gap-3">
              <Shield className="size-6 text-blue-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-gray-900 mb-2">Your information is safe</p>
                <p className="text-sm text-gray-700">All passenger details are encrypted and securely stored. We never share your personal information.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-4 shadow-2xl">
          <button
            onClick={handleContinueToPayment}
            className={`w-full bg-gradient-to-r ${config.color} text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all`}
          >
            Continue to Payment
          </button>
        </div>
      </div>
    );
  }

  // PAYMENT VIEW
  if (currentView === 'payment') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pb-32">
        {/* Header */}
        <div className="bg-white border-b-2 border-gray-100 sticky top-0 z-20 shadow-lg">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setCurrentView('passengers')} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
                <ArrowLeft className="size-6 text-gray-900" />
              </button>
              <div className="flex-1">
                <h1 className="text-lg font-bold text-gray-900">Payment</h1>
                <p className="text-xs text-gray-500">Choose payment method</p>
              </div>
              <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full">
                <Shield className="size-4 text-green-600" />
                <span className="text-xs font-bold text-green-700">Secure</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Progress */}
          <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Step 3 of 3</span>
              <span className="text-sm font-semibold text-green-600">Final Step!</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"></div>
            </div>
          </div>

          {/* goPay Wallet */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Wallet className="size-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm">goPay Wallet</p>
                  <p className="text-xs opacity-90">Instant payment</p>
                </div>
              </div>
              <Check className="size-6" />
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
              <p className="text-xs opacity-90 mb-1">Available Balance</p>
              <p className="text-3xl font-bold">{formatCurrency(user.walletBalance)}</p>
            </div>
          </div>

          {/* Mobile Money */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="size-5 text-blue-600" />
              Mobile Money
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 border-2 border-blue-200 rounded-2xl hover:bg-blue-50 transition-all">
                <p className="text-2xl mb-2">📱</p>
                <p className="text-sm font-bold text-gray-900">M-Pesa</p>
              </button>
              <button className="p-4 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 transition-all">
                <p className="text-2xl mb-2">💳</p>
                <p className="text-sm font-bold text-gray-900">Tigo Pesa</p>
              </button>
              <button className="p-4 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 transition-all">
                <p className="text-2xl mb-2">🏦</p>
                <p className="text-sm font-bold text-gray-900">Airtel Money</p>
              </button>
              <button className="p-4 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 transition-all">
                <p className="text-2xl mb-2">💰</p>
                <p className="text-sm font-bold text-gray-900">Halo Pesa</p>
              </button>
            </div>
          </div>

          {/* Card Payment */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="size-5 text-purple-600" />
              Card Payment
            </h2>
            <div className="space-y-3">
              <button className="w-full p-4 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 transition-all flex items-center gap-3">
                <CreditCard className="size-6 text-gray-600" />
                <span className="text-sm font-bold text-gray-900">Debit/Credit Card</span>
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-start pb-3 border-b">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">{selectedResult?.provider}</p>
                  <p className="text-xs text-gray-500">{searchParams.from?.code} → {searchParams.to?.code}</p>
                  <p className="text-xs text-gray-500">{searchParams.passengers} passenger(s)</p>
                </div>
                <p className="font-bold text-gray-900">{formatCurrency((selectedResult?.price || 0) * searchParams.passengers)}</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Service Fee</span>
                <span className="text-sm font-semibold text-gray-900">{formatCurrency(0)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t-2">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">{formatCurrency((selectedResult?.price || 0) * searchParams.passengers)}</span>
              </div>
            </div>
          </div>

          {/* Security Badge */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-5 border-2 border-green-200">
            <div className="flex items-center gap-3">
              <Shield className="size-8 text-green-600" />
              <div>
                <p className="font-bold text-gray-900 mb-1">256-bit SSL Encryption</p>
                <p className="text-sm text-gray-700">Your payment is 100% secure and encrypted</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-4 shadow-2xl">
          <button
            onClick={handleCompletePayment}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
          >
            <Shield className="size-6" />
            Pay {formatCurrency((selectedResult?.price || 0) * searchParams.passengers)}
          </button>
        </div>
      </div>
    );
  }

  // CONFIRMATION VIEW
  if (currentView === 'confirmation') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pb-20">
        {/* Success Animation */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 px-6 pt-12 pb-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-3xl"></div>
          
          <div className="relative">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Check className="size-14 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
            <p className="text-green-100 text-lg">Your ticket is ready</p>
          </div>
        </div>

        <div className="px-4 -mt-8 space-y-4">
          {/* QR Code Ticket */}
          <div className="bg-white rounded-3xl p-6 shadow-2xl border-2 border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-gray-500 mb-1">Booking Reference</p>
                <p className="text-2xl font-bold text-gray-900">{bookingReference}</p>
              </div>
              <div className="bg-green-100 px-4 py-2 rounded-full">
                <p className="text-xs font-bold text-green-700">CONFIRMED</p>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-gray-100 rounded-2xl p-8 mb-6 flex items-center justify-center">
              <div className="w-48 h-48 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                <QrCode className="size-32 text-gray-900" />
              </div>
            </div>

            {/* Trip Details */}
            <div className="space-y-4 pt-6 border-t-2 border-gray-100">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Provider</span>
                <span className="text-sm font-bold text-gray-900">{selectedResult?.provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Route</span>
                <span className="text-sm font-bold text-gray-900">{searchParams.from?.code} → {searchParams.to?.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Date</span>
                <span className="text-sm font-bold text-gray-900">{searchParams.departDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Departure</span>
                <span className="text-sm font-bold text-gray-900">{selectedResult?.departTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Passengers</span>
                <span className="text-sm font-bold text-gray-900">{searchParams.passengers}</span>
              </div>
              <div className="flex justify-between pt-4 border-t-2">
                <span className="text-lg font-bold text-gray-900">Amount Paid</span>
                <span className="text-xl font-bold text-green-600">{formatCurrency((selectedResult?.price || 0) * searchParams.passengers)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-white border-2 border-gray-200 py-4 rounded-2xl font-bold text-gray-900 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
              <Download className="size-5" />
              Download
            </button>
            <button className="bg-white border-2 border-gray-200 py-4 rounded-2xl font-bold text-gray-900 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
              <Share2 className="size-5" />
              Share
            </button>
          </div>

          {/* Rewards Earned */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 border-2 border-amber-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-amber-400 rounded-2xl flex items-center justify-center">
                <Star className="size-8 text-amber-900" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 mb-1">You earned {Math.floor((selectedResult?.price || 0) * searchParams.passengers * 0.05)} points!</p>
                <p className="text-sm text-gray-700">Use your GO Rewards on your next booking</p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">What's Next?</h2>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bell className="size-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">Check-in reminder</p>
                  <p className="text-xs text-gray-600">We'll send you a notification 24 hours before</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <QrCode className="size-4 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">Show QR code at check-in</p>
                  <p className="text-xs text-gray-600">Present this ticket at the counter</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <IdCard className="size-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">Bring valid ID</p>
                  <p className="text-xs text-gray-600">ID must match passenger details</p>
                </div>
              </div>
            </div>
          </div>

          {/* Return Home Button */}
          <button
            onClick={onBack}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return null;
}
