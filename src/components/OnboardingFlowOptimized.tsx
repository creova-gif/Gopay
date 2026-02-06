/**
 * OPTIMIZED ONBOARDING FLOW - FINTECH BEST PRACTICES
 * 
 * Patterns from:
 * - Wave: Phone → OTP → Done (2 screens)
 * - M-Pesa: Progressive KYC
 * - NALA: Value-first approach
 * - Chipper Cash: Social proof
 * 
 * Goals:
 * - 3 screens maximum
 * - Clear value proposition
 * - Minimal friction
 * - Progressive disclosure
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Phone,
  Shield,
  Zap,
  Star,
  Check,
  ChevronRight,
  Fingerprint,
  Eye,
  EyeOff
} from 'lucide-react';
import { FinButton, FinInput } from './design-system/DesignSystem';

interface OnboardingFlowOptimizedProps {
  onComplete: (data: any) => void;
  onSkipToDemo: () => void;
}

export function OnboardingFlowOptimized({
  onComplete,
  onSkipToDemo
}: OnboardingFlowOptimizedProps) {
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  
  // ═══════════════════════════════════════════════════════════
  // SCREEN 1: VALUE PROPOSITION (Wave/NALA Pattern)
  // ═══════════════════════════════════════════════════════════
  
  const ValueScreen = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 relative overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          className="absolute top-10 right-10 w-64 h-64 bg-white/30 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-48 h-48 bg-yellow-400/30 rounded-full blur-3xl"
          animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.3, 0.2, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>
      
      <div className="relative z-10 px-6 pt-12 pb-8 flex flex-col min-h-screen">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl border border-white/30">
            <div className="text-5xl font-black text-white">goPay</div>
          </div>
        </motion.div>
        
        {/* Hero Message */}
        <div className="flex-1 flex flex-col justify-center space-y-6 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-5xl font-black text-white mb-3 leading-tight">
              Karibu goPay
            </h1>
            <p className="text-xl text-emerald-100 font-semibold">
              Your Complete Tanzania Super App
            </p>
            <p className="text-sm text-white/70 mt-1">
              All payments, travel & services in one place
            </p>
          </motion.div>
          
          {/* Value Props (NALA/Wave Pattern) */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 mt-8"
          >
            {[
              {
                icon: <Zap className="size-6" />,
                titleSw: 'Lipa Haraka',
                titleEn: 'Send money instantly',
                desc: 'M-Pesa, Tigo, Airtel - all networks'
              },
              {
                icon: <Shield className="size-6" />,
                titleSw: 'Salama 100%',
                titleEn: 'Bank-grade security',
                desc: 'Licensed by Bank of Tanzania'
              },
              {
                icon: <Star className="size-6" />,
                titleSw: 'Tuzo na Punguzo',
                titleEn: 'Rewards & discounts',
                desc: 'Earn on every transaction'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4"
              >
                <div className="bg-white/20 p-3 rounded-xl text-white flex-shrink-0">
                  {item.icon}
                </div>
                <div className="text-left flex-1">
                  <p className="text-white font-bold text-base">
                    {item.titleSw}
                  </p>
                  <p className="text-emerald-100 text-sm font-medium">
                    {item.titleEn}
                  </p>
                  <p className="text-white/70 text-xs mt-0.5">
                    {item.desc}
                  </p>
                </div>
                <Check className="size-5 text-green-400" />
              </motion.div>
            ))}
          </motion.div>
          
          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="pt-6"
          >
            <div className="flex items-center justify-center gap-2 text-white/90 text-sm">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="size-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-2 border-white"
                  />
                ))}
              </div>
              <p className="font-semibold">
                <span className="text-yellow-400">50,000+</span> Watanzania wanatumia goPay
              </p>
            </div>
            <p className="text-white/60 text-xs mt-1">
              Join 50,000+ Tanzanians using goPay
            </p>
          </motion.div>
        </div>
        
        {/* CTA */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="space-y-3"
        >
          <FinButton
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => setStep(1)}
            className="!bg-white !text-emerald-700 !shadow-2xl hover:!bg-emerald-50"
          >
            <span className="font-black">Anza Sasa</span>
            <span className="text-sm opacity-70">Start Now</span>
            <ChevronRight className="size-5" />
          </FinButton>
          
          <button
            onClick={onSkipToDemo}
            className="w-full text-white/80 hover:text-white text-sm font-medium py-3 transition-colors"
          >
            Jaribu Demo • Try Demo
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
  
  // ═══════════════════════════════════════════════════════════
  // SCREEN 2: PHONE VERIFICATION (M-Pesa/Wave Pattern)
  // ═══════════════════════════════════════════════════════════
  
  const PhoneScreen = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-gray-50 px-6 py-8"
    >
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Hatua 1 ya 2</span>
          <span className="text-xs text-gray-600">Step 1 of 2</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '50%' }}
            className="h-full bg-gradient-to-r from-emerald-600 to-teal-600"
          />
        </div>
      </div>
      
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring' }}
        className="mb-6"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl flex items-center justify-center mx-auto">
          <Phone className="size-10 text-white" />
        </div>
      </motion.div>
      
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-gray-900 mb-2">
          Weka Namba Yako
        </h2>
        <p className="text-base text-gray-600 font-medium">
          Enter your phone number
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Tutatuma nambari ya OTP kwa kuthibitisha
        </p>
      </div>
      
      {/* Phone Input (Wave Pattern) */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <span className="text-2xl">🇹🇿</span>
            <span className="text-gray-700 font-semibold">+255</span>
          </div>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 9))}
            placeholder="712 345 678"
            className="w-full pl-28 pr-4 py-5 text-2xl font-bold text-gray-900 border-2 border-gray-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 rounded-2xl outline-none transition-all tabular-nums"
            autoFocus
            maxLength={9}
          />
        </div>
        
        {/* Network Detection (M-Pesa Pattern) */}
        {phone.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm"
          >
            {phone.startsWith('7') && (
              <>
                <div className="size-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">V</span>
                </div>
                <span className="text-gray-700 font-semibold">Vodacom M-Pesa</span>
              </>
            )}
            {phone.startsWith('6') && (
              <>
                <div className="size-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">T</span>
                </div>
                <span className="text-gray-700 font-semibold">Tigo Pesa</span>
              </>
            )}
          </motion.div>
        )}
      </div>
      
      {/* Trust Signals */}
      <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <Shield className="size-5 text-emerald-700 flex-shrink-0" />
          <div className="text-sm">
            <p className="text-emerald-900 font-bold">
              Namba yako ni salama
            </p>
            <p className="text-emerald-700">
              Your number is secure and encrypted
            </p>
          </div>
        </div>
      </div>
      
      {/* Terms */}
      <label className="flex items-start gap-3 mb-6 cursor-pointer">
        <input
          type="checkbox"
          checked={agreedTerms}
          onChange={(e) => setAgreedTerms(e.target.checked)}
          className="mt-1 size-5 rounded border-2 border-gray-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500"
        />
        <span className="text-sm text-gray-700 leading-relaxed">
          Ninakubali <span className="font-semibold text-emerald-700">Masharti na Vigezo</span> na <span className="font-semibold text-emerald-700">Sera ya Faragha</span>
          <br />
          <span className="text-xs text-gray-600">I agree to Terms & Privacy Policy</span>
        </span>
      </label>
      
      {/* CTA */}
      <div className="space-y-3">
        <FinButton
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => setStep(2)}
          disabled={phone.length !== 9 || !agreedTerms}
        >
          Endelea • Continue
          <ChevronRight className="size-5" />
        </FinButton>
        
        <button
          onClick={() => setStep(0)}
          className="w-full text-gray-600 hover:text-gray-900 text-sm font-medium py-3 transition-colors"
        >
          ← Rudi
        </button>
      </div>
    </motion.div>
  );
  
  // ═══════════════════════════════════════════════════════════
  // SCREEN 3: PIN SETUP (Security-First)
  // ═══════════════════════════════════════════════════════════
  
  const PinScreen = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-gray-50 px-6 py-8"
    >
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Hatua 2 ya 2</span>
          <span className="text-xs text-gray-600">Step 2 of 2</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '50%' }}
            animate={{ width: '100%' }}
            className="h-full bg-gradient-to-r from-emerald-600 to-teal-600"
          />
        </div>
      </div>
      
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring' }}
        className="mb-6"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center mx-auto">
          <Shield className="size-10 text-white" />
        </div>
      </motion.div>
      
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-gray-900 mb-2">
          Unda PIN
        </h2>
        <p className="text-base text-gray-600 font-medium">
          Create your security PIN
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Tumia PIN hii kwa malipo na upatikanaji
        </p>
      </div>
      
      {/* PIN Inputs */}
      <div className="space-y-4 mb-6">
        <FinInput
          labelSw="Weka PIN"
          labelEn="Enter PIN"
          type={showPin ? 'text' : 'password'}
          value={pin}
          onChange={setPin}
          maxLength={4}
          suffix={
            <button onClick={() => setShowPin(!showPin)}>
              {showPin ? <EyeOff className="size-5 text-gray-600" /> : <Eye className="size-5 text-gray-600" />}
            </button>
          }
          helperText="Nambari 4 (tumia nambari kali)"
        />
        
        <FinInput
          labelSw="Thibitisha PIN"
          labelEn="Confirm PIN"
          type={showPin ? 'text' : 'password'}
          value={pinConfirm}
          onChange={setPinConfirm}
          maxLength={4}
          error={pinConfirm && pin !== pinConfirm ? 'PIN hazilingani' : undefined}
          success={pinConfirm.length === 4 && pin === pinConfirm}
        />
      </div>
      
      {/* Biometric Option */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <Fingerprint className="size-6 text-purple-700 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-purple-900 font-bold text-sm">
              Ongeza Alama ya Kidole
            </p>
            <p className="text-purple-700 text-xs">
              Enable biometric login (optional)
            </p>
          </div>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 active:scale-95 transition-all">
            Setup
          </button>
        </div>
      </div>
      
      {/* CTA */}
      <div className="space-y-3">
        <FinButton
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => onComplete({ phone, pin })}
          disabled={pin.length !== 4 || pin !== pinConfirm}
        >
          Maliza • Complete
          <Check className="size-5" />
        </FinButton>
        
        <button
          onClick={() => setStep(1)}
          className="w-full text-gray-600 hover:text-gray-900 text-sm font-medium py-3 transition-colors"
        >
          ← Rudi
        </button>
      </div>
    </motion.div>
  );
  
  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  
  const screens = [ValueScreen, PhoneScreen, PinScreen];
  const CurrentScreen = screens[step];
  
  return (
    <div className="max-w-md mx-auto">
      <AnimatePresence mode="wait">
        <CurrentScreen />
      </AnimatePresence>
    </div>
  );
}
