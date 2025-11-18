import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User } from '../App';
import { ArrowLeft, Zap, Droplet, FileText, GraduationCap, Shield, Smartphone } from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface PaymentsPageProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

export function PaymentsPage({ user, accessToken, onBack }: PaymentsPageProps) {
  const [showPayment, setShowPayment] = useState(false);
  const [paymentType, setPaymentType] = useState('');
  const [paymentData, setPaymentData] = useState({
    accountNumber: '',
    amount: '',
    pin: '',
  });

  const paymentCategories = [
    {
      id: 'utilities',
      name: 'Utilities',
      icon: Zap,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100',
      items: [
        { id: 'tanesco', name: 'TANESCO', provider: 'TANESCO', desc: 'Electricity', logo: '⚡', bgColor: 'bg-yellow-500' },
        { id: 'dawasco', name: 'DAWASCO', provider: 'DAWASCO', desc: 'Water', logo: '💧', bgColor: 'bg-blue-500' },
      ],
    },
    {
      id: 'telecom',
      name: 'Mobile & Internet',
      icon: Smartphone,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      items: [
        { id: 'vodacom', name: 'Vodacom', provider: 'VODACOM', desc: 'Airtime & Bundles', logo: '📞', bgColor: 'bg-red-600' },
        { id: 'airtel', name: 'Airtel', provider: 'AIRTEL', desc: 'Airtime & Bundles', logo: '📱', bgColor: 'bg-red-500' },
        { id: 'tigo', name: 'Tigo', provider: 'TIGO', desc: 'Airtime & Bundles', logo: '📲', bgColor: 'bg-blue-600' },
        { id: 'halotel', name: 'Halotel', provider: 'HALOTEL', desc: 'Airtime & Bundles', logo: '📡', bgColor: 'bg-purple-600' },
      ],
    },
    {
      id: 'government',
      name: 'Government',
      icon: Shield,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      items: [
        { id: 'tra', name: 'TRA Taxes', provider: 'TRA', desc: 'Tax payments', logo: '🏛️', bgColor: 'bg-blue-700' },
        { id: 'nhif', name: 'NHIF', provider: 'NHIF', desc: 'Health insurance', logo: '🏥', bgColor: 'bg-green-700' },
        { id: 'license', name: 'Licenses & Permits', provider: 'GOV_LICENSE', desc: 'Government licenses', logo: '📋', bgColor: 'bg-gray-700' },
        { id: 'fines', name: 'Traffic Fines', provider: 'POLICE', desc: 'Pay fines', logo: '🚓', bgColor: 'bg-red-700' },
      ],
    },
    {
      id: 'education',
      name: 'Education',
      icon: GraduationCap,
      color: 'text-green-600',
      bg: 'bg-green-100',
      items: [
        { id: 'school', name: 'School Fees', provider: 'SCHOOL', desc: 'Primary & Secondary', logo: '🎒', bgColor: 'bg-green-600' },
        { id: 'exam', name: 'Exam Fees', provider: 'NECTA', desc: 'NECTA exams', logo: '📝', bgColor: 'bg-blue-600' },
        { id: 'university', name: 'University Fees', provider: 'UNIVERSITY', desc: 'Higher education', logo: '🎓', bgColor: 'bg-purple-600' },
      ],
    },
    {
      id: 'entertainment',
      name: 'TV & Entertainment',
      icon: FileText,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      items: [
        { id: 'dstv', name: 'DStv', provider: 'DSTV', desc: 'Satellite TV', logo: '📺', bgColor: 'bg-blue-700' },
        { id: 'startimes', name: 'StarTimes', provider: 'STARTIMES', desc: 'Digital TV', logo: '📡', bgColor: 'bg-orange-600' },
        { id: 'azam', name: 'Azam TV', provider: 'AZAM', desc: 'Cable TV', logo: '🎬', bgColor: 'bg-green-700' },
      ],
    },
  ];

  const handleOpenPayment = (type: string, providerName: string) => {
    setPaymentType(providerName);
    setShowPayment(true);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/payments/process`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            provider: paymentType,
            ...paymentData,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setShowPayment(false);
        setPaymentData({ accountNumber: '', amount: '', pin: '' });
        alert(`Payment successful! Reference: ${result.reference}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 px-4 pt-6 pb-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={onBack}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-full"
            >
              <ArrowLeft className="size-5 text-white" />
            </button>
            <div>
              <h1 className="text-white text-xl">Pay Bills</h1>
              <p className="text-blue-200 text-sm">All your payments in one place</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Categories */}
      <div className="max-w-4xl mx-auto px-4 py-4 space-y-6">
        {paymentCategories.map((category) => {
          const Icon = category.icon;
          return (
            <div key={category.id}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`${category.bg} p-2 rounded-lg`}>
                  <Icon className={`size-5 ${category.color}`} />
                </div>
                <h3 className="text-base">{category.name}</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {category.items.map((item) => (
                  <button
                    key={item.id}
                    className="flex flex-col items-center gap-2 p-4 bg-white hover:bg-gray-50 rounded-2xl border border-gray-100 transition-all shadow-sm"
                    onClick={() => handleOpenPayment(item.id, item.provider)}
                  >
                    <div className={`${item.bgColor} p-3 rounded-xl shadow-md w-full aspect-square flex items-center justify-center`}>
                      <span className="text-3xl">{item.logo}</span>
                    </div>
                    <div className="text-center w-full">
                      <p className="text-xs truncate">{item.name}</p>
                      <p className="text-xs text-gray-500 truncate">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make Payment</DialogTitle>
            <DialogDescription>Pay for {paymentType}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePayment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="account-number">Account/Reference Number</Label>
              <Input
                id="account-number"
                placeholder="Enter account number"
                value={paymentData.accountNumber}
                onChange={(e) => setPaymentData({ ...paymentData, accountNumber: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (TZS)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="10000"
                value={paymentData.amount}
                onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pin">PIN</Label>
              <Input
                id="pin"
                type="password"
                placeholder="••••"
                maxLength={4}
                value={paymentData.pin}
                onChange={(e) => setPaymentData({ ...paymentData, pin: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full">Confirm Payment</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}