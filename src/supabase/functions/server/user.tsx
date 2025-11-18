import { Hono } from 'npm:hono';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Get saved addresses
app.get('/saved-addresses', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = authHeader.split(' ')[1]; // Simple token-based user ID
    const addresses = await kv.get(`user:${userId}:addresses`);

    return c.json({
      addresses: addresses || []
    });
  } catch (error: any) {
    console.error('Error fetching saved addresses:', error);
    return c.json({ error: error?.message || 'Failed to fetch addresses' }, 500);
  }
});

// Save or update address
app.post('/saved-addresses', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = authHeader.split(' ')[1];
    const { address } = await c.req.json();

    if (!address || !address.type || !address.location) {
      return c.json({ error: 'Invalid address data' }, 400);
    }

    const addresses = await kv.get(`user:${userId}:addresses`) || [];
    addresses.push(address);

    await kv.set(`user:${userId}:addresses`, addresses);

    return c.json({ success: true, address });
  } catch (error: any) {
    console.error('Error saving address:', error);
    return c.json({ error: error?.message || 'Failed to save address' }, 500);
  }
});

// Update address
app.put('/saved-addresses', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = authHeader.split(' ')[1];
    const { address } = await c.req.json();

    if (!address || !address.id) {
      return c.json({ error: 'Invalid address data' }, 400);
    }

    const addresses = await kv.get(`user:${userId}:addresses`) || [];
    const index = addresses.findIndex((a: any) => a.id === address.id);

    if (index === -1) {
      return c.json({ error: 'Address not found' }, 404);
    }

    addresses[index] = address;
    await kv.set(`user:${userId}:addresses`, addresses);

    return c.json({ success: true, address });
  } catch (error: any) {
    console.error('Error updating address:', error);
    return c.json({ error: error?.message || 'Failed to update address' }, 500);
  }
});

// Delete address
app.delete('/saved-addresses/:id', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = authHeader.split(' ')[1];
    const addressId = c.req.param('id');

    const addresses = await kv.get(`user:${userId}:addresses`) || [];
    const filtered = addresses.filter((a: any) => a.id !== addressId);

    await kv.set(`user:${userId}:addresses`, filtered);

    return c.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting address:', error);
    return c.json({ error: error?.message || 'Failed to delete address' }, 500);
  }
});

// Get emergency contacts
app.get('/emergency-contacts', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = authHeader.split(' ')[1];
    const contacts = await kv.get(`user:${userId}:emergency-contacts`);

    return c.json({
      contacts: contacts || []
    });
  } catch (error: any) {
    console.error('Error fetching emergency contacts:', error);
    return c.json({ error: error?.message || 'Failed to fetch contacts' }, 500);
  }
});

// Save or update emergency contact
app.post('/emergency-contacts', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = authHeader.split(' ')[1];
    const { contact } = await c.req.json();

    if (!contact || !contact.name || !contact.phone) {
      return c.json({ error: 'Name and phone are required' }, 400);
    }

    const contacts = await kv.get(`user:${userId}:emergency-contacts`) || [];
    contacts.push(contact);

    await kv.set(`user:${userId}:emergency-contacts`, contacts);

    return c.json({ success: true, contact });
  } catch (error: any) {
    console.error('Error saving contact:', error);
    return c.json({ error: error?.message || 'Failed to save contact' }, 500);
  }
});

// Update emergency contact
app.put('/emergency-contacts', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = authHeader.split(' ')[1];
    const { contact } = await c.req.json();

    if (!contact || !contact.id) {
      return c.json({ error: 'Invalid contact data' }, 400);
    }

    const contacts = await kv.get(`user:${userId}:emergency-contacts`) || [];
    const index = contacts.findIndex((c: any) => c.id === contact.id);

    if (index === -1) {
      return c.json({ error: 'Contact not found' }, 404);
    }

    contacts[index] = contact;
    await kv.set(`user:${userId}:emergency-contacts`, contacts);

    return c.json({ success: true, contact });
  } catch (error: any) {
    console.error('Error updating contact:', error);
    return c.json({ error: error?.message || 'Failed to update contact' }, 500);
  }
});

// Delete emergency contact
app.delete('/emergency-contacts/:id', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = authHeader.split(' ')[1];
    const contactId = c.req.param('id');

    const contacts = await kv.get(`user:${userId}:emergency-contacts`) || [];
    const filtered = contacts.filter((c: any) => c.id !== contactId);

    await kv.set(`user:${userId}:emergency-contacts`, filtered);

    return c.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting contact:', error);
    return c.json({ error: error?.message || 'Failed to delete contact' }, 500);
  }
});

// Set primary emergency contact
app.put('/emergency-contacts/:id/set-primary', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = authHeader.split(' ')[1];
    const contactId = c.req.param('id');

    const contacts = await kv.get(`user:${userId}:emergency-contacts`) || [];
    
    // Set all to non-primary
    contacts.forEach((c: any) => {
      c.isPrimary = false;
    });

    // Set selected as primary
    const contact = contacts.find((c: any) => c.id === contactId);
    if (contact) {
      contact.isPrimary = true;
    }

    await kv.set(`user:${userId}:emergency-contacts`, contacts);

    return c.json({ success: true });
  } catch (error: any) {
    console.error('Error setting primary contact:', error);
    return c.json({ error: error?.message || 'Failed to set primary contact' }, 500);
  }
});

export default app;
