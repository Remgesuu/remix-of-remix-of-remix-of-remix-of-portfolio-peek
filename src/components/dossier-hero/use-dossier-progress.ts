import { useEffect, useRef, useState, useCallback } from 'react';
import { PHASES } from './dossier-hero.config';
import type { DossierProgressState, DossierPhaseId } from './dossier-hero.types';

function getPhase(progress: number): { phase: DossierPhaseId; localProgress: number } {
  for (const p of PHASES) {
    if (progress >= p.range[0] && progress < p.range[1]) {
      const local = (progress - p.range[0]) / (p.range[1] - p.range[0]);
      return { phase: p.id, localProgress: Math.min(Math.max(local, 0), 1) };
    }
  }
  return { phase: 'handoff', localProgress: 1 };
}

/**
 * Scroll-driven progress for the dossier hero.
 * Uses a passive scroll listener — works with both Lenis (smooth) and native scroll.
 * No internal rAF loop; Lenis triggers real scroll events that fire this listener.
 */
export function useDossierProgress(containerRef: React.RefObject<HTMLElement | null>): DossierProgressState {
  const [state, setState] = useState<DossierProgressState>({
    progress: 0,
    phase: 'closed',
    localProgress: 0,
  });
  const prev = useRef(-1);

  const calculate = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scrollable = rect.height - window.innerHeight;
    if (scrollable <= 0) return;
    const raw = Math.min(Math.max(-rect.top / scrollable, 0), 1);

    if (Math.abs(raw - prev.current) > 0.001) {
      prev.current = raw;
      const { phase, localProgress } = getPhase(raw);
      setState({ progress: raw, phase, localProgress });
    }
  }, [containerRef]);

  useEffect(() => {
    // Listen to scroll — Lenis fires real scroll events on the window
    window.addEventListener('scroll', calculate, { passive: true });
    // Initial calculation
    calculate();
    return () => window.removeEventListener('scroll', calculate);
  }, [calculate]);

  return state;
}
