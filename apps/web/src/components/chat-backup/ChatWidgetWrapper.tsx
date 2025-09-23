'use client'

import { useEffect, useState } from 'react'

export default function ChatWidgetWrapper() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const CHAT_BUTTON_ID = 'portfolio-chat-button'
    
    // Clean up any existing button
    const existingButton = document.getElementById(CHAT_BUTTON_ID)
    if (existingButton) {
      existingButton.remove()
    }

    // Create the chat button using pure DOM manipulation
    const button = document.createElement('button')
    button.id = CHAT_BUTTON_ID
    button.innerHTML = '💬'
    button.type = 'button'
    button.setAttribute('aria-label', 'Open chat support')
    
    // Apply styles directly
    Object.assign(button.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: '9999',
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '60px',
      height: '60px',
      fontSize: '20px',
      cursor: 'pointer',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    })
    
    // Add hover effects
    button.addEventListener('mouseenter', () => {
      button.style.backgroundColor = '#1d4ed8'
      button.style.transform = 'scale(1.05)'
    })
    
    button.addEventListener('mouseleave', () => {
      button.style.backgroundColor = '#2563eb'
      button.style.transform = 'scale(1)'
    })
    
    // Add click handler
    button.addEventListener('click', () => {
      alert('Chat feature coming soon! 🚀\n\nContact: hello@suryadizhang.dev')
    })
    
    // Append to document body
    document.body.appendChild(button)

    // Cleanup function
    return () => {
      const btn = document.getElementById(CHAT_BUTTON_ID)
      if (btn) {
        btn.remove()
      }
    }
  }, [isMounted])

  // This component renders nothing to React's virtual DOM
  return null
}