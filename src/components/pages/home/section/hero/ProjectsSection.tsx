'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Image, useScroll } from '@react-three/drei'
import * as THREE from 'three'

interface ProjectItem {
  id: number
  image: string
  position: [number, number, number]
}

const PROJECT_IMAGES = [
  '/images/img1.jpg',
  '/images/img2.jpg',
  '/images/img3.jpg',
  '/images/img4.jpg',
  '/images/img5.jpg',
  '/images/img6.jpg',
  '/images/img7.jpg',
  '/images/img8.jpg',
]

// mesh가 최소 스케일에 도달하는 scrollOffset 계산
// scale = BASE_SCALE - (BASE_SCALE - MIN_SCALE) * scrollOffset
// MIN_SCALE = 0.04, BASE_SCALE = 0.15
// scrollOffset = 1.0일 때 MIN_SCALE 도달
const PROJECTS_START_OFFSET = 0.85 // mesh가 거의 최소 크기에 도달할 때 시작
const PROJECTS_FULL_OFFSET = 1.0 // mesh가 완전히 최소 크기일 때 완전히 나타남

export function ProjectsSection() {
  const groupRef = useRef<THREE.Group>(null)
  const titleRef = useRef<THREE.Group>(null)
  const projectRefs = useRef<(THREE.Group | null)[]>([])
  const scroll = useScroll()

  // 좌우 프로젝트 배치 (TextLayer의 텍스트 위치와 비슷하게)
  // TextLayer는 fontSize 0.2를 사용하고, position은 [0, 0, 0]에서 시작
  const leftProjects = useMemo<ProjectItem[]>(() => {
    return PROJECT_IMAGES.slice(0, 4).map((img, index) => ({
      id: index,
      image: img,
      position: [-0.3, -index * 0.15 - 0.1, 0] as [number, number, number], // 매우 작은 값으로 시작
    }))
  }, [])

  const rightProjects = useMemo<ProjectItem[]>(() => {
    return PROJECT_IMAGES.slice(4, 8).map((img, index) => ({
      id: index + 4,
      image: img,
      position: [0.3, -index * 0.15 - 0.1, 0] as [number, number, number], // 매우 작은 값으로 시작
    }))
  }, [])

  const allProjects = useMemo(() => [...leftProjects, ...rightProjects], [leftProjects, rightProjects])

  useFrame(() => {
    if (!groupRef.current || !titleRef.current) return

    const scrollOffset = scroll.offset

    // PROJECTS 섹션이 나타나기 시작하는 시점 계산
    const progress = Math.max(
      0,
      Math.min(1, (scrollOffset - PROJECTS_START_OFFSET) / (PROJECTS_FULL_OFFSET - PROJECTS_START_OFFSET))
    )

    // mesh가 최소 크기에 도달할 때만 보이도록
    groupRef.current.visible = progress > 0.1

    // TextLayer처럼 스크롤에 따라 y 위치 조정 (카메라 시야 안에 유지)
    // TextLayer는 position.y = scrollOffset * 2를 사용
    groupRef.current.position.y = scrollOffset * 2

    // 제목 위치 (TextLayer의 텍스트와 비슷한 위치)
    // TextLayer의 첫 번째 텍스트는 position [0, 0, 0.01 + anim.spread * 0.5]
    titleRef.current.position.y = 0.5 // 고정 위치로 먼저 테스트
    titleRef.current.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const material = child.material as THREE.MeshBasicMaterial
        material.opacity = Math.max(0.3, progress) // 최소 0.3로 보이도록
        material.transparent = true
      }
    })

    // 프로젝트 아이템들 패럴랙스 효과
    allProjects.forEach((project, index) => {
      const projectRef = projectRefs.current[index]
      if (!projectRef) return

      const basePosition = project.position

      // 패럴랙스: 각 프로젝트마다 다른 속도로 이동 (카메라 시야 안에서)
      const parallaxSpeed = 0.3 + (index % 3) * 0.2
      const parallaxOffset = Math.max(0, (scrollOffset - PROJECTS_START_OFFSET)) * parallaxSpeed

      // 좌우 프로젝트는 반대 방향으로 (더 작은 범위로 조정)
      const direction = index < 4 ? -1 : 1
      projectRef.position.x = basePosition[0] + parallaxOffset * direction * 0.15
      projectRef.position.y = basePosition[1] + parallaxOffset * 0.1

      // 페이드인
      projectRef.children.forEach((mesh) => {
        if (mesh instanceof THREE.Mesh && mesh.material) {
          const material = mesh.material as THREE.MeshBasicMaterial
          const itemProgress = Math.max(
            0.3, // 최소 0.3로 보이도록
            Math.min(1, (progress - index * 0.1) * 1.5)
          )
          material.opacity = itemProgress
          material.transparent = true
        }
      })
    })
  })

  return (
    <group ref={groupRef} position={[0, 0, 0.5]}>
      {/* PROJECTS 제목 - TextLayer와 같은 크기로, z를 앞으로 */}
      <group ref={titleRef} position={[0, 0.5, 0]}>
        <Text
          font="/fonts/Rubik-Black.ttf"
          fontSize={0.2}
          anchorX="center"
          anchorY="middle"
          color="#0e776c"
          position={[0, 0, 0.5]}
        >
          PROJECTS
        </Text>
      </group>

      {/* 프로젝트 리스트 */}
      {allProjects.map((project, index) => (
        <group
          key={project.id}
          ref={(el) => {
            projectRefs.current[index] = el
          }}
          position={[project.position[0], project.position[1], 0.5]}
        >
          <Image
            url={project.image}
            scale={0.2}
            transparent
          />
        </group>
      ))}
    </group>
  )
}
