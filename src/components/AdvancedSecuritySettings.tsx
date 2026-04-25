import { ArrowLeft, Shield, Lock, Smartphone, AlertTriangle, CheckCircle, Eye, Fingerprint, Key, MapPin, Users, Clock, Zap, Settings } from 'lucide-react';
import { useState } from 'react';

interface AdvancedSecuritySettingsProps {
  onBack: () => void;
}

type Tab = 'authentication' | 'devices' | 'transaction' | 'privacy';

const TABS: { id: Tab; label: string }[] = [
  { id: 'authentication', label: 'Uthibitishaji' },
  { id: 'devices', label: 'Vifaa' },
  { id: 'transaction', label: 'Malipo' },
  { id: 'privacy', label: 'Faragha' },
];

function Toggle({ value, onChange, 'aria-label': ariaLabel }: { value: boolean; onChange: () => void; 'aria-label'?: string }) {
  return (
    <button
      onClick={onChange}
      className="relative w-14 h-8 rounded-full transition-colors flex-shrink-0 active:scale-95"
      style={{ background: value ? '#16a34a' : 'rgba(255,255,255,0.12)' }}
      role="switch"
      aria-checked={value}
      aria-label={ariaLabel}
    >
      <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${value ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl p-5 ${className}`} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      {children}
    </div>
  );
}

function IconBox({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
      {children}
    </div>
  );
}

export function AdvancedSecuritySettings({ onBack }: AdvancedSecuritySettingsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('authentication');
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [pinEnabled, setPinEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [autoLockTime, setAutoLockTime] = useState('30');
  const [rootDetection, setRootDetection] = useState(true);
  const [screenRecordBlock, setScreenRecordBlock] = useState(true);
  const [appCloningDetection, setAppCloningDetection] = useState(true);
  const [transactionPinRequired, setTransactionPinRequired] = useState(true);
  const [dailyLimit, setDailyLimit] = useState('5000000');
  const [nighttimeBlock, setNighttimeBlock] = useState(false);
  const [whitelistOnly, setWhitelistOnly] = useState(false);
  const [fraudAIEnabled, setFraudAIEnabled] = useState(true);
  const [antiGPSSpoofing, setAntiGPSSpoofing] = useState(true);
  const [locationEncryption, setLocationEncryption] = useState(true);
  const [vpnDetection, setVpnDetection] = useState(true);

  const deviceTrustScore = 95;
  const securityScore = 92;

  const trustedDevices = [
    { id: '1', name: 'iPhone 14 Pro', lastActive: 'Dakika 2 zilizopita', location: 'Dar es Salaam, Tanzania', trustScore: 98, current: true },
    { id: '2', name: 'Samsung Galaxy S23', lastActive: 'Siku 3 zilizopita', location: 'Arusha, Tanzania', trustScore: 85, current: false },
  ];

  const recentSecurityEvents = [
    { id: '1', message: 'Kuingia kwa mafanikio kutoka kwa kifaa kinachoaminika', timestamp: 'Dakika 2 zilizopita', severity: 'info' },
    { id: '2', message: 'Muamala wa tuhuma ulizuiwa na AI', timestamp: 'Saa 1 iliyopita', severity: 'warning' },
    { id: '3', message: 'Jaribio la udanganyifu wa GPS liligundulika na kuzuiwa', timestamp: 'Masaa 5 yaliyopita', severity: 'danger' },
  ];

  const eventColor = (s: string) => s === 'info' ? '#60a5fa' : s === 'warning' ? '#facc15' : '#f87171';
  const eventBg = (s: string) => s === 'info' ? 'rgba(59,130,246,0.12)' : s === 'warning' ? 'rgba(234,179,8,0.12)' : 'rgba(239,68,68,0.12)';

  return (
    <div className="min-h-screen pb-10" style={{ background: '#080d08' }}>
      {/* Header */}
      <div className="sticky top-0 z-20" style={{ background: 'linear-gradient(135deg, #14532d 0%, #052e16 100%)' }}>
        <div className="px-4 pt-8 pb-4">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={onBack} className="p-2.5 rounded-full active:scale-95" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <ArrowLeft className="size-5 text-white" />
            </button>
            <div className="flex-1">
              <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>Usalama wa Juu</h1>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Ulinzi wa kiwango cha benki</p>
            </div>
            <div className="px-3 py-1.5 rounded-full" style={{ background: 'rgba(22,163,74,0.25)', border: '1px solid rgba(74,222,128,0.3)' }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#4ade80' }}>{securityScore}% Salama</p>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-4 py-2 rounded-full whitespace-nowrap font-semibold transition-all text-sm active:scale-95"
                style={{
                  background: activeTab === tab.id ? '#16a34a' : 'rgba(255,255,255,0.1)',
                  color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.6)',
                  border: activeTab === tab.id ? 'none' : '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-5 space-y-4">

        {/* ── AUTHENTICATION ── */}
        {activeTab === 'authentication' && (
          <>
            <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(22,163,74,0.2) 0%, rgba(5,46,22,0.85) 100%)', border: '1px solid rgba(74,222,128,0.15)' }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: 'rgba(22,163,74,0.3)' }}>
                  <Shield className="size-7 text-white" />
                </div>
                <div className="flex-1">
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>Hali ya Usalama</p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)' }}>Akaunti yako inakidhi viwango vya BoT</p>
                </div>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="flex justify-between items-center mb-2">
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)' }}>Alama ya Usalama</span>
                  <span style={{ fontSize: '24px', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>{securityScore}%</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${securityScore}%`, background: 'linear-gradient(90deg, #16a34a, #4ade80)' }} />
                </div>
              </div>
            </div>

            <Card>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <IconBox color="#a78bfa"><Fingerprint className="size-5" style={{ color: '#a78bfa' }} /></IconBox>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Kufuli cha Biometri</p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Face ID / Alama ya kidole</p>
                  </div>
                </div>
                <Toggle value={biometricEnabled} onChange={() => setBiometricEnabled(!biometricEnabled)} />
              </div>
              {biometricEnabled && (
                <div className="rounded-xl p-3" style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.15)' }}>
                  <p style={{ fontSize: '11px', color: '#4ade80' }}>✓ Secure Enclave imewezeshwa • Funguo zilindwa na vifaa</p>
                </div>
              )}
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <IconBox color="#60a5fa"><Lock className="size-5" style={{ color: '#60a5fa' }} /></IconBox>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Kufuli cha PIN</p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>PIN ya tarakimu 6 inahitajika</p>
                  </div>
                </div>
                <Toggle value={pinEnabled} onChange={() => setPinEnabled(!pinEnabled)} />
              </div>
              {pinEnabled && (
                <button className="w-full h-10 rounded-xl text-sm font-semibold transition-all active:scale-95"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  Badilisha PIN
                </button>
              )}
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <IconBox color="#4ade80"><Smartphone className="size-5" style={{ color: '#4ade80' }} /></IconBox>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Uthibitishaji wa 2FA</p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>SMS + Biometri</p>
                  </div>
                </div>
                <Toggle value={twoFactorEnabled} onChange={() => setTwoFactorEnabled(!twoFactorEnabled)} />
              </div>
              {twoFactorEnabled && (
                <div className="rounded-xl p-3" style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.15)' }}>
                  <p style={{ fontSize: '11px', color: '#4ade80' }}>✓ Inahitajika kwa miamala ya thamani kubwa • Inakidhi BoT</p>
                </div>
              )}
            </Card>

            <Card>
              <div className="flex items-center gap-3 mb-4">
                <IconBox color="#facc15"><Clock className="size-5" style={{ color: '#facc15' }} /></IconBox>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Kufungwa Kiotomatiki</p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Funga baada ya kutotumika</p>
                </div>
              </div>
              <div className="space-y-2">
                {[{ v: '30', l: 'Sekunde 30' }, { v: '60', l: 'Dakika 1' }, { v: '120', l: 'Dakika 2' }, { v: '300', l: 'Dakika 5' }].map(opt => (
                  <button key={opt.v} onClick={() => setAutoLockTime(opt.v)}
                    className="w-full p-3 rounded-xl transition-all active:scale-[0.98] text-left"
                    style={{
                      background: autoLockTime === opt.v ? 'rgba(22,163,74,0.15)' : 'rgba(255,255,255,0.04)',
                      border: autoLockTime === opt.v ? '1.5px solid #16a34a' : '1px solid rgba(255,255,255,0.08)',
                    }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: autoLockTime === opt.v ? '#4ade80' : 'rgba(255,255,255,0.7)' }}>{opt.l}</span>
                  </button>
                ))}
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3 mb-4">
                <IconBox color="#f87171"><Key className="size-5" style={{ color: '#f87171' }} /></IconBox>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Nywila & Urejeshaji</p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Urejeshaji uliothibitishwa na NIDA pekee</p>
                </div>
              </div>
              <div className="space-y-2">
                {['Badilisha Nywila', 'Weka Urejeshaji (NIDA)'].map(label => (
                  <button key={label} className="w-full h-10 rounded-xl text-sm font-semibold active:scale-95"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {label}
                  </button>
                ))}
              </div>
            </Card>

            <div className="rounded-2xl p-5" style={{ background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.15)' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#4ade80', marginBottom: '12px' }}>Viwango vya Usalama vya BoT</p>
              <ul className="space-y-2">
                {['Usimbuaji wa mwisho hadi mwisho (AES-256 + TLS 1.3)', 'Hifadhi ya funguo za vifaa (Secure Enclave)', 'Uchimbaji wa nywila (Argon2id)', 'Ufuatiliaji wa ulaghai wa wakati halisi (AI)'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="size-4 flex-shrink-0 mt-0.5" style={{ color: '#4ade80' }} />
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* ── DEVICES ── */}
        {activeTab === 'devices' && (
          <>
            <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(22,163,74,0.2) 0%, rgba(5,46,22,0.85) 100%)', border: '1px solid rgba(74,222,128,0.15)' }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: 'rgba(22,163,74,0.3)' }}>
                  <Smartphone className="size-7 text-white" />
                </div>
                <div className="flex-1">
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>Alama ya Uaminifu wa Kifaa</p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)' }}>Sifa ya kifaa hiki</p>
                </div>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="flex justify-between items-center mb-2">
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)' }}>Kiwango cha Uaminifu</span>
                  <span style={{ fontSize: '24px', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>{deviceTrustScore}%</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div className="h-full rounded-full" style={{ width: `${deviceTrustScore}%`, background: 'linear-gradient(90deg, #16a34a, #4ade80)' }} />
                </div>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginTop: '8px' }}>✓ Kifaa safi • Hakuna mizizi • Hakuna uharibifu uliogunduliwa</p>
              </div>
            </div>

            <Card>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <IconBox color="#f87171"><AlertTriangle className="size-5" style={{ color: '#f87171' }} /></IconBox>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Ugunduz wa Mizizi</p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Zuia vifaa vilivyoboreshwa</p>
                  </div>
                </div>
                <Toggle value={rootDetection} onChange={() => setRootDetection(!rootDetection)} />
              </div>
              {rootDetection && (
                <div className="rounded-xl p-3" style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.15)' }}>
                  <p style={{ fontSize: '11px', color: '#4ade80' }}>✓ Inafanya kazi • Malipo yamezuiwa kwenye vifaa vilivyoathirika</p>
                </div>
              )}
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <IconBox color="#a78bfa"><Eye className="size-5" style={{ color: '#a78bfa' }} /></IconBox>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Ulinzi wa Skrini</p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Zuia picha za skrini na kurekodi</p>
                  </div>
                </div>
                <Toggle value={screenRecordBlock} onChange={() => setScreenRecordBlock(!screenRecordBlock)} />
              </div>
              {screenRecordBlock && (
                <div className="rounded-xl p-3" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}>
                  <p style={{ fontSize: '11px', color: '#c4b5fd' }}>✓ Skrini za pochi na QR haziwezi kupigiwa picha</p>
                </div>
              )}
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <IconBox color="#facc15"><Settings className="size-5" style={{ color: '#facc15' }} /></IconBox>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Ugunduz wa Nakala</p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Zuia programu mbili na nafasi ya sambamba</p>
                  </div>
                </div>
                <Toggle value={appCloningDetection} onChange={() => setAppCloningDetection(!appCloningDetection)} />
              </div>
            </Card>

            <div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>Vifaa Vinavyoaminika</p>
              <div className="space-y-3">
                {trustedDevices.map(device => (
                  <Card key={device.id}>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{ background: device.current ? 'rgba(22,163,74,0.15)' : 'rgba(255,255,255,0.06)', border: device.current ? '1px solid rgba(22,163,74,0.3)' : '1px solid rgba(255,255,255,0.08)' }}>
                        <Smartphone className="size-5" style={{ color: device.current ? '#4ade80' : 'rgba(255,255,255,0.5)' }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{device.name}</p>
                          {device.current && (
                            <span className="px-2 py-0.5 rounded-full" style={{ fontSize: '10px', fontWeight: 700, background: 'rgba(22,163,74,0.2)', color: '#4ade80', border: '1px solid rgba(22,163,74,0.3)' }}>
                              SASA HIVI
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '2px' }}>{device.location}</p>
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{device.lastActive}</p>
                      </div>
                    </div>
                    <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <div className="flex justify-between items-center mb-2">
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Alama ya Uaminifu</span>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{device.trustScore}%</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div className="h-full rounded-full" style={{ width: `${device.trustScore}%`, background: device.trustScore >= 90 ? '#16a34a' : device.trustScore >= 70 ? '#d97706' : '#dc2626' }} />
                      </div>
                    </div>
                    {!device.current && (
                      <button className="w-full h-9 rounded-xl text-sm font-semibold active:scale-95"
                        style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                        Ondoa Kifaa
                      </button>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-5" style={{ background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.15)' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#4ade80', marginBottom: '12px' }}>Ulinzi wa Wakati wa Utekelezaji Unafanya Kazi</p>
              <ul className="space-y-2">
                {['Ugunduz wa uharibifu wa kumbukumbu', 'Kuzuia kuingiza nambari', 'Kuzuia mfumo wa kuunganisha (Frida/Xposed)', 'Kuunganisha cheti kumewezeshwa'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="size-4 flex-shrink-0 mt-0.5" style={{ color: '#4ade80' }} />
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* ── TRANSACTION ── */}
        {activeTab === 'transaction' && (
          <>
            <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, rgba(109,40,217,0.35) 0%, rgba(76,29,149,0.6) 100%)', border: '1px solid rgba(167,139,250,0.2)' }}>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.3)' }}>
                  <Zap className="size-7 text-white" />
                </div>
                <div className="flex-1">
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>Injini ya AI Dhidi ya Ulaghai</p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)' }}>Ulinzi wa wakati halisi</p>
                </div>
                <Toggle value={fraudAIEnabled} onChange={() => setFraudAIEnabled(!fraudAIEnabled)} />
              </div>
              {fraudAIEnabled && (
                <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>Imelindwa Dhidi ya:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['✓ Udanganyifu wa SIM', '✓ Uhandisi wa kijamii', '✓ Kutofautiana kwa kifaa', '✓ Matatizo ya mahali', '✓ Mifumo isiyo ya kawaida', '✓ Ukaguzi wa kasi'].map((item, i) => (
                      <p key={i} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>{item}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Card>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <IconBox color="#60a5fa"><Lock className="size-5" style={{ color: '#60a5fa' }} /></IconBox>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>PIN ya Muamala</p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Inahitajika kwa malipo yote</p>
                  </div>
                </div>
                <Toggle value={transactionPinRequired} onChange={() => setTransactionPinRequired(!transactionPinRequired)} />
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3 mb-4">
                <IconBox color="#facc15"><Settings className="size-5" style={{ color: '#facc15' }} /></IconBox>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Kikomo cha Muamala wa Kila Siku</p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Linda kutoka kwa ulaghai mkubwa</p>
                </div>
              </div>
              <div className="rounded-xl p-4 mb-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Kikomo cha Sasa Hivi</p>
                <p style={{ fontSize: '28px', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>TZS {parseInt(dailyLimit).toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                {[{ v: '1000000', l: 'TZS 1,000,000' }, { v: '5000000', l: 'TZS 5,000,000' }, { v: '10000000', l: 'TZS 10,000,000' }, { v: '50000000', l: 'TZS 50,000,000' }].map(opt => (
                  <button key={opt.v} onClick={() => setDailyLimit(opt.v)}
                    className="w-full p-3 rounded-xl transition-all active:scale-[0.98] text-left"
                    style={{
                      background: dailyLimit === opt.v ? 'rgba(234,179,8,0.15)' : 'rgba(255,255,255,0.04)',
                      border: dailyLimit === opt.v ? '1.5px solid #d97706' : '1px solid rgba(255,255,255,0.08)',
                    }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: dailyLimit === opt.v ? '#facc15' : 'rgba(255,255,255,0.7)' }}>{opt.l}</span>
                  </button>
                ))}
              </div>
            </Card>

            <div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>Kinga ya Fedha</p>
              <div className="space-y-3">
                <Card>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <IconBox color="#818cf8"><Clock className="size-5" style={{ color: '#818cf8' }} /></IconBox>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Kizuizi cha Usiku</p>
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Hakuna malipo 11 PM - 6 AM</p>
                      </div>
                    </div>
                    <Toggle value={nighttimeBlock} onChange={() => setNighttimeBlock(!nighttimeBlock)} />
                  </div>
                </Card>
                <Card>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <IconBox color="#4ade80"><Users className="size-5" style={{ color: '#4ade80' }} /></IconBox>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Hali ya Orodha ya Weupe</p>
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Wapokeaji walioidhinishwa pekee</p>
                      </div>
                    </div>
                    <Toggle value={whitelistOnly} onChange={() => setWhitelistOnly(!whitelistOnly)} />
                  </div>
                </Card>
              </div>
            </div>

            <div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>Matukio ya Usalama ya Hivi Karibuni</p>
              <div className="space-y-3">
                {recentSecurityEvents.map(event => (
                  <div key={event.id} className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: eventBg(event.severity) }}>
                        <AlertTriangle className="size-4" style={{ color: eventColor(event.severity) }} />
                      </div>
                      <div className="flex-1">
                        <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '2px' }}>{event.message}</p>
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{event.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── PRIVACY ── */}
        {activeTab === 'privacy' && (
          <>
            <Card>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <IconBox color="#f87171"><MapPin className="size-5" style={{ color: '#f87171' }} /></IconBox>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Kinga ya GPS Bandia</p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Zuia programu za mahali bandia</p>
                  </div>
                </div>
                <Toggle value={antiGPSSpoofing} onChange={() => setAntiGPSSpoofing(!antiGPSSpoofing)} />
              </div>
              {antiGPSSpoofing && (
                <div className="rounded-xl p-3" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)' }}>
                  <p style={{ fontSize: '11px', color: '#fca5a5' }}>✓ Ugunduz wa mahali bandia • Uthibitishaji wa magnetometer</p>
                </div>
              )}
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <IconBox color="#60a5fa"><Lock className="size-5" style={{ color: '#60a5fa' }} /></IconBox>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Usimbuaji wa Mahali</p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Simba GPS kabla ya kutuma</p>
                  </div>
                </div>
                <Toggle value={locationEncryption} onChange={() => setLocationEncryption(!locationEncryption)} />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <IconBox color="#facc15"><Shield className="size-5" style={{ color: '#facc15' }} /></IconBox>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Ugunduz wa VPN/Proxy</p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Zuia miunganisho ya tuhuma</p>
                  </div>
                </div>
                <Toggle value={vpnDetection} onChange={() => setVpnDetection(!vpnDetection)} />
              </div>
            </Card>

            <div className="rounded-2xl p-5" style={{ background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.15)' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#4ade80', marginBottom: '12px' }}>Faragha ya Mahali</p>
              <ul className="space-y-2">
                {['Hakuna kuratibu za GPS kamili zilizohifadhiwa', 'Zimebadilishwa kuwa maeneo yaliyofichwa kwa faragha', 'Kufutwa kiotomatiki baada ya siku 30-90', 'Imesimbwa wakati wa usafirishaji (TLS 1.3)'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="size-4 flex-shrink-0 mt-0.5" style={{ color: '#4ade80' }} />
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
