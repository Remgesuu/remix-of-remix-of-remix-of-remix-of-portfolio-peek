import type { DossierPhaseId } from './dossier-hero.types';
import { DOSSIER_PHASE_CONTENT } from './dossier-hero.content';
import { useExperience } from '@/components/experience/ExperienceProvider';
import { usePointerParallax } from '@/hooks/use-pointer-parallax';

const PARALLAX_PX = 4;

interface Props {
  phase: DossierPhaseId;
  localProgress: number;
  progress: number;
}

export function SpatialLayer({ phase, localProgress }: Props) {
  const c = DOSSIER_PHASE_CONTENT;
  const { pointerRef, isTouch, reducedMotion, heroActive } = useExperience();

  const noParallax = isTouch || reducedMotion || !heroActive;
  const containerRef = usePointerParallax(pointerRef, PARALLAX_PX, noParallax);

  const showWhispers = phase === 'open' || (phase === 'flight' && localProgress < 0.3);
  const showLabels = phase === 'flight';

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none select-none z-[5]"
    >
      {showWhispers && c.open.whispers.map((w, i) => (
        <span
          key={w}
          className="absolute text-xs font-sans text-dossier-whisper transition-opacity duration-200"
          style={{
            opacity: phase === 'open' ? Math.min(localProgress * 1.5, 0.35) : 0.2,
            top: `${35 + i * 30}%`,
            [i % 2 === 0 ? 'left' : 'right']: '5%',
            transitionDelay: `${i * 60}ms`,
          }}
        >
          {w}
        </span>
      ))}

      {showLabels && c.flight.spatialLabels.map((label, i) => (
        <span
          key={label}
          className="absolute text-[11px] tracking-[0.15em] uppercase font-sans text-dossier-whisper transition-opacity duration-200"
          style={{
            opacity: Math.min(localProgress * 1.5, 0.4),
            top: `${25 + i * 22}%`,
            right: '8%',
            transitionDelay: `${i * 60}ms`,
          }}
        >
          {label}
        </span>
      ))}
    </div>
  );
}
