'use client'

import { useEffect, useState } from 'react'

export default function BulletproofChat() {
  const [canRender, setCanRender] = useState(false)

  useEffect(() => {
    // Only set to true when we're definitely on the client
    // and the window object is available
    if (typeof window !== 'undefined') {
      setCanRender(true)
    }
  }, [])

  // During SSR or before client hydration, render nothing
  if (!canRender) {
    return null
  }

  // Simple click handler
  const handleChatClick = () => {
    if (typeof window !== 'undefined') {
      window.alert('Chat feature coming soon! 🚀')
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleChatClick}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 group"
        aria-label="Open chat support"
        type="button"
      >
        <span className="text-xl group-hover:scale-110 transition-transform duration-200">
          💬
        </span>
      </button>
    </div>
  )
}