import { useState, useEffect } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { User } from '../App';
import {
  ArrowLeft, Send, CreditCard, Check, Shield, Users,
  Star, Copy, Share2, RotateCcw
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { PinPad } from './ui/PinPad';

interface SendMoneyPageProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

type TransferMethod = 'gopay' | 'mobile' | 'bank';
type Step = 'send' | 'confirm' | 'success';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 }).format(amount);

const QUICK_AMOUNTS = [5000, 10000, 20000, 50000, 100000, 200000];

const RECENT_CONTACTS = [
  { id: '1', name: 'Sarah Mwamba', phone: '+255712345001', initials: 'SM', gopayUser: true },
  { id: '2', name: 'John Kamau', phone: '+255713456002', initials: 'JK', gopayUser: true },
  { id: '3', name: 'Grace Ndege', phone: '+255714567003', initials: 'GN', gopayUser: false },
  { id: '4', name: 'David Moshi', phone: '+255715678004', initials: 'DM', gopayUser: true },
];

export function SendMoneyPage({ user, accessToken, onBack }: SendMoneyPageProps) {
  const [step, setStep] = useState<Step>('send');
  const [transferMethod, setTransferMethod] = useState<TransferMethod>('gopay');
  const [recipient, setRecipient] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [shakePin, setShakePin] = useState(false);
  const [sending, setSending] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [optimisticBalance, setOptimisticBalance] = useState<number | null>(null);
  const [transactionRef, setTransactionRef] = useState('');
  const { track } = useAnalytics(accessToken);

  useEffect(() => {
    if (!accessToken) return;
    fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/wallet/balance`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { setBalance(data.balance ?? null); setOptimisticBalance(data.balance ?? null); })
      .catch(() => {});
  }, [accessToken]);

  const numericAmount = parseFloat(amount) || 0;
  const fee = transferMethod === 'gopay' ? 0 : transferMethod === 'mobile' ? 1000 : 2000;
  const total = numericAmount + fee;

  const handleSelectContact = (contact: typeof RECENT_CONTACTS[0]) => {
    setRecipient(contact.phone);
    setRecipientName(contact.name);
  };

  const handleProceed = () => {
    if (!recipient.trim()) {
      toast.error('Ingiza namba au chagua mpokeaji');
      return;
    }
    if (numericAmount <= 0) {
      toast.error('Ingiza kiasi cha kutuma');
      return;
    }
    if (balance !== null && total > balance) {
      toast.error('Salio halitosha');
      return;
    }
    track('send_money_started', { method: transferMethod, amount: numericAmount, recipient });
    setStep('confirm');
  };

  const handlePinComplete = async (enteredPin: string) => {
    setPin(enteredPin);
    setPinError('');
    setSending(true);

    // Optimistic balance update
    if (balance !== null) setOptimisticBalance(balance - total);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/transfer/send`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            method: transferMethod,
            recipient,
            amount: numericAmount,
            message: note,
            pin: enteredPin,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setTransactionRef(result.reference || `TXN${Date.now()}`);
        setStep('success');
        track('send_money_completed', { method: transferMethod, amount: numericAmount, recipient });
      } else {
        const err = await response.json().catch(() => ({}));
        const msg = err.error || 'Uhamisho umeshindwa. Jaribu tena.';
        if (balance !== null) setOptimisticBalance(balance);
        setPinError(msg);
        setShakePin(true);
        track('send_money_failed', { method: transferMethod, amount: numericAmount, reason: msg });
        window.dispatchEvent(new CustomEvent('gopay:open-support'));
      }
    } catch {
      if (balance !== null) setOptimisticBalance(balance);
      setPinError('Hitilafu ya mtandao. Jaribu tena.');
      setShakePin(true);
      track('send_money_failed', { method: transferMethod, amount: numericAmount, reason: 'network_error' });
      window.dispatchEvent(new CustomEvent('gopay:open-support'));
    } finally {
      setSending(false);
    }
  };

  const handleReset = () => {
    setPin('');
    setPinError('');
    setShakePin(false);
  };

  const resetAll = () => {
    setStep('send');
    setRecipient('');
    setRecipientName('');
    setAmount('');
    setNote('');
    setPin('');
    setPinError('');
    setTransactionRef('');
    setTransferMethod('gopay');
  };

  return (
    <div className="min-h-screen pb-10" style={{ background: '#080d08' }} role="main" aria-label="Tuma Pesa">
      <AnimatePresence mode="wait">
        {step === 'send' && (
          <motion.div
            key="send"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.22 }}
          >
            {/* Header */}
            <div className="px-5 pt-8 pb-6" style={{
              background: 'linear-gradient(135deg, #14532d 0%, #052e16 100%)'
            }}>
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={onBack}
                  className="p-2.5 rounded-full transition-all active:scale-95"
                  style={{ background: 'rgba(255,255,255,0.15)' }}
                >
                  <ArrowLeft className="size-5 text-white" />
                </button>
                <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#fff' }}>Tuma Pesa</h1>
              </div>

              {/* Balance pill */}
              {balance !== null && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <CreditCard className="size-4 text-white opacity-70" />
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                    Salio: {formatCurrency(optimisticBalance ?? balance)}
                  </span>
                </div>
              )}
            </div>

            <div className="px-5 py-5 space-y-5">
              {/* Recipient */}
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '8px', letterSpacing: '0.3px' }}>
                  MPOKEAJI
                </p>
                <input
                  type="tel"
                  placeholder="+255 XXX XXX XXX au jina"
                  value={recipient}
                  onChange={e => { setRecipient(e.target.value); if (recipientName) setRecipientName(''); }}
                  className="w-full h-12 px-4 rounded-xl outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#fff',
                    fontSize: '15px',
                  }}
                />
              </div>

              {/* Recent Contacts */}
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '10px', letterSpacing: '0.3px' }}>
                  MAWASILIANO YA HIVI KARIBUNI
                </p>
                <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                  {RECENT_CONTACTS.map(c => (
                    <button
                      key={c.id}
                      onClick={() => handleSelectContact(c)}
                      className="flex-shrink-0 flex flex-col items-center gap-1.5 transition-all active:scale-95"
                    >
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold relative"
                        style={{
                          background: recipient === c.phone
                            ? '#16a34a'
                            : 'rgba(255,255,255,0.08)',
                          color: '#fff',
                          border: recipient === c.phone ? '2px solid #4ade80' : '2px solid transparent',
                        }}>
                        {c.initials}
                        {c.gopayUser && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                            style={{ background: '#16a34a', border: '1.5px solid #080d08' }}>
                            <Star className="size-2.5" style={{ color: '#fff', fill: '#fff' }} />
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', textAlign: 'center', maxWidth: '52px', lineHeight: '1.2' }}>
                        {c.name.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '8px', letterSpacing: '0.3px' }}>
                  KIASI
                </p>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                    TZS
                  </span>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="0"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full h-16 pl-16 pr-4 rounded-xl outline-none"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: '#fff',
                      fontSize: '28px',
                      fontWeight: 700,
                      letterSpacing: '-1px',
                    }}
                  />
                </div>

                {/* Quick amounts */}
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {QUICK_AMOUNTS.map(q => (
                    <button
                      key={q}
                      onClick={() => setAmount(String(q))}
                      className="py-2 rounded-xl text-center transition-all active:scale-95"
                      style={{
                        background: amount === String(q)
                          ? 'rgba(22,163,74,0.2)'
                          : 'rgba(255,255,255,0.05)',
                        border: amount === String(q)
                          ? '1px solid rgba(22,163,74,0.4)'
                          : '1px solid rgba(255,255,255,0.08)',
                        fontSize: '12px',
                        color: amount === String(q) ? '#4ade80' : 'rgba(255,255,255,0.6)',
                        fontWeight: 600,
                      }}
                    >
                      {(q / 1000).toFixed(0)}K
                    </button>
                  ))}
                </div>
              </div>

              {/* Transfer method */}
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '8px', letterSpacing: '0.3px' }}>
                  NJIA YA UHAMISHO
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { id: 'gopay', label: 'goPay', fee: 'Bure' },
                    { id: 'mobile', label: 'Mobile Money', fee: '1,000 TZS' },
                    { id: 'bank', label: 'Benki', fee: '2,000 TZS' },
                  ] as const).map(m => (
                    <button
                      key={m.id}
                      onClick={() => setTransferMethod(m.id)}
                      className="p-3 rounded-xl text-center transition-all active:scale-95"
                      style={{
                        background: transferMethod === m.id ? 'rgba(22,163,74,0.15)' : 'rgba(255,255,255,0.04)',
                        border: transferMethod === m.id ? '1px solid rgba(22,163,74,0.4)' : '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      <p style={{ fontSize: '12px', fontWeight: 600, color: transferMethod === m.id ? '#4ade80' : '#fff', marginBottom: '2px' }}>
                        {m.label}
                      </p>
                      <p style={{ fontSize: '10px', color: transferMethod === m.id ? 'rgba(74,222,128,0.7)' : 'rgba(255,255,255,0.4)' }}>
                        {m.fee}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Note (optional) */}
              <div>
                <input
                  type="text"
                  placeholder="Ongeza ujumbe (si lazima)"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  maxLength={80}
                  className="w-full h-11 px-4 rounded-xl outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#fff',
                    fontSize: '14px',
                  }}
                />
              </div>

              {/* Fee preview */}
              {numericAmount > 0 && (
                <div className="rounded-xl p-4"
                  style={{ background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.12)' }}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>Kiasi</span>
                    <span style={{ color: '#fff', fontWeight: 500 }}>{formatCurrency(numericAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>Ada ya huduma</span>
                    <span style={{ color: fee === 0 ? '#4ade80' : '#fff', fontWeight: 500 }}>
                      {fee === 0 ? 'BURE' : formatCurrency(fee)}
                    </span>
                  </div>
                  <div className="h-px my-2" style={{ background: 'rgba(255,255,255,0.08)' }} />
                  <div className="flex justify-between">
                    <span style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}>Jumla</span>
                    <span style={{ color: '#4ade80', fontWeight: 700, fontSize: '14px' }}>{formatCurrency(total)}</span>
                  </div>
                </div>
              )}

              {/* Proceed button */}
              <button
                onClick={handleProceed}
                className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                style={{
                  background: numericAmount > 0 && recipient ? '#16a34a' : 'rgba(255,255,255,0.08)',
                  color: numericAmount > 0 && recipient ? '#fff' : 'rgba(255,255,255,0.3)',
                  fontSize: '15px',
                  fontWeight: 700,
                }}
              >
                <Send className="size-5" />
                Endelea
              </button>
            </div>
          </motion.div>
        )}

        {step === 'confirm' && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.22 }}
            className="px-5"
          >
            {/* Back */}
            <div className="pt-8 pb-6 flex items-center gap-4">
              <button
                onClick={() => setStep('send')}
                className="p-2.5 rounded-full transition-all active:scale-95"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                <ArrowLeft className="size-5 text-white" />
              </button>
              <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#fff' }}>Thibitisha Malipo</h1>
            </div>

            {/* Summary card */}
            <div className="rounded-2xl p-5 mb-5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginBottom: '12px', letterSpacing: '0.3px' }}>
                UNAWEZA KUTUMA
              </p>
              <div className="flex items-baseline gap-2 mb-4">
                <span style={{ fontSize: '40px', fontWeight: 800, color: '#fff', letterSpacing: '-2px' }}>
                  {formatCurrency(numericAmount)}
                </span>
              </div>
              <div className="flex items-center gap-3 py-3"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'rgba(22,163,74,0.2)', color: '#4ade80' }}>
                  {recipientName ? recipientName.slice(0, 2).toUpperCase() : recipient.slice(-2)}
                </div>
                <div>
                  {recipientName && (
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{recipientName}</p>
                  )}
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{recipient}</p>
                </div>
              </div>
            </div>

            {/* Fee breakdown */}
            <div className="rounded-2xl p-4 mb-5 space-y-2.5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>Kiasi cha kutuma</span>
                <span style={{ color: '#fff', fontWeight: 500 }}>{formatCurrency(numericAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>Njia</span>
                <span style={{ color: '#fff', fontWeight: 500 }}>
                  {transferMethod === 'gopay' ? 'goPay Wallet' : transferMethod === 'mobile' ? 'Mobile Money' : 'Benki'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>Ada ya huduma</span>
                <span style={{ color: fee === 0 ? '#4ade80' : '#fff', fontWeight: 500 }}>
                  {fee === 0 ? 'BURE' : formatCurrency(fee)}
                </span>
              </div>
              <div className="h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <div className="flex justify-between">
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>Jumla itakayotolewa</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#4ade80' }}>{formatCurrency(total)}</span>
              </div>
            </div>

            {/* PinPad */}
            <div className="rounded-2xl p-5 mb-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {sending ? (
                <div className="flex flex-col items-center gap-3 py-8">
                  <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: '#16a34a', borderTopColor: 'transparent' }} />
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>Inatuma...</p>
                </div>
              ) : (
                <PinPad
                  length={4}
                  label="Ingiza PIN yako"
                  sublabel="PIN ya tarakimu 4"
                  onComplete={handlePinComplete}
                  onReset={handleReset}
                  error={pinError}
                  shake={shakePin}
                  disabled={sending}
                />
              )}
            </div>

            <div className="flex items-center gap-2 justify-center pb-4">
              <Shield className="size-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
                Malipo yalindwa na encryption ya hali ya juu
              </p>
            </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, type: 'spring', damping: 20 }}
            className="min-h-screen flex flex-col items-center justify-center px-5 pb-10 pt-8"
            role="status"
            aria-live="assertive"
            aria-label="Pesa imetumwa kwa mafanikio"
          >
            {/* Success icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', damping: 15, stiffness: 200 }}
              className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
              style={{ background: 'rgba(22,163,74,0.15)', border: '2px solid rgba(22,163,74,0.3)' }}
            >
              <Check className="size-12" style={{ color: '#4ade80', strokeWidth: 2.5 }} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginBottom: '6px', letterSpacing: '-0.5px' }}>
                Pesa Imetumwa!
              </h2>
              <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)' }}>
                {formatCurrency(numericAmount)} → {recipientName || recipient}
              </p>
            </motion.div>

            {/* Receipt card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="w-full rounded-2xl p-5 mb-6 space-y-3"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="flex justify-between text-sm">
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>Kumbukumbu</span>
                <span style={{ color: '#4ade80', fontWeight: 600, fontFamily: 'monospace' }}>{transactionRef}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>Kiasi</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{formatCurrency(numericAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>Ada</span>
                <span style={{ color: fee === 0 ? '#4ade80' : '#fff', fontWeight: 500 }}>
                  {fee === 0 ? 'BURE' : formatCurrency(fee)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>Wakati</span>
                <span style={{ color: '#fff', fontWeight: 500 }}>{new Date().toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              {note && (
                <>
                  <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>Ujumbe</span>
                    <span style={{ color: '#fff', fontWeight: 500, maxWidth: '60%', textAlign: 'right' }}>{note}</span>
                  </div>
                </>
              )}
            </motion.div>

            {/* New balance pill */}
            {optimisticBalance !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full mb-8"
                style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.15)' }}
              >
                <CreditCard className="size-4" style={{ color: '#4ade80', opacity: 0.7 }} />
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
                  Salio jipya: {formatCurrency(optimisticBalance)}
                </span>
              </motion.div>
            )}

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full space-y-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(transactionRef).then(() => toast.success('Kumbukumbu imenakiliwa!'));
                  }}
                  className="flex items-center justify-center gap-2 h-12 rounded-xl transition-all active:scale-95"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  <Copy className="size-4" />
                  Nakili risiti
                </button>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Risiti ya goPay',
                        text: `Nimetuma ${formatCurrency(numericAmount)} kwa ${recipientName || recipient}. Kumbukumbu: ${transactionRef}`,
                      });
                    } else {
                      toast.info('Shiriki risiti hapatikani kwenye kifaa hiki');
                    }
                  }}
                  className="flex items-center justify-center gap-2 h-12 rounded-xl transition-all active:scale-95"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  <Share2 className="size-4" />
                  Shiriki
                </button>
              </div>

              <button
                onClick={resetAll}
                className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                style={{ background: '#16a34a', color: '#fff', fontSize: '15px', fontWeight: 700 }}
              >
                <RotateCcw className="size-5" />
                Tuma Tena
              </button>

              <button
                onClick={onBack}
                className="w-full h-12 rounded-2xl transition-all active:scale-[0.98]"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                Rudi Nyumbani
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
