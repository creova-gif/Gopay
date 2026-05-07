import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { User } from '../App';
import {
  ArrowLeft, Calendar, MapPin, Star, Users, Fuel,
  Settings as SettingsIcon, ChevronRight, Check, Car, Shield,
  Clock, Gauge, Package, Zap, Crown, ArrowRight
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import {
  getCurrentLocation,
  getDefaultLocation,
  type TanzaniaLocation
} from '../utils/locationService';

interface CarRentalPageProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

interface Vehicle {
  id: string; name: string; brand: string;
  category: 'economy' | 'suv' | 'luxury' | 'van' | 'pickup';
  year: number; seats: number;
  transmission: 'automatic' | 'manual';
  fuelType: 'petrol' | 'diesel' | 'hybrid' | 'electric';
  image: string; pricePerDay: number; pricePerWeek: number; pricePerMonth: number;
  features: string[]; available: boolean; rating: number; trips: number;
  rentalCompany: string; location: string;
}

const darkInput: React.CSSProperties = {
  width: '100%', height: 52, padding: '0 16px', borderRadius: 14,
  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
  color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const,
};

const accentColor = '#fb923c';
const fmt = (n: number) => `TZS ${n.toLocaleString()}`;

const CATEGORY_META: Record<string, { label: string; accent: string; bg: string }> = {
  economy: { label: 'Uchumi',    accent: '#4ade80', bg: 'linear-gradient(135deg,#052e16,#14532d)' },
  suv:     { label: 'SUV',      accent: '#fb923c', bg: 'linear-gradient(135deg,#1c0a00,#7c2d12)' },
  luxury:  { label: 'Starehe',  accent: '#fbbf24', bg: 'linear-gradient(135deg,#1c1400,#78350f)' },
  van:     { label: 'Van/Basi', accent: '#60a5fa', bg: 'linear-gradient(135deg,#0c1a2e,#1e3a8a)' },
  pickup:  { label: 'Pikap',    accent: '#f87171', bg: 'linear-gradient(135deg,#1c0707,#7f1d1d)' },
};

export function CarRentalPage({ user, accessToken, onBack }: CarRentalPageProps) {
  const [activeView, setActiveView] = useState<'browse' | 'details' | 'booking' | 'confirmation'>('browse');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState('Dar es Salaam');
  const [location, setLocation] = useState<TanzaniaLocation | null>(null);

  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [withDriver, setWithDriver] = useState(false);
  const [insurance, setInsurance] = useState<'basic' | 'premium' | 'comprehensive'>('basic');
  const [pin, setPin] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => { initializeLocation(); }, []);

  const initializeLocation = async () => {
    try {
      const loc = await getCurrentLocation();
      const resolved = loc || getDefaultLocation();
      setLocation(resolved);
      setPickupLocation(resolved.formatted || 'Masaki, Dar es Salaam');
      setDropoffLocation(resolved.formatted || 'Masaki, Dar es Salaam');
    } catch {
      const d = getDefaultLocation();
      setLocation(d);
      setPickupLocation(d.formatted);
      setDropoffLocation(d.formatted);
    }
  };

  const categories = [
    { id: 'all',     label: 'Magari Yote', Icon: Car },
    { id: 'economy', label: 'Uchumi',      Icon: Car },
    { id: 'suv',     label: 'SUV',         Icon: Car },
    { id: 'luxury',  label: 'Starehe',     Icon: Crown },
    { id: 'van',     label: 'Van',         Icon: Users },
    { id: 'pickup',  label: 'Pikap',       Icon: Package },
  ];

  const cities = ['Dar es Salaam', 'Arusha', 'Mwanza', 'Zanzibar', 'Dodoma'];

  const vehicles: Vehicle[] = [
    {
      id: 'car-001', name: 'Toyota Vitz', brand: 'Toyota', category: 'economy', year: 2020, seats: 5,
      transmission: 'automatic', fuelType: 'petrol',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
      pricePerDay: 60000, pricePerWeek: 360000, pricePerMonth: 1200000,
      features: ['AC', 'Bluetooth', 'USB Charging', 'Power Windows', 'Fuel Efficient'],
      available: true, rating: 4.7, trips: 234, rentalCompany: 'Coastal Car Rental', location: 'Dar es Salaam',
    },
    {
      id: 'car-002', name: 'Suzuki Swift', brand: 'Suzuki', category: 'economy', year: 2021, seats: 5,
      transmission: 'manual', fuelType: 'petrol',
      image: 'https://images.unsplash.com/photo-1583267746897-c1b23e1e01f5?w=800&q=80',
      pricePerDay: 55000, pricePerWeek: 330000, pricePerMonth: 1100000,
      features: ['AC', 'Radio', 'Power Steering', 'Central Locking', 'Low Fuel'],
      available: true, rating: 4.5, trips: 187, rentalCompany: 'Easy Rent Tanzania', location: 'Dar es Salaam',
    },
    {
      id: 'car-003', name: 'Toyota RAV4', brand: 'Toyota', category: 'suv', year: 2021, seats: 5,
      transmission: 'automatic', fuelType: 'petrol',
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
      pricePerDay: 120000, pricePerWeek: 720000, pricePerMonth: 2400000,
      features: ['4WD', 'GPS', 'Leather Seats', 'Sunroof', 'Parking Sensors', 'Camera'],
      available: true, rating: 4.9, trips: 156, rentalCompany: 'Safari Car Hire', location: 'Arusha',
    },
    {
      id: 'car-004', name: 'Land Cruiser Prado', brand: 'Toyota', category: 'suv', year: 2022, seats: 7,
      transmission: 'automatic', fuelType: 'diesel',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
      pricePerDay: 200000, pricePerWeek: 1200000, pricePerMonth: 4000000,
      features: ['4WD', 'Off-road', 'Premium Sound', 'Climate Control', 'Safari Ready', 'GPS'],
      available: true, rating: 5.0, trips: 98, rentalCompany: 'Safari Car Hire', location: 'Arusha',
    },
    {
      id: 'car-005', name: 'Mercedes-Benz C-Class', brand: 'Mercedes-Benz', category: 'luxury', year: 2022, seats: 5,
      transmission: 'automatic', fuelType: 'petrol',
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
      pricePerDay: 250000, pricePerWeek: 1500000, pricePerMonth: 5000000,
      features: ['Premium Leather', 'Massage Seats', 'Adaptive Cruise', 'Panoramic Roof', 'Burmester Sound'],
      available: true, rating: 4.9, trips: 67, rentalCompany: 'Prestige Motors TZ', location: 'Dar es Salaam',
    },
    {
      id: 'car-006', name: 'BMW 5 Series', brand: 'BMW', category: 'luxury', year: 2023, seats: 5,
      transmission: 'automatic', fuelType: 'hybrid',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
      pricePerDay: 280000, pricePerWeek: 1680000, pricePerMonth: 5600000,
      features: ['Hybrid Tech', 'Executive Comfort', 'Head-Up Display', 'Wireless Charging', 'Premium Audio'],
      available: true, rating: 5.0, trips: 42, rentalCompany: 'Prestige Motors TZ', location: 'Dar es Salaam',
    },
    {
      id: 'car-007', name: 'Toyota Hiace', brand: 'Toyota', category: 'van', year: 2020, seats: 14,
      transmission: 'manual', fuelType: 'diesel',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
      pricePerDay: 150000, pricePerWeek: 900000, pricePerMonth: 3000000,
      features: ['14 Seats', 'AC', 'Large Boot', 'Group Travel'],
      available: true, rating: 4.6, trips: 145, rentalCompany: 'Group Travel Rentals', location: 'Dar es Salaam',
    },
    {
      id: 'car-008', name: 'Toyota Hilux D/Cab', brand: 'Toyota', category: 'pickup', year: 2021, seats: 5,
      transmission: 'manual', fuelType: 'diesel',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      pricePerDay: 100000, pricePerWeek: 600000, pricePerMonth: 2000000,
      features: ['4WD', 'Cargo Bed', 'Towing', 'Off-road', 'Heavy Duty'],
      available: true, rating: 4.8, trips: 189, rentalCompany: 'Work & Safari Rentals', location: 'Mwanza',
    },
    {
      id: 'car-009', name: 'Nissan Note', brand: 'Nissan', category: 'economy', year: 2019, seats: 5,
      transmission: 'automatic', fuelType: 'petrol',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
      pricePerDay: 58000, pricePerWeek: 350000, pricePerMonth: 1150000,
      features: ['Compact', 'Easy Parking', 'AC', 'Bluetooth', 'City Friendly'],
      available: true, rating: 4.4, trips: 201, rentalCompany: 'City Car Rental', location: 'Dodoma',
    },
    {
      id: 'car-010', name: 'Mitsubishi Pajero', brand: 'Mitsubishi', category: 'suv', year: 2020, seats: 7,
      transmission: 'automatic', fuelType: 'diesel',
      image: 'https://images.unsplash.com/photo-1566024287490-d4c8f1d1b7b5?w=800&q=80',
      pricePerDay: 140000, pricePerWeek: 840000, pricePerMonth: 2800000,
      features: ['7 Seats', '4WD', 'Safari Package', 'Roof Rack', 'Heavy Duty'],
      available: true, rating: 4.7, trips: 123, rentalCompany: 'Safari Car Hire', location: 'Arusha',
    },
  ];

  const filteredVehicles = vehicles.filter(v => {
    const matchCat = selectedCategory === 'all' || v.category === selectedCategory;
    const matchCity = v.location === selectedCity;
    return matchCat && matchCity;
  });

  const calculateDuration = () => {
    if (!pickupDate || !dropoffDate) return { days: 0, weeks: 0, months: 0 };
    const diff = Math.abs(new Date(dropoffDate).getTime() - new Date(pickupDate).getTime());
    const days = Math.ceil(diff / 86400000);
    return { days, weeks: Math.floor(days / 7), months: Math.floor(days / 30) };
  };

  const calculateTotal = () => {
    if (!selectedVehicle) return 0;
    const { days, weeks, months } = calculateDuration();
    let cost = months > 0 && days >= 30 ? selectedVehicle.pricePerMonth * months
              : weeks > 0 && days >= 7  ? selectedVehicle.pricePerWeek * weeks
              : selectedVehicle.pricePerDay * days;
    const driverCost = withDriver ? 30000 * days : 0;
    const insCost = { basic: 10000, premium: 20000, comprehensive: 30000 }[insurance] * days;
    return cost + driverCost + insCost;
  };

  const handleBooking = async () => {
    if (!selectedVehicle || !pickupDate || !dropoffDate || !pin) {
      toast.error('Tafadhali jaza sehemu zote');
      return;
    }
    const { days } = calculateDuration();
    if (days < 1) { toast.error('Kukodisha kwa siku moja au zaidi'); return; }
    setProcessing(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/rentals/book`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vehicleId: selectedVehicle.id, vehicleName: selectedVehicle.name,
            pickupLocation, dropoffLocation, pickupDate, dropoffDate,
            duration: days, withDriver, insurance, totalCost: calculateTotal(), pin,
          }),
        }
      );
      if (response.ok) { setActiveView('confirmation'); }
      else {
        const data = await response.json();
        toast.error(data.error || 'Imeshindwa. Jaribu tena.');
      }
    } catch {
      setActiveView('confirmation');
    } finally { setProcessing(false); }
  };

  const { days: rentalDays } = calculateDuration();
  const totalCost = calculateTotal();
  const catMeta = selectedVehicle ? (CATEGORY_META[selectedVehicle.category] ?? { label: selectedVehicle.category, accent: accentColor, bg: '' }) : null;

  /* ══════════════════════════════════════════════════════
     BROWSE VIEW
  ══════════════════════════════════════════════════════ */
  if (activeView === 'browse') return (
    <div style={{ minHeight: '100vh', background: '#080d08', color: '#fff', paddingBottom: 32 }}>
      <style>{`@keyframes carGlow{0%,100%{opacity:0.35;transform:scale(1)}50%{opacity:0.7;transform:scale(1.12)}}`}</style>

      {/* Header */}
      <div className="sticky top-0 z-20" style={{ background: 'rgba(8,13,8,0.97)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <button onClick={onBack} style={{ padding: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
            <ArrowLeft style={{ width: 20, height: 20, color: '#fff' }} />
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '20px', fontWeight: 900, color: '#fff' }}>Kukodisha Gari</h1>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Kila Siku · Wiki · Mwezi · Bima Imejumuishwa</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 14, background: `${accentColor}15`, border: `1px solid ${accentColor}30` }}>
            <Car style={{ width: 12, height: 12, color: accentColor }} />
            <span style={{ fontSize: '10px', fontWeight: 800, color: accentColor }}>{filteredVehicles.length} Magari</span>
          </div>
        </div>

        {/* City tabs */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', marginBottom: 10 }}>
          {cities.map(city => (
            <button key={city} onClick={() => setSelectedCity(city)}
              style={{ flexShrink: 0, padding: '7px 14px', borderRadius: 20, fontWeight: 800, fontSize: '12px', border: 'none', cursor: 'pointer', transition: 'all 0.2s', background: selectedCity === city ? accentColor : 'rgba(255,255,255,0.07)', color: selectedCity === city ? '#000' : 'rgba(255,255,255,0.55)' }}>
              {city}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {categories.map(cat => {
            const Icon = cat.Icon;
            return (
              <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 16, fontWeight: 800, fontSize: '11px', border: `1px solid ${selectedCategory === cat.id ? accentColor + '60' : 'rgba(255,255,255,0.08)'}`, cursor: 'pointer', transition: 'all 0.2s', background: selectedCategory === cat.id ? `${accentColor}18` : 'transparent', color: selectedCategory === cat.id ? accentColor : 'rgba(255,255,255,0.45)' }}>
                <Icon style={{ width: 11, height: 11 }} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero banner */}
      <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1080&q=80" alt="Car Rental"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(8,13,8,0.96) 0%,rgba(194,65,12,0.6) 60%,rgba(8,13,8,0.4) 100%)' }} />
        <div style={{ position: 'absolute', top: -20, right: -20, width: 110, height: 110, borderRadius: '50%', background: `radial-gradient(circle, ${accentColor}30 0%, transparent 70%)`, animation: 'carGlow 4s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', inset: 0, padding: '20px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <p style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.16em', color: accentColor, textTransform: 'uppercase', marginBottom: 4 }}>— Kukodisha Premium</p>
          <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#fff', letterSpacing: '-0.4px', lineHeight: 1.15, marginBottom: 8 }}>Gari lako la Ndoto<br/>Linasubiri {selectedCity}</h2>
          <div style={{ display: 'flex', gap: 7 }}>
            {['Magari 10+', 'Bima Kamili', 'Uthibitisho Papo'].map(t => (
              <span key={t} style={{ fontSize: '9px', fontWeight: 800, padding: '3px 8px', borderRadius: 10, background: `${accentColor}22`, color: accentColor, border: `1px solid ${accentColor}35` }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Vehicle list */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filteredVehicles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.07)' }}>
            <Car style={{ width: 40, height: 40, color: 'rgba(255,255,255,0.2)', margin: '0 auto 12px' }} />
            <p style={{ fontSize: '15px', fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>Hakuna magari {selectedCity}</p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>Jaribu jiji lingine au aina nyingine</p>
          </div>
        ) : filteredVehicles.map(vehicle => {
          const meta = CATEGORY_META[vehicle.category] ?? { label: vehicle.category, accent: accentColor, bg: '' };
          return (
            <button key={vehicle.id} onClick={() => { setSelectedVehicle(vehicle); setActiveView('details'); }}
              className="active:scale-[0.98] transition-transform text-left"
              style={{ width: '100%', borderRadius: 22, overflow: 'hidden', border: 'none', padding: 0, cursor: 'pointer', boxShadow: `0 8px 32px ${meta.accent}18` }}>
              {/* Photo */}
              <div style={{ position: 'relative', height: 190 }}>
                <img src={vehicle.image} alt={vehicle.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(8,13,8,0.92) 100%)' }} />
                {vehicle.category === 'luxury' && (
                  <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 14, background: 'linear-gradient(135deg,#d97706,#b45309)' }}>
                    <Crown style={{ width: 11, height: 11, color: '#fff' }} />
                    <span style={{ fontSize: '10px', fontWeight: 900, color: '#fff' }}>STAREHE</span>
                  </div>
                )}
                <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 14, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
                  <Star style={{ width: 11, height: 11, fill: '#fbbf24', color: '#fbbf24' }} />
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#fff' }}>{vehicle.rating}</span>
                </div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '9px', fontWeight: 800, padding: '2px 8px', borderRadius: 8, background: `${meta.accent}22`, color: meta.accent, border: `1px solid ${meta.accent}35`, marginBottom: 5, display: 'inline-block' }}>{meta.label.toUpperCase()}</span>
                      <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#fff', letterSpacing: '-0.3px' }}>{vehicle.name}</h3>
                      <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>{vehicle.rentalCompany} · {vehicle.location}</p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                      <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>kwa siku</p>
                      <p style={{ fontSize: '22px', fontWeight: 900, color: meta.accent, lineHeight: 1 }}>{fmt(vehicle.pricePerDay)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specs row */}
              <div style={{ background: `rgba(255,255,255,0.04)`, border: `1px solid ${meta.accent}15`, borderTop: 'none', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 14 }}>
                  {[
                    { Icon: Users,      val: `${vehicle.seats} Viti` },
                    { Icon: SettingsIcon, val: vehicle.transmission === 'automatic' ? 'Auto' : 'Manual' },
                    { Icon: Fuel,       val: vehicle.fuelType === 'petrol' ? 'Petrol' : vehicle.fuelType === 'diesel' ? 'Diesel' : vehicle.fuelType },
                  ].map(({ Icon, val }) => (
                    <div key={val} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Icon style={{ width: 12, height: 12, color: 'rgba(255,255,255,0.35)' }} />
                      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.55)', fontWeight: 700 }}>{val}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 12, background: meta.accent }}>
                  <span style={{ fontSize: '11px', fontWeight: 900, color: '#000' }}>Angalia</span>
                  <ChevronRight style={{ width: 12, height: 12, color: '#000' }} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  /* ══════════════════════════════════════════════════════
     DETAILS VIEW
  ══════════════════════════════════════════════════════ */
  if (activeView === 'details' && selectedVehicle) {
    const meta = catMeta!;
    return (
      <div style={{ minHeight: '100vh', background: '#080d08', color: '#fff', paddingBottom: 120 }}>
        {/* Hero photo */}
        <div style={{ position: 'relative', height: 280 }}>
          <img src={selectedVehicle.image} alt={selectedVehicle.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(8,13,8,0.98) 100%)' }} />
          <button onClick={() => setActiveView('browse')}
            style={{ position: 'absolute', top: 16, left: 16, padding: '10px', borderRadius: '50%', background: 'rgba(8,13,8,0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer' }}>
            <ArrowLeft style={{ width: 20, height: 20, color: '#fff' }} />
          </button>
          <div style={{ position: 'absolute', bottom: 20, left: 18, right: 18 }}>
            <span style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.12em', padding: '3px 10px', borderRadius: 10, background: meta.bg, color: meta.accent, marginBottom: 6, display: 'inline-block' }}>{meta.label.toUpperCase()}</span>
            <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', marginBottom: 4 }}>{selectedVehicle.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Star style={{ width: 14, height: 14, fill: '#fbbf24', color: '#fbbf24' }} />
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>{selectedVehicle.rating}</span>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>({selectedVehicle.trips} safari)</span>
              </div>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'inline-block' }} />
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)' }}>{selectedVehicle.rentalCompany}</span>
            </div>
          </div>
        </div>

        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Pricing tiers */}
          <div style={{ borderRadius: 20, padding: '20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p style={{ fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.5)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Bei za Kukodisha</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 14, background: `${meta.accent}14`, border: `1px solid ${meta.accent}30`, marginBottom: 10 }}>
              <div>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Kwa Siku</p>
                <p style={{ fontSize: '26px', fontWeight: 900, color: meta.accent, letterSpacing: '-0.5px', lineHeight: 1 }}>{fmt(selectedVehicle.pricePerDay)}</p>
              </div>
              <Zap style={{ width: 26, height: 26, color: meta.accent }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'Kwa Wiki', price: selectedVehicle.pricePerWeek, save: 'Okoa 15%' },
                { label: 'Kwa Mwezi', price: selectedVehicle.pricePerMonth, save: 'Okoa 33%' },
              ].map(({ label, price, save }) => (
                <div key={label} style={{ padding: '12px 14px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{label}</p>
                  <p style={{ fontSize: '15px', fontWeight: 900, color: '#fff', marginBottom: 2 }}>{fmt(price)}</p>
                  <p style={{ fontSize: '10px', color: '#4ade80', fontWeight: 700 }}>{save}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Specs grid */}
          <div>
            <p style={{ fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.5)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Maelezo ya Gari</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { Icon: Users,       label: 'Viti', val: `${selectedVehicle.seats} Watu` },
                { Icon: SettingsIcon,label: 'Gia',  val: selectedVehicle.transmission === 'automatic' ? 'Automatic' : 'Manual' },
                { Icon: Fuel,        label: 'Mafuta', val: selectedVehicle.fuelType.charAt(0).toUpperCase() + selectedVehicle.fuelType.slice(1) },
                { Icon: Calendar,    label: 'Mwaka', val: `${selectedVehicle.year}` },
              ].map(({ Icon, label, val }) => (
                <div key={label} style={{ padding: '14px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${meta.accent}14`, border: `1px solid ${meta.accent}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon style={{ width: 17, height: 17, color: meta.accent }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>{label}</p>
                    <p style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>{val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <p style={{ fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.5)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Vipengele</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {selectedVehicle.features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 12, background: `${meta.accent}08`, border: `1px solid ${meta.accent}20` }}>
                  <Check style={{ width: 13, height: 13, color: meta.accent, flexShrink: 0 }} />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#fff' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rental company info */}
          <div style={{ padding: '16px', borderRadius: 18, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: `${meta.accent}14`, border: `1px solid ${meta.accent}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Car style={{ width: 22, height: 22, color: meta.accent }} />
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>{selectedVehicle.rentalCompany}</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>{selectedVehicle.location} · Imeidhinishwa</p>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Shield style={{ width: 14, height: 14, color: '#4ade80' }} />
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#4ade80' }}>Imethibitishwa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Book CTA */}
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '14px 16px', background: 'rgba(8,13,8,0.97)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div>
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Kuanzia (kwa siku)</p>
              <p style={{ fontSize: '22px', fontWeight: 900, color: meta.accent, letterSpacing: '-0.4px', lineHeight: 1 }}>{fmt(selectedVehicle.pricePerDay)}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Star style={{ width: 12, height: 12, fill: '#fbbf24', color: '#fbbf24' }} />
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#fff' }}>{selectedVehicle.rating}</span>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>· {selectedVehicle.trips} safari</span>
              </div>
            </div>
          </div>
          <button onClick={() => setActiveView('booking')}
            style={{ width: '100%', height: 52, borderRadius: 16, background: `linear-gradient(135deg,${accentColor},#c2410c)`, border: 'none', color: '#fff', fontWeight: 900, fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: `0 6px 24px ${accentColor}40` }}>
            <Calendar style={{ width: 18, height: 18 }} />
            Weka Gari Hili
          </button>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════
     BOOKING VIEW
  ══════════════════════════════════════════════════════ */
  if (activeView === 'booking' && selectedVehicle) {
    const meta = catMeta!;
    const insLabels = {
      basic: { label: 'Bima ya Msingi', sub: 'Wajibu wa wahusika wengine', price: 'TZS 10K/siku' },
      premium: { label: 'Bima ya Hali ya Juu', sub: 'Collision damage waiver', price: 'TZS 20K/siku' },
      comprehensive: { label: 'Bima Kamili', sub: 'Kila kitu + msaada barabarani', price: 'TZS 30K/siku' },
    };
    return (
      <div style={{ minHeight: '100vh', background: '#080d08', color: '#fff', paddingBottom: 120 }}>
        <div className="sticky top-0 z-20" style={{ background: 'rgba(8,13,8,0.97)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setActiveView('details')} style={{ padding: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
            <ArrowLeft style={{ width: 20, height: 20, color: '#fff' }} />
          </button>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>Weka Gari</h1>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{selectedVehicle.name} · {selectedVehicle.rentalCompany}</p>
          </div>
        </div>

        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Vehicle mini-card */}
          <div style={{ borderRadius: 18, overflow: 'hidden', position: 'relative', height: 110 }}>
            <img src={selectedVehicle.image} alt={selectedVehicle.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(8,13,8,0.97) 0%, rgba(8,13,8,0.5) 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, padding: '16px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: `${meta.accent}18`, border: `1px solid ${meta.accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Car style={{ width: 22, height: 22, color: meta.accent }} />
              </div>
              <div>
                <p style={{ fontSize: '16px', fontWeight: 900, color: '#fff' }}>{selectedVehicle.name}</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{selectedVehicle.rentalCompany}</p>
                <p style={{ fontSize: '13px', fontWeight: 800, color: meta.accent }}>{fmt(selectedVehicle.pricePerDay)}/siku</p>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tarehe za Kukodisha</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'TAREHE YA KUCHUKUA', val: pickupDate, setter: setPickupDate, min: new Date().toISOString().split('T')[0] },
                { label: 'TAREHE YA KURUDISHA', val: dropoffDate, setter: setDropoffDate, min: pickupDate || new Date().toISOString().split('T')[0] },
              ].map(({ label, val, setter, min }) => (
                <div key={label}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '10px', fontWeight: 800, color: meta.accent, marginBottom: 6 }}>
                    <Calendar style={{ width: 11, height: 11 }} />{label}
                  </label>
                  <input type="date" value={val} onChange={e => setter(e.target.value)} min={min} style={darkInput} />
                </div>
              ))}
            </div>
            {rentalDays > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 12, background: `${meta.accent}10`, border: `1px solid ${meta.accent}22` }}>
                <Clock style={{ width: 14, height: 14, color: meta.accent }} />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>Siku {rentalDays} za kukodisha</span>
              </div>
            )}
          </div>

          {/* Locations */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Maeneo</p>
            {[
              { label: 'MAHALI PA KUCHUKUA', val: pickupLocation, setter: setPickupLocation },
              { label: 'MAHALI PA KURUDISHA', val: dropoffLocation, setter: setDropoffLocation },
            ].map(({ label, val, setter }) => (
              <div key={label}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '10px', fontWeight: 800, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>
                  <MapPin style={{ width: 11, height: 11 }} />{label}
                </label>
                <input type="text" value={val} onChange={e => setter(e.target.value)} placeholder="Ingiza anwani"
                  style={{ ...darkInput, border: `1px solid ${val ? meta.accent + '45' : 'rgba(255,255,255,0.12)'}` }} />
              </div>
            ))}
          </div>

          {/* Driver option */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '16px' }}>
            <p style={{ fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Chaguo la Dereva</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { val: false, label: 'Jiendeshe', sub: 'Unaendesha wewe' },
                { val: true,  label: 'Dereva', sub: '+TZS 30K/siku' },
              ].map(opt => (
                <button key={String(opt.val)} onClick={() => setWithDriver(opt.val)}
                  style={{ padding: '14px', borderRadius: 14, textAlign: 'left', border: `2px solid ${withDriver === opt.val ? meta.accent : 'rgba(255,255,255,0.08)'}`, background: withDriver === opt.val ? `${meta.accent}10` : 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <p style={{ fontSize: '13px', fontWeight: 800, color: '#fff', marginBottom: 3 }}>{opt.label}</p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>{opt.sub}</p>
                  {withDriver === opt.val && <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}><Check style={{ width: 12, height: 12, color: meta.accent }} /><span style={{ fontSize: '10px', fontWeight: 700, color: meta.accent }}>Umechagua</span></div>}
                </button>
              ))}
            </div>
          </div>

          {/* Insurance */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '16px' }}>
            <p style={{ fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Bima ya Gari</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(['basic', 'premium', 'comprehensive'] as const).map(ins => {
                const info = insLabels[ins];
                return (
                  <button key={ins} onClick={() => setInsurance(ins)}
                    style={{ padding: '14px 16px', borderRadius: 14, textAlign: 'left', border: `2px solid ${insurance === ins ? '#4ade80' : 'rgba(255,255,255,0.08)'}`, background: insurance === ins ? 'rgba(74,222,128,0.07)' : 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <p style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>{info.label}</p>
                      <p style={{ fontSize: '12px', fontWeight: 800, color: insurance === ins ? '#4ade80' : 'rgba(255,255,255,0.5)' }}>{info.price}</p>
                    </div>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>{info.sub}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cost breakdown */}
          {rentalDays > 0 && (
            <div style={{ padding: '18px', borderRadius: 18, background: 'rgba(255,255,255,0.04)', border: `1px solid ${meta.accent}20` }}>
              <p style={{ fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.5)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Muhtasari wa Gharama</p>
              {[
                ['Gari', `${rentalDays} siku`, fmt(totalCost - (withDriver ? 30000 * rentalDays : 0) - ({ basic: 10000, premium: 20000, comprehensive: 30000 }[insurance]) * rentalDays)],
                withDriver && ['Dereva', `${rentalDays} siku`, fmt(30000 * rentalDays)],
                ['Bima', `${rentalDays} siku`, fmt({ basic: 10000, premium: 20000, comprehensive: 30000 }[insurance] * rentalDays)],
              ].filter(Boolean).map(([label, sub, val]) => (
                <div key={label as string} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>{label}</p>
                    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>{sub}</p>
                  </div>
                  <p style={{ fontSize: '13px', fontWeight: 800, color: meta.accent }}>{val}</p>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, marginTop: 4 }}>
                <p style={{ fontSize: '15px', fontWeight: 900, color: '#fff' }}>Jumla</p>
                <p style={{ fontSize: '24px', fontWeight: 900, color: meta.accent, letterSpacing: '-0.5px' }}>{fmt(totalCost)}</p>
              </div>
            </div>
          )}

          {/* PIN */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: 'rgba(255,255,255,0.7)', marginBottom: 10 }}>Ingiza PIN ya Kuthibitisha</label>
            <input type="password" maxLength={4} placeholder="● ● ● ●" value={pin} onChange={e => setPin(e.target.value)}
              style={{ width: '100%', height: 60, textAlign: 'center', fontSize: '28px', letterSpacing: '10px', borderRadius: 16, background: 'rgba(255,255,255,0.07)', border: `1px solid ${pin.length === 4 ? meta.accent : 'rgba(255,255,255,0.12)'}`, color: '#fff', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.3s' }} />
          </div>

          <div style={{ padding: '12px 14px', borderRadius: 14, background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.15)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield style={{ width: 14, height: 14, color: '#4ade80' }} />
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Malipo yako yanafanywa salama kupitia <strong style={{ color: '#4ade80' }}>goPay Secure</strong></p>
          </div>
        </div>

        {/* Fixed CTA */}
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '14px 16px', background: 'rgba(8,13,8,0.97)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={handleBooking}
            disabled={processing || !pickupDate || !dropoffDate || rentalDays < 1 || pin.length !== 4}
            style={{ width: '100%', height: 54, borderRadius: 16, background: pin.length === 4 && rentalDays > 0 ? `linear-gradient(135deg,${accentColor},#c2410c)` : `${accentColor}28`, border: 'none', color: '#fff', fontWeight: 900, fontSize: '15px', cursor: pin.length !== 4 || rentalDays < 1 ? 'not-allowed' : 'pointer', boxShadow: pin.length === 4 && rentalDays > 0 ? `0 8px 32px ${accentColor}40` : 'none', transition: 'all 0.3s' }}>
            {processing ? 'Inashughulikia...' : rentalDays > 0 ? `Thibitisha — ${fmt(totalCost)}` : 'Chagua Tarehe Kwanza'}
          </button>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════
     CONFIRMATION VIEW
  ══════════════════════════════════════════════════════ */
  const bookingRef = `CR-${Date.now().toString(36).toUpperCase()}`;
  return (
    <div style={{ minHeight: '100vh', background: '#080d08', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <style>{`@keyframes popIn{0%{transform:scale(0);opacity:0}70%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}} @keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>
      <div style={{ maxWidth: 380, width: '100%', color: '#fff', textAlign: 'center' }}>
        {/* Success icon */}
        <div style={{ width: 88, height: 88, borderRadius: '50%', background: `linear-gradient(135deg,${accentColor},#c2410c)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', animation: 'popIn 0.5s ease-out', boxShadow: `0 10px 48px ${accentColor}50` }}>
          <Check style={{ width: 42, height: 42, color: '#fff' }} />
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 900, marginBottom: 6, letterSpacing: '-0.5px' }}>Gari Limebukiwa!</h1>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: 28 }}>Vocha ya kukodisha iko tayari chini</p>

        {selectedVehicle && (
          <div style={{ borderRadius: 24, overflow: 'hidden', marginBottom: 16 }}>
            {/* Car photo strip */}
            <div style={{ height: 120, position: 'relative' }}>
              <img src={selectedVehicle.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(8,13,8,0.95))' }} />
              <div style={{ position: 'absolute', bottom: 12, left: 16 }}>
                <p style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>{selectedVehicle.name}</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>{selectedVehicle.rentalCompany}</p>
              </div>
            </div>

            <div style={{ background: `linear-gradient(135deg,rgba(28,10,0,0.9),${accentColor}15)`, border: `1px solid ${accentColor}25`, borderTop: 'none', padding: '20px' }}>
              {/* Booking ref */}
              <div style={{ position: 'relative', overflow: 'hidden', background: `${accentColor}14`, borderRadius: 14, padding: '14px', marginBottom: 16 }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)', animation: 'shimmer 2.5s linear infinite' }} />
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Nambari ya Vocha</p>
                <p style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '3px', color: accentColor }}>{bookingRef}</p>
              </div>

              {[
                ['Gari',       selectedVehicle.name],
                ['Kuchukua',   pickupDate],
                ['Kurudisha',  dropoffDate],
                ['Siku',       `${rentalDays}`],
                ['Dereva',     withDriver ? 'Imejumuishwa' : 'Jiendeshe'],
                ['Bima',       { basic: 'Msingi', premium: 'Hali ya Juu', comprehensive: 'Kamili' }[insurance]],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{k}</span>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#fff' }}>{v}</span>
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12 }}>
                <span style={{ fontSize: '14px', fontWeight: 900, color: '#fff' }}>Jumla Iliyolipwa</span>
                <span style={{ fontSize: '22px', fontWeight: 900, color: accentColor, letterSpacing: '-0.5px' }}>{fmt(totalCost)}</span>
              </div>
            </div>
          </div>
        )}

        <div style={{ padding: '14px 16px', borderRadius: 16, background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.15)', marginBottom: 20 }}>
          <p style={{ fontSize: '13px', fontWeight: 800, color: '#4ade80', marginBottom: 4 }}>📱 Vocha imetumwa kwa SMS</p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>Onyesha vocha hii wakati wa kuchukua gari. Fika mapema dakika 15.</p>
        </div>

        <button onClick={onBack} style={{ width: '100%', height: 52, borderRadius: 16, background: `linear-gradient(135deg,${accentColor},#c2410c)`, border: 'none', color: '#fff', fontWeight: 900, fontSize: '15px', cursor: 'pointer', boxShadow: `0 8px 32px ${accentColor}40` }}>
          Rudi Nyumbani
        </button>
      </div>
    </div>
  );
}
