# Portfolio CI Preflight Check - PowerShell Version
# Runs comprehensive checks before pushing to catch issues early

param(
    [switch]$SkipBuild,
    [switch]$SkipTests,
    [switch]$Verbose
)

# Colors for console output
$Colors = @{
    Red = "Red"
    Green = "Green" 
    Yellow = "Yellow"
    Blue = "Blue"
    Magenta = "Magenta"
    Cyan = "Cyan"
}

function Write-Step($Message) {
    Write-Host "🚀 $Message" -ForegroundColor $Colors.Cyan
}

function Write-Success($Message) {
    Write-Host "✅ $Message" -ForegroundColor $Colors.Green
}

function Write-Warning($Message) {
    Write-Host "⚠️  $Message" -ForegroundColor $Colors.Yellow
}

function Write-Error($Message) {
    Write-Host "❌ $Message" -ForegroundColor $Colors.Red
}

function Write-Info($Message) {
    Write-Host "ℹ $Message" -ForegroundColor $Colors.Blue
}

# Track errors and warnings
$script:Errors = @()
$script:Warnings = @()

function Invoke-SafeCommand($Command, $ErrorAction = "Continue") {
    try {
        if ($Verbose) {
            Write-Host "Running: $Command" -ForegroundColor Gray
        }
        
        $result = Invoke-Expression $Command 2>&1
        $exitCode = $LASTEXITCODE
        
        return @{
            Success = ($exitCode -eq 0)
            Output = $result
            ExitCode = $exitCode
        }
    }
    catch {
        return @{
            Success = $false
            Output = $_.Exception.Message
            ExitCode = 1
        }
    }
}

function Test-FileExists($Path) {
    return Test-Path $Path
}

function Test-PackageJsonIntegrity {
    Write-Step "Checking package.json integrity..."
    
    $files = @("package.json", "apps/web/package.json", "packages/ui/package.json", "packages/utils/package.json")
    
    foreach ($file in $files) {
        if (-not (Test-FileExists $file)) {
            $script:Errors += "Missing $file"
            continue
        }
        
        try {
            Get-Content $file | ConvertFrom-Json | Out-Null
            Write-Success "$file is valid"
        }
        catch {
            $script:Errors += "Invalid JSON in $file`: $($_.Exception.Message)"
        }
    }
}

function Test-WorkspaceResolution {
    Write-Step "Testing workspace package resolution..."
    
    $testScript = @"
try {
    require.resolve('@portfolio/ui');
    require.resolve('@portfolio/utils');
    console.log('✅ Workspace packages resolved successfully');
} catch (e) {
    console.error('❌ Workspace resolution failed:', e.message);
    process.exit(1);
}
"@
    
    $result = Invoke-SafeCommand "node -e `"$testScript`""
    if ($result.Success) {
        Write-Success "Workspace packages resolve correctly"
    }
    else {
        $script:Errors += "Workspace package resolution failed"
    }
}

function Invoke-LintCheck {
    Write-Step "Running ESLint..."
    
    $result = Invoke-SafeCommand "npm run lint"
    if ($result.Success) {
        Write-Success "ESLint passed"
    }
    else {
        $script:Warnings += "ESLint issues found (run npm run lint to see details)"
        Write-Warning "ESLint issues found - continuing anyway"
    }
}

function Invoke-TypeCheck {
    Write-Step "Running TypeScript type check..."
    
    $result = Invoke-SafeCommand "npm run typecheck"
    if ($result.Success) {
        Write-Success "TypeScript check passed"
    }
    else {
        $script:Errors += "TypeScript errors found"
        Write-Error "TypeScript check failed"
        Write-Host $result.Output
    }
}

function Test-Build {
    if ($SkipBuild) {
        Write-Info "Skipping build check (--SkipBuild specified)"
        return
    }
    
    Write-Step "Testing production build..."
    
    # Build workspace packages if needed
    Invoke-SafeCommand "npm run build --workspace=@portfolio/ui --if-present" | Out-Null
    Invoke-SafeCommand "npm run build --workspace=@portfolio/utils --if-present" | Out-Null
    
    # Test the web app build
    $result = Invoke-SafeCommand "npm run build --workspace=apps/web"
    if ($result.Success) {
        Write-Success "Production build successful"
        
        # Check if standalone output was created
        $standaloneServer = "apps/web/.next/standalone/apps/web/server.js"
        if (Test-FileExists $standaloneServer) {
            Write-Success "Standalone server.js created correctly"
        }
        else {
            $script:Warnings += "Standalone server.js not found - check next.config.js output setting"
        }
    }
    else {
        $script:Errors += "Production build failed"
        Write-Error "Build failed"
        Write-Host $result.Output
    }
}

function Test-Dependencies {
    Write-Step "Checking for dependency issues..."
    
    $result = Invoke-SafeCommand "npm audit --audit-level=high"
    if ($result.Success) {
        Write-Success "No high-level security vulnerabilities found"
    }
    else {
        $script:Warnings += "High-level security vulnerabilities detected (run npm audit for details)"
    }
    
    # Check for outdated dependencies
    $outdated = Invoke-SafeCommand "npm outdated"
    if (-not $outdated.Success -and $outdated.Output -like "*Package*") {
        $script:Warnings += "Some dependencies are outdated (run npm outdated for details)"
    }
}

function Test-Dockerfile {
    Write-Step "Validating Dockerfile..."
    
    if (-not (Test-FileExists "Dockerfile")) {
        $script:Warnings += "Dockerfile not found"
        return
    }
    
    $dockerfile = Get-Content "Dockerfile" -Raw
    
    # Check for critical Dockerfile patterns
    $checks = @(
        @{ Pattern = "FROM node:.*-alpine"; Message = "Using Alpine base image" },
        @{ Pattern = "WORKDIR"; Message = "Working directory set" },
        @{ Pattern = "COPY.*package.*json"; Message = "Package files copied" },
        @{ Pattern = "RUN npm ci"; Message = "Dependencies installed with npm ci" },
        @{ Pattern = "CMD.*node.*server\.js"; Message = "Correct start command" }
    )
    
    $dockerfileValid = $true
    foreach ($check in $checks) {
        if ($dockerfile -match $check.Pattern) {
            Write-Success $check.Message
        }
        else {
            $script:Warnings += "Dockerfile: $($check.Message) - not found"
            $dockerfileValid = $false
        }
    }
    
    if ($dockerfileValid) {
        Write-Success "Dockerfile appears valid"
    }
}

function Test-GitStatus {
    Write-Step "Checking Git status..."
    
    $status = Invoke-SafeCommand "git status --porcelain"
    if ($status.Success) {
        if ($status.Output.Trim()) {
            Write-Info "Uncommitted changes detected:"
            Write-Host $status.Output
            $script:Warnings += "Uncommitted changes present"
        }
        else {
            Write-Success "Working directory clean"
        }
    }
    else {
        $script:Warnings += "Not in a Git repository or Git command failed"
    }
}

function Invoke-Tests {
    if ($SkipTests) {
        Write-Info "Skipping tests (--SkipTests specified)"
        return
    }
    
    Write-Step "Running tests..."
    
    $result = Invoke-SafeCommand "npm test"
    if ($result.Success) {
        Write-Success "All tests passed"
    }
    else {
        # Check if tests exist
        $hasTests = (Test-FileExists "apps/web/src/__tests__") -or 
                   (Test-FileExists "apps/web/tests") -or
                   (Test-FileExists "apps/web/spec")
        
        if (-not $hasTests) {
            $script:Warnings += "No tests found"
        }
        else {
            $script:Errors += "Tests failed"
        }
    }
}

function Main {
    Write-Host "🔍 Portfolio CI Preflight Check" -ForegroundColor $Colors.Magenta
    Write-Host ""
    
    $startTime = Get-Date
    
    # Run all checks
    Test-PackageJsonIntegrity
    Test-WorkspaceResolution
    Invoke-LintCheck
    Invoke-TypeCheck
    Test-Build
    Test-Dependencies
    Test-Dockerfile
    Test-GitStatus
    Invoke-Tests
    
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalSeconds
    
    # Summary
    Write-Host ""
    Write-Host "📊 Summary" -ForegroundColor $Colors.Magenta
    Write-Host "Duration: $([math]::Round($duration, 2))s"
    
    if ($script:Errors.Count -gt 0) {
        Write-Error "$($script:Errors.Count) error(s) found:"
        foreach ($errorMsg in $script:Errors) {
            Write-Host "   • $errorMsg" -ForegroundColor $Colors.Red
        }
    }
    
    if ($script:Warnings.Count -gt 0) {
        Write-Warning "$($script:Warnings.Count) warning(s):"
        foreach ($warningMsg in $script:Warnings) {
            Write-Host "   • $warningMsg" -ForegroundColor $Colors.Yellow
        }
    }
    
    if ($script:Errors.Count -eq 0) {
        Write-Success "All critical checks passed! 🎉"
        Write-Info "Your code is ready to push"
        exit 0
    }
    else {
        Write-Error "❌ Preflight checks failed"
        Write-Info "Please fix the errors above before pushing"
        exit 1
    }
}

# Run main function
Main