import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Grid } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing'
import Core from './Core'
import Rain from './Rain'
import { sceneState } from './state'

function CameraRig() {
  const smooth = useRef({ open: 0, finale: 0 })
  useFrame((state, dt) => {
    const s = smooth.current
    const k = 1 - Math.exp(-dt * 2.6)
    s.open += (sceneState.open - s.open) * k
    s.finale += (sceneState.finale - s.finale) * k
    const t = state.clock.elapsedTime
    const cam = state.camera
    // push in while the transmission opens, pull back out for the finale
    const z = 8.2 - s.open * 3.1 + s.finale * 4.5
    cam.position.x += (Math.sin(t * 0.17) * 0.45 - cam.position.x) * k
    cam.position.y += (0.35 + Math.cos(t * 0.13) * 0.3 - cam.position.y) * k
    cam.position.z += (z - cam.position.z) * k
    cam.lookAt(0, 0, 0)
  })
  return null
}

export default function Scene({ reducedMotion, mobile }) {
  return (
    <div className="scene" aria-hidden="true">
      <Canvas
        dpr={mobile ? [1, 1.25] : [1, 1.6]}
        camera={{ position: [0, 0.35, 8.2], fov: 42, near: 0.1, far: 60 }}
        gl={{ antialias: false, powerPreference: 'high-performance', alpha: true }}
        frameloop={reducedMotion ? 'demand' : 'always'}
      >
        <fog attach="fog" args={['#060606', 7, 24]} />
        <ambientLight intensity={0.35} color="#6b5bb0" />
        <directionalLight position={[-6, 4, -5]} intensity={2.2} color="#f5b942" />
        <directionalLight position={[5, -2, 6]} intensity={0.6} color="#8b5cf6" />
        <Suspense fallback={null}>
          <Core />
          {!reducedMotion && <Rain count={mobile ? 500 : 1500} />}
          <Grid
            position={[0, -2.6, 0]}
            args={[60, 60]}
            cellSize={0.7}
            cellThickness={0.6}
            cellColor="#3b2f6e"
            sectionSize={3.5}
            sectionThickness={1}
            sectionColor="#6d4fd6"
            fadeDistance={26}
            fadeStrength={1.6}
            infiniteGrid
          />
        </Suspense>
        {!reducedMotion && <CameraRig />}
        <EffectComposer disableNormalPass multisampling={0}>
          <Bloom luminanceThreshold={0.55} mipmapBlur intensity={mobile ? 0.7 : 1.1} radius={0.65} />
          <ChromaticAberration offset={[0.0011, 0.0007]} radialModulation modulationOffset={0.45} />
          <Noise opacity={0.055} />
          <Vignette offset={0.28} darkness={0.75} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
