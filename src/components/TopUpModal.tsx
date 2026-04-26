import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { X, Loader2 } from 'lucide-react';
import { projectId } from '../utils/supabase/info';

type Network = 'mpesa' | 'tigo' | 'airtel' | 'halopesa' | 'card';

const NETWORKS: { id: Network; label: string; color: string }[] = [
  { id: 'mpesa',    label: 'M-Pesa',       color: '#16a34a' },
  { id: 'tigo',     label: 'Tigo Pesa',    color: '#0ea5e9' },
  { id: 'airtel',   label: 'Airtel Money', color: '#ef4444' },
  { id: 'halopesa', label: 'HaloPesa',     color: '#f97316' },
  { id: 'card',     label: 'Card',         color: '#8b5cf6' },
];

const QUICK_AMOUNTS = [5000, 10000, 20000, 50000, 100000];

interface TopUpModalProps {
  open: boolean;
  onClose: () => void;
  accessToken: string;
  userId: string;
  onSuccess: () => void;
}

export function TopUpModal({ open, onClose, accessToken, onSuccess }: TopUpModalProps) {
  const [network, setNetwork] = useState<Network | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingRef, setPendingRef] = useState<string | null>(null);

  const numericAmount = parseFloat(amount) || 0;
  const canSubmit = network !== null && numericAmount > 0 && !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/payment/topup`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({ network, amount: numericAmount }),
        },
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message ?? 'Imeshindwa. Jaribu tena.');
        return;
      }
      setPendingRef(data.providerRef);
      toast.info('Angalia simu yako kukamilisha malipo...', { duration: 10000 });
    } catch {
      toast.error('Hitilafu ya mtandao. Jaribu tena.');
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    onSuccess();
    onClose();
    setNetwork(null);
    setAmount('');
    setPendingRef(null);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
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
                <p style={{ color: '#4ade80', fontWeight: 700, fontSize: '18px' }}>Angalia simu yako</p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
                  Ombi limetumwa. Thibitisha kwenye simu yako.
                </p>
                <button
                  onClick={handleDone}
                  className="w-full h-12 rounded-xl font-semibold text-white"
                  style={{ background: '#16a34a' }}
                >
                  Nimemaliza
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '18px' }}>Weka Fedha</h2>
                  <button onClick={onClose} aria-label="Ghairi">
                    <X className="size-5 text-white opacity-60" />
                  </button>
                </div>

                <div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '10px', letterSpacing: '0.3px' }}>
                    CHAGUA MTANDAO
                  </p>
                  <div className="grid grid-cols-3 gap-2">
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
                    KIASI (TZS)
                  </p>
                  <input
                    type="number"
                    placeholder="Kiasi"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '16px' }}
                  />
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {QUICK_AMOUNTS.map(a => (
                      <button
                        key={a}
                        onClick={() => setAmount(String(a))}
                        className="px-3 h-7 rounded-full text-xs"
                        style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}
                      >
                        {(a / 1000).toFixed(0)}k
                      </button>
                    ))}
                  </div>
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
