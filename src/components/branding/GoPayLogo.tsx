// goPay Logo System - Professional Branding Components

interface LogoProps {
  variant?: 'primary' | 'symbol-only' | 'wordmark-only' | 'dark' | 'light' | 'monochrome' | 'reversed';
  size?: number;
  className?: string;
}

// Primary Logo: Symbol + Wordmark
export function GoPayLogo({ variant = 'primary', size = 120, className = '' }: LogoProps) {
  const colors = {
    primary: {
      green: '#10b981', // emerald-500
      darkGreen: '#059669', // emerald-600
      text: '#1f2937', // gray-800
    },
    dark: {
      green: '#10b981',
      darkGreen: '#059669',
      text: '#ffffff',
    },
    light: {
      green: '#10b981',
      darkGreen: '#059669',
      text: '#1f2937',
    },
    monochrome: {
      green: '#1f2937',
      darkGreen: '#111827',
      text: '#1f2937',
    },
    reversed: {
      green: '#ffffff',
      darkGreen: '#f3f4f6',
      text: '#ffffff',
    },
  };

  const currentColors = colors[variant === 'primary' || variant === 'symbol-only' || variant === 'wordmark-only' ? 'primary' : variant];

  // Symbol Only (for app icon)
  if (variant === 'symbol-only') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Background (for app icon) */}
        <rect width="100" height="100" rx="22" fill={currentColors.green} />
        
        {/* Two-arrow loop symbol */}
        <g transform="translate(50, 50)">
          {/* Top arrow (clockwise) */}
          <path
            d="M -12 -18 L -12 -8 C -12 -2 -8 2 -2 2 L 8 2"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Top arrowhead */}
          <path
            d="M 4 -2 L 8 2 L 4 6"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          
          {/* Bottom arrow (counter-clockwise) */}
          <path
            d="M 12 18 L 12 8 C 12 2 8 -2 2 -2 L -8 -2"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Bottom arrowhead */}
          <path
            d="M -4 2 L -8 -2 L -4 -6"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      </svg>
    );
  }

  // Wordmark Only
  if (variant === 'wordmark-only') {
    return (
      <svg
        width={size * 1.5}
        height={size * 0.4}
        viewBox="0 0 150 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <text
          x="0"
          y="30"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="32"
          fontWeight="700"
          fill={currentColors.text}
        >
          go<tspan fill={currentColors.green}>Pay</tspan>
        </text>
      </svg>
    );
  }

  // Primary: Symbol + Wordmark
  return (
    <svg
      width={size * 2}
      height={size * 0.5}
      viewBox="0 0 200 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Symbol */}
      <g transform="translate(25, 25)">
        {/* Background circle for symbol */}
        <circle cx="0" cy="0" r="22" fill={currentColors.green} />
        
        {/* Two-arrow loop */}
        <g transform="scale(0.7)">
          {/* Top arrow (clockwise) */}
          <path
            d="M -12 -18 L -12 -8 C -12 -2 -8 2 -2 2 L 8 2"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M 4 -2 L 8 2 L 4 6"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          
          {/* Bottom arrow (counter-clockwise) */}
          <path
            d="M 12 18 L 12 8 C 12 2 8 -2 2 -2 L -8 -2"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M -4 2 L -8 -2 L -4 -6"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      </g>

      {/* Wordmark */}
      <g transform="translate(60, 0)">
        <text
          x="0"
          y="33"
          fontFamily="system-ui, -apple-system, 'SF Pro Display', sans-serif"
          fontSize="28"
          fontWeight="700"
          fill={currentColors.text}
          letterSpacing="-0.5"
        >
          go
        </text>
        <text
          x="38"
          y="33"
          fontFamily="system-ui, -apple-system, 'SF Pro Display', sans-serif"
          fontSize="28"
          fontWeight="700"
          fill={currentColors.green}
          letterSpacing="-0.5"
        >
          Pay
        </text>
      </g>
    </svg>
  );
}

// App Icon Component (Rounded Square)
export function GoPayAppIcon({ size = 120, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Gradient background */}
      <defs>
        <linearGradient id="appIconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      
      {/* Rounded square background */}
      <rect width="120" height="120" rx="26" fill="url(#appIconGradient)" />
      
      {/* Two-arrow loop symbol */}
      <g transform="translate(60, 60)">
        {/* Top arrow (clockwise) */}
        <path
          d="M -15 -22 L -15 -10 C -15 -3 -10 2 -3 2 L 10 2"
          stroke="white"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Top arrowhead */}
        <path
          d="M 5 -3 L 10 2 L 5 7"
          stroke="white"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Bottom arrow (counter-clockwise) */}
        <path
          d="M 15 22 L 15 10 C 15 3 10 -2 3 -2 L -10 -2"
          stroke="white"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Bottom arrowhead */}
        <path
          d="M -5 3 L -10 -2 L -5 -7"
          stroke="white"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
    </svg>
  );
}

// Favicon (16x16)
export function GoPayFavicon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="16" height="16" rx="3" fill="#10b981" />
      <g transform="translate(8, 8) scale(0.3)">
        <path
          d="M -12 -18 L -12 -8 C -12 -2 -8 2 -2 2 L 8 2 M 4 -2 L 8 2 L 4 6 M 12 18 L 12 8 C 12 2 8 -2 2 -2 L -8 -2 M -4 2 L -8 -2 L -4 -6"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
    </svg>
  );
}

// Loading animation logo
export function GoPayLogoAnimated({ size = 120 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-pulse"
    >
      <defs>
        <linearGradient id="animatedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981">
            <animate
              attributeName="stop-color"
              values="#10b981;#059669;#10b981"
              dur="2s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor="#059669">
            <animate
              attributeName="stop-color"
              values="#059669;#10b981;#059669"
              dur="2s"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>
      </defs>
      
      <circle cx="50" cy="50" r="45" fill="url(#animatedGradient)" />
      
      <g transform="translate(50, 50)">
        <path
          d="M -15 -22 L -15 -10 C -15 -3 -10 2 -3 2 L 10 2 M 5 -3 L 10 2 L 5 7"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 0 0"
            to="360 0 0"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>
        
        <path
          d="M 15 22 L 15 10 C 15 3 10 -2 3 -2 L -10 -2 M -5 3 L -10 -2 L -5 -7"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 0 0"
            to="-360 0 0"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>
      </g>
    </svg>
  );
}
