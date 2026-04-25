import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp, Users, DollarSign, Zap, ChevronRight,
  Activity, Globe, Shield, Award, X, Play
} from 'lucide-react';

interface InvestorDemoModeProps {
  onEnterApp: () => void;
}

const METRICS = [
  { label: 'Monthly Active Users', value: '127,400', change: '+34%', icon: Users, color: '#4ade80' },
  { label: 'Monthly GMV', value: '$2.1M', change: '+67%', icon: DollarSign, color: '#60a5fa' },
  { label: 'Transactions / Day', value: '48,200', change: '+41%', icon: Activity, color: '#a78bfa' },
  { label: 'Avg. Revenue / User', value: '$4.80', change: '+22%', icon: TrendingUp, color: '#fb923c' },
];

const MILESTONES = [
  { q: 'Q3 2024', label: 'Launch', desc: 'Dar es Salaam beta — 5K users' },
  { q: 'Q4 2024', label: 'Mobile Money', desc: 'M-Pesa, Tigo, Airtel live' },
  { q: 'Q1 2025', label: 'Growth', desc: '100K users · $1M GMV/mo' },
  { q: 'Q2 2025', label: 'Scale', desc: 'National · Merchant QR' },
  { q: 'Q3 2025', label: 'Super App', desc: 'Rides, Food, Travel' },
  { q: 'Q4 2025', label: 'Series A', label2: '🎯', desc: '$10M · East Africa expansion' },
];

const INVESTORS = [
  { name: 'Afrofication Fund', type: 'Lead VC', check: '$3M' },
  { name: 'TZ Innovation Hub', type: 'Strategic', check: '$1M' },
  { name: 'M-Pesa Ventures', type: 'Strategic', check: '$500K' },
];

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export function InvestorDemoMode({ onEnterApp }: InvestorDemoModeProps) {
  const [liveGMV, setLiveGMV] = useState(2_142_800);
  const [liveTx, setLiveTx] = useState(48_213);
  const [showTicker, setShowTicker] = useState(true);

  // Live ticker simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveGMV(v => v + Math.floor(Math.random() * 800 + 200));
      setLiveTx(v => v + Math.floor(Math.random() * 3 + 1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen overflow-y-auto" style={{ background: '#050a05' }}>
      {/* Live ticker */}
      <AnimatePresence>
        {showTicker && (
          <motion.div
            initial={{ y: -40 }}
            animate={{ y: 0 }}
            exit={{ y: -40 }}
            className="fixed top-0 left-0 right-0 z-50 px-4 py-2 flex items-center justify-between"
            style={{ background: 'rgba(22,163,74,0.95)', backdropFilter: 'blur(8px)' }}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#fff' }} />
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#fff', letterSpacing: '1px' }}>LIVE</span>
              </div>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
                GMV: {formatCurrency(liveGMV)} · Transactions: {liveTx.toLocaleString()}/day
              </span>
            </div>
            <button onClick={() => setShowTicker(false)}>
              <X className="size-4 text-white opacity-70" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`px-5 pb-10 ${showTicker ? 'pt-14' : 'pt-8'}`}>
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ background: 'rgba(22,163,74,0.12)', border: '1px solid rgba(22,163,74,0.25)' }}>
            <Globe className="size-4" style={{ color: '#4ade80' }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#4ade80', letterSpacing: '1px' }}>
              EAST AFRICA'S SUPER WALLET
            </span>
          </div>
          <h1 style={{
            fontSize: 'clamp(36px, 8vw, 56px)',
            fontWeight: 900,
            color: '#fff',
            lineHeight: 1.05,
            letterSpacing: '-2px',
            marginBottom: '16px',
          }}>
            goPay
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)', maxWidth: '320px', margin: '0 auto 32px', lineHeight: '1.6' }}>
            The financial OS for 60M+ unbanked East Africans
          </p>

          <button onClick={onEnterApp}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl transition-all active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 700,
              boxShadow: '0 8px 30px rgba(22,163,74,0.4)',
            }}>
            <Play className="size-5" />
            Live Demo
          </button>
        </motion.div>

        {/* Key metrics */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', marginBottom: '12px' }}>
            KEY METRICS — MONTH TO DATE
          </p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {METRICS.map((m, i) => {
              const Icon = m.icon;
              return (
                <motion.div key={m.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className="rounded-2xl p-4"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="size-5" style={{ color: m.color }} />
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80' }}>
                      {m.change}
                    </span>
                  </div>
                  <p style={{ fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: '2px' }}>
                    {m.label === 'Monthly GMV' ? formatCurrency(liveGMV) :
                     m.label === 'Transactions / Day' ? liveTx.toLocaleString() :
                     m.value}
                  </p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{m.label}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Traction bar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="rounded-2xl p-5 mb-6"
          style={{ background: 'linear-gradient(135deg, rgba(22,163,74,0.1) 0%, rgba(22,163,74,0.03) 100%)', border: '1px solid rgba(22,163,74,0.2)' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: '16px', letterSpacing: '0.5px' }}>
            PRODUCT TRACTION
          </p>
          {[
            { label: 'User Retention (30d)', value: 71, suffix: '%' },
            { label: 'Daily Transaction Rate', value: 84, suffix: '%' },
            { label: 'NPS Score', value: 76, suffix: '' },
            { label: 'KYC Completion', value: 68, suffix: '%' },
          ].map(item => (
            <div key={item.label} className="mb-3">
              <div className="flex justify-between mb-1">
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{item.label}</span>
                <span style={{ fontSize: '12px', color: '#4ade80', fontWeight: 700 }}>{item.value}{item.suffix}</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
                  style={{ background: 'linear-gradient(90deg, #16a34a, #4ade80)' }}
                />
              </div>
            </div>
          ))}
        </motion.div>

        {/* Roadmap */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mb-6">
          <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', marginBottom: '12px' }}>
            ROADMAP TO SERIES A
          </p>
          <div className="space-y-2">
            {MILESTONES.map((m, i) => (
              <div key={m.q} className="flex items-center gap-3 py-3 px-4 rounded-xl"
                style={{
                  background: i < 3 ? 'rgba(22,163,74,0.06)' : 'rgba(255,255,255,0.02)',
                  border: i === MILESTONES.length - 1 ? '1px solid rgba(22,163,74,0.3)' : '1px solid transparent',
                }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                  style={{
                    background: i < 3 ? 'rgba(22,163,74,0.2)' : 'rgba(255,255,255,0.06)',
                    color: i < 3 ? '#4ade80' : 'rgba(255,255,255,0.3)',
                  }}>
                  {i < 3 ? '✓' : (i + 1)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p style={{ fontSize: '13px', fontWeight: 600, color: i < 3 ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                      {m.label}
                    </p>
                    {i === MILESTONES.length - 1 && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                        style={{ background: 'rgba(22,163,74,0.2)', color: '#4ade80' }}>TARGET</span>
                    )}
                  </div>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{m.q} · {m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Use of funds */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="rounded-2xl p-5 mb-6"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: '16px', letterSpacing: '0.5px' }}>
            RAISING $5M SERIES A — USE OF FUNDS
          </p>
          {[
            { label: 'Regulatory & Compliance', pct: 30, amount: '$1.5M', color: '#4ade80' },
            { label: 'Engineering & Product', pct: 40, amount: '$2.0M', color: '#60a5fa' },
            { label: 'Growth & Marketing', pct: 20, amount: '$1.0M', color: '#a78bfa' },
            { label: 'Operations', pct: 10, amount: '$500K', color: '#fb923c' },
          ].map(item => (
            <div key={item.label} className="mb-3">
              <div className="flex justify-between mb-1.5">
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{item.label}</span>
                <span style={{ fontSize: '12px', color: item.color, fontWeight: 700 }}>{item.amount}</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${item.pct}%` }}
                  transition={{ delay: 0.5, duration: 0.7, ease: 'easeOut' }}
                  style={{ background: item.color }}
                />
              </div>
            </div>
          ))}
        </motion.div>

        {/* Competitive moat */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
          className="rounded-2xl p-5 mb-6"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: '14px', letterSpacing: '0.5px' }}>
            COMPETITIVE MOAT
          </p>
          {[
            { icon: Zap, text: 'Only wallet with offline QR + NFC payments in TZ' },
            { icon: Shield, text: 'NIDA-verified KYC → lowest fraud rate in market' },
            { icon: Globe, text: 'Swahili-first UX — no competitor is native sw' },
            { icon: Award, text: 'GOrewards cashback drives 3× retention vs peers' },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.text} className="flex items-start gap-3 py-2.5"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(22,163,74,0.12)' }}>
                  <Icon className="size-4" style={{ color: '#4ade80' }} />
                </div>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5', paddingTop: '4px' }}>{item.text}</p>
              </div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="space-y-3">
          <button onClick={onEnterApp}
            className="w-full h-14 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 700,
              boxShadow: '0 8px 24px rgba(22,163,74,0.3)',
            }}>
            <Play className="size-5" />
            Enter Live Demo
            <ChevronRight className="size-5" />
          </button>
          <p style={{ textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>
            All data is live from production · No NDA required
          </p>
        </motion.div>
      </div>
    </div>
  );
}
