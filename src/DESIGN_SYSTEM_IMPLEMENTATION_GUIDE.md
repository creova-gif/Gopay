# 🎨 Design System Implementation Guide

Quick reference for implementing the goPay Design System in your code.

---

## 📥 Setup

### 1. Import Design Tokens

```css
/* In your main CSS file or globals.css */
@import './styles/design-tokens.css';
```

### 2. Use Tokens in Your Components

```tsx
// React/TypeScript Component
<button className="bg-primary text-white px-4 py-3 rounded-lg">
  Tuma Pesa
</button>
```

---

## 🎨 Quick Reference

### Colors

```tsx
// Primary Actions
<button style={{ backgroundColor: 'var(--color-primary-600)' }}>
  Primary Button
</button>

// Status Colors
<div className="text-success">Malipo yamekamilika ✅</div>
<div className="text-error">Kosa limetokea ❌</div>
<div className="text-warning">Inasubiri ⏳</div>
```

### Typography

```tsx
// Headings
<h1 className="text-h1">Tuma Pesa</h1>
<h2 className="text-h2">Chagua Mpokeaji</h2>

// Body Text
<p className="text-body text-swahili">
  Ingiza kiasi cha pesa unachotaka kutuma.
</p>

// Small Text
<span className="text-small text-gray-500">
  Ada: TZS 500
</span>
```

### Spacing

```tsx
// Using space tokens
<div style={{
  padding: 'var(--space-4)',      // 16px
  margin: 'var(--space-6)',       // 24px
  gap: 'var(--space-3)'           // 12px
}}>
  Content
</div>
```

### Shadows

```tsx
// Card with shadow
<div style={{
  boxShadow: 'var(--shadow-md)',
  borderRadius: 'var(--radius-lg)'
}}>
  Card Content
</div>
```

---

## ✅ Accessibility Checklist for Developers

### Before Pushing Code:

```tsx
// ✅ GOOD - Accessible Button
<button
  type="button"
  aria-label="Tuma pesa kwa John Doe"
  className="touch-target bg-primary text-white"
  onClick={handleSend}
>
  <SendIcon aria-hidden="true" />
  <span>Tuma Pesa</span>
</button>

// ❌ BAD - Not Accessible
<div onClick={handleSend}>
  <SendIcon />
</div>
```

### Form Inputs:

```tsx
// ✅ GOOD - Accessible Form
<div>
  <label htmlFor="phone" className="text-small font-medium">
    Nambari ya Simu
  </label>
  <input
    id="phone"
    type="tel"
    aria-required="true"
    aria-invalid={hasError}
    aria-describedby={hasError ? "phone-error" : undefined}
    className="touch-target"
  />
  {hasError && (
    <div id="phone-error" role="alert" className="text-error text-small">
      Nambari si sahihi
    </div>
  )}
</div>
```

### Images:

```tsx
// ✅ GOOD - Accessible Image
<img 
  src="/mpesa-logo.png" 
  alt="M-Pesa mobile money logo"
  width={120}
  height={40}
/>

// ❌ BAD - Missing alt text
<img src="/logo.png" />
```

---

## 🇹🇿 Swahili Content Guidelines

### ✅ DO:

```tsx
// Clear, concise Swahili
<h1>Tuma Pesa</h1>
<p>Ingiza kiasi cha pesa.</p>
<button>Endelea</button>

// Use consistent terms
const TERMS = {
  wallet: 'Mkoba',
  balance: 'Salio',
  send: 'Tuma',
  receive: 'Pokea',
  pay: 'Lipa'
};
```

### ❌ DON'T:

```tsx
// Too complex
<p>
  Ili uweze kutuma pesa kwa mtu mwingine, unahitaji kwanza 
  kuingiza nambari ya simu yake halafu uingize kiasi cha 
  pesa unachotaka kumtumia.
</p>

// Mixed languages randomly
<button>Tuma Money</button> // ❌
<button>Tuma Pesa</button>  // ✅
```

---

## 📊 Color Contrast Checker

### Approved Combinations (WCAG AA):

| Background | Text | Ratio | Use Case |
|------------|------|-------|----------|
| `primary-600` | White | 5.7:1 | Primary buttons |
| White | `gray-900` | 18.2:1 | Body text |
| `error-500` | White | 4.5:1 | Error buttons |
| `success-500` | White | 4.5:1 | Success messages |

### Test Your Colors:

```bash
# Use this online tool:
https://webaim.org/resources/contrastchecker/

# Or this browser extension:
# Chrome: WAVE Evaluation Tool
```

---

## 🧪 Testing Checklist

Before deploying:

```markdown
- [ ] All text readable at 200% zoom
- [ ] Tab navigation works (no traps)
- [ ] Forms have labels
- [ ] Buttons have descriptive text
- [ ] Images have alt text
- [ ] Colors meet contrast requirements
- [ ] Focus states visible
- [ ] Error messages clear
- [ ] Language set to Swahili (`lang="sw"`)
- [ ] Tested with keyboard only
```

---

## 📱 Responsive Design

```tsx
// Mobile-first approach
<div className="
  p-4           /* Mobile: 16px padding */
  md:p-6        /* Tablet: 24px padding */
  lg:p-8        /* Desktop: 32px padding */
  
  text-base     /* Mobile: 16px text */
  md:text-lg    /* Tablet: 18px text */
  lg:text-xl    /* Desktop: 20px text */
">
  Responsive Content
</div>
```

---

## 🎯 Common Patterns

### Primary Button

```tsx
<button className="
  bg-primary hover:bg-primary-700 active:bg-primary-800
  text-white font-semibold
  px-6 py-3 rounded-lg
  touch-target
  transition-colors duration-base
  focus-visible
">
  Tuma Pesa
</button>
```

### Input Field

```tsx
<input
  type="text"
  className="
    w-full px-4 py-3
    border border-gray-300
    focus:border-primary-500 focus:ring-2 focus:ring-primary-100
    rounded-lg
    text-base
    transition-colors duration-base
  "
  placeholder="Ingiza nambari ya simu"
/>
```

### Card

```tsx
<div className="
  bg-white
  border border-gray-200
  rounded-lg
  p-4 md:p-6
  shadow-md hover:shadow-lg
  transition-shadow duration-base
">
  Card Content
</div>
```

### Status Badge

```tsx
// Success
<span className="
  inline-flex items-center gap-1
  px-3 py-1
  bg-success-50 text-success-700
  rounded-full
  text-sm font-medium
">
  ✓ Imekamilika
</span>

// Pending
<span className="
  inline-flex items-center gap-1
  px-3 py-1
  bg-warning-50 text-warning-700
  rounded-full
  text-sm font-medium
">
  ⏳ Inasubiri
</span>
```

---

## 📚 Further Reading

- **Full Design System:** `/DESIGN_SYSTEM_COMPLETE.md`
- **Color Tokens:** `/styles/design-tokens.css`
- **Typography System:** Section 2 of Design System doc
- **Accessibility Checklist:** Section 4 of Design System doc

---

**Questions?** Contact: design@gopay.tz
