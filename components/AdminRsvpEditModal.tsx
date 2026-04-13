'use client'

import { useEffect, useState } from 'react'

export type AdminRsvpRow = {
  id: string
  event_key: string | null
  first_name: string
  last_name: string
  email: string
  phone: string | null
  attending: boolean
  guest_count: number
  guest_names: string | null
  dietary_restrictions: string | null
  notes: string | null
  household_name: string | null
  mailing_address: string | null
  staying_friday: boolean
  staying_saturday: boolean
  hotel_rooms: number | null
}

type Props = {
  rsvp: AdminRsvpRow
  password: string
  defaultEventKey: string
  eventKeyOptions: string[]
  onClose: () => void
  onSaved: () => void
}

export function AdminRsvpEditModal({
  rsvp,
  password,
  defaultEventKey,
  eventKeyOptions,
  onClose,
  onSaved,
}: Props) {
  const [eventKey, setEventKey] = useState(rsvp.event_key || defaultEventKey)
  const [firstName, setFirstName] = useState(rsvp.first_name)
  const [lastName, setLastName] = useState(rsvp.last_name)
  const [email, setEmail] = useState(rsvp.email)
  const [phone, setPhone] = useState(rsvp.phone || '')
  const [attending, setAttending] = useState(rsvp.attending)
  const [guestCount, setGuestCount] = useState(String(Math.max(0, rsvp.guest_count)))
  const [guestNames, setGuestNames] = useState(rsvp.guest_names || '')
  const [dietary, setDietary] = useState(rsvp.dietary_restrictions || '')
  const [householdName, setHouseholdName] = useState(rsvp.household_name || '')
  const [mailingAddress, setMailingAddress] = useState(rsvp.mailing_address || '')
  const [stayingFriday, setStayingFriday] = useState(rsvp.staying_friday)
  const [stayingSaturday, setStayingSaturday] = useState(rsvp.staying_saturday)
  const [hotelRooms, setHotelRooms] = useState(
    rsvp.hotel_rooms != null && rsvp.hotel_rooms > 0 ? String(rsvp.hotel_rooms) : ''
  )
  const [notes, setNotes] = useState(rsvp.notes || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setEventKey(rsvp.event_key || defaultEventKey)
    setFirstName(rsvp.first_name)
    setLastName(rsvp.last_name)
    setEmail(rsvp.email)
    setPhone(rsvp.phone || '')
    setAttending(rsvp.attending)
    setGuestCount(String(Math.max(0, rsvp.guest_count)))
    setGuestNames(rsvp.guest_names || '')
    setDietary(rsvp.dietary_restrictions || '')
    setHouseholdName(rsvp.household_name || '')
    setMailingAddress(rsvp.mailing_address || '')
    setStayingFriday(rsvp.staying_friday)
    setStayingSaturday(rsvp.staying_saturday)
    setHotelRooms(rsvp.hotel_rooms != null && rsvp.hotel_rooms > 0 ? String(rsvp.hotel_rooms) : '')
    setNotes(rsvp.notes || '')
    setError('')
  }, [rsvp, defaultEventKey])

  const attendingYes = attending

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const label = `${firstName.trim()} ${lastName.trim()}`.trim() || 'this guest'
    if (
      !window.confirm(
        `Save changes for ${label}? This will update their RSVP in the database.`
      )
    ) {
      return
    }

    setSaving(true)
    setError('')

    const gc = attendingYes ? Math.max(1, parseInt(guestCount, 10) || 1) : 0
    let hr: number | null = null
    if (attendingYes) {
      const t = hotelRooms.trim()
      if (t !== '') {
        const n = parseInt(t, 10)
        if (Number.isFinite(n)) hr = Math.floor(n)
      }
    }

    const body = {
      id: rsvp.id,
      event_key: eventKey.trim() || defaultEventKey,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      attending: attendingYes,
      guest_count: gc,
      guest_names: attendingYes ? (guestNames.trim() || null) : null,
      dietary_restrictions: dietary.trim() || null,
      notes: notes.trim() || null,
      household_name: householdName.trim() || null,
      mailing_address: mailingAddress.trim() || null,
      staying_friday: attendingYes ? stayingFriday : false,
      staying_saturday: attendingYes ? stayingSaturday : false,
      hotel_rooms: hr,
      household_code: null,
    }

    try {
      const res = await fetch('/api/admin/rsvps', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify(body),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        const msg = typeof json?.error === 'string' ? json.error : 'Update failed.'
        throw new Error(msg)
      }
      onSaved()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed.')
    } finally {
      setSaving(false)
    }
  }

  const keyChoices = Array.from(
    new Set([defaultEventKey, ...eventKeyOptions.filter(Boolean)])
  ).sort()

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-rsvp-edit-title"
      onClick={onClose}
    >
      <div
        className="bg-background w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl shadow-xl border border-accent/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-background border-b border-accent/10 px-5 py-4 flex items-center justify-between gap-2">
          <h2 id="admin-rsvp-edit-title" className="font-heading text-xl text-accent">
            Edit RSVP
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-accent/60 hover:text-accent px-2 py-1"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-sm text-accent/60">
            Use this when a guest emails you with a change. Saving updates Supabase immediately.
          </p>

          <div>
            <label htmlFor="adm-ev" className="block text-xs font-semibold text-accent mb-1">
              Event key
            </label>
            <input
              id="adm-ev"
              list="admin-event-key-options"
              value={eventKey}
              onChange={(e) => setEventKey(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-accent/20 bg-white text-sm"
            />
            <datalist id="admin-event-key-options">
              {keyChoices.map((k) => (
                <option key={k} value={k} />
              ))}
            </datalist>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="adm-fn" className="block text-xs font-semibold text-accent mb-1">
                First name
              </label>
              <input
                id="adm-fn"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-accent/20 bg-white text-sm"
              />
            </div>
            <div>
              <label htmlFor="adm-ln" className="block text-xs font-semibold text-accent mb-1">
                Last name
              </label>
              <input
                id="adm-ln"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-accent/20 bg-white text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="adm-em" className="block text-xs font-semibold text-accent mb-1">
              Email
            </label>
            <input
              id="adm-em"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-accent/20 bg-white text-sm"
            />
            <p className="text-[11px] text-accent/50 mt-1">
              Must stay unique per event. If this email is already used for this event, the save will fail.
            </p>
          </div>

          <div>
            <label htmlFor="adm-ph" className="block text-xs font-semibold text-accent mb-1">
              Phone
            </label>
            <input
              id="adm-ph"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-accent/20 bg-white text-sm"
            />
          </div>

          <fieldset className="space-y-2">
            <legend className="text-xs font-semibold text-accent mb-1">Attending?</legend>
            <div className="flex flex-wrap gap-4">
              <label className="inline-flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  name="adm-att"
                  checked={attendingYes}
                  onChange={() => {
                    setAttending(true)
                    setGuestCount((c) => (parseInt(c, 10) < 1 ? '1' : c))
                  }}
                />
                Yes
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  name="adm-att"
                  checked={!attendingYes}
                  onChange={() => setAttending(false)}
                />
                No
              </label>
            </div>
          </fieldset>

          {attendingYes && (
            <>
              <div>
                <label htmlFor="adm-gc" className="block text-xs font-semibold text-accent mb-1">
                  Guest count (including primary)
                </label>
                <input
                  id="adm-gc"
                  type="number"
                  min={1}
                  max={20}
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  className="w-full max-w-[8rem] px-3 py-2 rounded-md border border-accent/20 bg-white text-sm"
                />
              </div>
              <div>
                <label htmlFor="adm-gn" className="block text-xs font-semibold text-accent mb-1">
                  Names in party
                </label>
                <textarea
                  id="adm-gn"
                  rows={2}
                  value={guestNames}
                  onChange={(e) => setGuestNames(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-accent/20 bg-white text-sm"
                />
              </div>
              <div>
                <label htmlFor="adm-di" className="block text-xs font-semibold text-accent mb-1">
                  Dietary
                </label>
                <textarea
                  id="adm-di"
                  rows={2}
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-accent/20 bg-white text-sm"
                />
              </div>
              <div className="space-y-2 rounded-lg border border-accent/15 p-3 bg-white/80">
                <p className="text-xs font-semibold text-accent">Hotel nights</p>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={stayingFriday}
                    onChange={(e) => setStayingFriday(e.target.checked)}
                  />
                  Friday night
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={stayingSaturday}
                    onChange={(e) => setStayingSaturday(e.target.checked)}
                  />
                  Saturday night
                </label>
                <div>
                  <label htmlFor="adm-hr" className="block text-xs font-semibold text-accent mb-1">
                    Rooms in block (optional)
                  </label>
                  <input
                    id="adm-hr"
                    type="number"
                    min={0}
                    max={50}
                    value={hotelRooms}
                    onChange={(e) => setHotelRooms(e.target.value)}
                    className="w-full max-w-[8rem] px-3 py-2 rounded-md border border-accent/20 bg-white text-sm"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label htmlFor="adm-hh" className="block text-xs font-semibold text-accent mb-1">
              Household name
            </label>
            <input
              id="adm-hh"
              value={householdName}
              onChange={(e) => setHouseholdName(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-accent/20 bg-white text-sm"
            />
          </div>

          <div>
            <label htmlFor="adm-addr" className="block text-xs font-semibold text-accent mb-1">
              Mailing address
            </label>
            <textarea
              id="adm-addr"
              rows={3}
              value={mailingAddress}
              onChange={(e) => setMailingAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-accent/20 bg-white text-sm font-mono"
              placeholder="Multi-line OK"
            />
          </div>

          <div>
            <label htmlFor="adm-no" className="block text-xs font-semibold text-accent mb-1">
              Notes / song request
            </label>
            <textarea
              id="adm-no"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-accent/20 bg-white text-sm"
            />
          </div>

          {error && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-md">
              {error}
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-accent/20 rounded-lg text-sm hover:bg-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
