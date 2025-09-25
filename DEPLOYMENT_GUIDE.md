# 🚀 Production Deployment Guide

This guide walks you through setting up complete CI/CD deployment for your portfolio application with:
- **Frontend**: Deployed to Vercel
- **Backend**: Deployed to IONOS VPS

## 📋 Prerequisites

### Required Repository Secrets

You need to configure the following secrets in your GitHub repository (`Settings > Secrets and variables > Actions > Repository secrets`):

#### Vercel Deployment Secrets
```
VERCEL_TOKEN         # Your Vercel deployment token
VERCEL_ORG_ID        # Your Vercel organization ID
VERCEL_PROJECT_ID    # Your Vercel project ID
```

#### VPS Deployment Secrets
```
VPS_SSH_PRIVATE_KEY  # SSH private key for VPS access
VPS_HOST             # VPS hostname or IP address (108.175.12.154)
VPS_USER             # SSH username for VPS access
```

#### Optional Application Secrets (if used in your app)
```
SMTP_HOST            # Email server host
SMTP_USER            # Email server username
SMTP_PASS            # Email server password
OPENAI_API_KEY       # OpenAI API key (if using AI features)
```

## 🔧 Setup Instructions

### Step 1: Configure Vercel

1. **Install Vercel CLI locally**:
   ```bash
   npm install -g vercel@latest
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Link your project**:
   ```bash
   cd "c:\Users\surya\projects\my portfolio"
   vercel link
   ```

4. **Get Vercel project information**:
   ```bash
   # Get your Org ID and Project ID
   vercel project list
   ```

5. **Create a Vercel deployment token**:
   - Go to Vercel Dashboard → Settings → Tokens
   - Create a new token with appropriate scope
   - Copy the token value

### Step 2: Configure VPS Access

1. **Generate SSH key pair** (if you don't have one):
   ```bash
   ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
   ```

2. **Copy public key to VPS**:
   ```bash
   ssh-copy-id your-username@108.175.12.154
   ```

3. **Test SSH connection**:
   ```bash
   ssh your-username@108.175.12.154
   ```

4. **Prepare VPS environment**:
   ```bash
   # On your VPS, install Node.js if not present
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Create deployment directory
   sudo mkdir -p /opt/portfolio-backend
   sudo chown $USER:$USER /opt/portfolio-backend
   ```

### Step 3: Configure GitHub Secrets

Add these secrets to your GitHub repository:

1. **VERCEL_TOKEN**: Your Vercel deployment token
2. **VERCEL_ORG_ID**: Your Vercel organization ID  
3. **VERCEL_PROJECT_ID**: Your Vercel project ID
4. **VPS_SSH_PRIVATE_KEY**: Contents of your SSH private key
5. **VPS_HOST**: `108.175.12.154`
6. **VPS_USER**: Your VPS username

### Step 4: Test the Deployment Pipeline

1. **Push changes to trigger deployment**:
   ```bash
   git add .
   git commit -m "Configure production deployment"
   git push origin main
   ```

2. **Or manually trigger deployment**:
   - Go to GitHub Actions
   - Select "Production Deployment" workflow
   - Click "Run workflow"
   - Check "Force deploy even if no changes detected"

## 🎯 Deployment Workflow

The deployment pipeline consists of these stages:

### 1. Change Detection
- Detects changes in frontend, backend, shared packages, and documentation
- Only deploys components that have changes (unless force-deployed)

### 2. Build Application  
- Validates repository structure and dependencies
- Runs TypeScript type checking and tests
- Builds Docker image with Next.js standalone output
- Pushes image to GitHub Container Registry

### 3. Deploy Frontend (Vercel)
- Triggers when frontend, shared, or documentation changes
- Uses Vercel CLI for production deployment
- Verifies deployment accessibility

### 4. Deploy Backend (VPS)
- Triggers when backend or shared changes  
- Extracts application from Docker image
- Uploads deployment bundle to VPS via SSH
- Stops existing processes and deploys new version
- Starts backend service on port 3001
- Verifies service health

### 5. Deployment Summary
- Generates comprehensive deployment report
- Shows status of all components
- Provides access URLs

## 🌐 Access Points

After successful deployment:

- **Frontend**: https://myportfolio.mysticdatanode.net
- **Backend API**: http://108.175.12.154:3001/api
- **API Documentation**: https://myportfolio.mysticdatanode.net/api-docs

## 🔍 Monitoring and Troubleshooting

### Check Deployment Status
```bash
# View GitHub Actions logs
# Go to: https://github.com/yourusername/your-repo/actions

# Check VPS backend logs
ssh your-username@108.175.12.154
tail -f /tmp/portfolio-backend.log

# Check if backend service is running
ssh your-username@108.175.12.154
cat /tmp/portfolio-backend.pid
ps aux | grep node
```

### Common Issues

1. **Build Failures**
   - Check TypeScript errors: `npm run typecheck`
   - Check test failures: `npm run test`
   - Verify package dependencies: `npm ci`

2. **Vercel Deployment Issues**
   - Verify Vercel tokens and project IDs
   - Check Vercel build logs in GitHub Actions
   - Test local Vercel deployment: `vercel --prod`

3. **VPS Deployment Issues**
   - Verify SSH key and VPS access
   - Check VPS disk space and Node.js version
   - Review backend service logs

### Manual VPS Commands

```bash
# Check backend service status
ssh your-username@108.175.12.154
cd /opt/portfolio-backend
ls -la backend/

# Restart backend service manually
cd /opt/portfolio-backend/backend/apps/web
export $(cat ../../.env.production | xargs)
nohup node server.js > /tmp/portfolio-backend.log 2>&1 & echo $! > /tmp/portfolio-backend.pid

# View real-time logs
tail -f /tmp/portfolio-backend.log
```

## 🔒 Security Considerations

- SSH private keys are encrypted in GitHub Secrets
- Environment variables are loaded securely on VPS
- Docker images are stored in private GitHub Container Registry
- All deployments use HTTPS/secure connections where possible

## 🚀 Next Steps

1. **Set up monitoring**: Consider adding health check endpoints
2. **Configure SSL**: Set up SSL certificate for VPS backend
3. **Database integration**: Add database deployment if needed
4. **Staging environment**: Create separate workflows for staging
5. **Rollback strategy**: Implement deployment rollback procedures

## 📞 Support

If you encounter issues:
1. Check GitHub Actions logs for detailed error messages
2. Verify all required secrets are configured correctly
3. Test SSH access to VPS manually
4. Ensure VPS has sufficient resources and correct Node.js version