import React from 'react'
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'
import { Resend } from 'resend'
import { ChangelogLaunch } from '@/emails/content/ChangelogLaunch_03_03_2026'
import { AnnouncementEmail } from '@/emails/content/AnnouncementEmail_03_03_2026'
import { getSenderEmails } from '@/utils/get-sender-emails'

const resend = new Resend(process.env.RESEND_API_KEY)

// Email template registry
const emailTemplates: Record<string, {
  component: React.FC<any>
}> = {
  changelog: {
    component: ChangelogLaunch,
  },
  announcement: {
    component: AnnouncementEmail,
  },
  // Add more templates here as needed
}

export async function POST(request: NextRequest) {
  try {
    // Verify API key
    const authHeader = request.headers.get('authorization')
    const apiKey = authHeader?.replace('Bearer ', '')

    if (!apiKey || apiKey !== process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      template = 'changelog',
      subject,
      recipientEmails,
    } = body

    // Validate template exists
    if (!emailTemplates[template]) {
      return NextResponse.json(
        { error: `Unknown email template: ${template}` },
        { status: 400 }
      )
    }

    // Subject is required
    if (!subject) {
      return NextResponse.json(
        { error: 'Subject is required' },
        { status: 400 }
      )
    }

    const templateConfig = emailTemplates[template]

    // Get subscribers - either from explicit list or from database
    let subscribers: { email: string }[] = []

    if (recipientEmails && Array.isArray(recipientEmails)) {
      // Use provided recipient list
      subscribers = recipientEmails.map(email => ({ email }))
    } else {
      // Get from database
      let subscribersQuery = supabase
        .from('subscribers')
        .select('email')
        .eq('subscribed', true)

      // Only send to all subscribers in production
      const isProduction = process.env.VERCEL_ENV === 'production'

      if (!isProduction) {
        subscribersQuery = subscribersQuery.eq('email', 'audio@rikdewit.nl')
      }

      const { data, error } = await subscribersQuery

      if (error) {
        console.error('Error fetching subscribers:', error)
        return NextResponse.json(
          { error: 'Failed to fetch subscribers' },
          { status: 500 }
        )
      }

      subscribers = data || []
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json(
        { message: 'No recipients to send to' },
        { status: 200 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://miked.live'
    const { rik } = getSenderEmails()
    let successCount = 0
    let failureCount = 0

    // Send to each recipient
    for (const subscriber of subscribers) {
      try {
        const unsubscribeUrl = `${baseUrl}/unsubscribe?email=${encodeURIComponent(subscriber.email)}`

        const response = await resend.emails.send({
          from: `Rik from Miked.live <${rik}>`,
          to: subscriber.email,
          subject,
          react: React.createElement(templateConfig.component, {
            email: subscriber.email,
            baseUrl,
          }),
          headers: {
            'List-Unsubscribe': `<${unsubscribeUrl}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          },
        })

        if (response.error) {
          console.error(`Failed to send to ${subscriber.email}:`, response.error)
          failureCount++
        } else {
          console.log(`Email sent to ${subscriber.email}:`, response.data?.id)
          successCount++
        }
      } catch (err) {
        console.error(`Error sending to ${subscriber.email}:`, err)
        failureCount++
      }
    }

    return NextResponse.json(
      {
        success: true,
        template,
        sent: successCount,
        failed: failureCount,
        total: subscribers.length,
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
