import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const logEntry = await request.json()
    
    // Basic validation
    if (!logEntry.message || !logEntry.level) {
      return NextResponse.json(
        { error: 'Missing required fields: message, level' },
        { status: 400 }
      )
    }

    // Log on server side
    console.log('Client log:', JSON.stringify(logEntry, null, 2))
    
    // Here you could forward to external logging services
    // Example: LogTail, Sentry, DataDog, etc.
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to process log:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Disable for other methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}