'use client'

import { useRef, useState } from 'react'
import { createPortal, useFrame } from '@react-three/fiber'
import { useFBO, useGLTF, MeshTransmissionMaterial, useScroll } from '@react-three/drei'
import * as THREE from 'three'

import { useNoiseTexture } from '@/hooks/three'
import { FILTER_MATERIAL } from '@/constants/three/hero.config'

interface FilterLayerProps {
  children: React.ReactNode
  damping?: number
}

export function FilterLayer({ children, damping = 0.2 }: FilterLayerProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null)

  const { nodes } = useGLTF('/3d-assets/filter-layer.glb')
  const buffer = useFBO()
  const [scene] = useState(() => new THREE.Scene())
  const noiseTexture = useNoiseTexture()
  const scroll = useScroll()

  const BASE_SCALE = 0.15
  const MIN_SCALE = 0.04 // 약 200px 정도

  useFrame((state) => {
    state.gl.setRenderTarget(buffer)
    state.gl.setClearColor('#efefef')
    state.gl.render(scene, state.camera)
    state.gl.setRenderTarget(null)

    const time = state.clock.elapsedTime
    const scrollOffset = scroll.offset

    if (materialRef.current) {
      materialRef.current.roughness = 0.3 + Math.sin(time * 1.5) * 0.1
      materialRef.current.metalness = 1 + Math.cos(time * 2) * 0.2
    }

    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(time * 1) * 0.1
      // 스크롤에 따라 메시 축소
      const scale = BASE_SCALE - (BASE_SCALE - MIN_SCALE) * scrollOffset
      meshRef.current.scale.setScalar(scale)
      // 스크롤에 따라 rotation-z 변경 (원형으로)
      meshRef.current.rotation.x = scrollOffset * (Math.PI / 1)
      meshRef.current.rotation.y= scrollOffset * (Math.PI / 2)
      meshRef.current.rotation.z = scrollOffset * (Math.PI / 2)
    }
  })

  return (
    <>
      {createPortal(children, scene)}
      <mesh scale={[1, 1, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} />
      </mesh>
      <mesh
        ref={meshRef}
        scale={0.15}
        rotation-x={0}
        rotation-y={0}
        rotation-z={0}
        geometry={(nodes as { Cylinder: THREE.Mesh }).Cylinder.geometry}
      >
        <MeshTransmissionMaterial
          ref={materialRef}
          buffer={buffer.texture}
          ior={FILTER_MATERIAL.ior}
          thickness={FILTER_MATERIAL.thickness}
          anisotropy={FILTER_MATERIAL.anisotropy}
          chromaticAberration={FILTER_MATERIAL.chromaticAberration}
          transmission={FILTER_MATERIAL.transmission}
          roughness={FILTER_MATERIAL.roughness}
          metalness={FILTER_MATERIAL.metalness}
          roughnessMap={noiseTexture}
        />
      </mesh>
    </>
  )
}

useGLTF.preload('/3d-assets/filter-layer.glb')
