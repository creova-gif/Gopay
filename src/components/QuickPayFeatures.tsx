import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  CreditCard,
  Smartphone,
  QrCode,
  Copy,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  ArrowLeft,
  Wifi,
  Zap,
  Share2,
  RefreshCw,
  Plus,
  ArrowUpRight,
  Shield,
  Sparkles,
  Radio
} from 'lucide-react';
import { User } from '../App';
import { projectId } from '../utils/supabase/info';

interface QuickPayFeaturesProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 }).format(amount);

/* ── Tiny deterministic QR-like SVG from a string ──────────────────────── */
function QRPattern({ data, size = 200 }: { data: string; size?: number }) {
  const modules = 21;
  const cell = size / modules;

  // Simple hash to seed the data pattern
  let h = 0;
  for (let i = 0; i < data.length; i++) {
    h = (h * 31 + data.charCodeAt(i)) >>> 0;
  }

  const isFinderPattern = (r: number, c: number) => {
    const inFinder = (rr: number, cc: number) =>
      rr >= 0 && rr < 7 && cc >= 0 && cc < 7;
    return (
      inFinder(r, c) ||
      inFinder(r, c - (modules - 7)) ||
      inFinder(r - (modules - 7), c)
    );
  };

  const isTiming = (r: number, c: number) =>
    (r === 6 && c >= 8 && c <= modules - 9) ||
    (c === 6 && r >= 8 && r <= modules - 9);

  const cells: { r: number; c: number; dark: boolean }[] = [];
  let seed = h;
  const next = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed; };

  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      let dark = false;
      if (isFinderPattern(r, c)) {
        // 7×7 outer, 5×5 inner white, 3×3 black centre
        const inCorner = (rr: number, cc: number) => {
          if (rr < 0 || rr >= 7 || cc < 0 || cc >= 7) return false;
          if (rr === 0 || rr === 6 || cc === 0 || cc === 6) return true;
          if (rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4) return true;
          return false;
        };
        dark =
          inCorner(r, c) ||
          inCorner(r, c - (modules - 7)) ||
          inCorner(r - (modules - 7), c);
      } else if (isTiming(r, c)) {
        dark = (r + c) % 2 === 0;
      } else {
        dark = (next() & 1) === 1;
      }
      cells.push({ r, c, dark });
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
      <rect width={size} height={size} fill="white" rx="8" />
      {cells.map(({ r, c, dark }) =>
        dark ? (
          <rect
            key={`${r}-${c}`}
            x={c * cell + 0.5}
            y={r * cell + 0.5}
            width={cell - 1}
            height={cell - 1}
            rx={cell * 0.15}
            fill="#111827"
          />
        ) : null
      )}
    </svg>
  );
}

/* ── Virtual Card Visual ─────────────────────────────────────────────────── */
function CardFace({ card, show }: { card: { number: string; expiry: string; cvv: string; name: string; type: string }; show: boolean }) {
  return (
    <div className="relative w-full rounded-[20px] overflow-hidden shadow-2xl" style={{ aspectRatio: '1.586' }}>
      {/* Background gradient */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #533483 100%)' }} />

      {/* Holographic shimmer overlay */}
      <div className="absolute inset-0 opacity-30"
        style={{ background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.05) 25%, rgba(120,100,255,0.1) 50%, rgba(255,255,255,0.05) 75%, transparent 100%)' }} />

      {/* Card circles decoration */}
      <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.8), transparent)' }} />
      <div className="absolute -left-8 -bottom-8 w-36 h-36 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, rgba(100,120,255,0.8), transparent)' }} />

      <div className="relative z-10 h-full flex flex-col justify-between p-5">
        {/* Top row: chip + type */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* SIM chip */}
            <div className="w-10 h-8 rounded-md border border-yellow-400/60 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #d4a017, #f5c842, #d4a017)' }}>
              <div className="grid grid-cols-2 gap-px w-5 h-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="rounded-sm" style={{ background: 'rgba(0,0,0,0.3)' }} />
                ))}
              </div>
            </div>
            {/* Contactless */}
            <Wifi className="text-white/70 rotate-90" size={18} />
          </div>
          <div className="text-right">
            <div className="text-white font-black text-lg tracking-wider">{card.type}</div>
            <div className="flex items-center justify-end gap-1 mt-0.5">
              <div className="w-4 h-4 rounded-full opacity-80" style={{ background: '#EB001B' }} />
              <div className="w-4 h-4 rounded-full -ml-2 opacity-80" style={{ background: '#F79E1B' }} />
            </div>
          </div>
        </div>

        {/* Card number */}
        <div>
          <p className="text-white/50 text-xs mb-1 tracking-widest uppercase">Card Number</p>
          <div className="flex items-center gap-1">
            <p className="text-white font-mono text-base tracking-widest">
              {show ? card.number : '•••• •••• •••• ' + card.number.slice(-4)}
            </p>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/50 text-xs tracking-widest uppercase">Cardholder</p>
            <p className="text-white font-semibold text-sm mt-0.5">{card.name}</p>
          </div>
          <div className="text-center">
            <p className="text-white/50 text-xs tracking-widest uppercase">Expires</p>
            <p className="text-white font-semibold text-sm mt-0.5">{card.expiry}</p>
          </div>
          <div className="text-center">
            <p className="text-white/50 text-xs tracking-widest uppercase">CVV</p>
            <p className="text-white font-semibold text-sm mt-0.5">{show ? card.cvv : '•••'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────────────────── */
export function QuickPayFeatures({ user, accessToken, onBack }: QuickPayFeaturesProps) {
  const [activeView, setActiveView] = useState<'main' | 'card' | 'tap' | 'qr'>('main');
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [nfcActive, setNfcActive] = useState(false);
  const [nfcSupported] = useState(() => 'NDEFReader' in window);
  const [qrAmount, setQrAmount] = useState('');
  const [generatedQR, setGeneratedQR] = useState(false);
  const [qrTimer, setQrTimer] = useState(600); // 10 min
  const [cardBalance] = useState(850000);
  const [virtualCard, setVirtualCard] = useState<{
    number: string; expiry: string; cvv: string; name: string; type: string;
  }>({
    number: '4276 8831 4521 7890',
    expiry: '09/28',
    cvv: '731',
    name: user.name.toUpperCase(),
    type: 'VISA',
  });

  // QR countdown timer
  useEffect(() => {
    if (!generatedQR) return;
    setQrTimer(600);
    const interval = setInterval(() => {
      setQrTimer(t => {
        if (t <= 1) { clearInterval(interval); setGeneratedQR(false); return 600; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [generatedQR]);

  useEffect(() => {
    fetch(`https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/wallet/virtual-card`,
      { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { if (data.card) setVirtualCard({ ...data.card, name: user.name.toUpperCase() }); })
      .catch(() => {});
  }, [accessToken]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(virtualCard.number.replace(/\s/g, ''));
    setCopied(true);
    toast.success('Card number copied!');
    setTimeout(() => setCopied(false), 2500);
  }, [virtualCard.number]);

  const activateNFC = async () => {
    if (!nfcSupported) { toast.error('NFC not supported on this device'); return; }
    try {
      // @ts-expect-error NDEFReader not in TS lib
      const ndef = new window.NDEFReader();
      await ndef.scan();
      setNfcActive(true);
      ndef.onreading = () => { toast.success('Payment successful!'); setNfcActive(false); };
      ndef.onreadingerror = () => { toast.error('NFC read error — try again'); setNfcActive(false); };
    } catch (err: unknown) {
      toast.error((err as Error)?.message || 'Failed to activate NFC');
      setNfcActive(false);
    }
  };

  const qrData = `gopay://pay?to=${user.id}&amount=${qrAmount}&name=${encodeURIComponent(user.name)}`;
  const timerMin = Math.floor(qrTimer / 60);
  const timerSec = qrTimer % 60;

  /* ── MAIN VIEW ── */
  if (activeView === 'main') {
    return (
      <div className="min-h-screen pb-24" style={{ background: '#080d08' }}>
        {/* Header */}
        <div className="sticky top-0 z-20 px-4 py-4" style={{ background: 'rgba(8,13,8,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2.5 rounded-full active:scale-95" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <ArrowLeft className="size-5 text-white" />
            </button>
            <div className="flex-1">
              <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>Quick Pay</h1>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Malipo ya haraka</p>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full" style={{ background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.2)' }}>
              <Shield className="size-3" style={{ color: '#4ade80' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#4ade80' }}>Salama</span>
            </div>
          </div>
        </div>

        <div className="px-4 py-5 space-y-4">
          {/* Wallet Balance Chip */}
          <div className="rounded-2xl p-4 flex items-center gap-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
              <Sparkles className="size-6 text-white" />
            </div>
            <div className="flex-1">
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Salio la Pochi</p>
              <p style={{ fontSize: '22px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>{formatCurrency(cardBalance)}</p>
            </div>
            <button className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-bold" style={{ background: '#16a34a', color: '#fff' }}>
              <Plus className="size-4" />
              Ongeza
            </button>
          </div>

          {/* Payment Method Cards */}
          {/* 1 — Virtual Card */}
          <button onClick={() => setActiveView('card')} className="w-full text-left group">
            <div className="relative rounded-3xl p-6 overflow-hidden transition-all active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2d6a4f 100%)', border: '1px solid rgba(100,150,255,0.15)' }}>
              <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #93c5fd, transparent)' }} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                      <CreditCard className="size-6 text-white" />
                    </div>
                    <div>
                      <p style={{ fontSize: '17px', fontWeight: 800, color: '#fff' }}>Kadi ya Dijitali</p>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Virtual Card</p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-white/60 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Salio</p>
                    <p style={{ fontSize: '20px', fontWeight: 900, color: '#fff' }}>{formatCurrency(cardBalance)}</p>
                  </div>
                  <div className="flex gap-1">
                    {['VISA', 'MASTERCARD'].map(t => (
                      <span key={t} className="px-2 py-1 rounded-lg text-xs font-bold" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </button>

          {/* 2 — Tap to Pay */}
          <button onClick={() => setActiveView('tap')} className="w-full text-left group">
            <div className="relative rounded-3xl p-6 overflow-hidden transition-all active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #4a1d96 0%, #7c3aed 100%)', border: '1px solid rgba(167,139,250,0.15)' }}>
              <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #c4b5fd, transparent)' }} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                      <Radio className="size-6 text-white" />
                    </div>
                    <div>
                      <p style={{ fontSize: '17px', fontWeight: 800, color: '#fff' }}>Gusa Kulipa</p>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Tap to Pay · NFC</p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-white/60 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: nfcSupported ? '#a78bfa' : '#6b7280' }} />
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                    {nfcSupported ? 'NFC inafanya kazi' : 'NFC haifanyi kazi kwenye kifaa hiki'}
                  </p>
                </div>
              </div>
            </div>
          </button>

          {/* 3 — QR Code */}
          <button onClick={() => setActiveView('qr')} className="w-full text-left group">
            <div className="relative rounded-3xl p-6 overflow-hidden transition-all active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #052e16 0%, #14532d 100%)', border: '1px solid rgba(74,222,128,0.15)' }}>
              <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #86efac, transparent)' }} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                      <QrCode className="size-6 text-white" />
                    </div>
                    <div>
                      <p style={{ fontSize: '17px', fontWeight: 800, color: '#fff' }}>Msimbo wa QR</p>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>QR Code · Pokea Malipo</p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-white/60 group-hover:translate-x-1 transition-transform" />
                </div>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Unda QR ya kupokea pesa — inaisha baada ya dakika 10</p>
              </div>
            </div>
          </button>

          {/* Benefits footer */}
          <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { icon: Zap, label: 'Papo hapo', sub: 'Instant' },
                { icon: Shield, label: 'Salama', sub: '256-bit SSL' },
                { icon: RefreshCw, label: 'Bila mtandao', sub: 'Offline' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center gap-1.5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(22,163,74,0.12)' }}>
                    <Icon className="size-4" style={{ color: '#4ade80' }} />
                  </div>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>{label}</p>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── VIRTUAL CARD VIEW ── */
  if (activeView === 'card') {
    return (
      <div className="min-h-screen pb-24" style={{ background: '#080d08' }}>
        {/* Header */}
        <div className="sticky top-0 z-20 px-4 py-4" style={{ background: 'rgba(8,13,8,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveView('main')} className="p-2.5 rounded-full active:scale-95" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <ArrowLeft className="size-5 text-white" />
            </button>
            <div className="flex-1">
              <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>Kadi ya Dijitali</h1>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Virtual Card</p>
            </div>
            <button onClick={handleCopy} className="p-2.5 rounded-full active:scale-95" style={{ background: 'rgba(255,255,255,0.08)' }}>
              {copied ? <Check className="size-5" style={{ color: '#4ade80' }} /> : <Copy className="size-5 text-white" />}
            </button>
          </div>
        </div>

        <div className="px-4 py-5 space-y-5">
          {/* Card */}
          <CardFace card={virtualCard} show={showCardDetails} />

          {/* Toggle details */}
          <button
            onClick={() => setShowCardDetails(v => !v)}
            className="w-full h-12 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all active:scale-[0.98]"
            style={{ background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {showCardDetails ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            {showCardDetails ? 'Ficha Maelezo' : 'Onyesha Maelezo ya Kadi'}
          </button>

          {/* Balance & Actions */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Salio la Kadi</p>
                <p style={{ fontSize: '26px', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>{formatCurrency(cardBalance)}</p>
              </div>
              <ArrowUpRight className="size-6" style={{ color: '#4ade80' }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                style={{ background: '#16a34a', color: '#fff' }}>
                <Plus className="size-4" />
                Ongeza Pesa
              </button>
              <button className="h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                <ArrowUpRight className="size-4" />
                Historia
              </button>
            </div>
          </div>

          {/* Card actions */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Nakili Nambari', icon: Copy, action: handleCopy },
              { label: 'Shiriki Kadi', icon: Share2, action: () => toast.info('Sharing...') },
            ].map(({ label, icon: Icon, action }) => (
              <button key={label} onClick={action} className="h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-[0.98]"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Icon className="size-5 text-white/70" />
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>{label}</span>
              </button>
            ))}
          </div>

          {/* How to use */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.12)' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#93c5fd', marginBottom: '12px' }}>Jinsi ya Kutumia</h3>
            <div className="space-y-3">
              {[
                'Tumia kadi hii kwa manunuzi mtandaoni',
                'Weka maelezo ya kadi kwenye mfumo wa malipo',
                'Pokea uthibitisho wa malipo mara moja',
              ].map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black"
                    style={{ background: 'rgba(59,130,246,0.25)', color: '#93c5fd', marginTop: '1px' }}>
                    {i + 1}
                  </div>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: '#4ade80' }} />
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Inalindwa na usimbaji wa 256-bit SSL</p>
          </div>
        </div>
      </div>
    );
  }

  /* ── TAP TO PAY VIEW ── */
  if (activeView === 'tap') {
    return (
      <div className="min-h-screen pb-24" style={{ background: '#080d08' }}>
        <div className="sticky top-0 z-20 px-4 py-4" style={{ background: 'rgba(8,13,8,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveView('main')} className="p-2.5 rounded-full active:scale-95" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <ArrowLeft className="size-5 text-white" />
            </button>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>Gusa Kulipa</h1>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Tap to Pay · NFC</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-8 space-y-6">
          {/* NFC Animation */}
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative">
              {/* Ripple rings when active */}
              {nfcActive && (
                <>
                  <div className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(139,92,246,0.2)', animationDuration: '1.5s' }} />
                  <div className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(139,92,246,0.15)', animationDuration: '2s', animationDelay: '0.5s' }} />
                  <div className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(139,92,246,0.1)', animationDuration: '2.5s', animationDelay: '1s' }} />
                </>
              )}
              <div className="relative w-40 h-40 rounded-full flex items-center justify-center"
                style={{ background: nfcActive ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'linear-gradient(135deg, #4a1d96, #5b21b6)', boxShadow: nfcActive ? '0 0 40px rgba(167,139,250,0.4)' : 'none', transition: 'all 0.5s ease' }}>
                <Smartphone className="size-16 text-white" />
              </div>
            </div>

            <div className="mt-8 text-center">
              <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#fff', marginBottom: '8px' }}>
                {nfcActive ? 'Iko Tayari!' : 'Washa NFC'}
              </h2>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', maxWidth: '240px' }}>
                {nfcActive
                  ? 'Gusa simu yako karibu na mfumo wa malipo'
                  : 'Washa malipo ya NFC ili kuanza'}
              </p>
            </div>
          </div>

          {/* NFC not supported warning */}
          {!nfcSupported && (
            <div className="rounded-2xl p-4 flex gap-3" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)' }}>
              <Zap className="size-5 flex-shrink-0 mt-0.5" style={{ color: '#fbbf24' }} />
              <p style={{ fontSize: '13px', color: '#fbbf24', lineHeight: 1.5 }}>NFC haifanyi kazi kwenye kifaa hiki au kivinjari. Tumia njia nyingine ya malipo.</p>
            </div>
          )}

          {/* Action button */}
          {!nfcActive ? (
            <button
              onClick={activateNFC}
              disabled={!nfcSupported}
              className="w-full h-14 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff' }}>
              <Radio className="size-5" />
              Washa Malipo ya NFC
            </button>
          ) : (
            <div className="space-y-3">
              <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.15)' }}>
                <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: '#4ade80' }} />
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#4ade80' }}>NFC Inafanya Kazi — Gusa Mfumo</p>
              </div>
              <button
                onClick={() => setNfcActive(false)}
                className="w-full h-12 rounded-2xl font-bold text-sm transition-all active:scale-[0.98]"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                Ghairi
              </button>
            </div>
          )}

          {/* Limits */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>Mipaka ya Malipo</h3>
            <div className="space-y-3">
              {[
                { label: 'Kwa kila malipo', value: 'TZS 500,000' },
                { label: 'Kikomo cha siku', value: 'TZS 2,000,000' },
                { label: 'Imetumika leo', value: 'TZS 350,000', accent: '#4ade80' },
              ].map(({ label, value, accent }) => (
                <div key={label} className="flex justify-between">
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{label}</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: accent || '#fff' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Supported merchants */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.12)' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#c4b5fd', marginBottom: '10px' }}>Inakubaliwa Mahali</h3>
            <div className="flex flex-wrap gap-2">
              {['Supermarkets', 'Migahawa', 'Maduka', 'Vituo vya Mafuta', 'Mahoteli', 'Hospitali'].map(place => (
                <span key={place} className="px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(139,92,246,0.15)', color: '#c4b5fd' }}>{place}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── QR CODE VIEW ── */
  if (activeView === 'qr') {
    return (
      <div className="min-h-screen pb-24" style={{ background: '#080d08' }}>
        <div className="sticky top-0 z-20 px-4 py-4" style={{ background: 'rgba(8,13,8,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => { setActiveView('main'); setGeneratedQR(false); setQrAmount(''); }}
              className="p-2.5 rounded-full active:scale-95" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <ArrowLeft className="size-5 text-white" />
            </button>
            <div className="flex-1">
              <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>Msimbo wa QR</h1>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Pokea malipo kwa QR code</p>
            </div>
            {generatedQR && (
              <button onClick={() => toast.info('Kugawana QR...')} className="p-2.5 rounded-full active:scale-95" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <Share2 className="size-5 text-white" />
              </button>
            )}
          </div>
        </div>

        <div className="px-4 py-5 space-y-5">
          {!generatedQR ? (
            <>
              {/* Amount input */}
              <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '8px' }}>
                  Kiasi unachotaka kupokea
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>TZS</span>
                  <input
                    type="number"
                    value={qrAmount}
                    onChange={e => setQrAmount(e.target.value)}
                    placeholder="0"
                    className="w-full h-16 pl-14 pr-4 rounded-xl border-0 focus:outline-none text-2xl font-bold text-center text-white"
                    style={{ background: 'rgba(255,255,255,0.06)', caretColor: '#4ade80' }}
                  />
                </div>
              </div>

              {/* Quick amounts */}
              <div>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '10px' }}>Kiasi cha haraka:</p>
                <div className="grid grid-cols-3 gap-2">
                  {[5000, 10000, 20000, 50000, 100000, 200000].map(amt => (
                    <button key={amt} onClick={() => setQrAmount(amt.toString())}
                      className="h-11 rounded-xl text-sm font-bold transition-all active:scale-95"
                      style={{
                        background: qrAmount === amt.toString() ? 'rgba(22,163,74,0.2)' : 'rgba(255,255,255,0.04)',
                        border: qrAmount === amt.toString() ? '1.5px solid #16a34a' : '1px solid rgba(255,255,255,0.08)',
                        color: qrAmount === amt.toString() ? '#4ade80' : 'rgba(255,255,255,0.6)',
                      }}>
                      {formatCurrency(amt)}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => { if (qrAmount && parseFloat(qrAmount) > 0) setGeneratedQR(true); }}
                disabled={!qrAmount || parseFloat(qrAmount) <= 0}
                className="w-full h-14 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', color: '#fff' }}>
                <QrCode className="size-5" />
                Tengeneza QR Code
              </button>
            </>
          ) : (
            <>
              {/* Generated QR */}
              <div className="flex flex-col items-center py-4">
                {/* Amount display */}
                <div className="mb-5 text-center">
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Unataka kupokea</p>
                  <p style={{ fontSize: '36px', fontWeight: 900, color: '#fff', letterSpacing: '-1.5px' }}>{formatCurrency(parseFloat(qrAmount))}</p>
                </div>

                {/* QR Code */}
                <div className="p-4 rounded-[24px] shadow-2xl" style={{ background: '#fff', border: '4px solid #16a34a' }}>
                  <QRPattern data={qrData} size={220} />
                </div>

                {/* Timer */}
                <div className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.2)' }}>
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#4ade80' }} />
                  <p style={{ fontSize: '13px', fontWeight: 700, color: '#4ade80' }}>
                    Inaisha baada ya {timerMin}:{timerSec.toString().padStart(2, '0')}
                  </p>
                </div>

                {/* Name */}
                <p className="mt-3 text-center" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
                  Pokea kwa: <span style={{ fontWeight: 700, color: '#fff' }}>{user.name}</span>
                </p>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => { setGeneratedQR(false); setQrAmount(''); }}
                  className="h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  style={{ background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <RefreshCw className="size-4" />
                  QR Mpya
                </button>
                <button onClick={() => toast.info('Kushiriki...')}
                  className="h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  style={{ background: '#16a34a', color: '#fff' }}>
                  <Share2 className="size-4" />
                  Shiriki
                </button>
              </div>

              {/* How it works */}
              <div className="rounded-2xl p-5" style={{ background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.1)' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#86efac', marginBottom: '10px' }}>Jinsi Inavyofanya Kazi</h3>
                <div className="space-y-2.5">
                  {[
                    'Onyesha QR code hii kwa mlipaji',
                    'Mlipaji ascanishe kwa app yake ya goPay',
                    'Utapata uthibitisho wa malipo papo hapo',
                  ].map((step, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black"
                        style={{ background: 'rgba(22,163,74,0.2)', color: '#86efac' }}>{i + 1}</span>
                      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
}
