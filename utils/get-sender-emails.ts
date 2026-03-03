/**
 * Get sender emails based on environment
 * Production: support@miked.live, rik@miked.live
 * Development: dev-support@miked.live, dev-rik@miked.live
 */
export function getSenderEmails() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://miked.live'
  const isDev = appUrl.includes('localhost') || appUrl.includes('dev.')

  return {
    support: isDev ? 'dev-support@miked.live' : 'support@miked.live',
    rik: isDev ? 'dev-rik@miked.live' : 'rik@miked.live',
  }
}
