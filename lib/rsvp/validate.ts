export type RsvpPayload = {
  event_key: string
  first_name: string
  last_name: string
  email: string
  phone?: string | null
  attending: boolean
  guest_count: number
  guest_names?: string | null
  dietary_restrictions?: string | null
  notes?: string | null
  household_code: string | null
  household_name?: string | null
  mailing_address?: string | null
  staying_friday: boolean
  staying_saturday: boolean
  /** Guest rooms in the wedding block; null if not provided */
  hotel_rooms: number | null
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function normalizeEventKey(key: string): string {
  return key.trim().toLowerCase().replace(/\s+/g, '-')
}

export function validateRsvpPayload(raw: unknown): { ok: true; data: RsvpPayload } | { ok: false; message: string } {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, message: 'Invalid JSON body' }
  }

  const o = raw as Record<string, unknown>

  const event_key_raw = typeof o.event_key === 'string' ? o.event_key.trim() : ''
  if (!event_key_raw) {
    return { ok: false, message: 'Event key is missing. Please refresh and try again.' }
  }
  const event_key = normalizeEventKey(event_key_raw)

  const first_name = typeof o.first_name === 'string' ? o.first_name.trim() : ''
  const last_name = typeof o.last_name === 'string' ? o.last_name.trim() : ''
  const email = typeof o.email === 'string' ? o.email.trim() : ''
  const phone =
    o.phone === undefined || o.phone === null || o.phone === ''
      ? null
      : String(o.phone).trim() || null

  /** No longer collected; always null for new submissions (column may hold legacy data). */
  const household_code: string | null = null

  let attending: boolean
  if (o.attending === true || o.attending === 'true') attending = true
  else if (o.attending === false || o.attending === 'false') attending = false
  else {
    return { ok: false, message: 'Please choose whether you will attend' }
  }

  let guest_count: number
  if (!attending) {
    guest_count = 0
  } else if (typeof o.guest_count === 'number' && Number.isFinite(o.guest_count)) {
    guest_count = Math.floor(o.guest_count)
  } else if (typeof o.guest_count === 'string' && o.guest_count.trim() !== '') {
    guest_count = parseInt(o.guest_count, 10)
    if (!Number.isFinite(guest_count)) {
      return { ok: false, message: 'Number of guests must be a whole number' }
    }
  } else {
    guest_count = 1
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

  let hotel_rooms: number | null = null
  if (attending) {
    if (o.hotel_rooms === undefined || o.hotel_rooms === null || o.hotel_rooms === '') {
      hotel_rooms = null
    } else if (typeof o.hotel_rooms === 'number' && Number.isFinite(o.hotel_rooms)) {
      hotel_rooms = Math.floor(o.hotel_rooms)
    } else if (typeof o.hotel_rooms === 'string' && o.hotel_rooms.trim() !== '') {
      const n = parseInt(o.hotel_rooms, 10)
      if (!Number.isFinite(n)) {
        return { ok: false, message: 'Number of rooms must be a whole number' }
      }
      hotel_rooms = Math.floor(n)
    }
    if (hotel_rooms !== null) {
      if (hotel_rooms < 0) return { ok: false, message: 'Number of rooms cannot be negative' }
      if (hotel_rooms > 50) return { ok: false, message: 'Please contact us if you need more than 50 rooms' }
    }
  }

  return {
    ok: true,
    data: {
      event_key,
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
      hotel_rooms,
    },
  }
}
