'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text, useScroll } from '@react-three/drei'
import * as THREE from 'three'

import { HERO_COLORS, TEXT_COUNT, TEXT_FONT } from './hero.config'

interface TextConfig {
  position: [number, number, number]
  color: string
}

interface TextLayerProps {
  text?: string
  fontSize?: number
  isLoaded?: boolean
}

export function TextLayer({ text = 'mini', fontSize = 0.2, isLoaded = false }: TextLayerProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useThree()
  const scroll = useScroll()
  const animationRef = useRef({
    spread: 0,
    started: false,
  })

  const whiteColor = useMemo(() => new THREE.Color('#ffffff'), [])
  const grayColor = useMemo(() => new THREE.Color('#efefef'), [])
  const bgColorRef = useRef(new THREE.Color('#ffffff'))

  useEffect(() => {
    if (isLoaded && !animationRef.current.started) {
      animationRef.current.started = true
    }
  }, [isLoaded])

  const textConfigs = useMemo<TextConfig[]>(() => {
    return Array.from({ length: TEXT_COUNT }, (_, index) => ({
      position: [0, 0, 0] as [number, number, number],
      color: HERO_COLORS[index % HERO_COLORS.length],
    }))
  }, [])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    const anim = animationRef.current
    const scrollOffset = scroll.offset

    groupRef.current.position.y = scrollOffset * 2

    const lerpSpeed = 0.5
    if (scrollOffset > 0.01) {
      anim.spread += (1 - anim.spread) * lerpSpeed * delta
    } else {
      anim.spread += (0 - anim.spread) * lerpSpeed * delta
      if (anim.spread < 0.001) anim.spread = 0
    }

    bgColorRef.current.copy(whiteColor).lerp(grayColor, scrollOffset)
    scene.background = bgColorRef.current

    groupRef.current.children.forEach((child, index) => {
      if (index === 0) {
        child.position.set(0, 0, 0.01 + anim.spread * 0.5)
        return
      }

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
