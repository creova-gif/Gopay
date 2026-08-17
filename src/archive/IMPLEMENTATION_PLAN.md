# goPay Implementation Plan
## 3-Phase Production Roadmap (MVP → Scale)

---

## 🎯 Overview

**Goal**: Launch a production-ready eWallet in Tanzania (goPay) with Touch 'n Go feature parity  
**Timeline**: 12 months to Phase 2 completion (full merchant ecosystem)  
**Team Size**: 15-20 engineers (see breakdown below)  
**Budget**: See cost estimates per phase

---

## 📋 Pre-Development Checklist

### **1. Legal & Compliance (Start immediately, 3-6 months)**
- [ ] Apply for e-money issuer license (Bank of Tanzania)
- [ ] Register business with BRELA (Business Registrations and Licensing Agency)
- [ ] Obtain TCRA approval for data processing
- [ ] Draft Terms of Service, Privacy Policy (GDPR-compliant)
- [ ] AML/KYC compliance framework
- [ ] Insurance coverage for e-money float

### **2. Partner Integrations (Kickoff in Month 1)**
- [ ] Sign agreements with mobile money operators:
  - [ ] Vodacom (M-Pesa) — largest market share
  - [ ] Tigo (Tigo Pesa)
  - [ ] Airtel (Airtel Money)
  - [ ] Halotel (Halo Pesa)
- [ ] Bank partnerships (for DuitNow-style instant transfers):
  - [ ] CRDB Bank
  - [ ] NMB Bank
  - [ ] KCB Tanzania
- [ ] Government API access:
  - [ ] NIDA (National ID verification) — **critical for KYC**
  - [ ] TANESCO (electricity payments)
  - [ ] DAWASCO (water bills)
  - [ ] TRA (tax payments)
  - [ ] NHIF (health insurance)
- [ ] Card processors:
  - [ ] Visa/Mastercard acquiring license
  - [ ] Payment gateway (Flutterwave, Paystack, or Selcom)

### **3. Infrastructure Setup (Month 1-2)**
- [ ] Choose cloud provider (AWS East Africa / GCP / Alibaba Cloud)
- [ ] Set up Kubernetes cluster (EKS recommended)
- [ ] Provision databases (PostgreSQL RDS Multi-AZ)
- [ ] Set up Redis cluster
- [ ] Configure VPN & private subnets
- [ ] Implement HashiCorp Vault for secrets
- [ ] Set up monitoring (Prometheus + Grafana)
- [ ] Configure logging (ELK or CloudWatch)
- [ ] Establish CI/CD pipeline (GitHub Actions)

---

## 🚀 PHASE 1: MVP Launch (Months 1-4)

**Goal**: Core wallet functionality with mobile money integration  
**Target**: 10,000 early adopters (beta testers)  
**KPIs**: 5,000 MAU, 50% retention, 2+ transactions/user/week

### **Month 1: Foundation**

#### **Backend Team (5 engineers)**
- [ ] Design database schema (wallet ledger, users, transactions)
- [ ] Implement Auth Service:
  - [ ] Phone number registration (OTP via Africa's Talking)
  - [ ] JWT token generation
  - [ ] Session management (Redis)
  - [ ] PIN creation & bcrypt hashing
- [ ] Build User Service:
  - [ ] Profile management API
  - [ ] NIDA verification stub (mock for testing)
  - [ ] Device binding (device_id tracking)
- [ ] Set up API Gateway (Kong):
  - [ ] Rate limiting (100 req/min per user)
  - [ ] JWT validation middleware
  - [ ] Request logging

#### **Mobile Team (3 engineers)**
- [ ] Project setup:
  - [ ] Android (Kotlin + Jetpack Compose)
  - [ ] iOS (Swift + SwiftUI)
- [ ] Implement screens:
  - [ ] Splash screen
  - [ ] Onboarding flow
  - [ ] Phone verification (OTP)
  - [ ] PIN setup
  - [ ] Dashboard (basic UI)

#### **DevOps (1 engineer)**
- [ ] Kubernetes cluster provisioning
- [ ] PostgreSQL + Redis deployment
- [ ] SSL certificates (Let's Encrypt)
- [ ] Monitoring dashboards

---

### **Month 2: Wallet Core**

#### **Backend**
- [ ] Wallet Service (Go):
  - [ ] Create wallet on signup
  - [ ] Get balance endpoint (with Redis cache)
  - [ ] Transaction history API (paginated)
  - [ ] Double-entry ledger implementation
- [ ] Payment Service (Go):
  - [ ] P2P transfer API:
    - [ ] Debit sender, credit receiver (atomic transaction)
    - [ ] Idempotency key validation
    - [ ] Balance checks
  - [ ] Generate transaction receipts
- [ ] Implement Kafka:
  - [ ] Topic: `wallet.transactions`
  - [ ] Producer: Wallet Service
  - [ ] Consumer: Notification Service (send push)

#### **Mobile**
- [ ] Wallet screen:
  - [ ] Display balance
  - [ ] Transaction history (pull-to-refresh)
  - [ ] Add money button (UI only)
- [ ] P2P transfer flow:
  - [ ] Enter phone number
  - [ ] Enter amount
  - [ ] PIN confirmation
  - [ ] Success/failure feedback
- [ ] Push notification setup (Firebase FCM)

#### **Testing**
- [ ] Unit tests (80% coverage target)
- [ ] Integration tests (API endpoints)
- [ ] Load testing (JMeter: 100 concurrent users)

---

### **Month 3: Mobile Money Integration**

#### **Backend**
- [ ] Integrations Service:
  - [ ] M-Pesa API integration:
    - [ ] STK Push (initiate payment)
    - [ ] Webhook handler (payment confirmation)
    - [ ] Signature verification
  - [ ] Tigo Pesa integration (similar flow)
  - [ ] Error handling & retry logic (exponential backoff)
- [ ] Add Money flow:
  - [ ] Create pending transaction
  - [ ] Call mobile money API
  - [ ] Update ledger on webhook callback
  - [ ] Send push notification
- [ ] Reconciliation service (daily cron):
  - [ ] Compare goPay ledger vs M-Pesa statements
  - [ ] Flag mismatches for manual review

#### **Mobile**
- [ ] Add Money screen:
  - [ ] Select provider (M-Pesa, Tigo Pesa)
  - [ ] Enter amount
  - [ ] Initiate USSD prompt
  - [ ] Poll for completion (or use push)
- [ ] Transaction details screen:
  - [ ] Receipt with QR code
  - [ ] Share via WhatsApp/SMS

#### **QA**
- [ ] End-to-end testing (Appium/Detox)
- [ ] Security audit (OWASP Top 10)
- [ ] Penetration testing (external vendor)

---

### **Month 4: Beta Launch + Bills**

#### **Backend**
- [ ] Bills Service:
  - [ ] TANESCO integration (electricity):
    - [ ] Fetch bill by meter number
    - [ ] Pay bill API
    - [ ] Confirmation webhook
  - [ ] DAWASCO integration (water)
  - [ ] Mobile airtime (Vodacom, Airtel, Tigo APIs)
- [ ] NIDA verification (production):
  - [ ] Call NIDA API with ID number
  - [ ] Store verification status
  - [ ] Update KYC tier
- [ ] Admin dashboard (React):
  - [ ] User management
  - [ ] Transaction monitoring
  - [ ] Flag suspicious activity

#### **Mobile**
- [ ] Bills screen:
  - [ ] Select utility (TANESCO, DAWASCO, Airtime)
  - [ ] Enter account/meter number
  - [ ] Fetch bill amount
  - [ ] Pay with PIN
- [ ] Profile screen:
  - [ ] NIDA verification flow
  - [ ] KYC tier indicator
  - [ ] Linked mobile money accounts

#### **Launch Prep**
- [ ] Private beta with 100 employees/friends
- [ ] Fix critical bugs (P0/P1)
- [ ] Prepare app store listings:
  - [ ] Screenshots, descriptions
  - [ ] Privacy policy URL
  - [ ] Submit for review (iOS takes 2-3 days)
- [ ] Marketing materials:
  - [ ] Landing page
  - [ ] Social media (Instagram, Twitter)
  - [ ] Influencer partnerships

---

## 🏪 PHASE 2: Merchant Ecosystem (Months 5-8)

**Goal**: Enable QR payments at merchants, onboard 500+ stores  
**Target**: 100,000 users, 10,000 transactions/day  
**KPIs**: $500K monthly GMV, 100+ active merchants

### **Month 5: QR Payments**

#### **Backend**
- [ ] QR Service:
  - [ ] Generate merchant QR codes:
    - [ ] Static QR (merchant_id only)
    - [ ] Dynamic QR (merchant_id + amount + order_id)
  - [ ] Parse scanned QR
  - [ ] Validate merchant status (active/suspended)
- [ ] Enhanced Payment Service:
  - [ ] Merchant payment flow (debit user, credit merchant)
  - [ ] Settlement logic (daily batch transfers to bank)
  - [ ] Transaction fees (2% merchant fee)

#### **Mobile**
- [ ] QR scanner (camera permission):
  - [ ] Scan merchant QR
  - [ ] Display merchant name + amount
  - [ ] PIN confirmation
  - [ ] Show receipt with merchant logo
- [ ] Merchant QR display (for receiving):
  - [ ] Generate personal QR for P2P receives
  - [ ] Share QR image

#### **Merchant Portal (React)**
- [ ] Onboarding:
  - [ ] Business registration (BRELA)
  - [ ] Bank account details
  - [ ] Upload documents (license, ID)
- [ ] Dashboard:
  - [ ] Today's sales
  - [ ] Transaction list
  - [ ] Download QR code (print for cashier)
  - [ ] Settlement history

---

### **Month 6: Merchant Features**

#### **Backend**
- [ ] Merchant Service:
  - [ ] Merchant profile API
  - [ ] Transaction history for merchant
  - [ ] Refund API (with admin approval)
  - [ ] Dispute management
- [ ] Settlement Service:
  - [ ] Daily bank transfer (ACH/RTGS)
  - [ ] Settlement report generation
  - [ ] Email notifications
- [ ] Fraud detection (basic rules):
  - [ ] Block payments >500K TZS without 2FA
  - [ ] Flag >5 transactions in 5 minutes
  - [ ] Geo-fencing (location vs merchant location)

#### **Mobile**
- [ ] Merchant categories:
  - [ ] Browse nearby merchants (map view)
  - [ ] Search by name
  - [ ] Favorites
- [ ] Offers/coupons:
  - [ ] Merchant promotions (10% off)
  - [ ] Apply discount at checkout

#### **Merchant Portal**
- [ ] Analytics:
  - [ ] Peak hours chart
  - [ ] Top products sold
  - [ ] Customer retention metrics
- [ ] Promotions:
  - [ ] Create coupon codes
  - [ ] Set discount %
  - [ ] View redemption count

---

### **Month 7: Rewards & Engagement**

#### **Backend**
- [ ] Rewards Service:
  - [ ] Points calculation (1 point per 1000 TZS)
  - [ ] Cashback engine (1% on utilities)
  - [ ] Tier system (Bronze/Silver/Gold)
  - [ ] Redemption API (points → cashback)
- [ ] Gamification:
  - [ ] Daily tasks (pay 3 bills → 50 points)
  - [ ] Referral program (invite friend → 100 points)
  - [ ] Leaderboard (top spenders)

#### **Mobile**
- [ ] GOrewards screen:
  - [ ] Points balance
  - [ ] Tier progress bar
  - [ ] Redeem catalog (vouchers, cashback)
  - [ ] Daily tasks checklist
- [ ] Referral flow:
  - [ ] Share referral code
  - [ ] Track referrals
  - [ ] Claim bonus

#### **Marketing**
- [ ] Launch "Refer & Earn" campaign
- [ ] Partner with 10 popular merchants (exclusive offers)
- [ ] Run Facebook/Instagram ads (targeting Dar es Salaam)

---

### **Month 8: Scale & Optimize**

#### **Backend**
- [ ] Performance optimization:
  - [ ] Add database read replicas
  - [ ] Implement query caching
  - [ ] Optimize N+1 queries
  - [ ] Add CDN for static assets
- [ ] Enhanced monitoring:
  - [ ] SLO tracking (99.9% uptime)
  - [ ] Alerting rules (payment failures >1%)
  - [ ] Cost monitoring (AWS Cost Explorer)
- [ ] Fraud ML model (Phase 1):
  - [ ] Collect training data (6 months of txns)
  - [ ] Train XGBoost classifier
  - [ ] Deploy as microservice (Python/FastAPI)

#### **Mobile**
- [ ] Offline mode:
  - [ ] Queue transactions locally
  - [ ] Sync when online
- [ ] Biometric auth (fingerprint/FaceID):
  - [ ] Replace PIN for quick payments
- [ ] Dark mode

#### **Operations**
- [ ] Customer support system:
  - [ ] Zendesk / Intercom integration
  - [ ] In-app chat
  - [ ] FAQ section
- [ ] Hire 5 support agents (24/7 coverage)

---

## 🌍 PHASE 3: Financial Ecosystem (Months 9-12)

**Goal**: Full super-app with travel, shop, investments  
**Target**: 500K users, $5M monthly GMV  
**KPIs**: 3+ features used per user, 20% using travel/shop

### **Month 9: Travel Booking**

#### **Backend**
- [ ] Travel Service:
  - [ ] Bus API integration (Tahmeed, Kilimanjaro Express):
    - [ ] Search routes
    - [ ] Book seats
    - [ ] Generate ticket
  - [ ] Ferry integration (Azam Marine, Zanzibar ferries)
  - [ ] Flight search (Skyscanner API or Amadeus)
  - [ ] Hotel search (Booking.com affiliate API)

#### **Mobile**
- [ ] Travel tab:
  - [ ] Bus booking flow (origin, destination, date, seat selection)
  - [ ] Ticket history (QR code for boarding)
  - [ ] Hotel search & booking
  - [ ] Flight price comparison

---

### **Month 10: eShop & Marketplace**

#### **Backend**
- [ ] Shop Service:
  - [ ] Product catalog (PostgreSQL)
  - [ ] Shopping cart
  - [ ] Order management (pending, shipped, delivered)
  - [ ] Vendor management (multi-vendor marketplace)
  - [ ] Inventory tracking
  - [ ] Shipping integration (DHL, Posta)

#### **Mobile**
- [ ] eShop tab:
  - [ ] Product categories
  - [ ] Search & filters
  - [ ] Product details (images, reviews)
  - [ ] Add to cart
  - [ ] Checkout with goPay balance
  - [ ] Order tracking

#### **Vendor Portal**
- [ ] Seller onboarding
- [ ] Product listing
- [ ] Order fulfillment
- [ ] Payout management

---

### **Month 11: International Transfers**

#### **Backend**
- [ ] International Service:
  - [ ] Wise API integration (send to 80+ countries)
  - [ ] Western Union partnership
  - [ ] Panda Remit (China → Tanzania corridor)
  - [ ] WorldRemit integration
  - [ ] FX rate fetching (daily updates)
  - [ ] AML compliance checks (>$1000 USD)

#### **Mobile**
- [ ] International tab:
  - [ ] Receive money (account number, instructions)
  - [ ] Send money (country, amount, recipient bank)
  - [ ] FX calculator
  - [ ] Track transfer status

#### **Compliance**
- [ ] Register as money remitter
- [ ] FATF compliance documentation
- [ ] Transaction limits ($10K USD/month per user)

---

### **Month 12: Advanced Features**

#### **Backend**
- [ ] Savings/Investment:
  - [ ] GoSave (automated savings)
  - [ ] Fixed deposits (partner with bank)
  - [ ] Money market fund integration
- [ ] Loan/Credit:
  - [ ] Credit scoring model (transaction history)
  - [ ] Short-term loans (up to 100K TZS)
  - [ ] Repayment via auto-debit
- [ ] Insurance:
  - [ ] Partner with insurance providers
  - [ ] Micro-insurance (accident, health)

#### **Mobile**
- [ ] Financial products tab:
  - [ ] Savings goals (vacation, emergency fund)
  - [ ] Investment portfolio
  - [ ] Loan application
  - [ ] Insurance purchase

#### **Scale Prep**
- [ ] Multi-region deployment (Kenya, Uganda expansion)
- [ ] White-label solution for corporates
- [ ] Open API for third-party integrations

---

## 👥 Team Structure

### **Core Team (Month 1-4)**
| Role | Count | Responsibilities |
|------|-------|------------------|
| Backend Engineers (Go/Node.js) | 5 | Microservices, APIs, integrations |
| Mobile Engineers (Android/iOS) | 3 | Native apps, UI/UX |
| DevOps Engineer | 1 | Infrastructure, CI/CD, monitoring |
| QA Engineer | 1 | Testing, automation |
| Product Manager | 1 | Roadmap, requirements |
| Designer (UI/UX) | 1 | Mobile designs, branding |
| **Total** | **12** | |

### **Expanded Team (Month 5-12)**
| Role | Count | Additional |
|------|-------|------------|
| Backend Engineers | 8 | +3 (fraud, analytics, travel) |
| Mobile Engineers | 5 | +2 (features, performance) |
| DevOps/SRE | 2 | +1 (scaling, security) |
| QA Engineers | 2 | +1 (regression, automation) |
| Data Engineer | 1 | Analytics pipeline |
| ML Engineer | 1 | Fraud detection |
| Customer Support | 5 | 24/7 coverage |
| Marketing | 2 | Growth, partnerships |
| Compliance Officer | 1 | Licensing, AML |
| **Total** | **27** | |

---

## 💰 Budget Estimates (12 months)

### **Phase 1 (Months 1-4): $150K - $200K**
- Salaries: $100K (12 engineers × $8K/month ÷ 12 months × 4)
- AWS infrastructure: $10K ($2.5K/month)
- Third-party services (Africa's Talking, Firebase): $5K
- Legal/licensing: $20K
- Office/equipment: $10K
- Contingency: $15K

### **Phase 2 (Months 5-8): $250K - $300K**
- Salaries: $180K (expanded team)
- AWS: $20K (increased traffic)
- Partner fees (M-Pesa, banks): $15K
- Marketing: $30K
- Security audits: $10K

### **Phase 3 (Months 9-12): $400K - $500K**
- Salaries: $240K (full team)
- AWS: $40K (multi-region)
- API integrations (Wise, flights, hotels): $50K
- Marketing: $60K (regional expansion)
- Insurance/float capital: $100K

### **Total Year 1: $800K - $1M USD**

---

## 🚧 Critical Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| License approval delays | High | Start application early, hire local consultant |
| M-Pesa API downtime | High | Implement retry logic, support multiple providers |
| Fraud/chargebacks | Medium | ML fraud detection, KYC enforcement |
| User trust (new platform) | High | Partner with known brand (telecom), insurance coverage |
| Competition (existing wallets) | Medium | Focus on UX, rewards, merchant network |
| Regulatory changes | Medium | Compliance officer, legal retainer |

---

## 📊 Success Metrics (End of Year 1)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Registered users | 500K | User table count |
| MAU (Monthly Active Users) | 150K (30% of registered) | Login events |
| Transactions/month | 500K | Ledger entries |
| GMV (Gross Merchandise Value) | $5M USD | Sum of all transactions |
| Merchant count | 1,000 | Active merchants |
| Transaction success rate | >98% | (successful / total attempts) |
| App rating | 4.5+ | App Store/Play Store |
| Customer support response | <5 min | Avg first response time |

---

## 🔧 API Implementation Checklist

### **Must-Build APIs (Priority Order)**

#### **Phase 1 (MVP)**
1. `POST /auth/signup` — Register user
2. `POST /auth/login` — Login with phone + password
3. `POST /auth/verify-otp` — Verify OTP code
4. `POST /auth/refresh` — Refresh JWT token
5. `GET /wallet/balance` — Get wallet balance
6. `GET /wallet/transactions` — Transaction history (paginated)
7. `POST /payment/p2p` — P2P transfer
8. `POST /payment/add-money` — Initiate M-Pesa deposit
9. `POST /webhook/mpesa` — M-Pesa payment callback
10. `POST /bills/electricity/pay` — Pay TANESCO bill
11. `POST /bills/water/pay` — Pay DAWASCO bill
12. `POST /kyc/nida-verify` — Verify NIDA number

#### **Phase 2 (Merchants)**
13. `POST /qr/generate` — Generate merchant QR
14. `POST /qr/scan` — Parse scanned QR
15. `POST /payment/merchant` — Pay merchant via QR
16. `GET /merchant/dashboard` — Merchant sales stats
17. `POST /merchant/settlement` — Initiate bank payout
18. `GET /rewards/balance` — Get points balance
19. `POST /rewards/redeem` — Redeem points

#### **Phase 3 (Super-App)**
20. `GET /travel/bus/search` — Search bus routes
21. `POST /travel/bus/book` — Book bus ticket
22. `GET /shop/products` — Product catalog
23. `POST /shop/checkout` — Place order
24. `POST /international/send` — Send money overseas
25. `GET /international/rate` — Get FX rate

---

## 🔄 Daily Standup Template (for PM)

**What we shipped yesterday:**
- Backend: [API/service completed]
- Mobile: [Screen/feature completed]
- Blockers resolved: [List]

**Today's goals:**
- Backend: [Focus area]
- Mobile: [Focus area]
- Meetings: [Partner calls, demos]

**Blockers:**
- [API access pending, design needs review, etc.]

**This week's milestone:**
- [e.g., "Complete M-Pesa integration end-to-end"]

---

## 🎓 Recommended Learning Resources

### **For Backend Engineers**
- [Designing Data-Intensive Applications](https://dataintensive.net/) — Martin Kleppmann (database patterns)
- [Building Microservices](https://www.oreilly.com/library/view/building-microservices-2nd/9781492034018/) — Sam Newman
- [Kafka: The Definitive Guide](https://www.confluent.io/resources/kafka-the-definitive-guide/)

### **For Mobile Engineers**
- [Android Developer Guides](https://developer.android.com/guide)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Flutter Performance Best Practices](https://flutter.dev/docs/perf/best-practices)

### **For DevOps**
- [Kubernetes in Action](https://www.manning.com/books/kubernetes-in-action-second-edition) — Marko Lukša
- [Site Reliability Engineering](https://sre.google/books/) — Google

### **For Fintech Compliance**
- [Bank of Tanzania Regulations](https://www.bot.go.tz/Publications/Regular/Regulations) (Payment systems)
- [FATF Recommendations](https://www.fatf-gafi.org/) (AML/CFT)

---

## 🚀 Next Steps (Right Now)

1. **Legal**: Engage a Tanzanian law firm specializing in fintech (budget: $10-15K)
2. **Infrastructure**: Create AWS account, provision dev environment (1 week)
3. **Hiring**: Post jobs on [Tanzania Tech Community](https://www.techcommunity.co.tz/), AngelList, LinkedIn
4. **Partner Outreach**: Email M-Pesa/Tigo Pesa business development (use your pitch deck)
5. **Design**: Hire UI/UX designer to create high-fidelity mockups (Figma)
6. **Repo Setup**: Initialize monorepo (backend + mobile) with CI/CD

---

**Want me to generate:**
- Sample API contracts (OpenAPI/Swagger spec)?
- Database migration scripts (SQL)?
- Kubernetes deployment YAMLs?
- Sample Go code for wallet service?

Let me know and I'll create them immediately! 🚀
