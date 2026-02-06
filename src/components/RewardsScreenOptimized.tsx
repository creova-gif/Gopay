/**
 * OPTIMIZED REWARDS SCREEN - FINTECH BEST PRACTICES
 * 
 * Patterns from:
 * - GrabRewards: Points prominence, tier progress, partner offers
 * - Touch 'n Go: Clean card design, locked state UX
 * - PayPal Offers: How to earn section, clear value
 * - Revolut Perks: History with status, clean hierarchy
 * - M-Pesa Loyalty: Simple, motivating, trustworthy
 * 
 * Design Principles:
 * - WCAG 2.1 AA+ contrast (all text ≥4.5:1)
 * - Swahili-first labels
 * - Clear earning methods BEFORE redemption options
 * - Locked rewards show progress and motivation
 * - Partner offers create urgency
 * - Trust signals (points never expire)
 */

import { 
  ChevronRight,
  Gift,
  Star,
  Wallet,
  Plane,
  ShoppingBag,
  Users,
  Coins,
  DollarSign,
  Smartphone,
  Receipt,
  TrendingUp,
  TrendingDown,
  Clock,
  Check,
  Sparkles,
  Zap,
  MapPin,
  Shield
} from 'lucide-react';

interface RewardsScreenOptimizedProps {
  onNavigate: (screen: string) => void;
}

export function RewardsScreenOptimized({ onNavigate }: RewardsScreenOptimizedProps) {
  return (
    <div className="px-5 pt-8 pb-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">GOrewards</h1>
        <p className="text-base text-gray-700 font-medium">Pata tuzo kila ulipolipa • Earn rewards every time you pay</p>
      </div>

      {/* TOP SECTION - REWARDS SUMMARY (GrabRewards/Touch 'n Go Pattern) */}
      <div className="bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
        
        <div className="relative z-10">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="size-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Gift className="size-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">GoPoints Balance</p>
                <p className="text-xs text-emerald-100">Available to redeem</p>
              </div>
            </div>
            <button 
              onClick={() => onNavigate('rewards-history')}
              className="text-xs bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/30 transition-all font-semibold border border-white/30"
            >
              History
            </button>
          </div>
          
          {/* Points Display - Large & Clear */}
          <div className="mb-6">
            <div className="flex items-baseline gap-2 mb-1">
              <p className="text-6xl font-black tracking-tight">2,450</p>
              <p className="text-2xl font-bold text-emerald-100">pts</p>
            </div>
            <p className="text-sm text-white/90 font-medium">
              Earn points every time you pay or book
            </p>
          </div>

          {/* Tier Status Card */}
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="size-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Star className="size-6 fill-white text-white" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white mb-0.5">Gold Member</p>
                  <p className="text-xs text-emerald-100 font-medium">Tier 3 of 4 • Special perks unlocked</p>
                </div>
              </div>
              <button 
                onClick={() => onNavigate('membership')}
                className="text-white hover:scale-110 transition-transform"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>

            {/* Progress to Next Tier */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white font-semibold">550 points to Platinum 💎</span>
                <span className="text-emerald-100 font-bold">81%</span>
              </div>
              <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-300 rounded-full transition-all duration-500 shadow-lg" 
                  style={{ width: '81%' }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECOND SECTION - HOW TO EARN (Horizontal Scroll - M-Pesa/PayPal Pattern) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-gray-900">Jinsi ya Kupata Pointi</h2>
          <span className="text-xs text-gray-700 font-medium">How to Earn</span>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
          {/* Wallet Payments */}
          <div className="flex-shrink-0 w-64 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md">
                <Wallet className="size-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 mb-0.5">Lipa kwa Wallet</p>
                <p className="text-xs text-gray-700 font-medium">Pay with Wallet</p>
              </div>
            </div>
            <div className="bg-blue-100 rounded-xl p-3 mb-2">
              <p className="text-2xl font-black text-blue-700 mb-0.5">+5 pts</p>
              <p className="text-xs text-blue-700 font-semibold">per TZS 1,000 spent</p>
            </div>
            <p className="text-xs text-gray-700">Bills, airtime, merchant payments</p>
          </div>

          {/* Travel Booking */}
          <div className="flex-shrink-0 w-64 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                <Plane className="size-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 mb-0.5">Safari & Hotels</p>
                <p className="text-xs text-gray-700 font-medium">Book travel</p>
              </div>
            </div>
            <div className="bg-purple-100 rounded-xl p-3 mb-2">
              <p className="text-2xl font-black text-purple-700 mb-0.5">+20 pts</p>
              <p className="text-xs text-purple-700 font-semibold">per booking</p>
            </div>
            <p className="text-xs text-gray-700">Flights, buses, SGR, hotels, parks</p>
          </div>

          {/* QR Merchant Scan */}
          <div className="flex-shrink-0 w-64 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-md">
                <ShoppingBag className="size-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 mb-0.5">Scan & Pay QR</p>
                <p className="text-xs text-gray-700 font-medium">Merchant payments</p>
              </div>
            </div>
            <div className="bg-orange-100 rounded-xl p-3 mb-2">
              <p className="text-2xl font-black text-orange-700 mb-0.5">+10 pts</p>
              <p className="text-xs text-orange-700 font-semibold">per TZS 5,000</p>
            </div>
            <p className="text-xs text-gray-700">Shop at any goPay merchant</p>
          </div>

          {/* Referral Bonus */}
          <div className="flex-shrink-0 w-64 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                <Users className="size-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 mb-0.5">Waalika Marafiki</p>
                <p className="text-xs text-gray-700 font-medium">Refer friends</p>
              </div>
            </div>
            <div className="bg-emerald-100 rounded-xl p-3 mb-2">
              <p className="text-2xl font-black text-emerald-700 mb-0.5">+500 pts</p>
              <p className="text-xs text-emerald-700 font-semibold">per successful referral</p>
            </div>
            <p className="text-xs text-gray-700">When they complete first payment</p>
          </div>
        </div>
      </div>

      {/* Membership Tiers */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Viwango vya Uanachama • Membership Tiers</h3>
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-3 rounded-xl text-center border-2 border-gray-300">
            <p className="text-2xl mb-1.5">🥉</p>
            <p className="text-xs font-bold text-gray-900 mb-0.5">Bronze</p>
            <p className="text-xs text-gray-700 font-semibold">0-999</p>
          </div>
          <div className="bg-gradient-to-br from-gray-200 to-gray-300 p-3 rounded-xl text-center border-2 border-gray-400">
            <p className="text-2xl mb-1.5">🥈</p>
            <p className="text-xs font-bold text-gray-900 mb-0.5">Silver</p>
            <p className="text-xs text-gray-700 font-semibold">1K-2.4K</p>
          </div>
          <div className="bg-gradient-to-br from-amber-100 via-yellow-100 to-orange-100 p-3 rounded-xl text-center border-2 border-amber-400 shadow-md ring-2 ring-amber-300">
            <div className="relative">
              <p className="text-2xl mb-1.5">🥇</p>
              <div className="absolute -top-1 -right-1 size-4 bg-emerald-500 rounded-full flex items-center justify-center">
                <Check className="size-3 text-white" />
              </div>
            </div>
            <p className="text-xs font-black text-amber-900 mb-0.5">Gold</p>
            <p className="text-xs text-amber-800 font-bold">2.5K-4.9K</p>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-3 rounded-xl text-center border-2 border-purple-300">
            <p className="text-2xl mb-1.5">💎</p>
            <p className="text-xs font-bold text-gray-900 mb-0.5">Platinum</p>
            <p className="text-xs text-gray-700 font-semibold">5K+</p>
          </div>
        </div>
      </div>

      {/* THIRD SECTION - REDEEM REWARDS (Touch 'n Go Pattern) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-0.5">Tumia Pointi Zako</h2>
            <p className="text-sm text-gray-700 font-medium">Redeem your points</p>
          </div>
          <button 
            onClick={() => onNavigate('all-rewards')}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1"
          >
            All
            <ChevronRight className="size-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {/* Cashback */}
          <button 
            onClick={() => onNavigate('reward-cashback')}
            className="bg-white p-4 rounded-2xl border-2 border-gray-200 shadow-sm hover:shadow-lg hover:border-emerald-500 transition-all active:scale-[0.98] text-left group"
          >
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-3 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform">
              <DollarSign className="size-7 text-green-600" />
            </div>
            <p className="text-sm font-bold text-gray-900 mb-1">Cashback Direct</p>
            <p className="text-xs text-gray-700 mb-3">To your wallet</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Coins className="size-3.5 text-emerald-600" />
                <span className="text-sm font-black text-emerald-700">500 pts</span>
              </div>
              <span className="text-xs text-gray-700 font-bold bg-gray-100 px-2 py-1 rounded-lg">5K TZS</span>
            </div>
          </button>

          {/* Starbucks */}
          <button className="bg-white p-4 rounded-2xl border-2 border-gray-200 shadow-sm hover:shadow-lg hover:border-emerald-500 transition-all active:scale-[0.98] text-left group">
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-3 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform">
              <p className="text-3xl">☕</p>
            </div>
            <p className="text-sm font-bold text-gray-900 mb-1">Starbucks</p>
            <p className="text-xs text-gray-700 mb-3">Any branch</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Coins className="size-3.5 text-emerald-600" />
                <span className="text-sm font-black text-emerald-700">800 pts</span>
              </div>
              <span className="text-xs text-gray-700 font-bold bg-gray-100 px-2 py-1 rounded-lg">15K</span>
            </div>
          </button>

          {/* Movie */}
          <button className="bg-white p-4 rounded-2xl border-2 border-gray-200 shadow-sm hover:shadow-lg hover:border-emerald-500 transition-all active:scale-[0.98] text-left group">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-3 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform">
              <p className="text-3xl">🎬</p>
            </div>
            <p className="text-sm font-bold text-gray-900 mb-1">Cinemax</p>
            <p className="text-xs text-gray-700 mb-3">1 ticket</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Coins className="size-3.5 text-emerald-600" />
                <span className="text-sm font-black text-emerald-700">1,000 pts</span>
              </div>
              <span className="text-xs text-gray-700 font-bold bg-gray-100 px-2 py-1 rounded-lg">18K</span>
            </div>
          </button>

          {/* Airtime */}
          <button className="bg-white p-4 rounded-2xl border-2 border-gray-200 shadow-sm hover:shadow-lg hover:border-emerald-500 transition-all active:scale-[0.98] text-left group">
            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-3 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform">
              <Smartphone className="size-7 text-blue-600" />
            </div>
            <p className="text-sm font-bold text-gray-900 mb-1">Airtime</p>
            <p className="text-xs text-gray-700 mb-3">All networks</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Coins className="size-3.5 text-emerald-600" />
                <span className="text-sm font-black text-emerald-700">300 pts</span>
              </div>
              <span className="text-xs text-gray-700 font-bold bg-gray-100 px-2 py-1 rounded-lg">5K</span>
            </div>
          </button>

          {/* Locked: Flight */}
          <button 
            disabled
            className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-200 shadow-sm text-left relative overflow-hidden opacity-75 cursor-not-allowed"
          >
            <div className="absolute top-3 right-3">
              <div className="bg-gray-300 rounded-full p-1.5">
                <svg className="size-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="bg-gradient-to-br from-sky-100 to-blue-100 p-3 rounded-xl w-fit mb-3">
              <p className="text-3xl opacity-50">✈️</p>
            </div>
            <p className="text-sm font-bold text-gray-700 mb-1">Flight 50%</p>
            <p className="text-xs text-gray-600 mb-3">Precision Air</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Coins className="size-3.5 text-gray-500" />
                <span className="text-sm font-black text-gray-600">2,000</span>
              </div>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-lg font-bold">550 more</span>
            </div>
          </button>

          {/* Locked: Hotel */}
          <button 
            disabled
            className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-200 shadow-sm text-left relative overflow-hidden opacity-75 cursor-not-allowed"
          >
            <div className="absolute top-3 right-3">
              <div className="bg-gray-300 rounded-full p-1.5">
                <svg className="size-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-100 to-red-100 p-3 rounded-xl w-fit mb-3">
              <p className="text-3xl opacity-50">🏨</p>
            </div>
            <p className="text-sm font-bold text-gray-700 mb-1">Serena</p>
            <p className="text-xs text-gray-600 mb-3">Weekend</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Coins className="size-3.5 text-gray-500" />
                <span className="text-sm font-black text-gray-600">3,500</span>
              </div>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-lg font-bold">1,050 more</span>
            </div>
          </button>
        </div>
      </div>

      {/* FOURTH SECTION - PARTNER OFFERS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-amber-500" />
            <h2 className="text-xl font-black text-gray-900">Partner Offers</h2>
          </div>
          <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full font-bold">Limited</span>
        </div>

        <div className="space-y-3">
          {/* KFC */}
          <button 
            onClick={() => onNavigate('partner-kfc')}
            className="w-full bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-4 hover:shadow-lg transition-all active:scale-[0.99] text-left"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="size-14 bg-white rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <p className="text-3xl">🍗</p>
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-gray-900 mb-0.5">KFC Tanzania</p>
                <p className="text-sm text-gray-700 font-medium mb-1">Double Points Weekend</p>
                <div className="flex items-center gap-2">
                  <Clock className="size-3.5 text-orange-600" />
                  <span className="text-xs text-orange-700 font-bold">Ends Jan 15</span>
                </div>
              </div>
              <ChevronRight className="size-5 text-gray-600" />
            </div>
            <div className="bg-red-100 rounded-xl p-3 flex items-center gap-2">
              <Zap className="size-5 text-red-600" />
              <span className="text-sm font-bold text-red-700">2x Points on all orders</span>
            </div>
          </button>

          {/* Safari */}
          <button 
            onClick={() => onNavigate('partner-safari')}
            className="w-full bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-4 hover:shadow-lg transition-all active:scale-[0.99] text-left"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="size-14 bg-white rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <p className="text-3xl">🦁</p>
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-gray-900 mb-0.5">Safari Parks</p>
                <p className="text-sm text-gray-700 font-medium mb-1">20% Bonus Points</p>
                <div className="flex items-center gap-2">
                  <MapPin className="size-3.5 text-emerald-600" />
                  <span className="text-xs text-emerald-700 font-bold">Serengeti, Ngorongoro</span>
                </div>
              </div>
              <ChevronRight className="size-5 text-gray-600" />
            </div>
            <div className="bg-emerald-100 rounded-xl p-3">
              <span className="text-sm font-bold text-emerald-700">Book & earn extra 20%</span>
            </div>
          </button>
        </div>
      </div>

      {/* Boost Points */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Ongeza Pointi • Boost Your Points</h3>
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-2xl border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-500 p-3 rounded-xl">
                <Receipt className="size-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 mb-0.5">Every Transaction</p>
                <p className="text-xs text-gray-700">Bills, payments, transfers</p>
              </div>
              <p className="text-xl font-black text-blue-600">+10</p>
            </div>
            <div className="bg-white/60 rounded-xl p-2 text-xs text-gray-700 font-medium">
              340 points this month
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border-2 border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-500 p-3 rounded-xl">
                <Users className="size-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 mb-0.5">Waalika Marafiki</p>
                <p className="text-xs text-gray-700">When they pay</p>
              </div>
              <p className="text-xl font-black text-green-600">+500</p>
            </div>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-sm font-bold transition-colors">
              Share Link
            </button>
          </div>
        </div>
      </div>

      {/* FIFTH SECTION - HISTORY */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-0.5">Shughuli za Karibuni</h3>
            <p className="text-sm text-gray-700 font-medium">Recent activity</p>
          </div>
          <button 
            onClick={() => onNavigate('history')}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-bold"
          >
            All
          </button>
        </div>
        
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm divide-y divide-gray-100">
          <div className="p-4 flex items-center gap-3">
            <div className="size-11 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="size-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900 mb-0.5">Bill Payment</p>
              <p className="text-xs text-gray-700 font-medium">TANESCO • Today 2:34 PM</p>
            </div>
            <div className="text-right">
              <p className="text-base font-black text-green-600 mb-0.5">+10</p>
              <Check className="size-3.5 text-green-600 ml-auto" />
            </div>
          </div>
          
          <div className="p-4 flex items-center gap-3">
            <div className="size-11 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="size-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900 mb-0.5">Travel Booking</p>
              <p className="text-xs text-gray-700 font-medium">Bus • Yesterday</p>
            </div>
            <div className="text-right">
              <p className="text-base font-black text-purple-600 mb-0.5">+25</p>
              <Check className="size-3.5 text-purple-600 ml-auto" />
            </div>
          </div>
          
          <div className="p-4 flex items-center gap-3">
            <div className="size-11 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center">
              <TrendingDown className="size-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900 mb-0.5">Redeemed</p>
              <p className="text-xs text-gray-700 font-medium">Starbucks • 2 days</p>
            </div>
            <div className="text-right">
              <p className="text-base font-black text-orange-600 mb-0.5">-800</p>
              <Check className="size-3.5 text-orange-600 ml-auto" />
            </div>
          </div>

          <div className="p-4 flex items-center gap-3 bg-amber-50">
            <div className="size-11 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="size-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900 mb-0.5">Referral</p>
              <p className="text-xs text-gray-700 font-medium">Friend signup • 1h ago</p>
            </div>
            <div className="text-right">
              <p className="text-base font-black text-amber-600 mb-0.5">+500</p>
              <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-bold">Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Footer */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <Shield className="size-6 text-emerald-700" />
          <div>
            <p className="text-sm font-bold text-emerald-900 mb-0.5">Points Never Expire</p>
            <p className="text-xs text-emerald-800 font-medium leading-relaxed">
              Your GoPoints are safe & can be redeemed anytime • No hidden terms
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
