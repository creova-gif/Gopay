import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Delete } from 'lucide-react';
import { colors } from '../../design-system/tokens';

interface PinPadProps {
  length?: number;
  onComplete: (pin: string) => void;
  onReset?: () => void;
  label?: string;
  sublabel?: string;
  error?: string;
  disabled?: boolean;
  shake?: boolean;
}

export function PinPad({
  length = 6,
  onComplete,
  onReset,
  label = 'Ingiza PIN yako ya siri',
  sublabel,
  error,
  disabled = false,
  shake = false,
}: PinPadProps) {
  const [pin, setPin] = useState('');
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    if (shake) {
      setShaking(true);
      setTimeout(() => {
        setShaking(false);
        setPin('');
        onReset?.();
      }, 600);
    }
  }, [shake]);

  useEffect(() => {
    if (pin.length === length && !disabled) {
      onComplete(pin);
    }
  }, [pin, length]);

  const handlePress = (digit: string) => {
    if (disabled || pin.length >= length) return;
    if (navigator.vibrate) navigator.vibrate(8);
    setPin(prev => prev + digit);
  };

  const handleDelete = () => {
    if (disabled) return;
    if (navigator.vibrate) navigator.vibrate(8);
    setPin(prev => prev.slice(0, -1));
  };

  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', 'del'],
  ];

  return (
    <div className="flex flex-col items-center gap-6 select-none">
      {/* Label */}
      <div className="text-center">
        <p style={{ fontSize: '16px', fontWeight: 500, color: colors.text.primary }}>
          {label}
        </p>
        {sublabel && (
          <p style={{ fontSize: '13px', color: colors.text.secondary, marginTop: '4px' }}>
            {sublabel}
          </p>
        )}
      </div>

      {/* PIN dots */}
      <motion.div
        className="flex items-center gap-4"
        animate={shaking ? {
          x: [-12, 12, -10, 10, -6, 6, 0],
          transition: { duration: 0.5 }
        } : {}}
      >
        {Array.from({ length }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: i === pin.length - 1 ? [1, 1.3, 1] : 1,
            }}
            transition={{ duration: 0.15 }}
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: i < pin.length
                ? (error ? colors.semantic.error : colors.brand.primary)
                : colors.border.emphasis,
              transition: 'background 0.15s ease',
            }}
          />
        ))}
      </motion.div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{ fontSize: '13px', color: colors.semantic.error, textAlign: 'center' }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Numpad */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
        {keys.flat().map((key, idx) => {
          if (key === '') return <div key={idx} />;

          const isDelete = key === 'del';

          return (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.88 }}
              onPointerDown={() => isDelete ? handleDelete() : handlePress(key)}
              disabled={disabled || (key !== 'del' && pin.length >= length)}
              className="flex items-center justify-center rounded-2xl transition-colors"
              style={{
                height: '64px',
                background: isDelete ? 'transparent' : colors.surface.card,
                border: isDelete ? 'none' : `1px solid ${colors.border.subtle}`,
                fontSize: '24px',
                fontWeight: 600,
                color: disabled ? colors.text.disabled : colors.text.primary,
                cursor: disabled ? 'default' : 'pointer',
              }}
            >
              {isDelete ? (
                <Delete
                  size={22}
                  style={{ color: pin.length > 0 ? colors.text.secondary : colors.text.disabled }}
                />
              ) : (
                key
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// Compact inline version for use inside forms
interface InlinePinProps {
  value: string;
  onChange: (val: string) => void;
  length?: number;
  disabled?: boolean;
  error?: string;
}

export function InlinePinPad({ value, onChange, length = 4, disabled, error }: InlinePinProps) {
  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', 'del'],
  ];

  const handlePress = (digit: string) => {
    if (disabled || value.length >= length) return;
    if (navigator.vibrate) navigator.vibrate(8);
    onChange(value + digit);
  };

  const handleDelete = () => {
    if (disabled) return;
    if (navigator.vibrate) navigator.vibrate(8);
    onChange(value.slice(0, -1));
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Dots */}
      <div className="flex items-center gap-3">
        {Array.from({ length }).map((_, i) => (
          <div
            key={i}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: i < value.length
                ? (error ? colors.semantic.error : colors.brand.primary)
                : colors.border.emphasis,
            }}
          />
        ))}
      </div>

      {error && (
        <p style={{ fontSize: '12px', color: colors.semantic.error }}>{error}</p>
      )}

      <div className="grid grid-cols-3 gap-2 w-full">
        {keys.flat().map((key, idx) => {
          if (key === '') return <div key={idx} />;
          const isDelete = key === 'del';
          return (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.9 }}
              onPointerDown={() => isDelete ? handleDelete() : handlePress(key)}
              disabled={disabled}
              className="flex items-center justify-center rounded-xl"
              style={{
                height: '52px',
                background: isDelete ? 'transparent' : colors.surface.card,
                border: isDelete ? 'none' : `1px solid ${colors.border.subtle}`,
                fontSize: '20px',
                fontWeight: 600,
                color: colors.text.primary,
              }}
            >
              {isDelete ? <Delete size={18} style={{ color: colors.text.secondary }} /> : key}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
