#!/usr/bin/env bun

/**
 * Translation Report Generator
 * Generates comprehensive translation reports with metrics and insights
 */

import { glob } from 'glob'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

interface TranslationMetrics {
  totalKeys: number
  translatedKeys: number
  coverage: number
  lastUpdated: string
  fileSize: number
}

interface PackageReport {
  name: string
  path: string
  metrics: Record<string, TranslationMetrics>
  trends: {
    coverage: number
    growth: number
    quality: number
  }
}

interface GlobalReport {
  timestamp: string
  summary: {
    totalPackages: number
    totalKeys: number
    averageCoverage: number
    bestPerforming: string[]
    needsAttention: string[]
  }
  packages: PackageReport[]
  insights: string[]
  recommendations: string[]
}

/**
 * Get file stats
 */
function getFileStats(filePath: string) {
  try {
    const stats = require('fs').statSync(filePath)
    return {
      size: stats.size,
      modified: stats.mtime.toISOString()
    }
  } catch {
    return { size: 0, modified: new Date().toISOString() }
  }
}

/**
 * Count keys in JSON object
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
 * Load translation file
 */
function loadTranslationFile(filePath: string): any {
  try {
    if (!existsSync(filePath)) return null
    return JSON.parse(readFileSync(filePath, 'utf8'))
  } catch {
    return null
  }
}

/**
 * Analyze package translations
 */
function analyzePackage(packagePath: string, packageName: string): PackageReport | null {
  const localesPath = join(packagePath, 'locales')
  
  if (!existsSync(localesPath)) {
    return null
  }

  const sourceFile = join(localesPath, 'en.json')
  const sourceData = loadTranslationFile(sourceFile)
  
  if (!sourceData) {
    return null
  }

  const sourceKeys = countKeys(sourceData)
  const languages = ['es', 'fr', 'de', 'ja', 'zh', 'pt', 'ar']
  
  const metrics: Record<string, TranslationMetrics> = {}

  // Analyze source language
  const sourceStats = getFileStats(sourceFile)
  metrics['en'] = {
    totalKeys: sourceKeys,
    translatedKeys: sourceKeys,
    coverage: 100,
    lastUpdated: sourceStats.modified,
    fileSize: sourceStats.size
  }

  // Analyze target languages
  for (const lang of languages) {
    const targetFile = join(localesPath, `${lang}.json`)
    const targetData = loadTranslationFile(targetFile)
    const targetStats = getFileStats(targetFile)
    
    const translatedKeys = targetData ? countKeys(targetData) : 0
    const coverage = sourceKeys > 0 ? (translatedKeys / sourceKeys) * 100 : 0

    metrics[lang] = {
      totalKeys: sourceKeys,
      translatedKeys,
      coverage,
      lastUpdated: targetStats.modified,
      fileSize: targetStats.size
    }
  }

  // Calculate trends (simplified for now)
  const avgCoverage = Object.values(metrics)
    .filter(m => m.coverage < 100)
    .reduce((sum, m) => sum + m.coverage, 0) / 7

  return {
    name: packageName,
    path: packagePath,
    metrics,
    trends: {
      coverage: avgCoverage,
      growth: avgCoverage > 80 ? 1 : avgCoverage > 50 ? 0 : -1,
      quality: avgCoverage > 90 ? 1 : avgCoverage > 70 ? 0 : -1
    }
  }
}

/**
 * Generate insights based on data
 */
function generateInsights(packages: PackageReport[]): string[] {
  const insights: string[] = []
  
  const avgCoverage = packages.reduce((sum, pkg) => sum + pkg.trends.coverage, 0) / packages.length
  insights.push(`Average translation coverage across all packages is ${avgCoverage.toFixed(1)}%`)

  const highPerformers = packages.filter(pkg => pkg.trends.coverage > 90)
  if (highPerformers.length > 0) {
    insights.push(`${highPerformers.length} packages have excellent coverage (>90%)`)
  }

  const lowPerformers = packages.filter(pkg => pkg.trends.coverage < 50)
  if (lowPerformers.length > 0) {
    insights.push(`${lowPerformers.length} packages need immediate attention (<50% coverage)`)
  }

  const onasisPackages = packages.filter(pkg => pkg.name.startsWith('onasis-'))
  if (onasisPackages.length > 0) {
    const onasisAvg = onasisPackages.reduce((sum, pkg) => sum + pkg.trends.coverage, 0) / onasisPackages.length
    insights.push(`Onasis-CORE packages average ${onasisAvg.toFixed(1)}% coverage`)
  }

  return insights
}

/**
 * Generate recommendations
 */
function generateRecommendations(packages: PackageReport[]): string[] {
  const recommendations: string[] = []
  
  const needsWork = packages.filter(pkg => pkg.trends.coverage < 80)
  if (needsWork.length > 0) {
    recommendations.push(`Prioritize translation work on: ${needsWork.map(p => p.name).join(', ')}`)
  }

  const staleTranslations = packages.filter(pkg => {
    const sourceTime = new Date(pkg.metrics['en'].lastUpdated).getTime()
    const translations = Object.values(pkg.metrics).filter(m => m.coverage < 100)
    return translations.some(t => new Date(t.lastUpdated).getTime() < sourceTime - 86400000) // 24 hours
  })

  if (staleTranslations.length > 0) {
    recommendations.push(`Update stale translations in: ${staleTranslations.map(p => p.name).join(', ')}`)
  }

  const emptyPackages = packages.filter(pkg => 
    Object.values(pkg.metrics).filter(m => m.coverage < 100).every(m => m.translatedKeys === 0)
  )

  if (emptyPackages.length > 0) {
    recommendations.push(`Initialize translations for: ${emptyPackages.map(p => p.name).join(', ')}`)
  }

  recommendations.push('Run "bun run i18n:translate" to update all translations')
  recommendations.push('Set up automated translation updates in CI/CD pipeline')

  return recommendations
}

/**
 * Generate comprehensive report
 */
function generateReport(): GlobalReport {
  const packages: PackageReport[] = []

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
    const report = analyzePackage(path, name)
    if (report) packages.push(report)
  }

  const totalKeys = packages.reduce((sum, pkg) => sum + pkg.metrics['en'].totalKeys, 0)
  const avgCoverage = packages.reduce((sum, pkg) => sum + pkg.trends.coverage, 0) / packages.length

  const bestPerforming = packages
    .filter(pkg => pkg.trends.coverage > 90)
    .map(pkg => pkg.name)

  const needsAttention = packages
    .filter(pkg => pkg.trends.coverage < 70)
    .map(pkg => pkg.name)

  return {
    timestamp: new Date().toISOString(),
    summary: {
      totalPackages: packages.length,
      totalKeys,
      averageCoverage: avgCoverage,
      bestPerforming,
      needsAttention
    },
    packages,
    insights: generateInsights(packages),
    recommendations: generateRecommendations(packages)
  }
}

/**
 * Format report as table
 */
function formatReportTable(report: GlobalReport): void {
  console.log('\n📊 Translation Report')
  console.log(`Generated: ${new Date(report.timestamp).toLocaleString()}`)
  console.log('='.repeat(80))

  // Summary
  console.log('\n📈 Summary:')
  console.log(`   Total Packages: ${report.summary.totalPackages}`)
  console.log(`   Total Keys: ${report.summary.totalKeys.toLocaleString()}`)
  console.log(`   Average Coverage: ${report.summary.averageCoverage.toFixed(1)}%`)
  console.log(`   High Performers: ${report.summary.bestPerforming.length}`)
  console.log(`   Need Attention: ${report.summary.needsAttention.length}`)

  // Package details
  console.log('\n📦 Package Coverage:')
  console.log('-'.repeat(80))
  console.log('Package'.padEnd(30) + 'Keys'.padEnd(10) + 'Coverage'.padEnd(12) + 'Trend')
  console.log('-'.repeat(80))

  for (const pkg of report.packages.sort((a, b) => b.trends.coverage - a.trends.coverage)) {
    const trend = pkg.trends.quality === 1 ? '📈' : pkg.trends.quality === 0 ? '➡️' : '📉'
    console.log(
      pkg.name.padEnd(30) +
      pkg.metrics['en'].totalKeys.toString().padEnd(10) +
      `${pkg.trends.coverage.toFixed(1)}%`.padEnd(12) +
      trend
    )
  }

  // Insights
  console.log('\n💡 Insights:')
  for (const insight of report.insights) {
    console.log(`   • ${insight}`)
  }

  // Recommendations
  console.log('\n🎯 Recommendations:')
  for (const rec of report.recommendations) {
    console.log(`   → ${rec}`)
  }

  console.log('\n' + '='.repeat(80))
}

/**
 * Save report to file
 */
function saveReportToFile(report: GlobalReport, format: 'json' | 'md' = 'json'): void {
  const timestamp = new Date().toISOString().split('T')[0]
  const filename = `translation-report-${timestamp}.${format}`

  if (format === 'json') {
    writeFileSync(filename, JSON.stringify(report, null, 2))
  } else {
    const md = `# Translation Report - ${new Date(report.timestamp).toLocaleDateString()}

## Summary
- **Total Packages:** ${report.summary.totalPackages}
- **Total Keys:** ${report.summary.totalKeys.toLocaleString()}
- **Average Coverage:** ${report.summary.averageCoverage.toFixed(1)}%

## High Performers
${report.summary.bestPerforming.map(name => `- ${name}`).join('\n')}

## Need Attention
${report.summary.needsAttention.map(name => `- ${name}`).join('\n')}

## Insights
${report.insights.map(insight => `- ${insight}`).join('\n')}

## Recommendations
${report.recommendations.map(rec => `- ${rec}`).join('\n')}

## Detailed Package Analysis

| Package | Keys | Coverage | Status |
|---------|------|----------|--------|
${report.packages.map(pkg => 
  `| ${pkg.name} | ${pkg.metrics['en'].totalKeys} | ${pkg.trends.coverage.toFixed(1)}% | ${pkg.trends.quality === 1 ? '✅' : pkg.trends.quality === 0 ? '🟡' : '❌'} |`
).join('\n')}
`
    writeFileSync(filename, md)
  }

  console.log(`\n📄 Report saved to: ${filename}`)
}

/**
 * Main execution
 */
function main(): void {
  const args = process.argv.slice(2)
  const options = {
    format: 'table' as 'table' | 'json',
    save: false,
    saveFormat: 'json' as 'json' | 'md'
  }

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--format':
        options.format = (args[++i] as any) || 'table'
        break
      case '--save':
        options.save = true
        options.saveFormat = (args[++i] as any) || 'json'
        break
      case '--help':
        console.log(`
Usage: bun run scripts/translation-report.ts [options]

Options:
  --format <type>     Output format: table, json (default: table)
  --save <format>     Save report to file: json, md (optional)
  --help              Show this help message

Examples:
  bun run i18n:report
  bun run i18n:report --format json
  bun run i18n:report --save md
        `)
        process.exit(0)
    }
  }

  console.log('📊 Generating translation report...')
  
  const report = generateReport()

  if (options.format === 'json') {
    console.log(JSON.stringify(report, null, 2))
  } else {
    formatReportTable(report)
  }

  if (options.save) {
    saveReportToFile(report, options.saveFormat)
  }
}

if (import.meta.main) {
  main()
}