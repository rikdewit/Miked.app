# Miked.live Context Guide
## For Developers & Builders New to the Project

**Purpose:** This document provides essential background about Miked.live for team members who are new to the project.

**Audience:** Developers, Designers, QA Engineers, Product Managers joining mid-project

**Created:** February 25, 2026

---

## Table of Contents
1. [What is Miked.live?](#what-is-mikedlive)
2. [The Problem It Solves](#the-problem-it-solves)
3. [The Music Industry Context](#the-music-industry-context)
4. [User Personas](#user-personas)
5. [Product Strategy](#product-strategy)
6. [Current State of Development](#current-state-of-development)
7. [Tech Stack & Architecture](#tech-stack--architecture)
8. [Deployment & Environments](#deployment--environments)
9. [Project Structure](#project-structure)
10. [Key Resources](#key-resources)

---

## What is Miked.live?

### 30-Second Pitch

**Miked.live** is a web-based platform for musicians to create professional **technical riders** — documents that tell sound engineers exactly what equipment a band needs for a live performance.

Think of it as a "Figma for technical riders" — collaborative, digital, and shareable instead of static Word documents.

### The Product

**Core Offering:**
- 🎸 Musicians create a rider describing:
  - Band member names & instruments
  - Microphone specifications for each instrument
  - Stage plot (physical layout of band on stage)
  - Power requirements (electrical outlets needed)
  - Technical notes & special requests

- 📋 Rider generates a professional PDF with:
  - Printable stage diagram
  - Input list (what each musician needs)
  - Clean, engineer-friendly format

- 🤝 Share with venue/engineer via link
  - No account required for engineers to view
  - Can download PDF or view online
  - (NEW MVP FEATURE) Comment directly on rider for clarifications

### Current Status

- ✅ MVP launched (basic rider creation & PDF export)
- 🔄 Adding collaboration features (comments, notifications)
- 🚀 Expanding to multi-user editing, communication

---

## The Problem It Solves

### Pain Points (Before Miked.live)

**For Musicians:**
- "Creating a rider is tedious — I'm copying from an old Word doc every time"
- "I don't know what I should include — is SM57 or SM48 better?"
- "I send the rider to the venue, but I never know if the engineer actually saw it"
- "When I need to change something, I have to send a whole new PDF"

**For Venues & Bookers:**
- "Bands send me incomplete riders, I have to chase them for details"
- "I forward the rider to the engineer, but nobody communicates — I'm in the middle"
- "It's hard to track what we received and when"

**For Sound Engineers:**
- "I receive 10 riders a week, many are incomplete or confusing"
- "Questions go to the booker, answers come back through the booker — slow and lossy"
- "Some riders are 3D art with shadows and colors — when I print them on the venue's crappy black-and-white printer, they're unreadable"
- "I don't see stage dimensions that match the plot, monitor directions are unclear"

### How Miked.live Solves It

✅ **Musicians:** Pre-built templates, smart defaults, fewer decisions needed
✅ **Venues:** Centralized rider management, clear tracking
✅ **Engineers:** Clean, printable PDFs with essential info, direct communication channel (MVP feature)

---

## The Music Industry Context

### Why This Matters

**Live music industry scale:**
- Hundreds of thousands of live performances happen weekly globally
- Each performance needs a technical rider to coordinate between band & venue
- Currently, riders are fragmented across email, Word docs, PDFs, shared drives

**Economic impact:**
- Miscommunication → sound check delays → late starts → unhappy audience
- Engineers spending time on incomplete riders instead of prep
- Bands losing gigs because they seem unprofessional ("no rider? No respect from us")

### Rider Types

**There are two main rider types:**

1. **Contractual Riders** ← NOT what Miked.live does
   - What the venue PROVIDES (PA system, monitor setup, dressing room specs)
   - Usually managed by venue

2. **Band Riders** ← THIS is what Miked.live does
   - What the band NEEDS (microphones, stage plot, power drops)
   - Tells engineer how to configure the system
   - This is Miked.live's focus

### Who Attends Live Shows?

- **Small venues:** Local bars, clubs (50-500 people)
  - One engineer, often part-time or freelance
  - Bands are semi-pro or hobbyist
  - Limited budget

- **Medium venues:** Theaters, halls (500-2000 people)
  - 1-2 engineers, more professionalized
  - Mix of semi-pro and touring bands
  - More sophisticated sound systems

- **Large venues:** Festivals, arenas (2000+ people)
  - Full technical crew
  - Professional touring acts
  - High-end equipment (but Miked.live target: smaller venues)

**Miked.live Target:** Small to medium venues, local/regional touring bands

---

## User Personas

### 1. The Gear-Aware Musician (ICP-1)

**Profile:**
- Knows their own gear well (e.g., "my amp always needs SM57 mic")
- Doesn't know all the technical details (drums, bass setup)
- Wants to specify what they're sure about, defer the rest

**Example:** Matthijs, guitarist in a local rock band

**Motivation:** "I want to be professional and communicate my needs clearly, but I don't want to pretend I know things I don't"

**What they use Miked.live for:**
- Fill in specific mic choices for their own instrument
- Leave standard settings for other instruments ("Ask engineer")
- Send a rider that shows confidence in what they know

---

### 2. The "Just Figure It Out" Musician (ICP-2)

**Profile:**
- Small hobbyist band (weekend gigs)
- Doesn't understand audio terms (input channels, DI, phantom power)
- "We have drums, bass, guitars, vocals — the engineer will figure out the rest"

**Example:** Afke, drummer in a cover band

**Motivation:** "I want to book gigs without spending hours on technical stuff. I just want to play"

**What they use Miked.live for:**
- Quick, simple form: "Band name? Instruments? Contact info? Done."
- One-page rider with minimal technical detail
- Direct phone number so engineer can call if they have questions

---

### 3. The Band Coordinator (ICP-3)

**Profile:**
- Takes on organizational role for the band (not always the most technical)
- Coordinates with venue, manages pre-show comms
- Wants band members to contribute input (drummer fills in drum mic needs)
- Wants to know if engineer got the rider and if they have questions

**Example:** Lars, singer who books gigs for his band

**Motivation:** "I want to manage our technical communication efficiently. I don't want to be a middleman between band members and the engineer"

**What they use Miked.live for:**
- Create a rider template once
- Invite band members to fill in their sections
- See comments from engineer
- Update in real-time as questions come in
- Get notification when engineer has viewed the rider

---

### 4. The Sound Engineer / FOH Tech (ICP-4)

**Profile:**
- Freelance or venue-based sound technician
- Expert in audio systems
- Receives 5-10 riders per week
- Often has to print riders (sometimes on bad printers)

**Example:** Michiel, freelance engineer who works multiple venues

**Motivation:** "I need essential info fast. No decorative 3D nonsense. When I have questions, I want to ask them directly, not through 3 intermediaries"

**What they use Miked.live for:**
- View rider link (no login)
- Scan for: How many inputs? What mics? What power needed?
- Print rider in black-and-white (must be readable)
- Ask clarifying questions directly to band lead
- Get notified when band updates the rider

---

## Product Strategy

### Vision

Miked.live becomes **the communication hub for live music coordination**.

Not just a PDF generator, but a bridge between bands and venues that:
1. Eliminates email miscommunication
2. Speeds up pre-show prep
3. Builds a network effect (bands → venues → engineers all using the platform)

### Three-Layer Strategy

**Layer 1: Simple (Now)**
- Rider creation and PDF export
- Works for musicians who just need a basic template

**Layer 2: Collaborative (MVP - Now)**
- Comments & annotations on riders
- Direct engineer communication
- Multi-user editing (band members contribute)

**Layer 3: Connected (Future)**
- Venue integrations
- Engineer booking & dispatch
- Analytics (which riders are clearest, fastest to prep)
- Secondary revenue (premium features for venues/engineers)

### Current MVP Focus

**This sprint:** Add **commenting & notifications** so bands can get feedback from engineers without email

Why? Because:- Without communication, riders are just documents
- Most friction happens in the Q&A phase (engineer gets rider, has questions, tries to reach band through venue)
- If Miked.live solves communication, it becomes essential (not optional)

---

## Current State of Development

### What's Already Built

✅ User authentication (signup/login with email)
✅ Rider creation wizard (band name, members, instruments)
✅ Stage plot drawing tool (drag & drop band members)
✅ Input list editor (specify mics for each instrument)
✅ PDF export (downloads professionally formatted rider)
✅ Basic rider storage (database)
✅ Share link generation (public riders viewable without login)

### What's Being Built (This Sprint)

🔄 **Comments & Annotations** ← This is the MVP you're building
- Add comment widget to rider view
- Store comments in database
- Send email notifications
- Mark comments resolved

### What's Planned (Future)

🎯 Multi-user editing (band members contribute simultaneously)
🎯 Offline mode (create rider without internet)
🎯 Mobile app (iOS/Android)
🎯 Integrations (Slack, Zapier, venue management systems)

---

## Tech Stack & Architecture

### Frontend

- **Framework:** React (or Next.js)
- **Styling:** Tailwind CSS / styled-components (check codebase)
- **State:** Context API or Redux (check existing implementation)
- **Build:** Webpack or Vite
- **Testing:** Jest + React Testing Library

### Backend

- **Runtime:** Node.js
- **Framework:** Express (or similar REST API)
- **Database:** PostgreSQL
- **Cache:** Redis (optional, for rate limiting)
- **Email:** SendGrid or Mailgun

### Infrastructure

- **Frontend Hosting:** Vercel
- **Backend:** AWS EC2 / Lambda or similar
- **Database:** AWS RDS or managed PostgreSQL
- **Storage:** AWS S3 (for PDF exports)
- **CDN:** Cloudflare

### Tooling

- **Version Control:** Git (GitHub)
- **Package Manager:** npm / yarn / bun
- **CI/CD:** GitHub Actions or similar
- **Monitoring:** Sentry (error tracking)

---

## Deployment & Environments

### Branches & Deployments

| Branch | Environment | URL | Auto-Deploy? |
|--------|-------------|-----|--------------|
| `main` | Production | miked.live | ✅ Yes (Vercel) |
| `develop` | Staging | dev.miked.live | ✅ Yes (Vercel) |
| feature/* | Local | localhost | ❌ Manual |

### Workflow (Important!)

1. **Create feature on `develop` branch**
2. **Test locally** with `npm run dev` (localhost)
3. **Push to develop** → auto-deploys to staging (dev.miked.live)
4. **Test on staging** → check features work
5. **Create PR** from develop → main (requires approval)
6. **Merge PR** → auto-deploys to production (miked.live)

**Key Rule:** Never commit/push without explicit permission. Code changes should stop before git commit unless user says "commit this" or "push to staging".

### Environments File

`.env.local` contains:
- Database connection string
- API keys (SendGrid, etc.)
- Frontend URLs
- Feature flags

**Note:** This file is git-ignored (not in repo). You'll get it from team/docs.

---

## Project Structure

### Typical Folder Layout

```
miked-live/
├── docs/                      # Documentation
│   ├── icp-and-use-cases.md  # User personas & scenarios
│   ├── mvp-communication-prd.md # (This PRD)
│   └── miked-live-context-for-builders.md # (This file)
│
├── src/
│   ├── components/
│   │   ├── RiderEditor.tsx    # Main rider creation UI
│   │   ├── StagePlot.tsx      # Stage diagram
│   │   ├── InputList.tsx      # Instrument & mic selector
│   │   ├── Comments/          # (NEW MVP)
│   │   │   ├── CommentForm.tsx
│   │   │   ├── CommentThread.tsx
│   │   │   ├── CommentSidebar.tsx
│   │   │   └── NotificationBell.tsx
│   │   └── ...
│   │
│   ├── pages/
│   │   ├── /riders            # Rider list
│   │   ├── /riders/[id]       # View/edit rider
│   │   ├── /riders/[id]/share # Share rider
│   │   └── ...
│   │
│   ├── api/
│   │   ├── riders.ts          # Rider CRUD
│   │   ├── comments.ts        # (NEW MVP) Comment endpoints
│   │   ├── auth.ts            # Authentication
│   │   └── ...
│   │
│   ├── lib/
│   │   ├── db.ts              # Database connection
│   │   ├── email.ts           # Email service (SendGrid)
│   │   ├── pdf.ts             # PDF generation
│   │   └── ...
│   │
│   ├── types/
│   │   ├── rider.ts
│   │   ├── comment.ts         # (NEW MVP)
│   │   ├── user.ts
│   │   └── ...
│   │
│   └── App.tsx / _app.tsx     # Root component
│
├── tests/
│   ├── components/
│   ├── api/
│   └── ...
│
├── .env.local                 # (git-ignored) Environment vars
├── .env.example               # Template for .env.local
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── next.config.js / vite.config.js # Build config
└── README.md                  # Project overview
```

### Finding Your Way Around

**To understand the codebase:**
1. Read `README.md` first
2. Look at `/pages` to understand routing
3. Check `/components` to see how UI is built
4. Review `/api` to understand data flow
5. Look at `/types` to see data models

**For the MVP (comments feature):**
- You'll likely create new files in `/components/Comments/`
- Add new API endpoints in `/api/comments.ts`
- Add new types in `/types/comment.ts`
- Update database schema (migrations)

---

## Key Resources

### Documentation

- **Project README:** `README.md` (start here)
- **ICP & Use Cases:** `docs/icp-and-use-cases.md` (understand users)
- **MVP PRD:** `docs/mvp-communication-prd.md` (detailed requirements)
- **This File:** `docs/miked-live-context-for-builders.md` (you are here)

### Code References

- **Rider Types:** `src/types/rider.ts`
- **Rider Components:** `src/components/RiderEditor.tsx`, `StagePlot.tsx`, `InputList.tsx`
- **API Routes:** `src/api/` folder
- **Database:** Check `src/lib/db.ts` for connection; migrations in `migrations/` folder

### External Resources

- **Tailwind CSS:** https://tailwindcss.com/docs
- **React Docs:** https://react.dev
- **Next.js Docs:** https://nextjs.org/docs (if using Next.js)
- **PostgreSQL:** https://www.postgresql.org/docs/
- **SendGrid:** https://sendgrid.com/docs (for email)

### Team & Communication

- **Slack Channel:** #miked-live-dev (if applicable)
- **GitHub Issues:** Check GitHub project for open issues
- **Standups:** [Time/Frequency — ask team]
- **Code Review:** Use GitHub PR reviews; request feedback from [maintainers]

---

## Common Gotchas & Tips

### 1. The "Magic Link" Auth Pattern

Engineers view riders without creating an account. This uses a "magic link" system:
- Generate random token, store in database with expiration
- Send email link with token
- Token validates user without password

**When building comments:** Make sure unauthenticated engineers can still add comments.

### 2. PDF Export is Tricky

The PDF export likely uses a library like:
- **PDFKit** (Node.js)
- **react-pdf** (browser-based)
- **Puppeteer** (headless Chrome → PDF)

Changing stage plot or layout might break PDF. Test exports after every change.

### 3. Database Migrations

When adding the comments table, use migrations (don't just alter DB manually):
```bash
npm run migrate:create add_comments_table
# Edit migration file
npm run migrate:up
```

This ensures all environments (local, staging, prod) stay in sync.

### 4. Email Delivery is Not Instant

SendGrid typically delivers within seconds, but:
- Spam filters might delay
- Verify `from` address is whitelisted
- Test with staging environment first

### 5. Rate Limiting Comments

Engineers might spam comments. Implement rate limiting:
```typescript
// e.g., 10 comments per IP per hour
const rateLimitComments = (ip: string) => {
  // Check: how many comments from this IP in last hour?
  // If > 10, reject
}
```

Check Redis or in-memory store for this.

### 6. Accessibility Matters

The PDF must be printable on bad printers (B&W, low quality). This means:
- No reliance on color alone
- High contrast
- Clear text (no shadows, gradients)
- Test print on actual bad printer if possible

### 7. Time Zones

When logging "viewed at 2:15pm", remember:
- User is in Europe (Miked.live focus)
- Store timestamps in UTC in database
- Convert to user's timezone on frontend

---

## Quick Start Checklist

If you're joining to work on comments MVP, here's your checklist:

- [ ] Clone repo: `git clone <repo-url>`
- [ ] Install deps: `npm install`
- [ ] Get `.env.local` from team (ask for credentials)
- [ ] Start dev server: `npm run dev`
- [ ] Visit http://localhost:3000
- [ ] Create a test rider, try PDF export
- [ ] Read `docs/icp-and-use-cases.md` (20 min)
- [ ] Read `docs/mvp-communication-prd.md` (30 min)
- [ ] Look at existing components (`RiderEditor.tsx`, etc.)
- [ ] Review database schema
- [ ] Ask questions in #miked-live-dev or with team lead

---

## Questions?

If anything in this document is unclear:

1. **Check the codebase first** — Often the code is clearer than docs
2. **Ask in Slack or team chat** — People are usually helpful
3. **Open a GitHub issue** — Document it for future folks
4. **Read the PRD again** — Sometimes a second read makes things click

Good luck! Welcome to Miked.live 🎸

---

**Document Version:** 1.0
**Last Updated:** February 25, 2026
**Maintained By:** Miked.live Product Team
