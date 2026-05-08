# goPay — EAS Build Guide (Expo Cloud Builds)

EAS Build lets you build your Android APK/AAB and iOS IPA **in the cloud** — 
no Android Studio needed, and Xcode is only needed for iOS signing setup.

---

## Prerequisites

- Node.js installed on your Mac
- An **Expo account** (free) — expo.dev
- An **Apple Developer account** ($99/year) — for iOS
- A **Google Play Console account** ($25 one-time) — for Android

---

## Step 1 — First-time setup (do this once on your Mac)

```bash
# 1. Install EAS CLI globally
npm install -g eas-cli

# 2. Log into your Expo account
eas login

# 3. Go into the expo-app folder (download from Replit first)
cd expo-app

# 4. Install dependencies
npm install

# 5. Link this project to your Expo account
eas init
# This creates a project on expo.dev and fills in the projectId in app.json
```

---

## Step 2 — Add your app icons

You need:
- `expo-app/assets/icon.png` — 1024×1024 PNG (used for both stores)
- `expo-app/assets/adaptive-icon.png` — 1024×1024 PNG (Android adaptive icon)
- `expo-app/assets/splash.png` — 1284×2778 PNG (splash screen)

**Easy way:**
1. Go to **appicon.co** — upload your 1024px goPay logo
2. Download the Expo / React Native icon pack
3. Copy the files into `expo-app/assets/`

Or create a simple green icon with white wallet logo at those sizes.

---

## Step 3 — Deploy your Replit web app

The Expo app wraps your deployed Replit app URL. Deploy first:

1. In Replit, click **Deploy** → **Autoscale Deployment**
2. Copy your deployed URL (e.g. `https://gopay.replit.app`)
3. Open `expo-app/App.tsx` and replace this line:
   ```ts
   const APP_URL = "https://your-gopay-app.replit.app";
   ```
   with your actual URL:
   ```ts
   const APP_URL = "https://gopay.replit.app";
   ```

---

## Step 4 — Build for Android (Google Play)

```bash
cd expo-app

# Build AAB for Play Store (runs in EAS cloud — takes ~10 minutes)
eas build --platform android --profile production

# When done, download the .aab file from the EAS dashboard
# Upload it to play.google.com/console
```

**Or build a test APK first (to install directly on a phone):**
```bash
eas build --platform android --profile preview
# This produces an .apk you can install directly without Play Store
```

---

## Step 5 — Build for iOS (App Store)

EAS builds iOS in the cloud but needs your Apple certificates.

```bash
cd expo-app

# First time: EAS will ask for your Apple Developer credentials
# and automatically create provisioning profiles for you
eas build --platform ios --profile production

# EAS asks:
# - Your Apple ID email
# - Your Apple Developer Team ID (found at developer.apple.com/account)
# - It then creates the certificates automatically in your Apple account
```

When the build finishes (~15–20 minutes), EAS gives you a download link for the `.ipa` file.

---

## Step 6 — Submit to App Store (iOS)

```bash
# Update eas.json first — fill in your Apple details:
# "appleId": "your@email.com"
# "ascAppId": "your App Store Connect App ID"  
# "appleTeamId": "XXXXXXXXXX"

eas submit --platform ios --latest
# EAS automatically uploads the latest build to App Store Connect
```

Or download the `.ipa` and upload manually via Xcode → Organizer.

---

## Step 7 — Submit to Google Play (Android)

**Option A — Manual (easiest first time):**
1. Go to **play.google.com/console**
2. Create your app
3. Go to Production → Create Release → Upload the `.aab` from EAS

**Option B — Automatic with EAS Submit:**
1. Create a Google Play API service account key (JSON file)
2. Save it as `expo-app/google-play-key.json`
3. Run:
```bash
eas submit --platform android --latest
```

---

## Every Future Update

When you change code in Replit:
```bash
# 1. The Expo app auto-loads the latest from your deployed URL
#    No rebuild needed for content/UI changes!

# 2. Only rebuild the Expo app if you change:
#    - App icons or splash screen
#    - Native permissions
#    - app.json settings
#    In that case:
npm run build:all   # builds both platforms
```

**Increment version for store updates:**
- Open `expo-app/app.json`
- Increase `"versionCode"` (Android) and `"buildNumber"` (iOS) by 1 each release

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `eas: command not found` | Run `npm install -g eas-cli` |
| `Not logged in` | Run `eas login` |
| iOS build fails - no certificate | Run `eas credentials` to set up signing |
| App shows blank screen | Check that your Replit app is deployed and the URL in App.tsx is correct |
| Android build stuck | Check eas.dev dashboard for build logs |

---

## EAS Dashboard

View all your builds, download binaries, and monitor submissions at:
**https://expo.dev** → Your Account → Projects → gopay-tz
