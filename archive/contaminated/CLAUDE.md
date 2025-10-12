# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Purpose

This repository is a publishable package of reusable brand assets for Lan Onasis.

Core contents:
- 02_FAVICONS/: favicon images
- 03_SOCIAL_MEDIA/: social templates
- 05_DEVELOPER_ASSETS/: developer notes and snippets
- 07_APP_ICONS/: mobile icon assets and guidelines
- dist/brand.css: CSS variables and helper classes

## Commands (Bun + npm)

- Install dependencies:
  - bun install
- Build CSS bundle:
  - bun run build
- Preview published files locally (no publish):
  - npm pack
- Publish (maintainers):
  - npm version patch
  - npm publish --access public

## Development notes

- CSS source is in src/brand.css; build copies it to dist/brand.css.
- Consumers typically import the CSS or copy static assets into their public folder.
- No test or lint setup is present; keep changes minimal and asset-focused.

## Usage examples

- Import CSS directly in HTML:
  <link rel="stylesheet" href="/node_modules/@lanonasis/brand-kit/dist/brand.css">

- Favicon tags:
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

- Helper classes (in dist/brand.css):
  .logo-primary { max-width: 200px; height: auto; }
  .logo-secondary { max-height: 60px; height: 60px; width: auto; }
  .logo-icon { width: 32px; height: 32px; }

## Structure and scope

- Keep this repository strictly focused on brand assets and styles.
- Application code, MCP tooling, API gateway files, tests, and infra configs have been archived under archive/contaminated/.
- Do not reintroduce app/runtime configs here; consumers handle their own build pipelines.
