#!/usr/bin/env bun

/**
 * Translation Validation Script for LanOnasis Monorepo
 * 
 * This script validates translation files for:
 * - Consistency across languages
 * - Placeholder preservation
 * - Missing translations
 * - Quality assurance
 */

import { glob } from 'glob'
import { readFileSync, existsSync } from 'fs'
import { join, basename, dirname } from 'path'

// Types
interface ValidationResult {
  file: string
  errors: ValidationError[]
  warnings: string[]
  coverage: number
}

interface ValidationError {
  key: string
  rule: string
  message: string
  severity: 'error' | 'warning'
}

interface TranslationFile {
  path: string
  locale: string
  app: string
  content: Record<string, any>
}

// Validation Rules
const VALIDATION_RULES = {
  placeholders: {
    name: 'Placeholder Consistency',
    validate: (key: string, value: any, englishValue: any): ValidationError[] => {
      if (typeof value !== 'string' || typeof englishValue !== 'string') return []
      
      const placeholders = value.match(/\{\{[\w]+\}\}/g) || []
      const englishPlaceholders = englishValue.match(/\{\{[\w]+\}\}/g) || []
      
      if (placeholders.length !== englishPlaceholders.length) {
        return [{
          key,
          rule: 'placeholders',
          message: `Expected ${englishPlaceholders.length} placeholders, found ${placeholders.length}`,
          severity: 'error'
        }]
      }
      
      // Check if placeholder names match
      const placeholderNames = placeholders.map(p => p.slice(2, -2)).sort()
      const englishPlaceholderNames = englishPlaceholders.map(p => p.slice(2, -2)).sort()
      
      if (JSON.stringify(placeholderNames) !== JSON.stringify(englishPlaceholderNames)) {
        return [{
          key,
          rule: 'placeholders',
          message: `Placeholder names don't match English version`,
          severity: 'error'
        }]
      }
      
      return []
    }
  },
  
  financialTerms: {
    name: 'Financial Terms Consistency',
    validate: (key: string, value: any): ValidationError[] => {
      if (typeof value !== 'string') return []
      
      const preservedTerms = ['USD', 'EUR', 'GBP', 'JPY', 'API', 'OAuth', 'JWT', 'HTTPS', 'SSL', 'TLS']
      const errors: ValidationError[] = []
      
      preservedTerms.forEach(term => {
        const lowerTerm = term.toLowerCase()
        if (value.includes(lowerTerm) && !value.includes(term)) {
          errors.push({
            key,
            rule: 'financialTerms',
            message: `Term "${term}" should maintain original casing, found "${lowerTerm}"`,
            severity: 'warning'
          })
        }
      })
      
      return errors
    }
  },
  
  emptyValues: {
    name: 'Empty Values',
    validate: (key: string, value: any): ValidationError[] => {
      if (value === '' || value === null || value === undefined) {
        return [{
          key,
          rule: 'emptyValues', 
          message: 'Translation value is empty',
          severity: 'error'
        }]
      }
      return []
    }
  },
  
  htmlTags: {
    name: 'HTML Tags Preservation',
    validate: (key: string, value: any, englishValue: any): ValidationError[] => {
      if (typeof value !== 'string' || typeof englishValue !== 'string') return []
      
      const htmlTags = value.match(/<[^>]+>/g) || []
      const englishHtmlTags = englishValue.match(/<[^>]+>/g) || []
      
      if (htmlTags.length !== englishHtmlTags.length) {
        return [{
          key,
          rule: 'htmlTags',
          message: `HTML tag count mismatch. Expected ${englishHtmlTags.length}, found ${htmlTags.length}`,
          severity: 'error'
        }]
      }
      
      return []
    }
  }
}

// Utility Functions
function getAllTranslationFiles(): TranslationFile[] {
  const files: TranslationFile[] = []
  
  // Get all locale files
  const localeFiles = glob.sync('**/locales/*.json', { 
    ignore: ['**/node_modules/**', '**/dist/**', '**/build/**'] 
  })
  
  for (const filePath of localeFiles) {
    try {
      const content = JSON.parse(readFileSync(filePath, 'utf8'))
      const filename = basename(filePath, '.json')
      const locale = filename
      
      // Determine app name from path
      const pathParts = filePath.split('/')
      let app = 'unknown'
      
      if (pathParts.includes('apps')) {
        const appIndex = pathParts.indexOf('apps')
        app = pathParts[appIndex + 1] || 'unknown'
      } else if (pathParts.includes('packages')) {
        app = 'shared'
      }
      
      files.push({
        path: filePath,
        locale,
        app,
        content
      })
    } catch (error) {
      console.error(`Error reading ${filePath}:`, error)
    }
  }
  
  return files
}

function getEnglishReference(app: string): Record<string, any> | null {
  const files = getAllTranslationFiles()
  const englishFile = files.find(f => f.app === app && f.locale === 'en')
  return englishFile ? englishFile.content : null
}

function validateRecursively(
  obj: Record<string, any>, 
  englishObj: Record<string, any>, 
  prefix: string = ''
): ValidationError[] {
  const errors: ValidationError[] = []
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    const englishValue = englishObj?.[key]
    
    if (typeof value === 'object' && value !== null) {
      // Recursively validate nested objects
      errors.push(...validateRecursively(value, englishValue || {}, fullKey))
    } else {
      // Apply validation rules
      for (const rule of Object.values(VALIDATION_RULES)) {
        errors.push(...rule.validate(fullKey, value, englishValue))
      }
    }
  }
  
  return errors
}

function calculateCoverage(translationObj: Record<string, any>, englishObj: Record<string, any>): number {
  let totalKeys = 0
  let translatedKeys = 0
  
  function countKeys(obj: Record<string, any>, refObj: Record<string, any>) {
    for (const [key, value] of Object.entries(refObj)) {
      if (typeof value === 'object' && value !== null) {
        countKeys(obj[key] || {}, value)
      } else {
        totalKeys++
        if (obj[key] && obj[key] !== '' && obj[key] !== null) {
          translatedKeys++
        }
      }
    }
  }
  
  countKeys(translationObj, englishObj)
  return totalKeys > 0 ? (translatedKeys / totalKeys) * 100 : 0
}

// Main Validation Function
async function validateTranslations(): Promise<ValidationResult[]> {
  const results: ValidationResult[] = []
  const files = getAllTranslationFiles()
  
  // Group files by app
  const appGroups = files.reduce((acc, file) => {
    if (!acc[file.app]) acc[file.app] = []
    acc[file.app].push(file)
    return acc
  }, {} as Record<string, TranslationFile[]>)
  
  for (const [app, appFiles] of Object.entries(appGroups)) {
    const englishFile = appFiles.find(f => f.locale === 'en')
    
    if (!englishFile) {
      console.warn(`⚠️  No English reference file found for app: ${app}`)
      continue
    }
    
    for (const file of appFiles) {
      if (file.locale === 'en') continue // Skip English file
      
      const errors = validateRecursively(file.content, englishFile.content)
      const coverage = calculateCoverage(file.content, englishFile.content)
      
      const warnings: string[] = []
      if (coverage < 95) {
        warnings.push(`Translation coverage is ${coverage.toFixed(1)}% (target: 95%+)`)
      }
      
      results.push({
        file: file.path,
        errors,
        warnings,
        coverage
      })
    }
  }
  
  return results
}

// Report Generation
function generateReport(results: ValidationResult[]) {
  console.log('\n🌍 Translation Validation Report')
  console.log('================================')
  
  let totalErrors = 0
  let totalWarnings = 0
  let totalFiles = results.length
  
  // Summary by app
  const appSummary: Record<string, { files: number, errors: number, warnings: number, avgCoverage: number }> = {}
  
  for (const result of results) {
    const app = result.file.split('/')[1] || 'unknown'
    
    if (!appSummary[app]) {
      appSummary[app] = { files: 0, errors: 0, warnings: 0, avgCoverage: 0 }
    }
    
    appSummary[app].files++
    appSummary[app].errors += result.errors.filter(e => e.severity === 'error').length
    appSummary[app].warnings += result.errors.filter(e => e.severity === 'warning').length + result.warnings.length
    appSummary[app].avgCoverage += result.coverage
    
    totalErrors += result.errors.filter(e => e.severity === 'error').length
    totalWarnings += result.errors.filter(e => e.severity === 'warning').length + result.warnings.length
  }
  
  // Calculate average coverage
  for (const app of Object.keys(appSummary)) {
    appSummary[app].avgCoverage = appSummary[app].avgCoverage / appSummary[app].files
  }
  
  console.log(`\n📊 Summary`)
  console.log(`- Total Files: ${totalFiles}`)
  console.log(`- Total Errors: ${totalErrors}`)
  console.log(`- Total Warnings: ${totalWarnings}`)
  
  console.log(`\n📱 By Application`)
  for (const [app, summary] of Object.entries(appSummary)) {
    const status = summary.errors === 0 ? '✅' : '❌'
    console.log(`${status} ${app}:`)
    console.log(`   Files: ${summary.files}`)
    console.log(`   Errors: ${summary.errors}`)
    console.log(`   Warnings: ${summary.warnings}`)
    console.log(`   Avg Coverage: ${summary.avgCoverage.toFixed(1)}%`)
  }
  
  // Detailed errors
  if (totalErrors > 0) {
    console.log(`\n🚨 Detailed Errors`)
    for (const result of results) {
      const errors = result.errors.filter(e => e.severity === 'error')
      if (errors.length > 0) {
        console.log(`\n📄 ${result.file}`)
        for (const error of errors) {
          console.log(`   ❌ ${error.key}: ${error.message}`)
        }
      }
    }
  }
  
  // Warnings
  if (totalWarnings > 0) {
    console.log(`\n⚠️  Warnings`)
    for (const result of results) {
      const warnings = result.errors.filter(e => e.severity === 'warning')
      if (warnings.length > 0 || result.warnings.length > 0) {
        console.log(`\n📄 ${result.file}`)
        for (const warning of warnings) {
          console.log(`   ⚠️  ${warning.key}: ${warning.message}`)
        }
        for (const warning of result.warnings) {
          console.log(`   ⚠️  ${warning}`)
        }
      }
    }
  }
  
  console.log('\n================================')
  
  if (totalErrors === 0) {
    console.log('🎉 All translations are valid!')
  } else {
    console.log(`❌ Found ${totalErrors} errors that need to be fixed`)
    process.exit(1)
  }
}

// CLI Interface
if (import.meta.main) {
  const args = process.argv.slice(2)
  const shouldFix = args.includes('--fix')
  const verbose = args.includes('--verbose')
  
  if (args.includes('--help')) {
    console.log(`
Translation Validator

Usage:
  bun run scripts/validate-translations.ts [options]

Options:
  --help      Show this help message
  --fix       Attempt to fix simple issues automatically
  --verbose   Show detailed validation information

Examples:
  bun run scripts/validate-translations.ts
  bun run scripts/validate-translations.ts --verbose
  bun run scripts/validate-translations.ts --fix
`)
    process.exit(0)
  }
  
  validateTranslations()
    .then(generateReport)
    .catch(error => {
      console.error('❌ Validation failed:', error)
      process.exit(1)
    })
}