#!/bin/bash

# 🚀 Deployment Setup Helper Script
# This script helps you gather the required information for GitHub Secrets

echo "🎯 Portfolio Deployment Setup Helper"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}This script will help you gather information needed for deployment.${NC}"
echo -e "${BLUE}You'll need to manually add these as GitHub Repository Secrets.${NC}"
echo ""

# Vercel Setup
echo -e "${YELLOW}📋 VERCEL CONFIGURATION${NC}"
echo "1. Install Vercel CLI: npm install -g vercel@latest"
echo "2. Login to Vercel: vercel login"
echo "3. Link project: vercel link"
echo "4. Get project info: vercel project ls"
echo ""

read -p "Press Enter when you've completed the Vercel setup above..."
echo ""

echo -e "${GREEN}Please provide the following Vercel information:${NC}"
read -p "Vercel Organization ID: " VERCEL_ORG_ID
read -p "Vercel Project ID: " VERCEL_PROJECT_ID
read -p "Vercel Deployment Token: " VERCEL_TOKEN
echo ""

# VPS Setup
echo -e "${YELLOW}🖥️  VPS CONFIGURATION${NC}"
VPS_HOST="108.175.12.154"
echo "VPS Host: $VPS_HOST"
read -p "VPS Username: " VPS_USER
echo ""

echo "SSH Key Setup:"
echo "1. Generate key (if needed): ssh-keygen -t rsa -b 4096 -C \"your-email@example.com\""
echo "2. Copy to VPS: ssh-copy-id $VPS_USER@$VPS_HOST"
echo "3. Test connection: ssh $VPS_USER@$VPS_HOST"
echo ""

read -p "Path to your SSH private key (e.g., ~/.ssh/id_rsa): " SSH_KEY_PATH

if [ -f "$SSH_KEY_PATH" ]; then
    VPS_SSH_PRIVATE_KEY=$(cat "$SSH_KEY_PATH")
    echo -e "${GREEN}✅ SSH private key loaded successfully${NC}"
else
    echo -e "${RED}❌ SSH private key file not found at: $SSH_KEY_PATH${NC}"
    echo "Please ensure the file exists and try again."
    exit 1
fi

echo ""

# Optional secrets
echo -e "${YELLOW}📧 OPTIONAL APPLICATION SECRETS${NC}"
echo "Leave blank if not used in your application:"
read -p "SMTP Host (optional): " SMTP_HOST
read -p "SMTP User (optional): " SMTP_USER
read -p "SMTP Password (optional): " SMTP_PASS
read -p "OpenAI API Key (optional): " OPENAI_API_KEY
echo ""

# Generate summary
echo -e "${GREEN}🎉 CONFIGURATION SUMMARY${NC}"
echo "========================================"
echo ""
echo -e "${BLUE}Copy these values to GitHub Repository Secrets:${NC}"
echo "Settings > Secrets and variables > Actions > Repository secrets"
echo ""

echo -e "${YELLOW}Required Secrets:${NC}"
echo "VERCEL_ORG_ID: $VERCEL_ORG_ID"
echo "VERCEL_PROJECT_ID: $VERCEL_PROJECT_ID"
echo "VERCEL_TOKEN: $VERCEL_TOKEN"
echo "VPS_HOST: $VPS_HOST"
echo "VPS_USER: $VPS_USER"
echo "VPS_SSH_PRIVATE_KEY: [SSH Private Key Content]"
echo ""

if [ -n "$SMTP_HOST" ]; then
    echo -e "${YELLOW}Optional Application Secrets:${NC}"
    [ -n "$SMTP_HOST" ] && echo "SMTP_HOST: $SMTP_HOST"
    [ -n "$SMTP_USER" ] && echo "SMTP_USER: $SMTP_USER"
    [ -n "$SMTP_PASS" ] && echo "SMTP_PASS: $SMTP_PASS"
    [ -n "$OPENAI_API_KEY" ] && echo "OPENAI_API_KEY: $OPENAI_API_KEY"
    echo ""
fi

# Create secrets file
SECRETS_FILE="github-secrets-config.txt"
cat > "$SECRETS_FILE" << EOF
# GitHub Repository Secrets Configuration
# Add these to: Settings > Secrets and variables > Actions > Repository secrets

# Required for Vercel deployment
VERCEL_ORG_ID=$VERCEL_ORG_ID
VERCEL_PROJECT_ID=$VERCEL_PROJECT_ID
VERCEL_TOKEN=$VERCEL_TOKEN

# Required for VPS deployment  
VPS_HOST=$VPS_HOST
VPS_USER=$VPS_USER
VPS_SSH_PRIVATE_KEY<<EOF_SSH_KEY
$VPS_SSH_PRIVATE_KEY
EOF_SSH_KEY

# Optional application secrets
EOF

if [ -n "$SMTP_HOST" ]; then
    cat >> "$SECRETS_FILE" << EOF
SMTP_HOST=$SMTP_HOST
SMTP_USER=$SMTP_USER
SMTP_PASS=$SMTP_PASS
OPENAI_API_KEY=$OPENAI_API_KEY
EOF
fi

echo -e "${GREEN}✅ Configuration saved to: $SECRETS_FILE${NC}"
echo ""

# VPS preparation commands
echo -e "${BLUE}🔧 VPS PREPARATION COMMANDS${NC}"
echo "Run these commands on your VPS to prepare the environment:"
echo ""
echo "# Install Node.js 20 (if not already installed)"
echo "curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
echo "sudo apt-get install -y nodejs"
echo ""
echo "# Create deployment directory"
echo "sudo mkdir -p /opt/portfolio-backend"
echo "sudo chown \$USER:\$USER /opt/portfolio-backend"
echo ""
echo "# Verify setup"
echo "node -v"
echo "npm -v"
echo ""

echo -e "${GREEN}🎯 NEXT STEPS:${NC}"
echo "1. Add all secrets to GitHub Repository Settings"
echo "2. Run VPS preparation commands on your server"
echo "3. Push your code to trigger the deployment pipeline"
echo "4. Monitor deployment in GitHub Actions"
echo ""
echo -e "${BLUE}🚀 Ready to deploy! Push your changes to trigger the pipeline.${NC}"