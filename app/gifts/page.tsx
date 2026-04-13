import weddingConfig from '@/config/wedding_config.json'
import Link from 'next/link'

const VENMO_PAY_URL =
  'https://venmo.com/?txn=pay&recipients=Brit-Karl&note=Wedding%20Gift'

export default function GiftsPage() {
  const { site } = weddingConfig

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-heading text-5xl mb-8">Gifts</h1>

        <div className="space-y-6 text-accent/80 leading-relaxed">
          <p>Your presence is the greatest gift, and we truly mean that.</p>
          <p>
            We&apos;re not creating a traditional registry. We&apos;re fortunate to already have what we need, so for
            those who have asked, we&apos;ve set up a simple way to contribute toward our honeymoon and a few projects
            around the house.
          </p>
          <p>We&apos;re grateful for anything, but most of all, we&apos;re just excited to celebrate with you.</p>
        </div>

        <div className="mt-10 flex flex-col items-start gap-4">
          <a
            href={VENMO_PAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-primary text-white font-semibold text-base hover:bg-primary/90 transition shadow-sm"
          >
            Honeymoon &amp; Home Fund
          </a>
          <p className="text-sm text-accent/60 max-w-md">
            If you prefer another method, feel free to reach out to us directly at{' '}
            <a href={`mailto:${site.supportEmail}`} className="text-primary hover:underline font-medium">
              {site.supportEmail}
            </a>
            .
          </p>
        </div>

        <p className="mt-12 text-sm text-accent/50">
          <Link href="/details" className="text-primary hover:underline">
            &larr; Back to weekend details
          </Link>
        </p>
      </div>
    </main>
  )
}
