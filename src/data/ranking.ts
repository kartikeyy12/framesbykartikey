// Editorial ranking, strongest first. This single list drives the opening field
// (rank decides distance from the centre and print size) and the order and scale
// of every photograph in the catalogue. Reorder it to change both.
//
//   S   1-6    the hero prints: sit dead centre of the field, largest everywhere
//   A   7-22   strong frames: the ring around them
//   B   23-53  solid: the outer ring
//   C   54-68  supporting frames: catalogue only, smallest
export const RANK: string[] = [
  // S
  "sunset-shoreline-silhouettes", "dsc-0916", "img-2426", "dsc-5835", "dsc-4625", "exex-12",
  // A
  "dsc-1879", "exex-331", "img-0860", "img-2889", "exex-390", "img-5629", "dsc-5868", "exex-067",
  "dsc-4117", "img-9685", "img-1124", "img-3151", "dsc-0764", "eex-9674", "img-0559", "dsc-4551",
  // B
  "exex-348", "exex-373", "img-0852", "exex-201", "dsc-3484", "eex-9621", "img-1968", "img-2643",
  "exex-1", "img-1122", "exex-392", "img-6839", "img-9413", "exex-10", "dsc-4130", "file-000000003e688211b1d3e5cf64c42067",
  "exex-389", "img-3082", "exex-441", "exex-134", "img-2136", "exex-095", "img-2482", "exex-184",
  "hrs01542", "img-2353", "dsc-4825", "exex-106", "eex-9348", "eex-9632", "dsc-1033", "exex-423",
  // C
  "img-8729", "eex-9667", "img-2051", "img-9403", "dsc-2106", "exex-193", "img-2657", "dsc-2948",
  "eex-9286", "img-1935", "dsc-3218", "exex-9", "exex-146", "exex-217", "exex-189",
];

export type Tier = "S" | "A" | "B" | "C";
const LAST = { S: 6, A: 22, B: 54 } as const; // last rank (1-based) of each tier

export const rankOf = (id: string) => RANK.indexOf(id) + 1; // 0 when unranked
export const tierOf = (id: string): Tier => {
  const r = rankOf(id);
  return r === 0 ? "C" : r <= LAST.S ? "S" : r <= LAST.A ? "A" : r <= LAST.B ? "B" : "C";
};
