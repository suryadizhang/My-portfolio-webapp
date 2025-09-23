'use client'

import { useEffect, useState } from 'react'
import { Button } from '@portfolio/ui'
import { MessageCircle, AlertTriangle } from 'lucide-react'

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends React.Component<
  // eslint-disable-next-line no-unused-vars
  { children: React.ReactNode; fallback: (error: Error) => React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  // eslint-disable-next-line no-unused-vars
  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ChatDockWrapper Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback(this.state.error!)
    }

    return this.props.children
  }
}

// Lazy load the full chat component
const FullChatDock = lazy(() => 
  import('./chat-dock').then((mod) => ({ default: mod.ChatDock }))
    .catch((error) => {
      console.error('Failed to load ChatDock:', error)
      throw error
    })
)

import { lazy, Suspense } from 'react'
import React from 'react'

export function ChatDockWrapper() {
  const [mounted, setMounted] = useState(false)
  const [loadFullChat, setLoadFullChat] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleLoadFullChat = () => {
    try {
      setLoadFullChat(true)
    } catch (err) {
      console.error('Error loading full chat:', err)
      setError('Failed to load chat component')
    }
  }

  // Error fallback UI
  const errorFallback = (error: Error) => (
    <div className="fixed bottom-6 right-6 w-80 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg z-50">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-red-800">Chat Unavailable</h4>
          <p className="text-sm text-red-600 mt-1">
            The chat component encountered an error: {error.message}
          </p>
          <Button
            size="sm"
            variant="ghost"
            className="mt-2 text-red-700 hover:text-red-800"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </Button>
        </div>
      </div>
    </div>
  )

  if (error) {
    return errorFallback(new Error(error))
  }

  if (!loadFullChat) {
    // Simple chat button that loads the full component on first interaction
    return (
      <Button
        onClick={handleLoadFullChat}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:scale-110"
        title="Open AI Chat"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  // Load full chat component with error boundary
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={
        <Button
          disabled
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-blue-400 text-white"
          title="Loading chat..."
        >
          <MessageCircle className="h-6 w-6 animate-pulse" />
        </Button>
      }>
        <FullChatDock />
      </Suspense>
    </ErrorBoundary>
  )
}