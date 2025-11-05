# Troubleshooting Guide

## Quick Diagnostic Checklist

Run through this checklist to diagnose your issue:

### ✅ Step 1: Check if Schema Fix Was Applied
Run this query in Supabase SQL Editor:
```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'content_queue' 
ORDER BY column_name;
```

**You should see these columns:**
- `ai_generated`
- `ai_model`
- `category`
- `clicks`
- `content` ⭐ **CRITICAL**
- `cta_description`
- `cta_label`
- `cta_url`
- `created_at`
- `editor_notes`
- `editor_state`
- `excerpt`
- `featured`
- `generation_prompt`
- `hero_alt`
- `hero_caption`
- `id`
- `image_prompt`
- `image_url`
- `insight_tags`
- `keywords`
- `leads_generated`
- `meta_description`
- `metadata`
- `outline`
- `pinned_until`
- `preview_generated_at`
- `preview_html`
- `published_at`
- `reading_time_minutes`
- `rejection_reason`
- `request_id`
- `reviewed_at`
- `reviewed_by`
- `scheduled_for`
- `seo_title`
- `slug`
- `source`
- `status`
- `title`
- `updated_at`
- `views`
- `word_count`

**If you DON'T see all of these**, run `COMPLETE_SCHEMA_FIX.sql` again.

---

### ✅ Step 2: Check if Tables Exist
Run this query:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('bookings', 'content_queue', 'content_requests', 'content_analytics_events', 'leads')
ORDER BY table_name;
```

**You should see:**
- `bookings`
- `content_analytics_events`
- `content_queue`
- `content_requests`
- `leads`

**If any are missing**, run `COMPLETE_SCHEMA_FIX.sql` again.

---

### ✅ Step 3: Force Schema Cache Reload
If tables/columns exist but you still get "not in schema cache" errors:

```sql
NOTIFY pgrst, 'reload schema';
```

Then wait 30 seconds and restart your dev server.

---

### ✅ Step 4: Check for Constraint Errors
If you're getting constraint violation errors:

```sql
-- Check content_queue constraints
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'content_queue';
```

---

## Common Error Messages & Solutions

### Error: "Could not find the 'content' column"
**Solution:** Run `COMPLETE_SCHEMA_FIX.sql` in Supabase SQL Editor

### Error: "Could not find the table 'public.bookings'"
**Solution:** Run `COMPLETE_SCHEMA_FIX.sql` - it creates the bookings table

### Error: "Cannot read properties of undefined (reading 'from')"
**Solution:** 
1. Check if `db.content_queue` is defined in `lib/supabase.ts`
2. Restart your dev server
3. Clear browser cache

### Error: "404 Not Found" for API routes
**Solution:**
1. Check if the file exists in `app/api/...`
2. Restart dev server
3. Check for syntax errors in the route file
4. Make sure the route exports `GET`, `POST`, etc. functions

### Error: "Connection terminated unexpectedly" (Migration Script)
**Solution:** 
- **Don't use the migration script** - it times out
- Use Supabase SQL Editor instead (it has longer timeouts)

### Error: "relation does not exist"
**Solution:** Run `COMPLETE_SCHEMA_FIX.sql` to create all tables

---

## Dev Server Issues

### Server won't start
```bash
# Kill all Next.js processes
pkill -f "next dev"
killall node

# Clear Next.js cache
rm -rf .next

# Restart
npm run dev
```

### Port already in use
```bash
# Find what's using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>

# Or just use a different port
npm run dev -- -p 3001
```

### Compilation errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

---

## Database Connection Issues

### Can't connect to Supabase
1. Check your `.env.local` file has correct credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
   SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
   ```

2. Test connection in Supabase SQL Editor:
   ```sql
   SELECT NOW();
   ```

3. Check if your IP is allowed (Supabase Dashboard → Settings → Database → Connection Pooling)

---

## Content Generation Specific Issues

### Content generation starts but fails
**Check this in order:**
1. ✅ OpenAI API key is set: `OPENAI_API_KEY` in `.env.local`
2. ✅ Database has all required columns (see Step 1 above)
3. ✅ `content_requests` table exists
4. ✅ Foreign key relationship between `content_queue.request_id` and `content_requests.id` is set up

### Content generation succeeds but doesn't appear
**Check:**
```sql
SELECT id, title, status, created_at 
FROM content_queue 
ORDER BY created_at DESC 
LIMIT 5;
```

If you see content but it doesn't show in the UI:
1. Check the status field (should be 'review', 'scheduled', or 'published')
2. Refresh the admin page
3. Check browser console for errors

---

## Verification Commands

### Count records in each table
```sql
SELECT 
  'leads' as table_name, COUNT(*) as count FROM leads
UNION ALL
SELECT 'bookings', COUNT(*) FROM bookings
UNION ALL  
SELECT 'content_queue', COUNT(*) FROM content_queue
UNION ALL
SELECT 'content_requests', COUNT(*) FROM content_requests
UNION ALL
SELECT 'content_analytics_events', COUNT(*) FROM content_analytics_events;
```

### Check recent content queue items
```sql
SELECT 
  id,
  title,
  status,
  source,
  ai_model,
  created_at,
  LENGTH(content) as content_length
FROM content_queue 
ORDER BY created_at DESC 
LIMIT 10;
```

### Check recent errors (if you have error logging)
```sql
SELECT * 
FROM pg_stat_activity 
WHERE state = 'active';
```

---

## Nuclear Option (Reset Everything)

⚠️ **WARNING: This deletes all data!**

If nothing works and you want to start fresh:

```sql
-- Drop and recreate all tables
DROP TABLE IF EXISTS content_analytics_events CASCADE;
DROP TABLE IF EXISTS content_queue CASCADE;
DROP TABLE IF EXISTS content_requests CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;

-- Then run COMPLETE_SCHEMA_FIX.sql
```

---

## Still Stuck?

Gather this info and share it:

1. **Error message** (exact text)
2. **Terminal output** (last 50 lines)
3. **Browser console errors**
4. **Results from Step 1 & Step 2 above**
5. **Your Node.js version**: `node --version`
6. **Your Next.js version**: Check `package.json`

---

## Prevention

To avoid these issues in the future:

1. ✅ Always test migrations locally first
2. ✅ Use Supabase CLI for migrations
3. ✅ Keep a backup of your database schema
4. ✅ Document schema changes in migration files
5. ✅ Use TypeScript types that match your DB schema exactly




