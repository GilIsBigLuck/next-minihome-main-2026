'use client'

import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Image, useScroll } from '@react-three/drei'
import * as THREE from 'three'

import { PROJECTS, PROJECTS_SCROLL, PROJECTS_ORBIT } from './projects.config'
import { useProjectModal } from '@/contexts/ProjectModalContext'

interface ProjectItem {
  id: number
  image: string
  baseAngle: number
}

interface ProjectImageProps {
  project: ProjectItem
  isHovered: boolean
  onHover: (id: number | null) => void
  onClick: () => void
  groupRef: (el: THREE.Group | null) => void
}

function ProjectImage({ project, isHovered, onHover, onClick, groupRef }: ProjectImageProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const currentScale = useRef({ x: PROJECTS_ORBIT.imageScale[0], y: PROJECTS_ORBIT.imageScale[1] })

  useFrame((_, delta) => {
    if (!meshRef.current) return

    const targetX = isHovered ? PROJECTS_ORBIT.imageScale[0] * 1.15 : PROJECTS_ORBIT.imageScale[0]
    const targetY = isHovered ? PROJECTS_ORBIT.imageScale[1] * 1.15 : PROJECTS_ORBIT.imageScale[1]

    const lerpSpeed = 8
    currentScale.current.x += (targetX - currentScale.current.x) * lerpSpeed * delta
    currentScale.current.y += (targetY - currentScale.current.y) * lerpSpeed * delta

    meshRef.current.scale.set(currentScale.current.x, currentScale.current.y, 1)
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image
        ref={meshRef}
        url={project.image}
        scale={PROJECTS_ORBIT.imageScale}
        transparent
        onClick={onClick}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer'
          onHover(project.id)
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
          onHover(null)
        }}
      />
    </group>
  )
}

export function ProjectsOrbit() {
  const groupRef = useRef<THREE.Group>(null)
  const projectRefs = useRef<(THREE.Group | null)[]>([])
  const scroll = useScroll()
  const { openModal } = useProjectModal()
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  const projects = useMemo<ProjectItem[]>(() => {
    return PROJECTS.map((project, index) => ({
      id: project.id,
      image: project.image,
      baseAngle: (index / PROJECTS.length) * Math.PI * 2,
    }))
  }, [])

  useFrame(() => {
    if (!groupRef.current) return

    const scrollOffset = scroll.offset

    // Phase 1: 펼침 (0.4 ~ 0.5)
    const openProgress = Math.max(
      0,
      Math.min(1, (scrollOffset - PROJECTS_SCROLL.startOffset) / (PROJECTS_SCROLL.fullOffset - PROJECTS_SCROLL.startOffset))
    )

    // Phase 2: 회전 (0.5 ~ 0.6) - 2바퀴
    const rotateProgress = scrollOffset > PROJECTS_SCROLL.fullOffset
      ? Math.min(1, (scrollOffset - PROJECTS_SCROLL.fullOffset) / (PROJECTS_SCROLL.rotateEndOffset - PROJECTS_SCROLL.fullOffset))
      : 0

    // Phase 3: 멀어지기 (0.6 ~ 0.7)
    const expandProgress = scrollOffset > PROJECTS_SCROLL.rotateEndOffset
      ? Math.min(1, (scrollOffset - PROJECTS_SCROLL.rotateEndOffset) / (PROJECTS_SCROLL.expandEndOffset - PROJECTS_SCROLL.rotateEndOffset))
      : 0

    const isInRange = scrollOffset >= PROJECTS_SCROLL.startOffset && scrollOffset <= PROJECTS_SCROLL.expandEndOffset
    groupRef.current.visible = isInRange && openProgress > 0.05

    projects.forEach((project, index) => {
      const projectRef = projectRefs.current[index]
      if (!projectRef) return

      // 회전 각도: 펼침 시 약간 + 회전 phase에서 반바퀴
      const currentAngle = project.baseAngle + openProgress * Math.PI * 0.1 + rotateProgress * Math.PI * 0.5

      // 반지름: 펼침 시 고정, 멀어지기 phase에서 확대
      const radius = PROJECTS_ORBIT.radius * (1 + expandProgress * 5)

      const x = Math.cos(currentAngle) * radius
      const y = Math.sin(currentAngle) * radius

      projectRef.position.x = x * openProgress
      projectRef.position.y = y * openProgress
      projectRef.position.z = 0

      // 페이드인 (나타날 때만)
      projectRef.children.forEach((mesh) => {
        if (mesh instanceof THREE.Mesh && mesh.material) {
          const material = mesh.material as THREE.MeshBasicMaterial
          const delay = index * 0.05
          const fadeIn = Math.max(0, Math.min(1, (openProgress - delay) * 2))
          material.opacity = fadeIn
          material.transparent = true
        }
      })
    })
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {projects.map((project, index) => (
        <ProjectImage
          key={project.id}
          project={project}
          isHovered={hoveredId === project.id}
          onHover={setHoveredId}
          onClick={() => openModal(project.id)}
          groupRef={(el) => {
            projectRefs.current[index] = el
          }}
        />
      ))}
    </group>
  )
}
