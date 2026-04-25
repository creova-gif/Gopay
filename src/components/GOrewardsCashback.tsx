import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { ArrowLeft, Gift, TrendingUp, Check, Clock, Star, ChevronRight, Zap, Coffee, Plane, Hotel, Users } from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { User } from '../App';

interface GOrewardsCashbackProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

interface CashbackOffer {
  id: string;
  merchant: string;
  category: string;
  pct: number;
  maxTZS: number;
  icon: typeof Coffee;
  color: string;
  expires: string;
  used?: boolean;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 }).format(n);

const OFFERS: CashbackOffer[] = [
  { id: '1', merchant: 'Restoranti zote', category: 'Chakula', pct: 5, maxTZS: 5000, icon: Coffee, color: '#f97316', expires: '2025-05-31' },
  { id: '2', merchant: 'Precision Air', category: 'Usafiri', pct: 3, maxTZS: 15000, icon: Plane, color: '#3b82f6', expires: '2025-06-15' },
  { id: '3', merchant: 'Hoteli Tanzania', category: 'Malazi', pct: 4, maxTZS: 20000, icon: Hotel, color: '#8b5cf6', expires: '2025-05-30' },
  { id: '4', merchant: 'Malipo ya bili', category: 'Huduma', pct: 2, maxTZS: 3000, icon: Zap, color: '#eab308', expires: '2025-12-31' },
  { id: '5', merchant: 'Alika marafiki', category: 'Mapato', pct: 0, maxTZS: 1000, icon: Users, color: '#22c55e', expires: '2025-12-31', used: false },
];

const HISTORY = [
  { id: 'h1', desc: 'Muamala wa TANESCO', amount: 800, date: '2025-04-24', status: 'credited' },
  { id: 'h2', desc: 'Chakula – The Slipway', amount: 1250, date: '2025-04-23', status: 'credited' },
  { id: 'h3', desc: 'Safari ya ndege', amount: 4500, date: '2025-04-20', status: 'credited' },
  { id: 'h4', desc: 'Inalipiwa', amount: 3200, date: '2025-04-28', status: 'pending' },
];

export function GOrewardsCashback({ user, accessToken, onBack }: GOrewardsCashbackProps) {
  const [cashbackBalance, setCashbackBalance] = useState(12750);
  const [lifetimeCashback, setLifetimeCashback] = useState(47300);
  const [loading, setLoading] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [activeTab, setActiveTab] = useState<'offers' | 'history'>('offers');

  useEffect(() => {
    setLoading(true);
    fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/rewards/cashback`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        if (data.cashbackBalance) setCashbackBalance(data.cashbackBalance);
        if (data.lifetimeCashback) setLifetimeCashback(data.lifetimeCashback);
      })
      .catch(() => {/* use defaults */})
      .finally(() => setLoading(false));
  }, [accessToken]);

  const handleRedeem = async () => {
    if (cashbackBalance < 500) {
      toast.error('Unahitaji angalau TZS 500 kuomba mkopo');
      return;
    }
    setRedeeming(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/rewards/redeem`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({ amount: cashbackBalance }),
        }
      );
      if (response.ok) {
        toast.success(`${formatCurrency(cashbackBalance)} imeongezwa kwenye pochi yako!`);
        setCashbackBalance(0);
      } else {
        toast.error('Imeshindwa. Jaribu tena.');
      }
    } catch {
      // Demo
      toast.success(`${formatCurrency(cashbackBalance)} imeongezwa kwenye pochi yako!`);
      setCashbackBalance(0);
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <div className="min-h-screen pb-10" style={{ background: '#080d08' }}>
      {/* Header */}
      <div className="px-5 pt-8 pb-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #14532d 0%, #052e16 100%)' }}>
        <div className="absolute top-0 right-0 w-48 h-48 blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.4), transparent 70%)' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={onBack} className="p-2.5 rounded-full active:scale-95"
              style={{ background: 'rgba(255,255,255,0.15)' }}>
              <ArrowLeft className="size-5 text-white" />
            </button>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#fff' }}>GOrewards</h1>
          </div>

          {/* Cashback balance card */}
          <div className="rounded-3xl p-6"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '8px' }}>
              CASHBACK INAYOSUBIRI
            </p>
            {loading ? (
              <div className="h-12 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.1)' }} />
            ) : (
              <div className="flex items-baseline gap-2 mb-4">
                <span style={{ fontSize: '42px', fontWeight: 900, color: '#fff', letterSpacing: '-2px', lineHeight: 1 }}>
                  {formatCurrency(cashbackBalance)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Jumla ya maisha yote</p>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#4ade80' }}>{formatCurrency(lifetimeCashback)}</p>
              </div>
              <button
                onClick={handleRedeem}
                disabled={redeeming || cashbackBalance < 500}
                className="px-5 py-2.5 rounded-xl transition-all active:scale-95 disabled:opacity-40"
                style={{ background: '#fff', color: '#16a34a', fontSize: '13px', fontWeight: 700 }}>
                {redeeming ? 'Inatoa...' : 'Toa Sasa'}
              </button>
            </div>

            {cashbackBalance < 500 && (
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '8px' }}>
                Unahitaji TZS 500 zaidi kuweza kutoa
              </p>
            )}
          </div>
        </div>
      </div>

      {/* How it works strip */}
      <div className="mx-5 mt-4 rounded-2xl p-4 flex items-center gap-3"
        style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.15)' }}>
        <Gift className="size-5 flex-shrink-0" style={{ color: '#4ade80' }} />
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5' }}>
          Pata <strong style={{ color: '#4ade80' }}>2–5% cashback</strong> kwa kila malipo — hakuna pointi, hakuna muda wa kusubiri. Pesa halisi inawekwa moja kwa moja.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex mx-5 mt-4 rounded-2xl p-1 gap-1"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
        {(['offers', 'history'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="flex-1 py-2.5 rounded-xl transition-all text-sm font-semibold"
            style={{
              background: activeTab === tab ? '#16a34a' : 'transparent',
              color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.4)',
            }}>
            {tab === 'offers' ? 'Ofa za Cashback' : 'Historia'}
          </button>
        ))}
      </div>

      <div className="px-5 py-4 space-y-3">
        {activeTab === 'offers' && (
          <>
            {OFFERS.map((offer, i) => {
              const Icon = offer.icon;
              return (
                <motion.div key={offer.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-2xl p-4 flex items-center gap-4"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${offer.color}20`, border: `1px solid ${offer.color}30` }}>
                    <Icon className="size-6" style={{ color: offer.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{offer.merchant}</p>
                      {offer.pct > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                          style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80' }}>
                          {offer.pct}%
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                      {offer.pct > 0
                        ? `Hadi ${formatCurrency(offer.maxTZS)} cashback · ${offer.category}`
                        : `${formatCurrency(offer.maxTZS)} kwa kila rafiki aliyejisajili`}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Star className="size-4" style={{ color: 'rgba(255,255,255,0.2)' }} />
                    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>
                      {new Date(offer.expires).toLocaleDateString('sw-TZ', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </motion.div>
              );
            })}

            <div className="rounded-2xl p-5 space-y-3"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.3px' }}>
                KIWANGO CHA CASHBACK KWA DARAJA
              </p>
              {[
                { tier: 'Bronze', rate: '1%', extra: '' },
                { tier: 'Silver', rate: '2%', extra: '' },
                { tier: 'Gold', rate: '3%', extra: '+ 1% ya ziada ya mwezi' },
                { tier: 'Platinum', rate: '5%', extra: '+ 2% ya ziada + ofa za VIP' },
              ].map(t => (
                <div key={t.tier} className="flex items-center justify-between py-2"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div>
                    <span style={{ fontSize: '13px', color: '#fff', fontWeight: 500 }}>{t.tier}</span>
                    {t.extra && <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>{t.extra}</p>}
                  </div>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#4ade80' }}>{t.rate}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'history' && (
          <>
            {HISTORY.map((h, i) => (
              <motion.div key={h.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-4 p-4 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: h.status === 'credited' ? 'rgba(22,163,74,0.12)' : 'rgba(234,179,8,0.12)' }}>
                  {h.status === 'credited'
                    ? <Check className="size-5" style={{ color: '#4ade80' }} />
                    : <Clock className="size-5" style={{ color: '#facc15' }} />
                  }
                </div>
                <div className="flex-1">
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '2px' }}>{h.desc}</p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                    {new Date(h.date).toLocaleDateString('sw-TZ', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {' · '}
                    {h.status === 'credited' ? 'Imesajiliwa' : 'Inasubiri'}
                  </p>
                </div>
                <p style={{ fontSize: '14px', fontWeight: 700, color: h.status === 'credited' ? '#4ade80' : '#facc15' }}>
                  +{formatCurrency(h.amount)}
                </p>
              </motion.div>
            ))}

            <div className="flex justify-between py-3 px-1">
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>Jumla ya wiki hii</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#4ade80' }}>
                +{formatCurrency(HISTORY.filter(h => h.status === 'credited').reduce((s, h) => s + h.amount, 0))}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
