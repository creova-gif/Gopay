# goPay Integration Guide - Complete Step-by-Step

This guide shows you how to integrate all optimized components into your existing Dashboard.tsx.

---

## 📋 TABLE OF CONTENTS

1. [Quick Start](#quick-start)
2. [Import All Components](#import-all-components)
3. [Add Navigation State](#add-navigation-state)
4. [Wire Up Components](#wire-up-components)
5. [Add Bottom Navigation](#add-bottom-navigation)
6. [Error Handling](#error-handling)
7. [Testing Checklist](#testing-checklist)

---

## 🚀 QUICK START

### **Step 1: Import All Components**

Add these imports to the top of your `Dashboard.tsx`:

```typescript
// Optimized Components
import { RewardsScreenOptimized } from './RewardsScreenOptimized';
import { FinanceScreenOptimized } from './FinanceScreenOptimized';
import { TransactionHistoryOptimized } from './TransactionHistoryOptimized';
import { NotificationsCenterOptimized } from './NotificationsCenterOptimized';
import { MerchantQRPaymentOptimized } from './MerchantQRPaymentOptimized';
import { SupportCenterOptimized } from './SupportCenterOptimized';
import { SecuritySettingsOptimized } from './SecuritySettingsOptimized';
import { ProfileSettingsOptimized } from './ProfileSettingsOptimized';

// Error States
import {
  OfflineState,
  PaymentFailed,
  SystemDelay,
  FirstTimeEmpty,
  NoResults,
  EmptyData,
  ServerError
} from './ErrorStateComponents';
```

---

### **Step 2: Add Navigation State**

Replace your existing `currentPage` state with expanded navigation:

```typescript
export function Dashboard({ user, accessToken, onNavigate, onLogout }: DashboardProps) {
  // Expanded navigation state
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
    'security' |
    'settings'
  >('home');

  // Error states
  const [isOffline, setIsOffline] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Listen for online/offline
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Existing states...
  const [balance, setBalance] = useState({ balance: 450000, currency: 'TZS' });
  const [balanceVisible, setBalanceVisible] = useState(true);
  
  // Helper function
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Navigation helper
  const handleNavigate = (screen: string) => {
    setCurrentPage(screen as any);
  };
```

---

### **Step 3: Wire Up Components**

Replace your existing tab content with these conditionals:

```typescript
  // Inside your Dashboard component's return statement

  {/* OFFLINE STATE - Highest Priority */}
  {isOffline ? (
    <OfflineState
      onRetry={() => {
        setIsOffline(false);
        window.location.reload();
      }}
      onGoHome={() => setCurrentPage('home')}
    />
  ) : (
    <>
      {/* HOME TAB */}
      {currentPage === 'home' && (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/20">
          {/* Your existing home content */}
        </div>
      )}

      {/* REWARDS TAB */}
      {currentPage === 'rewards' && (
        <RewardsScreenOptimized
          onNavigate={handleNavigate}
        />
      )}

      {/* FINANCE TAB */}
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

      {/* NOTIFICATIONS CENTER */}
      {currentPage === 'notifications' && (
        <NotificationsCenterOptimized
          onBack={() => setCurrentPage('home')}
          onNavigate={handleNavigate}
        />
      )}

      {/* MERCHANT QR PAYMENT */}
      {currentPage === 'merchant-qr' && (
        <MerchantQRPaymentOptimized
          onBack={() => setCurrentPage('home')}
          formatCurrency={formatCurrency}
          balance={balance.balance}
        />
      )}

      {/* SUPPORT CENTER */}
      {currentPage === 'support' && (
        <SupportCenterOptimized
          onBack={() => setCurrentPage('profile')}
          onNavigate={handleNavigate}
        />
      )}

      {/* SECURITY SETTINGS */}
      {currentPage === 'security' && (
        <SecuritySettingsOptimized
          onBack={() => setCurrentPage('profile')}
          onNavigate={handleNavigate}
        />
      )}

      {/* PROFILE & SETTINGS */}
      {currentPage === 'profile' && (
        <ProfileSettingsOptimized
          user={{
            name: user.name,
            phone: user.phone || '',
            email: user.email,
            kycStatus: 'verified', // or 'pending' | 'not-started'
            membershipTier: 'Gold',
            profileImage: user.profileImage
          }}
          onBack={() => setCurrentPage('home')}
          onNavigate={handleNavigate}
          onLogout={onLogout}
          formatCurrency={formatCurrency}
        />
      )}
    </>
  )}
```

---

### **Step 4: Update Home Screen Quick Actions**

Add these buttons to your home screen to access new features:

```typescript
{/* In your home screen, add quick access buttons */}
<div className="grid grid-cols-4 gap-3">
  <button
    onClick={() => setCurrentPage('transaction-history')}
    className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-gray-50 transition-all"
  >
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
      <Receipt className="size-5 text-white" />
    </div>
    <span className="text-xs text-gray-700 font-medium text-center">History</span>
  </button>

  <button
    onClick={() => setCurrentPage('merchant-qr')}
    className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-gray-50 transition-all"
  >
    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl shadow-lg">
      <QrCode className="size-5 text-white" />
    </div>
    <span className="text-xs text-gray-700 font-medium text-center">Scan QR</span>
  </button>

  <button
    onClick={() => setCurrentPage('notifications')}
    className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-gray-50 transition-all relative"
  >
    <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-xl shadow-lg">
      <Bell className="size-5 text-white" />
    </div>
    <span className="text-xs text-gray-700 font-medium text-center">Alerts</span>
    {/* Unread badge */}
    <div className="absolute top-2 right-2 size-2 bg-red-500 rounded-full"></div>
  </button>

  <button
    onClick={() => setCurrentPage('support')}
    className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-gray-50 transition-all"
  >
    <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg">
      <MessageCircle className="size-5 text-white" />
    </div>
    <span className="text-xs text-gray-700 font-medium text-center">Help</span>
  </button>
</div>
```

---

### **Step 5: Add Notification Badge to Header**

Update your app header to show notifications:

```typescript
{/* In your header */}
<div className="flex items-center gap-3">
  <button
    onClick={() => setCurrentPage('notifications')}
    className="relative p-2 hover:bg-gray-100 rounded-full transition-all"
  >
    <Bell className="size-6 text-gray-900" />
    {/* Unread badge */}
    <div className="absolute top-1 right-1 size-2 bg-red-500 rounded-full"></div>
  </button>

  <button
    onClick={() => setCurrentPage('profile')}
    className="size-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center"
  >
    <User className="size-5 text-white" />
  </button>
</div>
```

---

### **Step 6: Update Bottom Navigation**

Replace your existing bottom nav with updated tabs:

```typescript
{/* Bottom Navigation */}
<div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-200 pb-safe">
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
        <HomeIcon className={`size-6 transition-all ${
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
        <RewardsIcon className={`size-6 transition-all ${
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
        <WalletIcon className={`size-6 transition-all ${
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
        <svg className={`size-6 transition-all ${
          currentPage === 'services' ? 'text-white scale-110' : 'text-gray-600'
        }`} /* your services icon */ />
        <span className={`text-[9px] font-semibold transition-all ${
          currentPage === 'services' ? 'text-white' : 'text-gray-700'
        }`}>
          Services
        </span>
      </button>

      {/* Activity */}
      <button
        onClick={() => setCurrentPage('activity')}
        className="flex-1 flex flex-col items-center gap-0.5 py-2 transition-all duration-300 relative"
      >
        <HistoryIcon className={`size-6 transition-all ${
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
        <ProfileIcon className={`size-6 transition-all ${
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
```

---

## 🔧 ERROR HANDLING

### **Add Global Error Boundary**

```typescript
// At the component level
try {
  // Your component logic
} catch (error) {
  console.error('Dashboard error:', error);
  return <ServerError 
    onRetry={() => window.location.reload()}
    onContactSupport={() => setCurrentPage('support')}
  />;
}
```

### **Add Offline Detection**

```typescript
// Check offline on mount
useEffect(() => {
  if (!navigator.onLine) {
    setIsOffline(true);
  }
}, []);
```

### **Payment Error Handling**

```typescript
// In your payment flow
const handlePayment = async () => {
  try {
    const response = await fetch(/* your API */);
    if (!response.ok) {
      setPaymentError({
        message: 'Payment failed. Please try again.',
        transactionId: 'TXN123456'
      });
    }
  } catch (error) {
    setPaymentError({
      message: 'Network error. Please check your connection.',
      transactionId: null
    });
  }
};

// Render error
{paymentError && (
  <PaymentFailed
    errorMessage={paymentError.message}
    transactionId={paymentError.transactionId}
    onRetry={handlePayment}
    onContactSupport={() => setCurrentPage('support')}
    onGoHome={() => setCurrentPage('home')}
  />
)}
```

---

## ✅ TESTING CHECKLIST

### **Navigation Tests**
- [ ] All bottom nav tabs work
- [ ] Back buttons return to correct screen
- [ ] Deep links work (e.g., notifications → transaction details)
- [ ] Bottom nav indicator animates smoothly

### **Component Tests**
- [ ] Transaction history loads and filters work
- [ ] Notifications display and mark as read
- [ ] QR scanner flow completes
- [ ] Support chat works
- [ ] Security settings save
- [ ] Profile updates persist

### **Error Handling Tests**
- [ ] Offline mode shows correct state
- [ ] Payment failures show error
- [ ] Network timeouts handled
- [ ] Empty states render correctly

### **Accessibility Tests**
- [ ] All text meets WCAG AA contrast
- [ ] Touch targets ≥48px
- [ ] Keyboard navigation works
- [ ] Screen reader labels present

### **Performance Tests**
- [ ] Components load quickly
- [ ] Animations are smooth (60fps)
- [ ] No memory leaks
- [ ] Works on low-end devices

---

## 🎯 QUICK REFERENCE

### **Common Navigation Patterns**

```typescript
// Go to transaction history from anywhere
setCurrentPage('transaction-history');

// Open specific notification
setCurrentPage('notifications');
// Then handle detail in NotificationsCenterOptimized

// Start QR payment
setCurrentPage('merchant-qr');

// Open support with pre-filled context
setCurrentPage('support');
// Pass context via props if needed

// Go to security from profile
// In ProfileSettingsOptimized, it calls:
onNavigate('security');
```

### **State Management**

```typescript
// Balance
const [balance, setBalance] = useState({ balance: 450000, currency: 'TZS' });

// Update balance after transaction
setBalance(prev => ({ ...prev, balance: prev.balance - amount }));

// User data
const [user, setUser] = useState({
  name: 'John Doe',
  phone: '+255 754 123 456',
  kycStatus: 'verified'
});
```

---

## 🚨 COMMON ISSUES & FIXES

### **Issue: Components not rendering**
**Fix:** Check import paths are correct and components are exported

### **Issue: Navigation doesn't update**
**Fix:** Make sure `setCurrentPage` is called with correct string

### **Issue: Props missing**
**Fix:** Verify all required props are passed (check TypeScript errors)

### **Issue: Styles not applying**
**Fix:** Ensure Tailwind classes are in safelist or component file

### **Issue: Back button goes to wrong screen**
**Fix:** Update `onBack` prop to set correct `currentPage`

---

## 📚 NEXT STEPS

1. **Test thoroughly** on real devices
2. **Connect to backend** APIs
3. **Add analytics** tracking
4. **Performance optimization**
5. **User testing** with Tanzanian users
6. **Launch** to production! 🚀

---

**You're now ready to launch a world-class fintech super app for Tanzania!** 🇹🇿💰

Need help with specific integration? Check the component files for detailed prop interfaces and usage examples.
