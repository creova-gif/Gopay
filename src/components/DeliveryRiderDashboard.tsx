import { useState } from 'react';
import { Button } from './ui/button';
import { User } from '../App';
import { 
  ArrowLeft, Bike, DollarSign, TrendingUp, MapPin,
  Clock, Package, Star, Award, Zap, Navigation,
  Check, X, Phone, ChevronRight, Calendar, Target,
  Shield, AlertCircle, ThumbsUp, BarChart3
} from 'lucide-react';

interface DeliveryRiderDashboardProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

interface DeliveryOrder {
  id: string;
  type: 'pickup' | 'delivering' | 'completed';
  pickupLocation: string;
  deliveryLocation: string;
  distance: string;
  payment: number;
  customerName: string;
  customerPhone: string;
  items: string;
  eta: string;
  priority: 'normal' | 'urgent';
}

interface Earnings {
  today: number;
  thisWeek: number;
  thisMonth: number;
  pending: number;
}

export function DeliveryRiderDashboard({ user, accessToken, onBack }: DeliveryRiderDashboardProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [view, setView] = useState<'dashboard' | 'orders' | 'earnings' | 'stats'>('dashboard');
  const [activeOrders, setActiveOrders] = useState<DeliveryOrder[]>([
    {
      id: '1',
      type: 'pickup',
      pickupLocation: 'Kariakoo Wholesale Market',
      deliveryLocation: 'Sinza, House No. 45',
      distance: '3.2 km',
      payment: 5000,
      customerName: 'John Mwangi',
      customerPhone: '+255 712 345 678',
      items: '2 bags of rice, 1 bottle cooking oil',
      eta: '15 min',
      priority: 'normal',
    },
  ]);

  const completedToday = 12;
  const rating = 4.8;
  const totalDeliveries = 856;

  const earnings: Earnings = {
    today: 48000,
    thisWeek: 285000,
    thisMonth: 950000,
    pending: 125000,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Dashboard View
  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 pb-20">
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">Rider Dashboard 🏍️</h1>
              <p className="text-sm text-gray-500">Delivery partner portal</p>
            </div>
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                isOnline
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isOnline ? '🟢 Online' : '⚫ Offline'}
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Today's Stats */}
          <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-white/80 mb-1">Today's Earnings</p>
                <p className="text-3xl font-bold">{formatCurrency(earnings.today)}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <DollarSign className="size-8" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-3">
              <div>
                <p className="text-xs text-white/70 mb-1">Deliveries</p>
                <p className="text-xl font-bold">{completedToday}</p>
              </div>
              <div>
                <p className="text-xs text-white/70 mb-1">Rating</p>
                <div className="flex items-center gap-1">
                  <Star className="size-4 fill-yellow-300 text-yellow-300" />
                  <p className="text-xl font-bold">{rating}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-white/70 mb-1">Pending</p>
                <p className="text-xl font-bold">{formatCurrency(earnings.pending)}</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setView('earnings')}
              className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-green-500 transition-all text-left"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="bg-green-100 p-2 rounded-xl">
                  <TrendingUp className="size-5 text-green-600" />
                </div>
                <ChevronRight className="size-4 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 mb-1">This Week</p>
              <p className="text-xl font-bold">{formatCurrency(earnings.thisWeek)}</p>
            </button>
            <button
              onClick={() => setView('stats')}
              className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-green-500 transition-all text-left"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="bg-purple-100 p-2 rounded-xl">
                  <Award className="size-5 text-purple-600" />
                </div>
                <ChevronRight className="size-4 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Trips</p>
              <p className="text-xl font-bold">{totalDeliveries}</p>
            </button>
          </div>

          {/* Active Orders */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold flex items-center gap-2">
                <Package className="size-5 text-green-600" />
                Active Orders ({activeOrders.length})
              </h3>
              <button 
                onClick={() => setView('orders')}
                className="text-sm text-green-600 font-semibold"
              >
                View All
              </button>
            </div>

            {activeOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
                <Package className="size-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No active orders</p>
                {isOnline ? (
                  <p className="text-sm text-green-600">Waiting for new orders...</p>
                ) : (
                  <Button
                    onClick={() => setIsOnline(true)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Go Online to Accept Orders
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {activeOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl p-4 border-2 border-green-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-green-100 p-2 rounded-full">
                          <MapPin className="size-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">
                            {order.type === 'pickup' ? 'Pickup Ready' : 'In Transit'}
                          </p>
                          <p className="text-xs text-gray-500">{order.distance}</p>
                        </div>
                      </div>
                      {order.priority === 'urgent' && (
                        <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                          <Zap className="size-3" />
                          Urgent
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 mb-3 text-sm">
                      <div className="flex gap-2">
                        <span className="text-gray-500">From:</span>
                        <span className="font-semibold flex-1">{order.pickupLocation}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-gray-500">To:</span>
                        <span className="font-semibold flex-1">{order.deliveryLocation}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-gray-500">Items:</span>
                        <span className="flex-1">{order.items}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        <button className="bg-blue-100 text-blue-700 p-2 rounded-full hover:bg-blue-200">
                          <Phone className="size-4" />
                        </button>
                        <button className="bg-purple-100 text-purple-700 p-2 rounded-full hover:bg-purple-200">
                          <Navigation className="size-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-green-600">{formatCurrency(order.payment)}</span>
                        <button className="bg-green-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-700">
                          {order.type === 'pickup' ? 'Start Delivery' : 'Mark Complete'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Daily Target */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="size-5 text-orange-600" />
                <h3 className="font-bold">Daily Target</h3>
              </div>
              <span className="text-sm font-semibold text-orange-600">12 / 15 trips</span>
            </div>
            <div className="bg-orange-200 rounded-full h-3 overflow-hidden mb-2">
              <div
                className="bg-gradient-to-r from-orange-500 to-amber-500 h-full transition-all"
                style={{ width: `${(12 / 15) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-600">3 more trips to unlock 10,000 TZS bonus! 🎉</p>
          </div>

          {/* Heatmap Hint */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-sm text-blue-900 mb-1">High Demand Area</p>
              <p className="text-xs text-blue-800">
                Kariakoo has 12 pending orders! Head there for more pickups.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Earnings View
  if (view === 'earnings') {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('dashboard')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-lg font-bold">My Earnings</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Total Earnings */}
          <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl p-6 text-white">
            <p className="text-sm text-white/80 mb-2">Total This Month</p>
            <p className="text-4xl font-bold mb-4">{formatCurrency(earnings.thisMonth)}</p>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center justify-between">
              <span className="text-sm">Pending Withdrawal:</span>
              <span className="font-bold text-lg">{formatCurrency(earnings.pending)}</span>
            </div>
          </div>

          {/* Period Breakdown */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <p className="text-sm text-gray-600 mb-2">Today</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(earnings.today)}</p>
              <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                <TrendingUp className="size-3" />
                <span>+15% vs yesterday</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <p className="text-sm text-gray-600 mb-2">This Week</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(earnings.thisWeek)}</p>
              <div className="flex items-center gap-1 text-xs text-blue-600 mt-1">
                <Calendar className="size-3" />
                <span>7 days</span>
              </div>
            </div>
          </div>

          {/* Withdraw Button */}
          <Button className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full font-bold text-lg">
            Withdraw {formatCurrency(earnings.pending)} to Wallet
          </Button>

          {/* Recent Transactions */}
          <div>
            <h3 className="font-bold mb-3">Recent Earnings</h3>
            <div className="bg-white rounded-2xl divide-y divide-gray-100">
              {[
                { id: 1, date: '2025-11-25', trips: 12, amount: 48000 },
                { id: 2, date: '2025-11-24', trips: 15, amount: 62000 },
                { id: 3, date: '2025-11-23', trips: 10, amount: 38000 },
              ].map((day) => (
                <div key={day.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{day.date}</p>
                    <p className="text-sm text-gray-500">{day.trips} deliveries</p>
                  </div>
                  <p className="font-bold text-green-600">{formatCurrency(day.amount)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Stats View
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setView('dashboard')} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="size-6" />
          </button>
          <h1 className="text-lg font-bold">Performance Stats</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Rating Card */}
        <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-3xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-white/80 mb-1">Your Rating</p>
              <div className="flex items-center gap-2">
                <Star className="size-8 fill-white" />
                <p className="text-4xl font-bold">{rating}</p>
              </div>
            </div>
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <Award className="size-8" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center justify-between text-sm">
              <span>Based on {totalDeliveries} deliveries</span>
              <ThumbsUp className="size-4" />
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Check className="size-4 text-green-600" />
              </div>
              <p className="text-sm font-semibold">On-Time Rate</p>
            </div>
            <p className="text-3xl font-bold text-green-600">96%</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Package className="size-4 text-blue-600" />
              </div>
              <p className="text-sm font-semibold">Acceptance</p>
            </div>
            <p className="text-3xl font-bold text-blue-600">94%</p>
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h3 className="font-bold mb-3">Achievements</h3>
          <div className="space-y-3">
            <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-full">
                <Award className="size-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-bold">Top Performer</p>
                <p className="text-sm text-gray-500">Completed 100+ deliveries this month</p>
              </div>
              <Check className="size-5 text-green-600" />
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-3">
              <div className="bg-yellow-100 p-3 rounded-full">
                <Star className="size-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="font-bold">5-Star Champion</p>
                <p className="text-sm text-gray-500">Maintained 4.8+ rating for 3 months</p>
              </div>
              <Check className="size-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}