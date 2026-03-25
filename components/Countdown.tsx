'use client'

import { useEffect, useState } from 'react'

const WEDDING_DATE = new Date('2026-06-20T16:30:00-07:00')

function calcDiff() {
  const now = new Date()
  const diff = WEDDING_DATE.getTime() - now.getTime()
  if (diff <= 0) return null
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return { days, hours, minutes }
}

export default function Countdown() {
  const [diff, setDiff] = useState(calcDiff)

  useEffect(() => {
    const id = setInterval(() => setDiff(calcDiff()), 60_000)
    return () => clearInterval(id)
  }, [])

  if (!diff) return null

  return (
    <div className="flex items-center justify-center gap-6 text-center">
      <div>
        <p className="text-4xl md:text-5xl font-heading">{diff.days}</p>
        <p className="text-xs text-accent/60 uppercase tracking-wide">days</p>
      </div>
      <div>
        <p className="text-4xl md:text-5xl font-heading">{diff.hours}</p>
        <p className="text-xs text-accent/60 uppercase tracking-wide">hours</p>
      </div>
      <div>
        <p className="text-4xl md:text-5xl font-heading">{diff.minutes}</p>
        <p className="text-xs text-accent/60 uppercase tracking-wide">min</p>
      </div>
    </div>
  )
}
