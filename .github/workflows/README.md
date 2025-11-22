# 🚀 Portfolio CI/CD Architecture

## **Deployment Strategy Overview**

### ✅ **Frontend (Next.js) - Vercel Auto-Deployment**
- **Platform**: Vercel
- **Trigger**: Automatic on push to `main` branch
- **No GitHub Actions needed** - Vercel handles CI/CD automatically
- **Environment Variables**: Configured in Vercel Dashboard

### 🛠️ **Backend (Python API) - GitHub Actions**
- **Platform**: VPS/Plesk (IONOS)
- **Workflow**: `backend-only-ci-cd.yml`
- **Trigger**: Push to `main` with changes in `apps/service-python/**`
- **Process**: Build → Test → Deploy via SSH

## **Why This Architecture?**

1. **No Redundancy**: Vercel already provides excellent CI/CD for frontend
2. **Cost Effective**: Only run GitHub Actions when backend changes
3. **Faster Deployments**: Frontend deploys instantly via Vercel
4. **Clear Separation**: Backend deployment is isolated and controlled

## **Contact Form Configuration**

The contact form requires environment variables in **Vercel Dashboard**:

```bash
# Gmail SMTP (Recommended)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=suryadizhang.swe@gmail.com
SMTP_PASS=your_gmail_app_password
FROM_EMAIL=suryadizhang.swe@gmail.com
TO_EMAIL=suryadizhang.swe@gmail.com
```

**To Configure:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project → Settings → Environment Variables
3. Add the variables above
4. Redeploy to apply changes

## **Current Workflow**

- **Frontend**: Auto-deploys on every push to `main` 🚀
- **Backend**: Deploys only when `apps/service-python/**` changes 🛠️
- **Clean & Efficient**: No redundant workflows ✨