import { useCallback, useEffect, useMemo, useRef } from 'react';
import JSZip from 'jszip';

const ZIP_URL = '/sounds/SND01_sine.zip';
const MASTER_VOLUME = 0.3;
const AMBIENT_FADE_MS = 800;

export type SoundName =
  | 'toggle_on'
  | 'toggle_off'
  | 'transition_up'
  | 'transition_down'
  | 'progress_loop';

interface SoundEngine {
  /** Play a one-shot sound */
  play: (name: SoundName) => void;
  /** Start or stop the ambient loop with fade */
  setAmbient: (playing: boolean) => void;
  /** Initialise engine (call on first user gesture) */
  init: () => void;
}

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
const buffers = new Map<string, AudioBuffer>();
let loading = false;
let loaded = false;

// Ambient state
let ambientSource: AudioBufferSourceNode | null = null;
let ambientGain: GainNode | null = null;
let ambientPlaying = false;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = MASTER_VOLUME;
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

async function loadSounds() {
  if (loading || loaded) return;
  loading = true;

  try {
    const ctx = getCtx();
    const resp = await fetch(ZIP_URL);
    if (!resp.ok) throw new Error(`Failed to fetch ${ZIP_URL}`);
    const blob = await resp.blob();
    const zip = await JSZip.loadAsync(blob);

    const promises: Promise<void>[] = [];

    zip.forEach((path, file) => {
      if (file.dir || !/\.(wav|mp3|ogg|webm)$/i.test(path)) return;
      const name = path.replace(/^.*\//, '').replace(/\.(wav|mp3|ogg|webm)$/i, '');

      promises.push(
        file.async('arraybuffer').then(async (ab) => {
          try {
            // decodeAudioData needs a fresh copy of the buffer
            const copy = ab.slice(0);
            const audioBuffer = await ctx.decodeAudioData(copy);
            buffers.set(name, audioBuffer);
          } catch (err) {
            console.warn(`[SoundEngine] Could not decode "${name}" (${path}), skipping:`, err);
          }
        })
      );
    });

    await Promise.all(promises);
    loaded = buffers.size > 0;
    if (buffers.size === 0) {
      console.warn('[SoundEngine] No audio files could be decoded from zip. Sounds disabled.');
    } else {
      console.info(`[SoundEngine] Loaded ${buffers.size} sound(s):`, [...buffers.keys()]);
    }
  } catch (e) {
    console.warn('[SoundEngine] Failed to load sounds:', e);
  } finally {
    loading = false;
  }
}

function playOneShot(name: SoundName) {
  if (!loaded || !audioCtx || !masterGain) return;
  const buffer = buffers.get(name);
  if (!buffer) return;

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(masterGain);
  source.start(0);
}

function startAmbient() {
  if (ambientPlaying || !loaded || !audioCtx || !masterGain) return;
  const buffer = buffers.get('progress_loop');
  if (!buffer) return;

  ambientGain = audioCtx.createGain();
  ambientGain.gain.value = 0;
  ambientGain.connect(masterGain);

  ambientSource = audioCtx.createBufferSource();
  ambientSource.buffer = buffer;
  ambientSource.loop = true;
  ambientSource.connect(ambientGain);
  ambientSource.start(0);

  // Fade in
  ambientGain.gain.linearRampToValueAtTime(1, audioCtx.currentTime + AMBIENT_FADE_MS / 1000);
  ambientPlaying = true;
}

function stopAmbient() {
  if (!ambientPlaying || !audioCtx || !ambientGain || !ambientSource) return;

  const now = audioCtx.currentTime;
  ambientGain.gain.cancelScheduledValues(now);
  ambientGain.gain.setValueAtTime(ambientGain.gain.value, now);
  ambientGain.gain.linearRampToValueAtTime(0, now + AMBIENT_FADE_MS / 1000);

  const src = ambientSource;
  setTimeout(() => {
    try { src.stop(); } catch {}
  }, AMBIENT_FADE_MS + 50);

  ambientSource = null;
  ambientGain = null;
  ambientPlaying = false;
}

export function useSoundEngine(enabled: boolean): SoundEngine {
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const init = useCallback(() => {
    if (!enabledRef.current) return;
    getCtx();
    loadSounds();
  }, []);

  const play = useCallback((name: SoundName) => {
    if (!enabledRef.current) return;
    playOneShot(name);
  }, []);

  const setAmbient = useCallback((playing: boolean) => {
    if (!enabledRef.current) {
      stopAmbient();
      return;
    }
    if (playing) startAmbient();
    else stopAmbient();
  }, []);

  // Stop ambient on unmount or when disabled
  useEffect(() => {
    if (!enabled) stopAmbient();
    return () => stopAmbient();
  }, [enabled]);

  return useMemo(() => ({ play, setAmbient, init }), [play, setAmbient, init]);
}
