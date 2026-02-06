import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { User } from '../App';
import { 
  ArrowLeft, 
  Gift,
  Star,
  Trophy,
  Coins,
  ShoppingBag,
  Ticket,
  ChevronRight,
  Zap,
  Crown,
  TrendingUp,
  Users,
  MapPin,
  Calendar,
  Award,
  Sparkles,
  Target,
  Lock,
  Unlock,
  Percent,
  DollarSign,
  Phone,
  Wifi,
  WifiOff,
  Bell,
  MessageSquare,
  Shield,
  Flame,
  BadgeCheck,
  Heart,
  Home,
  Store,
  Banknote,
  Wallet,
  ArrowRight,
  Check,
  X,
  Play,
  Send,
  Download,
  Upload,
  Settings,
  Info,
  AlertCircle,
  TrendingDown,
  Clock,
  Repeat,
  Filter,
  Search,
  Share2,
  Eye,
  EyeOff
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface GOrewardsUltimateProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

export function GOrewardsUltimate({ user, accessToken, onBack }: GOrewardsUltimateProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'earn' | 'marketplace' | 'cashback' | 'family' | 'achievements' | 'ai'>('home');
  const [points, setPoints] = useState(0);
  const [tier, setTier] = useState('Bronze');
  const [cashbackBalance, setCashbackBalance] = useState(0);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [streak, setStreak] = useState(0);
  const [surpriseRewards, setSurpriseRewards] = useState<any[]>([]);
  const [showSurprise, setShowSurprise] = useState(false);

  useEffect(() => {
    fetchRewardsData();
    checkForSurpriseReward();
  }, []);

  const fetchRewardsData = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/rewards/balance`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPoints(data.points || 0);
        setTier(data.tier || 'Bronze');
        setCashbackBalance(data.cashback || 0);
        setTodayEarnings(data.todayEarnings || 0);
        setStreak(data.streak || 0);
      }
    } catch (error) {
      console.error('Error fetching rewards:', error);
      // Demo data
      setPoints(4250);
      setTier('Gold');
      setCashbackBalance(45000);
      setTodayEarnings(250);
      setStreak(12);
    }
  };

  const checkForSurpriseReward = () => {
    // Simulate random surprise rewards
    const random = Math.random();
    if (random > 0.7) {
      const surprises = [
        { type: 'bundle', value: '500 MB', icon: '📱' },
        { type: 'cash', value: 'TZS 500', icon: '💰' },
        { type: 'delivery', value: 'Free Delivery', icon: '🚚' },
        { type: 'points', value: '100 Points', icon: '⭐' },
      ];
      const randomSurprise = surprises[Math.floor(Math.random() * surprises.length)];
      setSurpriseRewards([randomSurprise]);
      setShowSurprise(true);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Tier System with Multipliers
  const tiers = [
    {
      name: 'Bronze',
      color: 'from-orange-400 to-amber-600',
      icon: '🌱',
      multiplier: '1×',
      requirement: 'Just joined',
      benefits: ['Earn points', 'Basic cashback', 'Access marketplace'],
      nextTier: 1000,
      current: tier === 'Bronze'
    },
    {
      name: 'Silver',
      color: 'from-gray-300 to-gray-500',
      icon: '💎',
      multiplier: '1.5×',
      requirement: '1,000+ points earned',
      benefits: ['1.5× rewards', '1% cashback', 'Monthly surprises', 'Priority support'],
      nextTier: 5000,
      current: tier === 'Silver'
    },
    {
      name: 'Gold',
      color: 'from-yellow-400 to-yellow-600',
      icon: '🔥',
      multiplier: '2×',
      requirement: '5,000+ points earned',
      benefits: ['2× rewards', '2% cashback', 'Free delivery', 'Exclusive deals'],
      nextTier: 15000,
      current: tier === 'Gold'
    },
    {
      name: 'Platinum',
      color: 'from-purple-400 to-pink-600',
      icon: '👑',
      multiplier: '3×',
      requirement: '15,000+ points earned',
      benefits: ['3× rewards', '5% cashback', 'VIP support', 'Early access', 'Partner perks'],
      nextTier: null,
      current: tier === 'Platinum'
    },
  ];

  // Marketplace Rewards
  const marketplaceRewards = [
    {
      category: 'Bundles & Airtime',
      items: [
        { id: '1', name: '500 MB Vodacom', points: 100, value: 'TZS 1,000', icon: '📱', available: true },
        { id: '2', name: '1 GB Airtel', points: 180, value: 'TZS 1,800', icon: '📱', available: true },
        { id: '3', name: 'TZS 5,000 Airtime', points: 500, value: 'TZS 5,000', icon: '☎️', available: true },
        { id: '4', name: 'TZS 10,000 Airtime', points: 950, value: 'TZS 10,000', icon: '☎️', available: true },
      ]
    },
    {
      category: 'Shopping & Delivery',
      items: [
        { id: '5', name: '10% Off Jumia', points: 200, value: 'Up to TZS 50,000', icon: '🛍️', available: true },
        { id: '6', name: 'Free Delivery (3x)', points: 150, value: 'TZS 3,000', icon: '🚚', available: true },
        { id: '7', name: 'TZS 20,000 Shopping Voucher', points: 1800, value: 'TZS 20,000', icon: '🎁', available: true },
      ]
    },
    {
      category: 'Bills & Utilities',
      items: [
        { id: '8', name: 'TZS 10,000 Electricity', points: 900, value: 'TZS 10,000', icon: '⚡', available: true },
        { id: '9', name: 'TZS 5,000 Water Bill', points: 450, value: 'TZS 5,000', icon: '💧', available: true },
        { id: '10', name: 'School Fees Voucher', points: 2000, value: 'TZS 25,000', icon: '🎓', available: true },
      ]
    },
    {
      category: 'Entertainment',
      items: [
        { id: '11', name: 'Cinema Ticket (1x)', points: 350, value: 'Century Cinemax', icon: '🎬', available: true },
        { id: '12', name: 'Cinema Tickets (2x)', points: 650, value: 'Century Cinemax', icon: '🍿', available: true },
        { id: '13', name: 'DStv Premium (1 month)', points: 5000, value: 'TZS 60,000', icon: '📺', available: false },
      ]
    },
    {
      category: 'Travel & Transport',
      items: [
        { id: '14', name: 'Bajaji Ride (3x)', points: 120, value: 'TZS 6,000', icon: '🛺', available: true },
        { id: '15', name: 'Bus Ticket Dar-Arusha', points: 2500, value: 'TZS 35,000', icon: '🚌', available: true },
        { id: '16', name: 'Precision Air Discount', points: 8000, value: '15% Off', icon: '✈️', available: true },
      ]
    },
    {
      category: 'Dining',
      items: [
        { id: '17', name: 'The Slipway TZS 20K', points: 1500, value: 'TZS 20,000', icon: '🍽️', available: true },
        { id: '18', name: 'Addis in Dar TZS 15K', points: 1200, value: 'TZS 15,000', icon: '☕', available: true },
        { id: '19', name: 'Any Restaurant 10% Off', points: 400, value: 'Up to TZS 30K', icon: '🍴', available: true },
      ]
    },
  ];

  // Earning Activities
  const earningActivities = [
    {
      category: 'Daily Tasks',
      tasks: [
        { id: '1', title: 'Make 1 payment', points: 20, icon: '💳', completed: true, frequency: 'Daily' },
        { id: '2', title: 'Send money to friend', points: 15, icon: '💸', completed: false, frequency: 'Daily' },
        { id: '3', title: 'Use AI Assistant', points: 10, icon: '🤖', completed: true, frequency: 'Daily' },
        { id: '4', title: 'Check-in daily', points: 5, icon: '📅', completed: true, frequency: 'Daily' },
      ]
    },
    {
      category: 'Transactions',
      tasks: [
        { id: '5', title: 'Pay bill (any)', points: 30, icon: '📄', completed: false, frequency: 'Per transaction' },
        { id: '6', title: 'Top up bundles', points: 10, icon: '📱', completed: true, frequency: 'Per transaction' },
        { id: '7', title: 'Pay merchant QR', points: 25, icon: '📲', completed: false, frequency: 'Per transaction' },
        { id: '8', title: 'Order delivery', points: 40, icon: '🛵', completed: false, frequency: 'Per transaction' },
      ]
    },
    {
      category: 'Neighborhood Bonus (2× Points!)',
      tasks: [
        { id: '9', title: 'Buy from Mama Lishe', points: 50, icon: '🍲', completed: false, frequency: 'Per transaction', bonus: true },
        { id: '10', title: 'Pay Bodaboda', points: 30, icon: '🏍️', completed: false, frequency: 'Per transaction', bonus: true },
        { id: '11', title: 'Shop at local duka', points: 35, icon: '🏪', completed: false, frequency: 'Per transaction', bonus: true },
      ]
    },
    {
      category: 'Growth & Referrals',
      tasks: [
        { id: '12', title: 'Refer 1 friend', points: 200, icon: '👥', completed: false, frequency: 'One-time' },
        { id: '13', title: 'Complete KYC', points: 100, icon: '✅', completed: true, frequency: 'One-time' },
        { id: '14', title: 'Link bank account', points: 150, icon: '🏦', completed: false, frequency: 'One-time' },
      ]
    },
    {
      category: 'Financial Goals',
      tasks: [
        { id: '15', title: 'Save TZS 10,000', points: 100, icon: '💰', completed: false, frequency: 'Per milestone' },
        { id: '16', title: 'Pay on time (no late fees)', points: 50, icon: '⏰', completed: true, frequency: 'Monthly' },
        { id: '17', title: 'Maintain savings streak', points: 75, icon: '📈', completed: false, frequency: 'Weekly' },
      ]
    },
  ];

  // Achievement Badges
  const achievements = [
    { id: '1', name: '30-Day Streak', icon: '🔥', earned: true, description: 'Used app 30 days in a row' },
    { id: '2', name: 'First Payment', icon: '🎯', earned: true, description: 'Made your first payment' },
    { id: '3', name: 'Community Hero', icon: '🌟', earned: true, description: 'Supported 10 local businesses' },
    { id: '4', name: '100 Transactions', icon: '💯', earned: false, description: 'Complete 100 transactions' },
    { id: '5', name: 'School Fees Paid', icon: '🎓', earned: true, description: 'Paid school fees on time' },
    { id: '6', name: 'Savings Champion', icon: '🏆', earned: false, description: 'Save TZS 100,000' },
    { id: '7', name: 'Referral Master', icon: '👑', earned: false, description: 'Refer 5 friends' },
    { id: '8', name: 'Explorer', icon: '🗺️', earned: true, description: 'Used 10 different features' },
  ];

  // Seasonal Events
  const seasonalEvents = [
    {
      id: '1',
      name: 'Ramadan Rewards',
      description: 'Double points on all transactions during Ramadan',
      multiplier: '2×',
      active: false,
      startsIn: '45 days',
      icon: '🌙',
      color: 'from-purple-500 to-blue-600'
    },
    {
      id: '2',
      name: 'Back to School Bonanza',
      description: 'Triple cashback on school fee payments',
      multiplier: '3×',
      active: false,
      startsIn: '12 days',
      icon: '🎒',
      color: 'from-green-500 to-teal-600'
    },
    {
      id: '3',
      name: 'GO Friday',
      description: 'Mega deals every Friday - Up to 50% cashback!',
      multiplier: '5×',
      active: true,
      startsIn: 'Live Now!',
      icon: '🎉',
      color: 'from-red-500 to-pink-600'
    },
  ];

  // Family Pool
  const familyPools = [
    {
      id: '1',
      name: 'Mwangi Family',
      members: 5,
      totalPoints: 8500,
      yourContribution: 2400,
      goal: 'School Fees',
      goalPoints: 10000,
      icon: '👨‍👩‍👧‍👦'
    },
    {
      id: '2',
      name: 'Christmas Savings',
      members: 3,
      totalPoints: 3200,
      yourContribution: 1500,
      goal: 'Shopping Voucher',
      goalPoints: 5000,
      icon: '🎄'
    },
  ];

  // AI Insights
  const aiInsights = [
    {
      type: 'opportunity',
      title: 'Earn 200 points today!',
      description: 'You\'re close to Silver tier. Make 2 more payments to unlock 1.5× rewards.',
      action: 'View tasks',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600'
    },
    {
      type: 'deal',
      title: 'Smart Deal Alert',
      description: 'The Slipway has 2× points this weekend. Your favorite restaurant!',
      action: 'Activate',
      icon: Sparkles,
      color: 'from-yellow-500 to-orange-600'
    },
    {
      type: 'savings',
      title: 'Cashback Ready',
      description: 'You have TZS 45,000 in cashback. Withdraw or spend on delivery.',
      action: 'Withdraw',
      icon: Wallet,
      color: 'from-blue-500 to-cyan-600'
    },
  ];

  const currentTierData = tiers.find(t => t.current) || tiers[0];
  const currentTierIndex = tiers.findIndex(t => t.current);
  const nextTierData = currentTierIndex < tiers.length - 1 ? tiers[currentTierIndex + 1] : null;
  const progressToNextTier = nextTierData ? (points / nextTierData.nextTier!) * 100 : 100;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className={`bg-gradient-to-br ${currentTierData.color} px-5 pt-8 pb-6 relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <button 
            onClick={onBack}
            className="bg-white/20 backdrop-blur-md hover:bg-white/30 p-2 rounded-full mb-6 transition-all active:scale-95"
          >
            <ArrowLeft className="size-5 text-white" />
          </button>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl text-white mb-1">GOrewards</h1>
              <p className="text-white/80 text-sm">The Ultimate Reward System</p>
            </div>
            <div className="text-5xl">{currentTierData.icon}</div>
          </div>

          {/* Points & Tier Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/70 text-xs mb-1">Your Points</p>
                <p className="text-white text-3xl">{points.toLocaleString()}</p>
                <p className="text-white/60 text-xs mt-1">= {formatCurrency(points * 0.1)}</p>
              </div>
              <div className="text-right">
                <p className="text-white/70 text-xs mb-1">Tier</p>
                <div className="bg-white/20 rounded-full px-4 py-2">
                  <p className="text-white">{currentTierData.name}</p>
                </div>
                <p className="text-white/60 text-xs mt-1">{currentTierData.multiplier} rewards</p>
              </div>
            </div>

            {nextTierData && (
              <>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(progressToNextTier, 100)}%` }}
                  />
                </div>
                <p className="text-white/70 text-xs text-center">
                  {nextTierData.nextTier! - points} points to {nextTierData.name}
                </p>
              </>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3">
              <p className="text-white/70 text-xs mb-1">Cashback</p>
              <p className="text-white text-lg">{formatCurrency(cashbackBalance)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3">
              <p className="text-white/70 text-xs mb-1">Today</p>
              <p className="text-white text-lg">+{todayEarnings}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3">
              <p className="text-white/70 text-xs mb-1">Streak</p>
              <p className="text-white text-lg flex items-center gap-1">
                <Flame className="size-4 text-orange-300" />
                {streak}d
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Surprise Reward Modal */}
      {showSurprise && surpriseRewards.length > 0 && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-5">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center animate-in fade-in zoom-in">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl mb-2">Surprise Reward!</h2>
            <p className="text-gray-600 mb-6">You've earned a random drop!</p>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 mb-6">
              <div className="text-4xl mb-2">{surpriseRewards[0].icon}</div>
              <p className="text-white text-xl">{surpriseRewards[0].value}</p>
            </div>
            <Button
              onClick={() => setShowSurprise(false)}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full"
            >
              Claim Reward
            </Button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="px-5 py-4 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
              activeTab === 'home'
                ? 'bg-green-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <Home className="size-4" />
              Home
            </span>
          </button>
          <button
            onClick={() => setActiveTab('earn')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
              activeTab === 'earn'
                ? 'bg-green-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <Coins className="size-4" />
              Earn Points
            </span>
          </button>
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
              activeTab === 'marketplace'
                ? 'bg-green-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="size-4" />
              Marketplace
            </span>
          </button>
          <button
            onClick={() => setActiveTab('cashback')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
              activeTab === 'cashback'
                ? 'bg-green-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <Wallet className="size-4" />
              Cashback
            </span>
          </button>
          <button
            onClick={() => setActiveTab('family')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
              activeTab === 'family'
                ? 'bg-green-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <Users className="size-4" />
              Family Pool
            </span>
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
              activeTab === 'achievements'
                ? 'bg-green-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <Trophy className="size-4" />
              Achievements
            </span>
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
              activeTab === 'ai'
                ? 'bg-green-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="size-4" />
              AI Insights
            </span>
          </button>
        </div>
      </div>

      <div className="px-5 space-y-6 pb-6">
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <>
            {/* AI Insights */}
            <div>
              <h3 className="text-lg mb-3">AI Recommendations</h3>
              <div className="space-y-3">
                {aiInsights.map((insight, index) => {
                  const Icon = insight.icon;
                  return (
                    <div key={index} className={`bg-gradient-to-r ${insight.color} rounded-2xl p-4 text-white`}>
                      <div className="flex items-start gap-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                          <Icon className="size-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium mb-1">{insight.title}</p>
                          <p className="text-sm text-white/80 mb-3">{insight.description}</p>
                          <button className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm hover:bg-gray-100">
                            {insight.action}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Seasonal Events */}
            <div>
              <h3 className="text-lg mb-3">Seasonal Events</h3>
              <div className="space-y-3">
                {seasonalEvents.map(event => (
                  <div key={event.id} className={`bg-gradient-to-r ${event.color} rounded-2xl p-5 text-white relative overflow-hidden`}>
                    {event.active && (
                      <div className="absolute top-3 right-3 bg-white text-green-600 px-3 py-1 rounded-full text-xs animate-pulse">
                        LIVE NOW
                      </div>
                    )}
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{event.icon}</div>
                      <div className="flex-1">
                        <p className="text-xl mb-1">{event.name}</p>
                        <p className="text-sm text-white/80 mb-2">{event.description}</p>
                        <div className="flex items-center gap-3">
                          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                            {event.multiplier} Points
                          </span>
                          <span className="text-sm">
                            {event.active ? '⚡ Active' : `⏰ ${event.startsIn}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tier Progress */}
            <div>
              <h3 className="text-lg mb-3">Tier System</h3>
              <div className="space-y-3">
                {tiers.map((tierItem, index) => (
                  <div 
                    key={index} 
                    className={`rounded-2xl p-4 border-2 transition-all ${
                      tierItem.current 
                        ? `bg-gradient-to-r ${tierItem.color} text-white border-transparent` 
                        : 'bg-white border-gray-200 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-3xl">{tierItem.icon}</div>
                      <div className="flex-1">
                        <p className={`font-medium mb-1 ${tierItem.current ? 'text-white' : 'text-gray-900'}`}>
                          {tierItem.name}
                        </p>
                        <p className={`text-sm ${tierItem.current ? 'text-white/80' : 'text-gray-600'}`}>
                          {tierItem.requirement}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm ${
                        tierItem.current ? 'bg-white/20' : 'bg-gray-100'
                      }`}>
                        {tierItem.multiplier}
                      </div>
                    </div>
                    <div className="space-y-1">
                      {tierItem.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Check className={`size-4 ${tierItem.current ? 'text-white' : 'text-green-600'}`} />
                          <p className={`text-sm ${tierItem.current ? 'text-white/90' : 'text-gray-700'}`}>
                            {benefit}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Offline Access */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-5 text-white">
              <div className="flex items-start gap-3">
                <WifiOff className="size-6" />
                <div className="flex-1">
                  <p className="font-medium mb-2">No Internet? No Problem!</p>
                  <p className="text-sm text-white/80 mb-4">
                    Check your rewards via SMS, USSD, or phone call (IVR)
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <button className="bg-white/20 rounded-lg py-2 text-sm">
                      *123#
                    </button>
                    <button className="bg-white/20 rounded-lg py-2 text-sm">
                      SMS
                    </button>
                    <button className="bg-white/20 rounded-lg py-2 text-sm">
                      Call
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* EARN TAB */}
        {activeTab === 'earn' && (
          <>
            {earningActivities.map((category, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg">{category.category}</h3>
                  {category.category.includes('Neighborhood') && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                      2× Points!
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  {category.tasks.map(task => (
                    <div 
                      key={task.id} 
                      className={`bg-white rounded-2xl p-4 shadow-sm border ${
                        task.completed ? 'border-green-200' : 'border-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`text-3xl ${task.bonus ? 'animate-pulse' : ''}`}>
                          {task.icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium mb-1">{task.title}</p>
                          <div className="flex items-center gap-2">
                            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">
                              +{task.points} points
                            </span>
                            <span className="text-xs text-gray-500">{task.frequency}</span>
                          </div>
                        </div>
                        {task.completed ? (
                          <div className="bg-green-100 p-2 rounded-lg">
                            <Check className="size-5 text-green-600" />
                          </div>
                        ) : (
                          <button className="bg-green-600 text-white px-4 py-2 rounded-full text-sm hover:bg-green-700">
                            Earn
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Watch Ads for Points */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Play className="size-6" />
                <div className="flex-1">
                  <p className="font-medium mb-1">Watch & Earn (Optional)</p>
                  <p className="text-sm text-white/80">Watch short ads to earn bonus points</p>
                </div>
              </div>
              <button className="w-full bg-white text-purple-600 py-3 rounded-full hover:bg-gray-100">
                Watch Ad (+50 points)
              </button>
            </div>
          </>
        )}

        {/* MARKETPLACE TAB */}
        {activeTab === 'marketplace' && (
          <>
            {marketplaceRewards.map((category, index) => (
              <div key={index}>
                <h3 className="text-lg mb-3">{category.category}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {category.items.map(item => (
                    <div 
                      key={item.id} 
                      className={`rounded-2xl p-4 ${
                        item.available 
                          ? 'bg-white border border-gray-200' 
                          : 'bg-gray-100 border border-gray-300 opacity-60'
                      }`}
                    >
                      <div className="text-3xl mb-3 text-center">{item.icon}</div>
                      <p className="text-sm mb-2 text-center">{item.name}</p>
                      <p className="text-xs text-gray-500 mb-3 text-center">{item.value}</p>
                      {item.available ? (
                        points >= item.points ? (
                          <button className="w-full bg-green-600 text-white py-2 rounded-full text-sm hover:bg-green-700">
                            Redeem ({item.points})
                          </button>
                        ) : (
                          <button className="w-full bg-gray-300 text-gray-600 py-2 rounded-full text-sm cursor-not-allowed">
                            {item.points - points} more
                          </button>
                        )
                      ) : (
                        <button className="w-full bg-gray-300 text-gray-500 py-2 rounded-full text-sm cursor-not-allowed">
                          Out of Stock
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {/* CASHBACK TAB */}
        {activeTab === 'cashback' && (
          <>
            <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-3xl p-6 text-white">
              <h3 className="text-sm text-green-100 mb-2">Total Cashback Balance</h3>
              <p className="text-4xl mb-4">{formatCurrency(cashbackBalance)}</p>
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-white text-green-600 py-3 rounded-full hover:bg-gray-100">
                  Withdraw
                </button>
                <button className="bg-white/20 backdrop-blur-sm text-white py-3 rounded-full hover:bg-white/30">
                  Use Now
                </button>
              </div>
            </div>

            {/* Cashback Tiers */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-lg mb-4">Cashback Rates by Tier</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌱</span>
                    <span className="text-gray-700">Bronze</span>
                  </div>
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">0.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💎</span>
                    <span className="text-gray-700">Silver</span>
                  </div>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">1%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🔥</span>
                    <span className="text-gray-700">Gold</span>
                  </div>
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">👑</span>
                    <span className="text-gray-700">Platinum</span>
                  </div>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">5%</span>
                </div>
              </div>
            </div>

            {/* Recent Cashback */}
            <div>
              <h3 className="text-lg mb-3">Recent Cashback</h3>
              <div className="space-y-3">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">Paid at The Slipway</p>
                    <p className="text-green-600">+TZS 500</p>
                  </div>
                  <p className="text-sm text-gray-500">2% cashback • 2 hours ago</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">Electricity Bill</p>
                    <p className="text-green-600">+TZS 200</p>
                  </div>
                  <p className="text-sm text-gray-500">1% cashback • Yesterday</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">Local Duka Purchase</p>
                    <p className="text-green-600">+TZS 350</p>
                  </div>
                  <p className="text-sm text-gray-500">2× bonus • 3 days ago</p>
                </div>
              </div>
            </div>

            {/* Fraud Protection */}
            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-200">
              <div className="flex items-start gap-3">
                <Shield className="size-6 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900 mb-1">Fraud Protection Active</p>
                  <p className="text-sm text-blue-700">
                    Your cashback is protected with bank-grade security, device fingerprinting, and AI fraud monitoring.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* FAMILY POOL TAB */}
        {activeTab === 'family' && (
          <>
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-5 text-white mb-4">
              <h3 className="text-xl mb-2">Family & Friends Pool</h3>
              <p className="text-sm text-white/80">Share rewards, save together, achieve goals as a community</p>
            </div>

            {familyPools.map(pool => (
              <div key={pool.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">{pool.icon}</div>
                  <div className="flex-1">
                    <p className="font-medium mb-1">{pool.name}</p>
                    <p className="text-sm text-gray-500">{pool.members} members</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Goal: {pool.goal}</span>
                    <span className="font-medium">{pool.totalPoints} / {pool.goalPoints}</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-teal-600 rounded-full"
                      style={{ width: `${(pool.totalPoints / pool.goalPoints) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">Your Share</p>
                    <p className="text-lg">{pool.yourContribution}</p>
                  </div>
                  <button className="bg-green-600 text-white rounded-xl hover:bg-green-700">
                    Contribute
                  </button>
                </div>
              </div>
            ))}

            <button className="w-full bg-white border-2 border-dashed border-gray-300 rounded-2xl p-4 text-gray-600 hover:border-green-500 hover:text-green-600">
              + Create New Pool
            </button>
          </>
        )}

        {/* ACHIEVEMENTS TAB */}
        {activeTab === 'achievements' && (
          <>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-5 text-white mb-4">
              <h3 className="text-xl mb-2">Achievement Badges</h3>
              <p className="text-sm text-white/80">{achievements.filter(a => a.earned).length} of {achievements.length} earned</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {achievements.map(achievement => (
                <div 
                  key={achievement.id} 
                  className={`rounded-2xl p-4 text-center ${
                    achievement.earned 
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' 
                      : 'bg-gray-100 border border-gray-300'
                  }`}
                >
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <p className={`text-sm mb-2 ${achievement.earned ? 'text-white' : 'text-gray-900'}`}>
                    {achievement.name}
                  </p>
                  <p className={`text-xs ${achievement.earned ? 'text-white/80' : 'text-gray-500'}`}>
                    {achievement.description}
                  </p>
                  {achievement.earned && (
                    <div className="mt-3 bg-white/20 rounded-full px-3 py-1 text-xs">
                      ✓ Earned
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Location-Based Rewards */}
            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-200">
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="size-6 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900 mb-1">Location-Based Rewards</p>
                  <p className="text-sm text-blue-700 mb-3">
                    Visit partner locations to earn bonus points!
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-white rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏪</span>
                    <span className="text-sm">Mlimani City Mall</span>
                  </div>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">+50 pts</span>
                </div>
                <div className="flex items-center justify-between bg-white rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🍽️</span>
                    <span className="text-sm">The Slipway</span>
                  </div>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">+75 pts</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* AI TAB */}
        {activeTab === 'ai' && (
          <>
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-5 text-white mb-4">
              <h3 className="text-xl mb-2">AI Rewards Optimization</h3>
              <p className="text-sm text-white/80">Smart suggestions to maximize your rewards</p>
            </div>

            {/* Personalized Suggestions */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-lg mb-4">Personalized for You</h3>
              <div className="space-y-3">
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <p className="text-sm text-green-900 mb-2">🎯 Best Deal Today</p>
                  <p className="text-gray-700">
                    Addis in Dar has 2× points until 8 PM. You love Ethiopian food - earn 100 points!
                  </p>
                  <button className="mt-3 bg-green-600 text-white px-4 py-2 rounded-full text-sm hover:bg-green-700">
                    View Deal
                  </button>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-sm text-blue-900 mb-2">💡 Smart Suggestion</p>
                  <p className="text-gray-700">
                    You're close to Gold tier! Make 2 more payments this week to unlock 2× rewards permanently.
                  </p>
                  <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700">
                    See Tasks
                  </button>
                </div>

                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <p className="text-sm text-purple-900 mb-2">🔔 Auto-Apply Alert</p>
                  <p className="text-gray-700">
                    AI found a 15% discount at your next checkout. We'll apply it automatically!
                  </p>
                  <button className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-full text-sm hover:bg-purple-700">
                    Enable Auto-Apply
                  </button>
                </div>
              </div>
            </div>

            {/* Predictive Insights */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-lg mb-4">What You'll Love</h3>
              <p className="text-sm text-gray-600 mb-4">Based on your transaction history:</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <span className="text-2xl">🍕</span>
                  <div className="flex-1">
                    <p className="text-sm">You order pizza on Fridays</p>
                  </div>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                    +2× points
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <span className="text-2xl">⚡</span>
                  <div className="flex-1">
                    <p className="text-sm">Electricity bill due in 5 days</p>
                  </div>
                  <button className="text-xs bg-green-600 text-white px-3 py-1 rounded-full">
                    Remind Me
                  </button>
                </div>
              </div>
            </div>

            {/* Partner Business Rewards */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-lg mb-4">Partner Multipliers</h3>
              <p className="text-sm text-gray-600 mb-4">Local businesses offering extra rewards:</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl border border-orange-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏪</span>
                    <span className="text-sm">Mama Halima's Duka</span>
                  </div>
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs">
                    3× Weekend
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🍲</span>
                    <span className="text-sm">Karibu Mama Lishe</span>
                  </div>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                    2× Daily
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
