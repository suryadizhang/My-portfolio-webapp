'use client';

import { useEffect } from 'react';

export function ChatWidgetLoader() {
  useEffect(() => {
    
    console.log('🤖 ChatWidgetLoader: Mounting inline chat widget...');
    
    // Create inline chat widget - no external dependencies
    const createInlineChatWidget = () => {
      try {
        // Remove any existing widget
        const existing = document.getElementById('chat-widget-container');
        if (existing) {
          existing.remove();
        }

        // Create container
        const container = document.createElement('div');
        container.id = 'chat-widget-container';
        container.style.cssText = `
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 9999;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        // Create chat button
        const button = document.createElement('button');
        button.id = 'chat-button';
        button.innerHTML = '💬';
        button.style.cssText = `
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        `;

        // Hover effect
        button.addEventListener('mouseenter', () => {
          button.style.transform = 'scale(1.1)';
        });
        button.addEventListener('mouseleave', () => {
          button.style.transform = 'scale(1)';
        });

        // Create chat window
        const chatWindow = document.createElement('div');
        chatWindow.id = 'chat-window';
        chatWindow.style.cssText = `
          position: absolute;
          bottom: 70px;
          right: 0;
          width: 350px;
          height: 500px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          display: none;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid #e0e0e0;
        `;

        // Chat header
        const header = document.createElement('div');
        header.style.cssText = `
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 15px;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
          align-items: center;
        `;
        header.innerHTML = `
          <span>🤖 Suryadi's AI Assistant</span>
          <button id="close-chat" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; padding: 0; width: 20px; height: 20px;">×</button>
        `;

        // Chat messages area
        const messages = document.createElement('div');
        messages.id = 'chat-messages';
        messages.style.cssText = `
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          background: #f8f9fa;
        `;

        // Initial message
        const initialMessage = document.createElement('div');
        initialMessage.style.cssText = `
          background: #e3f2fd;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 10px;
          border-left: 3px solid #2196f3;
          animation: fadeIn 0.5s ease-in;
        `;
        initialMessage.innerHTML = `
          <strong>👋 Hi! I'm Suryadi's AI assistant.</strong><br/>
          <span style="color: #666;">Ask me about his projects, tech stack, or experience!</span>
        `;
        messages.appendChild(initialMessage);

        // Chat input area
        const inputArea = document.createElement('div');
        inputArea.style.cssText = `
          padding: 15px;
          border-top: 1px solid #eee;
          background: white;
        `;

        const inputContainer = document.createElement('div');
        inputContainer.style.cssText = `
          display: flex;
          gap: 10px;
          align-items: center;
        `;

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Ask me anything...';
        input.style.cssText = `
          flex: 1;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          outline: none;
          font-size: 14px;
        `;

        const sendButton = document.createElement('button');
        sendButton.innerHTML = '▶️';
        sendButton.style.cssText = `
          padding: 12px 15px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
        `;

        // Send button hover
        sendButton.addEventListener('mouseenter', () => {
          sendButton.style.background = '#5a67d8';
        });
        sendButton.addEventListener('mouseleave', () => {
          sendButton.style.background = '#667eea';
        });

        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          #chat-window.show {
            display: flex !important;
            animation: slideUp 0.3s ease-out;
          }
          #chat-messages::-webkit-scrollbar {
            width: 6px;
          }
          #chat-messages::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          #chat-messages::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
          }
        `;
        document.head.appendChild(style);

        // Send message function
        const sendMessage = async () => {
          const messageText = input.value.trim();
          if (!messageText) return;

          // Clear input
          input.value = '';
          sendButton.disabled = true;
          sendButton.innerHTML = '⏳';

          // Add user message
          const userMessage = document.createElement('div');
          userMessage.style.cssText = `
            background: #667eea;
            color: white;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 10px;
            margin-left: 20px;
            text-align: right;
            animation: fadeIn 0.3s ease-in;
          `;
          userMessage.textContent = messageText;
          messages.appendChild(userMessage);
          messages.scrollTop = messages.scrollHeight;

          try {
            // Call API
            const response = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: messageText }),
            });

            const data = await response.json();
            
            // Add AI response
            const aiMessage = document.createElement('div');
            aiMessage.style.cssText = `
              background: #e8f5e8;
              padding: 12px;
              border-radius: 8px;
              margin-bottom: 10px;
              border-left: 3px solid #4caf50;
              animation: fadeIn 0.3s ease-in;
              line-height: 1.5;
              font-family: inherit;
            `;
            // Format message content for proper display
            const messageContent = data.message || data.reply || data.response || 'I apologize, but I encountered an issue. Please try again.';
            const formattedContent = messageContent
              .replace(/\n/g, '<br/>')
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>');
            
            aiMessage.innerHTML = `<strong>🤖 AI:</strong><br/>${formattedContent}`;
            messages.appendChild(aiMessage);
            
          } catch (error) {
            // Error message
            const errorMessage = document.createElement('div');
            errorMessage.style.cssText = `
              background: #ffebee;
              color: #c62828;
              padding: 12px;
              border-radius: 8px;
              margin-bottom: 10px;
              border-left: 3px solid #f44336;
              animation: fadeIn 0.3s ease-in;
            `;
            errorMessage.innerHTML = `<strong>❌ Error:</strong><br/>Sorry, I'm having trouble connecting. Please try again.`;
            messages.appendChild(errorMessage);
          }

          // Reset button
          sendButton.disabled = false;
          sendButton.innerHTML = '▶️';
          messages.scrollTop = messages.scrollHeight;
        };

        // Event listeners
        button.addEventListener('click', () => {
          const isVisible = chatWindow.style.display === 'flex';
          if (isVisible) {
            chatWindow.style.display = 'none';
            chatWindow.classList.remove('show');
          } else {
            chatWindow.style.display = 'flex';
            chatWindow.classList.add('show');
            input.focus();
          }
        });

        header.querySelector('#close-chat')?.addEventListener('click', () => {
          chatWindow.style.display = 'none';
          chatWindow.classList.remove('show');
        });

        sendButton.addEventListener('click', sendMessage);
        
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        });

        // Assemble components
        inputContainer.appendChild(input);
        inputContainer.appendChild(sendButton);
        inputArea.appendChild(inputContainer);

        chatWindow.appendChild(header);
        chatWindow.appendChild(messages);
        chatWindow.appendChild(inputArea);

        container.appendChild(button);
        container.appendChild(chatWindow);

        // Add to page
        document.body.appendChild(container);

        console.log('✅ Inline chat widget created successfully!');
        
      } catch (error) {
        console.error('❌ Error creating inline chat widget:', error);
      }
    };

    // Create widget immediately if DOM is ready
    if (document.readyState === 'complete') {
      createInlineChatWidget();
    } else {
      // Wait for DOM to be ready
      document.addEventListener('DOMContentLoaded', createInlineChatWidget);
    }

    // Cleanup function
    return () => {
      const widget = document.getElementById('chat-widget-container');
      if (widget) {
        widget.remove();
      }
    };
  }, []);

  // Don't render anything - we create the widget directly in the DOM
  return null;
}