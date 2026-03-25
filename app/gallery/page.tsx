import { getGalleryPhotos } from '@/lib/photos'
import PhotoGrid from '@/components/PhotoGrid'
import Link from 'next/link'

export default function GalleryPage() {
  const photos = getGalleryPhotos()

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl mb-4 text-accent">
            Gallery
          </h1>
          <p className="text-lg text-accent/70 max-w-2xl mx-auto">
            Some of our favorite moments together.
          </p>
        </div>

        <PhotoGrid photos={photos} />

        <div className="text-center mt-12">
          <p className="text-accent/60 mb-2">Have photos to share?</p>
          <Link
            href="/photos"
            className="text-primary hover:underline font-semibold"
          >
            Upload to the Photo Wall &rarr;
          </Link>
        </div>
      </div>
    </main>
  )
}
