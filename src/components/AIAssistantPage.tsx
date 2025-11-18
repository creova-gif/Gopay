import { ArrowLeft, Sparkles, Plane, Building2, Shield, Globe, MessageCircle, Mic, Send, MapPin, Calendar, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useRef, useEffect } from 'react';

interface AIAssistantPageProps {
  onBack: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export function AIAssistantPage({ onBack }: AIAssistantPageProps) {
  const [activeAssistant, setActiveAssistant] = useState<'travel' | 'business' | 'safety' | 'translate'>('travel');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const assistants = [
    {
      id: 'travel',
      name: 'Travel AI',
      icon: Plane,
      color: 'from-blue-500 to-blue-600',
      description: 'Plan trips, translate, find POIs',
      greeting: 'Hello! I\'m your Tanzania travel assistant. I can help you plan itineraries, find attractions, translate phrases, and discover hidden gems across Tanzania. Where would you like to explore?'
    },
    {
      id: 'business',
      name: 'SME AI',
      icon: Building2,
      color: 'from-purple-500 to-purple-600',
      description: 'Business tools, analytics, marketing',
      greeting: 'Hi! I\'m your business assistant. I can help with marketing content, sales analytics, inventory insights, and growing your business on goPay. How can I help your business today?'
    },
    {
      id: 'safety',
      name: 'Safety AI',
      icon: Shield,
      color: 'from-red-500 to-red-600',
      description: 'Fraud detection, emergency help',
      greeting: 'Hello! I\'m your safety assistant. I monitor transactions for suspicious activity and can help with emergencies. Is everything okay? How can I assist you?'
    },
    {
      id: 'translate',
      name: 'Translator',
      icon: Globe,
      color: 'from-green-500 to-green-600',
      description: 'Swahili ↔ English ↔ More',
      greeting: 'Habari! I can translate between Swahili, English, French, German, and more. Just type or speak what you want to translate.'
    }
  ];

  useEffect(() => {
    // Initialize with greeting
    const assistant = assistants.find(a => a.id === activeAssistant);
    if (assistant && messages.length === 0) {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: assistant.greeting,
        timestamp: new Date(),
        suggestions: getSuggestionsForAssistant(activeAssistant)
      }]);
    }
  }, [activeAssistant]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getSuggestionsForAssistant = (type: string): string[] => {
    switch (type) {
      case 'travel':
        return [
          'Plan a 3-day Serengeti safari',
          'Best time to climb Kilimanjaro?',
          'Translate "Where is the hotel?"',
          'Hidden beaches in Zanzibar'
        ];
      case 'business':
        return [
          'Write a product description',
          'Analyze my sales trends',
          'Create a social media post',
          'Inventory management tips'
        ];
      case 'safety':
        return [
          'Is this transaction safe?',
          'Report suspicious activity',
          'Emergency contacts',
          'Travel safety tips'
        ];
      case 'translate':
        return [
          'Translate to Swahili',
          'Translate to English',
          'Common travel phrases',
          'Business vocabulary'
        ];
      default:
        return [];
    }
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

    // Simulate AI response
    setTimeout(() => {
      const response = generateAIResponse(inputText, activeAssistant);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (input: string, type: string): { content: string; suggestions?: string[] } => {
    const lower = input.toLowerCase();

    if (type === 'travel') {
      if (lower.includes('serengeti') || lower.includes('safari')) {
        return {
          content: `Great choice! Here's a 3-day Serengeti itinerary:\n\n**Day 1: Arrival & Central Serengeti**\n- Morning: Arrive at Seronera Airstrip\n- Afternoon: Game drive in Central Serengeti\n- Evening: Sunset at Simba Kopjes\n- Stay: Serengeti Serena Safari Lodge\n\n**Day 2: Northern Serengeti**\n- Full day game drive to see the Great Migration\n- Visit Mara River crossing point\n- Big cat tracking with expert guide\n\n**Day 3: Ngorongoro Crater**\n- Morning: Drive to Ngorongoro\n- Descend into crater for wildlife viewing\n- Afternoon: Return to Arusha\n\n**Estimated Cost:** TZS 2,800,000 per person\n\nWould you like me to book accommodations?`,
          suggestions: ['Book this itinerary', 'Add more days', 'Show lodges', 'Budget options']
        };
      }

      if (lower.includes('kilimanjaro')) {
        return {
          content: `**Best Time to Climb Kilimanjaro:**\n\n🌤️ **Dry Seasons (Best):**\n- January to March\n- June to October\n\nThese months offer:\n- Clear skies and stunning views\n- Less rain and mud\n- Higher success rates\n\n❄️ **What to Expect:**\n- Temperature: -10°C to 30°C\n- Duration: 5-9 days depending on route\n- Success rate: 65-85%\n\n**Popular Routes:**\n1. Marangu Route (5-6 days)\n2. Machame Route (6-7 days)\n3. Lemosho Route (7-8 days)\n\nNeed help choosing a route?`,
          suggestions: ['Compare routes', 'Book a climb', 'What to pack', 'Training tips']
        };
      }

      if (lower.includes('translate')) {
        return {
          content: `**Travel Phrases in Swahili:**\n\n"Where is the hotel?" = "Hotel iko wapi?"\n\nMore useful phrases:\n- Hello = Habari / Jambo\n- Thank you = Asante\n- How much? = Bei gani?\n- I need help = Nahitaji msaada\n- Where is...? = ...iko wapi?\n- Restaurant = Mkahawa\n- Bathroom = Choo\n- Water = Maji\n\nWhat else would you like to translate?`,
          suggestions: ['More phrases', 'Food vocabulary', 'Emergency phrases', 'Numbers']
        };
      }

      return {
        content: 'I can help you plan amazing trips across Tanzania! I know about all national parks, beaches, mountains, cultural sites, and hidden gems. What interests you most?',
        suggestions: ['National Parks', 'Beaches', 'Cultural Tours', 'Adventure Activities']
      };
    }

    if (type === 'business') {
      if (lower.includes('description') || lower.includes('product')) {
        return {
          content: `I'll help you write compelling product descriptions! Here's a template:\n\n**Premium Tanzanian Coffee - Kilimanjaro Blend**\n\nExperience the rich, bold flavors of Mount Kilimanjaro with our premium Arabica coffee. Hand-picked from high-altitude farms and roasted to perfection.\n\n✨ **Features:**\n- Single-origin Arabica beans\n- Medium roast for balanced flavor\n- Notes of chocolate and citrus\n- Ethically sourced from local farmers\n\n📦 **Available in:** 250g, 500g, 1kg bags\n💰 **Price:** TZS 15,000 - 45,000\n\nWhat product would you like me to describe?`,
          suggestions: ['Write another', 'Social media post', 'Email template', 'Menu description']
        };
      }

      if (lower.includes('sales') || lower.includes('analytics')) {
        return {
          content: `**Sales Analytics Insights:**\n\n📊 **This Month's Performance:**\n- Total Sales: TZS 1,250,000 (↑ 23%)\n- Orders: 89 (↑ 15%)\n- Avg Order: TZS 14,045\n- Top Product: Tanzanite Jewelry\n\n⭐ **Recommendations:**\n1. Stock up on jewelry - selling fast!\n2. Promote slow movers with 10% discount\n3. Peak hours: 2-4 PM and 7-9 PM\n4. Weekend sales are 40% higher\n\n📈 **Growth Opportunities:**\n- Add product bundles\n- Launch weekend specials\n- Improve product photos\n\nWant detailed analytics?`,
          suggestions: ['Detailed report', 'Inventory check', 'Competitor analysis', 'Marketing ideas']
        };
      }

      return {
        content: 'I can help you grow your business with AI-powered tools! I can write content, analyze sales, manage inventory, create marketing campaigns, and provide business insights. What do you need help with?',
        suggestions: ['Content writing', 'Sales analysis', 'Marketing ideas', 'Inventory help']
      };
    }

    if (type === 'safety') {
      if (lower.includes('transaction') || lower.includes('safe')) {
        return {
          content: `**Transaction Safety Check:**\n\n✅ **This transaction looks safe!**\n\nI've analyzed:\n- Merchant verification status\n- Transaction amount vs. average\n- Location consistency\n- Payment method security\n\n🔒 **Safety Tips:**\n- Always verify merchant badges\n- Check transaction details before confirming\n- Enable biometric authentication\n- Report suspicious activity immediately\n\nNeed to verify another transaction?`,
          suggestions: ['Report fraud', 'Check another', 'Safety settings', 'Emergency mode']
        };
      }

      if (lower.includes('emergency') || lower.includes('help')) {
        return {
          content: `**Emergency Assistance Available:**\n\n🚨 **Quick Actions:**\n- Press SOS button (hold power button)\n- Share live location with contacts\n- Call police: 112 or 999\n- Call ambulance: 114\n\n📍 **Your Location:** Dar es Salaam, Tanzania\n\n👥 **Trusted Contacts:**\n- Emergency contact 1: Added ✓\n- Emergency contact 2: Not set\n\n**Are you in immediate danger?**\nI can alert your contacts and emergency services now.`,
          suggestions: ['Activate SOS', 'Share location', 'Add contacts', 'False alarm']
        };
      }

      return {
        content: 'I\'m here to keep you safe! I monitor transactions for fraud, can activate emergency alerts, share your location with trusted contacts, and provide safety tips. Everything okay?',
        suggestions: ['Check transaction', 'Emergency mode', 'Safety tips', 'Report fraud']
      };
    }

    if (type === 'translate') {
      if (lower.includes('swahili') || lower.includes('kiswahili')) {
        return {
          content: `**Swahili Translation:**\n\n"${input}" in Swahili:\n\n"${input.replace(/translate to swahili:?/i, '').trim()}" = "[Swahili translation would appear here]"\n\n🗣️ **Pronunciation tip:** Swahili is phonetic - words are pronounced as written!\n\n**Common Greetings:**\n- Good morning = Habari ya asubuhi\n- Good evening = Habari ya jioni\n- Welcome = Karibu\n- Goodbye = Kwa heri\n\nNeed more translations?`,
          suggestions: ['Translate to English', 'More phrases', 'Food menu', 'Business terms']
        };
      }

      return {
        content: 'I can translate between Swahili, English, French, German, Spanish, Arabic, and Mandarin. Just type what you want to translate, or use voice input!',
        suggestions: ['Swahili to English', 'English to Swahili', 'Common phrases', 'Voice translate']
      };
    }

    return {
      content: 'I\'m here to help! What would you like to know?',
      suggestions: getSuggestionsForAssistant(type)
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
  };

  const currentAssistant = assistants.find(a => a.id === activeAssistant)!;
  const IconComponent = currentAssistant.icon;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="size-6 text-gray-900" />
            </button>
            <div className={`bg-gradient-to-br ${currentAssistant.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
              <IconComponent className="size-6 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{currentAssistant.name}</h1>
              <p className="text-xs text-gray-600">{currentAssistant.description}</p>
            </div>
            <Sparkles className="size-6 text-purple-600 animate-pulse" />
          </div>

          {/* Assistant Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {assistants.map(assistant => {
              const Icon = assistant.icon;
              return (
                <button
                  key={assistant.id}
                  onClick={() => {
                    setActiveAssistant(assistant.id as any);
                    setMessages([]);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    activeAssistant === assistant.id
                      ? `bg-gradient-to-r ${assistant.color} text-white`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="size-4" />
                  {assistant.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map(message => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${
              message.role === 'user'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                : 'bg-white border-2 border-gray-100 text-gray-900'
            } rounded-3xl p-4 shadow-md`}>
              <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Suggestions:</p>
                  {message.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 text-gray-900 text-sm px-4 py-2 rounded-full transition-all text-left font-medium"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border-2 border-gray-100 rounded-3xl p-4 shadow-md">
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
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <div className="flex gap-3 items-center">
          <button className="p-3 hover:bg-gray-100 rounded-full transition-colors">
            <Mic className="size-6 text-gray-600" />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask ${currentAssistant.name}...`}
            className="flex-1 h-12 px-4 bg-gray-100 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-300 rounded-full transition-all"
          >
            <Send className="size-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
