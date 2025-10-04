'use client';

import { useEffect } from 'react';

export function ChatWidgetLoader() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    console.log('🤖 ChatWidgetLoader: Component mounted');

    // Check if already loaded
    if (document.getElementById('chat-widget-container') || document.getElementById('chat-widget-script')) {
      console.log('✅ Chat widget already loaded, skipping');
      return;
    }

    function loadChatWidget() {
      try {
        console.log('📡 Loading chat widget script...');
        
        const script = document.createElement('script');
        script.id = 'chat-widget-script';
        script.src = '/chat-widget.js';
        script.async = true;
        script.defer = true;
        
        script.onload = function() {
          console.log('✅ Chat widget script loaded successfully');
        };
        
        script.onerror = function(e) {
          console.error('❌ Chat widget failed to load:', e);
          console.error('❌ Script src was:', script.src);
          console.error('❌ Document URL:', window.location.href);
        };
        
        // Ensure body exists before appending
        if (document.body) {
          document.body.appendChild(script);
          console.log('📝 Chat widget script added to document body');
        } else {
          console.error('❌ Document body not available for script injection');
        }
        
      } catch (e) {
        console.error('❌ Error in loadChatWidget:', e);
      }
    }

    // Load with a small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      console.log('🚀 Starting chat widget load after delay');
      loadChatWidget();
    }, 1000);

    // Cleanup timeout on unmount
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // This component doesn't render anything visible
  return null;
}