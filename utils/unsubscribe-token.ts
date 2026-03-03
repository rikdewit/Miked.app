import crypto from 'crypto'

// Use Resend API key as the HMAC secret for token signing
const SECRET_KEY = process.env.RESEND_API_KEY || 'fallback-secret-key'

if (!process.env.RESEND_API_KEY) {
  console.warn('⚠️ RESEND_API_KEY not set - token signing will use fallback secret key')
}

/**
 * Generate a signed unsubscribe token
 * Token format: email|timestamp|hmac
 */
export function generateUnsubscribeToken(email: string): string {
  const timestamp = Math.floor(Date.now() / 1000)
  const message = `${email}|${timestamp}`
  const hmac = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(message)
    .digest('hex')

  return `${message}|${hmac}`
}

/**
 * Verify and decode an unsubscribe token
 * Returns the email if valid, null if invalid
 * Optionally checks token expiration (in seconds)
 */
export function verifyUnsubscribeToken(
  token: string,
  maxAge: number = 30 * 24 * 60 * 60 // 30 days default
): string | null {
  try {
    const parts = token.split('|')
    if (parts.length !== 3) {
      return null
    }

    const [email, timestampStr, providedHmac] = parts
    const timestamp = parseInt(timestampStr, 10)

    // Check if token has expired
    const now = Math.floor(Date.now() / 1000)
    if (now - timestamp > maxAge) {
      return null
    }

    // Verify HMAC
    const message = `${email}|${timestamp}`
    const expectedHmac = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(message)
      .digest('hex')

    if (providedHmac !== expectedHmac) {
      return null
    }

    return email
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}
