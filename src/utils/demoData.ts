// Demo data utilities for demo mode functionality

let demoBalance = 450000;

export function getDemoBalance() {
  return demoBalance;
}

export function setDemoBalance(amount: number) {
  demoBalance = amount;
}

export const DEMO_WALLET = {
  balance: 450000,
  currency: 'TZS',
  pending: 0
};

export const DEMO_USER = {
  id: 'demo-user-1',
  email: 'demo@gopay.tz',
  name: 'Demo User',
  phone: '0712345678',
  nida: '12345678901234567890',
  profilePhoto: '',
  loyaltyPoints: 2500
};

export const DEMO_LINKED_ACCOUNTS = [
  {
    id: '1',
    name: 'M-Pesa',
    type: 'mobile-money',
    number: '0712345678',
    balance: 125000,
    logo: '📱'
  },
  {
    id: '2',
    name: 'CRDB Bank',
    type: 'bank',
    number: '****1234',
    balance: 550000,
    logo: '🏦'
  },
  {
    id: '3',
    name: 'Tigo Pesa',
    type: 'mobile-money',
    number: '0652345678',
    balance: 85000,
    logo: '📱'
  }
];

const demoTransactions: any[] = [];
let demoRewards = 2500;

export function addDemoTransaction(transaction: any) {
  demoTransactions.unshift({
    ...transaction,
    id: Date.now().toString(),
    timestamp: new Date().toISOString()
  });
  // Keep only last 50 transactions
  if (demoTransactions.length > 50) {
    demoTransactions.pop();
  }
}

export function getDemoTransactions() {
  return demoTransactions;
}

export function clearDemoTransactions() {
  demoTransactions.length = 0;
}

export function updateDemoRewards(points: number) {
  demoRewards += points;
  return demoRewards;
}

export function getDemoRewards() {
  return demoRewards;
}