import { Hono } from 'npm:hono';
import * as kv from './kv_store.tsx';

const app = new Hono();

/**
 * Integrations Service
 * Handles third-party integrations for analytics, monitoring, and communication
 */

// ============================================
// ANALYTICS INTEGRATION
// ============================================

interface AnalyticsEvent {
  event: string;
  userId?: string;
  properties?: Record<string, any>;
  timestamp: string;
}

/**
 * Track user event
 * Supports: Mixpanel, Google Analytics, Amplitude
 */
app.post('/track', async (c) => {
  try {
    const event: AnalyticsEvent = await c.req.json();
    
    // Store event locally
    const eventId = `event:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
    await kv.set(eventId, event);
    
    // Send to external analytics (if configured)
    const integrations = {
      mixpanel: Deno.env.get('MIXPANEL_TOKEN'),
      googleAnalytics: Deno.env.get('GA_MEASUREMENT_ID'),
      amplitude: Deno.env.get('AMPLITUDE_API_KEY'),
    };
    
    const promises = [];
    
    // Mixpanel
    if (integrations.mixpanel) {
      promises.push(
        sendToMixpanel(integrations.mixpanel, event)
      );
    }
    
    // Google Analytics 4
    if (integrations.googleAnalytics) {
      promises.push(
        sendToGoogleAnalytics(integrations.googleAnalytics, event)
      );
    }
    
    // Amplitude
    if (integrations.amplitude) {
      promises.push(
        sendToAmplitude(integrations.amplitude, event)
      );
    }
    
    // Send to all configured integrations (don't wait)
    Promise.all(promises).catch(err => 
      console.error('Analytics error:', err)
    );
    
    return c.json({ success: true });
  } catch (error: any) {
    console.error('Error tracking event:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Send to Mixpanel
async function sendToMixpanel(token: string, event: AnalyticsEvent) {
  try {
    await fetch('https://api.mixpanel.com/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: event.event,
        properties: {
          token,
          distinct_id: event.userId,
          ...event.properties,
          time: new Date(event.timestamp).getTime() / 1000,
        },
      }),
    });
  } catch (error) {
    console.error('Mixpanel error:', error);
  }
}

// Send to Google Analytics 4
async function sendToGoogleAnalytics(measurementId: string, event: AnalyticsEvent) {
  try {
    const apiSecret = Deno.env.get('GA_API_SECRET');
    if (!apiSecret) return;
    
    await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: event.userId || 'anonymous',
        events: [{
          name: event.event,
          params: event.properties,
        }],
      }),
    });
  } catch (error) {
    console.error('Google Analytics error:', error);
  }
}

// Send to Amplitude
async function sendToAmplitude(apiKey: string, event: AnalyticsEvent) {
  try {
    await fetch('https://api2.amplitude.com/2/httpapi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        events: [{
          user_id: event.userId,
          event_type: event.event,
          event_properties: event.properties,
          time: new Date(event.timestamp).getTime(),
        }],
      }),
    });
  } catch (error) {
    console.error('Amplitude error:', error);
  }
}

// ============================================
// ERROR TRACKING (SENTRY)
// ============================================

interface ErrorReport {
  message: string;
  stack?: string;
  userId?: string;
  context?: Record<string, any>;
  level: 'error' | 'warning' | 'info';
}

app.post('/error', async (c) => {
  try {
    const error: ErrorReport = await c.req.json();
    
    // Store error locally
    const errorId = `error:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
    await kv.set(errorId, {
      ...error,
      timestamp: new Date().toISOString(),
    });
    
    // Send to Sentry (if configured)
    const sentryDsn = Deno.env.get('SENTRY_DSN');
    if (sentryDsn) {
      await sendToSentry(sentryDsn, error);
    }
    
    // Log critical errors
    if (error.level === 'error') {
      console.error('[ERROR]', error.message, error.stack);
    }
    
    return c.json({ success: true, errorId });
  } catch (error: any) {
    console.error('Error reporting error:', error);
    return c.json({ error: error.message }, 500);
  }
});

async function sendToSentry(dsn: string, error: ErrorReport) {
  try {
    const url = new URL(dsn);
    const projectId = url.pathname.split('/').pop();
    const sentryUrl = `${url.protocol}//${url.host}/api/${projectId}/store/`;
    
    await fetch(sentryUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Sentry-Auth': `Sentry sentry_key=${url.username}, sentry_version=7`,
      },
      body: JSON.stringify({
        message: error.message,
        level: error.level,
        user: error.userId ? { id: error.userId } : undefined,
        extra: error.context,
        exception: error.stack ? {
          values: [{
            type: 'Error',
            value: error.message,
            stacktrace: { frames: parseStack(error.stack) },
          }],
        } : undefined,
      }),
    });
  } catch (error) {
    console.error('Sentry error:', error);
  }
}

function parseStack(stack: string) {
  return stack.split('\n').map(line => ({
    filename: line,
    function: line,
  }));
}

// ============================================
// SMS NOTIFICATIONS (Africa's Talking)
// ============================================

interface SmsRequest {
  phone: string;
  message: string;
  userId?: string;
}

app.post('/sms/send', async (c) => {
  try {
    const { phone, message, userId }: SmsRequest = await c.req.json();
    
    // Validate phone number (Tanzania format)
    if (!phone.startsWith('+255') && !phone.startsWith('255')) {
      return c.json({ error: 'Invalid Tanzanian phone number' }, 400);
    }
    
    // Send via Africa's Talking
    const apiKey = Deno.env.get('AFRICAS_TALKING_API_KEY');
    const username = Deno.env.get('AFRICAS_TALKING_USERNAME');
    
    if (apiKey && username) {
      const result = await sendSmsAfricasTalking(apiKey, username, phone, message);
      
      // Log SMS
      await kv.set(`sms:${Date.now()}`, {
        phone,
        message,
        userId,
        timestamp: new Date().toISOString(),
        status: 'sent',
      });
      
      return c.json({ success: true, ...result });
    }
    
    // Fallback: Log only (demo mode)
    console.log(`[SMS] To: ${phone}, Message: ${message}`);
    return c.json({ success: true, demo: true });
    
  } catch (error: any) {
    console.error('Error sending SMS:', error);
    return c.json({ error: error.message }, 500);
  }
});

async function sendSmsAfricasTalking(apiKey: string, username: string, phone: string, message: string) {
  const response = await fetch('https://api.africastalking.com/version1/messaging', {
    method: 'POST',
    headers: {
      'apiKey': apiKey,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: new URLSearchParams({
      username,
      to: phone,
      message,
    }),
  });
  
  return await response.json();
}

// ============================================
// PUSH NOTIFICATIONS (Firebase FCM)
// ============================================

interface PushNotification {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
}

app.post('/push/send', async (c) => {
  try {
    const notification: PushNotification = await c.req.json();
    
    // Get user's FCM token
    const userTokens = await kv.get(`fcm_tokens:${notification.userId}`) || [];
    
    if (userTokens.length === 0) {
      return c.json({ error: 'No FCM tokens found for user' }, 404);
    }
    
    // Send via Firebase Cloud Messaging
    const serverKey = Deno.env.get('FCM_SERVER_KEY');
    if (!serverKey) {
      console.log('[PUSH] Demo mode - notification not sent');
      return c.json({ success: true, demo: true });
    }
    
    const results = await Promise.all(
      userTokens.map((token: string) =>
        sendPushNotification(serverKey, token, notification)
      )
    );
    
    return c.json({ success: true, sent: results.length });
    
  } catch (error: any) {
    console.error('Error sending push notification:', error);
    return c.json({ error: error.message }, 500);
  }
});

async function sendPushNotification(serverKey: string, token: string, notification: PushNotification) {
  const response = await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      'Authorization': `key=${serverKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: token,
      notification: {
        title: notification.title,
        body: notification.body,
        image: notification.imageUrl,
        icon: '/icon-192.png',
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
      },
      data: notification.data,
    }),
  });
  
  return await response.json();
}

// Register FCM token
app.post('/push/register', async (c) => {
  try {
    const { userId, token } = await c.req.json();
    
    const tokens = await kv.get(`fcm_tokens:${userId}`) || [];
    if (!tokens.includes(token)) {
      tokens.push(token);
      await kv.set(`fcm_tokens:${userId}`, tokens);
    }
    
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// ============================================
// EMAIL (SendGrid)
// ============================================

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  userId?: string;
}

app.post('/email/send', async (c) => {
  try {
    const email: EmailRequest = await c.req.json();
    
    const apiKey = Deno.env.get('SENDGRID_API_KEY');
    const fromEmail = Deno.env.get('SENDGRID_FROM_EMAIL') || 'noreply@gopay.tz';
    
    if (!apiKey) {
      console.log('[EMAIL] Demo mode - email not sent');
      return c.json({ success: true, demo: true });
    }
    
    await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: email.to }] }],
        from: { email: fromEmail, name: 'goPay Tanzania' },
        subject: email.subject,
        content: [{ type: 'text/html', value: email.html }],
      }),
    });
    
    // Log email
    await kv.set(`email:${Date.now()}`, {
      ...email,
      timestamp: new Date().toISOString(),
      status: 'sent',
    });
    
    return c.json({ success: true });
    
  } catch (error: any) {
    console.error('Error sending email:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================
// WHATSAPP (Twilio)
// ============================================

interface WhatsAppMessage {
  phone: string;
  message: string;
  userId?: string;
}

app.post('/whatsapp/send', async (c) => {
  try {
    const { phone, message, userId }: WhatsAppMessage = await c.req.json();
    
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromNumber = Deno.env.get('TWILIO_WHATSAPP_NUMBER');
    
    if (!accountSid || !authToken || !fromNumber) {
      console.log('[WHATSAPP] Demo mode - message not sent');
      return c.json({ success: true, demo: true });
    }
    
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const auth = btoa(`${accountSid}:${authToken}`);
    
    await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: `whatsapp:${fromNumber}`,
        To: `whatsapp:${phone}`,
        Body: message,
      }),
    });
    
    // Log message
    await kv.set(`whatsapp:${Date.now()}`, {
      phone,
      message,
      userId,
      timestamp: new Date().toISOString(),
      status: 'sent',
    });
    
    return c.json({ success: true });
    
  } catch (error: any) {
    console.error('Error sending WhatsApp message:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================
// INTEGRATION HEALTH CHECK
// ============================================

app.get('/health', async (c) => {
  const integrations = {
    mixpanel: !!Deno.env.get('MIXPANEL_TOKEN'),
    googleAnalytics: !!Deno.env.get('GA_MEASUREMENT_ID'),
    amplitude: !!Deno.env.get('AMPLITUDE_API_KEY'),
    sentry: !!Deno.env.get('SENTRY_DSN'),
    africasTalking: !!Deno.env.get('AFRICAS_TALKING_API_KEY'),
    fcm: !!Deno.env.get('FCM_SERVER_KEY'),
    sendgrid: !!Deno.env.get('SENDGRID_API_KEY'),
    twilio: !!Deno.env.get('TWILIO_ACCOUNT_SID'),
  };
  
  return c.json({
    status: 'healthy',
    integrations,
    activeCount: Object.values(integrations).filter(Boolean).length,
  });
});

export default app;
