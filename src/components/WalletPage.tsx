import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User } from '../App';
import { ArrowLeft, Plus, Send, Smartphone, Building, CreditCard, ChevronRight, QrCode, Download, UserPlus, Wifi } from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface WalletPageProps {
  user: User;
  accessToken: string;
  onBack: () => void;
  onNavigate?: (page: 'cards' | 'export' | 'international') => void;
}

interface LinkedAccount {
  id: string;
  type: string;
  provider: string;
  accountNumber: string;
}

export function WalletPage({ user, accessToken, onBack, onNavigate }: WalletPageProps) {
  const [balance, setBalance] = useState(0);
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showSendMoney, setShowSendMoney] = useState(false);
  const [showRequestMoney, setShowRequestMoney] = useState(false);
  const [showLinkAccount, setShowLinkAccount] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeData, setQRCodeData] = useState<{ qrCode: string; amount: number } | null>(null);

  const [addFundsData, setAddFundsData] = useState({
    amount: '',
    source: '',
    pin: '',
  });

  const [sendMoneyData, setSendMoneyData] = useState({
    recipient: '',
    amount: '',
    pin: '',
  });

  const [requestMoneyData, setRequestMoneyData] = useState({
    recipient: '',
    amount: '',
    message: '',
  });

  const [linkAccountData, setLinkAccountData] = useState({
    type: '',
    provider: '',
    accountNumber: '',
    pin: '',
  });

  const [qrAmount, setQrAmount] = useState('');

  useEffect(() => {
    fetchWalletData();
    fetchLinkedAccounts();
  }, []);

  const fetchWalletData = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/wallet/balance`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance || 0);
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };

  const fetchLinkedAccounts = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/wallet/linked-accounts`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLinkedAccounts(data.accounts || []);
      }
    } catch (error) {
      console.error('Error fetching linked accounts:', error);
    }
  };

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/wallet/add-funds`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(addFundsData),
        }
      );

      if (response.ok) {
        setShowAddFunds(false);
        setAddFundsData({ amount: '', source: '', pin: '' });
        fetchWalletData();
        alert('Funds added successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add funds');
      }
    } catch (error) {
      console.error('Error adding funds:', error);
      alert('An error occurred');
    }
  };

  const handleSendMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/wallet/send-money`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(sendMoneyData),
        }
      );

      if (response.ok) {
        setShowSendMoney(false);
        setSendMoneyData({ recipient: '', amount: '', pin: '' });
        fetchWalletData();
        alert('Money sent successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to send money');
      }
    } catch (error) {
      console.error('Error sending money:', error);
      alert('An error occurred');
    }
  };

  const handleRequestMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/wallet/request-money`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(requestMoneyData),
        }
      );

      if (response.ok) {
        setShowRequestMoney(false);
        setRequestMoneyData({ recipient: '', amount: '', message: '' });
        alert('Money request sent successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to request money');
      }
    } catch (error) {
      console.error('Error requesting money:', error);
      alert('An error occurred');
    }
  };

  const handleLinkAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/wallet/link-account`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(linkAccountData),
        }
      );

      if (response.ok) {
        setShowLinkAccount(false);
        setLinkAccountData({ type: '', provider: '', accountNumber: '', pin: '' });
        fetchLinkedAccounts();
        alert('Account linked successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to link account');
      }
    } catch (error) {
      console.error('Error linking account:', error);
      alert('An error occurred');
    }
  };

  const handleGenerateQR = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/wallet/generate-qr`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ amount: qrAmount }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setQRCodeData(data);
        setShowQRCode(true);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to generate QR code');
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('An error occurred');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'mobile_money':
        return <Smartphone className="size-6 text-blue-600" />;
      case 'bank':
        return <Building className="size-6 text-green-600" />;
      case 'card':
        return <CreditCard className="size-6 text-purple-600" />;
      default:
        return <Smartphone className="size-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 px-4 pt-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-full"
            >
              <ArrowLeft className="size-5 text-white" />
            </button>
            <h1 className="text-white text-xl">Wallet</h1>
          </div>
          
          <div className="bg-white rounded-3xl p-6">
            <p className="text-gray-500 text-sm mb-1">Available Balance</p>
            <div className="text-3xl text-gray-900 mb-6">{formatCurrency(balance)}</div>
            
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setShowAddFunds(true)}
                className="flex flex-col items-center gap-1 p-3 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-all"
              >
                <div className="bg-blue-600 p-2 rounded-xl">
                  <Plus className="size-4 text-white" />
                </div>
                <span className="text-xs text-center">Add Money</span>
              </button>
              <button
                onClick={() => setShowSendMoney(true)}
                className="flex flex-col items-center gap-1 p-3 bg-green-50 hover:bg-green-100 rounded-2xl transition-all"
              >
                <div className="bg-green-600 p-2 rounded-xl">
                  <Send className="size-4 text-white" />
                </div>
                <span className="text-xs text-center">Send</span>
              </button>
              <button
                onClick={() => setShowRequestMoney(true)}
                className="flex flex-col items-center gap-1 p-3 bg-purple-50 hover:bg-purple-100 rounded-2xl transition-all"
              >
                <div className="bg-purple-600 p-2 rounded-xl">
                  <Download className="size-4 text-white" />
                </div>
                <span className="text-xs text-center">Request</span>
              </button>
              <button
                onClick={handleGenerateQR}
                className="flex flex-col items-center gap-1 p-3 bg-orange-50 hover:bg-orange-100 rounded-2xl transition-all"
              >
                <div className="bg-orange-600 p-2 rounded-xl">
                  <QrCode className="size-4 text-white" />
                </div>
                <span className="text-xs text-center">My QR</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 pb-6 space-y-6">
        {/* Bank/Card section at top */}
        <div>
          <h3 className="text-base mb-3">Bank / Card</h3>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 hover:bg-gray-50 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-pink-100 p-3 rounded-xl">
                  <Building className="size-6 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm">DuitNow Transfer</p>
                  <p className="text-xs text-gray-500">Instant bank transfer</p>
                </div>
              </div>
              <ChevronRight className="size-5 text-gray-400" />
            </div>
            {/* Account number preview */}
            <div className="bg-blue-50 rounded-xl p-3 flex items-center gap-2">
              <Wifi className="size-4 text-blue-600" />
              <span className="text-sm text-blue-900 font-mono">goPay-{user.phone.slice(-4)}</span>
            </div>
          </div>
        </div>

        {/* Other methods section */}
        <div>
          <h3 className="text-sm text-gray-500 mb-3">Other methods</h3>
          <div className="space-y-3">
            <button
              onClick={() => setShowLinkAccount(true)}
              className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 rounded-2xl border border-gray-100 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <CreditCard className="size-5 text-blue-600" />
                </div>
                <p className="text-sm">Credit card</p>
              </div>
              <ChevronRight className="size-5 text-gray-400" />
            </button>

            <button
              onClick={() => setShowLinkAccount(true)}
              className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 rounded-2xl border border-gray-100 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-xl">
                  <CreditCard className="size-5 text-green-600" />
                </div>
                <p className="text-sm">Debit card</p>
              </div>
              <ChevronRight className="size-5 text-gray-400" />
            </button>

            <button
              className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 rounded-2xl border border-gray-100 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <Smartphone className="size-5 text-purple-600" />
                </div>
                <p className="text-sm">Reload PIN</p>
              </div>
              <ChevronRight className="size-5 text-gray-400" />
            </button>

            {onNavigate && (
              <button
                onClick={() => onNavigate('international')}
                className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 rounded-2xl border-2 border-red-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-3 rounded-xl">
                    <UserPlus className="size-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <p className="text-sm">International options</p>
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        NEW
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="size-5 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base">Linked Payment Methods</h3>
            <button 
              onClick={() => setShowLinkAccount(true)}
              className="text-blue-600 text-sm hover:text-blue-700"
            >
              + Add New
            </button>
          </div>
          
          {linkedAccounts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <CreditCard className="size-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-2">No payment methods yet</p>
              <p className="text-sm text-gray-400 mb-4">Link your first account to get started</p>
              <Button 
                onClick={() => setShowLinkAccount(true)}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
              >
                Add Payment Method
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {linkedAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-3 rounded-xl">
                      {getAccountIcon(account.type)}
                    </div>
                    <div>
                      <p className="text-sm">{account.provider}</p>
                      <p className="text-xs text-gray-500">
                        {account.accountNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      Active
                    </span>
                    <ChevronRight className="size-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Funds Dialog */}
      <Dialog open={showAddFunds} onOpenChange={setShowAddFunds}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Add Money</DialogTitle>
            <DialogDescription>Reload your wallet balance</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddFunds} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add-amount">Amount (TZS)</Label>
              <Input
                id="add-amount"
                type="number"
                placeholder="10,000"
                className="h-12 rounded-xl"
                value={addFundsData.amount}
                onChange={(e) => setAddFundsData({ ...addFundsData, amount: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-source">Payment Method</Label>
              <Select
                value={addFundsData.source}
                onValueChange={(value) => setAddFundsData({ ...addFundsData, source: value })}
              >
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {linkedAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.provider} - {account.accountNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-pin">PIN</Label>
              <Input
                id="add-pin"
                type="password"
                placeholder="Enter your PIN"
                className="h-12 rounded-xl"
                maxLength={4}
                value={addFundsData.pin}
                onChange={(e) => setAddFundsData({ ...addFundsData, pin: e.target.value })}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl"
            >
              Add Money
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Send Money Dialog */}
      <Dialog open={showSendMoney} onOpenChange={setShowSendMoney}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Send Money</DialogTitle>
            <DialogDescription>Transfer to any mobile number</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSendMoney} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="send-recipient">Recipient Phone Number</Label>
              <Input
                id="send-recipient"
                placeholder="+255 XXX XXX XXX"
                className="h-12 rounded-xl"
                value={sendMoneyData.recipient}
                onChange={(e) => setSendMoneyData({ ...sendMoneyData, recipient: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="send-amount">Amount (TZS)</Label>
              <Input
                id="send-amount"
                type="number"
                placeholder="10,000"
                className="h-12 rounded-xl"
                value={sendMoneyData.amount}
                onChange={(e) => setSendMoneyData({ ...sendMoneyData, amount: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="send-pin">PIN</Label>
              <Input
                id="send-pin"
                type="password"
                placeholder="Enter your PIN"
                className="h-12 rounded-xl"
                maxLength={4}
                value={sendMoneyData.pin}
                onChange={(e) => setSendMoneyData({ ...sendMoneyData, pin: e.target.value })}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl"
            >
              Send Money
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Request Money Dialog */}
      <Dialog open={showRequestMoney} onOpenChange={setShowRequestMoney}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Request Money</DialogTitle>
            <DialogDescription>Ask someone to send you money</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRequestMoney} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="request-recipient">From Phone Number</Label>
              <Input
                id="request-recipient"
                placeholder="+255 XXX XXX XXX"
                className="h-12 rounded-xl"
                value={requestMoneyData.recipient}
                onChange={(e) => setRequestMoneyData({ ...requestMoneyData, recipient: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="request-amount">Amount (TZS)</Label>
              <Input
                id="request-amount"
                type="number"
                placeholder="10,000"
                className="h-12 rounded-xl"
                value={requestMoneyData.amount}
                onChange={(e) => setRequestMoneyData({ ...requestMoneyData, amount: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="request-message">Message (Optional)</Label>
              <Input
                id="request-message"
                placeholder="What's this for?"
                className="h-12 rounded-xl"
                value={requestMoneyData.message}
                onChange={(e) => setRequestMoneyData({ ...requestMoneyData, message: e.target.value })}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl"
            >
              Request Money
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Link Account Dialog */}
      <Dialog open={showLinkAccount} onOpenChange={setShowLinkAccount}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>Link a new account or card</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLinkAccount} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="link-type">Account Type</Label>
              <Select
                value={linkAccountData.type}
                onValueChange={(value) => setLinkAccountData({ ...linkAccountData, type: value })}
              >
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mobile_money">Mobile Money</SelectItem>
                  <SelectItem value="bank">Bank Account</SelectItem>
                  <SelectItem value="card">Debit/Credit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-provider">Provider</Label>
              <Input
                id="link-provider"
                placeholder="M-Pesa, CRDB, etc."
                className="h-12 rounded-xl"
                value={linkAccountData.provider}
                onChange={(e) => setLinkAccountData({ ...linkAccountData, provider: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-account">Account Number</Label>
              <Input
                id="link-account"
                placeholder="Enter account number"
                className="h-12 rounded-xl"
                value={linkAccountData.accountNumber}
                onChange={(e) => setLinkAccountData({ ...linkAccountData, accountNumber: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-pin">PIN</Label>
              <Input
                id="link-pin"
                type="password"
                placeholder="Enter your PIN"
                className="h-12 rounded-xl"
                maxLength={4}
                value={linkAccountData.pin}
                onChange={(e) => setLinkAccountData({ ...linkAccountData, pin: e.target.value })}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl"
            >
              Link Account
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>My QR Code</DialogTitle>
            <DialogDescription>Share this to receive payments</DialogDescription>
          </DialogHeader>
          {qrCodeData && (
            <div className="space-y-4">
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 text-center">
                <div className="bg-gradient-to-br from-blue-600 to-cyan-500 w-48 h-48 mx-auto rounded-2xl flex items-center justify-center mb-4">
                  <QrCode className="size-32 text-white" />
                </div>
                <p className="text-sm text-gray-500">QR Code ID</p>
                <p className="text-xs  text-gray-400 break-all px-4">{qrCodeData.qrCode}</p>
                {qrCodeData.amount > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="text-2xl text-gray-900">{formatCurrency(qrCodeData.amount)}</p>
                  </div>
                )}
              </div>
              <div className="text-center text-sm text-gray-500">
                {qrCodeData.amount > 0 
                  ? 'This QR code is for a specific amount'
                  : 'This QR code can be used for any amount'}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}