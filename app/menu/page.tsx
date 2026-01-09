import Link from 'next/link'

export default function Menu() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-primary mb-6 inline-block hover:underline">
          ← Back to Home
        </Link>
        
        <h1 className="font-heading text-5xl mb-8">Menu</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-accent/70 text-lg mb-4">
            Dinner and drinks will be served.
          </p>
          <p className="text-accent/70">
            More details coming soon.
          </p>
        </div>
      </div>
    </main>
  )
}

