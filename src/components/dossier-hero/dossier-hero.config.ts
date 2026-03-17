import type { PhaseDefinition } from './dossier-hero.types';

export const PHASES: PhaseDefinition[] = [
  { id: 'closed',  range: [0.00, 0.10] },
  { id: 'open',    range: [0.10, 0.32] },
  { id: 'flight',  range: [0.32, 0.62] },
  { id: 'close',   range: [0.62, 0.84] },
  { id: 'handoff', range: [0.84, 1.00] },
];

/** Height of the scroll runway in vh units */
export const SCROLL_RUNWAY_VH = 500;

/** Preloader minimum duration in ms (brand handoff) */
export const PRELOADER_MIN_MS = 800;

/** Frame batch size for preloading */
export const FRAME_BATCH_SIZE = 20;

/** Canvas rotation range in degrees: [start, end] */
export const ROTATION_RANGE: [number, number] = [-4, 8];

/** Flagship teaser fade-in start (within overall progress) */
export const FLAGSHIP_FADE_START = 0.55;
