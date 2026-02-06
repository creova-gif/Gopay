import { useState } from 'react';
import { Button } from './ui/button';
import { User } from '../App';
import { 
  ArrowLeft, Sparkles, Send, MapPin, TrendingDown,
  ShoppingCart, AlertCircle, Check, Clock, Zap,
  BarChart3, Package, RefreshCw, Star, Camera
} from 'lucide-react';

interface AISmartShoppingAssistantProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  message: string;
  timestamp: string;
  suggestions?: string[];
  products?: ProductSuggestion[];
  priceComparison?: PriceComparison;
}

interface ProductSuggestion {
  name: string;
  price: number;
  vendor: string;
  location: string;
  rating: number;
}

interface PriceComparison {
  product: string;
  prices: Array<{
    vendor: string;
    price: number;
    location: string;
    deliveryFee: number;
    eta: string;
  }>;
}

interface AutoReorderItem {
  id: string;
  product: string;
  lastPurchased: string;
  frequency: string;
  nextSuggested: string;
  avgPrice: number;
  status: 'due' | 'upcoming' | 'reordered';
}

export function AISmartShoppingAssistant({ user, accessToken, onBack }: AISmartShoppingAssistantProps) {
  const [view, setView] = useState<'chat' | 'price-compare' | 'auto-reorder'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      message: `Hi ${user.name.split(' ')[0]}! 👋 I'm your Smart Shopping Assistant. I can help you:

• Find products at the best prices
• Compare prices across Tanzania
• Auto-reorder regular items
• Discover deals near you
• Scan products to find sellers

What can I help you with today?`,
      timestamp: new Date().toISOString(),
      suggestions: [
        'Find rice under 50,000 TZS',
        'Compare cooking oil prices',
        'What should I reorder?',
        'Best deals in Kariakoo',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [processing, setProcessing] = useState(false);

  const autoReorderItems: AutoReorderItem[] = [
    {
      id: '1',
      product: 'Premium Rice 25kg',
      lastPurchased: '2025-10-25',
      frequency: 'Monthly',
      nextSuggested: '2025-11-28',
      avgPrice: 45000,
      status: 'due',
    },
    {
      id: '2',
      product: 'Cooking Oil 5L',
      lastPurchased: '2025-11-10',
      frequency: 'Every 3 weeks',
      nextSuggested: '2025-12-01',
      avgPrice: 18000,
      status: 'upcoming',
    },
    {
      id: '3',
      product: 'Airtime Bundle',
      lastPurchased: '2025-11-22',
      frequency: 'Weekly',
      nextSuggested: '2025-11-29',
      avgPrice: 10000,
      status: 'due',
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: input,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = generateAIResponse(input);
      setMessages(prev => [...prev, aiResponse]);
      setProcessing(false);
    }, 1500);
  };

  const generateAIResponse = (query: string): ChatMessage => {
    const lowerQuery = query.toLowerCase();

    // Price comparison request
    if (lowerQuery.includes('compare') || lowerQuery.includes('price')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        message: 'I found cooking oil prices across Tanzania:',
        timestamp: new Date().toISOString(),
        priceComparison: {
          product: 'Cooking Oil 5L',
          prices: [
            {
              vendor: 'Kariakoo Wholesale',
              price: 16500,
              location: 'Kariakoo, Dar',
              deliveryFee: 2000,
              eta: '30 min',
            },
            {
              vendor: 'Village Supermarket',
              price: 18000,
              location: 'Mlimani City',
              deliveryFee: 3000,
              eta: '45 min',
            },
            {
              vendor: 'TSN Fresh',
              price: 17200,
              location: 'Sinza',
              deliveryFee: 2500,
              eta: '25 min',
            },
            {
              vendor: 'Shoppers Plaza',
              price: 19500,
              location: 'Masaki',
              deliveryFee: 4000,
              eta: '1 hour',
            },
          ],
        },
      };
    }

    // Reorder request
    if (lowerQuery.includes('reorder') || lowerQuery.includes('regular')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        message: 'Based on your purchase history, these items are due for reorder:',
        timestamp: new Date().toISOString(),
        products: [
          {
            name: 'Premium Rice 25kg',
            price: 45000,
            vendor: 'Kariakoo Wholesale',
            location: 'Kariakoo',
            rating: 4.8,
          },
          {
            name: 'Airtime Bundle 10,000 TZS',
            price: 10000,
            vendor: 'Vodacom',
            location: 'Digital',
            rating: 5.0,
          },
        ],
        suggestions: ['Reorder all items', 'Skip this month', 'View shopping list'],
      };
    }

    // Product search
    if (lowerQuery.includes('find') || lowerQuery.includes('rice') || lowerQuery.includes('school')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        message: 'I found these products matching your search:',
        timestamp: new Date().toISOString(),
        products: [
          {
            name: 'Premium Rice 25kg',
            price: 45000,
            vendor: 'Kariakoo Wholesale',
            location: 'Kariakoo, Dar',
            rating: 4.8,
          },
          {
            name: 'Local Rice 25kg',
            price: 38000,
            vendor: 'TSN Fresh',
            location: 'Sinza',
            rating: 4.5,
          },
          {
            name: 'Imported Rice 20kg',
            price: 52000,
            vendor: 'Shoppers Plaza',
            location: 'Masaki',
            rating: 4.9,
          },
        ],
        suggestions: ['Add to cart', 'Compare all prices', 'Save for later'],
      };
    }

    // Deals request
    if (lowerQuery.includes('deal') || lowerQuery.includes('cheap') || lowerQuery.includes('best')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        message: '🔥 Top deals in your area right now:',
        timestamp: new Date().toISOString(),
        products: [
          {
            name: 'Cooking Oil 5L (30% OFF)',
            price: 14000,
            vendor: 'Flash Deals TZ',
            location: 'Kariakoo',
            rating: 4.7,
          },
          {
            name: 'Fresh Vegetables Bundle',
            price: 6500,
            vendor: 'TSN Fresh',
            location: 'Sinza',
            rating: 4.9,
          },
        ],
        suggestions: ['View all deals', 'Set price alerts', 'Shop now'],
      };
    }

    // Default response
    return {
      id: Date.now().toString(),
      type: 'ai',
      message: 'I can help you with:\n\n• Product searches\n• Price comparisons\n• Auto-reorders\n• Finding deals\n• Location-based shopping\n\nTry asking: "Find rice under 50,000 TZS" or "Compare cooking oil prices"',
      timestamp: new Date().toISOString(),
      suggestions: [
        'Show me deals',
        'What should I reorder?',
        'Find school books',
        'Compare prices',
      ],
    };
  };

  // Chat View
  if (view === 'chat') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-violet-50 pb-24">
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">AI Shopping Assistant</h1>
              <p className="text-sm text-gray-500">Smart shopping powered by AI</p>
            </div>
            <Sparkles className="size-6 text-purple-600" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 bg-white border-b border-gray-100">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setView('price-compare')}
              className="bg-blue-100 text-blue-700 p-3 rounded-xl text-xs font-semibold hover:bg-blue-200 transition-all"
            >
              <BarChart3 className="size-4 mx-auto mb-1" />
              Compare
            </button>
            <button
              onClick={() => setView('auto-reorder')}
              className="bg-green-100 text-green-700 p-3 rounded-xl text-xs font-semibold hover:bg-green-200 transition-all"
            >
              <RefreshCw className="size-4 mx-auto mb-1" />
              Reorder
            </button>
            <button className="bg-purple-100 text-purple-700 p-3 rounded-xl text-xs font-semibold hover:bg-purple-200 transition-all">
              <Camera className="size-4 mx-auto mb-1" />
              Scan
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="p-4 space-y-4 pb-32">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${msg.type === 'user' ? 'order-2' : 'order-1'}`}>
                {msg.type === 'ai' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-gradient-to-r from-purple-500 to-violet-500 p-2 rounded-full">
                      <Sparkles className="size-4 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-gray-600">AI Assistant</span>
                  </div>
                )}
                
                <div className={`rounded-2xl p-4 ${
                  msg.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white border border-gray-200'
                }`}>
                  <p className="whitespace-pre-line text-sm">{msg.message}</p>
                  
                  {/* Product Suggestions */}
                  {msg.products && (
                    <div className="mt-3 space-y-2">
                      {msg.products.map((product, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                          <p className="font-bold text-sm mb-1">{product.name}</p>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-gray-600">{product.vendor}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="size-3 text-yellow-500 fill-yellow-500" />
                                <span className="text-xs">{product.rating}</span>
                              </div>
                            </div>
                            <p className="font-bold text-purple-600">{formatCurrency(product.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Price Comparison */}
                  {msg.priceComparison && (
                    <div className="mt-3">
                      <p className="font-bold text-sm mb-2">💰 Best Price: {formatCurrency(msg.priceComparison.prices[0].price)}</p>
                      <div className="space-y-2">
                        {msg.priceComparison.prices.map((price, idx) => (
                          <div key={idx} className={`rounded-lg p-3 ${
                            idx === 0 ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50 border border-gray-100'
                          }`}>
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-semibold text-sm">{price.vendor}</p>
                              {idx === 0 && <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">BEST</span>}
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <div>
                                <p className="text-gray-600">{price.location}</p>
                                <p className="text-gray-500">Delivery: {formatCurrency(price.deliveryFee)} • {price.eta}</p>
                              </div>
                              <p className="font-bold text-lg">{formatCurrency(price.price)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Reply Suggestions */}
                  {msg.suggestions && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => setInput(suggestion)}
                          className="bg-white border border-purple-200 text-purple-700 px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-purple-50 transition-all"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {processing && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl p-4">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm text-gray-500">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 max-w-md mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Ask anything... (e.g., Find rice under 50,000)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 h-12 px-4 border-2 border-gray-200 rounded-full focus:border-purple-500 focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || processing}
              className="bg-gradient-to-r from-purple-600 to-violet-600 text-white p-3 rounded-full hover:shadow-lg transition-all disabled:opacity-50"
            >
              <Send className="size-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Price Compare View
  if (view === 'price-compare') {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('chat')} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold">Price Comparison</h1>
              <p className="text-sm text-gray-500">Best prices across Tanzania</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Search */}
          <div className="bg-white rounded-2xl p-4">
            <input
              type="text"
              placeholder="Search product to compare prices..."
              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Recent Comparisons */}
          <div>
            <h3 className="font-bold mb-3">Recent Comparisons</h3>
            <div className="space-y-3">
              {['Cooking Oil 5L', 'Rice 25kg', 'School Uniforms'].map((product, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-bold">{product}</p>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">
                      Save up to 25%
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                      <p className="text-xs text-gray-600 mb-1">Cheapest</p>
                      <p className="font-bold text-green-600">{formatCurrency(16500)}</p>
                      <p className="text-xs text-gray-500">Kariakoo</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                      <p className="text-xs text-gray-600 mb-1">Average</p>
                      <p className="font-bold">{formatCurrency(18500)}</p>
                      <p className="text-xs text-gray-500">All vendors</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Auto-Reorder View
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setView('chat')} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="size-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">Smart Auto-Reorder</h1>
            <p className="text-sm text-gray-500">Never run out of essentials</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Info Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-3 mb-2">
            <RefreshCw className="size-5" />
            <p className="font-bold">AI learns your habits</p>
          </div>
          <p className="text-sm text-white/90">
            We track your purchase patterns and suggest reorders at the perfect time.
          </p>
        </div>

        {/* Due for Reorder */}
        <div>
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <AlertCircle className="size-5 text-orange-600" />
            Due for Reorder
          </h3>
          <div className="space-y-3">
            {autoReorderItems.filter(item => item.status === 'due').map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-4 border-2 border-orange-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-bold mb-1">{item.product}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>Last: {item.lastPurchased}</span>
                      <span>•</span>
                      <span>{item.frequency}</span>
                    </div>
                  </div>
                  <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-semibold">
                    DUE
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-lg text-purple-600">{formatCurrency(item.avgPrice)}</p>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 h-10">
                    Reorder Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming */}
        <div>
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Clock className="size-5 text-blue-600" />
            Upcoming Reorders
          </h3>
          <div className="space-y-3">
            {autoReorderItems.filter(item => item.status === 'upcoming').map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-4 border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-bold mb-1">{item.product}</p>
                    <p className="text-sm text-gray-600 mb-2">Suggested: {item.nextSuggested}</p>
                    <p className="text-sm font-semibold text-blue-600">{formatCurrency(item.avgPrice)}</p>
                  </div>
                  <button className="text-blue-600 text-sm font-semibold hover:underline">
                    Order Early
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}