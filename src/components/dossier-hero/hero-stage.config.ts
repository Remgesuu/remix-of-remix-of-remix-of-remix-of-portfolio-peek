import type { DossierPhaseId } from './dossier-hero.types';

export interface PhaseSceneState {
  cameraZ: number;
  bookScale: number;
  bookY: number;
  bookRotZ: number;
  atmosphereOpacity: number;
  grainOpacity: number;
}

export const PHASE_SCENE: Record<DossierPhaseId, PhaseSceneState> = {
  closed: {
    cameraZ: 5.0,
    bookScale: 1.0,
    bookY: 0,
    bookRotZ: -0.07,     // subtle tilt (radians)
    atmosphereOpacity: 0.6,
    grainOpacity: 0.025,
  },
  open: {
    cameraZ: 4.5,
    bookScale: 1.05,
    bookY: 0,
    bookRotZ: -0.03,
    atmosphereOpacity: 0.8,
    grainOpacity: 0.03,
  },
  flight: {
    cameraZ: 4.0,
    bookScale: 0.95,
    bookY: 0.3,
    bookRotZ: 0.05,
    atmosphereOpacity: 1.0,
    grainOpacity: 0.035,
  },
  close: {
    cameraZ: 4.8,
    bookScale: 0.85,
    bookY: 0.5,
    bookRotZ: 0.08,
    atmosphereOpacity: 0.7,
    grainOpacity: 0.025,
  },
  handoff: {
    cameraZ: 5.5,
    bookScale: 0.7,
    bookY: 0.8,
    bookRotZ: 0.12,
    atmosphereOpacity: 0.3,
    grainOpacity: 0.02,
  },
};

/** Pointer parallax strength (viewport-normalised units) */
export const POINTER_PARALLAX = 0.1;

/** Lerp speed for scene transitions per frame */
export const SCENE_LERP = 0.06;
