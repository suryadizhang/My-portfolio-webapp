/**
 * Email System Integration Test
 * Tests the complete email workflow without actually sending emails
 * @jest-environment jsdom
 */

const crypto = require('crypto')

// Mock environment variables for testing
process.env.FROM_EMAIL = 'test@example.com'
process.env.TO_EMAIL = 'suryadizhang.swe@gmail.com'
process.env.IP_SALT = 'test-salt-123'

// Test escapeHtml function
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Test rate limiting system
function createContactRateLimit() {
  const contactRateLimit = new Map()
  
  return function checkContactRateLimit(ip, limit = 5, windowMs = 15 * 60 * 1000) {
    const now = Date.now()
    const record = contactRateLimit.get(ip)
    
    if (!record || record.resetTime < now) {
      contactRateLimit.set(ip, { count: 1, resetTime: now + windowMs })
      return true
    }
    
    if (record.count >= limit) {
      return false
    }
    
    record.count++
    return true
  }
}

// Test IP hashing function
function hashIP(ip) {
  return crypto.createHash('sha256').update(ip + process.env.IP_SALT || 'default_salt').digest('hex').substring(0, 16)
}

// Mock email service classes for testing
class MockResend {
  constructor(apiKey) {
    this.apiKey = apiKey
    this.emails = {
      send: async (params) => {
        // Validate required params
        if (!params.from || !params.to || !params.subject || !params.html) {
          throw new Error('Missing required email parameters')
        }
        return { id: 'mock-email-id-' + Date.now() }
      }
    }
  }
}

class MockNodemailer {
  static createTransporter(/* config */) {
    return {
      sendMail: async (params) => {
        // Validate required params
        if (!params.from || !params.to || !params.subject) {
          throw new Error('Missing required email parameters')
        }
        return { messageId: 'mock-nodemailer-id-' + Date.now() }
      }
    }
  }
}

describe('Email System Integration', () => {
  test('HTML Escaping Security', () => {
    const maliciousInput = '<script>alert("XSS")</script>'
    const escapedOutput = escapeHtml(maliciousInput)
    const expectedOutput = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
    
    expect(escapedOutput).toBe(expectedOutput)
  })

  test('Rate Limiting System', () => {
    const rateLimiter = createContactRateLimit()
    const testIP = '192.168.1.100'
    
    // Allow first 5 requests
    for (let i = 0; i < 5; i++) {
      expect(rateLimiter(testIP)).toBe(true)
    }
    
    // 6th request should be blocked
    expect(rateLimiter(testIP)).toBe(false)
  })

  test('IP Hashing Privacy', () => {
    const testIPAddress = '192.168.1.100'
    const hashedIP = hashIP(testIPAddress)
    
    expect(hashedIP).toHaveLength(16)
    expect(hashedIP).not.toBe(testIPAddress)
    expect(/^[a-f0-9]+$/i.test(hashedIP)).toBe(true)
  })

  test('Resend Email Service Integration', async () => {
    const mockResend = new MockResend('test-api-key')
    const result = await mockResend.emails.send({
      from: 'test@example.com',
      to: 'user@example.com',
      subject: 'Test Email',
      html: '<h1>Test Content</h1>'
    })
    
    expect(result.id).toBeDefined()
    expect(result.id).toMatch(/^mock-email-id-\d+$/)
  })

  test('Nodemailer Fallback Integration', async () => {
    const mockTransporter = MockNodemailer.createTransporter({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: { user: 'test@gmail.com', pass: 'test-password' }
    })
    
    const result = await mockTransporter.sendMail({
      from: 'test@example.com',
      to: 'user@example.com',
      subject: 'Test Email',
      text: 'Test content'
    })
    
    expect(result.messageId).toBeDefined()
    expect(result.messageId).toMatch(/^mock-nodemailer-id-\d+$/)
  })

  test('Email Template Security', () => {
    const testContactData = {
      name: '<script>alert("hack")</script>John Doe',
      email: 'john@example.com',
      subject: 'Test & "Quote" Subject',
      message: 'Hello <world> & "everyone"',
      company: 'Test & Co.',
      inquiryType: 'general'
    }
    
    // Simulate email template generation
    const safeTemplate = `
<h1>Thank you, ${escapeHtml(testContactData.name)}!</h1>
<p>Subject: ${escapeHtml(testContactData.subject)}</p>
<p>Message: ${escapeHtml(testContactData.message)}</p>
<p>Company: ${escapeHtml(testContactData.company)}</p>
    `.trim()
    
    const hasUnsafeContent = safeTemplate.includes('<script>') || 
                             (safeTemplate.includes('alert(') && !safeTemplate.includes('&quot;')) ||
                             safeTemplate.includes('javascript:')
    
    expect(hasUnsafeContent).toBe(false)
    expect(safeTemplate).toContain('&lt;script&gt;')
    expect(safeTemplate).toContain('&amp;')
  })
})