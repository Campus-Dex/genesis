import * as THREE from 'three'
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uSway;
  uniform float uGust;
  uniform float uSide;
  uniform vec2 uSize;
  varying vec2 vUv;
  varying vec3 vNormalW;

  float ripple(vec2 uv, float t) {
    // top-left piece (uSide > 0) hangs from the left edge, bottom-right piece from the right edge
    float w = uSide > 0.0 ? uv.x : 1.0 - uv.x;      // 0 at pinned edge, 1 at the cut
    w = mix(smoothstep(0.0, 1.0, w), 1.0, uGust);    // gust releases the pinned edge
    float wind = sin(uv.x * 6.0 + t * 2.2) * sin(uv.y * 4.0 - t * 1.7) * 0.6
               + sin(uv.x * 13.0 - t * 3.1 + uv.y * 3.0) * 0.25
               + sin(uv.y * 9.0 + t * 2.6) * 0.15;
    float gust = sin(uv.x * 3.0 - t * 6.0 + uv.y * 2.0) * 1.1
               + sin(uv.y * 5.0 + t * 8.0 + uv.x * 4.0) * 0.45;
    float gustAmp = uGust * (1.0 + (1.0 - uGust) * 2.0);
    return wind * uSway * w + gust * gustAmp * w;
  }

  void main() {
    vUv = uv;
    float t = uTime;
    float amp = min(uSize.x, uSize.y) * 0.05;
    float e = 0.015;
    float d0 = ripple(uv, t);
    float dx = (ripple(uv + vec2(e, 0.0), t) - d0) / (e * uSize.x);
    float dy = (ripple(uv + vec2(0.0, e), t) - d0) / (e * uSize.y);
    vNormalW = normalize(vec3(-dx * amp, -dy * amp, 1.0));

    vec3 p = position;
    p.z += d0 * amp;
    p.x += d0 * amp * 0.35;

    // the gust carries the piece off to the right, tilting as it goes
    float dir = 1.0;
    p.x += uGust * uSize.x * 1.55 * dir;
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
    float diff = 0.62 + 0.55 * max(dot(n, l), 0.0);
    float rim = pow(1.0 - max(n.z, 0.0), 2.0) * 0.5;
    vec3 col = tex * diff + vec3(0.55, 0.45, 0.9) * rim * 0.35;

    vec3 amber = vec3(1.0, 0.72, 0.28);
    float e = abs(d);
    float edge = exp(-e / 0.006) * uGlow * float(passed);
    float head = exp(-abs(s - uSlash) * 34.0) * exp(-e / 0.03) * step(0.001, uSlash) * step(uSlash, 0.999);
    float wake = exp(-max(uSlash - s, 0.0) * 6.0) * exp(-e / 0.05) * step(0.001, uSlash) * step(uSlash, 0.999) * 0.6;
    col += amber * (edge * 1.6 + wake) + vec3(1.0) * head * 2.2;

    gl_FragColor = vec4(col, 1.0);
  }
`

export const ClothMaterial = shaderMaterial(
  {
    uMap: null,
    uTime: 0,
    uSway: 0,
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
