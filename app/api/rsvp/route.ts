import weddingConfig from '@/config/wedding_config.json'
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
      `RSVP is not fully configured yet. Please try again later or email ${weddingConfig.site.supportEmail}.`
    )
  }

  const { error } = await supabase.from('rsvp_submissions').upsert(
    {
      event_key: data.event_key,
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
      household_code: data.household_code,
      household_name: data.household_name,
      mailing_address: data.mailing_address,
      staying_friday: data.staying_friday,
      staying_saturday: data.staying_saturday,
      updated_at: now,
    },
    { onConflict: 'event_key,email_normalized' }
  )

  if (error) {
    console.error('[rsvp] supabase', error)
    return serverErrorResponse('Could not save your RSVP. Please try again in a moment.')
  }

  return successResponse({ saved: true, event_key: data.event_key, email_normalized })
}
