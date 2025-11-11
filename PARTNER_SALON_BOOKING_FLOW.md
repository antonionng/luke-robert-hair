# 🏪 Partner Salon Booking Flow Explained

## Understanding What Happens When You Book via Partner Salons

### The Two Types of Bookings

#### 1️⃣ **Internal Booking** (The Salon By Altin Ltd)
- ✅ Full booking in YOUR system
- ✅ Complete booking confirmation email sent
- ✅ Admin gets [NEW BOOKING] alert
- ✅ Booking stored in YOUR database
- ✅ You control the entire process

#### 2️⃣ **Partner Salon Referral** (Urban Sanctuary, Fixx Salon)
- ⚠️ Lead capture ONLY
- ✅ Referral confirmation email sent
- ✅ Admin gets [SALON REFERRAL] alert
- ⚠️ Then redirects to THEIR booking system
- ⚠️ You DON'T control their booking process

---

## 📋 What You Experienced (Partner Salon)

### Step-by-Step: What Happened

**You Clicked**: "Urban Sanctuary" or "Fixx Salon"

**Step 1 - Lead Capture Form Appeared** ✅
```
Our form asking for:
- Name
- Email
- Phone
- Service interest
- Preferred date
```

**Step 2 - You Submitted the Form** ✅
```
This captured you as a LEAD in our system
```

**Step 3 - Two Emails Were Sent** ✅ (Should have happened)

**Email 1 - To You (The Customer)**:
```
Subject: "Connecting you to Urban Sanctuary!"
From: hello@lukeroberthair.com
Contains:
- Confirmation that we've saved your details
- Salon contact information
- Service interest & preferred date
- Next steps
```

**Email 2 - To Admin (ag@experrt.com)**:
```
Subject: "[SALON REFERRAL] Urban Sanctuary - Your Name"
From: hello@lukeroberthair.com
Contains:
- Your contact details
- Which salon you chose
- Service interest
- Preferred date
```

**Step 4 - Redirect to External Site** ✅
```
You were automatically redirected to:
- Urban Sanctuary: https://urbansanctuary.org.uk/book-online/
- OR Fixx Salon: https://phorest.com/book/salons/fixxsalonsltd

This is THEIR booking system (not ours)
```

**Step 5 - Complete Booking on Their Site** ⚠️
```
This is where you ACTUALLY book the appointment
They use their own system
We have NO control over this
```

---

## ❓ Why Didn't You Get a "Booking Confirmation"?

### The Answer

You **SHOULD** have received a **"Referral Confirmation"** email from us, but you **WON'T** receive a "Booking Confirmation" from us because:

1. **We don't control the external salon's booking system**
   - Urban Sanctuary and Fixx Salon use their own systems
   - We can't send booking confirmations for their bookings
   - They should send their own confirmation (from their system)

2. **What we DO send**:
   - ✅ Referral confirmation (to you)
   - ✅ Admin alert (to ag@experrt.com)
   - These confirm we captured your details and referred you

3. **What we DON'T send**:
   - ❌ Booking confirmation for external salon appointments
   - ❌ We don't know if you completed the booking on their site
   - ❌ We don't receive data back from their systems

---

## 🔍 Troubleshooting: "I Didn't Get the Referral Email"

### If You Didn't Receive ANY Email

**Possible Causes**:

1. **Email in Spam Folder**
   - Check your spam/junk folder
   - Look for emails from `hello@lukeroberthair.com`

2. **Email System Issue**
   - Check Resend dashboard: https://resend.com/emails
   - Look for the email to your address
   - Check delivery status

3. **API Key Not Updated**
   - If still using old test API key
   - Won't send from verified domain
   - May have deliverability issues

4. **Email Address Typo**
   - Double-check the email you entered in the form
   - Check database for the lead

### How to Check

**Check 1: Resend Dashboard**
```
1. Go to: https://resend.com/emails
2. Search for your email address
3. Check if "Referral Confirmation" was sent
4. View delivery status
```

**Check 2: Database**
```sql
-- Check if your lead was captured
SELECT * FROM leads 
WHERE email = 'your-email@example.com'
ORDER BY created_at DESC;

-- Check if email was logged
SELECT * FROM email_logs 
WHERE to_email = 'your-email@example.com'
AND template_name = 'salon_referral_confirmation'
ORDER BY created_at DESC;
```

**Check 3: Server Logs**
```
Look for these messages:
✅ "Confirmation email sent"
✅ "Admin notification sent for salon referral"
⚠️ "Email send failed (non-fatal)"
```

---

## ✅ What SHOULD Happen (Correct Flow)

### For Partner Salon Bookings

**What You (Customer) Should Get**:
1. ✅ **Immediate**: Referral confirmation email
   - Subject: "Connecting you to [Salon Name]!"
   - From: `hello@lukeroberthair.com`
   - Contains: Salon details, your preferences

2. ⚠️ **Later**: Booking confirmation from the SALON
   - This comes from THEIR system
   - From: Their email address
   - Only if you complete booking on their site

**What Admin (ag@experrt.com) Should Get**:
1. ✅ **Immediate**: [SALON REFERRAL] alert
   - Subject: "[SALON REFERRAL] [Salon] - [Your Name]"
   - From: `hello@lukeroberthair.com`
   - Contains: All your details, which salon, preferences

2. 📊 **Daily**: If no referrals, nothing extra in digest

---

## 🔧 Fix: Ensure Emails Are Sent

### Update Environment Variables

**In Vercel Dashboard**:
```bash
# Required
RESEND_API_KEY=re_2L24mR8o_HZYkJXemBmBLfp9KEQqiCY9j

# Admin email (owner notifications)
ADMIN_EMAIL=ag@experrt.com

# Base URL
NEXT_PUBLIC_BASE_URL=https://lukeroberthair.com
```

### Redeploy

```bash
git add .
git commit -m "Update admin email to ag@experrt.com"
git push origin main
```

### Test Again

```bash
1. Go to: https://lukeroberthair.com/book
2. Click "Urban Sanctuary"
3. Fill form with YOUR email
4. Submit
5. Check inbox for referral confirmation
6. Check ag@experrt.com for admin alert
7. Check spam folders if not in inbox
```

---

## 📧 Email Templates Reference

### Referral Confirmation (To Customer)

**Subject**: "Connecting you to Urban Sanctuary!"

**Content**:
- Thank you message
- Salon details (name, address, phone)
- Your service interest
- Your preferred date
- Next steps (complete booking on their site)
- Contact information

### Admin Alert (To ag@experrt.com)

**Subject**: "[SALON REFERRAL] Urban Sanctuary - John Doe"

**Content**:
- Lead capture confirmation
- Customer contact details (name, email, phone)
- Which salon they chose
- Service interest
- Preferred date
- Link to admin dashboard

---

## 🎯 Key Takeaways

### What You Need to Know

1. **Partner Salon Bookings = Lead Capture + Referral**
   - We capture the lead
   - We send confirmation emails
   - We redirect to their booking system
   - They handle the actual booking

2. **You WILL Receive**:
   - ✅ Referral confirmation email (from us)
   - ✅ Lead captured in our database
   - ✅ Admin notification (to ag@experrt.com)

3. **You WON'T Receive** (from us):
   - ❌ Booking confirmation for external salon
   - ❌ Updates from their booking system
   - (But the SALON should send their own confirmation)

4. **This Is Intentional**:
   - We don't control external booking systems
   - We focus on lead capture and referral
   - The salon handles their own confirmations

---

## 🚀 Next Steps

1. **Update Vercel Environment Variables**
   ```bash
   ADMIN_EMAIL=ag@experrt.com
   RESEND_API_KEY=re_2L24mR8o_HZYkJXemBmBLfp9KEQqiCY9j
   ```

2. **Redeploy Application**

3. **Test Complete Flow**:
   - Internal booking (The Salon By Altin) → Full confirmation ✅
   - Partner salon (Urban Sanctuary) → Referral confirmation ✅
   - CPD enquiry → Acknowledgment + admin alert ✅

4. **Verify ag@experrt.com Receives**:
   - All [NEW BOOKING] alerts
   - All [SALON REFERRAL] alerts
   - All [CPD ENQUIRY] alerts
   - Daily digest at 5pm

---

## 📞 Support

**If emails still not arriving**:
1. Check spam folders
2. Review Resend dashboard
3. Check environment variables
4. Review server logs
5. Check database email_logs table

**Contact**:
- Resend Support: support@resend.com
- Resend Dashboard: https://resend.com/emails
- Documentation: See `ADMIN_EMAIL_SETUP.md`

---

**Status**: System configured correctly. Just need to set environment variable and redeploy!

