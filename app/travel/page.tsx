import weddingConfig from '@/config/wedding_config.json'
import Link from 'next/link'

export default function Travel() {
  const { travel, lodging, venue } = weddingConfig

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-primary mb-6 inline-block hover:underline">
          ← Back to Home
        </Link>
        
        <h1 className="font-heading text-5xl mb-8">Travel & Stay</h1>
        
        {/* Venue Info */}
        <section className="mb-12">
          <h2 className="font-heading text-3xl mb-4">Venue</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="font-semibold text-lg mb-2">{venue.name}</p>
            <p className="text-accent/70 mb-2">
              {venue.addressLine1}<br />
              {venue.city}, {venue.state} {venue.postalCode}
            </p>
            <a 
              href={venue.googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              View on Google Maps
            </a>
          </div>
        </section>

        {/* Airports */}
        <section className="mb-12">
          <h2 className="font-heading text-3xl mb-4">Getting There</h2>
          <div className="space-y-4">
            {travel.airports.map((airport) => (
              <div key={airport.id} className="bg-white p-6 rounded-lg shadow-sm">
                <p className="font-semibold">{airport.name} ({airport.code})</p>
                <p className="text-accent/70">{airport.city}, {airport.state}</p>
                <p className="text-accent/70 text-sm mt-2">{airport.notes}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Driving Directions */}
        <section className="mb-12">
          <h2 className="font-heading text-3xl mb-4">Driving Directions</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <div>
              <p className="font-semibold mb-2">From Spokane:</p>
              <p className="text-accent/70">{travel.driving.fromSpokane}</p>
            </div>
            <div>
              <p className="font-semibold mb-2">From Coeur d'Alene:</p>
              <p className="text-accent/70">{travel.driving.fromCDA}</p>
            </div>
            <div>
              <p className="font-semibold mb-2">Parking:</p>
              <p className="text-accent/70">{travel.driving.parkingInfo}</p>
            </div>
          </div>
        </section>

        {/* Lodging */}
        <section>
          <h2 className="font-heading text-3xl mb-4">Where to Stay</h2>
          <div className="space-y-4">
            {lodging.hotels.map((hotel) => (
              <div key={hotel.id} className="bg-white p-6 rounded-lg shadow-sm">
                <p className="font-semibold text-lg mb-2">{hotel.name}</p>
                {hotel.isPrimaryBlock && (
                  <p className="text-primary font-semibold mb-2">Primary Hotel Block</p>
                )}
                {hotel.blockCode && (
                  <p className="text-accent/70 mb-2">
                    Block Code: <span className="font-mono">{hotel.blockCode}</span>
                  </p>
                )}
                <p className="text-accent/70 mb-4">{hotel.notes}</p>
                <a 
                  href={hotel.bookingUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-semibold"
                >
                  Book Now →
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

