# Workflow Failure Diagnosis & Fix Guide
## Netlify Build Pipeline Troubleshooting

**Date:** January 25, 2025  
**Status:** 🔧 TROUBLESHOOTING  
**Platform:** Netlify (Multiple sites detected)

---

## 🚨 **Identified Issues**

### **Most Likely Causes:**
1. **TypeScript Compilation Errors** - Even though we fixed them locally, Netlify might be using cached or different configurations
2. **Build Dependencies Missing** - Some packages might not be installing correctly
3. **Environment Variables** - Missing required environment variables in Netlify
4. **Build Command Path Issues** - Complex build path in netlify.toml
5. **Node.js Version Mismatch** - Using Node 18 but might need different version

---

## 🔍 **Detected Configuration**

### **Netlify Build Command:**
```bash
bun install && bun run build && cd dashboard && bun install && bun run build
```

### **Potential Issues:**
- **Multiple build steps** can fail at any point
- **Dashboard directory** might not exist or have issues
- **Bun vs Node.js** version conflicts (config specifies Node 18)
- **TypeScript compilation** from our recent fixes

---

## 🛠️ **Step-by-Step Fix Guide**

### **Step 1: Check Netlify Build Logs**
1. Go to your Netlify dashboard
2. Click on the failed deployment
3. View the build logs to see the exact error
4. Look for these common errors:
   - `Command failed with exit code 1`
   - `Module not found`
   - `TypeScript compilation failed`
   - `Permission denied`

### **Step 2: Fix Common Issues**

#### **A. TypeScript Errors** 
If you see TypeScript compilation errors:
```bash
# Run locally to verify our fixes work
cd apps/lanonasis-maas
bun install
bun run build
```

#### **B. Missing Dashboard Directory**
If dashboard build fails:
```bash
# Check if dashboard directory exists and has package.json
ls -la apps/lanonasis-maas/dashboard/
```

#### **C. Environment Variables**
Ensure these are set in Netlify Dashboard → Site Settings → Environment Variables:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `ONASIS_CORE_SUPABASE_URL`
- `ONASIS_CORE_SERVICE_KEY`
- `JWT_SECRET`

### **Step 3: Simplified Build Configuration**

If the current build continues to fail, try this simplified netlify.toml:

```toml
[build]
  command = "bun install && bun run build"
  publish = "dist"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"
  NODE_ENV = "production"
```

---

## 🔧 **Quick Fixes to Try**

### **Fix 1: Update Build Command**
Replace the build command in `apps/lanonasis-maas/netlify.toml`:
```toml
[build]
  # Simplified build command
  command = "bun install && bun run type-check && bun run build"
  publish = "dist"
  functions = "netlify/functions"
```

### **Fix 2: Add Build Checks**
Add this to your package.json scripts:
```json
{
  "scripts": {
    "prebuild": "bun run type-check",
    "build": "tsc && tsc-alias",
    "type-check": "tsc --noEmit"
  }
}
```

### **Fix 3: Environment Variables Check**
Add environment validation to your build:
```toml
[build]
  command = "bun install && bun run validate:env && bun run build"
```

---

## 🎯 **Most Likely Solutions**

### **Solution 1: TypeScript Cache Issue**
The Netlify build might be using cached TypeScript files. Force a clean build:

1. In Netlify Dashboard:
   - Go to Site Settings → Build & Deploy
   - Click "Clear Cache and Deploy Site"

### **Solution 2: Update netlify.toml**
Replace the complex build command with a working one:

```toml
[build]
  command = "bun install && bun run build"
  publish = "dist"
  functions = "netlify/functions"
  
[build.environment]
  NODE_VERSION = "18"
  NODE_ENV = "production"
```

### **Solution 3: Fix Dashboard Build**
If the dashboard part is failing, check if it should be built separately:

```bash
# Check if dashboard has its own build process
cd apps/lanonasis-maas/dashboard
cat package.json | grep -A5 -B5 "scripts"
```

---

## 📊 **Diagnostic Commands**

Run these locally to identify the issue:

```bash
# Test the exact Netlify build command
cd apps/lanonasis-maas
bun install && bun run build && cd dashboard && bun install && bun run build

# Check TypeScript compilation
bun run tsc --noEmit

# Verify environment variables
bun run validate:env
```

---

## 🚨 **Emergency Fix**

If you need the site working immediately:

1. **Simplify netlify.toml:**
```toml
[build]
  command = "echo 'Build skipped for emergency deployment'"
  publish = "dist"
```

2. **Deploy manually:**
```bash
bun run build
# Upload dist folder manually to Netlify
```

---

## 📋 **Checklist for Resolution**

- [ ] Check Netlify build logs for specific error
- [ ] Verify TypeScript compilation works locally
- [ ] Confirm all environment variables are set
- [ ] Test build command locally
- [ ] Clear Netlify build cache
- [ ] Simplify build process if needed
- [ ] Check dashboard directory exists and builds
- [ ] Verify Node.js/Bun version compatibility

---

## 🔗 **Next Steps**

1. **Check the build logs** first - this will tell us the exact error
2. **Share the error message** and I can provide a specific fix
3. **Try the simplified build** if it's a complex build issue
4. **Update environment variables** if missing

**Let me know what error you see in the Netlify build logs and I'll provide the exact fix! 🛠️**
