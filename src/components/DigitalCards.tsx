import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { User } from '../App';
import { 
  ArrowLeft, 
  CreditCard, 
  QrCode, 
  Smartphone,
  Wifi,
  Download,
  Share2,
  Copy,
  Check
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

interface DigitalCardsProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

export function DigitalCards({ user, accessToken, onBack }: DigitalCardsProps) {
  const [balance, setBalance] = useState(0);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showNFCPay, setShowNFCPay] = useState(false);
  const [permanentQR, setPermanentQR] = useState('');
  const [copied, setCopied] = useState(false);
  const [nfcActive, setNfcActive] = useState(false);

  useEffect(() => {
    fetchWalletData();
    generatePermanentQR();
  }, []);

  const fetchWalletData = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/wallet/balance`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance || 0);
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };

  const generatePermanentQR = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/wallet/generate-qr`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ amount: 0 }), // 0 means flexible amount
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPermanentQR(data.qrCode);
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handleCopyQR = () => {
    navigator.clipboard.writeText(permanentQR);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNFCPay = () => {
    setShowNFCPay(true);
    setNfcActive(true);
    // Simulate NFC timeout after 30 seconds
    setTimeout(() => {
      setNfcActive(false);
    }, 30000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const cardNumber = `**** **** **** ${user.phone.slice(-4)}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 px-4 pt-6 pb-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={onBack}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-full"
            >
              <ArrowLeft className="size-5 text-white" />
            </button>
            <div>
              <h1 className="text-white text-xl">Digital Cards</h1>
              <p className="text-blue-200 text-sm">Your payment cards</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-2 pb-6 space-y-6">
        {/* Primary Card */}
        <div className="relative">
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-3xl p-6 text-white shadow-2xl">
            {/* Card Chip */}
            <div className="flex justify-between items-start mb-8">
              <div className="bg-yellow-400 w-12 h-10 rounded-lg shadow-md"></div>
              <Wifi className="size-8 rotate-90 opacity-70" />
            </div>

            {/* Card Number */}
            <div className="mb-6">
              <p className="text-blue-200 text-xs mb-2">Card Number</p>
              <p className="text-white text-xl tracking-wider">{cardNumber}</p>
            </div>

            {/* Card Holder & Balance */}
            <div className="flex justify-between items-end">
              <div>
                <p className="text-blue-200 text-xs mb-1">Card Holder</p>
                <p className="text-white">{user.name}</p>
              </div>
              <div className="text-right">
                <p className="text-blue-200 text-xs mb-1">Balance</p>
                <p className="text-white text-lg">{formatCurrency(balance)}</p>
              </div>
            </div>

            {/* Logo */}
            <div className="absolute top-6 right-6">
              <div className="text-white text-sm opacity-80">goPay</div>
            </div>
          </div>

          {/* NFC Indicator */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
            <div className="bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
              <Wifi className="size-4 text-blue-600 rotate-90" />
              <span className="text-xs text-gray-600">Tap to Pay Enabled</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3 mt-8">
          <button
            onClick={() => setShowQRCode(true)}
            className="flex flex-col items-center gap-2 p-4 bg-white hover:bg-gray-50 rounded-2xl border border-gray-100 transition-all"
          >
            <div className="bg-blue-100 p-3 rounded-xl">
              <QrCode className="size-6 text-blue-600" />
            </div>
            <span className="text-xs text-center">Show QR</span>
          </button>

          <button
            onClick={handleNFCPay}
            className="flex flex-col items-center gap-2 p-4 bg-white hover:bg-gray-50 rounded-2xl border border-gray-100 transition-all"
          >
            <div className="bg-purple-100 p-3 rounded-xl">
              <Smartphone className="size-6 text-purple-600" />
            </div>
            <span className="text-xs text-center">Tap to Pay</span>
          </button>

          <button
            onClick={handleCopyQR}
            className="flex flex-col items-center gap-2 p-4 bg-white hover:bg-gray-50 rounded-2xl border border-gray-100 transition-all"
          >
            <div className="bg-green-100 p-3 rounded-xl">
              {copied ? (
                <Check className="size-6 text-green-600" />
              ) : (
                <Share2 className="size-6 text-green-600" />
              )}
            </div>
            <span className="text-xs text-center">{copied ? 'Copied!' : 'Share'}</span>
          </button>
        </div>

        {/* Card Features */}
        <div>
          <h3 className="text-base mb-3">Card Features</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <QrCode className="size-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm">QR Code Payment</p>
                  <p className="text-xs text-gray-500">Show QR to receive money</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                Active
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <Wifi className="size-5 text-purple-600 rotate-90" />
                </div>
                <div>
                  <p className="text-sm">NFC Tap Payment</p>
                  <p className="text-xs text-gray-500">Contactless payment at terminals</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                Active
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-3 rounded-xl">
                  <CreditCard className="size-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm">Online Payments</p>
                  <p className="text-xs text-gray-500">Use card number for online shopping</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                Active
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Smartphone className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-900">Secure Payments</p>
              <p className="text-xs text-blue-600">
                All transactions are encrypted and require PIN verification
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Show QR Code Dialog */}
      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Payment QR Code</DialogTitle>
            <DialogDescription>Show this to receive payments</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* QR Code Display */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 text-center">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-500 w-64 h-64 mx-auto rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden">
                <QrCode className="size-40 text-white z-10" />
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              </div>
              <p className="text-sm text-gray-500 mb-2">QR Code ID</p>
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-xs text-gray-600 break-all font-mono">{permanentQR}</p>
              </div>
              <Button
                onClick={handleCopyQR}
                variant="outline"
                className="w-full rounded-xl"
              >
                {copied ? (
                  <>
                    <Check className="size-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="size-4 mr-2" />
                    Copy QR Code
                  </>
                )}
              </Button>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-4 text-white">
              <p className="text-sm">
                <strong>Universal QR Code</strong>
              </p>
              <p className="text-xs text-white/90 mt-1">
                This QR code works across all payment providers in Tanzania. Anyone can scan and pay any amount.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* NFC Payment Dialog */}
      <Dialog open={showNFCPay} onOpenChange={setShowNFCPay}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Tap to Pay</DialogTitle>
            <DialogDescription>Hold your phone near the payment terminal</DialogDescription>
          </DialogHeader>
          <div className="py-8 text-center">
            {nfcActive ? (
              <>
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-20"></div>
                  <div className="absolute inset-0 bg-blue-600 rounded-full animate-pulse opacity-30"></div>
                  <div className="relative bg-gradient-to-br from-blue-600 to-cyan-500 w-32 h-32 rounded-full flex items-center justify-center">
                    <Wifi className="size-16 text-white rotate-90" />
                  </div>
                </div>
                <h3 className="text-xl text-gray-900 mb-2">Ready to Pay</h3>
                <p className="text-gray-500 mb-4">
                  Hold your phone near the terminal
                </p>
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-sm text-blue-900">
                    Available Balance: <strong>{formatCurrency(balance)}</strong>
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-gray-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Wifi className="size-16 text-gray-400 rotate-90" />
                </div>
                <h3 className="text-xl text-gray-900 mb-2">Session Expired</h3>
                <p className="text-gray-500">Tap the button again to activate</p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}