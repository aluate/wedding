import type { Metadata } from 'next'
import { RsvpForm } from './rsvp-form'

export const metadata: Metadata = {
  title: 'RSVP — Brit & Karl',
  description: 'Respond to our wedding invitation.',
}

export default function RSVPIndexPage({
  searchParams,
}: {
  searchParams: { code?: string }
}) {
  const code = searchParams.code?.trim() || undefined

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-heading text-5xl mb-2">RSVP</h1>
        <p className="text-accent/70 mb-8">June 20, 2026 &middot; Coeur d&apos;Alene Casino Resort Hotel</p>

        <RsvpForm defaultHouseholdCode={code} />

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
