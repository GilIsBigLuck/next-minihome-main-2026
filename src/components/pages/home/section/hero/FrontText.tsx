'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

interface FrontTextProps {
  text?: string
  fontSize?: number
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function FrontText({ text = 'mini', fontSize = 0.2 }: FrontTextProps) {
  const groupRef = useRef<THREE.Group>(null)
  const animationRef = useRef({
    spread: 0,
    phase: 'opening' as 'opening' | 'open' | 'closing' | 'closed',
    phaseTime: 0,
  })

  const ANIMATION_DURATION = 2.5
  const DELAY_DURATION = 2

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

    // 펼쳐질 때 앞으로 이동 (z 양수)
    groupRef.current.position.z = anim.spread * 0.5

    // spread가 0.7 이상일 때만 fade in
    const textMesh = groupRef.current.children[0]?.children[0] as THREE.Mesh
    if (textMesh?.material && 'opacity' in textMesh.material) {
      const mat = textMesh.material as THREE.MeshBasicMaterial
      mat.transparent = true
      mat.opacity = anim.spread > 0.7 ? (anim.spread - 0.7) / 0.3 : 0
    }
  })

  return (
    <group ref={groupRef}>
      <Text
        fontSize={fontSize}
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        color="#000000"
      >
        {text}
      </Text>
    </group>
  )
}
