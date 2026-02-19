# Miked.live Project Configuration

## Development & Deployment Workflow

### Branches

| Branch | Environment | Purpose | Deployment |
|--------|-------------|---------|------------|
| **develop** | Localhost (`npm run dev`) + Staging (dev.miked.live) | Feature development & testing | Auto-deployed to staging on Vercel |
| **main** | Production (miked.live) | Stable release | Auto-deployed to production on Vercel |

### Development Workflow

1. Create features on the **develop** branch
2. Test locally with `npm run dev` (localhost)
3. Push to develop → auto-deploys to staging (dev.miked.live)
4. When ready for production, merge develop → main
5. main auto-deploys to production (miked.live)

**Claude Code:** When adding new features, work on the **develop** branch. Always test locally before pushing.

### Commit & Push Policy

**Claude must NOT commit or push code without explicit permission.** This ensures you maintain control over what gets deployed.

- **Default:** Make code changes on develop, but stop before `git commit`
- **Only commit/push if the user explicitly says:**
  - "commit this" / "make a commit"
  - "push to production" / "deploy"
  - "push to staging"
- **When in doubt:** Ask the user before committing

## Analytics

PostHog analytics is configured to track only **production (miked.live)** data:
- **Events tracked:** `step_viewed`, `start_now_clicked`, `download_initiated`, `rider_downloaded`
- **Environments excluded:** localhost, dev.miked.live (staging)
- **Configuration:** `.env.local` (not committed, git-ignored)

This prevents development/testing activity from polluting production metrics.

