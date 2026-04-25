import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Shield, Car, GraduationCap, Building2, FileText,
  AlertCircle, CheckCircle, DollarSign, ChevronRight, X,
  Loader2, Clock, MapPin, Calendar, CreditCard, Receipt
} from 'lucide-react';

interface GovernmentServicesPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

type Tab = 'services' | 'fines' | 'licenses';

const SERVICES = [
  {
    id: 'nida',
    name: 'NIDA Digital ID',
    swahili: 'Kitambulisho cha NIDA',
    icon: Shield,
    gradient: 'linear-gradient(135deg, #1d4ed8, #1e40af)',
    accent: '#3b82f6',
    description: 'Thibitisha utambulisho wa taifa',
    descriptionEn: 'Verify national identity',
    requiresNida: false,
  },
  {
    id: 'fines',
    name: 'Traffic Fines',
    swahili: 'Faini za Barabarani',
    icon: Car,
    gradient: 'linear-gradient(135deg, #dc2626, #b91c1c)',
    accent: '#ef4444',
    description: 'Angalia na lipa faini za trafiki',
    descriptionEn: 'View and pay traffic violations',
    requiresNida: true,
    badge: 'TZS 45,000',
  },
  {
    id: 'education',
    name: 'School Fees',
    swahili: 'Ada za Shule',
    icon: GraduationCap,
    gradient: 'linear-gradient(135deg, #16a34a, #15803d)',
    accent: '#4ade80',
    description: 'Lipa ada za shule na vyuo',
    descriptionEn: 'Pay school and university fees',
    requiresNida: true,
  },
  {
    id: 'business',
    name: 'Business License',
    swahili: 'Leseni ya Biashara',
    icon: Building2,
    gradient: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
    accent: '#a78bfa',
    description: 'Fanya upya leseni na vibali',
    descriptionEn: 'Renew licenses and permits',
    requiresNida: true,
  },
  {
    id: 'municipal',
    name: 'Municipal Services',
    swahili: 'Huduma za Manispaa',
    icon: FileText,
    gradient: 'linear-gradient(135deg, #ea580c, #c2410c)',
    accent: '#fb923c',
    description: 'Kodi ya ardhi, maji, taka',
    descriptionEn: 'Land tax, water, waste payments',
    requiresNida: true,
  },
  {
    id: 'tra',
    name: 'TRA Services',
    swahili: 'Huduma za TRA',
    icon: DollarSign,
    gradient: 'linear-gradient(135deg, #0891b2, #0e7490)',
    accent: '#22d3ee',
    description: 'Kodi za mapato na uthibitisho wa TIN',
    descriptionEn: 'Tax payments and TIN verification',
    requiresNida: true,
  },
];

const PENDING_FINES = [
  {
    id: 'F001',
    type: 'Kasi Kupita Kiasi',
    typeEn: 'Speeding Violation',
    location: 'Barabara ya Morogoro, Dar es Salaam',
    date: '2024-11-15',
    amount: 30000,
    status: 'unpaid',
  },
  {
    id: 'F002',
    type: 'Kukaa Mahali Pasipo Ruhusiwa',
    typeEn: 'Parking Violation',
    location: 'Kariakoo, Dar es Salaam',
    date: '2024-11-10',
    amount: 15000,
    status: 'unpaid',
  },
];

const LICENSES = [
  {
    id: 'L001',
    type: 'Leseni ya Biashara',
    typeEn: 'Business License',
    tin: '123-456-789',
    issueDate: 'Jan 15, 2024',
    expiryDate: 'Jan 15, 2025',
    status: 'active',
    icon: Building2,
  },
];

const TABS: { id: Tab; label: string; swahili: string }[] = [
  { id: 'services', label: 'Services', swahili: 'Huduma' },
  { id: 'fines', label: 'My Fines', swahili: 'Faini Zangu' },
  { id: 'licenses', label: 'Licenses', swahili: 'Leseni' },
];

const NIDA_STEPS = [
  { step: 1, label: 'Namba ya NIDA', labelEn: 'NIDA Number', placeholder: '19XXXXXXXXXX12345', type: 'text' },
  { step: 2, label: 'Tarehe ya Kuzaliwa', labelEn: 'Date of Birth', placeholder: '', type: 'date' },
];

export function GovernmentServicesPage({ onBack, onNavigate }: GovernmentServicesPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>('services');
  const [nidaVerified, setNidaVerified] = useState(false);
  const [showNidaModal, setShowNidaModal] = useState(false);
  const [nidaStep, setNidaStep] = useState(1);
  const [verifying, setVerifying] = useState(false);
  const [nidaNumber, setNidaNumber] = useState('');
  const [dob, setDob] = useState('');
  const [payingFine, setPayingFine] = useState<string | null>(null);
  const [paidFines, setPaidFines] = useState<string[]>([]);

  const handleVerifyNida = async () => {
    if (nidaStep === 1) {
      if (!nidaNumber.trim()) return;
      setNidaStep(2);
      return;
    }
    if (!dob) return;
    setVerifying(true);
    await new Promise(r => setTimeout(r, 2200));
    setVerifying(false);
    setNidaVerified(true);
    setShowNidaModal(false);
    setNidaStep(1);
  };

  const handlePayFine = async (fineId: string) => {
    setPayingFine(fineId);
    await new Promise(r => setTimeout(r, 1800));
    setPaidFines(prev => [...prev, fineId]);
    setPayingFine(null);
  };

  const totalUnpaid = PENDING_FINES
    .filter(f => !paidFines.includes(f.id))
    .reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="min-h-screen pb-10" style={{ background: '#080d08' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-20 px-5 pt-10 pb-5"
        style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0c1829 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-4 mb-5">
          <button
            onClick={onBack}
            className="p-2.5 rounded-full active:scale-95 transition-transform"
            style={{ background: 'rgba(255,255,255,0.1)' }}
            aria-label="Rudi nyuma"
          >
            <ArrowLeft className="size-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
              Huduma za Serikali
            </h1>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
              Government Services Portal
            </p>
          </div>
          {nidaVerified && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(22,163,74,0.2)', border: '1px solid rgba(22,163,74,0.3)' }}>
              <CheckCircle className="size-3.5" style={{ color: '#4ade80' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#4ade80' }}>Imethibitishwa</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative px-4 py-2 rounded-full whitespace-nowrap transition-all active:scale-95"
              style={
                activeTab === tab.id
                  ? { background: 'rgba(59,130,246,0.25)', border: '1px solid rgba(59,130,246,0.5)', color: '#93c5fd', fontWeight: 700, fontSize: '13px' }
                  : { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '13px' }
              }
            >
              {tab.swahili}
              {tab.id === 'fines' && totalUnpaid > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-white" style={{ background: '#ef4444', fontSize: '10px', fontWeight: 800 }}>
                  {PENDING_FINES.filter(f => !paidFines.includes(f.id)).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* SERVICES TAB */}
        {activeTab === 'services' && (
          <motion.div
            key="services"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="px-5 pt-5 space-y-5"
          >
            {/* NIDA Banner */}
            {!nidaVerified ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-3xl p-5 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #1d4ed8, #1e3a5f)', border: '1px solid rgba(59,130,246,0.3)' }}
              >
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full" style={{ background: 'rgba(59,130,246,0.15)', filter: 'blur(20px)' }} />
                <div className="relative z-10 flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>
                    <Shield className="size-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <p style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>Thibitisha NIDA Yako</p>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '14px', lineHeight: 1.5 }}>
                      Unganisha kitambulisho chako cha taifa ili kupata huduma zote za serikali
                    </p>
                    <button
                      onClick={() => setShowNidaModal(true)}
                      className="px-5 py-2.5 rounded-full active:scale-95 transition-all"
                      style={{ background: '#fff', color: '#1d4ed8', fontWeight: 800, fontSize: '13px' }}
                    >
                      Thibitisha Sasa
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-3xl p-5 flex items-center gap-4"
                style={{ background: 'rgba(22,163,74,0.12)', border: '1px solid rgba(22,163,74,0.25)' }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(22,163,74,0.2)' }}>
                  <CheckCircle className="size-7" style={{ color: '#4ade80' }} />
                </div>
                <div>
                  <p style={{ fontSize: '16px', fontWeight: 800, color: '#4ade80' }}>NIDA Imethibitishwa</p>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Utambulisho wako umethibitishwa</p>
                </div>
              </motion.div>
            )}

            {/* Services Grid */}
            <div>
              <p style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                Huduma Zinazopatikana
              </p>
              <div className="grid grid-cols-2 gap-3 grid-flow-dense">
                {SERVICES.map((service, i) => {
                  const Icon = service.icon;
                  const locked = service.requiresNida && !nidaVerified;
                  return (
                    <motion.button
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => {
                        if (service.id === 'nida') { setShowNidaModal(true); return; }
                        if (service.id === 'fines') { setActiveTab('fines'); return; }
                        if (service.id === 'business' || service.id === 'licenses') { setActiveTab('licenses'); return; }
                        if (!locked) { /* navigate to sub-page */ }
                      }}
                      disabled={locked}
                      className="text-left rounded-3xl p-4 transition-all active:scale-95 relative overflow-hidden"
                      style={{
                        background: locked ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.05)',
                        border: locked ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(255,255,255,0.08)',
                        opacity: locked ? 0.6 : 1,
                      }}
                    >
                      {service.badge && !paidFines.length && (
                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.25)', border: '1px solid rgba(239,68,68,0.4)' }}>
                          <span style={{ fontSize: '10px', fontWeight: 800, color: '#f87171' }}>{service.badge}</span>
                        </div>
                      )}
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                        style={{ background: locked ? 'rgba(255,255,255,0.05)' : service.gradient }}
                      >
                        <Icon className="size-6 text-white" style={{ opacity: locked ? 0.4 : 1 }} />
                      </div>
                      <p style={{ fontSize: '13px', fontWeight: 800, color: locked ? 'rgba(255,255,255,0.3)' : '#fff', marginBottom: '3px' }}>
                        {service.swahili}
                      </p>
                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>
                        {service.description}
                      </p>
                      {locked && (
                        <div className="flex items-center gap-1 mt-2">
                          <AlertCircle className="size-3" style={{ color: '#fbbf24' }} />
                          <span style={{ fontSize: '10px', color: '#fbbf24', fontWeight: 600 }}>Inahitaji NIDA</span>
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Info block */}
            <div className="rounded-2xl p-4" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Shield className="size-4" style={{ color: '#60a5fa' }} />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#93c5fd' }}>Mlango Salama wa Serikali</span>
              </div>
              {[
                'Muunganiko rasmi wa serikali kupitia NIDA',
                'Malipo yote ni salama na yamefichwa',
                'Uthibitisho wa papo hapo kwa miamala yote',
                'Msaada wa masaa 24 kwa huduma za serikali',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 mb-1.5">
                  <CheckCircle className="size-3.5 mt-0.5 flex-shrink-0" style={{ color: '#4ade80' }} />
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* FINES TAB */}
        {activeTab === 'fines' && (
          <motion.div
            key="fines"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="px-5 pt-5 space-y-4"
          >
            {/* Summary card */}
            <div className="rounded-3xl p-5 relative overflow-hidden" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full" style={{ background: 'rgba(239,68,68,0.1)', filter: 'blur(16px)' }} />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Jumla Inayodaiwa</p>
                  <p style={{ fontSize: '28px', fontWeight: 900, color: totalUnpaid > 0 ? '#f87171' : '#4ade80', letterSpacing: '-0.5px' }}>
                    TZS {totalUnpaid.toLocaleString()}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.2)' }}>
                  <Car className="size-7" style={{ color: '#f87171' }} />
                </div>
              </div>
              {totalUnpaid === 0 && (
                <div className="flex items-center gap-2 mt-3">
                  <CheckCircle className="size-4" style={{ color: '#4ade80' }} />
                  <span style={{ fontSize: '13px', color: '#4ade80', fontWeight: 700 }}>Hakuna faini zinazodaiwa</span>
                </div>
              )}
            </div>

            {PENDING_FINES.map((fine, i) => {
              const isPaid = paidFines.includes(fine.id);
              const isPaying = payingFine === fine.id;
              return (
                <motion.div
                  key={fine.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: isPaid ? 0.5 : 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="rounded-3xl p-5"
                  style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${isPaid ? 'rgba(22,163,74,0.3)' : 'rgba(239,68,68,0.2)'}` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>{fine.type}</span>
                        <span
                          className="px-2 py-0.5 rounded-full"
                          style={isPaid
                            ? { background: 'rgba(22,163,74,0.2)', color: '#4ade80', fontSize: '10px', fontWeight: 800 }
                            : { background: 'rgba(239,68,68,0.2)', color: '#f87171', fontSize: '10px', fontWeight: 800 }
                          }
                        >
                          {isPaid ? 'IMELIPWA' : 'HAIJALIPIWA'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <MapPin className="size-3.5" style={{ color: 'rgba(255,255,255,0.3)' }} />
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{fine.location}</span>
                      </div>
                      <div className="flex items-center gap-3" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
                        <div className="flex items-center gap-1">
                          <Receipt className="size-3" />
                          <span>ID: {fine.id}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          <span>{fine.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl p-4 mb-4" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Kiasi Kinachohitajika</p>
                    <p style={{ fontSize: '28px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
                      TZS {fine.amount.toLocaleString()}
                    </p>
                  </div>

                  {!isPaid && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handlePayFine(fine.id)}
                        disabled={isPaying}
                        className="flex-1 h-12 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
                        style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff', fontWeight: 800, fontSize: '14px', opacity: isPaying ? 0.7 : 1 }}
                      >
                        {isPaying ? <Loader2 className="size-4 animate-spin" /> : <CreditCard className="size-4" />}
                        {isPaying ? 'Inashughulikia...' : 'Lipa Sasa'}
                      </button>
                      <button
                        className="flex-1 h-12 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: '14px' }}
                      >
                        <FileText className="size-4" />
                        Maelezo
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}

            <div className="rounded-2xl p-4" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.15)' }}>
              <div className="flex items-start gap-2">
                <AlertCircle className="size-4 mt-0.5 flex-shrink-0" style={{ color: '#fbbf24' }} />
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                  <span style={{ color: '#fbbf24', fontWeight: 700 }}>Kumbuka:</span>{' '}
                  Faini ambazo hazijalipwa zinaweza kusababisha kusimamishwa kwa leseni. Lipa mapema ili kuepuka adhabu.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* LICENSES TAB */}
        {activeTab === 'licenses' && (
          <motion.div
            key="licenses"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="px-5 pt-5 space-y-4"
          >
            {LICENSES.map((lic, i) => {
              const Icon = lic.icon;
              return (
                <motion.div
                  key={lic.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="rounded-3xl p-5"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
                      <Icon className="size-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <p style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginBottom: '2px' }}>{lic.type}</p>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>TIN: {lic.tin}</p>
                    </div>
                    <div className="px-3 py-1.5 rounded-full" style={{ background: 'rgba(22,163,74,0.2)', border: '1px solid rgba(22,163,74,0.3)' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#4ade80', textTransform: 'uppercase' }}>
                        {lic.status === 'active' ? 'Hai' : 'Imekwisha'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      { label: 'Tarehe ya Kutolewa', value: lic.issueDate, icon: Calendar },
                      { label: 'Tarehe ya Mwisho', value: lic.expiryDate, icon: Clock },
                    ].map(item => {
                      const ItemIcon = item.icon;
                      return (
                        <div key={item.label} className="rounded-2xl p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                          <div className="flex items-center gap-1.5 mb-1">
                            <ItemIcon className="size-3.5" style={{ color: 'rgba(255,255,255,0.3)' }} />
                            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>{item.label}</span>
                          </div>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{item.value}</span>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    className="w-full h-12 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: '#fff', fontWeight: 800, fontSize: '14px' }}
                  >
                    <ChevronRight className="size-4" />
                    Fanya Upya Leseni
                  </button>
                </motion.div>
              );
            })}

            <div className="rounded-2xl p-4" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}>
              <div className="flex items-start gap-2">
                <AlertCircle className="size-4 mt-0.5 flex-shrink-0" style={{ color: '#60a5fa' }} />
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                  <span style={{ color: '#93c5fd', fontWeight: 700 }}>Ukumbusho:</span>{' '}
                  Fanya upya leseni yako siku 30 kabla ya kumalizika ili kuepuka usumbufu.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NIDA Verification Modal */}
      <AnimatePresence>
        {showNidaModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
            onClick={e => { if (e.target === e.currentTarget) { setShowNidaModal(false); setNidaStep(1); } }}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full rounded-t-3xl p-6"
              style={{ background: '#0d1a2e', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#fff' }}>Thibitisha NIDA</h3>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                    Hatua {nidaStep} ya 2
                  </p>
                </div>
                <button
                  onClick={() => { setShowNidaModal(false); setNidaStep(1); }}
                  className="p-2 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                >
                  <X className="size-5 text-white" />
                </button>
              </div>

              {/* Step indicator */}
              <div className="flex gap-2 mb-6">
                {[1, 2].map(s => (
                  <div
                    key={s}
                    className="h-1.5 flex-1 rounded-full transition-all duration-300"
                    style={{ background: s <= nidaStep ? '#3b82f6' : 'rgba(255,255,255,0.1)' }}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                {nidaStep === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                      Namba ya NIDA
                    </label>
                    <input
                      type="text"
                      value={nidaNumber}
                      onChange={e => setNidaNumber(e.target.value)}
                      placeholder="19XXXXXXXXXX12345"
                      className="w-full h-14 px-4 rounded-2xl text-white placeholder-gray-600 focus:outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.06)', border: nidaNumber ? '1.5px solid #3b82f6' : '1.5px solid rgba(255,255,255,0.1)', fontSize: '16px', fontFamily: 'monospace', letterSpacing: '2px' }}
                    />
                  </motion.div>
                )}
                {nidaStep === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                      Tarehe ya Kuzaliwa
                    </label>
                    <input
                      type="date"
                      value={dob}
                      onChange={e => setDob(e.target.value)}
                      className="w-full h-14 px-4 rounded-2xl text-white focus:outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.06)', border: dob ? '1.5px solid #3b82f6' : '1.5px solid rgba(255,255,255,0.1)', fontSize: '15px', colorScheme: 'dark' }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-6 space-y-3">
                <button
                  onClick={handleVerifyNida}
                  disabled={verifying || (nidaStep === 1 && !nidaNumber.trim()) || (nidaStep === 2 && !dob)}
                  className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
                  style={{ background: 'linear-gradient(135deg, #1d4ed8, #2563eb)', color: '#fff', fontWeight: 800, fontSize: '15px', opacity: verifying ? 0.7 : 1 }}
                >
                  {verifying ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Inathibitisha...
                    </>
                  ) : nidaStep === 1 ? (
                    <>
                      Endelea
                      <ChevronRight className="size-5" />
                    </>
                  ) : (
                    <>
                      <Shield className="size-5" />
                      Thibitisha Utambulisho
                    </>
                  )}
                </button>
                {nidaStep === 2 && (
                  <button
                    onClick={() => setNidaStep(1)}
                    className="w-full h-12 rounded-2xl"
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: '14px' }}
                  >
                    Rudi Nyuma
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
