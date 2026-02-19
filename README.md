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
   NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key_here
   NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
   ```
   (PostHog credentials are only needed for production tracking)

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
