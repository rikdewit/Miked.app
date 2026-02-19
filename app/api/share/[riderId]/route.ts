import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'
import { RiderData } from '@/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ riderId: string }> }
) {
  try {
    const { riderId } = await params

    if (!riderId) {
      return NextResponse.json(
        { error: 'Missing riderId' },
        { status: 400 }
      )
    }

    // Fetch the rider by its ID (public access, no authentication)
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

    // Return the rider data
    return NextResponse.json(
      {
        riderData: rider.rider_data as RiderData,
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
