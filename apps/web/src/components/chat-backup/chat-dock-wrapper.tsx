'use client'

import React from 'react'

// Completely isolated, simple chat component to avoid any React internal conflicts
export function ChatDockWrapper() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  
  // Simple toggle function
  function toggleChat() {
    setIsOpen(!isOpen)
  }
  
  // Simple message send function
  function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (inputValue.trim()) {
      console.log('Message sent:', inputValue)
      setInputValue('')
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <h3 className="font-semibold">AI Assistant</h3>
            <button
              onClick={toggleChat}
              className="text-white hover:text-gray-200"
              type="button"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="mb-3 text-left">
              <div className="inline-block p-2 rounded-lg max-w-xs bg-gray-100 text-gray-800">
                Hi! I'm Suryadi's AI assistant. How can I help you learn more about his work?
              </div>
            </div>
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Chat Toggle Button */}
      <button
        onClick={toggleChat}
        className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center"
        type="button"
      >
        <span className="text-2xl">
          {isOpen ? '✕' : '💬'}
        </span>
      </button>
    </div>
  )
}