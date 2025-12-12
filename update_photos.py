"""Update photos.ts with all photos in the gallery folder"""

import os
from pathlib import Path

gallery_path = Path(__file__).parent / "public" / "photos" / "wedding" / "gallery"

# Get all JPG files
jpg_files = sorted([f for f in os.listdir(gallery_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))])

print(f"Found {len(jpg_files)} photos:")
for f in jpg_files:
    print(f"  - {f}")

# Generate TypeScript code
photo_objects = []
for i, filename in enumerate(jpg_files, 1):
    # Clean filename for alt text
    alt_text = filename.replace('.jpg', '').replace('.jpeg', '').replace('.png', '')
    alt_text = alt_text.replace('-', ' ').replace('_', ' ')
    alt_text = ' '.join(word.capitalize() for word in alt_text.split())
    
    # Mark first 6-8 as featured for slideshow
    featured = i <= 8
    
    photo_obj = f"""    {{
      src: "/photos/wedding/gallery/{filename}",
      alt: "Brit & Karl wedding photo - {alt_text}",
      category: "gallery",
      featured: {str(featured).lower()}
    }}"""
    photo_objects.append(photo_obj)

# Generate the full function
ts_code = f"""/**
 * Photo helper functions for wedding photos
 * 
 * This module provides functions to get wedding photos from the public/photos/wedding folder.
 * Auto-generated from photos in gallery folder.
 */

export interface Photo {{
  src: string
  alt: string
  category?: string
  priority?: boolean
  featured?: boolean
}}

/**
 * Get all wedding photos from the gallery
 * Auto-generated from photos in public/photos/wedding/gallery/
 */
export function getAllWeddingPhotos(): Photo[] {{
  return [
{',\n'.join(photo_objects)}
  ]
}}

/**
 * Get hero photos for slideshow (featured photos, or first 8)
 */
export function getHeroPhotos(): Photo[] {{
  const allPhotos = getAllWeddingPhotos()
  const featured = allPhotos.filter(p => p.featured)
  // Return all featured photos (up to 8) for slideshow
  return featured.length > 0 ? featured : allPhotos.slice(0, 8)
}}

/**
 * Get all gallery photos (full set for gallery page)
 */
export function getGalleryPhotos(): Photo[] {{
  return getAllWeddingPhotos()
}}

/**
 * Get photos by category
 */
export function getPhotosByCategory(category: string): Photo[] {{
  return getAllWeddingPhotos().filter(p => p.category === category)
}}

/**
 * Generate alt text from filename if not provided
 */
export function generateAltText(filename: string): string {{
  return filename
    .replace(/\\.(jpg|jpeg|png)$/i, '')
    .replace(/[-_]/g, ' ')
    .replace(/\\b\\w/g, l => l.toUpperCase())
}}
"""

# Write to file
output_path = Path(__file__).parent / "lib" / "photos.ts"
output_path.write_text(ts_code, encoding='utf-8')

print(f"\n✅ Updated {output_path}")
print(f"   Total photos: {len(jpg_files)}")
print(f"   Featured photos (for slideshow): {sum(1 for i in range(len(jpg_files)) if i < 8)}")
