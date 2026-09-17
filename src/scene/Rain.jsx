import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const BOUNDS = { x: 14, yTop: 9, yBottom: -7, zNear: 5, zFar: -14 }

// mulberry32: deterministic so the drop field is pure across renders
function seeded(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export default function Rain({ count = 1500 }) {
  const points = useRef()
  const { positions, speeds } = useMemo(() => {
    const rand = seeded(count)
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * BOUNDS.x * 2
      positions[i * 3 + 1] = BOUNDS.yBottom + rand() * (BOUNDS.yTop - BOUNDS.yBottom)
      positions[i * 3 + 2] = BOUNDS.zFar + rand() * (BOUNDS.zNear - BOUNDS.zFar)
      speeds[i] = 2.2 + rand() * 3.4
    }
    return { positions, speeds }
  }, [count])

  useFrame((_, dt) => {
    const attr = points.current.geometry.attributes.position
    const arr = attr.array
    const step = Math.min(dt, 0.05)
    for (let i = 0; i < count; i++) {
      let y = arr[i * 3 + 1] - speeds[i] * step
      if (y < BOUNDS.yBottom) y = BOUNDS.yTop
      arr[i * 3 + 1] = y
    }
    attr.needsUpdate = true
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#a89cc8"
        size={0.045}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
