import { useState } from 'react';
import { ArrowLeft, Hotel, Search, Star, MapPin, Wifi, Coffee, Car, Dumbbell, ChevronRight } from 'lucide-react';
import { HotelBookingPage } from './HotelBookingPage';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Props { accessToken: string; onBack: () => void; }

interface HotelItem {
  id: string; name: string; location: string; city: string;
  rating: number; reviews: number; image: string;
  description: string; amenities: string[];
  priceFrom: number; category: string;
}

const TZ_CITIES = ['Dar es Salaam', 'Zanzibar', 'Arusha', 'Moshi', 'Mwanza', 'Dodoma', 'Mbeya'];

const HOTELS: HotelItem[] = [
  { id: 'h001', name: 'Serena Hotel Dar es Salaam', location: 'Ohio St, City Centre', city: 'Dar es Salaam', rating: 4.8, reviews: 2341, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', description: '5-star luxury on Dar harbour', amenities: ['Pool', 'Spa', 'WiFi', 'Gym', 'Restaurant', 'Bar', 'Valet'], priceFrom: 320000, category: '5 Nyota' },
  { id: 'h002', name: 'Hyatt Regency Dar', location: 'Jakaya Kikwete Road', city: 'Dar es Salaam', rating: 4.7, reviews: 1876, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', description: 'Premium business hotel', amenities: ['Pool', 'WiFi', 'Gym', 'Business Centre', 'Restaurant'], priceFrom: 280000, category: '5 Nyota' },
  { id: 'h003', name: 'Zanzibar Beach Resort', location: 'Nungwi Beach', city: 'Zanzibar', rating: 4.9, reviews: 3210, image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', description: 'Paradise on white sand beach', amenities: ['Beach', 'Pool', 'WiFi', 'Snorkelling', 'Spa', 'Restaurant'], priceFrom: 450000, category: 'Resort' },
  { id: 'h004', name: "Emerson Spice Hotel", location: 'Stone Town', city: 'Zanzibar', rating: 4.7, reviews: 987, image: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', description: 'Historic boutique in Stone Town', amenities: ['WiFi', 'Rooftop Restaurant', 'Spa'], priceFrom: 380000, category: 'Boutique' },
  { id: 'h005', name: 'Arusha Serena Hotel', location: 'Serengeti Rd', city: 'Arusha', rating: 4.6, reviews: 1543, image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', description: 'Safari gateway luxury hotel', amenities: ['Pool', 'WiFi', 'Gym', 'Restaurant', 'Bar', 'Safari Desk'], priceFrom: 240000, category: '5 Nyota' },
  { id: 'h006', name: 'Kilimanjaro Kibo Summit', location: 'Moshi Town', city: 'Moshi', rating: 4.5, reviews: 876, image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', description: 'Mountain views, perfect for trekkers', amenities: ['WiFi', 'Restaurant', 'Laundry', 'Trek Briefing'], priceFrom: 140000, category: '4 Nyota' },
  { id: 'h007', name: 'Slipway Hotel Masaki', location: 'Slipway, Masaki', city: 'Dar es Salaam', rating: 4.4, reviews: 1234, image: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', description: 'Waterfront boutique hotel', amenities: ['Pool', 'WiFi', 'Restaurant', 'Parking'], priceFrom: 180000, category: 'Boutique' },
  { id: 'h008', name: 'Mwanza Tilapia Hotel', location: 'Station Rd', city: 'Mwanza', rating: 4.3, reviews: 654, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', description: 'By Lake Victoria', amenities: ['WiFi', 'Restaurant', 'Parking', 'Lake Views'], priceFrom: 120000, category: '4 Nyota' },
];

const AMENITY_ICONS: Record<string, typeof Wifi> = { WiFi: Wifi, Pool: Dumbbell, Restaurant: Coffee, Parking: Car };

const darkInput: React.CSSProperties = {
  width: '100%', height: 52, padding: '0 16px', borderRadius: 14,
  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
  color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const,
};

const CAT_COLORS: Record<string, string> = { '5 Nyota': '#fbbf24', '4 Nyota': '#60a5fa', 'Resort': '#f472b6', 'Boutique': '#c084fc' };

export function HotelSearchPage({ accessToken, onBack }: Props) {
  const [step, setStep] = useState<'search' | 'list' | 'booking'>('search');
  const [city, setCity] = useState('Dar es Salaam');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [selectedHotel, setSelectedHotel] = useState<HotelItem | null>(null);

  const fmt = (n: number) => `TZS ${n.toLocaleString()}`;
  const accent = '#fb923c';
  const results = HOTELS.filter(h => h.city === city);

  const nights = checkIn && checkOut
    ? Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : 1;

  if (step === 'booking' && selectedHotel) {
    const hotelForBooking = { id: selectedHotel.id, name: selectedHotel.name, location: selectedHotel.location, city: selectedHotel.city, rating: selectedHotel.rating, reviews: selectedHotel.reviews, image: selectedHotel.image, description: selectedHotel.description, amenities: selectedHotel.amenities };
    return (
      <HotelBookingPage hotel={hotelForBooking} checkIn={checkIn} checkOut={checkOut} guests={guests} accessToken={accessToken} onBack={() => setStep('list')} onBookingComplete={onBack} />
    );
  }

  if (step === 'list') return (
    <div style={{ minHeight: '100vh', background: '#080d08', color: '#fff', paddingBottom: 40 }}>
      <div className="sticky top-0 z-20" style={{ background: 'rgba(8,13,8,0.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <button onClick={() => setStep('search')} style={{ padding: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft style={{ width: 20, height: 20, color: '#fff' }} />
          </button>
          <div>
            <p style={{ fontSize: '16px', fontWeight: 900, color: '#fff' }}>{city}</p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{checkIn} → {checkOut} · {guests} mgeni · {nights} usiku</p>
          </div>
        </div>
        <p style={{ fontSize: '12px', fontWeight: 700, color: accent }}>{results.length} hoteli zilipatikana</p>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {results.map(hotel => {
          const clr = CAT_COLORS[hotel.category] ?? '#fb923c';
          return (
            <button key={hotel.id} onClick={() => { setSelectedHotel(hotel); setStep('booking'); }}
              className="active:scale-[0.98] transition-transform text-left"
              style={{ width: '100%', borderRadius: 20, overflow: 'hidden', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer' }}>
              <div style={{ position: 'relative', height: 160 }}>
                <ImageWithFallback src={hotel.image} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(8,13,8,0.2) 0%, rgba(8,13,8,0.7) 100%)' }} />
                <div style={{ position: 'absolute', top: 10, left: 10 }}>
                  <span style={{ fontSize: '10px', padding: '4px 10px', borderRadius: 20, background: `${clr}25`, color: clr, fontWeight: 800, border: `1px solid ${clr}40` }}>{hotel.category}</span>
                </div>
                <div style={{ position: 'absolute', bottom: 10, left: 14, right: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: '17px', fontWeight: 900, color: '#fff', marginBottom: 2 }}>{hotel.name}</p>
                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <MapPin style={{ width: 10, height: 10 }} />{hotel.location}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '16px', fontWeight: 900, color: '#fff' }}>{fmt(hotel.priceFrom * nights)}</p>
                      <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{nights} usiku</p>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Star style={{ width: 13, height: 13, color: '#fbbf24', fill: '#fbbf24' }} />
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#fbbf24' }}>{hotel.rating}</span>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>({hotel.reviews.toLocaleString()})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 12, background: 'rgba(251,146,60,0.15)', border: '1px solid rgba(251,146,60,0.3)' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: accent }}>Hifadhi</span>
                    <ChevronRight style={{ width: 13, height: 13, color: accent }} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {hotel.amenities.slice(0, 4).map(a => <span key={a} style={{ fontSize: '10px', padding: '3px 8px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>{a}</span>)}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#080d08', color: '#fff', paddingBottom: 40 }}>
      <div className="sticky top-0 z-20" style={{ background: 'rgba(8,13,8,0.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ padding: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft style={{ width: 20, height: 20, color: '#fff' }} />
        </button>
        <div><h1 style={{ fontSize: '20px', fontWeight: 900, color: '#fff' }}>Hoteli & Lodges</h1>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Hoteli 500+ · Bei Bora</p></div>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ borderRadius: 22, height: 150, background: 'linear-gradient(135deg,#1c0a00,#7c2d12,#c2410c)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Hotel style={{ width: 48, height: 48, color: '#fb923c' }} />
          <p style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>Hoteli Bora Tanzania</p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>5 nyota hadi bajeti</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: accent, display: 'block', marginBottom: 5 }}>MJI</label>
            <select value={city} onChange={e => setCity(e.target.value)} style={darkInput}>
              {TZ_CITIES.map(c => <option key={c} value={c} style={{ background: '#0f1a0f' }}>{c}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 5 }}>KUWASILI</label>
              <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} min={new Date().toISOString().split('T')[0]} style={darkInput} />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 5 }}>KUONDOKA</label>
              <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} min={checkIn || new Date().toISOString().split('T')[0]} style={darkInput} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 5 }}>WAGENI</label>
            <div style={{ display: 'flex', alignItems: 'center', height: 52, gap: 12 }}>
              <button onClick={() => setGuests(Math.max(1, guests-1))} style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>−</button>
              <span style={{ flex: 1, textAlign: 'center', fontSize: '22px', fontWeight: 900, color: '#fff' }}>{guests}</span>
              <button onClick={() => setGuests(Math.min(10, guests+1))} style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>+</button>
            </div>
          </div>
          <button onClick={() => checkIn && checkOut && setStep('list')} disabled={!checkIn || !checkOut}
            style={{ width: '100%', height: 52, borderRadius: 16, background: checkIn && checkOut ? 'linear-gradient(135deg,#c2410c,#b45309)' : 'rgba(194,65,12,0.3)', border: 'none', color: '#fff', fontWeight: 900, fontSize: '15px', cursor: !checkIn||!checkOut?'not-allowed':'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <Search style={{ width: 18, height: 18 }} />Tafuta Hoteli
          </button>
        </div>
      </div>
    </div>
  );
}
