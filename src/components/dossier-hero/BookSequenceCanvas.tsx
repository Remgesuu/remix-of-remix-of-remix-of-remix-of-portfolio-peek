import { useRef, useEffect, useCallback } from 'react';
import type { DossierPhaseId } from './dossier-hero.types';
import { ROTATION_RANGE } from './dossier-hero.config';

interface Props {
  progress: number;
  phase: DossierPhaseId;
  frames: HTMLImageElement[];
  loaded: boolean;
}

/**
 * Canvas renderer for the book frame sequence.
 * Draws current frame in a rAF loop, separate from scroll handler.
 * Applies radial mask and subtle rotation.
 */
export function BookSequenceCanvas({ progress, frames, loaded }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawnFrame = useRef(-1);
  const currentFrame = useRef(0);

  // Update target frame index from progress
  const totalFrames = frames?.length ?? 0;
  if (totalFrames > 0) {
    currentFrame.current = Math.min(
      Math.floor(progress * (totalFrames - 1)),
      totalFrames - 1
    );
  }

  // Draw loop — only redraws when frame changes
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !loaded || totalFrames === 0) return;

    const idx = currentFrame.current;
    if (idx === drawnFrame.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = frames[idx];
    if (!img) return;

    // Set canvas size to match frame (only once or on resize)
    if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    drawnFrame.current = idx;
  }, [frames, loaded, totalFrames]);

  // rAF loop
  useEffect(() => {
    if (!loaded) return;
    let rafId = 0;
    const tick = () => {
      draw();
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [loaded, draw]);

  // Draw poster frame immediately when loaded
  useEffect(() => {
    if (loaded && frames.length > 0) {
      currentFrame.current = 0;
      drawnFrame.current = -1;
      draw();
    }
  }, [loaded, frames, draw]);

  const rotation = ROTATION_RANGE[0] + progress * (ROTATION_RANGE[1] - ROTATION_RANGE[0]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <canvas
        ref={canvasRef}
        className="max-w-[90vw] max-h-[80vh] md:max-w-[85vw] md:max-h-[85vh] w-auto h-auto"
        style={{
          transform: `rotate(${rotation}deg) scale(1.05)`,
          transition: 'transform 0.1s linear',
          maskImage: 'radial-gradient(ellipse 72% 68% at 50% 50%, black 60%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(ellipse 72% 68% at 50% 50%, black 60%, transparent 90%)',
        }}
      />
    </div>
  );
}
