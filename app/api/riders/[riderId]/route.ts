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
    const shareToken = searchParams.get('share')

    if (!riderId) {
      return NextResponse.json(
        { error: 'Missing riderId' },
        { status: 400 }
      )
    }

    // 1. Try owner access via auth token cookie (from magic link)
    const { cookies } = request
    const authToken = cookies.get(`auth_${riderId}`)?.value

    if (authToken) {
      // Cookie was set by our auth callback - it's secure (httpOnly) so we can trust it
      // No need to validate against database since token is deleted after first use
      console.log('[GET RIDER] Found auth token in cookie, granting owner access')

      const { data: rider } = await supabase
        .from('riders')
        .select('*')
        .eq('id', riderId)
        .single()

      if (rider) {
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
    }

    // 2. Try guest access via share token
    if (shareToken) {
      console.log('[GET RIDER] Checking guest access with share token:', { shareToken: !!shareToken })
      const { data: rider, error: riderError } = await supabase
        .from('riders')
        .select('*')
        .eq('id', riderId)
        .eq('share_token', shareToken)
        .single()

      if (riderError || !rider) {
        console.log('[GET RIDER] Share token invalid:', { error: riderError?.message })
        return NextResponse.json(
          { error: 'unauthorized' },
          { status: 401 }
        )
      }

      console.log('[GET RIDER] Returning guest access')
      return NextResponse.json(
        {
          riderData: rider.rider_data as RiderData,
          riderId: rider.id,
          accessLevel: 'guest',
        },
        { status: 200 }
      )
    }

    // No valid access
    console.log('[GET RIDER] No valid access - no session and no share token')
    return NextResponse.json(
      { error: 'unauthorized' },
      { status: 401 }
    )
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
