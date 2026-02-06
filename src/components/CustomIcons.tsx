// Custom branded icons for goPay Tanzania
// Unique designs that don't look AI-generated

interface IconProps {
  className?: string;
}

// Wallet Icon - Custom gradient design
export function WalletIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="walletGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <rect x="3" y="6" width="18" height="13" rx="3" stroke="url(#walletGrad)" strokeWidth="2" fill="none"/>
      <path d="M3 10h18" stroke="url(#walletGrad)" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="16" cy="14" r="1.5" fill="url(#walletGrad)"/>
      <path d="M7 6V5a2 2 0 012-2h6a2 2 0 012 2v1" stroke="url(#walletGrad)" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// Send Money Icon - Custom arrow design
export function SendMoneyIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sendGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <path d="M22 2L11 13" stroke="url(#sendGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="url(#sendGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="url(#sendGrad)" fillOpacity="0.1"/>
    </svg>
  );
}

// Request Money Icon
export function RequestMoneyIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="requestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      <path d="M2 22L13 11" stroke="url(#requestGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 22L9 2L13 11L22 15L2 22Z" stroke="url(#requestGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="url(#requestGrad)" fillOpacity="0.1"/>
    </svg>
  );
}

// QR Scan Icon - Modern design
export function QRScanIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="qrGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <path d="M3 7V5a2 2 0 012-2h2M3 17v2a2 2 0 002 2h2M21 7V5a2 2 0 00-2-2h-2M21 17v2a2 2 0 01-2 2h-2" stroke="url(#qrGrad)" strokeWidth="2.5" strokeLinecap="round"/>
      <rect x="8" y="8" width="3" height="3" fill="url(#qrGrad)" rx="0.5"/>
      <rect x="13" y="8" width="3" height="3" fill="url(#qrGrad)" rx="0.5"/>
      <rect x="8" y="13" width="3" height="3" fill="url(#qrGrad)" rx="0.5"/>
      <rect x="13" y="13" width="3" height="3" fill="url(#qrGrad)" rx="0.5"/>
    </svg>
  );
}

// Bills Icon - Electric bolt style
export function BillsIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="billsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
      <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" fill="url(#billsGrad)" stroke="url(#billsGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Travel Icon - Airplane with trail
export function TravelIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="travelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="url(#travelGrad)" strokeWidth="2" fill="none"/>
      <path d="M2 9h20" stroke="url(#travelGrad)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M9 22V12h6v10" stroke="url(#travelGrad)" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="8" y="14" r="0.5" fill="url(#travelGrad)"/>
      <circle cx="16" cy="14" r="0.5" fill="url(#travelGrad)"/>
    </svg>
  );
}

// Shop Icon - Shopping bag
export function ShopIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>
      </defs>
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" stroke="url(#shopGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M3 6h18" stroke="url(#shopGrad)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 10a4 4 0 11-8 0" stroke="url(#shopGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Rewards Icon - Star with sparkle
export function RewardsIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rewardsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#rewardsGrad)" stroke="url(#rewardsGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="18" cy="6" r="1" fill="#fbbf24"/>
      <circle cx="6" cy="18" r="1" fill="#fbbf24"/>
    </svg>
  );
}

// Profile Icon - User silhouette
export function ProfileIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="profileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="8" r="4" stroke="url(#profileGrad)" strokeWidth="2" fill="none"/>
      <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="url(#profileGrad)" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// History Icon - Clock with circular arrow
export function HistoryIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="historyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="9" stroke="url(#historyGrad)" strokeWidth="2" fill="none"/>
      <path d="M12 6v6l4 2" stroke="url(#historyGrad)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M3 12a9 9 0 009-9" stroke="url(#historyGrad)" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// Home Icon - House
export function HomeIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="homeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="url(#homeGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M9 22V12h6v10" stroke="url(#homeGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Settings Icon - Gear
export function SettingsIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="settingsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="3" stroke="url(#settingsGrad)" strokeWidth="2" fill="none"/>
      <path d="M12 1v6m0 6v6M23 12h-6m-6 0H1" stroke="url(#settingsGrad)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M18.364 5.636l-4.243 4.243m-4.242 4.242l-4.243 4.243M18.364 18.364l-4.243-4.243m-4.242-4.242L5.636 5.636" stroke="url(#settingsGrad)" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// Notifications Icon - Bell
export function NotificationsIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="notifGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <path d="M18 8A6 6 0 106 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="url(#notifGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="18" cy="6" r="2" fill="#ef4444"/>
    </svg>
  );
}

// Card Icon
export function CardIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>
      <rect x="2" y="5" width="20" height="14" rx="3" stroke="url(#cardGrad)" strokeWidth="2" fill="none"/>
      <path d="M2 10h20" stroke="url(#cardGrad)" strokeWidth="2"/>
      <rect x="6" y="14" width="4" height="2" rx="0.5" fill="url(#cardGrad)"/>
    </svg>
  );
}

// Restaurant Icon
export function RestaurantIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="restaurantGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      <path d="M3 2v7c0 1.1.9 2 2 2h0a2 2 0 002-2V2M7 2v20M21 15V2v0a5 5 0 00-5 5v8" stroke="url(#restaurantGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 22v-7" stroke="url(#restaurantGrad)" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// Phone Icon - Mobile
export function PhoneIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="phoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <rect x="6" y="2" width="12" height="20" rx="2.5" stroke="url(#phoneGrad)" strokeWidth="2" fill="none"/>
      <path d="M10 19h4" stroke="url(#phoneGrad)" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// Security Shield Icon
export function SecurityIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="securityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="url(#securityGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="url(#securityGrad)" fillOpacity="0.1"/>
      <path d="M9 12l2 2 4-4" stroke="url(#securityGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Money/Currency Icon
export function MoneyIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="moneyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="9" stroke="url(#moneyGrad)" strokeWidth="2" fill="none"/>
      <path d="M12 6v12M15 9H9.5a2.5 2.5 0 000 5h5a2.5 2.5 0 010 5H9" stroke="url(#moneyGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Chart/Analytics Icon
export function ChartIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="chartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      <path d="M3 3v18h18" stroke="url(#chartGrad)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M7 16l4-4 3 3 5-7" stroke="url(#chartGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="7" cy="16" r="1.5" fill="url(#chartGrad)"/>
      <circle cx="11" cy="12" r="1.5" fill="url(#chartGrad)"/>
      <circle cx="14" cy="15" r="1.5" fill="url(#chartGrad)"/>
      <circle cx="19" cy="8" r="1.5" fill="url(#chartGrad)"/>
    </svg>
  );
}

// Plus/Add Icon
export function PlusIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="plusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="9" stroke="url(#plusGrad)" strokeWidth="2" fill="none"/>
      <path d="M12 8v8M8 12h8" stroke="url(#plusGrad)" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}
