/**
 * Hero Technical QA — config integrity and loader contracts
 *
 * Acceptance criteria verified:
 * 1. GLB config integrity — all NODE_MAP values have GROUP_ASSIGNMENT entries
 * 2. PHASE_SCENE covers all five phases
 * 3. CRITICAL_NODES are valid semantic keys
 * 4. Scroll phases preserved — config has all phase IDs
 */
import { describe, it, expect } from 'vitest';
import {
  NODE_MAP,
  GROUP_ASSIGNMENT,
  NODE_BEHAVIOUR,
  PHASE_SCENE,
  CAMERA_DEFAULTS,
  LIGHTING,
  type SemanticNodeKey,
} from '@/components/dossier-hero/hero-scene.config';
import { PHASES } from '@/components/dossier-hero/dossier-hero.config';
import type { DossierPhaseId } from '@/components/dossier-hero/dossier-hero.types';

const ALL_SEMANTIC_KEYS = Object.values(NODE_MAP) as SemanticNodeKey[];
const ALL_PHASE_IDS: DossierPhaseId[] = ['closed', 'open', 'flight', 'close', 'handoff'];

describe('Technical QA: GLB config integrity', () => {
  it('every NODE_MAP value has a GROUP_ASSIGNMENT entry', () => {
    for (const key of ALL_SEMANTIC_KEYS) {
      expect(GROUP_ASSIGNMENT[key], `Missing group for "${key}"`).toBeDefined();
    }
  });

  it('GROUP_ASSIGNMENT only contains valid semantic keys', () => {
    const validKeys = new Set(ALL_SEMANTIC_KEYS);
    for (const key of Object.keys(GROUP_ASSIGNMENT)) {
      expect(validKeys.has(key as SemanticNodeKey), `Unknown key "${key}" in GROUP_ASSIGNMENT`).toBe(true);
    }
  });

  it('NODE_BEHAVIOUR keys are valid semantic keys', () => {
    const validKeys = new Set(ALL_SEMANTIC_KEYS);
    for (const key of Object.keys(NODE_BEHAVIOUR)) {
      expect(validKeys.has(key as SemanticNodeKey), `Unknown key "${key}" in NODE_BEHAVIOUR`).toBe(true);
    }
  });

  it('critical nodes (levelBase, sudo) are in NODE_MAP', () => {
    expect(ALL_SEMANTIC_KEYS).toContain('levelBase');
    expect(ALL_SEMANTIC_KEYS).toContain('sudo');
  });
});

describe('Technical QA: Phase config completeness', () => {
  it('PHASE_SCENE has all five phase IDs', () => {
    for (const id of ALL_PHASE_IDS) {
      expect(PHASE_SCENE[id], `Missing phase "${id}" in PHASE_SCENE`).toBeDefined();
    }
  });

  it('PHASES config covers full 0–1 range', () => {
    expect(PHASES[0].range[0]).toBe(0);
    expect(PHASES[PHASES.length - 1].range[1]).toBe(1);
  });

  it('PHASES are contiguous (no gaps)', () => {
    for (let i = 1; i < PHASES.length; i++) {
      expect(PHASES[i].range[0]).toBe(PHASES[i - 1].range[1]);
    }
  });
});

describe('Technical QA: Camera and lighting defaults', () => {
  it('camera position is a 3-tuple', () => {
    expect(CAMERA_DEFAULTS.position).toHaveLength(3);
  });

  it('each light has a 3-tuple position', () => {
    expect(LIGHTING.key.position).toHaveLength(3);
    expect(LIGHTING.fill.position).toHaveLength(3);
    expect(LIGHTING.rim.position).toHaveLength(3);
  });
});
