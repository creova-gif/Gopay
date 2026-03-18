/**
 * HOME DASHBOARD - WORLD-CLASS (DESIGN MATURITY)
 * 
 * JOURNEY QUESTION: "What matters right now?"
 * 
 * HIERARCHY (NON-NEGOTIABLE):
 * 1. Hero: Wallet balance (only gradient)
 * 2. Supporting: Quick actions (4 max)
 * 3. Quiet: Everything else (no competing voices)
 * 
 * PRINCIPLES APPLIED:
 * ✅ ONE hero per screen (wallet only)
 * ✅ Outcome language ("Tuma Pesa" not "Send Money Feature")
 * ✅ Trust is FELT (predictable, calm, no surprises)
 * ✅ Intelligence is HIDDEN (no AI labels)
 * ✅ Calm > Flashy
 * 
 * INSPIRED BY:
 * - Revolut: Ruthless visual hierarchy
 * - PayPal: Boring is good (in fintech)
 * - WeChat: Intelligence without labels
 * 
 * @version 5.0.0 (World-Class Maturity)
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Bell,
  Settings,
  Eye,
  EyeOff,
  ChevronRight,
  ArrowUpRight,
  ArrowDownLeft,
  Scan,
  Receipt
} from 'lucide-react';

interface HomeDashboardWorldClassProps {
  user: {
    name: string;
    email: string;
  };
  balance: number;
  recentActivity?: Array<{
    type: 'sent' | 'received';
    amount: number;
    name: string;
    time: string;
  }>;
  onNavigate: (page: string) => void;
  language?: 'sw' | 'en';
}

// ════════════════════════════════════════════════════════════
// OUTCOME-FOCUSED COPY (NOT FEATURE-FOCUSED)
// ════════════════════════════════════════════════════════════

const COPY = {
  greeting: {
    morning: { sw: 'Habari za leo', en: 'Hello' },
    afternoon: { sw: 'Habari za leo', en: 'Hello' },
    evening: { sw: 'Habari za leo', en: 'Hello' }
  },
  
  // HERO (Wallet)
  balance: { sw: 'Salio Kuu', en: 'Main Balance' },
  updated: { sw: 'Imesasishwa sasa hivi', en: 'Updated just now' },
  
  // SUPPORTING (Quick Actions - Outcome Language)
  actions: {
    send: { sw: 'Tuma Pesa', en: 'Send Money' },
    receive: { sw: 'Pokea Pesa', en: 'Receive Money' },
    scan: { sw: 'Skani QR', en: 'Scan QR' },
    bills: { sw: 'Lipa Bili', en: 'Pay Bills' }
  },
  
  // QUIET (Recent Activity - Optional)
  recent: {
    title: { sw: 'Hivi Karibuni', en: 'Recent' },
    sent: { sw: 'Ulituma', en: 'You sent' },
    received: { sw: 'Ulipokea', en: 'You received' },
    viewAll: { sw: 'Angalia Zote', en: 'View All' }
  }
};

// ════════════════════════════════════════════════════════════
// MOTION (CALM, NOT FLASHY)
// ════════════════════════════════════════════════════════════

const MOTION = {
  // No bounce, no gimmicks, ease-out only
  fadeIn: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } // ease-out
  }
};

// ════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════

export function HomeDashboardWorldClass({
  user,
  balance,
  recentActivity = [],
  onNavigate,
  language = 'sw'
}: HomeDashboardWorldClassProps) {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [currentTime] = useState(new Date());
  
  const getText = (obj: { sw: string; en: string }) => obj[language];
  
  // Get greeting (simple, no over-engineering)
  const getGreeting = () => {
    const hour = currentTime.getHours();
    return getText(COPY.greeting.morning); // Always "Habari za leo"
  };
  
  const formatCurrency = (amount: number) => {
    return `TSh ${amount.toLocaleString('en-TZ')}`;
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* ════════════════════════════════════════════════════════════
          HEADER (Minimal, no competing elements)
      ════════════════════════════════════════════════════════════ */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Greeting (quiet) */}
          <div>
            <p className="text-sm text-gray-600">
              {getGreeting()}, {user.name.split(' ')[0]}
            </p>
          </div>
          
          {/* Actions (minimal) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('notifications')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
      
      {/* ════════════════════════════════════════════════════════════
          HERO: WALLET BALANCE (ONLY GRADIENT)
      ════════════════════════════════════════════════════════════ */}
      <div className="px-6 py-6">
        <motion.div
          {...MOTION.fadeIn}
          className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-6 text-white shadow-xl"
        >
          {/* Balance Label */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400 font-medium">
              {getText(COPY.balance)}
            </p>
            <button
              onClick={() => setBalanceVisible(!balanceVisible)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {balanceVisible ? (
                <Eye className="w-4 h-4 text-gray-400" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
          
          {/* Balance Amount (Hero) */}
          <div className="mb-6">
            <p className="text-5xl font-black tracking-tight mb-2">
              {balanceVisible ? formatCurrency(balance) : '••••••'}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span>{getText(COPY.updated)}</span>
            </div>
          </div>
          
          {/* Quick Actions (Supporting - Inside hero card) */}
          <div className="grid grid-cols-4 gap-3">
            <QuickAction
              icon={ArrowUpRight}
              label={getText(COPY.actions.send)}
              onClick={() => onNavigate('sendmoney')}
            />
            <QuickAction
              icon={ArrowDownLeft}
              label={getText(COPY.actions.receive)}
              onClick={() => onNavigate('requestmoney')}
            />
            <QuickAction
              icon={Scan}
              label={getText(COPY.actions.scan)}
              onClick={() => onNavigate('qr')}
            />
            <QuickAction
              icon={Receipt}
              label={getText(COPY.actions.bills)}
              onClick={() => onNavigate('billpayments')}
            />
          </div>
        </motion.div>
      </div>
      
      {/* ════════════════════════════════════════════════════════════
          QUIET: RECENT ACTIVITY (Optional, minimal)
      ════════════════════════════════════════════════════════════ */}
      {recentActivity.length > 0 && (
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-900">
              {getText(COPY.recent.title)}
            </h3>
            <button
              onClick={() => onNavigate('transactions')}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {getText(COPY.recent.viewAll)}
            </button>
          </div>
          
          <div className="space-y-2">
            {recentActivity.slice(0, 3).map((activity, index) => (
              <ActivityItem
                key={index}
                activity={activity}
                language={language}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Spacer for bottom nav */}
      <div className="h-24" />
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// QUICK ACTION (Minimal, no decoration)
// ════════════════════════════════════════════════════════════

interface QuickActionProps {
  icon: any;
  label: string;
  onClick: () => void;
}

function QuickAction({ icon: Icon, label, onClick }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-3 hover:bg-white/5 rounded-2xl transition-colors active:scale-95"
    >
      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <span className="text-xs text-white/80 text-center leading-tight font-medium">
        {label}
      </span>
    </button>
  );
}

// ════════════════════════════════════════════════════════════
// ACTIVITY ITEM (Quiet, minimal)
// ════════════════════════════════════════════════════════════

interface ActivityItemProps {
  activity: {
    type: 'sent' | 'received';
    amount: number;
    name: string;
    time: string;
  };
  language: 'sw' | 'en';
}

function ActivityItem({ activity, language }: ActivityItemProps) {
  const getText = (obj: { sw: string; en: string }) => obj[language];
  
  const isSent = activity.type === 'sent';
  const label = isSent ? getText(COPY.recent.sent) : getText(COPY.recent.received);
  
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`
          w-10 h-10 rounded-xl flex items-center justify-center
          ${isSent ? 'bg-gray-100' : 'bg-emerald-50'}
        `}>
          {isSent ? (
            <ArrowUpRight className="w-5 h-5 text-gray-600" />
          ) : (
            <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
          )}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">{activity.name}</p>
          <p className="text-xs text-gray-500">{activity.time}</p>
        </div>
      </div>
      
      <p className={`text-sm font-black ${isSent ? 'text-gray-900' : 'text-emerald-600'}`}>
        {isSent ? '-' : '+'} TSh {activity.amount.toLocaleString()}
      </p>
    </div>
  );
}

/**
 * ════════════════════════════════════════════════════════════
 * CHANGES FROM PREVIOUS VERSION:
 * ════════════════════════════════════════════════════════════
 * 
 * ❌ REMOVED:
 * - Multiple gradients (Quick Pay, Promos, etc.)
 * - Feature language ("Quick Pay Feature")
 * - Visual noise (carousel, mobile money section)
 * - Competing hero elements
 * - Time-of-day logic (over-engineering)
 * 
 * ✅ IMPROVED:
 * - ONE gradient hero (wallet only, dark not colorful)
 * - Outcome language ("Tuma Pesa" not "Send Money")
 * - Ruthless hierarchy (Hero → Supporting → Quiet)
 * - Calm motion (no bounce, ease-out only)
 * - Trust through predictability (no surprises)
 * - Dark hero gradient (more premium than bright green)
 * 
 * PRINCIPLE:
 * "Boring is good in fintech. Trust comes from predictability,
 * not excitement. The user should feel: This is serious money."
 * 
 * HIERARCHY:
 * 1. Hero: Balance (dark gradient, largest)
 * 2. Supporting: 4 actions (inside hero)
 * 3. Quiet: Recent activity (optional, minimal)
 * 
 * QUESTION ANSWERED:
 * "What matters right now?" → Your balance + quick actions
 */
