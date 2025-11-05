# Quick Testing Checklist

## 🚀 Quick Start (5 Minutes)

### Prerequisites
```bash
# 1. Ensure .env.local has these keys:
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
OPENAI_API_KEY=...
RESEND_API_KEY=...

# 2. Start dev server
npm run dev
```

---

## ✅ Core Features Testing

### 1️⃣ CPD AI Chat (2 min)

**Test:**
```
1. Go to: http://localhost:3000/cpd-partnerships
2. Click "Ask Luke's AI" button
3. Chat opens → Check: Indigo header, graduation cap icon
4. Type: "I'm from Oxford College with 100 students"
5. AI responds with CPD recommendations
6. Lead capture form appears
7. Fill: Name, Email, Phone
8. Submit → Green success message
```

**✅ Pass if:** Chat works, form submits, success shown

---

### 2️⃣ Lead in Database (1 min)

**Test in Supabase SQL Editor:**
```sql
SELECT * FROM leads 
WHERE source = 'ai_chat_cpd' 
ORDER BY created_at DESC LIMIT 1;
```

**✅ Pass if:** Lead exists with custom_fields populated

---

### 3️⃣ Automation Queued (1 min)

**Test:**
```sql
SELECT task_type, scheduled_for, status
FROM automation_queue
WHERE lead_id = '[YOUR_LEAD_ID]'
ORDER BY scheduled_for;
```

**✅ Pass if:** 5 tasks queued (CPD sequence)

---

### 4️⃣ Email Generation (2 min)

**Trigger:**
```bash
curl http://localhost:3000/api/cron/process-queue
```

**Check:**
```sql
SELECT * FROM email_logs 
WHERE lead_id = '[YOUR_LEAD_ID]';
```

**✅ Pass if:** Email record created, Resend dashboard shows email

---

### 5️⃣ Admin Dashboard (1 min)

**Test:**
```
1. Go to: http://localhost:3000/admin
2. Click "Leads" tab
3. Find your test lead
```

**✅ Pass if:** Lead visible with CPD badge, institution shown

---

## 🔬 Advanced Testing (Optional)

### Lead Scoring
```sql
SELECT first_name, last_name, lead_score, custom_fields
FROM leads WHERE email = 'your-test@college.ac.uk';
-- Should be 50-70+ for CPD leads
```

### Content Generation
```bash
curl http://localhost:3000/api/cron/generate-content
```

### AI Insights
```bash
curl http://localhost:3000/api/cron/generate-insights
```

---

## 🎯 Essential SQL Queries

### View All Recent Leads
```sql
SELECT 
  first_name, last_name, email, source, lead_score, 
  created_at, custom_fields->>'institution' as institution
FROM leads 
ORDER BY created_at DESC 
LIMIT 10;
```

### Check Automation Status
```sql
SELECT 
  task_type, status, scheduled_for, 
  payload->>'emailType' as email_type
FROM automation_queue 
WHERE status = 'pending'
ORDER BY scheduled_for 
LIMIT 20;
```

### View Sent Emails
```sql
SELECT 
  to_email, subject, email_type, 
  status, sent_at, open_count
FROM email_logs 
ORDER BY created_at DESC 
LIMIT 10;
```

### Check Lead Scores
```sql
SELECT 
  l.first_name, l.last_name, l.lead_score,
  lsh.previous_score, lsh.new_score, lsh.reason
FROM leads l
LEFT JOIN lead_score_history lsh ON l.id = lsh.lead_id
ORDER BY l.created_at DESC
LIMIT 10;
```

---

## 🐛 Quick Troubleshooting

### Chat Not Working?
```javascript
// Check browser console for errors
// Verify: context state, event listener
```

### Emails Not Sending?
```bash
# Check Resend API key
echo $RESEND_API_KEY

# Check logs
SELECT * FROM email_logs WHERE status = 'failed';
```

### No Leads Created?
```bash
# Check Supabase connection
# Verify API route: /api/leads
# Check browser Network tab
```

---

## ✨ Success Criteria

You've successfully tested everything if:

- ✅ CPD chat opens in institutional mode
- ✅ Lead capture works in chat
- ✅ Lead appears in Supabase with score
- ✅ 5 automation tasks queued
- ✅ First email generates and sends
- ✅ Lead visible in admin dashboard
- ✅ CPD badge and institution displayed

---

## 🚀 Ready for Production?

Run this final check:

```bash
# 1. Build succeeds
npm run build

# 2. No TypeScript errors
# 3. All environment variables set
# 4. Supabase tables created
# 5. Resend domain verified
# 6. At least one test lead created
# 7. At least one email sent successfully
```

**If all ✅ → Deploy to Vercel!**

```bash
vercel --prod
```

---

## 📊 Performance Benchmarks

**After 1 week, check:**
- CPD chat → lead conversion rate (target: 30%+)
- Email open rates (target: 40%+)
- Lead quality scores (target avg: 50+)
- Admin dashboard usage

**Iterate and optimize based on data!**






