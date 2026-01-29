'use client'
import { cva } from 'class-variance-authority'

import { HomeCanvas } from '@/components/pages/home/canvas'
import { useLoading } from '@/contexts/LoadingContext'
import { HeroSection, IntroSection, ProjectSection } from '@/components/pages/home/section'

const homePageSt = cva('relative w-full h-screen');

const textOverlaySt = cva('absolute inset-0 z-frontToCanvas flex items-center justify-center pointer-events-none');

const textSt = cva('text-4xl font-black text-white transition-colors duration-500');

export default function HomePage() {

  const { isLoading } = useLoading()

  return (
    <div id="homePage" className={homePageSt()}>

      {/* Canvas */}
      <HomeCanvas isLoaded={!isLoading} />

      {/* Section Wrapper */}
      <div className="section-wrap w-full overflow-hidden">
        <HeroSection />
        <IntroSection />
        {/* <ProjectSection /> */}
      </div>

      {/* 텍스트 오버레이 */}
      <div className={textOverlaySt()}>
        <span
          className={textSt()}
          style={{
            fontFamily: 'Rubik, sans-serif',
            mixBlendMode: 'difference',
          }}
        >
          mini
        </span>
      </div>

    </div>
  );
}