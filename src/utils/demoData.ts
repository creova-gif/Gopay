// Complete demo data for goPay Tanzania Super App
// Works 100% offline without any backend

export const DEMO_USER = {
  id: 'demo-user-001',
  email: 'demo@gopay.tz',
  name: 'John Mwangi',
  phone: '+255 712 345 678',
  nida: '19900101-12345-00001-23',
  profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
};

export const DEMO_WALLET = {
  balance: 100000,
  currency: 'TZS',
  pin: '1234',
};

export const DEMO_LINKED_ACCOUNTS = [
  {
    id: 'acc-mpesa-001',
    type: 'Mobile Money',
    provider: 'M-Pesa',
    accountNumber: '+255 712 345 678',
    balance: 45000,
    isDefault: true,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'acc-airtel-001',
    type: 'Mobile Money',
    provider: 'Airtel Money',
    accountNumber: '+255 765 432 109',
    balance: 28500,
    isDefault: false,
    createdAt: '2024-02-10T14:30:00Z',
  },
  {
    id: 'acc-bank-001',
    type: 'Bank Account',
    provider: 'CRDB Bank',
    accountNumber: '0150123456789',
    balance: 156000,
    isDefault: false,
    createdAt: '2024-01-05T09:15:00Z',
  },
];

export const DEMO_TRANSACTIONS = [
  {
    id: 'tx-001',
    type: 'debit',
    amount: 5000,
    description: 'TANESCO - Electric Bill',
    timestamp: '2024-12-10T15:30:00Z',
    status: 'completed',
    category: 'bill_payment',
    reference: 'BP1234567890',
  },
  {
    id: 'tx-002',
    type: 'credit',
    amount: 50000,
    description: 'Salary Payment',
    timestamp: '2024-12-09T08:00:00Z',
    status: 'completed',
    category: 'income',
    reference: 'SAL202412',
  },
  {
    id: 'tx-003',
    type: 'debit',
    amount: 12000,
    description: 'Uber Ride to City Center',
    timestamp: '2024-12-08T18:45:00Z',
    status: 'completed',
    category: 'transport',
    reference: 'RIDE8765',
  },
  {
    id: 'tx-004',
    type: 'debit',
    amount: 3500,
    description: 'Vodacom Airtime',
    timestamp: '2024-12-08T12:20:00Z',
    status: 'completed',
    category: 'airtime',
    reference: 'AIR5544',
  },
  {
    id: 'tx-005',
    type: 'credit',
    amount: 8000,
    description: 'Received from Maria Hassan',
    timestamp: '2024-12-07T16:10:00Z',
    status: 'completed',
    category: 'transfer',
    reference: 'TRF9988',
  },
  {
    id: 'tx-006',
    type: 'debit',
    amount: 25000,
    description: 'Shoppers Plaza - Shopping',
    timestamp: '2024-12-06T11:30:00Z',
    status: 'completed',
    category: 'shopping',
    reference: 'SHP7766',
  },
  {
    id: 'tx-007',
    type: 'debit',
    amount: 15000,
    description: 'DAWASCO - Water Bill',
    timestamp: '2024-12-05T09:00:00Z',
    status: 'completed',
    category: 'bill_payment',
    reference: 'BP5544332',
  },
  {
    id: 'tx-008',
    type: 'debit',
    amount: 4500,
    description: 'Century Cinemax - Movie Tickets',
    timestamp: '2024-12-04T19:30:00Z',
    status: 'completed',
    category: 'entertainment',
    reference: 'MOV3344',
  },
];

export const DEMO_REWARDS = {
  points: 12500,
  tier: 'Gold',
  tierProgress: 65,
  nextTier: 'Platinum',
  pointsToNextTier: 7500,
  cashback: 2850,
  badges: [
    {
      id: 'badge-001',
      name: 'Early Adopter',
      icon: '🌟',
      description: 'Joined goPay in the first month',
      earnedAt: '2024-01-15T10:00:00Z',
    },
    {
      id: 'badge-002',
      name: 'Bill Master',
      icon: '💰',
      description: 'Paid 50+ bills on time',
      earnedAt: '2024-03-20T14:00:00Z',
    },
    {
      id: 'badge-003',
      name: 'Travel Enthusiast',
      icon: '✈️',
      description: 'Booked 10+ trips',
      earnedAt: '2024-06-10T11:00:00Z',
    },
    {
      id: 'badge-004',
      name: 'Community Hero',
      icon: '🤝',
      description: 'Supported 25+ local businesses',
      earnedAt: '2024-08-15T16:30:00Z',
    },
  ],
  recentEarnings: [
    { description: 'Bill payment bonus', points: 150, date: '2024-12-10' },
    { description: 'Daily login streak', points: 50, date: '2024-12-10' },
    { description: 'Shopping cashback', points: 250, date: '2024-12-06' },
  ],
};

export const DEMO_FAVORITES = [
  {
    id: 'fav-001',
    type: 'bill',
    provider: 'TANESCO',
    accountNumber: '12-345-6789',
    name: 'Home Electricity',
    icon: '⚡',
  },
  {
    id: 'fav-002',
    type: 'contact',
    provider: 'M-Pesa',
    accountNumber: '+255 754 123 456',
    name: 'Maria Hassan',
    icon: '👤',
  },
  {
    id: 'fav-003',
    type: 'merchant',
    provider: 'Shoppers Plaza',
    accountNumber: 'SHOP001',
    name: 'Shoppers Plaza',
    icon: '🏬',
  },
];

export const DEMO_NOTIFICATIONS = [
  {
    id: 'notif-001',
    type: 'transaction',
    title: 'Payment Successful',
    message: 'You paid TZS 5,000 to TANESCO',
    timestamp: '2024-12-10T15:30:00Z',
    read: false,
    icon: '✅',
  },
  {
    id: 'notif-002',
    type: 'reward',
    title: 'GOrewards Earned!',
    message: 'You earned 150 points from your last transaction',
    timestamp: '2024-12-10T15:31:00Z',
    read: false,
    icon: '🎁',
  },
  {
    id: 'notif-003',
    type: 'promo',
    title: 'Weekend Special!',
    message: '2× rewards on all bill payments this weekend',
    timestamp: '2024-12-09T08:00:00Z',
    read: true,
    icon: '🔥',
  },
  {
    id: 'notif-004',
    type: 'alert',
    title: 'Bill Reminder',
    message: 'Your DSTV subscription expires in 3 days',
    timestamp: '2024-12-08T10:00:00Z',
    read: true,
    icon: '⏰',
  },
];

export const DEMO_MERCHANTS = [
  {
    id: 'merchant-001',
    name: 'Mama Njema Restaurant',
    category: 'Food & Dining',
    location: 'Kariakoo, Dar es Salaam',
    rating: 4.8,
    offers: '10% off with goPay',
    verified: true,
    distance: '0.5 km',
  },
  {
    id: 'merchant-002',
    name: 'TechHub Electronics',
    category: 'Electronics',
    location: 'Mlimani City Mall',
    rating: 4.6,
    offers: '5× GOrewards points',
    verified: true,
    distance: '2.3 km',
  },
  {
    id: 'merchant-003',
    name: 'Green Market',
    category: 'Groceries',
    location: 'Kinondoni',
    rating: 4.9,
    offers: 'Free delivery',
    verified: true,
    distance: '1.2 km',
  },
];

export const DEMO_TRIPS = [
  {
    id: 'trip-001',
    type: 'flight',
    destination: 'Zanzibar',
    date: '2024-12-25',
    status: 'confirmed',
    reference: 'FLT8899',
    amount: 150000,
  },
  {
    id: 'trip-002',
    type: 'hotel',
    destination: 'Serengeti National Park',
    date: '2025-01-10',
    status: 'confirmed',
    reference: 'HTL5566',
    amount: 450000,
  },
];

export const DEMO_BUDGETS = [
  {
    id: 'budget-001',
    category: 'Food & Dining',
    limit: 150000,
    spent: 85000,
    remaining: 65000,
    icon: '🍽️',
  },
  {
    id: 'budget-002',
    category: 'Transportation',
    limit: 80000,
    spent: 45000,
    remaining: 35000,
    icon: '🚗',
  },
  {
    id: 'budget-003',
    category: 'Bills & Utilities',
    limit: 100000,
    spent: 72000,
    remaining: 28000,
    icon: '💡',
  },
  {
    id: 'budget-004',
    category: 'Shopping',
    limit: 200000,
    spent: 125000,
    remaining: 75000,
    icon: '🛍️',
  },
];

// Helper functions for demo mode
export function getDemoBalance(): number {
  const stored = localStorage.getItem('demo-balance');
  return stored ? parseInt(stored) : DEMO_WALLET.balance;
}

export function setDemoBalance(balance: number): void {
  localStorage.setItem('demo-balance', balance.toString());
}

export function addDemoTransaction(transaction: any): void {
  const stored = localStorage.getItem('demo-transactions');
  const transactions = stored ? JSON.parse(stored) : DEMO_TRANSACTIONS;
  transactions.unshift(transaction);
  localStorage.setItem('demo-transactions', JSON.stringify(transactions));
}

export function getDemoTransactions(): any[] {
  const stored = localStorage.getItem('demo-transactions');
  return stored ? JSON.parse(stored) : DEMO_TRANSACTIONS;
}

export function updateDemoRewards(points: number): void {
  const stored = localStorage.getItem('demo-rewards');
  const rewards = stored ? JSON.parse(stored) : DEMO_REWARDS;
  rewards.points += points;
  localStorage.setItem('demo-rewards', JSON.stringify(rewards));
}

export function getDemoRewards(): any {
  const stored = localStorage.getItem('demo-rewards');
  return stored ? JSON.parse(stored) : DEMO_REWARDS;
}

export function resetDemoData(): void {
  localStorage.removeItem('demo-balance');
  localStorage.removeItem('demo-transactions');
  localStorage.removeItem('demo-rewards');
}

// Initialize demo data on first load
export function initializeDemoData(): void {
  if (!localStorage.getItem('demo-initialized')) {
    localStorage.setItem('demo-balance', DEMO_WALLET.balance.toString());
    localStorage.setItem('demo-transactions', JSON.stringify(DEMO_TRANSACTIONS));
    localStorage.setItem('demo-rewards', JSON.stringify(DEMO_REWARDS));
    localStorage.setItem('demo-initialized', 'true');
  }
}
