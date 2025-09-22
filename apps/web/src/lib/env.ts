// Environment validation and configuration
import { z } from 'zod'

// Define the schema for environment variables
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SITE_NAME: z.string().default('Suryadi Zhang'),
  
  // Database
  DATABASE_URL: z.string().optional(),
  
  // AI/LLM APIs
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  
  // Analytics
  VERCEL_ANALYTICS_ID: z.string().optional(),
  GOOGLE_ANALYTICS_ID: z.string().optional(),
  
  // Communication
  RESEND_API_KEY: z.string().optional(),
  CONTACT_EMAIL: z.string().email().optional(),
  
  // Auth
  NEXTAUTH_SECRET: z.string().optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  
  // Rate Limiting
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  
  // Monitoring
  SENTRY_DSN: z.string().optional(),
  
  // Search
  PINECONE_API_KEY: z.string().optional(),
  PINECONE_ENVIRONMENT: z.string().optional(),
  PINECONE_INDEX_NAME: z.string().optional(),
})

// Validate and export environment variables
const env = envSchema.safeParse(process.env)

if (!env.success) {
  console.error('❌ Invalid environment variables:')
  console.error(env.error.flatten().fieldErrors)
  throw new Error('Invalid environment variables')
}

export { env }
export const isProduction = env.data?.NODE_ENV === 'production'
export const isDevelopment = env.data?.NODE_ENV === 'development'
export const isTest = env.data?.NODE_ENV === 'test'

// Helper function to get site URL with fallback
export function getSiteURL(): string {
  if (env.data?.NEXT_PUBLIC_SITE_URL) {
    return env.data.NEXT_PUBLIC_SITE_URL
  }
  
  if (isProduction) {
    return 'https://suryadizhang.dev'
  }
  
  return 'http://localhost:3000'
}