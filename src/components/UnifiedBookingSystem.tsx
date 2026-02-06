import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { User } from '../App';
import {
  ArrowLeft, Plane, Bus, Train, Hotel, Mountain, Calendar, MapPin,
  Users, ChevronRight, Search, Filter, Star, Clock, Shield, Check,
  Download, Share2, Plus, Minus, X, Info, AlertCircle, Phone,
  IdCard, CreditCard, Wallet, QrCode, FileText, Bell, Edit2,
  Navigation, Wifi, WifiOff, ChevronDown, Heart, Briefcase,
  Utensils, Home, Sparkles, Award, Globe, MessageCircle, LucideIcon
} from 'lucide-react';

// Types
type BookingService = 'flights' | 'buses' | 'sgr' | 'hotels' | 'parks';
type BookingView = 'search' | 'results' | 'details' | 'passenger' | 'payment' | 'confirmation' | 'dashboard';
type TravelClass = 'economy' | 'business' | 'first' | 'vip' | 'luxury';
type IDType = 'nida' | 'passport' | 'voter';

interface Location {
  id: string;
  name: string;
  nameEn: string;
  nameSw: string;
  type: 'city' | 'landmark' | 'station' | 'airport' | 'park';
  code?: string;
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

interface BookingResult {
  id: string;
  provider: string;
  providerLogo: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  price: number;
  originalPrice?: number;
  currency: string;
  class: TravelClass;
  seatsAvailable: number;
  rating: number;
  reviews: number;
  features: string[];
  isVerified: boolean;
  isRefundable: boolean;
  isDirect: boolean;
  stops?: number;
}

interface Passenger {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  idType: IDType;
  idNumber: string;
  emergencyContact: string;
}

interface Booking {
  id: string;
  service: BookingService;
  reference: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  provider: string;
  from: string;
  to: string;
  date: string;
  time: string;
  passengers: number;
  amount: number;
  qrCode: string;
}

interface UnifiedBookingSystemProps {
  user: User;
  onBack: () => void;
  initialService?: BookingService;
}

// Mock data
const locations: Location[] = [
  // Cities
  { id: '1', name: 'Dar es Salaam', nameEn: 'Dar es Salaam', nameSw: 'Dar es Salaam', type: 'city', code: 'DAR' },
  { id: '2', name: 'Dodoma', nameEn: 'Dodoma', nameSw: 'Dodoma', type: 'city', code: 'DOD' },
  { id: '3', name: 'Arusha', nameEn: 'Arusha', nameSw: 'Arusha', type: 'city', code: 'ARK' },
  { id: '4', name: 'Mwanza', nameEn: 'Mwanza', nameSw: 'Mwanza', type: 'city', code: 'MWZ' },
  { id: '5', name: 'Mbeya', nameEn: 'Mbeya', nameSw: 'Mbeya', type: 'city', code: 'MBI' },
  { id: '6', name: 'Zanzibar', nameEn: 'Zanzibar', nameSw: 'Zanzibar', type: 'city', code: 'ZNZ' },
  { id: '7', name: 'Moshi', nameEn: 'Moshi', nameSw: 'Moshi', type: 'city', code: 'QSI' },
  { id: '8', name: 'Tanga', nameEn: 'Tanga', nameSw: 'Tanga', type: 'city', code: 'TGT' },
  // Parks
  { id: '9', name: 'Serengeti', nameEn: 'Serengeti National Park', nameSw: 'Mbuga ya Serengeti', type: 'park' },
  { id: '10', name: 'Ngorongoro', nameEn: 'Ngorongoro Crater', nameSw: 'Ngorongoro', type: 'park' },
  { id: '11', name: 'Kilimanjaro', nameEn: 'Mount Kilimanjaro', nameSw: 'Mlima Kilimanjaro', type: 'park' },
  { id: '12', name: 'Mikumi', nameEn: 'Mikumi National Park', nameSw: 'Mbuga ya Mikumi', type: 'park' },
];

const mockResults: BookingResult[] = [
  {
    id: '1',
    provider: 'Precision Air',
    providerLogo: '✈️',
    departTime: '08:00',
    arriveTime: '09:30',
    duration: '1h 30m',
    price: 185000,
    originalPrice: 220000,
    currency: 'TZS',
    class: 'economy',
    seatsAvailable: 12,
    rating: 4.5,
    reviews: 1250,
    features: ['Free 20kg luggage', 'In-flight snack', 'Free cancellation'],
    isVerified: true,
    isRefundable: true,
    isDirect: true,
  },
  {
    id: '2',
    provider: 'Kilimanjaro Express',
    providerLogo: '🚌',
    departTime: '06:00',
    arriveTime: '14:30',
    duration: '8h 30m',
    price: 45000,
    currency: 'TZS',
    class: 'vip',
    seatsAvailable: 8,
    rating: 4.7,
    reviews: 890,
    features: ['WiFi', 'AC', 'Reclining seats', 'Free water'],
    isVerified: true,
    isRefundable: false,
    isDirect: true,
  },
  {
    id: '3',
    provider: 'SGR Express',
    providerLogo: '🚆',
    departTime: '10:00',
    arriveTime: '15:45',
    duration: '5h 45m',
    price: 65000,
    currency: 'TZS',
    class: 'economy',
    seatsAvailable: 45,
    rating: 4.8,
    reviews: 2100,
    features: ['Government verified', 'AC', 'Dining car', 'Power outlets'],
    isVerified: true,
    isRefundable: true,
    isDirect: true,
  },
];

const serviceConfig = {
  flights: {
    icon: Plane,
    title: 'Ndege za Ndani',
    titleEn: 'Domestic Flights',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-600',
  },
  buses: {
    icon: Bus,
    title: 'Mabasi ya Kifahari',
    titleEn: 'Luxury Buses',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-600',
  },
  sgr: {
    icon: Train,
    title: 'Treni ya SGR',
    titleEn: 'SGR Train',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-600',
  },
  hotels: {
    icon: Hotel,
    title: 'Hoteli na Malazi',
    titleEn: 'Hotels & Stays',
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-100',
    textColor: 'text-pink-600',
  },
  parks: {
    icon: Mountain,
    title: 'Mbuga za Taifa',
    titleEn: 'National Parks',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-100',
    textColor: 'text-green-600',
  },
};

export function UnifiedBookingSystem({ user, onBack, initialService = 'flights' }: UnifiedBookingSystemProps) {
  const [currentService, setCurrentService] = useState<BookingService>(initialService);
  const [currentView, setCurrentView] = useState<BookingView>('search');
  const [searchParams, setSearchParams] = useState<SearchParams>({
    from: null,
    to: null,
    departDate: new Date().toISOString().split('T')[0],
    returnDate: '',
    passengers: 1,
    travelClass: 'economy',
    isRoundTrip: false,
  });
  const [results, setResults] = useState<BookingResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<BookingResult | null>(null);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState<'from' | 'to' | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const config = serviceConfig[currentService];

  const formatCurrency = (amount: number) => {
    return `TZS ${amount.toLocaleString()}`;
  };

  const handleSearch = () => {
    // Simulate API call
    setResults(mockResults);
    setCurrentView('results');
  };

  const handleSelectResult = (result: BookingResult) => {
    setSelectedResult(result);
    setCurrentView('details');
  };

  const handleProceedToPassenger = () => {
    if (passengers.length === 0) {
      // Initialize with empty passengers
      setPassengers([{
        id: '1',
        firstName: user.name.split(' ')[0] || '',
        lastName: user.name.split(' ')[1] || '',
        phone: user.phone,
        idType: 'nida',
        idNumber: '',
        emergencyContact: '',
      }]);
    }
    setCurrentView('passenger');
  };

  const handleProceedToPayment = () => {
    setCurrentView('payment');
  };

  const handleConfirmPayment = () => {
    // Create booking
    const newBooking: Booking = {
      id: `BK${Date.now()}`,
      service: currentService,
      reference: `GO${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: 'upcoming',
      provider: selectedResult?.provider || '',
      from: searchParams.from?.name || '',
      to: searchParams.to?.name || '',
      date: searchParams.departDate,
      time: selectedResult?.departTime || '',
      passengers: searchParams.passengers,
      amount: selectedResult?.price || 0,
      qrCode: 'QR_CODE_DATA',
    };
    setBookings([...bookings, newBooking]);
    setSelectedBooking(newBooking);
    setCurrentView('confirmation');
  };

  const handleViewDashboard = () => {
    setCurrentView('dashboard');
  };

  // SEARCH VIEW
  if (currentView === 'search') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft className="size-6 text-gray-900" />
              </button>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900">{config.title}</h1>
                <p className="text-sm text-gray-500">{config.titleEn}</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <MessageCircle className="size-6 text-gray-600" />
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
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? `bg-gradient-to-r ${serviceConfig[service].color} text-white shadow-lg`
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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

        {/* Loading Message */}
        {isOffline && (
          <div className="mx-4 mt-4 p-4 bg-orange-50 border-2 border-orange-200 rounded-2xl flex items-start gap-3">
            <WifiOff className="size-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-orange-900 mb-1">Unafanya kazi nje ya mtandao</p>
              <p className="text-sm text-orange-700">Taarifa zitahifadhiwa na kutumwa ukiwasiliana na mtandao</p>
            </div>
          </div>
        )}

        <div className="p-4 space-y-4">
          {/* Trip Type */}
          <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-gray-100">
            <div className="flex gap-3">
              <button
                onClick={() => setSearchParams({ ...searchParams, isRoundTrip: false })}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                  !searchParams.isRoundTrip
                    ? `bg-gradient-to-r ${config.color} text-white shadow-md`
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Safari Moja
              </button>
              <button
                onClick={() => setSearchParams({ ...searchParams, isRoundTrip: true })}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                  searchParams.isRoundTrip
                    ? `bg-gradient-to-r ${config.color} text-white shadow-md`
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Rudi-Rudi
              </button>
            </div>
          </div>

          {/* From / To Locations */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
            {/* From */}
            <button
              onClick={() => setShowLocationPicker('from')}
              className="w-full p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors border-b-2 border-gray-100"
            >
              <div className={`${config.bgColor} p-3 rounded-xl`}>
                <Navigation className={`size-6 ${config.textColor}`} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs text-gray-500 mb-1 font-medium">Kutoka</p>
                <p className="text-base font-bold text-gray-900">
                  {searchParams.from?.nameSw || 'Chagua mahali'}
                </p>
                {searchParams.from && (
                  <p className="text-xs text-gray-500 mt-0.5">{searchParams.from.code}</p>
                )}
              </div>
              <ChevronRight className="size-5 text-gray-400" />
            </button>

            {/* Swap Button */}
            <div className="relative h-0 flex justify-center">
              <button className={`absolute -top-6 bg-gradient-to-r ${config.color} p-3 rounded-full shadow-lg hover:scale-110 transition-transform z-10`}>
                <ArrowLeft className="size-5 text-white rotate-90" />
              </button>
            </div>

            {/* To */}
            <button
              onClick={() => setShowLocationPicker('to')}
              className="w-full p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors"
            >
              <div className={`${config.bgColor} p-3 rounded-xl`}>
                <MapPin className={`size-6 ${config.textColor}`} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs text-gray-500 mb-1 font-medium">Kwenda</p>
                <p className="text-base font-bold text-gray-900">
                  {searchParams.to?.nameSw || 'Chagua mahali'}
                </p>
                {searchParams.to && (
                  <p className="text-xs text-gray-500 mt-0.5">{searchParams.to.code}</p>
                )}
              </div>
              <ChevronRight className="size-5 text-gray-400" />
            </button>
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-gray-100">
              <label className="text-xs text-gray-500 mb-2 block font-medium">Tarehe ya Kuondoka</label>
              <input
                type="date"
                value={searchParams.departDate}
                onChange={(e) => setSearchParams({ ...searchParams, departDate: e.target.value })}
                className="w-full text-base font-bold text-gray-900 border-0 focus:outline-none"
              />
            </div>
            {searchParams.isRoundTrip && (
              <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-gray-100">
                <label className="text-xs text-gray-500 mb-2 block font-medium">Tarehe ya Kurudi</label>
                <input
                  type="date"
                  value={searchParams.returnDate}
                  onChange={(e) => setSearchParams({ ...searchParams, returnDate: e.target.value })}
                  className="w-full text-base font-bold text-gray-900 border-0 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Passengers & Class */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-gray-100">
              <label className="text-xs text-gray-500 mb-3 block font-medium">Abiria</label>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSearchParams({ ...searchParams, passengers: Math.max(1, searchParams.passengers - 1) })}
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <Minus className="size-5 text-gray-600" />
                </button>
                <span className="text-2xl font-bold text-gray-900">{searchParams.passengers}</span>
                <button
                  onClick={() => setSearchParams({ ...searchParams, passengers: searchParams.passengers + 1 })}
                  className={`w-10 h-10 bg-gradient-to-r ${config.color} rounded-full flex items-center justify-center hover:scale-110 transition-transform`}
                >
                  <Plus className="size-5 text-white" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-gray-100">
              <label className="text-xs text-gray-500 mb-2 block font-medium">Daraja</label>
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

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={!searchParams.from || !searchParams.to}
            className={`w-full py-5 rounded-2xl font-bold text-white text-lg shadow-xl transition-all ${
              !searchParams.from || !searchParams.to
                ? 'bg-gray-300 cursor-not-allowed'
                : `bg-gradient-to-r ${config.color} hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]`
            }`}
          >
            🔍 Tafuta Safari
          </button>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <Shield className="size-6 text-green-600 mx-auto mb-1" />
              <p className="text-xs font-semibold text-green-900">Salama 100%</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <Star className="size-6 text-blue-600 mx-auto mb-1" />
              <p className="text-xs font-semibold text-blue-900">Bei Bora</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-3 text-center">
              <Sparkles className="size-6 text-purple-600 mx-auto mb-1" />
              <p className="text-xs font-semibold text-purple-900">Haraka</p>
            </div>
          </div>
        </div>

        {/* Location Picker Modal */}
        {showLocationPicker && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end animate-fade-in">
            <div className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-hidden animate-slide-up">
              <div className="sticky top-0 bg-white border-b p-4 z-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">
                    Chagua Mahali {showLocationPicker === 'from' ? 'pa Kuanzia' : 'pa Kwenda'}
                  </h2>
                  <button
                    onClick={() => setShowLocationPicker(null)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="size-6 text-gray-600" />
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tafuta jiji, uwanja wa ndege..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="overflow-y-auto p-4 space-y-2 max-h-[60vh]">
                {locations.map((location) => (
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
                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      {location.type === 'city' && <Home className="size-6 text-gray-600" />}
                      {location.type === 'airport' && <Plane className="size-6 text-gray-600" />}
                      {location.type === 'park' && <Mountain className="size-6 text-gray-600" />}
                      {location.type === 'station' && <Train className="size-6 text-gray-600" />}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-bold text-gray-900">{location.nameSw}</p>
                      <p className="text-sm text-gray-500">{location.nameEn}</p>
                    </div>
                    {location.code && (
                      <span className="text-sm font-bold text-gray-400">{location.code}</span>
                    )}
                  </button>
                ))}
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
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3 mb-3">
              <button onClick={() => setCurrentView('search')} className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="size-6 text-gray-900" />
              </button>
              <div className="flex-1">
                <h1 className="text-lg font-bold text-gray-900">
                  {searchParams.from?.nameSw} → {searchParams.to?.nameSw}
                </h1>
                <p className="text-sm text-gray-500">
                  {new Date(searchParams.departDate).toLocaleDateString('sw-TZ', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Filter className="size-6 text-gray-600" />
              </button>
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
              <button className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold whitespace-nowrap">
                Bei Nafuu
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold whitespace-nowrap">
                Haraka Zaidi
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold whitespace-nowrap">
                Bila Kusimama
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold whitespace-nowrap">
                Inaweza Kurudi
              </button>
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="p-4 space-y-3">
          <p className="text-sm text-gray-600 font-medium">{results.length} chaguo zilizopatikana</p>
          
          {results.map((result, index) => (
            <button
              key={result.id}
              onClick={() => handleSelectResult(result)}
              className="w-full bg-white rounded-2xl p-5 shadow-md border-2 border-gray-100 hover:border-green-300 hover:shadow-xl transition-all duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Provider Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{result.providerLogo}</div>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900">{result.provider}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-1">
                        <Star className="size-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-semibold text-gray-700">{result.rating}</span>
                      </div>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{result.reviews} mapitio</span>
                    </div>
                  </div>
                </div>
                {result.isVerified && (
                  <div className="bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
                    <Shield className="size-3 text-green-600" />
                    <span className="text-xs font-semibold text-green-700">Verified</span>
                  </div>
                )}
              </div>

              {/* Time Info */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{result.departTime}</p>
                  <p className="text-xs text-gray-500 mt-1">{searchParams.from?.code}</p>
                </div>
                <div className="flex-1 px-4">
                  <div className="relative">
                    <div className="h-0.5 bg-gray-300"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                      <p className="text-xs text-gray-500 font-medium whitespace-nowrap">{result.duration}</p>
                    </div>
                  </div>
                  {result.isDirect && (
                    <p className="text-xs text-green-600 font-semibold text-center mt-1">Bila kusimama</p>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{result.arriveTime}</p>
                  <p className="text-xs text-gray-500 mt-1">{searchParams.to?.code}</p>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-4">
                {result.features.slice(0, 3).map((feature, i) => (
                  <div key={i} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full">
                    <Check className="size-3 text-green-600" />
                    <span className="text-xs text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Price */}
              <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(result.price)}</p>
                    {result.originalPrice && (
                      <p className="text-sm text-gray-400 line-through">{formatCurrency(result.originalPrice)}</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{result.seatsAvailable} viti vilivyobaki</p>
                </div>
                <ChevronRight className="size-6 text-green-600" />
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
      <div className="min-h-screen bg-gray-50 pb-24">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-20">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setCurrentView('results')} className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="size-6 text-gray-900" />
              </button>
              <div className="flex-1">
                <h1 className="text-lg font-bold text-gray-900">Maelezo ya Safari</h1>
                <p className="text-sm text-gray-500">Trip Details</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Heart className="size-6 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Provider Card */}
          <div className={`bg-gradient-to-r ${config.color} rounded-3xl p-6 text-white shadow-xl`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="text-5xl">{selectedResult.providerLogo}</div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedResult.provider}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="size-4 fill-white text-white" />
                    <span className="font-bold">{selectedResult.rating}</span>
                    <span className="opacity-80">({selectedResult.reviews})</span>
                  </div>
                </div>
              </div>
              {selectedResult.isVerified && (
                <div className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full">
                  <Shield className="size-5" />
                </div>
              )}
            </div>

            {/* Journey Timeline */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold mb-1">{selectedResult.departTime}</p>
                  <p className="text-white/80 font-medium">{searchParams.from?.nameSw}</p>
                  <p className="text-sm text-white/60 mt-1">{searchParams.from?.code}</p>
                </div>
                <div className="flex-1 px-6">
                  <div className="relative">
                    <div className="h-1 bg-white/30 rounded-full"></div>
                    <div className="h-1 bg-white rounded-full w-0 animate-[expand_2s_ease-out_forwards]"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-gray-900 px-3 py-1 rounded-full">
                      <p className="text-xs font-bold">{selectedResult.duration}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold mb-1">{selectedResult.arriveTime}</p>
                  <p className="text-white/80 font-medium">{searchParams.to?.nameSw}</p>
                  <p className="text-sm text-white/60 mt-1">{searchParams.to?.code}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Journey Details */}
          <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Info className="size-5 text-green-600" />
              Maelezo ya Safari
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Tarehe</span>
                <span className="font-bold text-gray-900">
                  {new Date(searchParams.departDate).toLocaleDateString('sw-TZ', { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Abiria</span>
                <span className="font-bold text-gray-900">{searchParams.passengers}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Daraja</span>
                <span className="font-bold text-gray-900 capitalize">{searchParams.travelClass}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Muda wa Safari</span>
                <span className="font-bold text-gray-900">{selectedResult.duration}</span>
              </div>
            </div>
          </div>

          {/* Features & Amenities */}
          <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="size-5 text-purple-600" />
              Vipengele Vilivyojumuishwa
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {selectedResult.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
                  <Check className="size-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-900">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="size-5 text-blue-600" />
              Sera ya Kughairi
            </h3>
            <div className="space-y-3">
              {selectedResult.isRefundable ? (
                <>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                    <Check className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-green-900 mb-1">Inaweza Kurejeshwa</p>
                      <p className="text-sm text-green-700">Ghairi kabla ya masaa 24 ili kupata marejesho kamili</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-xl">
                    <AlertCircle className="size-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-yellow-900 mb-1">Marejesho ya Nusu</p>
                      <p className="text-sm text-yellow-700">Marejesho ya 50% kati ya masaa 12-24</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-xl">
                  <X className="size-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-red-900 mb-1">Haiwezi Kurejeshwa</p>
                    <p className="text-sm text-red-700">Tiketi hii haiwezi kughairiwa au kurejeshwa pesa</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ID Requirements */}
          <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <IdCard className="size-5 text-indigo-600" />
              Mahitaji ya Kitambulisho
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <AlertCircle className="size-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Wananchi wa Tanzania</p>
                  <p className="text-sm text-gray-700">NIDA, Leseni ya Kuendesha, au Kitambulisho cha Kupiga Kura</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <Globe className="size-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Wageni</p>
                  <p className="text-sm text-gray-700">Pasipoti halali na Visa (ikiwa inahitajika)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-4 shadow-2xl z-20">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-600">Jumla ya Malipo</p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(selectedResult.price * searchParams.passengers)}</p>
                {selectedResult.originalPrice && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                    Okoa {formatCurrency((selectedResult.originalPrice - selectedResult.price) * searchParams.passengers)}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handleProceedToPassenger}
            className={`w-full py-4 rounded-2xl font-bold text-white text-lg bg-gradient-to-r ${config.color} shadow-xl hover:shadow-2xl transition-all active:scale-95`}
          >
            Endelea na Uhifadhi 🎫
          </button>
        </div>
      </div>
    );
  }

  // PASSENGER VIEW
  if (currentView === 'passenger') {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-20">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setCurrentView('details')} className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="size-6 text-gray-900" />
              </button>
              <div className="flex-1">
                <h1 className="text-lg font-bold text-gray-900">Taarifa za Abiria</h1>
                <p className="text-sm text-gray-500">Passenger Details</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Progress Steps */}
          <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${config.color} flex items-center justify-center text-white font-bold mb-2`}>
                  <Check className="size-6" />
                </div>
                <span className="text-xs font-semibold text-gray-900">Safari</span>
              </div>
              <div className="h-0.5 bg-green-500 flex-1 mx-2"></div>
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${config.color} flex items-center justify-center text-white font-bold mb-2`}>
                  2
                </div>
                <span className="text-xs font-semibold text-gray-900">Abiria</span>
              </div>
              <div className="h-0.5 bg-gray-300 flex-1 mx-2"></div>
              <div className="flex flex-col items-center flex-1">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold mb-2">
                  3
                </div>
                <span className="text-xs font-medium text-gray-500">Malipo</span>
              </div>
            </div>
          </div>

          {/* Quick Fill */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border-2 border-blue-200">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Sparkles className="size-5 text-blue-600" />
              Jaza Haraka
            </h3>
            <button className="w-full py-3 bg-white rounded-xl font-semibold text-gray-900 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
              <Users className="size-5 text-blue-600" />
              Tumia Taarifa za Akaunti Yangu
            </button>
          </div>

          {/* Passenger Forms */}
          {Array.from({ length: searchParams.passengers }).map((_, index) => (
            <div key={index} className="bg-white rounded-2xl p-5 shadow-lg border-2 border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">
                Abiria {index + 1} {index === 0 && '(Mkuu)'}
              </h3>

              <div className="space-y-4">
                {/* Names */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Jina la Kwanza</label>
                    <input
                      type="text"
                      placeholder="John"
                      defaultValue={index === 0 ? passengers[0]?.firstName : ''}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Jina la Mwisho</label>
                    <input
                      type="text"
                      placeholder="Doe"
                      defaultValue={index === 0 ? passengers[0]?.lastName : ''}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Namba ya Simu</label>
                  <input
                    type="tel"
                    placeholder="+255 XXX XXX XXX"
                    defaultValue={index === 0 ? passengers[0]?.phone : ''}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
                  />
                </div>

                {/* ID Type & Number */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Aina ya Kitambulisho</label>
                    <select className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all">
                      <option value="nida">NIDA</option>
                      <option value="passport">Pasipoti</option>
                      <option value="voter">Kitambulisho cha Kura</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Namba</label>
                    <input
                      type="text"
                      placeholder="XXXXXXXXX"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                {index === 0 && (
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Mawasiliano ya Dharura</label>
                    <input
                      type="tel"
                      placeholder="+255 XXX XXX XXX"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Important Notice */}
          <div className="bg-yellow-50 rounded-2xl p-5 border-2 border-yellow-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="size-6 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-yellow-900 mb-1">Kumbuka!</p>
                <p className="text-sm text-yellow-800">
                  Hakikisha majina yanafanana na kitambulisho chako. Majina yasiyofanana yanaweza kusababisha tiketi kukataliwa.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-4 shadow-2xl z-20">
          <button
            onClick={handleProceedToPayment}
            className={`w-full py-4 rounded-2xl font-bold text-white text-lg bg-gradient-to-r ${config.color} shadow-xl hover:shadow-2xl transition-all active:scale-95`}
          >
            Endelea na Malipo 💳
          </button>
        </div>
      </div>
    );
  }

  // PAYMENT VIEW
  if (currentView === 'payment') {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-20">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setCurrentView('passenger')} className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="size-6 text-gray-900" />
              </button>
              <div className="flex-1">
                <h1 className="text-lg font-bold text-gray-900">Njia ya Malipo</h1>
                <p className="text-sm text-gray-500">Payment Method</p>
              </div>
              <Shield className="size-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Progress Steps */}
          <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${config.color} flex items-center justify-center text-white font-bold mb-2`}>
                  <Check className="size-6" />
                </div>
                <span className="text-xs font-semibold text-gray-900">Safari</span>
              </div>
              <div className="h-0.5 bg-green-500 flex-1 mx-2"></div>
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${config.color} flex items-center justify-center text-white font-bold mb-2`}>
                  <Check className="size-6" />
                </div>
                <span className="text-xs font-semibold text-gray-900">Abiria</span>
              </div>
              <div className="h-0.5 bg-green-500 flex-1 mx-2"></div>
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${config.color} flex items-center justify-center text-white font-bold mb-2`}>
                  3
                </div>
                <span className="text-xs font-semibold text-gray-900">Malipo</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className={`bg-gradient-to-br ${config.color} rounded-3xl p-6 text-white shadow-2xl`}>
            <h3 className="font-bold text-lg mb-4 opacity-90">Muhtasari wa Oda</h3>
            <div className="space-y-3 mb-5">
              <div className="flex justify-between py-2 border-b border-white/20">
                <span className="opacity-90">Safari</span>
                <span className="font-bold">{searchParams.from?.nameSw} → {searchParams.to?.nameSw}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/20">
                <span className="opacity-90">Tarehe</span>
                <span className="font-bold">{new Date(searchParams.departDate).toLocaleDateString('sw-TZ', { month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/20">
                <span className="opacity-90">Abiria</span>
                <span className="font-bold">{searchParams.passengers}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/20">
                <span className="opacity-90">Bei kwa Abiria</span>
                <span className="font-bold">{formatCurrency(selectedResult?.price || 0)}</span>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 flex justify-between items-center">
              <span className="text-lg font-bold">JUMLA</span>
              <span className="text-3xl font-bold">{formatCurrency((selectedResult?.price || 0) * searchParams.passengers)}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900 text-lg px-1">Chagua Njia ya Malipo</h3>

            {/* GO Pay Wallet */}
            <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-5 shadow-xl border-2 border-green-400 hover:shadow-2xl transition-all text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Wallet className="size-8 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-lg mb-1">GO Pay Wallet</p>
                    <p className="text-sm opacity-90">Salio: {formatCurrency(user.balance)}</p>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-xs font-bold">Haraka</span>
                </div>
              </div>
            </button>

            {/* Mobile Money */}
            <button className="w-full bg-white rounded-2xl p-5 shadow-lg border-2 border-gray-200 hover:border-green-300 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                    <Phone className="size-7 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900 mb-1">Mobile Money</p>
                    <p className="text-sm text-gray-600">M-Pesa, Tigo, Airtel Money</p>
                  </div>
                </div>
                <ChevronRight className="size-6 text-gray-400" />
              </div>
            </button>

            {/* Bank Transfer */}
            <button className="w-full bg-white rounded-2xl p-5 shadow-lg border-2 border-gray-200 hover:border-green-300 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                    <Briefcase className="size-7 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900 mb-1">Benki</p>
                    <p className="text-sm text-gray-600">Uhamisho wa Benki Moja kwa Moja</p>
                  </div>
                </div>
                <ChevronRight className="size-6 text-gray-400" />
              </div>
            </button>

            {/* Card Payment */}
            <button className="w-full bg-white rounded-2xl p-5 shadow-lg border-2 border-gray-200 hover:border-green-300 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl flex items-center justify-center">
                    <CreditCard className="size-7 text-pink-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900 mb-1">Kadi ya Benki</p>
                    <p className="text-sm text-gray-600">Visa, Mastercard</p>
                  </div>
                </div>
                <ChevronRight className="size-6 text-gray-400" />
              </div>
            </button>
          </div>

          {/* Security Notice */}
          <div className="bg-green-50 rounded-2xl p-5 border-2 border-green-200">
            <div className="flex items-start gap-3">
              <Shield className="size-6 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-green-900 mb-1">Malipo Salama 100%</p>
                <p className="text-sm text-green-800">
                  Malipo yako yanafungwa kwa SSL encryption. Taarifa zako za kifedha ni salama kabisa.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-4 shadow-2xl z-20">
          <button
            onClick={handleConfirmPayment}
            className="w-full py-4 rounded-2xl font-bold text-white text-lg bg-gradient-to-r from-green-500 to-emerald-600 shadow-xl hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Shield className="size-6" />
            Thibitisha Malipo
          </button>
        </div>
      </div>
    );
  }

  // CONFIRMATION VIEW
  if (currentView === 'confirmation' && selectedBooking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        {/* Success Animation Area */}
        <div className="relative h-64 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600">
            <div className="absolute inset-0 opacity-20">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-white rounded-full animate-float-random"
                  style={{
                    width: `${Math.random() * 60 + 20}px`,
                    height: `${Math.random() * 60 + 20}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${Math.random() * 3 + 2}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Success Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 animate-bounce-in">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <Check className="size-12 text-green-600" strokeWidth={4} />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2 animate-slide-up">Malipo Yamefanikiwa!</h1>
            <p className="text-white/90 text-lg animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Payment Successful
            </p>
            <p className="text-white/80 text-sm mt-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Namba ya Kumbukumbu: {selectedBooking.reference}
            </p>
          </div>
        </div>

        <div className="px-4 -mt-6 pb-6 space-y-4">
          {/* Ticket Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100">
            {/* Ticket Header */}
            <div className={`bg-gradient-to-r ${config.color} p-6 text-white relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm opacity-80 mb-1">Tiketi Yako</p>
                    <h2 className="text-2xl font-bold">{selectedBooking.provider}</h2>
                  </div>
                  <div className="text-5xl">✈️</div>
                </div>
              </div>
            </div>

            {/* Dotted Separator */}
            <div className="relative h-8 bg-white">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-50 rounded-full -translate-x-1/2"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-50 rounded-full translate-x-1/2"></div>
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center gap-2">
                {[...Array(15)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-gray-300 rounded-full"></div>
                ))}
              </div>
            </div>

            {/* Journey Details */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="text-center flex-1">
                  <p className="text-xs text-gray-500 mb-1">KUTOKA</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{selectedBooking.time}</p>
                  <p className="text-lg font-bold text-gray-900">{selectedBooking.from}</p>
                </div>
                <div className="flex-1 px-4">
                  <div className="relative">
                    <div className="h-0.5 bg-gray-300"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Plane className="size-4 text-white rotate-90" />
                    </div>
                  </div>
                </div>
                <div className="text-center flex-1">
                  <p className="text-xs text-gray-500 mb-1">KWENDA</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">--:--</p>
                  <p className="text-lg font-bold text-gray-900">{selectedBooking.to}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-t-2 border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 mb-1">TAREHE</p>
                  <p className="font-bold text-gray-900">
                    {new Date(selectedBooking.date).toLocaleDateString('sw-TZ', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">ABIRIA</p>
                  <p className="font-bold text-gray-900">{selectedBooking.passengers}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">KUMBUKUMBU</p>
                  <p className="font-bold text-gray-900 font-mono">{selectedBooking.reference}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">JUMLA</p>
                  <p className="font-bold text-green-600">{formatCurrency(selectedBooking.amount)}</p>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 border-t-2 border-gray-100">
              <div className="bg-white p-6 rounded-2xl shadow-inner border-2 border-gray-200">
                <div className="w-48 h-48 mx-auto bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center">
                  <QrCode className="size-32 text-gray-600" />
                </div>
                <p className="text-center text-sm text-gray-600 mt-4 font-medium">
                  Onyesha QR hii kwa mfanyakazi
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-3">
            <button className="bg-white rounded-2xl p-4 shadow-lg border-2 border-gray-200 hover:border-green-300 hover:shadow-xl transition-all">
              <div className="w-12 h-12 mx-auto bg-blue-100 rounded-xl flex items-center justify-center mb-2">
                <Download className="size-6 text-blue-600" />
              </div>
              <p className="text-xs font-bold text-gray-900 text-center">Pakua PDF</p>
            </button>
            <button className="bg-white rounded-2xl p-4 shadow-lg border-2 border-gray-200 hover:border-green-300 hover:shadow-xl transition-all">
              <div className="w-12 h-12 mx-auto bg-green-100 rounded-xl flex items-center justify-center mb-2">
                <Share2 className="size-6 text-green-600" />
              </div>
              <p className="text-xs font-bold text-gray-900 text-center">Shiriki</p>
            </button>
            <button className="bg-white rounded-2xl p-4 shadow-lg border-2 border-gray-200 hover:border-green-300 hover:shadow-xl transition-all">
              <div className="w-12 h-12 mx-auto bg-purple-100 rounded-xl flex items-center justify-center mb-2">
                <Calendar className="size-6 text-purple-600" />
              </div>
              <p className="text-xs font-bold text-gray-900 text-center">Kalenda</p>
            </button>
          </div>

          {/* Offline Notice */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border-2 border-blue-200">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-xl">
                <Wifi className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-blue-900 mb-1">Inafanya Kazi Nje ya Mtandao</p>
                <p className="text-sm text-blue-800">
                  Tiketi yako imehifadhiwa kwenye kifaa chako. QR code inafanya kazi bila mtandao!
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleViewDashboard}
              className="py-4 rounded-2xl font-bold text-gray-900 bg-white border-2 border-gray-300 shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              Safari Zangu
            </button>
            <button
              onClick={() => {
                setCurrentView('search');
                setSelectedResult(null);
                setSelectedBooking(null);
              }}
              className={`py-4 rounded-2xl font-bold text-white bg-gradient-to-r ${config.color} shadow-xl hover:shadow-2xl transition-all active:scale-95`}
            >
              Safari Nyingine
            </button>
          </div>
        </div>
      </div>
    );
  }

  // DASHBOARD VIEW
  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-20">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setCurrentView('search')} className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="size-6 text-gray-900" />
              </button>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900">Safari Zangu</h1>
                <p className="text-sm text-gray-500">My Bookings</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Bell className="size-6 text-gray-600" />
              </button>
            </div>

            {/* Status Tabs */}
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-green-600 text-white rounded-xl font-semibold text-sm">
                Zijazo ({bookings.filter(b => b.status === 'upcoming').length})
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm">
                Zilizokwisha ({bookings.filter(b => b.status === 'completed').length})
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm">
                Zimeghairiwa ({bookings.filter(b => b.status === 'cancelled').length})
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {bookings.filter(b => b.status === 'upcoming').map((booking) => {
            const bookingConfig = serviceConfig[booking.service];
            const BookingIcon = bookingConfig.icon;
            
            return (
              <div key={booking.id} className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
                {/* Color Bar */}
                <div className={`h-2 bg-gradient-to-r ${bookingConfig.color}`}></div>
                
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`${bookingConfig.bgColor} p-3 rounded-xl`}>
                        <BookingIcon className={`size-6 ${bookingConfig.textColor}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{booking.provider}</h3>
                        <p className="text-sm text-gray-500 font-mono">{booking.reference}</p>
                      </div>
                    </div>
                    <div className="bg-green-100 px-3 py-1 rounded-full">
                      <span className="text-xs font-bold text-green-700">Imethibitishwa</span>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 text-center">
                      <p className="text-lg font-bold text-gray-900">{booking.from}</p>
                      <p className="text-xs text-gray-500 mt-1">{booking.time}</p>
                    </div>
                    <ChevronRight className="size-5 text-gray-400" />
                    <div className="flex-1 text-center">
                      <p className="text-lg font-bold text-gray-900">{booking.to}</p>
                      <p className="text-xs text-gray-500 mt-1">--:--</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-3 gap-3 py-3 border-t border-gray-100">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Tarehe</p>
                      <p className="text-sm font-bold text-gray-900">
                        {new Date(booking.date).toLocaleDateString('sw-TZ', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Abiria</p>
                      <p className="text-sm font-bold text-gray-900">{booking.passengers}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Kiasi</p>
                      <p className="text-sm font-bold text-green-600">{formatCurrency(booking.amount)}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
                    <button className="py-2 px-3 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors flex items-center justify-center gap-1">
                      <QrCode className="size-4" />
                      <span>Tiketi</span>
                    </button>
                    <button className="py-2 px-3 bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-1">
                      <Edit2 className="size-4" />
                      <span>Badili</span>
                    </button>
                    <button className="py-2 px-3 bg-red-50 text-red-700 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-1">
                      <X className="size-4" />
                      <span>Ghairi</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {bookings.filter(b => b.status === 'upcoming').length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="size-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Hakuna Safari Zijazo</h3>
              <p className="text-gray-600 mb-6">Anza kupanga safari yako ya kwanza!</p>
              <button
                onClick={() => setCurrentView('search')}
                className="py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              >
                Panga Safari
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
