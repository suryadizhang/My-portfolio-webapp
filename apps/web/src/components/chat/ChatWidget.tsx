'use client';

// keep this minimal; no server-only imports here
export default function ChatWidget() {
  // guard with an env flag
  if (process.env.NEXT_PUBLIC_CHAT_ENABLED !== 'true') return null;
  
  return (
    <div id="chat-widget" className="fixed bottom-6 right-6 z-50">
      <div className="bg-brand text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-brand-700 transition-colors">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3.04.97 4.37L1 23l6.63-1.97C9.96 21.64 11.46 22 13 22h7c1.1 0 2-.9 2-2V12c0-5.52-4.48-10-10-10z"/>
        </svg>
      </div>
    </div>
  );
}