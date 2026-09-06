#!/usr/bin/env node
// scripts/build-ico.mjs
// Generate a genuine multi-size .ico file from source/design-system/assets/favicons/favicon.svg.
// ICO format: 6-byte header + N x 16-byte ICONDIRENTRY + N image data blocks.
// Modern .ico supports PNG-encoded entries (Vista+).

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "source/design-system/assets/favicons/favicon.svg");
const OUT_DIR = path.join(ROOT, "dist/assets/favicons");
const OUT_ICO = path.join(OUT_DIR, "favicon.ico");

function ensureDir(d) { fs.mkdirSync(d, { recursive: true }); }

// Sizes to embed in the .ico (must be <= 256 for ICO).
const SIZES = [16, 32, 48, 64];

function writeUInt16LE(buf, offset, value) {
  buf.writeUInt16LE(value, offset);
}
function writeUInt32LE(buf, offset, value) {
  buf.writeUInt32LE(value, offset);
}

async function main() {
  if (!fs.existsSync(SRC)) {
    throw new Error(`Missing favicon source: ${SRC}`);
  }
  ensureDir(OUT_DIR);

  // Render each size as PNG bytes (sharp supports .png output natively).
  const pngs = [];
  for (const s of SIZES) {
    const buf = await sharp(SRC).resize(s, s).png().toBuffer();
    pngs.push({ size: s, data: buf });
  }

  // Build ICO container.
  const headerSize = 6 + 16 * SIZES.length;
  let offset = headerSize;
  const header = Buffer.alloc(headerSize);
  // ICONDIR
  writeUInt16LE(header, 0, 0);          // reserved
  writeUInt16LE(header, 2, 1);          // type = 1 (icon)
  writeUInt16LE(header, 4, SIZES.length); // count
  for (let i = 0; i < SIZES.length; i++) {
    const { size, data } = pngs[i];
    const base = 6 + 16 * i;
    header.writeUInt8(size === 256 ? 0 : size, base + 0);  // width  (0 = 256)
    header.writeUInt8(size === 256 ? 0 : size, base + 1);  // height (0 = 256)
    header.writeUInt8(0, base + 2);                         // color count (0 = >=256)
    header.writeUInt8(0, base + 3);                         // reserved
    writeUInt16LE(header, base + 4, 1);                      // planes
    writeUInt16LE(header, base + 6, 32);                     // bit count
    header.writeUInt32LE(data.length, base + 8);            // size in bytes
    header.writeUInt32LE(offset, base + 12);                 // offset to image data
    offset += data.length;
  }
  const ico = Buffer.concat([header, ...pngs.map(p => p.data)]);
  fs.writeFileSync(OUT_ICO, ico);
  console.log(`→ build-ico: favicon.ico (${ico.length} bytes, ${SIZES.length} sizes: ${SIZES.join(", ")})`);
}

main().catch(e => { console.error(e); process.exit(1); });
