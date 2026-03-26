import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { errorResponse, serverErrorResponse } from '@/lib/api-helpers'

export const runtime = 'nodejs'

function csvEscape(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return ''
  const s = String(value)
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

/**
 * GET /api/rsvp/export
 * Authorization: Bearer <RSVP_EXPORT_SECRET>
 * Optional: ?event_key=<event>
 */
export async function GET(request: Request) {
  const secret = process.env.RSVP_EXPORT_SECRET
  if (!secret) {
    return errorResponse('Export is not configured', 501, 'NOT_CONFIGURED')
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
    console.error('[rsvp/export]', e)
    return serverErrorResponse('Supabase is not configured')
  }

  const url = new URL(request.url)
  const eventKey = url.searchParams.get('event_key')?.trim() || null

  let query = supabase
    .from('rsvp_submissions')
    .select(
      'id,event_key,email,first_name,last_name,phone,attending,guest_count,guest_names,dietary_restrictions,notes,household_code,household_name,mailing_address,staying_friday,staying_saturday,thank_you_status,created_at,updated_at'
    )
    .order('created_at', { ascending: true })

  if (eventKey) {
    query = query.eq('event_key', eventKey)
  }

  const { data, error } = await query

  if (error) {
    console.error('[rsvp/export] select', error)
    return serverErrorResponse('Could not load RSVPs')
  }

  const rows = data ?? []
  const headers = [
    'id',
    'event_key',
    'email',
    'first_name',
    'last_name',
    'phone',
    'attending',
    'guest_count',
    'guest_names',
    'dietary_restrictions',
    'notes',
    'household_code',
    'household_name',
    'mailing_address',
    'staying_friday',
    'staying_saturday',
    'thank_you_status',
    'created_at',
    'updated_at',
  ]

  const lines = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((h) => csvEscape((row as Record<string, unknown>)[h] as string | number | boolean | null))
        .join(',')
    ),
  ]

  const csv = lines.join('\r\n')

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="rsvp-export.csv"',
      'Cache-Control': 'no-store',
    },
  })
}
