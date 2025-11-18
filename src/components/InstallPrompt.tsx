import { useState, useEffect } from 'react';
import { X, Download, Smartphone, Apple } from 'lucide-react';
import { Button } from './ui/button';

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in slide-in-from-bottom sm:slide-in-from-bottom-0">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="size-5 text-gray-500" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-3xl flex items-center justify-center mb-4 shadow-lg">
            <span className="text-white text-3xl font-bold">gP</span>
          </div>

          <h2 className="text-2xl font-bold mb-2">Install goPay</h2>
          <p className="text-gray-600 mb-6">
            Add goPay to your home screen for quick access and a better experience!
          </p>

          {isIOS ? (
            <div className="bg-blue-50 rounded-2xl p-4 mb-6 w-full text-left">
              <div className="flex items-start gap-3 mb-3">
                <Apple className="size-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-blue-900 mb-2">iOS Installation</p>
                  <ol className="text-sm text-blue-800 space-y-2">
                    <li>1. Tap the <strong>Share</strong> button at the bottom</li>
                    <li>2. Scroll and tap <strong>"Add to Home Screen"</strong></li>
                    <li>3. Tap <strong>"Add"</strong> in the top right</li>
                  </ol>
                </div>
              </div>
              <div className="bg-white rounded-xl p-3 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z"/>
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Tap the Share button</span>
              </div>
            </div>
          ) : (
            <Button
              onClick={handleInstall}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white h-14 rounded-full text-lg font-bold mb-4 hover:from-green-600 hover:to-green-700 shadow-lg"
            >
              <Download className="size-5 mr-2" />
              Install Now
            </Button>
          )}

          <div className="grid grid-cols-3 gap-4 w-full text-center">
            <div>
              <div className="bg-green-100 rounded-2xl p-3 mb-2 inline-flex">
                <Smartphone className="size-6 text-green-600" />
              </div>
              <p className="text-xs text-gray-600">Works Offline</p>
            </div>
            <div>
              <div className="bg-blue-100 rounded-2xl p-3 mb-2 inline-flex">
                <Download className="size-6 text-blue-600" />
              </div>
              <p className="text-xs text-gray-600">Fast & Light</p>
            </div>
            <div>
              <div className="bg-purple-100 rounded-2xl p-3 mb-2 inline-flex">
                <svg className="size-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-xs text-gray-600">Secure</p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="mt-4 text-gray-500 text-sm hover:text-gray-700 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
