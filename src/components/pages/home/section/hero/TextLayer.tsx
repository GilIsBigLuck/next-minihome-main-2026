'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

import { HERO_COLORS, TEXT_COUNT, TEXT_FONT } from '@/constants/three/hero.config'

interface TextConfig {
  position: [number, number, number]
  color: string
}

interface TextLayerProps {
  text?: string
  fontSize?: number
  isLoaded?: boolean
}

// easeInOutCubic
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function TextLayer({ text = 'mini', fontSize = 0.2, isLoaded = false }: TextLayerProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useThree()
  const animationRef = useRef({
    spread: 0,
    phase: 'waiting' as 'waiting' | 'opening' | 'open' | 'closing' | 'closed',
    phaseTime: 0,
    started: false,
  })

  const whiteColor = useMemo(() => new THREE.Color('#ffffff'), [])
  const blackColor = useMemo(() => new THREE.Color('#000000'), [])

  // 로딩 완료되면 애니메이션 시작
  useEffect(() => {
    if (isLoaded && !animationRef.current.started) {
      animationRef.current.started = true
      animationRef.current.phase = 'closed'
      animationRef.current.phaseTime = 0
    }
  }, [isLoaded])

  const ANIMATION_DURATION = 2.5 // 펼치기/접기 시간 (초)
  const DELAY_DURATION = 2 // 대기 시간 (초)

  const textConfigs = useMemo<TextConfig[]>(() => {
    return Array.from({ length: TEXT_COUNT }, (_, index) => ({
      position: [0, 0, 0] as [number, number, number],
      color: HERO_COLORS[index % HERO_COLORS.length],
    }))
  }, [])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    const anim = animationRef.current

    // 로딩 전에는 대기
    if (anim.phase === 'waiting') return

    anim.phaseTime += delta

    switch (anim.phase) {
      case 'opening':
        anim.spread = easeInOutCubic(Math.min(anim.phaseTime / ANIMATION_DURATION, 1))
        if (anim.phaseTime >= ANIMATION_DURATION) {
          anim.phase = 'open'
          anim.phaseTime = 0
        }
        break
      case 'open':
        if (anim.phaseTime >= DELAY_DURATION) {
          anim.phase = 'closing'
          anim.phaseTime = 0
        }
        break
      case 'closing':
        anim.spread = 1 - easeInOutCubic(Math.min(anim.phaseTime / ANIMATION_DURATION, 1))
        if (anim.phaseTime >= ANIMATION_DURATION) {
          anim.phase = 'closed'
          anim.phaseTime = 0
        }
        break
      case 'closed':
        if (anim.phaseTime >= DELAY_DURATION) {
          anim.phase = 'opening'
          anim.phaseTime = 0
        }
        break
    }

    // 배경색 변경: 펼쳐지면 검정, 접히면 하양
    const bgColor = whiteColor.clone().lerp(blackColor, anim.spread)
    scene.background = bgColor

    groupRef.current.children.forEach((child, index) => {
      if (child instanceof THREE.Group && child.children.length > 0) {
        const textMesh = child.children[0] as THREE.Mesh
        if (textMesh && textMesh.material) {
          const material = textMesh.material as THREE.MeshBasicMaterial
          if (index === 0) {
            material.opacity = 1
            material.transparent = false
          } else {
            material.opacity = 0.85
            material.transparent = true
          }
        }
      }

      if (index === 0) {
        // 맨 앞 텍스트: 항상 맨 앞
        child.position.set(0, 0, 0.01 + anim.spread * 0.5)
        return
      }

      // 소용돌이 패턴 (뒤로 흩어짐)
      const angle = index * 0.3
      const radius = index * 0.006

      const targetX = Math.cos(angle) * radius
      const targetY = Math.sin(angle) * radius
      const targetZ = -index * 0.05

      child.position.x = targetX * anim.spread
      child.position.y = targetY * anim.spread
      child.position.z = targetZ * anim.spread
    })
  })

  return (
    <group ref={groupRef}>
      {textConfigs.map((config, index) => (
        <group key={index} position={config.position}>
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
