'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text, useScroll } from '@react-three/drei'
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

  // 로딩 완료되면 애니메이션 시작
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

    // 스크롤에 따라 텍스트 위로 올라감
    groupRef.current.position.y = scrollOffset * 2

    // 스크롤이 있으면 부드럽게 펼침
    const lerpSpeed = 0.5 // 속도 조절
    if (scrollOffset > 0.01) {
      anim.spread += (1 - anim.spread) * lerpSpeed * delta
    } else {
      // 스크롤 최상단이면 접힘
      anim.spread += (0 - anim.spread) * lerpSpeed * delta
      if (anim.spread < 0.001) anim.spread = 0
    }

    // 배경색 변경: 스크롤에 따라 #efefef로
    bgColorRef.current.copy(whiteColor).lerp(grayColor, scrollOffset)
    scene.background = bgColorRef.current

    groupRef.current.children.forEach((child, index) => {
      // if (child instanceof THREE.Group && child.children.length > 0) {
        // const textMesh = child.children[0] as THREE.Mesh
        // if (textMesh && textMesh.material) {
          // const material = textMesh.material as THREE.MeshBasicMaterial
          // if (index === 0) {
          //   material.opacity = 1
          //   material.transparent = false
          // } else {
          //   material.opacity = 0.85
          //   material.transparent = true
          // }
        // }
      // }

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
