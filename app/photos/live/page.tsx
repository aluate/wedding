'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import weddingConfig from '@/config/wedding_config.json'
import { GuestPhotoSlideshow, type GuestPhotoSlide } from '@/components/GuestPhotoSlideshow'

const PHOTO_EVENT_KEY = weddingConfig.site.currentEventKey || 'wedding-2026'

const POLL_MS = 4000
const SLIDE_MS = 7000

export default function PhotosLivePage() {
  const [photos, setPhotos] = useState<GuestPhotoSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [lastPoll, setLastPoll] = useState<Date | null>(null)
  const [newSinceOpen, setNewSinceOpen] = useState(0)

  const loadPhotos = useCallback(async () => {
    try {
      const res = await fetch(`/api/photos?event_key=${encodeURIComponent(PHOTO_EVENT_KEY)}`, { cache: 'no-store' })
      if (!res.ok) return
      const data = await res.json()
      const next: GuestPhotoSlide[] = data.photos || []
      setPhotos((prev) => {
        const prevSig = prev.map((p) => p.filename).join('\0')
        const nextSig = next.map((p) => p.filename).join('\0')
        if (prevSig === nextSig) return prev
        if (prev.length > 0 && next.length > prev.length) {
          setNewSinceOpen((n) => n + (next.length - prev.length))
        }
        return next
      })
      setLastPoll(new Date())
    } catch {
      /* ignore */
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadPhotos()
  }, [loadPhotos])

  useEffect(() => {
    const id = setInterval(loadPhotos, POLL_MS)
    return () => clearInterval(id)
  }, [loadPhotos])

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <header className="shrink-0 flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-white/10 bg-black/80 z-10">
        <div>
          <h1 className="font-heading text-xl md:text-2xl tracking-tight">Live photo wall</h1>
          <p className="text-xs text-white/50">
            New uploads appear automatically · {photos.length} photo{photos.length === 1 ? '' : 's'}
            {lastPoll && (
              <span className="ml-2">
                · last sync {lastPoll.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {newSinceOpen > 0 && (
            <span className="text-xs bg-primary/90 text-white px-2 py-1 rounded-full">+{newSinceOpen} new</span>
          )}
          <Link
            href="/photos"
            className="text-sm px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition"
          >
            Upload photos
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4 md:p-8 min-h-0">
        {loading && photos.length === 0 ? (
          <p className="text-white/50 text-lg">Loading…</p>
        ) : (
          <GuestPhotoSlideshow photos={photos} intervalMs={SLIDE_MS} autoPlay={photos.length > 1} />
        )}
      </div>

      <footer className="shrink-0 text-center text-white/40 text-xs py-2 border-t border-white/10">
        Tip: open this page full screen on a projector (F11). Polls every {POLL_MS / 1000}s for new photos.
      </footer>
    </main>
  )
}
