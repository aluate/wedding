'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function RSVPIndexPage() {
  const router = useRouter()
  const [code, setCode] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.trim()) {
      router.push(`/rsvp/${code}`)
    }
  }

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-primary mb-6 inline-block hover:underline">
          ← Back to Home
        </Link>
        
        <h1 className="font-heading text-5xl mb-8">RSVP</h1>
        <p className="text-accent/70 mb-8">
          Enter your household code to RSVP
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold">Household Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your code"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
          >
            Continue
          </button>
        </form>
      </div>
    </main>
  )
}

