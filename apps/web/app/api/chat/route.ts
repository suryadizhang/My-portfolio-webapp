import { NextRequest } from 'next/server'

// Simple proxy to the Python backend
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Get backend URL from environment
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000'
    
    // Forward request to Python backend
    const response = await fetch(`${backendUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`)
    }

    // Stream the response back to the client
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    
    // Return a fallback response
    const fallbackResponse = `data: {"content": "I'm currently experiencing technical difficulties. Please feel free to contact Suryadi directly at suryadizhang.swe@gmail.com or via LinkedIn (linkedin.com/in/suryadi-zhang) for any questions about his work and experience."}\n\ndata: {"content": "", "done": true}\n\ndata: [DONE]\n\n`
    
    return new Response(fallbackResponse, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  }
}