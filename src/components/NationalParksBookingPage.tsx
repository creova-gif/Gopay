import { useState } from 'react';
import { ArrowLeft, Mountain, Check, Shield, Star, MapPin, Clock, ChevronRight, Sparkles } from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { User } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Props { user: User; accessToken: string; onBack: () => void; }

interface Park {
  id: string; name: string; region: string; image: string;
  entryFee: { resident: number; nonResident: number };
  rating: number; highlights: string[]; category: string;
  packages: Package[];
}

interface Package {
  id: string; name: string; price: number; duration: string;
  includes: string[]; badge?: string;
}

const PARKS: Park[] = [
  {
    id: 'serengeti', name: 'Serengeti', region: 'Mara Region', rating: 4.9,
    image: 'https://images.unsplash.com/photo-1641133292545-32e441e60190?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    category: 'UNESCO',
    entryFee: { resident: 5000, nonResident: 70 },
    highlights: ['The Great Migration', 'Big Five', 'Hot Air Balloon'],
    packages: [
      { id: 'ser-day', name: 'Siku Moja ya Safari', price: 280000, duration: '1 siku', includes: ['Mwongozo', 'Gari', 'Chakula cha mchana', 'Leseni'], badge: 'Maarufu' },
      { id: 'ser-2d', name: 'Usiku 1 / Siku 2', price: 580000, duration: '2 siku', includes: ['Mwongozo', 'Gari', 'Chakula cha mchana 2x', 'Leseni', 'Kambi ya usiku'] },
      { id: 'ser-3d', name: 'Uzoefu Kamili', price: 950000, duration: '3 siku', includes: ['Gari la kibinafsi', 'Mwongozo mtaalamu', 'Chakula 3x', 'Hoteli/Kambi', 'Leseni'] },
    ],
  },
  {
    id: 'ngorongoro', name: 'Ngorongoro', region: 'Arusha Region', rating: 4.8,
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    category: 'UNESCO',
    entryFee: { resident: 5000, nonResident: 70 },
    highlights: ['Crater Safari', 'Big Five', 'Maasai Culture'],
    packages: [
      { id: 'ngo-day', name: 'Crater Safari', price: 310000, duration: '1 siku', includes: ['Mwongozo', 'Gari 4x4', 'Chakula', 'Leseni'], badge: 'Kipekee' },
      { id: 'ngo-2d', name: 'Crater + Rim', price: 620000, duration: '2 siku', includes: ['Gari', 'Mwongozo', 'Chakula 2x', 'Hoteli'] },
    ],
  },
  {
    id: 'kilimanjaro', name: 'Kilimanjaro NP', region: 'Kilimanjaro Region', rating: 4.7,
    image: 'https://images.unsplash.com/photo-1650668302197-7f556c34cb91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    category: 'UNESCO',
    entryFee: { resident: 5000, nonResident: 70 },
    highlights: ['Mount Summit', 'Uhuru Peak', 'Scenic Trails'],
    packages: [
      { id: 'kili-day', name: 'Siku ya Kutembelea', price: 180000, duration: '1 siku', includes: ['Mwongozo', 'Leseni', 'Chakula kidogo'] },
      { id: 'kili-5d', name: 'Marangu Route 5D', price: 2800000, duration: '5 siku', includes: ['Mwongozo', 'Vibeba', 'Chakula 3x', 'Kambi', 'Leseni', 'Gari'] },
    ],
  },
  {
    id: 'tarangire', name: 'Tarangire NP', region: 'Manyara Region', rating: 4.6,
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    category: 'Wildlife',
    entryFee: { resident: 3500, nonResident: 50 },
    highlights: ['Elephant Herds', 'Baobab Trees', 'Bird Watching'],
    packages: [
      { id: 'tar-day', name: 'Safari ya Siku Moja', price: 220000, duration: '1 siku', includes: ['Mwongozo', 'Gari 4x4', 'Chakula', 'Leseni'], badge: 'Bora' },
    ],
  },
  {
    id: 'zanzibar', name: 'Jozani Forest', region: 'Zanzibar', rating: 4.5,
    image: 'https://images.unsplash.com/photo-1707296450219-2d9cc08bdef0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    category: 'Forest',
    entryFee: { resident: 3000, nonResident: 10 },
    highlights: ['Red Colobus Monkey', 'Mangroves', 'Nature Walk'],
    packages: [
      { id: 'joz-tour', name: 'Ziara ya Msitu', price: 45000, duration: '2-3 masaa', includes: ['Mwongozo', 'Leseni', 'Matembezi'], badge: 'Bei Nafuu' },
    ],
  },
];

const darkInput: React.CSSProperties = {
  width: '100%', height: 52, padding: '0 16px', borderRadius: 14,
  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
  color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const,
};

export function NationalParksBookingPage({ user, accessToken, onBack }: Props) {
  const [step, setStep] = useState<'browse' | 'detail' | 'package' | 'details' | 'payment' | 'confirmation'>('browse');
  const [selectedPark, setSelectedPark] = useState<Park | null>(null);
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [visitDate, setVisitDate] = useState('');
  const [visitors, setVisitors] = useState(1);
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [nationality, setNationality] = useState('Mtanzania');
  const [pin, setPin] = useState('');
  const [processing, setProcessing] = useState(false);
  const [permitRef, setPermitRef] = useState('');

  const fmt = (n: number) => `TZS ${n.toLocaleString()}`;
  const accent = '#34d399';

  const handlePay = async () => {
    if (!selectedPark || !selectedPkg || pin.length !== 4) return;
    setProcessing(true);
    try {
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/travel/parks/book`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ park: selectedPark.id, package: selectedPkg.id, date: visitDate, visitors, visitorName, visitorPhone, nationality, total: selectedPkg.price * visitors, pin }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Imeshindwa kufanya booking. Jaribu tena.');
        return;
      }
      setPermitRef(data.reference);
      setStep('confirmation');
    } catch {
      toast.error('Hitilafu ya mtandao. Angalia muunganisho wako na ujaribu tena.');
    } finally { setProcessing(false); }
  };

  if (step === 'browse') return (
    <div style={{ minHeight: '100vh', background: '#080d08', color: '#fff', paddingBottom: 40 }}>
      <div className="sticky top-0 z-20" style={{ background: 'rgba(8,13,8,0.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ padding: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft style={{ width: 20, height: 20, color: '#fff' }} />
        </button>
        <div><h1 style={{ fontSize: '20px', fontWeight: 900, color: '#fff' }}>Mbuga za Taifa</h1>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Mbuga 16 · Vibali Rasmi · TANAPA</p></div>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {PARKS.map(park => (
          <button key={park.id} onClick={() => { setSelectedPark(park); setStep('detail'); }}
            className="active:scale-[0.98] transition-transform text-left"
            style={{ width: '100%', borderRadius: 20, overflow: 'hidden', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer' }}>
            <div style={{ position: 'relative', height: 150 }}>
              <ImageWithFallback src={park.image} alt={park.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(8,13,8,0.2) 0%, rgba(8,13,8,0.8) 100%)' }} />
              <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
                <span style={{ fontSize: '10px', padding: '4px 10px', borderRadius: 20, background: '#047857', color: '#fff', fontWeight: 900 }}>{park.category}</span>
              </div>
              <div style={{ position: 'absolute', top: 10, right: 10 }}>
                <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: 10, background: 'rgba(0,0,0,0.5)', color: '#fbbf24', fontWeight: 700 }}>★ {park.rating}</span>
              </div>
              <div style={{ position: 'absolute', bottom: 10, left: 14, right: 14, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>{park.name}</p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin style={{ width: 10, height: 10 }} />{park.region}
                  </p>
                </div>
                <p style={{ fontSize: '12px', fontWeight: 800, color: '#34d399' }}>Kuanzia {fmt(park.packages[0].price)}</p>
              </div>
            </div>
            <div style={{ padding: '12px 14px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {park.highlights.map(h => <span key={h} style={{ fontSize: '11px', padding: '4px 9px', borderRadius: 10, background: 'rgba(52,211,153,0.1)', color: accent, fontWeight: 700 }}>{h}</span>)}
              <ChevronRight style={{ marginLeft: 'auto', width: 16, height: 16, color: 'rgba(255,255,255,0.3)', alignSelf: 'center' }} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  if (step === 'detail' && selectedPark) return (
    <div style={{ minHeight: '100vh', background: '#080d08', color: '#fff', paddingBottom: 40 }}>
      <div style={{ position: 'relative', height: 260 }}>
        <ImageWithFallback src={selectedPark.image} alt={selectedPark.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(8,13,8,0.4) 0%, rgba(8,13,8,0.9) 100%)' }} />
        <div style={{ position: 'absolute', top: 16, left: 16 }}>
          <button onClick={() => setStep('browse')} style={{ padding: 10, borderRadius: '50%', background: 'rgba(8,13,8,0.7)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}>
            <ArrowLeft style={{ width: 18, height: 18, color: '#fff' }} />
          </button>
        </div>
        <div style={{ position: 'absolute', bottom: 20, left: 16, right: 16 }}>
          <p style={{ fontSize: '26px', fontWeight: 900, color: '#fff', marginBottom: 4 }}>{selectedPark.name}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 700 }}>★ {selectedPark.rating}</span>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{selectedPark.region}</span>
            <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: 8, background: '#047857', color: '#fff', fontWeight: 700 }}>{selectedPark.category}</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 16px' }}>
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: '14px', fontWeight: 800, color: 'rgba(255,255,255,0.7)', marginBottom: 10 }}>Vivutio Vya Mbuga</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {selectedPark.highlights.map(h => <span key={h} style={{ fontSize: '12px', padding: '6px 12px', borderRadius: 12, background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.25)', color: accent, fontWeight: 700 }}>{h}</span>)}
          </div>
        </div>

        <p style={{ fontSize: '15px', fontWeight: 800, color: '#fff', marginBottom: 12 }}>Chagua Pakiti</p>
        {selectedPark.packages.map(pkg => (
          <button key={pkg.id} onClick={() => { setSelectedPkg(pkg); setStep('details'); }}
            className="active:scale-[0.98] transition-transform text-left"
            style={{ width: '100%', marginBottom: 10, padding: '18px', borderRadius: 18, background: 'linear-gradient(160deg,#022c22,#065f46,#047857)', border: '1px solid rgba(52,211,153,0.25)', cursor: 'pointer', boxShadow: '0 4px 20px rgba(4,120,87,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <p style={{ fontSize: '15px', fontWeight: 900, color: '#fff' }}>{pkg.name}</p>
                  {pkg.badge && <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: 8, background: 'rgba(251,191,36,0.2)', color: '#fbbf24', fontWeight: 800 }}>{pkg.badge}</span>}
                </div>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock style={{ width: 11, height: 11 }} />{pkg.duration}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>{fmt(pkg.price)}</p>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)' }}>kwa mtu</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {pkg.includes.slice(0, 4).map(inc => <span key={inc} style={{ fontSize: '10px', padding: '3px 8px', borderRadius: 8, background: 'rgba(52,211,153,0.1)', color: accent, fontWeight: 700 }}>✓ {inc}</span>)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  if (step === 'details') return (
    <div style={{ minHeight: '100vh', background: '#080d08', color: '#fff', paddingBottom: 40 }}>
      <div className="sticky top-0 z-20" style={{ background: 'rgba(8,13,8,0.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => setStep('detail')} style={{ padding: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft style={{ width: 20, height: 20, color: '#fff' }} />
        </button>
        <h1 style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>Maelezo ya Wageni</h1>
      </div>
      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ padding: '14px 16px', borderRadius: 16, background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}>
          <p style={{ fontSize: '14px', fontWeight: 900, color: '#fff' }}>{selectedPark?.name} · {selectedPkg?.name}</p>
          <p style={{ fontSize: '13px', fontWeight: 800, color: accent }}>Kwa mtu: {selectedPkg ? fmt(selectedPkg.price) : ''}</p>
        </div>
        {[{ label: 'TAREHE YA ZIARA', el: <input type="date" value={visitDate} onChange={e => setVisitDate(e.target.value)} min={new Date().toISOString().split('T')[0]} style={darkInput} /> },
          { label: 'IDADI YA WAGENI', el: (
            <div style={{ display: 'flex', alignItems: 'center', height: 52, gap: 8 }}>
              <button onClick={() => setVisitors(Math.max(1, visitors-1))} style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '18px', cursor: 'pointer' }}>−</button>
              <span style={{ flex: 1, textAlign: 'center', fontSize: '22px', fontWeight: 900, color: '#fff' }}>{visitors}</span>
              <button onClick={() => setVisitors(Math.min(20, visitors+1))} style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '18px', cursor: 'pointer' }}>+</button>
            </div>
          )},
          { label: 'JINA KAMILI', el: <input type="text" value={visitorName} onChange={e => setVisitorName(e.target.value)} placeholder="Jina la mtembeaji mkuu" style={darkInput} /> },
          { label: 'SIMU', el: <input type="tel" value={visitorPhone} onChange={e => setVisitorPhone(e.target.value)} placeholder="+255 XXX XXX XXX" style={darkInput} /> },
          { label: 'UTAIFA', el: (
            <select value={nationality} onChange={e => setNationality(e.target.value)} style={darkInput}>
              <option value="Mtanzania" style={{ background: '#0f1a0f' }}>Mtanzania (Bei ya ndani)</option>
              <option value="Mwafrika" style={{ background: '#0f1a0f' }}>Mwafrika Mwingine</option>
              <option value="Mgeni" style={{ background: '#0f1a0f' }}>Mgeni wa Kimataifa</option>
            </select>
          )},
        ].map(({ label, el }) => (
          <div key={label}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>{label}</label>
            {el}
          </div>
        ))}
        <button onClick={() => visitDate && visitorName && visitorPhone && setStep('payment')} disabled={!visitDate || !visitorName || !visitorPhone}
          style={{ width: '100%', height: 52, borderRadius: 16, background: visitDate && visitorName && visitorPhone ? 'linear-gradient(135deg,#047857,#065f46)' : 'rgba(4,120,87,0.3)', border: 'none', color: '#fff', fontWeight: 900, fontSize: '15px', cursor: !visitDate || !visitorName || !visitorPhone ? 'not-allowed' : 'pointer' }}>
          Endelea Kulipa
        </button>
      </div>
    </div>
  );

  if (step === 'payment') return (
    <div style={{ minHeight: '100vh', background: '#080d08', color: '#fff', paddingBottom: 40 }}>
      <div className="sticky top-0 z-20" style={{ background: 'rgba(8,13,8,0.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => setStep('details')} style={{ padding: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft style={{ width: 20, height: 20, color: '#fff' }} />
        </button>
        <h1 style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>Thibitisha na Lipa</h1>
      </div>
      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ padding: '18px', borderRadius: 20, background: 'linear-gradient(135deg,#022c22,#065f46)', border: '1px solid rgba(52,211,153,0.2)' }}>
          {[['Mbuga', selectedPark?.name ?? ''], ['Pakiti', selectedPkg?.name ?? ''], ['Tarehe', visitDate], ['Wageni', `${visitors}`], ['Jina', visitorName]].map(([k,v])=>(
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{k}</span>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#fff' }}>{v}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12 }}>
            <span style={{ fontSize: '14px', fontWeight: 900, color: '#fff' }}>Jumla</span>
            <span style={{ fontSize: '20px', fontWeight: 900, color: accent }}>{selectedPkg ? fmt(selectedPkg.price * visitors) : '–'}</span>
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>PIN ya Kuthibitisha</label>
          <input type="password" maxLength={4} placeholder="● ● ● ●" value={pin} onChange={e => setPin(e.target.value)}
            style={{ width: '100%', height: 56, textAlign: 'center', fontSize: '24px', letterSpacing: '8px', borderRadius: 14, background: 'rgba(255,255,255,0.07)', border: `1px solid ${pin.length===4?accent:'rgba(255,255,255,0.12)'}`, color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <button onClick={handlePay} disabled={processing || pin.length !== 4}
          style={{ width: '100%', height: 52, borderRadius: 16, background: pin.length===4 ? 'linear-gradient(135deg,#047857,#065f46)' : 'rgba(4,120,87,0.3)', border: 'none', color: '#fff', fontWeight: 900, fontSize: '15px', cursor: pin.length!==4?'not-allowed':'pointer' }}>
          {processing ? 'Inashughulikia...' : selectedPkg ? `Lipa ${fmt(selectedPkg.price * visitors)}` : 'Lipa'}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#080d08', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <style>{`@keyframes si{0%{transform:scale(0)}70%{transform:scale(1.1)}100%{transform:scale(1)}}`}</style>
      <div style={{ textAlign: 'center', maxWidth: 360, width: '100%', color: '#fff' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#047857,#065f46)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', animation: 'si 0.5s ease-out', boxShadow: '0 8px 40px rgba(4,120,87,0.4)' }}>
          <Check style={{ width: 38, height: 38, color: '#fff' }} />
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 900, marginBottom: 6 }}>Ruhusa Imetolewa!</h1>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>Kibali chako cha kuingia kimeidhinishwa</p>
        <div style={{ padding: '16px', borderRadius: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: 16 }}>
          <div style={{ background: 'linear-gradient(135deg,#022c22,#065f46)', borderRadius: 14, padding: '16px', marginBottom: 12 }}>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Nambari ya Kibali</p>
            <p style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '2px', color: accent }}>{permitRef}</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: 6 }}>🌿</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Shield style={{ width: 12, height: 12, color: accent }} />
                <span style={{ fontSize: '11px', fontWeight: 700, color: accent }}>Kibali Rasmi cha TANAPA</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: '14px', borderRadius: 16, background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', marginBottom: 20 }}>
          <p style={{ fontSize: '13px', fontWeight: 800, color: accent, marginBottom: 4 }}>📱 Kibali kimesent kwa SMS</p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Onyesha kibali hiki langoni. Furahia safari!</p>
        </div>
        <button onClick={onBack} style={{ width: '100%', height: 52, borderRadius: 16, background: 'linear-gradient(135deg,#16a34a,#15803d)', border: 'none', color: '#fff', fontWeight: 900, fontSize: '15px', cursor: 'pointer' }}>Rudi Nyumbani</button>
      </div>
    </div>
  );
}
