import { ArrowLeft, Sparkles, Plane, Building2, Shield, Globe, Mic, Send } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';

interface AIAssistantPageProps {
  onBack: () => void;
  accessToken?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const ASSISTANTS = [
  {
    id: 'travel', name: 'Travel AI', icon: Plane,
    color: '#3b82f6', gradient: 'linear-gradient(135deg,#3b82f6,#6366f1)',
    description: 'Panga safari, tafsiri, tafuta maeneo',
    greeting: "Habari! Mimi ni msaidizi wako wa safari Tanzania. Naweza kukusaidia kupanga ratiba, kutafuta vivutio, kutafsiri misemo, na kugundua maeneo ya kipekee. Unataka kwenda wapi?",
    suggestions: ['Panga safari ya Serengeti siku 3', 'Wakati bora kupanda Kilimanjaro?', 'Tafsiri "Hoteli iko wapi?"', 'Fukwe nzuri Zanzibar'],
  },
  {
    id: 'business', name: 'SME AI', icon: Building2,
    color: '#8b5cf6', gradient: 'linear-gradient(135deg,#8b5cf6,#ec4899)',
    description: 'Zana za biashara, uchambuzi, masoko',
    greeting: 'Habari! Mimi ni msaidizi wako wa biashara. Naweza kusaidia na maudhui ya masoko, uchambuzi wa mauzo, maarifa ya hesabu, na kukua biashara yako kwenye goPay. Ninaweza kukusaidiaje leo?',
    suggestions: ['Andika maelezo ya bidhaa', 'Changanua mwelekeo wa mauzo yangu', 'Tengeneza chapisho la mitandao', 'Vidokezo vya usimamizi wa hesabu'],
  },
  {
    id: 'safety', name: 'Safety AI', icon: Shield,
    color: '#ef4444', gradient: 'linear-gradient(135deg,#ef4444,#f97316)',
    description: 'Ugunduz wa ulaghai, msaada wa dharura',
    greeting: 'Habari! Mimi ni msaidizi wako wa usalama. Ninafuatilia miamala kwa shughuli za tuhuma na naweza kusaidia na dharura. Kila kitu sawa? Ninaweza kukusaidiaje?',
    suggestions: ['Je, muamala huu uko salama?', 'Ripoti shughuli ya tuhuma', 'Namba za dharura', 'Vidokezo vya usalama wa safari'],
  },
  {
    id: 'translate', name: 'Tafsiri', icon: Globe,
    color: '#16a34a', gradient: 'linear-gradient(135deg,#16a34a,#06b6d4)',
    description: 'Kiswahili ↔ Kiingereza ↔ Zaidi',
    greeting: 'Habari! Naweza kutafsiri kati ya Kiswahili, Kiingereza, Kifaransa, Kijerumani, na zaidi. Andika au sema unachotaka kutafsiriwa.',
    suggestions: ['Tafsiri kwa Kiswahili', 'Tafsiri kwa Kiingereza', 'Misemo ya kawaida ya safari', 'Msamiati wa biashara'],
  },
];

function generateResponse(input: string, type: string): { content: string; suggestions?: string[] } {
  const lower = input.toLowerCase();
  if (type === 'travel') {
    if (lower.includes('serengeti') || lower.includes('safari')) return {
      content: `Chaguo zuri! Hapa kuna ratiba ya siku 3 ya Serengeti:\n\n**Siku 1: Kufika & Serengeti ya Kati**\n- Asubuhi: Fika Seronera Airstrip\n- Mchana: Safari Serengeti ya Kati\n- Jioni: Machweo ya jua Simba Kopjes\n\n**Siku 2: Serengeti ya Kaskazini**\n- Siku nzima: Tazama Uhamiaji Mkubwa\n- Tembelea kivuko cha Mto Mara\n- Fuatilia paka wakubwa na mwongozo\n\n**Siku 3: Ngorongoro**\n- Asubuhi: Endesha hadi Ngorongoro\n- Shuka ndani ya crater kutazama wanyama\n- Mchana: Rudi Arusha\n\n**Gharama inayokadiriwa:** TZS 2,800,000 kwa mtu\n\nUnataka nikuhifadhie malazi?`,
      suggestions: ['Hifadhi ratiba hii', 'Ongeza siku zaidi', 'Onyesha malazi', 'Chaguo za bei nafuu'],
    };
    if (lower.includes('kilimanjaro')) return {
      content: `**Wakati Bora wa Kupanda Kilimanjaro:**\n\n☀️ **Majira ya Kiangazi (Bora):**\n- Januari hadi Machi\n- Juni hadi Oktoba\n\nMajira haya yana:\n- Anga wazi na maoni mazuri\n- Mvua kidogo\n- Viwango vya juu vya mafanikio\n\n❄️ **Unachostahili kujua:**\n- Joto: -10°C hadi 30°C\n- Muda: Siku 5-9 kulingana na njia\n- Kiwango cha mafanikio: 65-85%\n\n**Njia Maarufu:**\n1. Njia ya Marangu (siku 5-6)\n2. Njia ya Machame (siku 6-7)\n3. Njia ya Lemosho (siku 7-8)\n\nUnahitaji msaada kuchagua njia?`,
      suggestions: ['Linganisha njia', 'Hifadhi kupanda', 'Vitu vya kubeba', 'Vidokezo vya mafunzo'],
    };
    return { content: 'Naweza kukusaidia kupanga safari nzuri Tanzania! Najua kuhusu mbuga za kitaifa, fukwe, milima, maeneo ya utamaduni, na maeneo ya kipekee. Nini kinakuvutia zaidi?', suggestions: ['Mbuga za Kitaifa', 'Fukwe', 'Safari za Utamaduni', 'Shughuli za Msisimko'] };
  }
  if (type === 'business') {
    if (lower.includes('maelezo') || lower.includes('bidhaa')) return {
      content: `Nitakusaidia kuandika maelezo mazuri ya bidhaa! Hapa kuna kiolezo:\n\n**Kahawa ya Kilimanjaro Premium**\n\nPata ladha tamu ya mlima Kilimanjaro na kahawa yetu bora ya Arabica. Iliovunwa kwa mkono kutoka mashamba ya mwinuko na kukaushwa kikamilifu.\n\n✨ **Sifa:**\n- Mbegu za Arabica za chanzo kimoja\n- Kuchomwa wastani kwa ladha bora\n- Ladha ya chokoleti na machungwa\n- Imepatikana kwa uaminifu kutoka wakulima wa karibu\n\n📦 **Kinapatikana katika:** Mifuko ya 250g, 500g, 1kg\n💰 **Bei:** TZS 15,000 - 45,000\n\nUnataka nikusaidie kuandika maelezo ya bidhaa gani?`,
      suggestions: ['Andika nyingine', 'Chapisho la mitandao', 'Kiolezo cha barua pepe', 'Maelezo ya menyu'],
    };
    return { content: 'Naweza kukusaidia kukua biashara yako na zana za AI! Naweza kuandika maudhui, kuchambua mauzo, kusimamia hesabu, kuunda kampeni za masoko, na kutoa maarifa ya biashara. Unahitaji msaada gani?', suggestions: ['Uandishi wa maudhui', 'Uchambuzi wa mauzo', 'Mawazo ya masoko', 'Msaada wa hesabu'] };
  }
  if (type === 'safety') {
    if (lower.includes('muamala') || lower.includes('salama')) return {
      content: `**Ukaguzi wa Usalama wa Muamala:**\n\n✅ **Muamala huu unaonekana salama!**\n\nNimechambua:\n- Hali ya uthibitishaji wa mfanyabiashara\n- Kiasi cha muamala dhidi ya wastani\n- Uthabiti wa mahali\n- Usalama wa njia ya malipo\n\n🔒 **Vidokezo vya Usalama:**\n- Hakisha daima alama za mfanyabiashara\n- Angalia maelezo ya muamala kabla ya kuthibitisha\n- Washa uthibitishaji wa biometri\n- Ripoti shughuli ya tuhuma mara moja`,
      suggestions: ['Ripoti ulaghai', 'Angalia nyingine', 'Mipangilio ya usalama', 'Hali ya dharura'],
    };
    return { content: 'Nipo hapa kukusaidia usalama! Ninafuatilia miamala kwa ulaghai, naweza kuwasha tahadhari za dharura, kushiriki mahali pako na watu wanaokuamini, na kutoa vidokezo vya usalama. Kila kitu sawa?', suggestions: ['Angalia muamala', 'Hali ya dharura', 'Vidokezo vya usalama', 'Ripoti ulaghai'] };
  }
  if (type === 'translate') {
    if (lower.includes('swahili') || lower.includes('kiswahili')) return {
      content: `**Tafsiri kwa Kiswahili:**\n\nMisemo ya kawaida ya safari:\n- "Hoteli iko wapi?" = "Where is the hotel?"\n- Habari = Hello / Good day\n- Asante = Thank you\n- Bei gani? = How much?\n- Nahitaji msaada = I need help\n- Choo iko wapi? = Where is the bathroom?\n- Maji = Water\n- Chakula = Food\n\n🗣️ **Kidokezo:** Kiswahili ni lugha ya sauti - maneno yanasomwa kama yanavyoandikwa!\n\nUhitaji tafsiri zaidi?`,
      suggestions: ['Tafsiri kwa Kiingereza', 'Misemo zaidi', 'Menyu ya chakula', 'Maneno ya biashara'],
    };
    return { content: 'Naweza kutafsiri kati ya Kiswahili, Kiingereza, Kifaransa, Kijerumani, Kihispania, Kiarabu, na Kimandarin. Andika unachotaka kutafsiriwa, au tumia sauti!', suggestions: ['Kiswahili kwa Kiingereza', 'Kiingereza kwa Kiswahili', 'Misemo ya kawaida', 'Tafsiri kwa sauti'] };
  }
  return { content: 'Nipo hapa kusaidia! Unataka kujua nini?', suggestions: ASSISTANTS.find(a => a.id === type)?.suggestions };
}

export function AIAssistantPage({ onBack, accessToken }: AIAssistantPageProps) {
  const [activeId, setActiveId] = useState('travel');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { track } = useAnalytics(accessToken);

  const assistant = ASSISTANTS.find(a => a.id === activeId)!;

  useEffect(() => {
    setMessages([{ id: '1', role: 'assistant', content: assistant.greeting, timestamp: new Date(), suggestions: assistant.suggestions }]);
  }, [activeId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    track('ai_assistant_message_sent', { assistant: activeId, message: inputText });
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: inputText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);
    setTimeout(() => {
      const resp = generateResponse(inputText, activeId);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: resp.content, timestamp: new Date(), suggestions: resp.suggestions }]);
      setIsTyping(false);
    }, 1500);
  };

  const IconComponent = assistant.icon;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#080d08' }}>
      {/* Header */}
      <div className="sticky top-0 z-20" style={{ background: 'rgba(8,13,8,0.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="px-4 pt-6 pb-3">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={onBack} className="p-2.5 rounded-full active:scale-95" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <ArrowLeft className="size-5 text-white" />
            </button>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: assistant.gradient }}>
              <IconComponent className="size-5 text-white" />
            </div>
            <div className="flex-1">
              <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>{assistant.name}</h1>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{assistant.description}</p>
            </div>
            <Sparkles className="size-5 animate-pulse" style={{ color: '#c4b5fd' }} />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {ASSISTANTS.map(a => {
              const Icon = a.icon;
              const active = activeId === a.id;
              return (
                <button key={a.id}
                  onClick={() => { setActiveId(a.id); setMessages([]); }}
                  className="flex items-center gap-2 px-3 py-2 rounded-full whitespace-nowrap transition-all active:scale-95 text-sm font-semibold"
                  style={{
                    background: active ? a.gradient : 'rgba(255,255,255,0.06)',
                    color: active ? '#fff' : 'rgba(255,255,255,0.5)',
                    border: active ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  }}>
                  <Icon className="size-3.5" />
                  {a.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[85%] rounded-3xl p-4"
              style={msg.role === 'user'
                ? { background: 'linear-gradient(135deg, #16a34a, #15803d)', color: '#fff' }
                : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }
              }>
              <p style={{ fontSize: '13px', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{msg.content}</p>
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="mt-3 pt-3 space-y-1.5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: '6px', letterSpacing: '0.5px' }}>MAPENDEKEZO</p>
                  {msg.suggestions.map((s, i) => (
                    <button key={i} onClick={() => setInputText(s)}
                      className="w-full rounded-xl px-3 py-2 text-left transition-all active:scale-[0.98]"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="rounded-3xl p-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex gap-1.5">
                {[0, 150, 300].map(delay => (
                  <div key={delay} className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'rgba(255,255,255,0.4)', animationDelay: `${delay}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 px-4 pb-6 pt-3" style={{ background: 'rgba(8,13,8,0.96)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex gap-2 items-center">
          <button className="p-3 rounded-full active:scale-95" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <Mic className="size-5" style={{ color: 'rgba(255,255,255,0.5)' }} />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder={`Uliza ${assistant.name}...`}
            className="flex-1 h-12 px-4 rounded-full border-0 focus:outline-none text-sm text-white"
            style={{ background: 'rgba(255,255,255,0.07)', caretColor: '#4ade80' }}
          />
          <button onClick={handleSend} disabled={!inputText.trim()}
            className="p-3 rounded-full transition-all active:scale-95 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
            <Send className="size-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
