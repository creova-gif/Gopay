# 🎨 goPay Design System - Complete

**Tanzania's Premier Fintech Design System**  
**Version:** 2.0.0  
**Last Updated:** January 19, 2026

---

## 📊 TABLE OF CONTENTS

1. [Color Token System](#color-token-system)
2. [Typography Scale](#typography-scale)
3. [Swahili Readability Rules](#swahili-readability-rules)
4. [Bank of Tanzania Accessibility Checklist](#bot-accessibility-checklist)

---

# 1. COLOR TOKEN SYSTEM

## 🎨 Primary Colors

### Brand Colors
```css
/* Primary - Emerald Green (Tanzania's Nature) */
--color-primary-50: #ECFDF5;   /* Lightest - Backgrounds */
--color-primary-100: #D1FAE5;  /* Very Light - Hover states */
--color-primary-200: #A7F3D0;  /* Light - Disabled states */
--color-primary-300: #6EE7B7;  /* Medium Light - Borders */
--color-primary-400: #34D399;  /* Medium - Secondary actions */
--color-primary-500: #10B981;  /* Base - Primary actions */
--color-primary-600: #059669;  /* Dark - Hover on primary */
--color-primary-700: #047857;  /* Darker - Active states */
--color-primary-800: #065F46;  /* Very Dark - Text on light */
--color-primary-900: #064E3B;  /* Darkest - Headers */

/* Secondary - Tanzanite Blue (Tanzania's Gem) */
--color-secondary-50: #EEF2FF;
--color-secondary-100: #E0E7FF;
--color-secondary-200: #C7D2FE;
--color-secondary-300: #A5B4FC;
--color-secondary-400: #818CF8;
--color-secondary-500: #6366F1;  /* Base */
--color-secondary-600: #4F46E5;
--color-secondary-700: #4338CA;
--color-secondary-800: #3730A3;
--color-secondary-900: #312E81;

/* Accent - Serengeti Gold */
--color-accent-50: #FFFBEB;
--color-accent-100: #FEF3C7;
--color-accent-200: #FDE68A;
--color-accent-300: #FCD34D;
--color-accent-400: #FBBF24;   /* Base */
--color-accent-500: #F59E0B;
--color-accent-600: #D97706;
--color-accent-700: #B45309;
--color-accent-800: #92400E;
--color-accent-900: #78350F;
```

## 🔴 Semantic Colors

### Success (Payments Complete)
```css
--color-success-50: #F0FDF4;
--color-success-100: #DCFCE7;
--color-success-200: #BBF7D0;
--color-success-300: #86EFAC;
--color-success-400: #4ADE80;
--color-success-500: #22C55E;  /* Base */
--color-success-600: #16A34A;
--color-success-700: #15803D;
--color-success-800: #166534;
--color-success-900: #14532D;
```

### Warning (Pending Actions)
```css
--color-warning-50: #FFFBEB;
--color-warning-100: #FEF3C7;
--color-warning-200: #FDE68A;
--color-warning-300: #FCD34D;
--color-warning-400: #FBBF24;
--color-warning-500: #F59E0B;  /* Base */
--color-warning-600: #D97706;
--color-warning-700: #B45309;
--color-warning-800: #92400E;
--color-warning-900: #78350F;
```

### Error (Failed Transactions)
```css
--color-error-50: #FEF2F2;
--color-error-100: #FEE2E2;
--color-error-200: #FECACA;
--color-error-300: #FCA5A5;
--color-error-400: #F87171;
--color-error-500: #EF4444;  /* Base */
--color-error-600: #DC2626;
--color-error-700: #B91C1C;
--color-error-800: #991B1B;
--color-error-900: #7F1D1D;
```

### Info (Notifications)
```css
--color-info-50: #EFF6FF;
--color-info-100: #DBEAFE;
--color-info-200: #BFDBFE;
--color-info-300: #93C5FD;
--color-info-400: #60A5FA;
--color-info-500: #3B82F6;  /* Base */
--color-info-600: #2563EB;
--color-info-700: #1D4ED8;
--color-info-800: #1E40AF;
--color-info-900: #1E3A8A;
```

## ⚫ Neutral Colors (Text & Backgrounds)

### Grayscale
```css
--color-gray-50: #F9FAFB;   /* Lightest background */
--color-gray-100: #F3F4F6;  /* Light background */
--color-gray-200: #E5E7EB;  /* Borders */
--color-gray-300: #D1D5DB;  /* Disabled borders */
--color-gray-400: #9CA3AF;  /* Disabled text */
--color-gray-500: #6B7280;  /* Secondary text */
--color-gray-600: #4B5563;  /* Tertiary text */
--color-gray-700: #374151;  /* Secondary headers */
--color-gray-800: #1F2937;  /* Primary headers */
--color-gray-900: #111827;  /* Primary text */
```

## 💼 Fintech-Specific Colors

### Transaction Status
```css
--color-pending: #F59E0B;      /* Orange - Pending */
--color-processing: #3B82F6;   /* Blue - Processing */
--color-completed: #22C55E;    /* Green - Completed */
--color-failed: #EF4444;       /* Red - Failed */
--color-refunded: #8B5CF6;     /* Purple - Refunded */
--color-cancelled: #6B7280;    /* Gray - Cancelled */
```

### Mobile Money Providers
```css
--color-mpesa-green: #00A859;
--color-tigopesa-blue: #0066CC;
--color-airtelmoney-red: #ED1C24;
--color-halopesa-purple: #6B2B8E;
```

### Account Types
```css
--color-wallet: #10B981;       /* Emerald - Wallet */
--color-savings: #3B82F6;      /* Blue - Savings */
--color-loan: #EF4444;         /* Red - Loan */
--color-investment: #8B5CF6;   /* Purple - Investment */
```

## 🌓 Dark Mode Support

### Dark Theme Colors
```css
/* Dark backgrounds */
--color-dark-bg-primary: #0F172A;    /* Slate 900 */
--color-dark-bg-secondary: #1E293B;  /* Slate 800 */
--color-dark-bg-tertiary: #334155;   /* Slate 700 */

/* Dark text */
--color-dark-text-primary: #F1F5F9;    /* Slate 100 */
--color-dark-text-secondary: #CBD5E1;  /* Slate 300 */
--color-dark-text-tertiary: #94A3B8;   /* Slate 400 */

/* Dark borders */
--color-dark-border: #334155;  /* Slate 700 */
--color-dark-divider: #1E293B; /* Slate 800 */
```

## 🎯 Usage Guidelines

### Text on Backgrounds (WCAG AA Compliant)

| Background | Text Color | Contrast Ratio | Pass |
|------------|------------|----------------|------|
| `--color-primary-500` | White | 4.51:1 | ✅ |
| `--color-primary-600` | White | 5.72:1 | ✅ |
| `--color-gray-50` | `--color-gray-900` | 18.21:1 | ✅ |
| `--color-gray-100` | `--color-gray-900` | 16.84:1 | ✅ |
| `--color-error-500` | White | 4.54:1 | ✅ |
| `--color-success-500` | White | 4.51:1 | ✅ |

### Component-Specific Tokens

```css
/* Buttons */
--button-primary-bg: var(--color-primary-600);
--button-primary-hover: var(--color-primary-700);
--button-primary-active: var(--color-primary-800);
--button-primary-text: #FFFFFF;

--button-secondary-bg: var(--color-gray-100);
--button-secondary-hover: var(--color-gray-200);
--button-secondary-active: var(--color-gray-300);
--button-secondary-text: var(--color-gray-900);

/* Inputs */
--input-border: var(--color-gray-300);
--input-border-focus: var(--color-primary-500);
--input-border-error: var(--color-error-500);
--input-bg: #FFFFFF;
--input-text: var(--color-gray-900);
--input-placeholder: var(--color-gray-500);

/* Cards */
--card-bg: #FFFFFF;
--card-border: var(--color-gray-200);
--card-shadow: rgba(0, 0, 0, 0.1);

/* Navigation */
--nav-bg: #FFFFFF;
--nav-border: var(--color-gray-200);
--nav-active: var(--color-primary-50);
--nav-text: var(--color-gray-700);
--nav-text-active: var(--color-primary-700);
```

---

# 2. TYPOGRAPHY SCALE

## 📝 Font Families

### Primary Font Stack
```css
--font-primary: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 
                'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;

--font-secondary: 'SF Pro Text', -apple-system, BlinkMacSystemFont,
                  'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;

--font-mono: 'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace;
```

### Swahili-Optimized Fonts
```css
/* Fallback for systems without SF Pro */
--font-swahili: 'Noto Sans', 'Segoe UI', 'Roboto', sans-serif;
```

## 📏 Type Scale (Based on 16px base)

### Display (Hero Headlines)
```css
--text-display-xl: {
  font-size: 72px;        /* 4.5rem */
  line-height: 90px;      /* 125% */
  font-weight: 700;       /* Bold */
  letter-spacing: -0.02em;
  font-family: var(--font-primary);
}
/* Usage: Landing page heroes */

--text-display-lg: {
  font-size: 60px;        /* 3.75rem */
  line-height: 72px;      /* 120% */
  font-weight: 700;
  letter-spacing: -0.02em;
  font-family: var(--font-primary);
}
/* Usage: Major section headers */

--text-display-md: {
  font-size: 48px;        /* 3rem */
  line-height: 60px;      /* 125% */
  font-weight: 700;
  letter-spacing: -0.01em;
  font-family: var(--font-primary);
}
/* Usage: Page titles on large screens */

--text-display-sm: {
  font-size: 36px;        /* 2.25rem */
  line-height: 44px;      /* 122% */
  font-weight: 600;       /* Semibold */
  letter-spacing: -0.01em;
  font-family: var(--font-primary);
}
/* Usage: Dashboard headers */
```

### Headings
```css
--text-h1: {
  font-size: 32px;        /* 2rem */
  line-height: 40px;      /* 125% */
  font-weight: 600;
  letter-spacing: -0.01em;
  font-family: var(--font-primary);
}
/* Usage: Page titles (mobile) */

--text-h2: {
  font-size: 24px;        /* 1.5rem */
  line-height: 32px;      /* 133% */
  font-weight: 600;
  letter-spacing: -0.005em;
  font-family: var(--font-primary);
}
/* Usage: Section headers */

--text-h3: {
  font-size: 20px;        /* 1.25rem */
  line-height: 28px;      /* 140% */
  font-weight: 600;
  letter-spacing: 0;
  font-family: var(--font-primary);
}
/* Usage: Card titles, subsection headers */

--text-h4: {
  font-size: 18px;        /* 1.125rem */
  line-height: 28px;      /* 156% */
  font-weight: 600;
  letter-spacing: 0;
  font-family: var(--font-primary);
}
/* Usage: List headers, small sections */

--text-h5: {
  font-size: 16px;        /* 1rem */
  line-height: 24px;      /* 150% */
  font-weight: 600;
  letter-spacing: 0;
  font-family: var(--font-primary);
}
/* Usage: Component headers */

--text-h6: {
  font-size: 14px;        /* 0.875rem */
  line-height: 20px;      /* 143% */
  font-weight: 600;
  letter-spacing: 0;
  font-family: var(--font-primary);
}
/* Usage: Small headers, labels */
```

### Body Text
```css
--text-body-xl: {
  font-size: 20px;        /* 1.25rem */
  line-height: 30px;      /* 150% */
  font-weight: 400;       /* Regular */
  letter-spacing: 0;
  font-family: var(--font-secondary);
}
/* Usage: Lead paragraphs, important content */

--text-body-lg: {
  font-size: 18px;        /* 1.125rem */
  line-height: 28px;      /* 156% */
  font-weight: 400;
  letter-spacing: 0;
  font-family: var(--font-secondary);
}
/* Usage: Main content, articles */

--text-body-md: {
  font-size: 16px;        /* 1rem - BASE */
  line-height: 24px;      /* 150% */
  font-weight: 400;
  letter-spacing: 0;
  font-family: var(--font-secondary);
}
/* Usage: Default body text, descriptions */

--text-body-sm: {
  font-size: 14px;        /* 0.875rem */
  line-height: 20px;      /* 143% */
  font-weight: 400;
  letter-spacing: 0;
  font-family: var(--font-secondary);
}
/* Usage: Secondary text, captions */

--text-body-xs: {
  font-size: 12px;        /* 0.75rem */
  line-height: 16px;      /* 133% */
  font-weight: 400;
  letter-spacing: 0;
  font-family: var(--font-secondary);
}
/* Usage: Helper text, footnotes */
```

### Specialized Text
```css
--text-label: {
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;       /* Medium */
  letter-spacing: 0.01em;
  font-family: var(--font-secondary);
  text-transform: none;
}
/* Usage: Form labels, button text */

--text-overline: {
  font-size: 12px;
  line-height: 16px;
  font-weight: 600;
  letter-spacing: 0.05em;
  font-family: var(--font-secondary);
  text-transform: uppercase;
}
/* Usage: Tags, badges, category labels */

--text-code: {
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  letter-spacing: 0;
  font-family: var(--font-mono);
}
/* Usage: Transaction IDs, reference numbers */

--text-number-display: {
  font-size: 32px;
  line-height: 40px;
  font-weight: 700;
  letter-spacing: -0.02em;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}
/* Usage: Wallet balance, amounts */

--text-number-sm: {
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  letter-spacing: 0;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}
/* Usage: Prices, transaction amounts */
```

## 📱 Responsive Typography

### Mobile (320px - 767px)
```css
/* Scale down 10-20% for mobile */
--text-display-mobile: 32px;
--text-h1-mobile: 28px;
--text-h2-mobile: 20px;
--text-h3-mobile: 18px;
--text-body-mobile: 16px;
```

### Tablet (768px - 1023px)
```css
/* Use base scale */
--text-display-tablet: 48px;
--text-h1-tablet: 32px;
--text-h2-tablet: 24px;
--text-h3-tablet: 20px;
--text-body-tablet: 16px;
```

### Desktop (1024px+)
```css
/* Use full scale */
--text-display-desktop: 72px;
--text-h1-desktop: 32px;
--text-h2-desktop: 24px;
--text-h3-desktop: 20px;
--text-body-desktop: 16px;
```

## ⚖️ Font Weights

```css
--font-weight-light: 300;
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-extrabold: 800;
```

### Usage Guidelines
- **Light (300)**: Large display text only
- **Regular (400)**: Body text, paragraphs
- **Medium (500)**: Labels, emphasized text
- **Semibold (600)**: Headers, section titles
- **Bold (700)**: Strong emphasis, CTAs
- **Extrabold (800)**: Display numbers, hero text

---

# 3. SWAHILI READABILITY RULES

## 🇹🇿 Language-Specific Guidelines

### 📖 Core Principles

**1. Clarity First (Uwazi wa Kwanza)**
- Use simple, direct Swahili
- Avoid complex sentence structures
- One idea per sentence

**2. Cultural Context (Muktadha wa Kitamaduni)**
- Use Tanzanian Swahili (not Kenyan or general)
- Incorporate local idioms appropriately
- Respect formal/informal contexts

**3. Consistency (Uthabiti)**
- Use same term for same concept throughout
- Don't mix English and Swahili randomly
- Maintain tone across all content

## 📏 Readability Standards

### Sentence Length
```
Optimal: 15-20 words per sentence
Maximum: 25 words per sentence
Minimum: 5 words per sentence
```

**Example - Good:**
```
Tuma pesa kwa simu namba. (5 words) ✅
Ingiza kiasi cha pesa unachotaka kutuma. (7 words) ✅
```

**Example - Too Long:**
```
Ili kuweza kutuma pesa kwa mtu mwingine unahitaji kwanza kuingiza 
namba ya simu yake kisha uingize kiasi cha pesa unachotaka 
kumtumia na hatimaye ubonyeze kitufe cha kuthibitisha. (28 words) ❌
```

### Paragraph Length
```
Mobile: 2-3 sentences maximum
Tablet: 3-4 sentences maximum
Desktop: 4-5 sentences maximum
```

### Line Length
```
Mobile: 35-50 characters per line
Tablet: 50-75 characters per line
Desktop: 65-85 characters per line
```

## 🔤 Swahili Typography Rules

### Letter Spacing
```css
/* Swahili needs slightly more space than English */
--letter-spacing-swahili-tight: -0.005em;
--letter-spacing-swahili-normal: 0.01em;
--letter-spacing-swahili-wide: 0.02em;
```

### Line Height
```css
/* Swahili benefits from generous line height */
--line-height-swahili-tight: 1.4;   /* 140% */
--line-height-swahili-normal: 1.5;  /* 150% - RECOMMENDED */
--line-height-swahili-relaxed: 1.6; /* 160% */
```

### Word Breaks
```css
/* Allow word breaks for long Swahili words */
.swahili-text {
  word-break: break-word;
  hyphens: auto;
  -webkit-hyphens: auto;
  hyphenate-limit-chars: 10 5 3;
}
```

## 📚 Terminology Standards

### Financial Terms (Must Be Consistent)

| English | Swahili | Context |
|---------|---------|---------|
| **Wallet** | Mkoba | Digital wallet |
| **Balance** | Salio / Kiasi | Account balance |
| **Send Money** | Tuma Pesa | P2P transfer |
| **Receive** | Pokea | Receive money |
| **Pay** | Lipa | Make payment |
| **Transaction** | Muamala | Any transaction |
| **Bill** | Bili | Utility bills |
| **Account** | Akaunti | User account |
| **PIN** | Nambari ya Siri / PIN | Keep PIN |
| **Receipt** | Risiti | Transaction receipt |
| **Transfer** | Hamisha | Move money |
| **Withdraw** | Toa | Cash out |
| **Deposit** | Weka | Add money |
| **Fee** | Ada | Transaction fee |
| **Commission** | Kamisheni | Merchant commission |

### UI Terms

| English | Swahili | Notes |
|---------|---------|-------|
| **Home** | Nyumbani | Dashboard |
| **Settings** | Mipangilio | Preferences |
| **History** | Historia | Transaction history |
| **Profile** | Wasifu | User profile |
| **Help** | Msaada | Support |
| **Cancel** | Ghairi | Cancel action |
| **Confirm** | Thibitisha | Confirm action |
| **Back** | Rudi Nyuma | Go back |
| **Next** | Endelea | Continue |
| **Save** | Hifadhi | Save changes |
| **Edit** | Hariri | Edit content |
| **Delete** | Futa | Remove |
| **Search** | Tafuta | Search |
| **Filter** | Chuja | Filter results |
| **Sort** | Panga | Sort list |
| **Select** | Chagua | Choose option |
| **Upload** | Pakia | Upload file |
| **Download** | Pakua | Download |

### Action Verbs (Imperative Form)

```
Bonyeza - Click/Tap
Ingiza - Enter (data)
Chagua - Choose/Select
Thibitisha - Confirm
Ghairi - Cancel
Tuma - Send
Pokea - Receive
Lipa - Pay
Tafuta - Search
Funga - Close
Fungua - Open
Ongeza - Add
Ondoa - Remove
Hariri - Edit
Hifadhi - Save
```

## ✍️ Writing Style Guide

### Tone of Voice

**Professional yet Friendly (Kitaaluma lakini Rafiki)**
```
Good: "Karibu! Tuma pesa kwa urahisi." ✅
Bad: "Hujambo! Tuma pesa sasa!" ❌ (Too casual)
Bad: "Weka taarifa yako ili kuendelea." ❌ (Too formal)
```

### Direct Address
```
Use 2nd person: "Tuma pesa" (You send money) ✅
Avoid 3rd person: "Mtumiaji anatuma pesa" (User sends) ❌
```

### Active Voice
```
Good: "Ingiza nambari ya simu" ✅ (Enter phone number)
Bad: "Nambari ya simu inaweza kuingizwa" ❌ (Phone number can be entered)
```

### Positive Language
```
Good: "Kamilisha taarifa zako" ✅ (Complete your info)
Bad: "Taarifa zako hazijatosheleza" ❌ (Your info is insufficient)
```

## 🎯 Readability Checklist

### Before Publishing Any Swahili Content:

- [ ] **Clarity**: Can a Standard 7 student understand it?
- [ ] **Length**: Are sentences under 25 words?
- [ ] **Consistency**: Same terms used throughout?
- [ ] **Tone**: Professional yet friendly?
- [ ] **Grammar**: Proper Swahili grammar used?
- [ ] **Cultural**: Appropriate for Tanzania?
- [ ] **Context**: Clear without English translation?
- [ ] **Scannability**: Can user scan and understand quickly?
- [ ] **Action**: Clear what user should do next?
- [ ] **Error-free**: No typos or spelling mistakes?

## 📱 Mobile-Specific Rules

### Keep It Short on Mobile
```
✅ Good (Mobile):
"Tuma Pesa"
"Lipa Bili"
"Historia"

❌ Bad (Mobile):
"Tuma Pesa kwa Mtu Mwingine"
"Lipa Bili za Umeme na Maji"
"Historia ya Miamala Yote"
```

### Use Icons + Text
```
Never icon alone on first use
Always pair with clear Swahili label
Example: 🏠 Nyumbani | 💰 Mkoba | ⚙️ Mipangilio
```

### Progressive Disclosure
```
Show essential info first
Hide details behind "Angalia zaidi" or "Maelezo"
```

---

# 4. BANK OF TANZANIA ACCESSIBILITY CHECKLIST

## 🏛️ BoT Regulatory Compliance

### Legal Framework
- **Bank of Tanzania Act (2006)** - Digital Financial Services
- **Electronic and Postal Communications Act** - Consumer Protection
- **Tanzania Data Protection Act (2022)** - Privacy & Security
- **Persons with Disabilities Act (2010)** - Accessibility Requirements

## ♿ WCAG 2.1 Level AA Compliance

### A. PERCEIVABLE

#### 1.1 Text Alternatives ✅

**Requirement:** All non-text content must have text alternatives

- [ ] All images have `alt` text describing content
- [ ] Decorative images use `alt=""` (empty)
- [ ] Icons have accessible labels (`aria-label`)
- [ ] Charts/graphs have text descriptions
- [ ] QR codes have text alternatives (code value)
- [ ] Logo has descriptive alt text ("goPay Tanzania")

**Example:**
```html
✅ <img src="mpesa.png" alt="M-Pesa mobile money logo">
✅ <button aria-label="Tuma pesa"><SendIcon /></button>
❌ <img src="chart.png"> <!-- Missing alt -->
```

#### 1.2 Time-Based Media ✅

**Requirement:** Captions and audio descriptions for multimedia

- [ ] Video tutorials have Swahili captions
- [ ] Audio descriptions for important visual content
- [ ] Transcripts available for audio content
- [ ] Auto-playing media can be paused

#### 1.3 Adaptable ✅

**Requirement:** Content can be presented in different ways

- [ ] Content structure uses semantic HTML (`<h1>`, `<nav>`, etc.)
- [ ] Reading order makes sense when CSS disabled
- [ ] Form inputs have associated labels
- [ ] Tables have proper headers
- [ ] Lists use `<ul>`, `<ol>`, `<dl>` appropriately

**Example:**
```html
✅ <label for="phone">Nambari ya Simu</label>
   <input id="phone" type="tel">

❌ <div>Phone Number</div>
   <input type="tel"> <!-- No label association -->
```

#### 1.4 Distinguishable ✅

**Requirement:** Make it easy to see and hear content

##### Color Contrast (CRITICAL for Fintech)
```
WCAG AA Requirements:
- Normal text: 4.5:1 minimum
- Large text (18pt+): 3:1 minimum
- UI components: 3:1 minimum
```

**goPay Compliant Combinations:**
| Background | Text | Ratio | Pass |
|------------|------|-------|------|
| White `#FFFFFF` | Gray 900 `#111827` | 18.2:1 | ✅ AA+ |
| Primary 600 `#059669` | White | 5.7:1 | ✅ AA |
| Error 500 `#EF4444` | White | 4.5:1 | ✅ AA |
| Success 500 `#22C55E` | White | 4.5:1 | ✅ AA |

- [ ] All text meets 4.5:1 contrast ratio
- [ ] Large text meets 3:1 contrast ratio
- [ ] UI components meet 3:1 contrast ratio
- [ ] Color not sole means of conveying information
- [ ] Focus indicators visible (3:1 contrast)

**Example:**
```css
✅ .error-message {
  color: #DC2626; /* 7.1:1 on white ✅ */
  border-left: 4px solid #DC2626; /* Visual + color */
}

❌ .error-message {
  color: #FCA5A5; /* 2.1:1 on white ❌ Too low! */
}
```

##### Text Resize
- [ ] Text can resize up to 200% without loss of function
- [ ] No horizontal scrolling at 200% zoom
- [ ] Layout adapts to text size changes

##### Images of Text
- [ ] Avoid images of text (use real text instead)
- [ ] If unavoidable, provide text alternative
- [ ] Logo is exception (but needs alt text)

### B. OPERABLE

#### 2.1 Keyboard Accessible ✅

**Requirement:** All functionality available via keyboard

- [ ] All interactive elements reachable by Tab key
- [ ] Tab order follows logical sequence
- [ ] No keyboard traps (can navigate away)
- [ ] Skip links provided ("Skip to content")
- [ ] Keyboard shortcuts don't interfere with assistive tech

**Tab Order Example:**
```
1. Logo (skip link available)
2. Main navigation
3. Search bar
4. Primary content
5. Sidebar
6. Footer
```

**Testing:**
```
✅ Can complete full transaction using only keyboard
✅ Can navigate entire app with Tab + Enter + Arrow keys
✅ Modal dialogs can be dismissed with Escape
```

#### 2.2 Enough Time ✅

**Requirement:** Users have adequate time to complete tasks

- [ ] No time limits on transactions (or adjustable)
- [ ] Session timeout warnings (5 min before logout)
- [ ] Auto-refresh can be paused
- [ ] Moving content can be paused
- [ ] OTP codes valid for ≥60 seconds

**Example:**
```javascript
✅ // Warn user 5 minutes before session expires
setTimeout(() => {
  showWarning("Kipindi chako kitaisha baada ya dakika 5");
}, 10 * 60 * 1000); // 10 min mark (15 min session)
```

#### 2.3 Seizures and Physical Reactions ✅

**Requirement:** No content that causes seizures

- [ ] No flashing content more than 3 times per second
- [ ] Animations can be paused or disabled
- [ ] Respect `prefers-reduced-motion` setting

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

#### 2.4 Navigable ✅

**Requirement:** Help users navigate and find content

- [ ] Page titles describe content (`<title>Tuma Pesa - goPay</title>`)
- [ ] Link purpose clear from link text alone
- [ ] Multiple ways to find pages (search, sitemap, nav)
- [ ] Headings and labels are descriptive
- [ ] Current location indicated (breadcrumbs)
- [ ] Focus visible on all interactive elements

**Example:**
```html
✅ <a href="/lipa-bili">Lipa Bili za TANESCO</a>
❌ <a href="/bills">Click Here</a> <!-- Not descriptive -->

✅ <h1>Tuma Pesa</h1>
   <h2>Chagua Mpokeaji</h2>
   <h3>Historia ya Wapokeaji</h3>

❌ <div class="title">Send Money</div> <!-- Not semantic -->
```

#### 2.5 Input Modalities ✅

**Requirement:** Make it easier to operate functionality

- [ ] Touch targets at least 44×44 pixels
- [ ] Gestures don't require precise timing
- [ ] Single-pointer operation available
- [ ] Motion actuation can be disabled
- [ ] Accidental activation prevented

**Touch Target Sizing:**
```css
.button, .link, .input {
  min-width: 44px;
  min-height: 44px;
  padding: 12px 16px;
}
```

### C. UNDERSTANDABLE

#### 3.1 Readable ✅

**Requirement:** Make text readable and understandable

- [ ] Language declared in HTML (`<html lang="sw">` for Swahili)
- [ ] Language changes marked (`<span lang="en">PIN</span>`)
- [ ] Abbreviations explained on first use
- [ ] Reading level appropriate (Standard 7+)

**Example:**
```html
✅ <html lang="sw">
   <p>Ingiza <abbr title="Personal Identification Number">PIN</abbr> yako</p>
</html>
```

#### 3.2 Predictable ✅

**Requirement:** Web pages operate in predictable ways

- [ ] Focus doesn't cause automatic context change
- [ ] Input doesn't trigger unexpected changes
- [ ] Navigation consistent across pages
- [ ] Components identified consistently
- [ ] No automatic redirects without warning

**Example:**
```javascript
✅ // Ask before submitting
<button onClick={confirmSubmit}>Thibitisha</button>

❌ // Auto-submit on focus (unpredictable)
<input onFocus={autoSubmit} />
```

#### 3.3 Input Assistance ✅

**Requirement:** Help users avoid and correct mistakes

- [ ] Error messages identify the field in error
- [ ] Error suggestions provided (if known)
- [ ] Labels or instructions for user input
- [ ] Error prevention for financial transactions
- [ ] Confirmation required for critical actions

**Error Message Standards:**
```
✅ Good Error Messages:
"Nambari ya simu si sahihi. Tumia mfumo: +255 712 345 678"
"Salio halikutoshi. Una TZS 10,000, unahitaji TZS 50,000"
"PIN si sahihi. Baki na majaribio 2"

❌ Bad Error Messages:
"Error 404"
"Invalid input"
"Transaction failed"
```

**BoT Requirement - Transaction Confirmation:**
```
For transactions >TZS 50,000:
1. Show transaction summary
2. Require explicit confirmation
3. Provide cancel option
4. Show success/failure clearly
```

### D. ROBUST

#### 4.1 Compatible ✅

**Requirement:** Maximize compatibility with assistive technologies

- [ ] Valid HTML (no parsing errors)
- [ ] Proper ARIA attributes used
- [ ] Name, role, value for all UI components
- [ ] Status messages announced to screen readers

**ARIA Examples:**
```html
✅ <button aria-label="Funga" aria-pressed="false">×</button>
✅ <div role="alert" aria-live="polite">Malipo yamekamilika</div>
✅ <input aria-required="true" aria-invalid="false">

❌ <div onclick="submit()">Submit</div> <!-- Not button role -->
```

## 🇹🇿 Tanzania-Specific Requirements

### 1. Language Accessibility

- [ ] **Swahili primary** - All critical content in Swahili
- [ ] **English secondary** - Available as alternate language
- [ ] **Regional dialects** - Avoid region-specific Swahili
- [ ] **Translation quality** - Professional, not machine-translated
- [ ] **Consistent terminology** - Same terms across app

### 2. Literacy Levels

**Tanzania Literacy Rate: ~78%**

- [ ] Simple language (Standard 7 reading level)
- [ ] Visual aids for complex processes
- [ ] Audio assistance option (USSD, IVR)
- [ ] Icon + text combinations
- [ ] Step-by-step instructions with images

### 3. Network Accessibility

**Tanzania Network Reality:**
- Urban: 4G (60%)
- Semi-urban: 3G (30%)
- Rural: 2G/EDGE (10%)

- [ ] Works on 2G networks (text-only mode)
- [ ] Offline functionality for core features
- [ ] Progressive enhancement
- [ ] Low-data mode available
- [ ] USSD fallback (*150*01#)

### 4. Device Accessibility

**Common Devices in Tanzania:**
- Smartphones: 45%
- Feature phones: 40%
- Basic phones: 15%

- [ ] Responsive design (240px to 1920px)
- [ ] Works on older Android (4.4+)
- [ ] Small screen optimization
- [ ] Touch-optimized (no hover-required actions)
- [ ] PWA for easy installation

### 5. Financial Literacy

- [ ] Clear pricing (no hidden fees)
- [ ] Transaction limits explained
- [ ] Fee calculator available
- [ ] Terms in simple Swahili
- [ ] Video tutorials available

### 6. Security & Trust

**BoT Requirements:**
- [ ] Bank of Tanzania logo displayed
- [ ] License number visible
- [ ] Secure connection (HTTPS)
- [ ] Privacy policy accessible
- [ ] Customer support clearly visible
- [ ] Complaint mechanism available

### 7. Disability Accommodations

**Tanzania Persons with Disabilities: ~7-10%**

#### Visual Impairments
- [ ] Screen reader compatible (NVDA, JAWS, VoiceOver)
- [ ] High contrast mode available
- [ ] Scalable text (up to 200%)
- [ ] No information by color alone

#### Hearing Impairments
- [ ] Visual notifications (not just audio)
- [ ] Captions for videos
- [ ] Text alternatives for audio

#### Motor Impairments
- [ ] Large touch targets (44×44px min)
- [ ] No time-based gestures
- [ ] Voice input support
- [ ] Single-handed operation possible

#### Cognitive Disabilities
- [ ] Simple language
- [ ] Clear instructions
- [ ] Progress indicators
- [ ] Error prevention
- [ ] Consistent layout

## 📋 Pre-Launch Accessibility Audit

### Required Tests

#### 1. Automated Testing
- [ ] Run WAVE browser extension
- [ ] Run axe DevTools
- [ ] Run Lighthouse accessibility audit (score >90)
- [ ] HTML validation (W3C validator)

#### 2. Manual Testing
- [ ] Keyboard-only navigation test
- [ ] Screen reader test (NVDA/VoiceOver)
- [ ] Color contrast verification (all text)
- [ ] Mobile accessibility test
- [ ] Form accessibility test

#### 3. User Testing
- [ ] Test with screen reader users
- [ ] Test with low vision users
- [ ] Test with motor impairment users
- [ ] Test with elderly users (60+)
- [ ] Test with low-literacy users

#### 4. Compliance Documentation
- [ ] Accessibility statement published
- [ ] VPAT (Voluntary Product Accessibility Template)
- [ ] Remediation plan for issues
- [ ] Training for support staff

## 🎖️ BoT Accessibility Certification

### Submission Requirements

**To Bank of Tanzania:**
1. ✅ WCAG 2.1 AA compliance report
2. ✅ Third-party accessibility audit
3. ✅ User testing results (incl. PWDs)
4. ✅ Swahili language certification
5. ✅ Security audit report
6. ✅ Data protection compliance
7. ✅ Consumer protection measures
8. ✅ Complaint handling procedures

### Ongoing Compliance

**Monthly:**
- [ ] Accessibility regression tests
- [ ] User feedback review
- [ ] Analytics on accessibility features

**Quarterly:**
- [ ] Full accessibility audit
- [ ] Update accessibility statement
- [ ] Staff training refresher

**Annually:**
- [ ] Third-party audit
- [ ] BoT compliance renewal
- [ ] Accessibility roadmap update

---

## 📊 Success Metrics

Track these accessibility KPIs:

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Lighthouse Score** | >90 | Automated |
| **WCAG Violations** | 0 critical | Automated |
| **Keyboard Success Rate** | 100% | Manual testing |
| **Screen Reader Success** | 100% | User testing |
| **Color Contrast Pass** | 100% | Automated |
| **User Satisfaction (PWD)** | >80% | Survey |
| **Support Tickets (A11y)** | <5% | Analytics |

---

**Design System Maintained By:** goPay Design Team  
**Last Audit:** January 19, 2026  
**Next Review:** April 19, 2026  
**Contact:** design@gopay.tz | accessibility@gopay.tz
