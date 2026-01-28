'use client'

/**
 * ProjectsHorizontal - 프로젝트 가로 슬라이드 섹션
 *
 * 스크롤에 따라 프로젝트 이미지들이 수평으로 이동하며,
 * 뷰포트 중앙에 가까울수록 원색, 멀어질수록 흑백 처리.
 * 이미지 크기는 모두 동일하게 고정.
 */

import { useRef, useMemo, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Image, useScroll } from '@react-three/drei'
import { easing } from 'maath'
import * as THREE from 'three'

import { PROJECTS, PROJECTS_SCROLL } from './projects.config'
import { useProjectModal } from '@/contexts/ProjectModalContext'

interface ProjectItem {
  id: number
  image: string
  index: number
}

interface ProjectImageProps {
  project: ProjectItem
  scrollProgressRef: React.MutableRefObject<number>
}

/** 레이아웃 상수 */
const ITEM_WIDTH = 0.20
const ITEM_HEIGHT = 0.14
const ITEM_GAP = 0.04
const GAUSSIAN_SHARPNESS = 30

/** 가우시안 curve: 중앙=1, 멀어질수록 부드럽게 0 */
function computeCurve(index: number, totalItems: number, scrollProgress: number): number {
  const dist = index / totalItems - scrollProgress
  return Math.exp(-dist * dist * GAUSSIAN_SHARPNESS)
}

/**
 * ProjectImage - 개별 프로젝트 이미지
 * 크기 고정, grayscale만 스크롤에 따라 변화
 */
function ProjectImage({ project, scrollProgressRef }: ProjectImageProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { openModal } = useProjectModal()

  useFrame((state, delta) => {
    if (!meshRef.current) return

    const material = meshRef.current.material as THREE.MeshBasicMaterial & {
      grayscale?: number
    }

    const curve = computeCurve(
      project.index,
      PROJECTS.length,
      scrollProgressRef.current
    )

    // grayscale: 중앙=원색(0), 멀수록=흑백(1)
    if (material.grayscale !== undefined) {
      easing.damp(material, 'grayscale', Math.max(0, 1 - curve), 0.15, delta)
    }
  })

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      ref={meshRef}
      url={project.image}
      position={[project.index * (ITEM_WIDTH + ITEM_GAP), 0, 0]}
      scale={[ITEM_WIDTH, ITEM_HEIGHT]}
      transparent
      onClick={() => openModal(project.id)}
      onPointerOver={() => { document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { document.body.style.cursor = 'auto' }}
    />
  )
}

/**
 * ProjectsHorizontal - 프로젝트 가로 슬라이드 컨테이너
 */
export function ProjectsHorizontal() {
  const groupRef = useRef<THREE.Group>(null)
  const scroll = useScroll()
  const { viewport } = useThree()
  const [isVisible, setIsVisible] = useState(false)

  const scrollProgressRef = useRef(0)

  const projects = useMemo<ProjectItem[]>(() => {
    return PROJECTS.map((project, index) => ({
      id: project.id,
      image: project.image,
      index,
    }))
  }, [])

  const totalWidth = PROJECTS.length * ITEM_WIDTH + (PROJECTS.length - 1) * ITEM_GAP

  useFrame(() => {
    if (!groupRef.current) return

    const scrollOffset = scroll.offset
    const progress = Math.max(
      0,
      Math.min(
        1,
        (scrollOffset - PROJECTS_SCROLL.startOffset) /
          (PROJECTS_SCROLL.expandEndOffset - PROJECTS_SCROLL.startOffset)
      )
    )

    scrollProgressRef.current = progress

    const isInRange =
      scrollOffset >= PROJECTS_SCROLL.startOffset &&
      scrollOffset <= PROJECTS_SCROLL.expandEndOffset
    groupRef.current.visible = isInRange
    setIsVisible(isInRange)

    const slideX = viewport.width / 2 - progress * (totalWidth + viewport.width)
    groupRef.current.position.x = slideX
  })

  return (
    <group ref={groupRef}>
      {projects.map((project) => (
        <ProjectImage
          key={project.id}
          project={project}
          scrollProgressRef={scrollProgressRef}
        />
      ))}
    </group>
  )
}
