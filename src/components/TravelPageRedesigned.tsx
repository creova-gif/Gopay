import { UnifiedBookingSystemUltimate as UnifiedBookingSystem } from './UnifiedBookingSystemUltimate';
import { useState } from 'react';
import { User } from '../App';
import {
  ArrowLeft, Bus, Ship, Plane, Hotel, Mountain, Users, MapPin,
  ChevronRight, Star, Check, Train, Search,
  ArrowRight, Shield, Sparkles, TrendingUp, Zap, Heart,
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface TravelPageRedesignedProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

type BookingService = 'flights' | 'buses' | 'sgr' | 'hotels' | 'parks';

const SVC = {
  flights: { accent: '#60a5fa', glow: 'rgba(96,165,250,0.25)',  gradient: 'linear-gradient(160deg,#0f172a 0%,#1e3a8a 55%,#1d4ed8 100%)' },
  ferry:   { accent: '#22d3ee', glow: 'rgba(34,211,238,0.25)',  gradient: 'linear-gradient(160deg,#0c1a2e 0%,#0c4a6e 55%,#0369a1 100%)' },
  buses:   { accent: '#4ade80', glow: 'rgba(74,222,128,0.25)',  gradient: 'linear-gradient(160deg,#052e16 0%,#14532d 55%,#166534 100%)' },
  sgr:     { accent: '#f87171', glow: 'rgba(248,113,113,0.25)', gradient: 'linear-gradient(160deg,#1c0707 0%,#7f1d1d 55%,#991b1b 100%)' },
  hotels:  { accent: '#fb923c', glow: 'rgba(251,146,60,0.25)',  gradient: 'linear-gradient(160deg,#1c0a00 0%,#7c2d12 55%,#c2410c 100%)' },
  parks:   { accent: '#34d399', glow: 'rgba(52,211,153,0.25)',  gradient: 'linear-gradient(160deg,#022c22 0%,#065f46 55%,#047857 100%)' },
};

export function TravelPageRedesigned({ user, accessToken, onBack }: TravelPageRedesignedProps) {
  const [showUnifiedBooking, setShowUnifiedBooking] = useState(false);
  const [selectedBookingService, setSelectedBookingService] = useState<BookingService | null>(null);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 })
      .format(amount).replace('TSh', 'TZS');

  const quickBookDestinations = [
    {
      name: 'Zanzibar Paradise',
      subtitle: 'Beach & Culture',
      image: 'https://images.unsplash.com/photo-1707296450219-2d9cc08bdef0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxaYW56aWJhciUyMGJlYWNoJTIwc3Vuc2V0fGVufDF8fHx8MTc2NzkwMTQ4OHww&ixlib=rb-4.1.0&q=80&w=1080',
      from: 25000, badge: 'LIVE DEAL', discount: '-30%', service: 'flights' as BookingService,
    },
    {
      name: 'Serengeti Safari',
      subtitle: 'Wildlife Adventure',
      image: 'https://images.unsplash.com/photo-1641133292545-32e441e60190?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTZXJlbmdldGklMjBzYWZhcmklMjB3aWxkbGlmZXxlbnwxfHx8fDE3Njc4NzU1NzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      from: 280000, badge: 'MAARUFU', discount: null, service: 'parks' as BookingService,
    },
    {
      name: 'Kilimanjaro Trek',
      subtitle: 'Mountain Expedition',
      image: 'https://images.unsplash.com/photo-1650668302197-7f556c34cb91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNb3VudCUyMEtpbGltYW5qYXJvJTIwc3Vuc2V0fGVufDF8fHx8MTc2NzkwMTUyOHww&ixlib=rb-4.1.0&q=80&w=1080',
      from: 450000, badge: null, discount: null, service: 'hotels' as BookingService,
    },
  ];

  const goBook = (service: BookingService) => { setSelectedBookingService(service); setShowUnifiedBooking(true); };

  if (showUnifiedBooking && selectedBookingService) {
    return (
      <UnifiedBookingSystem
        user={user}
        onBack={() => { setShowUnifiedBooking(false); setSelectedBookingService(null); }}
        initialService={selectedBookingService}
      />
    );
  }

  const tickerText = '🔥 Zanzibar Ferry 30% OFF  •  Precision Air TZS 155K  •  SGR 25% OFF  •  Hotels kuanzia TZS 80K  •  Serengeti Safari TZS 280K  •  ';

  return (
    <div style={{ minHeight: '100vh', background: '#080d08', color: '#fff', paddingBottom: 48 }}>
      <style>{`
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes glowBlob { 0%,100%{opacity:0.3;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.15)} }
        @keyframes liveDot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:0.6} }
      `}</style>

      {/* ── STICKY HEADER ── */}
      <div className="sticky top-0 z-20" style={{ background: 'rgba(8,13,8,0.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ padding: '16px 16px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={onBack} className="active:scale-95 transition-transform"
              style={{ padding: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
              <ArrowLeft style={{ width: 20, height: 20, color: '#fff' }} />
            </button>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '20px', fontWeight: 900, color: '#fff' }}>Gundua Tanzania</h1>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Real-time bookings · Live prices</p>
            </div>
            <button className="active:scale-95 transition-transform"
              style={{ padding: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer' }}>
              <Search style={{ width: 20, height: 20, color: '#fff' }} />
            </button>
          </div>
        </div>
      </div>

      {/* ── LOYALTY + LIVE TICKER ── */}
      <div style={{ padding: '16px 16px 0' }}>
        {/* Loyalty strip */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 18, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative', width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#b45309,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Star style={{ width: 20, height: 20, color: '#fff', fill: '#fff' }} />
              <div style={{ position: 'absolute', top: -3, right: -3, width: 10, height: 10, borderRadius: '50%', background: '#4ade80', border: '2px solid #080d08', animation: 'liveDot 2s ease-in-out infinite' }} />
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>GO Rewards Points</p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Pata 5% kila safari · Tumia wakati wowote</p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '26px', fontWeight: 900, color: '#fbbf24', letterSpacing: '-1px', lineHeight: 1 }}>{user.loyaltyPoints ?? 0}</p>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>pointi</p>
          </div>
        </div>

        {/* Live deals ticker */}
        <div style={{ borderRadius: 14, overflow: 'hidden', padding: '10px 0', background: 'linear-gradient(90deg,#b45309,#c2410c,#9a3412)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ padding: '0 12px', flexShrink: 0 }}>
            <Zap style={{ width: 16, height: 16, color: '#fff' }} />
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ display: 'flex', width: 'max-content', animation: 'ticker 22s linear infinite' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', paddingRight: 40 }}>{tickerText}</span>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', paddingRight: 40 }}>{tickerText}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── DESTINATIONS CAROUSEL ── */}
      <div style={{ padding: '20px 0 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', marginBottom: 14 }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp style={{ width: 18, height: 18, color: '#f87171' }} />
              Maeneo Maarufu
            </h2>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Bei za sasa · Imesasishwa sasa hivi</p>
          </div>
          <button style={{ fontSize: '12px', fontWeight: 700, color: '#4ade80', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            Ona Zote <ChevronRight style={{ width: 14, height: 14 }} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: 14, overflowX: 'auto', padding: '0 16px 6px', scrollbarWidth: 'none' }}>
          {quickBookDestinations.map((dest, idx) => (
            <button key={idx} onClick={() => goBook(dest.service)}
              className="active:scale-[0.98] transition-transform"
              style={{ flexShrink: 0, width: 240, borderRadius: 22, overflow: 'hidden', position: 'relative', border: 'none', padding: 0, cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
              <div style={{ position: 'relative', height: 200 }}>
                <ImageWithFallback src={dest.image} alt={dest.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)' }} />

                {dest.badge && (
                  <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 20, background: '#dc2626' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', animation: 'liveDot 1.5s ease-in-out infinite' }} />
                    <span style={{ fontSize: '10px', fontWeight: 900, color: '#fff' }}>{dest.badge}</span>
                  </div>
                )}

                <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} />
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#fff' }}>Inapatikana</span>
                </div>

                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 14px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div>
                      <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#fff', marginBottom: 3 }}>{dest.name}</h3>
                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin style={{ width: 10, height: 10 }} />{dest.subtitle}
                      </p>
                    </div>
                    <Heart style={{ width: 20, height: 20, color: 'rgba(255,255,255,0.8)', flexShrink: 0 }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginBottom: 2 }}>Kuanzia</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <p style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>{formatCurrency(dest.from)}</p>
                        {dest.discount && <span style={{ fontSize: '10px', fontWeight: 900, background: '#fbbf24', color: '#1c1400', padding: '2px 6px', borderRadius: 8 }}>{dest.discount}</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 12, background: '#16a34a' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#fff' }}>Weka</span>
                      <ArrowRight style={{ width: 13, height: 13, color: '#fff' }} />
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── BOOK YOUR JOURNEY ── */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>🚀 Anza Safari Yako</h2>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Washirika wa moja kwa moja · Uthibitisho wa papo hapo</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 20, background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', animation: 'liveDot 2s ease-in-out infinite' }} />
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#4ade80' }}>Mifumo Yote Online</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* FLIGHTS */}
          {[
            {
              key: 'flights', service: 'flights' as BookingService,
              Icon: Plane, label: 'Ndege za Ndani', sub: 'Safari ya haraka na ya uhakika',
              chips: ['Njia 40+', 'Siku Moja', 'TZS 155K+'],
              badge: { text: 'Okoa 25%', bg: 'linear-gradient(135deg,#dc2626,#f97316)' },
              partners: ['Precision Air', 'Air Tanzania', '+3'],
              partnerLabel: 'Washirika:',
              svc: SVC.flights,
            },
            {
              key: 'ferry', service: 'flights' as BookingService,
              Icon: Ship, label: 'Ferry ya Zanzibar', sub: 'Safari ya bahari · Masaa 2–4',
              chips: ['Kila Siku', 'TZS 24,500', '12 Nafasi'],
              badge: { text: '🔥 HOT -30%', bg: 'linear-gradient(135deg,#d97706,#f59e0b)' },
              partners: ['Azam Marine', 'Instant Confirm'],
              partnerLabel: 'Powered by:',
              svc: SVC.ferry,
              rating: 4.8,
            },
            {
              key: 'buses', service: 'buses' as BookingService,
              Icon: Bus, label: 'Mabasi ya Starehe', sub: 'Safari ya ndani ya nchi',
              chips: ['VIP Inapatikana', 'WiFi & AC', 'TZS 25K+'],
              badge: null,
              partners: ['Kilimanjaro Express', 'Dar Express', '+5'],
              partnerLabel: 'Waendeshaji:',
              svc: SVC.buses,
            },
            {
              key: 'sgr', service: 'sgr' as BookingService,
              Icon: Train, label: 'SGR Express Train', sub: 'Uzoefu wa kisasa wa reli',
              chips: ['Dar → Morogoro', 'Kila Siku', 'TZS 15K+'],
              badge: { text: 'Serikali Imethibitisha', bg: 'linear-gradient(135deg,#4f46e5,#7c3aed)' },
              partners: ['Tanzania Railways (TRC)', 'Online'],
              partnerLabel: 'Rasmi:',
              svc: SVC.sgr,
            },
            {
              key: 'hotels', service: 'hotels' as BookingService,
              Icon: Hotel, label: 'Hoteli & Lodges', sub: 'Starehe ya bei yoyote',
              chips: ['Hoteli 500+', 'Bei Bora', 'TZS 80K+'],
              badge: null,
              partners: ['Booking.com', 'Jumia Travel', '+Local'],
              partnerLabel: 'Powered by:',
              svc: SVC.hotels,
            },
            {
              key: 'parks', service: 'parks' as BookingService,
              Icon: Mountain, label: 'Mbuga za Taifa', sub: 'Safari & matukio ya asili',
              chips: ['Mbuga 16', 'Wildlife Tours', 'TZS 280K+'],
              badge: { text: '🌿 UNESCO', bg: 'linear-gradient(135deg,#047857,#059669)' },
              partners: ['TANAPA', 'Vibali Rasmi'],
              partnerLabel: 'Imeidhinishwa na:',
              svc: SVC.parks,
              rating: null,
            },
          ].map(svcCard => {
            const { Icon, svc } = svcCard;
            return (
              <button key={svcCard.key} onClick={() => goBook(svcCard.service)}
                className="active:scale-[0.98] transition-transform text-left"
                style={{ width: '100%', borderRadius: 22, padding: '20px', background: svc.gradient, border: `1px solid ${svc.accent}22`, position: 'relative', overflow: 'hidden', boxShadow: `0 4px 24px ${svc.glow}`, cursor: 'pointer' }}>
                {/* Ambient corner glow */}
                <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: `radial-gradient(circle, ${svc.accent}20 0%, transparent 70%)` }} />

                {/* Deal badge */}
                {svcCard.badge && (
                  <div style={{ position: 'absolute', top: 16, right: 16, padding: '5px 12px', borderRadius: 20, background: svcCard.badge.bg }}>
                    <p style={{ fontSize: '11px', fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: 4 }}>
                      {svcCard.key === 'sgr' && <Shield style={{ width: 11, height: 11 }} />}
                      {svcCard.badge.text}
                    </p>
                  </div>
                )}

                <div style={{ position: 'relative', zIndex: 1 }}>
                  {/* Header row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 56, height: 56, borderRadius: 17, background: `${svc.accent}18`, border: `1px solid ${svc.accent}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon style={{ width: 28, height: 28, color: svc.accent }} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                          <p style={{ fontSize: '17px', fontWeight: 900, color: '#fff' }}>{svcCard.label}</p>
                          {svcCard.key === 'flights' && <Shield style={{ width: 14, height: 14, color: '#4ade80' }} />}
                          {svcCard.rating && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                              <Star style={{ width: 13, height: 13, color: '#fbbf24', fill: '#fbbf24' }} />
                              <span style={{ fontSize: '12px', fontWeight: 800, color: '#fbbf24' }}>{svcCard.rating}</span>
                            </div>
                          )}
                        </div>
                        <p style={{ fontSize: '12px', color: `${svc.accent}cc` }}>{svcCard.sub}</p>
                      </div>
                    </div>
                    <ChevronRight style={{ width: 20, height: 20, color: `${svc.accent}80`, flexShrink: 0, marginTop: 4 }} />
                  </div>

                  {/* Chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                    {svcCard.chips.map(chip => (
                      <span key={chip} style={{ fontSize: '11px', fontWeight: 700, padding: '5px 10px', borderRadius: 20, background: `${svc.accent}18`, border: `1px solid ${svc.accent}30`, color: svc.accent }}>
                        {chip}
                      </span>
                    ))}
                  </div>

                  {/* Partners row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 12, borderTop: `1px solid ${svc.accent}18` }}>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', flexShrink: 0 }}>{svcCard.partnerLabel}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      {svcCard.partners.map((p, i) => (
                        <div key={i} style={{ padding: '3px 10px', borderRadius: 8, background: `${svc.accent}15`, border: `1px solid ${svc.accent}25` }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: svc.accent }}>{p}</span>
                        </div>
                      ))}
                    </div>
                    {svcCard.key === 'sgr' && (
                      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', animation: 'liveDot 2s ease-in-out infinite' }} />
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#4ade80' }}>Online</span>
                      </div>
                    )}
                    {svcCard.key === 'parks' && (
                      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 8, background: 'rgba(96,165,250,0.12)' }}>
                        <Shield style={{ width: 10, height: 10, color: '#60a5fa' }} />
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#60a5fa' }}>Rasmi</span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── AI TRAVEL ASSISTANT ── */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ borderRadius: 24, padding: '24px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg,#1e1b4b 0%,#4c1d95 40%,#7e22ce 70%,#be185d 100%)', border: '1px solid rgba(196,181,253,0.2)', boxShadow: '0 8px 40px rgba(126,34,206,0.3)' }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)', animation: 'glowBlob 5s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', bottom: -20, left: -20, width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 70%)' }} />

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sparkles style={{ width: 26, height: 26, color: '#fff' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <p style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>AI Travel Assistant</p>
                <span style={{ fontSize: '10px', fontWeight: 900, padding: '3px 8px', borderRadius: 10, background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>KIPYA</span>
              </div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginBottom: 16 }}>Pata mapendekezo ya kibinafsi, linganisha bei, gundua ofa za siri</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button className="active:scale-95 transition-transform"
                  style={{ padding: '10px 22px', borderRadius: 14, background: '#fff', color: '#7e22ce', fontWeight: 900, fontSize: '13px', border: 'none', cursor: 'pointer' }}>
                  Uliza AI Sasa
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', borderRadius: 14, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <Users style={{ width: 14, height: 14, color: '#fff' }} />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>2.4K wanatumia</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TRUST STRIP ── */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Shield style={{ width: 16, height: 16, color: '#4ade80' }} />
          <p style={{ fontSize: '13px', fontWeight: 800, color: 'rgba(255,255,255,0.7)' }}>Kwa nini weka na goPay?</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { Icon: Shield,  accent: '#4ade80', label: 'Malipo Salama',      sub: 'SSL iliyofichwa' },
            { Icon: Zap,     accent: '#60a5fa', label: 'Uthibitisho Papo',   sub: 'Wakati halisi'   },
            { Icon: Heart,   accent: '#c4b5fd', label: 'Bei Bora Zaidi',     sub: 'Dhamana ya bei'  },
          ].map(({ Icon, accent, label, sub }) => (
            <div key={label} style={{ borderRadius: 16, padding: '14px 10px', textAlign: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: `${accent}14`, border: `1px solid ${accent}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                <Icon style={{ width: 22, height: 22, color: accent }} />
              </div>
              <p style={{ fontSize: '11px', fontWeight: 800, color: '#fff', marginBottom: 3 }}>{label}</p>
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
