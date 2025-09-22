import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import crypto from 'crypto'

// Analytics event schema
const AnalyticsEventSchema = z.object({
  event: z.enum(['page_view', 'like', 'resume_download', 'chat_message', 'contact_form', 'project_view']),
  page: z.string().optional(),
  projectSlug: z.string().optional(),
  chatMode: z.enum(['general', 'projects', 'resume']).optional(),
  metadata: z.record(z.any()).optional()
})

type AnalyticsEvent = z.infer<typeof AnalyticsEventSchema>

interface AnalyticsRecord {
  id: string
  event: string
  page?: string
  projectSlug?: string
  chatMode?: string
  metadata?: Record<string, any>
  timestamp: string
  ipHash: string
  userAgent: string
  sessionId: string
}

// Simple in-memory session tracking
const sessions = new Map<string, { id: string; createdAt: Date }>()

const ANALYTICS_DIR = path.join(process.cwd(), 'apps', 'web', 'data', 'analytics')
const EVENTS_FILE = path.join(ANALYTICS_DIR, 'events.jsonl')

/**
 * Hash IP for privacy compliance
 */
function hashIP(ip: string): string {
  return crypto
    .createHash('sha256')
    .update(ip + (process.env.IP_SALT || 'default_salt'))
    .digest('hex')
    .substring(0, 16)
}

/**
 * Get or create session ID
 */
function getSessionId(request: NextRequest): string {
  const sessionCookie = request.cookies.get('analytics_session')
  
  if (sessionCookie) {
    const session = sessions.get(sessionCookie.value)
    if (session && Date.now() - session.createdAt.getTime() < 30 * 60 * 1000) { // 30 min session
      return session.id
    }
  }
  
  // Create new session
  const sessionId = crypto.randomUUID()
  sessions.set(sessionId, {
    id: sessionId,
    createdAt: new Date()
  })
  
  // Cleanup old sessions
  const now = Date.now()
  for (const [key, session] of sessions.entries()) {
    if (now - session.createdAt.getTime() > 30 * 60 * 1000) {
      sessions.delete(key)
    }
  }
  
  return sessionId
}

/**
 * Log analytics event
 */
async function logEvent(event: AnalyticsRecord): Promise<void> {
  try {
    // Ensure analytics directory exists
    if (!existsSync(ANALYTICS_DIR)) {
      await mkdir(ANALYTICS_DIR, { recursive: true })
    }
    
    // Append to JSONL file
    await writeFile(EVENTS_FILE, JSON.stringify(event) + '\n', { flag: 'a' })
  } catch (error) {
    console.error('Failed to log analytics event:', error)
  }
}

/**
 * Get analytics summary
 */
async function getAnalyticsSummary(): Promise<any> {
  try {
    if (!existsSync(EVENTS_FILE)) {
      return {
        totalEvents: 0,
        pageViews: 0,
        uniqueSessions: 0,
        topPages: [],
        recentEvents: []
      }
    }
    
    const data = await readFile(EVENTS_FILE, 'utf-8')
    const events: AnalyticsRecord[] = data
      .trim()
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line))
    
    const now = new Date()
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    const recentEvents = events.filter(event => 
      new Date(event.timestamp) >= last30Days
    )
    
    // Calculate metrics
    const totalEvents = events.length
    const pageViews = events.filter(e => e.event === 'page_view').length
    const uniqueSessions = new Set(events.map(e => e.sessionId)).size
    const resumeDownloads = events.filter(e => e.event === 'resume_download').length
    const chatMessages = events.filter(e => e.event === 'chat_message').length
    const contactForms = events.filter(e => e.event === 'contact_form').length
    
    // Top pages
    const pageViewEvents = events.filter(e => e.event === 'page_view' && e.page)
    const pageCounts = pageViewEvents.reduce((acc, event) => {
      const page = event.page || 'unknown'
      acc[page] = (acc[page] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const topPages = Object.entries(pageCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([page, count]) => ({ page, count }))
    
    // Recent activity (last 10 events)
    const recentActivity = events
      .slice(-10)
      .reverse()
      .map(event => ({
        event: event.event,
        page: event.page,
        timestamp: event.timestamp,
        sessionId: event.sessionId.substring(0, 8)
      }))
    
    return {
      summary: {
        totalEvents,
        pageViews,
        uniqueSessions,
        resumeDownloads,
        chatMessages,
        contactForms
      },
      topPages,
      recentActivity,
      last30Days: recentEvents.length
    }
    
  } catch (error) {
    console.error('Failed to get analytics summary:', error)
    return {
      error: 'Failed to load analytics data'
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get client info
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const sessionId = getSessionId(request)
    
    // Parse and validate event
    const body = await request.json()
    const eventData = AnalyticsEventSchema.parse(body)
    
    // Create analytics record
    const record: AnalyticsRecord = {
      id: crypto.randomUUID(),
      event: eventData.event,
      page: eventData.page,
      projectSlug: eventData.projectSlug,
      chatMode: eventData.chatMode,
      metadata: eventData.metadata,
      timestamp: new Date().toISOString(),
      ipHash: hashIP(ip),
      userAgent,
      sessionId
    }
    
    // Log the event
    await logEvent(record)
    
    // Set session cookie
    const response = NextResponse.json({ success: true, sessionId })
    response.cookies.set('analytics_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 60 // 30 minutes
    })
    
    return response
    
  } catch (error) {
    console.error('Analytics API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid event data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Simple auth check (in production, use proper authentication)
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.ANALYTICS_TOKEN
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const summary = await getAnalyticsSummary()
    return NextResponse.json(summary)
    
  } catch (error) {
    console.error('Analytics summary error:', error)
    return NextResponse.json(
      { error: 'Failed to get analytics summary' },
      { status: 500 }
    )
  }
}