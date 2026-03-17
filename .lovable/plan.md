

## Fix: Missing `@react-three/postprocessing` dependency

**Problem**: The build fails because `@react-three/postprocessing` is imported in `HeroStageWebGL.tsx` but is not installed as a dependency.

**Fix**: Install `@react-three/postprocessing` (and its peer dependency `postprocessing`) by adding them to `package.json`.

This is a one-step fix — no code changes needed, just the missing dependency.

