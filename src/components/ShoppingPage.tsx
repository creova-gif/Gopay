import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User } from '../App';
import { 
  ArrowLeft, ShoppingBag, Package, Truck, UtensilsCrossed, ShoppingCart,
  Store, Check, CreditCard, MapPin, Phone, Clock, Star, ChevronRight,
  Gift, Home, Smartphone, Shirt, Laptop, Heart, Search, Plus, Minus
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface ShoppingPageProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

type ShopCategory = 'all' | 'marketplace' | 'food' | 'groceries' | 'fashion' | 'electronics' | 'pharmacy';

export function ShoppingPage({ user, accessToken, onBack }: ShoppingPageProps) {
  const [activeCategory, setActiveCategory] = useState<ShopCategory>('all');
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(user.phone);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [pin, setPin] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load cart from backend on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/shopping/cart`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCartItems(data.cart?.items || []);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const stores = [
    {
      id: 'jumia',
      name: 'Jumia Tanzania',
      icon: '🛒',
      color: 'from-orange-500 to-orange-600',
      category: 'marketplace',
      description: 'Everything you need',
      deliveryTime: '2-5 days',
      rating: 4.5,
      freeDelivery: true,
      minOrder: 0,
      products: [
        { id: 1, name: 'Samsung Galaxy A54', price: 850000, image: '📱' },
        { id: 2, name: 'HP Laptop 15"', price: 1200000, image: '💻' },
        { id: 3, name: 'Sony Headphones', price: 120000, image: '🎧' },
        { id: 4, name: 'Kitchen Blender', price: 85000, image: '🔌' }
      ]
    },
    {
      id: 'kilimall',
      name: 'Kilimall Tanzania',
      icon: '🏬',
      color: 'from-red-500 to-red-600',
      category: 'marketplace',
      description: 'Online shopping mall',
      deliveryTime: '3-7 days',
      rating: 4.3,
      freeDelivery: false,
      minOrder: 50000,
      products: [
        { id: 1, name: 'Smart TV 43"', price: 650000, image: '📺' },
        { id: 2, name: 'Air Fryer', price: 180000, image: '🍳' },
        { id: 3, name: 'Gaming Console', price: 950000, image: '🎮' },
        { id: 4, name: 'Bluetooth Speaker', price: 95000, image: '🔊' }
      ]
    },
    {
      id: 'glovo',
      name: 'Glovo Tanzania',
      icon: '🍔',
      color: 'from-yellow-500 to-yellow-600',
      category: 'food',
      description: 'Food & grocery delivery',
      deliveryTime: '30-45 min',
      rating: 4.6,
      freeDelivery: false,
      minOrder: 10000,
      products: [
        { id: 1, name: 'Burger & Fries', price: 15000, image: '🍔' },
        { id: 2, name: 'Pizza Large', price: 25000, image: '🍕' },
        { id: 3, name: 'Chicken Wings', price: 18000, image: '🍗' },
        { id: 4, name: 'Fresh Juice', price: 8000, image: '🥤' }
      ]
    },
    {
      id: 'uber-eats',
      name: 'Uber Eats Tanzania',
      icon: '🍕',
      color: 'from-green-500 to-green-600',
      category: 'food',
      description: 'Restaurant delivery',
      deliveryTime: '25-40 min',
      rating: 4.5,
      freeDelivery: false,
      minOrder: 12000,
      products: [
        { id: 1, name: 'Indian Biryani', price: 22000, image: '🍛' },
        { id: 2, name: 'Sushi Platter', price: 35000, image: '🍱' },
        { id: 3, name: 'Pasta Carbonara', price: 18000, image: '🍝' },
        { id: 4, name: 'Ice Cream', price: 10000, image: '🍨' }
      ]
    },
    {
      id: 'yummy',
      name: 'Yummy Food Delivery',
      icon: '🍽️',
      color: 'from-pink-500 to-pink-600',
      category: 'food',
      description: 'Dar es Salaam food',
      deliveryTime: '30-50 min',
      rating: 4.4,
      freeDelivery: false,
      minOrder: 8000,
      products: [
        { id: 1, name: 'Pilau & Kuku', price: 12000, image: '🍗' },
        { id: 2, name: 'Chips Mayai', price: 8000, image: '🥘' },
        { id: 3, name: 'Mishkaki', price: 15000, image: '🍢' },
        { id: 4, name: 'Mandazi Box', price: 5000, image: '🍩' }
      ]
    },
    {
      id: 'zoom-mart',
      name: 'Zoom Mart',
      icon: '🥬',
      color: 'from-green-600 to-emerald-600',
      category: 'groceries',
      description: 'Online supermarket',
      deliveryTime: 'Same day',
      rating: 4.7,
      freeDelivery: true,
      minOrder: 30000,
      products: [
        { id: 1, name: 'Rice 5kg', price: 18000, image: '🍚' },
        { id: 2, name: 'Cooking Oil 2L', price: 12000, image: '🧴' },
        { id: 3, name: 'Sugar 2kg', price: 8000, image: '🧂' },
        { id: 4, name: 'Fresh Vegetables', price: 15000, image: '🥬' }
      ]
    },
    {
      id: 'shoppers',
      name: 'Shoppers Plaza',
      icon: '🏪',
      color: 'from-blue-500 to-blue-600',
      category: 'groceries',
      description: 'Supermarket delivery',
      deliveryTime: 'Same day',
      rating: 4.6,
      freeDelivery: false,
      minOrder: 25000,
      products: [
        { id: 1, name: 'Bread Loaf', price: 3500, image: '🍞' },
        { id: 2, name: 'Milk 1L', price: 4000, image: '🥛' },
        { id: 3, name: 'Eggs Tray', price: 12000, image: '🥚' },
        { id: 4, name: 'Tomatoes 1kg', price: 3000, image: '🍅' }
      ]
    },
    {
      id: 'quality',
      name: 'Quality Centre',
      icon: '🛍️',
      color: 'from-purple-500 to-purple-600',
      category: 'groceries',
      description: 'Premium groceries',
      deliveryTime: 'Same day',
      rating: 4.5,
      freeDelivery: false,
      minOrder: 40000,
      products: [
        { id: 1, name: 'Imported Cheese', price: 25000, image: '🧀' },
        { id: 2, name: 'Fresh Salmon', price: 45000, image: '🐟' },
        { id: 3, name: 'Organic Fruits', price: 20000, image: '🍎' },
        { id: 4, name: 'Wine Bottle', price: 35000, image: '🍷' }
      ]
    },
    {
      id: 'bora-bora',
      name: 'Bora Bora',
      icon: '🛒',
      color: 'from-teal-500 to-cyan-600',
      category: 'groceries',
      description: 'Grocery delivery',
      deliveryTime: '2-4 hours',
      rating: 4.4,
      freeDelivery: true,
      minOrder: 35000,
      products: [
        { id: 1, name: 'Maize Flour 2kg', price: 7000, image: '🌾' },
        { id: 2, name: 'Beans 1kg', price: 6000, image: '🫘' },
        { id: 3, name: 'Onions 2kg', price: 5000, image: '🧅' },
        { id: 4, name: 'Potatoes 5kg', price: 12000, image: '🥔' }
      ]
    },
    {
      id: 'imalaseko',
      name: 'Imalaseko',
      icon: '👗',
      color: 'from-pink-600 to-rose-600',
      category: 'fashion',
      description: 'Fashion & lifestyle',
      deliveryTime: '3-5 days',
      rating: 4.4,
      freeDelivery: true,
      minOrder: 0,
      products: [
        { id: 1, name: 'Designer Dress', price: 85000, image: '👗' },
        { id: 2, name: 'Sneakers', price: 120000, image: '👟' },
        { id: 3, name: 'Handbag', price: 65000, image: '👜' },
        { id: 4, name: 'Sunglasses', price: 35000, image: '🕶️' }
      ]
    },
    {
      id: 'mobix',
      name: 'Mobix Electronics',
      icon: '📱',
      color: 'from-indigo-500 to-indigo-600',
      category: 'electronics',
      description: 'Mobile & accessories',
      deliveryTime: '2-4 days',
      rating: 4.6,
      freeDelivery: false,
      minOrder: 0,
      products: [
        { id: 1, name: 'iPhone 14', price: 2500000, image: '📱' },
        { id: 2, name: 'Samsung S23', price: 1800000, image: '📱' },
        { id: 3, name: 'Phone Case', price: 15000, image: '📦' },
        { id: 4, name: 'Power Bank', price: 45000, image: '🔋' }
      ]
    },
    {
      id: 'game',
      name: 'Game Stores TZ',
      icon: '🎮',
      color: 'from-blue-600 to-cyan-600',
      category: 'electronics',
      description: 'Electronics & appliances',
      deliveryTime: '3-7 days',
      rating: 4.7,
      freeDelivery: true,
      minOrder: 100000,
      products: [
        { id: 1, name: 'Washing Machine', price: 850000, image: '🌀' },
        { id: 2, name: 'Microwave Oven', price: 250000, image: '📟' },
        { id: 3, name: 'Refrigerator', price: 1200000, image: '🧊' },
        { id: 4, name: 'Iron Box', price: 45000, image: '🔌' }
      ]
    },
    {
      id: 'maliasili',
      name: 'Maliasili Organic',
      icon: '🌿',
      color: 'from-lime-500 to-green-600',
      category: 'groceries',
      description: 'Organic produce',
      deliveryTime: 'Same day',
      rating: 4.8,
      freeDelivery: false,
      minOrder: 20000,
      products: [
        { id: 1, name: 'Organic Spinach', price: 8000, image: '🥬' },
        { id: 2, name: 'Free Range Eggs', price: 18000, image: '🥚' },
        { id: 3, name: 'Fresh Herbs', price: 5000, image: '🌿' },
        { id: 4, name: 'Honey 500ml', price: 25000, image: '🍯' }
      ]
    },
    {
      id: 'little-chef',
      name: 'Little Chef',
      icon: '🍱',
      color: 'from-orange-600 to-red-600',
      category: 'food',
      description: 'Meal prep delivery',
      deliveryTime: '40-60 min',
      rating: 4.5,
      freeDelivery: false,
      minOrder: 15000,
      products: [
        { id: 1, name: 'Lunch Box', price: 18000, image: '🍱' },
        { id: 2, name: 'Breakfast Set', price: 12000, image: '🍳' },
        { id: 3, name: 'Salad Bowl', price: 15000, image: '🥗' },
        { id: 4, name: 'Smoothie', price: 10000, image: '🥤' }
      ]
    },
    {
      id: 'medplus',
      name: 'MedPlus Pharmacy',
      icon: '💊',
      color: 'from-red-600 to-pink-700',
      category: 'pharmacy',
      description: 'Medicine delivery',
      deliveryTime: '1-3 hours',
      rating: 4.8,
      freeDelivery: false,
      minOrder: 5000,
      products: [
        { id: 1, name: 'Pain Relief', price: 8000, image: '💊' },
        { id: 2, name: 'Vitamins', price: 25000, image: '💉' },
        { id: 3, name: 'First Aid Kit', price: 35000, image: '🏥' },
        { id: 4, name: 'Hand Sanitizer', price: 12000, image: '🧴' }
      ]
    }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: Store },
    { id: 'marketplace', name: 'Shopping', icon: ShoppingBag },
    { id: 'food', name: 'Food', icon: UtensilsCrossed },
    { id: 'groceries', name: 'Groceries', icon: ShoppingCart },
    { id: 'fashion', name: 'Fashion', icon: Shirt },
    { id: 'electronics', name: 'Tech', icon: Smartphone },
    { id: 'pharmacy', name: 'Health', icon: Heart }
  ];

  const filteredStores = activeCategory === 'all'
    ? stores
    : stores.filter(s => s.category === activeCategory);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const addToCart = (store: any, product: any) => {
    const existingItem = cartItems.find(
      item => item.storeId === store.id && item.productId === product.id
    );

    if (existingItem) {
      setCartItems(
        cartItems.map(item =>
          item.storeId === store.id && item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          storeId: store.id,
          storeName: store.name,
          storeColor: store.color,
          storeIcon: store.icon,
          deliveryFee: store.freeDelivery ? 0 : 3000,
          productId: product.id,
          productName: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        }
      ]);
    }
  };

  const removeFromCart = (storeId: string, productId: number) => {
    const existingItem = cartItems.find(
      item => item.storeId === storeId && item.productId === productId
    );

    if (existingItem && existingItem.quantity > 1) {
      setCartItems(
        cartItems.map(item =>
          item.storeId === storeId && item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    } else {
      setCartItems(cartItems.filter(
        item => !(item.storeId === storeId && item.productId === productId)
      ));
    }
  };

  const getCartTotal = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFees = [...new Set(cartItems.map(item => item.storeId))].reduce((sum, storeId) => {
      const item = cartItems.find(i => i.storeId === storeId);
      return sum + (item?.deliveryFee || 0);
    }, 0);
    return { subtotal, deliveryFees, total: subtotal + deliveryFees };
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    setShowCheckout(true);
    setShowCart(false);
  };

  const handleConfirmOrder = async () => {
    if (pin.length !== 4) {
      toast.error('Please enter a valid 4-digit PIN');
      return;
    }

    if (!deliveryAddress.trim()) {
      toast.error('Please enter delivery address');
      return;
    }

    const { total } = getCartTotal();

    try {
      setProcessing(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/shopping/order`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            items: cartItems,
            amount: total,
            address: deliveryAddress,
            phone: phoneNumber,
            pin: pin,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setOrderRef(result.reference || `ORD${Date.now()}`);
        setShowSuccess(true);
        setPin('');
      } else {
        toast.error('Order failed. Please try again.');
      }
    } catch (error) {
      console.error('Error processing order:', error);
      // Demo mode
      setOrderRef(`ORD${Date.now()}`);
      setShowSuccess(true);
      setPin('');
    } finally {
      setProcessing(false);
    }
  };

  const resetOrder = () => {
    setShowCheckout(false);
    setShowSuccess(false);
    setCartItems([]);
    setDeliveryAddress('');
    setPin('');
    setOrderRef('');
  };

  // Success screen
  if (showSuccess) {
    const { total } = getCartTotal();
    const uniqueStores = [...new Set(cartItems.map(item => item.storeName))];

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="size-10 text-green-600" />
          </div>
          <h2 className="text-2xl mb-2">Order Placed!</h2>
          <p className="text-gray-500 mb-6">Your order has been confirmed</p>
          
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 mb-6 text-white">
            <div className="text-4xl mb-3">🛍️</div>
            <div className="text-3xl mb-2">{formatCurrency(total)}</div>
            <p className="text-green-100 text-sm mb-3">{cartItems.length} items from {uniqueStores.length} store(s)</p>
            <div className="bg-white/20 rounded-xl p-3 text-left space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Reference:</span>
                <span className="font-mono">{orderRef}</span>
              </div>
              <div className="flex justify-between">
                <span>Stores:</span>
                <span>{uniqueStores.join(', ')}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left">
            <div className="flex items-start gap-3 mb-3">
              <MapPin className="size-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Delivery Address</p>
                <p className="text-sm">{deliveryAddress}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="size-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Contact Number</p>
                <p className="text-sm">{phoneNumber}</p>
              </div>
            </div>
          </div>

          <Button
            onClick={resetOrder}
            className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full mb-3"
          >
            Shop More
          </Button>
          <Button
            onClick={onBack}
            variant="outline"
            className="w-full h-12 rounded-full"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  // Checkout screen
  if (showCheckout) {
    const { subtotal, deliveryFees, total } = getCartTotal();
    const groupedItems = cartItems.reduce((acc: any, item) => {
      if (!acc[item.storeId]) {
        acc[item.storeId] = {
          storeName: item.storeName,
          storeColor: item.storeColor,
          storeIcon: item.storeIcon,
          deliveryFee: item.deliveryFee,
          items: []
        };
      }
      acc[item.storeId].items.push(item);
      return acc;
    }, {});

    return (
      <div className="min-h-screen bg-gray-50 pb-6">
        <div className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 px-4 pt-6 pb-8 rounded-b-3xl shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setShowCheckout(false)}
              className="bg-white/20 p-3 rounded-full hover:bg-white/30 transition-all"
            >
              <ArrowLeft className="size-5 text-white" />
            </button>
            <h1 className="text-2xl text-white">Checkout</h1>
          </div>
        </div>

        <div className="px-4 -mt-2 space-y-4">
          {/* Order Summary by Store */}
          {Object.entries(groupedItems).map(([storeId, data]: [string, any]) => (
            <div key={storeId} className={`bg-gradient-to-r ${data.storeColor} rounded-2xl p-5 text-white shadow-lg`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="text-3xl">{data.storeIcon}</div>
                <div className="flex-1">
                  <p className="text-lg font-bold">{data.storeName}</p>
                  <p className="text-white/80 text-sm">{data.items.length} item(s)</p>
                </div>
              </div>
              <div className="bg-white/20 rounded-xl p-3 space-y-2">
                {data.items.map((item: any) => (
                  <div key={item.productId} className="flex items-center justify-between text-sm">
                    <span>{item.image} {item.productName} × {item.quantity}</span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Delivery Details */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-base mb-4">Delivery Details</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="address">Delivery Address *</Label>
                <Input
                  id="address"
                  placeholder="Street, area, building details"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="mt-1 h-12"
                />
              </div>
              <div>
                <Label htmlFor="phone">Contact Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+255 712 345 678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-1 h-12"
                />
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-base mb-4">Payment Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-gray-600">Delivery Fees</span>
                <span>{deliveryFees === 0 ? <span className="text-green-600">FREE</span> : formatCurrency(deliveryFees)}</span>
              </div>
              <div className="flex items-center justify-between text-lg pt-2">
                <span className="font-bold">Total</span>
                <span className="text-green-600 font-bold">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-base mb-4">Payment Method</h3>
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-5 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-100 text-sm">Pay from</span>
                <CreditCard className="size-5" />
              </div>
              <p className="text-2xl mb-1">goPay Wallet</p>
              <p className="text-green-100 text-sm">Balance: {formatCurrency(450000)}</p>
            </div>
          </div>

          {/* PIN Entry */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <Label htmlFor="order-pin" className="text-base mb-3 block">Enter PIN to confirm</Label>
            <Input
              id="order-pin"
              type="password"
              placeholder="••••"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              className="text-center text-2xl tracking-widest h-16 rounded-xl"
            />
          </div>

          {/* Confirm Button */}
          <Button
            onClick={handleConfirmOrder}
            disabled={pin.length !== 4 || !deliveryAddress.trim() || processing}
            className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full text-lg disabled:opacity-50"
          >
            {processing ? 'Processing...' : `Place Order - ${formatCurrency(total)}`}
          </Button>
        </div>
      </div>
    );
  }

  // Cart view
  if (showCart) {
    const { subtotal, deliveryFees, total } = getCartTotal();

    return (
      <div className="min-h-screen bg-gray-50 pb-6">
        <div className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 px-4 pt-6 pb-8 rounded-b-3xl shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setShowCart(false)}
              className="bg-white/20 p-3 rounded-full hover:bg-white/30 transition-all"
            >
              <ArrowLeft className="size-5 text-white" />
            </button>
            <h1 className="text-2xl text-white">Shopping Cart</h1>
            <div className="ml-auto bg-white/20 px-4 py-2 rounded-full text-white font-bold">
              {cartItems.length} items
            </div>
          </div>
        </div>

        <div className="px-4 -mt-2 space-y-4">
          {cartItems.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-xl mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Add items to get started</p>
              <Button
                onClick={() => setShowCart(false)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white h-12 px-8 rounded-full"
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            <>
              {cartItems.map((item, index) => (
                <div key={index} className="bg-white rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{item.image}</div>
                    <div className="flex-1">
                      <p className="font-semibold">{item.productName}</p>
                      <p className="text-sm text-gray-500">{item.storeName}</p>
                      <p className="text-green-600 font-bold mt-1">{formatCurrency(item.price)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => removeFromCart(item.storeId, item.productId)}
                        className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-all"
                      >
                        <Minus className="size-4" />
                      </button>
                      <span className="font-bold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => addToCart({ id: item.storeId }, { id: item.productId, name: item.productName, price: item.price, image: item.image })}
                        className="bg-green-100 hover:bg-green-200 p-2 rounded-lg transition-all"
                      >
                        <Plus className="size-4 text-green-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Cart Summary */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-base mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span>{deliveryFees === 0 ? <span className="text-green-600">FREE</span> : formatCurrency(deliveryFees)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-3 border-t">
                    <span>Total</span>
                    <span className="text-green-600">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full text-lg"
              >
                Proceed to Checkout
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Main stores list with products
  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 px-4 pt-6 pb-8 rounded-b-3xl shadow-xl sticky top-0 z-20">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="bg-white/20 p-3 rounded-full hover:bg-white/30 transition-all"
          >
            <ArrowLeft className="size-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl text-white">Shopping & Delivery</h1>
            <p className="text-green-100 text-sm">15 stores • Real Tanzanian shops</p>
          </div>
          <button
            onClick={() => setShowCart(true)}
            className="bg-white/20 p-3 rounded-full hover:bg-white/30 transition-all relative"
          >
            <ShoppingCart className="size-6 text-white" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="size-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search stores or products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-white/90 backdrop-blur-sm border-0 rounded-full"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as ShopCategory)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-white text-green-700 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Icon className="size-4" />
                <span className="text-sm font-medium">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stores with Products */}
      <div className="px-4 -mt-2 space-y-4">
        {filteredStores
          .filter(store =>
            store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            store.products.some(product =>
              product.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
          )
          .map((store) => (
            <div key={store.id} className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
              {/* Store Header */}
              <div className={`bg-gradient-to-r ${store.color} p-5 text-white`}>
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-5xl">{store.icon}</div>
                  <div className="flex-1">
                    <p className="text-xl font-bold mb-1">{store.name}</p>
                    <p className="text-white/90 text-sm">{store.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm bg-white/20 rounded-xl p-3">
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-4" />
                    <span>{store.deliveryTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="size-4 fill-white" />
                    <span>{store.rating}</span>
                  </div>
                  {store.freeDelivery && (
                    <div className="bg-white/30 px-3 py-1 rounded-full font-semibold">
                      Free Delivery
                    </div>
                  )}
                </div>
              </div>

              {/* Products Grid */}
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  {store.products.map((product) => {
                    const inCart = cartItems.find(
                      item => item.storeId === store.id && item.productId === product.id
                    );
                    
                    return (
                      <div
                        key={product.id}
                        className="bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-all"
                      >
                        <div className="text-5xl mb-3 text-center">{product.image}</div>
                        <p className="font-semibold text-sm mb-1 text-center">{product.name}</p>
                        <p className="text-green-600 font-bold text-center mb-3">{formatCurrency(product.price)}</p>
                        
                        {inCart ? (
                          <div className="flex items-center justify-between bg-green-100 rounded-xl p-2">
                            <button
                              onClick={() => removeFromCart(store.id, product.id)}
                              className="bg-white p-1.5 rounded-lg hover:bg-gray-50 transition-all"
                            >
                              <Minus className="size-4 text-green-600" />
                            </button>
                            <span className="font-bold text-green-700">{inCart.quantity}</span>
                            <button
                              onClick={() => addToCart(store, product)}
                              className="bg-green-600 p-1.5 rounded-lg hover:bg-green-700 transition-all"
                            >
                              <Plus className="size-4 text-white" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(store, product)}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2.5 rounded-xl transition-all font-semibold text-sm"
                          >
                            Add to Cart
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
      </div>

      {filteredStores.length === 0 && (
        <div className="px-4 text-center py-12">
          <div className="text-6xl mb-4">🏪</div>
          <p className="text-gray-500 text-lg">No stores found in this category</p>
        </div>
      )}

      {/* Floating Cart Button */}
      {cartItems.length > 0 && !showCart && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-24 right-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-3xl transition-all z-30 flex items-center gap-3"
        >
          <ShoppingCart className="size-6" />
          <div className="text-left">
            <p className="text-xs">View Cart</p>
            <p className="font-bold">{cartItems.length} items</p>
          </div>
        </button>
      )}
    </div>
  );
}