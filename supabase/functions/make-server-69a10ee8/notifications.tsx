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

// Get user notifications
app.get('/list', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const notifications = await kv.getByPrefix(`notification:${userId}:`);
    const notificationData = notifications
      .map(n => JSON.parse(n))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return c.json({ notifications: notificationData });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return c.json({ notifications: [] });
  }
});

// Mark notification as read
app.post('/:id/read', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const notificationId = c.req.param('id');
    const notificationData = await kv.get(`notification:${userId}:${notificationId}`);
    
    if (notificationData) {
      const notification = JSON.parse(notificationData);
      notification.read = true;
      await kv.set(`notification:${userId}:${notificationId}`, JSON.stringify(notification));
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return c.json({ error: 'Failed to mark as read' }, 500);
  }
});

// Mark all as read
app.post('/read-all', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const notifications = await kv.getByPrefix(`notification:${userId}:`);
    
    for (const notifStr of notifications) {
      const notification = JSON.parse(notifStr);
      notification.read = true;
      await kv.set(`notification:${userId}:${notification.id}`, JSON.stringify(notification));
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Error marking all as read:', error);
    return c.json({ error: 'Failed to mark all as read' }, 500);
  }
});

// Delete notification
app.delete('/:id', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const notificationId = c.req.param('id');
    await kv.del(`notification:${userId}:${notificationId}`);

    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return c.json({ error: 'Failed to delete notification' }, 500);
  }
});

export default app;
