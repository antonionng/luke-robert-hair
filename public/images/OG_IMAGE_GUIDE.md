# Social Share Image (OG Image) Guide

## Current Placeholder

The site currently uses a placeholder SVG template at `/public/images/og-image.svg`.

## How to Create Your Final OG Image

### Option 1: Convert the SVG Template

1. Open `og-image.svg` in a design tool (Figma, Adobe Illustrator, Sketch, etc.)
2. Customize colors, fonts, and layout to match your brand
3. Export as **JPG** at **1200x630px** (required OG image size)
4. Save as `/public/images/og-image.jpg`

### Option 2: Use a Professional Photo

1. Choose a high-quality image that represents your brand
2. Resize to **1200x630px** (16:9 aspect ratio)
3. Add text overlay with your brand name and tagline
4. Ensure text is readable on all platforms (test with light/dark backgrounds)
5. Save as `/public/images/og-image.jpg`

### Option 3: Use an Online OG Image Generator

Recommended tools:
- **Canva** (free templates): https://www.canva.com/templates/
- **Figma OG Image Template**: https://www.figma.com/community
- **Bannerbear**: https://www.bannerbear.com/
- **Social Image Generator**: https://www.socialimg.com/

## OG Image Requirements

- **Size**: 1200x630px (minimum)
- **Format**: JPG or PNG (JPG preferred for smaller file size)
- **File size**: Keep under 1MB for fast loading
- **Safe zone**: Keep important content at least 40px from edges
- **Text**: Use large, bold text (minimum 24px font size)
- **Contrast**: Ensure good contrast for readability

## What to Include

✓ **Brand name**: Luke Robert Hair
✓ **Tagline**: Precision Hairdressing & Professional Education
✓ **Location**: Cheshire & Berkshire
✓ **Visual elements**: Professional image or brand colors
✓ **URL (optional)**: lukeroberthair.com

## Testing Your OG Image

Test how your image appears on different platforms:

1. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
3. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
4. **General OG Tester**: https://www.opengraph.xyz/

## File Location

Once created, place your image at:
```
/public/images/og-image.jpg
```

The system is already configured to use this file. No code changes needed!

## Dynamic OG Images (Future Enhancement)

Consider implementing dynamic OG images for different pages:
- `/og-images/home.jpg` - Homepage
- `/og-images/education.jpg` - Education page
- `/og-images/salon.jpg` - Salon page

Update the SEO configuration in `/lib/seo.ts` to use page-specific images.

