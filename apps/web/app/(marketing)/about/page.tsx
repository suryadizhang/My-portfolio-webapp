import { Calendar, MapPin, BookOpen, Award, Code2 } from 'lucide-react'
import Image from 'next/image'

export const metadata = {
  title: 'About - Your Name',
  description: 'Learn more about my journey as a full-stack developer, my skills, and what drives my passion for creating digital experiences.',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl font-bold mb-6">About Me</h1>
            <p className="text-xl text-muted-foreground mb-6">
              I'm a passionate full-stack developer with a love for creating digital experiences 
              that are not just functional, but truly meaningful to users.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              With over 5 years of experience in web development, I specialize in modern 
              JavaScript frameworks, cloud architecture, and building scalable applications 
              that solve real-world problems.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Available for work</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Placeholder for profile image */}
              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                <span className="text-primary font-medium">Professional Photo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Technical Skills</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Code2 className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Frontend</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vue.js', 'Nuxt.js'].map((skill) => (
                <span 
                  key={skill}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Backend</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker'].map((skill) => (
                <span 
                  key={skill}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Tools & Cloud</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {['AWS', 'Vercel', 'Git', 'Figma', 'Jest', 'Cypress'].map((skill) => (
                <span 
                  key={skill}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Experience</h2>
        <div className="space-y-8">
          <div className="relative pl-8 border-l-2 border-primary/20">
            <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full"></div>
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <h3 className="text-xl font-semibold">Senior Full-Stack Developer</h3>
                <span className="text-sm text-muted-foreground">2022 - Present</span>
              </div>
              <p className="text-primary font-medium">TechCorp Inc.</p>
              <p className="text-muted-foreground">
                Led a team of 4 developers in building scalable web applications using React, Node.js, 
                and AWS. Improved application performance by 40% and reduced deployment time by 60%.
              </p>
            </div>
          </div>

          <div className="relative pl-8 border-l-2 border-primary/20">
            <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full"></div>
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <h3 className="text-xl font-semibold">Full-Stack Developer</h3>
                <span className="text-sm text-muted-foreground">2020 - 2022</span>
              </div>
              <p className="text-primary font-medium">StartupXYZ</p>
              <p className="text-muted-foreground">
                Developed and maintained multiple client projects using modern web technologies. 
                Built RESTful APIs and implemented real-time features using WebSocket technology.
              </p>
            </div>
          </div>

          <div className="relative pl-8 border-l-2 border-primary/20">
            <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full"></div>
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <h3 className="text-xl font-semibold">Frontend Developer</h3>
                <span className="text-sm text-muted-foreground">2019 - 2020</span>
              </div>
              <p className="text-primary font-medium">WebAgency</p>
              <p className="text-muted-foreground">
                Created responsive websites and web applications for various clients. 
                Collaborated with designers to implement pixel-perfect UI/UX designs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Beyond Code</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">What Drives Me</h3>
            <p className="text-muted-foreground">
              I believe technology should empower people and solve meaningful problems. 
              Whether it's building a seamless user interface or architecting a robust backend, 
              I'm always thinking about the human impact of what I create.
            </p>
            <p className="text-muted-foreground">
              I'm passionate about continuous learning, open-source contribution, and 
              mentoring other developers. When I'm not coding, you'll find me exploring 
              new technologies, reading tech blogs, or contributing to community projects.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Interests & Hobbies</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>🎨 UI/UX Design and prototyping</li>
              <li>📚 Tech blogs and industry publications</li>
              <li>🎮 Game development (hobby projects)</li>
              <li>🏃‍♂️ Running and outdoor activities</li>
              <li>☕ Coffee brewing and local cafes</li>
              <li>🎵 Music production and sound design</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}