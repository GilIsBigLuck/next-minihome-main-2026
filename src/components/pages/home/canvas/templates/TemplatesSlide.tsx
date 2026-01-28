'use client'

/**
 * TemplatesSlide - 템플릿 가로 슬라이드 섹션
 *
 * 스크롤 구간(startOffset ~ endOffset)에서 활성화되며,
 * 우측에서 좌측으로 이동하는 가로 슬라이드 + 호버 시 확대 효과.
 *
 * Three.js / R3F / drei 핵심:
 *   - useFrame(): 매 프레임 루프에서 위치/투명도 업데이트
 *   - <Image>: drei 이미지 컴포넌트 (텍스처 자동 로드 + plane mesh)
 *   - useScroll(): ScrollControls 스크롤 상태 (offset: 0~1)
 *   - lerp 보간: delta 기반 수동 선형 보간으로 호버 스케일 애니메이션 구현
 *     → currentValue += (target - currentValue) * speed * delta
 */

import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Image, useScroll } from '@react-three/drei'
import * as THREE from 'three'

import { TEMPLATES, TEMPLATES_SCROLL, TEMPLATES_SLIDE } from './templates.config'
import { useTemplateModal } from '@/contexts/TemplateModalContext'

interface TemplateItem {
  id: number
  image: string
  baseX: number
}

interface TemplateImageProps {
  template: TemplateItem
  isHovered: boolean
  onHover: (id: number | null) => void
  onClick: () => void
}

/**
 * TemplateImage - 개별 템플릿 이미지 (호버 시 110% 확대)
 *
 * 수동 lerp 보간: useFrame에서 매 프레임마다
 *   current += (target - current) * speed * delta
 * 를 적용하여 부드러운 스케일 전환.
 * delta(프레임 시간차)를 곱해 프레임률 독립적 애니메이션 보장.
 */
function TemplateImage({ template, isHovered, onHover, onClick }: TemplateImageProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const currentScale = useRef({ x: TEMPLATES_SLIDE.imageScale[0], y: TEMPLATES_SLIDE.imageScale[1] })

  useFrame((_, delta) => {
    if (!meshRef.current) return

    // 호버 시 1.1배 확대, 아니면 원래 크기로 복원
    const targetX = isHovered ? TEMPLATES_SLIDE.imageScale[0] * 1.1 : TEMPLATES_SLIDE.imageScale[0]
    const targetY = isHovered ? TEMPLATES_SLIDE.imageScale[1] * 1.1 : TEMPLATES_SLIDE.imageScale[1]

    // 수동 lerp: speed * delta로 프레임률 독립적 보간
    const lerpSpeed = 8
    currentScale.current.x += (targetX - currentScale.current.x) * lerpSpeed * delta
    currentScale.current.y += (targetY - currentScale.current.y) * lerpSpeed * delta

    // mesh.scale에 직접 적용 (Three.js Object3D.scale: Vector3)
    meshRef.current.scale.set(currentScale.current.x, currentScale.current.y, 1)
  })

  return (
    <group position={[template.baseX, 0, 0]}>
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image
        ref={meshRef}
        url={template.image}
        scale={TEMPLATES_SLIDE.imageScale}
        transparent
        onClick={onClick}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer'
          onHover(template.id)
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
          onHover(null)
        }}
      />
    </group>
  )
}

/**
 * TemplatesSlide - 템플릿 가로 슬라이드 컨테이너
 *
 * useFrame 루프에서:
 *   1. group.visible: 스크롤 구간 밖이면 숨김 (렌더링 최적화)
 *   2. group.position.x: progress에 비례한 가로 이동
 *   3. material.opacity: 진입/퇴장 시 페이드 인/아웃
 *
 * opacity 제어 시 material.transparent = true 필수.
 * Three.js에서 투명도는 별도 렌더 패스로 처리되므로
 * transparent 플래그 없이는 opacity가 적용되지 않음.
 */
export function TemplatesSlide() {
  const groupRef = useRef<THREE.Group>(null)
  const scroll = useScroll()
  const { openModal } = useTemplateModal()
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  const templates = useMemo<TemplateItem[]>(() => {
    return TEMPLATES.map((template, index) => ({
      id: template.id,
      image: template.image,
      baseX: index * (TEMPLATES_SLIDE.imageScale[0] + TEMPLATES_SLIDE.gap),
    }))
  }, [])

  const totalWidth = templates.length * (TEMPLATES_SLIDE.imageScale[0] + TEMPLATES_SLIDE.gap)

  useFrame(() => {
    if (!groupRef.current) return

    const scrollOffset = scroll.offset

    // 스크롤 구간 내 진행도 정규화 (0~1)
    const progress = Math.max(
      0,
      Math.min(1, (scrollOffset - TEMPLATES_SCROLL.startOffset) / (TEMPLATES_SCROLL.endOffset - TEMPLATES_SCROLL.startOffset))
    )

    // group.visible: false면 Three.js가 해당 그룹 전체를 렌더링에서 제외
    groupRef.current.visible = scrollOffset >= TEMPLATES_SCROLL.startOffset && scrollOffset <= TEMPLATES_SCROLL.endOffset

    // 가로 슬라이드: 우측(0.5)에서 시작 → 좌측으로 이동
    const slideOffset = progress * (totalWidth + 0.8)
    groupRef.current.position.x = 0.5 - slideOffset

    groupRef.current.position.y = 0

    // 페이드 인/아웃: material.opacity 직접 제어
    // fadeIn: 진입 시 빠르게 (progress * 3)
    // fadeOut: 퇴장 시 빠르게 (progress 0.7 이후)
    groupRef.current.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const material = child.material as THREE.MeshBasicMaterial
        const fadeIn = Math.min(1, progress * 3)
        const fadeOut = Math.max(0, 1 - (progress - 0.7) * 3)
        material.opacity = Math.min(fadeIn, fadeOut)
        material.transparent = true  // opacity 적용에 필수
      }
    })
  })

  return (
    <group ref={groupRef} position={[0.5, 0, 0.3]}>
      {templates.map((template) => (
        <TemplateImage
          key={template.id}
          template={template}
          isHovered={hoveredId === template.id}
          onHover={setHoveredId}
          onClick={() => openModal(template.id)}
        />
      ))}
    </group>
  )
}
