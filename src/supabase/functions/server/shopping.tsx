import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { createClient } from 'npm:@supabase/supabase-js';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Get user's cart
app.get('/cart', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    const cartKey = `cart:${user.id}`;
    const cart = await kv.get(cartKey) || { items: [], updatedAt: new Date().toISOString() };

    return c.json({ cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return c.json({ error: 'Failed to fetch cart' }, 500);
  }
});

// Add item to cart
app.post('/cart/add', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    const body = await c.req.json();
    const { storeId, storeName, storeColor, storeIcon, productId, productName, price, image, deliveryFee } = body;

    const cartKey = `cart:${user.id}`;
    const cart = await kv.get(cartKey) || { items: [] };

    const existingItemIndex = cart.items.findIndex(
      (item: any) => item.storeId === storeId && item.productId === productId
    );

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += 1;
    } else {
      cart.items.push({
        storeId,
        storeName,
        storeColor,
        storeIcon,
        productId,
        productName,
        price,
        image,
        deliveryFee: deliveryFee || 0,
        quantity: 1,
        addedAt: new Date().toISOString()
      });
    }

    cart.updatedAt = new Date().toISOString();
    await kv.set(cartKey, cart);

    return c.json({ success: true, cart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return c.json({ error: 'Failed to add to cart' }, 500);
  }
});

// Update cart item quantity
app.post('/cart/update', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    const body = await c.req.json();
    const { storeId, productId, quantity } = body;

    const cartKey = `cart:${user.id}`;
    const cart = await kv.get(cartKey) || { items: [] };

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (item: any) => !(item.storeId === storeId && item.productId === productId)
      );
    } else {
      const itemIndex = cart.items.findIndex(
        (item: any) => item.storeId === storeId && item.productId === productId
      );
      if (itemIndex >= 0) {
        cart.items[itemIndex].quantity = quantity;
      }
    }

    cart.updatedAt = new Date().toISOString();
    await kv.set(cartKey, cart);

    return c.json({ success: true, cart });
  } catch (error) {
    console.error('Error updating cart:', error);
    return c.json({ error: 'Failed to update cart' }, 500);
  }
});

// Clear cart
app.post('/cart/clear', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    const cartKey = `cart:${user.id}`;
    await kv.set(cartKey, { items: [], updatedAt: new Date().toISOString() });

    return c.json({ success: true });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return c.json({ error: 'Failed to clear cart' }, 500);
  }
});

// Place order
app.post('/order', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    const body = await c.req.json();
    const { items, subtotal, deliveryFee, total, address, phone, pin } = body;

    // Get wallet
    const walletKey = `wallet:${user.id}`;
    const wallet = await kv.get(walletKey);
    if (!wallet) {
      return c.json({ error: 'Wallet not found' }, 404);
    }

    // Verify PIN
    if (wallet.pin !== pin) {
      return c.json({ error: 'Invalid PIN' }, 400);
    }

    // Check balance
    if (wallet.balance < total) {
      return c.json({ error: 'Insufficient balance' }, 400);
    }

    // Deduct from wallet
    const newBalance = wallet.balance - total;
    await kv.set(walletKey, { ...wallet, balance: newBalance });

    // Create order
    const orderRef = `GP-SH-${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // PROFIT DISTRIBUTION:
    // 1. Products: Merchant gets 85%, Platform gets 15%
    const merchantEarnings = Math.round(subtotal * 0.85);
    const platformCommission = Math.round(subtotal * 0.15);

    // 2. Delivery fee: Driver gets 75%, Platform gets 25%
    let driverEarnings = 0;
    let platformDeliveryFee = 0;
    if (deliveryFee > 0) {
      driverEarnings = Math.round(deliveryFee * 0.75);
      platformDeliveryFee = Math.round(deliveryFee * 0.25);
    }

    const totalPlatformProfit = platformCommission + platformDeliveryFee;

    // Assign driver for delivery
    let assignedDriver = null;
    if (deliveryFee > 0) {
      const driversKey = 'drivers:available';
      const availableDrivers = await kv.get(driversKey) || [];
      
      if (availableDrivers.length > 0) {
        assignedDriver = availableDrivers[0];
        
        // Update driver earnings
        const driverEarningsKey = `driver:${assignedDriver.id}:earnings`;
        const currentEarnings = await kv.get(driverEarningsKey) || { total: 0, deliveries: 0 };
        await kv.set(driverEarningsKey, {
          total: currentEarnings.total + driverEarnings,
          deliveries: currentEarnings.deliveries + 1,
          lastUpdated: new Date().toISOString()
        });
      }
    }

    const order = {
      reference: orderRef,
      userId: user.id,
      items: items,
      subtotal,
      deliveryFee,
      total,
      
      // Profit breakdown
      merchantEarnings,
      driverEarnings,
      platformProfit: totalPlatformProfit,
      
      deliveryAddress: address,
      phone: phone,
      assignedDriver: assignedDriver ? {
        id: assignedDriver.id,
        name: assignedDriver.name,
        phone: assignedDriver.phone
      } : null,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
    };

    await kv.set(`order:${user.id}:${orderRef}`, order);

    // Track platform revenue
    const revenueKey = `platform_revenue:shopping`;
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
      totalProfit: (currentRevenue.totalCommission || 0) + (currentRevenue.totalDeliveryFees || 0) + totalPlatformProfit,
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
      shopping: (dailyRevenue.shopping || 0) + totalPlatformProfit,
      total: dailyRevenue.total + totalPlatformProfit,
    });

    // Update cart
    const cartKey = `cart:${user.id}`;
    await kv.set(cartKey, { items: [], updatedAt: new Date().toISOString() });

    // Create transaction
    const transaction = {
      id: `txn-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId: user.id,
      type: 'shopping_order',
      category: 'shopping',
      description: `Shopping Order`,
      amount: total,
      breakdown: {
        subtotal,
        deliveryFee,
        merchantEarnings,
        driverEarnings,
        platformProfit: totalPlatformProfit
      },
      status: 'completed',
      timestamp: new Date().toISOString(),
      reference: orderRef
    };

    const transactionsKey = `transactions:${user.id}`;
    const transactions = await kv.get(transactionsKey) || [];
    transactions.unshift(transaction);
    await kv.set(transactionsKey, transactions);

    return c.json({ 
      success: true, 
      orderReference: orderRef,
      order,
      newBalance,
      profitBreakdown: {
        merchantGets: merchantEarnings,
        driverGets: driverEarnings,
        platformGets: totalPlatformProfit,
        breakdown: {
          productCommission: platformCommission,
          deliveryCommission: platformDeliveryFee
        }
      }
    });
  } catch (error) {
    console.error('Error placing order:', error);
    return c.json({ error: 'Failed to place order' }, 500);
  }
});

// Get order status
app.get('/order/:reference', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    const reference = c.req.param('reference');
    const orderId = `order:${user.id}:${reference}`;
    const order = await kv.get(orderId);

    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }

    return c.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return c.json({ error: 'Failed to fetch order' }, 500);
  }
});

// Get user orders
app.get('/orders', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    const orderPrefix = `order:${user.id}:`;
    const orders = await kv.getByPrefix(orderPrefix);

    return c.json({ orders: orders || [] });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return c.json({ error: 'Failed to fetch orders' }, 500);
  }
});

// Store API - For store owners to manage their products
app.post('/store/products', async (c) => {
  try {
    // This would require store authentication in production
    const body = await c.req.json();
    const { storeId, products } = body;

    const storeProductsKey = `store_products:${storeId}`;
    await kv.set(storeProductsKey, {
      storeId,
      products,
      updatedAt: new Date().toISOString()
    });

    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating store products:', error);
    return c.json({ error: 'Failed to update products' }, 500);
  }
});

// Get store products
app.get('/store/:storeId/products', async (c) => {
  try {
    const storeId = c.req.param('storeId');
    const storeProductsKey = `store_products:${storeId}`;
    const data = await kv.get(storeProductsKey);

    if (!data) {
      return c.json({ products: [] });
    }

    return c.json({ products: data.products || [] });
  } catch (error) {
    console.error('Error fetching store products:', error);
    return c.json({ error: 'Failed to fetch products' }, 500);
  }
});

export default app;