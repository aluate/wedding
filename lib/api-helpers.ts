/**
 * Standardized API response helpers
 * Use these for consistent error handling across all API routes
 */

import { NextResponse } from 'next/server'

/**
 * Create success response
 */
export function successResponse(data: any, status: number = 200) {
  return NextResponse.json({
    status: 'success',
    data
  }, { status })
}

/**
 * Create error response
 */
export function errorResponse(
  message: string, 
  status: number = 500,
  code?: string
) {
  return NextResponse.json({
    status: 'error',
    error: message,
    ...(code && { code })
  }, { status })
}

/**
 * Not found response (404)
 */
export function notFoundResponse(resource: string = 'Resource') {
  return errorResponse(`${resource} not found`, 404, 'NOT_FOUND')
}

/**
 * Unauthorized response (401)
 */
export function unauthorizedResponse() {
  return errorResponse('Unauthorized', 401, 'UNAUTHORIZED')
}

/**
 * Forbidden response (403)
 */
export function forbiddenResponse() {
  return errorResponse('Forbidden', 403, 'FORBIDDEN')
}

/**
 * Validation error response (400)
 */
export function validationErrorResponse(message: string) {
  return errorResponse(message, 400, 'VALIDATION_ERROR')
}

/**
 * Server error response (500)
 */
export function serverErrorResponse(message: string = 'Internal server error') {
  return errorResponse(message, 500, 'SERVER_ERROR')
}

