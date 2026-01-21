'use client'

import { HeroCanvas } from './hero'
import { useLoading } from '@/contexts/LoadingContext'

export default function HeroSection() {
  const { isLoading } = useLoading()

  return (
    <section id="heroSection" className="relative w-full h-screen">
      <HeroCanvas isLoaded={!isLoading} />

      {/* 텍스트 오버레이 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          className="text-4xl font-black transition-colors duration-500"
          style={{
            fontFamily: 'Rubik, sans-serif',
            color: isLoading ? '#000000' : '#ffffff',
          }}
        >
          mini
        </span>
      </div>
    </section>
  )
}
