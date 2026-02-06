/**
 * DASHBOARD INTEGRATION EXAMPLE
 * 
 * This is a complete working example showing how to integrate
 * all optimized components into your Dashboard.
 * 
 * Copy this pattern into your existing Dashboard.tsx
 */

import { useState, useEffect } from 'react';
import { User } from '../App';

// Import ALL optimized components
import { RewardsScreenOptimized } from './RewardsScreenOptimized';
import { FinanceScreenOptimized } from './FinanceScreenOptimized';
import { TransactionHistoryOptimized } from './TransactionHistoryOptimized';
import { NotificationsCenterOptimized } from './NotificationsCenterOptimized';
import { MerchantQRPaymentOptimized } from './MerchantQRPaymentOptimized';
import { SupportCenterOptimized } from './SupportCenterOptimized';
import { SecuritySettingsOptimized } from './SecuritySettingsOptimized';
import { ProfileSettingsOptimized } from './ProfileSettingsOptimized';

// Import error states
import { OfflineState, ServerError } from './ErrorStateComponents';

// Import icons (use your existing icon system)
import {
  Bell,
  User as UserIcon,
  Home,
  Gift,
  Wallet,
  Grid3x3,
  Clock,
  Settings
} from 'lucide-react';

interface DashboardIntegrationExampleProps {
  user: User;
  accessToken: string;
  onLogout: () => void;
}

export function DashboardIntegrationExample({ 
  user, 
  accessToken, 
  onLogout 
}: DashboardIntegrationExampleProps) {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  
  // Navigation state - EXPANDED for all new pages
  const [currentPage, setCurrentPage] = useState<
    'home' | 
    'rewards' | 
    'finance' | 
    'services' | 
    'activity' | 
    'profile' |
    'transaction-history' |
    'notifications' |
    'merchant-qr' |
    'support' |
    'security'
  >('home');

  // Existing states
  const [balance, setBalance] = useState({ balance: 450000, currency: 'TZS' });
  const [isOffline, setIsOffline] = useState(false);
  const [hasError, setHasError] = useState(false);

  // ==========================================
  // EFFECTS
  // ==========================================
  
  // Detect online/offline
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check initial state
    if (!navigator.onLine) {
      setIsOffline(true);
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // ==========================================
  // HELPER FUNCTIONS
  // ==========================================
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleNavigate = (screen: string) => {
    setCurrentPage(screen as any);
  };

  // ==========================================
  // RENDER
  // ==========================================
  
  // Show offline state first
  if (isOffline) {
    return (
      <OfflineState
        onRetry={() => {
          setIsOffline(false);
          window.location.reload();
        }}
        onGoHome={() => setCurrentPage('home')}
      />
    );
  }

  // Show server error
  if (hasError) {
    return (
      <ServerError
        onRetry={() => {
          setHasError(false);
          window.location.reload();
        }}
        onContactSupport={() => {
          setHasError(false);
          setCurrentPage('support');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* ==========================================
          MAIN CONTENT - Conditional Rendering
          ========================================== */}
      
      {/* HOME PAGE */}
      {currentPage === 'home' && (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/20">
          {/* Your existing home content goes here */}
          <div className="p-5">
            <h1 className="text-3xl font-black text-gray-900 mb-6">Home</h1>
            
            {/* Quick Actions to new features */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              <button
                onClick={() => setCurrentPage('transaction-history')}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-gray-50 active:scale-95 transition-all"
              >
                <div className="size-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md">
                  <Clock className="size-6 text-white" />
                </div>
                <span className="text-xs text-gray-700 font-bold text-center">History</span>
              </button>

              <button
                onClick={() => setCurrentPage('merchant-qr')}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-gray-50 active:scale-95 transition-all"
              >
                <div className="size-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                  <svg className="size-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-700 font-bold text-center">Scan QR</span>
              </button>

              <button
                onClick={() => setCurrentPage('notifications')}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-gray-50 active:scale-95 transition-all relative"
              >
                <div className="size-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-md">
                  <Bell className="size-6 text-white" />
                </div>
                <span className="text-xs text-gray-700 font-bold text-center">Alerts</span>
                {/* Unread indicator */}
                <div className="absolute top-2 right-2 size-2 bg-red-500 rounded-full"></div>
              </button>

              <button
                onClick={() => setCurrentPage('support')}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-gray-50 active:scale-95 transition-all"
              >
                <div className="size-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                  <svg className="size-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-700 font-bold text-center">Help</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REWARDS PAGE */}
      {currentPage === 'rewards' && (
        <RewardsScreenOptimized
          onNavigate={handleNavigate}
        />
      )}

      {/* FINANCE PAGE */}
      {currentPage === 'finance' && (
        <FinanceScreenOptimized
          onNavigate={handleNavigate}
          balance={balance.balance}
          formatCurrency={formatCurrency}
        />
      )}

      {/* TRANSACTION HISTORY */}
      {currentPage === 'transaction-history' && (
        <TransactionHistoryOptimized
          onBack={() => setCurrentPage('activity')}
          formatCurrency={formatCurrency}
        />
      )}

      {/* NOTIFICATIONS */}
      {currentPage === 'notifications' && (
        <NotificationsCenterOptimized
          onBack={() => setCurrentPage('home')}
          onNavigate={handleNavigate}
        />
      )}

      {/* MERCHANT QR */}
      {currentPage === 'merchant-qr' && (
        <MerchantQRPaymentOptimized
          onBack={() => setCurrentPage('home')}
          formatCurrency={formatCurrency}
          balance={balance.balance}
        />
      )}

      {/* SUPPORT */}
      {currentPage === 'support' && (
        <SupportCenterOptimized
          onBack={() => setCurrentPage('profile')}
          onNavigate={handleNavigate}
        />
      )}

      {/* SECURITY */}
      {currentPage === 'security' && (
        <SecuritySettingsOptimized
          onBack={() => setCurrentPage('profile')}
          onNavigate={handleNavigate}
        />
      )}

      {/* PROFILE */}
      {currentPage === 'profile' && (
        <ProfileSettingsOptimized
          user={{
            name: user.name,
            phone: user.phone || '',
            email: user.email,
            kycStatus: 'verified', // Change based on actual status
            membershipTier: 'Gold',
            profileImage: user.profileImage
          }}
          onBack={() => setCurrentPage('home')}
          onNavigate={handleNavigate}
          onLogout={onLogout}
          formatCurrency={formatCurrency}
        />
      )}

      {/* SERVICES PAGE */}
      {currentPage === 'services' && (
        <div className="p-5">
          {/* Your existing services content */}
          <h1 className="text-3xl font-black text-gray-900">Services</h1>
        </div>
      )}

      {/* ACTIVITY PAGE */}
      {currentPage === 'activity' && (
        <div className="p-5">
          <h1 className="text-3xl font-black text-gray-900 mb-6">Activity</h1>
          <button
            onClick={() => setCurrentPage('transaction-history')}
            className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all"
          >
            View Transaction History →
          </button>
        </div>
      )}

      {/* ==========================================
          BOTTOM NAVIGATION
          ========================================== */}
      
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-200">
        <div className="relative bg-white shadow-2xl">
          {/* Animated indicator */}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-[18px] transition-all duration-300 ease-out shadow-lg"
            style={{
              left: `${
                currentPage === 'home' ? '1.3%' :
                currentPage === 'rewards' ? '18%' :
                currentPage === 'finance' ? '34.7%' :
                currentPage === 'services' ? '51.3%' :
                currentPage === 'activity' || currentPage === 'transaction-history' ? '68%' :
                '84.7%'
              }`,
              width: '14%',
            }}
          />

          <div className="relative z-10 flex items-center justify-around px-2 py-2">
            {/* Home */}
            <button
              onClick={() => setCurrentPage('home')}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 transition-all duration-300"
            >
              <Home className={`size-6 transition-all ${
                currentPage === 'home' ? 'text-white scale-110' : 'text-gray-600'
              }`} />
              <span className={`text-[9px] font-semibold transition-all ${
                currentPage === 'home' ? 'text-white' : 'text-gray-700'
              }`}>
                Home
              </span>
            </button>

            {/* Rewards */}
            <button
              onClick={() => setCurrentPage('rewards')}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 transition-all duration-300"
            >
              <Gift className={`size-6 transition-all ${
                currentPage === 'rewards' ? 'text-white scale-110' : 'text-gray-600'
              }`} />
              <span className={`text-[9px] font-semibold transition-all ${
                currentPage === 'rewards' ? 'text-white' : 'text-gray-700'
              }`}>
                Rewards
              </span>
            </button>

            {/* Finance */}
            <button
              onClick={() => setCurrentPage('finance')}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 transition-all duration-300"
            >
              <Wallet className={`size-6 transition-all ${
                currentPage === 'finance' ? 'text-white scale-110' : 'text-gray-600'
              }`} />
              <span className={`text-[9px] font-semibold transition-all ${
                currentPage === 'finance' ? 'text-white' : 'text-gray-700'
              }`}>
                Finance
              </span>
            </button>

            {/* Services */}
            <button
              onClick={() => setCurrentPage('services')}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 transition-all duration-300"
            >
              <Grid3x3 className={`size-6 transition-all ${
                currentPage === 'services' ? 'text-white scale-110' : 'text-gray-600'
              }`} />
              <span className={`text-[9px] font-semibold transition-all ${
                currentPage === 'services' ? 'text-white' : 'text-gray-700'
              }`}>
                Services
              </span>
            </button>

            {/* Activity */}
            <button
              onClick={() => setCurrentPage('activity')}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 transition-all duration-300"
            >
              <Clock className={`size-6 transition-all ${
                currentPage === 'activity' || currentPage === 'transaction-history' ? 'text-white scale-110' : 'text-gray-600'
              }`} />
              <span className={`text-[9px] font-semibold transition-all ${
                currentPage === 'activity' || currentPage === 'transaction-history' ? 'text-white' : 'text-gray-700'
              }`}>
                Activity
              </span>
            </button>

            {/* Profile */}
            <button
              onClick={() => setCurrentPage('profile')}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 transition-all duration-300"
            >
              <UserIcon className={`size-6 transition-all ${
                currentPage === 'profile' || currentPage === 'security' || currentPage === 'support' ? 'text-white scale-110' : 'text-gray-600'
              }`} />
              <span className={`text-[9px] font-semibold transition-all ${
                currentPage === 'profile' || currentPage === 'security' || currentPage === 'support' ? 'text-white' : 'text-gray-700'
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
