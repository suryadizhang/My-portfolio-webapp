/**
 * Contact Information Obfuscation Utilities
 * 
 * Protects email addresses and phone numbers from scrapers while:
 * - Remaining human-readable
 * - Being SEO-friendly with schema.org markup
 * - Supporting accessibility
 */

/**
 * Encode email using Base64 (simple but effective)
 */
export function encodeEmail(email: string): string {
  if (typeof window === 'undefined') {
    // Server-side: use Buffer
    return Buffer.from(email).toString('base64')
  }
  // Client-side: use btoa
  return btoa(email)
}

/**
 * Decode email from Base64
 */
export function decodeEmail(encoded: string): string {
  if (typeof window === 'undefined') {
    // Server-side: use Buffer
    return Buffer.from(encoded, 'base64').toString('utf-8')
  }
  // Client-side: use atob
  return atob(encoded)
}

/**
 * ROT13 encoding (simple Caesar cipher)
 * Good for light obfuscation without requiring Base64
 */
export function rot13(str: string): string {
  return str.replace(/[a-zA-Z]/g, (char) => {
    const start = char <= 'Z' ? 65 : 97
    return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start)
  })
}

/**
 * Encode phone number by reversing and encoding
 */
export function encodePhone(phone: string): string {
  // Remove all non-digits, reverse, then encode
  const digitsOnly = phone.replace(/\D/g, '')
  const reversed = digitsOnly.split('').reverse().join('')
  return encodeEmail(reversed)
}

/**
 * Decode phone number
 */
export function decodePhone(encoded: string): string {
  const reversed = decodeEmail(encoded)
  return reversed.split('').reverse().join('')
}

/**
 * Format phone number for display
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
  }
  
  return phone // Return as-is if format unknown
}

/**
 * Create HTML entity-encoded email (anti-scraper technique)
 */
export function entityEncodeEmail(email: string): string {
  return email
    .split('')
    .map((char) => `&#${char.charCodeAt(0)};`)
    .join('')
}

/**
 * Create a clickable mailto link that's obfuscated
 */
export function createMailtoLink(email: string): string {
  const encoded = encodeEmail(email)
  return `data:text/html,<script>location.href='mailto:'+atob('${encoded}')</script>`
}

/**
 * Split email into parts for CSS-based obfuscation
 */
export function splitEmailForCSS(email: string): {
  user: string
  at: string
  domain: string
} {
  const [user, domain] = email.split('@')
  return { user, at: '@', domain }
}

/**
 * Generate time-based token for contact info (expires after 5 minutes)
 */
export function generateContactToken(contact: string): string {
  const timestamp = Math.floor(Date.now() / (5 * 60 * 1000)) // 5-minute windows
  const data = `${contact}:${timestamp}`
  return encodeEmail(data)
}

/**
 * Validate and decode contact token
 */
export function validateContactToken(token: string): string | null {
  try {
    const decoded = decodeEmail(token)
    const [contact, timestamp] = decoded.split(':')
    const currentWindow = Math.floor(Date.now() / (5 * 60 * 1000))
    const tokenWindow = parseInt(timestamp, 10)
    
    // Allow tokens from current and previous window (10 minutes total)
    if (currentWindow - tokenWindow <= 1) {
      return contact
    }
    
    return null
  } catch {
    return null
  }
}
