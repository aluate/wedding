import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { serverErrorResponse, successResponse, validationErrorResponse } from '@/lib/api-helpers'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const BUCKET = 'guest-photos'
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

/**
 * POST /api/photos — upload a guest photo
 * Expects multipart/form-data with:
 *   - file: the image
 *   - name: uploader name (optional)
 *   - caption: short caption (optional)
 */
export async function POST(request: Request) {
  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return validationErrorResponse('Invalid form data')
  }

  const file = formData.get('file')
  if (!file || !(file instanceof Blob)) {
    return validationErrorResponse('No file provided')
  }

  if (file.size > MAX_SIZE) {
    return validationErrorResponse('File is too large. Maximum size is 10MB.')
  }

  const type = file.type
  if (!type.startsWith('image/')) {
    return validationErrorResponse('Only image files are allowed.')
  }

  const name = (formData.get('name') as string)?.trim() || 'Anonymous'
  const caption = (formData.get('caption') as string)?.trim() || null

  let supabase
  try {
    supabase = getSupabaseAdmin()
  } catch (e) {
    console.error('[photos] config', e)
    return serverErrorResponse('Photo upload is not configured yet.')
  }

  // Generate unique filename
  const ext = type.split('/')[1] || 'jpg'
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const buf = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filename, buf, {
      contentType: type,
      cacheControl: '3600',
    })

  if (uploadError) {
    console.error('[photos] upload', uploadError)
    return serverErrorResponse('Could not upload photo. Please try again.')
  }

  // Get public URL
  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filename)

  // Store metadata in a table (optional — if table doesn't exist, just skip)
  try {
    await supabase.from('guest_photos').insert({
      filename,
      url: urlData.publicUrl,
      uploader_name: name,
      caption,
    })
  } catch {
    // Table might not exist yet — photo is still in storage
  }

  return successResponse({ url: urlData.publicUrl, filename })
}

/**
 * GET /api/photos — list all guest photos
 */
export async function GET() {
  let supabase
  try {
    supabase = getSupabaseAdmin()
  } catch {
    return NextResponse.json({ photos: [] })
  }

  // Try to get from guest_photos table first
  const { data: rows } = await supabase
    .from('guest_photos')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)

  if (rows && rows.length > 0) {
    return NextResponse.json({ photos: rows })
  }

  // Fallback: list files from storage bucket directly
  const { data: files } = await supabase.storage.from(BUCKET).list('', {
    limit: 200,
    sortBy: { column: 'created_at', order: 'desc' },
  })

  if (!files || files.length === 0) {
    return NextResponse.json({ photos: [] })
  }

  const photos = files
    .filter((f) => f.name && !f.name.startsWith('.'))
    .map((f) => {
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(f.name)
      return {
        filename: f.name,
        url: data.publicUrl,
        uploader_name: null,
        caption: null,
        created_at: f.created_at,
      }
    })

  return NextResponse.json({ photos })
}
