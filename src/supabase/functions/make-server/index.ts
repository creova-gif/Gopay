// Main entry point for make-server edge function
// Supabase edge functions must use standard Deno .ts imports

import { Hono } from 'npm:hono@4.0.0';
import { cors } from 'npm:hono@4.0.0/cors';
import { logger } from 'npm:hono@4.0.0/logger';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Simple health check endpoint
app.get('/make-server-69a10ee8/health', (c) => {
  return c.json({ status: 'ok', message: 'goPay API is running' });
});

// Import and mount all sub-applications dynamically
// This avoids the .tsx import issue by importing at runtime
const modules = [
  './server/index.tsx'
];

// Mount the main server app routes
// The actual logic is in /supabase/functions/server/index.tsx
// For now, we're creating a minimal viable function that will deploy
app.all('/make-server-69a10ee8/*', async (c) => {
  // This will be enhanced once deployment works
  return c.json({ 
    error: 'Not implemented yet',
    message: 'Function deployed successfully, full implementation pending'
  }, 501);
});

// Serve the Hono app
Deno.serve(app.fetch);