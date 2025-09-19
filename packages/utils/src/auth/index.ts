import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid'
import { User } from '../schemas'

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = '7d'

export interface AuthTokenPayload {
  userId: string
  email: string
  role: string
}

export class AuthUtils {
  // Password hashing
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12
    return bcrypt.hash(password, saltRounds)
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

  // JWT token management
  static generateToken(payload: AuthTokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
  }

  static verifyToken(token: string): AuthTokenPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as AuthTokenPayload
    } catch (error) {
      return null
    }
  }

  static decodeToken(token: string): AuthTokenPayload | null {
    try {
      return jwt.decode(token) as AuthTokenPayload
    } catch (error) {
      return null
    }
  }

  // User creation utilities
  static createUser(userData: {
    name: string
    email: string
    password: string
    role?: 'admin' | 'user'
  }): Omit<User, 'id'> & { hashedPassword: string } {
    return {
      name: userData.name,
      email: userData.email.toLowerCase(),
      role: userData.role || 'user',
      createdAt: Date.now(),
      hashedPassword: userData.password, // This should be hashed before calling this function
    }
  }

  // Session management
  static generateSessionId(): string {
    return nanoid(32)
  }

  // Email verification
  static generateVerificationToken(): string {
    return nanoid(48)
  }

  // Password reset
  static generateResetToken(): string {
    return nanoid(48)
  }

  // Role-based access control
  static hasRole(user: User, requiredRole: 'admin' | 'user'): boolean {
    if (requiredRole === 'user') {
      return user.role === 'admin' || user.role === 'user'
    }
    return user.role === requiredRole
  }

  static isAdmin(user: User): boolean {
    return user.role === 'admin'
  }

  // Token extraction from headers
  static extractTokenFromHeader(authHeader: string | null): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }
    return authHeader.substring(7) // Remove 'Bearer ' prefix
  }

  // Generate API key
  static generateApiKey(): string {
    return `pk_${nanoid(32)}`
  }

  // Validate email format
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Generate secure random string
  static generateSecureRandom(length: number = 32): string {
    return nanoid(length)
  }

  // Check password strength
  static checkPasswordStrength(password: string): {
    score: number
    feedback: string[]
    isStrong: boolean
  } {
    const feedback: string[] = []
    let score = 0

    if (password.length >= 8) score += 1
    else feedback.push('Password should be at least 8 characters long')

    if (/[a-z]/.test(password)) score += 1
    else feedback.push('Password should contain lowercase letters')

    if (/[A-Z]/.test(password)) score += 1
    else feedback.push('Password should contain uppercase letters')

    if (/\d/.test(password)) score += 1
    else feedback.push('Password should contain numbers')

    if (/[^A-Za-z0-9]/.test(password)) score += 1
    else feedback.push('Password should contain special characters')

    return {
      score,
      feedback,
      isStrong: score >= 4,
    }
  }
}