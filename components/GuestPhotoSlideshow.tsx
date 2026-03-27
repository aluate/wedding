'use client'

import { useEffect, useRef, useState } from 'react'

export type GuestPhotoSlide = {
  filename: string
  url: string
  uploader_name: string | null
  caption: string | null
  created_at: string
}

type Props = {
  photos: GuestPhotoSlide[]
  intervalMs?: number
  autoPlay?: boolean
  /** When the newest slide changes (e.g. new upload), jump to slide 0 */
  jumpToNewestWhenFirstChanges?: boolean
}

export function GuestPhotoSlideshow({
  photos,
  intervalMs = 6000,
  autoPlay = true,
  jumpToNewestWhenFirstChanges = true,
}: Props) {
  const len = photos.length
  const [index, setIndex] = useState(0)
  const firstFilename = useRef<string | null>(null)

  useEffect(() => {
    const top = photos[0]?.filename ?? null
    if (!jumpToNewestWhenFirstChanges || !top) return
    if (firstFilename.current !== null && top !== firstFilename.current) {
      setIndex(0)
    }
    firstFilename.current = top
  }, [photos, jumpToNewestWhenFirstChanges])

  useEffect(() => {
    if (len <= 1 || !autoPlay) return
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % len)
    }, intervalMs)
    return () => clearInterval(t)
  }, [len, intervalMs, autoPlay])

  if (len === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-white/60 text-xl">
        Waiting for photos…
      </div>
    )
  }

  const p = photos[index]

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={p.url}
        alt={p.caption || 'Guest photo'}
        className="max-h-[min(78vh,100%)] max-w-full object-contain rounded-lg shadow-2xl"
      />
      {(p.caption || p.uploader_name) && (
        <div className="mt-4 text-center max-w-3xl px-4">
          {p.caption && <p className="text-white text-lg md:text-xl">{p.caption}</p>}
          {p.uploader_name && <p className="text-white/60 text-sm mt-1">— {p.uploader_name}</p>}
        </div>
      )}
      {len > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {photos.map((_, i) => (
            <button
              key={`${photos[i].filename}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
