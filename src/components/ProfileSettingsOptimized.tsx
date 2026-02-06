/**
 * PROFILE & SETTINGS - OPTIMIZED
 * 
 * Patterns from: Revolut, N26, PayPal, Grab
 * 
 * Features:
 * - User profile with KYC status
 * - Account limits
 * - Language selection
 * - Notification preferences
 * - Linked accounts (bank, mobile money)
 * - Theme settings (optional)
 * - Account management
 * - WCAG AA compliant
 */

import { useState } from 'react';
import {
  User,
  ChevronRight,
  Shield,
  CreditCard,
  Bell,
  Globe,
  Moon,
  LogOut,
  Camera,
  CheckCircle2,
  AlertCircle,
  Lock,
  Smartphone,
  DollarSign,
  Star,
  Award,
  Settings as SettingsIcon,
  Mail,
  Phone as PhoneIcon,
  MapPin,
  Calendar,
  Link as LinkIcon
} from 'lucide-react';
import {
  PageHeader,
  SectionHeader,
  Alert,
  ListItem,
  StatusBadge,
  BottomSheet
} from './design-system/SharedComponents';

interface LinkedAccount {
  id: string;
  type: 'bank' | 'mobile-money';
  provider: string;
  accountNumber: string;
  verified: boolean;
}

interface ProfileSettingsOptimizedProps {
  user: {
    name: string;
    phone: string;
    email?: string;
    kycStatus: 'verified' | 'pending' | 'not-started';
    membershipTier: string;
    profileImage?: string;
  };
  onBack: () => void;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
  formatCurrency: (amount: number) => string;
}

export function ProfileSettingsOptimized({ 
  user, 
  onBack, 
  onNavigate, 
  onLogout,
  formatCurrency 
}: ProfileSettingsOptimizedProps) {
  const [showLanguage, setShowLanguage] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('sw'); // sw = Swahili
  const [notificationPrefs, setNotificationPrefs] = useState({
    payments: true,
    bookings: true,
    rewards: true,
    marketing: false,
    security: true
  });

  // Account limits
  const limits = {
    daily: { used: 450000, total: 5000000 },
    monthly: { used: 2500000, total: 15000000 }
  };

  // Linked accounts
  const linkedAccounts: LinkedAccount[] = [
    {
      id: '1',
      type: 'bank',
      provider: 'CRDB Bank',
      accountNumber: '****1234',
      verified: true
    },
    {
      id: '2',
      type: 'mobile-money',
      provider: 'M-Pesa',
      accountNumber: '0754 *** 456',
      verified: true
    }
  ];

  // Languages
  const languages = [
    { code: 'sw', name: 'Kiswahili', flag: '🇹🇿' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Profile & Settings"
        swahiliTitle="Wasifu & Mipangilio"
        onBack={onBack}
      />

      <div className="p-5 space-y-6">
        {/* PROFILE HEADER */}
        <div className="bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex items-start gap-4 mb-6">
              {/* Profile Image */}
              <div className="relative">
                <div className="size-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <User className="size-10 text-white" />
                  )}
                </div>
                <button className="absolute -bottom-2 -right-2 size-8 bg-emerald-600 hover:bg-emerald-700 rounded-full flex items-center justify-center border-2 border-white shadow-lg transition-all">
                  <Camera className="size-4 text-white" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <p className="text-2xl font-black mb-1">{user.name}</p>
                <p className="text-sm text-emerald-100 font-medium mb-2">{user.phone}</p>
                <div className="flex items-center gap-2">
                  {user.kycStatus === 'verified' ? (
                    <div className="flex items-center gap-1 bg-green-100/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
                      <CheckCircle2 className="size-3 text-white" />
                      <span className="text-xs font-bold text-white">Verified</span>
                    </div>
                  ) : user.kycStatus === 'pending' ? (
                    <div className="flex items-center gap-1 bg-amber-100/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
                      <AlertCircle className="size-3 text-white" />
                      <span className="text-xs font-bold text-white">Pending</span>
                    </div>
                  ) : (
                    <button 
                      onClick={() => onNavigate('kyc')}
                      className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30 hover:bg-white/30 transition-all"
                    >
                      <span className="text-xs font-bold text-white">Verify Account</span>
                    </button>
                  )}
                  
                  <div className="flex items-center gap-1 bg-amber-100/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
                    <Star className="size-3 text-white fill-white" />
                    <span className="text-xs font-bold text-white">{user.membershipTier}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/20">
                <p className="text-xs text-emerald-100 font-semibold mb-1">GoPoints</p>
                <p className="text-xl font-black">2,450</p>
              </div>
              <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/20">
                <p className="text-xs text-emerald-100 font-semibold mb-1">Transactions</p>
                <p className="text-xl font-black">347</p>
              </div>
            </div>
          </div>
        </div>

        {/* KYC WARNING */}
        {user.kycStatus !== 'verified' && (
          <Alert
            type="warning"
            title="Complete KYC Verification"
            message="Verify your account to unlock higher limits and full features"
            action={{
              label: 'Verify Now',
              onClick: () => onNavigate('kyc')
            }}
          />
        )}

        {/* ACCOUNT LIMITS */}
        <div>
          <SectionHeader
            title="Vikomo vya Akaunti"
            subtitle="Account limits"
          />

          <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 space-y-4">
            {/* Daily Limit */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-bold text-gray-900">Daily Limit</p>
                <p className="text-sm font-bold text-gray-900">
                  {formatCurrency(limits.daily.used)} / {formatCurrency(limits.daily.total)}
                </p>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all"
                  style={{ width: `${(limits.daily.used / limits.daily.total) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 font-medium mt-1">
                {formatCurrency(limits.daily.total - limits.daily.used)} remaining today
              </p>
            </div>

            {/* Monthly Limit */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-bold text-gray-900">Monthly Limit</p>
                <p className="text-sm font-bold text-gray-900">
                  {formatCurrency(limits.monthly.used)} / {formatCurrency(limits.monthly.total)}
                </p>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full transition-all"
                  style={{ width: `${(limits.monthly.used / limits.monthly.total) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 font-medium mt-1">
                {formatCurrency(limits.monthly.total - limits.monthly.used)} remaining this month
              </p>
            </div>

            <button
              onClick={() => onNavigate('increase-limits')}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
            >
              <Award className="size-4" />
              Increase Limits
            </button>
          </div>
        </div>

        {/* PERSONAL INFORMATION */}
        <div>
          <SectionHeader
            title="Taarifa Binafsi"
            subtitle="Personal information"
          />

          <div className="space-y-3">
            <ListItem
              icon={<PhoneIcon className="size-6 text-white" />}
              iconGradient="from-blue-500 to-cyan-600"
              title="Phone Number"
              subtitle={user.phone}
              onClick={() => {}}
            />

            {user.email && (
              <ListItem
                icon={<Mail className="size-6 text-white" />}
                iconGradient="from-purple-500 to-pink-600"
                title="Email Address"
                subtitle={user.email}
                onClick={() => {}}
              />
            )}

            <ListItem
              icon={<MapPin className="size-6 text-white" />}
              iconGradient="from-orange-500 to-red-600"
              title="Address"
              subtitle="Not set • Tap to add"
              onClick={() => {}}
            />

            <ListItem
              icon={<Calendar className="size-6 text-white" />}
              iconGradient="from-green-500 to-emerald-600"
              title="Date of Birth"
              subtitle="Not set • Tap to add"
              onClick={() => {}}
            />
          </div>
        </div>

        {/* LINKED ACCOUNTS */}
        <div>
          <SectionHeader
            title="Akaunti Zilizounganishwa"
            subtitle="Linked accounts"
            action={{
              label: 'Add New',
              onClick: () => onNavigate('link-account')
            }}
          />

          <div className="space-y-3">
            {linkedAccounts.map(account => (
              <ListItem
                key={account.id}
                icon={
                  account.type === 'bank' ? (
                    <CreditCard className="size-6 text-white" />
                  ) : (
                    <Smartphone className="size-6 text-white" />
                  )
                }
                iconGradient={
                  account.type === 'bank' 
                    ? 'from-blue-500 to-cyan-600' 
                    : 'from-green-500 to-emerald-600'
                }
                title={account.provider}
                subtitle={account.accountNumber}
                badge={
                  account.verified && (
                    <div className="flex items-center gap-1">
                      <Shield className="size-3 text-green-600" />
                    </div>
                  )
                }
                onClick={() => {}}
              />
            ))}
          </div>
        </div>

        {/* PREFERENCES */}
        <div>
          <SectionHeader
            title="Mapendeleo • Preferences"
            subtitle="App settings"
          />

          <div className="space-y-3">
            {/* Language */}
            <button
              onClick={() => setShowLanguage(true)}
              className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <div className="size-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                  <Globe className="size-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900 mb-0.5">Language • Lugha</p>
                  <p className="text-xs text-gray-700 font-medium">
                    {languages.find(l => l.code === selectedLanguage)?.name}
                  </p>
                </div>
                <ChevronRight className="size-5 text-gray-600" />
              </div>
            </button>

            {/* Notifications */}
            <button
              onClick={() => setShowNotifications(true)}
              className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <div className="size-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-md">
                  <Bell className="size-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900 mb-0.5">Notifications • Arifa</p>
                  <p className="text-xs text-gray-700 font-medium">Manage alert preferences</p>
                </div>
                <ChevronRight className="size-5 text-gray-600" />
              </div>
            </button>

            {/* Security */}
            <ListItem
              icon={<Lock className="size-6 text-white" />}
              iconGradient="from-red-500 to-orange-600"
              title="Security & Privacy"
              subtitle="PIN, biometric, devices"
              onClick={() => onNavigate('security')}
            />
          </div>
        </div>

        {/* SUPPORT & ABOUT */}
        <div>
          <SectionHeader
            title="Msaada & Kuhusu"
            subtitle="Help & about"
          />

          <div className="space-y-3">
            <ListItem
              icon={<SettingsIcon className="size-6 text-white" />}
              iconGradient="from-gray-500 to-gray-600"
              title="Help Center"
              subtitle="FAQs, contact support"
              onClick={() => onNavigate('support')}
            />

            <ListItem
              icon={<Shield className="size-6 text-white" />}
              iconGradient="from-blue-500 to-cyan-600"
              title="Terms & Privacy"
              subtitle="Legal information"
              onClick={() => {}}
            />

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
              <div className="flex items-center gap-4">
                <div className="size-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                  <SettingsIcon className="size-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900 mb-0.5">App Version</p>
                  <p className="text-xs text-gray-700 font-medium">v2.1.0 (Build 247)</p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">
                  Latest
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* LOGOUT */}
        <button
          onClick={onLogout}
          className="w-full bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-4 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-4 justify-center">
            <LogOut className="size-6 text-red-600" />
            <p className="text-base font-bold text-red-700">Toka • Log Out</p>
          </div>
        </button>
      </div>

      {/* LANGUAGE SELECTOR BOTTOM SHEET */}
      <BottomSheet
        isOpen={showLanguage}
        onClose={() => setShowLanguage(false)}
        title="Chagua Lugha • Select Language"
      >
        <div className="space-y-3">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => {
                setSelectedLanguage(lang.code);
                setShowLanguage(false);
              }}
              className={`w-full border-2 rounded-2xl p-4 transition-all text-left ${
                selectedLanguage === lang.code
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{lang.flag}</span>
                <div className="flex-1">
                  <p className="text-base font-bold text-gray-900">{lang.name}</p>
                </div>
                {selectedLanguage === lang.code && (
                  <CheckCircle2 className="size-6 text-emerald-600" />
                )}
              </div>
            </button>
          ))}
        </div>
      </BottomSheet>

      {/* NOTIFICATION PREFERENCES BOTTOM SHEET */}
      <BottomSheet
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        title="Notification Settings"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-700 font-medium">Choose which notifications you want to receive</p>

          {Object.entries(notificationPrefs).map(([key, value]) => (
            <div key={key} className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-0.5 capitalize">{key}</p>
                  <p className="text-xs text-gray-700">
                    {key === 'payments' && 'Transaction confirmations'}
                    {key === 'bookings' && 'Travel booking updates'}
                    {key === 'rewards' && 'Points & rewards alerts'}
                    {key === 'marketing' && 'Offers & promotions'}
                    {key === 'security' && 'Security & login alerts'}
                  </p>
                </div>
                <button
                  onClick={() => setNotificationPrefs(prev => ({ ...prev, [key]: !value }))}
                  className={`w-12 h-7 rounded-full transition-all ${
                    value ? 'bg-emerald-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`size-5 bg-white rounded-full transition-all shadow-md ${
                    value ? 'ml-6' : 'ml-1'
                  }`}></div>
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={() => setShowNotifications(false)}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-xl text-sm font-bold transition-all"
          >
            Save Preferences
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}
