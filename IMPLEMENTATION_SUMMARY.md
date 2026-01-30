# Brandex Store - Credit-Based Subscription System Implementation

## Overview
Implemented a new credit-based subscription system with dynamic button states on product pages. The system replaces individual product purchases with subscription tiers that provide credits for unlocking premium content.

## Implementation Date
January 30, 2026

---

## 1. Pricing Plans Structure

### Basic Plan (FREE)
- **Price**: $0/month
- **Features**:
  - Unlimited free downloads
  - Access to the full product library
  - No credits included

### Premium Plan (STARTER)
- **Price**: $4.99/month
- **Features**:
  - 50 credits per month
  - Unlimited free downloads
  - Use credits to unlock premium downloads
  - Credits reset every month
  - Unused credits do not roll over

### Premium Pro Plan (PRO)
- **Price**: $9.99/month
- **Features**:
  - Unlimited credits
  - Unlimited free downloads
  - Priority access and support
  - No monthly limits

---

## 2. Credit System Rules

- **1 premium download = 1 credit**
- Credits reset at the beginning of each month
- Unused credits do NOT roll over to the next month
- FREE plan users have no credits
- STARTER plan users get 50 credits/month
- PRO plan users have unlimited credits

---

## 3. Dynamic Button States on Product Pages

The button text and behavior changes based on product type, user subscription, and download history:

### Button State Logic:

1. **Free Product** → **"Free Download"**
   - Icon: Download
   - Action: Direct download
   - Available to all users

2. **Premium Product + User Already Downloaded** → **"Download Now"**
   - Icon: Download
   - Action: Re-download (no credit used)
   - Shows user already has access

3. **Premium Product + User Has Credits** → **"Unlock with 1 Credit"**
   - Icon: Unlock
   - Action: Use 1 credit and download
   - Available to STARTER (with credits remaining) and PRO users

4. **Premium Product + User Has No Credits** → **"Upgrade to Unlock"**
   - Icon: Sparkles
   - Action: Open upgrade modal
   - Shows for FREE users or STARTER users who've exhausted credits

---

## 4. Files Created/Modified

### Created Files:

1. **`/hooks/use-product-access.ts`**
   - New hook to check if user has downloaded a product
   - Fetches user's credit information
   - Determines button state based on product and user status

### Modified Files:

1. **`/components/info.tsx`**
   - Removed price display with Currency component
   - Added Premium badge for paid products
   - Integrated dynamic button logic using `useProductAccess` hook
   - Shows credit availability for subscribed users
   - Displays helper text explaining credit usage

2. **`/components/ui/download-button.tsx`**
   - Added `customText` prop for custom button text
   - Added `customIcon` prop for custom button icon
   - Maintains all existing download functionality

3. **`/app/(routes)/compare/page.tsx`**
   - Removed price display with Currency component
   - Replaced with Free/Premium badge system
   - Added Crown icon for premium products

4. **`/components/footer.tsx`**
   - Updated support phone number to international format: +1-855-404-2726

---

## 5. Dollar Sign Removal

As per requirements, dollar signs ($) are now **ONLY** shown on the pricing/plans page (`/premium`). All other pages display:
- "Free" badges for free products
- "Premium" badges for paid products
- No currency symbols or prices

### Areas Updated:
- ✅ Product detail pages (info.tsx)
- ✅ Product cards (already using badges)
- ✅ Compare page (replaced price with Free/Premium badges)
- ✅ Premium page retains dollar signs (as intended)

---

## 6. How the System Works

### For Free Products:
1. User clicks product
2. Sees "Free Download" button
3. Downloads immediately (no credits used)

### For Premium Products:

#### Scenario A: User Already Downloaded
1. User clicks product
2. System checks download history
3. Shows "Download Now" button
4. User can re-download without using another credit

#### Scenario B: User Has Credits
1. User clicks product
2. System checks subscription and credits
3. Shows "Unlock with 1 Credit" button
4. User clicks to unlock and download
5. 1 credit is deducted from monthly allowance
6. Product added to download history

#### Scenario C: User Has No Credits
1. User clicks product
2. System detects no credits available
3. Shows "Upgrade to Unlock" button
4. Clicking opens subscription modal with plan options

---

## 7. API Integration Points

The system integrates with existing API endpoints:

- **`GET /api/{storeId}/downloads`**
  - Returns user's download history
  - Returns monthly stats (count, limit, remaining)
  - Returns plan tier (FREE, STARTER, PRO)

- **`GET /api/{storeId}/products/{productId}/download`**
  - Handles actual download with credit validation
  - Returns 403 if user lacks credits/subscription
  - Tracks download in user's history

- **`GET /api/{storeId}/subscription/status`**
  - Returns user's subscription status
  - Returns plan tier and active status

---

## 8. User Experience Flow

### First-Time User (FREE Plan):
1. Browse products
2. Can download all free products
3. Cannot download premium products
4. Sees "Upgrade to Unlock" on premium products
5. Can upgrade to Premium or Premium Pro

### Premium User (STARTER - 50 credits):
1. Browse products
2. Can download all free products
3. Can unlock 50 premium products per month
4. Sees "Unlock with 1 Credit" on premium products
5. Sees credit count in product page
6. After using all credits, sees "Upgrade to Unlock" (to go Pro)
7. Can re-download previously unlocked products

### Premium Pro User (PRO - Unlimited):
1. Browse products
2. Can download all free products
3. Can unlock unlimited premium products
4. Sees "Unlock with 1 Credit" on premium products (but credits are unlimited)
5. Can re-download previously unlocked products
6. Priority support access

---

## 9. Testing Checklist

### Product Page Button States:
- [ ] Free product shows "Free Download" button
- [ ] Premium product (never downloaded, FREE user) shows "Upgrade to Unlock"
- [ ] Premium product (never downloaded, STARTER with credits) shows "Unlock with 1 Credit"
- [ ] Premium product (never downloaded, STARTER no credits) shows "Upgrade to Unlock"
- [ ] Premium product (never downloaded, PRO user) shows "Unlock with 1 Credit"
- [ ] Premium product (already downloaded) shows "Download Now" for all users

### Credit System:
- [ ] STARTER plan shows correct credit count (X/50 remaining)
- [ ] PRO plan shows "Unlimited Access"
- [ ] Downloading premium product deducts 1 credit for STARTER users
- [ ] Re-downloading doesn't deduct additional credits
- [ ] FREE users see "Subscribe to unlock premium downloads"

### Plans Page:
- [ ] Shows dollar signs ($) correctly
- [ ] Basic plan: $0
- [ ] Premium plan: $4.99/month
- [ ] Premium Pro plan: $9.99/month
- [ ] Current plan is highlighted
- [ ] Upgrade buttons work correctly

### Other Pages:
- [ ] No dollar signs on product pages
- [ ] No dollar signs on compare page
- [ ] Free/Premium badges display correctly
- [ ] Downloads page shows credit usage for STARTER plan

---

## 10. Environment Variables

Current pricing configuration in `.env`:

```bash
# Premium Plan (STARTER)
NEXT_PUBLIC_STRIPE_STARTER_MONTHLY_PRICE_ID="price_1SpRhEDeJjBMfCBPHri2WHdr"
NEXT_PUBLIC_STARTER_PLAN_PRICE="4.99"

# Premium Pro Plan (PRO)
NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID="price_1SpRfVDeJjBMfCBPoprpixfX"
NEXT_PUBLIC_PRO_MONTHLY_PRICE="9.99"
```

---

## 11. Future Enhancements (Not Implemented)

Potential improvements for consideration:
- Credit rollover option for annual subscriptions
- Credit purchase packs for one-time credits
- Team/Business plans with shared credit pools
- Credit gift cards
- Analytics dashboard for credit usage patterns

---

## 12. Known Limitations

1. Cart system still exists but is not integrated with new credit system
2. Old "purchase" flow may need to be deprecated
3. Credit history/transaction log not yet implemented
4. No notification when credits are about to run out

---

## Contact

For questions or issues with this implementation, please contact the development team.

**Support**: +1-855-404-2726  
**Email**: team@brandexme.com
