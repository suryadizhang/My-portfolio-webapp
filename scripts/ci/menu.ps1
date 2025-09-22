#!/usr/bin/env pwsh
# VS Code Docker Validation Menu
# Run this script to get a menu of validation options

param(
    [string]$Action = ""
)

function Show-Menu {
    Clear-Host
    Write-Host "🐳 Docker Validation Menu" -ForegroundColor Blue
    Write-Host "=========================" -ForegroundColor Blue
    Write-Host
    Write-Host "1. 🐳 Validate Docker Build" -ForegroundColor Green
    Write-Host "2. 🏗️  Build Next.js App" -ForegroundColor Yellow
    Write-Host "3. 🧪 Run Tests" -ForegroundColor Magenta
    Write-Host "4. 🔍 TypeScript Check" -ForegroundColor Cyan
    Write-Host "5. 🚀 Full Pre-Push Validation" -ForegroundColor Green
    Write-Host "6. ❌ Exit" -ForegroundColor Red
    Write-Host
}

function Invoke-DockerValidation {
    Write-Host "🐳 Running Docker Validation..." -ForegroundColor Blue
    & "$PSScriptRoot\validate-docker-build.ps1"
}

function Invoke-NextBuild {
    Write-Host "🏗️ Building Next.js App..." -ForegroundColor Yellow
    Push-Location "$PSScriptRoot\..\..\apps\web"
    npm run build
    Pop-Location
}

function Invoke-Tests {
    Write-Host "🧪 Running Tests..." -ForegroundColor Magenta
    Push-Location "$PSScriptRoot\..\.."
    npm test --workspaces --if-present
    Pop-Location
}

function Invoke-TypeCheck {
    Write-Host "🔍 Running TypeScript Check..." -ForegroundColor Cyan
    Push-Location "$PSScriptRoot\..\.."
    npm run type-check --workspaces --if-present
    Pop-Location
}

function Invoke-FullValidation {
    Write-Host "🚀 Running Full Pre-Push Validation..." -ForegroundColor Green
    Write-Host
    
    Write-Host "Step 1/4: TypeScript Check" -ForegroundColor Yellow
    Invoke-TypeCheck
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ TypeScript check failed!" -ForegroundColor Red
        return
    }
    
    Write-Host "Step 2/4: Running Tests" -ForegroundColor Yellow
    Invoke-Tests
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Tests failed!" -ForegroundColor Red
        return
    }
    
    Write-Host "Step 3/4: Building Next.js" -ForegroundColor Yellow
    Invoke-NextBuild
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Next.js build failed!" -ForegroundColor Red
        return
    }
    
    Write-Host "Step 4/4: Docker Validation" -ForegroundColor Yellow
    Invoke-DockerValidation
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Docker validation failed!" -ForegroundColor Red
        return
    }
    
    Write-Host "✅ All validations passed! Ready to push." -ForegroundColor Green
}

# Handle direct action parameter
switch ($Action.ToLower()) {
    "docker" { Invoke-DockerValidation; return }
    "build" { Invoke-NextBuild; return }
    "test" { Invoke-Tests; return }
    "typecheck" { Invoke-TypeCheck; return }
    "full" { Invoke-FullValidation; return }
}

# Interactive menu
do {
    Show-Menu
    $choice = Read-Host "Select an option (1-6)"
    
    switch ($choice) {
        "1" { Invoke-DockerValidation }
        "2" { Invoke-NextBuild }
        "3" { Invoke-Tests }
        "4" { Invoke-TypeCheck }
        "5" { Invoke-FullValidation }
        "6" { 
            Write-Host "👋 Goodbye!" -ForegroundColor Green
            break
        }
        default {
            Write-Host "❌ Invalid choice. Please select 1-6." -ForegroundColor Red
            Start-Sleep 2
        }
    }
    
    if ($choice -ne "6") {
        Write-Host
        Write-Host "Press any key to continue..." -ForegroundColor Gray
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
} while ($choice -ne "6")