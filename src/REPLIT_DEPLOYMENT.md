# 🚀 Deploy goPay Tanzania Super App on Replit

This guide will help you deploy the complete Tanzania Super App on Replit in **under 5 minutes**!

---

## 📋 Prerequisites

- A Replit account (free tier works!)
- Internet connection
- Modern web browser

---

## 🎯 Quick Start (3 Easy Steps)

### **Step 1: Import to Replit**

#### **Option A: Import from GitHub**
1. Go to [Replit](https://replit.com)
2. Click **"Create Repl"**
3. Select **"Import from GitHub"**
4. Paste your repository URL
5. Click **"Import from GitHub"**

#### **Option B: Upload Files Directly**
1. Go to [Replit](https://replit.com)
2. Click **"Create Repl"**
3. Choose **"Node.js"** template
4. Upload all project files via drag & drop
5. Click **"Create Repl"**

---

### **Step 2: Install Dependencies**

Replit will automatically detect `package.json` and install dependencies.

**If not automatic, run in Shell:**
```bash
npm install
```

Or use the setup script:
```bash
npm run replit:setup
```

---

### **Step 3: Run the App**

Click the big green **"Run"** button at the top!

Or manually start:
```bash
npm run dev
```

**Your app will be live at:** `https://your-repl-name.your-username.repl.co`

---

## 🎨 What You'll See

Once running, you'll see:
```
✅ goPay Tanzania Super App
✅ Running on http://0.0.0.0:5173
✅ Press h for help, q to quit

> Local:   http://localhost:5173/
> Network: http://0.0.0.0:5173/
> Ready in 1234ms
```

Click the **"Webview"** tab in Replit to see your app!

---

## 🔧 Configuration

### **Environment Variables**

Add these in Replit Secrets (🔒 icon in left sidebar):

```env
VITE_APP_NAME=goPay Tanzania
VITE_APP_VERSION=1.0.0
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**⚠️ Important:** Keep `SUPABASE_SERVICE_ROLE_KEY` secret!

---

### **Custom Domain (Optional)**

1. Click on your Repl name at the top
2. Go to **"Settings"** > **"Hosting"**
3. Connect a custom domain
4. Follow DNS instructions

---

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run replit:setup` | One-time setup script |

---

## 🌐 Deployment Options

### **Option 1: Always-On Repl (Recommended)**

**For Hacker/Pro Plans:**
1. Go to Repl settings
2. Enable **"Always On"**
3. Your app stays live 24/7

**Cost:** ~$7-20/month depending on plan

---

### **Option 2: Static Deployment**

Build and deploy as static site:

```bash
npm run build
```

Then deploy the `dist/` folder to:
- Vercel
- Netlify  
- GitHub Pages
- Cloudflare Pages

---

### **Option 3: Replit Deployments**

1. Click **"Deploy"** button
2. Choose deployment type:
   - **Reserved VM** (always on)
   - **Autoscale** (scales with traffic)
3. Configure resources
4. Click **"Deploy"**

**Cost:** Starts at $7/month

---

## 🔍 Troubleshooting

### **Issue: Port Already in Use**
```bash
# Kill existing process
pkill -f vite

# Restart
npm run dev
```

---

### **Issue: Dependencies Not Installing**
```bash
# Clear cache
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

### **Issue: Blank Screen on Load**
1. Check browser console (F12)
2. Verify all files uploaded correctly
3. Check `index.html` exists in root
4. Run `npm run build` to check for errors

---

### **Issue: Hot Reload Not Working**
This is expected on Replit. The app will still work, just refresh manually.

**Fix (optional):**
```typescript
// In vite.config.ts, already configured:
hmr: {
  clientPort: 443,
  protocol: 'wss'
}
```

---

## 📱 Mobile Testing

Your Replit URL is **mobile-friendly**!

Test on mobile:
1. Get your Repl URL: `https://your-repl.repl.co`
2. Open on phone browser
3. Add to home screen for app-like experience

**On iOS:**
- Safari > Share > Add to Home Screen

**On Android:**
- Chrome > Menu > Add to Home Screen

---

## 🚀 Performance Optimization

### **For Production:**

1. **Build optimized version:**
```bash
npm run build
```

2. **Enable compression** (already configured in Vite)

3. **Use CDN** for assets (optional)

4. **Enable caching** headers

---

## 💾 Database Setup (Supabase)

Your app needs Supabase for backend features.

### **Quick Setup:**

1. **Go to** [Supabase.com](https://supabase.com)
2. **Create new project**
3. **Get credentials:**
   - Project URL
   - Anon Key
   - Service Role Key

4. **Add to Replit Secrets:**
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

5. **Create in Shell:**
```bash
npm run setup:supabase
```

---

## 🎯 Features Enabled

✅ **Digital Wallet** - M-Pesa, Tigo Pesa, Airtel Money  
✅ **Membership System** - Basic, Premium, Business  
✅ **Travel Bookings** - Flights, Hotels, Restaurants  
✅ **Government Services** - NIDA, TRA, Municipal  
✅ **AI Assistant** - Swahili + English support  
✅ **Security** - 2FA, Biometric, Fraud Detection  
✅ **Bot Protection** - Invisible CAPTCHA system  
✅ **Offline Mode** - Works without internet  

---

## 📊 Monitoring

### **Check App Health:**

```bash
# View logs
tail -f /tmp/app.log

# Check memory
free -h

# Check disk
df -h
```

---

### **Performance Metrics:**

Monitor in Replit:
- **Resources** tab shows CPU/RAM usage
- **Logs** tab shows console output
- **Analytics** (Pro plan) shows traffic

---

## 🔐 Security Checklist

✅ Never commit `.env` files  
✅ Use Replit Secrets for sensitive data  
✅ Keep `SUPABASE_SERVICE_ROLE_KEY` secret  
✅ Enable HTTPS (automatic on Replit)  
✅ Implement rate limiting  
✅ Regular dependency updates  

---

## 🆘 Support

### **Common Questions:**

**Q: App is slow on free tier?**  
A: Upgrade to Hacker plan or deploy static build to Vercel/Netlify

**Q: Can I use custom domain?**  
A: Yes! Available on paid plans ($7/month+)

**Q: How to update the app?**  
A: Just edit files and save. Replit auto-reloads!

**Q: Database included?**  
A: Use Supabase (free tier available) - already integrated!

---

## 🎉 Success!

Your Tanzania Super App is now live on Replit! 🇹🇿

**Next Steps:**
1. ✅ Test all features
2. ✅ Add your branding
3. ✅ Configure payment gateways
4. ✅ Set up custom domain
5. ✅ Share with investors!

---

## 📞 Need Help?

- **Replit Docs:** [docs.replit.com](https://docs.replit.com)
- **Community:** [replit.com/talk](https://replit.com/talk)
- **Discord:** Replit Community Discord

---

## 🌟 Pro Tips

1. **Fork for backups:** Create multiple Repls as backups
2. **Use Git:** Connect to GitHub for version control
3. **Monitor usage:** Check Resources tab regularly
4. **Optimize images:** Compress before uploading
5. **Test mobile:** Always test on real devices

---

**Built with ❤️ for Tanzania 🇹🇿**

**Version:** 1.0.0  
**Last Updated:** November 2024  
**Framework:** React + TypeScript + Vite  
**Deployment:** Replit + Supabase
