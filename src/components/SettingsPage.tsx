import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { User } from '../App';
import { 
  ArrowLeft, Camera, User as UserIcon, Mail, Phone, MapPin, ChevronRight,
  Check, Upload, X, Loader2, Home, Shield, Bell, Eye, Moon, Sun, Globe,
  Volume2, VolumeX, Smartphone, Lock, Users, HelpCircle, FileText, 
  MessageCircle, Settings, Palette, Heart, AlertCircle, Edit, Plus,
  Trash2, Search, Zap, Type, Contrast, BookOpen
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SettingsPageProps {
  user: User;
  accessToken: string;
  onBack: () => void;
  onUpdateUser: (user: User) => void;
}

type SettingsView = 'main' | 'profile' | 'addresses' | 'accessibility' | 'appearance' | 'safety' | 'trusted-contacts' | 'notifications' | 'privacy' | 'help' | 'about';

interface SavedAddress {
  id: string;
  label: string;
  address: string;
  isDefault: boolean;
}

interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export function SettingsPage({ user, accessToken, onBack, onUpdateUser }: SettingsPageProps) {
  const [currentView, setCurrentView] = useState<SettingsView>('main');
  
  // Profile states
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email || '');
  const [profilePhoto, setProfilePhoto] = useState(user.profilePhoto || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Address states
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [newAddress, setNewAddress] = useState({ label: '', address: '' });
  const [editingAddress, setEditingAddress] = useState<string | null>(null);

  // Accessibility states
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [highContrast, setHighContrast] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [boldText, setBoldText] = useState(false);

  // Appearance states
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');
  const [colorScheme, setColorScheme] = useState<'green' | 'blue' | 'purple'>('green');
  const [compactMode, setCompactMode] = useState(false);

  // Safety states
  const [autoLock, setAutoLock] = useState<'1min' | '5min' | '15min' | 'never'>('5min');
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [shareLocation, setShareLocation] = useState(true);
  const [emergencySharing, setEmergencySharing] = useState(true);

  // Trusted contacts
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([]);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });

  // Notification states
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [transactionAlerts, setTransactionAlerts] = useState(true);
  const [promotionalOffers, setPromotionalOffers] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/profile/settings`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.addresses) setAddresses(data.addresses);
        if (data.trustedContacts) setTrustedContacts(data.trustedContacts);
        if (data.preferences) {
          const prefs = data.preferences;
          if (prefs.fontSize) setFontSize(prefs.fontSize);
          if (prefs.theme) setTheme(prefs.theme);
          if (prefs.autoLock) setAutoLock(prefs.autoLock);
          // ... load other preferences
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (settings: any) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/profile/settings`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(settings),
        }
      );

      if (response.ok) {
        return true;
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
    return false;
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/profile/upload-photo`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ photo: base64 }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          setProfilePhoto(data.photoUrl);
        } else {
          toast.error(data.error || 'Upload failed');
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/profile/update`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            profilePhoto,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        onUpdateUser({
          ...user,
          name,
          email,
          profilePhoto,
        });
        toast.success('Profile updated successfully!');
        setCurrentView('main');
      } else {
        toast.error(data.error || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Update failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addAddress = async () => {
    if (!newAddress.label || !newAddress.address) {
      toast.error('Please fill in all fields');
      return;
    }

    const address: SavedAddress = {
      id: Date.now().toString(),
      ...newAddress,
      isDefault: addresses.length === 0,
    };

    const updated = [...addresses, address];
    setAddresses(updated);
    await saveSettings({ addresses: updated });
    setNewAddress({ label: '', address: '' });
  };

  const removeAddress = async (id: string) => {
    const updated = addresses.filter(a => a.id !== id);
    setAddresses(updated);
    await saveSettings({ addresses: updated });
  };

  const setDefaultAddress = async (id: string) => {
    const updated = addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    }));
    setAddresses(updated);
    await saveSettings({ addresses: updated });
  };

  const addTrustedContact = async () => {
    if (!newContact.name || !newContact.phone) {
      toast.error('Please fill in name and phone');
      return;
    }

    const contact: TrustedContact = {
      id: Date.now().toString(),
      ...newContact,
    };

    const updated = [...trustedContacts, contact];
    setTrustedContacts(updated);
    await saveSettings({ trustedContacts: updated });
    setNewContact({ name: '', phone: '', relationship: '' });
  };

  const removeTrustedContact = async (id: string) => {
    const updated = trustedContacts.filter(c => c.id !== id);
    setTrustedContacts(updated);
    await saveSettings({ trustedContacts: updated });
  };

  // Main Settings Menu
  if (currentView === 'main') {
    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-xl font-bold">Settings</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Profile Summary */}
          <button
            onClick={() => setCurrentView('profile')}
            className="w-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-4"
          >
            <div className="flex items-center gap-4">
              {profilePhoto ? (
                <ImageWithFallback 
                  src={profilePhoto}
                  alt={name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-white font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 text-left">
                <p className="font-bold text-lg">{user.name}</p>
                <p className="text-sm text-gray-600">{user.phone}</p>
                <p className="text-xs text-green-600 mt-1">Edit Profile</p>
              </div>
              <ChevronRight className="size-5 text-gray-400" />
            </div>
          </button>

          {/* Account & Security */}
          <div>
            <h2 className="text-sm font-bold text-gray-500 uppercase mb-3">Account & Security</h2>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <button
                onClick={() => setCurrentView('safety')}
                className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-all border-b border-gray-100"
              >
                <div className="bg-red-100 p-3 rounded-xl">
                  <Shield className="size-6 text-red-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold">Safety & Privacy</p>
                  <p className="text-sm text-gray-500">Auto-lock, biometrics, location</p>
                </div>
                <ChevronRight className="size-5 text-gray-400" />
              </button>

              <button
                onClick={() => setCurrentView('trusted-contacts')}
                className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-all border-b border-gray-100"
              >
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Users className="size-6 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold">Trusted Contacts</p>
                  <p className="text-sm text-gray-500">{trustedContacts.length} contacts</p>
                </div>
                <ChevronRight className="size-5 text-gray-400" />
              </button>

              <button
                onClick={() => setCurrentView('notifications')}
                className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-all"
              >
                <div className="bg-yellow-100 p-3 rounded-xl">
                  <Bell className="size-6 text-yellow-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold">Notifications</p>
                  <p className="text-sm text-gray-500">Push, email, SMS alerts</p>
                </div>
                <ChevronRight className="size-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Preferences */}
          <div>
            <h2 className="text-sm font-bold text-gray-500 uppercase mb-3">Preferences</h2>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <button
                onClick={() => setCurrentView('addresses')}
                className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-all border-b border-gray-100"
              >
                <div className="bg-purple-100 p-3 rounded-xl">
                  <Home className="size-6 text-purple-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold">Saved Addresses</p>
                  <p className="text-sm text-gray-500">{addresses.length} locations</p>
                </div>
                <ChevronRight className="size-5 text-gray-400" />
              </button>

              <button
                onClick={() => setCurrentView('appearance')}
                className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-all border-b border-gray-100"
              >
                <div className="bg-indigo-100 p-3 rounded-xl">
                  <Palette className="size-6 text-indigo-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold">Appearance</p>
                  <p className="text-sm text-gray-500">Theme, colors, layout</p>
                </div>
                <ChevronRight className="size-5 text-gray-400" />
              </button>

              <button
                onClick={() => setCurrentView('accessibility')}
                className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-all"
              >
                <div className="bg-green-100 p-3 rounded-xl">
                  <Eye className="size-6 text-green-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold">Accessibility</p>
                  <p className="text-sm text-gray-500">Font size, contrast, motion</p>
                </div>
                <ChevronRight className="size-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Support */}
          <div>
            <h2 className="text-sm font-bold text-gray-500 uppercase mb-3">Support</h2>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <button
                onClick={() => setCurrentView('help')}
                className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-all border-b border-gray-100"
              >
                <div className="bg-orange-100 p-3 rounded-xl">
                  <HelpCircle className="size-6 text-orange-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold">Help & Support</p>
                  <p className="text-sm text-gray-500">FAQs, contact us, guides</p>
                </div>
                <ChevronRight className="size-5 text-gray-400" />
              </button>

              <button
                onClick={() => setCurrentView('about')}
                className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-all"
              >
                <div className="bg-gray-100 p-3 rounded-xl">
                  <FileText className="size-6 text-gray-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold">About goPay</p>
                  <p className="text-sm text-gray-500">Version 1.0.0</p>
                </div>
                <ChevronRight className="size-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Profile Edit View
  if (currentView === 'profile') {
    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentView('main')} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-xl font-bold">Edit Profile</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Profile Photo */}
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              {profilePhoto ? (
                <ImageWithFallback 
                  src={profilePhoto}
                  alt={name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
                />
              ) : (
                <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center border-4 border-gray-100">
                  <span className="text-5xl text-white font-bold">
                    {name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-all disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Camera className="size-5" />
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            <p className="text-sm text-gray-500 text-center">
              Click the camera icon to upload a new photo
            </p>
            {profilePhoto && (
              <button
                onClick={() => setProfilePhoto('')}
                className="mt-2 text-sm text-red-600 hover:text-red-700"
              >
                Remove photo
              </button>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-bold mb-2">Full Name</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 pl-12 pr-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full h-12 pl-12 pr-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Phone (Read-only) */}
          <div>
            <label className="block text-sm font-bold mb-2">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="text"
                value={user.phone}
                disabled
                className="w-full h-12 pl-12 pr-4 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Phone number cannot be changed</p>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSaveProfile}
            disabled={saving || !name.trim()}
            className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full font-bold disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="size-5 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Saved Addresses View
  if (currentView === 'addresses') {
    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentView('main')} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-xl font-bold">Saved Addresses</h1>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Add New Address */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-green-900">Add New Address</h3>
            <input
              type="text"
              placeholder="Label (e.g., Home, Work)"
              value={newAddress.label}
              onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
              className="w-full h-12 px-4 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Full address"
              value={newAddress.address}
              onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
              className="w-full h-12 px-4 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none"
            />
            <Button
              onClick={addAddress}
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold"
            >
              <Plus className="size-5 mr-2" />
              Add Address
            </Button>
          </div>

          {/* Address List */}
          {addresses.length === 0 ? (
            <div className="text-center py-12">
              <Home className="size-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No saved addresses yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`bg-white border-2 rounded-2xl p-4 ${
                    addr.isDefault ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <MapPin className={`size-5 mt-1 ${addr.isDefault ? 'text-green-600' : 'text-gray-400'}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold">{addr.label}</p>
                        {addr.isDefault && (
                          <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{addr.address}</p>
                      <div className="flex items-center gap-3 mt-3">
                        {!addr.isDefault && (
                          <button
                            onClick={() => setDefaultAddress(addr.id)}
                            className="text-sm text-green-600 hover:text-green-700 font-semibold"
                          >
                            Set as Default
                          </button>
                        )}
                        <button
                          onClick={() => removeAddress(addr.id)}
                          className="text-sm text-red-600 hover:text-red-700 font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Accessibility View
  if (currentView === 'accessibility') {
    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentView('main')} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-xl font-bold">Accessibility</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Font Size */}
          <div>
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Type className="size-5" />
              Font Size
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {(['small', 'medium', 'large'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setFontSize(size);
                    saveSettings({ preferences: { fontSize: size } });
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    fontSize === size
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className={`font-semibold capitalize ${
                    size === 'small' ? 'text-sm' : size === 'large' ? 'text-lg' : ''
                  }`}>
                    {size}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Settings */}
          <div className="space-y-3">
            <button
              onClick={() => {
                setHighContrast(!highContrast);
                saveSettings({ preferences: { highContrast: !highContrast } });
              }}
              className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-between hover:border-gray-300 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-3 rounded-xl">
                  <Contrast className="size-6 text-gray-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">High Contrast</p>
                  <p className="text-sm text-gray-500">Increase color contrast</p>
                </div>
              </div>
              <div className={`w-14 h-8 rounded-full transition-all ${
                highContrast ? 'bg-green-600' : 'bg-gray-300'
              }`}>
                <div className={`w-6 h-6 bg-white rounded-full mt-1 transition-all ${
                  highContrast ? 'ml-7' : 'ml-1'
                }`} />
              </div>
            </button>

            <button
              onClick={() => {
                setBoldText(!boldText);
                saveSettings({ preferences: { boldText: !boldText } });
              }}
              className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-between hover:border-gray-300 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-3 rounded-xl">
                  <Type className="size-6 text-gray-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Bold Text</p>
                  <p className="text-sm text-gray-500">Make text easier to read</p>
                </div>
              </div>
              <div className={`w-14 h-8 rounded-full transition-all ${
                boldText ? 'bg-green-600' : 'bg-gray-300'
              }`}>
                <div className={`w-6 h-6 bg-white rounded-full mt-1 transition-all ${
                  boldText ? 'ml-7' : 'ml-1'
                }`} />
              </div>
            </button>

            <button
              onClick={() => {
                setReduceMotion(!reduceMotion);
                saveSettings({ preferences: { reduceMotion: !reduceMotion } });
              }}
              className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-between hover:border-gray-300 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-3 rounded-xl">
                  <Zap className="size-6 text-gray-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Reduce Motion</p>
                  <p className="text-sm text-gray-500">Minimize animations</p>
                </div>
              </div>
              <div className={`w-14 h-8 rounded-full transition-all ${
                reduceMotion ? 'bg-green-600' : 'bg-gray-300'
              }`}>
                <div className={`w-6 h-6 bg-white rounded-full mt-1 transition-all ${
                  reduceMotion ? 'ml-7' : 'ml-1'
                }`} />
              </div>
            </button>

            <button
              onClick={() => {
                setScreenReader(!screenReader);
                saveSettings({ preferences: { screenReader: !screenReader } });
              }}
              className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-between hover:border-gray-300 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-3 rounded-xl">
                  <BookOpen className="size-6 text-gray-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Screen Reader Support</p>
                  <p className="text-sm text-gray-500">Optimize for assistive tech</p>
                </div>
              </div>
              <div className={`w-14 h-8 rounded-full transition-all ${
                screenReader ? 'bg-green-600' : 'bg-gray-300'
              }`}>
                <div className={`w-6 h-6 bg-white rounded-full mt-1 transition-all ${
                  screenReader ? 'ml-7' : 'ml-1'
                }`} />
              </div>
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-900">
              <strong>Accessibility is important to us.</strong> These settings help make goPay more comfortable for everyone to use.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Appearance View
  if (currentView === 'appearance') {
    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentView('main')} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-xl font-bold">Appearance</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Theme */}
          <div>
            <h3 className="font-bold mb-3">Theme</h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => {
                  setTheme('light');
                  saveSettings({ preferences: { theme: 'light' } });
                }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  theme === 'light'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <Sun className="size-6 mx-auto mb-2 text-yellow-600" />
                <p className="text-sm font-semibold">Light</p>
              </button>

              <button
                onClick={() => {
                  setTheme('dark');
                  saveSettings({ preferences: { theme: 'dark' } });
                }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  theme === 'dark'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <Moon className="size-6 mx-auto mb-2 text-indigo-600" />
                <p className="text-sm font-semibold">Dark</p>
              </button>

              <button
                onClick={() => {
                  setTheme('auto');
                  saveSettings({ preferences: { theme: 'auto' } });
                }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  theme === 'auto'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <Smartphone className="size-6 mx-auto mb-2 text-gray-600" />
                <p className="text-sm font-semibold">Auto</p>
              </button>
            </div>
          </div>

          {/* Color Scheme */}
          <div>
            <h3 className="font-bold mb-3">Accent Color</h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => {
                  setColorScheme('green');
                  saveSettings({ preferences: { colorScheme: 'green' } });
                }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  colorScheme === 'green'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mx-auto mb-2" />
                <p className="text-sm font-semibold">Green</p>
              </button>

              <button
                onClick={() => {
                  setColorScheme('blue');
                  saveSettings({ preferences: { colorScheme: 'blue' } });
                }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  colorScheme === 'blue'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto mb-2" />
                <p className="text-sm font-semibold">Blue</p>
              </button>

              <button
                onClick={() => {
                  setColorScheme('purple');
                  saveSettings({ preferences: { colorScheme: 'purple' } });
                }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  colorScheme === 'purple'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full mx-auto mb-2" />
                <p className="text-sm font-semibold">Purple</p>
              </button>
            </div>
          </div>

          {/* Compact Mode */}
          <button
            onClick={() => {
              setCompactMode(!compactMode);
              saveSettings({ preferences: { compactMode: !compactMode } });
            }}
            className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-between hover:border-gray-300 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-3 rounded-xl">
                <Settings className="size-6 text-gray-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Compact Mode</p>
                <p className="text-sm text-gray-500">Show more content on screen</p>
              </div>
            </div>
            <div className={`w-14 h-8 rounded-full transition-all ${
              compactMode ? 'bg-green-600' : 'bg-gray-300'
            }`}>
              <div className={`w-6 h-6 bg-white rounded-full mt-1 transition-all ${
                compactMode ? 'ml-7' : 'ml-1'
              }`} />
            </div>
          </button>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-sm text-yellow-900">
              <strong>Coming soon:</strong> Dark mode is currently in development and will be available in a future update.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Safety & Privacy View
  if (currentView === 'safety') {
    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentView('main')} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-xl font-bold">Safety & Privacy</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Auto-Lock */}
          <div>
            <h3 className="font-bold mb-3">Auto-Lock Timer</h3>
            <div className="grid grid-cols-2 gap-3">
              {(['1min', '5min', '15min', 'never'] as const).map((time) => (
                <button
                  key={time}
                  onClick={() => {
                    setAutoLock(time);
                    saveSettings({ preferences: { autoLock: time } });
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    autoLock === time
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200'
                  }`}
                >
                  <p className="font-semibold">{time === 'never' ? 'Never' : time.replace('min', ' min')}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Biometric */}
          <button
            onClick={() => {
              setBiometricEnabled(!biometricEnabled);
              saveSettings({ preferences: { biometricEnabled: !biometricEnabled } });
            }}
            className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-between hover:border-gray-300 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Lock className="size-6 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Biometric Authentication</p>
                <p className="text-sm text-gray-500">Use fingerprint/face unlock</p>
              </div>
            </div>
            <div className={`w-14 h-8 rounded-full transition-all ${
              biometricEnabled ? 'bg-green-600' : 'bg-gray-300'
            }`}>
              <div className={`w-6 h-6 bg-white rounded-full mt-1 transition-all ${
                biometricEnabled ? 'ml-7' : 'ml-1'
              }`} />
            </div>
          </button>

          {/* Location Sharing */}
          <button
            onClick={() => {
              setShareLocation(!shareLocation);
              saveSettings({ preferences: { shareLocation: !shareLocation } });
            }}
            className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-between hover:border-gray-300 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-xl">
                <MapPin className="size-6 text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Share Location</p>
                <p className="text-sm text-gray-500">For rides & nearby services</p>
              </div>
            </div>
            <div className={`w-14 h-8 rounded-full transition-all ${
              shareLocation ? 'bg-green-600' : 'bg-gray-300'
            }`}>
              <div className={`w-6 h-6 bg-white rounded-full mt-1 transition-all ${
                shareLocation ? 'ml-7' : 'ml-1'
              }`} />
            </div>
          </button>

          {/* Emergency Location Sharing */}
          <button
            onClick={() => {
              setEmergencySharing(!emergencySharing);
              saveSettings({ preferences: { emergencySharing: !emergencySharing } });
            }}
            className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-between hover:border-gray-300 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-3 rounded-xl">
                <AlertCircle className="size-6 text-red-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Emergency Location Sharing</p>
                <p className="text-sm text-gray-500">Share with trusted contacts</p>
              </div>
            </div>
            <div className={`w-14 h-8 rounded-full transition-all ${
              emergencySharing ? 'bg-green-600' : 'bg-gray-300'
            }`}>
              <div className={`w-6 h-6 bg-white rounded-full mt-1 transition-all ${
                emergencySharing ? 'ml-7' : 'ml-1'
              }`} />
            </div>
          </button>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-900">
              <strong>Your safety is our priority.</strong> We use enterprise-grade encryption and never share your data without permission.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Trusted Contacts View
  if (currentView === 'trusted-contacts') {
    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentView('main')} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-xl font-bold">Trusted Contacts</h1>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-900">
              Add trusted contacts who can be notified in case of emergency or receive your ride/location updates.
            </p>
          </div>

          {/* Add New Contact */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-green-900">Add Trusted Contact</h3>
            <input
              type="text"
              placeholder="Full Name"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              className="w-full h-12 px-4 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              className="w-full h-12 px-4 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Relationship (e.g., Spouse, Parent, Friend)"
              value={newContact.relationship}
              onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
              className="w-full h-12 px-4 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none"
            />
            <Button
              onClick={addTrustedContact}
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold"
            >
              <Plus className="size-5 mr-2" />
              Add Contact
            </Button>
          </div>

          {/* Contacts List */}
          {trustedContacts.length === 0 ? (
            <div className="text-center py-12">
              <Users className="size-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No trusted contacts yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {trustedContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="bg-white border-2 border-gray-200 rounded-2xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {contact.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.phone}</p>
                      {contact.relationship && (
                        <p className="text-xs text-gray-500">{contact.relationship}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeTrustedContact(contact.id)}
                      className="p-2 hover:bg-red-50 rounded-full transition-all"
                    >
                      <Trash2 className="size-5 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Notifications View
  if (currentView === 'notifications') {
    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentView('main')} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-xl font-bold">Notifications</h1>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <button
            onClick={() => {
              setPushEnabled(!pushEnabled);
              saveSettings({ preferences: { pushEnabled: !pushEnabled } });
            }}
            className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-between hover:border-gray-300 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Bell className="size-6 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Push Notifications</p>
                <p className="text-sm text-gray-500">App notifications</p>
              </div>
            </div>
            <div className={`w-14 h-8 rounded-full transition-all ${
              pushEnabled ? 'bg-green-600' : 'bg-gray-300'
            }`}>
              <div className={`w-6 h-6 bg-white rounded-full mt-1 transition-all ${
                pushEnabled ? 'ml-7' : 'ml-1'
              }`} />
            </div>
          </button>

          <button
            onClick={() => {
              setEmailNotifications(!emailNotifications);
              saveSettings({ preferences: { emailNotifications: !emailNotifications } });
            }}
            className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-between hover:border-gray-300 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Mail className="size-6 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Email Notifications</p>
                <p className="text-sm text-gray-500">Receipts & updates</p>
              </div>
            </div>
            <div className={`w-14 h-8 rounded-full transition-all ${
              emailNotifications ? 'bg-green-600' : 'bg-gray-300'
            }`}>
              <div className={`w-6 h-6 bg-white rounded-full mt-1 transition-all ${
                emailNotifications ? 'ml-7' : 'ml-1'
              }`} />
            </div>
          </button>

          <button
            onClick={() => {
              setSmsNotifications(!smsNotifications);
              saveSettings({ preferences: { smsNotifications: !smsNotifications } });
            }}
            className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-between hover:border-gray-300 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-xl">
                <MessageCircle className="size-6 text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold">SMS Notifications</p>
                <p className="text-sm text-gray-500">Text message alerts</p>
              </div>
            </div>
            <div className={`w-14 h-8 rounded-full transition-all ${
              smsNotifications ? 'bg-green-600' : 'bg-gray-300'
            }`}>
              <div className={`w-6 h-6 bg-white rounded-full mt-1 transition-all ${
                smsNotifications ? 'ml-7' : 'ml-1'
              }`} />
            </div>
          </button>

          <button
            onClick={() => {
              setTransactionAlerts(!transactionAlerts);
              saveSettings({ preferences: { transactionAlerts: !transactionAlerts } });
            }}
            className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-between hover:border-gray-300 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-3 rounded-xl">
                <AlertCircle className="size-6 text-yellow-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Transaction Alerts</p>
                <p className="text-sm text-gray-500">Payment confirmations</p>
              </div>
            </div>
            <div className={`w-14 h-8 rounded-full transition-all ${
              transactionAlerts ? 'bg-green-600' : 'bg-gray-300'
            }`}>
              <div className={`w-6 h-6 bg-white rounded-full mt-1 transition-all ${
                transactionAlerts ? 'ml-7' : 'ml-1'
              }`} />
            </div>
          </button>

          <button
            onClick={() => {
              setPromotionalOffers(!promotionalOffers);
              saveSettings({ preferences: { promotionalOffers: !promotionalOffers } });
            }}
            className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-between hover:border-gray-300 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-xl">
                <Zap className="size-6 text-orange-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Promotional Offers</p>
                <p className="text-sm text-gray-500">Deals & discounts</p>
              </div>
            </div>
            <div className={`w-14 h-8 rounded-full transition-all ${
              promotionalOffers ? 'bg-green-600' : 'bg-gray-300'
            }`}>
              <div className={`w-6 h-6 bg-white rounded-full mt-1 transition-all ${
                promotionalOffers ? 'ml-7' : 'ml-1'
              }`} />
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Help & Support View
  if (currentView === 'help') {
    const faqs = [
      { q: 'How do I add money to my wallet?', a: 'You can top up via M-Pesa, Tigo Pesa, Airtel Money, or link your bank account.' },
      { q: 'How do I cancel a ride?', a: 'Open your ride booking and tap Cancel. Note: Cancellation fees may apply within 5 minutes.' },
      { q: 'How do I cancel a car rental?', a: 'Rentals can be cancelled up to 48 hours before pickup with a 90% refund.' },
      { q: 'What are the membership benefits?', a: 'Plus members get 10% lower commissions, Premium members get 5% commissions and exclusive perks.' },
      { q: 'How do I contact support?', a: 'Call +255 700 000 000, email support@gopay.tz, or use the in-app chat below.' },
    ];

    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentView('main')} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-xl font-bold">Help & Support</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Contact Options */}
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-green-600 text-white rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-green-700 transition-all">
              <Phone className="size-8" />
              <p className="font-semibold text-sm">Call Us</p>
            </button>
            <button className="bg-blue-600 text-white rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-blue-700 transition-all">
              <MessageCircle className="size-8" />
              <p className="font-semibold text-sm">Live Chat</p>
            </button>
          </div>

          {/* FAQs */}
          <div>
            <h2 className="font-bold mb-3">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <details key={idx} className="bg-gray-50 rounded-xl p-4">
                  <summary className="font-semibold cursor-pointer">{faq.q}</summary>
                  <p className="text-sm text-gray-600 mt-2">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>

          {/* Help Topics */}
          <div>
            <h2 className="font-bold mb-3">Help Topics</h2>
            <div className="space-y-2">
              {['Getting Started', 'Wallet & Payments', 'Rides & Rentals', 'Bills & Utilities', 'Shopping', 'Account & Security'].map((topic) => (
                <button key={topic} className="w-full bg-white border-2 border-gray-200 rounded-xl p-4 flex items-center justify-between hover:border-gray-300 transition-all">
                  <p className="font-semibold">{topic}</p>
                  <ChevronRight className="size-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // About View
  if (currentView === 'about') {
    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentView('main')} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-xl font-bold">About goPay</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          <div className="text-center py-6">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-4xl text-white font-bold">gP</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">goPay Super App</h2>
            <p className="text-gray-600 mb-1">Version 1.0.0</p>
            <p className="text-sm text-gray-500">Tanzania's All-in-One Platform</p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
            <p className="text-sm text-gray-700 leading-relaxed">
              goPay is Tanzania's premier super app, bringing together payments, rides, car rentals, shopping, dining, entertainment, and government services in one seamless experience.
            </p>
          </div>

          <div className="space-y-2">
            <button className="w-full bg-white border-2 border-gray-200 rounded-xl p-4 flex items-center justify-between hover:border-gray-300 transition-all">
              <p className="font-semibold">Terms of Service</p>
              <ChevronRight className="size-5 text-gray-400" />
            </button>
            <button className="w-full bg-white border-2 border-gray-200 rounded-xl p-4 flex items-center justify-between hover:border-gray-300 transition-all">
              <p className="font-semibold">Privacy Policy</p>
              <ChevronRight className="size-5 text-gray-400" />
            </button>
            <button className="w-full bg-white border-2 border-gray-200 rounded-xl p-4 flex items-center justify-between hover:border-gray-300 transition-all">
              <p className="font-semibold">Licenses</p>
              <ChevronRight className="size-5 text-gray-400" />
            </button>
          </div>

          <div className="text-center text-sm text-gray-500 pt-6">
            <p>Made with ❤️ in Tanzania</p>
            <p className="mt-2">© 2024 goPay. All rights reserved.</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
