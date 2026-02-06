import { motion } from 'motion/react';
import { Sparkles, Check, Wallet, Award, Shield, Zap, ArrowRight, Gift } from 'lucide-react';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';

interface OnboardingSuccessProps {
  userName: string;
  onGetStarted: () => void;
}

export function OnboardingSuccess({ userName, onGetStarted }: OnboardingSuccessProps) {
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    // Generate confetti particles
    const particles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
    }));
    setConfetti(particles);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Confetti */}
      {confetti.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-3 h-3 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: '-10%',
            background: `hsl(${Math.random() * 360}, 70%, 60%)`,
          }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{
            y: '120vh',
            opacity: 0,
            rotate: 360 * 3,
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: 'easeIn',
          }}
        />
      ))}

      <div className="max-w-md w-full relative z-10">
        {/* Success Card */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-[3rem] p-8 shadow-2xl border border-white/10"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="relative mx-auto w-28 h-28 mb-6"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <Check className="w-14 h-14 text-emerald-600" strokeWidth={3} />
            </div>
            
            {/* Sparkles around icon */}
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="w-8 h-8 text-yellow-400" />
            </motion.div>
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: -360 }}
              transition={{ delay: 0.7, duration: 1 }}
              className="absolute -bottom-2 -left-2"
            >
              <Sparkles className="w-6 h-6 text-blue-400" />
            </motion.div>
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-black text-white mb-3">
              Welcome, {userName}! 🎉
            </h1>
            <p className="text-xl text-gray-400">
              Your account is ready to go
            </p>
          </motion.div>

          {/* Welcome Bonus */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
            className="bg-gradient-to-r from-yellow-500/20 to-orange-600/20 border-2 border-yellow-500/50 rounded-3xl p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Welcome Bonus</p>
                  <p className="text-2xl font-bold text-white">TZS 100,000</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-yellow-400 font-semibold">+500 Points</p>
              </div>
            </div>
            <p className="text-sm text-gray-300">
              Start exploring goPay with demo credits!
            </p>
          </motion.div>

          {/* Features Unlocked */}
          <div className="space-y-3 mb-8">
            {[
              { icon: Wallet, text: 'Digital wallet activated', color: 'text-emerald-400' },
              { icon: Award, text: 'GOrewards membership', color: 'text-purple-400' },
              { icon: Shield, text: 'Bank-grade security enabled', color: 'text-blue-400' },
              { icon: Zap, text: 'Instant payments ready', color: 'text-yellow-400' },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="flex items-center gap-3 bg-white/5 rounded-2xl p-4 border border-white/10"
                >
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${feature.color}`} />
                  </div>
                  <span className="text-white font-medium">{feature.text}</span>
                  <Check className="w-5 h-5 text-green-400 ml-auto" />
                </motion.div>
              );
            })}
          </div>

          {/* Get Started Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <Button
              onClick={onGetStarted}
              className="w-full h-14 bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-600 hover:opacity-90 text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-lg shadow-xl"
            >
              <Sparkles className="w-5 h-5" />
              Start Using goPay
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-6 text-center"
          >
            <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
              <Shield className="w-4 h-4 text-green-400" />
              <span>100% Secure • BoT Certified • Trusted by 100,000+ Users</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Floating badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="flex items-center justify-center gap-4 mt-6"
        >
          <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
            <Award className="w-4 h-4 text-yellow-400" />
            <span className="text-white text-sm font-medium">Bronze Member</span>
          </div>
          <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-white text-sm font-medium">Demo Mode</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
