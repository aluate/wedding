'use client'

import Image from 'next/image'
import { Photo } from '@/lib/photos'

interface PhotoGridProps {
  photos: Photo[]
  columns?: number
}

export default function PhotoGrid({ photos, columns = 3 }: PhotoGridProps) {
  if (!photos || photos.length === 0) {
    return (
      <div className="text-center py-12 text-accent/60">
        <p>Photos coming soon</p>
      </div>
    )
  }

  // Tailwind doesn't support dynamic class names, so we use conditional classes
  const gridClass = columns === 2 
    ? "grid-cols-1 md:grid-cols-2" 
    : columns === 4
    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

  return (
    <div className={`grid ${gridClass} gap-4`}>
      {photos.map((photo, index) => (
        <div
          key={index}
          className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 group"
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ))}
    </div>
  )
}
