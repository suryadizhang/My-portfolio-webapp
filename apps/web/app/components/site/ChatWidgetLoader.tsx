'use client';

import { useEffect, useRef, useCallback } from 'react';

// Browser capability detection for adaptive loading
interface BrowserCapabilities {
  supportsRequestIdleCallback: boolean;
  supportsIntersectionObserver: boolean;
  supportsPerformanceObserver: boolean;
  supportsContainment: boolean;
}

function detectBrowserCapabilities(): BrowserCapabilities {
  return {
    supportsRequestIdleCallback: 'requestIdleCallback' in window,
    supportsIntersectionObserver: 'IntersectionObserver' in window,
    supportsPerformanceObserver: 'PerformanceObserver' in window,
    supportsContainment: CSS?.supports?.('contain', 'layout') || false,
  };
}

export function ChatWidgetLoader() {
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const retryCountRef = useRef(0);
  const mountedRef = useRef(false);
  const performanceObserverRef = useRef<PerformanceObserver | null>(null);
  const maxRetries = 50; // 500ms max wait time
  const errorCount = useRef(0);
  const maxErrors = 3;

  // Performance monitoring for optimization
  const setupPerformanceMonitoring = useCallback(() => {
    const capabilities = detectBrowserCapabilities();
    
    if (capabilities.supportsPerformanceObserver) {
      try {
        performanceObserverRef.current = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.name.includes('chat-widget') && entry.duration > 100) {
              console.debug('Chat widget performance tracked:', entry.duration + 'ms');
            }
          });
        });
        
        performanceObserverRef.current.observe({ entryTypes: ['measure'] });
      } catch (e) {
        // Silently fail if not supported
      }
    }
  }, []);

  // Universal extension conflict prevention
  const preventExtensionConflicts = useCallback(() => {
    const existingStyle = document.querySelector('style[data-chat-widget="universal-protection"]');
    if (existingStyle) return;

    const style = document.createElement('style');
    style.setAttribute('data-chat-widget', 'universal-protection');
    style.textContent = `
      /* Universal chat widget protection */
      #chat-widget-container {
        /* Create complete isolation boundary */
        isolation: isolate !important;
        contain: layout style paint !important;
        
        /* Use system fonts that work everywhere */
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 
                     "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
        
        /* Prevent extension style bleeding */
        all: initial;
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        z-index: 2147483647 !important;
        
        /* Reset any extension-injected properties */
        background: none !important;
        border: none !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      
      /* Defensive styling for all child elements */
      #chat-widget-container *,
      #chat-widget-container *::before,
      #chat-widget-container *::after {
        box-sizing: border-box !important;
        font-family: inherit !important;
        background-image: none !important;
        text-shadow: none !important;
        border-image: none !important;
        /* Prevent extension font injection */
        src: none !important;
      }
      
      /* Accessibility support */
      @media (prefers-contrast: high) {
        #chat-widget-container button {
          border: 2px solid currentColor !important;
        }
      }
      
      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        #chat-widget-container * {
          animation: none !important;
          transition: none !important;
        }
      }
      
      /* Focus indicators for accessibility */
      #chat-widget-container button:focus {
        outline: 2px solid #4A90E2 !important;
        outline-offset: 2px !important;
      }

      /* Chat window styling */
      #chat-window {
        position: absolute !important;
        bottom: 70px !important;
        right: 0 !important;
        width: 350px !important;
        height: 500px !important;
        background: white !important;
        border-radius: 10px !important;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2) !important;
        display: none !important;
        flex-direction: column !important;
        overflow: hidden !important;
        border: 1px solid #e0e0e0 !important;
      }

      #chat-window.show {
        display: flex !important;
        animation: slideUp 0.3s ease-out !important;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }

      #chat-messages::-webkit-scrollbar {
        width: 6px !important;
      }
      #chat-messages::-webkit-scrollbar-track {
        background: #f1f1f1 !important;
      }
      #chat-messages::-webkit-scrollbar-thumb {
        background: #c1c1c1 !important;
        border-radius: 3px !important;
      }
    `;
    
    document.head.appendChild(style);
  }, []);

  // Complete chat widget creation function
  const createInlineChatWidget = useCallback(() => {
    try {
      // Remove any existing widgets (prevent duplicates)
      const existing = document.getElementById('chat-widget-container');
      if (existing) existing.remove();

      // Use DocumentFragment for better performance
      const fragment = document.createDocumentFragment();
      
      // Create container with defensive styling
      const container = document.createElement('div');
      container.id = 'chat-widget-container';

      // Create accessible button
      const button = document.createElement('button');
      button.id = 'chat-button';
      button.setAttribute('aria-label', 'Open AI chat assistant');
      button.setAttribute('type', 'button');
      button.setAttribute('role', 'button');
      button.setAttribute('tabindex', '0');
      
      button.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
        </svg>
      `;
      
      Object.assign(button.style, {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        outline: 'none',
        fontFamily: 'inherit',
        fontSize: '0',
        transition: 'transform 0.2s ease',
      });

      // Create chat window
      const chatWindow = document.createElement('div');
      chatWindow.id = 'chat-window';

      // Chat header
      const header = document.createElement('div');
      Object.assign(header.style, {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '15px',
        fontWeight: '600',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      });
      
      header.innerHTML = `
        <span>🤖 Suryadi's AI Assistant</span>
        <button id="close-chat" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; padding: 0; width: 20px; height: 20px;">×</button>
      `;

      // Chat messages area
      const messages = document.createElement('div');
      messages.id = 'chat-messages';
      Object.assign(messages.style, {
        flex: '1',
        padding: '20px',
        overflowY: 'auto',
        background: '#f8f9fa',
      });

      // Initial message
      const initialMessage = document.createElement('div');
      Object.assign(initialMessage.style, {
        background: '#e3f2fd',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '10px',
        borderLeft: '3px solid #2196f3',
        animation: 'fadeIn 0.5s ease-in',
      });
      
      initialMessage.innerHTML = `
        <strong>👋 Hi! I'm Suryadi's AI assistant.</strong><br/>
        <span style="color: #666;">Ask me about his projects, tech stack, or experience!</span>
      `;
      messages.appendChild(initialMessage);

      // Chat input area
      const inputArea = document.createElement('div');
      Object.assign(inputArea.style, {
        padding: '15px',
        borderTop: '1px solid #eee',
        background: 'white',
      });

      const inputContainer = document.createElement('div');
      Object.assign(inputContainer.style, {
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
      });

      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Ask me anything...';
      Object.assign(input.style, {
        flex: '1',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        outline: 'none',
        fontSize: '14px',
      });

      const sendButton = document.createElement('button');
      sendButton.innerHTML = '▶️';
      Object.assign(sendButton.style, {
        padding: '12px 15px',
        background: '#667eea',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'background 0.2s',
      });

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
        Object.assign(userMessage.style, {
          background: '#667eea',
          color: 'white',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '10px',
          marginLeft: '20px',
          textAlign: 'right',
          animation: 'fadeIn 0.3s ease-in',
        });
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
          Object.assign(aiMessage.style, {
            background: '#e8f5e8',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '10px',
            borderLeft: '3px solid #4caf50',
            animation: 'fadeIn 0.3s ease-in',
            lineHeight: '1.5',
            fontFamily: 'inherit',
          });
          
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
          Object.assign(errorMessage.style, {
            background: '#ffebee',
            color: '#c62828',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '10px',
            borderLeft: '3px solid #f44336',
            animation: 'fadeIn 0.3s ease-in',
          });
          errorMessage.innerHTML = `<strong>❌ Error:</strong><br/>Sorry, I'm having trouble connecting. Please try again.`;
          messages.appendChild(errorMessage);
        }

        // Reset button
        sendButton.disabled = false;
        sendButton.innerHTML = '▶️';
        messages.scrollTop = messages.scrollHeight;
      };

      // Efficient hover effects with passive listeners
      const addHoverEffect = () => button.style.transform = 'scale(1.05)';
      const removeHoverEffect = () => button.style.transform = 'scale(1)';
      const addSendHover = () => sendButton.style.background = '#5a67d8';
      const removeSendHover = () => sendButton.style.background = '#667eea';
      
      button.addEventListener('mouseenter', addHoverEffect, { passive: true });
      button.addEventListener('mouseleave', removeHoverEffect, { passive: true });
      button.addEventListener('focus', addHoverEffect, { passive: true });
      button.addEventListener('blur', removeHoverEffect, { passive: true });

      sendButton.addEventListener('mouseenter', addSendHover, { passive: true });
      sendButton.addEventListener('mouseleave', removeSendHover, { passive: true });

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
      }, { passive: true });

      header.querySelector('#close-chat')?.addEventListener('click', () => {
        chatWindow.style.display = 'none';
        chatWindow.classList.remove('show');
      }, { passive: true });

      sendButton.addEventListener('click', sendMessage, { passive: true });
      
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      });

      // Assemble components efficiently
      inputContainer.appendChild(input);
      inputContainer.appendChild(sendButton);
      inputArea.appendChild(inputContainer);

      chatWindow.appendChild(header);
      chatWindow.appendChild(messages);
      chatWindow.appendChild(inputArea);

      container.appendChild(button);
      container.appendChild(chatWindow);
      
      fragment.appendChild(container);
      
      // Single DOM insertion for better performance
      document.body.appendChild(fragment);
      
      widgetRef.current = container;
      
      // Performance tracking
      if (performance?.mark) {
        performance.mark('chat-widget-created');
      }
      
      console.log('✅ Universal chat widget created successfully!');
      
      return container;
      
    } catch (error) {
      errorCount.current++;
      console.error('Chat widget creation failed:', error);
      
      if (errorCount.current >= maxErrors) {
        console.warn('Chat widget disabled due to repeated errors');
        return null;
      }
      
      // Self-healing: retry after delay
      setTimeout(() => {
        if (mountedRef.current) {
          // Use direct function call to avoid circular dependency
          setTimeout(() => {
            if (mountedRef.current && !widgetRef.current) {
              createInlineChatWidget();
            }
          }, 1000);
        }
      }, 1000);
      
      return null;
    }
  }, []);

  // Universal widget initialization
  const initializeWidget = useCallback(() => {
    // Prevent multiple instances
    if (widgetRef.current || !mountedRef.current) return;

    try {
      // Cross-browser DOM ready check
      if (!document.body || document.readyState === 'loading') {
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current++;
          // Use requestAnimationFrame for better performance
          requestAnimationFrame(() => setTimeout(initializeWidget, 10));
        }
        return;
      }

      // Create the optimized widget
      createInlineChatWidget();
      
    } catch (error) {
      console.error('Widget initialization failed:', error);
      // Graceful degradation - don't crash the page
    }
  }, [createInlineChatWidget]);

  // Main effect hook
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    console.log('🚀 Universal ChatWidgetLoader: Initializing...');

    // Apply universal protections immediately
    preventExtensionConflicts();
    
    // Setup performance monitoring
    setupPerformanceMonitoring();

    // Use the most compatible loading strategy
    const loadWidget = () => {
      initializeWidget();
    };

    // Progressive enhancement based on browser capabilities
    const capabilities = detectBrowserCapabilities();
    
    if (capabilities.supportsRequestIdleCallback) {
      // Use requestIdleCallback for non-blocking initialization
      requestIdleCallback(loadWidget, { timeout: 2000 });
    } else if ('requestAnimationFrame' in window) {
      // Fallback to requestAnimationFrame
      requestAnimationFrame(() => setTimeout(loadWidget, 100));
    } else {
      // Final fallback for very old browsers
      setTimeout(loadWidget, 200);
    }

    // Extension conflict monitoring with efficient observer
    let observer: MutationObserver | null = null;
    
    try {
      observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'childList') {
            // Convert NodeList to Array for compatibility
            const addedNodes = Array.from(mutation.addedNodes);
            for (const node of addedNodes) {
              if (node instanceof HTMLElement) {
                const hasExtensionContent = 
                  node.innerHTML?.includes('chrome-extension') || 
                  node.getAttribute('src')?.includes('chrome-extension') ||
                  node.textContent?.includes('Ruda-Regular.ttf');
                
                if (hasExtensionContent) {
                  console.debug('Extension activity detected, reapplying protections');
                  preventExtensionConflicts();
                  break;
                }
              }
            }
          }
        }
      });

      observer.observe(document.head, { 
        childList: true, 
        subtree: true,
        attributes: false,
        characterData: false 
      });
    } catch (e) {
      // Observer not supported, continue without it
    }

    // Cleanup function
    return () => {
      mountedRef.current = false;
      
      if (widgetRef.current) {
        widgetRef.current.remove();
        widgetRef.current = null;
      }
      
      if (observer) {
        observer.disconnect();
      }
      
      if (performanceObserverRef.current) {
        performanceObserverRef.current.disconnect();
      }
      
      // Clean up style sheet
      const style = document.querySelector('style[data-chat-widget="universal-protection"]');
      if (style) {
        style.remove();
      }
    };
  }, [preventExtensionConflicts, setupPerformanceMonitoring, initializeWidget]);

  return null;
}