import { useState, useEffect } from 'react';
import { User } from '../App';
import {
  ArrowLeft, TrendingUp, TrendingDown, ShoppingBag,
  Zap, Calendar, BarChart3, ArrowUpRight, ArrowDownRight,
  Target, AlertCircle, Gift, Download, Sparkles, DollarSign
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
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
  categoryData: { category: string; swahili: string; amount: number; percentage: number; color: string; }[];
  trends: {
    spendingChange: number;
    frequentMerchant: string;
    avgTransaction: number;
  };
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 }).format(amount);

const generateDemoData = (): SpendingData => ({
  totalSpent: 1234500,
  totalEarned: 856000,
  topCategory: 'Chakula & Vinywaji',
  savingsRate: 28,
  monthlyData: [
    { month: 'Jul', spent: 180000, earned: 120000 },
    { month: 'Ago', spent: 220000, earned: 150000 },
    { month: 'Sep', spent: 195000, earned: 145000 },
    { month: 'Okt', spent: 240000, earned: 180000 },
    { month: 'Nov', spent: 210000, earned: 165000 },
    { month: 'Des', spent: 189500, earned: 96000 },
  ],
  categoryData: [
    { category: 'Food & Dining',      swahili: 'Chakula',      amount: 456000, percentage: 37, color: '#ef4444' },
    { category: 'Shopping',           swahili: 'Manunuzi',     amount: 345000, percentage: 28, color: '#3b82f6' },
    { category: 'Bills & Utilities',  swahili: 'Bili & Huduma', amount: 234000, percentage: 19, color: '#f59e0b' },
    { category: 'Travel',             swahili: 'Usafiri',      amount: 123500, percentage: 10, color: '#8b5cf6' },
    { category: 'Others',             swahili: 'Mengineyo',    amount: 76000,  percentage: 6,  color: '#6b7280' },
  ],
  trends: { spendingChange: -12.5, frequentMerchant: 'Pizza Paradise', avgTransaction: 34500 },
});

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#111a11', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '14px', padding: '12px 14px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ fontSize: '13px', fontWeight: 700, color: p.color, marginBottom: '2px' }}>
            {p.name === 'spent' ? 'Matumizi' : 'Mapato'}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function InsightsPage({ user: _user, accessToken, onBack }: InsightsPageProps) {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');
  const [insights, setInsights] = useState<SpendingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  useEffect(() => { fetchInsights(); }, [timeframe]);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/analytics/insights?timeframe=${timeframe}`,
        { headers: { 'Authorization': `Bearer ${accessToken}` } }
      );
      if (res.ok) {
        const data = await res.json();
        setInsights(data);
      } else {
        setInsights(generateDemoData());
      }
    } catch {
      setInsights(generateDemoData());
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    if (!insights) return;
    const csv = [
      ['Mwezi', 'Matumizi', 'Mapato'],
      ...insights.monthlyData.map(d => [d.month, d.spent, d.earned]),
    ].map(r => r.join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url; a.download = `goPay-uchunguzi-${timeframe}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  /* ── LOADING ── */
  if (loading || !insights) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#080d08' }}>
        <div className="text-center">
          <div className="relative mb-5 mx-auto" style={{ width: 56, height: 56 }}>
            <svg className="animate-spin" viewBox="0 0 56 56" style={{ width: 56, height: 56 }}>
              <circle cx="28" cy="28" r="22" stroke="rgba(74,222,128,0.15)" strokeWidth="4" fill="none" />
              <circle cx="28" cy="28" r="22" stroke="#4ade80" strokeWidth="4" fill="none"
                strokeDasharray="50 90" strokeLinecap="round" />
            </svg>
            <BarChart3 className="absolute inset-0 m-auto size-6" style={{ color: '#4ade80' }} />
          </div>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Inapakia takwimu…</p>
        </div>
      </div>
    );
  }

  const totalFlow = insights.totalSpent + insights.totalEarned;
  const savingsTZS = insights.totalEarned - insights.totalSpent;

  return (
    <div className="min-h-screen pb-10" style={{ background: '#080d08' }}>

      {/* ── STICKY HEADER ── */}
      <div className="sticky top-0 z-20" style={{ background: 'rgba(8,13,8,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="p-2.5 rounded-full active:scale-95" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <ArrowLeft className="size-5 text-white" />
              </button>
              <div>
                <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>Uchunguzi wa Fedha</h1>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Financial Insights</p>
              </div>
            </div>
            <button onClick={exportData} className="p-2.5 rounded-full active:scale-95" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <Download className="size-5 text-white" />
            </button>
          </div>

          {/* Timeframe tabs */}
          <div className="flex gap-2 mt-4">
            {[
              { id: 'week', label: 'Wiki' },
              { id: 'month', label: 'Mwezi' },
              { id: 'year', label: 'Mwaka' },
            ].map(tf => (
              <button
                key={tf.id}
                onClick={() => setTimeframe(tf.id as any)}
                className="flex-1 py-2 rounded-xl font-semibold text-sm transition-all active:scale-95"
                style={{
                  background: timeframe === tf.id ? '#16a34a' : 'rgba(255,255,255,0.06)',
                  color: timeframe === tf.id ? '#fff' : 'rgba(255,255,255,0.4)',
                  border: timeframe === tf.id ? '1px solid rgba(74,222,128,0.3)' : '1px solid transparent',
                  fontWeight: 700,
                }}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-5 space-y-4">

        {/* ── HERO SUMMARY ── */}
        <div className="relative rounded-[28px] p-6 overflow-hidden shadow-2xl"
          style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 50%, #14532d 100%)', border: '1px solid rgba(74,222,128,0.15)' }}>
          <div className="absolute top-0 right-0 w-56 h-56 rounded-full -mr-28 -mt-28 blur-3xl" style={{ background: 'rgba(74,222,128,0.2)' }} />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <TrendingUp className="size-4 text-white" />
              </div>
              <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.5px' }}>MUHTASARI</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <div className="flex items-center gap-1.5 mb-2">
                  <ArrowDownRight className="size-4" style={{ color: '#fca5a5' }} />
                  <p style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.3px' }}>MATUMIZI</p>
                </div>
                <p style={{ fontSize: '18px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1 }}>{formatCurrency(insights.totalSpent)}</p>
              </div>
              <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <div className="flex items-center gap-1.5 mb-2">
                  <ArrowUpRight className="size-4" style={{ color: '#86efac' }} />
                  <p style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.3px' }}>MAPATO</p>
                </div>
                <p style={{ fontSize: '18px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1 }}>{formatCurrency(insights.totalEarned)}</p>
              </div>
            </div>

            {/* savings ratio bar */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                  {savingsTZS > 0 ? `Akiba: ${formatCurrency(savingsTZS)}` : 'Matumizi Yanazidi Mapato'}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: savingsTZS > 0 ? '#86efac' : '#fca5a5' }}>
                  {insights.savingsRate}%
                </span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${Math.min((insights.totalEarned / totalFlow) * 100, 100)}%`, background: 'linear-gradient(90deg, #86efac, #4ade80)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* ── QUICK STATS ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Akiba', value: `${insights.savingsRate}%`, icon: Target, color: '#16a34a', bg: 'rgba(22,163,74,0.12)' },
            { label: 'Mabadiliko', value: `${insights.trends.spendingChange}%`, icon: insights.trends.spendingChange < 0 ? TrendingDown : TrendingUp, color: insights.trends.spendingChange < 0 ? '#4ade80' : '#ef4444', bg: insights.trends.spendingChange < 0 ? 'rgba(74,222,128,0.08)' : 'rgba(239,68,68,0.08)' },
            { label: 'Wastani/Tx', value: formatCurrency(insights.trends.avgTransaction).replace('TZS', '').trim(), icon: DollarSign, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="rounded-2xl p-3.5 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="mx-auto mb-2 p-2 rounded-xl w-fit" style={{ background: bg }}>
                <Icon className="size-4" style={{ color }} />
              </div>
              <p style={{ fontSize: '13px', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{value}</p>
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* ── CHART ── */}
        <div className="rounded-[20px] p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <p style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Mwenendo wa Fedha</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Matumizi dhidi ya Mapato</p>
            </div>
            <div className="flex gap-1.5">
              {(['bar', 'line'] as const).map(t => (
                <button key={t} onClick={() => setChartType(t)} className="p-2 rounded-xl transition-all"
                  style={{ background: chartType === t ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.06)', border: chartType === t ? '1px solid rgba(74,222,128,0.3)' : '1px solid transparent' }}>
                  {t === 'bar' ? <BarChart3 className="size-4" style={{ color: chartType === t ? '#4ade80' : 'rgba(255,255,255,0.4)' }} />
                    : <Calendar className="size-4" style={{ color: chartType === t ? '#4ade80' : 'rgba(255,255,255,0.4)' }} />}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            {chartType === 'bar' ? (
              <BarChart data={insights.monthlyData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.25)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)', radius: 8 }} />
                <Bar dataKey="spent" fill="#ef4444" radius={[8, 8, 0, 0]} maxBarSize={20} />
                <Bar dataKey="earned" fill="#4ade80" radius={[8, 8, 0, 0]} maxBarSize={20} />
              </BarChart>
            ) : (
              <LineChart data={insights.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.25)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="spent" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }} />
                <Line type="monotone" dataKey="earned" stroke="#4ade80" strokeWidth={2.5} dot={{ r: 4, fill: '#4ade80', strokeWidth: 0 }} />
              </LineChart>
            )}
          </ResponsiveContainer>

          <div className="flex items-center justify-center gap-5 mt-3">
            {[{ label: 'Matumizi', color: '#ef4444' }, { label: 'Mapato', color: '#4ade80' }].map(l => (
              <div key={l.label} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: l.color }} />
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── CATEGORY BREAKDOWN ── */}
        <div className="rounded-[20px] p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between mb-4">
            <p style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Matumizi kwa Aina</p>
            <Zap className="size-5" style={{ color: 'rgba(255,255,255,0.25)' }} />
          </div>
          <div className="space-y-3">
            {insights.categoryData.map(cat => (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: cat.color }} />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{cat.swahili}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{cat.percentage}%</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{formatCurrency(cat.amount)}</span>
                  </div>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${cat.percentage}%`, background: cat.color, opacity: 0.8 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── KEY INSIGHTS ── */}
        <div className="rounded-[20px] p-5 space-y-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>Mambo Muhimu</p>

          {[
            { icon: ShoppingBag, color: '#4ade80', bg: 'rgba(74,222,128,0.12)', label: 'Aina ya Juu', value: `${insights.topCategory} — ${formatCurrency(insights.categoryData[0].amount)}` },
            { icon: DollarSign, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', label: 'Wastani wa Muamala', value: `${formatCurrency(insights.trends.avgTransaction)} kwa muamala` },
            { icon: Gift, color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', label: 'Duka la Mara kwa Mara', value: insights.trends.frequentMerchant },
          ].map(({ icon: Icon, color, bg, label, value }) => (
            <div key={label} className="flex items-start gap-3 p-3.5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="p-2 rounded-xl flex-shrink-0" style={{ background: bg }}>
                <Icon className="size-4" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: '2px' }}>{label}</p>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff', lineHeight: 1.4 }}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── AI SMART TIP ── */}
        <div className="rounded-[20px] p-5" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(217,119,6,0.08))', border: '1px solid rgba(245,158,11,0.2)' }}>
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl flex-shrink-0" style={{ background: 'rgba(245,158,11,0.15)' }}>
              <Sparkles className="size-5" style={{ color: '#fbbf24' }} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <p style={{ fontSize: '13px', fontWeight: 800, color: '#fbbf24' }}>Ushauri wa AI</p>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(245,158,11,0.2)', color: '#fbbf24' }}>Smart</span>
              </div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                Matumizi yako ya <strong style={{ color: '#fff' }}>{insights.topCategory}</strong> ni {insights.categoryData[0].percentage}% ya matumizi yote.
                Weka bajeti ili kuongeza akiba!
              </p>
              {insights.trends.spendingChange < 0 && (
                <div className="flex items-center gap-1.5 mt-2">
                  <TrendingDown className="size-3.5" style={{ color: '#4ade80' }} />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#4ade80' }}>
                    Matumizi yameshuka {Math.abs(insights.trends.spendingChange)}% mwezi huu — hongera!
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── ALERT ── */}
        <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <AlertCircle className="size-5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }} />
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
            Takwimu zinatoka kwenye historia ya miamala yako. Tuma pesa zaidi kupitia goPay kwa uchambuzi sahihi zaidi.
          </p>
        </div>

      </div>
    </div>
  );
}
