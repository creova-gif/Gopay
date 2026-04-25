import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User } from '../App';
import { 
  ArrowLeft, Send, Users, CreditCard, Check, Shield, Clock, 
  User as UserIcon, Phone, Mail, Contact, Heart, Gift, Banknote,
  ArrowRight, Search, Star, History
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface SendMoneyPageProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

type TransferMethod = 'gopay' | 'mobile' | 'bank';

export function SendMoneyPage({ user, accessToken, onBack }: SendMoneyPageProps) {
  const [transferMethod, setTransferMethod] = useState<TransferMethod>('gopay');
  const [step, setStep] = useState<'select' | 'details' | 'confirm' | 'success'>('select');
  const [transferType, setTransferType] = useState<'regular' | 'gift' | 'request'>('regular');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [pin, setPin] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sending, setSending] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/wallet/balance`,
      { headers: { 'Authorization': `Bearer ${accessToken}` } }
    )
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setBalance(data.balance ?? null))
      .catch(() => {});
  }, [accessToken]);

  // Recent contacts
  const recentContacts = [
    { id: '1', name: 'Sarah Mwamba', phone: '+255 712 345 001', avatar: '👩', lastAmount: 50000, gopayUser: true },
    { id: '2', name: 'John Kamau', phone: '+255 713 456 002', avatar: '👨', lastAmount: 25000, gopayUser: true },
    { id: '3', name: 'Grace Ndege', phone: '+255 714 567 003', avatar: '👩', lastAmount: 100000, gopayUser: false },
    { id: '4', name: 'David Moshi', phone: '+255 715 678 004', avatar: '👨', lastAmount: 15000, gopayUser: true },
    { id: '5', name: 'Mary Kimani', phone: '+255 716 789 005', avatar: '👩', lastAmount: 75000, gopayUser: false },
  ];

  // Quick amounts
  const quickAmounts = [5000, 10000, 20000, 50000, 100000, 200000];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSelectContact = (contact: any) => {
    setRecipient(contact.phone);
    setStep('details');
  };

  const handleProceedToConfirm = () => {
    if (!recipient || !amount || parseFloat(amount) <= 0) {
      toast.error('Please enter recipient and amount');
      return;
    }
    setStep('confirm');
  };

  const handleConfirmTransfer = async () => {
    if (pin.length !== 4) {
      toast.error('Please enter a valid 4-digit PIN');
      return;
    }

    setSending(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/transfer/send`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            method: transferMethod,
            recipient: recipient,
            amount: parseFloat(amount),
            message: message,
            pin: pin,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setTransactionRef(result.reference || `TXN${Date.now()}`);
        setStep('success');
        setPin('');
      } else {
        const err = await response.json();
        toast.error(err.error || 'Transfer failed. Please try again.');
      }
    } catch (error) {
      console.error('Error processing transfer:', error);
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setSending(false);
    }
  };

  const resetTransfer = () => {
    setStep('select');
    setRecipient('');
    setAmount('');
    setMessage('');
    setPin('');
    setTransactionRef('');
  };

  // Success screen
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="size-10 text-green-600" />
          </div>
          <h2 className="text-2xl mb-2">Money Sent!</h2>
          <p className="text-gray-500 mb-6">Transfer completed successfully</p>
          
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 mb-6 text-white">
            <div className="text-5xl mb-4">💸</div>
            <div className="text-4xl mb-2">{formatCurrency(parseFloat(amount))}</div>
            <p className="text-green-100 text-sm">Sent to {recipient}</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Reference</span>
              <span className="font-mono text-green-600 text-sm">{transactionRef}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Method</span>
              <span className="text-sm capitalize">{transferMethod === 'gopay' ? 'goPay Wallet' : transferMethod === 'mobile' ? 'Mobile Money' : 'Bank Transfer'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Date & Time</span>
              <span className="text-sm">{new Date().toLocaleString()}</span>
            </div>
            {message && (
              <div className="pt-3 border-t border-gray-200">
                <p className="text-gray-500 text-sm mb-1">Message</p>
                <p className="text-sm">{message}</p>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 text-sm text-blue-900">
            <Shield className="size-5 inline mr-2" />
            Transaction is secured and encrypted
          </div>

          <Button
            onClick={resetTransfer}
            className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full mb-3"
          >
            Send More Money
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

  // Confirm screen
  if (step === 'confirm') {
    const transferAmount = parseFloat(amount);
    const fee = transferMethod === 'gopay' ? 0 : transferMethod === 'mobile' ? 1000 : 2000;
    const total = transferAmount + fee;

    return (
      <div className="min-h-screen bg-gray-50 pb-6">
        <div className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 px-4 pt-6 pb-8 rounded-b-3xl shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setStep('details')}
              className="bg-white/20 p-3 rounded-full hover:bg-white/30 transition-all"
            >
              <ArrowLeft className="size-5 text-white" />
            </button>
            <h1 className="text-2xl text-white">Confirm Transfer</h1>
          </div>
        </div>

        <div className="px-4 -mt-2 space-y-4">
          {/* Amount Display */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white shadow-lg text-center">
            <p className="text-green-100 text-sm mb-2">You're sending</p>
            <p className="text-5xl mb-4">{formatCurrency(transferAmount)}</p>
            <div className="bg-white/20 rounded-xl p-4">
              <p className="text-sm mb-1">To</p>
              <p className="text-lg">{recipient}</p>
            </div>
          </div>

          {/* Transfer Details */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-base mb-4">Transfer Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-gray-600">Transfer Method</span>
                <span className="capitalize">
                  {transferMethod === 'gopay' ? 'goPay Wallet' : transferMethod === 'mobile' ? 'Mobile Money' : 'Bank Transfer'}
                </span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-gray-600">Amount</span>
                <span>{formatCurrency(transferAmount)}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-gray-600">Transfer Fee</span>
                <span className={fee === 0 ? 'text-green-600' : ''}>
                  {fee === 0 ? 'FREE' : formatCurrency(fee)}
                </span>
              </div>
              <div className="flex items-center justify-between text-lg pt-2">
                <span>Total</span>
                <span className="text-green-600">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {message && (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-base mb-3">Message</h3>
              <p className="text-gray-700 bg-gray-50 rounded-xl p-4">{message}</p>
            </div>
          )}

          {/* Payment Method */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-base mb-4">Payment From</h3>
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-5 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-100 text-sm">Source</span>
                <CreditCard className="size-5" />
              </div>
              <p className="text-2xl mb-1">goPay Wallet</p>
              <p className="text-green-100 text-sm">Balance: {balance !== null ? formatCurrency(balance) : '—'}</p>
            </div>
          </div>

          {/* PIN Entry */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <Label htmlFor="transfer-pin" className="text-base mb-3 block">Enter PIN to confirm</Label>
            <Input
              id="transfer-pin"
              type="password"
              placeholder="••••"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              className="text-center text-2xl tracking-widest h-16 rounded-xl"
            />
          </div>

          {/* Security Notice */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3">
            <Shield className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-900">
              <p className="font-medium mb-1">Secure Transfer</p>
              <p className="text-green-700">Your money will be transferred instantly with end-to-end encryption</p>
            </div>
          </div>

          {/* Confirm Button */}
          <Button
            onClick={handleConfirmTransfer}
            disabled={pin.length !== 4 || sending}
            className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full text-lg disabled:opacity-50"
          >
            {sending ? 'Sending...' : `Send ${formatCurrency(total)}`}
          </Button>
        </div>
      </div>
    );
  }

  // Details screen
  if (step === 'details') {
    return (
      <div className="min-h-screen bg-gray-50 pb-6">
        <div className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 px-4 pt-6 pb-8 rounded-b-3xl shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setStep('select')}
              className="bg-white/20 p-3 rounded-full hover:bg-white/30 transition-all"
            >
              <ArrowLeft className="size-5 text-white" />
            </button>
            <h1 className="text-2xl text-white">Transfer Details</h1>
          </div>
        </div>

        <div className="px-4 -mt-2 space-y-4">
          {/* Transfer Method */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-base mb-4">Transfer Method</h3>
            <div className="space-y-3">
              <button
                onClick={() => setTransferMethod('gopay')}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  transferMethod === 'gopay'
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Banknote className="size-6 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p>goPay Wallet</p>
                      <p className="text-sm text-gray-500">Instant • Free</p>
                    </div>
                  </div>
                  {transferMethod === 'gopay' && (
                    <Check className="size-6 text-green-600" />
                  )}
                </div>
              </button>

              <button
                onClick={() => setTransferMethod('mobile')}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  transferMethod === 'mobile'
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Phone className="size-6 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p>Mobile Money</p>
                      <p className="text-sm text-gray-500">M-Pesa, Tigo, Airtel • TZS 1,000 fee</p>
                    </div>
                  </div>
                  {transferMethod === 'mobile' && (
                    <Check className="size-6 text-green-600" />
                  )}
                </div>
              </button>

              <button
                onClick={() => setTransferMethod('bank')}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  transferMethod === 'bank'
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <CreditCard className="size-6 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <p>Bank Transfer</p>
                      <p className="text-sm text-gray-500">1-2 days • TZS 2,000 fee</p>
                    </div>
                  </div>
                  {transferMethod === 'bank' && (
                    <Check className="size-6 text-green-600" />
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Recipient */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <Label htmlFor="recipient" className="text-base mb-3 block">
              {transferMethod === 'gopay' ? 'Recipient goPay ID or Phone' : transferMethod === 'mobile' ? 'Mobile Number' : 'Bank Account Number'}
            </Label>
            <Input
              id="recipient"
              placeholder={transferMethod === 'gopay' ? '+255 712 345 678' : transferMethod === 'mobile' ? '+255 712 345 678' : '0123456789'}
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="h-14 text-lg"
            />
          </div>

          {/* Amount */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <Label htmlFor="amount" className="text-base mb-3 block">Amount</Label>
            <div className="relative mb-4">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">TZS</span>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-20 h-16 text-3xl"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt.toString())}
                  className="bg-gray-100 hover:bg-green-100 hover:text-green-700 py-3 rounded-xl transition-all"
                >
                  <span className="text-sm">{formatCurrency(amt).replace('TSh', '')}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <Label htmlFor="message" className="text-base mb-3 block">Message (Optional)</Label>
            <Input
              id="message"
              placeholder="e.g., For groceries, Happy birthday!"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="h-12"
            />
          </div>

          {/* Proceed Button */}
          <Button
            onClick={handleProceedToConfirm}
            disabled={!recipient || !amount || parseFloat(amount) <= 0}
            className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full text-lg disabled:opacity-50"
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  // Select recipient screen
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
            <h1 className="text-3xl text-white">Send Money</h1>
            <p className="text-green-100 text-sm">To family, friends & anyone</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="size-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search contacts or enter number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 -mt-2 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setStep('details')}
              className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-all"
            >
              <div className="bg-green-600 p-3 rounded-full">
                <Send className="size-5 text-white" />
              </div>
              <span className="text-xs text-gray-700">Send Money</span>
            </button>
            <button 
              onClick={() => {
                setTransferType('gift');
                setStep('details');
              }}
              className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all"
            >
              <div className="bg-blue-600 p-3 rounded-full">
                <Gift className="size-5 text-white" />
              </div>
              <span className="text-xs text-gray-700">Send Gift</span>
            </button>
            <button 
              onClick={() => {
                setTransferType('request');
                setStep('details');
              }}
              className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all"
            >
              <div className="bg-purple-600 p-3 rounded-full">
                <Heart className="size-5 text-white" />
              </div>
              <span className="text-xs text-gray-700">Request</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Contacts */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg">Recent</h3>
          <button className="text-green-600 text-sm">View All</button>
        </div>

        <div className="space-y-3">
          {recentContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => handleSelectContact(contact)}
              className="w-full bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all border border-gray-100 text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{contact.avatar}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{contact.name}</p>
                      {contact.gopayUser && (
                        <div className="bg-green-100 px-2 py-0.5 rounded-full">
                          <span className="text-xs text-green-700">goPay</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{contact.phone}</p>
                    <p className="text-xs text-gray-400 mt-1">Last sent: {formatCurrency(contact.lastAmount)}</p>
                  </div>
                </div>
                <ArrowRight className="size-5 text-gray-400" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}