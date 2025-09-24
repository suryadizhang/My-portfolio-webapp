import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { searchContent } from '@/lib/rag/search'

// Request validation schema
const ChatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().min(1).max(2000)
  })).min(1).max(20),
  mode: z.enum(['general', 'projects', 'resume']).default('general'),
  topK: z.number().min(1).max(10).default(5),
  stream: z.boolean().default(true)
})

type ChatMode = 'general' | 'projects' | 'resume'

// Mode-specific system prompts
const SYSTEM_PROMPTS: Record<ChatMode, string> = {
  general: `You are Suryadi Zhang's AI assistant, helping visitors learn about his background, experience, and projects. 

You have access to detailed information about:
- Professional background and experience
- Technical skills and expertise  
- Featured projects with detailed case studies
- Education and certifications

Provide helpful, accurate information based on the context provided. Be conversational but professional. If you don't have specific information, suggest where they might find more details (like viewing specific project pages or the resume).`,

  projects: `You are Suryadi Zhang's technical project assistant. You help visitors understand his development work, technical choices, and implementation details.

Focus on:
- Project architecture and technology stacks
- Implementation details and code examples
- Technical challenges and solutions
- Business impact and results
- Development processes and best practices

Provide technical insights while remaining accessible. Reference specific projects from the context when relevant.`,

  resume: `You are Suryadi Zhang's career assistant, helping with professional inquiries about his experience, qualifications, and career progression.

Focus on:
- Professional experience and achievements
- Technical skills and expertise levels
- Education and certifications
- Career progression and growth
- Quantifiable impacts and results

Present information in a professional, recruiter-friendly manner. Highlight relevant qualifications and achievements.`
}

// Fallback responses when OpenAI is not available
// eslint-disable-next-line no-unused-vars
const FALLBACK_RESPONSES: Record<ChatMode, (context: string, _query: string) => string> = {
  // eslint-disable-next-line no-unused-vars
  general: (context, _query) => {
    if (context.trim()) {
      return `Based on Suryadi's profile, here's what I can tell you:\n\n${context}\n\nWould you like to know more about any specific aspect of his background or projects?`
    }
    return `I'm here to help you learn about Suryadi Zhang's background and experience. You can ask me about his projects, technical skills, work experience, or anything else you'd like to know!`
  },
  
  // eslint-disable-next-line no-unused-vars
  projects: (context, _query) => {
    if (context.trim()) {
      return `Here are the technical details I found:\n\n${context}\n\nWould you like me to elaborate on any specific technical aspects or show you other related projects?`
    }
    return `I can help you explore Suryadi's technical projects. Ask me about specific technologies, project architecture, implementation details, or any development-related questions!`
  },
  
  // eslint-disable-next-line no-unused-vars
  resume: (context, _query) => {
    if (context.trim()) {
      return `Here's the professional information that matches your inquiry:\n\n${context}\n\nIs there any other aspect of Suryadi's professional background you'd like to know about?`
    }
    return `I can provide information about Suryadi's professional experience, skills, and qualifications. What specific aspects of his background would you like to explore?`
  }
}

/**
 * Generate streaming response using OpenAI API
 */
async function generateOpenAIResponse(
  messages: Array<{ role: string; content: string }>,
  context: string,
  mode: ChatMode
): Promise<ReadableStream> {
  const openaiApiKey = process.env.OPENAI_API_KEY
  const openaiBaseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
  
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured')
  }
  
  const systemMessage = {
    role: 'system',
    content: `${SYSTEM_PROMPTS[mode]}\n\nContext from Suryadi's portfolio:\n${context}`
  }
  
  const response = await fetch(`${openaiBaseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [systemMessage, ...messages],
      stream: true,
      temperature: 0.7,
      max_tokens: 1000,
    }),
  })
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
  }
  
  return response.body!
}

/**
 * Generate fallback response as stream
 */
function generateFallbackStream(content: string): ReadableStream {
  const encoder = new TextEncoder()
  
  return new ReadableStream({
    start(controller) {
      // Simulate streaming by sending chunks
      const words = content.split(' ')
      let index = 0
      
      const sendChunk = () => {
        if (index < words.length) {
          const chunk = words.slice(index, index + 3).join(' ') + ' '
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`))
          index += 3
          setTimeout(sendChunk, 50) // Simulate delay
        } else {
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        }
      }
      
      sendChunk()
    }
  })
}

/**
 * Rate limiting check (simple in-memory implementation)
 */
const rateLimiter = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string, limit: number = 20, windowMs: number = 15 * 60 * 1000): boolean {
  const now = Date.now()
  const key = ip
  
  const record = rateLimiter.get(key)
  
  if (!record || record.resetTime < now) {
    rateLimiter.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (record.count >= limit) {
    return false
  }
  
  record.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }
    
    // Parse and validate request
    const body = await request.json()
    const { messages, mode, topK, stream } = ChatRequestSchema.parse(body)
    
    // Get the last user message for RAG search
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')
    if (!lastUserMessage) {
      return NextResponse.json(
        { error: 'No user message found' },
        { status: 400 }
      )
    }
    
    // Search for relevant context using RAG
    const searchResults = searchContent(lastUserMessage.content, {
      mode,
      topK,
      minScore: 0.1
    })
    
    const context = searchResults.context
    
    // Log search for analytics (optional)
    console.log(`[Chat] Mode: ${mode}, Query: "${lastUserMessage.content.substring(0, 50)}...", Results: ${searchResults.totalResults}`)
    
    if (stream) {
      try {
        // Try OpenAI API first
        const openaiStream = await generateOpenAIResponse(messages, context, mode)
        
        return new Response(openaiStream, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        })
        
      } catch (error) {
        console.warn('OpenAI API unavailable, using fallback:', error)
        
        // Fallback to template response
        const fallbackResponse = FALLBACK_RESPONSES[mode](context, lastUserMessage.content)
        const fallbackStream = generateFallbackStream(fallbackResponse)
        
        return new Response(fallbackStream, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        })
      }
    } else {
      // Non-streaming response
      try {
        const openaiStream = await generateOpenAIResponse(messages, context, mode)
        const reader = openaiStream.getReader()
        let fullResponse = ''
        
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          const chunk = new TextDecoder().decode(value)
          const lines = chunk.split('\n')
          
          for (const line of lines) {
            if (line.startsWith('data: ') && !line.includes('[DONE]')) {
              try {
                const data = JSON.parse(line.slice(6))
                if (data.choices?.[0]?.delta?.content) {
                  fullResponse += data.choices[0].delta.content
                }
              } catch (e) {
                // Ignore parsing errors
              }
            }
          }
        }
        
        return NextResponse.json({
          response: fullResponse,
          context: context.substring(0, 500) + '...',
          sources: searchResults.sources,
          searchTime: searchResults.searchTime
        })
        
      } catch (error) {
        console.warn('OpenAI API unavailable, using fallback:', error)
        
        const fallbackResponse = FALLBACK_RESPONSES[mode](context, lastUserMessage.content)
        
        return NextResponse.json({
          response: fallbackResponse,
          context: context.substring(0, 500) + '...',
          sources: searchResults.sources,
          searchTime: searchResults.searchTime
        })
      }
    }
    
  } catch (error) {
    console.error('Chat API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request format', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  try {
    // Check if RAG index is available
    const testSearch = searchContent('test', { topK: 1 })
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      ragIndex: {
        available: testSearch.totalResults >= 0,
        totalChunks: testSearch.totalResults
      },
      openai: {
        configured: !!process.env.OPENAI_API_KEY
      }
    })
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: 'RAG system not available' },
      { status: 503 }
    )
  }
}