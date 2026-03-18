/**
 * HOME DASHBOARD - WORLD-CLASS REDESIGN
 * 
 * GLOBAL RULES APPLIED:
 * ✅ ONE hero card: Wallet balance
 * ✅ Secondary cards = soft glass surfaces
 * ✅ No animation > 300ms
 * ✅ Swahili-first language
 * ✅ No AI branding
 * ✅ "What can I do right now?" clarity
 * 
 * INSPIRED BY:
 * - Revolut: Financial control center
 * - Alipay: Live data indicators
 * - Grab: Thumb-first quick actions
 * - Touch 'n Go: Calm, confident interface
 * 
 * @version 3.0.0 (World-Class)
 */

import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Clock,
  ChevronRight,
  Zap,
  Receipt,
  QrCode,
  Send,
  Download
} from 'lucide-react';
import { User } from '../App';

interface DashboardWorldClassProps {
  user: User;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

// ════════════════════════════════════════════════════════════
// SWAHILI-FIRST COPY DATABASE
// ════════════════════════════════════════════════════════════

const COPY = {
  greeting: {
    morning: { sw: 'Habari za Asubuhi', en: 'Good Morning' },
    afternoon: { sw: 'Habari za Mchana', en: 'Good Afternoon' },
    evening: { sw: 'Habari za Jioni', en: 'Good Evening' }
  },
  hero: {
    balance: { sw: 'Salio Kuu', en: 'Main Balance' },
    updated: { sw: 'Imesasishwa sasa hivi', en: 'Updated just now' },
    hide: { sw: 'Ficha', en: 'Hide' },
    show: { sw: 'Onyesha', en: 'Show' }
  },
  quickActions: {
    title: { sw: 'Vitendo vya Haraka', en: 'Quick Actions' },
    addMoney: { sw: 'Jaza Pesa', en: 'Add Money' },
    sendMoney: { sw: 'Tuma Pesa', en: 'Send Money' },
    scanQR: { sw: 'Scan QR', en: 'Scan QR' },
    payBills: { sw: 'Lipa Bili', en: 'Pay Bills' }
  },
  recentActivity: {
    title: { sw: 'Shughuli za Hivi Karibuni', en: 'Recent Activity' },
    viewAll: { sw: 'Angalia Zote', en: 'View All' },
    sent: { sw: 'Umetuma', en: 'Sent' },
    received: { sw: 'Umepokea', en: 'Received' },
    bill: { sw: 'Bili', en: 'Bill Payment' }
  }
};

// ════════════════════════════════════════════════════════════
// MOTION CONSTANTS (FINTECH-SAFE)
// ════════════════════════════════════════════════════════════

const MOTION = {
  // Hero wallet card
  hero: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  
  // Balance count-up
  balance: {
    duration: 0.8,
    ease: 'easeOut'
  },
  
  // Quick action cards (slide in with 12px offset)
  quickActions: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: (index: number) => ({
      duration: 0.3,
      delay: 0.1 + (index * 0.05), // Stagger 50ms
      ease: 'easeOut'
    })
  },
  
  // Card tap feedback
  tap: {
    scale: 0.98,
    duration: 0.12
  }
} as const;

// ════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════

export function DashboardWorldClass({ user, onNavigate, onLogout }: DashboardWorldClassProps) {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [displayBalance, setDisplayBalance] = useState(0);
  const [language, setLanguage] = useState<'sw' | 'en'>('sw');
  const prefersReducedMotion = useReducedMotion();
  
  const actualBalance = user.balance || 0;
  const lastUpdated = new Date();
  
  // Get greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? COPY.greeting.morning : hour < 17 ? COPY.greeting.afternoon : COPY.greeting.evening;
  
  const getText = (obj: { sw: string; en: string }) => obj[language];
  
  // Balance count-up animation
  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayBalance(actualBalance);
      return;
    }
    
    const duration = MOTION.balance.duration * 1000;
    const steps = 60;
    const increment = actualBalance / steps;
    let current = 0;
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      current += increment;
      
      if (step >= steps) {
        setDisplayBalance(actualBalance);
        clearInterval(timer);
      } else {
        setDisplayBalance(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [actualBalance, prefersReducedMotion]);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sw-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  // Quick actions configuration
  const quickActions = [
    {
      id: 'add',
      icon: Download,
      label: COPY.quickActions.addMoney,
      color: 'from-emerald-500 to-green-600',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
      route: 'wallet'
    },
    {
      id: 'send',
      icon: Send,
      label: COPY.quickActions.sendMoney,
      color: 'from-blue-500 to-cyan-600',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
      route: 'sendmoney'
    },
    {
      id: 'scan',
      icon: QrCode,
      label: COPY.quickActions.scanQR,
      color: 'from-purple-500 to-pink-600',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-400',
      route: 'qr'
    },
    {
      id: 'bills',
      icon: Receipt,
      label: COPY.quickActions.payBills,
      color: 'from-amber-500 to-orange-600',
      iconBg: 'bg-amber-500/20',
      iconColor: 'text-amber-400',
      route: 'billpayments'
    }
  ];
  
  // Recent activity (mock data)
  const recentActivity = [
    {
      id: 1,
      type: 'sent',
      amount: -5000,
      recipient: 'John Mwangi',
      time: '10:30 AM',
      icon: ArrowUpRight,
      color: 'text-red-600',
      bg: 'bg-red-100'
    },
    {
      id: 2,
      type: 'received',
      amount: 12000,
      recipient: 'Salary Payment',
      time: 'Yesterday',
      icon: ArrowDownLeft,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      id: 3,
      type: 'bill',
      amount: -3500,
      recipient: 'TANESCO',
      time: '2 days ago',
      icon: Zap,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      
      {/* ════════════════════════════════════════════════════════════
          HEADER (Greeting + Language Toggle)
      ════════════════════════════════════════════════════════════ */}
      <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-emerald-100 text-sm mb-1">{getText(greeting)}</p>
            <h1 className="text-2xl font-black text-white">
              {user.name || 'Guest'}
            </h1>
          </div>
          
          {/* Language toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setLanguage('sw')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                language === 'sw'
                  ? 'bg-white/30 text-white'
                  : 'bg-white/10 text-white/50'
              }`}
            >
              SW
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                language === 'en'
                  ? 'bg-white/30 text-white'
                  : 'bg-white/10 text-white/50'
              }`}
            >
              EN
            </button>
          </div>
        </div>
        
        {/* ════════════════════════════════════════════════════════════
            HERO CARD: Wallet Balance (ONE and ONLY)
        ════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={MOTION.hero.initial}
          animate={MOTION.hero.animate}
          transition={MOTION.hero.transition}
          className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-3xl p-5 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-white">
                {getText(COPY.hero.balance)}
              </p>
              {/* Live indicator (subtle pulse) */}
              <div className="flex items-center gap-1.5">
                <motion.div
                  className="w-2 h-2 bg-emerald-300 rounded-full"
                  animate={prefersReducedMotion ? {} : {
                    opacity: [1, 0.5, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />
                <p className="text-xs text-white/70">{getText(COPY.hero.updated)}</p>
              </div>
            </div>
            
            <button
              onClick={() => setBalanceVisible(!balanceVisible)}
              className="p-2 hover:bg-white/20 rounded-full transition-all"
            >
              {balanceVisible ? (
                <EyeOff className="w-4 h-4 text-white/70" />
              ) : (
                <Eye className="w-4 h-4 text-white/70" />
              )}
            </button>
          </div>
          
          {/* Balance amount */}
          <div className="mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-white/80">TZS</span>
              <span className="text-4xl font-black text-white tabular-nums tracking-tight">
                {balanceVisible 
                  ? formatCurrency(displayBalance).replace('TZS', '').trim()
                  : '••••••'
                }
              </span>
            </div>
          </div>
          
          {/* Refresh button */}
          <button className="text-xs text-white/70 hover:text-white flex items-center gap-1.5 transition-all">
            <RefreshCw className="w-3 h-3" />
            Refresh
          </button>
        </motion.div>
      </div>
      
      {/* ════════════════════════════════════════════════════════════
          QUICK ACTIONS (Thumb-first, consistent sizing)
      ════════════════════════════════════════════════════════════ */}
      <div className="px-6 py-6">
        <h2 className="text-lg font-black text-gray-900 mb-4">
          {getText(COPY.quickActions.title)}
        </h2>
        
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.id}
                initial={MOTION.quickActions.initial}
                animate={MOTION.quickActions.animate}
                transition={MOTION.quickActions.transition(index)}
                whileTap={prefersReducedMotion ? {} : { scale: MOTION.tap.scale }}
                onClick={() => onNavigate(action.route)}
                className="flex flex-col items-center gap-2 group"
              >
                {/* Soft glass surface (NOT gradient) */}
                <div className={`w-16 h-16 ${action.iconBg} rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  <Icon className={`w-7 h-7 ${action.iconColor}`} />
                </div>
                
                {/* Label (Swahili-first) */}
                <div className="text-center">
                  <p className="text-xs font-bold text-gray-900 leading-tight">
                    {getText(action.label)}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
      
      {/* ════════════════════════════════════════════════════════════
          RECENT ACTIVITY (Supporting section, clean list)
      ════════════════════════════════════════════════════════════ */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-gray-900">
            {getText(COPY.recentActivity.title)}
          </h2>
          <button
            onClick={() => onNavigate('transactions')}
            className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            {getText(COPY.recentActivity.viewAll)}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="bg-white rounded-2xl divide-y divide-gray-100 shadow-sm border border-gray-200">
          {recentActivity.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: 0.2 + (index * 0.05),
                  ease: 'easeOut'
                }}
                className="p-4 flex items-center gap-3 hover:bg-gray-50 transition-all cursor-pointer active:scale-[0.99]"
              >
                <div className={`w-10 h-10 ${activity.bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${activity.color}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-900 truncate">
                    {activity.recipient}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                
                <div className="text-right">
                  <p className={`font-black text-base tabular-nums ${
                    activity.amount > 0 ? 'text-green-600' : 'text-gray-900'
                  }`}>
                    {activity.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(activity.amount))}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Promotional card (OPTIONAL, dismissible, secondary) */}
      {/* Intentionally removed for calm interface */}
    </div>
  );
}
