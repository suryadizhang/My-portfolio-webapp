export default function Footer() {
  return (
    <footer className="border-t bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Left side - Brand */}
          <div>
            <h3 className="text-lg font-semibold">Suryadi Zhang</h3>
            <p className="mt-2 text-sm text-slate-600">
              Full-Stack Software Engineer building responsive apps and robust APIs with CI/CD.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Fremont, CA • Software Engineer
            </p>
          </div>
          
          {/* Right side - Links */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium text-slate-900">Connect</h4>
              <div className="mt-3 space-y-2">
                <a 
                  href="mailto:suryadizhang.swe@gmail.com" 
                  className="block text-sm text-slate-600 hover:text-slate-900"
                >
                  Email
                </a>
                <a 
                  href="https://linkedin.com/in/suryadi-zhang" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-sm text-slate-600 hover:text-slate-900"
                >
                  LinkedIn
                </a>
                <a 
                  href="https://github.com/suryadizhang" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-sm text-slate-600 hover:text-slate-900"
                >
                  GitHub
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-slate-900">Explore</h4>
              <div className="mt-3 space-y-2">
                <a href="/projects" className="block text-sm text-slate-600 hover:text-slate-900">
                  Projects
                </a>
                <a href="/about" className="block text-sm text-slate-600 hover:text-slate-900">
                  About
                </a>
                <a href="/contact" className="block text-sm text-slate-600 hover:text-slate-900">
                  Contact
                </a>
                <a href="/resume" className="block text-sm text-slate-600 hover:text-slate-900">
                  Resume
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-8 text-center">
          <p className="text-xs text-slate-500">
            © 2025 Suryadi Zhang. Built with Next.js, TypeScript, and Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}