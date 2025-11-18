import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Wallet, Smartphone, Shield } from 'lucide-react';
import { GoPayLogo } from './branding/GoPayLogo';
import { useInvisibleBotDetection, InvisibleBotProtection } from './InvisibleBotDetection';
import { SeamlessBotChallenge, HoneypotField } from './SeamlessBotChallenge';

interface AuthPageProps {
  onAuthSuccess: (accessToken: string) => void;
}

export function AuthPage({ onAuthSuccess }: AuthPageProps) {
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
    nida: '',
    password: '',
    honeypot: '' // Honeypot field - bots will fill this
  });

  // Sign In State
  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
    honeypot: ''
  });

  // Demo Mode - Quick Access
  const handleDemoMode = () => {
    // Create a demo token for testing
    const demoToken = 'demo-token-' + Date.now();
    onAuthSuccess(demoToken);
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
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white p-5 rounded-2xl shadow-lg">
              <Wallet className="size-16 text-blue-600" />
            </div>
          </div>
          <h1 className="text-white text-4xl mb-3">goPay</h1>
          <p className="text-blue-100 text-lg">Your everyday, all-in-one payment app</p>
        </div>
      </div>

      {/* Features Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white py-6">
        <div className="px-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <Wallet className="size-8 mx-auto mb-2 opacity-90" />
              <p className="text-sm">Digital Wallet</p>
            </div>
            <div>
              <Shield className="size-8 mx-auto mb-2 opacity-90" />
              <p className="text-sm">Secure & Safe</p>
            </div>
            <div>
              <Smartphone className="size-8 mx-auto mb-2 opacity-90" />
              <p className="text-sm">Easy Payments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Card */}
      <div className="flex-1 bg-gray-50 px-6 py-8">
        <div className="max-w-md mx-auto">
          {/* Demo Mode - Big Prominent Button */}
          <div className="mb-6">
            <Button
              onClick={handleDemoMode}
              className="w-full h-16 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl shadow-2xl text-lg"
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">🚀</span>
                <div className="text-left">
                  <div>Try Demo Mode</div>
                  <div className="text-xs text-purple-100">Skip sign in - Explore the app instantly</div>
                </div>
              </div>
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-50 text-gray-500">Or sign in with your account</span>
            </div>
          </div>

          <Card className="border-none shadow-xl">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl text-center">Welcome</CardTitle>
              <CardDescription className="text-center">Sign in or create a new account to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signin" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Sign In</TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email Address</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="your@email.com"
                        className="h-12"
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
                      <Label htmlFor="signin-password">Password</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="Enter your password"
                        className="h-12"
                        value={signInData.password}
                        onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                        required
                      />
                    </div>
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                      </div>
                    )}
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white" 
                      disabled={isLoading}
                    >
                      {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input
                        id="signup-name"
                        placeholder="John Doe"
                        className="h-12"
                        value={signUpData.name}
                        onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-phone">Phone Number</Label>
                      <Input
                        id="signup-phone"
                        placeholder="+255 XXX XXX XXX"
                        className="h-12"
                        value={signUpData.phone}
                        onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-nida">NIDA Number</Label>
                      <Input
                        id="signup-nida"
                        placeholder="National ID Number"
                        className="h-12"
                        value={signUpData.nida}
                        onChange={(e) => setSignUpData({ ...signUpData, nida: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email Address</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        className="h-12"
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
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        className="h-12"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        required
                      />
                    </div>
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                      </div>
                    )}
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white" 
                      disabled={isLoading}
                    >
                      {isLoading ? 'Creating account...' : 'Create Account'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="mt-8 space-y-4">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Shield className="size-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-900">Bank-level Security</p>
                  <p className="text-xs text-blue-600">Your money and data are protected with encryption</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Smartphone className="size-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm text-green-900">Accepted Nationwide</p>
                  <p className="text-xs text-green-600">Use at 100,000+ merchants across Tanzania</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}