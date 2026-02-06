import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { User } from '../App';
import { RestaurantsSection } from './RestaurantsSection';
import { 
  ChevronRight,
  Eye,
  EyeOff,
  LogOut,
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
  RefreshCw,
  Download,
  Droplet,
  GraduationCap,
  Car,
  Tv,
  FileText,
  MapPin,
  Hotel,
  Bus,
  Ship,
  Mountain,
  Ticket,
  IdCard,
  Landmark,
  Heart,
  Users,
  Target,
  Percent,
  Coins,
  Globe,
  Bike,
  DollarSign,
  PiggyBank,
  TrendingDown,
  Building2,
  Shield,
  Plane,
  Utensils,
  Award,
  Star,
  TrendingUp,
  Bell,
  Settings,
  User as UserIcon,
  Smartphone,
  CreditCard,
  ShoppingBag,
  Gift,
  Wallet, // Balance card icon
  BarChart3, // Finance chart icon
  History,
  Zap,
  Sparkles,
  Clock,
  Check
} from 'lucide-react';
import {
  WalletIcon,
  SendMoneyIcon,
  RequestMoneyIcon,
  QRScanIcon,
  BillsIcon,
  TravelIcon,
  ShopIcon,
  RewardsIcon,
  ProfileIcon,
  HistoryIcon,
  HomeIcon,
  SettingsIcon,
  NotificationsIcon,
  CardIcon,
  RestaurantIcon,
  PhoneIcon,
  SecurityIcon,
  MoneyIcon,
  ChartIcon,
  PlusIcon
} from './CustomIcons';
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
  onNavigate: (page: 'wallet' | 'payments' | 'billpayments' | 'merchant' | 'travel' | 'cards' | 'export' | 'rewards' | 'shop' | 'international' | 'subscriptions' | 'shopping' | 'sendmoney' | 'groupmoney' | 'communitywallet' | 'microlans' | 'multicurrencywallet' | 'virtualcardsadvanced' | 'movies' | 'restaurants' | 'rides' | 'rentals' | 'gofood' | 'gosafari' | 'ferrybooking' | 'multimodaltripplanner' | 'parcelshipping' | 'smartshoppingmarketplace' | 'aismartshoppingassistant' | 'deliveryriderdashboard' | 'governmentservices' | 'aiassistant' | 'emergencysos' | 'digitaladdress' | 'smebusinesssuite' | 'offlineqrpayment' | 'securitycenter' | 'tourism' | 'promos' | 'insights' | 'budget' | 'notifications' | 'profile' | 'security' | 'membership' | 'quickpay') => void;
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
  const [currentTab, setCurrentTab] = useState<'home' | 'rewards' | 'finance' | 'services' | 'activity' | 'profile'>('home');
  const [balance, setBalance] = useState({ balance: 450000, currency: 'TZS' });
  const [loading, setLoading] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [notificationCount, setNotificationCount] = useState(3);
  const [vcKeyPressed, setVcKeyPressed] = useState({ v: false, c: false });
  const [language, setLanguage] = useState<'sw' | 'en'>('sw'); // Language toggle

  // Hidden VC Dashboard access via keyboard shortcut (V + C keys simultaneously)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'v' || e.key === 'V') {
        setVcKeyPressed(prev => ({ ...prev, v: true }));
      }
      if (e.key === 'c' || e.key === 'C') {
        setVcKeyPressed(prev => ({ ...prev, c: true }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'v' || e.key === 'V') {
        setVcKeyPressed(prev => ({ ...prev, v: false }));
      }
      if (e.key === 'c' || e.key === 'C') {
        setVcKeyPressed(prev => ({ ...prev, c: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Check if both V and C keys are pressed to access VC Dashboard
  useEffect(() => {
    if (vcKeyPressed.v && vcKeyPressed.c) {
      onNavigate('vcdashboard' as any);
    }
  }, [vcKeyPressed, onNavigate]);

  const promoBanners = [
    {
      id: 1,
      title: '🎉 Win Big',
      subtitle: 'Get 15% cashback on every payment',
      gradient: 'from-orange-500 via-pink-500 to-purple-600',
      badge: 'HOT',
      badgeColor: 'bg-red-500'
    },
    {
      id: 2,
      title: '✈️ Travel Rewards',
      subtitle: 'Book flights and earn 2x points',
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      badge: 'NEW',
      badgeColor: 'bg-emerald-500'
    },
    {
      id: 3,
      title: '💰 Cashback Deal',
      subtitle: 'On all bill payments this month',
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
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

  const quickActions = [
    { id: 'reload', name: 'Add Money', icon: PlusIcon, gradient: 'from-blue-500 to-blue-600', action: () => onNavigate('wallet') },
    { id: 'send', name: 'Send', icon: SendMoneyIcon, gradient: 'from-emerald-500 to-green-600', action: () => onNavigate('sendmoney') },
    { id: 'scan', name: 'Scan QR', icon: QRScanIcon, gradient: 'from-purple-500 to-purple-600', action: () => onNavigate('quickpay') },
    { id: 'pay', name: 'Pay Bills', icon: BillsIcon, gradient: 'from-orange-500 to-orange-600', action: () => onNavigate('billpayments') },
  ];

  const billPayments = [
    { id: 'tanesco', name: 'TANESCO', desc: 'Electricity', logo: TANESCOLogo },
    { id: 'dawasco', name: 'DAWASCO', desc: 'Water', logo: DAWASCOLogo },
    { id: 'vodacom', name: 'Vodacom', desc: 'Airtime', logo: VodacomLogo },
    { id: 'tigo', name: 'Tigo', desc: 'Airtime', logo: TigoPesaLogo },
    { id: 'dstv', name: 'DStv', desc: 'TV', logo: DSTVLogo },
    { id: 'azam', name: 'Azam TV', desc: 'TV', logo: AzamTVLogo },
  ];

  const mobileMoneyServices = [
    { id: 'mpesa', name: 'M-Pesa', provider: 'Vodacom', logo: MPesaLogo, color: 'from-green-600 to-green-700' },
    { id: 'tigopesa', name: 'Tigo Pesa', provider: 'Tigo', logo: TigoPesaLogo, color: 'from-blue-600 to-blue-700' },
    { id: 'airtel', name: 'Airtel Money', provider: 'Airtel', logo: AirtelMoneyLogo, color: 'from-red-500 to-red-600' },
    { id: 'halopesa', name: 'Halo Pesa', provider: 'Halotel', logo: HaloPesaLogo, color: 'from-purple-600 to-purple-700' },
  ];

  const governmentServices = [
    { id: 'tra', name: 'TRA', desc: 'Tax Payments', icon: FileText, color: 'from-blue-600 to-blue-700' },
    { id: 'nhif', name: 'NHIF', desc: 'Health Insurance', icon: Shield, color: 'from-green-600 to-green-700' },
    { id: 'nida', name: 'NIDA', desc: 'ID Services', icon: IdCard, color: 'from-purple-600 to-purple-700' },
    { id: 'university', name: 'School Fees', desc: 'Education', icon: GraduationCap, color: 'from-orange-600 to-orange-700' },
  ];

  const travelServices = [
    { id: 'flights', name: 'Flights', icon: Plane, color: 'from-sky-500 to-blue-600', route: 'travel' },
    { id: 'hotels', name: 'Hotels', icon: Hotel, color: 'from-purple-500 to-purple-600', route: 'travel' },
    { id: 'bus', name: 'Bus', icon: Bus, color: 'from-green-500 to-emerald-600', route: 'travel' },
    { id: 'ferry', name: 'Ferry', icon: Ship, color: 'from-cyan-500 to-teal-600', route: 'ferrybooking' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {currentTab === 'home' && (
        <>
          {/* Header with Balance */}
          <div className="bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800 px-5 pt-8 pb-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              {/* Top Bar */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-green-100 text-sm">{language === 'sw' ? 'Habari za asubuhi' : 'Good morning'} 👋</p>
                  <p className="text-white text-xl mt-0.5">{user.name.split(' ')[0]}</p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Language Toggle */}
                  <button 
                    onClick={() => setLanguage(language === 'sw' ? 'en' : 'sw')}
                    className="bg-white/20 backdrop-blur-md hover:bg-white/30 px-3 py-1.5 rounded-full transition-all active:scale-95 flex items-center gap-1"
                  >
                    <span className={`text-xs font-bold ${language === 'sw' ? 'text-white' : 'text-white/50'}`}>SW</span>
                    <span className="text-white/70 text-xs">|</span>
                    <span className={`text-xs font-bold ${language === 'en' ? 'text-white' : 'text-white/50'}`}>EN</span>
                  </button>
                  <button 
                    onClick={() => onNavigate('notifications')}
                    className="bg-white/20 backdrop-blur-md hover:bg-white/30 p-2.5 rounded-full relative transition-all active:scale-95"
                  >
                    <Bell className="size-5 text-white" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-5 h-5 rounded-full flex items-center justify-center px-1">
                        {notificationCount}
                      </span>
                    )}
                  </button>
                  <button 
                    onClick={() => onNavigate('profile')}
                    className="bg-white/20 backdrop-blur-md hover:bg-white/30 p-2.5 rounded-full transition-all active:scale-95"
                  >
                    <Settings className="size-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Balance Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Wallet className="size-5 text-green-100" />
                    <p className="text-green-100 text-sm">Main Balance</p>
                  </div>
                  <button 
                    onClick={() => setBalanceVisible(!balanceVisible)}
                    className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all active:scale-95"
                  >
                    {balanceVisible ? <Eye className="size-4 text-white" /> : <EyeOff className="size-4 text-white" />}
                  </button>
                </div>
                {loading ? (
                  <div className="h-10 bg-white/20 rounded-xl animate-pulse" />
                ) : (
                  <div>
                    <p className="text-white text-4xl mb-1">
                      {balanceVisible ? formatCurrency(balance.balance) : '••••••'}
                    </p>
                    <div className="flex items-center gap-1.5 text-green-100 text-xs mt-2">
                      <div className="size-1.5 bg-green-300 rounded-full animate-pulse" />
                      <span>Updated just now</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-4 gap-3 mt-5">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={action.action}
                      className="flex flex-col items-center gap-2 group"
                    >
                      <div className={`bg-gradient-to-br ${action.gradient} p-3.5 rounded-2xl shadow-lg group-hover:shadow-xl transition-all active:scale-95 group-hover:scale-105`} style={{ color: '#FFFFFF' }}>
                        <Icon className="size-5 text-white" />
                      </div>
                      <span className="text-xs text-white/90">{action.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-5 py-5 space-y-6">
            {/* Quick Pay Feature */}
            <button
              onClick={() => onNavigate('quickpay')}
              className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all active:scale-[0.98] relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                    <BillsIcon className="size-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-xl mb-0.5 text-[rgb(255,255,255)]">Quick Pay</p>
                    <p className="text-sm text-purple-100">Tap, Scan & Virtual Cards</p>
                  </div>
                </div>
                <ChevronRight className="size-6 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Promo Banner Carousel */}
            <div className="relative">
              <div className={`bg-gradient-to-r ${promoBanners[currentBannerIndex].gradient} rounded-3xl p-6 text-white shadow-lg relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="relative z-10">
                  <span className={`inline-block ${promoBanners[currentBannerIndex].badgeColor} text-white text-xs px-3 py-1 rounded-full mb-2`}>
                    {promoBanners[currentBannerIndex].badge}
                  </span>
                  <h3 className="text-white text-xl mb-1">{promoBanners[currentBannerIndex].title}</h3>
                  <p className="text-sm text-white/90 mb-4">{promoBanners[currentBannerIndex].subtitle}</p>
                  <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-5 py-2 rounded-full text-sm transition-all active:scale-95">
                    Learn more
                  </button>
                </div>
              </div>
              {/* Carousel Indicators */}
              <div className="flex justify-center gap-1.5 mt-3">
                {promoBanners.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentBannerIndex ? 'w-6 bg-green-600' : 'w-1.5 bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Mobile Money */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg">Mobile Money</h3>
                <button 
                  onClick={() => onNavigate('wallet')}
                  className="text-green-600 text-sm hover:text-green-700 active:scale-95"
                >
                  See all
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {mobileMoneyServices.map((service) => {
                  const LogoComponent = service.logo;
                  return (
                    <button
                      key={service.id}
                      onClick={() => onNavigate('wallet')}
                      className={`bg-gradient-to-br ${service.color} p-5 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95 text-left relative overflow-hidden group`}
                    >
                      <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-30 transition-opacity">
                        <Smartphone className="size-16" />
                      </div>
                      <div className="relative z-10">
                        <div className="w-12 h-12 mb-3 bg-white rounded-xl p-2">
                          <LogoComponent />
                        </div>
                        <p className="text-white text-base mb-0.5">{service.name}</p>
                        <p className="text-white/70 text-xs">{service.provider}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pay Bills */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg">Pay Bills</h3>
                <button 
                  onClick={() => onNavigate('billpayments')}
                  className="text-green-600 text-sm hover:text-green-700 active:scale-95"
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
                      className="flex flex-col items-center gap-2 p-4 bg-white hover:bg-gray-50 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-95"
                    >
                      <div className="w-14 h-14">
                        <LogoComponent />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-semibold">{bill.name}</p>
                        <p className="text-xs text-gray-600">{bill.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Government Services */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg">Government Services</h3>
                <button 
                  onClick={() => onNavigate('governmentservices')}
                  className="text-green-600 text-sm hover:text-green-700 active:scale-95"
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
                      onClick={() => onNavigate('governmentservices')}
                      className="flex items-center gap-3 p-4 bg-white hover:bg-gray-50 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-95"
                    >
                      <div className={`bg-gradient-to-br ${service.color} p-3 rounded-xl shadow-md`}>
                        <Icon className="size-5 text-white" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm font-semibold">{service.name}</p>
                        <p className="text-xs text-gray-600">{service.desc}</p>
                      </div>
                      <ChevronRight className="size-4 text-gray-600" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Travel & Transport */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg">Travel & Transport</h3>
                <button 
                  onClick={() => onNavigate('travel')}
                  className="text-green-600 text-sm hover:text-green-700 active:scale-95"
                >
                  See all
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {travelServices.map((service) => {
                  const Icon = service.icon;
                  return (
                    <button
                      key={service.id}
                      onClick={() => onNavigate(service.route as any)}
                      className={`bg-gradient-to-br ${service.color} p-5 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95 text-white text-left relative overflow-hidden group`}
                    >
                      <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:opacity-30 transition-opacity">
                        <Icon className="size-20" />
                      </div>
                      <div className="relative z-10">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl w-fit mb-3">
                          <Icon className="size-5" />
                        </div>
                        <p className="text-base text-[rgb(251,252,255)]">{service.name}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Group Money Pools */}
            <button
              onClick={() => onNavigate('groupmoney')}
              className="w-full bg-gradient-to-br from-teal-500 via-emerald-600 to-green-600 rounded-3xl p-6 text-white shadow-lg hover:shadow-xl transition-all active:scale-[0.98] relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                    <Users className="size-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-xl mb-0.5 text-[rgb(249,251,255)]">Group Collections</p>
                    <p className="text-sm text-emerald-100">Pool money for trips & events</p>
                  </div>
                </div>
                <ChevronRight className="size-6 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Food & Dining */}
            <RestaurantsSection onNavigate={onNavigate} />

            {/* Recent Transactions */}
            {transactions.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg">Recent Activity</h3>
                  <button 
                    onClick={() => setCurrentTab('activity')}
                    className="text-green-600 text-sm hover:text-green-700 active:scale-95"
                  >
                    See all
                  </button>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100">
                  {transactions.slice(0, 3).map((transaction) => (
                    <div key={transaction.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${
                          transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {transaction.type === 'credit' ? (
                            <ArrowDownLeft className="size-4 text-green-600" />
                          ) : (
                            <ArrowUpRight className="size-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{transaction.description}</p>
                          <p className="text-xs text-gray-600">
                            {new Date(transaction.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className={`${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {currentTab === 'rewards' && (
        <div className="px-5 pt-8 pb-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">GOrewards</h1>
            <p className="text-base text-gray-700 font-medium">Pata tuzo kila ulipolipa • Earn rewards every time you pay</p>
          </div>

          {/* Membership Card */}
          <div className="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 rounded-3xl p-6 text-white shadow-2xl mb-6 relative overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-green-300/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-yellow-400 to-amber-500 p-2.5 rounded-2xl shadow-lg">
                    <Award className="size-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-green-100 font-bold tracking-wide mb-0.5">MEMBERSHIP STATUS</p>
                    <p className="text-sm text-white/90 font-semibold">Hali ya Uanachama</p>
                  </div>
                </div>
                <button 
                  onClick={() => onNavigate('membership')}
                  className="bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-900 px-4 py-2 rounded-full hover:from-yellow-300 hover:to-amber-400 transition-all text-xs font-black shadow-lg hover:scale-105 active:scale-95"
                >
                  Upgrade ⬆️
                </button>
              </div>
              
              <div className="mb-5">
                <div className="flex items-baseline gap-2 mb-2">
                  <Sparkles className="size-5 text-yellow-300 animate-pulse" />
                  <p className="text-6xl font-black leading-none text-white drop-shadow-lg">2,450</p>
                </div>
                <p className="text-sm text-green-100 font-bold">GOrewards Points • Pointi Zilizopo</p>
              </div>

              <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 border border-white/30 shadow-xl mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-yellow-400 to-amber-500 p-2.5 rounded-xl shadow-lg">
                      <Star className="size-5 fill-amber-900 text-amber-900" />
                    </div>
                    <div>
                      <p className="text-lg font-black text-white mb-0.5">Gold Member 🏆</p>
                      <p className="text-xs text-green-200 font-semibold">Tier 3 of 4 • Daraja la 3</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-white">550</p>
                    <p className="text-xs text-green-200 font-bold">to Platinum</p>
                  </div>
                </div>
              </div>

              {/* Enhanced Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-white font-bold">Progress to Platinum</span>
                  <span className="text-green-200 font-black text-sm">81%</span>
                </div>
                <div className="h-3 bg-white/20 backdrop-blur-sm rounded-full overflow-hidden border border-white/30 shadow-inner">
                  <div className="h-full bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-300 rounded-full shadow-lg relative" style={{ width: '81%' }}>
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-[shimmer_2s_ease-in-out_infinite]" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <TrendingUp className="size-3 text-green-200" />
                  <p className="text-xs text-green-100 font-semibold">Keep earning to unlock VIP benefits!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Membership Tiers */}
          <div>
            <h3 className="text-lg mb-4">Membership Tiers</h3>
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-gray-100 p-3 rounded-xl text-center border border-gray-200">
                <p className="text-2xl mb-1">🥉</p>
                <p className="text-xs font-semibold mb-0.5">Bronze</p>
                <p className="text-xs text-gray-700">0-999</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-xl text-center border border-gray-200">
                <p className="text-2xl mb-1">🥈</p>
                <p className="text-xs font-semibold mb-0.5">Silver</p>
                <p className="text-xs text-gray-700">1K-2.4K</p>
              </div>
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-3 rounded-xl text-center border-2 border-orange-400 shadow-md">
                <p className="text-2xl mb-1">🥇</p>
                <p className="text-xs mb-0.5">Gold</p>
                <p className="text-xs text-orange-700">2.5K-4.9K</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-xl text-center border border-gray-200">
                <p className="text-2xl mb-1">💎</p>
                <p className="text-xs font-semibold mb-0.5">Platinum</p>
                <p className="text-xs text-gray-700">5K+</p>
              </div>
            </div>
          </div>

          {/* Featured Rewards */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg">Featured Rewards</h3>
              <button className="text-sm text-green-600 hover:text-green-700">View All</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all active:scale-95 text-left">
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-3 rounded-xl w-fit mb-3">
                  <p className="text-3xl">☕</p>
                </div>
                <p className="text-sm font-semibold mb-1">Starbucks Voucher</p>
                <p className="text-xs text-gray-600 mb-2">Valid at any branch</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">500 pts</span>
                  <span className="text-xs text-gray-600 font-medium">10K TZS</span>
                </div>
              </button>

              <button className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all active:scale-95 text-left">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-3 rounded-xl w-fit mb-3">
                  <p className="text-3xl">🎬</p>
                </div>
                <p className="text-sm font-semibold mb-1">Century Cinemax</p>
                <p className="text-xs text-gray-600 mb-2">1 movie ticket</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">800 pts</span>
                  <span className="text-xs text-gray-600 font-medium">15K TZS</span>
                </div>
              </button>

              <button className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all active:scale-95 text-left">
                <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-3 rounded-xl w-fit mb-3">
                  <p className="text-3xl">✈️</p>
                </div>
                <p className="text-sm font-semibold mb-1">Precision Air</p>
                <p className="text-xs text-gray-600 mb-2">50K flight credit</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">2,000 pts</span>
                  <span className="text-xs text-gray-600 font-medium">DSM-JRO</span>
                </div>
              </button>

              <button className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all active:scale-95 text-left">
                <div className="bg-gradient-to-br from-orange-100 to-red-100 p-3 rounded-xl w-fit mb-3">
                  <p className="text-3xl">🏨</p>
                </div>
                <p className="text-sm font-semibold mb-1">Serena Hotel</p>
                <p className="text-xs text-gray-600 mb-2">Weekend stay</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold">3,500 pts</span>
                  <span className="text-xs text-gray-600 font-medium">250K TZS</span>
                </div>
              </button>
            </div>
          </div>

          {/* Earn Points Section */}
          <div>
            <h3 className="text-lg mb-4">Earn Points</h3>
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-500 p-3 rounded-xl">
                    <Receipt className="size-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm mb-0.5">Every Transaction</p>
                    <p className="text-xs text-gray-600">Bills, payments, transfers</p>
                  </div>
                  <p className="text-xl text-blue-600">+10</p>
                </div>
                <div className="bg-white/60 rounded-xl p-2 text-xs text-gray-600">
                  340 points earned this month
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-purple-500 p-3 rounded-xl">
                    <Utensils className="size-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm mb-0.5">Restaurant Orders</p>
                    <p className="text-xs text-gray-600">Book & dine in</p>
                  </div>
                  <p className="text-xl text-purple-600">+25</p>
                </div>
                <button className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 py-2 rounded-xl text-xs transition-colors">
                  Order Now & Earn
                </button>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-500 p-3 rounded-xl">
                    <Users className="size-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm mb-0.5">Refer Friends</p>
                    <p className="text-xs text-gray-600">When they sign up</p>
                  </div>
                  <p className="text-xl text-green-600">+500</p>
                </div>
                <button className="w-full bg-green-100 hover:bg-green-200 text-green-700 py-2 rounded-xl text-xs transition-colors">
                  Share Referral Link
                </button>
              </div>
            </div>
          </div>

          {/* Points History */}
          <div>
            <h3 className="text-lg mb-4">Recent Activity</h3>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <TrendingUp className="size-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Bill Payment</p>
                    <p className="text-xs text-gray-600">TANESCO - Today</p>
                  </div>
                </div>
                <p className="text-green-600 text-sm">+10</p>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <TrendingUp className="size-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm">Restaurant Order</p>
                    <p className="text-xs text-gray-500">The Slipway - Yesterday</p>
                  </div>
                </div>
                <p className="text-green-600 text-sm">+25</p>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <TrendingDown className="size-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm">Redeemed: Coffee</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
                <p className="text-red-600 text-sm">-500</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentTab === 'finance' && (
        <div className="px-5 pt-8 pb-6">
          <h1 className="text-3xl mb-6">Finance</h1>

          {/* Financial Overview */}
          <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-6 text-white shadow-xl mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <p className="text-sm text-green-100 mb-2">Total Savings</p>
              <p className="text-4xl mb-4 text-[rgb(244,247,255)]">{formatCurrency(1250000)}</p>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="size-4" />
                <span>+12.5% this month</span>
              </div>
            </div>
          </div>

          {/* Financial Services */}
          <div className="space-y-3">
            <button
              onClick={() => onNavigate('microlans')}
              className="w-full bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
                  <DollarSign className="size-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-base mb-0.5">Micro Loans</p>
                  <p className="text-sm text-gray-500">Quick cash when you need it</p>
                </div>
              </div>
              <ChevronRight className="size-5 text-gray-400" />
            </button>

            <button
              onClick={() => onNavigate('budget')}
              className="w-full bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl">
                  <BarChart3 className="size-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-base mb-0.5">Budget Tracker</p>
                  <p className="text-sm text-gray-500">Manage your spending</p>
                </div>
              </div>
              <ChevronRight className="size-5 text-gray-400" />
            </button>

            <button
              onClick={() => onNavigate('insights')}
              className="w-full bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl">
                  <TrendingUp className="size-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-base mb-0.5">Spending Insights</p>
                  <p className="text-sm text-gray-500">Analyze your expenses</p>
                </div>
              </div>
              <ChevronRight className="size-5 text-gray-400" />
            </button>

            <button
              onClick={() => onNavigate('multicurrencywallet')}
              className="w-full bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl">
                  <Globe className="size-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-base mb-0.5">Multi-Currency Wallet</p>
                  <p className="text-sm text-gray-500">USD, EUR, GBP & more</p>
                </div>
              </div>
              <ChevronRight className="size-5 text-gray-400" />
            </button>
          </div>
        </div>
      )}

      {currentTab === 'services' && (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/20 pb-24">
          {/* Hero Header */}
          <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 px-6 pt-8 pb-20 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/20 rounded-full -ml-24 -mb-24 blur-2xl"></div>
            
            <div className="relative z-10">
              <h1 className="text-3xl font-bold text-white mb-2">Huduma / Services</h1>
              <p className="text-green-100 text-sm">Everything you need in one place</p>
            </div>
          </div>

          <div className="px-6 -mt-12 space-y-6 pb-6">
            {/* Quick Actions - Featured */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-2.5 rounded-xl shadow-lg">
                      <Zap className="size-5 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-semibold">Popular</span>
                </div>
              <div className="grid grid-cols-4 gap-3">
                <button
                  onClick={() => onNavigate('billpayments')}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-gray-50 transition-all active:scale-95"
                >
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                    <Receipt className="size-5 text-white" />
                  </div>
                  <span className="text-xs text-gray-700 font-medium text-center">Pay Bills</span>
                </button>
                <button
                  onClick={() => onNavigate('billpayments')}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-gray-50 transition-all active:scale-95"
                >
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl shadow-lg">
                    <Smartphone className="size-5 text-white" />
                  </div>
                  <span className="text-xs text-gray-700 font-medium text-center">Airtime</span>
                </button>
                <button
                  onClick={() => onNavigate('travel')}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-gray-50 transition-all active:scale-95"
                >
                  <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl shadow-lg">
                    <Plane className="size-5 text-white" />
                  </div>
                  <span className="text-xs text-gray-700 font-medium text-center">Travel</span>
                </button>
                <button
                  onClick={() => onNavigate('government')}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-gray-50 transition-all active:scale-95"
                >
                  <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-xl shadow-lg">
                    <Landmark className="size-5 text-white" />
                  </div>
                  <span className="text-xs text-gray-700 font-medium text-center">Gov't</span>
                </button>
              </div>
              </div>
            </div>

            {/* Government & Public Services */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-red-500 to-red-600 p-2 rounded-lg shadow-md">
                    <Landmark className="size-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Serikali</h2>
                    <p className="text-xs text-gray-500">Government Services</p>
                  </div>
                </div>
                <button className="text-sm text-green-600 font-semibold hover:text-green-700 transition-colors">View All</button>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => onNavigate('government')}
                  className="w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <Landmark className="size-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-base font-semibold text-gray-900 mb-0.5">TRA - Kodi</p>
                      <p className="text-sm text-gray-500">Pay income tax, VAT, PAYE</p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('government')}
                  className="w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <IdCard className="size-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-base font-semibold text-gray-900 mb-0.5">NIDA - Vitambulisho</p>
                      <p className="text-sm text-gray-500">National ID verification</p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('government')}
                  className="w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <Heart className="size-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-base font-semibold text-gray-900 mb-0.5">NHIF - Bima ya Afya</p>
                      <p className="text-sm text-gray-500">Health insurance payments</p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('government')}
                  className="w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <Car className="size-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-base font-semibold text-gray-900 mb-0.5">License & Fines</p>
                      <p className="text-sm text-gray-500">Driving license, traffic fines</p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Utilities & Bills */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-2 rounded-lg shadow-md">
                    <Zap className="size-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Huduma za Msingi</h2>
                    <p className="text-xs text-gray-500">Utilities & Bills</p>
                  </div>
                </div>
                <button className="text-sm text-green-600 font-semibold hover:text-green-700 transition-colors">View All</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {/* TANESCO - Electricity */}
                <button
                  onClick={() => onNavigate('billpayments')}
                  className="bg-white border-2 border-neutral-200 hover:border-primary-500 p-4 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 text-left relative overflow-hidden group min-h-[120px]"
                >
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="relative z-10">
                    {/* Logo/Icon */}
                    <div className="bg-primary-100 w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary-200 transition-colors">
                      <Zap className="w-6 h-6 text-primary-700" />
                    </div>
                    
                    {/* Title */}
                    <p className="text-base font-semibold text-neutral-900 mb-1">
                      TANESCO
                    </p>
                    
                    {/* Description */}
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      Umeme • Electricity
                    </p>
                    
                    {/* Popular badge */}
                    <span className="absolute top-3 right-3 bg-warning-100 text-warning-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Popular
                    </span>
                  </div>
                </button>

                {/* DAWASA - Water */}
                <button
                  onClick={() => onNavigate('billpayments')}
                  className="bg-white border-2 border-neutral-200 hover:border-primary-500 p-4 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 text-left relative overflow-hidden group min-h-[120px]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="relative z-10">
                    <div className="bg-primary-100 w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary-200 transition-colors">
                      <Droplet className="w-6 h-6 text-primary-700" />
                    </div>
                    
                    <p className="text-base font-semibold text-neutral-900 mb-1">
                      DAWASA
                    </p>
                    
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      Maji • Water
                    </p>
                  </div>
                </button>

                {/* Mobile Money */}
                <button
                  onClick={() => onNavigate('wallet')}
                  className="bg-white border-2 border-neutral-200 hover:border-primary-500 p-4 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 text-left relative overflow-hidden group min-h-[120px]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="relative z-10">
                    <div className="bg-primary-100 w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary-200 transition-colors">
                      <Smartphone className="w-6 h-6 text-primary-700" />
                    </div>
                    
                    <p className="text-base font-semibold text-neutral-900 mb-1">
                      Mobile Money
                    </p>
                    
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      M-Pesa • Airtel • Tigo
                    </p>
                    
                    {/* New badge */}
                    <span className="absolute top-3 right-3 bg-success-100 text-success-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Fast
                    </span>
                  </div>
                </button>

                {/* TV Subscription */}
                <button
                  onClick={() => onNavigate('billpayments')}
                  className="bg-white border-2 border-neutral-200 hover:border-primary-500 p-4 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 text-left relative overflow-hidden group min-h-[120px]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="relative z-10">
                    <div className="bg-primary-100 w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary-200 transition-colors">
                      <Tv className="w-6 h-6 text-primary-700" />
                    </div>
                    
                    <p className="text-base font-semibold text-neutral-900 mb-1">
                      TV Subscription
                    </p>
                    
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      DStv • Azam • StarTimes
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Education */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg shadow-md">
                  <GraduationCap className="size-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Elimu</h2>
                  <p className="text-xs text-gray-500">Education Services</p>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => onNavigate('governmentservices')}
                  className="w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <GraduationCap className="size-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-base font-semibold text-gray-900 mb-0.5">School Fees / Ada</p>
                      <p className="text-sm text-gray-600">Primary, secondary, university</p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('governmentservices')}
                  className="w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <FileText className="size-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-base font-semibold text-gray-900 mb-0.5">HESLB Loan</p>
                      <p className="text-sm text-gray-600">Student loan payments</p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-gray-600 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Travel & Transport */}
            <div>
              {/* Section Header with Mode Toggle */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2.5 rounded-xl shadow-lg">
                      <Plane className="size-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">GO Travel</h2>
                      <p className="text-xs text-gray-600">Unified Booking System</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onNavigate('travel')}
                    className="text-sm text-green-600 font-semibold hover:text-green-700 transition-colors"
                  >
                    View All
                  </button>
                </div>
                
                {/* Tourist vs Local Mode Toggle */}
                <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-3 border border-green-200/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="size-4 text-green-600" />
                      <span className="text-sm font-semibold text-gray-900">Mode:</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm">
                      <button className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md flex items-center gap-1.5 transition-all">
                        🇹🇿 Local
                      </button>
                      <button className="text-gray-600 px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-all flex items-center gap-1.5">
                        🌍 Tourist
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Shield className="size-3.5 text-green-600" />
                    <p className="text-xs text-green-700">
                      Prices in TZS • NIDA verified • Fraud protected
                    </p>
                  </div>
                </div>
              </div>

              {/* Premium Booking Cards Grid */}
              <div className="space-y-3 mb-4">
                {/* Featured: SGR Railway */}
                <button
                  onClick={() => onNavigate('travel')}
                  className="w-full bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 rounded-3xl p-5 shadow-xl hover:shadow-2xl transition-all active:scale-[0.98] relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-400/20 rounded-full -ml-16 -mb-16 blur-xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/30 shadow-lg">
                        <Bus className="size-8 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-xl font-bold text-white">SGR Express Train</p>
                          <span className="bg-white/25 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full font-semibold border border-white/40">Gov't Verified</span>
                        </div>
                        <p className="text-sm text-green-100 mb-2">TRC Standard Gauge Railway • Fast & Reliable</p>
                        <div className="flex items-center gap-3 text-xs text-white/90">
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3" />
                            DAR-Morogoro-Dodoma
                          </span>
                          <span className="flex items-center gap-1">
                            <Shield className="size-3" />
                            Offline Tickets
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="size-6 text-white group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* National Parks Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => onNavigate('travel')}
                    className="bg-white p-4 rounded-2xl border-2 border-orange-200 shadow-lg hover:shadow-xl transition-all active:scale-95 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-100 to-red-100 rounded-full -mr-12 -mt-12 opacity-50"></div>
                    <div className="relative">
                      <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-xl shadow-lg mb-3 w-fit group-hover:scale-110 transition-transform">
                        <Mountain className="size-6 text-white" />
                      </div>
                      <p className="text-base font-bold text-gray-900 mb-1">National Parks</p>
                      <p className="text-xs text-gray-600 mb-2">Serengeti, Kilimanjaro, Ngorongoro</p>
                      <div className="flex items-center gap-1 text-xs text-orange-600 font-semibold">
                        <Ticket className="size-3" />
                        TANAPA Official
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => onNavigate('travel')}
                    className="bg-white p-4 rounded-2xl border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all active:scale-95 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full -mr-12 -mt-12 opacity-50"></div>
                    <div className="relative">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-3 rounded-xl shadow-lg mb-3 w-fit group-hover:scale-110 transition-transform">
                        <Plane className="size-6 text-white" />
                      </div>
                      <p className="text-base font-bold text-gray-900 mb-1">Flights</p>
                      <p className="text-xs text-gray-600 mb-2">Domestic & regional routes</p>
                      <div className="flex items-center gap-1 text-xs text-blue-600 font-semibold">
                        <Shield className="size-3" />
                        Instant E-Ticket
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => onNavigate('travel')}
                    className="bg-white p-4 rounded-2xl border-2 border-cyan-200 shadow-lg hover:shadow-xl transition-all active:scale-95 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-full -mr-12 -mt-12 opacity-50"></div>
                    <div className="relative">
                      <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl shadow-lg mb-3 w-fit group-hover:scale-110 transition-transform">
                        <Ship className="size-6 text-white" />
                      </div>
                      <p className="text-base font-bold text-gray-900 mb-1">Ferry</p>
                      <p className="text-xs text-gray-600 mb-2">Zanzibar, Pemba & Islands</p>
                      <div className="flex items-center gap-1 text-xs text-cyan-600 font-semibold">
                        <Clock className="size-3" />
                        Real-time Seats
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => onNavigate('travel')}
                    className="bg-white p-4 rounded-2xl border-2 border-amber-200 shadow-lg hover:shadow-xl transition-all active:scale-95 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full -mr-12 -mt-12 opacity-50"></div>
                    <div className="relative">
                      <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-xl shadow-lg mb-3 w-fit group-hover:scale-110 transition-transform">
                        <Hotel className="size-6 text-white" />
                      </div>
                      <p className="text-base font-bold text-gray-900 mb-1">Hotels</p>
                      <p className="text-xs text-gray-600 mb-2">Verified accommodations</p>
                      <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold">
                        <Star className="size-3" />
                        Best Price
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => onNavigate('travel')}
                    className="bg-white p-4 rounded-2xl border-2 border-green-200 shadow-lg hover:shadow-xl transition-all active:scale-95 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full -mr-12 -mt-12 opacity-50"></div>
                    <div className="relative">
                      <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg mb-3 w-fit group-hover:scale-110 transition-transform">
                        <Bus className="size-6 text-white" />
                      </div>
                      <p className="text-base font-bold text-gray-900 mb-1">Buses</p>
                      <p className="text-xs text-gray-600 mb-2">Intercity & long distance</p>
                      <div className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                        <MapPin className="size-3" />
                        All Routes
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => onNavigate('travel')}
                    className="bg-white p-4 rounded-2xl border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all active:scale-95 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -mr-12 -mt-12 opacity-50"></div>
                    <div className="relative">
                      <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl shadow-lg mb-3 w-fit group-hover:scale-110 transition-transform">
                        <Bike className="size-6 text-white" />
                      </div>
                      <p className="text-base font-bold text-gray-900 mb-1">Car Rental</p>
                      <p className="text-xs text-gray-600 mb-2">Self-drive & chauffeur</p>
                      <div className="flex items-center gap-1 text-xs text-purple-600 font-semibold">
                        <Car className="size-3" />
                        Daily/Weekly
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Security & Trust Banner */}
              <div className="bg-gradient-to-r from-blue-50 via-cyan-50 to-teal-50 rounded-2xl p-4 border border-blue-200/50">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 p-2.5 rounded-xl shadow-md">
                    <Shield className="size-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900 mb-1">Bank of Tanzania Approved</p>
                    <p className="text-xs text-gray-600 mb-2">
                      All bookings are encrypted, fraud-protected & work offline
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Check className="size-3 text-green-600" />
                        Encrypted QR
                      </span>
                      <span className="flex items-center gap-1">
                        <Check className="size-3 text-green-600" />
                        Step-up Security
                      </span>
                      <span className="flex items-center gap-1">
                        <Check className="size-3 text-green-600" />
                        Gov't Keys
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lifestyle */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 p-2 rounded-lg shadow-md">
                  <Star className="size-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Maisha</h2>
                  <p className="text-xs text-gray-500">Lifestyle Services</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onNavigate('gofood')}
                  className="bg-gradient-to-br from-orange-500 to-red-500 p-5 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95 text-white relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative">
                    <Utensils className="size-7 mb-2" />
                    <p className="text-base font-semibold mb-1 text-[rgb(248,250,255)]">GO Food</p>
                    <p className="text-xs opacity-90 text-[rgb(248,250,255)]">Food delivery</p>
                  </div>
                </button>

                <button
                  onClick={() => onNavigate('movies')}
                  className="bg-gradient-to-br from-purple-500 to-pink-500 p-5 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95 text-white relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative">
                    <Ticket className="size-7 mb-2" />
                    <p className="text-base font-semibold mb-1">Movies</p>
                    <p className="text-xs opacity-90">Cinema tickets</p>
                  </div>
                </button>

                <button
                  onClick={() => onNavigate('rides')}
                  className="bg-gradient-to-br from-green-500 to-emerald-500 p-5 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95 text-white relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative">
                    <Car className="size-7 mb-2" />
                    <p className="text-base font-semibold mb-1">GO Ride</p>
                    <p className="text-xs opacity-90">Taxi & rides</p>
                  </div>
                </button>

                <button
                  onClick={() => onNavigate('gosafari')}
                  className="bg-gradient-to-br from-teal-500 to-cyan-500 p-5 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95 text-white relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative">
                    <Mountain className="size-7 mb-2" />
                    <p className="text-base font-semibold mb-1">GO Safari</p>
                    <p className="text-xs opacity-90">Tours & parks</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Financial Services */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-2 rounded-lg shadow-md">
                  <DollarSign className="size-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Fedha</h2>
                  <p className="text-xs text-gray-500">Financial Services</p>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => onNavigate('loans')}
                  className="w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <PiggyBank className="size-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-base font-semibold text-gray-900 mb-0.5">Mikopo / Loans</p>
                      <p className="text-sm text-gray-500">Instant personal loans</p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('insurance')}
                  className="w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <Shield className="size-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-base font-semibold text-gray-900 mb-0.5">Bima / Insurance</p>
                      <p className="text-sm text-gray-500">Health, life, car insurance</p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('investments')}
                  className="w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <TrendingUp className="size-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-base font-semibold text-gray-900 mb-0.5">Uwekezaji / Invest</p>
                      <p className="text-sm text-gray-500">Stocks, bonds, savings</p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Business Services */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg shadow-md">
                  <Building2 className="size-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Biashara</h2>
                  <p className="text-xs text-gray-500">Business Services</p>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => onNavigate('smebusinesssuite')}
                  className="w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <Building2 className="size-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-base font-semibold text-gray-900 mb-0.5">SME Business Suite</p>
                      <p className="text-sm text-gray-500">Tools for your business</p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('merchant')}
                  className="w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <ShoppingBag className="size-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-base font-semibold text-gray-900 mb-0.5">Merchant Services</p>
                      <p className="text-sm text-gray-500">Accept payments, POS</p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('smebusinesssuite')}
                  className="w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <Users className="size-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-base font-semibold text-gray-900 mb-0.5">Payroll Management</p>
                      <p className="text-sm text-gray-500">Employee salary payments</p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* AI Assistant Banner */}
            <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-400/20 rounded-full -ml-16 -mb-16 blur-xl"></div>
              <div className="relative flex items-start gap-4">
                <div className="bg-white/25 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-lg">
                  <Sparkles className="size-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-base mb-1">Need Help Finding a Service?</p>
                  <p className="text-green-100 text-sm mb-4">Our AI assistant can guide you to the right service instantly</p>
                  <button className="bg-white text-green-700 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-green-50 transition-colors shadow-lg active:scale-95">
                    Ask AI Assistant
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentTab === 'activity' && (
        <div className="px-5 pt-8 pb-6">
          <h1 className="text-3xl mb-6">Activity</h1>

          {/* Transaction History */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100">
            {transactions.length === 0 ? (
              <div className="p-8 text-center">
                <div className="bg-gray-100 p-4 rounded-full w-fit mx-auto mb-3">
                  <History className="size-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No transactions yet</p>
              </div>
            ) : (
              transactions.map((transaction) => (
                <div key={transaction.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${
                      transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'credit' ? (
                        <ArrowDownLeft className="size-5 text-green-600" />
                      ) : (
                        <ArrowUpRight className="size-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm mb-0.5">{transaction.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-xs text-gray-500">{transaction.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {currentTab === 'profile' && (
        <div className="px-5 pt-8 pb-6">
          <h1 className="text-3xl mb-6">Profile</h1>

          {/* Profile Header */}
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-6 text-white mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <UserIcon className="size-12" />
              </div>
              <div>
                <p className="text-2xl mb-1 text-[rgb(249,250,253)]">{user.name}</p>
                <p className="text-sm text-green-100">{user.email}</p>
                <p className="text-sm text-green-100">{user.phone}</p>
              </div>
            </div>
          </div>

          {/* Profile Menu */}
          <div className="space-y-3">
            <button
              onClick={() => onNavigate('profile')}
              className="w-full bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 p-3 rounded-xl">
                  <UserIcon className="size-5 text-gray-700" />
                </div>
                <p className="text-base">Edit Profile</p>
              </div>
              <ChevronRight className="size-5 text-gray-400" />
            </button>

            <button
              onClick={() => onNavigate('security')}
              className="w-full bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 p-3 rounded-xl">
                  <Shield className="size-5 text-gray-700" />
                </div>
                <p className="text-base">Security & Privacy</p>
              </div>
              <ChevronRight className="size-5 text-gray-400" />
            </button>

            <button
              onClick={() => onNavigate('membership')}
              className="w-full bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-3 rounded-xl">
                  <Award className="size-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-base">Membership</p>
                  <p className="text-xs text-gray-500">Gold Member</p>
                </div>
              </div>
              <ChevronRight className="size-5 text-gray-400" />
            </button>

            <button
              onClick={onLogout}
              className="w-full bg-red-50 p-5 rounded-2xl border border-red-100 shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="bg-red-100 p-3 rounded-xl">
                  <LogOut className="size-5 text-red-600" />
                </div>
                <p className="text-base text-red-600">Logout</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 z-50 pb-safe">
        <div className="max-w-md mx-auto px-4 py-3 bg-white/80 backdrop-blur-xl border-t border-gray-100">
          <div className="flex justify-around items-center relative bg-gray-50 rounded-[24px] p-2">
            {/* Animated floating indicator */}
            <div 
              className="absolute h-14 bg-gradient-to-br from-green-500 via-emerald-600 to-green-700 rounded-[20px] transition-all duration-500 ease-out shadow-xl shadow-green-500/30"
              style={{
                left: `${
                  currentTab === 'home' ? '2%' :
                  currentTab === 'rewards' ? '18%' :
                  currentTab === 'finance' ? '35%' :
                  currentTab === 'services' ? '52%' :
                  currentTab === 'activity' ? '69%' :
                  '85.5%'
                }`,
                width: '13.5%',
                top: '50%',
                transform: 'translateY(-50%) scale(1.05)',
              }}
            />
            
            <button
              onClick={() => setCurrentTab('home')}
              className="flex-1 flex flex-col items-center gap-1 py-2.5 transition-all duration-300 relative z-10 active:scale-95"
            >
              <HomeIcon className={`size-6 transition-all duration-300 ${
                currentTab === 'home' 
                  ? 'text-white scale-125 drop-shadow-lg' 
                  : 'text-gray-500 hover:text-gray-700'
              }`} />
              <span className={`text-[10px] font-bold transition-all duration-300 ${
                currentTab === 'home' 
                  ? 'text-white opacity-100 scale-105' 
                  : 'text-gray-600 opacity-80'
              }`}>
                Home
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('rewards')}
              className="flex-1 flex flex-col items-center gap-1 py-2.5 transition-all duration-300 relative z-10 active:scale-95"
            >
              <RewardsIcon className={`size-6 transition-all duration-300 ${
                currentTab === 'rewards' 
                  ? 'text-white scale-125 drop-shadow-lg' 
                  : 'text-gray-500 hover:text-gray-700'
              }`} />
              <span className={`text-[10px] font-bold transition-all duration-300 ${
                currentTab === 'rewards' 
                  ? 'text-white opacity-100 scale-105' 
                  : 'text-gray-600 opacity-80'
              }`}>
                Rewards
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('finance')}
              className="flex-1 flex flex-col items-center gap-1 py-2.5 transition-all duration-300 relative z-10 active:scale-95"
            >
              <WalletIcon className={`size-6 transition-all duration-300 ${
                currentTab === 'finance' 
                  ? 'text-white scale-125 drop-shadow-lg' 
                  : 'text-gray-500 hover:text-gray-700'
              }`} />
              <span className={`text-[10px] font-bold transition-all duration-300 ${
                currentTab === 'finance' 
                  ? 'text-white opacity-100 scale-105' 
                  : 'text-gray-600 opacity-80'
              }`}>
                Finance
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('services')}
              className="flex-1 flex flex-col items-center gap-1 py-2.5 transition-all duration-300 relative z-10 active:scale-95"
            >
              <ChartIcon className={`size-6 transition-all duration-300 ${
                currentTab === 'services' 
                  ? 'text-white scale-125 drop-shadow-lg' 
                  : 'text-gray-500 hover:text-gray-700'
              }`} />
              <span className={`text-[10px] font-bold transition-all duration-300 ${
                currentTab === 'services' 
                  ? 'text-white opacity-100 scale-105' 
                  : 'text-gray-600 opacity-80'
              }`}>
                Services
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('activity')}
              className="flex-1 flex flex-col items-center gap-1 py-2.5 transition-all duration-300 relative z-10 active:scale-95"
            >
              <History className={`size-6 transition-all duration-300 ${
                currentTab === 'activity' 
                  ? 'text-white fill-white scale-125 drop-shadow-lg' 
                  : 'text-gray-500 hover:text-gray-700'
              }`} />
              <span className={`text-[10px] font-bold transition-all duration-300 ${
                currentTab === 'activity' 
                  ? 'text-white opacity-100 scale-105' 
                  : 'text-gray-600 opacity-80'
              }`}>
                Activity
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('profile')}
              className="flex-1 flex flex-col items-center gap-1 py-2.5 transition-all duration-300 relative z-10 active:scale-95"
            >
              <UserIcon className={`size-6 transition-all duration-300 ${
                currentTab === 'profile' 
                  ? 'text-white fill-white scale-125 drop-shadow-lg' 
                  : 'text-gray-500 hover:text-gray-700'
              }`} />
              <span className={`text-[10px] font-bold transition-all duration-300 ${
                currentTab === 'profile' 
                  ? 'text-white opacity-100 scale-105' 
                  : 'text-gray-600 opacity-80'
              }`}>
                Profile
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}