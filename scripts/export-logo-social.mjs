import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const brand = join(root, "public", "brand");

const SIZE = 1024;
const DENSITY = Math.round((SIZE / 32) * 72); // SVG viewBox is 32 units wide

const exports = [
  {
    in: "comanifest-logo-mark-on-dark.svg",
    out: "comanifest-logo-mark-social-dark.png",
    background: "#1A1B2E", // Deep Midnight Indigo
  },
  {
    in: "comanifest-logo-mark-on-light.svg",
    out: "comanifest-logo-mark-social-light.png",
    background: "#FFFFFF",
  },
];

for (const item of exports) {
  await sharp(join(brand, item.in), { density: DENSITY })
    .resize(SIZE, SIZE, { fit: "contain", background: item.background })
    .flatten({ background: item.background })
    .png()
    .toFile(join(brand, item.out));
  console.log(`Wrote ${item.out} (${SIZE}x${SIZE}, bg ${item.background})`);
}
