import { getProfile, getFeaturedProjects } from '@/lib/content'
import { generateSiteMetadata } from '@/lib/seo'
import Hero from '@/components/Hero'
import { ProjectCard } from '@/components/ProjectCard'

export const metadata = generateSiteMetadata()

// Project data based on your content structure
const projects = [
  {
    slug: "my-hibachi",
    title: "My Hibachi — Live Booking Platform",
    summary: "Customer + admin app with role-based access, secure auth, rate limiting, CI/CD. Next.js/TS frontend on Vercel; FastAPI/Postgres backend on VPS.",
    tags: ["Next.js", "TypeScript", "FastAPI", "Postgres", "CI/CD"],
    links: {
      live: "https://myhibachi.mysticdatanode.net",
      repo: "https://github.com/suryadizhang/mh-project"
    }
  },
  {
    slug: "mechanic-shop-api", 
    title: "Mechanic Shop API — Flask/FastAPI, Postgres, PyTest",
    summary: "REST API with JWT auth, SQLAlchemy models, OpenAPI docs, and Postgres service used in CI for PR validation.",
    tags: ["Flask/FastAPI", "JWT", "SQLAlchemy", "OpenAPI", "PyTest"],
    links: {
      repo: "https://github.com/suryadizhang/mechanichshop"
    }
  }
];

export default function HomePage() {
  const profile = getProfile()
  
  return (
    <>
      <Hero />
      
      <section id="projects" className="mx-auto max-w-5xl px-6 py-10">
        <h2 className="text-2xl font-bold">Featured Projects</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {projects.map((p) => (
            <ProjectCard key={p.slug} p={p} />
          ))}
        </div>
      </section>
      
      <section id="about" className="mx-auto max-w-5xl px-6 py-10">
        <h2 className="text-2xl font-bold">About</h2>
        <p className="mt-3 max-w-3xl text-slate-700">
          I'm a Full-Stack Software Engineer with hands-on experience shipping
          responsive web apps and robust APIs using React/Next.js, Python/FastAPI,
          and Postgres. I add guardrails with validation, logging/metrics, tests,
          and ship safely with GitHub Actions.
        </p>
      </section>
      
      <section id="contact" className="mx-auto max-w-5xl px-6 py-10">
        <h2 className="text-2xl font-bold">Contact</h2>
        <p className="mt-3 text-slate-700">
          Fremont, CA •{" "}
          <a className="underline" href="mailto:suryadizhang86@gmail.com">
            suryadizhang86@gmail.com
          </a>{" "}
          •{" "}
          <a className="underline" href="https://www.linkedin.com/in/suryadi-zhang">
            LinkedIn
          </a>{" "}
          •{" "}
          <a className="underline" href="https://github.com/suryadizhang">
            GitHub
          </a>
        </p>
      </section>
    </>
  )
}