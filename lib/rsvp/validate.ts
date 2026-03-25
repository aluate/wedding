export type RsvpPayload = {
  first_name: string
  last_name: string
  email: string
  phone?: string | null
  attending: boolean
  guest_count: number
  guest_names?: string | null
  dietary_restrictions?: string | null
  notes?: string | null
  household_code: string
  household_name?: string | null
  mailing_address?: string | null
  staying_friday: boolean
  staying_saturday: boolean
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function normalizeHouseholdCode(code: string): string {
  return code.trim().toLowerCase().replace(/\s+/g, '')
}

export function validateRsvpPayload(raw: unknown): { ok: true; data: RsvpPayload } | { ok: false; message: string } {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, message: 'Invalid JSON body' }
  }

  const o = raw as Record<string, unknown>

  const first_name = typeof o.first_name === 'string' ? o.first_name.trim() : ''
  const last_name = typeof o.last_name === 'string' ? o.last_name.trim() : ''
  const email = typeof o.email === 'string' ? o.email.trim() : ''
  const phone =
    o.phone === undefined || o.phone === null || o.phone === ''
      ? null
      : String(o.phone).trim() || null

  const household_code_raw = typeof o.household_code === 'string' ? o.household_code.trim() : ''
  if (!household_code_raw) {
    return { ok: false, message: 'Household code is required. Check your invitation for the code.' }
  }
  const household_code = normalizeHouseholdCode(household_code_raw)

  let attending: boolean
  if (o.attending === true || o.attending === 'true') attending = true
  else if (o.attending === false || o.attending === 'false') attending = false
  else {
    return { ok: false, message: 'Please choose whether you will attend' }
  }

  let guest_count: number
  if (typeof o.guest_count === 'number' && Number.isFinite(o.guest_count)) {
    guest_count = Math.floor(o.guest_count)
  } else if (typeof o.guest_count === 'string' && o.guest_count.trim() !== '') {
    guest_count = parseInt(o.guest_count, 10)
    if (!Number.isFinite(guest_count)) {
      return { ok: false, message: 'Number of guests must be a whole number' }
    }
  } else {
    return { ok: false, message: 'Number of guests is required' }
  }

  if (!first_name) return { ok: false, message: 'First name is required' }
  if (!last_name) return { ok: false, message: 'Last name is required' }
  if (!email) return { ok: false, message: 'Email is required' }
  if (!EMAIL_RE.test(email)) return { ok: false, message: 'Please enter a valid email address' }

  if (attending) {
    if (guest_count < 1) {
      return { ok: false, message: 'If you are attending, guest count must be at least 1 (including you)' }
    }
    if (guest_count > 20) {
      return { ok: false, message: 'Please contact us if your party is larger than 20' }
    }
  } else {
    guest_count = 0
  }

  const guest_names =
    typeof o.guest_names === 'string' ? o.guest_names.trim() || null : null
  const dietary_restrictions =
    typeof o.dietary_restrictions === 'string' ? o.dietary_restrictions.trim() || null : null
  const notes = typeof o.notes === 'string' ? o.notes.trim() || null : null
  const household_name =
    typeof o.household_name === 'string' ? o.household_name.trim() || null : null
  const mailing_address =
    typeof o.mailing_address === 'string' ? o.mailing_address.trim() || null : null

  const staying_friday = o.staying_friday === true || o.staying_friday === 'true'
  const staying_saturday = o.staying_saturday === true || o.staying_saturday === 'true'

  return {
    ok: true,
    data: {
      first_name,
      last_name,
      email,
      phone,
      attending,
      guest_count,
      guest_names,
      dietary_restrictions,
      notes,
      household_code,
      household_name,
      mailing_address,
      staying_friday,
      staying_saturday,
    },
  }
}
