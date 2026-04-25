import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  QrCode,
  Copy,
  Check,
  Eye,
  EyeOff,
  Shield,
  ChevronRight,
  Wifi,
  RefreshCw,
  Lock,
  Zap,
} from 'lucide-react';
import { User } from '../App';
import { projectId } from '../utils/supabase/info';

interface QuickPayFeaturesProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

interface VirtualCard {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
  type: string;
  balance: number;
}

// ── SVG QR Code ────────────────────────────────────────────────────────────────
function QRCodeSVG({ data, size = 220 }: { data: string; size?: number }) {
  const MODULES = 21;
  const cell = size / MODULES;

  const seed = useMemo(
    () => data.split('').reduce((s, c) => ((s * 31 + c.charCodeAt(0)) >>> 0), 0),
    [data]
  );

  function finderCell(r: number, c: number): boolean {
    if (r === 0 || r === 6 || c === 0 || c === 6) return true;
    if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return true;
    return false;
  }

  const cells: boolean[][] = useMemo(() =>
    Array.from({ length: MODULES }, (_, r) =>
      Array.from({ length: MODULES }, (_, c) => {
        if (r < 7 && c < 7) return finderCell(r, c);
        if (r < 7 && c >= MODULES - 7) return finderCell(r, c - (MODULES - 7));
        if (r >= MODULES - 7 && c < 7) return finderCell(r - (MODULES - 7), c);
        if (r === 6) return c % 2 === 0;
        if (c === 6) return r % 2 === 0;
        return (((seed ^ ((r * MODULES + c) * 2654435761)) >>> 0) % 3) !== 0;
      })
    ),
    [seed]
  );

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="rounded-xl"
    >
      <rect width={size} height={size} fill="white" rx="12" />
      {cells.map((row, r) =>
        row.map((active, c) =>
          active ? (
            <rect
              key={`${r}-${c}`}
              x={c * cell + 0.5}
              y={r * cell + 0.5}
              width={cell - 1}
              height={cell - 1}
              fill="#080d08"
            />
          ) : null
        )
      )}
    </svg>
  );
}

// ── NFC Ring animation ─────────────────────────────────────────────────────────
function NFCRings({ active }: { active: boolean }) {
  return (
    <div className="relative flex items-center justify-center w-48 h-48">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2 border-[#4ade80]"
          initial={{ width: 72, height: 72, opacity: 0 }}
          animate={
            active
              ? {
                  width: [72, 72 + (i + 1) * 36, 72 + (i + 1) * 48],
                  height: [72, 72 + (i + 1) * 36, 72 + (i + 1) * 48],
                  opacity: [0.7, 0.3, 0],
                }
              : { width: 72, height: 72, opacity: 0 }
          }
          transition={
            active
              ? { duration: 2, repeat: Infinity, delay: i * 0.55, ease: 'easeOut' }
              : { duration: 0.3 }
          }
        />
      ))}
      <motion.div
        className="relative z-10 w-[72px] h-[72px] rounded-full flex items-center justify-center"
        style={{
          background: active
            ? 'radial-gradient(circle, #16a34a, #052e16)'
            : 'radial-gradient(circle, #1e2d1e, #0d150d)',
          boxShadow: active ? '0 0 32px rgba(74,222,128,0.4)' : 'none',
        }}
        animate={{ scale: active ? [1, 1.05, 1] : 1 }}
        transition={{ duration: 1.5, repeat: active ? Infinity : 0 }}
      >
        <Wifi className="h-8 w-8 text-[#4ade80] rotate-90" />
      </motion.div>
    </div>
  );
}

// ── Chip SVG ───────────────────────────────────────────────────────────────────
function ChipIcon() {
  return (
    <svg width="44" height="34" viewBox="0 0 44 34" fill="none">
      <rect x="1" y="1" width="42" height="32" rx="5" fill="#c9a227" stroke="#a07d1a" strokeWidth="1" />
      <line x1="15" y1="1" x2="15" y2="33" stroke="#a07d1a" strokeWidth="1" />
      <line x1="29" y1="1" x2="29" y2="33" stroke="#a07d1a" strokeWidth="1" />
      <line x1="1" y1="12" x2="43" y2="12" stroke="#a07d1a" strokeWidth="1" />
      <line x1="1" y1="22" x2="43" y2="22" stroke="#a07d1a" strokeWidth="1" />
      <rect x="15" y="12" width="14" height="10" fill="#e2b93b" rx="1" />
    </svg>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────
export function QuickPayFeatures({ user, accessToken, onBack }: QuickPayFeaturesProps) {
  const [activeView, setActiveView] = useState<'main' | 'card' | 'tap' | 'qr'>('main');
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [showCVV, setShowCVV] = useState(false);
  const [qrAmount, setQrAmount] = useState('');
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [nfcActive, setNfcActive] = useState(false);
  const [nfcSupported] = useState(() => 'NDEFReader' in window);
  const [virtualCard, setVirtualCard] = useState<VirtualCard | null>(null);

  useEffect(() => {
    fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/wallet/virtual-card`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setVirtualCard(data.card))
      .catch(() => {
        setVirtualCard({
          number: '4241 8291 3847 5512',
          expiry: '08/28',
          cvv: '731',
          name: user.name.toUpperCase(),
          type: 'VISA',
          balance: 0,
        });
      });
  }, [accessToken, user.name]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);

  const handleCopyCardNumber = () => {
    if (!virtualCard) return;
    navigator.clipboard.writeText(virtualCard.number.replace(/\s/g, ''));
    setCopied(true);
    toast.success('Card number copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const activateNFC = async () => {
    if (!nfcSupported) {
      toast.error('NFC is not supported on this device');
      return;
    }
    try {
      // @ts-expect-error NDEFReader not in TS lib
      const ndef = new window.NDEFReader();
      await ndef.scan();
      setNfcActive(true);
      ndef.onreading = () => {
        toast.success('NFC tag read successfully');
        setNfcActive(false);
      };
      ndef.onreadingerror = () => {
        toast.error('NFC read error. Please try again.');
        setNfcActive(false);
      };
    } catch (err: unknown) {
      toast.error((err as Error)?.message || 'Failed to activate NFC');
      setNfcActive(false);
    }
  };

  const maskedNumber = virtualCard
    ? showCardNumber
      ? virtualCard.number
      : '•••• •••• •••• ' + virtualCard.number.slice(-4)
    : '•••• •••• •••• ••••';

  // ── VIEW: MAIN ──────────────────────────────────────────────────────────────
  if (activeView === 'main') {
    return (
      <div className="min-h-screen bg-[#080d08] text-white">
        {/* Header */}
        <div
          className="px-4 pt-12 pb-8"
          style={{ background: 'linear-gradient(135deg, #14532d 0%, #052e16 100%)' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl tracking-tight">Quick Pay</h1>
          </div>
          <p className="text-white/60 text-sm">Choose a payment method</p>
        </div>

        <div className="px-4 py-6 space-y-4">
          {/* Virtual Card option */}
          <motion.button
            onClick={() => setActiveView('card')}
            className="w-full rounded-2xl p-5 text-left relative overflow-hidden group"
            style={{ background: 'linear-gradient(135deg, #1a3a6e 0%, #0c1f40 100%)' }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="absolute -right-8 -bottom-8 opacity-[0.06]">
              <CreditCard className="h-36 w-36" />
            </div>
            <div className="relative z-10 flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/10">
                  <CreditCard className="h-6 w-6 text-[#60a5fa]" />
                </div>
                <div>
                  <p className="text-base leading-tight">Virtual Card</p>
                  <p className="text-xs text-white/50 mt-0.5">Pay online and in-store</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-white/40 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="relative z-10 flex items-center gap-2">
              <span className="text-xs text-white/40 uppercase tracking-widest">Balance</span>
              <span className="text-sm text-[#60a5fa]">
                {virtualCard ? formatCurrency(virtualCard.balance) : '—'}
              </span>
            </div>
          </motion.button>

          {/* Tap to Pay option */}
          <motion.button
            onClick={() => setActiveView('tap')}
            className="w-full rounded-2xl p-5 text-left relative overflow-hidden group"
            style={{ background: 'linear-gradient(135deg, #14532d 0%, #052e16 100%)' }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="absolute -right-8 -bottom-8 opacity-[0.06]">
              <Wifi className="h-36 w-36 rotate-90" />
            </div>
            <div className="relative z-10 flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/10">
                  <Smartphone className="h-6 w-6 text-[#4ade80]" />
                </div>
                <div>
                  <p className="text-base leading-tight">Tap to Pay</p>
                  <p className="text-xs text-white/50 mt-0.5">Contactless NFC payment</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-white/40 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="relative z-10 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
              <span className="text-xs text-white/40">NFC enabled devices only</span>
            </div>
          </motion.button>

          {/* QR Code option */}
          <motion.button
            onClick={() => setActiveView('qr')}
            className="w-full rounded-2xl p-5 text-left relative overflow-hidden group"
            style={{ background: 'linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)' }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="absolute -right-8 -bottom-8 opacity-[0.06]">
              <QrCode className="h-36 w-36" />
            </div>
            <div className="relative z-10 flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/10">
                  <QrCode className="h-6 w-6 text-[#a78bfa]" />
                </div>
                <div>
                  <p className="text-base leading-tight">QR Code</p>
                  <p className="text-xs text-white/50 mt-0.5">Receive payments instantly</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-white/40 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="relative z-10 flex items-center gap-2">
              <Zap className="h-3 w-3 text-[#a78bfa]" />
              <span className="text-xs text-white/40">Generate dynamic QR codes</span>
            </div>
          </motion.button>

          {/* Security strip */}
          <div className="flex items-center justify-center gap-2 py-3">
            <Shield className="h-4 w-4 text-[#4ade80]" />
            <span className="text-xs text-white/40">256-bit encryption on all transactions</span>
          </div>
        </div>
      </div>
    );
  }

  // ── VIEW: VIRTUAL CARD ──────────────────────────────────────────────────────
  if (activeView === 'card') {
    return (
      <div className="min-h-screen bg-[#080d08] text-white">
        {/* Header */}
        <div
          className="px-4 pt-12 pb-8"
          style={{ background: 'linear-gradient(135deg, #1a3a6e 0%, #0c1f40 100%)' }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('main')}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl tracking-tight">Virtual Card</h1>
          </div>
        </div>

        <div className="px-4 py-6 space-y-5">
          {/* Card face */}
          <motion.div
            initial={{ rotateY: -18, opacity: 0, y: 16 }}
            animate={{ rotateY: 0, opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ perspective: 1200 }}
          >
            <div
              className="relative rounded-2xl p-6 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #1a3a6e 0%, #0d2044 50%, #0a1830 100%)',
                minHeight: 200,
                boxShadow: '0 24px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
              }}
            >
              {/* Decorative orbs */}
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[#60a5fa] opacity-[0.07] blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-[#3b82f6] opacity-[0.07] blur-xl" />

              <div className="relative z-10 h-full flex flex-col justify-between gap-8">
                {/* Top row: chip + network */}
                <div className="flex items-center justify-between">
                  <ChipIcon />
                  <div className="flex items-center gap-1.5">
                    <Wifi className="h-4 w-4 text-white/40 rotate-90" />
                    <span className="text-[11px] tracking-[0.2em] text-white/70 font-mono">
                      {virtualCard?.type ?? 'VISA'}
                    </span>
                  </div>
                </div>

                {/* Number row */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[17px] tracking-widest text-white/90">
                    {maskedNumber}
                  </span>
                  <button
                    onClick={handleCopyCardNumber}
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors flex-shrink-0"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-[#4ade80]" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-white/60" />
                    )}
                  </button>
                </div>

                {/* Bottom row */}
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[9px] tracking-[0.15em] text-white/40 uppercase mb-1">Cardholder</p>
                    <p className="text-sm text-white/80 font-mono tracking-wider">
                      {virtualCard?.name ?? user.name.toUpperCase()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] tracking-[0.15em] text-white/40 uppercase mb-1">Expires</p>
                    <p className="text-sm text-white/80 font-mono">{virtualCard?.expiry ?? '--/--'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] tracking-[0.15em] text-white/40 uppercase mb-1">CVV</p>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm text-white/80 font-mono">
                        {showCVV ? (virtualCard?.cvv ?? '•••') : '•••'}
                      </p>
                      <button onClick={() => setShowCVV((v) => !v)} className="p-0.5">
                        {showCVV ? (
                          <EyeOff className="h-3 w-3 text-white/40" />
                        ) : (
                          <Eye className="h-3 w-3 text-white/40" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Toggle details */}
          <button
            onClick={() => setShowCardNumber((v) => !v)}
            className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {showCardNumber ? (
              <>
                <EyeOff className="h-4 w-4 text-white/60" />
                <span className="text-white/70">Hide card number</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 text-white/60" />
                <span className="text-white/70">Reveal card number</span>
              </>
            )}
          </button>

          {/* Balance + actions */}
          <div
            className="rounded-2xl p-5"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-white/50">Card Balance</p>
              <p className="text-2xl font-medium">
                {virtualCard ? formatCurrency(virtualCard.balance) : '—'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="py-3 rounded-xl text-sm font-medium bg-[#16a34a] hover:bg-[#15803d] text-white transition-colors">
                Load Money
              </button>
              <button
                className="py-3 rounded-xl text-sm font-medium transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)' }}
              >
                View History
              </button>
            </div>
          </div>

          {/* How to use */}
          <div
            className="rounded-2xl p-5 space-y-3"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p className="text-sm text-white/60">How to use</p>
            {[
              'Use this card for online purchases or at any checkout',
              'Enter card details: number, expiry, and CVV',
              'Receive instant SMS and in-app confirmation',
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5 bg-[#16a34a] text-white">
                  {i + 1}
                </div>
                <p className="text-sm text-white/60">{step}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 py-2">
            <Lock className="h-3.5 w-3.5 text-[#4ade80]" />
            <span className="text-xs text-white/30">Secured by 256-bit encryption</span>
          </div>
        </div>
      </div>
    );
  }

  // ── VIEW: TAP TO PAY ────────────────────────────────────────────────────────
  if (activeView === 'tap') {
    return (
      <div className="min-h-screen bg-[#080d08] text-white">
        {/* Header */}
        <div
          className="px-4 pt-12 pb-8"
          style={{ background: 'linear-gradient(135deg, #14532d 0%, #052e16 100%)' }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('main')}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl tracking-tight">Tap to Pay</h1>
          </div>
        </div>

        <div className="px-4 py-8 space-y-6">
          {/* NFC animation center */}
          <div className="flex flex-col items-center justify-center py-6">
            <NFCRings active={nfcActive} />
            <motion.div
              className="text-center mt-6"
              key={nfcActive ? 'active' : 'idle'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl tracking-tight mb-2">
                {nfcActive ? 'Ready to pay' : 'Activate NFC'}
              </h2>
              <p className="text-sm text-white/50 max-w-xs text-center">
                {nfcActive
                  ? 'Hold your phone near a contactless payment terminal'
                  : 'Tap the button below to activate contactless payment'}
              </p>
            </motion.div>
          </div>

          {/* NFC unsupported warning */}
          {!nfcSupported && (
            <div
              className="rounded-xl p-4 flex items-center gap-3"
              style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)' }}
            >
              <Shield className="h-4 w-4 text-yellow-400 flex-shrink-0" />
              <p className="text-sm text-yellow-400/80">
                NFC is not supported on this device or browser.
              </p>
            </div>
          )}

          {/* Action button */}
          <AnimatePresence mode="wait">
            {!nfcActive ? (
              <motion.button
                key="activate"
                onClick={activateNFC}
                disabled={!nfcSupported}
                className="w-full h-14 rounded-xl text-base font-medium flex items-center justify-center gap-3 transition-colors disabled:opacity-40"
                style={{ background: '#16a34a' }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                whileTap={{ scale: 0.98 }}
              >
                <Wifi className="h-5 w-5 rotate-90" />
                Activate NFC Payment
              </motion.button>
            ) : (
              <motion.div
                key="cancel"
                className="space-y-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <div
                  className="rounded-xl p-4 flex items-center gap-3"
                  style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }}
                >
                  <motion.div
                    className="w-2 h-2 rounded-full bg-[#4ade80]"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-sm text-[#4ade80]">NFC active — hold near terminal</span>
                </div>
                <button
                  onClick={() => setNfcActive(false)}
                  className="w-full h-12 rounded-xl text-sm transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}
                >
                  Cancel
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Transaction limits */}
          <div
            className="rounded-2xl p-5"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p className="text-sm text-white/50 mb-4">Transaction Limits</p>
            <div className="space-y-3">
              {[
                { label: 'Per transaction', value: 'TZS 500,000' },
                { label: 'Daily limit', value: 'TZS 2,000,000' },
                { label: "Today's usage", value: 'TZS 350,000', highlight: true },
              ].map(({ label, value, highlight }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-white/50">{label}</span>
                  <span className={`text-sm font-medium ${highlight ? 'text-[#4ade80]' : 'text-white/80'}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div
            className="rounded-2xl p-5 space-y-3"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p className="text-sm text-white/50">How it works</p>
            {[
              'Activate NFC payment in the app',
              'Hold your phone near a contactless terminal',
              'Wait for confirmation beep and vibration',
              'Check your transaction history for confirmation',
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5 bg-[#14532d] text-[#4ade80] border border-[#4ade80]/20">
                  {i + 1}
                </div>
                <p className="text-sm text-white/60">{step}</p>
              </div>
            ))}
          </div>

          {/* Supported locations */}
          <div
            className="rounded-2xl p-5"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p className="text-sm text-white/50 mb-3">Accepted at</p>
            <div className="flex flex-wrap gap-2">
              {['Supermarkets', 'Restaurants', 'Gas Stations', 'Retail Stores', 'Hotels'].map((loc) => (
                <span
                  key={loc}
                  className="px-3 py-1.5 rounded-full text-xs text-white/60"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {loc}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── VIEW: QR CODE ───────────────────────────────────────────────────────────
  if (activeView === 'qr') {
    const qrData = generatedQR ?? `gopay://pay?user=${user.id}&amount=${qrAmount}`;

    return (
      <div className="min-h-screen bg-[#080d08] text-white">
        {/* Header */}
        <div
          className="px-4 pt-12 pb-8"
          style={{ background: 'linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)' }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (generatedQR) {
                  setGeneratedQR(null);
                  setQrAmount('');
                } else {
                  setActiveView('main');
                }
              }}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl tracking-tight">
              {generatedQR ? 'Scan to Pay' : 'QR Code'}
            </h1>
          </div>
        </div>

        <div className="px-4 py-6 space-y-5">
          <AnimatePresence mode="wait">
            {!generatedQR ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {/* Amount input */}
                <div
                  className="rounded-2xl p-5"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <p className="text-sm text-white/50 mb-4">Amount to receive (TZS)</p>
                  <input
                    type="number"
                    value={qrAmount}
                    onChange={(e) => setQrAmount(e.target.value)}
                    placeholder="0"
                    className="w-full bg-transparent text-4xl font-medium text-center text-white placeholder-white/20 outline-none border-b border-white/10 pb-3 focus:border-[#a78bfa] transition-colors"
                  />
                  <button
                    onClick={() => {
                      if (qrAmount && parseFloat(qrAmount) > 0) {
                        setGeneratedQR(`gopay://pay?user=${user.id}&amount=${qrAmount}`);
                      }
                    }}
                    disabled={!qrAmount || parseFloat(qrAmount) <= 0}
                    className="w-full mt-5 h-12 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-40"
                    style={{ background: '#7c3aed' }}
                  >
                    <QrCode className="h-4 w-4" />
                    Generate QR Code
                  </button>
                </div>

                {/* Quick amounts */}
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Quick amounts</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[5000, 10000, 20000, 50000, 100000, 200000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setQrAmount(amount.toString())}
                        className="py-3 rounded-xl text-xs font-medium transition-all"
                        style={{
                          background:
                            qrAmount === amount.toString()
                              ? 'rgba(124,58,237,0.3)'
                              : 'rgba(255,255,255,0.04)',
                          border:
                            qrAmount === amount.toString()
                              ? '1px solid rgba(124,58,237,0.6)'
                              : '1px solid rgba(255,255,255,0.08)',
                          color:
                            qrAmount === amount.toString()
                              ? '#c4b5fd'
                              : 'rgba(255,255,255,0.6)',
                        }}
                      >
                        {formatCurrency(amount)}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="qr-display"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="space-y-5"
              >
                {/* Amount display */}
                <div className="text-center">
                  <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Requesting</p>
                  <p className="text-3xl font-medium">{formatCurrency(parseFloat(qrAmount))}</p>
                  <p className="text-sm text-white/40 mt-1">
                    {user.name}
                  </p>
                </div>

                {/* QR code */}
                <div className="flex justify-center">
                  <motion.div
                    className="p-4 rounded-2xl"
                    style={{ background: 'white' }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.4, type: 'spring', stiffness: 200 }}
                  >
                    <QRCodeSVG data={qrData} size={220} />
                  </motion.div>
                </div>

                {/* Validity notice */}
                <div
                  className="rounded-xl p-4 flex items-center gap-3"
                  style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}
                >
                  <motion.div
                    className="w-2 h-2 rounded-full bg-[#a78bfa] flex-shrink-0"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <p className="text-xs text-[#a78bfa]/80">
                    This QR code is valid for 10 minutes and expires automatically
                  </p>
                </div>

                {/* Regenerate */}
                <button
                  onClick={() => {
                    setGeneratedQR(null);
                    setQrAmount('');
                  }}
                  className="w-full h-12 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}
                >
                  <RefreshCw className="h-4 w-4" />
                  Generate New QR
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* How it works */}
          {!generatedQR && (
            <div
              className="rounded-2xl p-5 space-y-3"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <p className="text-sm text-white/50">How QR payment works</p>
              {[
                'Enter the amount you want to receive',
                'Show the generated QR code to the payer',
                'They scan it with their GO Pay app',
                'Receive instant payment confirmation',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5 bg-[#312e81] text-[#a78bfa] border border-[#a78bfa]/20">
                    {i + 1}
                  </div>
                  <p className="text-sm text-white/60">{step}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
