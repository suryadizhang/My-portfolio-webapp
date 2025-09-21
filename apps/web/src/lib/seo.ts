import { Metadata } from 'next'
import { Profile, ProjectFrontmatter } from './content'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://suryadi-zhang.dev'

export function generateSiteMetadata(
  title?: string,
  description?: string,
  path: string = '/'
): Metadata {
  const fullTitle = title ? `${title} | Suryadi Zhang` : 'Suryadi Zhang - Full-Stack Software Engineer'
  const defaultDescription = 'Full-Stack Software Engineer delivering responsive web apps and robust APIs with React/Next.js, Python/FastAPI, and Postgres.'
  
  return {
    title: fullTitle,
    description: description || defaultDescription,
    openGraph: {
      title: fullTitle,
      description: description || defaultDescription,
      url: `${siteUrl}${path}`,
      siteName: 'Suryadi Zhang Portfolio',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: description || defaultDescription,
    },
    alternates: {
      canonical: `${siteUrl}${path}`,
    },
  }
}

export function generatePersonJsonLd(profile: Profile) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.headline,
    description: profile.summary.split('\n\n')[0],
    email: profile.contact.email,
    telephone: 'Available upon request',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Fremont',
      addressRegion: 'CA',
      addressCountry: 'US',
    },
    sameAs: [
      profile.contact.linkedin,
      profile.contact.github,
      profile.contact.website,
    ],
    knowsAbout: profile.skills,
    alumniOf: profile.education.map(edu => ({
      '@type': 'Organization',
      name: edu.school,
    })),
  }
}

export function generateProjectJsonLd(project: ProjectFrontmatter) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.summary || project.description,
    dateCreated: project.year?.toString() || new Date().getFullYear().toString(),
    creator: {
      '@type': 'Person',
      name: 'Suryadi Zhang',
    },
    keywords: project.tags?.join(', ') || '',
    url: project.links?.live || project.links?.repo || project.liveUrl || project.repository,
    image: project.cover || project.image,
  }
}