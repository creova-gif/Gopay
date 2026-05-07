import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wallet, Smartphone, Shield, Zap, Award,
  ChevronLeft, Check, ArrowRight, Sparkles, Lock,
  TrendingUp, Users, QrCode, CreditCard, Plane,
  Gift, Star, Phone, User, MapPin, Fingerprint,
} from 'lucide-react';
import { InlinePinPad } from './ui/PinPad';
import goPayLogo from 'figma:asset/d92565bd030dba68ccff66e379d172066e4f2d27.png';

interface OnboardingFlowProps {
  onComplete: (userData: any) => void;
  onSkipToDemo: () => void;
  userEmail?: string;
  userId?: string;
}

const BG = '#080d08';
const CARD = 'rgba(255,255,255,0.05)';
const BORDER = '1px solid rgba(255,255,255,0.08)';
const GREEN = '#4ade80';
const GREEN_DARK = '#16a34a';

const features = [
  {
    step: 1,
    emoji: '⚡',
    color: '#4ade80',
    glow: 'rgba(74,222,128,0.25)',
    title: 'Malipo Haraka',
    subtitle: 'Lipa kila kitu kwa sekunde moja',
    bullets: [
      { icon: Zap,           text: 'Bili za umeme & maji',        color: '#fbbf24' },
      { icon: Smartphone,    text: 'Airtime & data bundles',       color: '#34d399' },
      { icon: Shield,        text: 'Huduma za serikali',           color: '#60a5fa' },
      { icon: QrCode,        text: 'Malipo ya QR code',            color: '#a78bfa' },
    ],
  },
  {
    step: 2,
    emoji: '🎁',
    color: '#fb923c',
    glow: 'rgba(251,146,60,0.25)',
    title: 'Pokea Zawadi',
    subtitle: '15% cashback kwa kila malipo unayofanya',
    bullets: [
      { icon: Award,        text: 'Viwango 4 vya GOrewards',      color: '#fbbf24' },
      { icon: Gift,         text: '15% cashback kila wakati',     color: '#fb923c' },
      { icon: Star,         text: 'Zawadi za kipekee',            color: '#f472b6' },
      { icon: TrendingUp,   text: 'Pointi zinazokua',             color: '#34d399' },
    ],
  },
  {
    step: 3,
    emoji: '🔒',
    color: '#60a5fa',
    glow: 'rgba(96,165,250,0.25)',
    title: 'Salama Kabisa',
    subtitle: 'Usalama wa kiwango cha benki kwenye mkono wako',
    bullets: [
      { icon: Shield,      text: 'BoT certified & ISO 27001',    color: '#34d399' },
      { icon: Lock,        text: 'Usimbaji fiche wa hali ya juu', color: '#60a5fa' },
      { icon: Fingerprint, text: 'Uthibitisho wa kibayometriki',  color: '#a78bfa' },
      { icon: Users,       text: 'Imaminika na watanzania 100K+', color: '#fb923c' },
    ],
  },
];

const TOTAL = 6; // 0=splash, 1-3=features, 4=profile, 5=pin

export function OnboardingFlow({ onComplete, onSkipToDemo, userEmail = '', userId = '' }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [userData, setUserData] = useState({ name: '', phone: '', email: userEmail, location: 'Dar es Salaam' });
  const [pinPhase, setPinPhase] = useState<'create' | 'confirm'>('create');
  const [tempPin, setTempPin] = useState('');
  const [confirmVal, setConfirmVal] = useState('');
  const [pinError, setPinError] = useState('');
  const [done, setDone] = useState(false);
  const [confettiItems] = useState(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      hue: Math.floor(Math.random() * 360),
      delay: Math.random() * 0.6,
      dur: 2.2 + Math.random() * 1.5,
      size: 6 + Math.random() * 8,
    }))
  );

  // Auto-advance splash
  useEffect(() => {
    if (step === 0) {
      const t = setTimeout(() => goNext(), 2800);
      return () => clearTimeout(t);
    }
  }, [step]);

  const goNext = () => { setDir(1); setStep(s => s + 1); };
  const goPrev = () => { setDir(-1); setStep(s => Math.max(s - 1, 0)); };

  const handlePinInput = (val: string) => {
    setPinError('');
    if (pinPhase === 'create') {
      setTempPin(val);
      if (val.length === 4) setTimeout(() => setPinPhase('confirm'), 260);
    } else {
      setConfirmVal(val);
      if (val.length === 4) {
        if (val !== tempPin) {
          setPinError('PIN hazifanani. Jaribu tena.');
          setTimeout(() => { setTempPin(''); setConfirmVal(''); setPinPhase('create'); }, 900);
        } else {
          finishOnboarding(tempPin);
        }
      }
    }
  };

  const finishOnboarding = (pin: string) => {
    if (!userData.name.trim() || !userData.phone.trim()) {
      toast.error('Tafadhali jaza jina na nambari ya simu');
      setStep(4); return;
    }
    if (userId) localStorage.setItem(`gopay_onboarded_${userId}`, '1');
    setDone(true);
    setTimeout(() => onComplete({ ...userData, pin }), 2800);
  };

  const canAdvanceProfile = userData.name.trim().length >= 2 && userData.phone.trim().length >= 9;

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (done) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: BG, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {confettiItems.map(p => (
          <motion.div key={p.id}
            style={{ position: 'absolute', left: `${p.x}%`, top: '-5%', width: p.size, height: p.size, borderRadius: '50%', background: `hsl(${p.hue},70%,60%)` }}
            animate={{ y: '110vh', rotate: 720, opacity: [1, 1, 0] }}
            transition={{ duration: p.dur, delay: p.delay, ease: 'easeIn' }}
          />
        ))}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
          style={{ width: 96, height: 96, borderRadius: 28, background: 'linear-gradient(135deg,#16a34a,#15803d)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28, boxShadow: '0 0 60px rgba(22,163,74,0.5)' }}>
          <Check style={{ width: 48, height: 48, color: '#fff' }} />
        </motion.div>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginBottom: 10, textAlign: 'center' }}>
          Karibu goPay! 🇹🇿
        </motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', textAlign: 'center' }}>
          Akaunti yako imefunguliwa. Twende pamoja!
        </motion.p>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: BG, overflow: 'hidden' }}>
      <style>{`
        @keyframes ob-orb { 0%,100%{transform:scale(1) rotate(0deg);opacity:.25} 50%{transform:scale(1.15) rotate(180deg);opacity:.45} }
        @keyframes ob-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes ob-pulse { 0%,100%{opacity:.3} 50%{opacity:.6} }
        .ob-orb { animation: ob-orb 9s ease-in-out infinite; }
        .ob-float { animation: ob-float 4s ease-in-out infinite; }
        .ob-input::placeholder { color: rgba(255,255,255,0.28); }
        .ob-input:focus { border-color: rgba(74,222,128,0.6) !important; background: rgba(74,222,128,0.06) !important; outline: none; }
        .ob-sel { background: #080d08; color: #fff; }
        .ob-sel option { background: #0f1a0f; }
      `}</style>

      {/* Ambient blobs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div className="ob-orb" style={{ position: 'absolute', top: '-15%', right: '-10%', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle,rgba(22,163,74,0.35),transparent 70%)' }} />
        <div className="ob-orb" style={{ position: 'absolute', bottom: '-15%', left: '-10%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle,rgba(22,163,74,0.2),transparent 70%)', animationDelay: '4s' }} />
      </div>

      {/* Progress dots — hidden on splash */}
      {step > 0 && step <= 5 && (
        <div style={{ position: 'absolute', top: 20, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6, zIndex: 30 }}>
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div key={i} style={{ height: 4, borderRadius: 2, transition: 'all 0.3s',
              width: i + 1 === step ? 24 : 8,
              background: i + 1 <= step ? GREEN : 'rgba(255,255,255,0.18)' }} />
          ))}
        </div>
      )}

      {/* Skip */}
      {step > 0 && step < 4 && (
        <button onClick={onSkipToDemo}
          style={{ position: 'absolute', top: 16, right: 16, zIndex: 40, padding: '7px 16px', borderRadius: 20, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
          Ruka
        </button>
      )}

      <AnimatePresence custom={dir} mode="wait">

        {/* ── STEP 0: Splash ── */}
        {step === 0 && (
          <motion.div key="splash" custom={dir} variants={variants} initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.45, ease: [0.4,0,0.2,1] }}
            style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
            <motion.div className="ob-float" style={{ marginBottom: 32, position: 'relative' }}>
              <div style={{ position: 'absolute', inset: -20, borderRadius: '50%', background: 'radial-gradient(circle,rgba(22,163,74,0.4),transparent 70%)' }} />
              <img src={goPayLogo} alt="goPay" style={{ width: 100, height: 100, objectFit: 'contain', position: 'relative' }} />
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              style={{ fontSize: 42, fontWeight: 900, color: '#fff', marginBottom: 10, textAlign: 'center', letterSpacing: '-1px' }}>
              goPay
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', textAlign: 'center', maxWidth: 260 }}>
              Pochi yako ya dijitali ya Tanzania 🇹🇿
            </motion.p>
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.7, duration: 2.1 }}
              style={{ position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)', width: 120, height: 3, borderRadius: 2, background: `linear-gradient(90deg,transparent,${GREEN},transparent)`, transformOrigin: 'left' }} />
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              style={{ position: 'absolute', bottom: 30, fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
              Inapakia…
            </motion.p>
          </motion.div>
        )}

        {/* ── STEPS 1-3: Feature slides ── */}
        {step >= 1 && step <= 3 && (() => {
          const f = features[step - 1];
          return (
            <motion.div key={`feature-${step}`} custom={dir} variants={variants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.38, ease: [0.4,0,0.2,1] }}
              style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px 24px' }}>
              <div style={{ width: '100%', maxWidth: 400 }}>
                {/* Hero emoji badge */}
                <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 260, delay: 0.1 }}
                  style={{ width: 90, height: 90, borderRadius: 26, background: `${f.color}18`, border: `1.5px solid ${f.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, marginBottom: 26, boxShadow: `0 0 40px ${f.glow}` }}>
                  {f.emoji}
                </motion.div>

                <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                  style={{ fontSize: 30, fontWeight: 900, color: '#fff', marginBottom: 8 }}>
                  {f.title}
                </motion.h2>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                  style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 28, lineHeight: 1.5 }}>
                  {f.subtitle}
                </motion.p>

                {/* Bullet cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
                  {f.bullets.map((b, i) => {
                    const Icon = b.icon;
                    return (
                      <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + i * 0.08 }}
                        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 14, background: CARD, border: BORDER }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${b.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon style={{ width: 18, height: 18, color: b.color }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{b.text}</span>
                      </motion.div>
                    );
                  })}
                </div>

                {/* CTA */}
                <motion.button initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                  onClick={goNext}
                  style={{ width: '100%', height: 54, borderRadius: 18, background: 'linear-gradient(135deg,#16a34a,#15803d)', border: 'none', color: '#fff', fontWeight: 900, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 6px 24px rgba(22,163,74,0.35)' }}>
                  {step < 3 ? 'Endelea' : 'Anza Sasa!'}
                  <ArrowRight style={{ width: 18, height: 18 }} />
                </motion.button>

                {step > 1 && (
                  <button onClick={goPrev}
                    style={{ width: '100%', marginTop: 12, padding: '10px 0', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <ChevronLeft style={{ width: 16, height: 16 }} /> Rudi
                  </button>
                )}
              </div>
            </motion.div>
          );
        })()}

        {/* ── STEP 4: Profile ── */}
        {step === 4 && (
          <motion.div key="profile" custom={dir} variants={variants} initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.38, ease: [0.4,0,0.2,1] }}
            style={{ position: 'absolute', inset: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '72px 20px 32px' }}>
            <div style={{ width: '100%', maxWidth: 400 }}>
              {/* Header */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
                <div style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(74,222,128,0.12)', border: '1.5px solid rgba(74,222,128,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <User style={{ width: 30, height: 30, color: GREEN }} />
                </div>
                <h2 style={{ fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 6 }}>Unda Wasifu Wako</h2>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
                  Unafanya hivi <strong style={{ color: GREEN }}>mara moja tu</strong> — taarifa zako zinabaki salama.
                </p>
              </motion.div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Name */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                  <p style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>JINA KAMILI *</p>
                  <div style={{ position: 'relative' }}>
                    <User style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'rgba(255,255,255,0.35)' }} />
                    <input className="ob-input" type="text" placeholder="Jina lako kamili" value={userData.name}
                      onChange={e => setUserData(u => ({ ...u, name: e.target.value }))}
                      style={{ width: '100%', height: 52, paddingLeft: 48, paddingRight: 16, borderRadius: 14, background: CARD, border: BORDER, color: '#fff', fontSize: 15, boxSizing: 'border-box' as const, transition: 'all 0.2s' }} />
                  </div>
                </motion.div>

                {/* Phone */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                  <p style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>NAMBARI YA SIMU *</p>
                  <div style={{ position: 'relative' }}>
                    <Phone style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'rgba(255,255,255,0.35)' }} />
                    <input className="ob-input" type="tel" placeholder="+255 712 345 678" value={userData.phone}
                      onChange={e => setUserData(u => ({ ...u, phone: e.target.value }))}
                      style={{ width: '100%', height: 52, paddingLeft: 48, paddingRight: 16, borderRadius: 14, background: CARD, border: BORDER, color: '#fff', fontSize: 15, boxSizing: 'border-box' as const, transition: 'all 0.2s' }} />
                  </div>
                </motion.div>

                {/* Location */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  <p style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>MKOA WAKO</p>
                  <div style={{ position: 'relative' }}>
                    <MapPin style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'rgba(255,255,255,0.35)', zIndex: 1 }} />
                    <select className="ob-input ob-sel" value={userData.location}
                      onChange={e => setUserData(u => ({ ...u, location: e.target.value }))}
                      style={{ width: '100%', height: 52, paddingLeft: 48, paddingRight: 16, borderRadius: 14, background: CARD, border: BORDER, color: '#fff', fontSize: 15, boxSizing: 'border-box' as const, appearance: 'none' as const }}>
                      <option value="Dar es Salaam">🏙️ Dar es Salaam</option>
                      <option value="Arusha">🏔️ Arusha</option>
                      <option value="Mwanza">🌊 Mwanza</option>
                      <option value="Dodoma">🏛️ Dodoma</option>
                      <option value="Mbeya">⛰️ Mbeya</option>
                      <option value="Zanzibar">🏝️ Zanzibar</option>
                      <option value="Tanga">🌴 Tanga</option>
                      <option value="Morogoro">🌿 Morogoro</option>
                    </select>
                  </div>
                </motion.div>

                {/* Trust row */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 12, background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.18)' }}>
                  <Shield style={{ width: 15, height: 15, color: GREEN, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>Taarifa zako zinasimbwa na kulindwa — BoT compliant</span>
                </motion.div>

                {/* CTA */}
                <motion.button initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                  onClick={goNext} disabled={!canAdvanceProfile}
                  style={{ width: '100%', height: 54, borderRadius: 18, border: 'none', fontWeight: 900, fontSize: 15, cursor: canAdvanceProfile ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s',
                    background: canAdvanceProfile ? 'linear-gradient(135deg,#16a34a,#15803d)' : 'rgba(22,163,74,0.25)',
                    color: canAdvanceProfile ? '#fff' : 'rgba(255,255,255,0.35)',
                    boxShadow: canAdvanceProfile ? '0 6px 24px rgba(22,163,74,0.35)' : 'none' }}>
                  Endelea
                  <ArrowRight style={{ width: 18, height: 18 }} />
                </motion.button>

                <button onClick={goPrev}
                  style={{ width: '100%', padding: '10px 0', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <ChevronLeft style={{ width: 16, height: 16 }} /> Rudi
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── STEP 5: PIN ── */}
        {step === 5 && (
          <motion.div key="pin" custom={dir} variants={variants} initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.38, ease: [0.4,0,0.2,1] }}
            style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 24px 32px' }}>
            <div style={{ width: '100%', maxWidth: 380 }}>
              {/* Icon */}
              <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 220 }}
                style={{ width: 72, height: 72, borderRadius: 22, background: 'linear-gradient(135deg,rgba(96,165,250,0.2),rgba(167,139,250,0.2))', border: '1.5px solid rgba(96,165,250,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, boxShadow: '0 0 40px rgba(96,165,250,0.2)' }}>
                <Lock style={{ width: 34, height: 34, color: '#60a5fa' }} />
              </motion.div>

              <motion.h2 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                style={{ fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 6 }}>
                {pinPhase === 'create' ? 'Weka PIN Yako' : 'Thibitisha PIN'}
              </motion.h2>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
                style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 32, lineHeight: 1.5 }}>
                {pinPhase === 'create'
                  ? 'Chagua PIN ya tarakimu 4 kulinda pochi yako'
                  : `Weka tena PIN yako kuthibitisha`}
              </motion.p>

              <AnimatePresence mode="wait">
                <motion.div key={pinPhase} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <InlinePinPad
                    value={pinPhase === 'create' ? tempPin : confirmVal}
                    onChange={handlePinInput}
                    length={4}
                    error={pinError || undefined}
                  />
                </motion.div>
              </AnimatePresence>

              {pinError && (
                <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  style={{ fontSize: 13, color: '#f87171', textAlign: 'center', marginTop: 16 }}>
                  {pinError}
                </motion.p>
              )}

              {/* Phase indicator */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 24 }}>
                {['create', 'confirm'].map((ph, i) => (
                  <div key={ph} style={{ width: 32, height: 3, borderRadius: 2, transition: 'all 0.3s',
                    background: (pinPhase === 'confirm' && i === 0) || (pinPhase === 'confirm' && i === 1) ? GREEN :
                      pinPhase === 'create' && i === 0 ? GREEN : 'rgba(255,255,255,0.18)' }} />
                ))}
              </div>

              <button onClick={goPrev}
                style={{ width: '100%', marginTop: 20, padding: '10px 0', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <ChevronLeft style={{ width: 16, height: 16 }} /> Rudi
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16 }}>
                <Fingerprint style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.3)' }} />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>BoT Certified • ISO 27001 Compliant</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
