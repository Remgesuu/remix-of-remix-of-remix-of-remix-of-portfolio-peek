import { useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';

/**
 * Smooth scroll via Lenis. Always call this hook unconditionally.
 * The `enabled` flag controls whether Lenis is active, but the hook
 * itself is always invoked to maintain stable hook count.
 */
export function useSmoothScroll(enabled: boolean) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!enabled) {
      // Destroy any existing instance when disabled
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1 - Math.pow(2, -10 * t)),
      touchMultiplier: 0,
      infinite: false,
    });

    lenisRef.current = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [enabled]);

  /** Drive Lenis from an external rAF — call once per frame */
  const tick = useCallback((time: number) => {
    lenisRef.current?.raf(time);
  }, []);

  /** Smooth-scroll to a target (selector string or element) */
  const scrollTo = useCallback((target: string | HTMLElement, options?: { offset?: number; duration?: number }) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        offset: options?.offset ?? 0,
        duration: options?.duration ?? 1.2,
      });
    } else {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return { tick, scrollTo };
}
