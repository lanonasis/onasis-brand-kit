#!/usr/bin/env node
// scripts/build-css.mjs
// Copies source/design-system/colors_and_type.css to dist/brand.css
// and emits dist/css/brand.css + dist/brand.min.css (alias).
// Minification is a simple whitespace+comment strip (no external deps).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "source/design-system/colors_and_type.css");
const OUT = path.join(ROOT, "dist/brand.css");
const OUT_CSS = path.join(ROOT, "dist/css/brand.css");
const OUT_MIN = path.join(ROOT, "dist/brand.min.css");
const OUT_CSS_MIN = path.join(ROOT, "dist/css/brand.min.css");

function ensureDir(p) { fs.mkdirSync(path.dirname(p), { recursive: true }); }

function minify(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")  // strip comments
    .replace(/\s+/g, " ")
    .replace(/\s*([{};:,>+~])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
}

function main() {
  const css = fs.readFileSync(SRC, "utf8");
  ensureDir(OUT);
  fs.writeFileSync(OUT, css);
  ensureDir(OUT_CSS);
  fs.writeFileSync(OUT_CSS, css);
  const min = minify(css);
  fs.writeFileSync(OUT_MIN, min);
  fs.writeFileSync(OUT_CSS_MIN, min);
  console.log("→ build-css: brand.css + brand.min.css written");
}

main();
