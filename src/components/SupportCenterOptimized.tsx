/**
 * SUPPORT CENTER - OPTIMIZED
 * 
 * Patterns from: PayPal, Revolut, Stripe, Intercom
 * 
 * Features:
 * - AI chat assistant
 * - FAQ categories
 * - Contact options (call, email, chat)
 * - Ticket status tracking
 * - Common issues quick fixes
 * - Friendly, calm tone
 * - WCAG AA compliant
 */

import { useState } from 'react';
import {
  MessageCircle,
  Phone,
  Mail,
  Search,
  ChevronRight,
  HelpCircle,
  CheckCircle2,
  Clock,
  AlertCircle,
  User,
  Send,
  Sparkles,
  Shield,
  DollarSign,
  CreditCard,
  Bell,
  Settings
} from 'lucide-react';
import {
  PageHeader,
  SectionHeader,
  EmptyState,
  Alert,
  ActionCard,
  ListItem,
  BottomSheet
} from './design-system/SharedComponents';

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

interface Ticket {
  id: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string;
  lastUpdate: string;
}

interface SupportCenterOptimizedProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

export function SupportCenterOptimized({ onBack, onNavigate }: SupportCenterOptimizedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', message: string}>>([
    {
      role: 'assistant',
      message: 'Habari! 👋 I\'m your goPay assistant. How can I help you today?'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);

  // FAQs organized by category
  const faqCategories = [
    {
      id: 'payments',
      name: 'Payments & Transfers',
      icon: <DollarSign className="size-6 text-white" />,
      gradient: 'from-green-500 to-emerald-600',
      count: 12
    },
    {
      id: 'security',
      name: 'Security & Privacy',
      icon: <Shield className="size-6 text-white" />,
      gradient: 'from-orange-500 to-red-600',
      count: 8
    },
    {
      id: 'account',
      name: 'Account & Profile',
      icon: <User className="size-6 text-white" />,
      gradient: 'from-blue-500 to-cyan-600',
      count: 10
    },
    {
      id: 'cards',
      name: 'Cards & Banking',
      icon: <CreditCard className="size-6 text-white" />,
      gradient: 'from-purple-500 to-pink-600',
      count: 6
    }
  ];

  // Sample FAQs
  const faqs: FAQ[] = [
    {
      id: '1',
      category: 'payments',
      question: 'How do I send money to another goPay user?',
      answer: 'Go to Home → Send Money → Enter phone number or select from contacts → Enter amount → Confirm with PIN. Money is sent instantly!'
    },
    {
      id: '2',
      category: 'payments',
      question: 'What are the transaction limits?',
      answer: 'Daily limit: TZS 5,000,000. Single transaction: TZS 1,000,000. Limits can be increased with KYC verification.'
    },
    {
      id: '3',
      category: 'security',
      question: 'How do I change my PIN?',
      answer: 'Go to Profile → Security → Change PIN → Enter old PIN → Enter new PIN twice → Confirm. Your PIN should be unique and not shared with anyone.'
    },
    {
      id: '4',
      category: 'security',
      question: 'What if I forgot my PIN?',
      answer: 'Tap "Forgot PIN?" on login screen → Verify with OTP → Set new PIN. Make sure you have access to your registered phone number.'
    },
    {
      id: '5',
      category: 'account',
      question: 'How do I verify my account?',
      answer: 'Go to Profile → KYC Verification → Upload NIDA/Passport → Take selfie → Submit. Verification takes 24-48 hours.'
    },
    {
      id: '6',
      category: 'cards',
      question: 'Can I link my bank account?',
      answer: 'Yes! Go to Profile → Linked Accounts → Add Bank → Select your bank → Enter account details → Verify with SMS code.'
    }
  ];

  // Mock tickets
  const tickets: Ticket[] = [
    {
      id: 'T001',
      subject: 'Payment not received',
      status: 'in-progress',
      createdAt: '2025-01-12',
      lastUpdate: '2 hours ago'
    },
    {
      id: 'T002',
      subject: 'Account verification pending',
      status: 'resolved',
      createdAt: '2025-01-10',
      lastUpdate: '1 day ago'
    }
  ];

  // Filter FAQs
  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Quick actions
  const quickActions = [
    {
      title: 'Uliza Assistant Wetu',
      description: 'Get instant answers from AI',
      icon: <Sparkles className="size-6 text-white" />,
      gradient: 'from-purple-500 to-pink-600',
      onClick: () => setShowChat(true),
      badge: 'AI'
    },
    {
      title: 'Piga Simu',
      description: 'Call support: +255 123 456 789',
      icon: <Phone className="size-6 text-white" />,
      gradient: 'from-blue-500 to-cyan-600',
      onClick: () => {}
    },
    {
      title: 'Tuma Email',
      description: 'support@gopay.co.tz',
      icon: <Mail className="size-6 text-white" />,
      gradient: 'from-orange-500 to-red-600',
      onClick: () => {}
    }
  ];

  // Handle chat
  const sendMessage = () => {
    if (!chatInput.trim()) return;

    setChatMessages(prev => [...prev, { role: 'user', message: chatInput }]);
    
    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        message: 'I understand you need help with that. Let me check our knowledge base... Based on your question, I recommend checking our FAQ on payments. Would you like me to show you that?'
      }]);
    }, 1000);

    setChatInput('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Help & Support"
        swahiliTitle="Msaada"
        subtitle="We're here to help 24/7"
        onBack={onBack}
      />

      <div className="p-5 space-y-6">
        {/* SEARCH */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-white border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none text-sm font-medium"
          />
        </div>

        {/* QUICK ACTIONS */}
        <div>
          <SectionHeader
            title="Get Help Now"
            subtitle="Choose how you want help"
          />
          
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <ActionCard
                key={index}
                {...action}
              />
            ))}
          </div>
        </div>

        {/* FAQ CATEGORIES */}
        <div>
          <SectionHeader
            title="Browse by Topic"
            subtitle="Common questions"
          />
          
          <div className="grid grid-cols-2 gap-3">
            {faqCategories.map(category => (
              <button
                key={category.id}
                onClick={() => {}}
                className={`bg-gradient-to-br ${category.gradient} rounded-2xl p-5 text-white hover:shadow-xl transition-all active:scale-[0.98] text-left relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                
                <div className="relative z-10">
                  <div className="size-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3 border border-white/30">
                    {category.icon}
                  </div>
                  <p className="font-black text-sm mb-1">{category.name}</p>
                  <p className="text-xs text-white/80 font-semibold">{category.count} articles</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* POPULAR FAQs */}
        <div>
          <SectionHeader
            title="Maswali ya Kawaida"
            subtitle="Frequently asked questions"
          />
          
          {filteredFAQs.length === 0 ? (
            <EmptyState
              icon={<HelpCircle className="size-10 text-white" />}
              title="No results found"
              message="Try different keywords or browse by category"
              gradient="from-gray-500 to-gray-600"
            />
          ) : (
            <div className="space-y-3">
              {filteredFAQs.slice(0, 5).map(faq => (
                <ListItem
                  key={faq.id}
                  icon={<HelpCircle className="size-6 text-white" />}
                  iconGradient="from-blue-500 to-cyan-600"
                  title={faq.question}
                  subtitle="Tap to read answer"
                  onClick={() => setSelectedFAQ(faq)}
                />
              ))}
            </div>
          )}
        </div>

        {/* MY TICKETS */}
        {tickets.length > 0 && (
          <div>
            <SectionHeader
              title="My Support Tickets"
              subtitle={`${tickets.length} ticket${tickets.length > 1 ? 's' : ''}`}
              action={{
                label: 'View All',
                onClick: () => {}
              }}
            />
            
            <div className="space-y-3">
              {tickets.map(ticket => {
                const statusStyles = {
                  open: { icon: <Clock className="size-6 text-white" />, gradient: 'from-amber-500 to-orange-600' },
                  'in-progress': { icon: <Clock className="size-6 text-white" />, gradient: 'from-blue-500 to-cyan-600' },
                  resolved: { icon: <CheckCircle2 className="size-6 text-white" />, gradient: 'from-green-500 to-emerald-600' }
                };

                const style = statusStyles[ticket.status];

                return (
                  <ListItem
                    key={ticket.id}
                    icon={style.icon}
                    iconGradient={style.gradient}
                    title={`#${ticket.id}: ${ticket.subject}`}
                    subtitle={`Updated ${ticket.lastUpdate}`}
                    badge={
                      <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                        ticket.status === 'resolved' ? 'bg-green-100 text-green-700' :
                        ticket.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {ticket.status === 'resolved' ? 'Resolved' :
                         ticket.status === 'in-progress' ? 'In Progress' :
                         'Open'}
                      </span>
                    }
                    onClick={() => {}}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* TRUST SIGNAL */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <Shield className="size-6 text-emerald-700" />
            <div>
              <p className="text-sm font-bold text-emerald-900 mb-0.5">Msaada wa 24/7</p>
              <p className="text-xs text-emerald-800 font-medium">
                Our support team is available 24/7 to assist you
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ DETAIL BOTTOM SHEET */}
      {selectedFAQ && (
        <BottomSheet
          isOpen={!!selectedFAQ}
          onClose={() => setSelectedFAQ(null)}
          title="FAQ Answer"
        >
          <div className="space-y-6">
            <div className="text-center">
              <div className="size-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <HelpCircle className="size-8 text-white" />
              </div>
            </div>

            <div>
              <p className="text-base font-black text-gray-900 mb-4">{selectedFAQ.question}</p>
              <p className="text-sm text-gray-700 font-medium leading-relaxed">{selectedFAQ.answer}</p>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-700 font-medium text-center">Was this helpful?</p>
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-green-100 hover:bg-green-200 text-green-700 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
                  <CheckCircle2 className="size-4" />
                  Yes, helpful
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl text-sm font-bold transition-all">
                  No, need more help
                </button>
              </div>
            </div>
          </div>
        </BottomSheet>
      )}

      {/* AI CHAT BOTTOM SHEET */}
      <BottomSheet
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        title="goPay Assistant"
      >
        <div className="space-y-4">
          {/* Chat messages */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-2xl p-3 ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm font-medium">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your question..."
              className="flex-1 h-12 px-4 bg-gray-100 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none text-sm font-medium"
            />
            <button
              onClick={sendMessage}
              disabled={!chatInput.trim()}
              className="size-12 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white rounded-xl flex items-center justify-center transition-all"
            >
              <Send className="size-5" />
            </button>
          </div>

          {/* Quick replies */}
          <div className="flex flex-wrap gap-2">
            {['How to send money?', 'Reset my PIN', 'Transaction failed'].map((quick, index) => (
              <button
                key={index}
                onClick={() => {
                  setChatInput(quick);
                  sendMessage();
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
              >
                {quick}
              </button>
            ))}
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
