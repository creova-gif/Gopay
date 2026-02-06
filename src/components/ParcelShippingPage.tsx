import { useState } from 'react';
import { Button } from './ui/button';
import { User } from '../App';
import { 
  ArrowLeft, Package, MapPin, Users, Scale, Shield,
  Truck, Clock, Check, Info, AlertCircle, ChevronRight,
  Phone, Navigation, DollarSign, Camera, FileText
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface ParcelShippingPageProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

interface BusOperator {
  id: string;
  name: string;
  logo: string;
  routes: string[];
  pricePerKg: number;
  estimatedDays: string;
  rating: number;
  features: string[];
}

export function ParcelShippingPage({ user, accessToken, onBack }: ParcelShippingPageProps) {
  const [step, setStep] = useState<'details' | 'select-operator' | 'insurance' | 'payment' | 'confirmation'>('details');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [weight, setWeight] = useState('');
  const [description, setDescription] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [selectedOperator, setSelectedOperator] = useState<BusOperator | null>(null);
  const [addInsurance, setAddInsurance] = useState(false);
  const [declaredValue, setDeclaredValue] = useState('');
  const [pin, setPin] = useState('');
  const [processing, setProcessing] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');

  const busOperators: BusOperator[] = [
    {
      id: 'kilimanjaro',
      name: 'Kilimanjaro Express',
      logo: '🚌',
      routes: ['Dar-Arusha', 'Dar-Mwanza', 'Arusha-Moshi'],
      pricePerKg: 2000,
      estimatedDays: '1-2 days',
      rating: 4.7,
      features: ['Fast delivery', 'SMS updates', 'Secure storage', 'Door pickup available'],
    },
    {
      id: 'dar-express',
      name: 'Dar Express',
      logo: '🚐',
      routes: ['Dar-Dodoma', 'Dar-Morogoro', 'Dar-Iringa'],
      pricePerKg: 1800,
      estimatedDays: '1-3 days',
      rating: 4.5,
      features: ['Affordable rates', 'Multiple daily trips', 'Package tracking'],
    },
    {
      id: 'tahmeed',
      name: 'Tahmeed Coach',
      logo: '🚍',
      routes: ['Dar-Mbeya', 'Dar-Songea', 'Mbeya-Songea'],
      pricePerKg: 2200,
      estimatedDays: '2-3 days',
      rating: 4.6,
      features: ['Long distance', 'Safe handling', 'Insurance options'],
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateShippingCost = () => {
    if (!selectedOperator || !weight) return 0;
    return parseFloat(weight) * selectedOperator.pricePerKg;
  };

  const calculateInsurance = () => {
    if (!addInsurance || !declaredValue) return 0;
    return parseFloat(declaredValue) * 0.02; // 2% of declared value
  };

  const calculateTotal = () => {
    return calculateShippingCost() + calculateInsurance();
  };

  const handleBooking = async () => {
    if (!selectedOperator || !weight || !recipientName || !recipientPhone || pin.length !== 4) {
      alert('Please complete all required fields');
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/parcel/book`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            operatorId: selectedOperator.id,
            from,
            to,
            weight: parseFloat(weight),
            description,
            recipientName,
            recipientPhone,
            addInsurance,
            declaredValue: addInsurance ? parseFloat(declaredValue) : 0,
            totalAmount: calculateTotal(),
            pin,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setTrackingNumber(data.trackingNumber || `PCL${Date.now()}`);
        setStep('confirmation');
        setPin('');
      } else {
        alert(data.error || 'Booking failed');
      }
    } catch (error) {
      console.error('Error booking parcel:', error);
      // Demo mode
      setTrackingNumber(`PCL${Date.now()}`);
      setStep('confirmation');
      setPin('');
    } finally {
      setProcessing(false);
    }
  };

  // Parcel Details Step
  if (step === 'details') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50">
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">Parcel Shipping 📦</h1>
              <p className="text-sm text-gray-500">Send via bus operators</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Hero Banner */}
          <div className="bg-gradient-to-br from-orange-600 to-amber-600 rounded-3xl p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <Package className="size-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">Fast & Affordable</h2>
                <p className="text-white/90">Send parcels nationwide via trusted bus companies</p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl p-3 text-center">
              <div className="bg-orange-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Truck className="size-5 text-orange-600" />
              </div>
              <p className="text-xs font-bold">Daily Trips</p>
            </div>
            <div className="bg-white rounded-2xl p-3 text-center">
              <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="size-5 text-green-600" />
              </div>
              <p className="text-xs font-bold">Insured</p>
            </div>
            <div className="bg-white rounded-2xl p-3 text-center">
              <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Navigation className="size-5 text-blue-600" />
              </div>
              <p className="text-xs font-bold">Tracked</p>
            </div>
          </div>

          {/* Parcel Details Form */}
          <div className="bg-white rounded-3xl p-6 space-y-4">
            <div>
              <label className="block font-bold mb-2 text-sm">From (Pickup Location)</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Dar es Salaam"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-2 text-sm">To (Delivery Location)</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Arusha"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-2 text-sm">Weight (kg)</label>
              <div className="relative">
                <Scale className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="number"
                  placeholder="5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Maximum 50 kg per parcel</p>
            </div>

            <div>
              <label className="block font-bold mb-2 text-sm">What are you sending?</label>
              <textarea
                placeholder="e.g., Electronics, Clothes, Documents"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none resize-none"
              />
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-bold mb-3">Recipient Information</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block font-bold mb-2 text-sm">Recipient Name</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Full name"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full h-12 pl-12 pr-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-2 text-sm">Recipient Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="+255 712 345 678"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      className="w-full h-12 pl-12 pr-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setStep('select-operator')}
              disabled={!from || !to || !weight || !recipientName || !recipientPhone}
              className="w-full h-14 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-full font-bold text-lg disabled:opacity-50"
            >
              Select Bus Operator
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Select Operator Step
  if (step === 'select-operator') {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setStep('details')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold">Select Bus Operator</h1>
              <p className="text-sm text-gray-500">{from} → {to}</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {busOperators.map((operator) => (
            <button
              key={operator.id}
              onClick={() => {
                setSelectedOperator(operator);
                setStep('insurance');
              }}
              className="w-full bg-white rounded-2xl p-4 border-2 border-gray-100 hover:border-orange-500 transition-all text-left"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-4xl">{operator.logo}</div>
                  <div className="flex-1">
                    <p className="font-bold mb-1">{operator.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {operator.estimatedDays}
                      </span>
                      <span>•</span>
                      <span>⭐ {operator.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-orange-600">
                    {formatCurrency(parseFloat(weight) * operator.pricePerKg)}
                  </p>
                  <p className="text-xs text-gray-500">{formatCurrency(operator.pricePerKg)}/kg</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {operator.features.map((feature, idx) => (
                  <span key={idx} className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded-full">
                    {feature}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Insurance Step
  if (step === 'insurance' && selectedOperator) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setStep('select-operator')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-lg font-bold">Add Insurance?</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Insurance Toggle */}
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="size-6 text-green-600" />
                  <h3 className="font-bold text-lg">Parcel Insurance</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Protect your shipment against loss or damage
                </p>
                <p className="text-xs text-gray-500">
                  Coverage: 100% of declared value • Premium: 2% of value
                </p>
              </div>
              <button
                onClick={() => setAddInsurance(!addInsurance)}
                className={`w-14 h-7 rounded-full transition-all ${
                  addInsurance ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full transition-transform ${
                    addInsurance ? 'translate-x-7' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {addInsurance && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <label className="block font-bold mb-2 text-sm">Declared Value (TZS)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                  <input
                    type="number"
                    placeholder="100000"
                    value={declaredValue}
                    onChange={(e) => setDeclaredValue(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                  />
                </div>
                {declaredValue && (
                  <p className="text-sm text-green-600 mt-2">
                    Insurance premium: {formatCurrency(calculateInsurance())}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-br from-orange-600 to-amber-600 rounded-3xl p-6 text-white">
            <h3 className="font-bold mb-4">Booking Summary</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-white/80">Operator:</span>
                <span className="font-semibold">{selectedOperator.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/80">Route:</span>
                <span className="font-semibold">{from} → {to}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/80">Weight:</span>
                <span className="font-semibold">{weight} kg</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/80">Shipping Cost:</span>
                <span className="font-semibold">{formatCurrency(calculateShippingCost())}</span>
              </div>
              {addInsurance && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/80">Insurance:</span>
                  <span className="font-semibold">{formatCurrency(calculateInsurance())}</span>
                </div>
              )}
              <div className="border-t border-white/20 pt-2 mt-2 flex justify-between">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-2xl">{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
          </div>

          {/* PIN Entry */}
          <div className="bg-white rounded-2xl p-4">
            <label className="block font-bold mb-2">Enter PIN to Confirm</label>
            <input
              type="password"
              maxLength={4}
              placeholder="4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full h-14 text-center text-2xl tracking-widest border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
            />
          </div>

          {/* Confirm Button */}
          <Button
            onClick={handleBooking}
            disabled={processing || pin.length !== 4 || (addInsurance && !declaredValue)}
            className="w-full h-14 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-full font-bold text-lg disabled:opacity-50"
          >
            {processing ? 'Processing...' : `Confirm Booking - ${formatCurrency(calculateTotal())}`}
          </Button>
        </div>
      </div>
    );
  }

  // Confirmation Step
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-600 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="size-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Parcel Booked! 📦</h1>
          <p className="text-gray-600">Your shipment is confirmed</p>
        </div>

        <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg">
          <div className="bg-gradient-to-br from-orange-600 to-amber-600 rounded-2xl p-4 text-white mb-4">
            <p className="text-sm text-white/80 mb-1">Tracking Number</p>
            <p className="text-2xl font-bold tracking-wider">{trackingNumber}</p>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Operator:</span>
              <span className="font-semibold">{selectedOperator?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">From:</span>
              <span className="font-semibold">{from}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">To:</span>
              <span className="font-semibold">{to}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Weight:</span>
              <span className="font-semibold">{weight} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Recipient:</span>
              <span className="font-semibold">{recipientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Est. Delivery:</span>
              <span className="font-semibold">{selectedOperator?.estimatedDays}</span>
            </div>
            {addInsurance && (
              <div className="flex justify-between">
                <span className="text-gray-600">Insured:</span>
                <span className="font-semibold text-green-600">Yes ({formatCurrency(parseFloat(declaredValue))})</span>
              </div>
            )}
            <div className="flex justify-between pt-3 border-t border-gray-200">
              <span className="font-bold">Total Paid:</span>
              <span className="font-bold text-orange-600">{formatCurrency(calculateTotal())}</span>
            </div>
          </div>
        </div>

        <div className="bg-orange-100 border border-orange-200 rounded-2xl p-4 mb-6">
          <p className="text-sm font-semibold text-orange-900 mb-2">📱 Details sent via SMS</p>
          <p className="text-xs text-orange-800 mb-2">
            Track your parcel in real-time. Recipient will be notified on arrival.
          </p>
          <p className="text-xs text-orange-700">
            ⚠️ Drop off parcel at {selectedOperator?.name} office by tomorrow.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={onBack}
            className="h-12 bg-white border-2 border-orange-600 text-orange-600 hover:bg-orange-50 rounded-full font-bold"
          >
            Done
          </Button>
          <Button
            className="h-12 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-full font-bold"
          >
            Track Parcel
          </Button>
        </div>
      </div>
    </div>
  );
}
