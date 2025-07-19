#!/usr/bin/env bun

/**
 * Translation Coverage Analysis
 * Analyzes translation coverage across all packages and languages
 */

import { glob } from 'glob'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

interface CoverageConfig {
  failUnder?: number
  verbose?: boolean
  format?: 'table' | 'json' | 'summary'
}

interface LanguageCoverage {
  language: string
  totalKeys: number
  translatedKeys: number
  missingKeys: string[]
  coverage: number
}

interface PackageCoverage {
  package: string
  path: string
  languages: LanguageCoverage[]
  avgCoverage: number
}

interface CoverageReport {
  totalPackages: number
  totalLanguages: number
  overallCoverage: number
  packages: PackageCoverage[]
  summary: {
    best: PackageCoverage | null
    worst: PackageCoverage | null
    failingPackages: PackageCoverage[]
  }
}

/**
 * Get all keys from a nested JSON object
 */
function getKeys(obj: any, prefix = ''): string[] {
  const keys: string[] = []
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...getKeys(obj[key], fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  
  return keys
}

/**
 * Load and parse locale file
 */
function loadLocaleFile(filePath: string): Record<string, any> | null {
  try {
    if (!existsSync(filePath)) return null
    const content = readFileSync(filePath, 'utf8')
    return JSON.parse(content)
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error)
    return null
  }
}

/**
 * Analyze coverage for a single package
 */
function analyzePackageCoverage(packagePath: string, packageName: string): PackageCoverage | null {
  const localesPath = join(packagePath, 'locales')
  
  if (!existsSync(localesPath)) {
    return null
  }

  // Load source (English) file
  const sourceFile = join(localesPath, 'en.json')
  const sourceData = loadLocaleFile(sourceFile)
  
  if (!sourceData) {
    console.warn(`No source file found for ${packageName}`)
    return null
  }

  const sourceKeys = getKeys(sourceData)
  const targetLanguages = ['es', 'fr', 'de', 'ja', 'zh', 'pt', 'ar']
  
  const languages: LanguageCoverage[] = targetLanguages.map(lang => {
    const targetFile = join(localesPath, `${lang}.json`)
    const targetData = loadLocaleFile(targetFile)
    
    if (!targetData) {
      return {
        language: lang,
        totalKeys: sourceKeys.length,
        translatedKeys: 0,
        missingKeys: sourceKeys,
        coverage: 0
      }
    }

    const targetKeys = getKeys(targetData)
    const missingKeys = sourceKeys.filter(key => !targetKeys.includes(key))
    const translatedKeys = sourceKeys.length - missingKeys.length
    const coverage = sourceKeys.length > 0 ? (translatedKeys / sourceKeys.length) * 100 : 0

    return {
      language: lang,
      totalKeys: sourceKeys.length,
      translatedKeys,
      missingKeys,
      coverage
    }
  })

  const avgCoverage = languages.reduce((sum, lang) => sum + lang.coverage, 0) / languages.length

  return {
    package: packageName,
    path: packagePath,
    languages,
    avgCoverage
  }
}

/**
 * Generate coverage report
 */
function generateCoverageReport(): CoverageReport {
  const packages: PackageCoverage[] = []

  // Analyze app packages
  const appDirs = glob.sync('apps/*/locales').map(path => ({
    path: path.replace('/locales', ''),
    name: path.split('/')[1]
  }))

  for (const { path, name } of appDirs) {
    const coverage = analyzePackageCoverage(path, name)
    if (coverage) packages.push(coverage)
  }

  // Analyze regular packages
  const packageDirs = glob.sync('packages/*/locales').map(path => ({
    path: path.replace('/locales', ''),
    name: path.split('/')[1]
  }))

  for (const { path, name } of packageDirs) {
    const coverage = analyzePackageCoverage(path, name)
    if (coverage) packages.push(coverage)
  }

  // Analyze Onasis-CORE packages
  const onasisPackageDirs = glob.sync('packages/onasis-core/packages/*/locales').map(path => ({
    path: path.replace('/locales', ''),
    name: `onasis-${path.split('/').pop()}`
  }))

  for (const { path, name } of onasisPackageDirs) {
    const coverage = analyzePackageCoverage(path, name)
    if (coverage) packages.push(coverage)
  }

  // Analyze Onasis-CORE services
  const onasisServiceDirs = glob.sync('packages/onasis-core/services/*/locales').map(path => ({
    path: path.replace('/locales', ''),
    name: `onasis-service-${path.split('/').pop()}`
  }))

  for (const { path, name } of onasisServiceDirs) {
    const coverage = analyzePackageCoverage(path, name)
    if (coverage) packages.push(coverage)
  }

  // Analyze Onasis-CORE apps
  const onasisAppDirs = glob.sync('packages/onasis-core/apps/*/locales').map(path => ({
    path: path.replace('/locales', ''),
    name: `onasis-app-${path.split('/').pop()}`
  }))

  for (const { path, name } of onasisAppDirs) {
    const coverage = analyzePackageCoverage(path, name)
    if (coverage) packages.push(coverage)
  }

  const overallCoverage = packages.length > 0 
    ? packages.reduce((sum, pkg) => sum + pkg.avgCoverage, 0) / packages.length 
    : 0

  const best = packages.length > 0 
    ? packages.reduce((best, pkg) => pkg.avgCoverage > best.avgCoverage ? pkg : best) 
    : null

  const worst = packages.length > 0 
    ? packages.reduce((worst, pkg) => pkg.avgCoverage < worst.avgCoverage ? pkg : worst) 
    : null

  const failingPackages = packages.filter(pkg => pkg.avgCoverage < 90)

  return {
    totalPackages: packages.length,
    totalLanguages: 7, // es, fr, de, ja, zh, pt, ar
    overallCoverage,
    packages,
    summary: {
      best,
      worst,
      failingPackages
    }
  }
}

/**
 * Format coverage report as table
 */
function formatAsTable(report: CoverageReport): void {
  console.log('\n📊 Translation Coverage Report\n')
  console.log('=' .repeat(80))
  
  console.log(`📦 Total Packages: ${report.totalPackages}`)
  console.log(`🌍 Target Languages: ${report.totalLanguages}`)
  console.log(`📈 Overall Coverage: ${report.overallCoverage.toFixed(1)}%`)
  console.log('=' .repeat(80))

  // Package breakdown
  console.log('\n📋 Package Coverage:')
  console.log('-'.repeat(80))
  console.log('Package'.padEnd(30) + 'Avg Coverage'.padEnd(15) + 'Status')
  console.log('-'.repeat(80))

  for (const pkg of report.packages.sort((a, b) => b.avgCoverage - a.avgCoverage)) {
    const status = pkg.avgCoverage >= 95 ? '✅ Excellent' : 
                   pkg.avgCoverage >= 90 ? '🟡 Good' : 
                   pkg.avgCoverage >= 70 ? '🟠 Fair' : '❌ Poor'
    
    console.log(
      pkg.package.padEnd(30) + 
      `${pkg.avgCoverage.toFixed(1)}%`.padEnd(15) + 
      status
    )
  }

  // Language breakdown for worst performing package
  if (report.summary.worst && report.summary.worst.avgCoverage < 90) {
    console.log(`\n🔍 Detailed view: ${report.summary.worst.package}`)
    console.log('-'.repeat(50))
    console.log('Language'.padEnd(12) + 'Coverage'.padEnd(12) + 'Missing Keys')
    console.log('-'.repeat(50))

    for (const lang of report.summary.worst.languages) {
      console.log(
        lang.language.padEnd(12) + 
        `${lang.coverage.toFixed(1)}%`.padEnd(12) + 
        lang.missingKeys.length
      )
    }
  }

  // Summary
  console.log('\n📈 Summary:')
  console.log('-'.repeat(40))
  if (report.summary.best) {
    console.log(`🏆 Best: ${report.summary.best.package} (${report.summary.best.avgCoverage.toFixed(1)}%)`)
  }
  if (report.summary.worst) {
    console.log(`📉 Worst: ${report.summary.worst.package} (${report.summary.worst.avgCoverage.toFixed(1)}%)`)
  }
  console.log(`⚠️  Packages below 90%: ${report.summary.failingPackages.length}`)
}

/**
 * Format coverage report as JSON
 */
function formatAsJson(report: CoverageReport): void {
  console.log(JSON.stringify(report, null, 2))
}

/**
 * Format coverage report as summary
 */
function formatAsSummary(report: CoverageReport): void {
  console.log(`Overall Coverage: ${report.overallCoverage.toFixed(1)}%`)
  console.log(`Packages: ${report.totalPackages}`)
  console.log(`Languages: ${report.totalLanguages}`)
  console.log(`Failing: ${report.summary.failingPackages.length}`)
}

/**
 * Main execution
 */
function main(): void {
  const args = process.argv.slice(2)
  const config: CoverageConfig = {
    failUnder: 95,
    verbose: false,
    format: 'table'
  }

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--fail-under':
        config.failUnder = parseInt(args[++i]) || 95
        break
      case '--verbose':
        config.verbose = true
        break
      case '--format':
        config.format = (args[++i] as any) || 'table'
        break
      case '--help':
        console.log(`
Usage: bun run scripts/translation-coverage.ts [options]

Options:
  --fail-under <number>    Fail if coverage is below this percentage (default: 95)
  --verbose               Show detailed output
  --format <type>         Output format: table, json, summary (default: table)
  --help                  Show this help message

Examples:
  bun run i18n:coverage
  bun run i18n:coverage --fail-under 90
  bun run i18n:coverage --format json
  bun run i18n:coverage --verbose
        `)
        process.exit(0)
    }
  }

  console.log('🔍 Analyzing translation coverage...\n')
  
  const report = generateCoverageReport()

  switch (config.format) {
    case 'json':
      formatAsJson(report)
      break
    case 'summary':
      formatAsSummary(report)
      break
    default:
      formatAsTable(report)
  }

  // Exit with error if coverage is below threshold
  if (config.failUnder && report.overallCoverage < config.failUnder) {
    console.error(`\n❌ Coverage ${report.overallCoverage.toFixed(1)}% is below required ${config.failUnder}%`)
    process.exit(1)
  }

  console.log('\n✅ Coverage analysis complete!')
}

if (import.meta.main) {
  main()
}