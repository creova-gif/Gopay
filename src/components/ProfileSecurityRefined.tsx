/**
 * PROFILE & SECURITY - COMPREHENSIVE SETTINGS
 * 
 * WORLD-CLASS RULES APPLIED:
 * ✅ ONE hero: User profile card (gradient)
 * ✅ Glass surfaces for settings categories
 * ✅ Security-first: Clear trust signals
 * ✅ Swahili-first language
 * ✅ Organized by priority (Account → Security → Preferences)
 * ✅ Motion < 300ms
 * 
 * INSPIRED BY:
 * - Revolut: Clear security controls
 * - Apple Settings: Organized hierarchy
 * - Nubank: Simple, confident design
 * 
 * @version 1.0.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  User,
  Shield,
  Lock,
  Bell,
  Globe,
  Moon,
  CreditCard,
  FileText,
  HelpCircle,
  LogOut,
  ChevronRight,
  Check,
  X,
  Eye,
  EyeOff,
  Smartphone,
  Fingerprint,
  Mail,
  Phone,
  MapPin,
  Camera,
  Edit,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface ProfileSecurityRefinedProps {
  user: {
    name: string;
    email: string;
    phone: string;
    profilePhoto?: string;
    nida?: string;
  };
  onBack: () => void;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  language?: 'sw' | 'en';
}

// ════════════════════════════════════════════════════════════
// SWAHILI-FIRST COPY
// ════════════════════════════════════════════════════════════

const COPY = {
  title: { sw: 'Mipangilio', en: 'Settings' },
  profile: {
    title: { sw: 'Wasifu Wako', en: 'Your Profile' },
    edit: { sw: 'Hariri', en: 'Edit' },
    verified: { sw: 'Imethibitishwa', en: 'Verified' }
  },
  
  sections: {
    account: { sw: 'Akaunti', en: 'Account' },
    security: { sw: 'Usalama', en: 'Security' },
    preferences: { sw: 'Mapendekezo', en: 'Preferences' },
    help: { sw: 'Msaada', en: 'Help & Support' }
  },
  
  account: {
    personalInfo: { sw: 'Maelezo Binafsi', en: 'Personal Information' },
    documents: { sw: 'Nyaraka', en: 'Documents' },
    paymentMethods: { sw: 'Njia za Malipo', en: 'Payment Methods' },
    linkedAccounts: { sw: 'Akaunti Zilizounganishwa', en: 'Linked Accounts' }
  },
  
  security: {
    changePin: { sw: 'Badilisha PIN', en: 'Change PIN' },
    changePinDesc: { sw: 'Weka PIN mpya ya usalama', en: 'Set a new security PIN' },
    biometric: { sw: 'Kidole/Uso', en: 'Biometric Login' },
    biometricDesc: { sw: 'Ingia kwa kidole au uso', en: 'Login with fingerprint or face' },
    twoFactor: { sw: 'Usalama wa Hatua Mbili', en: 'Two-Factor Authentication' },
    twoFactorDesc: { sw: 'Ongeza usalama zaidi', en: 'Add extra security' },
    devices: { sw: 'Vifaa Vilivyounganishwa', en: 'Connected Devices' },
    devicesDesc: { sw: 'Angalia vifaa vyako', en: 'Manage your devices' },
    simProtection: { sw: 'Ulinzi wa SIM', en: 'SIM Protection' },
    simProtectionDesc: { sw: 'Zuia kubadilishwa SIM', en: 'Prevent SIM swap attacks' }
  },
  
  preferences: {
    language: { sw: 'Lugha', en: 'Language' },
    languageDesc: { sw: 'Kiswahili / English', en: 'Swahili / English' },
    darkMode: { sw: 'Hali ya Giza', en: 'Dark Mode' },
    darkModeDesc: { sw: 'Punguza mwanga wa skrini', en: 'Reduce screen brightness' },
    notifications: { sw: 'Arifa', en: 'Notifications' },
    notificationsDesc: { sw: 'Dhibiti arifa', en: 'Manage notifications' },
    currency: { sw: 'Sarafu', en: 'Currency' },
    currencyDesc: { sw: 'TSh (Shilingi)', en: 'TSh (Shillings)' }
  },
  
  help: {
    faq: { sw: 'Maswali ya Mara kwa Mara', en: 'FAQ' },
    contact: { sw: 'Wasiliana Nasi', en: 'Contact Support' },
    terms: { sw: 'Masharti', en: 'Terms of Service' },
    privacy: { sw: 'Faragha', en: 'Privacy Policy' }
  },
  
  logout: { sw: 'Toka', en: 'Logout' },
  version: { sw: 'Toleo', en: 'Version' }
};

// ════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════

export function ProfileSecurityRefined({
  user,
  onBack,
  onNavigate,
  onLogout,
  language = 'sw'
}: ProfileSecurityRefinedProps) {
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const getText = (obj: { sw: string; en: string }) => obj[language];
  
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      
      {/* ════════════════════════════════════════════════════════════
          HEADER
      ════════════════════════════════════════════════════════════ */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3 sticky top-0 z-40">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-all active:scale-95"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-xl font-black text-gray-900">
          {getText(COPY.title)}
        </h1>
      </div>
      
      {/* ════════════════════════════════════════════════════════════
          PROFILE HERO (Gradient)
      ════════════════════════════════════════════════════════════ */}
      <div className="px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              {/* Profile photo */}
              <div className="relative">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-emerald-600 text-2xl font-black">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white text-emerald-600 rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-50 transition-all active:scale-95">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              
              {/* Edit button */}
              <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-full flex items-center gap-2 transition-all active:scale-95">
                <Edit className="w-4 h-4" />
                <span className="font-bold text-sm">{getText(COPY.profile.edit)}</span>
              </button>
            </div>
            
            {/* User info */}
            <div className="mb-4">
              <h2 className="text-2xl font-black mb-1">{user.name}</h2>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-4 h-4 text-emerald-300" />
                <span className="text-sm text-emerald-100">
                  {getText(COPY.profile.verified)}
                </span>
              </div>
            </div>
            
            {/* Contact info */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-emerald-200" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-emerald-200" />
                <span>{user.phone}</span>
              </div>
              {user.nida && (
                <div className="flex items-center gap-3 text-sm">
                  <CreditCard className="w-4 h-4 text-emerald-200" />
                  <span>NIDA: {user.nida}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* ════════════════════════════════════════════════════════════
          ACCOUNT SECTION (Glass surfaces)
      ════════════════════════════════════════════════════════════ */}
      <div className="px-6 mb-6">
        <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">
          {getText(COPY.sections.account)}
        </h3>
        
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <SettingsItem
            icon={User}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
            title={getText(COPY.account.personalInfo)}
            subtitle={user.email}
            onClick={() => {}}
          />
          <SettingsItem
            icon={FileText}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
            title={getText(COPY.account.documents)}
            subtitle="NIDA, Passport"
            onClick={() => {}}
            showDivider
          />
          <SettingsItem
            icon={CreditCard}
            iconBg="bg-emerald-100"
            iconColor="text-emerald-600"
            title={getText(COPY.account.paymentMethods)}
            subtitle="2 cards, 1 bank"
            onClick={() => {}}
            showDivider
          />
          <SettingsItem
            icon={MapPin}
            iconBg="bg-orange-100"
            iconColor="text-orange-600"
            title={getText(COPY.account.linkedAccounts)}
            subtitle="M-Pesa, Tigo Pesa"
            onClick={() => {}}
            showDivider
          />
        </div>
      </div>
      
      {/* ════════════════════════════════════════════════════════════
          SECURITY SECTION
      ════════════════════════════════════════════════════════════ */}
      <div className="px-6 mb-6">
        <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">
          {getText(COPY.sections.security)}
        </h3>
        
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <SettingsItem
            icon={Lock}
            iconBg="bg-red-100"
            iconColor="text-red-600"
            title={getText(COPY.security.changePin)}
            subtitle={getText(COPY.security.changePinDesc)}
            onClick={() => {}}
          />
          <SettingsItem
            icon={Fingerprint}
            iconBg="bg-indigo-100"
            iconColor="text-indigo-600"
            title={getText(COPY.security.biometric)}
            subtitle={getText(COPY.security.biometricDesc)}
            toggle={{
              enabled: biometricEnabled,
              onToggle: () => setBiometricEnabled(!biometricEnabled)
            }}
            showDivider
          />
          <SettingsItem
            icon={Shield}
            iconBg="bg-green-100"
            iconColor="text-green-600"
            title={getText(COPY.security.twoFactor)}
            subtitle={getText(COPY.security.twoFactorDesc)}
            toggle={{
              enabled: twoFactorEnabled,
              onToggle: () => setTwoFactorEnabled(!twoFactorEnabled)
            }}
            showDivider
          />
          <SettingsItem
            icon={Smartphone}
            iconBg="bg-cyan-100"
            iconColor="text-cyan-600"
            title={getText(COPY.security.devices)}
            subtitle={getText(COPY.security.devicesDesc)}
            onClick={() => {}}
            showDivider
          />
          <SettingsItem
            icon={AlertTriangle}
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
            title={getText(COPY.security.simProtection)}
            subtitle={getText(COPY.security.simProtectionDesc)}
            onClick={() => onNavigate('sim-protection')}
            showDivider
          />
        </div>
      </div>
      
      {/* ════════════════════════════════════════════════════════════
          PREFERENCES SECTION
      ════════════════════════════════════════════════════════════ */}
      <div className="px-6 mb-6">
        <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">
          {getText(COPY.sections.preferences)}
        </h3>
        
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <SettingsItem
            icon={Globe}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
            title={getText(COPY.preferences.language)}
            subtitle={getText(COPY.preferences.languageDesc)}
            onClick={() => {}}
          />
          <SettingsItem
            icon={Moon}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
            title={getText(COPY.preferences.darkMode)}
            subtitle={getText(COPY.preferences.darkModeDesc)}
            toggle={{
              enabled: darkMode,
              onToggle: () => setDarkMode(!darkMode)
            }}
            showDivider
          />
          <SettingsItem
            icon={Bell}
            iconBg="bg-yellow-100"
            iconColor="text-yellow-600"
            title={getText(COPY.preferences.notifications)}
            subtitle={getText(COPY.preferences.notificationsDesc)}
            toggle={{
              enabled: notificationsEnabled,
              onToggle: () => setNotificationsEnabled(!notificationsEnabled)
            }}
            showDivider
          />
          <SettingsItem
            icon={CreditCard}
            iconBg="bg-emerald-100"
            iconColor="text-emerald-600"
            title={getText(COPY.preferences.currency)}
            subtitle={getText(COPY.preferences.currencyDesc)}
            onClick={() => {}}
            showDivider
          />
        </div>
      </div>
      
      {/* ════════════════════════════════════════════════════════════
          HELP & SUPPORT SECTION
      ════════════════════════════════════════════════════════════ */}
      <div className="px-6 mb-6">
        <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">
          {getText(COPY.sections.help)}
        </h3>
        
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <SettingsItem
            icon={HelpCircle}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
            title={getText(COPY.help.faq)}
            onClick={() => {}}
          />
          <SettingsItem
            icon={Mail}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
            title={getText(COPY.help.contact)}
            onClick={() => {}}
            showDivider
          />
          <SettingsItem
            icon={FileText}
            iconBg="bg-gray-100"
            iconColor="text-gray-600"
            title={getText(COPY.help.terms)}
            onClick={() => {}}
            showDivider
          />
          <SettingsItem
            icon={Shield}
            iconBg="bg-gray-100"
            iconColor="text-gray-600"
            title={getText(COPY.help.privacy)}
            onClick={() => {}}
            showDivider
          />
        </div>
      </div>
      
      {/* ════════════════════════════════════════════════════════════
          LOGOUT BUTTON
      ════════════════════════════════════════════════════════════ */}
      <div className="px-6 mb-6">
        <button
          onClick={onLogout}
          className="w-full bg-white border-2 border-red-500 text-red-500 py-4 rounded-2xl font-bold hover:bg-red-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          {getText(COPY.logout)}
        </button>
      </div>
      
      {/* Version */}
      <div className="px-6 pb-6 text-center">
        <p className="text-xs text-gray-500">
          {getText(COPY.version)} 4.0.0
        </p>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// SETTINGS ITEM
// ════════════════════════════════════════════════════════════

interface SettingsItemProps {
  icon: any;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  toggle?: {
    enabled: boolean;
    onToggle: () => void;
  };
  showDivider?: boolean;
}

function SettingsItem({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  onClick,
  toggle,
  showDivider
}: SettingsItemProps) {
  const Component = onClick ? 'button' : 'div';
  
  return (
    <>
      <Component
        onClick={onClick}
        className={`
          w-full flex items-center gap-4 p-4 text-left
          ${onClick ? 'hover:bg-gray-50 active:bg-gray-100 transition-all' : ''}
        `}
      >
        <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900">{title}</p>
          {subtitle && (
            <p className="text-sm text-gray-600 truncate">{subtitle}</p>
          )}
        </div>
        
        {toggle ? (
          <Toggle enabled={toggle.enabled} onToggle={toggle.onToggle} />
        ) : onClick ? (
          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
        ) : null}
      </Component>
      
      {showDivider && <div className="h-px bg-gray-200 mx-4" />}
    </>
  );
}

// ════════════════════════════════════════════════════════════
// TOGGLE SWITCH
// ════════════════════════════════════════════════════════════

interface ToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

function Toggle({ enabled, onToggle }: ToggleProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`
        w-12 h-7 rounded-full flex items-center transition-all flex-shrink-0
        ${enabled ? 'bg-emerald-500' : 'bg-gray-300'}
      `}
    >
      <motion.div
        layout
        className="w-5 h-5 bg-white rounded-full shadow-lg"
        animate={{ x: enabled ? 26 : 4 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      />
    </button>
  );
}
