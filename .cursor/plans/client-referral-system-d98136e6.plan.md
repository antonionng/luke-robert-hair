<!-- d98136e6-0627-4b2b-99f3-f0cd6cc78bf7 af6a87c4-7038-49e5-a7b9-b85317c49347 -->
# Fix Header and Remove Floating Button

## Problem

1. Navigation header is missing from all pages across the site
2. Floating referral button in bottom right is overpowering and needs to be removed

## Root Cause

The `LayoutWrapper.tsx` component is missing the `Navigation` component import and render, causing the header to not appear on any pages.

## Solution

### 1. Update LayoutWrapper Component

**File:** `components/LayoutWrapper.tsx`

Currently:

```tsx
import AIAssistant from './AIAssistant';
import FloatingReferralButton from './referral/FloatingReferralButton';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AIAssistant />
      <FloatingReferralButton />
    </>
  );
}
```

Update to:

```tsx
import Navigation from './Navigation';
import Footer from './Footer';
import AIAssistant from './AIAssistant';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      {children}
      <Footer />
      <AIAssistant />
    </>
  );
}
```

**Changes:**

- Add `Navigation` component at the top (provides site header)
- Add `Footer` component after children (provides site footer)
- Remove `FloatingReferralButton` import and component (per user request)

## Expected Result

- Navigation header will appear at the top of all pages
- Footer will appear at the bottom of all pages
- Floating referral button will be removed
- Referral program still accessible via:
  - Footer link ("Refer a Friend" with badge)
  - Homepage banner
  - Direct navigation to `/referrals`