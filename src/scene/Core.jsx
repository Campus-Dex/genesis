import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { sceneState } from './state'

const VIOLET = '#8b5cf6'
const VIOLET_GLOW = '#c4b5fd'
const AMBER = '#f5b942'
const glowColor = new THREE.Color(VIOLET_GLOW)
const amberColor = new THREE.Color(AMBER)

function useFragmentShell(radius, detail) {
  return useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(radius, detail).toNonIndexed()
    const pos = geo.attributes.position
    const orig = pos.array.slice()
    const faceCount = pos.count / 3
    const normals = new Float32Array(faceCount * 3)
    const weights = new Float32Array(faceCount)
    const a = new THREE.Vector3()
    const b = new THREE.Vector3()
    const c = new THREE.Vector3()
    const n = new THREE.Vector3()
    for (let f = 0; f < faceCount; f++) {
      a.fromArray(orig, f * 9)
      b.fromArray(orig, f * 9 + 3)
      c.fromArray(orig, f * 9 + 6)
      n.addVectors(a, b).add(c).normalize()
      n.toArray(normals, f * 3)
      // deterministic per-face scatter so fragments open unevenly
      weights[f] = 0.35 + 0.65 * Math.abs(Math.sin(f * 12.9898) * 43758.5453 % 1)
    }
    geo.computeVertexNormals()
    return { geo, orig, normals, weights, faceCount }
  }, [radius, detail])
}

export default function Core() {
  const group = useRef()
  const inner = useRef()
  const shell = useRef()
  const rings = useRef([])
  const { geo, orig, normals, weights, faceCount } = useFragmentShell(1.7, 1)

  const smooth = useRef({ open: 0, recede: 0, finale: 0 })

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const s = smooth.current
    const k = 1 - Math.exp(-dt * 3.2)
    s.open += (sceneState.open - s.open) * k
    s.recede += (sceneState.recede - s.recede) * k
    s.finale += (sceneState.finale - s.finale) * k

    // shell fragments drift along their face normals as the transmission opens
    const spread = s.open * (1 - s.finale) * 1.9
    const pos = shell.current.geometry.attributes.position
    const arr = pos.array
    for (let f = 0; f < faceCount; f++) {
      const w = weights[f] * spread
      const nx = normals[f * 3] * w
      const ny = normals[f * 3 + 1] * w
      const nz = normals[f * 3 + 2] * w
      for (let v = 0; v < 3; v++) {
        const i = f * 9 + v * 3
        arr[i] = orig[i] + nx
        arr[i + 1] = orig[i + 1] + ny
        arr[i + 2] = orig[i + 2] + nz
      }
    }
    pos.needsUpdate = true

    const g = group.current
    g.rotation.y = t * 0.12 + s.open * 0.8
    g.rotation.x = Math.sin(t * 0.21) * 0.12 + s.open * 0.25
    const px = state.pointer.x
    const py = state.pointer.y
    g.position.x += ((px * 0.35) - g.position.x) * k
    g.position.y += ((py * 0.25 + Math.sin(t * 0.6) * 0.08) - g.position.y) * k
    // recede pushes the core back into the fog behind the readable sections,
    // finale brings it home and lifts it slightly
    g.position.z = -s.recede * 7 + s.finale * 6
    const scale = 1 - s.recede * 0.35 + s.finale * 0.2
    g.scale.setScalar(scale)

    inner.current.material.color.lerpColors(glowColor, amberColor, s.finale * 0.5)
    const pulse = 0.92 + Math.sin(t * 1.8) * 0.05 + s.open * 0.25
    inner.current.scale.setScalar(pulse)

    rings.current.forEach((r, i) => {
      if (!r) return
      r.rotation.z = t * (0.15 + i * 0.07) * (i % 2 ? -1 : 1)
      r.rotation.x = 1.1 + i * 0.5 + Math.sin(t * 0.3 + i) * 0.15
      const rs = 1 + s.open * (0.25 + i * 0.12)
      r.scale.setScalar(rs)
    })
  })

  return (
    <group ref={group}>
      <mesh ref={shell} geometry={geo}>
        <meshStandardMaterial
          color={VIOLET}
          emissive={VIOLET}
          emissiveIntensity={0.18}
          roughness={0.55}
          metalness={0.2}
          flatShading
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh geometry={geo}>
        <meshBasicMaterial color={VIOLET_GLOW} wireframe transparent opacity={0.55} toneMapped={false} />
      </mesh>
      <mesh ref={inner}>
        <sphereGeometry args={[0.62, 48, 48]} />
        <meshBasicMaterial color={VIOLET_GLOW} toneMapped={false} />
      </mesh>
      {[2.35, 2.9, 3.5].map((radius, i) => (
        <mesh key={radius} ref={(el) => (rings.current[i] = el)}>
          <torusGeometry args={[radius, 0.008 + i * 0.003, 6, 160]} />
          <meshBasicMaterial
            color={i === 1 ? AMBER : VIOLET_GLOW}
            transparent
            opacity={0.55 - i * 0.12}
            toneMapped={false}
          />
        </mesh>
      ))}
      <pointLight color={VIOLET} intensity={18} distance={9} decay={2} />
    </group>
  )
}
