# Testing Guide - Credit-Based Subscription System

## Quick Reference: Button States by User Type

### Free Product Testing
| User Type | Expected Button | Action |
|-----------|----------------|--------|
| FREE user | "Free Download" | Downloads immediately |
| STARTER user | "Free Download" | Downloads immediately |
| PRO user | "Free Download" | Downloads immediately |

### Premium Product Testing (Never Downloaded)
| User Type | Credits Available | Expected Button | Action |
|-----------|------------------|-----------------|--------|
| FREE user | N/A | "Upgrade to Unlock" | Opens plans modal |
| STARTER user | Yes (1-50) | "Unlock with 1 Credit" | Downloads & uses 1 credit |
| STARTER user | No (0) | "Upgrade to Premium Pro" | Opens plans page |
| PRO user | Unlimited | "Unlock with 1 Credit" | Downloads immediately |

### Premium Product Testing (Already Downloaded)
| User Type | Expected Button | Action |
|-----------|----------------|--------|
| All users | "Download Now" | Re-downloads (no credit used) |

---

## Step-by-Step Testing Scenarios

### Scenario 1: FREE User Journey

1. **Browse free products**
   - ✅ Should see "Free Download" button
   - ✅ Can download immediately

2. **Browse premium products**
   - ✅ Should see "Upgrade to Unlock" button
   - ✅ Shows "Premium" badge
   - ✅ Helper text: "Subscribe to a plan to unlock premium downloads"

3. **Click upgrade button**
   - ✅ Opens plans modal OR redirects to /premium
   - ✅ Shows all 3 plans: Basic ($0), Premium ($4.99), Premium Pro ($9.99)

4. **Subscribe to Premium (STARTER)**
   - ✅ Redirects to Stripe checkout
   - ✅ After payment, returns with success
   - ✅ Subscription activated
   - ✅ Plan tier updates to STARTER

5. **After subscription**
   - ✅ Premium products now show "Unlock with 1 Credit"
   - ✅ Badge shows "X Credits Available"
   - ✅ Can download premium products

---

### Scenario 2: STARTER User (Premium Plan)

1. **User has 50 credits at start of month**
   - ✅ Premium products show "Unlock with 1 Credit"
   - ✅ Badge shows "50 Credits Available"

2. **Download a premium product**
   - ✅ Credit deducted (49 remaining)
   - ✅ Product added to download history
   - ✅ Badge updates to "49 Credits Available"

3. **Re-download the same product**
   - ✅ Button changes to "Download Now"
   - ✅ No credit deducted
   - ✅ Still has 49 credits

4. **Use all 50 credits**
   - ✅ Premium products show "Upgrade to Premium Pro"
   - ✅ Badge shows "No Credits Remaining"
   - ✅ Helper text: "You've used all your credits this month. Upgrade to Premium Pro for unlimited access."

5. **Previously downloaded products**
   - ✅ Can still re-download (button shows "Download Now")
   - ✅ No credit required for re-downloads

6. **Click upgrade button**
   - ✅ Redirects to /premium page
   - ✅ Shows upgrade path to Premium Pro
   - ✅ "Upgrade to Premium Pro" button visible

---

### Scenario 3: PRO User (Premium Pro Plan)

1. **Browse premium products (never downloaded)**
   - ✅ Shows "Unlock with 1 Credit" button
   - ✅ Badge shows "Unlimited Access"
   - ✅ Helper text: "Unlock with 1 credit (you have unlimited credits)"

2. **Download premium products**
   - ✅ Downloads immediately
   - ✅ No limit on downloads
   - ✅ Badge always shows "Unlimited Access"

3. **Check plans page**
   - ✅ Current plan shows "Premium Pro" with "Current" badge
   - ✅ NO upgrade buttons (already highest tier)
   - ✅ Only "Manage Plan" button visible

4. **Open subscription modal**
   - ✅ Shows "Active" status
   - ✅ Displays "Premium Pro" plan
   - ✅ NO upgrade options shown
   - ✅ Only cancel/manage options

5. **Premium modal behavior**
   - ❌ Should NEVER see "Upgrade to Unlock"
   - ❌ Should NEVER see upgrade prompts
   - ✅ If opened, shows "You're on Premium Pro!" message
   - ✅ Shows "Continue Browsing" button

---

## Subscription Management Testing

### Test 1: Cancel Subscription

1. **Open subscription modal** (`/downloads` page or from menu)
2. **Click "Cancel Subscription"** (or "Downgrade / Cancel" for PRO)
3. **Confirm cancellation**
4. **Verify:**
   - ✅ Success message appears
   - ✅ Modal shows "Your subscription will cancel at end of period"
   - ✅ Access remains until end date
   - ✅ "Resume Subscription" button appears

### Test 2: Resume Subscription

1. **After canceling, click "Resume Subscription"**
2. **Verify:**
   - ✅ Success message appears
   - ✅ `cancelAtPeriodEnd` set to false
   - ✅ Renewal date shown
   - ✅ Full access restored

### Test 3: Upgrade from STARTER to PRO

1. **As STARTER user, visit /premium**
2. **Click "Upgrade to Premium Pro"**
3. **Complete Stripe checkout** (or instant upgrade if configured)
4. **Verify:**
   - ✅ Plan tier updates to PRO
   - ✅ Unlimited credits shown
   - ✅ "Unlimited Access" badge appears
   - ✅ Can download unlimited premium products
   - ✅ NO MORE upgrade prompts

### Test 4: View Subscription Details

1. **Open subscription modal**
2. **Verify displays:**
   - ✅ Current plan tier (Premium or Premium Pro)
   - ✅ Next renewal date
   - ✅ Cancellation status (if applicable)
   - ✅ Trial information (if in trial)
   - ✅ "View All Plans" link

---

## Database Verification

### Check User's Subscription

```sql
SELECT 
  userId,
  planTier,
  status,
  monthlyDownloadLimit,
  cancelAtPeriodEnd,
  currentPeriodEnd,
  stripeSubscriptionId
FROM subscriptions 
WHERE userId = '{user-id}';
```

**Expected Results:**
- FREE: `planTier = 'FREE'`, `monthlyDownloadLimit = NULL`
- STARTER: `planTier = 'STARTER'`, `monthlyDownloadLimit = 50`
- PRO: `planTier = 'PRO'`, `monthlyDownloadLimit = NULL`

### Check Download History

```sql
SELECT 
  productId,
  productName,
  isFree,
  createdAt
FROM download_history 
WHERE userId = '{user-id}'
ORDER BY createdAt DESC;
```

### Check Monthly Usage

```sql
SELECT 
  COUNT(*) as downloads_this_month
FROM download_history 
WHERE userId = '{user-id}'
  AND isFree = false
  AND createdAt >= DATE_TRUNC('month', CURRENT_DATE);
```

---

## Console Debugging

Open browser console (F12) and look for these logs:

### Subscription Check
```
[useProductAccess] Subscription status: { tier: 'STARTER', isActive: true }
[useProductAccess] Credits remaining: 45
```

### Download Check
```
[useProductAccess] Product downloaded: false
[useProductAccess] STARTER user - has credits: true
```

### PRO User
```
[useProductAccess] PRO user - unlimited credits
```

---

## Common Issues & Fixes

### Issue 1: PRO user sees "Upgrade to Unlock"
**Symptom:** PRO users see upgrade button instead of download button

**Debug:**
1. Check console for `[useProductAccess]` logs
2. Verify API response from `/subscription/status`
3. Check database `planTier` value

**Fix:**
```sql
-- Verify user's plan tier
SELECT planTier FROM subscriptions WHERE userId = '{user-id}';

-- Should be 'PRO', if not, update:
UPDATE subscriptions 
SET planTier = 'PRO', monthlyDownloadLimit = NULL 
WHERE userId = '{user-id}';
```

### Issue 2: STARTER user with credits sees upgrade button
**Symptom:** User has credits but sees "Upgrade to Unlock"

**Debug:**
1. Check `/downloads` API response for `monthlyStats`
2. Verify `remaining` count
3. Check console logs

**Fix:**
- Ensure `/downloads` endpoint returns `monthlyStats.remaining`
- Verify credits calculation is correct
- Check that `planTier` in response matches database

### Issue 3: User can't re-download previously downloaded products
**Symptom:** "Upgrade to Unlock" shows for already-downloaded products

**Debug:**
1. Check download history includes product
2. Verify `productId` matches exactly
3. Check `hasDownloaded` in console logs

**Fix:**
- Ensure download history is being checked correctly
- Verify `productId` format (UUID vs string)

### Issue 4: Credits not resetting monthly
**Symptom:** User still shows 0 credits after month rollover

**Debug:**
1. Check current date vs last download date
2. Verify month calculation in backend
3. Check `monthlyStats` calculation

**Fix:**
- Implement proper monthly reset logic
- Calculate dynamically based on current month
- Consider time zone handling

---

## API Testing with cURL

### Get Subscription Status
```bash
curl -X GET "https://admin.wibimax.com/api/{storeId}/subscription/status" \
  -H "Authorization: Bearer {token}"
```

### Get Downloads & Stats
```bash
curl -X GET "https://admin.wibimax.com/api/{storeId}/downloads" \
  -H "Authorization: Bearer {token}"
```

### Download Product
```bash
curl -X GET "https://admin.wibimax.com/api/{storeId}/products/{productId}/download" \
  -H "Authorization: Bearer {token}" \
  --output "product.zip"
```

---

## Browser Testing Checklist

### Desktop Chrome/Edge
- [ ] Free product downloads work
- [ ] Premium product buttons show correctly
- [ ] Subscription modal opens and functions
- [ ] Stripe checkout redirects work
- [ ] Download progress shows
- [ ] Re-downloads work without using credits

### Mobile Safari/Chrome
- [ ] Touch interactions work
- [ ] Modals display correctly
- [ ] Subscription management accessible
- [ ] Download buttons tap correctly
- [ ] Redirects work properly

### Dark Mode
- [ ] All badges readable
- [ ] Button states visible
- [ ] Modal content clear
- [ ] Credit counts visible

---

## Performance Checks

### API Calls
- [ ] Subscription status cached (not called repeatedly)
- [ ] Download check only when needed
- [ ] No excessive refresh calls
- [ ] Proper loading states shown

### User Experience
- [ ] No flash of wrong button state
- [ ] Smooth transitions between states
- [ ] Clear feedback on actions
- [ ] Fast product page loads

---

## Automated Test Cases (Future)

```typescript
describe('Product Access', () => {
  test('FREE user sees upgrade button on premium products', () => {
    // Test implementation
  })
  
  test('STARTER user with credits can download premium products', () => {
    // Test implementation
  })
  
  test('PRO user never sees upgrade messages', () => {
    // Test implementation
  })
  
  test('Users can re-download without using credits', () => {
    // Test implementation
  })
})
```

---

## Support Information

**For testing issues or bugs:**
- Email: team@brandexme.com
- Phone: +1-855-404-2726
- Documentation: See `IMPLEMENTATION_SUMMARY.md` and `DATABASE_SUBSCRIPTION_GUIDE.md`
