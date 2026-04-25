import { useState } from 'react';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Wallet, Smartphone, Shield } from 'lucide-react';
import { GoPayLogo, GoPayAppIcon } from './branding/GoPayLogo';
import { useInvisibleBotDetection, InvisibleBotProtection } from './InvisibleBotDetection';
import { SeamlessBotChallenge, HoneypotField } from './SeamlessBotChallenge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface AuthPageProps {
  onAuthSuccess: (accessToken: string) => void;
  onViewDemo?: () => void;
}

export function AuthPage({ onAuthSuccess, onViewDemo }: AuthPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showChallenge, setShowChallenge] = useState(false);
  const [challengeVerified, setChallengeVerified] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState<(() => void) | null>(null);
  
  // Invisible bot detection
  const { botScore } = useInvisibleBotDetection(true);
  
  // Sign Up State
  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    honeypot: '' // Honeypot field - bots will fill this
  });

  // Sign In State
  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
    honeypot: ''
  });

  const handleDemoMode = () => {
    localStorage.setItem('demo-mode', 'active');
    onAuthSuccess('demo-token-active');
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/auth/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(signUpData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Sign up failed');
      }

      // Sign in after successful signup
      const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
        email: signUpData.email,
        password: signUpData.password,
      });

      if (signInError) throw signInError;
      if (session?.access_token) {
        onAuthSuccess(session.access_token);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up');
      console.error('Sign up error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
        email: signInData.email,
        password: signInData.password,
      });

      if (signInError) throw signInError;
      if (session?.access_token) {
        onAuthSuccess(session.access_token);
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
      console.error('Sign in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChallengeSuccess = () => {
    if (pendingSubmit) {
      pendingSubmit();
      setPendingSubmit(null);
    }
    setShowChallenge(false);
  };

  const handleChallengeCancel = () => {
    setShowChallenge(false);
    setPendingSubmit(null);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header - Splash Screen Design */}
      <div 
        className="text-white px-6 py-12 relative overflow-hidden"
        style={{
          backgroundColor: '#080d08'
        }}
      >
        <div className="text-center relative z-10">
          {/* Logo mark: 64×64px rounded square, subtle green background, wallet icon */}
          <div className="flex justify-center mb-5">
            <div 
              className="w-16 h-16 flex items-center justify-center rounded-2xl"
              style={{ 
                backgroundColor: 'rgba(22, 163, 74, 0.12)',
                border: '1px solid rgba(22, 163, 74, 0.2)'
              }}
            >
              <Wallet className="w-8 h-8 text-[#16a34a]" strokeWidth={2.5} />
            </div>
          </div>

          {/* App name: Syne font, 36px, 700 weight, white */}
          <h1 
            className="text-white mb-2"
            style={{
              fontFamily: 'Syne, -apple-system, sans-serif',
              fontSize: '36px',
              fontWeight: 700,
              letterSpacing: '-1px',
              lineHeight: '1.1'
            }}
          >
            goPay
          </h1>

          {/* Tagline: 13px, rgba(255,255,255,0.5), weight 400 */}
          <p 
            style={{
              fontSize: '13px',
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.5)',
              lineHeight: '1.4'
            }}
          >
            Your complete financial life in one secure app
          </p>
        </div>
      </div>

      {/* Features Banner */}
      <div 
        className="text-white py-8 border-y"
        style={{
          backgroundColor: '#080d08',
          borderColor: 'rgba(255, 255, 255, 0.08)'
        }}
      >
        <div className="px-6">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div 
              className="flex flex-col items-center gap-2 p-3 rounded-2xl border"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                borderColor: 'rgba(255, 255, 255, 0.08)'
              }}
            >
              <div 
                className="w-10 h-10 flex items-center justify-center rounded-xl"
                style={{ backgroundColor: 'rgba(22, 163, 74, 0.15)' }}
              >
                <Wallet className="w-5 h-5 text-[#16a34a]" strokeWidth={2} />
              </div>
              <p 
                className="text-white"
                style={{ fontSize: '11px', fontWeight: 500 }}
              >
                Pochi ya Dijitali
              </p>
            </div>
            <div 
              className="flex flex-col items-center gap-2 p-3 rounded-2xl border"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                borderColor: 'rgba(255, 255, 255, 0.08)'
              }}
            >
              <div 
                className="w-10 h-10 flex items-center justify-center rounded-xl"
                style={{ backgroundColor: 'rgba(22, 163, 74, 0.15)' }}
              >
                <Shield className="w-5 h-5 text-[#16a34a]" strokeWidth={2} />
              </div>
              <p 
                className="text-white"
                style={{ fontSize: '11px', fontWeight: 500 }}
              >
                Salama & Imara
              </p>
            </div>
            <div 
              className="flex flex-col items-center gap-2 p-3 rounded-2xl border"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                borderColor: 'rgba(255, 255, 255, 0.08)'
              }}
            >
              <div 
                className="w-10 h-10 flex items-center justify-center rounded-xl"
                style={{ backgroundColor: 'rgba(22, 163, 74, 0.15)' }}
              >
                <Smartphone className="w-5 h-5 text-[#16a34a]" strokeWidth={2} />
              </div>
              <p 
                className="text-white"
                style={{ fontSize: '11px', fontWeight: 500 }}
              >
                Malipo Rahisi
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Forms Section */}
      <div className="flex-1 px-6 py-8" style={{ backgroundColor: '#080d08' }}>
        <div className="max-w-md mx-auto">
          {/* Demo Mode - Minimal Clean Button */}
          <div className="mb-8">
            <Button
              onClick={handleDemoMode}
              className="w-full h-14 rounded-2xl border"
              style={{
                backgroundColor: 'rgba(22, 163, 74, 0.1)',
                borderColor: 'rgba(22, 163, 74, 0.2)',
                color: '#16a34a'
              }}
            >
              <div className="flex items-center justify-center gap-3">
                <div className="text-center">
                  <div style={{ fontSize: '15px', fontWeight: 600 }}>Jaribu Demo</div>
                  <div style={{ fontSize: '12px', fontWeight: 400, opacity: 0.7 }}>
                    Explore instantly without signing in
                  </div>
                </div>
              </div>
            </Button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4" style={{ backgroundColor: '#080d08', color: 'rgba(255, 255, 255, 0.4)', fontSize: '13px' }}>
                Au ingia na akaunti yako
              </span>
            </div>
          </div>

          <Card className="border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.08)' }}>
            <CardHeader className="space-y-1 pb-6">
              <CardTitle 
                className="text-center text-white"
                style={{ 
                  fontSize: '24px', 
                  fontWeight: 700
                }}
              >
                Karibu goPay
              </CardTitle>
              <CardDescription 
                className="text-center"
                style={{ 
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.5)'
                }}
              >
                Ingia au fungua akaunti mpya kuanza
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList 
                  className="grid w-full grid-cols-2 mb-6"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <TabsTrigger 
                    value="signin"
                    className="data-[state=active]:bg-[#16a34a] data-[state=active]:text-white"
                    style={{
                      fontWeight: 500,
                      color: 'rgba(255, 255, 255, 0.6)'
                    }}
                  >
                    Ingia
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup"
                    className="data-[state=active]:bg-[#16a34a] data-[state=active]:text-white"
                    style={{
                      fontWeight: 500,
                      color: 'rgba(255, 255, 255, 0.6)'
                    }}
                  >
                    Fungua Akaunti
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email" style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255, 255, 255, 0.9)' }}>
                        Barua Pepe
                      </Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="mfano@email.com"
                        className="h-12 border bg-transparent text-white placeholder:text-white/40"
                        style={{ borderColor: 'rgba(255, 255, 255, 0.15)' }}
                        value={signInData.email}
                        onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                        required
                      />
                      <HoneypotField
                        value={signInData.honeypot}
                        onChange={(e) => setSignInData({ ...signInData, honeypot: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password" style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255, 255, 255, 0.9)' }}>
                        Neno la Siri
                      </Label>
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="Weka neno lako la siri"
                        className="h-12 border bg-transparent text-white placeholder:text-white/40"
                        style={{ borderColor: 'rgba(255, 255, 255, 0.15)' }}
                        value={signInData.password}
                        onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                        required
                      />
                    </div>
                    {error && (
                      <div 
                        className="border px-4 py-3 rounded-lg"
                        style={{
                          backgroundColor: 'rgba(220, 38, 38, 0.1)',
                          borderColor: 'rgba(220, 38, 38, 0.3)',
                          color: '#fca5a5',
                          fontSize: '13px'
                        }}
                      >
                        {error}
                      </div>
                    )}
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-white rounded-xl"
                      style={{
                        backgroundColor: '#16a34a',
                        fontWeight: 600
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Inasubiri...' : 'Ingia'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255, 255, 255, 0.9)' }}>
                        Jina Kamili
                      </Label>
                      <Input
                        id="signup-name"
                        placeholder="Jina lako kamili"
                        className="h-12 border bg-transparent text-white placeholder:text-white/40"
                        style={{ borderColor: 'rgba(255, 255, 255, 0.15)' }}
                        value={signUpData.name}
                        onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-phone" style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255, 255, 255, 0.9)' }}>
                        Namba ya Simu
                      </Label>
                      <Input
                        id="signup-phone"
                        placeholder="+255 XXX XXX XXX"
                        className="h-12 border bg-transparent text-white placeholder:text-white/40"
                        style={{ borderColor: 'rgba(255, 255, 255, 0.15)' }}
                        value={signUpData.phone}
                        onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255, 255, 255, 0.9)' }}>
                        Barua Pepe
                      </Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="mfano@email.com"
                        className="h-12 border bg-transparent text-white placeholder:text-white/40"
                        style={{ borderColor: 'rgba(255, 255, 255, 0.15)' }}
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                        required
                      />
                      <HoneypotField
                        value={signUpData.honeypot}
                        onChange={(e) => setSignUpData({ ...signUpData, honeypot: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255, 255, 255, 0.9)' }}>
                        Neno la Siri
                      </Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Tengeneza neno la siri"
                        className="h-12 border bg-transparent text-white placeholder:text-white/40"
                        style={{ borderColor: 'rgba(255, 255, 255, 0.15)' }}
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        required
                      />
                    </div>
                    {error && (
                      <div 
                        className="border px-4 py-3 rounded-lg"
                        style={{
                          backgroundColor: 'rgba(220, 38, 38, 0.1)',
                          borderColor: 'rgba(220, 38, 38, 0.3)',
                          color: '#fca5a5',
                          fontSize: '13px'
                        }}
                      >
                        {error}
                      </div>
                    )}
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-white rounded-xl"
                      style={{
                        backgroundColor: '#16a34a',
                        fontWeight: 600
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Inafungua akaunti...' : 'Fungua Akaunti'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          {onViewDemo && (
            <button
              onClick={onViewDemo}
              className="w-full mt-4 py-3 text-center"
              style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}
            >
              Investor Deck →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}