# GitHub Secrets Configuration for Portfolio Deployment

## Required Secrets to add in GitHub Repository Settings

Go to: GitHub Repository → Settings → Secrets and variables → Actions → New repository secret

### **Server Access Credentials**
```
VPS_HOST=108.175.12.154
VPS_USERNAME=apiportfolio
VPS_PASSWORD=8Vh3K_dtswfy2Zk*
VPS_PORT=22
```

### **Domain Configuration**
```
DOMAIN_NAME=apiportfolio.mysticdatanode.net
SITE_URL=https://apiportfolio.mysticdatanode.net
```

### **Application Configuration**
```
NODE_ENV=production
PORT=3000
```

### **Optional API Keys (for full functionality)**
```
OPENAI_API_KEY=sk-your-openai-key
RESEND_API_KEY=re_your-resend-key
CONTACT_EMAIL=suryadizhang86@gmail.com
```

### **Security Secrets**
```
RESUME_SIGNING_SECRET=your-random-secret-for-pdf-security
JWT_SECRET=your-jwt-secret-key
```

## **How to Add Secrets:**

1. Go to your GitHub repository: https://github.com/suryadizhang/My-portfolio-webapp
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add each secret with the name and value from above

## **GitHub Actions Workflow Usage:**

These secrets will be used in `.github/workflows/deploy.yml`:

```yaml
env:
  VPS_HOST: ${{ secrets.VPS_HOST }}
  VPS_USERNAME: ${{ secrets.VPS_USERNAME }}
  VPS_PASSWORD: ${{ secrets.VPS_PASSWORD }}
  DOMAIN_NAME: ${{ secrets.DOMAIN_NAME }}
```

## **Local Development Environment:**

Create `.env.local` for development (DO NOT COMMIT):
```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
PORT=3000

# Development API keys (optional)
# OPENAI_API_KEY=your-dev-key
# RESEND_API_KEY=your-dev-key
```