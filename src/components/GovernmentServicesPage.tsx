import { ArrowLeft, Shield, Car, GraduationCap, Building2, FileText, AlertCircle, CheckCircle, DollarSign, X, Zap, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

interface GovernmentServicesPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 }).format(n);

type ServiceId = 'nida' | 'fines' | 'education' | 'business' | 'municipal' | 'tra';
type ActiveTab = 'services' | 'fines' | 'licenses';
type PayFlow = { serviceId: ServiceId; title: string; amount?: number } | null;

export function GovernmentServicesPage({ onBack }: GovernmentServicesPageProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('services');
  const [nidaVerified, setNidaVerified] = useState(false);
  const [showNidaModal, setShowNidaModal] = useState(false);
  const [nidaLoading, setNidaLoading] = useState(false);
  const [nidaInput, setNidaInput] = useState('');
  const [dobInput, setDobInput] = useState('');
  const [payFlow, setPayFlow] = useState<PayFlow>(null);
  const [payAmount, setPayAmount] = useState('');
  const [payRef, setPayRef] = useState('');
  const [payLoading, setPayLoading] = useState(false);
  const [paidFines, setPaidFines] = useState<string[]>([]);

  const services = [
    { id: 'nida' as ServiceId, name: 'Kitambulisho cha NIDA', nameEn: 'National ID (NIDA)', icon: Shield, description: 'Thibitisha utambulisho wako wa taifa', color: 'from-blue-500 to-blue-600', status: nidaVerified ? 'verified' : 'pending' },
    { id: 'fines' as ServiceId, name: 'Faini za Barabarani', nameEn: 'Traffic Fines', icon: Car, description: 'Angalia na lipa faini za barabarani', color: 'from-red-500 to-red-600', badge: 'TZS 45,000' },
    { id: 'education' as ServiceId, name: 'Ada za Shule', nameEn: 'School Fees', icon: GraduationCap, description: 'Lipa ada za shule na vyuo vikuu', color: 'from-green-500 to-green-600' },
    { id: 'business' as ServiceId, name: 'Leseni ya Biashara', nameEn: 'Business License', icon: Building2, description: 'Fanya upya leseni na vibali', color: 'from-purple-500 to-purple-600' },
    { id: 'municipal' as ServiceId, name: 'Huduma za Manispaa', nameEn: 'Municipal Services', icon: FileText, description: 'Taka, maji, kodi ya ardhi', color: 'from-orange-500 to-orange-600' },
    { id: 'tra' as ServiceId, name: 'Huduma za TRA', nameEn: 'TRA Services', icon: DollarSign, description: 'Malipo ya kodi na uthibitisho wa TIN', color: 'from-indigo-500 to-indigo-600' },
  ];

  const pendingFines = [
    { id: 'F001', type: 'Uvunjaji wa Kasi', location: 'Barabara ya Morogoro, Dar es Salaam', date: '2024-11-15', amount: 30000 },
    { id: 'F002', type: 'Uvunjaji wa Maegesho', location: 'Kariakoo, Dar es Salaam', date: '2024-11-10', amount: 15000 },
  ];

  const handleVerifyNida = () => {
    if (!nidaInput || !dobInput) { toast.error('Jaza namba ya NIDA na tarehe ya kuzaliwa'); return; }
    setNidaLoading(true);
    setTimeout(() => {
      setNidaVerified(true);
      setShowNidaModal(false);
      setNidaLoading(false);
      toast.success('Utambulisho wa NIDA umethibitishwa!');
    }, 2000);
  };

  const handleServiceClick = (svc: typeof services[0]) => {
    if (svc.id === 'nida') { setShowNidaModal(true); return; }
    if (svc.id === 'fines') { setActiveTab('fines'); return; }
    if (!nidaVerified) { toast.error('Thibitisha NIDA kwanza'); return; }
    setPayFlow({ serviceId: svc.id, title: svc.name });
    setPayAmount('');
    setPayRef('');
  };

  const handlePay = () => {
    if (!payAmount || parseFloat(payAmount) <= 0) { toast.error('Weka kiasi halisi'); return; }
    setPayLoading(true);
    setTimeout(() => {
      setPayLoading(false);
      setPayFlow(null);
      toast.success('Malipo yamefanikishwa!');
    }, 2000);
  };

  const handlePayFine = (fineId: string) => {
    setPaidFines(p => [...p, fineId]);
    toast.success('Faini imelipwa!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="size-6 text-gray-900" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-black text-gray-900">Huduma za Serikali</h1>
              <p className="text-xs text-gray-500">Government Services Portal</p>
            </div>
            {nidaVerified && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 border border-green-200">
                <CheckCircle className="size-4 text-green-600" />
                <span className="text-xs font-bold text-green-700">Imethibitishwa</span>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {(['services', 'fines', 'licenses'] as ActiveTab[]).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {tab === 'services' ? 'Huduma Zote' : tab === 'fines' ? 'Faini Zangu' : 'Leseni'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SERVICES TAB */}
      {activeTab === 'services' && (
        <div className="px-4 py-5 space-y-4 pb-24">
          {/* NIDA banner */}
          {!nidaVerified ? (
            <div className="rounded-3xl overflow-hidden shadow-lg" style={{ background: 'linear-gradient(135deg, #1d4ed8, #2563eb)' }}>
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-white/20">
                    <Shield className="size-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-white font-black text-lg mb-1">Thibitisha NIDA Yako</h2>
                    <p className="text-blue-100 text-sm mb-4">Unganisha kitambulisho chako cha taifa ili kupata huduma zote za serikali</p>
                    <button onClick={() => setShowNidaModal(true)}
                      className="bg-white text-blue-700 font-black px-6 py-2.5 rounded-full text-sm hover:bg-blue-50 transition-colors">
                      Thibitisha Sasa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl overflow-hidden shadow-lg" style={{ background: 'linear-gradient(135deg, #166534, #16a34a)' }}>
              <div className="p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-white/20">
                  <CheckCircle className="size-7 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-black text-lg">NIDA Imethibitishwa ✓</h3>
                  <p className="text-green-100 text-sm">Unaweza kutumia huduma zote za serikali</p>
                </div>
              </div>
            </div>
          )}

          {/* Services grid */}
          <div>
            <h2 className="text-base font-black text-gray-900 mb-3">Huduma Zinazopatikana</h2>
            <div className="space-y-3">
              {services.map(svc => {
                const Icon = svc.icon;
                const locked = !nidaVerified && svc.id !== 'nida';
                return (
                  <button key={svc.id} onClick={() => handleServiceClick(svc)}
                    className={`w-full bg-white rounded-3xl p-5 shadow-sm text-left transition-all hover:shadow-md active:scale-[0.99] ${locked ? 'opacity-60' : ''}`}>
                    <div className="flex items-start gap-4">
                      <div className={`bg-gradient-to-br ${svc.color} w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0`}>
                        <Icon className="size-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-black text-gray-900">{svc.name}</h3>
                          {svc.status === 'verified' && <CheckCircle className="size-4 text-green-600" />}
                          {svc.badge && !paidFines.length && (
                            <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold">{svc.badge}</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mb-1">{svc.nameEn}</p>
                        <p className="text-sm text-gray-600">{svc.description}</p>
                        {locked && (
                          <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                            <AlertCircle className="size-3" />Thibitisha NIDA kwanza
                          </p>
                        )}
                      </div>
                      {!locked && <ArrowLeft className="size-5 text-gray-400 rotate-180 flex-shrink-0 mt-1" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Security note */}
          <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2 text-sm">
              <Shield className="size-4" />Lango Salama la Serikali
            </h3>
            <ul className="space-y-1.5 text-xs text-blue-800">
              {['Muunganisho rasmi wa serikali kupitia NIDA', 'Malipo yote yalindwa na usimbaji', 'Uthibitisho wa papo hapo kwa miamala yote', 'Msaada wa saa 24 kwa huduma za serikali'].map(t => (
                <li key={t} className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">✓</span>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* FINES TAB */}
      {activeTab === 'fines' && (
        <div className="px-4 py-5 space-y-4 pb-24">
          {pendingFines.filter(f => !paidFines.includes(f.id)).length > 0 ? (
            <>
              <div className="bg-red-50 rounded-2xl p-4 border border-red-200">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="size-5 text-red-600" />
                  <h3 className="font-black text-red-900 text-sm">Faini Ambazo Hazijalipwa</h3>
                </div>
                <p className="text-sm text-red-700">Una faini {pendingFines.filter(f => !paidFines.includes(f.id)).length} ambazo hazijalipwa</p>
              </div>

              {pendingFines.filter(f => !paidFines.includes(f.id)).map(fine => (
                <div key={fine.id} className="bg-white rounded-3xl p-5 shadow-sm">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-red-100">
                      <Car className="size-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-black text-gray-900">{fine.type}</h3>
                        <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold">HAIJALIPIWA</span>
                      </div>
                      <p className="text-sm text-gray-600 flex items-center gap-1"><MapPin className="size-3 flex-shrink-0" />{fine.location}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Nambari: {fine.id} • Tarehe: {fine.date}</p>
                    </div>
                  </div>

                  <div className="bg-red-50 rounded-2xl p-3 mb-4">
                    <p className="text-xs text-gray-600 mb-0.5">Kiasi kinachostahili</p>
                    <p className="text-2xl font-black text-gray-900">{formatCurrency(fine.amount)}</p>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => handlePayFine(fine.id)}
                      className="flex-1 h-12 rounded-full font-bold text-sm bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                      <Zap className="size-4" />Lipa Sasa
                    </button>
                    <button className="flex-1 h-12 rounded-full font-bold text-sm border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                      Maelezo Zaidi
                    </button>
                  </div>
                </div>
              ))}

              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                <p className="text-sm text-amber-800">
                  <strong>Tahadhari:</strong> Faini ambazo hazijalipwa zinaweza kusababisha kusimamishwa kwa leseni. Lipa mapema ili kuepuka adhabu.
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-green-100">
                <CheckCircle className="size-10 text-green-600" />
              </div>
              <h3 className="font-black text-gray-900 text-lg mb-2">Hakuna Faini!</h3>
              <p className="text-gray-500 text-sm">Huna faini zozote ambazo hazijalipwa. Endelea kuendesha kwa usalama!</p>
            </div>
          )}
        </div>
      )}

      {/* LICENSES TAB */}
      {activeTab === 'licenses' && (
        <div className="px-4 py-5 space-y-4 pb-24">
          <div className="bg-white rounded-3xl p-5 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-14 h-14 rounded-2xl flex items-center justify-center">
                <Building2 className="size-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-gray-900 text-lg">Leseni ya Biashara</h3>
                <p className="text-sm text-gray-600">TIN: 123-456-789</p>
              </div>
              <span className="bg-green-100 text-green-700 text-xs px-3 py-1.5 rounded-full font-bold">HAI</span>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Tarehe ya Kutolewa</p>
                  <p className="font-bold text-gray-900 text-sm">Jan 15, 2024</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Tarehe ya Kuisha</p>
                  <p className="font-bold text-gray-900 text-sm">Jan 15, 2025</p>
                </div>
              </div>
            </div>
            <button onClick={() => { setPayFlow({ serviceId: 'business', title: 'Upya wa Leseni ya Biashara', amount: 150000 }); setPayAmount('150000'); }}
              className="w-full h-12 rounded-full font-bold text-sm bg-purple-600 text-white hover:bg-purple-700 transition-colors">
              Fanya Upya Leseni
            </button>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center">
                <Car className="size-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-gray-900 text-lg">Leseni ya Gari</h3>
                <p className="text-sm text-gray-600">Namba: T 123 ABC</p>
              </div>
              <span className="bg-amber-100 text-amber-700 text-xs px-3 py-1.5 rounded-full font-bold">KARIBU KUISHA</span>
            </div>
            <div className="bg-amber-50 rounded-2xl p-3 mb-4 border border-amber-200">
              <p className="text-sm text-amber-800 flex items-center gap-2">
                <AlertCircle className="size-4 flex-shrink-0" />Leseni inaisha baada ya siku 45. Fanya upya sasa ili kuepuka faini.
              </p>
            </div>
            <button onClick={() => { setPayFlow({ serviceId: 'business', title: 'Upya wa Leseni ya Gari', amount: 75000 }); setPayAmount('75000'); }}
              className="w-full h-12 rounded-full font-bold text-sm bg-amber-500 text-white hover:bg-amber-600 transition-colors">
              Fanya Upya Sasa
            </button>
          </div>

          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Kumbuka:</strong> Fanya upya leseni siku 30 kabla ya kuisha ili kuepuka usumbufu.
            </p>
          </div>
        </div>
      )}

      {/* NIDA Verification Modal */}
      {showNidaModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-black text-gray-900">Thibitisha NIDA</h3>
                <button onClick={() => setShowNidaModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="size-5 text-gray-600" />
                </button>
              </div>

              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="size-8 text-blue-600" />
              </div>
              <p className="text-gray-600 text-center mb-6 text-sm">Weka namba yako ya NIDA na tarehe ya kuzaliwa kuthibitisha utambulisho wako</p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Namba ya NIDA</label>
                  <input type="text" value={nidaInput} onChange={e => setNidaInput(e.target.value)}
                    placeholder="19XXXXXXXXXX12345"
                    className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 font-mono text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tarehe ya Kuzaliwa</label>
                  <input type="date" value={dobInput} onChange={e => setDobInput(e.target.value)}
                    className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 text-sm" />
                </div>
              </div>

              <div className="space-y-3">
                <button onClick={handleVerifyNida} disabled={nidaLoading}
                  className="w-full h-12 rounded-full font-black text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                  {nidaLoading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Inathibitisha...</>
                  ) : (
                    <><Shield className="size-4" />Thibitisha Utambulisho</>
                  )}
                </button>
                <button onClick={() => setShowNidaModal(false)}
                  className="w-full h-12 rounded-full font-semibold text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                  Ghairi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generic Payment Flow Modal */}
      {payFlow && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-black text-gray-900">{payFlow.title}</h3>
                <button onClick={() => setPayFlow(null)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="size-5 text-gray-600" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {payFlow.serviceId === 'education' && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Namba ya Rejista / Registration No.</label>
                    <input type="text" value={payRef} onChange={e => setPayRef(e.target.value)}
                      placeholder="e.g. S0123/2024"
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 text-sm" />
                  </div>
                )}
                {payFlow.serviceId === 'municipal' && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Namba ya Akaunti / Account No.</label>
                    <input type="text" value={payRef} onChange={e => setPayRef(e.target.value)}
                      placeholder="e.g. DAR-2024-001234"
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 text-sm" />
                  </div>
                )}
                {payFlow.serviceId === 'tra' && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">TIN Number</label>
                    <input type="text" value={payRef} onChange={e => setPayRef(e.target.value)}
                      placeholder="e.g. 100-123-456"
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 font-mono text-sm" />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Kiasi (TZS) / Amount</label>
                  <input type="number" value={payAmount} onChange={e => setPayAmount(e.target.value)}
                    placeholder="0"
                    readOnly={!!payFlow.amount}
                    className={`w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 text-lg font-bold ${payFlow.amount ? 'bg-gray-50 text-gray-700' : ''}`} />
                </div>
              </div>

              <div className="space-y-3">
                <button onClick={handlePay} disabled={payLoading || !payAmount}
                  className="w-full h-12 rounded-full font-black text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                  {payLoading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Inafanya malipo...</>
                  ) : (
                    <><Zap className="size-4" />Lipa {payAmount ? formatCurrency(parseFloat(payAmount)) : ''}</>
                  )}
                </button>
                <button onClick={() => setPayFlow(null)}
                  className="w-full h-12 rounded-full font-semibold text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                  Ghairi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
