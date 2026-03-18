/**
 * REWARDS - WORLD-CLASS (DESIGN MATURITY)
 * 
 * JOURNEY QUESTION: "What did I earn and what can I get?"
 * 
 * HIERARCHY:
 * 1. Hero: Points balance (dark gradient, calm)
 * 2. Supporting: What you can redeem NOW
 * 3. Quiet: History, tier info
 * 
 * PRINCIPLES APPLIED:
 * ✅ ONE gradient (points balance only)
 * ✅ Outcome language ("Tumia Pointi" not "Redemption System")
 * ✅ Progress through clarity (not gamification)
 * ✅ No flashy badges (calm tier display)
 * ✅ Clear value ("Get TSh 10,000" not "1000 points reward")
 * 
 * INSPIRED BY:
 * - Amex Points: Premium, not flashy
 * - Starbucks: Clear tier progress (boring is good)
 * - Revolut: Minimalist rewards
 * 
 * @version 5.0.0 (World-Class Maturity)
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  TrendingUp,
  ChevronRight,
  Percent,
  Plane,
  ShoppingBag,
  Coffee
} from 'lucide-react';

interface RewardsWorldClassProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
  language?: 'sw' | 'en';
  userPoints?: number;
  userTier?: 'bronze' | 'silver' | 'gold' | 'platinum';
}

// ════════════════════════════════════════════════════════════
// OUTCOME-FOCUSED COPY
// ════════════════════════════════════════════════════════════

const COPY = {
  title: { sw: 'Pointi Zangu', en: 'My Points' },
  
  // Hero
  yourPoints: { sw: 'Pointi Zako', en: 'Your Points' },
  tier: { sw: 'Kiwango', en: 'Tier' },
  
  // Supporting
  canRedeem: { sw: 'Unaweza Kupata', en: 'You Can Get' },
  redeem: { sw: 'Tumia', en: 'Redeem' },
  
  // Tier names
  tiers: {
    bronze: { sw: 'Shaba', en: 'Bronze' },
    silver: { sw: 'Fedha', en: 'Silver' },
    gold: { sw: 'Dhahabu', en: 'Gold' },
    platinum: { sw: 'Platinum', en: 'Platinum' }
  },
  
  // Progress
  pointsTo: { sw: 'pointi hadi', en: 'points to' },
  
  // Quiet
  history: { sw: 'Historia', en: 'History' },
  earned: { sw: 'Ulipata', en: 'Earned' },
  viewAll: { sw: 'Angalia Zote', en: 'View All' }
};

// ════════════════════════════════════════════════════════════
// TIER CONFIG (Minimal, no flashy badges)
// ════════════════════════════════════════════════════════════

const TIER_CONFIG = {
  bronze: {
    name: COPY.tiers.bronze,
    minPoints: 0,
    nextTier: 'silver',
    nextPoints: 5000
  },
  silver: {
    name: COPY.tiers.silver,
    minPoints: 5000,
    nextTier: 'gold',
    nextPoints: 15000
  },
  gold: {
    name: COPY.tiers.gold,
    minPoints: 15000,
    nextTier: 'platinum',
    nextPoints: 50000
  },
  platinum: {
    name: COPY.tiers.platinum,
    minPoints: 50000,
    nextTier: null,
    nextPoints: null
  }
};

// ════════════════════════════════════════════════════════════
// REDEMPTION OPTIONS (Clear value, not gamified)
// ════════════════════════════════════════════════════════════

const REDEMPTIONS = [
  {
    id: 'voucher_10k',
    icon: Percent,
    titleSw: 'TSh 10,000',
    titleEn: 'TSh 10,000',
    subtitleSw: 'Hati ya punguzo',
    subtitleEn: 'Discount voucher',
    points: 1000,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600'
  },
  {
    id: 'travel_20',
    icon: Plane,
    titleSw: 'Punguzo la 20%',
    titleEn: '20% Discount',
    subtitleSw: 'Safari yoyote',
    subtitleEn: 'Any travel',
    points: 2000,
    iconBg: 'bg-sky-50',
    iconColor: 'text-sky-600'
  },
  {
    id: 'cashback_50k',
    icon: ShoppingBag,
    titleSw: 'TSh 50,000',
    titleEn: 'TSh 50,000',
    subtitleSw: 'Rudi fedha',
    subtitleEn: 'Cash back',
    points: 5000,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600'
  }
];

// ════════════════════════════════════════════════════════════
// MOTION (CALM, EASE-OUT)
// ════════════════════════════════════════════════════════════

const MOTION = {
  fadeIn: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
  }
};

// ════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════

export function RewardsWorldClass({
  onBack,
  onNavigate,
  language = 'sw',
  userPoints = 8450,
  userTier = 'silver'
}: RewardsWorldClassProps) {
  const getText = (obj: { sw: string; en: string }) => obj[language];
  
  const currentTier = TIER_CONFIG[userTier];
  const tierName = getText(currentTier.name);
  
  // Calculate progress to next tier (if exists)
  const progressPercent = currentTier.nextPoints
    ? ((userPoints - currentTier.minPoints) / (currentTier.nextPoints - currentTier.minPoints)) * 100
    : 100;
  
  const pointsToNext = currentTier.nextPoints ? currentTier.nextPoints - userPoints : 0;
  
  // Filter redeemable options (user has enough points)
  const canRedeem = REDEMPTIONS.filter(r => r.points <= userPoints);
  const cannotRedeem = REDEMPTIONS.filter(r => r.points > userPoints);
  
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      
      {/* ════════════════════════════════════════════════════════════
          HEADER (MINIMAL)
      ════════════════════════════════════════════════════════════ */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-3">
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
      
      {/* ════════════════════════════════════════════════════════════
          HERO: POINTS BALANCE (ONLY GRADIENT, DARK)
      ════════════════════════════════════════════════════════════ */}
      <div className="px-6 py-6">
        <motion.div
          {...MOTION.fadeIn}
          className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-6 text-white shadow-xl"
        >
          {/* Tier Badge (quiet, not flashy) */}
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/10 px-3 py-1 rounded-lg">
              <span className="text-xs font-bold">{tierName}</span>
            </div>
          </div>
          
          {/* Points (Hero) */}
          <div className="mb-6">
            <p className="text-sm text-gray-400 mb-1">
              {getText(COPY.yourPoints)}
            </p>
            <p className="text-5xl font-black tracking-tight">
              {userPoints.toLocaleString()}
            </p>
          </div>
          
          {/* Progress to next tier (if exists) */}
          {currentTier.nextTier && (
            <div>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span>
                  {pointsToNext} {getText(COPY.pointsTo)}{' '}
                  {getText(TIER_CONFIG[currentTier.nextTier].name)}
                </span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progressPercent, 100)}%` }}
                  transition={{ duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  className="h-full bg-white rounded-full"
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>
      
      {/* ════════════════════════════════════════════════════════════
          SUPPORTING: WHAT YOU CAN REDEEM NOW
      ════════════════════════════════════════════════════════════ */}
      {canRedeem.length > 0 && (
        <div className="px-6 mb-6">
          <h3 className="text-sm font-bold text-gray-900 mb-3">
            {getText(COPY.canRedeem)}
          </h3>
          <div className="space-y-3">
            {canRedeem.map((option, index) => (
              <RedemptionCard
                key={option.id}
                option={option}
                language={language}
                canRedeem={true}
                onRedeem={() => {}}
                delay={index * 0.05}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Locked options (quiet, minimal) */}
      {cannotRedeem.length > 0 && (
        <div className="px-6 mb-6">
          <h3 className="text-sm font-bold text-gray-600 mb-3">
            {language === 'sw' ? 'Fungua Baadaye' : 'Unlock Later'}
          </h3>
          <div className="space-y-2">
            {cannotRedeem.map((option, index) => (
              <RedemptionCard
                key={option.id}
                option={option}
                language={language}
                canRedeem={false}
                onRedeem={() => {}}
                delay={index * 0.05}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* ════════════════════════════════════════════════════════════
          QUIET: RECENT HISTORY (MINIMAL)
      ════════════════════════════════════════════════════════════ */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-600">
            {getText(COPY.history)}
          </h3>
          <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            {getText(COPY.viewAll)}
          </button>
        </div>
        
        <div className="space-y-2">
          <HistoryItem
            title={language === 'sw' ? 'Malipo ya Bili' : 'Bill Payment'}
            points={45}
            time={language === 'sw' ? 'Saa 2 zilizopita' : '2 hours ago'}
            type="earned"
          />
          <HistoryItem
            title={language === 'sw' ? 'Safari ya Basi' : 'Bus Trip'}
            points={150}
            time={language === 'sw' ? 'Jana' : 'Yesterday'}
            type="earned"
          />
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// REDEMPTION CARD (NEUTRAL, CLEAR VALUE)
// ════════════════════════════════════════════════════════════

interface RedemptionCardProps {
  option: typeof REDEMPTIONS[0];
  language: 'sw' | 'en';
  canRedeem: boolean;
  onRedeem: () => void;
  delay: number;
}

function RedemptionCard({ option, language, canRedeem, onRedeem, delay }: RedemptionCardProps) {
  const Icon = option.icon;
  const title = language === 'sw' ? option.titleSw : option.titleEn;
  const subtitle = language === 'sw' ? option.subtitleSw : option.subtitleEn;
  const getText = (obj: { sw: string; en: string }) => obj[language];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay, ease: [0.4, 0, 0.2, 1] }}
      className={`
        bg-white border border-gray-200 rounded-2xl p-4
        ${canRedeem ? 'hover:border-gray-300 hover:shadow-md' : 'opacity-60'}
        transition-all
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 ${option.iconBg} rounded-xl flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${option.iconColor}`} />
          </div>
          <div>
            <p className="font-bold text-gray-900">{title}</p>
            <p className="text-sm text-gray-600">{subtitle}</p>
            <p className="text-xs text-gray-500 mt-1">
              {option.points.toLocaleString()} {language === 'sw' ? 'pointi' : 'points'}
            </p>
          </div>
        </div>
        
        {canRedeem && (
          <button
            onClick={onRedeem}
            className="bg-gray-900 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors active:scale-95"
          >
            {getText(COPY.redeem)}
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════
// HISTORY ITEM (QUIET, MINIMAL)
// ════════════════════════════════════════════════════════════

interface HistoryItemProps {
  title: string;
  points: number;
  time: string;
  type: 'earned' | 'redeemed';
}

function HistoryItem({ title, points, time, type }: HistoryItemProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`
          w-8 h-8 rounded-lg flex items-center justify-center
          ${type === 'earned' ? 'bg-emerald-50' : 'bg-gray-100'}
        `}>
          <TrendingUp className={`w-4 h-4 ${type === 'earned' ? 'text-emerald-600' : 'text-gray-600'}`} />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">{title}</p>
          <p className="text-xs text-gray-500">{time}</p>
        </div>
      </div>
      
      <p className={`text-sm font-black ${type === 'earned' ? 'text-emerald-600' : 'text-gray-900'}`}>
        {type === 'earned' ? '+' : '-'}{points}
      </p>
    </div>
  );
}

/**
 * ════════════════════════════════════════════════════════════
 * WORLD-CLASS CHANGES:
 * ════════════════════════════════════════════════════════════
 * 
 * ❌ REMOVED:
 * - Multiple gradients (tier-specific colors)
 * - Flashy badges ("YOU'RE GOLD!")
 * - Gamification (confetti, animations)
 * - Unclear value ("1000 points reward")
 * - Feature language ("Redemption System")
 * 
 * ✅ IMPROVED:
 * - ONE dark gradient (points balance only)
 * - Calm tier display (just a label, not celebration)
 * - Clear value ("TSh 10,000" not "1000 points")
 * - Outcome language ("Tumia Pointi" not "Redeem Points")
 * - Progress through clarity (simple bar, %)
 * - Neutral cards (no color explosion)
 * 
 * QUESTION ANSWERED:
 * "What did I earn and what can I get?"
 * → You have 8,450 points. You can get TSh 10,000 now.
 * 
 * ENGAGEMENT:
 * Not through badges/flashy animations.
 * Through clarity: "I see exactly what I can get."
 * 
 * INSPIRATION:
 * - Amex: Premium rewards, not gamified
 * - Starbucks: Boring progress bar = trusted
 * - Revolut: Minimal, no hype
 */
