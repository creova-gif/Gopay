import { ArrowLeft, Shield, Car, GraduationCap, Building2, FileText, AlertCircle, CheckCircle, Smartphone, DollarSign, Users } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface GovernmentServicesPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export function GovernmentServicesPage({ onBack, onNavigate }: GovernmentServicesPageProps) {
  const [activeTab, setActiveTab] = useState<'services' | 'fines' | 'licenses'>('services');
  const [nidaVerified, setNidaVerified] = useState(false);
  const [showNidaVerification, setShowNidaVerification] = useState(false);

  const services = [
    {
      id: 'nida',
      name: 'NIDA Digital ID',
      icon: Shield,
      description: 'Verify your national identity',
      color: 'from-blue-500 to-blue-600',
      status: nidaVerified ? 'verified' : 'pending'
    },
    {
      id: 'fines',
      name: 'Traffic Fines',
      icon: Car,
      description: 'Check and pay traffic violations',
      color: 'from-red-500 to-red-600',
      badge: 'TZS 45,000'
    },
    {
      id: 'education',
      name: 'School Fees',
      icon: GraduationCap,
      description: 'Pay school & university fees',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'business',
      name: 'Business License',
      icon: Building2,
      description: 'Renew licenses & permits',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'municipal',
      name: 'Municipal Services',
      icon: FileText,
      description: 'Waste, water, land tax payments',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'tra',
      name: 'TRA Services',
      icon: DollarSign,
      description: 'Tax payments & TIN verification',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const pendingFines = [
    {
      id: 'F001',
      type: 'Speeding Violation',
      location: 'Morogoro Road, Dar es Salaam',
      date: '2024-11-15',
      amount: 30000,
      status: 'unpaid'
    },
    {
      id: 'F002',
      type: 'Parking Violation',
      location: 'Kariakoo, Dar es Salaam',
      date: '2024-11-10',
      amount: 15000,
      status: 'unpaid'
    }
  ];

  const handleNidaVerification = () => {
    setShowNidaVerification(true);
  };

  const handleVerifyNida = () => {
    // Simulate verification
    setTimeout(() => {
      setNidaVerified(true);
      setShowNidaVerification(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="size-6 text-gray-900" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Government Services</h1>
              <p className="text-sm text-gray-600">Official digital services portal</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveTab('services')}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold transition-all ${
                activeTab === 'services'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Services
            </button>
            <button
              onClick={() => setActiveTab('fines')}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold transition-all ${
                activeTab === 'fines'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              My Fines
            </button>
            <button
              onClick={() => setActiveTab('licenses')}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold transition-all ${
                activeTab === 'licenses'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Licenses
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'services' && (
        <div className="px-4 py-6 space-y-6 pb-24">
          {/* NIDA Verification Banner */}
          {!nidaVerified && (
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="size-7" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">Verify Your NIDA</h2>
                  <p className="text-sm text-white/90 mb-4">
                    Connect your National ID to access government services securely
                  </p>
                  <Button
                    onClick={handleNidaVerification}
                    className="bg-white text-blue-600 hover:bg-blue-50 h-12 rounded-full font-bold"
                  >
                    Verify Now
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Verified Badge */}
          {nidaVerified && (
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-3xl p-6 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-xl flex items-center justify-center">
                  <CheckCircle className="size-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">NIDA Verified</h3>
                  <p className="text-sm text-white/90">Your identity is confirmed</p>
                </div>
              </div>
            </div>
          )}

          {/* Services Grid */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Available Services</h2>
            {services.map(service => {
              const IconComponent = service.icon;
              return (
                <button
                  key={service.id}
                  onClick={() => {
                    if (service.id === 'nida') {
                      handleNidaVerification();
                    } else if (service.id === 'fines') {
                      setActiveTab('fines');
                    }
                  }}
                  className="w-full bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all"
                  disabled={!nidaVerified && service.id !== 'nida'}
                >
                  <div className="flex items-start gap-4">
                    <div className={`bg-gradient-to-br ${service.color} w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="size-7 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">{service.name}</h3>
                        {service.status === 'verified' && (
                          <CheckCircle className="size-5 text-green-600" />
                        )}
                        {service.badge && (
                          <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-bold">
                            {service.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{service.description}</p>
                      {!nidaVerified && service.id !== 'nida' && (
                        <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                          <AlertCircle className="size-3" />
                          Requires NIDA verification
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Information */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Shield className="size-5" />
              Secure Government Portal
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">✓</span>
                <span>Official government integration via NIDA</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">✓</span>
                <span>All payments are secure and encrypted</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">✓</span>
                <span>Instant confirmation for all transactions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">✓</span>
                <span>24/7 support for government services</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'fines' && (
        <div className="px-4 py-6 space-y-6 pb-24">
          <div className="bg-red-50 rounded-2xl p-4 border border-red-200">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="size-5 text-red-600" />
              <h3 className="font-semibold text-red-900">Outstanding Fines</h3>
            </div>
            <p className="text-sm text-red-700">
              You have {pendingFines.length} unpaid traffic violations
            </p>
          </div>

          {pendingFines.map(fine => (
            <div key={fine.id} className="bg-white rounded-3xl p-6 shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{fine.type}</h3>
                    <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-bold">
                      UNPAID
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{fine.location}</p>
                  <p className="text-xs text-gray-500">Fine ID: {fine.id} • Date: {fine.date}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                <p className="text-sm text-gray-600 mb-1">Amount Due</p>
                <p className="text-3xl font-bold text-gray-900">
                  TZS {fine.amount.toLocaleString()}
                </p>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white h-12 rounded-full">
                  Pay Now
                </Button>
                <Button variant="outline" className="flex-1 h-12 rounded-full border-2">
                  View Details
                </Button>
              </div>
            </div>
          ))}

          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> Unpaid fines may result in license suspension. Pay early to avoid penalties.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'licenses' && (
        <div className="px-4 py-6 space-y-6 pb-24">
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-14 h-14 rounded-xl flex items-center justify-center">
                <Building2 className="size-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">Business License</h3>
                <p className="text-sm text-gray-600">TIN: 123-456-789</p>
              </div>
              <span className="bg-green-100 text-green-700 text-xs px-3 py-1.5 rounded-full font-bold">
                ACTIVE
              </span>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Issue Date</p>
                  <p className="text-sm font-semibold text-gray-900">Jan 15, 2024</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Expiry Date</p>
                  <p className="text-sm font-semibold text-gray-900">Jan 15, 2025</p>
                </div>
              </div>
            </div>

            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 rounded-full">
              Renew License
            </Button>
          </div>

          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Reminder:</strong> Renew your license 30 days before expiry to avoid interruptions.
            </p>
          </div>
        </div>
      )}

      {/* NIDA Verification Modal */}
      {showNidaVerification && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="size-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                NIDA Verification
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Enter your National ID number to verify your identity
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NIDA Number
                  </label>
                  <input
                    type="text"
                    placeholder="19XXXXXXXXXX12345"
                    className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleVerifyNida}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-full"
                >
                  Verify Identity
                </Button>
                <Button
                  onClick={() => setShowNidaVerification(false)}
                  variant="ghost"
                  className="w-full h-12 rounded-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
