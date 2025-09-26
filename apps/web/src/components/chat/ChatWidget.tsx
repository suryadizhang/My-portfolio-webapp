'use client';
import { useState, useCallback } from 'react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);
  
  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={handleToggle}
          className="bg-brand hover:bg-brand-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
          aria-label="Open chat"
        >
          {isOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3.04.97 4.37L1 23l6.63-1.97C9.96 21.64 11.46 22 13 22h7c1.1 0 2-.9 2-2V12c0-5.52-4.48-10-10-10z"/>
            </svg>
          )}
        </button>
      </div>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-40 bg-white border border-gray-200 rounded-lg shadow-xl w-80 h-96">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
            <button 
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label="Close chat"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
          
          <div className="p-4 h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="mb-2">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-sm">Chat feature coming soon!</p>
              <p className="text-xs mt-1">AI assistant to help you learn about my work</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}