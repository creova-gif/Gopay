// Payment Service Logos for Tanzania

export const MPesaLogo = () => (
  <div className="flex items-center justify-center w-full h-full bg-[#00A651] rounded-xl relative overflow-hidden">
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* M-PESA Official Colors: Green #00A651 */}
      <defs>
        <linearGradient id="mpesaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{stopColor: '#00D65F', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#00A651', stopOpacity: 1}} />
        </linearGradient>
      </defs>
      <circle cx="30" cy="50" r="20" fill="url(#mpesaGrad)" opacity="0.3" />
      <text x="50" y="45" textAnchor="middle" fill="white" fontSize="22" fontWeight="900" fontFamily="Arial, sans-serif">
        M-PESA
      </text>
      <text x="50" y="65" textAnchor="middle" fill="white" fontSize="9" fontWeight="600" opacity="0.9">
        Vodacom
      </text>
    </svg>
  </div>
);

export const TigoPesaLogo = () => (
  <div className="flex items-center justify-center w-full h-full bg-[#0066CC] rounded-xl relative overflow-hidden">
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Tigo Official Blue */}
      <defs>
        <linearGradient id="tigoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#0088FF', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#0066CC', stopOpacity: 1}} />
        </linearGradient>
      </defs>
      <circle cx="70" cy="30" r="18" fill="white" opacity="0.15" />
      <circle cx="25" cy="70" r="15" fill="white" opacity="0.1" />
      <text x="50" y="48" textAnchor="middle" fill="white" fontSize="26" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing="1">
        tigo
      </text>
      <text x="50" y="65" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="Arial, sans-serif">
        pesa
      </text>
    </svg>
  </div>
);

export const AirtelMoneyLogo = () => (
  <div className="flex items-center justify-center w-full h-full bg-[#E60000] rounded-xl relative overflow-hidden">
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Airtel Red */}
      <defs>
        <linearGradient id="airtelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor: '#FF0000', stopOpacity: 0.3}} />
          <stop offset="100%" style={{stopColor: '#E60000', stopOpacity: 0.3}} />
        </linearGradient>
      </defs>
      {/* Airtel logo shape */}
      <ellipse cx="50" cy="35" rx="25" ry="12" fill="white" opacity="0.95" />
      <ellipse cx="50" cy="35" rx="15" ry="7" fill="#E60000" />
      <text x="50" y="60" textAnchor="middle" fill="white" fontSize="20" fontWeight="700" fontFamily="Arial, sans-serif">
        airtel
      </text>
      <text x="50" y="75" textAnchor="middle" fill="white" fontSize="13" fontWeight="600" opacity="0.95">
        money
      </text>
    </svg>
  </div>
);

export const HaloPesaLogo = () => (
  <div className="flex items-center justify-center w-full h-full bg-[#8B21A8] rounded-xl relative overflow-hidden">
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Halotel Purple */}
      <defs>
        <radialGradient id="haloGrad">
          <stop offset="0%" style={{stopColor: '#A855F7', stopOpacity: 0.4}} />
          <stop offset="100%" style={{stopColor: '#8B21A8', stopOpacity: 0}} />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="35" fill="url(#haloGrad)" />
      <circle cx="50" cy="35" r="12" fill="none" stroke="white" strokeWidth="3" opacity="0.9" />
      <text x="50" y="62" textAnchor="middle" fill="white" fontSize="22" fontWeight="700" fontFamily="Arial, sans-serif">
        halopesa
      </text>
    </svg>
  </div>
);

export const TANESCOLogo = () => (
  <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-xl relative overflow-hidden">
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Electricity/Lightning theme */}
      <defs>
        <linearGradient id="lightningGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{stopColor: '#FFFFFF', stopOpacity: 0.9}} />
          <stop offset="100%" style={{stopColor: '#FFFFFF', stopOpacity: 0.7}} />
        </linearGradient>
      </defs>
      <path d="M 45 20 L 35 45 L 48 45 L 40 75 L 65 42 L 52 42 L 58 20 Z" fill="url(#lightningGrad)" stroke="#FFA500" strokeWidth="1.5" />
      <text x="50" y="92" textAnchor="middle" fill="white" fontSize="14" fontWeight="900" fontFamily="Arial, sans-serif" letterSpacing="0.5">
        TANESCO
      </text>
    </svg>
  </div>
);

export const DAWASCOLogo = () => (
  <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] rounded-xl relative overflow-hidden">
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Water drops theme */}
      <defs>
        <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{stopColor: '#FFFFFF', stopOpacity: 0.9}} />
          <stop offset="100%" style={{stopColor: '#60A5FA', stopOpacity: 0.8}} />
        </linearGradient>
      </defs>
      <path d="M 50 25 Q 40 35, 40 45 Q 40 55, 50 60 Q 60 55, 60 45 Q 60 35, 50 25 Z" fill="url(#waterGrad)" />
      <path d="M 35 50 Q 30 55, 30 60 Q 30 65, 35 68 Q 40 65, 40 60 Q 40 55, 35 50 Z" fill="white" opacity="0.6" />
      <path d="M 65 45 Q 62 49, 62 53 Q 62 57, 65 59 Q 68 57, 68 53 Q 68 49, 65 45 Z" fill="white" opacity="0.6" />
      <text x="50" y="85" textAnchor="middle" fill="white" fontSize="13" fontWeight="900" fontFamily="Arial, sans-serif" letterSpacing="0.5">
        DAWASCO
      </text>
    </svg>
  </div>
);

export const VodacomLogo = () => (
  <div className="flex items-center justify-center w-full h-full bg-[#E60000] rounded-xl relative overflow-hidden">
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Vodacom Red with speech mark */}
      <defs>
        <linearGradient id="vodaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#FF4444', stopOpacity: 0.3}} />
          <stop offset="100%" style={{stopColor: '#CC0000', stopOpacity: 0.2}} />
        </linearGradient>
      </defs>
      <circle cx="30" cy="35" r="15" fill="white" />
      <path d="M 30 35 L 20 50" stroke="white" strokeWidth="8" strokeLinecap="round" />
      <text x="50" y="60" textAnchor="middle" fill="white" fontSize="22" fontWeight="900" fontFamily="Arial, sans-serif">
        Vodacom
      </text>
    </svg>
  </div>
);

export const DSTVLogo = () => (
  <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-[#003D7A] to-[#002855] rounded-xl relative overflow-hidden">
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* DStv Blue */}
      <defs>
        <linearGradient id="dstvGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor: '#00A3E0', stopOpacity: 0.4}} />
          <stop offset="50%" style={{stopColor: '#FFDD00', stopOpacity: 0.3}} />
          <stop offset="100%" style={{stopColor: '#E60000', stopOpacity: 0.3}} />
        </linearGradient>
      </defs>
      {/* TV screen */}
      <rect x="25" y="28" width="50" height="35" rx="4" fill="white" opacity="0.95" />
      <circle cx="50" cy="45" r="8" fill="#003D7A" />
      <rect x="42" cy="66" width="16" height="3" rx="1.5" fill="white" opacity="0.7" />
      <text x="50" y="88" textAnchor="middle" fill="white" fontSize="20" fontWeight="900" fontFamily="Arial, sans-serif">
        DStv
      </text>
    </svg>
  </div>
);

export const TRALogo = () => (
  <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-[#1E40AF] to-[#1E3A8A] rounded-xl relative overflow-hidden">
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Tanzania Revenue Authority - Official Government Style */}
      <defs>
        <linearGradient id="traGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{stopColor: '#FFD700', stopOpacity: 0.3}} />
          <stop offset="100%" style={{stopColor: '#1E40AF', stopOpacity: 0.1}} />
        </linearGradient>
      </defs>
      <rect x="20" y="25" width="60" height="45" rx="5" fill="white" opacity="0.15" />
      <rect x="25" y="30" width="50" height="35" rx="4" fill="white" opacity="0.95" />
      <text x="50" y="55" textAnchor="middle" fill="#1E40AF" fontSize="26" fontWeight="900" fontFamily="Arial, sans-serif">
        TRA
      </text>
      <text x="50" y="88" textAnchor="middle" fill="white" fontSize="9" fontWeight="700" opacity="0.9">
        Tax Authority
      </text>
    </svg>
  </div>
);

export const NHIFLogo = () => (
  <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-[#059669] to-[#047857] rounded-xl relative overflow-hidden">
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* National Health Insurance Fund */}
      <defs>
        <linearGradient id="nhifGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{stopColor: '#FFFFFF', stopOpacity: 0.3}} />
          <stop offset="100%" style={{stopColor: '#047857', stopOpacity: 0.1}} />
        </linearGradient>
      </defs>
      {/* Medical cross + shield */}
      <path d="M 50 20 L 60 28 L 65 45 L 65 65 L 50 75 L 35 65 L 35 45 L 40 28 Z" fill="white" opacity="0.95" />
      <rect x="45" y="35" width="10" height="25" rx="2" fill="#059669" />
      <rect x="38" y="42" width="24" height="10" rx="2" fill="#059669" />
      <text x="50" y="92" textAnchor="middle" fill="white" fontSize="16" fontWeight="900" fontFamily="Arial, sans-serif" letterSpacing="0.5">
        NHIF
      </text>
    </svg>
  </div>
);

export const CRDBLogo = () => (
  <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-[#1E3A8A] to-[#1E40AF] rounded-xl">
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* CRDB Bank Blue */}
      <rect x="20" y="30" width="60" height="35" rx="4" fill="white" opacity="0.95" />
      <rect x="24" y="34" width="52" height="27" rx="2" fill="#1E3A8A" opacity="0.1" />
      <circle cx="67" cy="47" r="6" fill="#FFD700" />
      <text x="50" y="82" textAnchor="middle" fill="white" fontSize="18" fontWeight="900" fontFamily="Arial, sans-serif">
        CRDB
      </text>
      <text x="50" y="93" textAnchor="middle" fill="white" fontSize="8" fontWeight="600" opacity="0.8">
        BANK
      </text>
    </svg>
  </div>
);

export const NMBLogo = () => (
  <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-[#16A34A] to-[#15803D] rounded-xl">
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* NMB Bank Green */}
      <path d="M 25 50 L 50 30 L 75 50 L 75 70 L 25 70 Z" fill="white" opacity="0.95" />
      <rect x="45" y="50" width="10" height="20" fill="#16A34A" opacity="0.3" />
      <text x="50" y="86" textAnchor="middle" fill="white" fontSize="22" fontWeight="900" fontFamily="Arial, sans-serif">
        NMB
      </text>
    </svg>
  </div>
);

export const KCBLogo = () => (
  <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-[#1E3A8A] to-[#172554] rounded-xl">
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* KCB Bank - Kenya Commercial Bank Blue */}
      <circle cx="50" cy="42" r="20" fill="white" opacity="0.95" />
      <text x="50" y="52" textAnchor="middle" fill="#1E3A8A" fontSize="24" fontWeight="900" fontFamily="Arial, sans-serif">
        KCB
      </text>
      <text x="50" y="85" textAnchor="middle" fill="white" fontSize="11" fontWeight="700">
        Bank
      </text>
    </svg>
  </div>
);

export const ZantelLogo = () => (
  <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-[#FF6B00] to-[#FF8C00] rounded-xl">
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Zantel Orange */}
      <circle cx="35" cy="40" r="12" fill="white" opacity="0.3" />
      <circle cx="65" cy="60" r="15" fill="white" opacity="0.2" />
      <text x="50" y="55" textAnchor="middle" fill="white" fontSize="24" fontWeight="900" fontFamily="Arial, sans-serif">
        Zantel
      </text>
    </svg>
  </div>
);

export const AzamTVLogo = () => (
  <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-[#DC2626] to-[#991B1B] rounded-xl">
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Azam TV Red */}
      <rect x="25" y="30" width="50" height="35" rx="4" fill="white" opacity="0.95" />
      <circle cx="50" cy="47" r="8" fill="#DC2626" />
      <path d="M 47 44 L 53 47 L 47 50 Z" fill="white" />
      <text x="50" y="85" textAnchor="middle" fill="white" fontSize="18" fontWeight="900" fontFamily="Arial, sans-serif">
        Azam TV
      </text>
    </svg>
  </div>
);

export const StarTimesTVLogo = () => (
  <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] rounded-xl">
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* StarTimes Purple */}
      <path d="M 50 25 L 55 40 L 70 42 L 58 52 L 62 67 L 50 58 L 38 67 L 42 52 L 30 42 L 45 40 Z" fill="white" opacity="0.95" />
      <text x="50" y="88" textAnchor="middle" fill="white" fontSize="14" fontWeight="900" fontFamily="Arial, sans-serif">
        StarTimes
      </text>
    </svg>
  </div>
);