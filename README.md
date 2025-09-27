# 🚀 Suryadi Zhang's Portfolio - Production-Ready Full-Stack Application

A comprehensive, recruiter-friendly portfolio website featuring **Next.js 15**, **FastAPI backend**, **AI-powered chat**, **analytics tracking**, and **enterprise-grade CI/CD**. This isn't just a portfolio—it's a live demonstration of production-ready full-stack development.

## 🌐 Live Application

- **Production Site**: [https://myportfolio.mysticdatanode.net](https://myportfolio.mysticdatanode.net)
- **Backend API**: [https://myportfolio.mysticdatanode.net/api](https://myportfolio.mysticdatanode.net/api)
- **Analytics Dashboard**: Built-in engagement tracking
- **AI Chat**: Interactive assistant powered by RAG (Retrieval-Augmented Generation)

## ✨ Key Features

### 🎯 **Recruiter-Friendly Design**
- **Professional landing page** with clear value proposition
- **Detailed project case studies** with technical deep-dives
- **Live project demos** with real functionality
- **Interactive AI chat** to answer questions about experience
- **Real-time engagement analytics** showing portfolio performance

### 💻 **Technical Excellence**
- **Full-Stack Architecture**: Next.js 15 + FastAPI + PostgreSQL
- **AI Integration**: RAG-powered chat with streaming responses
- **Real-Time Analytics**: Track views, likes, resume downloads, chat usage
- **Enterprise CI/CD**: Path-based job filtering, security scanning, automated deployments
- **Production Security**: Security headers, rate limiting, input validation

### 📊 **Data-Driven Insights**
- **Page view tracking** for all projects and pages
- **User engagement metrics** (likes, time spent, popular sections)
- **Resume download tracking** with analytics
- **Chat interaction analytics** (sessions, popular questions)
- **Performance monitoring** with Lighthouse CI integration

## 🏗️ Architecture

### **Monorepo Structure**
```
portfolio/
├── apps/
│   ├── web/                 # Next.js 15 Frontend (Vercel)
│   │   ├── src/app/         # App Router: pages + API routes
│   │   ├── content/         # Profile data + MDX case studies
│   │   └── components/      # React components + chat UI
│   └── service-python/      # FastAPI Backend (VPS)
│       ├── app/routes/      # API endpoints: chat, analytics, resume
│       ├── app/core/        # RAG system, rate limiting, KV store
│       ├── data/            # RAG index, embeddings
│       └── tests/           # Comprehensive test suite
├── packages/
│   ├── ui/                  # Shared component library
│   ├── utils/               # Shared utilities & helpers
│   └── config/              # ESLint, TypeScript configs
└── .github/workflows/       # CI/CD pipeline
```

### **Technology Stack**

#### **Frontend (Next.js 15)**
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict configuration
- **Styling**: Tailwind CSS + shadcn/ui components
- **Content**: MDX for rich project case studies
- **SEO**: Dynamic metadata + JSON-LD structured data
- **Performance**: Image optimization, streaming, caching

#### **Backend (FastAPI)**
- **API Framework**: FastAPI with automatic OpenAPI docs
- **Database**: PostgreSQL with SQLAlchemy ORM
- **AI/ML**: RAG system with TF-IDF vectorization
- **Authentication**: JWT tokens with session management
- **Infrastructure**: Rate limiting, logging, error handling

#### **DevOps & Infrastructure**
- **Monorepo**: Turborepo for optimized builds
- **CI/CD**: GitHub Actions with path-based filtering
- **Deployment**: Vercel (frontend) + VPS (backend)
- **Monitoring**: Analytics tracking + performance monitoring
- **Security**: Security headers, input validation, secret management

## 🚀 Quick Start

### Prerequisites
- **Node.js 20+** and **pnpm** (frontend)
- **Python 3.11+** (backend)
- **PostgreSQL** (for full backend functionality)

### 1. Clone and Install
```bash
git clone https://github.com/suryadizhang/portfolio-monorepo.git
cd portfolio-monorepo
pnpm install
```

### 2. Environment Setup
```bash
# Frontend (.env.local in apps/web/)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Backend (.env in apps/service-python/)
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio
OPENAI_API_KEY=your_openai_key_here  # Optional for AI chat
KV_URL=redis://localhost:6379        # Optional for analytics
```

### 3. Start Development
```bash
# Start both frontend and backend
pnpm dev

# Or start individually:
pnpm dev --filter=web        # Frontend only
pnpm dev --filter=backend    # Backend only
```

### 4. Access Applications
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/docs
- **Chat Interface**: Available on all frontend pages (bottom-right)

## 💼 Portfolio Content

### **Profile Data** (`apps/web/content/profile.json`)
Comprehensive professional information:
- **Contact & Social**: Email, phone, LinkedIn, GitHub
- **Professional Summary**: Elevator pitch and key strengths
- **Work Experience**: Detailed role descriptions with measurable impact
- **Technical Skills**: Organized by proficiency and category
- **Education & Certifications**: Academic background and credentials

### **Project Case Studies** (`apps/web/content/projects/`)
Each project includes:
- **Technical Overview**: Architecture and technology choices
- **Problem & Solution**: Challenges faced and solutions implemented
- **Code Examples**: Real implementation snippets with syntax highlighting
- **Results & Impact**: Measurable outcomes and business value
- **Live Demo & Source**: Links to deployed applications and repositories

**Featured Projects:**
1. **My Hibachi LLC** - Full-stack booking platform (Next.js + FastAPI)
2. **Mechanic Shop API** - RESTful service management system
3. **Portfolio Website** - This very application (meta!)

## 🤖 AI Chat Assistant

### **Features**
- **Retrieval-Augmented Generation (RAG)**: Searches project content for accurate responses
- **Streaming Responses**: Real-time token streaming for better UX
- **Context Awareness**: Remembers conversation history
- **Fallback Handling**: Graceful degradation when AI services are unavailable
- **Rate Limiting**: Prevents abuse while maintaining good UX

### **Technical Implementation**
- **Frontend**: SSE (Server-Sent Events) for real-time streaming
- **Backend**: FastAPI with async streaming endpoints
- **RAG System**: TF-IDF vectorization for document similarity search
- **Content Index**: Automatically built from profile data and project MDX files

## 📊 Analytics & Engagement

### **Tracked Metrics**
- **Page Views**: Track popular projects and content
- **User Engagement**: Likes, time spent, scroll depth
- **Resume Downloads**: Track recruiter interest
- **Chat Interactions**: Popular questions and session data
- **Performance**: Page load times and conversion metrics

### **Privacy-First Approach**
- **Anonymous Tracking**: No personal data collection
- **Session-Based**: Uses random UUIDs, not persistent user IDs
- **Transparent**: Privacy policy accessible via API
- **User Control**: Easy opt-out mechanisms

## 🔒 Security & Performance

### **Security Features**
- **Security Headers**: X-Frame-Options, CSP, HSTS
- **Rate Limiting**: Per-IP limits on API endpoints
- **Input Validation**: Comprehensive request validation
- **Secret Management**: Environment-based configuration
- **CORS Configuration**: Properly configured cross-origin policies

### **Performance Optimizations**
- **Image Optimization**: Next.js automatic optimization + WebP/AVIF
- **Code Splitting**: Automatic route-based splitting
- **Caching Strategies**: Static generation + ISR where appropriate
- **CDN Integration**: Vercel Edge Network
- **Bundle Analysis**: Automated bundle size monitoring

## 🚢 CI/CD Pipeline

### **Automated Workflows**
- **Path-Based Building**: Only builds changed services
- **Comprehensive Testing**: Unit, integration, and E2E tests
- **Security Scanning**: Dependency and vulnerability scanning
- **Performance Auditing**: Lighthouse CI for web vitals
- **Deployment Automation**: Zero-downtime deployments

### **Quality Gates**
- **TypeScript**: Strict type checking
- **ESLint**: Code quality and consistency
- **Prettier**: Automated code formatting
- **Tests**: >80% coverage requirement
- **Performance**: Lighthouse score >90

## 🛠️ Development Commands

```bash
# Development
pnpm dev                     # Start all services
pnpm dev --filter=web        # Frontend only
pnpm dev --filter=backend    # Backend only

# Building
pnpm build                   # Build all applications
pnpm build --filter=web      # Build frontend only

# Code Quality
pnpm lint                    # Run ESLint
pnpm type-check             # TypeScript checking
pnpm format                 # Format with Prettier

# Testing
pnpm test                   # Run all tests
pnpm test --filter=backend  # Backend tests only
pnpm test:e2e              # End-to-end tests

# Backend Specific
cd apps/service-python
python -m pytest tests/    # Run backend tests
python scripts/build_rag_index.py  # Rebuild RAG index
uvicorn app.main:app --reload       # Start backend only
```

## 📈 Deployment

### **Production Deployment**

#### **Frontend (Vercel)**
```bash
# Automatic deployment via Git integration
git push origin main  # Triggers Vercel deployment

# Manual deployment
npx vercel --prod
```

#### **Backend (VPS/Cloud)**
```bash
# Docker deployment
docker build -t portfolio-backend apps/service-python/
docker run -p 8000:8000 --env-file .env portfolio-backend

# Direct deployment
cd apps/service-python
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### **Environment Variables**

#### **Required for Production**
```bash
# Frontend
NEXT_PUBLIC_SITE_URL=https://yourportfolio.vercel.app
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com

# Backend
DATABASE_URL=postgresql://user:password@host:5432/portfolio
SECRET_KEY=your_super_secret_key_here
ALLOWED_ORIGINS=https://yourportfolio.vercel.app

# Optional (Enhanced Features)
OPENAI_API_KEY=sk-...                    # For AI chat
REDIS_URL=redis://localhost:6379        # For analytics/caching
SENTRY_DSN=https://...                   # For error tracking
```

## 🎯 Customization Guide

### **Adding New Projects**
1. Create MDX file in `apps/web/content/projects/`
2. Add comprehensive frontmatter metadata
3. Write detailed case study content
4. Include code examples and results
5. Update RAG index: `python scripts/build_rag_index.py`

### **Updating Profile Information**
1. Edit `apps/web/content/profile.json`
2. Update professional summary and experience
3. Add new skills and certifications
4. Rebuild for updated SEO metadata

### **Customizing AI Chat**
1. Modify system prompts in `apps/service-python/app/routes/chat.py`
2. Update RAG content processing
3. Customize response templates
4. Add new question categories

## 📊 Performance Metrics

### **Current Performance**
- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Time to Interactive**: <3.5s
- **Cumulative Layout Shift**: <0.1

### **Bundle Size**
- **Initial JS**: ~85KB gzipped
- **Total Assets**: ~200KB (excluding images)
- **Images**: Optimized WebP/AVIF with lazy loading

## 🤝 Contributing

While this is a personal portfolio, suggestions are welcome:

1. **Fork** the repository
2. **Create** a feature branch
3. **Test** your changes thoroughly
4. **Submit** a pull request with detailed description

### **Areas for Contribution**
- Performance optimizations
- Accessibility improvements
- Additional AI chat capabilities
- Enhanced analytics features

## 📬 Contact Information

**Suryadi Zhang** - Full-Stack Software Engineer

- **Email**: [suryadizhang86@gmail.com](mailto:suryadizhang86@gmail.com)
- **Phone**: [(210) 388-4155](tel:+12103884155)
- **LinkedIn**: [linkedin.com/in/suryadi-zhang](https://linkedin.com/in/suryadi-zhang)
- **GitHub**: [github.com/suryadizhang](https://github.com/suryadizhang)
- **Location**: Fremont, CA, USA

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🎯 For Recruiters

This portfolio demonstrates:
- **Full-Stack Expertise**: Modern React/Next.js frontend + Python/FastAPI backend
- **Production Experience**: Real applications with user authentication, databases, and deployments
- **AI/ML Integration**: RAG system implementation and streaming APIs
- **DevOps Proficiency**: Comprehensive CI/CD, monitoring, and deployment automation
- **Business Impact**: Measurable results and performance optimizations

**Ready to discuss opportunities?** Use the AI chat assistant or contact me directly!

---

*Built with ❤️ using Next.js 15, FastAPI, and modern full-stack technologies*#   P o r t f o l i o   d e p l o y m e n t   t r i g g e r  
 #   T r i g g e r   d e p l o y m e n t   w i t h   a l l   f i x e s   a p p l i e d  
 #   V e r c e l   C I / C D   I n t e g r a t i o n   T e s t  
 