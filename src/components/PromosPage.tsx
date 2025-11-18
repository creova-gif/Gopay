import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { User } from '../App';
import {
  ArrowLeft, Search, Tag, Percent, Gift, Crown, Zap,
  Clock, Star, TrendingUp, Sparkles, ChevronRight,
  Copy, Check, Calendar, AlertCircle, X, Info,
  ShoppingBag, Plane, Utensils, Smartphone, Zap as Lightning,
  MapPin, Heart, Share2, Filter
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PromosPageProps {
  user: User;
  accessToken: string;
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

type PromoCategory = 'all' | 'food' | 'travel' | 'bills' | 'shopping' | 'wallet' | 'new-user';

interface Promo {
  id: string;
  title: string;
  description: string;
  discount: string;
  code: string;
  category: PromoCategory;
  image: string;
  validUntil: string;
  terms: string[];
  minSpend?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount?: number;
  featured?: boolean;
  newUser?: boolean;
  limitedTime?: boolean;
  partnered?: boolean;
  partnerName?: string;
}

export function PromosPage({ user, accessToken, onBack, onNavigate }: PromosPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<PromoCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<Promo | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = [
    { id: 'all', name: 'All Promos', icon: Tag },
    { id: 'food', name: 'Food & Dining', icon: Utensils },
    { id: 'travel', name: 'Travel', icon: Plane },
    { id: 'shopping', name: 'Shopping', icon: ShoppingBag },
    { id: 'bills', name: 'Bill Payments', icon: Lightning },
    { id: 'wallet', name: 'Wallet', icon: Smartphone },
    { id: 'new-user', name: 'New User', icon: Sparkles },
  ];

  const promos: Promo[] = [
    // FEATURED & NEW USER PROMOS
    {
      id: 'welcome-bonus',
      title: 'Welcome Bonus - TZS 50,000',
      description: 'Get TZS 50,000 bonus when you complete your first transaction',
      discount: 'TZS 50,000',
      code: 'WELCOME50K',
      category: 'new-user',
      image: 'https://images.unsplash.com/photo-1607863680198-23d4b2565df0?w=800',
      validUntil: '2024-12-31',
      terms: [
        'Valid for new users only',
        'Complete registration and first transaction',
        'Bonus credited within 24 hours',
        'Minimum transaction: TZS 10,000'
      ],
      minSpend: 10000,
      featured: true,
      newUser: true
    },
    {
      id: 'first-order-free',
      title: 'First Food Order FREE',
      description: 'Get your first food delivery order absolutely FREE',
      discount: '100% OFF',
      code: 'FIRSTFOOD',
      category: 'food',
      image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800',
      validUntil: '2024-12-31',
      terms: [
        'Valid for first food order only',
        'Maximum discount: TZS 30,000',
        'Delivery fee may apply'
      ],
      maxDiscount: 30000,
      featured: true,
      newUser: true
    },

    // FOOD & DINING PROMOS
    {
      id: 'gofood-50',
      title: 'GoFood 50% OFF',
      description: 'Enjoy 50% discount on all food orders',
      discount: '50% OFF',
      code: 'GOFOOD50',
      category: 'food',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
      validUntil: '2024-03-31',
      terms: [
        'Valid on all restaurants',
        'Minimum order: TZS 20,000',
        'Maximum discount: TZS 25,000',
        'Valid 3 times per user'
      ],
      minSpend: 20000,
      maxDiscount: 25000,
      usageLimit: 3,
      featured: true,
      limitedTime: true
    },
    {
      id: 'weekend-feast',
      title: 'Weekend Feast Deal',
      description: 'Get 40% OFF on weekend orders from selected restaurants',
      discount: '40% OFF',
      code: 'WEEKEND40',
      category: 'food',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
      validUntil: '2024-02-29',
      terms: [
        'Valid Friday-Sunday only',
        'Selected restaurants',
        'Minimum order: TZS 30,000',
        'Maximum discount: TZS 20,000'
      ],
      minSpend: 30000,
      maxDiscount: 20000
    },
    {
      id: 'nyama-choma-deal',
      title: 'Nyama Choma Special',
      description: '30% OFF on all Nyama Choma orders',
      discount: '30% OFF',
      code: 'NCHOMA30',
      category: 'food',
      image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800',
      validUntil: '2024-03-15',
      terms: [
        'Valid on BBQ & Nyama Choma restaurants',
        'Minimum order: TZS 25,000',
        'Not valid with other offers'
      ],
      minSpend: 25000,
      partnered: true,
      partnerName: 'Selected BBQ Restaurants'
    },
    {
      id: 'lunch-special',
      title: 'Lunch Hour Special',
      description: 'Get TZS 10,000 OFF on lunch orders',
      discount: 'TZS 10,000 OFF',
      code: 'LUNCH10K',
      category: 'food',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
      validUntil: '2024-03-31',
      terms: [
        'Valid 11:00 AM - 2:00 PM',
        'Minimum order: TZS 15,000',
        'Monday to Friday only'
      ],
      minSpend: 15000
    },
    {
      id: 'free-delivery-food',
      title: 'Free Food Delivery',
      description: 'Zero delivery fees on all food orders',
      discount: 'FREE Delivery',
      code: 'FREEDELI',
      category: 'food',
      image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800',
      validUntil: '2024-02-28',
      terms: [
        'Minimum order: TZS 20,000',
        'All restaurants',
        'Limited time offer'
      ],
      minSpend: 20000,
      limitedTime: true
    },

    // TRAVEL PROMOS
    {
      id: 'safari-season',
      title: 'Safari Season Sale',
      description: 'Save 60% on all GoSafari tour packages',
      discount: '60% OFF',
      code: 'SAFARI60',
      category: 'travel',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
      validUntil: '2024-06-30',
      terms: [
        'Valid on selected safari packages',
        'Book minimum 3 days',
        'Maximum discount: TZS 500,000',
        'Subject to availability'
      ],
      minSpend: 100000,
      maxDiscount: 500000,
      featured: true
    },
    {
      id: 'flight-deals',
      title: 'Flight Booking Deals',
      description: 'Up to 35% OFF on domestic flights',
      discount: '35% OFF',
      code: 'FLY35',
      category: 'travel',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
      validUntil: '2024-04-30',
      terms: [
        'Domestic flights only',
        'Minimum 2 passengers',
        'Book 7 days in advance',
        'Selected routes'
      ],
      minSpend: 150000,
      maxDiscount: 300000
    },
    {
      id: 'hotel-escape',
      title: 'Hotel Weekend Escape',
      description: 'Get 45% discount on weekend hotel bookings',
      discount: '45% OFF',
      code: 'HOTEL45',
      category: 'travel',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      validUntil: '2024-05-31',
      terms: [
        'Weekend stays only',
        'Minimum 2 nights',
        '4-star hotels and above',
        'Major cities'
      ],
      minSpend: 80000,
      maxDiscount: 200000,
      limitedTime: true
    },
    {
      id: 'car-rental-promo',
      title: 'Car Rental Discount',
      description: '40% OFF on car rentals for trips',
      discount: '40% OFF',
      code: 'CARRENT40',
      category: 'travel',
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800',
      validUntil: '2024-04-15',
      terms: [
        'Minimum 3 days rental',
        'All vehicle types',
        'Insurance not included',
        'Valid Tanzania-wide'
      ],
      minSpend: 50000,
      maxDiscount: 150000
    },
    {
      id: 'zanzibar-package',
      title: 'Zanzibar Paradise Package',
      description: 'Exclusive 50% OFF on Zanzibar holiday packages',
      discount: '50% OFF',
      code: 'ZANZI50',
      category: 'travel',
      image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800',
      validUntil: '2024-07-31',
      terms: [
        'Package includes hotel + activities',
        'Minimum 4 nights stay',
        'Maximum discount: TZS 400,000',
        'Peak season excluded'
      ],
      minSpend: 200000,
      maxDiscount: 400000,
      featured: true
    },

    // SHOPPING PROMOS
    {
      id: 'mega-shopping',
      title: 'Mega Shopping Sale',
      description: 'Get 70% OFF on selected items',
      discount: '70% OFF',
      code: 'MEGA70',
      category: 'shopping',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
      validUntil: '2024-03-31',
      terms: [
        'Selected categories only',
        'While stocks last',
        'Maximum discount: TZS 100,000',
        'Not valid on electronics'
      ],
      minSpend: 50000,
      maxDiscount: 100000,
      featured: true,
      limitedTime: true
    },
    {
      id: 'fashion-friday',
      title: 'Fashion Friday Deal',
      description: '55% OFF on all fashion items',
      discount: '55% OFF',
      code: 'FASHION55',
      category: 'shopping',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
      validUntil: '2024-02-29',
      terms: [
        'Valid on Fridays only',
        'Clothing, shoes & accessories',
        'Minimum spend: TZS 30,000',
        'Online shopping only'
      ],
      minSpend: 30000,
      maxDiscount: 80000
    },
    {
      id: 'electronics-deal',
      title: 'Electronics Super Deal',
      description: 'Save 45% on phones, laptops & gadgets',
      discount: '45% OFF',
      code: 'TECH45',
      category: 'shopping',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800',
      validUntil: '2024-03-15',
      terms: [
        'Electronics category only',
        'Selected brands',
        'Minimum spend: TZS 100,000',
        'Maximum discount: TZS 200,000'
      ],
      minSpend: 100000,
      maxDiscount: 200000,
      partnered: true,
      partnerName: 'Tech Partners'
    },
    {
      id: 'grocery-savings',
      title: 'Grocery Savings',
      description: 'Get TZS 15,000 OFF on grocery shopping',
      discount: 'TZS 15,000 OFF',
      code: 'GROCERY15',
      category: 'shopping',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
      validUntil: '2024-03-31',
      terms: [
        'Grocery items only',
        'Minimum order: TZS 40,000',
        'Home delivery available',
        'Fresh produce included'
      ],
      minSpend: 40000
    },

    // BILL PAYMENTS PROMOS
    {
      id: 'bills-cashback',
      title: 'Bill Payment Cashback',
      description: 'Get 10% cashback on all bill payments',
      discount: '10% Cashback',
      code: 'BILLBACK10',
      category: 'bills',
      image: 'https://images.unsplash.com/photo-1554224311-beee415c201f?w=800',
      validUntil: '2024-03-31',
      terms: [
        'All utility bills',
        'Maximum cashback: TZS 10,000',
        'Credited within 48 hours',
        'Valid once per bill type'
      ],
      maxDiscount: 10000,
      featured: true
    },
    {
      id: 'electricity-bonus',
      title: 'TANESCO Payment Bonus',
      description: 'Get 15% extra units on electricity payments',
      discount: '15% Extra',
      code: 'LUKU15',
      category: 'bills',
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800',
      validUntil: '2024-02-29',
      terms: [
        'TANESCO LUKU only',
        'Minimum payment: TZS 20,000',
        'Bonus units up to TZS 5,000',
        'Limited offer'
      ],
      minSpend: 20000,
      maxDiscount: 5000,
      limitedTime: true
    },
    {
      id: 'water-discount',
      title: 'Water Bill Discount',
      description: 'Save 20% on water bill payments',
      discount: '20% OFF',
      code: 'WATER20',
      category: 'bills',
      image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800',
      validUntil: '2024-03-15',
      terms: [
        'DAWASA & regional water authorities',
        'Minimum payment: TZS 15,000',
        'Maximum discount: TZS 8,000'
      ],
      minSpend: 15000,
      maxDiscount: 8000
    },
    {
      id: 'mobile-topup',
      title: 'Mobile Airtime Bonus',
      description: 'Get 25% extra airtime on recharge',
      discount: '25% Bonus',
      code: 'AIRTIME25',
      category: 'bills',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
      validUntil: '2024-03-31',
      terms: [
        'All networks (Vodacom, Airtel, Tigo, Halotel)',
        'Minimum recharge: TZS 10,000',
        'Bonus up to TZS 5,000',
        'Valid 5 times per user'
      ],
      minSpend: 10000,
      maxDiscount: 5000,
      usageLimit: 5
    },
    {
      id: 'dstv-promo',
      title: 'DStv Subscription Offer',
      description: 'Pay for 3 months, get 1 month FREE',
      discount: '1 Month FREE',
      code: 'DSTV3FOR4',
      category: 'bills',
      image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800',
      validUntil: '2024-04-30',
      terms: [
        'DStv Premium, Compact+ & Compact',
        'Pay for 3 months advance',
        'Free month credited automatically',
        'New and existing customers'
      ],
      partnered: true,
      partnerName: 'DStv Tanzania'
    },

    // WALLET & MONEY TRANSFER PROMOS
    {
      id: 'wallet-topup-bonus',
      title: 'Wallet Top-up Bonus',
      description: 'Get 20% bonus when you top up your wallet',
      discount: '20% Bonus',
      code: 'TOPUP20',
      category: 'wallet',
      image: 'https://images.unsplash.com/photo-1607863680198-23d4b2565df0?w=800',
      validUntil: '2024-03-31',
      terms: [
        'Minimum top-up: TZS 50,000',
        'Maximum bonus: TZS 20,000',
        'Bonus credited instantly',
        'Valid once per user'
      ],
      minSpend: 50000,
      maxDiscount: 20000,
      featured: true,
      limitedTime: true
    },
    {
      id: 'send-money-free',
      title: 'FREE Money Transfer',
      description: 'Zero fees on all money transfers',
      discount: 'FREE Transfer',
      code: 'SENDTFREE',
      category: 'wallet',
      image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800',
      validUntil: '2024-02-29',
      terms: [
        'Bank & mobile money transfers',
        'No maximum limit',
        'Valid for 7 days',
        'All destinations'
      ],
      limitedTime: true
    },
    {
      id: 'refer-friend',
      title: 'Refer & Earn TZS 25,000',
      description: 'Invite friends and earn rewards for each signup',
      discount: 'TZS 25,000 Each',
      code: 'REFER25K',
      category: 'wallet',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
      validUntil: '2024-12-31',
      terms: [
        'TZS 25,000 per successful referral',
        'Friend must complete first transaction',
        'Unlimited referrals',
        'Credited within 24 hours'
      ],
      featured: true
    },
    {
      id: 'membership-upgrade',
      title: 'Premium Membership - 50% OFF',
      description: 'Upgrade to Premium and save 50%',
      discount: '50% OFF',
      code: 'PREMIUM50',
      category: 'wallet',
      image: 'https://images.unsplash.com/photo-1620287341260-ab5f6b4440f3?w=800',
      validUntil: '2024-04-30',
      terms: [
        'Annual Premium membership',
        'Pay TZS 49,500 instead of TZS 99,000',
        'All Premium benefits included',
        'New subscribers only'
      ],
      featured: true,
      newUser: true
    }
  ];

  const filteredPromos = promos.filter(promo => {
    const matchesCategory = selectedCategory === 'all' || promo.category === selectedCategory;
    const matchesSearch = promo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         promo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         promo.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPromos = promos.filter(p => p.featured);

  const copyPromoCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleFavorite = (promoId: string) => {
    if (favorites.includes(promoId)) {
      setFavorites(favorites.filter(id => id !== promoId));
    } else {
      setFavorites([...favorites, promoId]);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const PromoCard = ({ promo, featured = false }: { promo: Promo; featured?: boolean }) => (
    <div
      className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
        featured ? 'border-2 border-[#1a5f3f]' : 'border'
      }`}
    >
      {/* Image */}
      <div className="relative h-40">
        <ImageWithFallback
          src={promo.image}
          alt={promo.title}
          className="w-full h-full object-cover"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {promo.featured && (
            <div className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Crown className="w-3 h-3" />
              Featured
            </div>
          )}
          {promo.limitedTime && (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Limited Time
            </div>
          )}
          {promo.newUser && (
            <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              New User
            </div>
          )}
        </div>

        {/* Discount Badge */}
        <div className="absolute top-3 right-3 bg-[#1a5f3f] text-white px-4 py-2 rounded-lg font-bold text-lg">
          {promo.discount}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(promo.id);
          }}
          className="absolute bottom-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
        >
          <Heart
            className={`w-5 h-5 ${
              favorites.includes(promo.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold mb-2 text-gray-900 text-lg">{promo.title}</h3>
        <p className="text-sm text-gray-800 mb-4 font-medium">{promo.description}</p>

        {/* Promo Code */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 bg-gray-100 border-2 border-dashed border-[#1a5f3f] rounded-lg p-3 flex items-center justify-between">
            <span className="font-mono font-bold text-[#1a5f3f]">{promo.code}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => copyPromoCode(promo.code)}
              className="h-8"
            >
              {copiedCode === promo.code ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm text-gray-800 mb-4 font-medium">
          {promo.minSpend && (
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span>Min. spend: {formatCurrency(promo.minSpend)}</span>
            </div>
          )}
          {promo.maxDiscount && (
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4" />
              <span>Max. discount: {formatCurrency(promo.maxDiscount)}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Valid until: {promo.validUntil}</span>
          </div>
          {promo.usageLimit && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Valid {promo.usageLimit} times per user</span>
            </div>
          )}
        </div>

        {/* Partner Badge */}
        {promo.partnered && promo.partnerName && (
          <div className="mb-3 bg-blue-100 border border-blue-300 rounded-lg p-3 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-700" />
            <span className="text-sm text-blue-900 font-semibold">Partner: {promo.partnerName}</span>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={() => setSelectedPromo(promo)}
          variant="outline"
          className="w-full"
        >
          View Details
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  if (selectedPromo) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => setSelectedPromo(null)}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="font-bold text-xl">Promo Details</h1>
            </div>
          </div>
        </div>

        {/* Promo Detail */}
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Image */}
          <div className="relative h-64 rounded-xl overflow-hidden mb-6">
            <ImageWithFallback
              src={selectedPromo.image}
              alt={selectedPromo.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h2 className="font-bold text-2xl mb-2">{selectedPromo.title}</h2>
              <p className="text-lg">{selectedPromo.description}</p>
            </div>
          </div>

          {/* Discount Badge */}
          <div className="bg-gradient-to-r from-[#1a5f3f] to-[#2a7f5f] text-white rounded-xl p-6 mb-6 text-center">
            <p className="text-sm mb-2">You Save</p>
            <p className="text-4xl font-bold mb-2">{selectedPromo.discount}</p>
            <p className="text-sm opacity-90">on this promo</p>
          </div>

          {/* Promo Code */}
          <div className="bg-white rounded-xl p-6 mb-6 border-2 border-[#1a5f3f]">
            <p className="text-sm text-gray-600 mb-3 text-center">Promo Code</p>
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <span className="font-mono font-bold text-2xl text-[#1a5f3f]">{selectedPromo.code}</span>
              <Button
                onClick={() => copyPromoCode(selectedPromo.code)}
                className="bg-[#1a5f3f] hover:bg-[#164d33]"
              >
                {copiedCode === selectedPromo.code ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5 mr-2" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl p-6 mb-6">
            <h3 className="font-bold mb-4">Promo Details</h3>
            <div className="space-y-3">
              {selectedPromo.minSpend && (
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">Minimum Spend</span>
                  <span className="font-semibold">{formatCurrency(selectedPromo.minSpend)}</span>
                </div>
              )}
              {selectedPromo.maxDiscount && (
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">Maximum Discount</span>
                  <span className="font-semibold">{formatCurrency(selectedPromo.maxDiscount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-600">Valid Until</span>
                <span className="font-semibold">{selectedPromo.validUntil}</span>
              </div>
              {selectedPromo.usageLimit && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Usage Limit</span>
                  <span className="font-semibold">{selectedPromo.usageLimit} times per user</span>
                </div>
              )}
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="bg-white rounded-xl p-6">
            <h3 className="font-bold mb-4">Terms & Conditions</h3>
            <ul className="space-y-2">
              {selectedPromo.terms.map((term, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a5f3f] to-[#2a7f5f] text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-bold text-2xl">Promos & Deals</h1>
              <p className="text-sm opacity-90">Save more with exclusive offers</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search promos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id as PromoCategory)}
                  className={`whitespace-nowrap ${
                    selectedCategory === category.id ? 'bg-[#1a5f3f] hover:bg-[#164d33]' : ''
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Featured Promos */}
        {selectedCategory === 'all' && featuredPromos.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-6 h-6 text-yellow-500" />
              <h2 className="font-bold text-xl">Featured Offers</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredPromos.map(promo => (
                <PromoCard key={promo.id} promo={promo} featured />
              ))}
            </div>
          </div>
        )}

        {/* All Promos */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-xl">
              {selectedCategory === 'all' ? 'All Promos' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-sm text-gray-600">{filteredPromos.length} offers</p>
          </div>

          {filteredPromos.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No promos found</p>
              <p className="text-sm text-gray-500">Try a different category or search term</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPromos.map(promo => (
                <PromoCard key={promo.id} promo={promo} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
