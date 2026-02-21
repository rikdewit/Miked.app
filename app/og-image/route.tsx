import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const revalidate = 3600 // Cache for 1 hour

export async function GET() {
  try {
    const playwright = await import('playwright')
    const browser = await playwright.chromium.launch({
      headless: true,
    })

    const context = await browser.createBrowserContext()
    const page = await context.newPage()

    // Set viewport to OG image dimensions
    await page.setViewportSize({ width: 1200, height: 630 })

    // Navigate to the homepage
    const baseUrl = process.env.VERCEL_ENV === 'production'
      ? 'https://miked.live'
      : process.env.VERCEL_ENV
        ? 'https://dev.miked.live'
        : 'http://localhost:3000'

    await page.goto(`${baseUrl}/`, {
      waitUntil: 'networkidle',
      timeout: 30000,
    })

    // Wait for the stage plot to render
    await page.waitForTimeout(2000)

    // Take screenshot
    const screenshot = await page.screenshot({ type: 'png' })

    await context.close()
    await browser.close()

    return new NextResponse(screenshot, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('OG image screenshot failed:', error)

    // Fallback: Return a simple gradient image if screenshot fails
    return new NextResponse(
      Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64'
      ),
      {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=3600',
        },
      }
    )
  }
}
