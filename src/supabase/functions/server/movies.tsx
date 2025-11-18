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

// Generate booking reference
function generateBookingRef(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `TIX-${timestamp}-${random}`.toUpperCase();
}

// Book movie ticket
app.post('/book', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const {
      movieId,
      movieTitle,
      theaterId,
      theaterName,
      showtimeId,
      showtime,
      showDate,
      seats,
      totalAmount,
      platformFee,
      theaterAmount,
      pin
    } = await c.req.json();

    // Validate required fields
    if (!movieId || !theaterId || !showtimeId || !seats || !totalAmount || !pin) {
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
    if (wallet.balance < totalAmount) {
      return c.json({ error: 'Insufficient balance' }, 400);
    }

    // Deduct from wallet
    const newBalance = wallet.balance - totalAmount;
    await kv.set(`wallet:${userId}`, {
      ...wallet,
      balance: newBalance,
    });

    // Generate booking reference
    const bookingReference = generateBookingRef();
    const timestamp = new Date().toISOString();

    // Store booking
    const booking = {
      bookingReference,
      userId,
      movieId,
      movieTitle,
      theaterId,
      theaterName,
      showtimeId,
      showtime,
      showDate,
      seats,
      totalAmount,
      platformFee,
      theaterAmount,
      status: 'confirmed',
      paymentMethod: 'goPay Wallet',
      createdAt: timestamp,
    };

    await kv.set(`booking:${bookingReference}`, booking);

    // Store user's bookings list
    const userBookingsKey = `user_bookings:${userId}`;
    const userBookings = await kv.get(userBookingsKey) || [];
    userBookings.unshift({
      bookingReference,
      movieTitle,
      theaterName,
      showtime,
      showDate,
      seats,
      totalAmount,
      createdAt: timestamp,
    });
    await kv.set(userBookingsKey, userBookings);

    // Track platform revenue (business owner commission)
    const revenueKey = `platform_revenue:movies`;
    const currentRevenue = await kv.get(revenueKey) || { totalRevenue: 0, totalBookings: 0 };
    await kv.set(revenueKey, {
      totalRevenue: currentRevenue.totalRevenue + platformFee,
      totalBookings: currentRevenue.totalBookings + 1,
      lastUpdated: timestamp,
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
      total: 0
    };
    await kv.set(dailyRevenueKey, {
      ...dailyRevenue,
      movies: dailyRevenue.movies + platformFee,
      total: dailyRevenue.total + platformFee,
    });

    // Store transaction
    const transaction = {
      id: `txn-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId,
      type: 'movie_booking',
      category: 'entertainment',
      description: `Movie Ticket - ${movieTitle}`,
      amount: totalAmount,
      platformFee,
      merchantAmount: theaterAmount,
      merchantName: theaterName,
      status: 'completed',
      reference: bookingReference,
      timestamp,
    };

    const transactionsKey = `transactions:${userId}`;
    const transactions = await kv.get(transactionsKey) || [];
    transactions.unshift(transaction);
    await kv.set(transactionsKey, transactions);

    return c.json({
      success: true,
      bookingReference,
      newBalance,
      booking: {
        movieTitle,
        theaterName,
        showtime,
        showDate,
        seats,
        totalAmount,
      }
    });

  } catch (error: any) {
    console.error('Error booking movie ticket:', error);
    return c.json({ error: error.message || 'Booking failed' }, 500);
  }
});

// Get user's bookings
app.get('/mybookings', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const userBookingsKey = `user_bookings:${userId}`;
    const bookings = await kv.get(userBookingsKey) || [];
    
    return c.json({ bookings });
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    return c.json({ error: error.message || 'Failed to fetch bookings' }, 500);
  }
});

// Get booking details
app.get('/booking/:reference', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const reference = c.req.param('reference');
    const booking = await kv.get(`booking:${reference}`);
    
    if (!booking) {
      return c.json({ error: 'Booking not found' }, 404);
    }

    if (booking.userId !== userId) {
      return c.json({ error: 'Unauthorized access to booking' }, 403);
    }

    return c.json({ booking });
  } catch (error: any) {
    console.error('Error fetching booking:', error);
    return c.json({ error: error.message || 'Failed to fetch booking' }, 500);
  }
});

// Get platform revenue (for business owner dashboard)
app.get('/platform-revenue', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    // Get movies revenue
    const moviesRevenue = await kv.get('platform_revenue:movies') || { totalRevenue: 0, totalBookings: 0 };
    
    // Get shopping revenue
    const shoppingRevenue = await kv.get('platform_revenue:shopping') || { totalRevenue: 0, totalOrders: 0 };
    
    // Get travel revenue
    const travelRevenue = await kv.get('platform_revenue:travel') || { totalRevenue: 0, totalBookings: 0 };
    
    // Get bills revenue
    const billsRevenue = await kv.get('platform_revenue:bills') || { totalRevenue: 0, totalTransactions: 0 };

    // Get last 30 days daily revenue
    const dailyRevenue = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const revenue = await kv.get(`daily_revenue:${dateStr}`) || {
        date: dateStr,
        movies: 0,
        shopping: 0,
        travel: 0,
        bills: 0,
        total: 0
      };
      dailyRevenue.push(revenue);
    }

    const totalRevenue = 
      moviesRevenue.totalRevenue + 
      shoppingRevenue.totalRevenue + 
      travelRevenue.totalRevenue + 
      billsRevenue.totalRevenue;

    return c.json({
      summary: {
        totalRevenue,
        movies: moviesRevenue,
        shopping: shoppingRevenue,
        travel: travelRevenue,
        bills: billsRevenue,
      },
      dailyRevenue: dailyRevenue.reverse(),
    });
  } catch (error: any) {
    console.error('Error fetching platform revenue:', error);
    return c.json({ error: error.message || 'Failed to fetch revenue' }, 500);
  }
});

export default app;
