# Luke Robert Hair - Architecture Overview

Visual guide to the project structure and data flow.

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     USER INTERFACE                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   Home   │  │  Salon   │  │Education │  │   Book   │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Insights │  │  About   │  │ Contact  │  │  Admin   │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │         AI Chat Assistant (Always Visible)          │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   Chat   │  │ Contact  │  │ Bookings │  │  Leads   │  │
│  │   API    │  │   API    │  │   API    │  │   API    │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│  ┌──────────┐  ┌──────────────────────────────────────┐  │
│  │  Posts   │  │   Admin Content Generation API       │  │
│  │   API    │  └──────────────────────────────────────┘  │
│  └──────────┘                                              │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   BUSINESS LOGIC                            │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              Database Layer (lib/db.ts)             │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │  │
│  │  │ Contacts │  │ Bookings │  │  Leads   │         │  │
│  │  └──────────┘  └──────────┘  └──────────┘         │  │
│  │  ┌──────────┐  ┌──────────────────────┐           │  │
│  │  │  Posts   │  │   Chat Sessions      │           │  │
│  │  └──────────┘  └──────────────────────┘           │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES                          │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │   OpenAI API     │  │   Resend API     │               │
│  │  (GPT-4o-mini)   │  │  (Email - TBD)   │               │
│  └──────────────────┘  └──────────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Directory Structure

```
personal-website/
│
├── 📄 Configuration & Setup
│   ├── package.json              # Dependencies & scripts
│   ├── tsconfig.json             # TypeScript configuration
│   ├── tailwind.config.ts        # Design system & colors
│   ├── next.config.js            # Next.js configuration
│   ├── postcss.config.js         # PostCSS for Tailwind
│   ├── .gitignore                # Git ignore rules
│   ├── .env.local.example        # Environment template
│   └── .env.local.template       # Alternative template
│
├── 📖 Documentation
│   ├── README.md                 # Main documentation
│   ├── QUICK_START.md            # 5-minute setup guide
│   ├── SETUP.md                  # Detailed setup
│   ├── DEPLOYMENT.md             # Deployment checklist
│   ├── FEATURES.md               # Feature documentation
│   ├── ARCHITECTURE.md           # This file
│   └── PROJECT_SUMMARY.md        # Complete summary
│
├── 🎨 App Directory (Pages & Layouts)
│   ├── layout.tsx                # Root layout with fonts
│   ├── globals.css               # Global styles & utilities
│   ├── favicon.ico               # Site favicon
│   │
│   ├── page.tsx                  # 🏠 Home page
│   │
│   ├── 💇 Salon
│   │   └── page.tsx              # Services, gallery, locations
│   │
│   ├── 🎓 Education
│   │   └── page.tsx              # Courses, educator profile
│   │
│   ├── 👤 About
│   │   └── page.tsx              # Luke's story, philosophy
│   │
│   ├── 📝 Insights (Blog)
│   │   ├── page.tsx              # Blog listing
│   │   └── [id]/page.tsx         # Individual post
│   │
│   ├── 📧 Contact
│   │   └── page.tsx              # Contact form
│   │
│   ├── 📅 Book
│   │   └── page.tsx              # Booking system
│   │
│   ├── 🔐 Admin
│   │   └── page.tsx              # Dashboard
│   │
│   ├── 📜 Legal
│   │   ├── privacy/page.tsx      # Privacy policy
│   │   └── terms/page.tsx        # Terms of service
│   │
│   └── 🔌 API Routes
│       ├── chat/route.ts         # AI assistant endpoint
│       ├── contact/route.ts      # Contact form handler
│       ├── bookings/route.ts     # Booking management
│       ├── leads/route.ts        # Education enquiries
│       ├── posts/route.ts        # Blog posts API
│       └── admin/
│           └── generate-content/route.ts  # AI content generation
│
├── 🧩 Components (Reusable UI)
│   ├── Navigation.tsx            # Header with menu
│   ├── Footer.tsx                # Footer with links
│   ├── AIAssistant.tsx           # Chat widget
│   ├── ServiceCard.tsx           # Service display card
│   ├── CourseCard.tsx            # Course display card
│   └── TestimonialCard.tsx       # Testimonial display
│
└── 📚 Library (Business Logic)
    ├── types.ts                  # TypeScript interfaces
    ├── db.ts                     # Database operations
    ├── data.ts                   # Static data (services, courses)
    └── utils.ts                  # Helper functions
```

---

## 🔄 Data Flow Diagrams

### User Booking Flow
```
User visits /book
      ↓
Selects location (Cheshire/Oxford)
      ↓
Chooses service from dropdown
      ↓
Picks date and time
      ↓
Enters contact details
      ↓
Submits form
      ↓
POST /api/bookings
      ↓
Creates Contact in DB
      ↓
Creates Booking in DB
      ↓
Returns confirmation
      ↓
Shows success message
      ↓
(Future: Sends email via Resend)
```

### AI Chat Flow
```
User clicks chat icon
      ↓
Chat window opens
      ↓
User types message
      ↓
POST /api/chat
      ↓
Includes: messages[], current page
      ↓
Builds context-aware prompt
      ↓
Calls OpenAI GPT-4o-mini
      ↓
Receives AI response
      ↓
Returns to frontend
      ↓
Displays in chat window
      ↓
Saves to chat sessions DB
```

### AI Content Generation Flow
```
Admin clicks "Generate Content"
      ↓
POST /api/admin/generate-content
      ↓
For each category (3 total):
  ↓
  Generate post content via OpenAI
  ↓
  Create image prompt
  ↓
  (Future: Generate image via DALL-E)
  ↓
  Save post to database
      ↓
Returns success + post count
      ↓
Posts appear on /insights
```

### Education Enquiry Flow
```
User browses /education
      ↓
Clicks "Enquire Now" on course
      ↓
OR uses AI chat for recommendations
      ↓
Fills contact form
      ↓
POST /api/leads
      ↓
Creates Contact in DB
      ↓
Creates Lead in DB
      ↓
Returns confirmation
      ↓
Shows success message
      ↓
(Future: Sends notification email)
```

---

## 🗄️ Database Schema

### Contacts Table
```typescript
{
  id: string           // Unique identifier
  name: string         // Full name
  email: string        // Email address
  phone?: string       // Phone number (optional)
  type: string         // 'client' | 'education' | 'general'
  createdAt: Date      // Creation timestamp
}
```

### Bookings Table
```typescript
{
  id: string           // Unique identifier
  contactId: string    // Reference to Contact
  service: string      // Service ID
  location: string     // 'Cheshire' | 'Oxford'
  date: Date           // Appointment date/time
  status: string       // 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string       // Additional notes (optional)
}
```

### Leads Table
```typescript
{
  id: string           // Unique identifier
  contactId: string    // Reference to Contact
  course: string       // Course ID
  status: string       // 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  notes?: string       // Additional notes (optional)
  createdAt: Date      // Creation timestamp
}
```

### Blog Posts Table
```typescript
{
  id: string           // Unique identifier
  title: string        // Post title
  excerpt: string      // Short summary
  content: string      // Full content (markdown)
  category: string     // 'Salon Tips' | 'Education Insights' | 'Product Highlights'
  imageUrl: string     // Featured image URL
  publishedAt: Date    // Publication date
  aiGenerated: boolean // AI-generated flag
}
```

### Chat Sessions Table
```typescript
{
  id: string           // Unique identifier
  contactId?: string   // Reference to Contact (optional)
  messages: Array<{    // Conversation history
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }>
  page: string         // Page where chat occurred
  createdAt: Date      // Session start time
}
```

---

## 🔌 API Endpoints

### Public Endpoints

| Endpoint | Method | Purpose | Input | Output |
|----------|--------|---------|-------|--------|
| `/api/chat` | POST | AI assistant | messages[], page | AI response |
| `/api/contact` | POST | Contact form | name, email, phone, type, message | contactId |
| `/api/bookings` | POST | Create booking | contact details, service, location, date | bookingId |
| `/api/bookings` | GET | List bookings | - | bookings[] |
| `/api/leads` | POST | Education enquiry | contact details, course, notes | leadId |
| `/api/leads` | GET | List leads | - | leads[] |
| `/api/posts` | GET | Blog posts | category? | posts[] |

### Admin Endpoints

| Endpoint | Method | Purpose | Auth | Output |
|----------|--------|---------|------|--------|
| `/api/admin/generate-content` | POST | Generate AI posts | Password | posts[] |

---

## 🎨 Component Hierarchy

```
App Layout
├── Navigation
│   ├── Logo
│   ├── Desktop Menu
│   └── Mobile Menu (hamburger)
│
├── Page Content
│   ├── Home
│   │   ├── Hero Section
│   │   ├── Services Grid (ServiceCard × 4)
│   │   ├── Education Preview
│   │   ├── Testimonials (TestimonialCard × 3)
│   │   └── CTA Section
│   │
│   ├── Salon
│   │   ├── Hero
│   │   ├── Services (ServiceCard × 4)
│   │   ├── Gallery
│   │   ├── Testimonials (TestimonialCard × 3)
│   │   └── Locations
│   │
│   ├── Education
│   │   ├── Hero
│   │   ├── Educator Profile
│   │   ├── Courses (CourseCard × 4)
│   │   └── CTA
│   │
│   └── [Other Pages...]
│
├── Footer
│   ├── Brand Info
│   ├── Quick Links
│   ├── Contact Info
│   └── Social Links
│
└── AIAssistant (floating)
    ├── Chat Button
    └── Chat Window
        ├── Header
        ├── Messages
        └── Input Form
```

---

## 🔐 Security Architecture

```
┌─────────────────────────────────────────┐
│         SECURITY LAYERS                 │
│                                         │
│  1. Environment Variables               │
│     ├── .env.local (not in git)        │
│     └── Vercel Secrets                 │
│                                         │
│  2. Input Validation                    │
│     ├── Form validation                │
│     ├── Type checking (TypeScript)     │
│     └── Sanitization                   │
│                                         │
│  3. API Security                        │
│     ├── Rate limiting (to implement)   │
│     ├── CORS policies                  │
│     └── Request validation             │
│                                         │
│  4. Admin Protection                    │
│     ├── Password authentication        │
│     └── Session management             │
│                                         │
│  5. HTTPS/SSL                           │
│     └── Vercel automatic SSL           │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🚀 Deployment Architecture

### Development
```
Local Machine
├── npm run dev
├── localhost:3000
└── .env.local (secrets)
```

### Production (Vercel)
```
GitHub Repository
      ↓
Vercel Build
      ↓
Next.js Build Process
      ↓
Serverless Functions (API routes)
      ↓
Edge Network (CDN)
      ↓
Custom Domain (lukerobert.hair)
      ↓
Users worldwide
```

### External Services
```
Vercel Hosting
      ↕
OpenAI API (AI features)
      ↕
Resend API (emails - future)
      ↕
Supabase (database - future)
```

---

## 📊 Performance Architecture

### Optimization Strategies

1. **Code Splitting**
   - Automatic route-based splitting
   - Dynamic imports for heavy components
   - Lazy loading for images

2. **Caching**
   - Static page generation where possible
   - API response caching
   - Image optimization and caching

3. **Bundle Size**
   - Tree shaking unused code
   - Minimal dependencies
   - Optimized production build

4. **Loading Strategy**
   - Critical CSS inline
   - Fonts preloaded
   - Images lazy loaded
   - Scripts deferred

---

## 🔄 State Management

```
┌─────────────────────────────────────────┐
│         STATE ARCHITECTURE              │
│                                         │
│  Component State (useState)             │
│  ├── Form inputs                        │
│  ├── UI toggles                         │
│  └── Loading states                     │
│                                         │
│  Server State (API calls)               │
│  ├── Bookings data                      │
│  ├── Blog posts                         │
│  └── Chat messages                      │
│                                         │
│  URL State (Next.js routing)            │
│  ├── Current page                       │
│  ├── Query parameters                   │
│  └── Dynamic routes                     │
│                                         │
│  No Global State Management             │
│  (Not needed for this project)          │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🧪 Testing Strategy

### Current Testing
- Manual testing of all features
- TypeScript type checking
- ESLint code quality
- Build verification

### Future Testing (Recommended)
```
Unit Tests (Jest)
├── Component tests
├── Utility function tests
└── API route tests

Integration Tests (Playwright)
├── User flows
├── Form submissions
└── AI chat interactions

E2E Tests (Cypress)
├── Complete booking flow
├── Admin dashboard
└── Content generation
```

---

## 📈 Scalability Considerations

### Current Capacity
- In-memory database (development only)
- Suitable for 100-1000 users
- Manual content management

### Future Scaling
```
Phase 1: Database Migration
├── Move to Supabase/PostgreSQL
├── Handle 10,000+ users
└── Persistent data storage

Phase 2: Caching Layer
├── Redis for sessions
├── CDN for static assets
└── API response caching

Phase 3: Microservices
├── Separate AI service
├── Dedicated CRM service
└── Content management service
```

---

**Last Updated:** October 2025  
**Architecture Version:** 1.0
