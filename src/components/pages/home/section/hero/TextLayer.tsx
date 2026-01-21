'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
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
}

// easeInOutCubic
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function TextLayer({ text = 'mini', fontSize = 0.2 }: TextLayerProps) {
  const groupRef = useRef<THREE.Group>(null)
  const animationRef = useRef({
    spread: 0,
    phase: 'closed' as 'opening' | 'open' | 'closing' | 'closed',
    phaseTime: 0,
  })

  const ANIMATION_DURATION = 2.5 // 펼치기/접기 시간 (초)
  const DELAY_DURATION = 2 // 대기 시간 (초)

  const textConfigs = useMemo<TextConfig[]>(() => {
    // index 0 포함 (뒤에 있을 때 왜곡 효과용)
    return Array.from({ length: TEXT_COUNT }, (_, index) => ({
      position: [0, 0, 0] as [number, number, number],
      color: HERO_COLORS[index % HERO_COLORS.length],
    }))
  }, [])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    const anim = animationRef.current
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

    groupRef.current.children.forEach((child, index) => {
      if (index === 0) {
        // 맨 앞 텍스트 (검정): 항상 맨 앞 (초기에도 약간 앞에)
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
