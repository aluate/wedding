'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import weddingConfig from '@/config/wedding_config.json'
import { GuestPhotoSlideshow } from '@/components/GuestPhotoSlideshow'

const PHOTO_EVENT_KEY = weddingConfig.site.currentEventKey || 'wedding-2026'

type GuestPhoto = {
  id?: string
  filename: string
  url: string
  uploader_name: string | null
  caption: string | null
  event_key?: string | null
  created_at: string
}

export default function PhotosPage() {
  const [photos, setPhotos] = useState<GuestPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadName, setUploadName] = useState('')
  const [uploadCaption, setUploadCaption] = useState('')
  const [message, setMessage] = useState('')
  const [selectedPhoto, setSelectedPhoto] = useState<GuestPhoto | null>(null)

  const loadPhotos = useCallback(async () => {
    try {
      const res = await fetch(`/api/photos?event_key=${encodeURIComponent(PHOTO_EVENT_KEY)}`)
      if (res.ok) {
        const data = await res.json()
        setPhotos(data.photos || [])
      }
    } catch {}
    setLoading(false)
  }, [])

  useEffect(() => {
    loadPhotos()
  }, [loadPhotos])

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement
    const files = fileInput?.files ? Array.from(fileInput.files) : []
    if (files.length === 0) return

    setUploading(true)
    setMessage('')

    const fd = new FormData()
    for (const f of files) {
      fd.append('files', f)
    }
    fd.append('name', uploadName.trim() || 'Anonymous')
    if (uploadCaption.trim()) fd.append('caption', uploadCaption.trim())

    try {
      const res = await fetch('/api/photos', { method: 'POST', body: fd })
      const json = await res.json().catch(() => ({}))
      const data = json?.data ?? json
      if (res.ok) {
        const up = typeof data?.uploaded === 'number' ? data.uploaded : 1
        const fail = typeof data?.failed === 'number' ? data.failed : 0
        setMessage(
          fail > 0
            ? `Uploaded ${up} photo(s). ${fail} failed — check file size/type.`
            : `Uploaded ${up} photo${up === 1 ? '' : 's'}!`
        )
        setUploadName('')
        setUploadCaption('')
        fileInput.value = ''
        loadPhotos()
      } else {
        setMessage(json?.error || 'Upload failed. Please try again.')
      }
    } catch {
      setMessage('Network error. Please try again.')
    }
    setUploading(false)
  }

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-heading text-4xl md:text-5xl mb-3 text-accent">
            Photo Wall
          </h1>
          <p className="text-lg text-accent/70 max-w-2xl mx-auto">
            Share your favorite moments! Upload photos here and they&apos;ll show up for
            everyone to enjoy.
          </p>
          <p className="text-sm text-accent/50 mt-1">#SolsticeOf26</p>
          <p className="mt-4">
            <Link
              href="/photos/live"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white font-semibold hover:bg-accent/90 transition text-sm"
            >
              Open live slideshow (reception screen)
            </Link>
          </p>
          <p className="text-xs text-accent/50 mt-2 max-w-md mx-auto">
            Auto-rotating slides + checks for new uploads every few seconds — works great on a projector.
          </p>
        </div>

        {/* Upload form */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-10 max-w-lg mx-auto">
          <h2 className="font-heading text-xl mb-4">Add a Photo</h2>
          <form onSubmit={handleUpload} className="space-y-3">
            <div>
              <label htmlFor="photo_file" className="block text-sm font-semibold mb-1">
                Photos <span className="text-red-600">*</span>
              </label>
              <input
                id="photo_file"
                type="file"
                accept="image/*"
                multiple
                required
                className="w-full text-sm text-accent/70 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:font-semibold file:cursor-pointer hover:file:bg-primary/90"
              />
              <p className="text-xs text-accent/50 mt-1">
                Select multiple at once (up to 30 per batch). Max 10MB each. JPG, PNG, HEIC.
              </p>
            </div>
            <div>
              <label htmlFor="upload_name" className="block text-sm font-semibold mb-1">
                Your name <span className="font-normal text-accent/60">(optional)</span>
              </label>
              <input
                id="upload_name"
                type="text"
                value={uploadName}
                onChange={(e) => setUploadName(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-accent/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/80"
                placeholder="So we know who to thank!"
              />
            </div>
            <div>
              <label htmlFor="upload_caption" className="block text-sm font-semibold mb-1">
                Caption <span className="font-normal text-accent/60">(optional)</span>
              </label>
              <input
                id="upload_caption"
                type="text"
                value={uploadCaption}
                onChange={(e) => setUploadCaption(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-accent/20 bg-background focus:outline-none focus:ring-2 focus:ring-primary/80"
                placeholder="What's the story?"
              />
            </div>
            {message && (
              <p className={`text-sm ${message.includes('failed') || message.includes('error') ? 'text-red-600' : 'text-green-600'}`}>
                {message}
              </p>
            )}
            <button
              type="submit"
              disabled={uploading}
              className="w-full px-6 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-60"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </form>
        </div>

        {/* Photo grid */}
        {loading ? (
          <p className="text-center text-accent/50">Loading photos...</p>
        ) : photos.length === 0 ? (
          <div className="text-center py-12 text-accent/50">
            <p className="text-lg mb-1">No photos yet — be the first!</p>
            <p className="text-sm">Upload a photo above to get the wall started.</p>
          </div>
        ) : (
          <>
            <div className="mb-10 max-w-4xl mx-auto">
              <h2 className="font-heading text-xl mb-3 text-center">Slideshow preview</h2>
              <div className="rounded-xl overflow-hidden bg-black/90 p-4 md:p-6">
                <GuestPhotoSlideshow photos={photos} intervalMs={5000} jumpToNewestWhenFirstChanges />
              </div>
            </div>
            <div className="columns-2 md:columns-3 gap-3 space-y-3">
            {photos.map((photo) => (
              <div
                key={photo.id || photo.filename}
                className="break-inside-avoid rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer bg-white"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img
                  src={photo.url}
                  alt={photo.caption || 'Guest photo'}
                  className="w-full"
                  loading="lazy"
                />
                {(photo.uploader_name || photo.caption) && (
                  <div className="px-3 py-2">
                    {photo.caption && <p className="text-sm text-accent/80">{photo.caption}</p>}
                    {photo.uploader_name && (
                      <p className="text-xs text-accent/50">by {photo.uploader_name}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          </>
        )}

        {/* Lightbox */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption || 'Guest photo'}
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
              {(selectedPhoto.caption || selectedPhoto.uploader_name) && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-3 rounded-b-lg">
                  {selectedPhoto.caption && <p>{selectedPhoto.caption}</p>}
                  {selectedPhoto.uploader_name && (
                    <p className="text-sm text-white/70">by {selectedPhoto.uploader_name}</p>
                  )}
                </div>
              )}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-2 right-2 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/70"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
