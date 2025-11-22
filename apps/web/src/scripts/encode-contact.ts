#!/usr/bin/env node
/**
 * Contact Information Encoder
 * 
 * Use this script to encode your contact information
 * 
 * Usage:
 *   ts-node src/scripts/encode-contact.ts
 *   or
 *   npm run encode-contact
 */

import { encodeEmail, encodePhone } from '@portfolio/utils/contact/obfuscation'

// Your contact information
const CONTACT = {
  email: 'suryadizhang.swe@gmail.com',
  phone: '2103884155', // Just digits, no formatting
}

console.log('🔐 Contact Information Encoder')
console.log('━'.repeat(50))
console.log('')

console.log('📧 Email Encoding:')
console.log(`Original: ${CONTACT.email}`)
console.log(`Encoded:  ${encodeEmail(CONTACT.email)}`)
console.log('')

console.log('📱 Phone Encoding:')
console.log(`Original: ${CONTACT.phone}`)
console.log(`Encoded:  ${encodePhone(CONTACT.phone)}`)
console.log('')

console.log('━'.repeat(50))
console.log('✅ Copy these encoded values to your contact.config.ts')
console.log('')
console.log('Example usage:')
console.log(`
export const CONTACT_CONFIG = {
  encodedEmail: '${encodeEmail(CONTACT.email)}',
  encodedPhone: '${encodePhone(CONTACT.phone)}',
}
`)
