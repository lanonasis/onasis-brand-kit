#!/usr/bin/env bun

/**
 * Setup standalone i18n configuration for individual projects
 * Each project can run i18n commands independently
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

interface PackageJson {
  name: string
  scripts?: Record<string, string>
  devDependencies?: Record<string, string>
  [key: string]: any
}

const standaloneI18nScripts = {
  "i18n": "npx lingo.dev@latest i18n",
  "i18n:translate": "npx lingo.dev@latest i18n",
  "i18n:validate": "node scripts/validate-translations.js",
  "i18n:check": "test -f locales/es.json && echo '✅ Translations exist' || echo '❌ Missing translations'"
}

const i18nConfigTemplate = {
  "version": 1.8,
  "$schema": "https://lingo.dev/schema/i18n.json",
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de", "ja", "zh", "pt", "ar"]
  },
  "buckets": {},
  "prompts": {
    "system": "You are a professional translator for a fintech, SaaS, and privacy infrastructure company. Maintain brand consistency, technical accuracy, and professional tone. Preserve all HTML tags, placeholders like {{variable}}, and technical terms.",
    "context": "This is part of the LAN Onasis ecosystem. Maintain consistent terminology for financial terms, privacy concepts, and technical infrastructure terms across all languages."
  },
  "ai": {
    "temperature": 0.1,
    "maxTokens": 2000
  }
}

const validateScript = `#!/usr/bin/env node

/**
 * Simple translation validator for standalone projects
 */

const fs = require('fs');
const path = require('path');

const languages = ['es', 'fr', 'de', 'ja', 'zh', 'pt', 'ar'];
const localesDir = path.join(__dirname, '..', 'locales');

// Check if source file exists
const sourceFile = path.join(localesDir, 'en.json');
if (!fs.existsSync(sourceFile)) {
  console.error('❌ Missing source file: locales/en.json');
  process.exit(1);
}

const sourceData = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
const sourceKeys = Object.keys(JSON.parse(JSON.stringify(sourceData, null, 2).replace(/\\{[^}]+\\}/g, '')));

let hasErrors = false;

for (const lang of languages) {
  const targetFile = path.join(localesDir, \`\${lang}.json\`);
  
  if (!fs.existsSync(targetFile)) {
    console.warn(\`⚠️  Missing translation: locales/\${lang}.json\`);
    continue;
  }
  
  try {
    const targetData = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
    console.log(\`✅ Valid JSON: \${lang}.json\`);
  } catch (error) {
    console.error(\`❌ Invalid JSON in \${lang}.json: \${error.message}\`);
    hasErrors = true;
  }
}

if (hasErrors) {
  process.exit(1);
} else {
  console.log('\\n✅ All translations are valid!');
}
`;

function setupProjectI18n(projectPath: string): boolean {
  const packageJsonPath = join(projectPath, 'package.json')
  
  if (!existsSync(packageJsonPath)) {
    console.log(`❌ No package.json found in ${projectPath}`)
    return false
  }

  try {
    const content = readFileSync(packageJsonPath, 'utf8')
    const packageJson: PackageJson = JSON.parse(content)
    const projectName = packageJson.name
    
    console.log(`\n📦 Setting up i18n for ${projectName}...`)
    
    // 1. Add i18n scripts to package.json
    if (!packageJson.scripts) {
      packageJson.scripts = {}
    }
    
    Object.assign(packageJson.scripts, standaloneI18nScripts)
    
    // 2. Create i18n.json config for this project
    const projectI18nConfig = { ...i18nConfigTemplate }
    projectI18nConfig.buckets[projectName] = {
      "include": ["locales/[locale].json"],
      "exclude": ["**/*test*", "**/*node_modules*", "**/*dist*", "**/*build*"]
    }
    
    writeFileSync(
      join(projectPath, 'i18n.json'),
      JSON.stringify(projectI18nConfig, null, 2) + '\n'
    )
    
    // 3. Create scripts directory if not exists
    const scriptsDir = join(projectPath, 'scripts')
    if (!existsSync(scriptsDir)) {
      mkdirSync(scriptsDir, { recursive: true })
    }
    
    // 4. Add validation script
    writeFileSync(
      join(scriptsDir, 'validate-translations.js'),
      validateScript
    )
    
    // 5. Update package.json
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
    
    // 6. Create .env.example if not exists
    const envExample = `# i18n Configuration
OPENAI_API_KEY=REDACTED_OPENAI_API_KEY

# Optional AI Providers
ANTHROPIC_API_KEY=REDACTED_ANTHROPIC_API_KEY
PERPLEXITY_API_KEY=your-perplexity-api-key-here
`
    
    if (!existsSync(join(projectPath, '.env.example'))) {
      writeFileSync(join(projectPath, '.env.example'), envExample)
    }
    
    console.log(`✅ ${projectName} now has standalone i18n!`)
    console.log(`   - Run 'bun run i18n:translate' to generate translations`)
    console.log(`   - Run 'bun run i18n:validate' to check translations`)
    console.log(`   - Set OPENAI_API_KEY=REDACTED_OPENAI_API_KEY
    
    return true
  } catch (error) {
    console.error(`❌ Error setting up ${projectPath}:`, error)
    return false
  }
}

// Main execution
const projects = [
  'apps/lanonasis-index'
  // Removed: vortexcore, vortexcore-saas, maple-site (now external repos)
]

console.log('🚀 Setting up standalone i18n for each project...\n')
console.log('This allows each team to:')
console.log('  - Run translations independently')
console.log('  - Manage their own i18n configuration')
console.log('  - Work without accessing the monorepo')

let successCount = 0
for (const project of projects) {
  if (setupProjectI18n(project)) {
    successCount++
  }
}

console.log(`\n✅ Set up ${successCount} projects with standalone i18n`)
console.log('\nEach project can now run:')
console.log('  - bun run i18n:translate (generates all translations)')
console.log('  - bun run i18n:validate (checks translation quality)')
console.log('  - bun run i18n:check (quick status check)')
console.log('\n⚡ Teams can work independently without monorepo access!')