'use client'

import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { getAnalytics } from '../lib/analytics'

export function useAnalytics() {
  useEffect(() => {
    // Initialize analytics on client side
    getAnalytics()
  }, [])

  return getAnalytics()
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const analytics = useAnalytics()

  useEffect(() => {
    analytics.trackPageView(pathname)
  }, [pathname, analytics])

  return <>{children}</>
}