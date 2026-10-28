import generated from "./photos.generated.json";
import { rankOf, tierOf, type Tier } from "./ranking";

export type CollectionId = "events" | "sky" | "everyday";
export interface Variant { file: string; w: number; h: number; bytes: number }
export interface Photo {
  id: string; collection: CollectionId; alt: string;
  w: number; h: number; color: string; lqip: string; variants: Variant[];
  rank: number; tier: Tier;
}

export const collections: { id: CollectionId; title: string }[] = [
  { id: "events", title: "Events" },
  { id: "sky", title: "Sky" },
  { id: "everyday", title: "Everyday" },
];

// Authored: collection and alt text per photo. Display order comes from ranking.ts. Ids come from filenames.
// Entries whose files are not in the generated manifest (held back in the image script) are skipped.
const authored: [id: string, collection: CollectionId, alt: string][] = [
  ["dsc-4625", "events", "A girl in a green and blue checked costume in a dance pose on a wooden floor."],
  ["dsc-0916", "events", "A naval band playing on stage under the conductor's baton, flowers along the front."],
  ["dsc-5835", "events", "Close view of a Ganesha idol's face, decorated in orange and gold."],
  ["exex-331", "events", "A woman in a red dress dancing on stage with one arm raised."],
  ["dsc-4117", "events", "Hands playing a pair of tabla."],
  ["img-0860", "events", "A basketball dropping toward the hoop at night under a floodlight."],
  ["eex-9674", "events", "A dancer in a feathered headdress and striped skirt mid-movement."],
  ["dsc-1879", "events", "Women in saris dancing on stage with metal pots balanced on their heads."],
  ["exex-348", "events", "Hands strumming an acoustic guitar under blue and purple stage light."],
  ["dsc-5868", "events", "A girl in a yellow kurta, hands pressed together, eyes lowered."],
  ["dsc-0764", "events", "A trombone bell in close-up among brass players in white uniforms."],
  ["exex-441", "events", "A badminton player in a pink shirt stretching for a shot while onlookers watch."],
  ["exex-067", "events", "A classical dancer in mid-pose on a dark stage beside a white chair."],
  ["dsc-4130", "events", "A performer in a red shirt seen from behind, facing an audience lit by phone lights."],
  ["eex-9621", "events", "A young woman in a white top dancing with one hand raised to her forehead."],
  ["exex-134", "events", "Fairy lights strung across a ceiling, glowing orange and red."],
  ["dsc-4551", "events", "Children in festival costume and flower garlands watching a performance, one wearing a crown."],
  ["exex-373", "events", "A guitarist looking down at his instrument in dark blue light."],
  ["exex-184", "events", "A person pointing a microphone toward a seated audience."],
  ["dsc-2948", "events", "A drum kit on a wooden stage floor."],
  ["exex-201", "events", "A man in a white outfit and red turban raising a fist on stage."],
  ["eex-9632", "events", "A young man in a striped shawl speaking into a microphone."],
  ["dsc-3484", "events", "Women in traditional dress looking at a phone together in warm light."],
  ["dsc-1033", "events", "Clarinet and flute players in white uniforms reading sheet music."],
  ["eex-9348", "events", "A seated man playing a clay pot drum."],
  ["exex-106", "events", "Students crowded around a table, in black and white."],
  ["img-0852", "events", "A dancer in black and white mid-gesture beside a white chair."],
  ["exex-423", "events", "A crowd gathered around an idol on a truck at dusk."],
  ["eex-9667", "events", "Performers in traditional dress standing in a line in front of a projected slide."],
  ["dsc-4825", "events", "White jasmine flowers among green leaves."],
  ["exex-146", "events", "A man with a table-tennis bat, gesturing in a classroom."],
  ["exex-193", "events", "Three young men sitting on dusty ground with a basketball hoop behind them."],
  ["exex-189", "events", "A microphone and a printed booklet on a white table."],
  ["exex-217", "events", "Hands passing a notebook with a printed cover."],
  ["dsc-2106", "events", "A harmonium and the hands of musicians seated on the floor."],
  ["dsc-3218", "events", "A phone held up in a dark hall, its screen glowing between fingers."],
  ["eex-9286", "events", "A phone filming a stage performance, held in two hands."],
  ["exex-392", "events", "A player in a white number 5 shirt, seen from behind, reaches down to help a seated player in a black shirt up on a floodlit court at night."],

  ["img-5629", "sky", "A full moon with a wide glowing halo."],
  ["exex-12", "sky", "A large rust-red moon with dark patches on a black sky."],
  ["img-2426", "sky", "Pink and orange clouds over the sea at sunset."],
  ["img-2643", "sky", "A half moon with its craters visible."],
  ["exex-1", "sky", "A partly lit orange moon in a black sky."],
  ["img-8729", "sky", "Stars over dark trees, the left edge tinted red."],
  ["exex-095", "sky", "A small bright moon behind thin cloud in a dark sky."],
  ["img-2051", "sky", "A gibbous moon with a blue fringe, at the left of a wide black frame."],
  ["img-3151", "sky", "A thin crescent moon above a beach at dusk."],
  ["img-2482", "sky", "A thin crescent moon with a bright point beside it."],
  ["img-9403", "sky", "Stars above a palm tree lit from below."],
  ["img-1935", "sky", "A crescent moon among purple clouds above dark trees."],
  ["img-2136", "sky", "Heavy blue clouds over silhouetted palms at dusk."],
  ["img-1968", "sky", "The sun setting over a bay, seen through a dark opening."],
  ["exex-9", "sky", "A faint scatter of stars on a near-black sky."],
  ["img-2889", "sky", "A boat crossing a still lake coloured by the sunset sky."],
  ["img-5631", "sky", "A small red moon in a dark sky."],

  ["exex-390", "everyday", "A red-and-white striped lighthouse among palm fronds at dusk."],
  ["img-9685", "everyday", "A dog asleep in dappled light under trees, beside a yellow wall."],
  ["exex-389", "everyday", "Fishing boats moored in a bay below palm trees at golden hour."],
  ["img-1124", "everyday", "Rows of framed pictures angled along a wall in warm orange light."],
  ["img-6839", "everyday", "Six friends posing on a road in front of a lit railway station at night, light trails at their feet."],
  ["hrs01542", "everyday", "A white cow standing in dense green undergrowth."],
  ["img-1122", "everyday", "A visitor silhouetted in a dim gallery of framed works."],
  ["img-0559", "everyday", "A tall brick chimney against a blue sky, framed by tree branches."],
  ["img-2353", "everyday", "Light falling across a dark staircase inside a building."],
  ["exex-10", "everyday", "Silhouetted people seated on tiered steps outdoors, a green laser crossing the sky."],
  ["img-3082", "everyday", "City lights seen from a hill at night, an orange roof in the foreground."],
  ["img-2657", "everyday", "A bird of prey flying over dark water."],
  ["img-9413", "everyday", "A figure seen from behind, standing against a dark horizon at night."],
  ["sunset-shoreline-silhouettes", "everyday", "Silhouettes of a bull and two people on a beach against an orange sunset."],
  ["file-000000003e688211b1d3e5cf64c42067", "everyday", "A tabby cat crouched on a stone wall beneath green leaves."],
];

const known = new Set(authored.map(([id]) => id));
const missing = generated.filter((g) => !known.has(g.id)).map((g) => g.id);
if (missing.length) throw new Error(`src/data/photos.ts has no entry for: ${missing.join(", ")}`);
const unranked = generated.filter((g) => rankOf(g.id) === 0).map((g) => g.id);
if (unranked.length) throw new Error(`src/data/ranking.ts has no rank for: ${unranked.join(", ")}`);

const byId = new Map(generated.map((g) => [g.id, g]));
export const photos: Photo[] = authored.flatMap(([id, collection, alt]) => {
  const g = byId.get(id);
  return g ? [{ ...g, collection, alt, rank: rankOf(id), tier: tierOf(id) } as Photo] : [];
});

export const inCollection = (c: CollectionId) =>
  photos.filter((p) => p.collection === c).sort((a, b) => a.rank - b.rank);
export const url = (v: Variant) => `/photos/${v.file}`;
export const srcset = (p: Photo) => p.variants.map((v) => `${url(v)} ${v.w}w`).join(", ");
