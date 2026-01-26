/**
 * Date & Time Utilities
 */

/**
 * Get date N days from now
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Get date N days ago
 */
export function subtractDays(date: Date, days: number): Date {
  return addDays(date, -days);
}

/**
 * Check if date is in the past
 */
export function isPast(date: Date): boolean {
  return date.getTime() < Date.now();
}

/**
 * Check if date is in the future
 */
export function isFuture(date: Date): boolean {
  return date.getTime() > Date.now();
}

/**
 * Get days remaining until date
 */
export function daysUntil(date: Date): number {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get days since date
 */
export function daysSince(date: Date): number {
  return -daysUntil(date);
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format date with time for display
 */
export function formatDateTime(date: Date): string {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get relative time string (e.g., "3 days left", "2 hours ago")
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);

  if (diffMs > 0) {
    // Future
    if (diffDays > 0) return `${diffDays} day${diffDays === 1 ? '' : 's'} left`;
    if (diffHours > 0) return `${diffHours} hour${diffHours === 1 ? '' : 's'} left`;
    return `${diffMins} minute${diffMins === 1 ? '' : 's'} left`;
  } else {
    // Past
    const absDays = Math.abs(diffDays);
    const absHours = Math.abs(diffHours);
    const absMins = Math.abs(diffMins);
    if (absDays > 0) return `${absDays} day${absDays === 1 ? '' : 's'} ago`;
    if (absHours > 0) return `${absHours} hour${absHours === 1 ? '' : 's'} ago`;
    return `${absMins} minute${absMins === 1 ? '' : 's'} ago`;
  }
}
