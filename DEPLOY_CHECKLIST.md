# 🚀 Production Deployment Checklist

## ✅ What Was Updated

### Email Configuration
- ✅ Updated `FROM_EMAIL` to use `hello@lukeroberthair.com`
- ✅ Updated `REPLY_TO_EMAIL` to use `hello@lukeroberthair.com`
- ✅ Updated `ADMIN_EMAIL` default to `hello@lukeroberthair.com`
- ✅ All email templates now use verified domain
- ✅ Code is production-ready with proper fallbacks

### Domain Information
- **Domain**: `lukeroberthair.com` ✅ Verified
- **API Key**: `re_2L24mR8o_HZYkJXemBmBLfp9KEQqiCY9j` (production)
- **From Address**: `Luke Robert Hair <hello@lukeroberthair.com>`

---

## 📋 Deployment Steps

### 1. Update Vercel Environment Variables

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

**Add/Update these variables**:

```bash
# Required - Update this!
RESEND_API_KEY=re_2L24mR8o_HZYkJXemBmBLfp9KEQqiCY9j

# Optional - Set if you want admin emails to go to a different address
ADMIN_EMAIL=your-personal-email@example.com

# Required
NEXT_PUBLIC_BASE_URL=https://lukeroberthair.com
```

**Important**: Make sure to set these for **Production** environment (and optionally Preview if you want to test).

### 2. Deploy Code

The code has been updated. Deploy to production:

**Option A - Automatic (if connected to GitHub)**:
```bash
git add .
git commit -m "Update email configuration to use verified domain"
git push origin main
```
Vercel will auto-deploy.

**Option B - Manual Deploy**:
- Go to Vercel Dashboard
- Click "Redeploy" on latest deployment
- Select "Production"

### 3. Test in Production

After deployment (wait ~2 minutes), test:

**Quick Test**:
1. Visit: `https://lukeroberthair.com/book`
2. Submit a test booking with YOUR email
3. Check inbox for 2 emails from `hello@lukeroberthair.com`:
   - ✉️ Booking confirmation (to you as customer)
   - ✉️ [NEW BOOKING] alert (to admin email)

**Expected Email Headers**:
```
From: Luke Robert Hair <hello@lukeroberthair.com>
Reply-To: hello@lukeroberthair.com
```

**NOT**:
```
From: onboarding@resend.dev  ❌
```

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Emails arrive from `hello@lukeroberthair.com` (not resend.dev)
- [ ] Booking confirmation email received
- [ ] Admin alert email received
- [ ] Emails not in spam folder
- [ ] Reply-to address is correct
- [ ] Email templates look good
- [ ] Links in emails work
- [ ] Mobile display looks good

---

## 🎯 What to Monitor

### First 24 Hours

1. **Resend Dashboard**: https://resend.com/emails
   - Check delivery rates
   - Monitor bounce rates
   - Watch for spam reports

2. **Test Each Flow**:
   - [ ] New booking → 2 emails sent
   - [ ] CPD enquiry → 2 emails sent
   - [ ] Contact form → 1 email sent
   - [ ] Salon referral → 2 emails sent

3. **Check Admin Digest**:
   - Wait for 5pm GMT
   - Should receive daily summary
   - Or manually trigger: `curl -X POST https://lukeroberthair.com/api/cron/daily-digest`

### Ongoing Monitoring

- **Weekly**: Check email delivery rates in Resend
- **Monthly**: Review email logs in database
- **When issues**: Check Vercel logs + Resend dashboard

---

## 🔧 Troubleshooting

### Emails Still From resend.dev?

**Cause**: Environment variable not updated in Vercel

**Fix**:
1. Go to Vercel → Settings → Environment Variables
2. Update `RESEND_API_KEY` to new value
3. Redeploy

### Emails Going to Spam?

**Should NOT happen** with verified domain, but if it does:

1. Check DNS records in Resend dashboard
2. Verify DKIM is set up correctly
3. Check SPF record
4. Warm up domain (send gradually increasing volume)

### Admin Not Receiving Emails?

**Fix**:
1. Check `ADMIN_EMAIL` in Vercel env variables
2. Check spam folder
3. Verify email address is correct
4. Check Resend dashboard for delivery status

### Rate Limit Exceeded?

**Free Tier**: 100 emails/day, 3000/month

**Solutions**:
1. Upgrade Resend plan
2. Reduce non-essential emails
3. Batch notifications

---

## 📊 Email Volume Estimate

**Per Booking**: ~4-6 emails
- 1 user confirmation
- 1 admin alert
- 1 reminder (24h before)
- 1-3 referral emails (if applicable)

**Per CPD Enquiry**: ~2 emails
- 1 user acknowledgment
- 1 admin alert

**Per Contact Form**: ~1-2 emails
- 1 user acknowledgment
- Included in daily digest

**Daily Digest**: 1 email
- Sent at 5pm GMT every day

**Estimate**:
- 5 bookings/day = ~25 emails
- 2 CPD enquiries/day = ~4 emails
- 3 contact forms/day = ~3 emails
- 1 daily digest = ~1 email
- **Total**: ~33 emails/day (within free tier)

---

## 🎉 Success Criteria

Your email system is working correctly when:

- ✅ All emails sent from `hello@lukeroberthair.com`
- ✅ Users receive immediate confirmations
- ✅ Admin receives all alerts
- ✅ Emails land in inbox (not spam)
- ✅ Email templates look professional
- ✅ Links work correctly
- ✅ Reply-to addresses work
- ✅ No errors in logs

---

## 📞 Support

**Email Issues**:
- Resend Dashboard: https://resend.com/emails
- Resend Support: support@resend.com
- Resend Docs: https://resend.com/docs

**Code Issues**:
- Check `EMAIL_NOTIFICATIONS_COMPLETE.md`
- Review Vercel logs
- Check database email_logs table

---

## 🎯 Quick Reference

```bash
# What You Need
Domain: lukeroberthair.com (verified ✅)
API Key: re_2L24mR8o_HZYkJXemBmBLfp9KEQqiCY9j
From: hello@lukeroberthair.com

# Where to Set
Vercel → Settings → Environment Variables
- RESEND_API_KEY
- ADMIN_EMAIL (optional)
- NEXT_PUBLIC_BASE_URL

# How to Test
1. Deploy to Vercel
2. Visit /book and submit
3. Check inbox for emails from hello@lukeroberthair.com
4. Verify admin alert received
```

---

**Ready to deploy!** 🚀

Just update the Vercel environment variables and redeploy. Everything else is already configured.

