export type DossierPhaseId = 'closed' | 'open' | 'flight' | 'close' | 'handoff';

export interface PhaseDefinition {
  id: DossierPhaseId;
  range: [number, number];
}

export interface ProofItem {
  value: string;
  label: string;
}

export interface CTAItem {
  label: string;
  href: string;
}

export interface FlagshipData {
  title: string;
  outcome: string;
  context: string;
  cta: string;
  href: string;
}

export interface DossierPhaseContent {
  closed: {
    eyebrow: string;
    headline: string;
    roleStatement: string;
    cta: CTAItem;
  };
  open: {
    expansion: string;
    whispers: string[];
  };
  flight: {
    proofStrip: ProofItem[];
    spatialLabels: string[];
  };
  flagship: FlagshipData;
  handoff: {
    ctas: CTAItem[];
  };
}

export interface DossierProgressState {
  /** 0–1 overall scroll progress */
  progress: number;
  /** Current phase id */
  phase: DossierPhaseId;
  /** 0–1 progress within the current phase */
  localProgress: number;
}

export interface BookManifest {
  /** Total frame count */
  totalFrames: number;
  /** URL pattern with {index} placeholder, e.g. "/frames/frame-{index}.webp" */
  urlPattern: string;
  /** Zero-pad width for index, e.g. 4 → "0001" */
  padWidth: number;
  /** Poster frame index to show immediately */
  posterIndex: number;
}
