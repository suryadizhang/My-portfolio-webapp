# Environment Security Guide

This document outlines the proper management of environment variables for secure production deployment.

## Environment Files Overview

- `.env.example` - Template with all possible variables (commit to git)
- `.env.production` - Production template without secrets (commit to git) 
- `.env.local` - Local development with real values (NEVER commit)
- `.env` - Not used (NEVER commit)

## Security Principles

1. **Never commit actual secrets to version control**
2. **Use platform environment variables for production**
3. **Rotate secrets regularly**
4. **Use least privilege principle**
5. **Monitor for leaked secrets**

## Required Environment Variables

### Essential for Core Functionality

```bash
# OpenAI API Key (Required for AI Chat)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Email Service (Choose Resend OR SMTP)
RESEND_API_KEY=re_your-resend-api-key-here
# OR
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Contact Email
CONTACT_EMAIL=your-email@gmail.com

# Site URLs
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_API_BASE_URL=https://yourdomain.com/api
```

### Optional Features

```bash
# Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS=G-XXXXXXXXXX
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-analytics-id

# KV Storage (for caching)
KV_REST_API_URL=https://your-kv.upstash.io
KV_REST_API_TOKEN=your-kv-token

# Security
ALLOWED_ORIGINS=https://yourdomain.com
RESUME_SIGNING_SECRET=your-random-secret
```

## Deployment Instructions

### Vercel Deployment

1. **Set Environment Variables in Vercel Dashboard:**
   - Go to Project Settings → Environment Variables
   - Add all required variables from the list above
   - Set appropriate environments (Production, Preview, Development)

2. **Example Vercel CLI setup:**
   ```bash
   vercel env add OPENAI_API_KEY production
   vercel env add RESEND_API_KEY production
   vercel env add CONTACT_EMAIL production
   ```

### Local Development Setup

1. **Create `.env.local` file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in your development values:**
   ```bash
   # Use development/testing keys, never production keys
   OPENAI_API_KEY=sk-your-dev-key
   RESEND_API_KEY=re_your-test-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NODE_ENV=development
   ```

## Security Best Practices

### 1. API Key Management
- Use separate keys for development and production
- Implement key rotation schedule (every 90 days)
- Monitor API key usage and set up alerts

### 2. Email Security
- Use app passwords for Gmail SMTP (not your regular password)
- Enable 2FA on email accounts
- Consider using Resend for better deliverability

### 3. Secret Scanning
- Use GitHub secret scanning (enabled by default)
- Add pre-commit hooks to prevent accidental commits
- Regularly audit environment variables

### 4. Access Control
- Limit who can access production environment variables
- Use principle of least privilege
- Maintain audit logs of environment changes

## Environment Variable Validation

The application validates required environment variables at startup:

```typescript
// In lib/env.ts (to be created)
const requiredEnvVars = [
  'OPENAI_API_KEY',
  'NEXT_PUBLIC_SITE_URL',
  'CONTACT_EMAIL'
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});
```

## Troubleshooting

### Common Issues

1. **Missing Environment Variables:**
   - Check Vercel dashboard settings
   - Verify variable names match exactly
   - Ensure correct environment (production/preview/development)

2. **API Key Issues:**
   - Verify key format and validity
   - Check API key permissions and quotas
   - Test with a simple API call

3. **Email Delivery Issues:**
   - Verify SMTP settings
   - Check for authentication errors
   - Test with email service provider tools

### Emergency Procedures

1. **If secrets are accidentally committed:**
   ```bash
   # Immediately rotate all exposed secrets
   # Remove from git history
   git filter-branch --force --index-filter \
     'git rm --cached --ignore-unmatch .env.local' \
     --prune-empty --tag-name-filter cat -- --all
   ```

2. **If API keys are compromised:**
   - Revoke compromised keys immediately
   - Generate new keys
   - Update all deployment environments
   - Monitor for unauthorized usage

## Monitoring and Alerts

Set up monitoring for:
- API key usage patterns
- Failed authentication attempts
- Environment variable access logs
- Unusual email sending patterns

## Contact

For security concerns or questions about environment setup, create an issue or contact the development team.