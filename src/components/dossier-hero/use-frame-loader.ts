import { useEffect, useRef, useState } from 'react';
import JSZip from 'jszip';

interface FrameLoaderState {
  frames: HTMLImageElement[];
  loaded: boolean;
  progress: number;
  error: string | null;
}

const BATCH_SIZE = 20;

/**
 * Loads WebP frames from a zip file, extracting and creating Image objects.
 * Returns frames array, loading progress (0–1), and loaded flag.
 */
export function useFrameLoader(zipUrl: string): FrameLoaderState {
  const [state, setState] = useState<FrameLoaderState>({
    frames: [],
    loaded: false,
    progress: 0,
    error: null,
  });
  const abortRef = useRef(false);

  useEffect(() => {
    if (!zipUrl) return;
    abortRef.current = false;
    let objectUrls: string[] = [];

    async function load() {
      try {
        // Fetch the zip
        const response = await fetch(zipUrl);
        if (!response.ok) throw new Error(`Failed to fetch ${zipUrl}`);
        const blob = await response.blob();

        const zip = await JSZip.loadAsync(blob);

        // Collect webp entries sorted by name
        const entries: { name: string; file: JSZip.JSZipObject }[] = [];
        zip.forEach((relativePath, file) => {
          if (!file.dir && /\.webp$/i.test(relativePath)) {
            entries.push({ name: relativePath, file });
          }
        });
        entries.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

        if (entries.length === 0) throw new Error('No WebP frames found in zip');

        const totalFrames = entries.length;
        const images: HTMLImageElement[] = new Array(totalFrames);
        let loadedCount = 0;

        // Batch-load frames
        for (let i = 0; i < totalFrames; i += BATCH_SIZE) {
          if (abortRef.current) return;

          const batch = entries.slice(i, Math.min(i + BATCH_SIZE, totalFrames));
          await Promise.all(
            batch.map(async (entry, batchIdx) => {
              const frameIdx = i + batchIdx;
              const arrayBuffer = await entry.file.async('arraybuffer');
              const frameBlob = new Blob([arrayBuffer], { type: 'image/webp' });
              const url = URL.createObjectURL(frameBlob);
              objectUrls.push(url);

              const img = new Image();
              await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = () => reject(new Error(`Frame ${frameIdx} failed`));
                img.src = url;
              });

              images[frameIdx] = img;
              loadedCount++;

              if (!abortRef.current) {
                setState(prev => ({ ...prev, progress: loadedCount / totalFrames }));
              }
            })
          );
        }

        if (!abortRef.current) {
          setState({ frames: images, loaded: true, progress: 1, error: null });
        }
      } catch (err) {
        if (!abortRef.current) {
          setState(prev => ({ ...prev, error: (err as Error).message }));
        }
      }
    }

    load();

    return () => {
      abortRef.current = true;
      objectUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [zipUrl]);

  return state;
}
