import crypto from 'crypto';

// In-memory rate limiting (for development/small scale)
// For production with multiple instances, consider using Redis
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  // eslint-disable-next-line no-unused-vars
  keyGenerator?: (identifier: string) => string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

/**
 * Hash IP address for privacy-compliant rate limiting
 */
function hashIdentifier(identifier: string): string {
  const salt = process.env.RATE_LIMIT_SALT || 'portfolio_rate_limit_salt';
  return crypto.createHash('sha256').update(identifier + salt).digest('hex').substring(0, 16);
}

/**
 * Daily rate limiting - resets at midnight
 */
export function checkDailyRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const hashedKey = config.keyGenerator ? config.keyGenerator(identifier) : hashIdentifier(identifier);
  const now = Date.now();
  
  // Calculate reset time (next midnight UTC)
  const resetTime = new Date();
  resetTime.setUTCHours(24, 0, 0, 0);
  const resetTimeMs = resetTime.getTime();
  
  const record = rateLimitStore.get(hashedKey);
  
  // If no record or past reset time, create new record
  if (!record || record.resetTime < now) {
    const newRecord = { count: 1, resetTime: resetTimeMs };
    rateLimitStore.set(hashedKey, newRecord);
    
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: resetTimeMs,
    };
  }
  
  // Check if limit exceeded
  if (record.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
      retryAfter: Math.ceil((record.resetTime - now) / 1000), // seconds until reset
    };
  }
  
  // Increment count
  record.count++;
  
  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Time-window based rate limiting (e.g., 15 minutes)
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const hashedKey = config.keyGenerator ? config.keyGenerator(identifier) : hashIdentifier(identifier);
  const now = Date.now();
  const resetTime = now + config.windowMs;
  
  const record = rateLimitStore.get(hashedKey);
  
  // If no record or past reset time, create new record
  if (!record || record.resetTime < now) {
    const newRecord = { count: 1, resetTime };
    rateLimitStore.set(hashedKey, newRecord);
    
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime,
    };
  }
  
  // Check if limit exceeded
  if (record.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
      retryAfter: Math.ceil((record.resetTime - now) / 1000), // seconds until reset
    };
  }
  
  // Increment count
  record.count++;
  
  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Cleanup expired entries periodically
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  const storeEntries = Array.from(rateLimitStore.entries());
  for (const [key, record] of storeEntries) {
    if (record.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}

// Clean up expired entries every hour
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 60 * 60 * 1000); // 1 hour
}

// Rate limit configurations
export const RATE_LIMITS = {
  CONTACT_FORM: {
    maxRequests: 3,
    windowMs: 24 * 60 * 60 * 1000, // 24 hours (daily)
    keyGenerator: (ip: string) => `contact:${hashIdentifier(ip)}`,
  },
  RESUME_DOWNLOAD: {
    maxRequests: 3,
    windowMs: 24 * 60 * 60 * 1000, // 24 hours (daily)
    keyGenerator: (ip: string) => `resume:${hashIdentifier(ip)}`,
  },
  // Additional rate limiting for immediate protection
  CONTACT_BURST: {
    maxRequests: 1,
    windowMs: 60 * 1000, // 1 minute
    keyGenerator: (ip: string) => `contact_burst:${hashIdentifier(ip)}`,
  },
} as const;