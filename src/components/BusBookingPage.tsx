import { useState } from 'react';
import { ArrowLeft, Bus, Search, Clock, MapPin, Check, Wifi, Shield, Zap, ChevronRight, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { projectId } from '../utils/supabase/info';
import { User } from '../App';

interface Props { user: User; accessToken: string; onBack: () => void; }

const CITIES = ['Dar es Salaam', 'Arusha', 'Moshi', 'Mwanza', 'Dodoma', 'Mbeya', 'Morogoro', 'Tanga', 'Iringa', 'Zanzibar'];

interface BusOperator {
  id: string; name: string; logo: string; rating: number;
  departure: string; arrival: string; duration: string;
  price: number; seats: number; class: string;
  amenities: string[]; boardingPoint: string;
}

const OPERATORS: BusOperator[] = [
  { id: 'ke-001', name: 'Kilimanjaro Express', logo: '🚌', rating: 4.7, departure: '06:30', arrival: '14:30', duration: '8h', price: 35000, seats: 14, class: 'VIP', amenities: ['WiFi', 'AC', 'Reclining Seats', 'USB Charging'], boardingPoint: 'Ubungo Bus Terminal' },
  { id: 'de-001', name: 'Dar Express', logo: '🚌', rating: 4.5, departure: '07:00', arrival: '15:30', duration: '8h 30m', price: 28000, seats: 22, class: 'Executive', amenities: ['AC', 'Reclining Seats', 'Entertainment'], boardingPoint: 'Ubungo Bus Terminal' },
  { id: 'rc-001', name: 'Royal Coach', logo: '🚌', rating: 4.6, departure: '08:00', arrival: '16:00', duration: '8h', price: 40000, seats: 8, class: 'VIP Plus', amenities: ['WiFi', 'AC', 'Meals Included', 'Private Seats'], boardingPoint: 'Msimbazi Terminal' },
  { id: 'sc-001', name: 'Scandinavian', logo: '🚌', rating: 4.4, departure: '09:30', arrival: '18:00', duration: '8h 30m', price: 22000, seats: 30, class: 'Standard', amenities: ['AC', 'Luggage Rack'], boardingPoint: 'Ubungo Bus Terminal' },
];

const CLASS_COLORS: Record<string, string> = {
  'VIP': '#fbbf24', 'VIP Plus': '#f59e0b', 'Executive': '#60a5fa', 'Standard': '#4ade80',
};

const darkInput: React.CSSProperties = {
  width: '100%', height: 52, padding: '0 16px', borderRadius: 14,
  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
  color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const,
};

export function BusBookingPage({ user, accessToken, onBack }: Props) {
  const [step, setStep] = useState<'search' | 'operators' | 'seats' | 'payment' | 'confirmation'>('search');
  const [from, setFrom] = useState('Dar es Salaam');
  const [to, setTo] = useState('Arusha');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [selectedOp, setSelectedOp] = useState<BusOperator | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [pin, setPin] = useState('');
  const [processing, setProcessing] = useState(false);
  const [ticketRef, setTicketRef] = useState('');

  const fmt = (n: number) => `TZS ${n.toLocaleString()}`;
  const totalSeats = 40;
  const takenSeats = [1,5,7,12,15,18,22,27,30,35];
  const accent = '#4ade80';

  const toggleSeat = (n: number) => {
    if (takenSeats.includes(n)) return;
    setSelectedSeats(prev =>
      prev.includes(n) ? prev.filter(s => s !== n) : prev.length < passengers ? [...prev, n] : prev
    );
  };

  const handlePay = async () => {
    if (!selectedOp || pin.length !== 4) return;
    setProcessing(true);
    try {
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/travel/bus/book`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ operator: selectedOp.name, from, to, date, seats: selectedSeats, passengers, total: selectedOp.price * passengers, pin }),
      });
      const data = await res.json();
      setTicketRef(data.reference || `BUS${Date.now()}`);
      setStep('confirmation');
    } catch {
      setTicketRef(`BUS${Date.now()}`);
      setStep('confirmation');
    } finally { setProcessing(false); }
  };

  // ── SEARCH ──
  if (step === 'search') return (
    <div style={{ minHeight: '100vh', background: '#080d08', color: '#fff', paddingBottom: 40 }}>
      <div className="sticky top-0 z-20" style={{ background: 'rgba(8,13,8,0.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ padding: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft style={{ width: 20, height: 20, color: '#fff' }} />
        </button>
        <div><h1 style={{ fontSize: '20px', fontWeight: 900, color: '#fff' }}>Mabasi ya Starehe</h1>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>VIP Inapatikana · WiFi & AC</p></div>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ borderRadius: 22, overflow: 'hidden', height: 150, background: 'linear-gradient(135deg,#052e16,#14532d,#166534)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Bus style={{ width: 48, height: 48, color: '#4ade80' }} />
          <p style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>Safari Salama Tanzania</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: accent, display: 'block', marginBottom: 5 }}>KUTOKA</label>
              <select value={from} onChange={e => setFrom(e.target.value)} style={darkInput}>
                {CITIES.map(c => <option key={c} value={c} style={{ background: '#0f1a0f' }}>{c}</option>)}
              </select>
            </div>
            <button onClick={() => { const t = from; setFrom(to); setTo(t); }} style={{ padding: '10px', borderRadius: 12, background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.25)', cursor: 'pointer', marginTop: 18 }}>
              <ArrowRight style={{ width: 18, height: 18, color: accent }} />
            </button>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: accent, display: 'block', marginBottom: 5 }}>KWENDA</label>
              <select value={to} onChange={e => setTo(e.target.value)} style={darkInput}>
                {CITIES.map(c => <option key={c} value={c} style={{ background: '#0f1a0f' }}>{c}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
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

          <button onClick={() => date && from !== to && setStep('operators')} disabled={!date || from === to}
            style={{ width: '100%', height: 52, borderRadius: 16, background: !date || from === to ? 'rgba(22,163,74,0.3)' : 'linear-gradient(135deg,#16a34a,#15803d)', border: 'none', color: '#fff', fontWeight: 900, fontSize: '15px', cursor: !date || from === to ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <Search style={{ width: 18, height: 18 }} />Tafuta Mabasi
          </button>
        </div>
      </div>
    </div>
  );

  // ── OPERATORS ──
  if (step === 'operators') return (
    <div style={{ minHeight: '100vh', background: '#080d08', color: '#fff', paddingBottom: 40 }}>
      <div className="sticky top-0 z-20" style={{ background: 'rgba(8,13,8,0.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <button onClick={() => setStep('search')} style={{ padding: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft style={{ width: 20, height: 20, color: '#fff' }} />
          </button>
          <div><p style={{ fontSize: '16px', fontWeight: 900, color: '#fff' }}>{from} → {to}</p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{date} · {passengers} abiria</p></div>
        </div>
        <p style={{ fontSize: '12px', color: accent, fontWeight: 700 }}>{OPERATORS.length} waendeshaji wanapatikana</p>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {OPERATORS.map(op => {
          const cls = CLASS_COLORS[op.class] ?? '#4ade80';
          return (
            <button key={op.id} onClick={() => { setSelectedOp(op); setSelectedSeats([]); setStep('seats'); }}
              className="active:scale-[0.98] transition-transform text-left"
              style={{ width: '100%', padding: '18px', borderRadius: 20, background: 'linear-gradient(160deg,#052e16 0%,#14532d 60%,#166534 100%)', border: '1px solid rgba(74,222,128,0.2)', boxShadow: '0 4px 20px rgba(22,163,74,0.15)', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontSize: '28px' }}>{op.logo}</div>
                  <div>
                    <p style={{ fontSize: '16px', fontWeight: 900, color: '#fff' }}>{op.name}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: 8, background: `${cls}20`, color: cls, fontWeight: 800 }}>{op.class}</span>
                      <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 700 }}>★ {op.rating}</span>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '20px', fontWeight: 900, color: '#fff' }}>{fmt(op.price)}</p>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)' }}>kwa mtu</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '20px', fontWeight: 900, color: '#fff' }}>{op.departure}</p>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{from.split(' ')[0]}</p>
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{op.duration}</p>
                  <div style={{ height: 1, background: 'rgba(74,222,128,0.3)' }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '20px', fontWeight: 900, color: '#fff' }}>{op.arrival}</p>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{to.split(' ')[0]}</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
                {op.amenities.map(a => <span key={a} style={{ fontSize: '10px', padding: '3px 8px', borderRadius: 8, background: 'rgba(74,222,128,0.1)', color: accent, fontWeight: 700 }}>{a}</span>)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid rgba(74,222,128,0.15)' }}>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Nafasi {op.seats} zimebaki</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 12, background: '#16a34a' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#fff' }}>Chagua</span>
                  <ChevronRight style={{ width: 13, height: 13, color: '#fff' }} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  // ── SEAT SELECTION ──
  if (step === 'seats' && selectedOp) return (
    <div style={{ minHeight: '100vh', background: '#080d08', color: '#fff', paddingBottom: 100 }}>
      <div className="sticky top-0 z-20" style={{ background: 'rgba(8,13,8,0.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <button onClick={() => setStep('operators')} style={{ padding: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft style={{ width: 20, height: 20, color: '#fff' }} />
          </button>
          <div><p style={{ fontSize: '16px', fontWeight: 900, color: '#fff' }}>Chagua Viti</p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{selectedOp.name} · {selectedSeats.length}/{passengers} vimechaguliwa</p></div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[{c:'rgba(74,222,128,0.15)',l:'Inapatikana'},{c:'#16a34a',l:'Umechagua'},{c:'rgba(255,255,255,0.15)',l:'Imechukuliwa'}].map(({c,l})=>(
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: c }} />
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px 16px' }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '20px', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <Bus style={{ width: 32, height: 32, color: accent }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {Array.from({ length: totalSeats }, (_, i) => i + 1).map(n => {
              const taken = takenSeats.includes(n);
              const sel = selectedSeats.includes(n);
              return (
                <button key={n} onClick={() => toggleSeat(n)} disabled={taken}
                  style={{ height: 44, borderRadius: 10, fontSize: '12px', fontWeight: 800, border: 'none', cursor: taken ? 'not-allowed' : 'pointer', transition: 'all 0.15s ease',
                    background: taken ? 'rgba(255,255,255,0.08)' : sel ? '#16a34a' : 'rgba(74,222,128,0.1)',
                    color: taken ? 'rgba(255,255,255,0.25)' : sel ? '#fff' : accent,
                    outline: sel ? '2px solid #4ade80' : 'none' }}>
                  {n}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderRadius: 14, background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', marginBottom: 16 }}>
          <MapPin style={{ width: 14, height: 14, color: accent }} />
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Mahali pa kupanda: <strong style={{ color: '#fff' }}>{selectedOp.boardingPoint}</strong></span>
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '14px 16px', background: 'rgba(8,13,8,0.97)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Jumla ya Malipo</span>
          <span style={{ fontSize: '20px', fontWeight: 900, color: '#fff' }}>{fmt(selectedOp.price * passengers)}</span>
        </div>
        <button onClick={() => selectedSeats.length === passengers && setStep('payment')} disabled={selectedSeats.length !== passengers}
          style={{ width: '100%', height: 52, borderRadius: 16, background: selectedSeats.length === passengers ? 'linear-gradient(135deg,#16a34a,#15803d)' : 'rgba(22,163,74,0.3)', border: 'none', color: '#fff', fontWeight: 900, fontSize: '15px', cursor: selectedSeats.length !== passengers ? 'not-allowed' : 'pointer' }}>
          {selectedSeats.length === passengers ? 'Endelea Kulipa' : `Chagua viti ${passengers - selectedSeats.length} zaidi`}
        </button>
      </div>
    </div>
  );

  // ── PAYMENT ──
  if (step === 'payment' && selectedOp) return (
    <div style={{ minHeight: '100vh', background: '#080d08', color: '#fff', paddingBottom: 40 }}>
      <div className="sticky top-0 z-20" style={{ background: 'rgba(8,13,8,0.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => setStep('seats')} style={{ padding: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft style={{ width: 20, height: 20, color: '#fff' }} />
        </button>
        <h1 style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>Thibitisha na Lipa</h1>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ padding: '18px', borderRadius: 20, background: 'linear-gradient(135deg,#052e16,#14532d)', border: '1px solid rgba(74,222,128,0.2)' }}>
          {[['Waendeshaji', selectedOp.name],['Darasa', selectedOp.class],['Safari', `${from} → ${to}`],['Tarehe', date],['Kuondoka', selectedOp.departure],['Abiria', `${passengers}`],['Viti', selectedSeats.join(', ')]].map(([k,v])=>(
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{k}</span>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#fff' }}>{v}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12 }}>
            <span style={{ fontSize: '14px', fontWeight: 900, color: '#fff' }}>Jumla</span>
            <span style={{ fontSize: '20px', fontWeight: 900, color: '#4ade80' }}>{fmt(selectedOp.price * passengers)}</span>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>Ingiza PIN ya Kuthibitisha</label>
          <input type="password" maxLength={4} placeholder="● ● ● ●" value={pin} onChange={e => setPin(e.target.value)}
            style={{ width: '100%', height: 56, textAlign: 'center', fontSize: '24px', letterSpacing: '8px', borderRadius: 14, background: 'rgba(255,255,255,0.07)', border: `1px solid ${pin.length===4?'#4ade80':'rgba(255,255,255,0.12)'}`, color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
        </div>

        <button onClick={handlePay} disabled={processing || pin.length !== 4}
          style={{ width: '100%', height: 52, borderRadius: 16, background: pin.length===4 ? 'linear-gradient(135deg,#16a34a,#15803d)' : 'rgba(22,163,74,0.3)', border: 'none', color: '#fff', fontWeight: 900, fontSize: '15px', cursor: pin.length!==4 ? 'not-allowed' : 'pointer', boxShadow: '0 4px 20px rgba(22,163,74,0.3)' }}>
          {processing ? 'Inashughulikia...' : `Lipa ${fmt(selectedOp.price * passengers)}`}
        </button>
      </div>
    </div>
  );

  // ── CONFIRMATION ──
  return (
    <div style={{ minHeight: '100vh', background: '#080d08', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <style>{`@keyframes si{0%{transform:scale(0);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}`}</style>
      <div style={{ textAlign: 'center', maxWidth: 380, width: '100%', color: '#fff' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#16a34a,#15803d)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', animation: 'si 0.5s ease-out', boxShadow: '0 8px 40px rgba(22,163,74,0.4)' }}>
          <Check style={{ width: 38, height: 38, color: '#fff' }} />
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 900, marginBottom: 6 }}>Tiketi Imethibitishwa!</h1>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>Tiketi yako ya dijitali iko tayari</p>

        <div style={{ padding: '16px', borderRadius: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: 16 }}>
          <div style={{ background: 'linear-gradient(135deg,#052e16,#14532d)', borderRadius: 14, padding: '16px', marginBottom: 12 }}>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Nambari ya Tiketi</p>
            <p style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '2px', color: '#4ade80' }}>{ticketRef}</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '52px', marginBottom: 6 }}>🎟️</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Shield style={{ width: 13, height: 13, color: '#4ade80' }} />
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#4ade80' }}>Inafanya kazi bila mtandao</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '14px 16px', borderRadius: 16, background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', marginBottom: 20 }}>
          <p style={{ fontSize: '13px', fontWeight: 800, color: '#4ade80', marginBottom: 4 }}>📱 Tiketi imetumwa kwa SMS</p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Onyesha tiketi hii kwenye gari. Fika mapema dakika 30.</p>
        </div>

        <button onClick={onBack} style={{ width: '100%', height: 52, borderRadius: 16, background: 'linear-gradient(135deg,#16a34a,#15803d)', border: 'none', color: '#fff', fontWeight: 900, fontSize: '15px', cursor: 'pointer' }}>
          Rudi Nyumbani
        </button>
      </div>
    </div>
  );
}
