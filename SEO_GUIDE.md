# SEO Implementation Guide

## Overview

This guide covers the comprehensive SEO system implemented across the Luke Robert Hair website. The system includes metadata management, structured data (JSON-LD), OpenGraph tags, Twitter cards, and more.

## 📁 File Structure

```
/lib/seo.ts                    # Core SEO configuration and utilities
/components/StructuredData.tsx # Component for rendering JSON-LD
/app/layout.tsx                # Root layout with global metadata
/app/*/page.tsx                # Individual pages with structured data
/public/images/og-image.jpg    # Social share image
```

## 🛠️ Core Configuration

### Site Configuration (`/lib/seo.ts`)

The `siteConfig` object contains all base SEO settings:

```typescript
export const siteConfig = {
  name: 'Luke Robert Hair',
  title: 'Luke Robert Hair | Precision Hairdressing & Professional Education',
  description: '...',
  url: 'https://lukeroberthair.com',
  ogImage: '/images/og-image.jpg',
  twitterHandle: '@lukeroberthair',
  locale: 'en_GB',
  keywords: [...],
  locations: [...],
};
```

### Page-Specific Metadata

Each page has customized metadata in the `pageMetadata` object:

```typescript
export const pageMetadata = {
  home: { title: '...', description: '...', keywords: [...] },
  about: { title: '...', description: '...', keywords: [...] },
  // ... more pages
};
```

## 📋 Implemented SEO Features

### ✅ Metadata

- **Title tags**: Dynamic with template `%s | Luke Robert Hair`
- **Meta descriptions**: Unique for each page
- **Keywords**: Comprehensive keyword targeting
- **Canonical URLs**: Prevents duplicate content issues
- **Author/Publisher**: Proper attribution

### ✅ OpenGraph Tags

Full OpenGraph implementation for social sharing:
- `og:type`, `og:title`, `og:description`
- `og:image` (1200x630px)
- `og:url`, `og:site_name`
- `og:locale`

### ✅ Twitter Cards

Twitter-specific metadata:
- `twitter:card` (summary_large_image)
- `twitter:site`, `twitter:creator`
- `twitter:title`, `twitter:description`
- `twitter:image`

### ✅ Structured Data (JSON-LD)

Implemented schema.org structured data:

1. **Organization Schema** (`generateOrganizationSchema()`)
   - Business type: HairSalon
   - Contact information
   - Multiple locations
   - Service offerings

2. **Person Schema** (`generatePersonSchema()`)
   - Luke Robert as a Person
   - Job title, awards, affiliations
   - Social media links

3. **LocalBusiness Schema** (`generateLocalBusinessSchema()`)
   - Individual location data
   - Address, phone, geo coordinates

4. **Course Schema** (`generateCourseSchema()`)
   - Education course offerings
   - CPD training programs

5. **Breadcrumbs** (`generateBreadcrumbs()`)
   - Navigation structure
   - Helps Google understand site hierarchy

### ✅ Robots & Crawling

```typescript
robots: {
  index: true,
  follow: true,
  googleBot: {
    'max-video-preview': -1,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
}
```

### ✅ Performance Optimizations

- Preconnect to Google Fonts
- Font display: swap (prevents FOIT)
- Optimized images with Next.js Image component
- Lazy loading for non-critical content

## 🎯 Page-by-Page SEO

### Homepage (`/`)
- Organization + Person schema
- Service highlights
- Trust signals (awards, testimonials)
- Location information

### About (`/about`)
- Person schema (Luke Robert)
- Professional timeline
- Brand partnerships
- Achievements and credentials

### Salon (`/salon`)
- LocalBusiness schema for each location
- Service descriptions
- Gallery with optimized images
- Location-specific information

### Education (`/education`)
- Course schema for each offering
- Educator credentials
- CPD information
- Training statistics

### CPD Partnerships (`/cpd-partnerships`)
- Course schema for CPD programs
- Partnership benefits
- Accreditation information

### Contact (`/contact`)
- Contact information
- Location addresses
- Quick action buttons

### Insights (`/insights`)
- Blog article listings
- Category filtering
- Publishing dates
- Featured/pinned content

### Book (`/book`)
- Booking CTA
- Location selection
- Service information

### Referrals (`/referrals`)
- Referral program details
- Benefits and incentives
- How it works

## 🔧 How to Update SEO

### Changing Global SEO Settings

Edit `/lib/seo.ts`:

```typescript
export const siteConfig = {
  name: 'Your Business Name',
  title: 'Your Title',
  // ... update as needed
};
```

### Adding a New Page

1. Create your page component
2. Import SEO utilities:
   ```typescript
   import StructuredData from '@/components/StructuredData';
   import { generateBreadcrumbs } from '@/lib/seo';
   ```

3. Add structured data to your component:
   ```tsx
   <StructuredData 
     data={[
       generateBreadcrumbs([
         { name: 'Home', url: '/' },
         { name: 'Your Page', url: '/your-page' },
       ]),
     ]} 
   />
   ```

4. Add page-specific metadata to `/lib/seo.ts`:
   ```typescript
   yourpage: {
     title: 'Page Title',
     description: 'Page description',
     keywords: ['keyword1', 'keyword2'],
   }
   ```

### Updating Keywords

Target keywords are defined in `/lib/seo.ts`:

```typescript
keywords: [
  'hairdressing',
  'precision cutting',
  // Add more keywords
],
```

**Best Practices:**
- Use 10-20 core keywords
- Include location-specific keywords
- Add service-specific keywords
- Include long-tail variations

## 🔍 SEO Checklist

### On-Page SEO
- [x] Unique title tags (50-60 characters)
- [x] Meta descriptions (150-160 characters)
- [x] H1 tags (one per page)
- [x] Proper heading hierarchy (H1 → H2 → H3)
- [x] Alt text for images
- [x] Internal linking
- [x] Mobile-friendly design
- [x] Fast page load times

### Technical SEO
- [x] XML sitemap (`/sitemap.xml` - Next.js auto-generates)
- [x] Robots.txt
- [x] Canonical URLs
- [x] Structured data
- [x] HTTPS (ensure in production)
- [ ] Google Search Console verification
- [ ] Google Analytics setup

### Off-Page SEO
- [ ] Google My Business listings (for each location)
- [ ] Local citations (directories)
- [ ] Social media profiles
- [ ] Backlink strategy
- [ ] Reviews and testimonials

## 📊 Monitoring & Testing

### Tools for Testing

1. **Google Search Console**
   - Submit sitemap
   - Monitor indexing status
   - Check for errors
   - Track search performance

2. **Google Rich Results Test**
   - Test structured data: https://search.google.com/test/rich-results
   - Verify schema markup

3. **PageSpeed Insights**
   - Test page speed: https://pagespeed.web.dev/
   - Check Core Web Vitals

4. **Mobile-Friendly Test**
   - Test mobile usability: https://search.google.com/test/mobile-friendly

5. **SEO Browser Extensions**
   - SEOquake
   - MozBar
   - Lighthouse (Chrome DevTools)

### Regular SEO Maintenance

**Weekly:**
- Check Google Search Console for errors
- Monitor page rankings

**Monthly:**
- Update content with fresh keywords
- Add new blog posts (insights)
- Review and update meta descriptions

**Quarterly:**
- Audit all pages for SEO issues
- Update structured data if business changes
- Review and improve low-performing pages

## 🎓 Local SEO Strategy

### Google My Business

Create and optimize GMB listings for each location:

1. **Altrincham - Fixx Salon**
   - Address: 1b Lloyd St, Altrincham, WA14 2DD
   - Phone: 07862054292

2. **Knutsford - Urban Sanctuary**
   - Address: 29 King St, Knutsford, WA16 6DW
   - Phone: 07862054292

3. **Caversham - Alternate Salon**
   - Address: 19 Church Street, Caversham, RG4 8BA
   - Phone: 07862054292

### Local Keywords

Target these location-specific keywords:
- "hairdresser in Altrincham"
- "hair salon Knutsford"
- "precision haircut Cheshire"
- "hairdressing education Berkshire"
- "hair courses UK"

### Local Citations

List business on:
- Yelp
- Yell.com
- Thomson Local
- Free Index
- Touch Local
- Industry-specific directories

## 📱 Social Media Integration

Ensure consistency across platforms:
- Facebook: Update with OG image
- Instagram: Link in bio to website
- LinkedIn: Complete company profile
- Twitter: Use configured handle

## 🚀 Advanced SEO Tactics

### Content Strategy

1. **Blog/Insights Section** (Implemented!)
   - Publish weekly content
   - Target long-tail keywords
   - Include internal links
   - Add schema for articles

2. **FAQ Pages**
   - Create FAQ schema
   - Answer common questions
   - Target "how to" queries

3. **Video Content**
   - Add VideoObject schema
   - Optimize YouTube descriptions
   - Embed on website

### Schema Enhancements

Future schema implementations:
- Review schema (aggregate ratings)
- Event schema (for courses/workshops)
- FAQ schema
- Article schema (for blog posts)
- Video schema

## 🔐 Verification Codes

Add verification codes in `/app/layout.tsx`:

```typescript
verification: {
  google: 'your-google-verification-code',
  bing: 'your-bing-verification-code',
}
```

Get codes from:
- Google Search Console: https://search.google.com/search-console
- Bing Webmaster Tools: https://www.bing.com/webmasters

## 📈 Expected Results

With proper implementation and ongoing optimization:

**Short-term (1-3 months):**
- Improved indexing
- Better rich snippets
- Enhanced social sharing

**Medium-term (3-6 months):**
- Increased organic traffic
- Higher local search rankings
- More qualified leads

**Long-term (6+ months):**
- Established authority
- Consistent organic growth
- Strong brand presence

## 🆘 Troubleshooting

### My pages aren't showing in Google

1. Check Google Search Console for crawl errors
2. Verify robots.txt isn't blocking pages
3. Submit sitemap to GSC
4. Check for noindex tags

### Rich snippets not showing

1. Test with Google Rich Results Test
2. Verify schema markup is valid
3. Wait 2-4 weeks for Google to process
4. Ensure structured data is in `<head>` or `<body>`

### Social share image not displaying

1. Clear Facebook cache: https://developers.facebook.com/tools/debug/
2. Verify image is exactly 1200x630px
3. Check image file size (< 1MB)
4. Ensure image URL is absolute, not relative

## 📚 Resources

- **Google SEO Starter Guide**: https://developers.google.com/search/docs/beginner/seo-starter-guide
- **Schema.org Documentation**: https://schema.org/
- **Next.js Metadata Docs**: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
- **Moz Beginner's Guide to SEO**: https://moz.com/beginners-guide-to-seo

---

**Last Updated:** November 2025
**Maintained By:** Development Team

