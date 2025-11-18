import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { User } from '../App';
import { 
  ArrowLeft, 
  Gift,
  Star,
  Trophy,
  Coins,
  ShoppingBag,
  Ticket,
  ChevronRight,
  Zap,
  Crown
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface RewardsPageProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

export function RewardsPage({ user, accessToken, onBack }: RewardsPageProps) {
  const [points, setPoints] = useState(0);
  const [tier, setTier] = useState('Bronze');
  const [cashback, setCashback] = useState(0);

  useEffect(() => {
    fetchRewardsData();
  }, []);

  const fetchRewardsData = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/rewards/balance`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPoints(data.points || 0);
        setTier(data.tier || 'Bronze');
        setCashback(data.cashback || 0);
      }
    } catch (error) {
      console.error('Error fetching rewards:', error);
      // Set demo data
      setPoints(1250);
      setTier('Silver');
      setCashback(15000);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const rewards = [
    { id: '1', name: 'TZS 10,000 Cashback', points: 500, image: '💰', category: 'cashback' },
    { id: '2', name: 'Free Electricity Bill', points: 800, image: '⚡', category: 'utility' },
    { id: '3', name: 'Movie Tickets (2x)', points: 600, image: '🎬', category: 'entertainment' },
    { id: '4', name: 'Restaurant Voucher', points: 1000, image: '🍽️', category: 'dining' },
    { id: '5', name: 'Shopping Discount 20%', points: 400, image: '🛍️', category: 'shopping' },
    { id: '6', name: 'Free Bus Ride', points: 200, image: '🚌', category: 'travel' },
  ];

  const activities = [
    { task: 'Make 3 payments today', points: 50, completed: false },
    { task: 'Pay utility bills', points: 30, completed: true },
    { task: 'Refer a friend', points: 100, completed: false },
    { task: 'Complete profile', points: 20, completed: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 px-4 pt-6 pb-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-full"
            >
              <ArrowLeft className="size-5 text-white" />
            </button>
            <div>
              <h1 className="text-white text-xl">GOrewards</h1>
              <p className="text-orange-100 text-sm">Collect points and redeem rewards</p>
            </div>
          </div>

          {/* Points Card */}
          <div className="bg-white rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-500 text-sm mb-1">Your Points</p>
                <p className="text-4xl text-gray-900">{points.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-2xl">
                <Trophy className="size-10 text-white" />
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-3">
              <Crown className="size-5 text-purple-600" />
              <div>
                <p className="text-sm text-purple-900">{tier} Member</p>
                <p className="text-xs text-purple-600">500 points to Gold tier</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Cashback Section */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-green-100 text-sm mb-1">Total Cashback Earned</p>
              <p className="text-2xl">{formatCurrency(cashback)}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Coins className="size-8 text-white" />
            </div>
          </div>
          <p className="text-sm text-green-100">
            Earn cashback on every transaction!
          </p>
        </div>

        {/* Earn More Points */}
        <div>
          <h3 className="text-base mb-3">Earn More Points</h3>
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-2xl border ${
                  activity.completed
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${
                    activity.completed ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {activity.completed ? (
                      <Star className="size-5 text-green-600 fill-green-600" />
                    ) : (
                      <Zap className="size-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm">{activity.task}</p>
                    <p className="text-xs text-gray-500">+{activity.points} points</p>
                  </div>
                </div>
                {activity.completed ? (
                  <span className="text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full">
                    Completed
                  </span>
                ) : (
                  <ChevronRight className="size-5 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Redeem Rewards */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base">Redeem Rewards</h3>
            <button className="text-blue-600 text-sm">See all</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className="bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 w-full aspect-square rounded-xl flex items-center justify-center mb-3">
                  <span className="text-5xl">{reward.image}</span>
                </div>
                <p className="text-sm mb-2 line-clamp-2">{reward.name}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-orange-600">
                    <Star className="size-4 fill-orange-600" />
                    <span className="text-sm">{reward.points}</span>
                  </div>
                  <Button
                    size="sm"
                    disabled={points < reward.points}
                    className="h-8 text-xs rounded-full bg-gradient-to-r from-blue-600 to-cyan-500"
                  >
                    Redeem
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Gift className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-900">How to earn points</p>
              <p className="text-xs text-blue-600 mt-1">
                Earn points with every payment, bill payment, and money transfer. Complete daily tasks for bonus points!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
