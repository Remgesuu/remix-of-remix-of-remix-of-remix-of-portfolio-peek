export type CursorMode = 'default' | 'hover' | 'drag' | 'hidden';

/** Mutable ref-based pointer data — read without triggering re-renders */
export interface PointerRef {
  x: number;
  y: number;
  lerpX: number;
  lerpY: number;
}

export interface ExperienceState {
  /** User has passed the enter/intro gate */
  entered: boolean;
  /** Global menu overlay is open */
  menuOpen: boolean;
  /** Current cursor visual mode */
  cursorMode: CursorMode;

  /* ── Capability flags (set once on mount) ── */
  isTouch: boolean;
  reducedMotion: boolean;
  webglAvailable: boolean;

  /** Hero scroll section is currently in viewport */
  heroActive: boolean;
}

export interface ExperienceActions {
  setEntered: (v: boolean) => void;
  setMenuOpen: (v: boolean) => void;
  setCursorMode: (v: CursorMode) => void;
  setHeroActive: (v: boolean) => void;
  /** Smooth-scroll to a target (CSS selector or element) */
  scrollTo: (target: string | HTMLElement, options?: { offset?: number; duration?: number }) => void;
}

export type ExperienceContextValue = ExperienceState & ExperienceActions & {
  /** Mutable pointer ref — read in rAF loops, never triggers re-renders */
  pointerRef: React.RefObject<PointerRef>;
};
