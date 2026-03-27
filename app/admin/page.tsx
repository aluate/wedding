'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import weddingConfig from '@/config/wedding_config.json'

type Rsvp = {
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
  thank_you_status: string | null
  created_at: string
  updated_at: string
}

type Summary = {
  total_responses: number
  attending_parties: number
  declined_parties: number
  total_guests: number
  parties_staying_friday: number
  parties_staying_saturday: number
  total_rooms_reported: number
  rsvps_with_room_count: number
  friday_hotel: number
  saturday_hotel: number
}

type AdminPayload = {
  summary: Summary
  rsvps: Rsvp[]
  event_keys: string[]
  selected_event_key: string | null
}

const DEFAULT_EVENT = weddingConfig.site.currentEventKey || 'wedding-2026'

type AdminPhoto = {
  id: string
  filename: string
  url: string
  event_key?: string | null
  uploader_name: string | null
  caption: string | null
  created_at: string
}

type HotelRoomBlockConfig = {
  venueLabel?: string
  notes?: string
  roomTypes?: { id: string; name: string; roomsHeldInBlock: number }[]
}

const hotelRoomBlock = (weddingConfig as typeof weddingConfig & { hotelRoomBlock?: HotelRoomBlockConfig }).hotelRoomBlock

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [summary, setSummary] = useState<Summary | null>(null)
  const [rsvps, setRsvps] = useState<Rsvp[]>([])
  const [eventKeys, setEventKeys] = useState<string[]>([])
  const [eventFilter, setEventFilter] = useState<string>(DEFAULT_EVENT)
  const [attendingFilter, setAttendingFilter] = useState<'all' | 'attending' | 'declined'>('all')
  const [adminTab, setAdminTab] = useState<'rsvps' | 'photos'>('rsvps')
  const [photoList, setPhotoList] = useState<AdminPhoto[]>([])
  const [photoEventKeys, setPhotoEventKeys] = useState<string[]>([])
  const [photoEventFilter, setPhotoEventFilter] = useState<string>('all')
  const [photoLoading, setPhotoLoading] = useState(false)
  const [photoError, setPhotoError] = useState('')

  async function loadData(selectedEvent: string) {
    const qs = selectedEvent && selectedEvent !== 'all' ? `?event_key=${encodeURIComponent(selectedEvent)}` : ''
    const res = await fetch(`/api/admin/rsvps${qs}`, {
      headers: { Authorization: `Bearer ${password}` },
    })

    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      throw new Error(j?.error || 'Invalid password or admin not configured.')
    }

    const data = (await res.json()) as AdminPayload
    setSummary(data.summary)
    setRsvps(data.rsvps)
    setEventKeys(data.event_keys || [])
  }

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await loadData(eventFilter)
      setAuthed(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Network error.')
    } finally {
      setLoading(false)
    }
  }

  async function refresh(selectedEvent = eventFilter) {
    setLoading(true)
    setError('')
    try {
      await loadData(selectedEvent)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Network error.')
    } finally {
      setLoading(false)
    }
  }

  const loadPhotosAdmin = useCallback(async () => {
    setPhotoLoading(true)
    setPhotoError('')
    try {
      const qs = photoEventFilter === 'all' ? '?event_key=all' : `?event_key=${encodeURIComponent(photoEventFilter)}`
      const res = await fetch(`/api/admin/photos${qs}`, {
        headers: { Authorization: `Bearer ${password}` },
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j?.error || 'Could not load photos.')
      }
      const data = (await res.json()) as { photos: AdminPhoto[]; event_keys: string[] }
      setPhotoList(data.photos || [])
      setPhotoEventKeys(data.event_keys || [])
    } catch (e) {
      setPhotoError(e instanceof Error ? e.message : 'Network error.')
    } finally {
      setPhotoLoading(false)
    }
  }, [password, photoEventFilter])

  useEffect(() => {
    if (!authed || adminTab !== 'photos') return
    void loadPhotosAdmin()
  }, [authed, adminTab, photoEventFilter, loadPhotosAdmin])

  async function deletePhoto(id: string) {
    if (!confirm('Remove this photo from the wall and storage?')) return
    setPhotoError('')
    try {
      const res = await fetch(`/api/admin/photos?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${password}` },
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(j?.error || 'Delete failed.')
      }
      setPhotoList((prev) => prev.filter((p) => p.id !== id))
    } catch (e) {
      setPhotoError(e instanceof Error ? e.message : 'Delete failed.')
    }
  }

  function exportCsv() {
    if (!rsvps.length) return
    const headers = [
      'event_key',
      'first_name',
      'last_name',
      'email',
      'phone',
      'attending',
      'guest_count',
      'guest_names',
      'dietary_restrictions',
      'household_name',
      'mailing_address',
      'staying_friday',
      'staying_saturday',
      'hotel_rooms',
      'notes',
      'thank_you_status',
      'created_at',
      'updated_at',
    ]

    const esc = (v: unknown) => {
      if (v === null || v === undefined) return ''
      const s = String(v)
      return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
    }

    const lines = [headers.join(','), ...rsvps.map((r) => headers.map((h) => esc((r as Record<string, unknown>)[h])).join(','))]
    const blob = new Blob([lines.join('\r\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rsvp-export-${eventFilter}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filtered = useMemo(() => {
    if (attendingFilter === 'attending') return rsvps.filter((r) => r.attending)
    if (attendingFilter === 'declined') return rsvps.filter((r) => !r.attending)
    return rsvps
  }, [rsvps, attendingFilter])

  if (!authed) {
    return (
      <main className="min-h-screen py-12 px-4">
        <div className="max-w-sm mx-auto">
          <h1 className="font-heading text-3xl mb-6">Admin</h1>
          <form onSubmit={login} className="space-y-4">
            <div>
              <label htmlFor="pw" className="block text-sm font-semibold mb-1">Password</label>
              <input
                id="pw"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-accent/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/80"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-60"
            >
              {loading ? 'Loading...' : 'Sign In'}
            </button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen py-8 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h1 className="font-heading text-3xl">Site admin</h1>
        </div>

        <div className="flex flex-wrap gap-2 mb-6 border-b border-accent/20 pb-4">
          <button
            type="button"
            onClick={() => setAdminTab('rsvps')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
              adminTab === 'rsvps' ? 'bg-primary text-white' : 'bg-white border border-accent/20 text-accent/80 hover:bg-accent/5'
            }`}
          >
            RSVPs
          </button>
          <button
            type="button"
            onClick={() => setAdminTab('photos')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
              adminTab === 'photos' ? 'bg-primary text-white' : 'bg-white border border-accent/20 text-accent/80 hover:bg-accent/5'
            }`}
          >
            Photo wall
          </button>
        </div>

        {adminTab === 'rsvps' && (
          <>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h2 className="font-heading text-xl text-accent">RSVP dashboard</h2>
          <div className="flex items-center gap-2">
            <select
              value={eventFilter}
              onChange={(e) => {
                const value = e.target.value
                setEventFilter(value)
                refresh(value)
              }}
              className="px-3 py-2 rounded-lg border border-accent/20 bg-white text-sm"
            >
              <option value="all">All events</option>
              {[DEFAULT_EVENT, ...eventKeys.filter((k) => k !== DEFAULT_EVENT)].map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
            <button onClick={() => refresh()} disabled={loading} className="px-4 py-2 text-sm border border-accent/20 rounded-lg hover:bg-white transition">
              {loading ? 'Loading...' : 'Refresh'}
            </button>
            <button onClick={exportCsv} className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition">
              Export CSV
            </button>
          </div>
        </div>

        {summary && (
          <div className="space-y-2 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <p className="text-2xl font-bold">{summary.total_responses}</p>
                <p className="text-xs text-accent/60">Responses</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <p className="text-2xl font-bold text-green-600">{summary.attending_parties}</p>
                <p className="text-xs text-accent/60">Attending</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <p className="text-2xl font-bold text-red-500">{summary.declined_parties}</p>
                <p className="text-xs text-accent/60">Declined</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <p className="text-2xl font-bold text-primary">{summary.total_guests}</p>
                <p className="text-xs text-accent/60">Total Heads</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <p className="text-2xl font-bold">{summary.parties_staying_friday}</p>
                <p className="text-xs text-accent/60">Parties · Fri night</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <p className="text-2xl font-bold">{summary.parties_staying_saturday}</p>
                <p className="text-xs text-accent/60">Parties · Sat night</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm text-center border-2 border-primary/20">
                <p className="text-2xl font-bold text-primary">{summary.total_rooms_reported}</p>
                <p className="text-xs text-accent/60">Rooms reported</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                <p className="text-2xl font-bold">{summary.rsvps_with_room_count}</p>
                <p className="text-xs text-accent/60">RSVPs w/ room #</p>
              </div>
            </div>
            <p className="text-xs text-accent/50">
              “Parties” counts families who checked each night. “Rooms reported” sums the optional room counts from RSVPs (not the same as party count).
            </p>
          </div>
        )}

        {hotelRoomBlock?.roomTypes && hotelRoomBlock.roomTypes.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-accent/10 p-5 mb-8">
            <h2 className="font-heading text-lg text-accent mb-1">Room block inventory (contract)</h2>
            {hotelRoomBlock.venueLabel && <p className="text-sm text-accent/70 mb-3">{hotelRoomBlock.venueLabel}</p>}
            {hotelRoomBlock.notes && <p className="text-xs text-accent/60 mb-4">{hotelRoomBlock.notes}</p>}
            <div className="grid sm:grid-cols-3 gap-4">
              {hotelRoomBlock.roomTypes.map((t) => (
                <div key={t.id} className="rounded-lg bg-accent/5 border border-accent/10 p-4">
                  <p className="font-semibold text-accent">{t.name}</p>
                  <p className="text-2xl font-bold text-primary mt-1">{t.roomsHeldInBlock}</p>
                  <p className="text-xs text-accent/60 mt-1">rooms held in block (placeholder)</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-4">
          {(['all', 'attending', 'declined'] as const).map((f) => (
            <button key={f} onClick={() => setAttendingFilter(f)} className={`px-4 py-1.5 text-sm rounded-full transition ${attendingFilter === f ? 'bg-primary text-white' : 'bg-white border border-accent/20 text-accent/70 hover:bg-accent/5'}`}>
              {f === 'all' ? `All (${rsvps.length})` : f === 'attending' ? `Attending (${rsvps.filter((r) => r.attending).length})` : `Declined (${rsvps.filter((r) => !r.attending).length})`}
            </button>
          ))}
        </div>

        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-accent/5">
                <th className="text-left p-3">Event</th>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-center p-3">Status</th>
                <th className="text-center p-3">Guests</th>
                <th className="text-center p-3">Fri</th>
                <th className="text-center p-3">Sat</th>
                <th className="text-center p-3">Rooms</th>
                <th className="text-left p-3">Updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b hover:bg-accent/5 transition">
                  <td className="p-3 text-xs text-accent/70 whitespace-nowrap">{r.event_key || 'unknown'}</td>
                  <td className="p-3 font-medium whitespace-nowrap">{r.first_name} {r.last_name}{r.guest_names && <p className="text-xs text-accent/60 font-normal">{r.guest_names}</p>}</td>
                  <td className="p-3 text-accent/70">{r.email}</td>
                  <td className="p-3 text-center"><span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${r.attending ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'}`}>{r.attending ? 'Yes' : 'No'}</span></td>
                  <td className="p-3 text-center">{r.guest_count}</td>
                  <td className="p-3 text-center">{r.staying_friday ? '✓' : ''}</td>
                  <td className="p-3 text-center">{r.staying_saturday ? '✓' : ''}</td>
                  <td className="p-3 text-center tabular-nums">{r.hotel_rooms != null && r.hotel_rooms > 0 ? r.hotel_rooms : '—'}</td>
                  <td className="p-3 text-xs text-accent/60 whitespace-nowrap">{new Date(r.updated_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="p-8 text-center text-accent/50">No RSVPs yet for this event filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
          </>
        )}

        {adminTab === 'photos' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-heading text-xl text-accent">Photo wall</h2>
              <div className="flex items-center gap-2">
                <select
                  value={photoEventFilter}
                  onChange={(e) => setPhotoEventFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-accent/20 bg-white text-sm"
                >
                  <option value="all">All events</option>
                  {[DEFAULT_EVENT, ...photoEventKeys.filter((k) => k !== DEFAULT_EVENT)].map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => void loadPhotosAdmin()}
                  disabled={photoLoading}
                  className="px-4 py-2 text-sm border border-accent/20 rounded-lg hover:bg-white transition"
                >
                  {photoLoading ? 'Loading...' : 'Refresh'}
                </button>
              </div>
            </div>
            <p className="text-sm text-accent/60">
              Photos are tagged with an event key when uploaded (same as your site&apos;s current event in config). Delete anything inappropriate — it removes the file and the database row.
            </p>
            {photoError && <p className="text-sm text-red-600">{photoError}</p>}
            {photoLoading && photoList.length === 0 ? (
              <p className="text-accent/50">Loading photos...</p>
            ) : photoList.length === 0 ? (
              <p className="text-accent/50 py-8 text-center">No photos for this filter.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {photoList.map((p) => (
                  <div key={p.id} className="relative group rounded-lg overflow-hidden border border-accent/15 bg-white shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.url} alt={p.caption || ''} className="w-full h-40 object-cover" />
                    <div className="p-2 text-xs space-y-1">
                      <p className="font-mono text-[10px] text-primary truncate">{p.event_key || '—'}</p>
                      {p.caption && <p className="text-accent/80 line-clamp-2">{p.caption}</p>}
                      {p.uploader_name && <p className="text-accent/50">{p.uploader_name}</p>}
                      <p className="text-accent/40">{new Date(p.created_at).toLocaleString()}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void deletePhoto(p.id)}
                      className="absolute top-2 right-2 px-2 py-1 rounded bg-red-600 text-white text-xs font-semibold opacity-90 hover:opacity-100 shadow"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
