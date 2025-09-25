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
    title: 'My Hibachi — Live Booking Platform',
    summary: 'Full-stack booking platform with customer site, admin panel, FastAPI backend, and CI/CD pipeline.',
    description: 'Complete restaurant booking solution with customer-facing website, comprehensive admin panel with RBAC, FastAPI backend with JWT authentication and Stripe integration, and automated CI/CD deployment pipeline.',
    tags: ['Next.js', 'FastAPI', 'Postgres', 'CI/CD', 'Stripe', 'JWT', 'RBAC'],
    repo: 'https://github.com/suryadizhang/mh-project-',
    live: 'https://myhibachichef.com',
    image: '/projects/my-hibachi-hero.png',
    featured: true,
    children: [
      {
        slug: 'customer',
        title: 'Customer Site',
        summary: 'SEO-optimized Next.js customer website with booking flow.',
        description: 'Customer-facing website built with Next.js 14, featuring SEO optimization, responsive design, booking interface, menu display, and contact forms. Deployed on Vercel with automatic deployments.',
        tags: ['Next.js', 'Tailwind', 'SEO', 'Vercel'],
        repo: 'https://github.com/suryadizhang/MH-web',
        live: 'https://myhibachichef.com'
      },
      {
        slug: 'admin',
        title: 'Admin Panel',
        summary: 'Role-based admin dashboard for booking management.',
        description: 'Comprehensive admin panel with role-based access control (RBAC), booking management, customer data, reporting dashboard, and staff management. Built with React and TypeScript.',
        tags: ['React', 'TypeScript', 'RBAC', 'Dashboard'],
        repo: 'https://github.com/suryadizhang/mh-project-/tree/main/admin'
      },
      {
        slug: 'backend',
        title: 'Backend API',
        summary: 'FastAPI backend with JWT auth, Stripe integration, and PostgreSQL.',
        description: 'RESTful API built with FastAPI, featuring JWT authentication, PostgreSQL database, Stripe payment processing, email notifications, rate limiting, and comprehensive OpenAPI documentation.',
        tags: ['FastAPI', 'Postgres', 'JWT', 'Stripe', 'SQLAlchemy'],
        repo: 'https://github.com/suryadizhang/my-hibachi-backend'
      },
      {
        slug: 'devops',
        title: 'DevOps/CI/CD',
        summary: 'GitHub Actions deployment pipeline with VPS hosting.',
        description: 'Automated deployment pipeline using GitHub Actions, featuring multi-environment deployments, Docker containerization, VPS deployment via SSH, Nginx reverse proxy, and monitoring setup.',
        tags: ['GitHub Actions', 'Docker', 'Nginx', 'VPS', 'CI/CD'],
        repo: 'https://github.com/suryadizhang/mh-project-/tree/main/.github'
      },
    ],
  },
  {
    slug: 'portfolio-webapp',
    title: 'Portfolio Website',
    summary: 'This responsive portfolio built with Next.js 15, TypeScript, and Tailwind CSS.',
    description: 'Modern portfolio website showcasing projects and skills. Built with Next.js 15, TypeScript, Tailwind CSS, featuring comprehensive API documentation with Swagger UI, testing suite, and automated CI/CD deployment to Vercel and VPS.',
    tags: ['Next.js', 'TypeScript', 'Tailwind', 'Swagger', 'Testing'],
    repo: 'https://github.com/suryadizhang/My-portfolio-webapp',
    live: 'https://myportfolio.mysticdatanode.net',
    featured: true,
  },
  {
    slug: 'mechanic-shop-api',
    title: 'Mechanic Shop API',
    summary: 'Flask/FastAPI backend with SQLAlchemy, JWT authentication, and OpenAPI documentation.',
    description: 'RESTful API for mechanic shop management built with Flask/FastAPI, featuring SQLAlchemy ORM, JWT authentication, role-based permissions, PostgreSQL database, comprehensive testing with PyTest, and automatic OpenAPI documentation generation.',
    tags: ['FastAPI', 'Flask', 'Postgres', 'SQLAlchemy', 'JWT', 'PyTest'],
    repo: 'https://github.com/suryadizhang/mechanichshop',
  },
  {
    slug: 'ecommerce-api',
    title: 'E-commerce API',
    summary: 'Scalable e-commerce backend with payment processing and inventory management.',
    description: 'Full-featured e-commerce API with product catalog, shopping cart, order processing, payment integration, inventory management, user authentication, and admin dashboard. Built for scalability and performance.',
    tags: ['Node.js', 'Express', 'MongoDB', 'Stripe', 'Redis'],
  },
  {
    slug: 'task-management',
    title: 'Task Management App',
    summary: 'Collaborative task management with real-time updates and team features.',
    description: 'Real-time collaborative task management application with drag-and-drop boards, team collaboration features, file attachments, notifications, and progress tracking. Built with modern React patterns and WebSocket communication.',
    tags: ['React', 'WebSocket', 'Node.js', 'PostgreSQL', 'Real-time'],
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