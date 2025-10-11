# Luke Robert Hair - AI-Powered Website

A modern, intelligent, AI-powered website for Luke Robert Hair, combining premium salon services with professional education.

## 🎯 Features

### Core Functionality
- **Beautiful Modern UI** - Inspired by editorial design with sage green color palette
- **Responsive Design** - Optimized for all devices
- **AI Chat Assistant** - Context-aware chatbot powered by OpenAI GPT-4o-mini
- **AI Content Engine** - Automatically generates blog posts with AI-created content
- **CRM System** - Tracks clients, bookings, leads, and chat sessions
- **Admin Dashboard** - Manage all aspects of the business

### Pages
- **Home** - Hero section, services overview, education preview, testimonials
- **Salon** - Full service listings, transformations gallery, locations
- **Education** - Course catalog, educator profile, AI course recommendations
- **About** - Luke's story, philosophy, timeline, brand collaborations
- **Insights** - AI-generated blog with salon tips and education content
- **Contact** - Contact form with AI-assisted enquiry routing
- **Book** - Appointment booking system with location selection
- **Admin** - Dashboard for managing bookings, leads, and content generation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation

1. **Clone and install dependencies:**
```bash
cd personal-website
npm install
```

2. **Set up environment variables:**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your API keys:
```env
OPENAI_API_KEY=your_openai_api_key_here
RESEND_API_KEY=your_resend_api_key_here
ADMIN_PASSWORD=your_secure_password_here
```

3. **Run the development server:**
```bash
npm run dev
```

4. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Design System

### Brand Colors
- **Deep Sage** (#616F64) - Primary brand color
- **Pale Sage** (#C5CEBE) - Accent color
- **Off-White** (#FAFAF8) - Background
- **Graphite** (#2C2C2C) - Text
- **Mist Grey** (#E9E9E7) - Dividers

### Typography
- **Headings:** Playfair Display (elegant serif)
- **Body:** Inter (modern sans-serif)

### Components
- Rounded buttons with hover animations
- Soft shadows and transitions
- Editorial-style image layouts
- Generous whitespace

## 🤖 AI Systems

### AI Chat Assistant
- Always visible in bottom-right corner
- Context-aware based on current page
- Helps with service selection and course recommendations
- Stores conversations in CRM

### AI Content Engine
- Generates 3 blog posts weekly
- Categories: Salon Tips, Education Insights, Product Highlights
- AI-generated images (DALL-E integration ready)
- Auto-publishes to Insights page

### CRM Integration
- Tracks all contacts and interactions
- Manages bookings and education leads
- Stores chat sessions for analysis
- Admin dashboard for oversight

## 📁 Project Structure

```
personal-website/
├── app/
│   ├── (pages)/
│   │   ├── page.tsx              # Home
│   │   ├── salon/page.tsx        # Salon services
│   │   ├── education/page.tsx    # Education courses
│   │   ├── about/page.tsx        # About Luke
│   │   ├── insights/page.tsx     # Blog
│   │   ├── contact/page.tsx      # Contact form
│   │   ├── book/page.tsx         # Booking system
│   │   └── admin/page.tsx        # Admin dashboard
│   ├── api/
│   │   ├── chat/route.ts         # AI chat endpoint
│   │   ├── contact/route.ts      # Contact form handler
│   │   ├── bookings/route.ts     # Booking management
│   │   └── admin/
│   │       └── generate-content/route.ts  # AI content generation
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/
│   ├── Navigation.tsx            # Main navigation
│   ├── Footer.tsx                # Footer
│   ├── AIAssistant.tsx           # Chat widget
│   ├── ServiceCard.tsx           # Service display
│   ├── CourseCard.tsx            # Course display
│   └── TestimonialCard.tsx       # Testimonial display
├── lib/
│   ├── types.ts                  # TypeScript types
│   ├── db.ts                     # Database layer
│   ├── data.ts                   # Static data
│   └── utils.ts                  # Utility functions
└── public/                       # Static assets
```

## 🔧 Configuration

### Tailwind CSS
Custom configuration in `tailwind.config.ts` with brand colors and animations.

### Next.js
Configured for optimal performance with image optimization and API routes.

### TypeScript
Strict mode enabled for type safety.

## 📊 Admin Dashboard

Access at `/admin` with password authentication.

**Features:**
- View stats (contacts, bookings, leads, posts)
- Generate AI content on-demand
- Manage bookings and education enquiries
- View chat session history

**Default Password:** `admin123` (change in production!)

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Replit
1. Import repository
2. Set environment variables
3. Run `npm install && npm run build && npm start`

### Environment Variables for Production
- `OPENAI_API_KEY` - Required for AI features
- `RESEND_API_KEY` - Optional for email notifications
- `ADMIN_PASSWORD` - Required for admin access
- `DATABASE_URL` - Optional for external database (Supabase)

## 🔐 Security Notes

1. **Admin Password:** Change default password immediately
2. **API Keys:** Never commit `.env.local` to version control
3. **Database:** Current in-memory DB is for demo only - use Supabase for production
4. **Authentication:** Implement proper auth (NextAuth.js) for production admin

## 📈 Performance

- **Lighthouse Score Target:** 95+
- **Load Time:** < 2 seconds
- **Image Optimization:** Next.js automatic optimization
- **Code Splitting:** Automatic with Next.js App Router

## 🎓 AI Content Strategy

**Weekly Schedule:**
- Monday 9:00 AM: Auto-generate 3 new posts
- Categories rotate: Salon Tips → Education → Products
- AI matches Luke's brand voice
- Images generated with DALL-E (or use Unsplash)

## 📞 Support & Customization

For customization or support:
- Update content in `lib/data.ts`
- Modify colors in `tailwind.config.ts`
- Adjust AI prompts in `app/api/chat/route.ts`
- Customize email templates (when integrated)

## 📝 License

Private project for Luke Robert Hair.

---

**Built with:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion, OpenAI GPT-4o-mini

**Design Inspiration:** Fabrxio.com editorial layout
