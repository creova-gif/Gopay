import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { User } from '../App';
import { 
  ArrowLeft, Plus, Edit2, Trash2, Target, TrendingUp,
  AlertCircle, CheckCircle, ShoppingBag, Zap, Plane, Coffee,
  Home, Car, Heart, MoreHorizontal, DollarSign
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { Progress } from './ui/progress';

interface BudgetTrackerProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

interface Budget {
  id: string;
  category: string;
  icon: any;
  color: string;
  limit: number;
  spent: number;
  period: 'weekly' | 'monthly';
}

export function BudgetTracker({ user, accessToken, onBack }: BudgetTrackerProps) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: 'Food & Dining',
    limit: '',
    period: 'monthly' as 'weekly' | 'monthly'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/budgets/list`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );
      if (response.ok) {
        const data = await response.json();
        setBudgets(data.budgets || generateDemoBudgets());
      } else {
        setBudgets(generateDemoBudgets());
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
      setBudgets(generateDemoBudgets());
    } finally {
      setLoading(false);
    }
  };

  const generateDemoBudgets = (): Budget[] => {
    return [
      {
        id: '1',
        category: 'Food & Dining',
        icon: Coffee,
        color: 'bg-red-500',
        limit: 300000,
        spent: 245000,
        period: 'monthly'
      },
      {
        id: '2',
        category: 'Shopping',
        icon: ShoppingBag,
        color: 'bg-blue-500',
        limit: 200000,
        spent: 156000,
        period: 'monthly'
      },
      {
        id: '3',
        category: 'Bills & Utilities',
        icon: Zap,
        color: 'bg-yellow-500',
        limit: 150000,
        spent: 142000,
        period: 'monthly'
      },
      {
        id: '4',
        category: 'Travel',
        icon: Plane,
        color: 'bg-purple-500',
        limit: 100000,
        spent: 45000,
        period: 'monthly'
      },
    ];
  };

  const categories = [
    { name: 'Food & Dining', icon: Coffee, color: 'bg-red-500' },
    { name: 'Shopping', icon: ShoppingBag, color: 'bg-blue-500' },
    { name: 'Bills & Utilities', icon: Zap, color: 'bg-yellow-500' },
    { name: 'Travel', icon: Plane, color: 'bg-purple-500' },
    { name: 'Transportation', icon: Car, color: 'bg-green-500' },
    { name: 'Healthcare', icon: Heart, color: 'bg-pink-500' },
    { name: 'Housing', icon: Home, color: 'bg-orange-500' },
    { name: 'Other', icon: MoreHorizontal, color: 'bg-gray-500' },
  ];

  const addBudget = async () => {
    if (!newBudget.limit) return;

    const categoryData = categories.find(c => c.name === newBudget.category)!;
    const budget: Budget = {
      id: Date.now().toString(),
      category: newBudget.category,
      icon: categoryData.icon,
      color: categoryData.color,
      limit: parseInt(newBudget.limit),
      spent: 0,
      period: newBudget.period
    };

    setBudgets(prev => [...prev, budget]);
    setShowAddBudget(false);
    setNewBudget({ category: 'Food & Dining', limit: '', period: 'monthly' });

    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/budgets/create`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(budget)
        }
      );
    } catch (error) {
      console.error('Error adding budget:', error);
    }
  };

  const deleteBudget = async (budgetId: string) => {
    setBudgets(prev => prev.filter(b => b.id !== budgetId));

    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/budgets/${budgetId}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getPercentage = (spent: number, limit: number) => {
    return Math.min((spent / limit) * 100, 100);
  };

  const getStatus = (percentage: number) => {
    if (percentage >= 100) return { color: 'text-red-600', bg: 'bg-red-50', label: 'Over Budget', icon: AlertCircle };
    if (percentage >= 80) return { color: 'text-orange-600', bg: 'bg-orange-50', label: 'Almost There', icon: AlertCircle };
    return { color: 'text-green-600', bg: 'bg-green-50', label: 'On Track', icon: CheckCircle };
  };

  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalPercentage = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;

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
              <h1 className="text-xl font-bold">Budget Tracker</h1>
            </div>
            <button
              onClick={() => setShowAddBudget(true)}
              className="bg-white text-green-700 p-2.5 rounded-full hover:bg-green-50 transition-colors"
            >
              <Plus className="size-5" />
            </button>
          </div>

          {/* Overall Budget */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-green-100 text-sm">Total Budget</span>
              <span className="text-sm font-semibold">{Math.round(totalPercentage)}% Used</span>
            </div>
            <div className="flex items-end justify-between mb-2">
              <div>
                <p className="text-3xl font-bold">{formatCurrency(totalSpent)}</p>
                <p className="text-green-100 text-sm">of {formatCurrency(totalLimit)}</p>
              </div>
              <Target className="size-8 opacity-80" />
            </div>
            <div className="bg-white/20 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  totalPercentage >= 100 ? 'bg-red-400' : totalPercentage >= 80 ? 'bg-orange-400' : 'bg-white'
                }`}
                style={{ width: `${Math.min(totalPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Budgets List */}
      <div className="px-4 space-y-3 -mt-2">
        {loading ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading budgets...</p>
          </div>
        ) : budgets.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <Target className="size-16 text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">No budgets yet</h3>
            <p className="text-gray-600 text-sm mb-4">Create your first budget to start tracking spending</p>
            <Button onClick={() => setShowAddBudget(true)} className="bg-green-600">
              <Plus className="size-4 mr-2" />
              Add Budget
            </Button>
          </div>
        ) : (
          budgets.map((budget) => {
            const percentage = getPercentage(budget.spent, budget.limit);
            const status = getStatus(percentage);
            const StatusIcon = status.icon;

            return (
              <div key={budget.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`${budget.color} rounded-xl p-2.5`}>
                      <budget.icon className="size-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{budget.category}</h3>
                      <p className="text-xs text-gray-500 capitalize">{budget.period}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteBudget(budget.id)}
                    className="text-gray-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {formatCurrency(budget.spent)} of {formatCurrency(budget.limit)}
                    </span>
                    <span className={`font-semibold ${status.color}`}>{Math.round(percentage)}%</span>
                  </div>
                  
                  <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        percentage >= 100 ? 'bg-red-500' : percentage >= 80 ? 'bg-orange-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>

                  <div className={`flex items-center gap-2 text-sm ${status.color} ${status.bg} px-3 py-2 rounded-lg`}>
                    <StatusIcon className="size-4" />
                    <span className="font-medium">{status.label}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Budget Modal */}
      {showAddBudget && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-3xl p-6 animate-slide-up">
            <h2 className="text-xl font-bold mb-6">Create Budget</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newBudget.category}
                  onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Limit</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                  <input
                    type="number"
                    value={newBudget.limit}
                    onChange={(e) => setNewBudget({ ...newBudget, limit: e.target.value })}
                    placeholder="Enter amount in TZS"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'weekly', label: 'Weekly' },
                    { id: 'monthly', label: 'Monthly' },
                  ].map((period) => (
                    <button
                      key={period.id}
                      onClick={() => setNewBudget({ ...newBudget, period: period.id as any })}
                      className={`py-3 rounded-xl font-semibold transition-all ${
                        newBudget.period === period.id
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setShowAddBudget(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={addBudget}
                className="flex-1 bg-green-600"
                disabled={!newBudget.limit}
              >
                Create Budget
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
