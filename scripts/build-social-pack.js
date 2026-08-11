import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const NAVY = '#1B365D';
const GOLD = '#FFD700';
const GREEN = '#00D4AA';
const NEUTRAL = '#F4F4F4';

function readSVG(name) {
  return fs.readFileSync(path.join(ROOT, 'source', 'svg-sources', name), 'utf8');
}

function save(dest, buffer, label) {
  const fullPath = path.join(ROOT, dest);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, buffer);
  console.log(`  ✅  ${label.padEnd(44)} → ${dest}  (${(buffer.length / 1024).toFixed(1)} KB)`);
}

function wrapB64(svg) {
  return Buffer.from(svg).toString('base64');
}

const appIconB64 = wrapB64(readSVG('app-icon.svg'));
const logoB64 = wrapB64(readSVG('primary-logo.svg'));

async function build() {
  console.log('\n🎨 LAN Onasis — Social Namespace Pack\n');

  // ── Instagram profile identity (canonical app icon on navy) ──────────────
  const igProfile = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">
    <rect width="320" height="320" fill="${NAVY}"/>
    <rect x="10" y="10" width="300" height="300" rx="60" fill="none" stroke="${GOLD}" stroke-width="3"/>
    <image x="60" y="60" width="200" height="200" href="data:image/svg+xml;base64,${appIconB64}"/>
  </svg>`;
  save('social-media/instagram-profile-v1.png', await sharp(Buffer.from(igProfile)).png().toBuffer(), 'instagram profile (navy+gold)');

  // ── Facebook profile (same identity lockup) ───────────────────────────────
  const fbProfile = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <rect width="400" height="400" fill="${NAVY}"/>
    <rect x="12" y="12" width="376" height="376" rx="72" fill="none" stroke="${GOLD}" stroke-width="3"/>
    <image x="76" y="76" width="248" height="248" href="data:image/svg+xml;base64,${appIconB64}"/>
  </svg>`;
  save('social-media/facebook-profile-v1.png', await sharp(Buffer.from(fbProfile)).png().toBuffer(), 'facebook profile (navy+gold)');

  const squareProfile = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <rect width="400" height="400" fill="${NAVY}"/>
    <rect x="12" y="12" width="376" height="376" rx="72" fill="none" stroke="${GOLD}" stroke-width="3"/>
    <image x="76" y="76" width="248" height="248" href="data:image/svg+xml;base64,${appIconB64}"/>
  </svg>`;
  save('social-media/profile-picture-square-v1.png', await sharp(Buffer.from(squareProfile)).png().toBuffer(), 'profile pic square (navy+gold)');

  // ── Instagram story template (1080×1920) ──────────────────────────────────
  const igStory = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    <rect width="1080" height="1920" fill="${NAVY}"/>
    <rect x="0" y="0" width="1080" height="1920" fill="url(#navyGrad)"/>
    <defs>
      <linearGradient id="navyGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#14263F"/>
        <stop offset="1" stop-color="${NAVY}"/>
      </linearGradient>
    </defs>
    <rect x="30" y="30" width="1020" height="1860" rx="40" fill="none" stroke="${GOLD}" stroke-width="3" opacity="0.9"/>
    <image x="370" y="180" width="340" height="340" href="data:image/svg+xml;base64,${appIconB64}"/>
    <text x="540" y="700" font-family="Georgia, 'Times New Roman', serif" font-size="92" font-weight="bold" fill="${GOLD}" text-anchor="middle" letter-spacing="14">LAN ONASIS</text>
    <text x="540" y="880" font-family="Georgia, 'Times New Roman', serif" font-size="40" fill="${NEUTRAL}" text-anchor="middle" letter-spacing="6">INTELLIGENCE · INFRASTRUCTURE · SECURITY</text>
    <rect x="120" y="1020" width="840" height="360" rx="24" fill="#0F1E32"/>
    <text x="540" y="1120" font-family="-apple-system, sans-serif" font-size="34" fill="${GREEN}" text-anchor="middle" font-weight="bold" letter-spacing="2">HEADLINE HERE</text>
    <text x="540" y="1200" font-family="-apple-system, sans-serif" font-size="30" fill="${NEUTRAL}" text-anchor="middle">Two-line supporting statement that is</text>
    <text x="540" y="1255" font-family="-apple-system, sans-serif" font-size="30" fill="${NEUTRAL}" text-anchor="middle">specific, credible and on-voice.</text>
    <text x="540" y="1770" font-family="-apple-system, sans-serif" font-size="24" fill="#8FA3BF" text-anchor="middle" letter-spacing="2">@LANONASIS</text>
  </svg>`;
  save('social-media/instagram-story-v1.png', await sharp(Buffer.from(igStory)).png().toBuffer(), 'instagram story template 1080×1920');

  // ── Instagram highlight covers (1080×1080) ────────────────────────────────
  const highlights = [
    { id: 'about', label: 'ABOUT' },
    { id: 'products', label: 'PRODUCTS' },
    { id: 'engineering', label: 'ENGINEERING' },
    { id: 'security', label: 'SECURITY' },
    { id: 'community', label: 'COMMUNITY' },
  ];
  for (const h of highlights) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
      <rect width="1080" height="1080" fill="${NAVY}"/>
      <rect x="30" y="30" width="1020" height="1020" rx="200" fill="none" stroke="${GOLD}" stroke-width="4"/>
      <image x="340" y="240" width="400" height="400" href="data:image/svg+xml;base64,${appIconB64}"/>
      <text x="540" y="800" font-family="'DejaVu Serif', Georgia, serif" font-size="64" font-weight="bold" fill="${GOLD}" text-anchor="middle" letter-spacing="8">${h.label}</text>
    </svg>`;
    save(`social-media/instagram-highlight-${h.id}-v1.png`, await sharp(Buffer.from(svg)).png().toBuffer(), `ig highlight ${h.id}`);
  }

  // ── Instagram feed template (1080×1080) ───────────────────────────────────
  const igFeed = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
    <rect width="1080" height="1080" fill="${NAVY}"/>
    <rect x="40" y="40" width="1000" height="1000" rx="48" fill="none" stroke="${GOLD}" stroke-width="3" opacity="0.8"/>
    <image x="470" y="70" width="140" height="140" href="data:image/svg+xml;base64,${appIconB64}"/>
    <rect x="120" y="270" width="840" height="460" rx="24" fill="#0F1E32"/>
    <text x="540" y="360" font-family="-apple-system, sans-serif" font-size="36" fill="${GREEN}" text-anchor="middle" font-weight="bold" letter-spacing="2">HEADLINE</text>
    <text x="540" y="440" font-family="-apple-system, sans-serif" font-size="30" fill="${NEUTRAL}" text-anchor="middle">Supporting line one of the post copy.</text>
    <text x="540" y="490" font-family="-apple-system, sans-serif" font-size="30" fill="${NEUTRAL}" text-anchor="middle">Supporting line two stays specific.</text>
    <text x="540" y="650" font-family="-apple-system, sans-serif" font-size="26" fill="#8FA3BF" text-anchor="middle" letter-spacing="2">#LANONASIS</text>
    <rect x="160" y="820" width="760" height="3" fill="${GOLD}" opacity="0.5"/>
    <text x="540" y="920" font-family="'DejaVu Serif', Georgia, serif" font-size="40" font-weight="bold" fill="${GOLD}" text-anchor="middle" letter-spacing="6">LAN ONASIS</text>
    <text x="540" y="990" font-family="-apple-system, sans-serif" font-size="22" fill="#8FA3BF" text-anchor="middle" letter-spacing="3">ONE ECOSYSTEM · ONE IDENTITY</text>
  </svg>`;
  save('social-media/instagram-feed-template-v1.png', await sharp(Buffer.from(igFeed)).png().toBuffer(), 'instagram feed template 1080×1080');

  // ── Facebook cover (1640×859) ─────────────────────────────────────────────
  const fbCover = `<svg xmlns="http://www.w3.org/2000/svg" width="1640" height="859" viewBox="0 0 1640 859">
    <rect width="1640" height="859" fill="url(#navyGrad)"/>
    <defs>
      <linearGradient id="navyGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#14263F"/>
        <stop offset="1" stop-color="${NAVY}"/>
      </linearGradient>
    </defs>
    <rect x="24" y="24" width="1592" height="811" rx="24" fill="none" stroke="${GOLD}" stroke-width="3" opacity="0.7"/>
    <image x="1130" y="180" width="340" height="340" href="data:image/svg+xml;base64,${appIconB64}"/>
    <text x="150" y="330" font-family="'DejaVu Serif', Georgia, serif" font-size="96" font-weight="bold" fill="${GOLD}" text-anchor="start" letter-spacing="8">LAN ONASIS</text>
    <text x="156" y="430" font-family="Georgia, 'Times New Roman', serif" font-size="40" fill="${NEUTRAL}" text-anchor="start" letter-spacing="4">Intelligence · Infrastructure · Security · Fintech</text>
    <text x="156" y="510" font-family="-apple-system, sans-serif" font-size="30" fill="#B9C7DA" text-anchor="start">Enterprise-grade SaaS. One evolving ecosystem.</text>
  </svg>`;
  save('social-media/facebook-cover-v1.png', await sharp(Buffer.from(fbCover)).png().toBuffer(), 'facebook cover 1640×859');

  // ── LinkedIn cover (1584×396, brand lockup) ───────────────────────────────
  const liCover = `<svg xmlns="http://www.w3.org/2000/svg" width="1584" height="396" viewBox="0 0 1584 396">
    <rect width="1584" height="396" fill="${NAVY}"/>
    <rect x="16" y="16" width="1552" height="364" rx="16" fill="none" stroke="${GOLD}" stroke-width="2" opacity="0.7"/>
    <image x="60" y="36" width="180" height="180" href="data:image/svg+xml;base64,${appIconB64}"/>
    <text x="280" y="130" font-family="'DejaVu Serif', Georgia, serif" font-size="64" font-weight="bold" fill="${GOLD}" text-anchor="start" letter-spacing="6">LAN ONASIS</text>
    <text x="284" y="200" font-family="-apple-system, sans-serif" font-size="28" fill="${NEUTRAL}" text-anchor="start">Intelligence → Infrastructure → Security → Financial technology → Business enablement</text>
  </svg>`;
  save('social-media/linkedin-cover-v1.png', await sharp(Buffer.from(liCover)).png().toBuffer(), 'linkedin cover (brand lockup)');

  // ── X/Twitter header (1500×500) ───────────────────────────────────────────
  const xHeader = `<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="500" viewBox="0 0 1500 500">
    <rect width="1500" height="500" fill="url(#navyGrad)"/>
    <defs>
      <linearGradient id="navyGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#14263F"/>
        <stop offset="1" stop-color="${NAVY}"/>
      </linearGradient>
    </defs>
    <rect x="20" y="20" width="1460" height="460" rx="20" fill="none" stroke="${GOLD}" stroke-width="2" opacity="0.6"/>
    <image x="90" y="80" width="180" height="180" href="data:image/svg+xml;base64,${appIconB64}"/>
    <text x="320" y="170" font-family="'DejaVu Serif', Georgia, serif" font-size="60" font-weight="bold" fill="${GOLD}" text-anchor="start" letter-spacing="6">LAN ONASIS</text>
    <text x="326" y="240" font-family="-apple-system, sans-serif" font-size="26" fill="${NEUTRAL}" text-anchor="start">Developer infrastructure, security, memory-as-a-service &amp; financial technology.</text>
    <text x="1200" y="430" font-family="-apple-system, sans-serif" font-size="22" fill="${GREEN}" text-anchor="end" letter-spacing="2">@LANONASIS</text>
  </svg>`;
  save('social-media/twitter-header-v1.png', await sharp(Buffer.from(xHeader)).png().toBuffer(), 'x/twitter header 1500×500');

  console.log('\n✨ Social namespace pack generated.\n');
}

build().catch(err => {
  console.error('\n❌ Build failed:', err.message);
  process.exit(1);
});
