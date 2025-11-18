import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { User } from '../App';
import { 
  ArrowLeft, Camera, User as UserIcon, Mail, Phone, MapPin,
  Check, Upload, X, Loader2
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProfileSettingsProps {
  user: User;
  accessToken: string;
  onBack: () => void;
  onUpdateUser: (user: User) => void;
}

export function ProfileSettings({ user, accessToken, onBack, onUpdateUser }: ProfileSettingsProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email || '');
  const [profilePhoto, setProfilePhoto] = useState(user.profilePhoto || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        
        // Upload to server
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
          alert(data.error || 'Upload failed');
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
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
        alert('Profile updated successfully!');
        onBack();
      } else {
        alert(data.error || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Update failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-all">
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

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Check className="size-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900 mb-1">Your data is secure</p>
              <p className="text-xs text-blue-700">
                We use bank-level encryption to protect your personal information
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
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
