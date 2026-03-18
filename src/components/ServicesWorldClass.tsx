/**
 * SERVICES - WORLD-CLASS (DESIGN MATURITY)
 * 
 * JOURNEY QUESTION: "What can I do next?"
 * 
 * HIERARCHY:
 * 1. Hero: ONE featured service (outcome-focused)
 * 2. Supporting: Intent groups (not feature categories)
 * 3. Quiet: Everything else (neutral, minimal)
 * 
 * PRINCIPLES APPLIED:
 * ✅ Intent-based ("Safiri" not "Travel Booking System")
 * ✅ Outcome language ("Pata Tiketi za SGR" not "SGR Service")
 * ✅ ONE gradient (featured only)
 * ✅ No AI branding (intelligence hidden)
 * ✅ Reduce color saturation (calm > flashy)
 * 
 * INSPIRED BY:
 * - Revolut: Curated, not catalog
 * - PayPal: Boring is premium
 * - Alipay: Intent-based groups
 * 
 * @version 5.0.0 (World-Class Maturity)
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Search,
  ChevronRight,
  Plane,
  Bus,
  Ship,
  Building2,
  ShoppingBag,
  Utensils,
  GraduationCap,
  Heart,
  Landmark
} from 'lucide-react';

interface ServicesWorldClassProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
  language?: 'sw' | 'en';
  userLocation?: 'dar' | 'zanzibar' | 'arusha' | 'other';
}

// ════════════════════════════════════════════════════════════
// OUTCOME-FOCUSED COPY
// ════════════════════════════════════════════════════════════

const COPY = {
  title: { sw: 'Huduma', en: 'Services' },
  search: { sw: 'Tafuta huduma...', en: 'Search services...' },
  
  // Intent Groups (not feature categories)
  groups: {
    travel: { sw: 'Safiri', en: 'Travel' },
    daily: { sw: 'Kila Siku', en: 'Daily Life' },
    money: { sw: 'Fedha', en: 'Money' },
    official: { sw: 'Rasmi', en: 'Official' }
  }
};

// ════════════════════════════════════════════════════════════
// FEATURED SERVICES (Regional, Context-Aware)
// ════════════════════════════════════════════════════════════

const FEATURED_SERVICES = {
  dar: {
    id: 'sgr',
    titleSw: 'Treni ya Mwendo Kasi (SGR)',
    titleEn: 'SGR Express Train',
    subtitleSw: 'Dar → Morogoro → Dodoma',
    subtitleEn: 'Dar → Morogoro → Dodoma',
    ctaSw: 'Pata Tiketi',
    ctaEn: 'Get Tickets',
    gradient: 'from-indigo-600 to-blue-700'
  },
  zanzibar: {
    id: 'ferry',
    titleSw: 'Feri ya Azam Marine',
    titleEn: 'Azam Marine Ferry',
    subtitleSw: 'Zanzibar ↔ Dar es Salaam',
    subtitleEn: 'Zanzibar ↔ Dar es Salaam',
    ctaSw: 'Pata Tiketi',
    ctaEn: 'Get Tickets',
    gradient: 'from-cyan-600 to-blue-700'
  },
  arusha: {
    id: 'safaris',
    titleSw: 'Safari za Serengeti',
    titleEn: 'Serengeti Safaris',
    subtitleSw: 'Vivutio vya taifa vilivyochaguliwa',
    subtitleEn: 'Verified national park tours',
    ctaSw: 'Angalia Safari',
    ctaEn: 'View Safaris',
    gradient: 'from-amber-600 to-orange-700'
  },
  other: {
    id: 'flights',
    titleSw: 'Ndege za Ndani',
    titleEn: 'Domestic Flights',
    subtitleSw: 'Dar, Zanzibar, Arusha, Mwanza',
    subtitleEn: 'Dar, Zanzibar, Arusha, Mwanza',
    ctaSw: 'Angalia Ndege',
    ctaEn: 'View Flights',
    gradient: 'from-sky-600 to-blue-700'
  }
};

// ════════════════════════════════════════════════════════════
// CURATED SERVICES (Intent-based, not features)
// ════════════════════════════════════════════════════════════

const SERVICES = [
  // TRAVEL (Intent: "I need to go somewhere")
  {
    group: 'travel',
    id: 'flights',
    iconBg: 'bg-sky-50',
    iconColor: 'text-sky-600',
    icon: Plane,
    titleSw: 'Ndege',
    titleEn: 'Flights',
    subtitleSw: 'Safari za ndani na nje',
    subtitleEn: 'Domestic & regional'
  },
  {
    group: 'travel',
    id: 'buses',
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
    icon: Bus,
    titleSw: 'Mabasi',
    titleEn: 'Buses',
    subtitleSw: 'Safari za mikoa',
    subtitleEn: 'Intercity travel'
  },
  {
    group: 'travel',
    id: 'ferries',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    icon: Ship,
    titleSw: 'Feri',
    titleEn: 'Ferries',
    subtitleSw: 'Dar ↔ Zanzibar',
    subtitleEn: 'Dar ↔ Zanzibar'
  },
  {
    group: 'travel',
    id: 'hotels',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    icon: Building2,
    titleSw: 'Hoteli',
    titleEn: 'Hotels',
    subtitleSw: 'Malazi yaliyochaguliwa',
    subtitleEn: 'Verified stays'
  },
  
  // DAILY LIFE (Intent: "I need something today")
  {
    group: 'daily',
    id: 'food',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
    icon: Utensils,
    titleSw: 'Chakula',
    titleEn: 'Food',
    subtitleSw: 'Utoaji wa haraka',
    subtitleEn: 'Fast delivery'
  },
  {
    group: 'daily',
    id: 'shopping',
    iconBg: 'bg-pink-50',
    iconColor: 'text-pink-600',
    icon: ShoppingBag,
    titleSw: 'Duka',
    titleEn: 'Shopping',
    subtitleSw: 'Bidhaa za kila siku',
    subtitleEn: 'Daily essentials'
  },
  
  // MONEY (Intent: "I need financial help")
  {
    group: 'money',
    id: 'loans',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    icon: Landmark,
    titleSw: 'Mikopo Midogo',
    titleEn: 'Micro Loans',
    subtitleSw: 'Pesa haraka unapohitaji',
    subtitleEn: 'Quick cash when needed'
  },
  
  // OFFICIAL (Intent: "I need government service")
  {
    group: 'official',
    id: 'government',
    iconBg: 'bg-slate-50',
    iconColor: 'text-slate-600',
    icon: Landmark,
    titleSw: 'Huduma za Serikali',
    titleEn: 'Government Services',
    subtitleSw: 'TRA, NIDA, kodi',
    subtitleEn: 'TRA, NIDA, taxes'
  },
  {
    group: 'official',
    id: 'education',
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    icon: GraduationCap,
    titleSw: 'Elimu',
    titleEn: 'Education',
    subtitleSw: 'Ada za shule na vyuo',
    subtitleEn: 'School & college fees'
  },
  {
    group: 'official',
    id: 'health',
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    icon: Heart,
    titleSw: 'Afya',
    titleEn: 'Health',
    subtitleSw: 'Bima na zahanati',
    subtitleEn: 'Insurance & clinics'
  }
];

// ════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════

export function ServicesWorldClass({
  onBack,
  onNavigate,
  language = 'sw',
  userLocation = 'dar'
}: ServicesWorldClassProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const getText = (obj: { sw: string; en: string }) => obj[language];
  
  // Get regional featured service
  const featured = FEATURED_SERVICES[userLocation];
  const featuredTitle = language === 'sw' ? featured.titleSw : featured.titleEn;
  const featuredSubtitle = language === 'sw' ? featured.subtitleSw : featured.subtitleEn;
  const featuredCta = language === 'sw' ? featured.ctaSw : featured.ctaEn;
  
  // Group services by intent
  const groupedServices = SERVICES.reduce((acc, service) => {
    if (!acc[service.group]) acc[service.group] = [];
    acc[service.group].push(service);
    return acc;
  }, {} as Record<string, typeof SERVICES>);
  
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      
      {/* ════════════════════════════════════════════════════════════
          HEADER (Minimal)
      ════════════════════════════════════════════════════════════ */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-xl font-black text-gray-900">
            {getText(COPY.title)}
          </h1>
        </div>
        
        {/* Search (quiet) */}
        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={getText(COPY.search)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-gray-300 transition-colors"
            />
          </div>
        </div>
      </div>
      
      {/* ════════════════════════════════════════════════════════════
          HERO: FEATURED SERVICE (ONLY GRADIENT)
      ════════════════════════════════════════════════════════════ */}
      <div className="px-6 py-6">
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          onClick={() => onNavigate(featured.id)}
          className={`
            w-full bg-gradient-to-br ${featured.gradient} 
            rounded-3xl p-6 text-white text-left shadow-xl
            hover:shadow-2xl transition-shadow active:scale-[0.98]
          `}
        >
          <div className="mb-4">
            <h2 className="text-2xl font-black mb-2">{featuredTitle}</h2>
            <p className="text-sm text-white/90">{featuredSubtitle}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold">{featuredCta}</span>
            <ChevronRight className="w-5 h-5" />
          </div>
        </motion.button>
      </div>
      
      {/* ════════════════════════════════════════════════════════════
          SUPPORTING: INTENT GROUPS (NO GRADIENTS)
      ════════════════════════════════════════════════════════════ */}
      <div className="px-6 space-y-8">
        
        {/* Travel Group */}
        <ServiceGroup
          title={getText(COPY.groups.travel)}
          services={groupedServices.travel || []}
          language={language}
          onNavigate={onNavigate}
        />
        
        {/* Daily Life Group */}
        <ServiceGroup
          title={getText(COPY.groups.daily)}
          services={groupedServices.daily || []}
          language={language}
          onNavigate={onNavigate}
        />
        
        {/* Money Group */}
        <ServiceGroup
          title={getText(COPY.groups.money)}
          services={groupedServices.money || []}
          language={language}
          onNavigate={onNavigate}
        />
        
        {/* Official Group */}
        <ServiceGroup
          title={getText(COPY.groups.official)}
          services={groupedServices.official || []}
          language={language}
          onNavigate={onNavigate}
        />
        
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// SERVICE GROUP (Intent-based)
// ════════════════════════════════════════════════════════════

interface ServiceGroupProps {
  title: string;
  services: typeof SERVICES;
  language: 'sw' | 'en';
  onNavigate: (page: string) => void;
}

function ServiceGroup({ title, services, language, onNavigate }: ServiceGroupProps) {
  return (
    <div>
      <h3 className="text-sm font-bold text-gray-900 mb-3">{title}</h3>
      <div className="grid grid-cols-2 gap-3">
        {services.map((service, index) => (
          <ServiceCard
            key={service.id}
            service={service}
            language={language}
            onNavigate={onNavigate}
            delay={index * 0.05}
          />
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// SERVICE CARD (Neutral, minimal - NO GRADIENT)
// ════════════════════════════════════════════════════════════

interface ServiceCardProps {
  service: typeof SERVICES[0];
  language: 'sw' | 'en';
  onNavigate: (page: string) => void;
  delay: number;
}

function ServiceCard({ service, language, onNavigate, delay }: ServiceCardProps) {
  const Icon = service.icon;
  const title = language === 'sw' ? service.titleSw : service.titleEn;
  const subtitle = language === 'sw' ? service.subtitleSw : service.subtitleEn;
  
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay, ease: [0.4, 0, 0.2, 1] }}
      onClick={() => onNavigate(service.id)}
      className="bg-white border border-gray-200 rounded-2xl p-4 text-left hover:border-gray-300 hover:shadow-md transition-all active:scale-95"
    >
      <div className={`w-12 h-12 ${service.iconBg} rounded-xl flex items-center justify-center mb-3`}>
        <Icon className={`w-6 h-6 ${service.iconColor}`} />
      </div>
      
      <h4 className="text-sm font-bold text-gray-900 mb-1">{title}</h4>
      <p className="text-xs text-gray-600 leading-tight">{subtitle}</p>
    </motion.button>
  );
}

/**
 * ════════════════════════════════════════════════════════════
 * CHANGES FROM PREVIOUS VERSION:
 * ════════════════════════════════════════════════════════════
 * 
 * ❌ REMOVED:
 * - Multiple gradients on service cards
 * - Feature-forward language ("Travel Booking System")
 * - 70+ service catalog
 * - Demo/internal tools
 * - Color saturation overload
 * 
 * ✅ IMPROVED:
 * - ONE gradient (featured service only)
 * - Outcome language ("Pata Tiketi za SGR" not "SGR Service")
 * - Intent-based groups ("Safiri" not "Travel Category")
 * - Regional featured service (Dar = SGR, Zanzibar = Ferry)
 * - Neutral service cards (white bg, soft colored icons)
 * - Reduced from 17 to 10 curated services
 * 
 * HIERARCHY:
 * 1. Hero: Featured service (gradient, regional)
 * 2. Supporting: Intent groups (Travel, Daily, Money, Official)
 * 3. Quiet: Search (optional, minimal)
 * 
 * QUESTION ANSWERED:
 * "What can I do next?" → Clear intent-based options
 * 
 * TRUST:
 * User feels: "This is organized, I know where to go"
 */
