'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Photo } from '@/lib/photos'

interface PhotoGridProps {
  photos: Photo[]
}

export default function PhotoGrid({ photos }: PhotoGridProps) {
  const [selected, setSelected] = useState<Photo | null>(null)

  if (!photos || photos.length === 0) {
    return (
      <div className="text-center py-12 text-accent/60">
        <p>Photos coming soon</p>
      </div>
    )
  }

  return (
    <>
      <div className="columns-2 md:columns-3 gap-3 space-y-3">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="break-inside-avoid rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
            onClick={() => setSelected(photo)}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={600}
              height={800}
              className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={selected.src}
              alt={selected.alt}
              width={1200}
              height={900}
              className="max-w-full max-h-[85vh] object-contain rounded-lg w-auto h-auto"
            />
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-2 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/70 transition"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  )
}
