import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

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

/**
 * Simple tokenizer for text processing
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
 * Calculate TF-IDF scores for text chunks
 */
function calculateTFIDF(chunks: ContentChunk[]): { vocabulary: string[], idf: Record<string, number> } {
  const vocabulary = new Set<string>()
  const documentFreq = new Map<string, number>()
  
  // Build vocabulary and document frequency
  chunks.forEach(chunk => {
    const uniqueTokens = new Set(chunk.tokens)
    uniqueTokens.forEach(token => {
      vocabulary.add(token)
      documentFreq.set(token, (documentFreq.get(token) || 0) + 1)
    })
  })
  
  const vocabArray = Array.from(vocabulary)
  const totalDocs = chunks.length
  
  // Calculate IDF
  const idf: Record<string, number> = {}
  vocabArray.forEach(term => {
    const df = documentFreq.get(term) || 1
    idf[term] = Math.log(totalDocs / df)
  })
  
  return { vocabulary: vocabArray, idf }
}

/**
 * Chunk text into smaller segments for better search
 */
function chunkText(text: string, maxLength: number = 500): string[] {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const chunks: string[] = []
  let currentChunk = ''
  
  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim()
    if (currentChunk.length + trimmedSentence.length > maxLength) {
      if (currentChunk) {
        chunks.push(currentChunk.trim())
        currentChunk = trimmedSentence
      } else {
        // Sentence is too long, split by words
        const words = trimmedSentence.split(' ')
        for (let i = 0; i < words.length; i += 50) {
          chunks.push(words.slice(i, i + 50).join(' '))
        }
      }
    } else {
      currentChunk += (currentChunk ? ' ' : '') + trimmedSentence
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk.trim())
  }
  
  return chunks.filter(chunk => chunk.length > 50)
}

/**
 * Process profile.json into content chunks
 */
async function processProfile(profilePath: string): Promise<ContentChunk[]> {
  try {
    const profileContent = fs.readFileSync(profilePath, 'utf-8')
    const profile = JSON.parse(profileContent)
    const chunks: ContentChunk[] = []
    
    // Basic info chunk
    const basicInfo = `${profile.name} is a ${profile.headline}. Located in ${profile.location}. ${profile.summary}`
    chunks.push({
      id: 'profile-basic',
      type: 'profile',
      title: 'Basic Information',
      content: basicInfo,
      metadata: profile,
      source: 'profile.json',
      tokens: tokenize(basicInfo)
    })
    
    // Experience chunks
    if (profile.experience) {
      profile.experience.forEach((exp: any, index: number) => {
        const expText = `${exp.title} at ${exp.company} (${exp.dates}). ${exp.highlights?.join('. ') || ''}`
        chunks.push({
          id: `profile-exp-${index}`,
          type: 'profile',
          title: `Experience: ${exp.title}`,
          content: expText,
          metadata: exp,
          source: 'profile.json',
          tokens: tokenize(expText)
        })
      })
    }
    
    // Skills chunk
    if (profile.skills) {
      const skillsText = `Technical skills: ${profile.skills.join(', ')}`
      chunks.push({
        id: 'profile-skills',
        type: 'profile',
        title: 'Technical Skills',
        content: skillsText,
        metadata: { skills: profile.skills },
        source: 'profile.json',
        tokens: tokenize(skillsText)
      })
    }
    
    // Education chunks
    if (profile.education) {
      profile.education.forEach((edu: any, index: number) => {
        const eduText = `${edu.program} at ${edu.school} (${edu.dates}). ${edu.notes || ''}`
        chunks.push({
          id: `profile-edu-${index}`,
          type: 'profile',
          title: `Education: ${edu.program}`,
          content: eduText,
          metadata: edu,
          source: 'profile.json',
          tokens: tokenize(eduText)
        })
      })
    }
    
    return chunks
  } catch (error) {
    console.error('Error processing profile:', error)
    return []
  }
}

/**
 * Process MDX project files into content chunks
 */
async function processProjects(contentDir: string): Promise<ContentChunk[]> {
  const projectsDir = path.join(contentDir, 'projects')
  const chunks: ContentChunk[] = []
  
  try {
    const files = fs.readdirSync(projectsDir)
    const mdxFiles = files.filter(file => file.endsWith('.mdx'))
    
    for (const file of mdxFiles) {
      const filePath = path.join(projectsDir, file)
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const { data: frontmatter, content } = matter(fileContent)
      
      const slug = file.replace('.mdx', '')
      
      // Project overview chunk
      const overviewText = `${frontmatter.title}: ${frontmatter.description}. ${frontmatter.longDescription || ''}`
      chunks.push({
        id: `project-${slug}-overview`,
        type: 'project',
        title: frontmatter.title,
        content: overviewText,
        metadata: frontmatter,
        source: file,
        slug,
        tokens: tokenize(overviewText)
      })
      
      // Technology stack chunk
      if (frontmatter.tags) {
        const techText = `${frontmatter.title} is built with: ${frontmatter.tags.join(', ')}`
        chunks.push({
          id: `project-${slug}-tech`,
          type: 'project',
          title: `${frontmatter.title} - Technology Stack`,
          content: techText,
          metadata: { tags: frontmatter.tags, title: frontmatter.title },
          source: file,
          slug,
          tokens: tokenize(techText)
        })
      }
      
      // Content chunks (break down long content)
      const contentChunks = chunkText(content)
      contentChunks.forEach((chunk, index) => {
        chunks.push({
          id: `project-${slug}-content-${index}`,
          type: 'section',
          title: `${frontmatter.title} - Section ${index + 1}`,
          content: chunk,
          metadata: { ...frontmatter, section: index + 1 },
          source: file,
          slug,
          tokens: tokenize(chunk)
        })
      })
    }
  } catch (error) {
    console.error('Error processing projects:', error)
  }
  
  return chunks
}

/**
 * Build complete RAG index
 */
export async function buildRAGIndex(): Promise<RAGIndex> {
  const contentDir = path.join(process.cwd(), 'content')
  const profilePath = path.join(contentDir, 'profile.json')
  
  console.log('Building RAG index...')
  console.log('Content dir:', contentDir)
  
  // Process all content sources
  const [profileChunks, projectChunks] = await Promise.all([
    processProfile(profilePath),
    processProjects(contentDir)
  ])
  
  const allChunks = [...profileChunks, ...projectChunks]
  
  // Calculate TF-IDF
  const { vocabulary, idf } = calculateTFIDF(allChunks)
  
  const index: RAGIndex = {
    chunks: allChunks,
    vocabulary,
    idf,
    metadata: {
      createdAt: new Date().toISOString(),
      totalChunks: allChunks.length,
      sources: Array.from(new Set(allChunks.map(chunk => chunk.source)))
    }
  }
  
  console.log(`RAG index built: ${allChunks.length} chunks from ${index.metadata.sources.length} sources`)
  
  return index
}

/**
 * Save index to file
 */
export async function saveRAGIndex(index: RAGIndex, outputPath?: string): Promise<void> {
  const defaultPath = path.join(process.cwd(), 'public', 'rag.json')
  const filePath = outputPath || defaultPath
  
  // Ensure directory exists
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  
  fs.writeFileSync(filePath, JSON.stringify(index, null, 2))
  console.log(`RAG index saved to: ${filePath}`)
}

/**
 * Build and save index (can be called from CLI or Next.js)
 */
export async function buildAndSaveIndex(): Promise<void> {
  try {
    const index = await buildRAGIndex()
    await saveRAGIndex(index)
    
    console.log('RAG index build complete!')
    console.log(`- Total chunks: ${index.chunks.length}`)
    console.log(`- Vocabulary size: ${index.vocabulary.length}`)
    console.log(`- Sources: ${index.metadata.sources.join(', ')}`)
  } catch (error) {
    console.error('Error building RAG index:', error)
    throw error
  }
}

// CLI usage
if (require.main === module) {
  buildAndSaveIndex().catch(console.error)
}