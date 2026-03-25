import weddingConfig from '@/config/wedding_config.json'
import Link from 'next/link'

export default function Menu() {
  const { rsvp } = weddingConfig

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-heading text-5xl mb-8">Menu</h1>

        <section className="mb-10">
          <p className="text-lg text-accent/70 mb-6">
            Dinner will be a plated meal with your choice of entr&eacute;e.
            Please select your preference when you{' '}
            <Link href="/rsvp" className="text-primary hover:underline font-semibold">
              RSVP
            </Link>
            .
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            {rsvp.mealChoices.map((meal) => (
              <div
                key={meal.id}
                className="bg-white p-6 rounded-lg shadow-sm text-center"
              >
                <h3 className="font-heading text-xl mb-2">{meal.label}</h3>
                <p className="text-accent/70 text-sm">{meal.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="font-heading text-2xl mb-2">Dietary Needs</h2>
          <p className="text-accent/70 mb-3">
            We want to make sure everyone is comfortable. If you have allergies or dietary
            restrictions, please note them in the RSVP form and we will work with the venue
            to accommodate you.
          </p>
          <p className="text-accent/70 text-sm">
            Common accommodations we can support: vegetarian, vegan, gluten-free, dairy-free, and nut allergies.
          </p>
        </section>
      </div>
    </main>
  )
}
