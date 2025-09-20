'use client'

import { type Message } from './ChatPanel'
import { Loader2, User, Bot } from 'lucide-react'

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="flex space-x-3">
          {/* Avatar */}
          <div className={`
            flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
            ${message.role === 'user' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
            }
          `}>
            {message.role === 'user' ? (
              <User className="h-4 w-4" />
            ) : (
              <Bot className="h-4 w-4" />
            )}
          </div>

          {/* Message Content */}
          <div className="flex-1 space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">
                {message.role === 'user' ? 'You' : 'Suryadi AI'}
              </span>
              <span className="text-xs text-muted-foreground">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            <div className={`
              text-sm leading-relaxed
              ${message.role === 'user' 
                ? 'bg-primary/10 text-primary-foreground/90 px-3 py-2 rounded-lg max-w-[80%] ml-0'
                : 'text-foreground'
              }
            `}>
              {message.isStreaming && !message.content ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span className="text-muted-foreground">Thinking...</span>
                </div>
              ) : (
                <div className="whitespace-pre-wrap">
                  {message.content}
                  {message.isStreaming && (
                    <span className="inline-block w-2 h-4 bg-foreground/60 animate-pulse ml-1" />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}