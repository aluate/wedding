'use client'

import Image from 'next/image'
import { Photo } from '@/lib/photos'

interface PhotoStripProps {
  photos: Photo[]
}

export default function PhotoStrip({ photos }: PhotoStripProps) {
  if (!photos || photos.length === 0) {
    return null
  }

  // Limit to 5 photos for the strip
  const displayPhotos = photos.slice(0, 5)

  return (
    <div className="w-full overflow-x-auto py-4">
      <div className="flex gap-3 min-w-max">
        {displayPhotos.map((photo, index) => (
          <div
            key={index}
            className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-lg overflow-hidden border-2 border-accent/20 shadow-sm"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 128px, 160px"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
