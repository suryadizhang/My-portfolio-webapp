import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns'

// Date formatting utilities
export class DateUtils {
  static formatDate(date: Date | string | number, pattern: string = 'PPP'): string {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date)
    return isValid(dateObj) ? format(dateObj, pattern) : 'Invalid date'
  }

  static formatDateTime(date: Date | string | number): string {
    return DateUtils.formatDate(date, 'PPP p')
  }

  static formatRelative(date: Date | string | number): string {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date)
    return isValid(dateObj) ? formatDistanceToNow(dateObj, { addSuffix: true }) : 'Invalid date'
  }

  static isValidDate(date: any): boolean {
    if (date instanceof Date) {
      return isValid(date)
    }
    if (typeof date === 'string' || typeof date === 'number') {
      return isValid(new Date(date))
    }
    return false
  }
}

// String utilities
export class StringUtils {
  static slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-')
      .trim()
  }

  static truncate(text: string, maxLength: number, suffix: string = '...'): string {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength - suffix.length) + suffix
  }

  static capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
  }

  static camelCase(text: string): string {
    return text
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase()
      })
      .replace(/\s+/g, '')
  }

  static kebabCase(text: string): string {
    return text
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/\s+/g, '-')
      .toLowerCase()
  }

  static generateExcerpt(content: string, maxLength: number = 160): string {
    const plainText = content.replace(/<[^>]*>/g, '') // Remove HTML tags
    return StringUtils.truncate(plainText, maxLength)
  }

  static pluralize(count: number, singular: string, plural?: string): string {
    if (count === 1) return `${count} ${singular}`
    return `${count} ${plural || singular + 's'}`
  }
}

// Object utilities
export class ObjectUtils {
  static pick<T extends Record<string, any>, K extends keyof T>(
    obj: T,
    keys: K[]
  ): Pick<T, K> {
    const result = {} as Pick<T, K>
    keys.forEach(key => {
      if (key in obj) {
        result[key] = obj[key]
      }
    })
    return result
  }

  static omit<T extends Record<string, any>, K extends keyof T>(
    obj: T,
    keys: K[]
  ): Omit<T, K> {
    const result = { ...obj }
    keys.forEach(key => {
      delete result[key]
    })
    return result
  }

  static deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') return obj
    if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T
    if (obj instanceof Array) return obj.map(item => ObjectUtils.deepClone(item)) as unknown as T
    
    const cloned = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = ObjectUtils.deepClone(obj[key])
      }
    }
    return cloned
  }

  static isEmpty(obj: any): boolean {
    if (obj == null) return true
    if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0
    return Object.keys(obj).length === 0
  }
}

// Array utilities
export class ArrayUtils {
  static unique<T>(array: T[]): T[] {
    return Array.from(new Set(array))
  }

  static chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  }

  static shuffle<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = shuffled[i]
      shuffled[i] = shuffled[j]!
      shuffled[j] = temp!
    }
    return shuffled
  }

  static sortBy<T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
    return [...array].sort((a, b) => {
      const aVal = a[key]
      const bVal = b[key]
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1
      if (aVal > bVal) return direction === 'asc' ? 1 : -1
      return 0
    })
  }
}

// URL utilities
export class UrlUtils {
  static isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  static getUrlParams(url: string): Record<string, string> {
    const params: Record<string, string> = {}
    try {
      const urlObj = new URL(url)
      urlObj.searchParams.forEach((value, key) => {
        params[key] = value
      })
    } catch {
      // Invalid URL
    }
    return params
  }

  static buildUrl(base: string, params: Record<string, string>): string {
    try {
      const url = new URL(base)
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value)
      })
      return url.toString()
    } catch {
      return base
    }
  }
}

// File utilities
export class FileUtils {
  static getFileExtension(filename: string): string {
    return filename.split('.').pop() || ''
  }

  static getFileName(filepath: string): string {
    return filepath.split('/').pop() || filepath
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  static isImageFile(filename: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp']
    const extension = FileUtils.getFileExtension(filename).toLowerCase()
    return imageExtensions.includes(extension)
  }

  static isPdfFile(filename: string): boolean {
    return FileUtils.getFileExtension(filename).toLowerCase() === 'pdf'
  }
}