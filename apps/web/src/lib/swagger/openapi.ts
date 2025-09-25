/**
 * OpenAPI 3.0 Specification for Portfolio API
 * 
 * This comprehensive API documentation covers all endpoints including:
 * - Contact form with email integration
 * - AI chat with RAG search
 * - Analytics tracking
 * - Resume management
 * - Logging system
 * - Health checks
 */

export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Suryadi Zhang Portfolio API',
    version: '1.0.0',
    description: `
# Portfolio API Documentation

A comprehensive Next.js API powering a professional portfolio website with advanced features:

## Features
- 🤖 **AI-Powered Chat**: OpenAI integration with RAG (Retrieval-Augmented Generation)
- 📧 **Smart Contact System**: Email integration with SMTP/Resend
- 📊 **Analytics Tracking**: Privacy-compliant user analytics
- 📄 **Resume Management**: PDF generation and viewing
- 🔒 **Security**: Rate limiting, input validation, honeypot protection
- 📈 **Monitoring**: Health checks and logging system

## Architecture
- **Frontend**: Next.js 15 with App Router on Vercel
- **Backend**: API routes with dual deployment (Vercel + IONOS VPS)
- **AI**: OpenAI GPT integration with custom RAG system
- **Email**: Gmail SMTP + Resend fallback
- **Security**: Environment-based configuration with secrets management

## Authentication
Most endpoints are public, but some require authentication tokens:
- Analytics summary requires \`ANALYTICS_TOKEN\`
- Admin features require appropriate authorization headers
    `,
    contact: {
      name: 'Suryadi Zhang',
      email: 'suryadizhang.swe@gmail.com',
      url: 'https://myportfolio.mysticdatanode.net'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'https://myportfolio.mysticdatanode.net/api',
      description: 'Production Server (Vercel)'
    },
    {
      url: 'http://108.175.12.154/api',
      description: 'VPS Backend Server (IONOS)'
    },
    {
      url: 'http://localhost:3000/api',
      description: 'Local Development Server'
    }
  ],
  paths: {
    '/contact': {
      post: {
        tags: ['Contact'],
        summary: 'Submit contact form',
        description: `
Submit a contact inquiry through the portfolio contact form.

**Features:**
- Input validation with Zod schemas
- Honeypot protection against bots
- Rate limiting (5 requests per 15 minutes per IP)
- Email delivery via SMTP or Resend
- Privacy-compliant logging with IP hashing
- Support for different inquiry types

**Email Integration:**
- Primary: Gmail SMTP with app password
- Fallback: Resend API for reliability
- Rich HTML email templates with quick action buttons
        `,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'subject', 'message'],
                properties: {
                  name: {
                    type: 'string',
                    minLength: 2,
                    maxLength: 100,
                    description: 'Full name of the contact',
                    example: 'John Doe'
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    description: 'Valid email address',
                    example: 'john.doe@example.com'
                  },
                  subject: {
                    type: 'string',
                    minLength: 5,
                    maxLength: 200,
                    description: 'Email subject line',
                    example: 'Inquiry about web development services'
                  },
                  message: {
                    type: 'string',
                    minLength: 10,
                    maxLength: 2000,
                    description: 'Main message content',
                    example: 'I am interested in discussing a potential project...'
                  },
                  company: {
                    type: 'string',
                    maxLength: 100,
                    description: 'Optional company name',
                    example: 'Acme Corporation'
                  },
                  phone: {
                    type: 'string',
                    maxLength: 20,
                    description: 'Optional phone number',
                    example: '+1-555-123-4567'
                  },
                  inquiryType: {
                    type: 'string',
                    enum: ['job', 'project', 'collaboration', 'general'],
                    default: 'general',
                    description: 'Type of inquiry for better categorization'
                  },
                  newsletter: {
                    type: 'boolean',
                    default: false,
                    description: 'Opt-in for newsletter updates'
                  },
                  website: {
                    type: 'string',
                    maxLength: 0,
                    description: 'Honeypot field - should be empty'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Contact form submitted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { 
                      type: 'string', 
                      example: "Thank you for your message! I'll get back to you soon." 
                    },
                    contactId: { 
                      type: 'string', 
                      format: 'uuid',
                      example: '123e4567-e89b-12d3-a456-426614174000'
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Invalid form data or bot detection',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string', example: 'Invalid form data' },
                    details: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          field: { type: 'string' },
                          message: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          '429': {
            description: 'Rate limit exceeded',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { 
                      type: 'string', 
                      example: 'Too many contact attempts. Please wait before trying again.' 
                    }
                  }
                }
              }
            }
          },
          '500': {
            description: 'Email delivery failed or server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { 
                      type: 'string', 
                      example: 'Failed to send message. Please try again or contact me directly.' 
                    },
                    fallback: { 
                      type: 'string', 
                      example: 'suryadizhang.swe@gmail.com' 
                    }
                  }
                }
              }
            }
          }
        }
      },
      get: {
        tags: ['Contact'],
        summary: 'Contact system health check',
        description: 'Check the status of the contact system including email service configuration.',
        responses: {
          '200': {
            description: 'Contact system status',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'operational' },
                    timestamp: { type: 'string', format: 'date-time' },
                    emailService: {
                      type: 'object',
                      properties: {
                        resend: { type: 'boolean', description: 'Resend API available' },
                        smtp: { type: 'boolean', description: 'SMTP configuration available' }
                      }
                    },
                    configuration: {
                      type: 'object',
                      properties: {
                        fromEmail: { type: 'boolean' },
                        toEmail: { type: 'boolean' },
                        rateLimiting: { type: 'boolean' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/ai/chat': {
      post: {
        tags: ['AI Chat'],
        summary: 'AI-powered chat with RAG',
        description: `
Interactive AI chat system powered by OpenAI with Retrieval-Augmented Generation (RAG).

**Features:**
- OpenAI GPT integration with streaming responses
- RAG search through portfolio content
- Multiple chat modes (general, projects, resume)
- Rate limiting (20 requests per 15 minutes per IP)
- Fallback responses when OpenAI is unavailable
- Context-aware responses based on portfolio data

**RAG System:**
- Searches through projects, resume, and profile content
- Semantic search with configurable result count
- Mode-specific system prompts for better responses
        `,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['messages'],
                properties: {
                  messages: {
                    type: 'array',
                    minItems: 1,
                    maxItems: 20,
                    items: {
                      type: 'object',
                      required: ['role', 'content'],
                      properties: {
                        role: {
                          type: 'string',
                          enum: ['user', 'assistant', 'system'],
                          description: 'Message role in the conversation'
                        },
                        content: {
                          type: 'string',
                          minLength: 1,
                          maxLength: 2000,
                          description: 'Message content'
                        }
                      }
                    },
                    example: [
                      {
                        role: 'user',
                        content: 'Tell me about Suryadi\'s experience with React and Next.js'
                      }
                    ]
                  },
                  mode: {
                    type: 'string',
                    enum: ['general', 'projects', 'resume'],
                    default: 'general',
                    description: 'Chat mode affecting response style and RAG search focus'
                  },
                  topK: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 10,
                    default: 5,
                    description: 'Number of top results to retrieve from RAG search'
                  },
                  stream: {
                    type: 'boolean',
                    default: true,
                    description: 'Enable streaming responses (Server-Sent Events)'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Successful chat response',
            content: {
              'text/event-stream': {
                schema: {
                  type: 'string',
                  description: 'Server-Sent Events stream with AI response chunks'
                },
                example: 'data: {"content": "Based on Suryadi\'s portfolio, he has extensive experience..."}\n\ndata: [DONE]\n\n'
              },
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    response: { 
                      type: 'string', 
                      description: 'Complete AI response (non-streaming mode)' 
                    },
                    context: { 
                      type: 'string', 
                      description: 'RAG context used for response generation' 
                    },
                    sources: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          title: { type: 'string' },
                          type: { type: 'string' },
                          score: { type: 'number' }
                        }
                      }
                    },
                    searchTime: { 
                      type: 'number', 
                      description: 'RAG search time in milliseconds' 
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Invalid request format',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string', example: 'Invalid request format' },
                    details: { type: 'array' }
                  }
                }
              }
            }
          },
          '429': {
            description: 'Rate limit exceeded',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { 
                      type: 'string', 
                      example: 'Rate limit exceeded. Please try again later.' 
                    }
                  }
                }
              }
            }
          }
        }
      },
      get: {
        tags: ['AI Chat'],
        summary: 'AI chat system health check',
        description: 'Check the status of the AI chat system including RAG index and OpenAI configuration.',
        responses: {
          '200': {
            description: 'AI chat system status',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'healthy' },
                    timestamp: { type: 'string', format: 'date-time' },
                    ragIndex: {
                      type: 'object',
                      properties: {
                        available: { type: 'boolean' },
                        totalChunks: { type: 'integer' }
                      }
                    },
                    openai: {
                      type: 'object',
                      properties: {
                        configured: { type: 'boolean' }
                      }
                    }
                  }
                }
              }
            }
          },
          '503': {
            description: 'RAG system unavailable',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'unhealthy' },
                    error: { type: 'string', example: 'RAG system not available' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/analytics': {
      post: {
        tags: ['Analytics'],
        summary: 'Track user events',
        description: `
Privacy-compliant analytics system for tracking user interactions.

**Features:**
- Multiple event types (page views, interactions, downloads)
- Session-based tracking with 30-minute expiry
- IP hashing for privacy compliance
- JSONL storage for efficient logging
- Real-time event processing

**Privacy:**
- IP addresses are hashed with salt
- No personally identifiable information stored
- Session-based tracking only
        `,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['event'],
                properties: {
                  event: {
                    type: 'string',
                    enum: ['page_view', 'like', 'resume_download', 'chat_message', 'contact_form', 'project_view'],
                    description: 'Type of event to track'
                  },
                  page: {
                    type: 'string',
                    description: 'Page URL or identifier',
                    example: '/projects/portfolio-website'
                  },
                  projectSlug: {
                    type: 'string',
                    description: 'Project slug for project-related events',
                    example: 'portfolio-website'
                  },
                  chatMode: {
                    type: 'string',
                    enum: ['general', 'projects', 'resume'],
                    description: 'Chat mode for chat-related events'
                  },
                  metadata: {
                    type: 'object',
                    description: 'Additional event metadata',
                    additionalProperties: true
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Event tracked successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    sessionId: { 
                      type: 'string', 
                      description: 'Session ID for tracking user journey' 
                    }
                  }
                }
              }
            },
            headers: {
              'Set-Cookie': {
                description: 'Analytics session cookie',
                schema: {
                  type: 'string',
                  example: 'analytics_session=uuid; HttpOnly; SameSite=Lax; Max-Age=1800'
                }
              }
            }
          },
          '400': {
            description: 'Invalid event data',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string', example: 'Invalid event data' },
                    details: { type: 'array' }
                  }
                }
              }
            }
          }
        }
      },
      get: {
        tags: ['Analytics'],
        summary: 'Get analytics summary',
        description: 'Retrieve analytics summary and metrics. Requires authentication.',
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          '200': {
            description: 'Analytics summary',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    summary: {
                      type: 'object',
                      properties: {
                        totalEvents: { type: 'integer' },
                        pageViews: { type: 'integer' },
                        uniqueSessions: { type: 'integer' },
                        resumeDownloads: { type: 'integer' },
                        chatMessages: { type: 'integer' },
                        contactForms: { type: 'integer' }
                      }
                    },
                    topPages: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          page: { type: 'string' },
                          count: { type: 'integer' }
                        }
                      }
                    },
                    recentActivity: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          event: { type: 'string' },
                          page: { type: 'string' },
                          timestamp: { type: 'string', format: 'date-time' },
                          sessionId: { type: 'string' }
                        }
                      }
                    },
                    last30Days: { type: 'integer' }
                  }
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized - invalid or missing analytics token',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string', example: 'Unauthorized' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/resume/view': {
      get: {
        tags: ['Resume'],
        summary: 'View resume as PDF',
        description: 'Stream resume PDF for viewing in browser with proper content headers.',
        responses: {
          '200': {
            description: 'Resume PDF content',
            content: {
              'application/pdf': {
                schema: {
                  type: 'string',
                  format: 'binary'
                }
              }
            },
            headers: {
              'Content-Type': {
                schema: { type: 'string', example: 'application/pdf' }
              },
              'Content-Disposition': {
                schema: { type: 'string', example: 'inline; filename="Suryadi_Zhang_Resume.pdf"' }
              }
            }
          },
          '404': {
            description: 'Resume file not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string', example: 'Resume not found' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/resume/download': {
      get: {
        tags: ['Resume'],
        summary: 'Download resume PDF',
        description: 'Download resume PDF with tracking analytics event.',
        responses: {
          '200': {
            description: 'Resume PDF download',
            content: {
              'application/pdf': {
                schema: {
                  type: 'string',
                  format: 'binary'
                }
              }
            },
            headers: {
              'Content-Type': {
                schema: { type: 'string', example: 'application/pdf' }
              },
              'Content-Disposition': {
                schema: { type: 'string', example: 'attachment; filename="Suryadi_Zhang_Resume.pdf"' }
              }
            }
          },
          '404': {
            description: 'Resume file not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string', example: 'Resume not found' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/logs': {
      get: {
        tags: ['Logging'],
        summary: 'Get system logs',
        description: 'Retrieve system logs with optional filtering and pagination.',
        parameters: [
          {
            name: 'type',
            in: 'query',
            schema: { type: 'string', enum: ['contact', 'analytics', 'error', 'all'] },
            description: 'Filter logs by type'
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 1000, default: 100 },
            description: 'Number of log entries to return'
          },
          {
            name: 'offset',
            in: 'query',
            schema: { type: 'integer', minimum: 0, default: 0 },
            description: 'Number of log entries to skip'
          }
        ],
        responses: {
          '200': {
            description: 'System logs',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    logs: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          timestamp: { type: 'string', format: 'date-time' },
                          level: { type: 'string', enum: ['info', 'warn', 'error'] },
                          message: { type: 'string' },
                          type: { type: 'string' },
                          metadata: { type: 'object' }
                        }
                      }
                    },
                    total: { type: 'integer' },
                    hasMore: { type: 'boolean' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/chat': {
      post: {
        tags: ['Legacy Chat'],
        summary: 'Legacy chat endpoint',
        description: 'Legacy chat endpoint - redirects to /ai/chat for backwards compatibility.',
        deprecated: true,
        responses: {
          '301': {
            description: 'Redirect to new AI chat endpoint',
            headers: {
              'Location': {
                schema: { type: 'string', example: '/api/ai/chat' }
              }
            }
          }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Analytics token for accessing protected endpoints'
      }
    },
    schemas: {
      Error: {
        type: 'object',
        required: ['error'],
        properties: {
          error: {
            type: 'string',
            description: 'Error message'
          },
          details: {
            type: 'array',
            description: 'Additional error details',
            items: {
              type: 'object'
            }
          }
        }
      },
      HealthCheck: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['healthy', 'unhealthy', 'operational'],
            description: 'Service health status'
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            description: 'Health check timestamp'
          },
          services: {
            type: 'object',
            description: 'Status of dependent services',
            additionalProperties: {
              type: 'boolean'
            }
          }
        }
      }
    }
  },
  tags: [
    {
      name: 'Contact',
      description: 'Contact form submission and email integration'
    },
    {
      name: 'AI Chat', 
      description: 'AI-powered chat with RAG search capabilities'
    },
    {
      name: 'Analytics',
      description: 'Privacy-compliant user analytics and tracking'
    },
    {
      name: 'Resume',
      description: 'Resume viewing and download functionality'
    },
    {
      name: 'Logging',
      description: 'System logging and monitoring'
    },
    {
      name: 'Legacy Chat',
      description: 'Deprecated endpoints for backwards compatibility'
    }
  ]
}