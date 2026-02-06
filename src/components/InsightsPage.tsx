import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { User } from '../App';
import { 
  ArrowLeft, TrendingUp, TrendingDown, DollarSign, ShoppingBag,
  Zap, Plane, Calendar, PieChart, BarChart3, ArrowUpRight, ArrowDownRight,
  Wallet, CreditCard, Target, AlertCircle, Gift, Download
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { 
  BarChart, Bar, LineChart, Line, PieChart as RechartsPieChart, 
  Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

interface InsightsPageProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

interface SpendingData {
  totalSpent: number;
  totalEarned: number;
  topCategory: string;
  savingsRate: number;
  monthlyData: { month: string; spent: number; earned: number; }[];
  categoryData: { category: string; amount: number; percentage: number; color: string; }[];
  trends: {
    spendingChange: number;
    frequentMerchant: string;
    avgTransaction: number;
  };
}

export function InsightsPage({ user, accessToken, onBack }: InsightsPageProps) {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');
  const [insights, setInsights] = useState<SpendingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, [timeframe]);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/analytics/insights?timeframe=${timeframe}`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );
      if (response.ok) {
        const data = await response.json();
        setInsights(data);
      } else {
        setInsights(generateDemoData());
      }
    } catch (error) {
      console.error('Error fetching insights:', error);
      setInsights(generateDemoData());
    } finally {
      setLoading(false);
    }
  };

  const generateDemoData = (): SpendingData => {
    return {
      totalSpent: 1234500,
      totalEarned: 856000,
      topCategory: 'Food & Dining',
      savingsRate: 28,
      monthlyData: [
        { month: 'Jul', spent: 180000, earned: 120000 },
        { month: 'Aug', spent: 220000, earned: 150000 },
        { month: 'Sep', spent: 195000, earned: 145000 },
        { month: 'Oct', spent: 240000, earned: 180000 },
        { month: 'Nov', spent: 210000, earned: 165000 },
        { month: 'Dec', spent: 189500, earned: 96000 },
      ],
      categoryData: [
        { category: 'Food & Dining', amount: 456000, percentage: 37, color: '#ef4444' },
        { category: 'Shopping', amount: 345000, percentage: 28, color: '#3b82f6' },
        { category: 'Bills & Utilities', amount: 234000, percentage: 19, color: '#f59e0b' },
        { category: 'Travel', amount: 123500, percentage: 10, color: '#8b5cf6' },
        { category: 'Others', amount: 76000, percentage: 6, color: '#6b7280' },
      ],
      trends: {
        spendingChange: -12.5,
        frequentMerchant: 'Pizza Paradise',
        avgTransaction: 34500,
      }
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const exportData = () => {
    // Create CSV content
    const csvContent = [
      ['Month', 'Spent', 'Earned'],
      ...insights!.monthlyData.map(d => [d.month, d.spent, d.earned]),
    ].map(row => row.join(',')).join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `goPay-insights-${timeframe}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading || !insights) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white pb-6">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full">
                <ArrowLeft className="size-6" />
              </button>
              <h1 className="text-xl font-bold text-[rgb(248,248,249)]">Financial Insights</h1>
            </div>
            <button
              onClick={exportData}
              className="p-2 hover:bg-white/10 rounded-full"
              title="Export data"
            >
              <Download className="size-5" />
            </button>
          </div>

          {/* Timeframe Selector */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'week', label: 'Week' },
              { id: 'month', label: 'Month' },
              { id: 'year', label: 'Year' },
            ].map((tf) => (
              <button
                key={tf.id}
                onClick={() => setTimeframe(tf.id as any)}
                className={`flex-1 py-2.5 rounded-xl font-semibold transition-all ${
                  timeframe === tf.id
                    ? 'bg-white text-green-700 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <ArrowDownRight className="size-4 text-red-300" />
                <span className="text-xs text-green-100">Total Spent</span>
              </div>
              <p className="text-2xl font-bold text-[rgb(245,248,255)]">{formatCurrency(insights.totalSpent)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpRight className="size-4 text-green-300" />
                <span className="text-xs text-green-100">Total Earned</span>
              </div>
              <p className="text-2xl font-bold text-[rgb(245,248,255)]">{formatCurrency(insights.totalEarned)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4 -mt-2">
        {/* Spending Trend */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Spending vs Income</h3>
            <BarChart3 className="size-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={insights.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Bar dataKey="spent" fill="#ef4444" radius={[8, 8, 0, 0]} />
              <Bar dataKey="earned" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Spending by Category</h3>
            <PieChart className="size-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPieChart>
              <Pie
                data={insights.categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percentage }) => `${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {insights.categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => formatCurrency(value)}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {insights.categoryData.map((cat) => (
              <div key={cat.category} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-gray-700">{cat.category}</span>
                </div>
                <span className="font-semibold">{formatCurrency(cat.amount)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Insights Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-4">
            <Target className="size-8 mb-2 opacity-80" />
            <p className="text-xs opacity-90 mb-1 text-[rgb(244,247,254)]">Savings Rate</p>
            <p className="text-2xl font-bold text-[rgb(239,243,253)]">{insights.savingsRate}%</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-4">
            <TrendingDown className="size-8 mb-2 opacity-80" />
            <p className="text-xs opacity-90 mb-1 text-[rgb(245,248,255)]">Spending Change</p>
            <p className="text-2xl font-bold text-[rgb(236,240,249)]">{insights.trends.spendingChange}%</p>
          </div>
        </div>

        {/* Top Insights */}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <h3 className="font-semibold mb-3">Key Insights</h3>
          
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
            <div className="bg-green-100 rounded-full p-2">
              <ShoppingBag className="size-5 text-green-700" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Top Category</p>
              <p className="text-sm text-gray-600">{insights.topCategory} - {formatCurrency(insights.categoryData[0].amount)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
            <div className="bg-blue-100 rounded-full p-2">
              <DollarSign className="size-5 text-blue-700" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Average Transaction</p>
              <p className="text-sm text-gray-600">{formatCurrency(insights.trends.avgTransaction)} per transaction</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl">
            <div className="bg-purple-100 rounded-full p-2">
              <Gift className="size-5 text-purple-700" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Most Frequent</p>
              <p className="text-sm text-gray-600">{insights.trends.frequentMerchant}</p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="bg-orange-100 rounded-full p-2">
              <AlertCircle className="size-5 text-orange-700" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">Smart Tip</h4>
              <p className="text-sm text-gray-700">
                Your spending on {insights.topCategory.toLowerCase()} is {insights.categoryData[0].percentage}% of your total expenses. 
                Consider setting a budget to save more!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}