import { useContext, createContext } from 'react';
import type { SoundName } from './use-sound-engine';

export interface SoundApi {
  play: (name: SoundName) => void;
  setAmbient: (playing: boolean) => void;
  init: () => void;
}

const noop = () => {};
const defaultApi: SoundApi = { play: noop, setAmbient: noop, init: noop };

export const SoundContext = createContext<SoundApi>(defaultApi);

export function useSound(): SoundApi {
  return useContext(SoundContext);
}
