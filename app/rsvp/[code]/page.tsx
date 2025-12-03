'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import weddingConfig from '@/config/wedding_config.json'
import Link from 'next/link'

export default function RSVPPage() {
  const params = useParams()
  const { rsvp } = weddingConfig
  const [submitted, setSubmitted] = useState(false)

  // In production, this would look up the household by code
  const householdCode = params.code as string

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production, this would submit to an API
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <main className="min-h-screen py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-heading text-5xl mb-4">Thank You!</h1>
          <p className="text-xl text-accent/70 mb-8">
            Your RSVP has been received. We can't wait to celebrate with you!
          </p>
          <Link href="/" className="text-primary hover:underline">
            Return to Home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-primary mb-6 inline-block hover:underline">
          ← Back to Home
        </Link>
        
        <h1 className="font-heading text-5xl mb-8">RSVP</h1>
        <p className="text-accent/70 mb-8">
          Please RSVP by {rsvp.deadlineDate}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Guest Fields */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="font-heading text-2xl mb-4">Guest Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-semibold">Will you be attending?</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input type="radio" name="attending" value="yes" className="mr-2" required />
                    Yes, I'll be there!
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="attending" value="no" className="mr-2" required />
                    Sorry, can't make it
                  </label>
                </div>
              </div>

              <div>
                <label className="block mb-2 font-semibold">Meal Choice</label>
                <select name="meal" className="w-full p-2 border rounded">
                  {rsvp.mealChoices.map((meal) => (
                    <option key={meal.id} value={meal.id}>
                      {meal.label}
                    </option>
                  ))}
                </select>
              </div>

              {rsvp.guestFields.dietaryOptions && (
                <div>
                  <label className="block mb-2 font-semibold">Dietary Restrictions</label>
                  <div className="space-y-2">
                    {rsvp.dietaryOptions.map((option) => (
                      <label key={option} className="flex items-center">
                        <input type="checkbox" name="dietary" value={option} className="mr-2" />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {rsvp.guestFields.songRequestEnabled && (
                <div>
                  <label className="block mb-2 font-semibold">Song Request (Optional)</label>
                  <input type="text" name="song" className="w-full p-2 border rounded" />
                </div>
              )}

              {rsvp.guestFields.notesFieldEnabled && (
                <div>
                  <label className="block mb-2 font-semibold">Notes (Optional)</label>
                  <textarea name="notes" rows={3} className="w-full p-2 border rounded" />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
          >
            Submit RSVP
          </button>
        </form>
      </div>
    </main>
  )
}

