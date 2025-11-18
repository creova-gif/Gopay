import { useState, useEffect } from 'react';
import { 
  ArrowLeft, TrendingUp, DollarSign, ShoppingBag, Users, 
  Package, Plus, Edit, Eye, BarChart3, Settings, FileText,
  Clock, CheckCircle2, XCircle, AlertCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { User } from '../App';
import { projectId } from '../utils/supabase/info';

interface MerchantDashboardProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

export function MerchantDashboard({ user, accessToken, onBack }: MerchantDashboardProps) {
  const [merchantData, setMerchantData] = useState<any>(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMerchantData();
    fetchStats();
  }, []);

  const fetchMerchantData = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/merchant/profile`,
        { headers: { 'Authorization': `Bearer ${accessToken}` } }
      );
      
      if (response.ok) {
        const data = await response.json();
        setMerchantData(data);
      }
    } catch (error) {
      console.error('Error fetching merchant data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/merchant/stats`,
        { headers: { 'Authorization': `Bearer ${accessToken}` } }
      );
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching merchant stats:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading merchant dashboard...</p>
        </div>
      </div>
    );
  }

  if (!merchantData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="size-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">No Merchant Account</h2>
          <p className="text-gray-600 mb-6">
            You don't have a merchant account yet. Please complete the merchant onboarding process.
          </p>
          <Button onClick={onBack} className="w-full bg-black text-white h-12 rounded-full">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-800', label: 'Pending Review' },
      approved: { icon: CheckCircle2, color: 'bg-green-100 text-green-800', label: 'Approved' },
      rejected: { icon: XCircle, color: 'bg-red-100 text-red-800', label: 'Rejected' },
    };
    
    const badge = badges[status as keyof typeof badges] || badges.pending;
    const Icon = badge.icon;
    
    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${badge.color}`}>
        <Icon className="size-4" />
        <span className="font-semibold">{badge.label}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2">
            <ArrowLeft className="size-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{merchantData.businessName}</h1>
            <p className="text-sm text-gray-500">{merchantData.businessCategory}</p>
          </div>
          <button className="p-2">
            <Settings className="size-6" />
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Verification Status */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold mb-2">Account Status</h2>
              {getStatusBadge(merchantData.status)}
            </div>
          </div>
          
          {merchantData.status === 'pending' && (
            <div className="bg-blue-50 rounded-2xl p-4 flex gap-3">
              <AlertCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Under Review</p>
                <p>Your documents are being verified by our team. This usually takes 24-48 hours. We'll notify you once approved.</p>
              </div>
            </div>
          )}

          {merchantData.status === 'approved' && (
            <div className="bg-green-50 rounded-2xl p-4">
              <p className="text-sm text-green-800">
                Your merchant account is active! You can now accept payments and manage your business on goPay.
              </p>
            </div>
          )}

          {merchantData.status === 'rejected' && (
            <div className="bg-red-50 rounded-2xl p-4">
              <p className="text-sm text-red-800 mb-2">
                <strong>Reason:</strong> {merchantData.rejectionReason || 'Please contact support for more information.'}
              </p>
              <Button className="bg-red-600 text-white h-10 rounded-full px-6 mt-2">
                Resubmit Documents
              </Button>
            </div>
          )}
        </div>

        {/* Stats Grid - Only show if approved */}
        {merchantData.status === 'approved' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-6 text-white">
                <TrendingUp className="size-8 mb-3 opacity-80" />
                <p className="text-sm opacity-90 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white">
                <ShoppingBag className="size-8 mb-3 opacity-80" />
                <p className="text-sm opacity-90 mb-1">Total Orders</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 text-white">
                <Clock className="size-8 mb-3 opacity-80" />
                <p className="text-sm opacity-90 mb-1">Pending</p>
                <p className="text-2xl font-bold">{stats.pendingOrders}</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-6 text-white">
                <CheckCircle2 className="size-8 mb-3 opacity-80" />
                <p className="text-sm opacity-90 mb-1">Today</p>
                <p className="text-2xl font-bold">{stats.completedToday}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-gray-50 rounded-2xl p-4 flex items-center gap-4 hover:bg-gray-100 transition-all">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Plus className="size-6 text-green-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold">Add New Product</p>
                    <p className="text-sm text-gray-500">Add items to your menu/catalog</p>
                  </div>
                </button>

                <button className="w-full bg-gray-50 rounded-2xl p-4 flex items-center gap-4 hover:bg-gray-100 transition-all">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Package className="size-6 text-blue-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold">Manage Orders</p>
                    <p className="text-sm text-gray-500">View and process orders</p>
                  </div>
                </button>

                <button className="w-full bg-gray-50 rounded-2xl p-4 flex items-center gap-4 hover:bg-gray-100 transition-all">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <BarChart3 className="size-6 text-purple-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold">View Analytics</p>
                    <p className="text-sm text-gray-500">Sales reports & insights</p>
                  </div>
                </button>

                <button className="w-full bg-gray-50 rounded-2xl p-4 flex items-center gap-4 hover:bg-gray-100 transition-all">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <FileText className="size-6 text-orange-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold">Payout Settings</p>
                    <p className="text-sm text-gray-500">Bank account & withdrawals</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Business Info */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4">Business Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Business Type</span>
                  <span className="font-semibold">{merchantData.businessType}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Email</span>
                  <span className="font-semibold">{merchantData.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Phone</span>
                  <span className="font-semibold">{merchantData.phone}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Address</span>
                  <span className="font-semibold text-right">{merchantData.address}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">TIN Number</span>
                  <span className="font-semibold">{merchantData.tinNumber}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
