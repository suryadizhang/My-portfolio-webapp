/**
 * Logging utility for client and server-side logging
 */

export interface LogContext {
  userId?: string
  sessionId?: string
  requestId?: string
  userAgent?: string
  url?: string
  timestamp?: string
  [key: string]: any
}

/* eslint-disable no-unused-vars */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}
/* eslint-enable no-unused-vars */

// Note: Individual enum values are used by the Logger class methods

class Logger {
  private context: LogContext = {}

  constructor() {
    if (typeof window !== 'undefined') {
      this.context = {
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      }
    }
  }

  setContext(context: Partial<LogContext>) {
    this.context = { ...this.context, ...context }
  }

  private formatMessage(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      level: LogLevel[level],
      message,
      data,
      context: this.context,
    }

    return logEntry
  }

  private shouldLog(level: LogLevel): boolean {
    const minLevel = process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO
    return level >= minLevel
  }

  debug(message: string, data?: any) {
    if (!this.shouldLog(LogLevel.DEBUG)) return

    const logEntry = this.formatMessage(LogLevel.DEBUG, message, data)
    console.debug('🐛 [DEBUG]', message, data)
    
    // In production, you might want to send to a logging service
    this.sendToLoggingService(logEntry)
  }

  info(message: string, data?: any) {
    if (!this.shouldLog(LogLevel.INFO)) return

    const logEntry = this.formatMessage(LogLevel.INFO, message, data)
    console.info('ℹ️ [INFO]', message, data)
    
    this.sendToLoggingService(logEntry)
  }

  warn(message: string, data?: any) {
    if (!this.shouldLog(LogLevel.WARN)) return

    const logEntry = this.formatMessage(LogLevel.WARN, message, data)
    console.warn('⚠️ [WARN]', message, data)
    
    this.sendToLoggingService(logEntry)
  }

  error(message: string, error?: Error | any, data?: any) {
    if (!this.shouldLog(LogLevel.ERROR)) return

    const logEntry = this.formatMessage(LogLevel.ERROR, message, {
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
      ...data,
    })

    console.error('🚨 [ERROR]', message, error, data)
    
    this.sendToLoggingService(logEntry)
  }

  private async sendToLoggingService(logEntry: any) {
    // Skip logging service in development or if not configured
    if (process.env.NODE_ENV === 'development') return

    try {
      // Here you can integrate with your logging service
      // Examples: LogTail, Sentry, DataDog, etc.
      
      // Example with a generic logging endpoint
      if (typeof window !== 'undefined') {
        // Client-side logging
        await fetch('/api/logs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(logEntry),
        }).catch(() => {
          // Fail silently to avoid infinite loops
        })
      }
    } catch (error) {
      // Fail silently to avoid logging errors causing more errors
    }
  }
}

// Export singleton instance
export const logger = new Logger()

// Performance monitoring utilities
export const performance = {
  mark(name: string) {
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.performance.mark(name)
    }
  },

  measure(name: string, startMark: string, endMark?: string) {
    if (typeof window !== 'undefined' && 'performance' in window) {
      try {
        const measure = window.performance.measure(name, startMark, endMark)
        logger.info('Performance measurement', {
          name,
          duration: measure.duration,
          startTime: measure.startTime,
        })
        return measure
      } catch (error) {
        logger.warn('Failed to measure performance', { name, startMark, endMark, error })
        return null
      }
    }
    return null
  },

  time(label: string) {
    console.time(label)
  },

  timeEnd(label: string) {
    console.timeEnd(label)
  },
}

// Web Vitals tracking
export const trackWebVital = (metric: any) => {
  logger.info('Web Vital', metric)
  
  // Send to analytics service
  if (typeof window !== 'undefined') {
    // Example: Google Analytics 4
    if ('gtag' in window) {
      (window as any).gtag('event', metric.name, {
        value: Math.round(metric.value),
        event_label: metric.id,
        non_interaction: true,
      })
    }
  }
}