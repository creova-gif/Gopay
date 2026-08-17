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

// Book restaurant
app.post('/book', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { 
      restaurantId, 
      restaurantName, 
      date, 
      time, 
      guests, 
      specialRequests,
      depositAmount,
      pin 
    } = await c.req.json();

    // Validate required fields
    if (!restaurantId || !restaurantName || !date || !time || !guests || !pin) {
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

    // Check balance if deposit required
    if (depositAmount > 0) {
      if (wallet.balance < depositAmount) {
        return c.json({ error: 'Insufficient balance' }, 400);
      }

      // Deduct deposit from wallet
      const newBalance = wallet.balance - depositAmount;
      await kv.set(`wallet:${userId}`, {
        ...wallet,
        balance: newBalance,
      });
    }

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
    const commission = depositAmount * commissionRate;

    // Create booking
    const booking = {
      id: `booking-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId,
      restaurantId,
      restaurantName,
      date,
      time,
      guests,
      specialRequests: specialRequests || '',
      depositAmount,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    // Store booking
    const bookingsKey = `bookings:${userId}`;
    const bookings = await kv.get(bookingsKey) || [];
    bookings.unshift(booking);
    await kv.set(bookingsKey, bookings);

    // Track platform revenue (commission on deposit)
    if (commission > 0) {
      const revenueKey = `platform_revenue:restaurants`;
      const currentRevenue = await kv.get(revenueKey) || { 
        totalRevenue: 0, 
        totalBookings: 0,
        totalCommission: 0
      };
      await kv.set(revenueKey, {
        totalRevenue: currentRevenue.totalRevenue + depositAmount,
        totalBookings: currentRevenue.totalBookings + 1,
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
        total: 0
      };
      await kv.set(dailyRevenueKey, {
        ...dailyRevenue,
        restaurants: (dailyRevenue.restaurants || 0) + commission,
        total: dailyRevenue.total + commission,
      });
    }

    // Store transaction
    if (depositAmount > 0) {
      const transaction = {
        id: `txn-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        userId,
        type: 'restaurant_booking',
        category: 'dining',
        description: `${restaurantName} - Table Reservation`,
        amount: depositAmount,
        commission: commission,
        commissionRate: commissionRate,
        status: 'completed',
        timestamp: new Date().toISOString(),
        details: {
          date,
          time,
          guests,
          bookingId: booking.id
        }
      };

      const transactionsKey = `transactions:${userId}`;
      const transactions = await kv.get(transactionsKey) || [];
      transactions.unshift(transaction);
      await kv.set(transactionsKey, transactions);
    }

    return c.json({
      success: true,
      booking,
      newBalance: depositAmount > 0 ? wallet.balance - depositAmount : wallet.balance,
      commission,
      commissionRate
    });

  } catch (error: any) {
    console.error('Error booking restaurant:', error);
    return c.json({ error: error.message || 'Booking failed' }, 500);
  }
});

// Get user bookings
app.get('/bookings', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const bookingsKey = `bookings:${userId}`;
    const bookings = await kv.get(bookingsKey) || [];

    return c.json({ bookings });
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    return c.json({ error: error.message || 'Failed to fetch bookings' }, 500);
  }
});

// Cancel booking
app.post('/cancel/:bookingId', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const bookingId = c.req.param('bookingId');
    
    const bookingsKey = `bookings:${userId}`;
    const bookings = await kv.get(bookingsKey) || [];
    
    const bookingIndex = bookings.findIndex((b: any) => b.id === bookingId);
    if (bookingIndex === -1) {
      return c.json({ error: 'Booking not found' }, 404);
    }

    const booking = bookings[bookingIndex];
    
    // Check if booking is within 24 hours
    const bookingDateTime = new Date(`${booking.date}T${booking.time}`);
    const now = new Date();
    const hoursUntilBooking = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilBooking < 24) {
      return c.json({ error: 'Cannot cancel within 24 hours of booking time' }, 400);
    }

    // Refund deposit
    if (booking.depositAmount > 0) {
      const wallet = await kv.get(`wallet:${userId}`);
      if (wallet) {
        const newBalance = wallet.balance + booking.depositAmount;
        await kv.set(`wallet:${userId}`, {
          ...wallet,
          balance: newBalance,
        });
      }

      // Create refund transaction
      const transaction = {
        id: `txn-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        userId,
        type: 'restaurant_refund',
        category: 'dining',
        description: `Refund: ${booking.restaurantName}`,
        amount: booking.depositAmount,
        status: 'completed',
        timestamp: new Date().toISOString(),
      };

      const transactionsKey = `transactions:${userId}`;
      const transactions = await kv.get(transactionsKey) || [];
      transactions.unshift(transaction);
      await kv.set(transactionsKey, transactions);
    }

    // Update booking status
    bookings[bookingIndex].status = 'cancelled';
    bookings[bookingIndex].cancelledAt = new Date().toISOString();
    await kv.set(bookingsKey, bookings);

    return c.json({
      success: true,
      message: 'Booking cancelled successfully',
      refundAmount: booking.depositAmount
    });

  } catch (error: any) {
    console.error('Error cancelling booking:', error);
    return c.json({ error: error.message || 'Failed to cancel booking' }, 500);
  }
});

// Place restaurant ORDER (food delivery/pickup)
app.post('/order', async (c) => {
  const userId = await verifyUser(c.req.header('Authorization'));
  
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { 
      restaurantId, 
      restaurantName, 
      items,
      orderType, // 'delivery' or 'pickup'
      deliveryAddress,
      deliveryInstructions,
      subtotal,
      deliveryFee,
      platformFee,
      discount,
      total,
      pin 
    } = await c.req.json();

    // Validate required fields
    if (!restaurantId || !restaurantName || !items || !orderType || !total || !pin) {
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
    if (wallet.balance < total) {
      return c.json({ error: 'Insufficient balance' }, 400);
    }

    // Deduct total from wallet
    const newBalance = wallet.balance - total;
    await kv.set(`wallet:${userId}`, {
      ...wallet,
      balance: newBalance,
    });

    // Generate order reference
    const orderReference = 'GP-RO-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    // PROFIT DISTRIBUTION:
    // 1. Food subtotal: Restaurant gets 85%, Platform gets 15%
    const restaurantEarnings = Math.round(subtotal * 0.85);
    const platformCommission = Math.round(subtotal * 0.15);

    // 2. Delivery fee split (if delivery): Driver gets 75%, Platform gets 25%
    let driverEarnings = 0;
    let platformDeliveryFee = 0;
    if (orderType === 'delivery' && deliveryFee > 0) {
      driverEarnings = Math.round(deliveryFee * 0.75);
      platformDeliveryFee = Math.round(deliveryFee * 0.25);
    }

    // 3. Total platform profit
    const totalPlatformProfit = platformCommission + platformDeliveryFee;

    // Assign a driver for delivery
    let assignedDriver = null;
    if (orderType === 'delivery') {
      // Get available drivers
      const driversKey = 'drivers:available';
      const availableDrivers = await kv.get(driversKey) || [];
      
      if (availableDrivers.length > 0) {
        // Assign first available driver
        assignedDriver = availableDrivers[0];
        
        // Update driver earnings
        const driverEarningsKey = `driver:${assignedDriver.id}:earnings`;
        const currentEarnings = await kv.get(driverEarningsKey) || { total: 0, deliveries: 0 };
        await kv.set(driverEarningsKey, {
          total: currentEarnings.total + driverEarnings,
          deliveries: currentEarnings.deliveries + 1,
          lastUpdated: new Date().toISOString()
        });

        // Create driver payout record
        const driverPayoutKey = `driver_payout:${Date.now()}_${assignedDriver.id}`;
        await kv.set(driverPayoutKey, {
          driverId: assignedDriver.id,
          driverName: assignedDriver.name,
          orderId: orderReference,
          type: 'restaurant_delivery',
          amount: driverEarnings,
          status: 'pending',
          createdAt: new Date().toISOString()
        });
      }
    }

    // Create order
    const order = {
      id: orderReference,
      userId,
      restaurantId,
      restaurantName,
      items,
      orderType,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress : null,
      deliveryInstructions: orderType === 'delivery' ? deliveryInstructions : null,
      subtotal,
      deliveryFee,
      platformFee,
      discount,
      total,
      
      // Profit breakdown
      restaurantEarnings,
      driverEarnings,
      platformProfit: totalPlatformProfit,
      
      assignedDriver: assignedDriver ? {
        id: assignedDriver.id,
        name: assignedDriver.name,
        phone: assignedDriver.phone,
        vehicle: assignedDriver.vehicle
      } : null,
      
      status: 'confirmed',
      estimatedDelivery: orderType === 'delivery' ? new Date(Date.now() + 45 * 60000).toISOString() : null,
      createdAt: new Date().toISOString(),
    };

    // Store order
    const ordersKey = `orders:${userId}`;
    const orders = await kv.get(ordersKey) || [];
    orders.unshift(order);
    await kv.set(ordersKey, orders);

    // Store global order record
    await kv.set(`order:${orderReference}`, order);

    // Track platform revenue
    const revenueKey = `platform_revenue:restaurant_orders`;
    const currentRevenue = await kv.get(revenueKey) || { 
      totalRevenue: 0, 
      totalOrders: 0,
      totalCommission: 0,
      totalDeliveryFees: 0
    };
    await kv.set(revenueKey, {
      totalRevenue: currentRevenue.totalRevenue + total,
      totalOrders: currentRevenue.totalOrders + 1,
      totalCommission: currentRevenue.totalCommission + platformCommission,
      totalDeliveryFees: currentRevenue.totalDeliveryFees + platformDeliveryFee,
      totalProfit: (currentRevenue.totalCommission || 0) + (currentRevenue.totalDeliveryFees || 0) + platformCommission + platformDeliveryFee,
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
      total: 0
    };
    await kv.set(dailyRevenueKey, {
      ...dailyRevenue,
      restaurants: (dailyRevenue.restaurants || 0) + totalPlatformProfit,
      total: dailyRevenue.total + totalPlatformProfit,
    });

    // Store transaction
    const transaction = {
      id: `txn-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId,
      type: 'restaurant_order',
      category: 'dining',
      description: `${restaurantName} - ${orderType === 'delivery' ? 'Delivery' : 'Pickup'} Order`,
      amount: total,
      breakdown: {
        subtotal,
        deliveryFee,
        platformFee,
        discount,
        restaurantEarnings,
        driverEarnings,
        platformProfit: totalPlatformProfit
      },
      status: 'completed',
      timestamp: new Date().toISOString(),
      reference: orderReference
    };

    const transactionsKey = `transactions:${userId}`;
    const transactions = await kv.get(transactionsKey) || [];
    transactions.unshift(transaction);
    await kv.set(transactionsKey, transactions);

    return c.json({
      success: true,
      orderReference,
      order,
      newBalance,
      profitBreakdown: {
        restaurantGets: restaurantEarnings,
        driverGets: driverEarnings,
        platformGets: totalPlatformProfit,
        breakdown: {
          foodCommission: platformCommission,
          deliveryCommission: platformDeliveryFee
        }
      }
    });

  } catch (error: any) {
    console.error('Error placing restaurant order:', error);
    return c.json({ error: error.message || 'Order failed' }, 500);
  }
});

export default app;