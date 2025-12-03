import weddingConfig from '@/config/wedding_config.json'
import Link from 'next/link'

export default function Home() {
  const { couple, wedding, venue, branding } = weddingConfig

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-b from-primary/20 to-background">
        <div className="text-center px-4">
          <h1 className="font-heading text-6xl md:text-8xl mb-4 text-accent">
            {couple.displayNames}
          </h1>
          <p className="text-2xl md:text-3xl mb-8 text-accent/80">
            {wedding.date}
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

      {/* Quick Info Section */}
      <section className="py-20 px-4 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="font-heading text-2xl mb-2">When</h3>
            <p className="text-accent/70">June 20, 2026</p>
            <p className="text-accent/70">4:30 PM</p>
          </div>
          <div>
            <h3 className="font-heading text-2xl mb-2">Where</h3>
            <p className="text-accent/70">{venue.city}, {venue.state}</p>
            <p className="text-accent/70">{venue.name}</p>
          </div>
          <div>
            <h3 className="font-heading text-2xl mb-2">RSVP By</h3>
            <p className="text-accent/70">May 20, 2026</p>
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
            <Link href="/rsvp" className="text-accent hover:text-primary transition">
              RSVP
            </Link>
            {weddingConfig.fun.game.enabled && (
              <Link href="/game" className="text-accent hover:text-primary transition">
                {weddingConfig.fun.game.name}
              </Link>
            )}
          </nav>
        </div>
      </section>
    </main>
  )
}

