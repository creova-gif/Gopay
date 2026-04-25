import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { User } from '../App';
import { 
  ArrowLeft, Users, Plus, Share2, Target, Calendar,
  DollarSign, Check, Clock, AlertCircle, Copy,
  ChevronRight, TrendingUp, Award, Lock, Unlock,
  Settings, Download, Link as LinkIcon, Zap, CreditCard, Shield
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface GroupMoneyPoolsProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

interface Pool {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  organizer: string;
  organizerId: string;
  contributors: Contributor[];
  status: 'active' | 'completed' | 'expired';
  visibility: 'public' | 'private';
  autoDisburse: boolean;
  disburseRules?: DisburseRule[];
  shareLink: string;
  createdAt: string;
  category: 'travel' | 'event' | 'savings' | 'emergency' | 'business' | 'other';
}

interface Contributor {
  id: string;
  name: string;
  amount: number;
  timestamp: string;
  isExternal?: boolean;
}

interface DisburseRule {
  type: 'equal' | 'percentage' | 'fixed';
  recipient: string;
  recipientId?: string;
  amount?: number;
  percentage?: number;
}

export function GroupMoneyPools({ user, accessToken, onBack }: GroupMoneyPoolsProps) {
  const [view, setView] = useState<'home' | 'create' | 'pool-detail' | 'contribute' | 'settings'>('home');
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [contributionAmount, setContributionAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'mpesa' | 'card' | 'applepay'>('wallet');

  // Form state for creating pool
  const [newPool, setNewPool] = useState({
    name: '',
    description: '',
    targetAmount: '',
    deadline: '',
    category: 'savings' as Pool['category'],
    visibility: 'private' as Pool['visibility'],
    autoDisburse: false,
  });

  const myPools: Pool[] = [
    {
      id: '1',
      name: 'Family Zanzibar Trip 🏝️',
      description: 'Weekend getaway for 8 family members - ferry, hotel & meals',
      targetAmount: 2400000,
      currentAmount: 1850000,
      deadline: '2025-12-15',
      organizer: user.name,
      organizerId: user.id,
      contributors: [
        { id: '1', name: user.name, amount: 500000, timestamp: '2025-11-20' },
        { id: '2', name: 'John Mwangi', amount: 400000, timestamp: '2025-11-21' },
        { id: '3', name: 'Sarah Kamau', amount: 350000, timestamp: '2025-11-22' },
        { id: '4', name: 'Grace (External)', amount: 300000, timestamp: '2025-11-23', isExternal: true },
        { id: '5', name: 'Peter Njoroge', amount: 300000, timestamp: '2025-11-24' },
      ],
      status: 'active',
      visibility: 'private',
      autoDisburse: true,
      disburseRules: [
        { type: 'percentage', recipient: 'Azam Marine', percentage: 30 },
        { type: 'percentage', recipient: 'Zanzibar Beach Hotel', percentage: 50 },
        { type: 'percentage', recipient: 'Group Meals Fund', percentage: 20 },
      ],
      shareLink: 'gopay.tz/pool/family-zanzibar-2025',
      createdAt: '2025-11-18',
      category: 'travel',
    },
    {
      id: '2',
      name: 'Wedding Contribution - Jane & Mike',
      description: 'Contribute to our friends\' wedding celebration',
      targetAmount: 5000000,
      currentAmount: 3200000,
      deadline: '2025-12-01',
      organizer: 'James Mushi',
      organizerId: 'user-james',
      contributors: [
        { id: '1', name: user.name, amount: 200000, timestamp: '2025-11-15' },
        { id: '2', name: 'Various contributors', amount: 3000000, timestamp: '2025-11-20' },
      ],
      status: 'active',
      visibility: 'public',
      autoDisburse: false,
      shareLink: 'gopay.tz/pool/jane-mike-wedding',
      createdAt: '2025-11-10',
      category: 'event',
    },
  ];

  const participatingPools: Pool[] = [
    {
      id: '3',
      name: 'Office Party December 2025',
      description: 'Year-end celebration at Kariakoo Restaurant',
      targetAmount: 800000,
      currentAmount: 650000,
      deadline: '2025-11-30',
      organizer: 'Mary Kioko',
      organizerId: 'user-mary',
      contributors: [
        { id: '1', name: user.name, amount: 50000, timestamp: '2025-11-18' },
        { id: '2', name: 'Various colleagues', amount: 600000, timestamp: '2025-11-20' },
      ],
      status: 'active',
      visibility: 'private',
      autoDisburse: true,
      shareLink: 'gopay.tz/pool/office-party-dec',
      createdAt: '2025-11-15',
      category: 'event',
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressPercentage = (pool: Pool) => {
    return Math.min((pool.currentAmount / pool.targetAmount) * 100, 100);
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getCategoryIcon = (category: Pool['category']) => {
    switch (category) {
      case 'travel': return '✈️';
      case 'event': return '🎉';
      case 'savings': return '💰';
      case 'emergency': return '🚨';
      case 'business': return '💼';
      default: return '🎯';
    }
  };

  const handleCreatePool = async () => {
    if (!newPool.name || !newPool.targetAmount || !newPool.deadline) {
      toast.error('Please fill in all required fields');
      return;
    }

    // TODO: API call to create pool
    toast.success(`Pool "${newPool.name}" created! Share link: gopay.tz/pool/${newPool.name.toLowerCase().replace(/\s+/g, '-')}`);
    setView('home');
  };

  const handleContribute = async () => {
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    // TODO: API call to contribute
    toast.success(`✅ Contributed ${formatCurrency(parseFloat(contributionAmount))} to "${selectedPool?.name}"`);
    setView('pool-detail');
    setContributionAmount('');
  };

  const copyShareLink = (link: string) => {
    navigator.clipboard.writeText(`https://${link}`);
    toast.success('📋 Link copied! Share with anyone to collect contributions.');
  };

  // Home View
  if (view === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50 pb-20">
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">Group Money Pools 🤝</h1>
              <p className="text-sm text-gray-500">Collect & manage group funds</p>
            </div>
            <button
              onClick={() => setView('create')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-full hover:shadow-lg transition-all"
            >
              <Plus className="size-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Live Feature Banner - goPay Green */}
          <div className="bg-gradient-to-br from-primary-700 to-primary-900 rounded-3xl p-6 text-white relative overflow-hidden">
            {/* Live indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-success-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium">Live</span>
            </div>
            
            <div className="flex items-start justify-between mb-4 pr-20">
              <div>
                <h2 className="text-2xl font-bold mb-2">Vikundi vya Pesa</h2>
                <p className="text-sm text-white/90 leading-relaxed">
                  Pool Money Together • Safari, events, akiba & zaidi
                </p>
                <p className="text-xs text-white/80 mt-2">
                  Last updated: Just now
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 text-xs flex-wrap">
              <div className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Shareable Links</span>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Instant Updates</span>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Auto-Disburse</span>
              </div>
            </div>
          </div>

          {/* My Pools - Live Dashboard */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="bg-primary-100 p-2 rounded-lg">
                  <Target className="w-5 h-5 text-primary-700" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-neutral-900">
                    Vikundi Vyangu
                  </h3>
                  <p className="text-xs text-neutral-500">
                    {myPools.length} active pools
                  </p>
                </div>
              </div>
              <button className="text-sm text-primary-700 font-semibold hover:text-primary-800 transition-colors">
                View All →
              </button>
            </div>

            {myPools.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border-2 border-dashed border-neutral-200">
                <div className="bg-neutral-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-neutral-400" />
                </div>
                <h4 className="text-base font-semibold text-neutral-900 mb-2">
                  No pools yet
                </h4>
                <p className="text-sm text-neutral-600 mb-4 max-w-xs mx-auto">
                  Anza kikundi cha kwanza cha pesa. Pool money with friends & family!
                </p>
                <Button
                  onClick={() => setView('create')}
                  className="bg-primary-700 hover:bg-primary-800 text-white px-6 py-3 rounded-xl font-medium transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Pool
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {myPools.map((pool) => {
                  const progress = getProgressPercentage(pool);
                  const daysLeft = getDaysRemaining(pool.deadline);
                  
                  return (
                    <button
                      key={pool.id}
                      onClick={() => {
                        setSelectedPool(pool);
                        setView('pool-detail');
                      }}
                      className="w-full bg-white rounded-2xl p-4 border-2 border-purple-100 hover:border-purple-300 transition-all text-left"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">{getCategoryIcon(pool.category)}</span>
                            <h4 className="font-bold line-clamp-1">{pool.name}</h4>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{pool.description}</p>
                        </div>
                        <ChevronRight className="size-5 text-gray-400 flex-shrink-0 ml-2" />
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="font-semibold text-purple-600">
                            {formatCurrency(pool.currentAmount)}
                          </span>
                          <span className="text-gray-500">
                            {formatCurrency(pool.targetAmount)}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Footer Stats */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3 text-gray-600">
                          <span className="flex items-center gap-1">
                            <Users className="size-3" />
                            {pool.contributors.length} contributors
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                          </span>
                        </div>
                        {pool.status === 'completed' && (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                            ✓ Completed
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Participating Pools */}
          {participatingPools.length > 0 && (
            <div>
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Users className="size-5 text-blue-600" />
                Pools I've Joined ({participatingPools.length})
              </h3>
              <div className="space-y-3">
                {participatingPools.map((pool) => {
                  const progress = getProgressPercentage(pool);
                  const myContribution = pool.contributors.find(c => c.name === user.name);
                  
                  return (
                    <button
                      key={pool.id}
                      onClick={() => {
                        setSelectedPool(pool);
                        setView('pool-detail');
                      }}
                      className="w-full bg-white rounded-2xl p-4 border border-gray-100 hover:border-blue-300 transition-all text-left"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-bold line-clamp-1">{pool.name}</h4>
                          <p className="text-xs text-gray-500">by {pool.organizer}</p>
                        </div>
                        {myContribution && (
                          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold">
                            You: {formatCurrency(myContribution.amount)}
                          </span>
                        )}
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Actions - Redesigned */}
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="bg-primary-700 p-2 rounded-lg">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-base font-semibold text-neutral-900">
                  Quick Start
                </h3>
              </div>
              <span className="text-xs text-primary-700 font-medium">Popular types</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '✈️', label: 'Safari Group', sublabel: 'Travel together', category: 'travel' },
                { icon: '🎉', label: 'Event Fund', sublabel: 'Celebrations', category: 'event' },
                { icon: '💰', label: 'Savings Club', sublabel: 'Akiba pamoja', category: 'savings' },
                { icon: '💼', label: 'Business', sublabel: 'Biashara fund', category: 'business' },
              ].map((item) => (
                <button
                  key={item.category}
                  onClick={() => {
                    setNewPool({ ...newPool, category: item.category as Pool['category'] });
                    setView('create');
                  }}
                  className="bg-white rounded-xl p-4 border-2 border-neutral-200 hover:border-primary-500 hover:shadow-md transition-all active:scale-95 text-left group"
                >
                  <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">{item.icon}</span>
                  <p className="text-sm font-semibold text-neutral-900 mb-0.5">{item.label}</p>
                  <p className="text-xs text-neutral-500">{item.sublabel}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Trust Badge */}
          <div className="bg-white border-2 border-primary-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="bg-primary-100 p-3 rounded-full">
              <Shield className="w-6 h-6 text-primary-700" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-neutral-900 mb-1">
                Secure & Transparent
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                All pools are monitored in real-time. Auto-disburse when goal reached.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Create Pool View
  if (view === 'create') {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('home')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-lg font-bold">Create Money Pool</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-blue-900 font-semibold mb-1">Anyone can contribute</p>
              <p className="text-xs text-blue-800">
                Your shareable link works for goPay users AND non-users (via Apple Pay, card, mobile money)
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-4 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Pool Name *
              </label>
              <input
                type="text"
                placeholder="e.g., Family Trip to Zanzibar"
                value={newPool.name}
                onChange={(e) => setNewPool({ ...newPool, name: e.target.value })}
                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description
              </label>
              <textarea
                placeholder="What is this pool for?"
                value={newPool.description}
                onChange={(e) => setNewPool({ ...newPool, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Target Amount (TZS) *
              </label>
              <input
                type="number"
                placeholder="0"
                value={newPool.targetAmount}
                onChange={(e) => setNewPool({ ...newPool, targetAmount: e.target.value })}
                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Deadline *
              </label>
              <input
                type="date"
                value={newPool.deadline}
                onChange={(e) => setNewPool({ ...newPool, deadline: e.target.value })}
                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Category
              </label>
              <select
                value={newPool.category}
                onChange={(e) => setNewPool({ ...newPool, category: e.target.value as Pool['category'] })}
                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
              >
                <option value="travel">✈️ Travel</option>
                <option value="event">🎉 Event</option>
                <option value="savings">💰 Savings</option>
                <option value="emergency">🚨 Emergency</option>
                <option value="business">💼 Business</option>
                <option value="other">🎯 Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Visibility
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setNewPool({ ...newPool, visibility: 'private' })}
                  className={`flex-1 p-3 border-2 rounded-xl transition-all ${
                    newPool.visibility === 'private'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200'
                  }`}
                >
                  <Lock className="size-5 mx-auto mb-1" />
                  <p className="text-sm font-semibold">Private</p>
                  <p className="text-xs text-gray-500">Only via link</p>
                </button>
                <button
                  onClick={() => setNewPool({ ...newPool, visibility: 'public' })}
                  className={`flex-1 p-3 border-2 rounded-xl transition-all ${
                    newPool.visibility === 'public'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200'
                  }`}
                >
                  <Unlock className="size-5 mx-auto mb-1" />
                  <p className="text-sm font-semibold">Public</p>
                  <p className="text-xs text-gray-500">Discoverable</p>
                </button>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newPool.autoDisburse}
                  onChange={(e) => setNewPool({ ...newPool, autoDisburse: e.target.checked })}
                  className="mt-0.5 w-5 h-5 rounded accent-purple-600"
                />
                <div className="flex-1">
                  <p className="font-semibold text-sm text-purple-900">Auto-Disburse</p>
                  <p className="text-xs text-purple-700">
                    Automatically split funds to recipients when target is reached
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 max-w-md mx-auto">
          <Button
            onClick={handleCreatePool}
            className="w-full h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full font-bold text-lg"
          >
            Create Pool & Get Link
          </Button>
        </div>
      </div>
    );
  }

  // Pool Detail View
  if (view === 'pool-detail' && selectedPool) {
    const progress = getProgressPercentage(selectedPool);
    const daysLeft = getDaysRemaining(selectedPool.deadline);
    const isOrganizer = selectedPool.organizerId === user.id;

    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('home')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-lg font-bold flex-1 line-clamp-1">{selectedPool.name}</h1>
            {isOrganizer && (
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Settings className="size-5" />
              </button>
            )}
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Progress Card */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-white/80 mb-1">Current Amount</p>
                <p className="text-3xl font-bold">{formatCurrency(selectedPool.currentAmount)}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm text-center">
                <p className="text-2xl font-bold">{Math.round(progress)}%</p>
                <p className="text-xs text-white/80">reached</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Target: {formatCurrency(selectedPool.targetAmount)}</span>
                <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex gap-3 text-sm">
              <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center justify-center gap-2">
                <Users className="size-4" />
                <span>{selectedPool.contributors.length} contributors</span>
              </div>
              <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center justify-center gap-2">
                <Calendar className="size-4" />
                <span>Deadline: {new Date(selectedPool.deadline).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Share Link */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <Share2 className="size-5 text-purple-600" />
              <h3 className="font-bold">Share Link</h3>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 bg-gray-100 rounded-xl px-4 py-3 text-sm font-mono text-gray-700 truncate">
                {selectedPool.shareLink}
              </div>
              <button
                onClick={() => copyShareLink(selectedPool.shareLink)}
                className="bg-purple-100 text-purple-700 p-3 rounded-xl hover:bg-purple-200 transition-all"
              >
                <Copy className="size-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 Anyone with this link can contribute - even without goPay account
            </p>
          </div>

          {/* Description */}
          {selectedPool.description && (
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <h3 className="font-bold mb-2">About This Pool</h3>
              <p className="text-sm text-gray-700">{selectedPool.description}</p>
            </div>
          )}

          {/* Auto-Disburse Rules */}
          {selectedPool.autoDisburse && selectedPool.disburseRules && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Zap className="size-5 text-green-600" />
                Auto-Disburse Rules
              </h3>
              <div className="space-y-2">
                {selectedPool.disburseRules.map((rule, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-3 flex items-center justify-between">
                    <span className="text-sm font-semibold">{rule.recipient}</span>
                    <span className="text-sm text-green-600 font-bold">
                      {rule.percentage ? `${rule.percentage}%` : formatCurrency(rule.amount || 0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contributors */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <h3 className="font-bold mb-3">Contributors ({selectedPool.contributors.length})</h3>
            <div className="space-y-2">
              {selectedPool.contributors.map((contributor, idx) => (
                <div key={contributor.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {contributor.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{contributor.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(contributor.timestamp).toLocaleDateString()}
                        {contributor.isExternal && ' • via Apple Pay'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-600">{formatCurrency(contributor.amount)}</p>
                    {idx === 0 && (
                      <span className="text-xs text-amber-600 flex items-center gap-1">
                        <Award className="size-3" />
                        Top donor
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 max-w-md mx-auto">
          <div className="flex gap-3">
            <button
              onClick={() => copyShareLink(selectedPool.shareLink)}
              className="flex-1 h-14 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="size-5" />
              Share
            </button>
            <Button
              onClick={() => setView('contribute')}
              className="flex-1 h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full font-bold"
            >
              <DollarSign className="size-5 mr-2" />
              Contribute
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Contribute View
  if (view === 'contribute' && selectedPool) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('pool-detail')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-lg font-bold">Contribute to Pool</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Pool Summary */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <h3 className="font-bold mb-2">{selectedPool.name}</h3>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Still needed:</span>
              <span className="font-bold text-purple-600">
                {formatCurrency(selectedPool.targetAmount - selectedPool.currentAmount)}
              </span>
            </div>
          </div>

          {/* Amount Input */}
          <div className="bg-white rounded-2xl p-4">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Contribution Amount (TZS)
            </label>
            <input
              type="number"
              placeholder="Enter amount"
              value={contributionAmount}
              onChange={(e) => setContributionAmount(e.target.value)}
              className="w-full h-16 px-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-2xl font-bold"
            />

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-2 mt-3">
              {[10000, 20000, 50000, 100000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setContributionAmount(amount.toString())}
                  className="bg-gray-100 hover:bg-purple-100 border-2 border-transparent hover:border-purple-300 rounded-lg py-2 text-sm font-semibold transition-all"
                >
                  {formatCurrency(amount)}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl p-4">
            <h3 className="font-bold mb-3">Payment Method</h3>
            <div className="space-y-2">
              {[
                { id: 'wallet', label: 'goPay Wallet', icon: '💳', balance: 450000 },
                { id: 'mpesa', label: 'M-Pesa', icon: '📱', balance: null },
                { id: 'card', label: 'Debit/Credit Card', icon: '💳', balance: null },
                { id: 'applepay', label: 'Apple Pay', icon: '🍎', balance: null },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`w-full p-3 border-2 rounded-xl transition-all flex items-center justify-between ${
                    paymentMethod === method.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{method.icon}</span>
                    <div className="text-left">
                      <p className="font-semibold text-sm">{method.label}</p>
                      {method.balance !== null && (
                        <p className="text-xs text-gray-500">Balance: {formatCurrency(method.balance)}</p>
                      )}
                    </div>
                  </div>
                  {paymentMethod === method.id && (
                    <Check className="size-5 text-purple-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900">
              Your contribution is non-refundable. Funds will be held until the pool reaches its target or deadline.
            </p>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 max-w-md mx-auto">
          <Button
            onClick={handleContribute}
            className="w-full h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full font-bold text-lg"
          >
            Contribute {contributionAmount ? formatCurrency(parseFloat(contributionAmount)) : ''}
          </Button>
        </div>
      </div>
    );
  }

  return null;
}