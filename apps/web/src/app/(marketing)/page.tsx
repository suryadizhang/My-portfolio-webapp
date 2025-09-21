import { getProfile, getFeaturedProjects, type ProjectFrontmatter } from '@/lib/content'
import { generateSiteMetadata } from '@/lib/seo'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@portfolio/ui'
import { ExternalLink, Github, Linkedin, Mail, MapPin, Download, Code, Briefcase, Trophy, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = generateSiteMetadata()

export default function HomePage() {
  const profile = getProfile()
  const featuredProjects = getFeaturedProjects()

  return (
    <div className="container mx-auto px-4">
      {/* Hero Section - Enhanced for Recruiters */}
      <section className="py-20 text-center max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Available for immediate hire
          </div>
        </div>
        
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          {profile.name}
        </h1>
        
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          {profile.headline}
        </h2>
        
        <div className="flex items-center justify-center gap-2 text-gray-600 mb-8">
          <MapPin className="h-4 w-4" />
          <span>{profile.location}</span>
        </div>
        
        {/* Key Value Proposition */}
        <div className="max-w-4xl mx-auto mb-12">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            {profile.summary.split('\n')[0]}
          </p>
          
          {/* Impact Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-gray-50 rounded-xl p-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">100%</div>
              <div className="text-sm text-gray-600">Self-serve Bookings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">30%</div>
              <div className="text-sm text-gray-600">Faster Deployments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">15%</div>
              <div className="text-sm text-gray-600">Improved Efficiency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">99.9%</div>
              <div className="text-sm text-gray-600">API Uptime</div>
            </div>
          </div>
        </div>

        {/* Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 px-8">
            <Link href="/projects">
              <Briefcase className="mr-2 h-5 w-5" />
              View My Work
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="px-8">
            <Link href="/api/resume">
              <Download className="mr-2 h-5 w-5" />
              Download Resume
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="px-8">
            <Link href="/contact">
              <Mail className="mr-2 h-5 w-5" />
              Contact Me
            </Link>
          </Button>
        </div>

        {/* Social Links */}
        <div className="flex gap-4 justify-center">
          <Button variant="ghost" size="icon" asChild className="text-gray-600 hover:text-blue-600">
            <a href={profile.contact.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
              <Github className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild className="text-gray-600 hover:text-blue-600">
            <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
              <Linkedin className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild className="text-gray-600 hover:text-blue-600">
            <a href={`mailto:${profile.contact.email}`} aria-label="Email Contact">
              <Mail className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </section>

      {/* Featured Projects Section - Enhanced */}
      <section className="py-20 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Production Projects</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real applications serving actual users with measurable business impact
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project: ProjectFrontmatter, index: number) => (
            <Card key={project.slug} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200">
              {/* Project Image/Preview */}
              <div className="h-48 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-indigo-500/10"></div>
                <div className="relative z-10 text-center">
                  {index === 0 && <Briefcase className="h-16 w-16 text-blue-600 mb-2" />}
                  {index === 1 && <Code className="h-16 w-16 text-purple-600 mb-2" />}
                  {index === 2 && <Trophy className="h-16 w-16 text-indigo-600 mb-2" />}
                  <div className="font-semibold text-gray-800">{project.title}</div>
                </div>
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                    Live Production
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </CardTitle>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {project.summary || project.description || project.longDescription}
                </p>
                
                {/* Technology Stack */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {(project.tags || (project.tech?.map(t => typeof t === 'string' ? t : t.name)) || []).slice(0, 4).map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100">
                      {tag}
                    </Badge>
                  ))}
                  {(project.tags || project.tech || []).length > 4 && (
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                      +{(project.tags || project.tech || []).length - 4} more
                    </Badge>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  {(project.liveUrl || project.live || project.links?.live) && (
                    <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700" asChild>
                      <a href={project.liveUrl || project.live || project.links?.live} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                  {(project.repository || project.source || project.links?.repo) && (
                    <Button size="sm" variant="outline" className="flex-1" asChild>
                      <a href={project.repository || project.source || project.links?.repo} target="_blank" rel="noopener noreferrer">
                        <Github className="h-3 w-3 mr-1" />
                        Source Code
                      </a>
                    </Button>
                  )}
                </div>
                
                {/* Case Study Link */}
                <div className="mt-4 pt-4 border-t">
                  <Button variant="ghost" size="sm" asChild className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    <Link href={`/projects/${project.slug}`}>
                      Read Full Case Study →
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <Button variant="outline" size="lg" asChild className="px-8">
            <Link href="/projects">
              View All Projects & Case Studies
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Technical Skills & Value Prop */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How I Deliver Value</h2>
            <p className="text-xl text-gray-600">
              My approach to building production-ready applications
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Column - What I Build */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 flex items-center">
                <Briefcase className="mr-3 h-6 w-6 text-blue-600" />
                What I Build
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Mobile-first booking & e-commerce flows</h4>
                    <p className="text-gray-600 text-sm mt-1">Responsive interfaces that feel effortless on mobile</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Well-documented APIs with strong auth</h4>
                    <p className="text-gray-600 text-sm mt-1">Predictable error models and comprehensive OpenAPI specs</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Admin dashboards with insights</h4>
                    <p className="text-gray-600 text-sm mt-1">Bulk actions, guardrails, and data that drives decisions</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">CI/CD pipelines for confident releases</h4>
                    <p className="text-gray-600 text-sm mt-1">Automated testing, previews, and daily deployments</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - How I Work */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 flex items-center">
                <Code className="mr-3 h-6 w-6 text-purple-600" />
                How I Work
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border">
                  <h4 className="font-medium text-gray-900 mb-2">Model data and design REST APIs</h4>
                  <p className="text-gray-600 text-sm">Auth, pagination, clear errors, documented with OpenAPI</p>
                </div>
                
                <div className="p-4 bg-white rounded-lg border">
                  <h4 className="font-medium text-gray-900 mb-2">Build responsive React/Next.js UIs</h4>
                  <p className="text-gray-600 text-sm">Mobile-first design, accessible by default, high performance</p>
                </div>
                
                <div className="p-4 bg-white rounded-lg border">
                  <h4 className="font-medium text-gray-900 mb-2">Add comprehensive guardrails</h4>
                  <p className="text-gray-600 text-sm">Validation, rate limiting, logging/metrics, automated tests</p>
                </div>
                
                <div className="p-4 bg-white rounded-lg border">
                  <h4 className="font-medium text-gray-900 mb-2">Ship safely with GitHub Actions</h4>
                  <p className="text-gray-600 text-sm">Lint, unit/integration tests, preview deploys, monitoring</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Core Technologies */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-semibold mb-8">Core Stack</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {profile.skills.slice(0, 12).map((skill: string) => (
                <Badge key={skill} variant="secondary" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 text-sm font-medium">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Build Something Great?</h2>
          <p className="text-xl text-gray-600 mb-8">
            I thrive in environments where curiosity, collaboration, and shipping real value come first.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 px-8">
              <Link href="/contact">
                <Mail className="mr-2 h-5 w-5" />
                Let's Talk
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="px-8">
              <Link href="/about">
                Learn More About Me
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}