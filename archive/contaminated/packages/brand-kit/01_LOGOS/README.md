# Lan Onasis Logos

⚠️ **IMPORTANT: SVG Extraction Required** - See `TODO-EXTRACT-LOGOS.md` for instructions.

## Logo Types
- Primary Logo: Full emblem and wordmark for formal contexts (print, presentations). Minimum width ~2in.
- Secondary Logo: Simplified horizontal version for headers, nav, and general digital use.
- Icon/Symbol: Square mark for favicons, app icons, and avatars.
- Monogram: Ultra-minimal letterform for tight spaces and patterns.

## Current Status
### Available Now (PNG)
- primary-logo.png, secondary-logo.png, icon-version.png (ready to use)
- monogram.png (currently empty - needs creation)

### Needs Extraction (SVG)
- primary-logo.svg - Must be extracted from source/design-boards/brand-redesign-master.svg
- icon-only.svg - Extract icon portion only
- wordmark-only.svg - Extract text portion only
- Additional variants needed (see TODO file)

Usage Tips
- Use SVG on the web whenever possible for crisp scaling.
- Keep sufficient clear space around all marks (≥ height of the “L”).
- Prefer brand colors: Navy #1B365D, Green #00D4AA, Gold #FFD700 (primary only).

Code Snippet (HTML)
<img src="/assets/logos/secondary.svg" alt="Lan Onasis" class="logo-secondary" />

Code Snippet (CSS)
:root {
  --ln-navy: #1B365D; --ln-green: #00D4AA; --ln-gold: #FFD700;
}
.logo-secondary { max-height: 60px; height: 60px; width: auto; }

