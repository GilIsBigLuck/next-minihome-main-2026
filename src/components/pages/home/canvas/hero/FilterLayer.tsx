'use client'

import { useRef, useState } from 'react'
import { createPortal, useFrame } from '@react-three/fiber'
import { useFBO, useGLTF, MeshTransmissionMaterial, useScroll } from '@react-three/drei'
import * as THREE from 'three'

import { useNoiseTexture } from '@/hooks/three/useNoiseTexture'
import { FILTER_MATERIAL } from './hero.config'

const BASE_SCALE = 0.15
const MIN_SCALE = 0.04
const PHASE1_END = 0.4
const PHASE2_START = 0.55
const PHASE2_END = 0.65
const PHASE3_START = 0.88
const PHASE3_END = 1.0

interface FilterLayerProps {
  children: React.ReactNode
  damping?: number
}

export function FilterLayer({ children, damping = 0.2 }: FilterLayerProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshPhysicalMaterial & { roughness: number; metalness: number }>(null)

  const { nodes } = useGLTF('/3d-assets/filter-layer.glb')
  const buffer = useFBO()
  const [scene] = useState(() => new THREE.Scene())
  const noiseTexture = useNoiseTexture()
  const scroll = useScroll()

  useFrame((state) => {
    state.gl.setRenderTarget(buffer)
    state.gl.setClearColor('#efefef')
    state.gl.render(scene, state.camera)
    state.gl.setRenderTarget(null)

    const time = state.clock.elapsedTime
    const scrollOffset = scroll.offset

    if (materialRef.current) {
      materialRef.current.roughness = 0.3 + Math.sin(time * 1.5) * 0.1
      materialRef.current.metalness = 0.8 + Math.cos(time * 2) * 0.2
    }

    if (meshRef.current) {
      // Phase 1: 축소 + 회전 (0 ~ 0.4)
      if (scrollOffset <= PHASE1_END) {
        const phase1Progress = scrollOffset / PHASE1_END
        const scale = BASE_SCALE - (BASE_SCALE - MIN_SCALE) * phase1Progress
        meshRef.current.scale.setScalar(scale)
        meshRef.current.rotation.x = phase1Progress * Math.PI + Math.sin(time) * 0.1
        meshRef.current.rotation.y = phase1Progress * (Math.PI / 2)
        meshRef.current.rotation.z = phase1Progress * (Math.PI / 2)
        meshRef.current.position.x = 0
      }
      // Phase 2: 사각형 변형 + 확대 (0.6 ~ 0.75)
      else if (scrollOffset >= PHASE2_START && scrollOffset < PHASE3_START) {
        const phase2Progress = Math.min(1, (scrollOffset - PHASE2_START) / (PHASE2_END - PHASE2_START))

        // 사각형으로 변형 (x 늘리고, y 줄이기)
        const scaleX = MIN_SCALE + phase2Progress * 0.15
        const scaleY = MIN_SCALE + phase2Progress * 0.08
        const scaleZ = MIN_SCALE
        meshRef.current.scale.set(scaleX, scaleY, scaleZ)

        // 회전 유지 + 정면으로
        meshRef.current.rotation.x = Math.PI + Math.sin(time) * 0.05
        meshRef.current.rotation.y = Math.PI / 2 - phase2Progress * (Math.PI / 2)
        meshRef.current.rotation.z = Math.PI / 2

        // 위치 고정
        meshRef.current.position.x = 0
      }
      // Phase 3: 화면 꽉 채우기 (0.9 ~ 1.0)
      else if (scrollOffset >= PHASE3_START) {
        const phase3Progress = Math.min(1, (scrollOffset - PHASE3_START) / (PHASE3_END - PHASE3_START))

        // Phase 2 종료 시점의 스케일
        const phase2EndScaleX = MIN_SCALE + 0.15
        const phase2EndScaleY = MIN_SCALE + 0.08

        // 화면을 꽉 채우는 스케일 (가로로 길게)
        const targetScaleX = 0.2
        const targetScaleY = 1.35

        const scaleX = phase2EndScaleX + (targetScaleX - phase2EndScaleX) * phase3Progress
        const scaleY = phase2EndScaleY + (targetScaleY - phase2EndScaleY) * phase3Progress
        const scaleZ = MIN_SCALE + phase3Progress * 0.01

        meshRef.current.scale.set(scaleX, scaleY, scaleZ)

        // 완전히 정면으로
        meshRef.current.rotation.x = Math.PI
        meshRef.current.rotation.y = 0
        meshRef.current.rotation.z = Math.PI / 2

        meshRef.current.position.x = 0
      }
      // 중간 대기 (0.4 ~ 0.45)
      else {
        meshRef.current.scale.setScalar(MIN_SCALE)
        meshRef.current.rotation.x = Math.PI + Math.sin(time) * 0.1
        meshRef.current.rotation.y = Math.PI / 2
        meshRef.current.rotation.z = Math.PI / 2
        meshRef.current.position.x = 0
      }
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
