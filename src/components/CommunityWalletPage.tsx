import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { User } from '../App';
import { 
  ArrowLeft, Users, Plus, DollarSign, TrendingUp, 
  Shield, Check, Clock, Award, Share2, Settings,
  Heart, GraduationCap, Home, Briefcase, Calendar,
  ChevronRight, Info, AlertCircle, UserPlus, Lock
} from 'lucide-react';

interface CommunityWalletPageProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

interface CommunityWallet {
  id: string;
  name: string;
  purpose: string;
  icon: any;
  color: string;
  balance: number;
  members: number;
  goal?: number;
  role: 'admin' | 'member' | 'viewer';
  createdAt: string;
}

interface Transaction {
  id: string;
  type: 'contribution' | 'withdrawal' | 'expense';
  member: string;
  amount: number;
  purpose: string;
  date: string;
  approved: boolean;
}

interface Member {
  id: string;
  name: string;
  role: 'admin' | 'member' | 'viewer';
  totalContributed: number;
  joinedAt: string;
}

export function CommunityWalletPage({ user, accessToken, onBack }: CommunityWalletPageProps) {
  const [view, setView] = useState<'list' | 'create' | 'details' | 'add-funds' | 'withdraw'>('list');
  const [selectedWallet, setSelectedWallet] = useState<CommunityWallet | null>(null);
  const [walletName, setWalletName] = useState('');
  const [walletPurpose, setWalletPurpose] = useState('');
  const [walletGoal, setWalletGoal] = useState('');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [processing, setProcessing] = useState(false);

  const [communityWallets, setCommunityWallets] = useState<CommunityWallet[]>([
    {
      id: '1',
      name: 'Village Water Project',
      purpose: 'Infrastructure development',
      icon: Home,
      color: 'from-blue-500 to-cyan-500',
      balance: 3500000,
      members: 45,
      goal: 10000000,
      role: 'admin',
      createdAt: '2025-01-10',
    },
    {
      id: '2',
      name: 'School Fees Fund',
      purpose: 'Education support',
      icon: GraduationCap,
      color: 'from-purple-500 to-pink-500',
      balance: 1200000,
      members: 12,
      goal: 5000000,
      role: 'member',
      createdAt: '2025-09-20',
    },
    {
      id: '3',
      name: 'Wedding Savings',
      purpose: 'Family celebration',
      icon: Heart,
      color: 'from-rose-500 to-pink-500',
      balance: 2100000,
      members: 8,
      goal: 8000000,
      role: 'admin',
      createdAt: '2025-06-15',
    },
  ]);

  const recentTransactions: Transaction[] = [
    {
      id: '1',
      type: 'contribution',
      member: 'John Mwangi',
      amount: 50000,
      purpose: 'Monthly contribution',
      date: '2025-11-24',
      approved: true,
    },
    {
      id: '2',
      type: 'expense',
      member: 'Admin',
      amount: 150000,
      purpose: 'Cement purchase',
      date: '2025-11-23',
      approved: true,
    },
    {
      id: '3',
      type: 'contribution',
      member: 'Mary Kamau',
      amount: 75000,
      purpose: 'Extra donation',
      date: '2025-11-22',
      approved: true,
    },
  ];

  const members: Member[] = [
    { id: '1', name: 'John Mwangi', role: 'admin', totalContributed: 500000, joinedAt: '2025-01-10' },
    { id: '2', name: 'Mary Kamau', role: 'member', totalContributed: 350000, joinedAt: '2025-02-15' },
    { id: '3', name: 'David Ochieng', role: 'member', totalContributed: 420000, joinedAt: '2025-01-25' },
  ];

  const purposeOptions = [
    { id: 'funeral', label: 'Funeral Expenses', icon: Heart },
    { id: 'wedding', label: 'Wedding Savings', icon: Heart },
    { id: 'school', label: 'School Fees', icon: GraduationCap },
    { id: 'infrastructure', label: 'Infrastructure', icon: Home },
    { id: 'business', label: 'Business Cooperative', icon: Briefcase },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleCreateWallet = () => {
    if (!walletName || !walletPurpose) {
      toast.error('Please fill in all required fields');
      return;
    }

    const purposeData = purposeOptions.find(p => p.id === walletPurpose);
    
    const newWallet: CommunityWallet = {
      id: Date.now().toString(),
      name: walletName,
      purpose: purposeData?.label || walletPurpose,
      icon: purposeData?.icon || Users,
      color: 'from-gray-500 to-gray-700',
      balance: 0,
      members: 1,
      goal: walletGoal ? parseFloat(walletGoal) : undefined,
      role: 'admin',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setCommunityWallets([newWallet, ...communityWallets]);
    setWalletName('');
    setWalletPurpose('');
    setWalletGoal('');
    setView('list');
    toast.success('Community wallet created! Invite members to start contributing.');
  };

  const handleAddFunds = () => {
    if (!selectedWallet || !amount || pin.length !== 4) {
      toast.error('Please complete all fields');
      return;
    }

    const contribution = parseFloat(amount);
    
    setCommunityWallets(communityWallets.map(w =>
      w.id === selectedWallet.id
        ? { ...w, balance: w.balance + contribution }
        : w
    ));

    toast.success(`Contributed ${formatCurrency(contribution)} to ${selectedWallet.name}`);
    setAmount('');
    setPin('');
    setView('details');
  };

  // List View
  if (view === 'list') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50">
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                <ArrowLeft className="size-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Community Wallets 🤝</h1>
                <p className="text-sm text-gray-500">Pooled savings for groups</p>
              </div>
            </div>
            <button
              onClick={() => setView('create')}
              className="bg-gradient-to-r from-orange-600 to-amber-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="size-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Hero */}
          <div className="bg-gradient-to-br from-orange-600 to-amber-600 rounded-3xl p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <Users className="size-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">Save Together</h2>
                <p className="text-white/90">For funerals, weddings, schools & projects</p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl p-3 text-center">
              <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="size-5 text-green-600" />
              </div>
              <p className="text-xs font-bold">Transparent</p>
            </div>
            <div className="bg-white rounded-2xl p-3 text-center">
              <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Lock className="size-5 text-blue-600" />
              </div>
              <p className="text-xs font-bold">Secure</p>
            </div>
            <div className="bg-white rounded-2xl p-3 text-center">
              <div className="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Check className="size-5 text-purple-600" />
              </div>
              <p className="text-xs font-bold">Approved</p>
            </div>
          </div>

          {/* Wallets */}
          <div>
            <h3 className="font-bold mb-3">Your Community Wallets ({communityWallets.length})</h3>
            <div className="space-y-3">
              {communityWallets.map((wallet) => {
                const Icon = wallet.icon;
                const progress = wallet.goal ? (wallet.balance / wallet.goal) * 100 : 0;
                
                return (
                  <button
                    key={wallet.id}
                    onClick={() => {
                      setSelectedWallet(wallet);
                      setView('details');
                    }}
                    className="w-full text-left"
                  >
                    <div className={`bg-gradient-to-br ${wallet.color} rounded-2xl p-5 text-white`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                            <Icon className="size-5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold mb-1">{wallet.name}</p>
                            <p className="text-xs text-white/80">{wallet.purpose}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          wallet.role === 'admin' ? 'bg-yellow-400/30' : 'bg-white/20'
                        }`}>
                          {wallet.role}
                        </span>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-end justify-between mb-2">
                          <div>
                            <p className="text-sm text-white/80">Current Balance</p>
                            <p className="text-2xl font-bold">{formatCurrency(wallet.balance)}</p>
                          </div>
                          {wallet.goal && (
                            <div className="text-right">
                              <p className="text-xs text-white/80">Goal</p>
                              <p className="font-semibold">{formatCurrency(wallet.goal)}</p>
                            </div>
                          )}
                        </div>
                        
                        {wallet.goal && (
                          <>
                            <div className="bg-white/20 rounded-full h-2 overflow-hidden mb-1">
                              <div
                                className="bg-white h-full transition-all"
                                style={{ width: `${Math.min(100, progress)}%` }}
                              />
                            </div>
                            <p className="text-xs text-white/80">{progress.toFixed(0)}% of goal reached</p>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="size-4" />
                          <span>{wallet.members} members</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="size-4" />
                          <span>Since {wallet.createdAt}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}

              {communityWallets.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="size-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-4">No community wallets yet</p>
                  <Button
                    onClick={() => setView('create')}
                    className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-6"
                  >
                    Create Your First Wallet
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex gap-3">
              <Info className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Perfect for:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Village development projects</li>
                  <li>Funeral contributions (mazishi)</li>
                  <li>Wedding savings</li>
                  <li>School fees pooling</li>
                  <li>Agricultural cooperatives</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Create Wallet View
  if (view === 'create') {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('list')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-lg font-bold">Create Community Wallet</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Purpose Selection */}
          <div className="bg-white rounded-2xl p-6">
            <label className="block font-bold mb-3">What's the purpose?</label>
            <div className="grid grid-cols-2 gap-3">
              {purposeOptions.map((purpose) => {
                const Icon = purpose.icon;
                return (
                  <button
                    key={purpose.id}
                    onClick={() => setWalletPurpose(purpose.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      walletPurpose === purpose.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                    }`}
                  >
                    <Icon className="size-6 text-orange-600 mb-2" />
                    <p className="font-bold text-sm">{purpose.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Wallet Details */}
          <div className="bg-white rounded-2xl p-6 space-y-4">
            <div>
              <label className="block font-bold mb-2 text-sm">Wallet Name</label>
              <input
                type="text"
                placeholder="e.g., Village Water Project"
                value={walletName}
                onChange={(e) => setWalletName(e.target.value)}
                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold mb-2 text-sm">Fundraising Goal (Optional)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="number"
                  placeholder="1000000"
                  value={walletGoal}
                  onChange={(e) => setWalletGoal(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Set a target amount to raise</p>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6">
            <h3 className="font-bold mb-3">Features</h3>
            <div className="space-y-2 text-sm">
              <div className="flex gap-2">
                <Check className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">Full transparency - all members see transactions</p>
              </div>
              <div className="flex gap-2">
                <Check className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">Role-based permissions (Admin/Member/Viewer)</p>
              </div>
              <div className="flex gap-2">
                <Check className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">Withdrawal requires admin approval</p>
              </div>
              <div className="flex gap-2">
                <Check className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">Track individual contributions</p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleCreateWallet}
            disabled={!walletName || !walletPurpose}
            className="w-full h-14 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-full font-bold text-lg disabled:opacity-50"
          >
            Create Wallet
          </Button>
        </div>
      </div>
    );
  }

  // Wallet Details View
  if (view === 'details' && selectedWallet) {
    const Icon = selectedWallet.icon;
    const progress = selectedWallet.goal ? (selectedWallet.balance / selectedWallet.goal) * 100 : 0;

    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('list')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold">{selectedWallet.name}</h1>
              <p className="text-sm text-gray-500">{selectedWallet.members} members</p>
            </div>
            {selectedWallet.role === 'admin' && (
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Settings className="size-5 text-gray-600" />
              </button>
            )}
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Balance Card */}
          <div className={`bg-gradient-to-br ${selectedWallet.color} rounded-3xl p-6 text-white`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <Icon className="size-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white/80">Total Balance</p>
                <p className="text-3xl font-bold">{formatCurrency(selectedWallet.balance)}</p>
              </div>
            </div>

            {selectedWallet.goal && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/80">Goal: {formatCurrency(selectedWallet.goal)}</span>
                  <span className="font-semibold">{progress.toFixed(0)}%</span>
                </div>
                <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-white h-full transition-all"
                    style={{ width: `${Math.min(100, progress)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => setView('add-funds')}
              className="h-14 bg-green-100 text-green-700 hover:bg-green-200 rounded-2xl font-bold"
            >
              <Plus className="size-5 mr-2" />
              Contribute
            </Button>
            {selectedWallet.role === 'admin' && (
              <Button
                onClick={() => setView('withdraw')}
                className="h-14 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-2xl font-bold"
              >
                <DollarSign className="size-5 mr-2" />
                Withdraw
              </Button>
            )}
            <button className="h-14 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-2xl font-bold flex items-center justify-center gap-2">
              <Share2 className="size-5" />
              Invite
            </button>
            <button className="h-14 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-2xl font-bold flex items-center justify-center gap-2">
              <Award className="size-5" />
              Leaderboard
            </button>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">Recent Activity</h3>
              <button className="text-sm text-orange-600 font-semibold">View All</button>
            </div>
            <div className="space-y-3">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-start justify-between pb-3 border-b border-gray-100 last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm">{tx.member}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        tx.type === 'contribution' ? 'bg-green-100 text-green-700' :
                        tx.type === 'expense' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {tx.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{tx.purpose}</p>
                    <p className="text-xs text-gray-400 mt-1">{tx.date}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      tx.type === 'contribution' ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {tx.type === 'contribution' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Members */}
          <div className="bg-white rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">Members ({members.length})</h3>
              {selectedWallet.role === 'admin' && (
                <button className="text-sm text-orange-600 font-semibold flex items-center gap-1">
                  <UserPlus className="size-4" />
                  Add
                </button>
              )}
            </div>
            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{member.name}</p>
                        {member.role === 'admin' && (
                          <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">Contributed: {formatCurrency(member.totalContributed)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Add Funds View
  if (view === 'add-funds' && selectedWallet) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('details')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-lg font-bold">Contribute Funds</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          <div className="bg-white rounded-2xl p-6">
            <label className="block font-bold mb-2">Contribution Amount</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 size-6 text-gray-400" />
              <input
                type="number"
                placeholder="50000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-16 pl-14 pr-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-2xl font-bold"
              />
            </div>
          </div>

          {/* Quick Amounts */}
          <div className="grid grid-cols-4 gap-2">
            {[10000, 25000, 50000, 100000].map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt.toString())}
                className="bg-white border-2 border-gray-200 hover:border-orange-500 rounded-xl p-3 text-sm font-semibold transition-all"
              >
                {formatCurrency(amt)}
              </button>
            ))}
          </div>

          {/* PIN */}
          <div className="bg-white rounded-2xl p-4">
            <label className="block font-bold mb-2">Enter PIN</label>
            <input
              type="password"
              maxLength={4}
              placeholder="4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full h-14 text-center text-2xl tracking-widest border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
            />
          </div>

          <Button
            onClick={handleAddFunds}
            disabled={!amount || pin.length !== 4}
            className="w-full h-14 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-full font-bold text-lg disabled:opacity-50"
          >
            Contribute {amount && formatCurrency(parseFloat(amount))}
          </Button>
        </div>
      </div>
    );
  }

  return null;
}