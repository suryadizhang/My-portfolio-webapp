'use client'

import { useEffect } from 'react'

export default function ChatWidget() {
  useEffect(() => {
    // Pure JavaScript implementation that runs after React is fully mounted
    const createChatButton = () => {
      // Remove any existing chat button
      const existing = document.getElementById('vanilla-chat-button')
      if (existing) {
        existing.remove()
      }

      // Create button element with vanilla JavaScript
      const button = document.createElement('button')
      button.id = 'vanilla-chat-button'
      button.innerHTML = '💬'
      button.style.cssText = `
        position: fixed;
        bottom: 16px;
        right: 16px;
        z-index: 9999;
        background-color: #2563eb;
        color: white;
        border: none;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        font-size: 20px;
        cursor: pointer;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        transition: background-color 0.2s;
      `
      
      // Add hover effect
      button.addEventListener('mouseenter', () => {
        button.style.backgroundColor = '#1d4ed8'
      })
      
      button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = '#2563eb'
      })
      
      // Add click handler
      button.addEventListener('click', () => {
        alert('Chat feature coming soon! 🚀')
      })
      
      // Add ARIA label for accessibility
      button.setAttribute('aria-label', 'Open chat support')
      button.setAttribute('type', 'button')
      
      // Append to body
      document.body.appendChild(button)
    }

    // Create button with a small delay to ensure DOM is ready
    const timer = setTimeout(createChatButton, 200)

    // Cleanup function
    return () => {
      clearTimeout(timer)
      const button = document.getElementById('vanilla-chat-button')
      if (button) {
        button.remove()
      }
    }
  }, [])

  // This component renders nothing in React - the button is pure DOM
  return null
}