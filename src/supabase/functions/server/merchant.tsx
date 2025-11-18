import { Hono } from 'npm:hono';
import { createClient } from 'npm:@supabase/supabase-js';
import * as kv from './kv_store.tsx';

const merchant = new Hono();

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

// Upload document to Supabase Storage
merchant.post('/upload-document', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const userId = await getUserId(accessToken);
    
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;

    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const bucketName = 'make-69a10ee8-merchant-docs';

    // Create bucket if it doesn't exist
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 5242880, // 5MB
      });
    }

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload file
    const filePath = `${userId}/${fileName}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return c.json({ error: 'Failed to upload file' }, 500);
    }

    // Create signed URL (valid for 1 year)
    const { data: signedUrlData } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, 31536000); // 1 year in seconds

    return c.json({ 
      fileUrl: signedUrlData?.signedUrl,
      filePath 
    });

  } catch (error) {
    console.error('Error uploading document:', error);
    return c.json({ error: 'Failed to upload document' }, 500);
  }
});

// Register new merchant
merchant.post('/register', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const userId = await getUserId(accessToken);
    
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const data = await c.req.json();
    
    const merchantData = {
      id: `merchant_${userId}_${Date.now()}`,
      userId,
      businessName: data.businessName,
      businessType: data.businessType,
      businessCategory: data.businessCategory,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      description: data.description,
      tinNumber: data.tinNumber,
      vrn: data.vrn,
      ownerName: data.ownerName,
      ownerIdNumber: data.ownerIdNumber,
      documents: data.documents,
      status: data.status || 'pending',
      submittedAt: data.submittedAt,
      createdAt: new Date().toISOString(),
    };

    // Store merchant application
    await kv.set(`merchant:${merchantData.id}`, merchantData);
    
    // Add to user's merchant list
    await kv.set(`user:${userId}:merchant`, merchantData.id);
    
    // Add to pending applications list
    const pendingApps = await kv.get('merchant:pending') || [];
    pendingApps.push(merchantData.id);
    await kv.set('merchant:pending', pendingApps);

    return c.json({ success: true, merchantId: merchantData.id });

  } catch (error) {
    console.error('Error registering merchant:', error);
    return c.json({ error: 'Failed to register merchant application' }, 500);
  }
});

// Get merchant profile
merchant.get('/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const userId = await getUserId(accessToken);
    
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const merchantId = await kv.get(`user:${userId}:merchant`);
    
    if (!merchantId) {
      return c.json({ error: 'No merchant account found' }, 404);
    }

    const merchantData = await kv.get(`merchant:${merchantId}`);
    
    return c.json(merchantData);

  } catch (error) {
    console.error('Error fetching merchant profile:', error);
    return c.json({ error: 'Failed to fetch merchant profile' }, 500);
  }
});

// Get merchant stats
merchant.get('/stats', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const userId = await getUserId(accessToken);
    
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const merchantId = await kv.get(`user:${userId}:merchant`);
    
    if (!merchantId) {
      return c.json({ error: 'No merchant account found' }, 404);
    }

    // Get stats from KV store
    const stats = await kv.get(`merchant:${merchantId}:stats`) || {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      completedToday: 0,
    };

    return c.json(stats);

  } catch (error) {
    console.error('Error fetching merchant stats:', error);
    return c.json({ error: 'Failed to fetch merchant stats' }, 500);
  }
});

export default merchant;
