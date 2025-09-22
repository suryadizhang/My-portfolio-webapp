# Production Deployment Guide: IONOS VPS + Plesk

## Server Information
- **VPS IP**: 108.175.12.154 (IPv4) / 2607:f1c0:f055:2500::1 (IPv6)
- **Domain**: apiportfolio.mysticdatanode.net → 74.208.236.184
- **Plesk Panel**: https://108.175.12.154:8443
- **OS**: Alma Linux 9 + Plesk
- **Resources**: 2 vCore, 4GB RAM, 120GB NVMe SSD

## Phase 1: Initial Server Access & Security

### 1.1 Connect to Plesk Panel
```bash
# Access Plesk Admin Panel
https://108.175.12.154:8443

# Login with:
# User: admin (or root)
# Password: [Your server password]
# License Key: A00H00-7V4512-MCW606-NJZN69-W1BY99
```

### 1.2 SSH Access Setup
```bash
# Connect via SSH (from your local machine)
ssh root@108.175.12.154

# Or use Plesk's built-in SSH terminal
# Go to: Tools & Settings > SSH Terminal
```

### 1.3 Basic Security Configuration
```bash
# Update system
dnf update -y

# Configure firewall (if not already done)
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --add-port=3000/tcp  # For Next.js dev
firewall-cmd --reload

# Check firewall status
firewall-cmd --list-all
```

## Phase 2: Domain & DNS Configuration

### 2.1 DNS Setup
Your domain `apiportfolio.mysticdatanode.net` is pointing to `74.208.236.184`, but your VPS is at `108.175.12.154`. You need to:

1. **Update DNS Records** (in your domain provider):
   ```
   A Record: apiportfolio.mysticdatanode.net → 108.175.12.154
   AAAA Record: apiportfolio.mysticdatanode.net → 2607:f1c0:f055:2500::1
   ```

2. **Add Domain in Plesk**:
   - Go to "Websites & Domains"
   - Click "Add Domain"
   - Enter: `apiportfolio.mysticdatanode.net`
   - Choose appropriate hosting settings

### 2.2 Verify DNS Propagation
```bash
# Check DNS resolution
nslookup apiportfolio.mysticdatanode.net
dig apiportfolio.mysticdatanode.net

# Check from your local machine
ping apiportfolio.mysticdatanode.net
```

## Phase 3: Node.js Environment Setup

### 3.1 Install Node.js via Plesk
1. Go to **Tools & Settings → Updates and Upgrades → Add/Remove Components**
2. Install **Node.js** extension
3. Or install manually via SSH:

```bash
# Install Node.js 20.x (recommended for Next.js 15)
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
dnf install nodejs -y

# Verify installation
node --version  # Should show v20.x
npm --version   # Should show v10.x
```

### 3.2 Install PM2 Process Manager
```bash
npm install -g pm2
pm2 --version
```

### 3.3 Install Git (if not present)
```bash
dnf install git -y
git --version
```

## Phase 4: Project Deployment

### 4.1 Create Deployment Directory
```bash
# Create app directory
mkdir -p /var/www/vhosts/apiportfolio.mysticdatanode.net/portfolio-app
cd /var/www/vhosts/apiportfolio.mysticdatanode.net/portfolio-app
```

### 4.2 Clone Repository
```bash
# Clone your repository (replace with your repo URL)
git clone https://github.com/suryadizhang/My-portfolio-webapp.git .

# Or upload files via Plesk File Manager
# Go to: Websites & Domains → apiportfolio.mysticdatanode.net → File Manager
```

### 4.3 Install Dependencies
```bash
# Install all dependencies
npm install

# Build the production application
npm run build

# Test the build
npm run start
```

## Phase 5: PM2 Process Configuration

### 5.1 Create PM2 Ecosystem File
Create `/var/www/vhosts/apiportfolio.mysticdatanode.net/portfolio-app/ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'portfolio-web',
    script: 'npm',
    args: 'run start',
    cwd: '/var/www/vhosts/apiportfolio.mysticdatanode.net/portfolio-app',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/portfolio-error.log',
    out_file: '/var/log/portfolio-out.log',
    log_file: '/var/log/portfolio-combined.log'
  }]
};
```

### 5.2 Start Application with PM2
```bash
# Start the application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Follow the instructions provided by the command above

# Check application status
pm2 status
pm2 logs portfolio-web
```

## Phase 6: Nginx/Apache Configuration

### 6.1 Configure Reverse Proxy in Plesk

1. **Go to**: Websites & Domains → apiportfolio.mysticdatanode.net
2. **Click**: Apache & nginx Settings
3. **Add** additional nginx directives:

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    
    # PDF viewing support
    proxy_set_header Accept-Ranges bytes;
    proxy_buffering off;
}

# Static files
location /_next/static {
    proxy_pass http://127.0.0.1:3000;
    add_header Cache-Control "public, max-age=31536000, immutable";
}

# PDF files
location /api/resume {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Content-Type application/pdf;
    add_header Content-Disposition inline;
}
```

## Phase 7: SSL Certificate Setup

### 7.1 Enable Let's Encrypt SSL via Plesk
1. **Go to**: Websites & Domains → apiportfolio.mysticdatanode.net → SSL/TLS Certificates
2. **Click**: Let's Encrypt
3. **Select**: Include www subdomain (if needed)
4. **Click**: Get it free

### 7.2 Force HTTPS Redirect
```nginx
# Add to nginx additional directives
if ($scheme != "https") {
    return 301 https://$host$request_uri;
}
```

## Phase 8: Production Environment Configuration

### 8.1 Create Production Environment File
Create `.env.production` in your project root:

```env
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://apiportfolio.mysticdatanode.net
PORT=3000

# Add any other production environment variables
```

### 8.2 Update next.config.js for Production
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    mdxRs: true,
  },
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  
  // PDF serving configuration
  async headers() {
    return [
      {
        source: '/api/resume/:path*',
        headers: [
          {
            key: 'Content-Disposition',
            value: 'inline'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
```

## Phase 9: Deployment Commands

### 9.1 Deployment Script
Create `deploy.sh`:

```bash
#!/bin/bash
cd /var/www/vhosts/apiportfolio.mysticdatanode.net/portfolio-app

# Pull latest changes
git pull origin main

# Install dependencies
npm ci

# Build application
npm run build

# Restart PM2 process
pm2 restart portfolio-web

# Show status
pm2 status
```

### 9.2 Make Script Executable
```bash
chmod +x deploy.sh
./deploy.sh
```

## Phase 10: Testing & Monitoring

### 10.1 Test Deployment
```bash
# Check if app is running
curl http://localhost:3000

# Check external access
curl https://apiportfolio.mysticdatanode.net

# Test PDF API specifically
curl https://apiportfolio.mysticdatanode.net/api/resume/view
```

### 10.2 Monitor Application
```bash
# View logs
pm2 logs portfolio-web

# Monitor resources
pm2 monit

# Check server resources
htop
df -h
```

## Troubleshooting

### Common Issues:

1. **Port 3000 not accessible**:
   ```bash
   firewall-cmd --permanent --add-port=3000/tcp
   firewall-cmd --reload
   ```

2. **Permission issues**:
   ```bash
   chown -R apache:apache /var/www/vhosts/apiportfolio.mysticdatanode.net/
   chmod -R 755 /var/www/vhosts/apiportfolio.mysticdatanode.net/
   ```

3. **Node.js version issues**:
   ```bash
   nvm install 20
   nvm use 20
   ```

4. **PDF not displaying inline**:
   - Check nginx configuration
   - Verify Content-Disposition headers
   - Test API route directly

## Security Checklist

- ✅ SSL Certificate installed
- ✅ Firewall configured
- ✅ Regular system updates
- ✅ Strong passwords
- ✅ SSH key authentication (recommended)
- ✅ Fail2ban setup (recommended)

---

This guide should get your Next.js portfolio with PDF viewing running on your IONOS VPS with Plesk!