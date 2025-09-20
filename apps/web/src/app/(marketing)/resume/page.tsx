import { getProfile, type Profile } from '@/lib/content'
import { generateSiteMetadata } from '@/lib/seo'
import { Badge, Button } from '@portfolio/ui'
import { Eye, FileText, Calendar, MapPin, Mail } from 'lucide-react'

export const metadata = generateSiteMetadata(
  'Resume',
  'View and download my professional resume showcasing my experience, skills, and achievements as a full-stack developer.',
  '/resume'
)

export default function ResumePage() {
  const profile = getProfile()

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Resume</h1>
        <p className="text-xl text-muted-foreground mb-8">
          {profile.about.summary}
        </p>
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <a href={`mailto:${profile.email}?subject=Resume Request`}>
              <Mail className="h-4 w-4 mr-2" />
              Email me for resume
            </a>
          </Button>
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            View Online
          </Button>
        </div>
      </div>

      {/* Resume Content */}
      <div className="max-w-4xl mx-auto">
        {/* PDF Viewer Placeholder */}
        <div className="mb-12">
          <div className="relative aspect-[8.5/11] bg-card border rounded-lg overflow-hidden shadow-lg">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Resume Preview</h3>
              <p className="text-muted-foreground mb-4">
                Interactive PDF viewer will be displayed here
              </p>
              <p className="text-sm text-muted-foreground">
                Email me for the full resume document
              </p>
            </div>
          </div>
        </div>

        {/* Resume Summary */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Professional Summary */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Professional Summary</h2>
            <p className="text-muted-foreground">
              {profile.about.summary}
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-primary" />
                <span>Available for work</span>
              </div>
            </div>
          </div>

          {/* Key Skills */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Key Skills</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skillsPrimary.slice(0, 12).map((skill: string) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className="space-y-8 mb-12">
          <h2 className="text-2xl font-bold">Experience</h2>
          
          <div className="space-y-6">
            {profile.experience.map((exp: any, index: number) => (
              <div key={index} className="border-l-2 border-primary/20 pl-6">
                <div className="relative -ml-8 mb-4">
                  <div className="absolute w-4 h-4 bg-primary rounded-full"></div>
                </div>
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <h3 className="text-xl font-semibold">{exp.role}</h3>
                    <span className="text-sm text-muted-foreground">{exp.dates}</span>
                  </div>
                  <p className="text-primary font-medium">{exp.company} • {exp.location}</p>
                  <ul className="text-muted-foreground space-y-1 text-sm">
                    {exp.bullets.map((bullet: string, bulletIndex: number) => (
                      <li key={bulletIndex}>• {bullet}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education & Certifications */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Education</h2>
            <div className="space-y-4">
              {profile.education.map((edu: any, index: number) => (
                <div key={index} className="space-y-1">
                  <h3 className="font-semibold">{edu.school}</h3>
                  <p className="text-sm text-primary">{edu.program}</p>
                  <p className="text-xs text-muted-foreground">{edu.dates}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-6">Certifications</h2>
            <div className="space-y-4">
              {profile.certs.map((cert: any, index: number) => (
                <div key={index} className="space-y-1">
                  <h3 className="font-semibold">{cert.name}</h3>
                  <p className="text-sm text-primary">{cert.issuer}</p>
                  <p className="text-xs text-muted-foreground">{cert.issued}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Download CTA */}
        <div className="text-center mt-16 p-8 bg-primary/5 rounded-lg border border-primary/20">
          <h3 className="text-xl font-semibold mb-4">Want the Complete Resume?</h3>
          <p className="text-muted-foreground mb-6">
            Email me to receive the full PDF version with detailed work history, education, and project details.
          </p>
          <Button asChild>
            <a href={`mailto:${profile.email}?subject=Resume Request&body=Hi ${profile.name}, I'd like to request a copy of your resume.`}>
              <Mail className="h-4 w-4 mr-2" />
              Request Full Resume
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}