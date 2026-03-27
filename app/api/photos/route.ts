import type { SupabaseClient } from '@supabase/supabase-js'
import weddingConfig from '@/config/wedding_config.json'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { serverErrorResponse, successResponse, validationErrorResponse } from '@/lib/api-helpers'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const BUCKET = 'guest-photos'
const CURRENT_EVENT_KEY = weddingConfig.site.currentEventKey || 'wedding-2026'
const MAX_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_FILES = 30

async function uploadOneImage(
  supabase: SupabaseClient,
  file: File,
  name: string,
  caption: string | null,
  eventKey: string
): Promise<{ ok: true; filename: string; url: string } | { ok: false; error: string }> {
  if (file.size > MAX_SIZE) {
    return { ok: false, error: `${file.name || 'file'}: exceeds 10MB limit` }
  }
  const type = file.type
  if (!type.startsWith('image/')) {
    return { ok: false, error: `${file.name || 'file'}: not an image` }
  }

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
    return { ok: false, error: `${file.name || filename}: upload failed` }
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filename)

  try {
    await supabase.from('guest_photos').insert({
      filename,
      url: urlData.publicUrl,
      uploader_name: name,
      caption,
      event_key: eventKey,
    })
  } catch {
    // Table might not exist yet — photo is still in storage
  }

  return { ok: true, filename, url: urlData.publicUrl }
}

/**
 * POST /api/photos — upload one or many guest photos
 * Expects multipart/form-data with:
 *   - file: single image (legacy)
 *   - files: multiple images (repeat field or getAll)
 *   - name: uploader name (optional, applies to all)
 *   - caption: short caption (optional, applies to all)
 */
export async function POST(request: Request) {
  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return validationErrorResponse('Invalid form data')
  }

  const fromFiles = formData.getAll('files').filter((x): x is File => x instanceof File)
  const single = formData.get('file')
  const fileList: File[] =
    fromFiles.length > 0 ? fromFiles : single instanceof File ? [single] : []

  if (fileList.length === 0) {
    return validationErrorResponse('No file provided')
  }

  if (fileList.length > MAX_FILES) {
    return validationErrorResponse(`Maximum ${MAX_FILES} files per upload.`)
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

  const results: Array<{ ok: true; filename: string; url: string } | { ok: false; error: string }> = []

  for (const file of fileList) {
    results.push(await uploadOneImage(supabase, file, name, caption, CURRENT_EVENT_KEY))
  }

  const uploaded = results.filter((r) => r.ok).length
  const failed = results.filter((r) => !r.ok).length

  if (uploaded === 0 && failed > 0) {
    return validationErrorResponse(results.map((r) => (!r.ok ? r.error : '')).filter(Boolean).join('; '))
  }

  const firstOk = results.find((r) => r.ok)
  return successResponse({
    uploaded,
    failed,
    results,
    url: firstOk && firstOk.ok ? firstOk.url : undefined,
    filename: firstOk && firstOk.ok ? firstOk.filename : undefined,
  })
}

/**
 * GET /api/photos — list guest photos for the public wall
 * Query: event_key — omit to use site default; use `all` to list every event (rare).
 */
export async function GET(request: Request) {
  let supabase
  try {
    supabase = getSupabaseAdmin()
  } catch {
    return NextResponse.json({ photos: [] })
  }

  const url = new URL(request.url)
  const raw = url.searchParams.get('event_key')?.trim()
  const defaultEk = weddingConfig.site.currentEventKey || 'wedding-2026'

  let query = supabase.from('guest_photos').select('*').order('created_at', { ascending: false }).limit(200)

  if (raw !== 'all' && raw !== '*') {
    const ek = raw || defaultEk
    query = query.eq('event_key', ek)
  }

  const { data: rows, error } = await query

  if (!error && rows && rows.length > 0) {
    return NextResponse.json({ photos: rows })
  }

  // Fallback: list files from storage (legacy uploads with no DB row)
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
        id: f.name,
        filename: f.name,
        url: data.publicUrl,
        uploader_name: null,
        caption: null,
        event_key: defaultEk,
        created_at: f.created_at,
      }
    })

  return NextResponse.json({ photos })
}
