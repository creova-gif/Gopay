import { useState } from 'react';
import { ArrowLeft, Plane, Search, ArrowRight, Clock, Shield, Zap, Users, Calendar, ChevronDown } from 'lucide-react';
import { FlightBookingPage } from './FlightBookingPage';

interface Props { accessToken: string; onBack: () => void; }

interface Flight {
  id: string; airline: string; from: string; to: string;
  departure: string; arrival: string; duration: string;
  price: number; seats: number; aircraftType: string;
}

const TZ_AIRPORTS = [
  { code: 'DAR', name: 'Dar es Salaam', full: 'Julius Nyerere International' },
  { code: 'ZNZ', name: 'Zanzibar',       full: 'Abeid Amani Karume International' },
  { code: 'JRO', name: 'Kilimanjaro',    full: 'Kilimanjaro International' },
  { code: 'MWZ', name: 'Mwanza',         full: 'Mwanza Airport' },
  { code: 'ARK', name: 'Arusha',         full: 'Arusha Airport' },
  { code: 'DOD', name: 'Dodoma',         full: 'Dodoma Airport' },
  { code: 'MBI', name: 'Mbeya',          full: 'Songwe Airport' },
];

const SAMPLE_FLIGHTS: Flight[] = [
  { id: 'PW101', airline: 'Precision Air', from: 'DAR', to: 'ZNZ', departure: '07:00', arrival: '07:40', duration: '40m', price: 155000, seats: 24, aircraftType: 'ATR 72' },
  { id: 'TC201', airline: 'Air Tanzania',  from: 'DAR', to: 'ZNZ', departure: '09:30', arrival: '10:10', duration: '40m', price: 170000, seats: 12, aircraftType: 'Bombardier Q400' },
  { id: 'PW103', airline: 'Precision Air', from: 'DAR', to: 'ZNZ', departure: '12:00', arrival: '12:40', duration: '40m', price: 145000, seats: 8,  aircraftType: 'ATR 72' },
  { id: 'PW201', airline: 'Precision Air', from: 'DAR', to: 'JRO', departure: '06:30', arrival: '07:45', duration: '1h 15m', price: 285000, seats: 18, aircraftType: 'ATR 72' },
  { id: 'TC301', airline: 'Air Tanzania',  from: 'DAR', to: 'JRO', departure: '10:00', arrival: '11:15', duration: '1h 15m', price: 310000, seats: 22, aircraftType: 'Bombardier Q400' },
  { id: 'PW301', airline: 'Precision Air', from: 'DAR', to: 'MWZ', departure: '08:00', arrival: '09:30', duration: '1h 30m', price: 340000, seats: 15, aircraftType: 'ATR 72' },
  { id: 'SA401', airline: 'Safari Air Link',from: 'JRO', to: 'DAR', departure: '13:00', arrival: '14:15', duration: '1h 15m', price: 275000, seats: 9,  aircraftType: 'Cessna Caravan' },
  { id: 'PW401', airline: 'Precision Air', from: 'ZNZ', to: 'DAR', departure: '08:30', arrival: '09:10', duration: '40m', price: 150000, seats: 20, aircraftType: 'ATR 72' },
];

const darkInput: React.CSSProperties = {
  width: '100%', height: 52, padding: '0 16px', borderRadius: 14,
  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
  color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const,
};

const sGlass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 18, padding: '16px',
};

export function FlightSearch({ accessToken, onBack }: Props) {
  const [step, setStep] = useState<'search' | 'results' | 'booking'>('search');
  const [fromCode, setFromCode] = useState('DAR');
  const [toCode, setToCode] = useState('ZNZ');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [results, setResults] = useState<Flight[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  const fmt = (n: number) => `TZS ${n.toLocaleString()}`;
  const fromAirport = TZ_AIRPORTS.find(a => a.code === fromCode)!;
  const toAirport   = TZ_AIRPORTS.find(a => a.code === toCode)!;

  const search = () => {
    const matches = SAMPLE_FLIGHTS.filter(f => f.from === fromCode && f.to === toCode);
    setResults(matches.length > 0 ? matches : SAMPLE_FLIGHTS.filter(f => f.from === fromCode).slice(0, 3));
    setStep('results');
  };

  const swap = () => { const t = fromCode; setFromCode(toCode); setToCode(t); };

  if (step === 'booking' && selectedFlight) {
    return (
      <FlightBookingPage
        flight={selectedFlight} passengers={passengers} departDate={date} accessToken={accessToken}
        onBack={() => setStep('results')} onBookingComplete={onBack} />
    );
  }

  if (step === 'results') {
    return (
      <div style={{ minHeight: '100vh', background: '#080d08', color: '#fff', paddingBottom: 40 }}>
        <div className="sticky top-0 z-20" style={{ background: 'rgba(8,13,8,0.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <button onClick={() => setStep('search')} style={{ padding: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer' }}>
              <ArrowLeft style={{ width: 20, height: 20, color: '#fff' }} />
            </button>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>{fromCode} → {toCode}</h1>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{date} · {passengers} abiria · Ndege za Ndani</p>
            </div>
          </div>
          <div style={{ padding: '8px 12px', borderRadius: 12, background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plane style={{ width: 14, height: 14, color: '#60a5fa' }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#60a5fa' }}>{results.length} ndege zilipatikana</span>
          </div>
        </div>

        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {results.map(fl => (
            <button key={fl.id} onClick={() => { setSelectedFlight(fl); setStep('booking'); }}
              className="active:scale-[0.98] transition-transform text-left"
              style={{ width: '100%', padding: '18px', borderRadius: 20, background: 'linear-gradient(160deg,#0f172a 0%,#1e3a8a 60%,#1d4ed8 100%)', border: '1px solid rgba(96,165,250,0.2)', boxShadow: '0 4px 20px rgba(29,78,216,0.2)', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 800, color: '#60a5fa', marginBottom: 3 }}>{fl.airline}</p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>{fl.aircraftType} · {fl.id}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '20px', fontWeight: 900, color: '#fff' }}>{fmt(fl.price)}</p>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>kwa mtu</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '22px', fontWeight: 900, color: '#fff' }}>{fl.departure}</p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{fl.from}</p>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>
                    <Clock style={{ width: 11, height: 11 }} />{fl.duration}
                  </div>
                  <div style={{ width: '100%', height: 1, background: 'rgba(96,165,250,0.3)', position: 'relative' }}>
                    <Plane style={{ position: 'absolute', right: 0, top: -7, width: 14, height: 14, color: '#60a5fa' }} />
                  </div>
                  <p style={{ fontSize: '10px', color: '#4ade80' }}>Moja kwa Moja</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '22px', fontWeight: 900, color: '#fff' }}>{fl.arrival}</p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{fl.to}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(96,165,250,0.15)' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: 10, background: 'rgba(96,165,250,0.15)', color: '#60a5fa', fontWeight: 700 }}>{fl.seats} nafasi</span>
                  <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: 10, background: 'rgba(74,222,128,0.12)', color: '#4ade80', fontWeight: 700 }}>Uthibitisho wa Papo Hapo</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 12, background: '#1d4ed8' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>Chagua</span>
                  <ArrowRight style={{ width: 14, height: 14, color: '#fff' }} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080d08', color: '#fff', paddingBottom: 40 }}>
      <div className="sticky top-0 z-20" style={{ background: 'rgba(8,13,8,0.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ padding: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft style={{ width: 20, height: 20, color: '#fff' }} />
          </button>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 900, color: '#fff' }}>Ndege za Ndani</h1>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Njia 40+ · Siku Moja</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Hero */}
        <div style={{ borderRadius: 22, overflow: 'hidden', position: 'relative', height: 160, background: 'linear-gradient(135deg,#0f172a,#1e3a8a,#1d4ed8)' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Plane style={{ width: 48, height: 48, color: '#60a5fa' }} />
            <p style={{ fontSize: '20px', fontWeight: 900, color: '#fff' }}>Tembelea Tanzania Yote</p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Precision Air · Air Tanzania · Safari Air Link</p>
          </div>
        </div>

        {/* Search Form */}
        <div style={sGlass}>
          <p style={{ fontSize: '13px', fontWeight: 800, color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>Chagua safari yako</p>

          {/* From / To with swap */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#60a5fa', marginBottom: 5 }}>KUTOKA</label>
              <select value={fromCode} onChange={e => setFromCode(e.target.value)} style={{ ...darkInput }}>
                {TZ_AIRPORTS.map(a => <option key={a.code} value={a.code} style={{ background: '#0f1a0f' }}>{a.code} – {a.name}</option>)}
              </select>
            </div>
            <button onClick={swap} style={{ padding: '10px', borderRadius: 12, background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)', cursor: 'pointer', flexShrink: 0, marginTop: 20 }}>
              <ArrowRight style={{ width: 18, height: 18, color: '#60a5fa' }} />
            </button>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#60a5fa', marginBottom: 5 }}>KWENDA</label>
              <select value={toCode} onChange={e => setToCode(e.target.value)} style={{ ...darkInput }}>
                {TZ_AIRPORTS.map(a => <option key={a.code} value={a.code} style={{ background: '#0f1a0f' }}>{a.code} – {a.name}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 5 }}>
                <Calendar style={{ width: 12, height: 12 }} />TAREHE
              </label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} style={{ ...darkInput }} />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 5 }}>
                <Users style={{ width: 12, height: 12 }} />ABIRIA
              </label>
              <div style={{ display: 'flex', alignItems: 'center', height: 52, gap: 8 }}>
                <button onClick={() => setPassengers(Math.max(1, passengers - 1))} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '18px', cursor: 'pointer' }}>−</button>
                <span style={{ flex: 1, textAlign: 'center', fontSize: '20px', fontWeight: 900, color: '#fff' }}>{passengers}</span>
                <button onClick={() => setPassengers(Math.min(9, passengers + 1))} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '18px', cursor: 'pointer' }}>+</button>
              </div>
            </div>
          </div>

          <button onClick={search} disabled={!date || fromCode === toCode}
            style={{ width: '100%', height: 52, borderRadius: 16, background: fromCode === toCode || !date ? 'rgba(29,78,216,0.4)' : 'linear-gradient(135deg,#1d4ed8,#2563eb)', border: 'none', color: '#fff', fontWeight: 900, fontSize: '15px', cursor: fromCode === toCode || !date ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <Search style={{ width: 18, height: 18 }} />
            Tafuta Ndege
          </button>
        </div>

        {/* Features */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { Icon: Shield, label: 'Salama', color: '#4ade80' },
            { Icon: Zap,    label: 'Papo Hapo', color: '#60a5fa' },
            { Icon: Clock,  label: 'Siku Moja', color: '#fbbf24' },
          ].map(({ Icon, label, color }) => (
            <div key={label} style={{ ...sGlass, padding: '14px 10px', textAlign: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                <Icon style={{ width: 18, height: 18, color }} />
              </div>
              <p style={{ fontSize: '11px', fontWeight: 800, color: '#fff' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
