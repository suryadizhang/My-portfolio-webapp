'use client'

import React, { useState, useEffect } from 'react'
import { decodeEmail, decodePhone, formatPhone } from '@portfolio/utils/contact/obfuscation'

interface ObfuscatedEmailProps {
  encoded: string
  className?: string
  subject?: string
  showIcon?: boolean
}

/**
 * Obfuscated Email Component
 * Displays email in a bot-resistant way while remaining accessible
 */
export function ObfuscatedEmail({ 
  encoded, 
  className = '', 
  subject,
  showIcon = false 
}: ObfuscatedEmailProps) {
  const [email, setEmail] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Decode on client-side only
    try {
      const decoded = decodeEmail(encoded)
      setEmail(decoded)
    } catch (error) {
      console.error('Failed to decode email:', error)
    }
  }, [encoded])

  if (!mounted || !email) {
    // Server-side and initial render: show placeholder
    return (
      <span 
        className={className}
        itemProp="email"
      >
        {showIcon && <span aria-hidden="true">✉️ </span>}
        <span aria-label="Email address (loading)">
          Loading email...
        </span>
      </span>
    )
  }

  const mailtoLink = `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`

  return (
    <a
      href={mailtoLink}
      className={className}
      itemProp="email"
      onClick={(e) => {
        // Additional anti-bot measure: verify user interaction
        if (!e.isTrusted) {
          e.preventDefault()
        }
      }}
    >
      {showIcon && <span aria-hidden="true">✉️ </span>}
      {email}
    </a>
  )
}

interface ObfuscatedPhoneProps {
  encoded: string
  className?: string
  showIcon?: boolean
}

/**
 * Obfuscated Phone Component
 * Displays phone number in a bot-resistant way
 */
export function ObfuscatedPhone({ 
  encoded, 
  className = '',
  showIcon = false 
}: ObfuscatedPhoneProps) {
  const [phone, setPhone] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Decode on client-side only
    try {
      const decoded = decodePhone(encoded)
      setPhone(decoded)
    } catch (error) {
      console.error('Failed to decode phone:', error)
    }
  }, [encoded])

  if (!mounted || !phone) {
    // Server-side and initial render: show placeholder
    return (
      <span 
        className={className}
        itemProp="telephone"
      >
        {showIcon && <span aria-hidden="true">📱 </span>}
        <span aria-label="Phone number (loading)">
          Loading phone...
        </span>
      </span>
    )
  }

  const formatted = formatPhone(phone)
  const telLink = `tel:+1${phone.replace(/\D/g, '')}`

  return (
    <a
      href={telLink}
      className={className}
      itemProp="telephone"
      onClick={(e) => {
        // Additional anti-bot measure: verify user interaction
        if (!e.isTrusted) {
          e.preventDefault()
        }
      }}
    >
      {showIcon && <span aria-hidden="true">📱 </span>}
      {formatted}
    </a>
  )
}

interface ContactInfoProps {
  emailEncoded: string
  phoneEncoded?: string
  name: string
  jobTitle?: string
  className?: string
}

/**
 * Complete Contact Info Component with Schema.org Microdata
 * SEO-friendly while protecting from scrapers
 */
export function ContactInfo({ 
  emailEncoded, 
  phoneEncoded, 
  name,
  jobTitle,
  className = '' 
}: ContactInfoProps) {
  return (
    <div 
      className={className}
      itemScope 
      itemType="https://schema.org/Person"
    >
      <meta itemProp="name" content={name} />
      {jobTitle && <meta itemProp="jobTitle" content={jobTitle} />}
      
      <div className="space-y-2">
        <div>
          <ObfuscatedEmail 
            encoded={emailEncoded} 
            className="text-primary hover:underline"
            showIcon
          />
        </div>
        
        {phoneEncoded && (
          <div>
            <ObfuscatedPhone 
              encoded={phoneEncoded} 
              className="text-primary hover:underline"
              showIcon
            />
          </div>
        )}
      </div>
    </div>
  )
}
