import { NextRequest, NextResponse } from 'next/server'
import { render } from '@react-email/render'
import { Resend } from 'resend'
import { ChangelogLaunch } from '@/emails/content/ChangelogLaunch'
import { generateUnsubscribeToken } from '@/utils/unsubscribe-token'
import { getSenderEmails } from '@/utils/get-sender-emails'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://miked.live'
    const { rik: senderEmailAddress } = getSenderEmails()
    const senderEmail = `Rik from miked.live <${senderEmailAddress}>`

    // Fetch all contacts from Resend
    console.log('Fetching all contacts from Resend...')
    const contactsResponse = await resend.contacts.list()

    let targetEmails: string[] = []
    if (contactsResponse.data) {
      if (Array.isArray(contactsResponse.data)) {
        targetEmails = contactsResponse.data
          .filter((c: any) => c.email && !c.unsubscribed)
          .map((c: any) => c.email)
      } else if (contactsResponse.data.data && Array.isArray(contactsResponse.data.data)) {
        targetEmails = contactsResponse.data.data
          .filter((c: any) => c.email && !c.unsubscribed)
          .map((c: any) => c.email)
      }
    }

    if (!targetEmails.length) {
      return NextResponse.json(
        { message: 'No contacts found to send to' },
        { status: 200 }
      )
    }

    console.log(`Found ${targetEmails.length} contacts to send to`)

    const sendResults = {
      sent: 0,
      failed: 0,
      errors: [] as Array<{ email: string; error: string }>,
    }

    for (let i = 0; i < targetEmails.length; i++) {
      const email = targetEmails[i]

      try {
        // Generate unique unsubscribe token
        const unsubscribeToken = generateUnsubscribeToken(email)

        // Render email with token
        const emailHtml = await render(
          ChangelogLaunch({
            baseUrl,
            unsubscribeToken,
          })
        )

        // Send the email
        console.log(`Sending email to ${email}...`)
        const emailResponse = await resend.emails.send({
          from: senderEmail,
          to: email,
          subject: '🎸 Miked.live Launches',
          html: emailHtml,
        })

        if (emailResponse.error) {
          console.error(`Error sending to ${email}:`, emailResponse.error)
          sendResults.failed++
          sendResults.errors.push({
            email,
            error: emailResponse.error.message,
          })
        } else {
          console.log(`Email sent to ${email}:`, emailResponse.data?.id)
          sendResults.sent++
        }

        // Rate limiting: add 600ms delay between sends
        if (i < targetEmails.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 600))
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error'
        console.error(`Error sending email to ${email}:`, err)
        sendResults.failed++
        sendResults.errors.push({
          email,
          error: errorMsg,
        })
      }
    }

    console.log(`Emails sent: ${sendResults.sent}, Failed: ${sendResults.failed}`)

    return NextResponse.json(
      {
        success: sendResults.sent > 0,
        message: `Sent ${sendResults.sent} changelog email(s)`,
        stats: {
          total: targetEmails.length,
          emailsSent: sendResults.sent,
          sendFailed: sendResults.failed,
        },
        ...(sendResults.errors.length > 0 && { errors: sendResults.errors }),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
