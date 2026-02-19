import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'
import { RiderData } from '@/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ riderId: string }> }
) {
  try {
    const { riderId } = await params
    const searchParams = request.nextUrl.searchParams
    const authToken = searchParams.get('auth')
    const shareToken = searchParams.get('share')

    if (!riderId) {
      return NextResponse.json(
        { error: 'Missing riderId' },
        { status: 400 }
      )
    }

    if (!authToken && !shareToken) {
      return NextResponse.json(
        { error: 'Missing auth or share token' },
        { status: 401 }
      )
    }

    // 1. Try owner access via magic link token
    if (authToken) {
      const { data: magicLink, error: linkError } = await supabase
        .from('magic_links')
        .select('*')
        .eq('token', authToken)
        .eq('rider_id', riderId)
        .single()

      if (linkError || !magicLink) {
        return NextResponse.json(
          { error: 'unauthorized' },
          { status: 401 }
        )
      }

      // Check if token is expired
      const expiresAt = new Date(magicLink.expires_at)
      if (expiresAt < new Date()) {
        return NextResponse.json(
          { error: 'expired' },
          { status: 401 }
        )
      }

      // Fetch rider data
      const { data: rider, error: riderError } = await supabase
        .from('riders')
        .select('*')
        .eq('id', riderId)
        .single()

      if (riderError || !rider) {
        return NextResponse.json(
          { error: 'not_found' },
          { status: 404 }
        )
      }

      return NextResponse.json(
        {
          riderData: rider.rider_data as RiderData,
          riderId: rider.id,
          shareToken: rider.share_token,
          accessLevel: 'owner',
        },
        { status: 200 }
      )
    }

    // 2. Try guest access via share token
    if (shareToken) {
      const { data: rider, error: riderError } = await supabase
        .from('riders')
        .select('*')
        .eq('id', riderId)
        .eq('share_token', shareToken)
        .single()

      if (riderError || !rider) {
        return NextResponse.json(
          { error: 'unauthorized' },
          { status: 401 }
        )
      }

      return NextResponse.json(
        {
          riderData: rider.rider_data as RiderData,
          riderId: rider.id,
          accessLevel: 'guest',
        },
        { status: 200 }
      )
    }

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
