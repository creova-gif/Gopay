import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { User } from '../App';
import { 
  ArrowLeft, Search, MapPin, Star, Clock, Users, Phone, 
  ChevronRight, Filter, Heart, Share2, Calendar, Check,
  UtensilsCrossed, Bike, Store, Navigation, TrendingUp,
  Plus, Minus, Tag, Truck, ShoppingCart, X, AlertCircle,
  Info, Percent, Zap, Award, Crown, Package, DollarSign, Coffee
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface GoFoodPageProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

type ServiceType = 'delivery' | 'dine-in' | 'takeaway';
type CuisineType = 'swahili' | 'indian' | 'chinese' | 'italian' | 'seafood' | 'bbq' | 'fast-food' | 'cafe' | 'continental' | 'pizza' | 'burger' | 'nyama-choma';

interface Restaurant {
  id: string;
  name: string;
  cuisine: CuisineType[];
  rating: number;
  reviews: number;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  region: string;
  area: string;
  address: string;
  image: string;
  isOpen: boolean;
  openingHours: string;
  closingHours: string;
  phone: string;
  services: ServiceType[];
  deliveryTime?: string;
  deliveryFee?: number;
  minimumOrder?: number;
  specialties: string[];
  promoted?: boolean;
  discount?: number;
  freeDelivery?: boolean;
  newRestaurant?: boolean;
  distance?: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
  popular?: boolean;
  spicy?: boolean;
  vegetarian?: boolean;
}

interface CartItem extends MenuItem {
  quantity: number;
  specialInstructions?: string;
}

export function GoFoodPage({ user, accessToken, onBack }: GoFoodPageProps) {
  const [activeView, setActiveView] = useState<'home' | 'restaurant' | 'cart' | 'checkout' | 'tracking'>('home');
  const [selectedRegion, setSelectedRegion] = useState('Dar es Salaam');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<ServiceType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderType, setOrderType] = useState<'delivery' | 'takeaway' | 'dine-in'>('delivery');
  const [selectedTime, setSelectedTime] = useState<'now' | 'schedule'>('now');
  const [scheduledTime, setScheduledTime] = useState('');
  const [checkoutPin, setCheckoutPin] = useState('');
  const [placing, setPlacing] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');

  const tanzaniaRegions = [
    'Dar es Salaam', 'Arusha', 'Mwanza', 'Dodoma', 'Mbeya', 
    'Zanzibar', 'Tanga', 'Morogoro', 'Iringa', 'Moshi',
    'Shinyanga', 'Tabora', 'Kigoma', 'Songea', 'Bukoba'
  ];

  // REAL TANZANIA RESTAURANTS - Comprehensive Coverage
  const restaurants: Restaurant[] = [
    // DAR ES SALAAM - Fine Dining & Upscale
    {
      id: 'coco-beach',
      name: 'Coco Beach Restaurant',
      cuisine: ['seafood', 'continental'],
      rating: 4.7,
      reviews: 856,
      priceRange: '$$$',
      region: 'Dar es Salaam',
      area: 'Oyster Bay',
      address: 'Toure Drive, Oyster Bay',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      isOpen: true,
      openingHours: '11:00',
      closingHours: '23:00',
      phone: '+255 22 260 0535',
      services: ['delivery', 'dine-in', 'takeaway'],
      deliveryTime: '45-60 min',
      deliveryFee: 8000,
      minimumOrder: 25000,
      specialties: ['Grilled Lobster', 'Seafood Platter', 'Ocean View Dining'],
      promoted: true,
      discount: 15
    },
    {
      id: 'addis-dar',
      name: 'Addis in Dar',
      cuisine: ['continental', 'seafood'],
      rating: 4.8,
      reviews: 1203,
      priceRange: '$$$$',
      region: 'Dar es Salaam',
      area: 'Masaki',
      address: 'Haile Selassie Road, Masaki',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
      isOpen: true,
      openingHours: '12:00',
      closingHours: '23:30',
      phone: '+255 22 260 0537',
      services: ['dine-in', 'takeaway'],
      specialties: ['Fine Dining', 'Ethiopian-Tanzanian Fusion', 'Wine Selection'],
      promoted: true
    },
    {
      id: 'samaki-samaki',
      name: 'Samaki Samaki',
      cuisine: ['seafood', 'swahili'],
      rating: 4.6,
      reviews: 742,
      priceRange: '$$',
      region: 'Dar es Salaam',
      area: 'Slipway',
      address: 'Slipway Shopping Center, Msasani Peninsula',
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
      isOpen: true,
      openingHours: '10:00',
      closingHours: '22:00',
      phone: '+255 22 260 0893',
      services: ['delivery', 'dine-in', 'takeaway'],
      deliveryTime: '40-50 min',
      deliveryFee: 7000,
      minimumOrder: 20000,
      specialties: ['Fresh Fish', 'Coconut Curry', 'Grilled Octopus'],
      freeDelivery: true
    },
    {
      id: 'karambezi',
      name: 'Karambezi Café',
      cuisine: ['seafood', 'continental'],
      rating: 4.5,
      reviews: 689,
      priceRange: '$$',
      region: 'Dar es Salaam',
      area: 'Sea Cliff',
      address: 'Toure Drive, Sea Cliff',
      image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
      isOpen: true,
      openingHours: '08:00',
      closingHours: '22:00',
      phone: '+255 22 260 0880',
      services: ['dine-in', 'takeaway'],
      specialties: ['Seafood Pizza', 'Ocean View', 'Sunset Dining'],
      discount: 10
    },

    // DAR ES SALAAM - Casual & Popular
    {
      id: 'chowpatty',
      name: 'Chowpatty Restaurant',
      cuisine: ['indian'],
      rating: 4.6,
      reviews: 934,
      priceRange: '$$',
      region: 'Dar es Salaam',
      area: 'Upanga',
      address: 'Ali Hassan Mwinyi Road, Upanga',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
      isOpen: true,
      openingHours: '11:00',
      closingHours: '22:30',
      phone: '+255 22 211 2727',
      services: ['delivery', 'dine-in', 'takeaway'],
      deliveryTime: '35-45 min',
      deliveryFee: 5000,
      minimumOrder: 15000,
      specialties: ['Biryani', 'Tandoori', 'Paneer Tikka'],
      promoted: true,
      freeDelivery: true
    },
    {
      id: 'khans-bbq',
      name: "Khan's BBQ Tonight",
      cuisine: ['bbq', 'indian'],
      rating: 4.7,
      reviews: 1156,
      priceRange: '$$',
      region: 'Dar es Salaam',
      area: 'Masaki',
      address: 'Haile Selassie Road, Masaki',
      image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800',
      isOpen: true,
      openingHours: '11:30',
      closingHours: '23:00',
      phone: '+255 22 260 1447',
      services: ['delivery', 'dine-in', 'takeaway'],
      deliveryTime: '40-50 min',
      deliveryFee: 6000,
      minimumOrder: 18000,
      specialties: ['BBQ Platter', 'Seekh Kabab', 'Tikka'],
      discount: 20,
      promoted: true
    },
    {
      id: 'protea-terrace',
      name: 'Protea Hotel Courtyard Terrace',
      cuisine: ['continental', 'swahili'],
      rating: 4.4,
      reviews: 567,
      priceRange: '$$$',
      region: 'Dar es Salaam',
      area: 'Kisutu',
      address: 'Ohio Street, Kisutu',
      image: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800',
      isOpen: true,
      openingHours: '06:00',
      closingHours: '22:00',
      phone: '+255 22 213 0130',
      services: ['dine-in', 'takeaway'],
      specialties: ['Breakfast Buffet', 'Business Lunch', 'Hotel Dining']
    },
    {
      id: 'mc-moody',
      name: "Mc Moody's Cafe",
      cuisine: ['cafe', 'fast-food'],
      rating: 4.3,
      reviews: 445,
      priceRange: '$',
      region: 'Dar es Salaam',
      area: 'Mikocheni',
      address: 'Ali Hassan Mwinyi Road, Mikocheni',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
      isOpen: true,
      openingHours: '07:00',
      closingHours: '21:00',
      phone: '+255 22 270 0142',
      services: ['delivery', 'dine-in', 'takeaway'],
      deliveryTime: '25-35 min',
      deliveryFee: 4000,
      minimumOrder: 10000,
      specialties: ['Coffee', 'Pastries', 'Breakfast'],
      freeDelivery: true
    },

    // DAR ES SALAAM - Fast Food & Quick Service
    {
      id: 'steers-slipway',
      name: 'Steers Slipway',
      cuisine: ['fast-food', 'burger'],
      rating: 4.2,
      reviews: 623,
      priceRange: '$',
      region: 'Dar es Salaam',
      area: 'Slipway',
      address: 'Slipway Shopping Center',
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800',
      isOpen: true,
      openingHours: '09:00',
      closingHours: '22:00',
      phone: '+255 22 260 0894',
      services: ['delivery', 'dine-in', 'takeaway'],
      deliveryTime: '20-30 min',
      deliveryFee: 5000,
      minimumOrder: 12000,
      specialties: ['Burgers', 'Chips', 'Ice Cream'],
      promoted: true,
      discount: 15
    },
    {
      id: 'chicken-inn',
      name: 'Chicken Inn Mlimani City',
      cuisine: ['fast-food'],
      rating: 4.0,
      reviews: 789,
      priceRange: '$',
      region: 'Dar es Salaam',
      area: 'Mlimani City',
      address: 'Sam Nujoma Road, Mlimani City Mall',
      image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800',
      isOpen: true,
      openingHours: '08:00',
      closingHours: '22:00',
      phone: '+255 22 277 5151',
      services: ['delivery', 'takeaway'],
      deliveryTime: '25-35 min',
      deliveryFee: 4000,
      minimumOrder: 10000,
      specialties: ['Fried Chicken', 'Wings', 'Family Meals'],
      freeDelivery: true
    },
    {
      id: 'subway-dar',
      name: 'Subway Mlimani',
      cuisine: ['fast-food'],
      rating: 4.1,
      reviews: 512,
      priceRange: '$',
      region: 'Dar es Salaam',
      area: 'Mlimani City',
      address: 'Mlimani City Mall',
      image: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800',
      isOpen: true,
      openingHours: '08:00',
      closingHours: '21:00',
      phone: '+255 22 277 5152',
      services: ['delivery', 'dine-in', 'takeaway'],
      deliveryTime: '20-30 min',
      deliveryFee: 4000,
      minimumOrder: 8000,
      specialties: ['Sandwiches', 'Salads', 'Healthy Options']
    },

    // DAR ES SALAAM - Pizza & Italian
    {
      id: 'pizza-hut-dar',
      name: 'Pizza Hut Oyster Bay',
      cuisine: ['pizza', 'italian'],
      rating: 4.2,
      reviews: 845,
      priceRange: '$$',
      region: 'Dar es Salaam',
      area: 'Oyster Bay',
      address: 'Toure Drive, Oyster Bay',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
      isOpen: true,
      openingHours: '10:00',
      closingHours: '23:00',
      phone: '+255 22 260 0540',
      services: ['delivery', 'dine-in', 'takeaway'],
      deliveryTime: '30-40 min',
      deliveryFee: 5000,
      minimumOrder: 15000,
      specialties: ['Pan Pizza', 'Stuffed Crust', 'Pasta'],
      discount: 25,
      promoted: true
    },
    {
      id: 'la-dolce-vita',
      name: 'La Dolce Vita Pizzeria',
      cuisine: ['italian', 'pizza'],
      rating: 4.6,
      reviews: 678,
      priceRange: '$$',
      region: 'Dar es Salaam',
      area: 'Masaki',
      address: 'Haile Selassie Road',
      image: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=800',
      isOpen: true,
      openingHours: '11:00',
      closingHours: '22:30',
      phone: '+255 22 260 1234',
      services: ['delivery', 'dine-in', 'takeaway'],
      deliveryTime: '35-45 min',
      deliveryFee: 6000,
      minimumOrder: 18000,
      specialties: ['Wood-Fired Pizza', 'Pasta', 'Italian Cuisine'],
      freeDelivery: true
    },

    // DAR ES SALAAM - Local Swahili Food
    {
      id: 'mama-ntilies',
      name: "Mama Ntilie's Kitchen",
      cuisine: ['swahili'],
      rating: 4.5,
      reviews: 534,
      priceRange: '$',
      region: 'Dar es Salaam',
      area: 'Kariakoo',
      address: 'Msimbazi Street, Kariakoo',
      image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800',
      isOpen: true,
      openingHours: '07:00',
      closingHours: '20:00',
      phone: '+255 754 123 456',
      services: ['delivery', 'dine-in', 'takeaway'],
      deliveryTime: '30-40 min',
      deliveryFee: 3000,
      minimumOrder: 8000,
      specialties: ['Pilau', 'Ugali & Dagaa', 'Coconut Rice'],
      newRestaurant: false
    },
    {
      id: 'nyama-choma-corner',
      name: 'Nyama Choma Corner',
      cuisine: ['nyama-choma', 'bbq'],
      rating: 4.4,
      reviews: 892,
      priceRange: '$$',
      region: 'Dar es Salaam',
      area: 'Mikocheni',
      address: 'Mikocheni Light Industrial Area',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
      isOpen: true,
      openingHours: '11:00',
      closingHours: '23:00',
      phone: '+255 755 234 567',
      services: ['delivery', 'dine-in', 'takeaway'],
      deliveryTime: '35-45 min',
      deliveryFee: 5000,
      minimumOrder: 15000,
      specialties: ['Grilled Goat', 'Beef Ribs', 'Mishkaki'],
      promoted: true,
      discount: 10
    },

    // DAR ES SALAAM - Chinese
    {
      id: 'china-garden',
      name: 'China Garden Restaurant',
      cuisine: ['chinese'],
      rating: 4.3,
      reviews: 456,
      priceRange: '$$',
      region: 'Dar es Salaam',
      area: 'City Center',
      address: 'Samora Avenue',
      image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800',
      isOpen: true,
      openingHours: '11:00',
      closingHours: '22:00',
      phone: '+255 22 211 5678',
      services: ['delivery', 'dine-in', 'takeaway'],
      deliveryTime: '35-45 min',
      deliveryFee: 5000,
      minimumOrder: 15000,
      specialties: ['Dim Sum', 'Peking Duck', 'Fried Rice']
    },
    {
      id: 'oriental-restaurant',
      name: 'The Oriental Restaurant',
      cuisine: ['chinese', 'swahili'],
      rating: 4.4,
      reviews: 567,
      priceRange: '$$',
      region: 'Dar es Salaam',
      area: 'Upanga',
      address: 'Kisutu Street',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
      isOpen: true,
      openingHours: '10:00',
      closingHours: '22:00',
      phone: '+255 22 212 6789',
      services: ['delivery', 'dine-in', 'takeaway'],
      deliveryTime: '30-40 min',
      deliveryFee: 5000,
      minimumOrder: 12000,
      specialties: ['Mixed Cuisine', 'Spring Rolls', 'Sweet & Sour']
    },

    // ARUSHA RESTAURANTS
    {
      id: 'blue-heron',
      name: 'Blue Heron Restaurant',
      cuisine: ['continental', 'seafood'],
      rating: 4.7,
      reviews: 423,
      priceRange: '$$$',
      region: 'Arusha',
      area: 'Njiro',
      address: 'Serengeti Road, Njiro',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      isOpen: true,
      openingHours: '11:00',
      closingHours: '22:00',
      phone: '+255 27 254 8997',
      services: ['dine-in', 'takeaway'],
      specialties: ['European Cuisine', 'Fresh Trout', 'Garden Setting'],
      promoted: true
    },
    {
      id: 'fifi-arusha',
      name: "Fifi's Restaurant",
      cuisine: ['swahili', 'continental'],
      rating: 4.5,
      reviews: 378,
      priceRange: '$$',
      region: 'Arusha',
      area: 'City Center',
      address: 'Boma Road',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
      isOpen: true,
      openingHours: '07:00',
      closingHours: '21:00',
      phone: '+255 27 254 4045',
      services: ['delivery', 'dine-in', 'takeaway'],
      deliveryTime: '30-40 min',
      deliveryFee: 5000,
      minimumOrder: 12000,
      specialties: ['Local Breakfast', 'Pilau', 'Fresh Juices']
    },
    {
      id: 'khan-arusha',
      name: "Khan's BBQ Arusha",
      cuisine: ['bbq', 'indian'],
      rating: 4.6,
      reviews: 512,
      priceRange: '$$',
      region: 'Arusha',
      area: 'Sokoine Road',
      address: 'Sokoine Road',
      image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800',
      isOpen: true,
      openingHours: '11:30',
      closingHours: '22:00',
      phone: '+255 27 250 7788',
      services: ['delivery', 'dine-in', 'takeaway'],
      deliveryTime: '35-45 min',
      deliveryFee: 5000,
      minimumOrder: 15000,
      specialties: ['Tandoori', 'Tikka', 'Biryani'],
      discount: 15,
      promoted: true
    },
    {
      id: 'via-via-arusha',
      name: 'Via Via Arusha',
      cuisine: ['cafe', 'continental'],
      rating: 4.4,
      reviews: 289,
      priceRange: '$$',
      region: 'Arusha',
      area: 'Boma',
      address: 'Boma Road',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
      isOpen: true,
      openingHours: '08:00',
      closingHours: '22:00',
      phone: '+255 27 254 4087',
      services: ['dine-in', 'takeaway'],
      specialties: ['Coffee', 'Breakfast', 'Cultural Hub']
    },

    // MWANZA RESTAURANTS
    {
      id: 'tilapia-hotel',
      name: 'Tilapia Hotel & Restaurant',
      cuisine: ['seafood', 'swahili'],
      rating: 4.5,
      reviews: 456,
      priceRange: '$$',
      region: 'Mwanza',
      area: 'Capri Point',
      address: 'Capri Point',
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
      isOpen: true,
      openingHours: '10:00',
      closingHours: '22:00',
      phone: '+255 28 255 0617',
      services: ['delivery', 'dine-in', 'takeaway'],
      deliveryTime: '40-50 min',
      deliveryFee: 6000,
      minimumOrder: 15000,
      specialties: ['Victoria Perch', 'Lake Fish', 'Waterfront Dining'],
      promoted: true
    },
    {
      id: 'pizza-planet-mwanza',
      name: 'Pizza Planet Mwanza',
      cuisine: ['pizza', 'fast-food'],
      rating: 4.2,
      reviews: 334,
      priceRange: '$',
      region: 'Mwanza',
      area: 'City Center',
      address: 'Station Road',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
      isOpen: true,
      openingHours: '10:00',
      closingHours: '22:00',
      phone: '+255 28 254 1234',
      services: ['delivery', 'dine-in', 'takeaway'],
      deliveryTime: '30-40 min',
      deliveryFee: 4000,
      minimumOrder: 10000,
      specialties: ['Pizza', 'Burgers', 'Pasta'],
      freeDelivery: true
    },
    {
      id: 'lake-view-mwanza',
      name: 'Lake View Restaurant',
      cuisine: ['swahili', 'seafood'],
      rating: 4.3,
      reviews: 267,
      priceRange: '$$',
      region: 'Mwanza',
      area: 'Isamilo',
      address: 'Isamilo Road',
      image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
      isOpen: true,
      openingHours: '11:00',
      closingHours: '21:00',
      phone: '+255 784 567 890',
      services: ['dine-in', 'takeaway'],
      specialties: ['Fresh Fish', 'Ugali', 'Lake Views']
    },

    // ZANZIBAR RESTAURANTS
    {
      id: 'emerson-spice',
      name: 'Emerson Spice Tea House',
      cuisine: ['swahili', 'seafood'],
      rating: 4.8,
      reviews: 678,
      priceRange: '$$$',
      region: 'Zanzibar',
      area: 'Stone Town',
      address: 'Hurumzi Street, Stone Town',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
      isOpen: true,
      openingHours: '18:00',
      closingHours: '22:30',
      phone: '+255 24 223 2471',
      services: ['dine-in'],
      specialties: ['Rooftop Dining', 'Sunset Views', 'Swahili Cuisine'],
      promoted: true
    },
    {
      id: 'forodhani-gardens',
      name: 'Forodhani Night Market',
      cuisine: ['swahili', 'seafood'],
      rating: 4.6,
      reviews: 1234,
      priceRange: '$',
      region: 'Zanzibar',
      area: 'Stone Town',
      address: 'Forodhani Gardens',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
      isOpen: true,
      openingHours: '18:00',
      closingHours: '23:00',
      phone: '+255 777 123 456',
      services: ['dine-in', 'takeaway'],
      specialties: ['Zanzibar Pizza', 'Seafood Skewers', 'Sugarcane Juice'],
      discount: 20
    },
    {
      id: 'rock-restaurant',
      name: 'The Rock Restaurant',
      cuisine: ['seafood', 'continental'],
      rating: 4.9,
      reviews: 892,
      priceRange: '$$$$',
      region: 'Zanzibar',
      area: 'Pingwe',
      address: 'Michanvi Pingwe Beach',
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
      isOpen: true,
      openingHours: '12:00',
      closingHours: '21:00',
      phone: '+255 777 423 162',
      services: ['dine-in'],
      specialties: ['Ocean Rock Setting', 'Fresh Seafood', 'Unique Experience'],
      promoted: true
    },
    {
      id: 'lukmaan-zanzibar',
      name: 'Lukmaan Restaurant',
      cuisine: ['swahili', 'indian'],
      rating: 4.4,
      reviews: 445,
      priceRange: '$',
      region: 'Zanzibar',
      area: 'Stone Town',
      address: 'Gizenga Street',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
      isOpen: true,
      openingHours: '11:00',
      closingHours: '21:00',
      phone: '+255 24 223 6666',
      services: ['delivery', 'dine-in', 'takeaway'],
      deliveryTime: '30-40 min',
      deliveryFee: 5000,
      minimumOrder: 12000,
      specialties: ['Biryani', 'Pilau', 'Mixed Grill']
    },

    // DODOMA RESTAURANTS
    {
      id: 'great-wall-dodoma',
      name: 'Great Wall Chinese Restaurant',
      cuisine: ['chinese'],
      rating: 4.2,
      reviews: 234,
      priceRange: '$$',
      region: 'Dodoma',
      area: 'City Center',
      address: 'Makutupora Road',
      image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800',
      isOpen: true,
      openingHours: '11:00',
      closingHours: '22:00',
      phone: '+255 26 232 4567',
      services: ['delivery', 'dine-in', 'takeaway'],
      deliveryTime: '35-45 min',
      deliveryFee: 5000,
      minimumOrder: 15000,
      specialties: ['Chinese Cuisine', 'Fried Rice', 'Noodles']
    },
    {
      id: 'msafiri-dodoma',
      name: 'Msafiri Hotel Restaurant',
      cuisine: ['swahili', 'continental'],
      rating: 4.0,
      reviews: 189,
      priceRange: '$$',
      region: 'Dodoma',
      area: 'City Center',
      address: 'Lindi Road',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      isOpen: true,
      openingHours: '06:00',
      closingHours: '22:00',
      phone: '+255 26 232 1234',
      services: ['dine-in', 'takeaway'],
      specialties: ['Hotel Dining', 'Buffet', 'Business Meals']
    },

    // MBEYA RESTAURANTS
    {
      id: 'utengule-coffee',
      name: 'Utengule Coffee Lodge',
      cuisine: ['cafe', 'continental'],
      rating: 4.6,
      reviews: 312,
      priceRange: '$$',
      region: 'Mbeya',
      area: 'Utengule',
      address: 'Utengule Coffee Estate',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
      isOpen: true,
      openingHours: '07:00',
      closingHours: '21:00',
      phone: '+255 25 250 2609',
      services: ['dine-in', 'takeaway'],
      specialties: ['Fresh Coffee', 'Estate Meals', 'Mountain Views']
    },
    {
      id: 'karibuni-mbeya',
      name: 'Karibuni Center Restaurant',
      cuisine: ['swahili', 'fast-food'],
      rating: 4.1,
      reviews: 223,
      priceRange: '$',
      region: 'Mbeya',
      area: 'City Center',
      address: 'Karume Avenue',
      image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800',
      isOpen: true,
      openingHours: '08:00',
      closingHours: '21:00',
      phone: '+255 765 432 109',
      services: ['delivery', 'dine-in', 'takeaway'],
      deliveryTime: '30-40 min',
      deliveryFee: 4000,
      minimumOrder: 10000,
      specialties: ['Local Food', 'Quick Service', 'Affordable']
    },

    // MOSHI RESTAURANTS
    {
      id: 'indoitaliano',
      name: 'Indo-Italiano Restaurant',
      cuisine: ['indian', 'italian'],
      rating: 4.5,
      reviews: 389,
      priceRange: '$$',
      region: 'Moshi',
      area: 'Rindi Lane',
      address: 'Rindi Lane',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
      isOpen: true,
      openingHours: '11:00',
      closingHours: '22:00',
      phone: '+255 27 275 2853',
      services: ['delivery', 'dine-in', 'takeaway'],
      deliveryTime: '30-40 min',
      deliveryFee: 5000,
      minimumOrder: 12000,
      specialties: ['Fusion Cuisine', 'Pizza', 'Curries'],
      promoted: true
    },
    {
      id: 'union-cafe-moshi',
      name: 'Union Café',
      cuisine: ['cafe', 'continental'],
      rating: 4.4,
      reviews: 267,
      priceRange: '$',
      region: 'Moshi',
      area: 'Boma',
      address: 'Boma Road',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
      isOpen: true,
      openingHours: '07:00',
      closingHours: '20:00',
      phone: '+255 27 275 4862',
      services: ['dine-in', 'takeaway'],
      specialties: ['Coffee', 'Breakfast', 'Pastries']
    },

    // TANGA RESTAURANTS
    {
      id: 'ocean-breeze-tanga',
      name: 'Ocean Breeze Hotel',
      cuisine: ['seafood', 'swahili'],
      rating: 4.3,
      reviews: 278,
      priceRange: '$$',
      region: 'Tanga',
      area: 'Ras Kazone',
      address: 'Ras Kazone Peninsula',
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
      isOpen: true,
      openingHours: '10:00',
      closingHours: '22:00',
      phone: '+255 27 264 4445',
      services: ['dine-in', 'takeaway'],
      specialties: ['Ocean View', 'Fresh Fish', 'Beach Dining']
    },
    {
      id: 'mkupuka-tanga',
      name: 'Mkupuka Restaurant',
      cuisine: ['swahili'],
      rating: 4.1,
      reviews: 156,
      priceRange: '$',
      region: 'Tanga',
      area: 'City Center',
      address: 'Market Street',
      image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800',
      isOpen: true,
      openingHours: '07:00',
      closingHours: '20:00',
      phone: '+255 27 264 2233',
      services: ['delivery', 'dine-in', 'takeaway'],
      deliveryTime: '30-40 min',
      deliveryFee: 3000,
      minimumOrder: 8000,
      specialties: ['Local Dishes', 'Affordable', 'Quick Service']
    },

    // MOROGORO RESTAURANTS
    {
      id: 'oasis-morogoro',
      name: 'Oasis Hotel & Restaurant',
      cuisine: ['continental', 'swahili'],
      rating: 4.2,
      reviews: 201,
      priceRange: '$$',
      region: 'Morogoro',
      area: 'Old Dar Road',
      address: 'Old Dar es Salaam Road',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      isOpen: true,
      openingHours: '06:00',
      closingHours: '22:00',
      phone: '+255 23 260 4308',
      services: ['dine-in', 'takeaway'],
      specialties: ['Hotel Dining', 'Business Lunch', 'Local Cuisine']
    },
    {
      id: 'mama-pierina',
      name: "Mama Pierina's Kitchen",
      cuisine: ['swahili'],
      rating: 4.4,
      reviews: 178,
      priceRange: '$',
      region: 'Morogoro',
      area: 'Mazimbu',
      address: 'Mazimbu Area',
      image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800',
      isOpen: true,
      openingHours: '07:00',
      closingHours: '20:00',
      phone: '+255 767 890 123',
      services: ['delivery', 'dine-in', 'takeaway'],
      deliveryTime: '25-35 min',
      deliveryFee: 3000,
      minimumOrder: 8000,
      specialties: ['Home Cooking', 'Pilau', 'Traditional Meals']
    },

    // IRINGA RESTAURANTS
    {
      id: 'hasty-tasty-iringa',
      name: 'Hasty Tasty Too!',
      cuisine: ['cafe', 'fast-food'],
      rating: 4.3,
      reviews: 167,
      priceRange: '$',
      region: 'Iringa',
      area: 'Uhuru Avenue',
      address: 'Uhuru Avenue',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
      isOpen: true,
      openingHours: '07:00',
      closingHours: '21:00',
      phone: '+255 26 270 2898',
      services: ['dine-in', 'takeaway'],
      specialties: ['Coffee', 'Breakfast', 'Quick Bites']
    },
    {
      id: 'neema-crafts-cafe',
      name: 'Neema Crafts Café',
      cuisine: ['cafe', 'continental'],
      rating: 4.5,
      reviews: 234,
      priceRange: '$',
      region: 'Iringa',
      area: 'Gangilonga',
      address: 'Gangilonga Road',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
      isOpen: true,
      openingHours: '08:00',
      closingHours: '17:00',
      phone: '+255 769 034 735',
      services: ['dine-in', 'takeaway'],
      specialties: ['Fresh Coffee', 'Pastries', 'Social Enterprise']
    },

    // BUKOBA RESTAURANTS
    {
      id: 'coffee-tree-bukoba',
      name: 'Coffee Tree Hotel',
      cuisine: ['continental', 'swahili'],
      rating: 4.1,
      reviews: 145,
      priceRange: '$$',
      region: 'Bukoba',
      area: 'Jamhuri',
      address: 'Jamhuri Street',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      isOpen: true,
      openingHours: '06:00',
      closingHours: '22:00',
      phone: '+255 28 222 0038',
      services: ['dine-in', 'takeaway'],
      specialties: ['Lake View', 'Hotel Dining', 'Coffee']
    }
  ];

  const cuisineCategories = [
    { id: 'all', name: 'All', icon: UtensilsCrossed },
    { id: 'swahili', name: 'Swahili', icon: UtensilsCrossed },
    { id: 'nyama-choma', name: 'Nyama Choma', icon: UtensilsCrossed },
    { id: 'seafood', name: 'Seafood', icon: UtensilsCrossed },
    { id: 'indian', name: 'Indian', icon: UtensilsCrossed },
    { id: 'pizza', name: 'Pizza', icon: UtensilsCrossed },
    { id: 'chinese', name: 'Chinese', icon: UtensilsCrossed },
    { id: 'fast-food', name: 'Fast Food', icon: UtensilsCrossed },
    { id: 'bbq', name: 'BBQ', icon: UtensilsCrossed },
    { id: 'cafe', name: 'Café', icon: Coffee }
  ];

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesRegion = restaurant.region === selectedRegion;
    const matchesCuisine = selectedCuisine === 'all' || restaurant.cuisine.includes(selectedCuisine as CuisineType);
    const matchesService = selectedService === 'all' || restaurant.services.includes(selectedService);
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.cuisine.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesRegion && matchesCuisine && matchesService && matchesSearch;
  });

  const toggleFavorite = (restaurantId: string) => {
    if (favorites.includes(restaurantId)) {
      setFavorites(favorites.filter(id => id !== restaurantId));
    } else {
      setFavorites([...favorites, restaurantId]);
    }
  };

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, change: number) => {
    setCart(cart.map(item => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Sample menu items for demo
  const sampleMenuItems: MenuItem[] = [
    {
      id: 'item1',
      name: 'Grilled Tilapia',
      description: 'Fresh Lake Victoria tilapia, grilled with spices',
      price: 18000,
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400',
      category: 'Main Course',
      available: true,
      popular: true
    },
    {
      id: 'item2',
      name: 'Pilau ya Kuku',
      description: 'Traditional spiced rice with chicken',
      price: 12000,
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400',
      category: 'Main Course',
      available: true,
      popular: true
    },
    {
      id: 'item3',
      name: 'Nyama Choma Platter',
      description: 'Mixed grilled meats with ugali and kachumbari',
      price: 25000,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
      category: 'Main Course',
      available: true,
      popular: true
    },
    {
      id: 'item4',
      name: 'Coconut Rice with Curry',
      description: 'Aromatic coconut rice with vegetable curry',
      price: 10000,
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
      category: 'Main Course',
      available: true,
      vegetarian: true
    }
  ];

  const handlePlaceOrder = async () => {
    if (checkoutPin.length !== 4) return;
    if (!selectedRestaurant) return;
    setPlacing(true);
    const subtotal = getCartTotal();
    const deliveryFee = orderType === 'delivery' ? (selectedRestaurant.deliveryFee || 0) : 0;
    const platformFee = Math.round(subtotal * 0.05);
    const total = subtotal + deliveryFee + platformFee;
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/restaurants/order`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({
            restaurantId: selectedRestaurant.id,
            restaurantName: selectedRestaurant.name,
            items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
            orderType,
            deliveryAddress,
            subtotal,
            deliveryFee,
            platformFee,
            discount: 0,
            total,
            pin: checkoutPin,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        const { toast: toastFn } = await import('sonner');
        toastFn.error(data.error || 'Agizo limeshindwa. Jaribu tena.');
        setPlacing(false);
        return;
      }
      setOrderRef(data.orderId || data.orderReference || `GP-${Date.now()}`);
      setEstimatedDelivery(data.estimatedDelivery || new Date(Date.now() + 45 * 60000).toISOString());
      setCart([]);
      setCheckoutPin('');
      setActiveView('tracking');
    } catch {
      const { toast: toastFn } = await import('sonner');
      toastFn.error('Hitilafu ya mtandao. Jaribu tena.');
    } finally {
      setPlacing(false);
    }
  };

  if (activeView === 'checkout') {
    const subtotal = getCartTotal();
    const deliveryFee = orderType === 'delivery' ? (selectedRestaurant?.deliveryFee || 0) : 0;
    const platformFee = Math.round(subtotal * 0.05);
    const total = subtotal + deliveryFee + platformFee;
    return (
      <div className="min-h-screen bg-gray-50 pb-32">
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setActiveView('cart')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-bold text-xl">Thibitisha Agizo</h1>
              <p className="text-sm text-gray-600">{selectedRestaurant?.name}</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
          {/* Order summary */}
          <div className="bg-white rounded-xl p-4">
            <h2 className="font-bold mb-3">Muhtasari wa Agizo</h2>
            {cart.map(item => (
              <div key={item.id} className="flex justify-between py-2 border-b last:border-0 text-sm">
                <span>{item.quantity}× {item.name}</span>
                <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between text-gray-600"><span>Jumla ndogo</span><span>{formatCurrency(subtotal)}</span></div>
              {orderType === 'delivery' && <div className="flex justify-between text-gray-600"><span>Ada ya utoaji</span><span>{formatCurrency(deliveryFee)}</span></div>}
              <div className="flex justify-between text-gray-600"><span>Ada ya huduma (5%)</span><span>{formatCurrency(platformFee)}</span></div>
              <div className="flex justify-between font-bold text-base pt-2 border-t"><span>Jumla</span><span className="text-[#1a5f3f]">{formatCurrency(total)}</span></div>
            </div>
          </div>

          {/* Delivery address */}
          {orderType === 'delivery' && (
            <div className="bg-white rounded-xl p-4">
              <h2 className="font-bold mb-2">Anwani ya Utoaji</h2>
              <input
                type="text"
                value={deliveryAddress}
                onChange={e => setDeliveryAddress(e.target.value)}
                placeholder="Weka anwani yako ya utoaji..."
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
          )}

          {/* PIN */}
          <div className="bg-white rounded-xl p-4">
            <h2 className="font-bold mb-1">Ingiza PIN yako</h2>
            <p className="text-xs text-gray-500 mb-3">Thibitisha malipo ya {formatCurrency(total)}</p>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={checkoutPin}
              onChange={e => setCheckoutPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="••••"
              className="w-32 border-2 rounded-xl px-4 py-3 text-center text-xl tracking-widest font-bold"
              style={{ borderColor: checkoutPin.length === 4 ? '#1a5f3f' : '#e5e7eb' }}
            />
          </div>

          <Button
            onClick={handlePlaceOrder}
            disabled={checkoutPin.length !== 4 || placing || (orderType === 'delivery' && !deliveryAddress.trim())}
            className="w-full bg-[#1a5f3f] hover:bg-[#164d33] h-14 text-base font-bold"
          >
            {placing ? 'Inaweka Agizo...' : `Lipa ${formatCurrency(total)}`}
          </Button>
        </div>
      </div>
    );
  }

  if (activeView === 'tracking') {
    const eta = estimatedDelivery ? new Date(estimatedDelivery).toLocaleTimeString('en-TZ', { hour: '2-digit', minute: '2-digit' }) : '—';
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-[#1a5f3f] text-white px-4 pt-12 pb-8 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Agizo Limepokewa!</h1>
          <p className="text-green-100 text-sm">Ref: {orderRef}</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-white rounded-2xl p-5 text-center shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Muda wa Uasilishaji</p>
            <p className="text-4xl font-bold text-[#1a5f3f]">{eta}</p>
            <p className="text-sm text-gray-500 mt-1">~ dakika 30–45</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold mb-3">Hali ya Agizo</h3>
            {[
              { label: 'Agizo limepokelewa', done: true },
              { label: 'Mkahawa unaandaa', done: true },
              { label: 'Dereva amepewa', done: false },
              { label: 'Njiani kwako', done: false },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? 'bg-[#1a5f3f]' : 'bg-gray-200'}`}>
                  {step.done && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className={`text-sm ${step.done ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>{step.label}</span>
              </div>
            ))}
          </div>

          <Button onClick={() => { setActiveView('home'); setSelectedRestaurant(null); }} className="w-full bg-[#1a5f3f] hover:bg-[#164d33]">
            Rudi Nyumbani
          </Button>
        </div>
      </div>
    );
  }

  if (activeView === 'home') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={onBack}>
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="font-bold text-xl">GoFood</h1>
                  <p className="text-sm text-gray-500">Food Delivery & Dining</p>
                </div>
              </div>
              
              {cart.length > 0 && (
                <Button 
                  onClick={() => setActiveView('cart')}
                  className="bg-[#1a5f3f] hover:bg-[#164d33] relative"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Cart ({getCartItemCount()})
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {getCartItemCount()}
                  </span>
                </Button>
              )}
            </div>

            {/* Location Selector */}
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-[#1a5f3f]" />
              <select 
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="flex-1 p-2 border rounded-lg bg-white text-gray-900 font-semibold"
              >
                {tanzaniaRegions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search restaurants, cuisines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Service Type Tabs */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              <Button
                variant={selectedService === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedService('all')}
                className={selectedService === 'all' ? 'bg-[#1a5f3f] hover:bg-[#164d33]' : ''}
              >
                All Services
              </Button>
              <Button
                variant={selectedService === 'delivery' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedService('delivery')}
                className={selectedService === 'delivery' ? 'bg-[#1a5f3f] hover:bg-[#164d33]' : ''}
              >
                <Bike className="w-4 h-4 mr-1" />
                Delivery
              </Button>
              <Button
                variant={selectedService === 'dine-in' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedService('dine-in')}
                className={selectedService === 'dine-in' ? 'bg-[#1a5f3f] hover:bg-[#164d33]' : ''}
              >
                <UtensilsCrossed className="w-4 h-4 mr-1" />
                Dine-in
              </Button>
              <Button
                variant={selectedService === 'takeaway' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedService('takeaway')}
                className={selectedService === 'takeaway' ? 'bg-[#1a5f3f] hover:bg-[#164d33]' : ''}
              >
                <Package className="w-4 h-4 mr-1" />
                Takeaway
              </Button>
            </div>
          </div>
        </div>

        {/* Cuisine Categories */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {cuisineCategories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCuisine === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCuisine(category.id)}
                  className={selectedCuisine === category.id ? 'bg-[#1a5f3f] hover:bg-[#164d33] whitespace-nowrap' : 'whitespace-nowrap'}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Promoted Restaurants Banner */}
        {filteredRestaurants.some(r => r.promoted) && (
          <div className="bg-gradient-to-r from-[#1a5f3f] to-[#2a7f5f] text-white py-3 px-4">
            <div className="max-w-7xl mx-auto flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <span className="font-semibold">Special Offers Available!</span>
            </div>
          </div>
        )}

        {/* Restaurants Grid */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-base text-gray-900 font-semibold">
              {filteredRestaurants.length} restaurants in {selectedRegion}
            </p>
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {filteredRestaurants.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-900 font-semibold text-lg">No restaurants found in this area</p>
              <p className="text-base text-gray-700 mt-2">Try selecting a different region or service type</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRestaurants.map(restaurant => (
                <div
                  key={restaurant.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedRestaurant(restaurant);
                    setActiveView('restaurant');
                  }}
                >
                  {/* Restaurant Image */}
                  <div className="relative h-48">
                    <ImageWithFallback
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Status Badge */}
                    <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${
                      restaurant.isOpen ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {restaurant.isOpen ? 'Open' : 'Closed'}
                    </div>

                    {/* Discount Badge */}
                    {restaurant.discount && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Percent className="w-3 h-3" />
                        {restaurant.discount}% OFF
                      </div>
                    )}

                    {/* New Restaurant Badge */}
                    {restaurant.newRestaurant && (
                      <div className="absolute top-14 left-3 bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-bold">
                        NEW
                      </div>
                    )}

                    {/* Free Delivery Badge */}
                    {restaurant.freeDelivery && (
                      <div className="absolute bottom-3 left-3 bg-[#1a5f3f] text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        Free Delivery
                      </div>
                    )}

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(restaurant.id);
                      }}
                      className="absolute bottom-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          favorites.includes(restaurant.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Restaurant Info */}
                  <div className="p-4">
                    <h3 className="font-bold mb-1 text-gray-900 text-lg">{restaurant.name}</h3>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-800 mb-2 font-medium">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-gray-900">{restaurant.rating}</span>
                        <span className="text-gray-700">({restaurant.reviews})</span>
                      </div>
                      <span>•</span>
                      <span className="font-semibold text-gray-900">{restaurant.priceRange}</span>
                      <span>•</span>
                      <span className="text-sm font-medium text-gray-800">{restaurant.cuisine.join(', ')}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-700 mb-3 font-medium">
                      <MapPin className="w-4 h-4" />
                      <span>{restaurant.area}</span>
                      {restaurant.distance && (
                        <>
                          <span>•</span>
                          <span>{restaurant.distance}</span>
                        </>
                      )}
                    </div>

                    {/* Services */}
                    <div className="flex items-center gap-2 mb-3">
                      {restaurant.services.includes('delivery') && (
                        <div className="flex items-center gap-1 text-sm bg-green-100 text-green-800 px-3 py-1.5 rounded font-semibold">
                          <Bike className="w-4 h-4" />
                          <span>Delivery</span>
                        </div>
                      )}
                      {restaurant.services.includes('dine-in') && (
                        <div className="flex items-center gap-1 text-sm bg-blue-100 text-blue-800 px-3 py-1.5 rounded font-semibold">
                          <UtensilsCrossed className="w-4 h-4" />
                          <span>Dine-in</span>
                        </div>
                      )}
                      {restaurant.services.includes('takeaway') && (
                        <div className="flex items-center gap-1 text-sm bg-purple-100 text-purple-800 px-3 py-1.5 rounded font-semibold">
                          <Package className="w-4 h-4" />
                          <span>Takeaway</span>
                        </div>
                      )}
                    </div>

                    {/* Delivery Info */}
                    {restaurant.services.includes('delivery') && restaurant.deliveryTime && (
                      <div className="flex items-center justify-between text-sm text-gray-800 pt-3 border-t font-medium">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{restaurant.deliveryTime}</span>
                        </div>
                        {restaurant.deliveryFee && !restaurant.freeDelivery && (
                          <span>Delivery {formatCurrency(restaurant.deliveryFee)}</span>
                        )}
                      </div>
                    )}

                    {/* Opening Hours */}
                    <div className="flex items-center gap-1 text-sm text-gray-800 mt-2 font-medium">
                      <Clock className="w-4 h-4" />
                      <span>Hours: {restaurant.openingHours} - {restaurant.closingHours}</span>
                    </div>

                    {/* Promoted */}
                    {restaurant.promoted && (
                      <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-2 flex items-center gap-2">
                        <Crown className="w-4 h-4 text-yellow-600" />
                        <span className="text-xs text-yellow-800 font-semibold">Featured Restaurant</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeView === 'restaurant' && selectedRestaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header with Image */}
        <div className="relative h-64">
          <ImageWithFallback
            src={selectedRestaurant.image}
            alt={selectedRestaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveView('home')}
            className="absolute top-4 left-4 bg-white/90 hover:bg-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <button
            onClick={() => toggleFavorite(selectedRestaurant.id)}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2"
          >
            <Heart
              className={`w-5 h-5 ${
                favorites.includes(selectedRestaurant.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </button>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h1 className="font-bold text-2xl mb-2">{selectedRestaurant.name}</h1>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{selectedRestaurant.rating}</span>
                <span>({selectedRestaurant.reviews})</span>
              </div>
              <span>•</span>
              <span>{selectedRestaurant.priceRange}</span>
              <span>•</span>
              <span>{selectedRestaurant.cuisine.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Restaurant Details */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Status Bar */}
          <div className={`p-4 rounded-lg mb-6 ${
            selectedRestaurant.isOpen ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-semibold ${selectedRestaurant.isOpen ? 'text-green-800' : 'text-red-800'}`}>
                  {selectedRestaurant.isOpen ? 'Open Now' : 'Closed'}
                </p>
                <p className="text-sm text-gray-600">
                  Hours: {selectedRestaurant.openingHours} - {selectedRestaurant.closingHours}
                </p>
              </div>
              {selectedRestaurant.discount && (
                <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  {selectedRestaurant.discount}% OFF
                </div>
              )}
            </div>
          </div>

          {/* Service Options */}
          <div className="mb-6">
            <h2 className="font-bold mb-3">Available Services</h2>
            <div className="grid grid-cols-3 gap-3">
              {selectedRestaurant.services.includes('delivery') && (
                <div className="bg-white p-4 rounded-lg border text-center">
                  <Bike className="w-6 h-6 text-[#1a5f3f] mx-auto mb-2" />
                  <p className="font-semibold text-sm">Delivery</p>
                  {selectedRestaurant.deliveryTime && (
                    <p className="text-xs text-gray-600">{selectedRestaurant.deliveryTime}</p>
                  )}
                  {selectedRestaurant.freeDelivery ? (
                    <p className="text-xs text-green-600 font-semibold">FREE</p>
                  ) : selectedRestaurant.deliveryFee && (
                    <p className="text-xs text-gray-600">{formatCurrency(selectedRestaurant.deliveryFee)}</p>
                  )}
                </div>
              )}
              {selectedRestaurant.services.includes('dine-in') && (
                <div className="bg-white p-4 rounded-lg border text-center">
                  <UtensilsCrossed className="w-6 h-6 text-[#1a5f3f] mx-auto mb-2" />
                  <p className="font-semibold text-sm">Dine-in</p>
                  <p className="text-xs text-gray-600">At restaurant</p>
                </div>
              )}
              {selectedRestaurant.services.includes('takeaway') && (
                <div className="bg-white p-4 rounded-lg border text-center">
                  <Package className="w-6 h-6 text-[#1a5f3f] mx-auto mb-2" />
                  <p className="font-semibold text-sm">Takeaway</p>
                  <p className="text-xs text-gray-600">Self pickup</p>
                </div>
              )}
            </div>
          </div>

          {/* Location & Contact */}
          <div className="bg-white p-4 rounded-lg mb-6 border">
            <h2 className="font-bold mb-3">Location & Contact</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-600 mt-0.5" />
                <div>
                  <p>{selectedRestaurant.address}</p>
                  <p className="text-gray-600">{selectedRestaurant.area}, {selectedRestaurant.region}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-600" />
                <a href={`tel:${selectedRestaurant.phone}`} className="text-[#1a5f3f] hover:underline">
                  {selectedRestaurant.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Specialties */}
          <div className="bg-white p-4 rounded-lg mb-6 border">
            <h2 className="font-bold mb-3">Specialties</h2>
            <div className="flex flex-wrap gap-2">
              {selectedRestaurant.specialties.map((specialty, index) => (
                <div key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {specialty}
                </div>
              ))}
            </div>
          </div>

          {/* Sample Menu */}
          <div className="mb-6">
            <h2 className="font-bold mb-4">Popular Items</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {sampleMenuItems.map(item => (
                <div key={item.id} className="bg-white rounded-lg border overflow-hidden flex">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover"
                  />
                  <div className="p-3 flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-sm">{item.name}</h3>
                      {item.popular && (
                        <Award className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1a5f3f]">{formatCurrency(item.price)}</span>
                      <Button
                        size="sm"
                        onClick={() => addToCart(item)}
                        className="bg-[#1a5f3f] hover:bg-[#164d33] h-8"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Button */}
          {selectedRestaurant.isOpen && (
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
              <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                <div>
                  {cart.length > 0 && (
                    <p className="text-sm text-gray-600">
                      {getCartItemCount()} items • {formatCurrency(getCartTotal())}
                    </p>
                  )}
                </div>
                <Button
                  onClick={() => setActiveView('cart')}
                  className="bg-[#1a5f3f] hover:bg-[#164d33] flex-1 max-w-md"
                  disabled={cart.length === 0}
                >
                  {cart.length > 0 ? 'View Cart' : 'Add Items to Cart'}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeView === 'cart') {
    const subtotal = getCartTotal();
    const deliveryFee = selectedRestaurant?.deliveryFee || 0;
    const serviceFee = Math.round(subtotal * 0.05);
    const total = subtotal + deliveryFee + serviceFee;

    return (
      <div className="min-h-screen bg-gray-50 pb-32">
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => setActiveView('restaurant')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-bold text-xl">Your Cart</h1>
                <p className="text-sm text-gray-600">{selectedRestaurant?.name}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Your cart is empty</p>
              <Button
                onClick={() => setActiveView('restaurant')}
                className="bg-[#1a5f3f] hover:bg-[#164d33]"
              >
                Browse Menu
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="bg-white rounded-lg p-4 mb-6">
                <h2 className="font-bold mb-4">Items</h2>
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-4 pb-4 border-b last:border-0">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{formatCurrency(item.price)}</p>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="font-semibold">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#1a5f3f] mb-2">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="h-8 w-8"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Type */}
              <div className="bg-white rounded-lg p-4 mb-6">
                <h2 className="font-bold mb-4">Order Type</h2>
                <div className="grid grid-cols-3 gap-3">
                  {selectedRestaurant?.services.includes('delivery') && (
                    <button
                      onClick={() => setOrderType('delivery')}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        orderType === 'delivery'
                          ? 'border-[#1a5f3f] bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Bike className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm font-semibold">Delivery</p>
                    </button>
                  )}
                  {selectedRestaurant?.services.includes('takeaway') && (
                    <button
                      onClick={() => setOrderType('takeaway')}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        orderType === 'takeaway'
                          ? 'border-[#1a5f3f] bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Package className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm font-semibold">Takeaway</p>
                    </button>
                  )}
                  {selectedRestaurant?.services.includes('dine-in') && (
                    <button
                      onClick={() => setOrderType('dine-in')}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        orderType === 'dine-in'
                          ? 'border-[#1a5f3f] bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <UtensilsCrossed className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm font-semibold">Dine-in</p>
                    </button>
                  )}
                </div>
              </div>

              {/* Bill Summary */}
              <div className="bg-white rounded-lg p-4 mb-6">
                <h2 className="font-bold mb-4">Bill Summary</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {orderType === 'delivery' && (
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>{selectedRestaurant?.freeDelivery ? 'FREE' : formatCurrency(deliveryFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Service Fee</span>
                    <span>{formatCurrency(serviceFee)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-[#1a5f3f]">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom Bar */}
        {cart.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
            <div className="max-w-7xl mx-auto">
              <Button
                onClick={() => setActiveView('checkout')}
                className="w-full bg-[#1a5f3f] hover:bg-[#164d33]"
              >
                Proceed to Checkout • {formatCurrency(total)}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
