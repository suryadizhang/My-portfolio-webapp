import { getProject, getChildProject } from '@/data/projects'
import { generateSiteMetadata } from '@/lib/seo'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@portfolio/ui'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Github, Code2, Briefcase, Star, CheckCircle } from 'lucide-react'

interface ChildProjectPageProps {
  params: Promise<{
    slug: string
    child: string
  }>
}

export async function generateMetadata({ params }: ChildProjectPageProps) {
  const { slug, child } = await params
  const childProject = getChildProject(slug, child)
  const parentProject = getProject(slug)
  
  if (!childProject || !parentProject) {
    return {
      title: 'Project Not Found',
    }
  }

  return generateSiteMetadata(
    `${childProject.title} | ${parentProject.title}`,
    childProject.summary,
    `/projects/${slug}/${child}`
  )
}

export default async function ChildProjectPage({ params }: ChildProjectPageProps) {
  const { slug, child } = await params
  const childProject = getChildProject(slug, child)
  const parentProject = getProject(slug)

  if (!childProject || !parentProject) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
          <Link href="/projects" className="hover:text-linkedin-600 transition-colors">
            Projects
          </Link>
          <span>/</span>
          <Link href={`/projects/${slug}`} className="hover:text-linkedin-600 transition-colors">
            {parentProject.title}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{childProject.title}</span>
        </div>

        {/* Back Button */}
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href={`/projects/${slug}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to {parentProject.title}
            </Link>
          </Button>
        </div>

        {/* Project Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary" className="bg-linkedin-50 text-linkedin-700 border-linkedin-200">
              <Briefcase className="h-3 w-3 mr-1" />
              Sub-Project
            </Badge>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
              {parentProject.title}
            </Badge>
          </div>
          
          <h1 className="text-4xl font-bold mb-4 text-gray-900">{childProject.title}</h1>
          <p className="text-xl text-gray-600 mb-6 leading-relaxed">{childProject.summary}</p>
          
          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-6">
            {childProject.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-700">
                <Code2 className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {childProject.repo && (
              <Button asChild className="bg-gray-900 hover:bg-gray-800">
                <a href={childProject.repo} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  View Source Code
                </a>
              </Button>
            )}
            {childProject.live && (
              <Button variant="outline" asChild>
                <a href={childProject.live} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Live Demo
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Project Description */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Project Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed text-lg">
              {childProject.description}
            </p>
          </CardContent>
        </Card>

        {/* Technical Implementation Details */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-blue-500" />
              Technical Implementation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* This would be populated with more detailed technical information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Key Features
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    {getKeyFeatures(child).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-purple-500" />
                    Technology Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {childProject.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-indigo-500" />
              Related Components
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {parentProject.children?.filter(c => c.slug !== child).map((sibling) => (
                <Link 
                  key={sibling.slug} 
                  href={`/projects/${slug}/${sibling.slug}`}
                  className="block group"
                >
                  <div className="p-4 border rounded-lg hover:border-linkedin-200 hover:bg-linkedin-50 transition-colors">
                    <h5 className="font-semibold text-gray-900 group-hover:text-linkedin-600 mb-2">
                      {sibling.title}
                    </h5>
                    <p className="text-sm text-gray-600 mb-3">{sibling.summary}</p>
                    <div className="flex flex-wrap gap-1">
                      {sibling.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs bg-gray-100">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
              
              {/* Link back to parent project overview */}
              <Link 
                href={`/projects/${slug}`}
                className="block group"
              >
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-linkedin-300 hover:bg-linkedin-50 transition-colors">
                  <h5 className="font-semibold text-gray-900 group-hover:text-linkedin-600 mb-2">
                    📊 Project Overview
                  </h5>
                  <p className="text-sm text-gray-600">
                    View the complete {parentProject.title} project with all components and architecture
                  </p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Helper function to get key features based on project type
function getKeyFeatures(childSlug: string): string[] {
  const features: Record<string, string[]> = {
    customer: [
      'SEO-optimized Next.js architecture',
      'Responsive design with Tailwind CSS',
      'Booking interface with form validation',
      'Menu display with filtering',
      'Contact forms with email integration',
      'Performance optimization and analytics'
    ],
    admin: [
      'Role-based access control (RBAC)',
      'Real-time booking management dashboard',
      'Customer data management',
      'Staff scheduling and management',
      'Revenue and analytics reporting',
      'Secure authentication with JWT'
    ],
    backend: [
      'RESTful API with FastAPI framework',
      'JWT-based authentication system',
      'PostgreSQL database with SQLAlchemy ORM',
      'Stripe payment processing integration',
      'Email notification service',
      'Rate limiting and security middleware',
      'Comprehensive OpenAPI documentation'
    ],
    devops: [
      'GitHub Actions CI/CD pipeline',
      'Multi-environment deployment strategy',
      'Docker containerization',
      'VPS deployment with SSH automation',
      'Nginx reverse proxy configuration',
      'Monitoring and logging setup',
      'Automated testing and deployment'
    ]
  }

  return features[childSlug] || ['Feature documentation coming soon...']
}