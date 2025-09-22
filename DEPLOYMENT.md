# 🚀 Production Deployment Guide

This guide provides step-by-step instructions for deploying the portfolio to production environments. The portfolio consists of a Next.js 15 frontend and optional FastAPI backend for enhanced features.

## 📋 Prerequisites

### Required
- **Node.js 20+** and **pnpm** for frontend
- **Domain name** and SSL certificate
- **Git repository** (GitHub recommended for CI/CD)

### Optional (Enhanced Features)
- **Python 3.11+** for AI chat backend
- **PostgreSQL** for analytics storage
- **Redis** for caching and rate limiting
- **OpenAI API key** for AI chat functionality

## 🏗️ Deployment Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   CDN/Vercel    │    │   Your Domain    │    │   Backend API   │
│  (Frontend)     │◄───┤   mysite.com     ├───►│  (VPS/Cloud)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Static Files  │    │   DNS Records    │    │   Database &    │
│   Images, CSS   │    │   A, CNAME       │    │   Services      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🎯 Deployment Options

### Option 1: Frontend Only (Recommended for MVP)
- **Deployment**: Vercel/Netlify
- **Features**: Portfolio, projects, contact form, basic analytics
- **Cost**: Free tier available
- **Setup Time**: 15 minutes

### Option 2: Full-Stack (Complete Experience)
- **Deployment**: Frontend (Vercel) + Backend (VPS/Cloud)
- **Features**: All features including AI chat, advanced analytics
- **Cost**: ~$5-20/month for VPS
- **Setup Time**: 1-2 hours

## 📦 Option 1: Frontend-Only Deployment

This deployment provides a fully functional portfolio with contact form and basic analytics.

### 1. Environment Setup

Create `.env.local` in the project root:

```bash
# Required
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_CONTACT_EMAIL=your-email@gmail.com

# Contact Form (choose one)
RESEND_API_KEY=re_your_api_key_here
# OR
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your_app_password_here

# Optional Analytics
NEXT_PUBLIC_ANALYTICS_ENABLED=true
```

### 2. Prepare for Deployment

```bash
# Install dependencies
pnpm install

# Build and test locally
pnpm build
pnpm start

# Verify the site works at http://localhost:3000
```

### 3. Deploy to Vercel (Recommended)

#### A. Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts:
# ? Set up and deploy? [Y/n] y
# ? Which scope? (your-username)
# ? What's your project's name? my-portfolio
# ? In which directory is your code located? ./
```

#### B. Via GitHub Integration
1. Push code to GitHub repository
2. Visit [vercel.com/dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables in Vercel dashboard
6. Deploy

### 4. Custom Domain Setup

```bash
# Add domain in Vercel dashboard
# Update DNS records:
# Type: CNAME
# Name: www
# Value: cname.vercel-dns.com

# Type: A
# Name: @
# Value: 76.76.19.61 (Vercel IP)
```

### 5. Verify Deployment

- [ ] Site loads at your custom domain
- [ ] All pages render correctly
- [ ] Contact form sends emails
- [ ] Images and assets load properly
- [ ] SEO metadata is correct
- [ ] Performance score >90 (Lighthouse)

## 🚀 Option 2: Full-Stack Deployment

This provides the complete experience with AI chat and advanced analytics.

### Phase 1: Backend Deployment

#### 1. Server Provisioning

**Recommended Providers:**
- **DigitalOcean Droplet**: $6/month, easy setup
- **AWS EC2 t3.micro**: Free tier for 1 year
- **Linode**: $5/month, developer-friendly
- **Vultr**: $2.50/month for testing

**Server Specifications:**
- **CPU**: 1-2 vCPUs
- **RAM**: 1-2GB (minimum for FastAPI)
- **Storage**: 25GB SSD
- **OS**: Ubuntu 22.04 LTS

#### 2. Server Setup

```bash
# Connect to your server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install dependencies
apt install -y python3 python3-pip nginx postgresql postgresql-contrib redis-server git curl

# Install Python dependencies manager
pip3 install pipenv

# Setup firewall
ufw allow ssh
ufw allow 80
ufw allow 443
ufw --force enable
```

#### 3. Database Setup

```bash
# Setup PostgreSQL
sudo -u postgres psql

-- In PostgreSQL shell:
CREATE DATABASE portfolio;
CREATE USER portfoliouser WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE portfolio TO portfoliouser;
\q
```

#### 4. Application Deployment

```bash
# Clone repository
git clone https://github.com/yourusername/your-portfolio.git /var/www/portfolio
cd /var/www/portfolio

# Create production environment
cp .env.example .env
nano .env

# Add production environment variables:
DATABASE_URL=postgresql://portfoliouser:your_secure_password@localhost:5432/portfolio
SECRET_KEY=your_super_secret_key_here
OPENAI_API_KEY=sk-your_openai_key_here
REDIS_URL=redis://localhost:6379
ALLOWED_ORIGINS=https://yourdomain.com

# Install backend dependencies
cd apps/service-python
pip3 install -r requirements.txt

# Run database migrations
python -c "from app.core.database import engine, Base; Base.metadata.create_all(bind=engine)"

# Build RAG index
python scripts/build_rag_index.py
```

#### 5. Process Management with Systemd

Create service file:
```bash
sudo nano /etc/systemd/system/portfolio-api.service
```

Add configuration:
```ini
[Unit]
Description=Portfolio API
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/portfolio/apps/service-python
Environment=PATH=/var/www/portfolio/apps/service-python/venv/bin
ExecStart=/usr/local/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

Start the service:
```bash
sudo systemctl enable portfolio-api
sudo systemctl start portfolio-api
sudo systemctl status portfolio-api
```

#### 6. Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/portfolio-api
```

Add configuration:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/portfolio-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 7. SSL Certificate

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

### Phase 2: Frontend Deployment

#### 1. Update Frontend Environment

```bash
# Update .env.local
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_CONTACT_EMAIL=your-email@gmail.com

# Contact form settings (same as Option 1)
RESEND_API_KEY=re_your_api_key_here

# Analytics
NEXT_PUBLIC_ANALYTICS_ENABLED=true
```

#### 2. Deploy Frontend (Same as Option 1)

Follow the Vercel deployment steps from Option 1, but with updated environment variables.

### Phase 3: Domain Configuration

#### 1. DNS Records

Set up the following DNS records:

```
# Main domain (frontend)
Type: CNAME, Name: @, Value: cname.vercel-dns.com
Type: CNAME, Name: www, Value: cname.vercel-dns.com

# API subdomain (backend)
Type: A, Name: api, Value: your-server-ip
```

#### 2. Verify Full-Stack Integration

- [ ] Frontend loads at https://yourdomain.com
- [ ] API accessible at https://api.yourdomain.com/docs
- [ ] AI chat works with streaming responses
- [ ] Contact form sends emails
- [ ] Analytics tracking functional
- [ ] All features working end-to-end

## 🔧 Post-Deployment Setup

### 1. Monitoring Setup

#### Application Monitoring
```bash
# Install monitoring tools
pip3 install sentry-sdk

# Add to backend environment
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

#### Server Monitoring
```bash
# Install system monitoring
sudo apt install htop iotop nethogs

# Setup log monitoring
sudo systemctl enable rsyslog
```

### 2. Backup Configuration

#### Database Backup
```bash
# Create backup script
sudo nano /usr/local/bin/backup-portfolio.sh

#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U portfoliouser -h localhost portfolio > /var/backups/portfolio_$DATE.sql
find /var/backups -name "portfolio_*.sql" -mtime +7 -delete

# Make executable
sudo chmod +x /usr/local/bin/backup-portfolio.sh

# Add to crontab
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-portfolio.sh
```

#### Application Backup
```bash
# Backup application files
tar -czf /var/backups/portfolio-app_$(date +%Y%m%d).tar.gz /var/www/portfolio
```

### 3. Performance Optimization

#### Enable Gzip Compression
```nginx
# Add to nginx config
gzip on;
gzip_vary on;
gzip_min_length 10240;
gzip_proxied expired no-cache no-store private must-revalidate auth;
gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss application/atom+xml image/svg+xml;
```

#### Cache Headers
```nginx
# Static assets caching
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 4. Security Hardening

#### Fail2Ban Setup
```bash
# Install fail2ban
sudo apt install fail2ban

# Configure
sudo nano /etc/fail2ban/jail.local

[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true

[nginx-http-auth]
enabled = true
```

#### Regular Updates
```bash
# Setup automatic security updates
sudo nano /etc/apt/apt.conf.d/50unattended-upgrades
# Enable unattended-upgrades
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Clear build cache
pnpm clean
rm -rf .next node_modules
pnpm install
pnpm build
```

#### 2. API Connection Issues
```bash
# Check backend status
sudo systemctl status portfolio-api

# View logs
journalctl -u portfolio-api -f

# Test API directly
curl https://api.yourdomain.com/health
```

#### 3. Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test database connection
psql -U portfoliouser -d portfolio -h localhost
```

#### 4. SSL Certificate Issues
```bash
# Renew certificate
sudo certbot renew

# Check certificate status
sudo certbot certificates
```

### Performance Issues

#### 1. High Server Load
```bash
# Check resource usage
htop
iotop
nethogs

# Optimize PostgreSQL
sudo nano /etc/postgresql/14/main/postgresql.conf
# Adjust shared_buffers, work_mem based on your server specs
```

#### 2. Slow Response Times
```bash
# Enable Redis caching
# Add to backend environment
REDIS_URL=redis://localhost:6379

# Monitor Redis
redis-cli monitor
```

## 📊 Maintenance

### Regular Tasks

#### Weekly
- [ ] Check server disk space: `df -h`
- [ ] Review application logs
- [ ] Monitor SSL certificate expiry
- [ ] Check backup integrity

#### Monthly
- [ ] Update system packages: `sudo apt update && sudo apt upgrade`
- [ ] Review security logs
- [ ] Update application dependencies
- [ ] Performance audit with Lighthouse

#### Quarterly
- [ ] Security audit
- [ ] Database optimization
- [ ] Backup restoration test
- [ ] Dependency security scan

### Update Procedures

#### Application Updates
```bash
# Pull latest changes
cd /var/www/portfolio
git pull origin main

# Update backend dependencies
cd apps/service-python
pip3 install -r requirements.txt

# Restart services
sudo systemctl restart portfolio-api
sudo systemctl reload nginx

# Deploy frontend updates
# (This happens automatically via Vercel Git integration)
```

#### System Updates
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Update Python packages
pip3 list --outdated
pip3 install --upgrade package-name

# Restart services after major updates
sudo systemctl restart portfolio-api
sudo systemctl restart postgresql
sudo systemctl restart redis-server
```

## 📈 Scaling Considerations

### Traffic Growth
- **CDN**: Integrate Cloudflare for global performance
- **Database**: Consider PostgreSQL read replicas
- **Caching**: Implement Redis for API response caching
- **Load Balancing**: nginx upstream for multiple backend instances

### Feature Expansion
- **Analytics**: Migrate to dedicated analytics service (PostHog, Mixpanel)
- **AI Chat**: Consider OpenAI Assistant API for more advanced features
- **Content**: Implement headless CMS for easier content management
- **Multi-language**: Add i18n support for international audiences

## 🎯 Success Metrics

After deployment, monitor these key metrics:

### Technical Metrics
- **Uptime**: >99.5% availability
- **Performance**: Lighthouse score >90
- **Response Time**: API responses <500ms
- **Error Rate**: <1% of requests

### Business Metrics
- **Page Views**: Track popular content
- **Engagement**: Time on site, bounce rate
- **Conversions**: Contact form submissions, resume downloads
- **Chat Usage**: AI chat interactions and satisfaction

---

## 🆘 Support

If you encounter issues during deployment:

1. **Check the logs**: Most issues are visible in application/system logs
2. **Review configuration**: Double-check environment variables and DNS settings
3. **Test components**: Isolate and test each component separately
4. **Community support**: GitHub Issues or relevant community forums

---

**Need help with deployment?** Contact me at [suryadizhang86@gmail.com](mailto:suryadizhang86@gmail.com) or use the AI chat assistant on the live site.

---

*Last updated: $(date)* | *Deployment complexity: Intermediate* | *Setup time: 15 minutes (Option 1) - 2 hours (Option 2)*