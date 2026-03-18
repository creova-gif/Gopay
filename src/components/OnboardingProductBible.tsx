import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, 
  Shield, 
  ArrowRight,
  Check,
  Phone,
  Mail,
  QrCode,
  Send,
  Plane
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface OnboardingProductBibleProps {
  onComplete: (userData: any) => void;
  onSkipToDemo?: () => void;
}

/**
 * GoPay Product Bible v1.0 Compliant Onboarding
 * 
 * Philosophy:
 * - Trust is the product
 * - Speed is a feature  
 * - Intelligence is invisible
 * - Boring, calm, reliable
 * 
 * Design Rules:
 * - Swahili-first language
 * - Max ONE gradient per screen (balance card only)
 * - 8pt grid system (all spacing multiples of 8)
 * - GoPay Green (#1A4D3E) primary color
 * - Institutional, not flashy
 */
export function OnboardingProductBible({ onComplete, onSkipToDemo }: OnboardingProductBibleProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    phone: '',
    email: '',
    otp: '',
  });

  const springTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
  };

  // Screen 1: Brand Authority
  // Purpose: Establish trust and institutional-grade first impression
  const BrandAuthorityScreen = () => (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-md w-full">
        {/* Logo with subtle, slow, reassuring pulse (2% scale, 6s loop) */}
        <motion.div
          animate={{ 
            scale: [1, 1.02, 1],
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-12"
        >
          <div className="w-20 h-20 mx-auto bg-[#1A4D3E] rounded-2xl flex items-center justify-center shadow-sm">
            <Wallet className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
        </motion.div>

        {/* Copy: Karibu GoPay. (Welcome to GoPay.) */}
        <motion.h1 
          className="text-[40px] leading-[48px] font-semibold text-[#111827] mb-8"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          Karibu GoPay.
        </motion.h1>

        {/* CTA: Anza (Get Started) */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <Button
            onClick={() => setCurrentStep(1)}
            className="w-full bg-[#1A4D3E] hover:bg-[#143A2E] text-white font-medium py-3 px-6 rounded-2xl min-h-[48px] transition-all duration-150"
          >
            Anza
          </Button>
        </motion.div>

        {/* Demo mode link */}
        {onSkipToDemo && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <button 
              onClick={onSkipToDemo}
              className="text-[14px] text-[#6B7280] hover:text-[#374151] transition-colors"
            >
              demo mode
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );

  // Screen 2: Capability Reveal (Contextual)
  // Purpose: Show, don't tell. Let the user feel the core value.
  const CapabilityRevealScreen = () => {
    const [activeCard, setActiveCard] = useState(0);

    const capabilities = [
      {
        icon: Send,
        title: "Tuma Pesa",
        subtitle: "Send Money",
        color: "#1A4D3E"
      },
      {
        icon: QrCode,
        title: "Lipa Kwa QR",
        subtitle: "Pay with QR",
        color: "#1B6B5C"
      },
      {
        icon: Plane,
        title: "Panga Safari",
        subtitle: "Plan Travel",
        color: "#228B6F"
      }
    ];

    useEffect(() => {
      const interval = setInterval(() => {
        setActiveCard((prev) => (prev + 1) % capabilities.length);
      }, 3000);
      return () => clearInterval(interval);
    }, []);

    const current = capabilities[activeCard];

    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-md w-full">
          {/* Single, large, glass-morphic card that elegantly flips/cycles */}
          <motion.div
            key={activeCard}
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: -90 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div 
              className="w-64 h-64 mx-auto rounded-3xl flex flex-col items-center justify-center backdrop-blur-sm border border-[#E5E7EB] shadow-sm"
              style={{ 
                background: `linear-gradient(135deg, ${current.color}15, ${current.color}05)` 
              }}
            >
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: current.color }}
              >
                <current.icon className="w-10 h-10 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-[24px] leading-[32px] font-semibold text-[#111827] mb-1">
                {current.title}
              </h3>
              <p className="text-[14px] leading-[20px] text-[#6B7280]">
                {current.subtitle}
              </p>
            </div>
          </motion.div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-12">
            {capabilities.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === activeCard 
                    ? 'w-8 bg-[#1A4D3E]' 
                    : 'w-1.5 bg-[#E5E7EB]'
                }`}
              />
            ))}
          </div>

          {/* CTA: Endelea (Continue) */}
          <Button
            onClick={() => setCurrentStep(2)}
            className="w-full bg-[#1A4D3E] hover:bg-[#143A2E] text-white font-medium py-3 px-6 rounded-2xl min-h-[48px] transition-all duration-150"
          >
            Endelea
          </Button>
        </div>
      </div>
    );
  };

  // Screen 3: Secure Account Creation
  // Purpose: Frictionless identity capture
  const AccountCreationScreen = () => (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col px-6 py-12">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        {/* Title */}
        <h2 className="text-[24px] leading-[32px] font-semibold text-[#111827] mb-8">
          Fungua akaunti
        </h2>

        {/* Form */}
        <div className="space-y-6">
          {/* Namba yako ya simu (Your phone number) */}
          <div>
            <label className="block text-[14px] leading-[20px] font-medium text-[#374151] mb-2">
              Namba yako ya simu
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
              <Input
                type="tel"
                placeholder="+255 712 345 678"
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                className="w-full bg-white border border-[#E5E7EB] text-[#111827] pl-12 pr-4 py-3 rounded-2xl focus:border-[#1A4D3E] focus:ring-2 focus:ring-[#1A4D3E]/20 transition-all min-h-[48px] text-[16px]"
              />
            </div>
          </div>

          {/* Barua pepe (si lazima) (Email - optional) */}
          <div>
            <label className="block text-[14px] leading-[20px] font-medium text-[#374151] mb-2">
              Barua pepe <span className="text-[#9CA3AF]">(si lazima)</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
              <Input
                type="email"
                placeholder="email@mfano.com"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                className="w-full bg-white border border-[#E5E7EB] text-[#111827] pl-12 pr-4 py-3 rounded-2xl focus:border-[#1A4D3E] focus:ring-2 focus:ring-[#1A4D3E]/20 transition-all min-h-[48px] text-[16px]"
              />
            </div>
          </div>
        </div>

        {/* Reassurance: Taarifa zako zimepigwa misimbo kwa usalama wa kiwango cha benki. */}
        <div className="mt-6 flex items-start gap-2">
          <Shield className="w-4 h-4 text-[#1A4D3E] mt-0.5 flex-shrink-0" />
          <p className="text-[14px] leading-[20px] text-[#6B7280]">
            Taarifa zako zimepigwa misimbo kwa usalama wa kiwango cha benki.
          </p>
        </div>

        {/* CTA: Endelea (Continue) */}
        <div className="mt-8">
          <Button
            onClick={() => setCurrentStep(3)}
            disabled={!userData.phone}
            className="w-full bg-[#1A4D3E] hover:bg-[#143A2E] disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF] text-white font-medium py-3 px-6 rounded-2xl min-h-[48px] transition-all duration-150"
          >
            Endelea
          </Button>
        </div>

        {/* Back */}
        <button
          onClick={() => setCurrentStep(1)}
          className="mt-4 text-[14px] text-[#6B7280] hover:text-[#374151] transition-colors"
        >
          Rudi
        </button>
      </div>
    </div>
  );

  // Screen 4: Silent Verification (OTP)
  // Purpose: Verify identity with minimal friction
  const OTPVerificationScreen = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isVerifying, setIsVerifying] = useState(false);

    const handleOtpChange = (index: number, value: string) => {
      if (value.length > 1) return;
      
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }

      // Auto-submit when complete
      if (newOtp.every(digit => digit) && index === 5) {
        setTimeout(() => {
          setIsVerifying(true);
          setTimeout(() => {
            setCurrentStep(4);
          }, 1500);
        }, 300);
      }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
      if (e.key === 'Backspace' && !otp[index] && index > 0) {
        const prevInput = document.getElementById(`otp-${index - 1}`);
        prevInput?.focus();
      }
    };

    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col px-6 py-12">
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          {/* Copy (Headline): Weka msimbo wa uthibitisho. */}
          <h2 className="text-[24px] leading-[32px] font-semibold text-[#111827] mb-2">
            Weka msimbo wa uthibitisho
          </h2>
          <p className="text-[16px] leading-[24px] text-[#6B7280] mb-8">
            Tumekutumia msimbo kwa {userData.phone}
          </p>

          {/* 6-digit OTP input */}
          <div className="flex gap-3 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-[24px] font-semibold bg-white border-2 border-[#E5E7EB] rounded-xl focus:border-[#1A4D3E] focus:ring-2 focus:ring-[#1A4D3E]/20 transition-all"
                disabled={isVerifying}
              />
            ))}
          </div>

          {/* Resend timer */}
          <div className="text-center mb-8">
            <button className="text-[14px] text-[#1A4D3E] hover:text-[#143A2E] font-medium transition-colors">
              Tuma tena
            </button>
          </div>

          {/* Security Signal: Imesimbwa (Encrypted) */}
          <div className="flex items-center justify-center gap-2 text-[#9CA3AF]">
            <Shield className="w-4 h-4" />
            <span className="text-[14px]">Imesimbwa</span>
          </div>

          {/* Back */}
          <button
            onClick={() => setCurrentStep(2)}
            className="mt-8 text-[14px] text-[#6B7280] hover:text-[#374151] transition-colors text-center"
            disabled={isVerifying}
          >
            Rudi
          </button>
        </div>
      </div>
    );
  };

  // Screen 5: The Welcome Moment
  // Purpose: Emotional payoff. The user is now "in."
  const WelcomeMomentScreen = () => {
    useEffect(() => {
      const timer = setTimeout(() => {
        onComplete(userData);
      }, 3000);
      return () => clearTimeout(timer);
    }, []);

    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Soft, celebratory gradient glow (not flashy) */}
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#1A4D3E]/10 rounded-full blur-3xl" />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Checkmark animates and seamlessly morphs into GoPay wallet icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2
            }}
            className="mb-8"
          >
            <div className="w-24 h-24 mx-auto bg-[#1A4D3E] rounded-3xl flex items-center justify-center shadow-lg">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Wallet className="w-12 h-12 text-white" strokeWidth={2} />
              </motion.div>
            </div>
          </motion.div>

          {/* Copy (Headline): Karibu nyumbani. (Welcome home.) */}
          <motion.h1 
            className="text-[32px] leading-[40px] font-semibold text-[#111827] mb-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            Karibu nyumbani.
          </motion.h1>

          {/* Subtext: Akaunti yako iko tayari. (Your account is ready.) */}
          <motion.p 
            className="text-[16px] leading-[24px] text-[#6B7280] mb-12"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.4 }}
          >
            Akaunti yako iko tayari.
          </motion.p>

          {/* Auto-redirecting message */}
          <motion.p
            className="text-[14px] text-[#9CA3AF]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            Ingia kwenye pochi...
          </motion.p>
        </div>
      </div>
    );
  };

  const screens = [
    <BrandAuthorityScreen key="brand" />,
    <CapabilityRevealScreen key="capability" />,
    <AccountCreationScreen key="account" />,
    <OTPVerificationScreen key="otp" />,
    <WelcomeMomentScreen key="welcome" />
  ];

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={springTransition}
        >
          {screens[currentStep]}
        </motion.div>
      </AnimatePresence>

      {/* Progress indicator - minimal, calm */}
      {currentStep < 4 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-2">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentStep 
                  ? 'w-8 bg-[#1A4D3E]' 
                  : 'w-1 bg-[#E5E7EB]'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
