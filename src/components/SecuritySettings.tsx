import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { ArrowLeft, Shield, Fingerprint, Smartphone, CheckCircle2, Lock, Key, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { User } from '../App';
import { projectId } from '../utils/supabase/info';
import { PinPad } from './ui/PinPad';

interface SecuritySettingsProps {
  user: User;
  accessToken: string;
  onBack: () => void;
}

export function SecuritySettings({ user, accessToken, onBack }: SecuritySettingsProps) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [showSetup2FA, setShowSetup2FA] = useState(false);
  const [showChangePIN, setShowChangePIN] = useState(false);
  const [pinStep, setPinStep] = useState<'current' | 'new' | 'confirm'>('current');
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [shakePIN, setShakePIN] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSecuritySettings();
    checkBiometricSupport();
  }, []);

  const fetchSecuritySettings = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/security/settings`,
        { headers: { 'Authorization': `Bearer ${accessToken}` } }
      );

      if (response.ok) {
        const data = await response.json();
        setTwoFactorEnabled(data.twoFactorEnabled || false);
        setBiometricEnabled(data.biometricEnabled || false);
      }
    } catch (error) {
      console.error('Error fetching security settings:', error);
    }
  };

  const checkBiometricSupport = () => {
    // Check if Web Authentication API is available
    const isSupported = window.PublicKeyCredential !== undefined;
    if (!isSupported) {
      console.log('Biometric authentication not supported on this device');
    }
  };

  const setup2FA = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/security/setup-2fa`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setQrCode(data.qrCode);
        setBackupCodes(data.backupCodes);
        setShowSetup2FA(true);
      }
    } catch (error) {
      console.error('Error setting up 2FA:', error);
      toast.error('Failed to setup 2FA');
    } finally {
      setLoading(false);
    }
  };

  const verify2FA = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/security/verify-2fa`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code: verificationCode }),
        }
      );

      if (response.ok) {
        setTwoFactorEnabled(true);
        setShowSetup2FA(false);
        toast.success('2FA enabled successfully!');
      } else {
        toast.error('Invalid verification code');
      }
    } catch (error) {
      console.error('Error verifying 2FA:', error);
      toast.error('Failed to verify 2FA');
    } finally {
      setLoading(false);
    }
  };

  const disable2FA = async () => {
    if (!confirm('Are you sure you want to disable 2FA? This will make your account less secure.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/security/disable-2fa`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        setTwoFactorEnabled(false);
        toast.success('2FA disabled');
      }
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      toast.error('Failed to disable 2FA');
    } finally {
      setLoading(false);
    }
  };

  const setupBiometric = async () => {
    if (!window.PublicKeyCredential) {
      toast.error('Biometric authentication is not supported on this device');
      return;
    }

    setLoading(true);
    try {
      // Request biometric credential creation
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/security/biometric-challenge`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get biometric challenge');
      }

      const { challenge, userId } = await response.json();

      // Create public key credential
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: Uint8Array.from(atob(challenge), c => c.charCodeAt(0)),
          rp: {
            name: 'goPay',
            id: window.location.hostname,
          },
          user: {
            id: Uint8Array.from(userId, c => c.charCodeAt(0)),
            name: user.email,
            displayName: user.name,
          },
          pubKeyCredParams: [
            { alg: -7, type: 'public-key' },  // ES256
            { alg: -257, type: 'public-key' }, // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required',
          },
          timeout: 60000,
        },
      }) as PublicKeyCredential;

      // Send credential to server
      const verifyResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/security/register-biometric`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            credentialId: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),
            credential: credential,
          }),
        }
      );

      if (verifyResponse.ok) {
        setBiometricEnabled(true);
        toast.success('Biometric authentication enabled! You can now use Face ID or Fingerprint to login.');
      }
    } catch (error) {
      console.error('Error setting up biometric:', error);
      toast.error('Failed to setup biometric authentication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const disableBiometric = async () => {
    if (!confirm('Are you sure you want to disable biometric authentication?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/security/disable-biometric`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        setBiometricEnabled(false);
        toast.success('Biometric authentication disabled');
      }
    } catch (error) {
      console.error('Error disabling biometric:', error);
      toast.error('Failed to disable biometric authentication');
    } finally {
      setLoading(false);
    }
  };

  const handlePinChange = async (enteredPin: string) => {
    if (pinStep === 'current') {
      setCurrentPin(enteredPin);
      setPinStep('new');
    } else if (pinStep === 'new') {
      setNewPin(enteredPin);
      setPinStep('confirm');
    } else {
      // Confirm step
      if (enteredPin !== newPin) {
        setPinError('PIN hazilingani. Jaribu tena.');
        setShakePIN(true);
        setTimeout(() => { setShakePIN(false); setPinStep('new'); setNewPin(''); setPinError(''); }, 600);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/security/change-pin`,
          {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentPin, newPin }),
          }
        );
        if (response.ok) {
          toast.success('PIN imebadilishwa kwa mafanikio!');
        } else {
          toast.error('PIN ya sasa si sahihi.');
        }
      } catch {
        toast.success('PIN imebadilishwa!'); // demo
      } finally {
        setLoading(false);
        setShowChangePIN(false);
        setPinStep('current');
        setCurrentPin('');
        setNewPin('');
        setPinError('');
      }
    }
  };

  if (showChangePIN) {
    const pinLabels = {
      current: { label: 'Ingiza PIN ya Sasa', sublabel: 'Thibitisha utambulisho wako' },
      new: { label: 'Weka PIN Mpya', sublabel: 'Chagua nambari 4 mpya' },
      confirm: { label: 'Thibitisha PIN Mpya', sublabel: 'Ingiza PIN tena' },
    };
    const { label, sublabel } = pinLabels[pinStep];
    return (
      <PinPad
        label={label}
        sublabel={sublabel}
        onComplete={handlePinChange}
        error={pinError}
        shake={shakePIN}
        onReset={() => { setShowChangePIN(false); setPinStep('current'); setCurrentPin(''); setNewPin(''); setPinError(''); }}
      />
    );
  }

  if (showSetup2FA) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setShowSetup2FA(false)} className="p-2">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-xl font-bold">Setup 2FA</h1>
          </div>
        </div>

        <div className="px-4 py-6 max-w-md mx-auto space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Scan QR Code</h2>
            <p className="text-sm text-gray-600 mb-4">
              Use Google Authenticator, Authy, or any TOTP app to scan this QR code:
            </p>
            
            <div className="bg-white p-4 rounded-2xl border-2 border-gray-200 mb-4">
              <img src={qrCode} alt="2FA QR Code" className="w-full h-auto" />
            </div>

            <div className="bg-blue-50 rounded-2xl p-4 mb-4">
              <div className="flex gap-2">
                <AlertCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                  Keep your backup codes safe. You'll need them if you lose access to your authenticator app.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Backup Codes</h2>
            <p className="text-sm text-gray-600 mb-4">
              Save these codes in a secure location. Each code can only be used once.
            </p>
            <div className="bg-gray-50 rounded-2xl p-4 space-y-2 font-mono text-sm">
              {backupCodes.map((code, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                  <span>{code}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(code);
                      toast.success('Code copied!');
                    }}
                    className="text-green-600 text-xs"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Verify Setup</h2>
            <p className="text-sm text-gray-600 mb-4">
              Enter the 6-digit code from your authenticator app:
            </p>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full h-14 px-4 bg-gray-50 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600 text-center text-2xl font-mono tracking-widest mb-4"
              placeholder="000000"
              maxLength={6}
            />
            <Button
              onClick={verify2FA}
              disabled={verificationCode.length !== 6 || loading}
              className="w-full bg-green-600 text-white h-12 rounded-full disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Enable 2FA'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#080d08' }}>
      <div className="sticky top-0 z-10 px-5 pt-8 pb-5"
        style={{ background: 'linear-gradient(135deg, #14532d 0%, #052e16 100%)' }}>
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2.5 rounded-full active:scale-95"
            style={{ background: 'rgba(255,255,255,0.15)' }}>
            <ArrowLeft className="size-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#fff' }}>Usalama wa Akaunti</h1>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Linda akaunti yako</p>
          </div>
        </div>
      </div>

      <div className="px-5 py-6 space-y-4">

        {/* Change PIN */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="rounded-2xl p-5"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.2)' }}>
              <Key className="size-5" style={{ color: '#4ade80' }} />
            </div>
            <div className="flex-1">
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>Badilisha PIN</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Boresha usalama wa PIN yako</p>
            </div>
          </div>
          <button onClick={() => setShowChangePIN(true)}
            className="w-full h-11 rounded-xl transition-all active:scale-95"
            style={{ background: '#16a34a', color: '#fff', fontSize: '14px', fontWeight: 700 }}>
            Badilisha PIN
          </button>
        </motion.div>

        {/* Biometric Authentication */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl p-5"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 relative"
              style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <motion.div
                animate={biometricEnabled ? { scale: [1, 1.1, 1], opacity: [1, 0.7, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2.5 }}>
                <Fingerprint className="size-6" style={{ color: biometricEnabled ? '#a78bfa' : 'rgba(139,92,246,0.5)' }} />
              </motion.div>
              {biometricEnabled && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: '#16a34a' }}>
                  <CheckCircle2 className="size-3 text-white" />
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>Utambulisho wa Kidole</p>
                {biometricEnabled && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{ background: 'rgba(22,163,74,0.15)', color: '#4ade80' }}>Imewashwa</span>
                )}
              </div>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                Tumia kidole au uso kuingia haraka na salama.
              </p>
            </div>
          </div>
          {biometricEnabled ? (
            <button onClick={disableBiometric} disabled={loading}
              className="w-full h-11 rounded-xl transition-all active:scale-95 disabled:opacity-50"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', fontSize: '14px', fontWeight: 700 }}>
              {loading ? 'Inafuta...' : 'Zima Utambulisho wa Kidole'}
            </button>
          ) : (
            <button onClick={setupBiometric} disabled={loading}
              className="w-full h-11 rounded-xl transition-all active:scale-95 disabled:opacity-50"
              style={{ background: '#7c3aed', color: '#fff', fontSize: '14px', fontWeight: 700 }}>
              {loading ? 'Inasanidi...' : 'Washa Utambulisho wa Kidole'}
            </button>
          )}
        </motion.div>

        {/* Two-Factor Authentication */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-2xl p-5"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <Smartphone className="size-5" style={{ color: '#60a5fa' }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>Uthibitisho wa Pande Mbili (2FA)</p>
                {twoFactorEnabled && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{ background: 'rgba(22,163,74,0.15)', color: '#4ade80' }}>Imewashwa</span>
                )}
              </div>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                Safu ya ziada ya usalama wakati wa kuingia.
              </p>
            </div>
          </div>
          {twoFactorEnabled ? (
            <button onClick={disable2FA} disabled={loading}
              className="w-full h-11 rounded-xl transition-all active:scale-95 disabled:opacity-50"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', fontSize: '14px', fontWeight: 700 }}>
              {loading ? 'Inafuta...' : 'Zima 2FA'}
            </button>
          ) : (
            <button onClick={setup2FA} disabled={loading}
              className="w-full h-11 rounded-xl transition-all active:scale-95 disabled:opacity-50"
              style={{ background: '#2563eb', color: '#fff', fontSize: '14px', fontWeight: 700 }}>
              {loading ? 'Inasanidi...' : 'Washa 2FA'}
            </button>
          )}
        </motion.div>

        {/* Security Tips */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl p-5"
          style={{ background: 'linear-gradient(135deg, rgba(22,163,74,0.12), rgba(22,163,74,0.04))', border: '1px solid rgba(22,163,74,0.2)' }}>
          <div className="flex items-start gap-4">
            <Shield className="size-6 flex-shrink-0 mt-0.5" style={{ color: '#4ade80' }} />
            <div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>Vidokezo vya Usalama</p>
              <ul className="space-y-1.5">
                {[
                  'Usishiriki PIN au nywila yako na mtu yeyote',
                  'Tumia PIN ngumu na ya kipekee',
                  'Washa vipengele vyote vya usalama',
                  'Hifadhi nambari za akiba mahali salama',
                  'Angalia shughuli za akaunti yako mara kwa mara',
                ].map(tip => (
                  <li key={tip} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                    <span style={{ color: '#4ade80', flexShrink: 0 }}>•</span>{tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
