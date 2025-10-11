# Logo Replacement Instructions

## Current Logo
The AI chat assistant currently uses a placeholder SVG logo (`logo-white.svg`) with the "LR" monogram.

## To Replace with Your Logo

1. **Prepare your logo file:**
   - Format: PNG with transparent background (recommended) or SVG
   - Color: White or light colored (displays on sage green background)
   - Size: 256x256px or larger recommended
   - Shape: Square or circular works best

2. **Replace the file:**
   - Save your logo as `logo-white.png` or `logo-white.svg`
   - Place it in the `/public` directory
   - Overwrite the existing placeholder file

3. **If using PNG instead of SVG:**
   - Update `/components/AIAssistant.tsx` line 101
   - Change `src="/logo-white.svg"` to `src="/logo-white.png"`

## Logo Specifications

### Display Context
- **Location:** AI chat header (top of chat window)
- **Background:** Sage green (#7A9B8E)
- **Size:** 40x40px display size
- **Container:** Circular with subtle background

### Design Guidelines
- Keep it simple - small display size
- Ensure good contrast against sage green
- White or very light colors work best
- Avoid fine details that won't be visible at small size

## Testing
After replacing the logo:
1. Open the website
2. Click the chat button (bottom right)
3. Check that your logo displays correctly in the chat header
4. Verify it looks good on the sage green background
