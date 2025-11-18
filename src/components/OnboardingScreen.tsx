import { useState } from 'react';
import { Button } from './ui/button';
import { ChevronRight, Wallet, Zap, Shield, Gift } from 'lucide-react';
import { motion } from 'motion/react';
import { GoPayLogoAnimated } from './branding/GoPayLogo';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: Wallet,
      color: 'from-green-500 to-emerald-600',
      title: 'Welcome to goPay',
      subtitle: 'Tanzania\'s Most Complete Super App',
      description: 'Pay, shop, travel, and manage your money all in one place'
    },
    {
      icon: Zap,
      color: 'from-blue-500 to-cyan-600',
      title: 'Lightning Fast Payments',
      subtitle: 'Pay Anyone, Anywhere',
      description: 'Send money, pay bills, shop online, and book travel instantly'
    },
    {
      icon: Shield,
      color: 'from-purple-500 to-pink-600',
      title: 'Bank-Level Security',
      subtitle: 'Your Money is Safe',
      description: 'PIN protection, BOT regulated, and 256-bit encryption'
    },
    {
      icon: Gift,
      color: 'from-orange-500 to-red-600',
      title: 'Earn While You Spend',
      subtitle: 'Rewards & Cashback',
      description: 'Get up to 10% cashback on every transaction'
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const currentSlideData = slides[currentSlide];
  const Icon = currentSlideData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
      />

      <div className="max-w-md w-full relative z-10">
        {/* Skip Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={onComplete}
            className="text-white/70 hover:text-white text-sm font-medium transition-all"
          >
            Skip
          </button>
        </div>

        {/* Main Content */}
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className={`w-32 h-32 mx-auto mb-8 bg-gradient-to-br ${currentSlideData.color} rounded-3xl flex items-center justify-center shadow-2xl`}
          >
            <Icon className="size-16 text-white" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-white mb-3"
          >
            {currentSlideData.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-green-100 mb-4"
          >
            {currentSlideData.subtitle}
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white/80 text-base leading-relaxed"
          >
            {currentSlideData.description}
          </motion.p>
        </motion.div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/40'
              }`}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        {/* Next Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={handleNext}
            className="w-full h-14 bg-white text-green-700 hover:bg-gray-100 rounded-full text-lg font-bold shadow-xl flex items-center justify-center gap-2 group"
          >
            {currentSlide < slides.length - 1 ? 'Next' : 'Get Started'}
            <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        {/* Features Preview (Last Slide) */}
        {currentSlide === slides.length - 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-6 grid grid-cols-3 gap-3"
          >
            {[
              { icon: '🛒', label: 'Shop' },
              { icon: '✈️', label: 'Travel' },
              { icon: '⚡', label: 'Bills' },
            ].map((feature) => (
              <div
                key={feature.label}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center"
              >
                <div className="text-3xl mb-2">{feature.icon}</div>
                <p className="text-xs text-white/80">{feature.label}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}