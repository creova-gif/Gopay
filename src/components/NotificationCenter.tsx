import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { User } from '../App';
import { 
  ArrowLeft, Bell, Check, Trash2, DollarSign, ShoppingBag,
  CreditCard, AlertCircle, Gift, TrendingUp, Settings, Filter
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface NotificationCenterProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

interface Notification {
  id: string;
  type: 'transaction' | 'promotion' | 'security' | 'reward' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  icon: any;
  color: string;
}

export function NotificationCenter({ user, accessToken, onBack }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'transaction' | 'promotion'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/notifications/list`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || generateDemoNotifications());
      } else {
        setNotifications(generateDemoNotifications());
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications(generateDemoNotifications());
    } finally {
      setLoading(false);
    }
  };

  const generateDemoNotifications = (): Notification[] => {
    const now = new Date();
    return [
      {
        id: '1',
        type: 'transaction',
        title: 'Payment Received',
        message: 'You received TZS 50,000 from John Doe',
        timestamp: new Date(now.getTime() - 1000 * 60 * 5).toISOString(),
        read: false,
        icon: DollarSign,
        color: 'bg-green-500'
      },
      {
        id: '2',
        type: 'promotion',
        title: '20% Off Food Delivery',
        message: 'Get 20% off on your next food order from Pizza Paradise',
        timestamp: new Date(now.getTime() - 1000 * 60 * 30).toISOString(),
        read: false,
        icon: Gift,
        color: 'bg-purple-500'
      },
      {
        id: '3',
        type: 'transaction',
        title: 'Bill Payment Successful',
        message: 'TANESCO bill of TZS 45,000 paid successfully',
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(),
        read: true,
        icon: CreditCard,
        color: 'bg-blue-500'
      },
      {
        id: '4',
        type: 'security',
        title: 'New Login Detected',
        message: 'New login from Dar es Salaam on your account',
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 5).toISOString(),
        read: true,
        icon: AlertCircle,
        color: 'bg-orange-500'
      },
      {
        id: '5',
        type: 'reward',
        title: 'Cashback Earned!',
        message: 'You earned TZS 5,000 cashback from your recent purchase',
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
        read: true,
        icon: TrendingUp,
        color: 'bg-green-500'
      },
      {
        id: '6',
        type: 'promotion',
        title: 'Upgrade to goPay Plus',
        message: 'Get 5% cashback on all transactions. Limited time offer!',
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        read: true,
        icon: Gift,
        color: 'bg-purple-500'
      },
    ];
  };

  const markAsRead = async (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/notifications/${notificationId}/read`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/notifications/read-all`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/notifications/${notificationId}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - notifTime.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return notifTime.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="size-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold">Notifications</h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-gray-600">{unreadCount} unread</p>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-green-600 text-sm font-semibold hover:bg-green-50 px-3 py-1.5 rounded-lg"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'All', count: notifications.length },
              { id: 'unread', label: 'Unread', count: unreadCount },
              { id: 'transaction', label: 'Transactions' },
              { id: 'promotion', label: 'Offers' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === tab.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="ml-1.5">({tab.count})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="pb-6">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="size-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-600">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  !notification.read ? 'bg-green-50/30' : ''
                }`}
              >
                <div className="flex gap-3">
                  <div className={`${notification.color} rounded-full p-2.5 h-fit`}>
                    <notification.icon className="size-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-green-600 hover:bg-green-100 p-1.5 rounded-full"
                            title="Mark as read"
                          >
                            <Check className="size-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-full"
                          title="Delete"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    <p className="text-xs text-gray-500">{getTimeAgo(notification.timestamp)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
