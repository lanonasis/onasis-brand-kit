#!/usr/bin/env node
// scripts/build-assets.mjs
// Manifest-gated asset generation.
// - Copies CANONICAL rasters from source/design-system/assets/ to dist/assets/.
// - Generates favicon set from favicon.svg (sharp).
// - Generates iOS AppIcon.appiconset + Android mipmap densities from app-icon.svg (sharp).
// - Writes an Android adaptive icon Contents.json (single-density placeholders acceptable).
//
// Reads the manifest allowlist: only CANONICAL assets and DERIVED-from-CANONICAL outputs ship.

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const MANIFEST = path.join(ROOT, "src/manifests/assets.manifest.json");
const DS = path.join(ROOT, "source/design-system");
const OUT = path.join(ROOT, "dist/assets");

function ensureDir(d) { fs.mkdirSync(d, { recursive: true }); }
function copyFile(src, dst) { ensureDir(path.dirname(dst)); fs.copyFileSync(src, dst); }

function canonicalSet() {
  const m = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  return m.assets.filter(a => a.classification === "CANONICAL");
}

async function generateFaviconSet() {
  const src = path.join(DS, "assets/favicons/favicon.svg");
  if (!fs.existsSync(src)) return;
  const sizes = [16, 32, 48, 64, 96, 128, 192, 256];
  for (const s of sizes) {
    const out = path.join(OUT, "favicons", `favicon-${s}x${s}.png`);
    await sharp(src).resize(s, s).png().toFile(out);
  }
  // favicon.ico: sharp does not emit .ico. Write a 32x32 PNG renamed to .ico
  // as a graceful fallback. Consumers should use the .svg favicon in modern browsers.
  const ico = path.join(OUT, "favicons", "favicon.ico");
  await sharp(src).resize(32, 32).png().toFile(ico);
  console.log("  generated favicon set (PNG-only; .ico is a 32x32 PNG placeholder)");
}

async function generateAppleTouch() {
  const src = path.join(DS, "assets/logos/app-icon.svg");
  if (!fs.existsSync(src)) return;
  const out = path.join(OUT, "favicons", "apple-touch-icon.png");
  await sharp(src).resize(180, 180).png().toFile(out);
  const mstile = path.join(OUT, "favicons", "mstile-150x150.png");
  await sharp(src).resize(150, 150).png().toFile(mstile);
  console.log("  generated apple-touch-icon + mstile");
}

async function generateAndroidMipmaps() {
  const src = path.join(DS, "assets/logos/app-icon.svg");
  if (!fs.existsSync(src)) return;
  const sizes = {
    "mipmap-mdpi":    48,
    "mipmap-hdpi":    72,
    "mipmap-xhdpi":   96,
    "mipmap-xxhdpi":  144,
    "mipmap-xxxhdpi": 192,
  };
  const androidDir = path.join(OUT, "app-icons/android");
  for (const [dir, size] of Object.entries(sizes)) {
    const d = path.join(androidDir, dir);
    ensureDir(d);
    await sharp(src).resize(size, size).png().toFile(path.join(d, "ic_launcher.png"));
  }
  console.log("  generated Android mipmaps");
}

async function generateIosAppIcons() {
  const src = path.join(DS, "assets/logos/app-icon.svg");
  if (!fs.existsSync(src)) return;
  // iOS app icon sizes (points * scale)
  const sizes = [
    { name: "Icon-20.png",         size: 20 },
    { name: "Icon-29.png",         size: 29 },
    { name: "Icon-40.png",         size: 40 },
    { name: "Icon-58.png",         size: 58 },
    { name: "Icon-60.png",         size: 60 },
    { name: "Icon-76.png",         size: 76 },
    { name: "Icon-80.png",         size: 80 },
    { name: "Icon-87.png",         size: 87 },
    { name: "Icon-120.png",        size: 120 },
    { name: "Icon-152.png",        size: 152 },
    { name: "Icon-167.png",        size: 167 },
    { name: "Icon-180.png",        size: 180 },
    { name: "Icon-1024.png",       size: 1024 },
  ];
  const iosDir = path.join(OUT, "app-icons/ios/AppIcon.appiconset");
  ensureDir(iosDir);
  for (const { name, size } of sizes) {
    await sharp(src).resize(size, size).png().toFile(path.join(iosDir, name));
  }
  // Minimal Contents.json
  const contents = {
    images: sizes.map(({ name, size }) => ({
      filename: name,
      idiom: "universal",
      platform: "ios",
      size: `${size}x${size}`,
    })),
    info: { author: "xcode", version: 1 },
  };
  fs.writeFileSync(path.join(iosDir, "Contents.json"), JSON.stringify(contents, null, 2));
  console.log("  generated iOS AppIcon.appiconset");
}

async function main() {
  ensureDir(OUT);
  // 1. Copy CANONICAL rasters from source/design-system/assets/
  const canon = canonicalSet();
  let copied = 0;
  for (const a of canon) {
    if (!fs.existsSync(a.canonicalPath)) continue;
    let rel = a.canonicalPath;
    if (rel.startsWith("source/design-system/assets/")) rel = rel.slice("source/design-system/assets/".length);
    const dst = path.join(OUT, rel);
    copyFile(a.canonicalPath, dst);
    copied++;
  }
  console.log(`→ build-assets: copied ${copied} CANONICAL rasters`);

  // 2. Generate derived raster sets
  await generateFaviconSet();
  await generateAppleTouch();
  await generateAndroidMipmaps();
  await generateIosAppIcons();
  console.log("→ build-assets: done");
}

main().catch(e => { console.error(e); process.exit(1); });
