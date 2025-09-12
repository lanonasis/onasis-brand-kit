# i18n Translation Architecture Analysis

**Date**: September 10, 2025  
**Issue**: MCP schema error and translation architecture investigation  
**Status**: ✅ Analysis Complete

## 🔍 MCP Schema Error Investigation

### **Error Details**
```
Problems loading reference 'vscode://schemas/mcp': Unable to load schema from 'vscode://schemas/mcp': Error (FileSystemError): Unable to read file 'vscode://schemas/mcp' (EntryNotFound).(768)
```

### **Root Cause Analysis** ✅
- **Issue**: VSCode trying to load MCP schema from non-existent `vscode://schemas/mcp` URI
- **Source**: `.vscode/settings.json` contains `"vscode-mcp-server.defaultEnabled": true`
- **Impact**: IDE warning only, does not affect functionality
- **Solution**: MCP schema references are for development tooling, not critical to monorepo operation

## 🌍 Current i18n Translation Architecture State

### **Architecture Type: HYBRID (Centralized + Per-App)** ⚠️

The current setup uses **both** centralized and individual translation approaches:

#### **Centralized Configuration** (`i18n.json`)
```json
{
  "version": 1.8,
  "locale": {
    "source": "en",
    "targets": ["es"]  // Only Spanish configured
  },
  "buckets": {
    "lanonasis-index": "apps/lanonasis-index/locales/[locale].json",
    "shared": "packages/shared/locales/[locale].json",
    "onasis-core": "apps/onasis-core/locales/[locale].json"
    // + 10 more buckets for onasis-core sub-packages
  }
}
```

#### **Individual App Translations** (Per-App)
Each app maintains its own complete translation files:
- `apps/lanonasis-index/locales/` - 11 languages (en + 10 targets)
- `apps/dashboard/locales/` - 11 languages (en + 10 targets)  
- `apps/onasis-core/locales/` - 11 languages (en + 10 targets)
- `apps/lanonasis-maas/dashboard/locales/` - 11 languages
- `separated-repos/api-lanonasis-com/locales/` - 11 languages

## 🚨 Architecture Inconsistencies Found

### **1. Configuration vs Reality Mismatch**
- **i18n.json**: Only targets Spanish (`"targets": ["es"]`)
- **Actual files**: All apps have 10+ languages (ar, de, es, fr, it, ja, ko, pt, ru, zh)

### **2. Missing Apps in Central Config**
Apps with translations NOT in `i18n.json`:
- `apps/dashboard/` ❌
- `apps/lanonasis-maas/` ❌  
- `separated-repos/api-lanonasis-com/` ❌

### **3. Broken Bucket References**
Several buckets reference non-existent paths:
- `packages/onasis-core/packages/privacy-sdk/locales/` ❌
- `packages/onasis-core/services/email-proxy/locales/` ❌
- `packages/onasis-core/apps/control-room/locales/` ❌

## 📊 Translation Coverage Analysis

### **Working Individual Translations** ✅
- `apps/lanonasis-index/`: 12KB English source, 2.7% coverage others
- `apps/dashboard/`: 1.2KB English source, 100% coverage others
- `apps/onasis-core/`: 724B English source, 0% coverage others
- `apps/lanonasis-maas/dashboard/`: 100% coverage
- `separated-repos/api-lanonasis-com/`: 2.7% coverage

### **Central i18n System Status** ⚠️
- Configuration exists but incomplete
- Only Spanish target configured vs 10 languages present
- Missing major apps in bucket configuration
- Broken path references

## 🎯 Recommended Architecture Decision

### **Option 1: Pure Per-App Translations** (Recommended)
**Pros:**
- ✅ Already working for most apps
- ✅ Independent development cycles
- ✅ No monorepo dependency issues
- ✅ Simpler CI/CD per app

**Cons:**
- ❌ Potential translation inconsistency
- ❌ Duplicate translation effort

### **Option 2: Fix Central i18n System**
**Pros:**
- ✅ Consistent translations across apps
- ✅ Shared translation resources
- ✅ Central management

**Cons:**
- ❌ Complex setup and maintenance
- ❌ Monorepo coupling issues
- ❌ Requires significant configuration fixes

## 🔧 Immediate Actions Required

### **If Choosing Per-App (Recommended):**
1. Remove central `i18n.json` configuration
2. Update each app's `package.json` with individual i18n scripts
3. Remove monorepo-level i18n scripts
4. Update documentation to reflect per-app approach

### **If Fixing Central System:**
1. Update `i18n.json` to include all 10 target languages
2. Add missing apps (dashboard, lanonasis-maas, api-lanonasis-com)
3. Fix broken bucket path references
4. Synchronize central config with actual file structure

## 📋 Current Working State

### **Individual Apps Working** ✅
- Each app has complete translation files
- Apps can be developed independently
- No breaking dependencies on central system

### **Central System Broken** ❌
- Incomplete configuration
- Missing apps
- Broken path references
- Only Spanish configured vs 10 languages present

---

**Recommendation**: Adopt **pure per-app translation architecture** and remove central i18n references to eliminate complexity and maintain working individual app translations.
