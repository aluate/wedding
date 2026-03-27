import weddingConfig from '@/config/wedding_config.json'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { sendRsvpConfirmationEmail } from '@/lib/rsvp/send-rsvp-confirmation'
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

  const row = {
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
    household_code: null,
    household_name: data.household_name,
    mailing_address: data.mailing_address,
    staying_friday: data.staying_friday,
    staying_saturday: data.staying_saturday,
    hotel_rooms: data.hotel_rooms,
    updated_at: now,
  }

  let { error } = await supabase
    .from('rsvp_submissions')
    .upsert(row, { onConflict: 'event_key,email_normalized' })

  if (error) {
    // Backward compatibility: older production schemas may still use
    // email_normalized uniqueness and/or may not yet have event_key / hotel_rooms.
    const message = String((error as { message?: string }).message || '')
    const hasConflictMismatch = message.includes('no unique or exclusion constraint')
    const missingEventKey = message.includes('event_key')
    const missingHotelRooms = message.includes('hotel_rooms')

    if (hasConflictMismatch || missingEventKey || missingHotelRooms) {
      const legacyRow: Record<string, unknown> = { ...row }
      if (missingEventKey) {
        delete legacyRow.event_key
      }
      if (missingHotelRooms) {
        delete legacyRow.hotel_rooms
      }

      const useLegacyEmailConflict = hasConflictMismatch || missingEventKey
      const retry = await supabase.from('rsvp_submissions').upsert(legacyRow as typeof row, {
        onConflict: useLegacyEmailConflict ? 'email_normalized' : 'event_key,email_normalized',
      })
      error = retry.error
    }
  }

  if (error) {
    console.error('[rsvp] supabase', error)
    return serverErrorResponse('Could not save your RSVP. Please try again in a moment.')
  }

  void sendRsvpConfirmationEmail({
    to: data.email,
    firstName: data.first_name,
    attending: data.attending,
    guestCount: data.guest_count,
  }).catch((e) => console.error('[rsvp] confirmation email', e))

  return successResponse({ saved: true, event_key: data.event_key, email_normalized })
}
