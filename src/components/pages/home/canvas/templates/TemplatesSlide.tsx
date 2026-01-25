'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Image, useScroll } from '@react-three/drei'
import * as THREE from 'three'

import { TEMPLATE_IMAGES, TEMPLATES_SCROLL, TEMPLATES_SLIDE } from './templates.config'

interface TemplateItem {
  id: number
  image: string
  baseX: number
}

export function TemplatesSlide() {
  const groupRef = useRef<THREE.Group>(null)
  const scroll = useScroll()

  const templates = useMemo<TemplateItem[]>(() => {
    return TEMPLATE_IMAGES.map((img, index) => ({
      id: index,
      image: img,
      baseX: index * (TEMPLATES_SLIDE.imageScale[0] + TEMPLATES_SLIDE.gap),
    }))
  }, [])

  const totalWidth = templates.length * (TEMPLATES_SLIDE.imageScale[0] + TEMPLATES_SLIDE.gap)

  useFrame(() => {
    if (!groupRef.current) return

    const scrollOffset = scroll.offset

    const progress = Math.max(
      0,
      Math.min(1, (scrollOffset - TEMPLATES_SCROLL.startOffset) / (TEMPLATES_SCROLL.endOffset - TEMPLATES_SCROLL.startOffset))
    )

    // 스크롤 구간에서만 보이기
    groupRef.current.visible = scrollOffset >= TEMPLATES_SCROLL.startOffset && scrollOffset <= TEMPLATES_SCROLL.endOffset

    // 우측에서 좌측으로 슬라이드 (progress에 따라 완전히 사라짐)
    const slideOffset = progress * (totalWidth + 0.8)
    groupRef.current.position.x = 0.5 - slideOffset

    // y 위치 고정 (카메라 시야 내)
    groupRef.current.position.y = 0

    // 페이드 인/아웃
    groupRef.current.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const material = child.material as THREE.MeshBasicMaterial
        const fadeIn = Math.min(1, progress * 3)
        const fadeOut = Math.max(0, 1 - (progress - 0.7) * 3)
        material.opacity = Math.min(fadeIn, fadeOut)
        material.transparent = true
      }
    })
  })

  return (
    <group ref={groupRef} position={[0.5, 0, 0.3]}>
      {templates.map((template) => (
        <group key={template.id} position={[template.baseX, 0, 0]}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image
            url={template.image}
            scale={TEMPLATES_SLIDE.imageScale}
            transparent
          />
        </group>
      ))}
    </group>
  )
}
