import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Sparkles, Plane, Bus, Ship, Train, Hotel, Mountain, MapPin, Clock, Star } from 'lucide-react';
import { User } from '../App';

interface Props { user: User; accessToken: string; onBack: () => void; onNavigate?: (service: string) => void; }

interface Message { id: string; role: 'user' | 'ai'; text: string; suggestions?: string[]; actions?: { label: string; service: string }[]; }

const AI_RESPONSES: Record<string, { text: string; suggestions?: string[]; actions?: { label: string; service: string }[] }> = {
  default: { text: 'Habari! Mimi ni msaidizi wako wa AI kwa safari Tanzania. Ninaweza kukusaidia kupanga safari yako, kupata bei bora, na kutoa mapendekezo ya maeneo mazuri. Unataka nikusaidie nini?', suggestions: ['Nenda Zanzibar', 'Safari Serengeti', 'Ndege ya bei nafuu', 'Hoteli ya Dar es Salaam'] },
  zanzibar: { text: 'Zanzibar ni moja ya maeneo mazuri zaidi Tanzania! Hapa kuna chaguzi bora:\n\n🚢 Ferry kutoka Dar: TZS 24,500 (masaa 2.5)\n✈️ Ndege kutoka Dar: TZS 145,000 (dakika 40)\n🏨 Hoteli: Kuanzia TZS 180,000/usiku\n\nNingependa kukusaidia na gani?', suggestions: ['Piga tiketi ya ferry', 'Tafuta ndege', 'Ona hoteli Zanzibar', 'Maeneo ya kutembelea'], actions: [{ label: 'Piga Tiketi ya Ferry', service: 'ferry' }, { label: 'Tafuta Ndege', service: 'flights' }, { label: 'Tafuta Hoteli', service: 'hotels' }] },
  serengeti: { text: 'Serengeti ni ajabu ya kweli! Hapa kuna habari muhimu:\n\n🦁 Kipindi bora: Julai-Oktoba (uhamaji mkubwa)\n🚗 Safari ya siku moja: TZS 280,000/mtu\n🏕️ Usiku 2: TZS 580,000/mtu\n🌍 UNESCO World Heritage Site\n\nNingependekeza safari ya angalau siku 2 kupata uzoefu kamili!', suggestions: ['Hifadhi safari ya Serengeti', 'Safari nyingine', 'Je ninaweza kwenda lini?', 'Bei za msimu wa juu'], actions: [{ label: 'Hifadhi Safari', service: 'parks' }] },
  flights: { text: 'Ndege za ndani Tanzania ni rahisi na za haraka! Hapa kuna njia maarufu:\n\n✈️ DAR → ZNZ: TZS 145,000 – 170,000 (dakika 40)\n✈️ DAR → JRO: TZS 285,000 – 310,000 (masaa 1.25)\n✈️ DAR → MWZ: TZS 340,000 (masaa 1.5)\n\nWashirika: Precision Air, Air Tanzania, Safari Air Link', suggestions: ['Tafuta ndege Zanzibar', 'Tafuta ndege Kilimanjaro', 'Ndege bei nafuu', 'Jinsi ya kubooking'], actions: [{ label: 'Tafuta Ndege', service: 'flights' }] },
  buses: { text: 'Mabasi ya starehe Tanzania ni njia nzuri ya safari! Hapa kuna habari:\n\n🚌 VIP: WiFi, AC, viti vinavyopinda\n💺 Kuanzia: TZS 22,000 (kawaida) hadi TZS 40,000 (VIP Plus)\n🛣️ Njia maarufu: DAR–Arusha (masaa 8-9)\n\nWaendeshaji wazuri: Kilimanjaro Express, Royal Coach, Dar Express', suggestions: ['Piga tiketi ya basi', 'Dar hadi Arusha', 'Bei za mabasi', 'Tofauti kati ya darasa'], actions: [{ label: 'Piga Tiketi ya Basi', service: 'buses' }] },
  sgr: { text: 'SGR (Standard Gauge Railway) ni treni mpya ya kisasa Tanzania!\n\n🚂 Safari: Dar es Salaam → Morogoro\n⏱️ Muda: Masaa 2h 15m tu (badala ya masaa 4 kwa gari)\n💺 Darasa la Uchumi: TZS 15,000\n💼 Darasa la Biashara: TZS 35,000\n👑 VIP: TZS 60,000\n\nTrasi zinaendelea hadi Dodoma na zaidi!', suggestions: ['Piga tiketi ya SGR', 'Masaa ya kuondoka', 'Tofauti kati ya madarasa', 'Stesheni za SGR'], actions: [{ label: 'Piga Tiketi ya SGR', service: 'sgr' }] },
  hotels: { text: 'Tanzania ina hoteli za aina zote! Hapa kuna mapendekezo:\n\n⭐ Bei ya chini: TZS 80,000/usiku\n⭐⭐⭐ Kati: TZS 150,000–250,000/usiku\n⭐⭐⭐⭐⭐ Starehe: TZS 280,000+/usiku\n\n📍 Dar es Salaam, Zanzibar, Arusha, Moshi – hoteli bora zinapatikana!', suggestions: ['Hoteli Zanzibar', 'Hoteli Dar es Salaam', 'Hoteli karibu na Serengeti', 'Resort bei nafuu'], actions: [{ label: 'Tafuta Hoteli', service: 'hotels' }] },
  budget: { text: 'Hapa kuna safari ya bei nafuu Tanzania! 💰\n\n✈️ Ndege: Angalia siku za wiki 2 kabla\n🚌 Basi: Njia nzuri ya kuokoa – TZS 22,000+\n🏨 Hoteli: Zanzibar guesthouses kuanzia TZS 80,000\n🦁 Mbuga: TANAPA ina bei za raia – TZS 5,000/siku tu!\n\nNingependa kukusaidia kupanga safari ya bajeti yako!', suggestions: ['Safari ya bajeti Zanzibar', 'Mbuga kwa raia', 'Basi hadi Arusha', 'Mapendekezo mengine'] },
};

function getAIResponse(input: string) {
  const lower = input.toLowerCase();
  if (lower.includes('zanzibar') || lower.includes('zanzibari')) return AI_RESPONSES.zanzibar;
  if (lower.includes('serengeti') || lower.includes('safari')) return AI_RESPONSES.serengeti;
  if (lower.includes('ndege') || lower.includes('flight') || lower.includes('kuruka')) return AI_RESPONSES.flights;
  if (lower.includes('basi') || lower.includes('bus')) return AI_RESPONSES.buses;
  if (lower.includes('sgr') || lower.includes('treni') || lower.includes('train')) return AI_RESPONSES.sgr;
  if (lower.includes('hoteli') || lower.includes('hotel') || lower.includes('lodge')) return AI_RESPONSES.hotels;
  if (lower.includes('bei nafuu') || lower.includes('budget') || lower.includes('pesa kidogo')) return AI_RESPONSES.budget;
  if (lower.includes('ferry') || lower.includes('meli') || lower.includes('bahari')) return { text: 'Ferry ni njia nzuri ya kwenda Zanzibar! Azam Marine na Kilimanjaro Fast Ferries wana safiri nyingi kila siku. Bei: TZS 24,500 kwa abiria mmoja.', suggestions: ['Piga tiketi ya ferry', 'Ratiba za ferry', 'Kuchukua gari ferini'], actions: [{ label: 'Piga Tiketi ya Ferry', service: 'ferry' }] };
  if (lower.includes('mbuga') || lower.includes('park') || lower.includes('ngorongoro') || lower.includes('kilimanjaro')) return { text: 'Tanzania ina mbuga 16 za kitaifa! Maarufu zaidi: Serengeti (UNESCO), Ngorongoro Crater, Kilimanjaro NP, Tarangire. TANAPA ndio mamlaka rasmi.', suggestions: ['Hifadhi Serengeti', 'Ngorongoro safari', 'Mbuga bei nafuu', 'Kilimanjaro trek'], actions: [{ label: 'Angalia Mbuga Zote', service: 'parks' }] };
  return { ...AI_RESPONSES.default, text: `Umeniandika: "${input}"\n\nNinaweza kukusaidia na safari yako Tanzania! Chagua mada mojawapo au niambie zaidi kuhusu safari unayotaka kupanga.` };
}

const QUICK_PROMPTS = [
  { icon: Plane, text: 'Ndege ya bei nafuu', color: '#60a5fa' },
  { icon: Ship, text: 'Ferry ya Zanzibar', color: '#22d3ee' },
  { icon: Mountain, text: 'Safari Serengeti', color: '#34d399' },
  { icon: Hotel, text: 'Hoteli bora', color: '#fb923c' },
];

export function AITravelAssistant({ user, accessToken, onBack, onNavigate }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'ai', text: AI_RESPONSES.default.text, suggestions: AI_RESPONSES.default.suggestions }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const res = getAIResponse(text);
      const aiMsg: Message = { id: (Date.now()+1).toString(), role: 'ai', text: res.text, suggestions: res.suggestions, actions: (res as any).actions };
      setMessages(prev => [...prev, aiMsg]);
      setTyping(false);
    }, 900 + Math.random() * 600);
  };

  return (
    <div style={{ height: '100vh', background: '#080d08', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div className="sticky top-0 z-20" style={{ background: 'rgba(8,13,8,0.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ padding: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft style={{ width: 20, height: 20, color: '#fff' }} />
          </button>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#4f46e5,#7e22ce)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles style={{ width: 20, height: 20, color: '#fff' }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '16px', fontWeight: 900, color: '#fff' }}>AI Travel Assistant</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80' }} />
              <span style={{ fontSize: '11px', color: '#4ade80', fontWeight: 700 }}>Mtandaoni · GPT-4o</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {messages.map(msg => (
          <div key={msg.id}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
              {msg.role === 'ai' && (
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#4f46e5,#7e22ce)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Sparkles style={{ width: 15, height: 15, color: '#fff' }} />
                </div>
              )}
              <div style={{ maxWidth: '80%', padding: '12px 16px', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.role === 'user' ? 'linear-gradient(135deg,#16a34a,#15803d)' : 'rgba(255,255,255,0.06)', border: msg.role === 'ai' ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                <p style={{ fontSize: '13px', color: '#fff', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{msg.text}</p>
              </div>
            </div>
            {msg.actions && msg.actions.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8, marginLeft: 42 }}>
                {msg.actions.map(action => (
                  <button key={action.service} onClick={() => onNavigate?.(action.service)}
                    style={{ padding: '8px 14px', borderRadius: 14, background: 'rgba(79,70,229,0.2)', border: '1px solid rgba(79,70,229,0.4)', color: '#a5b4fc', fontWeight: 800, fontSize: '12px', cursor: 'pointer' }}>
                    {action.label} →
                  </button>
                ))}
              </div>
            )}
            {msg.suggestions && msg.suggestions.length > 0 && (
              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 8, marginLeft: msg.role === 'ai' ? 42 : 0 }}>
                {msg.suggestions.map(s => (
                  <button key={s} onClick={() => sendMessage(s)}
                    style={{ padding: '7px 12px', borderRadius: 20, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {typing && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#4f46e5,#7e22ce)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles style={{ width: 15, height: 15, color: '#fff' }} />
            </div>
            <div style={{ padding: '12px 16px', borderRadius: '18px 18px 18px 4px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 5 }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(255,255,255,0.4)', animation: `bounce 1.2s ease-in-out ${i*0.2}s infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ flexShrink: 0, padding: '0 16px 8px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 8, paddingBottom: 8, scrollbarWidth: 'none' }}>
          {QUICK_PROMPTS.map(({ icon: Icon, text, color }) => (
            <button key={text} onClick={() => sendMessage(text)}
              style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 7, padding: '8px 14px', borderRadius: 20, background: `${color}12`, border: `1px solid ${color}30`, color, fontWeight: 700, fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <Icon style={{ width: 13, height: 13 }} />{text}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 16px 20px', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 10, padding: '12px', borderRadius: 20, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder="Niulize kuhusu safari Tanzania..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '14px' }} />
          <button onClick={() => sendMessage(input)} disabled={!input.trim()}
            style={{ width: 40, height: 40, borderRadius: 14, background: input.trim() ? 'linear-gradient(135deg,#4f46e5,#7e22ce)' : 'rgba(255,255,255,0.08)', border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Send style={{ width: 18, height: 18, color: '#fff' }} />
          </button>
        </div>
      </div>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}`}</style>
    </div>
  );
}
