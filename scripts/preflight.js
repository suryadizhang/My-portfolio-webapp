#!/usr/bin/env node

/**
 * Local CI Preflight Script
 * Runs comprehensive checks before pushing to catch issues early
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  step: (msg) => console.log(`${colors.cyan}${colors.bold}🚀 ${msg}${colors.reset}`)
};

// Track all errors
const errors = [];
const warnings = [];

function runCommand(command, options = {}) {
  try {
    const result = execSync(command, {
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options
    });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, error, output: error.stdout || error.message };
  }
}

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function checkPackageJson() {
  log.step('Checking package.json integrity...');
  
  const rootPackage = 'package.json';
  const webPackage = 'apps/web/package.json';
  const uiPackage = 'packages/ui/package.json';
  const utilsPackage = 'packages/utils/package.json';
  
  const files = [rootPackage, webPackage, uiPackage, utilsPackage];
  
  for (const file of files) {
    if (!checkFileExists(file)) {
      errors.push(`Missing ${file}`);
      continue;
    }
    
    try {
      JSON.parse(fs.readFileSync(file, 'utf8'));
      log.success(`${file} is valid`);
    } catch (error) {
      errors.push(`Invalid JSON in ${file}: ${error.message}`);
    }
  }
}

function checkWorkspaceResolution() {
  log.step('Testing workspace package resolution...');
  
  const testScript = `
    try {
      require.resolve('@portfolio/ui');
      require.resolve('@portfolio/utils');
      console.log('✅ Workspace packages resolved successfully');
    } catch (e) {
      console.error('❌ Workspace resolution failed:', e.message);
      process.exit(1);
    }
  `;
  
  const result = runCommand(`node -e "${testScript}"`, { silent: true });
  if (result.success) {
    log.success('Workspace packages resolve correctly');
  } else {
    errors.push('Workspace package resolution failed');
  }
}

function lintCheck() {
  log.step('Running ESLint...');
  
  const result = runCommand('npm run lint', { silent: true });
  if (result.success) {
    log.success('ESLint passed');
  } else {
    warnings.push('ESLint issues found (run npm run lint to see details)');
    log.warning('ESLint issues found - continuing anyway');
  }
}

function typeCheck() {
  log.step('Running TypeScript type check...');
  
  const result = runCommand('npm run typecheck', { silent: true });
  if (result.success) {
    log.success('TypeScript check passed');
  } else {
    errors.push('TypeScript errors found');
    log.error('TypeScript check failed');
    console.log(result.output);
  }
}

function testBuild() {
  log.step('Testing production build...');
  
  // First ensure workspace packages are built if needed
  const buildWorkspaces = runCommand('npm run build --workspace=@portfolio/ui --if-present', { silent: true });
  runCommand('npm run build --workspace=@portfolio/utils --if-present', { silent: true });
  
  // Test the web app build
  const result = runCommand('npm run build --workspace=apps/web', { silent: true });
  if (result.success) {
    log.success('Production build successful');
    
    // Check if standalone output was created
    const standaloneServer = 'apps/web/.next/standalone/apps/web/server.js';
    if (checkFileExists(standaloneServer)) {
      log.success('Standalone server.js created correctly');
    } else {
      warnings.push('Standalone server.js not found - check next.config.js output setting');
    }
  } else {
    errors.push('Production build failed');
    log.error('Build failed');
    console.log(result.output);
  }
}

function checkDependencies() {
  log.step('Checking for dependency issues...');
  
  const result = runCommand('npm audit --audit-level=high', { silent: true });
  if (result.success) {
    log.success('No high-level security vulnerabilities found');
  } else {
    warnings.push('High-level security vulnerabilities detected (run npm audit for details)');
  }
  
  // Check for outdated dependencies
  const outdated = runCommand('npm outdated', { silent: true });
  if (!outdated.success && outdated.output.includes('Package')) {
    warnings.push('Some dependencies are outdated (run npm outdated for details)');
  }
}

function checkDockerfile() {
  log.step('Validating Dockerfile...');
  
  if (!checkFileExists('Dockerfile')) {
    warnings.push('Dockerfile not found');
    return;
  }
  
  const dockerfile = fs.readFileSync('Dockerfile', 'utf8');
  
  // Check for critical Dockerfile patterns
  const checks = [
    { pattern: /FROM node:.*-alpine/, message: 'Using Alpine base image' },
    { pattern: /WORKDIR/, message: 'Working directory set' },
    { pattern: /COPY.*package.*json/, message: 'Package files copied' },
    { pattern: /RUN npm ci/, message: 'Dependencies installed with npm ci' },
    { pattern: /CMD.*node.*server\.js/, message: 'Correct start command' }
  ];
  
  let dockerfileValid = true;
  for (const check of checks) {
    if (check.pattern.test(dockerfile)) {
      log.success(check.message);
    } else {
      warnings.push(`Dockerfile: ${check.message} - not found`);
      dockerfileValid = false;
    }
  }
  
  if (dockerfileValid) {
    log.success('Dockerfile appears valid');
  }
}

function checkGitStatus() {
  log.step('Checking Git status...');
  
  const status = runCommand('git status --porcelain', { silent: true });
  if (status.success) {
    if (status.output.trim()) {
      log.info('Uncommitted changes detected:');
      console.log(status.output);
      warnings.push('Uncommitted changes present');
    } else {
      log.success('Working directory clean');
    }
  } else {
    warnings.push('Not in a Git repository or Git command failed');
  }
}

function runTests() {
  log.step('Running tests...');
  
  const result = runCommand('npm test', { silent: true });
  if (result.success) {
    log.success('All tests passed');
  } else {
    // Check if tests exist
    const hasTests = checkFileExists('apps/web/src/__tests__') || 
                    checkFileExists('apps/web/tests') ||
                    checkFileExists('apps/web/spec');
    
    if (!hasTests) {
      warnings.push('No tests found');
    } else {
      errors.push('Tests failed');
    }
  }
}

async function main() {
  console.log(`${colors.bold}${colors.magenta}🔍 Portfolio CI Preflight Check${colors.reset}\n`);
  
  const startTime = Date.now();
  
  // Run all checks
  checkPackageJson();
  checkWorkspaceResolution();
  lintCheck();
  typeCheck();
  testBuild();
  checkDependencies();
  checkDockerfile();
  checkGitStatus();
  runTests();
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  // Summary
  console.log(`\n${colors.bold}${colors.magenta}📊 Summary${colors.reset}`);
  console.log(`Duration: ${duration}s`);
  
  if (errors.length > 0) {
    log.error(`${errors.length} error(s) found:`);
    errors.forEach(error => console.log(`   • ${error}`));
  }
  
  if (warnings.length > 0) {
    log.warning(`${warnings.length} warning(s):`);
    warnings.forEach(warning => console.log(`   • ${warning}`));
  }
  
  if (errors.length === 0) {
    log.success('All critical checks passed! 🎉');
    log.info('Your code is ready to push');
    process.exit(0);
  } else {
    log.error('❌ Preflight checks failed');
    log.info('Please fix the errors above before pushing');
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    log.error(`Preflight script failed: ${error.message}`);
    process.exit(1);
  });
}