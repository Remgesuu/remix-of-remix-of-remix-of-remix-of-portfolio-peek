import type { DossierPhaseId } from './dossier-hero.types';

/* ─── GLB Asset ─── */
export const GLB_URL = '/hero/support-hero.glb';

/* ─── Node name lookup: Blender name → semantic key ─── */
export const NODE_MAP = {
  DossierCore: 'dossier',
  DossierCover: 'dossierCover',
  SupportOrb: 'orb',
  PedestalBase: 'pedestalBase',
  PedestalMid: 'pedestalMid',
  PedestalTop: 'pedestalTop',
  TicketSlab_A: 'ticketA',
  TicketSlab_B: 'ticketB',
  TicketSlab_C: 'ticketC',
  PortalBack: 'portal',
  FrameRail_Right: 'railRight',
  FrameRail_Upper: 'railUpper',
} as const;

export type SemanticNodeKey = (typeof NODE_MAP)[keyof typeof NODE_MAP];

/* ─── Group assignments ─── */
export type SceneGroupId = 'heroArtifact' | 'support' | 'atmosphere';

export const GROUP_ASSIGNMENT: Record<SemanticNodeKey, SceneGroupId> = {
  dossier: 'heroArtifact',
  dossierCover: 'heroArtifact',
  pedestalBase: 'heroArtifact',
  pedestalMid: 'heroArtifact',
  pedestalTop: 'heroArtifact',
  orb: 'support',
  ticketA: 'support',
  ticketB: 'support',
  ticketC: 'support',
  railRight: 'support',
  railUpper: 'support',
  portal: 'atmosphere',
};

/* ─── Per-node behaviour flags ─── */
export interface NodeBehaviour {
  castShadow?: boolean;
  receiveShadow?: boolean;
  /** Apply pointer-driven tilt */
  pointerTilt?: boolean;
  /** Sin-based float animation */
  float?: { amp: number; speed: number };
  /** Pointer-driven lateral shift */
  pointerShift?: { x: number; y: number };
}

export const NODE_BEHAVIOUR: Partial<Record<SemanticNodeKey, NodeBehaviour>> = {
  dossier:      { castShadow: true },
  dossierCover: { castShadow: true },
  orb:          { castShadow: true, pointerTilt: true, float: { amp: 0.06, speed: 0.35 } },
  pedestalBase: { receiveShadow: true },
  pedestalMid:  { receiveShadow: true },
  pedestalTop:  { receiveShadow: true, castShadow: true },
  ticketA:      { castShadow: true, pointerShift: { x: 0.06, y: 0.04 } },
  ticketB:      { castShadow: true, pointerShift: { x: 0.08, y: 0.05 } },
  ticketC:      { castShadow: true, pointerShift: { x: 0.04, y: 0.03 } },
  portal:       { receiveShadow: true },
  railRight:    { pointerShift: { x: 0.03, y: 0.02 } },
  railUpper:    { pointerShift: { x: 0.02, y: 0.04 } },
};

/* ─── Camera defaults ─── */
export const CAMERA_DEFAULTS = {
  fov: 40,
  near: 0.1,
  far: 50,
  position: [0, 1.2, 6] as [number, number, number],
};

/* ─── Pointer parallax ranges (desktop) ─── */
export const POINTER_RANGES = {
  sceneTiltY: 0.096,
  sceneTiltX: 0.042,
  artifactTiltY: 0.05,
  artifactTiltX: 0.028,
  cameraPointerX: 0.02,
  cameraPointerY: 0.015,
};

/* ─── Lighting ─── */
export const LIGHTING = {
  ambient: { intensity: 0.55 },
  key: {
    intensity: 2.4,
    color: '#fff4e0',
    position: [3, 5, 4] as [number, number, number],
    shadowMapSize: 512,
    shadowBias: -0.0005,
  },
  fill: {
    intensity: 0.5,
    color: '#e8eeff',
    position: [-3, 2, 2] as [number, number, number],
  },
  rim: {
    intensity: 0.7,
    color: '#c8d8ff',
    position: [-2, 3, -3] as [number, number, number],
  },
};

/* ─── Environment ─── */
export const ENVIRONMENT = {
  preset: 'studio' as const,
  intensity: 0.4,
  backgroundBlurriness: 1,
  background: false,
  sceneBackground: '#f5f0e8',
  sceneBackgroundDark: '#121826',
};

/* ─── Phase scene states (extended with per-group motion) ─── */
export interface PhaseSceneState {
  /* Camera rig */
  cameraZ: number;
  cameraY: number;
  /* Pointer response */
  sceneTiltMultiplier: number;
  /* Hero artifact group */
  heroArtifactY: number;
  heroArtifactScale: number;
  /* Support group */
  supportY: number;
  supportSpread: number;
  /* Atmosphere */
  atmosphereOpacity: number;
  /* Orb emissive */
  orbGlow: number;
}

export const PHASE_SCENE: Record<DossierPhaseId, PhaseSceneState> = {
  closed: {
    cameraZ: 6.0,
    cameraY: 1.2,
    sceneTiltMultiplier: 1.0,
    heroArtifactY: 0,
    heroArtifactScale: 1.0,
    supportY: 0,
    supportSpread: 0,
    atmosphereOpacity: 0.6,
    orbGlow: 0.3,
  },
  open: {
    cameraZ: 5.4,
    cameraY: 1.1,
    sceneTiltMultiplier: 1.2,
    heroArtifactY: 0,
    heroArtifactScale: 1.05,
    supportY: 0.05,
    supportSpread: 0.02,
    atmosphereOpacity: 0.8,
    orbGlow: 0.6,
  },
  flight: {
    cameraZ: 4.8,
    cameraY: 1.4,
    sceneTiltMultiplier: 0.8,
    heroArtifactY: 0.15,
    heroArtifactScale: 0.95,
    supportY: 0.2,
    supportSpread: 0.06,
    atmosphereOpacity: 1.0,
    orbGlow: 1.0,
  },
  close: {
    cameraZ: 5.2,
    cameraY: 1.0,
    sceneTiltMultiplier: 0.6,
    heroArtifactY: 0.08,
    heroArtifactScale: 0.9,
    supportY: 0.1,
    supportSpread: 0.03,
    atmosphereOpacity: 0.7,
    orbGlow: 0.5,
  },
  handoff: {
    cameraZ: 6.5,
    cameraY: 1.5,
    sceneTiltMultiplier: 0.3,
    heroArtifactY: 0.3,
    heroArtifactScale: 0.8,
    supportY: 0.25,
    supportSpread: 0.08,
    atmosphereOpacity: 0.3,
    orbGlow: 0.2,
  },
};

/** Lerp speed for scene transitions per frame */
export const SCENE_LERP = 0.06;
