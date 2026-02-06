import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { User } from '../App';
import { 
  Search, MapPin, ChevronRight, Clock, Star, Zap, Wallet, 
  CreditCard, Send, ShoppingBag, Plane, Gift, Settings, User as UserIcon,
  Bell, Heart, Home, Receipt, Smartphone, Droplet, Phone, Tv, TrendingUp,
  Tag, Percent, ShoppingCart, Package, Crown, Sparkles, BarChart3, Target, PieChart, UtensilsCrossed, Compass, Shield
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { LocationPicker } from './LocationPicker';
import { 
  getCurrentLocation, 
  getDefaultLocation, 
  loadSavedLocation, 
  type TanzaniaLocation 
} from '../utils/locationService';

interface UberDashboardProps {
  user: User;
  accessToken: string;
  onNavigate: (page: 'wallet' | 'payments' | 'billpayments' | 'merchant' | 'travel' | 'gosafari' | 'cards' | 'export' | 'transactions' | 'rewards' | 'shop' | 'international' | 'subscriptions' | 'shopping' | 'sendmoney' | 'qr' | 'merchantonboarding' | 'merchantdash' | 'admin' | 'security' | 'movies' | 'membership' | 'restaurants' | 'rides' | 'rentals' | 'profile' | 'notifications' | 'insights' | 'budget' | 'gofood' | 'promos' | 'tourism' | 'privacy' | 'governmentservices' | 'aiassistant' | 'emergencysos' | 'digitaladdress' | 'smebusinesssuite' | 'offlineqrpayment' | 'securitycenter') => void;
  onLogout: () => void;
}

export function UberDashboard({ user, accessToken, onNavigate, onLogout }: UberDashboardProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'services' | 'activity' | 'account'>('home');
  const [balance, setBalance] = useState({ balance: 450000, currency: 'TZS' });
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState<TanzaniaLocation | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  useEffect(() => {
    fetchBalance();
    // Load saved location or use default
    const saved = loadSavedLocation();
    if (saved) {
      setLocation(saved);
    } else {
      setLocation(getDefaultLocation());
    }
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/wallet/balance`,
        { headers: { 'Authorization': `Bearer ${accessToken}` } }
      );
      if (response.ok) {
        const data = await response.json();
        setBalance(data);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const quickActions = [
    { id: 'gofood', label: 'GoFood', icon: UtensilsCrossed, gradient: 'from-red-400 to-red-600', action: () => onNavigate('gofood') },
    { id: 'promos', label: 'Promos', icon: Tag, gradient: 'from-pink-400 to-pink-600', action: () => onNavigate('promos') },
    { id: 'bills', label: 'Pay Bills', icon: Zap, gradient: 'from-yellow-400 to-orange-600', action: () => onNavigate('billpayments') },
    { id: 'send', label: 'Send Money', icon: Send, gradient: 'from-purple-400 to-purple-600', action: () => onNavigate('sendmoney') },
  ];

  const categories = [
    { 
      id: 'food', 
      name: 'Food Delivery', 
      image: 'https://images.unsplash.com/photo-1644946763226-22c60fcb6635?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZGVsaXZlcnklMjByZXN0YXVyYW50fGVufDF8fHx8MTc2MzM1NDY2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      action: () => onNavigate('shopping') 
    },
    { 
      id: 'grocery', 
      name: 'Groceries', 
      image: 'https://images.unsplash.com/photo-1621244320421-cc9782f5ce28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm9jZXJ5JTIwc2hvcHBpbmclMjB2ZWdldGFibGVzfGVufDF8fHx8MTc2MzM1NDY2OHww&ixlib=rb-4.1.0&q=80&w=1080',
      action: () => onNavigate('shopping') 
    },
    { 
      id: 'pharmacy', 
      name: 'Pharmacy', 
      image: 'https://images.unsplash.com/photo-1758573467057-955f803660a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGFybWFjeSUyMG1lZGljaW5lJTIwc3RvcmV8ZW58MXx8fHwxNzYzMzU0NjY4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      action: () => onNavigate('shopping') 
    },
    { 
      id: 'shopping', 
      name: 'Shopping', 
      image: 'https://images.unsplash.com/photo-1595879171931-4ca27febc4bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9wcGluZyUyMG1hbGwlMjByZXRhaWx8ZW58MXx8fHwxNzYzMzU0NjY5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      action: () => onNavigate('shopping') 
    },
  ];

  const restaurants = [
    {
      id: 1,
      name: 'Pizza Paradise',
      cuisine: 'Italian, Pizza',
      rating: 4.8,
      deliveryTime: '20-30',
      distance: '1.2 km',
      image: 'https://images.unsplash.com/photo-1727198826083-6693684e4fc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHJlc3RhdXJhbnQlMjBmb29kfGVufDF8fHx8MTc2MzMwOTQ5Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      offer: 'Free delivery',
      promoted: true
    },
    {
      id: 2,
      name: 'Burger House',
      cuisine: 'American, Burgers',
      rating: 4.6,
      deliveryTime: '25-35',
      distance: '2.1 km',
      image: 'https://images.unsplash.com/photo-1656439659132-24c68e36b553?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBmYXN0JTIwZm9vZHxlbnwxfHx8fDE3NjMzMzc3MTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      offer: '20% OFF',
      promoted: false
    },
    {
      id: 3,
      name: 'Sushi Master',
      cuisine: 'Japanese, Sushi',
      rating: 4.9,
      deliveryTime: '30-40',
      distance: '3.5 km',
      image: 'https://images.unsplash.com/photo-1681270518020-85debeac14ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMGphcGFuZXNlJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NjMyNDU3MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      offer: null,
      promoted: false
    },
    {
      id: 4,
      name: 'Coffee Central',
      cuisine: 'Cafe, Coffee & Tea',
      rating: 4.7,
      deliveryTime: '15-25',
      distance: '0.8 km',
      image: 'https://images.unsplash.com/photo-1604552584409-44de624c9f57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwY2FmZXxlbnwxfHx8fDE3NjMzMzA1MzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      offer: '1+1 Free',
      promoted: true
    },
    {
      id: 5,
      name: 'Nyama Choma House',
      cuisine: 'African, Grilled',
      rating: 4.5,
      deliveryTime: '35-45',
      distance: '4.2 km',
      image: 'https://images.unsplash.com/photo-1609792790758-0994786ad983?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwcmVzdGF1cmFudCUyMGZvb2R8ZW58MXx8fHwxNzYzMzI3MzcwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      offer: null,
      promoted: false
    },
    {
      id: 6,
      name: 'Street Food Market',
      cuisine: 'Asian, Street Food',
      rating: 4.4,
      deliveryTime: '20-30',
      distance: '1.5 km',
      image: 'https://images.unsplash.com/photo-1610679260160-4bbb94d711bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHN0cmVldCUyMGZvb2R8ZW58MXx8fHwxNzYzMjczNzkyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      offer: 'Free delivery',
      promoted: false
    },
  ];

  const featuredServices = [
    {
      id: 'travel',
      title: 'Book Flights',
      subtitle: 'Domestic & International',
      image: 'https://images.unsplash.com/photo-1574444851660-e549a835d4ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbGlnaHQlMjBhaXJwbGFuZSUyMHRyYXZlbHxlbnwxfHx8fDE3NjMzNTQ2NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      badge: 'Best Prices',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'dessert',
      title: 'Sweet Treats',
      subtitle: 'Cakes, Ice Cream & More',
      image: 'https://images.unsplash.com/photo-1706463996554-6c6318946b3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwY2FrZSUyMGJha2VyeXxlbnwxfHx8fDE3NjMzNTQ2NzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      badge: '20% OFF',
      color: 'from-pink-500 to-pink-600'
    },
  ];

  const billProviders = [
    { id: 'tanesco', name: 'TANESCO', icon: Zap, color: 'bg-yellow-500' },
    { id: 'dawasco', name: 'DAWASCO', icon: Droplet, color: 'bg-blue-500' },
    { id: 'vodacom', name: 'Vodacom', icon: Phone, color: 'bg-red-500' },
    { id: 'dstv', name: 'DStv', icon: Tv, color: 'bg-blue-600' },
  ];

  if (activeTab === 'home') {
    return (
      <div className="min-h-screen bg-white pb-24">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100">
          <div className="px-4 pt-4 pb-3">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Good morning</p>
                <h1 className="text-2xl font-semibold text-gray-900">{user.name.split(' ')[0]}</h1>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onNavigate('notifications')}
                  className="relative p-2 hover:bg-gray-100 rounded-full transition-all"
                >
                  <Bell className="size-6 text-gray-900" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>
                <button 
                  onClick={() => onNavigate('security')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all"
                >
                  <Settings className="size-6 text-gray-900" />
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for food, groceries, bills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-4 bg-gray-100 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* Location */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
            <button
              onClick={() => setShowLocationPicker(true)}
              className="flex items-center gap-2 w-full"
            >
              <MapPin className="size-5 text-black" />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-900">{location?.ward || 'Masaki'}</p>
                <p className="text-xs text-gray-600">{location?.district || 'Kinondoni'}, {location?.region || 'Dar es Salaam'}</p>
              </div>
              <ChevronRight className="size-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Location Picker Modal */}
        {showLocationPicker && (
          <LocationPicker
            onLocationSelect={(loc) => {
              setLocation(loc);
              setShowLocationPicker(false);
            }}
            onClose={() => setShowLocationPicker(false)}
          />
        )}

        {/* Wallet Card */}
        <div className="px-4 py-6 space-y-4">
          {/* Membership Upgrade Banner - New Sophisticated Design */}
          <button
            onClick={() => onNavigate('membership')}
            className="w-full bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 text-white rounded-3xl p-6 shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all relative overflow-hidden group"
          >
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16 group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent" />
            
            <div className="relative flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-yellow-400/20 backdrop-blur-sm rounded-full p-1.5">
                    <Crown className="size-5 text-yellow-300" />
                  </div>
                  <span className="text-xs font-bold tracking-wider opacity-95">PREMIUM ACCESS</span>
                </div>
                <h3 className="text-2xl font-bold mb-2 leading-tight">Unlock goPay Plus</h3>
                <p className="text-sm opacity-95 mb-3 leading-relaxed">
                  5% cashback • Zero fees • Priority support • Exclusive deals
                </p>
                <div className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full inline-flex items-center gap-2 text-sm font-bold border border-white/10">
                  <Sparkles className="size-4" />
                  <span>TZS 9,900/mo</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 group-hover:bg-white/30 transition-colors">
                  <ChevronRight className="size-7" />
                </div>
              </div>
            </div>
          </button>

          <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="size-5 text-green-100" />
                  <p className="text-green-100 text-sm">goPay Balance</p>
                </div>
                <p className="text-4xl font-bold mb-1">{formatCurrency(balance.balance)}</p>
                <p className="text-green-100 text-xs">Available balance</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => onNavigate('wallet')}
                className="flex-1 bg-white text-green-700 py-3.5 rounded-full font-bold hover:bg-green-50 transition-all flex items-center justify-center gap-2"
              >
                <CreditCard className="size-5" />
                Add Money
              </button>
              <button
                onClick={() => onNavigate('sendmoney')}
                className="flex-1 bg-green-500/30 backdrop-blur-sm text-white py-3.5 rounded-full font-bold hover:bg-green-500/40 transition-all flex items-center justify-center gap-2 border border-white/20"
              >
                <Send className="size-5" />
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 pb-6">
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={action.action}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${action.gradient} rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform`}>
                    <IconComponent className="size-8 text-white" />
                  </div>
                  <span className="text-xs text-gray-700 text-center">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories */}
        <div className="px-4 pb-6">
          <h2 className="text-xl font-bold mb-4">Categories</h2>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={cat.action}
                className="relative rounded-2xl overflow-hidden hover:shadow-xl transition-all h-32"
              >
                <ImageWithFallback 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <p className="font-bold text-lg mb-1">{cat.name}</p>
                  <div className="flex items-center gap-1">
                    <Clock className="size-3" />
                    <span className="text-xs">30-45 min</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Restaurants Near You */}
        <div className="px-4 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Restaurants near you</h2>
            <button onClick={() => onNavigate('shopping')} className="text-sm font-semibold">See all</button>
          </div>
          <div className="space-y-3">
            {restaurants.map((restaurant) => (
              <button
                key={restaurant.id}
                onClick={() => onNavigate('shopping')}
                className="w-full bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100"
              >
                <div className="relative h-48">
                  <ImageWithFallback 
                    src={restaurant.image} 
                    alt={restaurant.name} 
                    className="w-full h-full object-cover"
                  />
                  {restaurant.promoted && (
                    <div className="absolute top-3 left-3 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                      <TrendingUp className="size-3" />
                      Promoted
                    </div>
                  )}
                  {restaurant.offer && (
                    <div className="absolute top-3 right-3 bg-white text-black text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">
                      {restaurant.offer}
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                    <Heart className="size-4 text-gray-400" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{restaurant.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{restaurant.cuisine}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Star className="size-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{restaurant.rating}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="size-4" />
                          <span>{restaurant.deliveryTime} min</span>
                        </div>
                        <span>•</span>
                        <span>{restaurant.distance}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Services */}
        <div className="px-4 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Featured</h2>
            <button
              onClick={() => onNavigate('shopping')}
              className="text-sm font-semibold"
            >
              See all
            </button>
          </div>
          <div className="space-y-3">
            {featuredServices.map((service) => (
              <button
                key={service.id}
                onClick={() => onNavigate(service.id === 'travel' ? 'travel' : 'shopping')}
                className="w-full bg-white rounded-2xl shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-100"
              >
                <div className="relative h-40">
                  <ImageWithFallback 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {service.badge && (
                    <div className="absolute top-3 right-3 bg-white text-black text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">
                      {service.badge}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{service.title}</h3>
                      <p className="text-sm text-gray-600">{service.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Star className="size-4 fill-yellow-400 text-yellow-400" />
                    <span>4.8</span>
                    <span>•</span>
                    <span>1.2k ratings</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Pay Bills */}
        <div className="px-4 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Pay Bills</h2>
            <button
              onClick={() => onNavigate('billpayments')}
              className="text-sm font-semibold"
            >
              See all
            </button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {billProviders.map((provider) => {
              const ProviderIcon = provider.icon;
              return (
                <button
                  key={provider.id}
                  onClick={() => onNavigate('billpayments')}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={`${provider.color} w-16 h-16 rounded-2xl flex items-center justify-center shadow-md hover:shadow-lg transition-all`}>
                    <ProviderIcon className="size-8 text-white" />
                  </div>
                  <span className="text-xs text-gray-700 text-center">{provider.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Promotions */}
        <div className="px-4 pb-6">
          <h2 className="text-xl font-bold mb-4">Deals for you</h2>
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-sm opacity-90 mb-1">Limited Offer</p>
                <h3 className="text-2xl font-bold mb-2">Get 10% Cashback</h3>
                <p className="text-sm opacity-90 mb-4">On all shopping & food orders this week</p>
                <button
                  onClick={() => onNavigate('shopping')}
                  className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-all"
                >
                  Shop Now
                </button>
              </div>
              <Gift className="size-12 opacity-50" />
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
          <div className="grid grid-cols-4 px-2 py-3">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 py-2 ${activeTab === 'home' ? 'text-black' : 'text-gray-400'}`}
            >
              <Home className={`size-6 ${activeTab === 'home' ? 'fill-black' : ''}`} />
              <span className="text-xs font-medium">Home</span>
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`flex flex-col items-center gap-1 py-2 ${activeTab === 'services' ? 'text-black' : 'text-gray-400'}`}
            >
              <ShoppingBag className="size-6" />
              <span className="text-xs font-medium">Services</span>
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`flex flex-col items-center gap-1 py-2 ${activeTab === 'activity' ? 'text-black' : 'text-gray-400'}`}
            >
              <Receipt className="size-6" />
              <span className="text-xs font-medium">Activity</span>
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className={`flex flex-col items-center gap-1 py-2 ${activeTab === 'account' ? 'text-black' : 'text-gray-400'}`}
            >
              <UserIcon className="size-6" />
              <span className="text-xs font-medium">Account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'services') {
    return (
      <div className="min-h-screen bg-white pb-24">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <h1 className="text-2xl font-bold mb-4">All Services</h1>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              className="w-full h-12 pl-12 pr-4 bg-gray-100 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Shopping */}
          <div>
            <h2 className="text-lg font-bold mb-3">Shopping & Delivery</h2>
            <div className="space-y-3">
              <button
                onClick={() => onNavigate('shopping')}
                className="w-full bg-gray-50 rounded-2xl p-4 flex items-center gap-4 hover:bg-gray-100 transition-all"
              >
                <div className="bg-gradient-to-br from-orange-400 to-orange-600 w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  🛒
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900">Jumia & Kilimall</p>
                  <p className="text-sm text-gray-500">Electronics, Fashion, Home</p>
                </div>
                <ChevronRight className="size-5 text-gray-400 flex-shrink-0" />
              </button>
              <button
                onClick={() => onNavigate('shopping')}
                className="w-full bg-gray-50 rounded-2xl p-4 flex items-center gap-4 hover:bg-gray-100 transition-all"
              >
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  🍔
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900">Food Delivery</p>
                  <p className="text-sm text-gray-500">Glovo, Uber Eats, Yummy</p>
                </div>
                <ChevronRight className="size-5 text-gray-400 flex-shrink-0" />
              </button>
            </div>
          </div>

          {/* Travel */}
          <div>
            <h2 className="text-lg font-bold mb-3">Travel & Transportation</h2>
            <div className="space-y-3">
              <button
                onClick={() => onNavigate('rides')}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-4 flex items-center gap-4 hover:from-green-700 hover:to-emerald-700 transition-all shadow-md"
              >
                <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-xl flex items-center justify-center text-2xl">
                  🏍️
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold">Book a Ride</p>
                  <p className="text-xs opacity-90">Boda Boda, Cars, Eco-friendly</p>
                </div>
                <ChevronRight className="size-5" />
              </button>
              <button
                onClick={() => onNavigate('rentals')}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-4 flex items-center gap-4 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
              >
                <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-xl flex items-center justify-center text-2xl">
                  🚗
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold">Car Rental</p>
                  <p className="text-xs opacity-90">Daily, weekly, monthly rentals</p>
                </div>
                <ChevronRight className="size-5" />
              </button>
              <button
                onClick={() => onNavigate('travel')}
                className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 rounded-2xl p-4 flex items-center gap-4 hover:from-yellow-500 hover:to-amber-600 transition-all shadow-md"
              >
                <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  ✈️
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-gray-900">Book Travel</p>
                  <p className="text-xs text-gray-900 opacity-80">Flights, Bus, Ferry, Hotels</p>
                </div>
                <ChevronRight className="size-5 text-gray-900 flex-shrink-0" />
              </button>
              <button
                onClick={() => onNavigate('movies')}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-4 flex items-center gap-4 hover:from-purple-600 hover:to-purple-700 transition-all shadow-md"
              >
                <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-xl flex items-center justify-center text-2xl">
                  🎬
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold">Movie Tickets</p>
                  <p className="text-xs opacity-90">Century Cinemax & Theaters</p>
                </div>
                <ChevronRight className="size-5" />
              </button>
              <button
                onClick={() => onNavigate('restaurants')}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-4 flex items-center gap-4 hover:from-orange-600 hover:to-red-600 transition-all shadow-md"
              >
                <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-xl flex items-center justify-center text-2xl">
                  🍽️
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold">Restaurants & Bars</p>
                  <p className="text-xs opacity-90">Book tables & discover dining</p>
                </div>
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>

          {/* Bills */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Bills & Payments</h2>
            <button
              onClick={() => onNavigate('billpayments')}
              className="w-full bg-gray-50 rounded-2xl p-4 flex items-center gap-4 hover:bg-gray-100 transition-all"
            >
              <div className="bg-gradient-to-br from-yellow-400 to-orange-600 w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                ⚡
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900">Pay Bills</p>
                <p className="text-sm text-gray-500">Electricity, Water, TV, Mobile</p>
              </div>
              <ChevronRight className="size-5 text-gray-400 flex-shrink-0" />
            </button>
          </div>

          {/* Money */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Money Transfer</h2>
            <button
              onClick={() => onNavigate('sendmoney')}
              className="w-full bg-gray-50 rounded-2xl p-4 flex items-center gap-4 hover:bg-gray-100 transition-all"
            >
              <div className="bg-gradient-to-br from-purple-400 to-purple-600 w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                💸
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900">Send Money</p>
                <p className="text-sm text-gray-500">To friends & family</p>
              </div>
              <ChevronRight className="size-5 text-gray-400 flex-shrink-0" />
            </button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
          <div className="grid grid-cols-4 px-2 py-3">
            <button
              onClick={() => setActiveTab('home')}
              className="flex flex-col items-center gap-1 py-2 text-gray-400"
            >
              <Home className="size-6" />
              <span className="text-xs font-medium">Home</span>
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className="flex flex-col items-center gap-1 py-2 text-black"
            >
              <ShoppingBag className="size-6" />
              <span className="text-xs font-medium">Services</span>
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className="flex flex-col items-center gap-1 py-2 text-gray-400"
            >
              <Receipt className="size-6" />
              <span className="text-xs font-medium">Activity</span>
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className="flex flex-col items-center gap-1 py-2 text-gray-400"
            >
              <UserIcon className="size-6" />
              <span className="text-xs font-medium">Account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'activity') {
    return (
      <div className="min-h-screen bg-white pb-24">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <h1 className="text-2xl font-bold">Activity</h1>
        </div>

        <div className="px-4 py-6">
          <div className="bg-gray-50 rounded-2xl p-12 text-center">
            <Receipt className="size-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No recent activity</p>
            <p className="text-sm text-gray-400 mt-1">Your transactions will appear here</p>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
          <div className="grid grid-cols-4 px-2 py-3">
            <button
              onClick={() => setActiveTab('home')}
              className="flex flex-col items-center gap-1 py-2 text-gray-400"
            >
              <Home className="size-6" />
              <span className="text-xs font-medium">Home</span>
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className="flex flex-col items-center gap-1 py-2 text-gray-400"
            >
              <ShoppingBag className="size-6" />
              <span className="text-xs font-medium">Services</span>
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className="flex flex-col items-center gap-1 py-2 text-black"
            >
              <Receipt className="size-6" />
              <span className="text-xs font-medium">Activity</span>
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className="flex flex-col items-center gap-1 py-2 text-gray-400"
            >
              <UserIcon className="size-6" />
              <span className="text-xs font-medium">Account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Account Tab
  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
        <h1 className="text-2xl font-bold">Account</h1>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Profile */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-3xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-gray-500">{user.phone}</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-2">
          <button
            onClick={() => onNavigate('wallet')}
            className="w-full bg-gray-50 rounded-2xl p-4 flex items-center justify-between hover:bg-gray-100 transition-all"
          >
            <div className="flex items-center gap-3">
              <Wallet className="size-6" />
              <span className="font-semibold">Wallet</span>
            </div>
            <ChevronRight className="size-5 text-gray-400" />
          </button>
          <button
            onClick={() => onNavigate('cards')}
            className="w-full bg-gray-50 rounded-2xl p-4 flex items-center justify-between hover:bg-gray-100 transition-all"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="size-6" />
              <span className="font-semibold">Payment Methods</span>
            </div>
            <ChevronRight className="size-5 text-gray-400" />
          </button>
          <button
            onClick={() => onNavigate('rewards')}
            className="w-full bg-gray-50 rounded-2xl p-4 flex items-center justify-between hover:bg-gray-100 transition-all"
          >
            <div className="flex items-center gap-3">
              <Gift className="size-6" />
              <span className="font-semibold">Rewards</span>
            </div>
            <ChevronRight className="size-5 text-gray-400" />
          </button>
        </div>

        {/* Financial Tools */}
        <div>
          <h3 className="text-lg font-bold mb-3">Financial Tools</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigate('insights')}
              className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-4 hover:from-purple-600 hover:to-purple-700 transition-all shadow-md"
            >
              <BarChart3 className="size-8 mb-2" />
              <p className="font-bold text-sm">Spending Insights</p>
              <p className="text-xs opacity-90 mt-1">Analytics & trends</p>
            </button>
            <button
              onClick={() => onNavigate('budget')}
              className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl p-4 hover:from-amber-600 hover:to-orange-700 transition-all shadow-md"
            >
              <Target className="size-8 mb-2" />
              <p className="font-bold text-sm">Budget Tracker</p>
              <p className="text-xs opacity-90 mt-1">Set & monitor goals</p>
            </button>
          </div>
        </div>

        {/* Tourism & Travel */}
        <div>
          <h3 className="text-lg font-bold mb-3">Discover Tanzania</h3>
          <button
            onClick={() => onNavigate('tourism')}
            className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-2xl p-4 flex items-center justify-between hover:from-green-600 hover:to-teal-700 transition-all shadow-md"
          >
            <div className="flex items-center gap-3">
              <Compass className="size-6" />
              <div className="text-left">
                <p className="font-bold">Tourism & POIs</p>
                <p className="text-xs opacity-90">Explore attractions & offline maps</p>
              </div>
            </div>
            <ChevronRight className="size-5" />
          </button>
        </div>

        {/* Settings */}
        <div>
          <h3 className="text-lg font-bold mb-3">Business</h3>
          <div className="space-y-2">
            <button
              onClick={() => onNavigate('merchantonboarding')}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-4 flex items-center justify-between hover:from-green-600 hover:to-green-700 transition-all shadow-md"
            >
              <div className="flex items-center gap-3">
                <Package className="size-6" />
                <div className="text-left">
                  <p className="font-bold">Become a Merchant</p>
                  <p className="text-xs opacity-90">Sell on goPay & grow your business</p>
                </div>
              </div>
              <ChevronRight className="size-5" />
            </button>
            <button
              onClick={() => onNavigate('merchantdash')}
              className="w-full bg-gray-50 rounded-2xl p-4 flex items-center justify-between hover:bg-gray-100 transition-all"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="size-6" />
                <span className="font-medium">Merchant Dashboard</span>
              </div>
              <ChevronRight className="size-5 text-gray-400" />
            </button>
            <button
              onClick={() => onNavigate('admin')}
              className="w-full bg-gray-50 rounded-2xl p-4 flex items-center justify-between hover:bg-gray-100 transition-all"
            >
              <div className="flex items-center gap-3">
                <Settings className="size-6" />
                <span className="font-medium">Admin Verification</span>
              </div>
              <ChevronRight className="size-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Settings */}
        <div>
          <h3 className="text-lg font-bold mb-3">Settings</h3>
          <div className="space-y-2">
            <button
              onClick={() => onNavigate('securitycenter')}
              className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-2xl p-4 flex items-center justify-between hover:from-red-600 hover:to-rose-700 transition-all shadow-md"
            >
              <div className="flex items-center gap-3">
                <Shield className="size-6" />
                <div className="text-left">
                  <p className="font-bold">Security Center</p>
                  <p className="text-xs opacity-90">Bank-grade protection & fraud detection</p>
                </div>
              </div>
              <ChevronRight className="size-5" />
            </button>
            <button
              onClick={() => onNavigate('security')}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-4 flex items-center justify-between hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
            >
              <div className="flex items-center gap-3">
                <Settings className="size-6" />
                <div className="text-left">
                  <p className="font-bold">Security Settings</p>
                  <p className="text-xs opacity-90">2FA, Biometric, PIN</p>
                </div>
              </div>
              <ChevronRight className="size-5" />
            </button>
            <button 
              onClick={() => onNavigate('privacy')}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-4 flex items-center justify-between hover:from-green-600 hover:to-emerald-700 transition-all shadow-md"
            >
              <div className="flex items-center gap-3">
                <Shield className="size-6" />
                <div className="text-left">
                  <p className="font-bold">Privacy & Location</p>
                  <p className="text-xs opacity-90">Manage your data & permissions</p>
                </div>
              </div>
              <ChevronRight className="size-5" />
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="w-full bg-gray-50 rounded-2xl p-4 flex items-center justify-between hover:bg-gray-100 transition-all"
            >
              <span className="font-medium">Notifications</span>
              <ChevronRight className="size-5 text-gray-400" />
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="w-full bg-gray-50 rounded-2xl p-4 flex items-center justify-between hover:bg-gray-100 transition-all"
            >
              <span className="font-medium">Help & Support</span>
              <ChevronRight className="size-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={onLogout}
          className="w-full bg-gray-50 rounded-2xl p-4 text-red-600 font-semibold hover:bg-gray-100 transition-all"
        >
          Sign Out
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="grid grid-cols-4 px-2 py-3">
          <button
            onClick={() => setActiveTab('home')}
            className="flex flex-col items-center gap-1 py-2 text-gray-400"
          >
            <Home className="size-6" />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className="flex flex-col items-center gap-1 py-2 text-gray-400"
          >
            <ShoppingBag className="size-6" />
            <span className="text-xs font-medium">Services</span>
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className="flex flex-col items-center gap-1 py-2 text-gray-400"
          >
            <Receipt className="size-6" />
            <span className="text-xs font-medium">Activity</span>
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className="flex flex-col items-center gap-1 py-2 text-black"
          >
            <UserIcon className="size-6" />
            <span className="text-xs font-medium">Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}