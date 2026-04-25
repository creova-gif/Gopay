import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../App';
import {
  ArrowLeft, Plus, Trash2, Target,
  ShoppingBag, Zap, Plane, Coffee,
  Home, Car, Heart, MoreHorizontal, DollarSign,
  AlertCircle, CheckCircle, TrendingUp, X
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface BudgetTrackerProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

interface Budget {
  id: string;
  category: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  limit: number;
  spent: number;
  period: 'weekly' | 'monthly';
}

// ── SVG Circular Progress ──────────────────────────────────────────────────────
function RingProgress({
  percentage,
  size = 52,
  stroke = 4,
  color,
}: {
  percentage: number;
  size?: number;
  stroke?: number;
  color: string;
}) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = Math.min(percentage / 100, 1) * circ;
  const cx = size / 2;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
      <circle
        cx={cx}
        cy={cx}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── Large Donut (header) ───────────────────────────────────────────────────────
function DonutChart({ percentage }: { percentage: number }) {
  const size = 160;
  const stroke = 14;
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = Math.min(percentage / 100, 1) * circ;
  const cx = size / 2;
  const color = percentage >= 100 ? '#ef4444' : percentage >= 80 ? '#f97316' : '#4ade80';
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
      <circle
        cx={cx}
        cy={cx}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)' }}
      />
    </svg>
  );
}

const CATEGORY_RING_COLORS: Record<string, string> = {
  'Food & Dining': '#ef4444',
  Shopping: '#3b82f6',
  'Bills & Utilities': '#eab308',
  Travel: '#a855f7',
  Transportation: '#22c55e',
  Healthcare: '#ec4899',
  Housing: '#f97316',
  Other: '#6b7280',
};

const generateDemoBudgets = (): Budget[] => [
  { id: '1', category: 'Food & Dining', icon: Coffee, color: 'bg-red-500', limit: 300000, spent: 245000, period: 'monthly' },
  { id: '2', category: 'Shopping', icon: ShoppingBag, color: 'bg-blue-500', limit: 200000, spent: 156000, period: 'monthly' },
  { id: '3', category: 'Bills & Utilities', icon: Zap, color: 'bg-yellow-500', limit: 150000, spent: 142000, period: 'monthly' },
  { id: '4', category: 'Travel', icon: Plane, color: 'bg-purple-500', limit: 100000, spent: 45000, period: 'monthly' },
];

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

export function BudgetTracker({ user, accessToken, onBack }: BudgetTrackerProps) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [newBudget, setNewBudget] = useState({ category: 'Food & Dining', limit: '', period: 'monthly' as 'weekly' | 'monthly' });
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'overview' | 'list'>('overview');

  useEffect(() => {
    fetch(`https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/budgets/list`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setBudgets(data.budgets?.length ? data.budgets : generateDemoBudgets()))
      .catch(() => setBudgets(generateDemoBudgets()))
      .finally(() => setLoading(false));
  }, [accessToken]);

  const addBudget = async () => {
    if (!newBudget.limit) return;
    const catData = categories.find((c) => c.name === newBudget.category)!;
    const budget: Budget = {
      id: Date.now().toString(),
      category: newBudget.category,
      icon: catData.icon,
      color: catData.color,
      limit: parseInt(newBudget.limit),
      spent: 0,
      period: newBudget.period,
    };
    setBudgets((prev) => [...prev, budget]);
    setShowAddBudget(false);
    setNewBudget({ category: 'Food & Dining', limit: '', period: 'monthly' });
    fetch(`https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/budgets/create`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(budget),
    }).catch(() => {});
  };

  const deleteBudget = (budgetId: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== budgetId));
    fetch(`https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/budgets/${budgetId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    }).catch(() => {});
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 }).format(n);

  const pct = (spent: number, limit: number) => Math.min((spent / limit) * 100, 100);

  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const totalPct = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;

  const healthScore = budgets.length > 0
    ? Math.round((budgets.filter((b) => pct(b.spent, b.limit) < 80).length / budgets.length) * 100)
    : 100;

  const worstBudget = budgets.reduce<Budget | null>((worst, b) => {
    if (!worst) return b;
    return pct(b.spent, b.limit) > pct(worst.spent, worst.limit) ? b : worst;
  }, null);

  return (
    <div className="min-h-screen bg-[#080d08] text-white">
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #14532d 0%, #052e16 100%)' }} className="px-4 pt-12 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl tracking-tight">Budget Tracker</h1>
          </div>
          <button
            onClick={() => setShowAddBudget(true)}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30 transition-colors"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        {/* Donut summary */}
        {!loading && budgets.length > 0 && (
          <div className="flex flex-col items-center">
            <div className="relative">
              <DonutChart percentage={totalPct} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-[11px] text-white/50 uppercase tracking-widest">Used</p>
                <p className="text-xl font-semibold leading-tight">{Math.round(totalPct)}%</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-2xl font-semibold">{fmt(totalSpent)}</p>
              <p className="text-sm text-white/50">of {fmt(totalLimit)} total budget</p>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-6 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-[#4ade80] border-t-transparent animate-spin" />
            <p className="text-sm text-white/40">Loading budgets...</p>
          </div>
        ) : budgets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Target className="h-16 w-16 text-white/20" />
            <p className="text-white/60">No budgets yet</p>
            <p className="text-sm text-white/40 text-center">Create your first budget to start tracking spending</p>
            <button
              onClick={() => setShowAddBudget(true)}
              className="px-6 py-3 rounded-xl bg-[#16a34a] text-sm font-medium flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Budget
            </button>
          </div>
        ) : (
          <>
            {/* Budget cards */}
            {budgets.map((budget, i) => {
              const p = pct(budget.spent, budget.limit);
              const ringColor = CATEGORY_RING_COLORS[budget.category] ?? '#6b7280';
              const isOver = p >= 100;
              const isWarning = p >= 80;
              return (
                <motion.div
                  key={budget.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-2xl p-4"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div className="flex items-center gap-4 mb-3">
                    {/* Icon + ring */}
                    <div className="relative flex-shrink-0">
                      <RingProgress percentage={p} size={52} stroke={4} color={ringColor} />
                      <div className={`absolute inset-0 flex items-center justify-center`}>
                        <div className={`w-9 h-9 rounded-full ${budget.color} flex items-center justify-center`}>
                          <budget.icon className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-white leading-tight">{budget.category}</p>
                          <p className="text-xs text-white/40 capitalize mt-0.5">{budget.period}</p>
                        </div>
                        <button
                          onClick={() => deleteBudget(budget.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0 ml-2"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-white/30 hover:text-red-400 transition-colors" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-2">
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: isOver ? '#ef4444' : isWarning ? '#f97316' : ringColor }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(p, 100)}%` }}
                        transition={{ duration: 0.6, delay: i * 0.06 + 0.2, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-white/40">
                      {fmt(budget.spent)} <span className="text-white/20">/ {fmt(budget.limit)}</span>
                    </p>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      isOver
                        ? 'bg-red-500/15 text-red-400'
                        : isWarning
                          ? 'bg-orange-500/15 text-orange-400'
                          : 'bg-green-500/15 text-green-400'
                    }`}>
                      {isOver ? <AlertCircle className="h-3 w-3" /> : isWarning ? <AlertCircle className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                      {isOver ? 'Over budget' : isWarning ? 'Almost full' : 'On track'}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Spending Insights */}
            <div
              className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4 text-[#4ade80]" />
                <p className="text-sm text-white/60">Spending Insights</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/50">Budget health score</p>
                  <span className={`text-sm font-semibold ${healthScore >= 70 ? 'text-[#4ade80]' : healthScore >= 40 ? 'text-orange-400' : 'text-red-400'}`}>
                    {healthScore}%
                  </span>
                </div>
                {worstBudget && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white/50">Highest spend rate</p>
                    <span className="text-sm text-white/70">{worstBudget.category}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/50">Month-end projection</p>
                  <span className="text-sm text-white/70">{fmt(Math.round(totalSpent * 1.18))}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Budget bottom sheet */}
      <AnimatePresence>
        {showAddBudget && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/70 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddBudget(false)}
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl px-5 pt-5 pb-10"
              style={{ background: '#0d1a0d', border: '1px solid rgba(74,222,128,0.1)' }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Create Budget</h2>
                <button
                  onClick={() => setShowAddBudget(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10"
                >
                  <X className="h-4 w-4 text-white/60" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Category */}
                <div>
                  <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Category</label>
                  <select
                    value={newBudget.category}
                    onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none focus:border-[#4ade80] transition-colors"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    {categories.map((cat) => (
                      <option key={cat.name} value={cat.name} className="bg-[#0d1a0d]">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Limit */}
                <div>
                  <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Budget Limit (TZS)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                    <input
                      type="number"
                      value={newBudget.limit}
                      onChange={(e) => setNewBudget({ ...newBudget, limit: e.target.value })}
                      placeholder="Enter amount"
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/20 outline-none focus:border-[#4ade80] transition-colors"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                  </div>
                </div>

                {/* Period */}
                <div>
                  <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Period</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['weekly', 'monthly'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setNewBudget({ ...newBudget, period: p })}
                        className="py-3 rounded-xl text-sm font-medium capitalize transition-all"
                        style={{
                          background: newBudget.period === p ? '#16a34a' : 'rgba(255,255,255,0.06)',
                          border: newBudget.period === p ? 'none' : '1px solid rgba(255,255,255,0.1)',
                          color: newBudget.period === p ? 'white' : 'rgba(255,255,255,0.6)',
                        }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddBudget(false)}
                  className="flex-1 py-3.5 rounded-xl text-sm transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={addBudget}
                  disabled={!newBudget.limit}
                  className="flex-1 py-3.5 rounded-xl text-sm font-medium bg-[#16a34a] text-white disabled:opacity-40 transition-opacity"
                >
                  Create Budget
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
