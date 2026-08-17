# goPay Production Architecture
## Touch 'n Go eWallet-Style System Design for Tanzania

---

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│  📱 Mobile Apps          │  🌐 Web Admin        │  🏪 Merchant Portal       │
│  • Android (Kotlin)      │  • React.js          │  • React.js               │
│  • iOS (Swift)           │  • TypeScript        │  • Dashboard              │
│  • Flutter (optional)    │                      │  • QR Generator           │
└──────────────┬───────────────────────┬─────────────────────┬────────────────┘
               │                       │                     │
               └───────────────────────┼─────────────────────┘
                                       │
┌──────────────────────────────────────▼─────────────────────────────────────┐
│                        API GATEWAY LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  🔐 Kong / AWS API Gateway / Traefik                                        │
│  • Rate limiting (1000 req/min per user)                                    │
│  • API key validation                                                       │
│  • Request routing                                                          │
│  • TLS termination                                                          │
│  • Circuit breaker (Hystrix pattern)                                        │
└──────────────┬──────────────────────────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────────────────────────┐
│                      AUTHENTICATION & SECURITY                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  🔑 Auth Service (Go/Java)                                                  │
│  • OAuth 2.0 / JWT tokens                                                   │
│  • FIDO2/WebAuthn (passkeys)                                                │
│  • Biometric verification                                                   │
│  • PIN validation (bcrypt hashed)                                           │
│  • Session management (Redis)                                               │
│  • NIDA verification integration                                            │
│                                                                             │
│  Database: PostgreSQL (users, credentials, sessions)                        │
│  Cache: Redis (session tokens, rate limits)                                 │
└──────────────┬──────────────────────────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────────────────────────┐
│                      CORE MICROSERVICES LAYER                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌───────────────────┐  │
│  │  💰 WALLET SERVICE  │  │  💳 PAYMENT SERVICE │  │  👤 USER SERVICE  │  │
│  │  (Go/Java)          │  │  (Go/Java)          │  │  (Node.js/Go)     │  │
│  ├─────────────────────┤  ├─────────────────────┤  ├───────────────────┤  │
│  │ • Balance mgmt      │  │ • QR generation     │  │ • KYC/NIDA        │  │
│  │ • Ledger entries    │  │ • QR scanning       │  │ • Profile mgmt    │  │
│  │ • Transactions      │  │ • Merchant payments │  │ • Device binding  │  │
│  │ • Double-entry      │  │ • P2P transfers     │  │ • Preferences     │  │
│  │   accounting        │  │ • Idempotency       │  │                   │  │
│  │ • Add money         │  │ • Settlement        │  │                   │  │
│  │                     │  │                     │  │                   │  │
│  │ DB: PostgreSQL      │  │ DB: PostgreSQL      │  │ DB: PostgreSQL    │  │
│  │ Cache: Redis        │  │ Cache: Redis        │  │ Cache: Redis      │  │
│  └─────────────────────┘  └─────────────────────┘  └───────────────────┘  │
│                                                                             │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌───────────────────┐  │
│  │  🏛️ BILLS SERVICE   │  │  🎫 TRAVEL SERVICE  │  │  🎁 REWARDS SVC   │  │
│  │  (Node.js)          │  │  (Node.js)          │  │  (Go)             │  │
│  ├─────────────────────┤  ├─────────────────────┤  ├───────────────────┤  │
│  │ • TANESCO API       │  │ • Bus booking       │  │ • Points engine   │  │
│  │ • DAWASCO API       │  │ • Ferry tickets     │  │ • Cashback calc   │  │
│  │ • Mobile airtime    │  │ • Flight search     │  │ • Tier mgmt       │  │
│  │ • TRA tax           │  │ • Hotel API         │  │ • Redemption      │  │
│  │ • NHIF              │  │ • Booking mgmt      │  │                   │  │
│  │                     │  │                     │  │                   │  │
│  │ DB: PostgreSQL      │  │ DB: PostgreSQL      │  │ DB: PostgreSQL    │  │
│  │ Cache: Redis        │  │ Cache: Redis        │  │ Cache: Redis      │  │
│  └─────────────────────┘  └─────────────────────┘  └───────────────────┘  │
│                                                                             │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌───────────────────┐  │
│  │  🛒 SHOP SERVICE    │  │  🌍 INTL SERVICE    │  │  📊 ANALYTICS     │  │
│  │  (Node.js)          │  │  (Go)               │  │  (Python/Go)      │  │
│  ├─────────────────────┤  ├─────────────────────┤  ├───────────────────┤  │
│  │ • Product catalog   │  │ • Wise integration  │  │ • Event tracking  │  │
│  │ • Shopping cart     │  │ • Western Union     │  │ • Fraud detection │  │
│  │ • Order mgmt        │  │ • Panda Remit       │  │ • ML scoring      │  │
│  │ • Inventory         │  │ • WorldRemit        │  │ • Dashboards      │  │
│  │ • Merchant orders   │  │ • FX rates          │  │ • Reporting       │  │
│  │                     │  │ • Compliance        │  │                   │  │
│  │ DB: PostgreSQL      │  │ DB: PostgreSQL      │  │ DB: ClickHouse    │  │
│  │ Cache: Redis        │  │ Cache: Redis        │  │ Cache: Redis      │  │
│  └─────────────────────┘  └─────────────────────┘  └───────────────────┘  │
│                                                                             │
└──────────────┬──────────────────────────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────────────────────────┐
│                        EVENT STREAMING LAYER                                │
├─────────────────────────────────────────────────────────────────────────────┤
│  📨 Apache Kafka / AWS Kinesis / GCP Pub/Sub                                │
│                                                                             │
│  Topics:                                                                    │
│  • wallet.transactions (all balance changes)                                │
│  • payment.completed (successful payments)                                  │
│  • payment.failed (failed transactions)                                     │
│  • user.kyc.verified (KYC events)                                           │
│  • fraud.alerts (suspicious activity)                                       │
│  • rewards.earned (points/cashback)                                         │
│  • notification.push (FCM/APNS events)                                      │
│                                                                             │
│  Stream Processing: Apache Flink / Kafka Streams                            │
│  • Real-time fraud detection                                                │
│  • Balance aggregation                                                      │
│  • Analytics pipeline                                                       │
│  • Notification triggers                                                    │
└──────────────┬──────────────────────────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────────────────────────┐
│                      INTEGRATION / ADAPTER LAYER                            │
├─────────────────────────────────────────────────────────────────────────────┤
│  🔌 Partner Integrations Service (Go/Node.js)                               │
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────┐           │
│  │ Mobile Money    │  │ Banks & Cards   │  │ Government APIs  │           │
│  ├─────────────────┤  ├─────────────────┤  ├──────────────────┤           │
│  │ • M-Pesa API    │  │ • CRDB Bank     │  │ • NIDA           │           │
│  │ • Tigo Pesa     │  │ • NMB Bank      │  │ • TRA            │           │
│  │ • Airtel Money  │  │ • KCB Bank      │  │ • NHIF           │           │
│  │ • Halo Pesa     │  │ • Visa/MC       │  │ • e-Govt portal  │           │
│  │ • USSD gateway  │  │ • Card proc.    │  │ • DAWASCO        │           │
│  │                 │  │ • 3DS auth      │  │ • TANESCO        │           │
│  └─────────────────┘  └─────────────────┘  └──────────────────┘           │
│                                                                             │
│  Patterns: Circuit breaker, retry logic, webhook handling, reconciliation   │
│  Database: PostgreSQL (partner txn log, reconciliation status)              │
└──────────────┬──────────────────────────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────────────────────────┐
│                         DATA PERSISTENCE LAYER                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  Primary Databases (OLTP):                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🗄️ PostgreSQL (Multi-instance, per-service)                         │   │
│  │ • Wallet ledger (double-entry, ACID guarantees)                     │   │
│  │ • User profiles & KYC data                                          │   │
│  │ • Payment records (idempotency keys)                                │   │
│  │ • Transaction history                                               │   │
│  │ • Rewards/points ledger                                             │   │
│  │                                                                     │   │
│  │ Config: Multi-AZ, streaming replication, daily snapshots            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Analytics & Warehousing (OLAP):                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 📊 ClickHouse / TimescaleDB / BigQuery                              │   │
│  │ • Transaction analytics                                             │   │
│  │ • User behavior metrics                                             │   │
│  │ • Fraud detection features                                          │   │
│  │ • Business intelligence                                             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Cache Layer:                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ ⚡ Redis Cluster                                                     │   │
│  │ • Session storage (TTL: 30 days)                                    │   │
│  │ • Balance cache (TTL: 5 min, invalidate on write)                  │   │
│  │ • Rate limiting counters                                            │   │
│  │ • OTP codes (TTL: 5 min)                                            │   │
│  │ • API response cache                                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Object Storage:                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 📦 AWS S3 / GCS / MinIO                                             │   │
│  │ • Transaction receipts (PDF)                                        │   │
│  │ • KYC documents (encrypted)                                         │   │
│  │ • QR codes                                                          │   │
│  │ • Product images                                                    │   │
│  │ • Backup archives                                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                      INFRASTRUCTURE & OBSERVABILITY                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  Container Orchestration:                                                   │
│  • Kubernetes (EKS/GKE/AKS)                                                 │
│  • Helm charts for deployments                                              │
│  • Auto-scaling (HPA based on CPU/memory/custom metrics)                    │
│  • Rolling updates with health checks                                       │
│                                                                             │
│  CI/CD Pipeline:                                                            │
│  • GitHub Actions / GitLab CI / Jenkins                                     │
│  • Automated testing (unit, integration, e2e)                               │
│  • Security scanning (Snyk, SonarQube)                                      │
│  • Blue-green deployments                                                   │
│                                                                             │
│  Monitoring & Logging:                                                      │
│  • Prometheus + Grafana (metrics)                                           │
│  • ELK Stack / CloudWatch (logs)                                            │
│  • Jaeger / Zipkin (distributed tracing)                                    │
│  • PagerDuty / Opsgenie (alerting)                                          │
│  • Sentry (error tracking)                                                  │
│                                                                             │
│  Security:                                                                  │
│  • HashiCorp Vault (secrets management)                                     │
│  • AWS KMS / Cloud KMS (encryption keys)                                    │
│  • WAF (DDoS protection)                                                    │
│  • VPN / private subnets                                                    │
│  • Regular penetration testing                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Security Architecture

### 1. **Authentication Flow**
```
User → Mobile App → API Gateway → Auth Service
                                    ↓
                        [Verify credentials + Device fingerprint]
                                    ↓
                        [Generate JWT (15min) + Refresh Token (30d)]
                                    ↓
                        [Store in Redis with device_id]
                                    ↓
                        Return tokens + user profile
```

### 2. **Transaction Authorization (High-value payments)**
```
Payment Request → API Gateway → Payment Service
                                    ↓
                        [Verify JWT + Check balance]
                                    ↓
                        [Require PIN/biometric]
                                    ↓
                        [Create idempotency key: UUID]
                                    ↓
                        [Publish to fraud detection]
                                    ↓
                        [Execute transaction (ACID)]
                                    ↓
                        [Emit event to Kafka]
                                    ↓
                        Return receipt
```

### 3. **Data Encryption**
- **At rest**: AES-256 (database encryption, S3 server-side)
- **In transit**: TLS 1.3 (all API calls)
- **Sensitive fields**: Application-level encryption (NIDA, card numbers) using envelope encryption
- **Key rotation**: Quarterly via KMS

---

## 💾 Database Schema Highlights

### **Wallet Ledger (Double-Entry)**
```sql
CREATE TABLE ledger_entries (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  transaction_id UUID NOT NULL,
  debit_account VARCHAR(50),
  credit_account VARCHAR(50),
  amount DECIMAL(19,2) NOT NULL,
  currency CHAR(3) DEFAULT 'TZS',
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT check_amount_positive CHECK (amount > 0)
);

CREATE INDEX idx_user_txns ON ledger_entries(user_id, created_at DESC);
CREATE INDEX idx_transaction ON ledger_entries(transaction_id);
```

### **Idempotency (Prevents duplicate payments)**
```sql
CREATE TABLE idempotency_keys (
  key UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  request_hash VARCHAR(64),
  response_body JSONB,
  status VARCHAR(20), -- 'processing', 'completed', 'failed'
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '24 hours'
);

CREATE INDEX idx_key_lookup ON idempotency_keys(key, user_id);
```

### **Balance Cache Strategy**
```redis
# Key pattern
balance:{user_id}

# Value (JSON)
{
  "balance": 150000,
  "currency": "TZS",
  "last_updated": "2025-01-15T10:30:00Z"
}

# TTL: 300 seconds (5 minutes)
# Invalidate on: Any transaction affecting user_id
```

---

## 🔄 Critical Flows

### **1. Add Money (M-Pesa)**
```
Mobile App → Payment Service
    ↓
[Create pending transaction]
    ↓
[Call M-Pesa API: initiate payment]
    ↓
[M-Pesa sends USSD prompt to user]
    ↓
[User enters PIN on M-Pesa]
    ↓
[M-Pesa webhook → Payment Service]
    ↓
[Verify signature + Update ledger]
    ↓
[Credit user wallet (double-entry)]
    ↓
[Invalidate balance cache]
    ↓
[Emit event: wallet.transaction]
    ↓
[Send push notification]
```

### **2. QR Payment (Merchant)**
```
User scans QR → Parse merchant_id + amount
    ↓
[Verify balance >= amount]
    ↓
[Show confirmation screen + require PIN]
    ↓
[Generate idempotency_key]
    ↓
Payment Service: BEGIN TRANSACTION
    ↓
[Debit user wallet]
    ↓
[Credit merchant wallet]
    ↓
[Insert payment record]
    ↓
COMMIT
    ↓
[Emit events to Kafka]
    ↓
[Calculate & credit rewards points]
    ↓
[Return receipt with QR code]
```

### **3. Fraud Detection (Real-time)**
```
Kafka: payment.initiated event
    ↓
Flink Stream Processor
    ↓
[Check rules engine]
    ↓
If suspicious:
  ├─ Location mismatch (GPS vs usual)
  ├─ Velocity check (5+ txns in 10min)
  ├─ Large amount (>1M TZS)
  ├─ New merchant
    ↓
[Calculate fraud score (0-100)]
    ↓
If score > 70:
  ├─ Block transaction
  ├─ Send SMS/push for verification
  ├─ Log to security dashboard
    ↓
Else: Allow
```

---

## 📊 Scaling Strategy

### **Traffic Estimates (at 1M users)**
- **Active users/day**: ~300K (30%)
- **Avg transactions/user/day**: 2
- **Peak QPS**: ~150 req/sec (during lunch/evening)
- **Data growth**: ~500GB/year

### **Horizontal Scaling**
| Service | Min Pods | Max Pods | Auto-scale Metric |
|---------|----------|----------|-------------------|
| Payment | 5 | 50 | CPU > 70% |
| Wallet | 3 | 30 | Memory > 80% |
| Auth | 2 | 10 | Requests > 100/s |
| Bills | 2 | 20 | Queue depth > 100 |

### **Database Scaling**
- **PostgreSQL**: Read replicas (3 replicas) + Connection pooling (PgBouncer)
- **Redis**: Cluster mode (6 nodes: 3 master + 3 replica)
- **ClickHouse**: Sharding by month (partition key: transaction_date)

### **Cost Optimization**
- Use spot instances for non-critical workloads (analytics)
- S3 Intelligent-Tiering for receipts (move to Glacier after 90 days)
- CDN (CloudFront/Cloudflare) for static assets
- Reserved instances for core services (Auth, Payment)

---

## 🚨 Disaster Recovery

### **Backup Strategy**
- **Databases**: Automated snapshots every 6 hours + 30-day retention
- **Transaction logs**: Stream to S3 (immutable, 7-year retention for compliance)
- **Secrets**: Encrypted backups in separate region

### **RTO/RPO Targets**
- **RTO (Recovery Time Objective)**: 1 hour
- **RPO (Recovery Point Objective)**: 5 minutes
- **Multi-region**: Primary (Tanzania), DR replica (South Africa/Kenya)

### **Incident Response**
1. Alert triggers → PagerDuty → On-call engineer
2. Runbook execution (Kubernetes rollback, DB failover)
3. Post-mortem within 48 hours
4. Update monitoring/alerts to prevent recurrence

---

## 🌍 Compliance & Regulations

### **Tanzania-Specific**
- **Bank of Tanzania (BoT)**: E-money issuer license
- **TCRA**: Data localization (user data must be stored in Tanzania)
- **Data Protection Act**: User consent, right to deletion
- **AML/CFT**: Transaction monitoring (>10M TZS flagged)

### **KYC Levels**
- **Tier 1** (Phone verified): Max 1M TZS balance
- **Tier 2** (NIDA verified): Max 5M TZS balance
- **Tier 3** (Bank linked): Unlimited

---

## 🛠️ Technology Stack Summary

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Mobile** | Kotlin (Android), Swift (iOS) | Native performance, platform features |
| **API Gateway** | Kong / AWS API Gateway | Rate limiting, auth, routing |
| **Microservices** | Go (payment/wallet), Node.js (orchestration) | Performance + developer velocity |
| **Database** | PostgreSQL | ACID compliance, mature ecosystem |
| **Cache** | Redis Cluster | Sub-millisecond latency |
| **Streaming** | Apache Kafka | Event sourcing, audit trail |
| **Analytics** | ClickHouse | Fast OLAP queries |
| **Orchestration** | Kubernetes (EKS) | Auto-scaling, resilience |
| **Monitoring** | Prometheus + Grafana | Industry standard |
| **CI/CD** | GitHub Actions | Native integration |

---

## 📈 Phase-by-Phase Deployment

### **Phase 1: MVP (3 months)**
- Core wallet (balance, transactions)
- M-Pesa/Tigo Pesa integration
- P2P transfers
- Basic bills (electricity, water)
- Auth + KYC (NIDA)

### **Phase 2: Merchant Ecosystem (3 months)**
- QR payments
- Merchant onboarding portal
- Settlement system
- Rewards (basic points)

### **Phase 3: Financial Services (6 months)**
- Travel booking
- eShop
- International transfers
- Insurance/savings products

### **Phase 4: Scale & Optimize (ongoing)**
- ML fraud detection
- Advanced analytics
- White-label for corporates
- Cross-border expansion

---

**Next steps**: See `IMPLEMENTATION_PLAN.md` for the detailed developer roadmap 👉
