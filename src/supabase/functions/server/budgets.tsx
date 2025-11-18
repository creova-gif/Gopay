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

// Get user budgets
app.get('/list', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const budgets = await kv.getByPrefix(`budget:${userId}:`);
    const budgetData = budgets.map(b => JSON.parse(b));

    return c.json({ budgets: budgetData });
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return c.json({ budgets: [] });
  }
});

// Create budget
app.post('/create', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const budget = await c.req.json();
    await kv.set(`budget:${userId}:${budget.id}`, JSON.stringify(budget));

    return c.json({ success: true, budget });
  } catch (error) {
    console.error('Error creating budget:', error);
    return c.json({ error: 'Failed to create budget' }, 500);
  }
});

// Update budget
app.put('/:id', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const budgetId = c.req.param('id');
    const updates = await c.req.json();
    
    const budgetData = await kv.get(`budget:${userId}:${budgetId}`);
    if (budgetData) {
      const budget = JSON.parse(budgetData);
      const updatedBudget = { ...budget, ...updates };
      await kv.set(`budget:${userId}:${budgetId}`, JSON.stringify(updatedBudget));
      return c.json({ success: true, budget: updatedBudget });
    }

    return c.json({ error: 'Budget not found' }, 404);
  } catch (error) {
    console.error('Error updating budget:', error);
    return c.json({ error: 'Failed to update budget' }, 500);
  }
});

// Delete budget
app.delete('/:id', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const budgetId = c.req.param('id');
    await kv.del(`budget:${userId}:${budgetId}`);

    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting budget:', error);
    return c.json({ error: 'Failed to delete budget' }, 500);
  }
});

export default app;
