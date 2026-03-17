import { useCallback, useEffect, useRef, useState } from 'react';
import type { CursorMode, ExperienceContextValue, ExperienceState, PointerRef } from './experience.types';
import { useSmoothScroll } from '@/hooks/use-smooth-scroll';
import { getPerformanceMetrics } from '@/lib/performance';

/* ── Capability detection (runs once) ── */

function detectWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    const ok = !!gl;
    if (gl && 'getExtension' in gl) {
      (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context')?.loseContext();
    }
    c.width = 0;
    c.height = 0;
    return ok;
  } catch {
    return false;
  }
}

function detectTouch(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

function detectReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ── Hook ── */

const LERP_FACTOR = 0.08;

const initialState: ExperienceState = {
  entered: false,
  menuOpen: false,
  cursorMode: 'default',
  isTouch: false,
  reducedMotion: false,
  webglAvailable: false,
  heroActive: false,
  performanceTier: 'medium', // Default to medium, updated on mount
};

export function useExperienceRuntime(): ExperienceContextValue {
  const [state, setState] = useState<ExperienceState>(initialState);

  const pointerRef = useRef<PointerRef>({ x: 0.5, y: 0.5, lerpX: 0.5, lerpY: 0.5 });
  const rafId = useRef<number>(0);
  const reducedRef = useRef(false);
  const capsDetected = useRef(false);

  // Smooth scroll — always called, enabled flag controls behavior
  const smoothEnabled = !state.isTouch && !state.reducedMotion;
  const { tick: lenisTick, scrollTo } = useSmoothScroll(smoothEnabled);

  /* ── Capability detection (once) ── */
  useEffect(() => {
    if (capsDetected.current) return;
    capsDetected.current = true;

    const isTouch = detectTouch();
    const reducedMotion = detectReducedMotion();
    const webglAvailable = detectWebGL();
    const performanceTier = getPerformanceMetrics().tier;
    reducedRef.current = reducedMotion;

    setState((s) => ({ ...s, isTouch, reducedMotion, webglAvailable, performanceTier }));

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => {
      reducedRef.current = e.matches;
      setState((s) => ({ ...s, reducedMotion: e.matches }));
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  /* ── Pointer tracking (raw values → ref only, no setState) ── */
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      pointerRef.current.x = e.clientX / window.innerWidth;
      pointerRef.current.y = e.clientY / window.innerHeight;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, []);

  /* ── Unified rAF tick — drives Lenis + pointer lerp (NO setState) ── */
  useEffect(() => {
    const tick = (time: number) => {
      // 1. Drive Lenis smooth scroll
      lenisTick(time);

      // 2. Pointer lerp — mutate ref directly
      const p = pointerRef.current;
      if (!reducedRef.current) {
        p.lerpX += (p.x - p.lerpX) * LERP_FACTOR;
        p.lerpY += (p.y - p.lerpY) * LERP_FACTOR;
      } else {
        p.lerpX = p.x;
        p.lerpY = p.y;
      }

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [lenisTick]);

  /* ── Actions ── */
  const setEntered = useCallback((v: boolean) => setState((s) => ({ ...s, entered: v })), []);
  const setMenuOpen = useCallback((v: boolean) => setState((s) => ({ ...s, menuOpen: v })), []);
  const setCursorMode = useCallback((v: CursorMode) => setState((s) => ({ ...s, cursorMode: v })), []);
  const setHeroActive = useCallback((v: boolean) => setState((s) => ({ ...s, heroActive: v })), []);

  return {
    ...state,
    pointerRef,
    setEntered,
    setMenuOpen,
    setCursorMode,
    setHeroActive,
    scrollTo,
  };
}
