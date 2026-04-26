import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import * as kv from './kv_store.tsx';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { processTopUp, processWithdrawal, processExternalSend } from './payments/payment-service.ts';
import { handleSelcomWebhook, handleFlutterwaveWebhook } from './payments/webhook-handler.ts';

function getDb() {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
}

const paymentAggregatorApp = new Hono();

paymentAggregatorApp.use('*', cors());

// ============================================
// PAYMENT AGGREGATOR INTEGRATION
// ============================================
// Supports: Selcom, Pesapal, ClickPesa, PayChangu, Jenga API, N-Lynx
// Direct APIs: M-Pesa Daraja, Airtel Money, TigoPesa, Halopesa
// ============================================

interface PaymentRequest {
  amount: number;
  currency: string;
  paymentMethod: 'mpesa' | 'airtel' | 'tigo' | 'halopesa' | 'bank' | 'card';
  phoneNumber?: string;
  accountNumber?: string;
  description: string;
  userId: string;
  reference: string;
}

interface PaymentResponse {
  success: boolean;
  transactionId: string;
  status: 'pending' | 'completed' | 'failed';
  message: string;
  aggregator?: string;
}

// ============================================
// 1. SELCOM PAYMENT GATEWAY (PRIMARY)
// ============================================
// Selcom covers: All mobile money, banks, cards, govt payments
// Docs: https://developer.selcommobile.com

async function processSelcomPayment(payment: PaymentRequest): Promise<PaymentResponse> {
  const selcomApiKey = Deno.env.get('SELCOM_API_KEY');
  const selcomApiSecret = Deno.env.get('SELCOM_API_SECRET');
  const selcomVendor = Deno.env.get('SELCOM_VENDOR_ID') || 'GOPAY';

  if (!selcomApiKey || !selcomApiSecret) {
    console.warn('Selcom credentials not configured, using demo mode');
    return createDemoPaymentResponse('selcom', payment);
  }

  try {
    // Selcom API endpoint
    const selcomEndpoint = 'https://apigw.selcommobile.com/v1/checkout/create-order';

    // Generate order ID
    const orderId = `GO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Map payment method to Selcom gateway
    let gateway = '';
    switch (payment.paymentMethod) {
      case 'mpesa':
        gateway = 'MPESA';
        break;
      case 'airtel':
        gateway = 'AIRTELMONEY';
        break;
      case 'tigo':
        gateway = 'TIGOPESA';
        break;
      case 'halopesa':
        gateway = 'HALOPESA';
        break;
      case 'card':
        gateway = 'MASTERCARD'; // or VISA
        break;
      case 'bank':
        gateway = 'BANKACCOUNT';
        break;
    }

    const requestBody = {
      vendor: selcomVendor,
      order_id: orderId,
      buyer_email: `user-${payment.userId}@gopay.tz`,
      buyer_name: 'goPay User',
      buyer_phone: payment.phoneNumber || '',
      amount: payment.amount,
      currency: payment.currency || 'TZS',
      gateway: gateway,
      payment_methods: [gateway],
      redirect_url: `https://gopay.tz/payment-success?ref=${payment.reference}`,
      cancel_url: `https://gopay.tz/payment-cancel?ref=${payment.reference}`,
      webhook_url: `https://gopay.tz/api/payment-webhook`,
      no_of_items: 1,
    };

    // Sign request (Selcom uses HMAC-SHA256)
    const timestamp = Date.now();
    const signedFields = `vendor=${selcomVendor}&order_id=${orderId}&amount=${payment.amount}&currency=${payment.currency}`;
    
    // In production, implement proper HMAC signing
    const signature = await generateHMAC(signedFields, selcomApiSecret);

    const response = await fetch(selcomEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `SELCOM ${selcomApiKey}`,
        'Digest-Method': 'HS256',
        'Digest': signature,
        'Timestamp': timestamp.toString(),
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();

    if (response.ok && result.result === 0) {
      // Store transaction
      await kv.set(`transaction:${orderId}`, {
        transactionId: orderId,
        userId: payment.userId,
        amount: payment.amount,
        currency: payment.currency,
        paymentMethod: payment.paymentMethod,
        status: 'pending',
        aggregator: 'selcom',
        reference: payment.reference,
        createdAt: new Date().toISOString(),
        selcomData: result,
      });

      return {
        success: true,
        transactionId: orderId,
        status: 'pending',
        message: 'Payment initiated successfully. Complete payment on your phone.',
        aggregator: 'selcom',
      };
    } else {
      throw new Error(result.message || 'Selcom payment failed');
    }
  } catch (error) {
    console.error('Selcom payment error:', error);
    throw error;
  }
}

// ============================================
// 2. M-PESA DARAJA API (DIRECT - VODACOM)
// ============================================
// C2B, B2C, Reversals, Confirmations
// Docs: https://developer.safaricom.co.ke/Documentation

async function processMpesaDaraja(payment: PaymentRequest): Promise<PaymentResponse> {
  const mpesaConsumerKey = Deno.env.get('MPESA_CONSUMER_KEY');
  const mpesaConsumerSecret = Deno.env.get('MPESA_CONSUMER_SECRET');
  const mpesaShortcode = Deno.env.get('MPESA_SHORTCODE') || '174379';
  const mpesaPasskey = Deno.env.get('MPESA_PASSKEY');

  if (!mpesaConsumerKey || !mpesaConsumerSecret) {
    console.warn('M-Pesa credentials not configured, using demo mode');
    return createDemoPaymentResponse('mpesa-daraja', payment);
  }

  try {
    // Step 1: Get OAuth token
    const authResponse = await fetch(
      'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${btoa(`${mpesaConsumerKey}:${mpesaConsumerSecret}`)}`,
        },
      }
    );

    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    // Step 2: STK Push (Lipa na M-Pesa Online)
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = btoa(`${mpesaShortcode}${mpesaPasskey}${timestamp}`);
    
    const transactionId = `GO-MPESA-${Date.now()}`;

    const stkPushResponse = await fetch(
      'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          BusinessShortCode: mpesaShortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: Math.round(payment.amount),
          PartyA: payment.phoneNumber?.replace(/\D/g, ''),
          PartyB: mpesaShortcode,
          PhoneNumber: payment.phoneNumber?.replace(/\D/g, ''),
          CallBackURL: 'https://gopay.tz/api/mpesa-callback',
          AccountReference: payment.reference,
          TransactionDesc: payment.description,
        }),
      }
    );

    const stkResult = await stkPushResponse.json();

    if (stkResult.ResponseCode === '0') {
      await kv.set(`transaction:${transactionId}`, {
        transactionId,
        userId: payment.userId,
        amount: payment.amount,
        status: 'pending',
        aggregator: 'mpesa-daraja',
        mpesaCheckoutRequestID: stkResult.CheckoutRequestID,
        reference: payment.reference,
        createdAt: new Date().toISOString(),
      });

      return {
        success: true,
        transactionId,
        status: 'pending',
        message: 'Check your phone to complete M-Pesa payment',
        aggregator: 'mpesa-daraja',
      };
    } else {
      throw new Error(stkResult.ResponseDescription || 'M-Pesa payment failed');
    }
  } catch (error) {
    console.error('M-Pesa Daraja error:', error);
    throw error;
  }
}

// ============================================
// 3. AIRTEL MONEY API
// ============================================
// Collections, Disbursements, Wallet-to-Wallet

async function processAirtelMoney(payment: PaymentRequest): Promise<PaymentResponse> {
  const airtelClientId = Deno.env.get('AIRTEL_CLIENT_ID');
  const airtelClientSecret = Deno.env.get('AIRTEL_CLIENT_SECRET');
  const airtelApiKey = Deno.env.get('AIRTEL_API_KEY');

  if (!airtelClientId || !airtelClientSecret) {
    console.warn('Airtel Money credentials not configured, using demo mode');
    return createDemoPaymentResponse('airtel', payment);
  }

  try {
    // Step 1: Get OAuth token
    const authResponse = await fetch(
      'https://openapiuat.airtel.africa/auth/oauth2/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: airtelClientId,
          client_secret: airtelClientSecret,
          grant_type: 'client_credentials',
        }),
      }
    );

    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    // Step 2: Collection Request
    const transactionId = `GO-AIRTEL-${Date.now()}`;

    const collectionResponse = await fetch(
      'https://openapiuat.airtel.africa/merchant/v1/payments/',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Country': 'TZ',
          'X-Currency': 'TZS',
        },
        body: JSON.stringify({
          reference: transactionId,
          subscriber: {
            country: 'TZ',
            currency: 'TZS',
            msisdn: payment.phoneNumber?.replace(/\D/g, ''),
          },
          transaction: {
            amount: payment.amount,
            country: 'TZ',
            currency: 'TZS',
            id: transactionId,
          },
        }),
      }
    );

    const result = await collectionResponse.json();

    if (result.status?.code === '200' || result.status?.success) {
      await kv.set(`transaction:${transactionId}`, {
        transactionId,
        userId: payment.userId,
        amount: payment.amount,
        status: 'pending',
        aggregator: 'airtel',
        airtelTransactionId: result.data?.transaction?.id,
        reference: payment.reference,
        createdAt: new Date().toISOString(),
      });

      return {
        success: true,
        transactionId,
        status: 'pending',
        message: 'Check your phone to approve Airtel Money payment',
        aggregator: 'airtel',
      };
    } else {
      throw new Error(result.status?.message || 'Airtel Money payment failed');
    }
  } catch (error) {
    console.error('Airtel Money error:', error);
    throw error;
  }
}

// ============================================
// 4. TIGOPESA API
// ============================================
// Pay with Tigo, Merchant API, Push-to-pay

async function processTigoPesa(payment: PaymentRequest): Promise<PaymentResponse> {
  const tigoUsername = Deno.env.get('TIGO_USERNAME');
  const tigoPassword = Deno.env.get('TIGO_PASSWORD');
  const tigoMerchantCode = Deno.env.get('TIGO_MERCHANT_CODE');

  if (!tigoUsername || !tigoPassword) {
    console.warn('TigoPesa credentials not configured, using demo mode');
    return createDemoPaymentResponse('tigo', payment);
  }

  try {
    const transactionId = `GO-TIGO-${Date.now()}`;

    const response = await fetch(
      'https://secure.tigo.com/ivr_payment/payment/transaction/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${tigoUsername}:${tigoPassword}`)}`,
        },
        body: JSON.stringify({
          MasterMerchantCode: tigoMerchantCode,
          MerchantReference: transactionId,
          Amount: payment.amount,
          CustomerMSISDN: payment.phoneNumber?.replace(/\D/g, ''),
          MerchantName: 'goPay',
          Remarks: payment.description,
        }),
      }
    );

    const result = await response.json();

    if (result.ResponseCode === '0' || result.status === 'SUCCESS') {
      await kv.set(`transaction:${transactionId}`, {
        transactionId,
        userId: payment.userId,
        amount: payment.amount,
        status: 'pending',
        aggregator: 'tigo',
        tigoReference: result.ReferenceID,
        reference: payment.reference,
        createdAt: new Date().toISOString(),
      });

      return {
        success: true,
        transactionId,
        status: 'pending',
        message: 'Check your phone to complete TigoPesa payment',
        aggregator: 'tigo',
      };
    } else {
      throw new Error(result.ResponseDescription || 'TigoPesa payment failed');
    }
  } catch (error) {
    console.error('TigoPesa error:', error);
    throw error;
  }
}

// ============================================
// 5. HALOPESA API
// ============================================

async function processHaloPesa(payment: PaymentRequest): Promise<PaymentResponse> {
  const haloApiKey = Deno.env.get('HALOPESA_API_KEY');
  const haloMerchantId = Deno.env.get('HALOPESA_MERCHANT_ID');

  if (!haloApiKey) {
    console.warn('HaloPesa credentials not configured, using demo mode');
    return createDemoPaymentResponse('halopesa', payment);
  }

  try {
    const transactionId = `GO-HALO-${Date.now()}`;

    const response = await fetch(
      'https://api.halopesa.co.tz/collections',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${haloApiKey}`,
        },
        body: JSON.stringify({
          merchant_id: haloMerchantId,
          reference: transactionId,
          amount: payment.amount,
          currency: 'TZS',
          phone_number: payment.phoneNumber,
          description: payment.description,
        }),
      }
    );

    const result = await response.json();

    if (result.status === 'success') {
      await kv.set(`transaction:${transactionId}`, {
        transactionId,
        userId: payment.userId,
        amount: payment.amount,
        status: 'pending',
        aggregator: 'halopesa',
        reference: payment.reference,
        createdAt: new Date().toISOString(),
      });

      return {
        success: true,
        transactionId,
        status: 'pending',
        message: 'Check your phone to complete HaloPesa payment',
        aggregator: 'halopesa',
      };
    } else {
      throw new Error(result.message || 'HaloPesa payment failed');
    }
  } catch (error) {
    console.error('HaloPesa error:', error);
    throw error;
  }
}

// ============================================
// 6. PESAPAL INTEGRATION
// ============================================

async function processPesapal(payment: PaymentRequest): Promise<PaymentResponse> {
  const pesapalKey = Deno.env.get('PESAPAL_CONSUMER_KEY');
  const pesapalSecret = Deno.env.get('PESAPAL_CONSUMER_SECRET');

  if (!pesapalKey || !pesapalSecret) {
    console.warn('Pesapal credentials not configured, using demo mode');
    return createDemoPaymentResponse('pesapal', payment);
  }

  try {
    // OAuth authentication
    const authResponse = await fetch(
      'https://pay.pesapal.com/v3/api/Auth/RequestToken',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          consumer_key: pesapalKey,
          consumer_secret: pesapalSecret,
        }),
      }
    );

    const authData = await authResponse.json();
    const token = authData.token;

    const transactionId = `GO-PESAPAL-${Date.now()}`;

    const orderResponse = await fetch(
      'https://pay.pesapal.com/v3/api/Transactions/SubmitOrderRequest',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: transactionId,
          currency: 'TZS',
          amount: payment.amount,
          description: payment.description,
          callback_url: 'https://gopay.tz/api/pesapal-callback',
          notification_id: 'GOPAY-NOTIFICATION',
          billing_address: {
            phone_number: payment.phoneNumber,
            email_address: `user-${payment.userId}@gopay.tz`,
          },
        }),
      }
    );

    const result = await orderResponse.json();

    if (result.status === '200') {
      await kv.set(`transaction:${transactionId}`, {
        transactionId,
        userId: payment.userId,
        amount: payment.amount,
        status: 'pending',
        aggregator: 'pesapal',
        pesapalOrderId: result.order_tracking_id,
        reference: payment.reference,
        createdAt: new Date().toISOString(),
      });

      return {
        success: true,
        transactionId,
        status: 'pending',
        message: 'Redirecting to payment page...',
        aggregator: 'pesapal',
      };
    } else {
      throw new Error('Pesapal payment failed');
    }
  } catch (error) {
    console.error('Pesapal error:', error);
    throw error;
  }
}

// ============================================
// 7. CLICKPESA INTEGRATION
// ============================================
// ClickPesa: Tanzania payment gateway
// Supports: M-Pesa, Airtel Money, Tigo Pesa, Halopesa, Cards
// Docs: https://developer.clickpesa.com

async function processClickPesa(payment: PaymentRequest): Promise<PaymentResponse> {
  const clickpesaApiKey = Deno.env.get('CLICKPESA_API_KEY');
  const clickpesaSecretKey = Deno.env.get('CLICKPESA_SECRET_KEY');
  const clickpesaMerchantId = Deno.env.get('CLICKPESA_MERCHANT_ID') || 'GOPAY';

  if (!clickpesaApiKey || !clickpesaSecretKey) {
    throw new Error('ClickPesa API credentials not configured. Please contact support.');
  }

  try {
    const transactionId = `GO-CLICKPESA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Map payment method to ClickPesa channel
    let paymentChannel = '';
    switch (payment.paymentMethod) {
      case 'mpesa':
        paymentChannel = 'MPESA';
        break;
      case 'airtel':
        paymentChannel = 'AIRTELMONEY';
        break;
      case 'tigo':
        paymentChannel = 'TIGOPESA';
        break;
      case 'halopesa':
        paymentChannel = 'HALOPESA';
        break;
      case 'card':
        paymentChannel = 'CARD';
        break;
      default:
        paymentChannel = 'MPESA';
    }

    // Clean phone number (remove country code if present, ClickPesa expects local format)
    const cleanPhone = payment.phoneNumber?.replace(/\D/g, '').replace(/^255/, '0') || '';

    const requestBody = {
      merchant_reference: transactionId,
      amount: payment.amount,
      currency: payment.currency || 'TZS',
      payment_channel: paymentChannel,
      phone_number: cleanPhone,
      email: `user-${payment.userId}@gopay.tz`,
      first_name: 'GoPay',
      last_name: 'User',
      description: payment.description || 'Payment via GoPay',
      callback_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/make-server-69a10ee8/payment/clickpesa-callback`,
    };

    console.log('ClickPesa payment request:', { 
      transactionId, 
      amount: payment.amount, 
      channel: paymentChannel,
      phone: cleanPhone 
    });

    const response = await fetch('https://api.clickpesa.com/v1/payments/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${clickpesaApiKey}`,
        'X-API-Key': clickpesaApiKey,
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();
    console.log('ClickPesa API response:', { status: response.status, result });

    if (response.ok && result.status === 'success') {
      // Store transaction
      await kv.set(`transaction:${transactionId}`, {
        transactionId,
        userId: payment.userId,
        amount: payment.amount,
        currency: payment.currency || 'TZS',
        paymentMethod: payment.paymentMethod,
        status: 'pending',
        aggregator: 'clickpesa',
        reference: payment.reference,
        clickpesaTransactionId: result.data?.transaction_id || result.transaction_id,
        clickpesaCheckoutUrl: result.data?.checkout_url || result.checkout_url,
        description: payment.description,
        phoneNumber: cleanPhone,
        createdAt: new Date().toISOString(),
      });

      return {
        success: true,
        transactionId,
        status: 'pending',
        message: payment.paymentMethod === 'card' 
          ? 'Redirecting to card payment page...' 
          : 'Angalia simu yako ili kukamilisha malipo',
        aggregator: 'clickpesa',
      };
    } else {
      const errorMessage = result.message || result.error || 'ClickPesa payment request failed';
      console.error('ClickPesa payment failed:', errorMessage, result);
      throw new Error(`Malipo yameshindikana: ${errorMessage}`);
    }
  } catch (error: any) {
    console.error('ClickPesa payment error:', error);
    throw new Error(`Hitilafu ya malipo: ${error.message}`);
  }
}

// ============================================
// UNIFIED PAYMENT PROCESSOR
// ============================================

paymentAggregatorApp.post('/process-payment', async (c) => {
  try {
    const authHeader = c.req.header('Authorization') ?? '';
    const { data: { user }, error: authError } = await createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    ).auth.getUser();
    if (authError || !user) return c.json({ error: 'Unauthorized' }, 401);

    const payment: PaymentRequest = await c.req.json();

    // Validate payment
    if (!payment.amount || payment.amount <= 0) {
      return c.json({ error: 'Invalid payment amount' }, 400);
    }

    if (!payment.paymentMethod) {
      return c.json({ error: 'Payment method is required' }, 400);
    }

    let result: PaymentResponse;

    // ALL MOBILE MONEY PAYMENTS GO THROUGH CLICKPESA
    // M-Pesa, Airtel Money, Tigo Pesa, Halopesa, Cards → ClickPesa Gateway
    const mobileMoneyMethods = ['mpesa', 'airtel', 'tigo', 'halopesa', 'card'];
    
    if (mobileMoneyMethods.includes(payment.paymentMethod)) {
      // Use ClickPesa for all mobile money and card payments
      result = await processClickPesa(payment);
    } else {
      // Fallback for other payment methods (bank transfers, etc.)
      const preferredAggregator = Deno.env.get('PREFERRED_AGGREGATOR') || 'clickpesa';

      if (preferredAggregator === 'clickpesa') {
        result = await processClickPesa(payment);
      } else if (preferredAggregator === 'selcom') {
        result = await processSelcomPayment(payment);
      } else if (preferredAggregator === 'pesapal') {
        result = await processPesapal(payment);
      } else {
        // Direct API routing (legacy, not used for mobile money)
        switch (payment.paymentMethod) {
          case 'mpesa':
            result = await processMpesaDaraja(payment);
            break;
          case 'airtel':
            result = await processAirtelMoney(payment);
            break;
          case 'tigo':
            result = await processTigoPesa(payment);
            break;
          case 'halopesa':
            result = await processHaloPesa(payment);
            break;
          default:
            result = await processPesapal(payment);
        }
      }
    }

    // Award GOrewards points (10 points per TZS spent)
    if (result.success) {
      const points = Math.floor(payment.amount * 0.1);
      const currentRewards = await kv.get(`rewards:${payment.userId}`) || {
        points: 0,
        tier: 'Bronze',
        cashback: 0,
      };

      await kv.set(`rewards:${payment.userId}`, {
        ...currentRewards,
        points: currentRewards.points + points,
      });
    }

    return c.json(result);
  } catch (error: any) {
    console.error('Payment processing error:', error);
    return c.json(
      {
        success: false,
        error: error.message || 'Payment processing failed',
      },
      500
    );
  }
});

// ============================================
// B2C - WITHDRAW / DISBURSE TO USER
// ============================================

paymentAggregatorApp.post('/disburse', async (c) => {
  try {
    const { userId, amount, phoneNumber, paymentMethod } = await c.req.json();

    const transactionId = `GO-DISBURSE-${Date.now()}`;

    // Use appropriate API for disbursement
    let result: PaymentResponse;

    switch (paymentMethod) {
      case 'mpesa':
        // M-Pesa B2C
        result = await disburseMpesa(phoneNumber, amount, transactionId);
        break;
      case 'airtel':
        // Airtel Disbursement
        result = await disburseAirtel(phoneNumber, amount, transactionId);
        break;
      case 'tigo':
        result = await disburseTigo(phoneNumber, amount, transactionId);
        break;
      default:
        throw new Error('Unsupported disbursement method');
    }

    return c.json(result);
  } catch (error: any) {
    console.error('Disbursement error:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============================================
// WEBHOOK HANDLERS
// ============================================

// M-Pesa callback
paymentAggregatorApp.post('/mpesa-callback', async (c) => {
  try {
    const callback = await c.req.json();
    console.log('M-Pesa callback received:', callback);

    // Update transaction status
    if (callback.Body?.stkCallback?.ResultCode === 0) {
      // Payment successful
      const checkoutRequestID = callback.Body.stkCallback.CheckoutRequestID;
      // Update transaction in KV store
    }

    return c.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (error) {
    console.error('M-Pesa callback error:', error);
    return c.json({ ResultCode: 1, ResultDesc: 'Failed' });
  }
});

// Selcom webhook
paymentAggregatorApp.post('/selcom-webhook', async (c) => {
  try {
    const webhook = await c.req.json();
    console.log('Selcom webhook received:', webhook);
    
    // Verify signature and update transaction
    
    return c.json({ status: 'received' });
  } catch (error) {
    console.error('Selcom webhook error:', error);
    return c.json({ status: 'error' }, 500);
  }
});

// ClickPesa webhook
paymentAggregatorApp.post('/clickpesa-callback', async (c) => {
  try {
    const callback = await c.req.json();
    console.log('ClickPesa callback received:', callback);

    // Verify signature
    const clickpesaSecretKey = Deno.env.get('CLICKPESA_SECRET_KEY');
    if (clickpesaSecretKey && callback.signature) {
      const expectedSignature = await generateHMAC(
        `${callback.merchant_reference}${callback.status}${callback.amount}`,
        clickpesaSecretKey
      );
      
      if (callback.signature !== expectedSignature) {
        console.error('ClickPesa signature verification failed');
        return c.json({ status: 'signature_mismatch' }, 401);
      }
    }

    // Update transaction status
    if (callback.status === 'success' || callback.status === 'completed') {
      const transaction = await kv.get(`transaction:${callback.merchant_reference}`);
      if (transaction) {
        await kv.set(`transaction:${callback.merchant_reference}`, {
          ...transaction,
          status: 'completed',
          clickpesaPaymentId: callback.payment_id,
          completedAt: new Date().toISOString(),
        });
      }
    } else if (callback.status === 'failed' || callback.status === 'cancelled') {
      const transaction = await kv.get(`transaction:${callback.merchant_reference}`);
      if (transaction) {
        await kv.set(`transaction:${callback.merchant_reference}`, {
          ...transaction,
          status: 'failed',
          failureReason: callback.message || 'Payment failed',
          failedAt: new Date().toISOString(),
        });
      }
    }

    return c.json({ status: 'received', message: 'Callback processed successfully' });
  } catch (error) {
    console.error('ClickPesa callback error:', error);
    return c.json({ status: 'error', message: 'Callback processing failed' }, 500);
  }
});

// ============================================
// TRANSACTION STATUS
// ============================================

paymentAggregatorApp.get('/transaction/:id', async (c) => {
  try {
    const transactionId = c.req.param('id');
    const transaction = await kv.get(`transaction:${transactionId}`);

    if (!transaction) {
      return c.json({ error: 'Transaction not found' }, 404);
    }

    return c.json(transaction);
  } catch (error: any) {
    console.error('Transaction fetch error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================
// HELPER FUNCTIONS
// ============================================

async function generateHMAC(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

function createDemoPaymentResponse(aggregator: string, payment: PaymentRequest): PaymentResponse {
  const transactionId = `GO-DEMO-${aggregator.toUpperCase()}-${Date.now()}`;
  
  return {
    success: true,
    transactionId,
    status: 'pending',
    message: `[DEMO MODE] Payment initiated via ${aggregator}. In production, user will receive payment prompt on phone.`,
    aggregator,
  };
}

async function disburseMpesa(phone: string, amount: number, ref: string): Promise<PaymentResponse> {
  // M-Pesa B2C implementation
  return createDemoPaymentResponse('mpesa-b2c', {
    amount,
    currency: 'TZS',
    paymentMethod: 'mpesa',
    phoneNumber: phone,
    description: 'Withdrawal',
    userId: 'system',
    reference: ref,
  });
}

async function disburseAirtel(phone: string, amount: number, ref: string): Promise<PaymentResponse> {
  // Airtel disbursement implementation
  return createDemoPaymentResponse('airtel-disbursement', {
    amount,
    currency: 'TZS',
    paymentMethod: 'airtel',
    phoneNumber: phone,
    description: 'Withdrawal',
    userId: 'system',
    reference: ref,
  });
}

async function disburseTigo(phone: string, amount: number, ref: string): Promise<PaymentResponse> {
  // Tigo disbursement implementation
  return createDemoPaymentResponse('tigo-disbursement', {
    amount,
    currency: 'TZS',
    paymentMethod: 'tigo',
    phoneNumber: phone,
    description: 'Withdrawal',
    userId: 'system',
    reference: ref,
  });
}

// ── C2B Top-Up ────────────────────────────────────────────────
paymentAggregatorApp.post('/topup', async (c) => {
  try {
    const authHeader = c.req.header('Authorization') ?? '';
    const { data: { user }, error: authError } = await createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    ).auth.getUser();
    if (authError || !user) return c.json({ error: 'Unauthorized' }, 401);

    const { network, amount } = await c.req.json();
    if (!network || !amount || amount <= 0) return c.json({ error: 'Missing network or amount' }, 400);

    const wallet = await kv.get(`wallet:${user.id}`);
    const phone = (wallet as Record<string, string>)?.phone ?? '';

    const reference = `GO-TOP-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const result = await processTopUp(getDb(), {
      userId: user.id, type: 'topup', network, amount,
      currency: 'TZS', phone, reference, description: 'Wallet top-up',
    });

    if (result.success && result.demo) {
      const existing = (await kv.get(`wallet:${user.id}`) as { balance: number } | null) ?? { balance: 0 };
      await kv.set(`wallet:${user.id}`, { ...existing, balance: existing.balance + amount });
      await getDb().from('transactions').update({ status: 'completed' }).eq('provider_ref', result.providerRef);
    }

    return c.json(result, result.success ? 200 : 400);
  } catch (e: unknown) {
    console.error('topup error:', e);
    return c.json({ error: 'Internal error' }, 500);
  }
});

// ── B2C Withdrawal ────────────────────────────────────────────
paymentAggregatorApp.post('/withdraw', async (c) => {
  try {
    const authHeader = c.req.header('Authorization') ?? '';
    const { data: { user }, error: authError } = await createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    ).auth.getUser();
    if (authError || !user) return c.json({ error: 'Unauthorized' }, 401);

    const { network, amount, phone } = await c.req.json();
    if (!network || !amount || !phone) return c.json({ error: 'Missing fields' }, 400);

    const newBalance = await kv.atomicDebit(`wallet:${user.id}`, amount);
    if (newBalance === null) return c.json({ error: 'Salio halitosha' }, 400);

    const reference = `GO-WD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const result = await processWithdrawal(getDb(), {
      userId: user.id, type: 'withdrawal', network, amount,
      currency: 'TZS', phone, reference, description: 'Wallet withdrawal',
    }, newBalance + amount);

    return c.json(result, result.success ? 200 : 400);
  } catch (e: unknown) {
    console.error('withdraw error:', e);
    return c.json({ error: 'Internal error' }, 500);
  }
});

// ── P2P External Send ─────────────────────────────────────────
paymentAggregatorApp.post('/send-external', async (c) => {
  try {
    const authHeader = c.req.header('Authorization') ?? '';
    const { data: { user }, error: authError } = await createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    ).auth.getUser();
    if (authError || !user) return c.json({ error: 'Unauthorized' }, 401);

    const { network, amount, phone } = await c.req.json();
    if (!network || !amount || !phone) return c.json({ error: 'Missing fields' }, 400);

    const newBalance = await kv.atomicDebit(`wallet:${user.id}`, amount);
    if (newBalance === null) return c.json({ error: 'Salio halitosha' }, 400);

    const reference = `GO-EXT-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const result = await processExternalSend(getDb(), {
      userId: user.id, type: 'p2p_send', network, amount,
      currency: 'TZS', phone, reference, description: 'External transfer',
    }, newBalance + amount);

    return c.json(result, result.success ? 200 : 400);
  } catch (e: unknown) {
    console.error('send-external error:', e);
    return c.json({ error: 'Internal error' }, 500);
  }
});

// ── Webhooks ──────────────────────────────────────────────────
paymentAggregatorApp.post('/webhook/:provider', async (c) => {
  const provider = c.req.param('provider');
  const rawBody = await c.req.text();
  const db = getDb();

  if (provider === 'selcom') {
    const sig = c.req.header('Digest') ?? '';
    const secret = Deno.env.get('SELCOM_WEBHOOK_SECRET') ?? '';
    if (!secret) return c.json({ error: 'Webhook not configured' }, 401);
    const res = await handleSelcomWebhook(rawBody, sig, secret, db, kv);
    return c.json(res.body, res.status as 200 | 400 | 401 | 500);
  }

  if (provider === 'flutterwave') {
    const verifHash = c.req.header('verif-hash') ?? '';
    const storedHash = Deno.env.get('FLUTTERWAVE_WEBHOOK_HASH') ?? '';
    const res = await handleFlutterwaveWebhook(rawBody, verifHash, storedHash, db, kv);
    return c.json(res.body, res.status as 200 | 400 | 401 | 500);
  }

  return c.json({ error: 'Unknown provider' }, 400);
});

export default paymentAggregatorApp;