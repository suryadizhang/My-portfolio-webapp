import { getProjectBySlug } from '@/lib/content'
import { getProject } from '@/data/projects'
import { generateSiteMetadata, generateProjectJsonLd } from '@/lib/seo'
import { ProjectImage } from '@/components/project-image'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@portfolio/ui'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Github, Heart, Eye, Code2, Briefcase, Star, ChevronRight } from 'lucide-react'

// Disable static generation to avoid React version conflicts during build
export const dynamic = 'force-dynamic'

interface ProjectPageProps {
  params: Promise<{
    slug: string
  }>
}

// Disable generateStaticParams during CI to avoid prerender issues
// export async function generateStaticParams() {
//   const projects = getAllProjects()
//   return projects.map((project: ProjectFrontmatter) => ({
//     slug: project.slug,
//   }))
// }

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  
  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  return generateSiteMetadata(
    project.frontmatter.title,
    project.frontmatter.summary,
    `/projects/${slug}`
  )
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  const projectData = getProject(slug) // Get project data including children

  if (!project) {
    notFound()
  }

  const { frontmatter, content } = project

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateProjectJsonLd(frontmatter)),
        }}
      />
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Back button */}
            <div className="mb-8">
              <Button variant="ghost" asChild>
                <Link href="/projects">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Projects
                </Link>
              </Button>
            </div>

            {/* Project header */}
            <div className="mb-12">
              <div className="flex flex-wrap gap-2 mb-4">
                {frontmatter.tags?.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="">
                    {tag}
                  </Badge>
                )) || []}
              </div>
              
              <h1 className="text-4xl font-bold mb-4">{frontmatter.title}</h1>
              <p className="text-xl text-muted-foreground mb-6">{frontmatter.summary}</p>
            </div>

            {/* Project cover image */}
            <div className="mb-12">
              <ProjectImage
                src={frontmatter.cover || frontmatter.image}
                alt={frontmatter.title}
                title={frontmatter.title}
                className="rounded-lg overflow-hidden aspect-video"
              />
            </div>

            {/* Project content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {/* Temporarily render as plain text to avoid React version conflicts */}
              <div className="bg-muted/50 rounded-lg p-6">
                <p className="text-sm text-muted-foreground mb-2">Project Content:</p>
                <div className="whitespace-pre-wrap font-mono text-sm">{content}</div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Note: Full MDX rendering will be restored after resolving build dependencies.
              </p>
            </div>

            {/* Child Projects Section */}
            {projectData?.children && projectData.children.length > 0 && (
              <div className="mt-16">
                <div className="flex items-center gap-3 mb-8">
                  <Briefcase className="h-6 w-6 text-linkedin-600" />
                  <h2 className="text-3xl font-bold">Project Components</h2>
                </div>
                <p className="text-gray-600 mb-8">
                  This project consists of multiple integrated components working together to deliver a complete solution.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {projectData.children.map((child) => (
                    <Card key={child.slug} className="group hover:shadow-lg hover:border-linkedin-200 transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="group-hover:text-linkedin-600 transition-colors">
                              {child.title}
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-2">{child.summary}</p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-linkedin-600 transition-colors" />
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {child.tags.slice(0, 4).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                              <Code2 className="h-3 w-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                          {child.tags.length > 4 && (
                            <Badge variant="secondary" className="text-xs bg-gray-200 text-gray-600">
                              +{child.tags.length - 4}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" asChild className="flex-1">
                            <Link href={`/projects/${slug}/${child.slug}`}>
                              View Details
                            </Link>
                          </Button>
                          {child.repo && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={child.repo} target="_blank" rel="noopener noreferrer">
                                <Github className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          {child.live && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={child.live} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Architecture Overview */}
                <Card className="mt-8 bg-gradient-to-r from-linkedin-50 to-blue-50 border-linkedin-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-linkedin-700">
                      <Star className="h-5 w-5" />
                      System Architecture
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">
                      This is a comprehensive full-stack solution demonstrating enterprise-level architecture 
                      with separation of concerns, scalable design patterns, and production-ready deployment practices.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-linkedin-600 text-white">Full-Stack</Badge>
                      <Badge className="bg-green-600 text-white">Production-Ready</Badge>
                      <Badge className="bg-purple-600 text-white">Scalable Architecture</Badge>
                      <Badge className="bg-orange-600 text-white">CI/CD Pipeline</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Project Info */}
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Project Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Year:</span>
                    <span className="ml-2 font-medium">{frontmatter.year}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Technologies:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {frontmatter.tags?.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      )) || []}
                    </div>
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="space-y-3">
                {(frontmatter.links?.live || frontmatter.liveUrl) && (
                  <Button className="w-full" asChild>
                    <a href={frontmatter.links?.live || frontmatter.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Live
                    </a>
                  </Button>
                )}
                {(frontmatter.links?.repo || frontmatter.repository) && (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={frontmatter.links?.repo || frontmatter.repository} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-2" />
                      View Source
                    </a>
                  </Button>
                )}
              </div>

              {/* Engagement placeholders */}
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Engagement</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-muted-foreground">
                      <Heart className="h-4 w-4 mr-2" />
                      Likes
                    </span>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-muted-foreground">
                      <Eye className="h-4 w-4 mr-2" />
                      Views
                    </span>
                    <span className="font-medium">156</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}