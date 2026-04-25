import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { 
  ArrowLeft, Plus, Minus, ShoppingCart, X, Star, Clock, Truck, Package, Check, AlertCircle
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { projectId } from '../utils/supabase/info';

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
  itemTotal: number;
}

interface Restaurant {
  id: string;
  name: string;
  deliveryTime: string;
  deliveryFee: number;
  rating: number;
  image: string;
  freeDelivery?: boolean;
  discount?: string;
}

interface Props {
  restaurant: Restaurant;
  accessToken: string;
  onBack: () => void;
  onOrderComplete: () => void;
}

export function RestaurantMenuPage({ restaurant, accessToken, onBack, onOrderComplete }: Props) {
  const [activeView, setActiveView] = useState<'menu' | 'cart' | 'checkout' | 'confirmation'>('menu');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [menuCategory, setMenuCategory] = useState('all');
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [pin, setPin] = useState('');
  const [processing, setProcessing] = useState(false);
  
  // Temporary customization state
  const [tempCustomizations, setTempCustomizations] = useState<{ [key: string]: string }>({});
  const [tempQuantity, setTempQuantity] = useState(1);
  const [tempInstructions, setTempInstructions] = useState('');

  // Mock menu data - comprehensive restaurant menu
  const menuItems: MenuItem[] = [
    // Appetizers
    {
      id: 'app-001',
      name: 'Grilled Calamari',
      description: 'Tender calamari grilled to perfection with lemon butter sauce',
      price: 18000,
      image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=400',
      category: 'appetizers',
      popular: true
    },
    {
      id: 'app-002',
      name: 'Samosa Platter',
      description: 'Crispy vegetable & meat samosas with tangy chutney',
      price: 12000,
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
      category: 'appetizers',
      vegetarian: true
    },
    {
      id: 'app-003',
      name: 'Chicken Wings',
      description: 'Crispy wings with choice of sauce',
      price: 15000,
      image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400',
      category: 'appetizers',
      spicy: true,
      customizations: [
        {
          name: 'Sauce',
          options: [
            { label: 'BBQ', price: 0 },
            { label: 'Buffalo Hot', price: 0 },
            { label: 'Honey Garlic', price: 0 },
            { label: 'Peri-Peri', price: 1000 }
          ],
          required: true
        }
      ]
    },
    {
      id: 'app-004',
      name: 'Spring Rolls',
      description: 'Fresh vegetable spring rolls with sweet chili sauce',
      price: 10000,
      image: 'https://images.unsplash.com/photo-1562013380-abc703d43f7e?w=400',
      category: 'appetizers',
      vegetarian: true
    },

    // Mains
    {
      id: 'main-001',
      name: 'Grilled Lobster',
      description: 'Fresh lobster grilled with herb butter, served with vegetables',
      price: 95000,
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400',
      category: 'mains',
      popular: true
    },
    {
      id: 'main-002',
      name: 'Wagyu Steak',
      description: 'Premium 250g wagyu beef with truffle mashed potatoes',
      price: 125000,
      image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400',
      category: 'mains',
      popular: true,
      customizations: [
        {
          name: 'Cooking',
          options: [
            { label: 'Rare', price: 0 },
            { label: 'Medium Rare', price: 0 },
            { label: 'Medium', price: 0 },
            { label: 'Well Done', price: 0 }
          ],
          required: true
        }
      ]
    },
    {
      id: 'main-003',
      name: 'Seafood Pasta',
      description: 'Linguine with prawns, calamari, mussels in creamy sauce',
      price: 45000,
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
      category: 'mains'
    },
    {
      id: 'main-004',
      name: 'Chicken Biryani',
      description: 'Fragrant basmati rice with spiced chicken, raita & salad',
      price: 28000,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
      category: 'mains',
      spicy: true
    },
    {
      id: 'main-005',
      name: 'Grilled Fish Fillet',
      description: 'Fresh catch of the day with lemon herb sauce',
      price: 38000,
      image: 'https://images.unsplash.com/photo-1580554530778-ca36943938b2?w=400',
      category: 'mains'
    },
    {
      id: 'main-006',
      name: 'Vegetable Curry',
      description: 'Mixed vegetables in coconut curry sauce with rice',
      price: 22000,
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
      category: 'mains',
      vegetarian: true,
      spicy: true
    },
    {
      id: 'main-007',
      name: 'Nyama Choma Platter',
      description: 'Traditional grilled beef & goat with ugali & kachumbari',
      price: 35000,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
      category: 'mains',
      popular: true
    },
    {
      id: 'main-008',
      name: 'Burger & Fries',
      description: 'Gourmet beef burger with cheese, bacon & crispy fries',
      price: 25000,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      category: 'mains',
      customizations: [
        {
          name: 'Add Extras',
          options: [
            { label: 'Extra Cheese', price: 2000 },
            { label: 'Bacon', price: 3000 },
            { label: 'Avocado', price: 2500 },
            { label: 'Fried Egg', price: 2000 }
          ],
          required: false
        }
      ]
    },

    // Desserts
    {
      id: 'des-001',
      name: 'Chocolate Lava Cake',
      description: 'Warm chocolate cake with molten center & vanilla ice cream',
      price: 15000,
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400',
      category: 'desserts',
      popular: true
    },
    {
      id: 'des-002',
      name: 'Tiramisu',
      description: 'Classic Italian coffee-flavored dessert',
      price: 18000,
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
      category: 'desserts'
    },
    {
      id: 'des-003',
      name: 'Fresh Fruit Platter',
      description: 'Seasonal tropical fruits beautifully arranged',
      price: 12000,
      image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400',
      category: 'desserts',
      vegetarian: true
    },
    {
      id: 'des-004',
      name: 'Ice Cream Sundae',
      description: 'Three scoops with toppings of your choice',
      price: 10000,
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
      category: 'desserts',
      customizations: [
        {
          name: 'Flavors',
          options: [
            { label: 'Vanilla, Chocolate, Strawberry', price: 0 },
            { label: 'Vanilla, Mango, Coconut', price: 0 },
            { label: 'Chocolate, Coffee, Caramel', price: 0 }
          ],
          required: true
        }
      ]
    },

    // Drinks
    {
      id: 'drk-001',
      name: 'Fresh Juice',
      description: 'Freshly squeezed tropical fruit juice',
      price: 8000,
      image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
      category: 'drinks',
      customizations: [
        {
          name: 'Flavor',
          options: [
            { label: 'Orange', price: 0 },
            { label: 'Mango', price: 0 },
            { label: 'Passion Fruit', price: 0 },
            { label: 'Watermelon', price: 0 },
            { label: 'Mixed Fruits', price: 1000 }
          ],
          required: true
        }
      ]
    },
    {
      id: 'drk-002',
      name: 'Cocktails',
      description: 'Premium cocktails mixed by expert bartenders',
      price: 18000,
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400',
      category: 'drinks',
      customizations: [
        {
          name: 'Select Cocktail',
          options: [
            { label: 'Mojito', price: 0 },
            { label: 'Piña Colada', price: 0 },
            { label: 'Margarita', price: 0 },
            { label: 'Mai Tai', price: 2000 },
            { label: 'Long Island Iced Tea', price: 2000 }
          ],
          required: true
        }
      ]
    },
    {
      id: 'drk-003',
      name: 'Coffee',
      description: 'Freshly brewed coffee',
      price: 5000,
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
      category: 'drinks',
      customizations: [
        {
          name: 'Type',
          options: [
            { label: 'Americano', price: 0 },
            { label: 'Cappuccino', price: 1000 },
            { label: 'Latte', price: 1000 },
            { label: 'Espresso', price: 0 }
          ],
          required: true
        }
      ]
    },
    {
      id: 'drk-004',
      name: 'Soft Drinks',
      description: 'Chilled soft drinks',
      price: 3000,
      image: 'https://images.unsplash.com/photo-1629203849126-9a13c519e34d?w=400',
      category: 'drinks'
    }
  ];

  const menuCategories = [
    { id: 'all', label: 'All Menu' },
    { id: 'appetizers', label: 'Appetizers' },
    { id: 'mains', label: 'Main Courses' },
    { id: 'desserts', label: 'Desserts' },
    { id: 'drinks', label: 'Drinks' }
  ];

  const filteredMenuItems = menuCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === menuCategory);

  const cartTotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);
  const deliveryFee = orderType === 'delivery' ? (restaurant.freeDelivery ? 0 : restaurant.deliveryFee) : 0;
  const platformFee = Math.round(cartTotal * 0.15); // 15% commission
  const discount = restaurant.discount ? Math.round(cartTotal * 0.15) : 0; // If discount exists
  const finalTotal = cartTotal + deliveryFee + platformFee - discount;

  const addToCart = (item: MenuItem) => {
    setSelectedMenuItem(item);
    setTempCustomizations({});
    setTempQuantity(1);
    setTempInstructions('');
    setShowItemModal(true);
  };

  const confirmAddToCart = () => {
    if (!selectedMenuItem) return;

    // Calculate item total
    let itemPrice = selectedMenuItem.price;
    if (tempCustomizations && selectedMenuItem.customizations) {
      Object.entries(tempCustomizations).forEach(([custName, selectedOption]) => {
        const customization = selectedMenuItem.customizations?.find(c => c.name === custName);
        const option = customization?.options.find(o => o.label === selectedOption);
        if (option) itemPrice += option.price;
      });
    }

    const cartItem: CartItem = {
      ...selectedMenuItem,
      quantity: tempQuantity,
      selectedCustomizations: tempCustomizations,
      specialInstructions: tempInstructions,
      itemTotal: itemPrice * tempQuantity
    };

    setCart(prev => [...prev, cartItem]);
    setShowItemModal(false);
    setSelectedMenuItem(null);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const updateCartItemQuantity = (index: number, newQty: number) => {
    if (newQty < 1) {
      removeFromCart(index);
      return;
    }
    setCart(prev => prev.map((item, i) => {
      if (i === index) {
        const basePrice = item.itemTotal / item.quantity;
        return {  
          ...item,
          quantity: newQty,
          itemTotal: basePrice * newQty
        };
      }
      return item;
    }));
  };

  const handleCheckout = async () => {
    if (!pin || pin.length !== 4) {
      toast.error('Please enter your 4-digit PIN');
      return;
    }

    if (orderType === 'delivery' && !deliveryAddress) {
      toast.error('Please enter delivery address');
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/restaurants/order`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
            items: cart,
            orderType,
            deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
            deliveryInstructions,
            subtotal: cartTotal,
            deliveryFee,
            platformFee,
            discount,
            total: finalTotal,
            pin
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setActiveView('confirmation');
      } else {
        toast.error(data.error || 'Order failed');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Order failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Menu View
  if (activeView === 'menu') {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="size-6" />
              </button>
              <div className="flex-1">
                <h1 className="font-bold text-xl">{restaurant.name}</h1>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="size-4 fill-yellow-400 text-yellow-400" />
                    <span>{restaurant.rating}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="size-4" />
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Type Toggle */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setOrderType('delivery')}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                  orderType === 'delivery'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <Truck className="size-5 inline mr-2" />
                Delivery
              </button>
              <button
                onClick={() => setOrderType('pickup')}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                  orderType === 'pickup'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <Package className="size-5 inline mr-2" />
                Pickup
              </button>
            </div>

            {/* Delivery Info Banner */}
            {orderType === 'delivery' && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                <p className="text-sm font-semibold text-green-900">
                  {restaurant.freeDelivery ? '🎉 FREE Delivery' : `Delivery: TZS ${restaurant.deliveryFee.toLocaleString()}`}
                </p>
                <p className="text-xs text-green-700">Estimated: {restaurant.deliveryTime}</p>
              </div>
            )}

            {restaurant.discount && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mt-2">
                <p className="text-sm font-bold text-red-900">{restaurant.discount}</p>
              </div>
            )}
          </div>

          {/* Category Tabs */}
          <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
            {menuCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setMenuCategory(cat.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-medium text-sm transition-all ${
                  menuCategory === cat.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-4 space-y-3">
          {filteredMenuItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="flex gap-3 p-3">
                <div className="relative w-28 h-28 flex-shrink-0">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  {item.popular && (
                    <div className="absolute top-1 left-1 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                      Popular
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-base">{item.name}</h3>
                    {item.vegetarian && <span className="text-green-600 text-xs">🌱</span>}
                    {item.spicy && <span className="text-red-500 text-xs">🌶️</span>}
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">TZS {item.price.toLocaleString()}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-1"
                    >
                      <Plus className="size-4" />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Cart Button */}
        {cart.length > 0 && (
          <div className="fixed bottom-4 left-4 right-4 z-30">
            <button
              onClick={() => setActiveView('cart')}
              className="w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-2xl shadow-2xl font-bold flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className="size-6" />
                <span>{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
              </div>
              <span>TZS {cartTotal.toLocaleString()}</span>
            </button>
          </div>
        )}

        {/* Item Customization Modal */}
        {showItemModal && selectedMenuItem && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h2 className="font-bold text-xl">Customize Your Order</h2>
                <button onClick={() => setShowItemModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="size-6" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {/* Item Image & Info */}
                <div>
                  <ImageWithFallback
                    src={selectedMenuItem.image}
                    alt={selectedMenuItem.name}
                    className="w-full h-48 object-cover rounded-xl mb-3"
                  />
                  <h3 className="font-bold text-lg mb-1">{selectedMenuItem.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{selectedMenuItem.description}</p>
                  <p className="font-bold text-lg">TZS {selectedMenuItem.price.toLocaleString()}</p>
                </div>

                {/* Customizations */}
                {selectedMenuItem.customizations && selectedMenuItem.customizations.map((customization) => (
                  <div key={customization.name}>
                    <label className="block font-bold mb-2">
                      {customization.name} {customization.required && <span className="text-red-500">*</span>}
                    </label>
                    <div className="space-y-2">
                      {customization.options.map((option) => (
                        <button
                          key={option.label}
                          onClick={() => setTempCustomizations(prev => ({
                            ...prev,
                            [customization.name]: option.label
                          }))}
                          className={`w-full p-3 rounded-xl border-2 text-left flex items-center justify-between ${
                            tempCustomizations[customization.name] === option.label
                              ? 'border-green-600 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span className="font-medium">{option.label}</span>
                          {option.price > 0 && (
                            <span className="text-sm text-gray-600">+TZS {option.price.toLocaleString()}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Special Instructions */}
                <div>
                  <label className="block font-bold mb-2">Special Instructions (Optional)</label>
                  <textarea
                    value={tempInstructions}
                    onChange={(e) => setTempInstructions(e.target.value)}
                    placeholder="e.g., No onions, extra spicy..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none resize-none"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block font-bold mb-2">Quantity</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setTempQuantity(Math.max(1, tempQuantity - 1))}
                      className="w-12 h-12 bg-gray-100 rounded-full font-bold hover:bg-gray-200"
                    >
                      <Minus className="size-5 mx-auto" />
                    </button>
                    <span className="text-2xl font-bold flex-1 text-center">{tempQuantity}</span>
                    <button
                      onClick={() => setTempQuantity(tempQuantity + 1)}
                      className="w-12 h-12 bg-gray-100 rounded-full font-bold hover:bg-gray-200"
                    >
                      <Plus className="size-5 mx-auto" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={confirmAddToCart}
                  className="w-full h-14 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold text-lg"
                  disabled={selectedMenuItem.customizations?.some(c => c.required && !tempCustomizations[c.name])}
                >
                  Add to Cart - TZS {((selectedMenuItem.price + 
                    Object.entries(tempCustomizations).reduce((sum, [custName, selectedOption]) => {
                      const customization = selectedMenuItem.customizations?.find(c => c.name === custName);
                      const option = customization?.options.find(o => o.label === selectedOption);
                      return sum + (option?.price || 0);
                    }, 0)) * tempQuantity).toLocaleString()}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Cart View
  if (activeView === 'cart') {
    return (
      <div className="min-h-screen bg-white pb-24">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveView('menu')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="font-bold text-xl">Your Cart</h1>
            <span className="ml-auto text-sm text-gray-600">{cart.length} items</span>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingCart className="size-20 text-gray-300 mb-4" />
            <h2 className="font-bold text-xl mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some delicious items from the menu!</p>
            <Button
              onClick={() => setActiveView('menu')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-bold"
            >
              Browse Menu
            </Button>
          </div>
        ) : (
          <div className="p-4 space-y-6">
            {/* Cart Items */}
            <div className="space-y-3">
              {cart.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex gap-3 mb-3">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold mb-1">{item.name}</h3>
                      {item.selectedCustomizations && Object.keys(item.selectedCustomizations).length > 0 && (
                        <p className="text-sm text-gray-600 mb-1">
                          {Object.entries(item.selectedCustomizations).map(([key, value]) => `${value}`).join(', ')}
                        </p>
                      )}
                      {item.specialInstructions && (
                        <p className="text-xs text-gray-500 italic">Note: {item.specialInstructions}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromCart(index)}
                      className="p-2 hover:bg-gray-200 rounded-full h-fit"
                    >
                      <X className="size-5 text-gray-600" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateCartItemQuantity(index, item.quantity - 1)}
                        className="w-8 h-8 bg-white rounded-full font-bold hover:bg-gray-100"
                      >
                        <Minus className="size-4 mx-auto" />
                      </button>
                      <span className="font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateCartItemQuantity(index, item.quantity + 1)}
                        className="w-8 h-8 bg-white rounded-full font-bold hover:bg-gray-100"
                      >
                        <Plus className="size-4 mx-auto" />
                      </button>
                    </div>
                    <span className="font-bold">TZS {item.itemTotal.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
              <h3 className="font-bold">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">TZS {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-semibold">
                    {deliveryFee === 0 ? 'FREE' : `TZS ${deliveryFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Fee (15%)</span>
                  <span className="font-semibold">TZS {platformFee.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">-TZS {discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-gray-300 pt-2 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>TZS {finalTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              onClick={() => setActiveView('checkout')}
              className="w-full h-14 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold text-lg"
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Checkout View
  if (activeView === 'checkout') {
    return (
      <div className="min-h-screen bg-white pb-24">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveView('cart')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="font-bold text-xl">Checkout</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Order Type */}
          <div>
            <h3 className="font-bold mb-3">Order Type</h3>
            <div className="flex gap-3">
              <button
                onClick={() => setOrderType('delivery')}
                className={`flex-1 p-4 rounded-xl border-2 ${
                  orderType === 'delivery'
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Truck className="size-6 mx-auto mb-2 text-green-600" />
                <p className="font-semibold text-sm">Delivery</p>
                <p className="text-xs text-gray-600">{restaurant.deliveryTime}</p>
              </button>
              <button
                onClick={() => setOrderType('pickup')}
                className={`flex-1 p-4 rounded-xl border-2 ${
                  orderType === 'pickup'
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Package className="size-6 mx-auto mb-2 text-green-600" />
                <p className="font-semibold text-sm">Pickup</p>
                <p className="text-xs text-gray-600">Ready in 20 min</p>
              </button>
            </div>
          </div>

          {/* Delivery Address */}
          {orderType === 'delivery' && (
            <>
              <div>
                <label className="block font-bold mb-2">Delivery Address</label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter your full address"
                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-2">Delivery Instructions (Optional)</label>
                <textarea
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  placeholder="e.g., Ring doorbell, Leave at gate..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none resize-none"
                />
              </div>
            </>
          )}

          {/* Order Summary */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
            <h3 className="font-bold mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-700">Subtotal</span>
                <span className="font-semibold">TZS {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Delivery Fee</span>
                <span className="font-semibold">
                  {deliveryFee === 0 ? 'FREE' : `TZS ${deliveryFee.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Platform Fee (15%)</span>
                <span className="font-semibold">TZS {platformFee.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Discount</span>
                  <span className="font-semibold">-TZS {discount.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t border-green-200 pt-2 flex justify-between font-bold text-base">
                <span>Total Amount</span>
                <span className="text-green-700">TZS {finalTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-white/50 rounded-xl p-3">
              <p className="text-xs text-gray-700">
                ✓ Payment via goPay Wallet • ✓ Earn GOrewards Points • ✓ 15% platform fee
              </p>
            </div>
          </div>

          {/* PIN Entry */}
          <div>
            <label className="block font-bold mb-2">Enter PIN to Confirm Order</label>
            <input
              type="password"
              maxLength={4}
              placeholder="4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full h-14 text-center text-2xl tracking-widest border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
            />
          </div>

          {/* Place Order Button */}
          <Button
            onClick={handleCheckout}
            disabled={processing || pin.length !== 4 || (orderType === 'delivery' && !deliveryAddress)}
            className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full font-bold text-lg disabled:opacity-50"
          >
            {processing ? 'Processing...' : `Place Order - TZS ${finalTotal.toLocaleString()}`}
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
        <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 mb-6">
          {orderType === 'delivery' 
            ? `Your food will be delivered in ${restaurant.deliveryTime}`
            : 'Your order will be ready for pickup in 20 minutes'}
        </p>

        <div className="bg-gray-50 rounded-2xl p-6 mb-6 text-left space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Order ID</span>
            <span className="font-bold">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Restaurant</span>
            <span className="font-bold">{restaurant.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Items</span>
            <span className="font-semibold">{cart.length} items</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Order Type</span>
            <span className="font-semibold capitalize">{orderType}</span>
          </div>
          {orderType === 'delivery' && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Delivery To</span>
              <span className="font-semibold text-sm text-right max-w-[60%]">{deliveryAddress}</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <span className="text-sm text-gray-600">Total Paid</span>
            <span className="font-bold text-green-600">TZS {finalTotal.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-sm font-semibold text-green-900 mb-1">
            📱 Order tracking sent via SMS
          </p>
          <p className="text-xs text-green-700">
            {orderType === 'delivery' 
              ? 'Track your delivery in real-time. You will receive updates as your order progresses.'
              : 'You will receive a notification when your order is ready for pickup.'}
          </p>
        </div>

        <Button
          onClick={onOrderComplete}
          className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full font-bold mb-3"
        >
          Track Order
        </Button>
        
        <Button
          onClick={onBack}
          className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full font-bold"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}
