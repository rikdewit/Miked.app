import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const imagePath = join(process.cwd(), 'public', 'OG-image.png')
    const imageBuffer = readFileSync(imagePath)

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (error) {
    console.error('Failed to serve og-image:', error)
    return NextResponse.json(
      { error: 'Image not found' },
      { status: 404 }
    )
  }
}
