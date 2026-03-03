import React from 'react'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { ChangelogLaunch } from '@/emails/content/ChangelogLaunch'
import { generateUnsubscribeToken } from '@/utils/unsubscribe-token'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const senderEmail = process.env.SENDER_EMAIL || 'updates@miked.live'
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://miked.live'

    // Generate signed unsubscribe token
    const unsubscribeToken = generateUnsubscribeToken(email)

    const emailResponse = await resend.emails.send({
      from: senderEmail,
      to: email,
      subject: '🎸 Miked.live Launches',
      react: React.createElement(ChangelogLaunch, {
        email,
        baseUrl,
        unsubscribeToken,
      }),
    })

    if (emailResponse.error) {
      console.error('Changelog email send error:', emailResponse.error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    console.log(`[RESEND] Changelog email sent to ${email}:`, emailResponse.data?.id)

    return NextResponse.json(
      {
        success: true,
        message: 'Changelog email sent successfully',
        emailId: emailResponse.data?.id,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
