/**
 * Performance tier detection utilities for adaptive rendering
 * Optimized for 120fps target on capable hardware
 */

export type PerformanceTier = 'high' | 'medium' | 'low';

interface PerformanceMetrics {
  tier: PerformanceTier;
  hardwareConcurrency: number;
  deviceMemory: number | null;
  isHighRefreshRate: boolean;
  gpuTier: 'high' | 'medium' | 'low' | 'unknown';
}

/**
 * Detect GPU tier based on WebGL renderer info
 */
function detectGpuTier(): 'high' | 'medium' | 'low' | 'unknown' {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return 'unknown';

    const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return 'unknown';

    const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();
    
    // High-end GPUs
    const highEndPatterns = [
      'nvidia geforce rtx',
      'nvidia geforce gtx 10',
      'nvidia geforce gtx 16',
      'nvidia geforce gtx 20',
      'nvidia geforce gtx 30',
      'nvidia geforce gtx 40',
      'radeon rx 5',
      'radeon rx 6',
      'radeon rx 7',
      'apple m1',
      'apple m2',
      'apple m3',
      'apple gpu',
    ];
    
    // Medium GPUs
    const mediumPatterns = [
      'nvidia geforce gtx 9',
      'radeon rx 4',
      'intel iris',
      'intel uhd 6',
      'intel uhd 7',
    ];
    
    for (const pattern of highEndPatterns) {
      if (renderer.includes(pattern)) return 'high';
    }
    
    for (const pattern of mediumPatterns) {
      if (renderer.includes(pattern)) return 'medium';
    }
    
    // Integrated Intel graphics or unknown
    if (renderer.includes('intel')) return 'low';
    
    return 'medium'; // Default to medium for unknown GPUs
  } catch {
    return 'unknown';
  }
}

/**
 * Check if display supports high refresh rate (120Hz+)
 */
function detectHighRefreshRate(): boolean {
  // Modern screens with 120Hz+ typically have matching refresh rate
  // We can estimate based on device pixel ratio and screen dimensions
  const isLargeScreen = window.screen.width >= 1920;
  const hasHighDPR = window.devicePixelRatio >= 2;
  
  // Most 120Hz+ displays are on high-end devices with these characteristics
  return isLargeScreen || hasHighDPR;
}

/**
 * Get device memory (Chrome/Edge only)
 */
function getDeviceMemory(): number | null {
  // @ts-expect-error - deviceMemory is not in standard TypeScript types
  return navigator.deviceMemory ?? null;
}

/**
 * Detect overall performance tier based on hardware capabilities
 */
export function detectPerformanceTier(): PerformanceMetrics {
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  const deviceMemory = getDeviceMemory();
  const isHighRefreshRate = detectHighRefreshRate();
  const gpuTier = detectGpuTier();
  
  let tier: PerformanceTier;
  
  // High tier: 8+ cores, 8GB+ RAM, high-end GPU
  if (
    hardwareConcurrency >= 8 &&
    (deviceMemory === null || deviceMemory >= 8) &&
    (gpuTier === 'high' || gpuTier === 'unknown')
  ) {
    tier = 'high';
  }
  // Medium tier: 4+ cores, 4GB+ RAM
  else if (
    hardwareConcurrency >= 4 &&
    (deviceMemory === null || deviceMemory >= 4)
  ) {
    tier = 'medium';
  }
  // Low tier: everything else
  else {
    tier = 'low';
  }
  
  return {
    tier,
    hardwareConcurrency,
    deviceMemory,
    isHighRefreshRate,
    gpuTier,
  };
}

/**
 * Get recommended WebGL settings based on performance tier
 */
export function getWebGLSettings(tier: PerformanceTier) {
  switch (tier) {
    case 'high':
      return {
        dpr: [1, 2] as [number, number],
        shadowMapSize: 512,
        softShadowsSamples: 6,
        postProcessing: true,
        frameSkip: 1, // No frame skipping
      };
    case 'medium':
      return {
        dpr: [1, 1.5] as [number, number],
        shadowMapSize: 256,
        softShadowsSamples: 4,
        postProcessing: true,
        frameSkip: 2, // Skip every 2nd frame for secondary motion
      };
    case 'low':
      return {
        dpr: [1, 1] as [number, number],
        shadowMapSize: 128,
        softShadowsSamples: 2,
        postProcessing: false,
        frameSkip: 3, // Skip 2 out of 3 frames
      };
  }
}

/**
 * Singleton for caching performance detection results
 */
let cachedMetrics: PerformanceMetrics | null = null;

export function getPerformanceMetrics(): PerformanceMetrics {
  if (!cachedMetrics) {
    cachedMetrics = detectPerformanceTier();
  }
  return cachedMetrics;
}
