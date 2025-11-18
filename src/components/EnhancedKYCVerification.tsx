import { ArrowLeft, Shield, Camera, CheckCircle, AlertTriangle, User, FileText, Smartphone, MapPin, Building2 } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface EnhancedKYCVerificationProps {
  onBack: () => void;
  onComplete: () => void;
}

type KYCStep = 'intro' | 'nida' | 'liveness' | 'address' | 'sim' | 'review' | 'complete';

export function EnhancedKYCVerification({ onBack, onComplete }: EnhancedKYCVerificationProps) {
  const [currentStep, setCurrentStep] = useState<KYCStep>('intro');
  const [verificationData, setVerificationData] = useState({
    nidaNumber: '',
    dateOfBirth: '',
    phoneNumber: '',
    address: '',
    livenessVerified: false,
    simVerified: false,
    riskScore: 0
  });

  const steps = [
    { id: 'intro', label: 'Introduction', completed: true },
    { id: 'nida', label: 'NIDA Verification', completed: false },
    { id: 'liveness', label: 'Face Match', completed: false },
    { id: 'address', label: 'Address Proof', completed: false },
    { id: 'sim', label: 'SIM Verification', completed: false },
    { id: 'review', label: 'Review', completed: false }
  ];

  const handleNIDAVerification = () => {
    // Simulate NIDA verification
    setTimeout(() => {
      setCurrentStep('liveness');
    }, 2000);
  };

  const handleLivenessTest = () => {
    // Simulate liveness detection
    setTimeout(() => {
      setVerificationData({ ...verificationData, livenessVerified: true });
      setCurrentStep('address');
    }, 3000);
  };

  const handleSIMVerification = () => {
    // Simulate SIM verification
    setTimeout(() => {
      setVerificationData({ ...verificationData, simVerified: true, riskScore: 15 });
      setCurrentStep('review');
    }, 2000);
  };

  const handleComplete = () => {
    setCurrentStep('complete');
    setTimeout(() => {
      onComplete();
    }, 3000);
  };

  if (currentStep === 'intro') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="size-6" />
              </button>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">Enhanced KYC</h1>
                <p className="text-sm text-gray-600">Bank of Tanzania Compliant</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-3xl p-6 shadow-xl">
            <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="size-8" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">Identity Verification</h2>
            <p className="text-sm text-white/90 text-center leading-relaxed">
              We need to verify your identity to comply with Bank of Tanzania regulations and protect your account.
            </p>
          </div>

          {/* Process Steps */}
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <h3 className="font-bold text-gray-900 mb-4">Verification Process</h3>
            <div className="space-y-4">
              {[
                {
                  icon: FileText,
                  title: 'NIDA Verification',
                  description: 'Verify your National ID number',
                  time: '1 min'
                },
                {
                  icon: Camera,
                  title: 'Face Liveness Test',
                  description: 'Confirm you\'re a real person',
                  time: '30 sec'
                },
                {
                  icon: MapPin,
                  title: 'Address Confirmation',
                  description: 'Verify your residence',
                  time: '2 min'
                },
                {
                  icon: Smartphone,
                  title: 'SIM Card Verification',
                  description: 'Match SIM with identity',
                  time: '30 sec'
                }
              ].map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="size-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900">{step.title}</h4>
                        <span className="text-xs text-gray-500">{step.time}</span>
                      </div>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Why This Matters */}
          <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
            <h3 className="font-semibold text-green-900 mb-3">Why This Matters</h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Prevents fraud and identity theft</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Complies with Bank of Tanzania regulations</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Protects your money and transactions</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Increases your transaction limits</span>
              </li>
            </ul>
          </div>

          {/* Privacy Note */}
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
            <p className="text-xs text-blue-800">
              <strong>🔒 Your Privacy:</strong> All data is encrypted end-to-end. We never share your information without consent. This process is required by law.
            </p>
          </div>

          <Button
            onClick={() => setCurrentStep('nida')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 rounded-full text-lg"
          >
            Start Verification
          </Button>
        </div>
      </div>
    );
  }

  if (currentStep === 'nida') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setCurrentStep('intro')} className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="size-6" />
              </button>
              <div className="flex-1">
                <h1 className="text-xl font-bold">Step 1: NIDA Verification</h1>
                <p className="text-xs text-gray-600">National Identity Confirmation</p>
              </div>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map(step => (
                <div
                  key={step}
                  className={`flex-1 h-2 rounded-full ${
                    step === 1 ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="size-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-center mb-2">Enter NIDA Details</h2>
            <p className="text-sm text-gray-600 text-center mb-6">
              We'll verify your identity with the National Identification Authority
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NIDA Number *
                </label>
                <input
                  type="text"
                  placeholder="19XXXXXXXXXX12345"
                  maxLength={20}
                  value={verificationData.nidaNumber}
                  onChange={(e) => setVerificationData({ ...verificationData, nidaNumber: e.target.value })}
                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  value={verificationData.dateOfBirth}
                  onChange={(e) => setVerificationData({ ...verificationData, dateOfBirth: e.target.value })}
                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <p className="text-xs text-amber-800">
                  <strong>Note:</strong> Ensure details match exactly as shown on your National ID card
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleNIDAVerification}
              disabled={!verificationData.nidaNumber || !verificationData.dateOfBirth}
              className="w-full h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300"
            >
              Verify with NIDA
            </Button>
            <Button
              onClick={() => setCurrentStep('intro')}
              variant="ghost"
              className="w-full h-12 rounded-full"
            >
              Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'liveness') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setCurrentStep('nida')} className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="size-6" />
              </button>
              <div className="flex-1">
                <h1 className="text-xl font-bold">Step 2: Face Liveness Test</h1>
                <p className="text-xs text-gray-600">Confirm you're a real person</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map(step => (
                <div
                  key={step}
                  className={`flex-1 h-2 rounded-full ${
                    step <= 2 ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-md text-center">
            <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="size-10 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Face Liveness Check</h2>
            <p className="text-sm text-gray-600 mb-6">
              We'll take a quick video to confirm you're a real person and match your face with your NIDA photo
            </p>

            {/* Face Detection Preview */}
            <div className="bg-gray-900 rounded-3xl aspect-[3/4] mb-6 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-80 border-4 border-white rounded-full relative">
                  {/* Face outline */}
                  <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                </div>
                <div className="absolute bottom-8 left-0 right-0">
                  <p className="text-white text-sm">Position your face in the circle</p>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 rounded-2xl p-4 mb-6 text-left">
              <h3 className="font-semibold text-blue-900 mb-3 text-sm">Instructions:</h3>
              <ul className="space-y-2 text-xs text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">1.</span>
                  <span>Find good lighting and hold phone at eye level</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">2.</span>
                  <span>Remove glasses, hat, and face coverings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">3.</span>
                  <span>Follow prompts: blink, smile, turn head</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={handleLivenessTest}
              className="w-full h-14 rounded-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Camera className="size-5 mr-2" />
              Start Liveness Test
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'address') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setCurrentStep('liveness')} className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="size-6" />
              </button>
              <div className="flex-1">
                <h1 className="text-xl font-bold">Step 3: Address Verification</h1>
                <p className="text-xs text-gray-600">Confirm your residence</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map(step => (
                <div
                  key={step}
                  className={`flex-1 h-2 rounded-full ${
                    step <= 3 ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="size-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-center mb-2">Residential Address</h2>
            <p className="text-sm text-gray-600 text-center mb-6">
              Enter your current residential address in Tanzania
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Plot 123, Msasani Road"
                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ward *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Masaki"
                    className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Kinondoni"
                    className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region *
                </label>
                <select className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600">
                  <option>Select Region</option>
                  <option>Dar es Salaam</option>
                  <option>Arusha</option>
                  <option>Mwanza</option>
                  <option>Dodoma</option>
                  <option>Mbeya</option>
                  <option>Morogoro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Digital Address (Plus Code)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value="6G9M+XR2 Dar es Salaam"
                    disabled
                    className="flex-1 h-12 px-4 border-2 border-gray-200 rounded-xl bg-gray-50"
                  />
                  <Button className="h-12 px-6 rounded-xl">
                    <MapPin className="size-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setCurrentStep('sim')}
            className="w-full h-14 rounded-full bg-green-600 hover:bg-green-700 text-white"
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  if (currentStep === 'sim') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setCurrentStep('address')} className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="size-6" />
              </button>
              <div className="flex-1">
                <h1 className="text-xl font-bold">Step 4: SIM Verification</h1>
                <p className="text-xs text-gray-600">Link your SIM card</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map(step => (
                <div
                  key={step}
                  className={`flex-1 h-2 rounded-full ${
                    step <= 4 ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="size-8 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-center mb-2">SIM Card Verification</h2>
            <p className="text-sm text-gray-600 text-center mb-6">
              We'll verify your SIM card matches your identity to prevent SIM swap fraud
            </p>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-6 border border-indigo-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Detected Number</p>
                  <p className="text-xl font-bold text-gray-900">+255 712 345 678</p>
                </div>
                <CheckCircle className="size-8 text-green-600" />
              </div>
              <div className="space-y-2 text-xs text-gray-700">
                <div className="flex justify-between">
                  <span>Provider:</span>
                  <span className="font-semibold">Vodacom Tanzania</span>
                </div>
                <div className="flex justify-between">
                  <span>Registered:</span>
                  <span className="font-semibold">Jan 15, 2020</span>
                </div>
                <div className="flex justify-between">
                  <span>Last SIM Change:</span>
                  <span className="font-semibold text-green-600">Never</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2 text-sm">Security Checks</h3>
              <ul className="space-y-2 text-xs text-blue-800">
                <li className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-blue-600" />
                  <span>SIM registered to your NIDA</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-blue-600" />
                  <span>No recent SIM swaps detected</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-blue-600" />
                  <span>Phone number verified active</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={handleSIMVerification}
              className="w-full h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Verify SIM Card
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'review') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setCurrentStep('sim')} className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="size-6" />
              </button>
              <div className="flex-1">
                <h1 className="text-xl font-bold">Review & Submit</h1>
                <p className="text-xs text-gray-600">Final verification step</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Risk Score */}
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-xl flex items-center justify-center">
                <Shield className="size-8" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1">Risk Assessment</h2>
                <p className="text-sm text-white/90">AI-powered verification</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Risk Score</span>
                <span className="text-2xl font-bold">{verificationData.riskScore}/100</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full"
                  style={{ width: `${100 - verificationData.riskScore}%` }}
                />
              </div>
              <p className="text-xs text-white/80 mt-3">
                ✓ Low Risk • All checks passed • Ready for approval
              </p>
            </div>
          </div>

          {/* Verification Summary */}
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <h3 className="font-bold text-gray-900 mb-4">Verification Summary</h3>
            <div className="space-y-3">
              {[
                { label: 'NIDA Verification', status: 'Verified', icon: FileText },
                { label: 'Face Liveness Test', status: 'Passed', icon: Camera },
                { label: 'Address Confirmed', status: 'Verified', icon: MapPin },
                { label: 'SIM Card Match', status: 'Verified', icon: Smartphone }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Icon className="size-5 text-gray-600" />
                      <span className="font-medium text-gray-900">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="size-5 text-green-600" />
                      <span className="text-sm font-semibold text-green-700">{item.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Terms */}
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
            <p className="text-xs text-blue-800">
              By submitting, you confirm all information is accurate and you consent to KYC re-verification every 12 months as required by BoT regulations.
            </p>
          </div>

          <Button
            onClick={handleComplete}
            className="w-full h-14 rounded-full bg-green-600 hover:bg-green-700 text-white text-lg"
          >
            Submit for Verification
          </Button>
        </div>
      </div>
    );
  }

  // Complete
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <CheckCircle className="size-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Verification Complete!</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Your identity has been verified successfully. Your account is now fully compliant with Bank of Tanzania regulations.
        </p>
        <div className="bg-white rounded-3xl p-6 shadow-md mb-6">
          <p className="text-sm text-gray-600 mb-2">New Transaction Limits</p>
          <p className="text-4xl font-bold text-green-600 mb-1">TZS 10M</p>
          <p className="text-xs text-gray-500">Per day</p>
        </div>
        <p className="text-xs text-gray-500">
          Redirecting to dashboard...
        </p>
      </div>
    </div>
  );
}
