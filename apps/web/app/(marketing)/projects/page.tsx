import { getAllProjects, type ProjectFrontmatter } from '@/lib/content'
import { generateSiteMetadata } from '@/lib/seo'
import { ProjectImage } from '@/components/project-image'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@portfolio/ui'
import { ExternalLink, Github, Calendar, Code2, Star, TrendingUp, Zap, Users } from 'lucide-react'
import Link from 'next/link'

export const metadata = generateSiteMetadata(
  'Projects',
  'Comprehensive showcase of full-stack development projects with real business impact and technical depth.',
  '/projects'
)

export default function ProjectsPage() {
  const projects = getAllProjects()
  const featuredProjects = projects.filter(p => p.featured)
  const otherProjects = projects.filter(p => !p.featured)

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="mb-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Code2 className="h-4 w-4" />
            Production-Ready Projects
          </div>
          
          <h1 className="text-5xl font-bold mb-6">Project Portfolio</h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Real-world applications showcasing <strong>full-stack expertise</strong> from concept to deployment. 
            Each project demonstrates technical depth, business impact, and production-ready code quality.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center justify-center gap-3 p-4 bg-green-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">Live Production</p>
                <p className="text-sm text-green-700">Real users & metrics</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-purple-50 rounded-lg">
              <Zap className="h-6 w-6 text-purple-600" />
              <div>
                <p className="font-semibold text-purple-900">Full-Stack</p>
                <p className="text-sm text-purple-700">Frontend to deployment</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-orange-50 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
              <div>
                <p className="font-semibold text-orange-900">Business Impact</p>
                <p className="text-sm text-orange-700">Measurable results</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Star className="h-8 w-8 text-yellow-500" />
              Featured Projects
            </h2>
            <p className="text-xl text-gray-600">Flagship applications with comprehensive case studies</p>
          </div>
          
          <div className="space-y-12">
            {featuredProjects.map((project: ProjectFrontmatter, index: number) => (
              <Card key={project.slug} className="overflow-hidden border-2 hover:border-blue-200 transition-all duration-300 hover:shadow-xl">
                <div className={`grid lg:grid-cols-2 gap-0 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  {/* Image Section */}
                  <div className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <ProjectImage
                      src={project.cover || project.image}
                      alt={project.title}
                      title={project.title}
                      className="h-80 lg:h-full"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-green-100 text-green-800 font-semibold">
                        {project.status || 'Live'}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <div className={`p-8 flex flex-col justify-center ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <div className="mb-4">
                      <Badge variant="secondary" className="mb-3 bg-blue-100 text-blue-800">
                        {project.category || 'Full-Stack Application'}
                      </Badge>
                      <h3 className="text-3xl font-bold mb-3">{project.title}</h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {project.longDescription || project.description}
                      </p>
                    </div>
                    
                    {/* Tech Stack */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Technology Stack</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.tags?.slice(0, 6).map((tech: string) => (
                          <Badge key={tech} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                            {tech}
                          </Badge>
                        ))}
                        {project.tags && project.tags.length > 6 && (
                          <Badge variant="secondary" className="text-xs bg-gray-200 text-gray-600">
                            +{project.tags.length - 6} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Timeline */}
                    {project.timeline && (
                      <div className="mb-6 flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">{project.timeline}</span>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button asChild className="bg-blue-600 hover:bg-blue-700">
                        <Link href={`/projects/${project.slug}`}>
                          View Case Study
                        </Link>
                      </Button>
                      {(project.links?.live || project.liveUrl) && (
                        <Button variant="outline" asChild>
                          <a href={project.links?.live || project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Live Demo
                          </a>
                        </Button>
                      )}
                      {(project.links?.repo || project.repository) && (
                        <Button variant="outline" asChild>
                          <a href={project.links?.repo || project.repository} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4 mr-2" />
                            Source Code
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Other Projects */}
      {otherProjects.length > 0 && (
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Additional Projects</h2>
            <p className="text-lg text-gray-600">More examples of technical expertise and problem-solving</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherProjects.map((project: ProjectFrontmatter) => (
              <Card key={project.slug} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200">
                <div className="aspect-video relative overflow-hidden">
                  <ProjectImage
                    src={project.cover || project.image}
                    alt={project.title}
                    title={project.title}
                    className="h-full"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </CardTitle>
                    {project.year && (
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {project.year}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {project.description || project.summary}
                  </p>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tags?.slice(0, 4).map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button size="sm" asChild className="flex-1">
                      <Link href={`/projects/${project.slug}`}>
                        View Details
                      </Link>
                    </Button>
                    {(project.links?.live || project.liveUrl) && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={project.links?.live || project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {(project.links?.repo || project.repository) && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={project.links?.repo || project.repository} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="text-center bg-gray-50 rounded-2xl p-12">
        <h2 className="text-3xl font-bold mb-4">Interested in Working Together?</h2>
        <p className="text-xl text-gray-600 mb-8">
          These projects represent my approach to building scalable, user-focused applications. 
          Let's discuss how I can bring this expertise to your team.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/contact">
              Get In Touch
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/resume">
              View Resume
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}