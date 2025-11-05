# 🚀 AI Backend Infrastructure - Setup Guide

## Overview

This guide will help you set up the complete AI-powered backend system including:
- ✅ Supabase database with CRM
- ✅ AI lead nurturing engine (100% personalized emails)
- ✅ Automated content generation
- ✅ Email (Resend) and SMS (Twilio) communications
- ✅ AI insights dashboard
- ✅ Vercel cron jobs for automation

## 📋 Prerequisites

- Node.js 18+
- Git
- Vercel account
- Supabase account
- OpenAI API account
- Resend account
- Twilio account (optional, for SMS)

---

## 🔧 Step 1: Environment Variables

Create a `.env.local` file in the root directory with these variables:

```bash
# OpenAI API (Required)
OPENAI_API_KEY=sk-...

# Supabase (Required)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJh...
SUPABASE_ANON_KEY=eyJh...

# Resend Email (Required)
RESEND_API_KEY=re_...
FROM_EMAIL="Luke Robert <hello@lukerobert.com>"
REPLY_TO_EMAIL=luke@lukerobert.com

# Twilio SMS (Optional but recommended)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+441234567890

# Cron Job Security (Required for production)
CRON_SECRET=your-random-secret-here

# Application URLs
NEXT_PUBLIC_BASE_URL=https://lukerobert.com

# Optional Features
DALL_E_ENABLED=true
ADMIN_PASSWORD=change-this-in-production
```

---

## 🗄️ Step 2: Supabase Setup

### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Choose a region close to your users
4. Save your database password!

### 2.2 Get API Credentials

1. Go to **Project Settings** > **API**
2. Copy:
   - `Project URL` → `SUPABASE_URL`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`
   - `anon public` key → `SUPABASE_ANON_KEY`

### 2.3 Run Database Migrations

```bash
# Install dependencies
npm install

# Run migrations
npm run migrate
```

This will create all necessary tables:
- `leads` - Education enquiries with scoring
- `lead_activities` - Complete activity timeline
- `lead_score_history` - Score change tracking
- `content_queue` - AI-generated blog posts
- `email_logs` - Email delivery tracking
- `sms_logs` - SMS delivery tracking
- `automation_queue` - Task queue for workflows
- `nurturing_sequences` - Active lead sequences
- `ai_insights` - Business intelligence insights
- `contact_preferences` - Email/SMS preferences

### 2.4 Seed Initial Data (Optional)

The migration includes 10 starter content topics. You can add more via the admin dashboard.

---

## 📧 Step 3: Resend Email Setup

### 3.1 Create Account

1. Go to [resend.com](https://resend.com) and sign up
2. Free tier: 100 emails/day (perfect for testing)

### 3.2 Add Domain

1. Go to **Domains** > **Add Domain**
2. Add `lukerobert.com` (or your domain)
3. Add DNS records provided by Resend
4. Wait for verification (5-30 minutes)

### 3.3 Create API Key

1. Go to **API Keys**
2. Create new key with full access
3. Copy to `RESEND_API_KEY`

### 3.4 Configure From Email

Set `FROM_EMAIL` to match your verified domain:
```bash
FROM_EMAIL="Luke Robert <hello@lukerobert.com>"
```

---

## 📱 Step 4: Twilio SMS Setup (Optional)

### 4.1 Create Account

1. Go to [twilio.com](https://twilio.com) and sign up
2. Verify your email and phone

### 4.2 Get Phone Number

1. Go to **Phone Numbers** > **Buy a Number**
2. Choose UK number (+44)
3. Enable SMS capability
4. Cost: ~$1/month + per-message fees

### 4.3 Get API Credentials

1. Go to **Account** > **API keys & tokens**
2. Copy:
   - `Account SID` → `TWILIO_ACCOUNT_SID`
   - `Auth Token` → `TWILIO_AUTH_TOKEN`
   - Your phone number → `TWILIO_PHONE_NUMBER`

### 4.4 Configure Webhooks

1. Go to your phone number settings
2. Set messaging webhook to:
   ```
   https://yourdomain.com/api/webhooks/twilio
   ```

---

## 🤖 Step 5: OpenAI API Setup

### 5.1 Create Account

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up and add payment method

### 5.2 Create API Key

1. Go to **API Keys**
2. Create new secret key
3. Copy to `OPENAI_API_KEY`

### 5.3 Set Usage Limits

1. Go to **Settings** > **Billing** > **Usage limits**
2. Set monthly limit (recommended: $50)
3. Enable email alerts at 50% and 90%

### 5.4 Enable Models

Ensure you have access to:
- `gpt-4o-mini` (for email generation and insights)
- `dall-e-3` (for image generation - optional)

**Estimated costs:**
- Email generation: ~$0.001 per email
- Content generation: ~$0.01 per blog post
- Insights generation: ~$0.05 per day
- **Total: $10-50/month** depending on volume

---

## ⚡ Step 6: Vercel Deployment

### 6.1 Connect Repository

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository

### 6.2 Configure Environment Variables

Add ALL environment variables from Step 1 to Vercel:
1. Go to **Settings** > **Environment Variables**
2. Add each variable
3. Select **Production**, **Preview**, and **Development**

### 6.3 Generate Cron Secret

```bash
# Generate random secret
openssl rand -base64 32
```

Add as `CRON_SECRET` in Vercel environment variables.

### 6.4 Deploy

1. Vercel will automatically build and deploy
2. Cron jobs will be scheduled automatically (from `vercel.json`)
3. Check **Deployments** > **Functions** to verify cron jobs

### 6.5 Configure Custom Domain

1. Go to **Settings** > **Domains**
2. Add your domain
3. Update DNS records
4. Update `NEXT_PUBLIC_BASE_URL` to your domain

---

## 🔄 Step 7: Verify Cron Jobs

Cron jobs are scheduled automatically. Here's the schedule:

| Job | Schedule | Purpose |
|-----|----------|---------|
| **process-queue** | Every hour | Process automation tasks |
| **generate-content** | Mon/Wed/Fri 9am | Generate blog posts |
| **check-reminders** | Daily 8am | Send booking reminders |
| **nurture-leads** | Every 6 hours | Follow up with leads |
| **generate-insights** | Daily 6am | AI business insights |

### Test Cron Jobs Manually

```bash
curl -X POST https://your-domain.com/api/cron/process-queue \
  -H "Authorization: Bearer your-cron-secret"
```

### Check Logs

1. Go to Vercel Dashboard
2. Click **Deployments** > **Functions**
3. Filter by `/api/cron/`
4. View real-time logs

---

## 📊 Step 8: Configure Admin Dashboard

### 8.1 Change Admin Password

1. Update `ADMIN_PASSWORD` in environment variables
2. Redeploy
3. **IMPORTANT:** Use a strong, unique password

### 8.2 Access Admin

1. Go to `https://your-domain.com/admin`
2. Enter password
3. You'll see:
   - **Overview** - Stats and AI insights
   - **Leads** - All education enquiries
   - **Bookings** - Salon appointments
   - **Content Queue** - AI-generated posts for review
   - **Communications** - Email/SMS logs
   - **AI Insights** - Business intelligence

---

## ✅ Step 9: Testing

### 9.1 Test Lead Creation

1. Go to `/education` on your site
2. Fill out course enquiry form
3. Check admin dashboard for new lead
4. Verify automation:
   - Lead score calculated
   - Welcome email queued
   - If score > 70: SMS queued
   - Nurturing sequence started

### 9.2 Test Email

Check email logs in admin:
- Status: sent/delivered/opened/clicked
- Open tracking works
- Click tracking works
- Unsubscribe link works

### 9.3 Test Content Generation

Manually trigger:
```bash
curl -X POST https://your-domain.com/api/cron/generate-content \
  -H "Authorization: Bearer your-cron-secret"
```

Check admin **Content Queue** tab for new post.

### 9.4 Test AI Insights

Wait 24 hours or trigger manually:
```bash
curl -X POST https://your-domain.com/api/cron/generate-insights \
  -H "Authorization: Bearer your-cron-secret"
```

Check admin **Overview** for AI recommendations.

---

## 🎯 What Happens Automatically?

Once set up, the system runs hands-off:

### When a Lead is Created:
1. ✅ Lead score calculated (0-100)
2. ✅ Lead stage set based on score
3. ✅ Nurturing sequence started:
   - **Hot (70+):** Immediate welcome email + SMS in 2h
   - **Warm (40-69):** Welcome email + follow-ups over 2 weeks
   - **Cold (0-39):** Long-term nurturing over 6 weeks
4. ✅ Preferences created (email/SMS opt-in)
5. ✅ Admin notified if hot lead

### Every Hour:
- ✅ Process automation queue (send emails, SMS, score updates)

### Every 6 Hours:
- ✅ Check leads needing follow-up
- ✅ Auto-progress lead stages
- ✅ Re-engage cold leads

### Daily at 8am:
- ✅ Send booking reminders (24h and 7 days before)

### Daily at 6am:
- ✅ Generate AI business insights
- ✅ Analyze performance data
- ✅ Create actionable recommendations

### Mon/Wed/Fri at 9am:
- ✅ Generate 1 blog post
- ✅ Queue for review in admin
- ✅ Notify admin

---

## 💰 Cost Breakdown

### Free Tier (Testing):
- Vercel: Free
- Supabase: Free (500MB DB)
- OpenAI: Pay per use (~$10)
- Resend: Free (100 emails/day)
- Twilio: ~$1-5
- **Total: ~$11-15/month**

### Production Scale:
- Vercel: $20/month (Pro)
- Supabase: $25/month (Pro)
- OpenAI: $30-50/month
- Resend: $20/month (unlimited)
- Twilio: $5-20/month
- **Total: $100-135/month**

---

## 🔒 Security Checklist

- [ ] Changed `ADMIN_PASSWORD` from default
- [ ] `CRON_SECRET` is random and secure
- [ ] All API keys are environment variables (not in code)
- [ ] Supabase RLS policies enabled
- [ ] HTTPS enabled on custom domain
- [ ] Email unsubscribe links working
- [ ] SMS opt-out handling working
- [ ] Rate limiting on API routes (TODO)

---

## 🎨 Customization for Other Clients

This system is designed to be replicated. For each new client:

1. **Clone repository**
2. **Update `/config/tenant.ts`** (create this file):
   ```typescript
   export const TENANT_CONFIG = {
     name: 'Client Name',
     brand: {
       colors: { primary: '#616F64', ... },
       fonts: { heading: 'Playfair Display', ... },
     },
     services: [...],
     voice: 'Brand voice description',
   };
   ```
3. **Update environment variables** with client's credentials
4. **Customize frontend** (components, pages, styling)
5. **Deploy to Vercel** with new domain
6. **Done!** Backend engine works identically

---

## 📞 Troubleshooting

### Cron Jobs Not Running
- Check Vercel logs
- Verify `CRON_SECRET` matches
- Ensure `vercel.json` is deployed

### Emails Not Sending
- Check Resend domain verification
- Check email logs in admin
- Verify `RESEND_API_KEY`

### SMS Not Sending
- Check Twilio balance
- Verify phone number format (+44...)
- Check SMS logs in admin

### Lead Score Always 0
- Check if activities are being logged
- Run `calculateLeadScore(leadId)` manually
- Check console for errors

### AI Generation Fails
- Check OpenAI API key
- Check usage limits/billing
- Check model availability

---

## 📚 Next Steps

1. **Monitor for 1 week** - Watch automation work
2. **Review AI insights** - Act on recommendations
3. **Refine sequences** - Adjust timing based on performance
4. **Add payment** - Integrate Stripe for deposits
5. **Scale content** - Increase from 3 to 5 posts/week
6. **Add analytics** - Google Analytics or Posthog

---

## 🎉 You're Done!

Your AI-powered backend is now running autonomously. It will:
- Score and nurture leads automatically
- Send personalized emails (AI-generated, not templates)
- Generate blog content 3x per week
- Provide daily business insights
- Handle all communications
- Track everything in one CRM

**All hands-off, all the time.**

For support or questions, check the documentation files or console logs.






