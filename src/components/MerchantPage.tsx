import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User } from '../App';
import { ArrowLeft, QrCode, Scan, CreditCard, Store, CheckCircle } from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

interface MerchantPageProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

export function MerchantPage({ user, accessToken, onBack }: MerchantPageProps) {
  const [showScanQR, setShowScanQR] = useState(false);
  const [scannedCode, setScannedCode] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentPin, setPaymentPin] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  const handleScanAndPay = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/wallet/pay-qr`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            qrCode: scannedCode,
            amount: paymentAmount,
            pin: paymentPin,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setPaymentDetails(result);
        setPaymentSuccess(true);
        setScannedCode('');
        setPaymentAmount('');
        setPaymentPin('');
        
        setTimeout(() => {
          setShowScanQR(false);
          setPaymentSuccess(false);
          setPaymentDetails(null);
        }, 3000);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('An error occurred');
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
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 px-4 pt-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-full"
            >
              <ArrowLeft className="size-5 text-white" />
            </button>
            <div>
              <h1 className="text-white text-xl">Scan & Pay</h1>
              <p className="text-blue-200 text-sm">Pay at any merchant or person</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-12 pb-6 space-y-6">
        {/* Scan QR Card */}
        <div className="bg-white rounded-3xl p-8 text-center shadow-lg">
          <div className="bg-gradient-to-br from-blue-600 to-cyan-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Scan className="size-12 text-white" />
          </div>
          <h2 className="text-xl text-gray-900 mb-2">Scan to Pay</h2>
          <p className="text-gray-500 mb-6">
            Scan any QR code to pay instantly
          </p>
          <Button
            onClick={() => setShowScanQR(true)}
            className="h-14 px-8 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-2xl"
          >
            <Scan className="size-5 mr-2" />
            Scan QR Code
          </Button>
        </div>

        {/* How it Works */}
        <div>
          <h3 className="text-base mb-4">How to Pay</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-100">
              <div className="bg-blue-100 p-2 rounded-xl">
                <span className="text-blue-600">1</span>
              </div>
              <div>
                <p className="text-sm">Scan the QR Code</p>
                <p className="text-xs text-gray-500">Use your camera to scan merchant or personal QR code</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-100">
              <div className="bg-blue-100 p-2 rounded-xl">
                <span className="text-blue-600">2</span>
              </div>
              <div>
                <p className="text-sm">Enter Amount (if needed)</p>
                <p className="text-xs text-gray-500">Some QR codes have preset amounts</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-100">
              <div className="bg-blue-100 p-2 rounded-xl">
                <span className="text-blue-600">3</span>
              </div>
              <div>
                <p className="text-sm">Confirm Payment</p>
                <p className="text-xs text-gray-500">Enter your PIN to complete the transaction</p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="size-6" />
            <h3 className="text-white text-lg">Fast & Secure</h3>
          </div>
          <p className="text-sm text-white/90">
            Pay instantly without cash. All transactions are encrypted and protected.
          </p>
        </div>
      </div>

      {/* Scan QR Dialog */}
      <Dialog open={showScanQR} onOpenChange={setShowScanQR}>
        <DialogContent className="rounded-3xl">
          {!paymentSuccess ? (
            <>
              <DialogHeader>
                <DialogTitle>Scan QR Code</DialogTitle>
                <DialogDescription>Enter the QR code to pay</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleScanAndPay} className="space-y-4">
                <div className="bg-gray-100 rounded-2xl p-8 text-center">
                  <QrCode className="size-24 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">Camera QR scanning</p>
                  <p className="text-xs text-gray-400">Manual entry available below</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qr-code">QR Code</Label>
                  <Input
                    id="qr-code"
                    placeholder="Paste or enter QR code"
                    className="h-12 rounded-xl"
                    value={scannedCode}
                    onChange={(e) => setScannedCode(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-amount">Amount (TZS)</Label>
                  <Input
                    id="payment-amount"
                    type="number"
                    placeholder="Enter amount (if not preset)"
                    className="h-12 rounded-xl"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">Leave blank if amount is preset in QR code</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-pin">PIN</Label>
                  <Input
                    id="payment-pin"
                    type="password"
                    placeholder="Enter your PIN"
                    className="h-12 rounded-xl"
                    maxLength={4}
                    value={paymentPin}
                    onChange={(e) => setPaymentPin(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl"
                >
                  <CreditCard className="size-5 mr-2" />
                  Pay Now
                </Button>
              </form>
            </>
          ) : (
            <div className="py-8 text-center">
              <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="size-12 text-green-600" />
              </div>
              <h3 className="text-2xl text-gray-900 mb-2">Payment Successful!</h3>
              {paymentDetails && (
                <>
                  <p className="text-gray-500 mb-4">
                    {paymentDetails.recipientName && `Paid to ${paymentDetails.recipientName}`}
                  </p>
                  <div className="text-3xl text-green-600 mb-4">
                    {formatCurrency(paymentDetails.amount)}
                  </div>
                  <p className="text-sm text-gray-500">
                    New Balance: {formatCurrency(paymentDetails.newBalance)}
                  </p>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
