#!/usr/bin/env node
// scripts/build.mjs
// Orchestrator: runs all build steps in order.
//   1. build:css      — copy + minify canonical CSS to dist/
//   2. build:tokens   — CSS → JSON/SCSS/JS
//   3. build:assets   — manifest-gated asset copy + raster generation
//   4. build:react    — copy React components
//   5. build:vue      — copy Vue port
//   6. build:tailwind — emit Tailwind preset
//   7. build:manifest — copy canonical manifests, emit dist/allowlist
//
// Idempotent. Cleans dist/ first.

import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DIST = path.join(ROOT, "dist");

function rmrf(p) { fs.rmSync(p, { recursive: true, force: true }); }
function runNode(script) {
  return new Promise((resolve, reject) => {
    const p = spawn(process.execPath, [path.join(__dirname, script)], { stdio: "inherit" });
    p.on("exit", code => code === 0 ? resolve() : reject(new Error(`${script} exited ${code}`)));
  });
}

async function main() {
  console.log("→ Cleaning dist/");
  rmrf(DIST);
  console.log("→ build:css");
  await runNode("build-css.mjs");
  console.log("→ build:tokens");
  await runNode("build-tokens.mjs");
  console.log("→ build:ico");
  await runNode("build-ico.mjs");
  console.log("→ build:assets");
  await runNode("build-assets.mjs");
  console.log("→ build:react");
  await runNode("build-react.mjs");
  console.log("→ build:vue");
  await runNode("build-vue.mjs");
  console.log("→ build:tailwind");
  await runNode("build-tailwind.mjs");
  console.log("→ build:manifest");
  await runNode("build-manifest.mjs");
  console.log("→ Build complete.");
}

main().catch(e => { console.error(e); process.exit(1); });
