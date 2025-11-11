# 📧 Admin Email Configuration - ag@experrt.com

## ✅ What Was Updated

I've configured **ag@experrt.com** to receive ALL admin notifications for:
- ✅ New bookings
- ✅ All leads (CPD, education, contact forms)
- ✅ Salon referrals
- ✅ AI chat leads
- ✅ Daily activity digest

---

## 🔧 Environment Variable Setup

### For Production (Vercel)

Go to: **Vercel Dashboard → Settings → Environment Variables**

**Update or add**:
```bash
ADMIN_EMAIL=ag@experrt.com
```

This will ensure ALL admin notifications go to the owner's email.

### For Local Testing (`.env.local`)

```bash
ADMIN_EMAIL=ag@experrt.com
RESEND_API_KEY=re_2L24mR8o_HZYkJXemBmBLfp9KEQqiCY9j
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Then restart your dev server:
```bash
npm run dev
```

---

## 📧 What ag@experrt.com Will Receive

### Immediate Notifications (🔴 High Priority)

**1. [NEW BOOKING] Alerts**
- Triggered: When someone completes a booking via your system
- Contains: Client details, service, date/time, price, notes
- From: `hello@lukeroberthair.com`
- Subject: `[NEW BOOKING] John Doe - Women's Haircut`

**2. [CPD ENQUIRY] Alerts**
- Triggered: CPD partnership enquiry or AI chat lead
- Contains: Institution, contact details, requirements
- From: `hello@lukeroberthair.com`
- Subject: `[CPD ENQUIRY] Manchester College - Jane Smith`

**3. [SALON REFERRAL] Alerts**
- Triggered: Someone starts booking at partner salon
- Contains: Which salon, client details, service interest
- From: `hello@lukeroberthair.com`
- Subject: `[SALON REFERRAL] Urban Sanctuary - John Doe`

**4. [AI CHAT LEAD] Alerts**
- Triggered: AI assistant captures CPD lead
- Contains: Institution, conversation summary, extracted info
- From: `hello@lukeroberthair.com`
- Subject: `[AI CHAT LEAD] CPD Partnership - Jane Smith`

### Daily Digest (🟡 Lower Priority)

**Sent at 5pm GMT Daily**
- Contact form submissions (last 24h)
- Education enquiries (last 24h)
- Lead activities (email opens, clicks)
- Summary statistics
- Subject: `Daily Activity Summary - Monday, 11 November 2025 (X items)`

---

## 🔍 Partner Salon Booking Flow (Important!)

### What Happens When Someone Books via Partner Salon

**Example: User clicks "Urban Sanctuary" or "Fixx Salon"**

1. **Capture Form Appears**
   - User fills in: name, email, phone, service interest, preferred date
   - This is OUR form to capture the lead

2. **Emails Sent** (Immediately)
   - ✅ **User receives**: Referral confirmation email
     - Subject: "Connecting you to Urban Sanctuary!"
     - Contains: Salon details, next steps
     - From: `hello@lukeroberthair.com`
   
   - ✅ **Admin (ag@experrt.com) receives**: Salon referral alert
     - Subject: "[SALON REFERRAL] Urban Sanctuary - John Doe"
     - Contains: Client details, which salon, service interest

3. **Redirect to External Booking**
   - User is automatically redirected to the salon's booking system
   - They complete their ACTUAL booking on the salon's site
   - **Note**: We don't control their booking system, so we can't send confirmation for that

4. **What You Won't Get** (This is expected!)
   - ❌ Booking confirmation from the external salon (they use their own system)
   - ❌ We can't track if they complete the booking on the external site

### What This Means

**You WILL receive**:
- ✅ Lead capture notification when they START the booking process
- ✅ All their contact details
- ✅ Which salon they're interested in
- ✅ Their service interest and preferred date

**You WON'T receive**:
- ❌ Confirmation that they completed booking on the external salon's site
- ❌ Final booking details from the external system

**This is intentional** - we capture the lead and refer them, but the actual booking happens on their system.

---

## ✅ Internal Bookings (Your Own System)

**When someone books via "The Salon By Altin Ltd"** (your direct booking):

**User receives**:
- ✅ Full booking confirmation email
- Contains: All details, date/time, price, deposit info

**Admin (ag@experrt.com) receives**:
- ✅ [NEW BOOKING] alert with all details
- This is a REAL booking in your system

---

## 🧪 Testing

### Test 1: Partner Salon Referral

```bash
1. Go to: http://localhost:3000/book (or production URL)
2. Click "Urban Sanctuary" or "Fixx Salon"
3. Fill form with YOUR email
4. Submit

Expected Results:
- ✅ You get referral confirmation email
- ✅ ag@experrt.com gets [SALON REFERRAL] alert
- ✅ You're redirected to salon's booking site
```

### Test 2: Internal Booking

```bash
1. Go to: http://localhost:3000/book
2. Click "The Salon By Altin Ltd"
3. Fill booking form with YOUR email
4. Submit

Expected Results:
- ✅ You get booking confirmation email
- ✅ ag@experrt.com gets [NEW BOOKING] alert
```

### Test 3: CPD Enquiry

```bash
1. Go to: http://localhost:3000/cpd-partnerships
2. Fill form with YOUR email
3. Submit

Expected Results:
- ✅ You get CPD acknowledgment email
- ✅ ag@experrt.com gets [CPD ENQUIRY] alert
```

---

## 🔧 Troubleshooting: "Not Receiving Emails"

### If User Emails Not Arriving

**Check 1: Resend Dashboard**
```
1. Go to: https://resend.com/emails
2. Check if email was sent
3. Check delivery status
4. View email content
```

**Check 2: Spam Folder**
```
- Check user's spam/junk folder
- With verified domain, should be rare
```

**Check 3: Server Logs**
```
Look for these log messages:
✅ "Confirmation email sent"
✅ "Acknowledgment email sent to user"
⚠️ "Email send failed (non-fatal)"
```

**Check 4: Database Email Logs**
```sql
SELECT * FROM email_logs 
WHERE to_email = 'user@example.com'
ORDER BY created_at DESC 
LIMIT 10;
```

### If Admin Emails Not Arriving at ag@experrt.com

**Check 1: Environment Variable**
```bash
# In Vercel Dashboard → Settings → Environment Variables
# Make sure this is set:
ADMIN_EMAIL=ag@experrt.com
```

**Check 2: Redeploy**
```
After setting env variable, redeploy the application
```

**Check 3: Spam Folder**
```
Check spam folder at ag@experrt.com
```

**Check 4: Test Manually**
```bash
# Test admin notification directly
curl -X POST https://your-site.com/api/test-admin-email
```

---

## 📊 Email Delivery Statistics

Check these regularly:

**Resend Dashboard**: https://resend.com/emails
- Total sent
- Delivery rate
- Open rate
- Bounce rate
- Spam complaints

**Database Query**:
```sql
-- Email stats for last 7 days
SELECT 
  status,
  COUNT(*) as count
FROM email_logs 
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY status;

-- Check if admin emails are being sent
SELECT 
  created_at,
  to_email,
  subject,
  status
FROM email_logs 
WHERE to_email = 'ag@experrt.com'
ORDER BY created_at DESC 
LIMIT 20;
```

---

## 🚨 Common Issues & Solutions

### Issue 1: "Booked via partner salon but no email"

**Expected Behavior**:
- ✅ You SHOULD get referral confirmation email
- ✅ Admin SHOULD get [SALON REFERRAL] alert
- ❌ You WON'T get booking confirmation (external system)

**If not receiving referral confirmation**:
1. Check spam folder
2. Check Resend dashboard
3. Check server logs for errors
4. Verify RESEND_API_KEY is set correctly

### Issue 2: "Admin not receiving any emails"

**Solution**:
1. Set `ADMIN_EMAIL=ag@experrt.com` in Vercel
2. Redeploy application
3. Test with a booking
4. Check spam folder at ag@experrt.com

### Issue 3: "Emails going to spam"

**Should NOT happen** with verified domain, but if it does:
1. Check sender reputation in Resend dashboard
2. Verify DNS records (SPF, DKIM, DMARC)
3. Warm up domain by sending gradually
4. Ask recipients to mark as "Not Spam"

---

## ✅ Deployment Checklist

Before deploying:

- [x] Code updated: `ADMIN_EMAIL` default = `ag@experrt.com`
- [ ] Vercel env variable: `ADMIN_EMAIL=ag@experrt.com`
- [ ] Vercel env variable: `RESEND_API_KEY=re_2L24mR8o_...`
- [ ] Deploy to production
- [ ] Test partner salon referral
- [ ] Test internal booking
- [ ] Test CPD enquiry
- [ ] Verify ag@experrt.com receives all admin emails
- [ ] Check spam folder (should be empty)

---

## 📧 Expected Daily Email Volume to ag@experrt.com

**Immediate Alerts** (as they happen):
- 5 bookings/day = 5 [NEW BOOKING] emails
- 2 CPD enquiries/day = 2 [CPD ENQUIRY] emails
- 3 salon referrals/day = 3 [SALON REFERRAL] emails
- **Total immediate**: ~10 emails/day

**Daily Digest** (5pm GMT):
- 1 summary email with all contact forms, education enquiries, activities
- **Total**: 1 email/day

**Grand Total**: ~11 admin emails per day to ag@experrt.com

---

## 📞 Quick Reference

```bash
# Admin Email
ag@experrt.com

# What They Receive
- [NEW BOOKING] alerts (immediate)
- [CPD ENQUIRY] alerts (immediate)
- [SALON REFERRAL] alerts (immediate)
- [AI CHAT LEAD] alerts (immediate)
- Daily Activity Digest (5pm GMT)

# All emails from
hello@lukeroberthair.com

# Set in Vercel
ADMIN_EMAIL=ag@experrt.com
```

---

**Status**: ✅ Configured and ready to deploy!

**Next Step**: Set the environment variable in Vercel and redeploy.

