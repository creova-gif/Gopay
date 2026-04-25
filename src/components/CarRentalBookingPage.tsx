import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { 
  ArrowLeft, Car, Calendar, MapPin, Users, Check, Star, Shield,
  Fuel, Settings as SettingsIcon, Clock, Info, AlertCircle, X, Phone
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { projectId } from '../utils/supabase/info';

interface Vehicle {
  id: string;
  name: string;
  brand: string;
  category: string;
  year: number;
  seats: number;
  transmission: string;
  fuelType: string;
  image: string;
  pricePerDay: number;
  features: string[];
  rating: number;
  trips: number;
  rentalCompany: string;
  location: string;
}

interface Props {
  vehicle: Vehicle;
  pickupDate: string;
  dropoffDate: string;
  pickupLocation: string;
  accessToken: string;
  onBack: () => void;
  onBookingComplete: () => void;
}

export function CarRentalBookingPage({ vehicle, pickupDate, dropoffDate, pickupLocation, accessToken, onBack, onBookingComplete }: Props) {
  const [activeStep, setActiveStep] = useState<'details' | 'extras' | 'payment' | 'confirmation'>('details');
  
  // Booking details
  const [dropoffLocation, setDropoffLocation] = useState(pickupLocation);
  const [withDriver, setWithDriver] = useState(false);
  const [driverName, setDriverName] = useState('');
  const [driverLicense, setDriverLicense] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  
  // Extras
  const [insurance, setInsurance] = useState<'basic' | 'premium' | 'comprehensive'>('basic');
  const [extras, setExtras] = useState<{[key: string]: boolean}>({
    gps: false,
    childSeat: false,
    wifi: false,
    dashcam: false
  });

  const [pin, setPin] = useState('');
  const [processing, setProcessing] = useState(false);
  const [bookingReference, setBookingReference] = useState('');

  const insuranceOptions = [
    { 
      id: 'basic', 
      name: 'Basic Coverage', 
      description: 'Covers vehicle damage & third party liability',
      price: 15000,
      coverage: ['Vehicle Damage', 'Third Party Liability', '24/7 Roadside Assistance']
    },
    { 
      id: 'premium', 
      name: 'Premium Protection', 
      description: 'Includes theft protection & reduced excess',
      price: 25000,
      coverage: ['All Basic Coverage', 'Theft Protection', 'Reduced Excess', 'Personal Accident Cover']
    },
    { 
      id: 'comprehensive', 
      name: 'Comprehensive Cover', 
      description: 'Full protection with zero excess',
      price: 40000,
      coverage: ['All Premium Coverage', 'Zero Excess', 'Windscreen & Tires', 'Interior Damage', 'Lost Keys']
    }
  ];

  const extraOptions = [
    { id: 'gps', name: 'GPS Navigation', price: 8000, icon: MapPin },
    { id: 'childSeat', name: 'Child Safety Seat', price: 5000, icon: Shield },
    { id: 'wifi', name: 'Portable WiFi Hotspot', price: 10000, icon: Phone },
    { id: 'dashcam', name: 'Dashcam', price: 7000, icon: Car }
  ];

  const calculateDays = () => {
    const start = new Date(pickupDate);
    const end = new Date(dropoffDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const days = calculateDays();
    const rentalCost = vehicle.pricePerDay * days;
    const driverCost = withDriver ? 50000 * days : 0;
    const insuranceCost = (insuranceOptions.find(i => i.id === insurance)?.price || 0) * days;
    const extrasTotal = Object.entries(extras)
      .filter(([_, selected]) => selected)
      .reduce((sum, [id]) => {
        const extra = extraOptions.find(e => e.id === id);
        return sum + (extra?.price || 0) * days;
      }, 0);
    const platformFee = Math.round((rentalCost + driverCost + insuranceCost + extrasTotal) * 0.15);
    return { rentalCost, driverCost, insuranceCost, extrasTotal, platformFee, total: rentalCost + driverCost + insuranceCost + extrasTotal + platformFee, days };
  };

  const handleBooking = async () => {
    if (!pin || pin.length !== 4) {
      toast.error('Please enter your 4-digit PIN');
      return;
    }

    if (withDriver && (!driverName || !driverLicense || !driverPhone)) {
      toast.error('Please fill in driver details');
      return;
    }

    setProcessing(true);
    try {
      const costs = calculateTotal();
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/cars/book`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            vehicleId: vehicle.id,
            vehicleName: vehicle.name,
            pickupLocation,
            dropoffLocation,
            pickupDate,
            dropoffDate,
            days: costs.days,
            withDriver,
            driverDetails: withDriver ? { name: driverName, license: driverLicense, phone: driverPhone } : null,
            insurance,
            extras: Object.entries(extras).filter(([_, v]) => v).map(([k]) => k),
            rentalCost: costs.rentalCost,
            driverCost: costs.driverCost,
            insuranceCost: costs.insuranceCost,
            extrasTotal: costs.extrasTotal,
            platformFee: costs.platformFee,
            total: costs.total,
            pin
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setBookingReference(data.bookingReference);
        setActiveStep('confirmation');
      } else {
        toast.error(data.error || 'Booking failed');
      }
    } catch (error) {
      console.error('Error booking vehicle:', error);
      toast.error('Booking failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const costs = calculateTotal();

  // Booking Details Step
  if (activeStep === 'details') {
    return (
      <div className="min-h-screen bg-white pb-24">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-20">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="font-bold text-xl">Booking Details</h1>
              <p className="text-sm text-gray-600">Step 1 of 3</p>
            </div>
          </div>

          {/* Vehicle Summary */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <div className="flex gap-3">
              <ImageWithFallback
                src={vehicle.image}
                alt={vehicle.name}
                className="w-24 h-20 object-cover rounded-xl"
              />
              <div>
                <h3 className="font-bold">{vehicle.name}</h3>
                <p className="text-sm text-gray-600">{vehicle.brand} {vehicle.year}</p>
                <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                  <span>{vehicle.seats} seats</span>
                  <span>•</span>
                  <span className="capitalize">{vehicle.transmission}</span>
                  <span>•</span>
                  <span className="capitalize">{vehicle.fuelType}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-green-200 flex items-center justify-between">
              <span className="text-sm text-gray-700">TZS {vehicle.pricePerDay.toLocaleString()} × {costs.days} days</span>
              <span className="font-bold text-green-700">TZS {costs.rentalCost.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Rental Period */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="font-bold mb-3">Rental Period</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Pick-up</p>
                <p className="font-semibold">{pickupDate}</p>
                <p className="text-xs text-gray-500">10:00 AM</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Drop-off</p>
                <p className="font-semibold">{dropoffDate}</p>
                <p className="text-xs text-gray-500">10:00 AM</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm"><span className="text-gray-600">Duration:</span> <span className="font-bold">{costs.days} days</span></p>
            </div>
          </div>

          {/* Locations */}
          <div>
            <label className="block font-bold mb-2">Pick-up Location</label>
            <div className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl bg-gray-50 flex items-center">
              <MapPin className="size-5 text-gray-400 mr-2" />
              <span className="text-gray-700">{pickupLocation}</span>
            </div>
          </div>

          <div>
            <label className="block font-bold mb-2">Drop-off Location</label>
            <select
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
            >
              <option value={pickupLocation}>{pickupLocation} (Same as pick-up)</option>
              <option value="Julius Nyerere International Airport">Julius Nyerere International Airport</option>
              <option value="City Centre - Dar es Salaam">City Centre - Dar es Salaam</option>
              <option value="Arusha Town Center">Arusha Town Center</option>
              <option value="Zanzibar Airport">Zanzibar Airport</option>
            </select>
            {dropoffLocation !== pickupLocation && (
              <p className="text-sm text-orange-600 mt-2">One-way rental fee: +TZS 30,000</p>
            )}
          </div>

          {/* Driver Option */}
          <div>
            <button
              onClick={() => setWithDriver(!withDriver)}
              className={`w-full p-4 rounded-2xl border-2 transition-all ${
                withDriver
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="font-bold">Include Professional Driver</p>
                  <p className="text-sm text-gray-600">TZS 50,000 per day</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  withDriver ? 'border-green-600 bg-green-600' : 'border-gray-300'
                }`}>
                  {withDriver && <Check className="size-4 text-white" />}
                </div>
              </div>
            </button>

            {withDriver && (
              <div className="mt-4 space-y-3 bg-green-50 rounded-xl p-4">
                <h4 className="font-bold text-sm">Driver Information</h4>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="Driver's Full Name"
                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                />
                <input
                  type="text"
                  value={driverLicense}
                  onChange={(e) => setDriverLicense(e.target.value)}
                  placeholder="Driver's License Number"
                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                />
                <input
                  type="tel"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  placeholder="Driver's Phone Number"
                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                />
              </div>
            )}
          </div>

          <Button
            onClick={() => setActiveStep('extras')}
            className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full font-bold text-lg"
          >
            Continue to Insurance & Extras
          </Button>
        </div>
      </div>
    );
  }

  // Insurance & Extras Step
  if (activeStep === 'extras') {
    return (
      <div className="min-h-screen bg-white pb-24">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveStep('details')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="font-bold text-xl">Insurance & Extras</h1>
              <p className="text-sm text-gray-600">Step 2 of 3</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Insurance Options */}
          <div>
            <h3 className="font-bold text-lg mb-3">Choose Insurance Coverage</h3>
            {insuranceOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setInsurance(option.id as any)}
                className={`w-full p-4 rounded-2xl border-2 mb-3 transition-all ${
                  insurance === option.id
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="text-left flex-1">
                    <h4 className="font-bold">{option.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                    <ul className="space-y-1">
                      {option.coverage.map((item, idx) => (
                        <li key={idx} className="text-xs text-gray-700 flex items-center gap-1">
                          <Check className="size-3 text-green-600" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-right ml-3">
                    <p className="font-bold text-lg">+TZS {option.price.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">per day</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Optional Extras */}
          <div>
            <h3 className="font-bold text-lg mb-3">Optional Extras</h3>
            {extraOptions.map((extra) => {
              const Icon = extra.icon;
              return (
                <button
                  key={extra.id}
                  onClick={() => setExtras(prev => ({ ...prev, [extra.id]: !prev[extra.id] }))}
                  className={`w-full p-4 rounded-xl border-2 mb-3 transition-all ${
                    extras[extra.id]
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        extras[extra.id] ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Icon className="size-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">{extra.name}</p>
                        <p className="text-sm text-gray-600">TZS {extra.price.toLocaleString()} per day</p>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      extras[extra.id] ? 'border-green-600 bg-green-600' : 'border-gray-300'
                    }`}>
                      {extras[extra.id] && <Check className="size-4 text-white" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <Button
            onClick={() => setActiveStep('payment')}
            className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full font-bold text-lg"
          >
            Continue to Payment
          </Button>
        </div>
      </div>
    );
  }

  // Payment Step
  if (activeStep === 'payment') {
    const oneWayFee = dropoffLocation !== pickupLocation ? 30000 : 0;
    const finalTotal = costs.total + oneWayFee;

    return (
      <div className="min-h-screen bg-white pb-24">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveStep('extras')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="font-bold text-xl">Payment</h1>
              <p className="text-sm text-gray-600">Step 3 of 3</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Booking Summary */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100 space-y-3">
            <h3 className="font-bold text-lg">Booking Summary</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">Vehicle Rental ({costs.days} days)</span>
                <span className="font-semibold">TZS {costs.rentalCost.toLocaleString()}</span>
              </div>
              {withDriver && (
                <div className="flex justify-between">
                  <span className="text-gray-700">Professional Driver ({costs.days} days)</span>
                  <span className="font-semibold">TZS {costs.driverCost.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-700">Insurance ({insurance})</span>
                <span className="font-semibold">TZS {costs.insuranceCost.toLocaleString()}</span>
              </div>
              {costs.extrasTotal > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-700">Optional Extras</span>
                  <span className="font-semibold">TZS {costs.extrasTotal.toLocaleString()}</span>
                </div>
              )}
              {oneWayFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-700">One-way Fee</span>
                  <span className="font-semibold">TZS {oneWayFee.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-700">Platform Fee (15%)</span>
                <span className="font-semibold">TZS {costs.platformFee.toLocaleString()}</span>
              </div>
              <div className="border-t border-green-200 pt-2 flex justify-between font-bold text-base">
                <span>Total Amount</span>
                <span className="text-green-700">TZS {finalTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Rental Details */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
            <h3 className="font-bold">Rental Details</h3>
            <div className="text-sm space-y-1">
              <p><span className="text-gray-600">Vehicle:</span> <span className="font-semibold">{vehicle.name}</span></p>
              <p><span className="text-gray-600">Pick-up:</span> <span className="font-semibold">{pickupDate} 10:00 AM</span></p>
              <p><span className="text-gray-600">Drop-off:</span> <span className="font-semibold">{dropoffDate} 10:00 AM</span></p>
              <p><span className="text-gray-600">Duration:</span> <span className="font-semibold">{costs.days} days</span></p>
              <p><span className="text-gray-600">Location:</span> <span className="font-semibold">{pickupLocation}</span></p>
              {withDriver && (
                <p><span className="text-gray-600">Driver:</span> <span className="font-semibold">{driverName}</span></p>
              )}
            </div>
          </div>

          {/* Important Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex gap-2">
              <Info className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Before you go:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Valid driver's license required</li>
                  <li>• Fuel: Return with same level as pickup</li>
                  <li>• Late return: Additional day charged</li>
                  <li>• Inspection photos taken at pickup & drop-off</li>
                </ul>
              </div>
            </div>
          </div>

          {/* PIN Entry */}
          <div>
            <label className="block font-bold mb-2">Enter PIN to Confirm Booking</label>
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
            disabled={processing || pin.length !== 4}
            className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full font-bold text-lg disabled:opacity-50"
          >
            {processing ? 'Processing...' : `Confirm Booking - TZS ${finalTotal.toLocaleString()}`}
          </Button>
        </div>
      </div>
    );
  }

  // Confirmation Step
  const oneWayFee = dropoffLocation !== pickupLocation ? 30000 : 0;
  const finalTotal = costs.total + oneWayFee;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="size-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600 mb-6">
          Your vehicle is reserved and ready
        </p>

        <div className="bg-gray-50 rounded-2xl p-6 mb-6 text-left space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Booking Reference</span>
            <span className="font-bold text-green-600">{bookingReference || 'GP' + Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Vehicle</span>
            <span className="font-bold text-sm text-right max-w-[60%]">{vehicle.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Pick-up</span>
            <span className="font-semibold">{pickupDate}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Drop-off</span>
            <span className="font-semibold">{dropoffDate}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Location</span>
            <span className="font-semibold text-sm text-right max-w-[60%]">{pickupLocation}</span>
          </div>
          {withDriver && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Driver</span>
              <span className="font-semibold">{driverName}</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <span className="text-sm text-gray-600">Total Paid</span>
            <span className="font-bold text-green-600">TZS {finalTotal.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-sm font-semibold text-green-900 mb-1">
            🚗 Voucher sent via SMS & Email
          </p>
          <p className="text-xs text-green-700">
            Present your voucher at pick-up. Bring your driver's license and ID. Contact rental company 24h before for any changes.
          </p>
        </div>

        <Button
          onClick={onBookingComplete}
          className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full font-bold mb-3"
        >
          View Rental Voucher
        </Button>
        
        <Button
          onClick={onBack}
          className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full font-bold"
        >
          Back to Car Rentals
        </Button>
      </div>
    </div>
  );
}
