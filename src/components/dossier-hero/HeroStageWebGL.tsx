import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, SoftShadows } from '@react-three/drei';
import { EffectComposer, Vignette, BrightnessContrast, HueSaturation } from '@react-three/postprocessing';
import * as THREE from 'three';
import type { DossierPhaseId } from './dossier-hero.types';
import {
  PHASE_SCENE,
  SCENE_LERP,
  POINTER_RANGES,
  CAMERA_DEFAULTS,
  LIGHTING,
  ENVIRONMENT,
  NODE_BEHAVIOUR,
  type PhaseSceneState,
  type SemanticNodeKey,
} from './hero-scene.config';
import { useGLBScene, type SemanticNodes } from './use-glb-loader';
import { useExperience } from '../experience/ExperienceProvider';
import { GrainEffect } from './GrainEffect';

/* ─── Props ─── */

interface StageProps {
  progress: number;
  phase: DossierPhaseId;
  localProgress: number;
  onCriticalMissing?: () => void;
}

/* ─── Pre-allocated / cached constants (zero-alloc in frame loop) ─── */

const PHASE_KEYS = Object.keys(PHASE_SCENE) as DossierPhaseId[];

// Reusable target state object — mutated in-place by lerpState
const _targetState: PhaseSceneState = { ...PHASE_SCENE.closed };

function lerpStateInPlace(out: PhaseSceneState, a: PhaseSceneState, b: PhaseSceneState, t: number): void {
  const l = THREE.MathUtils.lerp;
  out.cameraZ = l(a.cameraZ, b.cameraZ, t);
  out.cameraY = l(a.cameraY, b.cameraY, t);
  out.sceneTiltMultiplier = l(a.sceneTiltMultiplier, b.sceneTiltMultiplier, t);
  out.heroArtifactY = l(a.heroArtifactY, b.heroArtifactY, t);
  out.heroArtifactScale = l(a.heroArtifactScale, b.heroArtifactScale, t);
  out.supportY = l(a.supportY, b.supportY, t);
  out.supportSpread = l(a.supportSpread, b.supportSpread, t);
  out.atmosphereOpacity = l(a.atmosphereOpacity, b.atmosphereOpacity, t);
  out.orbGlow = l(a.orbGlow, b.orbGlow, t);
}

const INITIAL_STATE: PhaseSceneState = { ...PHASE_SCENE.closed };

/* ─── Motion functions (zero per-frame allocations) ─── */

// Cache node keys for iteration
let _cachedNodeKeys: string[] | null = null;

function getNodeKeys(nodes: SemanticNodes): string[] {
  if (!_cachedNodeKeys) {
    _cachedNodeKeys = Object.keys(nodes);
  }
  return _cachedNodeKeys;
}

function applyPhaseMotion(
  current: PhaseSceneState,
  target: PhaseSceneState,
  delta: number,
  camera: THREE.Camera,
  ptrX: number,
  ptrY: number,
  heroArtifactRef: React.RefObject<THREE.Group | null>,
  supportRef: React.RefObject<THREE.Group | null>,
) {
  const lerpAmt = 1 - Math.pow(1 - SCENE_LERP, delta * 60);
  const l = THREE.MathUtils.lerp;
  const s = current;

  s.cameraZ = l(s.cameraZ, target.cameraZ, lerpAmt);
  s.cameraY = l(s.cameraY, target.cameraY, lerpAmt);
  s.sceneTiltMultiplier = l(s.sceneTiltMultiplier, target.sceneTiltMultiplier, lerpAmt);
  s.heroArtifactY = l(s.heroArtifactY, target.heroArtifactY, lerpAmt);
  s.heroArtifactScale = l(s.heroArtifactScale, target.heroArtifactScale, lerpAmt);
  s.supportY = l(s.supportY, target.supportY, lerpAmt);
  s.supportSpread = l(s.supportSpread, target.supportSpread, lerpAmt);
  s.atmosphereOpacity = l(s.atmosphereOpacity, target.atmosphereOpacity, lerpAmt);
  s.orbGlow = l(s.orbGlow, target.orbGlow, lerpAmt);

  const px = (ptrX - 0.5) * POINTER_RANGES.cameraPointerX;
  const py = (ptrY - 0.5) * -POINTER_RANGES.cameraPointerY;
  (camera as THREE.PerspectiveCamera).position.set(px, s.cameraY + py, s.cameraZ);
  camera.lookAt(0, 0.8, 0);

  if (heroArtifactRef.current) {
    heroArtifactRef.current.position.y = s.heroArtifactY;
    const sc = s.heroArtifactScale;
    heroArtifactRef.current.scale.set(sc, sc, sc);
    heroArtifactRef.current.rotation.y = (ptrX - 0.5) * POINTER_RANGES.artifactTiltY;
    heroArtifactRef.current.rotation.x = (ptrY - 0.5) * -POINTER_RANGES.artifactTiltX;
  }

  if (supportRef.current) {
    supportRef.current.position.y = s.supportY;
    const sp = 1 + s.supportSpread;
    supportRef.current.scale.set(sp, 1, sp);
  }
}

function applyPointerMotion(
  sceneRef: React.RefObject<THREE.Group | null>,
  nodes: SemanticNodes,
  ptrX: number,
  ptrY: number,
  tiltMul: number,
  originals: Map<string, THREE.Vector3>,
) {
  if (sceneRef.current) {
    sceneRef.current.rotation.y = (ptrX - 0.5) * POINTER_RANGES.sceneTiltY * tiltMul;
    sceneRef.current.rotation.x = (ptrY - 0.5) * -POINTER_RANGES.sceneTiltX * tiltMul;
  }

  const keys = getNodeKeys(nodes);
  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i];
    const node = nodes[key as SemanticNodeKey];
    if (!node) continue;
    const behaviour = NODE_BEHAVIOUR[key as SemanticNodeKey];
    if (!behaviour) continue;
    const orig = originals.get(key);
    if (!orig) continue;

    let xShift = 0;
    let zShift = 0;

    if (behaviour.pointerShift) {
      xShift = (ptrX - 0.5) * behaviour.pointerShift.x;
      zShift = (ptrY - 0.5) * behaviour.pointerShift.y;
    }

    if (behaviour.pointerTilt) {
      node.rotation.y = (ptrX - 0.5) * POINTER_RANGES.artifactTiltY;
      node.rotation.x = (ptrY - 0.5) * -POINTER_RANGES.artifactTiltX;
    }

    node.position.x = orig.x + xShift;
    node.position.z = orig.z + zShift;
  }
}

const orbLag = { x: 0.5, y: 0.5 };
const ORB_LAG_FACTOR = 0.03;
const ORB_LAG_RANGE = 0.12;

function applySecondaryMotion(
  nodes: SemanticNodes,
  elapsed: number,
  originals: Map<string, THREE.Vector3>,
  ptrX: number,
  ptrY: number,
) {
  orbLag.x += (ptrX - orbLag.x) * ORB_LAG_FACTOR;
  orbLag.y += (ptrY - orbLag.y) * ORB_LAG_FACTOR;

  const keys = getNodeKeys(nodes);
  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i];
    const node = nodes[key as SemanticNodeKey];
    if (!node) continue;
    const behaviour = NODE_BEHAVIOUR[key as SemanticNodeKey];
    if (!behaviour) continue;
    const orig = originals.get(key);
    if (!orig) continue;

    let yOffset = 0;
    if (behaviour.float) {
      yOffset = Math.sin(elapsed * behaviour.float.speed * Math.PI * 2) * behaviour.float.amp;
    }

    if (key === 'orb') {
      const lagX = (orbLag.x - 0.5) * ORB_LAG_RANGE;
      const lagY = (orbLag.y - 0.5) * -ORB_LAG_RANGE * 0.6;
      node.position.x = orig.x + lagX;
      node.position.z = orig.z + lagY;
    }

    if (yOffset !== 0) {
      node.position.y = orig.y + yOffset;
    }
  }
}

/* ─── Scene content (lives inside Canvas) ─── */

function SceneContent({ progress, phase, localProgress, onCriticalMissing }: StageProps) {
  const { pointerRef, isTouch, reducedMotion } = useExperience();
  const { camera, scene, invalidate } = useThree();
  const { nodes, grouped, loaded, criticalMissing } = useGLBScene();

  // Set scene background
  useEffect(() => {
    const root = document.documentElement;
    const update = () => {
      const isDark = root.classList.contains('dark');
      scene.background = new THREE.Color(isDark ? ENVIRONMENT.sceneBackgroundDark : ENVIRONMENT.sceneBackground);
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [scene]);

  useEffect(() => {
    if (criticalMissing && onCriticalMissing) onCriticalMissing();
  }, [criticalMissing, onCriticalMissing]);

  const sceneRef = useRef<THREE.Group>(null);
  const prevPtr = useRef({ x: 0.5, y: 0.5 });
  const heroArtifactRef = useRef<THREE.Group>(null);
  const supportRef = useRef<THREE.Group>(null);
  const currentState = useRef<PhaseSceneState>({ ...INITIAL_STATE });

  const originalPositions = useRef<Map<string, THREE.Vector3>>(new Map());

  useEffect(() => {
    if (!loaded) return;
    // Reset cached keys when nodes change
    _cachedNodeKeys = null;
    Object.entries(nodes).forEach(([key, node]) => {
      if (node) {
        originalPositions.current.set(key, node.position.clone());
      }
    });
  }, [loaded, nodes]);

  // Grain as postprocessing effect (no separate mesh/material)
  const grainEffect = useMemo(() => new GrainEffect(0.008), []);

  useEffect(() => {
    return () => { grainEffect.dispose(); };
  }, [grainEffect]);

  // Invalidate on demand when phase/progress changes
  useEffect(() => {
    invalidate();
  }, [phase, progress, localProgress, invalidate]);

  useFrame((state, delta) => {
    if (!loaded) return;

    const p = pointerRef.current;
    const ptrX = isTouch ? 0.5 : p.lerpX;
    const ptrY = isTouch ? 0.5 : p.lerpY;

    // 1. Target from phase blend (zero-alloc)
    const phaseIdx = PHASE_KEYS.indexOf(phase);
    const nextIdx = Math.min(phaseIdx + 1, PHASE_KEYS.length - 1);
    lerpStateInPlace(_targetState, PHASE_SCENE[phase], PHASE_SCENE[PHASE_KEYS[nextIdx]], localProgress);

    // 2. Phase motion
    applyPhaseMotion(currentState.current, _targetState, delta, camera, ptrX, ptrY, heroArtifactRef, supportRef);

    // 3. Pointer motion (skip on touch)
    if (!isTouch) {
      applyPointerMotion(sceneRef, nodes, ptrX, ptrY, currentState.current.sceneTiltMultiplier, originalPositions.current);
    }

    // 4. Secondary motion (skip on reduced motion)
    if (!reducedMotion) {
      applySecondaryMotion(nodes, state.clock.elapsedTime, originalPositions.current, ptrX, ptrY);
    }

    // 5. Only invalidate when something actually changed
    const pointerMoved = Math.abs(ptrX - prevPtr.current.x) > 0.0005 || Math.abs(ptrY - prevPtr.current.y) > 0.0005;
    const hasSecondaryMotion = !reducedMotion;
    if (pointerMoved || hasSecondaryMotion) {
      invalidate();
    }
    prevPtr.current.x = ptrX;
    prevPtr.current.y = ptrY;
  });

  return (
    <>
      <SoftShadows size={10} focus={0.5} samples={6} />
      <Environment
        preset={ENVIRONMENT.preset}
        environmentIntensity={ENVIRONMENT.intensity}
        backgroundBlurriness={ENVIRONMENT.backgroundBlurriness}
        background={ENVIRONMENT.background}
      />

      <ambientLight intensity={LIGHTING.ambient.intensity} />
      <directionalLight
        position={LIGHTING.key.position}
        intensity={LIGHTING.key.intensity}
        color={LIGHTING.key.color}
        castShadow
        shadow-mapSize-width={LIGHTING.key.shadowMapSize}
        shadow-mapSize-height={LIGHTING.key.shadowMapSize}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={LIGHTING.key.shadowBias}
      />
      <directionalLight
        position={LIGHTING.fill.position}
        intensity={LIGHTING.fill.intensity}
        color={LIGHTING.fill.color}
      />
      <directionalLight
        position={LIGHTING.rim.position}
        intensity={LIGHTING.rim.intensity}
        color={LIGHTING.rim.color}
      />

      <group ref={sceneRef}>
        <group ref={heroArtifactRef}>
          {loaded && grouped.heroArtifact.map((node, i) => (
            <primitive key={`hero-${i}`} object={node} />
          ))}
        </group>

        <group ref={supportRef}>
          {loaded && grouped.support.map((node, i) => (
            <primitive key={`support-${i}`} object={node} />
          ))}
        </group>

        <group>
          {loaded && grouped.atmosphere.map((node, i) => (
            <primitive key={`atmo-${i}`} object={node} />
          ))}
        </group>
      </group>

      <EffectComposer multisampling={0}>
        <Vignette darkness={0.35} offset={0.35} />
        <BrightnessContrast brightness={-0.03} contrast={0.08} />
        <HueSaturation hue={0} saturation={0.03} />
        <primitive object={grainEffect} />
      </EffectComposer>
    </>
  );
}

/* ─── Exported Canvas wrapper ─── */

export function HeroStageWebGL(props: StageProps) {
  return (
    <div className="absolute inset-0">
      <Canvas
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.5,
        }}
        camera={{
          fov: CAMERA_DEFAULTS.fov,
          near: CAMERA_DEFAULTS.near,
          far: CAMERA_DEFAULTS.far,
          position: CAMERA_DEFAULTS.position,
        }}
        shadows="soft"
        style={{ position: 'absolute', inset: 0 }}
        dpr={[1, 1.5]}
        frameloop="demand"
      >
        <SceneContent {...props} />
      </Canvas>
    </div>
  );
}
