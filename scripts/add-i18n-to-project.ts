#!/usr/bin/env bun

/**
 * Add i18n configuration to individual projects
 * This script adds i18n scripts to package.json for each project
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

interface PackageJson {
  name: string
  scripts?: Record<string, string>
  [key: string]: any
}

const i18nScripts = {
  "i18n:validate": "cd ../.. && bun run i18n:validate",
  "i18n:translate": "cd ../.. && bun run i18n:translate",
  "i18n:coverage": "cd ../.. && bun run i18n:coverage",
  "i18n:quality": "cd ../.. && bun run i18n:quality"
}

function updateProjectPackageJson(projectPath: string): boolean {
  const packageJsonPath = join(projectPath, 'package.json')
  
  if (!existsSync(packageJsonPath)) {
    console.log(`❌ No package.json found in ${projectPath}`)
    return false
  }

  try {
    const content = readFileSync(packageJsonPath, 'utf8')
    const packageJson: PackageJson = JSON.parse(content)
    
    // Initialize scripts if not exists
    if (!packageJson.scripts) {
      packageJson.scripts = {}
    }
    
    // Add i18n scripts
    let hasChanges = false
    for (const [key, value] of Object.entries(i18nScripts)) {
      if (!packageJson.scripts[key]) {
        packageJson.scripts[key] = value
        hasChanges = true
      }
    }
    
    if (hasChanges) {
      // Write updated package.json
      writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
      console.log(`✅ Updated ${packageJson.name} with i18n scripts`)
      return true
    } else {
      console.log(`ℹ️  ${packageJson.name} already has i18n scripts`)
      return false
    }
  } catch (error) {
    console.error(`❌ Error updating ${projectPath}:`, error)
    return false
  }
}

// Main execution
const projects = [
  'apps/vortexcore',
  'apps/vortexcore-saas',
  'apps/maple-site',
  'apps/lanonasis-index'
]

console.log('🚀 Adding i18n configuration to individual projects...\n')

let updatedCount = 0
for (const project of projects) {
  if (updateProjectPackageJson(project)) {
    updatedCount++
  }
}

console.log(`\n✅ Updated ${updatedCount} projects with i18n scripts`)
console.log('\nProjects can now run:')
console.log('  - bun run i18n:validate')
console.log('  - bun run i18n:translate')
console.log('  - bun run i18n:coverage')
console.log('  - bun run i18n:quality')
console.log('\nThese commands will use the centralized monorepo i18n system.')