import { Download, Eye, FileText, Calendar, MapPin } from 'lucide-react'

export const metadata = {
  title: 'Resume - Your Name',
  description: 'View and download my professional resume showcasing my experience, skills, and achievements as a full-stack developer.',
}

export default function ResumePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Resume</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Full-Stack Developer with 5+ years of experience building scalable web applications
        </p>
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium">
            <Download className="h-4 w-4" />
            Download PDF
          </button>
          <button className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-lg hover:bg-accent transition-colors font-medium">
            <Eye className="h-4 w-4" />
            View Online
          </button>
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
                Click "Download PDF" to get the full resume document
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
              Experienced Full-Stack Developer with expertise in React, Node.js, and cloud technologies. 
              Proven track record of delivering high-quality applications and leading development teams.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-primary" />
                <span>5+ Years Experience</span>
              </div>
            </div>
          </div>

          {/* Key Skills */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Key Skills</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                'React & Next.js',
                'TypeScript',
                'Node.js',
                'PostgreSQL',
                'AWS/Cloud',
                'Docker',
                'Git/GitHub',
                'Agile/Scrum'
              ].map((skill) => (
                <div key={skill} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-card p-6 rounded-lg border text-center">
            <div className="text-2xl font-bold text-primary mb-2">5+</div>
            <div className="text-sm text-muted-foreground">Years Experience</div>
          </div>
          <div className="bg-card p-6 rounded-lg border text-center">
            <div className="text-2xl font-bold text-primary mb-2">50+</div>
            <div className="text-sm text-muted-foreground">Projects Completed</div>
          </div>
          <div className="bg-card p-6 rounded-lg border text-center">
            <div className="text-2xl font-bold text-primary mb-2">3</div>
            <div className="text-sm text-muted-foreground">Companies</div>
          </div>
          <div className="bg-card p-6 rounded-lg border text-center">
            <div className="text-2xl font-bold text-primary mb-2">10+</div>
            <div className="text-sm text-muted-foreground">Technologies</div>
          </div>
        </div>

        {/* Recent Experience */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold">Recent Experience</h2>
          
          <div className="space-y-6">
            <div className="border-l-2 border-primary/20 pl-6">
              <div className="relative -ml-8 mb-4">
                <div className="absolute w-4 h-4 bg-primary rounded-full"></div>
              </div>
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <h3 className="text-xl font-semibold">Senior Full-Stack Developer</h3>
                  <span className="text-sm text-muted-foreground">2022 - Present</span>
                </div>
                <p className="text-primary font-medium">TechCorp Inc.</p>
                <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Led development of React-based web applications serving 100K+ users</li>
                  <li>Improved application performance by 40% through optimization techniques</li>
                  <li>Mentored junior developers and conducted code reviews</li>
                </ul>
              </div>
            </div>

            <div className="border-l-2 border-primary/20 pl-6">
              <div className="relative -ml-8 mb-4">
                <div className="absolute w-4 h-4 bg-primary/60 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <h3 className="text-xl font-semibold">Full-Stack Developer</h3>
                  <span className="text-sm text-muted-foreground">2020 - 2022</span>
                </div>
                <p className="text-primary font-medium">StartupXYZ</p>
                <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Built RESTful APIs and microservices using Node.js and Express</li>
                  <li>Implemented real-time features using WebSocket technology</li>
                  <li>Collaborated with design team to create responsive UIs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Download CTA */}
        <div className="text-center mt-16 p-8 bg-primary/5 rounded-lg border border-primary/20">
          <h3 className="text-xl font-semibold mb-4">Want the Complete Resume?</h3>
          <p className="text-muted-foreground mb-6">
            Download the full PDF version with detailed work history, education, and project details.
          </p>
          <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium">
            <Download className="h-4 w-4" />
            Download Full Resume (PDF)
          </button>
        </div>
      </div>
    </div>
  )
}