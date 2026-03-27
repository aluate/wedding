import { redirect } from 'next/navigation'

/** Legacy per-link URLs (/rsvp/anything) redirect to the main RSVP page. */
export default function RSVPCodeRedirectPage({ params }: { params: { code: string } }) {
  void params
  redirect('/rsvp')
}
