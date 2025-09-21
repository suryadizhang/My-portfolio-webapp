'use client'

import { useState, useRef, useEffect } from 'react'
import { Button, Input } from '@portfolio/ui'
import { Send, Loader2 } from 'lucide-react'
import { MessageList } from '@/components/chat/MessageList'

export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  isStreaming?: boolean
}

interface ChatPanelProps {
  onNewMessage?: (count: number) => void
}

export function ChatPanel({ onNewMessage }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm Suryadi's AI assistant. I can help you learn about his experience, projects, and technical skills. What would you like to know?",
      role: 'assistant',
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Create streaming assistant message
      const assistantMessageId = (Date.now() + 1).toString()
      const assistantMessage: Message = {
        id: assistantMessageId,
        content: '',
        role: 'assistant',
        timestamp: new Date(),
        isStreaming: true,
      }

      setMessages(prev => [...prev, assistantMessage])

      // Make API call to backend chat endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          context: messages.slice(-5), // Send last 5 messages for context
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        let accumulatedContent = ''

        while (true) {
          const { done, value } = await reader.read()
          
          if (done) {
            // Mark as complete
            setMessages(prev => prev.map(msg => 
              msg.id === assistantMessageId 
                ? { ...msg, isStreaming: false }
                : msg
            ))
            break
          }

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') {
                break
              }
              
              try {
                const parsed = JSON.parse(data)
                if (parsed.content) {
                  accumulatedContent += parsed.content
                  
                  setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessageId 
                      ? { ...msg, content: accumulatedContent }
                      : msg
                  ))
                }
              } catch (e) {
                // Ignore malformed JSON
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: "Sorry, I'm having trouble connecting right now. Please try again later or feel free to contact Suryadi directly via the contact page.",
        role: 'assistant',
        timestamp: new Date(),
      }

      setMessages(prev => {
        // Remove the streaming message and add error
        const filtered = prev.filter(msg => msg.id !== (Date.now() + 1).toString())
        return [...filtered, errorMessage]
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleSampleQuestion = (question: string) => {
    setInput(question)
    inputRef.current?.focus()
  }

  // Sample questions for when there are no messages yet
  const sampleQuestions = [
    "Tell me about the My Hibachi project",
    "What technologies does Suryadi use?",
    "Show me his experience at Coding Temple",
    "What makes his development approach unique?"
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <MessageList messages={messages} />
        
        {/* Sample Questions (show when only welcome message) */}
        {messages.length === 1 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Try asking:</p>
            {sampleQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSampleQuestion(question)}
                className="block text-left w-full p-2 text-xs bg-muted/50 hover:bg-muted rounded-md transition-colors"
              >
                💡 {question}
              </button>
            ))}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-background/95 backdrop-blur">
        <div className="flex space-x-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about Suryadi's work..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            size="sm"
            className="px-3"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2 text-center">
          AI responses may not always be accurate. For important inquiries, please contact directly.
        </p>
      </div>
    </div>
  )
}