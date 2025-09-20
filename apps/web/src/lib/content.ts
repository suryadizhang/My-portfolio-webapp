import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// Profile types
export interface Profile {
  name: string
  pronouns: string
  title: string
  tagline: string
  location: string
  email: string
  phone: string
  social: {
    linkedin: string
    github: string
    portfolio: string
  }
  about: {
    summary: string
    howIWork: string[]
    impact: string[]
    whatIBuild: string[]
  }
  skillsPrimary: string[]
  hobbies: string[]
  experience: Array<{
    role: string
    company: string
    dates: string
    location: string
    bullets: string[]
  }>
  education: Array<{
    school: string
    program: string
    dates: string
    notes: string
  }>
  certs: Array<{
    name: string
    issuer: string
    id: string
    issued: string
  }>
}

// Project types
export interface ProjectFrontmatter {
  title: string
  description?: string
  tech?: string[]
  category?: string
  featured?: boolean
  live?: string
  source?: string
  cover: string
  date?: string
  slug: string
  year: number
  summary: string
  tags: string[]
  links: {
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
    .sort((a, b) => b.year - a.year) // Sort by year descending
  
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