import { Hono } from 'npm:hono';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Book car rental
app.post('/book', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user } } = await supabase.auth.getUser(accessToken);
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { 
      vehicleId, vehicleName, pickupLocation, dropoffLocation, pickupDate, dropoffDate, days,
      withDriver, driverDetails, insurance, extras,
      rentalCost, driverCost, insuranceCost, extrasTotal, platformFee, total, pin 
    } = body;

    // Verify PIN
    const storedPin = await kv.get(`user:${user.id}:pin`);
    if (storedPin !== pin) {
      return c.json({ error: 'Invalid PIN' }, 400);
    }

    // Check balance
    const balance = await kv.get(`user:${user.id}:balance`);
    const currentBalance = balance ? parseFloat(balance) : 0;

    if (currentBalance < total) {
      return c.json({ error: 'Insufficient balance' }, 400);
    }

    // Generate booking reference
    const bookingReference = 'GP-CR-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    // Deduct balance
    const newBalance = currentBalance - total;
    await kv.set(`user:${user.id}:balance`, newBalance.toString());

    // Calculate commission (15%)
    const commission = platformFee;

    // Add commission to platform revenue
    const currentRevenue = await kv.get('platform:revenue');
    const revenue = currentRevenue ? parseFloat(currentRevenue) : 0;
    await kv.set('platform:revenue', (revenue + commission).toString());

    // Save booking
    const booking = {
      id: bookingReference,
      userId: user.id,
      type: 'car_rental',
      vehicleId,
      vehicleName,
      pickupLocation,
      dropoffLocation,
      pickupDate,
      dropoffDate,
      days,
      withDriver,
      driverDetails,
      insurance,
      extras,
      rentalCost,
      driverCost,
      insuranceCost,
      extrasTotal,
      platformFee,
      total,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    await kv.set(`booking:${bookingReference}`, JSON.stringify(booking));
    await kv.set(`user:${user.id}:booking:${bookingReference}`, JSON.stringify(booking));

    // Create transaction record
    const transaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      type: 'debit',
      category: 'travel',
      subcategory: 'car_rental',
      amount: total,
      description: `Car rental: ${vehicleName}`,
      reference: bookingReference,
      status: 'completed',
      timestamp: new Date().toISOString(),
      balance: newBalance
    };

    await kv.set(`transaction:${transaction.id}`, JSON.stringify(transaction));
    const txnKey = `user:${user.id}:transactions`;
    const existingTxns = await kv.get(txnKey);
    const txnList = existingTxns ? JSON.parse(existingTxns) : [];
    txnList.unshift(transaction);
    await kv.set(txnKey, JSON.stringify(txnList.slice(0, 100)));

    return c.json({ 
      success: true, 
      bookingReference,
      newBalance
    });

  } catch (error) {
    console.error('Error booking car rental:', error);
    return c.json({ error: 'Booking failed' }, 500);
  }
});

export default app;
