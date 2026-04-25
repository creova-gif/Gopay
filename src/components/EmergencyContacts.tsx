import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Edit2, Trash2, Phone, Mail, Users, Shield, Check, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { projectId } from '../utils/supabase/info';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  relationship: string;
  isPrimary: boolean;
  autoShareRides: boolean;
}

interface EmergencyContactsProps {
  accessToken: string;
  onBack: () => void;
}

export function EmergencyContacts({ accessToken, onBack }: EmergencyContactsProps) {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRelationship, setFormRelationship] = useState('');
  const [formAutoShare, setFormAutoShare] = useState(true);

  const relationships = [
    'Spouse',
    'Parent',
    'Child',
    'Sibling',
    'Friend',
    'Partner',
    'Colleague',
    'Other'
  ];

  useEffect(() => {
    loadContacts();
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
        setContacts(data.contacts || []);
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveContact = async () => {
    if (!formName || !formPhone) {
      toast.error('Name and phone are required');
      return;
    }

    const newContact: EmergencyContact = {
      id: editingId || Date.now().toString(),
      name: formName,
      phone: formPhone,
      email: formEmail,
      relationship: formRelationship,
      isPrimary: contacts.length === 0,
      autoShareRides: formAutoShare
    };

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/user/emergency-contacts`,
        {
          method: editingId ? 'PUT' : 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ contact: newContact }),
        }
      );

      if (response.ok) {
        await loadContacts();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving contact:', error);
      toast.error('Failed to save contact');
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm('Remove this emergency contact?')) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/user/emergency-contacts/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        await loadContacts();
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const editContact = (contact: EmergencyContact) => {
    setEditingId(contact.id);
    setFormName(contact.name);
    setFormPhone(contact.phone);
    setFormEmail(contact.email || '');
    setFormRelationship(contact.relationship);
    setFormAutoShare(contact.autoShareRides);
    setShowAddForm(true);
  };

  const setPrimaryContact = async (id: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/user/emergency-contacts/${id}/set-primary`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        await loadContacts();
      }
    } catch (error) {
      console.error('Error setting primary contact:', error);
    }
  };

  const resetForm = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormName('');
    setFormPhone('');
    setFormEmail('');
    setFormRelationship('');
    setFormAutoShare(true);
  };

  if (showAddForm) {
    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-xl font-bold">{editingId ? 'Edit Contact' : 'Add Emergency Contact'}</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Shield className="size-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-blue-900 mb-1">Emergency Contact</p>
                <p className="text-sm text-blue-700">
                  This person can be notified during emergencies and track your rides in real-time.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Full Name *</label>
            <input
              type="text"
              placeholder="John Doe"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Phone Number *</label>
            <input
              type="tel"
              placeholder="+255 XXX XXX XXX"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Email (Optional)</label>
            <input
              type="email"
              placeholder="john@example.com"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Relationship</label>
            <select
              value={formRelationship}
              onChange={(e) => setFormRelationship(e.target.value)}
              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
            >
              <option value="">Select relationship</option>
              {relationships.map((rel) => (
                <option key={rel} value={rel}>
                  {rel}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="autoShare"
                checked={formAutoShare}
                onChange={(e) => setFormAutoShare(e.target.checked)}
                className="w-5 h-5 mt-0.5 accent-green-600"
              />
              <label htmlFor="autoShare" className="flex-1">
                <p className="font-bold mb-1">Auto-share rides</p>
                <p className="text-sm text-gray-600">
                  Automatically share ride details with this contact when you book a ride
                </p>
              </label>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="size-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-orange-800">
                Emergency contacts will receive SMS notifications with your location during SOS alerts.
              </p>
            </div>
          </div>

          <Button
            onClick={saveContact}
            disabled={!formName || !formPhone}
            className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold disabled:opacity-50"
          >
            <Check className="size-5 mr-2" />
            {editingId ? 'Update Contact' : 'Add Contact'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-all">
            <ArrowLeft className="size-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Emergency Contacts</h1>
            <p className="text-xs text-gray-500">{contacts.length} contact{contacts.length !== 1 ? 's' : ''} added</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <Shield className="size-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-red-900 mb-1">Safety First</h3>
              <p className="text-sm text-red-700">
                Emergency contacts receive your real-time location during SOS alerts and can track shared rides.
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading contacts...</div>
        ) : (
          <>
            {contacts.length === 0 ? (
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 text-center">
                <Users className="size-12 text-gray-400 mx-auto mb-3" />
                <h3 className="font-bold mb-2">No Emergency Contacts</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Add trusted contacts for enhanced safety
                </p>
              </div>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`bg-white border-2 rounded-2xl p-4 ${
                    contact.isPrimary ? 'border-green-500' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="size-6 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold">{contact.name}</h3>
                        {contact.isPrimary && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                            Primary
                          </span>
                        )}
                      </div>
                      {contact.relationship && (
                        <p className="text-sm text-gray-600 mb-2">{contact.relationship}</p>
                      )}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="size-4 text-gray-400" />
                          <span className="text-gray-700">{contact.phone}</span>
                        </div>
                        {contact.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="size-4 text-gray-400" />
                            <span className="text-gray-700">{contact.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {contact.autoShareRides && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-3">
                      <p className="text-xs text-blue-700">
                        ✓ Auto-sharing rides with this contact
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {!contact.isPrimary && (
                      <Button
                        onClick={() => setPrimaryContact(contact.id)}
                        variant="outline"
                        className="flex-1 h-10 text-sm"
                      >
                        Set as Primary
                      </Button>
                    )}
                    <button
                      onClick={() => editContact(contact)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                    >
                      <Edit2 className="size-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => deleteContact(contact.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-all"
                    >
                      <Trash2 className="size-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        <Button
          onClick={() => setShowAddForm(true)}
          className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold"
        >
          <Plus className="size-5 mr-2" />
          Add Emergency Contact
        </Button>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
          <h3 className="font-bold text-green-900 mb-2">How It Works</h3>
          <ul className="space-y-1 text-sm text-green-800">
            <li>• Real-time ride tracking for shared trips</li>
            <li>• SMS alerts during SOS emergencies</li>
            <li>• Automatic notifications when enabled</li>
            <li>• Secure and encrypted data</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
