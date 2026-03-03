import React from 'react'
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'
import { Resend } from 'resend'
import { getSenderEmails } from '@/utils/get-sender-emails'

const resend = new Resend(process.env.RESEND_API_KEY)

// Helper function to dynamically load email template
async function loadEmailTemplate(templateFile: string): Promise<React.FC<any>> {
  try {
    const module = await import(`@/emails/content/${templateFile}`)

    // Get the component - try to find exported component matching the filename
    // First, try the exact export name (ChangelogLaunch, AnnouncementEmail, etc.)
    const exportName = templateFile
      .replace(/_\d{2}_\d{2}_\d{4}\.tsx$/, '') // Remove date suffix and .tsx

    if (module[exportName]) {
      return module[exportName]
    }

    // If not found, try getting the first export
    const exports = Object.values(module).filter((exp) => typeof exp === 'function')
    if (exports.length > 0) {
      return exports[0] as React.FC<any>
    }

    throw new Error(`No valid component export found in ${templateFile}`)
  } catch (error) {
    throw new Error(`Failed to load template: ${templateFile}. ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
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
      templateFile,
      subject,
      recipientEmails,
    } = body

    // Validate templateFile is provided
    if (!templateFile || typeof templateFile !== 'string') {
      return NextResponse.json(
        { error: 'templateFile is required (e.g., "AnnouncementEmail_03_03_2026.tsx")' },
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

    // Load the template dynamically
    let component: React.FC<any>
    try {
      component = await loadEmailTemplate(templateFile)
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : 'Failed to load template' },
        { status: 400 }
      )
    }

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
          react: React.createElement(component, {
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
        templateFile,
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
