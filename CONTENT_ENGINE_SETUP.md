# Content Engine Setup Guide

## 🚨 Important: Database Migration Required

The Content Engine needs new database tables. Follow these steps:

## Step 1: Run Database Migration

### Option A: Supabase Dashboard (Easiest)

1. **Open your Supabase project**: https://supabase.com/dashboard/project/YOUR_PROJECT_ID

2. **Navigate to SQL Editor**:
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy the migration SQL**:
   - Open `/supabase/migrations/002_nurturing_engine.sql` in your code editor
   - Copy ALL the contents

4. **Run the migration**:
   - Paste the SQL into the Supabase SQL Editor
   - Click "Run" (or press Cmd/Ctrl + Enter)
   - Wait for "Success" message

5. **Verify tables created**:
   - Go to "Table Editor" in the left sidebar
   - You should now see these new tables:
     - `content_requests`
     - `content_queue` (enhanced with new columns)
     - `content_analytics_events`
     - `content_topics` (if it didn't exist)

### Option B: Supabase CLI

```bash
cd /Users/nueral/CascadeProjects/personal-website
supabase db push
```

## Step 2: Verify Environment Variables

Make sure these are set in your `.env.local`:

```env
# OpenAI (Required for content generation)
OPENAI_API_KEY=sk-...

# Supabase (Already configured)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Step 3: Restart Dev Server

```bash
npm run dev
```

## Step 4: Test the Content Engine

1. **Navigate to Admin Panel**:
   - Go to `/admin`
   - Login with your admin password
   - Click "Content Engine" in the sidebar

2. **Test AI Suggestions**:
   - Click "AI Suggestions" tab
   - Select categories (e.g., "Education & Training")
   - Click "Generate Ideas"
   - Click the "+" button on any suggestion to create a content request

3. **Check Content Queue**:
   - Switch to "Content Queue" tab
   - You should see the generated content appear

4. **View Analytics** (once content is published):
   - Switch to "Analytics" tab
   - See views, clicks, and leads generated

## Troubleshooting

### Error: "Failed to create content request"
**Cause**: Database tables don't exist yet
**Solution**: Run the migration (Step 1)

### Error: "Cannot read properties of undefined"
**Cause**: Missing data in API response
**Solution**: Check that migration completed successfully and tables have correct columns

### Error: "OpenAI API error"
**Cause**: Missing or invalid `OPENAI_API_KEY`
**Solution**: Set your OpenAI API key in `.env.local`

### Content not generating
**Cause**: OpenAI API key not set or quota exceeded
**Solution**: 
1. Check `.env.local` has valid `OPENAI_API_KEY`
2. Check your OpenAI account has available credits
3. Restart dev server after adding the key

### Tables already exist error
**Cause**: Migration file has `CREATE TABLE` without `IF NOT EXISTS`
**Solution**: The migration already uses `IF NOT EXISTS`, safe to run multiple times

## Database Schema Overview

### `content_requests`
Stores content briefs and requests with:
- Topic, category, title
- Detailed brief and objectives
- SEO keywords and target audience
- Scheduling preferences
- Status tracking (draft → queued → generating → ready → completed)

### `content_queue` (Enhanced)
Extended with:
- Preview HTML and metadata
- CTA fields (label, url, description)
- Hero image caption and alt text
- Reading time and word count
- Editor notes and version tracking
- Featured and pinned flags

### `content_analytics_events`
Granular tracking of:
- Views, clicks, CTA clicks, shares
- UTM parameters (source, medium, campaign)
- Session tracking
- User agent and device info

## Next Steps After Setup

1. **Create your first content manually**:
   - Click "Create Content" button
   - Fill in the detailed brief
   - Let AI generate the content

2. **Use AI suggestions**:
   - Generate topic ideas
   - Review and select best ones
   - One-click content creation

3. **Review and publish**:
   - Content goes to "Review" status
   - Preview and edit as needed
   - Publish when ready

4. **Track performance**:
   - Monitor views, clicks, leads
   - See which content resonates
   - Optimize based on data

## Support

If you encounter issues:
1. Check browser console for detailed error messages
2. Check Supabase logs in the dashboard
3. Verify all environment variables are set
4. Restart dev server after any .env changes

---

**Status**: ✅ Migration file ready
**Location**: `/supabase/migrations/002_nurturing_engine.sql`
**Action Required**: Run migration in Supabase dashboard (Step 1)




