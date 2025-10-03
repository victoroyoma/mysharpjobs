# Payment Integration Guide - MySharpJob

## Overview

This guide walks you through integrating Paystack and Flutterwave payment gateways into MySharpJob. The codebase is already prepared for payment processing - you just need to add your API keys and configure webhooks.

## Supported Payment Gateways

### 1. Paystack (Primary - Nigeria focused)
- **Best for**: Nigerian users paying in NGN
- **Fees**: 1.5% with NGN 2,000 cap
- **Supported Currencies**: NGN, USD, GHS, KES, ZAR
- **Website**: https://paystack.com

### 2. Flutterwave (Alternative - Multi-country)
- **Best for**: Multi-country payments across Africa
- **Fees**: 1.4% 
- **Supported Currencies**: NGN, USD, GHS, KES, UGX, ZAR, and more
- **Website**: https://flutterwave.com

## Quick Setup (5 minutes)

### Step 1: Get API Keys

#### Paystack:
1. Create account at https://dashboard.paystack.com/signup
2. Navigate to **Settings** > **API Keys & Webhooks**
3. Copy your **Test Public Key** (starts with `pk_test_`)
4. Copy your **Test Secret Key** (starts with `sk_test_`)
5. Generate a **Webhook Secret** (under Webhooks section)

#### Flutterwave:
1. Create account at https://dashboard.flutterwave.com/signup
2. Navigate to **Settings** > **API Keys**
3. Copy your **Test Public Key** (starts with `FLWPUBK_TEST-`)
4. Copy your **Test Secret Key** (starts with `FLWSECK_TEST-`)
5. Copy your **Encryption Key** (starts with `FLWSECK_TEST`)
6. Generate a **Webhook Hash** (under Webhooks section)

### Step 2: Update Environment Variables

Open `backend/.env` and replace the placeholder values:

```env
# Paystack Configuration
PAYSTACK_PUBLIC_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
PAYSTACK_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY_HERE
PAYSTACK_WEBHOOK_SECRET=your_webhook_secret_here

# Flutterwave Configuration
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-YOUR_ACTUAL_KEY_HERE
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-YOUR_ACTUAL_KEY_HERE
FLUTTERWAVE_ENCRYPTION_KEY=FLWSECK_TEST-your_encryption_key
FLUTTERWAVE_WEBHOOK_SECRET=your_webhook_hash_here

# Payment Configuration
PAYMENT_CURRENCY=NGN
PLATFORM_FEE_PERCENTAGE=0.10
ESCROW_RELEASE_DELAY_DAYS=7
```

### Step 3: Configure Webhooks

Webhooks notify your application when payments are completed.

#### For Local Testing (using ngrok):
1. Install ngrok: https://ngrok.com/download
2. Run your Laravel app: `php artisan serve`
3. In another terminal: `ngrok http 8000`
4. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

#### Paystack Webhook Setup:
1. Go to **Settings** > **API Keys & Webhooks**
2. Add webhook URL: `https://your-domain.com/api/webhooks/paystack`
3. For testing: `https://abc123.ngrok.io/api/webhooks/paystack`
4. Save changes

#### Flutterwave Webhook Setup:
1. Go to **Settings** > **Webhooks**
2. Add webhook URL: `https://your-domain.com/api/webhooks/flutterwave`
3. For testing: `https://abc123.ngrok.io/api/webhooks/flutterwave`
4. Copy the **Webhook Hash** and add to `.env`

### Step 4: Test the Integration

Clear Laravel cache:
```bash
cd backend
php artisan config:clear
php artisan cache:clear
```

Start development servers:
```bash
# Terminal 1: Backend
cd backend
php artisan serve

# Terminal 2: Frontend  
npm run dev

# Terminal 3: Ngrok (for webhooks)
ngrok http 8000
```

## Testing Payment Flow

### Test Cards

#### Paystack Test Cards:
- **Successful Payment**: 
  - Card: `4084084084084081`
  - CVV: `408`
  - Expiry: Any future date
  - PIN: `0000`
  - OTP: `123456`

- **Declined Payment**:
  - Card: `4084084084084084`
  - CVV: `408`
  - Expiry: Any future date

#### Flutterwave Test Cards:
- **Successful Payment**:
  - Card: `5531886652142950`
  - CVV: `564`
  - Expiry: `09/32`
  - PIN: `3310`
  - OTP: `12345`

- **Insufficient Funds**:
  - Card: `5531886652142950`
  - CVV: `564`
  - Expiry: `09/32`
  - PIN: `3310`
  - OTP: `54321`

### Test Workflow:

1. **Create a Job**:
   - Login as client
   - Create new job posting
   - Set budget (e.g., NGN 50,000)

2. **Accept Application**:
   - Artisan applies to job
   - Client accepts application
   - Job status changes to "open"

3. **Initialize Payment**:
   - Client navigates to job payment page
   - Selects payment method (Paystack or Flutterwave)
   - Clicks "Pay Now"
   - Redirected to payment gateway

4. **Complete Payment**:
   - Use test card details above
   - Enter OTP/PIN as prompted
   - Redirected back to platform

5. **Verify Payment**:
   - Payment status changes to "completed"
   - Funds held in escrow (status: "held")
   - Job status changes to "in-progress"

6. **Release Escrow** (after 7 days or manual release):
   - Escrow status changes to "released"
   - Funds available for payout to artisan

## Architecture Overview

### Backend Structure

```
backend/
├── app/
│   ├── Services/
│   │   ├── PaystackService.php    # Paystack API integration
│   │   └── FlutterwaveService.php # Flutterwave API integration
│   ├── Http/Controllers/
│   │   ├── PaymentController.php  # Payment endpoints
│   │   └── WebhookController.php  # Webhook handlers
│   └── Models/
│       └── Payment.php             # Payment database model
├── config/
│   └── payment.php                 # Payment configuration
└── routes/
    └── api.php                     # API routes
```

### Payment Flow Diagram

```
Client → Initialize Payment → Payment Gateway → Webhook → Update Status → Release Escrow
   ↓            ↓                     ↓              ↓           ↓              ↓
 Select     Create Payment      Enter Card    Verify Payment  Escrow Held  Funds Released
 Gateway      Record            Details        Signature                    to Artisan
```

### Database Schema

**payments table**:
- `id` - Primary key
- `job_id` - Foreign key to jobs
- `client_id` - Foreign key to users (client)
- `artisan_id` - Foreign key to users (artisan)
- `amount` - Payment amount
- `currency` - Payment currency (NGN, USD, etc.)
- `status` - Payment status (pending, completed, failed)
- `payment_method` - Gateway used (paystack, flutterwave)
- `gateway_reference` - Unique payment reference
- `gateway_response` - JSON response from gateway
- `escrow_status` - Escrow status (pending, held, released)
- `fees` - JSON with platform and gateway fees
- `metadata` - Additional payment data

## API Endpoints

### Initialize Payment
```http
POST /api/payments/initialize
Authorization: Bearer {token}

{
  "job_id": 1,
  "amount": 50000,
  "currency": "NGN",
  "payment_method": "paystack",
  "callback_url": "https://mysharpjobs.ng/payment/callback"
}

Response:
{
  "status": "success",
  "data": {
    "payment_id": 123,
    "reference": "MSJOB_ABC123_1234567890",
    "authorization_url": "https://checkout.paystack.com/xyz",
    "access_code": "abc123"
  }
}
```

### Verify Payment
```http
POST /api/payments/verify/{reference}
Authorization: Bearer {token}

Response:
{
  "status": "success",
  "message": "Payment verified successfully",
  "data": {
    "id": 123,
    "status": "completed",
    "escrow_status": "held",
    "amount": 50000,
    "fees": {
      "platform_fee": 5000,
      "gateway_fee": 750
    }
  }
}
```

### Release Escrow
```http
POST /api/payments/{id}/release
Authorization: Bearer {token}

Response:
{
  "status": "success",
  "message": "Payment released from escrow"
}
```

### List Payments
```http
GET /api/payments
Authorization: Bearer {token}

Response:
{
  "status": "success",
  "data": [...]
}
```

## Fee Structure

### Platform Fee
- **Default**: 10% of transaction amount
- **Configurable**: Set in `.env` via `PLATFORM_FEE_PERCENTAGE`
- **Example**: NGN 50,000 job = NGN 5,000 platform fee

### Gateway Fees

#### Paystack:
- **Rate**: 1.5%
- **Cap**: NGN 2,000 maximum
- **Example**: NGN 50,000 = NGN 750 fee

#### Flutterwave:
- **Rate**: 1.4%
- **No cap**
- **Example**: NGN 50,000 = NGN 700 fee

### Total Cost Example:
Job Amount: NGN 50,000
- Platform Fee (10%): NGN 5,000
- Paystack Fee (1.5%): NGN 750
- **Client Pays**: NGN 55,750
- **Artisan Receives**: NGN 45,000 (after platform cut)

## Escrow System

### How It Works:
1. **Payment Completed**: Funds held in escrow (status: "held")
2. **Holding Period**: 7 days by default (configurable)
3. **Auto-Release**: After holding period, funds auto-released
4. **Manual Release**: Client can release early after job completion
5. **Dispute**: Either party can raise dispute to freeze escrow

### Configuration:
```env
ESCROW_RELEASE_DELAY_DAYS=7  # Days to hold payment
```

### Escrow Status Flow:
```
pending → held → released
              ↓
           disputed (if dispute raised)
```

## Security Best Practices

### 1. Webhook Signature Verification
- ✅ **Already Implemented**: All webhooks verify signatures
- **Paystack**: HMAC SHA512 signature verification
- **Flutterwave**: HMAC SHA256 hash verification

### 2. API Key Security
- ❌ **Never commit API keys** to Git
- ✅ **Use environment variables** (.env file)
- ✅ **Rotate keys regularly** in production
- ✅ **Use different keys** for test/production

### 3. HTTPS Only
- ✅ **Production**: Always use HTTPS
- ✅ **Webhooks**: Require HTTPS endpoints
- ⚠️ **Development**: OK to use HTTP locally

### 4. Rate Limiting
- Implement rate limiting on payment endpoints
- Prevent brute force attacks on verification

## Production Deployment Checklist

### Before Going Live:

- [ ] **Switch to Live Keys**
  - [ ] Update Paystack keys to `pk_live_` and `sk_live_`
  - [ ] Update Flutterwave keys to `FLWPUBK-` and `FLWSECK-`
  - [ ] Generate new webhook secrets

- [ ] **Configure Production Webhooks**
  - [ ] Add production webhook URLs
  - [ ] Test webhook delivery
  - [ ] Monitor webhook logs

- [ ] **Security**
  - [ ] Enable HTTPS on domain
  - [ ] Set `APP_ENV=production` in `.env`
  - [ ] Set `APP_DEBUG=false`
  - [ ] Clear all caches: `php artisan optimize:clear`

- [ ] **Database**
  - [ ] Run migrations: `php artisan migrate`
  - [ ] Backup database regularly
  - [ ] Set up escrow auto-release cron job

- [ ] **Testing**
  - [ ] Test end-to-end payment flow
  - [ ] Test webhook delivery
  - [ ] Test escrow release
  - [ ] Test dispute handling

- [ ] **Monitoring**
  - [ ] Set up payment success/failure alerts
  - [ ] Monitor webhook delivery rates
  - [ ] Track failed transactions
  - [ ] Monitor escrow releases

### Cron Job Setup (Escrow Auto-Release)

Add to Laravel Scheduler in `app/Console/Kernel.php`:

```php
protected function schedule(Schedule $schedule)
{
    // Auto-release escrow after holding period
    $schedule->command('payments:release-escrow')->daily();
}
```

Create artisan command:
```bash
php artisan make:command ReleaseEscrowPayments
```

## Troubleshooting

### Payment Initialization Fails
- **Check**: API keys are correct in `.env`
- **Check**: Config cache is clear: `php artisan config:clear`
- **Check**: Currency is supported by gateway
- **Check**: Amount meets minimum requirements

### Webhook Not Received
- **Check**: Webhook URL is accessible publicly
- **Check**: HTTPS is enabled (for production)
- **Check**: Webhook secret matches in `.env`
- **Check**: Gateway dashboard shows webhook delivery attempts

### Payment Verified But Status Not Updated
- **Check**: Webhook signature verification passes
- **Check**: Laravel logs: `storage/logs/laravel.log`
- **Check**: Payment reference matches database record

### Escrow Not Releasing
- **Check**: Escrow release delay has passed
- **Check**: Cron job is running: `php artisan schedule:run`
- **Check**: Payment status is "completed"
- **Check**: No active disputes on payment

## Support & Resources

### Paystack:
- Documentation: https://paystack.com/docs
- Support: support@paystack.com
- Dashboard: https://dashboard.paystack.com

### Flutterwave:
- Documentation: https://developer.flutterwave.com/docs
- Support: developers@flutterwavego.com  
- Dashboard: https://dashboard.flutterwave.com

### MySharpJob:
- API Documentation: See `API_DOCUMENTATION.md`
- Backend Code: `backend/app/Services/*Service.php`
- Frontend Code: `src/pages/Client/PaymentPage.tsx`

## Next Steps

1. ✅ Get API keys from Paystack/Flutterwave
2. ✅ Update `.env` with your keys
3. ✅ Test with sandbox cards
4. ✅ Configure webhooks with ngrok
5. ✅ Verify escrow system works
6. ⏱️ Switch to live keys when ready

---

**Need help?** Check the logs in `storage/logs/laravel.log` for detailed error messages.
