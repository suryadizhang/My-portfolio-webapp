import { Metadata } from 'next'
import { Profile, ProjectFrontmatter } from './content'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://suryadi-zhang.dev'

export interface EnhancedSEOProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  author?: string;
  section?: string;
}

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

export function generateEnhancedMetadata(props: EnhancedSEOProps): Metadata {
  const {
    title = 'Suryadi Zhang - Full-Stack Software Engineer',
    description = 'Full-Stack Software Engineer delivering responsive web apps and robust APIs with React/Next.js, Python/FastAPI, and Postgres.',
    path = '/',
    image,
    imageAlt = title,
    noIndex = false,
    type = 'website',
    publishedTime,
    modifiedTime,
    tags = [],
    author = 'Suryadi Zhang',
    section = 'Technology'
  } = props;

  const fullUrl = `${siteUrl}${path}`;
  const ogImage = image ? `${siteUrl}${image}` : `${siteUrl}/og?title=${encodeURIComponent(title)}`;

  // Enhanced keywords
  const baseKeywords = [
    'Software Engineer',
    'Full-Stack Developer', 
    'React',
    'Next.js',
    'TypeScript',
    'Python',
    'FastAPI',
    'PostgreSQL',
    'Web Development',
    'API Development',
    'Suryadi Zhang'
  ];
  
  const allKeywords = [...baseKeywords, ...tags].slice(0, 15);

  const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: allKeywords.join(', '),
    authors: [{ name: author, url: siteUrl }],
    creator: author,
    publisher: author,
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-image-preview': 'large',
        'max-snippet': -1,
      }
    },
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      type: type === 'article' ? 'article' : 'website',
      title,
      description,
      url: fullUrl,
      images: [{
        url: ogImage,
        width: 1200,
        height: 630,
        alt: imageAlt,
      }],
      locale: 'en_US',
      siteName: 'Suryadi Zhang - Portfolio',
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: [author],
        section,
        tags,
      })
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@suryadi_zhang',
      site: '@suryadi_zhang',
      images: [ogImage],
    },
    other: {
      'msapplication-TileColor': '#000000',
      'theme-color': '#000000',
      'color-scheme': 'light dark',
    },
    category: section,
  };

  // Add article-specific metadata
  if (type === 'article' && publishedTime) {
    const articleMetadata = {
      'msapplication-TileColor': '#000000',
      'theme-color': '#000000',
      'color-scheme': 'light dark',
      'article:published_time': publishedTime,
      'article:modified_time': modifiedTime || publishedTime,
      'article:author': author,
      'article:section': section,
      'article:tag': tags.join(','),
    };
    metadata.other = articleMetadata;
  }

  return metadata;
}

export function generatePersonJsonLd(profile: Profile) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    givenName: profile.name.split(' ')[0],
    familyName: profile.name.split(' ').slice(1).join(' '),
    jobTitle: profile.headline,
    description: profile.summary.split('\n\n')[0],
    email: `mailto:${profile.contact.email}`,
    url: siteUrl,
    image: `${siteUrl}/images/profile-photo.jpg`,
    knowsAbout: profile.skills,
    worksFor: {
      '@type': 'Organization',
      name: 'Freelance'
    },
    alumniOf: profile.education.map(edu => ({
      '@type': 'EducationalOrganization',
      name: edu.school,
      description: `${edu.program}, ${edu.dates}`
    })),
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
    mainEntityOfPage: {
      '@type': 'ProfilePage',
      '@id': siteUrl
    }
  }
}

export function generateProjectJsonLd(project: ProjectFrontmatter) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.summary || project.description,
    image: project.cover || project.image || `${siteUrl}/og?title=${encodeURIComponent(project.title)}`,
    creator: {
      '@type': 'Person',
      name: 'Suryadi Zhang',
      url: siteUrl
    },
    dateCreated: project.year?.toString() || new Date().getFullYear().toString(),
    datePublished: project.year?.toString() || new Date().getFullYear().toString(),
    keywords: project.tags?.join(', ') || '',
    genre: 'Software Development',
    inLanguage: 'en-US',
    url: project.links?.live || project.links?.repo || project.liveUrl || project.repository,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/projects/${project.slug || project.title.toLowerCase().replace(/\s+/g, '-')}`
    },
    programmingLanguage: project.tech || project.tags
  }
}

export function generateWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Website',
    name: 'Suryadi Zhang - Portfolio',
    description: 'Personal portfolio and blog of Suryadi Zhang, Full-Stack Software Engineer',
    url: siteUrl,
    author: {
      '@type': 'Person',
      name: 'Suryadi Zhang',
      url: siteUrl
    },
    inLanguage: 'en-US',
    copyrightYear: new Date().getFullYear(),
    copyrightHolder: {
      '@type': 'Person',
      name: 'Suryadi Zhang'
    },
    mainEntity: {
      '@type': 'Person',
      name: 'Suryadi Zhang',
      jobTitle: 'Full-Stack Software Engineer'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
}

// Pre-configured metadata for common pages
export const pageMetadata = {
  home: generateEnhancedMetadata({
    title: 'Suryadi Zhang - Full-Stack Software Engineer',
    description: 'Full-Stack Software Engineer with expertise in modern web technologies. View my portfolio of React, Next.js, Python, and FastAPI projects.',
    path: '/',
  }),
  
  about: generateEnhancedMetadata({
    title: 'About | Suryadi Zhang',
    description: 'Learn about Suryadi Zhang, a Full-Stack Software Engineer with experience in web development, API design, and cloud infrastructure.',
    path: '/about',
  }),
  
  projects: generateEnhancedMetadata({
    title: 'Projects | Suryadi Zhang',
    description: 'Explore my portfolio of web applications, APIs, and software projects built with React, Next.js, Python, FastAPI, and more.',
    path: '/projects',
  }),
  
  contact: generateEnhancedMetadata({
    title: 'Contact | Suryadi Zhang',
    description: 'Get in touch with Suryadi Zhang for collaboration opportunities, consulting, or to discuss your next project.',
    path: '/contact',
  }),
  
  resume: generateEnhancedMetadata({
    title: 'Resume | Suryadi Zhang',
    description: 'View and download the professional resume of Suryadi Zhang, Full-Stack Software Engineer.',
    path: '/resume',
  }),
};