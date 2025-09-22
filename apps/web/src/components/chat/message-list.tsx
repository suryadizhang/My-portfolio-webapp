'use client'

import { useEffect, useRef } from 'react'
import { ChatMessage } from './types'
import { Badge } from '@portfolio/ui'
import { Bot, User, ExternalLink, Copy, ThumbsUp, ThumbsDown } from 'lucide-react'
import { cn } from '@portfolio/ui/lib/utils'

interface MessageListProps {
  messages: ChatMessage[]
  isLoading?: boolean
  className?: string
}

export function MessageList({ messages, isLoading = false, className }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // TODO: Add toast notification
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  if (messages.length === 0 && !isLoading) {
    return (
      <div className={cn('flex-1 flex items-center justify-center p-8', className)}>
        <div className="text-center text-gray-500 max-w-sm">
          <Bot className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="font-medium mb-2">Start a conversation</h3>
          <p className="text-sm">
            Ask me about my projects, experience, or anything else you'd like to know!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex-1 overflow-y-auto', className)} ref={scrollRef}>
      <div className="space-y-4 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-3 group',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              </div>
            )}
            
            <div
              className={cn(
                'max-w-[80%] rounded-2xl px-4 py-3',
                message.role === 'user'
                  ? 'bg-blue-500 text-white ml-auto'
                  : 'bg-gray-100 text-gray-900'
              )}
            >
              {/* Message content */}
              <div className="prose prose-sm max-w-none">
                {message.isStreaming ? (
                  <div className="flex items-center gap-2">
                    <span>{message.content}</span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{message.content}</div>
                )}
              </div>
              
              {/* Sources */}
              {message.sources && message.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs font-medium text-gray-600 mb-2">Sources:</p>
                  <div className="flex flex-wrap gap-1">
                    {message.sources.map((source, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="text-xs cursor-pointer hover:bg-blue-100"
                        onClick={() => source.url && window.open(source.url, '_blank')}
                      >
                        {source.title}
                        {source.url && <ExternalLink className="h-3 w-3 ml-1" />}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Timestamp and actions */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200/50">
                <span className={cn(
                  'text-xs',
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                )}>
                  {formatTime(message.timestamp)}
                </span>
                
                {/* Message actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => copyToClipboard(message.content)}
                    className={cn(
                      'p-1 rounded hover:bg-black/10 transition-colors',
                      message.role === 'user' ? 'text-blue-100 hover:text-white' : 'text-gray-400 hover:text-gray-600'
                    )}
                    title="Copy message"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                  
                  {message.role === 'assistant' && (
                    <>
                      <button
                        className="p-1 rounded hover:bg-black/10 transition-colors text-gray-400 hover:text-green-600"
                        title="Helpful"
                      >
                        <ThumbsUp className="h-3 w-3" />
                      </button>
                      <button
                        className="p-1 rounded hover:bg-black/10 transition-colors text-gray-400 hover:text-red-600"
                        title="Not helpful"
                      >
                        <ThumbsDown className="h-3 w-3" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {message.role === 'user' && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
              </div>
            )}
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-gray-500">
                <span className="text-sm">Thinking...</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Scroll target */}
        <div ref={endRef} />
      </div>
    </div>
  )
}