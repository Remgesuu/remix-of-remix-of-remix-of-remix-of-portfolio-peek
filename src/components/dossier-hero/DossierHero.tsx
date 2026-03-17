import { useRef, useEffect, useState } from 'react';
import { SCROLL_RUNWAY_VH } from './dossier-hero.config';
import { useDossierProgress } from './use-dossier-progress';
import { useFrameLoader } from './use-frame-loader';
import { HeroStageWebGL } from './HeroStageWebGL';
import { BookSequenceCanvas } from './BookSequenceCanvas';
import { HeroOverlay } from './HeroOverlay';
import { SpatialLayer } from './SpatialLayer';
import { ScrollProgressBar } from './ScrollProgressBar';
import { EnterScreen } from '../experience/EnterScreen';
import { useExperience } from '../experience/ExperienceProvider';
import { useSound } from '@/hooks/use-sound';

const ZIP_URL = '/frames/dossier-sequence.zip';

export function DossierHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { progress, phase, localProgress } = useDossierProgress(containerRef);
  const { webglAvailable, setHeroActive } = useExperience();
  const sound = useSound();
  const prevPhaseRef = useRef(phase);

  const [glbReady, setGlbReady] = useState(false);
  const [glbFailed, setGlbFailed] = useState(false);
  useEffect(() => {
    if (webglAvailable) {
      const t = setTimeout(() => setGlbReady(true), 600);
      return () => clearTimeout(t);
    }
  }, [webglAvailable]);

  // Use WebGL path only if available and GLB didn't fail critical validation
  const useWebGL = webglAvailable && !glbFailed;

  // Fallback: ZIP frame loader for non-WebGL path or GLB failure
  const { frames, loaded: framesLoaded, progress: frameLoadProgress } = useFrameLoader(
    useWebGL ? '' : ZIP_URL
  );

  const loaded = useWebGL ? glbReady : framesLoaded;
  const loadProgress = useWebGL ? (glbReady ? 1 : 0.5) : frameLoadProgress;

  const [sceneVisible, setSceneVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setSceneVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const heroActive = sceneVisible && phase !== 'handoff';

  useEffect(() => {
    setHeroActive(heroActive);
    sound.setAmbient(heroActive);
  }, [heroActive, setHeroActive, sound]);

  // Phase change sound
  useEffect(() => {
    if (phase !== prevPhaseRef.current) {
      prevPhaseRef.current = phase;
      if (phase !== 'closed') {
        sound.play('transition_down');
      }
    }
  }, [phase, sound]);

  return (
    <>
      <EnterScreen loadProgress={loadProgress} loaded={loaded} />
      <ScrollProgressBar progress={progress} />
      <div
        ref={containerRef}
        className="relative"
        style={{ height: `${SCROLL_RUNWAY_VH}vh` }}
      >
        {/* Sticky viewport — pinned while scrolling through runway */}
        <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ background: 'hsl(var(--background))' }}>

          {useWebGL ? (
            <HeroStageWebGL
              progress={progress}
              phase={phase}
              localProgress={localProgress}
              onCriticalMissing={() => setGlbFailed(true)}
            />
          ) : (
            <>
              <div
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(ellipse 80% 70% at 50% 45%, hsl(var(--dossier-warm)), hsl(var(--background)))',
                }}
              />
              <BookSequenceCanvas progress={progress} phase={phase} frames={frames} loaded={framesLoaded} />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse 68% 63% at 50% 50%, transparent 58%, hsl(var(--background)) 92%)',
                }}
              />
            </>
          )}

          <SpatialLayer phase={phase} localProgress={localProgress} progress={progress} />
          <HeroOverlay phase={phase} localProgress={localProgress} progress={progress} />
        </div>
      </div>

      {/* Bridge gradient — soft dissolve from hero into first section */}
      <div
        className="relative -mt-px pointer-events-none"
        style={{
          height: '20vh',
          background: 'linear-gradient(to bottom, hsl(var(--background)) 0%, transparent 100%)',
        }}
      />
    </>
  );
}
