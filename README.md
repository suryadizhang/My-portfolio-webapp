# Portfolio Monorepo

An enterprise-style monorepo for a modern portfolio website with **AI Chatbot**, **RAG**, and **Analytics**. Built with Next.js 15 (frontend) + FastAPI (backend) for a polyglot showcase.

## 🏗️ Architecture

This monorepo contains:

- **apps/web** - Frontend Next.js application with chat UI
- **apps/service-python** - FastAPI backend with AI chat, RAG, and analytics
- **packages/ui** - Shared React components
- **packages/config** - Shared configurations (ESLint, TypeScript)
- **packages/utils** - Web-only utilities (if needed)

## 📁 Structure

```
portfolio-monorepo/
├── apps/
│   ├── web/                    # Next.js 15 (UI only)
│   │   ├── src/
│   │   │   ├── app/            # Routes: home, about, projects, contact, resume
│   │   │   ├── components/     # UI + Chat components
│   │   │   └── lib/            # Client utilities
│   │   ├── content/projects/   # MDX project files
│   │   └── public/             # Static assets (resume.pdf, etc.)
│   └── service-python/         # FastAPI (chat, RAG, analytics)
│       ├── app/
│       │   ├── main.py         # FastAPI app
│       │   ├── routes/         # health, chat, analytics, resume
│       │   └── core/           # kv, analytics, rag, signing
│       ├── data/               # rag.json (generated)
│       ├── scripts/            # build_rag_index.py
│       ├── tests/              # pytest tests
│       ├── Dockerfile
│       └── compose.yaml
├── packages/
│   ├── ui/                     # Shared React UI
│   ├── config/                 # ESLint/TS configs
│   └── utils/                  # Web helpers (if needed)
├── .github/workflows/          # Node + Python CI
└── turbo.json                 # Turborepo config
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Node.js dependencies
pnpm install

# Python dependencies
cd apps/service-python
pip install -r requirements.txt
cd ../..
```

### 2. Set up Environment Variables

```bash
cp .env.example .env.local
```

Fill in the required values:
- `OPENAI_API_KEY` - Your OpenAI API key
- `KV_REST_API_URL` & `KV_REST_API_TOKEN` - For analytics (optional)
- Other optional settings for features

### 3. Build RAG Index

```bash
cd apps/service-python
python scripts/build_rag_index.py
```

This processes the MDX files in `apps/web/content/projects/` and creates a searchable index.

### 4. Run Development Servers

**Option A: Individual commands**
```bash
# Terminal 1: Frontend (Next.js)
pnpm --filter @apps/web dev

# Terminal 2: API (FastAPI)  
cd apps/service-python
uvicorn app.main:app --reload --port 8000
```

**Option B: Docker Compose**
```bash
cd apps/service-python
docker-compose up
```

- Frontend: http://localhost:3000
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 🤖 AI Chatbot Features

### Chat Modes
- **General**: Friendly conversation about Surya's background
- **Projects**: RAG-enhanced responses using project content  
- **Resume**: Focus on skills and experience

### RAG (Retrieval-Augmented Generation)
- Automatically indexes MDX project files
- TF-IDF vectors with cosine similarity search
- Provides project context to AI responses
- Rebuild index when content changes

### Analytics
- **Page Views**: Track project and page visits
- **Likes**: Like/unlike projects with session tracking
- **Resume Downloads**: Track PDF downloads (with optional signing)
- **Chat Usage**: Sessions and token usage by day
- **Privacy Endpoint**: `/analytics/privacy` explains data collection

## 🛠️ Development Commands

### Frontend (Node.js)
```bash
pnpm dev                    # Start Next.js dev server
pnpm build                  # Build for production
pnpm lint                   # ESLint + TypeScript check
```

### Backend (Python)
```bash
cd apps/service-python

# Development
uvicorn app.main:app --reload --port 8000

# RAG Management
python scripts/build_rag_index.py

# Testing & Linting
ruff --output-format=github .
pytest -q

# Docker
docker-compose up
docker build -t portfolio-api .
```

### Full Monorepo
```bash
pnpm turbo run lint typecheck   # All Node.js projects
```

## 📊 Analytics Dashboard

The FastAPI backend provides comprehensive analytics:

- `GET /analytics/summary?range=7d` - Overview of all metrics
- `POST /analytics/views` - Log page view
- `POST /analytics/likes` - Toggle project like
- `GET /analytics/resume` - Resume download count
- `GET /analytics/privacy` - Privacy information

All analytics respect user privacy with anonymous counters and session-based tracking.

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Deploy apps/web
vercel --prod
```

Environment:
```
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
```

### Backend Options

**Option 1: Railway/Render (Docker)**
```bash
cd apps/service-python
# Deploy Dockerfile to platform
```

**Option 2: VPS with Docker Compose**
```bash
cd apps/service-python  
docker-compose up -d
```

**Option 3: Serverless (Vercel Functions)**
```bash
# Adapt FastAPI to Vercel's Python runtime
```

### Environment Variables

Key production environment variables:

```bash
# OpenAI
OPENAI_API_KEY=sk-...
AI_PROVIDER=openai

# CORS  
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Analytics (optional)
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...

# Resume Security (optional)
SIGNED_DOWNLOADS=true
RESUME_SIGNING_SECRET=your-secret-key
```

## 🧪 Testing

### Python Tests
```bash
cd apps/service-python
pytest tests/ -v
```

Tests cover:
- RAG search functionality
- Analytics operations  
- Chat API validation
- Rate limiting

### Node.js Tests
```bash
pnpm test  # If you add frontend tests
```

## 📦 Tech Stack

### Frontend
- **Next.js 15** with App Router
- **TypeScript** strict mode
- **Tailwind CSS** + shadcn/ui
- **React 18** with modern patterns

### Backend  
- **FastAPI** with Pydantic v2
- **Python 3.11+**
- **scikit-learn** for TF-IDF vectors
- **httpx** for OpenAI streaming
- **Vercel KV / Upstash** for analytics

### DevOps
- **Turborepo** monorepo orchestration
- **Docker & Compose** for containerization
- **GitHub Actions** with Node + Python jobs
- **ruff** for Python linting
- **pytest** for Python testing

## 🤝 Contributing

1. Create a feature branch
2. Make changes and test locally:
   ```bash
   # Test Python changes
   cd apps/service-python && pytest && ruff .
   
   # Test Node.js changes  
   pnpm lint && pnpm typecheck
   ```
3. Submit a pull request

CI runs both Node.js and Python jobs with path filters.

## 🎯 Next Steps

- [ ] Add more project content to `apps/web/content/projects/`
- [ ] Customize the system prompt in `apps/service-python/app/routes/chat.py`
- [ ] Set up production KV database for analytics
- [ ] Configure CORS for your domain
- [ ] Add authentication if needed

---

Built with ❤️ using modern web technologies and AI.