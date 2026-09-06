#!/usr/bin/env node
// scripts/build-vue.mjs
// Copies the canonical Vue port of BrandMark into dist/vue/.
// Source: source/design-system/components/BrandMark/BrandMark.vue

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SRC_VUE = path.join(ROOT, "source/design-system/components/BrandMark/BrandMark.vue");
const OUT_DIR = path.join(ROOT, "dist/vue");
const OUT_VUE = path.join(OUT_DIR, "BrandMark.vue");
const OUT_INDEX_MJS = path.join(OUT_DIR, "index.mjs");
const OUT_INDEX_JS = path.join(OUT_DIR, "index.js");
const OUT_INDEX_DTS = path.join(OUT_DIR, "index.d.ts");

function ensureDir(d) { fs.mkdirSync(d, { recursive: true }); }

function main() {
  if (!fs.existsSync(SRC_VUE)) {
    throw new Error(`Vue port missing: ${SRC_VUE}`);
  }
  ensureDir(OUT_DIR);
  fs.copyFileSync(SRC_VUE, OUT_VUE);

  // Hand-authored index files (build-time generated, but content is stable).
  fs.writeFileSync(OUT_INDEX_MJS, `// Auto-generated. Canonical Vue port: source/design-system/components/BrandMark/BrandMark.vue
export { default as BrandMark } from "./BrandMark.vue";
export { default } from "./BrandMark.vue";
`);
  fs.writeFileSync(OUT_INDEX_JS, `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BrandMark = require("./BrandMark.vue");
exports.BrandMark = BrandMark.default || BrandMark;
exports.default = BrandMark.default || BrandMark;
`);
  fs.writeFileSync(OUT_INDEX_DTS, `// Auto-generated.
export { default as BrandMark } from "./BrandMark.vue";
declare const _default: any;
export default _default;
`);
  console.log("→ build-vue: BrandMark.vue + index.* written to dist/vue/");
}

main();
