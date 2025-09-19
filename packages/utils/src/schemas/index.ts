import { z } from 'zod'

// Contact form validation schema
export const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required').max(100),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
})

export type ContactFormData = z.infer<typeof contactSchema>

// Guestbook entry validation schema
export const guestbookEntrySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  email: z.string().email('Invalid email address').optional(),
  message: z.string().min(1, 'Message is required').max(500),
  website: z.string().url('Invalid website URL').optional(),
})

export type GuestbookEntryData = z.infer<typeof guestbookEntrySchema>

export interface GuestbookEntry extends GuestbookEntryData {
  id: string
  timestamp: number
  approved: boolean
}

// Analytics event validation schema
export const analyticsEventSchema = z.object({
  event: z.enum(['page_view', 'project_click', 'contact_form_view', 'resume_download']),
  page: z.string().max(200),
  data: z.record(z.any()).optional(),
  timestamp: z.number().optional(),
})

export type AnalyticsEventData = z.infer<typeof analyticsEventSchema>

export interface AnalyticsEvent extends AnalyticsEventData {
  id: string
  timestamp: number
  visitor: {
    ip: string
    userAgent: string
    referer: string
  }
}

// User authentication schemas
export const userLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const userRegisterSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type UserLoginData = z.infer<typeof userLoginSchema>
export type UserRegisterData = z.infer<typeof userRegisterSchema>

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  createdAt: number
  lastLoginAt?: number
}

// API response schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.any().optional(),
  error: z.string().optional(),
})

export type ApiResponse<T = any> = {
  success: boolean
  message?: string
  data?: T
  error?: string
}