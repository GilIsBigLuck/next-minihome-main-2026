'use client'

import { useRef, useState } from 'react'
import { createPortal, useFrame } from '@react-three/fiber'
import { useFBO, useGLTF, MeshTransmissionMaterial } from '@react-three/drei'
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

  useFrame((state) => {
    state.gl.setRenderTarget(buffer)
    state.gl.setClearColor('#efefef')
    state.gl.render(scene, state.camera)
    state.gl.setRenderTarget(null)

    const time = state.clock.elapsedTime

    if (materialRef.current) {
      materialRef.current.roughness = 0.3 + Math.sin(time * 1.5) * 0.1
      materialRef.current.metalness = 1 + Math.cos(time * 2) * 0.2
    }

    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(time * 1) * 0.1
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
        rotation-x={Math.PI / 2}
        rotation-y={Math.PI / 2}
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
