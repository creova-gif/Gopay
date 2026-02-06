/**
 * MERCHANT QR PAYMENT - OPTIMIZED
 * 
 * Patterns from: Alipay, WeChat Pay, M-Pesa, GCash
 * 
 * Features:
 * - QR scanner with guidance
 * - Merchant verification
 * - Amount entry
 * - Tip option (optional)
 * - Payment confirmation
 * - Receipt generation
 * - Recent merchants
 * - WCAG AA compliant
 */

import { useState } from 'react';
import {
  QrCode,
  Camera,
  DollarSign,
  Store,
  CheckCircle2,
  AlertCircle,
  Shield,
  Clock,
  MapPin,
  Star,
  ChevronRight,
  Download
} from 'lucide-react';
import {
  PageHeader,
  SectionHeader,
  Alert,
  EmptyState,
  ListItem,
  BottomSheet
} from './design-system/SharedComponents';

interface Merchant {
  id: string;
  name: string;
  category: string;
  location: string;
  verified: boolean;
  rating: number;
  lastVisit?: string;
}

interface MerchantQRPaymentOptimizedProps {
  onBack: () => void;
  formatCurrency: (amount: number) => string;
  balance: number;
}

export function MerchantQRPaymentOptimized({ 
  onBack, 
  formatCurrency,
  balance 
}: MerchantQRPaymentOptimizedProps) {
  const [view, setView] = useState<'scan' | 'amount' | 'confirm' | 'success'>('scan');
  const [scannedMerchant, setScannedMerchant] = useState<Merchant | null>(null);
  const [amount, setAmount] = useState('');
  const [addTip, setAddTip] = useState(false);
  const [tipAmount, setTipAmount] = useState('');
  const [pin, setPin] = useState('');
  const [processing, setProcessing] = useState(false);

  // Mock recent merchants - replace with API
  const recentMerchants: Merchant[] = [
    {
      id: '1',
      name: 'Shoppers Plaza',
      category: 'Retail',
      location: 'Mlimani City, DSM',
      verified: true,
      rating: 4.8,
      lastVisit: 'Yesterday'
    },
    {
      id: '2',
      name: 'Café Aroma',
      category: 'Restaurant',
      location: 'Masaki, DSM',
      verified: true,
      rating: 4.6,
      lastVisit: '3 days ago'
    },
    {
      id: '3',
      name: 'Tumaini Pharmacy',
      category: 'Healthcare',
      location: 'Kariakoo, DSM',
      verified: true,
      rating: 4.9,
      lastVisit: '1 week ago'
    }
  ];

  // Mock QR scan
  const handleQRScan = () => {
    // Simulate scanning
    setTimeout(() => {
      setScannedMerchant({
        id: 'M001',
        name: 'Fresh Mart Supermarket',
        category: 'Retail',
        location: 'Mikocheni, Dar es Salaam',
        verified: true,
        rating: 4.7
      });
      setView('amount');
    }, 1500);
  };

  // Process payment
  const handlePayment = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (pin.length !== 4) {
      alert('Please enter your 4-digit PIN');
      return;
    }

    const totalAmount = parseFloat(amount) + (addTip ? parseFloat(tipAmount || '0') : 0);

    if (totalAmount > balance) {
      alert('Insufficient balance');
      return;
    }

    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setView('success');
    }, 2000);
  };

  // SCAN VIEW
  if (view === 'scan') {
    return (
      <div className="min-h-screen bg-gray-900">
        <PageHeader
          title="Scan QR Code"
          swahiliTitle="Changanua QR"
          subtitle="Point camera at merchant QR"
          onBack={onBack}
        />

        <div className="p-5 space-y-6">
          {/* SCANNER FRAME */}
          <div className="relative aspect-square bg-black rounded-3xl overflow-hidden border-4 border-white/20">
            {/* Camera placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Camera className="size-24 text-white/30" />
            </div>

            {/* Scanning frame */}
            <div className="absolute inset-8 border-4 border-emerald-500 rounded-2xl">
              {/* Corner markers */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg"></div>
              
              {/* Scanning line animation */}
              <div className="absolute inset-x-0 top-1/2 h-1 bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-scan"></div>
            </div>

            {/* Instructions */}
            <div className="absolute bottom-6 inset-x-6">
              <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
                <QrCode className="size-8 text-white mx-auto mb-2" />
                <p className="text-sm text-white font-bold mb-1">Position QR code here</p>
                <p className="text-xs text-white/70">Make sure the code is clear and well-lit</p>
              </div>
            </div>
          </div>

          {/* TRUST SIGNALS */}
          <div className="space-y-3">
            <Alert
              type="info"
              title="Usalama Kamili • 100% Secure"
              message="Your payment is protected with bank-level encryption"
            />

            {/* Manual entry */}
            <button
              onClick={() => setView('amount')}
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white py-3 rounded-xl text-sm font-bold transition-all"
            >
              Enter Merchant Code Manually
            </button>
          </div>

          {/* RECENT MERCHANTS */}
          {recentMerchants.length > 0 && (
            <div className="bg-gray-800 rounded-2xl p-4">
              <SectionHeader
                title="Recent Merchants"
                subtitle="Quick pay"
                icon={<Clock className="size-5 text-white" />}
              />
              
              <div className="space-y-2 mt-3">
                {recentMerchants.map(merchant => (
                  <button
                    key={merchant.id}
                    onClick={() => {
                      setScannedMerchant(merchant);
                      setView('amount');
                    }}
                    className="w-full bg-gray-700/50 hover:bg-gray-700 border border-gray-600 rounded-xl p-3 text-left transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                        <Store className="size-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-bold text-white">{merchant.name}</p>
                          {merchant.verified && (
                            <Shield className="size-3 text-emerald-400" />
                          )}
                        </div>
                        <p className="text-xs text-gray-400">{merchant.lastVisit}</p>
                      </div>
                      <ChevronRight className="size-4 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Demo button */}
          <button
            onClick={handleQRScan}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 rounded-xl text-sm font-bold transition-all"
          >
            [Demo] Simulate QR Scan
          </button>
        </div>
      </div>
    );
  }

  // AMOUNT ENTRY VIEW
  if (view === 'amount' && scannedMerchant) {
    const totalAmount = parseFloat(amount || '0') + (addTip ? parseFloat(tipAmount || '0') : 0);

    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader
          title="Enter Amount"
          swahiliTitle="Weka Kiasi"
          subtitle="How much to pay?"
          onBack={() => setView('scan')}
        />

        <div className="p-5 space-y-6">
          {/* MERCHANT INFO */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <div className="size-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Store className="size-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-lg font-black text-gray-900">{scannedMerchant.name}</p>
                  {scannedMerchant.verified && (
                    <div className="bg-green-100 p-1 rounded-full">
                      <Shield className="size-4 text-green-600" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-700 font-medium mb-2">{scannedMerchant.category}</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="size-3 text-gray-600" />
                    <span className="text-xs text-gray-600 font-medium">{scannedMerchant.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="size-3 text-amber-500 fill-amber-500" />
                    <span className="text-xs text-gray-900 font-bold">{scannedMerchant.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AMOUNT INPUT */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-5">
            <label className="block text-sm font-bold text-gray-900 mb-3">
              Kiasi • Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 size-6 text-gray-500" />
              <input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-16 pl-14 pr-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none text-2xl font-black text-gray-900"
              />
            </div>

            {/* Quick amounts */}
            <div className="grid grid-cols-4 gap-2 mt-3">
              {[1000, 5000, 10000, 20000].map(amt => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt.toString())}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-900 py-2 rounded-lg text-xs font-bold transition-all"
                >
                  {amt/1000}K
                </button>
              ))}
            </div>
          </div>

          {/* TIP OPTION */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-bold text-gray-900 mb-0.5">Add Tip (Optional)</p>
                <p className="text-xs text-gray-700">Support great service</p>
              </div>
              <button
                onClick={() => setAddTip(!addTip)}
                className={`w-12 h-7 rounded-full transition-all ${
                  addTip ? 'bg-emerald-600' : 'bg-gray-300'
                }`}
              >
                <div className={`size-5 bg-white rounded-full transition-all shadow-md ${
                  addTip ? 'ml-6' : 'ml-1'
                }`}></div>
              </button>
            </div>

            {addTip && (
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Enter tip amount"
                  value={tipAmount}
                  onChange={(e) => setTipAmount(e.target.value)}
                  className="w-full h-12 px-4 border-2 border-amber-300 rounded-xl focus:border-amber-500 focus:outline-none text-sm font-bold"
                />
                <div className="grid grid-cols-3 gap-2">
                  {[1000, 2000, 5000].map(tip => (
                    <button
                      key={tip}
                      onClick={() => setTipAmount(tip.toString())}
                      className="bg-amber-100 hover:bg-amber-200 text-amber-900 py-2 rounded-lg text-xs font-bold"
                    >
                      +{tip/1000}K
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* TOTAL */}
          {amount && parseFloat(amount) > 0 && (
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-bold text-gray-900">Jumla • Total</p>
                <p className="text-2xl font-black text-emerald-700">
                  {formatCurrency(totalAmount)}
                </p>
              </div>
            </div>
          )}

          {/* CONTINUE */}
          <button
            onClick={() => setView('confirm')}
            disabled={!amount || parseFloat(amount) <= 0}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 text-white py-4 rounded-xl text-base font-black transition-all shadow-lg disabled:shadow-none"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    );
  }

  // CONFIRM VIEW
  if (view === 'confirm' && scannedMerchant) {
    const totalAmount = parseFloat(amount) + (addTip ? parseFloat(tipAmount || '0') : 0);

    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader
          title="Confirm Payment"
          swahiliTitle="Thibitisha Malipo"
          subtitle="Review before paying"
          onBack={() => setView('amount')}
        />

        <div className="p-5 space-y-6">
          {/* PAYMENT SUMMARY */}
          <div className="bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 rounded-3xl p-6 text-white shadow-2xl">
            <p className="text-sm text-emerald-100 font-semibold mb-2">Paying to</p>
            <p className="text-2xl font-black mb-6">{scannedMerchant.name}</p>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-white/80">Amount</span>
                <span className="text-base font-bold">{formatCurrency(parseFloat(amount))}</span>
              </div>
              {addTip && parseFloat(tipAmount || '0') > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-white/80">Tip</span>
                  <span className="text-base font-bold">{formatCurrency(parseFloat(tipAmount))}</span>
                </div>
              )}
              <div className="border-t border-white/20 pt-3 flex justify-between">
                <span className="text-base font-bold">Total</span>
                <span className="text-3xl font-black">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* PIN ENTRY */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-5">
            <label className="block text-sm font-bold text-gray-900 mb-3">
              Weka PIN • Enter PIN
            </label>
            <input
              type="password"
              maxLength={4}
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full h-14 text-center text-2xl tracking-widest border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none font-black"
            />
          </div>

          {/* INSUFFICIENT BALANCE WARNING */}
          {totalAmount > balance && (
            <Alert
              type="error"
              title="Insufficient Balance"
              message={`You need ${formatCurrency(totalAmount - balance)} more to complete this payment`}
              action={{
                label: 'Add Money',
                onClick: () => {}
              }}
            />
          )}

          {/* PAY BUTTON */}
          <button
            onClick={handlePayment}
            disabled={processing || pin.length !== 4 || totalAmount > balance}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 text-white py-4 rounded-xl text-base font-black transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                <DollarSign className="size-5" />
                Pay {formatCurrency(totalAmount)}
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // SUCCESS VIEW
  if (view === 'success' && scannedMerchant) {
    const totalAmount = parseFloat(amount) + (addTip ? parseFloat(tipAmount || '0') : 0);

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          {/* Success icon */}
          <div className="text-center">
            <div className="size-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <CheckCircle2 className="size-14 text-white" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">Mafanikio! • Success!</h1>
            <p className="text-sm text-gray-700 font-medium">Payment completed successfully</p>
          </div>

          {/* Receipt */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 space-y-4">
            <div className="text-center mb-4">
              <p className="text-4xl font-black text-gray-900 mb-1">
                {formatCurrency(totalAmount)}
              </p>
              <p className="text-sm text-gray-700 font-medium">Paid to {scannedMerchant.name}</p>
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">Date & Time</span>
                <span className="font-bold text-gray-900">{new Date().toLocaleString('en-GB')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Reference</span>
                <span className="font-bold text-emerald-700 font-mono">TXN{Date.now()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Status</span>
                <span className="font-bold text-green-700">Successful</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
              <Download className="size-4" />
              Download Receipt
            </button>

            <button
              onClick={() => {
                setView('scan');
                setAmount('');
                setTipAmount('');
                setPin('');
                setScannedMerchant(null);
              }}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-xl text-sm font-bold transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
