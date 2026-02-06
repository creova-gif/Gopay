import { useState, useEffect } from 'react';
import { X, Download, Smartphone, Apple } from 'lucide-react';
import { Button } from './ui/button';
import goPayIconLogo from 'figma:asset/d92565bd030dba68ccff66e379d172066e4f2d27.png';

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if already installed
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Don't show if already installed
    if (standalone) {
      return;
    }

    // Show after 5 seconds on first visit
    const hasSeenPrompt = localStorage.getItem('gopay-install-prompt-seen');
    if (!hasSeenPrompt) {
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    }

    // Listen for install prompt (Android/Desktop)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after delay if not seen before
      if (!hasSeenPrompt) {
        setTimeout(() => {
          setShowPrompt(true);
        }, 5000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('✅ User accepted the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
      localStorage.setItem('gopay-install-prompt-seen', 'true');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('gopay-install-prompt-seen', 'true');
  };

  if (isStandalone || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full shadow-2xl animate-in slide-in-from-bottom">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="size-5 text-gray-500" />
        </button>

        <div className="relative flex flex-col items-center text-center p-8 pt-10 overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl"></div>
          
          {/* App Icon with glow */}
          <div className="relative mb-6 z-10">
            <div className="absolute inset-0 bg-emerald-500/30 rounded-3xl blur-xl animate-pulse"></div>
            <div className="relative size-24 flex items-center justify-center bg-white rounded-3xl shadow-2xl p-3 border-2 border-emerald-100">
              <img 
                src={goPayIconLogo} 
                alt="goPay Tanzania" 
                className="w-full h-full object-contain"
              />
              {/* Tanzania flag badge */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-emerald-100">
                <span className="text-lg">🇹🇿</span>
              </div>
            </div>
          </div>

          {/* Title - Swahili first */}
          <h2 className="text-3xl font-black bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-2 relative z-10">
            Sakinisha goPay
          </h2>
          <p className="text-base text-gray-600 mb-6 leading-relaxed relative z-10 font-medium">
            Ongeza goPay kwenye skrini yako kwa<br />
            urahisi wa matumizi!
          </p>
          <p className="text-xs text-gray-500 mb-6 relative z-10">
            Add goPay to your home screen for quick access
          </p>

          {isIOS ? (
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-6 mb-6 w-full text-left border-2 border-blue-100 shadow-lg relative z-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <Apple className="size-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-black text-blue-900 mb-3 text-lg">Jinsi ya Kusakinisha</p>
                  <ol className="text-sm text-blue-800 space-y-2.5 font-medium">
                    <li className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                      <span>Bonyeza kitufe cha <strong>Shiriki</strong> chini</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                      <span>Bonyeza <strong>"Add to Home Screen"</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                      <span>Bonyeza <strong>"Add"</strong> juu kulia</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={handleInstall}
              className="relative w-full bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 text-white h-16 rounded-2xl text-lg font-black mb-6 shadow-xl shadow-emerald-500/30 overflow-hidden group z-10"
            >
              {/* Animated shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              
              <div className="relative flex items-center justify-center gap-3">
                <Download className="size-6" />
                <div className="text-left">
                  <div className="text-sm font-semibold">Sakinisha Sasa</div>
                  <div className="text-xs opacity-90">Install Now</div>
                </div>
              </div>
            </button>
          )}

          {/* Feature Pills - Enhanced */}
          <div className="grid grid-cols-3 gap-3 w-full mb-6 relative z-10">
            <div className="flex flex-col items-center group">
              <div className="bg-gradient-to-br from-emerald-50 to-green-100 size-16 rounded-2xl flex items-center justify-center mb-2 shadow-md border-2 border-emerald-200 group-hover:scale-110 transition-transform">
                <Smartphone className="size-7 text-emerald-600" />
              </div>
              <p className="text-xs text-gray-800 font-semibold">Offline</p>
              <p className="text-[10px] text-gray-500">Bila mtandao</p>
            </div>
            <div className="flex flex-col items-center group">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-100 size-16 rounded-2xl flex items-center justify-center mb-2 shadow-md border-2 border-blue-200 group-hover:scale-110 transition-transform">
                <svg className="size-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-xs text-gray-800 font-semibold">Fast</p>
              <p className="text-[10px] text-gray-500">Haraka</p>
            </div>
            <div className="flex flex-col items-center group">
              <div className="bg-gradient-to-br from-purple-50 to-pink-100 size-16 rounded-2xl flex items-center justify-center mb-2 shadow-md border-2 border-purple-200 group-hover:scale-110 transition-transform">
                <svg className="size-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-xs text-gray-800 font-semibold">Secure</p>
              <p className="text-[10px] text-gray-500">Salama</p>
            </div>
          </div>

          {/* Trust indicator */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl px-4 py-3 mb-4 border border-emerald-200 relative z-10">
            <p className="text-xs text-emerald-800 font-semibold flex items-center justify-center gap-2">
              <svg className="size-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Iliyoidhinishwa na Bank of Tanzania
            </p>
          </div>

          <button
            onClick={handleDismiss}
            className="relative text-gray-600 text-sm font-semibold hover:text-gray-800 transition-colors py-2 px-4 rounded-lg hover:bg-gray-100 z-10"
          >
            <div>Labda Baadaye</div>
            <div className="text-xs opacity-75">Maybe later</div>
          </button>
        </div>
      </div>
    </div>
  );
}