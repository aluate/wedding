import Link from 'next/link'

export default function RSVPIndexPage() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-primary mb-6 inline-block hover:underline">
          ← Back to Home
        </Link>
        
        <h1 className="font-heading text-5xl mb-8">RSVP</h1>

        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
          <p className="text-lg text-accent/80">
            RSVP details coming soon with formal invitations.
          </p>
          <div className="pt-4 border-t border-accent/20">
            <p className="font-semibold mb-2">Questions?</p>
            <p className="text-accent/70">
              Email{' '}
              <a 
                href="mailto:karlvaage94@gmail.com" 
                className="text-primary hover:underline font-semibold"
              >
                karlvaage94@gmail.com
              </a>
              {' '}or call/text{' '}
              <a 
                href="tel:+12088270034" 
                className="text-primary hover:underline font-semibold"
              >
                (208) 827-0034
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

