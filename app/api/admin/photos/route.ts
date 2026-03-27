import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { errorResponse, serverErrorResponse, successResponse, validationErrorResponse } from '@/lib/api-helpers'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const BUCKET = 'guest-photos'

function checkAdmin(request: Request): Response | null {
  const adminPassword = process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET
  if (!adminPassword) {
    return errorResponse('Admin is not configured', 501, 'NOT_CONFIGURED')
  }
  const auth = request.headers.get('authorization')
  const token = auth?.startsWith('Bearer ') ? auth.slice(7).trim() : ''
  if (token !== adminPassword) {
    return errorResponse('Unauthorized', 401, 'UNAUTHORIZED')
  }
  return null
}

/**
 * GET /api/admin/photos?event_key=all|wedding-2026
 * Authorization: Bearer <ADMIN_PASSWORD>
 */
export async function GET(request: Request) {
  const denied = checkAdmin(request)
  if (denied) return denied

  let supabase
  try {
    supabase = getSupabaseAdmin()
  } catch (e) {
    console.error('[admin/photos]', e)
    return serverErrorResponse('Supabase is not configured')
  }

  const url = new URL(request.url)
  const eventKey = url.searchParams.get('event_key')?.trim()

  const { data: keyRows, error: keyErr } = await supabase.from('guest_photos').select('event_key')
  if (keyErr) {
    console.error('[admin/photos] event keys', keyErr)
  }
  const event_keys = Array.from(
    new Set((keyRows ?? []).map((r) => r.event_key).filter((k): k is string => Boolean(k)))
  ).sort()

  let query = supabase.from('guest_photos').select('*').order('created_at', { ascending: false }).limit(500)

  if (eventKey && eventKey !== 'all') {
    query = query.eq('event_key', eventKey)
  }

  const { data: rows, error } = await query

  if (error) {
    console.error('[admin/photos] select', error)
    return serverErrorResponse('Could not load photos')
  }

  return NextResponse.json({
    photos: rows ?? [],
    event_keys,
    selected_event_key: eventKey === 'all' || !eventKey ? 'all' : eventKey,
  })
}

/**
 * DELETE /api/admin/photos?id=<uuid>
 * Removes DB row and file from storage.
 */
export async function DELETE(request: Request) {
  const denied = checkAdmin(request)
  if (denied) return denied

  const url = new URL(request.url)
  const id = url.searchParams.get('id')?.trim()
  if (!id) {
    return validationErrorResponse('Missing id')
  }

  let supabase
  try {
    supabase = getSupabaseAdmin()
  } catch (e) {
    console.error('[admin/photos]', e)
    return serverErrorResponse('Supabase is not configured')
  }

  const { data: row, error: fetchErr } = await supabase.from('guest_photos').select('id, filename').eq('id', id).maybeSingle()

  if (fetchErr) {
    console.error('[admin/photos] fetch row', fetchErr)
    return serverErrorResponse('Could not find photo')
  }

  if (!row) {
    return errorResponse('Photo not found', 404, 'NOT_FOUND')
  }

  const { error: rmErr } = await supabase.storage.from(BUCKET).remove([row.filename])
  if (rmErr) {
    console.error('[admin/photos] storage remove', rmErr)
    // continue — still try to delete row so DB stays consistent
  }

  const { error: delErr } = await supabase.from('guest_photos').delete().eq('id', id)
  if (delErr) {
    console.error('[admin/photos] delete row', delErr)
    return serverErrorResponse('Could not delete photo record')
  }

  return successResponse({ deleted: true, id })
}
