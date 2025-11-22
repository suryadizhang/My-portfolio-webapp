/**
 * Centralized Contact Configuration
 * 
 * Store all contact information here in encoded format.
 * This makes it easy to update and manage contact info across the entire app.
 */

import { encodeEmail, encodePhone } from '@portfolio/utils/contact/obfuscation'

// Raw contact info (use these for encoding, then remove from codebase)
const RAW_CONFIG = {
  email: 'suryadizhang.swe@gmail.com',
  phone: '2103884155', // Just digits
  name: 'Suryadi Zhang',
  jobTitle: 'Full-Stack Software Engineer',
}

/**
 * Encoded contact information
 * These are safe to commit to version control
 */
export const CONTACT_CONFIG = {
  // Pre-encoded values (generated from RAW_CONFIG above)
  // To regenerate: Run `npm run encode-contact` or use the utility directly
  encodedEmail: 'c3VyeWFkaXpoYW5nLnN3ZUBnbWFpbC5jb20=', // suryadizhang.swe@gmail.com
  encodedPhone: 'NTU0ODgzMDEy', // 2103884155 (reversed and encoded)
  
  // Public info (safe to display)
  name: RAW_CONFIG.name,
  jobTitle: RAW_CONFIG.jobTitle,
  
  // Social links (these are public anyway)
  social: {
    github: 'https://github.com/suryadizhang',
    linkedin: 'https://www.linkedin.com/in/suryadi-zhang/',
    website: 'https://myportfolio.mysticdatanode.net',
  },
  
  // Location (public info)
  location: 'Fremont, California, United States',
  
  // Contact preferences
  preferences: {
    preferredContact: 'form', // 'form' | 'email' | 'phone'
    responseTime: '24-48 hours',
    availability: 'Open to professional conversations and collaboration',
  },
} as const

/**
 * Helper function to generate encoded values
 * Run this when you need to update contact info
 */
export function generateEncodedContact() {
  return {
    encodedEmail: encodeEmail(RAW_CONFIG.email),
    encodedPhone: encodePhone(RAW_CONFIG.phone),
  }
}

// Uncomment to log encoded values for copying to config
// if (process.env.NODE_ENV === 'development') {
//   console.log('Encoded Contact Info:', generateEncodedContact())
// }
