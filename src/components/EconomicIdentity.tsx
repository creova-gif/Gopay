import { useState } from 'react';
import { Button } from './ui/button';
import { 
  TrendingUp, 
  ChevronLeft,
  DollarSign,
  PieChart,
  BarChart3,
  CreditCard,
  Shield,
  Star,
  Award,
  CheckCircle,
  TrendingDown,
  Users,
  ShoppingBag,
  Car,
  Lock
} from 'lucide-react';

interface EconomicIdentityProps {
  onBack: () => void;
  user: any;
}

export function EconomicIdentity({ onBack, user }: EconomicIdentityProps) {
  const [creditScore, setCreditScore] = useState(720);
  const [scoreCategory, setScoreCategory] = useState('Good');

  const economicData = {
    transactionHistory: 156,
    totalSpent: 2450000,
    avgMonthlySpending: 450000,
    savingsRate: 15,
    merchantReputation: 4.8,
    bodaSafetyScore: 92,
    loanEligibility: 'Qualified',
    maxLoanAmount: 500000,
    interestRate: 12,
    trustScore: 85
  };

  const spendingCategories = [
    { name: 'Food & Dining', amount: 120000, percentage: 27, color: 'from-orange-500 to-red-500', icon: '🍽️' },
    { name: 'Transportation', amount: 85000, percentage: 19, color: 'from-blue-500 to-cyan-500', icon: '🚗' },
    { name: 'Bills & Utilities', amount: 95000, percentage: 21, color: 'from-green-500 to-emerald-500', icon: '⚡' },
    { name: 'Shopping', amount: 75000, percentage: 17, color: 'from-purple-500 to-pink-500', icon: '🛍️' },
    { name: 'Other', amount: 75000, percentage: 16, color: 'from-gray-500 to-slate-500', icon: '📦' }
  ];

  const financialProducts = [
    {
      id: 1,
      type: 'Micro Loan',
      provider: 'GO Credit',
      amount: 'Up to TZS 500,000',
      rate: '12% APR',
      eligible: true,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 2,
      type: 'Insurance',
      provider: 'GO Protect',
      amount: 'Health & Life',
      rate: 'TZS 30,000/mo',
      eligible: true,
      icon: Shield,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 3,
      type: 'Installments',
      provider: 'GO Pay Later',
      amount: 'Buy now, pay later',
      rate: '0% for 3 months',
      eligible: true,
      icon: CreditCard,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 4,
      type: 'Savings Plan',
      provider: 'GO Save',
      amount: 'Auto-save daily',
      rate: '8% interest',
      eligible: true,
      icon: PieChart,
      color: 'from-teal-500 to-cyan-500'
    }
  ];

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return 'from-green-500 to-emerald-500';
    if (score >= 650) return 'from-blue-500 to-cyan-500';
    if (score >= 550) return 'from-orange-500 to-amber-500';
    return 'from-red-500 to-pink-500';
  };

  const getCreditScoreCategory = (score: number) => {
    if (score >= 750) return 'Excellent';
    if (score >= 650) return 'Good';
    if (score >= 550) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-5 pt-8 pb-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <button 
            onClick={onBack}
            className="bg-white/20 backdrop-blur-md hover:bg-white/30 p-2 rounded-full mb-6 transition-all active:scale-95"
          >
            <ChevronLeft className="size-5 text-white" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
              <TrendingUp className="size-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl text-white mb-1">Economic Identity</h1>
              <p className="text-purple-100 text-sm">Your Financial Profile & Credit Score</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-6 space-y-6">
        {/* Credit Score Card */}
        <div className={`bg-gradient-to-br ${getCreditScoreColor(creditScore)} rounded-3xl p-6 text-white shadow-xl relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <p className="text-sm text-white/80 mb-2">Your Credit Score</p>
            <div className="flex items-end gap-2 mb-4">
              <p className="text-6xl">{creditScore}</p>
              <p className="text-xl mb-2 text-white/80">/ 850</p>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-sm">{getCreditScoreCategory(creditScore)}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="size-4" />
                <span className="text-sm">+15 this month</span>
              </div>
            </div>
            <p className="text-sm text-white/80">
              You're in the top 30% of GO App users in Tanzania
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="size-5 text-blue-600" />
              <p className="text-xs text-gray-600">Trust Score</p>
            </div>
            <p className="text-2xl text-blue-600 mb-1">{economicData.trustScore}%</p>
            <p className="text-xs text-gray-500">Merchant reputation</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Car className="size-5 text-green-600" />
              <p className="text-xs text-gray-600">Safety Score</p>
            </div>
            <p className="text-2xl text-green-600 mb-1">{economicData.bodaSafetyScore}</p>
            <p className="text-xs text-gray-500">Boda boda rating</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <PieChart className="size-5 text-purple-600" />
              <p className="text-xs text-gray-600">Savings Rate</p>
            </div>
            <p className="text-2xl text-purple-600 mb-1">{economicData.savingsRate}%</p>
            <p className="text-xs text-gray-500">Of monthly income</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingBag className="size-5 text-orange-600" />
              <p className="text-xs text-gray-600">Transactions</p>
            </div>
            <p className="text-2xl text-orange-600 mb-1">{economicData.transactionHistory}</p>
            <p className="text-xs text-gray-500">Last 6 months</p>
          </div>
        </div>

        {/* Spending Behavior */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg mb-4">Spending Behavior</h3>
          <div className="space-y-3">
            {spendingCategories.map((category, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{category.icon}</span>
                    <p className="text-sm">{category.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{category.percentage}%</p>
                    <p className="text-xs text-gray-500">TZS {category.amount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${category.color} rounded-full transition-all`}
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Products Unlocked */}
        <div>
          <h3 className="text-lg mb-4">Products You've Unlocked</h3>
          <div className="space-y-3">
            {financialProducts.map((product) => {
              const Icon = product.icon;
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                >
                  <div className="flex items-start gap-4">
                    <div className={`bg-gradient-to-br ${product.color} p-3 rounded-xl text-white`}>
                      <Icon className="size-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{product.type}</p>
                        {product.eligible && (
                          <div className="flex items-center gap-1 text-green-600 text-xs bg-green-50 px-2 py-1 rounded-full">
                            <CheckCircle className="size-3" />
                            <span>Eligible</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{product.provider}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-900">{product.amount}</p>
                          <p className="text-xs text-gray-500">{product.rate}</p>
                        </div>
                        <Button size="sm" className="bg-gradient-to-r from-blue-600 to-cyan-600">
                          Apply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* How Your Score is Calculated */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 text-white shadow-lg">
          <h3 className="text-xl mb-4">How Your Score Works</h3>
          <div className="space-y-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Payment History</span>
                <span className="text-sm">35%</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: '92%' }} />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Transaction Volume</span>
                <span className="text-sm">30%</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Savings Behavior</span>
                <span className="text-sm">20%</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: '70%' }} />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Merchant Reviews</span>
                <span className="text-sm">15%</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: '95%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg mb-4">Benefits of Your Economic Identity</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-lg mt-0.5">
                <CheckCircle className="size-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm mb-1">Access to Micro-Loans</p>
                <p className="text-xs text-gray-600">Up to TZS 500,000 based on your credit score</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg mt-0.5">
                <CheckCircle className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm mb-1">Lower Interest Rates</p>
                <p className="text-xs text-gray-600">Better credit = better rates</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 p-2 rounded-lg mt-0.5">
                <CheckCircle className="size-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm mb-1">Buy Now, Pay Later</p>
                <p className="text-xs text-gray-600">Installment plans for purchases</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-orange-100 p-2 rounded-lg mt-0.5">
                <CheckCircle className="size-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm mb-1">Insurance Eligibility</p>
                <p className="text-xs text-gray-600">Health, life, and property insurance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Inclusion Badge */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-5 text-white text-center">
          <div className="text-3xl mb-2">💳</div>
          <p className="mb-1">Tanzania's Financial Identity Platform</p>
          <p className="text-sm text-green-100">Building credit history for the unbanked</p>
        </div>
      </div>
    </div>
  );
}
