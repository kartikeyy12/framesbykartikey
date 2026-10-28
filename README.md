# framesbykartikey

Photography portfolio by Kartikey Tiwari. Astro (static) + a small vanilla TypeScript script.

## Run locally (WSL)
```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs dist/
```

## Photos
Originals live in `originals/` (git-ignored, never edited). Web versions are committed in `public/photos/`.
```bash
npm run images           # builds only missing derivatives
npm run images -- --force
```
Captions/alt text, collection and order are in `src/data/photos.ts`. Files held back from the build are listed in `scripts/optimize-images.mjs` (`EXCLUDE`).

## Ranking drives the layout
`src/data/ranking.ts` holds all 69 photos in rank order (tiers S, A, B, C). That one list sets what sits at the centre of the opening field and how large each print is, and the order and size of every photograph in the catalogue. Reorder it and rebuild.

If you run this in WSL, check `which node` points inside Linux (not `/mnt/c/...`) before `npm install`.
