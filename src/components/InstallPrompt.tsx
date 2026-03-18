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

        <div className="relative flex flex-col items-center text-center p-8 pt-10 overflow-hidden bg-white">
          {/* Single ambient green glow - Product Bible: ONE gradient hero */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-10 blur-3xl rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, #16a34a 0%, transparent 70%)'
            }}
          />
          
          {/* App Icon - Premium Floating Treatment */}
          <div className="relative mb-6 z-10">
            {/* Outer glow ring */}
            <div 
              className="absolute inset-0 rounded-3xl opacity-20 blur-xl"
              style={{ 
                background: 'linear-gradient(135deg, #16a34a 0%, #1A4D3E 100%)',
                animation: 'pulse 3s ease-in-out infinite'
              }}
            />
            
            {/* Main icon container with floating animation */}
            <div 
              className="relative flex items-center justify-center bg-white rounded-3xl p-4 border"
              style={{ 
                width: '96px',
                height: '96px',
                borderColor: 'rgba(22, 163, 74, 0.2)',
                boxShadow: '0 20px 40px rgba(26, 77, 62, 0.15), 0 0 0 1px rgba(22, 163, 74, 0.1) inset',
                animation: 'float 4s ease-in-out infinite'
              }}
            >
              {/* Inner subtle glow ring */}
              <div 
                className="absolute inset-2 rounded-2xl opacity-30 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, rgba(22, 163, 74, 0.15), transparent 60%)'
                }}
              />
              
              <img 
                src={goPayIconLogo} 
                alt="goPay Tanzania" 
                className="w-full h-full object-contain relative z-10"
                style={{
                  filter: 'drop-shadow(0 2px 8px rgba(26, 77, 62, 0.1))'
                }}
              />
            </div>
            
            <style>{`
              @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-8px); }
              }
            `}</style>
          </div>

          {/* Title - Swahili first, GoPay Green */}
          <h2 
            className="mb-2 relative z-10"
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#1A4D3E',
              lineHeight: '1.2'
            }}
          >
            Sakinisha GoPay
          </h2>
          <p 
            className="mb-2 leading-relaxed relative z-10"
            style={{
              fontSize: '15px',
              fontWeight: 500,
              color: 'rgba(0, 0, 0, 0.7)'
            }}
          >
            Ongeza GoPay kwenye skrini yako kwa<br />
            urahisi wa matumizi
          </p>
          <p 
            className="mb-6 relative z-10"
            style={{
              fontSize: '12px',
              color: 'rgba(0, 0, 0, 0.4)'
            }}
          >
            Add GoPay to your home screen for quick access
          </p>

          {isIOS ? (
            <div 
              className="rounded-2xl p-6 mb-6 w-full text-left border relative z-10"
              style={{
                backgroundColor: 'rgba(22, 163, 74, 0.05)',
                borderColor: 'rgba(22, 163, 74, 0.15)'
              }}
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(22, 163, 74, 0.15)' }}
                >
                  <Apple className="w-6 h-6 text-[#16a34a]" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p 
                    className="mb-3"
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#0a0a0a'
                    }}
                  >
                    Jinsi ya Kusakinisha
                  </p>
                  <ol className="space-y-2.5">
                    <li className="flex items-start gap-3">
                      <span 
                        className="w-6 h-6 text-white rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: '#16a34a',
                          fontSize: '12px',
                          fontWeight: 600
                        }}
                      >
                        1
                      </span>
                      <span style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.7)' }}>
                        Bonyeza kitufe cha <strong>Shiriki</strong> chini
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span 
                        className="w-6 h-6 text-white rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: '#16a34a',
                          fontSize: '12px',
                          fontWeight: 600
                        }}
                      >
                        2
                      </span>
                      <span style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.7)' }}>
                        Bonyeza <strong>"Add to Home Screen"</strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span 
                        className="w-6 h-6 text-white rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: '#16a34a',
                          fontSize: '12px',
                          fontWeight: 600
                        }}
                      >
                        3
                      </span>
                      <span style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.7)' }}>
                        Bonyeza <strong>"Add"</strong> juu kulia
                      </span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={handleInstall}
              className="relative w-full text-white h-14 rounded-2xl mb-6 shadow-lg overflow-hidden group z-10"
              style={{
                background: 'linear-gradient(135deg, #1A4D3E 0%, #16a34a 100%)'
              }}
            >
              <div className="relative flex items-center justify-center gap-3">
                <Download className="w-5 h-5" strokeWidth={2.5} />
                <div className="text-center">
                  <div style={{ fontSize: '15px', fontWeight: 600 }}>Sakinisha Sasa</div>
                  <div style={{ fontSize: '12px', fontWeight: 400, opacity: 0.9 }}>
                    Install Now
                  </div>
                </div>
              </div>
            </button>
          )}

          {/* Feature Pills - All GoPay Green (no rainbow) */}
          <div className="grid grid-cols-3 gap-3 w-full mb-6 relative z-10">
            <div className="flex flex-col items-center">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-2 border"
                style={{
                  backgroundColor: 'rgba(22, 163, 74, 0.08)',
                  borderColor: 'rgba(22, 163, 74, 0.15)'
                }}
              >
                <Smartphone className="w-6 h-6 text-[#16a34a]" strokeWidth={2} />
              </div>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#0a0a0a' }}>Offline</p>
              <p style={{ fontSize: '10px', color: 'rgba(0, 0, 0, 0.4)' }}>Bila mtandao</p>
            </div>
            <div className="flex flex-col items-center">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-2 border"
                style={{
                  backgroundColor: 'rgba(22, 163, 74, 0.08)',
                  borderColor: 'rgba(22, 163, 74, 0.15)'
                }}
              >
                <svg className="w-6 h-6 text-[#16a34a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#0a0a0a' }}>Fast</p>
              <p style={{ fontSize: '10px', color: 'rgba(0, 0, 0, 0.4)' }}>Haraka</p>
            </div>
            <div className="flex flex-col items-center">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-2 border"
                style={{
                  backgroundColor: 'rgba(22, 163, 74, 0.08)',
                  borderColor: 'rgba(22, 163, 74, 0.15)'
                }}
              >
                <svg className="w-6 h-6 text-[#16a34a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#0a0a0a' }}>Secure</p>
              <p style={{ fontSize: '10px', color: 'rgba(0, 0, 0, 0.4)' }}>Salama</p>
            </div>
          </div>

          {/* Trust indicator - Clean green */}
          <div 
            className="rounded-xl px-4 py-3 mb-4 border relative z-10"
            style={{
              backgroundColor: 'rgba(22, 163, 74, 0.05)',
              borderColor: 'rgba(22, 163, 74, 0.15)'
            }}
          >
            <p 
              className="flex items-center justify-center gap-2"
              style={{
                fontSize: '12px',
                fontWeight: 500,
                color: 'rgba(0, 0, 0, 0.7)'
              }}
            >
              <svg className="w-4 h-4 text-[#16a34a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Iliyoidhinishwa na Bank of Tanzania
            </p>
          </div>

          <button
            onClick={handleDismiss}
            className="relative py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors z-10"
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: 'rgba(0, 0, 0, 0.5)'
            }}
          >
            <div>Labda Baadaye</div>
            <div style={{ fontSize: '12px', opacity: 0.75 }}>Maybe later</div>
          </button>
        </div>
      </div>
    </div>
  );
}