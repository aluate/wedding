'use client'

import { useMemo, useState } from 'react'
import weddingConfig from '@/config/wedding_config.json'

/** Combine structured fields for one DB column; uses newlines so thank-you exports stay readable. */
function buildMailingAddress(parts: {
  line1: string
  line2: string
  city: string
  region: string
  postal: string
  country: string
}): string | null {
  const line1 = parts.line1.trim()
  const line2 = parts.line2.trim()
  const city = parts.city.trim()
  const region = parts.region.trim()
  const postal = parts.postal.trim()
  const country = parts.country.trim()

  const cityRegion = [city, region].filter(Boolean).join(', ')
  const cityLine = [cityRegion, postal].filter(Boolean).join(' ').trim()

  const lines = [line1, line2, cityLine, country].filter(Boolean)
  return lines.length ? lines.join('\n') : null
}

export function RsvpForm() {
  const supportEmail = weddingConfig.site.supportEmail
  const supportPhone = weddingConfig.site.supportPhone
  const eventKey = weddingConfig.site.currentEventKey || 'wedding-2026'

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [attending, setAttending] = useState<boolean | null>(null)
  const [guestCount, setGuestCount] = useState('1')
  const [guestNames, setGuestNames] = useState('')
  const [dietary, setDietary] = useState('')
  const [householdName, setHouseholdName] = useState('')
  const [addrLine1, setAddrLine1] = useState('')
  const [addrLine2, setAddrLine2] = useState('')
  const [addrCity, setAddrCity] = useState('')
  const [addrRegion, setAddrRegion] = useState('')
  const [addrPostal, setAddrPostal] = useState('')
  const [addrCountry, setAddrCountry] = useState('')
  const [stayingFriday, setStayingFriday] = useState(false)
  const [stayingSaturday, setStayingSaturday] = useState(false)
  const [hotelRooms, setHotelRooms] = useState('')
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

    const attendingVal = attending === true
    const gc = attendingVal ? Math.max(1, parseInt(guestCount, 10) || 1) : 0
    const mailing = buildMailingAddress({
      line1: addrLine1,
      line2: addrLine2,
      city: addrCity,
      region: addrRegion,
      postal: addrPostal,
      country: addrCountry,
    })

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_key: eventKey,
          first_name: firstName,
          last_name: lastName,
          email,
          phone: phone.trim() || null,
          attending: attendingVal,
          guest_count: gc,
          guest_names: guestNames.trim() || null,
          dietary_restrictions: dietary.trim() || null,
          notes: notes.trim() || null,
          household_name: householdName.trim() || null,
          mailing_address: mailing,
          staying_friday: stayingFriday,
          staying_saturday: stayingSaturday,
          hotel_rooms: (() => {
            const n = parseInt(hotelRooms, 10)
            if (!Number.isFinite(n) || hotelRooms.trim() === '') return null
            return n
          })(),
        }),
      })

      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        const msg = typeof json?.error === 'string' ? json.error : 'Something went wrong. Please try again.'
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
          Your RSVP has been saved. If anything changes, submit again with the same email and we&apos;ll keep your latest response.
        </p>
        <p className="text-accent/60 text-sm">
          We may send a brief confirmation to the email you used (check spam). We&apos;ll be in touch with more details as the big day approaches.
        </p>
        <p className="text-accent/70 text-sm">
          Questions? Email <a href={`mailto:${supportEmail}`} className="text-primary font-semibold hover:underline">{supportEmail}</a> or call/text <a href={`tel:+1${supportPhone.replace(/\D/g, '')}`} className="text-primary font-semibold hover:underline">{supportPhone}</a>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-6 border border-accent/10">
      <p className="text-accent/80 leading-relaxed">
        Please respond by <strong>May 20, 2026</strong> so we can finalize headcount and hotel rooms. Use the same email if you need to update your RSVP later — that&apos;s how we know it&apos;s you.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="first_name" className="block text-sm font-semibold text-accent mb-1">First name <span className="text-red-600">*</span></label>
          <input id="first_name" required autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-3 py-2 rounded-md border border-accent/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/80" />
        </div>
        <div>
          <label htmlFor="last_name" className="block text-sm font-semibold text-accent mb-1">Last name <span className="text-red-600">*</span></label>
          <input id="last_name" required autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-3 py-2 rounded-md border border-accent/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/80" />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-accent mb-1">Email <span className="text-red-600">*</span></label>
        <input id="email" type="email" required autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 rounded-md border border-accent/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/80" />
        <p className="text-xs text-accent/60 mt-1">We may send important weekend updates to this address.</p>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-accent mb-1">Phone <span className="font-normal text-accent/60">(optional)</span></label>
        <input id="phone" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 rounded-md border border-accent/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/80" />
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-accent mb-2">
          Will you attend? <span className="text-red-600">*</span>
        </legend>
        <div className="flex flex-wrap gap-4">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="attending"
              required
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

      {attendingYes && (
        <>
          <div>
            <label htmlFor="guest_count" className="block text-sm font-semibold text-accent mb-1">
              How many in your party? <span className="font-normal text-accent/60">(defaults to 1)</span>
            </label>
            <input id="guest_count" type="number" min={1} max={20} value={guestCount} onChange={(e) => setGuestCount(e.target.value)} className="w-full max-w-[8rem] px-3 py-2 rounded-md border border-accent/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/80" />
            <p className="text-xs text-accent/60 mt-1">Include yourself in the count.</p>
          </div>

          <div>
            <label htmlFor="guest_names" className="block text-sm font-semibold text-accent mb-1">Names of everyone in your party</label>
            <textarea id="guest_names" rows={2} value={guestNames} onChange={(e) => setGuestNames(e.target.value)} className="w-full px-3 py-2 rounded-md border border-accent/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/80" placeholder="List each person attending with you" />
          </div>

          <div>
            <label htmlFor="dietary" className="block text-sm font-semibold text-accent mb-1">Dietary restrictions or allergies <span className="font-normal text-accent/60">(optional)</span></label>
            <textarea id="dietary" rows={2} value={dietary} onChange={(e) => setDietary(e.target.value)} className="w-full px-3 py-2 rounded-md border border-accent/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/80" placeholder="Allergies, vegetarian, etc." />
          </div>

          <fieldset className="bg-accent/5 p-4 rounded-lg space-y-3">
            <legend className="text-sm font-semibold text-accent mb-1">Hotel at the Casino Resort</legend>
            <p className="text-xs text-accent/60">
              Help us plan the room block: which nights you need, and how many guest rooms in our wedding block (one number is fine if you&apos;re staying multiple nights).
            </p>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={stayingFriday} onChange={(e) => setStayingFriday(e.target.checked)} className="text-primary focus:ring-primary rounded" />
              <span className="text-sm">Friday, June 19 (night before)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={stayingSaturday} onChange={(e) => setStayingSaturday(e.target.checked)} className="text-primary focus:ring-primary rounded" />
              <span className="text-sm">Saturday, June 20 (wedding night)</span>
            </label>
            <div className="pt-2 border-t border-accent/10">
              <label htmlFor="hotel_rooms" className="block text-sm font-semibold text-accent mb-1">
                How many guest rooms in our block? <span className="font-normal text-accent/60">(optional)</span>
              </label>
              <input
                id="hotel_rooms"
                type="number"
                min={0}
                max={50}
                inputMode="numeric"
                value={hotelRooms}
                onChange={(e) => setHotelRooms(e.target.value)}
                className="w-full max-w-[8rem] px-3 py-2 rounded-md border border-accent/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/80"
                placeholder="e.g. 2"
              />
              <p className="text-xs text-accent/60 mt-1">Rough count of rooms your party needs (not room type). Leave blank if you&apos;re not sure yet.</p>
            </div>
          </fieldset>
        </>
      )}

      <div>
        <label htmlFor="household_name" className="block text-sm font-semibold text-accent mb-1">Household / mailing name</label>
        <input
          id="household_name"
          name="organization"
          autoComplete="shipping organization"
          value={householdName}
          onChange={(e) => setHouseholdName(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-accent/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/80"
          placeholder="How your mail is addressed (e.g. The Smith Family)"
        />
      </div>

      <fieldset className="space-y-3 border border-accent/10 rounded-lg p-4">
        <legend className="text-sm font-semibold text-accent px-1">
          Mailing address <span className="font-normal text-accent/60">(optional — for thank-you notes)</span>
        </legend>
        <p className="text-xs text-accent/60 -mt-1">
          Separate fields let your browser autofill street, city, state, and ZIP from your saved address.
        </p>
        <div>
          <label htmlFor="ship_addr1" className="block text-sm font-medium text-accent mb-1">
            Street address
          </label>
          <input
            id="ship_addr1"
            name="shipping-address-line1"
            autoComplete="shipping address-line1"
            value={addrLine1}
            onChange={(e) => setAddrLine1(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-accent/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/80"
            placeholder="Street and number"
          />
        </div>
        <div>
          <label htmlFor="ship_addr2" className="block text-sm font-medium text-accent mb-1">
            Apt / suite <span className="font-normal text-accent/50">(optional)</span>
          </label>
          <input
            id="ship_addr2"
            name="shipping-address-line2"
            autoComplete="shipping address-line2"
            value={addrLine2}
            onChange={(e) => setAddrLine2(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-accent/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/80"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ship_city" className="block text-sm font-medium text-accent mb-1">
              City
            </label>
            <input
              id="ship_city"
              name="shipping-address-level2"
              autoComplete="shipping address-level2"
              value={addrCity}
              onChange={(e) => setAddrCity(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-accent/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/80"
            />
          </div>
          <div>
            <label htmlFor="ship_region" className="block text-sm font-medium text-accent mb-1">
              State / province
            </label>
            <input
              id="ship_region"
              name="shipping-address-level1"
              autoComplete="shipping address-level1"
              value={addrRegion}
              onChange={(e) => setAddrRegion(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-accent/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/80"
              placeholder="e.g. ID"
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ship_postal" className="block text-sm font-medium text-accent mb-1">
              ZIP / postal code
            </label>
            <input
              id="ship_postal"
              name="shipping-postal-code"
              autoComplete="shipping postal-code"
              value={addrPostal}
              onChange={(e) => setAddrPostal(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-accent/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/80"
            />
          </div>
          <div>
            <label htmlFor="ship_country" className="block text-sm font-medium text-accent mb-1">
              Country <span className="font-normal text-accent/50">(optional)</span>
            </label>
            <input
              id="ship_country"
              name="shipping-country"
              autoComplete="shipping country"
              value={addrCountry}
              onChange={(e) => setAddrCountry(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-accent/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/80"
              placeholder="e.g. United States"
            />
          </div>
        </div>
      </fieldset>

      <div>
        <label htmlFor="notes" className="block text-sm font-semibold text-accent mb-1">Notes or song request <span className="font-normal text-accent/60">(optional)</span></label>
        <textarea id="notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-3 py-2 rounded-md border border-accent/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/80" />
      </div>

      {status === 'error' && errorMessage && (
        <div role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-md">{errorMessage}</div>
      )}

      <div className="pt-2">
        <button type="submit" disabled={status === 'submitting'} className="w-full sm:w-auto px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-60 disabled:cursor-not-allowed">
          {status === 'submitting' ? 'Sending...' : 'Submit RSVP'}
        </button>
      </div>
    </form>
  )
}
