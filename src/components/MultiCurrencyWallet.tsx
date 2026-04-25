import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { User } from '../App';
import {
  ArrowLeft, Globe, TrendingUp, TrendingDown, RefreshCw, ArrowRightLeft,
  Plus, ChevronRight, Check, Zap, Sparkles, Lock, Clock
} from 'lucide-react';

interface MultiCurrencyWalletProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

interface CurrencyBalance {
  code: string;
  name: string;
  flag: string;
  balance: number;
  rate: number;
  gradient: string;
  accentColor: string;
  sparkline: number[];
}

interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  trend: 'up' | 'down';
  change: number;
}

const CURRENCY_META: Record<string, { gradient: string; accentColor: string; sparkline: number[] }> = {
  TZS: { gradient: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #059669 100%)', accentColor: '#34d399', sparkline: [40, 45, 42, 50, 48, 55, 52, 58, 60, 57, 62, 65] },
  USD: { gradient: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #2563eb 100%)', accentColor: '#60a5fa', sparkline: [55, 58, 54, 60, 62, 59, 65, 63, 68, 66, 70, 72] },
  EUR: { gradient: 'linear-gradient(135deg, #3b0764 0%, #6d28d9 60%, #7c3aed 100%)', accentColor: '#c4b5fd', sparkline: [48, 52, 49, 55, 53, 58, 56, 60, 57, 62, 59, 63] },
  GBP: { gradient: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #44403c 100%)', accentColor: '#e7e5e4', sparkline: [60, 63, 58, 65, 62, 68, 65, 70, 67, 72, 70, 74] },
  KES: { gradient: 'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 60%, #dc2626 100%)', accentColor: '#fca5a5', sparkline: [35, 38, 33, 40, 37, 42, 39, 44, 41, 46, 43, 47] },
  UGX: { gradient: 'linear-gradient(135deg, #451a03 0%, #78350f 60%, #92400e 100%)', accentColor: '#fde68a', sparkline: [25, 28, 24, 30, 27, 32, 29, 34, 31, 36, 33, 37] },
  ZAR: { gradient: 'linear-gradient(135deg, #022c22 0%, #064e3b 60%, #065f46 100%)', accentColor: '#6ee7b7', sparkline: [42, 45, 41, 47, 44, 49, 46, 51, 48, 53, 50, 54] },
};

const fmt = (amount: number, code: string) => {
  const symbols: Record<string, string> = { TZS: 'TZS', USD: '$', EUR: '€', GBP: '£', KES: 'KSh', UGX: 'UGX', ZAR: 'R' };
  return `${symbols[code] || code} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const fmtCompact = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` : n.toFixed(2);

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 80, h = 32;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');
  const fillPts = `0,${h} ${pts} ${w},${h}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`sg-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPts} fill={`url(#sg-${color})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RatesTicker({ rates }: { rates: ExchangeRate[] }) {
  const items = [...rates, ...rates]; // double for seamless loop
  return (
    <div style={{ overflow: 'hidden', background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '8px 0' }}>
      <div style={{ display: 'flex', gap: '32px', animation: 'tickerScroll 20s linear infinite', whiteSpace: 'nowrap', paddingLeft: '16px' }}>
        {items.map((r, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600 }}>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>{r.from}/{r.to}</span>
            <span style={{ color: '#fff' }}>{r.rate.toLocaleString()}</span>
            <span style={{ color: r.trend === 'up' ? '#4ade80' : '#f87171', fontSize: '11px' }}>
              {r.trend === 'up' ? '▲' : '▼'}{Math.abs(r.change)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function MultiCurrencyWallet({ user: _user, accessToken: _accessToken, onBack }: MultiCurrencyWalletProps) {
  const [view, setView] = useState<'overview' | 'add' | 'convert' | 'rates'>('overview');
  const [selectedFrom, setSelectedFrom] = useState('TZS');
  const [selectedTo, setSelectedTo] = useState('USD');
  const [convertAmount, setConvertAmount] = useState('');
  const [pin, setPin] = useState('');
  const [processing, setProcessing] = useState(false);
  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [balances, setBalances] = useState<CurrencyBalance[]>([
    { code: 'TZS', name: 'Sarafu ya Tanzania', flag: '🇹🇿', balance: 1_250_000, rate: 1, ...CURRENCY_META.TZS },
    { code: 'USD', name: 'Dola ya Marekani', flag: '🇺🇸', balance: 250, rate: 2450, ...CURRENCY_META.USD },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺', balance: 180, rate: 2680, ...CURRENCY_META.EUR },
  ]);

  const availableCurrencies = [
    { code: 'GBP', name: 'Pauni ya Uingereza', flag: '🇬🇧', rate: 3100, ...CURRENCY_META.GBP },
    { code: 'KES', name: 'Shilingi ya Kenya', flag: '🇰🇪', rate: 18.5, ...CURRENCY_META.KES },
    { code: 'UGX', name: 'Shilingi ya Uganda', flag: '🇺🇬', rate: 0.65, ...CURRENCY_META.UGX },
    { code: 'ZAR', name: 'Randi ya Afrika Kusini', flag: '🇿🇦', rate: 135, ...CURRENCY_META.ZAR },
  ];

  const exchangeRates: ExchangeRate[] = [
    { from: 'USD', to: 'TZS', rate: 2450, trend: 'up', change: 0.5 },
    { from: 'EUR', to: 'TZS', rate: 2680, trend: 'down', change: 0.3 },
    { from: 'GBP', to: 'TZS', rate: 3100, trend: 'up', change: 0.8 },
    { from: 'KES', to: 'TZS', rate: 18.5, trend: 'up', change: 0.2 },
    { from: 'ZAR', to: 'TZS', rate: 135, trend: 'down', change: 0.1 },
  ];

  const totalInTZS = balances.reduce((s, c) => s + c.balance * c.rate, 0);

  const calcConverted = () => {
    const amt = parseFloat(convertAmount) || 0;
    const from = balances.find(b => b.code === selectedFrom);
    const to = balances.find(b => b.code === selectedTo);
    if (!from || !to) return 0;
    return (amt * from.rate) / to.rate;
  };

  const handleConvert = () => {
    if (!convertAmount || pin.length !== 4) { toast.error('Jaza taarifa zote'); return; }
    const amt = parseFloat(convertAmount);
    const from = balances.find(b => b.code === selectedFrom);
    if (!from || amt > from.balance) { toast.error('Salio haitoshi'); return; }
    setProcessing(true);
    setTimeout(() => {
      const converted = calcConverted();
      setBalances(balances.map(b => {
        if (b.code === selectedFrom) return { ...b, balance: b.balance - amt };
        if (b.code === selectedTo) return { ...b, balance: b.balance + converted };
        return b;
      }));
      toast.success(`✅ Umebadilisha ${fmt(amt, selectedFrom)} → ${fmt(converted, selectedTo)}`);
      setConvertAmount(''); setPin(''); setView('overview'); setProcessing(false);
    }, 1500);
  };

  const addCurrency = (code: string) => {
    const c = availableCurrencies.find(x => x.code === code);
    if (!c) return;
    setBalances(prev => [...prev, { code: c.code, name: c.name, flag: c.flag, balance: 0, rate: c.rate, gradient: c.gradient, accentColor: c.accentColor, sparkline: c.sparkline }]);
    setView('overview');
    toast.success(`${c.name} imeongezwa! 🎉`);
  };

  /* ═══════════════ OVERVIEW ═══════════════ */
  if (view === 'overview') {
    return (
      <div className="min-h-screen pb-10" style={{ background: '#080d08' }}>
        <style>{`
          @keyframes tickerScroll { from { transform: translateX(0) } to { transform: translateX(-50%) } }
          @keyframes floatIn { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
          @keyframes glowPulse { 0%,100% { opacity:0.4 } 50% { opacity:0.7 } }
        `}</style>

        {/* ── STICKY HEADER ── */}
        <div className="sticky top-0 z-20" style={{ background: 'rgba(8,13,8,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="p-2.5 rounded-full active:scale-95" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <ArrowLeft className="size-5 text-white" />
              </button>
              <div>
                <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>Pochi ya Kimataifa</h1>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Multi-Currency Wallet</p>
              </div>
            </div>
            <button onClick={() => setView('add')} className="p-2.5 rounded-full active:scale-95" style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)' }}>
              <Plus className="size-5" style={{ color: '#4ade80' }} />
            </button>
          </div>
          <RatesTicker rates={exchangeRates} />
        </div>

        {/* ── HERO GLOBE CARD ── */}
        <div className="px-4 pt-5">
          <div className="relative rounded-[28px] overflow-hidden p-6" style={{ background: 'linear-gradient(135deg, #0a1f0a 0%, #0d2d1a 40%, #0f3d25 100%)', border: '1px solid rgba(74,222,128,0.15)', minHeight: 180 }}>
            {/* Glow blobs */}
            <div className="absolute top-4 right-4 rounded-full" style={{ width: 120, height: 120, background: 'radial-gradient(circle, rgba(74,222,128,0.18) 0%, transparent 70%)', animation: 'glowPulse 3s ease-in-out infinite' }} />
            <div className="absolute bottom-0 left-8 rounded-full" style={{ width: 80, height: 80, background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', animation: 'glowPulse 4s ease-in-out infinite 1s' }} />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-xl" style={{ background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.2)' }}>
                  <Globe className="size-4" style={{ color: '#4ade80' }} />
                </div>
                <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.5px' }}>JUMLA YA MALI</p>
              </div>

              <p style={{ fontSize: '34px', fontWeight: 900, color: '#fff', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
                TZS {fmtCompact(totalInTZS)}
              </p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                ≈ ${fmtCompact(totalInTZS / 2450)} USD
              </p>

              <div className="flex items-center gap-3 mt-4">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.25)' }}>
                  <TrendingUp className="size-3.5" style={{ color: '#4ade80' }} />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#4ade80' }}>+2.5% leo</span>
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
                  {balances.length} sarafu {balances.map(b => b.flag).join(' ')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div className="px-4 mt-4 grid grid-cols-2 gap-3">
          {[
            { label: 'Badilisha', sub: 'Exchange currency', icon: ArrowRightLeft, color: '#4ade80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.2)', action: () => setView('convert') },
            { label: 'Bei za Sasa', sub: 'Live rates', icon: TrendingUp, color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)', action: () => setView('rates') },
          ].map(({ label, sub, icon: Icon, color, bg, border, action }) => (
            <button key={label} onClick={action} className="rounded-[20px] p-4 text-left active:scale-95 transition-transform" style={{ background: bg, border: `1px solid ${border}` }}>
              <div className="p-2.5 rounded-xl mb-3 w-fit" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <Icon className="size-5" style={{ color }} />
              </div>
              <p style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>{label}</p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{sub}</p>
            </button>
          ))}
        </div>

        {/* ── CURRENCY CARDS (horizontal scroll) ── */}
        <div className="mt-6">
          <div className="px-4 flex items-center justify-between mb-3">
            <div>
              <p style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Pochi Zangu</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Your currency wallets</p>
            </div>
            <button onClick={() => setView('add')} className="flex items-center gap-1" style={{ fontSize: '12px', fontWeight: 700, color: '#4ade80' }}>
              Ongeza <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Horizontal scroll cards */}
          <div ref={scrollRef} style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingLeft: '16px', paddingRight: '16px', paddingBottom: '8px', scrollbarWidth: 'none' }}>
            {balances.map((c, idx) => (
              <div key={c.code} onClick={() => setActiveCardIdx(idx)}
                style={{ flexShrink: 0, width: 220, borderRadius: 24, padding: '20px', background: c.gradient, border: `1px solid ${c.accentColor}22`, position: 'relative', overflow: 'hidden', cursor: 'pointer', transform: activeCardIdx === idx ? 'scale(1.02)' : 'scale(1)', transition: 'transform 0.2s ease', boxShadow: activeCardIdx === idx ? `0 8px 30px ${c.accentColor}30` : 'none' }}>
                {/* Card glow */}
                <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: `radial-gradient(circle, ${c.accentColor}25 0%, transparent 70%)` }} />

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <p style={{ fontSize: '24px', lineHeight: 1 }}>{c.flag}</p>
                    <p style={{ fontSize: '13px', fontWeight: 800, color: '#fff', marginTop: '4px' }}>{c.code}</p>
                    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{c.name}</p>
                  </div>
                  <Sparkline data={c.sparkline} color={c.accentColor} />
                </div>

                <p style={{ fontSize: '22px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1 }}>
                  {c.code === 'TZS' ? `${fmtCompact(c.balance)}` : c.balance.toFixed(2)}
                </p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>
                  ≈ TZS {fmtCompact(c.balance * c.rate)}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', background: 'rgba(255,255,255,0.12)' }}>
                    <span style={{ fontSize: '11px', color: c.accentColor, fontWeight: 700 }}>1 {c.code === 'TZS' ? 'USD' : c.code} = {c.code === 'TZS' ? '2,450' : c.rate.toLocaleString()} {c.code === 'TZS' ? 'TZS' : 'TZS'}</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); toast.success('Inafungua Ongeza Fedha...'); }}
                    style={{ fontSize: '11px', fontWeight: 800, color: c.accentColor, background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '20px', border: 'none', cursor: 'pointer' }}>
                    + Weka
                  </button>
                </div>
              </div>
            ))}

            {/* Add card */}
            <button onClick={() => setView('add')} style={{ flexShrink: 0, width: 110, borderRadius: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'rgba(255,255,255,0.04)', border: '2px dashed rgba(255,255,255,0.12)', cursor: 'pointer' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(74,222,128,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(74,222,128,0.25)' }}>
                <Plus className="size-5" style={{ color: '#4ade80' }} />
              </div>
              <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>Ongeza Sarafu</p>
            </button>
          </div>

          {/* Scroll dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '12px' }}>
            {balances.map((_, i) => (
              <div key={i} style={{ width: i === activeCardIdx ? 20 : 6, height: 6, borderRadius: 3, background: i === activeCardIdx ? '#4ade80' : 'rgba(255,255,255,0.15)', transition: 'all 0.3s' }} />
            ))}
          </div>
        </div>

        {/* ── BENEFITS ── */}
        <div className="px-4 mt-6">
          <div className="rounded-[20px] p-5" style={{ background: 'linear-gradient(135deg, rgba(96,165,250,0.08), rgba(139,92,246,0.08))', border: '1px solid rgba(96,165,250,0.15)' }}>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="size-4" style={{ color: '#60a5fa' }} />
              <p style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>Kwa Nini Pochi ya Kimataifa?</p>
            </div>
            <div className="space-y-2.5">
              {[
                'Bei nzuri za ubadilishaji (bora kuliko benki)',
                'Weka fedha kabla ya safari za nje',
                'Jilinde dhidi ya mabadiliko ya TZS',
                'Lipa kimataifa na kadi ya dijitali',
              ].map((txt, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="p-1 rounded-full mt-0.5" style={{ background: 'rgba(74,222,128,0.15)' }}>
                    <Check className="size-3" style={{ color: '#4ade80' }} />
                  </div>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>{txt}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <Zap className="size-3.5" style={{ color: '#fbbf24' }} />
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>~3% bora kuliko bei za benki · Haraka · Salama</p>
            </div>
          </div>
        </div>

      </div>
    );
  }

  /* ═══════════════ ADD CURRENCY ═══════════════ */
  if (view === 'add') {
    const available = availableCurrencies.filter(c => !balances.find(b => b.code === c.code));
    return (
      <div className="min-h-screen pb-10" style={{ background: '#080d08' }}>
        <div className="sticky top-0 z-20" style={{ background: 'rgba(8,13,8,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="px-4 py-4 flex items-center gap-3">
            <button onClick={() => setView('overview')} className="p-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <ArrowLeft className="size-5 text-white" />
            </button>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>Ongeza Sarafu</h1>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Add Currency Wallet</p>
            </div>
          </div>
        </div>

        <div className="px-4 pt-5 space-y-3">
          {available.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🌍</div>
              <p style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>Umeongeza sarafu zote!</p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>All currencies added</p>
            </div>
          ) : (
            available.map(c => (
              <button key={c.code} onClick={() => addCurrency(c.code)} className="w-full rounded-[20px] p-4 text-left active:scale-98 transition-transform" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: c.gradient, border: `1px solid ${c.accentColor}30` }}>
                    {c.flag}
                  </div>
                  <div className="flex-1">
                    <p style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>{c.code}</p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{c.name}</p>
                  </div>
                  <div className="text-right">
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '2px' }}>1 {c.code} =</p>
                    <p style={{ fontSize: '14px', fontWeight: 800, color: c.accentColor }}>{c.rate.toLocaleString()} TZS</p>
                  </div>
                  <ChevronRight className="size-5 ml-1" style={{ color: 'rgba(255,255,255,0.25)' }} />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    );
  }

  /* ═══════════════ CONVERT ═══════════════ */
  if (view === 'convert') {
    const fromCur = balances.find(b => b.code === selectedFrom)!;
    const toCur = balances.find(b => b.code === selectedTo)!;
    const amt = parseFloat(convertAmount) || 0;
    const converted = calcConverted();
    const rate = amt > 0 ? converted / amt : (fromCur?.rate / toCur?.rate) || 0;
    const fee = amt * 0.005;

    return (
      <div className="min-h-screen pb-10" style={{ background: '#080d08' }}>
        <div className="sticky top-0 z-20" style={{ background: 'rgba(8,13,8,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="px-4 py-4 flex items-center gap-3">
            <button onClick={() => setView('overview')} className="p-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <ArrowLeft className="size-5 text-white" />
            </button>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>Badilisha Sarafu</h1>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Convert Currency</p>
            </div>
          </div>
        </div>

        <div className="px-4 pt-5 space-y-4">

          {/* FROM card */}
          <div className="rounded-[20px] p-5" style={{ background: fromCur?.gradient || 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center justify-between mb-4">
              <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.5px' }}>KUTOKA / FROM</p>
              <select value={selectedFrom} onChange={e => setSelectedFrom(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                {balances.map(b => <option key={b.code} value={b.code} style={{ background: '#111' }}>{b.flag} {b.code}</option>)}
              </select>
            </div>
            <input
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              value={convertAmount}
              onChange={e => setConvertAmount(e.target.value)}
              style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: '40px', fontWeight: 900, color: '#fff', letterSpacing: '-1.5px' }}
            />
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
              Salio: {fromCur ? fmt(fromCur.balance, fromCur.code) : '—'}
            </p>
          </div>

          {/* Swap button */}
          <div className="flex justify-center">
            <button onClick={() => { const t = selectedFrom; setSelectedFrom(selectedTo); setSelectedTo(t); }}
              className="p-3 rounded-full active:scale-90 transition-transform"
              style={{ background: 'rgba(74,222,128,0.12)', border: '2px solid rgba(74,222,128,0.3)' }}>
              <ArrowRightLeft className="size-6" style={{ color: '#4ade80' }} />
            </button>
          </div>

          {/* TO card */}
          <div className="rounded-[20px] p-5" style={{ background: toCur?.gradient || 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center justify-between mb-4">
              <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.5px' }}>KWENDA / TO</p>
              <select value={selectedTo} onChange={e => setSelectedTo(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                {balances.map(b => <option key={b.code} value={b.code} style={{ background: '#111' }}>{b.flag} {b.code}</option>)}
              </select>
            </div>
            <p style={{ fontSize: '40px', fontWeight: 900, color: '#fff', letterSpacing: '-1.5px', opacity: amt > 0 ? 1 : 0.3 }}>
              {amt > 0 ? converted.toFixed(4) : '0.00'}
            </p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
              Salio: {toCur ? fmt(toCur.balance, toCur.code) : '—'}
            </p>
          </div>

          {/* Rate breakdown */}
          {amt > 0 && (
            <div className="rounded-[20px] p-4 space-y-2.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {[
                { label: 'Kiwango cha Ubadilishaji', value: `1 ${selectedFrom} = ${rate.toFixed(4)} ${selectedTo}` },
                { label: 'Ada (0.5%)', value: fmt(fee, selectedFrom) },
                { label: 'Utapata', value: `≈ ${fmt(converted, selectedTo)}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{label}</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{value}</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <Zap className="size-3" style={{ color: '#fbbf24' }} />
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>~3% bora kuliko benki</span>
              </div>
            </div>
          )}

          {/* PIN */}
          <div className="rounded-[20px] p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Lock className="size-4" style={{ color: 'rgba(255,255,255,0.4)' }} />
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Ingiza PIN</p>
            </div>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="• • • •"
              value={pin}
              onChange={e => setPin(e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '16px', textAlign: 'center', fontSize: '28px', letterSpacing: '12px', color: '#fff', outline: 'none' }}
            />
          </div>

          {/* CTA */}
          <button
            onClick={handleConvert}
            disabled={processing || !convertAmount || pin.length !== 4 || amt <= 0}
            className="w-full py-4 rounded-[20px] font-bold text-base active:scale-98 transition-all disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', color: '#fff', fontSize: '16px', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
            {processing ? 'Inabadilisha…' : `Badilisha ${selectedFrom} → ${selectedTo}`}
          </button>
        </div>
      </div>
    );
  }

  /* ═══════════════ LIVE RATES ═══════════════ */
  return (
    <div className="min-h-screen pb-10" style={{ background: '#080d08' }}>
      <div className="sticky top-0 z-20" style={{ background: 'rgba(8,13,8,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('overview')} className="p-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <ArrowLeft className="size-5 text-white" />
            </button>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>Bei za Sasa</h1>
              <div className="flex items-center gap-1.5">
                <Clock className="size-3" style={{ color: 'rgba(255,255,255,0.35)' }} />
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>Imesasishwa dakika 2 zilizopita</span>
              </div>
            </div>
          </div>
          <button className="p-2.5 rounded-full active:rotate-180 transition-transform" style={{ background: 'rgba(255,255,255,0.08)' }}
            onClick={() => toast.success('Bei zimesasishwa!')}>
            <RefreshCw className="size-5 text-white" />
          </button>
        </div>
        <RatesTicker rates={exchangeRates} />
      </div>

      <div className="px-4 pt-5 space-y-3">
        {/* Base currency reminder */}
        <div className="rounded-[16px] px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.15)' }}>
          <Globe className="size-4" style={{ color: '#4ade80' }} />
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Bei zote zinabadilishwa <strong style={{ color: '#fff' }}>dhidi ya TZS</strong></p>
        </div>

        {exchangeRates.map((rate, idx) => {
          const fromMeta = CURRENCY_META[rate.from];
          const sparkData = fromMeta?.sparkline || [50, 52, 48, 55, 53, 57, 55, 60, 58, 62];
          return (
            <div key={idx} className="rounded-[20px] p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: fromMeta?.gradient || '#222' }}>
                    {['🇺🇸', '🇪🇺', '🇬🇧', '🇰🇪', '🇿🇦'][idx] || '🌍'}
                  </div>
                  <div>
                    <p style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>{rate.from}</p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>vs {rate.to}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p style={{ fontSize: '22px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>{rate.rate.toLocaleString()}</p>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    {rate.trend === 'up'
                      ? <TrendingUp className="size-3.5" style={{ color: '#4ade80' }} />
                      : <TrendingDown className="size-3.5" style={{ color: '#f87171' }} />}
                    <span style={{ fontSize: '12px', fontWeight: 700, color: rate.trend === 'up' ? '#4ade80' : '#f87171' }}>
                      {rate.change > 0 ? '+' : ''}{rate.change}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-end justify-between">
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
                  1 {rate.from} = {rate.rate.toLocaleString()} {rate.to}
                </p>
                <Sparkline data={sparkData} color={rate.trend === 'up' ? '#4ade80' : '#f87171'} />
              </div>
            </div>
          );
        })}

        {/* Convert CTA */}
        <button onClick={() => setView('convert')} className="w-full py-4 rounded-[20px] flex items-center justify-center gap-2 mt-2"
          style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
          <ArrowRightLeft className="size-5" style={{ color: '#4ade80' }} />
          <span style={{ fontSize: '15px', fontWeight: 800, color: '#4ade80' }}>Badilisha Sarafu Sasa</span>
        </button>
      </div>
    </div>
  );
}
