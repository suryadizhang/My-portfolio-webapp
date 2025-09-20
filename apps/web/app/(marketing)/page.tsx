import { getProfile, getFeaturedProjects } from '@/lib/content'
import { generateSiteMetadata } from '@/lib/seo'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@portfolio/ui'
import { ExternalLink, Github, Linkedin, Mail } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = generateSiteMetadata()

export default function HomePage() {
  const profile = getProfile()
  const featuredProjects = getFeaturedProjects()

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto mb-20">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {profile.name}
        </h1>
        <p className="text-xl text-muted-foreground mb-2">
          {profile.title}
        </p>
        <p className="text-lg text-muted-foreground mb-4">
          {profile.tagline}
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          📍 {profile.location}
        </p>
        
        <div className="flex gap-4 justify-center flex-wrap">
          <Button asChild>
            <Link href="/projects">View Projects</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/resume">Download Resume</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contact">Contact</Link>
          </Button>
        </div>

        {/* Social Links */}
        <div className="flex gap-4 justify-center mt-8">
          <Button variant="ghost" size="icon" asChild>
            <a href={profile.social.github} target="_blank" rel="noopener noreferrer">
              <Github className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href={`mailto:${profile.email}`}>
              <Mail className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </section>

      {/* Signature Projects */}
      <section className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-semibold text-center mb-12">Signature Projects</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <Card key={project.slug} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                <span className="text-primary font-medium">{project.title}</span>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{project.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{project.summary}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.slice(0, 3).map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  {project.links.live && (
                    <Button size="sm" asChild>
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
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="outline" asChild>
            <Link href="/projects">
              View All Projects
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* What I Build */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-8">What I Build</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {profile.about.whatIBuild.map((item: string, index: number) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold text-sm">{index + 1}</span>
              </div>
              <p className="text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}