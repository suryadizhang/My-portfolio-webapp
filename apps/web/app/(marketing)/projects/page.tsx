export const metadata = {
  title: 'Projects - Your Name',
  description: 'A showcase of my development projects and technical expertise.',
}

export default function ProjectsPage() {
  // This will eventually load from MDX content
  const projects = [
    {
      id: 1,
      title: 'AI-Powered Booking Platform',
      summary: 'Full-stack booking application with AI recommendations, real-time availability, and secure payment processing.',
      tags: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'AI/ML'],
      year: 2024,
      featured: true,
    },
    {
      id: 2,
      title: 'E-Commerce Analytics Dashboard',
      summary: 'Real-time analytics dashboard for e-commerce businesses with data visualization and automated reporting.',
      tags: ['React', 'D3.js', 'Node.js', 'MongoDB', 'Chart.js'],
      year: 2024,
      featured: true,
    },
    {
      id: 3,
      title: 'Task Management PWA',
      summary: 'Progressive Web App for team task management with offline functionality and real-time collaboration.',
      tags: ['Vue.js', 'PWA', 'IndexedDB', 'Socket.io', 'Service Workers'],
      year: 2023,
      featured: false,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="max-w-2xl mb-16">
        <h1 className="text-4xl font-bold mb-4">Projects</h1>
        <p className="text-xl text-muted-foreground">
          A collection of projects that showcase my skills in full-stack development, 
          from AI-powered applications to progressive web apps.
        </p>
      </div>

      {/* Featured Projects */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-8">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects
            .filter(project => project.featured)
            .map((project) => (
              <div
                key={project.id}
                className="bg-card text-card-foreground rounded-lg border overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                  <span className="text-primary font-medium">Project Screenshot</span>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {project.summary}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{project.year}</span>
                    <a href="#" className="text-primary hover:text-primary/80 font-medium">
                      View Project →
                    </a>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* All Projects */}
      <section>
        <h2 className="text-2xl font-semibold mb-8">All Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`bg-card text-card-foreground rounded-lg border overflow-hidden hover:shadow-lg transition-shadow group ${
                project.featured ? 'ring-2 ring-primary/20' : ''
              }`}
            >
              <div className="h-48 bg-gradient-to-br from-muted/40 to-muted/60 flex items-center justify-center">
                <span className="text-muted-foreground font-medium">Project Screenshot</span>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  {project.featured && (
                    <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {project.summary}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{project.year}</span>
                  <a href="#" className="text-primary hover:text-primary/80 font-medium">
                    View Project →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-semibold mb-4">Interested in working together?</h2>
          <p className="text-muted-foreground mb-8">
            I'm always open to discussing new opportunities and interesting projects.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/contact"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Get In Touch
            </a>
            <a
              href="/resume"
              className="border border-border px-6 py-3 rounded-lg hover:bg-accent transition-colors"
            >
              View Resume
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}