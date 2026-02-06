// Unified data service that switches between demo and real data
import { projectId, publicAnonKey } from './supabase/info';
import { 
  DEMO_WALLET, 
  DEMO_TRANSACTIONS, 
  DEMO_REWARDS,
  DEMO_LINKED_ACCOUNTS,
  DEMO_FAVORITES,
  DEMO_NOTIFICATIONS,
  getDemoBalance,
  setDemoBalance,
  addDemoTransaction,
  getDemoTransactions,
  getDemoRewards,
  updateDemoRewards
} from './demoData';

// Check if in demo mode
export function isDemoMode(accessToken: string): boolean {
  return accessToken.startsWith('demo-token');
}

// API Base URL
const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8`;

// ============================================
// WALLET SERVICES
// ============================================

export async function getWalletBalance(accessToken: string, userId: string): Promise<number> {
  if (isDemoMode(accessToken)) {
    return getDemoBalance();
  }

  const response = await fetch(`${API_BASE}/wallet/balance`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch wallet balance');
  }

  const data = await response.json();
  return data.balance;
}

export async function getWalletDetails(accessToken: string, userId: string) {
  if (isDemoMode(accessToken)) {
    return {
      balance: getDemoBalance(),
      currency: DEMO_WALLET.currency,
      pin: DEMO_WALLET.pin,
    };
  }

  const response = await fetch(`${API_BASE}/wallet/details`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch wallet details');
  }

  return await response.json();
}

export async function updateWalletBalance(
  accessToken: string, 
  userId: string, 
  amount: number, 
  operation: 'add' | 'subtract'
): Promise<number> {
  if (isDemoMode(accessToken)) {
    const currentBalance = getDemoBalance();
    const newBalance = operation === 'add' 
      ? currentBalance + amount 
      : currentBalance - amount;
    setDemoBalance(newBalance);
    return newBalance;
  }

  const response = await fetch(`${API_BASE}/wallet/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ amount, operation }),
  });

  if (!response.ok) {
    throw new Error('Failed to update wallet balance');
  }

  const data = await response.json();
  return data.newBalance;
}

// ============================================
// TRANSACTION SERVICES
// ============================================

export async function getTransactions(accessToken: string, userId: string, limit: number = 50) {
  if (isDemoMode(accessToken)) {
    return getDemoTransactions().slice(0, limit);
  }

  const response = await fetch(`${API_BASE}/transactions?limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch transactions');
  }

  return await response.json();
}

export async function createTransaction(
  accessToken: string,
  userId: string,
  transaction: {
    type: 'debit' | 'credit';
    amount: number;
    description: string;
    category: string;
    reference?: string;
  }
) {
  if (isDemoMode(accessToken)) {
    const newTransaction = {
      id: `tx-${Date.now()}`,
      ...transaction,
      timestamp: new Date().toISOString(),
      status: 'completed',
    };
    addDemoTransaction(newTransaction);
    return newTransaction;
  }

  const response = await fetch(`${API_BASE}/transactions/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(transaction),
  });

  if (!response.ok) {
    throw new Error('Failed to create transaction');
  }

  return await response.json();
}

// ============================================
// PAYMENT SERVICES
// ============================================

export async function processPayment(
  accessToken: string,
  userId: string,
  payment: {
    provider: string;
    accountNumber: string;
    amount: string;
    pin: string;
  }
) {
  if (isDemoMode(accessToken)) {
    const amount = parseInt(payment.amount);
    const balance = getDemoBalance();

    // Validate PIN
    if (payment.pin !== DEMO_WALLET.pin) {
      throw new Error('Invalid PIN');
    }

    // Check balance
    if (balance < amount) {
      throw new Error('Insufficient balance');
    }

    // Process payment
    const newBalance = balance - amount;
    setDemoBalance(newBalance);

    // Add transaction
    const reference = `PAY${Date.now()}`;
    addDemoTransaction({
      id: `tx-${Date.now()}`,
      type: 'debit',
      amount: amount,
      description: `${payment.provider} - ${payment.accountNumber}`,
      timestamp: new Date().toISOString(),
      status: 'completed',
      category: 'bill_payment',
      reference: reference,
    });

    return {
      success: true,
      reference,
      newBalance,
    };
  }

  const response = await fetch(`${API_BASE}/payments/process`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payment),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Payment failed');
  }

  return await response.json();
}

// ============================================
// SEND MONEY SERVICES
// ============================================

export async function sendMoney(
  accessToken: string,
  userId: string,
  transfer: {
    recipient: string;
    amount: string;
    pin: string;
    note?: string;
  }
) {
  if (isDemoMode(accessToken)) {
    const amount = parseInt(transfer.amount);
    const balance = getDemoBalance();

    // Validate PIN
    if (transfer.pin !== DEMO_WALLET.pin) {
      throw new Error('Invalid PIN');
    }

    // Check balance
    if (balance < amount) {
      throw new Error('Insufficient balance');
    }

    // Process transfer
    const newBalance = balance - amount;
    setDemoBalance(newBalance);

    // Add transaction
    const reference = `TRF${Date.now()}`;
    addDemoTransaction({
      id: `tx-${Date.now()}`,
      type: 'debit',
      amount: amount,
      description: `Sent to ${transfer.recipient}${transfer.note ? ' - ' + transfer.note : ''}`,
      timestamp: new Date().toISOString(),
      status: 'completed',
      category: 'transfer',
      reference: reference,
    });

    return {
      success: true,
      reference,
      newBalance,
    };
  }

  const response = await fetch(`${API_BASE}/send-money`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(transfer),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Transfer failed');
  }

  return await response.json();
}

// ============================================
// REWARDS SERVICES
// ============================================

export async function getRewards(accessToken: string, userId: string) {
  if (isDemoMode(accessToken)) {
    return getDemoRewards();
  }

  const response = await fetch(`${API_BASE}/rewards`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch rewards');
  }

  return await response.json();
}

export async function addRewardPoints(
  accessToken: string,
  userId: string,
  points: number,
  reason: string
) {
  if (isDemoMode(accessToken)) {
    updateDemoRewards(points);
    return getDemoRewards();
  }

  const response = await fetch(`${API_BASE}/rewards/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ points, reason }),
  });

  if (!response.ok) {
    throw new Error('Failed to add reward points');
  }

  return await response.json();
}

// ============================================
// LINKED ACCOUNTS SERVICES
// ============================================

export async function getLinkedAccounts(accessToken: string, userId: string) {
  if (isDemoMode(accessToken)) {
    return DEMO_LINKED_ACCOUNTS;
  }

  const response = await fetch(`${API_BASE}/linked-accounts`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch linked accounts');
  }

  return await response.json();
}

export async function linkAccount(
  accessToken: string,
  userId: string,
  account: {
    type: string;
    provider: string;
    accountNumber: string;
  }
) {
  if (isDemoMode(accessToken)) {
    throw new Error('Account linking not available in demo mode');
  }

  const response = await fetch(`${API_BASE}/linked-accounts/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(account),
  });

  if (!response.ok) {
    throw new Error('Failed to link account');
  }

  return await response.json();
}

// ============================================
// NOTIFICATIONS SERVICES
// ============================================

export async function getNotifications(accessToken: string, userId: string) {
  if (isDemoMode(accessToken)) {
    return DEMO_NOTIFICATIONS;
  }

  const response = await fetch(`${API_BASE}/notifications`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch notifications');
  }

  return await response.json();
}

export async function markNotificationRead(
  accessToken: string,
  userId: string,
  notificationId: string
) {
  if (isDemoMode(accessToken)) {
    // Update in localStorage
    const notifications = DEMO_NOTIFICATIONS.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    localStorage.setItem('demo-notifications', JSON.stringify(notifications));
    return { success: true };
  }

  const response = await fetch(`${API_BASE}/notifications/${notificationId}/read`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to mark notification as read');
  }

  return await response.json();
}

// ============================================
// USER PROFILE SERVICES
// ============================================

export async function updateProfile(
  accessToken: string,
  userId: string,
  updates: {
    name?: string;
    phone?: string;
    email?: string;
  }
) {
  if (isDemoMode(accessToken)) {
    // Update demo user in localStorage
    const demoUser = JSON.parse(localStorage.getItem('demo-user') || '{}');
    const updatedUser = { ...demoUser, ...updates };
    localStorage.setItem('demo-user', JSON.stringify(updatedUser));
    return updatedUser;
  }

  const response = await fetch(`${API_BASE}/profile/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error('Failed to update profile');
  }

  return await response.json();
}

// ============================================
// FAVORITES SERVICES
// ============================================

export async function getFavorites(accessToken: string, userId: string) {
  if (isDemoMode(accessToken)) {
    const stored = localStorage.getItem('demo-favorites');
    return stored ? JSON.parse(stored) : DEMO_FAVORITES;
  }

  const response = await fetch(`${API_BASE}/favorites`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch favorites');
  }

  return await response.json();
}

export async function addFavorite(
  accessToken: string,
  userId: string,
  favorite: {
    type: string;
    provider: string;
    accountNumber: string;
    name: string;
    icon: string;
  }
) {
  if (isDemoMode(accessToken)) {
    const favorites = await getFavorites(accessToken, userId);
    const newFavorite = { id: `fav-${Date.now()}`, ...favorite };
    favorites.push(newFavorite);
    localStorage.setItem('demo-favorites', JSON.stringify(favorites));
    return newFavorite;
  }

  const response = await fetch(`${API_BASE}/favorites/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(favorite),
  });

  if (!response.ok) {
    throw new Error('Failed to add favorite');
  }

  return await response.json();
}

export async function removeFavorite(
  accessToken: string,
  userId: string,
  favoriteId: string
) {
  if (isDemoMode(accessToken)) {
    const favorites = await getFavorites(accessToken, userId);
    const filtered = favorites.filter((f: any) => f.id !== favoriteId);
    localStorage.setItem('demo-favorites', JSON.stringify(filtered));
    return { success: true };
  }

  const response = await fetch(`${API_BASE}/favorites/${favoriteId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to remove favorite');
  }

  return await response.json();
}

// ============================================
// QR CODE SERVICES
// ============================================

export async function generateQRCode(accessToken: string, userId: string) {
  if (isDemoMode(accessToken)) {
    return {
      qrCode: `GOPAY:${userId}`,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
    };
  }

  const response = await fetch(`${API_BASE}/qr/generate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to generate QR code');
  }

  return await response.json();
}

export async function scanQRCode(
  accessToken: string,
  userId: string,
  qrData: string
) {
  if (isDemoMode(accessToken)) {
    // Parse demo QR code
    if (qrData.startsWith('GOPAY:')) {
      const recipientId = qrData.replace('GOPAY:', '');
      return {
        recipientId,
        recipientName: 'Demo Merchant',
        recipientPhone: '+255 700 000 000',
      };
    }
    throw new Error('Invalid QR code');
  }

  const response = await fetch(`${API_BASE}/qr/scan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ qrData }),
  });

  if (!response.ok) {
    throw new Error('Failed to scan QR code');
  }

  return await response.json();
}
