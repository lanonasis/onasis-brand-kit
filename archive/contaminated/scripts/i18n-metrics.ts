#!/usr/bin/env bun

/**
 * i18n Metrics and Analytics
 * Provides detailed metrics about translation health and trends
 */

import { glob } from 'glob'
import { readFileSync, existsSync, statSync } from 'fs'
import { join } from 'path'

interface TranslationFile {
  path: string
  language: string
  size: number
  lastModified: Date
  keyCount: number
}

interface PackageMetrics {
  name: string
  path: string
  sourceKeys: number
  translations: TranslationFile[]
  coverage: Record<string, number>
  freshness: Record<string, number> // Days since last update
  growth: {
    keysAdded: number
    translationsUpdated: number
    period: string
  }
}

interface GlobalMetrics {
  timestamp: string
  overview: {
    totalPackages: number
    totalSourceKeys: number
    totalTranslations: number
    averageCoverage: number
    healthScore: number
  }
  languages: Record<string, {
    totalKeys: number
    coverage: number
    packages: number
    avgFreshness: number
  }>
  packages: PackageMetrics[]
  trends: {
    topGrowing: PackageMetrics[]
    needsAttention: PackageMetrics[]
    stagnant: PackageMetrics[]
  }
  recommendations: string[]
}

/**
 * Count keys in nested object
 */
function countKeys(obj: any): number {
  let count = 0
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      count += countKeys(obj[key])
    } else {
      count++
    }
  }
  return count
}

/**
 * Load and analyze translation file
 */
function analyzeTranslationFile(filePath: string, language: string): TranslationFile | null {
  try {
    if (!existsSync(filePath)) return null
    
    const stats = statSync(filePath)
    const content = readFileSync(filePath, 'utf8')
    const data = JSON.parse(content)
    
    return {
      path: filePath,
      language,
      size: stats.size,
      lastModified: stats.mtime,
      keyCount: countKeys(data)
    }
  } catch (error) {
    console.warn(`Error analyzing ${filePath}:`, error)
    return null
  }
}

/**
 * Calculate freshness score (0-100, higher is fresher)
 */
function calculateFreshness(lastModified: Date): number {
  const now = new Date()
  const daysDiff = (now.getTime() - lastModified.getTime()) / (1000 * 60 * 60 * 24)
  
  if (daysDiff <= 1) return 100      // Very fresh
  if (daysDiff <= 7) return 80       // Fresh
  if (daysDiff <= 30) return 60      // Moderate
  if (daysDiff <= 90) return 40      // Stale
  return 20                          // Very stale
}

/**
 * Analyze package metrics
 */
function analyzePackageMetrics(packagePath: string, packageName: string): PackageMetrics | null {
  const localesPath = join(packagePath, 'locales')
  
  if (!existsSync(localesPath)) {
    return null
  }

  // Analyze source file
  const sourceFile = analyzeTranslationFile(join(localesPath, 'en.json'), 'en')
  if (!sourceFile) {
    return null
  }

  const sourceKeys = sourceFile.keyCount
  const languages = ['es', 'fr', 'de', 'ja', 'zh', 'pt', 'ar']
  const translations: TranslationFile[] = [sourceFile]
  const coverage: Record<string, number> = { en: 100 }
  const freshness: Record<string, number> = { en: calculateFreshness(sourceFile.lastModified) }

  // Analyze target language files
  for (const lang of languages) {
    const translationFile = analyzeTranslationFile(join(localesPath, `${lang}.json`), lang)
    
    if (translationFile) {
      translations.push(translationFile)
      coverage[lang] = sourceKeys > 0 ? (translationFile.keyCount / sourceKeys) * 100 : 0
      freshness[lang] = calculateFreshness(translationFile.lastModified)
    } else {
      coverage[lang] = 0
      freshness[lang] = 0
    }
  }

  // Calculate growth metrics (simplified - would need historical data for real trends)
  const avgFreshness = Object.values(freshness).reduce((sum, f) => sum + f, 0) / Object.keys(freshness).length
  const keysAdded = sourceKeys // Simplified - assume all keys are recent
  const translationsUpdated = translations.filter(t => calculateFreshness(t.lastModified) > 60).length

  return {
    name: packageName,
    path: packagePath,
    sourceKeys,
    translations,
    coverage,
    freshness,
    growth: {
      keysAdded,
      translationsUpdated,
      period: '30d'
    }
  }
}

/**
 * Generate global metrics
 */
function generateMetrics(): GlobalMetrics {
  const packages: PackageMetrics[] = []

  // Collect all packages
  const allPaths = [
    ...glob.sync('apps/*/locales').map(p => ({ path: p.replace('/locales', ''), name: p.split('/')[1] })),
    ...glob.sync('packages/*/locales').map(p => ({ path: p.replace('/locales', ''), name: p.split('/')[1] })),
    ...glob.sync('packages/onasis-core/packages/*/locales').map(p => ({ 
      path: p.replace('/locales', ''), 
      name: `onasis-${p.split('/').pop()}` 
    })),
    ...glob.sync('packages/onasis-core/services/*/locales').map(p => ({ 
      path: p.replace('/locales', ''), 
      name: `onasis-service-${p.split('/').pop()}` 
    })),
    ...glob.sync('packages/onasis-core/apps/*/locales').map(p => ({ 
      path: p.replace('/locales', ''), 
      name: `onasis-app-${p.split('/').pop()}` 
    }))
  ]

  for (const { path, name } of allPaths) {
    const metrics = analyzePackageMetrics(path, name)
    if (metrics) packages.push(metrics)
  }

  // Calculate overview metrics
  const totalSourceKeys = packages.reduce((sum, pkg) => sum + pkg.sourceKeys, 0)
  const totalTranslations = packages.reduce((sum, pkg) => sum + pkg.translations.length - 1, 0) // -1 for source
  const averageCoverage = packages.reduce((sum, pkg) => {
    const pkgAvg = Object.values(pkg.coverage).filter((_, i) => i > 0).reduce((s, c) => s + c, 0) / 7
    return sum + pkgAvg
  }, 0) / (packages.length || 1)

  // Calculate health score (composite metric)
  const healthScore = Math.min(100, (averageCoverage * 0.6) + 
    (packages.filter(pkg => Object.values(pkg.freshness).some(f => f > 60)).length / packages.length * 40))

  // Language-specific metrics
  const languages: Record<string, any> = {}
  const targetLanguages = ['es', 'fr', 'de', 'ja', 'zh', 'pt', 'ar']

  for (const lang of targetLanguages) {
    const langPackages = packages.filter(pkg => pkg.coverage[lang] > 0)
    const totalKeys = packages.reduce((sum, pkg) => sum + (pkg.coverage[lang] / 100 * pkg.sourceKeys), 0)
    const coverage = packages.reduce((sum, pkg) => sum + pkg.coverage[lang], 0) / packages.length
    const avgFreshness = packages.reduce((sum, pkg) => sum + (pkg.freshness[lang] || 0), 0) / packages.length

    languages[lang] = {
      totalKeys: Math.round(totalKeys),
      coverage,
      packages: langPackages.length,
      avgFreshness
    }
  }

  // Identify trends
  const topGrowing = packages
    .filter(pkg => pkg.growth.translationsUpdated > 2)
    .sort((a, b) => b.growth.keysAdded - a.growth.keysAdded)
    .slice(0, 5)

  const needsAttention = packages
    .filter(pkg => {
      const avgCoverage = Object.values(pkg.coverage).filter((_, i) => i > 0).reduce((s, c) => s + c, 0) / 7
      const avgFreshness = Object.values(pkg.freshness).reduce((s, f) => s + f, 0) / Object.keys(pkg.freshness).length
      return avgCoverage < 70 || avgFreshness < 40
    })
    .sort((a, b) => {
      const aScore = Object.values(a.coverage).reduce((s, c) => s + c, 0) / 7
      const bScore = Object.values(b.coverage).reduce((s, c) => s + c, 0) / 7
      return aScore - bScore
    })

  const stagnant = packages
    .filter(pkg => {
      const avgFreshness = Object.values(pkg.freshness).reduce((s, f) => s + f, 0) / Object.keys(pkg.freshness).length
      return avgFreshness < 30 && pkg.sourceKeys > 10
    })

  // Generate recommendations
  const recommendations: string[] = []
  
  if (averageCoverage < 80) {
    recommendations.push(`Overall coverage is ${averageCoverage.toFixed(1)}% - aim for 90%+`)
  }
  
  if (needsAttention.length > 0) {
    recommendations.push(`${needsAttention.length} packages need immediate attention`)
  }
  
  if (stagnant.length > 0) {
    recommendations.push(`${stagnant.length} packages have stale translations (>30 days old)`)
  }

  const worstLanguage = Object.entries(languages)
    .reduce((worst, [lang, data]) => data.coverage < worst[1].coverage ? [lang, data] : worst)

  if (worstLanguage[1].coverage < 70) {
    recommendations.push(`${worstLanguage[0]} language needs focus (${worstLanguage[1].coverage.toFixed(1)}% coverage)`)
  }

  recommendations.push('Run "bun run i18n:translate" to update translations')
  recommendations.push('Set up automated translation monitoring')

  return {
    timestamp: new Date().toISOString(),
    overview: {
      totalPackages: packages.length,
      totalSourceKeys,
      totalTranslations,
      averageCoverage,
      healthScore
    },
    languages,
    packages,
    trends: {
      topGrowing,
      needsAttention,
      stagnant
    },
    recommendations
  }
}

/**
 * Format metrics as dashboard
 */
function formatMetricsDashboard(metrics: GlobalMetrics): void {
  console.log('\n📊 i18n Metrics Dashboard')
  console.log(`Generated: ${new Date(metrics.timestamp).toLocaleString()}`)
  console.log('=' .repeat(80))

  // Overview
  console.log('\n🎯 Overview:')
  console.log(`   📦 Total Packages: ${metrics.overview.totalPackages}`)
  console.log(`   🔑 Total Source Keys: ${metrics.overview.totalSourceKeys.toLocaleString()}`)
  console.log(`   🌍 Total Translations: ${metrics.overview.totalTranslations.toLocaleString()}`)
  console.log(`   📈 Average Coverage: ${metrics.overview.averageCoverage.toFixed(1)}%`)
  console.log(`   ❤️  Health Score: ${metrics.overview.healthScore.toFixed(1)}%`)

  // Language breakdown
  console.log('\n🌍 Language Performance:')
  console.log('-'.repeat(70))
  console.log('Language'.padEnd(12) + 'Keys'.padEnd(12) + 'Coverage'.padEnd(12) + 'Packages'.padEnd(12) + 'Freshness')
  console.log('-'.repeat(70))

  for (const [lang, data] of Object.entries(metrics.languages)) {
    const freshness = data.avgFreshness > 70 ? '🟢' : data.avgFreshness > 40 ? '🟡' : '🔴'
    console.log(
      lang.toUpperCase().padEnd(12) +
      data.totalKeys.toLocaleString().padEnd(12) +
      `${data.coverage.toFixed(1)}%`.padEnd(12) +
      data.packages.toString().padEnd(12) +
      `${freshness} ${data.avgFreshness.toFixed(0)}`
    )
  }

  // Top performers
  if (metrics.trends.topGrowing.length > 0) {
    console.log('\n🚀 Most Active Packages:')
    console.log('-'.repeat(50))
    for (const pkg of metrics.trends.topGrowing.slice(0, 3)) {
      console.log(`   📈 ${pkg.name}: ${pkg.growth.keysAdded} keys, ${pkg.growth.translationsUpdated} updates`)
    }
  }

  // Needs attention
  if (metrics.trends.needsAttention.length > 0) {
    console.log('\n⚠️  Needs Attention:')
    console.log('-'.repeat(50))
    for (const pkg of metrics.trends.needsAttention.slice(0, 5)) {
      const avgCoverage = Object.values(pkg.coverage).filter((_, i) => i > 0).reduce((s, c) => s + c, 0) / 7
      console.log(`   🔴 ${pkg.name}: ${avgCoverage.toFixed(1)}% coverage`)
    }
  }

  // Stagnant packages
  if (metrics.trends.stagnant.length > 0) {
    console.log('\n😴 Stagnant Packages:')
    console.log('-'.repeat(50))
    for (const pkg of metrics.trends.stagnant.slice(0, 3)) {
      const avgFreshness = Object.values(pkg.freshness).reduce((s, f) => s + f, 0) / Object.keys(pkg.freshness).length
      console.log(`   ⏰ ${pkg.name}: ${avgFreshness.toFixed(0)} freshness score`)
    }
  }

  // Recommendations
  console.log('\n💡 Recommendations:')
  for (const rec of metrics.recommendations.slice(0, 5)) {
    console.log(`   → ${rec}`)
  }

  console.log('\n' + '='.repeat(80))
}

/**
 * Format metrics as JSON
 */
function formatMetricsJson(metrics: GlobalMetrics): void {
  console.log(JSON.stringify(metrics, null, 2))
}

/**
 * Format metrics as CSV for analysis
 */
function formatMetricsCsv(metrics: GlobalMetrics): void {
  console.log('package,source_keys,avg_coverage,avg_freshness,translations_count')
  
  for (const pkg of metrics.packages) {
    const avgCoverage = Object.values(pkg.coverage).filter((_, i) => i > 0).reduce((s, c) => s + c, 0) / 7
    const avgFreshness = Object.values(pkg.freshness).reduce((s, f) => s + f, 0) / Object.keys(pkg.freshness).length
    
    console.log(`${pkg.name},${pkg.sourceKeys},${avgCoverage.toFixed(1)},${avgFreshness.toFixed(1)},${pkg.translations.length - 1}`)
  }
}

/**
 * Main execution
 */
function main(): void {
  const args = process.argv.slice(2)
  const options = {
    format: 'dashboard' as 'dashboard' | 'json' | 'csv'
  }

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--format':
        options.format = (args[++i] as any) || 'dashboard'
        break
      case '--help':
        console.log(`
Usage: bun run scripts/i18n-metrics.ts [options]

Options:
  --format <type>     Output format: dashboard, json, csv (default: dashboard)
  --help              Show this help message

Examples:
  bun run i18n:metrics
  bun run i18n:metrics --format json
  bun run i18n:metrics --format csv > metrics.csv
        `)
        process.exit(0)
    }
  }

  console.log('📊 Generating i18n metrics...')
  
  const metrics = generateMetrics()

  switch (options.format) {
    case 'json':
      formatMetricsJson(metrics)
      break
    case 'csv':
      formatMetricsCsv(metrics)
      break
    default:
      formatMetricsDashboard(metrics)
  }
}

if (import.meta.main) {
  main()
}