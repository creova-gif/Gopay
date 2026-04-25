import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, ChevronDown } from 'lucide-react';

interface Message {
  id: string;
  from: 'user' | 'support';
  text: string;
  time: Date;
}

const QUICK_REPLIES = [
  'Ninahitaji msaada na malipo',
  'Salio langu si sahihi',
  'Nimesahau PIN yangu',
  'Ripoti tatizo',
];

const AUTO_REPLIES: Record<string, string> = {
  'malipo': 'Shida yako ya malipo imesajiliwa. Msaada wetu atakuwasiliana ndani ya dakika 5. Nambari yako ya tiketi: #' + Math.floor(Math.random() * 90000 + 10000),
  'salio': 'Salio linaweza kuchukua dakika 1-5 kusasishwa. Ikiwa bado kuna tatizo baada ya dakika 10, tafadhali wasiliana nasi tena.',
  'pin': 'Unaweza kubadilisha PIN yako kwenye: Mipangilio → Usalama → Badilisha PIN. Unahitaji kujaza namba yako ya simu na OTP.',
  'tatizo': 'Tatizo lako limesajiliwa. Timu yetu itaangalia na kujibu ndani ya masaa 24.',
  'default': 'Asante kwa kuwasiliana! Mtu wa msaada atawasiliana nawe hivi karibuni. Unaweza pia kupiga simu: 0800 123 456 (bure).',
};

function getAutoReply(text: string): string {
  const lower = text.toLowerCase();
  for (const [key, reply] of Object.entries(AUTO_REPLIES)) {
    if (key !== 'default' && lower.includes(key)) return reply;
  }
  return AUTO_REPLIES.default;
}

interface SupportChatProps {
  forceOpen?: boolean;
  proactiveMessage?: string;
}

export function SupportChat({ forceOpen, proactiveMessage }: SupportChatProps = {}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      from: 'support',
      text: 'Karibu kwenye msaada wa goPay! Tunafurahi kukusaidia. Tafadhali niambie tatizo lako.',
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  }, [open, messages]);

  useEffect(() => {
    if (forceOpen) {
      setOpen(true);
      if (proactiveMessage) {
        setTimeout(() => send(proactiveMessage), 300);
      }
    }
  }, [forceOpen]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), from: 'user', text, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        from: 'support',
        text: getAutoReply(text),
        time: new Date(),
      };
      setMessages(prev => [...prev, reply]);
      setTyping(false);
      if (!open) setUnread(n => n + 1);
    }, 1200);
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-5 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
        style={{
          background: '#16a34a',
          boxShadow: '0 8px 24px rgba(22,163,74,0.4)',
          display: open ? 'none' : 'flex',
        }}
      >
        <MessageCircle className="size-6 text-white" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold"
            style={{ background: '#dc2626' }}>
            {unread}
          </span>
        )}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-5 left-5 z-50 rounded-3xl overflow-hidden flex flex-col"
            style={{
              background: '#0f1a0f',
              border: '1px solid rgba(22,163,74,0.2)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              maxHeight: '70vh',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5"
              style={{ background: 'rgba(22,163,74,0.1)', borderBottom: '1px solid rgba(22,163,74,0.15)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: '#16a34a' }}>
                  <MessageCircle className="size-5 text-white" />
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Msaada wa goPay</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: '#4ade80' }} />
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Tunapatikana</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 rounded-full"
                style={{ background: 'rgba(255,255,255,0.08)' }}>
                <ChevronDown className="size-4 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ minHeight: '200px', maxHeight: '320px' }}>
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className="max-w-[80%] px-3.5 py-2.5 rounded-2xl"
                    style={{
                      background: msg.from === 'user'
                        ? '#16a34a'
                        : 'rgba(255,255,255,0.07)',
                      color: '#fff',
                      fontSize: '13px',
                      lineHeight: '1.5',
                      borderRadius: msg.from === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl flex gap-1"
                    style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '18px 18px 18px 4px' }}>
                    {[0, 1, 2].map(i => (
                      <span key={i} className="w-2 h-2 rounded-full"
                        style={{
                          background: 'rgba(255,255,255,0.4)',
                          animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
                        }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick replies */}
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {QUICK_REPLIES.map(q => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95"
                  style={{
                    background: 'rgba(22,163,74,0.12)',
                    border: '1px solid rgba(22,163,74,0.2)',
                    color: '#4ade80',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="px-4 pb-4 pt-2 flex gap-2 items-end"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
                placeholder="Andika ujumbe..."
                className="flex-1 px-4 py-3 rounded-2xl outline-none text-sm"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                }}
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim()}
                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-95"
                style={{
                  background: input.trim() ? '#16a34a' : 'rgba(255,255,255,0.08)',
                }}
              >
                <Send className="size-4 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
