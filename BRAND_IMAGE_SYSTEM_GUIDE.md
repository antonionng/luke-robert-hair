# Brand Image Rotation System - User Guide

## Overview

Your website now has an automated brand image rotation system that ensures your blog posts consistently use on-brand photography while fairly distributing images across content.

## What's New

### 1. Organized Image Folders

Three new image folders have been created in `public/images/`:

- **`hair-styling/`** - For hair styling and salon content (Salon Tips, Product Highlights)
- **`barbering/`** - For barbering and men's grooming content
- **`education/`** - For educational and CPD training content (Education Insights)

Each folder contains a README with specifications and instructions.

### 2. Automatic Image Rotation

When creating blog posts:
- The system automatically selects the **least-recently-used** image from the appropriate category
- All images in a folder are used before any image repeats
- Fair distribution ensures every image gets exposure

### 3. Admin Control

When creating content in the admin panel, you can now choose:
- **Brand Images** (default) - Uses your curated photography with rotation
- **AI Generated** - Creates custom images with DALL-E

## How to Use

### Adding Brand Images

1. Navigate to the appropriate folder:
   - `public/images/hair-styling/` for styling content
   - `public/images/barbering/` for barbering content
   - `public/images/education/` for education content

2. Add your images following these guidelines:
   - **Format**: JPG, PNG, or WebP
   - **Size**: Minimum 1200x630px (16:9 aspect ratio)
   - **File size**: Under 500KB for optimal performance
   - **Naming**: Use descriptive kebab-case names (e.g., `precision-bob-technique.jpg`)

3. The system automatically detects new images and adds them to the rotation

### Creating Blog Posts

1. Go to Admin → Content Creation
2. Fill in your topic and category
3. Choose your image source:
   - **Brand Images**: System selects next image in rotation
   - **AI Generated**: DALL-E creates a custom image
4. Submit the content request

The image will be automatically assigned based on your selection.

### Category to Folder Mapping

The system maps blog categories to image folders:

| Blog Category | Image Folder |
|---------------|--------------|
| Education Insights | `education/` |
| Salon Tips | `hair-styling/` |
| Product Highlights | `hair-styling/` |
| Barbering content | `barbering/` |

## Database Migration

A new database table has been created to track image usage:

**Table**: `brand_image_usage`
- Tracks which images have been used
- Records usage count and last used timestamp
- Powers the rotation algorithm

To apply the migration:

```bash
# If using Supabase CLI
supabase db push

# Or run the migration file directly
psql -d your_database < supabase/migrations/004_brand_image_usage.sql
```

## How the Rotation Works

1. **First Use**: Images with zero usage are prioritized
2. **Equal Usage**: If multiple images have the same usage count, the oldest (by last_used) is selected
3. **Fair Distribution**: Every image gets used before any image is repeated
4. **Category Specific**: Each folder has its own independent rotation

## Fallback Behavior

The system has smart fallbacks:

1. **Brand Images Selected** → Uses next rotated image
2. **No Brand Images Available** → Falls back to DALL-E (if enabled)
3. **DALL-E Disabled** → Uses existing placeholder images

## Management Functions

The following utility functions are available in `lib/imageRotation.ts`:

### Check Available Images
```typescript
import { getBrandImagesByCategory } from '@/lib/imageRotation';

const images = getBrandImagesByCategory('Education Insights');
console.log(`${images.length} images available`);
```

### Reset Rotation
```typescript
import { resetImageRotation } from '@/lib/imageRotation';

// Reset specific category
await resetImageRotation('Education Insights');

// Reset all categories
await resetImageRotation();
```

### Get Statistics
```typescript
import { getImageRotationStats } from '@/lib/imageRotation';

const stats = await getImageRotationStats('Education Insights');
console.log(`Total images: ${stats.totalImages}`);
console.log(`Average usage: ${stats.averageUsage}`);
```

## Best Practices

### Image Quality
- Use professional, high-resolution photography
- Maintain consistent style (sage green and off-white palette)
- Show hairdressing in action (stylist working with client)
- Avoid generic stock photos

### Quantity
- **Minimum**: 3-5 images per category for variety
- **Recommended**: 8-10 images per category for best rotation
- **Ideal**: 15+ images per category for maximum variety

### Maintenance
- Regularly review image performance in admin analytics
- Remove underperforming images and add fresh content
- Update images seasonally to keep content fresh
- Ensure all images are properly licensed for commercial use

## Troubleshooting

### No Images Appearing?
1. Check that images exist in the correct folder
2. Verify images are in supported formats (JPG, PNG, WebP)
3. Check file permissions (should be readable)
4. Look for console errors in the admin panel

### Same Image Appearing Repeatedly?
1. Check if other images exist in the folder
2. Verify the database migration was applied
3. Try resetting the rotation for that category

### DALL-E Not Working?
1. Verify `DALL_E_ENABLED=true` in environment variables
2. Check that `OPENAI_API_KEY` is set correctly
3. Review API quota and billing status

## Technical Details

### Image Selection Algorithm

```typescript
// 1. Get all images in category folder
// 2. Fetch usage data from database
// 3. Sort by:
//    - Usage count (ascending)
//    - Last used date (null first, then oldest)
// 4. Select first image (least used)
// 5. Track usage in database
```

### Storage Location

- **Brand Images**: `public/images/{category}/`
- **Usage Tracking**: `brand_image_usage` table in Supabase
- **Rotation Logic**: `lib/imageRotation.ts`
- **Content Engine**: `lib/contentEngine.ts`

## Support

For issues or questions about the brand image system:

1. Check the README files in each image folder
2. Review this guide for troubleshooting steps
3. Check console logs for error messages
4. Review the database for usage tracking data

## Future Enhancements

Potential improvements to consider:

- [ ] Admin UI to view and manage image rotation
- [ ] Bulk image upload interface
- [ ] Image performance analytics (CTR, engagement)
- [ ] Seasonal image tagging and auto-selection
- [ ] A/B testing for image effectiveness
- [ ] Image optimization and auto-resizing
- [ ] Preview next image before publishing


