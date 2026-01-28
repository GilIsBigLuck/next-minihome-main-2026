'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, useScroll } from '@react-three/drei'
import * as THREE from 'three'

import { HERO_TEXT_COLORS, TEXT_COUNT, TEXT_FONT } from './hero.config'

interface TextConfig {
  position: [number, number, number]
  color: string
}

interface TextLayerProps {
  text?: string
  fontSize?: number
  isLoaded?: boolean
}

/**
 * TextLayer - Hero 섹션의 텍스트 애니메이션 레이어
 *
 * TEXT_COUNT 의 동일 텍스트를 겹쳐 렌더링하고,
 * 스크롤에 따라 나선형으로 펼쳐지는(spread) 효과를 구현.
 *
 * Three.js 핵심 개념:
 *   - useThree().scene: R3F가 자동 생성한 THREE.Scene 객체. scene.background로 배경색 제어
 *   - useScroll(): drei의 ScrollControls와 연동된 스크롤 상태 훅. offset(0~1)으로 진행도 제공
 *   - useFrame(callback, priority): 매 프레임(~60fps) 호출되는 렌더 루프 훅.
 *     delta 인자는 이전 프레임과의 시간차(초)로, 프레임률 독립적 애니메이션에 사용
 *   - THREE.Color.lerp(): 두 색상 간 선형 보간 (Linear Interpolation)
 *   - THREE.Group: 여러 Object3D를 묶는 컨테이너. children으로 하위 객체에 접근
 */
export function TextLayer({ text = 'mini', fontSize = 0.2, isLoaded = false }: TextLayerProps) {
  const groupRef = useRef<THREE.Group>(null)

  /** useScroll(): drei ScrollControls의 스크롤 상태. offset은 0(최상단)~1(최하단) */
  const scroll = useScroll()

  const animationRef = useRef({
    spread: 0,    // 텍스트 펼침 정도 (0=겹침, 1=완전 펼침)
    started: false,
  })

  useEffect(() => {
    if (isLoaded && !animationRef.current.started) {
      animationRef.current.started = true
    }
  }, [isLoaded])

  /** 텍스트 인스턴스 설정 배열 생성 (위치 + 색상) */
  const textConfigs = useMemo<TextConfig[]>(() => {
    return Array.from({ length: TEXT_COUNT }, (_, index) => ({
      position: [0, 0, 0] as [number, number, number],
      color: HERO_TEXT_COLORS[index % HERO_TEXT_COLORS.length],
    }))
  }, [])

  /**
   * useFrame 렌더 루프 - 매 프레임 실행
   * 1) 스크롤에 따라 그룹 Y 위치 이동
   * 2) spread 값을 lerp로 부드럽게 전환 (스크롤 시 펼침, 정지 시 수렴)
   * 3) scene.background 색상 보간
   * 4) 각 텍스트를 나선형(cos/sin)으로 배치 (spread 비례)
   */
  useFrame((_, delta) => {
    if (!groupRef.current) return

    const anim = animationRef.current
    const scrollOffset = scroll.offset

    // 스크롤에 따라 그룹 전체를 위로 이동
    groupRef.current.position.y = scrollOffset * 2

    // spread 값 lerp: target으로 부드럽게 수렴 (delta로 프레임률 독립)
    const lerpSpeed = 1
    if (scrollOffset > 0.01) {
      anim.spread += (1 - anim.spread) * lerpSpeed * delta
    } else {
      anim.spread += (0 - anim.spread) * lerpSpeed * delta
      if (anim.spread < 0.001) anim.spread = 0
    }

    // 각 텍스트 인스턴스를 나선형으로 배치
    groupRef.current.children.forEach((child, index) => {
      // 첫 번째 텍스트는 최전면에 고정 (z=0.01 + spread 보정)
      if (index === 0) {
        child.position.set(0, 0, 0.01 + anim.spread * 0.5)
        return
      }

      // 나선형 배치: angle(각도)과 radius(반지름)이 index에 비례
      const angle = index * 0.3
      const radius = index * 0.006

      const targetX = Math.cos(angle) * radius
      const targetY = Math.sin(angle) * radius
      const targetZ = -index * 0.05  // 뒤쪽으로 점점 밀림 (깊이감)

      // spread 값에 비례하여 위치 적용 (0이면 원점에 겹침)
      child.position.x = targetX * anim.spread
      child.position.y = targetY * anim.spread
      child.position.z = targetZ * anim.spread
    })
  })

  return (
    <group ref={groupRef}>
      {textConfigs.map((config, index) => (
        <group key={index} position={config.position}>
          {/*
            drei <Text>: troika-three-text 기반 SDF 텍스트 렌더링
            - font: TTF/OTF 폰트 파일 경로
            - anchorX/anchorY: 텍스트 정렬 기준점 (center = 중앙 정렬)
            - color: 텍스트 색상 (hero.config의 팔레트에서 순환)
          */}
          <Text
            font={TEXT_FONT}
            fontSize={fontSize}
            anchorX="center"
            anchorY="middle"
            textAlign="center"
            color={config.color}
          >
            {text}
          </Text>
        </group>
      ))}
    </group>
  )
}
