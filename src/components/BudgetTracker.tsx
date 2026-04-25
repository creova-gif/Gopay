import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { User } from '../App';
import {
  ArrowLeft, Plus, Trash2, Target, AlertCircle, CheckCircle,
  ShoppingBag, Zap, Plane, Coffee, Home, Car, Heart,
  MoreHorizontal, TrendingUp, TrendingDown, BarChart3, Calendar, Sparkles
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

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 }).format(amount);

/* ── Spending Ring Chart ── */
function SpendingRing({ percentage, size = 140 }: { percentage: number; size?: number }) {
  const r = size / 2 - 12;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(percentage, 100);
  const dash = (pct / 100) * circ;
  const color = pct >= 100 ? '#ef4444' : pct >= 80 ? '#f97316' : '#22c55e';

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="10" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.8s ease', filter: `drop-shadow(0 0 6px ${color}60)` }} />
    </svg>
  );
}

const CATEGORIES = [
  { name: 'Chakula & Migahawa', icon: Coffee, color: 'bg-red-500', bgColor: 'rgba(239,68,68,0.15)', accentColor: '#f87171' },
  { name: 'Manunuzi', icon: ShoppingBag, color: 'bg-blue-500', bgColor: 'rgba(59,130,246,0.15)', accentColor: '#60a5fa' },
  { name: 'Bili & Huduma', icon: Zap, color: 'bg-yellow-500', bgColor: 'rgba(234,179,8,0.15)', accentColor: '#fbbf24' },
  { name: 'Safari', icon: Plane, color: 'bg-purple-500', bgColor: 'rgba(139,92,246,0.15)', accentColor: '#c4b5fd' },
  { name: 'Usafiri', icon: Car, color: 'bg-green-500', bgColor: 'rgba(34,197,94,0.15)', accentColor: '#86efac' },
  { name: 'Afya', icon: Heart, color: 'bg-pink-500', bgColor: 'rgba(236,72,153,0.15)', accentColor: '#f9a8d4' },
  { name: 'Nyumba', icon: Home, color: 'bg-orange-500', bgColor: 'rgba(249,115,22,0.15)', accentColor: '#fdba74' },
  { name: 'Mengine', icon: MoreHorizontal, color: 'bg-gray-500', bgColor: 'rgba(107,114,128,0.15)', accentColor: '#9ca3af' },
];

const generateDemoBudgets = (): Budget[] => [
  { id: '1', category: 'Chakula & Migahawa', icon: Coffee, color: 'bg-red-500', bgColor: 'rgba(239,68,68,0.15)', limit: 300000, spent: 245000, period: 'monthly' },
  { id: '2', category: 'Manunuzi', icon: ShoppingBag, color: 'bg-blue-500', bgColor: 'rgba(59,130,246,0.15)', limit: 200000, spent: 156000, period: 'monthly' },
  { id: '3', category: 'Bili & Huduma', icon: Zap, color: 'bg-yellow-500', bgColor: 'rgba(234,179,8,0.15)', limit: 150000, spent: 142000, period: 'monthly' },
  { id: '4', category: 'Safari', icon: Plane, color: 'bg-purple-500', bgColor: 'rgba(139,92,246,0.15)', limit: 100000, spent: 45000, period: 'monthly' },
  { id: '5', category: 'Usafiri', icon: Car, color: 'bg-green-500', bgColor: 'rgba(34,197,94,0.15)', limit: 80000, spent: 62000, period: 'monthly' },
];

export function BudgetTracker({ user: _user, accessToken, onBack }: BudgetTrackerProps) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [newBudget, setNewBudget] = useState({ category: 'Chakula & Migahawa', limit: '', period: 'monthly' as 'weekly' | 'monthly' });
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'overview' | 'list'>('overview');

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/budgets/list`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (response.ok) {
          const data = await response.json();
          setBudgets(data.budgets?.length ? data.budgets : generateDemoBudgets());
        } else {
          setBudgets(generateDemoBudgets());
        }
      } catch {
        setBudgets(generateDemoBudgets());
      } finally {
        setLoading(false);
      }
    };
    fetchBudgets();
  }, [accessToken]);

  const addBudget = async () => {
    if (!newBudget.limit) return;
    const cat = CATEGORIES.find(c => c.name === newBudget.category)!;
    const budget: Budget = {
      id: Date.now().toString(),
      category: newBudget.category,
      icon: cat.icon,
      color: cat.color,
      bgColor: cat.bgColor,
      limit: parseInt(newBudget.limit),
      spent: 0,
      period: newBudget.period,
    };
    setBudgets(prev => [...prev, budget]);
    setShowAddBudget(false);
    setNewBudget({ category: 'Chakula & Migahawa', limit: '', period: 'monthly' });
    try {
      await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/budgets/create`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(budget),
      });
    } catch {}
  };

  const deleteBudget = async (id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
    try {
      await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/budgets/${id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch {}
  };

  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const totalRemaining = Math.max(0, totalLimit - totalSpent);
  const totalPct = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;
  const overBudget = budgets.filter(b => b.spent > b.limit);
  const onTrack = budgets.filter(b => (b.spent / b.limit) < 0.8);
  const ringColor = totalPct >= 100 ? '#ef4444' : totalPct >= 80 ? '#f97316' : '#22c55e';

  const getStatus = (pct: number) => {
    if (pct >= 100) return { color: 'text-red-400', label: 'Imezidi', icon: AlertCircle, bgStyle: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.2)' };
    if (pct >= 80) return { color: 'text-orange-400', label: 'Karibu', icon: AlertCircle, bgStyle: 'rgba(249,115,22,0.1)', borderColor: 'rgba(249,115,22,0.2)' };
    return { color: 'text-green-400', label: 'Iko Sawa', icon: CheckCircle, bgStyle: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.2)' };
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: '#080d08' }}>
      {/* Header */}
      <div className="sticky top-0 z-20 px-4 py-4" style={{ background: 'rgba(8,13,8,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2.5 rounded-full active:scale-95" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <ArrowLeft className="size-5 text-white" />
            </button>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>Bajeti Yangu</h1>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Budget Tracker</p>
            </div>
          </div>
          <button onClick={() => setShowAddBudget(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full font-bold text-sm transition-all active:scale-95"
            style={{ background: '#16a34a', color: '#fff' }}>
            <Plus className="size-4" />Ongeza
          </button>
        </div>

        {/* View toggle */}
        <div className="flex gap-2 mt-3">
          {(['overview', 'list'] as const).map(v => (
            <button key={v} onClick={() => setActiveView(v)}
              className="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
              style={{
                background: activeView === v ? 'rgba(22,163,74,0.2)' : 'rgba(255,255,255,0.06)',
                color: activeView === v ? '#4ade80' : 'rgba(255,255,255,0.5)',
                border: activeView === v ? '1px solid rgba(22,163,74,0.3)' : '1px solid rgba(255,255,255,0.08)',
              }}>
              {v === 'overview' ? 'Muhtasari' : 'Orodha Yote'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500" />
        </div>
      ) : (
        <div className="px-4 py-5 space-y-5">
          {/* Overview Card — Spending Ring */}
          <div className="relative rounded-3xl p-6 overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #14532d 0%, #052e16 100%)', border: '1px solid rgba(74,222,128,0.12)' }}>
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full -mr-20 -mt-20 blur-3xl" style={{ background: 'rgba(74,222,128,0.15)' }} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Bajeti ya Mwezi</p>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>Monthly Budget</p>
                </div>
                <Calendar className="size-5" style={{ color: 'rgba(255,255,255,0.4)' }} />
              </div>

              <div className="flex items-center gap-6">
                {/* Ring */}
                <div className="relative flex-shrink-0">
                  <SpendingRing percentage={totalPct} size={130} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p style={{ fontSize: '24px', fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: '-1px' }}>{Math.round(totalPct)}%</p>
                    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Imetumika</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex-1 space-y-3">
                  <div className="rounded-2xl p-3" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Imetumika</p>
                    <p style={{ fontSize: '18px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>{formatCurrency(totalSpent)}</p>
                  </div>
                  <div className="rounded-2xl p-3" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.15)' }}>
                    <p style={{ fontSize: '10px', color: '#86efac' }}>Iliyobaki</p>
                    <p style={{ fontSize: '18px', fontWeight: 900, color: '#4ade80', letterSpacing: '-0.5px' }}>{formatCurrency(totalRemaining)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Jumla ya bajeti: {formatCurrency(totalLimit)}</p>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(totalPct, 100)}%`, background: `linear-gradient(90deg, ${ringColor}80, ${ringColor})` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Insights */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: CheckCircle, label: 'Iko Sawa', value: onTrack.length, color: '#4ade80', bg: 'rgba(22,163,74,0.1)', border: 'rgba(22,163,74,0.15)' },
              { icon: AlertCircle, label: 'Imezidi', value: overBudget.length, color: '#f87171', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.15)' },
              { icon: BarChart3, label: 'Bajeti', value: budgets.length, color: '#60a5fa', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.15)' },
            ].map(({ icon: Icon, label, value, color, bg, border }) => (
              <div key={label} className="rounded-2xl p-3 text-center" style={{ background: bg, border: `1px solid ${border}` }}>
                <Icon className="size-5 mx-auto mb-1" style={{ color }} />
                <p style={{ fontSize: '20px', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{value}</p>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* AI Tip */}
          {overBudget.length > 0 && (
            <div className="rounded-2xl p-4 flex gap-3" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.15)' }}>
              <Sparkles className="size-5 flex-shrink-0 mt-0.5" style={{ color: '#fbbf24' }} />
              <div>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#fbbf24', marginBottom: '3px' }}>Ushauri wa Akili</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                  Una bajeti {overBudget.length} ambazo zimezidi. Punguza matumizi ya {overBudget[0].category} kwa wiki hii ili kufikia lengo lako.
                </p>
              </div>
            </div>
          )}

          {/* Budget List */}
          <div>
            {activeView === 'overview' && (
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Vikundi vya Bajeti</h3>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Budget categories</p>
                </div>
                <div className="flex items-center gap-1">
                  {totalPct >= 80 ? <TrendingUp className="size-4" style={{ color: '#f87171' }} /> : <TrendingDown className="size-4" style={{ color: '#4ade80' }} />}
                  <span style={{ fontSize: '12px', fontWeight: 700, color: totalPct >= 80 ? '#f87171' : '#4ade80' }}>
                    {totalPct >= 80 ? 'Angalia Matumizi' : 'Unafanya Vizuri'}
                  </span>
                </div>
              </div>
            )}

            {budgets.length === 0 ? (
              <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Target className="size-14 mx-auto mb-4" style={{ color: 'rgba(255,255,255,0.2)' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Bado Huna Bajeti</h3>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>Unda bajeti yako ya kwanza ili kuanza kufuatilia matumizi</p>
                <button onClick={() => setShowAddBudget(true)}
                  className="px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 mx-auto transition-all active:scale-95"
                  style={{ background: '#16a34a', color: '#fff' }}>
                  <Plus className="size-4" />Ongeza Bajeti
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {budgets.map(budget => {
                  const pct = Math.min((budget.spent / budget.limit) * 100, 100);
                  const status = getStatus(pct);
                  const StatusIcon = status.icon;
                  const remaining = Math.max(0, budget.limit - budget.spent);
                  const Icon = budget.icon;

                  return (
                    <div key={budget.id} className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`${budget.color} rounded-xl p-2.5`}>
                            <Icon className="size-5 text-white" />
                          </div>
                          <div>
                            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{budget.category}</h3>
                            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize' }}>{budget.period === 'monthly' ? 'Kila Mwezi' : 'Kila Wiki'}</p>
                          </div>
                        </div>
                        <button onClick={() => deleteBudget(budget.id)}
                          className="p-2 rounded-xl hover:bg-red-500/10 transition-colors group">
                          <Trash2 className="size-4 text-gray-600 group-hover:text-red-400" />
                        </button>
                      </div>

                      {/* Progress bar */}
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1.5">
                          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}</span>
                          <span style={{ fontSize: '12px', fontWeight: 800, color: pct >= 100 ? '#f87171' : pct >= 80 ? '#fdba74' : '#4ade80' }}>{Math.round(pct)}%</span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                          <div className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(pct, 100)}%`, background: pct >= 100 ? '#ef4444' : pct >= 80 ? '#f97316' : '#22c55e' }} />
                        </div>
                      </div>

                      {/* Status + Remaining */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg" style={{ background: status.bgStyle, border: `1px solid ${status.borderColor}` }}>
                          <StatusIcon className={`size-3.5 ${status.color}`} />
                          <span className={`text-xs font-bold ${status.color}`}>{status.label}</span>
                        </div>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                          Iliyobaki: <span style={{ fontWeight: 700, color: '#4ade80' }}>{formatCurrency(remaining)}</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Budget Modal */}
      {showAddBudget && (
        <div className="fixed inset-0 bg-black/70 flex items-end z-50">
          <div className="w-full rounded-t-3xl p-6" style={{ background: '#111816', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>Unda Bajeti</h2>
              <button onClick={() => setShowAddBudget(false)} className="p-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <span className="text-white">✕</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>Kikundi / Category</label>
                <select value={newBudget.category} onChange={e => setNewBudget({ ...newBudget, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-semibold"
                  style={{ background: 'rgba(255,255,255,0.08)', color: '#fff' }}>
                  {CATEGORIES.map(cat => <option key={cat.name} value={cat.name} style={{ background: '#111816' }}>{cat.name}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>Kikomo cha Bajeti (TZS)</label>
                <input type="number" value={newBudget.limit} onChange={e => setNewBudget({ ...newBudget, limit: e.target.value })}
                  placeholder="Weka kiasi..."
                  className="w-full px-4 py-3 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg font-bold"
                  style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', caretColor: '#4ade80' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>Muda / Period</label>
                <div className="grid grid-cols-2 gap-3">
                  {[{ id: 'monthly', label: 'Kila Mwezi' }, { id: 'weekly', label: 'Kila Wiki' }].map(p => (
                    <button key={p.id} onClick={() => setNewBudget({ ...newBudget, period: p.id as 'weekly' | 'monthly' })}
                      className="py-3 rounded-xl font-bold text-sm transition-all"
                      style={{
                        background: newBudget.period === p.id ? 'rgba(22,163,74,0.2)' : 'rgba(255,255,255,0.06)',
                        border: newBudget.period === p.id ? '1.5px solid #16a34a' : '1px solid rgba(255,255,255,0.08)',
                        color: newBudget.period === p.id ? '#4ade80' : 'rgba(255,255,255,0.6)',
                      }}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={() => setShowAddBudget(false)} variant="outline"
                className="flex-1 h-12 rounded-2xl border-white/20 text-white/70 hover:bg-white/10">
                Ghairi
              </Button>
              <button onClick={addBudget} disabled={!newBudget.limit}
                className="flex-1 h-12 rounded-2xl font-black text-sm transition-all active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-2"
                style={{ background: '#16a34a', color: '#fff' }}>
                <Plus className="size-4" />Unda Bajeti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
