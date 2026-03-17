import { useRef, useEffect, useCallback } from 'react';
import type { PointerRef } from '@/components/experience/experience.types';

/**
 * Drives a CSS `transform: translate(Xpx, Ypx)` on a container ref
 * from the mutable pointerRef, entirely via rAF — zero React re-renders.
 */
export function usePointerParallax(
  pointerRef: React.RefObject<PointerRef>,
  maxPx: number,
  disabled: boolean,
) {
  const elRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number>(0);

  const tick = useCallback(() => {
    if (elRef.current && !disabled) {
      const p = pointerRef.current;
      const tx = (p.lerpX - 0.5) * 2 * maxPx;
      const ty = (p.lerpY - 0.5) * 2 * maxPx;
      elRef.current.style.transform = `translate(${tx}px, ${ty}px)`;
    }
    rafId.current = requestAnimationFrame(tick);
  }, [pointerRef, maxPx, disabled]);

  useEffect(() => {
    if (disabled) return;
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [disabled, tick]);

  return elRef;
}
