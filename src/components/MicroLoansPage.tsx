import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { User } from '../App';
import {
  ArrowLeft, Zap, TrendingUp, CheckCircle, Clock,
  AlertCircle, DollarSign, Bus, Home, Book, Phone,
  Calendar, Shield, Award, Info, ChevronRight, Sparkles
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
    { id: 'transport', label: 'Usafiri', icon: Bus, color: 'from-blue-500 to-cyan-500' },
    { id: 'bills', label: 'Bili & Huduma', icon: Home, color: 'from-orange-500 to-red-500' },
    { id: 'education', label: 'Ada ya Shule', icon: Book, color: 'from-purple-500 to-pink-500' },
    { id: 'airtime', label: 'Airtime & Data', icon: Phone, color: 'from-green-500 to-emerald-500' },
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
    ? { background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }
    : s === 'paid'
    ? { background: 'rgba(22,163,74,0.15)', color: '#4ade80', border: '1px solid rgba(22,163,74,0.2)' }
    : { background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' };

  const statusLabel = (s: string) => s === 'active' ? 'Hai' : s === 'paid' ? 'Imelipwa' : 'Imechelewa';

  // ── HOME VIEW ──
  if (view === 'home') {
    return (
      <div className="min-h-screen pb-10" style={{ background: '#080d08' }}>
        <div className="sticky top-0 z-20 px-4 py-4" style={{ background: 'rgba(8,13,8,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2.5 rounded-full active:scale-95" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <ArrowLeft className="size-5 text-white" />
            </button>
            <div className="flex-1">
              <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>goPay Loans</h1>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Mkopo wa haraka</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-5 space-y-5">
          {/* Credit Score Card */}
          <div className="relative rounded-[28px] p-7 text-white overflow-hidden shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 50%, #14532d 100%)', border: '1px solid rgba(74,222,128,0.15)' }}>
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 blur-3xl" style={{ background: 'rgba(74,222,128,0.2)' }} />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full -ml-24 -mb-24 blur-2xl" style={{ background: 'rgba(5,46,22,0.6)' }} />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.15)' }}>
                    <Award className="size-5 text-white" />
                  </div>
                  <div>
                    <p style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.5px' }}>ALAMA YA MKOPO</p>
                    <p style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>Credit Score</p>
                  </div>
                </div>
              </div>

              <div className="flex items-stretch gap-3 mb-5">
                <div className="flex-1 rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <svg className="size-20 -rotate-90">
                        <circle cx="40" cy="40" r="34" stroke="rgba(255,255,255,0.2)" strokeWidth="6" fill="none" />
                        <circle cx="40" cy="40" r="34" stroke="url(#lg1)" strokeWidth="6" fill="none"
                          strokeDasharray={`${(creditScore / 1000) * 213} 213`} strokeLinecap="round" />
                        <defs>
                          <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FBBF24" />
                            <stop offset="100%" stopColor="#34D399" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Zap className="size-7 text-yellow-300" />
                      </div>
                    </div>
                    <div>
                      <p style={{ fontSize: '44px', fontWeight: 900, lineHeight: 1, color: '#fff', letterSpacing: '-2px' }}>{creditScore}</p>
                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>/ 1000</p>
                      <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: 'rgba(74,222,128,0.2)' }}>
                        <TrendingUp className="size-3" style={{ color: '#86efac' }} />
                        <span style={{ fontSize: '9px', fontWeight: 700, color: '#86efac' }}>
                          {creditScore >= 800 ? 'EXCELLENT' : creditScore >= 600 ? 'GOOD' : 'BUILDING'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl px-4 py-4 min-w-[130px] flex flex-col justify-center"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: '2px solid rgba(251,191,36,0.4)' }}>
                  <div className="flex items-center gap-1 mb-0.5">
                    <DollarSign className="size-3" style={{ color: 'rgba(120,53,15,0.8)' }} />
                    <p style={{ fontSize: '9px', fontWeight: 800, color: 'rgba(120,53,15,0.9)', letterSpacing: '0.5px' }}>KIKOMO</p>
                  </div>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(120,53,15,0.8)', marginBottom: '2px' }}>Loan Limit</p>
                  <p style={{ fontSize: '20px', fontWeight: 900, lineHeight: 1.1, color: '#1c0a00', letterSpacing: '-0.5px' }}>{formatCurrency(loanLimit)}</p>
                  <Sparkles className="size-3.5 mt-1" style={{ color: 'rgba(120,53,15,0.6)' }} />
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
                    {creditScore >= 800 ? 'Alama Bora!' : creditScore >= 600 ? 'Maendeleo Mazuri' : 'Endelea Kujenga'}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>{Math.round((creditScore / 1000) * 100)}%</span>
                </div>
                <div className="h-3.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <div className="h-full rounded-full" style={{ width: `${(creditScore / 1000) * 100}%`, background: 'linear-gradient(90deg, #fbbf24, #86efac, #34d399)' }} />
                </div>
              </div>

              <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-xl" style={{ background: 'rgba(251,191,36,0.3)' }}>
                    <Sparkles className="size-4 text-yellow-300" />
                  </div>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
                    {creditScore < 800
                      ? `Lipa kwa wakati ili kufungua hadi ${formatCurrency(loanLimit * 2)} na riba ndogo!`
                      : 'Kikomo cha juu kimefunguliwa! Dumisha historia nzuri ya malipo kwa faida za VIP.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Active Loans */}
          {activeLoans.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Mikopo Hai</h3>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Mikopo inayoendelea ({activeLoans.length})</p>
                </div>
                <button className="flex items-center gap-1" style={{ fontSize: '13px', fontWeight: 700, color: '#4ade80' }}>
                  Ona Yote <ChevronRight className="size-4" />
                </button>
              </div>

              <div className="space-y-3">
                {activeLoans.slice(0, 2).map(loan => (
                  <div key={loan.id} className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{loan.purpose}</p>
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={statusStyle(loan.status)}>
                            {statusLabel(loan.status)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                          <Calendar className="size-3" />
                          <span>Mwisho: {loan.dueDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="rounded-xl p-2.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '3px' }}>Uliokopa</p>
                        <p style={{ fontSize: '12px', fontWeight: 800, color: '#fff' }}>{formatCurrency(loan.amount)}</p>
                      </div>
                      <div className="rounded-xl p-2.5" style={{ background: 'rgba(22,163,74,0.1)' }}>
                        <p style={{ fontSize: '10px', color: '#4ade80', marginBottom: '3px' }}>Umelipa</p>
                        <p style={{ fontSize: '12px', fontWeight: 800, color: '#4ade80' }}>{formatCurrency(loan.paid)}</p>
                      </div>
                      <div className="rounded-xl p-2.5" style={{ background: 'rgba(249,115,22,0.1)' }}>
                        <p style={{ fontSize: '10px', color: '#fb923c', marginBottom: '3px' }}>Iliyobaki</p>
                        <p style={{ fontSize: '12px', fontWeight: 800, color: '#fb923c' }}>{formatCurrency(loan.totalDue - loan.paid)}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1.5">
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Maendeleo ya malipo</span>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#4ade80' }}>{Math.round((loan.paid / loan.totalDue) * 100)}%</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div className="h-full rounded-full" style={{ width: `${(loan.paid / loan.totalDue) * 100}%`, background: 'linear-gradient(90deg, #16a34a, #4ade80)' }} />
                      </div>
                    </div>

                    <button className="w-full h-11 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                      style={{ background: '#16a34a', color: '#fff' }}>
                      <DollarSign className="size-4" />
                      Lipa {formatCurrency(loan.totalDue - loan.paid)}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeLoans.length === 0 && (
            <div className="rounded-2xl p-7 text-center" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.12)' }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>
                <CheckCircle className="size-8 text-white" />
              </div>
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>Hakuna Mkopo Hai</p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px' }}>Huna mikopo inayoendelea</p>
              <span className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}>
                Hitaji pesa haraka? Omba mkopo hapa chini
              </span>
            </div>
          )}

          {/* Loan Categories */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Chagua Aina ya Mkopo</h3>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Mikopo ya haraka kwa...</p>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.2)' }}>
                <Zap className="size-3" style={{ color: '#4ade80' }} />
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#4ade80' }}>Haraka</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {loanCategories.map(cat => {
                const Icon = cat.icon;
                return (
                  <button key={cat.id} onClick={() => { setLoanPurpose(cat.id); setView('apply'); }} className="text-left">
                    <div className={`bg-gradient-to-br ${cat.color} rounded-2xl p-5 text-white transition-all active:scale-[0.97] relative overflow-hidden`}>
                      <div className="absolute top-0 right-0 w-20 h-20 rounded-full -mr-10 -mt-10 blur-xl" style={{ background: 'rgba(255,255,255,0.1)' }} />
                      <div className="relative z-10">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}>
                          <Icon className="size-6" />
                        </div>
                        <p style={{ fontSize: '14px', fontWeight: 800, marginBottom: '4px' }}>{cat.label}</p>
                        <div className="flex items-center gap-1 mb-2.5">
                          <Zap className="size-3 opacity-80" />
                          <span style={{ fontSize: '10px', opacity: 0.9 }}>Idhini ya papo hapo</span>
                        </div>
                        <div className="rounded-lg px-2.5 py-1.5" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
                          <p style={{ fontSize: '11px', fontWeight: 700 }}>Hadi {formatCurrency(loanLimit)}</p>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Benefits */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="size-5" style={{ color: '#f59e0b' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Kwa Nini goPay?</h3>
            </div>
            <div className="space-y-3">
              {[
                { bg: 'rgba(22,163,74,0.08)', border: 'rgba(22,163,74,0.15)', gradient: 'linear-gradient(135deg,#16a34a,#15803d)', icon: Zap, title: 'Pesa Moja Kwa Moja', body: 'Kutumwa papo hapo • Pesa kwenye pochi yako kwa sekunde', color: '#4ade80' },
                { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.15)', gradient: 'linear-gradient(135deg,#3b82f6,#06b6d4)', icon: Clock, title: 'Malipo Rahisi', body: 'Malipo ya kubadilika • Siku 30 kulipa, hakuna ada zilizofichwa', color: '#60a5fa' },
                { bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.15)', gradient: 'linear-gradient(135deg,#8b5cf6,#ec4899)', icon: TrendingUp, title: 'Jenga Alama', body: 'Ongeza alama ya mkopo • Panda kikomo na malipo ya wakati', color: '#c4b5fd' },
                { bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.15)', gradient: 'linear-gradient(135deg,#f97316,#dc2626)', icon: Shield, title: 'Usalama Kamili', body: '100% salama • Ilisajiliwa na Benki ya Tanzania', color: '#fb923c' },
              ].map((b, i) => {
                const Icon = b.icon;
                return (
                  <div key={i} className="rounded-2xl p-4" style={{ background: b.bg, border: `1px solid ${b.border}` }}>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: b.gradient }}>
                        <Icon className="size-6 text-white" />
                      </div>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '3px' }}>{b.title}</p>
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{b.body}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interest Transparency */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <Info className="size-5 text-white" />
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>Masharti Wazi • Hakuna Mshangao</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Riba ya 15% • Hakuna ada zilizofichwa</p>
              </div>
            </div>
            <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '3px' }}>Kiwango cha Riba</p>
                  <p style={{ fontSize: '28px', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>15%</p>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>kwa mwezi</p>
                </div>
                <div>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '3px' }}>Muda wa Kulipa</p>
                  <p style={{ fontSize: '28px', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>30</p>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>siku za juu</p>
                </div>
              </div>
            </div>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', textAlign: 'center', marginTop: '10px' }}>
              Mfano: Kopa {formatCurrency(100000)} → Lipa {formatCurrency(115000)}
            </p>
          </div>

          <button onClick={() => setView('apply')}
            className="w-full h-14 rounded-2xl text-base font-black flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', color: '#fff' }}>
            <DollarSign className="size-5" />
            Omba Mkopo Sasa • Apply for Loan
          </button>
        </div>
      </div>
    );
  }

  // ── APPLY VIEW ──
  if (view === 'apply') {
    const purposeLabel = loanCategories.find(c => c.id === loanPurpose)?.label || 'Mkopo wa Jumla';
    const amount = parseFloat(loanAmount) || 0;
    const terms = calculateLoanTerms(amount, loanPurpose);

    return (
      <div className="min-h-screen pb-20" style={{ background: '#080d08' }}>
        <div className="sticky top-0 z-20 px-4 py-4" style={{ background: 'rgba(8,13,8,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setView('home')} className="p-2.5 rounded-full active:scale-95" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <ArrowLeft className="size-5 text-white" />
            </button>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>Omba Mkopo</h1>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{purposeLabel}</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-5 space-y-4">
          <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '8px' }}>
              Unahitaji kiasi gani?
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>TZS</span>
              <input
                type="number"
                placeholder="0"
                value={loanAmount}
                onChange={e => setLoanAmount(e.target.value)}
                className="w-full h-14 pl-14 pr-4 rounded-xl border-0 focus:outline-none text-2xl font-bold text-white text-center"
                style={{ background: 'rgba(255,255,255,0.06)', caretColor: '#4ade80' }}
              />
            </div>
            <div className="flex justify-between mt-2" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>
              <span>Kiwango cha chini: {formatCurrency(5000)}</span>
              <span>Kiwango cha juu: {formatCurrency(loanLimit)}</span>
            </div>
            {amount > loanLimit && (
              <div className="mt-2 flex gap-2 rounded-xl p-3" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
                <AlertCircle className="size-4 flex-shrink-0" style={{ color: '#f87171' }} />
                <p style={{ fontSize: '12px', color: '#f87171' }}>Kiasi kinazidi kikomo chako cha mkopo</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[10000, 25000, 50000, 100000].map(amt => (
              <button key={amt} onClick={() => setLoanAmount(amt.toString())}
                className="rounded-xl p-2.5 text-xs font-bold transition-all active:scale-95"
                style={{
                  background: loanAmount === amt.toString() ? 'rgba(22,163,74,0.2)' : 'rgba(255,255,255,0.05)',
                  border: loanAmount === amt.toString() ? '1.5px solid #16a34a' : '1px solid rgba(255,255,255,0.08)',
                  color: loanAmount === amt.toString() ? '#4ade80' : 'rgba(255,255,255,0.6)',
                }}>
                {formatCurrency(amt)}
              </button>
            ))}
          </div>

          {amount >= 5000 && amount <= loanLimit && (
            <>
              <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #14532d 0%, #052e16 100%)', border: '1px solid rgba(74,222,128,0.15)' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>Masharti ya Mkopo</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Kiasi cha Mkopo:', value: formatCurrency(terms.principal), size: '16px', bold: false },
                    { label: `Riba (${((terms.interest / terms.principal) * 100).toFixed(0)}%):`, value: formatCurrency(terms.interest), size: '14px', bold: false },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between">
                      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{row.label}</span>
                      <span style={{ fontSize: row.size, fontWeight: 700, color: '#fff' }}>{row.value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Jumla ya Kulipa:</span>
                    <span style={{ fontSize: '22px', fontWeight: 900, color: '#4ade80', letterSpacing: '-0.5px' }}>{formatCurrency(terms.total)}</span>
                  </div>
                  <div className="flex items-center gap-2" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                    <Calendar className="size-3.5" />
                    <span>Lipa ndani ya siku 30</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-4" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.12)' }}>
                <div className="flex gap-3">
                  <Info className="size-5 flex-shrink-0 mt-0.5" style={{ color: '#60a5fa' }} />
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>Jinsi inavyofanya kazi:</p>
                    <ul className="space-y-1">
                      {['Pesa inaongezwa moja kwa moja kwenye pochi yako ya goPay', 'Inakatwa kiotomatiki kutoka malipo yako ya pochi inayofuata', 'Hakuna ada zilizofichwa au adhabu', 'Jenga alama ya mkopo kwa malipo ya wakati'].map((item, i) => (
                        <li key={i} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '8px' }}>
                  Ingiza PIN Kuthibitisha
                </label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="••••"
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  className="w-full h-14 text-center text-2xl tracking-widest rounded-xl border-0 focus:outline-none text-white"
                  style={{ background: 'rgba(255,255,255,0.06)', caretColor: '#4ade80', letterSpacing: '0.5rem' }}
                />
              </div>

              <button
                onClick={() => {
                  setSelectedOffer({ id: Date.now().toString(), amount: terms.principal, duration: '30 days', interest: terms.interest, totalRepayment: terms.total, purpose: purposeLabel, icon: Bus });
                  handleApplyLoan();
                }}
                disabled={processing || pin.length !== 4}
                className="w-full h-14 rounded-2xl text-base font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', color: '#fff' }}>
                {processing ? 'Inachakata...' : `Pata ${formatCurrency(terms.principal)} Sasa`}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── SUCCESS VIEW ──
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#080d08' }}>
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
            <CheckCircle className="size-10 text-white" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>Mkopo Umeidhinishwa!</h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Pesa imeongezwa kwenye pochi yako</p>
        </div>

        <div className="rounded-3xl p-6 mb-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="rounded-2xl p-5 mb-4" style={{ background: 'linear-gradient(135deg, #14532d, #052e16)', border: '1px solid rgba(74,222,128,0.15)' }}>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Kiasi cha Mkopo</p>
            <p style={{ fontSize: '32px', fontWeight: 900, color: '#fff', letterSpacing: '-1.5px' }}>
              {selectedOffer && formatCurrency(selectedOffer.amount)}
            </p>
          </div>

          {selectedOffer && (
            <div className="space-y-3">
              {[
                { label: 'Madhumuni:', value: selectedOffer.purpose },
                { label: 'Muda:', value: selectedOffer.duration },
                { label: 'Riba:', value: formatCurrency(selectedOffer.interest) },
              ].map((row, i) => (
                <div key={i} className="flex justify-between py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>{row.label}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{row.value}</span>
                </div>
              ))}
              <div className="flex justify-between py-2">
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Jumla ya Kulipa:</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#4ade80' }}>{formatCurrency(selectedOffer.totalRepayment)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl p-4 mb-5" style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.15)' }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#4ade80', marginBottom: '3px' }}>✓ Imetumwa kwenye pochi</p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Malipo yatakatwa kiotomatiki kutoka malipo yako ya pochi inayofuata</p>
        </div>

        <button
          onClick={() => { setView('home'); setPin(''); setLoanAmount(''); }}
          className="w-full h-12 rounded-2xl font-bold transition-all active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', color: '#fff', fontSize: '15px' }}>
          Imekamilika
        </button>
      </div>
    </div>
  );
}
