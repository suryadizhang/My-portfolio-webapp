import { kv } from '@vercel/kv'

export { kv }

// KV utility functions for the portfolio
export class PortfolioKV {
  // Analytics functions
  static async trackEvent(event: {
    id: string
    event: string
    page: string
    timestamp: number
    data?: Record<string, any>
    visitor: {
      ip: string
      userAgent: string
      referer: string
    }
  }) {
    const eventKey = `analytics:${event.timestamp}:${event.id}`
    await kv.setex(eventKey, 90 * 24 * 60 * 60, event) // 90 days TTL
    
    // Update daily counter
    const dateKey = new Date(event.timestamp).toISOString().split('T')[0]
    const dailyKey = `analytics:daily:${dateKey}`
    await kv.hincrby(dailyKey, event.event, 1)
    await kv.expire(dailyKey, 90 * 24 * 60 * 60)
    
    // Update page counter
    const pageKey = `analytics:page:${event.page}`
    await kv.hincrby(pageKey, event.event, 1)
    await kv.expire(pageKey, 90 * 24 * 60 * 60)
  }

  static async getAnalyticsSummary(days: number = 7) {
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - (days - 1) * 24 * 60 * 60 * 1000)
    
    const dailyStats = []
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateKey = d.toISOString().split('T')[0]
      const dailyKey = `analytics:daily:${dateKey}`
      const stats = await kv.hgetall(dailyKey) || {}
      
      dailyStats.push({
        date: dateKey,
        ...stats,
      })
    }

    return { dailyStats }
  }

  // Guestbook functions
  static async saveGuestbookEntry(entry: {
    id: string
    name: string
    email?: string
    message: string
    website?: string
    timestamp: number
    approved: boolean
  }) {
    const entryKey = `guestbook:${entry.timestamp}:${entry.id}`
    await kv.setex(entryKey, 365 * 24 * 60 * 60, entry) // 1 year TTL
  }

  static async getGuestbookEntries(approved: boolean = true) {
    const keys = await kv.keys('guestbook:*')
    const entries = await Promise.all(
      keys.map(async (key: string) => {
        const entry = await kv.get(key)
        return entry
      })
    )

    return entries
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
      .filter((entry: any) => !approved || entry.approved)
      .sort((a: any, b: any) => b.timestamp - a.timestamp)
  }

  static async updateGuestbookEntryApproval(id: string, approved: boolean) {
    const keys = await kv.keys('guestbook:*')
    
    for (const key of keys) {
      const entry = await kv.get(key) as any
      if (entry && entry.id === id) {
        entry.approved = approved
        await kv.setex(key, 365 * 24 * 60 * 60, entry)
        return true
      }
    }
    
    return false
  }

  static async deleteGuestbookEntry(id: string) {
    const keys = await kv.keys('guestbook:*')
    
    for (const key of keys) {
      const entry = await kv.get(key) as any
      if (entry && entry.id === id) {
        await kv.del(key)
        return true
      }
    }
    
    return false
  }

  // Rate limiting functions
  static async checkRateLimit(identifier: string, limit: number = 100, windowMs: number = 15 * 60 * 1000) {
    const key = `rate_limit:${identifier}`
    const current = await kv.incr(key)
    
    if (current === 1) {
      await kv.expire(key, Math.ceil(windowMs / 1000))
    }
    
    return {
      allowed: current <= limit,
      remaining: Math.max(0, limit - current),
      reset: Date.now() + windowMs,
    }
  }

  // Cache functions
  static async getCached<T>(key: string): Promise<T | null> {
    return await kv.get(key)
  }

  static async setCached(key: string, value: any, ttlSeconds: number = 3600) {
    await kv.setex(key, ttlSeconds, value)
  }

  static async deleteCached(key: string) {
    await kv.del(key)
  }
}