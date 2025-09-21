import { getProfile, type Profile } from '@/lib/content'
import { generateSiteMetadata, generatePersonJsonLd } from '@/lib/seo'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@portfolio/ui'
import { Calendar, MapPin, BookOpen, Award, Code2, Briefcase, GraduationCap, Trophy, ExternalLink, Mail, Phone, Github, Linkedin, CheckCircle, Star, Building2 } from 'lucide-react'
import Link from 'next/link'

export const metadata = generateSiteMetadata(
  'About',
  'Learn about Suryadi Zhang - Full-Stack Software Engineer with real-world experience building production applications with React, Next.js, Python, and FastAPI.'
)

export default function AboutPage() {
  const profile = getProfile()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generatePersonJsonLd(profile)),
        }}
      />
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section - Professional Introduction */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Available for immediate hire
            </div>
            
            <h1 className="text-5xl font-bold mb-6">About {profile.name}</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-8">{profile.headline}</h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Mail className="h-5 w-5 text-blue-600" />
                <span>{profile.contact.email}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>Open to opportunities</span>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/contact">
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Me
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/api/resume">
                  Download Resume
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="mr-2 h-5 w-5" />
                  LinkedIn Profile
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Professional Summary */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="prose prose-lg max-w-none text-gray-700">
                {profile.summary.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 leading-relaxed">
                    {paragraph.replace(/•/g, '').trim()}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Experience Timeline */}
        <section className="mb-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                <Briefcase className="h-8 w-8 text-blue-600" />
                Professional Experience
              </h2>
              <p className="text-xl text-gray-600">Building production applications with real business impact</p>
            </div>
            
            <div className="space-y-8">
              {profile.experience.map((job, index) => (
                <Card key={index} className="overflow-hidden border-2 hover:border-blue-200 transition-colors">
                  <CardHeader className="bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl text-gray-900 mb-2">{job.title}</CardTitle>
                        <div className="flex items-center gap-4 text-gray-600">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            <span className="font-semibold">{job.company}</span>
                          </div>
                          {job.type && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              {job.type}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="bg-green-100 text-green-800 mb-2">
                          {job.dates}
                        </Badge>
                        <div className="flex items-center gap-1 text-yellow-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-6">
                    <div className="grid gap-4">
                      {job.highlights.map((highlight, highlightIndex) => (
                        <div key={highlightIndex} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <p className="text-gray-700 leading-relaxed">{highlight}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="mb-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                <Code2 className="h-8 w-8 text-blue-600" />
                Technical Expertise
              </h2>
              <p className="text-xl text-gray-600">Core technologies I use to build production applications</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Frontend */}
              <Card className="border-2 hover:border-blue-200 transition-colors">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Code2 className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle>Frontend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS'].map((skill) => (
                      <Badge key={skill} variant="secondary" className="bg-blue-50 text-blue-700">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Backend */}
              <Card className="border-2 hover:border-blue-200 transition-colors">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle>Backend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {['Python', 'FastAPI', 'Flask', 'Postgres', 'SQLAlchemy'].map((skill) => (
                      <Badge key={skill} variant="secondary" className="bg-purple-50 text-purple-700">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* DevOps & Tools */}
              <Card className="border-2 hover:border-blue-200 transition-colors">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle>DevOps & Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {['CI/CD', 'GitHub Actions', 'Vercel', 'OpenAPI/Swagger', 'pytest'].map((skill) => (
                      <Badge key={skill} variant="secondary" className="bg-green-50 text-green-700">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* All Skills */}
            <div className="mt-12 text-center">
              <h3 className="text-2xl font-semibold mb-6">Complete Tech Stack</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {profile.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-4 py-2">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Education & Certifications */}
        <section className="mb-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                <GraduationCap className="h-8 w-8 text-blue-600" />
                Education & Certifications
              </h2>
              <p className="text-xl text-gray-600">Formal education and professional certifications</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Education */}
              <Card className="border-2 hover:border-blue-200 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <GraduationCap className="h-6 w-6 text-blue-600" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {profile.education.map((edu, index) => (
                      <div key={index} className="border-l-4 border-blue-200 pl-4">
                        <h4 className="font-semibold text-lg">{edu.program}</h4>
                        <p className="text-blue-600 font-medium">{edu.school}</p>
                        <p className="text-gray-600 text-sm">{edu.dates}</p>
                        <p className="text-gray-700 text-sm mt-2">{edu.notes}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Certifications */}
              <Card className="border-2 hover:border-blue-200 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Trophy className="h-6 w-6 text-blue-600" />
                    Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.certifications.map((cert, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Trophy className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{cert.name}</h4>
                          <p className="text-blue-600 font-medium text-sm">{cert.issuer}</p>
                          <p className="text-gray-600 text-sm">{cert.date}</p>
                          <Badge variant="secondary" className="mt-2 text-xs">
                            ID: {cert.id}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Personal Section */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Beyond the Code</h2>
              <p className="text-xl text-gray-600">What drives me and what I enjoy outside of work</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                  <Star className="h-6 w-6 text-yellow-500" />
                  What Drives Me
                </h3>
                <div className="prose prose-lg text-gray-700">
                  <p className="mb-4">
                    I thrive in environments where <strong>curiosity, collaboration, and shipping real value</strong> come first. 
                    My passion lies in turning ambiguous requirements into production-ready systems that users actually love.
                  </p>
                  <p className="mb-4">
                    I believe the best software is built when you deeply understand the problem you're solving. 
                    Whether it's optimizing a booking flow or designing an API, I'm always thinking about the 
                    human impact and business value.
                  </p>
                  <p>
                    Continuous learning is core to who I am. The tech landscape evolves rapidly, and I love 
                    exploring new frameworks, best practices, and approaches that can deliver better outcomes.
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-green-500" />
                  Interests & Hobbies
                </h3>
                <div className="space-y-3">
                  {profile.hobbies.map((hobby, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                      </div>
                      <span className="text-gray-700">{hobby}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 p-6 bg-blue-50 rounded-xl">
                  <h4 className="font-semibold text-blue-900 mb-2">Fun Fact</h4>
                  <p className="text-blue-800">
                    I'm experimenting with hibachi recipes and love the precision required—just like writing clean, 
                    efficient code! There's something satisfying about both perfecting a dish and optimizing an algorithm.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-4">Let's Build Something Great Together</h2>
            <p className="text-xl text-gray-600 mb-8">
              I'm always excited to discuss new opportunities, interesting technical challenges, 
              or just connect with fellow developers and industry professionals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/contact">
                  <Mail className="mr-2 h-5 w-5" />
                  Get In Touch
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/projects">
                  <Briefcase className="mr-2 h-5 w-5" />
                  View My Projects
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href={profile.contact.github} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-5 w-5" />
                  GitHub Profile
                </a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}