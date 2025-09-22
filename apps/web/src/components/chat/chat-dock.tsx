'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChatMessage, ChatMode } from './types'
import { ChatStorage } from './chat-storage'
import { MessageList } from './message-list'
import { ChatInput } from './chat-input'
import { Button } from '@portfolio/ui'
import { MessageCircle, X, Trash2, Download } from 'lucide-react'
import { cn } from '@portfolio/ui/lib/utils'

interface ChatDockProps {
  className?: string
}

export function ChatDock({ className }: ChatDockProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<ChatMode>('general')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)

  // Load messages when mode changes
  useEffect(() => {
    const loadedMessages = ChatStorage.loadMessages(mode)
    setMessages(loadedMessages)
  }, [mode])

  // Save messages when they change
  useEffect(() => {
    ChatStorage.saveMessages(mode, messages)
  }, [mode, messages])

  // Add new message
  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, newMessage])
    
    // Show notification dot if dock is closed
    if (!isOpen && message.role === 'assistant') {
      setHasNewMessage(true)
    }
  }, [isOpen])

  // Send message to API
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return

    // Add user message
    addMessage({
      role: 'user',
      content,
      mode
    })

    setIsLoading(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [...messages, {
            role: 'user',
            content
          }],
          mode,
          topk: 3
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      let assistantMessage = ''
      const decoder = new TextDecoder()

      // Create placeholder message for streaming
      const messageId = crypto.randomUUID()
      addMessage({
        role: 'assistant',
        content: '',
        mode,
        isStreaming: true
      })

      // Read stream
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              if (data.content) {
                assistantMessage += data.content
                
                // Update streaming message
                setMessages(prev => prev.map(msg => 
                  msg.id === messageId 
                    ? { ...msg, content: assistantMessage }
                    : msg
                ))
              }
              
              if (data.sources) {
                // Update with sources
                setMessages(prev => prev.map(msg => 
                  msg.id === messageId 
                    ? { ...msg, sources: data.sources }
                    : msg
                ))
              }
            } catch (e) {
              // Ignore JSON parsing errors for incomplete chunks
            }
          }
        }
      }

      // Mark streaming as complete
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, isStreaming: false }
          : msg
      ))

    } catch (error) {
      console.error('Chat error:', error)
      
      addMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again or check if the AI service is configured properly.',
        mode
      })
    } finally {
      setIsLoading(false)
    }
  }, [messages, mode, isLoading, addMessage])

  // Clear messages for current mode
  const clearMessages = () => {
    setMessages([])
    ChatStorage.clearMessages(mode)
  }

  // Export chat history
  const exportChat = () => {
    const chatData = {
      mode,
      timestamp: new Date().toISOString(),
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp.toISOString(),
        sources: msg.sources
      }))
    }
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-${mode}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Handle dock open/close
  const handleToggle = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setHasNewMessage(false)
    }
  }

  // Get mode display info
  const getModeInfo = (currentMode: ChatMode) => {
    switch (currentMode) {
      case 'projects':
        return {
          label: 'Projects',
          description: 'Ask about my technical projects and implementations',
          color: 'bg-purple-100 text-purple-800'
        }
      case 'resume':
        return {
          label: 'Resume',
          description: 'Questions about my experience, skills, and background',
          color: 'bg-green-100 text-green-800'
        }
      default:
        return {
          label: 'General',
          description: 'General conversation and questions',
          color: 'bg-blue-100 text-blue-800'
        }
    }
  }

  return (
    <>
      {/* Floating action button */}
      <Button
        onClick={handleToggle}
        className={cn(
          'fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50',
          'bg-blue-600 hover:bg-blue-700 text-white',
          'transition-all duration-300 hover:scale-110',
          className
        )}
        title="Open AI Chat"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="relative">
            <MessageCircle className="h-6 w-6" />
            {hasNewMessage && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>
        )}
      </Button>

      {/* Chat dock */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[32rem] bg-white rounded-lg shadow-2xl border z-40 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">AI Assistant</h3>
                <p className="text-xs text-gray-500">Ask me anything about Suryadi</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={clearMessages}
                disabled={messages.length === 0}
                title="Clear chat"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={exportChat}
                disabled={messages.length === 0}
                title="Export chat"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mode tabs */}
          <div className="flex p-2 gap-1 border-b bg-gray-50">
            {(['general', 'projects', 'resume'] as ChatMode[]).map((chatMode) => {
              const info = getModeInfo(chatMode)
              return (
                <Button
                  key={chatMode}
                  size="sm"
                  variant={mode === chatMode ? 'default' : 'ghost'}
                  onClick={() => setMode(chatMode)}
                  className="flex-1 h-8 text-xs"
                >
                  {info.label}
                </Button>
              )
            })}
          </div>

          {/* Mode description */}
          <div className="px-4 py-2 bg-gray-50 border-b">
            <p className="text-xs text-gray-600">
              {getModeInfo(mode).description}
            </p>
          </div>

          {/* Messages */}
          <MessageList
            messages={messages}
            isLoading={isLoading}
            className="flex-1"
          />

          {/* Input */}
          <ChatInput
            onSend={sendMessage}
            disabled={isLoading}
            placeholder={`Ask me about ${mode === 'general' ? 'anything' : mode}...`}
          />
        </div>
      )}
    </>
  )
}