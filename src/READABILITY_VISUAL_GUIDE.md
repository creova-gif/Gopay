# 📖 READABILITY VISUAL GUIDE
## goPay Tanzania - Text Contrast Quick Reference

---

## 🎨 COLOR SYSTEM AT A GLANCE

### ✅ APPROVED COMBINATIONS

```
LIGHT BACKGROUNDS (White, Gray-50, Gray-100)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
█ text-gray-900  ← Headings, primary text (21:1)
█ text-gray-800  ← Subheadings (14:1)  
█ text-gray-700  ← Body text, important (10:1)
█ text-gray-600  ← Body text, MINIMUM (4.5:1) ✓
  text-gray-500  ← 🚫 AVOID - Only for large text 18pt+
  text-gray-400  ← 🚫 FAIL - Never use for body text
```

```
DARK BACKGROUNDS (Gray-900, Gray-950, Black)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
░ text-white     ← Headings, primary text (21:1)
░ text-gray-100  ← Subheadings (18:1)
░ text-gray-200  ← Body text, important (14:1)
░ text-gray-300  ← Body text, secondary (10:1)
  text-gray-400  ← Supporting text (7:1) - large only
  text-gray-500  ← 🚫 BORDERLINE - Avoid
```

```
GREEN BACKGROUNDS (Emerald-600, Teal-600)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
█ text-white     ← All text (4.8:1) ✓
█ text-gray-50   ← Subtle variations
  text-gray-900  ← 🚫 FAIL - Too low contrast
```

---

## 📱 BEFORE & AFTER EXAMPLES

### Example 1: OnboardingFlow - Skip Button

**BEFORE:**
```tsx
<button className="text-white text-sm font-medium">
  Skip to Demo
</button>
```
**Readability**: ⭐⭐⭐ (Good, but could be better)
**Contrast**: Adequate but thin

**AFTER:**
```tsx
<button className="text-white font-semibold text-sm">
  Skip to Demo
</button>
```
**Readability**: ⭐⭐⭐⭐⭐ (Excellent)
**Contrast**: Enhanced with bolder weight

---

### Example 2: Security Screen - Body Text

**BEFORE:**
```tsx
<div className="text-sm text-gray-300">
  Bank-grade encryption protects your data
</div>
```
**Readability**: ⭐⭐⭐⭐ (Good - 10:1 contrast)
**Issue**: Could be brighter for better visibility

**AFTER:**
```tsx
<div className="text-sm text-gray-200">
  Bank-grade encryption protects your data
</div>
```
**Readability**: ⭐⭐⭐⭐⭐ (Excellent - 14:1 contrast)
**Impact**: 40% improvement in contrast ratio

---

### Example 3: Form Labels

**BEFORE:**
```tsx
<Label className="text-white mb-2 block">
  Full Name *
</Label>
```
**Readability**: ⭐⭐⭐⭐⭐ (Excellent on dark)
**Status**: Already good

**AFTER (Enhanced with brand color):**
```tsx
<Label className="text-emerald-100 mb-2 block text-sm font-semibold">
  Full Name *
</Label>
```
**Readability**: ⭐⭐⭐⭐⭐ (Excellent + brand-aligned)
**Impact**: Better visual hierarchy + emerald brand accent

---

### Example 4: Bilingual Text Hierarchy

**BEFORE (Equal weight):**
```tsx
<div>
  <p className="text-base">Lipa</p>
  <p className="text-base">Pay</p>
</div>
```
**Readability**: ⭐⭐⭐ (No hierarchy)
**Issue**: Languages compete for attention

**AFTER (Swahili-first):**
```tsx
<div>
  <h3 className="text-2xl font-black text-white">
    Lipa
  </h3>
  <p className="text-sm text-emerald-100 font-medium">
    QR • Bili • Huduma za Serikali
  </p>
  <p className="text-xs text-white/50 mt-0.5">
    Pay • Bills • Gov't Services
  </p>
</div>
```
**Readability**: ⭐⭐⭐⭐⭐ (Clear hierarchy)
**Impact**: Swahili primary, English supporting

---

## 🔍 HOW TO SPOT READABILITY ISSUES

### ❌ RED FLAGS

1. **Light Gray on White**
   ```tsx
   <div className="bg-white">
     <p className="text-gray-400">❌ FAIL - 3:1 contrast</p>
     <p className="text-gray-500">❌ FAIL - 3.5:1 contrast</p>
   </div>
   ```

2. **Medium Gray on Dark**
   ```tsx
   <div className="bg-gray-900">
     <p className="text-gray-500">❌ BORDERLINE - 4.5:1</p>
     <p className="text-gray-600">❌ FAIL - Too dark</p>
   </div>
   ```

3. **White on Light Colors**
   ```tsx
   <div className="bg-yellow-400">
     <p className="text-white">❌ FAIL - 2:1 contrast</p>
   </div>
   ```

### ✅ GOOD PATTERNS

1. **Dark Text on Light**
   ```tsx
   <div className="bg-white">
     <h1 className="text-gray-900">✅ 21:1 contrast</h1>
     <p className="text-gray-700">✅ 10:1 contrast</p>
     <span className="text-gray-600">✅ 4.5:1 contrast</span>
   </div>
   ```

2. **Light Text on Dark**
   ```tsx
   <div className="bg-gray-900">
     <h1 className="text-white">✅ 21:1 contrast</h1>
     <p className="text-gray-200">✅ 14:1 contrast</p>
     <span className="text-gray-300">✅ 10:1 contrast</span>
   </div>
   ```

3. **White on Brand Colors**
   ```tsx
   <div className="bg-emerald-600">
     <h1 className="text-white">✅ 4.8:1 contrast</h1>
     <p className="text-emerald-50">✅ 3.2:1 (large text)</p>
   </div>
   ```

---

## 📏 FONT SIZE GUIDELINES

### Minimum Sizes for Readability

| Element | Min Size | Weight | Example |
|---------|----------|--------|---------|
| **Headings H1** | 30px (1.875rem) | Bold-Black | text-3xl font-black |
| **Headings H2** | 24px (1.5rem) | Bold-Black | text-2xl font-bold |
| **Headings H3** | 20px (1.25rem) | Bold-Semibold | text-xl font-semibold |
| **Body Text** | 16px (1rem) | Regular-Medium | text-base font-normal |
| **Supporting Text** | 14px (0.875rem) | Regular-Medium | text-sm font-normal |
| **Captions** | 12px (0.75rem) | Regular | text-xs font-normal |
| **Button Text** | 16px (1rem) | Semibold-Bold | text-base font-semibold |

### Mobile-Specific
- **Minimum touch target**: 44x44px (11mm x 11mm)
- **Minimum body text**: 16px (prevents zoom on iOS)
- **Comfortable reading**: 18-20px for long-form content

---

## 🌍 TANZANIA-SPECIFIC CONSIDERATIONS

### Outdoor Visibility
Tanzania has strong equatorial sunlight. Aim for higher contrast:
- **Minimum**: 4.5:1 (WCAG AA)
- **Recommended**: 7:1 (WCAG AAA)
- **Optimal**: 10:1+ (Maximum readability)

### Device Diversity
Users have varying screen qualities:
- **High-end**: iPhone, Samsung flagship (excellent screens)
- **Mid-range**: Tecno, Infinix (good screens)
- **Budget**: Basic smartphones (lower contrast screens)

**Solution**: Use high contrast text (7:1+) to work on all devices

---

## 🎯 QUICK DECISION FLOWCHART

```
Is the background DARK (gray-700+, black)?
├─ YES → Use text-white or text-gray-100
└─ NO → Continue...

Is the background LIGHT (white, gray-50, gray-100)?
├─ YES → Use text-gray-900 or text-gray-700
└─ NO → Continue...

Is the background a BRAND COLOR (emerald, teal)?
├─ YES → Use text-white or text-gray-50
└─ NO → Test contrast manually

Is this BODY TEXT (<18px)?
├─ YES → Minimum 4.5:1 contrast required
└─ NO → 3:1 contrast acceptable for large text (18px+)

Is this in DIRECT SUNLIGHT?
├─ YES → Aim for 7:1+ contrast
└─ NO → 4.5:1 is acceptable
```

---

## 🛠️ TESTING TOOLS

### Manual Testing
1. **Squint Test**: If you squint and can't read it, it fails
2. **Outdoor Test**: Check on phone in bright sunlight
3. **Screenshot Grayscale**: Convert to B&W - can you read it?

### Automated Tools
1. **Chrome DevTools**: Lighthouse Accessibility audit
2. **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
3. **Figma Plugin**: "Stark" for contrast checking
4. **Browser Extension**: "WAVE" accessibility checker

### Quick Chrome DevTools Check:
```
1. Open DevTools (F12)
2. Go to Elements tab
3. Click on text element
4. Look at Computed styles
5. Check "Contrast ratio" indicator
   ✅ Green checkmark = Pass
   ⚠️ Yellow warning = Borderline
   ❌ Red X = Fail
```

---

## 📋 COMPONENT CHECKLIST

Before submitting any component, verify:

- [ ] All headings use proper color (900 on light, white on dark)
- [ ] All body text meets 4.5:1 minimum contrast
- [ ] All buttons have readable text (white on brand colors)
- [ ] Swahili text is larger/bolder than English equivalent
- [ ] No text-gray-400 or text-gray-500 on white backgrounds
- [ ] No text-gray-500 or darker on dark backgrounds
- [ ] Placeholder text is distinguishable but not too dark
- [ ] Form labels are clearly visible
- [ ] Error messages are high contrast (red-600 or red-700)
- [ ] Success messages are high contrast (green-700 or green-800)

---

## 🎨 SWAHILI/ENGLISH COLOR PATTERN

### Primary Language (Swahili)
```tsx
<h1 className="text-3xl font-black text-gray-900">
  {/* Largest, boldest, darkest */}
</h1>
```

### Secondary Language (English)
```tsx
<p className="text-sm text-gray-600">
  {/* Smaller, lighter, supporting */}
</p>
```

### Complete Pattern:
```tsx
<div className="space-y-2">
  {/* Swahili Primary */}
  <h2 className="text-2xl font-black text-white">
    Malipo ya Bili
  </h2>
  
  {/* Swahili Supporting */}
  <p className="text-sm text-emerald-100 font-medium">
    Lipa umeme, maji, na huduma nyingine
  </p>
  
  {/* English Translation */}
  <p className="text-xs text-white/60">
    Pay electricity, water, and other services
  </p>
</div>
```

---

## ✅ FINAL REMINDERS

1. **Dark on Light**: text-gray-600 minimum
2. **Light on Dark**: text-gray-300 minimum
3. **Brand Colors**: text-white only
4. **Swahili First**: Always larger, bolder, higher contrast
5. **Test Outdoors**: Tanzania has bright sun - test in sunlight
6. **Font Weight Helps**: Bolder text can compensate for lower contrast
7. **When in Doubt**: Go darker (on light bg) or lighter (on dark bg)

---

**Remember**: Accessibility isn't just compliance - it's good UX for everyone! 🚀

---

**Document Version**: 1.0  
**Last Updated**: January 12, 2026  
**Quick Reference**: Always available in `/READABILITY_VISUAL_GUIDE.md`
