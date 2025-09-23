'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { Button } from '@portfolio/ui'
import { Send, Loader2, Mic, MicOff } from 'lucide-react'
import { cn } from '@/lib/utils'

// Speech Recognition types
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent {
  error: string
}

interface SpeechRecognitionResult {
  transcript: string
}

interface SpeechRecognitionResultList {
  [index: number]: {
    [index: number]: SpeechRecognitionResult
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  onstart: (() => void) | null
  // eslint-disable-next-line no-unused-vars
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  // eslint-disable-next-line no-unused-vars
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
}

interface ChatInputProps {
  // eslint-disable-next-line no-unused-vars
  onSend: (content: string) => Promise<void>
  disabled?: boolean
  placeholder?: string
  className?: string
}

export function ChatInput({ onSend, disabled = false, placeholder = 'Ask me anything...', className }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (!textarea) return
    
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
  }

  const handleSubmit = async () => {
    if (!message.trim() || isSubmitting) return
    
    const messageToSend = message.trim()
    setMessage('')
    setIsSubmitting(true)
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
    
    try {
      await onSend(messageToSend)
    } finally {
      setIsSubmitting(false)
      textareaRef.current?.focus()
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'
    
    recognition.onstart = () => {
      setIsListening(true)
    }
    
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[0]?.[0]
      if (result) {
        const transcript = result.transcript
        setMessage(prev => prev + (prev ? ' ' : '') + transcript)
        adjustTextareaHeight()
      }
    }
    
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
    }
    
    recognition.onend = () => {
      setIsListening(false)
    }
    
    recognitionRef.current = recognition
    recognition.start()
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  return (
    <div className={cn('flex gap-2 p-4 border-t bg-white', className)}>
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value)
            adjustTextareaHeight()
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isSubmitting}
          className={cn(
            'w-full resize-none border rounded-lg px-3 py-2 pr-12',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'text-sm leading-relaxed'
          )}
          rows={1}
          style={{ minHeight: '40px', maxHeight: '120px' }}
        />
        
        {/* Voice input button */}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={isListening ? stopListening : startListening}
          disabled={disabled || isSubmitting}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          title={isListening ? 'Stop listening' : 'Start voice input'}
        >
          {isListening ? (
            <MicOff className="h-4 w-4 text-red-500" />
          ) : (
            <Mic className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          )}
        </Button>
      </div>
      
      <Button
        type="button"
        onClick={handleSubmit}
        disabled={disabled || isSubmitting || !message.trim()}
        className="self-end h-10"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}

// Add speech recognition types
declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}