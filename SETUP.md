# Luke Robert Hair - Setup Guide

Complete setup instructions for deploying the Luke Robert Hair website.

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18 or higher installed
- npm or yarn package manager
- OpenAI API account (for AI features)
- Resend account (optional, for email notifications)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd personal-website
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- OpenAI SDK
- Lucide React (icons)

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your credentials:

```env
# Required: OpenAI API Key
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx

# Optional: Email service (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Required: Admin dashboard password
ADMIN_PASSWORD=your_secure_password_here

# Optional: External database (Supabase, PostgreSQL, etc.)
# DATABASE_URL=postgresql://user:password@host:port/database
```

#### Getting an OpenAI API Key:
1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new secret key
5. Copy and paste into `.env.local`

#### Getting a Resend API Key (Optional):
1. Go to https://resend.com/
2. Sign up for an account
3. Create an API key
4. Copy and paste into `.env.local`

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Test the Website

Visit these pages to verify everything works:
- **Home:** http://localhost:3000
- **Salon:** http://localhost:3000/salon
- **Education:** http://localhost:3000/education
- **About:** http://localhost:3000/about
- **Insights:** http://localhost:3000/insights
- **Contact:** http://localhost:3000/contact
- **Book:** http://localhost:3000/book
- **Admin:** http://localhost:3000/admin (use your ADMIN_PASSWORD)

### 5. Test AI Features

#### AI Chat Assistant:
1. Click the chat icon in the bottom-right corner
2. Try asking: "What services do you offer?"
3. Navigate to different pages and ask context-specific questions

#### AI Content Generation:
1. Go to http://localhost:3000/admin
2. Log in with your admin password
3. Click "Generate Content" button
4. Check http://localhost:3000/insights for new posts

## 🎨 Customization

### Update Brand Content

Edit `/lib/data.ts` to customize:
- Services and pricing
- Course offerings
- Testimonials

### Modify Colors

Edit `/tailwind.config.ts` to change the color scheme:

```typescript
colors: {
  sage: {
    DEFAULT: '#616F64',  // Change primary color
    light: '#C5CEBE',    // Change accent color
    pale: '#E5E9E3',
  },
  // ... other colors
}
```

### Update Contact Information

Edit `/components/Footer.tsx` to update:
- Phone number
- Email address
- Social media links
- Location details

### Customize AI Responses

Edit `/app/api/chat/route.ts` to modify:
- System prompts
- Brand voice
- Context-aware responses

## 📦 Building for Production

### Build the Application

```bash
npm run build
```

This creates an optimized production build in the `.next` folder.

### Test Production Build Locally

```bash
npm run build
npm start
```

Visit http://localhost:3000 to test the production build.

## 🚢 Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the easiest deployment option for Next.js:

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
vercel
```

3. **Add Environment Variables:**
   - Go to your project dashboard on Vercel
   - Navigate to Settings → Environment Variables
   - Add all variables from `.env.local`

4. **Deploy to Production:**
```bash
vercel --prod
```

**Custom Domain:**
- Go to Settings → Domains
- Add your custom domain (e.g., lukerobert.hair)
- Follow DNS configuration instructions

### Option 2: Replit

1. **Import Repository:**
   - Go to Replit.com
   - Click "Create Repl"
   - Choose "Import from GitHub"
   - Paste repository URL

2. **Configure Environment:**
   - Click "Secrets" (lock icon)
   - Add all environment variables from `.env.local`

3. **Run:**
   - Replit will auto-detect Next.js
   - Click "Run" button
   - Your site will be live at `https://your-repl-name.your-username.repl.co`

### Option 3: Self-Hosted (VPS/Cloud)

For AWS, DigitalOcean, or other VPS:

1. **Install Node.js on server:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Clone repository:**
```bash
git clone <your-repo-url>
cd personal-website
```

3. **Install dependencies:**
```bash
npm install
```

4. **Set environment variables:**
```bash
nano .env.local
# Add your variables
```

5. **Build and start:**
```bash
npm run build
npm start
```

6. **Use PM2 for process management:**
```bash
npm install -g pm2
pm2 start npm --name "luke-robert-hair" -- start
pm2 save
pm2 startup
```

7. **Configure Nginx as reverse proxy:**
```nginx
server {
    listen 80;
    server_name lukerobert.hair;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🗄️ Database Setup (Production)

The current implementation uses in-memory storage. For production, integrate a real database:

### Option 1: Supabase (Recommended)

1. **Create Supabase project:**
   - Go to https://supabase.com
   - Create new project
   - Get connection string

2. **Install Supabase client:**
```bash
npm install @supabase/supabase-js
```

3. **Update `/lib/db.ts`:**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Replace Map-based storage with Supabase queries
```

4. **Create tables:**
```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  type TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID REFERENCES contacts(id),
  service TEXT NOT NULL,
  location TEXT NOT NULL,
  date TIMESTAMP NOT NULL,
  status TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add other tables as needed
```

### Option 2: PostgreSQL

Use any PostgreSQL provider (Railway, Render, etc.) and an ORM like Prisma:

```bash
npm install prisma @prisma/client
npx prisma init
```

## 📧 Email Integration

To enable email notifications:

### Using Resend

1. **Install Resend:**
```bash
npm install resend
```

2. **Create email templates in `/lib/emails/`**

3. **Update API routes to send emails:**
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'Luke Robert Hair <hello@lukerobert.hair>',
  to: email,
  subject: 'Booking Confirmation',
  html: emailTemplate,
});
```

## 🔒 Security Checklist

Before going live:

- [ ] Change default admin password
- [ ] Add rate limiting to API routes
- [ ] Implement proper authentication (NextAuth.js)
- [ ] Enable HTTPS/SSL certificate
- [ ] Set up CORS policies
- [ ] Add input validation and sanitization
- [ ] Configure CSP headers
- [ ] Set up monitoring and error tracking (Sentry)
- [ ] Regular security updates for dependencies

## 📊 Analytics Setup

### Google Analytics

1. **Get tracking ID from Google Analytics**

2. **Add to `/app/layout.tsx`:**
```typescript
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
  strategy="afterInteractive"
/>
```

### Plausible Analytics (Privacy-friendly)

1. **Sign up at https://plausible.io**

2. **Add script to `/app/layout.tsx`:**
```typescript
<Script
  defer
  data-domain="lukerobert.hair"
  src="https://plausible.io/js/script.js"
/>
```

## 🧪 Testing

Run tests before deployment:

```bash
# Type checking
npm run build

# Lint
npm run lint

# Manual testing checklist
- [ ] All pages load correctly
- [ ] Forms submit successfully
- [ ] AI chat responds appropriately
- [ ] Admin dashboard accessible
- [ ] Mobile responsive
- [ ] Images load properly
- [ ] Navigation works
```

## 🆘 Troubleshooting

### Build Errors

**Error: "Module not found"**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Error: "OpenAI API key not found"**
- Verify `.env.local` exists
- Check variable name is exactly `OPENAI_API_KEY`
- Restart dev server after adding env variables

### Runtime Errors

**AI Chat not working:**
- Check OpenAI API key is valid
- Verify you have API credits
- Check browser console for errors

**Images not loading:**
- Verify image domains in `next.config.js`
- Check image URLs are accessible

## 📞 Support

For issues or questions:
- Check the README.md
- Review error logs in console
- Contact: hello@lukerobert.hair

---

**Last Updated:** October 2025
