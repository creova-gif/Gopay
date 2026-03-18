/**
 * LANGUAGE SYSTEM - Swahili ↔ English
 * 
 * PRINCIPLES:
 * 1. NO MIXED LANGUAGES on same screen
 * 2. Swahili PRIMARY, English secondary (smaller, lighter)
 * 3. Handle long strings gracefully (Swahili can be longer)
 * 4. Tone: Friendly but professional (not overly formal)
 * 
 * PATTERN (WeChat/Alipay model):
 * Primary language: Bold, larger
 * Secondary language: Lighter, smaller, below
 * 
 * Example:
 * Tuma Pesa          <- Swahili (bold, 16px)
 * Send Money         <- English (regular, 12px, gray)
 */

export type Language = 'sw' | 'en';

export interface BilingualText {
  sw: string;
  en: string;
}

// Language context (global state)
let currentLanguage: Language = 'sw'; // Default to Swahili

export const setLanguage = (lang: Language) => {
  currentLanguage = lang;
  localStorage.setItem('app-language', lang);
};

export const getLanguage = (): Language => {
  const saved = localStorage.getItem('app-language');
  return (saved as Language) || 'sw';
};

// Initialize language on app start
export const initLanguage = () => {
  const saved = localStorage.getItem('app-language');
  if (saved) {
    currentLanguage = saved as Language;
  }
};

/**
 * TRANSLATION DATABASE
 * 
 * Organized by screen/feature for maintainability
 * Tone: Friendly Swahili (not overly formal)
 */

export const translations = {
  // COMMON
  common: {
    loading: { sw: 'Inapakia...', en: 'Loading...' },
    error: { sw: 'Hitilafu imetokea', en: 'An error occurred' },
    retry: { sw: 'Jaribu Tena', en: 'Try Again' },
    cancel: { sw: 'Ghairi', en: 'Cancel' },
    confirm: { sw: 'Thibitisha', en: 'Confirm' },
    continue: { sw: 'Endelea', en: 'Continue' },
    back: { sw: 'Rudi', en: 'Back' },
    next: { sw: 'Ifuatayo', en: 'Next' },
    done: { sw: 'Maliza', en: 'Done' },
    close: { sw: 'Funga', en: 'Close' },
    search: { sw: 'Tafuta', en: 'Search' },
    viewAll: { sw: 'Angalia Zote', en: 'View All' },
    seeMore: { sw: 'Zaidi', en: 'See More' },
    save: { sw: 'Hifadhi', en: 'Save' },
  },

  // HOME / DASHBOARD
  home: {
    greeting: {
      morning: { sw: 'Habari za Asubuhi', en: 'Good Morning' },
      afternoon: { sw: 'Habari za Mchana', en: 'Good Afternoon' },
      evening: { sw: 'Habari za Jioni', en: 'Good Evening' },
    },
    balance: { sw: 'Kiasi cha Pochi', en: 'Wallet Balance' },
    mainBalance: { sw: 'Salio Kuu', en: 'Main Balance' },
    updatedNow: { sw: 'Imesasishwa sasa hivi', en: 'Updated just now' },
    minutesAgo: (n: number) => ({ 
      sw: `Dakika ${n} zilizopita`, 
      en: `${n} minute${n > 1 ? 's' : ''} ago` 
    }),
  },

  // PAYMENTS
  payments: {
    sendMoney: { sw: 'Tuma Pesa', en: 'Send Money' },
    addMoney: { sw: 'Jaza Pochi', en: 'Add Money' },
    payBills: { sw: 'Lipa Bili', en: 'Pay Bills' },
    scanQR: { sw: 'Scan QR', en: 'Scan QR' },
    requestMoney: { sw: 'Omba Pesa', en: 'Request Money' },
    
    enterAmount: { sw: 'Weka Kiasi', en: 'Enter Amount' },
    enterPhone: { sw: 'Weka Namba ya Simu', en: 'Enter Phone Number' },
    recipientName: { sw: 'Jina la Mpokeaji', en: 'Recipient Name' },
    transactionFee: { sw: 'Ada ya Muamala', en: 'Transaction Fee' },
    totalAmount: { sw: 'Jumla', en: 'Total Amount' },
    
    instantTransfer: { sw: 'Uhamishaji wa Haraka', en: 'Instant Transfer' },
    free: { sw: 'BURE', en: 'FREE' },
    confirmPayment: { sw: 'Thibitisha Malipo', en: 'Confirm Payment' },
    enterPIN: { sw: 'Weka PIN', en: 'Enter PIN' },
    
    success: { sw: 'Umefanikiwa!', en: 'Success!' },
    moneyS sent: { sw: 'Pesa Zimetumwa', en: 'Money Sent' },
    receiptSent: { sw: 'Risiti imetumwa kwa SMS', en: 'Receipt sent via SMS' },
  },

  // TRAVEL
  travel: {
    bookFlight: { sw: 'Nunua Tiketi ya Ndege', en: 'Book Flight' },
    bookBus: { sw: 'Nunua Tiketi ya Basi', en: 'Book Bus Ticket' },
    bookHotel: { sw: 'Nunua Chumba cha Hoteli', en: 'Book Hotel Room' },
    bookFerry: { sw: 'Nunua Tiketi ya Feri', en: 'Book Ferry' },
    
    from: { sw: 'Kutoka', en: 'From' },
    to: { sw: 'Kwenda', en: 'To' },
    departure: { sw: 'Tarehe ya Kuondoka', en: 'Departure Date' },
    return: { sw: 'Tarehe ya Kurudi', en: 'Return Date' },
    oneWay: { sw: 'Njia Moja', en: 'One Way' },
    roundTrip: { sw: 'Kwenda na Kurudi', en: 'Round Trip' },
    
    passengers: { sw: 'Abiria', en: 'Passengers' },
    adults: { sw: 'Watu Wazima', en: 'Adults' },
    children: { sw: 'Watoto', en: 'Children' },
    
    searchFlights: { sw: 'Tafuta Ndege', en: 'Search Flights' },
    availableSeats: (n: number) => ({ 
      sw: `Viti ${n} vinapatikana`, 
      en: `${n} seats available` 
    }),
    
    bookNow: { sw: 'Nunua Sasa', en: 'Book Now' },
    eTicket: { sw: 'Tiketi ya Kielektroniki', en: 'E-Ticket' },
    confirmationSent: { sw: 'Uthibitisho umetumwa kwa SMS na barua pepe', en: 'Confirmation sent via SMS & email' },
  },

  // GOVERNMENT SERVICES
  government: {
    title: { sw: 'Huduma za Serikali', en: 'Government Services' },
    nida: { sw: 'NIDA', en: 'National ID' },
    tra: { sw: 'TRA', en: 'Tax Services' },
    nhif: { sw: 'NHIF', en: 'Health Insurance' },
    schoolFees: { sw: 'Ada za Shule', en: 'School Fees' },
    licenses: { sw: 'Leseni', en: 'Licenses' },
    
    kycRequired: { sw: 'Thibitisho la Kitambulisho Linahitajika', en: 'Identity Verification Required' },
    kycDescription: { sw: 'Ili kutumia huduma za serikali, tafadhali thibitisha kitambulisho chako', en: 'To access government services, please complete identity verification' },
    verifyNow: { sw: 'Thibitisha Sasa', en: 'Verify Now' },
  },

  // REWARDS
  rewards: {
    title: { sw: 'GOrewards', en: 'GOrewards' },
    yourPoints: { sw: 'Pointi Zako', en: 'Your Points' },
    earnPoints: { sw: 'Pata Pointi', en: 'Earn Points' },
    redeemRewards: { sw: 'Tumia Tuzo', en: 'Redeem Rewards' },
    
    membership: { sw: 'Uanachama', en: 'Membership' },
    bronze: { sw: 'Shaba', en: 'Bronze' },
    silver: { sw: 'Fedha', en: 'Silver' },
    gold: { sw: 'Dhahabu', en: 'Gold' },
    platinum: { sw: 'Platinamu', en: 'Platinum' },
    
    upgradeMembership: { sw: 'Pandisha Kiwango', en: 'Upgrade Membership' },
    benefits: { sw: 'Faida', en: 'Benefits' },
    nextTier: (tier: string) => ({ 
      sw: `Kiwango Kifuatacho: ${tier}`, 
      en: `Next Tier: ${tier}` 
    }),
  },

  // SERVICES
  services: {
    title: { sw: 'Huduma', en: 'Services' },
    allServices: { sw: 'Huduma Zote', en: 'All Services' },
    recent: { sw: 'Hivi Karibuni', en: 'Recent' },
    featured: { sw: 'Maarufu', en: 'Featured' },
    new: { sw: 'Mpya', en: 'New' },
    popular: { sw: 'Zinazopendwa', en: 'Popular' },
    
    categories: {
      pay: { sw: 'Lipa', en: 'Pay' },
      travel: { sw: 'Safari', en: 'Travel' },
      lifestyle: { sw: 'Ishi', en: 'Lifestyle' },
      government: { sw: 'Serikali', en: 'Government' },
      business: { sw: 'Biashara', en: 'Business' },
    },
  },

  // HELP / SUPPORT
  help: {
    title: { sw: 'Msaada', en: 'Help Center' },
    howCanWeHelp: { sw: 'Tunaweza kukusaidia vipi?', en: 'How can we help you?' },
    liveChat: { sw: 'Mazungumzo ya Moja kwa Moja', en: 'Live Chat' },
    callUs: { sw: 'Piga Simu', en: 'Call Us' },
    emailUs: { sw: 'Tuma Barua Pepe', en: 'Email Us' },
    
    available247: { sw: 'Tunapatikana Saa 24/7', en: 'Available 24/7' },
    responseTime: { sw: 'Muda wa Kujibu', en: 'Response Time' },
    
    commonQuestions: { sw: 'Maswali ya Kawaida', en: 'Common Questions' },
    browseTopics: { sw: 'Tazama Mada', en: 'Browse Topics' },
  },

  // ERRORS & VALIDATION
  errors: {
    networkError: { sw: 'Hakuna muunganisho wa mtandao', en: 'No network connection' },
    tryAgain: { sw: 'Jaribu tena', en: 'Try again' },
    invalidPhone: { sw: 'Namba ya simu si sahihi', en: 'Invalid phone number' },
    invalidAmount: { sw: 'Kiasi si sahihi', en: 'Invalid amount' },
    insufficientBalance: { sw: 'Salio halitoshi', en: 'Insufficient balance' },
    transactionFailed: { sw: 'Muamala umeshindwa', en: 'Transaction failed' },
    pleaseTryAgain: { sw: 'Tafadhali jaribu tena baadaye', en: 'Please try again later' },
  },

  // SUCCESS MESSAGES
  success: {
    transactionComplete: { sw: 'Muamala umekamilika!', en: 'Transaction complete!' },
    paymentSuccessful: { sw: 'Malipo yamefanikiwa', en: 'Payment successful' },
    bookingConfirmed: { sw: 'Uhifadhi umethibitishwa', en: 'Booking confirmed' },
    updatesSaved: { sw: 'Mabadiliko yamehifadhiwa', en: 'Changes saved' },
  },
};

/**
 * Get translated text
 */
export const t = (path: string, params?: any): BilingualText => {
  const keys = path.split('.');
  let value: any = translations;
  
  for (const key of keys) {
    value = value?.[key];
    if (!value) {
      console.warn(`Translation missing: ${path}`);
      return { sw: path, en: path };
    }
  }
  
  // Handle function-based translations (with parameters)
  if (typeof value === 'function') {
    return value(params);
  }
  
  return value as BilingualText;
};

/**
 * Get text in current language only
 */
export const txt = (path: string, params?: any): string => {
  const translation = t(path, params);
  return translation[currentLanguage];
};

/**
 * Format currency (Tanzanian style)
 */
export const formatCurrency = (amount: number, showDecimals = false): string => {
  const formatted = new Intl.NumberFormat('sw-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);
  
  return formatted;
};

/**
 * Format date (Swahili-friendly)
 */
export const formatDate = (date: Date | string, style: 'short' | 'long' = 'short'): BilingualText => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (style === 'short') {
    return {
      sw: d.toLocaleDateString('sw-TZ', { day: 'numeric', month: 'short', year: 'numeric' }),
      en: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    };
  }
  
  return {
    sw: d.toLocaleDateString('sw-TZ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
    en: d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  };
};

/**
 * Format time (12/24 hour based on locale)
 */
export const formatTime = (date: Date | string): BilingualText => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return {
    sw: d.toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' }),
    en: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  };
};

/**
 * Relative time (e.g., "2 minutes ago")
 */
export const relativeTime = (date: Date | string): BilingualText => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) {
    return { sw: 'Sasa hivi', en: 'Just now' };
  } else if (diffMins < 60) {
    return { 
      sw: `Dakika ${diffMins} zilizopita`, 
      en: `${diffMins} minute${diffMins > 1 ? 's' : ''} ago` 
    };
  } else if (diffHours < 24) {
    return { 
      sw: `Saa ${diffHours} zilizopita`, 
      en: `${diffHours} hour${diffHours > 1 ? 's' : ''} ago` 
    };
  } else {
    return { 
      sw: `Siku ${diffDays} zilizopita`, 
      en: `${diffDays} day${diffDays > 1 ? 's' : ''} ago` 
    };
  }
};
