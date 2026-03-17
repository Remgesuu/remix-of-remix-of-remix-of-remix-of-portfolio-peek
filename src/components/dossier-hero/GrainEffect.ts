import { Effect } from 'postprocessing';
import { Uniform } from 'three';

const fragment = /* glsl */ `
uniform float uOpacity;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  float n = fract(sin(dot(uv * 800.0 + time * 3.0, vec2(12.9898, 78.233))) * 43758.5453);
  outputColor = inputColor + vec4(vec3(n) * uOpacity, 0.0);
}`;

export class GrainEffect extends Effect {
  constructor(opacity = 0.008) {
    super('GrainEffect', fragment, {
      uniforms: new Map([['uOpacity', new Uniform(opacity)]]),
    });
  }
}
