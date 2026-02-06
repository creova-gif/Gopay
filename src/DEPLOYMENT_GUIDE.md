# Deployment Guide - goPay Tanzania

Complete production deployment checklist for launching your super app.

---

## 📋 TABLE OF CONTENTS

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Supabase Configuration](#supabase-configuration)
4. [Build Optimization](#build-optimization)
5. [Security Hardening](#security-hardening)
6. [Monitoring Setup](#monitoring-setup)
7. [Launch Strategy](#launch-strategy)
8. [Post-Launch](#post-launch)

---

## ✅ PRE-DEPLOYMENT CHECKLIST

### **Code Quality**
- [ ] All TypeScript errors resolved
- [ ] No console.errors in production
- [ ] All TODO comments addressed
- [ ] Code reviewed by team
- [ ] Git history clean

### **Testing**
- [ ] All features tested manually
- [ ] User testing completed (50+ users)
- [ ] Performance tested on low-end devices
- [ ] Tested on 2G/3G networks
- [ ] Cross-browser testing done
- [ ] Accessibility audit passed (WCAG AA)

### **Content**
- [ ] All Swahili translations verified
- [ ] Legal pages complete (T&C, Privacy)
- [ ] Support contact info updated
- [ ] Error messages are helpful
- [ ] Success messages clear

### **Design**
- [ ] All images optimized
- [ ] Icons consistent
- [ ] Branding finalized
- [ ] Color palette locked
- [ ] Responsive on all screens

### **Backend**
- [ ] API endpoints tested
- [ ] Database schema finalized
- [ ] Error handling complete
- [ ] Rate limiting configured
- [ ] Backup strategy in place

---

## 🔧 ENVIRONMENT SETUP

### **1. Production Environment Variables**

Create `.env.production`:

```bash
# Supabase
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Payment Providers (if using)
SELCOM_API_KEY=your_selcom_key
SELCOM_API_SECRET=your_selcom_secret
PESAPAL_CONSUMER_KEY=your_pesapal_key
PESAPAL_CONSUMER_SECRET=your_pesapal_secret

# Mobile Money APIs
MPESA_API_KEY=your_mpesa_key
TIGO_PESA_API_KEY=your_tigo_key
AIRTEL_MONEY_API_KEY=your_airtel_key

# Analytics
GOOGLE_ANALYTICS_ID=UA-XXXXXXXXX-X
SENTRY_DSN=your_sentry_dsn

# Feature Flags
ENABLE_LOANS=true
ENABLE_TRAVEL_BOOKING=true
ENABLE_REWARDS=true

# App Config
APP_ENV=production
APP_VERSION=1.0.0
API_TIMEOUT=30000
```

### **2. Secure Environment Variables**

**CRITICAL: Never commit `.env` files to Git!**

```bash
# Add to .gitignore
.env
.env.local
.env.production
.env.staging
```

### **3. Environment-Specific Code**

```typescript
// /utils/config.ts

export const config = {
  env: import.meta.env.MODE,
  apiUrl: import.meta.env.VITE_API_URL,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  
  // Feature flags
  features: {
    loans: import.meta.env.VITE_ENABLE_LOANS === 'true',
    travel: import.meta.env.VITE_ENABLE_TRAVEL === 'true',
    rewards: import.meta.env.VITE_ENABLE_REWARDS === 'true',
  },
  
  // Debug mode
  debug: import.meta.env.MODE === 'development',
  
  // API timeout
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
};

// Usage
if (config.debug) {
  console.log('Debug mode enabled');
}
```

---

## ☁️ SUPABASE CONFIGURATION

### **1. Database Setup**

```sql
-- Run in Supabase SQL Editor

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own data"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Create indexes for performance
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
```

### **2. Storage Buckets**

```typescript
// Create buckets via Supabase Dashboard or API

// Profile images
const { data, error } = await supabase.storage.createBucket('avatars', {
  public: false,
  fileSizeLimit: 5242880, // 5MB
  allowedMimeTypes: ['image/png', 'image/jpeg'],
});

// Transaction receipts
await supabase.storage.createBucket('receipts', {
  public: false,
  fileSizeLimit: 2097152, // 2MB
});
```

### **3. Edge Functions Deployment**

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy edge function
supabase functions deploy make-server-69a10ee8

# Set secrets
supabase secrets set SELCOM_API_KEY=your_key
supabase secrets set PESAPAL_CONSUMER_KEY=your_key
```

### **4. Auth Configuration**

In Supabase Dashboard → Authentication → Settings:

```yaml
Site URL: https://yourdomain.com
Redirect URLs:
  - https://yourdomain.com/auth/callback
  - https://yourdomain.com/

Email Auth: Enabled
Phone Auth: Enabled (for Tanzania: +255)

Session Timeout: 7 days
JWT Expiry: 3600 seconds

Email Templates:
  - Customize with goPay branding
  - Use Swahili where appropriate
```

---

## 📦 BUILD OPTIMIZATION

### **1. Vite Build Configuration**

```typescript
// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true }) // Bundle analysis
  ],
  
  build: {
    target: 'es2015', // Support older browsers
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs
        drop_debugger: true,
      },
    },
    
    rollupOptions: {
      output: {
        manualChunks: {
          // Code splitting
          'vendor': ['react', 'react-dom'],
          'icons': ['lucide-react'],
          'supabase': ['@supabase/supabase-js'],
        },
      },
    },
    
    chunkSizeWarningLimit: 1000,
  },
  
  server: {
    port: 3000,
    host: true,
  },
});
```

### **2. Build & Deploy Script**

```json
// package.json

{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "build:analyze": "tsc && vite build && npx vite-bundle-visualizer",
    "preview": "vite preview",
    "deploy:staging": "npm run build && vercel --prod",
    "deploy:production": "npm run build && vercel --prod --scope production"
  }
}
```

### **3. Build Command**

```bash
# Production build
npm run build

# Check build size
du -sh dist/

# Should be:
# - Total: < 2MB (uncompressed)
# - Gzipped: < 500KB
# - Initial load: < 200KB
```

---

## 🔒 SECURITY HARDENING

### **1. Content Security Policy**

```html
<!-- In index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://*.supabase.co https://api.selcom.net;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
">
```

### **2. Security Headers**

```typescript
// For Vercel, create vercel.json

{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(self), microphone=(), geolocation=(self)"
        }
      ]
    }
  ]
}
```

### **3. API Key Security**

```typescript
// Never expose service role key in frontend!

// ❌ BAD
const supabase = createClient(url, SERVICE_ROLE_KEY); // In frontend

// ✅ GOOD
const supabase = createClient(url, ANON_KEY); // In frontend
// Use service role only in Edge Functions
```

### **4. Input Sanitization**

```typescript
// /utils/sanitize.ts

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .slice(0, 1000); // Limit length
}

export function sanitizePhoneNumber(phone: string): string {
  // Tanzania format: +255 XXX XXX XXX
  return phone.replace(/[^\d+]/g, '');
}

export function sanitizeAmount(amount: number): number {
  // Ensure positive, max 2 decimals
  return Math.max(0, Math.round(amount * 100) / 100);
}
```

---

## 📊 MONITORING SETUP

### **1. Error Tracking (Sentry)**

```typescript
// /utils/error-tracking.ts

import * as Sentry from '@sentry/react';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_APP_VERSION,
    
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay(),
    ],
    
    tracesSampleRate: 0.1, // 10% of transactions
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    beforeSend(event, hint) {
      // Filter out sensitive data
      if (event.request) {
        delete event.request.cookies;
        delete event.request.headers;
      }
      return event;
    },
  });
}

// Usage
try {
  // risky operation
} catch (error) {
  Sentry.captureException(error);
}
```

### **2. Analytics (Google Analytics)**

```typescript
// /utils/analytics.ts

export const analytics = {
  init() {
    if (typeof window.gtag === 'undefined') return;
    
    window.gtag('config', import.meta.env.VITE_GA_ID, {
      send_page_view: false, // Manual page views
    });
  },
  
  pageView(page: string) {
    window.gtag?.('event', 'page_view', {
      page_path: page,
    });
  },
  
  event(name: string, params: any) {
    window.gtag?.('event', name, params);
  },
  
  // Custom events
  trackPayment(amount: number, type: string) {
    this.event('payment', { amount, type });
  },
  
  trackSignup(method: string) {
    this.event('sign_up', { method });
  },
};
```

### **3. Performance Monitoring**

```typescript
// /utils/performance.ts

export const performance = {
  // Core Web Vitals
  measureCLS() {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('CLS:', entry.value);
        // Send to analytics
      }
    }).observe({ entryTypes: ['layout-shift'] });
  },
  
  measureLCP() {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });
  },
  
  measureFID() {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('FID:', entry.processingStart - entry.startTime);
      }
    }).observe({ entryTypes: ['first-input'] });
  },
  
  init() {
    if ('PerformanceObserver' in window) {
      this.measureCLS();
      this.measureLCP();
      this.measureFID();
    }
  },
};
```

### **4. Uptime Monitoring**

Use services like:
- **UptimeRobot** (free)
- **Pingdom**
- **StatusCake**

Monitor:
- Main app URL
- API endpoints
- Edge functions

---

## 🚀 LAUNCH STRATEGY

### **Phase 1: Soft Launch (Week 1)**

**Target:** 100 users in Dar es Salaam

**Channels:**
- Friends & family
- Beta testers
- Social media (limited)

**Goals:**
- Test infrastructure under load
- Catch critical bugs
- Gather initial feedback

**Metrics to Watch:**
- Crash rate (<1%)
- API response time (<2s)
- User completion rate (>80%)

---

### **Phase 2: Regional Launch (Week 2-4)**

**Target:** 1,000 users across major cities

**Channels:**
- Facebook/Instagram ads (Tanzania)
- WhatsApp groups
- University partnerships
- Local influencers

**Goals:**
- Validate product-market fit
- Test payment integrations
- Build initial traction

**Metrics:**
- Daily active users (DAU)
- Transaction volume
- User retention (Day 7)

---

### **Phase 3: National Launch (Month 2)**

**Target:** 10,000+ users nationwide

**Channels:**
- TV/Radio ads
- Billboard campaigns
- Merchant partnerships
- Referral program

**Goals:**
- Scale infrastructure
- Establish brand
- Drive adoption

**Metrics:**
- Monthly active users (MAU)
- Transaction value
- NPS score

---

### **Phase 4: Optimization (Month 3+)**

**Focus:**
- A/B testing features
- Improving conversion
- Reducing churn
- Adding features

---

## 📱 DEPLOYMENT PLATFORMS

### **Option 1: Vercel (Recommended for Web)**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Custom domain
vercel domains add gopay.co.tz
```

**Vercel Configuration** (`vercel.json`):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "env": {
    "VITE_SUPABASE_URL": "@supabase-url",
    "VITE_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

---

### **Option 2: Netlify**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod

# Custom domain
netlify domains:add gopay.co.tz
```

**Netlify Configuration** (`netlify.toml`):

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  VITE_SUPABASE_URL = "https://your-project.supabase.co"
```

---

### **Option 3: Custom Server (Advanced)**

```nginx
# nginx.conf

server {
    listen 80;
    server_name gopay.co.tz;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name gopay.co.tz;
    
    ssl_certificate /etc/letsencrypt/live/gopay.co.tz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/gopay.co.tz/privkey.pem;
    
    root /var/www/gopay/dist;
    index index.html;
    
    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 🎯 POST-LAUNCH CHECKLIST

### **Week 1**
- [ ] Monitor error rates daily
- [ ] Check server performance
- [ ] Respond to user feedback
- [ ] Fix critical bugs immediately
- [ ] Update FAQ based on support tickets

### **Week 2-4**
- [ ] Analyze user behavior
- [ ] Optimize conversion funnels
- [ ] A/B test key features
- [ ] Add most-requested features
- [ ] Improve onboarding

### **Month 2+**
- [ ] Scale infrastructure
- [ ] Add payment methods
- [ ] Partner with merchants
- [ ] Launch referral program
- [ ] Plan v2.0 features

---

## 📞 SUPPORT READINESS

### **Support Channels**

```typescript
export const supportChannels = {
  email: 'support@gopay.co.tz',
  phone: '+255 123 456 789',
  whatsapp: '+255 123 456 789',
  hours: 'Mon-Fri 8am-8pm, Sat 9am-5pm EAT',
};
```

### **Response Times**

- **Critical issues:** <1 hour
- **Payment issues:** <2 hours
- **General questions:** <24 hours
- **Feature requests:** <1 week

---

## ✅ FINAL PRE-LAUNCH CHECKLIST

### **Legal**
- [ ] Terms & Conditions published
- [ ] Privacy Policy published
- [ ] Bank of Tanzania license displayed
- [ ] Payment provider agreements signed
- [ ] Data protection compliance (GDPR if applicable)

### **Marketing**
- [ ] Website live
- [ ] Social media accounts created
- [ ] Press release ready
- [ ] Launch video/demo ready
- [ ] App store assets (if mobile)

### **Technical**
- [ ] SSL certificate installed
- [ ] CDN configured
- [ ] Backups automated
- [ ] Monitoring active
- [ ] Incident response plan ready

### **Team**
- [ ] Support team trained
- [ ] On-call schedule set
- [ ] Emergency contacts listed
- [ ] Rollback plan documented
- [ ] Success metrics defined

---

## 🎊 LAUNCH DAY!

```bash
# Final checks
npm run build
npm run test

# Deploy
vercel --prod

# Verify
curl https://gopay.co.tz
curl https://gopay.co.tz/health

# Monitor
# - Error rates
# - Response times
# - User signups
# - First transactions

# Celebrate! 🎉
```

---

**Your app is ready for launch! Go transform digital payments in Tanzania!** 🚀🇹🇿💰
