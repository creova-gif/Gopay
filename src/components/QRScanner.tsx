import { useState } from 'react';
import { toast } from 'sonner';
import { User } from '../App';
import { ArrowLeft, QrCode, Flashlight, Image, AlertCircle, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface QRScannerProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 }).format(n);

export function QRScanner({ user, accessToken, onBack }: QRScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [pinAttempts, setPinAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);

  const handleScanDemo = () => {
    setScanning(true);
    setTimeout(() => {
      setScannedData({ merchantName: 'Shoppers Plaza Masaki', merchantId: 'MERCHANT_001', accountNumber: '+255 712 345 678', type: 'merchant' });
      setScanning(false);
    }, 2000);
  };

  const handlePayment = () => {
    if (lockedUntil && Date.now() < lockedUntil) {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
      toast.error(`Majaribio mengi. Jaribu tena baada ya sekunde ${remaining}`);
      return;
    }
    if (!amount || pin.length !== 4) {
      toast.error('Ingiza kiasi na PIN ya tarakimu 4');
      return;
    }
    const newAttempts = pinAttempts + 1;
    if (newAttempts >= 5) {
      setPinAttempts(0);
      setLockedUntil(Date.now() + 30000);
      setPin('');
      toast.error('Majaribio mengi. Imefungwa kwa sekunde 30.');
      return;
    }
    setPinAttempts(newAttempts);
    setTimeout(() => {
      setShowSuccess(true);
      setPinAttempts(0);
      setLockedUntil(null);
    }, 1000);
  };

  // ── SUCCESS ──
  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#080d08' }}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full rounded-3xl p-8 text-center"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
          >
            <Check className="size-10 text-white" />
          </motion.div>

          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>Malipo Yamefanikiwa!</h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '24px' }}>Malipo yako yameshughulikiwa</p>

          <div className="rounded-2xl p-6 mb-6" style={{ background: 'linear-gradient(135deg, #14532d, #052e16)', border: '1px solid rgba(74,222,128,0.15)' }}>
            <div className="text-4xl mb-3">🏪</div>
            <div style={{ fontSize: '32px', fontWeight: 900, color: '#fff', letterSpacing: '-1.5px', marginBottom: '6px' }}>
              {formatCurrency(parseInt(amount))}
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>
              Umelipa {scannedData?.merchantName}
            </p>
            <div className="rounded-xl p-3 text-left space-y-2" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="flex justify-between">
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Rejeleo:</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff', fontFamily: 'monospace' }}>QR{Date.now()}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Tarehe:</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{new Date().toLocaleString('sw-TZ')}</span>
              </div>
            </div>
          </div>

          <button onClick={onBack}
            className="w-full h-12 rounded-2xl font-bold transition-all active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', color: '#fff', fontSize: '15px' }}>
            Imekamilika
          </button>
        </motion.div>
      </div>
    );
  }

  // ── PAYMENT FORM ──
  if (scannedData) {
    return (
      <div className="min-h-screen pb-8" style={{ background: '#080d08' }}>
        <div className="px-4 pt-6 pb-8" style={{ background: 'linear-gradient(135deg, #14532d 0%, #052e16 100%)' }}>
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => setScannedData(null)}
              className="p-2.5 rounded-full active:scale-95" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <ArrowLeft className="size-5 text-white" />
            </button>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>Lipa Mfanyabiashara</h1>
          </div>
        </div>

        <div className="px-4 -mt-2 space-y-4">
          {/* Merchant Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-5"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
                🏪
              </div>
              <div className="flex-1">
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>{scannedData.merchantName}</h3>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>ID: {scannedData.merchantId}</p>
              </div>
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.25)' }}>
                <Check className="size-5" style={{ color: '#4ade80' }} />
              </div>
            </div>
            <div className="rounded-xl p-3" style={{ background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.12)' }}>
              <p style={{ fontSize: '11px', color: '#4ade80', marginBottom: '2px' }}>Mfanyabiashara Aliyethibitishwa</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Alipewa leseni na BOT • Malipo salama</p>
            </div>
          </motion.div>

          {/* Amount Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl p-5"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '8px' }}>
              Ingiza Kiasi
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>TZS</span>
              <input
                type="number"
                placeholder="0"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full h-16 pl-16 pr-4 rounded-xl border-0 focus:outline-none text-3xl font-bold text-white text-center"
                style={{ background: 'rgba(255,255,255,0.06)', caretColor: '#4ade80' }}
              />
            </div>
          </motion.div>

          {/* PIN Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl p-5"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '8px' }}>
              Ingiza PIN
            </label>
            <input
              type="password"
              placeholder="••••"
              maxLength={4}
              value={pin}
              onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
              className="w-full h-16 rounded-xl border-0 focus:outline-none text-2xl text-white text-center"
              style={{ background: 'rgba(255,255,255,0.06)', caretColor: '#4ade80', letterSpacing: '0.5rem' }}
            />
          </motion.div>

          {/* Pay Button */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <button
              onClick={handlePayment}
              disabled={!amount || pin.length !== 4}
              className="w-full h-14 rounded-2xl text-base font-bold transition-all active:scale-[0.98] disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', color: '#fff' }}>
              Lipa {amount ? formatCurrency(parseInt(amount)) : 'Sasa'}
            </button>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl p-4"
            style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.12)' }}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="size-5 flex-shrink-0 mt-0.5" style={{ color: '#60a5fa' }} />
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '3px' }}>Malipo Salama</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
                  Malipo haya yamesimbwa na kulindwa na kanuni za Benki ya Tanzania. Hakisha daima maelezo ya mfanyabiashara kabla ya kulipa.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── SCANNER VIEW (already dark bg-black) ──
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-3 rounded-full transition-all active:scale-95" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
            <ArrowLeft className="size-6 text-white" />
          </button>
          <h1 className="text-white text-lg font-semibold">Skani QR Code</h1>
          <button className="p-3 rounded-full transition-all active:scale-95" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
            <Flashlight className="size-6 text-white" />
          </button>
        </div>
      </div>

      {/* Scanner Frame */}
      <div className="absolute inset-0 flex items-center justify-center">
        {scanning ? (
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="relative"
          >
            <div className="w-64 h-64 border-4 border-green-500 rounded-3xl" />
            <motion.div
              animate={{ y: [0, 240, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-2 left-0 right-0 h-0.5"
              style={{ background: 'linear-gradient(90deg, transparent, #16a34a, transparent)' }}
            />
          </motion.div>
        ) : (
          <div className="relative">
            <div className="w-64 h-64 rounded-3xl relative" style={{ border: '2px solid rgba(255,255,255,0.3)' }}>
              {/* Corner Brackets */}
              {[['top-0 left-0', 'border-t-4 border-l-4 rounded-tl-3xl'], ['top-0 right-0', 'border-t-4 border-r-4 rounded-tr-3xl'], ['bottom-0 left-0', 'border-b-4 border-l-4 rounded-bl-3xl'], ['bottom-0 right-0', 'border-b-4 border-r-4 rounded-br-3xl']].map(([pos, cls], i) => (
                <div key={i} className={`absolute ${pos} w-12 h-12 border-white ${cls}`} />
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                <QrCode className="size-20" style={{ color: 'rgba(255,255,255,0.2)' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Panel */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)' }}>
        <div className="max-w-md mx-auto text-center mb-6">
          <p className="text-white text-base mb-1 font-medium">
            {scanning ? 'Inaskani QR code...' : 'Weka QR code ndani ya fremu'}
          </p>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
            Hakikisha QR code ina mwanga mzuri na iko wazi
          </p>
        </div>

        <div className="max-w-md mx-auto space-y-3">
          <button
            onClick={handleScanDemo}
            disabled={scanning}
            className="w-full h-14 rounded-2xl font-bold text-base transition-all active:scale-[0.98] disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', color: '#fff' }}>
            {scanning ? 'Inaskani...' : 'Skani QR Code (Demo)'}
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 rounded-2xl flex flex-col items-center gap-2 transition-all active:scale-95"
              style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
              <Image className="size-6 text-white" />
              <span className="text-white text-sm font-medium">Kutoka Picha</span>
            </button>
            <button className="p-4 rounded-2xl flex flex-col items-center gap-2 transition-all active:scale-95"
              style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
              <QrCode className="size-6 text-white" />
              <span className="text-white text-sm font-medium">QR Code Yangu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
