#!/usr/bin/env bun

/**
 * Auto-detect new packages and apps for i18n configuration
 * This script automatically updates i18n.json when new packages are added
 */

import { glob } from 'glob'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

interface I18nConfig {
  locale: {
    source: string
    targets: string[]
  }
  buckets: Record<string, {
    include: string[]
    exclude: string[]
  }>
  prompts: {
    system: string
    context: string
  }
  ai: {
    temperature: number
    maxTokens: number
  }
}

interface DetectedPackage {
  name: string
  path: string
  type: 'app' | 'package' | 'onasis-service' | 'onasis-app' | 'onasis-package'
  hasLocales: boolean
  hasPackageJson: boolean
}

/**
 * Detect all packages and apps in the monorepo
 */
function detectPackages(): DetectedPackage[] {
  const packages: DetectedPackage[] = []
  
  // Detect regular apps
  const appDirs = glob.sync('apps/*/package.json')
  for (const packageJsonPath of appDirs) {
    const appPath = packageJsonPath.replace('/package.json', '')
    const appName = appPath.split('/')[1]
    
    packages.push({
      name: appName,
      path: appPath,
      type: 'app',
      hasLocales: existsSync(join(appPath, 'locales')),
      hasPackageJson: true
    })
  }
  
  // Detect regular packages
  const packageDirs = glob.sync('packages/*/package.json')
  for (const packageJsonPath of packageDirs) {
    const packagePath = packageJsonPath.replace('/package.json', '')
    const packageName = packagePath.split('/')[1]
    
    // Skip onasis-core as it's handled separately
    if (packageName === 'onasis-core') continue
    
    packages.push({
      name: packageName,
      path: packagePath,
      type: 'package',
      hasLocales: existsSync(join(packagePath, 'locales')),
      hasPackageJson: true
    })
  }
  
  // Detect Onasis-CORE packages
  const onasisPackageDirs = glob.sync('packages/onasis-core/packages/*/package.json')
  for (const packageJsonPath of onasisPackageDirs) {
    const packagePath = packageJsonPath.replace('/package.json', '')
    const packageName = packagePath.split('/').pop()!
    
    packages.push({
      name: `onasis-${packageName}`,
      path: packagePath,
      type: 'onasis-package',
      hasLocales: existsSync(join(packagePath, 'locales')),
      hasPackageJson: true
    })
  }
  
  // Detect Onasis-CORE services
  const onasisServiceDirs = glob.sync('packages/onasis-core/services/*')
  for (const servicePath of onasisServiceDirs) {
    if (!servicePath.includes('.')) { // Skip files, only directories
      const serviceName = servicePath.split('/').pop()!
      
      packages.push({
        name: `onasis-service-${serviceName}`,
        path: servicePath,
        type: 'onasis-service',
        hasLocales: existsSync(join(servicePath, 'locales')),
        hasPackageJson: existsSync(join(servicePath, 'package.json'))
      })
    }
  }
  
  // Detect Onasis-CORE apps
  const onasisAppDirs = glob.sync('packages/onasis-core/apps/*')
  for (const appPath of onasisAppDirs) {
    if (!appPath.includes('.')) { // Skip files, only directories
      const appName = appPath.split('/').pop()!
      
      packages.push({
        name: `onasis-app-${appName}`,
        path: appPath,
        type: 'onasis-app',
        hasLocales: existsSync(join(appPath, 'locales')),
        hasPackageJson: existsSync(join(appPath, 'package.json'))
      })
    }
  }
  
  return packages
}

/**
 * Generate bucket configuration for a package
 */
function generateBucketConfig(pkg: DetectedPackage): { include: string[], exclude: string[] } {
  const baseExcludes = [
    "**/*test*", 
    "**/*node_modules*", 
    "**/*dist*", 
    "**/*build*",
    "**/*.git*"
  ]
  
  return {
    include: [`${pkg.path}/locales/[locale].json`],
    exclude: baseExcludes
  }
}

/**
 * Update i18n.json configuration
 */
function updateI18nConfig(): void {
  const configPath = 'i18n.json'
  
  if (!existsSync(configPath)) {
    console.error('❌ i18n.json not found')
    process.exit(1)
  }
  
  // Read existing config
  const configContent = readFileSync(configPath, 'utf8')
  const config: I18nConfig = JSON.parse(configContent)
  
  // Detect all packages
  const detectedPackages = detectPackages()
  
  console.log(`🔍 Detected ${detectedPackages.length} packages/apps`)
  
  // Track what we're adding
  const newBuckets: string[] = []
  const updatedBuckets: string[] = []
  
  // Update buckets for each detected package
  for (const pkg of detectedPackages) {
    const bucketName = pkg.name
    const bucketConfig = generateBucketConfig(pkg)
    
    if (!config.buckets[bucketName]) {
      config.buckets[bucketName] = bucketConfig
      newBuckets.push(bucketName)
      console.log(`➕ Added new bucket: ${bucketName}`)
    } else {
      // Update existing bucket if needed
      const existingConfig = config.buckets[bucketName]
      if (JSON.stringify(existingConfig) !== JSON.stringify(bucketConfig)) {
        config.buckets[bucketName] = bucketConfig
        updatedBuckets.push(bucketName)
        console.log(`🔄 Updated bucket: ${bucketName}`)
      }
    }
  }
  
  // Write updated config
  writeFileSync(configPath, JSON.stringify(config, null, 2))
  
  console.log(`\n✅ Updated i18n.json`)
  console.log(`📊 Summary:`)
  console.log(`   - New buckets: ${newBuckets.length}`)
  console.log(`   - Updated buckets: ${updatedBuckets.length}`)
  console.log(`   - Total buckets: ${Object.keys(config.buckets).length}`)
  
  if (newBuckets.length > 0) {
    console.log(`\n🆕 New buckets added:`)
    newBuckets.forEach(bucket => console.log(`   - ${bucket}`))
  }
  
  if (updatedBuckets.length > 0) {
    console.log(`\n🔄 Buckets updated:`)
    updatedBuckets.forEach(bucket => console.log(`   - ${bucket}`))
  }
}

/**
 * Main execution
 */
if (import.meta.main) {
  console.log('🚀 Auto-detecting packages for i18n configuration...\n')
  updateI18nConfig()
  console.log('\n🎉 Auto-detection complete!')
}