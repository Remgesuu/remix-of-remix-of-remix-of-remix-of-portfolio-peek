import type { DossierPhaseId } from './dossier-hero.types';

/* ─── GLB Asset ─── */
export const GLB_URL = '/hero/level-react-draco.glb';

/* ─── Node name lookup: Blender name → semantic key ─── */
export const NODE_MAP = {
  Level: 'levelBase',
  Sudo: 'sudo',
  SudoHead: 'sudoHead',
  Cactus: 'cactus',
  'Camera.001': 'cameraProp',
  Pyramid: 'pyramid',
  React: 'reactLogo',
} as const;

export type SemanticNodeKey = (typeof NODE_MAP)[keyof typeof NODE_MAP];

/* ─── Group assignments ─── */
export type SceneGroupId = 'heroArtifact' | 'support' | 'atmosphere';

export const GROUP_ASSIGNMENT: Record<SemanticNodeKey, SceneGroupId> = {
  levelBase: 'heroArtifact',
  sudo: 'heroArtifact',
  sudoHead: 'heroArtifact',
  cameraProp: 'support',
  cactus: 'support',
  pyramid: 'support',
  reactLogo: 'atmosphere',
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
  levelBase:   { receiveShadow: true },
  sudo:        { castShadow: true, float: { amp: 0.04, speed: 0.4 } },
  sudoHead:    { castShadow: true, pointerTilt: true },
  cameraProp:  { castShadow: true, pointerShift: { x: 0.05, y: 0.03 } },
  cactus:      { castShadow: true, float: { amp: 0.02, speed: 0.25 } },
  pyramid:     { castShadow: true, float: { amp: 0.03, speed: 0.3 } },
  reactLogo:   { castShadow: true, float: { amp: 0.05, speed: 0.35 } },
};

/* ─── Camera defaults ─── */
export const CAMERA_DEFAULTS = {
  fov: 40,
  near: 0.1,
  far: 50,
  position: [0, 3, 8] as [number, number, number],
};

/* ─── Camera fly-through spline (CatmullRomCurve3 control points) ─── */
export const CAMERA_CURVE_POINTS: [number, number, number][] = [
  [0, 3, 8],       // front (closed)
  [3, 2.5, 6],     // right-front
  [5, 3, 0],       // right side
  [3, 3.5, -4],    // right-back
  [0, 4, -5],      // back
  [-3, 3.5, -2],   // left-back
  [-4, 3, 3],      // left side
  [0, 4, 9],       // pull back high (handoff)
];

export const LOOKAT_CURVE_POINTS: [number, number, number][] = [
  [0,     1.0,  0    ],
  [0.1,   0.9,  0.05 ],
  [0.15,  0.8, -0.1  ],
  [0.05,  1.0, -0.05 ],
  [-0.1,  1.2,  0.1  ],
  [-0.15, 1.1,  0.05 ],
  [-0.05, 0.9,  0    ],
  [0,     1.0,  0    ],
];

/* ─── Fisheye config ─── */
export const FISHEYE_CONFIG = {
  startProgress: 0.84,
  maxIntensity: 4,
};

/* ─── Pointer parallax ranges (desktop) ─── */
export const POINTER_RANGES = {
  sceneTiltY: 0.096,
  sceneTiltX: 0.042,
  artifactTiltY: 0.05,
  artifactTiltX: 0.028,
  cameraPointerX: 0.15,
  cameraPointerY: 0.1,
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
  preset: 'city' as const,
  intensity: 0.4,
  backgroundBlurriness: 1,
  background: false,
  sceneBackground: '#f5f0e8',
  sceneBackgroundDark: '#121826',
};

/* ─── Phase scene states (object animations only — camera is spline-driven) ─── */
export interface PhaseSceneState {
  sceneTiltMultiplier: number;
  heroArtifactY: number;
  heroArtifactScale: number;
  supportY: number;
  supportSpread: number;
  atmosphereOpacity: number;
  orbGlow: number;
}

export const PHASE_SCENE: Record<DossierPhaseId, PhaseSceneState> = {
  closed: {
    sceneTiltMultiplier: 1.0,
    heroArtifactY: 0,
    heroArtifactScale: 1.0,
    supportY: 0,
    supportSpread: 0,
    atmosphereOpacity: 0.6,
    orbGlow: 0.3,
  },
  open: {
    sceneTiltMultiplier: 1.2,
    heroArtifactY: 0,
    heroArtifactScale: 1.05,
    supportY: 0.05,
    supportSpread: 0.02,
    atmosphereOpacity: 0.8,
    orbGlow: 0.6,
  },
  flight: {
    sceneTiltMultiplier: 0.8,
    heroArtifactY: 0.15,
    heroArtifactScale: 0.95,
    supportY: 0.2,
    supportSpread: 0.06,
    atmosphereOpacity: 1.0,
    orbGlow: 1.0,
  },
  close: {
    sceneTiltMultiplier: 0.6,
    heroArtifactY: 0.08,
    heroArtifactScale: 0.9,
    supportY: 0.1,
    supportSpread: 0.03,
    atmosphereOpacity: 0.7,
    orbGlow: 0.5,
  },
  handoff: {
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
