import Link from 'next/link'

export default function Details() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-primary mb-6 inline-block hover:underline">
          ← Back to Home
        </Link>
        
        <h1 className="font-heading text-5xl mb-4">Weekend Details</h1>
        <p className="text-xl text-accent/70 mb-12">
          More information coming soon — for now, check out our travel and lodging information below.
        </p>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="font-heading text-2xl mb-4">Travel & Lodging</h2>
            <p className="text-accent/70 mb-4">
              We&apos;ve set up a room block at the Coeur d&apos;Alene Casino Resort Hotel. Booking information and travel details are available now.
            </p>
            <Link 
              href="/travel" 
              className="text-primary hover:underline font-semibold inline-block"
            >
              View Travel & Lodging Information →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="font-heading text-2xl mb-4">Schedule</h2>
            <p className="text-accent/70 mb-4">
              A detailed schedule of events will be shared closer to the wedding date.
            </p>
            <Link 
              href="/schedule" 
              className="text-primary hover:underline font-semibold inline-block"
            >
              View Current Schedule →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="font-heading text-2xl mb-4">Questions?</h2>
            <p className="text-accent/70 mb-2">
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

