import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'
import { Resend } from 'resend'
import { WelcomeSubscriberEmail } from '@/emails/WelcomeSubscriber'

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

    // 1. Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from('subscribers')
      .select('id, subscribed')
      .eq('email', email)
      .single()

    let subscriber

    if (existingSubscriber) {
      // Email exists - check if they're already subscribed
      if (existingSubscriber.subscribed) {
        return NextResponse.json(
          { error: 'This email is already subscribed' },
          { status: 400 }
        )
      }

      // Re-subscribe by updating subscribed to true
      const { data: updatedSubscriber, error: updateError } = await supabase
        .from('subscribers')
        .update({ subscribed: true })
        .eq('id', existingSubscriber.id)
        .select()
        .single()

      if (updateError) {
        console.error('Subscriber update error:', updateError)
        return NextResponse.json(
          { error: 'Failed to save subscription' },
          { status: 500 }
        )
      }

      subscriber = updatedSubscriber
    } else {
      // New subscriber - insert
      const { data: newSubscriber, error: insertError } = await supabase
        .from('subscribers')
        .insert([
          {
            email,
            source: 'changelog',
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (insertError) {
        console.error('Subscriber insert error:', insertError)
        return NextResponse.json(
          { error: 'Failed to save subscription' },
          { status: 500 }
        )
      }

      subscriber = newSubscriber
    }

    // 2. Add to Resend contacts and send welcome email (non-blocking - don't fail if this fails)
    try {
      const contactResponse = await resend.contacts.create({
        email,
        unsubscribed: false,
      })

      console.log(`[RESEND] Contact created for ${email}:`, contactResponse.data?.id)

      // 3. Send welcome email
      const senderEmail = process.env.SENDER_EMAIL || 'updates@miked.live'
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://miked.live'
      const emailResponse = await resend.emails.send({
        from: senderEmail,
        to: email,
        subject: '🎸 Welcome to the Miked.live changelog!',
        react: WelcomeSubscriberEmail({ email, baseUrl }),
      })

      if (emailResponse.error) {
        console.error('Welcome email send error:', emailResponse.error)
      } else {
        console.log(`[RESEND] Welcome email sent to ${email}:`, emailResponse.data?.id)
      }
    } catch (resendError) {
      console.error('Resend error:', resendError)
      // Don't fail the request - subscriber is already saved in Supabase
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to changelog',
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
