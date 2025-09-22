/**
 * JSON-LD Structured Data component
 * Provides structured data for search engines
 */

export interface StructuredDataProps {
  type: 'person' | 'article' | 'project' | 'website';
  data: any;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  let structuredData: any;

  switch (type) {
    case 'person':
      structuredData = generatePersonData(data);
      break;
    case 'article':
      structuredData = generateArticleData(data);
      break;
    case 'project':
      structuredData = generateProjectData(data);
      break;
    case 'website':
      structuredData = generateWebsiteData(data);
      break;
    default:
      return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
}

function generatePersonData(data: any) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": data.name || "Suryadi Zhang",
    "givenName": "Suryadi",
    "familyName": "Zhang",
    "jobTitle": data.jobTitle || "Full-Stack Software Engineer",
    "description": data.description || "Full-Stack Software Engineer with expertise in modern web technologies, API development, and cloud infrastructure.",
    "url": baseUrl,
    "image": `${baseUrl}/images/profile-photo.jpg`,
    "email": "mailto:suryadizhang86@gmail.com",
    "knowsAbout": data.skills || [
      "JavaScript",
      "TypeScript", 
      "React",
      "Next.js",
      "Python",
      "FastAPI",
      "PostgreSQL",
      "Docker",
      "AWS",
      "Machine Learning"
    ],
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance"
    },
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": data.education?.school || "University"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "ID",
      "addressLocality": data.location || "Indonesia"
    },
    "sameAs": [
      "https://github.com/suryadi-zhang",
      "https://linkedin.com/in/suryadi-zhang",
      "https://twitter.com/suryadi_zhang"
    ],
    "mainEntityOfPage": {
      "@type": "ProfilePage",
      "@id": baseUrl
    }
  };
}

function generateArticleData(data: any) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": data.title,
    "description": data.description,
    "image": data.image ? `${baseUrl}${data.image}` : `${baseUrl}/og?title=${encodeURIComponent(data.title)}`,
    "author": {
      "@type": "Person",
      "name": "Suryadi Zhang",
      "url": baseUrl
    },
    "publisher": {
      "@type": "Person",
      "name": "Suryadi Zhang",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/images/logo.png`
      }
    },
    "datePublished": data.publishedAt,
    "dateModified": data.updatedAt || data.publishedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}${data.url}`
    },
    "keywords": data.tags || [],
    "articleSection": "Technology",
    "inLanguage": "en-US"
  };
}

function generateProjectData(data: any) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": data.title,
    "description": data.description,
    "image": data.image ? `${baseUrl}${data.image}` : `${baseUrl}/og?title=${encodeURIComponent(data.title)}`,
    "creator": {
      "@type": "Person",
      "name": "Suryadi Zhang",
      "url": baseUrl
    },
    "dateCreated": data.createdAt,
    "datePublished": data.publishedAt || data.createdAt,
    "keywords": data.technologies || [],
    "genre": "Software Development",
    "inLanguage": "en-US",
    "url": data.demoUrl || data.githubUrl,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/projects/${data.slug}`
    },
    "programmingLanguage": data.technologies
  };
}

function generateWebsiteData(data: any) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  return {
    "@context": "https://schema.org",
    "@type": "Website",
    "name": data.name || "Suryadi Zhang - Portfolio",
    "description": data.description || "Personal portfolio and blog of Suryadi Zhang, Full-Stack Software Engineer",
    "url": baseUrl,
    "author": {
      "@type": "Person",
      "name": "Suryadi Zhang",
      "url": baseUrl
    },
    "inLanguage": "en-US",
    "copyrightYear": new Date().getFullYear(),
    "copyrightHolder": {
      "@type": "Person",
      "name": "Suryadi Zhang"
    },
    "mainEntity": {
      "@type": "Person",
      "name": "Suryadi Zhang",
      "jobTitle": "Full-Stack Software Engineer"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}