import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, X, Camera, User, CheckCircle, Clock } from 'lucide-react';
import { colors } from '../design-system/tokens';
import { projectId } from '../utils/supabase/info';

interface KYCUpgradeBannerProps {
  accessToken: string;
  currentLevel: number;
  trigger?: 'limit_hit' | 'proactive';
  onDismiss?: () => void;
  onUpgraded?: (newLevel: number) => void;
}

type KYCStep = 'banner' | 'id_photo' | 'selfie' | 'submitted';

export function KYCUpgradeBanner({
  accessToken,
  currentLevel,
  trigger = 'proactive',
  onDismiss,
  onUpgraded,
}: KYCUpgradeBannerProps) {
  const [step, setStep] = useState<KYCStep>('banner');
  const [uploading, setUploading] = useState(false);
  const [idPhotoUrl, setIdPhotoUrl] = useState('');

  const newLimit = currentLevel === 0 ? 'TZS 3,000,000' : 'TZS 10,000,000';
  const targetLevel = currentLevel + 1;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'id' | 'selfie') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setUploading(true);
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/kyc/submit`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              documentType: type === 'id' ? 'national_id' : 'selfie',
              documentUrl: base64,
              selfieUrl: type === 'selfie' ? base64 : undefined,
            }),
          }
        );

        if (response.ok) {
          if (type === 'id') {
            setIdPhotoUrl(base64);
            setStep('selfie');
          } else {
            setStep('submitted');
            onUpgraded?.(targetLevel);
          }
        }
      } catch {
        // Still move forward in demo mode
        if (type === 'id') { setIdPhotoUrl(base64); setStep('selfie'); }
        else { setStep('submitted'); onUpgraded?.(targetLevel); }
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  if (step === 'banner') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-4 relative"
        style={{
          background: `linear-gradient(135deg, ${colors.semantic.warningDim}, ${colors.surface.card})`,
          border: `1px solid ${colors.semantic.warning}33`,
        }}
      >
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute top-3 right-3 p-1 rounded-full"
            style={{ background: colors.border.subtle }}
            aria-label="Dismiss"
          >
            <X size={14} style={{ color: colors.text.secondary }} />
          </button>
        )}

        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: colors.semantic.warningDim }}>
            <ArrowUp size={20} style={{ color: colors.semantic.warning }} />
          </div>
          <div className="flex-1 pr-6">
            <p style={{ fontSize: '14px', fontWeight: 600, color: colors.text.primary, marginBottom: '2px' }}>
              {trigger === 'limit_hit' ? 'Umefika kikomo cha siku' : 'Ongeza mipaka yako'}
            </p>
            <p style={{ fontSize: '12px', color: colors.text.secondary, marginBottom: '12px' }}>
              Thibitisha ID yako upate hadi {newLimit} kwa siku
            </p>
            <button
              onClick={() => setStep('id_photo')}
              className="px-4 py-2 rounded-xl text-sm font-semibold"
              style={{
                background: colors.semantic.warning,
                color: '#000',
              }}
            >
              Thibitisha sasa · 30 sekunde
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (step === 'id_photo') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl p-5"
        style={{ background: colors.surface.card, border: `1px solid ${colors.border.subtle}` }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: colors.brand.primary, color: '#fff' }}>1</div>
          <p style={{ fontSize: '16px', fontWeight: 600, color: colors.text.primary }}>
            Piga picha ya Kitambulisho
          </p>
        </div>
        <p style={{ fontSize: '13px', color: colors.text.secondary, marginBottom: '16px' }}>
          NIDA, Passport, au Leseni ya Udereva
        </p>
        <label className="flex flex-col items-center justify-center rounded-xl p-8 cursor-pointer transition-colors"
          style={{ border: `2px dashed ${colors.border.emphasis}`, background: colors.surface.input }}>
          <Camera size={32} style={{ color: colors.brand.light, marginBottom: '8px' }} />
          <span style={{ fontSize: '14px', color: colors.text.secondary }}>
            {uploading ? 'Inapakia...' : 'Gusa kupiga picha'}
          </span>
          <input
            type="file" accept="image/*" capture="environment"
            className="hidden"
            disabled={uploading}
            onChange={e => handleFileUpload(e, 'id')}
          />
        </label>
      </motion.div>
    );
  }

  if (step === 'selfie') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl p-5"
        style={{ background: colors.surface.card, border: `1px solid ${colors.border.subtle}` }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: colors.brand.primary, color: '#fff' }}>2</div>
          <p style={{ fontSize: '16px', fontWeight: 600, color: colors.text.primary }}>
            Piga selfie
          </p>
        </div>
        <p style={{ fontSize: '13px', color: colors.text.secondary, marginBottom: '16px' }}>
          Hakikisha uso wako unaonekana wazi
        </p>
        <label className="flex flex-col items-center justify-center rounded-xl p-8 cursor-pointer"
          style={{ border: `2px dashed ${colors.border.emphasis}`, background: colors.surface.input }}>
          <User size={32} style={{ color: colors.brand.light, marginBottom: '8px' }} />
          <span style={{ fontSize: '14px', color: colors.text.secondary }}>
            {uploading ? 'Inapakia...' : 'Gusa kupiga selfie'}
          </span>
          <input
            type="file" accept="image/*" capture="user"
            className="hidden"
            disabled={uploading}
            onChange={e => handleFileUpload(e, 'selfie')}
          />
        </label>
      </motion.div>
    );
  }

  // Submitted
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl p-5 text-center"
      style={{ background: colors.semantic.successDim, border: `1px solid ${colors.semantic.success}33` }}
    >
      <CheckCircle size={40} style={{ color: colors.semantic.success, margin: '0 auto 12px' }} />
      <p style={{ fontSize: '16px', fontWeight: 600, color: colors.text.primary, marginBottom: '4px' }}>
        Imetumwa kwa ukaguzi!
      </p>
      <p style={{ fontSize: '13px', color: colors.text.secondary, marginBottom: '12px' }}>
        Tutakuarifu ndani ya dakika 5–10
      </p>
      <div className="flex items-center justify-center gap-2">
        <Clock size={14} style={{ color: colors.text.tertiary }} />
        <span style={{ fontSize: '12px', color: colors.text.tertiary }}>
          Inapitiwa · Muda wa kusubiri: dakika 5
        </span>
      </div>
    </motion.div>
  );
}
