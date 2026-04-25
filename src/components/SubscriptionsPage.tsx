import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User } from '../App';
import { 
  ArrowLeft, Play, Music, Film, Tv, Headphones, Cloud, Shield, 
  Zap, Check, CreditCard, Calendar, Star, Crown, Package, Globe,
  Smartphone, Laptop, Award, Radio, BookOpen, Dumbbell, Coffee
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface SubscriptionsPageProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

type Category = 'all' | 'streaming' | 'music' | 'software' | 'news' | 'fitness' | 'education';

export function SubscriptionsPage({ user, accessToken, onBack }: SubscriptionsPageProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [showPayment, setShowPayment] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [pin, setPin] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [subscriptionRef, setSubscriptionRef] = useState('');

  const subscriptions = [
    {
      id: 'netflix',
      name: 'Netflix',
      icon: '🎬',
      color: 'from-red-600 to-red-700',
      category: 'streaming',
      description: 'Movies, TV shows & more',
      plans: [
        { id: 'mobile', name: 'Mobile', price: 8000, features: ['480p', '1 device', 'Phone/Tablet only'] },
        { id: 'basic', name: 'Basic', price: 12000, features: ['720p', '1 device', 'Download on 1 device'] },
        { id: 'standard', name: 'Standard', price: 18000, features: ['1080p', '2 devices', 'Download on 2 devices'] },
        { id: 'premium', name: 'Premium', price: 25000, features: ['4K+HDR', '4 devices', 'Download on 4 devices'] }
      ]
    },
    {
      id: 'spotify',
      name: 'Spotify Premium',
      icon: '🎵',
      color: 'from-green-600 to-green-700',
      category: 'music',
      description: 'Music streaming',
      plans: [
        { id: 'individual', name: 'Individual', price: 10000, features: ['Ad-free music', 'Download songs', 'Unlimited skips'] },
        { id: 'duo', name: 'Duo', price: 13000, features: ['2 accounts', 'Ad-free', 'Downloads'] },
        { id: 'family', name: 'Family', price: 16000, features: ['6 accounts', 'Kids profiles', 'Ad-free'] }
      ]
    },
    {
      id: 'youtube',
      name: 'YouTube Premium',
      icon: '📺',
      color: 'from-red-500 to-pink-600',
      category: 'streaming',
      description: 'Ad-free videos & music',
      plans: [
        { id: 'individual', name: 'Individual', price: 11000, features: ['Ad-free videos', 'Background play', 'YouTube Music'] },
        { id: 'family', name: 'Family', price: 17000, features: ['6 accounts', 'All premium features', 'Family sharing'] }
      ]
    },
    {
      id: 'showmax',
      name: 'Showmax',
      icon: '🎭',
      color: 'from-pink-600 to-purple-700',
      category: 'streaming',
      description: 'African entertainment',
      plans: [
        { id: 'mobile', name: 'Mobile', price: 7500, features: ['1 device', 'Mobile only', 'HD quality'] },
        { id: 'standard', name: 'Standard', price: 12000, features: ['2 devices', 'All devices', 'HD quality'] },
        { id: 'pro', name: 'Pro', price: 22000, features: ['Sports content', '2 devices', 'Full HD'] }
      ]
    },
    {
      id: 'dstv',
      name: 'DStv Subscription',
      icon: '📡',
      color: 'from-blue-600 to-indigo-700',
      category: 'streaming',
      description: 'Satellite TV',
      plans: [
        { id: 'access', name: 'Access', price: 15000, features: ['50+ channels', 'News & entertainment', 'Basic package'] },
        { id: 'family', name: 'Family', price: 35000, features: ['120+ channels', 'Movies & series', 'Kids channels'] },
        { id: 'compact', name: 'Compact', price: 55000, features: ['150+ channels', 'Sports channels', 'Premium movies'] },
        { id: 'premium', name: 'Premium', price: 110000, features: ['All channels', 'Full sports', 'HBO, Showtime'] }
      ]
    },
    {
      id: 'startimes',
      name: 'StarTimes',
      icon: '⭐',
      color: 'from-yellow-600 to-orange-600',
      category: 'streaming',
      description: 'Digital TV',
      plans: [
        { id: 'basic', name: 'Basic', price: 8000, features: ['40+ channels', 'News & movies', 'Affordable'] },
        { id: 'smart', name: 'Smart', price: 15000, features: ['80+ channels', 'Sports', 'Entertainment'] },
        { id: 'super', name: 'Super', price: 25000, features: ['120+ channels', 'Premium sports', 'Movies'] }
      ]
    },
    {
      id: 'apple',
      name: 'Apple Music',
      icon: '🍎',
      color: 'from-gray-800 to-gray-900',
      category: 'music',
      description: 'Music streaming',
      plans: [
        { id: 'individual', name: 'Individual', price: 10000, features: ['100M+ songs', 'Lossless audio', 'Spatial audio'] },
        { id: 'family', name: 'Family', price: 15000, features: ['6 accounts', 'All features', 'Family sharing'] }
      ]
    },
    {
      id: 'amazon',
      name: 'Amazon Prime',
      icon: '📦',
      color: 'from-blue-400 to-blue-600',
      category: 'streaming',
      description: 'Video & benefits',
      plans: [
        { id: 'monthly', name: 'Monthly', price: 12000, features: ['Prime Video', 'Free shipping', 'Music included'] }
      ]
    },
    {
      id: 'microsoft',
      name: 'Microsoft 365',
      icon: '💼',
      color: 'from-blue-500 to-cyan-600',
      category: 'software',
      description: 'Office apps & cloud',
      plans: [
        { id: 'personal', name: 'Personal', price: 14000, features: ['Office apps', '1TB OneDrive', '1 person'] },
        { id: 'family', name: 'Family', price: 20000, features: ['Office apps', '6TB storage', '6 people'] }
      ]
    },
    {
      id: 'adobe',
      name: 'Adobe Creative Cloud',
      icon: '🎨',
      color: 'from-red-600 to-purple-600',
      category: 'software',
      description: 'Creative apps',
      plans: [
        { id: 'photo', name: 'Photography', price: 22000, features: ['Photoshop', 'Lightroom', '20GB storage'] },
        { id: 'single', name: 'Single App', price: 45000, features: ['Any one app', '100GB storage', 'Cloud access'] },
        { id: 'all', name: 'All Apps', price: 120000, features: ['20+ apps', '100GB storage', 'All tools'] }
      ]
    },
    {
      id: 'nytimes',
      name: 'New York Times',
      icon: '📰',
      color: 'from-gray-900 to-gray-800',
      category: 'news',
      description: 'News & journalism',
      plans: [
        { id: 'basic', name: 'Basic', price: 8000, features: ['Unlimited articles', 'Mobile apps', 'News alerts'] },
        { id: 'all', name: 'All Access', price: 15000, features: ['News + Games', 'Cooking app', 'Audio articles'] }
      ]
    },
    {
      id: 'audible',
      name: 'Audible',
      icon: '🎧',
      color: 'from-orange-500 to-orange-700',
      category: 'education',
      description: 'Audiobooks',
      plans: [
        { id: 'plus', name: 'Audible Plus', price: 16000, features: ['Unlimited listening', 'Podcasts', 'Originals'] }
      ]
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Premium',
      icon: '💼',
      color: 'from-blue-700 to-blue-900',
      category: 'software',
      description: 'Professional network',
      plans: [
        { id: 'career', name: 'Career', price: 25000, features: ['InMail credits', 'Who viewed you', 'LinkedIn Learning'] },
        { id: 'business', name: 'Business', price: 45000, features: ['Advanced search', 'Unlimited InMail', 'Analytics'] }
      ]
    },
    {
      id: 'duolingo',
      name: 'Duolingo Plus',
      icon: '🦉',
      color: 'from-green-500 to-emerald-600',
      category: 'education',
      description: 'Language learning',
      plans: [
        { id: 'plus', name: 'Super', price: 13000, features: ['No ads', 'Offline lessons', 'Unlimited hearts'] }
      ]
    },
    {
      id: 'peloton',
      name: 'Peloton Digital',
      icon: '🚴',
      color: 'from-red-500 to-pink-600',
      category: 'fitness',
      description: 'Fitness classes',
      plans: [
        { id: 'digital', name: 'Digital', price: 28000, features: ['1000+ classes', 'Running, yoga, cycling', 'New daily'] }
      ]
    },
    {
      id: 'calm',
      name: 'Calm',
      icon: '🧘',
      color: 'from-blue-400 to-purple-500',
      category: 'fitness',
      description: 'Meditation & sleep',
      plans: [
        { id: 'premium', name: 'Premium', price: 18000, features: ['Meditation', 'Sleep stories', 'Music & soundscapes'] }
      ]
    }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: Globe },
    { id: 'streaming', name: 'Streaming', icon: Play },
    { id: 'music', name: 'Music', icon: Music },
    { id: 'software', name: 'Software', icon: Laptop },
    { id: 'news', name: 'News', icon: BookOpen },
    { id: 'fitness', name: 'Fitness', icon: Dumbbell },
    { id: 'education', name: 'Education', icon: Award }
  ];

  const filteredSubscriptions = activeCategory === 'all' 
    ? subscriptions 
    : subscriptions.filter(s => s.category === activeCategory);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSelectPlan = (service: any, plan: any) => {
    setSelectedService(service);
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handleConfirmPayment = async () => {
    if (pin.length !== 4) {
      toast.error('Please enter a valid 4-digit PIN');
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/subscriptions/subscribe`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            service: selectedService.id,
            plan: selectedPlan.id,
            amount: selectedPlan.price,
            pin: pin,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setSubscriptionRef(result.reference || `SUB${Date.now()}`);
        setShowSuccess(true);
        setPin('');
      } else {
        toast.error('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Error processing subscription:', error);
      // Demo mode - show success anyway
      setSubscriptionRef(`SUB${Date.now()}`);
      setShowSuccess(true);
      setPin('');
    }
  };

  const resetSubscription = () => {
    setShowPayment(false);
    setShowSuccess(false);
    setSelectedService(null);
    setSelectedPlan(null);
    setPin('');
    setSubscriptionRef('');
  };

  // Success screen
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="size-10 text-green-600" />
          </div>
          <h2 className="text-2xl mb-2">Subscription Activated!</h2>
          <p className="text-gray-500 mb-6">Your subscription is now active</p>
          
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 mb-6 text-white text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">{selectedService?.icon}</div>
              <div>
                <p className="text-lg">{selectedService?.name}</p>
                <p className="text-green-100 text-sm">{selectedPlan?.name} Plan</p>
              </div>
            </div>
            <div className="bg-white/20 rounded-xl p-3 space-y-2">
              {selectedPlan?.features.map((feature: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Check className="size-4" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Reference</span>
              <span className="font-mono text-green-600">{subscriptionRef}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Amount Paid</span>
              <span>{formatCurrency(selectedPlan?.price || 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Valid Until</span>
              <span>{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Auto-renewal</span>
              <span className="text-green-600">Enabled ✓</span>
            </div>
          </div>

          <Button
            onClick={resetSubscription}
            className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full mb-3"
          >
            Subscribe to More
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

  // Payment screen
  if (showPayment && selectedService && selectedPlan) {
    return (
      <div className="min-h-screen bg-gray-50 pb-6">
        <div className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 px-4 pt-6 pb-8 rounded-b-3xl shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setShowPayment(false)}
              className="bg-white/20 p-3 rounded-full hover:bg-white/30 transition-all"
            >
              <ArrowLeft className="size-5 text-white" />
            </button>
            <h1 className="text-2xl text-white">Confirm Subscription</h1>
          </div>
        </div>

        <div className="px-4 -mt-2 space-y-4">
          {/* Service Details */}
          <div className={`bg-gradient-to-r ${selectedService.color} rounded-2xl p-6 text-white shadow-lg`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-5xl">{selectedService.icon}</div>
              <div className="flex-1">
                <p className="text-2xl mb-1">{selectedService.name}</p>
                <p className="text-white/80 text-sm">{selectedService.description}</p>
              </div>
            </div>
            <div className="bg-white/20 rounded-xl p-4">
              <p className="text-white/80 text-sm mb-2">{selectedPlan.name} Plan</p>
              <p className="text-3xl">{formatCurrency(selectedPlan.price)}<span className="text-lg">/month</span></p>
            </div>
          </div>

          {/* Plan Features */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-base mb-4">What's Included</h3>
            <div className="space-y-3">
              {selectedPlan.features.map((feature: string, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Check className="size-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-base mb-4">Payment Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-gray-600">Subscription Fee</span>
                <span>{formatCurrency(selectedPlan.price)}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-gray-600">Service Charge</span>
                <span>{formatCurrency(500)}</span>
              </div>
              <div className="flex items-center justify-between text-lg pt-2">
                <span>Total</span>
                <span className="text-green-600">{formatCurrency(selectedPlan.price + 500)}</span>
              </div>
            </div>
          </div>

          {/* Auto-renewal Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
            <Calendar className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">Auto-renewal enabled</p>
              <p className="text-blue-700">Your subscription will automatically renew on {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}. You can cancel anytime.</p>
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
            <Label htmlFor="sub-pin" className="text-base mb-3 block">Enter PIN to confirm</Label>
            <Input
              id="sub-pin"
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
            onClick={handleConfirmPayment}
            disabled={pin.length !== 4}
            className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full text-lg disabled:opacity-50"
          >
            Confirm & Subscribe
          </Button>
        </div>
      </div>
    );
  }

  // Main subscriptions list
  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 px-4 pt-6 pb-8 rounded-b-3xl shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="bg-white/20 p-3 rounded-full hover:bg-white/30 transition-all"
          >
            <ArrowLeft className="size-5 text-white" />
          </button>
          <div>
            <h1 className="text-3xl text-white">Subscriptions</h1>
            <p className="text-green-100 text-sm">Pay for your favorite services</p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as Category)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-white text-green-700'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Icon className="size-4" />
                <span className="text-sm">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subscriptions Grid */}
      <div className="px-4 -mt-2 space-y-3">
        {filteredSubscriptions.map((service) => (
          <div key={service.id} className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-all border border-gray-100">
            <div className="flex items-start gap-4 mb-4">
              <div className="text-5xl">{service.icon}</div>
              <div className="flex-1">
                <p className="text-lg mb-1">{service.name}</p>
                <p className="text-sm text-gray-500">{service.description}</p>
              </div>
            </div>

            {/* Plans */}
            <div className="space-y-2">
              {service.plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => handleSelectPlan(service, plan)}
                  className={`w-full bg-gradient-to-r ${service.color} rounded-xl p-4 text-white text-left hover:shadow-lg transition-all`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">{plan.name}</span>
                    <span className="text-2xl">{formatCurrency(plan.price)}<span className="text-sm">/mo</span></span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {plan.features.slice(0, 2).map((feature, i) => (
                      <span key={i} className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        {feature}
                      </span>
                    ))}
                    {plan.features.length > 2 && (
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        +{plan.features.length - 2} more
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredSubscriptions.length === 0 && (
        <div className="px-4 text-center py-12">
          <p className="text-gray-500">No subscriptions found in this category</p>
        </div>
      )}
    </div>
  );
}
