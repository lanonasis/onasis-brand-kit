import { useState, useEffect, useCallback } from 'react'

// Type for translation keys with dot notation
type TranslationKey = string

// Translation function type
type TranslateFunction = (key: TranslationKey, params?: Record<string, string | number>) => string

// Supported languages
export const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja', 'zh', 'pt', 'ar'] as const
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number]

// Translation context
interface TranslationContextType {
  currentLanguage: SupportedLanguage
  setLanguage: (lang: SupportedLanguage) => void
  t: TranslateFunction
  isLoading: boolean
}

// Default translations cache
const translationsCache: Record<string, Record<string, any>> = {}

// Get nested value from object using dot notation
function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null
  }, obj)
}

// Load translations for a specific language and app
async function loadTranslations(language: SupportedLanguage, appName: string): Promise<Record<string, any>> {
  const cacheKey = `${appName}-${language}`
  
  if (translationsCache[cacheKey]) {
    return translationsCache[cacheKey]
  }

  try {
    // Try to load app-specific translations
    const appTranslations = await import(`../../apps/${appName}/locales/${language}.json`)
    
    // Try to load shared translations
    let sharedTranslations = {}
    try {
      const shared = await import(`../locales/${language}.json`)
      sharedTranslations = shared.default || shared
    } catch {
      // Shared translations not found, continue without them
    }

    // Merge shared and app-specific translations
    const translations = {
      ...sharedTranslations,
      ...appTranslations.default || appTranslations
    }

    translationsCache[cacheKey] = translations
    return translations
  } catch (error) {
    console.warn(`Failed to load translations for ${language} in ${appName}:`, error)
    return {}
  }
}

// Custom hook for translations
export function useTranslation(appName: string): TranslationContextType {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => {
    // Get language from localStorage or browser locale
    const saved = localStorage.getItem('language') as SupportedLanguage
    if (saved && SUPPORTED_LANGUAGES.includes(saved)) {
      return saved
    }
    
    // Fallback to browser locale
    const browserLang = navigator.language.split('-')[0] as SupportedLanguage
    return SUPPORTED_LANGUAGES.includes(browserLang) ? browserLang : 'en'
  })

  const [translations, setTranslations] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)

  // Load translations when language changes
  useEffect(() => {
    let mounted = true

    const loadLanguageTranslations = async () => {
      setIsLoading(true)
      try {
        const newTranslations = await loadTranslations(currentLanguage, appName)
        if (mounted) {
          setTranslations(newTranslations)
        }
      } catch (error) {
        console.error('Failed to load translations:', error)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    loadLanguageTranslations()

    return () => {
      mounted = false
    }
  }, [currentLanguage, appName])

  // Save language to localStorage
  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setCurrentLanguage(lang)
    localStorage.setItem('language', lang)
  }, [])

  // Translation function
  const t = useCallback((key: TranslationKey, params?: Record<string, string | number>): string => {
    let value = getNestedValue(translations, key)

    if (!value) {
      console.warn(`Translation key "${key}" not found for language "${currentLanguage}"`)
      return key // Return the key as fallback
    }

    // Handle string interpolation
    if (params && typeof value === 'string') {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        value = value.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue))
      })
    }

    return value
  }, [translations, currentLanguage])

  return {
    currentLanguage,
    setLanguage,
    t,
    isLoading
  }
}

// Language switcher component helper
export const getLanguageDisplayName = (lang: SupportedLanguage): string => {
  const names: Record<SupportedLanguage, string> = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    ja: '日本語',
    zh: '中文',
    pt: 'Português',
    ar: 'العربية'
  }
  return names[lang]
}

// RTL languages
export const RTL_LANGUAGES: SupportedLanguage[] = ['ar']

export const isRTL = (lang: SupportedLanguage): boolean => {
  return RTL_LANGUAGES.includes(lang)
}