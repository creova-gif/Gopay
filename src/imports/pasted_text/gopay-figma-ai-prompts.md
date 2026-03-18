GoPay Tanzania
Complete Figma AI Redesign Prompt Suite
World-Class Super App — All 14 Screens + Design System

 

 
HOW TO USE THIS DOCUMENT

Follow these steps exactly for every screen:
1. Open your Figma file
2. Select the screen you want to update
3. Open Figma AI (the AI icon in your toolbar)
4. Copy the prompt for that screen from this document
5. Paste it into Figma AI and run
6. Repeat for every screen
IMPORTANT: Always run Prompt 0 (Global Design System) FIRST before touching any individual screen.
 
 

QUICK REFERENCE — DESIGN TOKENS

Apply these values exactly. No deviations.
 
Token
Value
Background
#080d08
Card fill
rgba(255,255,255,0.04)
Card border
rgba(255,255,255,0.08)
Primary green button
#16a34a
Icon green / credit amounts
#4ade80
Text primary
#ffffff
Text secondary
rgba(255,255,255,0.50)
Text tertiary
rgba(255,255,255,0.30)
Balance card gradient start
#14532d
Balance card gradient end
#052e16
Splash background start
#052e16
Button border radius
18px
Card border radius
20px
Small card border radius
16px
Input border radius
14px
Horizontal screen margin
24px
Base spacing unit
8px
Display / heading font
Syne
Body / UI font
DM Sans
Icon stroke width
1.5px
Icon style
Line icons, round caps & joins
 
 

PROMPT 0 — GLOBAL DESIGN SYSTEM

Run this FIRST on your entire Figma file before touching individual screens. This establishes the color, typography, and component system.
 
You are a Principal Fintech Product Designer applying a world-class design system.
Apply this global system across the ENTIRE Figma file.
 
COLORS — create as Figma Local Styles:
 green/900 = #052e16
 green/800 = #14532d
 green/700 = #15803d
 green/600 = #16a34a (primary)
 green/400 = #4ade80 (icons, credit)
 neutral/900 = #0a0a0a
 neutral/800 = #080d08 (screen bg)
 surface/card = rgba(255,255,255,0.04)
 surface/border = rgba(255,255,255,0.08)
 
TYPOGRAPHY — create as Figma Text Styles:
 display/hero: Syne 42px 800 white -2px letter-spacing
 heading/xl: Syne 32px 700 white -1px
 heading/l: Syne 26px 700 white -0.5px
 heading/m: Syne 24px 700 white
 heading/s: Syne 20px 700 white
 body/default: DM Sans 15px 400 white
 body/small: DM Sans 14px 300 rgba(255,255,255,0.50)
 body/xs: DM Sans 13px 400 rgba(255,255,255,0.40)
 label/caps: DM Sans 11px 500 uppercase 0.8px spacing rgba(255,255,255,0.30)
 
RULES — non-negotiable:
 1. ONE gradient max per screen (balance card only)
 2. ZERO emojis in financial UI or navigation
 3. Green + neutrals only — no rainbow palette
 4. ONE visual hero per screen — everything else steps back
 5. Line icons only — SVG, 1.5px stroke, round caps
 6. Remove all demo mode artifacts
 7. Remove all AI-labeled widgets visible to users
 8. Remove all promotional carousels from dashboard
 
 

PROMPT 1 — SPLASH / BRAND AUTHORITY SCREEN

Redesign the opening splash/welcome screen. This is the investor's first impression.
 
Redesign the splash screen to match this exact spec:
 
BACKGROUND: 160deg gradient #052e16 → #0a1a0a → #080d08
Add one 280px radial glow rgba(34,197,94,0.10) centered behind logo.
 
LOGO MARK:
 - 80x80px rounded square, radius 26px
 - Border: 1.5px solid rgba(34,197,94,0.30)
 - Outer halo ring: 96x96px, 1px border rgba(34,197,94,0.08)
 - Inside: 2x2 grid of squares in green at 0.9/0.5/0.5/0.25 opacity
 - Animate: slow scale pulse 1.0→1.02 over 4s loop
 
APP NAME: "GoPay"
 Syne 42px 800 white -2px letter-spacing, centered
 
TAGLINE: "Huduma salama za malipo na safari"
 DM Sans 14px 300 rgba(255,255,255,0.40) centered
 
TRUST ROW (3 items, green dot + label each):
 "Salama" | "BoT Compliant" | "Imesimbwa"
 DM Sans 11px rgba(255,255,255,0.35)
 
PRIMARY BUTTON "Anza":
 Full width, 56px height, radius 18px
 Fill: #16a34a solid (NO gradient)
 DM Sans 16px 500 white
 
GHOST BUTTON "Ingia Akaunti":
 Same size, transparent fill
 Border: 1px rgba(255,255,255,0.10)
 DM Sans 16px 400 rgba(255,255,255,0.70)
 
COMPLIANCE TEXT (very bottom):
 "Imeidhinishwa na Benki Kuu ya Tanzania"
 DM Sans 11px rgba(255,255,255,0.20) centered
 
REMOVE: Demo Mode button, feature icon rows, gradient stripe,
 emojis, marketing language, promotional content.
 
 

PROMPT 2 — SIGN IN SCREEN

Redesign the sign in authentication screen.
 
Redesign Sign In screen. Keep routing intact.
 
BACKGROUND: #080d08
 
BACK BUTTON: 40x40px, radius 14px, rgba white 0.04 fill, 1px rgba white 0.08 border
 
TITLE: "Karibu Tena" — Syne 30px 700 white -0.8px tracking
SUBTITLE: "Ingia kwenye akaunti yako ya GoPay" — DM Sans 14px 300 rgba white 0.4
 
SEGMENTED CONTROL:
 Container: rgba white 0.05, radius 14px, 4px padding
 Active segment: #15803d fill, radius 10px, DM Sans 14px 500 white
 Inactive: transparent, DM Sans 14px 400 rgba white 0.4
 Tabs: "Barua Pepe" | "Simu"
 
INPUTS:
 Label: DM Sans 11px 500 uppercase 0.8px rgba white 0.35
 Field: rgba white 0.05, 1px rgba white 0.08 border, radius 14px, 16px 18px padding
 Text: DM Sans 15px white, placeholder rgba white 0.20
 Focus: #16a34a border, rgba(34,197,94,0.05) fill
 Fields: Email Address, Password
 "Umesahau nywila?" right-aligned link in #4ade80
 
PRIMARY BUTTON: "Ingia" — green, full spec
 
DIVIDER: line + "au endelea na" + line
 
SOCIAL BUTTONS: Google | Apple side by side
 rgba white 0.04 fill, 1px rgba white 0.08 border, radius 12px, height 50px
 
SWITCH: "Huna akaunti? Jisajili" — link in #4ade80
 
REMOVE: Demo mode, promotional content, emojis, feature marketing.
 
 

PROMPT 3 — SIGN UP SCREEN

Redesign the account creation / registration screen.
 
Redesign Sign Up screen. Same visual language as Sign In.
 
TITLE: "Fungua Akaunti" — Syne 30px 700 white
SUBTITLE: "Jiunge na watumiaji 2.4M+ wa GoPay"
 
PROGRESS BAR (below header):
 3px track rgba white 0.08, fill #16a34a at 33% (step 1 of 3)
 Label below: "Hatua 1 ya 3 — Maelezo ya Kibinafsi"
 DM Sans 11px rgba white 0.3
 
FIELDS:
 Row 1: First Name + Last Name side by side (10px gap)
 Row 2: Phone Number full width
 Row 3: Email full width
 All follow global input spec, 16px vertical gap between rows
 
LEGAL TEXT: DM Sans 12px rgba white 0.20 centered below button
"Kwa kuendelea, unakubali Masharti na Sera ya Faragha yetu"
 
PRIMARY BUTTON: "Endelea" — green
 
 

PROMPT 4 — HOME DASHBOARD

The most critical screen. One hero (balance), everything else secondary. No promotional content.
 
Redesign Home Dashboard. Do NOT change navigation routes.
 
HEADER:
 Left: "Habari za asubuhi" (DM Sans 13px rgba white 0.4)
        "Justin Mafie" (Syne 20px 700 white)
 Right: Bell icon + Search icon (40x40px each, 10px gap)
   Notification bell has 6px green dot offset top-right
 
BALANCE CARD (THE ONLY GRADIENT ON THIS SCREEN):
 Margin: 24px sides, radius 24px
 Fill: linear-gradient 135deg #14532d → #052e16
 Padding: 28px
 Label: "Salio Kuu" + 5px live pulse dot (rgba green 0.8, animates opacity)
 Amount: "284,500" — Syne 38px 800 white -2px tracking
 Currency: "Shilingi za Tanzania" — DM Sans 14px rgba white 0.5 300w
 Bottom: "+12,400 leo" left + "Imesasishwa sasa" right
 Entire card tappable → wallet detail
 
QUICK ACTIONS (4 items, equal width):
 Label: "Vitendo vya Haraka" — label/caps style
 Each: rgba white 0.04 fill, 1px rgba white 0.07 border, radius 16px
 Icon area: 36x36px, radius 10px, rgba(34,197,94,0.12) fill
 SVG icon: 18px, stroke #4ade80, 1.5px
 Label: DM Sans 11px rgba white 0.5
 Actions: Tuma | Pokea | Skani QR | Lipa Bili
 
MOBILE MONEY ROW (3 equal cards):
 Label: "Pesa za Simu"
 Each: rgba white 0.04, 1px border, radius 14px, 14px padding
 Provider name small + balance in white 500
 M-Pesa 45,200 | Airtel 12,800 | Tigo 8,400
 
RECENT TRANSACTIONS (3 items, no card wrapper):
 Header: "Miamala ya Hivi Karibuni" left + "Ona Yote" right (#4ade80)
 Each: 42x42px icon + name/date column + amount right
 Debit: rgba white 0.7. Credit: #4ade80
 Dividers: 1px rgba white 0.04 between items
 
BOTTOM NAV: 5 tabs, active = green, inactive = rgba white 0.3
 Nyumbani | Lipa | Huduma | Tuzo | Wasifu
 
REMOVE ENTIRELY:
 - ALL promotional banners and carousels
 - Membership cards from dashboard
 - Rainbow gradient action cards
 - Emojis in navigation
 - AI-labeled widgets
 - Demo mode elements
 - Any service grid exceeding 8 items
 
 

PROMPT 5 — SEND MONEY SCREEN

The payment initiation screen. Fast, minimal, no distractions.
 
Redesign Send Money screen.
 
HEADER: Back button + "Tuma Pesa" Syne 24px 700 white
 
CONTACTS ROW (horizontal scroll):
 Each: 48px circle avatar (gradient fill, initials) + name below
 Add button: 48px circle, dashed border rgba white 0.15, "+" rgba white 0.3
 
SEARCH FIELD:
 rgba white 0.05 fill, 1px rgba white 0.08 border, radius 14px
 Search SVG icon + placeholder "Tafuta jina au namba..."
 
AMOUNT DISPLAY (centered):
 Label: "Kiasi cha kutuma" — DM Sans 12px rgba white 0.3
 "TZS" (DM Sans 18px rgba white 0.4) + amount Syne 52px 800 white -3px
 
NUMPAD (3x4 grid, 12px gap):
 Each key: rgba white 0.05, radius 16px, 18px padding
 Digits: Syne 22px 400 white
 Backspace: DM Sans 18px rgba white 0.5
 Press state: rgba white 0.10, scale 0.96
 
PRIMARY BUTTON: "Endelea" — full green spec
 
 

PROMPT 6 — PAYMENT CONFIRMATION SCREEN

Trust-critical. All fees visible. Verified recipient. No ambiguity.
 
Redesign Payment Confirmation. This is a BoT compliance-critical screen.
 
HEADER: Back + "Thibitisha Malipo" Syne 24px + subtitle
 
DETAILS CARD:
 rgba white 0.04 fill, 1px rgba white 0.08 border, radius 20px, 24px padding
 5 rows: Mpokeaji | Namba ya Simu | Mtoa Huduma | Kiasi | Ada
 Label: DM Sans 13px rgba white 0.4 LEFT
 Value: DM Sans 13px white 500 RIGHT
 Row dividers: 1px rgba white 0.06
 ADA (FEE) ROW IS MANDATORY — NEVER hide fees.
 
TOTAL CARD:
 rgba(34,197,94,0.08) fill, 1px rgba(34,197,94,0.20) border, radius 16px
 "Jumla Itakayotolewa" left + "50,500" Syne 28px 800 #4ade80 right
 
BIOMETRIC ROW:
 rgba white 0.03, radius 14px, 16px padding
 Icon + "Thibitisha kwa alama ya vidole" + "au PIN yako"
 
BUTTONS: Primary "Tuma TZS 50,500" + Ghost "Rudi"
 
RULE: Every fee must be itemized and visible before the user
can confirm. This is non-negotiable for BoT compliance.
 
 

PROMPT 7 — PAYMENT SUCCESS SCREEN

Where trust is cemented. Calm, official, receipt always generated.
 
Redesign Payment Success screen.
 
BACKGROUND: gradient 160deg #052e16 → #080d08
 
SUCCESS ICON (centered):
 100x100px rounded rectangle radius 32px
 Fill gradient 135deg #15803d → #052e16
 Border: 1px rgba(34,197,94,0.30)
 Checkmark SVG: polyline 20,6 9,17 4,12 — stroke #4ade80 2px round
 Entry animation: scale 0.7→1.0 opacity 0→1, 500ms spring, 100ms delay
 
TITLE: "Imetumwa." — Syne 32px 800 white -1px tracking centered
SUBTITLE: transfer confirmation message — DM Sans 14px rgba white 0.4 centered
 
RECEIPT CARD:
 rgba white 0.04, 1px rgba white 0.08, radius 20px, 20px padding
 5 rows: Reference | Date | Amount | Fee | Status
 Status value: "Imekamilika" in #4ade80
 Row dividers: 1px rgba white 0.05
 
BUTTONS: "Rudi Nyumbani" primary + "Pakua Risiti" ghost
 
RULE: Receipt with reference number is ALWAYS generated.
User must always be able to download it. No exceptions.
 
 

PROMPT 8 — SERVICES SCREEN

Maximum 10 services visible. No experimental features. Curated, not exhaustive.
 
Redesign Services screen. Max 10 services visible. Zero experimental.
 
HEADER: "Huduma" Syne 26px 700 + search bar below
 
FEATURED CARD (only gradient allowed on this screen):
 gradient #14532d → #052e16, radius 20px, 24px padding
 Badge: "Inayopendwa" green pill (10px uppercase)
 Name: "Treni ya Mwendo Kasi SGR" Syne 20px 700 white
 Desc: DM Sans 13px rgba white 0.5 300w
 
TRAVEL SECTION (2x2 grid, label "Usafiri"):
 Ndege | Basi | SGR Treni | Hoteli
 
GOVERNMENT SECTION (2x2 grid, label "Serikali"):
 TRA Kodi | NHIF | Faini | NIDA
 
EACH SERVICE CARD:
 rgba white 0.04, 1px rgba white 0.07, radius 16px, 18px padding
 Icon area: 38x38px radius 11px rgba(34,197,94,0.10)
 SVG icon: 20px #4ade80 1.5px stroke
 Name: DM Sans 13px white 500
 Desc: DM Sans 11px rgba white 0.3
 
REMOVE: All experimental features, AI-labeled cards,
promotional banners, any service count above 10.
 
 

PROMPT 9 — BOOKINGS / TRAVEL SCREEN

Unified booking for Flights, Bus, SGR, Hotels, Parks. Official, verified feel.
 
Redesign Bookings screen — unified travel booking system.
 
HEADER: Back + "Hifadhi Safari" Syne 26px + subtitle listing service types
 
TAB PILLS (horizontal scroll):
 Active: #15803d fill, radius 20px, white 500
 Inactive: transparent, 1px rgba white 0.08 border, rgba white 0.4
 Tabs: Ndege | Basi | SGR Treni | Hoteli | Mbuga
 
SEARCH CARD:
 rgba white 0.04, 1px rgba white 0.08, radius 20px, 20px padding
 Route row: From field + swap button + To field
 Date + Passengers row below (2 equal fields)
 Swap button: 34x34px, rgba(34,197,94,0.10) fill
 Search button: "Tafuta Ndege" full width green, 14px padding
 
RESULTS LIST:
 Label: "Matokeo Yanayopatikana"
 Each card: rgba white 0.04, 1px rgba white 0.07, radius 16px, 18px padding
   Logo: 44x44px radius 12px, 2-letter abbreviation
   Name: DM Sans 14px white 500
   Route/time: DM Sans 12px rgba white 0.35
   Verified badge: "✓ Imethibitishwa" #4ade80 DM Sans 10px
   Price right: Syne 16px 700 white + "TZS" below
 Show 3 results + "Ona Zaidi" link in #4ade80
 
 

PROMPT 10 — GOREWARDS SCREEN

Motivation without noise. Calm progress. No gamification overload.
 
Redesign GORewards screen. Calm progress feel only.
 
HEADER: "GORewards" Syne 26px 700
 
POINTS BALANCE CARD (gradient allowed):
 gradient #14532d → #052e16, radius 22px, 24px padding
 1px rgba(34,197,94,0.20) border
 Points: "12,450" Syne 44px 800 white -2px
 Label: DM Sans 13px rgba white 0.4 300w
 Tier row: Gold badge (#fbbf24 on amber tint) + progress bar 68% + "2,550 hadi Platinum"
 
HOW TO EARN (3 list items):
 Label: "Jinsi ya Kupata Pointi"
 Each: rgba white 0.04, 1px rgba white 0.07, radius 14px, 14px padding
 Icon + name/rate column + points badge right in #4ade80
 Items: Wallet payments +10pts | Travel booking +50pts | Gov services +25pts
 
REDEEM SECTION (2x2 grid):
 Label: "Tumia Pointi"
 Each card: rgba white 0.04, 1px rgba white 0.07, radius 16px, 16px padding
 Value bold + name small + cost in #4ade80 below
 
 

PROMPT 11 — PROFILE SCREEN

Safe, boring, institutional. Identity + security + settings. No upsell.
 
Redesign Profile screen. Institutional, safe, no promotional content.
 
HEADER: "Wasifu" Syne 26px 700
 
IDENTITY CARD:
 rgba white 0.04, 1px rgba white 0.08, radius 20px, 20px padding
 Avatar: 60x60px radius 20px, green gradient fill, initials "JM" Syne 22px 700
 Name: Syne 18px 700 white
 Phone: DM Sans 13px rgba white 0.4
 KYC badge: "✓ Imethibitishwa" green pill
 
SETTINGS GROUPS (4 groups):
 Each group: small caps label + card (rgba white 0.03, 1px border, radius 16px)
 Each row: 34x34 icon + name DM Sans 14px white + optional subtitle + "›" arrow
 Dividers between rows only
 
 Group 1 "Akaunti": Maelezo Yangu | Akaunti Zilizounganishwa | Benki
 Group 2 "Usalama": PIN na Biometriki | Udhibiti wa Vifaa | Kikomo cha Malipo
 Group 3 "Mapendeleo": Lugha | Arifa
 Group 4 "Msaada": Wasiliana Nasi | Masharti ya Huduma
 
LOGOUT BUTTON:
 rgba(220,38,38,0.08) fill, 1px rgba(220,38,38,0.20) border, radius 16px
 "Toka" DM Sans 15px 500 #f87171
 Clearly separated, not alarming
 
REMOVE: Membership upsell, promotional offers, emojis in settings.
 
 

PROMPT 12 — ERROR & OFFLINE STATES

Every screen needs 4 states: Default, Loading, Empty, Error. No screen exists only in happy-path.
 
Add error and offline states to EVERY screen in this file.
 
OFFLINE BANNER (below status bar, all screens):
 rgba(220,38,38,0.10) fill, 1px rgba(220,38,38,0.20) border-bottom
 "Hakuna Mtandao — Inaendelea Kujaribu..." DM Sans 12px rgba white 0.6
 Small pulsing dot indicator
 
EMPTY STATE:
 Centered in content area
 40x40px SVG icon rgba white 0.15
 Title DM Sans 15px white 500 + subtitle 13px rgba white 0.4
 
PAYMENT ERROR CARD:
 rgba(220,38,38,0.08) fill, 1px rgba(220,38,38,0.20) border, radius 16px
 "Malipo Hayajakamilika" DM Sans 15px #f87171 500
 Human language explanation below in rgba white 0.5
 "Jaribu Tena" green + "Wasiliana Msaada" ghost
 NEVER show error codes. ALWAYS preserve form state.
 
LOADING STATE:
 Skeleton screens with shimmer animation rgba white 0.05→0.08
 Match exact layout of loaded state
 No spinners — skeleton only
 
 

PROMPT 13 — LANGUAGE SWITCH (SWAHILI / ENGLISH)

Full i18n. Language switch updates 100% of UI. Zero mixed language on any screen.
 
Implement complete language switching system.
 
TOGGLE COMPONENT:
 Pill: rgba(34,197,94,0.15) fill, 1px rgba(34,197,94,0.30) border, radius 20px
 "SW | EN" DM Sans 12px #4ade80 500, padding 6px 14px
 Active language visually emphasized
 
CREATE TWO VARIANTS per component:
 /sw variant with Swahili text
 /en variant with English text
 
KEY TRANSLATION PAIRS:
 Karibu GoPay / Welcome to GoPay
 Salio Kuu / Main Balance
 Vitendo vya Haraka / Quick Actions
 Tuma Pesa / Send Money
 Lipa Bili / Pay Bills
 Skani QR / Scan QR
 Imesasishwa Sasa / Updated Now
 Thibitisha Malipo / Confirm Payment
 Jumla Itakayotolewa / Total Deducted
 Imetumwa / Sent
 Hifadhi Safari / Book Travel
 Wasifu / Profile
 Usalama / Security
 Toka / Log Out
 Endelea / Continue
 Rudi / Cancel
 Ona Yote / See All
 Imethibitishwa / Verified
 
RULE: Language switch must update 100% of UI.
Buttons must not truncate longer Swahili strings.
No hardcoded text strings anywhere.
 
 

PROMPT 14 — FINAL QUALITY AUDIT

Run this last. Check every screen before investor demo and BoT submission.
 
Final quality audit — check every screen for these issues:
 
CRITICAL (showstoppers):
 [] Demo Mode button visible → REMOVE
 [] Promotional carousel on dashboard → REMOVE
 [] Emoji in navigation or financial UI → REMOVE
 [] Gradient on non-hero elements → FLATTEN to solid
 [] Rainbow color usage → NORMALIZE to green + neutrals
 [] "AI" labeled widget visible to users → RENAME or REMOVE
 [] Fees hidden before payment confirm → EXPOSE all fees
 [] Mixed language on same screen → ENFORCE one language
 
FRICTION:
 [] Screen without loading state → ADD skeleton
 [] Screen without error state → ADD error card
 [] Tap target under 44px → ENLARGE
 [] Text below 12px → INCREASE
 [] Contrast below 4.5:1 → FIX color
 
TRUST (BoT submission requirements):
 [] Full fee breakdown before every payment confirm
 [] Receipt with reference number after every payment
 [] Transaction history accessible from home or nav
 [] Support contact on every error screen
 [] KYC status visible in profile
 
BRAND:
 [] Only Syne and DM Sans fonts used
 [] Green + neutral palette only
 [] One gradient max per screen
 [] All borders rgba(255,255,255,0.08)
 [] All cards rgba(255,255,255,0.04)
 
FINAL TEST: Would a conservative Tanzanian bank regulator
trust this app with their salary? If no → fix more.
 
 

 
GoPay Tanzania — World-Class Fintech Super App
Design System v1.0 — Bank of Tanzania Compliant