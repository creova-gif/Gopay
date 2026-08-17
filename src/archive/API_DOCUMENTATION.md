# 📚 goPay API Documentation

## Complete API Reference for Developers & Integration Partners

**Base URL:** `https://{projectId}.supabase.co/functions/v1/make-server-69a10ee8`

**Version:** 1.0.0  
**Last Updated:** January 2026

---

## 🔐 Authentication

All API requests require authentication via Bearer token in the Authorization header:

```
Authorization: Bearer {access_token}
```

### Get Access Token

**Sign Up**
```http
POST /auth/signup
Content-Type: application/json

{
  "name": "John Mwangi",
  "email": "john@example.com",
  "phone": "+255712345678",
  "nida": "19900101-12345-00001-23",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "userId": "user_abc123"
}
```

**Sign In**
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'john@example.com',
  password: 'securePassword123'
});

const accessToken = data.session.access_token;
```

---

## 👤 User Management

### Get User Profile

```http
GET /user/profile
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "id": "user_abc123",
  "email": "john@example.com",
  "name": "John Mwangi",
  "phone": "+255712345678",
  "nida": "19900101-12345-00001-23",
  "createdAt": "2025-01-15T10:30:00Z"
}
```

### Update Profile

```http
PUT /profile/update
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "+255712999888"
}
```

---

## 💰 Wallet Operations

### Get Wallet Balance

```http
GET /wallet/balance
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "balance": 450000,
  "currency": "TZS"
}
```

### Add Funds

```http
POST /wallet/add-funds
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "amount": 10000,
  "source": "M-Pesa",
  "pin": "1234"
}
```

**Response:**
```json
{
  "success": true,
  "newBalance": 460000
}
```

### Send Money (P2P)

```http
POST /wallet/send-money
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "recipient": "+255712345678",
  "amount": 5000,
  "pin": "1234"
}
```

**Response:**
```json
{
  "success": true,
  "newBalance": 455000
}
```

### Link Account

```http
POST /wallet/link-account
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "type": "mobile_money",
  "provider": "M-Pesa",
  "accountNumber": "+255712345678",
  "pin": "1234"
}
```

### Get Linked Accounts

```http
GET /wallet/linked-accounts
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "accounts": [
    {
      "id": "acc_1234567",
      "type": "mobile_money",
      "provider": "M-Pesa",
      "accountNumber": "+255712345678",
      "createdAt": "2025-01-10T14:20:00Z"
    }
  ]
}
```

---

## 💳 Payment Processing

### Process Bill Payment

```http
POST /payments/bill-payment
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "provider": "TANESCO",
  "accountNumber": "1234567890",
  "amount": 50000,
  "pin": "1234",
  "controlNumber": null,
  "phone": "+255712345678",
  "paymentMethod": "wallet"
}
```

**Response:**
```json
{
  "success": true,
  "reference": "BP1705320000ABC123",
  "newBalance": 405000,
  "message": "Payment successful - Receipt sent to your phone"
}
```

### Process Generic Payment

```http
POST /payments/process
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "provider": "DStv",
  "accountNumber": "8012345678",
  "amount": 35000,
  "pin": "1234"
}
```

---

## 📜 Transaction History

### Get Recent Transactions

```http
GET /transactions/recent
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "transactions": [
    {
      "id": "tx_1705320000",
      "userId": "user_abc123",
      "type": "debit",
      "amount": 50000,
      "description": "Bill Payment - TANESCO",
      "timestamp": "2025-01-15T10:30:00Z",
      "status": "completed",
      "category": "bill_payment",
      "reference": "BP1705320000ABC123"
    }
  ]
}
```

### Export Transactions

```http
GET /transactions/export?format=csv&startDate=2025-01-01&endDate=2025-01-31
Authorization: Bearer {access_token}
```

---

## 🧾 QR Code Operations

### Generate Personal QR Code

```http
POST /wallet/generate-qr
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "amount": 5000
}
```

**Response:**
```json
{
  "qrCode": "PAY_user_abc123_5000_1705320000",
  "amount": 5000,
  "userName": "John Mwangi"
}
```

### Pay via QR Code

```http
POST /wallet/pay-qr
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "qrCode": "PAY_user_xyz789_5000_1705320000",
  "amount": 5000,
  "pin": "1234"
}
```

**Response:**
```json
{
  "success": true,
  "amount": 5000,
  "newBalance": 450000,
  "recipientName": "Jane Doe"
}
```

### Request Money

```http
POST /wallet/request-money
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "recipient": "+255712345678",
  "amount": 10000,
  "message": "Lunch money"
}
```

---

## 🏪 Merchant Operations

### Register Merchant

```http
POST /merchant/register
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "businessName": "Mama Neema Duka",
  "businessType": "retail",
  "location": "Dar es Salaam",
  "phone": "+255712345678",
  "tinNumber": "123-456-789"
}
```

### Generate Merchant QR

```http
POST /merchant/generate-qr
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "merchantId": "merch_abc123",
  "amount": 25000
}
```

### Get Merchant Stats

```http
GET /merchant/stats
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "totalSales": 1250000,
  "transactionCount": 47,
  "commission": 187500,
  "netEarnings": 1062500,
  "period": "month"
}
```

---

## ✈️ Travel Booking

### Search Flights

```http
POST /flights/search
Content-Type: application/json

{
  "origin": "DAR",
  "destination": "JRO",
  "date": "2025-02-15",
  "passengers": 1
}
```

**Response:**
```json
{
  "flights": [
    {
      "id": "flight_123",
      "airline": "Precision Air",
      "flightNumber": "PW123",
      "departure": "2025-02-15T08:00:00Z",
      "arrival": "2025-02-15T09:30:00Z",
      "price": 180000,
      "currency": "TZS",
      "seatsAvailable": 12
    }
  ]
}
```

### Book Flight

```http
POST /flights/book
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "flightId": "flight_123",
  "passengerName": "John Mwangi",
  "passengerEmail": "john@example.com",
  "passengerPhone": "+255712345678",
  "pin": "1234"
}
```

### Search Hotels

```http
POST /hotels/search
Content-Type: application/json

{
  "location": "Zanzibar",
  "checkIn": "2025-02-20",
  "checkOut": "2025-02-22",
  "guests": 2
}
```

### Book Hotel

```http
POST /hotels/book
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "hotelId": "hotel_456",
  "roomType": "deluxe",
  "checkIn": "2025-02-20",
  "checkOut": "2025-02-22",
  "guestName": "John Mwangi",
  "pin": "1234"
}
```

---

## 🍔 Food Delivery (New)

### Get Restaurants

```http
GET /restaurants/list?location=dar_es_salaam
```

**Response:**
```json
{
  "restaurants": [
    {
      "id": "rest_123",
      "name": "Mama Lishe Restaurant",
      "cuisine": "Tanzanian",
      "rating": 4.5,
      "deliveryTime": "30-45 min",
      "deliveryFee": 3000,
      "image": "https://example.com/image.jpg"
    }
  ]
}
```

### Get Menu

```http
GET /restaurants/{restaurantId}/menu
```

### Place Order

```http
POST /restaurants/order
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "restaurantId": "rest_123",
  "items": [
    {
      "itemId": "item_456",
      "quantity": 2,
      "price": 15000
    }
  ],
  "deliveryAddress": "Mikocheni, Dar es Salaam",
  "deliveryTime": "asap",
  "pin": "1234"
}
```

---

## 🚗 Ride-Hailing (New)

### Request Ride

```http
POST /rides/request
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "pickup": {
    "lat": -6.7924,
    "lng": 39.2083,
    "address": "Mlimani City, Dar es Salaam"
  },
  "destination": {
    "lat": -6.8200,
    "lng": 39.2800,
    "address": "Julius Nyerere Airport"
  },
  "vehicleType": "car"
}
```

**Response:**
```json
{
  "rideId": "ride_789",
  "driver": {
    "name": "Driver Name",
    "phone": "+255712345678",
    "rating": 4.8,
    "vehicle": "Toyota Wish - T123 ABC"
  },
  "fare": 25000,
  "estimatedTime": "5 minutes",
  "status": "searching"
}
```

### Get Ride Status

```http
GET /rides/{rideId}/status
Authorization: Bearer {access_token}
```

### Cancel Ride

```http
POST /rides/{rideId}/cancel
Authorization: Bearer {access_token}
```

---

## 🎁 GOrewards

### Get Rewards Balance

```http
GET /rewards/balance
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "points": 12450,
  "cashback": 15000,
  "tier": "gold",
  "nextTier": "platinum",
  "pointsToNextTier": 7550
}
```

### Redeem Rewards

```http
POST /rewards/redeem
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "rewardId": "reward_airtime_5000",
  "points": 5000
}
```

### Get Reward History

```http
GET /rewards/history
Authorization: Bearer {access_token}
```

---

## 📊 Analytics & Performance

### Track Event

```http
POST /analytics/track
Content-Type: application/json

{
  "event": "page_view",
  "userId": "user_abc123",
  "properties": {
    "page": "dashboard",
    "referrer": "home"
  },
  "timestamp": "2025-01-15T10:30:00Z"
}
```

### Get Performance Stats

```http
GET /performance/stats?date=2025-01-15
```

**Response:**
```json
{
  "date": "2025-01-15",
  "totalRequests": 15420,
  "avgDuration": 342,
  "slowRequests": 23,
  "errors": 5,
  "cacheStats": {
    "entries": 1250,
    "totalHits": 8943
  }
}
```

### Clear Cache

```http
POST /performance/cache/clear
Content-Type: application/json

{
  "pattern": "user:"
}
```

---

## 📲 Notifications

### Send SMS

```http
POST /integrations/sms/send
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "phone": "+255712345678",
  "message": "Your OTP is 123456",
  "userId": "user_abc123"
}
```

### Send Push Notification

```http
POST /integrations/push/send
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "userId": "user_abc123",
  "title": "Payment Successful",
  "body": "You have successfully paid TZS 50,000",
  "data": {
    "type": "transaction",
    "id": "tx_1705320000"
  }
}
```

### Register FCM Token

```http
POST /integrations/push/register
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "userId": "user_abc123",
  "token": "fcm_token_abc123..."
}
```

---

## ❌ Error Handling

All errors follow this format:

```json
{
  "error": "Insufficient balance",
  "code": "INSUFFICIENT_BALANCE",
  "statusCode": 400
}
```

### Common Error Codes

| Code | Description | Status |
|------|-------------|--------|
| `UNAUTHORIZED` | Invalid or missing auth token | 401 |
| `INVALID_PIN` | Incorrect PIN entered | 400 |
| `INSUFFICIENT_BALANCE` | Not enough funds | 400 |
| `USER_NOT_FOUND` | User does not exist | 404 |
| `INVALID_PHONE` | Phone number format invalid | 400 |
| `RATE_LIMIT_EXCEEDED` | Too many requests | 429 |
| `SERVER_ERROR` | Internal server error | 500 |

---

## ⚡ Rate Limiting

- **Anonymous**: 100 requests/hour
- **Authenticated**: 1000 requests/hour
- **Premium**: 10,000 requests/hour

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 987
X-RateLimit-Reset: 1705324800
```

---

## 🔒 Security Best Practices

1. **Never expose API keys** in client-side code
2. **Use HTTPS** for all requests
3. **Implement PIN verification** for sensitive operations
4. **Store tokens securely** (encrypted storage)
5. **Implement session timeout** (15 minutes default)
6. **Use device fingerprinting** for fraud detection
7. **Enable 2FA** for high-value transactions

---

## 📦 SDK & Libraries

### JavaScript/TypeScript

```bash
npm install @gopay/sdk
```

```javascript
import GoPay from '@gopay/sdk';

const client = new GoPay({
  apiKey: 'your_api_key',
  environment: 'production' // or 'sandbox'
});

// Send money
const result = await client.wallet.sendMoney({
  recipient: '+255712345678',
  amount: 5000,
  pin: '1234'
});
```

### Python

```bash
pip install gopay-python
```

```python
from gopay import GoPay

client = GoPay(api_key='your_api_key')
result = client.wallet.send_money(
    recipient='+255712345678',
    amount=5000,
    pin='1234'
)
```

### Flutter/Dart

```yaml
dependencies:
  gopay_sdk: ^1.0.0
```

```dart
import 'package:gopay_sdk/gopay_sdk.dart';

final client = GoPay(apiKey: 'your_api_key');
final result = await client.wallet.sendMoney(
  recipient: '+255712345678',
  amount: 5000,
  pin: '1234',
);
```

---

## 🧪 Testing

### Sandbox Environment

**Base URL:** `https://sandbox-{projectId}.supabase.co/functions/v1/make-server-69a10ee8`

### Test Credentials

```
Email: test@gopay.tz
Password: Test123!
PIN: 1234
Phone: +255712000001
```

### Test Accounts

| Service | Account | PIN |
|---------|---------|-----|
| M-Pesa | +255712345678 | 1234 |
| TANESCO | 1234567890 | N/A |
| DStv | 8012345678 | N/A |

---

## 📞 Support

- **Email:** developers@gopay.tz
- **Docs:** https://docs.gopay.tz
- **Status:** https://status.gopay.tz
- **Slack:** gopay-developers.slack.com

---

**Last Updated:** January 18, 2026  
**Version:** 1.0.0  
**License:** MIT
