---
📅 Last Updated: 2025-07-12  
👤 Maintainer: @seyederick  
📁 QA Coverage: `apps/*`, `packages/*`, Supabase schemas
---

# Full-Stack QA & Deployment Checklist

This checklist is designed for internal QA, GitHub Projects, or onboarding docs. Use it to systematically verify the health and integration of all apps and packages in the Lan Onasis ecosystem.

---

## ✅ LIVE DEPLOYMENT STATUS

| App              | Platform | Status   |
|------------------|----------|----------|
| lanonasis-index  | Netlify  | ✅ Live  |
| vortexcore       | Vercel   | ✅ Live  |
| vortexcore-saas  | Netlify  | ✅ Live  |

---

## 🔍 FULL FUNCTIONALITY CHECKLIST

### 🧪 1. Smoke Test Each Live Deployment
- [ ] Visual layout renders correctly on desktop + mobile
- [ ] Navigation and routing behave as expected (menu, back button, 404s)
- [ ] No console or runtime errors on load or interaction
- [ ] Supabase connections/auth function
- [ ] Shared components render correctly
- [ ] API requests succeed (check with DevTools or Supabase logs)
- [ ] Bun-compiled files load as expected (no broken assets)
- [ ] (Optional) Record Loom walkthrough for async review

### 🧪 2. Test Local Integration (Bun + Turbo)
- [ ] Run `bun install` at monorepo root
- [ ] Verify all workspace packages are properly linked (`bun workspaces list`)
- [ ] Run `bun run dev` at root (all apps start)
- [ ] Run `bun run test` at root (if tests are scaffolded)
- [ ] Run `bun run dev` in each app individually:
    - [ ] `cd apps/lanonasis-index && bun run dev`
    - [ ] `cd apps/vortexcore && bun run dev`
- [ ] (Optional) `cd packages/ui-kit && bun test`

### ✅ 3. Verify GitHub Deployments (Optional CI Check)
- [ ] Create dummy PRs to trigger deploy previews
- [ ] Validate preview URLs
- [ ] Check that new branches don’t break live

### 🔗 4. Cross-App/Shared Package Check
- [ ] `@lanonasis/ui-kit` imported in both lanonasis-index and vortexcore
- [ ] Supabase login/auth correctly isolated per schema (e.g., control_room, app_vortexcore)
- [ ] Test fallback/error flows when Supabase fails or is unreachable
- [ ] Environment variables are consistent across Netlify/Vercel

### 🧩 5. Monorepo Alignment (Optional)
- [ ] Shared logic in `vortexcore-saas` extracted to `packages/` if needed
- [ ] Use Git submodules or npm/yarn workspace linking if needed

---

## 🧠 Future Enhancements
- [ ] Add AI Bubble (planned for maple-site) to all apps
- [ ] Add Lighthouse CI for performance monitoring on deploys
- [ ] Set up analytics/logging (PostHog, Vercel Analytics, Supabase logs)
- [ ] Add uptime monitor for each platform (Cronitor, UptimeRobot)
- [ ] Add Vitest or Bun-compatible test suite scaffold to packages/ and apps/
- [ ] Add GitHub Actions CI workflows for all apps (build + deploy triggers)
- [ ] Define `.env.template` files for onboarding consistency

---

For questions or to suggest improvements, contact @seyederick or @lanonasis-dev.
