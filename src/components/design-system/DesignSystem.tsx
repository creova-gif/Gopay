/**
 * GOPAY TANZANIA - FINTECH-GRADE DESIGN SYSTEM
 * 
 * Based on real-world patterns from:
 * - M-Pesa, Wave (Mobile Money)
 * - Revolut, Nubank (Neo-Banking)
 * - PayPal, Stripe (Global Payments)
 * - GrabPay, Alipay (Super Apps)
 * 
 * WCAG 2.1 AA+ Compliant
 * Swahili-First, Mobile-Optimized
 */

import { motion } from 'motion/react';
import { Check, X, AlertCircle, Info, Loader2 } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// BUTTON COMPONENTS (Fintech-Grade States)
// ═══════════════════════════════════════════════════════════════

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export function FinButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  className = ''
}: ButtonProps) {
  
  const baseStyles = "font-semibold rounded-xl transition-all duration-200 ease-out active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40",
    secondary: "bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg shadow-teal-500/30",
    outline: "border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-700",
    ghost: "text-emerald-700 hover:bg-emerald-50",
    danger: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-500/30"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm min-h-[36px]",
    md: "px-6 py-3 text-base min-h-[44px]",
    lg: "px-8 py-4 text-lg min-h-[52px]",
    xl: "px-10 py-5 text-xl min-h-[60px]"
  };
  
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ duration: 0.1 }}
    >
      {loading ? (
        <>
          <Loader2 className="size-5 animate-spin" />
          <span>Inasubiri...</span>
        </>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════════
// INPUT COMPONENTS (Fintech Best Practices)
// ═══════════════════════════════════════════════════════════════

interface InputProps {
  label?: string;
  labelSw?: string; // Swahili label
  labelEn?: string; // English label
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'tel' | 'email' | 'number' | 'password';
  error?: string;
  success?: boolean;
  disabled?: boolean;
  required?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  helperText?: string;
  maxLength?: number;
  autoFocus?: boolean;
}

export function FinInput({
  label,
  labelSw,
  labelEn,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
  success = false,
  disabled = false,
  required = false,
  prefix,
  suffix,
  helperText,
  maxLength,
  autoFocus = false
}: InputProps) {
  
  return (
    <div className="space-y-2">
      {/* Label (Swahili-First) */}
      {(label || labelSw) && (
        <div className="space-y-0.5">
          <label className="block text-sm font-semibold text-gray-900">
            {labelSw || label}
            {required && <span className="text-red-600 ml-1">*</span>}
          </label>
          {labelEn && (
            <p className="text-xs text-gray-600">{labelEn}</p>
          )}
        </div>
      )}
      
      {/* Input Container */}
      <div className="relative">
        {prefix && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
            {prefix}
          </div>
        )}
        
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          autoFocus={autoFocus}
          className={`
            w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
            ${prefix ? 'pl-12' : ''}
            ${suffix ? 'pr-12' : ''}
            ${error 
              ? 'border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-100' 
              : success
                ? 'border-green-500 focus:border-green-600 focus:ring-4 focus:ring-green-100'
                : 'border-gray-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100'
            }
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            text-base text-gray-900 placeholder:text-gray-400
            outline-none
          `}
        />
        
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {suffix}
          </div>
        )}
        
        {/* Status Icon */}
        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <AlertCircle className="size-5 text-red-600" />
          </div>
        )}
        {success && !error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Check className="size-5 text-green-600" />
          </div>
        )}
      </div>
      
      {/* Helper Text / Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 font-medium flex items-center gap-1"
        >
          <AlertCircle className="size-4" />
          {error}
        </motion.p>
      )}
      {helperText && !error && (
        <p className="text-xs text-gray-600">{helperText}</p>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// AMOUNT INPUT (Fintech-Specific)
// ═══════════════════════════════════════════════════════════════

interface AmountInputProps {
  value: number;
  onChange: (value: number) => void;
  currency?: string;
  label?: string;
  error?: string;
  max?: number;
  min?: number;
}

export function AmountInput({
  value,
  onChange,
  currency = 'TZS',
  label = 'Kiasi',
  error,
  max,
  min = 0
}: AmountInputProps) {
  
  const formatAmount = (num: number) => {
    return new Intl.NumberFormat('sw-TZ').format(num);
  };
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-900">
        {label}
        <span className="text-xs text-gray-600 ml-2">Amount</span>
      </label>
      
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-semibold">
          {currency}
        </div>
        
        <input
          type="text"
          inputMode="numeric"
          value={formatAmount(value)}
          onChange={(e) => {
            const cleaned = e.target.value.replace(/[^0-9]/g, '');
            const num = parseInt(cleaned || '0');
            if (max && num > max) return;
            if (num < min) return;
            onChange(num);
          }}
          className={`
            w-full pl-20 pr-4 py-6 rounded-2xl border-2 
            ${error ? 'border-red-500' : 'border-gray-200 focus:border-emerald-600'}
            focus:ring-4 focus:ring-emerald-100
            text-3xl font-bold text-gray-900 text-right
            tabular-nums tracking-tight
            outline-none transition-all duration-200
          `}
          placeholder="0"
        />
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-red-600 font-medium"
        >
          {error}
        </motion.p>
      )}
      
      {/* Quick Amount Buttons (Wave/M-Pesa Pattern) */}
      <div className="grid grid-cols-4 gap-2">
        {[1000, 5000, 10000, 50000].map((amount) => (
          <button
            key={amount}
            onClick={() => onChange(amount)}
            className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-700 rounded-lg text-sm font-semibold transition-all active:scale-95"
          >
            +{formatAmount(amount)}
          </button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ALERT / MESSAGE COMPONENTS (PayPal/Stripe Pattern)
// ═══════════════════════════════════════════════════════════════

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function FinAlert({
  type,
  title,
  message,
  action,
  dismissible = false,
  onDismiss
}: AlertProps) {
  
  const styles = {
    success: {
      bg: 'bg-green-50 border-green-200',
      icon: 'text-green-600',
      text: 'text-green-800',
      IconComponent: Check
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      icon: 'text-red-600',
      text: 'text-red-800',
      IconComponent: AlertCircle
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200',
      icon: 'text-amber-600',
      text: 'text-amber-800',
      IconComponent: AlertCircle
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      icon: 'text-blue-600',
      text: 'text-blue-800',
      IconComponent: Info
    }
  };
  
  const { bg, icon, text, IconComponent } = styles[type];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`${bg} border-2 rounded-xl p-4 flex items-start gap-3`}
    >
      <div className={`${icon} flex-shrink-0 mt-0.5`}>
        <IconComponent className="size-5" />
      </div>
      
      <div className="flex-1 space-y-1">
        {title && (
          <h4 className={`${text} font-bold text-sm`}>{title}</h4>
        )}
        <p className={`${text} text-sm leading-relaxed`}>{message}</p>
        
        {action && (
          <button
            onClick={action.onClick}
            className={`${text} font-semibold text-sm underline hover:no-underline mt-2`}
          >
            {action.label}
          </button>
        )}
      </div>
      
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className={`${icon} hover:opacity-70 transition-opacity flex-shrink-0`}
        >
          <X className="size-5" />
        </button>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CARD COMPONENTS (Super App Pattern)
// ═══════════════════════════════════════════════════════════════

interface FinCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'outline' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function FinCard({
  children,
  onClick,
  variant = 'default',
  padding = 'md',
  className = ''
}: FinCardProps) {
  
  const variants = {
    default: 'bg-white border border-gray-100 shadow-md',
    elevated: 'bg-white shadow-xl',
    outline: 'bg-white border-2 border-gray-200',
    gradient: 'bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100'
  };
  
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6'
  };
  
  const Component = onClick ? motion.button : 'div';
  
  return (
    <Component
      onClick={onClick}
      className={`
        ${variants[variant]} ${paddings[padding]}
        rounded-2xl transition-all duration-200
        ${onClick ? 'hover:shadow-lg active:scale-[0.99] cursor-pointer' : ''}
        ${className}
      `}
      {...(onClick ? { whileTap: { scale: 0.99 } } : {})}
    >
      {children}
    </Component>
  );
}

// ═══════════════════════════════════════════════════════════════
// LOADING STATES (Fintech Standard)
// ═══════════════════════════════════════════════════════════════

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 space-y-3 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="h-6 bg-gray-200 rounded w-full"></div>
    </div>
  );
}

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'size-4',
    md: 'size-6',
    lg: 'size-8'
  };
  
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className={`${sizes[size]} text-emerald-600 animate-spin`} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// BOTTOM SHEET (Mobile Pattern)
// ═══════════════════════════════════════════════════════════════

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: 'auto' | 'half' | 'full';
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  height = 'auto'
}: BottomSheetProps) {
  
  if (!isOpen) return null;
  
  const heights = {
    auto: 'max-h-[90vh]',
    half: 'h-[50vh]',
    full: 'h-[95vh]'
  };
  
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      />
      
      {/* Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl ${heights[height]} overflow-hidden z-50 max-w-md mx-auto`}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>
        
        {/* Header */}
        {title && (
          <div className="px-5 py-3 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          </div>
        )}
        
        {/* Content */}
        <div className="overflow-y-auto p-5">
          {children}
        </div>
      </motion.div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// EXPORT ALL COMPONENTS
// ═══════════════════════════════════════════════════════════════

export const DesignSystem = {
  Button: FinButton,
  Input: FinInput,
  AmountInput,
  Alert: FinAlert,
  Card: FinCard,
  SkeletonCard,
  LoadingSpinner,
  BottomSheet
};
