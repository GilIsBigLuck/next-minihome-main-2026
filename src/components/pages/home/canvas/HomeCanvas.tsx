'use client'

import { Suspense, useEffect } from 'react'
import { Canvas, useThree, extend } from '@react-three/fiber'
import { ScrollControls, Preload, Image } from '@react-three/drei'
import { PerspectiveCamera } from 'three'

// drei의 Image 컴포넌트를 R3F에 등록
extend({ Image })

import { FilterLayer } from '@/components/pages/home/canvas/FilterLayer'
import { TextLayer } from '@/components/pages/home/canvas/hero/TextLayer'
import { ProjectsHorizontal } from '@/components/pages/home/canvas/projects/ProjectsHorizontal'
import { TemplatesSlide } from '@/components/pages/home/canvas/templates/TemplatesSlide'
import { ContactSection } from '@/components/pages/home/canvas/contact/ContactSection'

import { HOME_CANVAS_CAMERA, HOME_CANVAS_SCROLL } from './hero/hero.config'

/**
 * ResponsiveCamera
 * 뷰포트 너비에 따라 PerspectiveCamera의 FOV(시야각)를 동적으로 조정하는 컴포넌트.
 *
 * useThree(): R3F의 내부 상태(camera, size, gl 등)에 접근하는 훅.
 *   - camera: 현재 활성 카메라 (PerspectiveCamera | OrthographicCamera)
 *   - size: 캔버스의 픽셀 크기 { width, height }
 *
 * camera.updateProjectionMatrix(): FOV, aspect 등 카메라 속성 변경 후
 *   반드시 호출해야 투영 행렬이 재계산되어 화면에 반영됨.
 *
 * FOV 매핑:
 *   - 모바일 (<640px): 10  → 넓은 화각으로 더 많은 영역 표시
 *   - 타블렛 (<1024px): 10
 *   - 노트북 (<1200px): 7
 *   - 데스크톱 (≥1200px): 5 → 좁은 화각(확대 효과)
 */
function ResponsiveCamera() {

  const { camera, size } = useThree()

  useEffect(() => {
    if (camera instanceof PerspectiveCamera) {
      const fov = size.width < 640 ? 10 : size.width < 1024 ? 10 : size.width < 1200 ? 7 : 5
      camera.fov = fov
      camera.updateProjectionMatrix()
    }
  }, [camera, size.width])

  return null
}

interface HomeCanvasProps {
  isLoaded?: boolean
}

/**
 * HomeCanvas - 메인 3D 캔버스 컨테이너
 *
 * 구조:
 *   <Canvas>                    → R3F의 WebGL 렌더러 + Scene + Camera 자동 생성
 *     <ResponsiveCamera />      → 뷰포트별 FOV 동적 조정
 *     <Suspense>                → 비동기 리소스(폰트, 텍스처, GLB) 로딩 대기
 *       <ScrollControls>        → drei의 가상 스크롤 시스템 (DOM 스크롤 → 3D 공간 매핑)
 *         <FilterLayer>         → FBO + MeshTransmissionMaterial 기반 유리 필터 효과
 *           <TextLayer />       → Hero 텍스트 애니메이션 (150개 텍스트 겹침 + 스프레드)
 *           <ProjectsHorizontal /> → 프로젝트 가로 슬라이드 (Html 기반 이미지)
 *           <TemplatesSlide />  → 템플릿 가로 슬라이드 (호버 확대 + 모달)
 *           <ContactSection />  → 컨택트 폼 (Html 컴포넌트로 DOM 삽입)
 *         </FilterLayer>
 *       </ScrollControls>
 *       <Preload all />         → 모든 drei 리소스(텍스처, GLTF 등)를 미리 로드
 *     </Suspense>
 *   </Canvas>
 */
export function HomeCanvas({ isLoaded = false }: HomeCanvasProps) {
  return (
    <div id="homeCanvas" className="w-full h-full fixed top-0 left-0 z-canvas">
      <Canvas
        camera={{
          position: HOME_CANVAS_CAMERA.position,
          fov: HOME_CANVAS_CAMERA.fov,
        }}
      >
        <ResponsiveCamera />
        <Suspense fallback={null}>
          <ScrollControls
            damping={HOME_CANVAS_SCROLL.damping}
            pages={HOME_CANVAS_SCROLL.pages}
            distance={HOME_CANVAS_SCROLL.distance}
          >
            <FilterLayer>
              <TextLayer isLoaded={isLoaded} />
              {/* <ProjectsHorizontal /> */}
              <TemplatesSlide />
              <ContactSection />
            </FilterLayer>
          </ScrollControls>
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  )
}
