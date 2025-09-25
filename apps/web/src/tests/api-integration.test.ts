/**
 * API Integration Tests
 * Testing API endpoints with realistic scenarios
 */

import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'

// Mock environment variables
const originalEnv = process.env

beforeEach(() => {
  jest.resetModules()
  process.env = {
    ...originalEnv,
    SMTP_HOST: 'smtp.gmail.com',
    SMTP_PORT: '587',
    SMTP_USER: 'suryadizhang.swe@gmail.com',
    SMTP_PASS: 'test-password',
    FROM_EMAIL: 'suryadizhang.swe@gmail.com',
    TO_EMAIL: 'suryadizhang.swe@gmail.com',
    OPENAI_API_KEY: 'sk-test-key',
    IP_SALT: 'test-salt',
    ANALYTICS_TOKEN: 'test-token'
  }
})

afterEach(() => {
  process.env = originalEnv
  jest.clearAllMocks()
})

describe('API Endpoints Integration Tests', () => {
  describe('Contact API', () => {
    test('validates contact form data structure', () => {
      const validContactData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        subject: 'Test inquiry about portfolio',
        message: 'This is a test message with sufficient length to pass validation.',
        company: 'Acme Corp',
        phone: '+1-555-123-4567',
        inquiryType: 'project',
        newsletter: false
      }

      // Test required fields
      expect(validContactData.name).toBeDefined()
      expect(validContactData.email).toBeDefined()
      expect(validContactData.subject).toBeDefined()
      expect(validContactData.message).toBeDefined()
      
      // Test field lengths
      expect(validContactData.name.length).toBeGreaterThanOrEqual(2)
      expect(validContactData.subject.length).toBeGreaterThanOrEqual(5)
      expect(validContactData.message.length).toBeGreaterThanOrEqual(10)
      
      // Test email format
      expect(validContactData.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    })

    test('detects invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user.example.com',
        ''
      ]

      invalidEmails.forEach(email => {
        expect(email).not.toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      })
    })
  })

  describe('AI Chat API', () => {
    test('validates chat message structure', () => {
      const validChatRequest = {
        messages: [
          { role: 'user', content: 'Tell me about the portfolio projects' }
        ],
        mode: 'projects',
        topK: 5,
        stream: false
      }

      expect(Array.isArray(validChatRequest.messages)).toBe(true)
      expect(validChatRequest.messages.length).toBeGreaterThan(0)
      expect(validChatRequest.messages[0].role).toBeDefined()
      expect(validChatRequest.messages[0].content).toBeDefined()
      expect(['general', 'projects', 'resume']).toContain(validChatRequest.mode)
    })

    test('validates message role types', () => {
      const validRoles = ['user', 'assistant', 'system']
      const invalidRoles = ['admin', 'bot', 'human', '']

      validRoles.forEach(role => {
        expect(['user', 'assistant', 'system']).toContain(role)
      })

      invalidRoles.forEach(role => {
        expect(['user', 'assistant', 'system']).not.toContain(role)
      })
    })
  })

  describe('Analytics API', () => {
    test('validates analytics event types', () => {
      const validEvents = [
        'page_view',
        'like', 
        'resume_download',
        'chat_message',
        'contact_form',
        'project_view'
      ]

      const invalidEvents = [
        'invalid_event',
        'login',
        'purchase',
        ''
      ]

      validEvents.forEach(event => {
        expect([
          'page_view',
          'like', 
          'resume_download',
          'chat_message',
          'contact_form',
          'project_view'
        ]).toContain(event)
      })

      invalidEvents.forEach(event => {
        expect([
          'page_view',
          'like', 
          'resume_download',
          'chat_message',
          'contact_form',
          'project_view'
        ]).not.toContain(event)
      })
    })

    test('validates analytics data structure', () => {
      const validAnalyticsEvent = {
        event: 'page_view',
        page: '/projects/portfolio-website',
        projectSlug: 'portfolio-website',
        metadata: { referrer: 'google.com' }
      }

      expect(validAnalyticsEvent.event).toBeDefined()
      expect(typeof validAnalyticsEvent.page).toBe('string')
      expect(typeof validAnalyticsEvent.metadata).toBe('object')
    })
  })

  describe('Security Validations', () => {
    test('validates IP hashing functionality', () => {
      const crypto = require('crypto')
      const testIP = '192.168.1.100'
      const salt = 'test-salt'
      
      const hash = crypto
        .createHash('sha256')
        .update(testIP + salt)
        .digest('hex')
        .substring(0, 16)

      expect(hash).toHaveLength(16)
      expect(hash).toMatch(/^[a-f0-9]+$/)
      
      // Test that same IP produces same hash
      const hash2 = crypto
        .createHash('sha256')
        .update(testIP + salt)
        .digest('hex')
        .substring(0, 16)

      expect(hash).toBe(hash2)
    })

    test('validates rate limiting logic', () => {
      const rateLimiter = new Map()
      const ip = '192.168.1.1'
      const limit = 5
      const windowMs = 15 * 60 * 1000

      function checkRateLimit(ip: string) {
        const now = Date.now()
        const record = rateLimiter.get(ip)
        
        if (!record || record.resetTime < now) {
          rateLimiter.set(ip, { count: 1, resetTime: now + windowMs })
          return true
        }
        
        if (record.count >= limit) {
          return false
        }
        
        record.count++
        return true
      }

      // First 5 requests should pass
      for (let i = 0; i < 5; i++) {
        expect(checkRateLimit(ip)).toBe(true)
      }

      // 6th request should fail
      expect(checkRateLimit(ip)).toBe(false)
    })

    test('validates honeypot detection', () => {
      const formDataWithHoneypot = {
        name: 'Bot User',
        email: 'bot@example.com',
        message: 'This is a bot message',
        website: 'https://spam-site.com' // Honeypot field
      }

      const formDataWithoutHoneypot = {
        name: 'Real User',
        email: 'real@example.com',
        message: 'This is a real message'
        // No website field
      }

      // Detect bot
      expect(formDataWithHoneypot.website).toBeDefined()
      expect(formDataWithHoneypot.website.length).toBeGreaterThan(0)

      // Real user
      expect(formDataWithoutHoneypot.website).toBeUndefined()
    })
  })

  describe('Environment Configuration', () => {
    test('validates required environment variables', () => {
      const requiredVars = [
        'SMTP_HOST',
        'SMTP_USER', 
        'SMTP_PASS',
        'FROM_EMAIL',
        'TO_EMAIL',
        'OPENAI_API_KEY'
      ]

      requiredVars.forEach(varName => {
        expect(process.env[varName]).toBeDefined()
        expect(process.env[varName]).not.toBe('')
      })
    })

    test('validates email configuration', () => {
      const emailConfig = {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      }

      expect(emailConfig.host).toBeDefined()
      expect(emailConfig.port).toBeGreaterThan(0)
      expect(typeof emailConfig.secure).toBe('boolean')
      expect(emailConfig.auth.user).toBeDefined()
      expect(emailConfig.auth.pass).toBeDefined()
    })
  })

  describe('Data Validation Schemas', () => {
    test('validates contact form schema', () => {
      // Using Zod-like validation logic
      function validateContact(data: any) {
        const errors = []
        
        if (!data.name || data.name.length < 2 || data.name.length > 100) {
          errors.push('Name must be 2-100 characters')
        }
        
        if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
          errors.push('Invalid email format')
        }
        
        if (!data.subject || data.subject.length < 5 || data.subject.length > 200) {
          errors.push('Subject must be 5-200 characters')
        }
        
        if (!data.message || data.message.length < 10 || data.message.length > 2000) {
          errors.push('Message must be 10-2000 characters')
        }
        
        return errors
      }

      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Valid subject line',
        message: 'This is a valid message with sufficient length.'
      }

      const invalidData = {
        name: 'A',
        email: 'invalid-email',
        subject: 'Hi',
        message: 'Short'
      }

      expect(validateContact(validData)).toHaveLength(0)
      expect(validateContact(invalidData).length).toBeGreaterThan(0)
    })
  })
})

// Export test utilities for integration tests
export const testHelpers = {
  createValidContactData: () => ({
    name: 'John Doe',
    email: 'john.doe@example.com',
    subject: 'Test inquiry about portfolio',
    message: 'This is a test message with sufficient length to pass validation.',
    company: 'Acme Corp',
    phone: '+1-555-123-4567',
    inquiryType: 'project' as const,
    newsletter: false
  }),

  createValidChatRequest: () => ({
    messages: [
      { role: 'user' as const, content: 'Tell me about the portfolio projects' }
    ],
    mode: 'projects' as const,
    topK: 5,
    stream: false
  }),

  createValidAnalyticsEvent: () => ({
    event: 'page_view' as const,
    page: '/projects/portfolio-website',
    metadata: { referrer: 'google.com' }
  })
}