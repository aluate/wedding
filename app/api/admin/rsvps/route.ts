import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { errorResponse, serverErrorResponse } from '@/lib/api-helpers'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

/**
 * GET /api/admin/rsvps
 * Authorization: Bearer <ADMIN_SECRET>
 * Returns all RSVP data + summary stats as JSON.
 */
export async function GET(request: Request) {
  const secret = process.env.ADMIN_SECRET
  if (!secret) {
    return errorResponse('Admin is not configured', 501, 'NOT_CONFIGURED')
  }

  const auth = request.headers.get('authorization')
  const token = auth?.startsWith('Bearer ') ? auth.slice(7).trim() : ''
  if (token !== secret) {
    return errorResponse('Unauthorized', 401, 'UNAUTHORIZED')
  }

  let supabase
  try {
    supabase = getSupabaseAdmin()
  } catch (e) {
    console.error('[admin/rsvps]', e)
    return serverErrorResponse('Supabase is not configured')
  }

  const { data, error } = await supabase
    .from('rsvp_submissions')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[admin/rsvps] select', error)
    return serverErrorResponse('Could not load RSVPs')
  }

  const rows = data ?? []
  const attending = rows.filter((r: any) => r.attending === true)
  const declined = rows.filter((r: any) => r.attending === false)

  const summary = {
    total_responses: rows.length,
    attending_parties: attending.length,
    declined_parties: declined.length,
    total_guests: attending.reduce((sum: number, r: any) => sum + (r.guest_count || 0), 0),
    friday_hotel: attending.filter((r: any) => r.staying_friday).length,
    saturday_hotel: attending.filter((r: any) => r.staying_saturday).length,
  }

  return NextResponse.json({ summary, rsvps: rows })
}
