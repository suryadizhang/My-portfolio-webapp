'use client';
import { Suspense, lazy, useState, useEffect } from 'react';

// Environment guard at module level
const isChatEnabled = () => {
  if (typeof window === 'undefined') return false;
  return process.env.NEXT_PUBLIC_CHAT_ENABLED === 'true';
};

// Lazy load with error boundary
const ChatWidget = lazy(() => 
  import('./ChatWidget').catch(() => {
    // Fallback if chat component fails to load
    return { default: () => <div></div> };
  })
);

export default function ChatWidgetWrapper() {
  const [shouldRender, setShouldRender] = useState(false);
  
  useEffect(() => {
    // Client-side only check after hydration
    setShouldRender(isChatEnabled());
  }, []);

  if (!shouldRender) return null;

  return (
    <Suspense fallback={null}>
      <ChatWidget />
    </Suspense>
  );
}