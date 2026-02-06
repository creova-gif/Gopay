import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { User } from '../App';
import { ArrowLeft, Camera, Loader2, Check } from 'lucide-react';
import { DEMO_USER } from '../utils/demoData';
import { projectId } from '../utils/supabase/info';

interface EditProfilePageProps {
  user: User;
  accessToken: string;
  onBack: () => void;
  onUpdateUser: (user: User) => void;
  isDemoMode?: boolean;
}

export function EditProfilePage({ user, accessToken, onBack, onUpdateUser, isDemoMode }: EditProfilePageProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [profilePhoto, setProfilePhoto] = useState(user.profilePhoto || '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // In demo mode, just create a local URL
      if (isDemoMode) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setProfilePhoto(result);
          setUploading(false);
        };
        reader.readAsDataURL(file);
      } else {
        // Real implementation would upload to Supabase Storage
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setProfilePhoto(result);
          setUploading(false);
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      setError('Failed to upload photo');
      setUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhoto('');
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!phone.trim()) {
      setError('Phone number is required');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      if (isDemoMode) {
        // Demo mode - save to localStorage
        const updatedUser = {
          ...user,
          name,
          email,
          phone,
          profilePhoto,
        };
        localStorage.setItem('demo-user', JSON.stringify(updatedUser));
        onUpdateUser(updatedUser);
        setSuccess(true);
        setTimeout(() => {
          onBack();
        }, 1500);
      } else {
        // Real implementation - save to backend
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/user/profile`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name,
              email,
              phone,
              profilePhoto,
            }),
          }
        );

        if (response.ok) {
          const updatedUser = await response.json();
          onUpdateUser(updatedUser);
          setSuccess(true);
          setTimeout(() => {
            onBack();
          }, 1500);
        } else {
          throw new Error('Failed to update profile');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const getAvatarUrl = () => {
    if (profilePhoto) return profilePhoto;
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-4 py-4 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="size-6" />
          </button>
          <div>
            <h1 className="text-xl">Edit Profile</h1>
            <p className="text-sm text-green-100">Update your personal information</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Profile Photo */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-4">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="size-32 rounded-full overflow-hidden bg-gray-100 ring-4 ring-green-500">
                <img
                  src={getAvatarUrl()}
                  alt={name}
                  className="size-full object-cover"
                />
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors disabled:opacity-50"
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
            <p className="text-sm text-center text-gray-600 mb-2">
              Click the camera icon to upload a new photo
            </p>
            {profilePhoto && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemovePhoto}
                className="text-red-600 hover:text-red-700"
              >
                Remove photo
              </Button>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Mwangi"
              className="h-12"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo@gopay.tz"
              className="h-12"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+255 712 345 678"
              className="h-12"
            />
            <p className="text-xs text-gray-500 mt-1">Phone number cannot be changed</p>
          </div>

          <div className="pt-2">
            <div className="bg-gray-50 rounded-lg p-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">NIDA Number:</span>
                <span className="font-medium">{user.nida}</span>
              </div>
              <p className="text-xs text-gray-500">NIDA verification cannot be changed</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mt-4">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mt-4 flex items-center gap-2">
            <Check className="size-5" />
            <span>Profile updated successfully!</span>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-6">
          <Button
            onClick={handleSave}
            disabled={saving || uploading}
            className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white text-lg"
          >
            {saving ? (
              <>
                <Loader2 className="size-5 mr-2 animate-spin" />
                Saving Changes...
              </>
            ) : success ? (
              <>
                <Check className="size-5 mr-2" />
                Saved!
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}