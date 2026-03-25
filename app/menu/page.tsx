import Link from 'next/link'

export default function Menu() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-heading text-5xl mb-8">Menu</h1>

        <section className="mb-10">
          <p className="text-lg text-accent/70 mb-6">
            Dinner will be a buffet with a variety of options for everyone to enjoy.
            Full menu details will be shared closer to the wedding date.
          </p>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="font-heading text-2xl mb-2">Dietary Needs</h2>
            <p className="text-accent/70 mb-3">
              We want to make sure everyone is comfortable. If you have allergies or dietary
              restrictions, please note them in the{' '}
              <Link href="/rsvp" className="text-primary hover:underline font-semibold">
                RSVP form
              </Link>{' '}
              and we will work with the venue to accommodate you.
            </p>
            <p className="text-accent/70 text-sm">
              Common accommodations: vegetarian, vegan, gluten-free, dairy-free, and nut allergies.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
