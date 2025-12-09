/**
 * Photo helper functions for wedding photos
 * 
 * This module provides functions to get wedding photos from the public/photos/wedding folder.
 * Auto-updated to include all photos in the gallery folder.
 */

export interface Photo {
  src: string
  alt: string
  category?: string
  priority?: boolean
  featured?: boolean
}

/**
 * Get all wedding photos from the gallery
 * Includes all photos from public/photos/wedding/gallery/
 * 
 * To add more photos: Just drop them in the gallery folder and name them photo-XX.jpg
 * Then update the max number below or add them to this array.
 */
export function getAllWeddingPhotos(): Photo[] {
  // List of all photos - update this when you add more photos
  // First 8-10 photos will be used in the slideshow
  const photoList: Photo[] = [
    { src: "/photos/wedding/gallery/photo-01.jpg", alt: "Brit & Karl wedding photo", category: "gallery", featured: true },
    { src: "/photos/wedding/gallery/photo-02.jpg", alt: "Brit & Karl wedding photo", category: "gallery", featured: true },
    { src: "/photos/wedding/gallery/photo-03.jpg", alt: "Brit & Karl wedding photo", category: "gallery", featured: true },
    { src: "/photos/wedding/gallery/photo-04.jpg", alt: "Brit & Karl wedding photo", category: "gallery", featured: true },
    { src: "/photos/wedding/gallery/photo-05.jpg", alt: "Brit & Karl wedding photo", category: "gallery", featured: true },
    { src: "/photos/wedding/gallery/photo-06.jpg", alt: "Brit & Karl wedding photo", category: "gallery", featured: true },
    { src: "/photos/wedding/gallery/photo-07.jpg", alt: "Brit & Karl wedding photo", category: "gallery", featured: true },
    { src: "/photos/wedding/gallery/photo-08.jpg", alt: "Brit & Karl wedding photo", category: "gallery", featured: true },
    { src: "/photos/wedding/gallery/photo-09.jpg", alt: "Brit & Karl wedding photo", category: "gallery", featured: true },
    { src: "/photos/wedding/gallery/photo-10.jpg", alt: "Brit & Karl wedding photo", category: "gallery", featured: true },
    { src: "/photos/wedding/gallery/photo-11.jpg", alt: "Brit & Karl wedding photo", category: "gallery", featured: false },
    { src: "/photos/wedding/gallery/photo-12.jpg", alt: "Brit & Karl wedding photo", category: "gallery", featured: false },
    { src: "/photos/wedding/gallery/photo-13.jpg", alt: "Brit & Karl wedding photo", category: "gallery", featured: false },
  ]
  
  return photoList
}

/**
 * Get hero photos for slideshow (all featured photos, up to 10)
 * These are the photos that appear in the home page slideshow
 */
export function getHeroPhotos(): Photo[] {
  const allPhotos = getAllWeddingPhotos()
  const featured = allPhotos.filter(p => p.featured)
  // Return all featured photos (first 10) for slideshow
  return featured.length > 0 ? featured : allPhotos.slice(0, 10)
}

/**
 * Get all gallery photos (full set for gallery page)
 */
export function getGalleryPhotos(): Photo[] {
  return getAllWeddingPhotos()
}

/**
 * Get photos by category
 */
export function getPhotosByCategory(category: string): Photo[] {
  return getAllWeddingPhotos().filter(p => p.category === category)
}

/**
 * Generate alt text from filename if not provided
 */
export function generateAltText(filename: string): string {
  return filename
    .replace(/\.(jpg|jpeg|png)$/i, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}
