# Portfolio Backend API

FastAPI-based backend service for portfolio website with AI chat, analytics, and resume features.

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env

# Edit .env with your actual values
nano .env

# Run development server
uvicorn app.main:app --reload --port 8000
```

Visit:
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- Health: http://localhost:8000/health

## 📋 Features

- **AI Chat** (`/ai/chat`) - OpenAI-powered chat with RAG
- **Analytics** (`/analytics/*`) - Page views, likes tracking
- **Resume** (`/resume`) - Secure resume download
- **Health Check** (`/health`) - Service status validation

## 🔧 Environment Variables

### Required
- `OPENAI_API_KEY` - For AI chat features
- `ALLOWED_ORIGINS` - CORS allowed domains

### Optional
- `KV_REST_API_URL` - Vercel KV for analytics
- `KV_REST_API_TOKEN` - Vercel KV token
- `RESUME_SIGNING_SECRET` - For signed resume downloads

See `.env.example` for detailed configuration.

## 🐳 VPS Deployment

### Prerequisites
- Python 3.11+
- SSH access to VPS
- GitHub secrets configured

### Manual Deployment

```bash
# SSH into VPS
ssh apiportfolio@108.175.12.154

# Navigate to app directory
cd ~/python-service

# Pull latest code (or upload via SCP)
# Setup environment
cp .env.example .env
nano .env  # Add your secrets

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start service
nohup python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 > app.log 2>&1 &

# Check logs
tail -f app.log
```

### GitHub Actions Deployment

Workflow automatically deploys when:
- Pushing to `main` branch
- Changes in `apps/service-python/**`

**Required GitHub Secrets:**
```
OPENAI_API_KEY      - Your OpenAI API key
VPS_HOST            - VPS IP address
SSH_PRIVATE_KEY     - SSH private key for VPS access
KV_REST_API_URL     - (Optional) Vercel KV URL
KV_REST_API_TOKEN   - (Optional) Vercel KV token
RESUME_SIGNING_SECRET - (Optional) Resume signing secret
```

## 🧪 Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=app tests/
```

## 📊 Monitoring

```bash
# Check if service is running
ps aux | grep uvicorn

# View logs
tail -f ~/python-service/app.log

# Health check
curl http://localhost:8000/health

# Restart service
pkill -f uvicorn
cd ~/python-service
source venv/bin/activate
nohup python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 > app.log 2>&1 &
```

## 🔒 Security

- CORS configured for specific origins only
- Optional signed resume downloads
- Session management with secure cookies
- Rate limiting on chat endpoints
- Production docs hidden in production

## 🛠️ Troubleshooting

### Service won't start
```bash
# Check logs for errors
cat ~/python-service/app.log

# Verify Python can import app
cd ~/python-service
source venv/bin/activate
python -c "from app.main import app; print('OK')"

# Check environment variables
cat .env
```

### 500 Internal Server Error
- Verify `OPENAI_API_KEY` is set
- Check CORS `ALLOWED_ORIGINS` includes your frontend domain
- Review logs: `tail -50 ~/python-service/app.log`

### Port already in use
```bash
# Find and kill process using port 8000
lsof -i :8000
kill -9 <PID>
```

## 📝 API Documentation

Once running, visit `/docs` for interactive Swagger documentation (disabled in production).

## 🤝 Contributing

Quality is our priority! Before committing:
1. Run tests: `pytest`
2. Type check: `mypy app/`
3. Format code: `black app/`
4. Update documentation

## 📞 Support

For issues or questions, contact: suryadizhang.swe@gmail.com
