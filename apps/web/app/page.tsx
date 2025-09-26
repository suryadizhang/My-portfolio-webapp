import { getProfile } from '../src/lib/content'
import { generateSiteMetadata, generatePersonJsonLd } from '../src/lib/seo'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@portfolio/ui'
import { Calendar, MapPin, BookOpen, Award, Code2, Briefcase, GraduationCap, Trophy, Mail, Github, Linkedin, CheckCircle, Building2 } from 'lucide-react'
import Link from 'next/link'

export const metadata = generateSiteMetadata()

export default function HomePage() {
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
        {/* Hero Section - Modern Introduction */}
        <section className="mb-20">
          <div className="max-w-6xl mx-auto">
            {/* Professional Photo & Basic Info */}
            <div className="text-center mb-12">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-blue-100 shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/profile/profile-photo.jpg" 
                  alt={`${profile.name} - Professional headshot`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <p className="text-sm font-medium tracking-wide text-slate-500 uppercase mb-4">
                (He/Him) • Software Engineer
              </p>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-slate-900 mb-6">
                {profile.name}
              </h1>
              
              <div className="space-y-4 mb-8">
                <p className="max-w-4xl mx-auto text-xl leading-relaxed font-medium text-blue-600">
                  I'm a Full-Stack Software Engineer with real-world experience delivering responsive web apps and robust APIs using React, Next.js, Python, FastAPI, and Postgres.
                </p>
                <p className="max-w-4xl mx-auto text-lg leading-relaxed text-slate-700">
                  I turn ambiguous requirements into production-ready systems and ship continuously with CI/CD.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
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
                  <span>Software Engineer</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/contact">
                    <Mail className="mr-2 h-5 w-5" />
                    Get In Touch
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/resume">
                    View Resume
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/projects">
                    View Projects
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>







        {/* Professional Summary */}
        <section className="mb-20">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Code2 className="h-6 w-6 text-blue-600" />
                Professional Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Main Introduction */}
              <div className="text-lg leading-relaxed text-gray-700">
                <p className="mb-6">
                  I'm a <strong>Full-Stack Software Engineer</strong> with real-world experience delivering responsive web apps and robust APIs using 
                  <span className="text-blue-600 font-semibold"> React</span>, 
                  <span className="text-blue-600 font-semibold"> Next.js</span>, 
                  <span className="text-green-600 font-semibold"> Python</span>, 
                  <span className="text-purple-600 font-semibold"> FastAPI</span>, and 
                  <span className="text-indigo-600 font-semibold"> Postgres</span>. 
                  I turn ambiguous requirements into production-ready systems and ship continuously with CI/CD.
                </p>
              </div>

              {/* How I Work */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <span className="text-2xl">🚀</span>
                  How I Work
                </h3>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start space-x-4 group">
                    <span className="text-blue-600 font-bold text-lg mt-1 group-hover:scale-110 transition-transform">•</span>
                    <span className="leading-relaxed">Model data and design <strong>REST APIs</strong> with auth, pagination, and clear errors, documented with <strong>OpenAPI</strong></span>
                  </li>
                  <li className="flex items-start space-x-4 group">
                    <span className="text-blue-600 font-bold text-lg mt-1 group-hover:scale-110 transition-transform">•</span>
                    <span className="leading-relaxed">Build responsive <strong>React/Next.js UIs</strong> that perform well on mobile and are accessible by default</span>
                  </li>
                  <li className="flex items-start space-x-4 group">
                    <span className="text-blue-600 font-bold text-lg mt-1 group-hover:scale-110 transition-transform">•</span>
                    <span className="leading-relaxed">Add guardrails with validation (<strong>Pydantic/Zod</strong>), rate limiting, logging/metrics, and automated tests</span>
                  </li>
                  <li className="flex items-start space-x-4 group">
                    <span className="text-blue-600 font-bold text-lg mt-1 group-hover:scale-110 transition-transform">•</span>
                    <span className="leading-relaxed">Ship safely with <strong>GitHub Actions</strong> (lint, unit/integration tests, preview deploys)</span>
                  </li>
                </ul>
              </div>

              {/* Impact & Highlights */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <span className="text-2xl">💡</span>
                  Impact & Highlights
                </h3>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start space-x-4 group">
                    <span className="text-green-600 font-bold text-lg mt-1 group-hover:scale-110 transition-transform">•</span>
                    <span className="leading-relaxed">Shipped a live <strong>booking platform + admin</strong> (Next.js/TypeScript + FastAPI/Postgres) deployed on Vercel + VPS → role-based access, secure auth, rate limiting, automated deployments</span>
                  </li>
                  <li className="flex items-start space-x-4 group">
                    <span className="text-green-600 font-bold text-lg mt-1 group-hover:scale-110 transition-transform">•</span>
                    <span className="leading-relaxed">Increased deployment frequency by <strong>~30%</strong> with GitHub Actions pipelines → fewer regressions, faster delivery</span>
                  </li>
                  <li className="flex items-start space-x-4 group">
                    <span className="text-green-600 font-bold text-lg mt-1 group-hover:scale-110 transition-transform">•</span>
                    <span className="leading-relaxed">Reduced setup time in event operations by <strong>~15%</strong> by designing SOPs and automation</span>
                  </li>
                </ul>
              </div>

              {/* What I Build */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <span className="text-2xl">🛠️</span>
                  What I Build
                </h3>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start space-x-4 group">
                    <span className="text-purple-600 font-bold text-lg mt-1 group-hover:scale-110 transition-transform">•</span>
                    <span className="leading-relaxed"><strong>Booking/e-commerce flows</strong> that feel effortless on mobile</span>
                  </li>
                  <li className="flex items-start space-x-4 group">
                    <span className="text-purple-600 font-bold text-lg mt-1 group-hover:scale-110 transition-transform">•</span>
                    <span className="leading-relaxed"><strong>Well-documented APIs</strong> with strong auth and predictable error models</span>
                  </li>
                  <li className="flex items-start space-x-4 group">
                    <span className="text-purple-600 font-bold text-lg mt-1 group-hover:scale-110 transition-transform">•</span>
                    <span className="leading-relaxed"><strong>Admin dashboards</strong> with insights, bulk actions, and guardrails</span>
                  </li>
                  <li className="flex items-start space-x-4 group">
                    <span className="text-purple-600 font-bold text-lg mt-1 group-hover:scale-110 transition-transform">•</span>
                    <span className="leading-relaxed"><strong>CI/CD pipelines</strong> for confident daily releases</span>
                  </li>
                  <li className="flex items-start space-x-4 group">
                    <span className="text-purple-600 font-bold text-lg mt-1 group-hover:scale-110 transition-transform">•</span>
                    <span className="leading-relaxed"><strong>Systems that respect users</strong> — secure, performant, reliable</span>
                  </li>
                </ul>
              </div>

              {/* Personal Note */}
              <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-blue-500">
                <p className="text-gray-700 leading-relaxed">
                  <strong>Outside of coding:</strong> reading manga, playing video games, cooking, and exploring new frameworks. 
                  I thrive in environments where <strong>curiosity</strong>, <strong>collaboration</strong>, and <strong>shipping real value</strong> come first.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Experience Timeline */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
                <Briefcase className="h-8 w-8 text-blue-600" />
                Professional Experience
              </h2>
              <p className="text-gray-600">Building real products, delivering results</p>
            </div>
            
            <div className="space-y-8">
              {profile.experience.map((job, index) => (
                <Card key={index} className="border-l-4 border-l-blue-600">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div>
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <div className="flex items-center gap-2 text-gray-600 mt-2">
                          <Building2 className="h-4 w-4" />
                          <span className="font-semibold">{job.company}</span>
                          {job.type && (
                            <>
                              <span>•</span>
                              <Badge variant="secondary">{job.type}</Badge>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 mt-2 md:mt-0">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">{job.dates}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {job.highlights.map((highlight, highlightIndex) => (
                        <li key={highlightIndex} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 leading-relaxed">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Core Stack & Technologies */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
                <span className="text-4xl">🔑</span>
                Core Stack & Keywords
              </h2>
              <p className="text-gray-600">Full-stack expertise, production-ready solutions</p>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center max-w-5xl mx-auto">
              <span className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-base font-semibold border border-blue-200 hover:shadow-md hover:scale-105 transition-all duration-200">
                TypeScript/JavaScript
              </span>
              <span className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-full text-base font-semibold border border-green-200 hover:shadow-md hover:scale-105 transition-all duration-200">
                Python
              </span>
              <span className="inline-flex items-center px-4 py-2 bg-cyan-50 text-cyan-700 rounded-full text-base font-semibold border border-cyan-200 hover:shadow-md hover:scale-105 transition-all duration-200">
                React/Next.js
              </span>
              <span className="inline-flex items-center px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-base font-semibold border border-purple-200 hover:shadow-md hover:scale-105 transition-all duration-200">
                FastAPI/Flask
              </span>
              <span className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-base font-semibold border border-indigo-200 hover:shadow-md hover:scale-105 transition-all duration-200">
                Postgres/SQLAlchemy
              </span>
              <span className="inline-flex items-center px-4 py-2 bg-pink-50 text-pink-700 rounded-full text-base font-semibold border border-pink-200 hover:shadow-md hover:scale-105 transition-all duration-200">
                Tailwind CSS
              </span>
              <span className="inline-flex items-center px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-base font-semibold border border-orange-200 hover:shadow-md hover:scale-105 transition-all duration-200">
                GitHub Actions
              </span>
              <span className="inline-flex items-center px-4 py-2 bg-violet-50 text-violet-700 rounded-full text-base font-semibold border border-violet-200 hover:shadow-md hover:scale-105 transition-all duration-200">
                Vercel
              </span>
              <span className="inline-flex items-center px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-base font-semibold border border-amber-200 hover:shadow-md hover:scale-105 transition-all duration-200">
                OpenAPI/Swagger
              </span>
              <span className="inline-flex items-center px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-base font-semibold border border-teal-200 hover:shadow-md hover:scale-105 transition-all duration-200">
                Full-Stack Development
              </span>
            </div>
          </div>
        </section>

        {/* Education & Certifications */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
                <GraduationCap className="h-8 w-8 text-blue-600" />
                Education & Certifications
              </h2>
              <p className="text-gray-600">Continuous learning, professional development</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Education */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Education
                </h3>
                {profile.education.map((edu, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{edu.program}</h4>
                          <p className="text-gray-600">{edu.school}</p>
                        </div>
                        {edu.dates && <Badge variant="outline">{edu.dates}</Badge>}
                      </div>
                      {edu.notes && (
                        <p className="text-sm text-gray-600 mt-2">{edu.notes}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Certifications */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-blue-600" />
                  Certifications
                </h3>
                {profile.certifications.map((cert, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="h-5 w-5 text-yellow-600" />
                        <h4 className="font-semibold">{cert.name}</h4>
                      </div>
                      <p className="text-gray-600 mb-2">{cert.issuer}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{cert.date}</Badge>
                        <span className="text-sm text-gray-500">ID: {cert.id}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Personal Touch */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
                <span className="text-4xl">✨</span>
                Personal Touch
              </h2>
              <p className="text-gray-600">Beyond the code - what drives and inspires me</p>
            </div>
            
            <Card>
              <CardContent className="pt-8">
                <div className="prose prose-lg max-w-none">
                  <p className="text-center text-gray-700 mb-6">
                    When I'm not architecting scalable solutions, you'll find me exploring emerging tech trends, 
                    contributing to open-source projects, and learning through discussions and knowledge sharing with fellow developers. I believe the best 
                    code comes from understanding both the technical and human aspects of problem-solving.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <div className="text-center">
                      <div className="text-3xl mb-2">🌱</div>
                      <h3 className="font-semibold mb-2">Continuous Learning</h3>
                      <p className="text-sm text-gray-600">Always exploring new technologies and best practices</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl mb-2">🤝</div>
                      <h3 className="font-semibold mb-2">Community Builder</h3>
                      <p className="text-sm text-gray-600">Active in developer communities and open source</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl mb-2">🎯</div>
                      <h3 className="font-semibold mb-2">Problem Solver</h3>
                      <p className="text-sm text-gray-600">Passionate about clean, efficient, and scalable solutions</p>
                    </div>
                  </div>
                  
                  <div className="mt-8 text-center">
                    <h3 className="text-xl font-semibold mb-6">Personal Interests</h3>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {profile.hobbies.map((hobby, index) => (
                        <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700 px-4 py-2 hover:shadow-md hover:scale-105 transition-all duration-200">
                          {hobby}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Build Something Great?</h2>
              <p className="text-gray-600 mb-6 text-lg">
                I'm actively looking for opportunities where I can contribute to meaningful projects, 
                work with great teams, and continue growing as an engineer.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/contact">
                    <Mail className="mr-2 h-5 w-5" />
                    Start a Conversation
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="mr-2 h-5 w-5" />
                    Connect on LinkedIn
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href={profile.contact.github} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-5 w-5" />
                    View GitHub
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  )
}