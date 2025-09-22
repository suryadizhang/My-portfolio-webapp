'use client'

import { CheckCircle, X, AlertCircle, Mail } from 'lucide-react'
import { Button } from '@portfolio/ui'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'success' | 'error'
  title: string
  message: string
  fallbackEmail?: string
}

export function ContactModal({ isOpen, onClose, type, title, message, fallbackEmail }: ContactModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              type === 'success' 
                ? 'bg-green-100 text-green-600' 
                : 'bg-red-100 text-red-600'
            }`}>
              {type === 'success' ? (
                <CheckCircle className="h-8 w-8" />
              ) : (
                <AlertCircle className="h-8 w-8" />
              )}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-center mb-4 text-gray-900">
            {title}
          </h3>

          {/* Message */}
          <p className="text-gray-600 text-center mb-6 leading-relaxed">
            {message}
          </p>

          {/* Error fallback email */}
          {type === 'error' && fallbackEmail && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    You can also reach me directly at:
                  </p>
                  <a
                    href={`mailto:${fallbackEmail}`}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {fallbackEmail}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-center">
            <Button
              onClick={onClose}
              className={`px-8 ${
                type === 'success'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {type === 'success' ? 'Great, Thanks!' : 'Got It'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}