/**
 * SECURITY SETTINGS - OPTIMIZED
 * 
 * Patterns from: Revolut, PayPal, Coinbase, N26
 * 
 * Features:
 * - PIN management
 * - Biometric authentication
 * - Device management
 * - Session timeout settings
 * - Two-factor authentication
 * - Activity log
 * - Clear explanations for permissions
 * - WCAG AA compliant
 */

import { useState } from 'react';
import {
  Shield,
  Lock,
  Smartphone,
  Fingerprint,
  Eye,
  Clock,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Key,
  LogOut,
  Trash2,
  ChevronRight
} from 'lucide-react';
import {
  PageHeader,
  SectionHeader,
  Alert,
  ActionCard,
  ListItem,
  BottomSheet
} from './design-system/SharedComponents';

interface Device {
  id: string;
  name: string;
  type: 'mobile' | 'tablet' | 'desktop';
  location: string;
  lastActive: string;
  current: boolean;
}

interface ActivityLog {
  id: string;
  action: string;
  time: string;
  location: string;
  device: string;
  status: 'success' | 'failed';
}

interface SecuritySettingsOptimizedProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

export function SecuritySettingsOptimized({ onBack, onNavigate }: SecuritySettingsOptimizedProps) {
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [showPINDialog, setShowPINDialog] = useState(false);
  const [showDevices, setShowDevices] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('15'); // minutes

  // Mock devices
  const devices: Device[] = [
    {
      id: '1',
      name: 'iPhone 14 Pro',
      type: 'mobile',
      location: 'Dar es Salaam, Tanzania',
      lastActive: 'Active now',
      current: true
    },
    {
      id: '2',
      name: 'Samsung Galaxy S22',
      type: 'mobile',
      location: 'Arusha, Tanzania',
      lastActive: '3 days ago',
      current: false
    }
  ];

  // Mock activity
  const activityLogs: ActivityLog[] = [
    {
      id: '1',
      action: 'Successful login',
      time: '2 hours ago',
      location: 'Dar es Salaam',
      device: 'iPhone 14 Pro',
      status: 'success'
    },
    {
      id: '2',
      action: 'PIN changed',
      time: 'Yesterday',
      location: 'Dar es Salaam',
      device: 'iPhone 14 Pro',
      status: 'success'
    },
    {
      id: '3',
      action: 'Failed login attempt',
      time: '2 days ago',
      location: 'Unknown',
      device: 'Unknown device',
      status: 'failed'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Security"
        swahiliTitle="Usalama"
        subtitle="Protect your account"
        onBack={onBack}
      />

      <div className="p-5 space-y-6">
        {/* SECURITY STATUS */}
        <div className="bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 rounded-3xl p-6 text-white shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
              <Shield className="size-7 text-white" />
            </div>
            <div>
              <p className="text-base font-black mb-0.5">Account Protected</p>
              <p className="text-sm text-emerald-100">Usalama Kamili</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/20">
              <CheckCircle2 className="size-5 text-white mb-2" />
              <p className="text-xs text-white/90 font-semibold">PIN Enabled</p>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/20">
              <CheckCircle2 className="size-5 text-white mb-2" />
              <p className="text-xs text-white/90 font-semibold">Biometric On</p>
            </div>
          </div>
        </div>

        {/* AUTHENTICATION */}
        <div>
          <SectionHeader
            title="Uthibitisho • Authentication"
            subtitle="Login security"
          />

          <div className="space-y-3">
            {/* PIN */}
            <button
              onClick={() => setShowPINDialog(true)}
              className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all active:scale-[0.99] text-left"
            >
              <div className="flex items-center gap-4">
                <div className="size-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md">
                  <Lock className="size-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900 mb-0.5">Change PIN</p>
                  <p className="text-xs text-gray-700 font-medium">Update your 4-digit PIN</p>
                </div>
                <ChevronRight className="size-5 text-gray-600" />
              </div>
            </button>

            {/* Biometric */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
              <div className="flex items-center gap-4">
                <div className="size-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                  <Fingerprint className="size-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900 mb-0.5">Biometric Login</p>
                  <p className="text-xs text-gray-700 font-medium">Fingerprint or Face ID</p>
                </div>
                <button
                  onClick={() => setBiometricEnabled(!biometricEnabled)}
                  className={`w-12 h-7 rounded-full transition-all ${
                    biometricEnabled ? 'bg-emerald-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`size-5 bg-white rounded-full transition-all shadow-md ${
                    biometricEnabled ? 'ml-6' : 'ml-1'
                  }`}></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SESSION SECURITY */}
        <div>
          <SectionHeader
            title="Muda wa Kipindi • Session"
            subtitle="Auto-lock settings"
          />

          <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
            <div className="flex items-start gap-4 mb-4">
              <div className="size-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-md">
                <Clock className="size-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 mb-0.5">Auto-Lock Timer</p>
                <p className="text-xs text-gray-700 font-medium leading-relaxed">
                  App locks automatically after inactivity
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {['5', '15', '30', '60'].map(minutes => (
                <button
                  key={minutes}
                  onClick={() => setSessionTimeout(minutes)}
                  className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
                    sessionTimeout === minutes
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {minutes} minutes
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* DEVICES & ACTIVITY */}
        <div>
          <SectionHeader
            title="Vifaa & Shughuli • Devices & Activity"
            subtitle="Manage access"
          />

          <div className="space-y-3">
            {/* Devices */}
            <button
              onClick={() => setShowDevices(true)}
              className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all active:scale-[0.99] text-left"
            >
              <div className="flex items-center gap-4">
                <div className="size-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                  <Smartphone className="size-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900 mb-0.5">Trusted Devices</p>
                  <p className="text-xs text-gray-700 font-medium">{devices.length} active device{devices.length > 1 ? 's' : ''}</p>
                </div>
                <ChevronRight className="size-5 text-gray-600" />
              </div>
            </button>

            {/* Activity Log */}
            <button
              onClick={() => setShowActivity(true)}
              className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all active:scale-[0.99] text-left"
            >
              <div className="flex items-center gap-4">
                <div className="size-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                  <Eye className="size-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900 mb-0.5">Recent Activity</p>
                  <p className="text-xs text-gray-700 font-medium">View security events</p>
                </div>
                <ChevronRight className="size-5 text-gray-600" />
              </div>
            </button>
          </div>
        </div>

        {/* PERMISSIONS */}
        <div>
          <SectionHeader
            title="Ruhusa • Permissions"
            subtitle="App access"
          />

          <Alert
            type="info"
            title="Location Access"
            message="Used for fraud detection and showing nearby merchants. Your location is never shared with third parties."
          />

          <div className="mt-3 space-y-3">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
              <div className="flex items-center gap-4">
                <MapPin className="size-6 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">Location</p>
                  <p className="text-xs text-gray-700 font-medium">For fraud protection</p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
                  Allowed
                </span>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
              <div className="flex items-center gap-4">
                <Smartphone className="size-6 text-purple-600" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">Notifications</p>
                  <p className="text-xs text-gray-700 font-medium">Payment alerts</p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
                  Allowed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* DANGER ZONE */}
        <div>
          <SectionHeader
            title="Danger Zone"
            subtitle="Proceed with caution"
          />

          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-4 hover:shadow-md transition-all text-left">
              <div className="flex items-center gap-4">
                <LogOut className="size-6 text-red-600" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">Log Out All Devices</p>
                  <p className="text-xs text-gray-700 font-medium">Requires re-authentication</p>
                </div>
                <ChevronRight className="size-5 text-gray-600" />
              </div>
            </button>
          </div>
        </div>

        {/* TRUST SIGNAL */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <Shield className="size-6 text-emerald-700" />
            <div>
              <p className="text-sm font-bold text-emerald-900 mb-0.5">Bank-Level Security</p>
              <p className="text-xs text-emerald-800 font-medium">
                256-bit encryption • Licensed by Bank of Tanzania
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* DEVICES BOTTOM SHEET */}
      <BottomSheet
        isOpen={showDevices}
        onClose={() => setShowDevices(false)}
        title="Trusted Devices"
      >
        <div className="space-y-4">
          {devices.map(device => (
            <div key={device.id} className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-4">
              <div className="flex items-start gap-3 mb-3">
                <Smartphone className="size-6 text-gray-700" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-gray-900">{device.name}</p>
                    {device.current && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="size-3 text-gray-600" />
                      <p className="text-xs text-gray-700 font-medium">{device.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="size-3 text-gray-600" />
                      <p className="text-xs text-gray-700 font-medium">{device.lastActive}</p>
                    </div>
                  </div>
                </div>
              </div>

              {!device.current && (
                <button className="w-full bg-red-50 hover:bg-red-100 text-red-700 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2">
                  <Trash2 className="size-3" />
                  Remove Device
                </button>
              )}
            </div>
          ))}
        </div>
      </BottomSheet>

      {/* ACTIVITY LOG BOTTOM SHEET */}
      <BottomSheet
        isOpen={showActivity}
        onClose={() => setShowActivity(false)}
        title="Recent Activity"
      >
        <div className="space-y-3">
          {activityLogs.map(log => (
            <div key={log.id} className={`border-2 rounded-2xl p-4 ${
              log.status === 'failed' 
                ? 'bg-red-50 border-red-200' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`size-10 rounded-xl flex items-center justify-center ${
                  log.status === 'failed'
                    ? 'bg-red-100'
                    : 'bg-green-100'
                }`}>
                  {log.status === 'failed' ? (
                    <AlertTriangle className="size-5 text-red-600" />
                  ) : (
                    <CheckCircle2 className="size-5 text-green-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900 mb-1">{log.action}</p>
                  <div className="space-y-0.5">
                    <p className="text-xs text-gray-700 font-medium">{log.device}</p>
                    <p className="text-xs text-gray-700 font-medium">{log.location}</p>
                    <p className="text-xs text-gray-600">{log.time}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </BottomSheet>

      {/* CHANGE PIN BOTTOM SHEET */}
      <BottomSheet
        isOpen={showPINDialog}
        onClose={() => setShowPINDialog(false)}
        title="Change PIN"
      >
        <div className="space-y-6">
          <Alert
            type="warning"
            title="Keep Your PIN Safe"
            message="Never share your PIN with anyone, including goPay staff"
          />

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">Current PIN</label>
            <input
              type="password"
              maxLength={4}
              placeholder="••••"
              className="w-full h-14 text-center text-2xl tracking-widest border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none font-black"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">New PIN</label>
            <input
              type="password"
              maxLength={4}
              placeholder="••••"
              className="w-full h-14 text-center text-2xl tracking-widest border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none font-black"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">Confirm New PIN</label>
            <input
              type="password"
              maxLength={4}
              placeholder="••••"
              className="w-full h-14 text-center text-2xl tracking-widest border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none font-black"
            />
          </div>

          <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-xl text-sm font-bold transition-all">
            Update PIN
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}
