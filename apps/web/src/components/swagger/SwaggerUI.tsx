'use client'

import React, { useEffect, useState } from 'react'
import { openApiSpec } from '@/lib/swagger/openapi'

// Swagger UI component that dynamically loads the library
export default function SwaggerUI() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Dynamically import Swagger UI to avoid SSR issues
    const loadSwaggerUI = async () => {
      try {
        // Load Swagger UI CSS
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui.css'
        document.head.appendChild(link)

        // Load Swagger UI Bundle
        const SwaggerUIBundle = (await import('swagger-ui-dist/swagger-ui-bundle.js' as any)).default
        
        // Get current base URL for dynamic server configuration
        const baseUrl = window.location.origin
        const specWithCurrentServer = {
          ...openApiSpec,
          servers: [
            {
              url: `${baseUrl}/api`,
              description: 'Current Server'
            },
            ...openApiSpec.servers
          ]
        }

        // Initialize Swagger UI
        SwaggerUIBundle({
          spec: specWithCurrentServer,
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIBundle.presets.standalone
          ],
          plugins: [
            SwaggerUIBundle.plugins.DownloadUrl
          ],
          layout: "StandaloneLayout",
          tryItOutEnabled: true,
          filter: true,
          supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
          onComplete: () => {
            setIsLoaded(true)
          },
          onFailure: (error: any) => {
            console.error('Swagger UI failed to load:', error)
            setError('Failed to load API documentation')
          }
        })
      } catch (err) {
        console.error('Error loading Swagger UI:', err)
        setError('Failed to initialize API documentation')
      }
    }

    loadSwaggerUI()
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              Error Loading API Documentation
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">
            Portfolio API Documentation
          </h1>
          <p className="text-blue-100 text-lg">
            Interactive API documentation for Suryadi Zhang's portfolio website
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <span className="bg-blue-500/30 px-3 py-1 rounded-full">
              🤖 AI-Powered Chat
            </span>
            <span className="bg-purple-500/30 px-3 py-1 rounded-full">
              📧 Smart Contact System
            </span>
            <span className="bg-indigo-500/30 px-3 py-1 rounded-full">
              📊 Analytics Tracking
            </span>
            <span className="bg-pink-500/30 px-3 py-1 rounded-full">
              🔒 Security Features
            </span>
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      {!isLoaded && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading API documentation...</p>
          </div>
        </div>
      )}

      {/* Quick Info Cards */}
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
              <h3 className="font-semibold text-gray-900 mb-2">Base URL</h3>
              <code className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {typeof window !== 'undefined' ? `${window.location.origin}/api` : '/api'}
              </code>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
              <h3 className="font-semibold text-gray-900 mb-2">API Version</h3>
              <span className="text-green-600 font-mono">{openApiSpec.info.version}</span>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
              <h3 className="font-semibold text-gray-900 mb-2">Endpoints</h3>
              <span className="text-purple-600 font-mono">
                {Object.keys(openApiSpec.paths).length} routes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Swagger UI Container */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div id="swagger-ui" className="swagger-ui-container"></div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-300">
            Portfolio API • Built with Next.js 15, OpenAI, and modern web technologies
          </p>
          <p className="text-gray-400 text-sm mt-2">
            © 2024 Suryadi Zhang • 
            <a 
              href="https://myportfolio.mysticdatanode.net" 
              className="text-blue-400 hover:text-blue-300 ml-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Portfolio
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}