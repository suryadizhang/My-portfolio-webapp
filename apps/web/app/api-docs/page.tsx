import SwaggerUI from '@/components/swagger/SwaggerUI'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'API Documentation | Suryadi Zhang Portfolio',
  description: 'Interactive API documentation for portfolio website featuring AI chat, contact system, analytics, and more.',
  keywords: 'API, documentation, Swagger, OpenAPI, Next.js, AI chat, contact form, analytics',
  openGraph: {
    title: 'Portfolio API Documentation',
    description: 'Interactive API documentation with AI-powered chat, contact system, and analytics tracking.',
    type: 'website',
  }
}

export default function APIDocsPage() {
  return <SwaggerUI />
}