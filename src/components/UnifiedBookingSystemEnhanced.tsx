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
import { projectId, publicAnonKey } from '../utils/supabase/info';
import * as kv from '../supabase/functions/server/kv_store';

type BookingService = 'flights' | 'buses' | 'sgr' | 'hotels' | 'parks';
type TravelClass = 'economy' | 'business' | 'first' | 'vip' | 'luxury';

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

interface UnifiedBookingSystemProps {
  user: User;
  onBack: () => void;
  initialService?: BookingService;
}

export function UnifiedBookingSystemEnhanced({ user, onBack, initialService = 'flights' }: UnifiedBookingSystemProps) {
  const [currentService, setCurrentService] = useState<BookingService>(initialService);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showLocationPicker, setShowLocationPicker] = useState<'from' | 'to' | null>(null);

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

  const config = serviceConfig[currentService];

  const handleSearch = () => {
    console.log('Searching with params:', searchParams);
    // Navigate to results view
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pb-20">
      {/* Header - Enhanced */}
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

          {/* Service Tabs - Enhanced */}
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

      {/* Offline Message - Enhanced */}
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
                  from: locations[0], // Dar es Salaam
                  to: locations[5], // Zanzibar
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
                  from: locations[0], // Dar
                  to: locations[2], // Arusha
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

        {/* Trip Type - Enhanced */}
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

        {/* From / To Locations - Enhanced */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 overflow-hidden">
          {/* From */}
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

          {/* Swap Button - Enhanced */}
          <div className="relative h-0 flex justify-center">
            <button className={`absolute -top-7 bg-gradient-to-r ${config.color} p-4 rounded-2xl shadow-2xl hover:scale-110 hover:rotate-180 transition-all z-10 border-4 border-white`}>
              <ArrowLeft className="size-6 text-white rotate-90" />
            </button>
          </div>

          {/* To */}
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

        {/* Date Selection - Enhanced */}
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
            <div className="bg-white rounded-2xl p-5 shadow-xl border-2 border-gray-100 hover:border-green-300 transition-colors animate-slide-up">
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

        {/* Passengers & Class - Enhanced */}
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

        {/* Search Button - Enhanced */}
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

        {/* Trust Badges - Enhanced */}
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

      {/* Location Picker Modal - Enhanced */}
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
              {/* Category Headers */}
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
              
              {/* National Parks Section */}
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