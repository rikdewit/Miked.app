import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'
import { supabaseAdmin } from '@/utils/supabaseAdmin'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get('token')
  const riderId = searchParams.get('riderId')

  console.log('[AUTH CALLBACK] Received request', { token: !!token, riderId })

  if (!token || !riderId) {
    console.log('[AUTH CALLBACK] Missing token or riderId')
    return NextResponse.redirect(new URL('/riders', request.url))
  }

  try {
    // Validate the magic link token
    console.log('[AUTH CALLBACK] Validating magic link token')
    const { data: magicLink, error: linkError } = await supabase
      .from('magic_links')
      .select('*')
      .eq('token', token)
      .eq('rider_id', riderId)
      .single()

    if (linkError || !magicLink) {
      console.log('[AUTH CALLBACK] Magic link not found')
      // Token is invalid - redirect to rider as guest
      const { data: rider } = await supabaseAdmin
        .from('riders')
        .select('share_token')
        .eq('id', riderId)
        .single()

      if (rider?.share_token) {
        return NextResponse.redirect(
          new URL(`/riders/${riderId}?share=${rider.share_token}`, request.url)
        )
      }
      return NextResponse.redirect(new URL('/riders', request.url))
    }

    // Check if token is expired
    const expiresAt = new Date(magicLink.expires_at)
    if (expiresAt < new Date()) {
      console.log('[AUTH CALLBACK] Magic link token expired')
      // Token expired - redirect to rider as guest
      const { data: rider } = await supabaseAdmin
        .from('riders')
        .select('share_token')
        .eq('id', riderId)
        .single()

      if (rider?.share_token) {
        return NextResponse.redirect(
          new URL(`/riders/${riderId}?share=${rider.share_token}`, request.url)
        )
      }
      return NextResponse.redirect(new URL('/riders', request.url))
    }

    // Token is valid - create or get the user, set session, update rider
    console.log('[AUTH CALLBACK] Magic link valid, signing in user')
    const email = magicLink.email

    // Create or get user in Supabase Auth (email is unique, so createUser will error if exists)
    let userId: string | null = null

    // Try to create the user
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true,
    })

    if (newUser?.user) {
      userId = newUser.user.id
      console.log('[AUTH CALLBACK] Created new user:', userId)
    } else if (createError) {
      // User likely already exists - try to find them
      // Since we can't query by email, we'll use the email from magic_links which should match
      console.log('[AUTH CALLBACK] User creation failed (may already exist):', createError.message)
      // We'll continue with the userId from later lookup
    }

    // If we couldn't create a user, we can still proceed - the rider.user_id might already be set
    if (!userId) {
      console.log('[AUTH CALLBACK] Could not determine user ID, will set rider ownership')
      // Continue anyway - the next time this magic link is used (if it hasn't expired),
      // it will work the same way
    }

    // Link user to rider (only if we have a userId)
    if (userId) {
      await supabaseAdmin
        .from('riders')
        .update({ user_id: userId })
        .eq('id', riderId)
        .is('user_id', null)
      console.log('[AUTH CALLBACK] Linked rider to user:', userId)
    }

    // Mark magic link as used (delete it so it can't be reused)
    await supabase
      .from('magic_links')
      .delete()
      .eq('token', token)
      .eq('rider_id', riderId)
    console.log('[AUTH CALLBACK] Marked magic link as used (deleted token)')

    // Set auth token in a cookie so the API can validate it
    console.log('[AUTH CALLBACK] Setting auth token cookie')
    const response = NextResponse.redirect(new URL(`/riders/${riderId}`, request.url))

    // Store the magic link token in a secure cookie
    // The API will use this to verify owner access
    response.cookies.set(`auth_${riderId}`, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
    })

    console.log('[AUTH CALLBACK] Auth token cookie set, redirecting to rider')
    return response
  } catch (error) {
    console.error('[AUTH CALLBACK] Unexpected error:', error)
    return NextResponse.redirect(new URL('/riders', request.url))
  }
}
