# Complete Marketing Engine Testing Guide

## Overview

This guide will walk you through testing all the AI-powered marketing features:
- ✅ CPD Partnerships page with AI chat
- ✅ Lead capture and scoring
- ✅ AI-powered email nurturing
- ✅ Content generation engine
- ✅ Automation workflows
- ✅ Admin dashboard CRM

---

## Prerequisites

### 1. Environment Variables Setup

Create or verify your `.env.local` file:

```bash
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI (REQUIRED for AI features)
OPENAI_API_KEY=sk-...

# Resend (REQUIRED for email sending)
RESEND_API_KEY=re_...
FROM_EMAIL=Luke Robert <hello@lukerobert.com>
REPLY_TO_EMAIL=luke@lukerobert.com

# Twilio (OPTIONAL for SMS)
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+44xxxxx

# Application Settings
NEXT_PUBLIC_BASE_URL=http://localhost:3000
CRON_SECRET=your_random_secret_key

# Admin Password (optional)
ADMIN_PASSWORD=your_admin_password
```

### 2. Run Database Migrations

**Option 1: Using Supabase CLI**
```bash
cd /Users/nueral/CascadeProjects/personal-website
npx supabase migration up
```

**Option 2: Manual SQL**
```bash
# Copy the SQL from migrations/001_initial_schema.sql
# Paste into Supabase SQL Editor
# Run the migration
```

### 3. Start Development Server

```bash
npm run dev
```

---

## Part 1: Test CPD AI Chat Integration

### Test 1.1: CPD Page Load

**Steps:**
1. Navigate to: `http://localhost:3000/cpd-partnerships`
2. Scroll down to find "Not Sure Which Programme is Right?" section

**Expected Results:**
- ✅ Page loads without errors
- ✅ 4 CPD course cards visible
- ✅ AI CTA section visible with button
- ✅ Button text: "Ask Luke's AI: Which programme is right for my students?"

### Test 1.2: Open AI Chat in CPD Mode

**Steps:**
1. Click the "Ask Luke's AI" button
2. Observe the chat window that opens

**Expected Results:**
- ✅ Chat opens with **indigo header** (not sage)
- ✅ Graduation cap icon visible
- ✅ Header says "Luke Robert Hair"
- ✅ Subtitle says "CPD Partnership Assistant"
- ✅ Badge says "College & Institutional Enquiries"
- ✅ Initial greeting mentions CPD courses
- ✅ Quick action buttons show CPD-specific options:
  - "View CPD programmes"
  - "Partnership process"
  - "Pricing & availability"
  - "Student outcomes"

### Test 1.3: Have a CPD Conversation

**Sample Conversation:**

**You:** "Hi, I'm interested in CPD training for our students"

**Expected AI Response:**
- Professional, B2B tone
- Asks about institution type
- Asks about student numbers
- Asks about goals/outcomes

**You:** "We're Cheshire College with about 120 Level 3 students"

**Expected AI Response:**
- Acknowledges institution
- Asks about student goals or subject area

**You:** "We want to develop their communication and confidence skills"

**Expected AI Response:**
- Recommends "Communication & Influence" programme
- Explains student outcomes
- Mentions CPD accreditation
- Eventually offers discovery call

### Test 1.4: Lead Capture in Chat

**Steps:**
1. Continue conversation until AI has enough info
2. Watch for lead capture form to appear

**Expected Results:**
- ✅ After 4+ messages, form appears
- ✅ Form header: "Ready to Connect?" with check icon
- ✅ Three fields: Name, Email, Phone (optional)
- ✅ Button: "Yes, Arrange a Discovery Call"
- ✅ "Not right now" option visible

**Fill in:**
```
Name: Dr. Sarah Mitchell
Email: sarah.mitchell@cheshire.ac.uk
Phone: 01234567890
```

**Click Submit**

**Expected Results:**
- ✅ Form submits successfully
- ✅ Green success message appears
- ✅ Check mark icon visible
- ✅ Message: "Discovery Call Requested!"
- ✅ Professional confirmation text

---

## Part 2: Verify Lead Creation in Supabase

### Test 2.1: Check Leads Table

**SQL Query:**
```sql
SELECT 
  id,
  first_name,
  last_name,
  email,
  phone,
  source,
  lead_score,
  lifecycle_stage,
  course_interest,
  custom_fields,
  created_at
FROM leads
WHERE source = 'ai_chat_cpd'
ORDER BY created_at DESC
LIMIT 1;
```

**Expected Results:**
- ✅ Lead exists
- ✅ `first_name: "Sarah"`
- ✅ `last_name: "Mitchell"`
- ✅ `email: "sarah.mitchell@cheshire.ac.uk"`
- ✅ `source: "ai_chat_cpd"`
- ✅ `custom_fields` contains:
  ```json
  {
    "leadType": "cpd_partnership",
    "institution": "Cheshire College",
    "studentNumbers": 120,
    "jobTitle": "...",
    "deliveryPreference": "..."
  }
  ```
- ✅ `lead_score` calculated (likely 40-70+)

### Test 2.2: Check Lead Score History

**SQL Query:**
```sql
SELECT *
FROM lead_score_history
WHERE lead_id = '[YOUR_LEAD_ID_FROM_ABOVE]'
ORDER BY created_at DESC;
```

**Expected Results:**
- ✅ At least one score history record
- ✅ Shows initial score calculation
- ✅ `behavioral_score`, `engagement_score`, `profile_score` populated
- ✅ CPD bonuses reflected in score

### Test 2.3: Check Automation Queue

**SQL Query:**
```sql
SELECT 
  task_type,
  payload->>'emailType' as email_type,
  scheduled_for,
  status,
  priority
FROM automation_queue
WHERE lead_id = '[YOUR_LEAD_ID]'
ORDER BY scheduled_for;
```

**Expected Results:**
- ✅ 5 tasks queued for CPD sequence:
  1. `cpd_welcome` (immediate)
  2. `cpd_course_overview` (+24 hours)
  3. `cpd_case_study` (+72 hours)
  4. `cpd_discovery_call` (+1 week)
  5. `cpd_final_follow_up` (+3 weeks)
- ✅ All have `status: 'pending'`
- ✅ `priority: 1 or 2`

---

## Part 3: Test Email Generation

### Test 3.1: Manually Trigger Email Generation

**Terminal Command:**
```bash
curl -X POST http://localhost:3000/api/cron/process-queue \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"
```

**Or visit in browser:**
```
http://localhost:3000/api/cron/process-queue
```

**Expected Response:**
```json
{
  "success": true,
  "processed": 1,
  "successful": 1,
  "failed": 0
}
```

### Test 3.2: Check Email Logs

**SQL Query:**
```sql
SELECT 
  id,
  to_email,
  subject,
  email_type,
  ai_generated,
  status,
  sent_at,
  open_count,
  click_count
FROM email_logs
WHERE lead_id = '[YOUR_LEAD_ID]'
ORDER BY created_at DESC;
```

**Expected Results:**
- ✅ Email record created
- ✅ `email_type: 'nurturing'`
- ✅ `ai_generated: true`
- ✅ `status: 'sent'` (if Resend configured) or `'pending'`
- ✅ Subject line is personalized
- ✅ `to_email` matches lead email

### Test 3.3: Check Resend Dashboard

**Steps:**
1. Log into Resend dashboard
2. Navigate to "Emails" section
3. Find most recent email

**Expected Results:**
- ✅ Email sent to sarah.mitchell@cheshire.ac.uk
- ✅ Subject mentions institution or is personalized
- ✅ Email body contains:
  - Institution name mentioned
  - Student numbers referenced
  - CPD course details
  - Professional B2B tone
  - Discovery call CTA

---

## Part 4: Test Regular Lead Form (Non-Chat)

### Test 4.1: CPD Enquiry Form

**Steps:**
1. Navigate to `/cpd-partnerships`
2. Scroll to enquiry form at bottom
3. Fill in form:
   ```
   Name: John Smith
   Job Title: Director of Training
   Institution: Manchester College
   Email: j.smith@manchester.ac.uk
   Phone: 01234567891
   Course Interest: Coaching for Success
   Student Numbers: 80
   Delivery: On-site
   Message: Interested in running this for our trainee tutors
   ```
4. Click "Request Partnership Information"

**Expected Results:**
- ✅ Success message appears
- ✅ Form resets after 5 seconds

### Test 4.2: Verify Form Lead in Database

**SQL Query:**
```sql
SELECT *
FROM leads
WHERE email = 'j.smith@manchester.ac.uk'
ORDER BY created_at DESC
LIMIT 1;
```

**Expected Results:**
- ✅ Lead created
- ✅ `source: 'cpd_partnership'` (not 'ai_chat_cpd')
- ✅ Custom fields populated
- ✅ CPD sequence queued

---

## Part 5: Test Lead Scoring System

### Test 5.1: Create Test Lead with High Score

**Use the form or API to create a lead with:**
- Educational email domain (.ac.uk)
- Decision-maker job title (Director, Head of)
- Large student cohort (100+)
- Specific course selected

**SQL to Check Score:**
```sql
SELECT 
  first_name,
  last_name,
  email,
  lead_score,
  custom_fields
FROM leads
WHERE email = 'your-test-email@college.ac.uk';
```

**Expected Score Breakdown:**
- Base profile score: ~15-20
- CPD bonuses:
  - Institution: +5
  - Decision-maker: +10
  - Large cohort: +10
  - Educational domain: +5
  - Specific course: +8
- **Total Expected: 50-70+ (Warm/Hot lead)**

### Test 5.2: Test Lead Activity Logging

**Simulate some activities:**

**SQL Insert:**
```sql
INSERT INTO lead_activities (lead_id, activity_type, activity_data, score_impact)
VALUES (
  '[YOUR_LEAD_ID]',
  'email_opened',
  '{"email_id": "test123"}',
  3
);
```

**Recalculate Score:**
```bash
# This would normally happen automatically
# You can trigger via API or cron job
```

**Check Updated Score:**
```sql
SELECT 
  lead_score,
  last_activity_date
FROM leads
WHERE id = '[YOUR_LEAD_ID]';
```

---

## Part 6: Test Content Generation Engine

### Test 6.1: Trigger Content Generation

**Terminal Command:**
```bash
curl -X POST http://localhost:3000/api/cron/generate-content \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

**Expected Console Output:**
- AI selects topic based on lead interests
- Generates blog post content
- (Optional) Generates DALL-E image
- Saves to content_queue table

### Test 6.2: Check Content Queue

**SQL Query:**
```sql
SELECT 
  title,
  category,
  content_type,
  status,
  ai_generated,
  created_at
FROM content_queue
ORDER BY created_at DESC
LIMIT 5;
```

**Expected Results:**
- ✅ Content items created
- ✅ `ai_generated: true`
- ✅ `status: 'draft'` or `'pending_approval'`
- ✅ Title is relevant to hair/salon/education
- ✅ Category matches lead interests

---

## Part 7: Test Admin Dashboard

### Test 7.1: Access Admin Dashboard

**Steps:**
1. Navigate to: `http://localhost:3000/admin`
2. Enter admin password (if configured)

**Expected Results:**
- ✅ Dashboard loads
- ✅ Stats grid shows metrics
- ✅ Tabs visible: Overview, Bookings, Leads, Chat, Services

### Test 7.2: View Leads Tab

**Steps:**
1. Click "Leads" tab
2. Search for your test leads

**Expected Results:**
- ✅ Leads table displays
- ✅ CPD leads show "CPD" badge
- ✅ Institution name visible for CPD leads
- ✅ Student numbers displayed
- ✅ Lead scores visible
- ✅ Status badges (New, Contacted, Qualified, etc.)

### Test 7.3: Filter CPD Leads

**If you implemented the filter dropdown:**
1. Select "CPD Partnerships" from filter
2. Observe filtered results

**Expected Results:**
- ✅ Only CPD leads shown
- ✅ Institutional data visible
- ✅ Different column headers (Institution, Students)

---

## Part 8: Test AI Insights Generation

### Test 8.1: Trigger Insights

**Terminal Command:**
```bash
curl -X POST http://localhost:3000/api/cron/generate-insights \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

**Expected Response:**
```json
{
  "success": true,
  "insights_generated": 5,
  "categories": ["leads", "conversion", "engagement"]
}
```

### Test 8.2: Check AI Insights Table

**SQL Query:**
```sql
SELECT 
  category,
  title,
  description,
  priority,
  actionable_recommendations,
  created_at
FROM ai_insights
ORDER BY created_at DESC
LIMIT 10;
```

**Expected Results:**
- ✅ Insights generated
- ✅ Priorities: critical, high, medium, low
- ✅ Recommendations provided
- ✅ Data-driven insights (conversion rates, lead quality, etc.)

---

## Part 9: End-to-End CPD Journey Test

### Complete User Journey

**Step 1: Visit CPD Page**
```
http://localhost:3000/cpd-partnerships
```

**Step 2: Click AI Chat Button**
- Chat opens in CPD mode

**Step 3: Have Natural Conversation**
```
You: "I work at Oxford College and we have 150 students"
AI: [Asks about goals]
You: "We want to improve their leadership skills"
AI: [Recommends EI & Leadership programme]
You: "That sounds perfect, how do we proceed?"
AI: [Offers discovery call, shows lead capture form]
```

**Step 4: Submit Contact Details**
```
Name: Test User
Email: test@oxford.ac.uk
Phone: 01234567890
```

**Step 5: Verify Entire Pipeline**

**Check Lead Created:**
```sql
SELECT * FROM leads WHERE email = 'test@oxford.ac.uk';
```

**Check Score Calculated:**
- Should be 50-70+ due to CPD bonuses

**Check Automation Queued:**
```sql
SELECT COUNT(*) FROM automation_queue WHERE lead_id = '[LEAD_ID]';
-- Should return 5 (CPD sequence)
```

**Check First Email Generated:**
```bash
curl -X POST http://localhost:3000/api/cron/process-queue \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

**Check Email Sent:**
```sql
SELECT * FROM email_logs WHERE lead_id = '[LEAD_ID]';
```

**Check in Resend Dashboard:**
- Email should be visible with CPD content

**Step 6: Simulate Email Open**
```sql
-- In real scenario, this happens via Resend webhook
UPDATE email_logs
SET open_count = 1, opened_at = NOW()
WHERE lead_id = '[LEAD_ID]';

INSERT INTO lead_activities (lead_id, activity_type, score_impact)
VALUES ('[LEAD_ID]', 'email_opened', 3);
```

**Step 7: View in Admin Dashboard**
- Navigate to `/admin`
- Click Leads tab
- Find your test lead
- Verify all data visible

---

## Part 10: Test Cron Jobs (Vercel)

### Setup Vercel Cron Jobs

**Create `vercel.json` in root:**
```json
{
  "crons": [
    {
      "path": "/api/cron/process-queue",
      "schedule": "0 * * * *"
    },
    {
      "path": "/api/cron/generate-content",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/cron/nurture-leads",
      "schedule": "0 */6 * * *"
    },
    {
      "path": "/api/cron/generate-insights",
      "schedule": "0 6 * * *"
    },
    {
      "path": "/api/cron/check-reminders",
      "schedule": "0 8 * * *"
    }
  ]
}
```

### Test Each Cron Endpoint Manually

**Process Queue (Hourly):**
```bash
curl http://localhost:3000/api/cron/process-queue
```

**Generate Content (Daily at 9am):**
```bash
curl http://localhost:3000/api/cron/generate-content
```

**Nurture Leads (Every 6 hours):**
```bash
curl http://localhost:3000/api/cron/nurture-leads
```

**Generate Insights (Daily at 6am):**
```bash
curl http://localhost:3000/api/cron/generate-insights
```

**Check Reminders (Daily at 8am):**
```bash
curl http://localhost:3000/api/cron/check-reminders
```

---

## Troubleshooting Guide

### Issue: Chat not opening in CPD mode

**Check:**
1. Browser console for errors
2. `window.dispatchEvent` firing
3. Context state in React DevTools

**Fix:**
```javascript
// Verify event listener in AIAssistant.tsx
window.addEventListener('openAIChat', handleOpenChat);
```

### Issue: Lead not created

**Check:**
1. Supabase connection
2. `/api/leads` endpoint logs
3. `.env.local` variables

**SQL Debug:**
```sql
-- Check if table exists
SELECT * FROM leads LIMIT 1;

-- Check permissions
SELECT current_user;
```

### Issue: Emails not sending

**Check:**
1. Resend API key valid
2. FROM_EMAIL verified in Resend
3. Email logs table for errors

**SQL Debug:**
```sql
SELECT 
  status,
  error_message
FROM email_logs
WHERE status = 'failed'
ORDER BY created_at DESC;
```

### Issue: AI responses not personalized

**Check:**
1. Context passed to API
2. System prompt selection
3. OpenAI API key valid

**Test:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "test"}],
    "context": {"type": "cpd", "userType": "institution"}
  }'
```

### Issue: Automation queue not processing

**Check:**
1. Cron jobs running
2. Task status in database
3. Error logs

**SQL Debug:**
```sql
SELECT 
  task_type,
  status,
  error_message,
  retry_count
FROM automation_queue
WHERE status = 'failed'
ORDER BY created_at DESC;
```

---

## Success Checklist

### CPD Features
- [ ] CPD page loads correctly
- [ ] AI chat opens in CPD mode (indigo header)
- [ ] CPD-specific quick actions visible
- [ ] Conversation extracts institutional info
- [ ] Lead capture form appears
- [ ] Lead created in Supabase
- [ ] CPD sequence queued (5 emails)

### Lead Management
- [ ] Lead scoring calculates correctly
- [ ] CPD bonuses applied
- [ ] Activities tracked
- [ ] Score history recorded

### Email System
- [ ] Emails generate with AI
- [ ] Personalization works
- [ ] Resend integration sending
- [ ] Email logs tracking
- [ ] B2B tone for CPD leads

### Automation
- [ ] Queue processes tasks
- [ ] Sequences execute
- [ ] Cron jobs triggerable
- [ ] Error handling works

### Admin Dashboard
- [ ] Leads visible
- [ ] CPD badge displayed
- [ ] Scores shown
- [ ] Filtering works

---

## Next Steps After Testing

1. **Deploy to Staging**
   ```bash
   vercel --prod
   ```

2. **Configure Production Environment Variables**
   - Add all `.env.local` vars to Vercel

3. **Set Up Webhooks**
   - Resend webhooks for email tracking
   - (Optional) Twilio webhooks for SMS

4. **Monitor Initial Performance**
   - Track conversion rates
   - Monitor email deliverability
   - Check AI response quality

5. **Iterate Based on Data**
   - Adjust lead scoring weights
   - Refine AI prompts
   - Optimize email timing

---

## Testing Complete! 🎉

You now have a fully functional AI-powered marketing engine with:
- ✅ Intelligent lead capture
- ✅ Automated nurturing sequences
- ✅ AI-generated personalized emails
- ✅ Content generation
- ✅ Comprehensive CRM

**Ready for production deployment!** 🚀



