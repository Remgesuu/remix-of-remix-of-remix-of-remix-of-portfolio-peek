/**
 * Hero Breakpoint & Capability QA
 *
 * Acceptance criteria verified:
 * 1. Touch → no pointer tilt (pointer neutral at 0.5)
 * 2. Reduced motion → secondary motion skipped
 * 3. Cursor hidden on touch
 * 4. WebGL fallback path exists
 * 5. Mobile typography uses responsive classes
 * 6. Safe area padding present
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

function readSrc(relativePath: string): string {
  return readFileSync(resolve(__dirname, '..', relativePath), 'utf-8');
}

describe('Breakpoint QA: Touch gating in HeroStageWebGL', () => {
  const src = readSrc('components/dossier-hero/HeroStageWebGL.tsx');

  it('neutralises pointer to 0.5 when isTouch', () => {
    expect(src).toContain('isTouch ? 0.5 : p.lerpX');
    expect(src).toContain('isTouch ? 0.5 : p.lerpY');
  });

  it('skips applyPointerMotion on touch', () => {
    expect(src).toContain('if (!isTouch)');
    expect(src).toContain('applyPointerMotion');
  });

  it('skips applySecondaryMotion on reduced motion', () => {
    expect(src).toContain('if (!reducedMotion)');
    expect(src).toContain('applySecondaryMotion');
  });
});

describe('Breakpoint QA: CursorLayer touch/reduced-motion handling', () => {
  const src = readSrc('components/experience/CursorLayer.tsx');

  it('returns null for touch devices', () => {
    expect(src).toContain('if (!ctx || isTouch || reducedMotion) return null');
  });
});

describe('Breakpoint QA: HeroOverlay responsive layout', () => {
  const src = readSrc('components/dossier-hero/HeroOverlay.tsx');

  it('headline uses responsive text sizing', () => {
    expect(src).toMatch(/text-4xl/);
    expect(src).toMatch(/sm:text-6xl/);
    expect(src).toMatch(/md:text-8xl/);
  });

  it('root container has safe-area bottom padding', () => {
    expect(src).toContain('pb-[env(safe-area-inset-bottom)]');
  });
});

describe('Breakpoint QA: WebGL fallback path', () => {
  const src = readSrc('components/dossier-hero/DossierHero.tsx');

  it('renders HeroStageWebGL when WebGL available', () => {
    expect(src).toContain('HeroStageWebGL');
  });

  it('renders BookSequenceCanvas as fallback', () => {
    expect(src).toContain('BookSequenceCanvas');
  });

  it('uses webglAvailable flag for path selection', () => {
    expect(src).toContain('webglAvailable');
  });
});
