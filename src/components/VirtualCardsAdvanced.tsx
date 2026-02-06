import { useState } from 'react';
import { Button } from './ui/button';
import { User } from '../App';
import { 
  ArrowLeft, CreditCard, Plus, Lock, Unlock, Copy, Eye, EyeOff,
  ShoppingBag, Calendar, Zap, Shield, Check, AlertCircle, 
  TrendingUp, Pause, Trash2, Edit3, RefreshCw, Store, X
} from 'lucide-react';

interface VirtualCardsAdvancedProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

interface VirtualCard {
  id: string;
  name: string;
  type: 'single-use' | 'merchant-locked' | 'subscription' | 'standard';
  cardNumber: string;
  cvv: string;
  expiry: string;
  balance: number;
  limit: number;
  merchant?: string;
  status: 'active' | 'frozen' | 'used' | 'expired';
  usageCount: number;
  createdAt: string;
}

export function VirtualCardsAdvanced({ user, accessToken, onBack }: VirtualCardsAdvancedProps) {
  const [view, setView] = useState<'list' | 'create' | 'details'>('list');
  const [cards, setCards] = useState<VirtualCard[]>([
    {
      id: '1',
      name: 'Netflix Subscription',
      type: 'subscription',
      cardNumber: '4532 •••• •••• 1234',
      cvv: '***',
      expiry: '12/27',
      balance: 50000,
      limit: 50000,
      merchant: 'Netflix',
      status: 'active',
      usageCount: 12,
      createdAt: '2025-01-15',
    },
    {
      id: '2',
      name: 'Online Shopping',
      type: 'single-use',
      cardNumber: '5412 •••• •••• 5678',
      cvv: '***',
      expiry: '06/26',
      balance: 0,
      limit: 100000,
      status: 'used',
      usageCount: 1,
      createdAt: '2025-11-20',
    },
  ]);
  const [selectedCard, setSelectedCard] = useState<VirtualCard | null>(null);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [cardType, setCardType] = useState<'single-use' | 'merchant-locked' | 'subscription' | 'standard'>('single-use');
  const [cardName, setCardName] = useState('');
  const [cardLimit, setCardLimit] = useState('');
  const [merchantName, setMerchantName] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getCardTypeIcon = (type: string) => {
    switch (type) {
      case 'single-use':
        return <Zap className="size-4 text-orange-600" />;
      case 'merchant-locked':
        return <Store className="size-4 text-blue-600" />;
      case 'subscription':
        return <Calendar className="size-4 text-purple-600" />;
      default:
        return <CreditCard className="size-4 text-gray-600" />;
    }
  };

  const getCardTypeColor = (type: string) => {
    switch (type) {
      case 'single-use':
        return 'from-orange-500 to-red-500';
      case 'merchant-locked':
        return 'from-blue-500 to-cyan-500';
      case 'subscription':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-gray-500 to-gray-700';
    }
  };

  const handleCreateCard = () => {
    if (!cardName || !cardLimit) {
      alert('Please fill in all required fields');
      return;
    }

    const newCard: VirtualCard = {
      id: Date.now().toString(),
      name: cardName,
      type: cardType,
      cardNumber: `${Math.floor(1000 + Math.random() * 9000)} •••• •••• ${Math.floor(1000 + Math.random() * 9000)}`,
      cvv: '***',
      expiry: '12/28',
      balance: parseFloat(cardLimit),
      limit: parseFloat(cardLimit),
      merchant: cardType === 'merchant-locked' || cardType === 'subscription' ? merchantName : undefined,
      status: 'active',
      usageCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setCards([newCard, ...cards]);
    setCardName('');
    setCardLimit('');
    setMerchantName('');
    setView('list');
    alert('Virtual card created successfully! 🎉');
  };

  const toggleCardStatus = (cardId: string) => {
    setCards(cards.map(card => 
      card.id === cardId 
        ? { ...card, status: card.status === 'active' ? 'frozen' : 'active' }
        : card
    ));
  };

  const deleteCard = (cardId: string) => {
    if (confirm('Are you sure you want to delete this card?')) {
      setCards(cards.filter(card => card.id !== cardId));
      setView('list');
    }
  };

  // Card List View
  if (view === 'list') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                <ArrowLeft className="size-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold">Virtual Cards Pro</h1>
                <p className="text-sm text-gray-500">Advanced card management</p>
              </div>
            </div>
            <button
              onClick={() => setView('create')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="size-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Card Type Explainer */}
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <Shield className="size-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1">Next-Gen Security</h2>
                <p className="text-white/90 text-sm">4 types of virtual cards for every need</p>
              </div>
            </div>
          </div>

          {/* Card Type Options */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-4 text-white">
              <Zap className="size-8 mb-2 opacity-90" />
              <p className="font-bold mb-1">Single-Use</p>
              <p className="text-xs text-white/80">Auto-destroys after 1 payment</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-4 text-white">
              <Store className="size-8 mb-2 opacity-90" />
              <p className="font-bold mb-1">Merchant-Locked</p>
              <p className="text-xs text-white/80">Works only at 1 shop</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-4 text-white">
              <Calendar className="size-8 mb-2 opacity-90" />
              <p className="font-bold mb-1">Subscription</p>
              <p className="text-xs text-white/80">Auto-freeze on cancel</p>
            </div>
            <div className="bg-gradient-to-br from-gray-500 to-gray-700 rounded-2xl p-4 text-white">
              <CreditCard className="size-8 mb-2 opacity-90" />
              <p className="font-bold mb-1">Standard</p>
              <p className="text-xs text-white/80">Multi-use everywhere</p>
            </div>
          </div>

          {/* Cards List */}
          <div>
            <h3 className="font-bold mb-3">Your Virtual Cards ({cards.length})</h3>
            <div className="space-y-3">
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => {
                    setSelectedCard(card);
                    setView('details');
                  }}
                  className="w-full text-left"
                >
                  <div className={`bg-gradient-to-br ${getCardTypeColor(card.type)} rounded-2xl p-5 text-white relative overflow-hidden shadow-lg`}>
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      {card.status === 'active' && (
                        <span className="bg-green-400/30 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-semibold">
                          Active
                        </span>
                      )}
                      {card.status === 'frozen' && (
                        <span className="bg-blue-400/30 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-semibold">
                          Frozen
                        </span>
                      )}
                      {card.status === 'used' && (
                        <span className="bg-gray-400/30 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-semibold">
                          Used
                        </span>
                      )}
                    </div>

                    {/* Card Type */}
                    <div className="flex items-center gap-2 mb-3">
                      {getCardTypeIcon(card.type)}
                      <span className="text-xs text-white/80 uppercase tracking-wider">
                        {card.type.replace('-', ' ')}
                      </span>
                    </div>

                    {/* Card Name */}
                    <p className="font-bold text-lg mb-1">{card.name}</p>
                    {card.merchant && (
                      <p className="text-sm text-white/80 mb-3">Locked to: {card.merchant}</p>
                    )}

                    {/* Card Number */}
                    <p className="text-xl font-mono tracking-wider mb-4">{card.cardNumber}</p>

                    {/* Card Details */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-white/60 mb-1">Balance</p>
                        <p className="font-bold">{formatCurrency(card.balance)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-white/60 mb-1">Usage</p>
                        <p className="font-bold">{card.usageCount}x</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-white/60 mb-1">Expires</p>
                        <p className="font-bold">{card.expiry}</p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}

              {cards.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CreditCard className="size-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-4">No virtual cards yet</p>
                  <Button
                    onClick={() => setView('create')}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6"
                  >
                    Create Your First Card
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Create Card View
  if (view === 'create') {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('list')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-lg font-bold">Create Virtual Card</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Card Type Selection */}
          <div className="bg-white rounded-2xl p-6">
            <label className="block font-bold mb-3">Select Card Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setCardType('single-use')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  cardType === 'single-use' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                }`}
              >
                <Zap className="size-6 text-orange-600 mb-2" />
                <p className="font-bold text-sm">Single-Use</p>
                <p className="text-xs text-gray-500">One payment only</p>
              </button>
              <button
                onClick={() => setCardType('merchant-locked')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  cardType === 'merchant-locked' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <Store className="size-6 text-blue-600 mb-2" />
                <p className="font-bold text-sm">Merchant-Locked</p>
                <p className="text-xs text-gray-500">One shop only</p>
              </button>
              <button
                onClick={() => setCardType('subscription')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  cardType === 'subscription' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                }`}
              >
                <Calendar className="size-6 text-purple-600 mb-2" />
                <p className="font-bold text-sm">Subscription</p>
                <p className="text-xs text-gray-500">For recurring bills</p>
              </button>
              <button
                onClick={() => setCardType('standard')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  cardType === 'standard' ? 'border-gray-500 bg-gray-50' : 'border-gray-200'
                }`}
              >
                <CreditCard className="size-6 text-gray-600 mb-2" />
                <p className="font-bold text-sm">Standard</p>
                <p className="text-xs text-gray-500">Multi-use</p>
              </button>
            </div>
          </div>

          {/* Card Details */}
          <div className="bg-white rounded-2xl p-6 space-y-4">
            <div>
              <label className="block font-bold mb-2 text-sm">Card Name</label>
              <input
                type="text"
                placeholder="e.g., Netflix, Amazon, Online Shopping"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>

            {(cardType === 'merchant-locked' || cardType === 'subscription') && (
              <div>
                <label className="block font-bold mb-2 text-sm">Merchant Name</label>
                <input
                  type="text"
                  placeholder="e.g., Netflix, Jumia, Amazon"
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block font-bold mb-2 text-sm">Card Limit (TZS)</label>
              <input
                type="number"
                placeholder="50000"
                value={cardLimit}
                onChange={(e) => setCardLimit(e.target.value)}
                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Maximum amount this card can spend</p>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex gap-3">
              <Shield className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Why Virtual Cards?</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Protect your main card from fraud</li>
                  <li>Control spending per merchant</li>
                  <li>Cancel anytime without affecting other payments</li>
                  <li>Track exactly where money goes</li>
                </ul>
              </div>
            </div>
          </div>

          <Button
            onClick={handleCreateCard}
            disabled={!cardName || !cardLimit || ((cardType === 'merchant-locked' || cardType === 'subscription') && !merchantName)}
            className="w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-full font-bold text-lg disabled:opacity-50"
          >
            Create Card
          </Button>
        </div>
      </div>
    );
  }

  // Card Details View
  if (view === 'details' && selectedCard) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('list')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold">{selectedCard.name}</h1>
              <p className="text-sm text-gray-500">{selectedCard.type.replace('-', ' ')}</p>
            </div>
            <button
              onClick={() => deleteCard(selectedCard.id)}
              className="p-2 hover:bg-red-100 rounded-full text-red-600"
            >
              <Trash2 className="size-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Card Display */}
          <div className={`bg-gradient-to-br ${getCardTypeColor(selectedCard.type)} rounded-3xl p-6 text-white shadow-xl`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {getCardTypeIcon(selectedCard.type)}
                <span className="text-xs text-white/80 uppercase tracking-wider">
                  {selectedCard.type.replace('-', ' ')}
                </span>
              </div>
              <CreditCard className="size-8 text-white/30" />
            </div>

            <p className="font-bold text-xl mb-1">{selectedCard.name}</p>
            {selectedCard.merchant && (
              <p className="text-sm text-white/80 mb-6">🔒 Locked to: {selectedCard.merchant}</p>
            )}

            <p className="text-2xl font-mono tracking-wider mb-6">{selectedCard.cardNumber}</p>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/60 mb-1">CVV</p>
                <div className="flex items-center gap-2">
                  <p className="font-bold">{showCardDetails ? selectedCard.cvv.replace(/\*/g, Math.floor(Math.random() * 10).toString()) : selectedCard.cvv}</p>
                  <button
                    onClick={() => setShowCardDetails(!showCardDetails)}
                    className="p-1 hover:bg-white/20 rounded"
                  >
                    {showCardDetails ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs text-white/60 mb-1">Expires</p>
                <p className="font-bold">{selectedCard.expiry}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/60 mb-1">Balance</p>
                <p className="font-bold text-lg">{formatCurrency(selectedCard.balance)}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => toggleCardStatus(selectedCard.id)}
              className={`h-14 ${
                selectedCard.status === 'active'
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              } rounded-2xl font-bold`}
            >
              {selectedCard.status === 'active' ? (
                <>
                  <Lock className="size-5 mr-2" />
                  Freeze Card
                </>
              ) : (
                <>
                  <Unlock className="size-5 mr-2" />
                  Unfreeze Card
                </>
              )}
            </Button>
            <Button
              onClick={() => alert('Card details copied!')}
              className="h-14 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-2xl font-bold"
            >
              <Copy className="size-5 mr-2" />
              Copy Details
            </Button>
          </div>

          {/* Card Stats */}
          <div className="bg-white rounded-2xl p-6">
            <h3 className="font-bold mb-4">Card Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Usage:</span>
                <span className="font-semibold">{selectedCard.usageCount} transactions</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="font-semibold">{selectedCard.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Limit:</span>
                <span className="font-semibold">{formatCurrency(selectedCard.limit)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Remaining:</span>
                <span className="font-semibold text-green-600">{formatCurrency(selectedCard.balance)}</span>
              </div>
            </div>
          </div>

          {/* Security Info */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
            <div className="flex gap-3">
              <Check className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-semibold mb-1">Protected by goPay</p>
                <p className="text-xs">
                  {selectedCard.type === 'single-use' && 'This card will auto-delete after first use.'}
                  {selectedCard.type === 'merchant-locked' && `This card only works at ${selectedCard.merchant}.`}
                  {selectedCard.type === 'subscription' && 'Auto-freezes when subscription cancelled.'}
                  {selectedCard.type === 'standard' && 'Can be used at any merchant.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
