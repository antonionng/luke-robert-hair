# ⚡ Quick Start Guide

Get Luke Robert Hair website running in 5 minutes!

## 🎯 Prerequisites
- Node.js 18+ installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## 🚀 Installation (3 Steps)

### Step 1: Install Dependencies
```bash
cd personal-website
npm install
```
⏱️ Takes ~2 minutes

### Step 2: Configure Environment
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your OpenAI API key:
```env
OPENAI_API_KEY=sk-proj-your-key-here
ADMIN_PASSWORD=your-secure-password
```

### Step 3: Run Development Server
```bash
npm run dev
```

🎉 **Done!** Open http://localhost:3000

---

## 📍 Important URLs

| Page | URL | Purpose |
|------|-----|---------|
| **Home** | http://localhost:3000 | Main landing page |
| **Salon** | http://localhost:3000/salon | Services & pricing |
| **Education** | http://localhost:3000/education | Courses catalog |
| **Book** | http://localhost:3000/book | Appointment booking |
| **Admin** | http://localhost:3000/admin | Dashboard (password required) |

---

## 🧪 Quick Test

### Test AI Chat (30 seconds)
1. Click chat icon (bottom-right)
2. Type: "What services do you offer?"
3. Should get intelligent response ✅

### Test Booking (1 minute)
1. Go to http://localhost:3000/book
2. Fill out form
3. Submit
4. Should see confirmation ✅

### Test Admin (30 seconds)
1. Go to http://localhost:3000/admin
2. Enter password (from .env.local)
3. Click "Generate Content"
4. Should create 3 new blog posts ✅

---

## 🎨 Customization (5 minutes)

### Update Services & Prices
Edit: `/lib/data.ts`
```typescript
export const services: Service[] = [
  {
    id: 'precision-cut',
    name: 'Precision Cut',
    price: '£65',  // ← Change price here
    // ...
  },
];
```

### Change Colors
Edit: `/tailwind.config.ts`
```typescript
colors: {
  sage: {
    DEFAULT: '#616F64',  // ← Change primary color
  },
}
```

### Update Contact Info
Edit: `/components/Footer.tsx`
- Phone number
- Email address
- Social media links

---

## 🚢 Deploy to Production (10 minutes)

### Option 1: Vercel (Easiest)
```bash
npm install -g vercel
vercel login
vercel
```
Follow prompts, then add environment variables in Vercel dashboard.

### Option 2: Replit
1. Go to Replit.com
2. Import from GitHub
3. Add environment variables in Secrets
4. Click Run

**Full deployment guide:** See `DEPLOYMENT.md`

---

## 🆘 Troubleshooting

### AI Chat Not Working?
```bash
# Check your API key
cat .env.local | grep OPENAI_API_KEY

# Restart server
npm run dev
```

### Build Errors?
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use?
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

---

## 📚 Full Documentation

- **README.md** - Project overview
- **SETUP.md** - Detailed setup guide
- **DEPLOYMENT.md** - Production deployment
- **FEATURES.md** - All features explained
- **PROJECT_SUMMARY.md** - Complete summary

---

## ✅ Checklist Before Launch

- [ ] OpenAI API key added
- [ ] Admin password changed
- [ ] Contact information updated
- [ ] Service prices verified
- [ ] All pages tested
- [ ] Mobile view checked
- [ ] AI chat working
- [ ] Forms submitting
- [ ] Ready to deploy! 🚀

---

## 💡 Pro Tips

1. **Test AI Chat on Every Page** - It's context-aware!
2. **Generate Content Weekly** - Keep blog fresh
3. **Check Admin Dashboard Daily** - Monitor bookings
4. **Update Testimonials** - Add real client reviews
5. **Monitor OpenAI Usage** - Keep costs in check

---

## 🎉 You're Ready!

Your AI-powered website is complete and ready to launch.

**Need Help?** Check the documentation files or review error logs.

**Ready to Deploy?** Follow `DEPLOYMENT.md` for step-by-step instructions.

**Questions?** All features are documented in `FEATURES.md`.

---

**Built with Next.js 14 + TypeScript + Tailwind CSS + OpenAI**

**Time to Launch:** ~15 minutes from now! ⚡
