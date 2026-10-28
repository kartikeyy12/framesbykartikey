// Builds web derivatives from ./originals (never modified) into ./public/photos
// and writes src/data/photos.generated.json. Run: npm run images [-- --force]
import { readdir, mkdir, stat, writeFile, access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "originals");
const OUT = path.join(ROOT, "public", "photos");
const MANIFEST = path.join(ROOT, "src", "data", "photos.generated.json");
const FORCE = process.argv.includes("--force");
const LONG_EDGES = [480, 1000, 1800, 2800]; // long-edge targets; never upscaled
const QUALITY = 80;
const OPTS = { failOn: "none", limitInputPixels: false };

// Held back: too small to show well (459x668).
const EXCLUDE = new Set([
  "IMG_5631.JPG.jpeg",
]);

const slug = (f) =>
  path.parse(f).name.replace(/\.(jpe?g|png)$/i, "").replace(/\s*\(\d+\)$/, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const exists = (p) => access(p).then(() => true, () => false);

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (/\.(jpe?g|png)$/i.test(e.name)) out.push(p);
  }
  return out.sort();
}

async function processOne(file) {
  const id = slug(path.basename(file));
  const folder = path.basename(path.dirname(file));
  const meta = await sharp(file, OPTS).metadata();
  const swap = meta.orientation && meta.orientation >= 5;
  const nw = swap ? meta.height : meta.width;
  const nh = swap ? meta.width : meta.height;
  const long = Math.max(nw, nh);

  let edges = LONG_EDGES.filter((e) => e < long * 0.97);
  if (long <= LONG_EDGES.at(-1) && (!edges.length || long > edges.at(-1) * 1.08)) edges.push(long);
  if (!edges.length) edges = [long];

  const variants = [];
  for (const edge of edges) {
    const name = `${id}-${edge}.webp`;
    const dest = path.join(OUT, name);
    if (FORCE || !(await exists(dest))) {
      await sharp(file, OPTS).rotate()
        .resize({ width: edge, height: edge, fit: "inside", withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 5, smartSubsample: true }).toFile(dest);
    }
    const info = await sharp(dest).metadata();
    variants.push({ file: name, w: info.width, h: info.height, bytes: (await stat(dest)).size });
  }

  const tiny = await sharp(file, OPTS).rotate().resize(24, 24, { fit: "inside" })
    .webp({ quality: 40 }).toBuffer();
  const px = await sharp(file, OPTS).rotate().resize(1, 1).removeAlpha().raw().toBuffer();
  const color = "#" + [...px].map((v) => v.toString(16).padStart(2, "0")).join("");

  return {
    id, source: path.relative(SRC, file), folder, w: nw, h: nh,
    lqip: "data:image/webp;base64," + tiny.toString("base64"), color, variants,
  };
}

await mkdir(OUT, { recursive: true });
const files = (await walk(SRC)).filter((f) => !EXCLUDE.has(path.basename(f)));
const ids = new Set();
const results = [];
for (const f of files) {
  const r = await processOne(f);
  if (ids.has(r.id)) throw new Error(`Duplicate id: ${r.id} (${f})`);
  ids.add(r.id);
  results.push(r);
  console.log(r.id.padEnd(14), `${r.w}x${r.h}`.padEnd(11), r.variants.map((v) => `${v.w}w:${Math.round(v.bytes / 1024)}K`).join(" "));
}
await writeFile(MANIFEST, JSON.stringify(results, null, 1));
const total = results.flatMap((r) => r.variants).reduce((s, v) => s + v.bytes, 0);
console.log(`\n${results.length} photos, ${(total / 1048576).toFixed(1)} MB of derivatives`);
