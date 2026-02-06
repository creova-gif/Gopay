import { useState } from 'react';
import { ArrowLeft, TrendingUp, Award, CheckCircle, Lock, CreditCard, DollarSign, Calendar, Users, BarChart3, AlertCircle, ExternalLink, Info, Sparkles, Trophy, Star, Zap, Shield } from 'lucide-react';
import { Button } from './ui/button';

interface AlternativeCreditScoreProps {
  user: any;
  onBack: () => void;
}

interface CreditFactor {
  id: string;
  name: string;
  description: string;
  score: number;
  maxScore: number;
  weight: number;
  status: 'excellent' | 'good' | 'fair' | 'needs_improvement';
  tips: string[];
  gradient: string;
  icon: any;
}

const CREDIT_FACTORS: CreditFactor[] = [
  {
    id: 'payment-consistency',
    name: 'Payment Consistency',
    description: 'How regularly you pay your bills on time',
    score: 92,
    maxScore: 100,
    weight: 30,
    status: 'excellent',
    tips: [
      'You\'ve paid bills on time for 11 consecutive months! 🎉',
      'Keep up your streak to maintain this excellent score'
    ],
    gradient: 'from-green-500 to-emerald-600',
    icon: CheckCircle
  },
  {
    id: 'transaction-diversity',
    name: 'Transaction Diversity',
    description: 'Variety of merchants and services you use',
    score: 78,
    maxScore: 100,
    weight: 15,
    status: 'good',
    tips: [
      'You use 18 different merchant categories',
      'Try using GO Pay for more everyday purchases to improve'
    ],
    gradient: 'from-blue-500 to-cyan-600',
    icon: BarChart3
  },
  {
    id: 'savings-behavior',
    name: 'Savings Behavior',
    description: 'Your ability to maintain and grow savings',
    score: 85,
    maxScore: 100,
    weight: 20,
    status: 'excellent',
    tips: [
      'Average balance: TZS 156,000 - Great job! 💰',
      'Savings increased by 15% this quarter'
    ],
    gradient: 'from-purple-500 to-pink-600',
    icon: DollarSign
  },
  {
    id: 'peer-transactions',
    name: 'Social Trust',
    description: 'P2P transactions with established users',
    score: 70,
    maxScore: 100,
    weight: 10,
    status: 'good',
    tips: [
      'Active in 5 community savings pools',
      'Regular transactions with 23 trusted contacts'
    ],
    gradient: 'from-orange-500 to-red-600',
    icon: Users
  },
  {
    id: 'account-age',
    name: 'Account History',
    description: 'Length of time with GO Pay',
    score: 65,
    maxScore: 100,
    weight: 10,
    status: 'fair',
    tips: [
      'Account age: 8 months',
      'Score automatically increases over time'
    ],
    gradient: 'from-indigo-500 to-purple-600',
    icon: Calendar
  },
  {
    id: 'income-signals',
    name: 'Income Stability',
    description: 'Regular incoming funds and employment signals',
    score: 88,
    maxScore: 100,
    weight: 15,
    status: 'excellent',
    tips: [
      'Regular salary deposits detected ✓',
      'Consistent monthly income pattern'
    ],
    gradient: 'from-teal-500 to-green-600',
    icon: TrendingUp
  }
];

export function AlternativeCreditScore({ user, onBack }: AlternativeCreditScoreProps) {
  const [selectedFactor, setSelectedFactor] = useState<CreditFactor | null>(null);
  const [showLoanOffers, setShowLoanOffers] = useState(false);

  const overallScore = Math.round(
    CREDIT_FACTORS.reduce((sum, factor) => 
      sum + (factor.score * factor.weight / 100), 0
    )
  );

  const getScoreCategory = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'from-green-500 to-emerald-600', bg: 'from-green-50 to-emerald-50' };
    if (score >= 65) return { label: 'Good', color: 'from-blue-500 to-cyan-600', bg: 'from-blue-50 to-cyan-50' };
    if (score >= 50) return { label: 'Fair', color: 'from-yellow-500 to-orange-600', bg: 'from-yellow-50 to-orange-50' };
    return { label: 'Needs Work', color: 'from-red-500 to-pink-600', bg: 'from-red-50 to-pink-50' };
  };

  const scoreCategory = getScoreCategory(overallScore);
  const maxLoanAmount = overallScore >= 80 ? 5000000 : 
                       overallScore >= 65 ? 3000000 :
                       overallScore >= 50 ? 1500000 : 500000;

  if (showLoanOffers) {
    const loanOffers = [
      {
        id: 'loan-1',
        provider: 'GO Pay Micro-Loans',
        logo: '💚',
        amount: maxLoanAmount,
        interest: 8,
        term: 6,
        monthly: Math.round(maxLoanAmount * 1.08 / 6),
        approved: true,
        gradient: 'from-green-500 to-emerald-600'
      },
      {
        id: 'loan-2',
        provider: 'CRDB Bank',
        logo: '🏦',
        amount: maxLoanAmount * 1.5,
        interest: 12,
        term: 12,
        monthly: Math.round(maxLoanAmount * 1.5 * 1.12 / 12),
        approved: overallScore >= 70,
        gradient: 'from-blue-500 to-cyan-600'
      },
      {
        id: 'loan-3',
        provider: 'NMB Bank',
        logo: '💼',
        amount: maxLoanAmount * 2,
        interest: 15,
        term: 24,
        monthly: Math.round(maxLoanAmount * 2 * 1.15 / 24),
        approved: overallScore >= 75,
        gradient: 'from-purple-500 to-pink-600'
      }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
          
          <div className="relative text-white p-6 pb-8">
            <div className="flex items-center justify-between mb-2">
              <button onClick={() => setShowLoanOffers(false)} className="p-2 hover:bg-white/20 rounded-full transition-all">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="w-10" />
            </div>
            <h1 className="text-2xl font-bold mb-1">Loan Offers</h1>
            <p className="text-green-100">Based on your score of {overallScore}</p>
          </div>
        </div>

        <div className="px-6 -mt-4 pb-8 space-y-4">
          {loanOffers.map(loan => (
            <div key={loan.id}>
              <div className={`bg-gradient-to-r ${loan.gradient} rounded-3xl p-1 shadow-xl ${loan.approved ? 'shadow-green-200' : 'opacity-60'}`}>
                <div className="bg-white rounded-[22px] p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{loan.logo}</div>
                      <div>
                        <h3 className="font-bold text-lg">{loan.provider}</h3>
                        <p className="text-sm text-gray-600">
                          {loan.interest}% APR • {loan.term} months
                        </p>
                      </div>
                    </div>
                    {loan.approved ? (
                      <div className={`px-4 py-2 bg-gradient-to-r ${loan.gradient} text-white rounded-full text-xs font-bold shadow-lg`}>
                        PRE-APPROVED
                      </div>
                    ) : (
                      <div className="px-4 py-2 bg-gray-200 text-gray-600 rounded-full text-xs font-medium">
                        Not Eligible
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className={`bg-gradient-to-br ${loan.approved ? scoreCategory.bg : 'from-gray-50 to-gray-100'} rounded-2xl p-4`}>
                      <div className="text-xs text-gray-600 mb-1">Loan Amount</div>
                      <div className="text-2xl font-bold text-gray-900">
                        TZS {(loan.amount / 1000000).toFixed(1)}M
                      </div>
                    </div>
                    <div className={`bg-gradient-to-br ${loan.approved ? scoreCategory.bg : 'from-gray-50 to-gray-100'} rounded-2xl p-4`}>
                      <div className="text-xs text-gray-600 mb-1">Per Month</div>
                      <div className="text-2xl font-bold text-gray-900">
                        TZS {(loan.monthly / 1000).toFixed(0)}K
                      </div>
                    </div>
                  </div>

                  {loan.approved ? (
                    <Button className={`w-full h-12 bg-gradient-to-r ${loan.gradient} hover:opacity-90 text-white rounded-2xl font-semibold shadow-lg`}>
                      Apply Now
                    </Button>
                  ) : (
                    <Button variant="outline" disabled className="w-full h-12 rounded-2xl">
                      Improve Score to Qualify
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-6 border-2 border-blue-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-blue-900 mb-1">Improve Your Offers</h4>
                <p className="text-sm text-blue-700 leading-relaxed">
                  Increase your credit score to unlock higher loan amounts and better interest rates from premium lenders.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedFactor) {
    const IconComponent = selectedFactor.icon;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className={`bg-gradient-to-br ${selectedFactor.gradient} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          
          <div className="relative text-white p-6 pb-10">
            <div className="flex items-center justify-between mb-8">
              <button onClick={() => setSelectedFactor(null)} className="p-2 hover:bg-white/20 rounded-full transition-all">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="w-10" />
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-2xl">
                <IconComponent className="w-10 h-10" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-1">{selectedFactor.name}</h2>
                <p className="text-white/90 text-sm">{selectedFactor.description}</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Your Score</span>
                <div className="text-right">
                  <span className="text-4xl font-bold">{selectedFactor.score}</span>
                  <span className="text-xl text-white/80">/{selectedFactor.maxScore}</span>
                </div>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-white rounded-full shadow-lg"
                  style={{ width: `${(selectedFactor.score / selectedFactor.maxScore) * 100}%` }}
                />
              </div>
              <div className="text-sm text-white/80">
                Worth {selectedFactor.weight}% of your overall score
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 -mt-6 pb-8 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-gray-100">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Insights & Tips
            </h3>
            <div className="space-y-3">
              {selectedFactor.tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={() => setSelectedFactor(null)} className={`w-full h-14 bg-gradient-to-r ${selectedFactor.gradient} hover:opacity-90 text-white rounded-2xl font-semibold shadow-lg text-base`}>
            Got It
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Premium Score Display Header */}
      <div className={`bg-gradient-to-br ${scoreCategory.color} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        <div className="relative text-white p-6 pb-10">
          <div className="flex items-center justify-between mb-8">
            <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full transition-all">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="text-center">
              <h1 className="text-xl font-bold">Credit Score</h1>
              <p className="text-sm text-white/80">Your financial profile</p>
            </div>
            <div className="w-10" />
          </div>

          {/* Giant Score Display */}
          <div className="text-center mb-6">
            <div className="inline-block relative">
              <div className="w-40 h-40 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 shadow-2xl border-4 border-white/30">
                <div className="text-center">
                  <div className="text-6xl font-bold mb-1">{overallScore}</div>
                  <div className="text-xs text-white/80 uppercase tracking-wider">/ 100</div>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                <Trophy className="w-6 h-6 text-yellow-800" />
              </div>
            </div>
            
            <div className={`inline-block px-6 py-2.5 bg-white rounded-full text-base font-bold shadow-2xl mb-2 bg-gradient-to-r ${scoreCategory.color} text-white`}>
              {scoreCategory.label}
            </div>
            <p className="text-white/90 text-sm">Better than 68% of GO Pay users</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-6 pb-8 space-y-6">
        {/* What is This */}
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-6 border-2 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Info className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-blue-900 mb-2">Alternative Credit Score</h3>
              <p className="text-blue-700 leading-relaxed">
                No credit history? No problem! We calculate your creditworthiness based on your GO Pay behavior - payments, savings, and transaction patterns.
              </p>
            </div>
          </div>
        </div>

        {/* Premium Loan Eligibility Card */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-1 shadow-2xl">
          <div className="bg-white rounded-[22px] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xl">Loan Eligibility</h3>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 mb-4">
              <div className="text-sm text-gray-600 mb-2">You're eligible for up to</div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  TZS {(maxLoanAmount / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-700">
                <Shield className="w-4 h-4" />
                <span>Based on your {scoreCategory.label.toLowerCase()} credit score</span>
              </div>
            </div>
            
            <Button 
              onClick={() => setShowLoanOffers(true)}
              className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 text-white rounded-2xl font-semibold shadow-lg text-base"
            >
              <Zap className="w-5 h-5 mr-2" />
              View Loan Offers
            </Button>
          </div>
        </div>

        {/* Score Factors - Premium Grid */}
        <div>
          <h3 className="font-bold text-xl mb-5">Score Breakdown</h3>
          <div className="space-y-4">
            {CREDIT_FACTORS.map(factor => {
              const IconComponent = factor.icon;
              const percentage = (factor.score / factor.maxScore) * 100;
              
              return (
                <button
                  key={factor.id}
                  onClick={() => setSelectedFactor(factor)}
                  className="w-full group"
                >
                  <div className={`bg-gradient-to-r ${factor.gradient} rounded-3xl p-1 shadow-lg hover:shadow-2xl transition-all`}>
                    <div className="bg-white rounded-[22px] p-5">
                      <div className="flex items-center gap-4 mb-3">
                        <div className={`w-14 h-14 bg-gradient-to-br ${factor.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <IconComponent className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className="font-bold text-lg mb-0.5">{factor.name}</h4>
                          <p className="text-xs text-gray-500">{factor.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{factor.score}</div>
                          <div className="text-xs text-gray-500">/{factor.maxScore}</div>
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${factor.gradient} rounded-full`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">{factor.weight}% of total score</span>
                        <span className={`px-2 py-1 bg-gradient-to-r ${factor.gradient} text-white rounded-full font-medium`}>
                          {factor.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Improvement Tips */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-gray-100">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-md">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-xl">Improve Your Score</h3>
          </div>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Pay bills on time', desc: 'Most important (30% weight)', color: 'from-green-500 to-emerald-600' },
              { step: '2', title: 'Maintain savings', desc: 'Shows stability (20% weight)', color: 'from-purple-500 to-pink-600' },
              { step: '3', title: 'Use GO Pay regularly', desc: 'More data = better accuracy', color: 'from-blue-500 to-cyan-600' },
              { step: '4', title: 'Diversify transactions', desc: 'Use for different purchases', color: 'from-orange-500 to-red-600' }
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                <div className={`w-10 h-10 bg-gradient-to-br ${tip.color} rounded-xl flex items-center justify-center text-white font-bold shadow-md flex-shrink-0`}>
                  {tip.step}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{tip.title}</h4>
                  <p className="text-sm text-gray-600">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Share Score */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-6 border-2 border-purple-100 text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <ExternalLink className="w-7 h-7 text-white" />
          </div>
          <h3 className="font-bold text-lg mb-2">Share Your Score</h3>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Use your GO Pay credit score when applying for loans with partner banks
          </p>
          <Button variant="outline" className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 font-semibold px-6 py-3 rounded-2xl">
            Generate Credit Report
          </Button>
        </div>

        {/* Privacy */}
        <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl p-6 text-center border-2 border-gray-200">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-bold text-gray-900 mb-2">100% Private & Secure</h4>
          <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
            Your credit score is calculated securely and privately. Only shared with your explicit consent.
          </p>
        </div>
      </div>
    </div>
  );
}
