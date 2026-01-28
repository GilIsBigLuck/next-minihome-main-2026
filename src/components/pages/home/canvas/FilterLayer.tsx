'use client'

/**
 * FilterLayer - FBO(Frame Buffer Object) 기반 유리/투과 필터 효과
 *
 * 핵심 기법: Render-to-Texture + MeshTransmissionMaterial
 *
 * 작동 원리:
 *   1. children(TextLayer, Projects 등)을 별도 Scene에 createPortal로 렌더링
 *   2. useFBO()로 생성한 프레임 버퍼에 해당 Scene을 오프스크린 렌더링
 *   3. 결과 텍스처를 배경 plane에 적용 + GLB 모델의 MeshTransmissionMaterial에 전달
 *   4. 투과 재질이 배경 텍스처를 굴절/왜곡하여 유리 렌즈 효과 연출
 *
 * Three.js / R3F / drei 핵심 API:
 *   - createPortal(children, scene): R3F의 포탈. children을 다른 Scene에 렌더링
 *   - useFBO(): Frame Buffer Object 생성 훅. 오프스크린 렌더링 텍스처 반환
 *   - useGLTF(): GLB/GLTF 3D 모델 로더. nodes로 메시 geometry에 접근
 *   - MeshTransmissionMaterial: drei의 물리 기반 투과 재질 (유리, 보석 등)
 *   - useScroll(): ScrollControls의 스크롤 진행도 (offset: 0~1)
 *   - state.gl: WebGLRenderer 인스턴스
 *   - state.gl.setRenderTarget(fbo): 렌더링 대상을 FBO로 전환 (null=화면)
 */

import { useRef, useState } from 'react'

import * as THREE from 'three'
import { createPortal, useFrame } from '@react-three/fiber'
import { useFBO, useGLTF, MeshTransmissionMaterial, useScroll } from '@react-three/drei'

import { useNoiseTexture } from '@/hooks/three/useNoiseTexture'
import { FILTER_MATERIAL } from './hero/hero.config'

/**
 * 스크롤 구간별 필터 메시 변형 단계
 * - Phase 1 (0 ~ 0.4): 축소 + 회전
 * - 대기 (0.4 ~ 0.55): 최소 크기로 유지
 * - Phase 2 (0.55 ~ 0.65): 사각형 변형 + 정면 회전
 * - Phase 3 (0.88 ~ 1.0): 화면 꽉 채우기
 */
const BASE_SCALE = 0.15   // 필터 메시 초기 크기
const MIN_SCALE = 0.04    // Phase 1 종료 시 최소 크기
const PHASE1_END = 0.4
const PHASE2_START = 0.58
const PHASE2_END = 0.6
const PHASE3_START = 0.8
const PHASE3_END = 1.0

interface FilterLayerProps {
  children: React.ReactNode
}

export function FilterLayer({ children }: FilterLayerProps) {

  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshPhysicalMaterial & { roughness: number; metalness: number }>(null)

  /** useGLTF: GLB 파일을 로드하고 nodes(메시), materials 등을 반환 */
  const { nodes } = useGLTF('/3d-assets/filter-layer.glb')
  /** useFBO: 오프스크린 렌더 텍스처 생성. buffer.texture로 결과물 접근 */
  const buffer = useFBO()
  /** 별도 Scene: children을 여기에 포탈하여 FBO에 렌더링 */
  const [scene, _setScene] = useState(() => new THREE.Scene())
  /** 커스텀 노이즈 텍스처 (roughnessMap에 사용) */
  const noiseTexture = useNoiseTexture()
  const scroll = useScroll()

  useFrame((state) => {
    // FBO 렌더링: children이 포탈된 scene을 오프스크린 버퍼에 렌더
    state.gl.setRenderTarget(buffer)      // 렌더 대상을 FBO로 전환
    state.gl.setClearColor('#ffffff')      // FBO 배경색 설정
    state.gl.render(scene, state.camera)   // scene을 FBO에 렌더링
    state.gl.setRenderTarget(null)         // 렌더 대상을 다시 화면으로 복원

    /** state.clock.elapsedTime: R3F 렌더 시작 이후 경과 시간(초). 시간 기반 애니메이션에 사용 */
    const time = state.clock.elapsedTime
    const scrollOffset = scroll.offset

    // 재질 속성을 시간에 따라 sin/cos로 미세 변동 (숨쉬는 듯한 효과)
    if (materialRef.current) {
      materialRef.current.roughness = 0.3 + Math.sin(time * 1.5) * 0.1
      materialRef.current.metalness = 0.8 + Math.cos(time * 2) * 0.2
    }

    if (meshRef.current) {
      // Phase 1: 축소 + 회전
      if (scrollOffset <= PHASE1_END) {
        const phase1Progress = scrollOffset / PHASE1_END
        const scale = BASE_SCALE - (BASE_SCALE - MIN_SCALE) * phase1Progress
        meshRef.current.scale.setScalar(scale)
        meshRef.current.rotation.x = phase1Progress * Math.PI + Math.sin(time) * 0.1
        meshRef.current.rotation.y = phase1Progress * (Math.PI / 2)
        meshRef.current.rotation.z = phase1Progress * (Math.PI / 2)
        meshRef.current.position.x = 0
      }
      // Phase 2: 사각형 변형 + 확대
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
      // Phase 3: 화면 꽉 채우기
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
      {/* createPortal: children(TextLayer, Projects 등)을 별도 scene에 렌더링 */}
      {createPortal(children, scene)}

      {/* 배경 plane: FBO 텍스처를 화면 전체에 표시 (children의 렌더 결과) */}
      <mesh scale={[1, 1, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} />
      </mesh>

      {/*
        필터 메시: GLB 모델의 Cylinder geometry + MeshTransmissionMaterial
        - buffer 속성에 FBO 텍스처를 전달하여 투과/굴절 효과의 배경으로 사용
        - roughnessMap: 노이즈 텍스처로 표면의 불규칙한 거칠기 표현
        - 스크롤에 따라 scale/rotation이 Phase별로 변형됨
      */}
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

/** useGLTF.preload: GLB 파일을 사전 로드하여 컴포넌트 마운트 시 지연 방지 */
useGLTF.preload('/3d-assets/filter-layer.glb')
