import { useRef, useEffect, useContext, useCallback } from 'react';
import { ExperienceContext } from './ExperienceProvider';

const SIZE = { default: 24, hero: 36, hover: 48, drag: 32, hidden: 0 };
const GLOW_SIZE = 56;
const DOT_SIZE = 4;

export function CursorLayer() {
  const ctx = useContext(ExperienceContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewport = useRef({ w: typeof window !== 'undefined' ? window.innerWidth : 1, h: typeof window !== 'undefined' ? window.innerHeight : 1 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    const update = () => {
      viewport.current.w = window.innerWidth;
      viewport.current.h = window.innerHeight;
    };
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  const isTouch = ctx?.isTouch ?? false;
  const reducedMotion = ctx?.reducedMotion ?? false;

  // Set data attribute for system cursor hiding
  useEffect(() => {
    if (isTouch || reducedMotion || !ctx) return;
    document.documentElement.dataset.cursorVisible = 'true';
    return () => { delete document.documentElement.dataset.cursorVisible; };
  }, [isTouch, reducedMotion]); // eslint-disable-line react-hooks/exhaustive-deps

  // rAF loop — drive transform from pointerRef, zero re-renders
  const tick = useCallback(() => {
    if (!ctx || !containerRef.current) {
      rafId.current = requestAnimationFrame(tick);
      return;
    }
    const p = ctx.pointerRef.current;
    const x = p.lerpX * viewport.current.w;
    const y = p.lerpY * viewport.current.h;
    containerRef.current.style.transform = `translate(${x}px, ${y}px)`;
    rafId.current = requestAnimationFrame(tick);
  }, [ctx]);

  useEffect(() => {
    if (isTouch || reducedMotion || !ctx) return;
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [isTouch, reducedMotion, ctx, tick]);

  if (!ctx || isTouch || reducedMotion) return null;

  const { cursorMode, heroActive, menuOpen } = ctx;

  // Derive ring size
  const ringSize = cursorMode === 'hidden' ? 0
    : cursorMode === 'hover' ? SIZE.hover
    : cursorMode === 'drag' ? SIZE.drag
    : heroActive ? SIZE.hero
    : SIZE.default;

  const isHidden = cursorMode === 'hidden';

  // Colors
  const ringBorder = heroActive
    ? 'hsl(var(--dossier-gold) / 0.5)'
    : menuOpen
      ? 'hsl(var(--background) / 0.7)'
      : 'hsl(var(--foreground) / 0.5)';

  const dotColor = heroActive
    ? 'hsl(var(--dossier-gold))'
    : 'hsl(var(--foreground) / 0.7)';

  const borderWidth = cursorMode === 'hover' ? 2 : 1;

  const transition = 'width 260ms cubic-bezier(.16,1,.3,1), height 260ms cubic-bezier(.16,1,.3,1), border 260ms ease, opacity 260ms ease';

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
      style={{ willChange: 'transform' }}
    >
      {/* Soft glow halo — hero only */}
      <div
        style={{
          position: 'absolute',
          width: GLOW_SIZE,
          height: GLOW_SIZE,
          top: -GLOW_SIZE / 2,
          left: -GLOW_SIZE / 2,
          borderRadius: '50%',
          background: 'radial-gradient(circle, hsl(var(--dossier-gold) / 0.25) 0%, transparent 70%)',
          opacity: heroActive && !isHidden ? 0.15 : 0,
          transition: 'opacity 300ms ease',
        }}
      />

      {/* Outer ring */}
      <div
        style={{
          position: 'absolute',
          width: ringSize,
          height: ringSize,
          top: -ringSize / 2,
          left: -ringSize / 2,
          borderRadius: '50%',
          border: `${borderWidth}px solid ${ringBorder}`,
          mixBlendMode: heroActive ? undefined : 'difference',
          transition,
          transform: `scale(${isHidden ? 0 : 1})`,
        }}
      />

      {/* Center dot */}
      <div
        style={{
          position: 'absolute',
          width: DOT_SIZE,
          height: DOT_SIZE,
          top: -DOT_SIZE / 2,
          left: -DOT_SIZE / 2,
          borderRadius: '50%',
          backgroundColor: dotColor,
          opacity: isHidden ? 0 : 1,
          transition: 'background-color 260ms ease, opacity 260ms ease',
        }}
      />
    </div>
  );
}
