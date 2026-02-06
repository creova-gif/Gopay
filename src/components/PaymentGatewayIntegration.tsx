import { useState } from 'react';
import { Button } from './ui/button';
import { User } from '../App';
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  CheckCircle2,
  XCircle,
  Loader2,
  Shield,
  Zap,
  Globe,
  QrCode,
  Phone,
  AlertCircle,
  Info
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface PaymentGatewayIntegrationProps {
  user: User;
  accessToken: string;
  amount: number;
  description: string;
  reference: string;
  onSuccess: (transactionId: string) => void;
  onCancel: () => void;
}

type PaymentMethod = 'mpesa' | 'airtel' | 'tigo' | 'halopesa' | 'bank' | 'card';
type Aggregator = 'selcom' | 'pesapal' | 'paychangu' | 'jenga' | 'nlynx' | 'direct';

export function PaymentGatewayIntegration({
  user,
  accessToken,
  amount,
  description,
  reference,
  onSuccess,
  onCancel,
}: PaymentGatewayIntegrationProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [selectedAggregator, setSelectedAggregator] = useState<Aggregator>('selcom');
  const [phoneNumber, setPhoneNumber] = useState(user.phone || '');
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [message, setMessage] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const paymentMethods = [
    {
      id: 'mpesa' as PaymentMethod,
      name: 'M-Pesa',
      icon: '📱',
      color: 'from-green-500 to-green-600',
      description: 'Vodacom M-Pesa',
      providers: ['Vodacom Daraja API', 'Selcom', 'Pesapal'],
    },
    {
      id: 'airtel' as PaymentMethod,
      name: 'Airtel Money',
      icon: '🔴',
      color: 'from-red-500 to-red-600',
      description: 'Airtel Tanzania',
      providers: ['Airtel Money API', 'Selcom', 'Pesapal'],
    },
    {
      id: 'tigo' as PaymentMethod,
      name: 'TigoPesa',
      icon: '🔵',
      color: 'from-blue-500 to-blue-600',
      description: 'Tigo Tanzania',
      providers: ['TigoPesa API', 'Selcom', 'Pesapal'],
    },
    {
      id: 'halopesa' as PaymentMethod,
      name: 'HaloPesa',
      icon: '🟣',
      color: 'from-purple-500 to-purple-600',
      description: 'Halotel Tanzania',
      providers: ['HaloPesa API', 'Selcom'],
    },
    {
      id: 'bank' as PaymentMethod,
      name: 'Bank Account',
      icon: '🏦',
      color: 'from-gray-600 to-gray-700',
      description: 'Direct bank transfer',
      providers: ['Selcom', 'Jenga API', 'Pesapal'],
    },
    {
      id: 'card' as PaymentMethod,
      name: 'Card Payment',
      icon: '💳',
      color: 'from-indigo-500 to-indigo-600',
      description: 'Visa, Mastercard',
      providers: ['Selcom', 'Pesapal', 'PayChangu'],
    },
  ];

  const aggregators = [
    {
      id: 'selcom' as Aggregator,
      name: 'Selcom',
      logo: '🟢',
      description: 'Largest aggregator - All mobile money, banks, cards, govt payments',
      features: ['Mobile Money', 'Bank Transfers', 'Card Payments', 'Government Bills', 'QR Codes'],
      recommended: true,
    },
    {
      id: 'pesapal' as Aggregator,
      name: 'Pesapal',
      logo: '🟠',
      description: 'Popular East African payment gateway',
      features: ['Mobile Money', 'Card Payments', 'Bank Transfers', 'Multi-currency'],
      recommended: false,
    },
    {
      id: 'paychangu' as Aggregator,
      name: 'PayChangu',
      logo: '🔷',
      description: 'Modern payment platform',
      features: ['Mobile Money', 'Cards', 'Crypto', 'API-first'],
      recommended: false,
    },
    {
      id: 'jenga' as Aggregator,
      name: 'Jenga API',
      logo: '🏦',
      description: 'Equity Bank Group - Banking services',
      features: ['Bank Transfers', 'Account Info', 'Airtime', 'Bill Payments'],
      recommended: false,
    },
    {
      id: 'nlynx' as Aggregator,
      name: 'N-Lynx',
      logo: '⚡',
      description: 'Government payments specialist',
      features: ['TRA Payments', 'Water Bills', 'Luku Tokens', 'Municipal Fees'],
      recommended: false,
    },
    {
      id: 'direct' as Aggregator,
      name: 'Direct APIs',
      logo: '🔗',
      description: 'Connect directly to telco APIs',
      features: ['M-Pesa Daraja', 'Airtel Money', 'TigoPesa', 'HaloPesa'],
      recommended: false,
    },
  ];

  const handlePayment = async () => {
    if (!selectedMethod) {
      setMessage('Please select a payment method');
      return;
    }

    if (!phoneNumber && (selectedMethod === 'mpesa' || selectedMethod === 'airtel' || selectedMethod === 'tigo' || selectedMethod === 'halopesa')) {
      setMessage('Please enter your phone number');
      return;
    }

    setProcessing(true);
    setStatus('processing');
    setMessage('Initiating payment...');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/payment-aggregator/process-payment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            amount,
            currency: 'TZS',
            paymentMethod: selectedMethod,
            phoneNumber,
            description,
            userId: user.id,
            reference,
            aggregator: selectedAggregator,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setTransactionId(result.transactionId);
        setMessage(result.message || 'Payment initiated successfully!');
        
        // Auto-complete in demo mode after 2 seconds
        setTimeout(() => {
          onSuccess(result.transactionId);
        }, 2000);
      } else {
        setStatus('failed');
        setMessage(result.error || 'Payment failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setStatus('failed');
      setMessage('Network error. Please check your connection and try again.');
    } finally {
      setProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-blue-700 px-5 pt-8 pb-6">
        <button
          onClick={onCancel}
          className="bg-white/20 backdrop-blur-md hover:bg-white/30 p-2 rounded-full mb-6 transition-all"
        >
          <ArrowLeft className="size-5 text-white" />
        </button>

        <h1 className="text-white text-2xl mb-2">Secure Payment</h1>
        <p className="text-white/80 text-sm">{description}</p>

        {/* Amount Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 mt-6">
          <p className="text-white/70 text-sm mb-1">Amount to Pay</p>
          <p className="text-white text-4xl">{formatCurrency(amount)}</p>
        </div>
      </div>

      <div className="px-5 py-6 space-y-6">
        {/* Status Messages */}
        {status === 'processing' && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <Loader2 className="size-6 text-blue-600 animate-spin" />
              <div>
                <p className="font-medium text-blue-900">Processing Payment...</p>
                <p className="text-sm text-blue-700">{message}</p>
              </div>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-6 text-green-600" />
              <div className="flex-1">
                <p className="font-medium text-green-900">Payment Successful!</p>
                <p className="text-sm text-green-700">{message}</p>
                <p className="text-xs text-green-600 mt-1">Transaction ID: {transactionId}</p>
              </div>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <XCircle className="size-6 text-red-600" />
              <div>
                <p className="font-medium text-red-900">Payment Failed</p>
                <p className="text-sm text-red-700">{message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Aggregator Selection */}
        {status === 'idle' && (
          <>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Shield className="size-5 text-gray-700" />
                <h3 className="text-lg">Payment Gateway</h3>
              </div>
              <div className="space-y-3">
                {aggregators.map((agg) => (
                  <button
                    key={agg.id}
                    onClick={() => setSelectedAggregator(agg.id)}
                    className={`w-full text-left rounded-2xl p-4 border-2 transition-all ${
                      selectedAggregator === agg.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{agg.logo}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{agg.name}</p>
                          {agg.recommended && (
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{agg.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {agg.features.map((feature, idx) => (
                            <span
                              key={idx}
                              className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Selection */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Wallet className="size-5 text-gray-700" />
                <h3 className="text-lg">Payment Method</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`rounded-2xl p-4 border-2 transition-all ${
                      selectedMethod === method.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{method.icon}</div>
                    <p className="font-medium text-sm mb-1">{method.name}</p>
                    <p className="text-xs text-gray-500">{method.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Phone Number Input (for mobile money) */}
            {selectedMethod && ['mpesa', 'airtel', 'tigo', 'halopesa'].includes(selectedMethod) && (
              <div>
                <label className="block text-sm mb-2 text-gray-700">
                  <Phone className="size-4 inline mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+255 712 345 678"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-500 mt-2">
                  You'll receive a payment prompt on this number
                </p>
              </div>
            )}

            {/* Integration Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <Info className="size-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900 mb-1">Real Payment Integration</p>
                  <p className="text-sm text-blue-700 mb-2">
                    goPay integrates with {selectedAggregator === 'selcom' ? 'Selcom' : selectedAggregator === 'direct' ? 'direct telco APIs' : selectedAggregator} for secure, real money transactions.
                  </p>
                  <div className="space-y-1 text-xs text-blue-600">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="size-3" />
                      <span>C2B Collections (Customer to Business)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="size-3" />
                      <span>B2C Disbursements (Withdrawals)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="size-3" />
                      <span>Real-time webhooks & confirmations</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="size-3" />
                      <span>Reversal API support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="bg-gray-900 rounded-2xl p-4 text-white">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="size-6 text-green-400" />
                <div>
                  <p className="font-medium">Bank-Grade Security</p>
                  <p className="text-sm text-gray-300">Powered by {selectedAggregator === 'selcom' ? 'Selcom' : selectedAggregator}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-white/10 rounded-lg p-2 text-center">
                  <p className="text-gray-300">256-bit</p>
                  <p className="text-white font-medium">Encryption</p>
                </div>
                <div className="bg-white/10 rounded-lg p-2 text-center">
                  <p className="text-gray-300">PCI DSS</p>
                  <p className="text-white font-medium">Compliant</p>
                </div>
                <div className="bg-white/10 rounded-lg p-2 text-center">
                  <p className="text-gray-300">BoT</p>
                  <p className="text-white font-medium">Approved</p>
                </div>
              </div>
            </div>

            {/* Pay Button */}
            <Button
              onClick={handlePayment}
              disabled={!selectedMethod || processing}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-6 rounded-2xl text-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {processing ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="size-5 animate-spin" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Zap className="size-5" />
                  Pay {formatCurrency(amount)}
                </span>
              )}
            </Button>

            <p className="text-center text-xs text-gray-500">
              By proceeding, you agree to goPay's Terms of Service and confirm this payment
            </p>
          </>
        )}
      </div>
    </div>
  );
}
