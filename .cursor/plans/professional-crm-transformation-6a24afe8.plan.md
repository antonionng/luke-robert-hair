<!-- 6a24afe8-2f4a-4f18-acf2-b9ad3aa2e196 e6deafcf-01a5-4571-a2e5-29f382b9b3a5 -->
# External Booking Lead Capture Implementation

## Overview

Capture lead data before redirecting users to partner salons' external booking systems (Urban Sanctuary & Fixx Salon), ensuring no lost contact opportunities.

## Implementation Steps

### 1. Update Location Data Structure

**File**: `app/api/bookings/route.ts`

- Update GET endpoint to return locations with booking types
- Add external URLs for partner salons
- Include booking type: 'internal' vs 'external'
```typescript
locations = [
  {
    id: 'luke-studio',
    name: 'Luke Robert Studio',
    city: 'Cheshire',
    bookingType: 'internal'
  },
  {
    id: 'urban-sanctuary',
    name: 'Urban Sanctuary',
    city: 'Knutsford',
    bookingType: 'external',
    externalUrl: 'https://urbansanctuary.org.uk/book-online/'
  },
  {
    id: 'fixx-salon',
    name: 'Fixx Salon',
    city: 'Altrincham',
    bookingType: 'external',
    externalUrl: 'https://phorest.com/book/salons/fixxsalonsltd'
  }
]
```


### 2. Create External Booking Capture Component

**New File**: `components/booking/ExternalBookingCapture.tsx`

- Lead capture form for external bookings
- Fields: Name, Email, Phone, Preferred Service, Preferred Date/Time
- Shows salon name and logo
- "Continue to [Salon Name] Booking" button
- Opens external URL in new tab after saving

### 3. Update Main Booking Page

**File**: `app/book/page.tsx`

- Read existing booking wizard structure
- Enhance location selection step
- Show visual indicator for external vs internal locations
- Route to ExternalBookingCapture for external locations
- Continue normal wizard for internal location

### 4. Update Lead API

**File**: `app/api/leads/route.ts`

- Add new source type: `external_booking_intent`
- Save location preference in custom_fields
- Save preferred service and timing

### 5. Admin Integration

**Update**: `components/admin/CreateBookingModal.tsx`

- Show all 3 locations in admin
- For external locations: Create lead record with special note
- Add badge: "External - [Salon Name]"

**Update**: `app/admin/page.tsx` (Salon Bookings tab)

- Display external booking intents
- Show special badge for external leads
- Add filter: Internal vs External

### 6. Follow-Up System (Optional Enhancement)

- Automated email next day: "Did you complete your booking?"
- Track conversion rate by external salon
- Add notes field in admin for follow-up status

## User Flow

### Public Booking (`/book`)

```
1. User clicks "Book Now"
2. Selects Service
3. Selects Location
   ├─ Luke Robert Studio → Normal booking wizard
   ├─ Urban Sanctuary → Lead Capture → Redirect
   └─ Fixx Salon → Lead Capture → Redirect

External Flow Detail:
- Shows: "You'll be redirected to [Salon Name]'s booking system"
- Captures: Name, Email, Phone, Service Interest, Date Preference
- Saves as lead (source: external_booking_intent)
- Opens external URL in new tab
- Shows success: "We've saved your details. Please complete your booking at [Salon Name]."
```

### Admin Booking Creation

```
- Create Booking button
- Select location
- If external: Creates lead record, shows redirect option
- If internal: Normal booking creation
```

## Files to Create

1. `components/booking/ExternalBookingCapture.tsx` - Lead capture form
2. Update `/app/book/page.tsx` - Enhanced wizard logic
3. Update `/app/api/bookings/route.ts` - Location types
4. Update `/app/api/leads/route.ts` - External intent handling
5. Update `components/admin/CreateBookingModal.tsx` - External location handling

## Success Criteria

- ✅ Users can't leave site without providing contact info
- ✅ External salon selection triggers lead capture
- ✅ Lead saved as "external_booking_intent"
- ✅ Opens external URL in new tab after capture
- ✅ Admin can see external booking intents
- ✅ Clear visual distinction between internal/external
- ✅ No UX confusion - users know what to expect

## Data Captured

For external booking intents:

- Contact: Name, Email, Phone
- Intent: Salon preference, Service interest, Timing preference
- Source: `external_booking_intent`
- Custom Fields: `{ salon: 'urban-sanctuary' | 'fixx-salon' }`

### To-dos

- [ ] Re-run database migrations to ensure fresh state
- [ ] Create standalone admin layout with sidebar navigation (no main site nav)
- [ ] Build professional admin sidebar component with dark theme
- [ ] Add dark theme CSS utilities and update admin styling
- [ ] Add CPD Partnerships as dedicated tab (not filter)
- [ ] Create CPD-specific table component with institution-focused columns
- [ ] Build Create New Lead modal with form validation and API integration
- [ ] Build Create New Booking modal with client lookup and inline creation
- [ ] Create Booking Detail modal for viewing/editing bookings
- [ ] Build calendar view component for bookings visualization
- [ ] Add bulk actions, sorting, pagination to leads table
- [ ] Add quick status changes and actions to bookings table
- [ ] Implement navigation between related records (lead → booking, etc.)
- [ ] Create professional empty state and loading components