/**
 * SERVICES HUB - Super App Mini-Programs Center
 * 
 * Inspired by:
 * - WeChat Mini Programs: Seamless, feels native
 * - Alipay Life Services: Contextual, organized by purpose
 * - Grab Services: Clean cards, clear value props
 * - Gojek: Category grouping, visual hierarchy
 * 
 * Philosophy:
 * - Services feel like part of goPay (not external apps)
 * - Grouped by user intent, not technical category
 * - Most-used services surface naturally
 * - No clutter, no overwhelming choices
 */

import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  ChevronRight, 
  Star, 
  Zap, 
  TrendingUp,
  Clock,
  MapPin,
  // Pay
  Send,
  CreditCard,
  Receipt,
  Wallet,
  // Travel
  Plane,
  Bus,
  Hotel,
  Ship,
  // Lifestyle
  ShoppingBag,
  Utensils,
  Film,
  Gamepad2,
  // Government
  Building2,
  FileText,
  Shield,
  GraduationCap,
  // Business
  Store,
  BarChart3,
  Users,
  Package
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
  icon: any;
  color: string;
  category: 'pay' | 'travel' | 'lifestyle' | 'government' | 'business';
  popular?: boolean;
  new?: boolean;
  featured?: boolean;
  route: string;
}

const ALL_SERVICES: Service[] = [
  // PAY CATEGORY
  {
    id: 'send-money',
    name: 'Send Money',
    nameSwahili: 'Tuma Pesa',
    description: 'Instant money transfers',
    icon: Send,
    color: 'from-emerald-600 to-green-600',
    category: 'pay',
    popular: true,
    route: 'sendmoney'
  },
  {
    id: 'bill-payments',
    name: 'Pay Bills',
    nameSwahili: 'Lipa Bili',
    description: 'TANESCO, DAWASCO, TV & more',
    icon: Receipt,
    color: 'from-blue-600 to-cyan-600',
    category: 'pay',
    popular: true,
    route: 'billpayments'
  },
  {
    id: 'merchant-payments',
    name: 'Merchant QR',
    nameSwahili: 'Lipa Duka',
    description: 'Scan & pay at stores',
    icon: Store,
    color: 'from-purple-600 to-pink-600',
    category: 'pay',
    featured: true,
    route: 'merchant'
  },
  {
    id: 'group-money',
    name: 'Group Collections',
    nameSwahili: 'Vikundi',
    description: 'Pool money for trips & events',
    icon: Users,
    color: 'from-teal-600 to-emerald-600',
    category: 'pay',
    new: true,
    route: 'groupmoney'
  },
  {
    id: 'multicurrency',
    name: 'Multi-Currency',
    nameSwahili: 'Sarafu Nyingi',
    description: 'USD, EUR, KES & more',
    icon: CreditCard,
    color: 'from-orange-600 to-red-600',
    category: 'pay',
    route: 'multicurrencywallet'
  },

  // TRAVEL CATEGORY
  {
    id: 'flights',
    name: 'Book Flights',
    nameSwahili: 'Ndege',
    description: 'Domestic & international',
    icon: Plane,
    color: 'from-sky-500 to-blue-600',
    category: 'travel',
    popular: true,
    route: 'travel'
  },
  {
    id: 'buses',
    name: 'Bus Tickets',
    nameSwahili: 'Mabasi',
    description: 'All routes across Tanzania',
    icon: Bus,
    color: 'from-green-500 to-emerald-600',
    category: 'travel',
    featured: true,
    route: 'travel'
  },
  {
    id: 'hotels',
    name: 'Hotels',
    nameSwahili: 'Hoteli',
    description: 'Book accommodations',
    icon: Hotel,
    color: 'from-purple-500 to-purple-600',
    category: 'travel',
    route: 'travel'
  },
  {
    id: 'ferry',
    name: 'Ferry Booking',
    nameSwahili: 'Feri',
    description: 'Zanzibar, Pemba & more',
    icon: Ship,
    color: 'from-cyan-500 to-teal-600',
    category: 'travel',
    route: 'ferrybooking'
  },
  {
    id: 'rides',
    name: 'Ride Hailing',
    nameSwahili: 'Teksi',
    description: 'Book taxis & motorcycles',
    icon: MapPin,
    color: 'from-yellow-500 to-orange-600',
    category: 'travel',
    new: true,
    route: 'rides'
  },
  {
    id: 'car-rental',
    name: 'Car Rental',
    nameSwahili: 'Kodi Gari',
    description: 'Rent vehicles',
    icon: Package,
    color: 'from-red-500 to-pink-600',
    category: 'travel',
    route: 'rentals'
  },

  // LIFESTYLE CATEGORY
  {
    id: 'food-delivery',
    name: 'Food Delivery',
    nameSwahili: 'Chakula',
    description: 'Order from restaurants',
    icon: Utensils,
    color: 'from-orange-500 to-red-600',
    category: 'lifestyle',
    popular: true,
    route: 'gofood'
  },
  {
    id: 'restaurants',
    name: 'Restaurants',
    nameSwahili: 'Mikahawa',
    description: 'Reserve tables',
    icon: Utensils,
    color: 'from-pink-500 to-rose-600',
    category: 'lifestyle',
    route: 'restaurants'
  },
  {
    id: 'movies',
    name: 'Movie Tickets',
    nameSwahili: 'Sinema',
    description: 'Book cinema seats',
    icon: Film,
    color: 'from-indigo-500 to-purple-600',
    category: 'lifestyle',
    route: 'movies'
  },
  {
    id: 'shopping',
    name: 'Shop Online',
    nameSwahili: 'Nunua',
    description: 'Browse local stores',
    icon: ShoppingBag,
    color: 'from-blue-500 to-indigo-600',
    category: 'lifestyle',
    route: 'shopping'
  },
  {
    id: 'subscriptions',
    name: 'Subscriptions',
    nameSwahili: 'Michango',
    description: 'Manage recurring payments',
    icon: Clock,
    color: 'from-green-500 to-teal-600',
    category: 'lifestyle',
    route: 'subscriptions'
  },

  // GOVERNMENT CATEGORY
  {
    id: 'government-services',
    name: 'Gov Services',
    nameSwahili: 'Serikali',
    description: 'NIDA, TRA, licenses & more',
    icon: Building2,
    color: 'from-blue-600 to-blue-700',
    category: 'government',
    featured: true,
    route: 'governmentservices'
  },
  {
    id: 'school-fees',
    name: 'School Fees',
    nameSwahili: 'Ada za Shule',
    description: 'Pay education fees',
    icon: GraduationCap,
    color: 'from-orange-600 to-amber-600',
    category: 'government',
    route: 'governmentservices'
  },

  // BUSINESS CATEGORY
  {
    id: 'merchant-dashboard',
    name: 'Merchant Tools',
    nameSwahili: 'Biashara',
    description: 'Accept payments, track sales',
    icon: BarChart3,
    color: 'from-purple-600 to-purple-700',
    category: 'business',
    route: 'merchantdash'
  },
  {
    id: 'sme-suite',
    name: 'SME Suite',
    nameSwahili: 'Zana za Biashara',
    description: 'Business management tools',
    icon: Store,
    color: 'from-emerald-600 to-teal-700',
    category: 'business',
    route: 'smebusinesssuite'
  }
];

const CATEGORY_INFO = {
  pay: { name: 'Lipa', nameEn: 'Payments', icon: Wallet, color: 'emerald' },
  travel: { name: 'Safari', nameEn: 'Travel', icon: Plane, color: 'sky' },
  lifestyle: { name: 'Ishi', nameEn: 'Lifestyle', icon: ShoppingBag, color: 'purple' },
  government: { name: 'Serikali', nameEn: 'Government', icon: Building2, color: 'blue' },
  business: { name: 'Biashara', nameEn: 'Business', icon: Store, color: 'orange' }
};

export function ServicesHub({ onBack, onNavigate, userContext }: ServicesHubProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [recentServices, setRecentServices] = useState<string[]>([]);

  useEffect(() => {
    // Load recent services from context or localStorage
    if (userContext?.recentServices) {
      setRecentServices(userContext.recentServices);
    } else {
      const saved = localStorage.getItem('recent-services');
      if (saved) {
        setRecentServices(JSON.parse(saved));
      }
    }
  }, []);

  const filteredServices = ALL_SERVICES.filter(service => {
    const matchesSearch = 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.nameSwahili.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const featuredServices = ALL_SERVICES.filter(s => s.featured);
  const popularServices = ALL_SERVICES.filter(s => s.popular);
  const newServices = ALL_SERVICES.filter(s => s.new);
  const recentServiceObjects = ALL_SERVICES.filter(s => recentServices.includes(s.id));

  const handleServiceClick = (serviceId: string, route: string) => {
    // Track recent service
    const updated = [serviceId, ...recentServices.filter(id => id !== serviceId)].slice(0, 6);
    setRecentServices(updated);
    localStorage.setItem('recent-services', JSON.stringify(updated));
    
    // Navigate
    onNavigate(route);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white px-6 pt-12 pb-8">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full transition-all">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="text-center flex-1">
            <h1 className="text-2xl font-black">Huduma • Services</h1>
            <p className="text-sm text-emerald-100">Everything you need, one app</p>
          </div>
          <div className="w-10" />
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tafuta huduma... Search services..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-xl"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="overflow-x-auto px-6 py-4 scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Zote • All
            </button>
            {Object.entries(CATEGORY_INFO).map(([key, info]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  selectedCategory === key
                    ? `bg-gradient-to-r from-${info.color}-600 to-${info.color}-700 text-white shadow-lg`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <info.icon className="w-4 h-4" />
                <span>{info.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-24 pt-6 space-y-8">
        {/* Recent Services (if any) */}
        {recentServiceObjects.length > 0 && selectedCategory === 'all' && !searchQuery && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-black text-gray-900">Hivi Karibuni • Recent</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {recentServiceObjects.slice(0, 4).map(service => {
                const Icon = service.icon;
                return (
                  <button
                    key={service.id}
                    onClick={() => handleServiceClick(service.id, service.route)}
                    className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-emerald-500 hover:shadow-lg transition-all active:scale-[0.98] text-left group"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-bold text-sm text-gray-900 mb-0.5">{service.nameSwahili}</p>
                    <p className="text-xs text-gray-600">{service.name}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Featured Services */}
        {featuredServices.length > 0 && selectedCategory === 'all' && !searchQuery && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-yellow-600 fill-yellow-600" />
              <h2 className="text-lg font-black text-gray-900">Maarufu • Featured</h2>
            </div>
            <div className="space-y-3">
              {featuredServices.map(service => {
                const Icon = service.icon;
                return (
                  <button
                    key={service.id}
                    onClick={() => handleServiceClick(service.id, service.route)}
                    className={`w-full bg-gradient-to-br ${service.color} rounded-2xl p-1 shadow-lg hover:shadow-xl transition-all active:scale-[0.98] group`}
                  >
                    <div className="bg-white rounded-[14px] p-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-black text-base text-gray-900 mb-1">{service.nameSwahili}</p>
                          <p className="text-sm text-gray-600 mb-1">{service.name}</p>
                          <p className="text-xs text-gray-500">{service.description}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* New Services */}
        {newServices.length > 0 && selectedCategory === 'all' && !searchQuery && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-black text-gray-900">Mpya • New</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {newServices.map(service => {
                const Icon = service.icon;
                return (
                  <button
                    key={service.id}
                    onClick={() => handleServiceClick(service.id, service.route)}
                    className="relative bg-white border border-gray-200 rounded-2xl p-4 hover:border-purple-500 hover:shadow-lg transition-all active:scale-[0.98] text-left group"
                  >
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                      NEW
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-bold text-sm text-gray-900 mb-0.5">{service.nameSwahili}</p>
                    <p className="text-xs text-gray-600">{service.name}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* All Services (Grid) */}
        <div>
          <h2 className="text-lg font-black text-gray-900 mb-4">
            {selectedCategory === 'all' 
              ? 'Huduma Zote • All Services' 
              : `${CATEGORY_INFO[selectedCategory as keyof typeof CATEGORY_INFO]?.name} • ${CATEGORY_INFO[selectedCategory as keyof typeof CATEGORY_INFO]?.nameEn}`
            }
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {filteredServices.map(service => {
              const Icon = service.icon;
              return (
                <button
                  key={service.id}
                  onClick={() => handleServiceClick(service.id, service.route)}
                  className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-emerald-500 hover:shadow-lg transition-all active:scale-[0.98] text-left group relative"
                >
                  {service.new && (
                    <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      NEW
                    </div>
                  )}
                  {service.popular && (
                    <div className="absolute top-2 right-2 bg-orange-600 text-white text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      HOT
                    </div>
                  )}
                  <div className={`w-12 h-12 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-bold text-sm text-gray-900 mb-0.5">{service.nameSwahili}</p>
                  <p className="text-xs text-gray-600 mb-1">{service.name}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{service.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Hakuna matokeo</h3>
            <p className="text-gray-600">No services found matching "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition-colors"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
