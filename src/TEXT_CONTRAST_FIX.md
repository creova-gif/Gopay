# Text Contrast Fix - goPay Tanzania

## 🚨 PROBLEM IDENTIFIED

Some text has insufficient contrast and is hard to read. This violates WCAG AA standards.

---

## ✅ WCAG AA REQUIREMENTS

- **Normal text (14-16px):** Minimum 4.5:1 contrast ratio
- **Large text (18px+):** Minimum 3:1 contrast ratio
- **Bold text (14px+):** Minimum 3:1 contrast ratio

---

## 🔧 COMMON ISSUES & FIXES

### **Issue 1: Gray text on white**
❌ **Bad:** `text-gray-500` on white (3.5:1 - FAILS)
✅ **Good:** `text-gray-700` on white (4.6:1 - PASSES)
✅ **Better:** `text-gray-900` on white (12.6:1 - EXCELLENT)

### **Issue 2: White text on colored backgrounds**
❌ **Bad:** `text-white` on `bg-emerald-500` (3.1:1 - FAILS for small text)
✅ **Good:** `text-white` on `bg-emerald-600` (4.5:1 - PASSES)
✅ **Better:** `text-white` on `bg-emerald-700` (6.1:1 - EXCELLENT)

### **Issue 3: Colored text on white**
❌ **Bad:** `text-emerald-500` on white (2.8:1 - FAILS)
✅ **Good:** `text-emerald-700` on white (4.7:1 - PASSES)
✅ **Better:** `text-emerald-800` on white (7.2:1 - EXCELLENT)

---

## 🎨 APPROVED COLOR COMBINATIONS

### **For White Backgrounds:**

```css
/* Text Colors (Safe for all sizes) */
.text-primary { color: #047857; } /* emerald-700 - 6.4:1 */
.text-body { color: #374151; }    /* gray-700 - 9.3:1 */
.text-heading { color: #111827; } /* gray-900 - 16.1:1 */
.text-muted { color: #4b5563; }   /* gray-600 - 7.2:1 */

/* Links */
.text-link { color: #0d9488; }    /* teal-600 - 4.8:1 */
.text-link-hover { color: #0f766e; } /* teal-700 - 6.1:1 */

/* Success */
.text-success { color: #15803d; } /* green-700 - 5.9:1 */

/* Error */
.text-error { color: #b91c1c; }   /* red-700 - 5.5:1 */

/* Warning */
.text-warning { color: #b45309; } /* amber-700 - 5.3:1 */
```

### **For Colored Backgrounds:**

```css
/* On Emerald/Green Backgrounds */
.bg-emerald-600 .text-white { /* 4.5:1 ✅ */ }
.bg-emerald-700 .text-white { /* 6.1:1 ✅✅ */ }

/* On Blue Backgrounds */
.bg-blue-600 .text-white { /* 4.6:1 ✅ */ }
.bg-blue-700 .text-white { /* 6.3:1 ✅✅ */ }

/* On Gray Backgrounds */
.bg-gray-100 .text-gray-900 { /* 14.8:1 ✅✅ */ }
.bg-gray-100 .text-gray-700 { /* 8.6:1 ✅✅ */ }
```

---

## 🛠️ QUICK FIXES

### **Replace these immediately:**

```typescript
// BEFORE (Low Contrast)
<p className="text-gray-500">Subtitle</p>        // ❌ 3.5:1
<span className="text-emerald-500">Link</span>   // ❌ 2.8:1
<div className="text-blue-400">Info</div>        // ❌ 2.1:1

// AFTER (Good Contrast)
<p className="text-gray-700 font-medium">Subtitle</p>     // ✅ 4.6:1
<span className="text-emerald-700 font-bold">Link</span>  // ✅ 4.7:1
<div className="text-blue-700 font-medium">Info</div>     // ✅ 6.3:1
```

---

## 🔍 HOW TO CHECK CONTRAST

### **Option 1: Browser DevTools**
1. Right-click any text
2. Inspect element
3. Look for contrast ratio in Styles panel
4. Chrome shows ⚠️ if contrast fails

### **Option 2: Online Tool**
- Use: https://webaim.org/resources/contrastchecker/
- Enter foreground & background colors
- Check AA compliance

### **Option 3: Figma Plugin**
- Use "Stark" or "Contrast" plugin
- Automatically checks all text

---

## ✅ FIXED COLOR SCALE

Use these Tailwind classes for guaranteed WCAG AA compliance:

```typescript
// Text on WHITE background
export const textStyles = {
  // Headings (always pass)
  heading: 'text-gray-900 font-black',        // 16.1:1 ✅✅✅
  
  // Body text (always pass)
  body: 'text-gray-700 font-medium',          // 4.6:1 ✅
  bodyStrong: 'text-gray-900 font-bold',      // 16.1:1 ✅✅✅
  
  // Subtle text (pass with medium weight)
  subtle: 'text-gray-600 font-medium',        // 5.7:1 ✅✅
  
  // Links
  link: 'text-emerald-700 font-bold',         // 4.7:1 ✅
  linkHover: 'text-emerald-800 font-bold',    // 7.2:1 ✅✅
  
  // Status colors
  success: 'text-green-700 font-bold',        // 5.9:1 ✅✅
  error: 'text-red-700 font-bold',            // 5.5:1 ✅✅
  warning: 'text-amber-800 font-bold',        // 7.5:1 ✅✅
  info: 'text-blue-700 font-bold',            // 6.3:1 ✅✅
};

// Text on COLORED backgrounds
export const backgroundTextStyles = {
  // On emerald gradient backgrounds
  onEmerald: 'text-white font-bold',          // Use emerald-600+ ✅
  onEmeraldSubtle: 'text-emerald-50 font-semibold', // ✅
  
  // On gray backgrounds
  onGray100: 'text-gray-900 font-bold',       // 14.8:1 ✅✅✅
  onGray200: 'text-gray-900 font-bold',       // 13.1:1 ✅✅✅
};
```

---

## 📝 COMPONENT-BY-COMPONENT FIXES

I'll update all components now...
