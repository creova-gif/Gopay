import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { User } from '../App';
import {
  ArrowLeft,
  Shield,
  AlertCircle,
  Clock,
  Check,
  X,
  Copy,
  Users,
  Phone,
  MessageCircle,
  Camera
} from 'lucide-react';
import {
  VerifiedBadgeIcon,
  ShieldCheckIcon,
  PasscodeIcon,
  SOSIcon,
  ShareLocationIcon,
  LiveTrackingIcon,
  StarRatingIcon,
  IDCardIcon
} from './CustomIcons';
import { projectId } from '../utils/supabase/info';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface RideVerificationProps {
  user: User;
  accessToken: string;
  rideId: string;
  onBack: () => void;
  onVerified: () => void;
}

interface Driver {
  id: string;
  name: string;
  photo: string;
  rating: number;
  totalRides: number;
  vehicleType: string;
  vehiclePlate: string;
  vehicleColor: string;
  nidaVerified: boolean;
  locationEnabled: boolean;
  passcode: string;
}

export function RideVerification({
  user,
  accessToken,
  rideId,
  onBack,
  onVerified
}: RideVerificationProps) {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [passcode, setPasscode] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [sharingLocation, setSharingLocation] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState<string[]>([]);

  useEffect(() => {
    fetchRideDetails();
  }, []);

  const fetchRideDetails = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/rides/verification/${rideId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDriver(data.driver);
        setEmergencyContacts(data.emergencyContacts || []);
      }
    } catch (error) {
      console.error('Error fetching ride details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasscodeInput = (index: number, value: string) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const newPasscode = [...passcode];
    newPasscode[index] = value;
    setPasscode(newPasscode);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`passcode-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-verify when all 4 digits entered
    if (newPasscode.every(digit => digit !== '') && index === 3) {
      verifyPasscode(newPasscode.join(''));
    }
  };

  const verifyPasscode = async (code: string) => {
    setVerifying(true);
    setError('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/rides/verify-passcode`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            rideId,
            passcode: code,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        onVerified();
      } else {
        setError(data.error || 'Invalid passcode. Please try again.');
        setPasscode(['', '', '', '']);
        document.getElementById('passcode-0')?.focus();
      }
    } catch (error) {
      console.error('Error verifying passcode:', error);
      setError('Verification failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const shareLocation = async () => {
    setSharingLocation(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/rides/share-location`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            rideId,
            contacts: emergencyContacts,
          }),
        }
      );

      if (response.ok) {
        alert('Location shared with your trusted contacts');
      }
    } catch (error) {
      console.error('Error sharing location:', error);
    } finally {
      setSharingLocation(false);
    }
  };

  const handleSOS = async () => {
    if (confirm('Are you sure you want to send an SOS alert? This will notify emergency services and your trusted contacts.')) {
      try {
        await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/rides/sos`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              rideId,
              userId: user.id,
            }),
          }
        );
        alert('SOS alert sent! Help is on the way.');
      } catch (error) {
        console.error('Error sending SOS:', error);
      }
    }
  };

  const copyPasscode = () => {
    if (driver) {
      navigator.clipboard.writeText(driver.passcode);
      alert('Passcode copied!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading verification...</p>
        </div>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="size-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Unable to load ride details</p>
          <Button onClick={onBack} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-all"
          >
            <ArrowLeft className="size-6" />
          </button>
          <h1 className="text-xl font-bold">Verify Your Ride</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Safety Alert */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <ShieldCheckIcon className="size-6 text-red-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <p className="font-bold text-red-900 mb-1">Safety First!</p>
              <p className="text-sm text-red-700">
                Always verify the driver's identity and passcode before entering the vehicle.
              </p>
            </div>
          </div>
        </div>

        {/* Driver Information */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="relative">
              {driver.photo ? (
                <ImageWithFallback
                  src={driver.photo}
                  alt={driver.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl text-white font-bold">
                    {driver.name.charAt(0)}
                  </span>
                </div>
              )}
              {driver.nidaVerified && (
                <div className="absolute -bottom-1 -right-1 bg-green-600 rounded-full p-1">
                  <VerifiedBadgeIcon className="text-white" size={16} />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold">{driver.name}</h2>
                {driver.nidaVerified && (
                  <VerifiedBadgeIcon className="text-green-600" size={20} />
                )}
              </div>

              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <StarRatingIcon
                    key={i}
                    size={16}
                    filled={i < Math.floor(driver.rating)}
                    className={i < Math.floor(driver.rating) ? 'text-yellow-500' : 'text-gray-300'}
                  />
                ))}
                <span className="text-sm font-semibold ml-1">
                  {driver.rating.toFixed(1)}
                </span>
                <span className="text-sm text-gray-500">
                  ({driver.totalRides} rides)
                </span>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <IDCardIcon size={16} className="text-gray-400" />
                  <span className={driver.nidaVerified ? 'text-green-700 font-semibold' : 'text-red-600'}>
                    {driver.nidaVerified ? 'NIDA Verified ✓' : 'Not Verified ✗'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ShareLocationIcon size={16} className="text-gray-400" />
                  <span className={driver.locationEnabled ? 'text-green-700 font-semibold' : 'text-red-600'}>
                    {driver.locationEnabled ? 'Location Active ✓' : 'Location Off ✗'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="border-t-2 border-gray-100 pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Vehicle Type</span>
              <span className="font-semibold">{driver.vehicleType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Plate Number</span>
              <span className="font-bold text-lg tracking-wider">{driver.vehiclePlate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Color</span>
              <span className="font-semibold">{driver.vehicleColor}</span>
            </div>
          </div>
        </div>

        {/* Verification Checks */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
          <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
            <Shield className="size-5" />
            Verification Checklist
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${driver.nidaVerified ? 'bg-green-600' : 'bg-red-600'}`}>
                {driver.nidaVerified ? (
                  <Check className="size-3 text-white" />
                ) : (
                  <X className="size-3 text-white" />
                )}
              </div>
              <span className="text-gray-700">Driver NIDA verified</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${driver.locationEnabled ? 'bg-green-600' : 'bg-red-600'}`}>
                {driver.locationEnabled ? (
                  <Check className="size-3 text-white" />
                ) : (
                  <X className="size-3 text-white" />
                )}
              </div>
              <span className="text-gray-700">Location services active</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${driver.rating >= 4.5 ? 'bg-green-600' : 'bg-yellow-600'}`}>
                <Check className="size-3 text-white" />
              </div>
              <span className="text-gray-700">High rating ({driver.rating.toFixed(1)}/5.0)</span>
            </div>
          </div>
        </div>

        {/* Passcode Verification */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <PasscodeIcon className="text-green-600" size={32} />
            <div>
              <h3 className="font-bold text-lg">Enter Verification Code</h3>
              <p className="text-sm text-gray-600">Ask the driver for the 4-digit code</p>
            </div>
          </div>

          {/* Passcode Input */}
          <div className="flex gap-3 justify-center mb-4">
            {passcode.map((digit, index) => (
              <input
                key={index}
                id={`passcode-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handlePasscodeInput(index, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && !digit && index > 0) {
                    document.getElementById(`passcode-${index - 1}`)?.focus();
                  }
                }}
                disabled={verifying}
                className="w-16 h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none disabled:bg-gray-100"
              />
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
              <p className="text-sm text-red-700 text-center">{error}</p>
            </div>
          )}

          {verifying && (
            <div className="text-center text-sm text-gray-600">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
              Verifying...
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mt-4">
            <p className="text-xs text-yellow-800">
              <strong>For testing:</strong> Driver's passcode is{' '}
              <span className="font-mono font-bold">{driver.passcode}</span>
              <button
                onClick={copyPasscode}
                className="ml-2 text-yellow-900 underline"
              >
                Copy
              </button>
            </p>
          </div>
        </div>

        {/* Safety Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={shareLocation}
            disabled={sharingLocation}
            className="bg-blue-600 text-white rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            <ShareLocationIcon size={24} />
            <span className="text-sm font-semibold">
              {sharingLocation ? 'Sharing...' : 'Share Trip'}
            </span>
          </button>

          <button
            onClick={handleSOS}
            className="bg-red-600 text-white rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-red-700 transition-all"
          >
            <SOSIcon size={24} />
            <span className="text-sm font-semibold">Emergency SOS</span>
          </button>
        </div>

        {/* Contact Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-center gap-2 hover:border-gray-300 transition-all">
            <Phone className="size-5 text-gray-700" />
            <span className="font-semibold text-gray-700">Call Driver</span>
          </button>

          <button className="bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-center gap-2 hover:border-gray-300 transition-all">
            <MessageCircle className="size-5 text-gray-700" />
            <span className="font-semibold text-gray-700">Message</span>
          </button>
        </div>

        {/* Live Tracking Notice */}
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <LiveTrackingIcon className="size-6 text-green-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <p className="font-bold text-green-900 mb-1">Live Tracking Active</p>
              <p className="text-sm text-green-700">
                Your ride is being tracked in real-time. Location data is encrypted and only
                shared with your emergency contacts if requested.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
