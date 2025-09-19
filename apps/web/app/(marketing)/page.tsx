export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto mb-20">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Your Name
        </h1>
        <p className="text-xl text-muted-foreground mb-2">
          Full-Stack Developer
        </p>
        <p className="text-lg text-muted-foreground mb-8">
          Full-Stack Engineer building secure booking apps & AI-powered tools.
        </p>
        
        <div className="flex gap-4 justify-center">
          <a 
            href="/projects" 
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            View Projects
          </a>
          <a 
            href="/contact" 
            className="border border-border px-6 py-3 rounded-lg hover:bg-accent transition-colors"
          >
            Get In Touch
          </a>
        </div>
      </section>

      {/* Project Highlights */}
      <section className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-semibold text-center mb-12">Featured Work</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Placeholder project cards */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card text-card-foreground rounded-lg border overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                <span className="text-primary font-medium">Project {i} Screenshot</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Featured Project {i}</h3>
                <p className="text-muted-foreground mb-4">
                  Description of this amazing project that showcases modern web development.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs bg-secondary rounded-full">Next.js</span>
                  <span className="px-2 py-1 text-xs bg-secondary rounded-full">TypeScript</span>
                  <span className="px-2 py-1 text-xs bg-secondary rounded-full">Tailwind</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a 
            href="/projects"
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
          >
            View All Projects
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>

      {/* Quick About */}
      <section className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <div>
          <h2 className="text-3xl font-semibold mb-4">Welcome!</h2>
          <p className="text-muted-foreground leading-relaxed">
            I'm a passionate full-stack developer who loves creating efficient, 
            user-friendly applications. From hospitality to code, I bring a unique 
            perspective to software development with a focus on real-world solutions.
          </p>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Quick Facts</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>🚀 Specialized in Next.js, React, and Node.js</li>
            <li>🔐 Focused on secure, scalable applications</li>
            <li>📱 Full-stack development from UI to database</li>
            <li>🎯 Always learning and adapting to new technologies</li>
          </ul>
        </div>
      </section>
    </div>
  )
}