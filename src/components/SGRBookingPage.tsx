import { useState } from 'react';
import { ArrowLeft, Train, Check, Shield, Clock, ChevronRight, Zap } from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { User } from '../App';

interface Props { user: User; accessToken: string; onBack: () => void; }

const ROUTES = [
  { id: 'dar-mor', from: 'Dar es Salaam', fromCode: 'DSM', to: 'Morogoro', toCode: 'MOR', duration: '2h 15m', distance: '200km', active: true },
  { id: 'mor-dod', from: 'Morogoro', fromCode: 'MOR', to: 'Dodoma', toCode: 'DOD', duration: '2h 30m', distance: '213km', active: false },
];

interface TrainSchedule {
  id: string; name: string; departure: string; arrival: string;
  classes: { id: string; name: string; price: number; seats: number; perks: string[] }[];
}

const SCHEDULES: TrainSchedule[] = [
  {
    id: 'sgr-001', name: 'SGR Express 1', departure: '06:00', arrival: '08:15',
    classes: [
      { id: 'eco', name: 'Uchumi', price: 15000, seats: 45, perks: ['Kiti cha kubeba', 'WiFi bure'] },
      { id: 'biz', name: 'Biashara', price: 35000, seats: 12, perks: ['Kiti pana', 'WiFi bure', 'Maji bure', 'Chakula kidogo'] },
      { id: 'vip', name: 'VIP', price: 60000, seats: 6,  perks: ['Kiti la kibinafsi', 'Chakula', 'WiFi', 'Huduma ya ndani'] },
    ],
  },
  {
    id: 'sgr-002', name: 'SGR Express 2', departure: '10:30', arrival: '12:45',
    classes: [
      { id: 'eco', name: 'Uchumi', price: 15000, seats: 38, perks: ['Kiti cha kubeba', 'WiFi bure'] },
      { id: 'biz', name: 'Biashara', price: 35000, seats: 8,  perks: ['Kiti pana', 'WiFi bure', 'Maji bure', 'Chakula kidogo'] },
    ],
  },
  {
    id: 'sgr-003', name: 'SGR Express 3', departure: '15:00', arrival: '17:15',
    classes: [
      { id: 'eco', name: 'Uchumi', price: 15000, seats: 52, perks: ['Kiti cha kubeba', 'WiFi bure'] },
      { id: 'biz', name: 'Biashara', price: 35000, seats: 14, perks: ['Kiti pana', 'WiFi bure', 'Maji bure', 'Chakula kidogo'] },
      { id: 'vip', name: 'VIP', price: 60000, seats: 4,  perks: ['Kiti la kibinafsi', 'Chakula', 'WiFi', 'Huduma ya ndani'] },
    ],
  },
];

const CLASS_COLORS: Record<string, string> = { eco: '#4ade80', biz: '#60a5fa', vip: '#fbbf24' };

const darkInput: React.CSSProperties = {
  width: '100%', height: 52, padding: '0 16px', borderRadius: 14,
  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
  color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const,
};

export function SGRBookingPage({ user, accessToken, onBack }: Props) {
  const [step, setStep] = useState<'route' | 'schedule' | 'seat' | 'payment' | 'confirmation'>('route');
  const [selectedRoute, setSelectedRoute] = useState(ROUTES[0]);
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [selectedSchedule, setSelectedSchedule] = useState<TrainSchedule | null>(null);
  const [selectedClass, setSelectedClass] = useState<TrainSchedule['classes'][0] | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [pin, setPin] = useState('');
  const [processing, setProcessing] = useState(false);
  const [ticketRef, setTicketRef] = useState('');

  const fmt = (n: number) => `TZS ${n.toLocaleString()}`;
  const accent = '#f87171';
  const taken = [2, 7, 11, 15, 22, 28, 33, 40, 45, 50];

  const toggleSeat = (n: number) => {
    if (taken.includes(n)) return;
    setSelectedSeats(prev => prev.includes(n) ? prev.filter(s => s !== n) : prev.length < passengers ? [...prev, n] : prev);
  };

  const handlePay = async () => {
    if (!selectedSchedule || !selectedClass || pin.length !== 4) return;
    setProcessing(true);
    try {
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/travel/sgr/book`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ route: selectedRoute.id, schedule: selectedSchedule.id, class: selectedClass.id, date, seats: selectedSeats, passengers, total: selectedClass.price * passengers, pin }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Imeshindwa kufanya booking. Jaribu tena.');
        return;
      }
      setTicketRef(data.reference);
      setStep('confirmation');
    } catch {
      toast.error('Hitilafu ya mtandao. Angalia muunganisho wako na ujaribu tena.');
    } finally { setProcessing(false); }
  };

  if (step === 'route') return (
    <div style={{ minHeight: '100vh', background: '#080d08', color: '#fff', paddingBottom: 40 }}>
      <div className="sticky top-0 z-20" style={{ background: 'rgba(8,13,8,0.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ padding: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft style={{ width: 20, height: 20, color: '#fff' }} />
        </button>
        <div><h1 style={{ fontSize: '20px', fontWeight: 900, color: '#fff' }}>SGR Express Train</h1>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Serikali Imethibitisha · Kisasa</p></div>
      </div>

      <div style={{ padding: '20px 16px' }}>
        <div style={{ borderRadius: 22, height: 150, background: 'linear-gradient(135deg,#1c0707,#7f1d1d,#991b1b)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
          <Train style={{ width: 48, height: 48, color: '#f87171' }} />
          <p style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>SGR – Uzoefu wa Kisasa</p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Tanzania Railways Corporation</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>Chagua Safari</h2>
          {ROUTES.map(r => (
            <button key={r.id} onClick={() => r.active && setSelectedRoute(r)} disabled={!r.active}
              style={{ padding: '18px', borderRadius: 18, background: selectedRoute.id === r.id ? 'linear-gradient(160deg,#1c0707,#7f1d1d,#991b1b)' : 'rgba(255,255,255,0.04)', border: `1px solid ${selectedRoute.id === r.id ? 'rgba(248,113,113,0.4)' : 'rgba(255,255,255,0.07)'}`, cursor: r.active ? 'pointer' : 'not-allowed', textAlign: 'left', opacity: r.active ? 1 : 0.5 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <p style={{ fontSize: '16px', fontWeight: 900, color: '#fff' }}>{r.from} → {r.to}</p>
                {!r.active && <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: 8, background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>Hivi Karibuni</span>}
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock style={{ width: 12, height: 12 }} />{r.duration}
                </span>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)' }}>{r.distance}</span>
              </div>
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 5 }}>TAREHE</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} style={darkInput} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 5 }}>ABIRIA</label>
            <div style={{ display: 'flex', alignItems: 'center', height: 52, gap: 8 }}>
              <button onClick={() => setPassengers(Math.max(1, passengers-1))} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '18px', cursor: 'pointer' }}>−</button>
              <span style={{ flex: 1, textAlign: 'center', fontSize: '20px', fontWeight: 900, color: '#fff' }}>{passengers}</span>
              <button onClick={() => setPassengers(Math.min(9, passengers+1))} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '18px', cursor: 'pointer' }}>+</button>
            </div>
          </div>
        </div>

        <button onClick={() => date && setStep('schedule')} disabled={!date}
          style={{ width: '100%', height: 52, borderRadius: 16, background: date ? 'linear-gradient(135deg,#991b1b,#7f1d1d)' : 'rgba(153,27,27,0.3)', border: 'none', color: '#fff', fontWeight: 900, fontSize: '15px', cursor: !date ? 'not-allowed' : 'pointer' }}>
          Tazama Ratiba za Treni
        </button>
      </div>
    </div>
  );

  if (step === 'schedule') return (
    <div style={{ minHeight: '100vh', background: '#080d08', color: '#fff', paddingBottom: 40 }}>
      <div className="sticky top-0 z-20" style={{ background: 'rgba(8,13,8,0.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => setStep('route')} style={{ padding: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft style={{ width: 20, height: 20, color: '#fff' }} />
        </button>
        <div>
          <p style={{ fontSize: '16px', fontWeight: 900, color: '#fff' }}>{selectedRoute.from} → {selectedRoute.to}</p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{date} · {passengers} abiria</p>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        {SCHEDULES.map(sch => (
          <div key={sch.id} style={{ marginBottom: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Train style={{ width: 18, height: 18, color: accent }} />
                <span style={{ fontSize: '14px', fontWeight: 900, color: '#fff' }}>{sch.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>{sch.departure}</span>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>→</span>
                <span style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>{sch.arrival}</span>
              </div>
            </div>
            {sch.classes.map(cls => {
              const clr = CLASS_COLORS[cls.id] ?? '#fff';
              return (
                <button key={cls.id} onClick={() => { setSelectedSchedule(sch); setSelectedClass(cls); setStep('seat'); }}
                  className="active:scale-[0.98] transition-transform"
                  style={{ width: '100%', padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: clr }}>{cls.name}</span>
                      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: 8, background: `${clr}18`, color: clr, fontWeight: 700 }}>{cls.seats} nafasi</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {cls.perks.slice(0, 3).map(p => <span key={p} style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)' }}>· {p}</span>)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontSize: '17px', fontWeight: 900, color: '#fff' }}>{fmt(cls.price)}</p>
                    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>kwa mtu</p>
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  if (step === 'seat') return (
    <div style={{ minHeight: '100vh', background: '#080d08', color: '#fff', paddingBottom: 100 }}>
      <div className="sticky top-0 z-20" style={{ background: 'rgba(8,13,8,0.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => setStep('schedule')} style={{ padding: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft style={{ width: 20, height: 20, color: '#fff' }} />
        </button>
        <div>
          <p style={{ fontSize: '16px', fontWeight: 900, color: '#fff' }}>Chagua Viti</p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{selectedClass?.name} · {selectedSeats.length}/{passengers} vimechaguliwa</p>
        </div>
      </div>

      <div style={{ padding: '20px 16px' }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '20px', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <Train style={{ width: 32, height: 32, color: accent }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
            {Array.from({ length: 60 }, (_, i) => i + 1).map(n => {
              const t = taken.includes(n), s = selectedSeats.includes(n);
              return (
                <button key={n} onClick={() => toggleSeat(n)} disabled={t}
                  style={{ height: 40, borderRadius: 9, fontSize: '11px', fontWeight: 800, border: 'none', cursor: t ? 'not-allowed' : 'pointer', transition: 'all 0.1s',
                    background: t ? 'rgba(255,255,255,0.08)' : s ? '#991b1b' : 'rgba(248,113,113,0.1)',
                    color: t ? 'rgba(255,255,255,0.2)' : s ? '#fff' : accent }}>
                  {n}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '14px 16px', background: 'rgba(8,13,8,0.97)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Jumla</span>
          <span style={{ fontSize: '20px', fontWeight: 900, color: '#fff' }}>{selectedClass ? fmt(selectedClass.price * passengers) : '–'}</span>
        </div>
        <button onClick={() => selectedSeats.length === passengers && setStep('payment')} disabled={selectedSeats.length !== passengers}
          style={{ width: '100%', height: 52, borderRadius: 16, background: selectedSeats.length === passengers ? 'linear-gradient(135deg,#991b1b,#7f1d1d)' : 'rgba(153,27,27,0.3)', border: 'none', color: '#fff', fontWeight: 900, fontSize: '15px', cursor: selectedSeats.length !== passengers ? 'not-allowed' : 'pointer' }}>
          {selectedSeats.length === passengers ? 'Endelea Kulipa' : `Chagua viti ${passengers - selectedSeats.length} zaidi`}
        </button>
      </div>
    </div>
  );

  if (step === 'payment') return (
    <div style={{ minHeight: '100vh', background: '#080d08', color: '#fff', paddingBottom: 40 }}>
      <div className="sticky top-0 z-20" style={{ background: 'rgba(8,13,8,0.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => setStep('seat')} style={{ padding: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft style={{ width: 20, height: 20, color: '#fff' }} />
        </button>
        <h1 style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>Thibitisha na Lipa</h1>
      </div>
      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ padding: '18px', borderRadius: 20, background: 'linear-gradient(135deg,#1c0707,#7f1d1d)', border: '1px solid rgba(248,113,113,0.2)' }}>
          {[['Safari', `${selectedRoute.from} → ${selectedRoute.to}`], ['Treni', selectedSchedule?.name ?? ''], ['Darasa', selectedClass?.name ?? ''], ['Tarehe', date], ['Viti', selectedSeats.join(', ')], ['Abiria', `${passengers}`]].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{k}</span>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#fff' }}>{v}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12 }}>
            <span style={{ fontSize: '14px', fontWeight: 900, color: '#fff' }}>Jumla</span>
            <span style={{ fontSize: '20px', fontWeight: 900, color: accent }}>{selectedClass ? fmt(selectedClass.price * passengers) : '–'}</span>
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>PIN ya Kuthibitisha</label>
          <input type="password" maxLength={4} placeholder="● ● ● ●" value={pin} onChange={e => setPin(e.target.value)}
            style={{ width: '100%', height: 56, textAlign: 'center', fontSize: '24px', letterSpacing: '8px', borderRadius: 14, background: 'rgba(255,255,255,0.07)', border: `1px solid ${pin.length===4?accent:'rgba(255,255,255,0.12)'}`, color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <button onClick={handlePay} disabled={processing || pin.length !== 4}
          style={{ width: '100%', height: 52, borderRadius: 16, background: pin.length===4 ? 'linear-gradient(135deg,#991b1b,#7f1d1d)' : 'rgba(153,27,27,0.3)', border: 'none', color: '#fff', fontWeight: 900, fontSize: '15px', cursor: pin.length!==4?'not-allowed':'pointer' }}>
          {processing ? 'Inashughulikia...' : selectedClass ? `Lipa ${fmt(selectedClass.price * passengers)}` : 'Lipa'}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#080d08', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <style>{`@keyframes si{0%{transform:scale(0)}70%{transform:scale(1.1)}100%{transform:scale(1)}}`}</style>
      <div style={{ textAlign: 'center', maxWidth: 360, width: '100%', color: '#fff' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#991b1b,#7f1d1d)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', animation: 'si 0.5s ease-out', boxShadow: '0 8px 40px rgba(153,27,27,0.5)' }}>
          <Check style={{ width: 38, height: 38, color: '#fff' }} />
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 900, marginBottom: 6 }}>Tiketi ya SGR Imethibitishwa!</h1>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>QR code yako iko tayari</p>
        <div style={{ padding: '16px', borderRadius: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: 16 }}>
          <div style={{ background: 'linear-gradient(135deg,#1c0707,#7f1d1d)', borderRadius: 14, padding: '16px', marginBottom: 12 }}>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Nambari ya Tiketi</p>
            <p style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '2px', color: accent }}>{ticketRef}</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: 6 }}>🚂</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Shield style={{ width: 12, height: 12, color: accent }} />
                <span style={{ fontSize: '11px', fontWeight: 700, color: accent }}>QR Inafanya kazi bila mtandao</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: '14px', borderRadius: 16, background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', marginBottom: 20 }}>
          <p style={{ fontSize: '13px', fontWeight: 800, color: accent, marginBottom: 4 }}>📱 Tiketi imetumwa kwa SMS</p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Onyesha QR code katika stesheni. Fika dakika 20 mapema.</p>
        </div>
        <button onClick={onBack} style={{ width: '100%', height: 52, borderRadius: 16, background: 'linear-gradient(135deg,#16a34a,#15803d)', border: 'none', color: '#fff', fontWeight: 900, fontSize: '15px', cursor: 'pointer' }}>Rudi Nyumbani</button>
      </div>
    </div>
  );
}
