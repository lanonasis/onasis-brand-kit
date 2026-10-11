#!/usr/bin/env node
// scripts/build-tokens.mjs
// Reads source/design-system/colors_and_type.css (canonical) and emits:
//   dist/json/tokens.json        (nested, DTCG-style)
//   dist/json/tokens-flat.json   (flat, Tailwind-friendly)
//   dist/scss/_tokens.scss       (SCSS variables)
//   dist/scss/_mixins.scss       (typography recipes)
//   dist/js/index.js             (CJS)
//   dist/js/index.mjs            (ESM)
//   dist/js/index.d.ts           (types)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SRC_CSS = path.join(ROOT, "source/design-system/colors_and_type.css");
const OUT_DIR = path.join(ROOT, "dist");
const JSON_DIR = path.join(OUT_DIR, "json");
const SCSS_DIR = path.join(OUT_DIR, "scss");
const JS_DIR = path.join(OUT_DIR, "js");

function ensureDir(d) { fs.mkdirSync(d, { recursive: true }); }
function parse(css) {
  // Parse --name: value; declarations inside :root { ... }
  const rootMatch = css.match(/:root\s*\{([\s\S]*?)\}/);
  if (!rootMatch) throw new Error("No :root block found");
  const block = rootMatch[1];
  const decls = {};
  const re = /(--[a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = re.exec(block)) !== null) {
    let value = m[2].trim();
    // strip /* comments */
    value = value.replace(/\/\*[\s\S]*?\*\//g, "").trim();
    // strip @kind ... suffix (annotation)
    value = value.replace(/\/\*\s*@kind\s+\w+\s*\*\//g, "").trim();
    decls[m[1]] = value;
  }
  return decls;
}

function classifyTokens(decls) {
  const groups = {
    color: [], spacing: [], radius: [], shadow: [], motion: [],
    font: [], typography: [], breakpoint: [], glow: [], border: [],
    surface: [], text: [], status: [], logo: [],
  };
  for (const [name, value] of Object.entries(decls)) {
    if (name.startsWith("--ln-navy") || name.startsWith("--ln-gold") || name.startsWith("--ln-green") || name.startsWith("--ln-grey") || name === "--ln-white" || name === "--ln-neutral" || name === "--ln-amber" || name.startsWith("--ln-dark")) groups.color.push({ name, value });
    else if (name.startsWith("--sp-")) groups.spacing.push({ name, value });
    else if (name.startsWith("--r-")) groups.radius.push({ name, value });
    else if (name.startsWith("--shadow-")) groups.shadow.push({ name, value });
    else if (name.startsWith("--ease-") || name.startsWith("--dur-")) groups.motion.push({ name, value });
    else if (name.startsWith("--font-")) groups.font.push({ name, value });
    else if (name.startsWith("--fw-") || name.startsWith("--fs-") || name.startsWith("--lh-") || name.startsWith("--tracking-")) groups.typography.push({ name, value });
    else if (name.startsWith("--bp-")) groups.breakpoint.push({ name, value });
    else if (name.startsWith("--glow-")) groups.glow.push({ name, value });
    else if (name.startsWith("--border-")) groups.border.push({ name, value });
    else if (name.startsWith("--bg")) groups.surface.push({ name, value });
    else if (name.startsWith("--fg")) groups.text.push({ name, value });
    else if (name.startsWith("--status-")) groups.status.push({ name, value });
    else if (name.startsWith("--ln-logo-")) groups.logo.push({ name, value });
  }
  return groups;
}

function toNestedJson(groups) {
  // Build a nested structure: { color: { navy: { value: "..." }, ... }, spacing: { sp_1: { value: "..." } } }
  const out = {};
  for (const [groupName, items] of Object.entries(groups)) {
    if (items.length === 0) continue;
    out[groupName] = {};
    for (const { name, value } of items) {
      // Convert --ln-navy-deep -> navy.deep, --sp-1 -> sp.1, --font-brand -> font.brand
      const stripped = name.replace(/^--/, "");
      const parts = stripped.split("-").slice(groupName.length >= 4 ? 1 : 0); // crude
      // Better: split by hyphen, keep as nested
      const key = parts.join("-");
      out[groupName][key] = { value, type: typeOf(groupName, value) };
    }
  }
  return out;
}

function toFlatJson(decls) {
  const out = {};
  for (const [name, value] of Object.entries(decls)) {
    out[name.replace(/^--/, "")] = value;
  }
  return out;
}

function typeOf(groupName, value) {
  if (groupName === "color" || groupName === "surface" || groupName === "text" || groupName === "border" || groupName === "status" || groupName === "glow") return "color";
  if (groupName === "spacing" || groupName === "radius") return "dimension";
  if (groupName === "shadow") return "shadow";
  if (groupName === "motion") return value.includes("cubic") || value.includes("ms") ? "other" : "other";
  if (groupName === "font") return "fontFamily";
  if (groupName === "breakpoint") return "dimension";
  if (groupName === "typography") return "other";
  if (groupName === "logo") return "dimension";
  return "other";
}

function toScss(decls) {
  const lines = ["// Auto-generated from colors_and_type.css. Do not hand-edit.", ""];
  for (const [name, value] of Object.entries(decls)) {
    lines.push(`${name.replace(/^--/, "$")}: ${value};`);
  }
  return lines.join("\n") + "\n";
}

function toMixinsScss() {
  return `// Auto-generated typography recipes.
@mixin ln-display-1 {
  font-family: var(--font-display);
  font-weight: var(--fw-extra);
  font-size: var(--fs-6xl);
  line-height: var(--lh-tight);
  letter-spacing: var(--tracking-tight);
  color: var(--fg-1);
}
@mixin ln-h1 {
  font-family: var(--font-display);
  font-weight: var(--fw-bold);
  font-size: var(--fs-4xl);
  line-height: var(--lh-tight);
  letter-spacing: var(--tracking-tight);
  color: var(--fg-1);
}
@mixin ln-h2 {
  font-family: var(--font-display);
  font-weight: var(--fw-bold);
  font-size: var(--fs-3xl);
  line-height: var(--lh-snug);
  letter-spacing: var(--tracking-snug);
  color: var(--fg-1);
}
@mixin ln-h3 {
  font-family: var(--font-display);
  font-weight: var(--fw-semibold);
  font-size: var(--fs-2xl);
  line-height: var(--lh-snug);
  color: var(--fg-1);
}
@mixin ln-h4 {
  font-family: var(--font-display);
  font-weight: var(--fw-semibold);
  font-size: var(--fs-xl);
  line-height: var(--lh-snug);
  color: var(--fg-1);
}
@mixin ln-body {
  font-family: var(--font-body);
  font-weight: var(--fw-regular);
  font-size: var(--fs-base);
  line-height: var(--lh-relaxed);
  color: var(--fg-2);
}
@mixin ln-body-sm {
  font-family: var(--font-body);
  font-weight: var(--fw-regular);
  font-size: var(--fs-sm);
  line-height: var(--lh-normal);
  color: var(--fg-2);
}
@mixin ln-eyebrow {
  font-family: var(--font-body);
  font-weight: var(--fw-semibold);
  font-size: var(--fs-xs);
  text-transform: uppercase;
  letter-spacing: var(--tracking-eyebrow);
  color: var(--ln-green-500);
}
@mixin ln-code {
  font-family: var(--font-mono);
  font-size: 0.92em;
  background: var(--bg-muted);
  padding: 0.12em 0.36em;
  border-radius: var(--r-xs);
  color: var(--ln-navy-700);
}
`;
}

function toJs(decls) {
  const flat = toFlatJson(decls);
  const jsEntries = Object.entries(flat).map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(",\n");
  return {
    cjs: `// Auto-generated. Do not hand-edit.\n"use strict";\nObject.defineProperty(exports, "__esModule", { value: true });\nconst tokens = {\n${jsEntries}\n};\nexports.default = tokens;\nexports.tokens = tokens;\n`,
    esm: `// Auto-generated. Do not hand-edit.\nconst tokens = {\n${jsEntries}\n};\nexport default tokens;\nexport const all = tokens;\n`,
    dts: `// Auto-generated. Do not hand-edit.\nexport declare const tokens: Readonly<Record<string, string>>;\nexport default tokens;\n`,
  };
}

function main() {
  console.log("→ build-tokens: parsing canonical CSS");
  const css = fs.readFileSync(SRC_CSS, "utf8");
  const decls = parse(css);
  const groups = classifyTokens(decls);

  ensureDir(JSON_DIR);
  ensureDir(SCSS_DIR);
  ensureDir(JS_DIR);

  fs.writeFileSync(path.join(JSON_DIR, "tokens.json"), JSON.stringify(toNestedJson(groups), null, 2));
  fs.writeFileSync(path.join(JSON_DIR, "tokens-flat.json"), JSON.stringify(toFlatJson(decls), null, 2));
  fs.writeFileSync(path.join(SCSS_DIR, "_tokens.scss"), toScss(decls));
  fs.writeFileSync(path.join(SCSS_DIR, "_mixins.scss"), toMixinsScss());
  fs.writeFileSync(path.join(SCSS_DIR, "index.scss"), `@forward "tokens";\n@forward "mixins";\n`);

  const js = toJs(decls);
  fs.writeFileSync(path.join(JS_DIR, "index.js"), js.cjs);
  fs.writeFileSync(path.join(JS_DIR, "index.mjs"), js.esm);
  fs.writeFileSync(path.join(JS_DIR, "index.d.ts"), js.dts);

  console.log(`→ build-tokens: ${Object.keys(decls).length} tokens emitted`);
}

main();
