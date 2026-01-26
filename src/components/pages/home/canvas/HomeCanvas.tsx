'use client'

import { Suspense, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { ScrollControls, Preload } from '@react-three/drei'
import { PerspectiveCamera } from 'three'

import { HERO_CAMERA, HERO_SCROLL } from './hero/hero.config'

function ResponsiveCamera() {
  const { camera, size } = useThree()

  useEffect(() => {
    if (camera instanceof PerspectiveCamera) {
      // 모바일: 20, 타블렛 : 10, 노트북: 7, 데스크톱: 5
      const fov = size.width < 640 ? 10 : size.width < 1024 ? 10 : size.width < 1200 ? 7 : 5
      camera.fov = fov
      camera.updateProjectionMatrix()
    }
  }, [camera, size.width])

  return null
}
import { FilterLayer } from '@/components/pages/home/canvas/hero/FilterLayer'
import { TextLayer } from '@/components/pages/home/canvas/hero/TextLayer'
import { ProjectsOrbit } from '@/components/pages/home/canvas/projects/ProjectsOrbit'
import { TemplatesSlide } from '@/components/pages/home/canvas/templates/TemplatesSlide'
import { ContactSection } from '@/components/pages/home/canvas/contact/ContactSection'

interface HomeCanvasProps {
  isLoaded?: boolean
}

export function HomeCanvas({ isLoaded = false }: HomeCanvasProps) {
  return (
    <Canvas
      camera={{
        position: HERO_CAMERA.position,
        fov: HERO_CAMERA.fov,
      }}
      className="w-full h-full"
    >
      <ResponsiveCamera />
      <Suspense fallback={null}>
        <ScrollControls
          damping={HERO_SCROLL.damping}
          pages={HERO_SCROLL.pages}
          distance={HERO_SCROLL.distance}
        >
          <FilterLayer>
            <TextLayer isLoaded={isLoaded} />
            <ProjectsOrbit />
            <TemplatesSlide />
            <ContactSection />
          </FilterLayer>
        </ScrollControls>
        <Preload all />
      </Suspense>
    </Canvas>
  )
}
