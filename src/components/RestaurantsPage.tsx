import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { User } from '../App';
import {
  ArrowLeft, Search, MapPin, Star, Clock, Users, Phone,
  ChevronRight, Heart, Share2, Calendar, Check,
  Wine, Coffee, UtensilsCrossed, Music, Award,
  TrendingUp, Sparkles, Truck, Tag, Shield, Zap,
  DollarSign, Filter
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { RestaurantMenuPage } from './RestaurantMenuPage';

interface RestaurantsPageProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
  spicy?: boolean;
  vegetarian?: boolean;
  customizations?: {
    name: string;
    options: { label: string; price: number }[];
    required: boolean;
  }[];
}

interface CartItem extends MenuItem {
  quantity: number;
  selectedCustomizations?: { [key: string]: string };
  specialInstructions?: string;
}

interface Restaurant {
  id: string;
  name: string;
  category: 'fine-dining' | 'casual' | 'fast-food' | 'bar' | 'nightclub' | 'cafe' | 'rooftop' | 'buffet';
  cuisine: string[];
  rating: number;
  reviews: number;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  location: { city: string; area: string; address: string; };
  image: string;
  hours: string;
  phone: string;
  features: string[];
  specialties: string[];
  averagePrice: number;
  reservationRequired: boolean;
  promoted?: boolean;
  discount?: string;
  happyHour?: { time: string; deal: string; };
  specialOffer?: { title: string; description: string; validUntil?: string; };
  flashDeal?: { percentage: number; endsIn: string; };
  loyaltyReward?: { points: number; description: string; };
  newRestaurant?: boolean;
  freeDelivery?: boolean;
  buyOneGetOne?: string;
  deliveryTime?: string;
  deliveryFee?: number;
}

const CAT_COLORS: Record<string, { accent: string; label: string }> = {
  'fine-dining': { accent: '#fbbf24', label: 'Fine Dining' },
  'bar':         { accent: '#c084fc', label: 'Bar' },
  'casual':      { accent: '#4ade80', label: 'Casual' },
  'nightclub':   { accent: '#f472b6', label: 'Nightlife' },
  'rooftop':     { accent: '#38bdf8', label: 'Rooftop' },
  'cafe':        { accent: '#fb923c', label: 'Café' },
  'buffet':      { accent: '#34d399', label: 'Buffet' },
  'fast-food':   { accent: '#f87171', label: 'Fast Food' },
};

const glass = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 20,
};

export function RestaurantsPage({ user, accessToken, onBack }: RestaurantsPageProps) {
  const [activeView, setActiveView] = useState<'explore' | 'details' | 'menu' | 'booking' | 'confirmation'>('explore');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState('Dar es Salaam');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [menuCategory, setMenuCategory] = useState('all');
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [pin, setPin] = useState('');
  const [processing, setProcessing] = useState(false);

  const categories = [
    { id: 'all',        label: 'Zote',     Icon: UtensilsCrossed, accent: '#4ade80' },
    { id: 'fine-dining',label: 'Starehe',  Icon: Award,           accent: '#fbbf24' },
    { id: 'casual',     label: 'Kawaida',  Icon: Coffee,          accent: '#4ade80' },
    { id: 'bar',        label: 'Baa',      Icon: Wine,            accent: '#c084fc' },
    { id: 'nightclub',  label: 'Usiku',    Icon: Music,           accent: '#f472b6' },
    { id: 'rooftop',    label: 'Rooftop',  Icon: Sparkles,        accent: '#38bdf8' },
  ];

  const cities = ['Dar es Salaam', 'Arusha', 'Mwanza', 'Zanzibar', 'Dodoma'];

  const restaurants: Restaurant[] = [
    {
      id: 'rest-001', name: '305 Karafuu',
      category: 'fine-dining', cuisine: ['Italian', 'Mediterranean', 'Seafood'],
      rating: 4.7, reviews: 2156, priceRange: '$$$',
      location: { city: 'Dar es Salaam', area: 'Masaki', address: 'Haile Selassie Road, Masaki Peninsula' },
      image: 'https://images.unsplash.com/photo-1551218372-a8789b81b253?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      hours: '11:00 AM - 11:30 PM', phone: '+255 786 305 305',
      features: ['Garden Seating', 'Live Music Weekends', 'Wine Cellar', 'Private Dining', 'Takeaway'],
      specialties: ['Wood-Fired Pizza', 'Fresh Pasta', 'Grilled Seafood', 'Italian Wines'],
      averagePrice: 75000, reservationRequired: false, promoted: true,
      deliveryTime: '35-50 min', deliveryFee: 5000, freeDelivery: false,
      happyHour: { time: '5:00 PM - 7:00 PM', deal: '2-for-1 on selected drinks' }
    },
    {
      id: 'rest-002', name: 'Samesame But Different',
      category: 'bar', cuisine: ['Asian Fusion', 'Thai', 'Vietnamese', 'Cocktails'],
      rating: 4.8, reviews: 3247, priceRange: '$$',
      location: { city: 'Dar es Salaam', area: 'Masaki', address: 'Haile Selassie Road, Masaki' },
      image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      hours: '5:00 PM - 2:00 AM', phone: '+255 715 333 444',
      features: ['Craft Cocktails', 'Live DJ', 'Late Night Dining', 'Outdoor Terrace', 'Trendy Atmosphere'],
      specialties: ['Pad Thai', 'Pho', 'Spring Rolls', 'Signature Cocktails', 'Bao Buns'],
      averagePrice: 45000, reservationRequired: false, promoted: true,
      deliveryTime: '30-45 min', deliveryFee: 3500, freeDelivery: false,
      discount: '15% OFF First Order',
      specialOffer: { title: 'Happy Hour Special', description: '50% off all cocktails and selected Asian tapas', validUntil: '2026-01-31' }
    },
    {
      id: 'rest-003', name: 'The Waterfront Sunset Restaurant',
      category: 'fine-dining', cuisine: ['Seafood', 'International', 'Swahili'],
      rating: 4.6, reviews: 1876, priceRange: '$$$',
      location: { city: 'Dar es Salaam', area: 'Masaki', address: 'Slipway, Msasani Peninsula (near Masaki)' },
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      hours: '12:00 PM - 11:00 PM', phone: '+255 22 260 0893',
      features: ['Oceanfront Views', 'Sunset Dining', 'Live Music', 'Beach Access', 'Outdoor Seating'],
      specialties: ['Grilled Prawns', 'Lobster Thermidor', 'Catch of the Day', 'Swahili Curry'],
      averagePrice: 85000, reservationRequired: true,
      deliveryTime: '40-55 min', deliveryFee: 6000, freeDelivery: false
    },
    {
      id: 'rest-004', name: 'Addis in Dar',
      category: 'casual', cuisine: ['Ethiopian', 'East African', 'Vegetarian Options'],
      rating: 4.5, reviews: 1432, priceRange: '$$',
      location: { city: 'Dar es Salaam', area: 'Masaki', address: 'Haile Selassie Road, Opposite French Embassy, Masaki' },
      image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      hours: '11:30 AM - 10:30 PM', phone: '+255 713 299 299',
      features: ['Traditional Dining', 'Vegetarian Friendly', 'Coffee Ceremony', 'Authentic Experience'],
      specialties: ['Injera Platter', 'Doro Wat', 'Kitfo', 'Ethiopian Coffee', 'Vegetarian Combo'],
      averagePrice: 35000, reservationRequired: false,
      deliveryTime: '25-40 min', deliveryFee: 3000, freeDelivery: true,
      buyOneGetOne: 'Buy 1 Injera Platter, Get 1 Coffee Free'
    },
    {
      id: 'rest-005', name: "Epi d'Or",
      category: 'cafe', cuisine: ['French Bakery', 'Breakfast', 'Sandwiches', 'Pastries'],
      rating: 4.7, reviews: 2541, priceRange: '$$',
      location: { city: 'Dar es Salaam', area: 'Masaki', address: 'Haile Selassie Road, Masaki' },
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      hours: '7:00 AM - 8:00 PM', phone: '+255 22 260 1081',
      features: ['Fresh Bakery', 'Outdoor Seating', 'WiFi Available', 'Breakfast All Day', 'Takeaway'],
      specialties: ['Croissants', 'French Baguettes', 'Quiche', 'Pastries', 'Specialty Coffee'],
      averagePrice: 25000, reservationRequired: false, promoted: true,
      deliveryTime: '20-30 min', deliveryFee: 2500, freeDelivery: true
    },
    {
      id: 'rest-006', name: 'The Slow Leopard',
      category: 'casual', cuisine: ['Pizza', 'Burgers', 'International', 'Family Dining'],
      rating: 4.4, reviews: 1987, priceRange: '$$',
      location: { city: 'Dar es Salaam', area: 'Masaki', address: 'Sea Cliff Village, Toure Drive (near Masaki)' },
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      hours: '11:00 AM - 11:00 PM', phone: '+255 787 555 666',
      features: ['Family Friendly', 'Kids Menu', 'Sports Viewing', 'Outdoor Garden', 'Parking'],
      specialties: ['Artisan Pizza', 'Gourmet Burgers', 'Loaded Fries', 'Milkshakes'],
      averagePrice: 32000, reservationRequired: false,
      deliveryTime: '30-45 min', deliveryFee: 4000, freeDelivery: false,
      discount: '10% OFF Pizza Orders'
    },
    {
      id: 'rest-007', name: 'Alcove Restaurant & Lounge',
      category: 'rooftop', cuisine: ['International', 'Fusion', 'Cocktails', 'Tapas'],
      rating: 4.6, reviews: 1654, priceRange: '$$$',
      location: { city: 'Dar es Salaam', area: 'Masaki', address: 'Yacht Club Road, Masaki' },
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      hours: '6:00 PM - 1:00 AM', phone: '+255 768 888 999',
      features: ['Rooftop Terrace', 'Ocean Views', 'Live Entertainment', 'Premium Bar', 'VIP Section'],
      specialties: ['Tapas Selection', 'Signature Cocktails', 'Fusion Dishes', 'DJ Nights'],
      averagePrice: 65000, reservationRequired: true, promoted: true,
      deliveryTime: 'Dine-in only', deliveryFee: 0,
      flashDeal: { percentage: 20, endsIn: '5 days' }
    },
    {
      id: 'rest-008', name: "Chef's Pride",
      category: 'casual', cuisine: ['Indian', 'Pakistani', 'Tandoori', 'Curry'],
      rating: 4.5, reviews: 2234, priceRange: '$$',
      location: { city: 'Dar es Salaam', area: 'Masaki', address: 'Near Masaki Roundabout, Masaki' },
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      hours: '11:00 AM - 11:00 PM', phone: '+255 22 211 8877',
      features: ['Halal Food', 'Vegetarian Options', 'Takeaway', 'Family Dining', 'Air Conditioned'],
      specialties: ['Chicken Tikka', 'Biryani', 'Naan Bread', 'Butter Chicken', 'Samosas'],
      averagePrice: 28000, reservationRequired: false,
      deliveryTime: '25-35 min', deliveryFee: 3000, freeDelivery: true,
      loyaltyReward: { points: 2, description: 'Earn 2x GOrewards points on all orders' }
    },
    {
      id: 'rest-009', name: 'Ristorante Bella Napoli',
      category: 'fine-dining', cuisine: ['Italian', 'Pizza', 'Pasta', 'Wine Bar'],
      rating: 4.8, reviews: 1876, priceRange: '$$$',
      location: { city: 'Dar es Salaam', area: 'Masaki', address: 'Peninsula Hotel, Toure Drive, Masaki' },
      image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      hours: '12:00 PM - 11:00 PM', phone: '+255 22 260 8521',
      features: ['Authentic Italian', 'Wine Cellar', 'Romantic Setting', 'Terrace Dining', 'Hotel Restaurant'],
      specialties: ['Neapolitan Pizza', 'Fresh Pasta', 'Risotto', 'Italian Wines', 'Tiramisu'],
      averagePrice: 70000, reservationRequired: true,
      deliveryTime: '35-50 min', deliveryFee: 5000, freeDelivery: false
    },
    {
      id: 'rest-010', name: 'Mamboz Corner BBQ',
      category: 'casual', cuisine: ['BBQ', 'Grill', 'Local Cuisine', 'Nyama Choma'],
      rating: 4.3, reviews: 3456, priceRange: '$',
      location: { city: 'Dar es Salaam', area: 'Masaki', address: 'Near Masaki Post Office, Masaki' },
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      hours: '5:00 PM - 11:00 PM', phone: '+255 755 123 456',
      features: ['Outdoor BBQ', 'Local Favorite', 'Affordable', 'Late Night', 'Casual Dining'],
      specialties: ['Nyama Choma', 'Mishkaki', 'Grilled Chicken', 'Ugali', 'Chips Mayai'],
      averagePrice: 18000, reservationRequired: false, promoted: true,
      deliveryTime: '20-30 min', deliveryFee: 2000, freeDelivery: true,
      discount: '20% OFF Weekday Orders'
    },
    {
      id: 'rest-011', name: 'Karambezi Cafe',
      category: 'casual', cuisine: ['Seafood', 'Swahili', 'International'],
      rating: 4.6, reviews: 2987, priceRange: '$$',
      location: { city: 'Dar es Salaam', area: 'Sea Cliff (Near Masaki)', address: 'Toure Drive, Sea Cliff Hotel' },
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      hours: '11:00 AM - 10:00 PM', phone: '+255 22 260 0380',
      features: ['Ocean Views', 'Cliff-side Location', 'Romantic Sunsets', 'Open Air', 'Beach Access'],
      specialties: ['Grilled Fish', 'Prawns', 'Octopus', 'Seafood Platter', 'Coconut Rice'],
      averagePrice: 50000, reservationRequired: false,
      deliveryTime: '40-55 min', deliveryFee: 5500, freeDelivery: false
    },
    {
      id: 'rest-012', name: 'Mediterranean Restaurant at Sea Cliff',
      category: 'fine-dining', cuisine: ['Mediterranean', 'Seafood', 'Greek', 'Lebanese'],
      rating: 4.7, reviews: 1543, priceRange: '$$$',
      location: { city: 'Dar es Salaam', area: 'Sea Cliff (Near Masaki)', address: 'Sea Cliff Hotel, Toure Drive' },
      image: 'https://images.unsplash.com/photo-1562184552-bb2e18c945cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      hours: '12:00 PM - 10:30 PM', phone: '+255 22 260 0380',
      features: ['5-Star Hotel', 'Ocean Views', 'Fine Dining', 'Wine Selection', 'Elegant Setting'],
      specialties: ['Mezze Platter', 'Grilled Halloumi', 'Lamb Kofta', 'Fresh Seafood', 'Baklava'],
      averagePrice: 80000, reservationRequired: true,
      deliveryTime: 'Dine-in preferred', deliveryFee: 7000, freeDelivery: false
    },
    {
      id: 'rest-013', name: 'Zuane Masaki',
      category: 'cafe', cuisine: ['Cafe', 'Breakfast', 'Light Bites', 'Coffee'],
      rating: 4.4, reviews: 1234, priceRange: '$',
      location: { city: 'Dar es Salaam', area: 'Masaki', address: 'Haile Selassie Road, Masaki' },
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      hours: '7:00 AM - 7:00 PM', phone: '+255 784 567 890',
      features: ['Cozy Cafe', 'WiFi', 'Outdoor Seating', 'Pet Friendly', 'Work-Friendly'],
      specialties: ['Specialty Coffee', 'Fresh Juices', 'Sandwiches', 'Breakfast Bowls', 'Smoothies'],
      averagePrice: 15000, reservationRequired: false,
      deliveryTime: '15-25 min', deliveryFee: 2000, freeDelivery: true, newRestaurant: true
    },
    {
      id: 'rest-014', name: 'Akemi Revolving Restaurant',
      category: 'fine-dining', cuisine: ['Japanese', 'Asian Fusion', 'Sushi', 'Teppanyaki'],
      rating: 4.9, reviews: 2134, priceRange: '$$$$',
      location: { city: 'Dar es Salaam', area: 'City Centre (15min from Masaki)', address: 'PSPF Towers, 21st Floor, Samora Avenue' },
      image: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      hours: '6:00 PM - 11:00 PM', phone: '+255 22 211 6655',
      features: ['360° Rotating Views', 'Premium Dining', 'City Skyline', 'Dress Code', 'Valet Parking'],
      specialties: ['Omakase Sushi', 'Teppanyaki Show', 'Wagyu Beef', 'Premium Sake', 'Sunset Experience'],
      averagePrice: 150000, reservationRequired: true, promoted: true,
      deliveryTime: 'Dine-in only', deliveryFee: 0, discount: '15% OFF Dinner Bookings'
    },
    {
      id: 'rest-015', name: 'Q-Bar',
      category: 'bar', cuisine: ['Sports Bar', 'American', 'Pub Food', 'Wings'],
      rating: 4.3, reviews: 1765, priceRange: '$$',
      location: { city: 'Dar es Salaam', area: 'Masaki', address: 'Quality Center Mall, Haile Selassie Road' },
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      hours: '11:00 AM - 12:00 AM', phone: '+255 22 260 1212',
      features: ['Sports Screens', 'Pool Tables', 'Live Sports', 'Happy Hour', 'Air Conditioned'],
      specialties: ['Buffalo Wings', 'Burgers', 'Loaded Nachos', 'Craft Beers', 'Game Day Specials'],
      averagePrice: 35000, reservationRequired: false,
      deliveryTime: '25-40 min', deliveryFee: 3500, freeDelivery: false,
      happyHour: { time: '4:00 PM - 7:00 PM', deal: 'Buy 1 Get 1 Free on Beers' }
    }
  ];

  const filteredRestaurants = restaurants.filter(rest => {
    const matchesCategory = selectedCategory === 'all' || rest.category === selectedCategory;
    const matchesCity = rest.location.city === selectedCity;
    const matchesSearch = searchQuery === '' ||
      rest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rest.cuisine.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      rest.location.area.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesCity && matchesSearch;
  });

  const handleBooking = async () => {
    if (!selectedRestaurant || !bookingDate || !bookingTime || !pin) {
      toast.error('Tafadhali jaza sehemu zote zinazohitajika');
      return;
    }
    setProcessing(true);
    try {
      const depositAmount = selectedRestaurant.reservationRequired ? 20000 : 0;
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/restaurants/book`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ restaurantId: selectedRestaurant.id, restaurantName: selectedRestaurant.name, date: bookingDate, time: bookingTime, guests, specialRequests, depositAmount, pin }),
        }
      );
      const data = await response.json();
      if (response.ok) { setActiveView('confirmation'); }
      else { toast.error(data.error || 'Uhifadhi umeshindwa'); }
    } catch {
      toast.error('Uhifadhi umeshindwa. Jaribu tena.');
    } finally {
      setProcessing(false);
    }
  };

  const toggleFavorite = (id: string) =>
    setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const catAccent = CAT_COLORS[selectedRestaurant?.category ?? '']?.accent ?? '#4ade80';

  // ── EXPLORE VIEW ──────────────────────────────────────────────────────────
  if (activeView === 'explore') {
    return (
      <div style={{ minHeight: '100vh', background: '#080d08', color: '#fff', paddingBottom: 40 }}>
        <style>{`
          @keyframes liveDot{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.5);opacity:0.5}}
          .rest-card:active{transform:scale(0.985)}
          .rest-card{transition:transform 0.15s ease}
        `}</style>

        {/* Sticky header */}
        <div className="sticky top-0 z-20" style={{ background: 'rgba(8,13,8,0.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ padding: '14px 16px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <button onClick={onBack} className="active:scale-95 transition-transform"
                style={{ padding: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
                <ArrowLeft style={{ width: 20, height: 20, color: '#fff' }} />
              </button>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '20px', fontWeight: 900, color: '#fff' }}>Migahawa & Baa</h1>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Gundua maeneo mazuri · Hifadhi meza</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 20, background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', animation: 'liveDot 2s ease-in-out infinite' }} />
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#4ade80' }}>Wazi Sasa</span>
              </div>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <Search style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'rgba(255,255,255,0.35)' }} />
              <input
                type="text"
                placeholder="Tafuta migahawa, vyakula, eneo..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', height: 44, paddingLeft: 42, paddingRight: 16, borderRadius: 22, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* City pills */}
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, scrollbarWidth: 'none' }}>
              {cities.map(city => (
                <button key={city} onClick={() => setSelectedCity(city)}
                  style={{ flexShrink: 0, padding: '7px 16px', borderRadius: 20, fontWeight: 700, fontSize: '12px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s ease',
                    background: selectedCity === city ? '#16a34a' : 'rgba(255,255,255,0.07)',
                    color: selectedCity === city ? '#fff' : 'rgba(255,255,255,0.55)' }}>
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 16px 12px', scrollbarWidth: 'none' }}>
            {categories.map(cat => {
              const active = selectedCategory === cat.id;
              return (
                <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                  style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 20, fontWeight: 700, fontSize: '12px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s ease',
                    background: active ? `${cat.accent}22` : 'rgba(255,255,255,0.06)',
                    color: active ? cat.accent : 'rgba(255,255,255,0.5)',
                    outline: active ? `1px solid ${cat.accent}40` : 'none' }}>
                  <cat.Icon style={{ width: 14, height: 14 }} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results */}
        <div style={{ padding: '14px 16px 0' }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginBottom: 14 }}>
            {filteredRestaurants.length} maeneo yalipatikana · {selectedCity}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filteredRestaurants.map(rest => {
              const catInfo = CAT_COLORS[rest.category];
              const accent = catInfo?.accent ?? '#4ade80';
              const isFav = favorites.includes(rest.id);
              return (
                <div key={rest.id} className="rest-card"
                  style={{ borderRadius: 22, overflow: 'hidden', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>

                  {/* Photo */}
                  <div style={{ position: 'relative', height: 180 }}>
                    <ImageWithFallback src={rest.image} alt={rest.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,13,8,0.92) 0%, rgba(8,13,8,0.2) 45%, transparent 100%)' }} />

                    {/* Top-left badges */}
                    <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
                      {rest.promoted && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 20, background: '#16a34a' }}>
                          <TrendingUp style={{ width: 11, height: 11, color: '#fff' }} />
                          <span style={{ fontSize: '10px', fontWeight: 900, color: '#fff' }}>Inakubalika</span>
                        </div>
                      )}
                      {rest.newRestaurant && (
                        <div style={{ padding: '4px 10px', borderRadius: 20, background: '#0ea5e9' }}>
                          <span style={{ fontSize: '10px', fontWeight: 900, color: '#fff' }}>KIPYA</span>
                        </div>
                      )}
                      {rest.flashDeal && (
                        <div style={{ padding: '4px 10px', borderRadius: 20, background: '#f97316' }}>
                          <span style={{ fontSize: '10px', fontWeight: 900, color: '#fff' }}>⚡ {rest.flashDeal.percentage}% OFF</span>
                        </div>
                      )}
                    </div>

                    {/* Top-right: discount + heart */}
                    <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 6, alignItems: 'center' }}>
                      {rest.discount && (
                        <div style={{ padding: '4px 10px', borderRadius: 20, background: '#dc2626' }}>
                          <span style={{ fontSize: '10px', fontWeight: 900, color: '#fff' }}>{rest.discount.split(' ').slice(0,2).join(' ')}</span>
                        </div>
                      )}
                      <button onClick={e => { e.stopPropagation(); toggleFavorite(rest.id); }}
                        style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(8,13,8,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Heart style={{ width: 15, height: 15, color: isFav ? '#f87171' : '#fff', fill: isFav ? '#f87171' : 'none' }} />
                      </button>
                    </div>

                    {/* Bottom overlay info: name + delivery */}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 14px 10px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                            <span style={{ fontSize: '16px', fontWeight: 900, color: '#fff' }}>{rest.name}</span>
                            <span style={{ fontSize: '11px', fontWeight: 800, color: accent, padding: '2px 8px', borderRadius: 10, background: `${accent}20` }}>{catInfo?.label}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Star style={{ width: 13, height: 13, color: '#fbbf24', fill: '#fbbf24' }} />
                              <span style={{ fontSize: '13px', fontWeight: 800, color: '#fbbf24' }}>{rest.rating}</span>
                              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>({rest.reviews.toLocaleString()})</span>
                            </div>
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>·</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <MapPin style={{ width: 11, height: 11, color: 'rgba(255,255,255,0.5)' }} />
                              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)' }}>{rest.location.area}</span>
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 12, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
                          <Clock style={{ width: 12, height: 12, color: 'rgba(255,255,255,0.7)' }} />
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#fff' }}>{rest.deliveryTime ?? '–'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Info bar */}
                  <div
                    onClick={() => { setSelectedRestaurant(rest); setActiveView('details'); }}
                    style={{ padding: '12px 14px 14px', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {rest.cuisine.slice(0, 3).map(c => (
                          <span key={c} style={{ fontSize: '11px', fontWeight: 600, padding: '4px 9px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}>{c}</span>
                        ))}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {rest.freeDelivery && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 10, background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.2)' }}>
                            <Truck style={{ width: 11, height: 11, color: '#4ade80' }} />
                            <span style={{ fontSize: '10px', fontWeight: 700, color: '#4ade80' }}>Bure</span>
                          </div>
                        )}
                        <span style={{ fontSize: '13px', fontWeight: 800, color: 'rgba(255,255,255,0.6)' }}>{rest.priceRange}</span>
                        <ChevronRight style={{ width: 16, height: 16, color: 'rgba(255,255,255,0.3)' }} />
                      </div>
                    </div>

                    {/* Special offers */}
                    {(rest.happyHour || rest.loyaltyReward || rest.buyOneGetOne) && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {rest.happyHour && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 10, background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }}>
                            <Zap style={{ width: 11, height: 11, color: '#fbbf24' }} />
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#fbbf24' }}>Happy Hour {rest.happyHour.time.split(' - ')[0]}</span>
                          </div>
                        )}
                        {rest.loyaltyReward && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 10, background: 'rgba(192,132,252,0.1)', border: '1px solid rgba(192,132,252,0.2)' }}>
                            <Star style={{ width: 11, height: 11, color: '#c084fc' }} />
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#c084fc' }}>{rest.loyaltyReward.points}x Pointi</span>
                          </div>
                        )}
                        {rest.buyOneGetOne && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 10, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}>
                            <Tag style={{ width: 11, height: 11, color: '#34d399' }} />
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#34d399' }}>Buy 1 Get 1</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── DETAILS VIEW ──────────────────────────────────────────────────────────
  if (activeView === 'details' && selectedRestaurant) {
    return (
      <div style={{ minHeight: '100vh', background: '#080d08', color: '#fff', paddingBottom: 100 }}>
        {/* Hero image */}
        <div style={{ position: 'relative', height: 280 }}>
          <ImageWithFallback src={selectedRestaurant.image} alt={selectedRestaurant.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(8,13,8,0.5) 0%, transparent 40%, rgba(8,13,8,0.9) 100%)' }} />
          <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 10 }}>
            <button onClick={() => setActiveView('explore')} className="active:scale-95 transition-transform"
              style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(8,13,8,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowLeft style={{ width: 18, height: 18, color: '#fff' }} />
            </button>
          </div>
          <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 8 }}>
            <button onClick={() => toggleFavorite(selectedRestaurant.id)} className="active:scale-95 transition-transform"
              style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(8,13,8,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Heart style={{ width: 18, height: 18, color: favorites.includes(selectedRestaurant.id) ? '#f87171' : '#fff', fill: favorites.includes(selectedRestaurant.id) ? '#f87171' : 'none' }} />
            </button>
          </div>
          {selectedRestaurant.discount && (
            <div style={{ position: 'absolute', bottom: 16, left: 16, padding: '6px 14px', borderRadius: 20, background: '#dc2626' }}>
              <span style={{ fontSize: '12px', fontWeight: 900, color: '#fff' }}>{selectedRestaurant.discount}</span>
            </div>
          )}
        </div>

        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Title row */}
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#fff', marginBottom: 4 }}>{selectedRestaurant.name}</h1>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{selectedRestaurant.cuisine.join(' · ')}</p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ fontSize: '22px', fontWeight: 900, color: catAccent }}>{selectedRestaurant.priceRange}</p>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>Bei ya wastani</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Star style={{ width: 16, height: 16, color: '#fbbf24', fill: '#fbbf24' }} />
                <span style={{ fontSize: '16px', fontWeight: 900, color: '#fbbf24' }}>{selectedRestaurant.rating}</span>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>({selectedRestaurant.reviews.toLocaleString()} maoni)</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {selectedRestaurant.features.map((f, i) => (
                <span key={i} style={{ fontSize: '11px', fontWeight: 600, padding: '5px 11px', borderRadius: 20, background: `${catAccent}14`, border: `1px solid ${catAccent}25`, color: catAccent }}>{f}</span>
              ))}
            </div>
          </div>

          {/* Info grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { Icon: MapPin, label: 'Mahali', val: selectedRestaurant.location.area, sub: selectedRestaurant.location.address, accent: '#60a5fa' },
              { Icon: Clock, label: 'Saa', val: selectedRestaurant.hours, sub: 'Wazi Sasa', accent: '#4ade80' },
              { Icon: Phone, label: 'Simu', val: selectedRestaurant.phone, sub: null, accent: '#fb923c' },
              { Icon: DollarSign, label: 'Bei ya Wastani', val: `TZS ${selectedRestaurant.averagePrice.toLocaleString()}`, sub: null, accent: '#fbbf24' },
            ].map(({ Icon, label, val, sub, accent }) => (
              <div key={label} style={{ padding: '14px', borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 9, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon style={{ width: 14, height: 14, color: accent }} />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.55)' }}>{label}</span>
                </div>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>{val}</p>
                {sub && <p style={{ fontSize: '11px', color: accent, marginTop: 2 }}>{sub}</p>}
              </div>
            ))}
          </div>

          {/* Specialties */}
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: 900, color: '#fff', marginBottom: 10 }}>Vyakula Maalum</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {selectedRestaurant.specialties.map((s, i) => (
                <div key={i} style={{ padding: '12px', borderRadius: 14, background: `${catAccent}10`, border: `1px solid ${catAccent}20` }}>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: catAccent }}>{s}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Happy Hour / Special Offer */}
          {selectedRestaurant.happyHour && (
            <div style={{ padding: '14px 16px', borderRadius: 16, background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Zap style={{ width: 15, height: 15, color: '#fbbf24' }} />
                <span style={{ fontSize: '13px', fontWeight: 900, color: '#fbbf24' }}>Happy Hour · {selectedRestaurant.happyHour.time}</span>
              </div>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{selectedRestaurant.happyHour.deal}</p>
            </div>
          )}
        </div>

        {/* Bottom CTAs */}
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '14px 16px', background: 'rgba(8,13,8,0.97)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button onClick={() => setActiveView('menu')} className="active:scale-95 transition-transform"
            style={{ height: 52, borderRadius: 16, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontWeight: 800, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
            <UtensilsCrossed style={{ width: 18, height: 18 }} />
            Ona Menyu
          </button>
          <button onClick={() => setActiveView('booking')} className="active:scale-95 transition-transform"
            style={{ height: 52, borderRadius: 16, background: 'linear-gradient(135deg,#16a34a,#15803d)', border: 'none', color: '#fff', fontWeight: 800, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', boxShadow: '0 4px 20px rgba(22,163,74,0.35)' }}>
            <Calendar style={{ width: 18, height: 18 }} />
            Hifadhi Meza
          </button>
          {selectedRestaurant.reservationRequired && (
            <p style={{ gridColumn: '1/-1', fontSize: '11px', textAlign: 'center', color: 'rgba(255,255,255,0.35)' }}>
              Amana ya kurudishwa: TZS 20,000
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── MENU VIEW ─────────────────────────────────────────────────────────────
  if (activeView === 'menu' && selectedRestaurant) {
    return (
      <RestaurantMenuPage
        restaurant={{ id: selectedRestaurant.id, name: selectedRestaurant.name, deliveryTime: selectedRestaurant.deliveryTime || '30-45 min', deliveryFee: selectedRestaurant.deliveryFee || 5000, rating: selectedRestaurant.rating, image: selectedRestaurant.image, freeDelivery: selectedRestaurant.freeDelivery, discount: selectedRestaurant.discount }}
        accessToken={accessToken}
        onBack={() => setActiveView('details')}
        onOrderComplete={onBack}
      />
    );
  }

  // ── BOOKING VIEW ──────────────────────────────────────────────────────────
  if (activeView === 'booking' && selectedRestaurant) {
    const depositAmount = selectedRestaurant.reservationRequired ? 20000 : 0;
    return (
      <div style={{ minHeight: '100vh', background: '#080d08', color: '#fff', paddingBottom: 40 }}>
        <div className="sticky top-0 z-20" style={{ background: 'rgba(8,13,8,0.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 16px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setActiveView('details')} className="active:scale-95 transition-transform"
            style={{ padding: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft style={{ width: 20, height: 20, color: '#fff' }} />
          </button>
          <h1 style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>Hifadhi Meza</h1>
        </div>

        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Restaurant card */}
          <div style={{ padding: '16px', borderRadius: 18, background: `${catAccent}10`, border: `1px solid ${catAccent}25` }}>
            <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#fff', marginBottom: 4 }}>{selectedRestaurant.name}</h3>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>{selectedRestaurant.location.area}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Star style={{ width: 14, height: 14, color: '#fbbf24', fill: '#fbbf24' }} />
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#fbbf24' }}>{selectedRestaurant.rating}</span>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>· {selectedRestaurant.priceRange}</span>
            </div>
          </div>

          {/* Date */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>Tarehe</label>
            <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} min={new Date().toISOString().split('T')[0]}
              style={{ width: '100%', height: 48, padding: '0 16px', borderRadius: 14, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          {/* Time */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>Saa</label>
            <select value={bookingTime} onChange={e => setBookingTime(e.target.value)}
              style={{ width: '100%', height: 48, padding: '0 16px', borderRadius: 14, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: bookingTime ? '#fff' : 'rgba(255,255,255,0.4)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}>
              <option value="">Chagua saa</option>
              {['12:00','12:30','13:00','13:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00'].map(t => (
                <option key={t} value={t} style={{ background: '#0f1a0f' }}>{t.split(':')[0] > '12' ? `${parseInt(t)-12 || 12}:${t.split(':')[1]} PM` : `${t} PM`}</option>
              ))}
            </select>
          </div>

          {/* Guests */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>Idadi ya Wageni</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button onClick={() => setGuests(Math.max(1, guests - 1))}
                style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '22px', fontWeight: 700, cursor: 'pointer' }}>−</button>
              <span style={{ fontSize: '26px', fontWeight: 900, color: '#fff', flex: 1, textAlign: 'center' }}>{guests}</span>
              <button onClick={() => setGuests(Math.min(20, guests + 1))}
                style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '22px', fontWeight: 700, cursor: 'pointer' }}>+</button>
            </div>
          </div>

          {/* Special requests */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>Maombi Maalum (Hiari)</label>
            <textarea value={specialRequests} onChange={e => setSpecialRequests(e.target.value)}
              placeholder="Kiti cha dirisha, mahitaji ya chakula, sherehe..." rows={3}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '14px', outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
          </div>

          {/* Deposit notice */}
          {depositAmount > 0 && (
            <div style={{ padding: '14px 16px', borderRadius: 16, background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
              <p style={{ fontSize: '13px', fontWeight: 900, color: '#fbbf24', marginBottom: 4 }}>Amana ya Uhifadhi</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>
                Amana ya kurudishwa ya TZS {depositAmount.toLocaleString()} inahitajika kuthibitisha nafasi yako
              </p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>✓ Inarudishwa ukikatisha masaa 24+ kabla · ✓ Inaondolewa kwenye bili yako</p>
            </div>
          )}

          {/* PIN */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>Ingiza PIN ya Kuthibitisha</label>
            <input type="password" maxLength={4} placeholder="● ● ● ●" value={pin} onChange={e => setPin(e.target.value)}
              style={{ width: '100%', height: 56, textAlign: 'center', fontSize: '24px', letterSpacing: '8px', borderRadius: 14, background: 'rgba(255,255,255,0.07)', border: `1px solid ${pin.length === 4 ? '#4ade80' : 'rgba(255,255,255,0.12)'}`, color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          {/* Confirm button */}
          <button onClick={handleBooking} disabled={processing || !bookingDate || !bookingTime || pin.length !== 4}
            className="active:scale-95 transition-transform"
            style={{ width: '100%', height: 56, borderRadius: 18, background: processing || !bookingDate || !bookingTime || pin.length !== 4 ? 'rgba(22,163,74,0.4)' : 'linear-gradient(135deg,#16a34a,#15803d)', border: 'none', color: '#fff', fontWeight: 900, fontSize: '15px', cursor: processing || !bookingDate || !bookingTime || pin.length !== 4 ? 'not-allowed' : 'pointer', boxShadow: '0 4px 20px rgba(22,163,74,0.3)' }}>
            {processing ? 'Inashughulikia...' : `Thibitisha Uhifadhi${depositAmount > 0 ? ` · TZS ${depositAmount.toLocaleString()}` : ''}`}
          </button>
        </div>
      </div>
    );
  }

  // ── CONFIRMATION VIEW ─────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#080d08', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center', maxWidth: 380, width: '100%' }}>
        <style>{`@keyframes scaleIn{0%{transform:scale(0);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}`}</style>
        <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'linear-gradient(135deg,#16a34a,#15803d)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', animation: 'scaleIn 0.5s ease-out forwards', boxShadow: '0 8px 40px rgba(22,163,74,0.4)' }}>
          <Check style={{ width: 42, height: 42, color: '#fff' }} />
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', marginBottom: 8 }}>Uhifadhi Umethibitishwa!</h1>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: 28 }}>Meza yako imehifadhiwa</p>

        {selectedRestaurant && (
          <div style={{ padding: '20px', borderRadius: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: 20, textAlign: 'left' }}>
            {[
              { label: 'Mgahawa', val: selectedRestaurant.name },
              { label: 'Tarehe', val: bookingDate },
              { label: 'Saa', val: bookingTime },
              { label: 'Wageni', val: `${guests} watu` },
              ...(selectedRestaurant.reservationRequired ? [{ label: 'Amana Iliyolipwa', val: 'TZS 20,000', green: true }] : []),
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: i > 0 ? '10px 0 0' : '0', borderTop: i > 0 ? '1px solid rgba(255,255,255,0.06)' : 'none', marginTop: i > 0 ? 10 : 0 }}>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>{row.label}</span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: (row as any).green ? '#4ade80' : '#fff' }}>{row.val}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ padding: '14px 16px', borderRadius: 16, background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', marginBottom: 24 }}>
          <p style={{ fontSize: '13px', fontWeight: 800, color: '#4ade80', marginBottom: 4 }}>📱 Maelezo yametumwa kwa SMS</p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Tafadhali fika dakika 10 mapema. Piga simu mgahawa ukihitaji mabadiliko.</p>
        </div>

        <button onClick={onBack} className="active:scale-95 transition-transform"
          style={{ width: '100%', height: 52, borderRadius: 18, background: 'linear-gradient(135deg,#16a34a,#15803d)', border: 'none', color: '#fff', fontWeight: 900, fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(22,163,74,0.3)' }}>
          Rudi Nyumbani
        </button>
      </div>
    </div>
  );
}
