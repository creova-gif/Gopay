import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, 
  Smartphone, 
  Shield, 
  Zap, 
  Award, 
  Globe, 
  ChevronRight,
  ChevronLeft,
  Check,
  ArrowRight,
  Sparkles,
  Lock,
  TrendingUp,
  Users,
  QrCode,
  CreditCard,
  Plane,
  ShoppingBag,
  Gift,
  Star,
  Phone,
  Mail,
  User,
  MapPin,
  Fingerprint,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import goPayIconLogo from 'figma:asset/d92565bd030dba68ccff66e379d172066e4f2d27.png';
import goPayFullLogo from 'figma:asset/d92565bd030dba68ccff66e379d172066e4f2d27.png';

interface OnboardingFlowProps {
  onComplete: (userData: any) => void;
  onSkipToDemo: () => void;
}

export function OnboardingFlow({ onComplete, onSkipToDemo }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    email: '',
    location: 'Dar es Salaam',
    pin: '',
    confirmPin: '',
    agreeTerms: false,
  });
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  // Welcome Screens
  const welcomeScreens = [
    {
      id: 'welcome',
      gradient: 'from-emerald-500 via-green-600 to-teal-700',
      icon: Sparkles,
      title: 'Welcome to',
      subtitle: 'goPay Tanzania',
      description: 'Your all-in-one super app for payments, travel, shopping, and more',
      emoji: '🇹🇿',
      features: [
        { icon: Wallet, text: 'Digital Wallet', color: 'text-emerald-400' },
        { icon: QrCode, text: 'QR Payments', color: 'text-blue-400' },
        { icon: Plane, text: 'Travel Booking', color: 'text-purple-400' },
        { icon: ShoppingBag, text: 'Shop & Pay', color: 'text-pink-400' },
      ]
    },
    {
      id: 'payments',
      gradient: 'from-blue-500 via-indigo-600 to-purple-700',
      icon: Zap,
      title: 'Pay Everything',
      subtitle: 'One Tap Away',
      description: 'Bills, airtime, government services, and more',
      emoji: '⚡',
      features: [
        { icon: Zap, text: 'Instant bill payments', color: 'text-yellow-400' },
        { icon: Smartphone, text: 'Mobile money top-up', color: 'text-green-400' },
        { icon: Shield, text: 'Government services', color: 'text-blue-400' },
        { icon: CreditCard, text: 'Merchant payments', color: 'text-purple-400' },
      ]
    },
    {
      id: 'rewards',
      gradient: 'from-purple-500 via-pink-600 to-red-700',
      icon: Award,
      title: 'Earn Rewards',
      subtitle: 'Every Transaction',
      description: '15% commission + exclusive cashback on every payment',
      emoji: '🎁',
      features: [
        { icon: Award, text: '4-tier membership', color: 'text-yellow-400' },
        { icon: Gift, text: '15% cashback', color: 'text-pink-400' },
        { icon: Star, text: 'Exclusive rewards', color: 'text-purple-400' },
        { icon: TrendingUp, text: 'Points that grow', color: 'text-green-400' },
      ]
    },
    {
      id: 'security',
      gradient: 'from-gray-700 via-gray-800 to-black',
      icon: Shield,
      title: 'Bank-Grade',
      subtitle: 'Security',
      description: 'BoT compliant with 2FA and biometric protection',
      emoji: '🔒',
      features: [
        { icon: Shield, text: 'BoT certified', color: 'text-green-400' },
        { icon: Lock, text: 'End-to-end encryption', color: 'text-blue-400' },
        { icon: Fingerprint, text: 'Biometric auth', color: 'text-purple-400' },
        { icon: Users, text: 'Trusted by 100K+', color: 'text-emerald-400' },
      ]
    },
  ];

  const handleNext = () => {
    setDirection(1);
    if (currentStep < welcomeScreens.length + 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setDirection(-1);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (userData.pin !== userData.confirmPin) {
      toast.error('PINs do not match!');
      return;
    }
    if (userData.pin.length !== 4) {
      toast.error('PIN must be 4 digits');
      return;
    }
    if (!userData.name || !userData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    onComplete(userData);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
  };

  const isWelcomeScreen = currentStep < welcomeScreens.length;
  const isPersonalInfoScreen = currentStep === welcomeScreens.length;
  const isSecurityScreen = currentStep === welcomeScreens.length + 1;

  return (
    <div className="min-h-screen bg-gray-950 overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large primary orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-400/30 via-green-500/20 to-teal-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-green-600/25 via-emerald-500/15 to-teal-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Center floating orb */}
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-gradient-to-br from-teal-500/15 via-emerald-400/10 to-green-600/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
        
        {/* Accent orbs - smaller, more dynamic */}
        <motion.div 
          className="absolute top-20 left-1/4 w-40 h-40 bg-gradient-to-br from-yellow-400/20 via-amber-500/10 to-orange-400/5 rounded-full blur-2xl"
          animate={{ 
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
        
        <motion.div 
          className="absolute bottom-32 right-1/4 w-48 h-48 bg-gradient-to-tl from-cyan-400/15 via-teal-500/10 to-emerald-400/5 rounded-full blur-2xl"
          animate={{ 
            y: [20, -20, 20],
            x: [10, -10, 10],
            scale: [1.1, 0.9, 1.1]
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5 
          }}
        />
        
        {/* Small floating particles */}
        <motion.div 
          className="absolute top-1/3 right-1/3 w-24 h-24 bg-emerald-300/20 rounded-full blur-xl"
          animate={{ 
            y: [-30, 30, -30],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
        
        <motion.div 
          className="absolute bottom-1/3 left-1/3 w-32 h-32 bg-teal-400/15 rounded-full blur-xl"
          animate={{ 
            y: [30, -30, 30],
            x: [-15, 15, -15],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1 
          }}
        />
        
        {/* Tanzania gold accent (from flag) */}
        <motion.div 
          className="absolute top-1/4 left-1/2 w-20 h-20 bg-gradient-to-br from-yellow-400/25 via-amber-400/15 to-orange-300/10 rounded-full blur-xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
      </div>

      {/* Progress Dots */}
      <div className="absolute top-8 left-0 right-0 z-20">
        <div className="flex items-center justify-center gap-2">
          {[...Array(welcomeScreens.length + 2)].map((_, i) => (
            <motion.div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentStep 
                  ? 'w-8 bg-gradient-to-r from-emerald-400 to-blue-500' 
                  : i < currentStep 
                    ? 'w-2 bg-emerald-500/50' 
                    : 'w-2 bg-white/20'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
            />
          ))}
        </div>
      </div>

      {/* Skip Button */}
      <button
        onClick={onSkipToDemo}
        className="absolute top-8 right-6 z-20 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-sm transition-all shadow-lg"
      >
        Skip to Demo
      </button>

      <AnimatePresence initial={false} custom={direction} mode="wait">
        {/* Welcome Screens */}
        {isWelcomeScreen && (
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0 flex items-center justify-center p-6"
          >
            <div className="max-w-md w-full">
              {/* Option 2: Full goPay Logo Above Card */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-6 flex justify-center"
              >
                <img 
                  src={goPayFullLogo} 
                  alt="goPay Tanzania" 
                  className="w-32 h-32 object-contain"
                />
              </motion.div>

              {/* Main Content */}
              <div className={`relative bg-gradient-to-br ${welcomeScreens[currentStep].gradient} rounded-[3rem] p-8 shadow-2xl`}>
                {/* Glassmorphism Overlay */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-[3rem] border border-white/20"></div>
                
                <div className="relative z-10 text-white text-center">
                  {/* Title */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h1 className="text-2xl font-bold mb-2 text-white/90">
                      {welcomeScreens[currentStep].title}
                    </h1>
                    <h2 className="text-4xl font-black mb-4 text-[rgb(242,246,255)]">
                      {welcomeScreens[currentStep].subtitle}
                    </h2>
                    <p className="text-lg text-white/80 mb-8">
                      {welcomeScreens[currentStep].description}
                    </p>
                  </motion.div>

                  {/* Features Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {welcomeScreens[currentStep].features.map((feature, i) => {
                      const Icon = feature.icon;
                      return (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.4 + i * 0.1 }}
                          className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
                        >
                          <Icon className={`w-8 h-8 ${feature.color} mb-2 mx-auto`} />
                          <p className="text-sm font-medium">{feature.text}</p>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Next Button */}
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    onClick={handleNext}
                    className="w-full bg-white text-gray-900 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-all shadow-xl"
                  >
                    {currentStep < welcomeScreens.length - 1 ? 'Continue' : "Let's Get Started"}
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Back Button */}
              {currentStep > 0 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handlePrevious}
                  className="mt-4 w-full py-3 text-white/70 hover:text-white font-medium flex items-center justify-center gap-2 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {/* Personal Info Screen */}
        {isPersonalInfoScreen && (
          <motion.div
            key="personal-info"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0 flex items-center justify-center p-6"
          >
            <div className="max-w-md w-full">
              <div className="relative bg-gradient-to-br from-emerald-900/40 via-gray-900/60 to-teal-900/40 rounded-[3rem] p-8 shadow-2xl border border-emerald-500/20 backdrop-blur-xl overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/5 rounded-full blur-3xl"></div>

                {/* Header */}
                <div className="text-center mb-8 relative z-10">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', delay: 0.2, duration: 0.8 }}
                    className="relative w-24 h-24 mx-auto mb-4"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 rounded-3xl blur-lg opacity-50 animate-pulse"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-3xl flex items-center justify-center shadow-xl border-2 border-emerald-300/30">
                      <User className="w-12 h-12 text-white" />
                      <div className="absolute -top-1 -right-1 w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-gray-900 shadow-lg">
                        <span className="text-sm">🇹🇿</span>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-emerald-200 via-white to-teal-200 bg-clip-text text-transparent">
                      Create Your Profile
                    </h2>
                    <p className="text-gray-300">Join thousands of Tanzanians using goPay</p>
                  </motion.div>
                </div>

                {/* Form */}
                <div className="space-y-4 relative z-10">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Label htmlFor="name" className="text-emerald-100 mb-2 block text-sm font-semibold">Full Name *</Label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400 z-10" />
                      <Input
                        id="name"
                        placeholder="John Mwangi"
                        value={userData.name}
                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                        className="relative pl-12 h-14 bg-white/5 border-emerald-500/20 text-white placeholder:text-gray-500 rounded-2xl hover:bg-white/10 hover:border-emerald-500/40 focus:bg-white/10 focus:border-emerald-500 transition-all backdrop-blur-sm"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Label htmlFor="phone" className="text-emerald-100 mb-2 block text-sm font-semibold">Phone Number *</Label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400 z-10" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+255 712 345 678"
                        value={userData.phone}
                        onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                        className="relative pl-12 h-14 bg-white/5 border-green-500/20 text-white placeholder:text-gray-500 rounded-2xl hover:bg-white/10 hover:border-green-500/40 focus:bg-white/10 focus:border-green-500 transition-all backdrop-blur-sm"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Label htmlFor="email" className="text-emerald-100 mb-2 block text-sm font-semibold">Email (Optional)</Label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400 z-10" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        className="relative pl-12 h-14 bg-white/5 border-teal-500/20 text-white placeholder:text-gray-500 rounded-2xl hover:bg-white/10 hover:border-teal-500/40 focus:bg-white/10 focus:border-teal-500 transition-all backdrop-blur-sm"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Label htmlFor="location" className="text-emerald-100 mb-2 block text-sm font-semibold">Location</Label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 z-10" />
                      <select
                        id="location"
                        value={userData.location}
                        onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                        className="relative w-full pl-12 pr-4 h-14 bg-white/5 border border-cyan-500/20 text-white rounded-2xl appearance-none cursor-pointer hover:bg-white/10 hover:border-cyan-500/40 focus:bg-white/10 focus:border-cyan-500 transition-all backdrop-blur-sm z-10"
                      >
                        <option value="Dar es Salaam" className="bg-gray-900">🏙️ Dar es Salaam</option>
                        <option value="Arusha" className="bg-gray-900">🏔️ Arusha</option>
                        <option value="Mwanza" className="bg-gray-900">🌊 Mwanza</option>
                        <option value="Dodoma" className="bg-gray-900">🏛️ Dodoma</option>
                        <option value="Mbeya" className="bg-gray-900">⛰️ Mbeya</option>
                        <option value="Zanzibar" className="bg-gray-900">🏝️ Zanzibar</option>
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 rotate-90 pointer-events-none z-10" />
                    </div>
                  </motion.div>

                  {/* Trust Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl backdrop-blur-sm"
                  >
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-emerald-200">Your data is encrypted & secure</span>
                  </motion.div>

                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    className="relative w-full bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 overflow-hidden group mt-6"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <span className="relative">Continue</span>
                    <ArrowRight className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </div>

              <button
                onClick={handlePrevious}
                className="mt-4 w-full py-3 text-white/70 hover:text-white font-medium flex items-center justify-center gap-2 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
            </div>
          </motion.div>
        )}

        {/* Security Screen */}
        {isSecurityScreen && (
          <motion.div
            key="security"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0 flex items-center justify-center p-6"
          >
            <div className="max-w-md w-full">
              <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-[3rem] p-8 shadow-2xl border border-white/10">
                {/* Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center"
                  >
                    <Lock className="w-10 h-10 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white mb-2">Secure Your Account</h2>
                  <p className="text-gray-300">Create a 4-digit PIN to protect your wallet</p>
                </div>

                {/* Security Features */}
                <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="text-sm text-gray-200">
                      <span className="font-semibold text-white">Bank-grade encryption</span> protects your data
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="text-sm text-gray-200">
                      <span className="font-semibold text-white">Biometric authentication</span> available
                    </div>
                  </div>
                </div>

                {/* PIN Input */}
                <div className="space-y-5">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Label htmlFor="pin" className="text-white mb-2 block">Create PIN *</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="pin"
                        type={showPin ? "text" : "password"}
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="••••"
                        value={userData.pin}
                        onChange={(e) => setUserData({ ...userData, pin: e.target.value.replace(/\D/g, '') })}
                        className="pl-12 pr-12 h-14 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-2xl text-center text-2xl tracking-widest"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Label htmlFor="confirm-pin" className="text-white mb-2 block">Confirm PIN *</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="confirm-pin"
                        type={showConfirmPin ? "text" : "password"}
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="••••"
                        value={userData.confirmPin}
                        onChange={(e) => setUserData({ ...userData, confirmPin: e.target.value.replace(/\D/g, '') })}
                        className="pl-12 pr-12 h-14 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-2xl text-center text-2xl tracking-widest"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPin(!showConfirmPin)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showConfirmPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {userData.confirmPin && userData.pin !== userData.confirmPin && (
                      <p className="text-red-400 text-sm mt-2">PINs do not match</p>
                    )}
                    {userData.confirmPin && userData.pin === userData.confirmPin && (
                      <p className="text-green-400 text-sm mt-2 flex items-center gap-1">
                        <Check className="w-4 h-4" /> PINs match!
                      </p>
                    )}
                  </motion.div>

                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    onClick={handleComplete}
                    disabled={userData.pin !== userData.confirmPin || userData.pin.length !== 4}
                    className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Sparkles className="w-5 h-5" />
                    Complete Setup
                  </motion.button>
                </div>

                {/* Trust Badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span>BoT Certified • ISO 27001 Compliant</span>
                  </div>
                </motion.div>
              </div>

              <button
                onClick={handlePrevious}
                className="mt-4 w-full py-3 text-white/70 hover:text-white font-medium flex items-center justify-center gap-2 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}