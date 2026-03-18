/**
 * WELCOME SCREEN - PREMIUM REDESIGN
 * 
 * INSPIRED BY:
 * - Revolut: Calm gradients, clear hierarchy
 * - Alipay: Trust signals, secure feel
 * - Grab: Service cards, premium glassmorphism
 * - Touch 'n Go: Clean layout, confident CTA
 * 
 * DESIGN PRINCIPLES:
 * 1. Visual hierarchy: Logo → Headline → Cards → CTA
 * 2. Negative space: Breathing room for calmness
 * 3. Trust first: Security indicators without fear
 * 4. African-first: Tanzania flag colors (green, gold, black)
 * 5. Premium feel: Layered depth, soft shadows
 * 
 * COLOR STRATEGY:
 * - Primary: Emerald to deep green gradient (goPay brand)
 * - Accent: Gold (Tanzania flag)
 * - Background: Deep green with ambient lighting
 * - Text: High contrast (white on dark, never light text on green)
 */

import { motion } from 'motion/react';
import { 
  Wallet, 
  QrCode, 
  Plane, 
  ShoppingBag,
  Shield,
  Lock,
  Check,
  ChevronRight
} from 'lucide-react';

interface WelcomeScreenPremiumProps {
  onContinue: () => void;
  onSkipToDemo?: () => void;
}

export function WelcomeScreenPremium({ onContinue, onSkipToDemo }: WelcomeScreenPremiumProps) {
  const serviceCards = [
    {
      id: 'wallet',
      icon: Wallet,
      title: 'Digital Wallet',
      subtitle: 'Manage your money',
      gradient: 'from-emerald-500 to-green-600',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-300'
    },
    {
      id: 'qr',
      icon: QrCode,
      title: 'QR Payments',
      subtitle: 'Scan & pay instantly',
      gradient: 'from-blue-500 to-cyan-600',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-300'
    },
    {
      id: 'travel',
      icon: Plane,
      title: 'Travel Booking',
      subtitle: 'Flights, hotels & more',
      gradient: 'from-purple-500 to-pink-600',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-300'
    },
    {
      id: 'shop',
      icon: ShoppingBag,
      title: 'Shop & Pay',
      subtitle: 'Buy from local stores',
      gradient: 'from-amber-500 to-orange-600',
      iconBg: 'bg-amber-500/20',
      iconColor: 'text-amber-300'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-900 via-green-900 to-teal-950">
      {/* ════════════════════════════════════════════════════════════
          AMBIENT LIGHTING BACKGROUND (Revolut-inspired)
      ════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0">
        {/* Primary ambient orb - emerald */}
        <motion.div
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-emerald-600/30 via-green-500/20 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Secondary orb - gold (Tanzania flag) */}
        <motion.div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-amber-600/20 via-yellow-500/15 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        {/* Center depth orb */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-teal-600/10 via-emerald-500/5 to-transparent rounded-full blur-3xl"
          animate={{
            rotate: [0, 90, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Skip to Demo (Top Right) */}
      {onSkipToDemo && (
        <button
          onClick={onSkipToDemo}
          className="absolute top-8 right-6 z-20 px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white/80 hover:text-white font-semibold text-sm transition-all border border-white/10"
        >
          Skip to Demo
        </button>
      )}

      {/* ════════════════════════════════════════════════════════════
          MAIN CONTENT CONTAINER
      ════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-md w-full">
          
          {/* ════════════════════════════════════════════════════════════
              LOGO TREATMENT (Centered, breathing room)
          ════════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 20,
              delay: 0.2 
            }}
            className="mb-12 text-center"
          >
            {/* Logo Container with subtle glow */}
            <div className="relative inline-block mb-6">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-600 rounded-3xl blur-2xl opacity-40 animate-pulse" />
              
              {/* Logo */}
              <div className="relative bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 rounded-3xl p-6 shadow-2xl border border-white/10">
                <div className="text-6xl font-black text-white">
                  goPay
                </div>
              </div>
              
              {/* Tanzania Flag Badge */}
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-xl border-2 border-emerald-900">
                <span className="text-2xl">🇹🇿</span>
              </div>
            </div>
          </motion.div>

          {/* ════════════════════════════════════════════════════════════
              HEADLINE & COPY (Clear hierarchy, high contrast)
          ════════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl font-black text-white mb-4 leading-tight">
              Welcome to <span className="bg-gradient-to-r from-emerald-300 via-green-200 to-teal-300 bg-clip-text text-transparent">goPay</span> Tanzania
            </h1>
            <p className="text-xl text-gray-300 font-medium max-w-sm mx-auto">
              One app for payments, travel, and daily life.
            </p>
          </motion.div>

          {/* ════════════════════════════════════════════════════════════
              SERVICE CARDS (Glassmorphism, premium feel)
          ════════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 gap-4 mb-10"
          >
            {serviceCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    delay: 0.7 + (index * 0.1),
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -5
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="group cursor-pointer"
                >
                  {/* Glassmorphic card */}
                  <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-5 border border-white/10 hover:border-white/20 transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden">
                    {/* Hover gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    
                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon */}
                      <div className={`${card.iconBg} rounded-2xl w-14 h-14 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-7 h-7 ${card.iconColor}`} />
                      </div>
                      
                      {/* Text */}
                      <h3 className="text-white font-bold text-base mb-1 leading-tight">
                        {card.title}
                      </h3>
                      <p className="text-gray-400 text-xs leading-snug">
                        {card.subtitle}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* ════════════════════════════════════════════════════════════
              PRIMARY CTA (Strong visual anchor)
          ════════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <motion.button
              onClick={onContinue}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full h-16 bg-white hover:bg-gray-50 rounded-2xl font-bold text-lg shadow-2xl overflow-hidden group transition-all"
            >
              {/* Animated gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              
              {/* Text */}
              <span className="relative flex items-center justify-center gap-3 text-emerald-900">
                Get Started
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
          </motion.div>

          {/* ════════════════════════════════════════════════════════════
              TRUST & CREDIBILITY SIGNALS (Subtle, not scary)
          ════════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="mt-8"
          >
            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-emerald-300" />
                </div>
                <span className="text-xs text-gray-400 font-medium">Secure</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Lock className="w-4 h-4 text-blue-300" />
                </div>
                <span className="text-xs text-gray-400 font-medium">Encrypted</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-300" />
                </div>
                <span className="text-xs text-gray-400 font-medium">Regulated</span>
              </div>
            </div>

            {/* BoT compliance */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Regulated by Bank of Tanzania • 256-bit encryption
              </p>
            </div>

            {/* Social proof (subtle) */}
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 border-2 border-emerald-900"
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500">
                <span className="text-emerald-400 font-semibold">50,000+</span> Tanzanians trust goPay
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          BOTTOM ACCENT LINE (Subtle Tanzania flag colors)
      ════════════════════════════════════════════════════════════ */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-amber-400 to-black opacity-50" />
    </div>
  );
}

/**
 * ════════════════════════════════════════════════════════════
 * ALTERNATIVE VERSION: WITH ANIMATED LOGO
 * ════════════════════════════════════════════════════════════
 */

export function WelcomeScreenPremiumAnimated({ onContinue, onSkipToDemo }: WelcomeScreenPremiumProps) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-900 via-green-900 to-teal-950">
      {/* Same ambient background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-emerald-600/30 via-green-500/20 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-amber-600/20 via-yellow-500/15 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {onSkipToDemo && (
        <button
          onClick={onSkipToDemo}
          className="absolute top-8 right-6 z-20 px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white/80 hover:text-white font-semibold text-sm transition-all border border-white/10"
        >
          Skip to Demo
        </button>
      )}

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-md w-full">
          
          {/* ANIMATED LOGO WITH ORBIT EFFECT */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 20,
              delay: 0.2 
            }}
            className="mb-12 text-center"
          >
            <div className="relative inline-block mb-6">
              {/* Rotating orbit ring */}
              <motion.div
                className="absolute inset-0 -m-8 rounded-full border-2 border-emerald-400/20"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Orbiting dots */}
              {[0, 120, 240].map((angle) => (
                <motion.div
                  key={angle}
                  className="absolute w-3 h-3 bg-emerald-400 rounded-full shadow-lg"
                  style={{
                    left: '50%',
                    top: '50%',
                    marginLeft: '-6px',
                    marginTop: '-6px'
                  }}
                  animate={{
                    rotate: [angle, angle + 360],
                    x: [Math.cos((angle * Math.PI) / 180) * 60, Math.cos(((angle + 360) * Math.PI) / 180) * 60],
                    y: [Math.sin((angle * Math.PI) / 180) * 60, Math.sin(((angle + 360) * Math.PI) / 180) * 60]
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              ))}
              
              {/* Pulsing glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-600 rounded-3xl blur-2xl"
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Logo */}
              <div className="relative bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 rounded-3xl p-6 shadow-2xl border border-white/10">
                <div className="text-6xl font-black text-white">
                  goPay
                </div>
              </div>
              
              {/* Tanzania Flag Badge */}
              <motion.div
                className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-xl border-2 border-emerald-900"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <span className="text-2xl">🇹🇿</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Same content as main version */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl font-black text-white mb-4 leading-tight">
              Welcome to <span className="bg-gradient-to-r from-emerald-300 via-green-200 to-teal-300 bg-clip-text text-transparent">goPay</span> Tanzania
            </h1>
            <p className="text-xl text-gray-300 font-medium max-w-sm mx-auto">
              One app for payments, travel, and daily life.
            </p>
          </motion.div>

          {/* Rest of content... (same as main version) */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <motion.button
              onClick={onContinue}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-16 bg-white hover:bg-gray-50 rounded-2xl font-bold text-lg text-emerald-900 shadow-2xl flex items-center justify-center gap-3 group transition-all"
            >
              Get Started
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="mt-8 text-center"
          >
            <div className="flex items-center justify-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-emerald-300" />
                </div>
                <span className="text-xs text-gray-400 font-medium">Secure</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Lock className="w-4 h-4 text-blue-300" />
                </div>
                <span className="text-xs text-gray-400 font-medium">Encrypted</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-300" />
                </div>
                <span className="text-xs text-gray-400 font-medium">Regulated</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              Regulated by Bank of Tanzania • 256-bit encryption
            </p>

            <div className="flex items-center justify-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 border-2 border-emerald-900"
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500">
                <span className="text-emerald-400 font-semibold">50,000+</span> Tanzanians trust goPay
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-amber-400 to-black opacity-50" />
    </div>
  );
}
