#!/usr/bin/env node
// scripts/build-react.mjs
// Copies source/design-system/components/* React components to dist/react/.
// Wraps them with a generated index.mjs / index.js / index.d.ts.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "source/design-system/components");
const OUT = path.join(ROOT, "dist/react");

function ensureDir(d) { fs.mkdirSync(d, { recursive: true }); }
function copyDir(src, dst) {
  ensureDir(dst);
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name);
    const d = path.join(dst, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else { ensureDir(path.dirname(d)); fs.copyFileSync(s, d); }
  }
}

function main() {
  ensureDir(OUT);
  // Copy all component directories verbatim
  for (const e of fs.readdirSync(SRC, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    copyDir(path.join(SRC, e.name), path.join(OUT, e.name));
  }
  // Write index files
  const indexEsm = `// Auto-generated. Canonical sources in source/design-system/components/.
export { BrandMark } from "./BrandMark/BrandMark.jsx";
export { L0Mark } from "./L0Mark/L0Mark.jsx";
export { Badge } from "./Badge/Badge.jsx";
export { Button } from "./Button/Button.jsx";
export { Card } from "./Card/Card.jsx";
`;
  const indexCjs = indexEsm
    .replace(/^export \{/m, "module.exports = {")
    .replace(/\} from /g, "};\nconst ")
    .replace(/\} from "\.\/(.+?)\.jsx";$/gm, ' = require("./$1.jsx");')
    ;
  // Simpler CJS: re-export via require
  const cjs = `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandMark = require("./BrandMark/BrandMark.jsx").BrandMark;
exports.L0Mark = require("./L0Mark/L0Mark.jsx").L0Mark;
exports.Badge = require("./Badge/Badge.jsx").Badge;
exports.Button = require("./Button/Button.jsx").Button;
exports.Card = require("./Card/Card.jsx").Card;
`;
  const dts = `export { BrandMark } from "./BrandMark/BrandMark.jsx";
export type { BrandMarkProps } from "./BrandMark/BrandMark.jsx";
export { L0Mark } from "./L0Mark/L0Mark.jsx";
export type { L0MarkProps } from "./L0Mark/L0Mark.jsx";
export { Badge } from "./Badge/Badge.jsx";
export type { BadgeProps } from "./Badge/Badge.jsx";
export { Button } from "./Button/Button.jsx";
export type { ButtonProps } from "./Button/Button.jsx";
export { Card } from "./Card/Card.jsx";
export type { CardProps } from "./Card/Card.jsx";
`;
  fs.writeFileSync(path.join(OUT, "index.mjs"), indexEsm);
  fs.writeFileSync(path.join(OUT, "index.js"), cjs);
  fs.writeFileSync(path.join(OUT, "index.d.ts"), dts);
  console.log("→ build-react: components + index written to dist/react/");
}

main();
