import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { User } from '../App';
import { 
  Wallet, 
  Home,
  History,
  User as UserIcon,
  ArrowUpRight,
  ArrowDownLeft,
  Scan,
  Zap,
  CreditCard,
  Plane,
  Send,
  Receipt,
  RefreshCw,
  Download,
  Smartphone,
  Droplet,
  GraduationCap,
  Shield,
  Car,
  Wifi,
  Phone,
  Tv,
  Building2,
  FileText,
  ChevronRight,
  Star,
  ArrowLeft,
  Eye,
  EyeOff,
  Gift,
  TrendingUp,
  MapPin,
  ShoppingBag,
  Utensils,
  Hotel,
  Bus,
  Ship,
  Mountain,
  Ticket,
  FileCheck,
  IdCard,
  Landmark,
  Heart,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  ChevronLeft,
  Plus,
  Minus,
  X,
  Check,
  Clock,
  Calendar,
  Users,
  Target,
  Award,
  Percent,
  Coins
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { 
  MPesaLogo, 
  TigoPesaLogo, 
  AirtelMoneyLogo, 
  HaloPesaLogo,
  TANESCOLogo,
  DAWASCOLogo,
  VodacomLogo,
  DSTVLogo,
  TRALogo,
  NHIFLogo,
  CRDBLogo,
  NMBLogo,
  KCBLogo,
  ZantelLogo,
  AzamTVLogo,
  StarTimesTVLogo
} from './PaymentLogos';

interface DashboardProps {
  user: User;
  accessToken: string;
  onNavigate: (page: 'wallet' | 'payments' | 'billpayments' | 'merchant' | 'travel' | 'cards' | 'export' | 'rewards' | 'shop' | 'international' | 'subscriptions' | 'shopping' | 'sendmoney') => void;
  onLogout: () => void;
}

interface WalletBalance {
  balance: number;
  currency: string;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  timestamp: string;
  status: string;
}

export function Dashboard({ user, accessToken, onNavigate, onLogout }: DashboardProps) {
  const [currentTab, setCurrentTab] = useState<'home' | 'rewards' | 'finance' | 'services' | 'profile'>('home');
  const [balance, setBalance] = useState({ balance: 450000, currency: 'TZS' });
  const [loading, setLoading] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [notificationCount, setNotificationCount] = useState(3);

  const promoBanners = [
    {
      id: 1,
      title: 'Save and win prizes',
      subtitle: 'Get cashback on every payment',
      gradient: 'from-orange-400 via-pink-500 to-purple-500',
      badge: 'PROMO',
      badgeColor: 'bg-red-500'
    },
    {
      id: 2,
      title: 'Travel with GOrewards',
      subtitle: 'Book flights and earn 2x points',
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      badge: 'NEW',
      badgeColor: 'bg-green-500'
    },
    {
      id: 3,
      title: 'Get 5% cashback',
      subtitle: 'On all bill payments this month',
      gradient: 'from-purple-500 via-pink-500 to-red-500',
      badge: 'DEAL',
      badgeColor: 'bg-yellow-500'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % promoBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchWalletData();
    fetchTransactions();
  }, []);

  const fetchWalletData = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/wallet/balance`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBalance(data);
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/transactions/recent`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const quickServices = [
    { id: 'reload', name: 'Reload', icon: RefreshCw, color: 'bg-blue-500', action: () => onNavigate('wallet') },
    { id: 'send', name: 'Send', icon: Send, color: 'bg-green-500', action: () => onNavigate('wallet') },
    { id: 'request', name: 'Request', icon: Download, color: 'bg-purple-500', action: () => onNavigate('wallet') },
    { id: 'pay', name: 'Pay', icon: CreditCard, color: 'bg-orange-500', action: () => onNavigate('merchant') },
  ];

  const billPayments = [
    { id: 'tanesco', name: 'TANESCO', desc: 'Electricity', icon: Zap, color: 'bg-yellow-500', logo: TANESCOLogo },
    { id: 'dawasco', name: 'DAWASCO', desc: 'Water', icon: Droplet, color: 'bg-blue-500', logo: DAWASCOLogo },
    { id: 'airtel', name: 'Airtel', desc: 'Mobile', icon: Phone, color: 'bg-red-500', logo: AirtelMoneyLogo },
    { id: 'vodacom', name: 'Vodacom', desc: 'Mobile', icon: Smartphone, color: 'bg-red-600', logo: VodacomLogo },
    { id: 'tigo', name: 'Tigo', desc: 'Mobile', icon: Phone, color: 'bg-blue-600', logo: TigoPesaLogo },
    { id: 'dstv', name: 'DStv', desc: 'TV', icon: Tv, color: 'bg-blue-700', logo: DSTVLogo },
  ];

  const mobileMoneyServices = [
    { id: 'mpesa', name: 'M-Pesa', provider: 'Vodacom', color: 'bg-green-600', textColor: 'text-white' },
    { id: 'tigopesa', name: 'Tigo Pesa', provider: 'Tigo', color: 'bg-blue-600', textColor: 'text-white' },
    { id: 'airtel', name: 'Airtel Money', provider: 'Airtel', color: 'bg-red-500', textColor: 'text-white' },
    { id: 'halopesa', name: 'Halo Pesa', provider: 'Halotel', color: 'bg-purple-600', textColor: 'text-white' },
  ];

  const governmentServices = [
    { id: 'tra', name: 'TRA', desc: 'Tax Payments', icon: FileText, color: 'bg-blue-700', logo: TRALogo },
    { id: 'nhif', name: 'NHIF', desc: 'Insurance', icon: Shield, color: 'bg-green-700', logo: NHIFLogo },
    { id: 'license', name: 'Licenses', desc: 'Gov Services', icon: Car, color: 'bg-gray-700' },
    { id: 'university', name: 'Uni Fees', desc: 'Education', icon: GraduationCap, color: 'bg-purple-700' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {currentTab === 'home' && (
        <>
          {/* Header with Balance */}
          <div className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 px-4 pt-6 pb-6 rounded-b-3xl shadow-xl">
            <div>
              {/* Top Bar */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <Wallet className="size-5 text-white" />
                  </div>
                  <div>
                    <p className="text-green-100 text-xs">Hello,</p>
                    <p className="text-white">{user.name.split(' ')[0]}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="bg-white/20 hover:bg-white/30 p-2 rounded-full relative transition-all">
                    <Bell className="size-5 text-white" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {notificationCount}
                      </span>
                    )}
                  </button>
                  <button className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all">
                    <Settings className="size-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Balance Display */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-5 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-green-100 text-sm">eWallet Balance</p>
                  <button 
                    onClick={() => setBalanceVisible(!balanceVisible)}
                    className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all"
                  >
                    {balanceVisible ? <Eye className="size-4 text-white" /> : <EyeOff className="size-4 text-white" />}
                  </button>
                </div>
                {loading ? (
                  <div className="h-10 bg-white/20 rounded-xl animate-pulse" />
                ) : (
                  <p className="text-4xl text-white mb-1">
                    {balanceVisible ? formatCurrency(balance.balance) : '••••••'}
                  </p>
                )}
                <p className="text-green-100 text-xs">Last updated: Just now</p>
              </div>

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Button
                  onClick={() => onNavigate('wallet')}
                  className="h-12 bg-white text-green-700 hover:bg-green-50 rounded-full shadow-lg font-semibold"
                >
                  <Plus className="size-4 mr-2" />
                  Add money
                </Button>
                <Button
                  onClick={() => setCurrentTab('history')}
                  className="h-12 bg-white/20 text-white border border-white/30 hover:bg-white/30 rounded-full backdrop-blur-sm"
                >
                  <History className="size-4 mr-2" />
                  History
                </Button>
              </div>

              {/* Service Icons Grid */}
              <div className="grid grid-cols-4 gap-3">
                {quickServices.map((service) => {
                  const Icon = service.icon;
                  return (
                    <button
                      key={service.id}
                      onClick={service.action}
                      className="flex flex-col items-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-2xl backdrop-blur-sm transition-all"
                    >
                      <div className={`${service.color} p-3 rounded-xl shadow-lg`}>
                        <Icon className="size-5 text-white" />
                      </div>
                      <span className="text-xs text-white">{service.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-4 py-4 space-y-6">
            {/* Promo Banner */}
            <div className={`bg-gradient-to-r ${promoBanners[currentBannerIndex].gradient} rounded-2xl p-5 text-white shadow-lg relative overflow-hidden`}>
              <div className="relative z-10">
                <div className="inline-block bg-red-500 text-white text-xs px-2 py-1 rounded-full mb-2">
                  {promoBanners[currentBannerIndex].badge}
                </div>
                <h3 className="text-white text-lg mb-1">{promoBanners[currentBannerIndex].title}</h3>
                <p className="text-sm text-white/90 mb-3">{promoBanners[currentBannerIndex].subtitle}</p>
                <button className="bg-white text-purple-600 px-4 py-2 rounded-full text-sm hover:bg-gray-100">
                  Learn more
                </button>
              </div>
              <div className="absolute -right-8 -bottom-8 opacity-20">
                <Star className="size-32 text-white" />
              </div>
            </div>

            {/* Mobile Money Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base">Mobile Money</h3>
                <button 
                  onClick={() => onNavigate('wallet')}
                  className="text-blue-600 text-sm"
                >
                  See all
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {mobileMoneyServices.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => onNavigate('wallet')}
                    className={`${service.color} ${service.textColor} p-4 rounded-2xl shadow-md hover:shadow-lg transition-all text-left relative overflow-hidden`}
                  >
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-1">
                        <Smartphone className="size-5" />
                        <p className="text-sm opacity-90">{service.provider}</p>
                      </div>
                      <p className="text-lg">{service.name}</p>
                    </div>
                    <div className="absolute -right-4 -bottom-4 opacity-20">
                      <Wallet className="size-20" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Bills Payment Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base">Pay Bills</h3>
                <button 
                  onClick={() => onNavigate('billpayments')}
                  className="text-blue-600 text-sm"
                >
                  See all
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {billPayments.map((bill) => {
                  const LogoComponent = bill.logo;
                  return (
                    <button
                      key={bill.id}
                      onClick={() => onNavigate('billpayments')}
                      className="flex flex-col items-center gap-2 p-3 bg-white hover:bg-gray-50 rounded-2xl border border-gray-100 transition-all"
                    >
                      <div className="w-16 h-16">
                        <LogoComponent />
                      </div>
                      <p className="text-xs text-center">{bill.name}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Government Services */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base">Government Services</h3>
                <button 
                  onClick={() => onNavigate('payments')}
                  className="text-blue-600 text-sm"
                >
                  See all
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {governmentServices.map((service) => {
                  const Icon = service.icon;
                  return (
                    <button
                      key={service.id}
                      onClick={() => onNavigate('payments')}
                      className="flex items-center gap-3 p-4 bg-white hover:bg-gray-50 rounded-2xl border border-gray-100 transition-all"
                    >
                      <div className={`${service.color} p-3 rounded-xl`}>
                        <Icon className="size-5 text-white" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm">{service.name}</p>
                        <p className="text-xs text-gray-500">{service.desc}</p>
                      </div>
                      <ChevronRight className="size-4 text-gray-400" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Travel & Transport */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base">Travel & Transport</h3>
                <button 
                  onClick={() => onNavigate('travel')}
                  className="text-green-600 text-sm"
                >
                  See all
                </button>
              </div>
              <button
                onClick={() => onNavigate('travel')}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-2xl text-white shadow-lg transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Plane className="size-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p>Book Travel</p>
                    <p className="text-sm text-white/80">Bus, Ferry, Flights & Hotels</p>
                  </div>
                </div>
                <ChevronRight className="size-5" />
              </button>
            </div>

            {/* Send Money */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base">Send Money</h3>
                <button 
                  onClick={() => onNavigate('sendmoney')}
                  className="text-green-600 text-sm"
                >
                  See all
                </button>
              </div>
              <button
                onClick={() => onNavigate('sendmoney')}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-2xl text-white shadow-lg transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Send className="size-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p>Transfer to Family & Friends</p>
                    <p className="text-sm text-white/80">Instant & secure transfers</p>
                  </div>
                </div>
                <ChevronRight className="size-5" />
              </button>
            </div>

            {/* Subscriptions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base">Subscriptions</h3>
                <button 
                  onClick={() => onNavigate('subscriptions')}
                  className="text-green-600 text-sm"
                >
                  See all
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onNavigate('subscriptions')}
                  className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rounded-2xl text-white shadow-lg transition-all"
                >
                  <div className="text-3xl">🎬</div>
                  <p className="text-sm">Streaming</p>
                  <p className="text-xs text-white/80">Netflix, Showmax</p>
                </button>
                <button
                  onClick={() => onNavigate('subscriptions')}
                  className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-2xl text-white shadow-lg transition-all"
                >
                  <div className="text-3xl">🎵</div>
                  <p className="text-sm">Music</p>
                  <p className="text-xs text-white/80">Spotify, Apple</p>
                </button>
                <button
                  onClick={() => onNavigate('subscriptions')}
                  className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 rounded-2xl text-white shadow-lg transition-all"
                >
                  <div className="text-3xl">💼</div>
                  <p className="text-sm">Software</p>
                  <p className="text-xs text-white/80">Microsoft, Adobe</p>
                </button>
                <button
                  onClick={() => onNavigate('subscriptions')}
                  className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 rounded-2xl text-white shadow-lg transition-all"
                >
                  <div className="text-3xl">📡</div>
                  <p className="text-sm">TV</p>
                  <p className="text-xs text-white/80">DStv, StarTimes</p>
                </button>
              </div>
            </div>

            {/* Shopping & Delivery */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base">Shopping & Delivery</h3>
                <button 
                  onClick={() => onNavigate('shopping')}
                  className="text-green-600 text-sm"
                >
                  See all
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onNavigate('shopping')}
                  className="flex flex-col items-center gap-2 p-4 bg-white hover:bg-gray-50 rounded-2xl border border-gray-200 shadow-sm transition-all"
                >
                  <div className="text-3xl">🛒</div>
                  <p className="text-sm">Jumia & Kilimall</p>
                  <p className="text-xs text-gray-500">Online shopping</p>
                </button>
                <button
                  onClick={() => onNavigate('shopping')}
                  className="flex flex-col items-center gap-2 p-4 bg-white hover:bg-gray-50 rounded-2xl border border-gray-200 shadow-sm transition-all"
                >
                  <div className="text-3xl">🍔</div>
                  <p className="text-sm">Food Delivery</p>
                  <p className="text-xs text-gray-500">Glovo, Uber Eats</p>
                </button>
                <button
                  onClick={() => onNavigate('shopping')}
                  className="flex flex-col items-center gap-2 p-4 bg-white hover:bg-gray-50 rounded-2xl border border-gray-200 shadow-sm transition-all"
                >
                  <div className="text-3xl">🥬</div>
                  <p className="text-sm">Groceries</p>
                  <p className="text-xs text-gray-500">Fresh produce</p>
                </button>
                <button
                  onClick={() => onNavigate('shopping')}
                  className="flex flex-col items-center gap-2 p-4 bg-white hover:bg-gray-50 rounded-2xl border border-gray-200 shadow-sm transition-all"
                >
                  <div className="text-3xl">📱</div>
                  <p className="text-sm">Electronics</p>
                  <p className="text-xs text-gray-500">Phones, laptops</p>
                </button>
              </div>
            </div>

            {/* My Favourites */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base">My Favourites</h3>
                <button className="text-blue-600 text-sm">Edit</button>
              </div>
              {transactions.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-2xl border border-gray-100">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="size-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">No favourites yet</p>
                  <p className="text-xs text-gray-400">Add frequent transactions here</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {transactions.slice(0, 4).map((tx) => (
                    <button
                      key={tx.id}
                      className="flex flex-col items-center gap-2 p-3 bg-white hover:bg-gray-50 rounded-2xl border border-gray-100"
                    >
                      <div className="bg-blue-100 p-3 rounded-full">
                        <Receipt className="size-5 text-blue-600" />
                      </div>
                      <p className="text-xs text-center truncate w-full">{tx.description.split(' ')[0]}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {currentTab === 'history' && (
        <div className="px-4 pt-6 pb-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setCurrentTab('home')}
              className="bg-white p-2 rounded-full shadow-md"
            >
              <ArrowLeft className="size-5" />
            </button>
            <h1 className="text-2xl">Transaction History</h1>
          </div>

          <div className="space-y-3">
            {transactions.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <History className="size-10 text-gray-400" />
                </div>
                <p className="text-gray-500">No transactions yet</p>
              </div>
            ) : (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${
                      tx.type === 'credit' 
                        ? 'bg-green-100' 
                        : 'bg-blue-100'
                    }`}>
                      {tx.type === 'credit' ? (
                        <ArrowDownLeft className="size-5 text-green-600" />
                      ) : (
                        <ArrowUpRight className="size-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm">{tx.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(tx.timestamp).toLocaleDateString('en-TZ', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className={`text-sm ${
                    tx.type === 'credit' ? 'text-green-600' : 'text-gray-900'
                  }`}>
                    {tx.type === 'credit' ? '+' : ''}{formatCurrency(tx.amount)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {currentTab === 'rewards' && (
        <div className="px-4 pt-6 pb-6">
          <h1 className="text-2xl mb-6">GOrewards</h1>

          {/* Points Card */}
          <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-3xl p-6 text-white shadow-xl mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-orange-100 text-sm mb-1">Your Points</p>
                <p className="text-4xl">1,250</p>
              </div>
              <div className="bg-white/20 p-3 rounded-2xl">
                <Star className="size-10 text-white fill-white" />
              </div>
            </div>
            <div className="bg-white/20 rounded-xl p-3 flex items-center gap-2">
              <Shield className="size-5" />
              <div>
                <p className="text-sm">Silver Member</p>
                <p className="text-xs text-orange-100">500 points to Gold</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => onNavigate('rewards')}
              className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-2xl text-white shadow-lg transition-all"
            >
              <Star className="size-8 fill-white" />
              <span className="text-sm">Redeem</span>
            </button>
            <button
              onClick={() => onNavigate('shop')}
              className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-2xl text-white shadow-lg transition-all"
            >
              <Receipt className="size-8" />
              <span className="text-sm">Shop</span>
            </button>
          </div>

          {/* Cashback Section */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">Total Cashback</p>
                <p className="text-2xl">{formatCurrency(15000)}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <Wallet className="size-6 text-white" />
              </div>
            </div>
          </div>

          {/* Recent Rewards */}
          <div>
            <h3 className="text-base mb-3">Earn Points</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <Zap className="size-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm">Pay 3 bills today</p>
                    <p className="text-xs text-gray-500">+50 points</p>
                  </div>
                </div>
                <ChevronRight className="size-5 text-gray-400" />
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl border border-green-100">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <Star className="size-5 text-green-600 fill-green-600" />
                  </div>
                  <div>
                    <p className="text-sm">Completed: First payment</p>
                    <p className="text-xs text-green-600">+20 points earned</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <Send className="size-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm">Refer a friend</p>
                    <p className="text-xs text-gray-500">+100 points</p>
                  </div>
                </div>
                <ChevronRight className="size-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {currentTab === 'finance' && (
        <div className="px-4 pt-6 pb-6">
          <h1 className="text-2xl mb-6">Finance</h1>

          {/* Investment Card */}
          <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-6 text-white shadow-xl mb-6">
            <p className="text-green-100 text-sm mb-1">GO+ Investment</p>
            <p className="text-3xl mb-2">{formatCurrency(250000)}</p>
            <div className="flex items-center gap-2">
              <ArrowUpRight className="size-4 text-green-200" />
              <span className="text-sm text-green-100">+2.5% this month</span>
            </div>
          </div>

          {/* Financial Services */}
          <div className="space-y-3 mb-6">
            <button className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 rounded-2xl border border-gray-100 transition-all">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Wallet className="size-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm">Savings Goals</p>
                  <p className="text-xs text-gray-500">Create automatic savings</p>
                </div>
              </div>
              <ChevronRight className="size-5 text-gray-400" />
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 rounded-2xl border border-gray-100 transition-all">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <CreditCard className="size-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm">Get a Loan</p>
                  <p className="text-xs text-gray-500">Quick approval process</p>
                </div>
              </div>
              <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                Pre-approved
              </div>
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 rounded-2xl border border-gray-100 transition-all">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-3 rounded-xl">
                  <Shield className="size-5 text-orange-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm">Insurance</p>
                  <p className="text-xs text-gray-500">Protect what matters</p>
                </div>
              </div>
              <ChevronRight className="size-5 text-gray-400" />
            </button>
          </div>

          {/* Investment Performance */}
          <div>
            <h3 className="text-base mb-3">Performance</h3>
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Total Returns</span>
                <span className="text-green-600">+TZS 6,250</span>
              </div>
              <div className="h-32 bg-gradient-to-t from-green-100 to-transparent rounded-xl flex items-end justify-center">
                <p className="text-xs text-gray-500 mb-2">Graph coming soon</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentTab === 'services' && (
        <div className="px-4 pt-6 pb-6">
          <h1 className="text-2xl mb-6">All Services</h1>

          {/* Categories */}
          <div className="space-y-6">
            {/* Bills & Payments */}
            <div>
              <h3 className="text-sm text-gray-500 mb-3">BILLS & PAYMENTS</h3>
              <div className="grid grid-cols-4 gap-3">
                {billPayments.map((bill) => (
                  <button
                    key={bill.id}
                    onClick={() => onNavigate('payments')}
                    className="flex flex-col items-center gap-2 p-3 bg-white hover:bg-gray-50 rounded-2xl border border-gray-100"
                  >
                    <div className={`${bill.color} p-3 rounded-xl`}>
                      <span className="text-xl">{bill.logo}</span>
                    </div>
                    <p className="text-xs text-center">{bill.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Government */}
            <div>
              <h3 className="text-sm text-gray-500 mb-3">GOVERNMENT</h3>
              <div className="grid grid-cols-2 gap-3">
                {governmentServices.map((service) => {
                  const Icon = service.icon;
                  return (
                    <button
                      key={service.id}
                      onClick={() => onNavigate('payments')}
                      className="flex items-center gap-3 p-3 bg-white hover:bg-gray-50 rounded-2xl border border-gray-100"
                    >
                      <div className={`${service.color} p-2 rounded-lg`}>
                        <Icon className="size-4 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs">{service.name}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lifestyle */}
            <div>
              <h3 className="text-sm text-gray-500 mb-3">LIFESTYLE</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onNavigate('travel')}
                  className="flex items-center gap-3 p-4 bg-white hover:bg-gray-50 rounded-2xl border border-gray-100"
                >
                  <div className="bg-blue-600 p-3 rounded-xl">
                    <Plane className="size-5 text-white" />
                  </div>
                  <p className="text-sm">Travel</p>
                </button>

                <button
                  onClick={() => onNavigate('shop')}
                  className="flex items-center gap-3 p-4 bg-white hover:bg-gray-50 rounded-2xl border border-gray-100"
                >
                  <div className="bg-purple-600 p-3 rounded-xl">
                    <Receipt className="size-5 text-white" />
                  </div>
                  <p className="text-sm">Shop</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentTab === 'profile' && (
        <div className="px-4 pt-6 pb-6">
          <h1 className="text-2xl mb-6">Profile</h1>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-600 to-cyan-500 w-20 h-20 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl">{user.name.charAt(0)}</span>
                </div>
                <div>
                  <h2 className="text-xl">{user.name}</h2>
                  <p className="text-gray-500">{user.email}</p>
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                  <p>{user.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">NIDA Number</p>
                  <p>{user.nida}</p>
                </div>
              </div>
            </div>

            {/* Quick Access */}
            <div>
              <h3 className="text-base mb-3">Quick Access</h3>
              <div className="space-y-3">
                <button
                  onClick={() => onNavigate('cards')}
                  className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 rounded-2xl border border-gray-100 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-3 rounded-xl">
                      <CreditCard className="size-5 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm">Digital Cards</p>
                      <p className="text-xs text-gray-500">View payment cards & QR codes</p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-gray-400" />
                </button>

                <button
                  onClick={() => onNavigate('export')}
                  className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 rounded-2xl border border-gray-100 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-3 rounded-xl">
                      <Download className="size-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm">Export Transactions</p>
                      <p className="text-xs text-gray-500">Download history as CSV/JSON</p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <Shield className="size-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-900">Verified Account</p>
                  <p className="text-xs text-blue-600">Your account is secure and verified</p>
                </div>
              </div>
            </div>

            <Button
              onClick={onLogout}
              variant="outline"
              className="w-full h-14 bg-white rounded-2xl text-red-600 hover:bg-red-50 border-red-200"
            >
              Sign Out
            </Button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50">
        <div className="flex justify-around items-center py-2">
          <button
            onClick={() => setCurrentTab('home')}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${
              currentTab === 'home' 
                ? 'text-blue-600' 
                : 'text-gray-400'
            }`}
          >
            <Home className={`size-5 ${currentTab === 'home' ? 'fill-blue-600' : ''}`} />
            <span className="text-xs">Home</span>
          </button>

          <button
            onClick={() => setCurrentTab('rewards')}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${
              currentTab === 'rewards' 
                ? 'text-blue-600' 
                : 'text-gray-400'
            }`}
          >
            <Star className={`size-5 ${currentTab === 'rewards' ? 'fill-yellow-500 text-yellow-500' : ''}`} />
            <span className="text-xs">Rewards</span>
          </button>

          <button
            onClick={() => onNavigate('merchant')}
            className="flex flex-col items-center -mt-8"
          >
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-5 rounded-full shadow-2xl mb-1 hover:shadow-3xl transition-all">
              <Scan className="size-7 text-white" />
            </div>
            <span className="text-xs text-gray-600">Scan</span>
          </button>

          <button
            onClick={() => setCurrentTab('finance')}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${
              currentTab === 'finance' 
                ? 'text-blue-600' 
                : 'text-gray-400'
            }`}
          >
            <Wallet className="size-5" />
            <span className="text-xs">Finance</span>
          </button>

          <button
            onClick={() => setCurrentTab('profile')}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${
              currentTab === 'profile' 
                ? 'text-blue-600' 
                : 'text-gray-400'
            }`}
          >
            <UserIcon className="size-5" />
            <span className="text-xs">Me</span>
          </button>
        </div>
      </div>
    </div>
  );
}