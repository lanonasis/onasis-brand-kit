# Repository Fragments Audit & Cleanup Plan
**Date**: September 6, 2025 06:54:40 WAT  
**Status**: CRITICAL - Multiple repository fragments causing deployment confusion  
**Priority**: HIGH - Immediate cleanup required before production deployments  

## 🔍 AUDIT FINDINGS

### **Current Live Status:**
- ✅ **dashboard.lanonasis.com** → `lan-onasis-monorepo/apps/dashboard` (React app)
- ✅ **api.lanonasis.com** → `lan-onasis-monorepo/apps/onasis-core/index.html` (Terminal status)
- ❌ **docs.lanonasis.com** → 404 (not deployed)

### **Fragment Locations Discovered:**

#### **Dashboard Fragments (3 locations):**
1. `/lanonasis-maas/dashboard/` ← **Original source** (36 files, older version)
2. `/lan-onasis-monorepo/apps/dashboard/` ← **LIVE VERSION** ✅ (39 files, current)
3. `/lan-onasis-monorepo/apps/lanonasis-maas/dashboard/` ← **Copy/submodule** (31 files)

#### **API Fragments (4+ locations):**
1. `/lanonasis-maas/api/functions/` ← **Netlify functions** (9 files)
2. `/lan-onasis-monorepo/apps/onasis-core/` ← **LIVE API Gateway** ✅ (central auth)
3. `/lan-onasis-monorepo/apps/lanonasis-maas/api/` ← **Copy** (3 files)
4. `/api-lanonasis-fresh/` ← **Full MaaS API Server** (88 files, complete backend)

#### **Company Landing Page:**
5. `/lan-onasis-monorepo/separated-repos/api-lanonasis-com/` ← **Company website** (35 files)
   - **Name**: `"lanonasis-index"`
   - **Purpose**: African fintech company landing page
   - **Target Domain**: Should be on `lanonasis.com` (NOT api.lanonasis.com)

### **Backend/Core Services:**
- `/lan-onasis-monorepo/apps/onasis-core/` ← **Central shared services** ✅
  - Vendor management, authentication, billing
  - Supabase integration, API key management
  - Auth hooks deployed to central project

## 🎯 ROOT CAUSE ANALYSIS

### **The Confusion:**
1. **Domain Misassignment**: Company landing page (`lanonasis-index`) placed in `api-lanonasis-com` folder
2. **Multiple Dashboard Versions**: 3 different dashboard codebases with varying features
3. **API Fragment Scatter**: Core API logic spread across 4+ locations
4. **MaaS vs Company**: Mixed business website content with technical API documentation

### **Current Wrong Assignments:**
- `api.lanonasis.com` → Shows terminal (should show MaaS landing)
- Company content → In `api-lanonasis-com` folder (should be on `lanonasis.com`)
- Dashboard MaaS landing → At `/landing` route (should be main `api.lanonasis.com`)

## 📋 DEVOPS TODO LIST - CLEANUP EXECUTION PLAN

### **PHASE 1: IMMEDIATE STABILIZATION** ⚡
**Priority**: CRITICAL | **Timeline**: 1-2 hours

- [ ] **1.1 Backup Current Live State**
  - Create snapshot of `dashboard.lanonasis.com` (working version)  
  - Archive current `api.lanonasis.com` terminal page
  - Document current OAuth callback configurations

- [ ] **1.2 Identify Source of Truth**
  - ✅ **Dashboard**: `/lan-onasis-monorepo/apps/dashboard/` (CONFIRMED LIVE)
  - ✅ **API Backend**: `/api-lanonasis-fresh/` (Full MaaS API server)
  - ✅ **Central Auth**: `/lan-onasis-monorepo/apps/onasis-core/` (Working auth system)

### **PHASE 2: CONTENT SEPARATION** 🔀
**Priority**: HIGH | **Timeline**: 2-3 hours

- [ ] **2.1 Move Company Landing Page**
  - Source: `/lan-onasis-monorepo/separated-repos/api-lanonasis-com/`
  - Target: New repository for `lanonasis.com` deployment
  - Update all references from `api.lanonasis.com` to `lanonasis.com`

- [ ] **2.2 Extract MaaS Landing Page**
  - Source: `/lan-onasis-monorepo/apps/dashboard/src/pages/Index.tsx`
  - Extract MaaS-specific landing content
  - Create standalone HTML version for `api.lanonasis.com`

- [ ] **2.3 Update Domain Assignments**
  ```
  lanonasis.com         → Company/business website (separated-repos content)
  api.lanonasis.com     → MaaS product landing + auth forms  
  dashboard.lanonasis.com → Post-login dashboard interface
  docs.lanonasis.com    → Technical documentation (fix 404)
  ```

### **PHASE 3: FRAGMENT CONSOLIDATION** 📦
**Priority**: MEDIUM | **Timeline**: 3-4 hours

- [ ] **3.1 Archive Duplicate Dashboard Versions**
  - Keep: `/lan-onasis-monorepo/apps/dashboard/` (live version)
  - Archive: `/lanonasis-maas/dashboard/` → `/archive/dashboard-v1/`
  - Archive: `/lan-onasis-monorepo/apps/lanonasis-maas/dashboard/` → submodule cleanup

- [ ] **3.2 Consolidate API Backend Services**
  - Primary: `/api-lanonasis-fresh/` (complete MaaS API)
  - Secondary: `/lan-onasis-monorepo/apps/onasis-core/` (auth/billing hub)
  - Archive: `/lanonasis-maas/api/` and `/lan-onasis-monorepo/apps/lanonasis-maas/api/`

- [ ] **3.3 Clean Up Submodule References**
  - Update `.gitmodules` to remove broken references
  - Clean up duplicate MaaS project embedding

### **PHASE 4: DEPLOYMENT OPTIMIZATION** 🚀
**Priority**: MEDIUM | **Timeline**: 2-3 hours

- [ ] **4.1 Update Deployment Configurations**
  - **Dashboard**: Netlify config for `dashboard.lanonasis.com`
  - **API Landing**: Deploy config for `api.lanonasis.com`  
  - **Company Site**: New deployment for `lanonasis.com`
  - **Backend**: Production config for MaaS API server

- [ ] **4.2 Update OAuth & Auth Configurations**
  - Update Supabase redirect URLs for new domain assignments
  - Test auth hook routing with new structure
  - Update vortexcore auth integration

- [ ] **4.3 DNS & CDN Updates**
  - Configure `lanonasis.com` DNS
  - Update `api.lanonasis.com` content delivery
  - Fix `docs.lanonasis.com` 404 issue

### **PHASE 5: VERIFICATION & TESTING** ✅
**Priority**: HIGH | **Timeline**: 1-2 hours

- [ ] **5.1 End-to-End Testing**
  - Test complete OAuth flow across all domains
  - Verify MaaS API functionality
  - Test vortexcore integration
  - Validate all domain redirects

- [ ] **5.2 Performance Verification**
  - Load testing on new domain assignments
  - CDN cache validation
  - Mobile responsiveness check

- [ ] **5.3 Documentation Updates**
  - Update all internal documentation
  - Create deployment guide
  - Document new domain architecture

## 🔧 RECOMMENDED DEPLOYMENT STRATEGY

### **Immediate Action (Next 30 minutes):**
1. **Confirm**: `/lan-onasis-monorepo/apps/dashboard/` is indeed the live dashboard version
2. **Verify**: The screenshot provided shows the MaaS landing (Memory-as-a-Service platform)
3. **Locate**: Find exact file containing the screenshot content

### **Source of Truth Designation:**
- ✅ **Dashboard/MaaS App**: `/lan-onasis-monorepo/apps/dashboard/` (CONFIRMED)
- ✅ **Company Website**: `/lan-onasis-monorepo/separated-repos/api-lanonasis-com/`
- ✅ **API Backend**: `/api-lanonasis-fresh/`
- ✅ **Auth Hub**: `/lan-onasis-monorepo/apps/onasis-core/`

### **Clean Architecture Target:**
```
┌─ lanonasis.com (Company Site)
├─ api.lanonasis.com (MaaS Landing + Auth)
├─ dashboard.lanonasis.com (Post-Login Interface)
├─ docs.lanonasis.com (Technical Docs)
└─ onasis-core (Backend Services Hub)
```

## 📞 NEXT STEPS

**The screenshot you provided appears to be the MaaS landing page with "Professional Memory as a Service (MaaS) platform with self-service API key management" - this content is likely in:**

1. `/lan-onasis-monorepo/apps/dashboard/src/pages/Index.tsx` (React component)
2. Or compiled in `/lan-onasis-monorepo/apps/dashboard/dist/index.html`

**Answer to your question**: YES, deploy the **monorepo version** (`/lan-onasis-monorepo/apps/dashboard/`) as it's the current live and most updated version.

---
**Created by**: DevOps Audit Process  
**Next Review**: After Phase 1 completion  
**Stakeholders**: @seyederick @claude-code