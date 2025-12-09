import weddingConfig from '@/config/wedding_config.json'
import Link from 'next/link'
import { getHeroPhotos } from '@/lib/photos'
import PhotoSlideshow from '@/components/PhotoSlideshow'
import { formatAmericanDate, format12HourTime } from '@/lib/dateUtils'

export default function Home() {
  const { couple, wedding, venue, branding, rsvp } = weddingConfig
  const heroPhotos = getHeroPhotos()

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-b from-primary/20 to-background">
        <div className="text-center px-4">
          <h1 className="font-heading text-6xl md:text-8xl mb-4 text-accent">
            {couple.displayNames}
          </h1>
          <p className="text-2xl md:text-3xl mb-8 text-accent/80">
            {formatAmericanDate(wedding.date)}
          </p>
          <p className="text-xl md:text-2xl mb-12 text-accent/70">
            {venue.name}
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/rsvp" 
              className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
            >
              RSVP
            </Link>
            <Link 
              href="/schedule" 
              className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition"
            >
              Schedule
            </Link>
          </div>
        </div>
      </section>

      {/* Photo Slideshow Section */}
      {heroPhotos.length > 0 && (
        <section className="py-16 px-4 bg-background">
          <div className="max-w-5xl mx-auto">
            <PhotoSlideshow photos={heroPhotos} autoPlay={true} intervalMs={4000} />
            <div className="text-center mt-8">
              <Link 
                href="/gallery" 
                className="text-primary hover:text-primary/80 font-semibold transition"
              >
                See more photos →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Quick Info Section */}
      <section className="py-20 px-4 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="font-heading text-2xl mb-2">When</h3>
            <p className="text-accent/70">{formatAmericanDate(wedding.date)}</p>
            <p className="text-accent/70">{format12HourTime('16:30')}</p>
          </div>
          <div>
            <h3 className="font-heading text-2xl mb-2">Where</h3>
            <p className="text-accent/70">{venue.city}, {venue.state}</p>
            <p className="text-accent/70">{venue.name}</p>
          </div>
          <div>
            <h3 className="font-heading text-2xl mb-2">RSVP By</h3>
            <p className="text-accent/70">{formatAmericanDate(rsvp.deadlineDate)}</p>
          </div>
        </div>
      </section>

      {/* Navigation Links */}
      <section className="py-12 bg-accent/5">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="flex flex-wrap justify-center gap-6">
            <Link href="/schedule" className="text-accent hover:text-primary transition">
              Schedule
            </Link>
            <Link href="/travel" className="text-accent hover:text-primary transition">
              Travel & Stay
            </Link>
            <Link href="/gallery" className="text-accent hover:text-primary transition">
              Gallery
            </Link>
            <Link href="/rsvp" className="text-accent hover:text-primary transition">
              RSVP
            </Link>
          </nav>
        </div>
      </section>
    </main>
  )
}

