// Re-export the utility function from shared package
export { cn } from '@portfolio/ui'

/**
 * Generate a unique ID string
 * Fallback for crypto.randomUUID() in environments where it's not available
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  
  // Fallback implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * Check if we're running in the browser
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

/**
 * Safe localStorage access
 */
export function getLocalStorage(key: string, defaultValue: any = null) {
  if (!isBrowser()) return defaultValue
  
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.warn(`Failed to read localStorage key "${key}":`, error)
    return defaultValue
  }
}

/**
 * Safe localStorage write
 */
export function setLocalStorage(key: string, value: any): void {
  if (!isBrowser()) return
  
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn(`Failed to write localStorage key "${key}":`, error)
  }
}