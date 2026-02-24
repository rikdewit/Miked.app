'use client'

import { usePageView } from 'posthog-js/react'

/**
 * PageViewTracker
 *
 * Automatically captures pageviews for all routes in the app.
 * This is placed in the root layout to ensure all pages are tracked.
 *
 * Note: Only works on production (miked.live) since PostHog is only
 * initialized there via PostHogProvider.
 */
export function PageViewTracker() {
  usePageView()
  return null
}
