'use client'

// Ultra-simple chat widget with zero dependencies that could cause 'call' errors
export default function SimpleChatWidget() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => {
          // Simple alert for now - can be enhanced later
          alert('Chat feature coming soon! This will be a full AI assistant to help visitors learn about Suryadi\'s work and experience.')
        }}
        className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
        type="button"
        title="AI Chat Assistant (Coming Soon)"
      >
        <span className="text-2xl">💬</span>
      </button>
    </div>
  )
}