import { ArrowLeft, Plane, Bus, Hotel, Mountain, Train } from 'lucide-react';
import { User } from '../App';

interface Props {
  user: User;
  onBack: () => void;
  initialService?: 'flights' | 'buses' | 'sgr' | 'hotels' | 'parks';
}

const SERVICE_CONFIG = {
  flights: { label: 'Tiketi za Ndege', icon: Plane, desc: 'Tafuta na piga tiketi za ndege Tanzania na nje' },
  buses: { label: 'Tiketi za Basi', icon: Bus, desc: 'Piga tiketi za basi kati ya miji yote Tanzania' },
  sgr: { label: 'Treni (SGR)', icon: Train, desc: 'Tiketi za Standard Gauge Railway DAR–DODOMA' },
  hotels: { label: 'Hoteli', icon: Hotel, desc: 'Pata na piga nafasi ya hoteli, BB, na mapumziko' },
  parks: { label: 'Mbuga za Wanyama', icon: Mountain, desc: 'Ingia Serengeti, Ngorongoro, Kilimanjaro na zaidi' },
};

export function UnifiedBookingSystemUltimate({ user, onBack, initialService = 'flights' }: Props) {
  const config = SERVICE_CONFIG[initialService];
  const Icon = config.icon;

  return (
    <div className="min-h-screen pb-10" style={{ background: '#080d08' }}>
      <div className="px-5 pt-8 pb-6" style={{
        background: 'linear-gradient(135deg, #14532d 0%, #052e16 100%)'
      }}>
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="p-2.5 rounded-full transition-all active:scale-95"
            style={{ background: 'rgba(255,255,255,0.15)' }}>
            <ArrowLeft className="size-5 text-white" />
          </button>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#fff' }}>{config.label}</h1>
        </div>
      </div>

      <div className="px-5 py-8 text-center">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.2)' }}>
          <Icon className="size-10" style={{ color: '#4ade80' }} />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
          {config.label}
        </h2>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '32px', lineHeight: '1.6' }}>
          {config.desc}
        </p>
        <div className="rounded-2xl p-6" style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>
            Hii sehemu inaendelezwa. Itapatikana hivi karibuni.
          </p>
          <button onClick={onBack} className="px-6 py-3 rounded-xl transition-all active:scale-95"
            style={{ background: '#16a34a', color: '#fff', fontSize: '14px', fontWeight: 600 }}>
            Rudi nyuma
          </button>
        </div>
      </div>
    </div>
  );
}
