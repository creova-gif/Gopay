import { Hono } from 'npm:hono';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import * as kv from './kv_store.tsx';

const app = new Hono();

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Helper function to verify user
async function verifyUser(authHeader: string | undefined) {
  if (!authHeader) return null;

  const token = authHeader.split(' ')[1];
  if (!token) return null;

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return null;
    return user.id;
  } catch (error) {
    console.error('Error verifying user in drivers endpoint:', error);
    return null;
  }
}

// Generate random passcode
function generatePasscode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Upload driver document
app.post('/upload-document', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { document, type } = await c.req.json();

    if (!document || !type) {
      return c.json({ error: 'Missing document or type' }, 400);
    }

    // Extract base64 data
    const base64Data = document.split(',')[1] || document;
    const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    // Upload to Supabase Storage
    const fileName = `${userId}/${type}_${Date.now()}.jpg`;
    const { data, error } = await supabase.storage
      .from('make-69a10ee8-driver-documents')
      .upload(fileName, buffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) {
      console.error('Error uploading to storage:', error);
      return c.json({ error: 'Upload failed' }, 500);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('make-69a10ee8-driver-documents')
      .getPublicUrl(fileName);

    return c.json({ url: urlData.publicUrl });
  } catch (error: any) {
    console.error('Error uploading driver document:', error);
    return c.json({ error: error.message || 'Upload failed' }, 500);
  }
});

// Submit driver verification
app.post('/submit-verification', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const verificationData = await c.req.json();

    const driverData = {
      userId,
      ...verificationData,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      verifiedAt: null,
      rating: 5.0,
      totalRides: 0,
    };

    const driverKey = `driver:${userId}`;
    await kv.set(driverKey, driverData);

    return c.json({ success: true, message: 'Verification submitted successfully' });
  } catch (error: any) {
    console.error('Error submitting driver verification:', error);
    return c.json({ error: error.message || 'Submission failed' }, 500);
  }
});

// Get driver status
app.get('/status', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const driverKey = `driver:${userId}`;
    const driver = await kv.get(driverKey);

    if (!driver) {
      return c.json({ status: 'not_registered' });
    }

    return c.json({ status: driver.status, driver });
  } catch (error: any) {
    console.error('Error fetching driver status:', error);
    return c.json({ error: error.message || 'Failed to fetch status' }, 500);
  }
});

// Create a new ride (for drivers)
app.post('/create-ride', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    // Verify driver is approved
    const driverKey = `driver:${userId}`;
    const driver = await kv.get(driverKey);

    if (!driver || driver.status !== 'approved') {
      return c.json({ error: 'Driver not verified' }, 403);
    }

    const { passengerId, pickup, dropoff, fare } = await c.req.json();

    const passcode = generatePasscode();
    const rideId = `ride_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const rideData = {
      id: rideId,
      driverId: userId,
      passengerId,
      pickup,
      dropoff,
      fare,
      passcode,
      status: 'pending',
      createdAt: new Date().toISOString(),
      verifiedAt: null,
    };

    const rideKey = `ride:${rideId}`;
    await kv.set(rideKey, rideData);

    return c.json({ 
      success: true, 
      rideId, 
      passcode,
      message: 'Ride created. Share passcode with passenger.' 
    });
  } catch (error: any) {
    console.error('Error creating ride:', error);
    return c.json({ error: error.message || 'Failed to create ride' }, 500);
  }
});

export default app;
