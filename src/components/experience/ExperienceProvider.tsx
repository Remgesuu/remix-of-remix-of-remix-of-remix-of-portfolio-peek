import { createContext, useContext, type ReactNode } from 'react';
import type { ExperienceContextValue } from './experience.types';
import { useExperienceRuntime } from './use-experience-runtime';
import { useSoundEngine } from '@/hooks/use-sound-engine';
import { SoundContext } from '@/hooks/use-sound';

export const ExperienceContext = createContext<ExperienceContextValue | null>(null);

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const runtime = useExperienceRuntime();
  const soundEngine = useSoundEngine(!runtime.reducedMotion);

  return (
    <ExperienceContext.Provider value={runtime}>
      <SoundContext.Provider value={soundEngine}>
        {children}
      </SoundContext.Provider>
    </ExperienceContext.Provider>
  );
}

export function useExperience(): ExperienceContextValue {
  const ctx = useContext(ExperienceContext);
  if (!ctx) throw new Error('useExperience must be used within <ExperienceProvider>');
  return ctx;
}
