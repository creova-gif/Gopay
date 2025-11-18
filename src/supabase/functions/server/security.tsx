import { Hono } from 'npm:hono';
import { createClient } from 'npm:@supabase/supabase-js';
import * as kv from './kv_store.tsx';

const security = new Hono();

// Helper to get userId from access token
async function getUserId(accessToken: string | null): Promise<string | null> {
  if (!accessToken) return null;
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) return null;
  
  return user.id;
}

// Generate random backup codes
function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    codes.push(`${code.slice(0, 4)}-${code.slice(4, 8)}`);
  }
  return codes;
}

// Generate TOTP secret
function generateTOTPSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  for (let i = 0; i < 32; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return secret;
}

// Get security settings
security.get('/settings', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const userId = await getUserId(accessToken);
    
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const settings = await kv.get(`user:${userId}:security`) || {
      twoFactorEnabled: false,
      biometricEnabled: false,
    };

    return c.json(settings);

  } catch (error) {
    console.error('Error fetching security settings:', error);
    return c.json({ error: 'Failed to fetch security settings' }, 500);
  }
});

// Setup 2FA
security.post('/setup-2fa', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const userId = await getUserId(accessToken);
    
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Generate secret
    const secret = generateTOTPSecret();
    
    // Generate backup codes
    const backupCodes = generateBackupCodes();

    // Generate QR code URL
    const userProfile = await kv.get(`user:${userId}`);
    const email = userProfile?.email || 'user@gopay.tz';
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
      `otpauth://totp/goPay:${email}?secret=${secret}&issuer=goPay`
    )}`;

    // Store temporary 2FA setup data
    await kv.set(`user:${userId}:2fa:setup`, {
      secret,
      backupCodes,
      setupAt: new Date().toISOString(),
    });

    return c.json({
      qrCode: qrCodeUrl,
      secret,
      backupCodes,
    });

  } catch (error) {
    console.error('Error setting up 2FA:', error);
    return c.json({ error: 'Failed to setup 2FA' }, 500);
  }
});

// Verify 2FA setup
security.post('/verify-2fa', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const userId = await getUserId(accessToken);
    
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { code } = await c.req.json();

    // Get setup data
    const setupData = await kv.get(`user:${userId}:2fa:setup`);
    
    if (!setupData) {
      return c.json({ error: 'No setup in progress' }, 400);
    }

    // In production, verify TOTP code here
    // For demo, accept any 6-digit code
    if (!/^\d{6}$/.test(code)) {
      return c.json({ error: 'Invalid code format' }, 400);
    }

    // Enable 2FA
    const security = await kv.get(`user:${userId}:security`) || {};
    security.twoFactorEnabled = true;
    security.twoFactorSecret = setupData.secret;
    security.backupCodes = setupData.backupCodes;
    security.enabledAt = new Date().toISOString();

    await kv.set(`user:${userId}:security`, security);

    // Clean up setup data
    await kv.del(`user:${userId}:2fa:setup`);

    return c.json({ success: true });

  } catch (error) {
    console.error('Error verifying 2FA:', error);
    return c.json({ error: 'Failed to verify 2FA' }, 500);
  }
});

// Disable 2FA
security.post('/disable-2fa', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const userId = await getUserId(accessToken);
    
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const securitySettings = await kv.get(`user:${userId}:security`) || {};
    securitySettings.twoFactorEnabled = false;
    delete securitySettings.twoFactorSecret;
    delete securitySettings.backupCodes;

    await kv.set(`user:${userId}:security`, securitySettings);

    return c.json({ success: true });

  } catch (error) {
    console.error('Error disabling 2FA:', error);
    return c.json({ error: 'Failed to disable 2FA' }, 500);
  }
});

// Get biometric challenge
security.post('/biometric-challenge', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const userId = await getUserId(accessToken);
    
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Generate random challenge
    const challenge = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));

    // Store challenge temporarily
    await kv.set(`user:${userId}:biometric:challenge`, {
      challenge,
      createdAt: new Date().toISOString(),
    });

    return c.json({
      challenge,
      userId,
    });

  } catch (error) {
    console.error('Error generating biometric challenge:', error);
    return c.json({ error: 'Failed to generate challenge' }, 500);
  }
});

// Register biometric credential
security.post('/register-biometric', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const userId = await getUserId(accessToken);
    
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { credentialId } = await c.req.json();

    // Store credential
    const securitySettings = await kv.get(`user:${userId}:security`) || {};
    securitySettings.biometricEnabled = true;
    securitySettings.biometricCredentialId = credentialId;
    securitySettings.biometricEnabledAt = new Date().toISOString();

    await kv.set(`user:${userId}:security`, securitySettings);

    // Clean up challenge
    await kv.del(`user:${userId}:biometric:challenge`);

    return c.json({ success: true });

  } catch (error) {
    console.error('Error registering biometric:', error);
    return c.json({ error: 'Failed to register biometric' }, 500);
  }
});

// Disable biometric
security.post('/disable-biometric', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const userId = await getUserId(accessToken);
    
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const securitySettings = await kv.get(`user:${userId}:security`) || {};
    securitySettings.biometricEnabled = false;
    delete securitySettings.biometricCredentialId;

    await kv.set(`user:${userId}:security`, securitySettings);

    return c.json({ success: true });

  } catch (error) {
    console.error('Error disabling biometric:', error);
    return c.json({ error: 'Failed to disable biometric' }, 500);
  }
});

// Verify 2FA code during login
security.post('/verify-login-2fa', async (c) => {
  try {
    const { userId, code } = await c.req.json();

    const securitySettings = await kv.get(`user:${userId}:security`);
    
    if (!securitySettings?.twoFactorEnabled) {
      return c.json({ error: '2FA not enabled' }, 400);
    }

    // Check if it's a backup code
    if (securitySettings.backupCodes?.includes(code)) {
      // Remove used backup code
      securitySettings.backupCodes = securitySettings.backupCodes.filter((c: string) => c !== code);
      await kv.set(`user:${userId}:security`, securitySettings);
      return c.json({ success: true, method: 'backup' });
    }

    // In production, verify TOTP code here
    // For demo, accept any 6-digit code
    if (!/^\d{6}$/.test(code)) {
      return c.json({ error: 'Invalid code' }, 400);
    }

    return c.json({ success: true, method: 'totp' });

  } catch (error) {
    console.error('Error verifying login 2FA:', error);
    return c.json({ error: 'Failed to verify 2FA' }, 500);
  }
});

// Check if user has 2FA enabled
security.post('/check-2fa', async (c) => {
  try {
    const { email } = await c.req.json();

    // Get user by email
    const allUsers = await kv.getByPrefix('user:');
    const user = allUsers.find((u: any) => u.email === email);

    if (!user) {
      return c.json({ has2FA: false });
    }

    const securitySettings = await kv.get(`user:${user.id}:security`);
    
    return c.json({
      has2FA: securitySettings?.twoFactorEnabled || false,
      hasBiometric: securitySettings?.biometricEnabled || false,
      userId: user.id,
    });

  } catch (error) {
    console.error('Error checking 2FA:', error);
    return c.json({ error: 'Failed to check 2FA' }, 500);
  }
});

export default security;
