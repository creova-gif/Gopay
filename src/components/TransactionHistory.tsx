import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { User } from '../App';
import { 
  ArrowLeft, TrendingUp, TrendingDown, Filter, Search,
  Calendar, Download, ChevronRight, ShoppingBag, Zap, Send, Plane,
  CreditCard, RefreshCw, CheckCircle, Clock, XCircle
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { motion } from 'motion/react';

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-500">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-all"
            >
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-2xl font-bold flex-1">Transactions</h1>
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-gray-100 rounded-full transition-all"
              disabled={refreshing}
            >
              <RefreshCw className={`size-6 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <Download className="size-6" />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-gray-100 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { id: 'all', label: 'All', icon: Filter },
              { id: 'income', label: 'Income', icon: TrendingUp },
              { id: 'expense', label: 'Expense', icon: TrendingDown },
              { id: 'pending', label: 'Pending', icon: Clock }
            ].map((f) => {
              const Icon = f.icon;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id as FilterType)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    filter === f.id
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="size-4" />
                  <span className="text-sm font-medium">{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 py-6 grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="size-5" />
            <p className="text-green-100 text-sm">Total Income</p>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(totalIncome)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-5 text-white shadow-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="size-5" />
            <p className="text-red-100 text-sm">Total Expense</p>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(totalExpense)}</p>
        </motion.div>
      </div>

      {/* Transactions List */}
      <div className="px-4 space-y-6">
        {Object.entries(groupedTransactions).map(([date, txs]: [string, any]) => (
          <div key={date}>
            <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
              {date}
            </h3>
            <div className="space-y-2">
              {txs.map((tx: any, index: number) => (
                <motion.button
                  key={tx.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100 text-left"
                >
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                      tx.type === 'income' ? 'bg-green-100' :
                      tx.type === 'expense' ? 'bg-red-100' :
                      'bg-yellow-100'
                    }`}>
                      {tx.icon}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold truncate">{tx.title}</p>
                        {getStatusIcon(tx.status)}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{tx.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(tx.timestamp)}</p>
                    </div>

                    {/* Amount */}
                    <div className="text-right">
                      <p className={`font-bold text-lg ${
                        tx.type === 'income' ? 'text-green-600' :
                        tx.type === 'expense' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {tx.type === 'income' ? '+' : ''}{formatCurrency(tx.amount)}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ))}

        {filteredTransactions.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold mb-2">No transactions found</h3>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
