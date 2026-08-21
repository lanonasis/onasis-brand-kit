#!/usr/bin/env node
// scripts/test.mjs
// Integrity gates for @lanonasis/brand-kit v2.1.
//
// Verifies:
//   1. dist/brand.css exists and is non-empty.
//   2. tokens-flat.json contains all required brand token values.
//   3. No forbidden legacy tokens (#FFD700) appear in dist/brand.css.
//   4. dist/assets/ contains canonical assets.
//   5. dist/react/index.mjs and dist/vue/BrandMark.vue exist.
//   6. dist/tailwind-preset.cjs exists.
//   7. dist/brand-manifest.json and dist/assets.manifest.json exist.
//   8. Required package export paths resolve.
//   9. QUARANTINED/BROKEN/WATERMARKED/SUPERSEDED/UNKNOWN assets are NOT shipped.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const PKG = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
const MANIFEST = JSON.parse(fs.readFileSync(path.join(ROOT, "src/manifests/assets.manifest.json"), "utf8"));

let pass = 0, fail = 0;
function ok(name) { console.log(`  ✓ ${name}`); pass++; }
function bad(name, msg) { console.error(`  ✗ ${name}: ${msg}`); fail++; }
function exists(rel) { return fs.existsSync(path.join(DIST, rel)); }

function resolveExport(v) {
  if (typeof v === "string") {
    // Exports point into dist/. Strip leading "./" and "dist/" so the result
    // is relative to DIST (which is dist/ itself).
    return v.replace(/^\.\//, "").replace(/^dist\//, "");
  }
  for (const key of ["import", "require", "default"]) {
    if (v[key] && typeof v[key] === "string") return v[key].replace(/^\.\//, "").replace(/^dist\//, "");
  }
  return null;
}

function check() {
  if (exists("brand.css")) ok("dist/brand.css exists");
  else bad("dist/brand.css", "missing");

  const flat = JSON.parse(fs.readFileSync(path.join(DIST, "json/tokens-flat.json"), "utf8"));
  const checks = {
    "ln-navy #1B365D":            "#1B365D",
    "ln-navy-deep #0D1C2F":       "#0D1C2F",
    "ln-green #00D4AA":           "#00D4AA",
    "ln-gold #C9A24B":            "#C9A24B",
    "ln-amber #FDC451":           "#FDC451",
    "ln-corporate-navy alias":    "var(--ln-navy-deep)",
    "ln-product-accent alias":   "var(--ln-green)",
  };
  for (const [label, value] of Object.entries(checks)) {
    if (Object.values(flat).includes(value)) ok(`token ${label} present`);
    else bad(`token ${label}`, `value ${value} not found in tokens-flat.json`);
  }

  const css = fs.readFileSync(path.join(DIST, "brand.css"), "utf8");
  if (!css.includes("#FFD700") && !css.includes("#ffd700")) ok("no #FFD700 in dist/brand.css");
  else bad("dist/brand.css", "contains forbidden legacy #FFD700 gold");

  if (exists("assets/logos/app-icon.svg")) ok("dist/assets/logos/app-icon.svg present");
  else bad("app-icon.svg", "missing");
  if (exists("assets/logos/brandmark-icon.svg")) ok("dist/assets/logos/brandmark-icon.svg present");
  else bad("brandmark-icon.svg", "missing");

  if (exists("react/index.mjs")) ok("dist/react/index.mjs present");
  else bad("react/index.mjs", "missing");
  if (exists("vue/BrandMark.vue")) ok("dist/vue/BrandMark.vue present");
  else bad("vue/BrandMark.vue", "missing");

  if (exists("tailwind-preset.cjs")) ok("dist/tailwind-preset.cjs present");
  else bad("tailwind-preset.cjs", "missing");

  if (exists("brand-manifest.json")) ok("dist/brand-manifest.json present");
  else bad("brand-manifest.json", "missing");
  if (exists("assets.manifest.json")) ok("dist/assets.manifest.json present");
  else bad("assets.manifest.json", "missing");

  const exports = PKG.exports || {};
  for (const [key, val] of Object.entries(exports)) {
    const resolved = resolveExport(val);
    if (!resolved) continue;
    if (!exists(resolved)) bad(`export ${key}`, `resolves to dist/${resolved} — missing`);
    else ok(`export ${key}`);
  }

  const forbidden = MANIFEST.assets
    .filter(a => ["QUARANTINED","BROKEN","WATERMARKED","SUPERSEDED","UNKNOWN"].includes(a.classification))
    .map(a => a.canonicalPath);
  for (const f of forbidden) {
    let rel = f;
    if (rel.startsWith("source/design-system/assets/")) rel = rel.slice("source/design-system/assets/".length);
    else if (rel.startsWith("source/design-system/")) rel = rel.slice("source/design-system/".length);
    const inDist = path.join(DIST, "assets", rel);
    if (fs.existsSync(inDist)) bad("forbidden shipped", `${f} at dist/assets/${rel}`);
  }
  ok("no QUARANTINED/BROKEN/WATERMARKED/SUPERSEDED/UNKNOWN in dist/");

  console.log(`\n${pass} passed, ${fail} failed`);
  if (fail > 0) process.exit(1);
}

check();
