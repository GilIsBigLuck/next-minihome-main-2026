'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Preload } from '@react-three/drei'

import { HERO_CAMERA, HERO_SCROLL } from '@/constants/three/hero.config'
import { FilterLayer } from './FilterLayer'
import { TextLayer } from './TextLayer'
import { FrontText } from './FrontText'

export function HeroCanvas() {
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
            <TextLayer />
          </FilterLayer>
          {/* <FrontText /> */}
        </ScrollControls>
        <Preload all />
      </Suspense>
    </Canvas>
  )
}
