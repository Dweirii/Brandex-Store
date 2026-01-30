# Database & Subscription Naming Guide

## ⚠️ CRITICAL: Database Naming Conventions

### Subscription Plan Tiers (Database Column: `planTier`)

The system uses the following **exact** naming for plan tiers. These MUST match in both frontend and backend:

```typescript
'FREE' | 'STARTER' | 'PRO'
```

**DO NOT USE:**
- ❌ `BASIC` (use `FREE` instead)
- ❌ `PREMIUM` (use `STARTER` instead)
- ❌ `PREMIUM_PRO` or `PREMIUM-PRO` (use `PRO` instead)
- ❌ Any other variations

### Database Schema Requirements

#### Subscription Table

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  userId TEXT NOT NULL,
  storeId UUID NOT NULL,
  
  -- CRITICAL: planTier must be one of: 'FREE', 'STARTER', 'PRO'
  planTier TEXT NOT NULL DEFAULT 'FREE',
  
  -- Stripe fields
  stripeSubscriptionId TEXT,
  stripeCustomerId TEXT,
  stripePriceId TEXT,
  
  -- Subscription status
  status TEXT NOT NULL, -- 'ACTIVE', 'TRIALING', 'CANCELED', 'PAST_DUE', etc.
  cancelAtPeriodEnd BOOLEAN DEFAULT false,
  
  -- Dates
  currentPeriodStart TIMESTAMP,
  currentPeriodEnd TIMESTAMP,
  trialStart TIMESTAMP,
  trialEnd TIMESTAMP,
  
  -- Credit limits (NULL = unlimited)
  monthlyDownloadLimit INTEGER,
  
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

#### Download History Table

```sql
CREATE TABLE download_history (
  id UUID PRIMARY KEY,
  userId TEXT NOT NULL,
  storeId UUID NOT NULL,
  productId UUID NOT NULL,
  
  -- Product info at time of download
  productName TEXT,
  categoryId UUID,
  categoryName TEXT,
  price DECIMAL(10,2),
  isFree BOOLEAN,
  
  -- Image for display
  imageUrl TEXT,
  
  createdAt TIMESTAMP DEFAULT NOW(),
  
  -- Index for fast lookups
  INDEX idx_user_product (userId, productId),
  INDEX idx_user_store (userId, storeId),
  INDEX idx_created (createdAt DESC)
);
```

---

## Plan Tier Configuration

### FREE Plan
```typescript
{
  planTier: 'FREE',
  monthlyDownloadLimit: null, // No premium downloads
  price: 0,
  features: [
    'Unlimited free downloads',
    'Access to full product library',
    'No credits included'
  ]
}
```

### STARTER Plan (Premium)
```typescript
{
  planTier: 'STARTER',
  monthlyDownloadLimit: 50, // 50 credits per month
  price: 4.99,
  stripePriceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_MONTHLY_PRICE_ID,
  features: [
    '50 credits per month',
    'Unlimited free downloads',
    'Use credits to unlock premium downloads'
  ]
}
```

### PRO Plan (Premium Pro)
```typescript
{
  planTier: 'PRO',
  monthlyDownloadLimit: null, // NULL = unlimited
  price: 9.99,
  stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID,
  features: [
    'Unlimited credits',
    'Unlimited free downloads',
    'Priority access and support'
  ]
}
```

---

## API Endpoints & Expected Responses

### 1. Get Subscription Status
```http
GET /api/{storeId}/subscription/status
Authorization: Bearer {token}
```

**Expected Response:**
```json
{
  "hasSubscription": true,
  "isActive": true,
  "subscription": {
    "id": "uuid",
    "status": "ACTIVE",
    "statusDescription": "Active subscription",
    "daysRemaining": 25,
    "currentPeriodStart": "2026-01-01T00:00:00Z",
    "currentPeriodEnd": "2026-02-01T00:00:00Z",
    "trialStart": null,
    "trialEnd": null,
    "cancelAtPeriodEnd": false,
    "stripeSubscriptionId": "sub_xxx",
    "stripeCustomerId": "cus_xxx",
    "planTier": "STARTER", // ⚠️ MUST be 'FREE', 'STARTER', or 'PRO'
    "monthlyDownloadLimit": 50,
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z",
    "store": {
      "id": "uuid",
      "name": "Brandex"
    }
  }
}
```

### 2. Get Download History & Stats
```http
GET /api/{storeId}/downloads
Authorization: Bearer {token}
```

**Expected Response:**
```json
{
  "downloads": [
    {
      "id": "uuid",
      "productId": "uuid",
      "productName": "Product Name",
      "categoryId": "uuid",
      "categoryName": "Category",
      "storeId": "uuid",
      "isFree": false,
      "price": 19.99,
      "imageUrl": "https://...",
      "createdAt": "2026-01-15T10:30:00Z"
    }
  ],
  "monthlyStats": {
    "count": 15, // Downloads this month
    "limit": 50, // Monthly limit (null = unlimited)
    "remaining": 35 // Credits remaining (null = unlimited)
  },
  "planTier": "STARTER" // ⚠️ MUST be 'FREE', 'STARTER', or 'PRO'
}
```

### 3. Download Product
```http
GET /api/{storeId}/products/{productId}/download
Authorization: Bearer {token}
```

**Success Response:** File stream with headers
```
Content-Disposition: attachment; filename="..."
Content-Type: application/zip
```

**Error Responses:**

**403 - No Credits / No Subscription:**
```json
{
  "error": "You need a Premium subscription to download this product. Subscribe to Premium or Premium Pro to unlock premium downloads."
}
```

**403 - No Credits Remaining (STARTER):**
```json
{
  "error": "You've used all 50 credits this month. Upgrade to Premium Pro for unlimited credits or wait until next month."
}
```

---

## Subscription Management Features

### ✅ Currently Implemented

1. **Cancel Subscription**
   - User can cancel at any time
   - Access continues until end of billing period
   - `cancelAtPeriodEnd` set to `true`

2. **Resume Subscription**
   - User can resume a canceled subscription before period ends
   - `cancelAtPeriodEnd` set back to `false`

3. **Upgrade from STARTER to PRO**
   - Instant upgrade via Stripe
   - Prorated billing
   - Immediate access to unlimited credits

4. **View Subscription Details**
   - Current plan tier
   - Renewal date
   - Cancellation status
   - Trial information

### Subscription Status Flow

```
FREE (no subscription)
  ↓ Subscribe to Premium
STARTER (50 credits/month)
  ↓ Upgrade to Premium Pro
PRO (unlimited credits)
  ↓ Cancel
STARTER/PRO (cancelAtPeriodEnd = true)
  ↓ Resume
STARTER/PRO (active again)
  ↓ End of period (if canceled)
FREE
```

---

## Frontend Display Names vs Database Values

### Display Names (User-Facing)
- **"Basic"** → Shows for FREE tier
- **"Premium"** → Shows for STARTER tier
- **"Premium Pro"** → Shows for PRO tier

### Database Values (Internal)
- **`FREE`** → Basic plan
- **`STARTER`** → Premium plan
- **`PRO`** → Premium Pro plan

**Example Mapping:**
```typescript
const displayName = {
  'FREE': 'Basic',
  'STARTER': 'Premium',
  'PRO': 'Premium Pro'
}[planTier]
```

---

## Button State Logic Summary

### For Premium Products:

1. **User has ALREADY downloaded**
   - Button: "Download Now" ✅
   - Action: Re-download (no credit used)

2. **User is PRO (active subscription)**
   - Button: "Unlock with 1 Credit" ✅
   - Action: Use 1 credit and download
   - Note: "unlimited credits" shown

3. **User is STARTER with credits remaining**
   - Button: "Unlock with 1 Credit" ✅
   - Action: Use 1 credit and download
   - Shows: "X Credits Available"

4. **User is STARTER with NO credits**
   - Button: "Upgrade to Premium Pro" ⬆️
   - Action: Open upgrade modal
   - Message: Upgrade for unlimited

5. **User is FREE (no subscription)**
   - Button: "Upgrade to Unlock" ⬆️
   - Action: Open plans modal
   - Message: Subscribe to a plan

### For Free Products:
- **Everyone:** "Free Download" button ✅

---

## Testing Checklist

### Database Checks
- [ ] `planTier` column uses only: 'FREE', 'STARTER', 'PRO'
- [ ] `monthlyDownloadLimit` is NULL for FREE and PRO
- [ ] `monthlyDownloadLimit` is 50 for STARTER
- [ ] Download history tracks all downloads with timestamps
- [ ] Monthly stats calculation resets on 1st of month

### Subscription States
- [ ] FREE user sees "Upgrade to Unlock" on premium products
- [ ] STARTER user with credits sees "Unlock with 1 Credit"
- [ ] STARTER user without credits sees "Upgrade to Premium Pro"
- [ ] PRO user ALWAYS sees "Unlock with 1 Credit" (never upgrade)
- [ ] All users can re-download previously downloaded products

### Subscription Management
- [ ] Users can cancel subscription
- [ ] Users can resume canceled subscription
- [ ] STARTER users can upgrade to PRO
- [ ] PRO users NEVER see downgrade/upgrade options
- [ ] Subscription modal shows correct plan tier
- [ ] Cancellation preserves access until period end

---

## Common Issues & Solutions

### Issue: User sees "Upgrade" despite having subscription

**Cause:** Database `planTier` not set correctly

**Solution:**
```sql
-- Check current value
SELECT userId, planTier, status FROM subscriptions WHERE userId = '{userId}';

-- Fix if wrong
UPDATE subscriptions 
SET planTier = 'STARTER' -- or 'PRO'
WHERE userId = '{userId}' AND stripeSubscriptionId IS NOT NULL;
```

### Issue: PRO users see credit count instead of "unlimited"

**Cause:** `monthlyDownloadLimit` not NULL

**Solution:**
```sql
-- PRO users should have NULL limit (unlimited)
UPDATE subscriptions 
SET monthlyDownloadLimit = NULL 
WHERE planTier = 'PRO';
```

### Issue: Credits not resetting monthly

**Cause:** Monthly stats calculation not properly implemented

**Solution:** Implement server-side job to reset on 1st of month, or calculate dynamically:
```typescript
// Get downloads in current month
const currentMonth = new Date().getMonth()
const currentYear = new Date().getFullYear()

const monthlyDownloads = await db.downloadHistory.count({
  where: {
    userId: userId,
    isFree: false, // Only count premium downloads
    createdAt: {
      gte: new Date(currentYear, currentMonth, 1),
      lt: new Date(currentYear, currentMonth + 1, 1)
    }
  }
})

const limit = subscription.monthlyDownloadLimit // 50 for STARTER, null for PRO
const remaining = limit ? Math.max(0, limit - monthlyDownloads) : null
```

---

## Environment Variables Required

```bash
# Store
NEXT_PUBLIC_DEFAULT_STORE_ID="{your-store-id}"

# API
NEXT_PUBLIC_API_URL="https://admin.wibimax.com/api/{your-store-id}"

# Stripe Price IDs
NEXT_PUBLIC_STRIPE_STARTER_MONTHLY_PRICE_ID="price_xxx" # $4.99/month
NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID="price_xxx"     # $9.99/month

# Stripe Keys (backend)
STRIPE_SECRET_KEY="sk_live_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"
```

---

## Migration Script (If Needed)

If you need to migrate existing subscriptions to new naming:

```sql
-- Backup first!
CREATE TABLE subscriptions_backup AS SELECT * FROM subscriptions;

-- Update plan tiers
UPDATE subscriptions 
SET planTier = CASE
  WHEN planTier IN ('BASIC', 'basic') THEN 'FREE'
  WHEN planTier IN ('PREMIUM', 'premium', 'STARTER', 'starter') THEN 'STARTER'
  WHEN planTier IN ('PREMIUM_PRO', 'premium_pro', 'PRO', 'pro') THEN 'PRO'
  ELSE 'FREE'
END;

-- Set correct download limits
UPDATE subscriptions SET monthlyDownloadLimit = NULL WHERE planTier = 'FREE';
UPDATE subscriptions SET monthlyDownloadLimit = 50 WHERE planTier = 'STARTER';
UPDATE subscriptions SET monthlyDownloadLimit = NULL WHERE planTier = 'PRO';

-- Verify
SELECT planTier, COUNT(*), AVG(monthlyDownloadLimit) 
FROM subscriptions 
GROUP BY planTier;
```

---

## Support & Troubleshooting

For issues with subscriptions:
1. Check database `planTier` matches expected values
2. Verify Stripe webhook is configured correctly
3. Check API responses match expected format
4. Review user's download history for edge cases
5. Test subscription management flows (cancel/resume/upgrade)

**Contact:** team@brandexme.com  
**Phone:** +1-855-404-2726
