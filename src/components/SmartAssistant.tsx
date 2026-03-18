/**
 * SMART ASSISTANT - Super App Help Center
 * 
 * Design Philosophy (Inspired by):
 * - Alipay Customer Service: Contextual, quick, invisible intelligence
 * - WeChat Helper: Natural conversation, no AI branding
 * - Grab Help: Category-based, instant solutions
 * 
 * CRITICAL: NO AI VISUAL ELEMENTS
 * - No robot icons
 * - No "AI-powered" labels
 * - No sparkles/magic wands
 * - Intelligence is INVISIBLE
 */

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, MessageCircle, Send, Mic, Search, Phone, Mail, Clock, CheckCircle, ChevronRight, HelpCircle, FileText, Shield, CreditCard, Map, Book } from 'lucide-react';
import { Button } from './ui/button';

interface SmartAssistantProps {
  onBack: () => void;
  userContext?: {
    name: string;
    phone: string;
    lastTransaction?: string;
    location?: string;
  };
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  quickActions?: Array<{
    label: string;
    action: string;
  }>;
}

interface HelpCategory {
  id: string;
  name: string;
  icon: any;
  color: string;
  topics: Array<{
    question: string;
    answer: string;
  }>;
}

const HELP_CATEGORIES: HelpCategory[] = [
  {
    id: 'payments',
    name: 'Payments & Wallet',
    icon: CreditCard,
    color: 'from-emerald-600 to-green-600',
    topics: [
      {
        question: 'How do I add money to my wallet?',
        answer: 'Tap "Add Money" on your home screen, select M-Pesa, Tigo Pesa, or bank transfer, enter amount, and confirm. Instant credit!'
      },
      {
        question: 'What are the transaction fees?',
        answer: 'goPay charges 0% fees for wallet-to-wallet transfers. Mobile money: 1.5%. Bank transfers: 500 TZS flat fee.'
      },
      {
        question: 'How do I send money?',
        answer: 'Tap "Send" → Enter phone number or select contact → Amount → Confirm with PIN. Money arrives instantly.'
      }
    ]
  },
  {
    id: 'travel',
    name: 'Travel & Bookings',
    icon: Map,
    color: 'from-blue-600 to-cyan-600',
    topics: [
      {
        question: 'How do I book a flight?',
        answer: 'Travel → Flights → Select route & date → Choose flight → Pay with wallet. E-ticket sent via SMS & email instantly.'
      },
      {
        question: 'Can I cancel my booking?',
        answer: 'Yes! Go to History → Select booking → Cancel. Refunds processed within 24 hours to your goPay wallet (minus cancellation fee if applicable).'
      }
    ]
  },
  {
    id: 'security',
    name: 'Security & Account',
    icon: Shield,
    color: 'from-purple-600 to-pink-600',
    topics: [
      {
        question: 'I forgot my PIN',
        answer: 'Settings → Security → Reset PIN → Verify with OTP → Create new PIN. Takes 2 minutes.'
      },
      {
        question: 'Is goPay safe?',
        answer: 'Yes! We use bank-grade encryption, licensed by Bank of Tanzania, and monitor all transactions 24/7. Your money is protected.'
      },
      {
        question: 'How do I report fraud?',
        answer: 'Tap this message → Report Issue → Select transaction → Describe problem. Our team responds within 1 hour.'
      }
    ]
  },
  {
    id: 'rewards',
    name: 'Rewards & Membership',
    icon: FileText,
    color: 'from-orange-600 to-red-600',
    topics: [
      {
        question: 'How do I earn points?',
        answer: 'Earn points on every transaction: 1 point per TZS 1,000 spent. Pay bills, book travel, shop - all earn points!'
      },
      {
        question: 'What are membership tiers?',
        answer: 'Bronze (Free) → Silver (TZS 10,000/month) → Gold (TZS 25,000/month). Higher tiers get better rewards, lower fees, and exclusive perks.'
      }
    ]
  }
];

export function SmartAssistant({ onBack, userContext }: SmartAssistantProps) {
  const [view, setView] = useState<'categories' | 'chat'>('categories');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0 && view === 'chat') {
      // Welcome message
      const greeting = getGreeting();
      setMessages([{
        id: '1',
        role: 'assistant',
        content: `${greeting} I'm here to help you with anything related to goPay. What can I assist you with today?`,
        timestamp: new Date(),
        quickActions: [
          { label: 'Check transaction', action: 'transaction' },
          { label: 'Add money', action: 'topup' },
          { label: 'Book travel', action: 'travel' },
          { label: 'Report issue', action: 'issue' }
        ]
      }]);
    }
  }, [view]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = userContext?.name?.split(' ')[0] || '';
    if (hour < 12) return `Habari ya asubuhi, ${name}! 👋`;
    if (hour < 17) return `Habari ya mchana, ${name}! 👋`;
    return `Habari ya jioni, ${name}! 👋`;
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate intelligent response
    setTimeout(() => {
      const response = generateResponse(inputText);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        quickActions: response.actions
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const generateResponse = (input: string): { content: string; actions?: Array<{ label: string; action: string }> } => {
    const lower = input.toLowerCase();

    // Contextual responses based on keywords
    if (lower.includes('fee') || lower.includes('cost') || lower.includes('charge')) {
      return {
        content: `**goPay Transaction Fees:**\n\n✅ Wallet to Wallet: FREE (0%)\n💳 Mobile Money (M-Pesa, Tigo): 1.5%\n🏦 Bank Transfer: TZS 500 flat\n✈️ Travel Bookings: TZS 2,000 service fee\n💡 Bill Payments: FREE\n\nGold members get 50% off all fees! Upgrade in Profile → Membership.`,
        actions: [
          { label: 'View membership', action: 'membership' },
          { label: 'See all fees', action: 'fees' }
        ]
      };
    }

    if (lower.includes('add money') || lower.includes('deposit') || lower.includes('top up')) {
      return {
        content: `**Add Money to goPay Wallet:**\n\n1. Tap "Add Money" on home screen\n2. Choose method:\n   • M-Pesa (instant)\n   • Tigo Pesa (instant)\n   • Bank transfer (5 mins)\n3. Enter amount\n4. Confirm\n\n💰 Limits:\n- Min: TZS 1,000\n- Max: TZS 3,000,000/day\n\nWant me to guide you through it?`,
        actions: [
          { label: 'Add money now', action: 'topup' },
          { label: 'View limits', action: 'limits' }
        ]
      };
    }

    if (lower.includes('book') || lower.includes('travel') || lower.includes('flight')) {
      return {
        content: `**Book Travel on goPay:**\n\n✈️ **Flights:** Tap Travel → Flights\n🚌 **Buses:** Tap Travel → Buses  \n🏨 **Hotels:** Tap Travel → Hotels\n🚢 **Ferries:** Tap Travel → Ferry\n\n🎁 **Benefits:**\n- Instant confirmation\n- E-tickets via SMS\n- Earn 2x points\n- Free cancellation (24h)\n\nWhere would you like to go?`,
        actions: [
          { label: 'Book flight', action: 'flights' },
          { label: 'Book hotel', action: 'hotels' }
        ]
      };
    }

    if (lower.includes('forgot') || lower.includes('pin') || lower.includes('password')) {
      return {
        content: `**Reset Your PIN:**\n\n1. Go to Profile → Security\n2. Tap "Reset PIN"\n3. Verify with OTP (sent to ${userContext?.phone || 'your phone'})\n4. Create new 4-digit PIN\n5. Confirm PIN\n\n🔒 Takes 2 minutes. Your account stays secure throughout the process.\n\nNeed help with this?`,
        actions: [
          { label: 'Reset PIN now', action: 'reset-pin' },
          { label: 'Contact support', action: 'support' }
        ]
      };
    }

    if (lower.includes('problem') || lower.includes('issue') || lower.includes('error')) {
      return {
        content: `I'm sorry you're experiencing issues! Let me help you:\n\n**Common Solutions:**\n1. Check your internet connection\n2. Update goPay app\n3. Clear app cache\n4. Restart the app\n\n**Still not working?**\nTell me more about the problem:\n- What were you trying to do?\n- What error message did you see?\n- When did this start?\n\nOr tap below to speak with our support team (available 24/7).`,
        actions: [
          { label: 'Call support', action: 'call' },
          { label: 'Email support', action: 'email' },
          { label: 'Common issues', action: 'faq' }
        ]
      };
    }

    // Default helpful response
    return {
      content: `I can help you with:\n\n• Payments & money transfers\n• Travel bookings\n• Bill payments\n• Account & security\n• Rewards & membership\n• Transaction history\n• Any other goPay features\n\nWhat would you like to know?`,
      actions: [
        { label: 'View FAQs', action: 'faq' },
        { label: 'Talk to human', action: 'human' }
      ]
    };
  };

  const handleQuickAction = (action: string) => {
    setInputText(action);
  };

  if (view === 'categories') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 text-white px-6 pt-12 pb-8">
          <div className="flex items-center justify-between mb-6">
            <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full transition-all">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <span className="text-sm font-semibold">24/7 Support</span>
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-black mb-2">Msaada • Help Center</h1>
            <p className="text-emerald-100 text-base">
              How can we assist you today?
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-xl"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-6 -mt-6 mb-6">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setView('chat')}
              className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all active:scale-[0.98] text-left relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <MessageCircle className="w-8 h-8 mb-2" />
              <p className="font-bold text-base">Live Chat</p>
              <p className="text-xs text-purple-100">Instant answers</p>
            </button>

            <a
              href="tel:+255700000000"
              className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all active:scale-[0.98] text-left relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <Phone className="w-8 h-8 mb-2" />
              <p className="font-bold text-base">Call Us</p>
              <p className="text-xs text-blue-100">24/7 support</p>
            </a>
          </div>
        </div>

        {/* Help Categories */}
        <div className="px-6 pb-8 space-y-4">
          <h2 className="text-lg font-black text-gray-900">Browse Topics</h2>
          
          {HELP_CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className={`bg-gradient-to-r ${category.color} p-4 flex items-center gap-3`}>
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-base flex-1">{category.name}</h3>
                </div>
                
                <div className="p-4 space-y-3">
                  {category.topics.map((topic, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setView('chat');
                        setInputText(topic.question);
                        setTimeout(() => handleSend(), 100);
                      }}
                      className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-all active:scale-[0.99] group"
                    >
                      <div className="flex items-center gap-3">
                        <HelpCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <p className="text-sm font-medium text-gray-900 flex-1">{topic.question}</p>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Options */}
        <div className="px-6 pb-8">
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl p-5">
            <h3 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Response Times
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-emerald-700">Live Chat:</span>
                <span className="font-bold text-emerald-900">30 seconds</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-emerald-700">Phone Call:</span>
                <span className="font-bold text-emerald-900">1 minute</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-emerald-700">Email:</span>
                <span className="font-bold text-emerald-900">1 hour</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chat View
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setView('categories')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">goPay Support</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-600">Available now</span>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${
              message.role === 'user'
                ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white'
                : 'bg-white border border-gray-200 text-gray-900'
            } rounded-3xl p-4 shadow-sm`}>
              <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
              
              {message.quickActions && message.quickActions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                  {message.quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickAction(action.label)}
                      className="w-full bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 text-gray-900 text-sm px-4 py-2.5 rounded-xl transition-all text-left font-medium border border-emerald-200"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-3xl p-4 shadow-sm">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex gap-3 items-center">
          <button className="p-3 hover:bg-gray-100 rounded-full transition-colors">
            <Mic className="w-5 h-5 text-gray-600" />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your question..."
            className="flex-1 h-12 px-4 bg-gray-100 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="p-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-300 rounded-full transition-all disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
