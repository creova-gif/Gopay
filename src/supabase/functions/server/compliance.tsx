import { Hono } from 'npm:hono';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Helper to verify user
async function verifyUser(authHeader: string | undefined) {
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  if (!token) return null;
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return null;
    return user.id;
  } catch (error) {
    console.error('Error verifying user:', error);
    return null;
  }
}

// Create immutable audit log
async function createAuditLog(data: {
  userId: string;
  action: string;
  amount?: number;
  category?: string;
  reference?: string;
  metadata?: any;
  ipAddress?: string;
  deviceId?: string;
  location?: { lat: number; lng: number };
  riskScore?: number;
  status: string;
}) {
  const auditId = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const auditLog = {
    auditId,
    timestamp: new Date().toISOString(),
    userId: data.userId,
    action: data.action,
    amount: data.amount || 0,
    category: data.category || 'unknown',
    reference: data.reference || '',
    ipAddress: data.ipAddress || 'unknown',
    deviceId: data.deviceId || 'unknown',
    location: data.location || null,
    riskScore: data.riskScore || 0,
    status: data.status,
    metadata: data.metadata || {},
  };

  // Store audit log (immutable - never deleted)
  await kv.set(`audit:${auditId}`, auditLog);
  
  // Add to user's audit trail
  const userAuditKey = `user_audit:${data.userId}`;
  const userAudits = await kv.get(userAuditKey) || [];
  userAudits.unshift(auditLog);
  // Keep last 1000 entries per user in quick access
  await kv.set(userAuditKey, userAudits.slice(0, 1000));
  
  // Daily audit log for BOT reporting
  const today = new Date().toISOString().split('T')[0];
  const dailyAuditKey = `daily_audit:${today}`;
  const dailyAudits = await kv.get(dailyAuditKey) || [];
  dailyAudits.push(auditLog);
  await kv.set(dailyAuditKey, dailyAudits);

  return auditLog;
}

// Check transaction limits (BOT compliance)
async function checkTransactionLimits(userId: string, amount: number): Promise<{
  allowed: boolean;
  reason?: string;
  kycLevel?: number;
}> {
  // Get user KYC level
  const kycData = await kv.get(`kyc:${userId}`) || { level: 0 };
  const kycLevel = kycData.level || 0;

  // Transaction limits by KYC level
  const limits = {
    0: { daily: 500000, monthly: 5000000, balance: 1000000 },    // No KYC
    1: { daily: 3000000, monthly: 30000000, balance: 5000000 },   // Basic KYC
    2: { daily: 10000000, monthly: 100000000, balance: 20000000 }, // Enhanced KYC
    3: { daily: Infinity, monthly: Infinity, balance: Infinity }   // Business KYC
  };

  const userLimits = limits[kycLevel as keyof typeof limits] || limits[0];

  // Check daily limit
  const today = new Date().toISOString().split('T')[0];
  const dailyKey = `daily_spending:${userId}:${today}`;
  const dailySpending = await kv.get(dailyKey) || { total: 0 };

  if (dailySpending.total + amount > userLimits.daily) {
    return {
      allowed: false,
      reason: `Daily limit exceeded. Limit: TZS ${userLimits.daily.toLocaleString()}. Upgrade KYC for higher limits.`,
      kycLevel
    };
  }

  // Check monthly limit
  const monthKey = new Date().toISOString().substring(0, 7); // YYYY-MM
  const monthlyKey = `monthly_spending:${userId}:${monthKey}`;
  const monthlySpending = await kv.get(monthlyKey) || { total: 0 };

  if (monthlySpending.total + amount > userLimits.monthly) {
    return {
      allowed: false,
      reason: `Monthly limit exceeded. Limit: TZS ${userLimits.monthly.toLocaleString()}. Upgrade KYC for higher limits.`,
      kycLevel
    };
  }

  return { allowed: true, kycLevel };
}

// Update spending limits
async function updateSpendingLimits(userId: string, amount: number) {
  const today = new Date().toISOString().split('T')[0];
  const monthKey = new Date().toISOString().substring(0, 7);

  // Update daily
  const dailyKey = `daily_spending:${userId}:${today}`;
  const dailySpending = await kv.get(dailyKey) || { total: 0, transactions: 0 };
  await kv.set(dailyKey, {
    total: dailySpending.total + amount,
    transactions: dailySpending.transactions + 1,
    date: today
  });

  // Update monthly
  const monthlyKey = `monthly_spending:${userId}:${monthKey}`;
  const monthlySpending = await kv.get(monthlyKey) || { total: 0, transactions: 0 };
  await kv.set(monthlyKey, {
    total: monthlySpending.total + amount,
    transactions: monthlySpending.transactions + 1,
    month: monthKey
  });
}

// Check for suspicious activity (AML)
async function checkSuspiciousActivity(userId: string, amount: number, category: string): Promise<{
  isSuspicious: boolean;
  riskScore: number;
  flags: string[];
}> {
  const flags: string[] = [];
  let riskScore = 0;

  // Flag 1: Large single transaction (>5M TZS)
  if (amount > 5000000) {
    flags.push('Large transaction (>5M TZS)');
    riskScore += 30;
  }

  // Flag 2: Check transaction velocity (>10 transactions in 10 minutes)
  const now = Date.now();
  const tenMinutesAgo = now - 10 * 60 * 1000;
  const recentTxnsKey = `recent_txns:${userId}`;
  const recentTxns = await kv.get(recentTxnsKey) || [];
  const recentCount = recentTxns.filter((t: any) => t.timestamp > tenMinutesAgo).length;

  if (recentCount > 10) {
    flags.push('High transaction velocity');
    riskScore += 40;
  }

  // Flag 3: Unusual time (2 AM - 5 AM)
  const hour = new Date().getHours();
  if (hour >= 2 && hour < 5) {
    flags.push('Unusual transaction time');
    riskScore += 10;
  }

  // Flag 4: Multiple small transactions just below threshold
  const todayTxns = recentTxns.filter((t: any) => {
    const txnDate = new Date(t.timestamp).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    return txnDate === today && t.amount > 400000 && t.amount < 500000;
  });

  if (todayTxns.length > 5) {
    flags.push('Structuring suspected (multiple transactions near threshold)');
    riskScore += 50;
  }

  // Update recent transactions
  recentTxns.push({ timestamp: now, amount, category });
  await kv.set(recentTxnsKey, recentTxns.slice(-50)); // Keep last 50

  const isSuspicious = riskScore >= 50;

  // Auto-file SAR if very suspicious
  if (riskScore >= 70) {
    await fileSuspiciousActivityReport(userId, amount, category, flags, riskScore);
  }

  return { isSuspicious, riskScore, flags };
}

// File Suspicious Activity Report (SAR) to FIU
async function fileSuspiciousActivityReport(
  userId: string,
  amount: number,
  category: string,
  flags: string[],
  riskScore: number
) {
  const sarId = `SAR_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  
  const sar = {
    sarId,
    userId,
    amount,
    category,
    flags,
    riskScore,
    filedAt: new Date().toISOString(),
    status: 'filed',
    fiuReported: false // Will be sent to Financial Intelligence Unit
  };

  await kv.set(`sar:${sarId}`, sar);
  
  // Add to pending SARs for FIU reporting
  const pendingSARs = await kv.get('pending_sars') || [];
  pendingSARs.push(sar);
  await kv.set('pending_sars', pendingSARs);

  console.log(`🚨 SAR FILED: ${sarId} for user ${userId} - Risk Score: ${riskScore}`);
}

// Get BOT daily report
app.get('/bot/daily-report', async (c) => {
  try {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Get daily audit logs
    const dailyAuditKey = `daily_audit:${yesterday}`;
    const dailyAudits = await kv.get(dailyAuditKey) || [];

    // Get daily revenue
    const dailyRevenueKey = `daily_revenue:${yesterday}`;
    const dailyRevenue = await kv.get(dailyRevenueKey) || {};

    // Calculate statistics
    const totalTransactions = dailyAudits.length;
    const totalVolume = dailyAudits.reduce((sum: number, a: any) => sum + (a.amount || 0), 0);
    const failedTransactions = dailyAudits.filter((a: any) => a.status === 'failed').length;
    const disputedTransactions = dailyAudits.filter((a: any) => a.status === 'disputed').length;

    // Get SARs filed
    const sarsKey = 'pending_sars';
    const pendingSARs = await kv.get(sarsKey) || [];
    const yesterdaySARs = pendingSARs.filter((s: any) => 
      s.filedAt.startsWith(yesterday)
    );

    const report = {
      date: yesterday,
      summary: {
        totalTransactions,
        totalVolume,
        failedTransactions,
        disputedTransactions,
        suspiciousActivityReports: yesterdaySARs.length
      },
      revenue: dailyRevenue,
      auditLogs: dailyAudits,
      sars: yesterdaySARs,
      generatedAt: new Date().toISOString()
    };

    return c.json(report);
  } catch (error: any) {
    console.error('Error generating BOT report:', error);
    return c.json({ error: 'Failed to generate report' }, 500);
  }
});

// Get user KYC status
app.get('/kyc/status', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const kycData = await kv.get(`kyc:${userId}`) || {
      level: 0,
      verified: false,
      documents: []
    };

    return c.json(kycData);
  } catch (error: any) {
    console.error('Error fetching KYC status:', error);
    return c.json({ error: 'Failed to fetch KYC status' }, 500);
  }
});

// Submit KYC documents
app.post('/kyc/submit', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const body = await c.req.json();
    const { 
      fullName, 
      dateOfBirth, 
      nidaNumber, 
      tinNumber,
      occupation,
      address,
      documentType,
      documentUrl,
      selfieUrl
    } = body;

    const kycData = {
      userId,
      level: 1, // Basic KYC
      verified: false, // Pending verification
      fullName,
      dateOfBirth,
      nidaNumber,
      tinNumber,
      occupation,
      address,
      documents: [
        { type: documentType, url: documentUrl },
        { type: 'selfie', url: selfieUrl }
      ],
      submittedAt: new Date().toISOString(),
      status: 'pending_review'
    };

    await kv.set(`kyc:${userId}`, kycData);

    // Create audit log
    await createAuditLog({
      userId,
      action: 'kyc_submitted',
      category: 'compliance',
      status: 'completed',
      metadata: { level: 1 }
    });

    return c.json({ 
      success: true,
      message: 'KYC documents submitted successfully. Review in progress.',
      kycData 
    });
  } catch (error: any) {
    console.error('Error submitting KYC:', error);
    return c.json({ error: 'Failed to submit KYC' }, 500);
  }
});

// Export compliance utilities
export {
  createAuditLog,
  checkTransactionLimits,
  updateSpendingLimits,
  checkSuspiciousActivity,
  fileSuspiciousActivityReport
};

export default app;
