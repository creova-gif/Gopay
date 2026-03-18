# 🌍 World-Class Design Rules - Quick Reference

## TL;DR

**Before touching ANY screen, ask:**
1. What is the ONE hero element?
2. Are gradients only on hero + CTAs?
3. Does every card answer "What can I do right now?"
4. Is ALL motion < 300ms?
5. Is it Swahili-first with English fallback?
6. Is AI branding removed?

If ANY answer is "no" → redesign needed.

---

## ⚡ Quick Rules Checklist

### Visual Hierarchy

```
✅ ONE hero card per screen
✅ Gradient = hero + primary CTA ONLY
✅ Secondary = soft glass surfaces
✅ Supporting content = clean lists

❌ Multiple competing gradients
❌ Gradient on every card
❌ Flat boring grays everywhere
```

### Content Rules

```
✅ Every card: "What can I do?"
✅ Copy: Outcome-focused
✅ Benefits: ONE line maximum
✅ Actions: Clear, immediate

❌ Technology explanations
❌ Backend provider details
❌ "Powered by AI" marketing
❌ Feature lists
```

### Motion Rules

```
✅ Duration: < 300ms
✅ Motion on: Screen entry, tap, state change
✅ Easing: easeOut (no elastic/bounce)
✅ Respects: prefers-reduced-motion

❌ > 300ms animations
❌ Infinite loops (except subtle pulse)
❌ Bouncing/elastic
❌ Animating everything at once
```

### Language Rules

```
✅ Default: Swahili
✅ Fallback: English
✅ Toggle: Always visible
✅ Consistency: 100% per screen

❌ Mixed language same screen
❌ English-first for Tanzania
❌ Literal translations
❌ Formal/stuffy Swahili
```

### AI Branding

```
✅ Intelligence: Invisible
✅ Help: "Smart Travel Help"
✅ Search: Enhanced results
✅ Suggestions: Natural

❌ "AI Travel Assistant"
❌ "Powered by AI"
❌ Robot/sparkle icons
❌ Feature marketing
```

---

## 📐 Visual System Reference

### Hero Card Template

```tsx
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
  className="bg-gradient-to-br from-emerald-600 to-green-700 rounded-3xl p-6 shadow-2xl"
>
  {/* Live indicator */}
  <div className="flex items-center gap-2 mb-3">
    <motion.div
      className="w-2 h-2 bg-emerald-300 rounded-full"
      animate={{ opacity: [1, 0.5, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <span className="text-xs text-white/70">Updated just now</span>
  </div>
  
  {/* Main content */}
  <h2 className="text-lg font-bold text-white/90">Title</h2>
  <p className="text-4xl font-black text-white">Primary Value</p>
  
  {/* Action */}
  <button className="text-sm text-white/80 hover:text-white">
    Action →
  </button>
</motion.div>
```

### Supporting Card Template (Glass Surface)

```tsx
<motion.button
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, delay: 0.1 }}
  whileTap={{ scale: 0.98 }}
  className="bg-emerald-500/20 backdrop-blur-xl rounded-2xl p-4 border border-white/10"
>
  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-3">
    <Icon className="w-6 h-6 text-emerald-400" />
  </div>
  
  <h3 className="font-bold text-sm text-gray-900">Title</h3>
  <p className="text-xs text-gray-600">ONE benefit line</p>
</motion.button>
```

---

## 🎬 Motion Patterns Reference

### Screen Entry (All screens)

```tsx
// Container
initial={{ opacity: 0, y: 12 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3, ease: 'easeOut' }}

// Stagger children
transition={{ duration: 0.3, delay: 0.1 + (index * 0.05) }}
```

### Card Tap (All interactive cards)

```tsx
whileTap={{ scale: 0.98 }}
transition={{ duration: 0.12 }}

// With haptic (mobile)
onTapStart={() => {
  if ('vibrate' in navigator) {
    navigator.vibrate(10);
  }
}}
```

### Balance Count-up (Numbers)

```tsx
useEffect(() => {
  const duration = 800; // ms
  const steps = 60;
  const increment = target / steps;
  let current = 0;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      setDisplay(target);
      clearInterval(timer);
    } else {
      setDisplay(Math.floor(current));
    }
  }, duration / steps);
  
  return () => clearInterval(timer);
}, [target]);
```

### Live Indicator (Subtle pulse)

```tsx
<motion.div
  className="w-2 h-2 bg-emerald-400 rounded-full"
  animate={{ opacity: [1, 0.5, 1] }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut'
  }}
/>
```

---

## 🌍 Swahili Copy Examples

### Home Screen

```tsx
const COPY = {
  greeting: {
    morning: { sw: 'Habari za Asubuhi', en: 'Good Morning' },
    afternoon: { sw: 'Habari za Mchana', en: 'Good Afternoon' },
    evening: { sw: 'Habari za Jioni', en: 'Good Evening' }
  },
  balance: { sw: 'Salio Kuu', en: 'Main Balance' },
  updated: { sw: 'Imesasishwa sasa hivi', en: 'Updated just now' }
};
```

### Quick Actions

```tsx
const ACTIONS = {
  addMoney: { sw: 'Jaza Pesa', en: 'Add Money' },
  sendMoney: { sw: 'Tuma Pesa', en: 'Send Money' },
  scanQR: { sw: 'Scan QR', en: 'Scan QR' },
  payBills: { sw: 'Lipa Bili', en: 'Pay Bills' }
};
```

### Services

```tsx
const SERVICES = {
  travel: { sw: 'Safari', en: 'Travel' },
  transport: { sw: 'Usafiri', en: 'Transport' },
  payments: { sw: 'Malipo', en: 'Payments' },
  lifestyle: { sw: 'Ishi', en: 'Lifestyle' },
  government: { sw: 'Serikali', en: 'Government' }
};
```

### Transaction Types

```tsx
const TRANSACTIONS = {
  sent: { sw: 'Umetuma', en: 'Sent' },
  received: { sw: 'Umepokea', en: 'Received' },
  bill: { sw: 'Bili', en: 'Bill Payment' },
  airtime: { sw: 'Airtime', en: 'Airtime' }
};
```

---

## 🚫 What NOT to Do

### ❌ Multiple Hero Cards

```tsx
// WRONG
<div className="bg-gradient...">Balance</div>
<div className="bg-gradient...">Savings</div>
<div className="bg-gradient...">Rewards</div>
// Everything competes, nothing stands out
```

```tsx
// RIGHT
<div className="bg-gradient...">Balance</div> {/* Hero */}
<div className="bg-white/10...">Savings</div> {/* Supporting */}
<div className="bg-white/10...">Rewards</div> {/* Supporting */}
// Clear hierarchy
```

### ❌ Mixed Language

```tsx
// WRONG
<h1>Karibu</h1>
<p>Your balance is</p>
<button>Tuma Pesa</button>
// Confusing, unprofessional
```

```tsx
// RIGHT (Swahili)
<h1>Karibu</h1>
<p>Salio lako ni</p>
<button>Tuma Pesa</button>

// OR (English)
<h1>Welcome</h1>
<p>Your balance is</p>
<button>Send Money</button>
// Consistent, clear
```

### ❌ AI Branding

```tsx
// WRONG
<button>
  <Sparkles /> AI Travel Assistant
</button>

// RIGHT
<button>
  <Plane /> Book Travel
</button>
// Or: "Smart Travel Help" (if needed)
```

### ❌ Long Animations

```tsx
// WRONG
transition={{ duration: 0.8, type: 'spring', bounce: 0.5 }}
// Too slow, bouncy, game-like

// RIGHT
transition={{ duration: 0.3, ease: 'easeOut' }}
// Fast, smooth, professional
```

---

## 📊 Quick Comparison Matrix

| Element | ❌ Before | ✅ After |
|---------|-----------|----------|
| **Hero cards** | 3-5 competing | 1 clear |
| **Gradient usage** | 8-10 cards | 2 (hero + CTA) |
| **Card purpose** | "We have AI!" | "Book flights" |
| **Animation time** | 500-800ms | < 300ms |
| **Language** | Mixed 60% | Pure 100% |
| **AI mentions** | 3-5 visible | 0 |
| **Motion style** | Bouncy, elastic | Smooth, easeOut |

---

## 🎯 Screen-by-Screen Checklist

### Home Dashboard:
- [ ] ONE hero: Wallet balance
- [ ] Quick actions: Glass surfaces (no gradients)
- [ ] Recent activity: Clean list
- [ ] Promotional card: Removed or minimal
- [ ] Swahili-first: "Habari", "Salio", "Vitendo"

### Services:
- [ ] ONE featured: SGR Express (or current promo)
- [ ] Grouped by intent: Travel, Transport, Payments, Lifestyle
- [ ] Cards: icon + title + ONE benefit
- [ ] AI services: Renamed or removed
- [ ] Internal tools: Hidden from main UI

### Finance:
- [ ] ONE hero: Total savings
- [ ] Features: Clean list rows (not cards)
- [ ] Copy: Outcome-focused ("Grow wealth", not "Investment tool")
- [ ] Growth indicators: Subtle (not celebratory)

### Bookings:
- [ ] ONE hero: Next upcoming trip
- [ ] Ticket card: Official, verifiable
- [ ] Actions: Ticket, Download, Share (primary)
- [ ] Status: Confirmation highly visible

### Profile:
- [ ] ONE hero: Identity card
- [ ] Settings: Reduced color intensity
- [ ] Logout: Clear but not alarming
- [ ] Spacing: Consistent, generous

---

## 🚀 Integration Code Snippets

### Replace Dashboard:

```tsx
import { DashboardWorldClass } from './components/DashboardWorldClass';

<DashboardWorldClass
  user={user}
  onNavigate={setCurrentPage}
  onLogout={handleLogout}
/>
```

### Replace Services:

```tsx
import { ServicesWorldClass } from './components/ServicesWorldClass';

<ServicesWorldClass
  onBack={() => setCurrentPage('dashboard')}
  onNavigate={setCurrentPage}
  language="sw"
/>
```

### Add Language Toggle:

```tsx
const [language, setLanguage] = useState<'sw' | 'en'>('sw');

<div className="flex gap-2">
  <button
    onClick={() => setLanguage('sw')}
    className={language === 'sw' ? 'active' : ''}
  >
    SW
  </button>
  <button
    onClick={() => setLanguage('en')}
    className={language === 'en' ? 'active' : ''}
  >
    EN
  </button>
</div>
```

---

## ✅ Final Validation

Before deploying ANY screen, verify:

```
Visual:
✅ ONE clear hero with gradient
✅ Supporting cards = glass surfaces
✅ No competing visual elements

Content:
✅ Every card answers "What can I do?"
✅ No technology explanations
✅ No AI branding

Motion:
✅ All animations < 300ms
✅ Smooth easeOut (no bounce)
✅ Respects reduced motion

Language:
✅ 100% Swahili OR 100% English
✅ Language toggle visible
✅ Natural translations (not literal)

Performance:
✅ 60fps on animations
✅ < 2s load time
✅ No layout shifts
```

---

**If all checkboxes pass → Ship it.** 🚀

---

**Version:** 3.0.0 (World-Class Reference)  
**Status:** ✅ Production Ready  
**Last Updated:** February 7, 2026
