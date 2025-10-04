'use client';

import { useEffect } from 'react';

export function ChatWidgetLoader() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      console.log('⚠️ ChatWidgetLoader: Running on server side, skipping');
      return;
    }

    console.log('🤖 ChatWidgetLoader: Component mounted on client side');
    console.log('🌐 Current URL:', window.location.href);
    console.log('📄 Document ready state:', document.readyState);

    let loadAttempted = false;

    // Check if already loaded
    if (document.getElementById('chat-widget-container') || document.getElementById('chat-widget-script')) {
      console.log('✅ Chat widget already exists, skipping initialization');
      return;
    }

    function loadChatWidget() {
      if (loadAttempted) {
        console.log('⚠️ Load already attempted, skipping duplicate');
        return;
      }
      
      loadAttempted = true;
      
      try {
        console.log('📡 Starting chat widget script load...');
        console.log('📍 Document body available:', !!document.body);
        console.log('📍 Document head available:', !!document.head);
        
        const script = document.createElement('script');
        script.id = 'chat-widget-script';
        script.src = '/chat-widget.js';
        script.async = true;
        script.defer = true;
        script.type = 'text/javascript';
        
        // Add detailed event handlers
        script.onload = function() {
          console.log('✅ Chat widget script loaded successfully');
          console.log('📝 Script element:', script);
          
          // Check if widget was created after a short delay
          setTimeout(() => {
            const container = document.getElementById('chat-widget-container');
            const button = document.getElementById('chat-button');
            console.log('🔍 Post-load check - Container:', !!container, 'Button:', !!button);
          }, 2000);
        };
        
        script.onerror = function(e) {
          console.error('❌ Chat widget script failed to load');
          console.error('❌ Error event:', e);
          console.error('❌ Script src:', script.src);
          
          // Try alternative loading method
          console.log('🔄 Attempting alternative loading method...');
          loadChatWidgetAlternative();
        };
        
        script.onabort = function() {
          console.error('❌ Chat widget script load was aborted');
        };
        
        // Append to body (preferred) or head as fallback
        if (document.body) {
          document.body.appendChild(script);
          console.log('📝 Chat widget script added to document body');
        } else if (document.head) {
          document.head.appendChild(script);
          console.log('📝 Chat widget script added to document head');
        } else {
          console.error('❌ Neither document.body nor document.head available');
          return;
        }
        
        console.log('📊 Script element after append:', script);
        
      } catch (e) {
        console.error('❌ Exception in loadChatWidget:', e);
        if (e instanceof Error) {
          console.error('❌ Stack trace:', e.stack);
        }
      }
    }

    function loadChatWidgetAlternative() {
      try {
        console.log('🔄 Alternative loading: fetching script content directly');
        
        fetch('/chat-widget.js')
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.text();
          })
          .then(scriptContent => {
            console.log('✅ Script content fetched, length:', scriptContent.length);
            
            // Execute the script content directly
            const scriptElement = document.createElement('script');
            scriptElement.id = 'chat-widget-script-inline';
            scriptElement.type = 'text/javascript';
            scriptElement.textContent = scriptContent;
            
            if (document.body) {
              document.body.appendChild(scriptElement);
              console.log('✅ Inline script executed');
            } else {
              console.error('❌ Document body not available for inline script');
            }
          })
          .catch(fetchError => {
            console.error('❌ Alternative loading failed:', fetchError);
          });
      } catch (e) {
        console.error('❌ Exception in alternative loading:', e);
      }
    }

    // Multiple loading strategies with different timing
    console.log('🚀 Scheduling chat widget loads...');
    
    // Immediate attempt if document is already complete
    if (document.readyState === 'complete') {
      console.log('📄 Document already complete, loading immediately');
      setTimeout(loadChatWidget, 100);
    } else {
      console.log('📄 Document not complete, waiting for load event');
      window.addEventListener('load', () => {
        console.log('📄 Window load event fired');
        setTimeout(loadChatWidget, 500);
      });
    }
    
    // Backup loading attempts
    const timeouts = [1000, 3000, 5000];
    const timeoutIds = timeouts.map((delay, index) => 
      setTimeout(() => {
        console.log(`🔄 Backup load attempt ${index + 1} after ${delay}ms`);
        loadChatWidget();
      }, delay)
    );

    // Cleanup function
    return () => {
      console.log('🧹 ChatWidgetLoader cleanup');
      timeoutIds.forEach(clearTimeout);
    };
  }, []);

  // This component doesn't render anything visible
  return null;
}