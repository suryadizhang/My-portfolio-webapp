import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// Profile types
export interface Profile {
  name: string
  pronouns: string
  headline: string
  location: string
  contact: {
    email: string
    website: string
    github: string
    linkedin: string
  }
  summary: string
  experience: Array<{
    title: string
    company: string
    type?: string
    dates: string
    highlights: string[]
  }>
  education: Array<{
    school: string
    program: string
    dates: string
    notes: string
  }>
  certifications: Array<{
    name: string
    issuer: string
    date: string
    id: string
  }>
  skills: string[]
  hobbies: string[]
  availability: string[]
}

// Project types
export interface ProjectFrontmatter {
  title: string
  slug: string
  description?: string
  longDescription?: string
  tags?: string[]
  category?: string
  timeline?: string
  status?: string
  featured?: boolean
  priority?: number
  repository?: string
  liveUrl?: string
  image?: string
  gallery?: string[]
  tech?: Array<{
    name: string
    category: string
  }>
  // Legacy fields for backward compatibility
  live?: string
  source?: string
  cover?: string
  date?: string
  year?: number
  summary?: string
  links?: {
    live?: string
    repo?: string
    demo?: string
    docs?: string
  }
}

export interface Project {
  frontmatter: ProjectFrontmatter
  content: string
}

const contentDir = path.join(process.cwd(), 'content')
const projectsDir = path.join(contentDir, 'projects')

// Load profile data
export function getProfile(): Profile {
  const profilePath = path.join(contentDir, 'profile.json')
  
  if (!fs.existsSync(profilePath)) {
    throw new Error('Profile data not found')
  }
  
  const profileData = fs.readFileSync(profilePath, 'utf8')
  return JSON.parse(profileData)
}

// Load all projects
export function getAllProjects(): ProjectFrontmatter[] {
  if (!fs.existsSync(projectsDir)) {
    return []
  }
  
  const files = fs.readdirSync(projectsDir)
  const projects = files
    .filter(file => file.endsWith('.mdx'))
    .map(file => {
      const filePath = path.join(projectsDir, file)
      const fileContent = fs.readFileSync(filePath, 'utf8')
      const { data } = matter(fileContent)
      
      return data as ProjectFrontmatter
    })
    .sort((a, b) => (b.priority || 0) - (a.priority || 0) || (b.year || 0) - (a.year || 0)) // Sort by priority first, then year
  
  return projects
}

// Get a single project by slug
export function getProjectBySlug(slug: string): Project | null {
  if (!fs.existsSync(projectsDir)) {
    return null
  }
  
  const files = fs.readdirSync(projectsDir)
  const file = files.find(file => {
    const filePath = path.join(projectsDir, file)
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const { data } = matter(fileContent)
    return data.slug === slug
  })
  
  if (!file) {
    return null
  }
  
  const filePath = path.join(projectsDir, file)
  const fileContent = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContent)
  
  return {
    frontmatter: data as ProjectFrontmatter,
    content
  }
}

// Get featured projects (first 3)
export function getFeaturedProjects(): ProjectFrontmatter[] {
  const allProjects = getAllProjects()
  return allProjects.slice(0, 3)
}