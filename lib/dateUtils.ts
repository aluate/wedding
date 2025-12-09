/**
 * Date formatting utilities
 * 
 * Default format for user-facing dates: American format (M.D.YYYY)
 * Internal/serial dates: ISO format (YYYY-MM-DD) for sorting and data storage
 */

/**
 * Format a date string (YYYY-MM-DD) to American format (M.D.YYYY)
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @returns Formatted date string (M.D.YYYY)
 */
export function formatAmericanDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00') // Add time to avoid timezone issues
  const month = date.getMonth() + 1 // getMonth() returns 0-11
  const day = date.getDate()
  const year = date.getFullYear()
  return `${month}.${day}.${year}`
}

/**
 * Format a date string (YYYY-MM-DD) to American format with month name (Month D, YYYY)
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @returns Formatted date string (e.g., "June 20, 2026")
 */
export function formatAmericanDateWithMonth(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00')
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const month = monthNames[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()
  return `${month} ${day}, ${year}`
}

/**
 * Format time from 24-hour format (HH:MM) to 12-hour format (H:MM AM/PM)
 * @param timeString - 24-hour time string (HH:MM)
 * @returns Formatted time string (H:MM AM/PM)
 */
export function format12HourTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const hours12 = hours % 12 || 12
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`
}
