<div align="center">
<img width="1200" height="475" alt="Miked.live Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Miked.live

Create a professional technical rider and stage plot for your band in 5 minutes. No account needed, instant results.

**Live:** https://miked.live
**Staging:** https://dev.miked.live

## Features

- 🎵 **Automatic Input List** — Generates mic/DI inputs based on instruments
- 📐 **Drag & Drop Stage Plot** — Interactive 3D stage builder with isometric preview
- 📄 **Direct PDF Export** — Download multi-page tech rider with diagrams
- 📊 **Analytics** — PostHog integration tracking user funnel and download success

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **3D Graphics:** Three.js, React Three Fiber
- **PDF Generation:** jsPDF + html2canvas
- **Rich Text:** Tiptap
- **Analytics:** PostHog
- **Deployment:** Vercel

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rikdewit/Miked.live.git
   cd Miked.live
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set environment variables in `.env.local`:
   ```bash
   # Analytics (PostHog - production only)
   NEXT_PUBLIC_POSTHOG_KEY=your_posthog_api_key
   NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com

   # Database & Authentication (Supabase)
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_publishable_key

   # Email Service (Resend)
   RESEND_API_KEY=your_resend_api_key

   # Magic Link URLs
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Email Sender Address
   SENDER_EMAIL=dev-support@miked.live
   ```

4. Run locally:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the app.

## Development Workflow

### Branch Structure

| Branch | Environment | Deployment |
|--------|-------------|------------|
| **develop** | Localhost + Staging (dev.miked.live) | Auto-deployed to staging |
| **main** | Production (miked.live) | Auto-deployed to production |

### Development Process

1. Create features on the **develop** branch
2. Test locally with `npm run dev`
3. Push to develop → auto-deploys to staging (dev.miked.live)
4. When ready, merge develop → main → deploys to production

See [CLAUDE.md](./CLAUDE.md) for detailed development instructions.

## Environment Variables Reference

### Local Development (`.env.local`)

| Variable | Value | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_POSTHOG_KEY` | Your PostHog API key | Analytics tracking (optional, production only) |
| `NEXT_PUBLIC_POSTHOG_HOST` | `https://eu.i.posthog.com` | PostHog endpoint |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Database & authentication |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase public key | Client-side API access (NOT service role key) |
| `RESEND_API_KEY` | Your Resend API key | Email service for magic links |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Magic link base URL (localhost) |
| `SENDER_EMAIL` | `dev-support@miked.live` | Sender email address |

### Production (Vercel Environment Variables)

**For `develop` branch (staging: dev.miked.live):**
```
NEXT_PUBLIC_APP_URL=https://dev.miked.live
SENDER_EMAIL=dev-support@miked.live
```

**For `main` branch (production: miked.live):**
```
NEXT_PUBLIC_APP_URL=https://miked.live
SENDER_EMAIL=support@miked.live
```

**Shared across all environments:**
```
NEXT_PUBLIC_POSTHOG_KEY=your_key
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_key
RESEND_API_KEY=your_key
```

### Getting Credentials

- **PostHog:** https://posthog.com (optional, analytics only)
- **Supabase:** https://supabase.com → Project Settings → API → Copy the "Public Key" (anon key)
- **Resend:** https://resend.com → API Keys → Create new key

### Supabase Database Setup

After creating a Supabase project, run these SQL commands in the SQL Editor:

```sql
-- Create riders table
CREATE TABLE riders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  rider_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create magic_links table
CREATE TABLE magic_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rider_id UUID REFERENCES riders(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for fast token lookup
CREATE INDEX idx_magic_links_token ON magic_links(token);
```

## Analytics

PostHog analytics tracks the user funnel on production only:

- `step_viewed` — Track progression through 5-step wizard
- `start_now_clicked` — Initial CTA click
- `download_initiated` — PDF download initiated
- `rider_downloaded` — Successful download with member count and logo status

**Analytics excludes:** localhost, dev.miked.live (staging)

View analytics at: https://eu.posthog.com/

## Build

To build for production:

```bash
npm run build
npm run start
```

## Project Structure

```
├── app/
│   ├── page.tsx               # Main app shell & step router
│   ├── layout.tsx             # Root layout with PostHog provider
│   ├── providers/
│   │   └── PostHogProvider.tsx # Analytics initialization
│   └── globals.css
├── components/
│   ├── Landing.tsx            # Step 0: Hero/CTA
│   ├── StepInstruments.tsx    # Step 1: Band members
│   ├── StepStagePlot.tsx      # Step 2: 3D stage builder
│   ├── StepDetails.tsx        # Step 3: Band info & logo
│   ├── Preview.tsx            # Step 4: PDF preview & download
│   └── ... other components
├── hooks/
│   └── useRiderState.ts       # Central state management
├── types.ts                    # TypeScript interfaces
├── constants.ts               # Instruments, defaults
└── utils/                     # Helper functions
```

## License

See [LICENSE](./LICENSE) file for details.
