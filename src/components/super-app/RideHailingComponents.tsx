/**
 * RIDE-HAILING MODULE - COMPONENTS
 * 
 * Book rides, track drivers, manage trips
 * Inspired by: Uber, Grab, Bolt, Careem
 */

import { ReactNode, useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Star,
  Phone,
  MessageCircle,
  Car,
  Bike,
  Users,
  Package,
  ChevronDown,
  AlertCircle,
  Check,
  User,
  Calendar,
  Shield,
  Heart
} from 'lucide-react';

// ==========================================
// VEHICLE TYPE SELECTOR
// ==========================================
interface VehicleTypeProps {
  type: 'car' | 'boda' | 'share' | 'delivery';
  name: string;
  capacity: string;
  estimatedTime: string;
  price: number;
  surgeMultiplier?: number;
  isSelected: boolean;
  onSelect: () => void;
}

export function VehicleType({
  type,
  name,
  capacity,
  estimatedTime,
  price,
  surgeMultiplier = 1,
  isSelected,
  onSelect
}: VehicleTypeProps) {
  const icons = {
    car: <Car className="size-8" />,
    boda: <Bike className="size-8" />,
    share: <Users className="size-8" />,
    delivery: <Package className="size-8" />
  };
  
  const isSurge = surgeMultiplier > 1;
  const finalPrice = price * surgeMultiplier;
  
  return (
    <button
      onClick={onSelect}
      className={`w-full bg-white border-2 rounded-2xl p-4 transition-all ${
        isSelected 
          ? 'border-emerald-600 shadow-lg' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className={`size-16 rounded-2xl flex items-center justify-center ${
          isSelected 
            ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white' 
            : 'bg-gray-100 text-gray-700'
        }`}>
          {icons[type]}
        </div>
        
        {/* Info */}
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-card-title">{name}</h3>
            {isSurge && (
              <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-lg text-xs font-bold">
                {surgeMultiplier}x
              </span>
            )}
          </div>
          <p className="text-xs text-gray-700 font-semibold mb-1">
            {capacity}
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-600 font-medium">
            <Clock className="size-3" />
            <span>{estimatedTime}</span>
          </div>
        </div>
        
        {/* Price */}
        <div className="text-right">
          <p className="text-lg font-black text-gray-900">
            TZS {finalPrice.toLocaleString()}
          </p>
          {isSurge && price !== finalPrice && (
            <p className="text-xs text-gray-500 line-through">
              TZS {price.toLocaleString()}
            </p>
          )}
        </div>
      </div>
      
      {/* Selected Indicator */}
      {isSelected && (
        <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-center gap-2 text-emerald-700">
          <Check className="size-4" />
          <span className="text-xs font-bold">Selected</span>
        </div>
      )}
    </button>
  );
}

// ==========================================
// LOCATION PICKER
// ==========================================
interface LocationPickerProps {
  type: 'pickup' | 'destination';
  value: string;
  onChange: (value: string) => void;
  onSelectFromMap: () => void;
  suggestions?: string[];
}

export function LocationPicker({
  type,
  value,
  onChange,
  onSelectFromMap,
  suggestions = []
}: LocationPickerProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const isPickup = type === 'pickup';
  
  return (
    <div className="relative">
      <div className={`bg-white border-2 rounded-2xl p-4 ${
        isPickup ? 'border-emerald-600' : 'border-gray-200'
      }`}>
        <div className="flex items-center gap-3">
          {/* Dot Indicator */}
          <div className={`size-4 rounded-full flex-shrink-0 ${
            isPickup ? 'bg-emerald-600' : 'bg-red-600'
          }`} />
          
          {/* Input */}
          <div className="flex-1">
            <label className="text-xs font-bold text-gray-700 mb-1 block">
              {isPickup ? 'Pickup Location' : 'Destination'}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder={isPickup ? 'Where are you?' : 'Where to?'}
              className="w-full text-sm font-bold text-gray-900 outline-none bg-transparent"
            />
          </div>
          
          {/* Map Button */}
          <button
            onClick={onSelectFromMap}
            className="size-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all"
          >
            <MapPin className="size-5 text-gray-700" />
          </button>
        </div>
      </div>
      
      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-lg overflow-hidden z-10">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                onChange(suggestion);
                setShowSuggestions(false);
              }}
              className="w-full p-4 hover:bg-gray-50 transition-all text-left border-b border-gray-100 last:border-0"
            >
              <div className="flex items-center gap-3">
                <MapPin className="size-5 text-gray-500" />
                <span className="text-sm font-semibold text-gray-900">
                  {suggestion}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// FARE BREAKDOWN
// ==========================================
interface FareBreakdownProps {
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  serviceFee: number;
  surge: number;
  discount?: number;
  promoCode?: string;
  total: number;
}

export function FareBreakdown({
  baseFare,
  distanceFare,
  timeFare,
  serviceFee,
  surge,
  discount,
  promoCode,
  total
}: FareBreakdownProps) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-5">
      <h3 className="text-section-header mb-4">Fare Breakdown</h3>
      
      <div className="space-y-3">
        {/* Base Fare */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-700 font-semibold">Base Fare</span>
          <span className="font-bold text-gray-900">
            TZS {baseFare.toLocaleString()}
          </span>
        </div>
        
        {/* Distance */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-700 font-semibold">Distance (5.2 km)</span>
          <span className="font-bold text-gray-900">
            TZS {distanceFare.toLocaleString()}
          </span>
        </div>
        
        {/* Time */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-700 font-semibold">Time (12 min)</span>
          <span className="font-bold text-gray-900">
            TZS {timeFare.toLocaleString()}
          </span>
        </div>
        
        {/* Service Fee */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-700 font-semibold">Service Fee</span>
          <span className="font-bold text-gray-900">
            TZS {serviceFee.toLocaleString()}
          </span>
        </div>
        
        {/* Surge */}
        {surge > 0 && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-red-700 font-semibold">Surge Pricing</span>
              <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold">
                High Demand
              </span>
            </div>
            <span className="font-bold text-red-700">
              +TZS {surge.toLocaleString()}
            </span>
          </div>
        )}
        
        {/* Discount */}
        {discount && discount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-emerald-700 font-semibold">Discount</span>
              {promoCode && (
                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold">
                  {promoCode}
                </span>
              )}
            </div>
            <span className="font-bold text-emerald-700">
              -TZS {discount.toLocaleString()}
            </span>
          </div>
        )}
        
        {/* Divider */}
        <div className="border-t-2 border-gray-200 my-3" />
        
        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-black text-gray-900">Total</span>
          <span className="text-2xl font-black text-emerald-600">
            TZS {total.toLocaleString()}
          </span>
        </div>
      </div>
      
      {/* Payment Method */}
      <div className="mt-4 p-3 bg-gray-50 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">gP</span>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">goPay Wallet</p>
              <p className="text-xs text-gray-600">
                Balance: TZS 450,000
              </p>
            </div>
          </div>
          <button className="text-xs text-emerald-700 font-bold">
            Change
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// DRIVER CARD (During Ride)
// ==========================================
interface DriverCardProps {
  driver: {
    name: string;
    photo: string;
    rating: number;
    tripCount: number;
    phone: string;
    vehicle: {
      make: string;
      model: string;
      color: string;
      plateNumber: string;
    };
  };
  eta: number; // minutes
  distance: number; // meters
  onCall: () => void;
  onMessage: () => void;
}

export function DriverCard({ driver, eta, distance, onCall, onMessage }: DriverCardProps) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden">
      {/* ETA Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold opacity-90">Arriving in</p>
            <p className="text-2xl font-black">{eta} min</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold opacity-90">Distance</p>
            <p className="text-xl font-black">
              {distance >= 1000 
                ? `${(distance / 1000).toFixed(1)} km` 
                : `${distance} m`}
            </p>
          </div>
        </div>
      </div>
      
      {/* Driver Info */}
      <div className="p-5">
        <div className="flex items-center gap-4 mb-4">
          {/* Photo */}
          <img 
            src={driver.photo} 
            alt={driver.name}
            className="size-20 rounded-2xl object-cover border-2 border-emerald-600"
          />
          
          {/* Info */}
          <div className="flex-1">
            <h3 className="text-card-title mb-1">{driver.name}</h3>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-gray-900">
                  {driver.rating}
                </span>
              </div>
              <span className="text-xs text-gray-600">•</span>
              <span className="text-xs text-gray-700 font-semibold">
                {driver.tripCount} trips
              </span>
            </div>
            
            {/* Vehicle */}
            <div className="bg-gray-50 px-3 py-1.5 rounded-lg inline-block">
              <p className="text-xs font-bold text-gray-900">
                {driver.vehicle.color} {driver.vehicle.make} {driver.vehicle.model}
              </p>
              <p className="text-xs font-mono font-bold text-gray-700">
                {driver.vehicle.plateNumber}
              </p>
            </div>
          </div>
        </div>
        
        {/* Contact Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCall}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all"
          >
            <Phone className="size-5" />
            Call
          </button>
          <button
            onClick={onMessage}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all"
          >
            <MessageCircle className="size-5" />
            Message
          </button>
        </div>
        
        {/* Safety */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center gap-2">
            <Shield className="size-5 text-blue-700" />
            <div className="flex-1">
              <p className="text-xs font-bold text-blue-900">Trip Protected</p>
              <p className="text-xs text-blue-700">
                Share ride status with friends & family
              </p>
            </div>
            <button className="text-xs text-blue-700 font-bold">
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// TRIP HISTORY ITEM
// ==========================================
interface TripHistoryItemProps {
  id: string;
  date: string;
  pickup: string;
  destination: string;
  driver: {
    name: string;
    photo: string;
  };
  fare: number;
  distance: string;
  duration: string;
  status: 'completed' | 'cancelled';
  onClick: () => void;
  onRebook: () => void;
}

export function TripHistoryItem({
  date,
  pickup,
  destination,
  driver,
  fare,
  distance,
  duration,
  status,
  onClick,
  onRebook
}: TripHistoryItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white border-2 border-gray-200 hover:border-emerald-500 rounded-2xl p-4 transition-all text-left"
    >
      {/* Date & Status */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-gray-700">{date}</p>
        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
          status === 'completed' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {status === 'completed' ? 'Completed' : 'Cancelled'}
        </span>
      </div>
      
      {/* Route */}
      <div className="space-y-2 mb-3">
        <div className="flex items-start gap-3">
          <div className="size-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0" />
          <p className="text-sm font-bold text-gray-900">{pickup}</p>
        </div>
        <div className="flex items-start gap-3">
          <div className="size-2 bg-red-600 rounded-full mt-2 flex-shrink-0" />
          <p className="text-sm font-bold text-gray-900">{destination}</p>
        </div>
      </div>
      
      {/* Driver & Stats */}
      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200">
        <img 
          src={driver.photo} 
          alt={driver.name}
          className="size-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="text-xs font-bold text-gray-900">{driver.name}</p>
          <p className="text-xs text-gray-600">
            {distance} • {duration}
          </p>
        </div>
        <p className="text-lg font-black text-gray-900">
          TZS {fare.toLocaleString()}
        </p>
      </div>
      
      {/* Rebook Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRebook();
        }}
        className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2 rounded-xl text-sm font-bold transition-all"
      >
        Rebook This Trip
      </button>
    </button>
  );
}

// ==========================================
// SCHEDULE RIDE OPTION
// ==========================================
interface ScheduleRideProps {
  selectedDate: string;
  selectedTime: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}

export function ScheduleRide({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange
}: ScheduleRideProps) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-5">
      <h3 className="text-card-title mb-4">Schedule for Later</h3>
      
      <div className="space-y-4">
        {/* Date Picker */}
        <div>
          <label className="text-xs font-bold text-gray-700 mb-2 block">
            Select Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>
        </div>
        
        {/* Time Picker */}
        <div>
          <label className="text-xs font-bold text-gray-700 mb-2 block">
            Select Time
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => onTimeChange(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>
        </div>
        
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
          <div className="flex gap-2">
            <AlertCircle className="size-5 text-blue-700 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-blue-900 mb-1">
                Scheduled Rides
              </p>
              <p className="text-xs text-blue-700 leading-relaxed">
                Driver will be assigned 15 minutes before your scheduled time. 
                Cancellation fee applies if cancelled within 1 hour.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
