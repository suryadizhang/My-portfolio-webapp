export default function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-20 pb-10">
      <p className="text-sm font-medium tracking-wide text-slate-500">
        (He/Him) • Software Engineer
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
        Suryadi Zhang
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-slate-700">
        Full-Stack Software Engineer — React & Python. I ship responsive apps
        (Next.js) and robust APIs (FastAPI/Postgres) with CI/CD and guardrails.
      </p>
      <ul className="mt-6 grid gap-2 text-slate-700">
        <li>• Live booking + admin (role-based, secure auth, rate limiting)</li>
        <li>• GitHub Actions CI/CD: faster, safer deploys</li>
        <li>• API design: OpenAPI, pagination, predictable errors</li>
      </ul>
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