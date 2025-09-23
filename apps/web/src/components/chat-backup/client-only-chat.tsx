'use client'

import { useEffect, useState } from 'react'

export default function ClientOnlyChat() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything during SSR
  if (!mounted) {
    return null
  }

  return (
    <button
      onClick={() => alert('Chat feature coming soon!')}
      className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 z-50 group"
      aria-label="Open chat"
      type="button"
    >
      <span className="text-xl group-hover:scale-110 transition-transform duration-200">
        💬
      </span>
    </button>
  )
}