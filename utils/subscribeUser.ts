import { supabase } from '@/utils/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SubscribeOptions {
  sendWelcomeEmail?: boolean
  source?: string
}

/**
 * Subscribe a user to the changelog
 * Saves to Supabase and adds to Resend contacts
 * Optionally sends welcome email (disabled for downloads)
 */
export async function subscribeUser(
  email: string,
  options: SubscribeOptions = { sendWelcomeEmail: false, source: 'rider_download' }
) {
  try {
    // 1. Check if already subscribed
    const { data: existingSubscriber } = await supabase
      .from('subscribers')
      .select('id')
      .eq('email', email)
      .single()

    if (existingSubscriber) {
      return { success: true, message: 'Already subscribed' }
    }

    // 2. Save to Supabase
    const { data: subscriber, error: insertError } = await supabase
      .from('subscribers')
      .insert([
        {
          email,
          source: options.source || 'rider_download',
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (insertError) {
      console.error('Subscriber insert error:', insertError)
      return { success: false, error: 'Failed to save subscription' }
    }

    // 3. Add to Resend contacts (non-blocking)
    try {
      const contactResponse = await resend.contacts.create({
        email,
        unsubscribed: false,
      })

      console.log(`[RESEND] Contact created for ${email}:`, contactResponse.data?.id)
    } catch (resendError) {
      console.error('Resend contact creation error:', resendError)
      // Don't fail - subscriber is saved in Supabase
    }

    return { success: true, message: 'User subscribed' }
  } catch (error) {
    console.error('Subscribe user error:', error)
    return { success: false, error: 'Failed to subscribe user' }
  }
}
