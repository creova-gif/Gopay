import { useState, useEffect } from 'react';
import { ArrowLeft, Home, Briefcase, MapPin, Plus, Edit2, Trash2, Check } from 'lucide-react';
import { Button } from './ui/button';
import { TanzaniaLocation, TANZANIA_REGIONS, DAR_POPULAR_AREAS, getDefaultLocation } from '../utils/locationService';
import { projectId } from '../utils/supabase/info';

interface SavedAddress {
  id: string;
  type: 'home' | 'work' | 'other';
  label: string;
  location: TanzaniaLocation;
  isFavorite: boolean;
}

interface SavedAddressesProps {
  accessToken: string;
  onBack: () => void;
  onSelectAddress?: (address: SavedAddress) => void;
}

export function SavedAddresses({ accessToken, onBack, onSelectAddress }: SavedAddressesProps) {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formType, setFormType] = useState<'home' | 'work' | 'other'>('home');
  const [formLabel, setFormLabel] = useState('');
  const [formRegion, setFormRegion] = useState('Dar es Salaam');
  const [formArea, setFormArea] = useState('');
  const [formStreet, setFormStreet] = useState('');

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/user/saved-addresses`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAddresses(data.addresses || []);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveAddress = async () => {
    const location: TanzaniaLocation = {
      region: formRegion,
      district: formArea || 'Central',
      ward: formArea,
      street: formStreet,
      latitude: -6.7924,
      longitude: 39.2083,
      formatted: formStreet ? `${formStreet}, ${formArea}, ${formRegion}` : `${formArea}, ${formRegion}`
    };

    const newAddress: SavedAddress = {
      id: editingId || Date.now().toString(),
      type: formType,
      label: formLabel || (formType === 'home' ? 'Home' : formType === 'work' ? 'Work' : 'Other'),
      location,
      isFavorite: false
    };

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/user/saved-addresses`,
        {
          method: editingId ? 'PUT' : 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ address: newAddress }),
        }
      );

      if (response.ok) {
        await loadAddresses();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Failed to save address');
    }
  };

  const deleteAddress = async (id: string) => {
    if (!confirm('Delete this address?')) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/user/saved-addresses/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        await loadAddresses();
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const editAddress = (address: SavedAddress) => {
    setEditingId(address.id);
    setFormType(address.type);
    setFormLabel(address.label);
    setFormRegion(address.location.region);
    setFormArea(address.location.ward || '');
    setFormStreet(address.location.street || '');
    setShowAddForm(true);
  };

  const resetForm = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormType('home');
    setFormLabel('');
    setFormRegion('Dar es Salaam');
    setFormArea('');
    setFormStreet('');
  };

  const getIcon = (type: 'home' | 'work' | 'other') => {
    switch (type) {
      case 'home':
        return <Home className="size-6 text-green-600" />;
      case 'work':
        return <Briefcase className="size-6 text-blue-600" />;
      default:
        return <MapPin className="size-6 text-gray-600" />;
    }
  };

  if (showAddForm) {
    return (
      <div className="min-h-screen bg-white pb-20">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-xl font-bold">{editingId ? 'Edit Address' : 'Add New Address'}</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2">Address Type</label>
            <div className="grid grid-cols-3 gap-3">
              {(['home', 'work', 'other'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFormType(type)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formType === type
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {getIcon(type)}
                  <p className="text-sm font-semibold capitalize mt-2">{type}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Label (Optional)</label>
            <input
              type="text"
              placeholder={formType === 'home' ? 'Home' : formType === 'work' ? 'Work' : 'My Place'}
              value={formLabel}
              onChange={(e) => setFormLabel(e.target.value)}
              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Region</label>
            <select
              value={formRegion}
              onChange={(e) => setFormRegion(e.target.value)}
              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
            >
              {TANZANIA_REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          {formRegion === 'Dar es Salaam' && (
            <div>
              <label className="block text-sm font-bold mb-2">Area</label>
              <select
                value={formArea}
                onChange={(e) => setFormArea(e.target.value)}
                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
              >
                <option value="">Select area</option>
                {DAR_POPULAR_AREAS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
          )}

          {formRegion !== 'Dar es Salaam' && (
            <div>
              <label className="block text-sm font-bold mb-2">Area/District</label>
              <input
                type="text"
                placeholder="Enter area or district"
                value={formArea}
                onChange={(e) => setFormArea(e.target.value)}
                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold mb-2">Street/Building (Optional)</label>
            <input
              type="text"
              placeholder="Street name or building"
              value={formStreet}
              onChange={(e) => setFormStreet(e.target.value)}
              className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-900">
              <strong>Preview:</strong> {formStreet && `${formStreet}, `}
              {formArea ? `${formArea}, ` : ''}
              {formRegion}
            </p>
          </div>

          <Button
            onClick={saveAddress}
            disabled={!formRegion || !formArea}
            className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold disabled:opacity-50"
          >
            <Check className="size-5 mr-2" />
            {editingId ? 'Update Address' : 'Save Address'}
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
          <h1 className="text-xl font-bold">Saved Addresses</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading addresses...</div>
        ) : (
          <>
            {addresses.length === 0 ? (
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 text-center">
                <MapPin className="size-12 text-gray-400 mx-auto mb-3" />
                <h3 className="font-bold mb-2">No Saved Addresses</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Add your home and work addresses for quick booking
                </p>
              </div>
            ) : (
              addresses.map((address) => (
                <div
                  key={address.id}
                  className="bg-white border-2 border-gray-200 rounded-2xl p-4 hover:border-green-500 transition-all cursor-pointer"
                  onClick={() => onSelectAddress?.(address)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">{getIcon(address.type)}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold mb-1">{address.label}</h3>
                      <p className="text-sm text-gray-600">{address.location.formatted}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          editAddress(address);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                      >
                        <Edit2 className="size-4 text-gray-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAddress(address.id);
                        }}
                        className="p-2 hover:bg-red-100 rounded-lg transition-all"
                      >
                        <Trash2 className="size-4 text-red-600" />
                      </button>
                    </div>
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
          Add New Address
        </Button>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
          <h3 className="font-bold text-green-900 mb-2">Quick Tips</h3>
          <ul className="space-y-1 text-sm text-green-800">
            <li>• Add home & work for one-tap booking</li>
            <li>• Edit addresses anytime</li>
            <li>• Addresses sync across all devices</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
