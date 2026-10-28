// Layout for the opening field. Pure and deterministic: no randomness, no imports.
//
// Prints are placed one by one in rank order. Each takes the free spot closest to the
// centre, with a gentle angular preference so the prints fan around the middle instead
// of piling up on one side. Result: rank 1 sits at the centre, and rank decides the
// ring a print lands in. Sizes are set by tier (equal area, so a portrait and a
// landscape of the same tier carry the same weight).
//
// Units are vw at design scale. CSS multiplies by --k for phones and tablets.

export type FieldTier = "S" | "A" | "B";
export interface FieldIn { id: string; ar: number; tier: FieldTier }
export interface FieldOut { id: string; x: number; y: number; w: number }
export interface FieldLayout { items: FieldOut[]; halfW: number; halfH: number }

// print area per tier, in vw squared
const AREA: Record<FieldTier, number> = { S: 430, A: 150, B: 66 };
const GAP = 2.2; // minimum clear space between prints at rest
const PAD = 5; // margin between the outermost prints and the plane edge

export function layoutField(input: FieldIn[], rx: number, ry: number): FieldLayout {
  const placed: { x: number; y: number; hw: number; hh: number }[] = [];
  const items: FieldOut[] = [];
  const STEP = 0.5;
  const golden = 2.399963; // radians; successive prints prefer successive directions

  input.forEach((it, n) => {
    const w = Math.sqrt(AREA[it.tier] * it.ar);
    const h = w / it.ar;
    const hw = w / 2 + GAP / 2;
    const hh = h / 2 + GAP / 2;
    const free = (x: number, y: number) =>
      placed.every((p) => Math.abs(x - p.x) >= hw + p.hw || Math.abs(y - p.y) >= hh + p.hh);

    let best = { x: 0, y: 0, score: Infinity };
    if (n === 0) {
      best = { x: 0, y: 0, score: 0 };
    } else {
      const want = n * golden;
      const maxX = rx * 1.6;
      const maxY = ry * 1.6;
      for (let y = -maxY; y <= maxY; y += STEP) {
        for (let x = -maxX; x <= maxX; x += STEP) {
          const r = Math.hypot(x / rx, y / ry);
          // angle of the candidate in the same stretched space
          const ang = Math.atan2(y / ry, x / rx);
          const bias = 1 + (it.tier === "S" ? 0.12 : 0.3) * (1 - Math.cos(ang - want));
          const score = r * bias;
          if (score < best.score && free(x, y)) best = { x, y, score };
        }
      }
    }
    placed.push({ x: best.x, y: best.y, hw, hh });
    items.push({ id: it.id, x: round(best.x), y: round(best.y), w: round(w) });
  });

  // Symmetric half-extents so the plane's centre (where the hero prints sit) is its middle.
  let halfW = 0;
  let halfH = 0;
  items.forEach((o, i) => {
    const h = o.w / input[i].ar;
    halfW = Math.max(halfW, Math.abs(o.x) + o.w / 2);
    halfH = Math.max(halfH, Math.abs(o.y) + h / 2);
  });
  return { items, halfW: round(halfW + PAD), halfH: round(halfH + PAD) };
}

const round = (v: number) => Math.round(v * 100) / 100;
