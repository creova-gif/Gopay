import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Search,
  ChevronRight,
  Star,
  Zap,
  TrendingUp,
  Clock,
  MapPin,
  Send,
  CreditCard,
  Receipt,
  Wallet,
  Plane,
  Bus,
  Hotel,
  Ship,
  ShoppingBag,
  Utensils,
  Film,
  Gamepad2,
  Building2,
  FileText,
  Shield,
  GraduationCap,
  Store,
  BarChart3,
  Users,
  Package,
} from 'lucide-react';

interface ServicesHubProps {
  onBack: () => void;
  onNavigate: (service: string) => void;
  userContext?: {
    location?: string;
    recentServices?: string[];
    membershipTier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  };
}

interface Service {
  id: string;
  name: string;
  nameSwahili: string;
  description: string;
  icon: React.ElementType;
  color: string;
  category: 'pay' | 'travel' | 'lifestyle' | 'government' | 'business';
  popular?: boolean;
  new?: boolean;
  featured?: boolean;
  route: string;
}

const ALL_SERVICES: Service[] = [
  // PAY
  { id: 'send-money', name: 'Send Money', nameSwahili: 'Tuma Pesa', description: 'Instant money transfers', icon: Send, color: 'from-emerald-600 to-green-600', category: 'pay', popular: true, route: 'sendmoney' },
  { id: 'bill-payments', name: 'Pay Bills', nameSwahili: 'Lipa Bili', description: 'TANESCO, DAWASCO, TV & more', icon: Receipt, color: 'from-blue-600 to-cyan-600', category: 'pay', popular: true, route: 'billpayments' },
  { id: 'merchant-payments', name: 'Merchant QR', nameSwahili: 'Lipa Duka', description: 'Scan & pay at stores', icon: Store, color: 'from-purple-600 to-pink-600', category: 'pay', featured: true, route: 'merchant' },
  { id: 'group-money', name: 'Group Collections', nameSwahili: 'Vikundi', description: 'Pool money for trips & events', icon: Users, color: 'from-teal-600 to-emerald-600', category: 'pay', new: true, route: 'groupmoney' },
  { id: 'multicurrency', name: 'Multi-Currency', nameSwahili: 'Sarafu Nyingi', description: 'USD, EUR, KES & more', icon: CreditCard, color: 'from-orange-600 to-red-600', category: 'pay', route: 'multicurrencywallet' },

  // TRAVEL
  { id: 'flights', name: 'Book Flights', nameSwahili: 'Ndege', description: 'Domestic & international', icon: Plane, color: 'from-sky-500 to-blue-600', category: 'travel', popular: true, route: 'travel' },
  { id: 'buses', name: 'Bus Tickets', nameSwahili: 'Mabasi', description: 'All routes across Tanzania', icon: Bus, color: 'from-green-500 to-emerald-600', category: 'travel', featured: true, route: 'travel' },
  { id: 'hotels', name: 'Hotels', nameSwahili: 'Hoteli', description: 'Book accommodations', icon: Hotel, color: 'from-purple-500 to-purple-600', category: 'travel', route: 'travel' },
  { id: 'ferry', name: 'Ferry Booking', nameSwahili: 'Feri', description: 'Zanzibar, Pemba & more', icon: Ship, color: 'from-cyan-500 to-teal-600', category: 'travel', route: 'ferrybooking' },
  { id: 'rides', name: 'Ride Hailing', nameSwahili: 'Teksi', description: 'Book taxis & motorcycles', icon: MapPin, color: 'from-yellow-500 to-orange-600', category: 'travel', new: true, route: 'rides' },
  { id: 'car-rental', name: 'Car Rental', nameSwahili: 'Kodi Gari', description: 'Rent vehicles', icon: Package, color: 'from-red-500 to-pink-600', category: 'travel', route: 'rentals' },

  // LIFESTYLE
  { id: 'food-delivery', name: 'Food Delivery', nameSwahili: 'Chakula', description: 'Order from restaurants', icon: Utensils, color: 'from-orange-500 to-red-600', category: 'lifestyle', popular: true, route: 'gofood' },
  { id: 'restaurants', name: 'Restaurants', nameSwahili: 'Mikahawa', description: 'Reserve tables', icon: Utensils, color: 'from-pink-500 to-rose-600', category: 'lifestyle', route: 'restaurants' },
  { id: 'movies', name: 'Movie Tickets', nameSwahili: 'Sinema', description: 'Book cinema seats', icon: Film, color: 'from-indigo-500 to-purple-600', category: 'lifestyle', route: 'movies' },
  { id: 'shopping', name: 'Shop Online', nameSwahili: 'Nunua', description: 'Browse local stores', icon: ShoppingBag, color: 'from-blue-500 to-indigo-600', category: 'lifestyle', route: 'shopping' },
  { id: 'subscriptions', name: 'Subscriptions', nameSwahili: 'Michango', description: 'Manage recurring payments', icon: Clock, color: 'from-green-500 to-teal-600', category: 'lifestyle', route: 'subscriptions' },

  // GOVERNMENT
  { id: 'government-services', name: 'Gov Services', nameSwahili: 'Serikali', description: 'NIDA, TRA, licenses & more', icon: Building2, color: 'from-blue-600 to-blue-700', category: 'government', featured: true, route: 'governmentservices' },
  { id: 'school-fees', name: 'School Fees', nameSwahili: 'Ada za Shule', description: 'Pay education fees', icon: GraduationCap, color: 'from-orange-600 to-amber-600', category: 'government', route: 'governmentservices' },

  // BUSINESS
  { id: 'merchant-dashboard', name: 'Merchant Tools', nameSwahili: 'Biashara', description: 'Accept payments, track sales', icon: BarChart3, color: 'from-purple-600 to-purple-700', category: 'business', route: 'merchantdash' },
  { id: 'sme-suite', name: 'SME Suite', nameSwahili: 'Zana za Biashara', description: 'Business management tools', icon: Store, color: 'from-emerald-600 to-teal-700', category: 'business', route: 'smebusinesssuite' },
];

const CATEGORY_INFO = {
  pay:        { name: 'Lipa',      nameEn: 'Payments',   icon: Wallet,    activeClass: 'bg-emerald-600' },
  travel:     { name: 'Safari',    nameEn: 'Travel',      icon: Plane,     activeClass: 'bg-sky-600' },
  lifestyle:  { name: 'Ishi',      nameEn: 'Lifestyle',   icon: ShoppingBag, activeClass: 'bg-purple-600' },
  government: { name: 'Serikali',  nameEn: 'Government',  icon: Building2, activeClass: 'bg-blue-600' },
  business:   { name: 'Biashara',  nameEn: 'Business',    icon: Store,     activeClass: 'bg-orange-600' },
} as const;

export function ServicesHub({ onBack, onNavigate, userContext }: ServicesHubProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [recentServices, setRecentServices] = useState<string[]>([]);

  useEffect(() => {
    if (userContext?.recentServices) {
      setRecentServices(userContext.recentServices);
    } else {
      const saved = localStorage.getItem('recent-services');
      if (saved) setRecentServices(JSON.parse(saved));
    }
  }, []);

  const filteredServices = ALL_SERVICES.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.nameSwahili.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q);
    const matchCat = selectedCategory === 'all' || s.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const featuredServices = ALL_SERVICES.filter((s) => s.featured);
  const popularServices = ALL_SERVICES.filter((s) => s.popular);
  const newServices = ALL_SERVICES.filter((s) => s.new);
  const recentServiceObjects = ALL_SERVICES.filter((s) => recentServices.includes(s.id));

  const handleServiceClick = (serviceId: string, route: string) => {
    const updated = [serviceId, ...recentServices.filter((id) => id !== serviceId)].slice(0, 6);
    setRecentServices(updated);
    localStorage.setItem('recent-services', JSON.stringify(updated));
    onNavigate(route);
  };

  const showDefault = selectedCategory === 'all' && !searchQuery;

  return (
    <div className="min-h-screen bg-[#080d08] text-white">
      {/* Header */}
      <div
        className="px-4 pt-12 pb-6"
        style={{ background: 'linear-gradient(135deg, #14532d 0%, #052e16 100%)' }}
      >
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl tracking-tight leading-tight">Huduma</h1>
            <p className="text-xs text-white/50">Everything you need, one app</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tafuta huduma..."
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm text-white placeholder-white/30 outline-none focus:ring-1 focus:ring-[#4ade80] transition-all"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
        </div>
      </div>

      {/* Category tabs */}
      <div
        className="sticky top-0 z-10"
        style={{ background: '#080d08', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="overflow-x-auto px-4 py-3 scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => setSelectedCategory('all')}
              className="px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all"
              style={{
                background: selectedCategory === 'all' ? '#16a34a' : 'rgba(255,255,255,0.06)',
                color: selectedCategory === 'all' ? 'white' : 'rgba(255,255,255,0.6)',
                border: selectedCategory === 'all' ? 'none' : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              Zote • All
            </button>
            {(Object.entries(CATEGORY_INFO) as [keyof typeof CATEGORY_INFO, typeof CATEGORY_INFO[keyof typeof CATEGORY_INFO]][]).map(([key, info]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${selectedCategory === key ? info.activeClass + ' text-white' : ''}`}
                style={
                  selectedCategory !== key
                    ? { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)' }
                    : undefined
                }
              >
                <info.icon className="h-3.5 w-3.5" />
                {info.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pb-24 pt-5 space-y-8">
        {/* Recent */}
        {showDefault && recentServiceObjects.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-white/40" />
              <p className="text-sm text-white/50">Hivi Karibuni</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {recentServiceObjects.slice(0, 4).map((service, i) => (
                <motion.button
                  key={service.id}
                  onClick={() => handleServiceClick(service.id, service.route)}
                  className="rounded-2xl p-4 text-left group"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className={`w-10 h-10 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <service.icon className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-xs font-medium text-white/80">{service.nameSwahili}</p>
                  <p className="text-xs text-white/40">{service.name}</p>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Featured */}
        {showDefault && featuredServices.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <p className="text-sm text-white/50">Maarufu</p>
            </div>
            <div className="space-y-3">
              {featuredServices.map((service, i) => (
                <motion.button
                  key={service.id}
                  onClick={() => handleServiceClick(service.id, service.route)}
                  className="w-full rounded-2xl overflow-hidden text-left group"
                  style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4 p-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                      <service.icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold text-white">{service.nameSwahili}</p>
                      <p className="text-xs text-white/50 mt-0.5">{service.name}</p>
                      <p className="text-xs text-white/30 mt-1 line-clamp-1">{service.description}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-white/30 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* New */}
        {showDefault && newServices.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-4 w-4 text-purple-400" />
              <p className="text-sm text-white/50">Mpya</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {newServices.map((service, i) => (
                <motion.button
                  key={service.id}
                  onClick={() => handleServiceClick(service.id, service.route)}
                  className="relative rounded-2xl p-4 text-left group"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-600 text-white">
                    NEW
                  </div>
                  <div className={`w-10 h-10 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <service.icon className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-xs font-medium text-white/80">{service.nameSwahili}</p>
                  <p className="text-xs text-white/40">{service.name}</p>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* All services grid */}
        <div>
          <p className="text-sm text-white/40 mb-4">
            {selectedCategory === 'all'
              ? 'Huduma Zote'
              : `${CATEGORY_INFO[selectedCategory as keyof typeof CATEGORY_INFO]?.name} — ${CATEGORY_INFO[selectedCategory as keyof typeof CATEGORY_INFO]?.nameEn}`}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {filteredServices.map((service, i) => (
              <motion.button
                key={service.id}
                onClick={() => handleServiceClick(service.id, service.route)}
                className="relative rounded-2xl p-4 text-left group"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                whileTap={{ scale: 0.97 }}
              >
                {service.new && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-600 text-white">NEW</div>
                )}
                {service.popular && !service.new && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-600 text-white flex items-center gap-0.5">
                    <TrendingUp className="h-2.5 w-2.5" />HOT
                  </div>
                )}
                <div className={`w-10 h-10 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <service.icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-xs font-medium text-white/80 leading-tight">{service.nameSwahili}</p>
                <p className="text-xs text-white/40 mt-0.5">{service.name}</p>
                <p className="text-xs text-white/25 mt-1 line-clamp-1">{service.description}</p>
              </motion.button>
            ))}
          </div>

          {/* Empty state */}
          {filteredServices.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Search className="h-14 w-14 text-white/15" />
              <p className="text-white/50">Hakuna matokeo</p>
              <p className="text-sm text-white/30">No services found for "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 px-5 py-2.5 rounded-full text-xs bg-[#16a34a] text-white"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
