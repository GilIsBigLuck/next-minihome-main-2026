'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Preload } from '@react-three/drei'

import { HERO_CAMERA, HERO_SCROLL } from './hero/hero.config'
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
