/**
 * FOOD DELIVERY MODULE - COMPONENTS
 * 
 * Restaurant browsing, ordering, and delivery tracking
 * Inspired by: UberEats, DoorDash, Zomato, Swiggy
 */

import { ReactNode } from 'react';
import { 
  Clock, 
  Star, 
  MapPin, 
  Bike,
  ChevronRight,
  Heart,
  Search,
  Filter,
  ShoppingCart,
  Minus,
  Plus,
  X,
  Check,
  Phone,
  MessageCircle,
  Navigation
} from 'lucide-react';

// ==========================================
// RESTAURANT CARD COMPONENT
// ==========================================
interface RestaurantCardProps {
  id: string;
  name: string;
  image: string;
  cuisine: string[];
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  isOpen: boolean;
  distance: string;
  offers?: string;
  isFavorite?: boolean;
  onClick: () => void;
  onToggleFavorite: () => void;
}

export function RestaurantCard({
  name,
  image,
  cuisine,
  rating,
  reviewCount,
  deliveryTime,
  deliveryFee,
  minOrder,
  isOpen,
  distance,
  offers,
  isFavorite,
  onClick,
  onToggleFavorite
}: RestaurantCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-emerald-500 hover:shadow-lg transition-all active:scale-[0.99] text-left"
    >
      {/* Image Section */}
      <div className="relative h-40 overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover"
        />
        
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="absolute top-3 right-3 size-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all"
        >
          <Heart 
            className={`size-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`}
          />
        </button>
        
        {/* Offer Badge */}
        {offers && (
          <div className="absolute bottom-3 left-3 bg-emerald-600 text-white px-3 py-1 rounded-lg text-xs font-bold">
            {offers}
          </div>
        )}
        
        {/* Closed Overlay */}
        {!isOpen && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-white px-4 py-2 rounded-lg">
              <p className="text-sm font-bold text-gray-900">Imefungwa</p>
              <p className="text-xs text-gray-700">Closed Now</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-card-title mb-1">{name}</h3>
            <p className="text-xs text-gray-600 font-medium">
              {cuisine.join(' • ')}
            </p>
          </div>
        </div>
        
        {/* Stats Row */}
        <div className="flex items-center gap-4 text-xs text-gray-700 font-semibold mb-3">
          <div className="flex items-center gap-1">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            <span className="font-bold text-gray-900">{rating}</span>
            <span>({reviewCount})</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="size-4" />
            <span>{deliveryTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="size-4" />
            <span>{distance}</span>
          </div>
        </div>
        
        {/* Delivery Info */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <Bike className="size-4 text-emerald-600" />
            <span className="text-xs font-bold text-gray-900">
              TZS {deliveryFee.toLocaleString()}
            </span>
          </div>
          <div className="text-xs text-gray-700 font-semibold">
            Min: TZS {minOrder.toLocaleString()}
          </div>
        </div>
      </div>
    </button>
  );
}

// ==========================================
// MENU ITEM COMPONENT
// ==========================================
interface MenuItemProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  isPopular?: boolean;
  quantity?: number;
  onAdd: () => void;
  onRemove: () => void;
}

export function MenuItem({
  name,
  description,
  price,
  image,
  isVegetarian,
  isSpicy,
  isPopular,
  quantity = 0,
  onAdd,
  onRemove
}: MenuItemProps) {
  return (
    <div className="bg-white rounded-2xl p-4 border-2 border-gray-200">
      <div className="flex gap-4">
        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start gap-2 mb-2">
            <div className="flex-1">
              <h4 className="text-card-title mb-1">{name}</h4>
              {isPopular && (
                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-0.5 rounded-lg text-xs font-bold mb-1">
                  <Star className="size-3 fill-amber-600" />
                  Popular
                </span>
              )}
            </div>
            <div className="flex gap-1">
              {isVegetarian && (
                <div className="size-5 bg-green-100 rounded-sm flex items-center justify-center">
                  <div className="size-2 bg-green-600 rounded-full" />
                </div>
              )}
              {isSpicy && (
                <span className="text-red-500 text-xs">🌶️</span>
              )}
            </div>
          </div>
          
          <p className="text-secondary-body mb-3 line-clamp-2">
            {description}
          </p>
          
          <p className="text-lg font-black text-gray-900">
            TZS {price.toLocaleString()}
          </p>
        </div>
        
        {/* Image */}
        {image && (
          <div className="relative">
            <img 
              src={image} 
              alt={name}
              className="size-24 object-cover rounded-xl"
            />
          </div>
        )}
      </div>
      
      {/* Add/Remove Controls */}
      <div className="mt-4 flex justify-end">
        {quantity === 0 ? (
          <button
            onClick={onAdd}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all active:scale-95"
          >
            Ongeza / Add
          </button>
        ) : (
          <div className="flex items-center gap-3 bg-emerald-50 border-2 border-emerald-600 rounded-xl px-2 py-1">
            <button
              onClick={onRemove}
              className="size-8 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100 transition-all"
            >
              <Minus className="size-4 text-emerald-700" />
            </button>
            <span className="text-lg font-black text-emerald-700 min-w-[24px] text-center">
              {quantity}
            </span>
            <button
              onClick={onAdd}
              className="size-8 bg-emerald-600 rounded-lg flex items-center justify-center hover:bg-emerald-700 transition-all"
            >
              <Plus className="size-4 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// CART SUMMARY (FLOATING BOTTOM)
// ==========================================
interface CartSummaryProps {
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  onViewCart: () => void;
}

export function CartSummary({ itemCount, subtotal, deliveryFee, onViewCart }: CartSummaryProps) {
  const total = subtotal + deliveryFee;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-emerald-600 p-4 shadow-2xl z-50">
      <button
        onClick={onViewCart}
        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl p-4 flex items-center justify-between transition-all active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="size-10 bg-white/20 rounded-xl flex items-center justify-center">
            <ShoppingCart className="size-5" />
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold opacity-90">
              {itemCount} item{itemCount > 1 ? 's' : ''}
            </p>
            <p className="text-lg font-black">
              TZS {total.toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">Angalia Mkokoteni</span>
          <ChevronRight className="size-5" />
        </div>
      </button>
    </div>
  );
}

// ==========================================
// ORDER TRACKING COMPONENT
// ==========================================
interface OrderTrackingProps {
  orderId: string;
  status: 'confirmed' | 'preparing' | 'ready' | 'picked-up' | 'on-the-way' | 'delivered';
  restaurant: {
    name: string;
    image: string;
  };
  driver?: {
    name: string;
    phone: string;
    photo: string;
    vehicle: string;
    plateNumber: string;
    rating: number;
  };
  estimatedTime: number; // minutes
  onContactDriver: () => void;
  onContactRestaurant: () => void;
}

export function OrderTracking({
  orderId,
  status,
  restaurant,
  driver,
  estimatedTime,
  onContactDriver,
  onContactRestaurant
}: OrderTrackingProps) {
  const steps = [
    { key: 'confirmed', label: 'Order Confirmed', swahili: 'Imethibitishwa' },
    { key: 'preparing', label: 'Preparing', swahili: 'Inaandaliwa' },
    { key: 'ready', label: 'Ready', swahili: 'Imeiva' },
    { key: 'picked-up', label: 'Picked Up', swahili: 'Imechukuliwa' },
    { key: 'on-the-way', label: 'On the Way', swahili: 'Njiani' },
    { key: 'delivered', label: 'Delivered', swahili: 'Imefika' }
  ];
  
  const currentStepIndex = steps.findIndex(s => s.key === status);
  
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 text-white">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold opacity-90">Order ID</p>
          <p className="text-xs font-mono bg-white/20 px-3 py-1 rounded-lg">
            {orderId}
          </p>
        </div>
        <h2 className="text-page-title mb-1">{restaurant.name}</h2>
        <div className="flex items-center gap-2">
          <Clock className="size-4" />
          <p className="text-sm font-bold">
            Arrives in {estimatedTime} min
          </p>
        </div>
      </div>
      
      {/* Progress Steps */}
      <div className="p-5">
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            
            return (
              <div key={step.key} className="flex items-center gap-4">
                {/* Icon */}
                <div className={`size-10 rounded-full flex items-center justify-center border-2 ${
                  isCompleted 
                    ? 'bg-emerald-600 border-emerald-600' 
                    : 'bg-gray-100 border-gray-300'
                }`}>
                  {isCompleted ? (
                    <Check className="size-5 text-white" />
                  ) : (
                    <div className="size-2 bg-gray-400 rounded-full" />
                  )}
                </div>
                
                {/* Label */}
                <div className="flex-1">
                  <p className={`text-sm font-bold ${
                    isCurrent ? 'text-emerald-700' : isCompleted ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.swahili}
                  </p>
                  <p className={`text-xs ${
                    isCurrent ? 'text-emerald-600' : isCompleted ? 'text-gray-700' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </p>
                </div>
                
                {/* Time (for current step) */}
                {isCurrent && (
                  <div className="flex items-center gap-1 text-emerald-700">
                    <div className="size-2 bg-emerald-600 rounded-full animate-pulse" />
                    <span className="text-xs font-bold">Live</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Driver Info (if assigned) */}
      {driver && status !== 'confirmed' && status !== 'preparing' && (
        <div className="border-t-2 border-gray-200 p-5">
          <div className="flex items-center gap-4 mb-4">
            <img 
              src={driver.photo} 
              alt={driver.name}
              className="size-16 rounded-full object-cover border-2 border-emerald-600"
            />
            <div className="flex-1">
              <h3 className="text-card-title mb-1">{driver.name}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-700 font-semibold">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                <span className="font-bold text-gray-900">{driver.rating}</span>
                <span>•</span>
                <span>{driver.vehicle}</span>
                <span>•</span>
                <span className="font-mono">{driver.plateNumber}</span>
              </div>
            </div>
          </div>
          
          {/* Contact Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onContactDriver}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all"
            >
              <Phone className="size-4" />
              Call Driver
            </button>
            <button
              onClick={onContactDriver}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all"
            >
              <MessageCircle className="size-4" />
              Chat
            </button>
          </div>
        </div>
      )}
      
      {/* Restaurant Contact */}
      <div className="border-t border-gray-200 p-4">
        <button
          onClick={onContactRestaurant}
          className="w-full text-emerald-700 hover:text-emerald-800 text-sm font-bold flex items-center justify-center gap-2"
        >
          <Phone className="size-4" />
          Contact Restaurant
        </button>
      </div>
    </div>
  );
}

// ==========================================
// SEARCH & FILTER BAR
// ==========================================
interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilters: string[];
  onToggleFilter: (filter: string) => void;
}

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  activeFilters,
  onToggleFilter
}: SearchFilterBarProps) {
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'fast', label: '⚡ Fast Delivery' },
    { id: 'offers', label: '🎁 Offers' },
    { id: 'top-rated', label: '⭐ Top Rated' },
    { id: 'veg', label: '🥗 Vegetarian' }
  ];
  
  return (
    <div className="bg-white border-b-2 border-gray-200 p-4 sticky top-0 z-20">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tafuta chakula au mkahawa..."
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-medium focus:border-emerald-600 focus:outline-none"
        />
      </div>
      
      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => onToggleFilter(filter.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeFilters.includes(filter.id)
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
