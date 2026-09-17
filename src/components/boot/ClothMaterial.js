import * as THREE from 'three'
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uSway;
  uniform float uStorm;
  uniform float uGust;
  uniform float uSide;
  uniform vec2 uSize;
  varying vec2 vUv;
  varying vec3 vNormalW;

  // the sheet hangs from its top edge: no motion at the top, most at the hem
  float weight(vec2 uv) {
    float w = smoothstep(0.0, 1.0, 1.0 - uv.y);
    return mix(w, 1.0, uGust);
  }

  float ripple(vec2 uv, float t) {
    float f = 1.0 + uStorm * 0.9;          // storm raises frequency
    float storm = 1.0 + uStorm * 2.4;      // and amplitude
    float swing = sin(t * 1.5 * f + uv.y * 2.2) * 0.9
                + sin(uv.x * 4.0 + t * 2.3 * f) * sin(uv.y * 3.0 - t * 1.4 * f) * 0.5
                + sin(uv.x * 11.0 - t * 3.4 * f + uv.y * 5.0) * 0.18;
    float gust = sin(uv.x * 3.0 - t * 7.0 + uv.y * 2.0) * 1.1
               + sin(uv.y * 6.0 + t * 9.0 + uv.x * 4.0) * 0.45;
    return (swing * uSway * storm + gust * uGust * 2.2) * weight(uv);
  }

  void main() {
    vUv = uv;
    float t = uTime;
    float amp = min(uSize.x, uSize.y) * 0.11;
    float e = 0.012;
    float d0 = ripple(uv, t);
    float dx = (ripple(uv + vec2(e, 0.0), t) - d0) / (e * uSize.x);
    float dy = (ripple(uv + vec2(0.0, e), t) - d0) / (e * uSize.y);
    vNormalW = normalize(vec3(-dx * amp, -dy * amp, 1.0));

    float w = weight(uv);
    vec3 p = position;
    p.z += d0 * amp;
    p.x += d0 * amp * 0.45;
    p.y -= abs(d0) * amp * 0.12;

    // steady lean downwind as the storm builds
    float f = 1.0 + uStorm * 0.9;
    p.x += uStorm * w * uSize.x * 0.07 * (0.6 + 0.4 * sin(t * 1.5 * f));

    // the gust carries the piece off to the right, tilting as it goes
    p.x += uGust * uSize.x * 1.6;
    p.y += uGust * uGust * uSize.y * 0.3 * uSide + uGust * (uv.x - 0.5) * uSize.y * 0.35;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const fragment = /* glsl */ `
  precision highp float;
  uniform sampler2D uMap;
  uniform vec2 uCutA;
  uniform vec2 uCutB;
  uniform float uSlash;
  uniform float uSide;
  uniform float uGlow;
  uniform float uAspect;
  varying vec2 vUv;
  varying vec3 vNormalW;

  void main() {
    vec2 p = vec2(vUv.x * uAspect, vUv.y);
    vec2 a = vec2(uCutA.x * uAspect, uCutA.y);
    vec2 b = vec2(uCutB.x * uAspect, uCutB.y);
    vec2 ab = b - a;
    float len = length(ab);
    vec2 dir = ab / len;
    vec2 ap = p - a;
    float s = dot(ap, dir) / len;
    float d = ap.x * dir.y - ap.y * dir.x;
    float side = d < 0.0 ? -1.0 : 1.0;

    bool passed = s < uSlash;
    if (passed) {
      if (side != uSide) discard;
    } else if (uSide > 0.0) {
      discard;
    }

    vec3 tex = texture2D(uMap, vUv).rgb;
    vec3 n = normalize(vNormalW);
    vec3 l = normalize(vec3(-0.45, 0.65, 1.0));
    float diff = 0.55 + 0.65 * max(dot(n, l), 0.0);
    float rim = pow(1.0 - max(n.z, 0.0), 2.0) * 0.6;
    vec3 col = tex * diff + vec3(0.55, 0.45, 0.9) * rim * 0.4;

    vec3 amber = vec3(1.0, 0.72, 0.28);
    float e = abs(d);
    float edge = exp(-e / 0.006) * uGlow * float(passed);
    float slashing = step(0.001, uSlash) * step(uSlash, 0.999);
    float head = exp(-abs(s - uSlash) * 34.0) * exp(-e / 0.03) * slashing;
    float wake = exp(-max(uSlash - s, 0.0) * 6.0) * exp(-e / 0.05) * slashing * 0.6;
    col += amber * (edge * 1.6 + wake) + vec3(1.0) * head * 2.2;

    gl_FragColor = vec4(col, 1.0);
  }
`

export const ClothMaterial = shaderMaterial(
  {
    uMap: null,
    uTime: 0,
    uSway: 0,
    uStorm: 0,
    uGust: 0,
    uSlash: 0,
    uGlow: 1,
    uSide: -1,
    uSize: new THREE.Vector2(1, 1),
    uAspect: 1,
    uCutA: new THREE.Vector2(0.96, 1.08),
    uCutB: new THREE.Vector2(0.04, -0.08),
  },
  vertex,
  fragment,
)

extend({ ClothMaterial })
