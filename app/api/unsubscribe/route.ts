import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'
import { Resend } from 'resend'

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

    // 1. Update subscriber to mark as unsubscribed in Supabase
    const { error: updateError } = await supabase
      .from('subscribers')
      .update({ subscribed: false })
      .eq('email', email)

    if (updateError) {
      console.error('Unsubscribe error:', updateError)
      return NextResponse.json(
        { error: 'Failed to unsubscribe' },
        { status: 500 }
      )
    }

    // 2. Mark as unsubscribed in Resend (non-blocking - don't fail if this fails)
    try {
      const contactResponse = await resend.contacts.update({
        email,
        unsubscribed: true,
      })

      console.log(`[RESEND] Contact marked as unsubscribed: ${email}`)
    } catch (resendError) {
      console.error('Resend unsubscribe error:', resendError)
      // Don't fail the request - they're already unsubscribed in Supabase
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully unsubscribed from changelog',
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
