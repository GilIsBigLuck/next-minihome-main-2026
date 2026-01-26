'use client'
import { cva } from 'class-variance-authority'

import { HomeCanvas } from '@/components/pages/home/canvas'
import { useLoading } from '@/contexts/LoadingContext'

const homePageSt = cva('relative w-full h-screen');

const textOverlaySt = cva('absolute inset-0 flex items-center justify-center pointer-events-none');

const textSt = cva('text-4xl font-black transition-colors duration-500');

export default function HomePage() {

  const { isLoading } = useLoading()

  return (
    <div id="homePage" className={homePageSt()}>

      <HomeCanvas isLoaded={!isLoading} />

      {/* 텍스트 오버레이 */}
      <div className={textOverlaySt()}>
        <span
          className={textSt()}
          style={{
            fontFamily: 'Rubik, sans-serif',
            color: isLoading ? '#333' : '#ffffff',
          }}
        >
          mini
        </span>
      </div>

    </div>
  );
}