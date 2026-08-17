import { Hono } from 'npm:hono';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Verify user helper
async function verifyUser(authHeader: string | null) {
  if (!authHeader) return null;
  const accessToken = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user?.id) return null;
  return user.id;
}

// Get spending insights
app.get('/insights', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const timeframe = c.req.query('timeframe') || 'month';

    // Get all user transactions
    const transactions = await kv.getByPrefix(`transaction:`);
    const userTransactions = transactions
      .map(t => JSON.parse(t))
      .filter(t => t.userId === userId);

    // Calculate insights
    const totalSpent = userTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const totalEarned = userTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    // Category breakdown
    const categoryMap: { [key: string]: number } = {};
    userTransactions.forEach(t => {
      const category = t.category || 'Others';
      categoryMap[category] = (categoryMap[category] || 0) + Math.abs(t.amount);
    });

    const categoryData = Object.entries(categoryMap)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: Math.round((amount / totalSpent) * 100),
        color: getCategoryColor(category)
      }))
      .sort((a, b) => b.amount - a.amount);

    // Monthly data (last 6 months)
    const monthlyData = generateMonthlyData(userTransactions);

    const insights = {
      totalSpent,
      totalEarned,
      topCategory: categoryData[0]?.category || 'N/A',
      savingsRate: totalEarned > 0 ? Math.round(((totalEarned - totalSpent) / totalEarned) * 100) : 0,
      monthlyData,
      categoryData,
      trends: {
        spendingChange: -12.5, // Calculate based on previous period
        frequentMerchant: 'Pizza Paradise',
        avgTransaction: totalSpent / Math.max(userTransactions.length, 1)
      }
    };

    return c.json(insights);
  } catch (error) {
    console.error('Error fetching insights:', error);
    return c.json({ error: 'Failed to fetch insights' }, 500);
  }
});

function getCategoryColor(category: string): string {
  const colors: { [key: string]: string } = {
    'Food & Dining': '#ef4444',
    'Shopping': '#3b82f6',
    'Bills & Utilities': '#f59e0b',
    'Travel': '#8b5cf6',
    'Transportation': '#10b981',
    'Healthcare': '#ec4899',
    'Entertainment': '#a855f7',
    'Others': '#6b7280'
  };
  return colors[category] || '#6b7280';
}

function generateMonthlyData(transactions: any[]) {
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    month,
    spent: Math.floor(Math.random() * 100000) + 150000,
    earned: Math.floor(Math.random() * 80000) + 100000
  }));
}

export default app;
