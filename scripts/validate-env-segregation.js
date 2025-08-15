#!/usr/bin/env node

/**
 * Environment Segregation Validator
 * 
 * This script validates that environment variables are properly segregated
 * and no sensitive keys are exposed in frontend code.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONOREPO_ROOT = path.resolve(__dirname, '..');
const APPS_DIR = path.join(MONOREPO_ROOT, 'apps');
const PACKAGES_DIR = path.join(MONOREPO_ROOT, 'packages');
const SERVICES_DIR = path.join(MONOREPO_ROOT, 'services');

// Sensitive patterns that should never appear in frontend code
const SENSITIVE_PATTERNS = [
  /service_role/i,
  /SUPABASE_SERVICE_KEY/i,
  /service-role/i,
  /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9._-]{10,}/i, // JWT pattern
];

// Frontend patterns to identify frontend vs backend code
const FRONTEND_INDICATORS = [
  'src/',
  'public/',
  'components/',
  'pages/',
  '.tsx',
  '.jsx',
  'vite.config',
  'index.html'
];

const BACKEND_INDICATORS = [
  'server/',
  'api/',
  'functions/',
  'services/',
  'middleware/',
  '.server.',
  'edge-functions/'
];

let violations = [];
let warnings = [];
let passed = [];

/**
 * Check if a path indicates frontend code
 */
function isFrontendPath(filePath) {
  return FRONTEND_INDICATORS.some(indicator => filePath.includes(indicator));
}

/**
 * Check if a path indicates backend code
 */
function isBackendPath(filePath) {
  return BACKEND_INDICATORS.some(indicator => filePath.includes(indicator));
}

/**
 * Scan a file for sensitive patterns
 */
function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const violations = [];
    
    SENSITIVE_PATTERNS.forEach((pattern, index) => {
      const matches = content.match(new RegExp(pattern.source, pattern.flags + 'g'));
      if (matches) {
        matches.forEach(match => {
          violations.push({
            file: filePath,
            pattern: pattern.source,
            match: match.substring(0, 50) + (match.length > 50 ? '...' : ''),
            line: content.substring(0, content.indexOf(match)).split('\n').length
          });
        });
      }
    });
    
    return violations;
  } catch (error) {
    console.warn(`Could not read file ${filePath}: ${error.message}`);
    return [];
  }
}

/**
 * Scan directory recursively
 */
function scanDirectory(dirPath, shouldScanFile = () => true) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }
  
  const violations = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    // Skip certain directories
    if (entry.isDirectory()) {
      if (['node_modules', '.git', 'dist', 'build', '.next'].includes(entry.name)) {
        continue;
      }
      violations.push(...scanDirectory(fullPath, shouldScanFile));
    } else if (entry.isFile() && shouldScanFile(fullPath)) {
      violations.push(...scanFile(fullPath));
    }
  }
  
  return violations;
}

/**
 * Check if app has proper environment setup
 */
function checkAppEnvironment(appPath) {
  const appName = path.basename(appPath);
  const hasEnvExample = fs.existsSync(path.join(appPath, '.env.example'));
  const hasEnvTemplate = fs.existsSync(path.join(appPath, '.env.template'));
  const hasEnvFile = fs.existsSync(path.join(appPath, '.env'));
  
  if (!hasEnvExample && !hasEnvTemplate) {
    warnings.push(`❌ ${appName}: Missing .env.example or .env.template`);
    return false;
  }
  
  if (hasEnvFile) {
    warnings.push(`⚠️  ${appName}: .env file should be gitignored`);
  }
  
  passed.push(`✅ ${appName}: Has proper environment setup`);
  return true;
}

/**
 * Main validation function
 */
function validateEnvironmentSegregation() {
  console.log('🔍 Validating Environment Segregation...\n');
  
  // 1. Check each app for proper environment setup
  console.log('📁 Checking app environment setup...');
  if (fs.existsSync(APPS_DIR)) {
    const apps = fs.readdirSync(APPS_DIR, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);
    
    for (const app of apps) {
      checkAppEnvironment(path.join(APPS_DIR, app));
    }
  }
  
  // 2. Scan frontend code for sensitive patterns
  console.log('\n🔒 Scanning frontend code for sensitive patterns...');
  
  // Scan apps
  if (fs.existsSync(APPS_DIR)) {
    const appViolations = scanDirectory(APPS_DIR, (filePath) => {
      return isFrontendPath(filePath) && 
             (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || 
              filePath.endsWith('.js') || filePath.endsWith('.jsx') ||
              filePath.includes('.env'));
    });
    
    appViolations.forEach(violation => {
      if (isFrontendPath(violation.file)) {
        violations.push(`❌ SECURITY: ${violation.file}:${violation.line} - Found sensitive pattern: ${violation.match}`);
      }
    });
  }
  
  // 3. Check for root .env pollution
  console.log('\n📄 Checking for root environment pollution...');
  const rootEnv = path.join(MONOREPO_ROOT, '.env');
  if (fs.existsSync(rootEnv)) {
    const content = fs.readFileSync(rootEnv, 'utf8');
    if (content.includes('SUPABASE_SERVICE_KEY') || content.includes('service_role')) {
      violations.push('❌ ROOT: .env contains service keys that could leak to all apps');
    }
  }
  
  // 4. Check package.json for environment references
  console.log('\n📦 Checking package.json files for hardcoded environments...');
  const packageJsonFiles = [];
  
  function findPackageJsons(dir) {
    if (!fs.existsSync(dir)) return;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isFile() && entry.name === 'package.json') {
        packageJsonFiles.push(fullPath);
      } else if (entry.isDirectory() && !['node_modules', '.git'].includes(entry.name)) {
        findPackageJsons(fullPath);
      }
    }
  }
  
  [APPS_DIR, PACKAGES_DIR, SERVICES_DIR].forEach(dir => findPackageJsons(dir));
  
  packageJsonFiles.forEach(pkgPath => {
    try {
      const content = fs.readFileSync(pkgPath, 'utf8');
      const pkg = JSON.parse(content);
      
      // Check scripts for hardcoded URLs or keys
      if (pkg.scripts) {
        Object.entries(pkg.scripts).forEach(([scriptName, script]) => {
          if (typeof script === 'string' && /https:\/\/.*\.supabase\.co/.test(script)) {
            warnings.push(`⚠️  ${pkgPath}: Script '${scriptName}' contains hardcoded Supabase URL`);
          }
        });
      }
    } catch (error) {
      // Skip invalid package.json files
    }
  });
  
  // 5. Summary
  console.log('\n' + '='.repeat(60));
  console.log('🎯 ENVIRONMENT SEGREGATION VALIDATION RESULTS');
  console.log('='.repeat(60));
  
  if (passed.length > 0) {
    console.log('\n✅ PASSED:');
    passed.forEach(msg => console.log(`  ${msg}`));
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    warnings.forEach(msg => console.log(`  ${msg}`));
  }
  
  if (violations.length > 0) {
    console.log('\n❌ VIOLATIONS:');
    violations.forEach(msg => console.log(`  ${msg}`));
    console.log('\n💥 VALIDATION FAILED: Security violations found!');
    process.exit(1);
  }
  
  console.log(`\n🎉 VALIDATION PASSED: ${passed.length} checks passed, ${warnings.length} warnings`);
  console.log('\nNext steps:');
  console.log('- Review warnings and fix if necessary');
  console.log('- Ensure all .env files are properly gitignored');
  console.log('- Use environment-specific configurations for each app');
  console.log('- Never commit service_role keys to the repository');
}

// Run validation
validateEnvironmentSegregation();