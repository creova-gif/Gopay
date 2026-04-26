import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { X, Loader2 } from 'lucide-react';
import { projectId } from '../utils/supabase/info';

type Network = 'mpesa' | 'tigo' | 'airtel' | 'halopesa';

const NETWORKS: { id: Network; label: string; color: string }[] = [
  { id: 'mpesa',    label: 'M-Pesa',       color: '#16a34a' },
  { id: 'tigo',     label: 'Tigo Pesa',    color: '#0ea5e9' },
  { id: 'airtel',   label: 'Airtel Money', color: '#ef4444' },
  { id: 'halopesa', label: 'HaloPesa',     color: '#f97316' },
];

interface WithdrawModalProps {
  open: boolean;
  onClose: () => void;
  accessToken: string;
  userId: string;
  balance: number;
  onSuccess: () => void;
}

export function WithdrawModal({ open, onClose, accessToken, balance, onSuccess }: WithdrawModalProps) {
  const [network, setNetwork] = useState<Network | null>(null);
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingRef, setPendingRef] = useState<string | null>(null);

  const numericAmount = parseFloat(amount) || 0;
  const canSubmit =
    network !== null &&
    numericAmount > 0 &&
    numericAmount <= balance &&
    phone.trim().length >= 10 &&
    !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/payment/withdraw`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({ network, amount: numericAmount, phone }),
        },
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message ?? 'Imeshindwa. Jaribu tena.');
        return;
      }
      setPendingRef(data.providerRef);
      toast.info('Fedha zinatumwa...', { duration: 10000 });
    } catch {
      toast.error('Hitilafu ya mtandao. Jaribu tena.');
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setNetwork(null);
    setAmount('');
    setPhone('');
    setPendingRef(null);
  };

  const handleDone = () => {
    onSuccess();
    resetState();
    onClose();
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const formatBalance = (n: number) =>
    new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 }).format(n);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60" onClick={handleClose} />
          <motion.div
            className="relative w-full max-w-md rounded-t-3xl p-6 pb-10 space-y-5"
            style={{ background: '#0f1a0f', border: '1px solid rgba(255,255,255,0.1)' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            {pendingRef ? (
              <div className="text-center py-6 space-y-4">
                <p style={{ color: '#4ade80', fontWeight: 700, fontSize: '18px' }}>Inatumwa</p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
                  Fedha zinatumwa kwa {phone}
                </p>
                <button
                  onClick={handleDone}
                  className="w-full h-12 rounded-xl font-semibold text-white"
                  style={{ background: '#16a34a' }}
                >
                  Sawa
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '18px' }}>Toa Fedha</h2>
                  <button onClick={handleClose} aria-label="Ghairi">
                    <X className="size-5 text-white opacity-60" />
                  </button>
                </div>

                <div className="px-4 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Salio linalopatikana</p>
                  <p style={{ color: '#4ade80', fontWeight: 700, fontSize: '18px' }}>{formatBalance(balance)}</p>
                </div>

                <div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '10px', letterSpacing: '0.3px' }}>
                    CHAGUA MTANDAO
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {NETWORKS.map(n => (
                      <button
                        key={n.id}
                        onClick={() => setNetwork(n.id)}
                        className="h-10 rounded-xl text-sm font-semibold transition-all"
                        style={{
                          background: network === n.id ? n.color : 'rgba(255,255,255,0.06)',
                          color: '#fff',
                          border: `1px solid ${network === n.id ? n.color : 'rgba(255,255,255,0.1)'}`,
                        }}
                      >
                        {n.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '8px', letterSpacing: '0.3px' }}>
                    NAMBA YA SIMU
                  </p>
                  <input
                    type="tel"
                    placeholder="Namba ya simu (+255...)"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '15px' }}
                  />
                </div>

                <div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '8px', letterSpacing: '0.3px' }}>
                    KIASI (TZS)
                  </p>
                  <input
                    type="number"
                    placeholder="Kiasi cha kutoa"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl outline-none"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: `1px solid ${numericAmount > balance && numericAmount > 0 ? '#ef4444' : 'rgba(255,255,255,0.12)'}`,
                      color: '#fff',
                      fontSize: '16px',
                    }}
                  />
                  {numericAmount > balance && numericAmount > 0 && (
                    <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>Salio halitosha</p>
                  )}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="w-full h-12 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-opacity"
                  style={{ background: canSubmit ? '#16a34a' : 'rgba(255,255,255,0.1)', opacity: canSubmit ? 1 : 0.5 }}
                  aria-label="Thibitisha"
                >
                  {loading ? <Loader2 className="size-4 animate-spin" /> : 'Thibitisha'}
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
