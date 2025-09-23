'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export default function PortalChatWidget() {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null)

  useEffect(() => {
    // Only create portal after component is fully mounted
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && document.body) {
        // Create a dedicated container for the chat widget
        let container = document.getElementById('chat-widget-portal')
        if (!container) {
          container = document.createElement('div')
          container.id = 'chat-widget-portal'
          document.body.appendChild(container)
        }
        setPortalRoot(container)
      }
    }, 100) // Small delay to ensure DOM is ready

    return () => {
      clearTimeout(timer)
      // Cleanup portal container on unmount
      const container = document.getElementById('chat-widget-portal')
      if (container) {
        document.body.removeChild(container)
      }
    }
  }, [])

  if (!portalRoot) {
    return null
  }

  return createPortal(
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => {
          if (typeof window !== 'undefined') {
            window.alert('Chat feature coming soon! 🚀')
          }
        }}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-colors duration-200"
        aria-label="Open chat support"
        type="button"
      >
        <span className="text-xl">💬</span>
      </button>
    </div>,
    portalRoot
  )
}