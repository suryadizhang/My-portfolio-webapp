import { getAllProjects } from '@/lib/content'
import { generateSiteMetadata } from '@/lib/seo'
import { Badge, Button } from '@portfolio/ui'
import { ExternalLink, Github } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = generateSiteMetadata(
  'Projects',
  'A showcase of my development projects and technical expertise.',
  '/projects'
)

export default function ProjectsPage() {
  const projects = getAllProjects()

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="max-w-2xl mb-16">
        <h1 className="text-4xl font-bold mb-4">Projects</h1>
        <p className="text-xl text-muted-foreground">
          A collection of projects that showcase my skills in full-stack development, 
          from AI-powered applications to progressive web apps.
        </p>
      </div>

      {/* All Projects */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.slug}
              className="bg-card text-card-foreground rounded-lg border overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/40">
                <Image
                  src={project.cover}
                  alt={project.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-primary font-medium opacity-50">{project.title}</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <span className="text-sm text-muted-foreground">{project.year}</span>
                </div>
                
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {project.summary}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" asChild>
                    <Link href={`/projects/${project.slug}`}>
                      View Details
                    </Link>
                  </Button>
                  {project.links.live && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={project.links.live} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Live
                      </a>
                    </Button>
                  )}
                  {project.links.repo && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={project.links.repo} target="_blank" rel="noopener noreferrer">
                        <Github className="h-3 w-3 mr-1" />
                        Code
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-semibold mb-4">Interested in working together?</h2>
          <p className="text-muted-foreground mb-8">
            I'm always open to discussing new opportunities and interesting projects.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/contact">Get In Touch</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/resume">View Resume</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}