#!/bin/bash
# Docker Build Validation Script
# Run this locally before pushing to catch Docker issues early

set -e

echo "🚀 Starting Docker build validation..."

# Build the Docker image
echo "📦 Building Docker image..."
if ! docker build -t local/portfolio:validation .; then
    echo "❌ Docker build failed!"
    exit 1
fi
echo "✅ Docker build successful"

# Create a container to inspect the build output
echo "🔍 Extracting and validating standalone output..."
CID=$(docker create local/portfolio:validation)

# Create extraction directory
mkdir -p .validation

cleanup() {
    echo "🧹 Cleaning up..."
    docker rm -f "$CID" 2>/dev/null || true
    rm -rf .validation
}
trap cleanup EXIT

# Try to copy standalone output (mirrors CI extraction logic)
if docker cp "$CID:/app/standalone" .validation/ 2>/dev/null; then
    echo "✅ Successfully copied /app/standalone"
else
    echo "❌ Failed to copy /app/standalone"
    echo "Trying to copy entire /app directory for inspection..."
    if docker cp "$CID:/app" .validation/ 2>/dev/null; then
        echo "Contents of /app:"
        find .validation/app -type f 2>/dev/null || true
    fi
    echo "❌ Standalone output not found"
    exit 1
fi

# Verify server.js exists (monorepo structure)
if [ ! -f ".validation/standalone/apps/web/server.js" ]; then
    echo "❌ server.js not found in standalone output at apps/web/server.js!"
    echo "Contents of .validation/standalone:"
    find .validation/standalone -type f 2>/dev/null || true
    echo "Looking for server.js files:"
    find .validation -name "server.js" -type f 2>/dev/null || true
    exit 1
fi

echo "✅ server.js found in standalone output"

# Quick smoke test - start container briefly
echo "🌟 Running quick smoke test..."
TEST_CID=$(docker run -d -p 3001:3000 local/portfolio:validation)

# Wait a moment for startup
sleep 3

# Check if container is running
if docker ps --filter "id=$TEST_CID" --format "{{.Status}}" | grep -q "Up"; then
    echo "✅ Container started successfully"
    
    # Optional: Test HTTP endpoint if curl is available
    if command -v curl &> /dev/null; then
        if curl -f -s "http://localhost:3001" > /dev/null 2>&1; then
            echo "✅ HTTP endpoint responding"
        else
            echo "⚠️ HTTP endpoint not ready (may need more startup time)"
        fi
    fi
else
    echo "❌ Container not running properly"
    docker logs "$TEST_CID" 2>&1 || true
    docker stop "$TEST_CID" 2>/dev/null || true
    docker rm "$TEST_CID" 2>/dev/null || true
    exit 1
fi

# Clean up test container
docker stop "$TEST_CID" 2>/dev/null || true
docker rm "$TEST_CID" 2>/dev/null || true

echo "✅ All validations passed! Ready for CI/CD deployment."
echo "🎉 Docker build validation complete!"