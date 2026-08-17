import { Hono } from 'npm:hono';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Utility function to verify user
async function verifyUser(authHeader: string | null) {
  if (!authHeader) {
    return null;
  }
  
  const accessToken = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  
  if (error || !user?.id) {
    return null;
  }
  
  return user.id;
}

// Upload profile photo
app.post('/upload-photo', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { photo } = await c.req.json();

    if (!photo || !photo.startsWith('data:image/')) {
      return c.json({ error: 'Invalid photo format' }, 400);
    }

    // Store photo as base64 in KV store
    // In production, you'd upload to Supabase Storage or CDN
    const profileKey = `profile:${userId}`;
    const profile = await kv.get(profileKey) || {};
    
    await kv.set(profileKey, {
      ...profile,
      profilePhoto: photo,
      photoUpdatedAt: new Date().toISOString(),
    });

    return c.json({
      success: true,
      photoUrl: photo,
    });

  } catch (error: any) {
    console.error('Error uploading photo:', error);
    return c.json({ error: error.message || 'Upload failed' }, 500);
  }
});

// Update profile
app.post('/update', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { name, email, profilePhoto } = await c.req.json();

    if (!name || name.trim() === '') {
      return c.json({ error: 'Name is required' }, 400);
    }

    // Update profile in KV store
    const profileKey = `profile:${userId}`;
    const profile = await kv.get(profileKey) || {};
    
    await kv.set(profileKey, {
      ...profile,
      name: name.trim(),
      email: email?.trim() || '',
      profilePhoto: profilePhoto || '',
      updatedAt: new Date().toISOString(),
    });

    // Update user metadata in Supabase Auth
    try {
      await supabase.auth.admin.updateUserById(userId, {
        user_metadata: {
          name: name.trim(),
          email: email?.trim() || '',
          profile_photo: profilePhoto || '',
        },
      });
    } catch (authError) {
      console.error('Error updating auth metadata:', authError);
      // Continue even if auth update fails
    }

    return c.json({
      success: true,
      profile: {
        name: name.trim(),
        email: email?.trim() || '',
        profilePhoto: profilePhoto || '',
      },
    });

  } catch (error: any) {
    console.error('Error updating profile:', error);
    return c.json({ error: error.message || 'Update failed' }, 500);
  }
});

// Get profile
app.get('/me', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const profileKey = `profile:${userId}`;
    const profile = await kv.get(profileKey) || {};

    return c.json({ profile });
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return c.json({ error: error.message || 'Failed to fetch profile' }, 500);
  }
});

// Get user settings
app.get('/settings', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const settingsKey = `user_settings:${userId}`;
    const settings = await kv.get(settingsKey) || {
      addresses: [],
      trustedContacts: [],
      preferences: {
        fontSize: 'medium',
        theme: 'light',
        autoLock: '5min',
        highContrast: false,
        boldText: false,
        reduceMotion: false,
        screenReader: false,
        colorScheme: 'green',
        compactMode: false,
        biometricEnabled: false,
        shareLocation: true,
        emergencySharing: true,
        pushEnabled: true,
        emailNotifications: true,
        smsNotifications: false,
        transactionAlerts: true,
        promotionalOffers: true,
      }
    };

    return c.json(settings);
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return c.json({ error: error.message || 'Failed to fetch settings' }, 500);
  }
});

// Save user settings
app.post('/settings', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const newSettings = await c.req.json();
    
    const settingsKey = `user_settings:${userId}`;
    const currentSettings = await kv.get(settingsKey) || {};
    
    const updatedSettings = {
      ...currentSettings,
      ...newSettings,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(settingsKey, updatedSettings);

    return c.json({ success: true, settings: updatedSettings });
  } catch (error: any) {
    console.error('Error saving settings:', error);
    return c.json({ error: error.message || 'Failed to save settings' }, 500);
  }
});

export default app;