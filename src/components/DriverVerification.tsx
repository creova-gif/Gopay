import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { User } from '../App';
import {
  ArrowLeft,
  Shield,
  AlertCircle,
  Check,
  Upload,
  Camera,
  Loader2,
  MapPin,
  FileText
} from 'lucide-react';
import {
  VerifiedBadgeIcon,
  ShieldCheckIcon,
  IDCardIcon,
  ShareLocationIcon,
  FingerprintIcon,
  SafetyCheckIcon
} from './CustomIcons';
import { projectId } from '../utils/supabase/info';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DriverVerificationProps {
  user: User;
  accessToken: string;
  onBack: () => void;
  onVerified: () => void;
}

export function DriverVerification({
  user,
  accessToken,
  onBack,
  onVerified
}: DriverVerificationProps) {
  const [step, setStep] = useState<'intro' | 'nida' | 'documents' | 'location' | 'review'>('intro');
  const [nidaNumber, setNidaNumber] = useState('');
  const [nidaPhoto, setNidaPhoto] = useState<string | null>(null);
  const [drivingLicense, setDrivingLicense] = useState<string | null>(null);
  const [vehicleRegistration, setVehicleRegistration] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentUpload, setCurrentUpload] = useState<'nida' | 'license' | 'vehicle' | 'photo' | null>(null);

  // Vehicle details
  const [vehicleType, setVehicleType] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'nida' | 'license' | 'vehicle' | 'photo') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    setCurrentUpload(type);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/drivers/upload-document`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              document: base64,
              type,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          switch (type) {
            case 'nida':
              setNidaPhoto(data.url);
              break;
            case 'license':
              setDrivingLicense(data.url);
              break;
            case 'vehicle':
              setVehicleRegistration(data.url);
              break;
            case 'photo':
              setProfilePhoto(data.url);
              break;
          }
        } else {
          alert(data.error || 'Upload failed');
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setCurrentUpload(null);
    }
  };

  const requestLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationEnabled(true);
          alert('Location services enabled successfully!');
        },
        (error) => {
          let errorMessage = 'Please enable location services to continue';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please allow location access in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable. Please try again.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again.';
              break;
            default:
              errorMessage = 'Unable to get location. Please check your settings.';
          }
          
          console.warn('Location error:', errorMessage, error);
          alert(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      alert('Location services are not supported by your device');
    }
  };

  const submitVerification = async () => {
    setSubmitting(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/drivers/submit-verification`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nidaNumber,
            nidaPhoto,
            drivingLicense,
            vehicleRegistration,
            profilePhoto,
            vehicleType,
            vehiclePlate,
            vehicleColor,
            vehicleModel,
            vehicleYear,
            locationEnabled,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert('Verification submitted! We will review your documents within 24 hours.');
        onVerified();
      } else {
        alert(data.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Error submitting verification:', error);
      alert('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Intro Step
  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-20">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-xl font-bold">Become a Driver</h1>
          </div>
        </div>

        <div className="p-4 space-y-6 pt-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl mx-auto mb-4 flex items-center justify-center">
              <ShieldCheckIcon className="text-white" size={48} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Driver Verification</h2>
            <p className="text-gray-600">
              Complete the verification process to start earning with goPay
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-lg mb-4">Requirements</h3>

            <div className="flex items-start gap-3">
              <IDCardIcon className="text-green-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <p className="font-semibold">Valid NIDA Card</p>
                <p className="text-sm text-gray-600">
                  Government-issued National ID for identity verification
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="text-blue-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <p className="font-semibold">Driving License</p>
                <p className="text-sm text-gray-600">
                  Valid Tanzanian driving license
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="text-purple-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <p className="font-semibold">Vehicle Registration</p>
                <p className="text-sm text-gray-600">
                  Registration documents for your vehicle
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShareLocationIcon className="text-orange-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <p className="font-semibold">Location Services</p>
                <p className="text-sm text-gray-600">
                  Must be enabled at all times while driving
                </p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="size-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-900 mb-1">Safety Requirements</p>
                <p className="text-sm text-red-700">
                  All drivers must pass background checks and maintain active location services.
                  Failure to comply may result in account suspension.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setStep('nida')}
            className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl font-bold text-lg"
          >
            Start Verification
          </Button>
        </div>
      </div>
    );
  }

  // NIDA Step
  if (step === 'nida') {
    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setStep('intro')} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">NIDA Verification</h1>
              <p className="text-xs text-gray-500">Step 1 of 4</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <IDCardIcon className="text-blue-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <p className="font-bold text-blue-900 mb-1">Why NIDA?</p>
                <p className="text-sm text-blue-700">
                  NIDA verification ensures passenger safety by confirming your identity with the
                  National Identification Authority.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">NIDA Number</label>
            <input
              type="text"
              placeholder="XXXXXXXX-XXXXX-XXXXX-XX"
              value={nidaNumber}
              onChange={(e) => setNidaNumber(e.target.value)}
              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Upload NIDA Card Photo</label>
            <div
              onClick={() => {
                setCurrentUpload('nida');
                fileInputRef.current?.click();
              }}
              className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-green-500 transition-all"
            >
              {nidaPhoto ? (
                <div>
                  <ImageWithFallback src={nidaPhoto} alt="NIDA" className="max-h-40 mx-auto rounded-xl mb-3" />
                  <p className="text-sm text-green-600 font-semibold">✓ Uploaded</p>
                </div>
              ) : (
                <>
                  {uploading && currentUpload === 'nida' ? (
                    <Loader2 className="size-12 text-gray-400 mx-auto mb-3 animate-spin" />
                  ) : (
                    <Camera className="size-12 text-gray-400 mx-auto mb-3" />
                  )}
                  <p className="text-sm font-semibold text-gray-700">
                    {uploading && currentUpload === 'nida' ? 'Uploading...' : 'Take photo or upload'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Clear photo of your NIDA card
                  </p>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'nida')}
              className="hidden"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Profile Photo</label>
            <div
              onClick={() => {
                setCurrentUpload('photo');
                fileInputRef.current?.click();
              }}
              className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-green-500 transition-all"
            >
              {profilePhoto ? (
                <div>
                  <ImageWithFallback src={profilePhoto} alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-3 object-cover" />
                  <p className="text-sm text-green-600 font-semibold">✓ Uploaded</p>
                </div>
              ) : (
                <>
                  {uploading && currentUpload === 'photo' ? (
                    <Loader2 className="size-12 text-gray-400 mx-auto mb-3 animate-spin" />
                  ) : (
                    <Camera className="size-12 text-gray-400 mx-auto mb-3" />
                  )}
                  <p className="text-sm font-semibold text-gray-700">
                    {uploading && currentUpload === 'photo' ? 'Uploading...' : 'Upload profile photo'}
                  </p>
                </>
              )}
            </div>
          </div>

          <Button
            onClick={() => setStep('documents')}
            disabled={!nidaNumber || !nidaPhoto || !profilePhoto}
            className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold disabled:opacity-50"
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  // Documents Step
  if (step === 'documents') {
    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setStep('nida')} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">Vehicle Documents</h1>
              <p className="text-xs text-gray-500">Step 2 of 4</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2">Driving License</label>
            <div
              onClick={() => {
                setCurrentUpload('license');
                fileInputRef.current?.click();
              }}
              className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-green-500 transition-all"
            >
              {drivingLicense ? (
                <div>
                  <ImageWithFallback src={drivingLicense} alt="License" className="max-h-40 mx-auto rounded-xl mb-3" />
                  <p className="text-sm text-green-600 font-semibold">✓ Uploaded</p>
                </div>
              ) : (
                <>
                  {uploading && currentUpload === 'license' ? (
                    <Loader2 className="size-12 text-gray-400 mx-auto mb-3 animate-spin" />
                  ) : (
                    <Upload className="size-12 text-gray-400 mx-auto mb-3" />
                  )}
                  <p className="text-sm font-semibold text-gray-700">Upload driving license</p>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Vehicle Registration</label>
            <div
              onClick={() => {
                setCurrentUpload('vehicle');
                fileInputRef.current?.click();
              }}
              className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-green-500 transition-all"
            >
              {vehicleRegistration ? (
                <div>
                  <ImageWithFallback src={vehicleRegistration} alt="Registration" className="max-h-40 mx-auto rounded-xl mb-3" />
                  <p className="text-sm text-green-600 font-semibold">✓ Uploaded</p>
                </div>
              ) : (
                <>
                  {uploading && currentUpload === 'vehicle' ? (
                    <Loader2 className="size-12 text-gray-400 mx-auto mb-3 animate-spin" />
                  ) : (
                    <Upload className="size-12 text-gray-400 mx-auto mb-3" />
                  )}
                  <p className="text-sm font-semibold text-gray-700">Upload registration</p>
                </>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold">Vehicle Details</h3>
            
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
            >
              <option value="">Select vehicle type</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Motorcycle">Motorcycle (Boda Boda)</option>
              <option value="Van">Van</option>
            </select>

            <input
              type="text"
              placeholder="Plate Number (e.g., T 123 ABC)"
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
            />

            <input
              type="text"
              placeholder="Vehicle Model"
              value={vehicleModel}
              onChange={(e) => setVehicleModel(e.target.value)}
              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Year"
                value={vehicleYear}
                onChange={(e) => setVehicleYear(e.target.value)}
                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Color"
                value={vehicleColor}
                onChange={(e) => setVehicleColor(e.target.value)}
                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
              />
            </div>
          </div>

          <Button
            onClick={() => setStep('location')}
            disabled={!drivingLicense || !vehicleRegistration || !vehicleType || !vehiclePlate || !vehicleColor}
            className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold disabled:opacity-50"
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  // Location Step
  if (step === 'location') {
    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setStep('documents')} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">Location Services</h1>
              <p className="text-xs text-gray-500">Step 3 of 4</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          <div className="text-center py-8">
            <ShareLocationIcon className="text-green-600 mx-auto mb-4" size={80} />
            <h2 className="text-2xl font-bold mb-2">Enable Location</h2>
            <p className="text-gray-600">
              Location services must be active at all times while you're online as a driver
            </p>
          </div>

          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="size-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-900 mb-1">Required for Safety</p>
                <p className="text-sm text-red-700">
                  Always-on location tracking ensures passenger safety and enables emergency
                  response. Turning off location will automatically make you unavailable for rides.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
            <h3 className="font-bold mb-4">How It Works</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">Real-time tracking for passenger safety</p>
              </li>
              <li className="flex items-start gap-3">
                <Check className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">Emergency SOS integration</p>
              </li>
              <li className="flex items-start gap-3">
                <Check className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">Trip verification and route optimization</p>
              </li>
              <li className="flex items-start gap-3">
                <Check className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">Data encrypted and privacy-protected</p>
              </li>
            </ul>
          </div>

          {locationEnabled ? (
            <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-4 text-center">
              <Check className="size-12 text-green-600 mx-auto mb-2" />
              <p className="font-bold text-green-900">Location Enabled!</p>
            </div>
          ) : (
            <Button
              onClick={requestLocation}
              className="w-full h-14 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold text-lg"
            >
              <MapPin className="size-6 mr-2" />
              Enable Location Services
            </Button>
          )}

          {locationEnabled && (
            <Button
              onClick={() => setStep('review')}
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold"
            >
              Continue to Review
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Review Step
  if (step === 'review') {
    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setStep('location')} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">Review & Submit</h1>
              <p className="text-xs text-gray-500">Step 4 of 4</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 text-center">
            <SafetyCheckIcon className="text-green-600 mx-auto mb-3" size={48} />
            <h2 className="text-xl font-bold mb-2">Almost Done!</h2>
            <p className="text-sm text-gray-600">
              Review your information before submitting
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <IDCardIcon className="text-green-600" size={20} />
                <h3 className="font-bold">Identity Verification</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">NIDA Number:</span>
                  <span className="font-mono font-semibold">{nidaNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">NIDA Photo:</span>
                  <span className="text-green-600">✓ Uploaded</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Profile Photo:</span>
                  <span className="text-green-600">✓ Uploaded</span>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="text-blue-600" size={20} />
                <h3 className="font-bold">Documents</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Driving License:</span>
                  <span className="text-green-600">✓ Uploaded</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehicle Registration:</span>
                  <span className="text-green-600">✓ Uploaded</span>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="text-purple-600" size={20} />
                <h3 className="font-bold">Vehicle Information</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-semibold">{vehicleType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Plate:</span>
                  <span className="font-semibold">{vehiclePlate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Model:</span>
                  <span className="font-semibold">{vehicleModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year:</span>
                  <span className="font-semibold">{vehicleYear}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Color:</span>
                  <span className="font-semibold">{vehicleColor}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <ShareLocationIcon className="text-orange-600" size={20} />
                <h3 className="font-bold">Location Services</h3>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <span className="text-green-600 font-semibold">✓ Enabled</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-900">
              <strong>What happens next?</strong> Our team will review your documents within 24
              hours. You'll receive a notification once approved.
            </p>
          </div>

          <Button
            onClick={submitVerification}
            disabled={submitting}
            className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl font-bold text-lg disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="size-6 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit for Verification'
            )}
          </Button>
        </div>
      </div>
    );
  }

  return null;
}