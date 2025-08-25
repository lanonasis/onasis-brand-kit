# Authentication Consolidation Plan
## Multi-Repository Onasis-Core Integration

**Created:** January 2025  
**Status:** In Progress  
**Priority:** Critical Security Issue Resolution

## Executive Summary

This plan addresses critical authentication inconsistencies across the lan-onasis-monorepo's nested repositories and consolidates all services to use the Onasis-core central authentication system.

## Current State Analysis

### ✅ Properly Integrated Repositories
- **dashboard**: Fully integrated with central auth
- **maple-site**: Properly configured with project scope
- **onasis-core**: Central authentication provider

### ⚠️ Repositories Requiring Integration
- **lanonasis-maas**: Critical placeholder authentication
- **vortexcore**: Independent auth service
- **vortexcore-saas**: Isolated authentication
- **mcp-lanonasis**: Wrong API gateway configuration

## Security Issues Identified

### 🚨 Critical (Immediate Action Required)
1. **lanonasis-maas REST API**: Placeholder authentication allows all requests
2. **Missing Project Scope**: No enforcement of `project_scope=<repository-name>`
3. **API Gateway Misalignment**: Services using different base URLs

### ⚠️ High Priority
1. **Vortex Services**: Completely isolated from central auth
2. **MCP Service**: Using wrong API gateway (`api.vortexai.io`)
3. **URL Inconsistencies**: Different services using different endpoints

## Implementation Plan

### Phase 1: Critical Security Fixes (Immediate)
- [x] Fix placeholder authentication in lanonasis-maas
- [ ] Update URL configurations to central gateway
- [ ] Implement project scope enforcement
- [ ] Add proper JWT validation

### Phase 2: Repository Integration (1-2 days)
- [ ] Integrate Vortex services with central auth
- [ ] Fix MCP service routing
- [ ] Standardize environment configurations
- [ ] Update all client configurations

### Phase 3: Testing & Validation (1 day)
- [ ] Test authentication flows across all services
- [ ] Validate project scope enforcement
- [ ] Verify URL routing consistency
- [ ] Performance testing of central auth

## Technical Implementation

### Standardized Configuration
All repositories will use:
- **API Base URL**: `https://api.lanonasis.com/v1`
- **Auth Gateway**: `https://api.lanonasis.com/v1/auth`
- **Project Scope**: Repository-specific (e.g., `lanonasis-maas`, `vortex`, `maple`)

### Environment Variables Template
```bash
# Central Auth Gateway Configuration
ONASIS_CORE_AUTH_URL=https://api.lanonasis.com/v1/auth
ONASIS_CORE_API_URL=https://api.lanonasis.com/v1
ONASIS_CORE_GATEWAY_URL=https://api.lanonasis.com

# Repository-specific configuration
PROJECT_SCOPE=<repository-name>
SUPABASE_URL=<central-supabase-url>
SUPABASE_SERVICE_KEY=<service-key>

# OAuth Configuration
OAUTH_CLIENT_ID=<repository>_client
OAUTH_REDIRECT_URI=https://<service>.lanonasis.com/auth/callback
```

## Repository-Specific Actions

### lanonasis-maas
- [x] Replace placeholder authentication with Onasis-core JWT validation
- [x] Update CLI API URL to central gateway
- [ ] Fix SDK constants
- [ ] Update IDE extensions configuration

### vortexcore
- [ ] Integrate auth service with Onasis-core
- [ ] Update microservices to use central auth
- [ ] Modify CORS configurations
- [ ] Update Docker configurations

### mcp-lanonasis
- [ ] Change API gateway from `api.vortexai.io` to `api.lanonasis.com`
- [ ] Update routing configuration
- [ ] Fix authentication middleware
- [ ] Update environment configurations

## Risk Mitigation

### Backward Compatibility
- Maintain fallback authentication for transition period
- Gradual rollout with feature flags
- Monitor authentication failures during transition

### Performance Considerations
- Cache JWT validation results
- Implement rate limiting at gateway level
- Monitor central auth system load

## Success Criteria

### Security
- [ ] No placeholder authentication in any service
- [ ] All services enforce project scope claims
- [ ] Centralized audit logging for all auth events

### Consistency
- [ ] All services use same API base URL
- [ ] Unified authentication flow across all interfaces
- [ ] Consistent error handling and messaging

### Performance
- [ ] Authentication latency < 200ms
- [ ] No authentication failures during normal operation
- [ ] Successful load testing with central auth

## Timeline

### Week 1 (Immediate)
- Days 1-2: Critical security fixes
- Days 3-4: Repository integration
- Day 5: Testing and validation

### Week 2 (Optimization)
- Performance optimization
- Documentation updates
- Team training on new auth flow

## Monitoring and Alerting

### Authentication Metrics
- Authentication success/failure rates
- JWT validation latency
- Project scope violations
- API endpoint usage patterns

### Security Alerts
- Multiple failed authentication attempts
- Project scope violation attempts
- Unusual API access patterns
- Service health check failures

---

## Next Steps

1. **Complete lanonasis-maas fixes** (in progress)
2. **Update Vortex services configuration**
3. **Fix MCP service routing**
4. **Comprehensive testing**
5. **Production deployment with monitoring**

This plan ensures all services in the monorepo are properly secured and consistently route through the Onasis-core central authentication system.
