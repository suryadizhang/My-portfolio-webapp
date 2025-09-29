// Client-safe profile data (no fs dependency)
export interface Profile {
  name: string
  pronouns: string
  headline: string
  location: string
  contact: {
    email: string
    website: string
    github: string
    linkedin: string
  }
  summary: string
  experience: Array<{
    title: string
    company: string
    type?: string
    dates: string
    highlights: string[]
  }>
  education: Array<{
    school: string
    program: string
    dates?: string
    notes?: string
  }>
  certifications: Array<{
    name: string
    issuer: string
    date: string
    id: string
  }>
  skills: string[]
  hobbies: string[]
  availability: string[]
}

export const profileData: Profile = {
  name: "Suryadi Zhang",
  pronouns: "He/Him",
  headline: "Software Engineer (Full-Stack) | React & Python | Next.js, FastAPI, Postgres | Shipped live booking + admin | CI/CD",
  location: "Fremont, California, United States",
  contact: {
    email: "suryadizhang.swe@gmail.com",
    website: "https://myportfolio.mysticdatanode.net",
    github: "https://github.com/suryadizhang",
    linkedin: "https://www.linkedin.com/in/suryadi-zhang/"
  },
  summary: "I'm a Full-Stack Software Engineer with real-world experience delivering responsive web apps and robust APIs using React, Next.js, Python, FastAPI, and Postgres. I turn ambiguous requirements into production-ready systems and ship continuously with CI/CD.\n\n🚀 How I Work\n• Model data and design REST APIs with auth, pagination, and clear errors, documented with OpenAPI\n• Build responsive React/Next.js UIs that perform well on mobile and are accessible by default\n• Add guardrails with validation (Pydantic/Zod), rate limiting, logging/metrics, and automated tests\n• Ship safely with GitHub Actions (lint, unit/integration tests, preview deploys)\n\n💡 Impact & Highlights\n• Shipped a live booking platform + admin (Next.js/TypeScript + FastAPI/Postgres) deployed on Vercel + VPS → role-based access, secure auth, rate limiting, automated deployments\n• Increased deployment frequency by ~30% with GitHub Actions pipelines → fewer regressions, faster delivery\n• Reduced setup time in event operations by ~15% by designing SOPs and automation\n\n🛠️ What I Build\n• Booking/e-commerce flows that feel effortless on mobile\n• Well-documented APIs with strong auth and predictable error models\n• Admin dashboards with insights, bulk actions, and guardrails\n• CI/CD pipelines for confident daily releases\n• Systems that respect users — secure, performant, reliable\n\n🔑 Core Stack & Keywords\nTypeScript/JavaScript, Python, React, Next.js, FastAPI, Flask, Postgres, SQLAlchemy, Tailwind CSS, GitHub Actions, Vercel, OpenAPI/Swagger, MySQL, Express, Postman/Insomnia, Render/Netlify, CORS, OWASP basics\n\nOutside of coding: experimenting with hibachi recipes, hiking, cooking, basketball, and exploring new frameworks. I thrive in environments where curiosity, collaboration, and shipping real value come first.",
  experience: [
    {
      title: "Founder & Software Lead",
      company: "My Hibachi LLC",
      type: "Part-time",
      dates: "Jun 2025 – Present",
      highlights: [
        "Shipped Next.js/Tailwind (Vercel) + FastAPI/Postgres (VPS) live booking + admin",
        "Implemented rate limiting, caching, schema validation; improved reliability",
        "Automated CI/CD with GitHub Actions; structured repos & PR checks"
      ]
    },
    {
      title: "Full Stack Engineer (Apprenticeship)",
      company: "Coding Temple",
      dates: "Mar 2025 – Present",
      highlights: [
        "Built features in Next.js/React + FastAPI/Flask; improved responsiveness",
        "REST endpoints with validation & OpenAPI; CI with Postgres service",
        "Capstone app with auth + CRUD + responsive UI, documented setup"
      ]
    },
    {
      title: "Additional Experience — Hospitality & Culinary",
      company: "Multiple Restaurants & Freelance",
      dates: "Aug 2018 – Jun 2025",
      highlights: [
        "Coordinated 100+ events; SOPs/checklists cut setup errors",
        "Mentored 10+ staff; honed leadership, communication, teamwork"
      ]
    }
  ],
  education: [
    {
      school: "Coding Temple",
      program: "Full-Stack Software Engineering",
      dates: "Mar 2025 – Sep 2025",
      notes: "Certificate of Completion; capstone booking platform (Next.js + FastAPI/Postgres)"
    }
  ],
  certifications: [
    {
      name: "Backend Specialist",
      issuer: "Coding Temple",
      date: "Sep 2025",
      id: "161097302"
    },
    {
      name: "Software Engineering: Certificate of Completion",
      issuer: "Coding Temple",
      date: "Sep 2025",
      id: "161097303"
    }
  ],
  skills: [
    "Full-Stack Development",
    "React.js",
    "Next.js",
    "Python",
    "FastAPI",
    "Flask",
    "Postgres",
    "SQLAlchemy",
    "TypeScript",
    "Tailwind CSS",
    "CI/CD",
    "GitHub Actions",
    "OpenAPI/Swagger",
    "Testing (Pytest, Vitest)"
  ],
  hobbies: ["Reading manga", "Cooking", "Playing video games"],
  availability: ["Software Engineer", "Full-Stack Engineer", "Back End Engineer"]
}