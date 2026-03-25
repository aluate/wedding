import { redirect } from 'next/navigation'

/**
 * QR / per-household links: /rsvp/{code} → /rsvp?code={code}
 * e.g. /rsvp/smith3456 → /rsvp?code=smith3456
 */
export default function RSVPCodeRedirectPage({ params }: { params: { code: string } }) {
  const code = params.code?.trim()
  if (!code) {
    redirect('/rsvp')
  }
  redirect(`/rsvp?code=${encodeURIComponent(code)}`)
}
