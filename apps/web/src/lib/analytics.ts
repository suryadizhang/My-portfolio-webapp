'use client'

type AnalyticsEvent = 
  | 'page_view'
  | 'like' 
  | 'resume_download'
  | 'chat_message'
  | 'contact_form'
  | 'project_view'

interface AnalyticsData {
  event: AnalyticsEvent
  page?: string
  projectSlug?: string
  chatMode?: 'general' | 'projects' | 'resume'
  metadata?: Record<string, any>
}

class Analytics {
  private isEnabled: boolean = true
  private queue: AnalyticsData[] = []
  private isOnline: boolean = navigator.onLine

  constructor() {
    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline.bind(this))
    window.addEventListener('offline', this.handleOffline.bind(this))
    
    // Respect Do Not Track
    if (navigator.doNotTrack === '1') {
      this.isEnabled = false
    }

    // Auto-track page views
    this.trackPageView()
    
    // Track page views on navigation (for SPA)
    this.setupNavigationTracking()
  }

  private handleOnline() {
    this.isOnline = true
    this.flushQueue()
  }

  private handleOffline() {
    this.isOnline = false
  }

  private setupNavigationTracking() {
    // Track initial page view
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState

    history.pushState = (...args) => {
      originalPushState.apply(history, args)
      setTimeout(() => this.trackPageView(), 0)
    }

    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args)
      setTimeout(() => this.trackPageView(), 0)
    }

    window.addEventListener('popstate', () => {
      setTimeout(() => this.trackPageView(), 0)
    })
  }

  private async sendEvent(data: AnalyticsData): Promise<boolean> {
    if (!this.isEnabled) {
      return false
    }

    try {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      return response.ok
    } catch (error) {
      console.warn('Analytics error:', error)
      return false
    }
  }

  private async flushQueue() {
    if (!this.isOnline || this.queue.length === 0) {
      return
    }

    const eventsToSend = [...this.queue]
    this.queue = []

    for (const event of eventsToSend) {
      const sent = await this.sendEvent(event)
      if (!sent) {
        // Re-queue failed events
        this.queue.push(event)
      }
    }
  }

  async track(data: AnalyticsData): Promise<void> {
    if (!this.isEnabled) {
      return
    }

    if (this.isOnline) {
      const sent = await this.sendEvent(data)
      if (!sent) {
        this.queue.push(data)
      }
    } else {
      this.queue.push(data)
    }
  }

  // Convenience methods
  trackPageView(page?: string): void {
    const currentPage = page || window.location.pathname
    this.track({
      event: 'page_view',
      page: currentPage,
      metadata: {
        referrer: document.referrer,
        title: document.title
      }
    })
  }

  trackProjectView(projectSlug: string): void {
    this.track({
      event: 'project_view',
      projectSlug,
      page: window.location.pathname
    })
  }

  trackResumeDownload(): void {
    this.track({
      event: 'resume_download',
      page: window.location.pathname
    })
  }

  trackLike(target: string): void {
    this.track({
      event: 'like',
      page: window.location.pathname,
      metadata: { target }
    })
  }

  trackChatMessage(mode: 'general' | 'projects' | 'resume'): void {
    this.track({
      event: 'chat_message',
      chatMode: mode,
      page: window.location.pathname
    })
  }

  trackContactForm(): void {
    this.track({
      event: 'contact_form',
      page: window.location.pathname
    })
  }

  // Custom events
  trackCustom(event: string, metadata?: Record<string, any>): void {
    this.track({
      event: event as AnalyticsEvent,
      page: window.location.pathname,
      metadata
    })
  }

  // Disable analytics (for privacy)
  disable(): void {
    this.isEnabled = false
    this.queue = []
  }

  enable(): void {
    this.isEnabled = true
  }
}

// Create singleton instance
let analytics: Analytics | null = null

export function getAnalytics(): Analytics {
  if (typeof window === 'undefined') {
    // Return mock for SSR
    return {
      track: async () => {},
      trackPageView: () => {},
      trackProjectView: () => {},
      trackResumeDownload: () => {},
      trackLike: () => {},
      trackChatMessage: () => {},
      trackContactForm: () => {},
      trackCustom: () => {},
      disable: () => {},
      enable: () => {}
    } as any
  }

  if (!analytics) {
    analytics = new Analytics()
  }

  return analytics
}

export default getAnalytics