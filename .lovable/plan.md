

# Performance Analysis & Optimization Plan

## Current State Assessment

This is a **static frontend portfolio site** (React + Vite + Three.js) with no backend, no database, no API calls. The enterprise tooling you referenced (DataDog, New Relic, OpenTelemetry, flame graphs, heap dumps) is not applicable here. Here is a practical performance analysis based on the actual codebase.

---

## Performance Profile

### Bundle Weight Concerns

| Chunk | Libraries | Risk |
|-------|-----------|------|
| `vendor-three` | `three`, `@react-three/fiber`, `@react-three/drei` | **~600KB+ gzipped** — heaviest dependency |
| `vendor-postprocessing` | `postprocessing`, `@react-three/postprocessing` | ~80KB — adds vignette/color grading |
| `vendor-ui` | 25+ `@radix-ui/*` packages | ~100KB — most are unused (calendar, menubar, etc.) |
| Other | `gsap`, `jszip`, `recharts`, `lenis` | ~150KB — jszip loaded eagerly for sound + frames |
| Fonts | Google Fonts (Instrument Serif + DM Sans) | Render-blocking `@import` in CSS |

### Critical Path Bottlenecks

1. **Font loading**: `@import url(...)` in `index.css` line 1 is render-blocking — delays First Contentful Paint
2. **GLB asset** (`/hero/support-hero.glb`): Unknown size, loaded via `useGLTF.preload()` at module level — blocks even before component mounts
3. **ZIP assets**: Two ZIP files (`dossier-sequence.zip` for frames, `SND01_sine.zip` for sounds) fetched at runtime
4. **DossierHero is not lazy-loaded**: It's eagerly imported in `Index.tsx` while below-fold sections are lazy — good, but the hero itself pulls in the entire Three.js stack on initial load

### Runtime Performance

- **500vh scroll runway** with continuous `useFrame` animation — GPU-intensive
- `frameloop="demand"` is correctly set (good — only renders when invalidated)
- Post-processing pipeline (Vignette + BrightnessContrast + HueSaturation) adds a full-screen pass each frame
- Shadow mapping enabled with 1024×1024 shadow maps
- `dpr={[1, 1.5]}` caps pixel ratio — good for performance

### Unused Dependencies

Many Radix UI components are installed but likely unused: `calendar`, `menubar`, `context-menu`, `hover-card`, `input-otp`, `radio-group`, `resizable-panels`, `recharts`, `react-day-picker`, `react-hook-form`, `zod`, `@hookform/resolvers`, `embla-carousel-react`.

---

## Optimization Plan (Prioritized)

### 1. Fix render-blocking font load
Replace `@import url(...)` in `index.css` with `<link rel="preload">` in `index.html`. Add `font-display: swap`.

### 2. Remove unused dependencies
Strip ~15 unused packages from `package.json` to reduce install size and potential bundle inclusion. This includes: `recharts`, `react-day-picker`, `react-hook-form`, `zod`, `@hookform/resolvers`, `embla-carousel-react`, and many Radix primitives not referenced in actual components.

### 3. Lazy-load Three.js stack
Wrap `DossierHero` in a dynamic import so the entire Three.js bundle loads only when the component is needed (it's above the fold, but can be deferred with a skeleton/placeholder).

### 4. Defer GLB preload
Move `useGLTF.preload(GLB_URL)` from module-level to after initial paint (e.g., inside a `useEffect` or `requestIdleCallback`).

### 5. Preconnect to Google Fonts
Add `<link rel="preconnect" href="https://fonts.googleapis.com">` to `index.html`.

### 6. Compress/optimize assets
Audit GLB file size and ZIP file sizes. Consider draco-compressed GLB and smaller frame sequences.

---

## Estimated Impact

| Optimization | LCP improvement | Bundle reduction |
|---|---|---|
| Font preload | ~200-400ms | — |
| Remove unused deps | — | ~50-100KB |
| Lazy Three.js | ~500ms (deferred) | Initial: -600KB |
| Defer GLB preload | ~100-300ms | — |

### What I Cannot Do Here
- Generate flame graphs, heap dumps, or APM traces (no server-side tooling available)
- Set up DataDog/New Relic/OpenTelemetry (no backend)
- Measure real Core Web Vitals with RUM (would need deployed site + analytics)

Shall I proceed with implementing these optimizations?

