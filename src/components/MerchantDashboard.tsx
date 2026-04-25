import { useState, useEffect } from 'react';
import {
  ArrowLeft, TrendingUp, DollarSign, ShoppingBag, Users,
  Package, Plus, Edit, BarChart3, Settings, FileText,
  Clock, CheckCircle2, XCircle, AlertCircle, QrCode,
  ArrowUpRight, ArrowDownRight, Zap
} from 'lucide-react';
import { User } from '../App';
import { projectId } from '../utils/supabase/info';

interface MerchantDashboardProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 }).format(n);

const MOCK_RECENT_PAYMENTS = [
  { id: '1', customer: 'Amina Hassan', amount: 45000, time: 'Dakika 5 zilizopita', type: 'qr' },
  { id: '2', customer: 'John Mwangi', amount: 120000, time: 'Dakika 23 zilizopita', type: 'transfer' },
  { id: '3', customer: 'Fatuma Ali', amount: 18500, time: 'Saa 1 iliyopita', type: 'qr' },
  { id: '4', customer: 'Peter Kimaro', amount: 75000, time: 'Saa 2 zilizopita', type: 'transfer' },
];

const SPARKLINE_POINTS = [40, 55, 42, 70, 65, 80, 75, 90, 85, 95];

function Sparkline() {
  const max = Math.max(...SPARKLINE_POINTS);
  const min = Math.min(...SPARKLINE_POINTS);
  const h = 40;
  const w = 120;
  const pts = SPARKLINE_POINTS.map((v, i) => {
    const x = (i / (SPARKLINE_POINTS.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * h;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline points={pts} stroke="rgba(74,222,128,0.8)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MerchantDashboard({ user, accessToken, onBack }: MerchantDashboardProps) {
  const [merchantData, setMerchantData] = useState<any>(null);
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, pendingOrders: 0, completedToday: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, statsRes] = await Promise.all([
          fetch(`https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/merchant/profile`, { headers: { Authorization: `Bearer ${accessToken}` } }),
          fetch(`https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/merchant/stats`, { headers: { Authorization: `Bearer ${accessToken}` } }),
        ]);
        if (profileRes.ok) setMerchantData(await profileRes.json());
        if (statsRes.ok) setStats(await statsRes.json());
      } catch { /* demo */ } finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#080d08' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#16a34a', borderTopColor: 'transparent' }} />
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>Inapakia dashibodi ya mfanyabiashara...</p>
        </div>
      </div>
    );
  }

  if (!merchantData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#080d08' }}>
        <div className="rounded-3xl p-8 max-w-md w-full text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <XCircle className="size-10" style={{ color: '#f87171' }} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Hakuna Akaunti ya Mfanyabiashara</h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '24px', lineHeight: 1.6 }}>
            Bado huna akaunti ya mfanyabiashara. Tafadhali kamilisha mchakato wa usajili wa mfanyabiashara.
          </p>
          <button onClick={onBack} className="w-full h-12 rounded-2xl font-bold"
            style={{ background: '#16a34a', color: '#fff', fontSize: '14px' }}>
            Rudi Dashibodi
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = {
    pending: { icon: Clock, bg: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.2)', color: '#facc15', label: 'Inasubiri Ukaguzi' },
    approved: { icon: CheckCircle2, bg: 'rgba(22,163,74,0.12)', border: 'rgba(22,163,74,0.2)', color: '#4ade80', label: 'Imeidhinishwa' },
    rejected: { icon: XCircle, bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.2)', color: '#f87171', label: 'Imekataliwa' },
  };
  const sc = statusConfig[merchantData.status as keyof typeof statusConfig] || statusConfig.pending;
  const StatusIcon = sc.icon;

  return (
    <div className="min-h-screen pb-10" style={{ background: '#080d08' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 py-4" style={{ background: 'linear-gradient(135deg, #14532d 0%, #052e16 100%)' }}>
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2.5 rounded-full active:scale-95" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <ArrowLeft className="size-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>{merchantData.businessName}</h1>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{merchantData.businessCategory}</p>
          </div>
          <button className="p-2.5 rounded-full active:scale-95" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <Settings className="size-5 text-white" />
          </button>
        </div>
      </div>

      <div className="px-4 py-5 space-y-4">
        {/* Verification Status */}
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-between mb-3">
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Hali ya Akaunti</p>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: sc.bg, border: `1px solid ${sc.border}` }}>
              <StatusIcon className="size-4" style={{ color: sc.color }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: sc.color }}>{sc.label}</span>
            </div>
          </div>

          {merchantData.status === 'pending' && (
            <div className="flex gap-3 rounded-xl p-3" style={{ background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.12)' }}>
              <AlertCircle className="size-4 flex-shrink-0 mt-0.5" style={{ color: '#facc15' }} />
              <div>
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#facc15', marginBottom: '2px' }}>Inapitiwa</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>Hati zako zinapitiwa na timu yetu. Hii kawaida huchukua masaa 24-48. Tutakuarifu mara itakapoidhinishwa.</p>
              </div>
            </div>
          )}
          {merchantData.status === 'approved' && (
            <div className="rounded-xl p-3" style={{ background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.12)' }}>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>Akaunti yako ya mfanyabiashara inafanya kazi! Sasa unaweza kukubali malipo na kusimamia biashara yako kwenye goPay.</p>
            </div>
          )}
          {merchantData.status === 'rejected' && (
            <div className="rounded-xl p-3" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)' }}>
              <p style={{ fontSize: '12px', color: '#fca5a5', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700 }}>Sababu:</span> {merchantData.rejectionReason || 'Tafadhali wasiliana na msaada kwa maelezo zaidi.'}
              </p>
              <button className="h-9 px-4 rounded-xl text-sm font-semibold active:scale-95"
                style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                Wasilisha Hati Tena
              </button>
            </div>
          )}
        </div>

        {merchantData.status === 'approved' && (
          <>
            {/* Revenue Trend */}
            <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(22,163,74,0.15) 0%, rgba(5,46,22,0.6) 100%)', border: '1px solid rgba(74,222,128,0.12)' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '4px' }}>MAPATO YA JUMLA</p>
                  <p style={{ fontSize: '32px', fontWeight: 900, color: '#fff', letterSpacing: '-1.5px', marginBottom: '4px' }}>{formatCurrency(stats.totalRevenue)}</p>
                  <div className="flex items-center gap-1">
                    <ArrowUpRight className="size-3.5" style={{ color: '#4ade80' }} />
                    <span style={{ fontSize: '12px', color: '#4ade80', fontWeight: 600 }}>+23% mwezi huu</span>
                  </div>
                </div>
                <Sparkline />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Jumla ya Maagizo', value: stats.totalOrders, icon: ShoppingBag, color: '#60a5fa', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.2)', trend: '+15%' },
                { label: 'Yanasubiri', value: stats.pendingOrders, icon: Clock, color: '#facc15', bg: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.2)', trend: null },
                { label: 'Yaliyokamilika Leo', value: stats.completedToday, icon: CheckCircle2, color: '#4ade80', bg: 'rgba(22,163,74,0.12)', border: 'rgba(22,163,74,0.2)', trend: '+8%' },
                { label: 'Wateja', value: 128, icon: Users, color: '#c4b5fd', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.2)', trend: '+5%' },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="rounded-2xl p-4" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                    <Icon className="size-6 mb-2" style={{ color: s.color }} />
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '2px' }}>{s.label}</p>
                    <p style={{ fontSize: '22px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1.2 }}>{s.value}</p>
                    {s.trend && (
                      <div className="flex items-center gap-0.5 mt-1">
                        <ArrowUpRight className="size-3" style={{ color: s.color }} />
                        <span style={{ fontSize: '11px', color: s.color, fontWeight: 600 }}>{s.trend}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* My QR Code */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.2)' }}>
                  <QrCode className="size-5" style={{ color: '#4ade80' }} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>QR Code Yangu</p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Wateja wanaweza kukulipa kwa QR</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <QrCode className="size-12" style={{ color: 'rgba(255,255,255,0.3)' }} />
                </div>
                <div className="flex-1 space-y-2">
                  <button className="w-full h-9 rounded-xl text-sm font-semibold active:scale-95"
                    style={{ background: '#16a34a', color: '#fff' }}>
                    Pakua QR Code
                  </button>
                  <button className="w-full h-9 rounded-xl text-sm font-semibold active:scale-95"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    Shiriki QR Code
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Payments */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Malipo ya Hivi Karibuni</p>
                <button style={{ fontSize: '12px', fontWeight: 600, color: '#4ade80' }}>Ona Yote</button>
              </div>
              <div className="space-y-2">
                {MOCK_RECENT_PAYMENTS.map(p => (
                  <div key={p.id} className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: p.type === 'qr' ? 'rgba(22,163,74,0.15)' : 'rgba(59,130,246,0.15)' }}>
                      {p.type === 'qr' ? <QrCode className="size-4" style={{ color: '#4ade80' }} /> : <DollarSign className="size-4" style={{ color: '#60a5fa' }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{p.customer}</p>
                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{p.time}</p>
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: 800, color: '#4ade80', letterSpacing: '-0.3px' }}>+{formatCurrency(p.amount)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>Vitendo vya Haraka</p>
              <div className="space-y-2">
                {[
                  { icon: Plus, label: 'Ongeza Bidhaa Mpya', sub: 'Ongeza vitu kwenye orodha yako', color: '#4ade80', bg: 'rgba(22,163,74,0.12)', border: 'rgba(22,163,74,0.2)' },
                  { icon: Package, label: 'Simamia Maagizo', sub: 'Angalia na shughulikia maagizo', color: '#60a5fa', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.2)' },
                  { icon: BarChart3, label: 'Tazama Uchambuzi', sub: 'Ripoti za mauzo na maarifa', color: '#c4b5fd', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.2)' },
                  { icon: FileText, label: 'Mipangilio ya Malipo', sub: 'Akaunti ya benki na kutoa fedha', color: '#fb923c', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.2)' },
                ].map((a, i) => {
                  const Icon = a.icon;
                  return (
                    <button key={i} className="w-full rounded-xl p-4 flex items-center gap-3 transition-all active:scale-[0.99]"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: a.bg, border: `1px solid ${a.border}` }}>
                        <Icon className="size-5" style={{ color: a.color }} />
                      </div>
                      <div className="flex-1 text-left">
                        <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{a.label}</p>
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{a.sub}</p>
                      </div>
                      <Zap className="size-4" style={{ color: 'rgba(255,255,255,0.2)' }} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Business Info */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>Taarifa za Biashara</p>
              <div className="space-y-0">
                {[
                  { label: 'Aina ya Biashara', value: merchantData.businessType },
                  { label: 'Barua Pepe', value: merchantData.email },
                  { label: 'Simu', value: merchantData.phone },
                  { label: 'Anwani', value: merchantData.address },
                  { label: 'Namba ya TIN', value: merchantData.tinNumber },
                ].map((row, i, arr) => (
                  <div key={i} className="flex justify-between py-3" style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{row.label}</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff', textAlign: 'right', maxWidth: '55%' }}>{row.value}</span>
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
