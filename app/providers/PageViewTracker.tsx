'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { usePostHog } from 'posthog-js/react'

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
  const pathname = usePathname()
  const posthog = usePostHog()

  useEffect(() => {
    // PostHog's special pageview event
    posthog?.capture('$pageview')
  }, [pathname, posthog])

  return null
}
