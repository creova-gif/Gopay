/**
 * SERVICES HUB - PRIORITIZED VERSION
 * 
 * ORDERING LOGIC (Research-backed from WeChat, Alipay, Grab):
 * 
 * 1. CONTEXT-AWARE (Time of day, location, history)
 *    Morning 6-9am: Breakfast delivery, bus tickets
 *    Lunch 12-2pm: Restaurant booking, food delivery
 *    Evening 5-8pm: Ride hailing, dinner reservations
 *    Weekend: Travel bookings, entertainment
 * 
 * 2. USAGE FREQUENCY (80/20 rule)
 *    80% of users use 20% of services
 *    Those 20% get priority placement
 * 
 * 3. PROGRESSIVE DISCLOSURE
 *    Core services: Always visible (6-8 max)
 *    Secondary: Category-based
 *    Advanced: Hidden in "More" or search-only
 * 
 * 4. REMOVAL RULES
 *    ❌ Admin tools (frauddetection, behavioralbiometrics)
 *    ❌ Internal dashboards (deliveryriderdashboard unless verified rider)
 *    ❌ Beta features (if completion < 80%)
 *    ❌ Region-locked (if not available in user's location)
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
  Send,
  Receipt,
  Store,
  Plane,
  Bus,
  Utensils,
  Film,
  Building2,
  ShoppingBag,
  Users,
  CreditCard,
  Package,
  Sparkles
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  nameSwahili: string;
  description: string;
  icon: any;
  color: string;
  category: 'core' | 'pay' | 'travel' | 'lifestyle' | 'government' | 'business';
  
  // Priority scoring (0-100)
  baseScore: number; // Default priority
  
  // Context modifiers
  timeRelevance?: {
    morning?: number; // 6am-12pm boost
    afternoon?: number; // 12pm-5pm boost
    evening?: number; // 5pm-10pm boost
    weekend?: number; // Sat/Sun boost
  };
  
  locationRelevance?: {
    urban?: number; // Dar, Arusha, Mwanza boost
    tourist?: number; // Zanzibar, Serengeti boost
  };
  
  // Visibility rules
  minMembershipTier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  requiresKYC?: boolean;
  betaAccess?: boolean; // Only show to beta testers
  regionLock?: string[]; // Only show in specific regions
  
  route: string;
}

// CORE SERVICES (Always visible - top 6-8)
const CORE_SERVICES: Service[] = [
  {
    id: 'send-money',
    name: 'Send Money',
    nameSwahili: 'Tuma Pesa',
    description: 'Instant transfers',
    icon: Send,
    color: 'from-emerald-600 to-green-600',
    category: 'core',
    baseScore: 100, // Highest priority
    route: 'sendmoney'
  },
  {
    id: 'bill-payments',
    name: 'Pay Bills',
    nameSwahili: 'Lipa Bili',
    description: 'TANESCO, DAWASCO, TV',
    icon: Receipt,
    color: 'from-blue-600 to-cyan-600',
    category: 'core',
    baseScore: 95,
    timeRelevance: {
      morning: 10, // People pay bills in morning
      evening: -5 // Less likely at night
    },
    route: 'billpayments'
  },
  {
    id: 'merchant-qr',
    name: 'Scan & Pay',
    nameSwahili: 'Lipa Duka',
    description: 'QR code payments',
    icon: Store,
    color: 'from-purple-600 to-pink-600',
    category: 'core',
    baseScore: 90,
    locationRelevance: {
      urban: 15 // More relevant in cities
    },
    route: 'quickpay'
  },
  {
    id: 'bus-tickets',
    name: 'Bus Tickets',
    nameSwahili: 'Tiketi za Basi',
    description: 'All routes across TZ',
    icon: Bus,
    color: 'from-green-500 to-emerald-600',
    category: 'core',
    baseScore: 85,
    timeRelevance: {
      morning: 15, // Peak booking time
      evening: 10
    },
    route: 'travel'
  },
  {
    id: 'food-delivery',
    name: 'Food Delivery',
    nameSwahili: 'Lete Chakula',
    description: 'Order from restaurants',
    icon: Utensils,
    color: 'from-orange-500 to-red-600',
    category: 'core',
    baseScore: 80,
    timeRelevance: {
      morning: -10,
      afternoon: 20, // Lunch rush
      evening: 20 // Dinner rush
    },
    locationRelevance: {
      urban: 20 // Only available in cities
    },
    route: 'gofood'
  },
  {
    id: 'flights',
    name: 'Book Flights',
    nameSwahili: 'Ndege',
    description: 'Domestic & international',
    icon: Plane,
    color: 'from-sky-500 to-blue-600',
    category: 'core',
    baseScore: 75,
    timeRelevance: {
      weekend: 15 // More weekend bookings
    },
    locationRelevance: {
      tourist: 25
    },
    route: 'travel'
  }
];

// SECONDARY SERVICES (Category-grouped)
const SECONDARY_SERVICES: Service[] = [
  // PAY
  {
    id: 'group-money',
    name: 'Group Collections',
    nameSwahili: 'Vikundi',
    description: 'Pool money together',
    icon: Users,
    color: 'from-teal-600 to-emerald-600',
    category: 'pay',
    baseScore: 70,
    route: 'groupmoney'
  },
  {
    id: 'multicurrency',
    name: 'Multi-Currency',
    nameSwahili: 'Sarafu Nyingi',
    description: 'USD, EUR, KES',
    icon: CreditCard,
    color: 'from-orange-600 to-red-600',
    category: 'pay',
    baseScore: 60,
    minMembershipTier: 'silver',
    route: 'multicurrencywallet'
  },
  
  // TRAVEL
  {
    id: 'hotels',
    name: 'Hotels',
    nameSwahili: 'Hoteli',
    description: 'Book stays',
    icon: Building2,
    color: 'from-purple-500 to-purple-600',
    category: 'travel',
    baseScore: 65,
    locationRelevance: {
      tourist: 20
    },
    route: 'travel'
  },
  {
    id: 'rides',
    name: 'Ride Hailing',
    nameSwahili: 'Teksi',
    description: 'Book rides',
    icon: MapPin,
    color: 'from-yellow-500 to-orange-600',
    category: 'travel',
    baseScore: 70,
    timeRelevance: {
      morning: 10,
      evening: 15 // Rush hour
    },
    locationRelevance: {
      urban: 25
    },
    route: 'rides'
  },
  
  // LIFESTYLE
  {
    id: 'restaurants',
    name: 'Restaurants',
    nameSwahili: 'Mikahawa',
    description: 'Reserve tables',
    icon: Utensils,
    color: 'from-pink-500 to-rose-600',
    category: 'lifestyle',
    baseScore: 60,
    timeRelevance: {
      evening: 15
    },
    route: 'restaurants'
  },
  {
    id: 'movies',
    name: 'Movie Tickets',
    nameSwahili: 'Sinema',
    description: 'Book cinema',
    icon: Film,
    color: 'from-indigo-500 to-purple-600',
    category: 'lifestyle',
    baseScore: 55,
    timeRelevance: {
      weekend: 20,
      evening: 10
    },
    route: 'movies'
  },
  {
    id: 'shopping',
    name: 'Shop Online',
    nameSwahili: 'Nunua',
    description: 'Browse stores',
    icon: ShoppingBag,
    color: 'from-blue-500 to-indigo-600',
    category: 'lifestyle',
    baseScore: 65,
    route: 'shopping'
  },
  
  // GOVERNMENT
  {
    id: 'government-services',
    name: 'Gov Services',
    nameSwahili: 'Huduma za Serikali',
    description: 'NIDA, TRA, licenses',
    icon: Building2,
    color: 'from-blue-600 to-blue-700',
    category: 'government',
    baseScore: 70,
    requiresKYC: true,
    route: 'governmentservices'
  },
  
  // BUSINESS
  {
    id: 'merchant-tools',
    name: 'Merchant Tools',
    nameSwahili: 'Zana za Biashara',
    description: 'Accept payments',
    icon: Store,
    color: 'from-purple-600 to-purple-700',
    category: 'business',
    baseScore: 50,
    minMembershipTier: 'bronze',
    route: 'merchantdash'
  }
];

// HIDDEN SERVICES (Never show in main UI - deep link only)
const HIDDEN_SERVICES = [
  'frauddetection',
  'behavioralbiometrics',
  'advancedsecurity',
  'deliveryriderdashboard', // Unless user is verified rider
  'vcdashboard', // Easter egg (V+C keys)
  'admin',
  'aismartshoppingassistant' // AI branding - deprecated
];

interface ServicesHubPrioritizedProps {
  onBack: () => void;
  onNavigate: (service: string) => void;
  userContext: {
    location: string; // "Dar es Salaam", "Zanzibar", etc.
    membershipTier: 'bronze' | 'silver' | 'gold' | 'platinum';
    kycVerified: boolean;
    recentServices: string[];
    timezone: string;
  };
}

export function ServicesHubPrioritized({ 
  onBack, 
  onNavigate, 
  userContext 
}: ServicesHubPrioritizedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [prioritizedServices, setPrioritizedServices] = useState<Service[]>([]);

  useEffect(() => {
    const scored = calculatePriority();
    setPrioritizedServices(scored);
  }, [userContext]);

  const calculatePriority = (): Service[] => {
    const now = new Date();
    const hour = now.getHours();
    const isWeekend = now.getDay() === 0 || now.getDay() === 6;
    
    // Determine time of day
    const timeOfDay: 'morning' | 'afternoon' | 'evening' = 
      hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
    
    // Determine location type
    const isUrban = ['Dar es Salaam', 'Arusha', 'Mwanza', 'Dodoma'].includes(userContext.location);
    const isTourist = ['Zanzibar', 'Serengeti', 'Kilimanjaro'].includes(userContext.location);
    
    const allServices = [...CORE_SERVICES, ...SECONDARY_SERVICES];
    
    const scoredServices = allServices.map(service => {
      let score = service.baseScore;
      
      // Time relevance boost
      if (service.timeRelevance) {
        if (service.timeRelevance[timeOfDay]) {
          score += service.timeRelevance[timeOfDay];
        }
        if (isWeekend && service.timeRelevance.weekend) {
          score += service.timeRelevance.weekend;
        }
      }
      
      // Location relevance boost
      if (service.locationRelevance) {
        if (isUrban && service.locationRelevance.urban) {
          score += service.locationRelevance.urban;
        }
        if (isTourist && service.locationRelevance.tourist) {
          score += service.locationRelevance.tourist;
        }
      }
      
      // Recent usage boost (services used in last 7 days get +20)
      if (userContext.recentServices.includes(service.id)) {
        score += 20;
      }
      
      // Membership tier filtering
      if (service.minMembershipTier) {
        const tiers = ['bronze', 'silver', 'gold', 'platinum'];
        const userTierIndex = tiers.indexOf(userContext.membershipTier);
        const requiredTierIndex = tiers.indexOf(service.minMembershipTier);
        
        if (userTierIndex < requiredTierIndex) {
          // User doesn't have access - hide or show locked
          return { ...service, score: -1, locked: true };
        }
      }
      
      // KYC requirement filtering
      if (service.requiresKYC && !userContext.kycVerified) {
        return { ...service, score: score - 30, needsKYC: true };
      }
      
      return { ...service, score };
    });
    
    // Filter out hidden services and sort by score
    return scoredServices
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score);
  };

  const filteredServices = prioritizedServices.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.nameSwahili.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Core services (top 6-8, score >= 75)
  const coreVisible = filteredServices.filter(s => s.score >= 75).slice(0, 8);
  
  // Secondary services (by category)
  const secondaryPay = filteredServices.filter(s => s.category === 'pay' && s.score < 75);
  const secondaryTravel = filteredServices.filter(s => s.category === 'travel' && s.score < 75);
  const secondaryLifestyle = filteredServices.filter(s => s.category === 'lifestyle' && s.score < 75);
  const secondaryGovernment = filteredServices.filter(s => s.category === 'government' && s.score < 75);
  const secondaryBusiness = filteredServices.filter(s => s.category === 'business' && s.score < 75);

  const handleServiceClick = (serviceId: string, route: string, locked?: boolean, needsKYC?: boolean) => {
    if (locked) {
      // Show membership upgrade prompt
      alert('Upgrade to Silver membership to unlock this service');
      return;
    }
    
    if (needsKYC) {
      // Navigate to KYC flow
      alert('Please complete KYC verification to access government services');
      return;
    }
    
    // Track usage
    const updated = [serviceId, ...userContext.recentServices.filter(id => id !== serviceId)].slice(0, 10);
    localStorage.setItem('recent-services', JSON.stringify(updated));
    
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
            <p className="text-sm text-emerald-100">Smart ordering for you</p>
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

      {/* Content */}
      <div className="px-6 pb-24 pt-6 space-y-8">
        {/* Context Indicator (shows WHY this ordering) */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-bold text-blue-900">
              Showing services for {userContext.location}
            </p>
            <p className="text-blue-700">
              {new Date().toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' })} • 
              {' '}{userContext.membershipTier.charAt(0).toUpperCase() + userContext.membershipTier.slice(1)} Member
            </p>
          </div>
        </div>

        {/* CORE SERVICES (Always visible) */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-emerald-600 fill-emerald-600" />
            <h2 className="text-lg font-black text-gray-900">Mara kwa Mara • Most Used</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {coreVisible.map(service => {
              const Icon = service.icon;
              return (
                <button
                  key={service.id}
                  onClick={() => handleServiceClick(service.id, service.route, service.locked, service.needsKYC)}
                  className="relative bg-white border border-gray-200 rounded-2xl p-4 hover:border-emerald-500 hover:shadow-lg transition-all active:scale-[0.98] text-left group"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-bold text-sm text-gray-900 mb-0.5">{service.nameSwahili}</p>
                  <p className="text-xs text-gray-600">{service.name}</p>
                  
                  {/* Score indicator (only visible in dev mode) */}
                  {process.env.NODE_ENV === 'development' && (
                    <div className="absolute top-2 right-2 bg-gray-900 text-white text-xs px-2 py-0.5 rounded-full">
                      {service.score}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* SECONDARY SERVICES - By Category (Collapsible) */}
        {secondaryPay.length > 0 && (
          <CategorySection
            title="Malipo • Payments"
            titleEn="More payment options"
            services={secondaryPay}
            onServiceClick={handleServiceClick}
          />
        )}

        {secondaryTravel.length > 0 && (
          <CategorySection
            title="Safari • Travel"
            titleEn="More travel options"
            services={secondaryTravel}
            onServiceClick={handleServiceClick}
          />
        )}

        {secondaryLifestyle.length > 0 && (
          <CategorySection
            title="Ishi • Lifestyle"
            titleEn="Entertainment & shopping"
            services={secondaryLifestyle}
            onServiceClick={handleServiceClick}
          />
        )}

        {secondaryGovernment.length > 0 && (
          <CategorySection
            title="Serikali • Government"
            titleEn="Official services"
            services={secondaryGovernment}
            onServiceClick={handleServiceClick}
          />
        )}

        {secondaryBusiness.length > 0 && (
          <CategorySection
            title="Biashara • Business"
            titleEn="Tools for merchants"
            services={secondaryBusiness}
            onServiceClick={handleServiceClick}
          />
        )}
      </div>
    </div>
  );
}

// Category Section Component
function CategorySection({ 
  title, 
  titleEn, 
  services, 
  onServiceClick 
}: { 
  title: string; 
  titleEn: string; 
  services: any[]; 
  onServiceClick: (id: string, route: string, locked?: boolean, needsKYC?: boolean) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  
  const visible = expanded ? services : services.slice(0, 4);
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-black text-gray-900">{title}</h2>
          <p className="text-xs text-gray-600">{titleEn}</p>
        </div>
        {services.length > 4 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-emerald-600 font-bold hover:text-emerald-700"
          >
            {expanded ? 'Show less' : `+${services.length - 4} more`}
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {visible.map(service => {
          const Icon = service.icon;
          return (
            <button
              key={service.id}
              onClick={() => onServiceClick(service.id, service.route, service.locked, service.needsKYC)}
              className="relative bg-white border border-gray-200 rounded-2xl p-4 hover:border-emerald-500 hover:shadow-lg transition-all active:scale-[0.98] text-left group"
            >
              {service.locked && (
                <div className="absolute inset-0 bg-gray-900/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <div className="bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-bold">
                    🔒 {service.minMembershipTier?.toUpperCase()}
                  </div>
                </div>
              )}
              
              {service.needsKYC && (
                <div className="absolute top-2 right-2 bg-orange-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  KYC
                </div>
              )}
              
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
  );
}
