import { useState, useEffect, useRef } from 'react';
import { Toaster } from 'sonner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { WalletPage } from './components/WalletPage';
import { PaymentsPage } from './components/PaymentsPage';
import { BillPaymentsPage } from './components/BillPaymentsPage';
import { MerchantPage } from './components/MerchantPage';
import { TravelPageRedesigned as TravelPage } from './components/TravelPageRedesigned';
import { DigitalCards } from './components/DigitalCards';
import { TransactionHistory } from './components/TransactionHistory';
import { TransactionExport } from './components/TransactionExport';
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
import { ServicesHub } from './components/ServicesHub';
import { InstallPrompt } from './components/InstallPrompt';
// New pages
import { InternationalPage } from './components/InternationalPage';
import { ShopPage } from './components/ShopPage';
import { SubscriptionsPage } from './components/SubscriptionsPage';
import { ShoppingPage } from './components/ShoppingPage';
import { CommunityWalletPage } from './components/CommunityWalletPage';
import { VirtualCardsAdvanced } from './components/VirtualCardsAdvanced';
import { MoviesPage } from './components/MoviesPage';
import { RestaurantsPage } from './components/RestaurantsPage';
import { RidesPage } from './components/RidesPage';
import { CarRentalPage } from './components/CarRentalPage';
import { GoFoodPage } from './components/GoFoodPage';
import { GoSafariPage } from './components/GoSafariPage';
import { MultiModalTripPlanner } from './components/MultiModalTripPlanner';
import { ParcelShippingPage } from './components/ParcelShippingPage';
import { SmartShoppingMarketplace } from './components/SmartShoppingMarketplace';
import { AISmartShoppingAssistant } from './components/AISmartShoppingAssistant';
import { DeliveryRiderDashboard } from './components/DeliveryRiderDashboard';
import { AIAssistantPage } from './components/AIAssistantPage';
import { EmergencySOSPage } from './components/EmergencySOSPage';
import { DigitalAddressPage } from './components/DigitalAddressPage';
import { SMEBusinessSuite } from './components/SMEBusinessSuite';
import { OfflineQRPayment } from './components/OfflineQRPayment';
import { TourismDiscoveryPage } from './components/TourismDiscoveryPage';
import { PromosPage } from './components/PromosPage';
import { MembershipPage } from './components/MembershipPage';
import { MPesaPage } from './components/MPesaPage';
import { InvestorDemoMode } from './components/InvestorDemoMode';
import { GOrewardsCashback } from './components/GOrewardsCashback';
import { SupportChat } from './components/SupportChat';
import { RecurringPaymentsPage } from './components/RecurringPaymentsPage';
import { supabase } from './utils/supabase/client';
import { projectId } from './utils/supabase/info';
import { useAnalytics } from './hooks/useAnalytics';

export type User = {
  id: string;
  email: string;
  name: string;
  phone: string;
  nida: string;
  profilePhoto?: string;
  loyaltyPoints?: number;
};

type Page =
  | 'auth' | 'dashboard' | 'wallet' | 'payments' | 'billpayments' | 'merchant'
  | 'travel' | 'cards' | 'transactions' | 'export' | 'rewards' | 'sendmoney'
  | 'qr' | 'merchantonboarding' | 'merchantdash' | 'security' | 'profile'
  | 'notifications' | 'insights' | 'budget' | 'governmentservices'
  | 'securitycenter' | 'advancedsecurity' | 'ferrybooking' | 'microlans'
  | 'multicurrencywallet' | 'groupmoney' | 'quickpay' | 'serviceshub'
  | 'international' | 'shop' | 'subscriptions' | 'shopping' | 'communitywallet'
  | 'virtualcardsadvanced' | 'movies' | 'restaurants' | 'rides' | 'rentals'
  | 'gofood' | 'gosafari' | 'multimodaltripplanner' | 'parcelshipping'
  | 'smartshoppingmarketplace' | 'aismartshoppingassistant' | 'deliveryriderdashboard'
  | 'aiassistant' | 'emergencysos' | 'digitaladdress' | 'smebusinesssuite'
  | 'offlineqrpayment' | 'tourism' | 'promos' | 'membership'
  | 'mpesa' | 'cashbackrewards' | 'demo' | 'recurringpayments';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('auth');
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [supportOpen, setSupportOpen] = useState(false);
  const profileFetchInFlight = useRef(false);
  const { track } = useAnalytics(accessToken ?? undefined);

  useEffect(() => {
    // Check existing session on mount
    checkSession();

    // Reactive session listener — handles token refresh and sign-out
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setAccessToken(null);
          setCurrentPage('auth');
        } else if (event === 'TOKEN_REFRESHED' && session?.access_token) {
          setAccessToken(session.access_token);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
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
    if (profileFetchInFlight.current) return;
    profileFetchInFlight.current = true;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/user/profile`,
        {
          headers: { 'Authorization': `Bearer ${token}` },
          signal: controller.signal,
        }
      );

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Anonymous / demo user — build minimal profile from auth record
        const { data: { user: authUser } } = await supabase.auth.getUser();
        setUser({
          id: authUser?.id ?? 'demo',
          email: authUser?.email ?? 'demo@gopay.tz',
          name: 'Demo User',
          phone: '+255 700 000 000',
          nida: '',
        });
      }
    } catch {
      setUser({
        id: 'demo',
        email: 'demo@gopay.tz',
        name: 'Demo User',
        phone: '+255 700 000 000',
        nida: '',
      });
    } finally {
      clearTimeout(timeout);
      profileFetchInFlight.current = false;
    }
  };

  const registerPushNotifications = async (token: string) => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjZJHOdKFaFV7tIatZ5z7MWPNQ2cQ',
      });
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/integrations/push/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ subscription: sub }),
        }
      );
    } catch { /* silently fail */ }
  };

  const handleAuthSuccess = async (token: string) => {
    setAccessToken(token);
    await fetchUserProfile(token);
    setCurrentPage('dashboard');
    registerPushNotifications(token);
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

  const navigate = (page: Page) => setCurrentPage(page);
  const goHome = () => setCurrentPage('dashboard');

  useEffect(() => {
    track('page_view', { page: currentPage });
    if (currentPage === 'security') track('settings_security_viewed');
    if (currentPage === 'merchantdash') track('merchant_dashboard_viewed');
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (supportOpen) track('support_chat_opened');
  }, [supportOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handler = () => setSupportOpen(true);
    window.addEventListener('gopay:open-support', handler);
    return () => window.removeEventListener('gopay:open-support', handler);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#080d08' }}>
        <div style={{ color: 'rgba(255,255,255,0.5)' }}>Loading...</div>
      </div>
    );
  }

  if (!accessToken || !user) {
    return (
      <ErrorBoundary>
        <Toaster position="top-center" richColors />
        {currentPage === 'demo' ? (
          <InvestorDemoMode onEnterApp={() => setCurrentPage('auth')} />
        ) : (
          <AuthPage onAuthSuccess={handleAuthSuccess} onViewDemo={() => setCurrentPage('demo')} />
        )}
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Toaster position="top-center" richColors />
      <div className="min-h-screen bg-gray-50 max-w-md mx-auto relative">
        {currentPage === 'dashboard' && (
          <Dashboard user={user} accessToken={accessToken} onNavigate={navigate} onLogout={handleLogout} />
        )}
        {currentPage === 'wallet' && (
          <WalletPage user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'payments' && (
          <PaymentsPage user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'billpayments' && (
          <BillPaymentsPage user={user} accessToken={accessToken} onBack={goHome} onNavigate={navigate} />
        )}
        {currentPage === 'merchant' && (
          <MerchantPage user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'travel' && (
          <TravelPage user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'cards' && (
          <DigitalCards user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'transactions' && (
          <TransactionHistory user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'export' && (
          <TransactionExport user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'rewards' && (
          <GOrewardsUltimate user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'sendmoney' && (
          <SendMoneyPage user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'qr' && (
          <QRScanner user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'merchantonboarding' && (
          <MerchantOnboarding
            user={user}
            accessToken={accessToken}
            onBack={goHome}
            onComplete={() => setCurrentPage('merchantdash')}
          />
        )}
        {currentPage === 'merchantdash' && (
          <MerchantDashboard user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'security' && (
          <SecuritySettings user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'profile' && (
          <SettingsPage user={user} accessToken={accessToken} onBack={goHome} onUpdateUser={setUser} />
        )}
        {currentPage === 'notifications' && (
          <NotificationCenter user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'insights' && (
          <InsightsPage user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'budget' && (
          <BudgetTracker user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'governmentservices' && (
          <GovernmentServicesPage onBack={goHome} onNavigate={navigate} />
        )}
        {currentPage === 'securitycenter' && (
          <SecurityCenter onBack={goHome} onNavigate={(page) => navigate(page as Page)} />
        )}
        {currentPage === 'advancedsecurity' && (
          <AdvancedSecuritySettings onBack={() => setCurrentPage('securitycenter')} />
        )}
        {currentPage === 'ferrybooking' && (
          <FerryBookingPage user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'microlans' && (
          <MicroLoansPage user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'multicurrencywallet' && (
          <MultiCurrencyWallet user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'groupmoney' && (
          <GroupMoneyPools user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'quickpay' && (
          <QuickPayFeatures user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'serviceshub' && (
          <ServicesHub onBack={goHome} onNavigate={(route) => navigate(route as Page)} />
        )}
        {currentPage === 'international' && (
          <InternationalPage user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'shop' && (
          <ShopPage user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'subscriptions' && (
          <SubscriptionsPage user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'shopping' && (
          <ShoppingPage user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'communitywallet' && (
          <CommunityWalletPage user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'virtualcardsadvanced' && (
          <VirtualCardsAdvanced user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'movies' && (
          <MoviesPage user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'restaurants' && (
          <RestaurantsPage user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'rides' && (
          <RidesPage user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'rentals' && (
          <CarRentalPage user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'gofood' && (
          <GoFoodPage user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'gosafari' && (
          <GoSafariPage user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'multimodaltripplanner' && (
          <MultiModalTripPlanner user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'parcelshipping' && (
          <ParcelShippingPage user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'smartshoppingmarketplace' && (
          <SmartShoppingMarketplace user={user} accessToken={accessToken} onBack={goHome} onNavigate={navigate} />
        )}
        {currentPage === 'aismartshoppingassistant' && (
          <AISmartShoppingAssistant user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'deliveryriderdashboard' && (
          <DeliveryRiderDashboard user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'aiassistant' && (
          <AIAssistantPage onBack={goHome} accessToken={accessToken} />
        )}
        {currentPage === 'emergencysos' && (
          <EmergencySOSPage onBack={goHome} />
        )}
        {currentPage === 'digitaladdress' && (
          <DigitalAddressPage onBack={goHome} />
        )}
        {currentPage === 'smebusinesssuite' && (
          <SMEBusinessSuite onBack={goHome} />
        )}
        {currentPage === 'offlineqrpayment' && (
          <OfflineQRPayment onBack={goHome} />
        )}
        {currentPage === 'tourism' && (
          <TourismDiscoveryPage onBack={goHome} />
        )}
        {currentPage === 'promos' && (
          <PromosPage user={user} accessToken={accessToken} onBack={goHome} onNavigate={navigate} />
        )}
        {currentPage === 'membership' && (
          <MembershipPage user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'mpesa' && (
          <MPesaPage user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'cashbackrewards' && (
          <GOrewardsCashback user={user} accessToken={accessToken} onBack={goHome} />
        )}
        {currentPage === 'demo' && (
          <InvestorDemoMode onEnterApp={goHome} />
        )}
        {currentPage === 'recurringpayments' && (
          <RecurringPaymentsPage user={user} accessToken={accessToken} onBack={goHome} />
        )}
        <SupportChat forceOpen={supportOpen} />
        <InstallPrompt />
      </div>
    </ErrorBoundary>
  );
}
