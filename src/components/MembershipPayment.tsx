import { useState } from 'react';
import { ArrowLeft, Wallet, Smartphone, CreditCard, CheckCircle, Loader2, Zap, Crown, Briefcase, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface MembershipTier {
  id: 'basic' | 'premium' | 'business';
  name: string;
  price: number;
  monthlyPrice: number;
  yearlyPrice: number;
  icon: any;
  color: string;
  features: string[];
}

interface MembershipPaymentProps {
  selectedTier: MembershipTier;
  walletBalance: number;
  onBack: () => void;
  onPaymentSuccess: (tier: string, method: string, transactionId: string) => void;
}

export function MembershipPayment({ 
  selectedTier, 
  walletBalance, 
  onBack, 
  onPaymentSuccess 
}: MembershipPaymentProps) {
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'mpesa' | 'tigopesa' | 'airtel' | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState('');

  const amount = billingPeriod === 'monthly' ? selectedTier.monthlyPrice : selectedTier.yearlyPrice;
  const savingsPercent = Math.round(((selectedTier.monthlyPrice * 12 - selectedTier.yearlyPrice) / (selectedTier.monthlyPrice * 12)) * 100);

  const mobileMoneyProviders = [
    {
      id: 'mpesa' as const,
      name: 'M-Pesa',
      icon: '📱',
      color: 'from-green-600 to-green-700',
      prefix: '0'
    },
    {
      id: 'tigopesa' as const,
      name: 'Tigo Pesa',
      icon: '💳',
      color: 'from-blue-600 to-blue-700',
      prefix: '0'
    },
    {
      id: 'airtel' as const,
      name: 'Airtel Money',
      icon: '📲',
      color: 'from-red-600 to-red-700',
      prefix: '0'
    }
  ];

  const handleWalletPayment = async () => {
    if (walletBalance < amount) {
      alert('Insufficient wallet balance. Please top up or use mobile money.');
      return;
    }

    setShowPin(true);
  };

  const confirmWalletPayment = async () => {
    if (pin.length !== 4) {
      alert('Please enter your 4-digit PIN');
      return;
    }

    setProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate transaction ID
      const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Record transaction in localStorage
      const transaction = {
        id: transactionId,
        type: 'membership_upgrade',
        tier: selectedTier.id,
        amount,
        method: 'gopay_wallet',
        status: 'completed',
        timestamp: new Date().toISOString(),
        billingPeriod
      };

      const existingTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      localStorage.setItem('transactions', JSON.stringify([transaction, ...existingTransactions]));

      // Update wallet balance
      const newBalance = walletBalance - amount;
      localStorage.setItem('walletBalance', newBalance.toString());

      setSuccess(true);
      setTimeout(() => {
        onPaymentSuccess(selectedTier.id, 'gopay_wallet', transactionId);
      }, 2000);

    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleMobileMoneyPayment = async (provider: typeof mobileMoneyProviders[0]) => {
    if (!mobileNumber || mobileNumber.length < 10) {
      alert('Please enter a valid mobile number');
      return;
    }

    setProcessing(true);

    try {
      // Simulate mobile money push notification
      await new Promise(resolve => setTimeout(resolve, 1500));

      alert(`✅ Push notification sent to ${mobileNumber}\n\nPlease check your ${provider.name} and enter your PIN to complete the payment.`);

      // Simulate waiting for user to approve on phone
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Generate transaction ID
      const transactionId = `${provider.id.toUpperCase()}${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Record transaction
      const transaction = {
        id: transactionId,
        type: 'membership_upgrade',
        tier: selectedTier.id,
        amount,
        method: provider.id,
        phoneNumber: mobileNumber,
        status: 'completed',
        timestamp: new Date().toISOString(),
        billingPeriod
      };

      const existingTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      localStorage.setItem('transactions', JSON.stringify([transaction, ...existingTransactions]));

      setSuccess(true);
      setTimeout(() => {
        onPaymentSuccess(selectedTier.id, provider.id, transactionId);
      }, 2000);

    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center animate-in zoom-in-95 duration-500">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="size-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your {selectedTier.name} membership is now active
          </p>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">Amount Paid</p>
            <p className="text-3xl font-bold text-green-600">
              TZS {amount.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {billingPeriod === 'yearly' ? 'Yearly' : 'Monthly'} subscription
            </p>
          </div>
          <div className="space-y-2 text-left bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="size-4 text-green-600" />
              <span className="text-gray-700">15% commission on all transactions</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="size-4 text-green-600" />
              <span className="text-gray-700">All premium features unlocked</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="size-4 text-green-600" />
              <span className="text-gray-700">Priority customer support</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showPin && paymentMethod === 'wallet') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setShowPin(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="size-6" />
              </button>
              <div className="flex-1">
                <h1 className="text-xl font-bold">Confirm Payment</h1>
                <p className="text-sm text-gray-600">Enter your PIN</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 max-w-md mx-auto mt-8">
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="size-8 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600 mb-2">You're paying</p>
              <p className="text-4xl font-bold text-gray-900">
                TZS {amount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                From your goPay Wallet
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="wallet-pin">Enter PIN</Label>
                <Input
                  id="wallet-pin"
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="****"
                  className="text-center text-2xl tracking-widest h-14"
                  aria-label="Enter your 4-digit PIN"
                />
              </div>

              <Button
                onClick={confirmWalletPayment}
                disabled={processing || pin.length !== 4}
                className="w-full h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold disabled:bg-gray-300"
              >
                {processing ? (
                  <><Loader2 className="size-5 animate-spin mr-2" /> Processing...</>
                ) : (
                  'Confirm Payment'
                )}
              </Button>
            </div>

            <div className="mt-6 bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-600 text-center">
                🔒 Your payment is secured with bank-grade encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">Upgrade to {selectedTier.name}</h1>
              <p className="text-sm text-gray-600">Choose payment method</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6 pb-24 max-w-2xl mx-auto">
        {/* Selected Plan Summary */}
        <div className={`bg-gradient-to-br ${selectedTier.color} text-white rounded-3xl p-6 shadow-xl`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center">
              <selectedTier.icon className="size-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{selectedTier.name} Plan</h2>
              <p className="text-white/90 text-sm">Premium membership benefits</p>
            </div>
          </div>
        </div>

        {/* Billing Period Selection */}
        <div className="bg-white rounded-3xl p-6 shadow-md">
          <h3 className="font-bold text-gray-900 mb-4">Billing Period</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`p-4 rounded-xl border-2 transition-all ${
                billingPeriod === 'monthly'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-semibold text-gray-900">Monthly</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                TZS {selectedTier.monthlyPrice.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600 mt-1">per month</p>
            </button>

            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`p-4 rounded-xl border-2 transition-all relative ${
                billingPeriod === 'yearly'
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                Save {savingsPercent}%
              </span>
              <p className="font-semibold text-gray-900">Yearly</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                TZS {selectedTier.yearlyPrice.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600 mt-1">per year</p>
            </button>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-3xl p-6 shadow-md">
          <h3 className="font-bold text-gray-900 mb-4">Payment Method</h3>
          
          {/* goPay Wallet */}
          <button
            onClick={() => {
              setPaymentMethod('wallet');
              handleWalletPayment();
            }}
            className="w-full p-6 rounded-2xl border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-all text-left mb-4"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 w-14 h-14 rounded-xl flex items-center justify-center">
                <Wallet className="size-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">goPay Wallet</p>
                <p className="text-sm text-gray-600">
                  Balance: TZS {walletBalance.toLocaleString()}
                </p>
              </div>
              {walletBalance >= amount ? (
                <CheckCircle className="size-6 text-green-600" />
              ) : (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">
                  Insufficient
                </span>
              )}
            </div>
          </button>

          {/* Mobile Money Options */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-600 mb-2">Or pay with Mobile Money</p>
            
            {mobileMoneyProviders.map((provider) => (
              <div key={provider.id}>
                <button
                  onClick={() => setPaymentMethod(provider.id)}
                  className={`w-full p-6 rounded-2xl border-2 transition-all text-left ${
                    paymentMethod === provider.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`bg-gradient-to-br ${provider.color} w-14 h-14 rounded-xl flex items-center justify-center text-2xl`}>
                      {provider.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{provider.name}</p>
                      <p className="text-sm text-gray-600">Pay via mobile money</p>
                    </div>
                    <Smartphone className="size-6 text-gray-400" />
                  </div>
                </button>

                {paymentMethod === provider.id && (
                  <div className="mt-3 p-4 bg-gray-50 rounded-xl animate-in slide-in-from-top-2 duration-300">
                    <Label htmlFor={`${provider.id}-phone`} className="mb-2">Phone Number</Label>
                    <Input
                      id={`${provider.id}-phone`}
                      type="tel"
                      placeholder="0712 345 678"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="mb-3"
                      aria-label={`${provider.name} phone number`}
                    />
                    <Button
                      onClick={() => handleMobileMoneyPayment(provider)}
                      disabled={processing || !mobileNumber}
                      className="w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:bg-gray-300"
                    >
                      {processing ? (
                        <><Loader2 className="size-5 animate-spin mr-2" /> Processing...</>
                      ) : (
                        <>Pay TZS {amount.toLocaleString()}</>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-3xl p-6 shadow-xl">
          <h3 className="font-bold mb-4">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-white/70">Plan</span>
              <span className="font-semibold">{selectedTier.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Billing</span>
              <span className="font-semibold capitalize">{billingPeriod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Subtotal</span>
              <span className="font-semibold">TZS {amount.toLocaleString()}</span>
            </div>
            {billingPeriod === 'yearly' && (
              <div className="flex justify-between text-green-400">
                <span>You save</span>
                <span className="font-bold">
                  TZS {(selectedTier.monthlyPrice * 12 - selectedTier.yearlyPrice).toLocaleString()}
                </span>
              </div>
            )}
            <div className="border-t border-white/20 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg">Total</span>
                <span className="text-3xl font-bold">TZS {amount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
          <div className="flex items-center gap-3">
            <Shield className="size-6 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-blue-900">Secure Payment</p>
              <p className="text-xs text-blue-700">Bank-grade encryption • BoT compliant</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}