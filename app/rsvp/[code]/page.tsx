import { redirect } from 'next/navigation'

/**
 * QR / per-invite links: /rsvp/{code} → /rsvp?invite={code}
 */
export default function RSVPInviteRedirectPage({ params }: { params: { code: string } }) {
  const code = params.code?.trim()
  if (!code) {
    redirect('/rsvp')
  }
  redirect(`/rsvp?invite=${encodeURIComponent(code)}`)
}
