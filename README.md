<<<<<<< HEAD
# Lan Onasis Monorepo

A unified, AI-driven platform powering the financial, lifestyle, and digital infrastructure tools of the Lan Onasis ecosystem.

This is the main monorepo for Lan Onasis projects. It is managed with Turborepo and Bun, and is designed for modular, scalable, and secure development across multiple apps and shared packages.

## Project Structure

```
lan-onasis-monorepo/
├── apps/
│   ├── lanonasis-index/      # Main website/app
│   ├── shared-landing/       # (Landing page)
│   └── [Removed: vortexcore, vortexcore-saas, maple-site - now separate repositories]
├── packages/
│   ├── ai-sdk/               # Shared AI SDK
│   ├── supabase-client/      # Centralized Supabase client (schema-aware)
│   └── ui-kit/               # Shared UI components
├── .github/workflows/        # CI/CD and workflow files
├── turbo.json                # Turborepo pipeline config
├── package.json              # Root workspace config (Turbo + Bun)
└── README.md                 # This file
```

> Note: `vortexcore`, `vortexcore-saas`, and `maple-site` are now external repos and have been removed as submodules.

## Workspace Setup

- All apps live in `apps/`, all shared code in `packages/`.
- Managed with [Turborepo](https://turbo.build/) for fast builds and task orchestration.
- Uses [Bun](https://bun.sh/) for ultra-fast package management, scripting, and runtime execution.
- Each app/package is schema-isolated and uses a centralized Supabase client for secure, auditable access.

> 📢 **Update July 12, 2025**: Repository structure has been reorganized with individual Git repositories for each component. See [REPO-UPDATE.md](./REPO-UPDATE.md) for complete details.

## Git Repository Structure

Each component in the monorepo has its own Git repository, enabling isolated CI/CD workflows while maintaining the monorepo development experience:

```
lan-onasis-monorepo/ (https://github.com/lanonasis/lan-onasis-monorepo.git)
├── apps/
│   ├── lanonasis-index/ (https://github.com/thefixer3x/LanOnasisIndex.git)
│   └── shared-landing/ (https://github.com/lanonasis/shared-landing.git)
│       [Removed: vortexcore, vortexcore-saas, maple-site - now separate repositories]
└── packages/
    ├── ai-sdk/ (https://github.com/lanonasis/ai-sdk.git)
    ├── supabase-client/ (https://github.com/lanonasis/supabase-client.git)
    └── ui-kit/ (https://github.com/lanonasis/ui-kit.git)
```

Commits should be made to the individual component repositories, not to the main monorepo repository.

## Environment Management & Automation

### Automated `.env` Propagation
- Use `sync-envs.sh` in the repo root to propagate `.env.template` to every `apps/*` and `packages/*` as `.env` (if not present).
- To support future imported repos, add their root directories to the `TARGET_DIRS` array in `sync-envs.sh`.
- Run: `./sync-envs.sh`

### Environment Consistency Checks
- Use `check-envs.sh` to verify that all `.env` files in `apps/*` and `packages/*` match the keys in `.env.template`.
- Run: `./check-envs.sh`
- Integrate this script into CI/CD to ensure environment consistency before deploys.

### Secret Syncing from Supabase
- For local dev, use the Supabase CLI to pull secrets:
  ```sh
  supabase secrets pull --env-file .env.local
  ```
- For CI/CD, configure your pipeline to pull secrets from Supabase or your secret manager and inject them at build time.
- Never commit `.env`, `.env.local`, or any secret-laden file (these are gitignored by default).

### Secure Handling & Best Practices
- Only `.env.template` is committed; all real secrets are kept in local `.env`/`.env.local` files.
- Each app/package must have its own `.env` file for full isolation.
- Document required env keys in each shared package’s README for onboarding new projects.
- For new apps/packages or imported repos, run `./sync-envs.sh` after onboarding to ensure they have the right environment setup.
- Run `./check-envs.sh` before every deploy to catch missing or extra envs.

## Getting Started

1. **Install dependencies:**
   ```sh
   bun install
   ```
2. **Run all apps in dev mode:**
   ```sh
   bun run dev
   ```
   (Runs `turbo run dev`, which starts dev servers for all apps that define a `dev` script.)
3. **Build all apps/packages:**
   ```sh
   bun run build
   ```

## Adding a New App or Package

- Place new apps in `apps/`, new shared code in `packages/`.
- Update scripts as needed for Bun compatibility.
- Register new workspaces in the root `package.json` if using custom globs.

## Project Philosophy

- **Schema Isolation:** Each app has its own schema and strict API boundaries.
- **Centralized Auth & Audit:** All access and logs flow through the `control_room` schema.
- **No Cross-Project Shortcuts:** No global functions/triggers bypassing schema boundaries.
- **Observability:** All function calls and errors are logged with project/user context.

## Contributing

- Use Bun for all scripts and dependency management.
- Follow schema, API, and workspace boundaries.
- Document any new apps, packages, or architectural changes in this README.

---

## Roadmap & Repo Notes

- `vortexcore`, `vortexcore-saas`, and `maple-site` have been externalized and are no longer part of this monorepo.
- Future apps like `seftechub`, `askbizgenie`, and `nixie-ai` may be onboarded modularly.
- We recommend shared logic (hooks, components, APIs) be added to `packages/` and consumed via `@lanonasis/*` imports.

## Maintainers

- @seyederick – Product & Architecture Lead
- @lanonasis-dev – Core Infrastructure

For more details, see the `README.md` in each app or package.
=======
# Onasis-CORE

**Privacy-First Infrastructure Services Platform**

Onasis-CORE is a comprehensive privacy-protecting infrastructure platform that provides secure, anonymous bridges between vendors and clients. Built for sub-selling services while maintaining complete privacy for all parties.

## 🏗️ **Architecture Overview**

```
Client → VortexAI Branding → Onasis-CORE → Vendor APIs → Response
   ↑                              ↓
Privacy Protection         Identity Masking
```

## 🔒 **Core Services**

### **API Gateway** (`/api-gateway`)
Privacy-protecting API proxy for sub-selling vendor services
- Vendor identity masking
- Client anonymization  
- Request/response sanitization
- Anonymous billing tracking

### **Data Masking** (`/data-masking`) 
Personal data anonymization and protection services
- PII detection and removal
- Data tokenization
- Secure data vaults

### **Email Proxy** (`/email-proxy`)
Anonymous email routing and filtering
- Email identity masking
- Spam/threat filtering
- Secure message delivery

### **Billing Service** (`/billing-service`)
Anonymous transaction processing and tracking
- Usage-based billing
- Anonymous payment processing
- Revenue sharing automation

### **Webhook Proxy** (`/webhook-proxy`)
Secure webhook routing with privacy protection
- Webhook anonymization
- Payload filtering
- Delivery verification

## 🌐 **Connection Points**

**Client-Facing Domains:**
- `api.vortexai.io` - Main branded API endpoint
- `secure.onasis.io` - Privacy-focused branding
- `gateway.apiendpoint.net` - Neutral connection point

**Internal/Vendor Routing:**
- `proxy.connectionpoint.io` - Vendor API masking
- `bridge.onasis.io` - Internal service communication
- `webhook.vortexai.io` - Callback routing

## 🚀 **Quick Start**

```bash
# Clone the repository
git clone https://github.com/yourusername/Onasis-CORE.git

# Deploy to VPS
./deployment/deploy-all.sh

# Or deploy specific service
./deployment/deploy-api-gateway.sh
./deployment/deploy-email-proxy.sh
```

## 📡 **Supabase Integration**

Connected to **The Fixer Initiative** Supabase project for:
- User authentication and management
- Usage analytics and billing data
- Service configuration and monitoring
- Audit logs and compliance tracking

## 🛡️ **Privacy Guarantees**

- ✅ **Zero-Knowledge Architecture** - We never see actual data
- ✅ **Identity Masking** - Vendors and clients remain anonymous
- ✅ **Request Sanitization** - All PII stripped automatically
- ✅ **Encrypted Transit** - End-to-end encryption for all data
- ✅ **Anonymous Billing** - Track usage without exposing identities
- ✅ **Compliance Ready** - GDPR, CCPA, HIPAA compatible

## 🏢 **Business Model**

**Sub-Selling as a Service:**
1. **API Gateway** - Charge markup on vendor API calls
2. **Data Protection** - Privacy compliance as a service
3. **White Label** - Branded privacy infrastructure for enterprises
4. **Consulting** - Privacy architecture consulting services

## 📊 **Service Status**

| Service | Status | Endpoint | Privacy Level |
|---------|--------|----------|---------------|
| API Gateway | 🟢 Active | `api.vortexai.io` | High |
| Data Masking | 🟡 Development | `data.onasis.io` | Maximum |
| Email Proxy | 🔴 Planned | `mail.onasis.io` | High |
| Billing Service | 🟡 Development | `bill.onasis.io` | Medium |
| Webhook Proxy | 🔴 Planned | `hook.onasis.io` | High |

## 🔧 **Infrastructure**

**VPS Configuration:**
- **Primary VPS:** Hostinger (168.231.74.29)
- **Load Balancer:** Nginx with privacy headers
- **SSL:** Let's Encrypt with automated renewal
- **Monitoring:** Custom privacy-aware logging

**Tech Stack:**
- **Backend:** Node.js with Express
- **Database:** Supabase (The Fixer Initiative)
- **Proxy:** Nginx with custom privacy modules
- **Deployment:** GitHub Actions + Docker
- **Monitoring:** Custom analytics with anonymization

## 📝 **Documentation**

- [API Gateway Documentation](./docs/api-gateway.md)
- [Privacy Policy](./docs/privacy-policy.md)
- [Developer Guide](./docs/developer-guide.md)
- [Deployment Guide](./docs/deployment.md)
- [Business Operations](./docs/business-ops.md)

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-privacy`)
3. Commit changes (`git commit -m 'Add amazing privacy feature'`)
4. Push to branch (`git push origin feature/amazing-privacy`)
5. Create Pull Request

## 📄 **License**

Proprietary - All rights reserved. Contact for licensing opportunities.

## 📞 **Contact**

- **Business Inquiries:** business@onasis.io
- **Technical Support:** support@onasis.io
- **Privacy Officer:** privacy@onasis.io

---

**Onasis-CORE** - *Privacy by Design, Profit by Service*
>>>>>>> backup-onasis-core/security/audit-key-mgmt-20250829-0221
