'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // Log error for debugging in production
  console.error('Global error:', error);
  
  return (
    <html>
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif' }}>
        <div style={{
          display: 'flex',
          minHeight: '100vh',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          backgroundColor: '#ffffff',
          color: '#374151'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Application Error
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              A critical error occurred. The application needs to be restarted.
            </p>
            <button
              onClick={() => reset()}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}