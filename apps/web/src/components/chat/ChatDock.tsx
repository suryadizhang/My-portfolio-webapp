'use client'

import { useState, useEffect } from 'react'
import { Button } from '@portfolio/ui'
import { MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react'
import { ChatPanel } from '@/components/chat/ChatPanel'

export function ChatDock() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Auto-show chat dock after a delay (for demo purposes)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Could add logic to show if user hasn't interacted
    }, 10000)
    return () => clearTimeout(timer)
  }, [])

  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false)
      setIsMinimized(false)
    } else {
      setIsOpen(true)
      setIsMinimized(false)
    }
    setUnreadCount(0)
  }

  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={handleToggle}
            size="lg"
            className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            aria-label="Open chat"
          >
            <MessageCircle className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
        </div>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div 
          className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
            isMinimized ? 'h-12' : 'h-96 sm:h-[500px]'
          } w-80 sm:w-96`}
        >
          <div className="bg-background border rounded-lg shadow-2xl h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">S</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Suryadi Zhang</h3>
                  <p className="text-xs text-muted-foreground">
                    {isMinimized ? 'Chat minimized' : 'Ask me anything about my work!'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMinimize}
                  className="h-8 w-8 p-0"
                >
                  {isMinimized ? (
                    <Maximize2 className="h-4 w-4" />
                  ) : (
                    <Minimize2 className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToggle}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <div className="flex-1 overflow-hidden">
                <ChatPanel onNewMessage={(count: number) => setUnreadCount(count)} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}