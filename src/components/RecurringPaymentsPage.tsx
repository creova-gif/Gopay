import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { ArrowLeft, Plus, RefreshCw, Pause, Trash2, Calendar, Zap, Smartphone, Tv, Wifi, Check } from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { User } from '../App';

interface RecurringPaymentsPageProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

interface RecurringPayment {
  id: string;
  name: string;
  provider: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  nextDate: string;
  icon: typeof Zap;
  color: string;
  active: boolean;
  accountRef: string;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 }).format(n);

const FREQ_LABELS: Record<string, string> = {
  daily: 'Kila siku',
  weekly: 'Kila wiki',
  monthly: 'Kila mwezi',
};

const FREQ_OPTIONS = [
  { id: 'daily', label: 'Kila Siku' },
  { id: 'weekly', label: 'Kila Wiki' },
  { id: 'monthly', label: 'Kila Mwezi' },
] as const;

const CATEGORIES = [
  { id: 'tanesco', name: 'TANESCO', icon: Zap, color: '#eab308', placeholder: 'Namba ya mita' },
  { id: 'water', name: 'DAWASCO / Maji', icon: RefreshCw, color: '#3b82f6', placeholder: 'Namba ya akaunti' },
  { id: 'mobile', name: 'Simu / Data', icon: Smartphone, color: '#16a34a', placeholder: '+255 7XX XXX XXX' },
  { id: 'tv', name: 'TV / DStv / Azam', icon: Tv, color: '#8b5cf6', placeholder: 'IUC / Smart Card' },
  { id: 'internet', name: 'Internet / TTCL', icon: Wifi, color: '#06b6d4', placeholder: 'Namba ya akaunti' },
];

const INITIAL_PAYMENTS: RecurringPayment[] = [
  { id: 'r1', name: 'TANESCO LUKU', provider: 'TANESCO', amount: 50000, frequency: 'monthly', nextDate: '2025-05-01', icon: Zap, color: '#eab308', active: true, accountRef: '12345678' },
  { id: 'r2', name: 'Vodacom Data', provider: 'Vodacom', amount: 15000, frequency: 'weekly', nextDate: '2025-04-28', icon: Smartphone, color: '#e11d48', active: true, accountRef: '+255712345678' },
  { id: 'r3', name: 'DStv Compact', provider: 'DStv', amount: 35000, frequency: 'monthly', nextDate: '2025-05-05', icon: Tv, color: '#8b5cf6', active: false, accountRef: '7029381234' },
];

export function RecurringPaymentsPage({ user, accessToken, onBack }: RecurringPaymentsPageProps) {
  const [payments, setPayments] = useState<RecurringPayment[]>(INITIAL_PAYMENTS);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    categoryId: 'tanesco',
    accountRef: '',
    amount: '',
    frequency: 'monthly' as 'daily' | 'weekly' | 'monthly',
  });

  const selectedCategory = CATEGORIES.find(c => c.id === form.categoryId)!;

  const totalMonthly = payments
    .filter(p => p.active)
    .reduce((sum, p) => {
      if (p.frequency === 'monthly') return sum + p.amount;
      if (p.frequency === 'weekly') return sum + p.amount * 4;
      if (p.frequency === 'daily') return sum + p.amount * 30;
      return sum;
    }, 0);

  const toggleActive = (id: string) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
    toast.success('Hali imesasishwa');
  };

  const deletePayment = (id: string) => {
    setPayments(prev => prev.filter(p => p.id !== id));
    toast.success('Malipo ya mara kwa mara yamefutwa');
  };

  const handleSave = async () => {
    if (!form.accountRef || !form.amount) {
      toast.error('Jaza taarifa zote zinazohitajika');
      return;
    }
    setSaving(true);
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/recurring/create`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({ ...form, userId: user.id }),
        }
      );
    } catch { /* demo */ }

    const cat = CATEGORIES.find(c => c.id === form.categoryId)!;
    const newPayment: RecurringPayment = {
      id: `r_${Date.now()}`,
      name: cat.name,
      provider: cat.name,
      amount: Number(form.amount),
      frequency: form.frequency,
      nextDate: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10),
      icon: cat.icon,
      color: cat.color,
      active: true,
      accountRef: form.accountRef,
    };
    setPayments(prev => [newPayment, ...prev]);
    setForm({ categoryId: 'tanesco', accountRef: '', amount: '', frequency: 'monthly' });
    setShowAdd(false);
    setSaving(false);
    toast.success('Malipo ya mara kwa mara yameanzishwa!');
  };

  return (
    <div className="min-h-screen pb-10" style={{ background: '#080d08' }}>
      {/* Header */}
      <div className="px-5 pt-8 pb-6" style={{ background: 'linear-gradient(135deg, #14532d 0%, #052e16 100%)' }}>
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="p-2.5 rounded-full active:scale-95"
            style={{ background: 'rgba(255,255,255,0.15)' }}>
            <ArrowLeft className="size-5 text-white" />
          </button>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#fff' }}>Malipo ya Mara kwa Mara</h1>
        </div>

        {/* Summary card */}
        <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '6px' }}>
            JUMLA YA MWEZI HUU (INAYOTARAJIWA)
          </p>
          <p style={{ fontSize: '32px', fontWeight: 900, color: '#fff', letterSpacing: '-1.5px' }}>
            {formatCurrency(totalMonthly)}
          </p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
            {payments.filter(p => p.active).length} malipo yenye nguvu kati ya {payments.length}
          </p>
        </div>
      </div>

      <div className="px-5 py-5 space-y-4">
        {/* Add button */}
        <button
          onClick={() => setShowAdd(true)}
          className="w-full h-12 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          style={{ background: '#16a34a', color: '#fff', fontSize: '14px', fontWeight: 700 }}
        >
          <Plus className="size-5" />
          Ongeza Malipo Mapya
        </button>

        {/* Add form */}
        <AnimatePresence>
          {showAdd && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="rounded-2xl p-5 space-y-4"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Malipo Mapya</p>

                {/* Category selector */}
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map(cat => {
                    const Icon = cat.icon;
                    const sel = form.categoryId === cat.id;
                    return (
                      <button key={cat.id}
                        onClick={() => setForm(f => ({ ...f, categoryId: cat.id }))}
                        className="p-3 rounded-xl flex flex-col items-center gap-1.5 transition-all active:scale-95"
                        style={{
                          background: sel ? `${cat.color}20` : 'rgba(255,255,255,0.04)',
                          border: sel ? `1.5px solid ${cat.color}` : '1px solid rgba(255,255,255,0.08)',
                        }}>
                        <Icon className="size-5" style={{ color: sel ? cat.color : 'rgba(255,255,255,0.4)' }} />
                        <span style={{ fontSize: '10px', fontWeight: 600, color: sel ? '#fff' : 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: 1.2 }}>{cat.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Account reference */}
                <div>
                  <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                    {selectedCategory.placeholder}
                  </label>
                  <input
                    value={form.accountRef}
                    onChange={e => setForm(f => ({ ...f, accountRef: e.target.value }))}
                    placeholder={selectedCategory.placeholder}
                    className="w-full h-11 px-4 mt-1 rounded-xl border-0 focus:outline-none text-sm text-white"
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                  />
                </div>

                {/* Amount */}
                <div>
                  <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                    Kiasi (TZS)
                  </label>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                    placeholder="Ingiza kiasi"
                    className="w-full h-11 px-4 mt-1 rounded-xl border-0 focus:outline-none text-sm text-white"
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                  />
                </div>

                {/* Frequency */}
                <div className="flex gap-2">
                  {FREQ_OPTIONS.map(opt => (
                    <button key={opt.id}
                      onClick={() => setForm(f => ({ ...f, frequency: opt.id }))}
                      className="flex-1 h-9 rounded-xl text-xs font-bold transition-all active:scale-95"
                      style={{
                        background: form.frequency === opt.id ? '#16a34a' : 'rgba(255,255,255,0.06)',
                        color: form.frequency === opt.id ? '#fff' : 'rgba(255,255,255,0.4)',
                        border: form.frequency === opt.id ? 'none' : '1px solid rgba(255,255,255,0.08)',
                      }}>
                      {opt.label}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setShowAdd(false)}
                    className="flex-1 h-11 rounded-xl text-sm font-semibold transition-all active:scale-95"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}>
                    Ghairi
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    className="flex-1 h-11 rounded-xl text-sm font-semibold transition-all active:scale-95 disabled:opacity-50"
                    style={{ background: '#16a34a', color: '#fff' }}>
                    {saving ? 'Inahifadhi...' : 'Hifadhi'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Payments list */}
        {payments.length === 0 ? (
          <div className="rounded-2xl p-10 text-center"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Calendar className="size-12 mx-auto mb-3" style={{ color: 'rgba(255,255,255,0.2)' }} />
            <p style={{ fontSize: '15px', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>Hakuna malipo ya mara kwa mara</p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>Bonyeza kitufe hapo juu kuanzisha</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div key={p.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-2xl p-4"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${p.active ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}`,
                    opacity: p.active ? 1 : 0.5,
                  }}>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${p.color}20`, border: `1px solid ${p.color}30` }}>
                      <Icon className="size-5" style={{ color: p.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '2px' }}>{p.name}</p>
                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                        {FREQ_LABELS[p.frequency]} · Inayofuata: {new Date(p.nextDate).toLocaleDateString('sw-TZ', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p style={{ fontSize: '15px', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
                        {formatCurrency(p.amount)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => toggleActive(p.id)}
                      className="flex-1 h-8 rounded-lg flex items-center justify-center gap-1.5 transition-all active:scale-95"
                      style={{
                        background: p.active ? 'rgba(234,179,8,0.12)' : 'rgba(22,163,74,0.12)',
                        border: p.active ? '1px solid rgba(234,179,8,0.2)' : '1px solid rgba(22,163,74,0.2)',
                      }}>
                      {p.active
                        ? <><Pause className="size-3.5" style={{ color: '#facc15' }} /><span style={{ fontSize: '11px', fontWeight: 600, color: '#facc15' }}>Simama</span></>
                        : <><Check className="size-3.5" style={{ color: '#4ade80' }} /><span style={{ fontSize: '11px', fontWeight: 600, color: '#4ade80' }}>Anza</span></>
                      }
                    </button>
                    <button
                      onClick={() => deletePayment(p.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-95"
                      style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.15)' }}>
                      <Trash2 className="size-3.5" style={{ color: '#f87171' }} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
