import fs from 'fs'
import path from 'path'

interface ContentChunk {
  id: string
  type: 'profile' | 'project' | 'section'
  title: string
  content: string
  metadata: Record<string, any>
  source: string
  slug?: string
  tokens: string[]
  embedding?: number[]
}

interface RAGIndex {
  chunks: ContentChunk[]
  vocabulary: string[]
  idf: Record<string, number>
  metadata: {
    createdAt: string
    totalChunks: number
    sources: string[]
  }
}

interface SearchResult {
  chunk: ContentChunk
  score: number
  relevance: 'high' | 'medium' | 'low'
}

interface SearchResponse {
  results: SearchResult[]
  totalResults: number
  query: string
  searchTime: number
  context: string
  sources: string[]
}

/**
 * Load RAG index from file
 */
export function loadRAGIndex(): RAGIndex | null {
  try {
    const indexPath = path.join(process.cwd(), 'apps', 'web', 'public', 'rag.json')
    
    if (!fs.existsSync(indexPath)) {
      console.warn('RAG index not found. Run build-index to create it.')
      return null
    }
    
    const indexContent = fs.readFileSync(indexPath, 'utf-8')
    return JSON.parse(indexContent)
  } catch (error) {
    console.error('Error loading RAG index:', error)
    return null
  }
}

/**
 * Simple tokenizer matching the one in build-index.ts
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 2 && token.length < 20)
    .filter(token => !['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'].includes(token))
}

/**
 * Calculate TF-IDF vector for text
 */
function calculateTFIDFVector(tokens: string[], vocabulary: string[], idf: Record<string, number>): number[] {
  const termFreq = new Map<string, number>()
  
  // Calculate term frequency
  tokens.forEach(token => {
    termFreq.set(token, (termFreq.get(token) || 0) + 1)
  })
  
  // Create TF-IDF vector
  return vocabulary.map(term => {
    const tf = termFreq.get(term) || 0
    const idfScore = idf[term] || 0
    return tf * idfScore
  })
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0
  
  let dotProduct = 0
  let normA = 0
  let normB = 0
  
  for (let i = 0; i < vecA.length; i++) {
    const a = vecA[i]
    const b = vecB[i]
    if (a !== undefined && b !== undefined) {
      dotProduct += a * b
      normA += a * a
      normB += b * b
    }
  }
  
  if (normA === 0 || normB === 0) return 0
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

/**
 * Enhanced scoring with multiple factors
 */
function calculateRelevanceScore(chunk: ContentChunk, queryTokens: string[], similarity: number): number {
  let score = similarity
  
  // Boost for exact word matches
  const chunkWords = chunk.content.toLowerCase().split(/\s+/)
  const exactMatches = queryTokens.filter(token => 
    chunkWords.some(word => word.includes(token))
  ).length
  const exactMatchBoost = (exactMatches / queryTokens.length) * 0.3
  
  // Boost for title matches
  const titleWords = chunk.title.toLowerCase().split(/\s+/)
  const titleMatches = queryTokens.filter(token =>
    titleWords.some(word => word.includes(token))
  ).length
  const titleBoost = titleMatches > 0 ? 0.2 : 0
  
  // Type-based weighting
  const typeBoost = chunk.type === 'profile' ? 0.1 : chunk.type === 'project' ? 0.05 : 0
  
  // Recency boost (newer content slightly preferred)
  const recencyBoost = chunk.metadata?.year ? 
    Math.min((parseInt(chunk.metadata.year) - 2020) * 0.02, 0.1) : 0
  
  return Math.min(score + exactMatchBoost + titleBoost + typeBoost + recencyBoost, 1.0)
}

/**
 * Filter content by search mode
 */
function filterChunksByMode(chunks: ContentChunk[], mode: 'general' | 'projects' | 'resume'): ContentChunk[] {
  switch (mode) {
    case 'projects':
      return chunks.filter(chunk => 
        chunk.type === 'project' || 
        (chunk.type === 'profile' && chunk.id.includes('exp'))
      )
    
    case 'resume':
      return chunks.filter(chunk =>
        chunk.type === 'profile' || 
        (chunk.type === 'project' && chunk.metadata?.featured)
      )
    
    case 'general':
    default:
      return chunks
  }
}

/**
 * Main search function with TF-IDF and cosine similarity
 */
export function searchContent(
  query: string, 
  options: {
    topK?: number
    mode?: 'general' | 'projects' | 'resume'
    minScore?: number
  } = {}
): SearchResponse {
  const startTime = performance.now()
  const { topK = 10, mode = 'general', minScore = 0.1 } = options
  
  const index = loadRAGIndex()
  if (!index) {
    return {
      results: [],
      totalResults: 0,
      query,
      searchTime: performance.now() - startTime,
      context: '',
      sources: []
    }
  }
  
  // Tokenize query
  const queryTokens = tokenize(query)
  if (queryTokens.length === 0) {
    return {
      results: [],
      totalResults: 0,
      query,
      searchTime: performance.now() - startTime,
      context: '',
      sources: []
    }
  }
  
  // Calculate query TF-IDF vector
  const queryVector = calculateTFIDFVector(queryTokens, index.vocabulary, index.idf)
  
  // Filter chunks by mode
  const filteredChunks = filterChunksByMode(index.chunks, mode)
  
  // Calculate similarities and scores
  const scoredResults: SearchResult[] = filteredChunks
    .map(chunk => {
      // Calculate chunk TF-IDF vector
      const chunkVector = calculateTFIDFVector(chunk.tokens, index.vocabulary, index.idf)
      
      // Calculate cosine similarity
      const similarity = cosineSimilarity(queryVector, chunkVector)
      
      // Calculate enhanced relevance score
      const score = calculateRelevanceScore(chunk, queryTokens, similarity)
      
      return {
        chunk,
        score,
        relevance: score > 0.4 ? 'high' : score > 0.2 ? 'medium' : 'low'
      } as SearchResult
    })
    .filter(result => result.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
  
  // Build context from top results
  const context = scoredResults
    .slice(0, Math.min(5, scoredResults.length))
    .map(result => `${result.chunk.title}: ${result.chunk.content}`)
    .join('\n\n')
  
  // Extract unique sources
  const sources = Array.from(new Set(scoredResults.map(result => result.chunk.source)))
  
  const searchTime = performance.now() - startTime
  
  return {
    results: scoredResults,
    totalResults: scoredResults.length,
    query,
    searchTime,
    context,
    sources
  }
}

/**
 * Get similar content to a specific chunk (for "related content" features)
 */
export function findSimilarContent(chunkId: string, topK: number = 5): SearchResult[] {
  const index = loadRAGIndex()
  if (!index) return []
  
  const targetChunk = index.chunks.find(chunk => chunk.id === chunkId)
  if (!targetChunk) return []
  
  const targetVector = calculateTFIDFVector(targetChunk.tokens, index.vocabulary, index.idf)
  
  return index.chunks
    .filter(chunk => chunk.id !== chunkId)
    .map(chunk => {
      const chunkVector = calculateTFIDFVector(chunk.tokens, index.vocabulary, index.idf)
      const similarity = cosineSimilarity(targetVector, chunkVector)
      
      return {
        chunk,
        score: similarity,
        relevance: similarity > 0.4 ? 'high' : similarity > 0.2 ? 'medium' : 'low'
      } as SearchResult
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
}

/**
 * Get content by type or source
 */
export function getContentByType(
  type: 'profile' | 'project' | 'section',
  limit?: number
): ContentChunk[] {
  const index = loadRAGIndex()
  if (!index) return []
  
  const filtered = index.chunks.filter(chunk => chunk.type === type)
  return limit ? filtered.slice(0, limit) : filtered
}

/**
 * Get all available projects from the index
 */
export function getAllProjects(): { slug: string, title: string, description: string }[] {
  const index = loadRAGIndex()
  if (!index) return []
  
  const projectChunks = index.chunks.filter(chunk => 
    chunk.type === 'project' && chunk.id.includes('overview')
  )
  
  return projectChunks.map(chunk => ({
    slug: chunk.slug || '',
    title: chunk.metadata?.title || chunk.title,
    description: chunk.metadata?.description || chunk.content.substring(0, 200) + '...'
  }))
}

/**
 * Advanced search with filters
 */
export function advancedSearch(
  query: string,
  filters: {
    types?: ('profile' | 'project' | 'section')[]
    sources?: string[]
    tags?: string[]
    dateFrom?: string
    dateTo?: string
  } = {},
  options: {
    topK?: number
    minScore?: number
  } = {}
): SearchResponse {
  const index = loadRAGIndex()
  if (!index) {
    return {
      results: [],
      totalResults: 0,
      query,
      searchTime: 0,
      context: '',
      sources: []
    }
  }
  
  let filteredChunks = index.chunks
  
  // Apply filters
  if (filters.types?.length) {
    filteredChunks = filteredChunks.filter(chunk => filters.types!.includes(chunk.type))
  }
  
  if (filters.sources?.length) {
    filteredChunks = filteredChunks.filter(chunk => 
      filters.sources!.some(source => chunk.source.includes(source))
    )
  }
  
  if (filters.tags?.length) {
    filteredChunks = filteredChunks.filter(chunk => 
      chunk.metadata?.tags?.some((tag: string) => 
        filters.tags!.some(filterTag => 
          tag.toLowerCase().includes(filterTag.toLowerCase())
        )
      )
    )
  }
  
  // Temporarily replace index chunks for filtered search
  const originalChunks = index.chunks
  index.chunks = filteredChunks
  
  const result = searchContent(query, options)
  
  // Restore original chunks
  index.chunks = originalChunks
  
  return result
}

export type { SearchResult, SearchResponse, ContentChunk, RAGIndex }