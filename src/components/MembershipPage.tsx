import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { User } from '../App';
import { 
  ArrowLeft, Crown, Star, Zap, Shield, Percent, Gift, 
  TrendingUp, Check, X, ChevronRight, Sparkles, Trophy,
  Ticket, Clock, Headphones, Package, Plane, ShoppingBag, Briefcase
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { MembershipPayment } from './MembershipPayment';

interface MembershipPageProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

interface MembershipTier {
  id: 'basic' | 'premium' | 'business';
  name: string;
  price: number;
  monthlyPrice: number;
  yearlyPrice: number;
  icon: any;
  color: string;
  gradient: string;
  popular?: boolean;
  features: string[];
}

interface UserMembership {
  tier: 'basic' | 'premium' | 'business';
  startDate: string;
  expiryDate: string;
  autoRenew: boolean;
}

export function MembershipPage({ user, accessToken, onBack }: MembershipPageProps) {
  const [activeView, setActiveView] = useState<'overview' | 'payment'>('overview');
  const [selectedPlan, setSelectedPlan] = useState<MembershipTier | null>(null);
  const [membership, setMembership] = useState<UserMembership | null>(null);
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    fetchMembership();
    loadWalletBalance();
  }, []);

  const loadWalletBalance = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/wallet/balance`,
        { headers: { 'Authorization': `Bearer ${accessToken}` } }
      );
      if (response.ok) {
        const data = await response.json();
        setWalletBalance(data.balance ?? 0);
      }
    } catch {
      // keep default 0
    }
  };

  const fetchMembership = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/membership/status`,
        { headers: { 'Authorization': `Bearer ${accessToken}` } }
      );
      if (response.ok) {
        const data = await response.json();
        setMembership(data.membership ?? {
          tier: 'basic' as const,
          startDate: new Date().toISOString(),
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          autoRenew: false
        });
      } else {
        setMembership({
          tier: 'basic' as const,
          startDate: new Date().toISOString(),
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          autoRenew: false
        });
      }
    } catch (error) {
      console.error('Error fetching membership:', error);
    }
  };

  const membershipTiers: MembershipTier[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: 0,
      monthlyPrice: 0,
      yearlyPrice: 0,
      icon: Star,
      color: 'from-gray-400 to-gray-500',
      gradient: 'from-gray-400 to-gray-500',
      features: [
        '0% commission on transactions',
        'Basic wallet features',
        'Pay bills and utilities',
        'Email support (48h response)',
        'Standard transaction limits'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 9900,
      monthlyPrice: 9900,
      yearlyPrice: 99000,
      icon: Crown,
      color: 'from-purple-600 to-purple-700',
      gradient: 'from-purple-600 to-purple-700',
      popular: true,
      features: [
        '10% commission on all transactions',
        '5% cashback on shopping',
        'Priority customer support',
        'Higher transaction limits',
        'Free travel insurance',
        'Exclusive merchant discounts',
        'Airport lounge access',
        'Premium QR code design'
      ]
    },
    {
      id: 'business',
      name: 'Business',
      price: 29900,
      monthlyPrice: 29900,
      yearlyPrice: 299000,
      icon: Briefcase,
      color: 'from-blue-600 to-blue-700',
      gradient: 'from-blue-600 to-blue-700',
      features: [
        '15% commission on all transactions',
        '10% cashback on business expenses',
        'Dedicated account manager',
        'Unlimited transaction limits',
        'Business analytics dashboard',
        'Multi-user accounts',
        'Invoice generation',
        'Priority processing',
        'API access',
        'Custom integrations'
      ]
    }
  ];

  const handleSubscribe = async () => {
    if (!selectedPlan) return;

    if (selectedPlan.price === 0) {
      toast.success('You are already on the basic plan');
      return;
    }

    if (walletBalance < selectedPlan.price) {
      toast.error('Insufficient balance in your wallet');
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/membership/subscribe`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            planId: selectedPlan.id,
            planName: selectedPlan.name,
            amount: selectedPlan.price,
            period: selectedPlan.period,
            pin
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        await fetchMembership();
        setActiveView('success');
      } else {
        toast.error(data.error || 'Subscription failed');
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      toast.error('Subscription failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const getMembershipBadge = (tier: string) => {
    switch (tier) {
      case 'premium':
        return (
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
            <Crown className="size-4" />
            <span className="font-bold text-sm">Premium Member</span>
          </div>
        );
      case 'business':
        return (
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
            <Briefcase className="size-4" />
            <span className="font-bold text-sm">Business Member</span>
          </div>
        );
      default:
        return (
          <div className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full flex items-center gap-2">
            <Star className="size-4" />
            <span className="font-bold text-sm">Basic Member</span>
          </div>
        );
    }
  };

  // Overview
  if (activeView === 'overview') {
    const currentTier = membershipTiers.find(t => t.id === (membership?.tier || 'basic'));

    return (
      <div className="min-h-screen bg-white pb-20">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full transition-all">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Membership</h1>
              <p className="text-sm opacity-90">Unlock exclusive perks & rewards</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Current Status */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Your Status</h2>
              {getMembershipBadge(membership?.tier || 'basic')}
            </div>
            
            {currentTier && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Current Plan</span>
                  <span className="font-bold">{currentTier.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Monthly Cost</span>
                  <span className="font-bold">
                    {currentTier.price === 0 ? 'Free' : `TZS ${currentTier.price.toLocaleString()}`}
                  </span>
                </div>
                {membership && membership.tier !== 'basic' && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Expires</span>
                    <span className="font-bold">{new Date(membership.expiryDate).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Cashback Rate</span>
                  <span className="font-bold text-green-600">
                    {membership?.tier === 'premium' ? '5%' : membership?.tier === 'business' ? '10%' : '0%'}
                  </span>
                </div>
              </div>
            )}

            {membership && membership.tier !== 'basic' && membership.tier !== 'premium' && (
              <button
                onClick={() => setActiveView('payment')}
                className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-full font-bold hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Upgrade to Premium
              </button>
            )}

            {(!membership || membership.tier === 'basic') && (
              <button
                onClick={() => setActiveView('payment')}
                className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-full font-bold hover:from-green-600 hover:to-emerald-700 transition-all"
              >
                Upgrade Now
              </button>
            )}
          </div>

          {/* Benefits */}
          <div>
            <h2 className="text-xl font-bold mb-4">Your Benefits</h2>
            <div className="space-y-3">
              {currentTier?.features.map((feature, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="size-5 text-green-600" />
                  </div>
                  <p className="text-sm font-medium flex-1">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison */}
          <div>
            <h2 className="text-xl font-bold mb-4">Compare Plans</h2>
            <div className="grid grid-cols-3 gap-3">
              {membershipTiers.map((tier) => {
                const Icon = tier.icon;
                const isCurrent = tier.id === (membership?.tier || 'basic');
                return (
                  <button
                    key={tier.id}
                    onClick={() => !isCurrent && setActiveView('payment')}
                    className={`bg-gradient-to-br ${tier.gradient} text-white rounded-2xl p-4 ${isCurrent ? 'ring-4 ring-purple-300' : 'hover:scale-105'} transition-all`}
                  >
                    <Icon className="size-8 mb-2 mx-auto" />
                    <p className="font-bold text-sm mb-1">{tier.name.split(' ')[1]}</p>
                    <p className="text-xs opacity-90">
                      {tier.price === 0 ? 'Free' : `${tier.price.toLocaleString()}/mo`}
                    </p>
                    {isCurrent && (
                      <div className="mt-2 bg-white/20 backdrop-blur-sm text-xs py-1 rounded-full">
                        Current
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Why Upgrade */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="size-8 text-yellow-600" />
              <h2 className="text-lg font-bold">Why Upgrade?</h2>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Percent className="size-5 text-green-600 mt-0.5" />
                <span><strong>Save on fees:</strong> Premium members pay only 5% vs 15% standard</span>
              </li>
              <li className="flex items-start gap-2">
                <Gift className="size-5 text-purple-600 mt-0.5" />
                <span><strong>Earn more:</strong> Get up to 5% cashback on all purchases</span>
              </li>
              <li className="flex items-start gap-2">
                <Ticket className="size-5 text-pink-600 mt-0.5" />
                <span><strong>Free vouchers:</strong> Up to TZS 150,000 monthly value</span>
              </li>
              <li className="flex items-start gap-2">
                <Package className="size-5 text-blue-600 mt-0.5" />
                <span><strong>Free delivery:</strong> Save thousands on delivery fees</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Payment View
  if (activeView === 'payment') {
    const defaultTier = selectedPlan || membershipTiers.find(t => t.id === 'premium')!;
    
    return (
      <MembershipPayment
        selectedTier={defaultTier}
        walletBalance={walletBalance}
        onBack={() => setActiveView('overview')}
        onPaymentSuccess={(tier, method, transactionId) => {
          fetchMembership();
          loadWalletBalance();
          toast.success(`Welcome to ${tier} membership! Transaction: ${transactionId}`);
          setActiveView('overview');
        }}
      />
    );
  }

  // Success View
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="size-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Welcome to {selectedPlan?.name}!</h1>
        <p className="text-gray-600 mb-6">
          Your subscription is now active
        </p>

        <div className="bg-gray-50 rounded-2xl p-6 mb-6 text-left space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Plan</span>
            <span className="font-bold">{selectedPlan?.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Amount Paid</span>
            <span className="font-semibold text-green-600">TZS {selectedPlan?.price.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status</span>
            <span className="text-green-600 font-semibold">Active</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 mb-6">
          <p className="text-sm font-semibold text-purple-900 mb-2">🎉 Your perks are now active!</p>
          <p className="text-xs text-purple-700">
            Start enjoying enhanced cashback, lower fees, and exclusive deals right away
          </p>
        </div>

        <Button
          onClick={onBack}
          className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full font-bold"
        >
          Start Using Benefits
        </Button>
      </div>
    </div>
  );
}