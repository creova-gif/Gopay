import { useState, useEffect } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { OnboardingScreen } from './components/OnboardingScreen';
import { OnboardingFlow } from './components/OnboardingFlow';
import { OnboardingSuccess } from './components/OnboardingSuccess';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { WalletPage } from './components/WalletPage';
import { PaymentsPage } from './components/PaymentsPage';
import { BillPaymentsPage } from './components/BillPaymentsPage';
import { MerchantPage } from './components/MerchantPage';
import { TravelPageRedesigned as TravelPage } from './components/TravelPageRedesigned';
import { GoSafariPage } from './components/GoSafariPage';
import { DigitalCards } from './components/DigitalCards';
import { TransactionExport } from './components/TransactionExport';
import { TransactionHistory } from './components/TransactionHistory';
import { RewardsPage } from './components/RewardsPage';
import { GOrewardsUltimate } from './components/GOrewardsUltimate';
import { ShopPage } from './components/ShopPage';
import { InternationalPage } from './components/InternationalPage';
import { SubscriptionsPage } from './components/SubscriptionsPage';
import { ShoppingPage } from './components/ShoppingPage';
import { SendMoneyPage } from './components/SendMoneyPage';
import { QRScanner } from './components/QRScanner';
import { MerchantOnboarding } from './components/MerchantOnboarding';
import { MerchantDashboard } from './components/MerchantDashboard';
import { AdminVerification } from './components/AdminVerification';
import { SecuritySettings } from './components/SecuritySettings';
import { MoviesPage } from './components/MoviesPage';
import { MembershipPage } from './components/MembershipPage';
import { RestaurantsPage } from './components/RestaurantsPage';
import { RidesPage } from './components/RidesPage';
import { CarRentalPage } from './components/CarRentalPage';
import { SettingsPage } from './components/SettingsPage';
import { NotificationCenter } from './components/NotificationCenter';
import { InsightsPage } from './components/InsightsPage';
import { BudgetTracker } from './components/BudgetTracker';
import { GoFoodPage } from './components/GoFoodPage';
import { PromosPage } from './components/PromosPage';
import { TourismDiscoveryPage } from './components/TourismDiscoveryPage';
import { PrivacySettingsPage } from './components/PrivacySettingsPage';
import { GovernmentServicesPage } from './components/GovernmentServicesPage';
import { AIAssistantPage } from './components/AIAssistantPage';
import { EmergencySOSPage } from './components/EmergencySOSPage';
import { DigitalAddressPage } from './components/DigitalAddressPage';
import { SMEBusinessSuite } from './components/SMEBusinessSuite';
import { OfflineQRPayment } from './components/OfflineQRPayment';
import { SecurityCenter } from './components/SecurityCenter';
import { AdvancedSecuritySettings } from './components/AdvancedSecuritySettings';
import { FraudDetectionDashboard } from './components/FraudDetectionDashboard';
import { EnhancedKYCVerification } from './components/EnhancedKYCVerification';
import { FerryBookingPage } from './components/FerryBookingPage';
import { MultiModalTripPlanner } from './components/MultiModalTripPlanner';
import { ParcelShippingPage } from './components/ParcelShippingPage';
import { VirtualCardsAdvanced } from './components/VirtualCardsAdvanced';
import { MicroLoansPage } from './components/MicroLoansPage';
import { MultiCurrencyWallet } from './components/MultiCurrencyWallet';
import { CommunityWalletPage } from './components/CommunityWalletPage';
import { SmartShoppingMarketplace } from './components/SmartShoppingMarketplace';
import { AISmartShoppingAssistant } from './components/AISmartShoppingAssistant';
import { DeliveryRiderDashboard } from './components/DeliveryRiderDashboard';
import { GroupMoneyPools } from './components/GroupMoneyPools';
import { VCDashboard2025 } from './components/VCDashboard2025';
import { QuickPayFeatures } from './components/QuickPayFeatures';
import { SmartDigitalAddress } from './components/SmartDigitalAddress';
import { ARTourismLayer } from './components/ARTourismLayer';
import { SIMSwapProtection } from './components/SIMSwapProtection';
import { GovernmentInbox } from './components/GovernmentInbox';
import { EconomicIdentity } from './components/EconomicIdentity';
import { LocalDiscoveryFeed } from './components/LocalDiscoveryFeed';
import { MiniAppsMarketplace } from './components/MiniAppsMarketplace';
import { BehavioralBiometrics } from './components/BehavioralBiometrics';
import { AlternativeCreditScore } from './components/AlternativeCreditScore';
import { InstallPrompt } from './components/InstallPrompt';
import { PerformanceMonitor } from './components/PerformanceMonitor';
import { EcommerceMarketplace } from './components/EcommerceMarketplace';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { DEMO_USER, initializeDemoData } from './utils/demoData';

// Initialize Supabase client
let supabase: SupabaseClient;
try {
  supabase = createClient(
    `https://${projectId}.supabase.co`,
    publicAnonKey
  );
} catch (error) {
  console.error('Error initializing Supabase:', error);
}

export type User = {
  id: string;
  email: string;
  name: string;
  phone: string;
  nida: string;
  profilePhoto?: string;
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<'onboarding' | 'auth' | 'dashboard' | 'wallet' | 'payments' | 'billpayments' | 'merchant' | 'travel' | 'gosafari' | 'cards' | 'export' | 'transactions' | 'rewards' | 'shop' | 'international' | 'subscriptions' | 'shopping' | 'sendmoney' | 'qr' | 'merchantonboarding' | 'merchantdash' | 'admin' | 'security' | 'movies' | 'membership' | 'restaurants' | 'rides' | 'rentals' | 'profile' | 'notifications' | 'insights' | 'budget' | 'gofood' | 'promos' | 'tourism' | 'privacy' | 'governmentservices' | 'aiassistant' | 'emergencysos' | 'digitaladdress' | 'smebusinesssuite' | 'offlineqrpayment' | 'securitycenter' | 'advancedsecurity' | 'frauddetection' | 'enhancedkyc' | 'ferrybooking' | 'multimodaltripplanner' | 'parcelshipping' | 'virtualcardsadvanced' | 'microlans' | 'multicurrencywallet' | 'communitywallet' | 'smartshoppingmarketplace' | 'aismartshoppingassistant' | 'deliveryriderdashboard' | 'groupmoney' | 'vcdashboard' | 'quickpay' | 'smartdigitaladdress' | 'artourism' | 'simswapprotection' | 'governmentinbox' | 'economicidentity' | 'localdiscovery' | 'miniapps' | 'behavioralbiometrics' | 'creditscore' | 'ecommerce'>('onboarding');
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<'flow' | 'success' | 'complete'>('flow');
  const [newUserData, setNewUserData] = useState<any>(null);

  useEffect(() => {
    // Initialize demo data
    initializeDemoData();
    
    // Check for existing session or demo mode
    const demoToken = localStorage.getItem('demo-mode');
    if (demoToken === 'active') {
      setIsDemoMode(true);
      // Load demo user from localStorage (might have been updated)
      const savedDemoUser = localStorage.getItem('demo-user');
      if (savedDemoUser) {
        setUser(JSON.parse(savedDemoUser));
      } else {
        setUser(DEMO_USER);
      }
      setAccessToken('demo-token-active');
      setCurrentPage('dashboard');
      setLoading(false);
    } else {
      checkSession();
    }
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
    
    // If demo mode, create demo user
    if (token.startsWith('demo-token')) {
      setUser({
        id: 'demo-user',
        email: 'demo@gopay.tz',
        name: 'John Mwangi',
        phone: '+255 712 345 678',
        nida: '19900101-12345-00001-23'
      });
      setCurrentPage('dashboard');
      return;
    }
    
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser(token);
      
      if (authUser) {
        // Fetch user profile from backend
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
      <div className="min-h-screen bg-gradient-to-br from-green-600 to-blue-700 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!accessToken || !user) {
    if (showOnboarding) {
      if (onboardingStep === 'flow') {
        return (
          <OnboardingFlow
            onComplete={(data) => {
              setNewUserData(data);
              setOnboardingStep('success');
            }}
            onSkipToDemo={() => {
              // Skip directly to demo mode
              setIsDemoMode(true);
              const demoUser = {
                ...DEMO_USER,
                id: 'demo-user-' + Date.now(),
              };
              setUser(demoUser);
              setAccessToken('demo-token-active');
              localStorage.setItem('demo-mode', 'active');
              localStorage.setItem('demo-user', JSON.stringify(demoUser));
              setShowOnboarding(false);
              setCurrentPage('dashboard');
            }}
          />
        );
      } else if (onboardingStep === 'success') {
        return (
          <OnboardingSuccess
            userName={newUserData?.name || 'User'}
            onGetStarted={() => {
              // Create demo account with onboarding data
              setIsDemoMode(true);
              const demoUser = {
                id: 'demo-user-' + Date.now(),
                email: newUserData?.email || 'demo@gopay.tz',
                name: newUserData?.name || 'Demo User',
                phone: newUserData?.phone || '+255 700 000 000',
                nida: '19900101-12345-00001-23',
                profilePhoto: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUserData?.name || 'User'}`,
              };
              setUser(demoUser);
              setAccessToken('demo-token-active');
              
              // Save to localStorage
              localStorage.setItem('demo-mode', 'active');
              localStorage.setItem('demo-user', JSON.stringify(demoUser));
              localStorage.setItem('demo-pin', newUserData?.pin || '1234');
              
              setShowOnboarding(false);
              setCurrentPage('dashboard');
            }}
          />
        );
      }
    }
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
          isDemoMode={isDemoMode}
        />
      )}
      {currentPage === 'wallet' && (
        <WalletPage
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
          isDemoMode={isDemoMode}
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
      {currentPage === 'gosafari' && (
        <GoSafariPage
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
      {currentPage === 'export' && (
        <TransactionExport
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
      {currentPage === 'shop' && (
        <ShopPage
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'international' && (
        <InternationalPage
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'subscriptions' && (
        <SubscriptionsPage
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'shopping' && (
        <ShoppingPage
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
      {currentPage === 'admin' && (
        <AdminVerification
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
      {currentPage === 'movies' && (
        <MoviesPage
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'membership' && (
        <MembershipPage
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'restaurants' && (
        <RestaurantsPage
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'rides' && (
        <RidesPage
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'rentals' && (
        <CarRentalPage
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
      {currentPage === 'gofood' && (
        <GoFoodPage
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'promos' && (
        <PromosPage
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
          onNavigate={setCurrentPage}
        />
      )}
      {currentPage === 'tourism' && (
        <TourismDiscoveryPage
          onBack={() => setCurrentPage('dashboard')}
          userLocation={{ lat: -6.7924, lng: 39.2083 }} // Dar es Salaam default
        />
      )}
      {currentPage === 'privacy' && (
        <PrivacySettingsPage
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'governmentservices' && (
        <GovernmentServicesPage
          onBack={() => setCurrentPage('dashboard')}
          onNavigate={setCurrentPage}
        />
      )}
      {currentPage === 'aiassistant' && (
        <AIAssistantPage
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'emergencysos' && (
        <EmergencySOSPage
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'digitaladdress' && (
        <DigitalAddressPage
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'smebusinesssuite' && (
        <SMEBusinessSuite
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'offlineqrpayment' && (
        <OfflineQRPayment
          onBack={() => setCurrentPage('dashboard')}
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
      {currentPage === 'frauddetection' && (
        <FraudDetectionDashboard
          onBack={() => setCurrentPage('securitycenter')}
        />
      )}
      {currentPage === 'enhancedkyc' && (
        <EnhancedKYCVerification
          onBack={() => setCurrentPage('securitycenter')}
          onComplete={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'ferrybooking' && (
        <FerryBookingPage
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'multimodaltripplanner' && (
        <MultiModalTripPlanner
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'parcelshipping' && (
        <ParcelShippingPage
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'virtualcardsadvanced' && (
        <VirtualCardsAdvanced
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
      {currentPage === 'communitywallet' && (
        <CommunityWalletPage
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'smartshoppingmarketplace' && (
        <SmartShoppingMarketplace
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
          onNavigate={setCurrentPage}
        />
      )}
      {currentPage === 'aismartshoppingassistant' && (
        <AISmartShoppingAssistant
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'deliveryriderdashboard' && (
        <DeliveryRiderDashboard
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
      {currentPage === 'vcdashboard' && (
        <VCDashboard2025 onBack={() => setCurrentPage('dashboard')} />
      )}
      {currentPage === 'quickpay' && (
        <QuickPayFeatures 
          user={user}
          accessToken={accessToken}
          onBack={() => setCurrentPage('dashboard')} 
        />
      )}
      {currentPage === 'smartdigitaladdress' && (
        <SmartDigitalAddress onBack={() => setCurrentPage('dashboard')} />
      )}
      {currentPage === 'artourism' && (
        <ARTourismLayer onBack={() => setCurrentPage('dashboard')} />
      )}
      {currentPage === 'simswapprotection' && (
        <SIMSwapProtection onBack={() => setCurrentPage('dashboard')} />
      )}
      {currentPage === 'governmentinbox' && (
        <GovernmentInbox onBack={() => setCurrentPage('dashboard')} />
      )}
      {currentPage === 'economicidentity' && (
        <EconomicIdentity onBack={() => setCurrentPage('dashboard')} user={user} />
      )}
      {currentPage === 'localdiscovery' && (
        <LocalDiscoveryFeed onBack={() => setCurrentPage('dashboard')} />
      )}
      {currentPage === 'miniapps' && (
        <MiniAppsMarketplace onBack={() => setCurrentPage('dashboard')} />
      )}
      {currentPage === 'behavioralbiometrics' && (
        <BehavioralBiometrics onBack={() => setCurrentPage('dashboard')} />
      )}
      {currentPage === 'creditscore' && (
        <AlternativeCreditScore onBack={() => setCurrentPage('dashboard')} />
      )}
      {currentPage === 'ecommerce' && (
        <EcommerceMarketplace 
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