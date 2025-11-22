'use client'

import React, { useState } from 'react'
import { decodeEmail, decodePhone, formatPhone } from '@portfolio/utils/contact/obfuscation'
import { Mail, Phone, Copy, Check } from 'lucide-react'
import { Button } from '@portfolio/ui'

interface ContactButtonProps {
  type: 'email' | 'phone'
  encoded: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  showCopy?: boolean
}

/**
 * Interactive Contact Button with Copy Functionality
 * Reveals contact info only on user interaction (anti-scraper)
 */
export function ContactButton({
  type,
  encoded,
  variant = 'default',
  size = 'default',
  className = '',
  showCopy = true,
}: ContactButtonProps) {
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)
  const [contact, setContact] = useState<string | null>(null)

  const handleReveal = (e: React.MouseEvent) => {
    // Verify it's a real user interaction
    if (!e.isTrusted) {
      return
    }

    try {
      const decoded = type === 'email' ? decodeEmail(encoded) : decodePhone(encoded)
      setContact(decoded)
      setRevealed(true)

      // Auto-hide after 30 seconds for privacy
      setTimeout(() => {
        setRevealed(false)
        setContact(null)
      }, 30000)
    } catch (error) {
      console.error('Failed to decode contact:', error)
    }
  }

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!contact) return

    try {
      await navigator.clipboard.writeText(contact)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const Icon = type === 'email' ? Mail : Phone
  const displayText = contact 
    ? (type === 'phone' ? formatPhone(contact) : contact)
    : `Click to reveal ${type}`

  const href = revealed && contact
    ? (type === 'email' ? `mailto:${contact}` : `tel:+1${contact.replace(/\D/g, '')}`)
    : undefined

  return (
    <div className="inline-flex items-center gap-2">
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={!revealed ? handleReveal : undefined}
        asChild={revealed && !!href}
      >
        {revealed && href ? (
          <a href={href} className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            {displayText}
          </a>
        ) : (
          <>
            <Icon className="h-4 w-4" />
            {displayText}
          </>
        )}
      </Button>

      {revealed && showCopy && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="h-8 w-8"
          title="Copy to clipboard"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  )
}
