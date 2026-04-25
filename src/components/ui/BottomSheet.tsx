import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { colors } from '../../design-system/tokens';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  snapPoints?: ('half' | 'full' | 'auto');
  showHandle?: boolean;
  showCloseButton?: boolean;
}

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  snapPoints = 'auto',
  showHandle = true,
  showCloseButton = false,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const maxHeight = snapPoints === 'full' ? '95vh'
    : snapPoints === 'half' ? '55vh'
    : 'auto';

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{ background: colors.surface.overlay, backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 overflow-hidden"
            style={{
              background: colors.surface.elevated,
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              maxHeight,
              overflowY: 'auto',
              paddingBottom: 'env(safe-area-inset-bottom)',
            }}
            role="dialog"
            aria-modal="true"
          >
            {/* Handle */}
            {showHandle && (
              <div className="flex justify-center pt-3 pb-1">
                <div style={{
                  width: '36px',
                  height: '4px',
                  borderRadius: '2px',
                  background: colors.border.emphasis,
                }} />
              </div>
            )}

            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-5 py-3">
                {title && (
                  <p style={{ fontSize: '17px', fontWeight: 600, color: colors.text.primary }}>
                    {title}
                  </p>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    aria-label="Close"
                    className="p-2 rounded-full transition-colors"
                    style={{ background: colors.surface.card }}
                  >
                    <X size={18} style={{ color: colors.text.secondary }} />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="px-5 pb-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
