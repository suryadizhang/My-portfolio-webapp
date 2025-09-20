import { getAllProjects, getProjectBySlug, type ProjectFrontmatter } from '@/lib/content'
import { generateSiteMetadata, generateProjectJsonLd } from '@/lib/seo'
import { ProjectImage } from '@/components/project-image'
import { Badge, Button } from '@portfolio/ui'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Github, Heart, Eye } from 'lucide-react'

interface ProjectPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const projects = getAllProjects()
  return projects.map((project: ProjectFrontmatter) => ({
    slug: project.slug,
  }))
}

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
                {frontmatter.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <h1 className="text-4xl font-bold mb-4">{frontmatter.title}</h1>
              <p className="text-xl text-muted-foreground mb-6">{frontmatter.summary}</p>
            </div>

            {/* Project cover image */}
            <div className="mb-12">
              <ProjectImage
                src={frontmatter.cover}
                alt={frontmatter.title}
                title={frontmatter.title}
                className="rounded-lg overflow-hidden aspect-video"
              />
            </div>

            {/* Project content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <MDXRemote source={content} />
            </div>
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
                      {frontmatter.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="space-y-3">
                {frontmatter.links.live && (
                  <Button className="w-full" asChild>
                    <a href={frontmatter.links.live} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Live
                    </a>
                  </Button>
                )}
                {frontmatter.links.repo && (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={frontmatter.links.repo} target="_blank" rel="noopener noreferrer">
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