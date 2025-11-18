import { useState } from 'react';
import { Button } from './ui/button';
import { User } from '../App';
import { 
  ArrowLeft, 
  ShoppingBag,
  Search,
  Star,
  Heart,
  ShoppingCart,
  Smartphone,
  Tv,
  Zap,
  Home as HomeIcon,
  Shirt,
  Award
} from 'lucide-react';
import { Input } from './ui/input';

interface ShopPageProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

export function ShopPage({ user, accessToken, onBack }: ShopPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: ShoppingBag },
    { id: 'electronics', name: 'Electronics', icon: Smartphone },
    { id: 'fashion', name: 'Fashion', icon: Shirt },
    { id: 'home', name: 'Home', icon: HomeIcon },
    { id: 'deals', name: 'Deals', icon: Award },
  ];

  const products = [
    {
      id: '1',
      name: 'Samsung Galaxy A54',
      price: 1299000,
      originalPrice: 1499000,
      image: '📱',
      rating: 4.5,
      category: 'electronics',
      badge: 'Hot Deal'
    },
    {
      id: '2',
      name: 'Nike Air Max Sneakers',
      price: 249000,
      originalPrice: 349000,
      image: '👟',
      rating: 4.8,
      category: 'fashion',
      badge: '30% OFF'
    },
    {
      id: '3',
      name: 'Sony Headphones WH-1000',
      price: 599000,
      originalPrice: 799000,
      image: '🎧',
      rating: 4.7,
      category: 'electronics',
      badge: 'Popular'
    },
    {
      id: '4',
      name: 'Smart LED TV 43"',
      price: 899000,
      originalPrice: 1199000,
      image: '📺',
      rating: 4.6,
      category: 'electronics',
      badge: 'Best Seller'
    },
    {
      id: '5',
      name: 'Designer Watch',
      price: 399000,
      originalPrice: 599000,
      image: '⌚',
      rating: 4.4,
      category: 'fashion',
      badge: 'Trending'
    },
    {
      id: '6',
      name: 'Coffee Maker Deluxe',
      price: 189000,
      originalPrice: 249000,
      image: '☕',
      rating: 4.3,
      category: 'home',
      badge: 'New'
    },
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateDiscount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 px-4 pt-6 pb-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={onBack}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-full"
            >
              <ArrowLeft className="size-5 text-white" />
            </button>
            <div className="flex-1">
              <h1 className="text-white text-xl">eShop</h1>
              <p className="text-purple-100 text-sm">Shop and earn rewards</p>
            </div>
            <button className="bg-white/20 hover:bg-white/30 p-2 rounded-full relative">
              <ShoppingCart className="size-5 text-white" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                3
              </span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <Input
              placeholder="Search products..."
              className="pl-12 h-12 bg-white rounded-full border-0"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Promo Banner */}
        <div className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-block bg-red-500 text-white text-xs px-2 py-1 rounded-full mb-2">
              EXCLUSIVE
            </div>
            <h3 className="text-lg mb-1">Flash Sale Today!</h3>
            <p className="text-sm text-white/90 mb-3">Up to 50% off on selected items</p>
            <Button className="bg-white text-purple-600 h-9 rounded-full hover:bg-gray-100">
              Shop Now
            </Button>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-20">
            <ShoppingBag className="size-32 text-white" />
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-base mb-3">Categories</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl min-w-[80px] transition-all ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-100'
                  }`}
                >
                  <Icon className="size-6" />
                  <span className="text-xs whitespace-nowrap">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base">Featured Products</h3>
            <button className="text-blue-600 text-sm">See all</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
              >
                {/* Product Image */}
                <div className="relative">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 aspect-square flex items-center justify-center">
                    <span className="text-6xl">{product.image}</span>
                  </div>
                  {product.badge && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {product.badge}
                    </div>
                  )}
                  <button className="absolute top-2 right-2 bg-white/90 p-2 rounded-full hover:bg-white">
                    <Heart className="size-4 text-gray-600" />
                  </button>
                </div>

                {/* Product Details */}
                <div className="p-3">
                  <p className="text-sm mb-2 line-clamp-2">{product.name}</p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="size-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs text-gray-600">{product.rating}</span>
                  </div>

                  {/* Price */}
                  <div className="mb-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base text-gray-900">
                        {formatCurrency(product.price)}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    {product.originalPrice > product.price && (
                      <span className="text-xs text-green-600">
                        Save {calculateDiscount(product.originalPrice, product.price)}%
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    size="sm"
                    className="w-full h-9 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl"
                  >
                    <ShoppingCart className="size-4 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Special Offers */}
        <div>
          <h3 className="text-base mb-3">Special Offers</h3>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-xl">
                  <Award className="size-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">Get 10% cashback</p>
                  <p className="text-xs text-green-100">On purchases above TZS 100,000</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-xl">
                  <Zap className="size-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">Earn 2x points</p>
                  <p className="text-xs text-purple-100">On all electronics this week</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
