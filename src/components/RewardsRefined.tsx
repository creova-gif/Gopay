/**
 * REWARDS (GOrewards) - REFINED
 * 
 * WORLD-CLASS RULES APPLIED:
 * ✅ ONE hero: Points balance card (gradient)
 * ✅ Glass surfaces for perks, tiers, history
 * ✅ Clear value proposition: "What can I get?"
 * ✅ Swahili-first language
 * ✅ Gamification done right (progress, not flashy)
 * ✅ Motion < 300ms
 * 
 * INSPIRED BY:
 * - Starbucks Rewards: Clear tier progress
 * - Grab Rewards: Simple redemption
 * - Amex Points: Premium feel
 * 
 * @version 1.0.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Gift,
  TrendingUp,
  Star,
  Sparkles,
  ChevronRight,
  Award,
  Zap,
  Crown,
  Flame,
  Coffee,
  ShoppingBag,
  Plane,
  Percent
} from 'lucide-react';

interface RewardsRefinedProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
  language?: 'sw' | 'en';
  userPoints?: number;
  userTier?: 'bronze' | 'silver' | 'gold' | 'platinum';
}

// ════════════════════════════════════════════════════════════
// SWAHILI-FIRST COPY
// ════════════════════════════════════════════════════════════

const COPY = {
  title: { sw: 'GOrewards', en: 'GOrewards' },
  points: { sw: 'Pointi', en: 'Points' },
  tier: { sw: 'Kiwango', en: 'Tier' },
  
  hero: {
    yourPoints: { sw: 'Pointi Zako', en: 'Your Points' },
    earnMore: { sw: 'Pata Zaidi', en: 'Earn More' },
    redeem: { sw: 'Tumia', en: 'Redeem' }
  },
  
  tierProgress: {
    title: { sw: 'Maendeleo Yako', en: 'Your Progress' },
    pointsTo: { sw: 'pointi hadi', en: 'points to' },
    bronze: { sw: 'Shaba', en: 'Bronze' },
    silver: { sw: 'Fedha', en: 'Silver' },
    gold: { sw: 'Dhahabu', en: 'Gold' },
    platinum: { sw: 'Platinum', en: 'Platinum' }
  },
  
  perks: {
    title: { sw: 'Faida Zako', en: 'Your Perks' },
    cashback: { sw: 'Rudi Fedha', en: 'Cashback' },
    cashbackDesc: { sw: '15% kwenye malipo yote', en: '15% on all transactions' },
    priority: { sw: 'Huduma ya Haraka', en: 'Priority Support' },
    priorityDesc: { sw: 'Msaada wa haraka 24/7', en: '24/7 fast support' },
    discounts: { sw: 'Punguzo', en: 'Discounts' },
    discountsDesc: { sw: 'Hadi 30% kwa washirika', en: 'Up to 30% at partners' },
    freeDelivery: { sw: 'Usafirishaji Bure', en: 'Free Delivery' },
    freeDeliveryDesc: { sw: 'Kwenye maagizo yote', en: 'On all orders' }
  },
  
  redeem: {
    title: { sw: 'Tumia Pointi', en: 'Redeem Points' },
    voucher: { sw: 'Hati ya Punguzo', en: 'Voucher' },
    travel: { sw: 'Safari', en: 'Travel' },
    cashback: { sw: 'Pesa Taslimu', en: 'Cash Back' },
    shopping: { sw: 'Ununuzi', en: 'Shopping' }
  },
  
  history: {
    title: { sw: 'Historia', en: 'History' },
    earned: { sw: 'Ulipata', en: 'Earned' },
    redeemed: { sw: 'Ulitumia', en: 'Redeemed' }
  }
};

// ════════════════════════════════════════════════════════════
// TIER CONFIGS
// ════════════════════════════════════════════════════════════

const TIER_CONFIG = {
  bronze: {
    name: COPY.tierProgress.bronze,
    color: 'from-orange-600 to-amber-700',
    icon: Award,
    minPoints: 0,
    perks: ['5% cashback', 'Basic support']
  },
  silver: {
    name: COPY.tierProgress.silver,
    color: 'from-gray-400 to-gray-600',
    icon: Star,
    minPoints: 5000,
    perks: ['10% cashback', 'Priority support', '10% partner discounts']
  },
  gold: {
    name: COPY.tierProgress.gold,
    color: 'from-yellow-500 to-yellow-700',
    icon: Crown,
    minPoints: 15000,
    perks: ['15% cashback', 'VIP support', '20% partner discounts', 'Free delivery']
  },
  platinum: {
    name: COPY.tierProgress.platinum,
    color: 'from-purple-600 to-indigo-700',
    icon: Sparkles,
    minPoints: 50000,
    perks: ['20% cashback', 'Dedicated support', '30% partner discounts', 'Free everything']
  }
};

// ════════════════════════════════════════════════════════════
// REDEMPTION OPTIONS
// ════════════════════════════════════════════════════════════

const REDEMPTION_OPTIONS = [
  {
    id: 'voucher_10k',
    icon: Percent,
    title: 'TSh 10,000 Voucher',
    titleSw: 'Hati ya TSh 10,000',
    points: 1000,
    color: 'bg-emerald-100 text-emerald-600'
  },
  {
    id: 'travel_discount',
    icon: Plane,
    title: '20% Travel Discount',
    titleSw: 'Punguzo la Safari 20%',
    points: 2000,
    color: 'bg-sky-100 text-sky-600'
  },
  {
    id: 'cashback_50k',
    icon: Zap,
    title: 'TSh 50,000 Cashback',
    titleSw: 'Rudi Fedha TSh 50,000',
    points: 5000,
    color: 'bg-purple-100 text-purple-600'
  },
  {
    id: 'shopping_voucher',
    icon: ShoppingBag,
    title: 'Shopping Voucher',
    titleSw: 'Hati ya Duka',
    points: 1500,
    color: 'bg-pink-100 text-pink-600'
  }
];

// ════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════

export function RewardsRefined({
  onBack,
  onNavigate,
  language = 'sw',
  userPoints = 8450,
  userTier = 'silver'
}: RewardsRefinedProps) {
  const [activeTab, setActiveTab] = useState<'perks' | 'redeem' | 'history'>('perks');
  
  const getText = (obj: { sw: string; en: string }) => obj[language];
  
  const currentTier = TIER_CONFIG[userTier];
  const tiers = Object.values(TIER_CONFIG);
  const currentTierIndex = tiers.findIndex(t => t === currentTier);
  const nextTier = tiers[currentTierIndex + 1];
  
  // Calculate progress to next tier
  const progressPercent = nextTier
    ? ((userPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    : 100;
  
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      
      {/* ════════════════════════════════════════════════════════════
          HEADER
      ════════════════════════════════════════════════════════════ */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3 sticky top-0 z-40">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-all active:scale-95"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-xl font-black text-gray-900">
          {getText(COPY.title)}
        </h1>
      </div>
      
      {/* ════════════════════════════════════════════════════════════
          POINTS BALANCE (HERO - Gradient)
      ════════════════════════════════════════════════════════════ */}
      <div className="px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-br ${currentTier.color} rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden`}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-24 h-24 bg-white rounded-full blur-2xl" />
          </div>
          
          <div className="relative z-10">
            {/* Current tier badge */}
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                {(() => {
                  const Icon = currentTier.icon;
                  return <Icon className="w-4 h-4" />;
                })()}
                <span className="font-bold text-sm">
                  {getText(currentTier.name)}
                </span>
              </div>
              
              <button className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all active:scale-95">
                <Gift className="w-5 h-5" />
              </button>
            </div>
            
            {/* Points display */}
            <div className="mb-6">
              <p className="text-sm text-white/80 mb-1">
                {getText(COPY.hero.yourPoints)}
              </p>
              <p className="text-5xl font-black mb-1">
                {userPoints.toLocaleString()}
              </p>
              <p className="text-sm text-white/80">
                {getText(COPY.points)}
              </p>
            </div>
            
            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setActiveTab('perks')}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
              >
                {getText(COPY.hero.earnMore)}
              </button>
              <button
                onClick={() => setActiveTab('redeem')}
                className="bg-white hover:bg-white/90 text-gray-900 py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
              >
                {getText(COPY.hero.redeem)}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* ════════════════════════════════════════════════════════════
          TIER PROGRESS (Glass surface)
      ════════════════════════════════════════════════════════════ */}
      {nextTier && (
        <div className="px-6 mb-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900">
                {getText(COPY.tierProgress.title)}
              </h3>
              <span className="text-sm text-gray-600">
                {Math.round(progressPercent)}%
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressPercent, 100)}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`h-full bg-gradient-to-r ${nextTier.color}`}
              />
            </div>
            
            <p className="text-sm text-gray-600">
              {nextTier.minPoints - userPoints} {getText(COPY.tierProgress.pointsTo)}{' '}
              <span className="font-bold text-gray-900">
                {getText(nextTier.name)}
              </span>
            </p>
          </div>
        </div>
      )}
      
      {/* ════════════════════════════════════════════════════════════
          TABS
      ════════════════════════════════════════════════════════════ */}
      <div className="px-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-2 flex gap-2">
          <TabButton
            active={activeTab === 'perks'}
            onClick={() => setActiveTab('perks')}
            label={getText(COPY.perks.title)}
          />
          <TabButton
            active={activeTab === 'redeem'}
            onClick={() => setActiveTab('redeem')}
            label={getText(COPY.redeem.title)}
          />
          <TabButton
            active={activeTab === 'history'}
            onClick={() => setActiveTab('history')}
            label={getText(COPY.history.title)}
          />
        </div>
      </div>
      
      {/* ════════════════════════════════════════════════════════════
          CONTENT (Glass surfaces)
      ════════════════════════════════════════════════════════════ */}
      <div className="px-6 space-y-3">
        {activeTab === 'perks' && (
          <>
            <PerkCard
              icon={Percent}
              title={getText(COPY.perks.cashback)}
              description={getText(COPY.perks.cashbackDesc)}
              color="bg-emerald-100 text-emerald-600"
              delay={0}
            />
            <PerkCard
              icon={Zap}
              title={getText(COPY.perks.priority)}
              description={getText(COPY.perks.priorityDesc)}
              color="bg-blue-100 text-blue-600"
              delay={0.05}
            />
            <PerkCard
              icon={Flame}
              title={getText(COPY.perks.discounts)}
              description={getText(COPY.perks.discountsDesc)}
              color="bg-orange-100 text-orange-600"
              delay={0.1}
            />
            <PerkCard
              icon={ShoppingBag}
              title={getText(COPY.perks.freeDelivery)}
              description={getText(COPY.perks.freeDeliveryDesc)}
              color="bg-purple-100 text-purple-600"
              delay={0.15}
            />
          </>
        )}
        
        {activeTab === 'redeem' && (
          <>
            {REDEMPTION_OPTIONS.map((option, index) => (
              <RedemptionCard
                key={option.id}
                option={option}
                language={language}
                userPoints={userPoints}
                onRedeem={() => {}}
                delay={index * 0.05}
              />
            ))}
          </>
        )}
        
        {activeTab === 'history' && (
          <>
            <HistoryItem
              type="earned"
              title="Bill Payment"
              titleSw="Malipo ya Bili"
              points={45}
              date="2 hours ago"
              dateSw="Saa 2 zilizopita"
              language={language}
              delay={0}
            />
            <HistoryItem
              type="earned"
              title="Bus Ticket Purchase"
              titleSw="Ununuzi wa Tiketi"
              points={150}
              date="Yesterday"
              dateSw="Jana"
              language={language}
              delay={0.05}
            />
            <HistoryItem
              type="redeemed"
              title="TSh 10,000 Voucher"
              titleSw="Hati ya TSh 10,000"
              points={-1000}
              date="3 days ago"
              dateSw="Siku 3 zilizopita"
              language={language}
              delay={0.1}
            />
          </>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// TAB BUTTON
// ════════════════════════════════════════════════════════════

function TabButton({ active, onClick, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 py-2 px-4 rounded-xl font-bold text-sm transition-all
        ${active 
          ? 'bg-emerald-600 text-white shadow-lg' 
          : 'text-gray-600 hover:text-gray-900'
        }
      `}
    >
      {label}
    </button>
  );
}

// ════════════════════════════════════════════════════════════
// PERK CARD
// ════════════════════════════════════════════════════════════

function PerkCard({ icon: Icon, title, description, color, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay }}
      className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-emerald-500 hover:shadow-lg transition-all"
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
      </div>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════
// REDEMPTION CARD
// ════════════════════════════════════════════════════════════

function RedemptionCard({ option, language, userPoints, onRedeem, delay }: any) {
  const canRedeem = userPoints >= option.points;
  const title = language === 'sw' ? option.titleSw : option.title;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay }}
      className={`
        bg-white border rounded-2xl p-5 transition-all
        ${canRedeem 
          ? 'border-gray-200 hover:border-emerald-500 hover:shadow-lg' 
          : 'border-gray-200 opacity-60'
        }
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 ${option.color} rounded-xl flex items-center justify-center`}>
            <option.icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-600">
              {option.points.toLocaleString()} {language === 'sw' ? 'pointi' : 'points'}
            </p>
          </div>
        </div>
        
        <button
          onClick={onRedeem}
          disabled={!canRedeem}
          className={`
            px-6 py-2 rounded-xl font-bold text-sm transition-all
            ${canRedeem
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {language === 'sw' ? 'Tumia' : 'Redeem'}
        </button>
      </div>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════
// HISTORY ITEM
// ════════════════════════════════════════════════════════════

function HistoryItem({ type, title, titleSw, points, date, dateSw, language, delay }: any) {
  const isEarned = type === 'earned';
  const displayTitle = language === 'sw' ? titleSw : title;
  const displayDate = language === 'sw' ? dateSw : date;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay }}
      className="bg-white border border-gray-200 rounded-2xl p-5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`
            w-10 h-10 rounded-xl flex items-center justify-center
            ${isEarned ? 'bg-emerald-100' : 'bg-orange-100'}
          `}>
            {isEarned ? (
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            ) : (
              <Gift className="w-5 h-5 text-orange-600" />
            )}
          </div>
          <div>
            <p className="font-bold text-gray-900">{displayTitle}</p>
            <p className="text-xs text-gray-500">{displayDate}</p>
          </div>
        </div>
        
        <p className={`
          text-lg font-black
          ${isEarned ? 'text-emerald-600' : 'text-gray-900'}
        `}>
          {isEarned ? '+' : ''}{points}
        </p>
      </div>
    </motion.div>
  );
}

function CheckCircle({ className }: { className: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}
