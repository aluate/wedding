import { getGalleryPhotos } from '@/lib/photos'
import PhotoGrid from '@/components/PhotoGrid'
import weddingConfig from '@/config/wedding_config.json'

export default function GalleryPage() {
  // Check if photos are configured in config, otherwise use helper
  const configPhotos = (weddingConfig as any).photos?.gallery
  const photos = configPhotos || getGalleryPhotos()

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl mb-4 text-accent">
            Gallery
          </h1>
          <p className="text-lg text-accent/70 max-w-2xl mx-auto">
            A collection of moments from our celebration. More photos will be added as we get closer to the big day!
          </p>
        </div>

        <PhotoGrid photos={photos} columns={3} />
      </div>
    </main>
  )
}
