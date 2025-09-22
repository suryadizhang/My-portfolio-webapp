export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-5xl px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="text-xl font-semibold tracking-tight">
            Suryadi Zhang
          </a>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="/"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Home
            </a>
            <a
              href="/projects"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Projects
            </a>
            <a
              href="/about"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              About
            </a>
            <a
              href="/contact"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Contact
            </a>
            <a
              href="/resume"
              className="rounded-xl bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
            >
              Resume
            </a>
          </div>
          
          {/* Mobile menu button - could be enhanced with state management */}
          <button className="md:hidden text-slate-600 hover:text-slate-900">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}