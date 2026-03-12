import sharp from 'sharp';
import { optimize } from 'svgo';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const NAVY = '#1B365D';
const GREEN = '#00D4AA';

console.log('\n🎨 LAN Onasis Brand Kit — Asset Builder\n');

// ─── Read SVG sources ────────────────────────────────────────────────────────

function readSVG(name) {
  const filePath = path.join(ROOT, 'source', 'svg-sources', name);
  return fs.readFileSync(filePath, 'utf8');
}

// ─── Optimize SVG with SVGO ──────────────────────────────────────────────────

function optimizeSVG(svgString) {
  const result = optimize(svgString, {
    plugins: [
      'removeDoctype',
      'removeXMLProcInst',
      'removeComments',
      'removeMetadata',
      'removeEditorsNSData',
      'cleanupAttrs',
      'mergeStyles',
      'inlineStyles',
      'removeUselessDefs',
      'cleanupNumericValues',
      'convertColors',
      'removeUnknownsAndDefaults',
      'removeNonInheritableGroupAttrs',
      'removeUselessStrokeAndFill',
      'cleanupEnableBackground',
      'removeHiddenElems',
      'removeEmptyText',
      'convertShapeToPath',
      'mergePaths',
      'removeEmptyAttrs',
      'removeEmptyContainers',
      'removeUnusedNS',
      'sortDefsChildren',
      'removeTitle',
      'removeDesc',
    ],
  });
  return result.data;
}

// ─── Generate PNG at given size from SVG buffer ──────────────────────────────

async function svgToPng(svgBuffer, width, height) {
  return sharp(svgBuffer)
    .resize(width, height)
    .png({ quality: 100, compressionLevel: 9 })
    .toBuffer();
}

// ─── Save file and log ───────────────────────────────────────────────────────

function save(dest, buffer, label) {
  const fullPath = path.join(ROOT, dest);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, buffer);
  const kb = (buffer.length / 1024).toFixed(1);
  console.log(`  ✅  ${label.padEnd(42)} → ${dest}  (${kb} KB)`);
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function build() {

  // ── 1. Icon standalone (transparent background) ──────────────────────────
  console.log('📌 Icon (standalone)');
  const iconSVG = readSVG('icon-standalone.svg');
  const iconOptimized = optimizeSVG(iconSVG);
  save('01_LOGOS/icon-only.svg', Buffer.from(iconOptimized), 'icon-only.svg');

  const iconBuf = Buffer.from(iconSVG);
  save('01_LOGOS/icon-only-512.png',  await svgToPng(iconBuf, 512, 512),  'icon-only-512px');
  save('01_LOGOS/icon-only-256.png',  await svgToPng(iconBuf, 256, 256),  'icon-only-256px');
  save('01_LOGOS/icon-only-128.png',  await svgToPng(iconBuf, 128, 128),  'icon-only-128px');

  // ── 2. App icon (navy rounded square) ─────────────────────────────────────
  console.log('\n📌 App Icon (navy background)');
  const appSVG = readSVG('app-icon.svg');
  const appOptimized = optimizeSVG(appSVG);
  save('01_LOGOS/app-icon.svg', Buffer.from(appOptimized), 'app-icon.svg');

  const appBuf = Buffer.from(appSVG);
  save('07_APP_ICONS/android/mipmap-xxxhdpi/ic_launcher.png', await svgToPng(appBuf, 192, 192), 'android xxxhdpi (192×192)');
  save('07_APP_ICONS/android/mipmap-xxhdpi/ic_launcher.png',  await svgToPng(appBuf, 144, 144), 'android xxhdpi  (144×144)');
  save('07_APP_ICONS/android/mipmap-xhdpi/ic_launcher.png',   await svgToPng(appBuf,  96,  96), 'android xhdpi   (96×96)');
  save('07_APP_ICONS/android/mipmap-hdpi/ic_launcher.png',    await svgToPng(appBuf,  72,  72), 'android hdpi    (72×72)');
  save('07_APP_ICONS/android/mipmap-mdpi/ic_launcher.png',    await svgToPng(appBuf,  48,  48), 'android mdpi    (48×48)');

  // iOS app icon sizes
  save('07_APP_ICONS/ios/AppIcon.appiconset/Icon-1024.png',   await svgToPng(appBuf, 1024, 1024), 'ios 1024×1024 (App Store)');
  save('07_APP_ICONS/ios/AppIcon.appiconset/Icon-180.png',    await svgToPng(appBuf,  180,  180), 'ios 180×180 (iPhone @3x)');
  save('07_APP_ICONS/ios/AppIcon.appiconset/Icon-167.png',    await svgToPng(appBuf,  167,  167), 'ios 167×167 (iPad Pro)');
  save('07_APP_ICONS/ios/AppIcon.appiconset/Icon-152.png',    await svgToPng(appBuf,  152,  152), 'ios 152×152 (iPad)');
  save('07_APP_ICONS/ios/AppIcon.appiconset/Icon-120.png',    await svgToPng(appBuf,  120,  120), 'ios 120×120 (iPhone)');
  save('07_APP_ICONS/ios/AppIcon.appiconset/Icon-87.png',     await svgToPng(appBuf,   87,   87), 'ios 87×87   (iPhone @3x small)');
  save('07_APP_ICONS/ios/AppIcon.appiconset/Icon-80.png',     await svgToPng(appBuf,   80,   80), 'ios 80×80   (iPad @2x)');
  save('07_APP_ICONS/ios/AppIcon.appiconset/Icon-76.png',     await svgToPng(appBuf,   76,   76), 'ios 76×76   (iPad)');
  save('07_APP_ICONS/ios/AppIcon.appiconset/Icon-60.png',     await svgToPng(appBuf,   60,   60), 'ios 60×60   (iPhone)');
  save('07_APP_ICONS/ios/AppIcon.appiconset/Icon-58.png',     await svgToPng(appBuf,   58,   58), 'ios 58×58   (Settings @2x)');
  save('07_APP_ICONS/ios/AppIcon.appiconset/Icon-40.png',     await svgToPng(appBuf,   40,   40), 'ios 40×40   (Spotlight)');
  save('07_APP_ICONS/ios/AppIcon.appiconset/Icon-29.png',     await svgToPng(appBuf,   29,   29), 'ios 29×29   (Settings)');
  save('07_APP_ICONS/ios/AppIcon.appiconset/Icon-20.png',     await svgToPng(appBuf,   20,   20), 'ios 20×20   (Notification)');

  // Android chrome PWA icons
  save('02_FAVICONS/android-chrome-512x512.png', await svgToPng(appBuf, 512, 512), 'android-chrome 512×512');
  save('02_FAVICONS/android-chrome-192x192.png', await svgToPng(appBuf, 192, 192), 'android-chrome 192×192');
  save('02_FAVICONS/apple-touch-icon.png',        await svgToPng(appBuf, 180, 180), 'apple-touch-icon 180×180');

  // ── 3. Primary logo ────────────────────────────────────────────────────────
  console.log('\n📌 Primary Logo');
  const logoSVG = readSVG('primary-logo.svg');
  const logoOptimized = optimizeSVG(logoSVG);
  save('01_LOGOS/primary-logo.svg', Buffer.from(logoOptimized), 'primary-logo.svg');

  const logoBuf = Buffer.from(logoSVG);
  save('01_LOGOS/primary-logo-1200.png', await svgToPng(logoBuf, 1200, 1050), 'primary-logo 1200px');
  save('01_LOGOS/primary-logo-600.png',  await svgToPng(logoBuf,  600,  525), 'primary-logo 600px');
  save('01_LOGOS/primary-logo-300.png',  await svgToPng(logoBuf,  300,  262), 'primary-logo 300px');

  // ── 4. Favicons ────────────────────────────────────────────────────────────
  console.log('\n📌 Favicons');
  const faviconSVG = readSVG('favicon-master.svg');
  const faviconOptimized = optimizeSVG(faviconSVG);
  save('02_FAVICONS/favicon.svg', Buffer.from(faviconOptimized), 'favicon.svg');

  const faviconBuf = Buffer.from(faviconSVG);
  save('02_FAVICONS/favicon-16x16.png',  await svgToPng(faviconBuf,  16,  16),  'favicon 16×16');
  save('02_FAVICONS/favicon-32x32.png',  await svgToPng(faviconBuf,  32,  32),  'favicon 32×32');
  save('02_FAVICONS/favicon-48x48.png',  await svgToPng(faviconBuf,  48,  48),  'favicon 48×48');
  save('02_FAVICONS/favicon-64x64.png',  await svgToPng(faviconBuf,  64,  64),  'favicon 64×64');
  save('02_FAVICONS/favicon-96x96.png',  await svgToPng(faviconBuf,  96,  96),  'favicon 96×96');
  save('02_FAVICONS/favicon-128x128.png', await svgToPng(faviconBuf, 128, 128), 'favicon 128×128');

  // ── 5. Social-media header sizes from primary logo ─────────────────────────
  console.log('\n📌 Social Media Sizes');
  save('social-media/profile-picture-square-v1.png', await svgToPng(appBuf, 400, 400),           'profile pic square 400×400');
  save('social-media/twitter-header-v1.png',         await svgToPng(logoBuf, 1500, 500),          'twitter header 1500×500');
  save('social-media/linkedin-cover-v1.png',         await svgToPng(logoBuf, 1584, 396),          'linkedin cover 1584×396');
  save('social-media/facebook-profile-v1.png',       await svgToPng(appBuf, 400, 400),            'facebook profile 400×400');
  save('social-media/instagram-profile-v1.png',      await svgToPng(appBuf, 320, 320),            'instagram profile 320×320');

  // ── 6. Write iOS Contents.json ─────────────────────────────────────────────
  const contentsJson = {
    images: [
      { filename: 'Icon-20.png',   idiom: 'iphone', scale: '2x', size: '20x20' },
      { filename: 'Icon-29.png',   idiom: 'iphone', scale: '1x', size: '29x29' },
      { filename: 'Icon-40.png',   idiom: 'iphone', scale: '2x', size: '20x20' },
      { filename: 'Icon-58.png',   idiom: 'iphone', scale: '2x', size: '29x29' },
      { filename: 'Icon-60.png',   idiom: 'iphone', scale: '1x', size: '60x60' },
      { filename: 'Icon-80.png',   idiom: 'iphone', scale: '2x', size: '40x40' },
      { filename: 'Icon-87.png',   idiom: 'iphone', scale: '3x', size: '29x29' },
      { filename: 'Icon-120.png',  idiom: 'iphone', scale: '2x', size: '60x60' },
      { filename: 'Icon-152.png',  idiom: 'ipad',   scale: '2x', size: '76x76' },
      { filename: 'Icon-167.png',  idiom: 'ipad',   scale: '2x', size: '83.5x83.5' },
      { filename: 'Icon-180.png',  idiom: 'iphone', scale: '3x', size: '60x60' },
      { filename: 'Icon-1024.png', idiom: 'ios-marketing', scale: '1x', size: '1024x1024' },
    ],
    info: { author: 'xcode', version: 1 },
  };
  save(
    '07_APP_ICONS/ios/AppIcon.appiconset/Contents.json',
    Buffer.from(JSON.stringify(contentsJson, null, 2)),
    'iOS Contents.json'
  );

  // ── 7. Update site.webmanifest ─────────────────────────────────────────────
  const manifest = {
    name: 'LAN Onasis',
    short_name: 'LAN Onasis',
    description: 'Africa\'s leading enterprise-grade SaaS solutions provider',
    theme_color: NAVY,
    background_color: NAVY,
    display: 'standalone',
    icons: [
      { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
    ],
  };
  save(
    '02_FAVICONS/site.webmanifest',
    Buffer.from(JSON.stringify(manifest, null, 2)),
    'site.webmanifest'
  );

  // ── Done ───────────────────────────────────────────────────────────────────
  console.log('\n✨ All assets generated successfully!\n');
  console.log('Run `bun run preview` to see the updated brand kit.\n');
}

build().catch(err => {
  console.error('\n❌ Build failed:', err.message);
  process.exit(1);
});
