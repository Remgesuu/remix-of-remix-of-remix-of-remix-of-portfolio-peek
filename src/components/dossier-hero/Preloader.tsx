import { useEffect, useState } from 'react';
import { PRELOADER_MIN_MS } from './dossier-hero.config';

interface Props {
  loadProgress: number;
  loaded: boolean;
}

/** Timeout after which preloader dismisses regardless of load state */
const BAIL_OUT_MS = 3000;

export function Preloader({ loadProgress, loaded }: Props) {
  const [visible, setVisible] = useState(true);
  const [minTimePassed, setMinTimePassed] = useState(false);
  const [bailedOut, setBailedOut] = useState(false);

  useEffect(() => {
    const min = setTimeout(() => setMinTimePassed(true), PRELOADER_MIN_MS);
    const bail = setTimeout(() => setBailedOut(true), BAIL_OUT_MS);
    return () => { clearTimeout(min); clearTimeout(bail); };
  }, []);

  const shouldDismiss = (loaded && minTimePassed) || bailedOut;

  useEffect(() => {
    if (shouldDismiss) {
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [shouldDismiss]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-300"
      style={{ opacity: shouldDismiss ? 0 : 1 }}
    >
      <div className="w-14 h-14 rounded-full border border-dossier-gold/30 flex items-center justify-center mb-6">
        <span className="font-serif text-2xl text-dossier-gold/70 select-none">G</span>
      </div>
      <div className="w-40 h-[2px] bg-border/40 rounded-full overflow-hidden">
        <div
          className="h-full bg-dossier-gold transition-[width] duration-150 rounded-full"
          style={{ width: `${Math.round(loadProgress * 100)}%` }}
        />
      </div>
      <p className="mt-3 text-[10px] tracking-label uppercase text-dossier-whisper font-sans">
        {Math.round(loadProgress * 100)}%
      </p>
    </div>
  );
}
