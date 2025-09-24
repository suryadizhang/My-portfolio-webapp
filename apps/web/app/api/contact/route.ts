import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import fs from 'fs/promises'
import path from 'path'

/**
 * Escape HTML to prevent XSS attacks in email templates
 */
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Request validation schema
const ContactRequestSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200, 'Subject too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message too long'),
  company: z.string().max(100, 'Company name too long').optional(),
  phone: z.string().max(20, 'Phone number too long').optional(),
  inquiryType: z.enum(['job', 'project', 'collaboration', 'general']).default('general'),
  newsletter: z.boolean().default(false),
  // Simple honeypot field to catch bots
  website: z.string().max(0, 'Bot detected').optional()
})

// Contact log entry interface
interface ContactLog {
  id: string
  timestamp: string
  name: string
  email: string
  subject: string
  inquiryType: string
  company?: string
  ipHash: string
  userAgent: string
  sent: boolean
  error?: string
}

/**
 * Initialize email service (Resend or Nodemailer fallback)
 */
function getEmailService() {
  const resendApiKey = process.env.RESEND_API_KEY
  
  if (resendApiKey) {
    return new Resend(resendApiKey)
  }
  
  // Fallback to nodemailer
  const smtpConfig = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  }
  
  return nodemailer.createTransport(smtpConfig)
}

/**
 * Hash IP address for privacy-compliant logging
 */
function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip + process.env.IP_SALT || 'default_salt').digest('hex').substring(0, 16)
}

/**
 * Log contact attempt for analytics
 */
async function logContact(contact: ContactLog): Promise<void> {
  try {
    const logsDir = path.join(process.cwd(), 'apps', 'web', 'data', 'logs')
    const logFile = path.join(logsDir, 'contacts.jsonl')
    
    // Ensure logs directory exists
    await fs.mkdir(logsDir, { recursive: true })
    
    // Append to JSONL file
    await fs.appendFile(logFile, JSON.stringify(contact) + '\n')
  } catch (error) {
    console.error('Failed to log contact:', error)
  }
}

/**
 * Send email via Resend
 */
async function sendEmailWithResend(resend: any, contactData: any): Promise<{ success: boolean; error?: string }> {
  try {
    const emailContent = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">New Contact Inquiry</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">From your portfolio website</p>
  </div>
  
  <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
    <div style="margin-bottom: 30px;">
      <h2 style="color: #333; margin: 0 0 20px 0; font-size: 20px;">Contact Details</h2>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
        <p style="margin: 0 0 12px 0;"><strong>Name:</strong> ${escapeHtml(contactData.name)}</p>
        <p style="margin: 0 0 12px 0;"><strong>Email:</strong> <a href="mailto:${encodeURIComponent(contactData.email)}" style="color: #667eea; text-decoration: none;">${escapeHtml(contactData.email)}</a></p>
        ${contactData.company ? `<p style="margin: 0 0 12px 0;"><strong>Company:</strong> ${escapeHtml(contactData.company)}</p>` : ''}
        ${contactData.phone ? `<p style="margin: 0 0 12px 0;"><strong>Phone:</strong> ${escapeHtml(contactData.phone)}</p>` : ''}
        <p style="margin: 0;"><strong>Inquiry Type:</strong> <span style="background: #e3f2fd; padding: 4px 8px; border-radius: 4px; font-size: 14px;">${escapeHtml(contactData.inquiryType)}</span></p>
      </div>
    </div>
    
    <div style="margin-bottom: 30px;">
      <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">Subject</h3>
      <p style="background: #f1f3f4; padding: 15px; border-radius: 6px; margin: 0; font-weight: 500; color: #444;">${escapeHtml(contactData.subject)}</p>
    </div>
    
    <div style="margin-bottom: 30px;">
      <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">Message</h3>
      <div style="background: #fafafa; padding: 20px; border-radius: 6px; border: 1px solid #e0e0e0;">
        <p style="margin: 0; line-height: 1.6; color: #555; white-space: pre-wrap;">${escapeHtml(contactData.message)}</p>
      </div>
    </div>
    
    <div style="background: #e8f5e8; padding: 20px; border-radius: 6px; text-align: center;">
      <p style="margin: 0 0 15px 0; color: #2e7d32; font-weight: 500;">📧 Quick Actions</p>
      <a href="mailto:${contactData.email}?subject=Re: ${encodeURIComponent(contactData.subject)}" 
         style="background: #4caf50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 0 8px; font-weight: 500;">
        Reply via Email
      </a>
      ${contactData.company ? `<a href="https://www.google.com/search?q=${encodeURIComponent(contactData.company)}" target="_blank" 
         style="background: #2196f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 0 8px; font-weight: 500;">
        Research Company
      </a>` : ''}
    </div>
  </div>
  
  <div style="text-align: center; margin-top: 20px; padding: 20px; color: #666; font-size: 14px;">
    <p style="margin: 0;">Sent from <strong>myportfolio.mysticdatanode.net</strong> • ${new Date().toLocaleString()}</p>
  </div>
</div>
    `.trim()

    await resend.emails.send({
      from: process.env.FROM_EMAIL || 'portfolio@myportfolio.mysticdatanode.net',
      to: process.env.TO_EMAIL || 'suryadizhang.swe@gmail.com',
      subject: `Portfolio Contact: ${escapeHtml(contactData.subject)} (from ${escapeHtml(contactData.name)})`,
      html: emailContent,
      reply_to: contactData.email,
      tags: [
        { name: 'source', value: 'portfolio' },
        { name: 'inquiry_type', value: contactData.inquiryType },
      ]
    })
    
    return { success: true }
  } catch (error: any) {
    console.error('Resend email error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Send email via Nodemailer
 */
async function sendEmailWithNodemailer(transporter: any, contactData: any): Promise<{ success: boolean; error?: string }> {
  try {
    const textContent = `
New Contact Inquiry from Portfolio

Name: ${contactData.name}
Email: ${contactData.email}
${contactData.company ? `Company: ${contactData.company}` : ''}
${contactData.phone ? `Phone: ${contactData.phone}` : ''}
Inquiry Type: ${contactData.inquiryType}

Subject: ${contactData.subject}

Message:
${contactData.message}

---
Sent from portfolio website at ${new Date().toLocaleString()}
    `.trim()

    await transporter.sendMail({
      from: process.env.FROM_EMAIL || '"Portfolio Contact" <noreply@example.com>',
      to: process.env.TO_EMAIL || 'suryadizhang.swe@gmail.com',
      subject: `Portfolio Contact: ${contactData.subject} (from ${contactData.name})`,
      text: textContent,
      replyTo: contactData.email,
    })
    
    return { success: true }
  } catch (error: any) {
    console.error('Nodemailer error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Send automated thank you email to the user
 */
async function sendThankYouEmail(emailService: any, contactData: any): Promise<{ success: boolean; error?: string }> {
  const thankYouTemplate = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Thank You for Reaching Out!</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Your message has been received</p>
  </div>
  
  <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
    <div style="margin-bottom: 30px;">
      <p style="font-size: 18px; color: #333; margin: 0 0 20px 0;">Hi ${escapeHtml(contactData.name)},</p>
      <p style="color: #555; line-height: 1.6; margin: 0 0 20px 0;">
        Thank you for contacting me through my portfolio! I've received your message about <strong>"${escapeHtml(contactData.subject)}"</strong> 
        and I truly appreciate you taking the time to reach out.
      </p>
      <p style="color: #555; line-height: 1.6; margin: 0 0 20px 0;">
        I review all messages personally and will get back to you within 24-48 hours. In the meantime, feel free to:
      </p>
    </div>
    
    <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
      <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">🔗 Connect with me:</h3>
      <div style="margin-bottom: 15px;">
        <a href="https://linkedin.com/in/suryadi-zhang" style="color: #0077b5; text-decoration: none; font-weight: 500; display: inline-block; margin-right: 20px;">
          📱 LinkedIn Profile
        </a>
        <a href="https://github.com/suryadizhang" style="color: #333; text-decoration: none; font-weight: 500; display: inline-block;">
          💻 GitHub Profile
        </a>
      </div>
      <div>
        <a href="https://myportfolio.mysticdatanode.net/projects" style="color: #4f46e5; text-decoration: none; font-weight: 500; display: inline-block; margin-right: 20px;">
          🚀 View My Projects
        </a>
        <a href="https://myportfolio.mysticdatanode.net/about" style="color: #4f46e5; text-decoration: none; font-weight: 500; display: inline-block;">
          👨‍💻 Learn More About Me
        </a>
      </div>
    </div>
    
    <div style="background: #e0f2fe; padding: 20px; border-radius: 8px; border-left: 4px solid #0277bd;">
      <p style="margin: 0 0 10px 0; color: #01579b; font-weight: 500;">📧 Your Message Summary:</p>
      <p style="margin: 0 0 8px 0; color: #0277bd;"><strong>Subject:</strong> ${escapeHtml(contactData.subject)}</p>
      <p style="margin: 0 0 8px 0; color: #0277bd;"><strong>Inquiry Type:</strong> ${escapeHtml(contactData.inquiryType)}</p>
      <p style="margin: 0; color: #0277bd;"><strong>Submitted:</strong> ${escapeHtml(new Date().toLocaleString())}</p>
    </div>
  </div>
  
  <div style="text-align: center; margin-top: 20px; padding: 20px; color: #666; font-size: 14px;">
    <p style="margin: 0 0 10px 0;">Best regards,</p>
    <p style="margin: 0 0 10px 0; font-weight: 600; color: #333;">Suryadi Zhang</p>
    <p style="margin: 0 0 5px 0;">Full-Stack Software Engineer</p>
    <p style="margin: 0;">📧 <a href="mailto:suryadizhang.swe@gmail.com" style="color: #4f46e5; text-decoration: none;">suryadizhang.swe@gmail.com</a></p>
  </div>
</div>
  `.trim()

  const textContent = `
Hi ${contactData.name},

Thank you for contacting me through my portfolio! I've received your message about "${contactData.subject}" and I truly appreciate you taking the time to reach out.

I review all messages personally and will get back to you within 24-48 hours.

Your Message Summary:
- Subject: ${contactData.subject}
- Inquiry Type: ${contactData.inquiryType}
- Submitted: ${new Date().toLocaleString()}

In the meantime, feel free to connect with me:
- LinkedIn: https://linkedin.com/in/suryadi-zhang
- GitHub: https://github.com/suryadizhang
- Portfolio: https://myportfolio.mysticdatanode.net

Best regards,
Suryadi Zhang
Full-Stack Software Engineer
suryadizhang.swe@gmail.com
  `.trim()

  try {
    if (emailService instanceof Resend) {
      await emailService.emails.send({
        from: process.env.FROM_EMAIL || 'Suryadi Zhang <portfolio@myportfolio.mysticdatanode.net>',
        to: contactData.email,
        subject: `Thank you for reaching out, ${escapeHtml(contactData.name)}!`,
        html: thankYouTemplate,
        text: textContent,
        tags: [
          { name: 'type', value: 'thank_you' },
          { name: 'inquiry_type', value: contactData.inquiryType },
        ]
      })
    } else {
      // Nodemailer
      await emailService.sendMail({
        from: process.env.FROM_EMAIL || '"Suryadi Zhang" <suryadizhang.swe@gmail.com>',
        to: contactData.email,
        subject: `Thank you for reaching out, ${escapeHtml(contactData.name)}!`,
        html: thankYouTemplate,
        text: textContent,
      })
    }
    
    return { success: true }
  } catch (error: any) {
    console.error('Thank you email error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Rate limiting for contact form
 */
const contactRateLimit = new Map<string, { count: number; resetTime: number }>()

function checkContactRateLimit(ip: string, limit: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
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

export async function POST(request: NextRequest) {
  try {
    // Get client info
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    // Check rate limit
    if (!checkContactRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many contact attempts. Please wait before trying again.' },
        { status: 429 }
      )
    }
    
    // Parse and validate request
    const body = await request.json()
    const contactData = ContactRequestSchema.parse(body)
    
    // Check honeypot
    if (contactData.website && contactData.website.length > 0) {
      return NextResponse.json(
        { error: 'Invalid submission detected' },
        { status: 400 }
      )
    }
    
    // Generate contact ID
    const contactId = crypto.randomUUID()
    
    // Initialize email service
    const emailService = getEmailService()
    let emailResult: { success: boolean; error?: string }
    
    // Send email
    if (emailService instanceof Resend) {
      emailResult = await sendEmailWithResend(emailService, contactData)
    } else {
      emailResult = await sendEmailWithNodemailer(emailService, contactData)
    }
    
    // Log the contact attempt
    const contactLog: ContactLog = {
      id: contactId,
      timestamp: new Date().toISOString(),
      name: contactData.name,
      email: contactData.email,
      subject: contactData.subject,
      inquiryType: contactData.inquiryType,
      company: contactData.company,
      ipHash: hashIP(ip),
      userAgent,
      sent: emailResult.success,
      error: emailResult.error
    }
    
    await logContact(contactLog)
    
    if (emailResult.success) {
      // Send automated thank you email to the user
      let thankYouResult: { success: boolean; error?: string } = { success: false }
      
      try {
        thankYouResult = await sendThankYouEmail(emailService, contactData)
        console.log('Thank you email result:', thankYouResult.success ? 'sent' : `failed - ${thankYouResult.error}`)
      } catch (error) {
        console.error('Thank you email error:', error)
      }
      
      return NextResponse.json({
        success: true,
        message: 'Thank you for your message! I\'ll get back to you soon. A confirmation email has been sent to your inbox.',
        contactId,
        thankYouEmailSent: thankYouResult.success
      })
    } else {
      // Still log as attempt even if email failed
      return NextResponse.json(
        { 
          error: 'Failed to send message. Please try again or contact me directly.',
          fallback: 'suryadizhang.swe@gmail.com'
        },
        { status: 500 }
      )
    }
    
  } catch (error) {
    console.error('Contact API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error. Please try again or contact me directly.' },
      { status: 500 }
    )
  }
}

// Health check and configuration endpoint
export async function GET() {
  return NextResponse.json({
    status: 'operational',
    timestamp: new Date().toISOString(),
    emailService: {
      resend: !!process.env.RESEND_API_KEY,
      smtp: !!(process.env.SMTP_HOST && process.env.SMTP_USER)
    },
    configuration: {
      fromEmail: !!process.env.FROM_EMAIL,
      toEmail: !!process.env.TO_EMAIL,
      rateLimiting: true
    }
  })
}