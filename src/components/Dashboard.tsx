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
  Check,
  Coffee,
  Film
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
  onNavigate: (page: 'wallet' | 'payments' | 'billpayments' | 'merchant' | 'travel' | 'cards' | 'export' | 'rewards' | 'shop' | 'international' | 'subscriptions' | 'shopping' | 'sendmoney' | 'groupmoney' | 'communitywallet' | 'microlans' | 'multicurrencywallet' | 'virtualcardsadvanced' | 'movies' | 'restaurants' | 'rides' | 'rentals' | 'gofood' | 'gosafari' | 'ferrybooking' | 'multimodaltripplanner' | 'parcelshipping' | 'smartshoppingmarketplace' | 'aismartshoppingassistant' | 'deliveryriderdashboard' | 'governmentservices' | 'aiassistant' | 'emergencysos' | 'digitaladdress' | 'smebusinesssuite' | 'offlineqrpayment' | 'securitycenter' | 'tourism' | 'promos' | 'insights' | 'budget' | 'notifications' | 'profile' | 'security' | 'membership' | 'quickpay' | 'mpesa' | 'cashbackrewards' | 'demo') => void;
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
  const [notificationCount, setNotificationCount] = useState(3);
  const [language, setLanguage] = useState<'sw' | 'en'>('sw'); // Language toggle

  useEffect(() => {
    fetchWalletData();
    fetchTransactions();
  }, []);

  const fetchWalletData = async () => {
    setLoading(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/wallet/balance`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` },
          signal: controller.signal,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBalance(data);
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/transactions/recent`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` },
          signal: controller.signal,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      clearTimeout(timeout);
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
    { id: 'reload', name: 'Add Money', icon: PlusIcon, gradient: 'green', action: () => onNavigate('wallet') },
    { id: 'send', name: 'Send', icon: SendMoneyIcon, gradient: 'green', action: () => onNavigate('sendmoney') },
    { id: 'scan', name: 'Scan QR', icon: QRScanIcon, gradient: 'green', action: () => onNavigate('quickpay') },
    { id: 'pay', name: 'Pay Bills', icon: BillsIcon, gradient: 'green', action: () => onNavigate('billpayments') },
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
    { id: 'mpesa', name: 'M-Pesa', provider: 'Vodacom', logo: MPesaLogo, color: 'green' },
    { id: 'tigopesa', name: 'Tigo Pesa', provider: 'Tigo', logo: TigoPesaLogo, color: 'green' },
    { id: 'airtel', name: 'Airtel Money', provider: 'Airtel', logo: AirtelMoneyLogo, color: 'green' },
    { id: 'halopesa', name: 'Halo Pesa', provider: 'Halotel', logo: HaloPesaLogo, color: 'green' },
  ];

  const governmentServices = [
    { id: 'tra', name: 'TRA', desc: 'Tax Payments', icon: FileText, color: 'green' },
    { id: 'nhif', name: 'NHIF', desc: 'Health Insurance', icon: Shield, color: 'green' },
    { id: 'nida', name: 'NIDA', desc: 'ID Services', icon: IdCard, color: 'green' },
    { id: 'university', name: 'School Fees', desc: 'Education', icon: GraduationCap, color: 'green' },
  ];

  const travelServices = [
    { id: 'flights', name: 'Flights', icon: Plane, color: 'green', route: 'travel' },
    { id: 'hotels', name: 'Hotels', icon: Hotel, color: 'green', route: 'travel' },
    { id: 'bus', name: 'Bus', icon: Bus, color: 'green', route: 'travel' },
    { id: 'ferry', name: 'Ferry', icon: Ship, color: 'green', route: 'ferrybooking' },
  ];

  return (
    <div className="min-h-screen pb-20" style={{ background: '#080d08' }}>
      {currentTab === 'home' && (
        <>
          {/* Header with Balance */}
          <div className="px-5 pt-8 pb-8 relative overflow-hidden" style={{
            background: 'linear-gradient(135deg, #14532d 0%, #052e16 100%)'
          }}>
            {/* Premium Ambient Background - ONE gradient hero */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div 
                className="absolute -top-24 -right-24 w-96 h-96 opacity-7"
                style={{
                  background: 'radial-gradient(circle at center, rgba(34, 197, 94, 0.15) 0%, transparent 70%)'
                }}
              />
            </div>

            <div className="relative z-10">
              {/* Top Bar */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontWeight: 300 }}>
                    {language === 'sw' ? 'Habari za asubuhi' : 'Good morning'}
                  </p>
                  <p style={{ fontSize: '20px', color: '#fff', fontWeight: 700, letterSpacing: '-0.5px', marginTop: '2px' }}>
                    {user.name.split(' ')[0]}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Language Toggle */}
                  <button 
                    onClick={() => setLanguage(language === 'sw' ? 'en' : 'sw')}
                    className="hover:opacity-80 px-3 py-1.5 rounded-full transition-all active:scale-95 flex items-center gap-1"
                    style={{ background: 'rgba(255,255,255,0.15)' }}
                  >
                    <span className={`text-xs font-bold ${language === 'sw' ? 'text-white' : 'text-white/50'}`}>SW</span>
                    <span className="text-white/70 text-xs">|</span>
                    <span className={`text-xs font-bold ${language === 'en' ? 'text-white' : 'text-white/50'}`}>EN</span>
                  </button>
                  <button
                    onClick={() => onNavigate('notifications')}
                    aria-label={`Notifications${notificationCount > 0 ? `, ${notificationCount} unread` : ''}`}
                    className="hover:opacity-80 p-2.5 rounded-full relative transition-all active:scale-95"
                    style={{ background: 'rgba(255,255,255,0.15)' }}
                  >
                    <Bell className="size-5 text-white" aria-hidden="true" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 text-white text-xs min-w-5 h-5 rounded-full flex items-center justify-center px-1"
                        style={{ background: '#dc2626' }}
                        aria-hidden="true"
                      >
                        {notificationCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => onNavigate('profile')}
                    aria-label="Profile and settings"
                    className="hover:opacity-80 p-2.5 rounded-full transition-all active:scale-95"
                    style={{ background: 'rgba(255,255,255,0.15)' }}
                  >
                    <Settings className="size-5 text-white" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Balance Card */}
              <div className="rounded-3xl p-6 relative" style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)'
              }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div style={{ 
                      width: '5px', 
                      height: '5px', 
                      borderRadius: '50%', 
                      background: '#4ade80',
                      animation: 'pulse 2s ease-in-out infinite'
                    }} />
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.4px' }}>
                      Main Balance
                    </p>
                  </div>
                  <button
                    onClick={() => setBalanceVisible(!balanceVisible)}
                    className="hover:opacity-80 p-2 rounded-lg transition-all active:scale-95"
                    style={{ background: 'rgba(255,255,255,0.1)' }}
                    aria-label={balanceVisible ? 'Ficha salio' : 'Onyesha salio'}
                    aria-pressed={balanceVisible}
                  >
                    {balanceVisible ? <Eye className="size-4 text-white" /> : <EyeOff className="size-4 text-white" />}
                  </button>
                </div>
                {loading ? (
                  <div className="h-10 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.1)' }}
                    role="status" aria-label="Inapakia salio..." />
                ) : (
                  <div aria-live="polite" aria-atomic="true">
                    <p style={{ fontSize: '38px', fontWeight: 800, color: '#fff', letterSpacing: '-2px', marginBottom: '3px' }}
                      aria-label={balanceVisible ? `Salio: ${formatCurrency(balance.balance)}` : 'Salio limefichwa'}>
                      {balanceVisible ? formatCurrency(balance.balance) : '••••••'}
                    </p>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontWeight: 300 }}>
                      Tanzania Shillings
                    </p>
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
                      <div className="p-3.5 rounded-2xl transition-all active:scale-95 group-hover:scale-105" 
                        style={{ 
                          background: 'rgba(34,197,94,0.1)',
                          border: '1px solid rgba(34,197,94,0.2)'
                        }}
                      >
                        <Icon className="size-5" style={{ stroke: '#4ade80' }} />
                      </div>
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{action.name}</span>
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
              className="w-full rounded-2xl p-6 text-white transition-all active:scale-[0.98] relative overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="p-3 rounded-xl"
                    style={{ background: 'rgba(34,197,94,0.1)' }}
                  >
                    <BillsIcon className="size-6" style={{ stroke: '#4ade80' }} />
                  </div>
                  <div className="text-left">
                    <p style={{ fontSize: '14px', fontWeight: 500, marginBottom: '2px', color: '#fff' }}>
                      Malipo Haraka
                    </p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                      Gusa, scan & kadi za virtual
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-5" style={{ stroke: 'rgba(255,255,255,0.3)' }} />
              </div>
            </button>

            {/* Mobile Money */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#fff', letterSpacing: '-0.5px' }}>
                  Pesa za Simu
                </h3>
                <button 
                  onClick={() => onNavigate('wallet')}
                  className="text-sm hover:opacity-70 active:scale-95 transition-all"
                  style={{ color: '#4ade80', fontWeight: 500 }}
                >
                  Angalia zote
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {mobileMoneyServices.map((service) => {
                  const LogoComponent = service.logo;
                  return (
                    <button
                      key={service.id}
                      onClick={() => onNavigate('wallet')}
                      className="p-5 rounded-2xl transition-all active:scale-95 text-left relative group"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)'
                      }}
                    >
                      <div className="relative z-10">
                        <div className="w-12 h-12 mb-3 rounded-xl p-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <LogoComponent />
                        </div>
                        <p style={{ fontSize: '14px', fontWeight: 500, color: '#fff', marginBottom: '2px' }}>{service.name}</p>
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{service.provider}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pay Bills */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#fff', letterSpacing: '-0.5px' }}>
                  Lipia Bili
                </h3>
                <button 
                  onClick={() => onNavigate('billpayments')}
                  className="text-sm hover:opacity-70 active:scale-95 transition-all"
                  style={{ color: '#4ade80', fontWeight: 500 }}
                >
                  Angalia zote
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {billPayments.map((bill) => {
                  const LogoComponent = bill.logo;
                  return (
                    <button
                      key={bill.id}
                      onClick={() => onNavigate('billpayments')}
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all active:scale-95"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)'
                      }}
                    >
                      <div className="w-14 h-14">
                        <LogoComponent />
                      </div>
                      <div className="text-center">
                        <p style={{ fontSize: '11px', fontWeight: 500, color: '#fff' }}>{bill.name}</p>
                        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>{bill.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Government Services */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#fff', letterSpacing: '-0.5px' }}>
                  Huduma za Serikali
                </h3>
                <button 
                  onClick={() => onNavigate('governmentservices')}
                  className="text-sm hover:opacity-70 active:scale-95 transition-all"
                  style={{ color: '#4ade80', fontWeight: 500 }}
                >
                  Angalia zote
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {governmentServices.map((service) => {
                  const Icon = service.icon;
                  return (
                    <button
                      key={service.id}
                      onClick={() => onNavigate('governmentservices')}
                      className="flex items-center gap-3 p-4 rounded-2xl transition-all active:scale-95"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)'
                      }}
                    >
                      <div className="p-3 rounded-xl" style={{ background: 'rgba(34,197,94,0.1)' }}>
                        <Icon className="size-5" style={{ stroke: '#4ade80' }} />
                      </div>
                      <div className="text-left flex-1">
                        <p style={{ fontSize: '13px', fontWeight: 500, color: '#fff', marginBottom: '2px' }}>{service.name}</p>
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{service.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Travel & Transport */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#fff', letterSpacing: '-0.5px' }}>
                  Safari & Usafiri
                </h3>
                <button 
                  onClick={() => onNavigate('travel')}
                  className="text-sm hover:opacity-70 active:scale-95 transition-all"
                  style={{ color: '#4ade80', fontWeight: 500 }}
                >
                  Angalia zote
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {travelServices.map((service) => {
                  const Icon = service.icon;
                  return (
                    <button
                      key={service.id}
                      onClick={() => onNavigate(service.route as any)}
                      className="p-5 rounded-2xl transition-all active:scale-95 text-left relative group"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)'
                      }}
                    >
                      <div className="relative z-10">
                        <div className="p-3 rounded-xl w-fit mb-3" style={{ background: 'rgba(34,197,94,0.1)' }}>
                          <Icon className="size-5" style={{ stroke: '#4ade80' }} />
                        </div>
                        <p style={{ fontSize: '14px', fontWeight: 500, color: '#fff' }}>{service.name}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Group Money Pools */}
            <button
              onClick={() => onNavigate('groupmoney')}
              className="w-full rounded-2xl p-6 text-white transition-all active:scale-[0.98] relative overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="p-3 rounded-xl"
                    style={{ background: 'rgba(34,197,94,0.1)' }}
                  >
                    <Users className="size-6" style={{ stroke: '#4ade80' }} />
                  </div>
                  <div className="text-left">
                    <p style={{ fontSize: '14px', fontWeight: 500, marginBottom: '2px', color: '#fff' }}>
                      Mkusanyiko wa Kikundi
                    </p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                      Kusanya pesa kwa safari na matukio
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-5" style={{ stroke: 'rgba(255,255,255,0.3)' }} />
              </div>
            </button>

            {/* Food & Dining */}
            <RestaurantsSection onNavigate={onNavigate} />

            {/* Recent Transactions Skeleton */}
            {loading && (
              <div>
                <div className="h-5 w-48 rounded-full mb-4 animate-pulse" style={{ background: 'rgba(255,255,255,0.07)' }} />
                <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} className="p-4 flex items-center gap-3 animate-pulse"
                      style={{ borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none', animationDelay: `${i * 80}ms` }}>
                      <div className="w-10 h-10 rounded-xl flex-shrink-0" style={{ background: 'rgba(255,255,255,0.08)' }} />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3.5 rounded-full w-2/3" style={{ background: 'rgba(255,255,255,0.08)' }} />
                        <div className="h-3 rounded-full w-1/3" style={{ background: 'rgba(255,255,255,0.05)' }} />
                      </div>
                      <div className="h-4 w-14 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Transactions */}
            {!loading && transactions.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#fff', letterSpacing: '-0.5px' }}>
                    Shughuli za Hivi Karibuni
                  </h3>
                  <button 
                    onClick={() => setCurrentTab('activity')}
                    className="text-sm hover:opacity-70 active:scale-95 transition-all"
                    style={{ color: '#4ade80', fontWeight: 500 }}
                  >
                    Angalia zote
                  </button>
                </div>
                <div className="rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {transactions.slice(0, 3).map((transaction, index) => (
                    <div key={transaction.id} className="p-4 flex items-center justify-between transition-colors" style={{
                      borderBottom: index < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none'
                    }}>
                      <div className="flex items-center gap-3">
                        <div 
                          className="p-2.5 rounded-xl"
                          style={{
                            background: transaction.type === 'credit' 
                              ? 'rgba(34, 197, 94, 0.1)' 
                              : 'rgba(239, 68, 68, 0.1)'
                          }}
                        >
                          {transaction.type === 'credit' ? (
                            <ArrowDownLeft className="size-4" style={{ stroke: '#4ade80' }} />
                          ) : (
                            <ArrowUpRight className="size-4" style={{ stroke: '#f87171' }} />
                          )}
                        </div>
                        <div>
                          <p style={{ fontSize: '13px', fontWeight: 500, color: '#fff', marginBottom: '2px' }}>{transaction.description}</p>
                          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                            {new Date(transaction.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p style={{ 
                        fontSize: '14px',
                        fontWeight: 600,
                        color: transaction.type === 'credit' ? '#4ade80' : '#f87171'
                      }}>
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
            <h1 className="text-3xl font-black mb-2" style={{ color: '#fff' }}>GOrewards</h1>
            <p className="text-base font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>Pata tuzo kila ulipolipa • Earn rewards every time you pay</p>
          </div>

          {/* Membership Card */}
          <div className="rounded-3xl p-6 mb-6 relative overflow-hidden" style={{ 
            background: 'linear-gradient(135deg, rgba(22,163,74,0.12) 0%, rgba(22,163,74,0.04) 100%)',
            border: '1px solid rgba(22,163,74,0.15)'
          }}>
            {/* Subtle accent glow - ONE gradient hero */}
            <div className="absolute top-0 right-0 w-48 h-48 opacity-30 blur-3xl" style={{
              background: 'radial-gradient(circle, rgba(22,163,74,0.2) 0%, transparent 70%)'
            }} />
            
            <div className="relative z-10">
              {/* Header Section */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl" style={{ 
                    background: 'rgba(22,163,74,0.15)',
                    border: '1px solid rgba(22,163,74,0.2)'
                  }}>
                    <Award className="size-5" style={{ color: '#16a34a' }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wide mb-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>MEMBERSHIP STATUS</p>
                    <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>Hali ya Uanachama</p>
                  </div>
                </div>
                <button 
                  onClick={() => onNavigate('membership')}
                  className="px-4 py-2 rounded-full transition-all text-xs font-bold active:scale-95"
                  style={{
                    background: '#16a34a',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  Upgrade
                </button>
              </div>
              
              {/* Points Display */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <Sparkles className="size-5" style={{ color: '#16a34a' }} />
                  <p className="text-5xl font-black leading-none" style={{ color: '#fff' }}>2,450</p>
                </div>
                <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>GOrewards Points • Pointi Zilizopo</p>
              </div>

              {/* Tier Status Card */}
              <div className="rounded-2xl p-4 mb-5" style={{ 
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl" style={{ 
                      background: 'rgba(22,163,74,0.15)',
                      border: '1px solid rgba(22,163,74,0.2)'
                    }}>
                      <Star className="size-5" style={{ color: '#16a34a', fill: '#16a34a' }} />
                    </div>
                    <div>
                      <p className="text-lg font-black mb-0.5" style={{ color: '#fff' }}>Gold Member</p>
                      <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>Tier 3 of 4 • Daraja la 3</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black" style={{ color: '#16a34a' }}>550</p>
                    <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>to Platinum</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>Progress to Platinum</span>
                  <span className="font-bold text-sm" style={{ color: '#16a34a' }}>81%</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ 
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}>
                  <div className="h-full rounded-full relative transition-all duration-500" style={{ 
                    width: '81%',
                    background: 'linear-gradient(90deg, #16a34a 0%, rgba(22,163,74,0.8) 100%)',
                    boxShadow: '0 0 12px rgba(22,163,74,0.3)'
                  }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_ease-in-out_infinite]" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-2.5">
                  <TrendingUp className="size-3.5" style={{ color: '#16a34a' }} />
                  <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>Keep earning to unlock VIP benefits</p>
                </div>
              </div>
            </div>
          </div>

          {/* Membership Tiers */}
          <div>
            <h3 className="text-lg mb-4 font-semibold" style={{ color: '#fff' }}>Membership Tiers</h3>
            <div className="grid grid-cols-4 gap-2">
              <div className="p-3 rounded-xl text-center" style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <p className="text-xs font-bold mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>BRONZE</p>
                <p className="text-lg font-black mb-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>1</p>
                <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>0-999</p>
              </div>
              <div className="p-3 rounded-xl text-center" style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <p className="text-xs font-bold mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>SILVER</p>
                <p className="text-lg font-black mb-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>2</p>
                <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>1K-2.4K</p>
              </div>
              <div className="p-3 rounded-xl text-center" style={{
                background: 'rgba(22,163,74,0.12)',
                border: '2px solid rgba(22,163,74,0.4)'
              }}>
                <p className="text-xs font-bold mb-1" style={{ color: '#16a34a' }}>GOLD</p>
                <p className="text-lg font-black mb-0.5" style={{ color: '#16a34a' }}>3</p>
                <p className="text-xs font-semibold" style={{ color: 'rgba(22,163,74,0.8)' }}>2.5K-4.9K</p>
              </div>
              <div className="p-3 rounded-xl text-center" style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <p className="text-xs font-bold mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>PLATINUM</p>
                <p className="text-lg font-black mb-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>4</p>
                <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>5K+</p>
              </div>
            </div>
          </div>

          {/* Featured Rewards */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: '#fff' }}>Featured Rewards</h3>
              <button className="text-sm font-semibold hover:opacity-80 transition-opacity" style={{ color: '#16a34a' }}>View All</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 rounded-2xl transition-all active:scale-95 text-left" style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <div className="p-3 rounded-xl w-fit mb-3" style={{
                  background: 'rgba(22,163,74,0.15)',
                  border: '1px solid rgba(22,163,74,0.2)'
                }}>
                  <Coffee className="size-6" style={{ color: '#16a34a' }} />
                </div>
                <p className="text-sm font-semibold mb-1" style={{ color: '#fff' }}>Starbucks Voucher</p>
                <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>Valid at any branch</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-1 rounded-full font-semibold" style={{
                    background: 'rgba(22,163,74,0.15)',
                    color: '#16a34a'
                  }}>500 pts</span>
                  <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>10K TZS</span>
                </div>
              </button>

              <button className="p-4 rounded-2xl transition-all active:scale-95 text-left" style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <div className="p-3 rounded-xl w-fit mb-3" style={{
                  background: 'rgba(22,163,74,0.15)',
                  border: '1px solid rgba(22,163,74,0.2)'
                }}>
                  <Film className="size-6" style={{ color: '#16a34a' }} />
                </div>
                <p className="text-sm font-semibold mb-1" style={{ color: '#fff' }}>Century Cinemax</p>
                <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>1 movie ticket</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-1 rounded-full font-semibold" style={{
                    background: 'rgba(22,163,74,0.15)',
                    color: '#16a34a'
                  }}>800 pts</span>
                  <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>15K TZS</span>
                </div>
              </button>

              <button className="p-4 rounded-2xl transition-all active:scale-95 text-left" style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <div className="p-3 rounded-xl w-fit mb-3" style={{
                  background: 'rgba(22,163,74,0.15)',
                  border: '1px solid rgba(22,163,74,0.2)'
                }}>
                  <Plane className="size-6" style={{ color: '#16a34a' }} />
                </div>
                <p className="text-sm font-semibold mb-1" style={{ color: '#fff' }}>Precision Air</p>
                <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>50K flight credit</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-1 rounded-full font-semibold" style={{
                    background: 'rgba(22,163,74,0.15)',
                    color: '#16a34a'
                  }}>2,000 pts</span>
                  <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>DSM-JRO</span>
                </div>
              </button>

              <button className="p-4 rounded-2xl transition-all active:scale-95 text-left" style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <div className="p-3 rounded-xl w-fit mb-3" style={{
                  background: 'rgba(22,163,74,0.15)',
                  border: '1px solid rgba(22,163,74,0.2)'
                }}>
                  <Hotel className="size-6" style={{ color: '#16a34a' }} />
                </div>
                <p className="text-sm font-semibold mb-1" style={{ color: '#fff' }}>Serena Hotel</p>
                <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>Weekend stay</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-1 rounded-full font-semibold" style={{
                    background: 'rgba(22,163,74,0.15)',
                    color: '#16a34a'
                  }}>3,500 pts</span>
                  <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>250K TZS</span>
                </div>
              </button>
            </div>
          </div>

          {/* Earn Points Section */}
          <div>
            <h3 className="text-lg mb-4 font-semibold" style={{ color: '#fff' }}>Earn Points</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl" style={{
                background: 'rgba(22,163,74,0.08)',
                border: '1px solid rgba(22,163,74,0.15)'
              }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-xl" style={{
                    background: 'rgba(22,163,74,0.15)',
                    border: '1px solid rgba(22,163,74,0.2)'
                  }}>
                    <Receipt className="size-5" style={{ color: '#16a34a' }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm mb-0.5 font-semibold" style={{ color: '#fff' }}>Every Transaction</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Bills, payments, transfers</p>
                  </div>
                  <p className="text-xl font-bold" style={{ color: '#16a34a' }}>+10</p>
                </div>
                <div className="rounded-xl p-2 text-xs font-medium" style={{
                  background: 'rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.6)'
                }}>
                  340 points earned this month
                </div>
              </div>

              <div className="p-4 rounded-2xl" style={{
                background: 'rgba(22,163,74,0.08)',
                border: '1px solid rgba(22,163,74,0.15)'
              }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-xl" style={{
                    background: 'rgba(22,163,74,0.15)',
                    border: '1px solid rgba(22,163,74,0.2)'
                  }}>
                    <Utensils className="size-5" style={{ color: '#16a34a' }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm mb-0.5 font-semibold" style={{ color: '#fff' }}>Restaurant Orders</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Book & dine in</p>
                  </div>
                  <p className="text-xl font-bold" style={{ color: '#16a34a' }}>+25</p>
                </div>
                <button className="w-full py-2 rounded-xl text-xs font-semibold transition-all active:scale-95" style={{
                  background: 'rgba(22,163,74,0.15)',
                  color: '#16a34a'
                }}>
                  Order Now & Earn
                </button>
              </div>

              <div className="p-4 rounded-2xl" style={{
                background: 'rgba(22,163,74,0.08)',
                border: '1px solid rgba(22,163,74,0.15)'
              }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-xl" style={{
                    background: 'rgba(22,163,74,0.15)',
                    border: '1px solid rgba(22,163,74,0.2)'
                  }}>
                    <Users className="size-5" style={{ color: '#16a34a' }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm mb-0.5" style={{ color: '#fff' }}>Alika Marafiki</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Walipousajili</p>
                  </div>
                  <p className="text-xl font-semibold" style={{ color: '#16a34a' }}>+500</p>
                </div>
                <button
                  onClick={() => {
                    const code = `GOPAY-${user.name.split(' ')[0].toUpperCase().slice(0,6)}`;
                    if (navigator.share) {
                      navigator.share({ title: 'Jiunge na goPay', text: `Tumia nambari yangu ${code} upate TZS 1,000 bure ukifungua akaunti!`, url: 'https://gopay.app' });
                    } else {
                      navigator.clipboard.writeText(code);
                    }
                  }}
                  className="w-full py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80" style={{
                  background: 'rgba(22,163,74,0.15)',
                  color: '#16a34a'
                }}>
                  Shiriki Kiungo
                </button>
              </div>
            </div>
          </div>

          {/* Referral Program */}
          <div className="rounded-2xl p-5" style={{
            background: 'linear-gradient(135deg, rgba(22,163,74,0.1) 0%, rgba(22,163,74,0.03) 100%)',
            border: '1px solid rgba(22,163,74,0.2)'
          }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl" style={{ background: 'rgba(22,163,74,0.2)' }}>
                <Gift className="size-5" style={{ color: '#4ade80' }} />
              </div>
              <div>
                <p style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>Pata TZS 1,000 kwa kila rafiki</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Pesa halisi, si pointi</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: 'Waliojisajili', value: '3' },
                { label: 'Waliolipia', value: '2' },
                { label: 'Umepata', value: '2K TZS' },
              ].map(s => (
                <div key={s.label} className="text-center py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <p style={{ fontSize: '20px', fontWeight: 800, color: '#4ade80' }}>{s.value}</p>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{s.label}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 py-3 px-4 rounded-xl mb-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#fff', flex: 1, letterSpacing: '1px' }}>
                GOPAY-{user.name.split(' ')[0].toUpperCase().slice(0,6)}
              </p>
              <button
                onClick={() => {
                  const code = `GOPAY-${user.name.split(' ')[0].toUpperCase().slice(0,6)}`;
                  navigator.clipboard.writeText(code);
                }}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all active:scale-95"
                style={{ background: 'rgba(22,163,74,0.2)', color: '#4ade80' }}
              >
                Nakili
              </button>
            </div>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
              Rafiki anapaswa kufanya malipo yake ya kwanza ndani ya siku 30
            </p>
          </div>

          {/* Points History */}
          <div>
            <h3 className="text-lg mb-4" style={{ color: '#fff', fontWeight: 700 }}>Recent Activity</h3>
            <div className="rounded-2xl divide-y" style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderColor: 'rgba(255,255,255,0.06)'
            }}>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{
                    background: 'rgba(22,163,74,0.15)',
                    border: '1px solid rgba(22,163,74,0.2)'
                  }}>
                    <TrendingUp className="size-4" style={{ color: '#16a34a' }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#fff' }}>Bill Payment</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>TANESCO - Today</p>
                  </div>
                </div>
                <p className="text-sm font-semibold" style={{ color: '#16a34a' }}>+10</p>
              </div>
              <div className="p-4 flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{
                    background: 'rgba(22,163,74,0.15)',
                    border: '1px solid rgba(22,163,74,0.2)'
                  }}>
                    <TrendingUp className="size-4" style={{ color: '#16a34a' }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#fff' }}>Restaurant Order</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>The Slipway - Yesterday</p>
                  </div>
                </div>
                <p className="text-sm font-semibold" style={{ color: '#16a34a' }}>+25</p>
              </div>
              <div className="p-4 flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{
                    background: 'rgba(22,163,74,0.15)',
                    border: '1px solid rgba(22,163,74,0.2)'
                  }}>
                    <Coffee className="size-4" style={{ color: '#16a34a' }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#fff' }}>Redeemed: Coffee</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>2 days ago</p>
                  </div>
                </div>
                <p className="text-sm font-semibold" style={{ color: '#16a34a' }}>-500</p>
              </div>
            </div>
          </div>

          {/* Cashback Rewards Banner */}
          <button
            onClick={() => onNavigate('cashbackrewards')}
            className="w-full p-5 rounded-2xl text-left transition-all active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, rgba(22,163,74,0.15) 0%, rgba(22,163,74,0.05) 100%)',
              border: '1px solid rgba(22,163,74,0.25)'
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#4ade80', letterSpacing: '0.5px', marginBottom: '4px' }}>
                  CASHBACK YA TZS
                </p>
                <p style={{ fontSize: '22px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>TZS 12,750</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                  Inayosubiri kutolewa • Bonyeza kuona ofa
                </p>
              </div>
              <div className="p-3 rounded-2xl" style={{ background: 'rgba(22,163,74,0.2)' }}>
                <ChevronRight className="size-5" style={{ color: '#4ade80' }} />
              </div>
            </div>
          </button>
        </div>
      )}

      {currentTab === 'finance' && (
        <div className="px-5 pt-8 pb-6">
          <h1 className="text-3xl mb-6 font-black" style={{ color: '#fff' }}>Finance</h1>

          {/* Financial Overview */}
          <div className="rounded-3xl p-6 mb-5 relative overflow-hidden" style={{
            background: 'linear-gradient(135deg, rgba(22,163,74,0.12) 0%, rgba(22,163,74,0.04) 100%)',
            border: '1px solid rgba(22,163,74,0.15)'
          }}>
            <div className="absolute top-0 right-0 w-40 h-40 opacity-30 blur-3xl" style={{
              background: 'radial-gradient(circle, rgba(22,163,74,0.2) 0%, transparent 70%)'
            }} />
            <div className="relative z-10">
              <p className="text-sm mb-2 font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>Akiba ya Jumla</p>
              <p className="text-4xl mb-4 font-black" style={{ color: '#fff' }}>{formatCurrency(balance.balance)}</p>
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#16a34a' }}>
                <TrendingUp className="size-4" />
                <span>+12.5% this month</span>
              </div>
            </div>
          </div>

          {/* Spending Insights */}
          <div className="rounded-2xl p-5 mb-5" style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)'
          }}>
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>Matumizi ya Mwezi Huu</h3>
              <button onClick={() => onNavigate('insights')}
                style={{ fontSize: '12px', color: '#4ade80', fontWeight: 600 }}>Zaidi</button>
            </div>
            {/* Spending category bars */}
            {[
              { label: 'Bili', pct: 38, amount: 85000, color: '#16a34a' },
              { label: 'Chakula', pct: 27, amount: 62000, color: '#22c55e' },
              { label: 'Usafiri', pct: 18, amount: 41000, color: '#4ade80' },
              { label: 'Vitu vingine', pct: 17, amount: 39000, color: 'rgba(74,222,128,0.5)' },
            ].map(cat => (
              <div key={cat.label} className="mb-3">
                <div className="flex justify-between mb-1">
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{cat.label}</span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{formatCurrency(cat.amount)}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${cat.pct}%`, background: cat.color }} />
                </div>
              </div>
            ))}
            <div className="flex justify-between pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>Jumla ya matumizi</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{formatCurrency(227000)}</span>
            </div>
          </div>

          {/* Financial Services */}
          <div className="space-y-3">
            <button
              onClick={() => onNavigate('microlans')}
              className="w-full p-5 rounded-2xl transition-all active:scale-95 flex items-center justify-between"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl" style={{
                  background: 'rgba(22,163,74,0.15)',
                  border: '1px solid rgba(22,163,74,0.2)'
                }}>
                  <DollarSign className="size-6" style={{ color: '#16a34a' }} />
                </div>
                <div className="text-left">
                  <p className="text-base mb-0.5 font-semibold" style={{ color: '#fff' }}>Micro Loans</p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Quick cash when you need it</p>
                </div>
              </div>
              <ChevronRight className="size-5" style={{ color: 'rgba(255,255,255,0.3)' }} />
            </button>

            <button
              onClick={() => onNavigate('budget')}
              className="w-full p-5 rounded-2xl transition-all active:scale-95 flex items-center justify-between"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl" style={{
                  background: 'rgba(22,163,74,0.15)',
                  border: '1px solid rgba(22,163,74,0.2)'
                }}>
                  <BarChart3 className="size-6" style={{ color: '#16a34a' }} />
                </div>
                <div className="text-left">
                  <p className="text-base mb-0.5 font-semibold" style={{ color: '#fff' }}>Budget Tracker</p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Manage your spending</p>
                </div>
              </div>
              <ChevronRight className="size-5" style={{ color: 'rgba(255,255,255,0.3)' }} />
            </button>

            <button
              onClick={() => onNavigate('insights')}
              className="w-full p-5 rounded-2xl transition-all active:scale-95 flex items-center justify-between"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl" style={{
                  background: 'rgba(22,163,74,0.15)',
                  border: '1px solid rgba(22,163,74,0.2)'
                }}>
                  <TrendingUp className="size-6" style={{ color: '#16a34a' }} />
                </div>
                <div className="text-left">
                  <p className="text-base mb-0.5 font-semibold" style={{ color: '#fff' }}>Spending Insights</p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Analyze your expenses</p>
                </div>
              </div>
              <ChevronRight className="size-5" style={{ color: 'rgba(255,255,255,0.3)' }} />
            </button>

            <button
              onClick={() => onNavigate('multicurrencywallet')}
              className="w-full p-5 rounded-2xl transition-all active:scale-95 flex items-center justify-between"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl" style={{
                  background: 'rgba(22,163,74,0.15)',
                  border: '1px solid rgba(22,163,74,0.2)'
                }}>
                  <Globe className="size-6" style={{ color: '#16a34a' }} />
                </div>
                <div className="text-left">
                  <p className="text-base mb-0.5 font-semibold" style={{ color: '#fff' }}>Multi-Currency Wallet</p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>USD, EUR, GBP & more</p>
                </div>
              </div>
              <ChevronRight className="size-5" style={{ color: 'rgba(255,255,255,0.3)' }} />
            </button>
          </div>
        </div>
      )}

      {currentTab === 'services' && (
        <div className="min-h-screen pb-24" style={{ background: '#080d08' }}>
          {/* Hero Header */}
          <div className="relative px-6 pt-8 pb-20 overflow-hidden" style={{
            background: 'linear-gradient(135deg, #14532d 0%, #052e16 100%)'
          }}>
            <div className="absolute top-0 right-0 w-64 h-64 opacity-20 rounded-full -mr-32 -mt-32 blur-3xl" style={{
              background: 'radial-gradient(circle, rgba(22,163,74,0.3) 0%, transparent 70%)'
            }}></div>
            
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2" style={{ color: '#fff' }}>Huduma / Services</h1>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>Everything you need in one place</p>
            </div>
          </div>

          <div className="px-6 -mt-12 space-y-6 pb-6">
            {/* Quick Actions - Featured */}
            <div className="rounded-3xl p-6 relative overflow-hidden" style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)'
            }}>
              <div className="relative">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl" style={{
                      background: 'rgba(22,163,74,0.15)',
                      border: '1px solid rgba(22,163,74,0.2)'
                    }}>
                      <Zap className="size-5" style={{ color: '#16a34a' }} />
                    </div>
                    <h2 className="text-lg font-bold" style={{ color: '#fff' }}>Quick Actions</h2>
                  </div>
                  <span className="text-xs px-3 py-1.5 rounded-full font-semibold" style={{
                    background: 'rgba(22,163,74,0.15)',
                    color: '#16a34a'
                  }}>Popular</span>
                </div>
              <div className="grid grid-cols-4 gap-3">
                <button
                  onClick={() => onNavigate('billpayments')}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all active:scale-95"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  <div className="p-3 rounded-xl" style={{
                    background: 'rgba(22,163,74,0.15)',
                    border: '1px solid rgba(22,163,74,0.2)'
                  }}>
                    <Receipt className="size-5" style={{ color: '#16a34a' }} />
                  </div>
                  <span className="text-xs font-medium text-center" style={{ color: 'rgba(255,255,255,0.8)' }}>Pay Bills</span>
                </button>
                <button
                  onClick={() => onNavigate('billpayments')}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all active:scale-95"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  <div className="p-3 rounded-xl" style={{
                    background: 'rgba(22,163,74,0.15)',
                    border: '1px solid rgba(22,163,74,0.2)'
                  }}>
                    <Smartphone className="size-5" style={{ color: '#16a34a' }} />
                  </div>
                  <span className="text-xs font-medium text-center" style={{ color: 'rgba(255,255,255,0.8)' }}>Airtime</span>
                </button>
                <button
                  onClick={() => onNavigate('travel')}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all active:scale-95"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  <div className="p-3 rounded-xl" style={{
                    background: 'rgba(22,163,74,0.15)',
                    border: '1px solid rgba(22,163,74,0.2)'
                  }}>
                    <Plane className="size-5" style={{ color: '#16a34a' }} />
                  </div>
                  <span className="text-xs font-medium text-center" style={{ color: 'rgba(255,255,255,0.8)' }}>Travel</span>
                </button>
                <button
                  onClick={() => onNavigate('government')}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all active:scale-95"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  <div className="p-3 rounded-xl" style={{
                    background: 'rgba(22,163,74,0.15)',
                    border: '1px solid rgba(22,163,74,0.2)'
                  }}>
                    <Landmark className="size-5" style={{ color: '#16a34a' }} />
                  </div>
                  <span className="text-xs font-medium text-center" style={{ color: 'rgba(255,255,255,0.8)' }}>Gov't</span>
                </button>
              </div>
              </div>
            </div>

            {/* Government & Public Services */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{
                    background: 'rgba(22,163,74,0.15)',
                    border: '1px solid rgba(22,163,74,0.2)'
                  }}>
                    <Landmark className="size-4" style={{ color: '#16a34a' }} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: '#fff' }}>Serikali</h2>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Government Services</p>
                  </div>
                </div>
                <button className="text-sm font-semibold hover:opacity-80 transition-opacity" style={{ color: '#16a34a' }}>View All</button>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => onNavigate('government')}
                  className="w-full p-4 rounded-2xl transition-all active:scale-95 flex items-center justify-between group"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl group-hover:scale-110 transition-transform" style={{
                      background: 'rgba(22,163,74,0.15)',
                      border: '1px solid rgba(22,163,74,0.2)'
                    }}>
                      <Landmark className="size-6" style={{ color: '#16a34a' }} />
                    </div>
                    <div className="text-left">
                      <p className="text-base font-semibold mb-0.5" style={{ color: '#fff' }}>TRA - Kodi</p>
                      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Pay income tax, VAT, PAYE</p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" style={{ color: 'rgba(255,255,255,0.3)' }} />
                </button>

                <button
                  onClick={() => onNavigate('government')}
                  className="w-full p-4 rounded-2xl transition-all active:scale-95 flex items-center justify-between group"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl group-hover:scale-110 transition-transform" style={{
                      background: 'rgba(22,163,74,0.15)',
                      border: '1px solid rgba(22,163,74,0.2)'
                    }}>
                      <IdCard className="size-6" style={{ color: '#16a34a' }} />
                    </div>
                    <div className="text-left">
                      <p className="text-base font-semibold mb-0.5" style={{ color: '#fff' }}>NIDA - Vitambulisho</p>
                      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>National ID verification</p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" style={{ color: 'rgba(255,255,255,0.3)' }} />
                </button>

                <button
                  onClick={() => onNavigate('government')}
                  className="w-full p-4 rounded-2xl transition-all active:scale-95 flex items-center justify-between group"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl group-hover:scale-110 transition-transform" style={{
                      background: 'rgba(22,163,74,0.15)',
                      border: '1px solid rgba(22,163,74,0.2)'
                    }}>
                      <Heart className="size-6" style={{ color: '#16a34a' }} />
                    </div>
                    <div className="text-left">
                      <p className="text-base font-semibold mb-0.5" style={{ color: '#fff' }}>NHIF - Bima ya Afya</p>
                      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Health insurance payments</p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" style={{ color: 'rgba(255,255,255,0.3)' }} />
                </button>

                <button
                  onClick={() => onNavigate('government')}
                  className="w-full p-4 rounded-2xl transition-all active:scale-95 flex items-center justify-between group"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl group-hover:scale-110 transition-transform" style={{
                      background: 'rgba(22,163,74,0.15)',
                      border: '1px solid rgba(22,163,74,0.2)'
                    }}>
                      <Car className="size-6" style={{ color: '#16a34a' }} />
                    </div>
                    <div className="text-left">
                      <p className="text-base font-semibold mb-0.5" style={{ color: '#fff' }}>License & Fines</p>
                      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Driving license, traffic fines</p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" style={{ color: 'rgba(255,255,255,0.3)' }} />
                </button>
              </div>
            </div>

            {/* Utilities & Bills */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{
                    background: 'rgba(22,163,74,0.15)',
                    border: '1px solid rgba(22,163,74,0.2)'
                  }}>
                    <Zap className="size-4" style={{ color: '#16a34a' }} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: '#fff' }}>Huduma za Msingi</h2>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Utilities & Bills</p>
                  </div>
                </div>
                <button className="text-sm font-semibold hover:opacity-80 transition-opacity" style={{ color: '#16a34a' }}>View All</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {/* TANESCO - Electricity */}
                <button
                  onClick={() => onNavigate('billpayments')}
                  className="p-4 rounded-xl transition-all active:scale-95 text-left relative overflow-hidden group min-h-[120px]"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}
                >
                  
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all group-hover:scale-110" style={{
                      background: 'rgba(22,163,74,0.15)',
                      border: '1px solid rgba(22,163,74,0.2)'
                    }}>
                      <Zap className="w-6 h-6" style={{ color: '#16a34a' }} />
                    </div>
                    
                    <p className="text-base font-semibold mb-1" style={{ color: '#fff' }}>
                      TANESCO
                    </p>
                    
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      Umeme • Electricity
                    </p>
                    
                    <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{
                      background: 'rgba(22,163,74,0.15)',
                      color: '#16a34a'
                    }}>
                      Popular
                    </span>
                  </div>
                </button>

                {/* DAWASA - Water */}
                <button
                  onClick={() => onNavigate('billpayments')}
                  className="p-4 rounded-xl transition-all active:scale-95 text-left relative overflow-hidden group min-h-[120px]"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}
                >
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all group-hover:scale-110" style={{
                      background: 'rgba(22,163,74,0.15)',
                      border: '1px solid rgba(22,163,74,0.2)'
                    }}>
                      <Droplet className="w-6 h-6" style={{ color: '#16a34a' }} />
                    </div>
                    
                    <p className="text-base font-semibold mb-1" style={{ color: '#fff' }}>
                      DAWASA
                    </p>
                    
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      Maji • Water
                    </p>
                  </div>
                </button>

                {/* Mobile Money */}
                <button
                  onClick={() => onNavigate('mpesa')}
                  className="p-4 rounded-xl transition-all active:scale-95 text-left relative overflow-hidden group min-h-[120px]"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}
                >
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all group-hover:scale-110" style={{
                      background: 'rgba(22,163,74,0.15)',
                      border: '1px solid rgba(22,163,74,0.2)'
                    }}>
                      <Smartphone className="w-6 h-6" style={{ color: '#16a34a' }} />
                    </div>
                    
                    <p className="text-base font-semibold mb-1" style={{ color: '#fff' }}>
                      Mobile Money
                    </p>
                    
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      M-Pesa • Airtel • Tigo
                    </p>
                    
                    <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{
                      background: 'rgba(22,163,74,0.15)',
                      color: '#16a34a'
                    }}>
                      Fast
                    </span>
                  </div>
                </button>

                {/* TV Subscription */}
                <button
                  onClick={() => onNavigate('billpayments')}
                  className="p-4 rounded-xl transition-all active:scale-95 text-left relative overflow-hidden group min-h-[120px]"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}
                >
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all group-hover:scale-110" style={{
                      background: 'rgba(22,163,74,0.15)',
                      border: '1px solid rgba(22,163,74,0.2)'
                    }}>
                      <Tv className="w-6 h-6" style={{ color: '#16a34a' }} />
                    </div>
                    
                    <p className="text-base font-semibold mb-1" style={{ color: '#fff' }}>
                      TV Subscription
                    </p>
                    
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      DStv • Azam • StarTimes
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Education */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg" style={{
                  background: 'rgba(22,163,74,0.15)',
                  border: '1px solid rgba(22,163,74,0.2)'
                }}>
                  <GraduationCap className="size-4" style={{ color: '#16a34a' }} />
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: '#fff' }}>Elimu</h2>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Education Services</p>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => onNavigate('governmentservices')}
                  className="w-full p-4 rounded-2xl transition-all active:scale-95 flex items-center justify-between group"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl group-hover:scale-110 transition-transform" style={{
                      background: 'rgba(22,163,74,0.15)',
                      border: '1px solid rgba(22,163,74,0.2)'
                    }}>
                      <GraduationCap className="size-6" style={{ color: '#16a34a' }} />
                    </div>
                    <div className="text-left">
                      <p className="text-base font-semibold mb-0.5" style={{ color: '#fff' }}>School Fees / Ada</p>
                      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Primary, secondary, university</p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" style={{ color: 'rgba(255,255,255,0.3)' }} />
                </button>

                <button
                  onClick={() => onNavigate('governmentservices')}
                  className="w-full p-4 rounded-2xl transition-all active:scale-95 flex items-center justify-between group"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl group-hover:scale-110 transition-transform" style={{
                      background: 'rgba(22,163,74,0.15)',
                      border: '1px solid rgba(22,163,74,0.2)'
                    }}>
                      <FileText className="size-6" style={{ color: '#16a34a' }} />
                    </div>
                    <div className="text-left">
                      <p className="text-base font-semibold mb-0.5" style={{ color: '#fff' }}>HESLB Loan</p>
                      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Student loan payments</p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" style={{ color: 'rgba(255,255,255,0.3)' }} />
                </button>
              </div>
            </div>

            {/* Travel & Transport */}
            <div>
              {/* Section Header with Mode Toggle */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl" style={{
                      background: 'rgba(22,163,74,0.15)',
                      border: '1px solid rgba(22,163,74,0.2)'
                    }}>
                      <Plane className="size-5" style={{ color: '#16a34a' }} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold" style={{ color: '#fff' }}>GO Travel</h2>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Unified Booking System</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onNavigate('travel')}
                    className="text-sm font-semibold hover:opacity-80 transition-opacity"
                    style={{ color: '#16a34a' }}
                  >
                    View All
                  </button>
                </div>
                
                {/* Tourist vs Local Mode Toggle */}
                <div className="rounded-2xl p-3" style={{
                  background: 'rgba(22,163,74,0.08)',
                  border: '1px solid rgba(22,163,74,0.15)'
                }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="size-4" style={{ color: '#16a34a' }} />
                      <span className="text-sm font-semibold" style={{ color: '#fff' }}>Mode:</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl p-1" style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)'
                    }}>
                      <button className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5" style={{
                        background: '#16a34a',
                        color: '#fff'
                      }}>
                        Local Resident
                      </button>
                      <button className="px-4 py-1.5 rounded-lg text-xs font-semibold hover:opacity-80 transition-all flex items-center gap-1.5" style={{
                        color: 'rgba(255,255,255,0.6)'
                      }}>
                        International
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Shield className="size-3.5" style={{ color: '#16a34a' }} />
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
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
                  className="w-full rounded-3xl p-5 transition-all active:scale-[0.98] relative overflow-hidden group"
                  style={{
                    background: 'linear-gradient(135deg, rgba(22,163,74,0.12) 0%, rgba(22,163,74,0.06) 100%)',
                    border: '1px solid rgba(22,163,74,0.2)'
                  }}
                >
                  <div className="absolute top-0 right-0 w-48 h-48 opacity-20 rounded-full -mr-24 -mt-24 blur-2xl" style={{
                    background: 'radial-gradient(circle, rgba(22,163,74,0.4) 0%, transparent 70%)'
                  }}></div>
                  
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-4 rounded-2xl" style={{
                        background: 'rgba(22,163,74,0.2)',
                        border: '1px solid rgba(22,163,74,0.3)'
                      }}>
                        <Bus className="size-8" style={{ color: '#16a34a' }} />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-xl font-bold" style={{ color: '#fff' }}>SGR Express Train</p>
                          <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{
                            background: 'rgba(22,163,74,0.15)',
                            color: '#16a34a',
                            border: '1px solid rgba(22,163,74,0.2)'
                          }}>Gov't Verified</span>
                        </div>
                        <p className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>TRC Standard Gauge Railway • Fast & Reliable</p>
                        <div className="flex items-center gap-3 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
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
                    <ChevronRight className="size-6 group-hover:translate-x-1 transition-transform" style={{ color: 'rgba(255,255,255,0.6)' }} />
                  </div>
                </button>

                {/* National Parks Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => onNavigate('travel')}
                    className="p-4 rounded-2xl transition-all active:scale-95 relative overflow-hidden group"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}
                  >
                    <div className="relative">
                      <div className="p-3 rounded-xl mb-3 w-fit group-hover:scale-110 transition-transform" style={{
                        background: 'rgba(22,163,74,0.15)',
                        border: '1px solid rgba(22,163,74,0.2)'
                      }}>
                        <Mountain className="size-6" style={{ color: '#16a34a' }} />
                      </div>
                      <p className="text-base font-bold mb-1" style={{ color: '#fff' }}>National Parks</p>
                      <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>Serengeti, Kilimanjaro, Ngorongoro</p>
                      <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#16a34a' }}>
                        <Ticket className="size-3" />
                        TANAPA Official
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => onNavigate('travel')}
                    className="p-4 rounded-2xl transition-all active:scale-95 relative overflow-hidden group"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}
                  >
                    <div className="relative">
                      <div className="p-3 rounded-xl mb-3 w-fit group-hover:scale-110 transition-transform" style={{
                        background: 'rgba(22,163,74,0.15)',
                        border: '1px solid rgba(22,163,74,0.2)'
                      }}>
                        <Plane className="size-6" style={{ color: '#16a34a' }} />
                      </div>
                      <p className="text-base font-bold mb-1" style={{ color: '#fff' }}>Flights</p>
                      <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>Domestic & regional routes</p>
                      <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#16a34a' }}>
                        <Shield className="size-3" />
                        Instant E-Ticket
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => onNavigate('travel')}
                    className="p-4 rounded-2xl transition-all active:scale-95 relative overflow-hidden group"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}
                  >
                    <div className="relative">
                      <div className="p-3 rounded-xl mb-3 w-fit group-hover:scale-110 transition-transform" style={{
                        background: 'rgba(22,163,74,0.15)',
                        border: '1px solid rgba(22,163,74,0.2)'
                      }}>
                        <Ship className="size-6" style={{ color: '#16a34a' }} />
                      </div>
                      <p className="text-base font-bold mb-1" style={{ color: '#fff' }}>Ferry</p>
                      <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>Zanzibar, Pemba & Islands</p>
                      <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#16a34a' }}>
                        <Clock className="size-3" />
                        Real-time Seats
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => onNavigate('travel')}
                    className="p-4 rounded-2xl transition-all active:scale-95 relative overflow-hidden group"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}
                  >
                    <div className="relative">
                      <div className="p-3 rounded-xl mb-3 w-fit group-hover:scale-110 transition-transform" style={{
                        background: 'rgba(22,163,74,0.15)',
                        border: '1px solid rgba(22,163,74,0.2)'
                      }}>
                        <Hotel className="size-6" style={{ color: '#16a34a' }} />
                      </div>
                      <p className="text-base font-bold mb-1" style={{ color: '#fff' }}>Hotels</p>
                      <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>Verified accommodations</p>
                      <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#16a34a' }}>
                        <Star className="size-3" />
                        Best Price
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => onNavigate('travel')}
                    className="p-4 rounded-2xl transition-all active:scale-95 relative overflow-hidden group"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}
                  >
                    <div className="relative">
                      <div className="p-3 rounded-xl mb-3 w-fit group-hover:scale-110 transition-transform" style={{
                        background: 'rgba(22,163,74,0.15)',
                        border: '1px solid rgba(22,163,74,0.2)'
                      }}>
                        <Bus className="size-6" style={{ color: '#16a34a' }} />
                      </div>
                      <p className="text-base font-bold mb-1" style={{ color: '#fff' }}>Buses</p>
                      <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>Intercity & long distance</p>
                      <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#16a34a' }}>
                        <MapPin className="size-3" />
                        All Routes
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => onNavigate('travel')}
                    className="p-4 rounded-2xl transition-all active:scale-95 relative overflow-hidden group"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}
                  >
                    <div className="relative">
                      <div className="p-3 rounded-xl mb-3 w-fit group-hover:scale-110 transition-transform" style={{
                        background: 'rgba(22,163,74,0.15)',
                        border: '1px solid rgba(22,163,74,0.2)'
                      }}>
                        <Car className="size-6" style={{ color: '#16a34a' }} />
                      </div>
                      <p className="text-base font-bold mb-1" style={{ color: '#fff' }}>Car Rental</p>
                      <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>Self-drive & chauffeur</p>
                      <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#16a34a' }}>
                        <Car className="size-3" />
                        Daily/Weekly
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Security & Trust Banner */}
              <div className="rounded-2xl p-4" style={{
                background: 'rgba(22,163,74,0.08)',
                border: '1px solid rgba(22,163,74,0.15)'
              }}>
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl" style={{
                    background: 'rgba(22,163,74,0.15)',
                    border: '1px solid rgba(22,163,74,0.2)'
                  }}>
                    <Shield className="size-5" style={{ color: '#16a34a' }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold mb-1" style={{ color: '#fff' }}>Bank of Tanzania Approved</p>
                    <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      All bookings are encrypted, fraud-protected & work offline
                    </p>
                    <div className="flex items-center gap-3 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      <span className="flex items-center gap-1">
                        <Check className="size-3" style={{ color: '#16a34a' }} />
                        Encrypted QR
                      </span>
                      <span className="flex items-center gap-1">
                        <Check className="size-3" style={{ color: '#16a34a' }} />
                        Step-up Security
                      </span>
                      <span className="flex items-center gap-1">
                        <Check className="size-3" style={{ color: '#16a34a' }} />
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
                <div className="p-2 rounded-lg" style={{
                  background: 'rgba(22,163,74,0.15)',
                  border: '1px solid rgba(22,163,74,0.2)'
                }}>
                  <Star className="size-4" style={{ color: '#16a34a' }} />
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: '#fff' }}>Maisha</h2>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Lifestyle Services</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onNavigate('gofood')}
                  className="p-5 rounded-2xl transition-all active:scale-95 relative overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}
                >
                  <div className="relative">
                    <div className="p-3 rounded-xl w-fit mb-3" style={{
                      background: 'rgba(22,163,74,0.15)',
                      border: '1px solid rgba(22,163,74,0.2)'
                    }}>
                      <Utensils className="size-7" style={{ color: '#16a34a' }} />
                    </div>
                    <p className="text-base font-semibold mb-1" style={{ color: '#fff' }}>GO Food</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Food delivery</p>
                  </div>
                </button>

                <button
                  onClick={() => onNavigate('movies')}
                  className="p-5 rounded-2xl transition-all active:scale-95 relative overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}
                >
                  <div className="relative">
                    <div className="p-3 rounded-xl w-fit mb-3" style={{
                      background: 'rgba(22,163,74,0.15)',
                      border: '1px solid rgba(22,163,74,0.2)'
                    }}>
                      <Film className="size-7" style={{ color: '#16a34a' }} />
                    </div>
                    <p className="text-base font-semibold mb-1" style={{ color: '#fff' }}>Movies</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Cinema tickets</p>
                  </div>
                </button>

                <button
                  onClick={() => onNavigate('rides')}
                  className="p-5 rounded-2xl transition-all active:scale-95 relative overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}
                >
                  <div className="relative">
                    <div className="p-3 rounded-xl w-fit mb-3" style={{
                      background: 'rgba(22,163,74,0.15)',
                      border: '1px solid rgba(22,163,74,0.2)'
                    }}>
                      <Car className="size-7" style={{ color: '#16a34a' }} />
                    </div>
                    <p className="text-base font-semibold mb-1" style={{ color: '#fff' }}>GO Ride</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Taxi & rides</p>
                  </div>
                </button>

                <button
                  onClick={() => onNavigate('gosafari')}
                  className="p-5 rounded-2xl transition-all active:scale-95 relative overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}
                >
                  <div className="relative">
                    <div className="p-3 rounded-xl w-fit mb-3" style={{
                      background: 'rgba(22,163,74,0.15)',
                      border: '1px solid rgba(22,163,74,0.2)'
                    }}>
                      <Mountain className="size-7" style={{ color: '#16a34a' }} />
                    </div>
                    <p className="text-base font-semibold mb-1" style={{ color: '#fff' }}>GO Safari</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Tours & parks</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Financial Services */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg" style={{
                  background: 'rgba(22,163,74,0.15)',
                  border: '1px solid rgba(22,163,74,0.2)'
                }}>
                  <DollarSign className="size-4" style={{ color: '#16a34a' }} />
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: '#fff' }}>Fedha</h2>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Financial Services</p>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => onNavigate('loans')}
                  className="w-full p-4 rounded-2xl transition-all active:scale-95 flex items-center justify-between group"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl group-hover:scale-110 transition-transform" style={{
                      background: 'rgba(22,163,74,0.15)',
                      border: '1px solid rgba(22,163,74,0.2)'
                    }}>
                      <PiggyBank className="size-6" style={{ color: '#16a34a' }} />
                    </div>
                    <div className="text-left">
                      <p className="text-base font-semibold mb-0.5" style={{ color: '#fff' }}>Mikopo / Loans</p>
                      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Instant personal loans</p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" style={{ color: 'rgba(255,255,255,0.3)' }} />
                </button>

                <button
                  onClick={() => onNavigate('insurance')}
                  className="w-full p-4 rounded-2xl transition-all active:scale-95 flex items-center justify-between group"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl group-hover:scale-110 transition-transform" style={{
                      background: 'rgba(22,163,74,0.15)',
                      border: '1px solid rgba(22,163,74,0.2)'
                    }}>
                      <Shield className="size-6" style={{ color: '#16a34a' }} />
                    </div>
                    <div className="text-left">
                      <p className="text-base font-semibold mb-0.5" style={{ color: '#fff' }}>Bima / Insurance</p>
                      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Health, life, car insurance</p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" style={{ color: 'rgba(255,255,255,0.3)' }} />
                </button>

                <button
                  onClick={() => onNavigate('investments')}
                  className="w-full p-4 rounded-2xl transition-all active:scale-95 flex items-center justify-between group"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl group-hover:scale-110 transition-transform" style={{
                      background: 'rgba(22,163,74,0.15)',
                      border: '1px solid rgba(22,163,74,0.2)'
                    }}>
                      <TrendingUp className="size-6" style={{ color: '#16a34a' }} />
                    </div>
                    <div className="text-left">
                      <p className="text-base font-semibold mb-0.5" style={{ color: '#fff' }}>Uwekezaji / Invest</p>
                      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Stocks, bonds, savings</p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" style={{ color: 'rgba(255,255,255,0.3)' }} />
                </button>
              </div>
            </div>

            {/* Business Services */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg" style={{
                  background: 'rgba(22,163,74,0.15)',
                  border: '1px solid rgba(22,163,74,0.2)'
                }}>
                  <Building2 className="size-4" style={{ color: '#16a34a' }} />
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: '#fff' }}>Biashara</h2>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Business Services</p>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => onNavigate('smebusinesssuite')}
                  className="w-full p-4 rounded-2xl transition-all active:scale-95 flex items-center justify-between group"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl group-hover:scale-110 transition-transform" style={{
                      background: 'rgba(22,163,74,0.15)',
                      border: '1px solid rgba(22,163,74,0.2)'
                    }}>
                      <Building2 className="size-6" style={{ color: '#16a34a' }} />
                    </div>
                    <div className="text-left">
                      <p className="text-base font-semibold mb-0.5" style={{ color: '#fff' }}>SME Business Suite</p>
                      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Tools for your business</p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" style={{ color: 'rgba(255,255,255,0.3)' }} />
                </button>

                <button
                  onClick={() => onNavigate('merchant')}
                  className="w-full p-4 rounded-2xl transition-all active:scale-95 flex items-center justify-between group"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl group-hover:scale-110 transition-transform" style={{
                      background: 'rgba(22,163,74,0.15)',
                      border: '1px solid rgba(22,163,74,0.2)'
                    }}>
                      <ShoppingBag className="size-6" style={{ color: '#16a34a' }} />
                    </div>
                    <div className="text-left">
                      <p className="text-base font-semibold mb-0.5" style={{ color: '#fff' }}>Merchant Services</p>
                      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Accept payments, POS</p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" style={{ color: 'rgba(255,255,255,0.3)' }} />
                </button>

                <button
                  onClick={() => onNavigate('smebusinesssuite')}
                  className="w-full p-4 rounded-2xl transition-all active:scale-95 flex items-center justify-between group"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl group-hover:scale-110 transition-transform" style={{
                      background: 'rgba(22,163,74,0.15)',
                      border: '1px solid rgba(22,163,74,0.2)'
                    }}>
                      <Users className="size-6" style={{ color: '#16a34a' }} />
                    </div>
                    <div className="text-left">
                      <p className="text-base font-semibold mb-0.5" style={{ color: '#fff' }}>Payroll Management</p>
                      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Employee salary payments</p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" style={{ color: 'rgba(255,255,255,0.3)' }} />
                </button>
              </div>
            </div>

            {/* AI Assistant Banner */}
            <div className="rounded-3xl p-6 relative overflow-hidden" style={{
              background: 'linear-gradient(135deg, rgba(22,163,74,0.12) 0%, rgba(22,163,74,0.06) 100%)',
              border: '1px solid rgba(22,163,74,0.2)'
            }}>
              <div className="absolute top-0 right-0 w-40 h-40 opacity-20 rounded-full -mr-20 -mt-20 blur-2xl" style={{
                background: 'radial-gradient(circle, rgba(22,163,74,0.3) 0%, transparent 70%)'
              }}></div>
              <div className="relative flex items-start gap-4">
                <div className="p-3 rounded-2xl" style={{
                  background: 'rgba(22,163,74,0.2)',
                  border: '1px solid rgba(22,163,74,0.3)'
                }}>
                  <Sparkles className="size-6" style={{ color: '#16a34a' }} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-base mb-1" style={{ color: '#fff' }}>Need Help Finding a Service?</p>
                  <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>Our AI assistant can guide you to the right service instantly</p>
                  <button className="px-5 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95" style={{
                    background: '#16a34a',
                    color: '#fff'
                  }}>
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
          <h1 className="text-3xl mb-6" style={{ color: 'rgba(255,255,255,0.95)' }}>Activity</h1>

          {/* Transaction History */}
          <div className="rounded-2xl border divide-y" style={{ 
            background: 'rgba(255,255,255,0.02)',
            borderColor: 'rgba(255,255,255,0.08)',
            '--tw-divide-opacity': '0.08'
          } as any}>
            {transactions.length === 0 ? (
              <div className="p-8 text-center">
                <div className="p-4 rounded-full w-fit mx-auto mb-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <History className="size-8" style={{ color: 'rgba(255,255,255,0.3)' }} />
                </div>
                <p style={{ color: 'rgba(255,255,255,0.4)' }}>No transactions yet</p>
              </div>
            ) : (
              transactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="p-4 flex items-center justify-between transition-colors hover:bg-white/5"
                  style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${
                      transaction.type === 'credit' 
                        ? 'bg-[#16a34a]/10' 
                        : 'bg-white/5'
                    }`}>
                      {transaction.type === 'credit' ? (
                        <ArrowDownLeft className="size-5 text-[#16a34a]" />
                      ) : (
                        <ArrowUpRight className="size-5" style={{ color: 'rgba(255,255,255,0.4)' }} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm mb-0.5" style={{ color: 'rgba(255,255,255,0.9)' }}>
                        {transaction.description}
                      </p>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {new Date(transaction.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      transaction.type === 'credit' ? 'text-[#16a34a]' : ''
                    }`} style={transaction.type === 'debit' ? { color: 'rgba(255,255,255,0.7)' } : {}}>
                      {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {transaction.status}
                    </p>
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
          <div className="rounded-3xl p-6 mb-6 relative overflow-hidden" style={{
            background: 'linear-gradient(135deg, rgba(22,163,74,0.12) 0%, rgba(22,163,74,0.06) 100%)',
            border: '1px solid rgba(22,163,74,0.2)'
          }}>
            <div className="absolute top-0 right-0 w-40 h-40 opacity-20 rounded-full blur-3xl" style={{
              background: 'radial-gradient(circle, rgba(22,163,74,0.3) 0%, transparent 70%)'
            }} />
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-4 rounded-full" style={{
                background: 'rgba(22,163,74,0.2)',
                border: '1px solid rgba(22,163,74,0.3)'
              }}>
                <UserIcon className="size-12" style={{ color: '#16a34a' }} />
              </div>
              <div>
                <p className="text-2xl mb-1" style={{ color: '#fff' }}>{user.name}</p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{user.email}</p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{user.phone}</p>
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
              className="w-full p-5 rounded-2xl transition-all active:scale-95 flex items-center justify-between"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl" style={{
                  background: 'rgba(22,163,74,0.15)',
                  border: '1px solid rgba(22,163,74,0.2)'
                }}>
                  <LogOut className="size-5" style={{ color: '#16a34a' }} />
                </div>
                <p className="text-base" style={{ color: '#fff' }}>Logout</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav role="navigation" aria-label="Main navigation" className="fixed bottom-0 left-0 right-0 z-50 pb-safe" style={{
        background: 'rgba(8,13,8,0.97)',
        borderTop: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex justify-around items-center relative rounded-[24px] p-1.5" style={{ background: 'rgba(255,255,255,0.02)' }}>
            {/* Refined floating indicator - smoother animation */}
            <div 
              className="absolute h-12 rounded-[18px] transition-all duration-[300ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{
                background: 'linear-gradient(135deg, #16a34a 0%, rgba(22,163,74,0.8) 100%)',
                boxShadow: '0 4px 12px rgba(22,163,74,0.15), 0 0 0 1px rgba(22,163,74,0.1)',
                left: `${
                  currentTab === 'home' ? '1.5%' :
                  currentTab === 'rewards' ? '17.8%' :
                  currentTab === 'finance' ? '34.2%' :
                  currentTab === 'services' ? '50.5%' :
                  currentTab === 'activity' ? '66.8%' :
                  '83.2%'
                }`,
                width: '14.5%',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
            
            {/* Home - Nyumbani (Swahili-first) */}
            <button
              onClick={() => setCurrentTab('home')}
              aria-label="Home"
              aria-current={currentTab === 'home' ? 'page' : undefined}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 transition-all duration-[300ms] ease-out relative z-10 active:scale-[0.92]"
            >
              <HomeIcon className={`size-[22px] transition-all duration-[300ms] ${
                currentTab === 'home' 
                  ? 'text-white scale-100' 
                  : 'scale-90'
              }`} style={{ 
                stroke: currentTab === 'home' ? '#fff' : 'rgba(255,255,255,0.4)',
                strokeWidth: currentTab === 'home' ? '2.5' : '2'
              }} />
              <span className={`text-[9px] font-semibold tracking-wide transition-all duration-[300ms] mt-0.5 ${
                currentTab === 'home' 
                  ? 'text-white opacity-100' 
                  : 'opacity-50'
              }`} style={{ 
                color: currentTab === 'home' ? '#fff' : 'rgba(255,255,255,0.5)',
                letterSpacing: '0.02em'
              }}>
                Nyumbani
              </span>
            </button>

            {/* Rewards - Zawadi */}
            <button
              onClick={() => setCurrentTab('rewards')}
              aria-label="Rewards"
              aria-current={currentTab === 'rewards' ? 'page' : undefined}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 transition-all duration-[300ms] ease-out relative z-10 active:scale-[0.92]"
            >
              <RewardsIcon className={`size-[22px] transition-all duration-[300ms] ${
                currentTab === 'rewards' 
                  ? 'text-white scale-100' 
                  : 'scale-90'
              }`} style={{ 
                stroke: currentTab === 'rewards' ? '#fff' : 'rgba(255,255,255,0.4)',
                strokeWidth: currentTab === 'rewards' ? '2.5' : '2'
              }} />
              <span className={`text-[9px] font-semibold tracking-wide transition-all duration-[300ms] mt-0.5 ${
                currentTab === 'rewards' 
                  ? 'text-white opacity-100' 
                  : 'opacity-50'
              }`} style={{ 
                color: currentTab === 'rewards' ? '#fff' : 'rgba(255,255,255,0.5)',
                letterSpacing: '0.02em'
              }}>
                Zawadi
              </span>
            </button>

            {/* Finance - Fedha */}
            <button
              onClick={() => setCurrentTab('finance')}
              aria-label="Finance"
              aria-current={currentTab === 'finance' ? 'page' : undefined}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 transition-all duration-[300ms] ease-out relative z-10 active:scale-[0.92]"
            >
              <WalletIcon className={`size-[22px] transition-all duration-[300ms] ${
                currentTab === 'finance' 
                  ? 'text-white scale-100' 
                  : 'scale-90'
              }`} style={{ 
                stroke: currentTab === 'finance' ? '#fff' : 'rgba(255,255,255,0.4)',
                strokeWidth: currentTab === 'finance' ? '2.5' : '2'
              }} />
              <span className={`text-[9px] font-semibold tracking-wide transition-all duration-[300ms] mt-0.5 ${
                currentTab === 'finance' 
                  ? 'text-white opacity-100' 
                  : 'opacity-50'
              }`} style={{ 
                color: currentTab === 'finance' ? '#fff' : 'rgba(255,255,255,0.5)',
                letterSpacing: '0.02em'
              }}>
                Fedha
              </span>
            </button>

            {/* Services - Huduma */}
            <button
              onClick={() => setCurrentTab('services')}
              aria-label="Services"
              aria-current={currentTab === 'services' ? 'page' : undefined}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 transition-all duration-[300ms] ease-out relative z-10 active:scale-[0.92]"
            >
              <ChartIcon className={`size-[22px] transition-all duration-[300ms] ${
                currentTab === 'services' 
                  ? 'text-white scale-100' 
                  : 'scale-90'
              }`} style={{ 
                stroke: currentTab === 'services' ? '#fff' : 'rgba(255,255,255,0.4)',
                strokeWidth: currentTab === 'services' ? '2.5' : '2'
              }} />
              <span className={`text-[9px] font-semibold tracking-wide transition-all duration-[300ms] mt-0.5 ${
                currentTab === 'services' 
                  ? 'text-white opacity-100' 
                  : 'opacity-50'
              }`} style={{ 
                color: currentTab === 'services' ? '#fff' : 'rgba(255,255,255,0.5)',
                letterSpacing: '0.02em'
              }}>
                Huduma
              </span>
            </button>

            {/* Activity - Shughuli */}
            <button
              onClick={() => setCurrentTab('activity')}
              aria-label="Activity"
              aria-current={currentTab === 'activity' ? 'page' : undefined}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 transition-all duration-[300ms] ease-out relative z-10 active:scale-[0.92]"
            >
              <History className={`size-[22px] transition-all duration-[300ms] ${
                currentTab === 'activity' 
                  ? 'text-white fill-white scale-100' 
                  : 'scale-90'
              }`} style={{ 
                stroke: currentTab === 'activity' ? '#fff' : 'rgba(255,255,255,0.4)',
                strokeWidth: currentTab === 'activity' ? '2.5' : '2'
              }} />
              <span className={`text-[9px] font-semibold tracking-wide transition-all duration-[300ms] mt-0.5 ${
                currentTab === 'activity' 
                  ? 'text-white opacity-100' 
                  : 'opacity-50'
              }`} style={{ 
                color: currentTab === 'activity' ? '#fff' : 'rgba(255,255,255,0.5)',
                letterSpacing: '0.02em'
              }}>
                Shughuli
              </span>
            </button>

            {/* Profile - Wasifu */}
            <button
              onClick={() => setCurrentTab('profile')}
              aria-label="Profile"
              aria-current={currentTab === 'profile' ? 'page' : undefined}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 transition-all duration-[300ms] ease-out relative z-10 active:scale-[0.92]"
            >
              <UserIcon className={`size-[22px] transition-all duration-[300ms] ${
                currentTab === 'profile' 
                  ? 'text-white fill-white scale-100' 
                  : 'scale-90'
              }`} style={{ 
                stroke: currentTab === 'profile' ? '#fff' : 'rgba(255,255,255,0.4)',
                strokeWidth: currentTab === 'profile' ? '2.5' : '2'
              }} />
              <span className={`text-[9px] font-semibold tracking-wide transition-all duration-[300ms] mt-0.5 ${
                currentTab === 'profile' 
                  ? 'text-white opacity-100' 
                  : 'opacity-50'
              }`} style={{ 
                color: currentTab === 'profile' ? '#fff' : 'rgba(255,255,255,0.5)',
                letterSpacing: '0.02em'
              }}>
                Wasifu
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Support Chat - visible on home tab */}
    </div>
  );
}