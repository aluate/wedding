import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { errorResponse, serverErrorResponse, validationErrorResponse } from '@/lib/api-helpers'
import { normalizeEmail, validateAdminRsvpUpdate } from '@/lib/rsvp/validate'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

type Row = {
  attending: boolean
  guest_count: number | null
  staying_friday: boolean | null
  staying_saturday: boolean | null
  hotel_rooms: number | null
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

  const rooms = (r: Row) => (typeof r.hotel_rooms === 'number' && r.hotel_rooms > 0 ? r.hotel_rooms : 0)

  const summary = {
    total_responses: rows.length,
    attending_parties: attending.length,
    declined_parties: declined.length,
    total_guests: attending.reduce((sum, r) => sum + (r.guest_count || 0), 0),
    /** Attending parties who checked Friday night */
    parties_staying_friday: attending.filter((r) => r.staying_friday).length,
    /** Attending parties who checked Saturday night */
    parties_staying_saturday: attending.filter((r) => r.staying_saturday).length,
    /** Sum of reported guest rooms in the block (RSVPs with a number > 0) */
    total_rooms_reported: attending.reduce((sum, r) => sum + rooms(r), 0),
    /** How many attending RSVPs included a room count */
    rsvps_with_room_count: attending.filter((r) => rooms(r) > 0).length,
    /** @deprecated same as parties_staying_friday — kept for older admin clients */
    friday_hotel: attending.filter((r) => r.staying_friday).length,
    /** @deprecated same as parties_staying_saturday */
    saturday_hotel: attending.filter((r) => r.staying_saturday).length,
  }

  return NextResponse.json({
    summary,
    event_keys: eventKeys,
    selected_event_key: eventKey || null,
    rsvps: rows,
  })
}

/**
 * PATCH /api/admin/rsvps
 * Authorization: Bearer <ADMIN_PASSWORD>
 * Body: { id: uuid, ...same fields as POST /api/rsvp }
 */
export async function PATCH(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET
  if (!adminPassword) {
    return errorResponse('Admin is not configured', 501, 'NOT_CONFIGURED')
  }

  const auth = request.headers.get('authorization')
  const token = auth?.startsWith('Bearer ') ? auth.slice(7).trim() : ''
  if (token !== adminPassword) {
    return errorResponse('Unauthorized', 401, 'UNAUTHORIZED')
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return validationErrorResponse('Invalid JSON body')
  }

  const parsed = validateAdminRsvpUpdate(body)
  if (!parsed.ok) {
    return validationErrorResponse(parsed.message)
  }

  const { id, data } = parsed
  const email_normalized = normalizeEmail(data.email)
  const now = new Date().toISOString()

  const attending = data.attending
  const guest_count = attending ? data.guest_count : 0
  const staying_friday = attending ? data.staying_friday : false
  const staying_saturday = attending ? data.staying_saturday : false
  const hotel_rooms = attending ? data.hotel_rooms : null
  const guest_names = attending ? data.guest_names : null

  let supabase
  try {
    supabase = getSupabaseAdmin()
  } catch (e) {
    console.error('[admin/rsvps PATCH]', e)
    return serverErrorResponse('Supabase is not configured')
  }

  const updateRow = {
    event_key: data.event_key,
    email: data.email,
    email_normalized,
    first_name: data.first_name,
    last_name: data.last_name,
    phone: data.phone,
    attending,
    guest_count,
    guest_names,
    dietary_restrictions: data.dietary_restrictions,
    notes: data.notes,
    household_name: data.household_name,
    mailing_address: data.mailing_address,
    staying_friday,
    staying_saturday,
    hotel_rooms,
    updated_at: now,
  }

  const { data: updated, error } = await supabase
    .from('rsvp_submissions')
    .update(updateRow)
    .eq('id', id)
    .select()
    .maybeSingle()

  if (error) {
    console.error('[admin/rsvps PATCH] update', error)
    const msg = String((error as { message?: string }).message || '')
    if (msg.includes('duplicate') || msg.includes('unique') || msg.includes('23505')) {
      return errorResponse(
        'Another RSVP already uses this email for this event. Change the email or merge in Supabase.',
        409,
        'CONFLICT'
      )
    }
    return serverErrorResponse('Could not update RSVP')
  }

  if (!updated) {
    return errorResponse('RSVP not found', 404, 'NOT_FOUND')
  }

  return NextResponse.json({ ok: true, rsvp: updated })
}

/**
 * DELETE /api/admin/rsvps?id=<uuid>
 * Authorization: Bearer <ADMIN_PASSWORD>
 */
export async function DELETE(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET
  if (!adminPassword) {
    return errorResponse('Admin is not configured', 501, 'NOT_CONFIGURED')
  }

  const auth = request.headers.get('authorization')
  const token = auth?.startsWith('Bearer ') ? auth.slice(7).trim() : ''
  if (token !== adminPassword) {
    return errorResponse('Unauthorized', 401, 'UNAUTHORIZED')
  }

  const id = new URL(request.url).searchParams.get('id')?.trim() || ''
  if (!id) {
    return validationErrorResponse('Missing id query parameter')
  }

  let supabase
  try {
    supabase = getSupabaseAdmin()
  } catch (e) {
    console.error('[admin/rsvps DELETE]', e)
    return serverErrorResponse('Supabase is not configured')
  }

  const { data, error } = await supabase.from('rsvp_submissions').delete().eq('id', id).select('id')

  if (error) {
    console.error('[admin/rsvps DELETE]', error)
    return serverErrorResponse('Could not delete RSVP')
  }

  if (!data || data.length === 0) {
    return errorResponse('RSVP not found', 404, 'NOT_FOUND')
  }

  return NextResponse.json({ ok: true, deleted_id: id })
}
