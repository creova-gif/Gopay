import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User } from '../App';
import { 
  ArrowLeft, 
  Globe,
  Copy,
  Check,
  DollarSign,
  Send,
  Download,
  Info
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

interface InternationalPageProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

export function InternationalPage({ user, accessToken, onBack }: InternationalPageProps) {
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('');

  const accountNumber = `goPay-${user.phone}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const receiveProviders = [
    { 
      id: 'pandaremit', 
      name: 'Panda Remit', 
      logo: '🐼',
      description: 'Fast transfers from China',
      badge: 'Recommended',
      color: 'border-red-300 bg-red-50'
    },
    { 
      id: 'western', 
      name: 'Western Union', 
      logo: '💛',
      description: 'Global money transfer',
      badge: '',
      color: ''
    },
    { 
      id: 'wise', 
      name: 'Wise', 
      logo: '💚',
      description: 'Low-cost international',
      badge: '',
      color: ''
    },
    { 
      id: 'worldremit', 
      name: 'WorldRemit', 
      logo: '🌍',
      description: 'Send from 50+ countries',
      badge: '',
      color: ''
    },
    { 
      id: 'remitly', 
      name: 'Remitly', 
      logo: '💙',
      description: 'Fast delivery guaranteed',
      badge: '',
      color: ''
    },
  ];

  const sendProviders = [
    { 
      id: 'wise', 
      name: 'Wise', 
      rate: 0.00040,
      fee: 2500,
      time: '1-2 days',
      logo: '💚'
    },
    { 
      id: 'western', 
      name: 'Western Union', 
      rate: 0.00038,
      fee: 5000,
      time: 'Minutes',
      logo: '💛'
    },
    { 
      id: 'worldremit', 
      name: 'WorldRemit', 
      rate: 0.00039,
      fee: 3000,
      time: '1-3 days',
      logo: '🌍'
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-4 pt-6 pb-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={onBack}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-full"
            >
              <ArrowLeft className="size-5 text-white" />
            </button>
            <div>
              <h1 className="text-white text-xl">International Options</h1>
              <p className="text-blue-100 text-sm">Send & receive money worldwide</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowSendDialog(true)}
            className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 rounded-2xl text-white transition-all"
          >
            <Send className="size-8" />
            <span className="text-sm">Send Money</span>
            <span className="text-xs text-blue-100">To overseas</span>
          </button>

          <button
            className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 rounded-2xl text-white transition-all"
            onClick={() => { const el = document.getElementById('intl-account-number'); el?.scrollIntoView({ behavior: 'smooth' }); }}
          >
            <Download className="size-8" />
            <span className="text-sm">Receive Money</span>
            <span className="text-xs text-green-100">From overseas</span>
          </button>
        </div>

        {/* Your Account Info */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base">Your eWallet account number</h3>
            <button
              className="text-blue-600 text-sm flex items-center gap-1"
              onClick={() => { const el = document.getElementById('intl-account-number'); el?.scrollIntoView({ behavior: 'smooth' }); }}
            >
              <Info className="size-4" />
              How to receive
            </button>
          </div>
          <div id="intl-account-number" className="bg-white rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Share this to receive money</p>
                <p className="text-lg text-gray-900 font-mono">{accountNumber}</p>
              </div>
              <button
                onClick={handleCopy}
                className="bg-blue-100 hover:bg-blue-200 p-3 rounded-xl transition-colors"
              >
                {copied ? (
                  <Check className="size-5 text-blue-600" />
                ) : (
                  <Copy className="size-5 text-blue-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Receive Money From Overseas */}
        <div>
          <h3 className="text-base mb-3">Receive money from overseas via:</h3>
          <div className="space-y-3">
            {receiveProviders.map((provider) => (
              <button
                key={provider.id}
                className={`w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 rounded-2xl border-2 transition-all ${
                  provider.color || 'border-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <span className="text-2xl">{provider.logo}</span>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <p className="text-sm">{provider.name}</p>
                      {provider.badge && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {provider.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{provider.description}</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700">
                  <span className="text-sm">Select</span>
                </button>
              </button>
            ))}
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Globe className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-900">Safe & Secure</p>
              <p className="text-xs text-blue-600 mt-1">
                All international transfers are protected with bank-level security. Receive money from over 200 countries.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Send Money Dialog */}
      <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Send Money Overseas</DialogTitle>
            <DialogDescription>Choose your preferred provider</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Amount Input */}
            <div>
              <Label>Amount to Send (TZS)</Label>
              <Input
                type="number"
                placeholder="0"
                className="h-12 text-lg rounded-xl"
              />
            </div>

            {/* Provider Options */}
            <div>
              <Label>Select Provider</Label>
              <div className="space-y-2 mt-2">
                {sendProviders.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => setSelectedProvider(provider.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                      selectedProvider === provider.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{provider.logo}</span>
                      <div className="text-left">
                        <p className="text-sm">{provider.name}</p>
                        <p className="text-xs text-gray-500">
                          Fee: {formatCurrency(provider.fee)} • {provider.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Rate</p>
                      <p className="text-sm">${provider.rate.toFixed(5)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Button
              disabled={!selectedProvider}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl"
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
