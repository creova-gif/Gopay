/**
 * BILINGUAL UI COMPONENTS
 * 
 * Components that handle Swahili-first display with English secondary
 * 
 * PATTERN (WeChat/Alipay style):
 * ┌──────────────────┐
 * │ Tuma Pesa       │ <- Swahili (bold, large)
 * │ Send Money      │ <- English (light, small)
 * └──────────────────┘
 * 
 * USAGE:
 * <BilingualText sw="Tuma Pesa" en="Send Money" />
 * <BilingualButton sw="Endelea" en="Continue" onClick={...} />
 * <BilingualHeading sw="Huduma" en="Services" />
 */

import React from 'react';
import { toast } from 'sonner';
import { BilingualText as BilingualTextType } from '../utils/language-system';
import { cn } from '../utils/ui/utils';

// ════════════════════════════════════════════════════════════
// TEXT COMPONENT (Most common)
// ════════════════════════════════════════════════════════════

interface BilingualTextProps {
  sw: string;
  en: string;
  swClassName?: string;
  enClassName?: string;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export function BilingualText({ 
  sw, 
  en, 
  swClassName, 
  enClassName, 
  className,
  align = 'left' 
}: BilingualTextProps) {
  const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
  
  return (
    <div className={cn(alignClass, className)}>
      <p className={cn('font-bold text-gray-900', swClassName)}>
        {sw}
      </p>
      <p className={cn('text-sm text-gray-600', enClassName)}>
        {en}
      </p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// HEADING COMPONENT
// ════════════════════════════════════════════════════════════

interface BilingualHeadingProps {
  sw: string;
  en: string;
  level?: 1 | 2 | 3;
  className?: string;
}

export function BilingualHeading({ sw, en, level = 1, className }: BilingualHeadingProps) {
  const swSizes = {
    1: 'text-3xl',
    2: 'text-2xl',
    3: 'text-xl'
  };
  
  const enSizes = {
    1: 'text-base',
    2: 'text-sm',
    3: 'text-xs'
  };
  
  return (
    <div className={className}>
      <h1 className={cn('font-black text-gray-900', swSizes[level])}>
        {sw}
      </h1>
      <p className={cn('text-gray-600 font-medium mt-1', enSizes[level])}>
        {en}
      </p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// BUTTON COMPONENT
// ════════════════════════════════════════════════════════════

interface BilingualButtonProps {
  sw: string;
  en: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export function BilingualButton({ 
  sw, 
  en, 
  onClick, 
  variant = 'primary',
  size = 'md',
  disabled = false,
  className,
  icon,
  iconPosition = 'left'
}: BilingualButtonProps) {
  const baseClasses = 'rounded-2xl font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 shadow-lg hover:shadow-xl',
    secondary: 'bg-white border-2 border-gray-200 text-gray-900 hover:border-emerald-500 hover:shadow-md',
    ghost: 'bg-transparent text-emerald-600 hover:bg-emerald-50'
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg'
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], disabledClasses, className)}
    >
      {icon && iconPosition === 'left' && icon}
      <div className="flex flex-col items-center gap-0.5">
        <span className="font-black">{sw}</span>
        <span className="text-xs opacity-80">{en}</span>
      </div>
      {icon && iconPosition === 'right' && icon}
    </button>
  );
}

// ════════════════════════════════════════════════════════════
// CARD HEADER COMPONENT
// ════════════════════════════════════════════════════════════

interface BilingualCardHeaderProps {
  sw: string;
  en: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function BilingualCardHeader({ sw, en, icon, action, className }: BilingualCardHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      <div className="flex items-center gap-3">
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <div>
          <h2 className="text-lg font-black text-gray-900">{sw}</h2>
          <p className="text-xs text-gray-600">{en}</p>
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// LIST ITEM COMPONENT
// ════════════════════════════════════════════════════════════

interface BilingualListItemProps {
  sw: string;
  en: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function BilingualListItem({ sw, en, icon, badge, onClick, className }: BilingualListItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 p-4 bg-white hover:bg-gray-50 rounded-2xl border border-gray-200 hover:border-emerald-500 hover:shadow-md transition-all active:scale-[0.99] text-left',
        className
      )}
    >
      {icon && (
        <div className="flex-shrink-0">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-900 truncate">{sw}</p>
        <p className="text-xs text-gray-600 truncate">{en}</p>
      </div>
      {badge && (
        <div className="flex-shrink-0">
          {badge}
        </div>
      )}
    </button>
  );
}

// ════════════════════════════════════════════════════════════
// LABEL COMPONENT (For form fields)
// ════════════════════════════════════════════════════════════

interface BilingualLabelProps {
  sw: string;
  en: string;
  required?: boolean;
  className?: string;
}

export function BilingualLabel({ sw, en, required, className }: BilingualLabelProps) {
  return (
    <label className={cn('block mb-2', className)}>
      <span className="text-sm font-bold text-gray-900">
        {sw}
        {required && <span className="text-red-600 ml-1">*</span>}
      </span>
      <span className="text-xs text-gray-600 ml-2">{en}</span>
    </label>
  );
}

// ════════════════════════════════════════════════════════════
// BADGE COMPONENT
// ════════════════════════════════════════════════════════════

interface BilingualBadgeProps {
  sw: string;
  en: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export function BilingualBadge({ sw, en, variant = 'default', className }: BilingualBadgeProps) {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-900',
    success: 'bg-green-100 text-green-900',
    warning: 'bg-orange-100 text-orange-900',
    error: 'bg-red-100 text-red-900',
    info: 'bg-blue-100 text-blue-900'
  };
  
  return (
    <div className={cn('inline-flex flex-col items-center px-3 py-1.5 rounded-full text-center', variantClasses[variant], className)}>
      <span className="text-xs font-bold leading-tight">{sw}</span>
      <span className="text-[10px] opacity-70 leading-tight">{en}</span>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// TAB COMPONENT
// ════════════════════════════════════════════════════════════

interface BilingualTabProps {
  sw: string;
  en: string;
  active?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function BilingualTab({ sw, en, active, onClick, icon, className }: BilingualTabProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-1 px-4 py-3 rounded-2xl transition-all',
        active 
          ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        className
      )}
    >
      {icon && <div className="mb-1">{icon}</div>}
      <span className="text-sm font-bold">{sw}</span>
      <span className="text-xs opacity-70">{en}</span>
    </button>
  );
}

// ════════════════════════════════════════════════════════════
// SECTION HEADER COMPONENT
// ════════════════════════════════════════════════════════════

interface BilingualSectionHeaderProps {
  sw: string;
  en: string;
  icon?: React.ReactNode;
  action?: {
    swText: string;
    enText: string;
    onClick: () => void;
  };
  className?: string;
}

export function BilingualSectionHeader({ sw, en, icon, action, className }: BilingualSectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      <div className="flex items-center gap-2">
        {icon}
        <div>
          <h2 className="text-lg font-black text-gray-900">{sw}</h2>
          <p className="text-xs text-gray-600">{en}</p>
        </div>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors flex flex-col items-end"
        >
          <span>{action.swText}</span>
          <span className="text-xs opacity-70">{action.enText}</span>
        </button>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// EMPTY STATE COMPONENT
// ════════════════════════════════════════════════════════════

interface BilingualEmptyStateProps {
  sw: string;
  en: string;
  icon?: React.ReactNode;
  action?: {
    swText: string;
    enText: string;
    onClick: () => void;
  };
  className?: string;
}

export function BilingualEmptyState({ sw, en, icon, action, className }: BilingualEmptyStateProps) {
  return (
    <div className={cn('text-center py-12', className)}>
      {icon && <div className="flex justify-center mb-4">{icon}</div>}
      <h3 className="text-lg font-bold text-gray-900 mb-1">{sw}</h3>
      <p className="text-sm text-gray-600 mb-6">{en}</p>
      {action && (
        <BilingualButton
          sw={action.swText}
          en={action.enText}
          onClick={action.onClick}
          variant="primary"
        />
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// TOAST/NOTIFICATION COMPONENT
// ════════════════════════════════════════════════════════════

interface BilingualToastProps {
  sw: string;
  en: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
  icon?: React.ReactNode;
  className?: string;
}

export function BilingualToast({ sw, en, variant = 'info', icon, className }: BilingualToastProps) {
  const variantClasses = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    warning: 'bg-orange-600 text-white',
    info: 'bg-blue-600 text-white'
  };
  
  return (
    <div className={cn(
      'flex items-center gap-3 p-4 rounded-2xl shadow-xl',
      variantClasses[variant],
      className
    )}>
      {icon}
      <div className="flex-1">
        <p className="font-bold">{sw}</p>
        <p className="text-sm opacity-90">{en}</p>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// USAGE EXAMPLES (For documentation)
// ════════════════════════════════════════════════════════════

export const BilingualUIExamples = () => {
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <BilingualHeading sw="Mfano wa Matumizi" en="Usage Examples" />
      
      {/* Text */}
      <div>
        <h3 className="text-sm font-bold text-gray-600 mb-4">BilingualText</h3>
        <BilingualText sw="Tuma Pesa" en="Send Money" />
      </div>
      
      {/* Button */}
      <div>
        <h3 className="text-sm font-bold text-gray-600 mb-4">BilingualButton</h3>
        <BilingualButton sw="Endelea" en="Continue" onClick={() => toast.error('Clicked!')} />
      </div>
      
      {/* List Item */}
      <div>
        <h3 className="text-sm font-bold text-gray-600 mb-4">BilingualListItem</h3>
        <BilingualListItem
          sw="Lipa Bili"
          en="Pay Bills"
          icon={<div className="w-10 h-10 bg-blue-600 rounded-xl" />}
          badge={<span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">NEW</span>}
        />
      </div>
      
      {/* Tab */}
      <div>
        <h3 className="text-sm font-bold text-gray-600 mb-4">BilingualTab</h3>
        <div className="flex gap-2">
          <BilingualTab sw="Huduma" en="Services" active />
          <BilingualTab sw="Tuzo" en="Rewards" />
        </div>
      </div>
      
      {/* Badge */}
      <div>
        <h3 className="text-sm font-bold text-gray-600 mb-4">BilingualBadge</h3>
        <div className="flex gap-2">
          <BilingualBadge sw="Umefanikiwa" en="Success" variant="success" />
          <BilingualBadge sw="Hitilafu" en="Error" variant="error" />
          <BilingualBadge sw="Onyo" en="Warning" variant="warning" />
        </div>
      </div>
    </div>
  );
};
