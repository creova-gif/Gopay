import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  CreditCard, 
  Smartphone, 
  QrCode, 
  Copy, 
  Check,
  Wifi,
  Radio,
  ChevronRight,
  Eye,
  EyeOff,
  X
} from 'lucide-react';
import { User } from '../App';

interface QuickPayFeaturesProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

export function QuickPayFeatures({ user, accessToken, onBack }: QuickPayFeaturesProps) {
  const [activeView, setActiveView] = useState<'main' | 'card' | 'tap' | 'qr'>('main');
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [showCVV, setShowCVV] = useState(false);
  const [qrAmount, setQrAmount] = useState('');
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [nfcActive, setNfcActive] = useState(false);

  // Demo virtual card data
  const virtualCard = {
    number: '5284 7821 4532 9876',
    expiry: '12/27',
    cvv: '742',
    name: user.name.toUpperCase(),
    type: 'VISA',
    balance: 1250000 // TZS
  };

  const handleGenerateQR = () => {
    if (qrAmount && parseFloat(qrAmount) > 0) {
      // In real implementation, this would call backend
      const qrData = `gopay://pay?user=${user.id}&amount=${qrAmount}`;
      setGeneratedQR(qrData);
    }
  };

  const handleCopyCardNumber = () => {
    navigator.clipboard.writeText(virtualCard.number.replace(/\s/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activateNFC = () => {
    setNfcActive(true);
    // Simulate NFC activation
    setTimeout(() => {
      setNfcActive(false);
    }, 10000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (activeView === 'main') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-6 rounded-b-3xl">
          <div className="flex items-center mb-6">
            <Button 
              onClick={onBack}
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-emerald-500 -ml-2"
            >
              <X className="h-5 w-5" />
            </Button>
            <h1 className="text-xl ml-2">Quick Pay</h1>
          </div>

          <p className="text-emerald-100 text-sm mb-2">Choose your payment method</p>
        </div>

        {/* Payment Methods */}
        <div className="px-4 py-6 space-y-4">
          
          {/* Virtual Card */}
          <button
            onClick={() => setActiveView('card')}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg">Virtual Card</h3>
                    <p className="text-sm text-blue-100">Pay online & in-store</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-blue-100">Card Balance</div>
                <div className="text-xl">{formatCurrency(virtualCard.balance)}</div>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 opacity-10">
              <CreditCard className="h-40 w-40 text-white" />
            </div>
          </button>

          {/* Tap to Pay */}
          <button
            onClick={() => setActiveView('tap')}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Smartphone className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg">Tap to Pay</h3>
                    <p className="text-sm text-purple-100">Contactless NFC payment</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4" />
                <span className="text-sm text-purple-100">NFC enabled devices only</span>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 opacity-10">
              <Radio className="h-40 w-40 text-white" />
            </div>
          </button>

          {/* QR Code Payment */}
          <button
            onClick={() => setActiveView('qr')}
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <QrCode className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg">QR Code</h3>
                    <p className="text-sm text-emerald-100">Receive payments instantly</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-emerald-100">Generate dynamic QR codes</span>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 opacity-10">
              <QrCode className="h-40 w-40 text-white" />
            </div>
          </button>

          {/* Info Card */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <h3 className="text-sm mb-2">💡 Quick Pay Benefits</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Instant payments without cash</li>
              <li>• Secure encrypted transactions</li>
              <li>• Works online and offline</li>
              <li>• Track all payments in one place</li>
            </ul>
          </Card>
        </div>
      </div>
    );
  }

  if (activeView === 'card') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-6">
          <div className="flex items-center mb-4">
            <Button 
              onClick={() => setActiveView('main')}
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-blue-500 -ml-2"
            >
              <X className="h-5 w-5" />
            </Button>
            <h1 className="text-xl ml-2">Virtual Card</h1>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Virtual Card Display */}
          <div className="relative">
            <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white rounded-2xl p-6 shadow-2xl aspect-[1.586/1] relative overflow-hidden">
              {/* Card Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-20 translate-x-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-16 -translate-x-16"></div>
              </div>

              <div className="relative z-10 h-full flex flex-col justify-between">
                {/* Card Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-yellow-400 w-10 h-8 rounded"></div>
                    <Wifi className="h-5 w-5 rotate-90" />
                  </div>
                  <div className="text-xl tracking-wider">{virtualCard.type}</div>
                </div>

                {/* Card Number */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl tracking-widest font-mono">
                      {showCardDetails ? virtualCard.number : '•••• •••• •••• ' + virtualCard.number.slice(-4)}
                    </div>
                    <button onClick={handleCopyCardNumber} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">CARDHOLDER</div>
                      <div className="text-sm">{virtualCard.name}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">EXPIRES</div>
                      <div className="text-sm">{virtualCard.expiry}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">CVV</div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm">{showCVV ? virtualCard.cvv : '•••'}</div>
                        <button onClick={() => setShowCVV(!showCVV)} className="p-1 hover:bg-white/10 rounded">
                          {showCVV ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Show/Hide Details Button */}
            <button
              onClick={() => setShowCardDetails(!showCardDetails)}
              className="w-full mt-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              {showCardDetails ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  <span>Hide Details</span>
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  <span>Show Details</span>
                </>
              )}
            </button>
          </div>

          {/* Card Info */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg">Card Balance</h3>
              <div className="text-2xl">{formatCurrency(virtualCard.balance)}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Load Money
              </Button>
              <Button variant="outline">
                View History
              </Button>
            </div>
          </Card>

          {/* Usage Instructions */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <h3 className="mb-3">How to Use</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <div className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</div>
                <p>Use this virtual card for online purchases</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</div>
                <p>Enter card details at checkout</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</div>
                <p>Receive instant payment confirmation</p>
              </div>
            </div>
          </Card>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Secured by 256-bit encryption</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeView === 'tap') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-6">
          <div className="flex items-center mb-4">
            <Button 
              onClick={() => setActiveView('main')}
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-purple-500 -ml-2"
            >
              <X className="h-5 w-5" />
            </Button>
            <h1 className="text-xl ml-2">Tap to Pay</h1>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* NFC Animation */}
          <div className="flex flex-col items-center justify-center py-12">
            <div className={`relative ${nfcActive ? 'animate-pulse' : ''}`}>
              <div className={`w-40 h-40 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center ${nfcActive ? 'shadow-2xl shadow-purple-500/50' : 'shadow-xl'}`}>
                <Smartphone className="h-20 w-20 text-white" />
              </div>
              {nfcActive && (
                <>
                  <div className="absolute inset-0 rounded-full border-4 border-purple-400 animate-ping"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-purple-300 animate-pulse"></div>
                </>
              )}
            </div>
            <div className="mt-6 text-center">
              <h2 className="text-2xl mb-2">
                {nfcActive ? 'Ready to Pay' : 'Tap to Activate'}
              </h2>
              <p className="text-gray-600">
                {nfcActive ? 'Hold your phone near the payment terminal' : 'Activate NFC payment to get started'}
              </p>
            </div>
          </div>

          {/* Activate Button */}
          {!nfcActive ? (
            <Button 
              onClick={activateNFC}
              className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-lg"
            >
              <Radio className="h-5 w-5 mr-2" />
              Activate NFC Payment
            </Button>
          ) : (
            <div className="space-y-3">
              <Card className="p-4 bg-green-50 border-green-200">
                <div className="flex items-center gap-2 text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="">NFC Active - Hold near terminal</span>
                </div>
              </Card>
              <Button 
                onClick={() => setNfcActive(false)}
                variant="outline"
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          )}

          {/* Transaction Limits */}
          <Card className="p-4">
            <h3 className="mb-3">Transaction Limits</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Per Transaction</span>
                <span className="">TZS 500,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Daily Limit</span>
                <span className="">TZS 2,000,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Today's Usage</span>
                <span className="text-emerald-600">TZS 350,000</span>
              </div>
            </div>
          </Card>

          {/* How it Works */}
          <Card className="p-4 bg-purple-50 border-purple-200">
            <h3 className="mb-3">How Tap to Pay Works</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</div>
                <p>Activate NFC payment in the app</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</div>
                <p>Hold your phone near the contactless payment terminal</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</div>
                <p>Wait for confirmation beep and vibration</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">4</div>
                <p>Payment complete! Check your transaction history</p>
              </div>
            </div>
          </Card>

          {/* Supported Locations */}
          <Card className="p-4">
            <h3 className="mb-3">Supported Locations</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Supermarkets</Badge>
              <Badge variant="secondary">Restaurants</Badge>
              <Badge variant="secondary">Gas Stations</Badge>
              <Badge variant="secondary">Retail Stores</Badge>
              <Badge variant="secondary">Hotels</Badge>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (activeView === 'qr') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-6">
          <div className="flex items-center mb-4">
            <Button 
              onClick={() => setActiveView('main')}
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-emerald-500 -ml-2"
            >
              <X className="h-5 w-5" />
            </Button>
            <h1 className="text-xl ml-2">QR Code Payment</h1>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {!generatedQR ? (
            <>
              {/* Amount Input */}
              <Card className="p-6">
                <h3 className="mb-4">Enter Amount to Receive</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">Amount (TZS)</label>
                    <Input
                      type="number"
                      value={qrAmount}
                      onChange={(e) => setQrAmount(e.target.value)}
                      placeholder="0"
                      className="text-2xl h-16 text-center"
                    />
                  </div>
                  <Button 
                    onClick={handleGenerateQR}
                    disabled={!qrAmount || parseFloat(qrAmount) <= 0}
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <QrCode className="h-5 w-5 mr-2" />
                    Generate QR Code
                  </Button>
                </div>
              </Card>

              {/* Quick Amount Buttons */}
              <div>
                <p className="text-sm text-gray-600 mb-3">Quick amounts:</p>
                <div className="grid grid-cols-3 gap-3">
                  {[5000, 10000, 20000, 50000, 100000, 200000].map((amount) => (
                    <Button
                      key={amount}
                      onClick={() => setQrAmount(amount.toString())}
                      variant="outline"
                      className="h-12"
                    >
                      {formatCurrency(amount)}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Generated QR Code */}
              <Card className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl mb-2">Scan to Pay</h3>
                  <div className="text-3xl mb-1">{formatCurrency(parseFloat(qrAmount))}</div>
                  <p className="text-sm text-gray-600">Show this QR code to receive payment</p>
                </div>

                {/* QR Code Display (Simulated) */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border-4 border-emerald-600 mx-auto w-fit">
                  <div className="w-64 h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                    <QrCode className="h-48 w-48 text-gray-400" />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button 
                    onClick={() => {
                      setGeneratedQR(null);
                      setQrAmount('');
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Generate New QR Code
                  </Button>
                </div>
              </Card>

              {/* QR Info */}
              <Card className="p-4 bg-emerald-50 border-emerald-200">
                <div className="flex items-start gap-2 text-sm text-emerald-800">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5"></div>
                  <p>This QR code is valid for 10 minutes and will expire automatically</p>
                </div>
              </Card>
            </>
          )}

          {/* How it Works */}
          <Card className="p-4 bg-gray-50">
            <h3 className="mb-3 text-sm">How QR Payment Works</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <div className="bg-emerald-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</div>
                <p>Enter the amount you want to receive</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-emerald-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</div>
                <p>Show the generated QR code to the payer</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-emerald-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</div>
                <p>They scan it with their GO Pay app</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-emerald-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">4</div>
                <p>Receive instant payment confirmation</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
