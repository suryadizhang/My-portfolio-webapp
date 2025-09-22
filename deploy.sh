#!/bin/bash

# Production deployment script for IONOS VPS
# Usage: ./deploy.sh

set -e  # Exit on any error

echo "🚀 Starting deployment to apiportfolio.mysticdatanode.net..."

# Configuration
APP_DIR="/var/www/vhosts/apiportfolio.mysticdatanode.net/portfolio-app"
BACKUP_DIR="/var/backups/portfolio"
LOG_FILE="/var/log/portfolio-deploy.log"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

log "📂 Changing to application directory: $APP_DIR"
cd $APP_DIR

# Backup current version (if exists)
if [ -d ".next" ]; then
    log "💾 Creating backup..."
    tar -czf "$BACKUP_DIR/portfolio-backup-$(date +%Y%m%d-%H%M%S).tar.gz" .next public
fi

log "📥 Pulling latest changes from repository..."
git pull origin main

log "📦 Installing dependencies..."
npm ci --production=false

log "🏗️ Building application..."
npm run build

log "🧹 Cleaning up dev dependencies..."
npm prune --production

# Test if the build was successful
if [ ! -d ".next" ]; then
    log "❌ Build failed - .next directory not found!"
    exit 1
fi

log "🔄 Restarting PM2 process..."
pm2 restart portfolio-web

# Wait for the app to start
sleep 3

log "✅ Checking application health..."
if pm2 describe portfolio-web | grep -q "online"; then
    log "✅ Application is running successfully!"
else
    log "❌ Application failed to start!"
    pm2 logs portfolio-web --lines 20
    exit 1
fi

# Test the endpoint
log "🧪 Testing application endpoint..."
if curl -f -s http://localhost:3000 > /dev/null; then
    log "✅ Local endpoint test passed!"
else
    log "⚠️ Local endpoint test failed - check logs"
    pm2 logs portfolio-web --lines 10
fi

# Test PDF API specifically
if curl -f -s http://localhost:3000/api/resume/view > /dev/null; then
    log "✅ PDF API endpoint test passed!"
else
    log "⚠️ PDF API endpoint test failed"
fi

log "📊 Current PM2 status:"
pm2 status

log "🎉 Deployment completed successfully!"
log "🌐 Site: https://apiportfolio.mysticdatanode.net"
log "📋 Logs: pm2 logs portfolio-web"
log "📈 Monitor: pm2 monit"

echo ""
echo "🔗 Quick Links:"
echo "   Site: https://apiportfolio.mysticdatanode.net"
echo "   Plesk: https://108.175.12.154:8443"
echo "   Logs: pm2 logs portfolio-web"
echo ""