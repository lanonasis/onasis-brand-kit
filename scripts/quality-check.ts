#!/usr/bin/env bun

/**
 * Translation Quality Checker
 * Advanced quality assurance for translations
 */

import { glob } from 'glob'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

interface QualityIssue {
  type: 'missing_placeholder' | 'extra_placeholder' | 'empty_value' | 'suspicious_length' | 'untranslated' | 'formatting' | 'consistency'
  severity: 'error' | 'warning' | 'info'
  key: string
  language: string
  message: string
  expected?: string
  actual?: string
}

interface PackageQuality {
  package: string
  path: string
  issues: QualityIssue[]
  score: number
  languages: Record<string, number>
}

interface QualityReport {
  overallScore: number
  totalIssues: number
  packages: PackageQuality[]
  issuesByType: Record<string, number>
  summary: {
    errors: number
    warnings: number
    info: number
  }
}

/**
 * Extract placeholders from string
 */
function extractPlaceholders(text: string): string[] {
  const matches = text.match(/\{\{[^}]+\}\}/g) || []
  return matches.map(m => m.replace(/[{}]/g, ''))
}

/**
 * Check if text looks untranslated (too similar to English)
 */
function looksUntranslated(original: string, translated: string, language: string): boolean {
  if (original === translated) return true
  
  // Skip technical terms and short words
  if (original.length < 4 || /^[A-Z_]+$/.test(original)) return false
  
  // Language-specific checks
  const similarity = calculateSimilarity(original.toLowerCase(), translated.toLowerCase())
  
  switch (language) {
    case 'es': case 'fr': case 'pt': case 'it':
      return similarity > 0.8 // Romance languages should be quite different
    case 'de':
      return similarity > 0.85 // German can be more similar
    case 'ja': case 'zh': case 'ar':
      return similarity > 0.95 // These should be completely different scripts
    default:
      return similarity > 0.9
  }
}

/**
 * Calculate string similarity (simple Levenshtein-based)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1
  
  if (longer.length === 0) return 1.0
  
  const distance = levenshteinDistance(longer, shorter)
  return (longer.length - distance) / longer.length
}

/**
 * Calculate Levenshtein distance
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null))
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[j][i] = matrix[j - 1][i - 1]
      } else {
        matrix[j][i] = Math.min(
          matrix[j - 1][i - 1] + 1,
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1
        )
      }
    }
  }
  
  return matrix[str2.length][str1.length]
}

/**
 * Check if translation length is suspicious
 */
function checkSuspiciousLength(original: string, translated: string, language: string): boolean {
  if (original.length < 10) return false // Skip short strings
  
  const ratio = translated.length / original.length
  
  // Language-specific length ratios
  const expectedRatios: Record<string, [number, number]> = {
    'es': [0.8, 1.3],
    'fr': [0.9, 1.4],
    'de': [0.7, 1.5], // German can be much longer
    'ja': [0.4, 1.2], // Japanese is typically shorter
    'zh': [0.3, 1.0], // Chinese is typically much shorter
    'pt': [0.8, 1.3],
    'ar': [0.6, 1.4]
  }
  
  const [min, max] = expectedRatios[language] || [0.5, 2.0]
  return ratio < min || ratio > max
}

/**
 * Get all nested keys and values from object
 */
function getNestedValues(obj: any, prefix = ''): Array<{key: string, value: string}> {
  const results: Array<{key: string, value: string}> = []
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      results.push(...getNestedValues(obj[key], fullKey))
    } else if (typeof obj[key] === 'string') {
      results.push({ key: fullKey, value: obj[key] })
    }
  }
  
  return results
}

/**
 * Load translation file
 */
function loadTranslationFile(filePath: string): any {
  try {
    if (!existsSync(filePath)) return null
    return JSON.parse(readFileSync(filePath, 'utf8'))
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error)
    return null
  }
}

/**
 * Check translation quality for a package
 */
function checkPackageQuality(packagePath: string, packageName: string): PackageQuality | null {
  const localesPath = join(packagePath, 'locales')
  
  if (!existsSync(localesPath)) {
    return null
  }

  const sourceFile = join(localesPath, 'en.json')
  const sourceData = loadTranslationFile(sourceFile)
  
  if (!sourceData) {
    return null
  }

  const sourceValues = getNestedValues(sourceData)
  const issues: QualityIssue[] = []
  const languages = ['es', 'fr', 'de', 'ja', 'zh', 'pt', 'ar']
  const languageScores: Record<string, number> = {}

  for (const language of languages) {
    const targetFile = join(localesPath, `${language}.json`)
    const targetData = loadTranslationFile(targetFile)
    
    if (!targetData) {
      issues.push({
        type: 'missing_placeholder',
        severity: 'error',
        key: 'file',
        language,
        message: `Translation file missing for ${language}`
      })
      languageScores[language] = 0
      continue
    }

    const targetValues = getNestedValues(targetData)
    const targetMap = new Map(targetValues.map(item => [item.key, item.value]))
    
    let languageIssues = 0
    
    for (const { key, value: sourceValue } of sourceValues) {
      const targetValue = targetMap.get(key)
      
      if (!targetValue) {
        issues.push({
          type: 'missing_placeholder',
          severity: 'error',
          key,
          language,
          message: `Missing translation for key: ${key}`,
          expected: sourceValue
        })
        languageIssues++
        continue
      }

      // Check for empty values
      if (targetValue.trim() === '') {
        issues.push({
          type: 'empty_value',
          severity: 'error',
          key,
          language,
          message: 'Translation is empty',
          expected: sourceValue,
          actual: targetValue
        })
        languageIssues++
        continue
      }

      // Check placeholders
      const sourcePlaceholders = extractPlaceholders(sourceValue)
      const targetPlaceholders = extractPlaceholders(targetValue)
      
      for (const placeholder of sourcePlaceholders) {
        if (!targetPlaceholders.includes(placeholder)) {
          issues.push({
            type: 'missing_placeholder',
            severity: 'error',
            key,
            language,
            message: `Missing placeholder: {{${placeholder}}}`,
            expected: sourcePlaceholders.join(', '),
            actual: targetPlaceholders.join(', ')
          })
          languageIssues++
        }
      }

      for (const placeholder of targetPlaceholders) {
        if (!sourcePlaceholders.includes(placeholder)) {
          issues.push({
            type: 'extra_placeholder',
            severity: 'warning',
            key,
            language,
            message: `Extra placeholder: {{${placeholder}}}`,
            expected: sourcePlaceholders.join(', '),
            actual: targetPlaceholders.join(', ')
          })
          languageIssues++
        }
      }

      // Check if looks untranslated
      if (looksUntranslated(sourceValue, targetValue, language)) {
        issues.push({
          type: 'untranslated',
          severity: 'warning',
          key,
          language,
          message: 'Text appears to be untranslated',
          expected: `Translated ${language} text`,
          actual: targetValue
        })
        languageIssues++
      }

      // Check suspicious length
      if (checkSuspiciousLength(sourceValue, targetValue, language)) {
        issues.push({
          type: 'suspicious_length',
          severity: 'info',
          key,
          language,
          message: 'Translation length seems unusual',
          expected: `${sourceValue.length} chars`,
          actual: `${targetValue.length} chars`
        })
      }

      // Check basic formatting consistency
      const sourceHasHtml = /<[^>]+>/.test(sourceValue)
      const targetHasHtml = /<[^>]+>/.test(targetValue)
      
      if (sourceHasHtml !== targetHasHtml) {
        issues.push({
          type: 'formatting',
          severity: 'warning',
          key,
          language,
          message: 'HTML formatting inconsistency',
          expected: sourceHasHtml ? 'Contains HTML' : 'No HTML',
          actual: targetHasHtml ? 'Contains HTML' : 'No HTML'
        })
        languageIssues++
      }
    }

    // Calculate language score
    const totalKeys = sourceValues.length
    languageScores[language] = totalKeys > 0 ? Math.max(0, (totalKeys - languageIssues) / totalKeys * 100) : 0
  }

  // Calculate overall package score
  const avgScore = Object.values(languageScores).reduce((sum, score) => sum + score, 0) / languages.length

  return {
    package: packageName,
    path: packagePath,
    issues,
    score: avgScore,
    languages: languageScores
  }
}

/**
 * Generate quality report
 */
function generateQualityReport(): QualityReport {
  const packages: PackageQuality[] = []

  // Analyze all packages
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
    const quality = checkPackageQuality(path, name)
    if (quality) packages.push(quality)
  }

  const allIssues = packages.flatMap(pkg => pkg.issues)
  const overallScore = packages.length > 0 
    ? packages.reduce((sum, pkg) => sum + pkg.score, 0) / packages.length 
    : 0

  const issuesByType: Record<string, number> = {}
  const summary = { errors: 0, warnings: 0, info: 0 }

  for (const issue of allIssues) {
    issuesByType[issue.type] = (issuesByType[issue.type] || 0) + 1
    summary[issue.severity === 'error' ? 'errors' : issue.severity === 'warning' ? 'warnings' : 'info']++
  }

  return {
    overallScore,
    totalIssues: allIssues.length,
    packages,
    issuesByType,
    summary
  }
}

/**
 * Format quality report
 */
function formatQualityReport(report: QualityReport, verbose = false): void {
  console.log('\n🔍 Translation Quality Report\n')
  console.log('=' .repeat(80))
  
  console.log(`🎯 Overall Quality Score: ${report.overallScore.toFixed(1)}%`)
  console.log(`📊 Total Issues: ${report.totalIssues}`)
  console.log(`❌ Errors: ${report.summary.errors}`)
  console.log(`⚠️  Warnings: ${report.summary.warnings}`)
  console.log(`ℹ️  Info: ${report.summary.info}`)
  
  console.log('\n📋 Issues by Type:')
  console.log('-'.repeat(40))
  for (const [type, count] of Object.entries(report.issuesByType)) {
    console.log(`${type.replace(/_/g, ' ')}: ${count}`)
  }

  console.log('\n📦 Package Quality Scores:')
  console.log('-'.repeat(80))
  console.log('Package'.padEnd(30) + 'Score'.padEnd(10) + 'Issues'.padEnd(10) + 'Status')
  console.log('-'.repeat(80))

  for (const pkg of report.packages.sort((a, b) => b.score - a.score)) {
    const status = pkg.score >= 95 ? '✅ Excellent' : 
                   pkg.score >= 80 ? '🟡 Good' : 
                   pkg.score >= 60 ? '🟠 Fair' : '❌ Poor'
    
    console.log(
      pkg.package.padEnd(30) + 
      `${pkg.score.toFixed(1)}%`.padEnd(10) + 
      pkg.issues.length.toString().padEnd(10) + 
      status
    )
  }

  if (verbose && report.packages.length > 0) {
    const worstPackage = report.packages.reduce((worst, pkg) => 
      pkg.score < worst.score ? pkg : worst
    )

    if (worstPackage.issues.length > 0) {
      console.log(`\n🔍 Issues in ${worstPackage.package}:`)
      console.log('-'.repeat(80))
      
      for (const issue of worstPackage.issues.slice(0, 10)) {
        const severity = issue.severity === 'error' ? '❌' : 
                        issue.severity === 'warning' ? '⚠️' : 'ℹ️'
        console.log(`${severity} [${issue.language}] ${issue.key}: ${issue.message}`)
        if (issue.expected) console.log(`    Expected: ${issue.expected}`)
        if (issue.actual) console.log(`    Actual: ${issue.actual}`)
      }

      if (worstPackage.issues.length > 10) {
        console.log(`    ... and ${worstPackage.issues.length - 10} more issues`)
      }
    }
  }

  console.log('\n' + '='.repeat(80))
}

/**
 * Main execution
 */
function main(): void {
  const args = process.argv.slice(2)
  const options = {
    verbose: false,
    format: 'table' as 'table' | 'json',
    failThreshold: 80
  }

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--verbose':
        options.verbose = true
        break
      case '--format':
        options.format = (args[++i] as any) || 'table'
        break
      case '--fail-under':
        options.failThreshold = parseInt(args[++i]) || 80
        break
      case '--help':
        console.log(`
Usage: bun run scripts/quality-check.ts [options]

Options:
  --verbose           Show detailed issue breakdown
  --format <type>     Output format: table, json (default: table)
  --fail-under <num>  Fail if quality score is below threshold (default: 80)
  --help              Show this help message

Examples:
  bun run i18n:quality
  bun run i18n:quality --verbose
  bun run i18n:quality --fail-under 90
        `)
        process.exit(0)
    }
  }

  console.log('🔍 Analyzing translation quality...')
  
  const report = generateQualityReport()

  if (options.format === 'json') {
    console.log(JSON.stringify(report, null, 2))
  } else {
    formatQualityReport(report, options.verbose)
  }

  // Exit with error if quality is below threshold
  if (report.overallScore < options.failThreshold) {
    console.error(`\n❌ Quality score ${report.overallScore.toFixed(1)}% is below required ${options.failThreshold}%`)
    process.exit(1)
  }

  // Only warn about errors if quality threshold is met
  if (report.summary.errors > 0) {
    console.warn(`\n⚠️  Found ${report.summary.errors} translation errors (quality score: ${report.overallScore.toFixed(1)}%)`)
  }

  console.log('\n✅ Quality check passed!')
}

if (import.meta.main) {
  main()
}