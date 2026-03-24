import { NextResponse } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api-helpers'

/**
 * Health check endpoint
 * GET /api/health
 * Returns system status
 */
export async function GET() {
  try {
    return successResponse({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'wedding-site',
      version: '1.0.0',
    })
  } catch (error: any) {
    return errorResponse(
      error.message || 'Unknown error',
      503,
      'SERVICE_UNAVAILABLE'
    )
  }
}

