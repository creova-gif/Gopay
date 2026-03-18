Path 1 — Figma AI Prompts (Since you're already using Figma AI)
This is your fastest route. You use the HTML file as your design specification, then paste screen-by-screen prompts into Figma AI to rebuild each screen matching what's been built.
How it works:
Open your Figma file → select the screen you want to update → open Figma AI → paste the prompt for that screen. Figma AI will redesign it to match.
Here are the prompts, one per screen:

SPLASH SCREEN
Redesign the splash/welcome screen using these exact specs:
- Background: dark gradient #052e16 → #0a1a0a → #080d08 (160deg)
- Centered logo mark: 80×80px rounded square (26px radius), dark green border, 4-square grid icon in green
- App name: "GoPay" — Syne font, 42px, 800 weight, white, -2px letter spacing
- Tagline below: 14px, rgba(255,255,255,0.4), weight 300
- Trust row: 3 items with small green dots — "Salama", "BoT Compliant", "Imesimbwa"
- Primary button: full width, 18px padding, 18px radius, #16a34a green, white text "Anza"
- Ghost button: same size, transparent with white 10% border, "Ingia Akaunti"
- Bottom compliance text: 11px, rgba(255,255,255,0.2), centered
- Zero emojis. Zero gradients except the background. One ambient green glow radial behind logo.

HOME DASHBOARD
Redesign the home dashboard screen:
- Background: #080d08
- Header: greeting text "Habari za asubuhi" (13px, 0.4 opacity) above name "Justin Mafie" (Syne 20px 700)
- Right: notification bell icon + search icon, both in 40×40px rounded squares
- Balance card: 24px margin sides, 24px border radius, gradient #14532d → #052e16
  - Label "Salio Kuu" with 5px green live pulse dot
  - Amount: Syne 38px 800 white -2px tracking
  - Currency line: 14px 0.5 opacity
  - Bottom row: "+12,400 leo" left, "Imesasishwa sasa" right
- Quick actions row: 4 equal cards — Send, Receive, Scan QR, Pay Bills
  Each card: rgba(255,255,255,0.04) bg, 1px rgba white border, green icon in rounded square, 11px label
- Mobile money row: 3 equal cards — M-Pesa, Airtel Money, Tigo Pesa with TZS balances
- Recent transactions: icon + name + date + amount (credit = green, debit = 0.7 white)
- Bottom nav: 5 tabs — Nyumbani, Lipa, Huduma, Tuzo, Wasifu
- Active tab: green icon + green label. Inactive: 0.3 opacity white
- NO gradients on action cards. ONE gradient only on balance card.
- NO emojis in navigation. Use line icons only.

SEND MONEY
Redesign the Send Money screen:
- Dark #080d08 background
- Header with back arrow button (40×40px, subtle border) + "Tuma Pesa" title (Syne 24px)
- Horizontal scrolling contacts row: circular avatars with initials, name below
- Search field: rgba white 5% bg, 1px border, search icon + placeholder
- Amount display centered: "Kiasi cha kutuma" label, "TZS" currency + large amount in Syne 52px 800 white
- Numpad: 3×4 grid, each key 22px Syne, rgba white 5% bg, 16px radius
- Active state: scale 0.96 on tap
- Full-width green "Endelea" button below numpad
- Zero emojis. Clean, minimal, fast.

PAYMENT CONFIRM
Redesign payment confirmation screen:
- Header: back button + "Thibitisha Malipo" (Syne 24px) + subtitle "Hakikisha maelezo yako" (14px 0.4 opacity)
- Details card: rgba white 4% bg, 1px border, 20px radius, 24px padding
  - Rows: Mpokeaji / Namba / Mtoa Huduma / Kiasi / Ada
  - Each row: label 13px 0.4 opacity LEFT, value 13px white 500 RIGHT
  - Dividers: 1px rgba white 6%
- Total card: rgba green 8% bg, green 20% border, 16px radius
  - "Jumla Itakayotolewa" left + "50,500" right in Syne 28px green
- Biometric row: icon in green rounded square + "Thibitisha kwa alama ya vidole" text
- Two buttons: primary green "Tuma TZS 50,500" + ghost "Rudi"
- NO color other than green on confirm button. Calm, institutional feel.

SUCCESS SCREEN
Redesign payment success screen:
- Background: gradient #052e16 → #080d08
- Center-aligned vertically
- Success icon: 100×100px, 32px radius, green gradient box with checkmark SVG (green stroke)
- "Imetumwa." headline: Syne 32px 800 white -1px tracking
- Subtitle: 14px 0.4 opacity centered, 2 lines max
- Receipt card: white 4% bg, 1px border, 20px radius
  - 5 rows: Reference, Date, Amount, Fee, Status
  - Status value: green text "Imekamilika"
- Two buttons: primary "Rudi Nyumbani" + ghost "Pakua Risiti"
- Animation: icon scales from 0.7 → 1.0 on load (300ms spring)

SERVICES
Redesign the Services screen:
- Header: "Huduma" title (Syne 26px) + search bar below
- Featured card: #14532d → #052e16 gradient, 20px radius, 24px padding
  - Small "Inayopendwa" badge (green pill, 10px uppercase)
  - "Treni ya Mwendo Kasi SGR" title (Syne 20px 700)
  - Description line below (13px 0.5 opacity)
- Two service grids below with section labels:
  - "Usafiri" section: Ndege, Basi, SGR Treni, Hoteli (2×2 grid)
  - "Serikali" section: TRA, NHIF, Faini, NIDA (2×2 grid)
- Each service card: white 4% bg, 1px border, 16px radius, 18px padding
  - Green icon in 38×38 rounded square
  - Service name 13px 500 white
  - Description 11px 0.3 opacity
- Bottom nav same as home
- NO more than 10 services visible. No experimental features.

BOOKINGS
Redesign the Bookings/Travel screen:
- Header: back button + "Hifadhi Safari" (Syne 26px) + subtitle
- Horizontal tab pills: Ndege, Basi, SGR Treni, Hoteli, Mbuga
  Active: #15803d bg, white text. Inactive: transparent, 0.4 opacity
- Search card: white 4% bg, 20px radius, 20px padding
  - From/To fields side by side with swap button between (green 10% bg circle)
  - Date + Passengers fields below
  - Green search button full width
- Results list: cards with logo placeholder + name + time + verified badge + price
  - "✓ Imethibitishwa" in green below route
  - Price right-aligned: Syne 16px 700
- Clean, official, airline-app feel. No emojis.

GOREWARDS
Redesign the GORewards screen:
- Header: "GORewards" title (Syne)
- Points balance card: #14532d → #052e16 gradient, 22px radius
  - "12,450" in Syne 44px 800 white
  - "GoPoints zinazoweza kutumiwa" subtitle
  - Tier row: gold badge pill + progress bar (68% green fill) + "2,550 hadi Platinum"
- Earn section: 3 list items with icon + name + earn rate + points badge
  Each: white 4% bg, 1px border, 14px radius
- Redeem grid: 2×2 grid of cards
  Each: white 4% bg, 1px border, 16px radius
  Value bold, name small, cost in green below
- Bottom nav same as home
- No gamification overload. Calm progress feel.

PROFILE
Redesign the Profile screen:
- Header: "Wasifu" (Syne 26px)
- Identity card: white 4% bg, 1px border, 20px radius
  - Avatar: 60×60px rounded square, green gradient, initials "JM"
  - Name: Syne 18px 700
  - Phone: 13px 0.4 opacity
  - KYC badge: "✓ Imethibitishwa" small green pill
- Four settings groups: Akaunti, Usalama, Mapendeleo, Msaada
  Each group: label in small caps 0.25 opacity + list card (white 3% bg, 1px border, 16px radius)
  Each row: icon in 34×34 square + name + optional subtitle + "›" arrow
  Dividers between rows only (not cards)
- Logout button: full width, red tint bg, red border, red text "Toka"
  Clearly separated at bottom, not alarming
- Bottom nav same as home

Path 2 — Use Locofy or Anima to Convert HTML → Figma
You can import the HTML file directly into a design:

Go to locofy.ai or animaapp.com
Upload the HTML file
It converts it into Figma-ready components automatically
Import those components into your existing Figma file
Map them to your existing pages

This gives you editable Figma layers that match the HTML pixel-for-pixel.

Path 3 — Manual Token Import (Fastest for Design System)
If you just want to match the design system without rebuilding screens:
In Figma, go to Local Styles and create these exactly:
Colors:

green/900 → #052e16
green/800 → #14532d
green/700 → #15803d
green/600 → #16a34a
green/400 → #4ade80
neutral/900 → #0a0a0a
neutral/800 → #171717
surface/card → rgba(255,255,255,0.04)
surface/border → rgba(255,255,255,0.08)

Text Styles:

display/hero → Syne, 42px, 800, -2px
heading/xl → Syne, 32px, 700, -1px
heading/l → Syne, 26px, 700, -0.5px
heading/m → Syne, 20px, 700
body/default → DM Sans, 15px, 400
body/small → DM Sans, 13px, 400
label/caps → DM Sans, 11px, 500, 0.8px spacing, uppercase

Then apply these tokens to your existing components and every screen will immediately align.