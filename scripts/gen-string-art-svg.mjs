/** Generate string-art SVG geometry — ring threads avoid the manifestation core. */

import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const N = 17;
const CENTER = 16;
const BASE_R = 11.4;
const CORE_CLEAR = 6.2;
const STAR_CORE = 1.08;
const STAR_HALO = 1.96;

// Slight arc variation only — keeps the ring circular without a polygon read
const ARC_WEIGHTS = [
  0.98, 1.03, 0.97, 1.02, 0.99, 1.01, 0.98, 1.04, 0.97, 1.02, 0.99, 1.03, 0.98, 1.01, 0.97, 1.02,
  0.99,
];

// Tight radius — almost circular, tiny wobble only
const RADIUS_DELTAS = [
  -0.18, 0.22, -0.25, 0.15, 0.28, -0.2, 0.12, -0.24, 0.19, -0.14, 0.26, -0.22, 0.16, 0.23, -0.17,
  0.11, -0.2,
];

function nailPositions(scale = 1) {
  const arcSum = ARC_WEIGHTS.reduce((a, b) => a + b, 0);
  let angle = -Math.PI / 2 + 0.08;

  return ARC_WEIGHTS.map((weight, i) => {
    const r = (BASE_R + RADIUS_DELTAS[i]) * scale;
    const x = CENTER + r * Math.cos(angle);
    const y = CENTER + r * Math.sin(angle);
    angle += (weight / arcSum) * Math.PI * 2;
    return [x, y];
  });
}

function distPointToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

function ringThreads(nails, steps) {
  const segments = [];
  for (const k of steps) {
    for (let i = 0; i < nails.length; i++) {
      const j = (i + k) % nails.length;
      const [x1, y1] = nails[i];
      const [x2, y2] = nails[j];
      if (distPointToSegment(CENTER, CENTER, x1, y1, x2, y2) >= CORE_CLEAR) {
        segments.push([x1, y1, x2, y2]);
      }
    }
  }
  return segments;
}

function fmt(n) {
  return n.toFixed(1);
}

function pathFromSegments(segments) {
  return segments
    .map(([x1, y1, x2, y2]) => `M${fmt(x1)} ${fmt(y1)} L${fmt(x2)} ${fmt(y2)}`)
    .join(" ");
}

function starScaleForNail(x, y, nails) {
  const dist = Math.hypot(x - CENTER, y - CENTER);
  const distances = nails.map(([nx, ny]) => Math.hypot(nx - CENTER, ny - CENTER));
  const minD = Math.min(...distances);
  const maxD = Math.max(...distances);
  const t = maxD === minD ? 0.5 : (dist - minD) / (maxD - minD);
  return 1 - t * 0.22;
}

function starsMarkup(nails, coreR, haloR, opacity, coreScale = 1) {
  return nails
    .map(([x, y]) => {
      const scale = starScaleForNail(x, y, nails) * coreScale;
      const core = coreR * scale;
      const halo = haloR * scale;
      return `<circle cx="${fmt(x)}" cy="${fmt(y)}" r="${fmt(halo)}" opacity="${opacity.halo}"/><circle cx="${fmt(x)}" cy="${fmt(y)}" r="${fmt(core)}" opacity="${opacity.core}"/>`;
    })
    .join("\n  ");
}

const steps = [1, 2, 3, 4];

const nails = nailPositions(1);
const segments = ringThreads(nails, steps);
const path = pathFromSegments(segments);

const medNails = nailPositions(0.9);
const medSegments = ringThreads(medNails, steps);
const medPath = pathFromSegments(medSegments);

const medCore = STAR_CORE * 0.88;
const medHalo = STAR_HALO * 0.88;

const onDark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" aria-hidden="true">
  <!-- v8: circular ring, outer stars smaller, clearer threads -->
  <path d="${path}" stroke="#94A3B8" stroke-width="0.28" stroke-linecap="round" opacity="0.52" />
  <circle cx="16" cy="16" r="5.2" fill="#F8FAFC" opacity="0.14" />
  <circle cx="16" cy="16" r="3.75" fill="#F1F5F9" opacity="0.26" />
  <circle cx="16" cy="16" r="2.35" fill="#FFFFFF" opacity="0.88" />
  <circle cx="16" cy="16" r="1.1" fill="#FFFFFF" opacity="0.98" />
  <g fill="#FFFFFF">
  ${starsMarkup(nails, STAR_CORE, STAR_HALO, { halo: 0.38, core: 0.96 })}
  </g>
</svg>
`;

const onLight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" aria-hidden="true">
  <!-- v8: circular ring, outer stars smaller, clearer threads -->
  <path d="${path}" stroke="#1A1B2E" stroke-width="0.28" stroke-linecap="round" opacity="0.3" />
  <circle cx="16" cy="16" r="5.2" fill="#1A1B2E" opacity="0.07" />
  <circle cx="16" cy="16" r="3.75" fill="#1A1B2E" opacity="0.12" />
  <circle cx="16" cy="16" r="2.35" fill="#334155" opacity="0.78" />
  <circle cx="16" cy="16" r="1.1" fill="#1A1B2E" opacity="0.88" />
  <g fill="#1A1B2E">
  ${starsMarkup(nails, STAR_CORE, STAR_HALO, { halo: 0.16, core: 0.82 })}
  </g>
</svg>
`;

const medallion = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" aria-hidden="true">
  <!-- Midnight medallion favicon -->
  <circle cx="16" cy="16" r="15" fill="#1A1B2E" />
  <path d="${medPath}" stroke="#94A3B8" stroke-width="0.26" stroke-linecap="round" opacity="0.68" />
  <circle cx="16" cy="16" r="4.6" fill="#FFFFFF" opacity="0.12" />
  <circle cx="16" cy="16" r="3.25" fill="#FFFFFF" opacity="0.22" />
  <circle cx="16" cy="16" r="2" fill="#FFFFFF" opacity="0.9" />
  <circle cx="16" cy="16" r="0.95" fill="#FFFFFF" opacity="0.98" />
  <g fill="#FFFFFF">
  ${starsMarkup(medNails, medCore, medHalo, { halo: 0.35, core: 0.96 }, 1)}
  </g>
</svg>
`;

writeFileSync(join(root, "public/brand/comanifest-logo-mark-on-dark.svg"), onDark);
writeFileSync(join(root, "public/brand/comanifest-logo-mark-on-light.svg"), onLight);
writeFileSync(join(root, "public/brand/comanifest-logo-mark.svg"), medallion);
writeFileSync(join(root, "app/icon.svg"), medallion);

console.log(`Wrote 17-star string art (${segments.length} ring threads, uniform stars)`);
