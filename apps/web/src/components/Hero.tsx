"use client";

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-24 pb-20">
      <div className="space-y-12">
        {/* Header */}
        <div className="space-y-6">
          <p className="text-sm font-medium tracking-wide text-slate-500 dark:text-slate-400 uppercase">
            (He/Him) • Software Engineer
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-slate-900 dark:text-white">
            Suryadi Zhang
          </h1>
          <div className="space-y-4">
            <p className="max-w-4xl text-xl leading-relaxed font-medium text-brand-600 dark:text-brand-400">
              I'm a Full-Stack Software Engineer with real-world experience delivering responsive web apps and robust APIs using React, Next.js, Python, FastAPI, and Postgres.
            </p>
            <p className="max-w-4xl text-lg leading-relaxed text-slate-700 dark:text-slate-300">
              I turn ambiguous requirements into production-ready systems and ship continuously with CI/CD.
            </p>
          </div>
        </div>

        {/* How I Work */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <span className="text-4xl">🚀</span>
            How I Work
          </h2>
          <ul className="space-y-4 text-slate-700 dark:text-slate-300 max-w-4xl">
            <li className="flex items-start space-x-4 group">
              <span className="text-brand-600 dark:text-brand-400 font-bold text-lg mt-1 group-hover:scale-110 transition-transform">•</span>
              <span className="text-lg leading-relaxed">Model data and design REST APIs with auth, pagination, and clear errors, documented with OpenAPI</span>
            </li>
            <li className="flex items-start space-x-4 group">
              <span className="text-brand-600 dark:text-brand-400 font-bold text-lg mt-1 group-hover:scale-110 transition-transform">•</span>
              <span className="text-lg leading-relaxed">Build responsive React/Next.js UIs that perform well on mobile and are accessible by default</span>
            </li>
            <li className="flex items-start space-x-4 group">
              <span className="text-brand-600 dark:text-brand-400 font-bold text-lg mt-1 group-hover:scale-110 transition-transform">•</span>
              <span className="text-lg leading-relaxed">Add guardrails with validation (Pydantic/Zod), rate limiting, logging/metrics, and automated tests</span>
            </li>
            <li className="flex items-start space-x-4 group">
              <span className="text-brand-600 dark:text-brand-400 font-bold text-lg mt-1 group-hover:scale-110 transition-transform">•</span>
              <span className="text-lg leading-relaxed">Ship safely with GitHub Actions (lint, unit/integration tests, preview deploys)</span>
            </li>
          </ul>
        </div>

        {/* Impact & Highlights */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <span className="text-4xl">💡</span>
            Impact & Highlights
          </h2>
          <ul className="space-y-5 text-slate-700 dark:text-slate-300 max-w-4xl">
            <li className="flex items-start space-x-4 group">
              <span className="text-green-600 font-bold text-lg mt-1 group-hover:scale-110 transition-transform">•</span>
              <span className="text-lg leading-relaxed">
                <strong className="text-slate-900 dark:text-white">Shipped a live booking platform + admin</strong> (Next.js/TypeScript + FastAPI/Postgres) deployed on Vercel + VPS
                <br />
                <span className="text-green-600 dark:text-green-400 font-medium">→ role-based access, secure auth, rate limiting, automated deployments</span>
              </span>
            </li>
            <li className="flex items-start space-x-4 group">
              <span className="text-blue-600 font-bold text-lg mt-1 group-hover:scale-110 transition-transform">•</span>
              <span className="text-lg leading-relaxed">
                <strong className="text-slate-900 dark:text-white">Increased deployment frequency by ~30%</strong> with GitHub Actions pipelines
                <br />
                <span className="text-blue-600 dark:text-blue-400 font-medium">→ fewer regressions, faster delivery</span>
              </span>
            </li>
            <li className="flex items-start space-x-4 group">
              <span className="text-purple-600 font-bold text-lg mt-1 group-hover:scale-110 transition-transform">•</span>
              <span className="text-lg leading-relaxed">
                <strong className="text-slate-900 dark:text-white">Reduced setup time in event operations by ~15%</strong> by designing SOPs and automation
              </span>
            </li>
          </ul>
        </div>

        {/* What I Build */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <span className="text-4xl">🛠️</span>
            What I Build
          </h2>
          <ul className="space-y-4 text-slate-700 dark:text-slate-300 max-w-4xl">
            <li className="flex items-start space-x-4 group">
              <span className="text-brand-600 dark:text-brand-400 font-bold text-lg mt-1 group-hover:scale-110 transition-transform">•</span>
              <span className="text-lg leading-relaxed">Booking/e-commerce flows that feel effortless on mobile</span>
            </li>
            <li className="flex items-start space-x-4 group">
              <span className="text-brand-600 dark:text-brand-400 font-bold text-lg mt-1 group-hover:scale-110 transition-transform">•</span>
              <span className="text-lg leading-relaxed">Well-documented APIs with strong auth and predictable error models</span>
            </li>
            <li className="flex items-start space-x-4 group">
              <span className="text-brand-600 dark:text-brand-400 font-bold text-lg mt-1 group-hover:scale-110 transition-transform">•</span>
              <span className="text-lg leading-relaxed">Admin dashboards with insights, bulk actions, and guardrails</span>
            </li>
            <li className="flex items-start space-x-4 group">
              <span className="text-brand-600 dark:text-brand-400 font-bold text-lg mt-1 group-hover:scale-110 transition-transform">•</span>
              <span className="text-lg leading-relaxed">CI/CD pipelines for confident daily releases</span>
            </li>
            <li className="flex items-start space-x-4 group">
              <span className="text-brand-600 dark:text-brand-400 font-bold text-lg mt-1 group-hover:scale-110 transition-transform">•</span>
              <span className="text-lg leading-relaxed">Systems that respect users — secure, performant, reliable</span>
            </li>
          </ul>
        </div>

        {/* Core Stack */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <span className="text-4xl">🔑</span>
            Core Stack & Keywords
          </h2>
          <div className="flex flex-wrap gap-3 max-w-5xl">
            <span className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-base font-semibold border border-blue-200 dark:border-blue-700 hover:shadow-md hover:scale-105 transition-all duration-200">
              TypeScript/JavaScript
            </span>
            <span className="inline-flex items-center px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-base font-semibold border border-green-200 dark:border-green-700 hover:shadow-md hover:scale-105 transition-all duration-200">
              Python
            </span>
            <span className="inline-flex items-center px-4 py-2 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 rounded-full text-base font-semibold border border-cyan-200 dark:border-cyan-700 hover:shadow-md hover:scale-105 transition-all duration-200">
              React
            </span>
            <span className="inline-flex items-center px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-base font-semibold border border-slate-200 dark:border-slate-600 hover:shadow-md hover:scale-105 transition-all duration-200">
              Next.js
            </span>
            <span className="inline-flex items-center px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-base font-semibold border border-purple-200 dark:border-purple-700 hover:shadow-md hover:scale-105 transition-all duration-200">
              FastAPI
            </span>
            <span className="inline-flex items-center px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-full text-base font-semibold border border-red-200 dark:border-red-700 hover:shadow-md hover:scale-105 transition-all duration-200">
              Flask
            </span>
            <span className="inline-flex items-center px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-full text-base font-semibold border border-indigo-200 dark:border-indigo-700 hover:shadow-md hover:scale-105 transition-all duration-200">
              Postgres
            </span>
            <span className="inline-flex items-center px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-full text-base font-semibold border border-emerald-200 dark:border-emerald-700 hover:shadow-md hover:scale-105 transition-all duration-200">
              SQLAlchemy
            </span>
            <span className="inline-flex items-center px-4 py-2 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 rounded-full text-base font-semibold border border-pink-200 dark:border-pink-700 hover:shadow-md hover:scale-105 transition-all duration-200">
              Tailwind CSS
            </span>
            <span className="inline-flex items-center px-4 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-full text-base font-semibold border border-orange-200 dark:border-orange-700 hover:shadow-md hover:scale-105 transition-all duration-200">
              GitHub Actions
            </span>
            <span className="inline-flex items-center px-4 py-2 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 rounded-full text-base font-semibold border border-violet-200 dark:border-violet-700 hover:shadow-md hover:scale-105 transition-all duration-200">
              Vercel
            </span>
            <span className="inline-flex items-center px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-full text-base font-semibold border border-amber-200 dark:border-amber-700 hover:shadow-md hover:scale-105 transition-all duration-200">
              OpenAPI/Swagger
            </span>
            <span className="inline-flex items-center px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-full text-base font-semibold border border-yellow-200 dark:border-yellow-700 hover:shadow-md hover:scale-105 transition-all duration-200">
              MySQL
            </span>
            <span className="inline-flex items-center px-4 py-2 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 rounded-full text-base font-semibold border border-teal-200 dark:border-teal-700 hover:shadow-md hover:scale-105 transition-all duration-200">
              Express
            </span>
            <span className="inline-flex items-center px-4 py-2 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 rounded-full text-base font-semibold border border-rose-200 dark:border-rose-700 hover:shadow-md hover:scale-105 transition-all duration-200">
              Postman/Insomnia
            </span>
            <span className="inline-flex items-center px-4 py-2 bg-lime-50 dark:bg-lime-900/20 text-lime-700 dark:text-lime-300 rounded-full text-base font-semibold border border-lime-200 dark:border-lime-700 hover:shadow-md hover:scale-105 transition-all duration-200">
              Render/Netlify
            </span>
            <span className="inline-flex items-center px-4 py-2 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 rounded-full text-base font-semibold border border-sky-200 dark:border-sky-700 hover:shadow-md hover:scale-105 transition-all duration-200">
              CORS
            </span>
            <span className="inline-flex items-center px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-full text-base font-semibold border border-red-200 dark:border-red-700 hover:shadow-md hover:scale-105 transition-all duration-200">
              OWASP basics
            </span>
          </div>
        </div>

        {/* Personal Touch */}
        <div className="space-y-4">
          <p className="text-slate-700 dark:text-slate-300">
            <span className="font-semibold">Outside of coding:</span> experimenting with hibachi recipes, hiking, cooking, basketball, and exploring new frameworks. I thrive in environments where curiosity, collaboration, and shipping real value come first.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 pt-4">
          <a
            href="#projects"
            className="rounded-xl border border-slate-200 dark:border-slate-600 px-6 py-3 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            See my work
          </a>
          <a
            href="/resume"
            className="rounded-xl bg-brand hover:bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition-colors"
          >
            View Resume
          </a>
          <a
            href="#contact"
            className="rounded-xl border border-brand text-brand hover:bg-brand hover:text-white px-6 py-3 text-sm font-medium transition-colors"
          >
            Let's connect
          </a>
        </div>
      </div>
    </section>
  );
}