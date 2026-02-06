/**
 * OPTIMIZED HOME SCREEN - SUPER APP DASHBOARD
 * 
 * Patterns from:
 * - GrabPay: Smart suggestions, unified wallet
 * - Alipay: Card-based layout, contextual services
 * - Touch 'n Go: Quick actions, balance prominence
 * - M-Pesa: Balance card, transaction shortcuts
 * 
 * Design Principles:
 * - One-hand use
 * - No clutter
 * - Speed over features
 * - Trust signals everywhere
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Eye,
  EyeOff,
  Send,
  Download,
  QrCode,
  Receipt,
  Plane,
  Bus,
  Building2,
  Landmark,
  ShoppingBag,
  Zap,
  Gift,
  Bell,
  ChevronRight,
  TrendingUp,
  Clock,
  Star,
  Shield,
  MapPin,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from 'lucide-react';
import { FinButton, FinCard } from './design-system/DesignSystem';

interface HomeScreenOptimizedProps {
  user: {
    name: string;
    phone: string;
    kycStatus: 'pending' | 'verified' | 'none';
    membershipTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  };
  onNavigate: (screen: string) => void;
}

export function HomeScreenOptimized({ user, onNavigate }: HomeScreenOptimizedProps) {
  const [balance, setBalance] = useState(450000);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState(3);
  
  // Format currency (Tanzanian style)
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('sw-TZ').format(amount);
  };
  
  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { sw: 'Habari ya Asubuhi', en: 'Good Morning' };
    if (hour < 17) return { sw: 'Habari ya Mchana', en: 'Good Afternoon' };
    return { sw: 'Habari ya Jioni', en: 'Good Evening' };
  };
  
  const greeting = getGreeting();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ═══════════════════════════════════════════════════════════
          HEADER WITH BALANCE CARD (M-Pesa/GrabPay Pattern)
      ═══════════════════════════════════════════════════════════ */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 relative overflow-hidden">
        {/* Animated Background Orbs */}
        <motion.div
          className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-400/10 rounded-full blur-2xl"
          animate={{ scale: [1.1, 0.9, 1.1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        
        <div className="relative z-10 px-5 pt-12 pb-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="size-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center border-2 border-white/30 shadow-lg">
                <span className="text-xl font-black text-white">
                  {user.name.charAt(0)}
                </span>
              </div>
              
              {/* Greeting */}
              <div>
                <p className="text-sm text-white font-medium">
                  {greeting.sw}
                </p>
                <p className="text-lg font-bold text-white">
                  {user.name.split(' ')[0]}
                </p>
              </div>
            </div>
            
            {/* Notifications */}
            <button
              onClick={() => onNavigate('notifications')}
              className="relative size-11 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 active:scale-95 transition-all"
            >
              <Bell className="size-5 text-white" />
              {notifications > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 size-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center"
                >
                  <span className="text-[10px] font-bold text-white">
                    {notifications}
                  </span>
                </motion.div>
              )}
            </button>
          </div>
          
          {/* Balance Card (Touch 'n Go Pattern) */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-3xl p-5 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Wallet className="size-5 text-white" />
                <span className="text-sm font-semibold text-white">
                  Kiasi cha Pochi • Wallet Balance
                </span>
              </div>
              
              <button
                onClick={() => setBalanceVisible(!balanceVisible)}
                className="size-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 active:scale-95 transition-all"
              >
                {balanceVisible ? (
                  <Eye className="size-4 text-white" />
                ) : (
                  <EyeOff className="size-4 text-white" />
                )}
              </button>
            </div>
            
            {/* Balance Amount */}
            <div className="mb-4">
              {balanceVisible ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-white/80">TZS</span>
                  <motion.span
                    key={balance}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="text-4xl font-black text-white tabular-nums tracking-tight"
                  >
                    {formatAmount(balance)}
                  </motion.span>
                </div>
              ) : (
                <div className="text-4xl font-black text-white">
                  ••••••
                </div>
              )}
            </div>
            
            {/* Quick Actions Row (M-Pesa Pattern) */}
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => onNavigate('top-up')}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 active:scale-95 rounded-2xl p-3 border border-white/30 transition-all group"
              >
                <div className="flex flex-col items-center gap-1.5">
                  <div className="size-10 bg-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus className="size-5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-white">
                    Jaza
                  </span>
                </div>
              </button>
              
              <button
                onClick={() => onNavigate('send')}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 active:scale-95 rounded-2xl p-3 border border-white/30 transition-all group"
              >
                <div className="flex flex-col items-center gap-1.5">
                  <div className="size-10 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Send className="size-5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-white">
                    Tuma
                  </span>
                </div>
              </button>
              
              <button
                onClick={() => onNavigate('request')}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 active:scale-95 rounded-2xl p-3 border border-white/30 transition-all group"
              >
                <div className="flex flex-col items-center gap-1.5">
                  <div className="size-10 bg-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Download className="size-5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-white">
                    Omba
                  </span>
                </div>
              </button>
              
              <button
                onClick={() => onNavigate('qr')}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 active:scale-95 rounded-2xl p-3 border border-white/30 transition-all group"
              >
                <div className="flex flex-col items-center gap-1.5">
                  <div className="size-10 bg-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <QrCode className="size-5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-white">
                    QR
                  </span>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* ═══════════════════════════════════════════════════════════
          MAIN CONTENT AREA
      ═══════════════════════════════════════════════════════════ */}
      <div className="px-5 pb-24 -mt-4">
        {/* KYC Status Banner (Revolut Pattern) */}
        {user.kycStatus !== 'verified' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <button
              onClick={() => onNavigate('kyc')}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-4 flex items-center gap-3 shadow-lg hover:shadow-xl active:scale-[0.99] transition-all"
            >
              <div className="size-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="size-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-white font-bold text-sm">
                  Thibitisha Akaunti Yako
                </p>
                <p className="text-orange-100 text-xs">
                  Complete verification to unlock all features
                </p>
              </div>
              <ChevronRight className="size-5 text-white flex-shrink-0" />
            </button>
          </motion.div>
        )}
        
        {/* AI-Powered Suggestions (GrabPay/Alipay Pattern) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="size-5 text-emerald-600" />
              <h2 className="text-lg font-black text-gray-900">
                Mapendekezo Kwa Ajili Yako
              </h2>
            </div>
            <span className="text-xs text-gray-600 font-medium">
              AI-powered
            </span>
          </div>
          
          <div className="space-y-3">
            {/* Suggestion: Book Travel */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => onNavigate('travel')}
              className="w-full bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-4 shadow-lg hover:shadow-xl active:scale-[0.99] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="size-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plane className="size-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-bold text-base mb-0.5">
                    Safari ya Dodoma
                  </p>
                  <p className="text-cyan-100 text-sm">
                    SGR train tickets starting at TZS 15,000
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="size-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-white/80">
                      Popular this week
                    </span>
                  </div>
                </div>
                <ChevronRight className="size-5 text-white/80 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
            
            {/* Suggestion: Pay Bills */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              onClick={() => onNavigate('billpayments')}
              className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 hover:border-emerald-500 hover:shadow-lg active:scale-[0.99] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="size-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Receipt className="size-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-gray-900 font-bold text-base mb-0.5">
                    Lipa TANESCO
                  </p>
                  <p className="text-gray-600 text-sm">
                    Your electricity bill is due in 3 days
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="size-3 text-amber-600" />
                    <span className="text-xs text-amber-700 font-semibold">
                      Due soon
                    </span>
                  </div>
                </div>
                <ChevronRight className="size-5 text-gray-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          </div>
        </div>
        
        {/* Travel Booking Shortcuts (Grab Pattern) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-black text-gray-900">
              Safari • Travel
            </h2>
            <button
              onClick={() => onNavigate('travel')}
              className="text-sm text-emerald-600 font-bold hover:text-emerald-700"
            >
              Angalia Zote
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Flights */}
            <button
              onClick={() => onNavigate('flights')}
              className="bg-white border-2 border-gray-200 rounded-2xl p-4 hover:border-emerald-500 hover:shadow-lg active:scale-[0.99] transition-all group"
            >
              <div className="size-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform mx-auto">
                <Plane className="size-6 text-white" />
              </div>
              <p className="text-center font-bold text-gray-900 mb-1">
                Ndege
              </p>
              <p className="text-xs text-gray-600 text-center">
                Flights
              </p>
            </button>
            
            {/* Buses */}
            <button
              onClick={() => onNavigate('buses')}
              className="bg-white border-2 border-gray-200 rounded-2xl p-4 hover:border-emerald-500 hover:shadow-lg active:scale-[0.99] transition-all group"
            >
              <div className="size-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform mx-auto">
                <Bus className="size-6 text-white" />
              </div>
              <p className="text-center font-bold text-gray-900 mb-1">
                Mabasi
              </p>
              <p className="text-xs text-gray-600 text-center">
                Buses
              </p>
            </button>
            
            {/* Hotels */}
            <button
              onClick={() => onNavigate('hotels')}
              className="bg-white border-2 border-gray-200 rounded-2xl p-4 hover:border-emerald-500 hover:shadow-lg active:scale-[0.99] transition-all group"
            >
              <div className="size-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform mx-auto">
                <Building2 className="size-6 text-white" />
              </div>
              <p className="text-center font-bold text-gray-900 mb-1">
                Hoteli
              </p>
              <p className="text-xs text-gray-600 text-center">
                Hotels
              </p>
            </button>
            
            {/* National Parks */}
            <button
              onClick={() => onNavigate('parks')}
              className="bg-white border-2 border-gray-200 rounded-2xl p-4 hover:border-emerald-500 hover:shadow-lg active:scale-[0.99] transition-all group"
            >
              <div className="size-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform mx-auto">
                <MapPin className="size-6 text-white" />
              </div>
              <p className="text-center font-bold text-gray-900 mb-1">
                Hifadhi
              </p>
              <p className="text-xs text-gray-600 text-center">
                Parks
              </p>
            </button>
          </div>
        </div>
        
        {/* Recent Transactions (M-Pesa Pattern) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-black text-gray-900">
              Shughuli za Hivi Karibuni
            </h2>
            <button
              onClick={() => onNavigate('history')}
              className="text-sm text-emerald-600 font-bold hover:text-emerald-700"
            >
              Angalia Zote
            </button>
          </div>
          
          <div className="bg-white rounded-2xl border-2 border-gray-200 divide-y divide-gray-100">
            {/* Transaction 1 */}
            <div className="p-4 flex items-center gap-3">
              <div className="size-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <ArrowDownRight className="size-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 truncate">
                  Pesa kutoka John Mwangi
                </p>
                <p className="text-xs text-gray-600">
                  Leo, 2:34 PM
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-black text-green-600 tabular-nums">
                  +{formatAmount(50000)}
                </p>
                <p className="text-xs text-gray-600">TZS</p>
              </div>
            </div>
            
            {/* Transaction 2 */}
            <div className="p-4 flex items-center gap-3">
              <div className="size-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <ArrowUpRight className="size-5 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 truncate">
                  TANESCO Bill Payment
                </p>
                <p className="text-xs text-gray-600">
                  Jana, 4:15 PM
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-black text-red-600 tabular-nums">
                  -{formatAmount(85000)}
                </p>
                <p className="text-xs text-gray-600">TZS</p>
              </div>
            </div>
            
            {/* Transaction 3 */}
            <div className="p-4 flex items-center gap-3">
              <div className="size-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <CreditCard className="size-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 truncate">
                  Jaza Wallet
                </p>
                <p className="text-xs text-gray-600">
                  2 days ago
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-black text-blue-600 tabular-nums">
                  +{formatAmount(100000)}
                </p>
                <p className="text-xs text-gray-600">TZS</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Rewards Preview (GrabRewards Pattern) */}
        <div className="mb-6">
          <button
            onClick={() => onNavigate('rewards')}
            className="w-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-2xl p-5 shadow-lg hover:shadow-xl active:scale-[0.99] transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="size-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Gift className="size-7 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-white font-black text-lg mb-1">
                  2,450 Pointi
                </p>
                <p className="text-purple-100 text-sm">
                  Redeem rewards & exclusive offers
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-2 flex-1 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full" />
                  </div>
                  <span className="text-xs text-white font-bold">
                    Gold Tier
                  </span>
                </div>
              </div>
              <ChevronRight className="size-6 text-white/80 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
        
        {/* Trust Signal (PayPal Pattern) */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <Shield className="size-6 text-emerald-700 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-emerald-900 font-bold text-sm mb-0.5">
                Salama & Imeajiriwa
              </p>
              <p className="text-emerald-700 text-xs">
                Licensed by Bank of Tanzania • All transactions encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}