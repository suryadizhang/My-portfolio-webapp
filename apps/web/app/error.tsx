'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Page error:', error)
    
    // Additional error details for debugging
    if (typeof window !== 'undefined') {
      console.error('Error context:', {
        message: error.message,
        stack: error.stack,
        digest: error.digest,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    }
  }, [error])

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8">
      <div className="text-center space-y-4 max-w-md mx-auto">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Something went wrong!
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          We encountered an unexpected error while loading this page. 
          Please try again or contact support if the problem persists.
        </p>
        {error.digest && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex gap-4 justify-center pt-4">
          <button
            onClick={() => reset()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  )
}