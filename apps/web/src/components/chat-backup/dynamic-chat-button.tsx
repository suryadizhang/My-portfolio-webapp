'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Define the props interface for the chat component
interface ChatButtonProps {
  className?: string
}

// Create a simple inline chat component that will be loaded dynamically
const SimpleChatComponent = ({ className }: ChatButtonProps) => {
  const [isClient, setIsClient] = useState(false)
  
  // Only render on client to avoid hydration issues
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  if (!isClient) {
    return null // Return nothing during SSR
  }
  
  return (
    <button
      onClick={() => alert('Chat feature coming soon!')}
      className={`fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-colors z-50 ${className || ''}`}
      aria-label="Open chat"
    >
      💬
    </button>
  )
}

// Dynamic import with no SSR to prevent hydration issues
const DynamicChatButton = dynamic(() => Promise.resolve(SimpleChatComponent), {
  ssr: false,
  loading: () => null, // No loading state to avoid flash
})

export default DynamicChatButton