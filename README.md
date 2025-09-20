# Suryadi Zhang's Portfolio

A modern, comprehensive portfolio website built with Next.js 15, featuring MDX-based project case studies, SEO optimization, and enterprise-grade architecture. Showcases full-stack development expertise with TypeScript, React, and modern web technologies.

## 🏗️ Architecture

This portfolio website features:

- **Next.js 15** with App Router for modern React development
- **TypeScript** for type safety and enhanced development experience  
- **Tailwind CSS** with shadcn/ui components for beautiful, responsive design
- **MDX** for rich project case studies with code highlighting
- **SEO optimization** with dynamic metadata and JSON-LD structured data
- **Monorepo structure** with shared components and utilities
- **Professional content** including experience, education, and project showcases

## 📁 Structure

```
my-portfolio/
├── apps/
│   └── web/                    # Next.js 15 Portfolio Site
│       ├── src/
│       │   ├── app/            # App Router: home, about, projects, contact, resume
│       │   ├── components/     # React components (Header, Footer, Badge)
│       │   └── lib/            # Utilities (content.ts, seo.ts, utils.ts)
│       ├── content/
│       │   ├── profile.json    # Professional profile data
│       │   └── projects/       # MDX project case studies
│       ├── public/             # Static assets and images
│       └── tailwind.config.js  # Tailwind configuration
├── packages/
│   ├── ui/                     # Shared React UI components
│   ├── config/                 # ESLint/TypeScript configs
│   └── utils/                  # Shared utilities
├── turbo.json                  # Turborepo configuration
└── package.json                # Workspace configuration
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install all workspace dependencies
pnpm install
```

### 2. Run Development Server

```bash
# Start the Next.js development server
pnpm dev
```

Visit http://localhost:3000 to see your portfolio in action!

### 3. Build for Production

```bash
# Build the portfolio for production
pnpm build

# Start production server
pnpm start
```

## 💼 Portfolio Content

### Profile Data (`apps/web/content/profile.json`)
Contains comprehensive professional information:
- **Personal Info**: Contact details and professional summary
- **Experience**: Detailed work history with accomplishments
- **Education**: Academic background and certifications
- **Skills**: Technical skills organized by category
- **Projects**: Featured project highlights

### Project Case Studies (`apps/web/content/projects/`)
Each project is documented as an MDX file with:
- **Frontmatter**: Project metadata (title, description, tech stack, etc.)
- **Rich Content**: Detailed project overview, challenges, and solutions
- **Code Examples**: Syntax-highlighted code snippets
- **Links**: Live demos and source code repositories

Current projects include:
- **My Hibachi**: Full-stack restaurant management system
- **Mechanic Shop API**: RESTful API with authentication and analytics

## 🎨 Design System

Built with modern, responsive design principles:
- **Tailwind CSS**: Utility-first styling with custom configuration
- **shadcn/ui**: High-quality, accessible component library
- **Custom Components**: Badge system with variants and animations
- **Responsive Layout**: Mobile-first design that works on all devices
- **Dark Mode Ready**: Prepared for theme switching (can be enabled)

## 🔍 SEO & Performance

### Search Engine Optimization
- **Dynamic Metadata**: Page-specific titles, descriptions, and Open Graph tags
- **JSON-LD Structured Data**: Rich snippets for better search results
- **Semantic HTML**: Proper heading hierarchy and semantic elements
- **Performance Optimized**: Next.js 15 with App Router for optimal loading

### Key SEO Features
- Homepage with personal branding and professional summary
- About page with detailed background and experience
- Project showcase with individual case study pages
- Contact information and professional networking links
- Resume/CV page with downloadable PDF option

## 🛠️ Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server  
pnpm start

# Run linting
pnpm lint

# Run type checking
pnpm typecheck

# Clean build artifacts
pnpm clean

# Run all checks (lint + typecheck)
pnpm turbo run lint typecheck
```

## � Tech Stack

### Frontend
- **Next.js 15** with App Router for modern React development
- **TypeScript** with strict configuration for type safety
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for high-quality, accessible components
- **Lucide React** for beautiful, consistent icons
- **MDX** for rich content with React component support

### Content Management
- **JSON-based Profile**: Centralized professional data
- **MDX Projects**: Rich project documentation with frontmatter
- **Gray Matter**: Frontmatter parsing for project metadata
- **next-mdx-remote** for dynamic MDX rendering

### Development
- **Turborepo** for monorepo management and build optimization
- **ESLint** with custom configuration for code quality
- **TypeScript** strict mode for enhanced type safety
- **pnpm** for fast, efficient package management

## 🎯 Customization

### Adding New Projects
1. Create a new MDX file in `apps/web/content/projects/`
2. Add frontmatter with project metadata
3. Write your project case study content
4. Projects automatically appear on the projects page

### Updating Profile Information
Edit `apps/web/content/profile.json` to update:
- Professional summary and contact information
- Work experience and accomplishments  
- Education and certifications
- Technical skills and competencies

### Styling and Branding
- Modify `apps/web/tailwind.config.js` for custom colors/fonts
- Update components in `apps/web/src/components/` 
- Customize the favicon and images in `apps/web/public/`

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Deploy to Vercel
npx vercel --prod
```

### Netlify
```bash
# Build command: pnpm build
# Publish directory: apps/web/.next
```

### Self-Hosted
```bash
# Build the application
pnpm build

# Start the production server
pnpm start
```

## � Features

### Pages
- **Homepage**: Professional introduction with call-to-action
- **About**: Detailed background, experience, and skills
- **Projects**: Showcase of featured projects with case studies  
- **Contact**: Professional contact information and social links
- **Resume**: Professional summary with download option

### Components
- **Responsive Navigation**: Mobile-friendly header with navigation
- **Badge System**: Customizable badges for skills and technologies
- **Project Cards**: Beautiful project previews with key information
- **SEO Optimization**: Dynamic metadata and structured data
- **Professional Footer**: Contact links and additional information

## 🤝 Contributing

This is a personal portfolio project, but if you'd like to suggest improvements:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Make your changes and test locally
4. Submit a pull request with a clear description

For major changes, please open an issue first to discuss the proposed changes.

## 📬 Contact

**Suryadi Zhang**
- Email: [sryzhang17@gmail.com](mailto:sryzhang17@gmail.com)
- LinkedIn: [linkedin.com/in/suryadi-zhang](https://linkedin.com/in/suryadi-zhang)
- Location: Jakarta, Indonesia

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using Next.js 15, TypeScript, and modern web technologies.