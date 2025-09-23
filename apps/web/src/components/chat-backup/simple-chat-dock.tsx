'use client'

import { useState } from 'react'
import { Button } from '@portfolio/ui'
import { MessageCircle, X } from 'lucide-react'

export function SimpleChatDock() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating action button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-blue-600 hover:bg-blue-700 text-white"
        title="Open AI Chat"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat dock */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-96 bg-white rounded-lg shadow-2xl border z-40 flex flex-col">
          <div className="p-4 border-b bg-gray-50 rounded-t-lg">
            <h3 className="font-semibold text-gray-900">AI Assistant</h3>
            <p className="text-xs text-gray-500">Chat functionality coming soon</p>
          </div>
          <div className="flex-1 p-4 flex items-center justify-center text-gray-500">
            <p>Chat component is being fixed...</p>
          </div>
        </div>
      )}
    </>
  )
}