/**
 * SERVICES PAGE - DEEPLY REFINED (Highest ROI)
 * 
 * WORLD-CLASS RULES APPLIED:
 * ✅ ONE featured service above the fold (primary story)
 * ✅ Intent-based curation (what user wants to do, not technical categories)
 * ✅ Clear visual hierarchy (Featured → Essential → Discover)
 * ✅ Remove ALL demo/internal tools
 * ✅ Swahili-first language
 * ✅ Motion < 300ms
 * ✅ "What can I do right now?" clarity
 * ✅ No AI branding, no tech explanations
 * 
 * INSPIRED BY:
 * - Alipay: Featured service rotation, intent grouping
 * - WeChat: Curated mini-programs, not app store
 * - Grab: Clear value props, clean cards
 * - Touch 'n Go: Local context, national pride
 * 
 * @version 4.0.0 (Deeply Refined)
 */

import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  Search,
  ChevronRight,
  Star,
  TrendingUp,
  Clock,
  // Payment icons
  Send,
  Receipt,
  QrCode,
  Smartphone,
  // Travel icons
  Plane,
  Bus,
  Ship,
  Hotel,
  Mountain,
  Car,
  // Lifestyle icons
  Utensils,
  ShoppingBag,
  Film,
  // Government icons
  Building2,
  GraduationCap,
  FileText
} from 'lucide-react';

interface ServicesPageRefinedProps {
  onBack: () => void;
  onNavigate: (service: string) => void;
  language?: 'sw' | 'en';
  userLocation?: string; // For context-aware featured service
}

// ════════════════════════════════════════════════════════════
// SWAHILI-FIRST COPY DATABASE
// ════════════════════════════════════════════════════════════

const COPY = {
  header: {
    title: { sw: 'Huduma', en: 'Services' },
    search: { sw: 'Tafuta huduma...', en: 'Search services...' }
  },
  sections: {
    featured: { sw: 'Kipengele', en: 'Featured' },
    essential: { sw: 'Muhimu', en: 'Essential' },
    travel: { sw: 'Safari & Usafiri', en: 'Travel & Transport' },
    lifestyle: { sw: 'Maisha ya Kila Siku', en: 'Daily Life' },
    government: { sw: 'Huduma za Serikali', en: 'Government Services' }
  },
  badges: {
    new: { sw: 'Mpya', en: 'New' },
    popular: { sw: 'Maarufu', en: 'Popular' },
    recommended: { sw: 'Tunapendekeza', en: 'Recommended' }
  },
  cta: {
    viewAll: { sw: 'Angalia Zote', en: 'View All' },
    bookNow: { sw: 'Nunua Sasa', en: 'Book Now' },
    learnMore: { sw: 'Jifunze Zaidi', en: 'Learn More' }
  }
};

// ════════════════════════════════════════════════════════════
// SERVICE DATA (CURATED, NO DEMO/INTERNAL)
// ════════════════════════════════════════════════════════════

interface Service {
  id: string;
  title: { sw: string; en: string };
  benefit: { sw: string; en: string }; // ONE line: "What can I do?"
  icon: any;
  iconBg: string;
  iconColor: string;
  route: string;
  badge?: 'new' | 'popular';
}

// Featured service (rotates based on context/time)
const FEATURED_SERVICES = [
  {
    id: 'sgr-express',
    title: { sw: 'SGR Express', en: 'SGR Express' },
    subtitle: { sw: 'Dar ↔ Dodoma • TSh 32,000', en: 'Dar ↔ Dodoma from TSh 32,000' },
    benefit: { sw: 'Nunua tiketi kwa dakika 2', en: 'Book tickets in 2 minutes' },
    image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80',
    route: 'travel',
    badge: 'popular' as const
  },
  {
    id: 'zanzibar-ferry',
    title: { sw: 'Feri ya Zanzibar', en: 'Zanzibar Ferry' },
    subtitle: { sw: 'Azam Marine • TSh 35,000', en: 'Azam Marine from TSh 35,000' },
    benefit: { sw: 'Tiketi zinapatikana leo', en: 'Tickets available today' },
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    route: 'ferrybooking',
    badge: 'popular' as const
  },
  {
    id: 'government-payments',
    title: { sw: 'Lipa Kodi Online', en: 'Pay Taxes Online' },
    subtitle: { sw: 'TRA • Haraka na Salama', en: 'TRA • Fast & Secure' },
    benefit: { sw: 'Epuka foleni', en: 'Skip the queue' },
    image: 'https://images.unsplash.com/photo-1554224311-beee4ece0933?w=800&q=80',
    route: 'governmentservices',
    badge: 'new' as const
  }
];

// Essential services (always visible, thumb-first layout)
const ESSENTIAL_SERVICES: Service[] = [
  {
    id: 'send-money',
    title: { sw: 'Tuma Pesa', en: 'Send Money' },
    benefit: { sw: 'Kwa simu au namba ya akaunti', en: 'To phone or account number' },
    icon: Send,
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
    route: 'sendmoney',
    badge: 'popular'
  },
  {
    id: 'pay-bills',
    title: { sw: 'Lipa Bili', en: 'Pay Bills' },
    benefit: { sw: 'TANESCO, DAWASCO, TV', en: 'Utilities & subscriptions' },
    icon: Receipt,
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
    route: 'billpayments',
    badge: 'popular'
  },
  {
    id: 'scan-qr',
    title: { sw: 'Scan na Lipa', en: 'Scan & Pay' },
    benefit: { sw: 'Maduka yote Tanzania', en: 'All stores in Tanzania' },
    icon: QrCode,
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-400',
    route: 'qr'
  },
  {
    id: 'airtime',
    title: { sw: 'Nunua Airtime', en: 'Buy Airtime' },
    benefit: { sw: 'Vodacom, Airtel, Tigo, Halotel', en: 'All networks' },
    icon: Smartphone,
    iconBg: 'bg-green-500/20',
    iconColor: 'text-green-400',
    route: 'billpayments'
  }
];

// Travel & Transport (grouped by intent: "I want to go somewhere")
const TRAVEL_SERVICES: Service[] = [
  {
    id: 'flights',
    title: { sw: 'Ndege', en: 'Flights' },
    benefit: { sw: 'Ndani na nje ya nchi', en: 'Domestic & international' },
    icon: Plane,
    iconBg: 'bg-sky-500/20',
    iconColor: 'text-sky-400',
    route: 'travel'
  },
  {
    id: 'buses',
    title: { sw: 'Mabasi', en: 'Buses' },
    benefit: { sw: 'Njia zote Tanzania', en: 'All routes across Tanzania' },
    icon: Bus,
    iconBg: 'bg-green-500/20',
    iconColor: 'text-green-400',
    route: 'travel'
  },
  {
    id: 'ferries',
    title: { sw: 'Feri', en: 'Ferries' },
    benefit: { sw: 'Zanzibar, Pemba, Mafia', en: 'Island connections' },
    icon: Ship,
    iconBg: 'bg-cyan-500/20',
    iconColor: 'text-cyan-400',
    route: 'ferrybooking'
  },
  {
    id: 'hotels',
    title: { sw: 'Hoteli', en: 'Hotels' },
    benefit: { sw: 'Bei nzuri, uhakika', en: 'Best rates, guaranteed' },
    icon: Hotel,
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-400',
    route: 'travel'
  },
  {
    id: 'car-rental',
    title: { sw: 'Kodi Gari', en: 'Car Rental' },
    benefit: { sw: 'Kwa saa au siku', en: 'Hourly or daily' },
    icon: Car,
    iconBg: 'bg-orange-500/20',
    iconColor: 'text-orange-400',
    route: 'rentals'
  },
  {
    id: 'tourism',
    title: { sw: 'Utalii', en: 'Tourism' },
    benefit: { sw: 'Serengeti, Kilimanjaro, Ngorongoro', en: 'National parks & safaris' },
    icon: Mountain,
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
    route: 'artourism'
  }
];

// Lifestyle (grouped by intent: "I need something today")
const LIFESTYLE_SERVICES: Service[] = [
  {
    id: 'food-delivery',
    title: { sw: 'Lete Chakula', en: 'Food Delivery' },
    benefit: { sw: 'Kutoka mikahawa ya karibu', en: 'From nearby restaurants' },
    icon: Utensils,
    iconBg: 'bg-orange-500/20',
    iconColor: 'text-orange-400',
    route: 'gofood',
    badge: 'popular'
  },
  {
    id: 'restaurants',
    title: { sw: 'Weka Meza', en: 'Reserve Table' },
    benefit: { sw: 'Mikahawa bora Dar es Salaam', en: 'Top restaurants in Dar' },
    icon: Utensils,
    iconBg: 'bg-pink-500/20',
    iconColor: 'text-pink-400',
    route: 'restaurants'
  },
  {
    id: 'shopping',
    title: { sw: 'Nunua Online', en: 'Shop Online' },
    benefit: { sw: 'Maduka ya Tanzania', en: 'Local Tanzanian stores' },
    icon: ShoppingBag,
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
    route: 'shopping'
  },
  {
    id: 'movies',
    title: { sw: 'Tiketi za Sinema', en: 'Movie Tickets' },
    benefit: { sw: 'Chagua viti mapema', en: 'Choose seats ahead' },
    icon: Film,
    iconBg: 'bg-indigo-500/20',
    iconColor: 'text-indigo-400',
    route: 'movies'
  }
];

// Government (grouped by intent: "I need to handle official business")
const GOVERNMENT_SERVICES: Service[] = [
  {
    id: 'government-payments',
    title: { sw: 'Malipo ya Serikali', en: 'Government Payments' },
    benefit: { sw: 'TRA, NHIF, NSSF', en: 'Taxes & contributions' },
    icon: Building2,
    iconBg: 'bg-blue-600/20',
    iconColor: 'text-blue-400',
    route: 'governmentservices'
  },
  {
    id: 'school-fees',
    title: { sw: 'Ada za Shule', en: 'School Fees' },
    benefit: { sw: 'Shule za serikali na binafsi', en: 'Public & private schools' },
    icon: GraduationCap,
    iconBg: 'bg-amber-600/20',
    iconColor: 'text-amber-400',
    route: 'governmentservices'
  },
  {
    id: 'licenses',
    title: { sw: 'Leseni & Vibali', en: 'Licenses & Permits' },
    benefit: { sw: 'Usajili wa biashara, dereva', en: 'Business & driver licenses' },
    icon: FileText,
    iconBg: 'bg-green-600/20',
    iconColor: 'text-green-400',
    route: 'governmentservices'
  }
];

// ════════════════════════════════════════════════════════════
// MOTION CONSTANTS (< 300ms)
// ════════════════════════════════════════════════════════════

const MOTION = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  slideIn: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: (delay: number) => ({
      duration: 0.25,
      delay,
      ease: 'easeOut'
    })
  },
  tap: { scale: 0.98, duration: 0.12 }
};

// ════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════

export function ServicesPageRefined({
  onBack,
  onNavigate,
  language = 'sw',
  userLocation
}: ServicesPageRefinedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  
  const getText = (obj: { sw: string; en: string }) => obj[language];
  
  // Rotate featured service every 8 seconds
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const timer = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % FEATURED_SERVICES.length);
    }, 8000);
    
    return () => clearInterval(timer);
  }, [prefersReducedMotion]);
  
  const currentFeatured = FEATURED_SERVICES[featuredIndex];
  
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      
      {/* ════════════════════════════════════════════════════════════
          HEADER (Minimal, focused)
      ════════════════════════════════════════════════════════════ */}
      <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 px-6 pt-12 pb-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-full transition-all active:scale-95"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-2xl font-black text-white">
            {getText(COPY.header.title)}
          </h1>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={getText(COPY.header.search)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-xl font-medium"
          />
        </div>
      </div>
      
      <div className="px-6 py-6 space-y-8">
        
        {/* ════════════════════════════════════════════════════════════
            FEATURED SERVICE (ONE hero, rotates every 8s)
        ════════════════════════════════════════════════════════════ */}
        <motion.div
          key={featuredIndex}
          initial={MOTION.fadeIn.initial}
          animate={MOTION.fadeIn.animate}
          transition={MOTION.fadeIn.transition}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-gray-900">
              {getText(COPY.sections.featured)}
            </h2>
            <div className="flex gap-1">
              {FEATURED_SERVICES.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === featuredIndex
                      ? 'w-6 bg-emerald-600'
                      : 'w-1.5 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <motion.button
            onClick={() => onNavigate(currentFeatured.route)}
            whileTap={prefersReducedMotion ? {} : { scale: 0.99 }}
            className="relative w-full bg-gradient-to-br from-emerald-600 to-green-700 rounded-3xl overflow-hidden shadow-2xl active:shadow-lg transition-shadow"
          >
            {/* Background image */}
            <div className="absolute inset-0 opacity-20">
              <img
                src={currentFeatured.image}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Content */}
            <div className="relative z-10 p-6 text-left">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-amber-400 text-amber-900 text-xs font-black rounded-full uppercase">
                  {getText(COPY.badges[currentFeatured.badge])}
                </span>
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              </div>
              
              <h3 className="text-2xl font-black text-white mb-1">
                {getText(currentFeatured.title)}
              </h3>
              <p className="text-base text-emerald-100 mb-2">
                {getText(currentFeatured.subtitle)}
              </p>
              <p className="text-sm text-white/80 mb-4">
                {getText(currentFeatured.benefit)}
              </p>
              
              <div className="inline-flex items-center gap-2 bg-white text-emerald-900 px-5 py-3 rounded-xl font-bold text-sm">
                {getText(COPY.cta.bookNow)}
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </motion.button>
        </motion.div>
        
        {/* ════════════════════════════════════════════════════════════
            ESSENTIAL SERVICES (Always above fold, 2x2 grid)
        ════════════════════════════════════════════════════════════ */}
        <div>
          <h2 className="text-lg font-black text-gray-900 mb-4">
            {getText(COPY.sections.essential)}
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            {ESSENTIAL_SERVICES.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                onNavigate={onNavigate}
                language={language}
                delay={0.1 + (index * 0.05)}
              />
            ))}
          </div>
        </div>
        
        {/* ════════════════════════════════════════════════════════════
            TRAVEL & TRANSPORT (Intent: "I want to go somewhere")
        ════════════════════════════════════════════════════════════ */}
        <ServiceSection
          title={getText(COPY.sections.travel)}
          services={TRAVEL_SERVICES}
          onNavigate={onNavigate}
          language={language}
          startDelay={0.2}
        />
        
        {/* ════════════════════════════════════════════════════════════
            LIFESTYLE (Intent: "I need something today")
        ════════════════════════════════════════════════════════════ */}
        <ServiceSection
          title={getText(COPY.sections.lifestyle)}
          services={LIFESTYLE_SERVICES}
          onNavigate={onNavigate}
          language={language}
          startDelay={0.3}
        />
        
        {/* ════════════════════════════════════════════════════════════
            GOVERNMENT SERVICES (Intent: "Official business")
        ════════════════════════════════════════════════════════════ */}
        <ServiceSection
          title={getText(COPY.sections.government)}
          services={GOVERNMENT_SERVICES}
          onNavigate={onNavigate}
          language={language}
          startDelay={0.4}
        />
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// SERVICE CARD COMPONENT (Consistent, clean)
// ════════════════════════════════════════════════════════════

interface ServiceCardProps {
  service: Service;
  onNavigate: (route: string) => void;
  language: 'sw' | 'en';
  delay?: number;
}

function ServiceCard({ service, onNavigate, language, delay = 0 }: ServiceCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const Icon = service.icon;
  const getText = (obj: { sw: string; en: string }) => obj[language];
  
  return (
    <motion.button
      initial={MOTION.slideIn.initial}
      animate={MOTION.slideIn.animate}
      transition={MOTION.slideIn.transition(delay)}
      whileTap={prefersReducedMotion ? {} : { scale: MOTION.tap.scale }}
      onClick={() => onNavigate(service.route)}
      className="relative bg-white border border-gray-200 rounded-2xl p-4 hover:border-emerald-500 hover:shadow-lg transition-all text-left group active:shadow-sm"
    >
      {/* Badge */}
      {service.badge && (
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-0.5 text-[10px] font-black rounded-full uppercase ${
            service.badge === 'new'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-emerald-100 text-emerald-700'
          }`}>
            {getText(COPY.badges[service.badge])}
          </span>
        </div>
      )}
      
      {/* Icon (soft glass surface, NOT gradient) */}
      <div className={`w-12 h-12 ${service.iconBg} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
        <Icon className={`w-6 h-6 ${service.iconColor}`} />
      </div>
      
      {/* Title */}
      <h3 className="font-bold text-sm text-gray-900 mb-1 leading-tight pr-8">
        {getText(service.title)}
      </h3>
      
      {/* Benefit (ONE line: "What can I do?") */}
      <p className="text-xs text-gray-600 leading-snug line-clamp-2">
        {getText(service.benefit)}
      </p>
    </motion.button>
  );
}

// ════════════════════════════════════════════════════════════
// SERVICE SECTION COMPONENT (Grouped categories)
// ════════════════════════════════════════════════════════════

interface ServiceSectionProps {
  title: string;
  services: Service[];
  onNavigate: (route: string) => void;
  language: 'sw' | 'en';
  startDelay: number;
}

function ServiceSection({
  title,
  services,
  onNavigate,
  language,
  startDelay
}: ServiceSectionProps) {
  return (
    <div>
      <h2 className="text-lg font-black text-gray-900 mb-4">{title}</h2>
      
      <div className="grid grid-cols-2 gap-3">
        {services.map((service, index) => (
          <ServiceCard
            key={service.id}
            service={service}
            onNavigate={onNavigate}
            language={language}
            delay={startDelay + (index * 0.05)}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * ════════════════════════════════════════════════════════════
 * REMOVED SERVICES (Demo/Internal):
 * ════════════════════════════════════════════════════════════
 * 
 * ❌ AI Travel Assistant (AI branding)
 * ❌ AI Smart Shopping (AI branding)
 * ❌ Fraud Detection Dashboard (internal)
 * ❌ Behavioral Biometrics (internal)
 * ❌ Delivery Rider Dashboard (role-specific)
 * ❌ Admin Verification Portal (internal)
 * ❌ Alternative Credit Score (technical feature)
 * ❌ Mini Apps Marketplace (meta-feature)
 * 
 * PRINCIPLE:
 * Show only what user can DO right now.
 * Hide technical implementation.
 * No demo features in production UI.
 */
