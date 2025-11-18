import { ArrowLeft, AlertTriangle, Phone, MapPin, Users, Share2, Shield, Clock, Navigation, Heart, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';

interface EmergencySOSPageProps {
  onBack: () => void;
}

export function EmergencySOSPage({ onBack }: EmergencySOSPageProps) {
  const [sosActive, setSosActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [locationSharing, setLocationSharing] = useState(false);
  const [trustedContacts, setTrustedContacts] = useState([
    { id: '1', name: 'John Mwaura', phone: '+255 712 345 678', status: 'notified' },
    { id: '2', name: 'Sarah Kamau', phone: '+255 754 321 987', status: 'notified' }
  ]);

  const emergencyServices = [
    {
      id: 'police',
      name: 'Police',
      number: '112',
      icon: Shield,
      color: 'from-blue-600 to-blue-700',
      description: 'Emergency police assistance'
    },
    {
      id: 'ambulance',
      name: 'Ambulance',
      number: '114',
      icon: Heart,
      color: 'from-red-600 to-red-700',
      description: 'Medical emergency'
    },
    {
      id: 'fire',
      name: 'Fire Brigade',
      number: '115',
      icon: AlertTriangle,
      color: 'from-orange-600 to-orange-700',
      description: 'Fire emergency'
    }
  ];

  const handleActivateSOS = () => {
    setSosActive(true);
    setLocationSharing(true);
    setCountdown(5);

    // Simulate countdown
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          // Alert would be sent here
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCancelSOS = () => {
    setSosActive(false);
    setLocationSharing(false);
    setCountdown(5);
  };

  const handleCallEmergency = (number: string) => {
    // In real app, would initiate call
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="size-6 text-gray-900" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Emergency SOS</h1>
              <p className="text-sm text-gray-600">Quick access to emergency services</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6 pb-24">
        {/* SOS Activation */}
        {!sosActive ? (
          <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
            <div className="bg-red-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="size-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Emergency SOS</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Press and hold the button below to activate emergency mode. Your location will be shared with trusted contacts and emergency services.
            </p>

            <button
              onMouseDown={handleActivateSOS}
              onTouchStart={handleActivateSOS}
              className="w-40 h-40 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-full flex items-center justify-center mx-auto shadow-2xl active:scale-95 transition-all"
            >
              <div className="text-center">
                <AlertTriangle className="size-16 text-white mx-auto mb-2" />
                <p className="text-white font-bold">HOLD FOR SOS</p>
              </div>
            </button>

            <p className="text-xs text-gray-500 mt-6">
              Hold for 3 seconds to activate
            </p>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-red-600 to-red-700 text-white rounded-3xl p-8 shadow-2xl animate-pulse">
            <div className="text-center">
              <AlertTriangle className="size-20 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">SOS ACTIVATED</h2>
              <p className="text-2xl font-bold mb-2">{countdown > 0 ? countdown : 'ALERT SENT'}</p>
              <p className="text-sm opacity-90 mb-6">
                {countdown > 0 ? 'Sending alert in...' : 'Emergency contacts notified'}
              </p>

              {countdown > 0 && (
                <Button
                  onClick={handleCancelSOS}
                  className="bg-white text-red-600 hover:bg-gray-100 h-14 rounded-full font-bold px-8"
                >
                  CANCEL
                </Button>
              )}

              {countdown === 0 && (
                <div className="space-y-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                    <p className="text-sm font-semibold mb-2">Location Shared With:</p>
                    <ul className="space-y-1 text-sm">
                      {trustedContacts.map(contact => (
                        <li key={contact.id} className="flex items-center justify-between">
                          <span>{contact.name}</span>
                          <span className="text-green-300">✓ Notified</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    onClick={handleCancelSOS}
                    variant="outline"
                    className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 h-12 rounded-full"
                  >
                    I'm Safe - Turn Off SOS
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Live Location Sharing */}
        <div className="bg-white rounded-3xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center">
                <MapPin className="size-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Live Location</h3>
                <p className="text-sm text-gray-600">Share your real-time location</p>
              </div>
            </div>
            <button
              onClick={() => setLocationSharing(!locationSharing)}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                locationSharing ? 'bg-green-600' : 'bg-gray-300'
              }`}
              role="switch"
              aria-checked={locationSharing}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  locationSharing ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {locationSharing && (
            <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                <p className="text-sm font-semibold text-green-900">Location Sharing Active</p>
              </div>
              <p className="text-xs text-green-800">
                Your location is being shared with {trustedContacts.length} trusted contacts
              </p>
            </div>
          )}
        </div>

        {/* Emergency Services */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Emergency Services</h2>
          <div className="space-y-3">
            {emergencyServices.map(service => {
              const IconComponent = service.icon;
              return (
                <button
                  key={service.id}
                  onClick={() => handleCallEmergency(service.number)}
                  className="w-full bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`bg-gradient-to-br ${service.color} w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="size-7 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{service.name}</h3>
                      <p className="text-sm text-gray-600">{service.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{service.number}</p>
                      <p className="text-xs text-gray-600">Tap to call</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Trusted Contacts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Trusted Contacts</h2>
            <Button className="bg-green-600 hover:bg-green-700 text-white h-10 rounded-full px-6 text-sm">
              Add Contact
            </Button>
          </div>

          <div className="space-y-3">
            {trustedContacts.map(contact => (
              <div
                key={contact.id}
                className="bg-white rounded-2xl p-4 shadow-md flex items-center gap-4"
              >
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {contact.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                  <p className="text-sm text-gray-600">{contact.phone}</p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Phone className="size-5 text-gray-600" />
                </button>
              </div>
            ))}

            {trustedContacts.length === 0 && (
              <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 text-center">
                <Users className="size-12 text-amber-600 mx-auto mb-3" />
                <p className="text-amber-900 font-semibold mb-2">No Trusted Contacts</p>
                <p className="text-sm text-amber-800">
                  Add emergency contacts who will be notified if you activate SOS
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all text-left">
              <Share2 className="size-6 text-blue-600 mb-2" />
              <p className="font-semibold text-gray-900 text-sm">Share My Location</p>
            </button>
            <button className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all text-left">
              <MessageCircle className="size-6 text-green-600 mb-2" />
              <p className="font-semibold text-gray-900 text-sm">Send SMS Alert</p>
            </button>
          </div>
        </div>

        {/* Safety Tips */}
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Shield className="size-5" />
            Safety Tips
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Hold the SOS button for 3 seconds to activate emergency mode</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Your location will be shared automatically with trusted contacts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Emergency services can be called even without airtime</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>False alarms can be cancelled within 5 seconds</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
