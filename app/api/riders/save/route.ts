import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'
import { supabaseAdmin } from '@/utils/supabaseAdmin'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, riderData } = await request.json()

    if (!email || !riderData) {
      return NextResponse.json(
        { error: 'Missing email or riderData' },
        { status: 400 }
      )
    }

    // Handle logo upload to Supabase Storage if Base64
    let cleanedRiderData = { ...riderData }
    if (riderData.details?.logoUrl?.startsWith('data:')) {
      try {
        const dataUri = riderData.details.logoUrl
        const [header, base64Data] = dataUri.split(',')
        const mimeMatch = header.match(/data:([^;]+);base64/)
        const mimeType = mimeMatch?.[1] ?? 'image/png'
        const ext = mimeType.split('/')[1] ?? 'png'
        const buffer = Buffer.from(base64Data, 'base64')
        const filename = `${crypto.randomUUID()}.${ext}`

        const { error: uploadError } = await supabaseAdmin.storage
          .from('logos')
          .upload(filename, buffer, { contentType: mimeType, upsert: false })

        if (uploadError) {
          console.error('Logo upload error:', uploadError)
          // Strip logo on upload failure rather than failing the whole save
          cleanedRiderData = {
            ...cleanedRiderData,
            details: { ...cleanedRiderData.details, logoUrl: undefined }
          }
        } else {
          const { data: publicUrlData } = supabaseAdmin.storage
            .from('logos')
            .getPublicUrl(filename)

          cleanedRiderData = {
            ...cleanedRiderData,
            details: { ...cleanedRiderData.details, logoUrl: publicUrlData.publicUrl }
          }
        }
      } catch (logoError) {
        console.error('Logo processing error:', logoError)
        // Strip logo on error rather than failing the whole save
        cleanedRiderData = {
          ...cleanedRiderData,
          details: { ...cleanedRiderData.details, logoUrl: undefined }
        }
      }
    }

    // 1. Generate share token
    const shareToken = crypto.randomUUID()

    // 2. Save rider to Supabase
    const { data: riderRecord, error: insertError } = await supabase
      .from('riders')
      .insert([
        {
          email,
          rider_data: cleanedRiderData,
          share_token: shareToken,
        },
      ])
      .select()
      .single()

    if (insertError || !riderRecord) {
      console.error('Rider insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to save rider' },
        { status: 500 }
      )
    }

    // 3. Generate magic link token
    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year

    // 4. Save magic link
    const { error: linkError } = await supabase.from('magic_links').insert([
      {
        rider_id: riderRecord.id,
        token,
        email,
        expires_at: expiresAt.toISOString(),
      },
    ])

    if (linkError) {
      console.error('Magic link insert error:', linkError)
      return NextResponse.json(
        { error: 'Failed to create magic link' },
        { status: 500 }
      )
    }

    // 5. Send email via Resend
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://miked.live'
    const magicLink = `${appUrl}/riders/${riderRecord.id}?auth=${token}`

    console.log(`[RESEND] Sending email to: ${email}`)
    console.log(`[RESEND] Magic link: ${magicLink}`)
    console.log(`[RESEND] API Key exists: ${!!process.env.RESEND_API_KEY}`)

    const senderEmail = process.env.SENDER_EMAIL || 'support@miked.live'
    const emailResponse = await resend.emails.send({
      from: senderEmail,
      to: email,
      subject: 'Your rider is saved — access it anytime 🎸',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your rider is saved!</h2>
          <p>You can access your rider anytime using the link below:</p>
          <p>
            <a href="${magicLink}" style="display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Access your rider
            </a>
          </p>
          <p style="color: #666; font-size: 14px;">
            This link will be valid forever. You can:
          </p>
          <ul style="color: #666; font-size: 14px;">
            <li>View your rider anytime</li>
            <li>Share it with venues</li>
            <li>Update your details (coming soon)</li>
          </ul>
          <p style="color: #999; font-size: 12px; margin-top: 32px;">
            Questions? Reply to this email.
          </p>
        </div>
      `,
    })

    console.log(`[RESEND] Response:`, JSON.stringify(emailResponse, null, 2))

    if (emailResponse.error) {
      console.error('Email send error:', emailResponse.error)
      // Don't fail the whole request if email fails - rider is already saved
      // Just log it and continue
    } else {
      console.log(`[RESEND] Email sent successfully with ID: ${emailResponse.data?.id}`)
    }

    return NextResponse.json(
      {
        success: true,
        riderId: riderRecord.id,
        shareToken: riderRecord.share_token,
        message: 'Rider saved and email sent',
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
