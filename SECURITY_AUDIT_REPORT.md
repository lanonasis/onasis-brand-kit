# Security Audit Report - Hardcoded Secrets

**Date:** August 5, 2025  
**Auditor:** Claude Code Security Scanner  
**Repository:** lan-onasis-monorepo  

## Executive Summary

A comprehensive security scan was performed to identify hardcoded secrets, API keys, and sensitive configuration data across the codebase. Several instances of exposed credentials were found that need immediate remediation.

## Critical Findings

### 1. Exposed Supabase Credentials

**Severity:** HIGH  
**Files Affected:**
- `/apps/maple-site/.env` - Contains exposed Supabase anon key and API key
- `/apps/vortexcore/src/integrations/supabase/client.ts` - Hardcoded Supabase URL and anon key
- `/apps/vortexcore-saas/src/integrations/supabase/client.ts` - Hardcoded Supabase URL and anon key
- Multiple files contain hardcoded Supabase URLs

**Risk:** These credentials could allow unauthorized access to the database and backend services.

### 2. Hardcoded JWT Secrets in Docker Compose

**Severity:** HIGH  
**File:** `/apps/vortexcore/docker-compose.yml`
- Lines 58-59: JWT secrets are hardcoded with placeholder values

**Risk:** Using predictable JWT secrets compromises authentication security.

### 3. API Key Placeholders in Code

**Severity:** MEDIUM  
**Files Affected:**
- `/scripts/setup-project-i18n.ts` - Contains placeholder API keys for OpenAI, Anthropic, and Perplexity
- Multiple example files contain placeholder API keys

**Risk:** While these are placeholders, they could be accidentally committed with real values.

### 4. Environment Files with Sensitive Data

**Severity:** MEDIUM  
**Files:**
- Multiple `.env` files contain sensitive configuration
- Some are tracked in git (should be in .gitignore)

## Remediation Actions Required

### Immediate Actions

1. **Remove all hardcoded Supabase credentials**
   - Move to environment variables
   - Use proper secret management

2. **Update JWT secret configuration**
   - Generate strong, unique secrets
   - Store in secure environment variables

3. **Clean up environment files**
   - Ensure all `.env` files are in `.gitignore`
   - Create `.env.example` files with placeholder values only

### Files to Update

The following files need immediate attention to remove hardcoded secrets:

1. `/apps/vortexcore/src/integrations/supabase/client.ts`
2. `/apps/vortexcore-saas/src/integrations/supabase/client.ts`
3. `/apps/maple-site/.env`
4. `/apps/vortexcore/docker-compose.yml`
5. `/packages/onasis-core/unified-router.js`
6. `/packages/onasis-core/multi-platform-router.js`
7. `/packages/onasis-core/ai-service-router.js`
8. `/packages/onasis-core/apps/control-room/dashboard.js`

## Recommendations

1. **Implement Secret Management**
   - Use environment variables for all secrets
   - Consider using a secret management service (AWS Secrets Manager, HashiCorp Vault)
   - Never commit secrets to version control

2. **Add Pre-commit Hooks**
   - Use tools like `detect-secrets` or `gitleaks`
   - Prevent accidental commits of secrets

3. **Regular Security Audits**
   - Schedule periodic scans for exposed secrets
   - Review and rotate credentials regularly

4. **Developer Training**
   - Educate team on secure coding practices
   - Document proper secret handling procedures

## Next Steps

1. Update all identified files to remove hardcoded secrets
2. Rotate all exposed credentials
3. Implement proper secret management
4. Add security scanning to CI/CD pipeline