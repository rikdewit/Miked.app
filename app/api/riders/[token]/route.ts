import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'
import { RiderData } from '@/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    if (!token) {
      return NextResponse.json(
        { error: 'Missing token' },
        { status: 400 }
      )
    }

    // 1. Look up the magic link by token
    const { data: magicLink, error: linkError } = await supabase
      .from('magic_links')
      .select('*')
      .eq('token', token)
      .single()

    if (linkError || !magicLink) {
      return NextResponse.json(
        { error: 'not_found' },
        { status: 404 }
      )
    }

    // 2. Check if the token is expired
    const expiresAt = new Date(magicLink.expires_at)
    if (expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'expired' },
        { status: 401 }
      )
    }

    // 3. Fetch the rider data
    const { data: rider, error: riderError } = await supabase
      .from('riders')
      .select('*')
      .eq('id', magicLink.rider_id)
      .single()

    if (riderError || !rider) {
      return NextResponse.json(
        { error: 'Rider not found' },
        { status: 404 }
      )
    }

    // 4. Return the rider data
    return NextResponse.json(
      {
        riderData: rider.rider_data as RiderData,
        riderId: rider.id,
        email: rider.email,
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
