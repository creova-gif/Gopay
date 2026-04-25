import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { User } from '../App';
import { 
  ArrowLeft, Search, ShoppingCart, Filter, MapPin, 
  Clock, Star, TrendingUp, Zap, Package, Home,
  Smartphone, Utensils, Heart, Book, Sparkles,
  ChevronRight, Tag, Truck, Bike, Car, Ship,
  ThumbsUp, Shield, BadgeCheck, ChevronDown
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SmartShoppingMarketplaceProps {
  user: User;
  accessToken: string;
  onBack: () => void;
  onNavigate: (page: string) => void;
}

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  vendor: string;
  vendorVerified: boolean;
  rating: number;
  reviews: number;
  category: string;
  deliveryTime: string;
  deliveryFee: number;
  inStock: boolean;
  location: string;
}

interface Category {
  id: string;
  name: string;
  icon: any;
  color: string;
  count: number;
}

export function SmartShoppingMarketplace({ user, accessToken, onBack, onNavigate }: SmartShoppingMarketplaceProps) {
  const [view, setView] = useState<'home' | 'category' | 'product' | 'cart'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cart, setCart] = useState<Array<Product & { quantity: number }>>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deliveryMode, setDeliveryMode] = useState<'boda' | 'bicycle' | 'car' | 'pickup'>('boda');

  const categories: Category[] = [
    { id: 'groceries', name: 'Groceries', icon: ShoppingCart, color: 'from-green-500 to-emerald-500', count: 1240 },
    { id: 'food', name: 'Food & Drinks', icon: Utensils, color: 'from-orange-500 to-red-500', count: 856 },
    { id: 'electronics', name: 'Electronics', icon: Smartphone, color: 'from-blue-500 to-cyan-500', count: 432 },
    { id: 'fashion', name: 'Fashion', icon: Heart, color: 'from-pink-500 to-rose-500', count: 2140 },
    { id: 'pharmacy', name: 'Pharmacy', icon: Package, color: 'from-purple-500 to-violet-500', count: 324 },
    { id: 'home', name: 'Home & Living', icon: Home, color: 'from-amber-500 to-orange-500', count: 678 },
    { id: 'books', name: 'Books & Learning', icon: Book, color: 'from-indigo-500 to-blue-500', count: 543 },
  ];

  const featuredProducts: Product[] = [
    {
      id: '1',
      name: 'Premium Rice - 25kg',
      price: 45000,
      originalPrice: 52000,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500',
      vendor: 'Kariakoo Wholesale',
      vendorVerified: true,
      rating: 4.8,
      reviews: 234,
      category: 'groceries',
      deliveryTime: '30-45 min',
      deliveryFee: 3000,
      inStock: true,
      location: 'Kariakoo, Dar es Salaam',
    },
    {
      id: '2',
      name: 'Fresh Vegetables Bundle',
      price: 8500,
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500',
      vendor: 'TSN Fresh Market',
      vendorVerified: true,
      rating: 4.9,
      reviews: 567,
      category: 'groceries',
      deliveryTime: '20-30 min',
      deliveryFee: 2000,
      inStock: true,
      location: 'Mlimani City',
    },
    {
      id: '3',
      name: 'Samsung Galaxy A54',
      price: 850000,
      originalPrice: 920000,
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500',
      vendor: 'Mobile Junction TZ',
      vendorVerified: true,
      rating: 4.7,
      reviews: 123,
      category: 'electronics',
      deliveryTime: '1-2 hours',
      deliveryFee: 5000,
      inStock: true,
      location: 'Kariakoo',
    },
    {
      id: '4',
      name: 'Pilau Chicken Meal',
      price: 12000,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500',
      vendor: 'Mama Ntilie Kitchen',
      vendorVerified: false,
      rating: 4.6,
      reviews: 89,
      category: 'food',
      deliveryTime: '25-35 min',
      deliveryFee: 2500,
      inStock: true,
      location: 'Sinza, Dar',
    },
  ];

  const trendingSearches = [
    'Rice', 'Cooking Oil', 'Airtime', 'School Books', 
    'Fresh Fish', 'Phone Chargers', 'Maasai Sandals'
  ];

  const deliveryOptions = [
    { id: 'boda', label: 'Boda Boda', icon: Bike, time: '15-30 min', fee: 2000, eco: false },
    { id: 'bicycle', label: 'Bicycle', icon: Bike, time: '30-45 min', fee: 1000, eco: true },
    { id: 'car', label: 'Car Delivery', icon: Car, time: '20-40 min', fee: 5000, eco: false },
    { id: 'pickup', label: 'Pickup Point', icon: MapPin, time: 'Same day', fee: 0, eco: true },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    toast.success(`✅ ${product.name} added to cart!`);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Home View
  if (view === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 pb-20">
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">Smart Shopping 🛍️</h1>
              <p className="text-sm text-gray-500">Everything you need, delivered</p>
            </div>
            <button 
              onClick={() => setView('cart')}
              className="relative p-2 hover:bg-gray-100 rounded-full"
            >
              <ShoppingCart className="size-6" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, vendors, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-12 border-2 border-gray-200 rounded-full focus:border-blue-500 focus:outline-none"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-100 p-2 rounded-full">
              <Filter className="size-4 text-blue-600" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Location Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <MapPin className="size-5" />
              </div>
              <div>
                <p className="text-xs text-white/80">Delivering to</p>
                <p className="font-bold">Sinza, Dar es Salaam</p>
              </div>
            </div>
            <button className="text-sm underline">Change</button>
          </div>

          {/* Trending Searches */}
          <div>
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <TrendingUp className="size-5 text-orange-600" />
              Trending Now
            </h3>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((term, idx) => (
                <button
                  key={idx}
                  className="bg-white border border-gray-200 px-3 py-1.5 rounded-full text-sm hover:border-blue-500 transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Categories Grid */}
          <div>
            <h3 className="font-bold mb-3">Shop by Category</h3>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setView('category');
                    }}
                    className="text-left"
                  >
                    <div className={`bg-gradient-to-br ${category.color} rounded-2xl p-4 text-white`}>
                      <Icon className="size-8 mb-2 opacity-90" />
                      <p className="font-bold mb-1">{category.name}</p>
                      <p className="text-xs text-white/80">{category.count} items</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Flash Deals */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="size-5" />
                <h3 className="font-bold">Flash Deals</h3>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Clock className="size-4" />
                <span>Ends in 2h 34m</span>
              </div>
            </div>
            <div className="flex gap-3 overflow-x-auto">
              {featuredProducts.filter(p => p.originalPrice).map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    setSelectedProduct(product);
                    setView('product');
                  }}
                  className="bg-white rounded-xl p-3 min-w-[140px] text-left"
                >
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                  <p className="text-xs text-gray-600 line-clamp-2 mb-1">{product.name}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-orange-600 font-bold text-sm">{formatCurrency(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-gray-400 text-xs line-through">{formatCurrency(product.originalPrice)}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Featured Products */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">Featured Products</h3>
              <button className="text-sm text-blue-600 font-semibold">View All</button>
            </div>
            <div className="space-y-3">
              {featuredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    setSelectedProduct(product);
                    setView('product');
                  }}
                  className="w-full bg-white rounded-2xl p-3 border border-gray-100 hover:border-blue-500 transition-all text-left"
                >
                  <div className="flex gap-3">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1">
                          <p className="font-bold line-clamp-1">{product.name}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                            <span>{product.vendor}</span>
                            {product.vendorVerified && (
                              <BadgeCheck className="size-3 text-blue-600" />
                            )}
                          </div>
                        </div>
                        {!product.inStock && (
                          <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                            Out of Stock
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="size-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs font-semibold">{product.rating}</span>
                          <span className="text-xs text-gray-400">({product.reviews})</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="size-3" />
                          <span>{product.deliveryTime}</span>
                        </div>
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-lg font-bold text-blue-600">{formatCurrency(product.price)}</p>
                          {product.originalPrice && (
                            <p className="text-xs text-gray-400 line-through">{formatCurrency(product.originalPrice)}</p>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          disabled={!product.inStock}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Options Info */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Truck className="size-5 text-green-600" />
              Delivery Options
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {deliveryOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <div key={option.id} className="bg-white rounded-lg p-3 text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="size-4 text-green-600" />
                      <span className="font-semibold">{option.label}</span>
                    </div>
                    <p className="text-xs text-gray-500">{option.time}</p>
                    <p className="text-xs font-bold text-green-600">{option.fee === 0 ? 'FREE' : formatCurrency(option.fee)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Product Details View
  if (view === 'product' && selectedProduct) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('home')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-lg font-bold flex-1">Product Details</h1>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Heart className="size-6" />
            </button>
          </div>
        </div>

        <div>
          {/* Product Image */}
          <div className="relative">
            <ImageWithFallback
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full h-80 object-cover"
            />
            {selectedProduct.originalPrice && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                SALE
              </div>
            )}
          </div>

          <div className="p-4 space-y-4">
            {/* Product Info */}
            <div>
              <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="size-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{selectedProduct.rating}</span>
                  <span className="text-gray-500">({selectedProduct.reviews} reviews)</span>
                </div>
                <span className="text-gray-400">|</span>
                <ThumbsUp className="size-4 text-green-600" />
                <span className="text-sm text-gray-600">95% positive</span>
              </div>
              <div className="flex items-end gap-3">
                <p className="text-3xl font-bold text-blue-600">{formatCurrency(selectedProduct.price)}</p>
                {selectedProduct.originalPrice && (
                  <>
                    <p className="text-lg text-gray-400 line-through">{formatCurrency(selectedProduct.originalPrice)}</p>
                    <span className="bg-red-100 text-red-700 text-sm px-2 py-1 rounded-lg font-semibold">
                      {Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Vendor Info */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {selectedProduct.vendor.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold">{selectedProduct.vendor}</p>
                      {selectedProduct.vendorVerified && (
                        <BadgeCheck className="size-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="size-3" />
                      <span>{selectedProduct.location}</span>
                    </div>
                  </div>
                </div>
                <button className="text-sm text-blue-600 font-semibold">
                  Visit Store
                </button>
              </div>
            </div>

            {/* Delivery Options */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <h3 className="font-bold mb-3">Choose Delivery Method</h3>
              <div className="space-y-2">
                {deliveryOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setDeliveryMode(option.id as any)}
                      className={`w-full p-3 rounded-xl border-2 transition-all ${
                        deliveryMode === option.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="size-5 text-blue-600" />
                          <div className="text-left">
                            <p className="font-semibold text-sm">{option.label}</p>
                            <p className="text-xs text-gray-500">{option.time}</p>
                          </div>
                          {option.eco && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                              Eco
                            </span>
                          )}
                        </div>
                        <p className="font-bold text-sm">
                          {option.fee === 0 ? 'FREE' : formatCurrency(option.fee)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex gap-3">
              <div className="flex-1 bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                <Shield className="size-5 text-green-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-green-700">Secure Payment</p>
              </div>
              <div className="flex-1 bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
                <Package className="size-5 text-blue-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-blue-700">Easy Returns</p>
              </div>
              <div className="flex-1 bg-purple-50 border border-purple-200 rounded-xl p-3 text-center">
                <BadgeCheck className="size-5 text-purple-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-purple-700">Verified</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 max-w-md mx-auto">
          <div className="flex gap-3">
            <Button
              onClick={() => addToCart(selectedProduct)}
              className="flex-1 h-14 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-full font-bold"
            >
              <ShoppingCart className="size-5 mr-2" />
              Add to Cart
            </Button>
            <Button
              onClick={() => {
                addToCart(selectedProduct);
                setView('cart');
              }}
              className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full font-bold"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Cart View
  if (view === 'cart') {
    const deliveryFee = cart.length > 0 ? cart[0].deliveryFee : 0;
    const subtotal = getCartTotal();
    const total = subtotal + deliveryFee;

    return (
      <div className="min-h-screen bg-gray-50 pb-32">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('home')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-lg font-bold flex-1">Shopping Cart ({getCartCount()})</h1>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <ShoppingCart className="size-16 text-gray-300 mb-4" />
            <p className="text-gray-500 mb-6">Your cart is empty</p>
            <Button
              onClick={() => setView('home')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {/* Cart Items */}
            <div className="bg-white rounded-2xl p-4">
              <h3 className="font-bold mb-3">Items ({cart.length})</h3>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-sm line-clamp-1 mb-1">{item.name}</p>
                      <p className="text-xs text-gray-500 mb-2">{item.vendor}</p>
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-blue-600">{formatCurrency(item.price)}</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                setCart(cart.map(i =>
                                  i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
                                ));
                              }
                            }}
                            className="w-8 h-8 bg-gray-100 rounded-full font-bold"
                          >
                            -
                          </button>
                          <span className="font-bold w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => {
                              setCart(cart.map(i =>
                                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                              ));
                            }}
                            className="w-8 h-8 bg-blue-600 text-white rounded-full font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-white rounded-2xl p-4">
              <h3 className="font-bold mb-3">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee:</span>
                  <span className="font-semibold">{formatCurrency(deliveryFee)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between">
                  <span className="font-bold text-lg">Total:</span>
                  <span className="font-bold text-2xl text-blue-600">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {/* Promo Code */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <Tag className="size-5 text-orange-600" />
                <input
                  type="text"
                  placeholder="Enter promo code"
                  className="flex-1 bg-transparent outline-none font-semibold"
                />
                <button className="text-orange-600 font-bold">Apply</button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Action Bar */}
        {cart.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 max-w-md mx-auto">
            <Button
              onClick={() => toast.error('Proceeding to checkout... 🛒')}
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full font-bold text-lg"
            >
              Checkout · {formatCurrency(total)}
            </Button>
          </div>
        )}
      </div>
    );
  }

  return null;
}
