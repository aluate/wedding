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
 * Returns CSV of all RSVP rows (for spreadsheets / email tools).
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

  const { data, error } = await supabase
    .from('rsvp_submissions')
    .select(
      'id,email,first_name,last_name,phone,attending,guest_count,guest_names,meal_choice,dietary_restrictions,notes,invite_code,household_name,mailing_address,thank_you_status,created_at,updated_at'
    )
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[rsvp/export] select', error)
    return serverErrorResponse('Could not load RSVPs')
  }

  const rows = data ?? []
  const headers = [
    'id',
    'email',
    'first_name',
    'last_name',
    'phone',
    'attending',
    'guest_count',
    'guest_names',
    'meal_choice',
    'dietary_restrictions',
    'notes',
    'invite_code',
    'household_name',
    'mailing_address',
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
