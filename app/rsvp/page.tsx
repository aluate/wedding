import Link from 'next/link'
import type { Metadata } from 'next'
import { RsvpForm } from './rsvp-form'

export const metadata: Metadata = {
  title: 'RSVP — Brit & Karl',
  description: 'Respond to our wedding invitation.',
}

export default function RSVPIndexPage({
  searchParams,
}: {
  searchParams: { invite?: string }
}) {
  const invite = searchParams.invite?.trim() || undefined

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-primary mb-6 inline-block hover:underline">
          ← Back to Home
        </Link>

        <h1 className="font-heading text-5xl mb-2">RSVP</h1>
        <p className="text-accent/70 mb-8">June 20, 2026 · Coeur d&apos;Alene Casino Resort Hotel</p>

        <RsvpForm defaultInviteCode={invite} />

        <div className="mt-10 pt-6 border-t border-accent/20">
          <p className="font-semibold mb-2 text-accent">Questions?</p>
          <p className="text-accent/70">
            Email{' '}
            <a
              href="mailto:karlvaage94@gmail.com"
              className="text-primary hover:underline font-semibold"
            >
              karlvaage94@gmail.com
            </a>{' '}
            or call/text{' '}
            <a href="tel:+12088270034" className="text-primary hover:underline font-semibold">
              (208) 827-0034
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  )
}
