/**
 * PROFILE & SETTINGS - WORLD-CLASS (DESIGN MATURITY)
 * 
 * JOURNEY QUESTION: "How do I control my account?"
 * 
 * HIERARCHY:
 * 1. Hero: User identity (dark gradient, minimal)
 * 2. Supporting: Settings groups (organized by priority)
 * 3. Quiet: Everything else
 * 
 * PRINCIPLES APPLIED:
 * ✅ ONE gradient (profile card only)
 * ✅ Boring is good (PayPal/Revolut-style settings)
 * ✅ Trust through organization (not through badges)
 * ✅ Security-first hierarchy (Account → Security → Preferences)
 * ✅ No hype ("Secure!" badges removed)
 * 
 * INSPIRED BY:
 * - Apple Settings: Clear hierarchy
 * - Revolut: Minimal, organized
 * - PayPal: Boring = trustworthy
 * 
 * @version 5.0.0 (World-Class Maturity)
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
  CreditCard,
  FileText,
  HelpCircle,
  LogOut,
  ChevronRight,
  Fingerprint,
  Smartphone,
  Phone,
  Mail
} from 'lucide-react';

interface ProfileWorldClassProps {
  user: {
    name: string;
    email: string;
    phone: string;
  };
  onBack: () => void;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  language?: 'sw' | 'en';
}

// ════════════════════════════════════════════════════════════
// OUTCOME-FOCUSED COPY
// ════════════════════════════════════════════════════════════

const COPY = {
  title: { sw: 'Mipangilio', en: 'Settings' },
  verified: { sw: 'Imethibitishwa', en: 'Verified' },
  
  // Sections (priority order)
  sections: {
    account: { sw: 'Akaunti', en: 'Account' },
    security: { sw: 'Usalama', en: 'Security' },
    preferences: { sw: 'Mapendekezo', en: 'Preferences' },
    help: { sw: 'Msaada', en: 'Help' }
  },
  
  // Account
  account: {
    personal: { sw: 'Maelezo Binafsi', en: 'Personal Info' },
    payment: { sw: 'Njia za Malipo', en: 'Payment Methods' },
    linked: { sw: 'Akaunti Zilizounganishwa', en: 'Linked Accounts' }
  },
  
  // Security
  security: {
    pin: { sw: 'Badilisha PIN', en: 'Change PIN' },
    biometric: { sw: 'Kidole/Uso', en: 'Biometric' },
    twoFactor: { sw: 'Usalama wa Hatua 2', en: 'Two-Factor Auth' },
    devices: { sw: 'Vifaa', en: 'Devices' }
  },
  
  // Preferences
  preferences: {
    language: { sw: 'Lugha', en: 'Language' },
    notifications: { sw: 'Arifa', en: 'Notifications' }
  },
  
  // Help
  help: {
    faq: { sw: 'Maswali', en: 'FAQ' },
    contact: { sw: 'Wasiliana', en: 'Contact' },
    terms: { sw: 'Masharti', en: 'Terms' },
    privacy: { sw: 'Faragha', en: 'Privacy' }
  },
  
  logout: { sw: 'Toka', en: 'Logout' },
  version: { sw: 'Toleo', en: 'Version' }
};

// ════════════════════════════════════════════════════════════
// MOTION (CALM)
// ════════════════════════════════════════════════════════════

const MOTION = {
  fadeIn: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
  }
};

// ════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════

export function ProfileWorldClass({
  user,
  onBack,
  onNavigate,
  onLogout,
  language = 'sw'
}: ProfileWorldClassProps) {
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const getText = (obj: { sw: string; en: string }) => obj[language];
  
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      
      {/* ════════════════════════════════════════════════════════════
          HEADER (MINIMAL)
      ════════════════════════════════════════════════════════════ */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-xl font-black text-gray-900">
          {getText(COPY.title)}
        </h1>
      </div>
      
      {/* ════════════════════════════════════════════════════════════
          HERO: USER IDENTITY (ONLY GRADIENT, DARK, MINIMAL)
      ════════════════════════════════════════════════════════════ */}
      <div className="px-6 py-6">
        <motion.div
          {...MOTION.fadeIn}
          className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-6 text-white shadow-xl"
        >
          {/* Profile Photo (minimal) */}
          <div className="flex items-start justify-between mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-900 text-2xl font-black">
              {user.name.charAt(0).toUpperCase()}
            </div>
            
            {/* Verified badge (quiet, not flashy) */}
            <div className="bg-white/10 px-3 py-1 rounded-lg">
              <span className="text-xs font-bold">{getText(COPY.verified)}</span>
            </div>
          </div>
          
          {/* User Info */}
          <div className="mb-4">
            <h2 className="text-2xl font-black mb-1">{user.name}</h2>
          </div>
          
          {/* Contact (quiet) */}
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{user.phone}</span>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* ════════════════════════════════════════════════════════════
          SUPPORTING: SETTINGS (ORGANIZED BY PRIORITY)
      ════════════════════════════════════════════════════════════ */}
      
      {/* Account Section */}
      <div className="px-6 mb-6">
        <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">
          {getText(COPY.sections.account)}
        </h3>
        
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <SettingsItem
            icon={User}
            title={getText(COPY.account.personal)}
            subtitle={user.email}
            onClick={() => onNavigate('personal-info')}
          />
          <Divider />
          <SettingsItem
            icon={CreditCard}
            title={getText(COPY.account.payment)}
            subtitle={language === 'sw' ? '2 kadi, 1 benki' : '2 cards, 1 bank'}
            onClick={() => onNavigate('payment-methods')}
          />
          <Divider />
          <SettingsItem
            icon={Globe}
            title={getText(COPY.account.linked)}
            subtitle="M-Pesa, Tigo Pesa"
            onClick={() => onNavigate('linked-accounts')}
          />
        </div>
      </div>
      
      {/* Security Section */}
      <div className="px-6 mb-6">
        <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">
          {getText(COPY.sections.security)}
        </h3>
        
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <SettingsItem
            icon={Lock}
            title={getText(COPY.security.pin)}
            onClick={() => onNavigate('change-pin')}
          />
          <Divider />
          <SettingsItem
            icon={Fingerprint}
            title={getText(COPY.security.biometric)}
            toggle={{
              enabled: biometricEnabled,
              onToggle: () => setBiometricEnabled(!biometricEnabled)
            }}
          />
          <Divider />
          <SettingsItem
            icon={Shield}
            title={getText(COPY.security.twoFactor)}
            onClick={() => onNavigate('two-factor')}
          />
          <Divider />
          <SettingsItem
            icon={Smartphone}
            title={getText(COPY.security.devices)}
            subtitle={language === 'sw' ? '1 kifaa kilichounganishwa' : '1 device connected'}
            onClick={() => onNavigate('devices')}
          />
        </div>
      </div>
      
      {/* Preferences Section */}
      <div className="px-6 mb-6">
        <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">
          {getText(COPY.sections.preferences)}
        </h3>
        
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <SettingsItem
            icon={Globe}
            title={getText(COPY.preferences.language)}
            subtitle={language === 'sw' ? 'Kiswahili' : 'English'}
            onClick={() => onNavigate('language')}
          />
          <Divider />
          <SettingsItem
            icon={Bell}
            title={getText(COPY.preferences.notifications)}
            toggle={{
              enabled: notificationsEnabled,
              onToggle: () => setNotificationsEnabled(!notificationsEnabled)
            }}
          />
        </div>
      </div>
      
      {/* Help Section */}
      <div className="px-6 mb-6">
        <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">
          {getText(COPY.sections.help)}
        </h3>
        
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <SettingsItem
            icon={HelpCircle}
            title={getText(COPY.help.faq)}
            onClick={() => onNavigate('faq')}
          />
          <Divider />
          <SettingsItem
            icon={Mail}
            title={getText(COPY.help.contact)}
            onClick={() => onNavigate('contact')}
          />
          <Divider />
          <SettingsItem
            icon={FileText}
            title={getText(COPY.help.terms)}
            onClick={() => onNavigate('terms')}
          />
          <Divider />
          <SettingsItem
            icon={Shield}
            title={getText(COPY.help.privacy)}
            onClick={() => onNavigate('privacy')}
          />
        </div>
      </div>
      
      {/* ════════════════════════════════════════════════════════════
          LOGOUT (QUIET, NOT ALARMING)
      ════════════════════════════════════════════════════════════ */}
      <div className="px-6 mb-6">
        <button
          onClick={onLogout}
          className="w-full bg-white border-2 border-gray-300 text-gray-700 py-4 rounded-2xl font-bold hover:border-gray-400 hover:bg-gray-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          {getText(COPY.logout)}
        </button>
      </div>
      
      {/* Version (quiet) */}
      <div className="px-6 pb-6 text-center">
        <p className="text-xs text-gray-500">
          {getText(COPY.version)} 5.0.0
        </p>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// SETTINGS ITEM (MINIMAL, APPLE-STYLE)
// ════════════════════════════════════════════════════════════

interface SettingsItemProps {
  icon: any;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  toggle?: {
    enabled: boolean;
    onToggle: () => void;
  };
}

function SettingsItem({ icon: Icon, title, subtitle, onClick, toggle }: SettingsItemProps) {
  const Component = onClick ? 'button' : 'div';
  
  return (
    <Component
      onClick={onClick}
      className={`
        w-full flex items-center justify-between p-4 text-left
        ${onClick ? 'hover:bg-gray-50 active:bg-gray-100 transition-colors' : ''}
      `}
    >
      <div className="flex items-center gap-3 flex-1">
        <Icon className="w-5 h-5 text-gray-600" />
        <div className="flex-1">
          <p className="font-bold text-gray-900">{title}</p>
          {subtitle && (
            <p className="text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
      </div>
      
      {toggle ? (
        <Toggle enabled={toggle.enabled} onToggle={toggle.onToggle} />
      ) : onClick ? (
        <ChevronRight className="w-5 h-5 text-gray-400" />
      ) : null}
    </Component>
  );
}

// ════════════════════════════════════════════════════════════
// TOGGLE (MINIMAL, IOS-STYLE)
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
        w-12 h-7 rounded-full flex items-center transition-colors
        ${enabled ? 'bg-gray-900' : 'bg-gray-300'}
      `}
    >
      <motion.div
        layout
        className="w-5 h-5 bg-white rounded-full shadow-lg"
        animate={{ x: enabled ? 26 : 4 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      />
    </button>
  );
}

// ════════════════════════════════════════════════════════════
// DIVIDER
// ════════════════════════════════════════════════════════════

function Divider() {
  return <div className="h-px bg-gray-100 mx-4" />;
}

/**
 * ════════════════════════════════════════════════════════════
 * WORLD-CLASS CHANGES:
 * ════════════════════════════════════════════════════════════
 * 
 * ❌ REMOVED:
 * - Multiple gradients (colored sections)
 * - Colored icons (too busy)
 * - "Secure! Encrypted!" badges
 * - Flashy profile editing UI
 * - Gamified tier display
 * - Camera icon on profile (not needed immediately)
 * 
 * ✅ IMPROVED:
 * - ONE dark gradient (profile card only)
 * - Monochrome icons (calm, professional)
 * - Trust through organization (clear hierarchy)
 * - Boring is good (Apple Settings style)
 * - Security-first order (Account → Security → Preferences)
 * - Minimal verified badge (not flashy)
 * - Gray logout button (not alarming red)
 * 
 * HIERARCHY:
 * 1. Hero: User identity (dark gradient, minimal)
 * 2. Supporting: Settings groups (priority order)
 * 3. Quiet: Help, version
 * 
 * QUESTION ANSWERED:
 * "How do I control my account?"
 * → Clear organization, predictable structure
 * 
 * TRUST MECHANISM:
 * Not through "Secure!" badges.
 * Through organization: "I know where everything is."
 * 
 * INSPIRATION:
 * - Apple Settings: Boring = trustworthy
 * - Revolut: Minimal, organized
 * - PayPal: No color = professional
 */
