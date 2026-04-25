import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User } from '../App';
import { ArrowLeft, QrCode, Camera, Flashlight, Image, AlertCircle, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface QRScannerProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

export function QRScanner({ user, accessToken, onBack }: QRScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [pinAttempts, setPinAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);

  // Simulate QR scan
  const handleScanDemo = () => {
    setScanning(true);
    setTimeout(() => {
      setScannedData({
        merchantName: 'Shoppers Plaza Masaki',
        merchantId: 'MERCHANT_001',
        accountNumber: '+255 712 345 678',
        type: 'merchant'
      });
      setScanning(false);
    }, 2000);
  };

  const handlePayment = () => {
    if (lockedUntil && Date.now() < lockedUntil) {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
      toast.error(`Too many incorrect attempts. Try again in ${remaining}s`);
      return;
    }

    if (!amount || pin.length !== 4) {
      toast.error('Please enter amount and 4-digit PIN');
      return;
    }

    const newAttempts = pinAttempts + 1;
    if (newAttempts >= 5) {
      setPinAttempts(0);
      setLockedUntil(Date.now() + 30000);
      setPin('');
      toast.error('Too many attempts. Locked for 30 seconds.');
      return;
    }
    setPinAttempts(newAttempts);

    setTimeout(() => {
      setShowSuccess(true);
      setPinAttempts(0);
      setLockedUntil(null);
    }, 1000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="size-10 text-green-600" />
          </motion.div>
          
          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-gray-500 mb-6">Your payment has been processed</p>
          
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 mb-6 text-white">
            <div className="text-4xl mb-3">🏪</div>
            <div className="text-3xl font-bold mb-2">{formatCurrency(parseInt(amount))}</div>
            <p className="text-green-100 text-sm mb-4">Paid to {scannedData?.merchantName}</p>
            <div className="bg-white/20 rounded-xl p-3 text-left space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Reference:</span>
                <span className="font-mono">QR{Date.now()}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{new Date().toLocaleString('en-TZ')}</span>
              </div>
            </div>
          </div>

          <Button
            onClick={onBack}
            className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full"
          >
            Done
          </Button>
        </motion.div>
      </div>
    );
  }

  if (scannedData) {
    return (
      <div className="min-h-screen bg-gray-50 pb-6">
        <div className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 px-4 pt-6 pb-8 rounded-b-3xl shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setScannedData(null)}
              className="bg-white/20 p-3 rounded-full hover:bg-white/30 transition-all"
            >
              <ArrowLeft className="size-5 text-white" />
            </button>
            <h1 className="text-2xl text-white">Pay Merchant</h1>
          </div>
        </div>

        <div className="px-4 -mt-2 space-y-4">
          {/* Merchant Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-3xl">
                🏪
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold">{scannedData.merchantName}</h3>
                <p className="text-sm text-gray-500">ID: {scannedData.merchantId}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <Check className="size-5 text-green-600" />
              </div>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-xs text-green-700 mb-1">Verified Merchant</p>
              <p className="text-sm text-gray-700">Licensed by BOT • Secure payment</p>
            </div>
          </motion.div>

          {/* Amount Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <Label htmlFor="amount" className="text-base mb-3 block">Enter Amount</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">TZS</span>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-center text-3xl h-16 pl-20 font-bold"
              />
            </div>
          </motion.div>

          {/* PIN Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <Label htmlFor="pin" className="text-base mb-3 block">Enter PIN</Label>
            <Input
              id="pin"
              type="password"
              placeholder="••••"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              className="text-center text-2xl tracking-widest h-16"
            />
          </motion.div>

          {/* Pay Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              onClick={handlePayment}
              disabled={!amount || pin.length !== 4}
              className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full text-lg disabled:opacity-50"
            >
              Pay {amount ? formatCurrency(parseInt(amount)) : 'Now'}
            </Button>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-blue-50 rounded-2xl p-4"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="size-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 font-semibold mb-1">Secure Payment</p>
                <p className="text-xs text-blue-700">
                  This payment is encrypted and protected by Bank of Tanzania regulations.
                  Always verify merchant details before paying.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all"
          >
            <ArrowLeft className="size-6 text-white" />
          </button>
          <h1 className="text-white text-lg font-semibold">Scan QR Code</h1>
          <button className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all">
            <Flashlight className="size-6 text-white" />
          </button>
        </div>
      </div>

      {/* Scanner Frame */}
      <div className="absolute inset-0 flex items-center justify-center">
        {scanning ? (
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="relative"
          >
            <div className="w-64 h-64 border-4 border-green-500 rounded-3xl" />
            <motion.div
              animate={{ y: [0, 240, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-2 left-0 right-0 h-1 bg-green-500"
            />
          </motion.div>
        ) : (
          <div className="relative">
            <div className="w-64 h-64 border-4 border-white/50 rounded-3xl relative">
              {/* Corner Brackets */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white rounded-tl-3xl" />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white rounded-tr-3xl" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white rounded-bl-3xl" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white rounded-br-3xl" />
              
              {/* Center QR Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <QrCode className="size-20 text-white/30" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 bg-gradient-to-t from-black to-transparent">
        <div className="max-w-md mx-auto text-center mb-6">
          <p className="text-white text-lg mb-2">
            {scanning ? 'Scanning QR code...' : 'Position QR code in the frame'}
          </p>
          <p className="text-white/70 text-sm">
            Make sure the QR code is well lit and in focus
          </p>
        </div>

        {/* Action Buttons */}
        <div className="max-w-md mx-auto space-y-3">
          <Button
            onClick={handleScanDemo}
            disabled={scanning}
            className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full text-lg disabled:opacity-50"
          >
            {scanning ? 'Scanning...' : 'Scan QR Code (Demo)'}
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-white/30 transition-all">
              <Image className="size-6 text-white" />
              <span className="text-white text-sm">From Gallery</span>
            </button>
            <button className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-white/30 transition-all">
              <QrCode className="size-6 text-white" />
              <span className="text-white text-sm">My QR Code</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
