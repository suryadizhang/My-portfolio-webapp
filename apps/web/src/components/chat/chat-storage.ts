import { ChatMessage, ChatMode } from './types'

const STORAGE_KEY_PREFIX = 'portfolio_chat_'
const MAX_MESSAGES_PER_MODE = 50

export class ChatStorage {
  private static getStorageKey(mode: ChatMode): string {
    return `${STORAGE_KEY_PREFIX}${mode}`
  }

  static saveMessages(mode: ChatMode, messages: ChatMessage[]): void {
    try {
      // Keep only the last N messages to prevent localStorage bloat
      const messagesToSave = messages.slice(-MAX_MESSAGES_PER_MODE)
      const serialized = messagesToSave.map(msg => ({
        ...msg,
        timestamp: msg.timestamp.toISOString()
      }))
      
      localStorage.setItem(
        this.getStorageKey(mode),
        JSON.stringify(serialized)
      )
    } catch (error) {
      console.warn('Failed to save chat messages:', error)
    }
  }

  static loadMessages(mode: ChatMode): ChatMessage[] {
    try {
      const stored = localStorage.getItem(this.getStorageKey(mode))
      if (!stored) return []

      const parsed = JSON.parse(stored)
      return parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    } catch (error) {
      console.warn('Failed to load chat messages:', error)
      return []
    }
  }

  static clearMessages(mode: ChatMode): void {
    try {
      localStorage.removeItem(this.getStorageKey(mode))
    } catch (error) {
      console.warn('Failed to clear chat messages:', error)
    }
  }

  static clearAllMessages(): void {
    const modes: ChatMode[] = ['general', 'projects', 'resume']
    modes.forEach(mode => this.clearMessages(mode))
  }
}