import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Github } from 'lucide-react'

interface ProjectPageProps {
  params: Promise<{
    slug: string
  }>
}

// This will eventually load from MDX content
const projectData: Record<string, any> = {
  'ai-booking-platform': {
    title: 'AI-Powered Booking Platform',
    summary: 'Full-stack booking application with AI recommendations, real-time availability, and secure payment processing.',
    tags: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'AI/ML'],
    year: 2024,
    github: 'https://github.com/yourusername/ai-booking-platform',
    live: 'https://booking-platform-demo.vercel.app',
    content: `
      <h1>AI-Powered Booking Platform</h1>
      <p>A comprehensive booking platform that leverages artificial intelligence to provide personalized recommendations and streamline the booking process.</p>
      
      <h2>Features</h2>
      <ul>
        <li><strong>Smart Recommendations</strong>: AI-powered suggestions based on user preferences</li>
        <li><strong>Real-time Availability</strong>: Live updates of available slots and services</li>
        <li><strong>Secure Payments</strong>: Integrated with Stripe for secure payment processing</li>
        <li><strong>User Dashboard</strong>: Comprehensive dashboard for managing bookings</li>
      </ul>
      
      <h2>Technical Implementation</h2>
      <p>This project demonstrates my ability to build complex, full-stack applications with modern technologies.</p>
    `
  }
}

export async function generateStaticParams() {
  return Object.keys(projectData).map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = projectData[slug]
  
  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  return {
    title: `${project.title} - Your Name`,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      type: 'article',
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = projectData[slug]

  if (!project) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Back button */}
      <div className="mb-8">
        <Link 
          href="/projects"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
      </div>

      {/* Project header */}
      <div className="mb-12">
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag: string) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm font-medium bg-secondary text-secondary-foreground rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
        <p className="text-xl text-muted-foreground mb-6">{project.summary}</p>
        
        {/* Action buttons */}
        <div className="flex gap-4 mb-8">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Github className="h-4 w-4" />
              View Source
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-border px-4 py-2 rounded-lg hover:bg-accent transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Live Demo
            </a>
          )}
        </div>
      </div>

      {/* Project cover image placeholder */}
      <div className="relative aspect-video mb-12 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
        <span className="text-primary font-medium">Project Screenshot Coming Soon</span>
      </div>

      {/* Project content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: project.content }} />
      </div>
    </div>
  )
}