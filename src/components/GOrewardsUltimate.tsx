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
  Share2, Eye, EyeOff, CreditCard, GraduationCap, Plus
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface GOrewardsUltimateProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

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

// Tier accent colours & gradients
const TIER_META: Record<string, { gradient: string; accent: string; glow: string; track: string }> = {
  Bronze:   { gradient: 'linear-gradient(135deg,#431407 0%,#7c2d12 60%,#ea580c 100%)',  accent: '#f97316', glow: 'rgba(249,115,22,0.35)',  track: 'rgba(249,115,22,0.12)' },
  Silver:   { gradient: 'linear-gradient(135deg,#1e293b 0%,#334155 60%,#64748b 100%)',  accent: '#94a3b8', glow: 'rgba(148,163,184,0.35)', track: 'rgba(148,163,184,0.12)' },
  Gold:     { gradient: 'linear-gradient(135deg,#422006 0%,#713f12 60%,#ca8a04 100%)',  accent: '#fbbf24', glow: 'rgba(251,191,36,0.35)',  track: 'rgba(251,191,36,0.12)' },
  Platinum: { gradient: 'linear-gradient(135deg,#2e1065 0%,#4c1d95 60%,#7c3aed 100%)', accent: '#a78bfa', glow: 'rgba(167,139,250,0.35)', track: 'rgba(167,139,250,0.12)' },
};

function TierProgressRing({ progress, accent, track, size = 140 }: { progress: number; accent: string; track: string; size?: number }) {
  const cx = size / 2, cy = size / 2, r = (size / 2) - 10;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(Math.max(progress, 0), 100);
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={track} strokeWidth="8" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={accent} strokeWidth="8"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
    </svg>
  );
}

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

  // ── Data ──────────────────────────────────────────────────────────────────────
  const tiers = [
    { name: 'Bronze',   color: 'from-orange-400 to-amber-600',  multiplier: '1×',  requirement: 'Just joined',              benefits: ['Earn points', 'Basic cashback', 'Access marketplace'],                          nextTier: 1000,  current: tier === 'Bronze' },
    { name: 'Silver',   color: 'from-slate-300 to-gray-500',    multiplier: '1.5×', requirement: '1,000+ points earned',     benefits: ['1.5× rewards', '1% cashback', 'Monthly surprises', 'Priority support'],          nextTier: 5000,  current: tier === 'Silver' },
    { name: 'Gold',     color: 'from-yellow-400 to-yellow-600', multiplier: '2×',  requirement: '5,000+ points earned',     benefits: ['2× rewards', '2% cashback', 'Free delivery', 'Exclusive deals'],                  nextTier: 15000, current: tier === 'Gold' },
    { name: 'Platinum', color: 'from-purple-400 to-pink-600',   multiplier: '3×',  requirement: '15,000+ points earned',    benefits: ['3× rewards', '5% cashback', 'VIP support', 'Early access', 'Partner perks'],    nextTier: null,  current: tier === 'Platinum' },
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
    { category: 'Neighborhood Bonus (2× Points)', tasks: [
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
    { type: 'opportunity', title: 'Pata Pointi 200 Leo', description: "Uko karibu na Silver tier. Fanya malipo 2 zaidi ili kupata zawadi 1.5×.", action: 'Angalia Kazi', icon: TrendingUp, accent: '#4ade80', bg: 'linear-gradient(135deg,#052e16,#065f46)' },
    { type: 'deal', title: 'Ofa Maalum!', description: 'The Slipway ina 2× pointi wikendi hii. Mkahawa unaopenda!', action: 'Washa Ofa', icon: Sparkles, accent: '#fbbf24', bg: 'linear-gradient(135deg,#422006,#92400e)' },
    { type: 'savings', title: 'Cashback Tayari', description: 'Una TZS 45,000 ya cashback. Toa au tumia kwa delivery.', action: 'Toa Sasa', icon: Wallet, accent: '#60a5fa', bg: 'linear-gradient(135deg,#1e3a8a,#1d4ed8)' },
  ];

  // ── Derived values ─────────────────────────────────────────────────────────────
  const currentTierData = tiers.find((t) => t.current) || tiers[0];
  const currentTierIndex = tiers.findIndex((t) => t.current);
  const nextTierData = currentTierIndex < tiers.length - 1 ? tiers[currentTierIndex + 1] : null;
  const progressToNextTier = nextTierData ? Math.min((points / nextTierData.nextTier!) * 100, 100) : 100;

  const CurrentTierIcon = TIER_ICONS[currentTierData.name as keyof typeof TIER_ICONS] ?? Award;
  const tierMeta = TIER_META[currentTierData.name] ?? TIER_META.Bronze;

  const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' };
  const infoStyle = (tint: string) => ({ background: `rgba(${tint},0.08)`, border: `1px solid rgba(${tint},0.2)` });

  const TABS = [
    { id: 'home',         label: 'Home',        icon: Home },
    { id: 'earn',         label: 'Pata',         icon: Coins },
    { id: 'marketplace',  label: 'Duka',         icon: ShoppingBag },
    { id: 'cashback',     label: 'Cashback',     icon: Wallet },
    { id: 'family',       label: 'Familia',      icon: Users },
    { id: 'achievements', label: 'Zawadi',       icon: Trophy },
    { id: 'ai',           label: 'AI',           icon: Sparkles },
  ] as const;

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#080d08', paddingBottom: 80, color: '#fff' }}>
      <style>{`
        @keyframes glowPulse { 0%,100%{opacity:.5} 50%{opacity:1} }
        @keyframes liveBlip { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:.6} }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* ── Surprise Reward Modal ── */}
      <AnimatePresence>
        {showSurprise && surpriseRewards.length > 0 && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-5"
            style={{ background: 'rgba(0,0,0,0.75)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="rounded-3xl p-8 max-w-sm w-full text-center"
              style={{ background: '#0d1a0d', border: '1px solid rgba(74,222,128,0.25)', boxShadow: '0 0 60px rgba(74,222,128,0.15)' }}
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(22,163,74,0.15)', border: '2px solid rgba(74,222,128,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Sparkles style={{ width: 32, height: 32, color: '#4ade80' }} />
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: 6 }}>Tuzo ya Mshangao!</h2>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>Umeshinda zawadi ya nasibu!</p>
              <div style={{ borderRadius: 20, padding: '20px', marginBottom: 20, background: 'linear-gradient(135deg,#16a34a,#0d4d1a)', boxShadow: '0 4px 20px rgba(22,163,74,0.3)' }}>
                <p style={{ fontSize: '24px', fontWeight: 800 }}>{surpriseRewards[0].value}</p>
              </div>
              <button onClick={() => setShowSurprise(false)}
                style={{ width: '100%', padding: '14px', borderRadius: 16, background: '#16a34a', color: '#fff', fontWeight: 800, fontSize: '15px', border: 'none', cursor: 'pointer' }}>
                Dai Zawadi
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Sticky Header ── */}
      <div className="sticky top-0 z-20" style={{ background: 'rgba(8,13,8,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ padding: '16px 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowLeft style={{ width: 20, height: 20, color: '#fff' }} />
            </button>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>GOrewards</h1>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>The Ultimate Reward System</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 20, background: tierMeta.track, border: `1px solid ${tierMeta.accent}40` }}>
            <CurrentTierIcon style={{ width: 14, height: 14, color: tierMeta.accent }} />
            <span style={{ fontSize: '12px', fontWeight: 800, color: tierMeta.accent }}>{currentTierData.name}</span>
          </div>
        </div>
      </div>

      {/* ── MEMBERSHIP HERO CARD ── */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ borderRadius: 28, overflow: 'hidden', position: 'relative', background: tierMeta.gradient, border: `1px solid ${tierMeta.accent}30`, boxShadow: `0 8px 40px ${tierMeta.glow}` }}>
          {/* Glow blobs */}
          <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: `radial-gradient(circle, ${tierMeta.glow} 0%, transparent 70%)`, animation: 'glowPulse 3s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', bottom: -20, left: 20, width: 100, height: 100, borderRadius: '50%', background: `radial-gradient(circle, ${tierMeta.glow} 0%, transparent 70%)`, animation: 'glowPulse 4s ease-in-out infinite 1.5s' }} />

          <div style={{ position: 'relative', zIndex: 1, padding: '24px 20px 20px', display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* Progress Ring */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <TierProgressRing progress={progressToNextTier} accent={tierMeta.accent} track={tierMeta.track} size={120} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <CurrentTierIcon style={{ width: 24, height: 24, color: tierMeta.accent }} />
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textAlign: 'center', lineHeight: 1.2 }}>{Math.round(progressToNextTier)}%</span>
              </div>
            </div>

            {/* Points info */}
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.5px', marginBottom: 4 }}>POINTI ZAKO</p>
              <p style={{ fontSize: '38px', fontWeight: 900, color: '#fff', letterSpacing: '-1.5px', lineHeight: 1 }}>{points.toLocaleString()}</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>≈ {fmt(points * 0.1)}</p>
              {nextTierData && (
                <div style={{ marginTop: 10, padding: '6px 12px', borderRadius: 20, background: 'rgba(0,0,0,0.2)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <ChevronRight style={{ width: 12, height: 12, color: tierMeta.accent }} />
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                    {(nextTierData.nextTier! - points).toLocaleString()} pts → {nextTierData.name}
                  </span>
                </div>
              )}
              {!nextTierData && (
                <div style={{ marginTop: 10, padding: '6px 12px', borderRadius: 20, background: 'rgba(0,0,0,0.2)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Crown style={{ width: 12, height: 12, color: tierMeta.accent }} />
                  <span style={{ fontSize: '11px', color: tierMeta.accent, fontWeight: 700 }}>Daraja la Juu!</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            {[
              { label: 'Cashback', value: `TZS ${(cashbackBalance/1000).toFixed(1)}K` },
              { label: 'Leo', value: `+${todayEarnings}` },
              { label: 'Streak', value: `${streak}d 🔥` },
            ].map(({ label, value }, i) => (
              <div key={label} style={{ padding: '14px 12px', textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none', background: 'rgba(0,0,0,0.15)' }}>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginBottom: 3 }}>{label}</p>
                <p style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ overflowX: 'auto', padding: '14px 16px 0', scrollbarWidth: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', gap: 8, minWidth: 'max-content', paddingBottom: 12 }}>
          {TABS.map(({ id, label, icon: TabIcon }) => (
            <button key={id} onClick={() => setActiveTab(id as typeof activeTab)}
              style={activeTab === id
                ? { display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 20, fontSize: '12px', fontWeight: 800, background: '#16a34a', color: '#fff', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }
                : { display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 20, fontSize: '12px', fontWeight: 600, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <TabIcon style={{ width: 13, height: 13 }} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* ═══ HOME TAB ═══ */}
        {activeTab === 'home' && (
          <>
            {/* GO Friday Live Banner */}
            {seasonalEvents.find(e => e.active) && (() => {
              const live = seasonalEvents.find(e => e.active)!;
              const LiveIcon = EVENT_ICON_MAP[live.id];
              return (
                <div style={{ borderRadius: 20, padding: '16px 18px', background: 'linear-gradient(135deg,#7f1d1d,#991b1b,#dc2626)', border: '1px solid rgba(248,113,113,0.3)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {LiveIcon && <LiveIcon style={{ width: 24, height: 24, color: '#fca5a5' }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', animation: 'liveBlip 1.5s ease-in-out infinite' }} />
                        <span style={{ fontSize: '10px', fontWeight: 800, color: '#4ade80', letterSpacing: '0.5px' }}>LIVE SASA</span>
                      </div>
                      <p style={{ fontSize: '16px', fontWeight: 900, color: '#fff', marginBottom: 2 }}>{live.name} — {live.multiplier} Pointi!</p>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{live.description}</p>
                    </div>
                    <div style={{ padding: '8px 14px', borderRadius: 20, background: 'rgba(255,255,255,0.15)', fontSize: '13px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                      {live.multiplier}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* AI Insights — horizontal scroll story cards */}
            <div>
              <p style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 10, letterSpacing: '0.4px' }}>MAPENDEKEZO YA AI</p>
              <div style={{ display: 'flex', gap: 12, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 }}>
                {aiInsights.map((ins, i) => {
                  const InsIcon = ins.icon;
                  return (
                    <div key={i} style={{ flexShrink: 0, width: 230, borderRadius: 20, padding: '18px', background: ins.bg, border: `1px solid ${ins.accent}25`, position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: -10, right: -10, width: 80, height: 80, borderRadius: '50%', background: `radial-gradient(circle, ${ins.accent}20, transparent 70%)` }} />
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                        <InsIcon style={{ width: 20, height: 20, color: ins.accent }} />
                      </div>
                      <p style={{ fontSize: '14px', fontWeight: 800, color: '#fff', marginBottom: 6 }}>{ins.title}</p>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, marginBottom: 14 }}>{ins.description}</p>
                      <button style={{ padding: '8px 16px', borderRadius: 20, background: ins.accent, color: '#000', fontSize: '12px', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
                        {ins.action}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Seasonal Events (non-live) */}
            <div>
              <p style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 10, letterSpacing: '0.4px' }}>MATUKIO YA KIPINDI</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {seasonalEvents.filter(e => !e.active).map((event) => {
                  const EvIcon = EVENT_ICON_MAP[event.id] ?? Zap;
                  return (
                    <div key={event.id} style={{ borderRadius: 18, padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 13, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <EvIcon style={{ width: 22, height: 22, color: 'rgba(255,255,255,0.5)' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{event.name}</p>
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>{event.description}</p>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontSize: '16px', fontWeight: 900, color: '#4ade80' }}>{event.multiplier}</p>
                        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>{event.startsIn}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tier Roadmap — horizontal stepper */}
            <div>
              <p style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 12, letterSpacing: '0.4px' }}>MFUMO WA VYEO</p>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: 4 }}>
                {/* Connecting line */}
                <div style={{ position: 'absolute', top: 20, left: '10%', right: '10%', height: 2, background: 'rgba(255,255,255,0.08)', zIndex: 0 }} />
                <div style={{ position: 'absolute', top: 20, left: '10%', width: `${Math.min(currentTierIndex / (tiers.length - 1) * 80, 80)}%`, height: 2, background: tierMeta.accent, zIndex: 1, transition: 'width 1s ease' }} />
                {tiers.map((t, i) => {
                  const TIcon = TIER_ICONS[t.name as keyof typeof TIER_ICONS] ?? Award;
                  const tm = TIER_META[t.name] ?? TIER_META.Bronze;
                  const isCurrent = t.current;
                  const isPast = i < currentTierIndex;
                  return (
                    <div key={t.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, zIndex: 2, flex: 1 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isCurrent ? tm.accent : isPast ? tm.track : 'rgba(255,255,255,0.08)', border: `2px solid ${isCurrent ? tm.accent : isPast ? tm.accent + '60' : 'rgba(255,255,255,0.1)'}`, boxShadow: isCurrent ? `0 0 16px ${tm.glow}` : 'none' }}>
                        <TIcon style={{ width: 18, height: 18, color: isCurrent ? '#000' : isPast ? tm.accent : 'rgba(255,255,255,0.3)' }} />
                      </div>
                      <p style={{ fontSize: '10px', fontWeight: isCurrent ? 800 : 600, color: isCurrent ? tm.accent : isPast ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.3)', textAlign: 'center' }}>{t.name}</p>
                      <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>{t.multiplier}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Offline Access */}
            <div style={{ borderRadius: 18, padding: '16px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <WifiOff style={{ width: 20, height: 20, color: '#818cf8', flexShrink: 0, marginTop: 2 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: 4 }}>Hakuna Mtandao? Hakuna Shida!</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>Angalia tuzo zako kwa SMS, USSD, au simu (IVR)</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['*123#', 'SMS', 'Piga Simu'].map(opt => (
                    <button key={opt} style={{ flex: 1, padding: '8px 4px', borderRadius: 10, background: 'rgba(255,255,255,0.08)', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>{opt}</button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══ EARN TAB ═══ */}
        {activeTab === 'earn' && (
          <>
            {/* Today's potential */}
            <div style={{ borderRadius: 20, padding: '16px 18px', background: 'linear-gradient(135deg,#052e16,#065f46)', border: '1px solid rgba(74,222,128,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Uwezekano wa Leo</p>
                  <p style={{ fontSize: '28px', fontWeight: 900, color: '#4ade80', letterSpacing: '-1px' }}>+340 pts</p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Kazi {earningActivities.reduce((s,c) => s + c.tasks.filter(t => !t.completed).length, 0)} bado</p>
                </div>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(74,222,128,0.15)', border: '2px solid rgba(74,222,128,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap style={{ width: 26, height: 26, color: '#4ade80' }} />
                </div>
              </div>
            </div>

            {earningActivities.map((cat, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.4px' }}>{cat.category.toUpperCase()}</p>
                  {cat.category.includes('Neighborhood') && (
                    <span style={{ padding: '3px 10px', borderRadius: 20, background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.25)', fontSize: '10px', fontWeight: 800, color: '#4ade80' }}>2× Pointi</span>
                  )}
                </div>
                {cat.tasks.map((task) => {
                  const TaskIcon = task.icon;
                  return (
                    <div key={task.id} style={{ borderRadius: 16, padding: '14px', display: 'flex', alignItems: 'center', gap: 12,
                      ...(task.completed
                        ? { background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.12)' }
                        : cardStyle)
                    }}>
                      <div style={{ width: 42, height: 42, borderRadius: 13, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: task.completed ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.07)' }}>
                        <TaskIcon style={{ width: 20, height: 20, color: task.completed ? '#4ade80' : 'rgba(255,255,255,0.5)' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '14px', fontWeight: 700, color: task.completed ? 'rgba(255,255,255,0.6)' : '#fff', textDecoration: task.completed ? 'line-through' : 'none', marginBottom: 3 }}>{task.title}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ padding: '2px 8px', borderRadius: 20, background: 'rgba(251,191,36,0.12)', color: '#fbbf24', fontSize: '11px', fontWeight: 800 }}>+{task.points} pts</span>
                          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{task.frequency}</span>
                        </div>
                      </div>
                      {task.completed
                        ? <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(74,222,128,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check style={{ width: 16, height: 16, color: '#4ade80' }} /></div>
                        : <button style={{ padding: '7px 14px', borderRadius: 20, background: '#16a34a', color: '#fff', fontSize: '12px', fontWeight: 800, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>Pata</button>
                      }
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Watch & Earn */}
            <div style={{ borderRadius: 20, padding: '18px', background: 'linear-gradient(135deg,#3b0764,#6d28d9)', border: '1px solid rgba(167,139,250,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 13, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Play style={{ width: 22, height: 22, color: '#c4b5fd' }} />
                </div>
                <div>
                  <p style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>Tazama & Pata Pointi</p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Tazama matangazo mafupi kupata pointi za ziada</p>
                </div>
              </div>
              <button style={{ width: '100%', padding: '13px', borderRadius: 16, background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontWeight: 800, fontSize: '14px', cursor: 'pointer' }}>
                Tazama Tangazo (+50 pointi)
              </button>
            </div>
          </>
        )}

        {/* ═══ MARKETPLACE TAB ═══ */}
        {activeTab === 'marketplace' && (
          <>
            <div style={{ borderRadius: 20, padding: '14px 16px', background: 'linear-gradient(135deg,rgba(22,163,74,0.12),rgba(21,128,61,0.08))', border: '1px solid rgba(74,222,128,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>Duka la Zawadi</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Tumia pointi zako kwa zawadi za kweli</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>Pointi</p>
                <p style={{ fontSize: '18px', fontWeight: 900, color: '#4ade80' }}>{points.toLocaleString()}</p>
              </div>
            </div>

            {marketplaceRewards.map((cat, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.4px' }}>{cat.category.toUpperCase()}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {cat.items.map((item) => {
                    const ItemIcon = item.icon;
                    const canRedeem = item.available && points >= item.points;
                    return (
                      <div key={item.id} style={{ borderRadius: 18, padding: '16px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: item.available ? 1 : 0.5, ...cardStyle }}>
                        <div style={{ width: 44, height: 44, borderRadius: 13, background: canRedeem ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                          <ItemIcon style={{ width: 22, height: 22, color: canRedeem ? '#4ade80' : 'rgba(255,255,255,0.5)' }} />
                        </div>
                        <p style={{ fontSize: '12px', fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: 3 }}>{item.name}</p>
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 10 }}>{item.value}</p>
                        {item.available ? (
                          canRedeem
                            ? <button style={{ width: '100%', padding: '8px', borderRadius: 12, background: '#16a34a', color: '#fff', fontSize: '12px', fontWeight: 800, border: 'none', cursor: 'pointer' }}>Dai ({item.points})</button>
                            : <button disabled style={{ width: '100%', padding: '8px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)', fontSize: '12px', border: 'none', cursor: 'not-allowed' }}>Bado {item.points - points}</button>
                        ) : (
                          <button disabled style={{ width: '100%', padding: '8px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.25)', fontSize: '12px', border: 'none' }}>Imeisha</button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        )}

        {/* ═══ CASHBACK TAB ═══ */}
        {activeTab === 'cashback' && (
          <>
            {/* Balance hero */}
            <div style={{ borderRadius: 24, padding: '28px 24px', background: 'linear-gradient(135deg,#052e16,#065f46,#16a34a)', border: '1px solid rgba(74,222,128,0.2)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,222,128,0.2) 0%, transparent 70%)' }} />
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: 6, letterSpacing: '0.4px' }}>JUMLA YA CASHBACK</p>
              <p style={{ fontSize: '40px', fontWeight: 900, color: '#fff', letterSpacing: '-1.5px', marginBottom: 4 }}>{fmt(cashbackBalance)}</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>Daraja: {currentTierData.name} · {currentTierData.multiplier} rewards</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <button style={{ padding: '13px', borderRadius: 16, background: '#fff', color: '#16a34a', fontWeight: 800, fontSize: '14px', border: 'none', cursor: 'pointer' }}>Toa Fedha</button>
                <button style={{ padding: '13px', borderRadius: 16, background: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 800, fontSize: '14px', border: 'none', cursor: 'pointer' }}>Tumia Sasa</button>
              </div>
            </div>

            {/* Tier rates */}
            <div style={{ borderRadius: 20, padding: '18px', ...cardStyle }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.4px', marginBottom: 14 }}>VIWANGO VYA CASHBACK KWA DARAJA</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { name: 'Bronze', rate: '0.5%', icon: Award, color: '#f97316', width: 15 },
                  { name: 'Silver', rate: '1%',   icon: Star,  color: '#94a3b8', width: 30 },
                  { name: 'Gold',   rate: '2%',   icon: Flame, color: '#fbbf24', width: 55, current: tier === 'Gold' },
                  { name: 'Platinum', rate: '5%', icon: Crown, color: '#a78bfa', width: 100 },
                ].map(({ name, rate, icon: TIcon, color, width, current }) => (
                  <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <TIcon style={{ width: 18, height: 18, color, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: '13px', fontWeight: current ? 800 : 500, color: current ? '#fff' : 'rgba(255,255,255,0.6)' }}>{name}</span>
                        <span style={{ fontSize: '13px', fontWeight: 800, color }}>  {rate}</span>
                      </div>
                      <div style={{ height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${width}%`, borderRadius: 4, background: color, transition: 'width 0.8s ease' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent cashback */}
            <div>
              <p style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.4px', marginBottom: 10 }}>CASHBACK ZA HIVI KARIBUNI</p>
              {[
                { label: 'Umelipa The Slipway', value: '+TZS 500', sub: '2% cashback · Masaa 2 yaliyopita' },
                { label: 'Bili ya Umeme', value: '+TZS 200', sub: '1% cashback · Jana' },
                { label: 'Manunuzi ya Duka la Mitaa', value: '+TZS 350', sub: '2× bonus · Siku 3 zilizopita' },
              ].map(({ label, value, sub }) => (
                <div key={label} style={{ borderRadius: 16, padding: '14px', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', ...cardStyle }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', marginBottom: 3 }}>{label}</p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{sub}</p>
                  </div>
                  <p style={{ fontSize: '15px', fontWeight: 900, color: '#4ade80', flexShrink: 0, marginLeft: 12 }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Fraud protection */}
            <div style={{ borderRadius: 18, padding: '14px 16px', ...infoStyle('59,130,246'), display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <Shield style={{ width: 18, height: 18, color: '#60a5fa', flexShrink: 0, marginTop: 2 }} />
              <div>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#93c5fd', marginBottom: 3 }}>Ulinzi wa Udanganyifu Umewashwa</p>
                <p style={{ fontSize: '12px', color: 'rgba(147,197,253,0.7)', lineHeight: 1.5 }}>Cashback yako inalindwa na usalama wa kiwango cha benki, AI fraud monitoring, na ulinzi wa kifaa.</p>
              </div>
            </div>
          </>
        )}

        {/* ═══ FAMILY POOL TAB ═══ */}
        {activeTab === 'family' && (
          <>
            <div style={{ borderRadius: 20, padding: '16px 18px', background: 'linear-gradient(135deg,#3b0764,#6d28d9)', border: '1px solid rgba(167,139,250,0.2)' }}>
              <p style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginBottom: 4 }}>Mfuko wa Familia & Marafiki</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Shiriki tuzo, okoa pamoja, fikia malengo kama jamii</p>
            </div>

            {familyPools.map((pool) => {
              const pct = (pool.totalPoints / pool.goalPoints) * 100;
              return (
                <div key={pool.id} style={{ borderRadius: 20, padding: '18px', ...cardStyle }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Users style={{ width: 24, height: 24, color: '#a78bfa' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '15px', fontWeight: 800, color: '#fff', marginBottom: 2 }}>{pool.name}</p>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{pool.members} wanachama</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: '#a78bfa' }}>{pool.totalPoints.toLocaleString()}</p>
                      <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>/ {pool.goalPoints.toLocaleString()}</p>
                    </div>
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Lengo: {pool.goal}</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#fff' }}>{Math.round(pct)}%</span>
                    </div>
                    <div style={{ height: 8, borderRadius: 8, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, borderRadius: 8, background: 'linear-gradient(90deg,#7c3aed,#a78bfa)', transition: 'width 0.8s ease' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div style={{ borderRadius: 14, padding: '12px', background: 'rgba(255,255,255,0.05)' }}>
                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: 3 }}>Mchango Wako</p>
                      <p style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>{pool.yourContribution.toLocaleString()}</p>
                    </div>
                    <button style={{ borderRadius: 14, padding: '12px', background: '#7c3aed', color: '#fff', fontWeight: 800, fontSize: '14px', border: 'none', cursor: 'pointer' }}>Changia</button>
                  </div>
                </div>
              );
            })}

            <button style={{ width: '100%', borderRadius: 20, padding: '16px', background: 'transparent', border: '2px dashed rgba(167,139,250,0.25)', color: 'rgba(255,255,255,0.4)', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Plus style={{ width: 18, height: 18 }} />
              Unda Mfuko Mpya
            </button>
          </>
        )}

        {/* ═══ ACHIEVEMENTS TAB ═══ */}
        {activeTab === 'achievements' && (
          <>
            {/* Header stats */}
            <div style={{ borderRadius: 20, padding: '16px 18px', background: 'linear-gradient(135deg,#422006,#713f12,#ca8a04)', border: '1px solid rgba(251,191,36,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Beji za Mafanikio</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: 3 }}>
                  {achievements.filter(a => a.earned).length} kati ya {achievements.length} zimepatikana
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '32px', fontWeight: 900, color: '#fbbf24' }}>{achievements.filter(a => a.earned).length}</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Beji</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {achievements.map((ach) => {
                const AchIcon = ACHIEVEMENT_ICON_MAP[ach.id] ?? Award;
                return (
                  <div key={ach.id} style={{ borderRadius: 18, padding: '18px 12px', textAlign: 'center',
                    ...(ach.earned
                      ? { background: 'linear-gradient(135deg,#422006,#ca8a04)', border: '1px solid rgba(251,191,36,0.3)', boxShadow: '0 4px 20px rgba(251,191,36,0.2)' }
                      : cardStyle)
                  }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px',
                      background: ach.earned ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)',
                    }}>
                      <AchIcon style={{ width: 24, height: 24, color: ach.earned ? '#fff' : 'rgba(255,255,255,0.25)' }} />
                    </div>
                    <p style={{ fontSize: '12px', fontWeight: 800, color: ach.earned ? '#fff' : 'rgba(255,255,255,0.5)', marginBottom: 4 }}>{ach.name}</p>
                    <p style={{ fontSize: '11px', color: ach.earned ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.3)', lineHeight: 1.4 }}>{ach.description}</p>
                    {ach.earned && (
                      <div style={{ marginTop: 10, display: 'inline-block', padding: '4px 12px', borderRadius: 20, background: 'rgba(255,255,255,0.2)', fontSize: '10px', fontWeight: 800, color: '#fff' }}>✓ Earned</div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Location bonus */}
            <div style={{ borderRadius: 18, padding: '16px', ...infoStyle('59,130,246') }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                <MapPin style={{ width: 18, height: 18, color: '#60a5fa', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: '#93c5fd', marginBottom: 3 }}>Zawadi za Mahali</p>
                  <p style={{ fontSize: '11px', color: 'rgba(147,197,253,0.7)' }}>Tembelea maeneo ya washirika kupata pointi za ziada!</p>
                </div>
              </div>
              {[{ name: 'Mlimani City Mall', pts: '+50 pts' }, { name: 'The Slipway', pts: '+75 pts' }].map(({ name, pts }) => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 12, padding: '10px 12px', marginBottom: 6, background: 'rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Store style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.4)' }} />
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{name}</span>
                  </div>
                  <span style={{ padding: '3px 10px', borderRadius: 20, background: 'rgba(96,165,250,0.15)', color: '#93c5fd', fontSize: '11px', fontWeight: 800 }}>{pts}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ═══ AI INSIGHTS TAB ═══ */}
        {activeTab === 'ai' && (
          <>
            <div style={{ borderRadius: 20, padding: '16px 18px', background: 'linear-gradient(135deg,#1e1b4b,#312e81,#4338ca)', border: '1px solid rgba(129,140,248,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <Sparkles style={{ width: 18, height: 18, color: '#818cf8' }} />
                <p style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Uboreshaji wa AI</p>
              </div>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Mapendekezo ya kibinafsi ili kuongeza tuzo zako</p>
            </div>

            {/* Personalized cards */}
            <div style={{ borderRadius: 20, padding: '18px', ...cardStyle }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.4px', marginBottom: 14 }}>KWA AJILI YAKO</p>
              {[
                { label: 'Ofa Bora Leo', accent: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.15)', text: 'Addis in Dar ina 2× pointi mpaka saa 8 jioni. Unapenda chakula cha Ethiopia — pata pointi 100!', btnBg: '#16a34a', btn: 'Angalia Ofa' },
                { label: 'Pendekezo Zuri', accent: '#60a5fa', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.15)', text: 'Uko karibu na daraja la Gold! Fanya malipo 2 zaidi wiki hii ili kupata 2× zawadi daima.', btnBg: '#2563eb', btn: 'Angalia Kazi' },
                { label: 'Punguzo la Auto', accent: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.15)', text: 'AI imepata punguzo la 15% kwa malipo yako ya mwisho. Tutaomba moja kwa moja!', btnBg: '#7c3aed', btn: 'Washa Auto-Apply' },
              ].map(({ label, accent, bg, border, text, btnBg, btn }) => (
                <div key={label} style={{ borderRadius: 14, padding: '14px', marginBottom: 10, background: bg, border: `1px solid ${border}` }}>
                  <p style={{ fontSize: '11px', fontWeight: 800, color: accent, marginBottom: 6, letterSpacing: '0.3px' }}>{label.toUpperCase()}</p>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginBottom: 12 }}>{text}</p>
                  <button style={{ padding: '8px 16px', borderRadius: 20, background: btnBg, color: '#fff', fontSize: '12px', fontWeight: 800, border: 'none', cursor: 'pointer' }}>{btn}</button>
                </div>
              ))}
            </div>

            {/* Behaviour patterns */}
            <div style={{ borderRadius: 20, padding: '18px', ...cardStyle }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.4px', marginBottom: 14 }}>MWENENDO WAKO</p>
              {[
                { icon: Heart, label: 'Unaagiza pizza Ijumaa', badge: '+2× pointi', badgeBg: 'rgba(251,191,36,0.12)', badgeColor: '#fbbf24' },
                { icon: Zap, label: 'Bili ya umeme inadai siku 5', badge: 'Nikumbushe', badgeBg: '#16a34a', badgeColor: '#fff', isBtn: true },
              ].map(({ icon: IcIcon, label, badge, badgeBg, badgeColor }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', borderRadius: 12, marginBottom: 8, background: 'rgba(255,255,255,0.04)' }}>
                  <IcIcon style={{ width: 18, height: 18, color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', flex: 1 }}>{label}</p>
                  <span style={{ padding: '5px 12px', borderRadius: 20, background: badgeBg, color: badgeColor, fontSize: '11px', fontWeight: 800, flexShrink: 0 }}>{badge}</span>
                </div>
              ))}
            </div>

            {/* Partner multipliers */}
            <div style={{ borderRadius: 20, padding: '18px', ...cardStyle }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.4px', marginBottom: 14 }}>WASHIRIKA WA POINTI ZAIDI</p>
              {[
                { name: "Mama Halima's Duka", badge: '3× Wikendi', badgeColor: '#fb923c', badgeBg: 'rgba(249,115,22,0.12)' },
                { name: 'Karibu Mama Lishe',  badge: '2× Kila Siku',  badgeColor: '#4ade80', badgeBg: 'rgba(74,222,128,0.12)' },
              ].map(({ name, badge, badgeColor, badgeBg }) => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderRadius: 12, marginBottom: 8, background: 'rgba(255,255,255,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Store style={{ width: 16, height: 16, color: 'rgba(255,255,255,0.35)' }} />
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{name}</span>
                  </div>
                  <span style={{ padding: '5px 12px', borderRadius: 20, background: badgeBg, color: badgeColor, fontSize: '11px', fontWeight: 800 }}>{badge}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
