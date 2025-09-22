/**
 * Environment variable validation utility
 * Ensures all required environment variables are present at startup
 */

interface EnvConfig {
  // Required for all environments
  NEXT_PUBLIC_SITE_URL: string;
  NEXT_PUBLIC_API_BASE_URL: string;
  NODE_ENV: string;

  // Required for AI chat functionality
  OPENAI_API_KEY: string;
  OPENAI_BASE_URL?: string;

  // Required for contact form (choose one)
  RESEND_API_KEY?: string;
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_USER?: string;
  SMTP_PASS?: string;

  // Required for contact form
  CONTACT_EMAIL: string;

  // Optional features
  NEXT_PUBLIC_GOOGLE_ANALYTICS?: string;
  NEXT_PUBLIC_VERCEL_ANALYTICS_ID?: string;
  KV_REST_API_URL?: string;
  KV_REST_API_TOKEN?: string;
  ALLOWED_ORIGINS?: string;
  RESUME_SIGNING_SECRET?: string;
  RESUME_UPDATED_AT?: string;
}

class EnvironmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvironmentError';
  }
}

function validateRequiredEnv(): EnvConfig {
  const env = process.env as any;
  
  // Required variables
  const required = [
    'NEXT_PUBLIC_SITE_URL',
    'NEXT_PUBLIC_API_BASE_URL',
    'NODE_ENV',
    'OPENAI_API_KEY',
    'CONTACT_EMAIL'
  ];

  // Check for missing required variables
  const missing = required.filter(key => !env[key] || env[key].trim() === '');
  
  if (missing.length > 0) {
    throw new EnvironmentError(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file or deployment environment variables.'
    );
  }

  // Validate email service (either Resend or SMTP)
  const hasResend = env.RESEND_API_KEY && env.RESEND_API_KEY.trim() !== '';
  const hasSmtp = env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS;

  if (!hasResend && !hasSmtp) {
    throw new EnvironmentError(
      'Email service not configured. Please set either:\n' +
      '- RESEND_API_KEY (recommended), or\n' +
      '- SMTP_HOST, SMTP_USER, and SMTP_PASS'
    );
  }

  // Validate URL formats
  try {
    new URL(env.NEXT_PUBLIC_SITE_URL);
    new URL(env.NEXT_PUBLIC_API_BASE_URL);
  } catch (error) {
    throw new EnvironmentError(
      'Invalid URL format in NEXT_PUBLIC_SITE_URL or NEXT_PUBLIC_API_BASE_URL'
    );
  }

  // Validate OpenAI API key format
  if (!env.OPENAI_API_KEY.startsWith('sk-')) {
    console.warn(
      'Warning: OPENAI_API_KEY does not start with "sk-". ' +
      'Please verify this is a valid OpenAI API key.'
    );
  }

  return env as EnvConfig;
}

function logEnvironmentStatus() {
  const env = process.env;
  const isProduction = env.NODE_ENV === 'production';
  
  console.log(`🌍 Environment: ${env.NODE_ENV}`);
  console.log(`🔗 Site URL: ${env.NEXT_PUBLIC_SITE_URL}`);
  console.log(`📧 Contact Email: ${env.CONTACT_EMAIL}`);
  
  // Email service status
  if (env.RESEND_API_KEY) {
    console.log('📮 Email Service: Resend');
  } else if (env.SMTP_HOST) {
    console.log(`📮 Email Service: SMTP (${env.SMTP_HOST})`);
  }

  // Optional features
  const features = [];
  if (env.NEXT_PUBLIC_GOOGLE_ANALYTICS) features.push('Google Analytics');
  if (env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID) features.push('Vercel Analytics');
  if (env.KV_REST_API_URL) features.push('KV Storage');
  
  if (features.length > 0) {
    console.log(`✨ Optional Features: ${features.join(', ')}`);
  }

  // Development warnings
  if (!isProduction) {
    console.log('⚠️  Development mode - some features may be limited');
  }
}

// Export the validated environment
let envConfig: EnvConfig | undefined;

try {
  envConfig = validateRequiredEnv();
  if (process.env.NODE_ENV !== 'test') {
    logEnvironmentStatus();
  }
} catch (error) {
  if (error instanceof EnvironmentError) {
    console.error('❌ Environment Configuration Error:');
    console.error(error.message);
    console.error('\nPlease check the ENVIRONMENT_SECURITY.md file for setup instructions.');
    
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  } else {
    throw error;
  }
}

// Provide fallback for development/testing
export default envConfig || ({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  NODE_ENV: process.env.NODE_ENV || 'development',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  CONTACT_EMAIL: process.env.CONTACT_EMAIL || ''
} as EnvConfig);