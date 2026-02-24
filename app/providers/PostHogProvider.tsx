'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PHProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only initialize PostHog on production (miked.live)
    // Exclude localhost and staging (dev.miked.live)
    const isProduction = typeof window !== 'undefined' && window.location.hostname === 'miked.live'

    if (isProduction) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        persistence: 'localStorage',
        capture_pageview: false, // Manual pageview tracking via PageViewTracker component
      })
    }
  }, [])

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
