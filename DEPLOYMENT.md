# Deployment Checklist

Complete checklist for deploying Luke Robert Hair website to production.

## 🎯 Pre-Deployment

### Code Quality
- [ ] All TypeScript errors resolved (`npm run build`)
- [ ] No ESLint warnings (`npm run lint`)
- [ ] All pages tested and working
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing completed (Chrome, Safari, Firefox)

### Content Review
- [ ] All placeholder text replaced with real content
- [ ] Contact information updated (phone, email, addresses)
- [ ] Service prices verified and current
- [ ] Course information accurate
- [ ] About page reflects Luke's actual background
- [ ] Social media links updated
- [ ] Images optimized and properly licensed

### Configuration
- [ ] Environment variables configured
- [ ] OpenAI API key added and tested
- [ ] Admin password changed from default
- [ ] Email service configured (if using Resend)
- [ ] Analytics tracking ID added
- [ ] Custom domain purchased (if applicable)

### Security
- [ ] `.env.local` not committed to git
- [ ] Strong admin password set
- [ ] API rate limiting considered
- [ ] HTTPS/SSL certificate ready
- [ ] CORS policies configured
- [ ] Input validation on all forms

## 🚀 Deployment Steps

### Vercel Deployment

1. **Initial Setup**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login
```

2. **First Deployment**
```bash
# Deploy to preview
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? luke-robert-hair
# - Directory? ./
# - Override settings? No
```

3. **Add Environment Variables**
   - Go to Vercel Dashboard → Your Project
   - Settings → Environment Variables
   - Add each variable:
     - `OPENAI_API_KEY`
     - `RESEND_API_KEY` (if using)
     - `ADMIN_PASSWORD`
     - `NEXT_PUBLIC_SITE_URL`

4. **Deploy to Production**
```bash
vercel --prod
```

5. **Custom Domain Setup**
   - Vercel Dashboard → Domains
   - Add domain: `lukerobert.hair`
   - Configure DNS:
     ```
     Type: A
     Name: @
     Value: 76.76.21.21
     
     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com
     ```
   - Wait for DNS propagation (up to 48 hours)

### Alternative: Replit Deployment

1. **Import Project**
   - Go to Replit.com
   - Create Repl → Import from GitHub
   - Paste repository URL

2. **Configure Secrets**
   - Click lock icon (Secrets)
   - Add environment variables

3. **Deploy**
   - Click "Run"
   - Enable "Always On" for 24/7 uptime
   - Optional: Link custom domain in Replit settings

## ✅ Post-Deployment

### Verification
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Contact form submits successfully
- [ ] Booking form works
- [ ] AI chat assistant responds
- [ ] Admin dashboard accessible
- [ ] Images load properly
- [ ] Mobile view works correctly
- [ ] SSL certificate active (https://)

### Testing Checklist

**Functional Testing:**
```
✓ Home page loads
✓ Salon page displays services
✓ Education page shows courses
✓ About page renders
✓ Insights page lists articles
✓ Contact form submits
✓ Booking form submits
✓ AI chat responds
✓ Admin login works
✓ Content generation works
```

**Performance Testing:**
```bash
# Run Lighthouse audit
npm install -g lighthouse
lighthouse https://lukerobert.hair --view
```

Target scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

### SEO Setup

1. **Google Search Console**
   - Add property: lukerobert.hair
   - Verify ownership
   - Submit sitemap: https://lukerobert.hair/sitemap.xml

2. **Google Business Profile**
   - Create/claim business listing
   - Add website URL
   - Add photos and services

3. **Social Media**
   - Update bio links on Instagram
   - Update Facebook page
   - Add website to LinkedIn

### Monitoring Setup

1. **Error Tracking (Sentry)**
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

2. **Uptime Monitoring**
   - Use UptimeRobot or similar
   - Monitor: https://lukerobert.hair
   - Alert email: hello@lukerobert.hair

3. **Analytics**
   - Verify Google Analytics tracking
   - Set up conversion goals
   - Monitor traffic daily for first week

## 🔄 Ongoing Maintenance

### Weekly Tasks
- [ ] Review booking submissions
- [ ] Check education enquiries
- [ ] Monitor AI chat conversations
- [ ] Review generated content
- [ ] Check website uptime
- [ ] Review analytics

### Monthly Tasks
- [ ] Update service prices (if needed)
- [ ] Add new testimonials
- [ ] Review and update course offerings
- [ ] Check for broken links
- [ ] Update dependencies: `npm update`
- [ ] Review security advisories

### AI Content Management
- [ ] Review auto-generated posts weekly
- [ ] Approve or edit before publishing
- [ ] Ensure brand voice consistency
- [ ] Monitor AI costs (OpenAI usage)

## 🐛 Troubleshooting

### Common Issues

**Issue: Build fails on Vercel**
```bash
# Solution: Check build logs
# Common causes:
# - Missing environment variables
# - TypeScript errors
# - Import path issues
```

**Issue: AI chat not responding**
```bash
# Check:
# 1. OpenAI API key is set
# 2. API key has credits
# 3. Check Vercel function logs
```

**Issue: Forms not submitting**
```bash
# Check:
# 1. API routes are deployed
# 2. CORS settings
# 3. Browser console for errors
```

**Issue: Images not loading**
```bash
# Check:
# 1. Image domains in next.config.js
# 2. Image URLs are accessible
# 3. Vercel image optimization settings
```

## 📊 Success Metrics

Track these KPIs after launch:

**Week 1:**
- [ ] Website loads without errors
- [ ] At least 1 booking received
- [ ] AI chat used by visitors
- [ ] No critical bugs reported

**Month 1:**
- [ ] 10+ bookings received
- [ ] 5+ education enquiries
- [ ] 100+ unique visitors
- [ ] 50+ AI chat sessions

**Month 3:**
- [ ] Consistent booking flow
- [ ] Education courses booked
- [ ] Growing organic traffic
- [ ] Positive client feedback

## 🎉 Launch Day

### Pre-Launch (1 day before)
- [ ] Final content review
- [ ] Test all forms
- [ ] Verify contact information
- [ ] Check mobile experience
- [ ] Prepare social media posts

### Launch Day
- [ ] Deploy to production
- [ ] Verify everything works
- [ ] Announce on social media
- [ ] Email existing clients
- [ ] Monitor for issues

### Post-Launch (First Week)
- [ ] Monitor daily
- [ ] Respond to enquiries quickly
- [ ] Fix any bugs immediately
- [ ] Gather user feedback
- [ ] Make minor adjustments

## 📞 Emergency Contacts

**Technical Issues:**
- Vercel Support: https://vercel.com/support
- OpenAI Support: https://help.openai.com

**Domain Issues:**
- Domain registrar support

**Hosting Issues:**
- Check Vercel status: https://www.vercel-status.com

---

**Deployment Date:** _____________

**Deployed By:** _____________

**Production URL:** https://lukerobert.hair

**Admin URL:** https://lukerobert.hair/admin

**Status:** ⬜ Ready ⬜ In Progress ⬜ Complete
