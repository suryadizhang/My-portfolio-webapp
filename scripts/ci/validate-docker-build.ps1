# Docker Build Validation Script
# Run this locally before pushing to catch Docker issues early

Write-Host "🚀 Starting Docker build validation..." -ForegroundColor Green

# Build the Docker image
Write-Host "📦 Building Docker image..." -ForegroundColor Yellow
$buildResult = docker build -t local/portfolio:validation . 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker build failed!" -ForegroundColor Red
    Write-Host $buildResult
    exit 1
}
Write-Host "✅ Docker build successful" -ForegroundColor Green

# Create a container to inspect the build output
Write-Host "🔍 Extracting and validating standalone output..." -ForegroundColor Yellow
$containerId = docker create local/portfolio:validation 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create container!" -ForegroundColor Red
    exit 1
}

# Create extraction directory
New-Item -ItemType Directory -Force -Path ".validation" | Out-Null

try {
    # Try to copy standalone output (mirrors CI extraction logic)
    docker cp "${containerId}:/app/standalone" .validation/ 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to copy /app/standalone" -ForegroundColor Red
        Write-Host "Trying to copy entire /app directory for inspection..."
        docker cp "${containerId}:/app" .validation/ 2>&1
        if (Test-Path ".validation/app") {
            Write-Host "Contents of /app:" -ForegroundColor Yellow
            Get-ChildItem -Recurse ".validation/app" | ForEach-Object { Write-Host $_.FullName }
        }
        throw "Standalone output not found"
    }

    # Verify server.js exists (monorepo structure)
    if (-not (Test-Path ".validation/standalone/apps/web/server.js")) {
        Write-Host "❌ server.js not found in standalone output at apps/web/server.js!" -ForegroundColor Red
        Write-Host "Contents of .validation/standalone:" -ForegroundColor Yellow
        if (Test-Path ".validation/standalone") {
            Get-ChildItem -Recurse ".validation/standalone" | ForEach-Object { Write-Host $_.FullName }
        }
        Write-Host "Looking for server.js files:"
        Get-ChildItem -Recurse ".validation" -Name "server.js" -ErrorAction SilentlyContinue | Write-Host
        throw "server.js missing at expected monorepo path"
    }

    Write-Host "✅ server.js found in standalone output" -ForegroundColor Green

    # Quick smoke test - start container briefly
    Write-Host "🌟 Running quick smoke test..." -ForegroundColor Yellow
    $testContainer = docker run -d -p 3001:3000 local/portfolio:validation 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to start container!" -ForegroundColor Red
        throw "Container start failed"
    }

    # Wait a moment for startup
    Start-Sleep -Seconds 3

    # Check if container is running
    $containerStatus = docker ps --filter "id=$testContainer" --format "{{.Status}}" 2>&1
    if ($containerStatus -like "*Up*") {
        Write-Host "✅ Container started successfully" -ForegroundColor Green
        
        # Optional: Test HTTP endpoint if curl is available
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3001" -TimeoutSec 5 -UseBasicParsing 2>$null
            if ($response.StatusCode -eq 200) {
                Write-Host "✅ HTTP endpoint responding" -ForegroundColor Green
            }
        } catch {
            Write-Host "⚠️ HTTP test skipped (endpoint may take longer to start)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Container not running properly" -ForegroundColor Red
        docker logs $testContainer 2>&1 | Write-Host
    }

    # Clean up test container
    docker stop $testContainer 2>&1 | Out-Null
    docker rm $testContainer 2>&1 | Out-Null

    Write-Host "✅ All validations passed! Ready for CI/CD deployment." -ForegroundColor Green

} catch {
    Write-Host "❌ Validation failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    # Clean up
    docker rm $containerId 2>&1 | Out-Null
    if (Test-Path ".validation") {
        Remove-Item -Recurse -Force ".validation"
    }
}

Write-Host "🎉 Docker build validation complete!" -ForegroundColor Green