import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { User } from '../App';
import { 
  ArrowLeft, Zap, TrendingUp, CheckCircle, Clock, 
  AlertCircle, DollarSign, Bus, Home, Book, Phone,
  Calendar, Shield, Award, Info, ChevronRight, Sparkles
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';

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

export function MicroLoansPage({ user, accessToken, onBack }: MicroLoansPageProps) {
  const [view, setView] = useState<'home' | 'apply' | 'details' | 'success'>('home');
  const [loanPurpose, setLoanPurpose] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [selectedOffer, setSelectedOffer] = useState<LoanOffer | null>(null);
  const [pin, setPin] = useState('');
  const [processing, setProcessing] = useState(false);
  const [creditScore, setCreditScore] = useState(750); // Out of 1000
  const [loanLimit, setLoanLimit] = useState(500000);

  // Active loans
  const [activeLoans, setActiveLoans] = useState<ActiveLoan[]>([
    {
      id: '1',
      amount: 50000,
      purpose: 'Bus Ticket to Arusha',
      disbursedDate: '2025-11-15',
      dueDate: '2025-12-15',
      totalDue: 52500,
      paid: 20000,
      status: 'active',
    },
  ]);

  const loanCategories = [
    { id: 'transport', label: 'Transport', icon: Bus, color: 'from-blue-500 to-cyan-500' },
    { id: 'bills', label: 'Bills & Utilities', icon: Home, color: 'from-orange-500 to-red-500' },
    { id: 'education', label: 'School Fees', icon: Book, color: 'from-purple-500 to-pink-500' },
    { id: 'airtime', label: 'Airtime & Data', icon: Phone, color: 'from-green-500 to-emerald-500' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateLoanTerms = (amount: number, purpose: string) => {
    let interestRate = 0.05; // 5% default
    
    if (purpose === 'transport') interestRate = 0.03; // 3% for transport
    if (purpose === 'education') interestRate = 0.04; // 4% for education
    if (purpose === 'bills') interestRate = 0.05;
    if (purpose === 'airtime') interestRate = 0.02; // 2% for airtime

    return {
      principal: amount,
      interest: amount * interestRate,
      total: amount * (1 + interestRate),
    };
  };

  const handleApplyLoan = async () => {
    if (!selectedOffer || pin.length !== 4) {
      toast.error('Please complete all fields');
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/loans/apply`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: selectedOffer.amount,
            purpose: selectedOffer.purpose,
            duration: selectedOffer.duration,
            pin,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const newLoan: ActiveLoan = {
          id: Date.now().toString(),
          amount: selectedOffer.amount,
          purpose: selectedOffer.purpose,
          disbursedDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          totalDue: selectedOffer.totalRepayment,
          paid: 0,
          status: 'active',
        };
        setActiveLoans([...activeLoans, newLoan]);
        setView('success');
        setPin('');
      } else {
        toast.error(data.error || 'Loan application failed');
      }
    } catch (error) {
      console.error('Error applying for loan:', error);
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Home View
  if (view === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-50">
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <ArrowLeft className="size-6 text-gray-900" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-extrabold text-gray-900" style={{ color: '#111827' }}>goPay Loans</h1>
              <p className="text-sm text-gray-600">Instant micro-credit</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* CREDIT SCORE CARD - Enhanced (Branch/Tala Pattern) */}
          <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 rounded-[32px] p-8 text-white overflow-hidden shadow-2xl border border-green-400/20">
            {/* Animated Background Orbs - goPay Green */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-400/30 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-300/20 rounded-full -ml-24 -mb-24 blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>
            
            <div className="relative z-10">
              {/* Header with goPay Branding */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-2.5 rounded-2xl shadow-lg">
                    <Award className="size-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-green-100 font-bold mb-0.5 tracking-wide">ALAMA YA MKOPO</p>
                    <p className="text-sm text-white/90 font-semibold">Credit Score</p>
                  </div>
                </div>
                <button 
                  onClick={() => setView('score-info')}
                  className="bg-white/15 backdrop-blur-xl rounded-full p-2.5 hover:bg-white/25 transition-all border border-white/30 shadow-lg hover:scale-110 active:scale-95"
                >
                  <Info className="size-4 text-white" />
                </button>
              </div>

              {/* Score Display - Creative Layout */}
              <div className="flex items-stretch gap-4 mb-6">
                {/* Main Score */}
                <div className="flex-1 bg-white/10 backdrop-blur-xl rounded-[24px] p-5 border border-white/20 shadow-xl relative overflow-hidden">
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_ease-in-out_infinite]"></div>
                  
                  <div className="relative z-10 flex items-center gap-4">
                    {/* Circular Progress Indicator */}
                    <div className="relative">
                      <svg className="size-20 -rotate-90">
                        <circle
                          cx="40"
                          cy="40"
                          r="34"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="6"
                          fill="none"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="34"
                          stroke="url(#greenGradient)"
                          strokeWidth="6"
                          fill="none"
                          strokeDasharray={`${(creditScore / 1000) * 213} 213`}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                          <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FBBF24" />
                            <stop offset="100%" stopColor="#34D399" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Zap className="size-8 text-yellow-300 animate-pulse" />
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-5xl font-black tracking-tight leading-none text-white mb-1 drop-shadow-lg">{creditScore}</p>
                      <p className="text-xs text-green-200 font-bold">/ 1000 points</p>
                      <div className="mt-2 inline-flex items-center gap-1 bg-green-400/20 px-2 py-1 rounded-full">
                        <TrendingUp className="size-3 text-green-200" />
                        <span className="text-[10px] text-green-100 font-bold">
                          {creditScore >= 800 ? 'EXCELLENT' : creditScore >= 600 ? 'GOOD' : 'BUILDING'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Loan Limit Pill - Redesigned */}
                <div className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-[24px] px-4 py-4 shadow-2xl min-w-[140px] flex flex-col justify-center border-2 border-yellow-300/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-1 mb-1">
                      <DollarSign className="size-3 text-amber-900" />
                      <p className="text-[10px] text-amber-900 font-black tracking-wide">LOAN LIMIT</p>
                    </div>
                    <p className="text-xs text-amber-800 font-semibold mb-1">Kikomo cha Mkopo</p>
                    <p className="text-2xl font-black leading-none text-amber-950">{formatCurrency(loanLimit)}</p>
                  </div>
                  {/* Sparkle effect */}
                  <div className="absolute top-2 right-2">
                    <Sparkles className="size-4 text-yellow-200 animate-pulse" />
                  </div>
                </div>
              </div>
              
              {/* Progress Bar - Modern Design */}
              <div className="mb-5">
                <div className="flex items-center justify-between text-xs mb-2.5">
                  <span className="text-white font-bold flex items-center gap-1.5">
                    {creditScore >= 800 ? (
                      <>🌟 Excellent Score!</>
                    ) : creditScore >= 600 ? (
                      <>👍 Good Progress</>
                    ) : (
                      <>💪 Keep Building</>
                    )}
                  </span>
                  <span className="text-green-200 font-black text-sm">{Math.round((creditScore / 1000) * 100)}%</span>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-full h-4 overflow-hidden border-2 border-white/30 shadow-inner">
                  <div
                    className="bg-gradient-to-r from-yellow-400 via-green-300 to-emerald-400 h-full transition-all duration-1000 ease-out shadow-lg relative"
                    style={{ width: `${(creditScore / 1000) * 100}%` }}
                  >
                    {/* Animated shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-[shimmer_2s_ease-in-out_infinite]"></div>
                  </div>
                </div>
              </div>
              
              {/* Tips Section - Enhanced */}
              <div className="bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/30 shadow-xl">
                <div className="flex items-start gap-3">
                  <div className="bg-yellow-400 p-2 rounded-xl flex-shrink-0 shadow-lg">
                    <Sparkles className="size-4 text-amber-900" />
                  </div>
                  <div>
                    <p className="text-xs text-white font-bold mb-1">💡 Pro Tip</p>
                    <p className="text-xs text-green-50 leading-relaxed">
                      {creditScore < 800 
                        ? `Pay on time to unlock up to ${formatCurrency(loanLimit * 2)} loan limit and enjoy lower interest rates!` 
                        : 'Maximum limit unlocked! Maintain excellent payment history for VIP benefits 🎉'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIVE LOANS - Enhanced (Tala/Branch Pattern) */}
          {activeLoans.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-black text-gray-900 mb-0.5">Mikopo Hai</h3>
                  <p className="text-sm text-gray-700 font-medium">Active loans ({activeLoans.length})</p>
                </div>
                <button 
                  onClick={() => setView('all-loans')}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="size-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                {activeLoans.slice(0, 2).map((loan) => (
                  <div key={loan.id} className="bg-white border-2 border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-base font-bold text-gray-900">{loan.purpose}</p>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                            loan.status === 'active' ? 'bg-blue-100 text-blue-700' :
                            loan.status === 'paid' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {loan.status === 'active' ? 'Active' : loan.status === 'paid' ? 'Paid' : 'Overdue'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-700">
                          <Calendar className="size-3.5" />
                          <span className="font-semibold">Due: {loan.dueDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Amounts */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-700 font-medium mb-1">Borrowed</p>
                        <p className="text-sm font-black text-gray-900">{formatCurrency(loan.amount)}</p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-3">
                        <p className="text-xs text-green-700 font-medium mb-1">Paid</p>
                        <p className="text-sm font-black text-green-700">{formatCurrency(loan.paid)}</p>
                      </div>
                      <div className="bg-orange-50 rounded-xl p-3">
                        <p className="text-xs text-orange-700 font-medium mb-1">Due</p>
                        <p className="text-sm font-black text-orange-700">{formatCurrency(loan.totalDue - loan.paid)}</p>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-700 font-semibold">Payment progress</span>
                        <span className="text-emerald-700 font-black">{Math.round((loan.paid / loan.totalDue) * 100)}%</span>
                      </div>
                      <div className="bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full transition-all duration-500"
                          style={{ width: `${(loan.paid / loan.totalDue) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <button 
                      onClick={() => setView('repay')}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <DollarSign className="size-4" />
                      Pay {formatCurrency(loan.totalDue - loan.paid)}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NO ACTIVE LOANS - Motivational Empty State */}
          {activeLoans.length === 0 && (
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6 text-center">
              <div className="size-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircle className="size-8 text-white" />
              </div>
              <p className="text-base font-bold text-gray-900 mb-2">Hakuna Mkopo Hai</p>
              <p className="text-sm text-gray-700 mb-4">No active loans • You're debt-free!</p>
              <p className="text-xs text-blue-700 font-semibold bg-blue-100 inline-block px-3 py-1.5 rounded-lg">
                Need quick cash? Apply for a loan below
              </p>
            </div>
          )}

          {/* LOAN CATEGORIES - Enhanced (Carbon/Branch Pattern) */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-gray-900 mb-0.5">Chagua Aina ya Mkopo</h3>
                <p className="text-sm text-gray-700 font-medium">Quick loans for...</p>
              </div>
              <div className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-bold">
                <Zap className="size-3" />
                <span>Instant</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {loanCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      setLoanPurpose(category.id);
                      setView('apply');
                    }}
                    className="text-left group"
                  >
                    <div className={`bg-gradient-to-br ${category.color} rounded-2xl p-5 text-white hover:shadow-xl transition-all active:scale-[0.98] relative overflow-hidden`}>
                      {/* Decorative element */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                      
                      <div className="relative z-10">
                        <div className="size-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-white/30">
                          <Icon className="size-6" />
                        </div>
                        <p className="font-black text-base mb-1 text-[rgb(249,251,255)]">{category.label}</p>
                        <div className="flex items-center gap-1.5 text-xs text-white/90 mb-3">
                          <Zap className="size-3" />
                          <span className="font-semibold">Instant approval</span>
                        </div>
                        <div className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                          <p className="text-xs font-bold text-[rgb(246,249,255)]">Up to {formatCurrency(loanLimit)}</p>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* BENEFITS - Enhanced (Trust Signals) */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="size-5 text-amber-500" />
              <h3 className="text-lg font-black text-gray-900">Kwa Nini goPay?</h3>
            </div>
            
            <div className="space-y-3">
              {/* Benefit 1 */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4">
                <div className="flex gap-4">
                  <div className="size-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <Zap className="size-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900 mb-1">Pesa Moja Kwa Moja</p>
                    <p className="text-xs text-gray-700 font-medium leading-relaxed">
                      Instant disbursement • Money in your wallet within seconds
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-4">
                <div className="flex gap-4">
                  <div className="size-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <Clock className="size-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900 mb-1">Malipo Rahisi</p>
                    <p className="text-xs text-gray-700 font-medium leading-relaxed">
                      Flexible repayment • 30 days to pay, no hidden fees
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-4">
                <div className="flex gap-4">
                  <div className="size-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <TrendingUp className="size-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900 mb-1">Jenga Alama</p>
                    <p className="text-xs text-gray-700 font-medium leading-relaxed">
                      Build credit score • Increase limits with on-time payments
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefit 4 */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-4">
                <div className="flex gap-4">
                  <div className="size-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <Shield className="size-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900 mb-1">Usalama Kamili</p>
                    <p className="text-xs text-gray-700 font-medium leading-relaxed">
                      100% secure • Licensed by Bank of Tanzania
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* INTEREST RATE TRANSPARENCY (New - Trust Signal) */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 rounded-2xl p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="size-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center flex-shrink-0">
                <Info className="size-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 mb-1">Clear Terms • No Surprises</p>
                <p className="text-xs text-gray-700 font-medium leading-relaxed">
                  15% interest rate • No hidden charges • Full transparency
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <p className="text-xs text-gray-700 font-medium mb-1">Interest Rate</p>
                  <p className="text-2xl font-black text-gray-900">15%</p>
                  <p className="text-xs text-gray-600 font-semibold">per month</p>
                </div>
                <div>
                  <p className="text-xs text-gray-700 font-medium mb-1">Repayment</p>
                  <p className="text-2xl font-black text-gray-900">30</p>
                  <p className="text-xs text-gray-600 font-semibold">days max</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-600 text-center mt-3 font-medium">
              Example: Borrow {formatCurrency(100000)} → Pay back {formatCurrency(115000)}
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => setView('apply')}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 rounded-2xl text-base font-black transition-all shadow-lg hover:shadow-xl active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <DollarSign className="size-5" />
            Omba Mkopo Sasa • Apply for Loan
          </button>
        </div>
      </div>
    );
  }

  // Apply View
  if (view === 'apply') {
    const purposeLabel = loanCategories.find(c => c.id === loanPurpose)?.label || 'General';
    const amount = parseFloat(loanAmount) || 0;
    const terms = calculateLoanTerms(amount, loanPurpose);

    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('home')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold">Apply for Loan</h1>
              <p className="text-sm text-gray-500">{purposeLabel}</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Loan Amount */}
          <div className="bg-white rounded-2xl p-6">
            <label className="block font-bold mb-2">How much do you need?</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="number"
                placeholder="10000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="w-full h-14 pl-12 pr-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none text-lg font-semibold"
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Min: {formatCurrency(5000)}</span>
              <span>Max: {formatCurrency(loanLimit)}</span>
            </div>
            {amount > loanLimit && (
              <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
                <AlertCircle className="size-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">Amount exceeds your loan limit</p>
              </div>
            )}
          </div>

          {/* Quick Amount Selection */}
          <div className="grid grid-cols-4 gap-2">
            {[10000, 25000, 50000, 100000].map((amt) => (
              <button
                key={amt}
                onClick={() => setLoanAmount(amt.toString())}
                className="bg-white border-2 border-gray-200 hover:border-indigo-500 rounded-xl p-3 text-sm font-semibold transition-all"
              >
                {formatCurrency(amt)}
              </button>
            ))}
          </div>

          {/* Loan Terms Preview */}
          {amount >= 5000 && amount <= loanLimit && (
            <>
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-6 text-white">
                <h3 className="font-bold mb-4">Loan Terms</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/80">Loan Amount:</span>
                    <span className="font-bold text-lg">{formatCurrency(terms.principal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Interest ({((terms.interest / terms.principal) * 100).toFixed(0)}%):</span>
                    <span className="font-semibold">{formatCurrency(terms.interest)}</span>
                  </div>
                  <div className="border-t border-white/20 pt-3 flex justify-between">
                    <span className="font-bold">Total Repayment:</span>
                    <span className="font-bold text-2xl">{formatCurrency(terms.total)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <Calendar className="size-4" />
                    <span>Repay in 30 days</span>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <div className="flex gap-3">
                  <Info className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">How it works:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Money instantly added to your goPay wallet</li>
                      <li>Auto-deduct from next top-up</li>
                      <li>No hidden fees or penalties</li>
                      <li>Build credit score with on-time payment</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* PIN Entry */}
              <div className="bg-white rounded-2xl p-4">
                <label className="block font-bold mb-2">Enter PIN to Confirm</label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="4-digit PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full h-14 text-center text-2xl tracking-widest border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Submit */}
              <Button
                onClick={() => {
                  setSelectedOffer({
                    id: Date.now().toString(),
                    amount: terms.principal,
                    duration: '30 days',
                    interest: terms.interest,
                    totalRepayment: terms.total,
                    purpose: purposeLabel,
                    icon: Bus,
                  });
                  handleApplyLoan();
                }}
                disabled={processing || pin.length !== 4}
                className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full font-bold text-lg disabled:opacity-50"
              >
                {processing ? 'Processing...' : `Get ${formatCurrency(terms.principal)} Now`}
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Success View
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="size-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Loan Approved! ⚡</h1>
          <p className="text-gray-600">Money added to your wallet</p>
        </div>

        <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-4 text-white mb-4">
            <p className="text-sm text-white/80 mb-1">Loan Amount</p>
            <p className="text-3xl font-bold">{selectedOffer && formatCurrency(selectedOffer.amount)}</p>
          </div>

          {selectedOffer && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Purpose:</span>
                <span className="font-semibold">{selectedOffer.purpose}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-semibold">{selectedOffer.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Interest:</span>
                <span className="font-semibold">{formatCurrency(selectedOffer.interest)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="font-bold">Total to Repay:</span>
                <span className="font-bold text-indigo-600">{formatCurrency(selectedOffer.totalRepayment)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-green-100 border border-green-200 rounded-2xl p-4 mb-6">
          <p className="text-sm font-semibold text-green-900 mb-1">✅ Disbursed to wallet</p>
          <p className="text-xs text-green-800">
            Repayment will auto-deduct from your next wallet top-up
          </p>
        </div>

        <Button
          onClick={() => {
            setView('home');
            setPin('');
            setLoanAmount('');
          }}
          className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full font-bold"
        >
          Done
        </Button>
      </div>
    </div>
  );
}