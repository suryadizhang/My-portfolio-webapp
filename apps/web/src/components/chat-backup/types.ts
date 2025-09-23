export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  mode: ChatMode
  sources?: ChatSource[]
  isStreaming?: boolean
}

export type ChatMode = 'general' | 'projects' | 'resume'

export interface ChatSource {
  title: string
  type: 'project' | 'profile' | 'content'
  url?: string
  excerpt: string
}

export interface ChatContext {
  messages: ChatMessage[]
  mode: ChatMode
  isLoading: boolean
  isOpen: boolean
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  setMode: (mode: ChatMode) => void
  setIsLoading: (loading: boolean) => void
  setIsOpen: (open: boolean) => void
  clearMessages: () => void
  sendMessage: (content: string) => Promise<void>
}