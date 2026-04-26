import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { User } from '../App';
import {
  ArrowLeft, Zap, TrendingUp, CheckCircle, Clock,
  AlertCircle, DollarSign, Bus, Home, Book, Phone,
  Calendar, Shield, Award, Info, ChevronRight, Sparkles, Lock
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { useAnalytics } from '../hooks/useAnalytics';

interface MicroLoansPageProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

interface LoanOffer {
  id: string;
  amount: number;
  duration: string;
  interest: number;
  totalRepayment: number;
  purpose: string;
  icon: any;
}

interface ActiveLoan {
  id: string;
  amount: number;
  purpose: string;
  disbursedDate: string;
  dueDate: string;
  totalDue: number;
  paid: number;
  status: 'active' | 'paid' | 'overdue';
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 }).format(amount);

const fmtCompact = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(0)}K` : n.toFixed(0);

const CATEGORY_META: Record<string, { gradient: string; accent: string; glow: string; track: string }> = {
  transport:  { gradient: 'linear-gradient(135deg,#0f172a 0%,#1e3a8a 60%,#1d4ed8 100%)',  accent: '#60a5fa', glow: 'rgba(96,165,250,0.3)',   track: 'rgba(96,165,250,0.1)'  },
  bills:      { gradient: 'linear-gradient(135deg,#1c0a00 0%,#7c2d12 60%,#c2410c 100%)',  accent: '#fb923c', glow: 'rgba(251,146,60,0.3)',   track: 'rgba(251,146,60,0.1)'  },
  education:  { gradient: 'linear-gradient(135deg,#1a0533 0%,#4c1d95 60%,#7c3aed 100%)',  accent: '#c4b5fd', glow: 'rgba(196,181,253,0.3)',  track: 'rgba(196,181,253,0.1)' },
  airtime:    { gradient: 'linear-gradient(135deg,#052e16 0%,#14532d 60%,#166534 100%)',  accent: '#4ade80', glow: 'rgba(74,222,128,0.3)',   track: 'rgba(74,222,128,0.1)'  },
};

export function MicroLoansPage({ user, accessToken, onBack }: MicroLoansPageProps) {
  const [view, setView] = useState<'home' | 'apply' | 'success'>('home');
  const [loanPurpose, setLoanPurpose] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [selectedOffer, setSelectedOffer] = useState<LoanOffer | null>(null);
  const [pin, setPin] = useState('');
  const [processing, setProcessing] = useState(false);
  const [creditScore] = useState(750);
  const [loanLimit] = useState(500000);
  const { track } = useAnalytics(accessToken);

  useEffect(() => {
    if (view === 'apply') track('loan_apply_started', { purpose: loanPurpose });
  }, [view]); // eslint-disable-line react-hooks/exhaustive-deps

  const [activeLoans, setActiveLoans] = useState<ActiveLoan[]>([
    { id: '1', amount: 50000, purpose: 'Bus Ticket to Arusha', disbursedDate: '2025-11-15', dueDate: '2025-12-15', totalDue: 52500, paid: 20000, status: 'active' },
  ]);

  const loanCategories = [
    { id: 'transport',  label: 'Usafiri',       subLabel: 'Transport & Travel', icon: Bus,   meta: CATEGORY_META.transport },
    { id: 'bills',      label: 'Bili & Huduma',  subLabel: 'Bills & Utilities',  icon: Home,  meta: CATEGORY_META.bills     },
    { id: 'education',  label: 'Ada ya Shule',   subLabel: 'School & Education', icon: Book,  meta: CATEGORY_META.education },
    { id: 'airtime',    label: 'Airtime & Data', subLabel: 'Bundles & Airtime',  icon: Phone, meta: CATEGORY_META.airtime   },
  ];

  const calculateLoanTerms = (amount: number, purpose: string) => {
    const rates: Record<string, number> = { transport: 0.03, education: 0.04, bills: 0.05, airtime: 0.02 };
    const interestRate = rates[purpose] ?? 0.05;
    return { principal: amount, interest: amount * interestRate, total: amount * (1 + interestRate) };
  };

  const handleApplyLoan = async () => {
    if (!selectedOffer || pin.length !== 4) {
      toast.error('Jaza taarifa zote zinazohitajika');
      return;
    }
    setProcessing(true);
    try {
      await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/loans/apply`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: selectedOffer.amount, purpose: selectedOffer.purpose, duration: selectedOffer.duration, pin }),
      });
    } catch { /* demo */ }
    const newLoan: ActiveLoan = {
      id: Date.now().toString(),
      amount: selectedOffer.amount,
      purpose: selectedOffer.purpose,
      disbursedDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      totalDue: selectedOffer.totalRepayment,
      paid: 0,
      status: 'active',
    };
    setActiveLoans(prev => [...prev, newLoan]);
    setView('success');
    track('loan_apply_completed', { amount: selectedOffer.amount, purpose: selectedOffer.purpose });
    setPin('');
    setProcessing(false);
  };

  const statusStyle = (s: string) => s === 'active'
    ? { background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.25)' }
    : s === 'paid'
    ? { background: 'rgba(22,163,74,0.15)',  color: '#4ade80', border: '1px solid rgba(22,163,74,0.25)'  }
    : { background: 'rgba(239,68,68,0.15)',  color: '#f87171', border: '1px solid rgba(239,68,68,0.25)'  };

  const statusLabel = (s: string) => s === 'active' ? 'Hai' : s === 'paid' ? 'Imelipwa' : 'Imechelewa';

  const scoreGrade = creditScore >= 800 ? 'EXCELLENT' : creditScore >= 600 ? 'GOOD' : 'BUILDING';
  const scoreColor = creditScore >= 800 ? '#4ade80' : creditScore >= 600 ? '#fbbf24' : '#fb923c';
  const scoreCirc = 2 * Math.PI * 62; // r=62

  // ── HOME VIEW ──────────────────────────────────────────────────────────────────
  if (view === 'home') {
    return (
      <div style={{ minHeight: '100vh', paddingBottom: 80, background: '#080d08', color: '#fff' }}>
        <style>{`
          @keyframes glowPulse { 0%,100%{opacity:.4} 50%{opacity:.8} }
          @keyframes scoreIn { from{stroke-dasharray:0 1000} }
        `}</style>

        {/* Sticky header */}
        <div className="sticky top-0 z-20" style={{ background: 'rgba(8,13,8,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="p-2.5 rounded-full active:scale-95" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <ArrowLeft className="size-5 text-white" />
              </button>
              <div>
                <h1 style={{ fontSize: '20px', fontWeight: 900, color: '#fff' }}>goPay Mikopo</h1>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Mkopo wa haraka bila kizuizi</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 20, background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }}>
              <Zap style={{ width: 12, height: 12, color: '#4ade80' }} />
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#4ade80' }}>Haraka</span>
            </div>
          </div>
        </div>

        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* ── CREDIT SCORE HERO ── */}
          <div style={{ borderRadius: 28, overflow: 'hidden', position: 'relative', background: 'linear-gradient(160deg,#0a1f0a 0%,#0d2d1a 40%,#0f3d25 80%,#14532d 100%)', border: '1px solid rgba(74,222,128,0.15)', boxShadow: '0 8px 40px rgba(22,163,74,0.15)' }}>
            {/* Ambient glow */}
            <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,222,128,0.15) 0%, transparent 70%)', animation: 'glowPulse 4s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', bottom: -30, left: -30, width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.1) 0%, transparent 70%)', animation: 'glowPulse 5s ease-in-out infinite 2s' }} />

            <div style={{ position: 'relative', zIndex: 1, padding: '24px 20px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <div style={{ padding: '6px', borderRadius: 10, background: 'rgba(255,255,255,0.1)' }}>
                  <Award style={{ width: 16, height: 16, color: '#fbbf24' }} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.5px' }}>ALAMA YA MKOPO • CREDIT SCORE</span>
              </div>

              {/* Ring + Number side by side */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
                {/* SVG Ring */}
                <div style={{ position: 'relative', flexShrink: 0, width: 140, height: 140 }}>
                  <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
                    <defs>
                      <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="60%" stopColor="#86efac" />
                        <stop offset="100%" stopColor="#4ade80" />
                      </linearGradient>
                    </defs>
                    <circle cx="70" cy="70" r="62" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                    <circle cx="70" cy="70" r="62" fill="none" stroke="url(#scoreGrad)" strokeWidth="10"
                      strokeDasharray={`${(creditScore / 1000) * scoreCirc} ${scoreCirc}`}
                      strokeLinecap="round"
                      style={{ filter: `drop-shadow(0 0 6px ${scoreColor})` }} />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '34px', fontWeight: 900, color: '#fff', letterSpacing: '-2px', lineHeight: 1 }}>{creditScore}</span>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>/ 1000</span>
                    <div style={{ marginTop: 6, padding: '3px 10px', borderRadius: 20, background: `${scoreColor}22`, border: `1px solid ${scoreColor}44` }}>
                      <span style={{ fontSize: '9px', fontWeight: 800, color: scoreColor }}>{scoreGrade}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Loan limit card + progress */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ borderRadius: 18, padding: '16px', background: 'linear-gradient(135deg,#422006,#92400e)', border: '2px solid rgba(251,191,36,0.3)', boxShadow: '0 4px 16px rgba(251,191,36,0.2)' }}>
                    <p style={{ fontSize: '9px', fontWeight: 800, color: 'rgba(254,215,170,0.8)', letterSpacing: '0.5px', marginBottom: 2 }}>KIKOMO • LOAN LIMIT</p>
                    <p style={{ fontSize: '22px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1.1 }}>TZS {fmtCompact(loanLimit)}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                      <Sparkles style={{ width: 10, height: 10, color: '#fbbf24' }} />
                      <span style={{ fontSize: '10px', color: 'rgba(254,215,170,0.7)', fontWeight: 600 }}>Inaweza kuongezeka</span>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                        {creditScore >= 800 ? 'Alama Bora!' : creditScore >= 600 ? 'Maendeleo Mazuri' : 'Endelea Kujenga'}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#fff' }}>{Math.round((creditScore / 1000) * 100)}%</span>
                    </div>
                    <div style={{ height: 8, borderRadius: 8, overflow: 'hidden', background: 'rgba(255,255,255,0.1)' }}>
                      <div style={{ height: '100%', borderRadius: 8, width: `${(creditScore / 1000) * 100}%`, background: 'linear-gradient(90deg,#fbbf24,#86efac,#4ade80)', transition: 'width 1s ease' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tip */}
              <div style={{ borderRadius: 16, padding: '12px 14px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ padding: '5px', borderRadius: 8, background: 'rgba(251,191,36,0.2)', flexShrink: 0 }}>
                  <Sparkles style={{ width: 14, height: 14, color: '#fbbf24' }} />
                </div>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
                  {creditScore < 800
                    ? `Lipa kwa wakati ili kufungua hadi ${formatCurrency(loanLimit * 2)} na riba ndogo!`
                    : 'Kikomo cha juu kimefunguliwa! Dumisha historia nzuri ya malipo kwa faida za VIP.'}
                </p>
              </div>
            </div>
          </div>

          {/* ── ACTIVE LOANS ── */}
          {activeLoans.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Mikopo Hai</h3>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Inayoendelea · {activeLoans.length} mkopo</p>
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '12px', fontWeight: 700, color: '#4ade80', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Ona Yote <ChevronRight style={{ width: 14, height: 14 }} />
                </button>
              </div>

              {activeLoans.slice(0, 2).map(loan => {
                const pct = (loan.paid / loan.totalDue) * 100;
                const remaining = loan.totalDue - loan.paid;
                return (
                  <div key={loan.id} style={{ borderRadius: 22, padding: '20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 10 }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '15px', fontWeight: 800, color: '#fff', marginBottom: 4 }}>{loan.purpose}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '11px', fontWeight: 800, ...statusStyle(loan.status) }}>{statusLabel(loan.status)}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                            <Calendar style={{ width: 11, height: 11 }} />
                            <span>Mwisho: {loan.dueDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Amounts */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
                      <div style={{ borderRadius: 13, padding: '10px 8px', background: 'rgba(255,255,255,0.05)' }}>
                        <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginBottom: 3, fontWeight: 600 }}>ULIOKOPA</p>
                        <p style={{ fontSize: '12px', fontWeight: 900, color: '#fff' }}>{fmtCompact(loan.amount)}</p>
                      </div>
                      <div style={{ borderRadius: 13, padding: '10px 8px', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.15)' }}>
                        <p style={{ fontSize: '9px', color: '#4ade80', marginBottom: 3, fontWeight: 600 }}>UMELIPA</p>
                        <p style={{ fontSize: '12px', fontWeight: 900, color: '#4ade80' }}>{fmtCompact(loan.paid)}</p>
                      </div>
                      <div style={{ borderRadius: 13, padding: '10px 8px', background: 'rgba(251,146,60,0.08)', border: '1px solid rgba(251,146,60,0.15)' }}>
                        <p style={{ fontSize: '9px', color: '#fb923c', marginBottom: 3, fontWeight: 600 }}>ILIYOBAKI</p>
                        <p style={{ fontSize: '12px', fontWeight: 900, color: '#fb923c' }}>{fmtCompact(remaining)}</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Maendeleo ya malipo</span>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: '#4ade80' }}>{Math.round(pct)}%</span>
                      </div>
                      <div style={{ height: 8, borderRadius: 8, overflow: 'hidden', background: 'rgba(255,255,255,0.08)' }}>
                        <div style={{ height: '100%', borderRadius: 8, width: `${pct}%`, background: 'linear-gradient(90deg,#16a34a,#4ade80)', transition: 'width 0.8s ease', boxShadow: '0 0 8px rgba(74,222,128,0.4)' }} />
                      </div>
                    </div>

                    {/* Pay button */}
                    <button className="active:scale-[0.98] transition-transform"
                      style={{ width: '100%', padding: '13px', borderRadius: 16, background: 'linear-gradient(135deg,#16a34a,#15803d)', color: '#fff', fontWeight: 800, fontSize: '15px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <DollarSign style={{ width: 16, height: 16 }} />
                      Lipa {formatCurrency(remaining)}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {activeLoans.length === 0 && (
            <div style={{ borderRadius: 20, padding: '28px', textAlign: 'center', background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.12)' }}>
              <div style={{ width: 60, height: 60, borderRadius: 18, background: 'linear-gradient(135deg,#1e3a8a,#1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <CheckCircle style={{ width: 30, height: 30, color: '#fff' }} />
              </div>
              <p style={{ fontSize: '15px', fontWeight: 800, color: '#fff', marginBottom: 4 }}>Hakuna Mkopo Hai</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Huna mikopo inayoendelea sasa hivi</p>
            </div>
          )}

          {/* ── LOAN CATEGORIES ── */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Chagua Aina ya Mkopo</h3>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Mikopo ya haraka kwa mahitaji yako</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {loanCategories.map(cat => {
                const Icon = cat.icon;
                const m = cat.meta;
                return (
                  <button key={cat.id} onClick={() => { setLoanPurpose(cat.id); setView('apply'); }}
                    className="active:scale-[0.97] transition-transform text-left"
                    style={{ borderRadius: 22, padding: '20px 16px', background: m.gradient, border: `1px solid ${m.accent}25`, position: 'relative', overflow: 'hidden', boxShadow: `0 4px 20px ${m.glow}` }}>
                    {/* Glow bubble */}
                    <div style={{ position: 'absolute', top: -16, right: -16, width: 80, height: 80, borderRadius: '50%', background: `radial-gradient(circle, ${m.accent}25 0%, transparent 70%)` }} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                      {/* Icon */}
                      <div style={{ width: 48, height: 48, borderRadius: 14, background: `${m.accent}20`, border: `1px solid ${m.accent}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                        <Icon style={{ width: 24, height: 24, color: m.accent }} />
                      </div>

                      <p style={{ fontSize: '15px', fontWeight: 900, color: '#fff', marginBottom: 3 }}>{cat.label}</p>
                      <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>{cat.subLabel}</p>

                      {/* Instant badge */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px rgba(74,222,128,0.7)' }} />
                        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>Idhini ya papo hapo</span>
                      </div>

                      {/* Limit chip */}
                      <div style={{ padding: '5px 10px', borderRadius: 10, background: 'rgba(255,255,255,0.1)', border: `1px solid ${m.accent}30`, display: 'inline-block' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: m.accent }}>Hadi {formatCurrency(loanLimit)}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── WHY GOPAY ── */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Sparkles style={{ width: 18, height: 18, color: '#fbbf24' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Kwa Nini goPay?</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { icon: Zap,      accent: '#4ade80', bg: 'rgba(74,222,128,0.1)',   border: 'rgba(74,222,128,0.2)',   title: 'Pesa Moja Kwa Moja',  body: 'Kutumwa papo hapo • Pesa kwenye pochi yako kwa sekunde' },
                { icon: Clock,    accent: '#60a5fa', bg: 'rgba(96,165,250,0.1)',   border: 'rgba(96,165,250,0.2)',   title: 'Malipo Rahisi',        body: 'Malipo ya kubadilika • Siku 30 kulipa, hakuna ada zilizofichwa' },
                { icon: TrendingUp, accent: '#c4b5fd', bg: 'rgba(196,181,253,0.1)', border: 'rgba(196,181,253,0.2)', title: 'Jenga Alama',          body: 'Ongeza alama ya mkopo • Panda kikomo na malipo ya wakati' },
                { icon: Shield,   accent: '#fb923c', bg: 'rgba(251,146,60,0.1)',   border: 'rgba(251,146,60,0.2)',   title: 'Usalama Kamili',       body: '100% salama • Ilisajiliwa na Benki ya Tanzania' },
              ].map((b, i) => {
                const Icon = b.icon;
                return (
                  <div key={i} style={{ borderRadius: 16, padding: '14px 16px', background: b.bg, border: `1px solid ${b.border}`, display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 13, background: `${b.accent}18`, border: `1px solid ${b.accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon style={{ width: 22, height: 22, color: b.accent }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '13px', fontWeight: 800, color: '#fff', marginBottom: 3 }}>{b.title}</p>
                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{b.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── TERMS TRANSPARENCY ── */}
          <div style={{ borderRadius: 22, padding: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Info style={{ width: 20, height: 20, color: 'rgba(255,255,255,0.6)' }} />
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>Masharti Wazi</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Hakuna ada zilizofichwa · Hakuna mshangao</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              {[
                { label: 'Kiwango cha Riba', value: '15%', sub: 'kwa mwezi' },
                { label: 'Muda wa Kulipa',  value: '30',   sub: 'siku za juu' },
              ].map(({ label, value, sub }) => (
                <div key={label} style={{ borderRadius: 14, padding: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{label}</p>
                  <p style={{ fontSize: '32px', fontWeight: 900, color: '#fff', letterSpacing: '-1px', lineHeight: 1 }}>{value}</p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>{sub}</p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', textAlign: 'center' }}>
              Mfano: Kopa {formatCurrency(100000)} → Lipa {formatCurrency(115000)}
            </p>
          </div>

          {/* ── APPLY CTA ── */}
          <button onClick={() => setView('apply')}
            className="active:scale-[0.99] transition-transform"
            style={{ width: '100%', padding: '18px', borderRadius: 22, background: 'linear-gradient(135deg,#16a34a,#15803d)', color: '#fff', fontWeight: 900, fontSize: '16px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 8px 32px rgba(22,163,74,0.35)' }}>
            <DollarSign style={{ width: 20, height: 20 }} />
            Omba Mkopo Sasa · Apply for Loan
          </button>
        </div>
      </div>
    );
  }

  // ── APPLY VIEW ──────────────────────────────────────────────────────────────────
  if (view === 'apply') {
    const purposeLabel = loanCategories.find(c => c.id === loanPurpose)?.label || 'Mkopo wa Jumla';
    const catMeta = CATEGORY_META[loanPurpose] ?? CATEGORY_META.transport;
    const amount = parseFloat(loanAmount) || 0;
    const terms = calculateLoanTerms(amount, loanPurpose);

    return (
      <div style={{ minHeight: '100vh', paddingBottom: 40, background: '#080d08', color: '#fff' }}>
        <div className="sticky top-0 z-20" style={{ background: 'rgba(8,13,8,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="px-4 py-4 flex items-center gap-3">
            <button onClick={() => setView('home')} className="p-2.5 rounded-full active:scale-95" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <ArrowLeft className="size-5 text-white" />
            </button>
            <div>
              <h1 style={{ fontSize: '19px', fontWeight: 800, color: '#fff' }}>Omba Mkopo</h1>
              <p style={{ fontSize: '12px', color: catMeta.accent }}>{purposeLabel}</p>
            </div>
          </div>
        </div>

        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Amount input */}
          <div style={{ borderRadius: 20, padding: '20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>Unahitaji kiasi gani?</p>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: '13px', fontWeight: 800, color: 'rgba(255,255,255,0.35)' }}>TZS</span>
              <input type="number" inputMode="decimal" placeholder="0"
                value={loanAmount} onChange={e => setLoanAmount(e.target.value)}
                style={{ width: '100%', height: 60, paddingLeft: 60, paddingRight: 16, borderRadius: 16, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '28px', fontWeight: 900, color: '#fff', outline: 'none', textAlign: 'right', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>
              <span>Min: {formatCurrency(5000)}</span>
              <span>Max: {formatCurrency(loanLimit)}</span>
            </div>
            {amount > loanLimit && (
              <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <AlertCircle style={{ width: 16, height: 16, color: '#f87171', flexShrink: 0 }} />
                <p style={{ fontSize: '12px', color: '#f87171' }}>Kiasi kinazidi kikomo chako cha mkopo</p>
              </div>
            )}
          </div>

          {/* Quick amounts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
            {[10000, 25000, 50000, 100000].map(amt => (
              <button key={amt} onClick={() => setLoanAmount(amt.toString())}
                className="active:scale-95 transition-transform"
                style={{ padding: '10px 4px', borderRadius: 12, fontSize: '11px', fontWeight: 800, background: loanAmount === amt.toString() ? `${catMeta.accent}20` : 'rgba(255,255,255,0.05)', border: loanAmount === amt.toString() ? `1.5px solid ${catMeta.accent}` : '1px solid rgba(255,255,255,0.08)', color: loanAmount === amt.toString() ? catMeta.accent : 'rgba(255,255,255,0.55)', cursor: 'pointer' }}>
                {fmtCompact(amt)}
              </button>
            ))}
          </div>

          {amount >= 5000 && amount <= loanLimit && (
            <>
              {/* Loan terms card */}
              <div style={{ borderRadius: 20, padding: '20px', background: `linear-gradient(135deg,${catMeta.gradient.split(',').slice(1).join(',')}`, border: `1px solid ${catMeta.accent}20` }}>
                <p style={{ fontSize: '14px', fontWeight: 800, color: '#fff', marginBottom: 14 }}>Masharti ya Mkopo</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Kiasi cha Mkopo:', value: formatCurrency(terms.principal) },
                    { label: `Riba (${((terms.interest / terms.principal) * 100).toFixed(0)}%):`, value: formatCurrency(terms.interest) },
                  ].map((row, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)' }}>{row.label}</span>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{row.value}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>Jumla ya Kulipa:</span>
                    <span style={{ fontSize: '24px', fontWeight: 900, color: '#4ade80', letterSpacing: '-0.5px' }}>{formatCurrency(terms.total)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                    <Calendar style={{ width: 13, height: 13 }} />
                    <span>Lipa ndani ya siku 30</span>
                  </div>
                </div>
              </div>

              {/* How it works */}
              <div style={{ borderRadius: 18, padding: '16px', background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.15)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <Info style={{ width: 18, height: 18, color: '#60a5fa', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: 8 }}>Jinsi inavyofanya kazi:</p>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      {['Pesa inaongezwa moja kwa moja kwenye pochi yako ya goPay', 'Inakatwa kiotomatiki kutoka malipo yako ya pochi inayofuata', 'Hakuna ada zilizofichwa au adhabu', 'Jenga alama ya mkopo kwa malipo ya wakati'].map((item, i) => (
                        <li key={i} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', display: 'flex', gap: 6 }}>
                          <span style={{ color: '#60a5fa', flexShrink: 0 }}>•</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* PIN */}
              <div style={{ borderRadius: 20, padding: '20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Lock style={{ width: 16, height: 16, color: 'rgba(255,255,255,0.5)' }} />
                  <p style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>Ingiza PIN Kuthibitisha</p>
                </div>
                <input type="password" inputMode="numeric" maxLength={4} placeholder="• • • •"
                  value={pin} onChange={e => setPin(e.target.value)}
                  style={{ width: '100%', height: 58, textAlign: 'center', fontSize: '28px', letterSpacing: '14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              {/* Submit */}
              <button
                onClick={() => {
                  setSelectedOffer({ id: Date.now().toString(), amount: terms.principal, duration: '30 days', interest: terms.interest, totalRepayment: terms.total, purpose: purposeLabel, icon: Bus });
                  handleApplyLoan();
                }}
                disabled={processing || pin.length !== 4}
                className="active:scale-[0.98] transition-transform"
                style={{ width: '100%', padding: '18px', borderRadius: 20, background: 'linear-gradient(135deg,#16a34a,#15803d)', color: '#fff', fontWeight: 900, fontSize: '16px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 8px 28px rgba(22,163,74,0.35)', opacity: (processing || pin.length !== 4) ? 0.5 : 1 }}>
                <DollarSign style={{ width: 20, height: 20 }} />
                {processing ? 'Inachakata...' : `Pata ${formatCurrency(terms.principal)} Sasa`}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── SUCCESS VIEW ──────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: '#080d08' }}>
      <style>{`
        @keyframes successPop { 0%{transform:scale(0.6);opacity:0} 70%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
      <div style={{ maxWidth: 400, width: '100%' }}>
        {/* Success animation */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'linear-gradient(135deg,#16a34a,#15803d)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 0 40px rgba(22,163,74,0.4)', animation: 'successPop 0.5s cubic-bezier(0.175,0.885,0.32,1.275) forwards' }}>
            <CheckCircle style={{ width: 48, height: 48, color: '#fff' }} />
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', marginBottom: 6, animation: 'fadeUp 0.5s ease 0.2s forwards', opacity: 0 }}>Mkopo Umeidhinishwa!</h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', animation: 'fadeUp 0.5s ease 0.3s forwards', opacity: 0 }}>Pesa imeongezwa kwenye pochi yako</p>
        </div>

        {/* Loan summary card */}
        <div style={{ borderRadius: 24, padding: '24px', marginBottom: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', animation: 'fadeUp 0.5s ease 0.35s forwards', opacity: 0 }}>
          <div style={{ borderRadius: 18, padding: '20px', marginBottom: 16, background: 'linear-gradient(135deg,#0a1f0a,#14532d)', border: '1px solid rgba(74,222,128,0.2)' }}>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Kiasi cha Mkopo</p>
            <p style={{ fontSize: '36px', fontWeight: 900, color: '#fff', letterSpacing: '-1.5px' }}>
              {selectedOffer && formatCurrency(selectedOffer.amount)}
            </p>
          </div>

          {selectedOffer && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { label: 'Madhumuni:', value: selectedOffer.purpose },
                { label: 'Muda:', value: selectedOffer.duration },
                { label: 'Riba:', value: formatCurrency(selectedOffer.interest) },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>{row.label}</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{row.value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 14 }}>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>Jumla ya Kulipa:</span>
                <span style={{ fontSize: '18px', fontWeight: 900, color: '#4ade80' }}>{formatCurrency(selectedOffer.totalRepayment)}</span>
              </div>
            </div>
          )}
        </div>

        <div style={{ borderRadius: 16, padding: '14px 16px', marginBottom: 20, background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)', animation: 'fadeUp 0.5s ease 0.45s forwards', opacity: 0 }}>
          <p style={{ fontSize: '13px', fontWeight: 800, color: '#4ade80', marginBottom: 3 }}>✓ Imetumwa kwenye pochi yako</p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Malipo yatakatwa kiotomatiki kutoka malipo yako ya pochi inayofuata</p>
        </div>

        <button onClick={() => { setView('home'); setPin(''); setLoanAmount(''); }}
          className="active:scale-[0.98] transition-transform"
          style={{ width: '100%', padding: '16px', borderRadius: 20, background: 'linear-gradient(135deg,#16a34a,#15803d)', color: '#fff', fontWeight: 900, fontSize: '16px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 28px rgba(22,163,74,0.35)', animation: 'fadeUp 0.5s ease 0.5s forwards', opacity: 0 }}>
          Imekamilika
        </button>
      </div>
    </div>
  );
}
