// goPay Logo System - Professional Branding Components
import goPayFullLogo from 'figma:asset/98afe81bcbb1a7e34c954b6407e7a22ada0d8e25.png';
import goPayIconLogo from 'figma:asset/ab19668ea249ab338ceb903f49bc1aff5296e126.png';

interface LogoProps {
  variant?: 'primary' | 'symbol-only' | 'wordmark-only' | 'dark' | 'light' | 'monochrome' | 'reversed';
  size?: number;
  className?: string;
}

// Primary Logo: Symbol + Wordmark (Full horizontal logo)
export function GoPayLogo({ variant = 'primary', size = 120, className = '' }: LogoProps) {
  // Symbol Only (for app icon)
  if (variant === 'symbol-only') {
    return (
      <img
        src={goPayIconLogo}
        alt="goPay"
        width={size}
        height={size}
        className={className}
        style={{ width: size, height: size }}
      />
    );
  }

  // Wordmark Only - use full logo
  if (variant === 'wordmark-only') {
    return (
      <img
        src={goPayFullLogo}
        alt="goPay"
        width={size * 2}
        height={size * 0.5}
        className={className}
        style={{ width: size * 2, height: 'auto' }}
      />
    );
  }

  // Primary: Full horizontal logo (default)
  return (
    <img
      src={goPayFullLogo}
      alt="goPay"
      width={size * 2}
      height={size * 0.5}
      className={className}
      style={{ width: size * 2, height: 'auto' }}
    />
  );
}

// App Icon Component (Circular icon logo)
export function GoPayAppIcon({ size = 120, className = '' }: { size?: number; className?: string }) {
  return (
    <img
      src={goPayIconLogo}
      alt="goPay App Icon"
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}

// Favicon (16x16) - use icon logo
export function GoPayFavicon() {
  return (
    <img
      src={goPayIconLogo}
      alt="goPay"
      width={16}
      height={16}
      style={{ width: 16, height: 16 }}
    />
  );
}

// Loading animation logo - use icon with pulse animation
export function GoPayLogoAnimated({ size = 120 }: { size?: number }) {
  return (
    <img
      src={goPayIconLogo}
      alt="goPay"
      width={size}
      height={size}
      className="animate-pulse"
      style={{ width: size, height: size }}
    />
  );
}
