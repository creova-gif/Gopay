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

// Book a car rental
app.post('/book', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { 
      vehicleId, 
      vehicleName, 
      pickupLocation,
      dropoffLocation,
      pickupDate, 
      dropoffDate, 
      duration,
      withDriver,
      insurance,
      totalCost,
      pin 
    } = await c.req.json();

    // Validate required fields
    if (!vehicleId || !vehicleName || !pickupLocation || !pickupDate || !dropoffDate || !totalCost || !pin) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    if (duration < 1) {
      return c.json({ error: 'Rental duration must be at least 1 day' }, 400);
    }

    // Get wallet
    const wallet = await kv.get(`wallet:${userId}`);
    if (!wallet) {
      return c.json({ error: 'Wallet not found' }, 404);
    }

    // Verify PIN
    if (wallet.pin !== pin) {
      return c.json({ error: 'Invalid PIN' }, 401);
    }

    // Check balance
    if (wallet.balance < totalCost) {
      return c.json({ error: 'Insufficient balance' }, 400);
    }

    // Deduct from wallet
    const newBalance = wallet.balance - totalCost;
    await kv.set(`wallet:${userId}`, {
      ...wallet,
      balance: newBalance,
    });

    // Get membership benefits
    const membershipKey = `membership:${userId}`;
    const membership = await kv.get(membershipKey) || { tier: 'free' };
    
    // Check if membership has expired
    let currentTier = membership.tier;
    if (membership.expiryDate && new Date(membership.expiryDate) < new Date()) {
      currentTier = 'free';
    }

    // Calculate commission (15% base, reduced for Plus/Premium members)
    const commissionRate = currentTier === 'premium' ? 0.05 : currentTier === 'plus' ? 0.10 : 0.15;
    const commission = totalCost * commissionRate;

    // Create rental booking
    const rental = {
      id: `rental-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId,
      vehicleId,
      vehicleName,
      pickupLocation,
      dropoffLocation,
      pickupDate,
      dropoffDate,
      duration,
      withDriver,
      insurance,
      totalCost,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    // Store rental
    const rentalsKey = `rentals:${userId}`;
    const rentals = await kv.get(rentalsKey) || [];
    rentals.unshift(rental);
    await kv.set(rentalsKey, rentals);

    // Track platform revenue
    const revenueKey = `platform_revenue:rentals`;
    const currentRevenue = await kv.get(revenueKey) || { 
      totalRevenue: 0, 
      totalRentals: 0,
      totalCommission: 0
    };
    await kv.set(revenueKey, {
      totalRevenue: currentRevenue.totalRevenue + totalCost,
      totalRentals: currentRevenue.totalRentals + 1,
      totalCommission: currentRevenue.totalCommission + commission,
      lastUpdated: new Date().toISOString(),
    });

    // Track daily revenue
    const today = new Date().toISOString().split('T')[0];
    const dailyRevenueKey = `daily_revenue:${today}`;
    const dailyRevenue = await kv.get(dailyRevenueKey) || { 
      date: today,
      movies: 0,
      shopping: 0,
      travel: 0,
      bills: 0,
      memberships: 0,
      restaurants: 0,
      rides: 0,
      rentals: 0,
      total: 0
    };
    await kv.set(dailyRevenueKey, {
      ...dailyRevenue,
      rentals: (dailyRevenue.rentals || 0) + commission,
      total: dailyRevenue.total + commission,
    });

    // Store transaction
    const transaction = {
      id: `txn-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId,
      type: 'car_rental',
      category: 'transportation',
      description: `${vehicleName} - ${duration} day${duration !== 1 ? 's' : ''} rental`,
      amount: totalCost,
      commission: commission,
      commissionRate: commissionRate,
      status: 'completed',
      timestamp: new Date().toISOString(),
      details: {
        vehicleId,
        pickupDate,
        dropoffDate,
        duration,
        withDriver,
        insurance,
        rentalId: rental.id
      }
    };

    const transactionsKey = `transactions:${userId}`;
    const transactions = await kv.get(transactionsKey) || [];
    transactions.unshift(transaction);
    await kv.set(transactionsKey, transactions);

    return c.json({
      success: true,
      rental,
      newBalance,
      commission,
      commissionRate
    });

  } catch (error: any) {
    console.error('Error booking rental:', error);
    return c.json({ error: error.message || 'Booking failed' }, 500);
  }
});

// Get user rentals
app.get('/history', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const rentalsKey = `rentals:${userId}`;
    const rentals = await kv.get(rentalsKey) || [];

    return c.json({ rentals });
  } catch (error: any) {
    console.error('Error fetching rentals:', error);
    return c.json({ error: error.message || 'Failed to fetch rentals' }, 500);
  }
});

// Cancel rental
app.post('/cancel/:rentalId', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const rentalId = c.req.param('rentalId');
    
    const rentalsKey = `rentals:${userId}`;
    const rentals = await kv.get(rentalsKey) || [];
    
    const rentalIndex = rentals.findIndex((r: any) => r.id === rentalId);
    if (rentalIndex === -1) {
      return c.json({ error: 'Rental not found' }, 404);
    }

    const rental = rentals[rentalIndex];
    
    // Check if rental can be cancelled (48 hours before pickup)
    const pickupDateTime = new Date(rental.pickupDate);
    const now = new Date();
    const hoursUntilPickup = (pickupDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilPickup < 48) {
      return c.json({ error: 'Cannot cancel within 48 hours of pickup time' }, 400);
    }

    // Calculate refund (90% refund for early cancellation)
    const refundAmount = Math.floor(rental.totalCost * 0.9);

    // Refund to wallet
    const wallet = await kv.get(`wallet:${userId}`);
    if (wallet) {
      const newBalance = wallet.balance + refundAmount;
      await kv.set(`wallet:${userId}`, {
        ...wallet,
        balance: newBalance,
      });
    }

    // Create refund transaction
    const transaction = {
      id: `txn-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId,
      type: 'rental_refund',
      category: 'transportation',
      description: `Refund: ${rental.vehicleName} (90%)`,
      amount: refundAmount,
      status: 'completed',
      timestamp: new Date().toISOString(),
    };

    const transactionsKey = `transactions:${userId}`;
    const transactions = await kv.get(transactionsKey) || [];
    transactions.unshift(transaction);
    await kv.set(transactionsKey, transactions);

    // Update rental status
    rentals[rentalIndex].status = 'cancelled';
    rentals[rentalIndex].cancelledAt = new Date().toISOString();
    rentals[rentalIndex].refundAmount = refundAmount;
    await kv.set(rentalsKey, rentals);

    return c.json({
      success: true,
      message: 'Rental cancelled successfully',
      refundAmount,
      cancellationFee: rental.totalCost - refundAmount
    });

  } catch (error: any) {
    console.error('Error cancelling rental:', error);
    return c.json({ error: error.message || 'Failed to cancel rental' }, 500);
  }
});

export default app;
