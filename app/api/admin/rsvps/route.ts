import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { errorResponse, serverErrorResponse } from '@/lib/api-helpers'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

type Row = {
  attending: boolean
  guest_count: number | null
  staying_friday: boolean | null
  staying_saturday: boolean | null
  event_key: string | null
}

/**
 * GET /api/admin/rsvps
 * Authorization: Bearer <ADMIN_PASSWORD>
 * Optional query: event_key=<key>
 */
export async function GET(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET
  if (!adminPassword) {
    return errorResponse('Admin is not configured', 501, 'NOT_CONFIGURED')
  }

  const auth = request.headers.get('authorization')
  const token = auth?.startsWith('Bearer ') ? auth.slice(7).trim() : ''
  if (token !== adminPassword) {
    return errorResponse('Unauthorized', 401, 'UNAUTHORIZED')
  }

  let supabase
  try {
    supabase = getSupabaseAdmin()
  } catch (e) {
    console.error('[admin/rsvps]', e)
    return serverErrorResponse('Supabase is not configured')
  }

  const url = new URL(request.url)
  const eventKey = url.searchParams.get('event_key')?.trim() || ''

  const { data: allData, error: allError } = await supabase
    .from('rsvp_submissions')
    .select('*')
    .order('created_at', { ascending: true })

  if (allError) {
    console.error('[admin/rsvps] select', allError)
    return serverErrorResponse('Could not load RSVPs')
  }

  const allRows = (allData ?? []) as Row[]
  const eventKeys = Array.from(
    new Set(allRows.map((r) => r.event_key).filter((k): k is string => Boolean(k)))
  ).sort()

  const rows = eventKey ? allRows.filter((r) => r.event_key === eventKey) : allRows

  const attending = rows.filter((r) => r.attending === true)
  const declined = rows.filter((r) => r.attending === false)

  const summary = {
    total_responses: rows.length,
    attending_parties: attending.length,
    declined_parties: declined.length,
    total_guests: attending.reduce((sum, r) => sum + (r.guest_count || 0), 0),
    friday_hotel: attending.filter((r) => r.staying_friday).length,
    saturday_hotel: attending.filter((r) => r.staying_saturday).length,
  }

  return NextResponse.json({
    summary,
    event_keys: eventKeys,
    selected_event_key: eventKey || null,
    rsvps: rows,
  })
}
