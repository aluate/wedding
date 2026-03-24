import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { normalizeEmail, validateRsvpPayload } from '@/lib/rsvp/validate'
import { serverErrorResponse, successResponse, validationErrorResponse } from '@/lib/api-helpers'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return validationErrorResponse('Invalid JSON body')
  }

  const parsed = validateRsvpPayload(body)
  if (!parsed.ok) {
    return validationErrorResponse(parsed.message)
  }

  const data = parsed.data
  const email_normalized = normalizeEmail(data.email)
  const now = new Date().toISOString()

  let supabase
  try {
    supabase = getSupabaseAdmin()
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Server configuration error'
    console.error('[rsvp] config', msg)
    return serverErrorResponse(
      'RSVP is not fully configured yet. Please try again later or email hello@britandkarl.com.'
    )
  }

  const { error } = await supabase.from('rsvp_submissions').upsert(
    {
      email: data.email,
      email_normalized,
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
      attending: data.attending,
      guest_count: data.guest_count,
      guest_names: data.guest_names,
      dietary_restrictions: data.dietary_restrictions,
      notes: data.notes,
      invite_code: data.invite_code,
      household_name: data.household_name,
      mailing_address: data.mailing_address,
      updated_at: now,
    },
    { onConflict: 'email_normalized' }
  )

  if (error) {
    console.error('[rsvp] supabase', error)
    return serverErrorResponse('Could not save your RSVP. Please try again in a moment.')
  }

  return successResponse({ saved: true, email_normalized })
}
