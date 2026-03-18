import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, 
  Shield, 
  Zap, 
  ArrowRight,
  Check,
  Phone,
  Mail,
  QrCode,
  CreditCard,
  Plane,
  Send,
  Building2,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import goPayBrandScreen from 'figma:asset/1d6096b7994cba1b80f18cf6d9166a3a288c7b62.png';

interface OnboardingPremiumProps {
  onComplete: (userData: any) => void;
  onSkipToDemo?: () => void;
}

export function OnboardingPremium({ onComplete, onSkipToDemo }: OnboardingPremiumProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    phone: '',
    email: '',
    otp: '',
    mainUse: ''
  });

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const springTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
  };

  // Screen 1: Brand Authority
  const BrandAuthorityScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f3a] via-[#2d3561] to-[#4a5a9e] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Animated background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-600/40 to-blue-800/40 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-md w-full">
        {/* Logo */}
        <motion.div
          animate={{ 
            scale: [1, 1.02, 1],
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-8"
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/50">
            <Wallet className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
        </motion.div>

        {/* App name */}
        <motion.h1 
          className="text-5xl font-bold text-white mb-4 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          GoPay
        </motion.h1>

        {/* Tagline */}
        <motion.p 
          className="text-lg text-blue-200 mb-10 font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Move money like it was<br />always meant to be
        </motion.p>

        {/* Feature badges */}
        <motion.div 
          className="flex flex-wrap justify-center gap-2 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {[
            'Instant Transfers',
            'Multi-Currency',
            'Zero Fees',
            'Bank-level Security'
          ].map((badge, index) => (
            <motion.div
              key={badge}
              className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm border border-white/20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              {badge}
            </motion.div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <Button
            onClick={() => setCurrentStep(1)}
            className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-6 text-lg rounded-2xl shadow-2xl transition-all duration-300"
          >
            Create an account
          </Button>
          
          <Button
            onClick={() => setCurrentStep(2)}
            variant="outline"
            className="w-full bg-transparent hover:bg-white/10 text-white border-2 border-white/30 font-semibold py-6 text-lg rounded-2xl transition-all duration-300"
          >
            Sign in
          </Button>
        </motion.div>

        {/* Footer links */}
        <motion.div 
          className="mt-8 flex items-center justify-center gap-6 text-blue-200/70 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          {onSkipToDemo && (
            <button 
              onClick={onSkipToDemo}
              className="hover:text-white transition-colors underline"
            >
              Skip
            </button>
          )}
          <span className="text-white/30">•</span>
          <button 
            onClick={() => {
              localStorage.setItem('demo-mode', 'active');
              onSkipToDemo?.();
            }}
            className="hover:text-white transition-colors underline"
          >
            demo mode
          </button>
        </motion.div>
      </div>
    </div>
  );

  // Screen 2: Capability Reveal
  const CapabilityRevealScreen = () => {
    const [activeCard, setActiveCard] = useState(0);

    const capabilities = [
      {
        icon: Send,
        title: "Send money instantly",
        description: "Transfer to anyone in Tanzania with just a phone number",
        gradient: "from-emerald-500 to-teal-600"
      },
      {
        icon: QrCode,
        title: "Pay anywhere with QR",
        description: "Scan and pay at thousands of merchants nationwide",
        gradient: "from-teal-500 to-cyan-600"
      },
      {
        icon: Plane,
        title: "Travel and ride services",
        description: "Book flights, ferries, hotels, and rides in one place",
        gradient: "from-cyan-500 to-blue-600"
      }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex flex-col px-6 py-12 relative overflow-hidden">
        {/* Subtle background */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Everything you need</h2>
            <p className="text-gray-400">All your financial services in one place</p>
          </div>

          {/* Interactive cards */}
          <div className="flex-1 flex flex-col justify-center space-y-6 max-w-md mx-auto w-full">
            {capabilities.map((capability, index) => (
              <motion.div
                key={index}
                className={`relative overflow-hidden rounded-3xl p-6 cursor-pointer transition-all duration-300 ${
                  activeCard === index ? 'scale-105' : 'scale-100'
                }`}
                style={{
                  background: activeCard === index 
                    ? `linear-gradient(135deg, var(--tw-gradient-stops))`
                    : 'rgba(255, 255, 255, 0.05)',
                }}
                onHoverStart={() => setActiveCard(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Glass morphism effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm" />
                
                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${capability.gradient} flex items-center justify-center mb-4`}>
                    <capability.icon className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{capability.title}</h3>
                  <p className="text-gray-300 text-sm">{capability.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8">
            <Button
              onClick={() => setCurrentStep(2)}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-6 text-lg rounded-2xl shadow-lg transition-all duration-300"
            >
              Continue
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Screen 3: Account Creation
  const AccountCreationScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex flex-col px-6 py-12">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Create your secure account</h2>
          <p className="text-gray-400">Get started in seconds with just your phone number</p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Phone input */}
          <div>
            <label className="block text-gray-300 text-sm mb-2 ml-1">Phone number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                type="tel"
                placeholder="+255 712 345 678"
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                className="w-full bg-white/5 border border-white/10 text-white pl-12 pr-4 py-6 rounded-2xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>
          </div>

          {/* Email input */}
          <div>
            <label className="block text-gray-300 text-sm mb-2 ml-1">
              Email <span className="text-gray-500">(optional)</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                type="email"
                placeholder="your@email.com"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 text-white pl-12 pr-4 py-6 rounded-2xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Trust message */}
        <div className="mt-6 flex items-center gap-2 text-gray-400 text-sm">
          <Shield className="w-4 h-4 text-emerald-500" />
          <span>Your account is protected with bank-grade encryption</span>
        </div>

        {/* CTA */}
        <div className="mt-8">
          <Button
            onClick={() => setCurrentStep(3)}
            disabled={!userData.phone}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:text-gray-500 text-white py-6 text-lg rounded-2xl shadow-lg transition-all duration-300"
          >
            Continue
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        {/* Back button */}
        <button
          onClick={() => setCurrentStep(1)}
          className="mt-4 text-gray-400 hover:text-gray-300 transition-colors text-sm"
        >
          Back
        </button>
      </div>
    </div>
  );

  // Screen 4: Personalization Question
  const PersonalizationScreen = () => {
    const uses = [
      { id: 'send', icon: Send, title: 'Send money', description: 'Transfer to friends & family' },
      { id: 'bills', icon: Building2, title: 'Pay bills', description: 'Utilities & services' },
      { id: 'travel', icon: Plane, title: 'Travel bookings', description: 'Flights, hotels & rides' },
      { id: 'business', icon: ShoppingBag, title: 'Business payments', description: 'Merchant & QR payments' }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex flex-col px-6 py-12">
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          {/* Header */}
          <div className="mb-8 text-center">
            <Sparkles className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">What will you mainly use goPay for?</h2>
            <p className="text-gray-400">We'll personalize your experience</p>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {uses.map((use) => (
              <motion.button
                key={use.id}
                onClick={() => {
                  setUserData({ ...userData, mainUse: use.id });
                  setTimeout(() => setCurrentStep(4), 300);
                }}
                className={`w-full p-5 rounded-2xl border-2 transition-all duration-300 text-left ${
                  userData.mainUse === use.id
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    userData.mainUse === use.id
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white/10 text-gray-400'
                  }`}>
                    <use.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">{use.title}</h3>
                    <p className="text-gray-400 text-sm">{use.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Back button */}
          <button
            onClick={() => setCurrentStep(2)}
            className="text-gray-400 hover:text-gray-300 transition-colors text-sm text-center"
          >
            Back
          </button>
        </div>
      </div>
    );
  };

  // Screen 5: Welcome Success
  const WelcomeSuccessScreen = () => {
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        onComplete(userData);
      }, 3000);
      return () => clearTimeout(timer);
    }, []);

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-emerald-950 to-gray-950 flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Animated background */}
        <motion.div 
          className="absolute inset-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Success animation */}
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
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/50">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              >
                <Check className="w-16 h-16 text-white" strokeWidth={3} />
              </motion.div>
            </div>
          </motion.div>

          {/* Welcome text */}
          <motion.h1 
            className="text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Welcome to goPay
          </motion.h1>

          <motion.p 
            className="text-xl text-gray-300 mb-12 font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            You're ready to send, pay, and explore.
          </motion.p>

          {/* Features unlocked */}
          <motion.div
            className="space-y-3 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            {[
              { icon: Wallet, text: 'Digital wallet activated' },
              { icon: Shield, text: 'Bank-grade security enabled' },
              { icon: Zap, text: 'Instant payments ready' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-center gap-2 text-gray-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
              >
                <feature.icon className="w-5 h-5 text-emerald-500" />
                <span>{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Auto-redirect message */}
          <motion.p
            className="text-gray-500 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            Entering your wallet...
          </motion.p>
        </div>
      </div>
    );
  };

  const screens = [
    <BrandAuthorityScreen key="brand" />,
    <CapabilityRevealScreen key="capability" />,
    <AccountCreationScreen key="account" />,
    <PersonalizationScreen key="personalization" />,
    <WelcomeSuccessScreen key="welcome" />
  ];

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={springTransition}
          custom={1}
        >
          {screens[currentStep]}
        </motion.div>
      </AnimatePresence>

      {/* Progress indicator */}
      {currentStep < 4 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-2">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentStep 
                  ? 'w-8 bg-emerald-500' 
                  : 'w-1.5 bg-white/20'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}