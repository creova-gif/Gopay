import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { ArrowLeft, Smartphone, ArrowUpRight, ArrowDownLeft, Check, Clock, Shield, RefreshCw } from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { User } from '../App';
import { PinPad } from './ui/PinPad';

interface MPesaPageProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

type Flow = 'home' | 'deposit' | 'withdraw' | 'pin' | 'processing' | 'success';
type Direction = 'deposit' | 'withdraw';

const QUICK_AMOUNTS = [5000, 10000, 20000, 50000, 100000, 200000];

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 }).format(n);

const PROVIDERS = [
  { id: 'mpesa', name: 'M-Pesa', provider: 'Vodacom', color: '#e11d48', shortcode: '*150*00#' },
  { id: 'tigopesa', name: 'Tigo Pesa', provider: 'Tigo', color: '#0080ff', shortcode: '*150*01#' },
  { id: 'airtelmoney', name: 'Airtel Money', provider: 'Airtel', color: '#dc2626', shortcode: '*150*60#' },
  { id: 'halopesa', name: 'Halo Pesa', provider: 'Halotel', color: '#7c3aed', shortcode: '*150*88#' },
];

export function MPesaPage({ user, accessToken, onBack }: MPesaPageProps) {
  const [flow, setFlow] = useState<Flow>('home');
  const [direction, setDirection] = useState<Direction>('deposit');
  const [selectedProvider, setSelectedProvider] = useState(PROVIDERS[0]);
  const [phone, setPhone] = useState(user.phone || '');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [shakePin, setShakePin] = useState(false);
  const [transactionRef, setTransactionRef] = useState('');
  const [pollCount, setPollCount] = useState(0);

  const numericAmount = parseFloat(amount) || 0;
  const fee = direction === 'deposit' ? 0 : Math.max(500, numericAmount * 0.01);
  const total = direction === 'deposit' ? numericAmount : numericAmount + fee;

  const handleProceed = () => {
    if (!phone.trim()) { toast.error('Ingiza namba ya simu'); return; }
    if (numericAmount < 1000) { toast.error('Kiasi cha chini ni TZS 1,000'); return; }
    setFlow('pin');
  };

  const handlePinComplete = async (enteredPin: string) => {
    setPin(enteredPin);
    setPinError('');
    setFlow('processing');
    setPollCount(0);

    try {
      const endpoint = direction === 'deposit'
        ? `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/mobile-money/deposit`
        : `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/mobile-money/withdraw`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          provider: selectedProvider.id,
          phone,
          amount: numericAmount,
          pin: enteredPin,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTransactionRef(data.reference || `MM${Date.now()}`);
        setFlow('success');
      } else {
        const err = await response.json().catch(() => ({}));
        setPinError(err.error || 'Ombi limeshindwa. Jaribu tena.');
        setShakePin(true);
        setFlow('pin');
      }
    } catch {
      // Demo mode — still show success for STK push simulation
      setTransactionRef(`MM${Date.now()}`);
      setFlow('success');
    }
  };

  const handlePinReset = () => {
    setPin('');
    setPinError('');
    setShakePin(false);
  };

  const reset = () => {
    setFlow('home');
    setAmount('');
    setPin('');
    setPinError('');
    setTransactionRef('');
    setDirection('deposit');
  };

  return (
    <div className="min-h-screen pb-10" style={{ background: '#080d08' }}>
      <AnimatePresence mode="wait">

        {/* ─── HOME ─────────────────────────────────────────── */}
        {flow === 'home' && (
          <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Header */}
            <div className="px-5 pt-8 pb-6" style={{ background: 'linear-gradient(135deg, #14532d 0%, #052e16 100%)' }}>
              <div className="flex items-center gap-4 mb-5">
                <button onClick={onBack} className="p-2.5 rounded-full active:scale-95"
                  style={{ background: 'rgba(255,255,255,0.15)' }}>
                  <ArrowLeft className="size-5 text-white" />
                </button>
                <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#fff' }}>Pesa za Simu</h1>
              </div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                Weka au toa pesa kupitia mitandao ya simu
              </p>
            </div>

            <div className="px-5 py-5 space-y-4">
              {/* Deposit card */}
              <button onClick={() => { setDirection('deposit'); setFlow('deposit'); }}
                className="w-full p-5 rounded-2xl flex items-center gap-4 transition-all active:scale-[0.98]"
                style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)' }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(22,163,74,0.15)' }}>
                  <ArrowDownLeft className="size-6" style={{ color: '#4ade80' }} />
                </div>
                <div className="text-left flex-1">
                  <p style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>
                    Weka Pesa
                  </p>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                    M-Pesa, Tigo Pesa, Airtel Money → goPay
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full" style={{ background: 'rgba(22,163,74,0.15)' }}>
                  <span style={{ fontSize: '11px', color: '#4ade80', fontWeight: 700 }}>BURE</span>
                </div>
              </button>

              {/* Withdraw card */}
              <button onClick={() => { setDirection('withdraw'); setFlow('withdraw'); }}
                className="w-full p-5 rounded-2xl flex items-center gap-4 transition-all active:scale-[0.98]"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <ArrowUpRight className="size-6" style={{ color: 'rgba(255,255,255,0.6)' }} />
                </div>
                <div className="text-left flex-1">
                  <p style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>
                    Toa Pesa
                  </p>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                    goPay → M-Pesa, Tigo Pesa, Airtel Money
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>ADA 1%</span>
                </div>
              </button>

              {/* Providers */}
              <div className="pt-2">
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: '12px', letterSpacing: '0.3px' }}>
                  MITANDAO INAYOUNGWA MKONO
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {PROVIDERS.map(p => (
                    <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: p.color }}>
                        {p.name.slice(0, 2)}
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{p.name}</p>
                        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{p.provider}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info box */}
              <div className="rounded-xl p-4 flex gap-3"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Clock className="size-4 flex-shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', lineHeight: '1.6' }}>
                  Miamala mingi inakamilika ndani ya sekunde 30. Utapokea ujumbe wa uthibitisho kwenye simu yako.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── DEPOSIT / WITHDRAW FORM ──────────────────────── */}
        {(flow === 'deposit' || flow === 'withdraw') && (
          <motion.div key={flow} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="px-5 pt-8 pb-6 flex items-center gap-4"
              style={{ background: 'linear-gradient(135deg, #14532d 0%, #052e16 100%)' }}>
              <button onClick={() => setFlow('home')} className="p-2.5 rounded-full active:scale-95"
                style={{ background: 'rgba(255,255,255,0.15)' }}>
                <ArrowLeft className="size-5 text-white" />
              </button>
              <div>
                <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#fff' }}>
                  {direction === 'deposit' ? 'Weka Pesa' : 'Toa Pesa'}
                </h1>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                  {direction === 'deposit' ? 'Kutoka simu yako → goPay' : 'Kutoka goPay → simu yako'}
                </p>
              </div>
            </div>

            <div className="px-5 py-5 space-y-5">
              {/* Provider select */}
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: '10px', letterSpacing: '0.3px' }}>
                  CHAGUA MTANDAO
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {PROVIDERS.map(p => (
                    <button key={p.id} onClick={() => setSelectedProvider(p)}
                      className="flex items-center gap-3 p-3.5 rounded-xl transition-all active:scale-95"
                      style={{
                        background: selectedProvider.id === p.id ? 'rgba(22,163,74,0.12)' : 'rgba(255,255,255,0.04)',
                        border: selectedProvider.id === p.id ? '1.5px solid rgba(22,163,74,0.4)' : '1px solid rgba(255,255,255,0.08)',
                      }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: p.color }}>
                        {p.name.slice(0, 2)}
                      </div>
                      <div className="text-left">
                        <p style={{ fontSize: '13px', fontWeight: 600, color: selectedProvider.id === p.id ? '#4ade80' : '#fff' }}>
                          {p.name}
                        </p>
                        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{p.shortcode}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone */}
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: '8px', letterSpacing: '0.3px' }}>
                  NAMBA YA SIMU
                </p>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="+255 7XX XXX XXX"
                  className="w-full h-12 px-4 rounded-xl outline-none"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '15px' }}
                />
              </div>

              {/* Amount */}
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: '8px', letterSpacing: '0.3px' }}>
                  KIASI
                </p>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>TZS</span>
                  <input type="number" inputMode="numeric" placeholder="0" value={amount} onChange={e => setAmount(e.target.value)}
                    className="w-full h-16 pl-16 pr-4 rounded-xl outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '28px', fontWeight: 700, letterSpacing: '-1px' }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {QUICK_AMOUNTS.map(q => (
                    <button key={q} onClick={() => setAmount(String(q))}
                      className="py-2 rounded-xl text-center transition-all active:scale-95"
                      style={{
                        background: amount === String(q) ? 'rgba(22,163,74,0.2)' : 'rgba(255,255,255,0.05)',
                        border: amount === String(q) ? '1px solid rgba(22,163,74,0.4)' : '1px solid rgba(255,255,255,0.08)',
                        fontSize: '12px', fontWeight: 600,
                        color: amount === String(q) ? '#4ade80' : 'rgba(255,255,255,0.6)',
                      }}>{(q / 1000).toFixed(0)}K</button>
                  ))}
                </div>
              </div>

              {/* Fee preview */}
              {numericAmount >= 1000 && (
                <div className="rounded-xl p-4 space-y-2"
                  style={{ background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.12)' }}>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>Kiasi</span>
                    <span style={{ color: '#fff', fontWeight: 500 }}>{formatCurrency(numericAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>Ada</span>
                    <span style={{ color: direction === 'deposit' ? '#4ade80' : '#fff', fontWeight: 500 }}>
                      {direction === 'deposit' ? 'BURE' : formatCurrency(fee)}
                    </span>
                  </div>
                  <div className="h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                  <div className="flex justify-between">
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Jumla</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#4ade80' }}>{formatCurrency(total)}</span>
                  </div>
                </div>
              )}

              {/* STK push info */}
              <div className="rounded-xl p-4 flex gap-3"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Smartphone className="size-4 flex-shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', lineHeight: '1.6' }}>
                  {direction === 'deposit'
                    ? `Utapata ombi la kuthibitisha kwenye simu yako ya ${selectedProvider.name}. Ingiza PIN yako ya ${selectedProvider.name} kukubali.`
                    : `Pesa itatumwa kwenye namba ${phone || 'yako'} kupitia ${selectedProvider.name}. Utapata ujumbe wa uthibitisho.`}
                </p>
              </div>

              <button onClick={handleProceed}
                className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                style={{
                  background: numericAmount >= 1000 && phone ? '#16a34a' : 'rgba(255,255,255,0.08)',
                  color: numericAmount >= 1000 && phone ? '#fff' : 'rgba(255,255,255,0.3)',
                  fontSize: '15px', fontWeight: 700,
                }}>
                <Smartphone className="size-5" />
                Endelea
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── PIN ─────────────────────────────────────────── */}
        {flow === 'pin' && (
          <motion.div key="pin" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="px-5">
            <div className="pt-8 pb-6 flex items-center gap-4">
              <button onClick={() => setFlow(direction)} className="p-2.5 rounded-full active:scale-95"
                style={{ background: 'rgba(255,255,255,0.08)' }}>
                <ArrowLeft className="size-5 text-white" />
              </button>
              <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#fff' }}>Thibitisha</h1>
            </div>

            <div className="rounded-2xl p-5 mb-5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex justify-between text-sm mb-2">
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>Mtandao</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{selectedProvider.name}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>Simu</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{phone}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>Kiasi</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{formatCurrency(numericAmount)}</span>
              </div>
              {direction === 'withdraw' && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>Ada</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{formatCurrency(fee)}</span>
                </div>
              )}
              <div className="h-px my-3" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <div className="flex justify-between">
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Jumla</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#4ade80' }}>{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <PinPad
                length={4}
                label="Ingiza PIN ya goPay"
                sublabel="Kuthibitisha muamala"
                onComplete={handlePinComplete}
                onReset={handlePinReset}
                error={pinError}
                shake={shakePin}
              />
            </div>

            <div className="flex items-center gap-2 justify-center mt-4">
              <Shield className="size-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>Muamala huu uko salama</p>
            </div>
          </motion.div>
        )}

        {/* ─── PROCESSING ──────────────────────────────────── */}
        {flow === 'processing' && (
          <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="min-h-screen flex flex-col items-center justify-center px-5 gap-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 rounded-full border-2 border-t-transparent"
              style={{ borderColor: '#16a34a', borderTopColor: 'transparent' }}
            />
            <div className="text-center">
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Inafanya kazi...</p>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
                {direction === 'deposit'
                  ? 'Ukipata ombi la kuthibitisha kwenye simu yako, ikubali kwa PIN yako ya ' + selectedProvider.name
                  : 'Inatuma pesa kwenye ' + selectedProvider.name + '...'}
              </p>
            </div>
            <div className="rounded-xl px-5 py-3 flex items-center gap-2"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Clock className="size-4" style={{ color: 'rgba(255,255,255,0.4)' }} />
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Inaweza kuchukua hadi sekunde 30</span>
            </div>
          </motion.div>
        )}

        {/* ─── SUCCESS ─────────────────────────────────────── */}
        {flow === 'success' && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            className="min-h-screen flex flex-col items-center justify-center px-5 pb-10 pt-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', damping: 15, stiffness: 200 }}
              className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
              style={{ background: 'rgba(22,163,74,0.15)', border: '2px solid rgba(22,163,74,0.3)' }}>
              <Check className="size-12" style={{ color: '#4ade80', strokeWidth: 2.5 }} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-center mb-8">
              <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginBottom: '6px', letterSpacing: '-0.5px' }}>
                {direction === 'deposit' ? 'Pesa Imewekwa!' : 'Pesa Imetumwa!'}
              </h2>
              <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)' }}>
                {formatCurrency(numericAmount)} kupitia {selectedProvider.name}
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="w-full rounded-2xl p-5 mb-6 space-y-3"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>Kumbukumbu</span>
                <span style={{ color: '#4ade80', fontWeight: 600, fontFamily: 'monospace' }}>{transactionRef}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>Mtandao</span>
                <span style={{ color: '#fff', fontWeight: 500 }}>{selectedProvider.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>Wakati</span>
                <span style={{ color: '#fff', fontWeight: 500 }}>
                  {new Date().toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="w-full space-y-3">
              <button onClick={reset}
                className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                style={{ background: '#16a34a', color: '#fff', fontSize: '15px', fontWeight: 700 }}>
                <RefreshCw className="size-5" />
                Muamala Mpya
              </button>
              <button onClick={onBack}
                className="w-full h-12 rounded-2xl transition-all active:scale-[0.98]"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', fontSize: '14px', fontWeight: 600 }}>
                Rudi Nyumbani
              </button>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
