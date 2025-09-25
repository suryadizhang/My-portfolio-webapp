export default function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-20 pb-10">
      <p className="text-sm font-medium tracking-wide text-slate-500">
        (He/Him) • Software Engineer
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
        Suryadi Zhang
      </h1>
      <p className="mt-3 max-w-2xl text-xl font-semibold text-linkedin-600">
        Software Engineer (Full-Stack) | React & Python | Next.js, FastAPI, Postgres
      </p>
      <p className="mt-4 max-w-2xl text-lg text-slate-700">
        I ship responsive web applications and robust APIs with CI/CD pipelines and production guardrails.
        Passionate about building scalable systems that deliver real business value.
      </p>
      <ul className="mt-6 grid gap-2 text-slate-700">
        <li>• Live booking + admin (role-based, secure auth, rate limiting)</li>
        <li>• GitHub Actions CI/CD: faster, safer deploys</li>
        <li>• API design: OpenAPI, pagination, predictable errors</li>
      </ul>
      
      {/* Key Skills Showcase */}
      <div className="mt-6 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
          ⚛️ React.js
        </span>
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
          🐍 Python
        </span>
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-200">
          ⚡ FastAPI
        </span>
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-200">
          🗄️ PostgreSQL
        </span>
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-sm font-medium border border-gray-200">
          🚀 CI/CD
        </span>
      </div>
      
      <div className="mt-8 flex gap-3">
        <a
          href="#projects"
          className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-slate-50"
        >
          See my work
        </a>
        <a
          href="/resume"
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          View Resume
        </a>
      </div>
    </section>
  );
}