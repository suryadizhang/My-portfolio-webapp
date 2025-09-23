'use client'

import { useEffect, useState } from 'react'

export default function FinalChatWidget() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => alert('Chat feature coming soon! 🚀')}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-colors duration-200"
        aria-label="Open chat support"
        type="button"
      >
        <span className="text-xl">💬</span>
      </button>
    </div>
  )
}