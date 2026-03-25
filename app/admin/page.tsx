'use client'

import { useState } from 'react'

type Rsvp = {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  attending: boolean
  guest_count: number
  guest_names: string | null
  dietary_restrictions: string | null
  notes: string | null
  household_code: string | null
  household_name: string | null
  mailing_address: string | null
  staying_friday: boolean
  staying_saturday: boolean
  thank_you_status: string | null
  created_at: string
  updated_at: string
}

type Summary = {
  total_responses: number
  attending_parties: number
  declined_parties: number
  total_guests: number
  friday_hotel: number
  saturday_hotel: number
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [summary, setSummary] = useState<Summary | null>(null)
  const [rsvps, setRsvps] = useState<Rsvp[]>([])
  const [filter, setFilter] = useState<'all' | 'attending' | 'declined'>('all')

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/rsvps', {
        headers: { Authorization: `Bearer ${password}` },
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        setError(j?.error || 'Invalid password or admin not configured.')
        setLoading(false)
        return
      }
      const data = await res.json()
      setSummary(data.summary)
      setRsvps(data.rsvps)
      setAuthed(true)
    } catch {
      setError('Network error.')
    }
    setLoading(false)
  }

  async function refresh() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/rsvps', {
        headers: { Authorization: `Bearer ${password}` },
      })
      if (res.ok) {
        const data = await res.json()
        setSummary(data.summary)
        setRsvps(data.rsvps)
      }
    } catch {}
    setLoading(false)
  }

  function exportCsv() {
    if (!rsvps.length) return
    const headers = [
      'first_name', 'last_name', 'email', 'phone', 'attending', 'guest_count',
      'guest_names', 'dietary_restrictions', 'household_code', 'household_name',
      'mailing_address', 'staying_friday', 'staying_saturday', 'notes',
      'thank_you_status', 'created_at', 'updated_at',
    ]
    const esc = (v: unknown) => {
      if (v === null || v === undefined) return ''
      const s = String(v)
      return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
    }
    const lines = [
      headers.join(','),
      ...rsvps.map((r) => headers.map((h) => esc((r as any)[h])).join(',')),
    ]
    const blob = new Blob([lines.join('\r\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rsvp-export-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

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

  const filtered =
    filter === 'attending' ? rsvps.filter((r) => r.attending) :
    filter === 'declined' ? rsvps.filter((r) => !r.attending) :
    rsvps

  return (
    <main className="min-h-screen py-8 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-3xl">RSVP Dashboard</h1>
          <div className="flex gap-2">
            <button
              onClick={refresh}
              disabled={loading}
              className="px-4 py-2 text-sm border border-accent/20 rounded-lg hover:bg-white transition"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
            <button
              onClick={exportCsv}
              className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Summary cards */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
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
              <p className="text-2xl font-bold">{summary.friday_hotel}</p>
              <p className="text-xs text-accent/60">Fri Rooms</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <p className="text-2xl font-bold">{summary.saturday_hotel}</p>
              <p className="text-xs text-accent/60">Sat Rooms</p>
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4">
          {(['all', 'attending', 'declined'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-sm rounded-full transition ${
                filter === f
                  ? 'bg-primary text-white'
                  : 'bg-white border border-accent/20 text-accent/70 hover:bg-accent/5'
              }`}
            >
              {f === 'all' ? `All (${rsvps.length})` :
               f === 'attending' ? `Attending (${rsvps.filter(r => r.attending).length})` :
               `Declined (${rsvps.filter(r => !r.attending).length})`}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-accent/5">
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Code</th>
                <th className="text-left p-3">Email</th>
                <th className="text-center p-3">Status</th>
                <th className="text-center p-3">Guests</th>
                <th className="text-center p-3">Fri</th>
                <th className="text-center p-3">Sat</th>
                <th className="text-left p-3">Dietary</th>
                <th className="text-left p-3">Updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b hover:bg-accent/5 transition">
                  <td className="p-3 font-medium whitespace-nowrap">
                    {r.first_name} {r.last_name}
                    {r.guest_names && (
                      <p className="text-xs text-accent/60 font-normal">{r.guest_names}</p>
                    )}
                  </td>
                  <td className="p-3 font-mono text-xs text-accent/70">{r.household_code || '—'}</td>
                  <td className="p-3 text-accent/70">{r.email}</td>
                  <td className="p-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                      r.attending ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'
                    }`}>
                      {r.attending ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="p-3 text-center">{r.guest_count}</td>
                  <td className="p-3 text-center">{r.staying_friday ? '✓' : ''}</td>
                  <td className="p-3 text-center">{r.staying_saturday ? '✓' : ''}</td>
                  <td className="p-3 text-accent/70 max-w-[150px] truncate">{r.dietary_restrictions || ''}</td>
                  <td className="p-3 text-xs text-accent/60 whitespace-nowrap">
                    {new Date(r.updated_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-accent/50">
                    No RSVPs yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
