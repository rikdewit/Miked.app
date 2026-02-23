import React from 'react'
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'
import { supabaseAdmin } from '@/utils/supabaseAdmin'
import { Resend } from 'resend'
import { subscribeUser } from '@/utils/subscribeUser'
import { RiderMagicLinkEmail } from '@/emails/RiderMagicLink'

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

    // 3. Try to create user in Supabase Auth (will fail silently if already exists)
    await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true,
    }).catch((err) => {
      // User might already exist, that's fine
      console.log('User creation (expected if already exists):', err.message)
    })

    // 4. Generate custom magic link token
    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year

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

    // 5. Build magic link URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://miked.live'
    const magicLink = `${appUrl}/auth/callback?token=${token}&riderId=${riderRecord.id}`

    console.log(`[RESEND] Sending email to: ${email}`)
    console.log(`[RESEND] Magic link: ${magicLink}`)
    console.log(`[RESEND] API Key exists: ${!!process.env.RESEND_API_KEY}`)

    // 6. Send email via Resend
    const bandName = cleanedRiderData.details?.bandName
    const subjectLine = bandName
      ? `Your rider for ${bandName} is saved`
      : 'Your rider is saved'

    const senderEmail = process.env.SENDER_EMAIL || 'support@miked.live'
    const emailResponse = await resend.emails.send({
      from: senderEmail,
      to: email,
      subject: subjectLine,
      react: React.createElement(RiderMagicLinkEmail, {
        bandName,
        magicLink,
        email,
        baseUrl: appUrl,
      }),
    })

    console.log(`[RESEND] Response:`, JSON.stringify(emailResponse, null, 2))

    if (emailResponse.error) {
      console.error('Email send error:', emailResponse.error)
      // Don't fail the whole request if email fails - rider is already saved
      // Just log it and continue
    } else {
      console.log(`[RESEND] Email sent successfully with ID: ${emailResponse.data?.id}`)
    }

    // 7. Subscribe user to changelog (non-blocking)
    try {
      await subscribeUser(email, { sendWelcomeEmail: false, source: 'rider_download' })
    } catch (err) {
      console.error('Failed to subscribe user:', err)
      // Don't fail the request - rider is already saved and email sent
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
