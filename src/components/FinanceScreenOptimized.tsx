/**
 * OPTIMIZED FINANCE SCREEN - FINTECH BEST PRACTICES
 * 
 * Patterns from:
 * - Revolut: Spending analytics, budget tracker, insights
 * - N26: Clean financial overview, category breakdown
 * - Nubank: Simple savings goals, clear progress tracking
 * - PayPal: Multi-currency wallet, transaction insights
 * - Monzo: Smart budgeting, real-time notifications
 * - Chime: Savings automation, financial health score
 * 
 * Design Principles:
 * - WCAG 2.1 AA+ contrast (all text ≥4.5:1)
 * - Swahili-first labels with English subtitles
 * - Clear financial insights with actionable data
 * - Motivating savings progress tracking
 * - Easy-to-understand spending breakdown
 * - Trust signals (secure, transparent)
 */

import { 
  ChevronRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PiggyBank,
  BarChart3,
  Globe,
  Target,
  Wallet,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  Shield,
  Zap,
  Percent,
  Receipt,
  ShoppingBag,
  Utensils,
  Car,
  Home,
  Heart,
  Smartphone
} from 'lucide-react';

interface FinanceScreenOptimizedProps {
  onNavigate: (screen: string) => void;
  balance: number;
  formatCurrency: (amount: number) => string;
}

export function FinanceScreenOptimized({ 
  onNavigate, 
  balance,
  formatCurrency 
}: FinanceScreenOptimizedProps) {
  // Mock data - replace with real API calls
  const totalSavings = 1250000;
  const savingsGrowth = 12.5;
  const monthlyIncome = 850000;
  const monthlyExpenses = 620000;
  const savingsGoal = 2000000;
  const budgetUsed = 68;

  return (
    <div className="px-5 pt-8 pb-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Fedha</h1>
        <p className="text-base text-gray-700 font-medium">Angalia fedha zako • Manage your finances</p>
      </div>

      {/* TOP SECTION - FINANCIAL OVERVIEW (Revolut/N26 Pattern) */}
      <div className="bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="size-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <PiggyBank className="size-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Total Savings</p>
                <p className="text-xs text-emerald-100">Akiba yako jumla</p>
              </div>
            </div>
            <button 
              onClick={() => onNavigate('savings-details')}
              className="text-xs bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/30 transition-all font-semibold border border-white/30"
            >
              Details
            </button>
          </div>
          
          {/* Savings Display */}
          <div className="mb-6">
            <div className="flex items-baseline gap-2 mb-1">
              <p className="text-5xl font-black tracking-tight">{formatCurrency(totalSavings)}</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="size-4" />
              <span className="font-semibold">+{savingsGrowth}% this month</span>
              <span className="text-emerald-100">• {formatCurrency(totalSavings * (savingsGrowth/100))} more</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <ArrowDownLeft className="size-4 text-emerald-200" />
                <p className="text-xs text-emerald-100 font-medium">Mapato • Income</p>
              </div>
              <p className="text-2xl font-black mb-0.5">{formatCurrency(monthlyIncome)}</p>
              <p className="text-xs text-white/80">This month</p>
            </div>

            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpRight className="size-4 text-amber-200" />
                <p className="text-xs text-emerald-100 font-medium">Matumizi • Expenses</p>
              </div>
              <p className="text-2xl font-black mb-0.5">{formatCurrency(monthlyExpenses)}</p>
              <p className="text-xs text-white/80">This month</p>
            </div>
          </div>
        </div>
      </div>

      {/* SAVINGS GOAL (Nubank/Chime Pattern) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-0.5">Lengo la Akiba</h2>
            <p className="text-sm text-gray-700 font-medium">Savings goal</p>
          </div>
          <button 
            onClick={() => onNavigate('edit-goal')}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-bold"
          >
            Edit
          </button>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-200/30 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="size-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                  <Target className="size-6 text-white" />
                </div>
                <div>
                  <p className="text-base font-bold text-gray-900 mb-0.5">Emergency Fund</p>
                  <p className="text-xs text-gray-700 font-medium">Save for unexpected expenses</p>
                </div>
              </div>
              <ChevronRight className="size-5 text-gray-600" />
            </div>

            {/* Progress */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-900 font-bold">
                  {formatCurrency(totalSavings)} of {formatCurrency(savingsGoal)}
                </span>
                <span className="text-purple-700 font-black">{Math.round((totalSavings/savingsGoal)*100)}%</span>
              </div>
              <div className="h-3 bg-purple-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transition-all duration-500 shadow-lg" 
                  style={{ width: `${Math.round((totalSavings/savingsGoal)*100)}%` }} 
                />
              </div>
            </div>

            {/* Goal info */}
            <div className="bg-white/60 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-purple-600" />
                <span className="text-xs text-gray-700 font-medium">
                  {formatCurrency(savingsGoal - totalSavings)} more needed
                </span>
              </div>
              <button 
                onClick={() => onNavigate('add-to-savings')}
                className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-purple-700 transition-colors"
              >
                Add Money
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BUDGET TRACKER (Revolut/Monzo Pattern) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-0.5">Bajeti ya Mwezi</h2>
            <p className="text-sm text-gray-700 font-medium">Monthly budget</p>
          </div>
          <button 
            onClick={() => onNavigate('budget')}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1"
          >
            View All
            <ChevronRight className="size-4" />
          </button>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 shadow-sm">
          {/* Budget Status */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`size-12 ${budgetUsed < 80 ? 'bg-gradient-to-br from-green-100 to-emerald-100' : 'bg-gradient-to-br from-orange-100 to-red-100'} rounded-xl flex items-center justify-center`}>
                {budgetUsed < 80 ? (
                  <CheckCircle2 className="size-6 text-green-600" />
                ) : (
                  <AlertCircle className="size-6 text-orange-600" />
                )}
              </div>
              <div>
                <p className="text-base font-bold text-gray-900 mb-0.5">
                  {budgetUsed < 80 ? 'On Track!' : 'Watch Spending'}
                </p>
                <p className="text-xs text-gray-700 font-medium">
                  {formatCurrency(monthlyExpenses)} of {formatCurrency(monthlyIncome * 0.8)} budget
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-black ${budgetUsed < 80 ? 'text-green-600' : 'text-orange-600'}`}>
                {budgetUsed}%
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${budgetUsed < 80 ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-orange-500 to-red-600'} rounded-full transition-all duration-500`}
                style={{ width: `${Math.min(budgetUsed, 100)}%` }} 
              />
            </div>
          </div>

          {/* Remaining */}
          <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="size-4 text-emerald-600" />
              <span className="text-sm text-gray-900 font-bold">
                {formatCurrency((monthlyIncome * 0.8) - monthlyExpenses)} left to spend
              </span>
            </div>
            <span className="text-xs text-gray-700 font-medium">{Math.round(100 - budgetUsed)}% remaining</span>
          </div>
        </div>
      </div>

      {/* SPENDING BREAKDOWN (N26/Revolut Pattern) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-0.5">Matumizi kwa Aina</h2>
            <p className="text-sm text-gray-700 font-medium">Spending by category</p>
          </div>
          <button 
            onClick={() => onNavigate('insights')}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-bold"
          >
            Insights
          </button>
        </div>

        <div className="space-y-3">
          {/* Category 1: Shopping */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-11 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                <ShoppingBag className="size-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 mb-0.5">Shopping & Retail</p>
                <p className="text-xs text-gray-700 font-medium">Duka • 15 transactions</p>
              </div>
              <div className="text-right">
                <p className="text-base font-black text-gray-900">{formatCurrency(240000)}</p>
                <p className="text-xs text-blue-600 font-bold">39%</p>
              </div>
            </div>
            <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full" style={{ width: '39%' }} />
            </div>
          </div>

          {/* Category 2: Food */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-11 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center">
                <Utensils className="size-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 mb-0.5">Food & Dining</p>
                <p className="text-xs text-gray-700 font-medium">Chakula • 22 transactions</p>
              </div>
              <div className="text-right">
                <p className="text-base font-black text-gray-900">{formatCurrency(186000)}</p>
                <p className="text-xs text-orange-600 font-bold">30%</p>
              </div>
            </div>
            <div className="h-2 bg-orange-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full" style={{ width: '30%' }} />
            </div>
          </div>

          {/* Category 3: Transport */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-11 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                <Car className="size-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 mb-0.5">Transport</p>
                <p className="text-xs text-gray-700 font-medium">Usafiri • 18 transactions</p>
              </div>
              <div className="text-right">
                <p className="text-base font-black text-gray-900">{formatCurrency(124000)}</p>
                <p className="text-xs text-purple-600 font-bold">20%</p>
              </div>
            </div>
            <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full" style={{ width: '20%' }} />
            </div>
          </div>

          {/* View All Categories */}
          <button 
            onClick={() => onNavigate('all-categories')}
            className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 hover:bg-gray-100 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <BarChart3 className="size-5 text-gray-700" />
            <span className="text-sm font-bold text-gray-900">View All Categories</span>
            <ChevronRight className="size-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* FINANCIAL SERVICES (Quick Actions) */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="size-5 text-amber-500" />
          <h2 className="text-xl font-black text-gray-900">Huduma za Kifedha</h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Micro Loans */}
          <button
            onClick={() => onNavigate('microloans')}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 p-4 rounded-2xl hover:shadow-lg transition-all active:scale-[0.98] text-left group"
          >
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform shadow-md">
              <DollarSign className="size-6 text-white" />
            </div>
            <p className="text-sm font-bold text-gray-900 mb-1">Mikopo Midogo</p>
            <p className="text-xs text-gray-700 leading-relaxed">Quick cash loans</p>
            <div className="mt-2 flex items-center gap-1 text-blue-700">
              <span className="text-xs font-bold">Get up to 500K</span>
              <ChevronRight className="size-3" />
            </div>
          </button>

          {/* Multi-Currency */}
          <button
            onClick={() => onNavigate('multicurrency')}
            className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 p-4 rounded-2xl hover:shadow-lg transition-all active:scale-[0.98] text-left group"
          >
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform shadow-md">
              <Globe className="size-6 text-white" />
            </div>
            <p className="text-sm font-bold text-gray-900 mb-1">Multi-Currency</p>
            <p className="text-xs text-gray-700 leading-relaxed">USD, EUR, GBP</p>
            <div className="mt-2 flex items-center gap-1 text-emerald-700">
              <span className="text-xs font-bold">Send globally</span>
              <ChevronRight className="size-3" />
            </div>
          </button>

          {/* Budget Planner */}
          <button
            onClick={() => onNavigate('budget')}
            className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 p-4 rounded-2xl hover:shadow-lg transition-all active:scale-[0.98] text-left group"
          >
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform shadow-md">
              <BarChart3 className="size-6 text-white" />
            </div>
            <p className="text-sm font-bold text-gray-900 mb-1">Budget Planner</p>
            <p className="text-xs text-gray-700 leading-relaxed">Track spending</p>
            <div className="mt-2 flex items-center gap-1 text-purple-700">
              <span className="text-xs font-bold">Set limits</span>
              <ChevronRight className="size-3" />
            </div>
          </button>

          {/* Insights */}
          <button
            onClick={() => onNavigate('insights')}
            className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 p-4 rounded-2xl hover:shadow-lg transition-all active:scale-[0.98] text-left group"
          >
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform shadow-md">
              <TrendingUp className="size-6 text-white" />
            </div>
            <p className="text-sm font-bold text-gray-900 mb-1">Smart Insights</p>
            <p className="text-xs text-gray-700 leading-relaxed">AI-powered tips</p>
            <div className="mt-2 flex items-center gap-1 text-orange-700">
              <span className="text-xs font-bold">Save more</span>
              <ChevronRight className="size-3" />
            </div>
          </button>
        </div>
      </div>

      {/* SMART TIPS (Monzo/Chime Pattern) */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Zap className="size-5 text-amber-500" />
          <h2 className="text-xl font-black text-gray-900">Smart Tips</h2>
        </div>

        <div className="space-y-3">
          {/* Tip 1: Save More */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="size-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="size-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 mb-1">Great progress! 🎉</p>
                <p className="text-xs text-gray-700 leading-relaxed mb-2">
                  You've saved 12.5% more this month. Keep it up!
                </p>
                <button className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-green-700 transition-colors">
                  View Savings
                </button>
              </div>
            </div>
          </div>

          {/* Tip 2: Reduce Spending */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="size-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="size-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 mb-1">Spending alert</p>
                <p className="text-xs text-gray-700 leading-relaxed mb-2">
                  Food spending is 15% higher than last month
                </p>
                <button 
                  onClick={() => onNavigate('spending-details')}
                  className="text-xs bg-amber-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-amber-700 transition-colors"
                >
                  See Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Footer */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <Shield className="size-6 text-emerald-700" />
          <div>
            <p className="text-sm font-bold text-emerald-900 mb-0.5">Your Money is Safe</p>
            <p className="text-xs text-emerald-800 font-medium leading-relaxed">
              Bank-level encryption • Licensed by Bank of Tanzania
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
