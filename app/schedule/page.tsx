import weddingConfig from '@/config/wedding_config.json'
import Link from 'next/link'

export default function Schedule() {
  const { wedding } = weddingConfig

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-primary mb-6 inline-block hover:underline">
          ← Back to Home
        </Link>
        
        <h1 className="font-heading text-5xl mb-8">Schedule</h1>
        
        <div className="space-y-6">
          {wedding.events
            .filter(event => event.showOnPublicTimeline)
            .map((event) => (
              <div key={event.id} className="border-l-4 border-primary pl-6 py-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h2 className="font-heading text-2xl">{event.name}</h2>
                  <p className="text-accent/70">
                    {event.startTime} - {event.endTime}
                  </p>
                </div>
                <p className="text-accent/80">{event.description}</p>
              </div>
            ))}
        </div>
      </div>
    </main>
  )
}

