'use client'

import { useMemo, useState } from 'react'
import weddingConfig from '@/config/wedding_config.json'

type Props = {
  defaultHouseholdCode?: string
}

export function RsvpForm({ defaultHouseholdCode }: Props) {
  const supportEmail = weddingConfig.site.supportEmail

  const [householdCode, setHouseholdCode] = useState(defaultHouseholdCode ?? '')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [attending, setAttending] = useState<boolean | null>(null)
  const [guestCount, setGuestCount] = useState('1')
  const [guestNames, setGuestNames] = useState('')
  const [dietary, setDietary] = useState('')
  const [householdName, setHouseholdName] = useState('')
  const [mailingAddress, setMailingAddress] = useState('')
  const [stayingFriday, setStayingFriday] = useState(false)
  const [stayingSaturday, setStayingSaturday] = useState(false)
  const [notes, setNotes] = useState('')

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const attendingYes = useMemo(() => attending === true, [attending])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (attending === null) {
      setErrorMessage('Please choose whether you will attend.')
      setStatus('error')
      return
    }

    setStatus('submitting')
    setErrorMessage('')

    const gc =
      attending === true
        ? Math.max(1, parseInt(guestCount, 10) || 1)
        : 0

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          household_code: householdCode.trim(),
          first_name: firstName,
          last_name: lastName,
          email,
          phone: phone.trim() || null,
          attending,
          guest_count: gc,
          guest_names: guestNames.trim() || null,
          dietary_restrictions: dietary.trim() || null,
          notes: notes.trim() || null,
          household_name: householdName.trim() || null,
          mailing_address: mailingAddress.trim() || null,
          staying_friday: stayingFriday,
          staying_saturday: stayingSaturday,
        }),
      })

      const json = await res.json().catch(() => ({}))

      if (!res.ok) {
        const msg =
          typeof json?.error === 'string'
            ? json.error
            : 'Something went wrong. Please try again.'
        setErrorMessage(msg)
        setStatus('error')
        return
      }

      setStatus('success')
    } catch {
      setErrorMessage('Network error. Check your connection and try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4 border border-primary/30">
        <h2 className="font-heading text-2xl text-accent">Thank you!</h2>
        <p className="text-accent/80 leading-relaxed">
          Your RSVP has been saved. If anything changes, submit again with the same email
          and we&apos;ll keep your latest response.
        </p>
        <p className="text-accent/60 text-sm">
          We&apos;ll be in touch with more details as the big day approaches.
        </p>
        <p className="text-accent/70 text-sm">
          Questions? Email{' '}
          <a href={`mailto:${supportEmail}`} className="text-primary font-semibold hover:underline">
            {supportEmail}
          </a>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-6 border border-accent/10">
      <p className="text-accent/80 leading-relaxed">
        Please respond by <strong>May 20, 2026</strong> so we can finalize headcount and hotel rooms.
        Use the same email if you need to update your RSVP later.
      </p>

      {/* Household code — always first and prominent */}
      <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
        <label htmlFor="household_code" className="block text-sm font-semibold text-accent mb-1">
          Household code <span className="text-red-600">*</span>
        </label>
        {defaultHouseholdCode ? (
          <p className="font-mono text-lg font-semibold text-accent">
            {defaultHouseholdCode}
          </p>
        ) : (
          <>
            <input
              id="household_code"
              type="text"
              required
              autoComplete="off"
              value={householdCode}
              onChange={(e) => setHouseholdCode(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-accent/20 bg-white focus:outline-none focus:ring-2 focus:ring-primary/80 font-mono"
              placeholder="e.g. smith3456"
            />
            <p className="text-xs text-accent/60 mt-1">
              Your last name + the numbers from your mailing address. Check your invitation if unsure.
            </p>
          </>
        )}
      </div>

      {/* Name */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="first_name" className="block text-sm font-semibold text-accent mb-1">
            First name <span className="text-red-600">*</span>
          </label>
          <input
            id="first_name"
            required
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-accent/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/80"
          />
        </div>
        <div>
          <label htmlFor="last_name" className="block text-sm font-semibold text-accent mb-1">
            Last name <span className="text-red-600">*</span>
          </label>
          <input
            id="last_name"
            required
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-accent/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/80"
          />
        </div>
      </div>

      {/* Contact */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-accent mb-1">
          Email <span className="text-red-600">*</span>
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-accent/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/80"
        />
        <p className="text-xs text-accent/60 mt-1">We may send important weekend updates to this address.</p>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-accent mb-1">
          Phone <span className="font-normal text-accent/60">(optional)</span>
        </label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-accent/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/80"
        />
      </div>

      {/* Attending */}
      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-accent mb-2">
          Will you attend? <span className="text-red-600">*</span>
        </legend>
        <div className="flex flex-wrap gap-4">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="attending"
              checked={attending === true}
              onChange={() => {
                setAttending(true)
                setGuestCount((c) => (parseInt(c, 10) < 1 ? '1' : c))
              }}
              className="text-primary focus:ring-primary"
            />
            <span>Yes, can&apos;t wait!</span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="attending"
              checked={attending === false}
              onChange={() => setAttending(false)}
              className="text-primary focus:ring-primary"
            />
            <span>Regretfully, no</span>
          </label>
        </div>
      </fieldset>

      {/* Attending-only fields */}
      {attendingYes && (
        <>
          <div>
            <label htmlFor="guest_count" className="block text-sm font-semibold text-accent mb-1">
              How many in your party? <span className="text-red-600">*</span>
            </label>
            <input
              id="guest_count"
              type="number"
              min={1}
              max={20}
              required
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
              className="w-full max-w-[8rem] px-3 py-2 rounded-md border border-accent/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/80"
            />
            <p className="text-xs text-accent/60 mt-1">Include yourself in the count.</p>
          </div>

          <div>
            <label htmlFor="guest_names" className="block text-sm font-semibold text-accent mb-1">
              Names of everyone in your party
            </label>
            <textarea
              id="guest_names"
              rows={2}
              value={guestNames}
              onChange={(e) => setGuestNames(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-accent/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/80"
              placeholder="List each person attending with you"
            />
          </div>

          <div>
            <label htmlFor="dietary" className="block text-sm font-semibold text-accent mb-1">
              Dietary restrictions or allergies <span className="font-normal text-accent/60">(optional)</span>
            </label>
            <textarea
              id="dietary"
              rows={2}
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-accent/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/80"
              placeholder="Allergies, vegetarian, etc."
            />
          </div>

          {/* Hotel nights */}
          <fieldset className="bg-accent/5 p-4 rounded-lg space-y-3">
            <legend className="text-sm font-semibold text-accent mb-1">
              Hotel nights at the Casino Resort
            </legend>
            <p className="text-xs text-accent/60">
              Help us plan the room block. Check the nights you plan to stay.
            </p>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={stayingFriday}
                onChange={(e) => setStayingFriday(e.target.checked)}
                className="text-primary focus:ring-primary rounded"
              />
              <span className="text-sm">Friday, June 19 (night before)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={stayingSaturday}
                onChange={(e) => setStayingSaturday(e.target.checked)}
                className="text-primary focus:ring-primary rounded"
              />
              <span className="text-sm">Saturday, June 20 (wedding night)</span>
            </label>
          </fieldset>
        </>
      )}

      {/* Address — shown for both attending and not */}
      <div>
        <label htmlFor="household_name" className="block text-sm font-semibold text-accent mb-1">
          Household / mailing name
        </label>
        <input
          id="household_name"
          autoComplete="organization"
          value={householdName}
          onChange={(e) => setHouseholdName(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-accent/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/80"
          placeholder="How your mail is addressed (e.g. The Smith Family)"
        />
      </div>

      <div>
        <label htmlFor="mailing_address" className="block text-sm font-semibold text-accent mb-1">
          Mailing address <span className="font-normal text-accent/60">(for thank-you notes)</span>
        </label>
        <textarea
          id="mailing_address"
          rows={3}
          value={mailingAddress}
          onChange={(e) => setMailingAddress(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-accent/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/80"
          placeholder="Street, city, state, ZIP"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-semibold text-accent mb-1">
          Notes or song request <span className="font-normal text-accent/60">(optional)</span>
        </label>
        <textarea
          id="notes"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-accent/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/80"
        />
      </div>

      {status === 'error' && errorMessage && (
        <div
          role="alert"
          className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-md"
        >
          {errorMessage}
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full sm:w-auto px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'submitting' ? 'Sending...' : 'Submit RSVP'}
        </button>
      </div>
    </form>
  )
}
