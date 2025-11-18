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

// Get user GoPoints and tier
app.get('/gopoints', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const pointsData = await kv.get(`gopoints:${userId}`);
    const points = pointsData ? JSON.parse(pointsData) : {
      balance: 0,
      tier: 'Blue',
      tierProgress: 0,
      nextTierPoints: 3000,
      lifetimePoints: 0
    };

    return c.json(points);
  } catch (error) {
    console.error('Error fetching GoPoints:', error);
    return c.json({ error: 'Failed to fetch GoPoints' }, 500);
  }
});

// Award GoPoints
app.post('/gopoints/award', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { amount, reason } = await c.req.json();

    const pointsData = await kv.get(`gopoints:${userId}`);
    const currentPoints = pointsData ? JSON.parse(pointsData) : {
      balance: 0,
      tier: 'Blue',
      tierProgress: 0,
      nextTierPoints: 3000,
      lifetimePoints: 0
    };

    // Add points
    currentPoints.balance += amount;
    currentPoints.lifetimePoints += amount;

    // Calculate tier
    const { tier, tierProgress, nextTierPoints } = calculateTier(currentPoints.lifetimePoints);
    currentPoints.tier = tier;
    currentPoints.tierProgress = tierProgress;
    currentPoints.nextTierPoints = nextTierPoints;

    // Save updated points
    await kv.set(`gopoints:${userId}`, JSON.stringify(currentPoints));

    // Log transaction
    const transactionId = `gopoints_${Date.now()}`;
    await kv.set(`gopoints_tx:${userId}:${transactionId}`, JSON.stringify({
      id: transactionId,
      userId,
      amount,
      reason,
      timestamp: new Date().toISOString(),
      type: 'earned'
    }));

    return c.json({ success: true, points: currentPoints });
  } catch (error) {
    console.error('Error awarding GoPoints:', error);
    return c.json({ error: 'Failed to award points' }, 500);
  }
});

// Create itinerary
app.post('/itinerary/create', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const itinerary = await c.req.json();
    const itineraryId = `itinerary_${Date.now()}`;
    
    const itineraryData = {
      id: itineraryId,
      userId,
      ...itinerary,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };

    await kv.set(`itinerary:${userId}:${itineraryId}`, JSON.stringify(itineraryData));

    return c.json({ success: true, itinerary: itineraryData });
  } catch (error) {
    console.error('Error creating itinerary:', error);
    return c.json({ error: 'Failed to create itinerary' }, 500);
  }
});

// Get user itineraries
app.get('/itinerary/list', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const itineraries = await kv.getByPrefix(`itinerary:${userId}:`);
    const itineraryData = itineraries.map(i => JSON.parse(i));

    return c.json({ itineraries: itineraryData });
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    return c.json({ itineraries: [] });
  }
});

// Book safari
app.post('/booking/create', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const booking = await c.req.json();
    const bookingId = `safari_${Date.now()}`;

    const bookingData = {
      id: bookingId,
      userId,
      ...booking,
      bookingDate: new Date().toISOString(),
      status: 'confirmed',
      paymentStatus: 'paid'
    };

    await kv.set(`safari_booking:${userId}:${bookingId}`, JSON.stringify(bookingData));

    // Award GoPoints (10 points per 1000 TZS spent)
    const pointsEarned = Math.floor(booking.totalAmount / 1000) * 10;
    if (pointsEarned > 0) {
      const pointsData = await kv.get(`gopoints:${userId}`);
      const currentPoints = pointsData ? JSON.parse(pointsData) : {
        balance: 0,
        tier: 'Blue',
        tierProgress: 0,
        nextTierPoints: 3000,
        lifetimePoints: 0
      };

      currentPoints.balance += pointsEarned;
      currentPoints.lifetimePoints += pointsEarned;

      const { tier, tierProgress, nextTierPoints } = calculateTier(currentPoints.lifetimePoints);
      currentPoints.tier = tier;
      currentPoints.tierProgress = tierProgress;
      currentPoints.nextTierPoints = nextTierPoints;

      await kv.set(`gopoints:${userId}`, JSON.stringify(currentPoints));
    }

    return c.json({ 
      success: true, 
      booking: bookingData,
      pointsEarned 
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return c.json({ error: 'Failed to create booking' }, 500);
  }
});

// Get user bookings
app.get('/booking/list', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const bookings = await kv.getByPrefix(`safari_booking:${userId}:`);
    const bookingData = bookings.map(b => JSON.parse(b));

    return c.json({ bookings: bookingData });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return c.json({ bookings: [] });
  }
});

// Group payment split
app.post('/payment/split', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { bookingId, participants, amount } = await c.req.json();
    const splitId = `split_${Date.now()}`;

    const splitData = {
      id: splitId,
      bookingId,
      organizer: userId,
      participants,
      totalAmount: amount,
      perPersonAmount: amount / participants.length,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    await kv.set(`payment_split:${splitId}`, JSON.stringify(splitData));

    return c.json({ success: true, split: splitData });
  } catch (error) {
    console.error('Error creating split payment:', error);
    return c.json({ error: 'Failed to create split payment' }, 500);
  }
});

// Travel insurance quote
app.post('/insurance/quote', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { tripDuration, coverage, travelers } = await c.req.json();

    // Calculate insurance premium
    const baseRate = 15000; // TZS per person per day
    const coverageMultiplier = coverage === 'comprehensive' ? 1.5 : 1.0;
    const premium = baseRate * tripDuration * travelers * coverageMultiplier;

    const quote = {
      premium,
      coverage,
      tripDuration,
      travelers,
      benefits: [
        'Medical expenses up to TZS 50,000,000',
        'Emergency evacuation',
        'Trip cancellation coverage',
        '24/7 assistance',
        'Lost baggage compensation'
      ],
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };

    return c.json(quote);
  } catch (error) {
    console.error('Error generating insurance quote:', error);
    return c.json({ error: 'Failed to generate quote' }, 500);
  }
});

// Lock funds for upcoming trip
app.post('/wallet/lock-funds', async (c) => {
  try {
    const userId = await verifyUser(c.req.header('Authorization'));
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { amount, tripId, releaseDate } = await c.req.json();

    const lockId = `fund_lock_${Date.now()}`;
    const lockData = {
      id: lockId,
      userId,
      amount,
      tripId,
      releaseDate,
      status: 'locked',
      createdAt: new Date().toISOString()
    };

    await kv.set(`wallet_lock:${userId}:${lockId}`, JSON.stringify(lockData));

    // Award 2x GoPoints for locking funds
    const pointsEarned = Math.floor(amount / 1000) * 20; // 2x normal rate
    if (pointsEarned > 0) {
      const pointsData = await kv.get(`gopoints:${userId}`);
      const currentPoints = pointsData ? JSON.parse(pointsData) : {
        balance: 0,
        tier: 'Blue',
        tierProgress: 0,
        nextTierPoints: 3000,
        lifetimePoints: 0
      };

      currentPoints.balance += pointsEarned;
      currentPoints.lifetimePoints += pointsEarned;

      const { tier, tierProgress, nextTierPoints } = calculateTier(currentPoints.lifetimePoints);
      currentPoints.tier = tier;
      currentPoints.tierProgress = tierProgress;
      currentPoints.nextTierPoints = nextTierPoints;

      await kv.set(`gopoints:${userId}`, JSON.stringify(currentPoints));
    }

    return c.json({ 
      success: true, 
      lock: lockData,
      pointsEarned 
    });
  } catch (error) {
    console.error('Error locking funds:', error);
    return c.json({ error: 'Failed to lock funds' }, 500);
  }
});

function calculateTier(lifetimePoints: number) {
  if (lifetimePoints >= 10000) {
    return {
      tier: 'Platinum',
      tierProgress: 100,
      nextTierPoints: 0
    };
  } else if (lifetimePoints >= 3000) {
    const progress = Math.floor(((lifetimePoints - 3000) / 7000) * 100);
    return {
      tier: 'Gold',
      tierProgress: progress,
      nextTierPoints: 10000 - lifetimePoints
    };
  } else {
    const progress = Math.floor((lifetimePoints / 3000) * 100);
    return {
      tier: 'Blue',
      tierProgress: progress,
      nextTierPoints: 3000 - lifetimePoints
    };
  }
}

export default app;
