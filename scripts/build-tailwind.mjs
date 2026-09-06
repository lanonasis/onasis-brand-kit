#!/usr/bin/env node
// scripts/build-tailwind.mjs
// Generates dist/tailwind-preset.cjs using the canonical token CSS variables.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "dist/tailwind-preset.cjs");

const preset = `/**
 * LAN Onasis brand tokens for Tailwind 3 consumers.
 * Canonical source: source/design-system/colors_and_type.css
 * The CSS variables in dist/brand.css remain the source of truth;
 * this preset maps utilities to those variables instead of duplicating hex values.
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        ln: {
          navy:          'var(--ln-navy)',
          'navy-deep':   'var(--ln-navy-deep)',
          green:         'var(--ln-green)',
          gold:          'var(--ln-gold)',
          amber:         'var(--ln-amber)',
          surface:       'var(--bg)',
          subtle:        'var(--bg-subtle)',
          muted:         'var(--bg-muted)',
          'inverse':     'var(--bg-inverse)',
          elevated:      'var(--bg-elevated)',
          text:          'var(--fg-1)',
          'text-2':      'var(--fg-2)',
          'text-3':      'var(--fg-3)',
          'text-4':      'var(--fg-4)',
          'on-navy':     'var(--fg-on-navy)',
          'on-green':    'var(--fg-on-green)',
          link:          'var(--fg-link)',
          'corporate-navy':  'var(--ln-corporate-navy)',
          'product-navy':    'var(--ln-product-navy)',
          'corporate-gold':  'var(--ln-corporate-gold)',
          'marketing-amber': 'var(--ln-marketing-amber)',
          'product-accent':  'var(--ln-product-accent)',
          'dark-surface':      'var(--ln-dark-surface)',
          'dark-elevated':     'var(--ln-dark-elevated)',
          'dark-text':         'var(--ln-dark-text)',
          'dark-text-muted':   'var(--ln-dark-text-muted)',
          'dark-border':       'var(--ln-dark-border)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body:    ['var(--font-body)'],
        mono:    ['var(--font-mono)'],
        brand:   ['var(--font-brand)'],
      },
      fontSize: {
        xs:   'var(--fs-xs)',
        sm:   'var(--fs-sm)',
        base: 'var(--fs-base)',
        md:   'var(--fs-md)',
        lg:   'var(--fs-lg)',
        xl:   'var(--fs-xl)',
        '2xl':'var(--fs-2xl)',
        '3xl':'var(--fs-3xl)',
        '4xl':'var(--fs-4xl)',
        '5xl':'var(--fs-5xl)',
        '6xl':'var(--fs-6xl)',
      },
      borderRadius: {
        'ln-xs':  'var(--r-xs)',
        'ln-sm':  'var(--r-sm)',
        'ln-md':  'var(--r-md)',
        'ln':     'var(--r-lg)',
        'ln-xl':  'var(--r-xl)',
        'ln-2xl': 'var(--r-2xl)',
        'ln-pill':'var(--r-pill)',
      },
      boxShadow: {
        'ln-xs':     'var(--shadow-xs)',
        'ln-sm':     'var(--shadow-sm)',
        'ln':        'var(--shadow-md)',
        'ln-lg':     'var(--shadow-lg)',
        'ln-xl':     'var(--shadow-xl)',
        'ln-glow-green': 'var(--glow-green)',
        'ln-glow-navy':  'var(--glow-navy)',
      },
      screens: {
        xs: 'var(--bp-xs)',
        sm: 'var(--bp-sm)',
        md: 'var(--bp-md)',
        lg: 'var(--bp-lg)',
        xl: 'var(--bp-xl)',
        '2xl': 'var(--bp-2xl)',
      },
    },
  },
  plugins: [],
};
`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, preset);
console.log("→ build-tailwind: dist/tailwind-preset.cjs written");
