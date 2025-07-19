# 🌍 LanOnasis Monorepo Internationalization Guide

## Overview

This monorepo uses Lingo.dev CLI for automated translation management across all apps:
- **VortexCore** - Personal Finance App
- **VortexCore SaaS** - Business Finance Platform  
- **Maple Site** - Appointment Scheduling
- **LanOnasis Index** - Corporate Landing Page

## 🚀 Quick Start

### 1. Initial Setup
```bash
# Run the setup script
./setup-i18n.sh

# Add your API key to .env
echo "OPENAI_API_KEY=REDACTED_OPENAI_API_KEY
```

### 2. Basic Commands
```bash
# Preview translations (safe)
bun run i18n:check

# Generate all translations
bun run i18n

# Setup Lingo.dev account (alternative to API keys)
bun run i18n:setup
```

## 📁 Project Structure

```
lan-onasis-monorepo/
├── i18n.json                    # Global i18n configuration
├── packages/shared/locales/     # Shared translations (buttons, forms, etc.)
├── apps/vortexcore/locales/     # VortexCore-specific translations
├── apps/vortexcore-saas/locales/# VortexCore SaaS translations
├── apps/maple-site/locales/     # Maple appointment app translations
└── apps/lanonasis-index/locales/# Corporate site translations
```

## 🎯 How It Works

### Translation Flow
1. **Edit English** (`en.json`) files in any app
2. **Run translations** with `bun run i18n`
3. **Auto-generates** 7 target languages:
   - Spanish (es)
   - French (fr) 
   - German (de)
   - Japanese (ja)
   - Chinese (zh)
   - Portuguese (pt)
   - Arabic (ar)

### Smart Features
- **Delta updates** - Only translates changed content
- **Content filtering** - Skips numbers, dates, code snippets
- **Context awareness** - Maintains brand consistency
- **Placeholder preservation** - Keeps `{{variables}}` intact

## 💻 Using Translations in Your React Apps

### 1. Import the Hook
```tsx
import { useTranslation } from '@lanonasis/shared'

function MyComponent() {
  const { t, currentLanguage, setLanguage } = useTranslation('vortexcore')
  
  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <p>{t('dashboard.welcome', { name: 'John' })}</p>
    </div>
  )
}
```

### 2. Language Switcher Component
```tsx
import { SUPPORTED_LANGUAGES, getLanguageDisplayName } from '@lanonasis/shared'

function LanguageSwitcher() {
  const { currentLanguage, setLanguage } = useTranslation('vortexcore')
  
  return (
    <select value={currentLanguage} onChange={(e) => setLanguage(e.target.value)}>
      {SUPPORTED_LANGUAGES.map(lang => (
        <option key={lang} value={lang}>
          {getLanguageDisplayName(lang)}
        </option>
      ))}
    </select>
  )
}
```

### 3. RTL Support
```tsx
import { isRTL } from '@lanonasis/shared'

function App() {
  const { currentLanguage } = useTranslation('vortexcore')
  
  return (
    <div dir={isRTL(currentLanguage) ? 'rtl' : 'ltr'}>
      {/* Your app content */}
    </div>
  )
}
```

## 📋 Translation Keys Structure

### Shared Keys (`packages/shared/locales/en.json`)
```json
{
  "common": {
    "buttons": { "save": "Save", "cancel": "Cancel" },
    "navigation": { "home": "Home", "settings": "Settings" },
    "status": { "loading": "Loading...", "error": "Error" }
  },
  "financial": {
    "currency": { "usd": "USD", "eur": "EUR" },
    "account_types": { "checking": "Checking Account" }
  }
}
```

### App-Specific Keys
Each app has its own locale file with app-specific translations:
- `apps/vortexcore/locales/en.json` - Personal finance terms
- `apps/vortexcore-saas/locales/en.json` - Business finance terms
- `apps/maple-site/locales/en.json` - Appointment booking terms
- `apps/lanonasis-index/locales/en.json` - Marketing content

## 🔄 CI/CD Integration

### Automatic Translation Updates
The GitHub Action (`.github/workflows/i18n-update.yml`) automatically:
1. **Detects changes** to English locale files
2. **Runs translations** using your API key
3. **Commits updates** to all language files
4. **Posts PR comments** with translation summaries

### Manual Trigger
```bash
# Trigger translations manually in GitHub Actions
gh workflow run i18n-update.yml
```

## 🌍 Scaling Strategy

### Phase 1: Core Markets (Current)
- **Languages**: English, Spanish, French, German
- **Focus**: Major European and North American markets

### Phase 2: Asian Expansion
- **Add**: Japanese, Chinese
- **Focus**: Asian financial markets

### Phase 3: Global Coverage
- **Add**: Portuguese, Arabic
- **Focus**: Latin America and Middle East

### Adding New Languages
```json
// Update i18n.json
{
  "locale": {
    "targets": ["es", "fr", "de", "ja", "zh", "pt", "ar", "hi", "ko"]
  }
}
```

## 💰 Cost Optimization

### Efficient Translation Workflow
- **Delta updates** save 80-95% on translation costs
- **Smart filtering** reduces unnecessary API calls
- **Bulk processing** for volume discounts

### Cost Monitoring
```bash
# Check what will be translated (no cost)
bun run i18n:check

# See token estimates before running
LINGO_DEBUG=true bun run i18n:check
```

## 🔧 Advanced Configuration

### Custom Translation Prompts
Edit `i18n.json` to customize translation behavior:
```json
{
  "prompts": {
    "system": "You are a fintech translator...",
    "context": "This is for financial applications..."
  },
  "ai": {
    "temperature": 0.1,
    "maxTokens": 2000
  }
}
```

### Per-App Configuration
Each app can have custom settings:
```json
{
  "buckets": {
    "vortexcore": {
      "include": ["apps/vortexcore/locales/[locale].json"],
      "prompts": {
        "context": "Personal finance application"
      }
    }
  }
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Missing API Key**
```bash
Error: No API key found
# Solution: Add OPENAI_API_KEY=REDACTED_OPENAI_API_KEY
```

2. **Translation Key Not Found**
```bash
Warning: Translation key "dashboard.title" not found
# Solution: Check key exists in en.json file
```

3. **File Not Found**
```bash
Error: Cannot find locales/en.json
# Solution: Run ./setup-i18n.sh to create missing files
```

### Debug Mode
```bash
# Enable detailed logging
LINGO_DEBUG=true bun run i18n:check
```

## 📊 Monitoring & Analytics

### Translation Coverage
```bash
# Check coverage across all apps
find . -name "*.json" -path "*/locales/*" | grep -v en.json | wc -l
```

### Performance Metrics
- **Delta efficiency**: Only 5-20% of content typically needs retranslation
- **Speed**: Full monorepo translation in under 2 minutes
- **Accuracy**: 95%+ accuracy with context-aware prompts

## 🤝 Contributing

### Adding New Translation Keys
1. Add to appropriate `en.json` file
2. Run `bun run i18n:check` to preview
3. Run `bun run i18n` to generate translations
4. Commit all files together

### Best Practices
- Use descriptive key names: `dashboard.welcome` not `msg1`
- Group related keys: `buttons.save`, `buttons.cancel`
- Keep shared content in `packages/shared/locales/`
- Test with different languages, especially RTL (Arabic)

## 🎯 Success Metrics

### Target Goals
- **15+ languages** within 6 months
- **<2 second** translation updates in CI/CD
- **90%+ user adoption** of localized versions
- **Zero manual translation** effort after setup

Your monorepo is now ready to scale globally! 🌍✨