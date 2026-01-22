'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { useRouter } from '@/i18n/routing'

/**
 * r3f에서 클릭 이벤트를 사용한 예시 컴포넌트
 * 
 * 사용 방법:
 * 1. onClick: 클릭 이벤트
 * 2. onPointerOver/onPointerOut: 호버 이벤트
 * 3. onPointerDown/onPointerUp: 마우스 다운/업 이벤트
 * 4. useRouter: Next.js 페이지 이동
 */
export function ClickableExample() {
  const meshRef = useRef<THREE.Mesh>(null)
  const router = useRouter()

  // 호버 효과를 위한 애니메이션
  useFrame((state) => {
    if (meshRef.current) {
      // 부드러운 회전
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  const handleClick = () => {
    // 페이지 이동 예시
    router.push('/about') // 또는 다른 경로
    console.log('클릭됨! 페이지 이동')
  }

  const handlePointerOver = (e: any) => {
    // 호버 시 커서 변경
    document.body.style.cursor = 'pointer'
    // 스케일 확대
    if (e.object) {
      e.object.scale.setScalar(1.2)
    }
  }

  const handlePointerOut = (e: any) => {
    // 호버 해제 시 커서 복원
    document.body.style.cursor = 'default'
    // 스케일 복원
    if (e.object) {
      e.object.scale.setScalar(1)
    }
  }

  return (
    <group>
      {/* 방법 1: mesh에 직접 이벤트 추가 */}
      <mesh
        ref={meshRef}
        position={[0, 0, 0]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>

      {/* 방법 2: Text 컴포넌트에 이벤트 추가 */}
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        클릭하세요
      </Text>

      {/* 방법 3: group으로 감싸서 여러 요소에 동일한 이벤트 적용 */}
      <group
        onClick={() => router.push('/contact')}
        onPointerOver={(e) => {
          document.body.style.cursor = 'pointer'
          e.stopPropagation()
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default'
        }}
      >
        <mesh position={[2, 0, 0]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="orange" />
        </mesh>
        <Text position={[2, -0.8, 0]} fontSize={0.2} color="white">
          Contact
        </Text>
      </group>
    </group>
  )
}
