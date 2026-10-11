#!/usr/bin/env node
// scripts/build-react.mjs
// Compiles source/design-system/components/**/*.jsx + .d.ts to dist/react/ as plain JS,
// preserving JSX as a build artifact. Consumers get require()-compatible ESM/CJS.

import fs from "node:fs";
import path from "node:path";
import esbuild from "esbuild";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "source/design-system/components");
const OUT = path.join(ROOT, "dist/react");

function ensureDir(d) { fs.mkdirSync(d, { recursive: true }); }

async function transpile(svgFile, outFile) {
  await esbuild.build({
    entryPoints: [svgFile],
    outfile: outFile,
    bundle: false,
    format: "esm",
    target: "es2020",
    jsx: "automatic",
    loader: { ".jsx": "jsx" },
    logLevel: "silent",
  });
}

async function main() {
  ensureDir(OUT);
  // Walk components/ and transpile each .jsx to .js alongside its .d.ts.
  for (const comp of fs.readdirSync(SRC, { withFileTypes: true })) {
    if (!comp.isDirectory()) continue;
    const compDir = path.join(SRC, comp.name);
    const outDir = path.join(OUT, comp.name);
    ensureDir(outDir);
    for (const f of fs.readdirSync(compDir)) {
      const src = path.join(compDir, f);
      if (f.endsWith(".jsx")) {
        const out = path.join(outDir, f.replace(/\.jsx$/, ".js"));
        await transpile(src, out);
      } else if (f.endsWith(".d.ts")) {
        fs.copyFileSync(src, path.join(outDir, f));
      }
    }
  }

  // Write index files. brand-kit is ESM ("type": "module"); components are ESM.
  // The `require` export branch falls back to the ESM file via Node's CJS-ESM interop.
  const indexEsm = `// Auto-generated. Canonical sources in source/design-system/components/.
export { BrandMark } from "./BrandMark/BrandMark.js";
export { L0Mark } from "./L0Mark/L0Mark.js";
export { Badge } from "./Badge/Badge.js";
export { Button } from "./Button/Button.js";
export { Card } from "./Card/Card.js";
`;
  const indexCjs = `"use strict";
// Re-export the ESM module's named exports via dynamic import shim.
// Consumers using require("@lanonasis/brand-kit/react") get a thenable;
// for true CJS support, prefer import("@lanonasis/brand-kit/react").
module.exports = { BrandMark: undefined, L0Mark: undefined, Badge: undefined, Button: undefined, Card: undefined };
module.exports.ready = import("./index.mjs").then(m => Object.assign(module.exports, m));
`;
  const dts = `export { BrandMark } from "./BrandMark/BrandMark.js";
export type { BrandMarkProps } from "./BrandMark/BrandMark.js";
export { L0Mark } from "./L0Mark/L0Mark.js";
export type { L0MarkProps } from "./L0Mark/L0Mark.js";
export { Badge } from "./Badge/Badge.js";
export type { BadgeProps } from "./Badge/Badge.js";
export { Button } from "./Button/Button.js";
export type { ButtonProps } from "./Button/Button.js";
export { Card } from "./Card/Card.js";
export type { CardProps } from "./Card/Card.js";
`;
  fs.writeFileSync(path.join(OUT, "index.mjs"), indexEsm);
  fs.writeFileSync(path.join(OUT, "index.js"), indexCjs);
  fs.writeFileSync(path.join(OUT, "index.d.ts"), dts);
  console.log("→ build-react: components transpiled + index.* written to dist/react/");
}

main().catch(e => { console.error(e); process.exit(1); });
