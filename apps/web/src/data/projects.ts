export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  tags: string[];
  repo?: string;
  live?: string;
  image?: string;
  featured?: boolean;
  children?: Project[];
};

export const projects: Project[] = [
  {
    slug: 'my-hibachi',
    title: 'MyHibachi — Full-Stack Booking System',
    summary: 'Production-ready hibachi catering platform with Next.js frontend, FastAPI backend, and comprehensive admin dashboard.',
    description: 'Complete hibachi catering business solution featuring customer booking website, admin dashboard with analytics, FastAPI backend with Stripe integration, AI booking assistant, and automated CI/CD deployment. Includes 85 blog posts, 10 location pages, comprehensive testing (95% coverage), and PCI-compliant payment processing.',
    tags: ['Next.js', 'FastAPI', 'PostgreSQL', 'Stripe', 'AI Assistant', 'CI/CD', 'TypeScript'],
    repo: 'https://github.com/suryadizhang/mh-project-',
    live: 'https://myhibachichef.com',
    image: '/images/projects/my-hibachi/cover.jpg',
    featured: true,
    children: [
      {
        slug: 'customer',
        title: 'Customer Frontend',
        summary: 'Mobile-first Next.js website with booking flow and SEO optimization.',
        description: 'Customer-facing website with real-time booking system, menu display, location-specific pages, blog section, mobile-responsive design, and comprehensive SEO optimization. Features tawk.to live chat integration and automated calendar invites.',
        tags: ['Next.js', 'Tailwind CSS', 'SEO', 'Vercel', 'Mobile-First'],
        repo: 'https://github.com/suryadizhang/mh-project-/tree/main/apps/customer',
        live: 'https://myhibachichef.com'
      },
      {
        slug: 'admin',
        title: 'Admin Dashboard',
        summary: 'Comprehensive admin panel with booking management and business analytics.',
        description: 'Full-featured admin dashboard with booking management, customer analytics, revenue tracking, chef scheduling, newsletter management, and system logs. Built with Next.js and TypeScript with role-based access control.',
        tags: ['Next.js', 'TypeScript', 'Analytics', 'Dashboard', 'RBAC'],
        repo: 'https://github.com/suryadizhang/mh-project-/tree/main/apps/admin',
        live: 'https://admin.myhibachichef.com'
      },
      {
        slug: 'backend',
        title: 'FastAPI Backend',
        summary: 'Production-ready API with Stripe integration and comprehensive testing.',
        description: 'RESTful API with JWT authentication, PostgreSQL database, Stripe payment processing, email notifications, rate limiting, comprehensive testing, and automated OpenAPI documentation. Includes booking management and customer relationship features.',
        tags: ['FastAPI', 'PostgreSQL', 'Stripe', 'JWT', 'SQLAlchemy', 'Testing'],
        repo: 'https://github.com/suryadizhang/mh-project-/tree/main/apps/api'
      },
      {
        slug: 'ai-assistant',
        title: 'AI Booking Assistant',
        summary: 'Intelligent booking assistance with recommendations and support automation.',
        description: 'AI-powered booking assistant providing intelligent recommendations, customer support automation, and booking optimization. Integrated with the main platform for seamless user experience.',
        tags: ['AI/ML', 'Python', 'Natural Language Processing', 'Automation'],
        repo: 'https://github.com/suryadizhang/mh-project-/tree/main/apps/ai-api'
      },
    ],
  },
  {
    slug: 'portfolio-webapp',
    title: 'Portfolio Website',
    summary: 'Modern portfolio built with Next.js 15, featuring AI chat integration and comprehensive API documentation.',
    description: 'Responsive portfolio website showcasing projects and technical skills. Built with Next.js 15, TypeScript, and Tailwind CSS. Features AI chat widget integration, comprehensive project documentation, blog functionality, FastAPI backend with analytics tracking, automated testing, and dual deployment (Vercel + VPS).',
    tags: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'FastAPI', 'AI Chat', 'Analytics'],
    repo: 'https://github.com/suryadizhang/My-portfolio-webapp',
    live: 'https://myportfolio.mysticdatanode.net',
    image: '/images/projects/portfolio-webapp/hero.png',
    featured: true,
  },
  {
    slug: 'mechanic-shop-api',
    title: 'Mechanic Shop Management API',
    summary: 'Comprehensive Flask REST API for automotive repair shop operations with 76 comprehensive tests.',
    description: 'Production-ready REST API for managing mechanic shop operations including customer management, mechanic scheduling, service ticket tracking, and inventory management. Features JWT authentication, role-based access control, interactive Swagger documentation, comprehensive testing suite (76 tests with 100% pass rate), rate limiting, and input validation.',
    tags: ['Flask', 'SQLAlchemy', 'JWT', 'Swagger', 'SQLite', 'Testing'],
    repo: 'https://github.com/suryadizhang/mechanichshop',
  },
  {
    slug: 'flask-ecommerce-api',
    title: 'Flask E-commerce API',
    summary: 'Modular Flask REST API for e-commerce operations with comprehensive data validation.',
    description: 'Scalable e-commerce backend API featuring user management with email validation, product catalog management, order processing with many-to-many relationships, comprehensive input validation using Marshmallow schemas, modular architecture with Flask blueprints, and SQLAlchemy ORM with proper relationship handling.',
    tags: ['Flask', 'SQLAlchemy', 'Marshmallow', 'E-commerce', 'REST API', 'Data Validation'],
    repo: 'https://github.com/suryadizhang/flask-ecommerce-api',
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find(project => project.slug === slug);
}

export function getChildProject(parentSlug: string, childSlug: string): Project | undefined {
  const parent = getProject(parentSlug);
  return parent?.children?.find(child => child.slug === childSlug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter(project => project.featured);
}

export function getAllProjectSlugs(): string[] {
  const slugs: string[] = [];
  
  projects.forEach(project => {
    slugs.push(project.slug);
    if (project.children) {
      project.children.forEach(child => {
        slugs.push(`${project.slug}/${child.slug}`);
      });
    }
  });
  
  return slugs;
}