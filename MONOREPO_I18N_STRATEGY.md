# Monorepo I18n Strategy: App-by-App Approach

## Problem Analysis

You're absolutely correct - **monorepo i18n is problematic** because:

1. **Deployment Independence**: Each app deploys separately
2. **Context Isolation**: Apps have different user-facing content
3. **Translation Drift**: Apps evolve at different rates  
4. **Dependency Hell**: Shared translation creates coupling
5. **Scale Issues**: Large monorepo translation files become unwieldy

## Current State: Lanonasis-Index

### ✅ What's Working:
- i18n infrastructure configured (`i18n.ts`)
- Translation files exist (`locales/en.json`, etc.)
- LanguageSwitcher component implemented
- Lingo.dev configuration ready

### ❌ What's Broken:
- **App.tsx uses hardcoded text** instead of `t()` calls
- **Components don't import useTranslation**
- **Language switcher changes language but no content updates**

## Solution: App-Specific I18n Implementation

### Step 1: Fix Lanonasis-Index (Immediate)

```bash
cd /apps/lanonasis-index

# 1. Extract hardcoded text
./extract-hardcoded-text.sh

# 2. Update components to use translations
# Convert: "Privacy-First Financial Infrastructure" 
# To: {t('hero.title')}

# 3. Generate translations
LINGODOTDEV_API_KEY=xxx npx lingo.dev@latest i18n

# 4. Test language switcher
bun run dev
```

### Step 2: App-by-App Strategy

```
apps/lanonasis-index/     → Landing page translations
apps/lanonasis-maas/     → Dashboard/API translations  
apps/maple-site/         → Appointment booking translations
apps/vortexcore/         → Personal finance translations
apps/vortexcore-saas/    → Business finance translations
```

### Step 3: Per-App Translation Workflow

```bash
# Each app has its own:
apps/[app-name]/
├── i18n.json           # Lingo.dev config
├── locales/            # Translation files
│   ├── en.json
│   ├── es.json
│   └── ...
├── src/i18n.ts         # i18n configuration
└── src/components/
    └── LanguageSwitcher.tsx
```

## Implementation Plan: Lanonasis-Index

### Phase 1: Convert Main App.tsx

```tsx
// Before (hardcoded)
<h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
  Privacy-First Financial Infrastructure
</h1>

// After (translatable) 
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
<h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
  {t('hero.title')}
</h1>
```

### Phase 2: Update Translation Keys

```json
// locales/en.json
{
  "hero": {
    "title": "Privacy-First Financial Infrastructure",
    "subtitle": "Enterprise-grade privacy and security for the modern financial ecosystem",
    "description": "Built for modern enterprises, our infrastructure provides the privacy and security foundation your financial applications need to thrive in a regulated environment.",
    "cta": "Get Started",
    "learnMore": "Learn More"
  },
  "navigation": {
    "home": "Home",
    "products": "Products", 
    "solutions": "Solutions",
    "company": "Company",
    "contact": "Contact"
  },
  "features": {
    "privacy": {
      "title": "Privacy Infrastructure",
      "description": "End-to-end encryption and privacy-preserving technologies"
    },
    "security": {
      "title": "Enterprise Security",
      "description": "Bank-grade security with compliance built-in"
    },
    "integration": {
      "title": "Seamless Integration", 
      "description": "RESTful APIs and SDKs for rapid integration"
    }
  }
}
```

### Phase 3: Generate All Translations

```bash
# Run once per app
cd apps/lanonasis-index
LINGODOTDEV_API_KEY=xxx npx lingo.dev@latest i18n
```

## Benefits of App-Specific Approach

### ✅ **Pros:**
- **Independent deployments** - No cross-app dependencies
- **Focused translations** - Each app's content is contextually relevant  
- **Faster builds** - Smaller translation bundles per app
- **Team autonomy** - Teams can manage their own translations
- **Easier testing** - Test translations per app independently

### ❌ **Cons:**
- **Duplication** - Common terms translated multiple times
- **Inconsistency** - Different apps might translate same terms differently
- **Setup overhead** - Each app needs i18n setup

## Shared vs App-Specific Strategy

### **Shared Components** (Common translations)
```typescript
// packages/shared-i18n/common.json
{
  "common": {
    "buttons": {
      "save": "Save",
      "cancel": "Cancel",
      "submit": "Submit"
    },
    "labels": {
      "email": "Email",
      "password": "Password"  
    }
  }
}
```

### **App-Specific Content** (Unique translations)
```typescript
// apps/lanonasis-index/locales/en.json
{
  "hero": {
    "title": "Privacy-First Financial Infrastructure"
  }
}

// apps/maple-site/locales/en.json  
{
  "booking": {
    "title": "Schedule Your Appointment"
  }
}
```

## Immediate Action Plan

1. **Fix lanonasis-index first** (it's already deployed and visible)
2. **Apply same pattern to other apps** when they need translations
3. **Consider shared translations** only for truly common elements

**The key insight: Each app should own its translation workflow independently, just like it owns its deployment pipeline.**