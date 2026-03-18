import { useState, useEffect } from 'react';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { WalletPage } from './components/WalletPage';
import { PaymentsPage } from './components/PaymentsPage';
import { BillPaymentsPage } from './components/BillPaymentsPage';
import { MerchantPage } from './components/MerchantPage';
import { TravelPageRedesigned as TravelPage } from './components/TravelPageRedesigned';
import { DigitalCards } from './components/DigitalCards';
import { TransactionHistory } from './components/TransactionHistory';
import { GOrewardsUltimate } from './components/GOrewardsUltimate';
import { SendMoneyPage } from './components/SendMoneyPage';
import { QRScanner } from './components/QRScanner';
import { MerchantOnboarding } from './components/MerchantOnboarding';
import { MerchantDashboard } from './components/MerchantDashboard';
import { SecuritySettings } from './components/SecuritySettings';
import { SettingsPage } from './components/SettingsPage';
import { NotificationCenter } from './components/NotificationCenter';
import { InsightsPage } from './components/InsightsPage';
import { BudgetTracker } from './components/BudgetTracker';
import { GovernmentServicesPage } from './components/GovernmentServicesPage';
import { SecurityCenter } from './components/SecurityCenter';
import { AdvancedSecuritySettings } from './components/AdvancedSecuritySettings';
import { FerryBookingPage } from './components/FerryBookingPage';
import { MicroLoansPage } from './components/MicroLoansPage';
import { MultiCurrencyWallet } from './components/MultiCurrencyWallet';
import { GroupMoneyPools } from './components/GroupMoneyPools';
import { QuickPayFeatures } from './components/QuickPayFeatures';
import { InstallPrompt } from './components/InstallPrompt';
import { PerformanceMonitor } from './components/PerformanceMonitor';
import { ServicesHub } from './components/ServicesHub';
import { supabase } from './utils/supabase/client';
import { projectId } from './utils/supabase/info';

export type User = {
  id: string;
  email: string;
  name: string;
  phone: string;
  nida: string;
  profilePhoto?: string;
  loyaltyPoints?: number;
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<
    'auth' | 'dashboard' | 'wallet' | 'payments' | 'billpayments' | 'merchant' | 
    'travel' | 'cards' | 'transactions' | 'rewards' | 'sendmoney' | 'qr' | 
    'merchantonboarding' | 'merchantdash' | 'security' | 'profile' | 'notifications' | 
    'insights' | 'budget' | 'governmentservices' | 'securitycenter' | 
    'advancedsecurity' | 'ferrybooking' | 'microlans' | 'multicurrencywallet' | 
    'groupmoney' | 'quickpay' | 'serviceshub'
  >('auth');
  
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session?.access_token) {
        setAccessToken(session.access_token);
        await fetchUserProfile(session.access_token);
        setCurrentPage('dashboard');
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/user/profile`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleAuthSuccess = async (token: string) => {
    setAccessToken(token);
    
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser(token);
      
      if (authUser) {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/user/profile`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setCurrentPage('dashboard');
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setAccessToken(null);
      setCurrentPage('auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#080d08' }}>
        <div style={{ color: 'rgba(255,255,255,0.5)' }}>Loading...</div>
      </div>
    );
  }

  if (!accessToken || !user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto relative">
      {currentPage === 'dashboard' && (
        <Dashboard
          user={user}
          accessToken={accessToken}
          onNavigate={setCurrentPage}
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'wallet' && (
        <WalletPage
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'payments' && (
        <PaymentsPage
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'billpayments' && (
        <BillPaymentsPage
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'merchant' && (
        <MerchantPage
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'travel' && (
        <TravelPage
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'cards' && (
        <DigitalCards
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'transactions' && (
        <TransactionHistory
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'rewards' && (
        <GOrewardsUltimate
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'sendmoney' && (
        <SendMoneyPage
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'qr' && (
        <QRScanner
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'merchantonboarding' && (
        <MerchantOnboarding
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
          onComplete={() => setCurrentPage('merchantdash')}
        />
      )}
      {currentPage === 'merchantdash' && (
        <MerchantDashboard
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'security' && (
        <SecuritySettings
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'profile' && (
        <SettingsPage
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
          onUpdateUser={setUser}
        />
      )}
      {currentPage === 'notifications' && (
        <NotificationCenter
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'insights' && (
        <InsightsPage
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'budget' && (
        <BudgetTracker
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'governmentservices' && (
        <GovernmentServicesPage
          onBack={() => setCurrentPage('dashboard')}
          onNavigate={setCurrentPage}
        />
      )}
      {currentPage === 'securitycenter' && (
        <SecurityCenter
          onBack={() => setCurrentPage('dashboard')}
          onNavigate={(page) => setCurrentPage(page as any)}
        />
      )}
      {currentPage === 'advancedsecurity' && (
        <AdvancedSecuritySettings
          onBack={() => setCurrentPage('securitycenter')}
        />
      )}
      {currentPage === 'ferrybooking' && (
        <FerryBookingPage
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'microlans' && (
        <MicroLoansPage
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'multicurrencywallet' && (
        <MultiCurrencyWallet
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'groupmoney' && (
        <GroupMoneyPools
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'quickpay' && (
        <QuickPayFeatures 
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')} 
        />
      )}
      {currentPage === 'serviceshub' && (
        <ServicesHub 
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')} 
        />
      )}
      <InstallPrompt />
      <PerformanceMonitor />
    </div>
  );
}