import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { drawBoot, BOOT_FONT } from './drawBoot'
import './ClothMaterial'

export default function Cloth({ pct, onReady }) {
  const { size } = useThree()
  const left = useRef()
  const right = useRef()
  const texture = useRef(null)

  useEffect(() => {
    const tex = new THREE.CanvasTexture(document.createElement('canvas'))
    tex.colorSpace = THREE.SRGBColorSpace
    tex.minFilter = THREE.LinearFilter
    texture.current = tex
    left.current.uMap = tex
    right.current.uMap = tex
    return () => {
      tex.dispose()
      texture.current = null
    }
  }, [])

  useEffect(() => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const redraw = () => {
      const tex = texture.current
      if (!tex) return
      drawBoot(tex.image, size.width, size.height, dpr, pct)
      tex.needsUpdate = true
    }
    redraw()
    let cancelled = false
    document.fonts.load(BOOT_FONT).then(() => {
      if (!cancelled) redraw()
    })
    return () => {
      cancelled = true
    }
  }, [pct, size.width, size.height])

  useEffect(() => {
    onReady([left.current, right.current])
  }, [onReady])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    left.current.uTime = t
    right.current.uTime = t
  })

  const shared = {
    uSize: [size.width, size.height],
    uAspect: size.width / size.height,
  }

  return (
    <>
      <mesh>
        <planeGeometry args={[size.width, size.height, 96, 64]} />
        <clothMaterial ref={left} uSide={-1} {...shared} />
      </mesh>
      <mesh>
        <planeGeometry args={[size.width, size.height, 96, 64]} />
        <clothMaterial ref={right} uSide={1} {...shared} />
      </mesh>
    </>
  )
}
