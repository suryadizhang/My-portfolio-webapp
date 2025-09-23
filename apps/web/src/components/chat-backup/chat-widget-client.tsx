'use client'

import { useState, useEffect } from 'react'

export default function ChatWidgetClient() {
  const [isMounted, setIsMounted] = useState(false)

  // Only mount on client to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Don't render during SSR or before hydration
  if (!isMounted) {
    return null
  }

  return (
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
    </div>
  )
}