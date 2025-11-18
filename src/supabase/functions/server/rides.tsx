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
    console.error('Error verifying user in rides endpoint:', error);
    return null;
  }
}

// Book a ride
app.post('/book', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { 
      pickup, 
      dropoff, 
      vehicleType,
      fare,
      distance,
      duration,
      pin 
    } = await c.req.json();

    // Validate required fields
    if (!pickup || !dropoff || !vehicleType || !fare || !pin) {
      return c.json({ error: 'Missing required fields' }, 400);
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
    if (wallet.balance < fare) {
      return c.json({ error: 'Insufficient balance' }, 400);
    }

    // Deduct fare from wallet
    const newBalance = wallet.balance - fare;
    await kv.set(`wallet:${userId}`, {
      ...wallet,
      balance: newBalance,
    });

    // Generate ride ID
    const rideId = 'GP-RIDE-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Generate passcode for ride verification
    const passcode = Math.floor(1000 + Math.random() * 9000).toString();

    // PROFIT DISTRIBUTION:
    // Driver gets 75% of fare, Platform gets 25%
    const driverEarnings = Math.round(fare * 0.75);
    const platformCommission = Math.round(fare * 0.25);

    // Find and assign available driver
    const driversKey = 'drivers:available';
    const availableDrivers = await kv.get(driversKey) || [];
    
    let assignedDriver = null;
    if (availableDrivers.length > 0) {
      // Assign first available driver (in production: match by vehicle type, location, rating)
      assignedDriver = availableDrivers.find((d: any) => d.vehicleType === vehicleType) || availableDrivers[0];
      
      if (assignedDriver) {
        // Update driver earnings
        const driverEarningsKey = `driver:${assignedDriver.id}:earnings`;
        const currentEarnings = await kv.get(driverEarningsKey) || { total: 0, rides: 0 };
        await kv.set(driverEarningsKey, {
          total: currentEarnings.total + driverEarnings,
          rides: currentEarnings.rides + 1,
          lastUpdated: new Date().toISOString()
        });

        // Create driver payout record
        const driverPayoutKey = `driver_payout:${Date.now()}_${assignedDriver.id}`;
        await kv.set(driverPayoutKey, {
          driverId: assignedDriver.id,
          driverName: assignedDriver.name,
          rideId: rideId,
          type: 'ride',
          amount: driverEarnings,
          status: 'pending',
          createdAt: new Date().toISOString()
        });
      }
    }

    // Create ride record
    const ride = {
      id: rideId,
      userId,
      pickup,
      dropoff,
      vehicleType,
      fare,
      distance,
      duration,
      passcode,
      
      // Profit breakdown
      driverEarnings,
      platformCommission,
      
      driverId: assignedDriver?.id || null,
      driverDetails: assignedDriver ? {
        id: assignedDriver.id,
        name: assignedDriver.name,
        phone: assignedDriver.phone,
        vehiclePlate: assignedDriver.vehiclePlate,
        vehicleColor: assignedDriver.vehicleColor,
        rating: assignedDriver.rating
      } : null,
      
      status: assignedDriver ? 'confirmed' : 'finding_driver',
      createdAt: new Date().toISOString(),
      estimatedArrival: assignedDriver ? new Date(Date.now() + 5 * 60000).toISOString() : null
    };

    // Store ride
    await kv.set(`ride:${rideId}`, ride);
    
    const ridesKey = `rides:${userId}`;
    const rides = await kv.get(ridesKey) || [];
    rides.unshift(ride);
    await kv.set(ridesKey, rides);

    // Track platform revenue
    const revenueKey = `platform_revenue:rides`;
    const currentRevenue = await kv.get(revenueKey) || { 
      totalRevenue: 0, 
      totalRides: 0,
      totalCommission: 0
    };
    await kv.set(revenueKey, {
      totalRevenue: currentRevenue.totalRevenue + fare,
      totalRides: currentRevenue.totalRides + 1,
      totalCommission: currentRevenue.totalCommission + platformCommission,
      totalDriverEarnings: (currentRevenue.totalDriverEarnings || 0) + driverEarnings,
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
      total: 0
    };
    await kv.set(dailyRevenueKey, {
      ...dailyRevenue,
      rides: (dailyRevenue.rides || 0) + platformCommission,
      total: dailyRevenue.total + platformCommission,
    });

    // Store transaction
    const transaction = {
      id: `txn-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId,
      type: 'ride',
      category: 'transportation',
      description: `Ride: ${pickup} to ${dropoff}`,
      amount: fare,
      breakdown: {
        fare,
        driverEarnings,
        platformCommission
      },
      status: 'completed',
      timestamp: new Date().toISOString(),
      reference: rideId
    };

    const transactionsKey = `transactions:${userId}`;
    const transactions = await kv.get(transactionsKey) || [];
    transactions.unshift(transaction);
    await kv.set(transactionsKey, transactions);

    return c.json({
      success: true,
      rideId,
      ride,
      newBalance,
      profitBreakdown: {
        driverGets: driverEarnings,
        platformGets: platformCommission,
        percentages: {
          driver: '75%',
          platform: '25%'
        }
      }
    });

  } catch (error: any) {
    console.error('Error booking ride:', error);
    return c.json({ error: error.message || 'Ride booking failed' }, 500);
  }
});

export default app;