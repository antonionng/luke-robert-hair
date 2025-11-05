# Publish from Preview Feature

## Overview
You can now publish content directly from the preview modal after creating it. This streamlines the content workflow by eliminating the need to close the preview, find the content in the queue, and then publish it.

## What's New

### 1. Publish Now Button
- When previewing unpublished content, you'll see a green "Publish Now" button in the modal header
- Clicking it will:
  - Confirm you want to publish
  - Immediately publish the content (status → 'published')
  - Set the published_at timestamp
  - Make it visible on your public website
  - Close the modal and refresh the content queue

### 2. Schedule for Later Button
- If you've set a "Scheduled For" date while editing, a blue "Schedule" button appears
- Clicking it will:
  - Confirm the scheduled publish date
  - Set status to 'scheduled'
  - Save the scheduled_for timestamp
  - The content will auto-publish at that time (via cron job)

### 3. Visual States
- Published content won't show publish buttons (already published)
- Buttons are disabled while publishing/scheduling actions are in progress
- Success/error messages confirm actions

## User Flow

### Quick Publish Workflow:
1. Create content in admin panel
2. View the preview when generation completes
3. Review the content
4. Click "Publish Now" → Content goes live immediately!

### Scheduled Publish Workflow:
1. Create content in admin panel
2. View the preview when generation completes
3. Click "Edit" in the preview
4. Set a "Scheduled For" date/time
5. Click "Save"
6. Click "Schedule" → Content will publish at the scheduled time

## Technical Details

### Files Modified:

**1. `/components/admin/ContentPreviewModal.tsx`**
- Added `onPublish` callback prop
- Added `handlePublish()` function for immediate publishing
- Added `handleSchedulePublish()` function for scheduled publishing
- Added publish/schedule buttons to the modal header
- Conditional rendering based on content status

**2. `/app/api/admin/content/queue/[id]/route.ts`**
- Enhanced PATCH endpoint to auto-set `published_at` when status → 'published'
- Auto-clears `scheduled_for` when publishing immediately
- Auto-clears `published_at` when status → 'scheduled'

**3. `/app/admin/page.tsx`**
- Added `onPublish={fetchContentQueue}` to ContentPreviewModal
- Ensures content queue refreshes after publish/schedule actions

## API Behavior

### Publish Now (PATCH /api/admin/content/queue/:id):
```json
{
  "status": "published",
  "published_at": "2025-11-05T10:30:00Z"
}
```
Result: Content visible on public site immediately

### Schedule for Later:
```json
{
  "status": "scheduled",
  "scheduled_for": "2025-11-10T09:00:00Z"
}
```
Result: Content will auto-publish at specified time

## Related Features

- **Home Page Live Insights**: The home page now displays the latest 3 published posts from the database (no more dummy data)
- **Hair-Focused Images**: AI image prompts now specifically request hair cutting/styling/barbering scenes in action
- **Auto-Refresh**: Content queue automatically refreshes after publish/schedule actions

## Notes

- Published content cannot be unpublished through the UI (prevents accidental unpublishing)
- You can still edit published content - changes save immediately
- Scheduled content can be published early by clicking "Publish Now"
- The cron job at `/api/cron/check-content` handles auto-publishing scheduled content

