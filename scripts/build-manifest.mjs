#!/usr/bin/env node
// scripts/build-manifest.mjs
// Reads src/manifests/assets.manifest.json (allowlist) and copies CANONICAL
// raster assets from source/design-system/assets/ into dist/assets/.
// Also copies brand-manifest.json to dist/brand-manifest.json.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const ASSETS_MANIFEST = path.join(ROOT, "src/manifests/assets.manifest.json");
const BRAND_MANIFEST = path.join(ROOT, "src/manifests/brand-manifest.json");
const OUT_DIR = path.join(ROOT, "dist/assets");
const OUT_BRAND = path.join(ROOT, "dist/brand-manifest.json");
const OUT_ASSETS = path.join(ROOT, "dist/assets.manifest.json");

function ensureDir(d) { fs.mkdirSync(d, { recursive: true }); }
function copyFile(src, dst) {
  ensureDir(path.dirname(dst));
  fs.copyFileSync(src, dst);
}

function main() {
  // 1. Copy brand-manifest.json
  copyFile(BRAND_MANIFEST, OUT_BRAND);
  console.log("→ build-manifest: dist/brand-manifest.json");

  // 2. Allowlist-gated copy of CANONICAL assets
  const manifest = JSON.parse(fs.readFileSync(ASSETS_MANIFEST, "utf8"));
  const canonical = manifest.assets.filter(a => a.classification === "CANONICAL");

  let copied = 0;
  for (const a of canonical) {
    if (!fs.existsSync(a.canonicalPath)) {
      console.warn(`  ⚠ missing: ${a.canonicalPath}`);
      continue;
    }
    // Strip source/ prefix and copy into dist/
    let rel = a.canonicalPath;
    if (rel.startsWith("source/design-system/assets/")) {
      rel = rel.slice("source/design-system/assets/".length);
    } else if (rel.startsWith("source/design-system/")) {
      rel = rel.slice("source/design-system/".length);
    }
    const dst = path.join(OUT_DIR, rel);
    copyFile(a.canonicalPath, dst);
    copied++;
  }
  console.log(`→ build-manifest: ${copied} CANONICAL assets copied to dist/assets/`);

  // 3. Copy the assets manifest itself (generated output)
  //    Include only CANONICAL+DERIVED entries in the generated manifest.
  const generated = {
    ...manifest,
    assets: manifest.assets.filter(a => a.classification === "CANONICAL" || a.classification === "DERIVED"),
    note: "Generated copy. Canonical authored version: src/manifests/assets.manifest.json",
    generatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(OUT_ASSETS, JSON.stringify(generated, null, 2));
  console.log("→ build-manifest: dist/assets.manifest.json (CANONICAL-only)");
}

main();
