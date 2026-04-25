import { useState } from 'react';
import { toast } from 'sonner';
import { ArrowLeft, Search, Filter, ShoppingCart, Star, Heart, Share2, MapPin, TrendingUp, Package, Truck, Shield } from 'lucide-react';

interface EcommerceMarketplaceProps {
  user: any;
  accessToken: string;
  onBack: () => void;
}

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  seller: string;
  image: string;
  badge?: string;
  inStock: boolean;
  shippingFree: boolean;
}

const categories = [
  { id: 'all', name: 'Vyote', icon: '📦' },
  { id: 'electronics', name: 'Electronics', icon: '💻' },
  { id: 'fashion', name: 'Fashion', icon: '👕' },
  { id: 'home', name: 'Nyumbani', icon: '🏠' },
  { id: 'beauty', name: 'Beauty', icon: '💄' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'food', name: 'Chakula', icon: '🍔' },
];

const demoProducts: Product[] = [
  {
    id: '1',
    name: 'Samsung Galaxy A54 5G',
    price: 850000,
    originalPrice: 1200000,
    rating: 4.5,
    reviews: 324,
    seller: 'TechHub Tanzania',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    badge: 'Punguzo 29%',
    inStock: true,
    shippingFree: true,
  },
  {
    id: '2',
    name: 'Nike Air Max 2024',
    price: 180000,
    rating: 4.8,
    reviews: 156,
    seller: 'Sports Warehouse',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    badge: 'Best Seller',
    inStock: true,
    shippingFree: true,
  },
  {
    id: '3',
    name: 'MacBook Air M2',
    price: 2800000,
    originalPrice: 3200000,
    rating: 4.9,
    reviews: 89,
    seller: 'Apple Store Tanzania',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    badge: 'Premium',
    inStock: true,
    shippingFree: true,
  },
  {
    id: '4',
    name: 'Kitenge Dress - Modern Design',
    price: 45000,
    rating: 4.6,
    reviews: 234,
    seller: 'Mama Neema Fashion',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400',
    inStock: true,
    shippingFree: false,
  },
  {
    id: '5',
    name: 'Sony WH-1000XM5 Headphones',
    price: 550000,
    rating: 4.7,
    reviews: 412,
    seller: 'Audio Excellence',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    badge: 'New',
    inStock: true,
    shippingFree: true,
  },
  {
    id: '6',
    name: 'Vitabu vya Kiswahili Set',
    price: 25000,
    rating: 4.4,
    reviews: 67,
    seller: 'Tanzania Bookshop',
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
    inStock: true,
    shippingFree: false,
  },
];

export function EcommerceMarketplace({ user, accessToken, onBack }: EcommerceMarketplaceProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [view, setView] = useState<'home' | 'product' | 'cart'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const toggleCart = (productId: string) => {
    setCart(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredProducts = demoProducts.filter(product =>
    (activeCategory === 'all' || product.seller.toLowerCase().includes(activeCategory)) &&
    (searchQuery === '' || product.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const cartTotal = cart.reduce((sum, id) => {
    const product = demoProducts.find(p => p.id === id);
    return sum + (product?.price || 0);
  }, 0);

  if (view === 'product' && selectedProduct) {
    return (
      <ProductDetails
        product={selectedProduct}
        onBack={() => {
          setView('home');
          setSelectedProduct(null);
        }}
        onAddToCart={() => toggleCart(selectedProduct.id)}
        inCart={cart.includes(selectedProduct.id)}
      />
    );
  }

  if (view === 'cart') {
    return (
      <CartView
        cart={cart}
        products={demoProducts}
        onBack={() => setView('home')}
        onRemove={(id) => toggleCart(id)}
        onCheckout={() => {
          toast.error(`Checkout: TZS ${cartTotal.toLocaleString()}`);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="hover:bg-white/20 p-2 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold">goPay Marketplace</h1>
              <p className="text-xs text-green-100">Nunua kwa bei nafuu</p>
            </div>
          </div>
          <button
            onClick={() => setView('cart')}
            className="relative bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tafuta bidhaa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-lg text-gray-900 placeholder-gray-500"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-600 text-white p-1.5 rounded">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white px-4 py-3 overflow-x-auto flex gap-2 sticky top-[140px] z-10 shadow-sm">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === category.id
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Banner */}
      <div className="m-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-5 h-5" />
              <span className="font-bold">Flash Sale!</span>
            </div>
            <p className="text-sm">Punguzo hadi 70% - Siku 2 zimebaki</p>
          </div>
          <div className="bg-white text-orange-600 px-4 py-2 rounded-lg font-bold">
            Angalia
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4 grid grid-cols-2 gap-3 pb-20">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onView={() => {
              setSelectedProduct(product);
              setView('product');
            }}
            onToggleCart={() => toggleCart(product.id)}
            onToggleWishlist={() => toggleWishlist(product.id)}
            inCart={cart.includes(product.id)}
            inWishlist={wishlist.includes(product.id)}
          />
        ))}
      </div>

      {/* Floating Cart Summary */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 bg-green-600 text-white rounded-lg shadow-xl p-4 z-20">
          <button
            onClick={() => setView('cart')}
            className="w-full flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-lg">TZS {cartTotal.toLocaleString()}</div>
              <div className="text-xs text-green-100">{cart.length} bidhaa kwenye cart</div>
            </div>
            <div className="flex items-center gap-2 bg-white text-green-600 px-4 py-2 rounded-lg font-bold">
              <ShoppingCart className="w-4 h-4" />
              <span>Angalia Cart</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

// Product Card Component
function ProductCard({ product, onView, onToggleCart, onToggleWishlist, inCart, inWishlist }: any) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative">
        <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
        {product.badge && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            {product.badge}
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist();
          }}
          className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>
      </div>
      
      <div className="p-3" onClick={onView}>
        <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1 h-10">{product.name}</h3>
        
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs text-gray-600">{product.rating} ({product.reviews})</span>
        </div>
        
        <div className="flex items-end justify-between mb-2">
          <div>
            <div className="font-bold text-green-600">TZS {(product.price / 1000).toFixed(0)}K</div>
            {product.originalPrice && (
              <div className="text-xs text-gray-400 line-through">
                TZS {(product.originalPrice / 1000).toFixed(0)}K
              </div>
            )}
          </div>
          {product.shippingFree && (
            <div className="text-xs text-blue-600 font-medium">Delivery free</div>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleCart();
          }}
          className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
            inCart
              ? 'bg-gray-200 text-gray-700'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {inCart ? 'Kwenye Cart' : 'Ongeza Cart'}
        </button>
      </div>
    </div>
  );
}

// Product Details Component
function ProductDetails({ product, onBack, onAddToCart, inCart }: any) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="relative">
        <img src={product.image} alt={product.name} className="w-full h-80 object-cover" />
        <button
          onClick={onBack}
          className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white p-4 -mt-4 rounded-t-3xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{product.rating}</span>
            <span className="text-gray-500 text-sm">({product.reviews} reviews)</span>
          </div>
          <div className="text-gray-500">|</div>
          <div className="text-sm text-gray-600">
            <Package className="w-4 h-4 inline mr-1" />
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          <div className="text-3xl font-bold text-green-600">
            TZS {product.price.toLocaleString()}
          </div>
          {product.originalPrice && (
            <div className="text-lg text-gray-400 line-through">
              TZS {product.originalPrice.toLocaleString()}
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 text-blue-700">
            <Truck className="w-5 h-5" />
            <div>
              <div className="font-medium">Free Delivery</div>
              <div className="text-xs text-blue-600">Dar es Salaam - 2-3 days</div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-bold text-gray-900 mb-2">Seller Information</h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full" />
            <div>
              <div className="font-medium">{product.seller}</div>
              <div className="text-sm text-gray-600">Verified Seller</div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-bold text-gray-900 mb-2">Description</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            High-quality product with excellent features. Brand new, sealed in original packaging.
            Fast shipping available across Tanzania. Warranty included.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-green-700">
            <Shield className="w-5 h-5" />
            <div>
              <div className="font-medium">Buyer Protection</div>
              <div className="text-xs text-green-600">Money-back guarantee if item not as described</div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 max-w-md mx-auto">
        <button
          onClick={onAddToCart}
          className={`w-full py-3 rounded-lg font-bold text-lg transition-colors ${
            inCart
              ? 'bg-gray-200 text-gray-700'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {inCart ? 'Remove from Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

// Cart View Component
function CartView({ cart, products, onBack, onRemove, onCheckout }: any) {
  const cartItems = cart.map((id: string) => products.find((p: Product) => p.id === id));
  const subtotal = cartItems.reduce((sum: number, item: Product) => sum + item.price, 0);
  const shipping = 5000;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <div className="bg-green-600 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="hover:bg-white/20 p-2 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">My Cart</h1>
            <p className="text-xs text-green-100">{cart.length} items</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {cartItems.map((item: Product) => (
          <div key={item.id} className="bg-white rounded-lg p-3 flex gap-3">
            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
            <div className="flex-1">
              <h3 className="font-medium text-sm mb-1">{item.name}</h3>
              <div className="text-green-600 font-bold mb-2">TZS {item.price.toLocaleString()}</div>
              <button
                onClick={() => onRemove(item.id)}
                className="text-red-600 text-xs font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Fixed Bottom Checkout */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 max-w-md mx-auto">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">TZS {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">TZS {shipping.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>Total</span>
            <span className="text-green-600">TZS {total.toLocaleString()}</span>
          </div>
        </div>
        <button
          onClick={onCheckout}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
