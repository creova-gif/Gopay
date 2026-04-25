import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { User } from '../App';
import {
  ArrowLeft, Plane, Bus, Train, Hotel, TreePalm,
  MapPin, Calendar, Users, Clock, Star, Check,
  ChevronRight, Shield, CreditCard, Search, Zap
} from 'lucide-react';

type BookingService = 'flights' | 'buses' | 'sgr' | 'hotels' | 'parks';

interface UnifiedBookingSystemUltimateProps {
  user: User;
  onBack: () => void;
  initialService: BookingService;
}

const serviceConfig: Record<BookingService, { label: string; icon: any; color: string; bg: string }> = {
  flights: { label: 'Flights', icon: Plane, color: 'text-blue-600', bg: 'bg-blue-50' },
  buses:   { label: 'Buses',   icon: Bus,   color: 'text-green-600', bg: 'bg-green-50' },
  sgr:     { label: 'SGR Train', icon: Train, color: 'text-purple-600', bg: 'bg-purple-50' },
  hotels:  { label: 'Hotels',  icon: Hotel, color: 'text-amber-600', bg: 'bg-amber-50' },
  parks:   { label: 'Parks & Safaris', icon: TreePalm, color: 'text-emerald-600', bg: 'bg-emerald-50' },
};

const flightRoutes = [
  { id: 'f1', from: 'Dar es Salaam (DAR)', to: 'Kilimanjaro (JRO)', time: '06:30', arrival: '07:45', duration: '1h 15m', price: 185000, airline: 'Precision Air', seats: 12 },
  { id: 'f2', from: 'Dar es Salaam (DAR)', to: 'Zanzibar (ZNZ)', time: '08:00', arrival: '08:30', duration: '30m', price: 95000, airline: 'Air Tanzania', seats: 6 },
  { id: 'f3', from: 'Dar es Salaam (DAR)', to: 'Mwanza (MWZ)', time: '10:15', arrival: '11:45', duration: '1h 30m', price: 210000, airline: 'Fastjet', seats: 20 },
  { id: 'f4', from: 'Dar es Salaam (DAR)', to: 'Arusha (ARK)', time: '14:00', arrival: '15:20', duration: '1h 20m', price: 175000, airline: 'Precision Air', seats: 8 },
];

const busRoutes = [
  { id: 'b1', from: 'Dar es Salaam', to: 'Arusha', departs: '06:00', arrives: '14:00', duration: '8h', price: 35000, operator: 'Kilimanjaro Express', seats: 18 },
  { id: 'b2', from: 'Dar es Salaam', to: 'Moshi', departs: '07:30', arrives: '16:30', duration: '9h', price: 38000, operator: 'Dar Express', seats: 24 },
  { id: 'b3', from: 'Dar es Salaam', to: 'Dodoma', departs: '08:00', arrives: '14:00', duration: '6h', price: 22000, operator: 'Royal Coach', seats: 30 },
  { id: 'b4', from: 'Dar es Salaam', to: 'Mwanza', departs: '16:00', arrives: '08:00+1', duration: '16h', price: 55000, operator: 'Kamata Coach', seats: 10 },
];

const sgrRoutes = [
  { id: 's1', from: 'Dar es Salaam', to: 'Dodoma', departs: '07:00', arrives: '10:30', duration: '3h 30m', price: 45000, class: 'Economy', seats: 40 },
  { id: 's2', from: 'Dar es Salaam', to: 'Dodoma', departs: '14:00', arrives: '17:30', duration: '3h 30m', price: 45000, class: 'Economy', seats: 55 },
  { id: 's3', from: 'Dar es Salaam', to: 'Dodoma', departs: '07:00', arrives: '10:30', duration: '3h 30m', price: 75000, class: 'Business', seats: 12 },
  { id: 's4', from: 'Dodoma', to: 'Dar es Salaam', departs: '08:00', arrives: '11:30', duration: '3h 30m', price: 45000, class: 'Economy', seats: 48 },
];

const hotelOptions = [
  { id: 'h1', name: 'Serena Hotel Dar es Salaam', stars: 5, location: 'Ocean Road, Dar es Salaam', price: 320000, rating: 4.8, amenities: ['Pool', 'Spa', 'Restaurant', 'Gym', 'WiFi'] },
  { id: 'h2', name: 'Kilimanjaro Kempinski', stars: 5, location: 'Kivukoni, Dar es Salaam', price: 285000, rating: 4.7, amenities: ['Pool', 'Restaurant', 'Bar', 'WiFi', 'Parking'] },
  { id: 'h3', name: 'Southern Sun Dar', stars: 4, location: 'Garden Ave, Dar es Salaam', price: 195000, rating: 4.5, amenities: ['Pool', 'Restaurant', 'Gym', 'WiFi'] },
  { id: 'h4', name: 'Sea Cliff Hotel', stars: 4, location: 'Msasani Peninsula, Dar es Salaam', price: 175000, rating: 4.4, amenities: ['Pool', 'Restaurant', 'Bar', 'Sea View'] },
];

const parkOptions = [
  { id: 'p1', name: 'Serengeti National Park', location: 'Mara Region', price: 850000, duration: '3 days', rating: 4.9, highlights: ['Great Migration', 'Big 5', 'Balloon Safari'] },
  { id: 'p2', name: 'Ngorongoro Crater', location: 'Arusha Region', price: 650000, duration: '2 days', rating: 4.8, highlights: ['Crater Floor', 'Big 5', 'Maasai Culture'] },
  { id: 'p3', name: 'Zanzibar Beach & Spice Tour', location: 'Zanzibar', price: 450000, duration: '4 days', rating: 4.7, highlights: ['Beaches', 'Stone Town', 'Spice Farms'] },
  { id: 'p4', name: 'Kilimanjaro Trekking', location: 'Kilimanjaro Region', price: 2500000, duration: '7 days', rating: 4.9, highlights: ['Summit 5895m', 'Certificate', 'Porter Included'] },
];

function formatTZS(amount: number) {
  return `TZS ${amount.toLocaleString()}`;
}

export function UnifiedBookingSystemUltimate({ user, onBack, initialService }: UnifiedBookingSystemUltimateProps) {
  const [service] = useState<BookingService>(initialService);
  const [passengers, setPassengers] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [step, setStep] = useState<'search' | 'results' | 'confirm' | 'success'>('results');

  const cfg = serviceConfig[service];
  const Icon = cfg.icon;

  const handleBook = (id: string) => {
    setSelectedItem(id);
    setStep('confirm');
  };

  const handleConfirm = () => {
    setStep('success');
    toast.success('Booking confirmed! Check your notifications for details.');
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
        <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center shadow-lg">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-500 mb-1">Your {cfg.label.toLowerCase()} booking is confirmed.</p>
          <p className="text-gray-400 text-sm mb-6">A confirmation has been sent to {user.email || user.phone}</p>
          <div className="bg-green-50 rounded-2xl p-4 mb-6 text-left">
            <div className="flex items-center gap-2 text-green-700 font-semibold mb-1">
              <Shield className="w-4 h-4" /> Booking Protected
            </div>
            <p className="text-green-600 text-sm">Your payment is secured and your booking reference has been generated.</p>
          </div>
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-2xl py-3" onClick={onBack}>
            Back to Travel
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'confirm') {
    const getItem = () => {
      if (service === 'flights') return flightRoutes.find(r => r.id === selectedItem);
      if (service === 'buses') return busRoutes.find(r => r.id === selectedItem);
      if (service === 'sgr') return sgrRoutes.find(r => r.id === selectedItem);
      if (service === 'hotels') return hotelOptions.find(r => r.id === selectedItem);
      return parkOptions.find(r => r.id === selectedItem);
    };
    const item = getItem() as any;
    const price = item?.price * (service === 'hotels' || service === 'parks' ? 1 : passengers);

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white px-4 pt-12 pb-4 flex items-center gap-3 border-b">
          <button onClick={() => setStep('results')} className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-gray-900 text-lg">Confirm Booking</h1>
        </div>
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${cfg.bg} ${cfg.color} text-sm font-medium mb-4`}>
              <Icon className="w-4 h-4" /> {cfg.label}
            </div>
            <div className="space-y-3">
              {item && Object.entries(item).filter(([k]) => !['id'].includes(k)).map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-gray-500 capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-medium text-gray-900">{String(v)}</span>
                </div>
              ))}
              {service !== 'hotels' && service !== 'parks' && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Passengers</span>
                  <span className="font-medium text-gray-900">{passengers}</span>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Payment Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Base fare</span>
                <span>{formatTZS(item?.price || 0)}{service !== 'hotels' && service !== 'parks' && ` × ${passengers}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Service fee</span>
                <span>TZS 2,500</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-green-600">{formatTZS((price || 0) + 2500)}</span>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4 flex gap-3">
            <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">GoPay Wallet</p>
              <p className="text-xs text-blue-600">Payment will be deducted from your wallet</p>
            </div>
          </div>
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-2xl py-4 text-base font-semibold" onClick={handleConfirm}>
            Confirm & Pay {formatTZS((price || 0) + 2500)}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-teal-700 px-4 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-2 rounded-full bg-white/20 text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Icon className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-white font-bold text-lg">Book {cfg.label}</h1>
          </div>
        </div>

        {/* Search bar */}
        <div className="bg-white rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder={service === 'hotels' || service === 'parks' ? 'Destination' : 'From'}
              defaultValue="Dar es Salaam"
              className="flex-1 text-sm text-gray-700 outline-none"
            />
          </div>
          {service !== 'hotels' && service !== 'parks' && (
            <div className="flex items-center gap-3 border-t pt-3">
              <MapPin className="w-4 h-4 text-green-500 flex-shrink-0" />
              <input type="text" placeholder="To" className="flex-1 text-sm text-gray-700 outline-none" />
            </div>
          )}
          <div className="flex gap-3 border-t pt-3">
            <div className="flex items-center gap-2 flex-1">
              <Calendar className="w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="text-sm text-gray-700 outline-none flex-1"
              />
            </div>
            {service !== 'hotels' && service !== 'parks' && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <select
                  value={passengers}
                  onChange={e => setPassengers(Number(e.target.value))}
                  className="text-sm text-gray-700 outline-none bg-transparent"
                >
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} pax</option>)}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="px-4 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Available {cfg.label}</h2>
          <span className="text-xs text-gray-500 flex items-center gap-1"><Zap className="w-3 h-3 text-green-500" /> Live prices</span>
        </div>

        {service === 'flights' && flightRoutes.map(r => (
          <div key={r.id} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-semibold text-gray-900 text-sm">{r.airline}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-800 font-bold">{r.time}</span>
                  <div className="flex-1 border-t border-dashed border-gray-300 w-8 mx-2"></div>
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{r.duration}</span>
                  <div className="flex-1 border-t border-dashed border-gray-300 w-8 mx-2"></div>
                  <span className="text-gray-800 font-bold">{r.arrival}</span>
                </div>
                <div className="flex gap-4 mt-1">
                  <p className="text-xs text-gray-500">{r.from.split('(')[0].trim()}</p>
                  <p className="text-xs text-gray-500 ml-auto">{r.to.split('(')[0].trim()}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between border-t pt-3">
              <div>
                <span className="text-green-600 font-bold">{formatTZS(r.price)}</span>
                <span className="text-xs text-gray-400"> /person</span>
                <p className="text-xs text-gray-400">{r.seats} seats left</p>
              </div>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-4" onClick={() => handleBook(r.id)}>
                Book <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}

        {service === 'buses' && busRoutes.map(r => (
          <div key={r.id} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold text-gray-900">{r.operator}</p>
                <p className="text-xs text-gray-500">{r.from} → {r.to}</p>
              </div>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{r.seats} seats</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
              <Clock className="w-4 h-4" />
              <span>{r.departs} – {r.arrives}</span>
              <span className="text-gray-400">({r.duration})</span>
            </div>
            <div className="flex items-center justify-between border-t pt-3">
              <div>
                <span className="text-green-600 font-bold">{formatTZS(r.price)}</span>
                <span className="text-xs text-gray-400"> /seat</span>
              </div>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-4" onClick={() => handleBook(r.id)}>
                Book <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}

        {service === 'sgr' && sgrRoutes.map(r => (
          <div key={r.id} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold text-gray-900">{r.from} → {r.to}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${r.class === 'Business' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>{r.class}</span>
              </div>
              <span className="text-xs text-gray-500">{r.seats} seats</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
              <Clock className="w-4 h-4" />
              <span>{r.departs} – {r.arrives}</span>
              <span className="text-gray-400">({r.duration})</span>
            </div>
            <div className="flex items-center justify-between border-t pt-3">
              <span className="text-green-600 font-bold">{formatTZS(r.price)}<span className="text-xs text-gray-400 font-normal"> /seat</span></span>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-4" onClick={() => handleBook(r.id)}>
                Book <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}

        {service === 'hotels' && hotelOptions.map(h => (
          <div key={h.id} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 pr-3">
                <p className="font-semibold text-gray-900">{h.name}</p>
                <div className="flex items-center gap-1 my-1">
                  {Array.from({ length: h.stars }).map((_, i) => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{h.location}</p>
              </div>
              <div className="text-right">
                <div className="bg-green-600 text-white text-sm font-bold px-2 py-1 rounded-lg">{h.rating}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {h.amenities.map(a => <span key={a} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{a}</span>)}
            </div>
            <div className="flex items-center justify-between border-t pt-3">
              <div>
                <span className="text-green-600 font-bold">{formatTZS(h.price)}</span>
                <span className="text-xs text-gray-400"> /night</span>
              </div>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-4" onClick={() => handleBook(h.id)}>
                Book <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}

        {service === 'parks' && parkOptions.map(p => (
          <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 pr-3">
                <p className="font-semibold text-gray-900">{p.name}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{p.location}</p>
                <p className="text-xs text-gray-400 mt-0.5">⏱ {p.duration}</p>
              </div>
              <div className="bg-green-600 text-white text-sm font-bold px-2 py-1 rounded-lg">{p.rating}</div>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {p.highlights.map(h => <span key={h} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{h}</span>)}
            </div>
            <div className="flex items-center justify-between border-t pt-3">
              <div>
                <span className="text-green-600 font-bold">{formatTZS(p.price)}</span>
                <span className="text-xs text-gray-400"> /person</span>
              </div>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-4" onClick={() => handleBook(p.id)}>
                Book <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
