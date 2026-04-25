import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { User } from '../App';
import {
  ArrowLeft, TrendingUp, TrendingDown, Filter, Search,
  Calendar, Download, ChevronRight, ShoppingBag, Zap, Send, Plane,
  CreditCard, RefreshCw, CheckCircle, Clock, XCircle, Copy, Share2,
  AlertCircle
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { motion } from 'motion/react';
import { BottomSheet } from './ui/BottomSheet';

interface TransactionHistoryProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

type FilterType = 'all' | 'income' | 'expense' | 'pending';
type CategoryType = 'all' | 'shopping' | 'bills' | 'transfer' | 'travel';

export function TransactionHistory({ user, accessToken, onBack }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [category, setCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTx, setSelectedTx] = useState<any | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/transactions/history`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
      } else {
        toast.error('Failed to load transactions');
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Network error. Could not load transactions.');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const demoTransactions = [
    {
      id: 'tx1',
      type: 'expense',
      category: 'shopping',
      title: 'Jumia Tanzania',
      description: 'Samsung Galaxy A54',
      amount: -850000,
      status: 'completed',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      icon: '🛒'
    },
    {
      id: 'tx2',
      type: 'income',
      category: 'transfer',
      title: 'Money Received',
      description: 'From John Doe',
      amount: 50000,
      status: 'completed',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      icon: '💰'
    },
    {
      id: 'tx3',
      type: 'expense',
      category: 'bills',
      title: 'TANESCO',
      description: 'Electricity bill payment',
      amount: -45000,
      status: 'completed',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      icon: '⚡'
    },
    {
      id: 'tx4',
      type: 'expense',
      category: 'shopping',
      title: 'Glovo',
      description: 'Food delivery',
      amount: -25000,
      status: 'completed',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      icon: '🍔'
    },
    {
      id: 'tx5',
      type: 'expense',
      category: 'travel',
      title: 'Precision Air',
      description: 'DAR → ZNZ Flight',
      amount: -250000,
      status: 'completed',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      icon: '✈️'
    },
    {
      id: 'tx6',
      type: 'expense',
      category: 'bills',
      title: 'Vodacom',
      description: 'Airtime purchase',
      amount: -20000,
      status: 'completed',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      icon: '📱'
    },
    {
      id: 'tx7',
      type: 'expense',
      category: 'transfer',
      title: 'Money Sent',
      description: 'To Mary Mwangi',
      amount: -100000,
      status: 'completed',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      icon: '💸'
    },
    {
      id: 'tx8',
      type: 'pending',
      category: 'shopping',
      title: 'Kilimall',
      description: 'Smart TV 43"',
      amount: -650000,
      status: 'pending',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      icon: '📺'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-TZ', { month: 'short', day: 'numeric' });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="size-4 text-green-600" />;
      case 'pending':
        return <Clock className="size-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="size-4 text-red-600" />;
      default:
        return null;
    }
  };

  const filteredTransactions = transactions
    .filter(tx => {
      if (filter !== 'all' && tx.type !== filter) return false;
      if (category !== 'all' && tx.category !== category) return false;
      if (searchQuery && !tx.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !tx.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });

  const totalIncome = transactions
    .filter(tx => tx.type === 'income' && tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = transactions
    .filter(tx => tx.type === 'expense' && tx.status === 'completed')
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const groupedTransactions = filteredTransactions.reduce((groups: any, tx) => {
    const date = new Date(tx.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let label = '';
    if (date.toDateString() === today.toDateString()) {
      label = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      label = 'Yesterday';
    } else {
      label = date.toLocaleDateString('en-TZ', { month: 'long', day: 'numeric', year: 'numeric' });
    }

    if (!groups[label]) {
      groups[label] = [];
    }
    groups[label].push(tx);
    return groups;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen pb-6" style={{ background: '#080d08' }}>
        <div className="px-4 pt-8 pb-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full animate-pulse" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <div className="h-6 w-40 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.08)' }} />
        </div>
        <div className="px-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-4 rounded-2xl animate-pulse"
              style={{ background: 'rgba(255,255,255,0.04)', animationDelay: `${i * 60}ms` }}>
              <div className="w-11 h-11 rounded-xl flex-shrink-0" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 rounded-full w-3/4" style={{ background: 'rgba(255,255,255,0.08)' }} />
                <div className="h-3 rounded-full w-1/2" style={{ background: 'rgba(255,255,255,0.05)' }} />
              </div>
              <div className="h-4 w-16 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-6" style={{ background: '#080d08' }}>
      {/* Header */}
      <div className="sticky top-0 z-20" style={{ background: '#080d08', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={onBack}
              className="p-2.5 rounded-full transition-all active:scale-95"
              style={{ background: 'rgba(255,255,255,0.08)' }}
              aria-label="Rudi nyuma"
            >
              <ArrowLeft className="size-5 text-white" />
            </button>
            <h1 className="text-xl font-bold flex-1 text-white">Shughuli za Malipo</h1>
            <button
              onClick={handleRefresh}
              className="p-2.5 rounded-full transition-all active:scale-95"
              style={{ background: 'rgba(255,255,255,0.08)' }}
              disabled={refreshing}
              aria-label="Onyesha upya"
            >
              <RefreshCw className={`size-5 text-white ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button className="p-2.5 rounded-full transition-all active:scale-95"
              style={{ background: 'rgba(255,255,255,0.08)' }}
              aria-label="Pakua">
              <Download className="size-5 text-white" />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
            <input
              type="text"
              placeholder="Tafuta shughuli..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-4 rounded-2xl border-0 focus:outline-none text-sm"
              style={{ background: 'rgba(255,255,255,0.06)', color: '#fff' }}
              aria-label="Tafuta shughuli"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {[
              { id: 'all', label: 'Zote', icon: Filter },
              { id: 'income', label: 'Pato', icon: TrendingUp },
              { id: 'expense', label: 'Matumizi', icon: TrendingDown },
              { id: 'pending', label: 'Inasubiri', icon: Clock }
            ].map((f) => {
              const Icon = f.icon;
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id as FilterType)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full whitespace-nowrap transition-all active:scale-95"
                  style={{
                    background: active ? '#16a34a' : 'rgba(255,255,255,0.06)',
                    color: active ? '#fff' : 'rgba(255,255,255,0.5)',
                    border: active ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  }}
                  aria-pressed={active}
                >
                  <Icon className="size-3.5" />
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 pt-5 pb-4 grid grid-cols-2 gap-3">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="rounded-2xl p-4"
          style={{ background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.2)' }}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="size-4" style={{ color: '#4ade80' }} />
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Jumla Pato</p>
          </div>
          <p style={{ fontSize: '20px', fontWeight: 800, color: '#4ade80', letterSpacing: '-0.5px' }}>{formatCurrency(totalIncome)}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl p-4"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="size-4" style={{ color: '#f87171' }} />
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Jumla Matumizi</p>
          </div>
          <p style={{ fontSize: '20px', fontWeight: 800, color: '#f87171', letterSpacing: '-0.5px' }}>{formatCurrency(totalExpense)}</p>
        </motion.div>
      </div>

      {/* Transactions List */}
      <div className="px-4 space-y-5">
        {Object.entries(groupedTransactions).map(([date, txs]: [string, any]) => (
          <div key={date}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '10px' }}>
              {date}
            </p>
            <div className="space-y-2">
              {txs.map((tx: any, index: number) => (
                <motion.button
                  key={tx.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  onClick={() => setSelectedTx(tx)}
                  className="w-full rounded-2xl p-4 text-left transition-all active:scale-[0.98]"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{
                        background: tx.type === 'income' ? 'rgba(22,163,74,0.12)' :
                          tx.type === 'expense' ? 'rgba(239,68,68,0.1)' : 'rgba(234,179,8,0.1)'
                      }}>
                      {tx.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }} className="truncate">{tx.title}</p>
                        {getStatusIcon(tx.status)}
                      </div>
                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }} className="truncate">{tx.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p style={{
                        fontSize: '14px', fontWeight: 700,
                        color: tx.type === 'income' ? '#4ade80' : tx.type === 'expense' ? '#f87171' : '#facc15'
                      }}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </p>
                      <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginTop: '2px' }}>{formatDate(tx.timestamp)}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ))}

        {filteredTransactions.length === 0 && (
          <div className="rounded-2xl p-12 text-center"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: '40px', marginBottom: '12px' }}>📭</p>
            <p style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>Hakuna shughuli</p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>Badilisha vichujio uone zaidi</p>
          </div>
        )}
      </div>

      {/* Transaction Detail BottomSheet */}
      <BottomSheet
        open={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        title="Maelezo ya Malipo"
        showCloseButton
        showHandle
      >
        {selectedTx && (
          <div className="space-y-4 pb-2">
            {/* Amount hero */}
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3"
                style={{
                  background: selectedTx.type === 'income' ? 'rgba(22,163,74,0.12)' :
                    selectedTx.type === 'expense' ? 'rgba(239,68,68,0.1)' : 'rgba(234,179,8,0.1)'
                }}>
                {selectedTx.icon}
              </div>
              <p style={{
                fontSize: '32px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '4px',
                color: selectedTx.type === 'income' ? '#4ade80' : selectedTx.type === 'expense' ? '#f87171' : '#facc15'
              }}>
                {selectedTx.type === 'income' ? '+' : '-'}{formatCurrency(selectedTx.amount)}
              </p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{selectedTx.title}</p>
            </div>

            {/* Details grid */}
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              {[
                { label: 'Maelezo', value: selectedTx.description },
                { label: 'Hali', value: selectedTx.status === 'completed' ? '✅ Imekamilika' : selectedTx.status === 'pending' ? '⏳ Inasubiri' : '❌ Imeshindwa' },
                { label: 'Tarehe', value: new Date(selectedTx.timestamp).toLocaleString('sw-TZ') },
                { label: 'Kategoria', value: selectedTx.category },
                { label: 'Kumbukumbu', value: selectedTx.id },
              ].map((row, i, arr) => (
                <div key={row.label} className="flex items-center justify-between px-4 py-3"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none'
                  }}>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{row.label}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff', maxWidth: '55%', textAlign: 'right' }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { navigator.clipboard.writeText(selectedTx.id); toast.success('Kumbukumbu imenakiliwa!'); }}
                className="flex items-center justify-center gap-2 h-12 rounded-xl transition-all active:scale-95"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', fontWeight: 600 }}
              >
                <Copy className="size-4" /> Nakili ID
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: 'Risiti ya goPay', text: `${selectedTx.title}: ${formatCurrency(selectedTx.amount)} — ${new Date(selectedTx.timestamp).toLocaleDateString()}` });
                  } else {
                    toast.info('Shiriki haipatikani');
                  }
                }}
                className="flex items-center justify-center gap-2 h-12 rounded-xl transition-all active:scale-95"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', fontWeight: 600 }}
              >
                <Share2 className="size-4" /> Shiriki
              </button>
            </div>

            {/* Dispute link */}
            <button
              onClick={() => { setSelectedTx(null); toast.info('Ripoti ya tatizo imesajiliwa. Tutawasiliana nawe hivi karibuni.'); }}
              className="w-full flex items-center justify-center gap-2 py-3 transition-all active:scale-95"
              style={{ fontSize: '13px', color: '#f87171', fontWeight: 500 }}
            >
              <AlertCircle className="size-4" />
              Ripoti tatizo kuhusu malipo haya
            </button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
