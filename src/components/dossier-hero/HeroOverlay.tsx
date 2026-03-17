import { useState, useEffect } from 'react';
import type { DossierPhaseId } from './dossier-hero.types';
import { DOSSIER_PHASE_CONTENT } from './dossier-hero.content';
import { ProofStrip } from './ProofStrip';
import { FlagshipTeaser } from './FlagshipTeaser';
import { FLAGSHIP_FADE_START } from './dossier-hero.config';
import { useExperience } from '@/components/experience/ExperienceProvider';
import { useCursorHover } from '@/hooks/use-cursor-hover';
import { usePointerParallax } from '@/hooks/use-pointer-parallax';

const SUBTLE_PX = 3;

interface Props {
  phase: DossierPhaseId;
  localProgress: number;
  progress: number;
}

export function HeroOverlay({ phase, localProgress, progress }: Props) {
  const c = DOSSIER_PHASE_CONTENT;
  const { entered, pointerRef, isTouch, reducedMotion, heroActive } = useExperience();
  const cursorHover = useCursorHover();

  const noParallax = isTouch || reducedMotion || !heroActive;
  const subtleRef = usePointerParallax(pointerRef, SUBTLE_PX, noParallax);

  const [textRevealed, setTextRevealed] = useState(false);

  useEffect(() => {
    if (entered) {
      const t = setTimeout(() => setTextRevealed(true), 200);
      return () => clearTimeout(t);
    }
  }, [entered]);

  const flagshipOpacity = progress < FLAGSHIP_FADE_START ? 0
    : progress < 0.62 ? (progress - FLAGSHIP_FADE_START) / 0.07
    : phase === 'close' ? 1
    : phase === 'handoff' ? 1 - localProgress
    : 0;

  const proofOpacity = phase === 'flight'
    ? (progress < FLAGSHIP_FADE_START ? 1 : 1 - ((progress - FLAGSHIP_FADE_START) / 0.07))
    : 0;

  const proofVisible = proofOpacity > 0.1;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none pb-[env(safe-area-inset-bottom)]">
      {/* ── CLOSED: Elliptical scrim + floating text ── */}
      <div
        className="relative text-center transition-all duration-300 max-w-xl px-6"
        style={{
          opacity: (textRevealed && phase === 'closed') ? 1 : phase === 'open' ? 1 - localProgress * 1.5 : 0,
          transform: phase === 'closed' ? (textRevealed ? 'translateY(0)' : 'translateY(8px)') : `translateY(${-localProgress * 30}px)`,
        }}
      >
        {/* Elliptical tonal scrim */}
        <div
          className="absolute -inset-x-16 -inset-y-12 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 140% 160% at 50% 48%, hsl(var(--background) / 0.7) 0%, hsl(var(--background) / 0.2) 50%, transparent 80%)',
          }}
        />

        {/* Text content */}
        <div
          className="relative px-8 py-6"
          style={{
            textShadow: '0 0 40px hsl(var(--background)), 0 1px 2px hsl(var(--background) / 0.5)',
          }}
        >
          <p className="text-xs tracking-[0.25em] uppercase text-foreground/70 mb-3 font-sans">
            {c.closed.eyebrow}
          </p>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif text-foreground mb-4 leading-none tracking-display">
            {c.closed.headline}
          </h1>
          <p className="text-base md:text-lg text-foreground/60 font-sans leading-relaxed mb-6">
            {c.closed.roleStatement}
          </p>
          <a
            href="/resume"
            className="inline-flex items-center gap-2 px-5 py-3 text-sm font-sans font-medium border border-foreground/20 rounded-md text-foreground bg-transparent hover:bg-foreground hover:text-background transition-colors pointer-events-auto"
            {...cursorHover}
          >
            {c.closed.cta.label}
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>

      {/* ── OPEN: Text-shadow only ── */}
      <div
        ref={subtleRef}
        className="absolute inset-0 flex items-center justify-center transition-all duration-300"
        style={{
          opacity: phase === 'open' ? Math.min(localProgress * 2, 1) : phase === 'flight' ? 1 - localProgress * 2 : 0,
        }}
      >
        <p
          className="text-lg md:text-xl text-center text-foreground/70 font-sans max-w-md px-8 py-4 leading-relaxed"
          style={{
            textShadow: '0 0 40px hsl(var(--background)), 0 0 80px hsl(var(--background) / 0.5)',
          }}
        >
          {c.open.expansion}
        </p>
      </div>

      {/* ── FLIGHT: Proof strip ── */}
      <div
        className="absolute bottom-[8%] sm:bottom-[15%] left-0 right-0 transition-all duration-200"
        style={{ opacity: proofOpacity }}
      >
        <ProofStrip items={c.flight.proofStrip} visible={proofVisible} />
      </div>

      {/* ── FLIGHT→CLOSE: Flagship teaser ── */}
      <div
        className="absolute bottom-[6%] sm:bottom-[12%] left-0 right-0 flex justify-center transition-all duration-200"
        style={{
          opacity: flagshipOpacity,
          transform: `translateY(${(1 - flagshipOpacity) * 16}px)`,
        }}
      >
        <FlagshipTeaser data={c.flagship} subtleTransform="" />
      </div>

      {/* ── HANDOFF: CTAs + scroll cue ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-300"
        style={{
          opacity: phase === 'handoff' ? Math.min(localProgress * 2, 1) : 0,
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, hsl(var(--background) / 0.25) 0%, transparent 70%)',
          }}
        />

        <div className="relative flex flex-col sm:flex-row items-center gap-3 pointer-events-auto">
          {c.handoff.ctas.map((cta, i) => (
            <a
              key={cta.label}
              href={cta.href}
              className="px-5 py-3 text-sm font-sans font-medium border border-foreground/20 rounded-md text-foreground bg-transparent hover:bg-foreground hover:text-background transition-all duration-spatial"
              style={{
                transitionDelay: phase === 'handoff' ? `${i * 120}ms` : '0ms',
                transitionTimingFunction: 'var(--ease-expo-out)',
                opacity: phase === 'handoff' ? 1 : 0,
                transform: phase === 'handoff' ? 'translateY(0)' : 'translateY(8px)',
              }}
              {...cursorHover}
            >
              {cta.label}
            </a>
          ))}
        </div>

        <div
          className="relative mt-8 flex flex-col items-center gap-1 transition-all duration-spatial"
          style={{
            opacity: (phase === 'handoff' && localProgress > 0.5) ? Math.min((localProgress - 0.5) * 4, 0.6) : 0,
            transform: (phase === 'handoff' && localProgress > 0.5) ? 'translateY(0)' : 'translateY(-4px)',
            transitionTimingFunction: 'var(--ease-expo-out)',
          }}
        >
          <span className="text-[10px] tracking-[0.2em] uppercase text-foreground/40 font-sans">
            Scroll
          </span>
          <span className="text-foreground/30 text-sm animate-[fade-in_1.5s_ease-in-out_infinite_alternate]">↓</span>
        </div>
      </div>
    </div>
  );
}
