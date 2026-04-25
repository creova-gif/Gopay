import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../App';
import {
  ArrowLeft, Gift, Star, Trophy, Coins, ShoppingBag, Ticket, ChevronRight,
  Zap, Crown, TrendingUp, Users, MapPin, Calendar, Award, Sparkles,
  Target, Lock, Percent, DollarSign, Phone, Wifi, WifiOff, Bell,
  MessageSquare, Shield, Flame, BadgeCheck, Heart, Home, Store, Banknote,
  Wallet, ArrowRight, Check, X, Play, Send, Download, Upload, Settings,
  Info, AlertCircle, TrendingDown, Clock, Repeat, Filter, Search,
  Share2, Eye, EyeOff, CreditCard, GraduationCap
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface GOrewardsUltimateProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

// Icon lookups replacing structural emojis
const TIER_ICONS = { Bronze: Award, Silver: Star, Gold: Flame, Platinum: Crown } as const;
const TIER_ICON_COLORS = {
  Bronze: 'text-amber-500', Silver: 'text-slate-300',
  Gold: 'text-yellow-400', Platinum: 'text-purple-400',
} as const;

const ACHIEVEMENT_ICON_MAP: Record<string, React.ElementType> = {
  '1': Flame, '2': Target, '3': Star, '4': BadgeCheck,
  '5': GraduationCap, '6': Trophy, '7': Crown, '8': MapPin,
};

const EVENT_ICON_MAP: Record<string, React.ElementType> = { '1': Star, '2': GraduationCap, '3': Zap };
const EVENT_ICON_COLOR: Record<string, string> = { '1': 'text-indigo-300', '2': 'text-green-300', '3': 'text-red-300' };

const CASHBACK_TIER_ICONS = { Bronze: Award, Silver: Star, Gold: Flame, Platinum: Crown } as const;
const CASHBACK_TIER_COLORS = { Bronze: 'text-amber-500', Silver: 'text-slate-300', Gold: 'text-yellow-400', Platinum: 'text-purple-400' } as const;

export function GOrewardsUltimate({ user, accessToken, onBack }: GOrewardsUltimateProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'earn' | 'marketplace' | 'cashback' | 'family' | 'achievements' | 'ai'>('home');
  const [points, setPoints] = useState(0);
  const [tier, setTier] = useState('Bronze');
  const [cashbackBalance, setCashbackBalance] = useState(0);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [streak, setStreak] = useState(0);
  const [surpriseRewards, setSurpriseRewards] = useState<{ type: string; value: string }[]>([]);
  const [showSurprise, setShowSurprise] = useState(false);

  useEffect(() => {
    fetchRewardsData();
    checkForSurpriseReward();
  }, []);

  const fetchRewardsData = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/rewards/balance`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (response.ok) {
        const data = await response.json();
        setPoints(data.points || 0);
        setTier(data.tier || 'Bronze');
        setCashbackBalance(data.cashback || 0);
        setTodayEarnings(data.todayEarnings || 0);
        setStreak(data.streak || 0);
      }
    } catch {
      setPoints(4250); setTier('Gold'); setCashbackBalance(45000); setTodayEarnings(250); setStreak(12);
    }
  };

  const checkForSurpriseReward = () => {
    if (Math.random() > 0.7) {
      const surprises = [
        { type: 'bundle', value: '500 MB' },
        { type: 'cash', value: 'TZS 500' },
        { type: 'delivery', value: 'Free Delivery' },
        { type: 'points', value: '100 Points' },
      ];
      setSurpriseRewards([surprises[Math.floor(Math.random() * surprises.length)]]);
      setShowSurprise(true);
    }
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 }).format(n);

  // ── Data ─────────────────────────────────────────────────────────────────────
  const tiers = [
    { name: 'Bronze', color: 'from-orange-400 to-amber-600', multiplier: '1×', requirement: 'Just joined', benefits: ['Earn points', 'Basic cashback', 'Access marketplace'], nextTier: 1000, current: tier === 'Bronze' },
    { name: 'Silver', color: 'from-slate-300 to-gray-500', multiplier: '1.5×', requirement: '1,000+ points earned', benefits: ['1.5× rewards', '1% cashback', 'Monthly surprises', 'Priority support'], nextTier: 5000, current: tier === 'Silver' },
    { name: 'Gold', color: 'from-yellow-400 to-yellow-600', multiplier: '2×', requirement: '5,000+ points earned', benefits: ['2× rewards', '2% cashback', 'Free delivery', 'Exclusive deals'], nextTier: 15000, current: tier === 'Gold' },
    { name: 'Platinum', color: 'from-purple-400 to-pink-600', multiplier: '3×', requirement: '15,000+ points earned', benefits: ['3× rewards', '5% cashback', 'VIP support', 'Early access', 'Partner perks'], nextTier: null, current: tier === 'Platinum' },
  ];

  const marketplaceRewards = [
    { category: 'Bundles & Airtime', items: [
      { id: '1', name: '500 MB Vodacom', points: 100, value: 'TZS 1,000', icon: Phone, available: true },
      { id: '2', name: '1 GB Airtel', points: 180, value: 'TZS 1,800', icon: Phone, available: true },
      { id: '3', name: 'TZS 5,000 Airtime', points: 500, value: 'TZS 5,000', icon: Wallet, available: true },
      { id: '4', name: 'TZS 10,000 Airtime', points: 950, value: 'TZS 10,000', icon: Wallet, available: true },
    ]},
    { category: 'Shopping & Delivery', items: [
      { id: '5', name: '10% Off Jumia', points: 200, value: 'Up to TZS 50,000', icon: ShoppingBag, available: true },
      { id: '6', name: 'Free Delivery (3x)', points: 150, value: 'TZS 3,000', icon: ArrowRight, available: true },
      { id: '7', name: 'TZS 20,000 Shopping Voucher', points: 1800, value: 'TZS 20,000', icon: Gift, available: true },
    ]},
    { category: 'Bills & Utilities', items: [
      { id: '8', name: 'TZS 10,000 Electricity', points: 900, value: 'TZS 10,000', icon: Zap, available: true },
      { id: '9', name: 'TZS 5,000 Water Bill', points: 450, value: 'TZS 5,000', icon: Shield, available: true },
      { id: '10', name: 'School Fees Voucher', points: 2000, value: 'TZS 25,000', icon: GraduationCap, available: true },
    ]},
    { category: 'Entertainment', items: [
      { id: '11', name: 'Cinema Ticket (1x)', points: 350, value: 'Century Cinemax', icon: Play, available: true },
      { id: '12', name: 'Cinema Tickets (2x)', points: 650, value: 'Century Cinemax', icon: Play, available: true },
      { id: '13', name: 'DStv Premium (1 month)', points: 5000, value: 'TZS 60,000', icon: Star, available: false },
    ]},
    { category: 'Travel & Transport', items: [
      { id: '14', name: 'Bajaji Ride (3x)', points: 120, value: 'TZS 6,000', icon: MapPin, available: true },
      { id: '15', name: 'Bus Ticket Dar-Arusha', points: 2500, value: 'TZS 35,000', icon: Send, available: true },
      { id: '16', name: 'Precision Air Discount', points: 8000, value: '15% Off', icon: Zap, available: true },
    ]},
    { category: 'Dining', items: [
      { id: '17', name: 'The Slipway TZS 20K', points: 1500, value: 'TZS 20,000', icon: Heart, available: true },
      { id: '18', name: 'Addis in Dar TZS 15K', points: 1200, value: 'TZS 15,000', icon: Heart, available: true },
      { id: '19', name: 'Any Restaurant 10% Off', points: 400, value: 'Up to TZS 30K', icon: Percent, available: true },
    ]},
  ];

  const earningActivities = [
    { category: 'Daily Tasks', tasks: [
      { id: '1', title: 'Make 1 payment', points: 20, icon: CreditCard, completed: true, frequency: 'Daily' },
      { id: '2', title: 'Send money to friend', points: 15, icon: Send, completed: false, frequency: 'Daily' },
      { id: '3', title: 'Use AI Assistant', points: 10, icon: Sparkles, completed: true, frequency: 'Daily' },
      { id: '4', title: 'Check-in daily', points: 5, icon: Calendar, completed: true, frequency: 'Daily' },
    ]},
    { category: 'Transactions', tasks: [
      { id: '5', title: 'Pay bill (any)', points: 30, icon: Shield, completed: false, frequency: 'Per transaction' },
      { id: '6', title: 'Top up bundles', points: 10, icon: Phone, completed: true, frequency: 'Per transaction' },
      { id: '7', title: 'Pay merchant QR', points: 25, icon: Store, completed: false, frequency: 'Per transaction' },
      { id: '8', title: 'Order delivery', points: 40, icon: Zap, completed: false, frequency: 'Per transaction' },
    ]},
    { category: 'Neighborhood Bonus (2x Points)', tasks: [
      { id: '9', title: 'Buy from Mama Lishe', points: 50, icon: Heart, completed: false, frequency: 'Per transaction', bonus: true },
      { id: '10', title: 'Pay Bodaboda', points: 30, icon: MapPin, completed: false, frequency: 'Per transaction', bonus: true },
      { id: '11', title: 'Shop at local duka', points: 35, icon: Store, completed: false, frequency: 'Per transaction', bonus: true },
    ]},
    { category: 'Growth & Referrals', tasks: [
      { id: '12', title: 'Refer 1 friend', points: 200, icon: Users, completed: false, frequency: 'One-time' },
      { id: '13', title: 'Complete KYC', points: 100, icon: BadgeCheck, completed: true, frequency: 'One-time' },
      { id: '14', title: 'Link bank account', points: 150, icon: Banknote, completed: false, frequency: 'One-time' },
    ]},
    { category: 'Financial Goals', tasks: [
      { id: '15', title: 'Save TZS 10,000', points: 100, icon: DollarSign, completed: false, frequency: 'Per milestone' },
      { id: '16', title: 'Pay on time (no late fees)', points: 50, icon: Clock, completed: true, frequency: 'Monthly' },
      { id: '17', title: 'Maintain savings streak', points: 75, icon: TrendingUp, completed: false, frequency: 'Weekly' },
    ]},
  ];

  const achievements = [
    { id: '1', name: '30-Day Streak', earned: true, description: 'Used app 30 days in a row' },
    { id: '2', name: 'First Payment', earned: true, description: 'Made your first payment' },
    { id: '3', name: 'Community Hero', earned: true, description: 'Supported 10 local businesses' },
    { id: '4', name: '100 Transactions', earned: false, description: 'Complete 100 transactions' },
    { id: '5', name: 'School Fees Paid', earned: true, description: 'Paid school fees on time' },
    { id: '6', name: 'Savings Champion', earned: false, description: 'Save TZS 100,000' },
    { id: '7', name: 'Referral Master', earned: false, description: 'Refer 5 friends' },
    { id: '8', name: 'Explorer', earned: true, description: 'Used 10 different features' },
  ];

  const seasonalEvents = [
    { id: '1', name: 'Ramadan Rewards', description: 'Double points on all transactions during Ramadan', multiplier: '2×', active: false, startsIn: '45 days', color: 'from-purple-500 to-blue-600' },
    { id: '2', name: 'Back to School', description: 'Triple cashback on school fee payments', multiplier: '3×', active: false, startsIn: '12 days', color: 'from-green-500 to-teal-600' },
    { id: '3', name: 'GO Friday', description: 'Mega deals every Friday — Up to 50% cashback!', multiplier: '5×', active: true, startsIn: 'Live Now!', color: 'from-red-500 to-pink-600' },
  ];

  const familyPools = [
    { id: '1', name: 'Mwangi Family', members: 5, totalPoints: 8500, yourContribution: 2400, goal: 'School Fees', goalPoints: 10000 },
    { id: '2', name: 'Christmas Savings', members: 3, totalPoints: 3200, yourContribution: 1500, goal: 'Shopping Voucher', goalPoints: 5000 },
  ];

  const aiInsights = [
    { type: 'opportunity', title: 'Earn 200 points today', description: "You're close to Silver tier. Make 2 more payments to unlock 1.5× rewards.", action: 'View tasks', icon: TrendingUp, color: 'from-green-500 to-emerald-600' },
    { type: 'deal', title: 'Smart Deal Alert', description: 'The Slipway has 2× points this weekend. Your favourite restaurant!', action: 'Activate', icon: Sparkles, color: 'from-yellow-500 to-orange-600' },
    { type: 'savings', title: 'Cashback Ready', description: 'You have TZS 45,000 in cashback. Withdraw or spend on delivery.', action: 'Withdraw', icon: Wallet, color: 'from-blue-500 to-cyan-600' },
  ];

  const currentTierData = tiers.find((t) => t.current) || tiers[0];
  const currentTierIndex = tiers.findIndex((t) => t.current);
  const nextTierData = currentTierIndex < tiers.length - 1 ? tiers[currentTierIndex + 1] : null;
  const progressToNextTier = nextTierData ? (points / nextTierData.nextTier!) * 100 : 100;

  const CurrentTierIcon = TIER_ICONS[currentTierData.name as keyof typeof TIER_ICONS] ?? Award;
  const currentTierIconColor = TIER_ICON_COLORS[currentTierData.name as keyof typeof TIER_ICON_COLORS] ?? 'text-white';

  const TABS = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'earn', label: 'Earn', icon: Coins },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'cashback', label: 'Cashback', icon: Wallet },
    { id: 'family', label: 'Family Pool', icon: Users },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'ai', label: 'AI Insights', icon: Sparkles },
  ] as const;

  const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' };
  const infoStyle = (tint: string) => ({ background: `rgba(${tint},0.08)`, border: `1px solid rgba(${tint},0.2)` });

  return (
    <div className="min-h-screen bg-[#080d08] pb-20 text-white">
      {/* ── Header ── */}
      <div className={`bg-gradient-to-br ${currentTierData.color} px-5 pt-10 pb-6 relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30 mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl text-white mb-1 tracking-tight">GOrewards</h1>
              <p className="text-white/70 text-sm">The Ultimate Reward System</p>
            </div>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/20">
              <CurrentTierIcon className={`h-8 w-8 ${currentTierIconColor}`} />
            </div>
          </div>

          {/* Points card */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/60 text-xs mb-1">Your Points</p>
                <p className="text-white text-3xl font-medium">{points.toLocaleString()}</p>
                <p className="text-white/50 text-xs mt-1">= {fmt(points * 0.1)}</p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-xs mb-1">Tier</p>
                <div className="bg-white/20 rounded-full px-4 py-2">
                  <p className="text-white text-sm font-medium">{currentTierData.name}</p>
                </div>
                <p className="text-white/50 text-xs mt-1">{currentTierData.multiplier} rewards</p>
              </div>
            </div>
            {nextTierData && (
              <>
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(progressToNextTier, 100)}%` }}
                  />
                </div>
                <p className="text-white/60 text-xs text-center">
                  {nextTierData.nextTier! - points} points to {nextTierData.name}
                </p>
              </>
            )}
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Cashback', value: fmt(cashbackBalance) },
              { label: 'Today', value: `+${todayEarnings}` },
              { label: 'Streak', value: `${streak}d` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/10 backdrop-blur-md rounded-2xl p-3">
                <p className="text-white/60 text-xs mb-1">{label}</p>
                <p className="text-white font-medium">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Surprise Reward Modal ── */}
      <AnimatePresence>
        {showSurprise && surpriseRewards.length > 0 && (
          <motion.div
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-5"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="rounded-3xl p-8 max-w-sm w-full text-center"
              style={{ background: '#0d1a0d', border: '1px solid rgba(74,222,128,0.2)' }}
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="w-16 h-16 rounded-full bg-[#16a34a]/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-[#4ade80]" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Surprise Reward!</h2>
              <p className="text-white/50 text-sm mb-6">You earned a random drop!</p>
              <div className="rounded-2xl p-5 mb-6" style={{ background: 'linear-gradient(135deg, #16a34a, #0d4d1a)' }}>
                <p className="text-white text-xl font-medium">{surpriseRewards[0].value}</p>
              </div>
              <button
                onClick={() => setShowSurprise(false)}
                className="w-full py-3.5 rounded-xl bg-[#16a34a] text-white text-sm font-medium"
              >
                Claim Reward
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Tabs ── */}
      <div className="overflow-x-auto px-4 py-3 scrollbar-hide" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex gap-2 min-w-max">
          {TABS.map(({ id, label, icon: TabIcon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all"
              style={
                activeTab === id
                  ? { background: '#16a34a', color: 'white' }
                  : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)' }
              }
            >
              <TabIcon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-5 pb-6 space-y-5">
        {/* ── HOME TAB ── */}
        {activeTab === 'home' && (
          <>
            {/* AI Insights */}
            <div className="space-y-3">
              <p className="text-sm text-white/40">AI Recommendations</p>
              {aiInsights.map((insight, i) => {
                const InsightIcon = insight.icon;
                return (
                  <div key={i} className={`bg-gradient-to-r ${insight.color} rounded-2xl p-4 text-white`}>
                    <div className="flex items-start gap-3">
                      <div className="bg-white/20 p-2 rounded-xl">
                        <InsightIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1">{insight.title}</p>
                        <p className="text-xs text-white/70 mb-3">{insight.description}</p>
                        <button className="bg-white text-gray-900 px-4 py-1.5 rounded-full text-xs font-medium hover:bg-gray-100">
                          {insight.action}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Seasonal Events */}
            <div className="space-y-3">
              <p className="text-sm text-white/40">Seasonal Events</p>
              {seasonalEvents.map((event) => {
                const EventIcon = EVENT_ICON_MAP[event.id] ?? Zap;
                const iconColor = EVENT_ICON_COLOR[event.id] ?? 'text-white';
                return (
                  <div key={event.id} className={`bg-gradient-to-r ${event.color} rounded-2xl p-5 text-white relative overflow-hidden`}>
                    {event.active && (
                      <div className="absolute top-3 right-3 bg-white text-green-700 px-3 py-1 rounded-full text-xs font-medium animate-pulse">
                        LIVE NOW
                      </div>
                    )}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/20 flex-shrink-0">
                        <EventIcon className={`h-6 w-6 ${iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-medium mb-1">{event.name}</p>
                        <p className="text-xs text-white/70 mb-2">{event.description}</p>
                        <div className="flex items-center gap-3">
                          <span className="bg-white/20 px-3 py-1 rounded-full text-xs">{event.multiplier} Points</span>
                          <span className="text-xs text-white/70">{event.active ? 'Active now' : event.startsIn}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tier System */}
            <div className="space-y-3">
              <p className="text-sm text-white/40">Tier System</p>
              {tiers.map((tierItem, i) => {
                const TierIcon = TIER_ICONS[tierItem.name as keyof typeof TIER_ICONS] ?? Award;
                const tierColor = TIER_ICON_COLORS[tierItem.name as keyof typeof TIER_ICON_COLORS] ?? 'text-white';
                return (
                  <div
                    key={i}
                    className={`rounded-2xl p-4 ${tierItem.current ? `bg-gradient-to-r ${tierItem.color} text-white` : ''}`}
                    style={tierItem.current ? undefined : cardStyle}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tierItem.current ? 'bg-white/20' : 'bg-white/06'}`}
                        style={tierItem.current ? undefined : { background: 'rgba(255,255,255,0.08)' }}>
                        <TierIcon className={`h-5 w-5 ${tierItem.current ? 'text-white' : tierColor}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{tierItem.name}</p>
                        <p className={`text-xs ${tierItem.current ? 'text-white/70' : 'text-white/50'}`}>{tierItem.requirement}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${tierItem.current ? 'bg-white/20 text-white' : 'text-white/60'}`}
                        style={tierItem.current ? undefined : { background: 'rgba(255,255,255,0.08)' }}>
                        {tierItem.multiplier}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {tierItem.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Check className={`h-3.5 w-3.5 flex-shrink-0 ${tierItem.current ? 'text-white' : 'text-[#4ade80]'}`} />
                          <p className={`text-xs ${tierItem.current ? 'text-white/80' : 'text-white/60'}`}>{benefit}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Offline Access */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-5 text-white">
              <div className="flex items-start gap-3">
                <WifiOff className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-2">No Internet? No Problem!</p>
                  <p className="text-xs text-white/70 mb-4">Check your rewards via SMS, USSD, or phone call (IVR)</p>
                  <div className="grid grid-cols-3 gap-2">
                    {['*123#', 'SMS', 'Call'].map((opt) => (
                      <button key={opt} className="bg-white/20 rounded-lg py-2 text-xs hover:bg-white/30 transition-colors">{opt}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── EARN TAB ── */}
        {activeTab === 'earn' && (
          <>
            {earningActivities.map((cat, i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/50">{cat.category}</p>
                  {cat.category.includes('Neighborhood') && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80' }}>
                      2x Points
                    </span>
                  )}
                </div>
                {cat.tasks.map((task) => {
                  const TaskIcon = task.icon;
                  return (
                    <div
                      key={task.id}
                      className="rounded-2xl p-4"
                      style={task.completed
                        ? { background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.15)' }
                        : cardStyle
                      }
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${(task as any).bonus ? 'animate-pulse' : ''}`}
                          style={{ background: 'rgba(255,255,255,0.08)' }}>
                          <TaskIcon className="h-5 w-5 text-white/60" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white/80">{task.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: 'rgba(234,179,8,0.15)', color: '#fbbf24' }}>
                              +{task.points} pts
                            </span>
                            <span className="text-xs text-white/40">{task.frequency}</span>
                          </div>
                        </div>
                        {task.completed ? (
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(74,222,128,0.15)' }}>
                            <Check className="h-4 w-4 text-[#4ade80]" />
                          </div>
                        ) : (
                          <button className="px-4 py-1.5 rounded-full text-xs font-medium bg-[#16a34a] text-white hover:bg-[#15803d] transition-colors">
                            Earn
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            <div className="bg-gradient-to-r from-purple-600 to-pink-700 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Play className="h-5 w-5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Watch & Earn (Optional)</p>
                  <p className="text-xs text-white/70">Watch short ads to earn bonus points</p>
                </div>
              </div>
              <button className="w-full bg-white text-purple-700 py-3 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
                Watch Ad (+50 points)
              </button>
            </div>
          </>
        )}

        {/* ── MARKETPLACE TAB ── */}
        {activeTab === 'marketplace' && (
          <>
            {marketplaceRewards.map((cat, i) => (
              <div key={i} className="space-y-3">
                <p className="text-sm text-white/40">{cat.category}</p>
                <div className="grid grid-cols-2 gap-3">
                  {cat.items.map((item) => {
                    const ItemIcon = item.icon;
                    const canRedeem = item.available && points >= item.points;
                    return (
                      <div
                        key={item.id}
                        className={`rounded-2xl p-4 ${!item.available ? 'opacity-50' : ''}`}
                        style={cardStyle}
                      >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 mx-auto" style={{ background: 'rgba(255,255,255,0.08)' }}>
                          <ItemIcon className="h-5 w-5 text-white/70" />
                        </div>
                        <p className="text-xs font-medium text-white/80 text-center mb-1">{item.name}</p>
                        <p className="text-xs text-white/40 text-center mb-3">{item.value}</p>
                        {item.available ? (
                          canRedeem ? (
                            <button className="w-full py-2 rounded-full text-xs font-medium bg-[#16a34a] text-white hover:bg-[#15803d] transition-colors">
                              Redeem ({item.points})
                            </button>
                          ) : (
                            <button className="w-full py-2 rounded-full text-xs text-white/40 transition-colors" style={{ background: 'rgba(255,255,255,0.06)' }} disabled>
                              {item.points - points} more
                            </button>
                          )
                        ) : (
                          <button className="w-full py-2 rounded-full text-xs text-white/30" style={{ background: 'rgba(255,255,255,0.04)' }} disabled>
                            Out of Stock
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        )}

        {/* ── CASHBACK TAB ── */}
        {activeTab === 'cashback' && (
          <>
            <div className="bg-gradient-to-br from-[#16a34a] to-[#0d4d1a] rounded-3xl p-6 text-white">
              <p className="text-xs text-white/60 mb-2">Total Cashback Balance</p>
              <p className="text-4xl font-medium mb-5">{fmt(cashbackBalance)}</p>
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-white text-[#16a34a] py-3 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">Withdraw</button>
                <button className="bg-white/20 text-white py-3 rounded-full text-sm hover:bg-white/30 transition-colors">Use Now</button>
              </div>
            </div>

            {/* Cashback Tier Rates */}
            <div className="rounded-2xl p-5 space-y-3" style={cardStyle}>
              <p className="text-sm text-white/50 mb-1">Cashback Rates by Tier</p>
              {[
                { name: 'Bronze', rate: '0.5%', pill: 'text-white/60' },
                { name: 'Silver', rate: '1%', pill: 'text-blue-400' },
                { name: 'Gold', rate: '2%', pill: 'text-yellow-400' },
                { name: 'Platinum', rate: '5%', pill: 'text-purple-400' },
              ].map(({ name, rate, pill }) => {
                const CBIcon = CASHBACK_TIER_ICONS[name as keyof typeof CASHBACK_TIER_ICONS] ?? Award;
                const cbColor = CASHBACK_TIER_COLORS[name as keyof typeof CASHBACK_TIER_COLORS] ?? 'text-white';
                return (
                  <div key={name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CBIcon className={`h-5 w-5 ${cbColor}`} />
                      <span className="text-sm text-white/70">{name}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${pill}`} style={{ background: 'rgba(255,255,255,0.08)' }}>{rate}</span>
                  </div>
                );
              })}
            </div>

            {/* Recent Cashback */}
            <div className="space-y-3">
              <p className="text-sm text-white/40">Recent Cashback</p>
              {[
                { label: 'Paid at The Slipway', value: '+TZS 500', sub: '2% cashback • 2 hours ago' },
                { label: 'Electricity Bill', value: '+TZS 200', sub: '1% cashback • Yesterday' },
                { label: 'Local Duka Purchase', value: '+TZS 350', sub: '2x bonus • 3 days ago' },
              ].map(({ label, value, sub }) => (
                <div key={label} className="rounded-2xl p-4" style={cardStyle}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-white/80">{label}</p>
                    <p className="text-sm text-[#4ade80] font-medium">{value}</p>
                  </div>
                  <p className="text-xs text-white/40">{sub}</p>
                </div>
              ))}
            </div>

            {/* Fraud Protection */}
            <div className="rounded-2xl p-5 flex items-start gap-3" style={infoStyle('59,130,246')}>
              <Shield className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-300 font-medium mb-1">Fraud Protection Active</p>
                <p className="text-xs text-blue-300/70">Your cashback is protected with bank-grade security, device fingerprinting, and AI fraud monitoring.</p>
              </div>
            </div>
          </>
        )}

        {/* ── FAMILY POOL TAB ── */}
        {activeTab === 'family' && (
          <>
            <div className="bg-gradient-to-r from-purple-600 to-pink-700 rounded-2xl p-5 text-white">
              <p className="text-base font-medium mb-1">Family & Friends Pool</p>
              <p className="text-xs text-white/70">Share rewards, save together, achieve goals as a community</p>
            </div>

            {familyPools.map((pool) => (
              <div key={pool.id} className="rounded-2xl p-5 space-y-4" style={cardStyle}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <Users className="h-6 w-6 text-white/60" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/80">{pool.name}</p>
                    <p className="text-xs text-white/40">{pool.members} members</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-white/50">Goal: {pool.goal}</span>
                    <span className="text-white/70 font-medium">{pool.totalPoints} / {pool.goalPoints}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div
                      className="h-full bg-gradient-to-r from-[#16a34a] to-[#4ade80] rounded-full"
                      style={{ width: `${(pool.totalPoints / pool.goalPoints) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <p className="text-xs text-white/40 mb-1">Your Share</p>
                    <p className="text-base font-medium text-white/80">{pool.yourContribution}</p>
                  </div>
                  <button className="rounded-xl py-3 text-sm font-medium bg-[#16a34a] text-white hover:bg-[#15803d] transition-colors">
                    Contribute
                  </button>
                </div>
              </div>
            ))}

            <button
              className="w-full rounded-2xl p-4 text-sm text-white/50 border-dashed border-2 hover:border-[#4ade80] hover:text-[#4ade80] transition-colors"
              style={{ borderColor: 'rgba(255,255,255,0.15)', background: 'transparent' }}
            >
              + Create New Pool
            </button>
          </>
        )}

        {/* ── ACHIEVEMENTS TAB ── */}
        {activeTab === 'achievements' && (
          <>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl p-5 text-white">
              <p className="text-base font-medium mb-1">Achievement Badges</p>
              <p className="text-xs text-white/70">{achievements.filter((a) => a.earned).length} of {achievements.length} earned</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {achievements.map((ach) => {
                const AchIcon = ACHIEVEMENT_ICON_MAP[ach.id] ?? Award;
                return (
                  <div
                    key={ach.id}
                    className={`rounded-2xl p-4 text-center ${ach.earned ? 'bg-gradient-to-br from-yellow-500 to-orange-600 text-white' : ''}`}
                    style={ach.earned ? undefined : cardStyle}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${ach.earned ? 'bg-white/20' : ''}`}
                      style={ach.earned ? undefined : { background: 'rgba(255,255,255,0.08)' }}>
                      <AchIcon className={`h-6 w-6 ${ach.earned ? 'text-white' : 'text-white/40'}`} />
                    </div>
                    <p className={`text-xs font-medium mb-1 ${ach.earned ? 'text-white' : 'text-white/70'}`}>{ach.name}</p>
                    <p className={`text-xs ${ach.earned ? 'text-white/80' : 'text-white/40'}`}>{ach.description}</p>
                    {ach.earned && (
                      <div className="mt-2 bg-white/20 rounded-full px-3 py-0.5 text-xs inline-block">Earned</div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Location-Based Rewards */}
            <div className="rounded-2xl p-5" style={infoStyle('59,130,246')}>
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-sm text-blue-300 font-medium mb-1">Location-Based Rewards</p>
                  <p className="text-xs text-blue-300/70">Visit partner locations to earn bonus points!</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { name: 'Mlimani City Mall', pts: '+50 pts' },
                  { name: 'The Slipway', pts: '+75 pts' },
                ].map(({ name, pts }) => (
                  <div key={name} className="flex items-center justify-between rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4 text-white/40" />
                      <span className="text-xs text-white/70">{name}</span>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs text-blue-300" style={{ background: 'rgba(59,130,246,0.2)' }}>{pts}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── AI TAB ── */}
        {activeTab === 'ai' && (
          <>
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-5 text-white">
              <p className="text-base font-medium mb-1">AI Rewards Optimization</p>
              <p className="text-xs text-white/70">Smart suggestions to maximize your rewards</p>
            </div>

            <div className="rounded-2xl p-5 space-y-3" style={cardStyle}>
              <p className="text-sm text-white/50">Personalized for You</p>
              {[
                { color: infoStyle('74,222,128'), label: 'Best Deal Today', accent: 'text-green-300', text: 'Addis in Dar has 2× points until 8 PM. You love Ethiopian food — earn 100 points!', btnBg: '#16a34a', btnLabel: 'View Deal' },
                { color: infoStyle('59,130,246'), label: 'Smart Suggestion', accent: 'text-blue-300', text: "You're close to Gold tier! Make 2 more payments this week to unlock 2× rewards permanently.", btnBg: '#2563eb', btnLabel: 'See Tasks' },
                { color: infoStyle('168,85,247'), label: 'Auto-Apply Alert', accent: 'text-purple-300', text: 'AI found a 15% discount at your next checkout. We\'ll apply it automatically!', btnBg: '#7c3aed', btnLabel: 'Enable Auto-Apply' },
              ].map(({ color, label, accent, text, btnBg, btnLabel }) => (
                <div key={label} className="rounded-xl p-4" style={color}>
                  <p className={`text-xs font-medium mb-2 ${accent}`}>{label}</p>
                  <p className="text-xs text-white/60 mb-3">{text}</p>
                  <button className="px-4 py-1.5 rounded-full text-xs font-medium text-white" style={{ background: btnBg }}>{btnLabel}</button>
                </div>
              ))}
            </div>

            <div className="rounded-2xl p-5 space-y-3" style={cardStyle}>
              <p className="text-sm text-white/50">What You'll Love</p>
              <p className="text-xs text-white/30">Based on your transaction history:</p>
              {[
                { icon: Heart, label: 'You order pizza on Fridays', badge: '+2x points', badgeStyle: { background: 'rgba(234,179,8,0.15)', color: '#fbbf24' } },
                { icon: Zap, label: 'Electricity bill due in 5 days', badge: 'Remind Me', badgeStyle: { background: '#16a34a', color: 'white' }, isBtn: true },
              ].map(({ icon: ItemIcon, label, badge, badgeStyle, isBtn }) => (
                <div key={label} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <ItemIcon className="h-5 w-5 text-white/40 flex-shrink-0" />
                  <p className="text-sm text-white/60 flex-1">{label}</p>
                  <span className="px-3 py-1 rounded-full text-xs font-medium" style={badgeStyle}>{badge}</span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl p-5 space-y-3" style={cardStyle}>
              <p className="text-sm text-white/50">Partner Multipliers</p>
              <p className="text-xs text-white/30">Local businesses offering extra rewards:</p>
              {[
                { name: "Mama Halima's Duka", badge: '3x Weekend', badgeColor: 'text-orange-400', badgeBg: 'rgba(249,115,22,0.15)' },
                { name: 'Karibu Mama Lishe', badge: '2x Daily', badgeColor: 'text-green-400', badgeBg: 'rgba(74,222,128,0.15)' },
              ].map(({ name, badge, badgeColor, badgeBg }) => (
                <div key={name} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4 text-white/40" />
                    <span className="text-xs text-white/70">{name}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeColor}`} style={{ background: badgeBg }}>{badge}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
