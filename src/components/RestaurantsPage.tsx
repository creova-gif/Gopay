import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { User } from '../App';
import { 
  ArrowLeft, Search, MapPin, Star, Clock, Users, Phone, 
  ChevronRight, Filter, Heart, Share2, Calendar, Check,
  Wine, Coffee, UtensilsCrossed, Music, DollarSign, Award,
  TrendingUp, Sparkles, X, Navigation, Globe, ShoppingCart,
  Plus, Minus, Tag, Truck, Package, AlertCircle, Info
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
  location: {
    city: string;
    area: string;
    address: string;
  };
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

export function RestaurantsPage({ user, accessToken, onBack }: RestaurantsPageProps) {
  const [activeView, setActiveView] = useState<'explore' | 'details' | 'menu' | 'cart' | 'checkout' | 'confirmation'>('explore');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState('Dar es Salaam');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Menu & Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [menuCategory, setMenuCategory] = useState('all');
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  
  // Booking state
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [pin, setPin] = useState('');
  const [processing, setProcessing] = useState(false);

  const categories = [
    { id: 'all', label: 'All', icon: UtensilsCrossed },
    { id: 'fine-dining', label: 'Fine Dining', icon: Award },
    { id: 'casual', label: 'Casual', icon: Coffee },
    { id: 'bar', label: 'Bars', icon: Wine },
    { id: 'nightclub', label: 'Nightlife', icon: Music },
    { id: 'rooftop', label: 'Rooftop', icon: Sparkles },
  ];

  const cities = ['Dar es Salaam', 'Arusha', 'Mwanza', 'Zanzibar', 'Dodoma'];

  const restaurants: Restaurant[] = [
    // MASAKI AREA - REAL RESTAURANTS
    {
      id: 'rest-001',
      name: '305 Karafuu',
      category: 'fine-dining',
      cuisine: ['Italian', 'Mediterranean', 'Seafood'],
      rating: 4.7,
      reviews: 2156,
      priceRange: '$$$',
      location: {
        city: 'Dar es Salaam',
        area: 'Masaki',
        address: 'Haile Selassie Road, Masaki Peninsula'
      },
      image: 'https://images.unsplash.com/photo-1551218372-a8789b81b253?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      hours: '11:00 AM - 11:30 PM',
      phone: '+255 786 305 305',
      features: ['Garden Seating', 'Live Music Weekends', 'Wine Cellar', 'Private Dining', 'Takeaway'],
      specialties: ['Wood-Fired Pizza', 'Fresh Pasta', 'Grilled Seafood', 'Italian Wines'],
      averagePrice: 75000,
      reservationRequired: false,
      promoted: true,
      deliveryTime: '35-50 min',
      deliveryFee: 5000,
      freeDelivery: false,
      happyHour: { time: '5:00 PM - 7:00 PM', deal: '2-for-1 on selected drinks' }
    },
    {
      id: 'rest-002',
      name: 'Samesame But Different',
      category: 'bar',
      cuisine: ['Asian Fusion', 'Thai', 'Vietnamese', 'Cocktails'],
      rating: 4.8,
      reviews: 3247,
      priceRange: '$$',
      location: {
        city: 'Dar es Salaam',
        area: 'Masaki',
        address: 'Haile Selassie Road, Masaki'
      },
      image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      hours: '5:00 PM - 2:00 AM',
      phone: '+255 715 333 444',
      features: ['Craft Cocktails', 'Live DJ', 'Late Night Dining', 'Outdoor Terrace', 'Trendy Atmosphere'],
      specialties: ['Pad Thai', 'Pho', 'Spring Rolls', 'Signature Cocktails', 'Bao Buns'],
      averagePrice: 45000,
      reservationRequired: false,
      promoted: true,
      deliveryTime: '30-45 min',
      deliveryFee: 3500,
      freeDelivery: false,
      discount: '15% OFF First Order',
      specialOffer: { 
        title: 'Happy Hour Special', 
        description: '50% off all cocktails and selected Asian tapas',
        validUntil: '2026-01-31'
      }
    },
    {
      id: 'rest-003',
      name: 'The Waterfront Sunset Restaurant',
      category: 'fine-dining',
      cuisine: ['Seafood', 'International', 'Swahili'],
      rating: 4.6,
      reviews: 1876,
      priceRange: '$$$',
      location: {
        city: 'Dar es Salaam',
        area: 'Masaki',
        address: 'Slipway, Msasani Peninsula (near Masaki)'
      },
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      hours: '12:00 PM - 11:00 PM',
      phone: '+255 22 260 0893',
      features: ['Oceanfront Views', 'Sunset Dining', 'Live Music', 'Beach Access', 'Outdoor Seating'],
      specialties: ['Grilled Prawns', 'Lobster Thermidor', 'Catch of the Day', 'Swahili Curry'],
      averagePrice: 85000,
      reservationRequired: true,
      deliveryTime: '40-55 min',
      deliveryFee: 6000,
      freeDelivery: false
    },
    {
      id: 'rest-004',
      name: 'Addis in Dar',
      category: 'casual',
      cuisine: ['Ethiopian', 'East African', 'Vegetarian Options'],
      rating: 4.5,
      reviews: 1432,
      priceRange: '$$',
      location: {
        city: 'Dar es Salaam',
        area: 'Masaki',
        address: 'Haile Selassie Road, Opposite French Embassy, Masaki'
      },
      image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      hours: '11:30 AM - 10:30 PM',
      phone: '+255 713 299 299',
      features: ['Traditional Dining', 'Vegetarian Friendly', 'Coffee Ceremony', 'Authentic Experience'],
      specialties: ['Injera Platter', 'Doro Wat', 'Kitfo', 'Ethiopian Coffee', 'Vegetarian Combo'],
      averagePrice: 35000,
      reservationRequired: false,
      deliveryTime: '25-40 min',
      deliveryFee: 3000,
      freeDelivery: true,
      buyOneGetOne: 'Buy 1 Injera Platter, Get 1 Coffee Free'
    },
    {
      id: 'rest-005',
      name: 'Epi d\'Or',
      category: 'cafe',
      cuisine: ['French Bakery', 'Breakfast', 'Sandwiches', 'Pastries'],
      rating: 4.7,
      reviews: 2541,
      priceRange: '$$',
      location: {
        city: 'Dar es Salaam',
        area: 'Masaki',
        address: 'Haile Selassie Road, Masaki'
      },
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      hours: '7:00 AM - 8:00 PM',
      phone: '+255 22 260 1081',
      features: ['Fresh Bakery', 'Outdoor Seating', 'WiFi Available', 'Breakfast All Day', 'Takeaway'],
      specialties: ['Croissants', 'French Baguettes', 'Quiche', 'Pastries', 'Specialty Coffee'],
      averagePrice: 25000,
      reservationRequired: false,
      promoted: true,
      deliveryTime: '20-30 min',
      deliveryFee: 2500,
      freeDelivery: true,
      newRestaurant: false
    },
    {
      id: 'rest-006',
      name: 'The Slow Leopard',
      category: 'casual',
      cuisine: ['Pizza', 'Burgers', 'International', 'Family Dining'],
      rating: 4.4,
      reviews: 1987,
      priceRange: '$$',
      location: {
        city: 'Dar es Salaam',
        area: 'Masaki',
        address: 'Sea Cliff Village, Toure Drive (near Masaki)'
      },
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      hours: '11:00 AM - 11:00 PM',
      phone: '+255 787 555 666',
      features: ['Family Friendly', 'Kids Menu', 'Sports Viewing', 'Outdoor Garden', 'Parking'],
      specialties: ['Artisan Pizza', 'Gourmet Burgers', 'Loaded Fries', 'Milkshakes'],
      averagePrice: 32000,
      reservationRequired: false,
      deliveryTime: '30-45 min',
      deliveryFee: 4000,
      freeDelivery: false,
      discount: '10% OFF Pizza Orders'
    },
    {
      id: 'rest-007',
      name: 'Alcove Restaurant & Lounge',
      category: 'rooftop',
      cuisine: ['International', 'Fusion', 'Cocktails', 'Tapas'],
      rating: 4.6,
      reviews: 1654,
      priceRange: '$$$',
      location: {
        city: 'Dar es Salaam',
        area: 'Masaki',
        address: 'Yacht Club Road, Masaki'
      },
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      hours: '6:00 PM - 1:00 AM',
      phone: '+255 768 888 999',
      features: ['Rooftop Terrace', 'Ocean Views', 'Live Entertainment', 'Premium Bar', 'VIP Section'],
      specialties: ['Tapas Selection', 'Signature Cocktails', 'Fusion Dishes', 'DJ Nights'],
      averagePrice: 65000,
      reservationRequired: true,
      promoted: true,
      deliveryTime: 'Dine-in only',
      deliveryFee: 0,
      flashDeal: { percentage: 20, endsIn: '5 days' }
    },
    {
      id: 'rest-008',
      name: 'Chef\'s Pride',
      category: 'casual',
      cuisine: ['Indian', 'Pakistani', 'Tandoori', 'Curry'],
      rating: 4.5,
      reviews: 2234,
      priceRange: '$$',
      location: {
        city: 'Dar es Salaam',
        area: 'Masaki',
        address: 'Near Masaki Roundabout, Masaki'
      },
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      hours: '11:00 AM - 11:00 PM',
      phone: '+255 22 211 8877',
      features: ['Halal Food', 'Vegetarian Options', 'Takeaway', 'Family Dining', 'Air Conditioned'],
      specialties: ['Chicken Tikka', 'Biryani', 'Naan Bread', 'Butter Chicken', 'Samosas'],
      averagePrice: 28000,
      reservationRequired: false,
      deliveryTime: '25-35 min',
      deliveryFee: 3000,
      freeDelivery: true,
      loyaltyReward: { points: 2, description: 'Earn 2x GOrewards points on all orders' }
    },
    {
      id: 'rest-009',
      name: 'Ristorante Bella Napoli',
      category: 'fine-dining',
      cuisine: ['Italian', 'Pizza', 'Pasta', 'Wine Bar'],
      rating: 4.8,
      reviews: 1876,
      priceRange: '$$$',
      location: {
        city: 'Dar es Salaam',
        area: 'Masaki',
        address: 'Peninsula Hotel, Toure Drive, Masaki'
      },
      image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      hours: '12:00 PM - 11:00 PM',
      phone: '+255 22 260 8521',
      features: ['Authentic Italian', 'Wine Cellar', 'Romantic Setting', 'Terrace Dining', 'Hotel Restaurant'],
      specialties: ['Neapolitan Pizza', 'Fresh Pasta', 'Risotto', 'Italian Wines', 'Tiramisu'],
      averagePrice: 70000,
      reservationRequired: true,
      deliveryTime: '35-50 min',
      deliveryFee: 5000,
      freeDelivery: false
    },
    {
      id: 'rest-010',
      name: 'Mamboz Corner BBQ',
      category: 'casual',
      cuisine: ['BBQ', 'Grill', 'Local Cuisine', 'Nyama Choma'],
      rating: 4.3,
      reviews: 3456,
      priceRange: '$',
      location: {
        city: 'Dar es Salaam',
        area: 'Masaki',
        address: 'Near Masaki Post Office, Masaki'
      },
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      hours: '5:00 PM - 11:00 PM',
      phone: '+255 755 123 456',
      features: ['Outdoor BBQ', 'Local Favorite', 'Affordable', 'Late Night', 'Casual Dining'],
      specialties: ['Nyama Choma', 'Mishkaki', 'Grilled Chicken', 'Ugali', 'Chips Mayai'],
      averagePrice: 18000,
      reservationRequired: false,
      promoted: true,
      deliveryTime: '20-30 min',
      deliveryFee: 2000,
      freeDelivery: true,
      discount: '20% OFF Weekday Orders'
    },
    {
      id: 'rest-011',
      name: 'Karambezi Cafe',
      category: 'casual',
      cuisine: ['Seafood', 'Swahili', 'International'],
      rating: 4.6,
      reviews: 2987,
      priceRange: '$$',
      location: {
        city: 'Dar es Salaam',
        area: 'Sea Cliff (Near Masaki)',
        address: 'Toure Drive, Sea Cliff Hotel'
      },
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      hours: '11:00 AM - 10:00 PM',
      phone: '+255 22 260 0380',
      features: ['Ocean Views', 'Cliff-side Location', 'Romantic Sunsets', 'Open Air', 'Beach Access'],
      specialties: ['Grilled Fish', 'Prawns', 'Octopus', 'Seafood Platter', 'Coconut Rice'],
      averagePrice: 50000,
      reservationRequired: false,
      deliveryTime: '40-55 min',
      deliveryFee: 5500,
      freeDelivery: false
    },
    {
      id: 'rest-012',
      name: 'Mediterranean Restaurant at Sea Cliff',
      category: 'fine-dining',
      cuisine: ['Mediterranean', 'Seafood', 'Greek', 'Lebanese'],
      rating: 4.7,
      reviews: 1543,
      priceRange: '$$$',
      location: {
        city: 'Dar es Salaam',
        area: 'Sea Cliff (Near Masaki)',
        address: 'Sea Cliff Hotel, Toure Drive'
      },
      image: 'https://images.unsplash.com/photo-1562184552-bb2e18c945cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      hours: '12:00 PM - 10:30 PM',
      phone: '+255 22 260 0380',
      features: ['5-Star Hotel', 'Ocean Views', 'Fine Dining', 'Wine Selection', 'Elegant Setting'],
      specialties: ['Mezze Platter', 'Grilled Halloumi', 'Lamb Kofta', 'Fresh Seafood', 'Baklava'],
      averagePrice: 80000,
      reservationRequired: true,
      deliveryTime: 'Dine-in preferred',
      deliveryFee: 7000,
      freeDelivery: false
    },
    {
      id: 'rest-013',
      name: 'Zuane Masaki',
      category: 'cafe',
      cuisine: ['Cafe', 'Breakfast', 'Light Bites', 'Coffee'],
      rating: 4.4,
      reviews: 1234,
      priceRange: '$',
      location: {
        city: 'Dar es Salaam',
        area: 'Masaki',
        address: 'Haile Selassie Road, Masaki'
      },
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      hours: '7:00 AM - 7:00 PM',
      phone: '+255 784 567 890',
      features: ['Cozy Cafe', 'WiFi', 'Outdoor Seating', 'Pet Friendly', 'Work-Friendly'],
      specialties: ['Specialty Coffee', 'Fresh Juices', 'Sandwiches', 'Breakfast Bowls', 'Smoothies'],
      averagePrice: 15000,
      reservationRequired: false,
      deliveryTime: '15-25 min',
      deliveryFee: 2000,
      freeDelivery: true,
      newRestaurant: true
    },
    {
      id: 'rest-014',
      name: 'Akemi Revolving Restaurant',
      category: 'fine-dining',
      cuisine: ['Japanese', 'Asian Fusion', 'Sushi', 'Teppanyaki'],
      rating: 4.9,
      reviews: 2134,
      priceRange: '$$$$',
      location: {
        city: 'Dar es Salaam',
        area: 'City Centre (15min from Masaki)',
        address: 'PSPF Towers, 21st Floor, Samora Avenue'
      },
      image: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      hours: '6:00 PM - 11:00 PM',
      phone: '+255 22 211 6655',
      features: ['360° Rotating Views', 'Premium Dining', 'City Skyline', 'Dress Code', 'Valet Parking'],
      specialties: ['Omakase Sushi', 'Teppanyaki Show', 'Wagyu Beef', 'Premium Sake', 'Sunset Experience'],
      averagePrice: 150000,
      reservationRequired: true,
      promoted: true,
      deliveryTime: 'Dine-in only',
      deliveryFee: 0,
      discount: '15% OFF Dinner Bookings'
    },
    {
      id: 'rest-015',
      name: 'Q-Bar',
      category: 'bar',
      cuisine: ['Sports Bar', 'American', 'Pub Food', 'Wings'],
      rating: 4.3,
      reviews: 1765,
      priceRange: '$$',
      location: {
        city: 'Dar es Salaam',
        area: 'Masaki',
        address: 'Quality Center Mall, Haile Selassie Road'
      },
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      hours: '11:00 AM - 12:00 AM',
      phone: '+255 22 260 1212',
      features: ['Sports Screens', 'Pool Tables', 'Live Sports', 'Happy Hour', 'Air Conditioned'],
      specialties: ['Buffalo Wings', 'Burgers', 'Loaded Nachos', 'Craft Beers', 'Game Day Specials'],
      averagePrice: 35000,
      reservationRequired: false,
      deliveryTime: '25-40 min',
      deliveryFee: 3500,
      freeDelivery: false,
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
      alert('Please fill in all required fields');
      return;
    }

    setProcessing(true);
    try {
      const depositAmount = selectedRestaurant.reservationRequired ? 20000 : 0;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/restaurants/book`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            restaurantId: selectedRestaurant.id,
            restaurantName: selectedRestaurant.name,
            date: bookingDate,
            time: bookingTime,
            guests,
            specialRequests,
            depositAmount,
            pin
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setActiveView('confirmation');
      } else {
        alert(data.error || 'Booking failed');
      }
    } catch (error) {
      console.error('Error booking restaurant:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const toggleFavorite = (restaurantId: string) => {
    setFavorites(prev => 
      prev.includes(restaurantId) 
        ? prev.filter(id => id !== restaurantId)
        : [...prev, restaurantId]
    );
  };

  // Explore View
  if (activeView === 'explore') {
    return (
      <div className="min-h-screen bg-white pb-20">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                <ArrowLeft className="size-6" />
              </button>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">Restaurants & Bars</h1>
                <p className="text-sm text-gray-500">Discover & book amazing places</p>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search restaurants, cuisine, area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-gray-100 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* City Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap font-medium text-sm transition-all ${
                    selectedCity === city
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap font-medium text-sm transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="size-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              {filteredRestaurants.length} places found in {selectedCity}
            </p>
          </div>

          <div className="space-y-4">
            {filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="w-full bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100"
              >
                <div className="relative h-48">
                  <ImageWithFallback 
                    src={restaurant.image} 
                    alt={restaurant.name} 
                    className="w-full h-full object-cover"
                  />
                  {restaurant.promoted && (
                    <div className="absolute top-3 left-3 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                      <TrendingUp className="size-3" />
                      Featured
                    </div>
                  )}
                  {restaurant.discount && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1.5 rounded-full font-bold">
                      {restaurant.discount}
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(restaurant.id);
                    }}
                    className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all"
                  >
                    <Heart 
                      className={`size-5 ${
                        favorites.includes(restaurant.id) 
                          ? 'fill-red-500 text-red-500' 
                          : 'text-gray-600'
                      }`} 
                    />
                  </button>
                </div>

                <div 
                  onClick={() => {
                    setSelectedRestaurant(restaurant);
                    setActiveView('details');
                  }}
                  className="p-4 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{restaurant.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {restaurant.cuisine.join(' • ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-600 font-bold text-sm">
                        {restaurant.priceRange}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="size-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-black">{restaurant.rating}</span>
                      <span>({restaurant.reviews})</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="size-4" />
                      <span>{restaurant.location.area}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {restaurant.features.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Details View
  if (activeView === 'details' && selectedRestaurant) {
    return (
      <div className="min-h-screen bg-white pb-20">
        {/* Hero Image */}
        <div className="relative h-72">
          <ImageWithFallback 
            src={selectedRestaurant.image} 
            alt={selectedRestaurant.name} 
            className="w-full h-full object-cover"
          />
          <button 
            onClick={() => setActiveView('explore')}
            className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-2 rounded-full"
          >
            <ArrowLeft className="size-6" />
          </button>
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="bg-white/95 backdrop-blur-sm p-2 rounded-full">
              <Share2 className="size-6" />
            </button>
            <button 
              onClick={() => toggleFavorite(selectedRestaurant.id)}
              className="bg-white/95 backdrop-blur-sm p-2 rounded-full"
            >
              <Heart 
                className={`size-6 ${
                  favorites.includes(selectedRestaurant.id) 
                    ? 'fill-red-500 text-red-500' 
                    : 'text-gray-600'
                }`} 
              />
            </button>
          </div>
          {selectedRestaurant.discount && (
            <div className="absolute bottom-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
              {selectedRestaurant.discount}
            </div>
          )}
        </div>

        <div className="p-4 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">{selectedRestaurant.name}</h1>
                <p className="text-gray-600 mb-3">
                  {selectedRestaurant.cuisine.join(' • ')}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-700">
                  {selectedRestaurant.priceRange}
                </div>
                <p className="text-xs text-gray-500">Price Range</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="size-5 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-lg">{selectedRestaurant.rating}</span>
                <span className="text-gray-500 text-sm">({selectedRestaurant.reviews} reviews)</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedRestaurant.features.map((feature, idx) => (
                <span key={idx} className="text-sm bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-medium">
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="size-5 text-green-600" />
                <span className="font-bold text-sm">Location</span>
              </div>
              <p className="text-sm text-gray-700">{selectedRestaurant.location.area}</p>
              <p className="text-xs text-gray-500 mt-1">{selectedRestaurant.location.address}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="size-5 text-green-600" />
                <span className="font-bold text-sm">Hours</span>
              </div>
              <p className="text-sm text-gray-700">{selectedRestaurant.hours}</p>
              <p className="text-xs text-green-600 mt-1">Open Now</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="size-5 text-green-600" />
                <span className="font-bold text-sm">Contact</span>
              </div>
              <p className="text-sm text-gray-700">{selectedRestaurant.phone}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="size-5 text-green-600" />
                <span className="font-bold text-sm">Average Price</span>
              </div>
              <p className="text-sm font-bold text-gray-700">
                TZS {selectedRestaurant.averagePrice.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Specialties */}
          <div>
            <h2 className="text-lg font-bold mb-3">Specialties</h2>
            <div className="grid grid-cols-2 gap-2">
              {selectedRestaurant.specialties.map((specialty, idx) => (
                <div key={idx} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100">
                  <p className="text-sm font-semibold text-green-900">{specialty}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Booking CTA */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-4 -mx-4 px-4">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <Button
                onClick={() => setActiveView('menu')}
                className="h-14 bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 rounded-full font-bold text-base flex items-center justify-center gap-2"
              >
                <UtensilsCrossed className="size-5" />
                View Menu
              </Button>
              <Button
                onClick={() => setActiveView('booking')}
                className="h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full font-bold text-base flex items-center justify-center gap-2"
              >
                <Calendar className="size-5" />
                Reserve Table
              </Button>
            </div>
            {selectedRestaurant.reservationRequired && (
              <p className="text-xs text-center text-gray-500">
                Reservation deposit: TZS 20,000 (refundable)
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Menu View - Show full menu ordering experience
  if (activeView === 'menu' && selectedRestaurant) {
    return (
      <RestaurantMenuPage
        restaurant={{
          id: selectedRestaurant.id,
          name: selectedRestaurant.name,
          deliveryTime: selectedRestaurant.deliveryTime || '30-45 min',
          deliveryFee: selectedRestaurant.deliveryFee || 5000,
          rating: selectedRestaurant.rating,
          image: selectedRestaurant.image,
          freeDelivery: selectedRestaurant.freeDelivery,
          discount: selectedRestaurant.discount
        }}
        accessToken={accessToken}
        onBack={() => setActiveView('details')}
        onOrderComplete={onBack}
      />
    );
  }

  // Booking View
  if (activeView === 'booking' && selectedRestaurant) {
    const depositAmount = selectedRestaurant.reservationRequired ? 20000 : 0;

    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveView('details')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-xl font-bold">Book Table</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Restaurant Summary */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
            <h3 className="font-bold text-lg mb-1">{selectedRestaurant.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{selectedRestaurant.location.area}</p>
            <div className="flex items-center gap-2">
              <Star className="size-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold">{selectedRestaurant.rating}</span>
              <span className="text-sm text-gray-500">• {selectedRestaurant.priceRange}</span>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block font-bold mb-2">Date</label>
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
            />
          </div>

          {/* Time */}
          <div>
            <label className="block font-bold mb-2">Time</label>
            <select
              value={bookingTime}
              onChange={(e) => setBookingTime(e.target.value)}
              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
            >
              <option value="">Select time</option>
              <option value="12:00">12:00 PM</option>
              <option value="12:30">12:30 PM</option>
              <option value="13:00">1:00 PM</option>
              <option value="13:30">1:30 PM</option>
              <option value="18:00">6:00 PM</option>
              <option value="18:30">6:30 PM</option>
              <option value="19:00">7:00 PM</option>
              <option value="19:30">7:30 PM</option>
              <option value="20:00">8:00 PM</option>
              <option value="20:30">8:30 PM</option>
              <option value="21:00">9:00 PM</option>
            </select>
          </div>

          {/* Guests */}
          <div>
            <label className="block font-bold mb-2">Number of Guests</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className="w-12 h-12 bg-gray-100 rounded-full font-bold hover:bg-gray-200"
              >
                -
              </button>
              <span className="text-2xl font-bold flex-1 text-center">{guests}</span>
              <button
                onClick={() => setGuests(Math.min(20, guests + 1))}
                className="w-12 h-12 bg-gray-100 rounded-full font-bold hover:bg-gray-200"
              >
                +
              </button>
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label className="block font-bold mb-2">Special Requests (Optional)</label>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Window seat, dietary requirements, celebrations..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none resize-none"
            />
          </div>

          {/* Deposit Info */}
          {depositAmount > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-yellow-900 mb-1">Reservation Deposit</p>
              <p className="text-xs text-yellow-800 mb-2">
                A refundable deposit of TZS {depositAmount.toLocaleString()} is required to secure your booking
              </p>
              <p className="text-xs text-yellow-700">
                ✓ Refunded if you cancel 24+ hours before • ✓ Applied to your bill
              </p>
            </div>
          )}

          {/* PIN */}
          <div>
            <label className="block font-bold mb-2">Enter PIN to Confirm</label>
            <input
              type="password"
              maxLength={4}
              placeholder="4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full h-14 text-center text-2xl tracking-widest border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
            />
          </div>

          {/* Book Button */}
          <Button
            onClick={handleBooking}
            disabled={processing || !bookingDate || !bookingTime || pin.length !== 4}
            className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full font-bold text-lg disabled:opacity-50"
          >
            {processing ? 'Processing...' : `Confirm Booking${depositAmount > 0 ? ` - TZS ${depositAmount.toLocaleString()}` : ''}`}
          </Button>
        </div>
      </div>
    );
  }

  // Confirmation View
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="size-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600 mb-6">
          Your table has been reserved
        </p>

        {selectedRestaurant && (
          <div className="bg-gray-50 rounded-2xl p-6 mb-6 text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Restaurant</span>
              <span className="font-bold">{selectedRestaurant.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Date</span>
              <span className="font-semibold">{bookingDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Time</span>
              <span className="font-semibold">{bookingTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Guests</span>
              <span className="font-semibold">{guests} people</span>
            </div>
            {selectedRestaurant.reservationRequired && (
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-sm text-gray-600">Deposit Paid</span>
                <span className="font-semibold text-green-600">TZS 20,000</span>
              </div>
            )}
          </div>
        )}

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-sm font-semibold text-green-900 mb-1">📱 Booking details sent via SMS</p>
          <p className="text-xs text-green-700">
            Please arrive 10 minutes early. Call the restaurant if you need to make changes.
          </p>
        </div>

        <Button
          onClick={onBack}
          className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full font-bold"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}