import { useState, useEffect } from 'react';
import { X, Users, Share2, Copy, Check, Mail, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { projectId } from '../utils/supabase/info';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  autoShareRides: boolean;
}

interface Ride {
  id: string;
  pickup: string;
  dropoff: string;
  fare: number;
  driverName: string;
  vehiclePlate: string;
  estimatedArrival: string;
}

interface ShareRideProps {
  ride: Ride;
  accessToken: string;
  onClose: () => void;
}

export function ShareRide({ ride, accessToken, onClose }: ShareRideProps) {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadContacts();
    generateShareLink();
  }, []);

  const loadContacts = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/user/emergency-contacts`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const contactsList = data.contacts || [];
        setContacts(contactsList);
        
        // Auto-select contacts with autoShareRides enabled
        const autoSelected = new Set(
          contactsList
            .filter((c: EmergencyContact) => c.autoShareRides)
            .map((c: EmergencyContact) => c.id)
        );
        setSelectedContacts(autoSelected);
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateShareLink = () => {
    const link = `https://gopay.tz/track/${ride.id}?key=${btoa(ride.id + Date.now())}`;
    setShareLink(link);
  };

  const toggleContact = (id: string) => {
    const newSelected = new Set(selectedContacts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedContacts(newSelected);
  };

  const shareRide = async () => {
    if (selectedContacts.size === 0) {
      alert('Please select at least one contact');
      return;
    }

    setSharing(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/rides/${ride.id}/share`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contactIds: Array.from(selectedContacts),
            shareLink,
          }),
        }
      );

      if (response.ok) {
        alert('Ride shared successfully!');
        onClose();
      } else {
        throw new Error('Failed to share ride');
      }
    } catch (error) {
      console.error('Error sharing ride:', error);
      alert('Failed to share ride. Please try again.');
    } finally {
      setSharing(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaWhatsApp = () => {
    const message = encodeURIComponent(
      `🚗 I'm taking a ride with goPay\n\n` +
      `From: ${ride.pickup}\n` +
      `To: ${ride.dropoff}\n` +
      `Driver: ${ride.driverName}\n` +
      `Vehicle: ${ride.vehiclePlate}\n` +
      `ETA: ${ride.estimatedArrival}\n\n` +
      `Track my ride: ${shareLink}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const shareViaSMS = () => {
    const message = encodeURIComponent(
      `I'm taking a ride with goPay. Track: ${shareLink}`
    );
    window.location.href = `sms:?body=${message}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Share2 className="size-5 text-green-600" />
            </div>
            <div>
              <h2 className="font-bold">Share Ride</h2>
              <p className="text-xs text-gray-500">Real-time tracking</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-all">
            <X className="size-6" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Ride Details */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
            <h3 className="font-bold mb-3">Ride Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">From:</span>
                <span className="font-semibold text-right">{ride.pickup}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">To:</span>
                <span className="font-semibold text-right">{ride.dropoff}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Driver:</span>
                <span className="font-semibold">{ride.driverName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vehicle:</span>
                <span className="font-semibold">{ride.vehiclePlate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ETA:</span>
                <span className="font-semibold">{ride.estimatedArrival}</span>
              </div>
            </div>
          </div>

          {/* Emergency Contacts */}
          {loading ? (
            <div className="text-center py-4 text-gray-500">Loading contacts...</div>
          ) : contacts.length === 0 ? (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <Users className="size-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-blue-900 mb-1">No Emergency Contacts</p>
              <p className="text-xs text-blue-700">
                Add emergency contacts in settings to share rides with them
              </p>
            </div>
          ) : (
            <div>
              <h3 className="font-bold mb-3">Share with Emergency Contacts</h3>
              <div className="space-y-2">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => toggleContact(contact.id)}
                    className={`border-2 rounded-xl p-3 cursor-pointer transition-all ${
                      selectedContacts.has(contact.id)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedContacts.has(contact.id)}
                        onChange={() => toggleContact(contact.id)}
                        className="w-5 h-5 accent-green-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{contact.name}</p>
                          {contact.autoShareRides && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              Auto
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{contact.phone}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Share Link */}
          <div>
            <h3 className="font-bold mb-3">Share Link</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 h-12 px-4 border-2 border-gray-200 rounded-xl bg-gray-50 text-sm"
              />
              <button
                onClick={copyLink}
                className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all"
              >
                {copied ? (
                  <Check className="size-5 text-green-600" />
                ) : (
                  <Copy className="size-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Share via Apps */}
          <div>
            <h3 className="font-bold mb-3">Share via</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={shareViaWhatsApp}
                className="h-12 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <MessageSquare className="size-5" />
                WhatsApp
              </button>
              <button
                onClick={shareViaSMS}
                className="h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Mail className="size-5" />
                SMS
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-900">
              <strong>Real-time tracking:</strong> Selected contacts will receive a link to track
              your ride in real-time until you reach your destination.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 h-12 rounded-xl font-semibold"
            >
              Cancel
            </Button>
            <Button
              onClick={shareRide}
              disabled={sharing || selectedContacts.size === 0}
              className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold disabled:opacity-50"
            >
              {sharing ? 'Sharing...' : `Share with ${selectedContacts.size}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
