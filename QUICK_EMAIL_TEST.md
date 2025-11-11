# 🧪 Quick Email Notification Test Guide

## Setup (One Time Only)

Add to `.env.local`:
```bash
ADMIN_EMAIL=your-test-email@example.com  # Use YOUR email to receive admin notifications
RESEND_API_KEY=re_DeQCjR62_9ZRLn3FRuDV2eCpnh9uRHMWD
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Restart dev server:
```bash
npm run dev
```

---

## Test Scenarios

### ✅ Test 1: New Booking (2 emails)
1. Go to: http://localhost:3000/book
2. Choose "The Salon By Altin Ltd"
3. Fill in booking form with YOUR email
4. Submit

**Expected**:
- ✉️ **You (as client)**: Booking confirmation with all details
- ✉️ **You (as admin)**: [NEW BOOKING] alert with client info

---

### ✅ Test 2: CPD Enquiry (2 emails)
1. Go to: http://localhost:3000/cpd-partnerships
2. Scroll to form
3. Fill in institution, job title, YOUR email
4. Submit

**Expected**:
- ✉️ **You (as client)**: "Thank you for CPD enquiry" acknowledgment
- ✉️ **You (as admin)**: [CPD ENQUIRY] alert with institution details

---

### ✅ Test 3: Salon Referral (2 emails)
1. Go to: http://localhost:3000/book
2. Choose "Urban Sanctuary" or "Fixx Salon"
3. Fill in form with YOUR email
4. Submit

**Expected**:
- ✉️ **You (as client)**: Referral confirmation with salon details
- ✉️ **You (as admin)**: [SALON REFERRAL] alert

---

### ✅ Test 4: Contact Form (1 email now, 1 in digest)
1. Go to: http://localhost:3000/contact
2. Fill in form with YOUR email
3. Submit

**Expected**:
- ✉️ **You (as client)**: "Thanks for reaching out" acknowledgment
- 📊 **Admin**: Will appear in daily digest at 5pm

---

### ✅ Test 5: Manual Digest Trigger
```bash
curl -X POST http://localhost:3000/api/cron/daily-digest
```

**Expected**:
- ✉️ **You (as admin)**: Daily summary of contact forms, education enquiries, activities from last 24h

---

## Quick Verification

After each test:

1. **Check your inbox** (use YOUR email as ADMIN_EMAIL)
2. **Check Resend dashboard**: https://resend.com/emails
3. **Check admin panel**: http://localhost:3000/admin
4. **Check console logs** for ✅ success messages

---

## What You Should See

### Admin Alert Email Example:
```
Subject: [NEW BOOKING] John Doe - Women's Haircut
From: Luke Robert Hair <onboarding@resend.dev>
To: your-test-email@example.com

🎉 NEW BOOKING
Client: John Doe
Email: john@example.com
Phone: 07123456789
Service: Women's Haircut
Location: The Salon By Altin Ltd
Date: Monday, 15 November 2025
Time: 14:00
Price: £85.00
```

### User Confirmation Email Example:
```
Subject: Booking confirmed: Women's Haircut on Monday, 15 November 2025
From: Luke Robert Hair <onboarding@resend.dev>
To: john@example.com

Your booking is confirmed

Hi John,
Looking forward to seeing you. Here are your booking details:
...
```

---

## Troubleshooting

**No emails arriving?**
- Check spam folder
- Verify `ADMIN_EMAIL` is set correctly in `.env.local`
- Check terminal for ✅ or ⚠️ log messages
- Visit Resend dashboard to see if emails were sent

**Admin not receiving emails?**
- Double-check `ADMIN_EMAIL` value
- Restart dev server after changing `.env.local`

**User not receiving emails?**
- Check the email address you entered in forms
- Check spam folder
- View in Resend dashboard

---

## 🎯 Expected Results Summary

| Event Type | User Email | Admin Email | When |
|------------|------------|-------------|------|
| New Booking | ✅ Immediate | ✅ Immediate | On submit |
| CPD Enquiry | ✅ Immediate | ✅ Immediate | On submit |
| Salon Referral | ✅ Immediate | ✅ Immediate | On submit |
| Contact Form | ✅ Immediate | 📊 Digest (5pm) | On submit |
| Education Enquiry | ✅ Immediate | 📊 Digest (5pm) | On submit |
| AI Chat Lead | ✅ Immediate | ✅ Immediate | On chat complete |

---

**All tests passing?** ✅ System is fully functional!

